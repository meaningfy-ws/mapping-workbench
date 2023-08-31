# ==== CONFIGURE =====
# Use a Node 18 base image
FROM node:18-alpine

ARG ENV_FILE
ARG ENVIRONMENT
ARG HOST
ARG PORT
ARG NODE_ENV
ARG NODE_PATH
ARG API_ADDRESS
ARG API_BASE_URL

RUN apk add make

# Create an application directory
RUN mkdir -p /app

# Set the /app directory as the working directory for any command that follows
WORKDIR /app

COPY Makefile ./

# Copy the local app package and package-lock.json file to the container
COPY package*.json ./

# Copy local directories to the working directory of our docker image (/app)
COPY ./src ./src
COPY ./public ./public
COPY next.config.js ./

RUN echo "NODE_ENV=${NODE_ENV}" > ${ENV_FILE} \
    && echo "PORT=${PORT}" >> ${ENV_FILE} \
    && echo "NODE_PATH=${NODE_PATH}" >> ${ENV_FILE} \
    && echo "API_ADDRESS=${API_ADDRESS}" >> ${ENV_FILE} \
    && echo "API_BASE_URL=${API_BASE_URL}" >> ${ENV_FILE}

RUN make install-${ENVIRONMENT}-frontend

EXPOSE ${PORT}

CMD make start-${ENVIRONMENT}-frontend
