from beanie import PydanticObjectId

from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.test_data_suite.models.entity import TestDataFileResource, TestDataManifestationHistory
from mapping_workbench.backend.triple_map_fragment.models.entity import GenericTripleMapFragment, \
    GenericTripleMapFragmentTransformHistory


async def add_generic_triple_map_fragment_transform_to_history(
        generic_triple_map_fragment: GenericTripleMapFragment,
        project_id: PydanticObjectId
):
    history_item = GenericTripleMapFragmentTransformHistory(
        project=Project.link_from_id(project_id),
        triple_map_id=generic_triple_map_fragment.id,
        test_data_id=generic_triple_map_fragment.latest_transformed_test_data.test_data_id,
        in_manifestation=generic_triple_map_fragment.latest_transformed_test_data.xml_manifestation,
        out_manifestation=generic_triple_map_fragment.latest_transformed_test_data.rdf_manifestation,
        mapping_package_id=generic_triple_map_fragment.latest_transformed_test_data.mapping_package_id,
        use_this_triple_map=generic_triple_map_fragment.latest_transformed_test_data.use_this_triple_map
    )
    await history_item.create()
