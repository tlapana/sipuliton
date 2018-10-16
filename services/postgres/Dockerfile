FROM postgres:10.4

MAINTAINER s.hayrynen@gmail.com

ENV POSTGRES_USER sipuliton
ENV POSTGRES_PASSWORD sipuliton
ENV POSTGRES_DB sipuliton
ADD sql/01_init_lang_country_city.sql /docker-entrypoint-initdb.d/
ADD sql/02_init_user.sql /docker-entrypoint-initdb.d/
ADD sql/03_init_diet.sql /docker-entrypoint-initdb.d/
ADD sql/04_init_restaurant.sql /docker-entrypoint-initdb.d/
ADD sql/05_init_review.sql /docker-entrypoint-initdb.d/
