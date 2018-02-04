Rails.application.routes.draw do
	get  'reviews/latest/' => 'reviews#latest'
  	resources :reviews
	root 'home#index'

end
