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

let stylesheets = ["/bootstrap/dist/css/bootstrap.min.css", "/stylesheets/style.css", "/bootstrap-icons/font/bootstrap-icons.css", "/bootstrap-datetime-picker/css/bootstrap-datetimepicker.css", "http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.css"];
let javascript = ["/jquery/dist/jquery.js", "/bootstrap/dist/js/bootstrap.js", "/bootstrap/dist/js/bootstrap.bundle.js", "/bootstrap-datetime-picker/js/bootstrap-datetimepicker.js", "/javascripts/indexDBHandler.js", "/javascripts/nickname.js","http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.js"];

router.get('/', function (req, res, next) {
    js = javascript.slice();
    js.push("/javascripts/locationManager.js");
    js.push("/javascripts/searchPlants.js")
    query_map = {};
    if (!(req.query['i'] && req.query['p'])) {
        query_map['status'] = req.query['i'] ? "Identified" : "All";
        query_map['status'] = req.query['p'] ? "Pending" : query_map['status'];
        if (query_map['status'] === "All") {
            delete query_map['status'];
        }
    }
    // Create name filter with wildcards
    let result = sighting.getAllFilter(query_map);
    result.then((sightings) => {
        let sightings_json = JSON.parse(sightings);
        if (req.query['sort']) {
            if (req.query['sort'].startsWith('n')) {
                if (req.query['sort'].endsWith('a')) {
                    sightings_json.sort((a, b) => {
                        return a.plantName.localeCompare(b.plantName);
                    });
                } else {
                    sightings_json.sort((a, b) => {
                        return b.plantName.localeCompare(a.plantName);
                    });
                }
            } else if (req.query['sort'].startsWith('t')) {
                if (req.query['sort'].endsWith('lr')) {
                    sightings_json.sort((a, b) => {
                        return new Date(a.dateTime) - new Date(b.dateTime);
                    });
                } else {
                    sightings_json.sort((a, b) => {
                        return new Date(b.dateTime) - new Date(a.dateTime);
                    });
                }
            }
        }
        console.log(sightings_json.length);
        res.render('index', {
            title: 'Planttrest: Plant Sighting Form',
            stylesheets: stylesheets,
            javascripts: js,
            sightings: sightings_json
        });
    });
});

router.get('/sight', function (req, res, next) {
    js = javascript.slice();
    js.push("/javascripts/locationManager.js");
    js.push("/javascripts/createSighting.js");
    res.render('sighting', {title: 'Planttrest: Plant Sighting Form', stylesheets: stylesheets, javascripts: js});
});


router.get('/cache_links', function (req, res, next) {
    let images = sighting.getAllCache().then((images) =>{
        if (images == null) {
            res.render('cache_links', {images: null});
        }
        res.render('cache_links', {images: images});
    }).catch(() => {
        res.render('cache_links', {images: null});
    })
});


router.post('/sight/add', upload.single('photoUpload'), function (req, res) {
    let sightingData = req.body;
    let filePath = "";
    if (req.file) {
        filePath = req.file.filename;
    }
    if (sightingData.hasFruit === undefined) {
        sightingData.hasFruit = false;
    } else {
        sightingData.hasFruit = true;
    }
    if (sightingData.hasSeeds === undefined) {
        sightingData.hasSeeds = false;
    } else {
        sightingData.hasSeeds = true;
    }
    if (sightingData.hasFlowers === undefined) {
        sightingData.hasFlowers = false;
        delete sightingData.flowerColour;
    } else {
        sightingData.hasFlowers = true;
    }
    sightingData.dateTime = new Date(sightingData.dateTime);
    let result = sighting.create(sightingData, filePath);
    result.then((sighting) => {
        let s = JSON.parse(sighting);
        let id = s['_id'].toString();
        res.redirect('../sight_view/' + id)
    }).catch((err) => {
        console.log(err);
        res.render('error', {message: "Error adding sighting", error: err})
    })
    ;
});

router.get('/sight_view/:id', function (req, res, next) {
    let js = javascript.slice();
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
            if (jsSighting.photo != null && jsSighting.photo.length != 0) {
                jsSighting.photo = "/public/images/uploads/" + jsSighting.photo;
            }
            else{
                jsSighting.photo = 'https://hips.hearstapps.com/hmg-prod/images/high-angle-view-of-variety-of-succulent-plants-royalty-free-image-1584462052.jpg';
            }
            res.render('viewPlant', {
                title: 'Planttrest: WSPlant Sighting Form',
                stylesheets: css,
                javascripts: js,
                sighting: jsSighting
            });
        }
    });

});

// For pages that have not been uploaded to the mongoDB yet
router.get('/sight_view', (req, res) => {
    let js = javascript.slice();
    js.push('javascripts/localSightView.js');
    let css = stylesheets
    template = {
        userNickName: "NickName-Template",
        givenName: 'GivenName-Template',
        identificationStatus: "identificationStatus-Template",
        description: "Description-Template",
        lat: 11.899908819991197253,
        long: 11.8999088199911972531,
        sunExposureLevel: 11.899908819991197253,
        hasSeeds: true,
        hasFruit: true,
        hasFlowers: true,
        flowerColour: "Red",
        plantEstHeight: 11.899908819991197253,
        plantEstSpread: 11.899908819991197253,
        photo: 'photo-Template'
    }
    res.render('viewPlant', { title: 'Plantrest: Plant Sighting Form', stylesheets: css, javascripts: js, sighting: template})
});


router.get('/login', function (req, res, next) {
    js = javascript;
    res.render('login', {title: 'Planttrest: Login', stylesheets: stylesheets, javascripts: js});
});

module.exports = router;