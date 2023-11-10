import rdflib

from mapping_workbench.backend.file_resource.models.file_resource import FileResource


class SPARQLRunner:
    """
        Runs a SPARQL query against a list of rdf files and return the query results
    """

    def __init__(self, files: [FileResource] = None):
        self.graph = rdflib.Graph()
        self.files = files

    def _load_data_into_graph(self):
        for file in self.files:
            self.graph.parse(data=file.content)

    def query(self, query: str):
        self._load_data_into_graph()
        return self.graph.query(query)
