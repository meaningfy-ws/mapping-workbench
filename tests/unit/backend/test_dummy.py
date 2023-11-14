import pytest
from beanie import PydanticObjectId

from mapping_workbench.backend.core.models.dummy_document import DocumentA, DocumentB


@pytest.mark.asyncio
async def test_dummy_object():
    document_b = DocumentB(title="testB")
    document_b = await DocumentB.insert(document_b)
    document_a = DocumentA(title="testA", document_b=document_b)
    document_a = await DocumentA.insert(document_a)
    result_document = await DocumentA.get(document_a.id)
    DocumentB.find(DocumentB.id == result_document.document_b.to_ref().id)
    print(document_b)

