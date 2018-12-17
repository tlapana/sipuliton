--init restaurant related stuff

CREATE TABLE restaurant(
    restaurant_id bigserial PRIMARY KEY,
    name varchar(30) NOT NULL,
    email varchar(50),
    website varchar(50),
	image_url text,
    country_id int NOT NULL REFERENCES country,
    city_id bigint NOT NULL REFERENCES city,
    postal_code varchar(20) NOT NULL,
    street_address varchar(70) NOT NULL,
    latitude float,
    longitude float,
    geo_location geography
);

CREATE TABLE open_hours(
    restaurant_id bigint REFERENCES restaurant,
    opens_mon time, 
    closes_mon time,
    opens_tue time, 
    closes_tue time,
    opens_wed time, 
    closes_wed time,
    opens_thu time, 
    closes_thu time,
    opens_fri time, 
    closes_fri time,
    opens_sat time, 
    closes_sat time,
    opens_sun time, 
    closes_sun time,
    PRIMARY KEY (restaurant_id)
);

CREATE TABLE open_hours_exceptions(
    restaurant_id bigint PRIMARY KEY REFERENCES restaurant,
    free_text text
);

CREATE TABLE restaurant_description(
    restaurant_id bigint REFERENCES restaurant,
    language_id int REFERENCES languages,
    free_text text,
    PRIMARY KEY (restaurant_id, language_id)
);

--restaurant statistics for diet (derived from reviews)
CREATE TABLE restaurant_diet_stats(
    restaurant_id bigint REFERENCES restaurant,
    global_diet_id bigint REFERENCES global_diet,
    reviews int NOT NULL,
    rating_overall real NOT NULL,
    rating_reliability real NOT NULL,
    rating_variety real NOT NULL,
    rating_service_and_quality real NOT NULL,
    pricing real NOT NULL,
    trending real NOT NULL,
    PRIMARY KEY (restaurant_id, global_diet_id)
);

--restaurant suggestion and log
--status: posted, accepted rejected
CREATE TABLE restaurant_suggestion(
    suggestion_id bigserial PRIMARY KEY,
    name varchar(30) NOT NULL,
    email varchar(50),
    website varchar(50),
	image_url text,
    status int NOT NULL,
    country_id int NOT NULL REFERENCES country,
    city varchar(60) NOT NULL,
    postal_code varchar(20),
    street_address varchar(70) NOT NULL,
    geo_location geography,
    suggester_id bigint NOT NULL REFERENCES user_profile,
    suggested timestamp NOT NULL
);

--text field "edit" describes if some changes were done to request
CREATE TABLE restaurant_accepted(
    suggestion_id bigint PRIMARY KEY REFERENCES restaurant_suggestion,
    restaurant_id bigint NOT NULL REFERENCES restaurant,
    accepter_id bigint NOT NULL REFERENCES user_profile,
    accepted timestamp NOT NULL,
    edit text
);

CREATE TABLE restaurant_rejected(
    suggestion_id bigint PRIMARY KEY REFERENCES restaurant_suggestion,
    rejecter_id bigint NOT NULL REFERENCES user_profile,
    rejected timestamp NOT NULL,
    reason text NOT NULL
);

--restaurant ownership, requests and log

CREATE TABLE restaurant_owners(
    restaurant_id bigint REFERENCES restaurant,
    owner_id bigint REFERENCES user_profile,
    PRIMARY KEY (restaurant_id, owner_id)
);

--status: posted, accepted rejected
CREATE TABLE restaurant_ownership_request(
    request_id bigserial PRIMARY KEY,
    restaurant_id bigint REFERENCES restaurant,
    owner_id bigint REFERENCES user_profile,
    requested timestamp NOT NULL,
    free_text text
);

CREATE TABLE restaurant_ownership_accepted(
    request_id bigint PRIMARY KEY,
    restaurant_id bigint REFERENCES restaurant,
    owner_id bigint REFERENCES user_profile,
    accepter_id bigint NOT NULL REFERENCES user_profile,
    accepted timestamp NOT NULL
);

CREATE TABLE restaurant_ownership_rejected(
    request_id bigint PRIMARY KEY,
    restaurant_id bigint REFERENCES restaurant,
    owner_id bigint REFERENCES user_profile,
    rejected timestamp NOT NULL,
    rejecter_id bigint NOT NULL REFERENCES user_profile,
    reason text NOT NULL
);