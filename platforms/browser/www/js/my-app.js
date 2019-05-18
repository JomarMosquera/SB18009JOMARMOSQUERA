// Initialize app
var myApp = new Framework7();


// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true
});

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    console.log("Device is ready!");
});


// Now we need to run the code that will be executed only for About page.

// Option 1. Using page callback for page (for "about" page in this case) (recommended way):
myApp.onPageInit('about', function (page) {
    // Do something here for "about" page

})

// Option 2. Using one 'pageInit' event handler for all pages:
$$(document).on('pageInit', function (e) {
    // Get page data from event data
    var page = e.detail.page;

    if (page.name === 'about') {
        // Following code will be executed for page with data-page attribute equal to "about"
        myApp.alert('Here comes About page');
    }
})

// Option 2. Using live 'pageInit' event handlers for each page
$$(document).on('pageInit', '.page[data-page="about"]', function (e) {
    // Following code will be executed for page with data-page attribute equal to "about"
    myApp.alert('Here comes About page');
})


// Code start here -----------


// onError callback
function onError(msg){
    console.log(msg);
}

// This function is going to use the plugin to 
// get the latitude and longitud from the device
function getLocation(){
    // Once the position has been retrieved, an JSON object
    // will be passed into the callback function (in this case geoCallback)
    // If something goes wrong, the onError function is the 
    // one that will be run
    navigator.geolocation.getCurrentPosition(geoCallback, onError);
}


// The callback function must catch the object with the position
function geoCallback(position){

    // Printing the position object to the console
    console.log(position);

    // Extracting the latitude and longitude
    // from the position object
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;

        // Defining a position to display
    var cct = {lat: + lat, lng: + lon};
    
    // Creating the map, centred on the position 
    // defined above
    var myMap = new google.maps.Map(document.getElementById('map'),
        {zoom: 15,
        center: cct });
    
    // Creating a marker to place on the map
    // at the position defined above
    var marker = new google.maps.Marker(
        { position: cct,
        map: myMap });
   
}


// This function is going to be in charge of invoking
// the open cage external API
function openCage(){
    
    // The XMLHttpRequest object, is the one in 
    // charge of handleing the request for us
    var http = new XMLHttpRequest();

    // The url to send the request to. Notice that we're passing
    // here some value of Latituted and longitude for the API 
    // to process
    const url = 'https://api.opencagedata.com/geocode/v1/json?q=53.34592+-6.25881&key=22e5695431c543d682e4d4b52ec743ab';
    // Opening the request. Remember, we will send
    // a "GET" request to the URL define above
    http.open("GET", url);
    // Sending the request
    http.send();

    // Once the request has been processed and we have
    // and answer, we can do something with it
    http.onreadystatechange = (e) => {
        
        // First, I'm extracting the reponse from the 
        // http object in text format
        var response = http.responseText;

        // As we know that answer is a JSON object,
        // we can parse it and handle it as such
        var responseJSON = JSON.parse(response); 
    
        // Printing the result JSON to the console
        console.log(responseJSON);

        // Extracting the individual values, just as we
        // do with any JSON object. Just as we did 
        // with the position.
        // REMEMBER: In this case, we have an array inside 
        // the JSON object.
        var city = responseJSON.results[0].components.city;
        var country = responseJSON.results[0].components.country;
        var currency = responseJSON.results[0].annotations.currency.name;

        // Formattng data to put it on the front end
        var oc = "" + city + " | " + "" + country + " | " + "Currency: " + currency;

        // Placing formatted data on the front ed
        document.getElementById('opencage').innerHTML = oc;
    }
}


var input;
var rate;

function readingInput(){

    input = document.getElementById('input').value;

}

function getRate(){
    

    // The XMLHttpRequest object, is the one in 
    // charge of handleing the request for us
    var http = new XMLHttpRequest();

    // The url to send the request to. Notice that we're passing
    // here some value of Latituted and longitude for the API 
    // to process
    const url = 'http://apilayer.net/api/live?access_key=f02474d2d9d2c138d04fd839e13c5d3e&currencies=EUR&source=USD&format=1';
    // Opening the request. Remember, we will send
    // a "GET" request to the URL define above
    http.open("GET", url);
    // Sending the request
    http.send();

    // Once the request has been processed and we have
    // and answer, we can do something with it
    http.onreadystatechange = (e) => {
        
        // First, I'm extracting the reponse from the 
        // http object in text format
        var response = http.responseText;

        // As we know that answer is a JSON object,
        // we can parse it and handle it as such
        var responseJSON = JSON.parse(response); 
    
        // Printing the result JSON to the console
        console.log(responseJSON);

        rate = responseJSON.quotes.USDEUR;
        
    }
}

// Converting in one direction
function convert(){

    readingInput();
    getRate();
    var result = input * rate;
    document.getElementById('result').innerHTML = "Exchange Value : " + resultt;
}

// Converting in the other direction
function convert2(){

    readingInput();
    getRate();
    var result = input / rate;
    document.getElementById('result').innerHTML = "Exchange Value : " + result;

}


function getWeather() {
    var http = new XMLHttpRequest();
    
    const url = 'http://api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=523de4d46391fa9b1d9d91c2683e16f1';

    http.open("GET", url);

    http.send();

    http.onreadystatechange = (e) => {
        var responseJSON = JSON.parse(response);
        console.log(responseJSON);
        console.log(responseJSON.name);
        console.log(responseJSON.sys.country);
        console.log("Today's Temperature is: " + responseJSON.main.temp);

        cityName = document.getElementById('cityName');
        cityName.innerHTML = responseJSON.name + "/ " + responseJSON.sys.country;
    }
}

function start() {
    getLocation();
    openCage();
}



