'use strict';

const express = require('express');
const app = express();
const router = express.Router();

const cors = require('cors');

const { File } = require('../sequelize');
const authUtils = require('../utils/122-auth-utils');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'secretKey';

router.use(cors());

router.post('/uploadFiles', (req, res)=> {
    let isRoot = jwt.verify(JSON.parse(req.body.token), SECRET_KEY).isRoot;
    if(!isRoot) {
        res.status(401).send('Only root is authorized');
    }

    let description = req.bidy.description ? req.body.description : '';
    let data = {
        fileName: req.body.fileName.toString(),
        description: description,
        numberOfLikes: 0
    };

    File.create(data)
    .then(file => {
        res.status(200).send('File Uploaded Successfully');
    });
})

router.post('', (req, res) => {

    File.findAll()
    .then((files,err) => {
        if(err) {
            res.status(401).send('files not found');
        }
        // console.log(files);
        res.json(files);
    });
});


module.exports = router