FROM docker.io/python:3.10-slim-buster

ARG ENVIRONMENT
ARG PORT

ENV PORT=$PORT

RUN apt update && apt install -y make wget git default-jre

# Create an application directory
RUN mkdir -p /app

# Set the /app directory as the working directory for any command that follows
WORKDIR /app

COPY ./mapping_workbench/backend ./mapping_workbench/backend
COPY ./requirements.txt ./
COPY ./Makefile ./
COPY ./.env ./

RUN make install-backend

EXPOSE ${PORT}

ENTRYPOINT uvicorn mapping_workbench.backend.core.entrypoints.api.main:app --proxy-headers --reload --host 0.0.0.0 --port ${PORT}
