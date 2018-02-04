class ReviewsController < ApplicationController
  skip_before_action :verify_authenticity_token

  def index
    @reviews = Review.all
    @review = Review.new
  end
  def new
    @reviews = Review.new
  end

  def create
   @review = Review.create(review_params)
  
  end

  def show
    @review = Review.where(movie_id: params[:id])
    render json: @review.to_json()
  end

  def destroy
   @review = Review.destroy(params[:id])
  end

  def latest
    @review = Review.last(10).reverse
    render json: @review.to_json()
  end

  private
    def review_params
      params.require(:review).permit(:email, :rating, :comment, :movie_title, :movie_id)
    end
end
