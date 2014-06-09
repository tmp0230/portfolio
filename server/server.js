var Config = require('./config'),
    express = require('express'),
    bodyParser = require('body-parser'),
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
            if(err) return done(err);
            if(!user) return done(null, false);

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
    if(req.isAuthenticated()) return next();
    res.redirect('/login/');
}

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

    .post(isLogged, function(req, res){

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

    .put(isLogged, function(req, res){

        Project.findOneAndUpdate({slug: req.params.project_slug}, req.body, function(err, project){

            if(err) return res.send(err);

            res.json(project);
        });
    })

    .delete(isLogged, function(req, res){

        Project.findOneAndRemove({slug: req.params.project_slug}, function(err){

            if(err) return res.send(err);

            res.json({status: 0});
        });
    });

router.route('/projects/:project_slug/').get(showProject);

// Admin
// =====

router.route('/join/')

    .get(function(req, res){

        if(req.isAuthenticated()) res.redirect('/admin/');
        else res.render('admin/partials/join.html');
    })

    .post(function(req, res){

        var email = req.body.email,
            password = req.body.password;

        User.findOne({email: email}, function(err, user){
            if(err) return done(err);
            if(user) return;

            var user = new User({email: email, password: password});

            user.save(function(err){

                if(err) return console.log(err);

                req.login(user, function(err){
                    if(err) return console.log(err);
                    res.redirect('/admin/');
                });
            });
        });
    });

router.route('/login/')

    .get(function(req, res){

        if(req.isAuthenticated()) res.redirect('/admin/');
        else res.render('admin/partials/login.html');
    })

    // .post(passport.authenticate('digest'/*, {failureRedirect: '/login/', successRedirect: '/admin/'}*/));

    .post(function(req, res, next){

        passport.authenticate('digest', function(err, user, info){

            if(err) return console.log(err);

            if(!user){
                res.set('WWW-Authenticate', 'x'+info);
                return res.send(401);
            }

            req.login(user, function(err){
                if(err) return console.log(err);
                res.send(200, '/admin/');
            });
        })(req, res, next);
    });

router.route('/logout/')

    .get(function(req, res){
        req.logout();
        res.redirect('/login/');
    });

router.route('/admin/')

    .get(isLogged, function(req, res){

        res.render('admin/partials/project-list.html');
    });

app.use(router);

// Database
// ========

mongoose.connect('mongodb://'+Config.MONGO_USER+':'+Config.MONGO_PASSWORD+'@'+Config.MONGO_HOST+':'+Config.MONGO_PORT+'/'+Config.MONGO_DB);

/*mongoose.connection.on('open', function(){

    User.findOne({username: Config.ADMIN_USERNAME}, function(err, user){

        if(err) return console.log(err);

        if(!user){
            var admin = new User({username: Config.ADMIN_USERNAME, password: Config.ADMIN_PASSWORD});

            admin.save(function(err){

                if(err) return console.log(err);
            });
        }
    });
});*/

app.listen(port);
console.log('Node listening on port '+port);
