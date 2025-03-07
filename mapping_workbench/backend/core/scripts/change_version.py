import argparse
import os
import subprocess
import re
import sys

from git import Repo


def get_latest_tag():
    try:
        rev_list_cmd = ['git', 'rev-list', '--tags', '--max-count=1']
        rev_list_output = subprocess.check_output(rev_list_cmd).decode().strip()

        describe_cmd = ['git', 'describe', '--tags', rev_list_output]
        latest_tag = subprocess.check_output(describe_cmd).decode().strip()

        return latest_tag
    except subprocess.CalledProcessError:
        return 'v0.0.0'


def get_commits_since_last_tag():
    try:
        last_tag = get_latest_tag()
        commits = subprocess.check_output(['git', 'log', f'{last_tag}..HEAD', '--pretty=format:%s']).decode().split(
            '\n')
        return commits
    except subprocess.CalledProcessError:
        return []


def determine_version_bump(commits):
    """
    Determine the version bump based on the commit messages.
    SPECS: https://www.conventionalcommits.org/en/v1.0.0/
    :param commits:
    :return:
    """
    bump = 'patch'
    for commit in commits:
        if (
                commit.startswith('feat!:')
                or commit.startswith('fix!:')
                or commit.startswith('refactor!:')
                or 'BREAKING CHANGE' in commit
        ):
            return 'major'
        elif (
                commit.startswith('feat:')
                or commit.startswith('fix:')
                or commit.startswith('refactor:')
        ):
            bump = 'minor'
    return bump


def parse_version(version):
    match = re.match(
        r'v?(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$',
        version)
    if not match:
        raise ValueError(f"Invalid version string: {version}")
    return tuple(map(int, match.group(1, 2, 3)))


def increment_version(version, increment):
    major, minor, patch = parse_version(version)
    if increment == 'major':
        return f"{major + 1}.0.0"
    elif increment == 'minor':
        return f"{major}.{minor + 1}.0"
    elif increment == 'patch':
        return f"{major}.{minor}.{patch + 1}"
    else:
        raise ValueError("Invalid increment type. Use 'major', 'minor', or 'patch'.")


def parse_arguments():
    parser = argparse.ArgumentParser(description="Script description")
    parser.add_argument("--release", type=int, help="Release")
    parser.add_argument("--auto-version", type=int, help="Automatically increment the version")
    return parser.parse_args()

def run_command(command):
    """
    Runs a shell command and prints its output.
    Exits the script if the command fails.
    """
    try:
        result = subprocess.run(command, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        print(result.stdout)
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        print(f"Error: {e.stderr.strip()}")
        sys.exit(1)

def start_gitflow_release(version):
    """
    Automates the creation of a GitFlow release branch.
    """
    # Ensure we are on the latest 'develop' branch
    print("Checking out 'develop' branch...")
    run_command(["git", "checkout", "develop"])

    print("Pulling latest changes from 'develop'...")
    run_command(["git", "pull", "origin", "develop"])

    # Start the release branch
    print(f"Starting GitFlow release for version {version}...")
    run_command(["git", "flow", "release", "start", version])

def get_current_release_version():
    """
    Retrieves the version from the current GitFlow release branch.
    """

    branches = run_command(["git", "branch"]).split("\n")
    for branch in branches:
        branch_name = branch.strip().lstrip("* ").strip()  # Remove leading "* " for current branch
        if branch_name.startswith("release/"):
            # Extract version from 'release/<version>'
            return branch_name.split("/")[-1]
    raise Exception("No active GitFlow release branch found.")


def finish_gitflow_release():
    """
    Automates finishing a GitFlow release.
    """

    version = get_current_release_version()

    # Push the release branch to the remote
    print(f"Publishing the release branch 'release/{version}'...")
    run_command(["git", "flow", "release", "publish", version])

    # Finish the release branch
    print(f"Finishing GitFlow release for version {version}...")
    run_command(["git", "flow", "release", "finish", "-m", f"Release {version}", version])

    # Push changes to 'main' and 'develop', including tags
    print("Pushing changes to 'main' and 'develop' branches...")
    run_command(["git", "push", "origin", "main"])
    run_command(["git", "push", "origin", "develop"])

    print("Pushing tags...")
    run_command(["git", "push", "--tags"])

def generate_changelog(repo_path=".", changelog_file="CHANGELOG.md"):
    """
    Generate or update a changelog file based on Git commits.

    Args:
        repo_path (str): Path to the Git repository (default is current directory).
        changelog_file (str): Path to the changelog file (default is CHANGELOG.md).
    """
    # Open the repository
    repo = Repo(repo_path)
    if repo.bare:
        raise Exception("The specified directory is not a valid Git repository.")

    # Get all commits from the repository
    commits = list(repo.iter_commits("main"))  # Replace "main" with your branch name

    # Group commits by type (e.g., feat, fix, chore) based on Conventional Commits
    changelog_entries = {"feat": [], "fix": [], "chore": [], "docs": [], "refactor": []}
    for commit in commits:
        message = commit.message.strip()
        if ":" in message:
            commit_type, description = message.split(":", 1)
            commit_type = commit_type.strip().lower()
            description = description.strip()
            if commit_type in changelog_entries:
                changelog_entries[commit_type].append(f"- {description} ({commit.hexsha[:7]})")

    # Prepare the changelog content
    changelog_content = "# Changelog\n\n"
    for section, entries in changelog_entries.items():
        if entries:
            changelog_content += f"## {section.capitalize()}\n"
            changelog_content += "\n".join(entries) + "\n\n"

    # Write or append to the changelog file
    if os.path.exists(changelog_file):
        with open(changelog_file, "r") as file:
            existing_content = file.read()
        with open(changelog_file, "w") as file:
            file.write(changelog_content + "\n" + existing_content)
    else:
        with open(changelog_file, "w") as file:
            file.write(changelog_content)

    print(f"Changelog updated: {changelog_file}")

def main():
    latest_tag = get_latest_tag()
    print(f"Latest tag: {latest_tag}")

    args = parse_arguments()

    if args.release:
        finish_gitflow_release()
        return

    if args.auto_version:
        commits = get_commits_since_last_tag()
        increment = determine_version_bump(commits)
    else:
        increment = input("Enter increment type (major/minor/patch): ").lower()

    new_version = increment_version(latest_tag, increment)
    print(f"New version: {new_version}")

    confirm = input(f"Start pre-release [{new_version}]? (y/n): ").lower()
    if confirm == 'y':
        start_gitflow_release(new_version)
        generate_changelog()
    else:
        print("Pre-release cancelled.")


if __name__ == "__main__":
    main()
