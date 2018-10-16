--init user and login related stuff

--user login info
CREATE TABLE user_login(
    user_id bigint,
    cognito_id bigint PRIMARY KEY,
    email varchar(50) NULL UNIQUE
);

--user profile
-- possible roles Admin, Moderator, Owner, Basic user
CREATE TABLE user_profile(
    user_id bigint PRIMARY KEY REFERENCES user_login,
    role int NOT NULL,
    display_name varchar(30) NOT NULL,
    language_id int REFERENCES languages,
	birth_year int,
	birth_month int,
	gender varchar(1),
    description text,
	geo_location point,
	country_id int NULL REFERENCES country,
	city_id bigint NULL REFERENCES city,
    diet_id int
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
