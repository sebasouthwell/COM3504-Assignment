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

let stylesheets = ["bootstrap/dist/css/bootstrap.min.css","stylesheets/style.css","bootstrap-icons/font/bootstrap-icons.css"];
let javascript = ["jquery/dist/jquery.js","bootstrap/dist/js/bootstrap.js","bootstrap/dist/js/bootstrap.bundle.js"];
router.get('/', function(req, res, next) {
    js = javascript;
    js.push("javascripts/locationManager.js");
    js.push( "javascripts/searchPlants.js")
    res.render('index', { title: 'Planttrest: Plant Sighting Form',stylesheets: stylesheets, javascripts: js});
});

router.get('/sight', function(req, res, next) {
    js = javascript;
    js.push("javascripts/locationManager.js");
    res.render('sighting', { title: 'Planttrest: Plant Sighting Form',stylesheets: stylesheets, javascripts: js});
});

router.post('/sight/add',upload.single('photoUpload'),  function (req,res) {
    let sightingData = req.body;
    let filePath = req.file.filename;
    let count = sighting.count();
    console.log("Count" + count);
    if (count === 0 || isNaN(count)){
        sightingData.sightingID = 1;
    } else {
        sightingData.sightingID = count + 1;
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
    console.log(sightingData);
    let result = sighting.create(sightingData, filePath);
    res.redirect('/');
});

module.exports = router;