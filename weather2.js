/*jslint plusplus: true */
/*eslint-env browser*/
/*eslint no-unused-vars: 0*/
/*eslint no-console: 0*/
//define rules above to satisfy linter

//current complexity: 61
//new complexity: 11

var firstLocation = true; // bool indicating first location search
var firstDayArray = true; // bool indicating data from first location search
var firstCSS = true; // bool to apply css for first browser load

var dayArray = new Array(7); //create weather data object to contain 7 days

function getZip() {
    "use strict";
    var script, getInput, city, state;
    script = document.createElement("script");
    getInput = document.getElementById("userInput").value; // get input
   
    
    //parse input
    getInput = getInput.split(", ");
    city = getInput[0];
    state = getInput[1];
    script.src = "https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text='" + city + ", " + state + "')&format=json&callback=callbackFunction";
    document.head.appendChild(script);
    
    if (document.getElementById("containerDiv")) { // fix scrolling issue when entering new location
        document.body.scrollTop = 0; // for Chrome, Safari and Opera 
        document.documentElement.scrollTop = 0; // for IE and Firefox
    }
    
    if (firstCSS) { // apply specific css for very first location search
        firstCSS = false; // change to false for next location searches
        document.getElementById("formID").style.top = "30vw";
        document.getElementById("Weather").style.backgroundColor = "#fff";
        document.getElementById("weathText").style.backgroundColor = "#fff";
        document.getElementById("weathText").style.color = "#f89a1f";
        document.getElementById("forecastFooter").style.backgroundColor = "#fff";
        document.getElementById("forecastFooter").style.color = "#f89a1f";
    }
    
} // query API based on location

function Day(code, date, month, day, tempHigh, tempLow, text, textImage) {
    "use strict";
    this.code = code;
    this.date = date;
    this.month = month;
    this.day = day;
    this.tempHigh = tempHigh;
    this.tempLow = tempLow;
    this.text = text;
    this.textImage = textImage;
} // information for each day

function convertTemp(currentTemp) {
    "use strict";
    var celTemp;
    celTemp = (currentTemp - 32) * 5 / 9;
    return celTemp;
} // convert from farenheit to celsius

var months = {
    "Jan" : "January",
    "Feb" : "February",
    "Apr" : "April",
    "May" : "May",
    "Jun" : "June",
    "Jul" : "July",
    "Aug" : "August",
    "Sep" : "September",
    "Oct" : "October",
    "Nov" : "November",
    "Dec" : "December"
}; // object mapping month abbreviation to long word 

var weekDays = {
    "Mon" : "Monday",
    "Tue" : "Tuesday",
    "Wed" : "Wednesday",
    "Thu" : "Thursday",
    "Fri" : "Friday",
    "Sat" : "Saturday",
    "Sun" : "Sunday"
}; // object mapping day abbreviation to long word

var imageMap = {
    0: "./icons/hurricanetornado.png",
    2: "./icons/hurricanetornado.png",
    1: "./icons/tropicalStorm.png",
    3: "./icons/cloud-and-thunder.png",
    4: "./icons/cloud-and-thunder.png",
    37: "./icons/cloud-and-thunder.png",
    38: "./icons/cloud-and-thunder.png",
    39: "./icons/cloud-and-thunder.png",
    45: "./icons/cloud-and-thunder.png",
    47: "./icons/cloud-and-thunder.png",
    5: "./icons/rainsnow.png",
    6: "./icons/rainsnow.png",
    7: "./icons/rainsnow.png",
    14: "./icons/rainsnow.png",
    42: "./icons/rainsnow.png",
    46: "./icons/rainsnow.png",
    8: "./icons/rain.png",
    9: "./icons/rain.png",
    10: "./icons/rain.png",
    11: "./icons/rain.png",
    12: "./icons/rain.png",
    40: "./icons/rain.png",
    13: "./icons/snowflake.png",
    15: "./icons/snowflake.png",
    16: "./icons/snowflake.png",
    41: "./icons/snowflake.png",
    43: "./icons/snowflake.png",
    17: "./icons/hail.png",
    18: "./icons/hail.png",
    35: "./icons/hail.png",
    19: "./icons/fog.png",
    20: "./icons/fog.png",
    21: "./icons/fog.png",
    22: "./icons/fog.png",
    23: "./icons/fog.png",
    24: "./icons/wind.png",
    25: "./icons/cold.png",
    26: "./icons/cloudy.png",
    27: "./icons/cloudy.png",
    28: "./icons/cloudy.png",
    29: "./icons/cloudy.png",
    30: "./icons/cloudy.png",
    44: "./icons/cloudy.png",
    31: "./icons/sunny.png",
    32: "./icons/sunny.png",
    33: "./icons/sunny.png",
    34: "./icons/sunny.png",
    36: "./icons/hot.png",
    3200: "./icons/error.png"
}; // object mapping image to corresponding code

function getImage(code) {
    "use strict";
    var imgWeather, src;
    imgWeather = document.createElement("img");
    imgWeather.id = "weatherIcon";
    src = "";
    
    code = parseInt(code, 10); // convert string code to int for comparision check
    src = imageMap[code];    
    
    imgWeather.setAttribute("src", src);
    return imgWeather;
} // get correct weather icon corresponding to code

function keyPress(e) {
    "use strict";
    e = e || window.event;
    if (e.keyCode === 13) {
        document.getElementById("zipButton").click();
        return false;
    }
    return true;
} // triggers getZip() on 'enter' key

function displayLeftCol(city, state, currentTemp, celTemp) {
    "use strict";
    var locationPara, textNode, farenP, tempText, tempText2, celP, removeTagDiv, moveForm, currentDiv, tempFP, tempCP;
    
    // if taglineDiv has not been removed already, remove it.
    if (document.getElementById("taglineDiv")) {
        removeTagDiv = document.getElementById("taglineDiv");
        removeTagDiv.parentElement.removeChild(removeTagDiv);
    }
    
    //move input field to left side
    moveForm = document.getElementById("formID");
    currentDiv = document.getElementById("Current");
    moveForm.parentElement.removeChild(moveForm);
    currentDiv.appendChild(moveForm);
    moveForm.classList.add("formClass");
        
    if (firstLocation) { // if first location is true, create corresponding elements to dispaly weather data
        firstLocation = false;
        
        //location
        locationPara = document.createElement("p");
        locationPara.id = "locationID";
        textNode = document.createTextNode(city + ", " + state);
        locationPara.appendChild(textNode);
        currentDiv.appendChild(locationPara);
        
        //fahrenheit temperature
        tempFP = document.createElement("p");
        tempFP.id = "tempFar";
        textNode = document.createTextNode(currentTemp + "\xB0");
        tempFP.appendChild(textNode);
        currentDiv.appendChild(tempFP);
        
        //celsius temperature
        tempCP = document.createElement("p");
        tempCP.id = "tempCel";
        textNode = document.createTextNode(celTemp + "\xB0");
        tempCP.appendChild(textNode);
        currentDiv.appendChild(tempCP);
        
        //fahrenheit label 
        farenP = document.createElement("p");
        farenP.id = "farenText";
        tempText = document.createTextNode("Fahrenheit");
        farenP.appendChild(tempText);
        currentDiv.appendChild(farenP);
        
        //celsius label
        celP = document.createElement("p");
        celP.id = "celText";
        tempText2 = document.createTextNode("Celsius");
        celP.appendChild(tempText2);
        currentDiv.appendChild(celP);
        
    } else { // not first location
        document.getElementById("locationID").innerHTML = city + ", " + state;
        document.getElementById("tempFar").innerHTML = currentTemp + "\xB0";
        document.getElementById("tempCel").innerHTML = celTemp + "\xB0";
    }
} // display all data on left column on page

function displayRightCol(dayArray) {
    "use strict";
    var daydiv, dayDate, dayText, highTemp, lowTemp, textNode, containerDiv, i;
    if (firstDayArray) { // create all elements if this is the first location search
        containerDiv = document.createElement("div");
        containerDiv.id = "containerDiv";
        document.getElementById("Weather").appendChild(containerDiv);

        for (i = 0; i < 7; i++) {
            //create div for each day
            daydiv = document.createElement("div");
            daydiv.id = "day" + i;
            daydiv.classList.add("dayClass");

            //day information
            dayDate = document.createElement("p");
            dayDate.id = "dayDate";
            textNode = document.createTextNode(dayArray[i].day + ", " + dayArray[i].month + " " + dayArray[i].date);
            dayDate.appendChild(textNode);
            daydiv.appendChild(dayDate);

            //text info
            dayText = document.createElement("p");
            dayText.id = "dayText";
            textNode = document.createTextNode(dayArray[i].text);
            dayText.appendChild(textNode);
            daydiv.appendChild(dayText);

            //temp high
            highTemp = document.createElement("p");
            highTemp.id = "highTemp";
            textNode = document.createTextNode("High: " + dayArray[i].tempHigh + "\xB0" + "F");
            highTemp.appendChild(textNode);
            daydiv.appendChild(highTemp);

            //temp low
            lowTemp = document.createElement("p");
            lowTemp.id = "lowTemp";
            textNode = document.createTextNode("Low: " + dayArray[i].tempLow + "\xB0" + "F");
            lowTemp.appendChild(textNode);
            daydiv.appendChild(lowTemp);
            
            daydiv.appendChild(getImage(dayArray[i].code));
            
            document.getElementById("containerDiv").appendChild(daydiv);
        }
        firstDayArray = false;

    } else { // if not the first search, bind data to existing elements
        for (i = 0; i < 7; ++i) {
            document.getElementById("day" + i).firstElementChild.innerHTML = dayArray[i].day + ", " + dayArray[i].month + " " + dayArray[i].date;
            document.getElementById("day" + i).children[1].innerHTML = dayArray[i].text;
            document.getElementById("day" + i).children[2].innerHTML = "High: " + dayArray[i].tempHigh + "\xB0" + "F";
            document.getElementById("day" + i).children[3].innerHTML = "Low: " + dayArray[i].tempLow + "\xB0" + "F";
            
            document.getElementById("day" + i).removeChild(document.getElementById("day" + i).children[4]);
            document.getElementById("day" + i).appendChild(getImage(dayArray[i].code));
        }
    }
} // display data on right column of page


function callbackFunction(jsonData) {
    "use strict";
    var weather, city, state, currentTemp, celTemp, i, code, date, month, day, tempHigh, tempLow, text, textImage;
    weather = jsonData.query.results.channel;
    
    //parse weather data
    city = weather.location.city; // on left div
    state = weather.location.region; // on left div
    currentTemp = weather.item.condition.temp; // in F; on left div
    celTemp = Math.round(convertTemp(currentTemp)); // convert current temp to C; on left div
    
    displayLeftCol(city, state, currentTemp, celTemp);
    
    // populate day array
    for (i = 0; i < 7; i++) {
        code = weather.item.forecast[i].code;
        date = weather.item.forecast[i].date.split(" ")[0]; //get date number
        month = months[weather.item.forecast[i].date.split(" ")[1]];
        day = weekDays[weather.item.forecast[i].day];
        tempHigh = weather.item.forecast[i].high;
        tempLow = weather.item.forecast[i].low;
        text = weather.item.forecast[i].text;
        textImage = getImage(code);
        
        dayArray[i] = new Day(code, date, month, day, tempHigh, tempLow, text, textImage); // display on right div
    }
    
    displayRightCol(dayArray);
} // callbackFunction used in getZip()