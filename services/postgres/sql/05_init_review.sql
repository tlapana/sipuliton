--init review and related stuff

--possible status: posted, accepted, rejected
CREATE TABLE review(
    review_id bigserial PRIMARY KEY,
    restaurant_id bigint REFERENCES restaurant,
    user_id bigint REFERENCES user_profile,
    posted timestamp,
    status int NOT NULL,
    title varchar(20) NOT NULL,
	image_url text,
    free_text text,
    rating_overall real NOT NULL,
    rating_reliability real NOT NULL,
    rating_variety real NOT NULL,
    rating_service_and_quality real NOT NULL,
    pricing real,
    thumbs_up int NOT NULL,
    thumbs_down int NOT NULL
);

CREATE TABLE review_diet(
    review_id bigint REFERENCES review,
    global_diet_id bigint NOT NULL REFERENCES global_diet,
    PRIMARY KEY (review_id, global_diet_id)
);

CREATE TABLE thumbs(
    review_id bigint REFERENCES review,
    thumber_id bigint REFERENCES user_profile,
    up boolean NOT NULL,
    PRIMARY KEY (review_id, thumber_id)
);

CREATE TABLE diet_vote(
    restaurant_id bigint REFERENCES restaurant,
	global_diet_id bigint NOT NULL REFERENCES global_diet,
    user_id bigint REFERENCES user_profile,
    up boolean NOT NULL,
    PRIMARY KEY (restaurant_id, global_diet_id, user_id)
);

--log review acception/rejection

CREATE TABLE review_accept_log(
    review_id bigint REFERENCES review PRIMARY KEY REFERENCES review,
    accepter_id bigint NOT NULL REFERENCES user_profile,
    accepted timestamp NOT NULL
);

CREATE TABLE review_reject_log(
    review_id bigint REFERENCES review PRIMARY KEY REFERENCES review,
    rejecter_id bigint NOT NULL REFERENCES user_profile,
    rejected timestamp NOT NULL,
    reason text NOT NULL
);

--everything below is to mark reviews as exceptional/suspicious when needed

CREATE TABLE reject_words(
    language_id int REFERENCES languages,
    word varchar(20) PRIMARY KEY
);

CREATE TABLE review_from(
    review_id bigint REFERENCES review PRIMARY KEY REFERENCES review,
    ip inet,
    mac macaddr8
);

CREATE TABLE suspicious_ip(
    ip inet,
    mac macaddr8,
    added timestamp NOT NULL,
    expires timestamp NOT NULL,
    PRIMARY KEY (ip, mac)
);

CREATE TABLE suspicious_review(
    review_id bigint REFERENCES review PRIMARY KEY REFERENCES review,
    reason int
);
