var express = require('express');
var app = express();
var request = require('request')
var bodyParser = require('body-parser')
var config = require('./config');


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(express.static(__dirname + "/src/public"));

app.post('/login', function(req, res){
    var headers = {
        'Content-Type': 'application/json',
    };

    var callback = function(error, resp, data){
        res.send(data)
    }
    var requestOptions = {
        method:'POST',
        uri:config.host+'login/',
        headers: headers,
        json: {"username":req.body.username, "password":req.body.password}
    }

    try{
        var request = require('request');
        request(requestOptions, callback);
    }
    catch(err){
        res.status(500).end()
    }
})

app.get('/teams',function(req,res){

    var headers = {
            'Content-Type': 'application/json',
            'Authorization': req.headers['authorization']
        };
    var requestOptions = {
            method: 'GET',
            uri: config.host+ 'teams/',
            headers: headers,
        };

        try{
            var callback = function(error, resp, data){
                if(error)
                    res.send(JSON.parse(error))
                res.send(JSON.parse(data))
            }
            var request = require('request');
            request(requestOptions, callback);
        }
        catch(err){
            res.status(500).end()
        }
})

app.get('/tracks',function(req,res){
    
    var url = 'tracks';
    if(req.param('team') && req.param('team')!=''){
        url = url + '?team=' + req.param('team')
    }
    else if(req.param('track') && req.param('track')!=''){
        url = url + '?track=' + req.param('track')
    }

    var headers = {
            'Content-Type': 'application/json',
            'Authorization': req.headers['authorization']
        };
    var requestOptions = {
            method: 'GET',
            uri: config.host+ url,
            headers: headers,
        };

        try{
            var callback = function(error, resp, data){
                if(error)
                    res.send(JSON.parse(error))
                res.send(JSON.parse(data))
            }
            var request = require('request');
            request(requestOptions, callback);
        }
        catch(err){
            res.status(500).end()
        }
})

app.get('/users', function(req, res){
    var url = 'users';
    if(req.param('userName') && req.param('userName')!=''){
        url = url + '?userName=' + req.param('userName')
    }
    else if(req.param('track') && req.param('track')!=''){
        url = url + '?track=' + req.param('track')
    }

    var headers = {
            'Content-Type': 'application/json',
            'Authorization': req.headers['authorization']
        };
    var requestOptions = {
            method: 'GET',
            uri: config.host+ url,
            headers: headers,
        };

        try{
            var callback = function(error, resp, data){
                if(error)
                    res.send(JSON.parse(error))
                res.send(JSON.parse(data))
            }
            var request = require('request');
            request(requestOptions, callback);
        }
        catch(err){
            res.status(500).end()
        }
})

app.post('/metrics/addProductivity', function(req, res){

    var headers = {
            'Content-Type': 'application/json',
            'Authorization': req.headers['authorization']
        };
    var requestOptions = {
            method: 'POST',
            uri: config.host+ 'metrics/addProductivity',
            headers: headers,
            json: req.body
        };

        try{
            var callback = function(error, resp, data){
                if(error)
                    res.send(JSON.parse(error))
                res.send(JSON.parse(data))
            }
            var request = require('request');
            request(requestOptions, callback);
        }
        catch(err){
            res.status(500).end()
        }
})

app.get('/metrics/getLatest', function(req,res){
    var url = 'metrics/getLatest';
    if(req.param('userName') && req.param('userName')!=''){
        url = url + '?userName=' + req.param('userName')
    }

    var headers = {
            'Content-Type': 'application/json',
            'Authorization': req.headers['authorization']
        };
    var requestOptions = {
            method: 'GET',
            uri: config.host+ url,
            headers: headers,
        };

        try{
            var callback = function(error, resp, data){
                if(error)
                    res.send(JSON.parse(error))
                res.send(JSON.parse(data))
            }
            var request = require('request');
            request(requestOptions, callback);
        }
        catch(err){
            res.status(500).end()
        }
})

app.post('/metrics/search', function(req, res){
    var headers = {
            'Content-Type': 'application/json',
            'Authorization': req.headers['authorization']
        };
    var requestOptions = {
            method: 'POST',
            uri: config.host+ 'metrics/search',
            headers: headers,
            json: req.body
        };

        try{
            var callback = function(error, resp, data){
                if(error)
                    res.send(JSON.parse(error))
                res.send(JSON.parse(data))
            }
            var request = require('request');
            request(requestOptions, callback);
        }
        catch(err){
            res.status(500).end()
        }
})

app.post('/metrics/update', function(req, res){
    
    
    var headers = {
            'Content-Type': 'application/json',
            'Authorization': req.headers['authorization']
        };
    var requestOptions = {
            method: 'POST',
            uri: config.host+ 'metrics/update',
            headers: headers,
            json: req.body
        };

        try{
            var callback = function(error, resp, data){
                if(error)
                    res.send(JSON.parse(error))
                res.send(JSON.parse(data))
            }

            var request = require('request');
            request(requestOptions, callback);
        }
        catch(err){
            res.status(500).end()
        }
})

app.post('/metrics/delete', function(req, res){    
    var headers = {
            'Content-Type': 'application/json',
            'Authorization': req.headers['authorization']
        };
    var requestOptions = {
            method: 'POST',
            uri: config.host+ 'metrics/delete',
            headers: headers,
            json: req.body
        };

        try{
            var callback = function(error, resp, data){
                if(error)
                    res.send(JSON.parse(error))
                res.send(JSON.parse(data))
            }
            var request = require('request');
            request(requestOptions, callback);
        }
        catch(err){
            res.status(500).end()
        }
})

app.post('/sprint/addSprint', function(req, res){

    var headers = {
            'Content-Type': 'application/json',
            'Authorization': req.headers['authorization']
        };
    var requestOptions = {
            method: 'POST',
            uri: config.host+ 'sprint/addSprint',
            headers: headers,
            json: req.body
        };

        try{
            var callback = function(error, resp, data){
                if(error)
                    res.send(JSON.parse(error))
                res.send(JSON.parse(data))
            }
            var request = require('request');
            request(requestOptions, callback);
        }
        catch(err){
            res.status(500).end()
        }
})

app.get('/sprint/getLatest', function(req,res){
    var url = 'sprint/getLatest';
    if(req.param('userName') && req.param('userName')!=''){
        url = url + '?userName=' + req.param('userName')
    }

    var headers = {
            'Content-Type': 'application/json',
            'Authorization': req.headers['authorization']
        };
    var requestOptions = {
            method: 'GET',
            uri: config.host+ url,
            headers: headers,
        };

        try{
            var callback = function(error, resp, data){
                if(error)
                    res.send(JSON.parse(error))
                res.send(JSON.parse(data))
            }
            var request = require('request');
            request(requestOptions, callback);
        }
        catch(err){
            res.status(500).end()
        }
})

app.post('/sprint/search', function(req, res){
    var headers = {
            'Content-Type': 'application/json',
            'Authorization': req.headers['authorization']
        };
    var requestOptions = {
            method: 'POST',
            uri: config.host+ 'sprint/search',
            headers: headers,
            json: req.body
        };

        try{
            var callback = function(error, resp, data){
                if(error)
                    res.send(JSON.parse(error))
                res.send(JSON.parse(data))
            }
            var request = require('request');
            request(requestOptions, callback);
        }
        catch(err){
            res.status(500).end()
        }
})

app.post('/sprint/delete', function(req, res){    
    var headers = {
            'Content-Type': 'application/json',
            'Authorization': req.headers['authorization']
        };
    var requestOptions = {
            method: 'POST',
            uri: config.host+ 'sprint/delete',
            headers: headers,
            json: req.body
        };

        try{
            var callback = function(error, resp, data){
                if(error)
                    res.send(JSON.parse(error))
                res.send(JSON.parse(data))
            }
            var request = require('request');
            request(requestOptions, callback);
        }
        catch(err){
            res.status(500).end()
        }
})

app.post('/sprint/ud/addUpDown', function(req, res){

    var headers = {
            'Content-Type': 'application/json',
            'Authorization': req.headers['authorization']
        };
    var requestOptions = {
            method: 'POST',
            uri: config.host+ 'sprint/ud/addUpDown',
            headers: headers,
            json: req.body
        };

        try{
            var callback = function(error, resp, data){
                if(error)
                    res.send(JSON.parse(error))
                res.send(JSON.parse(data))
            }
            var request = require('request');
            request(requestOptions, callback);
        }
        catch(err){
            res.status(500).end()
        }
})

app.get('/sprint/ud/getLatest', function(req,res){
    var url = 'sprint/ud/getLatest';
    if(req.param('track') && req.param('track')!=''){
        url = url + '?track=' + req.param('track')
    }

    var headers = {
            'Content-Type': 'application/json',
            'Authorization': req.headers['authorization']
        };
    var requestOptions = {
            method: 'GET',
            uri: config.host+ url,
            headers: headers,
        };

        try{
            var callback = function(error, resp, data){
                if(error)
                    res.send(JSON.parse(error))
                res.send(JSON.parse(data))
            }
            var request = require('request');
            request(requestOptions, callback);
        }
        catch(err){
            res.status(500).end()
        }
})

app.post('/sprint/ud/delete', function(req, res){    
    var headers = {
            'Content-Type': 'application/json',
            'Authorization': req.headers['authorization']
        };
    var requestOptions = {
            method: 'POST',
            uri: config.host+ 'sprint/ud/delete',
            headers: headers,
            json: req.body
        };

        try{
            var callback = function(error, resp, data){
                if(error)
                    res.send(JSON.parse(error))
                res.send(JSON.parse(data))
            }
            var request = require('request');
            request(requestOptions, callback);
        }
        catch(err){
            res.status(500).end()
        }
})

app.post('/sprint/ud/update', function(req, res){
    
    
    var headers = {
            'Content-Type': 'application/json',
            'Authorization': req.headers['authorization']
        };
    var requestOptions = {
            method: 'POST',
            uri: config.host+ 'sprint/ud/update',
            headers: headers,
            json: req.body
        };

        try{
            var callback = function(error, resp, data){
                if(error)
                    res.send(JSON.parse(error))
                res.send(JSON.parse(data))
            }

            var request = require('request');
            request(requestOptions, callback);
        }
        catch(err){
            res.status(500).end()
        }
})

app.post('/sprint/ud/search', function(req, res){
    var headers = {
            'Content-Type': 'application/json',
            'Authorization': req.headers['authorization']
        };
    var requestOptions = {
            method: 'POST',
            uri: config.host+ 'sprint/ud/search',
            headers: headers,
            json: req.body
        };

        try{
            var callback = function(error, resp, data){
                if(error)
                    res.send(JSON.parse(error))
                res.send(JSON.parse(data))
            }
            var request = require('request');
            request(requestOptions, callback);
        }
        catch(err){
            res.status(500).end()
        }
})


app.listen(3000)
console.log("App listening on port 3000")