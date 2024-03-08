var express = require('express');
var router = express.Router();

/* GET home page. */
let stylesheets = ["bootstrap/dist/css/bootstrap.min.css","stylesheets/style.css","bootstrap-icons/font/bootstrap-icons.css"];
let javascript = ["jquery/dist/jquery.js"];
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Planttrest: Plant Sighting Form',stylesheets: ["bootstrap/dist/css/bootstrap.min.css","stylesheets/style.css","bootstrap-icons/font/bootstrap-icons.css"], javascripts: ["jquery/dist/jquery.js","javascripts/locationManager.js","javascripts/querySite.js", "javascripts/searchPlants.js"]});
});
module.exports = router;
