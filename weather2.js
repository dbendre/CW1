/*jslint plusplus: true*/
var firstLocation = true;
var firstDayArray = true;
var firstCSS = true;

//create weather data object for each day
var dayArray = new Array(7); // array for 7 days

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
        document.body.scrollTop = 0; // For Chrome, Safari and Opera 
        document.documentElement.scrollTop = 0; // For IE and Firefox
    }
    
    if (firstCSS) {
        firstCSS = false;
        document.getElementById("formID").style.top = "30vw";
        document.getElementById("Weather").style.backgroundColor = "#fff";
        document.getElementById("weathText").style.backgroundColor = "#fff";
        document.getElementById("weathText").style.color = "#f89a1f";
        document.getElementById("forecastFooter").style.backgroundColor = "#fff";
        document.getElementById("forecastFooter").style.color = "#f89a1f";
    }
    
}

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
}

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
};

var weekDays = {
    "Mon" : "Monday",
    "Tue" : "Tuesday",
    "Wed" : "Wednesday",
    "Thu" : "Thursday",
    "Fri" : "Friday",
    "Sat" : "Saturday",
    "Sun" : "Sunday"
};

function getImage(code) {
    "use strict";
    var imgWeather, src;
    imgWeather = document.createElement("img");
    imgWeather.id = "weatherIcon";
    src = "";
    
    code = parseInt(code, 10); // convert string code to int for comparision check
    
    if (code === 0 || code === 2) {
        src = "./icons/hurricanetornado.png";
    } else if (code === 1) {
        src = "./icons/tropicalStorm.png";
    } else if (code === 3 || code === 4 || code === 37 || code === 38 || code === 39 || code === 45 || code === 47) {
        src = "./icons/cloud-and-thunder.png";
    } else if (code === 5 || code === 6 || code === 7 || code === 14 || code === 42 || code === 46) {
        src = "./icons/rainsnow.png";
    } else if (code === 8 || code === 9 || code === 10 || code === 11 || code === 12 || code === 40) {
        src = "./icons/rain.png";
    } else if (code === 13 || code === 14 || code === 15 || code === 16 || code === 41 || code === 43) {
        src = "./icons/snowflake.png";
    } else if (code === 17 || code === 18 || code === 35) {
        src = "./icons/hail.png";
    } else if (code === 19 || code === 20 || code === 21 || code === 22 || code === 23) {
        src = ".icons/fog.png";
    } else if (code === 24) {
        src = "./icons/wind.png";
    } else if (code === 25) {
        src = "./icons/cold.png";
    } else if (code === 26 || code === 27 || code === 28 || code === 29 || code === 30 || code === 44) {
        src = "./icons/cloudy.png";
    } else if (code === 31 || code === 32 || code === 33 || code === 34) {
        src = "./icons/sunny.png";
    } else if (code === 36) {
        src = "./icons/hot.png";
    } else if (code === 3200) {
        src = "./icons/error.png";
    }
    
    imgWeather.setAttribute("src", src);
    return imgWeather;
    
}

function keyPress(e) {
    "use strict";
    e = e || window.event;
    if (e.keyCode === 13) {
        document.getElementById("zipButton").click();
        return false;
    }
    return true;
}

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
        
    console.log(document.getElementById("Current").childElementCount);
    if (firstLocation) { // if first location is true, do this
        firstLocation = false;
        
        //location
        locationPara = document.createElement("p"); //paragraph node
        locationPara.id = "locationID";
        textNode = document.createTextNode(city + ", " + state);
        locationPara.appendChild(textNode);
        currentDiv.appendChild(locationPara);
        
        //farenheit temperature
        tempFP = document.createElement("p");
        tempFP.id = "tempFar";
        textNode = document.createTextNode(currentTemp + "\xB0");
        tempFP.appendChild(textNode);
        currentDiv.appendChild(tempFP);
        
        tempCP = document.createElement("p");
        tempCP.id = "tempCel";
        textNode = document.createTextNode(celTemp + "\xB0");
        tempCP.appendChild(textNode);
        currentDiv.appendChild(tempCP);
        
        farenP = document.createElement("p");
        farenP.id = "farenText";
        tempText = document.createTextNode("Fahrenheit");
        farenP.appendChild(tempText);
        currentDiv.appendChild(farenP);
        
        celP = document.createElement("p");
        celP.id = "celText";
        tempText2 = document.createTextNode("Celsius");
        celP.appendChild(tempText2);
        currentDiv.appendChild(celP);
        
    } else { // not first location:
        document.getElementById("locationID").innerHTML = city + ", " + state;
        document.getElementById("tempFar").innerHTML = currentTemp + "\xB0";
        document.getElementById("tempCel").innerHTML = celTemp + "\xB0";
    }
}

function displayRightCol(dayArray) {
    "use strict";
    console.log(dayArray);
    var daydiv, dayDate, dayText, highTemp, lowTemp, textNode, containerDiv, imgDiv, i;
    if (firstDayArray) {
        containerDiv = document.createElement("div");
        containerDiv.id = "containerDiv";
        document.getElementById("Weather").appendChild(containerDiv);

        for (i = 0; i < 7; i++) {
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

    } else {
        for (i = 0; i < 7; ++i) {
            document.getElementById("day" + i).firstElementChild.innerHTML = dayArray[i].day + ", " + dayArray[i].month + " " + dayArray[i].date;
            document.getElementById("day" + i).children[1].innerHTML = dayArray[i].text;
            document.getElementById("day" + i).children[2].innerHTML = "High: " + dayArray[i].tempHigh + "\xB0" + "F";
            document.getElementById("day" + i).children[3].innerHTML = "Low: " + dayArray[i].tempLow + "\xB0" + "F";
            
            document.getElementById("day" + i).removeChild(document.getElementById("day" + i).children[4]);
            document.getElementById("day" + i).appendChild(getImage(dayArray[i].code));
        }
    }
}


function callbackFunction(jsonData) {
    "use strict";
    var weather, city, state, currentTemp, celTemp, i, code, date, month, day, tempHigh, tempLow, text, textImage;
    weather = jsonData.query.results.channel;
    console.log(weather);
    
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
}