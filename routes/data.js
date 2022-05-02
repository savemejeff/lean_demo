'use strict';
var router = require('express').Router();
var AV = require('leanengine');
const bodyParser = require('body-parser')
const multer = require('multer') // v1.0.5
const upload = multer()

var Data = AV.Object.extend('Data');
router.get('/', function(req, res, next) {
    var key = req.query.key;
    var query = new AV.Query(Data);
    query.equalTo('Key', key);
    query.first().then(result => {
        if (result) {
            res.send(result.get('Value'));
        }
    }).finally(() => {
        res.end();
    });
})

router.post('/', upload.array(), function(req, res, next) {
    var key = req.body.key;
    var value = req.body.value;
    var query = new AV.Query(Data);
    query.equalTo('Key', key);
    query.first().then(result => {
        if (result) {
            var oldValue = result.get('Value');
            res.send(oldValue);
            result.set('Value', value);
        } else {
            result = new Data();
            result.set('Key', key);
            result.set('Value', value);
        }
        result.save();
    }).finally(() => {
        res.end();
    });
})

module.exports = router;