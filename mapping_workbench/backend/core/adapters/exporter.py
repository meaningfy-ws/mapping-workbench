from pathlib import Path


class ArchiveExporter:
    @classmethod
    def write_to_file(cls, file_path: Path, file_content: str):
        file_path.write_text(file_content, encoding="utf-8")

    @classmethod
    def create_dir(cls, path: Path):
        path.mkdir(parents=True, exist_ok=True)
