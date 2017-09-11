var express = require('express');
var http = require('http');
var app = express();

var port = process.env.PORT || 3000;

app.use('/assets', express.static(__dirname + '/public/assets'));

app.set('view engine', 'ejs');



app.get('/', function(req, res) {
    var templateData = { weather: null, exchangeRates: null };

    http.get({
        host: 'api.apixu.com',
        path: '/v1/current.json?key=f185e982a5ae40ef8cf125536171109&q=London'
    }, function(response) {
        // Continuously update stream with data
        var body = '';
        response.on('data', function(d) {
            body += d;
        });
        response.on('end', function() {
            templateData.weather = JSON.parse(body);
            getRequestComplete();
        });
    });

    http.get({
        host: 'api.fixer.io',
        path: '/latest?base=GBP'
    }, function(response) {
        // Continuously update stream with data
        var body = '';
        response.on('data', function(d) {
            body += d;
        });
        response.on('end', function() {
            templateData.exchangeRates = JSON.parse(body);
            getRequestComplete();
        });
    });


    function getRequestComplete() {
        if (templateData.weather !== null && templateData.exchangeRates !== null) {
            res.render('index', templateData);
        }
    }
	
});

app.get('/person/:id', function(req, res) {
	res.render('person', { ID: req.params.id });
});

app.get('/api', function(req, res) {
	res.json({ firstname: 'John', lastname: 'Doe' });
});

app.listen(port);