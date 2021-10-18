// _ = helper functions
function _parseMillisecondsIntoReadableTime(timestamp) {
	//Get hours from milliseconds
	const date = new Date(timestamp * 1000);
	// Hours part from the timestamp
	const hours = '0' + date.getHours();
	// Minutes part from the timestamp
	const minutes = '0' + date.getMinutes();
	// Seconds part from the timestamp (gebruiken we nu niet)
	// const seconds = '0' + date.getSeconds();

	// Will display time in 10:30(:23) format
	return hours.substr(-2) + ':' + minutes.substr(-2); //  + ':' + s
}

// 5 TODO: maak updateSun functie
const updateSun = (left, bottom, today) =>{
	let htmlsun = document.querySelector('.js-sun');
	htmlsun.style.setProperty('--global-sin-position-left', left + '%');
	htmlsun.style.setProperty('--global-sin-position-bottom', bottom + '%');
	htmlsun.setAttribute('data-time', ('0' + new Date(today).getHours()).substr(-2) + ":" + ('0' + (new Date(today).getMinutes())).substr(-2) );
}

// 4 Zet de zon op de juiste plaats en zorg ervoor dat dit iedere minuut gebeurt.
let placeSunAndStartMoving = (totalMinutes, sunrise) => {
	// In de functie moeten we eerst wat zaken ophalen en berekenen.
	// Haal het DOM element van onze zon op en van onze aantal minuten resterend deze dag.
	// Bepaal het aantal minuten dat de zon al op is.
	// Nu zetten we de zon op de initiële goede positie ( met de functie updateSun ). Bereken hiervoor hoeveel procent er van de totale zon-tijd al voorbij is.
	// We voegen ook de 'is-loaded' class toe aan de body-tag.
	// Vergeet niet om het resterende aantal minuten in te vullen.
	// Nu maken we een functie die de zon elke minuut zal updaten
	// Bekijk of de zon niet nog onder of reeds onder is
	// Anders kunnen we huidige waarden evalueren en de zon updaten via de updateSun functie.
	// PS.: vergeet weer niet om het resterend aantal minuten te updaten en verhoog het aantal verstreken minuten.

	console.log("totalMinutes: " + totalMinutes);
	console.log("sunset: " + sunrise);
	console.log("now: " + Math.floor(Date.now() / 1000))
	const morinistamp =  new Date(sunrise * 1000).getMinutes() + (new Date(sunrise * 1000).getHours() * 60);
	const stamp = new Date(Date.now()).getMinutes() + (new Date(Date.now()).getHours() * 60)
	console.log("current min: " + stamp)
	const mornin = stamp - morinistamp
	console.log("sun is up for: " + mornin + "min")
	const percantage = Math.round(mornin/totalMinutes*100)
	console.log("percantage: " + percantage + "%")


	let htmlminutesleft = document.querySelector('.js-time-left');
	htmlminutesleft.innerHTML = totalMinutes - mornin - 60;

	var bottom;

	if(percantage < 50){
		bottom = percantage * 2;
	}
	else if(percantage >=50 && percantage <= 100){
		bottom = 100 - percantage/2;
	}

	updateSun(percantage, bottom, Date.now());

	document.querySelector('body').classList.add('is-loaded');
};

// 3 Met de data van de API kunnen we de app opvullen
let showResult = queryResponse => {
	// We gaan eerst een paar onderdelen opvullen
	// Zorg dat de juiste locatie weergegeven wordt, volgens wat je uit de API terug krijgt.
	// Toon ook de juiste tijd voor de opkomst van de zon en de zonsondergang.
	// Hier gaan we een functie oproepen die de zon een bepaalde positie kan geven en dit kan updaten.
	// Geef deze functie de periode tussen sunrise en sunset mee en het tijdstip van sunrise.
	console.log("in data");
	console.log(queryResponse);	

	let htmlocation = document.querySelector('.js-location');
	htmlocation.innerHTML = queryResponse.name + ", " + queryResponse.country

	var sunset = queryResponse.sunset, sunrise = queryResponse.sunrise;
	let htmlsunset = document.querySelector('.js-sunset');
	let htmlsunrise = document.querySelector('.js-sunrise');

	htmlsunset.innerHTML = _parseMillisecondsIntoReadableTime(sunset);
	htmlsunrise.innerHTML = _parseMillisecondsIntoReadableTime(sunrise);

	const timediff = new Date(sunset * 1000 - sunrise * 1000);

	placeSunAndStartMoving(timediff.getHours() * 60 + timediff.getMinutes(), sunrise);
};

// 2 Aan de hand van een longitude en latitude gaan we de yahoo wheater API ophalen.
let getAPI = (lat, lon) => {
	// Eerst bouwen we onze url op
	// Met de fetch API proberen we de data op te halen.
	// Als dat gelukt is, gaan we naar onze showResult functie.

	fetch('http://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon +'&appid=01864dbaa8f468f51a34f4c455e366b4&units=metric&lang=nl&cnt=1')
  	.then(response => response.json())
	.then(data => showResult(data.city));
};

document.addEventListener('DOMContentLoaded', function() {
	// 1 We will query the API with longitude and latitude.
	console.log('Script loaded!');
	let lat, lon;
	navigator.geolocation.getCurrentPosition(function(position) {
		lat = position.coords.latitude.toFixed(2);
		lon = position.coords.longitude.toFixed(2);
	
		console.log("lon: " + lon + "			lat: " + lat);
		getAPI(lat, lon);
		setInterval(function () { getAPI(lat, lon); }, 60 * 1000);
	});
});
