--this file is generated from csv files in moc_data folder

INSERT INTO country VALUES
    ('1000', 'II', 'IIM');

INSERT INTO country_name VALUES
    ('1000', '0', 'kuvitteellinen maa'),
    ('1000', '1', 'imaginary country');

INSERT INTO city(city_id, country_id) VALUES
    ('100000', '1000');

INSERT INTO city_name VALUES
    ('100000', '0', 'kuvitteellinen kaupunki'),
    ('100000', '1', 'imaginary city');

INSERT INTO user_login(user_id, cognito_sub, username, email) VALUES
    ('0', 'test-user-1', 'Sipuliton mod', 'test@mail.com'),
    ('1', 'Test-user-2', 'Admin', 'admin@sipuliton.fi'),
    ('2', 'Test-user-3', 'Troller', 'sum1@here.com'),
    ('3', 'get from cognito', 'Restaurant owner', 'asd@asd.com'),
    ('4', 'cog5', 'user', NULL);

INSERT INTO user_profile(user_id, role, display_name, language_id, birth_year, birth_month, gender, description, country_id, city_id, diet_id) VALUES
    ('0', '1', 'Sipuliton test', '0', '2000', NULL, 'M', 'dunno what to write', NULL, NULL, '2'),
    ('1', '0', 'Admin', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
    ('2', '3', 'Basic user', '0', '2000', '8', 'M', NULL, '1000', '100000', '1'),
    ('3', '2', 'Restaurant owner', '0', NULL, NULL, '-0', 'A happy owner of restaurant', NULL, NULL, NULL),
    ('4', '3', 'Basic user2', '0', NULL, NULL, NULL, NULL, NULL, NULL, NULL);

INSERT INTO user_stats(user_id, countries, cities, reviews, thumbs_up, thumbs_down, thumbs_up_given, thumbs_down_given, activity_level, last_active) VALUES
    ('0', '4', '12', '15', '32', '5', '8', '0', '8', '2018-06-12 19:10:25-07 '),
    ('1', '1', '2', '4', '5', '6', '7', '8', '3', '2018-09-22 6:30:25-07 '),
    ('2', '1', '1', '10', '3', '20', '5', '100', '4', '2018-06-12 19:10:25-07 '),
    ('3', '0', '0', '0', '0', '0', '0', '0', '0', '2017-02-28 1:11:30-01'),
    ('4', '0', '0', '0', '0', '0', '0', '0', '0', '2018-09-22 6:30:25-07 ');

INSERT INTO bans(user_id, started, expires, reason, banner_id) VALUES
    ('2', '2018-06-12 19:10:25-07 ', '2018-12-24 23:59:59-07 ', 'cuz we need test data', '1');

INSERT INTO ban_log(user_id, started, expired, reason, banner_id) VALUES
    ('0', '2017-06-12 19:10:25-07 ', '2017-6-24 23:59:59-07 ', 'cuz we need test data', '1');

INSERT INTO diet_name(user_id, diet_id, global_diet_id, name) VALUES
    ('2', '0', '1', 'ei kalaa'),
    ('0', '0', '6', 'veg.'),
    ('0', '1', '1', 'no fish');

INSERT INTO restaurant(restaurant_id, name, email, website, country_id, city_id, postal_code, street_address, geo_location) VALUES
    ('0', 'Testiravintola1', 'ravintola1@mail.com', 'www.sivusto.fi', '0', '0', '33200', 'Osoite1', '(1,1)'),
    ('1', 'Testiravintola2', 'ravintola2@mail.com', 'www.sivusto.fi', '1', '1', '33201', 'Osoite2', '(1,2)'),
    ('2', 'Testiravintola3', 'ravintola3@mail.com', NULL, '2', '2', '33202', 'Osoite3', '(1,3)'),
    ('3', 'Testiravintola4', NULL, NULL, '3', '3', '33203', 'Osoite4', '(1,4)');

INSERT INTO restaurant_diet_stats(restaurant_id, global_diet_id, reviews, rating_overall, rating_realiability, rating_variety, rating_service_and_quality, pricing, trending) VALUES
    ('0', '0', '0', '4', '3', '4', '3', '3', '40'),
    ('1', '0', '0', '5', '5', '5', '5', '5', '50'),
    ('2', '0', '0', '1', '1', '1', '1', '1', '-10'),
    ('3', '0', '0', '1.5', '4.1', '1', '3.33', '2', '40');

INSERT INTO restaurant_owners(restaurant_id, owner_id) VALUES
    ('3', '3');

