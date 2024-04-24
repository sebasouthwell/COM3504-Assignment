var express = require('express');
var router = express.Router();

let stylesheets = ["bootstrap/dist/css/bootstrap.min.css","stylesheets/style.css","bootstrap-icons/font/bootstrap-icons.css"];
let javascript = ["jquery/dist/jquery.js","bootstrap/dist/js/bootstrap.js","bootstrap/dist/js/bootstrap.bundle.js","javascripts/indexDBHandler.js","javascripts/nickname.js"];
router.get('/', function(req, res, next) {
    js = javascript;
    js.push("javascripts/locationManager.js");
    res.render('index', { title: 'Planttrest: Plant Sighting Form',stylesheets: stylesheets, javascripts: js});
});

router.get('/sightings', function(req, res, next) {
    js = javascript;
    js.push("javascripts/locationManager.js");
    res.render('sighting', { title: 'Planttrest: Plant Sighting Form',stylesheets: stylesheets, javascripts: js});
});

router.get('/view_all', function(req, res, next) {
    js = javascript;
    js.push("javascripts/locationManager.js");
    js.push("javascripts/querySite.js");
    res.render('plantselect', { title: 'Planttrest: Plant Sighting Form',stylesheets: stylesheets, javascripts: js});
});

router.get('/login', function(req, res, next) {
    js = javascript;
    res.render('login', { title: 'Planttrest: Login',stylesheets: stylesheets, javascripts: js});
});

module.exports = router;