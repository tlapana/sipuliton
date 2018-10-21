--create diet related tables

--food group and its name in some language
CREATE TABLE food_group(
    food_group_id bigint PRIMARY KEY
);

CREATE TABLE food_group_name(
    food_group_id bigint REFERENCES food_group,
    language_id int REFERENCES languages,
    name varchar(40) NOT NULL,
    PRIMARY KEY (food_group_id, language_id)
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
    name varchar(40) NOT NULL,
    PRIMARY KEY (global_diet_id, language_id)
);

--link groups to diets
CREATE TABLE diet_groups(
    global_diet_id bigint REFERENCES global_diet(global_diet_id),
    food_group_id bigint REFERENCES food_group(food_group_id),
    PRIMARY KEY (global_diet_id, food_group_id)
);

--diets for user
CREATE TABLE diet_name(
    user_id bigint REFERENCES user_profile,
    diet_id int,
    global_diet_id bigint NOT NULL REFERENCES global_diet,
    name varchar(40) NOT NULL,
    PRIMARY KEY (user_id, diet_id)
);
