--materialized views (mainly for concatenating reviews

REFRESH MATERIALIZED VIEW restaurant_diet_stats;
REFRESH MATERIALIZED VIEW restaurant_diet_filter;
REFRESH MATERIALIZED VIEW recursive_diets;
REFRESH MATERIALIZED VIEW review_weights;
REFRESH MATERIALIZED VIEW weighted_restaurant_diet_stats;
