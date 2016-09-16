var express = require('express');
var multer = require('multer');
var fs = require('fs');
var app = express();
var port = process.env.port || 8889;
var path = require('path');

var storage = multer.memoryStorage();
var upload = multer({ storage: storage });
//Options
//May move this to separate file
var MIN_TITLE_LENGTH = 4;
var MAX_TITLE_LENGTH = 100;

var filepath = path.join(__dirname, '/static');
app.use(express.static(filepath));

app.get('/', function (req, res) {
    writePageHeader(res);
    var filepath = path.join(__dirname, 'home.html');    
    fs.readFile(filepath, function (err, data) {
      res.end(data);
    });
});

app.get('/about', function (req, res) {
    writePageHeader(res);
    var filepath = path.join(__dirname, 'about.html');
    fs.readFile(filepath, 'utf8', function (err, data) {
        res.end(data);
    });
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
    var filepath = path.join(__dirname, 'header.html');
    fs.readFile(filepath, 'utf8', function (err, data) {
        if (!res.headersSent) {
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
        }
        if (!res.finished)
            res.write(data);
    });
    var filepath = path.join(__dirname, 'edit.html');
    fs.readFile(filepath, 'utf8', function (err, data) {
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
    var filepath = path.join(__dirname, 'header.html');
    fs.readFile(filepath, 'utf8', function (err, data) {
        if (!res.headersSent) {
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
        }
        if (!res.finished)
            res.write(data);
    });
}
//Code from npm:express-generator
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
// error handlers
// development error handler
// will print stacktrace
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });


var server = app.listen(port, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});