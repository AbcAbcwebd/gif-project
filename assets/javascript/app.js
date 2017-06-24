var topics = ["Tupac", "Jay Z", "Beyonce", "Kanye West", "2 Chainz", "J Cole", "Rhianna", "Drake", "Ed Sheeran", "Taylor Swift", "Justin Bieber", "Justin Timberlake", "Darth Vader"];

function generateButtons(){
	$('#button-holder').empty();
	for (var i = 0; i < topics.length; i++){
		$('#button-holder').append("<button class='topic-buttons' id='" + topics[i] + "'>" + topics[i] + "</button>");
	}
}

var apiKey = "e4abc46fc4cc480fa6bc9fd01ad3061b";
var numberDisplayed = 10;
var play = false;

// These arrays will store image links
var stillImages = [];
var animatedImages = [];

var scrollCount=0;

function turnAnimated(imageIndex){
	$('#display' + imageIndex).attr("src",animatedImages[imageIndex]);
}

function turnStill(imageIndex){
	$('#display' + imageIndex).attr("src",stillImages[imageIndex]);
}

function getStills(searchTerm){

	var queryURL = "http://api.giphy.com/v1/gifs/search?q=" + searchTerm + "&api_key=" + apiKey + "&limit=" + numberDisplayed;

	$.ajax({
	      url: queryURL,
	      method: "GET"
	    }).done(function(info) {
	      for (var x = 0; x < numberDisplayed; x++){
	      	var imageLink = info.data[x].images.fixed_height_still.url;
	      	stillImages.push(imageLink);
	      	var animLink = info.data[x].images.fixed_height.url;
	      	animatedImages.push(animLink);
	      	var imageRating = info.data[x].rating;
	      	$('#image-holder').append("<img class='gif-image' id='display" + x + "' src='" + imageLink + "'><p class='rating'>" + imageRating + "</p>");
	      }

	    $(".gif-image").click(function() {
			var localID = this.id;
			var localIndex = localID.split("y")[1];
			if (play){
				turnStill(localIndex)
				play = false;
			} else {
				turnAnimated(localIndex);
				play = true;
			};
		});
			
		  
	    });
};


$( document ).ready(function() {
//	$( ".topic-buttons" ).click(function() {
	$("#button-holder").on("click", "button.topic-buttons", function(){
		var buttonTerm = this.id;
		$('#image-holder').empty();
		stillImages = [];
		animatedImages = [];
		getStills(buttonTerm);
	});

	$( "#search-button" ).click(function() {
		var newTerm = $('#search-field').val();
		if (newTerm.length > 1){
			topics.push(newTerm);
			generateButtons();	
		};
		$('#search-field').val("");
	});

	window.onscroll = function() {
	        scrollCount++;
	};

});



