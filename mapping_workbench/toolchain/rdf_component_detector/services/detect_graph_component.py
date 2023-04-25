from pathlib import Path

import networkx as nx
import pandas as pd
import rdflib
from pyvis.network import Network

from mapping_workbench.toolchain.mapping_suite_processor import DEFAULT_TEST_SUITE_REPORT_FOLDER

MAX_STRING_LENGTH_DRAW = 50


def detect_graph_components(file_path: Path) -> None:
    """
        Given a rdf file path (.ttl), detect if notice as graph is connected, else printing connected components without
        the larges one.
    :param file_path: Path to notice file
    """
    graph = rdflib.Graph()
    graph.parse(file_path, format="turtle")

    triples_df = pd.DataFrame(graph.triples(triple=(None, None, None)), columns=["subject", "predicate", "object"])
    so_df = triples_df[["subject", "object"]].drop_duplicates()

    report_name = 'is_not_connected'
    if nx.is_connected(nx.from_pandas_edgelist(so_df, "subject", "object")):
        report_name = 'is_connected'

    network = Network('1000px', '100%', directed=True, notebook=True, cdn_resources="remote",
                      neighborhood_highlight=True, filter_menu=True, select_menu=True)
    for subject in triples_df["subject"].unique():
        network.add_node(str(subject), label=subject)
    for object in triples_df["object"].unique():
        network.add_node(str(object), label=f"{object[:MAX_STRING_LENGTH_DRAW]}..." if len(
            object) > MAX_STRING_LENGTH_DRAW else object)
    for index, row in triples_df.iterrows():
        network.add_edge(str(row["subject"]), str(row["object"]), label=row["predicate"], title=row["predicate"])
    network.show_buttons(filter_=['physics'])

    to_html = network.generate_html()
    with (file_path.parent / DEFAULT_TEST_SUITE_REPORT_FOLDER / f"component_detector_{report_name}.html").open(mode='w',
                                                                                                               encoding='utf-8') as f:
        f.write(to_html)
