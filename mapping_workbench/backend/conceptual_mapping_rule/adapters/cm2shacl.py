import re
from collections import defaultdict
from typing import Dict, List

from beanie import PydanticObjectId
from pyshacl import validate
from rdflib import Graph, URIRef, Literal, Namespace, BNode
from rdflib.namespace import RDF, RDFS, XSD, SH

from mapping_workbench.backend.conceptual_mapping_rule.models.entity import ConceptualMappingRule
from mapping_workbench.backend.fields_registry.models.field_registry import StructuralElement
from mapping_workbench.backend.ontology.services.data import get_ontology_resource_map


class CMtoSHACL():
    def __init__(self, project_id: PydanticObjectId, prefixes: Dict[str, str], cm_rules: List[ConceptualMappingRule]):
        if not "dct" in prefixes or not "epo" in prefixes:
            raise Exception("One of required prefixes ['epo', 'dct'] is not defined/provided.")

        self.project_id = project_id
        self.vocab = prefixes
        self.vocab_exceptions = ["at-voc"]
        self.cm_rules = cm_rules

        self.close = True

        self.datatype = get_ontology_resource_map("xmlschema11_2.json")

        self.g = Graph()
        self.g.bind("sh", SH)
        self.g.bind("xsd", XSD)
        self.g.bind("rdfs", RDFS)
        self.g.bind("rdf", RDF)
        self.g.bind("epo", Namespace(self.vocab["epo"]))
        self.g.bind("dct", Namespace(self.vocab["dct"]))

        self.dct_source = Namespace(self.vocab["dct"]).source

        self.identifiers = {}
        self.shacl_in_dict = {}
        self.constraint_dict = {SH["datatype"]: {}, SH["class"]: {}}

    def translate(self):
        # load the data
        self.metadata_info, self.class_path, self.property_path, self.field_xpath, self.controlled_list_c1, self.field_id = self.dL.load()
        self.controlled_list_c1 = self.controlled_list_c1["CL1"]

        # loop through the rules
        num = 0
        for cm_rule in self.cm_rules:
            struct_elem: StructuralElement = cm_rule.source_structural_element
            xpath = cm_rule.source_structural_element.absolute_xpath
        for xpath, class_path, property_path, ID in zip(self.field_xpath, self.class_path, self.property_path,
                                                        self.field_id):
            num += 1
            print(f"Processing Rule {num}...")
            # print(f"C: {class_path}, P: {property_path}")
            if 'FILTER' in property_path or num == 551:  # TODO: to be fixed Lot and FILTER
                continue

            c_list = p_list = []
            if "{" in property_path and "UNION" in property_path:
                property_path = [i.replace("{", "").replace("}", "").strip() for i in property_path.split("UNION")]
                for p in property_path:
                    c_list = self.parse_class_path(class_path, xpath)
                    p_list = self.parse_property_path(p)
            else:
                c_list = self.parse_class_path(class_path, xpath)
                p_list = self.parse_property_path(property_path)

            if len(c_list) != len(p_list):
                print("The length of the rule is not consistent: ", class_path, property_path)
                print("class list: ", c_list)
                print("property list: ", p_list)
            else:
                for index in range(len(c_list) - 1):
                    c = c_list[index]
                    p = p_list[index]
                    if index == len(c_list) - 2:
                        self.add_node_property_shape(c, p, c_list[index + 1], p_list[index + 1], ID, True)
                    else:
                        self.add_node_property_shape(c, p, c_list[index + 1], p_list[index + 1], ID)

        self.g = self.combine_shapes_with_same_path(self.g)

    def add_node_property_shape(self, c, p, next_c, next_p, ID, is_last=False):
        c = URIRef(c)
        p = URIRef(p)
        if c not in self.identifiers:
            self.identifiers[c] = {}
            self.g.add((c, RDF.type, SH.NodeShape))
            self.g.add((c, self.dct_source, Literal(ID)))
            if self.close:
                self.g.add((c, SH.closed, Literal("true", datatype=XSD.boolean)))
            self.g.add((c, SH.target_class, c))
            self.g.add((c, SH["class"], c))
            self.g.add((c, SH["nodeKind"], SH["IRI"]))
        if p not in self.identifiers[c]:
            ps = BNode()
            self.identifiers[c][p] = [ps]
            self.g.add((c, SH.property, ps))
            self.g.add((ps, SH.path, p))
            self.g.add((ps, self.dct_source, Literal(ID)))
        else:
            ps = BNode()
            self.identifiers[c][p].append(ps)
            self.g.add((c, SH.property, ps))
            self.g.add((ps, SH.path, p))
            self.g.add((ps, self.dct_source, Literal(ID)))

        if is_last == False and next_c is not None:
            self.g.add((ps, SH["class"], URIRef(next_c)))
            self.g.add((ps, SH["nodeKind"], SH["IRI"]))
        elif is_last:
            next_c_type = self.check_type(next_c)
            if next_c_type == "class":
                # self.g.add((self.identifiers[c][p], SH["class"], URIRef(next_c)))
                # currentClass = self.constraint_dict[SH["class"]].get(self.identifiers[c][p], [])
                # currentClass.append(URIRef(next_c))
                # self.constraint_dict[SH["class"]][self.identifiers[c][p]] = currentClass
                self.g.add((ps, SH["nodeKind"], SH["IRI"]))
                self.g.add((ps, SH["class"], URIRef(next_c)))
            elif next_c_type == "datatype":
                # self.g.add((self.identifiers[c][p], SH["datatype"], next_c))
                # currentDatatype = self.constraint_dict[SH["datatype"]].get(self.identifiers[c][p], [])
                # currentDatatype.append(next_c)
                # self.constraint_dict[SH["datatype"]][self.identifiers[c][p]] = currentDatatype
                self.g.add((ps, SH["nodeKind"], SH["Literal"]))
                self.g.add((ps, SH["datatype"], next_c))
            elif next_c_type == None:
                self.g.add((ps, SH["nodeKind"], SH["IRI"]))
            if next_p != "?value":
                # self.g.add((self.identifiers[c][p], SH["hasValue"], Literal(next_p)))
                # currentIn = self.shacl_in_dict.get(self.identifiers[c][p], [])
                # currentIn.append(Literal(next_p))
                # self.shacl_in_dict[self.identifiers[c][p]] = currentIn
                bn = BNode()
                self.g.add((ps, SH["in"], bn))
                self.g.add((bn, RDF.first, Literal(next_p)))
                self.g.add((bn, RDF.rest, RDF.nil))
                # TODO to be added nodeKind

    def parse_class_path(self, class_path, xpath):
        class_path_clean = []
        if "<http" not in class_path:
            class_path = class_path.split("/")
        else:
            class_path = self.split_string_preserve_url(class_path)
        for c in class_path:
            if c == "":
                continue
            if "(from CL1)" in c:
                c = c.replace("(from CL1)", "")
                c = self.controlled_class_replace(c.strip(), "CL1", xpath)
                class_path_clean.append(self.word_to_url(c))
            elif "(from CL2)" in c:
                c = c.replace("(from CL2)", "")
                c = self.controlled_class_replace(c.strip(), "CL2", xpath)
                class_path_clean.append(self.word_to_url(c))
            else:
                class_path_clean.append(self.word_to_url(c.strip()))

        # # Check final element is class or datatype
        # if class_path_clean[-1][1] == None:
        #     class_path_clean[-1] = (None, None)
        # else:
        #     t = self.check_type(class_path_clean[-1][1])
        #     class_path_clean[-1] = (SH[t], class_path_clean[-1][1])
        return class_path_clean

    def parse_property_path(self, property_path):
        property_path_clean = []
        if "?this" in property_path:
            property_path = property_path.replace("?this", "").strip()
        else:
            raise Exception("The property path should start with ?this")
        property_path = property_path.strip()
        if property_path[-1] == ".":
            property_path = property_path[:-1]
        if "<http" not in property_path:
            property_path = property_path.split("/")
        else:
            property_path = self.split_string_preserve_url(property_path)
        p = property_path.pop(-1).strip()
        property_path.extend(p.split(" "))
        for p in property_path:
            if p == "":
                continue
            property_path_clean.append(self.word_to_url(p.strip()))

        # # Check final element is variable or constant IRI
        # if property_path_clean[-1][1] == "?value":
        #     pass
        # else:
        #     property_path_clean[-1] = (SH["hasValue"], property_path_clean[-1][1]) # TODO: To be fixed

        return property_path_clean

    def controlled_class_replace(self, c, list_type, xpath):
        class_xpath_fragment = xpath.split("/")[1]
        if list_type == "CL1":
            c = self.controlled_list_c1.get(class_xpath_fragment, c)
        elif list_type == "CL2":
            c = c  # TODO: DOUBLE CHECK CL2 CONTROLLED LIST
        return c

    def word_to_url(self, word):
        if word == "?value" or word == "true" or word == "false":
            return word
        # elif word.startswith("<") and (re.match(r'https?://', word[1:-1]) or re.match(r'http?://', word[1:-1])): #TODO: ASK FOR THIS TYPO
        elif word.startswith("<"):
            return URIRef(word[1:-1])
        elif word == "a":
            return RDF.type

        elif ":" in word:
            word = word.split(":")
            if word[0] in self.vocab:
                return URIRef(self.vocab[word[0]] + word[1])
            elif word[0] in self.vocab_exceptions:
                return None
            else:
                raise Exception(f"Prefix {word[0]} not found in the vocabulary")
        else:
            raise Exception(f"Term {word} is not a URL or a prefix")

    @classmethod
    def check_type(cls, url):
        if url is None:
            return None
        elif str(url).startswith("http://www.w3.org/2001/XMLSchema#"):
            return "datatype"
        elif str(url).startswith("http://www.w3.org/1999/02/22-rdf-syntax-ns#"):
            return "datatype"
        else:
            return "class"

    @classmethod
    def split_string_preserve_url(cls, input_string):
        urls = re.findall(r'<[^>]+>', input_string)

        for i, url in enumerate(urls):
            input_string = input_string.replace(url, f'URL_PLACEHOLDER_{i}')

        parts = input_string.split('/')

        for i, part in enumerate(parts):
            if f'URL_PLACEHOLDER_' in part:
                parts[i] = parts[i].replace(f"URL_PLACEHOLDER_{part.split('_')[-1]}", urls[int(part.split('_')[-1])])

        return parts

    def write_shape_to_file(self, file_name):
        self.g.serialize(destination=file_name, format='turtle')
        # write comments to the beginning of the file
        with open(file_name, 'r') as original: data = original.read()
        with open(file_name, 'w') as modified: modified.write(f"{self.metadata_info}\n" + data)

    def evaluate(self, args):
        # start the translation
        self.translate()

        # validate the SHACL
        shacl_validation = Graph()
        shacl_validation.parse("https://www.w3.org/ns/shacl-shacl")

        r = validate(self.g, shacl_graph=shacl_validation)
        if not r[0]:
            print(r[2])

        if args.output_file:
            self.write_shape_to_file(args.output_file)
        else:
            self.write_shape_to_file(args.cm_file + ".shape.ttl")

    @classmethod
    def combine_shapes_with_same_path(cls, graph):
        """
        Combines property shapes under the same node shape that have the same `sh:path` into a single property shape using `sh:or`.
        """
        print("Combining shapes with the same path")
        # Collect all field identifiers
        dct_source = URIRef("http://purl.org/dc/terms/source")
        dct_source_dict = defaultdict(list)
        for ps in graph.objects(None, SH.property):
            for s, p, o in graph.triples((ps, dct_source, None)):
                sources = dct_source_dict.get(s, [])
                sources.append(o)
                dct_source_dict[s] = sources
                graph.remove((s, p, o))
        for ps in graph.subjects(RDF.type, SH.PropertyShape):
            for s, p, o in graph.triples((ps, dct_source, None)):
                sources = dct_source_dict.get(s, [])
                sources.append(o)
                dct_source_dict[s] = sources
                graph.remove((s, p, o))

        node_shapes = graph.subjects(RDF.type, SH.NodeShape)

        for ns in node_shapes:
            path_dict = defaultdict(list)
            current_temp_dict = {}
            # Collect property shapes under the same node shape by `sh:path` and "a sh:PropertyShape"
            for ps in graph.objects(ns, SH.property):
                path = graph.value(ps, SH.path)
                temp_dict = {}
                for s, p, o in graph.triples((ps, None, None)):
                    temp_dict[p] = o
                if path:
                    key = [k for k, v in current_temp_dict.items() if v == temp_dict]
                    if key == []:
                        path_dict[path].append(ps)
                        current_temp_dict[ps] = temp_dict
                        for dct_source_id in dct_source_dict[ps]:
                            graph.add((ps, dct_source, dct_source_id))
                    else:
                        graph = cls.remove_subgraph(ps, graph)
                        for dct_source_id in dct_source_dict[ps]:
                            graph.add((key[0], dct_source, dct_source_id))

            for ps in graph.subjects(RDF.type, SH.PropertyShape):
                path = graph.value(ps, SH.path)
                temp_dict = {}
                for s, p, o in graph.triples((ps, None, None)):
                    temp_dict[p] = o
                if path:
                    key = [k for k, v in current_temp_dict.items() if v == temp_dict]
                    if key == []:
                        path_dict[path].append(ps)
                        current_temp_dict[ps] = temp_dict
                        for dct_source_id in dct_source_dict[ps]:
                            graph.add((ps, dct_source, dct_source_id))
                    else:
                        graph = cls.remove_subgraph(ps, graph)
                        for dct_source_id in dct_source_dict[ps]:
                            graph.add((key[0], dct_source, dct_source_id))
            if path_dict:
                graph = cls.add_shacl_or(ns, path_dict, graph)
                for _, property_shapes in path_dict.items():
                    for ps in property_shapes:
                        for dct_source_id in dct_source_dict[ps]:
                            graph.add((ps, dct_source, dct_source_id))
        return graph

    @classmethod
    def remove_subgraph(cls, ps, graph):
        """
        Remove duplicate property shapes
        """
        for s, p, o in graph.triples((ps, None, None)):
            graph.remove((s, p, o))
        for s, p, o in graph.triples((None, None, ps)):
            graph.remove((s, p, o))
        return graph

    @classmethod
    def add_shacl_or(cls, ns, path_dict, g):
        for path, property_shapes in path_dict.items():
            if len(property_shapes) == 1:
                continue
            bn = BNode()
            g.add((ns, SH["or"], bn))
            for i in property_shapes[:-1]:
                g.remove((ns, SH.property, i))
                bn_prop = BNode()
                g.add((bn, RDF.first, bn_prop))
                g.add((bn_prop, SH.property, i))

                nextBn = BNode()
                g.add((bn, RDF.rest, nextBn))
                bn = nextBn
            g.remove((ns, SH.property, property_shapes[-1]))
            bn_prop = BNode()
            g.add((bn, RDF.first, bn_prop))
            g.add((bn_prop, SH.property, property_shapes[-1]))

            g.add((bn, RDF.rest, RDF.nil))
        return g
