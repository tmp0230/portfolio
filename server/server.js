'use strict';

var Config = require('./config'),
    express = require('express'),
    bodyParser = require('body-parser'), // get input data through req.body
    methodOverride = require('method-override'), // use hidden field _method to set put or delete
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    mongoose = require('mongoose'),
    nunjucks = require('nunjucks'),
    passport = require('passport'),
    morgan = require('morgan'),
    DigestStrategy  = require('passport-http').DigestStrategy,
    app = express(),
    router = express.Router(),
    port = process.env.PORT || 8080,
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

    res.send(401);
};

// App
// ===

app
    .use('/static/', express.static(__dirname+'/../public/dist'))
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

nunjucks.configure(__dirname + '/../templates', {
    express: app
});

// Router
// ======

//router.route('/').get(listProjects);
//router.route('/projects/:project_slug/').get(showProject);

// API
// ===

router.route('/api/projects')

    .get(function(req, res){

        Project.find(function(err, projects){

            if(err){
                return res.send(err);
            }

            res.json(projects);
        });
    })

    .post(isLogged, function(req, res){

        var project = new Project();

        // ...

        project.save(function(err){

            if(err){
                return res.send(err);
            }

            res.json(project);
        });
    });

router.route('/api/projects/:projectId')

    .get(function(req, res){

        Project.findById(req.params.projectId, function(err, project){

            if(err){
                return res.send(err);
            }

            res.json(project);
        });
    })

    .put(isLogged, bodyParser, function(req, res){

        Project.findByIdAndUpdate(req.params.projectId, req.body, function(err, project){

            if(err){
                return res.send(err);
            }

            res.json(project);
        });
    })

    .delete(isLogged, function(req, res){

        Project.findByIdAndRemove(req.params.projectId, function(err){

            if(err){
                return res.send(err);
            }

            res.send(200);
        });
    });

// Admin Project
// =============

router.route('/admin/')

    .get(function(req, res){

        res.render('admin/base.html');
    });

/*router.route('/projects/create/')

    .get(isLogged, function(req, res){

        res.render('admin/partials/project-form.html');
    });*/

// Admin User
// ==========

router.route('/join/')

    .post(bodyParser, function(req, res){

        var email = req.body.email,
            password = req.body.password;

        User.findOne({email: email}, function(err, user){
            if(err){
                return done(err);
            }
            if(user){
                return res.send(432); // Mail already exists in DB
            }

            var user = new User({email: email, password: password});

            user.save(function(err){

                if(err){
                    return res.send(err);
                }

                req.login(user, function(err){

                    if(err){
                        return res.send(err);
                    }

                    res.send(200);
                });
            });
        });
    });

router.route('/login/')

    .post(function(req, res, next){

        passport.authenticate('digest', function(err, user, info){

            if(err){
                return res.send(err);
            }

            if(!user){
                res.set('WWW-Authenticate', 'x'+info);

                return res.send(401);
            }

            req.login(user, function(err){

                if(err){
                    return res.send(err);
                }

                res.send(200);
            });

        })(req, res, next);
    });

router.route('/loggedin/')

    .get(function(req, res){
        if(req.isAuthenticated()){
            return res.send(200);
        }

        return res.send(401);
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
