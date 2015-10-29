

//below is an array of Cities that I want to display on the page.
var cities = ["Seattle", "Houston", "Dallas", "Paris"];

function WeatherLoad(el) {
    this.el = el;
    var weatherLoad = this;
     
    /**
    *  below function: gets the AJAX call and 
    */
    this.init = function() {
        $.get('http://api.openweathermap.org/data/2.5/weather?q=seattle&mode=json&units=imperial&APPID=0d6a45bb5e7c356cea7af224cb1966f3').success(weatherLoad.loadMainTemp);
    }
    
    /**
    * below function: takes a Date() object and return a string that outputs the date (ex. 12:45pm)
    */
    this.formatAMPM = function(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }
    
    /**
    * below function: adds the temp of city to page (ex. 75.6). Main initiatiation function.
    */
    this.loadMainTemp = function(weather_data) {
        
        var containerEl = $('#container');
        
        //below: animates number and shows main temp
        containerEl.append($('<div></div>').addClass('text-center animation-text').attr('id','current-temp').text(weather_data.main.temp));
     
        containerEl.append($('<div></div>').addClass('text-center animation-text').attr('id', 'conditions').text(weather_data.weather[0].main));
        containerEl.append($('<div></div>').addClass('text-center animation-text').attr('id', 'high').text("HIGH " +weather_data.main.temp_max));
        containerEl.append($('<div></div>').addClass('text-center animation-text').attr('id', 'low').text("LOW " + weather_data.main.temp_min));
        containerEl.append($('<div></div>').addClass('text-center animation-text').attr('id', 'wind-speed').text("WIND SPEED " + weather_data.wind.speed + " MPH"));
        containerEl.append($('<div></div>').addClass('text-center animation-text').attr('id', 'sunrise').text("SUNRISE "+weatherLoad.formatAMPM(new Date(weather_data.sys.sunrise*1000)) + " PST"));
        containerEl.append($('<div></div>').addClass('text-center animation-text').attr('id', 'sunset').text("SUNSET "+weatherLoad.formatAMPM(new Date(weather_data.sys.sunset*1000)) +" PST"));
        
    }
    
    /**
    * below function: takes a jQuery object and binds animation to it that makes a number go from zero to a certain number.
    */
    this.animateNumbers = function(element) {
        element.each(function () {
            $(element).prop('Counter',0).animate({
                Counter: $(element).text()
            }, {
                duration: 700,
                easing: 'swing',
                step: function (now) {
                    $(element).text(now.toFixed(2));
                }
            });
        });
    }   
} //end of WeatherLoad Closure


//below function appends HTML elements for all the elements in the array 
var make_cities_anchors = function(arr) {
    for (var i=0; i<arr.length; i++) {
        //for each index in the array, make an HTML anchor element with id="[name of city]"
        //also adds hvr-underline-from-left hover effect downloaded from Hover.css
        $('#centeredNav').append($('<li>').append($('<a href="#" class="text-center hvr-underline-from-left" id="'+arr[i]+'"></a>').text(arr[i])));
    }
}

//call make_cities_anchors to make the anchor tags
make_cities_anchors(cities);

var weather = new WeatherLoad();
weather.init();


//this code waits for the click on an 'a' element, then prevents it from reloading the webpage, and it empties out the contents of the page, then alerts the user, then get the API information to fill out based on the 'a' element's id attribute ($(this).attr('id')).
$('a').click(function(event) {
    event.preventDefault();
    $('#container').empty();
    //alert("Weather is currently getting fetched....");
    $.get('http://api.openweathermap.org/data/2.5/weather?q='+$(this).attr('id')+'&mode=json&units=imperial&APPID=0d6a45bb5e7c356cea7af224cb1966f3').success(function(result) { weather.loadMainTemp(result); });
});
