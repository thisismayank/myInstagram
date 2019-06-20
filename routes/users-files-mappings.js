'use strict';

const express = require('express');
const router = express.Router();

const cors = require('cors');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'secretKey';

const { File, userFileMapping} = require('../sequelize');

const _ = require('underscore');

const Sequelize = require('sequelize')
const Op = Sequelize.Op

router.use(cors());


router.post('/likes/:id', (req, res)=> {
    let fileId = req.params.id;
    let userId = jwt.verify(JSON.parse(req.body.token), SECRET_KEY).id;
 
    userFileMapping.findOne({
        where: {
            fileId: fileId,
            userId: userId
        }
    })
    .then((file,err)=>{
        if(file) {
            file.isActive = true;
            return file.save();
        } else {   
            return userFileMapping.create({fileId: fileId, userId: userId, isActive: true})
    }
})
    .then(file => {

        res.status(200).send('File Liked Successfully');
    });
})

router.post('/unlikes/:id', (req, res)=> {
    let fileId = req.params.id;
    let userId = jwt.verify(JSON.parse(req.body.token), SECRET_KEY).id;
 
    userFileMapping.findOne({
        where: {
            fileId: fileId
        }
    })
    .then((userFile, err) =>{
        if(err) {
            res.status(401).send('Like it before you can unlike it');
        }
        userFile.isActive = false;
        return userFile.save();
    })
    .then(file => {

        res.status(200).send('File Unliked Successfully');
    });
})

router.post('/favorites', (req, res) => {
    let userId = jwt.verify(JSON.parse(req.body.token), SECRET_KEY).id;

    userFileMapping.findAll({
        where:{
            userId: userId,
            isActive:true
        }
    })
    .then((files,err) => {
        if(err) {
            res.status(401).send('files not found');
        }
        let fileIds = _.pluck(files, 'fileId');
        return File.findAll({
            where: {
                id: {
                    [Op.in]: fileIds
                }
            }
        });
    })
        .then(favoritedFiles=>{

        res.json(favoritedFiles);
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