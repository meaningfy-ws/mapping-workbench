import re

import requests


class GithubManager:
    def __init__(self, github_repository_url: str):
        self.repo_url = github_repository_url

    @classmethod
    def validate_github_url(cls, url):
        if not url:
            return False
        pattern = r'^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)?$'
        return re.match(pattern, url) is not None

    def extract_owner_repo(self):
        pattern = r"https://github\.com/([^/]+)/([^/]+)"
        match = re.match(pattern, self.repo_url)
        if match:
            return match.group(1), match.group(2)
        return None, None

    def get_repo_tags(self):
        owner, repo = self.extract_owner_repo()
        tags = []
        page = 1
        per_page = 100

        while True:
            url = f"https://api.github.com/repos/{owner}/{repo}/tags?page={page}&per_page={per_page}"
            response = requests.get(url)

            if response.status_code != 200:
                print(f"Failed to fetch tags. Status code: {response.status_code}")
                break

            page_tags = response.json()
            if not page_tags:
                break

            tags.extend(page_tags)
            page += 1

        return [tag['name'] for tag in tags]
