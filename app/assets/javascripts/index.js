$(document).on('turbolinks:load',function() {
  standardSearch();
  recentReviews();
//Review and modal functionalities
  //Close modal functionality
  $('#close-modal').on("click", function(){
    $('.review-modal').toggle();
    $('.overlay').toggle();
  });

  $('#close-all-reviews').on("click", function(){
    $('.all-reviews-modal').toggle();
    $('.overlay').toggle();
  });

//Modal for seeing all reviews
  $('.movie-display').on('click', '#view-reviews', function(){
    $('.all-reviews-modal').toggle();
    $('.overlay').toggle();
    $('#all-reviews-scroll').html("");
    //Get movie data from value passed in by review button
    var movie_data = $(this).val().split(",");
    var movie_title = movie_data[0];
    var movie_id = movie_data[1];
    $('.all-reviews-title').html("");
    $('.all-reviews-title').append(movie_title);
    //Get reviews by movie Id
     $.ajax({
        url: '/reviews/' + movie_id,
        dataType: "json",
        type: 'GET',
        //Build review html with data from get request and add to reviews
        success: function(data){
          reviewsHTML = "";
          for(var i = 0; i < data.length; i++){
            reviewsHTML+='<p>';
            for(var j = 0; j < data[i].rating; j++){
              reviewsHTML += '<span uk-icon="icon: star; ratio:.5"></span>';
            }
            var email = data[i].email;
            reviewsHTML += " " + data[i].comment;
            reviewsHTML += " -" + email +'</p>';
          }
          $('#all-reviews-scroll').append(reviewsHTML);
        }
      });

  });

  //Review Function
  $('.movie-display').on('click', '#post-review', function () {
    //Set up modal
    $('.review-modal').toggle();
    $('.overlay').toggle();
    $('#review-form')[0].reset();
    //get movie data from button clicked
    movie_data = $(this).val().split(",");
    movie_title = movie_data[0];
    movie_id = movie_data[1];
    $('#review-modal-title').html("");
    $('#review-modal-title').append(movie_title);
  });
  //When submitted
  $('#submit-button').on('click', function(){
    //verify email format
      var email = $("#review-email").val();
      var filter = /^.+@.+/;
      if(!filter.test(email)){
        return;
      }
    //Get values  for post request
      review_email = $('#review-email').val();
      review_comment = $('#comment-box').val();
      review_rating = $("input:radio[name=rating]:checked").val()
    //submit review
      $.ajax({
      type: "POST",
      url: "/reviews",
      data: { review: { email: review_email, rating: review_rating, comment: review_comment, movie_title: movie_title, movie_id: movie_id} },
      success: function(data){
      },
      error: function(data){
      }
    });
  });
/* Search functionalies*/

    //Search by movie
  $('.uk-search-icon-flip').on("click", function(){
    standardSearch();
  });

  $('#title-sort').on("click", function(){
    standardSearch();
  });

  $(document).keypress(function(e) {
    if(e.which == 13) {
      standardSearch();
    }
  });

  //API Calls
  /*I promise I would never leave API keys here, this is a one time exception*/
  
  function standardSearch(){
		var query = $('.uk-search-input').val();
    if (query == ''){
      ourURL = 'https://api.themoviedb.org/3/movie/popular?api_key=9a1d52f31ee8fba01becdd96544e411d&language=en-US&page=1';
    } else {
      ourURL = 'https://api.themoviedb.org/3/search/movie?api_key=9a1d52f31ee8fba01becdd96544e411d&query=' + query +'&page=1';
    }
		$.ajax({
			url: ourURL,
			dataType: "json",
			type: 'GET',
			success: function(data){
        $(".movie-display").html("");
        $.each(data.results, function(index, element) {
          buildCards(index,element);
        });
			}
		});
	};

  $('#genre-sort').on("click",function(){
      var query = $('.uk-search-input').val();
      if (query === ''){
        ourURL = 'https://api.themoviedb.org/3/movie/popular?api_key=9a1d52f31ee8fba01becdd96544e411d&language=en-US&page=1';
      } else {
        ourURL = 'https://api.themoviedb.org/3/search/movie?api_key=9a1d52f31ee8fba01becdd96544e411d&query=' + query +'&page=1';
      }
      $.ajax({
        url: ourURL,
        dataType: "json",
        type: 'GET',
        success: function(data){
          $(".movie-display").html("");
          //sort by genre
          data.results.sort(function(a, b) {
               return a.genre_ids[0] - b.genre_ids[0];
            });
          $.each(data.results, function(index, element) {
            buildCards(index,element);
          });
        }
      });
    });

    $('#release-sort').on("click",function(){
      var query = $('.uk-search-input').val();
      if (query === ''){
        ourURL = 'https://api.themoviedb.org/3/movie/popular?api_key=9a1d52f31ee8fba01becdd96544e411d&language=en-US&page=1';
      } else {
        ourURL = 'https://api.themoviedb.org/3/search/movie?api_key=9a1d52f31ee8fba01becdd96544e411d&query=' + query +'&page=1';
      }
      $.ajax({
        url: ourURL,
        dataType: "json",
        type: 'GET',
        success: function(data){
          $(".movie-display").html("");
          //sort by genre
          data.results.sort(function(a, b) {
               return new Date(b.release_date) - new Date(a.release_date);
            });
          $.each(data.results, function(index, element) {
              buildCards(index, element);
          });
        }
      });
    });
    //Function to build the movie cards
    function buildCards(index, element){
      var rating = element.vote_average / 2;
      starhtml = '';
      for (var i = 0; i < rating; i++){
        starhtml+= '<span uk-icon="icon: star"></span>';
      }
      var reviewsHTML = "";
      $.ajax({
        url: '/reviews/' + element.id,
        dataType: "json",
        type: 'GET',
        success: function(data){
          reviewsHTML = "";
          for(var i = 0; i < 2 && i < data.length; i++){
            reviewsHTML+='<p>';
            for(var j = 0; j < data[i].rating; j++){
              reviewsHTML += '<span uk-icon="icon: star; ratio:.5"></span>';
            }
            var name=data[i].email.split('@')[0];
            reviewsHTML += " " + data[i].comment.substring(0,20);
            if(data[i].comment.length > 20){
              reviewsHTML+="..."
            }
            reviewsHTML += " -" + name.substring(0,10)+'</p>';
          }
          $('#movie-reviews-'+index).append(reviewsHTML);
        }
      });
      if(element.backdrop_path != null){
      $('.movie-display').append(
        '<div class="movie-card">'+
          '<table id="card-content-table">'+
            '<tr>'+
              '<td id="right-content"></td>'+
              '<td id="left-content">'+
                '<img src="http://image.tmdb.org/t/p/w342/'+element.backdrop_path+'">'+
                '<div id="star-rating">'+starhtml+'</div>'+
              '</td>'+
              '<td id="right-content">'+
                '<h3 id="movie-title">'+element.title+'</h3>'+
                '<p id="randg">Release Date: '+element.release_date+'</p>'+
                '<p id="randg">Genre: '+genres[element.genre_ids[0]]+'</p>'+
                '<div id="movie-reviews-'+index+'"></div>'+
                '<button class="uk-button uk-button-primary uk-button-small" id="post-review" value="'+element.title +',' +element.id+'">review</button>'+
                '<button class="uk-button uk-button-danger uk-button-small" id="view-reviews" value="'+element.title +',' +element.id+'">view all</button>'+
              '</td>'+
            '</tr>'+
          '</table>'+
        '</div>'+
        '<br>'  
        );
      }
    }

    function recentReviews(){
      $.ajax({
        url: '/reviews/latest',
        dataType: "json",
        type: 'GET',
        success: function(data){
          console.log(data);
          reviewsHTML = "";
          for(var i = 0; i < 10 && i < data.length; i++){
            reviewsHTML+='<p>';
            for(var j = 0; j < data[i].rating; j++){
              reviewsHTML += '<span uk-icon="icon: star; ratio:.5"></span>';
            }
            var name=data[i].email.split('@')[0];
            reviewsHTML += " " + data[i].comment.substring(0,35);
            if(data[i].comment.length > 20){
              reviewsHTML+="..."
            }
            reviewsHTML += " -" + name.substring(0,10)+'</p>';
            reviewsHTML += '<p id="rr-movie-title">'+data[i].movie_title+'</p>'
          }
          $('#recent-review-display').append(reviewsHTML);
        }
      });
    }

});

//Genres from moviedb
var genres={
  28 : "Action",
  12 : "Adventure",
  16 : "Animation",
  35 : "Comedy",
  80 : "Crime",
  99 : "Documentary",
  18 : "Drama",
  10751 : "Family",
  14 : "Fantasy",
  36 : "History",
  27 : "Horror",
  10402 : "Music",
  9648 : "Mystery",
  10749 : "Romance",
  878 : "Science Fiction",
  10770 : "TV Movie",
  53 : "Thriller",
  10752 : "War",
  37 : "Western"
}