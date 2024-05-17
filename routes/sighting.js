var express = require('express');
var router = express.Router();
var sighting = require('../controllers/sightings');
var message = require('../controllers/message');
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
let javascript = ["https://cdn.socket.io/4.5.4/socket.io.min.js", "/jquery/dist/jquery.js", "/bootstrap/dist/js/bootstrap.js", "/bootstrap/dist/js/bootstrap.bundle.js", "/bootstrap-datetime-picker/js/bootstrap-datetimepicker.js", "/javascripts/indexDBHandler.js","/javascripts/form_handler.js","/javascripts/name_and_sockets.js", "/javascripts/syncSightings.js", "/javascripts/sighting.js", "http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.js"];

router.get('/', function(req, res, next) {
    let js = javascript.slice();
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
                } else {
                    sightings_json.sort((a, b) => {
                        return b.plantName.localeCompare(a.plantName);
                    });
                }
            }
            else if (sortBy.startsWith('t')){
                if (sortBy.endsWith('lr')){
                    sightings_json.sort((a,b) => {
                        return new Date(a.dateTime) - new Date(b.dateTime);
                    });
                } else {
                    sightings_json.sort((a, b) => {
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
    js.push("/javascripts/SPARQLHandler.js")
    res.render('sighting', {title: 'Planttrest: Plant Sighting Form', stylesheets: stylesheets, javascripts: js});
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
// route to get all sightings
router.get('/sightings', function (req, res, next) {
    sighting.getAll().then(sightings => {
        console.log(sightings);
        return res.status(200).send(sightings);
    }).catch(err => {
        console.log(err);
        res.status(500).send(err);
    });
})

router.get('/cache_links', function (req, res, next) {
    let images = sighting.getAllCache().then((images) => {
        if (images == null) {
            res.status(200).send([]);
        }
        res.status(200).send(images)
    }).catch(() => {
        res.status(200).send([]);
    })
})

router.get('/user_sightings/:nickname', function (req, res, next) {
    let nicknameValue = req.params['nickname'];
    sighting.getIDsByNickname(nicknameValue).then(sightingIDs => {
        console.log(sightingIDs);
        return res.status(200).send(sightingIDs);
    }).catch(err => {
        console.log(err);
        res.status(500).send(err);
    });
})

router.get('/sight_messages/:sighting_id', function (req, res) {
    let sightingID = req.params['sighting_id'];
    message.getAllBySighting(sightingID).then(messages => {
        console.log(messages);
        return res.status(200).send(messages);
    }).catch(err => {
        console.log(err);
        res.status(500).send(err);
    });
});

router.post('/upload/sighting', upload.single('photo'), function (req, res){
    let sightingData = req.body;
    console.log()
    sighting.idempotency_check(sightingData._id).then((taken) => {
        console.log(taken)
        if (!taken){
            let filePath = "";
            if (req.file) {
                filePath = req.file.filename;
            }
            console.log(`file path ${filePath}`)
            sightingData.hasFlowers = sightingData.hasFlowers === 'true';
            sightingData.hasSeeds = sightingData.hasSeeds === 'true';
            sightingData.hasFruit = sightingData.hasFruit === 'true';
            sightingData.lat = parseFloat(sightingData.lat)
            sightingData.long = parseFloat(sightingData.long)
            sightingData.plantEstHeight = parseFloat(sightingData.plantEstHeight)
            sightingData.plantEstSpread = parseFloat(sightingData.plantEstSpread)
            sightingData.sunExposureLevel = parseInt(sightingData.sunExposureLevel)
            sightingData.dateTime = new Date(sightingData.dateTime);
            /* Commented out due to being broken - remove in merge
            let result = sighting.create(sightingData, filePath).then(
                (sight) =>{
                    if (sight !== null) {
                        let s = JSON.parse(sight);
                        let id = s['_id'].toString();
                        console.log(id);
                        res.status(200).send({id:id});
                    }
                    else{
                        sighting.idempotency_check(sightingData._id).then(
                            (match) => {
                                res.status(200).send({id: match});
                            }
                        )
                    }
                }
            );*/
        }
        else{
            res.status(409).send({id: taken});
        }
    })
});

router.post('/upload/chat', async (req, res) =>{
    let chatData = req.body;
    message.idempotency_check(chatData.idempotency_token).then(async (taken) => {
        if (!taken) {
            let sightingRoom = chatData.room;
            if (!chatData.onlinePage) {
                sightingRoom = await sighting.idempotency_check(chatData.room).then((id) => {
                    return id
                });
            }
            if (!sightingRoom){
                res.status(403).send({state: 'failed'})
            }else{
                let message_data = message.create({
                        sighting: sightingRoom,
                        userNickName: chatData.userNickName,
                        message: chatData.message,
                        dateTimestamp: chatData.dateTimestamp,
                        idempotency_token: chatData.idempotency_token,
                    }
                ).then((message_data) => {
                    if (message_data !== null) {
                        let m = JSON.parse(message_data);
                        let id = m['_id'].toString();
                        console.log(id);
                        res.status(200).send({state: 'success'});
                    } else {
                        message.idempotency_check(chatData.idempotency_token).then(
                            (match) => {
                                if (!match) {
                                    // If the Idempotency does not exist, then return failed response
                                    res.status(409).send({state: 'failed'});
                                } else {
                                    // If match exists, message of idempotency is in DB
                                    res.status(200).send({state: 'success'});
                                }
                            }
                        )
                    }
                })
            }
        } else {
            res.status(200).send({state: 'success'}); // Message already exists, it is already on server
        }
    })
})

router.get('/sight_view/:id', function (req, res, next) {
    let js = javascript.slice();
    js.push('/javascripts/syncSightings.js')
    let css = stylesheets;
    let id = req.params['id'];
    let result = sighting.getByID(id);
    result.then((sighting) => {
        if (sighting === null || sighting === "null") {
            res.status(404).send("Sighting not found");
        } else {
            let jsSighting = JSON.parse(sighting);
            // extract the lat and long from the Schema.Types.Decimal128,
            // and convert them to a number
            if (jsSighting.photo != null && jsSighting.photo.length != 0) {
                jsSighting.photo = "/images/uploads/" + jsSighting.photo;
            } else {
                jsSighting.photo = 'https://hips.hearstapps.com/hmg-prod/images/high-angle-view-of-variety-of-succulent-plants-royalty-free-image-1584462052.jpg';
            }
            res.render('viewPlant', {
                title: 'Planttrest: Plant Sighting Form',
                stylesheets: css,
                javascripts: js,
                sighting: jsSighting
            });
        }
    });
});

router.get('/sighting_data/:id', function (req, res) {
    let id = req.params['id'];
    sighting.getByID(id).then(sightingByID => {
        console.log(sightingByID);
        return res.status(200).send(sightingByID);
    }).catch(err => {
        console.log(err);
        res.status(500).send(err);
    });
});
// For pages that have not been uploaded to the mongoDB yet
router.get('/sight_view', (req, res) => {
    let js = javascript.slice();
    js.push('/javascripts/localSightView.js');

    let css = stylesheets
    let template = {
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
    res.render('viewPlant', {
        title: 'Plantrest: Plant Sighting Form',
        stylesheets: css,
        javascripts: js,
        sighting: template
    })
});
router.get('/login', function (req, res, next) {
    js = javascript.slice();
    js.push("/javascripts/login.js");
    res.render('login', {title: 'Planttrest: Login', stylesheets: stylesheets, javascripts: js});
});

module.exports = router;