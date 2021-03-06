# sipuliton

# Services

## Setup/Reset backend services

### OS X and Linux

To setup or reset backend services (PostgreSQL and AWS SAM local API), run.

`bash reset_backend.sh`

Script runs through following steps:
* Creates a Docker network called `sipuliton` if it doesn't exist
* Stops and eletes existing Sipuliton PostgreSQL Docker container, if any
* Builds and launches Sipuliton PostgreSQL Docker container in the background
* Connects Sipuliton PostgreSQL Docker container to `sipuliton`Docker network. The container is visible both on `sipuliton`Docker network and `localhost` in port 5432.
* Launches AWS SAM local API in `sipuliton`Docker network. API is visible in port 3000 in both `sipuliton`Docker network and on `localhost`.

Changes to lambda functions do not require resetting the backend - SAM local API updates Docker container running the lambda function on next request, if lambda function source code has changed.

Changes to database initialization scripts, configs or mock data, require a reset of the backend.


### Depencencies

Dependencies and links are listed in section **Detailed information on services**

* Docker
* Docker Compose
* AWS CLI
* AWS SAM CLI


## Detailed information on services

### PostgresSQL 10.4 (Docker container)

PostgreSQL 10.4 is the most recent version of PostgreSQL, not counting 11 beta, supported by Amazon RDS. This repository contains a Dockerfile for building a Docker container running PostgreSQL 10.4. To build and run containers, install [Docker](https://docs.docker.com/install) and [Docker Compose](https://docs.docker.com/compose/install/) on your computer.

Instructions below are for OS X and Linux, but should work similarly on Windows.

#### Building and running
Build and launch PostgreSQL container by executing following lines in the root folder of this project:
```
docker-compose up --build
```

This command builds containers specified in file `docker-compose.yml`. After building and starting, the container executes SQL commands in file `services/postgres/sql/init_db.sql`.

**Note 1: A built container includes a default database named `sipuliton`. Don't try to create it again in `init_db.sql`.**

**Note 2: If you modify `init_db.sql` and want to recreate container with new initial commands, you need to remove it first by stopping current container and executing command `docker-compose rm postgres` in the root folder of this project.**

**Note 3: Use flag `-d` to launch container as a detached process.**

#### Connecting to database

Docker container binds its port 5432 to port 5432 of localhost. Username, password, and database name are all `sipuliton`.


### AWS Lambdas

#### Setup

Application backend is implemented as AWS Lambda functions. To develop and test lambda functions, you will need to install following tools:

* [Amazon Command-line Interface (AWS CLI)](https://docs.aws.amazon.com/lambda/latest/dg/setup-awscli.html)
* [Serverless Application Model Command-line Interface (SAM CLI)](https://docs.aws.amazon.com/lambda/latest/dg/sam-cli-requirements.html)

#### Running Lambda functions locally

With SAM cli, you can launch AWS Lambda as a local service. Currently there is a template Lambda application created under `services/lambda/sipuliton-backend`. The directory also contains a separate README file created automatically by SAM CLI.

You can test your installation by setting up `hello_world` endpoint.
```bash
cd services/lambda/sipuliton-backend/hello_world
npm install
cd ../

sam local start-api
```

Now you should be able to invoke function `hello_world` by sending a `GET` request to local endpoint `http://localhost:3000/hello`.


You can set up other lambda functions in the same way as `hello_world`. Run `npm install` for all lambda functions and run `sam local start-api`. Currently there is one real endpoint available, `/landing`, which takes a GET request and returns dummy json data.



