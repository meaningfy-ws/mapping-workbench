import argparse
import os
import re
import subprocess
import sys
from datetime import datetime


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
    parser.add_argument("--readme", type=int, help="README")
    parser.add_argument("--release", type=int, help="Release")
    parser.add_argument("--cancel", type=int, help="Cancel")
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


def cancel_gitflow_release():
    """
    Cancels the current GitFlow release by deleting the release branch locally and remotely.
    """
    print("Fetching current GitFlow release branch...")

    # List all branches and find the active release branch
    branches = run_command(["git", "branch"]).split("\n")
    release_branch = None
    for branch in branches:
        branch_name = branch.strip().lstrip("* ").strip()  # Remove leading "* " for current branch
        if branch_name.startswith("release/"):
            release_branch = branch_name
            break

    if not release_branch:
        raise Exception("No active GitFlow release branch found.")

    print(f"Found release branch: {release_branch}")

    # Check for uncommitted changes in the working directory
    status = run_command(["git", "status", "--porcelain"])
    if status:
        raise Exception(
            "There are uncommitted changes in the working directory. Commit or stash them before proceeding.")

    # Optionally merge changes back into develop (if needed)
    print(f"Merging changes from {release_branch} back into 'develop'...")
    run_command(["git", "checkout", "develop"])
    run_command(["git", "merge", "--no-ff", release_branch])

    # Delete the release branch locally
    print(f"Deleting local release branch '{release_branch}'...")
    run_command(["git", "branch", "-D", release_branch])

    # Delete the release branch remotely
    print(f"Deleting remote release branch '{release_branch}'...")
    run_command(["git", "push", "origin", f":{release_branch}"])

    print(f"Release branch '{release_branch}' has been canceled successfully.")


def group_commits_by_type(commits):
    """
    Groups commits by their types based on Conventional Commits.
    """
    grouped_commits = {
        "feat!": [],
        "feat": [],
        "fix!": [],
        "fix": [],
        "docs": [],
        "style": [],
        "refactor!": [],
        "refactor": [],
        "perf": [],
        "test": [],
        "chore": [],
        "other": []
    }

    for commit in commits:
        message = commit.strip()
        # parts = commit.split(" ", 1)  # Split into hash and message
        # if len(parts) < 2:
        #     continue
        # _, message = parts
        # Parse the type from the message
        if ":" in message:
            commit_type, description = message.split(":", 1)
            commit_type = commit_type.strip().lower()
            description = description.strip()
            if commit_type in grouped_commits:
                grouped_commits[commit_type].append(f"- {description} ({commit})")
            else:
                grouped_commits["other"].append(f"- {message} ({commit})")
        else:
            grouped_commits["other"].append(f"- {message} ({commit})")

    return grouped_commits


def generate_changelog(version, changelog_file="CHANGELOG.md"):
    """
    Updates the changelog with new entries for the specified version.

    Args:
        version (str): The version to be released (e.g., "v1.0.0").
        changelog_file (str): Path to the changelog file (default is CHANGELOG.md).
    """
    # Get commits since the last tag
    commits = get_commits_since_last_tag()
    if not commits or commits == [""]:
        print("No new commits found for this release.")
        return

    # Group commits by type
    grouped_commits = group_commits_by_type(commits)

    # Prepare new changelog content
    release_date = datetime.now().strftime("%Y-%m-%d")
    new_changelog_content = f"## [{version}] - {release_date}\n\n"

    for section, entries in grouped_commits.items():
        if entries:
            new_changelog_content += f"### {section.capitalize()}\n"
            new_changelog_content += "\n".join(entries) + "\n\n"

    # Read existing changelog content (if it exists)
    existing_content = ""
    if os.path.exists(changelog_file):
        with open(changelog_file, "r") as file:
            existing_content = file.read()

    # Write updated changelog content
    with open(changelog_file, "w") as file:
        file.write(new_changelog_content + existing_content)

    print(f"Changelog updated successfully in {changelog_file}.")


def main():
    latest_tag = get_latest_tag()
    print(f"Latest tag: {latest_tag}")

    args = parse_arguments()

    if args.cancel:
        cancel_gitflow_release()
        return

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

    if args.readme:
        generate_changelog(new_version)
        return

    confirm = input(f"Start pre-release [{new_version}]? (y/n): ").lower()
    if confirm == 'y':
        start_gitflow_release(new_version)
        generate_changelog(new_version)
    else:
        print("Pre-release cancelled.")


if __name__ == "__main__":
    main()
