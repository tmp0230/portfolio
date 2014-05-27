var Config = require('./config'),
    express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    consolidate = require('consolidate'),
    nunjucks = require('nunjucks'),
    passport = require('passport'),
    DigestStrategy = require('passport-http').DigestStrategy,
    app = express(),
    router = express.Router(),
    port = process.env.PORT || 8080,
    Project = require('./models/project');

// App
// ===

passport.use(new DigestStrategy({qop: 'auth'},
    function(username, done){
        User.findOne({username: username}, function(err, user){
            if(err) return done(err);
            if(!user) return done(null, false);
            return done(null, user, user.password);
        });
    }
));

app
    .use('/static/', express.static(__dirname+'/../public'))
    .use(bodyParser())
    .use(passport.initialize())
    .engine('html', consolidate.nunjucks)
    .set('view engine', 'html')
    .set('views', __dirname + '/../templates');

//nunjucks.configure({autoescape: true});
if( process.env.NODE_ENV == 'development' ){
    app.set('view cache', false);
}

// Router
// ======

var listProjects = function(req, res){

    Project.find(function(err, projects){

        if(err) res.send(err);

        req.is('json') ? res.json(projects) : res.render('layout/base', {projects: projects});
    });
};

var showProject = function(req, res){

    Project.findOne({slug: req.params.project_slug}, function(err, project){

        if(err) res.send(err);

        req.is('json') ? res.json(project) : res.render('index', {project: project});
    });
};

router.route('/api/projects')

    .get(listProjects)

    .post(passport.authenticate('digest', {session: false}), function(req, res){

        var project = new Project();

        // ...

        project.save(function(err){

            if(err) res.send(err);

            res.json({status: 0});
        });
    });

router.route('/').get(listProjects);

router.route('/api/projects/:project_slug')

    .get(showProject)

    .put(function(req, res){

        Project.findOneAndUpdate({slug: req.params.project_slug}, req.body, function(err, project){

            if(err) res.send(err);

            res.json(project);
        });
    })

    .delete(function(req, res){

        Project.findOneAndRemove({slug: req.params.project_slug}, function(err){

            if(err) res.send(err);

            res.json({status: 0});
        });
    });

router.route('/projects/:project_slug').get(showProject);

// Admin
// =====

//router.route('/admin');

app.use(router);

// Database
// ========

mongoose.connect('mongodb://muchir:'+Config.MONGO_PASSWORD+'@mongodb1.alwaysdata.com:27017/'+Config.MONGO_DB);

app.listen(port);
console.log('Node listening on port '+port);
