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

// These variables help power scroll funtionality. 
var scrollCount=0;
var width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
var height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
var leftPositionArray = [];
var movementDirection = [];
var localWidth = 350;

function turnAnimated(imageIndex){
	$('#display' + imageIndex).attr("src",animatedImages[imageIndex]);
}

function turnStill(imageIndex){
	$('#display' + imageIndex).attr("src",stillImages[imageIndex]);
}

// This sets up images when a button is clicked. 
function getStills(searchTerm){

	var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + searchTerm + "&api_key=" + apiKey + "&limit=" + numberDisplayed;

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
	      	$('#image-holder').append("<div id='cont" + x +"'><img class='gif-image' id='display" + x + "' src='" + imageLink + "'><p class='rating'>" + imageRating + "</p></div>");
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
		setTimeout(positionGIFs, 500);
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
	    updatePositioning();
	};

});

// This places the GIFs in a staggered pattern on the page, based on screen width.
function positionGIFs(){
	var toMove = "Right";
	var leftPosition;
	for (var z = 0; z < numberDisplayed; z++){
		var localContainer = document.getElementById('cont' + z); 
		if (z === 0){
			leftPosition = (width/2) - (localWidth*2);
		};

		// Calculates new image positioning as well as direction for future movement.
		var localHeight = localContainer.clientHeight;
		if (toMove === "Right" && leftPosition < (width - (2 * localWidth))){
			leftPosition = leftPosition + localWidth;
		} else if (toMove === "Right"){
			toMove = "Left";
			leftPosition = leftPosition - localWidth;
		} else if (toMove === "Left" && leftPosition > localWidth) {
			leftPosition = leftPosition - localWidth;
		} else if (toMove === "Left") {
			toMove = "Right";
			leftPosition = leftPosition + localWidth;
		};

		// Ensure GIFs don't fall off page (Redundancy. Could eventually be removed to boost performance.)
		if (leftPosition < 0){
			leftPosition = leftPosition + Math.abs(leftPosition);
		} else if (leftPosition > width - localWidth) {
			leftPosition = width - localWidth;
		};
		

		leftPositionArray.push(leftPosition);

		// This helps keep track of which direction the gif will move in. 
		movementDirection.push(toMove);

		document.getElementById('cont' + z).style.position = "relative";
		document.getElementById('cont' + z).style.left = leftPosition + "px";
	}
}

// Updates position of images. Executed when user sccrolls. 
function updatePositioning() {
	for (var a = 0; a < numberDisplayed; a++){
		var localContainer = document.getElementById('cont' + a); 
		var newLeftPosition;

		if (movementDirection[a] === "Right"){
			if (leftPositionArray[a] < width - localWidth){
				newLeftPosition = leftPositionArray[a] + (width / 180);
			} else {
				movementDirection[a] = "Left";
				newLeftPosition = leftPositionArray[a] - (width / 180);
			}

		} else if (movementDirection[a] === "Left"){
			if (leftPositionArray[a] > 0){
				newLeftPosition = leftPositionArray[a] - (width / 180);
			} else {
				movementDirection[a] = "Right";
				newLeftPosition = leftPositionArray[a] + (width / 180);
			}
		};

		leftPositionArray[a] = newLeftPosition;
		document.getElementById('cont' + a).style.left = newLeftPosition + "px";

	};
}

