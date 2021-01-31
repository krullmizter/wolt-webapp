import express from 'express';
const server  = express();
const port    = 8081;

const appData = require('../data/restaurants.json');

let long: number;
let lat: number;

let restaurants: Array<number> = appData.restaurants;
let distanceMap = new Map();

let popularMap = new Map();
let newestMap  = new Map();
let nearestMap = new Map();

let popularMapSorted = new Map();
let newestMapSorted  = new Map();
let nearestMapSorted = new Map();

let popularMapSortedKeys: number;
let newestMapSortedKeys:  number;
let nearestMapSortedKeys: number;

let popularJSON: any[] = [];
let newestJSON:  any[] = [];
let nearestJSON: any[] = [];

function distance(long:number, lat:number) {
    popularMap.clear();
    newestMap.clear();
    nearestMap.clear();

    for (let i = 0; i < restaurants.length; i++) {
        let resturantLat:number  = appData.restaurants[i].location[0];
        let resturantLong:number = appData.restaurants[i].location[1];
        
        let radlat1  = Math.PI * lat / 180;
        let radlat2  = Math.PI * resturantLat / 180;
        let theta    = long - resturantLong;
        let radtheta = Math.PI * theta / 180;
        let dist     = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);

        if (dist > 1) {
            dist = 1;
        }

        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515;
        dist = dist * 1.609344; // In km
        
        if (dist <= 1.5) {
            distanceMap.set(i, dist);
        }
    }
    
    if (distanceMap.size < 1) {
        console.log("No restaurants were close enough..."); 
        
    } else {
        logic();
    }
}

function logic() {
    for (let i = 0; i < restaurants.length; i++) {
        let open:boolean = appData.restaurants[i].online;

        if (distanceMap.has(i) && open == true) {
            popularMap.set(i, appData.restaurants[i].popularity);
            newestMap.set(i,  appData.restaurants[i].launch_date);
            nearestMap.set(i, appData.restaurants[i].location);
        }
    }

    /*while (popularMap.size < 10) {
        popularMap.set(popularMap.size - 1, appData.restaurants[popularMap.size - 1].popularity);
    }

    while (newestMap.size < 10) {
        newestMap.set(newestMap.size - 1, appData.restaurants[newestMap.size - 1].launch_date);
    }

    while (nearestMap.size < 10) {
        nearestMap.set(nearestMap.size - 1, appData.restaurants[nearestMap.size - 1].location);
    }*/

    popular();
    newest();
    nearest();
}

function util(map: any, mapSorted: any, sort:string, keys: any, json: any) {
    if (sort === "desc") {
        mapSorted = new Map([...map].sort((b, a) => String(a[1]).localeCompare(b[1])));

    } else if (sort === "asc") {
        mapSorted = new Map([...map].sort((a, b) => String(a[1]).localeCompare(b[1])));
    }

    keys = mapSorted.keys();

    if(json < 10) {
        let l;

        if (mapSorted.size < 10) {
            l = mapSorted.size;

        } else {
            l = 10;
        }

        for (let i = 0; i < l; i++) {
            let j = keys.next().value;
    
            json.push(appData.restaurants[j]);
        }
    }
    
}

function popular() {
    util(popularMap, popularMapSorted, "desc", popularMapSortedKeys, popularJSON);
}

function newest() {
    util(newestMap, newestMapSorted, "desc", newestMapSortedKeys, newestJSON);
}

function nearest() {
    util(nearestMap, nearestMapSorted, "asc", nearestMapSortedKeys, nearestJSON);
}

let finalJSON = {
    "sections": [
        {
            "title": "Popular Restaurants",
            "restaurants": popularJSON
        },
        {
             "title": "New Restaurants",
             "restaurants": newestJSON
        },
        {
            "title": "Nearest Restaurants",
            "restaurants": nearestJSON
        }
    ]
};

server.listen(port, () => console.log(`Server running on http://localhost:${port}`));

server.get('/discovery', (req, res) => {
    long = req.query.long as unknown as number;
    lat  = req.query.lat as unknown as number;

    distance(long, lat);

    res.json(finalJSON);
});