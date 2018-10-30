--init country, languages and city

--language names and codes
CREATE TABLE languages(
    language_id int PRIMARY KEY,
    name varchar(20) NOT NULL UNIQUE,
    iso2 varchar(2) NULL UNIQUE,
    iso3 varchar(3) NULL UNIQUE
);

--country codes and names

CREATE TABLE country(
    country_id int PRIMARY KEY,
    iso2 varchar(2) NULL UNIQUE,
    iso3 varchar(3) NULL UNIQUE
);

CREATE TABLE country_name(
    country_id int REFERENCES country,
    language_id int REFERENCES languages,
    name varchar(50) NOT NULL,
    PRIMARY KEY (country_id, language_id)
);

CREATE TABLE city(
    city_id bigint PRIMARY KEY,
    country_id int REFERENCES country
);

CREATE TABLE city_name(
    city_id bigint REFERENCES city,
    language_id int REFERENCES languages,
    name varchar(80) NOT NULL,
    PRIMARY KEY (city_id, language_id)
);