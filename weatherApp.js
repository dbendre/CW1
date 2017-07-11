/*

function Model() {
}

Model.prototype.update = function (jsonData) {
    this.wind = jsonData.query.results.channel.wind
    this.condition = jsonData.query.results.channel.item.condition
    this.forecast = jsonData.query.results.channel.item.forecast
}

function View() {
}

View.prototype.setToday = function (wind, condition, day) {
    var today = document.getElementById("day0")
    var windDiv = today.getElementsByClassName("speed")[0]
    windDiv.textContent = wind.speed
    
    var currentTemp = document.getElementById("currentTemp")
    currentTemp.textContent = condition.temp
    
    var hi = today.getElementsByClassName("hi")[0]
    hi.textContent = day.high
    
    var low = today.getElementsByClassName("low")[0]
    low.textContent = day.low
    
    var type = document.getElementById("todayType");
    type.textContent = condition.text
    
    var date = today.getElementsByClassName("date")[0]
    var dateString = changeToMyDate(day.date)
    date.textContent = dateString
    
    var assetString = getImageAsset(condition.text)
    var image = today.getElementsByClassName("icon")[0]
    image.src = assetString
}

View.prototype.setForecast = function (forecast) {
        for(var i = 1; i < 7; i++) {
            var f = forecast[i]
            var day = document.getElementById("day"+i)
            
            var hi = day.getElementsByClassName("hi")[0]
            hi.textContent = f.high
            
            var low = day.getElementsByClassName("low")[0]
            low.textContent = f.low
            
            var type = day.getElementsByClassName("type")[0];
            type.textContent = f.text
            
            var date = day.getElementsByClassName("date")[0]
            var dateString = changeToMyDate(f.date)
            date.textContent = dateString
            
            var image = day.getElementsByClassName("icon")[0]
            var assetString = getImageAsset(f.text)
            image.src = assetString
        
            var theDay = day.getElementsByClassName("week")[0]
            var week = changeToMyDay(f.day)
            theDay.textContent = week
        }
}

View.prototype.updateCity = function (name) {
    var p = document.getElementById("cityHolder");
    p.textContent = name
}

function Control(model, view) {
    this.model = model
    this.view = view
}

Control.prototype.callbackFunction = function(jsonData) {
    console.log(jsonData)
    this.model.update(jsonData)
    // insert the data into the website
    this.view.setToday(this.model.wind, this.model.condition, this.model.forecast[0])
    // insert data into the otherDays
    this.view.setForecast(this.model.forecast)
}

Control.prototype.woeidHandler = function(jsonData) {
    // did it find it? 
    if (jsonData.query.results == null) {
        var woeid = "not found";
        var name = "not found";
    } // was it unique? 
    else {
        if (jsonData.query.results.place[0] == undefined) {
            place = jsonData.query.results.place;
        } // multiple ones - pick the first one
        else {
            place = jsonData.query.results.place[0];
        }
        var woeid = place.woeid;
        var name = place.name+", "+
            place.admin1.content
            
        if(place.country.content != "United States")
            name += ", " + place.country.content
    } 

    this.view.updateCity(name)
    
    makeRequest("https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid="+woeid+"&format=json&callback=theControl.callbackFunction")
}

Control.prototype.searchSubmit = function() {
    console.log("press")
    var theString = document.getElementById("searchBar").value
    var queryString = "https://query.yahooapis.com/v1/public/yql?q=select woeid,name,admin1,country  from   geo.places where text='"+theString+"' & format=json & callback=theControl.woeidHandler"
    makeRequest(queryString)
}

function searchDown(event) {
    if (event.keyCode == 13) {
        document.getElementById('submitButton').click()
    }        
}

var months = { "Jan":"January" , "Feb" : "February", "Mar" : "March",
                "Apr" : "April", "May" : "May", "Jun" : "June", 
                "Jul" : "July", "Aug" : "August", "Sep" : "September", 
                "Oct" : "October", "Nov" : "November", "Dec" : "December"}
                
var days = { "Sun" : "Sunday", "Mon" : "Monday", "Tue" : "Tuesday", "Wed" : "Wednesday", 
            "Thu" : "Thursday", "Fri" : "Friday", "Sat" : "Saturday"}

function changeToMyDay(string) {
    return days[string]
}
            
function changeToMyDate(string) {
    fields = string.split(" ")
    month = months[fields[1]]
    day = fields[0]
    return month+" "+day
}

function getImageAsset(text) {
    text = text.toLowerCase()
    console.log(text)
    if(text == "cloudy")
        return "assets/cloudy.svg"
    else if(text.includes("cloudy"))
        return "assets/partlyCloudy.svg"
    else if(text.includes("rain"))
        return "assets/rainy.svg"
    else if(text.includes("snow"))
        return "assets/snowy.svg"
    else if(text.includes("storm"))
        return "assets/stormy.svg"
    else if(text.includes("sunny"))
        return "assets/sunny.svg"
    else if(text.includes("wind") || text == "breezy")
        return "assets/windy.svg"
    else
        return "assets/sunny.svg"
}

function makeRequest(query) {
    var holder = document.getElementById("requester")
    holder.removeChild(holder.firstChild)
    var s = document.createElement("script")
    s.src = query
    
    holder.appendChild(s);
}

document.getElementById("searchBar").addEventListener("keydown", searchDown)
theControl = new Control(new Model(), new View())

*/





var zipCode; // get input typed by user 
var firstEntry = true;
var code, date, day, high, low, text, city, region, windSpeed, humidity, tempFar, tempCel; // weather data

var dayArray = new Array(7); // create array for 7 days

//create weather data object
function Day(code, date, day, high, low, text, windSpeed, humidity) {
    this.code = code;
    this.date = date;
    this.day = day; 
    this.high = high;
    this.low = low; 
    this.text = text;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
}

function getZip() {
    var script = document.createElement("script");
    zipCode = document.getElementById("userInput").value;
//    var zipCode = getInput;
    
//    var res = getInput.split(", ");
//    var city = res[0];
//    var state = res[1];
//    
    console.log(zipCode);

    script.setAttribute("src", "https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text = '"+zipCode+", United States')&format=json&callback=callbackFunction");
    document.head.appendChild(script);
} // getZip()


function callbackFunction(JSONdata) {
    var weather = JSONdata; 
    console.log(weather);
    
    //get all the data
    tempFar = weather.query.results.channel.item.condition.temp; // fahrenheit temp
    tempCel = FarToCel(tempCel); // temp in celsius
    city = weather.query.results.channel.location.city;
    region = weather.query.results.channel.location.region;
    windSpeed = weather.query.results.channel.wind.speed;
    humidity = weather.query.results.channel.atmosphere.humidity;
    
    for (var i = 0; i < 7; i++) {
        code = weather.query.results.channel.item.forecast[i].code;
        date = weather.query.results.channel.item.forecast[i].date;
        day = weather.query.results.channel.item.forecast[i].day;
        high = weather.query.results.channel.item.forecast[i].high;
        low = weather.query.results.channel.item.forecast[i].low;
        text = weather.query.results.channel.item.forecast[i].text;
 
         dayArray[i] = new Day(code, date, day, high, low, text, windSpeed, humidity);
        
        if (i != 0) {
            windSpeed = 'N/A';
            humidity = 'N/A';
        }
    }
    console.log(dayArray[4]);
    
    DisplayLeftColumn(city, region, tempFar, tempCel);
} //callbackFunction() for JSON data

function FarToCel(tempFar) {
    tempCel = Math.ceil((tempFar-32)*(5/9));
    return tempCel;
} // FarToCel() convert temperature to Celsius

function DisplayLeftColumn(city, region, tempFar, tempCel) {
    var location = city + ", " + region;
    console.log("location: " + location); ////
    var farhenheit = "Farhenheit";
    var celsius = "Celsius";
    
    var leftColParent = document.getElementById("Current");
    var taglineNode = document.getElementById("Tagline");
    var paraNode = document.createElement("p");
    var locationText = document.createTextNode(location);
    paraNode.appendChild(locationText);
    paraNode.setAttribute("id", "locationInfo");
    var paraNode2 = paraNode;

    if (firstEntry) {
        leftColParent.removeChild(taglineNode);
        leftColParent.appendChild(paraNode);
        firstEntry = false;
    } else {
        while (leftColParent.firstChild) {
            if (leftColParent.firstChild != document.getElementById("currText")) {
                leftColParent.removeChild(leftColParent.firstChild);
            }   
        }
        leftColParent.appendChild(paraNode);
        
    }
//    console.log("location Text = " + locationText);
//    var tagLineNode = document.getElementById("Tagline");
//    var locationParagraph = document.createElement("p"); 
//    var locationNode = document.createTextNode(location);
//    locationParagraph.appendChild(locationNode);
//    locationParagraph.setAttribute("id", "locationInfo");
//    var leftColParent = document.getElementById("Current");
    
//    if (firstEntry) {
//        firstEntry = false;
//        leftColParent.replaceChild(locationParagraph, tagLineNode);
//    } else {
//        leftColParent.replaceChild(locationParagraph, locationParagraph);
//    }
    //remove old element, add new location element
    
    
    
}

//var weather, city, state, temp, far, forecast, humidity, weather, rain, zipCode, zipCode1;
//
//var text; //sunny, rainy, etc
//var int; // number to make day function for 7 day forecast 
//
//var makeWrapper;
//
//var removeButton = document.getElementById("buttongo");
//var removeInput = document.getElementById("zipcode");
//var bool = true;
//var bool2 = true;
//var bool3 = true;
//var bool4 = true;
//var dummyBool = false;
//var dummyBool2 = false;
//var objBool = true;
//
//function getZip() {
//    var script = document.createElement("script");
//    
//    if (bool == true) {
//        zipCode = document.getElementById("zipcode").value;
//        bool = false;
//        objBool = true;
//    }
//    else {
//        zipCode = document.getElementById("editInput").value;
//        objBool = true;
//    }
//        script.src = "https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text='"+zipCode+", United States')&format=json&callback=callbackFunction";
//        document.body.appendChild(script);    
//}
//
////get the info from yahoo  api
//function callbackFunction(JSONdata) {
//    console.log(JSONdata);
//    weather = JSONdata;
//    
//    city = weather.query.results.channel.location.city;
//    state = weather.query.results.channel.location.region;
//    temp = weather.query.results.channel.item.condition.temp;
//    far =
//weather.query.results.channel.units.temperature;
//    
//    var humidity = weather.query.results.channel.atmosphere.humidity;
//    var windSpeed = weather.query.results.channel.wind.speed;
//    
//    //need these separate
//    
//    //get general object for one day
//    forecast = weather.query.results.channel.item.forecast; //can access forecast array depending on day later
//    
//    displayData(city, state, temp, far, forecast); //display for left side
//    makeWrapper = document.createElement("div");
//    makeWrapper.id = "wrapperDiv";
//    document.getElementById("right_col").appendChild(makeWrapper);
//    
//     if (dummyBool2 == true) {
//         var updateWeeklyWeather = document.getElementById("wrapperDiv");
//         document.getElementById("right_col").removeChild(updateWeeklyWeather);
//    }
//    dummyBool2 = true;
//    
//    for(var i = 0; i < 10; i++) {
//        getWeek(i, humidity, windSpeed); //make 1 new weather object        
//    }// outputs weather data for all days  
//}
//
//
//function removeData() {
//    
//    var remAskID = document.getElementById("askID");
//    var remZipCity = document.getElementById("zipcity");
//    document.getElementById("left_col").removeChild(remAskID);
//    document.getElementById("left_col").removeChild(remZipCity);
//    
//
//    document.getElementById("right_col").removeChild(removeButton);
//    document.getElementById("right_col").removeChild(removeInput);
//} //clear contents of left column, i.e move text box to the wrighte
//
//
//
//function displayData(city, state, temp, far, forecast) {
//    if (bool2 == true) {
//        removeData();
//        bool2 = false;
//    }
//    
//    var node = document.createElement("p");
//    node.id = "new_Node";
//    var breaknode = document.createElement("br");
//    var breaknode2 = document.createElement("br");
//    var currentDiv = document.getElementById("left_col");
//    var textnode = document.createTextNode(city+", "+state);
//  
//   
//    //new paragraph for the farenheit values
//    var paraNode = document.createElement("p"); //for the farenheit text
//    var paraNodeSymF = document.createElement("p"); //for faren label
//    paraNode.id = "farenNode";
//    paraNodeSymF.id = "farenSymbol";
//    var tempNode = document.createTextNode(temp+"\xB0");
//    var farensymbol = document.createTextNode("Fahrenheit");
//    
//    //new paragraph for the celsius values
//    var paraNode2 = document.createElement("p");
//    var paraNodeSymC = document.createElement("p");
//    paraNodeSymC.id = "celSymbol";
//    paraNode2.id = "celNode";
//    var getCel = changeCel(temp); //has celsius
//    var celTempNode = document.createTextNode(getCel+"\xB0");
//    var celsymbol = document.createTextNode("Celsius");
//
//    
//    //CLEAR CONTENTS OF CURRENTDIV AT A CERTAIN TIME
//    if (dummyBool == true) {
//        var updateCurrentWeather = document.getElementById("new_Node");
//        currentDiv.removeChild(updateCurrentWeather);
//        var removeButtonPara = document.getElementById("buttonPara");
//        currentDiv.removeChild(removeButtonPara);
//    }
//    dummyBool = true;
//    
//    //all this 
//    paraNode.appendChild(tempNode); 
//    paraNodeSymF.appendChild(farensymbol);
//    
//    paraNode2.appendChild(celTempNode); 
//    paraNodeSymC.appendChild(celsymbol); 
//    
//    node.appendChild(textnode);
//    node.appendChild(breaknode);
//    
//    node.appendChild(paraNode);
//    node.appendChild(paraNodeSymF);
//    node.appendChild(breaknode2);
//    node.appendChild(paraNode2);
//    node.appendChild(paraNodeSymC);
//    
//    currentDiv.appendChild(node);    
//    
//    /*------------------------------------------------------*/
//    var makeButtonPara = document.createElement("p");
//    var breaknode3 = document.createElement("br");
//    makeButtonPara.id = "buttonPara";
//    makeButtonPara.appendChild(document.createTextNode("Change location:"));
//    makeButtonPara.appendChild(breaknode3);
//    var editInput = removeInput;
//    editInput.id = "editInput";
//    var editButton = removeButton;
//    editButton.id = "editButton";
//    makeButtonPara.appendChild(editInput);
//    makeButtonPara.appendChild(editButton);
//    
//    currentDiv.appendChild(makeButtonPara);
//
//} //only updating left contents
//
//function changeCel(temp) {
//    var cel = Math.ceil((temp-32)*(5/9));
//    return cel;
//} //change temperature from F to C
//
//function getWeek(int, humidity, windSpeed) {
//    
//    var humidity = weather.query.results.channel.atmosphere.humidity;
//    var windSpeed = weather.query.results.channel.wind.speed;
//    
//    
//    function weekForecast(day, date, text, high, low) {
//        this.day = day;
//        this.date = date;
//        this.text = text;
//        this.high = high;
//        this.low = low;
//    }
//    
//    var tomorrow = new weekForecast(forecast[int].day, forecast[int].date, forecast[int].text, forecast[int].high, forecast[int].low); 
//    
//    tomWeather(tomorrow, int, humidity, windSpeed); 
//}
//
//function tomWeather(tomorrow, int, humidity, windSpeed) {
//    
//    var col_right = document.getElementById("right_col");
//    var displayRight = document.getElementById("forecast");
//    
//    var otherWeather = {
//        "humidities": "N/A",
//        "wind": "N/A"
//        //rain doesn't exist
//    };
//    /////////////
//    var humid = document.createTextNode("Humidity: "+humidity+"%");
//    var humid2 = document.createTextNode("Humidity: "+otherWeather.humidities);
//    var wind = document.createTextNode("Wind: "+windSpeed+" mph");
//    var wind2 = document.createTextNode("Wind: "+otherWeather.wind);    
//    /////////////
//    
//    date = (tomorrow.date).substr(0,6);
//    date = date.split(" "); //holds the array
//    date = date[1]+" "+date[0]; //rearranged text
//    var weather = document.createTextNode(tomorrow.text);
//    var text = document.createTextNode(tomorrow.day+ " "+date);
//    var high = document.createTextNode("High: "+tomorrow.high+"\xB0");
//    var low = document.createTextNode("Low: "+tomorrow.low+"\xB0");
//
//    var newDiv = document.createElement("div");
//    newDiv.id = 'obj'+int.toString();
//    
//    var break1 = document.createElement("br");
//    var break2 = document.createElement("br");
//    var break3 = document.createElement("br");
//    var break4 = document.createElement("br");
//    var break5 = document.createElement("br");
//    var break6 = document.createElement("br");
//    
//    var span1 = document.createElement("span");
//    span1.id = "span1";
//    var span2 = document.createElement("span");
//    span2.id = "span2";
//    var span3 = document.createElement("span");
//    span3.id = "span3";
//    var span4 = document.createElement("span");
//    span4.id = "span4";
//    var span5 = document.createElement("span");
//    span5.id = "span5";
//    var span6 = document.createElement("span");
//    span6.id = "span6";
//    
//    //var day = "1";
//    
//    
//    span1.appendChild(text);
//    span1.appendChild(break1);
//    span2.appendChild(weather);
//    span2.appendChild(break2);
//    span3.appendChild(high);
//    span3.appendChild(break3);
//    span4.appendChild(low);
//    span4.appendChild(break5);
//    
//    if (objBool == true) {
//        span5.appendChild(humid);
//        span5.appendChild(break6);
//        span6.appendChild(wind)
//        objBool = false;
//        
//    }
//    else {
//        
//        span5.appendChild(humid2);
//        span5.appendChild(break6);
//        span6.appendChild(wind2);
//        objBool = false;
//    }
//
//
//    
//    
//    newDiv.appendChild(span1);
//    newDiv.appendChild(span2);
//    newDiv.appendChild(span3);
//    newDiv.appendChild(span4);
//    newDiv.appendChild(span5);
//    newDiv.appendChild(span6);
//    
//    var showImage = tomorrow.text;
//
//    makeWrapper.appendChild(newDiv);
//    WeatherIcon(showImage, makeWrapper);
//    makeWrapper.appendChild(break4);    
////    /dummyBool3 = true;
//}
//
//function WeatherIcon(showImage, makeWrapper) {
//    var img = document.createElement("img");
//    img.id = "image";
//     
//    if (((showImage).toLowerCase() == "sunny") || ((showImage).toLowerCase() == "fair (night)") || ((showImage).toLowerCase() == "fair (day)") || ((showImage).toLowerCase() == "mostly sunny") || ((showImage).toLowerCase() == "clear")) {
//        img.setAttribute("src", "sunny.png"); 
//    }
//    
//    if ((showImage.toLowerCase() == "tornado") || (showImage.toLocaleLowerCase() == "hurricane")) {
//        img.setAttribute("src", "hurricane.png");
//    }
//    
//    if ((showImage.toLowerCase() == "severe thunderstorms") || (showImage.toLocaleLowerCase() == "thunderstorms") || (showImage.toLocaleLowerCase() == "isolated thunderstorms") || (showImage.toLocaleLowerCase() == "scattered thunderstorms") || (showImage.toLocaleLowerCase() == "thundershowers") || (showImage.toLocaleLowerCase() == "isolated thundershowers")) {
//        img.setAttribute("src", "thunder.png");
//    }
//    
//    if ((showImage.toLowerCase() == "mixed rain and snow") ||
//        (showImage.toLowerCase() == "rain and snow") ||
//        (showImage.toLowerCase() == "mixed rain and sleet") || (showImage.toLowerCase() == "freezing drizzle") || (showImage.toLowerCase() == "drizzle") || (showImage.toLowerCase() == "freezing rain") || (showImage.toLowerCase() == "showers") || (showImage.toLowerCase() == "scattered showers") || (showImage.toLowerCase() == "rain")) {
//        img.setAttribute("src", "rain.png");
//    }
//    
//    if ((showImage.toLowerCase() == "snow flurries") || (showImage.toLowerCase() == "light snow showers") || (showImage.toLowerCase() == "blowing snow") || (showImage.toLowerCase() == "heavy snow") || (showImage.toLowerCase() == "snow") || (showImage.toLowerCase() == "scattered snow showers") || (showImage.toLowerCase() == "snow showers")) {
//        img.setAttribute("src", "snow.png");
//    }
//    
//    if (showImage.toLowerCase() == "tropical storm") {
//        img.setAttribute("src","tropstorm.png");
//    }
//    if (showImage.toLowerCase() == "foggy") {
//        img.setAttribute("src","fog.png");
//    }
//    
//    if ((showImage.toLowerCase() == "blustery") || (showImage.toLowerCase() == "wind")) {
//        img.setAttribute("src","wind.png");
//    } 
//    
//    if (showImage.toLowerCase() == "cold") {
//        img.setAttribute("src","cold.png");
//    } 
//    
//    if ((showImage.toLowerCase() == "hot") || (showImage.toLowerCase() == "dust") || (showImage.toLowerCase() == "haze") || (showImage.toLowerCase() == "smoky")) {
//        img.setAttribute("src","hot.png");
//    }
//    
//     if ((showImage.toLowerCase() == "cloudy") || (showImage.toLowerCase() == "mostly cloudy (night)") || (showImage.toLowerCase() == "mostly cloudy (day)") || (showImage.toLowerCase() == "mostly cloudy") || (showImage.toLowerCase() == "partly cloudy (night)") || (showImage.toLowerCase() == "partly cloudy (day)") || (showImage.toLowerCase() == "partly cloudy")) {
//        img.setAttribute("src", "cloudy.png");
//    }
//    
//    if ((showImage.toLowerCase() == "hail") || (showImage.toLowerCase() == "sleet") || (showImage.toLowerCase() == "mixed rain and hail")) {
//        img.setAttribute("src", "hail.png");
//    }
//
//    makeWrapper.appendChild(img);    
//} 
//
//function searchKeyPress(e) {
//    e = e || window.event;
//    if (e.keyCode == 13) {
//        if (bool3 == true) {
//            document.getElementById("buttongo").click();
//            bool3 = false;
//            objBool = true;
//        }
//
//        else {
//            document.getElementById("editButton").click();
//            objBool = true;
//        }
//        return false;
//
//    }
//    return true;
//    
//    getZip();
//} //run makeScript() after hitting the enter key instead of go 