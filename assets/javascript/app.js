var topics = ["Jay Z", "Beyonnce", "Kanye West", "2 Chainz", "J Cole", "Rhianna", "Drake", "Ed Sheeran", "Taylor Swift", "Justin Beiber", "Justin Timberlak", "Darth Vader"];

function generateButtons(){
	console.log("Function running");
	for (var i = 0; i < topics.length; i++){
		console.log(topics[i]);
		$('#button-holder').append("<button class='topic-buttons' id='" + topics[i] + "'>" + topics[i] + "</button>");
	}
}

var apiKey = "e4abc46fc4cc480fa6bc9fd01ad3061b";
var numberDisplayed = 10;


function getStills(searchTerm){

	var queryURL = "http://api.giphy.com/v1/gifs/search?q=" + searchTerm + "&api_key=" + apiKey + "&limit=" + numberDisplayed;

	$.ajax({
	      url: queryURL,
	      method: "GET"
	    }).done(function(info) {
	      console.log(info);
	      for (var x = 0; x <= numberDisplayed; x++){
	      	var imageLink = info.data[x].images.fixed_height_still.url;
	      	$('#image-holder').append("<img src='" + imageLink + "'>");

	      }
	    });
};

$( ".topic-buttons" ).click(function() {
  
});