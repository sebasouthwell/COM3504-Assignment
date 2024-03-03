var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('sighting', { title: 'Planttrest: Plant Sighting Form',stylesheets: ["css/bootstrap.min.css","stylesheets/style.css"], javascripts: ["javascripts/locationManager.js"]});
});

module.exports = router;