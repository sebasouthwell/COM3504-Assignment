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
let javascript = ["/jquery/dist/jquery.js","/bootstrap/dist/js/bootstrap.js","/bootstrap/dist/js/bootstrap.bundle.js","/javascripts/indexDBHandler.js","/javascripts/nickname.js"];

router.get('/', function(req, res, next) {
    js = javascript;
    js.push("/javascripts/locationManager.js");
    js.push("/javascripts/searchPlants.js");

    let sortBy = req.query['sort'];
    let currentLocation = req.query['coords'];
    let result = sighting.getAllFilter(req.query);
    result.then((sightings) => {
        let sightings_json = JSON.parse(sightings);
        if (sortBy){
            if (sortBy.startsWith('n')){
                if (sortBy.endsWith('a')) {
                    sightings_json.sort((a, b) => {
                        return a.plantName.localeCompare(b.plantName);
                    });
                }
                else
                {
                    sightings_json.sort((a,b) => {
                        return b.plantName.localeCompare(a.plantName);
                    });
                }
            }
            else if (sortBy.startsWith('t')){
                if (sortBy.endsWith('lr')){
                    sightings_json.sort((a,b) => {
                        return new Date(a.dateTime) - new Date(b.dateTime);
                    });
                }
                else{
                    sightings_json.sort((a,b) => {
                        return new Date(b.dateTime) - new Date(a.dateTime);
                    });
                }
            }
            else if (sortBy.startsWith('l')){
                if (sortBy.endsWith('cl')){
                    sightings_json.sort((a,b) => {
                        return findRadius(a, currentLocation) - findRadius(b, currentLocation);
                    });
                }
                else{
                    sightings_json.sort((a,b) => {
                        return findRadius(b, currentLocation) - findRadius(a, currentLocation);
                    });
                }
            }
        }
        console.log(sightings_json.length);
        res.render('index', { title: 'Planttrest: Plant Sighting Form',stylesheets: stylesheets, javascripts: js, sightings: sightings_json });
    });
});
function findRadius(sighting, currentLocation){
    console.log('k')
    coords = currentLocation.split(',');
    lat = parseInt(coords[0]);
    long = parseInt(coords[1]);
    let sighting_lat = parseInt(sighting.lat);
    let sighting_long = parseInt(sighting.long)
    return Math.sqrt(
        Math.pow(Math.abs(sighting_lat - lat), 2)+Math.pow(Math.abs(sighting_long - long), 2)
    )
}
router.get('/sight', function(req, res, next) {
    js = javascript;
    js.push("/javascripts/locationManager.js");
    js.push("/javascripts/createSighting.js");
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
        delete sightingData.flowerColour;
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
    console.log(id);
    let result = sighting.getByID(id);

    result.then((sighting) => {
        if (sighting === null || sighting === "null") {
            res.status(404).send("Sighting not found");
        } else {
            let jsSighting = JSON.parse(sighting);
            // extract the lat and long from the Schema.Types.Decimal128,
            // and convert them to a number
            res.render('viewPlant', {
                title: 'Planttrest: Plant Sighting Form',
                stylesheets: stylesheets,
                javascripts: javascript,
                sighting: JSON.parse(sighting)
            });
        }
    });
});

router.get('/sun', function(req, res, next) {
    js = javascript;
    res.render('sun',{});
});

router.get('/login', function(req, res, next) {
    js = javascript;
    res.render('login', { title: 'Planttrest: Login',stylesheets: stylesheets, javascripts: js});
});

router.get('/lions', function(req,res,next){
    res.render('test', { title: 'Lions'});
});

module.exports = router;