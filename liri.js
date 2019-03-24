var axios = require('axios');
var keys = require('./keys');
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var fs = require('fs');
var moment = require('moment');


// create an interface for accepting commands and arguments
// interact with the spotify api and print results
// interact with the bandsintown api and print resuts
// interact with ombd and print results

var command = process.argv[2];
var argument = process.argv[3];

var commandList = {
    'spotify-this-song': spotifyThisSong,
    'movie-this': movieThis,
    'concert-this': concertThis,
    'do-what-it-says': whatItSays,
};

if (commandList[command]) {
    commandList[command](argument);
} else {
    console.log('Unrecognized command');
};

// should default to The Sign Ace of Base for spotifyThis function - wasn't able to get it to work
if ((command === 'spotify-this-song') && (argument === undefined)) {
    song = 'The Sign Ace of Base';
};

// should default to Mr. Nobody for movieThis function - console.logs work but wasn't able to get data for Mr. Nobody to load
if ((command === 'movie-this') && (argument === undefined)) {
    console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
    console.log("It's on Netflix!");
    movie = 'Mr. Nobody';
};

//should call random.txt as command - not functioning
function whatItSays() {
    fs.readFile('random.txt', 'utf8', function (error, data) {
        var dataRandom = data.split(',');
        command = dataRandom[0];
        argument = dataRandom[1];
        run(command + argument);
        if (error) {
            return console.log(error);
        }
});

};

function concertThis(artist) {
    axios
        .get((`https://rest.bandsintown.com/artists/${artist}/events?app_id=codingbootcamp`))
        .then(function (response) {
            for (var i = 0; i < response.data.length; i++) {
            var concertLocation = response.data[i].venue.city + ", " + response.data[i].venue.region + ", " + response.data[i].venue.country
            console.log(`Venue: ${response.data[i].venue.name}`);
            console.log(`Location: ${concertLocation}`);
            console.log(`Event Date: ${moment(response.data[i].datetime).format("MM/DD/YYYY")}`);
            console.log('-----------');
        }
        })
        .catch(function (err) {
            console.error(err);
        })

};


function spotifyThisSong(song) {
    spotify
        .search({
        type: 'track',
        query: song,
        limit: 10,
    })
        .then(function(response) {
            response.tracks.items.forEach(function (track) {
                console.log('-----------');
                console.log(`Artist Name: ${track.artists[0].name}`);
                console.log(`Track Name: ${track.name}`);
                console.log(`Preview: ${track.preview_url}`);
                console.log(`Album Name: ${track.album.name}`);
            })
        })
        .catch(function (err) {
            console.error(err);
        })
};

function movieThis(movie) {
    axios
    .get(`https://www.omdbapi.com/?t=${movie}&apikey=trilogy`)
    .then(function (response) {
        console.log('-----------');
        console.log(`Title: ${response.data.Title}`);
        console.log(`Year: ${response.data.Year}`);
        console.log(`IMBD Rating: ${response.data.imbdRating}`);
        console.log(`Rotten Tomatoes Rating: ${response.data.Ratings[1].Value}`);
        console.log(`Country: ${response.data.Country}`);
        console.log(`Language: ${response.data.Language}`);
        console.log(`Plot: ${response.data.Plot}`);
        console.log(`Actors: ${response.data.Actors}`);
    })
    .catch(function (err) {
        console.error(err);
    })
};
