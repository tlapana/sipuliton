
FROM postgres:10.4

MAINTAINER s.hayrynen@gmail.com

RUN apt-get update && apt-get install -y --no-install-recommends \
    postgis postgresql-10-postgis-2.5 postgresql-10-postgis-scripts


ENV POSTGRES_USER sipuliton
ENV POSTGRES_PASSWORD sipuliton
ENV POSTGRES_DB sipuliton
ADD sql/*.sql /docker-entrypoint-initdb.d/
ADD sh/*sh /docker-entrypoint-initdb.d/
