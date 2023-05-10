FROM docker.io/python:3.10-slim-buster
EXPOSE 8000
EXPOSE 3000

RUN apt update && apt install -y make nodejs npm

## working in the /usr/src/mapping_workbench/app
WORKDIR /usr/src/mapping_workbench
COPY mapping_workbench app
COPY requirements.backend.txt .
COPY Makefile .

RUN make install-backend

ENTRYPOINT uvicorn --host 0.0.0.0 --port 8000 mapping_workbench.core.entrypoints.api.main:app --reload
