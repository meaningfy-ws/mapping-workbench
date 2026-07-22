from beanie import PydanticObjectId

from mapping_workbench.backend.core.services.exceptions import ResourceNotFoundException
from mapping_workbench.backend.core.services.request import api_entity_is_found
from mapping_workbench.backend.package_validator.models.sparql_validation import SPARQLQueryResult, \
    SPARQLQueryTestDataEntry
from mapping_workbench.backend.package_validator.models.validation_comments import ValidationComment


def add_summary_result_test_data(test_datas, test_data) -> bool:
    if not any(d.test_data_oid == test_data.test_data_oid for d in test_datas):
        test_datas.append(test_data)
        return True
    return False

def add_summary_sparql_result_test_data(test_datas, result: SPARQLQueryResult) -> bool:
    test_data: SPARQLQueryTestDataEntry = result.test_data
    if not any(d.test_data_oid == test_data.test_data_oid for d in test_datas):
        test_data.fields_covered = result.fields_covered
        #TODO: see if found xpaths results are needed for summaries
        test_datas.append(test_data)
        return True
    return False

async def get_validation_comment(id: PydanticObjectId) -> ValidationComment:
    comment: ValidationComment = await ValidationComment.get(id)
    if not api_entity_is_found(comment):
        raise ResourceNotFoundException()
    return comment

async def delete_validation_comment(
        comment: ValidationComment
):
    return await comment.delete()