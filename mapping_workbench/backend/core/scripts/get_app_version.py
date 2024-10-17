import subprocess


def get_current_app_tag():
    try:
        # Get the tag of the current commit (if any)
        current_tag = subprocess.check_output(
            ["git", "describe", "--exact-match", "--tags"],
            stderr=subprocess.DEVNULL
        ).strip().decode('utf-8')
        return current_tag
    except subprocess.CalledProcessError:
        return None


def get_current_app_branch():
    try:
        return subprocess.check_output(["git", "rev-parse", "--abbrev-ref", "HEAD"]).strip().decode('utf-8')
    except subprocess.CalledProcessError:
        return None


def get_current_app_tag_or_branch():
    tag = get_current_app_tag()
    if tag:
        return tag
    else:
        branch = get_current_app_branch()
        if branch:
            return branch
        else:
            return None


def get_current_app_version():
    return get_current_app_tag_or_branch()


def main():
    return get_current_app_version() or ""


if __name__ == "__main__":
    print(main())
