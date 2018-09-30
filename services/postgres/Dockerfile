FROM postgres:10.4

MAINTAINER s.hayrynen@gmail.com

ENV POSTGRES_USER sipuliton
ENV POSTGRES_PASSWORD sipuliton
ENV POSTGRES_DB sipuliton
ADD sql/init_db.sql /docker-entrypoint-initdb.d/
