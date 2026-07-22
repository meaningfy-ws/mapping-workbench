# Mapping Workbench (MWB)

> A collaborative platform for mapping XML schemas to OWL ontologies.

Mapping Workbench (MWB) is a collaborative platform designed to map XML
schemas to OWL ontologies, enhancing the efficiency and accuracy of large
semantic mapping projects. It centralises all necessary resources within an
integrated environment, facilitating agile execution of tasks throughout the
mapping development lifecycle.

MWB bridges the gap between conceptual understanding and technical
implementation by involving domain experts early, aligning domain
interpretations with technical requirements and reducing the need for costly
reiterations. It handles the complexities of evolving XML schemas and ensures
high-quality mapping rules through robust validation mechanisms. The platform
supports a collaborative workflow where domain experts and semantic engineers
work closely from the initial stages, with role-based access controls
ensuring effective contribution while maintaining data security.

Learn more at [meaningfy.ws/mapping-workbench](https://meaningfy.ws/mapping-workbench/).

## How it works

MWB follows a four-stage mapping development methodology:

1. **Conceptual Mapping** — concepts in the source data are identified with
   XPath expressions and linked to ontology fragments (SPARQL property paths
   and class paths) that dictate their realisation in graph form.
2. **Technical Mapping** — the conceptual mappings inform the implementation
   of technical mappings, articulated using the [RML](https://rml.io/)
   language.
3. **Validation** — SHACL shapes, SPARQL assertions, and XPath coverage
   calculations measure quality and verify the accuracy, coverage, and
   validity of the mappings.
4. **Dissemination** — the mapping package is released for deployment in
   data transformation pipelines.

This structure gives a clear distinction between conceptual and technical
mappings, automated quality reports, and an integrated environment that
supports agile development — reducing mapping time and cost, cutting errors,
and improving stakeholder satisfaction.

## Roadmap

MWB is evolving into a Software-as-a-Service (SaaS), one-stop collaborative
platform for domain experts and semantic engineers, with planned
enhancements including advanced RML editing capabilities, support for
mapping JSON schemas, and continuous improvements to the user experience.

## Getting started

### Local development setup

Initialize local development environment variables, networking, and start the database (MongoDB):

```
make dev-dotenv-file
make start-traefik
make start-mongo-dev
```

Finally build and start the app:

```
make build-backend-dev 
make build-frontend-dev 
```

### Troubleshooting

Go to https://mongo.mw.dev.localhost (check Traefik monitor for the right URL)
- Get credentials from `.env`
    - `ME_CONFIG_BASICAUTH_PASSWORD`
    - `ME_CONFIG_BASICAUTH_USERNAME`
- Click on database `mapping_workbench`
    - Click on `users` collection (create if not existing)
    - Import or add `New Document`

        ```json
        {
            "email": "admin@mw.com",
            "hashed_password": "$2b$12$W61JFqnRPjAZueI.JpyUYuClbIo0vTyJLryWUWQqdXV4nZDtWuL9W",
            "is_active": true,
            "is_superuser": false,
            "is_verified": true,
            "oauth_accounts": [],
            "settings": {
                "app": {
                    "settings": {
                        "colorPreset": "purple",
                        "contrast": "high",
                        "direction": "ltr",
                        "layout": "vertical",
                        "navColor": "evident",
                        "paletteMode": "light",
                        "responsiveFontSizes": true,
                        "stretch": false
                    }
                },
                "session": {
                    "project": {
                        "$oid": "6506daf5ae66ab7e0d6a87fb"
                    }
                }
            },
            "name": null
        }
        ```

    - Failing that, register a user w/ the app
        - Change `"is_verified"` to `true`

## Citation

If you use Mapping Workbench in your research, please cite one or more of the
following papers:

- E. Costetchi, J. Ahmad, C. I. Nyulas, R. Rahman, D. Prijilevschi, "Mapping
  Workbench: A Collaborative Platform for Mapping Complex XML Data to RDF,"
  in *Joint Proceedings of Posters, Demos, Workshops, and Tutorials of the
  20th International Conference on Semantic Systems (SEMANTiCS 2024)*, CEUR
  Workshop Proceedings, vol. 3759, 2024.
  [PDF](https://ceur-ws.org/Vol-3759/paper23.pdf)
- E. Costetchi, A. Vassiliades, C. I. Nyulas, "A Mapping Lifecycle for Public
  Procurement Data," in *Posters and Demo Track of the 19th International
  Conference on Semantic Systems (SEMANTiCS 2023)*, CEUR Workshop
  Proceedings, vol. 3526, 2023.
  [PDF](https://ceur-ws.org/Vol-3526/paper-02.pdf)
- E. Costetchi, A. Vassiliades, C. I. Nyulas, "Towards a Mapping Framework
  for the Tenders Electronic Daily Standard Forms," in *Proceedings of the
  4th International Workshop on Knowledge Graph Construction (KGC 2023)*,
  CEUR Workshop Proceedings, vol. 3471, 2023.
  [PDF](https://ceur-ws.org/Vol-3471/paper5.pdf)

<details>
<summary>BibTeX</summary>

```bibtex
@inproceedings{costetchi2024mappingworkbench,
  title     = {Mapping Workbench: A Collaborative Platform for Mapping Complex XML Data to RDF},
  author    = {Costetchi, Eugeniu and Ahmad, Jana and Nyulas, Csongor I. and Rahman, Rashif and Prijilevschi, Dumitru},
  booktitle = {Joint Proceedings of Posters, Demos, Workshops, and Tutorials of the 20th International Conference on Semantic Systems (SEMANTiCS 2024)},
  series    = {CEUR Workshop Proceedings},
  volume    = {3759},
  year      = {2024},
  url       = {https://ceur-ws.org/Vol-3759/paper23.pdf}
}

@inproceedings{costetchi2023lifecycle,
  title     = {A Mapping Lifecycle for Public Procurement Data},
  author    = {Costetchi, Eugeniu and Vassiliades, Alexandros and Nyulas, Csongor I.},
  booktitle = {Posters and Demo Track of the 19th International Conference on Semantic Systems (SEMANTiCS 2023)},
  series    = {CEUR Workshop Proceedings},
  volume    = {3526},
  year      = {2023},
  url       = {https://ceur-ws.org/Vol-3526/paper-02.pdf}
}

@inproceedings{costetchi2023mappingframework,
  title     = {Towards a Mapping Framework for the Tenders Electronic Daily Standard Forms},
  author    = {Costetchi, Eugeniu and Vassiliades, Alexandros and Nyulas, Csongor I.},
  booktitle = {Proceedings of the 4th International Workshop on Knowledge Graph Construction (KGC 2023)},
  series    = {CEUR Workshop Proceedings},
  volume    = {3471},
  year      = {2023},
  url       = {https://ceur-ws.org/Vol-3471/paper5.pdf}
}
```

</details>

## License

Mapping Workbench is available under the AGPL-3.0 licence ([LICENSE](LICENSE)).
A commercial licence is also available — see [LICENSE-NOTICE.md](LICENSE-NOTICE.md) for details.

## Contributing

Contributions are welcome — see [CONTRIBUTING.md](CONTRIBUTING.md) and the
[Contributor License Agreement](CLA.md).

## Contact

**hi@meaningfy.ws**
