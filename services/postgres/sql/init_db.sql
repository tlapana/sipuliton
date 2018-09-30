-- Docker creates database called "sipuliton" automatically.

--init countries and languages


--language names and codes
CREATE TABLE languages(
    language_id serial PRIMARY KEY,
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
    name varchar(40) NOT NULL UNIQUE,
    PRIMARY KEY (country_id, language_id)
);



--create diet related tables


--food and its name in some language
CREATE TABLE food(
    food_id bigint PRIMARY KEY
);

CREATE TABLE food_name(
    food_id bigint REFERENCES food,
    language_id int REFERENCES languages,
    name varchar(30) NOT NULL,
    PRIMARY KEY (food_id, language_id)
);

--food group and its name in some language
CREATE TABLE food_group(
    food_group_id bigint PRIMARY KEY
);

CREATE TABLE food_group_name(
    food_group_id bigint REFERENCES food_group,
    language_id int REFERENCES languages,
    name varchar(30) NOT NULL,
    PRIMARY KEY (food_group_id, language_id)
);

--link foods to groups
CREATE TABLE food_group_foods(
    food_group_id bigint REFERENCES food_group,
    food_id bigint REFERENCES food,
    PRIMARY KEY (food_group_id, food_id)
);

--link group to groups (make subgroups possible)
CREATE TABLE food_group_groups(
    food_group_id bigint REFERENCES food_group,
    food_group_id2 bigint REFERENCES food_group,
    PRIMARY KEY (food_group_id, food_group_id2)
);

--global diet id and name to select presets easily (user generated have preset set to false)
CREATE TABLE global_diet(
    global_diet_id bigint PRIMARY KEY,
    preset boolean NOT NULL
);

CREATE TABLE global_diet_name(
    global_diet_id bigint REFERENCES global_diet,
    language_id int REFERENCES languages,
    name varchar(30) NOT NULL,
    PRIMARY KEY (global_diet_id, language_id)
);

--link groups to diets
CREATE TABLE diet_groups(
    global_diet_id bigint REFERENCES global_diet(global_diet_id),
    food_group_id bigint REFERENCES food_group(food_group_id),
    PRIMARY KEY (global_diet_id, food_group_id)
);

--link singular foods to diets
CREATE TABLE diet_foods(
    global_diet_id bigint REFERENCES global_diet,
    food_id bigint REFERENCES food,
    PRIMARY KEY (global_diet_id, food_id)
);

--diets for user
CREATE TABLE diet_name(
    user_id bigint,
    diet_id int,
    global_diet_id bigint NOT NULL REFERENCES global_diet,
    name varchar(30) NOT NULL,
    PRIMARY KEY (user_id, diet_id)
);



--init user and login related stuff


--user login info
CREATE TABLE user_login(
    user_id bigint PRIMARY KEY,
    name varchar(30) NULL UNIQUE,
    email varchar(40) NULL UNIQUE,
    google_id bigint NULL UNIQUE,
    facebook_id bigint NULL UNIQUE,
    password varchar(512) NULL,
    CHECK ((name IS NOT NULL AND email IS NOT NULL AND password IS NOT NULL)
           OR google_id IS NOT NULL OR facebook_id IS NOT NULL)
);

--user profile
CREATE TABLE user_profile(
    user_id bigint PRIMARY KEY REFERENCES user_login,
    admin boolean NOT NULL,
    moderator boolean NOT NULL,
    owner boolean NOT NULL,
    display_name varchar(30) NOT NULL,
    language_id int REFERENCES languages,
    image bytea,
    description text,
    diet_id int,
    FOREIGN KEY (user_id, diet_id) REFERENCES diet_name
);

--user gamified stats
CREATE TABLE user_stats(
    user_id bigint PRIMARY KEY REFERENCES user_profile,
    countries int NOT NULL,
    reviews int NOT NULL,
    thumbs_up bigint NOT NULL,
    thumbs_down bigint NOT NULL,
    thumbs_up_given int NOT NULL,
    thumbs_down_given int NOT NULL
);

--login attempts by user name
CREATE TABLE login_attempts_name(
    name varchar(30) PRIMARY KEY,
    tries int NOT NULL,
    last_attempt timestamp NOT NULL
);

--login attempts by ip and mac (if available)
CREATE TABLE login_attempts_ip(
    ip inet,
    mac macaddr8,
    tries int NOT NULL,
    last_attempt timestamp NOT NULL,
    PRIMARY KEY (ip, mac)
);

--bans
CREATE TABLE bans(
    user_id bigint PRIMARY KEY REFERENCES user_login,
    started timestamp NOT NULL,
    expires timestamp NOT NULL,
    reason text NOT NULL,
    banner_id bigint NOT NULL
);



--init restaurant related stuff


CREATE TABLE restaurant(
    restaurant_id bigint PRIMARY KEY,
    name varchar(30) NOT NULL,
    email varchar(40),
    image1 bytea,
    image2 bytea,
    country_id int NOT NULL REFERENCES country,
    city varchar(60) NOT NULL,
    postal_code varchar(20) NOT NULL,
    street_address varchar(70) NOT NULL,
    geo_location point NOT NULL
);

CREATE TABLE restaurant_owners(
    restaurant_id bigint REFERENCES restaurant,
    owner_id bigint REFERENCES user_profile,
    PRIMARY KEY (restaurant_id, owner_id)
);

CREATE TABLE open_hours(
    restaurant_id bigint REFERENCES restaurant,
    weekday int,
    opens time NOT NULL,
    closes time NOT NULL,
    PRIMARY KEY (restaurant_id, weekday)
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
    rating_realiability real NOT NULL,
    rating_variety real NOT NULL,
    rating_service_and_quality real NOT NULL,
    pricing real NOT NULL,
    tring real NOT NULL,
    PRIMARY KEY (restaurant_id, global_diet_id)
);


CREATE TABLE restaurant_suggestion(
    suggestion_id bigserial PRIMARY KEY,
    name varchar(30) NOT NULL,
    country_id int NOT NULL REFERENCES country,
    city varchar(60) NOT NULL,
    postal_code varchar(20) NOT NULL,
    street_address varchar(70) NOT NULL,
    geo_location point NOT NULL,
    suggester_id bigint NOT NULL REFERENCES user_profile,
    suggested timestamp NOT NULL
);

CREATE TABLE restaurant_accepted(
    suggestion_id bigint PRIMARY KEY REFERENCES restaurant_suggestion,
    restaurant_id bigint NOT NULL,
    accepter_id bigint NOT NULL REFERENCES user_profile,
    accepted timestamp NOT NULL
);



--init review and related stuff


CREATE TABLE review(
    restaurant_id bigint REFERENCES restaurant,
    user_id bigint REFERENCES user_profile,
    posted timestamp,
    global_diet_id bigint NOT NULL REFERENCES global_diet,
    accepted boolean NOT NULL,
    rejected boolean NOT NULL,
    title varchar(20) NOT NULL,
    free_text text,
    image1 bytea,
    image2 bytea,
    image3 bytea,
    rating_overall real NOT NULL,
    rating_realiability real NOT NULL,
    rating_variety real NOT NULL,
    rating_service_and_quality real NOT NULL,
    pricing real,
    thumbs_up int NOT NULL,
    thumbs_down int NOT NULL,
    PRIMARY KEY (restaurant_id, user_id, posted)
);

CREATE TABLE thumbs(
    restaurant_id bigint,
    poster_id bigint,
    review_posted timestamp,
    thumber_id bigint REFERENCES user_profile,
    up boolean NOT NULL,
    PRIMARY KEY (restaurant_id, poster_id, review_posted, thumber_id),
    FOREIGN KEY (restaurant_id, poster_id, review_posted) REFERENCES review
);

--log review acception/rejection

CREATE TABLE accept_log(
    restaurant_id bigint,
    poster_id bigint,
    review_posted timestamp,
    accepter_id bigint NOT NULL REFERENCES user_profile,
    accepted timestamp NOT NULL,
    PRIMARY KEY (restaurant_id, poster_id, review_posted),
    FOREIGN KEY (restaurant_id, poster_id, review_posted) REFERENCES review
);

CREATE TABLE reject_log(
    restaurant_id bigint,
    poster_id bigint,
    review_posted timestamp,
    rejecter_id bigint NOT NULL REFERENCES user_profile,
    rejected timestamp NOT NULL,
    reason text NOT NULL,
    PRIMARY KEY (restaurant_id, poster_id, review_posted),
    FOREIGN KEY (restaurant_id, poster_id, review_posted) REFERENCES review
);

--everything below is to mark reviews as exceptional/suspicious when needed

CREATE TABLE reject_words(
    word varchar(20) PRIMARY KEY
);

CREATE TABLE review_from(
    restaurant_id bigint,
    user_id bigint,
    posted timestamp,
    ip inet,
    mac macaddr8,
    PRIMARY KEY (restaurant_id, user_id, posted),
    FOREIGN KEY (restaurant_id, user_id, posted) REFERENCES review
);

CREATE TABLE suspicious_ip(
    ip inet,
    mac macaddr8,
    added timestamp NOT NULL,
    expires timestamp NOT NULL,
    PRIMARY KEY (ip, mac)
);

CREATE TABLE suspicious_review(
    restaurant_id bigint,
    user_id bigint,
    posted timestamp,
    reason int,
    PRIMARY KEY (restaurant_id, user_id, posted, reason),
    FOREIGN KEY (restaurant_id, user_id, posted) REFERENCES review
);


