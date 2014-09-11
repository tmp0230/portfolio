'use strict';

var Config = require('./config'),
    express = require('express'),
    favicon = require('serve-favicon'),
    bodyParser = require('body-parser'), // get input data through req.body
    methodOverride = require('method-override'), // use hidden field _method to set put or delete
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    mongoose = require('mongoose'),
    nunjucks = require('nunjucks'),
    nunjucksGlobals = require('nunjucks/src/globals'), // check to remove it
    passport = require('passport'),
    morgan = require('morgan'),
    fs = require('fs'),
    multer = require('multer'),
    DigestStrategy  = require('passport-http').DigestStrategy,
    app = express(),
    router = express.Router(),
    port = process.env.PORT || 8080,
    filters = require('../filters/filters'),
    Project = require('./models/Project'),
    User = require('./models/User');

// Passport
// ========

passport.use(new DigestStrategy({qop: 'auth'},

    function(username, done){

        User.findOne({email: username}, function(err, user){
            if(err){
                return done(err);
            }
            if(!user){
                return done(null, false);
            }

            done(null, user, user.password);
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

var isLogged = function(req, res, next){

    if(req.isAuthenticated()){
        return next();
    }

    res.status(401).end();
};

// App
// ===

app
    .use('/static/', express.static(__dirname+'/../public/dist'))
    .use('/upload/', express.static(__dirname+'/../uploads'))
    .use(favicon(__dirname+'/../public/dist/favicon.ico'))
    .use(morgan('dev'))
    .use(methodOverride())
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

nunjucksGlobals.env = process.env.NODE_ENV;

var env = nunjucks.configure(__dirname + '/../templates', {
    express: app
});

filters(env);

// Router
// ======

router.route('/')

    .get(function(req, res){

        Project.find(function(err, projects){

           res.render('extends/project-list.html', {url: '/', projects: projects});
        });
    });

router.route('/projects/:projectSlug/')

    .get(function(req, res){

        Project.findOne({slug: req.params.projectSlug}, function(err, project){

            res.render('extends/project-show.html', {project: project});
        });
    });

// API
// ===

router.route('/api/projects')

    .get(function(req, res){

        Project.find(function(err, projects){

            if(err){
                return res.status(err.code, err.message).end();
            }

            res.json(projects);
        });
    })

    .post(isLogged, bodyParser.urlencoded({extended: true}), bodyParser.json(), function(req, res){

        var project = new Project(req.body);

        project.save(function(err){

            if(err){
                return res.status(err.code, err.message).end();
            }

            res.json(project);
        });
    });

router.route('/api/projects/:projectId')

    .get(function(req, res){

        Project.findById(req.params.projectId, function(err, project){

            if(err){
                return res.status(err.code, err.message).end();
            }

            res.json(project);
        });
    })

    .put(isLogged, bodyParser.urlencoded({extended: true}), bodyParser.json(), function(req, res){

        delete req.body._id;

        Project.findByIdAndUpdate(req.params.projectId, req.body, function(err, project){

            if(err){
                return res.status(err.code, err.message).end();
            }

            res.json(project);
        });
    })

    .delete(isLogged, function(req, res){

        Project.findByIdAndRemove(req.params.projectId, function(err){

            if(err){
                return res.status(err.code, err.message).end();
            }

            res.status(200).end();
        });
    });

router.route('/api/teams')

    .get(function(req, res){

        Project.find().distinct('team', function(err, teams){

            if(err){
                return res.status(err.code, err.message).end();
            }

            res.json(teams);
        });
    });

router.route('/api/credits')

    .get(function(req, res){

        Project.find().distinct('credits', function(err, credits){

            if(err){
                return res.status(err.code, err.message).end();
            }

            res.json(credits);
        });
    });

router.route('/api/technicals')

    .get(function(req, res){

        Project.find().distinct('technical', function(err, technical){

            if(err){
                return res.status(err.code, err.message).end();
            }

            res.json(technical);
        });
    });

// Admin File Uploads
// ==================

router.route('/upload/')

    .post(isLogged, multer({dest: __dirname + '/../uploads'}), function(req, res){
        console.log(req.files);

        res.send({originalname: req.files.file.originalname, name: req.files.file.name});
    });

// Admin Project
// =============

router.route('/admin/')

    .get(function(req, res){

        res.render('admin/base.html');
    });

// Admin User
// ==========

router.route('/join/')

    .post(bodyParser.urlencoded({extended: true}), bodyParser.json(), function(req, res){

        var email = req.body.email,
            password = req.body.password;

        User.findOne({email: email}, function(err, user){
            if(err){
                return res.status(err.code, err.message).end();
            }
            if(user){
                return res.status(432, 'This email already exists').end(); // Mail already exists in DB
            }

            var user = new User({email: email, password: password});

            user.save(function(err){

                if(err){
                    return res.status(err.code, err.message).end();
                }

                req.login(user, function(err){

                    if(err){
                        return res.status(err.code).end();
                    }

                    res.status(200).end();
                });
            });
        });
    });

router.route('/login/')

    .post(function(req, res, next){

        passport.authenticate('digest', function(err, user, info){

            if(err){
                return res.status(err.code).end();
            }

            if(!user){
                res.set('WWW-Authenticate', 'x'+info);

                return res.status(401).end();
            }

            req.login(user, function(err){

                if(err){
                    return res.status(err.code).end();
                }

                res.status(200).end();
            });

        })(req, res, next);
    });

router.route('/loggedin/')

    .get(function(req, res){
        if(req.isAuthenticated()){
            return res.status(200).end();
        }

        return res.status(401).end();
    });

router.route('/logout/')

    .get(function(req, res){
        req.logout();
        res.redirect('/');
    });

app.use(router);

// Database
// ========

mongoose.connect('mongodb://'+Config.MONGO_USER+':'+Config.MONGO_PASSWORD+'@'+Config.MONGO_HOST+':'+Config.MONGO_PORT+'/'+Config.MONGO_DB);

app.listen(port);
console.log('Node listening on port '+port);
