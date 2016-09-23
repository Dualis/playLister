/// <reference path="typings/gapi/gapi.d.ts" />
/// <reference path="typings/gapi.youtube/gapi.youtube.d.ts" />
/// <reference path="typings/jquery/jquery.d.ts" />
// Define some variables used to remember state.
var playlistId, playlistNames, channelId;
var searchResults;
// After the API loads, call a function to enable the playlist creation button.
function handleAPILoaded() {
    console.log('API loaded');
    enableButton();
}
// Enable the button to submit a playlist
function enableButton() {
    $('#submit-button').attr('disabled', false);
}
//Initiates creation of the playlist
function submitPlaylist() {
    console.log('Playlist \"' + document.getElementById('title').value + '\" subitted for processing');
    var playlistStr = document.getElementById('playlist').value;
    playlistNames = playlistStr.slice(0, playlistStr.length - 2).split("\n");
    //console.log(playlistNames);
    createPlaylist();
    //buildPlaylist(playlistId, playlistNames);
}
//Populates the given playlist with the given strings
function buildPlaylist(listId, names) {
    var i;
    for (i = 0; i < 200; ++i) {
        if (i >= names.length)
            break;
        window.setTimeout(addVideoByName(names[i], listId), 500 * i);
    }
    //console.log('added '+i+'elems to playlist '+listId);
}
// Create a playlist.
//TODO:Maybe add more detail, date etc.
//TODO:Make private an option
function createPlaylist() {
    var listTitle = document.getElementById('title').value;
    var request = gapi.client.youtube.playlists.insert({
        part: 'snippet,status',
        resource: {
            snippet: {
                title: listTitle,
                description: 'playLister playlist'
            },
            status: {
                privacyStatus: 'private'
            }
        }
    });
    var complete = false;
    var success;
    request.execute(function (response) {
        var result = response.result;
        if (result) {
            playlistId = result.id;
            console.log('created playlist ' + result.id);
            success = true;
            buildPlaylist(playlistId, playlistNames);
            window.open("https://www.youtube.com/playlist?list=" + playlistId);
        }
        else {
            console.log(JSON.stringify(result));
            success = false;
        }
        complete = true;
    });
    document.getElementById("notify").innerHTML = "https://www.youtube.com/playlist?list=" + playlistId;
}
// Add a video ID specified in the form to the playlist.
function addVideoByName(name, listId) {
    console.log('search: ' + name);
    var request = gapi.client.youtube.search.list({
        part: "snippet",
        type: "video",
        q: name,
        maxResults: 5,
        order: "relevance"
    });
    // execute the request
    request.execute(function (response) {
        var results = response.result;
        //console.log(JSON.stringify(response));
        addToPlaylist(listId, results.items[0].id.videoId);
    });
}
//Parses a serch result and chooses a video id
function chooseFromResults(res) {
    var vidId;
    return vidId;
}
// Add a video to a playlist.
function addToPlaylist(listId, vidId) {
    var request = gapi.client.youtube.playlistItems.insert({
        part: 'snippet',
        resource: {
            snippet: {
                playlistId: listId,
                resourceId: {
                    videoId: vidId,
                    kind: 'youtube#video'
                }
            }
        }
    });
    request.execute(function (response) {
        console.log(JSON.stringify(response));
    });
}
