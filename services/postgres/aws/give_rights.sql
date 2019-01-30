GRANT SELECT,UPDATE ON ALL TABLES IN SCHEMA public to lambda_user;
GRANT DELETE ON review TO lambda_user;
GRANT DELETE ON review_reject_log TO lambda_user;
GRANT DELETE ON review_from TO lambda_user;
GRANT DELETE ON review_accept_log TO lambda_user;
GRANT DELETE ON thumbs TO lambda_user;