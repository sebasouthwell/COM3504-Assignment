var express = require('express');
var router = express.Router();
var sighting = require('../controllers/sightings');
var multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/uploads/')
    },
    filename: function (req, file, cb) {
        var original = file.originalname;
        var extension = original.split(".");
        filename = Date.now() + "." + extension[extension.length - 1];
        cb(null, filename);
    }
});

let upload = multer({storage});

let stylesheets = ["/bootstrap/dist/css/bootstrap.min.css","/stylesheets/style.css","/bootstrap-icons/font/bootstrap-icons.css"];
let javascript = ["/jquery/dist/jquery.js","/bootstrap/dist/js/bootstrap.js","/bootstrap/dist/js/bootstrap.bundle.js"];
router.get('/', function(req, res, next) {
    js = javascript;
    js.push("javascripts/locationManager.js");
    js.push( "javascripts/searchPlants.js")
    res.render('index', { title: 'Planttrest: Plant Sighting Form',stylesheets: stylesheets, javascripts: js});
});

router.get('/sight', function(req, res, next) {
    js = javascript;
    js.push("javascripts/locationManager.js");
    js.push("javascripts/createSighting.js");
    res.render('sighting', { title: 'Planttrest: Plant Sighting Form',stylesheets: stylesheets, javascripts: js});
});

router.post('/sight/add',upload.single('photoUpload'),  function (req,res) {
    let sightingData = req.body;
    let filePath = "";
    if (req.file){
       filePath = req.file.filename;
    }
    if (sightingData.hasFruit === undefined){
        sightingData.hasFruit = false;
    }
    else{
        sightingData.hasFruit = true;
    }
    if (sightingData.hasSeeds === undefined){
        sightingData.hasSeeds = false;
    }else{
        sightingData.hasSeeds = true;
    }
    if (sightingData.hasFlowers === undefined){
        sightingData.hasFlowers = false;
    }else{
        sightingData.hasFlowers = true;
    }
    sightingData.dateTime = new Date(sightingData.dateTime);
    let result = sighting.create(sightingData, filePath);
    result.then((sighting) => {
        let s = JSON.parse(sighting);
        let id = s['_id'].toString();
        res.redirect('../sight_view/'+id)
    }).catch((err) => {
        console.log(err);
        res.render('error',{message: "Error adding sighting", error: err})
    })
    ;
});

router.get('/sight_view/:id', function(req, res, next) {
    let js = javascript;
    let css = stylesheets;
    let id = req.params['id'];
    let result = sighting.getByID(id);
    result.then((sighting) => {
        if (sighting === null){
            res.status(404).send("Sighting not found");
        }
        else{
            res.render('viewPlant', { title: 'Planttrest: Plant Sighting Form',stylesheets: stylesheets, javascripts: javascript,sighting: JSON.parse(sighting)});
        }
    });
});

router.get('/sun', function(req, res, next) {
    js = javascript;
    res.render('sun',{});
});

router.get('/login', function(req, res, next) {
    js = javascript;
    js.push("javascripts/indexDBHandler.js");
    res.render('login', { title: 'Planttrest: Login',stylesheets: stylesheets, javascripts: js});
});

router.get('/lions', function(req,res,next){
    res.render('test', { title: 'Lions'});
});

module.exports = router;