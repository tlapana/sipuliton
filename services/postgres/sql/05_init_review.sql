--init review and related stuff

--possible status: posted, accepted, rejected
CREATE TABLE review(
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
    thumbs_down int NOT NULL,
    accepted BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (restaurant_id, user_id, posted)
);

CREATE TABLE review_diet(
    restaurant_id bigint REFERENCES restaurant,
    user_id bigint REFERENCES user_profile,
    review_posted timestamp,
    global_diet_id bigint NOT NULL REFERENCES global_diet,
    PRIMARY KEY (restaurant_id, user_id, review_posted, global_diet_id),
    FOREIGN KEY (restaurant_id, user_id, review_posted) REFERENCES review
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

CREATE TABLE review_accept_log(
    restaurant_id bigint,
    poster_id bigint,
    review_posted timestamp,
    accepter_id bigint NOT NULL REFERENCES user_profile,
    accepted timestamp NOT NULL,
    PRIMARY KEY (restaurant_id, poster_id, review_posted),
    FOREIGN KEY (restaurant_id, poster_id, review_posted) REFERENCES review
);

CREATE TABLE review_reject_log(
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
    language_id int REFERENCES languages,
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
