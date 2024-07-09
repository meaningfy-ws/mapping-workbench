import pytest

from mapping_workbench.backend.ontology.models.term import Term, TermType
from mapping_workbench.backend.ontology.services.namespaces import get_project_ns_definitions
from mapping_workbench.backend.ontology.services.terms import discover_and_save_terms, create_or_update_terms_by_type
from mapping_workbench.backend.project.models.entity import Project


@pytest.mark.asyncio
async def test_discover_and_save_terms(dummy_project: Project):
    assert len(await Term.find_all().to_list()) == 0

    await discover_and_save_terms(dummy_project.id, None)

    assert len(await Term.find_all().to_list()) > 0

    assert len(await Term.find(Term.type == TermType.CLASS).to_list()) > 0
    assert len(await Term.find(Term.type == TermType.PROPERTY).to_list()) > 0
    assert len(await Term.find(Term.type == TermType.DATA_TYPE).to_list()) > 0

    await Term.delete_all()

    assert len(await Term.find_all().to_list()) == 0


@pytest.mark.asyncio
async def test_create_or_update_terms_by_type(
        dummy_project: Project,
        dummy_property_term: Term,
        dummy_class_term: Term,
        dummy_data_type_term: Term
):
    project_id = dummy_project.id
    dummy_term_list = [dummy_property_term.term, dummy_property_term.term]
    ns_definitions = await get_project_ns_definitions(project_id)

    assert len(await Term.find_all().to_list()) == 0

    await create_or_update_terms_by_type(
        terms=dummy_term_list,
        terms_type=TermType.PROPERTY,
        project_id=project_id,
        ns_definitions=ns_definitions
    )

    assert len(await Term.find_all().to_list()) == 1

    await create_or_update_terms_by_type(
        terms=[dummy_class_term.term],
        terms_type=TermType.CLASS,
        project_id=project_id,
        ns_definitions=ns_definitions
    )

    assert len(await Term.find_all().to_list()) == 2

    updated_class_term = dummy_class_term
    updated_class_term.type = TermType.DATA_TYPE

    await create_or_update_terms_by_type(
        terms=[updated_class_term.term],
        terms_type=TermType.CLASS,
        project_id=project_id,
        ns_definitions=ns_definitions
    )

    assert len(await Term.find_all().to_list()) == 2

    updated_term: Term = await Term.find_one(
        Term.term == dummy_class_term.term
    )

    assert updated_term.type != dummy_class_term.type

    await Term.delete_all()

    assert len(await Term.find_all().to_list()) == 0
