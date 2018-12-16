--init review and related stuff

--restaurant statistics for diet (derived from reviews)
CREATE MATERIALIZED VIEW restaurant_diet_stats
AS
	SELECT review.restaurant_id, global_diet_id,
		COUNT(*) AS reviews, AVG(rating_overall) AS rating_overall,
		AVG(rating_reliability) AS rating_reliability, AVG(rating_variety) AS rating_variety,
		AVG(rating_service_and_quality) AS rating_service_and_quality, AVG(pricing) AS pricing,
		0 AS trending
	FROM review, review_diet
	WHERE status = 1 AND review.restaurant_id = review_diet.restaurant_id AND 
		review.user_id = review_diet.user_id AND posted = review_posted
	GROUP BY global_diet_id, review.restaurant_id
WITH NO DATA;

--how much 2nd diet covers of first one
CREATE MATERIALIZED VIEW review_weights
AS
	SELECT total.global_diet_id, global_diet_id2, (AVG(matches.groups) / AVG(total.groups)) AS coverage
	FROM (SELECT global_diet_id, COUNT(*) AS groups FROM diet_groups GROUP BY global_diet_id) AS total,
	(SELECT diet_groups.global_diet_id, diet_groups2.global_diet_id AS global_diet_id2, COUNT(*) AS groups
	FROM diet_groups, diet_groups AS diet_groups2
	WHERE diet_groups.food_group_id = diet_groups2.food_group_id
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
