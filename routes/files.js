'use strict';

const express = require('express');
const app = express();
const router = express.Router();

const cors = require('cors');

const { File} = require('../sequelize');

router.use(cors());

router.post('/uploadFiles', (req, res)=> {
    let data = {
        fileName: req.body.fileName.toString()
    };

    File.create(data)
    .then(file => {
        res.status(200).send('File Uploaded Successfully');
    });
})

router.get('/', (req, res) => {

    File.findAll()
    .then((files,err) => {
        if(err) {
            res.status(401).send('files not found');
        }
        res.json(files);
    });
});

router.get('/fetchFiles', (req, res) => {

    File.findAll()
    .then((files,err) => {
        if(err) {
            res.status(401).send('files not found');
        }
        res.json(files);
    });
});

module.exports = router