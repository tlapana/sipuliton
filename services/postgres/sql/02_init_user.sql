--init user and login related stuff

--user login info
CREATE TABLE user_login(
    user_id bigint PRIMARY KEY,
    cognito_sub text,
	username varchar(30),
    email varchar(50) NULL UNIQUE
);

--user profile
-- possible roles Admin, Moderator, Owner, Basic user
CREATE TABLE user_profile(
    user_id bigint PRIMARY KEY REFERENCES user_login,
    role int NOT NULL,
    display_name varchar(30) NOT NULL,
    language_id int REFERENCES languages,
	birth_year int NULL,
	birth_month int NULL,
	gender varchar(1),
    description text,
	country_id int NULL REFERENCES country,
	city_id bigint NULL REFERENCES city,
    diet_id int
);

--user gamified stats
CREATE TABLE user_stats(
    user_id bigint PRIMARY KEY REFERENCES user_profile,
    countries int NOT NULL,
    cities int NOT NULL,
    reviews int NOT NULL,
    thumbs_up bigint NOT NULL,
    thumbs_down bigint NOT NULL,
    thumbs_up_given int NOT NULL,
    thumbs_down_given int NOT NULL,
	activity_level int NOT NULL,
	last_active timestamp
);

--bans
CREATE TABLE bans(
    user_id bigint PRIMARY KEY REFERENCES user_login,
    started timestamp NOT NULL,
    expires timestamp NOT NULL,
    reason text NOT NULL,
    banner_id bigint NOT NULL
);

CREATE TABLE ban_log(
    user_id bigint REFERENCES user_login,
    started timestamp NOT NULL,
    expired timestamp NOT NULL,
    reason text NOT NULL,
    banner_id bigint NOT NULL,
	PRIMARY KEY (user_id, started)
);
