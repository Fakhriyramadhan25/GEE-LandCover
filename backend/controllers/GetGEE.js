const express = require('express');
const router = express.Router();

const ee = require('@google/earthengine');
const GEEdata = require('../asset/Area.json');

router.post('/', async (req, res)=>{
    const {imageYear} = req.body;

    // Define the Asset ID
var assetId = `projects/ee-ramadhan/assets/PL_KLHK_Raster_v1/KLHK_PL_${imageYear}_raster_v1`;

// Load the land cover image
var landCoverImage = ee.Image(assetId);

// Your GeoJSON Feature Collection
var geoJsonData = GEEdata;

// Create an Earth Engine Feature Collection from GeoJSON
var featureCollection = ee.FeatureCollection(geoJsonData);

// Clip the land cover image to the Feature Collection
var clippedImage = landCoverImage.clip(featureCollection);


var classNames = [
  "High density dryland forest", "Medium density dryland forest", "High density swamp forest",
  "Medium density swamp forest", "High density mangrove forest", "Medium density mangrove forest",
  "Low-level vegetation", "Inundated low-level vegetation", "Built-up", "Bareland", "Oil palm", "Coconut", 
  "Wood shrubs", "Rubber plantation", "Timber plantation", "Banana plantation", "Water", "Ponds", 
  "Snow/Ice", "unknown"
  ]

var classValues = [
  11, 12, 21, 22, 31, 32, 40, 50, 60, 70, 80, 90,
  100, 101, 102, 103, 110, 111, 200, 255
  ]
  
    var res_area = classValues.map(function(value, index){
      var featureArea = clippedImage.eq(value).multiply(ee.Image.pixelArea().divide(10000)).reduceRegion({
        reducer: ee.Reducer.sum(),
        scale: 10,
        bestEffort: true
      }).get('LULC');
    var list = ee.List([classNames[index], ee.Number(featureArea).ceil(), 'Ha']);
    return list;
    });


    var res_21 = [
      ["High density dryland forest","0.0"],
      ["Medium density dryland forest","0.0"],
      ["High density swamp forest","0.0"],
      ["Medium density swamp forest","0.0"],
      ["High density mangrove forest","0.0"],
      ["Medium density mangrove forest","0.0"],
      ["Low-level vegetation","3441.0"],
      ["Inundated low-level vegetation","0.0"],
      ["Built-up","0.0"],
      ["Bareland","4276.0"],
      ["Oil palm","8671.0"],
      ["Coconut","2353.0"],
      ["Wood shrubs","10012.0"],
      ["Rubber plantation","0.0"],
      ["Timber plantation","0.0"],
      ["Banana plantation","0.0"],
      ["Water","0.0"],
      ["Ponds","0.0"],
      ["Snow/Ice","0.0"],
      ["unknown","0.0"]
  ]

  var res_11 = [
    ["High density dryland forest","0.0"],
    ["Medium density dryland forest","0.0"],
    ["High density swamp forest","0.0"],
    ["Medium density swamp forest","0.0"],
    ["High density mangrove forest","0.0"],
    ["Medium density mangrove forest","0.0"],
    ["Low-level vegetation","12435.0"],
    ["Inundated low-level vegetation","0.0"],
    ["Built-up","0.0"],
    ["Bareland","69.0"],  
    ["Oil palm","6455.0"],  
    ["Coconut","1599.0"],  
    ["Wood shrubs","4701.0"],  
    ["Rubber plantation","0.0"],  
    ["Timber plantation","0.0"],
    ["Banana plantation","0.0"],  
    ["Water","3495.0"],  
    ["Ponds","0.0"],  
    ["Snow/Ice","0.0"],  
    ["unknown","0.0"]
  ]



// Define a palette for the 18 distinct land cover classes.
var igbpPalette = [
  '152106', '225129', '369b47', '30eb5b', '387242', '6a2325', // forest
  'c3aa69', 'b76031', // low level vegetation
  'd9903d', // built-up
  '91af40',  // barelands
  '111149', // oil palm 
  'cdb33b', // coconut
  'cc0013', // wood shrubs
  '33280d', // rubber
  'AAC9AB', // timber
  'FFFF55', // banana
  'aec3d4', // water
  'f7e084', // ponds
  'd7cdcc', // snow and ice
  '001D00', // unknown
];


    const visualParams = {
        'bands': ['LULC'],
        'min': 0, 
        'max': 200, 
        'palette': igbpPalette
    }

    const eeImage = ee.Image(clippedImage);
    const mapInfo = eeImage.getMapId(visualParams);

    response_result = {
      url: mapInfo.urlFormat,
      area21: res_21,
      area11: res_11
    }

    res.status(200).json(response_result);
}

)

module.exports = router;