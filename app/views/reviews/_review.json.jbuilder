json.extract! review, :id, :email, :date, :rating, :comment, :movie_id, :created_at, :updated_at
json.url review_url(review, format: :json)
