var express = require('express');
var router = express.Router();

router.get('/sightings', function(req, res, next) {
    res.render('sighting', { title: 'Planttrest: Plant Sighting Form',stylesheets: ["css/bootstrap.min.css","stylesheets/style.css"], javascripts: ["javascripts/locationManager.js"]});
});

router.get('/view_all', function(req, res, next) {
    res.render('plantselect', { title: 'Planttrest: Plant Sighting Form',stylesheets: ["css/bootstrap.min.css","stylesheets/style.css"], javascripts: ["javascripts/locationManager.js","javascripts/querySite.js"]});
});

module.exports = router;