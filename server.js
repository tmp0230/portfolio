var express = require('express'),
    swig = require('swig'),
    routes = require('./routes'),
    api = require('./routes/api'),
    app = express(),
    server;

app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname+'/views');

app.use(express.logger());

app.configure('production', function(){
    app.use(express.compress());
});

app.use(express.static(__dirname+'/public'));

// Allow us to use the PUT and DELETE verbs directly in express using app.put, app.delete instead off app.post

//app.use(express.methodOverride());

// Routes

app.get('/', routes.index)
.get('/partials/:name', routes.partials);

// API

app.get('/api/name', api.name);

server = app.listen(3000, function(){

    console.log('Listening on port %d', server.address().port);
});
