/// <reference path="typings/node/node.d.ts" />
var express = require('express');
var multer = require('multer');
var fs = require('fs');
var app = express();
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });
//Options
//May move this to separate file
var MIN_TITLE_LENGTH = 4;
var MAX_TITLE_LENGTH = 100;
var SERVER_PORT = 8889;
app.use(express.static(__dirname + '/static'));
//Responds to 'get' requests by sending home.html
app.get('/', function (req, res) {
    writePageHeader(res);
    fs.readFile('home.html', 'utf8', function (err, data) {
        res.end(data);
    });
});
app.get('/edit', function (req, res) {
    writePageHeader(res);
    fs.readFile('edit.html', 'utf8', function (err, data) {
        res.end(data);
    });
});
app.get('/about', function (req, res) {
    writePageHeader(res);
    fs.readFile('about.html', 'utf8', function (err, data) {
        res.end(data);
    });
});
app.get('/submitPlaylist', function (req, res) {
    res.writeHead(301, {
        Location: (req.socket.encrypted ? 'https://' : 'http://') +
            req.headers.host });
});
//responds to 'post' requests by processing the file
//only single files will be accepted
app.post('/submitPlaylist', upload.single('inputFile'), function (req, res, next) {
    console.log(req.file);
    var filename = req.file.originalname;
    var file = req.file.buffer.toString();
    var titles = file.split("\n");
    console.log("Processing " + titles.length + " possible titles");
    if (filename.indexOf(".m3u") > 0)
        processM3u(titles);
    cleanTitles(titles);
    cullTitles(titles);
    writePageHeader(res);
    fs.readFile('edit.html', 'utf8', function (err, data) {
        res.write("<div class=\"container\">\n<div class=\"jumbotron\">\n");
        //Writes the text box that contains the title
        res.write("<div class=\"form-group\">\n");
        res.write("<label for=\"title\">Playlist Title::</label>\n");
        res.write("<textarea class=\"form-control\" rows=\"1\" id=\"title\">");
        res.write(filename);
        res.write("</textarea>\n");
        //Writes the text box that contains the playlist
        res.write("<label for=\"playlist\">Playlist:</label>\n");
        res.write("<textarea class=\"form-control\" rows=\"" + titles.length.toString() + "\" id=\"playlist\">");
        for (var i = 0; i < titles.length; ++i) {
            res.write(titles[i] + "\n");
        }
        res.write("</textarea>\n</div>\n");
        res.end(data);
    });
});
var server = app.listen(SERVER_PORT, function () {
    console.log("Server listening");
});
//Cleans an array of strings to create appropriate titles
function cleanTitles(titles) {
    var title;
    for (title in titles) {
        title.trim().toLowerCase();
    }
}
//Culls inappropriate titles from an array of strings
function cullTitles(titles) {
    var newTitles = new Array();
    var title;
    var i;
    for (i = 0; i < titles.length; ++i) {
        title = titles[i];
        //Check length
        if (title.length < MIN_TITLE_LENGTH || title.length > MAX_TITLE_LENGTH)
            continue;
        newTitles.push(title);
    }
    console.log("Removed " + (titles.length - newTitles.length) + " titles during culling");
    titles = newTitles;
}
//Cleans each entry in an m3u file
//Each line in an m3u is the path to a media file
function processM3u(titles) {
    var i;
    for (i = 0; i < titles.length; ++i) {
        var title = titles[i];
        //Removes the directory path to the file
        title = title.substring(title.lastIndexOf("\\") + 1);
        //Removes the file type
        title = title.substring(0, title.lastIndexOf("."));
        titles[i] = title;
    }
}
function writePageHeader(res) {
    fs.readFile('header.html', 'utf8', function (err, data) {
        if (!res.headersSent) {
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
        }
        if (!res.finished)
            res.write(data);
    });
}
//# sourceMappingURL=server.js.map