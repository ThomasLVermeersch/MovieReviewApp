require "application_system_test_case"

class ReviewsTest < ApplicationSystemTestCase
  test "creating a review" do
  	post "/reviews(.:format)",
  		params: { review: {email: "Test@gmail.com", rating: "5", comment:"Great Movie", movie:"The Maze Runner", movie_id: "198663"}}
  		assert_response :redirect
  		follow_redirect!
  		assert_response :success
  end

  test "get 10 most recent reviews" do
  	get "/reviews/latest"
  		assert_response :success
  end	

  test "get movie reviews by movie id" do
  	get "/reviews/281338"
  		assert_response :success
  end

end
