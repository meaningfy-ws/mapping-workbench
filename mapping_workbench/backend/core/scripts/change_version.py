import subprocess
import re


def get_latest_tag():
    try:
        rev_list_cmd = ['git', 'rev-list', '--tags', '--max-count=1']
        rev_list_output = subprocess.check_output(rev_list_cmd).decode().strip()

        describe_cmd = ['git', 'describe', '--tags', rev_list_output]
        latest_tag = subprocess.check_output(describe_cmd).decode().strip()

        return latest_tag
    except subprocess.CalledProcessError:
        return '0.0.0'


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


def create_git_tag(version):
    tag = f"v{version}"
    subprocess.run(['git', 'tag', '-a', tag, '-m', f"Release {tag}"])
    print(f"Created new tag: {tag}")


def main():
    latest_tag = get_latest_tag()
    print(f"Latest tag: {latest_tag}")

    commits = get_commits_since_last_tag()
    increment = determine_version_bump(commits)
    new_version = increment_version(latest_tag, increment)
    print(f"New version: {new_version}")

    confirm = input("Create new tag? (y/n): ").lower()
    if confirm == 'y':
        create_git_tag(new_version)
    else:
        print("Tag creation cancelled.")


if __name__ == "__main__":
    main()
