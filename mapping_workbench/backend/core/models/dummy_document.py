from typing import Optional

from beanie import Document, Link


class DocumentB(Document):
    title: str

    class Settings:
        name = "document_b"
        validate_on_save = True


class DocumentA(Document):
    title: str
    document_b: Optional[Link[DocumentB]] = None

    class Settings:
        name = "document_a"
        validate_on_save = True
