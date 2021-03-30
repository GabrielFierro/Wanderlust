// Foursquare API Info
const url = "https://api.foursquare.com/v2/venues/explore?near=";
var client_id = config.CLIENT_ID;
var client_secret = config.CLIENT_SECRET;
// OpenWeather Info
const weatherUrl = "https://api.openweathermap.org/data/2.5/weather";
var open_weather_key = config.OPEN_WEATHER_KEY;

// Page Elements
const $input = $("#city");
const $submit = $("#button");
const $destination = $("#destination");
const $container = $(".container");
const $venueDivs = [$("#venue1"), $("#venue2"), $("#venue3"), $("#venue4")];
const $weatherDiv = $("#weather1");
const weekDays = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
];

// Add AJAX functions here:
const getVenues = async () => {
	const city = $input.val();
	const urlToFetch = `${url}${city}&limit=10&client_id=${client_id}&client_secret=${client_secret}&v=20180101`;

	try {
		const response = await fetch(urlToFetch);
		if (response.ok) {
			const jsonResponse = await response.json();
			console.log(jsonResponse);
			const venues = jsonResponse.response.groups[0].items.map(
				(item) => item.venue
			);
			console.log(venues);
			return venues;
		} else {
			throw new Error("Request failed!");
		}
	} catch (error) {
		console.log(error.messagee);
	}
};

const getForecast = async () => {
	const urlToFetch = `${weatherUrl}?&q=${$input.val()}&APPID=${open_weather_key}`;
	try {
		const response = await fetch(urlToFetch);
		if (response.ok) {
			const jsonResponse = await response.json();
			console.log(jsonResponse);
			return jsonResponse;
		}
	} catch (error) {
		console.log(error);
	}
};

// Render functions
const renderVenues = (venues) => {
	$venueDivs.forEach(($venue, index) => {
		// Add your code here:
		const venue = venues[index];
		const venueIcon = venue.categories[0].icon;
		console.log(venueIcon);
		const venueImgSrc = `${venueIcon.prefix}bg_64${venueIcon.suffix}`;
		let venueContent = createVenueHTML(venue.name, venue.location, venueImgSrc);
		$venue.append(venueContent);
	});
	$destination.append(`<h2>${venues[0].location.city}</h2>`);
};

const renderForecast = (day) => {
	// Add your code here:
	let weatherContent = createWeatherHTML(day);
	$weatherDiv.append(weatherContent);
};

const executeSearch = () => {
	$venueDivs.forEach((venue) => venue.empty());
	$weatherDiv.empty();
	$destination.empty();
	$container.css("visibility", "visible");
	getVenues().then((venues) => renderVenues(venues));
	getForecast().then((forecast) => renderForecast(forecast));
	return false;
};

$submit.click(executeSearch);
