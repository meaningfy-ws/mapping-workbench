import pytest
from pydantic import ValidationError

from mapping_workbench.backend.ontology.models.term import Term, TermType

dummy_term = "dummy_term"
dummy_short_term = "dummy_short_term"


def test_term_model():
    with pytest.raises(ValidationError):
        Term()
        Term(short_term=dummy_short_term)
        Term(term=dummy_term,
             short_term=dummy_short_term,
             type=None)

    Term(term=dummy_term)
    Term.model_validate({"term": dummy_term})



def test_term_type():
    assert TermType.list() == [element.value for element in TermType]

    with pytest.raises(ValidationError):
        Term.model_validate({"term": dummy_term, "type": ""})
        Term.model_validate({"term": dummy_term, "type": "random_string"})
        Term.model_validate({"term": dummy_term, "type": None})
        Term.model_validate({"term": dummy_term, "type": 1})

    Term.model_validate({"term": dummy_term, "type": TermType.list()[0]})
    Term.model_validate({"term": dummy_term, "type": TermType(TermType.list()[0])})
