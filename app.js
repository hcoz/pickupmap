const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const memCache = require('./memory-cache');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views'));

// render main page
app.get('/', (req, res) => res.sendFile('/views/index.html'));

// response the postal code request
app.get('/pickuplist', (req, res, next) => {
    let postalCode = req.query.postalCode;
    let cachedList = memCache.get(postalCode);
    // if the list exists in memory cache return it
    if (cachedList) {
        res.send({ data: cachedList });
        return next();
    }

    axios.get('https://api.bring.com/pickuppoint/api/pickuppoint/DK/postalCode/' + postalCode + '.json')
        .then((response) => {
            if (response.data.pickupPoint.length > 0) {
                let pickupList = response.data.pickupPoint.map((item) => { 
                    return { id: item.id, name: item.name, lat: item.latitude, lng: item.longitude}; 
                });
                // add new list to cache
                memCache.set(postalCode, pickupList);
                res.status(200).send({ data: pickupList });
                return next();
            } else {
                res.status(400).send({ message: 'No result is found'});
                return next();
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(400).send({ message: 'An error occured' });
            return next();
        });
});

app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
