--materialized views (mainly for concatenating reviews)

--restaurant statistics for diet (derived from reviews)
CREATE MATERIALIZED VIEW restaurant_diet_stats
AS
	SELECT review.restaurant_id, global_diet_id,
		COUNT(*) AS reviews, AVG(rating_overall) AS rating_overall,
		AVG(rating_reliability) AS rating_reliability, AVG(rating_variety) AS rating_variety,
		AVG(rating_service_and_quality) AS rating_service_and_quality, AVG(pricing) AS pricing,
		0 AS trending
	FROM review, review_diet
	WHERE status = 1 AND review.review_id = review_diet.review_id
	GROUP BY global_diet_id, review.restaurant_id
WITH NO DATA;

CREATE MATERIALIZED VIEW restaurant_diet_filter
AS
	SELECT up_sub.restaurant_id, up_sub.global_diet_id, downvotes, upvotes
    FROM (SELECT restaurant_id, global_diet_id, count(*) AS upvotes
		FROM diet_vote WHERE up = TRUE
		GROUP BY restaurant_id, global_diet_id) AS up_sub,
		(SELECT restaurant_id, global_diet_id, count(*) AS downvotes
		FROM diet_vote WHERE up = FALSE
		GROUP BY restaurant_id, global_diet_id) AS down_sub
	WHERE up_sub.restaurant_id = down_sub.restaurant_id AND 
		up_sub.global_diet_id = down_sub.global_diet_id
WITH NO DATA;

--full contains relation
CREATE MATERIALIZED VIEW recursive_diets
AS
	WITH RECURSIVE tr(food_group_id, food_group_id2) AS (
		SELECT food_group_groups.food_group_id, food_group_groups.food_group_id2
		FROM food_group_groups
		UNION ALL
		SELECT food_group_groups.food_group_id, tr.food_group_id2
		FROM food_group_groups JOIN tr ON food_group_groups.food_group_id2 = tr.food_group_id
    )
	SELECT diet_groups.global_diet_id, tr.food_group_id2 AS food_group_id
	FROM tr, diet_groups
	WHERE diet_groups.food_group_id = tr.food_group_id
	UNION ALL
	SELECT diet_groups.*
	FROM diet_groups
WITH NO DATA;

--how much 2nd diet covers of first one
CREATE MATERIALIZED VIEW review_weights
AS
	SELECT total.global_diet_id, global_diet_id2, (AVG(matches.groups) / AVG(total.groups)) AS coverage
	FROM (
		SELECT global_diet_id, COUNT(*) AS groups
		FROM diet_groups
		GROUP BY global_diet_id
		) AS total,
		(
		SELECT diet_groups.global_diet_id, diet_groups2.global_diet_id AS global_diet_id2, COUNT(*) AS groups
		FROM diet_groups, diet_groups AS diet_groups2, recursive_diets
		WHERE diet_groups2.global_diet_id = recursive_diets.global_diet_id AND
			diet_groups.food_group_id = recursive_diets.food_group_id
		GROUP BY diet_groups.global_diet_id, diet_groups2.global_diet_id
		) AS matches
	WHERE matches.global_diet_id = total.global_diet_id
	GROUP BY total.global_diet_id, global_diet_id2
	ORDER BY total.global_diet_id ASC, global_diet_id2 ASC
WITH NO DATA;

CREATE MATERIALIZED VIEW weighted_restaurant_diet_stats
AS
	SELECT restaurant_id, global_diet_id,
		reviews,
		rating_overall / coverage_sum / reviews AS rating_overall,
		rating_reliability / coverage_sum / reviews AS rating_reliability,
		rating_variety / coverage_sum / reviews AS rating_variety,
		rating_service_and_quality / coverage_sum / reviews AS rating_service_and_quality,
		pricing / coverage_sum / reviews AS pricing,
		trending / coverage_sum / reviews AS trending
		FROM (
				SELECT restaurant_id, restaurant_diet_stats.global_diet_id, SUM(coverage) AS coverage_sum,
					SUM(reviews) AS reviews,
					SUM(rating_overall * coverage * reviews) AS rating_overall,
					SUM(rating_reliability * coverage * reviews) AS rating_reliability,
					SUM(rating_variety * coverage * reviews) AS rating_variety,
					SUM(rating_service_and_quality * coverage * reviews) AS rating_service_and_quality,
					SUM(pricing * coverage * reviews) AS pricing,
					SUM(trending * coverage * reviews) AS trending
				FROM restaurant_diet_stats, review_weights
				WHERE restaurant_diet_stats.global_diet_id = review_weights.global_diet_id
				GROUP BY restaurant_id, restaurant_diet_stats.global_diet_id
			) AS inner_groups
WITH NO DATA;
