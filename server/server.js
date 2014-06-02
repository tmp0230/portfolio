var Config = require('./config'),
    express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    mongoose = require('mongoose'),
    nunjucks = require('nunjucks'),
    passport = require('passport'),
    crypto = require('crypto'),
    morgan = require('morgan'),
    DigestStrategy = require('passport-http').DigestStrategy,
    app = express(),
    router = express.Router(),
    port = process.env.PORT || 8080,
    Project = require('./models/Project'),
    User = require('./models/User');

// Passport
// ========

passport.use(new DigestStrategy({qop: 'auth'},
    function(username, done){
        User.findOne({username: username}, function(err, user){
            if(err) return done(err);
            if(!user) return done(null, false);
            return done(null, user, user.password);
        });
    }
));

passport.serializeUser(function(user, done){
    done(null, user.id);
});

passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        done(err, user);
    });
});

// App
// ===

app
    .use('/static/', express.static(__dirname+'/../public'))
    .use(morgan('dev'))
    .use(bodyParser())
    .use(cookieParser())
    .use(session({secret: Config.SESSION_SECRET}))
    .use(passport.initialize())
    .use(passport.session());

// Safari blank page hack
// ======================

app.use(function(req, res, next){
    var agent = req.headers['user-agent'];
    if(agent.indexOf('Safari') > -1 && agent.indexOf('Chrome') === -1 && agent.indexOf('OPR') === -1){
        res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.header('Pragma', 'no-cache');
        res.header('Expires', 0);
    }

    next();
});

nunjucks.configure(__dirname + '/../templates', {
    express: app
});

// Router
// ======

var listProjects = function(req, res){

    Project.find(function(err, projects){

        if(err) res.send(err);

        req.is('json') ? res.json(projects) : res.render('partials/project-list.html', {projects: projects});
    });
};

var showProject = function(req, res){

    Project.findOne({slug: req.params.project_slug}, function(err, project){

        if(err) res.send(err);

        req.is('json') ? res.json(project) : res.render('partials/project-show.html', {project: project});
    });
};

router.route('/api/projects/')

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

router.route('/api/projects/:project_slug/')

    .get(showProject)

    .put(passport.authenticate('digest', {session: false}), function(req, res){

        Project.findOneAndUpdate({slug: req.params.project_slug}, req.body, function(err, project){

            if(err) res.send(err);

            res.json(project);
        });
    })

    .delete(passport.authenticate('digest', {session: false}), function(req, res){

        Project.findOneAndRemove({slug: req.params.project_slug}, function(err){

            if(err) res.send(err);

            res.json({status: 0});
        });
    });

router.route('/projects/:project_slug/').get(showProject);

// Admin
// =====

router.route('/login/')
    .get(function(req, res){
        res.render('admin/partials/login.html');
    })

    .post(passport.authenticate('digest', {successRedirect: '/admin/'}));

router.route('/admin/').get(passport.authenticate('digest', {failureRedirect: '/login/'}), function(req, res){

    res.render('admin/partials/project-list.html');
});

app.use(router);

// Database
// ========

mongoose.connect('mongodb://'+Config.MONGO_USER+':'+Config.MONGO_PASSWORD+'@'+Config.MONGO_HOST+':'+Config.MONGO_PORT+'/'+Config.MONGO_DB);

mongoose.connection.on('open', function(){

    User.findOne({username: Config.ADMIN_USERNAME}, function(err, user){

        if(err) return console.log(err);

        if(!user){
            var admin = new User({username: Config.ADMIN_USERNAME, password: Config.ADMIN_PASSWORD});

            admin.save(function(err){

                if(err) return console.log(err);
            });
        }
    });
});

app.listen(port);
console.log('Node listening on port '+port);
