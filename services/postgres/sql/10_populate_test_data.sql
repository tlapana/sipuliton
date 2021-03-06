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

INSERT INTO user_login(cognito_sub, username, email) VALUES
    ('c10cb9bc-7401-47fe-ac81-e13d394a0189', 'TestUser1', 'eelis.mikkola@student.tut.fi'),
    ('Test-user-2', 'Admin', 'admin@sipuliton.fi'),
    ('Test-user-3', 'Troller', 'sum1@here.com'),
    ('get from cognito', 'Restaurant owner', 'asd@asd.com'),
    ('cog5', 'user', 'das@asd.com'),
    ('test-user-1', 'Sipuliton mod', 'test@mail.com'),
    ('1cbd9888-a5b9-4334-85aa-a4a761f992be', 'TestUser4', 'eelis.mikkola@tuni.fi');

INSERT INTO user_profile(user_id, role, display_name, image_url, language_id, birth_year, birth_month, gender, description, country_id, city_id, diet_id) VALUES
    ('1', '3', 'TestUser1', 'https://vignette.wikia.nocookie.net/blogclan-2/images/b/b9/Random-image-15.jpg/revision/latest?cb=20160706220047', '0', '2000', NULL, 'M', 'dunno what to write', NULL, NULL, '1'),
    ('2', '0', 'Admin', NULL, '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
    ('3', '3', 'Basic user', NULL, '0', '2000', '8', 'M', NULL, '1000', '100000', '0'),
    ('4', '2', 'Restaurant owner', NULL, '0', NULL, NULL, 'F', 'A happy owner of restaurant', NULL, NULL, NULL),
    ('5', '3', 'Basic user2', NULL, '0', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
    ('6', '1', 'Sipuliton test', 'https://vignette.wikia.nocookie.net/blogclan-2/images/b/b9/Random-image-15.jpg/revision/latest?cb=20160706220047', '0', '2000', NULL, 'M', 'dunno what to write', NULL, NULL, '1'),
    ('7', '3', 'TestUser4', NULL, '0', NULL, NULL, NULL, NULL, NULL, NULL, NULL);

INSERT INTO user_stats(user_id, countries, cities, reviews, thumbs_up, thumbs_down, thumbs_up_given, thumbs_down_given, activity_level, last_active) VALUES
    ('1', '4', '12', '15', '32', '5', '8', '0', '8', '2018-06-12 19:10:25-07 '),
    ('2', '1', '2', '4', '5', '6', '7', '8', '3', '2018-09-22 6:30:25-07 '),
    ('3', '1', '1', '10', '3', '20', '5', '100', '4', '2018-06-12 19:10:25-07 '),
    ('4', '0', '0', '0', '0', '0', '0', '0', '0', '2017-02-28 1:11:30-01'),
    ('5', '0', '0', '0', '0', '0', '0', '0', '0', '2018-09-22 6:30:25-07 ');

INSERT INTO bans(user_id, started, expires, reason, banner_id) VALUES
    ('3', '2018-06-12 19:10:25-07 ', '2018-12-24 23:59:59-07 ', 'cuz we need test data', '1');

INSERT INTO ban_log(user_id, started, expired, reason, banner_id) VALUES
    ('1', '2017-06-12 19:10:25-07 ', '2017-6-24 23:59:59-07 ', 'cuz we need test data', '1');

INSERT INTO diet_name(user_id, diet_id, global_diet_id, name) VALUES
    ('3', '0', '2', 'ei kalaa'),
    ('1', '0', '7', 'veg.'),
    ('1', '1', '2', 'no fish');

INSERT INTO restaurant(restaurant_id, name, email, website, image_url, country_id, city_id, postal_code, street_address, latitude, longitude) VALUES
    ('1', 'Testiravintola1', 'ravintola1@mail.com', 'www.sivusto.fi', NULL, '0', '0', '33200', 'Osoite1', '61.49911', '23.78712'),
    ('2', 'Testiravintola2', 'ravintola2@mail.com', 'www.sivusto.fi', NULL, '1', '1', '33201', 'Osoite2', '61.499', '23.787'),
    ('3', 'Testiravintola3', 'ravintola3@mail.com', NULL, NULL, '2', '2', '33202', 'Osoite3', '1', '3'),
    ('4', 'Testiravintola4', NULL, NULL, NULL, '3', '3', '33203', 'Osoite4', '1', '4');

INSERT INTO open_hours(restaurant_id, opens_mon, closes_mon, opens_tue, closes_tue, opens_wed, closes_wed, opens_thu, closes_thu, opens_fri, closes_fri, opens_sat, closes_sat, opens_sun, closes_sun) VALUES
    ('1', '9:00', '18:00', '9:00', '18:00', '9:00', '18:00', '9:00', '18:00', '9:00', '22:00', '12:00', '16:00', '12:00', '18:00'),
    ('2', '9:00', '18:00', '9:00', '18:00', '9:00', '18:00', '9:00', '18:00', '9:00', '22:00', '12:00', '16:00', NULL, NULL);

INSERT INTO restaurant_owners(restaurant_id, owner_id) VALUES
    ('3', '4');

INSERT INTO review(restaurant_id, user_id, posted, status, title, image_url, free_text, rating_overall, rating_reliability, rating_variety, rating_service_and_quality, pricing, thumbs_up, thumbs_down) VALUES
    ('1', '1', '2018-09-22 6:30:25-07', '0', 'asd', NULL, NULL, '5', '5', '5', '5', '3', '0', '0'),
    ('1', '1', '2018-11-1 10:23:54', '1', 'Hyvä ravintola', NULL, 'Vapaata arvostelutekstiä', '4', '4', '4', '4', '4', '100', '50'),
    ('1', '2', '2018-11-1 10:23:54', '1', 'Hyvä ravintola 2', NULL, 'Vapaata arvostelutekstiä', '1', '1', '1', '1', '1', '100', '500');

INSERT INTO review_diet(review_id, global_diet_id) VALUES
    ('1', '1'),
    ('1', '2');

UPDATE restaurant SET geo_location = ST_POINT(latitude, longitude);
