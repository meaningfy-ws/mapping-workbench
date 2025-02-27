import subprocess
import re

def get_latest_tag():
    try:
        return subprocess.check_output(['git', 'describe', '--tags', '--abbrev=0']).decode().strip()
    except subprocess.CalledProcessError:
        return '0.0.0'

def parse_version(version):
    match = re.match(r'v?(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$', version)
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

    increment = input("Enter increment type (major/minor/patch): ").lower()
    new_version = increment_version(latest_tag, increment)
    print(f"New version: {new_version}")

    confirm = input("Create new tag? (y/n): ").lower()
    if confirm == 'y':
        create_git_tag(new_version)
    else:
        print("Tag creation cancelled.")

if __name__ == "__main__":
    main()
