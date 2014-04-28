var Config = require('./config'),
    express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    swig = require('swig'),
    app = express(),
    router = express.Router(),
    port = process.env.PORT || 8080,
    Project = require('./models/Project');

// App
// ===

app
    .use('/static/', express.static(__dirname+'/../public'))
    .use(bodyParser())
    .engine('html', swig.renderFile)
    .set('view engine', 'html')
    .set('views', __dirname + '/../templates');

// Router
// ======

var listProjects = function(req, res){

    Project.find(function(err, projects){

        if(err) res.send(err);

        req.is('json') ? res.json(projects) : res.render('partials/list-projects', {projects: projects});
    });
};

var showProject = function(req, res){

    Project.findOne(req.params.project_slug, function(err, project){

        if(err) res.send(err);

        req.is('json') ? res.json(project) : res.render('index', {project: project});
    });
};

router.route('/api/projects')

    .get(listProjects)

    .post(function(req, res){

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

app.use(router);

// Database
// ========

mongoose.connect('mongodb://muchir:'+Config.MONGO_PASSWORD+'@mongodb1.alwaysdata.com:27017/muchir_nodefolio');

app.listen(port);
console.log('Node listening on port '+port);
