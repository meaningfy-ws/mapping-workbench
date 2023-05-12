FROM docker.io/python:3.10-slim-buster

ARG ENVIRONMENT
ARG HOST
ARG PORT

EXPOSE ${PORT}

RUN apt update && apt install -y make

# Create an application directory
RUN mkdir -p /app

# Set the /app directory as the working directory for any command that follows
WORKDIR /app

COPY ./mapping_workbench/backend ./mapping_workbench/backend
COPY ./requirements.backend.txt ./
COPY ./Makefile ./

RUN make install-backend

ENTRYPOINT uvicorn --host ${HOST} --port ${PORT} mapping_workbench.backend.core.entrypoints.api.main:app --reload
