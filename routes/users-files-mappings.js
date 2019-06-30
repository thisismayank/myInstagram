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
    let body = JSON.parse(Object.keys(req.body)[0]);  
    let payload = null;  
    let userId;
    let error = false;

    if(body.token) {
        try {
            payload = jwt.verify(JSON.parse(body.token), SECRET_KEY);
        } catch(err) {
            error = true; 
        }
    }
    if(error) {
        res.status(200).send({success: false, message: 'unauthorized', redirectTo:'login'});
    } else {
        userId = payload.id
    }

    // console.log(userId);

    userFileMapping.findOne({
        where: {
            fileId: fileId,
            userId: userId
        }
    })
    .then((file,err)=>{
        // console.log('file', file);
        if(file) {
            file.isActive = true;
            return file.save();
        } else {   
            return userFileMapping.create({fileId: fileId, userId: userId, isActive: true})
        }
    })
    .then((file) => {
        // console.log(file.dataValues.fileId);
        return File.findOne({
            where:{
                id:file.dataValues.fileId
            }
        });
    })
    .then((file)=>{
        // console.log(file.dataValues);
        file.numberOfLikes = file.numberOfLikes + 1;
        return file.save();
    })
    .then(file => {
        // console.log('file saved', file);
        res.status(200).send({success: true, message:'File Liked Successfully'});
    });
})

router.post('/dislikes/:id', (req, res)=> {
    let fileId = req.params.id;   
    let body = JSON.parse(Object.keys(req.body)[0]);  
    let payload = null;  
    let userId; 
    let error = false;
    if(body.token) {
        try {
            payload = jwt.verify(JSON.parse(body.token), SECRET_KEY);
        } catch(err) {
            error = true; 
        }
    }

    if(error) {
        res.status(200).send({success: false, message: 'unauthorized', redirectTo:'login'});
    } else {
        userId = payload.id
    }

    userFileMapping.findOne({
        where: {
            userId: userId,
            fileId: fileId
        }
    })
    .then((userFile, err) =>{
        if(err) {
            res.status(201).send({success: false, message:'Like it before you can unlike it'});
        }
        userFile.isActive = false;
        return userFile.save();
    })
    .then((file) => {
        return File.findOne({
            where:{
                id:file.dataValues.fileId
            }
        });
    })
    .then((file)=>{
        file.numberOfLikes = file.numberOfLikes - 1;
        return file.save();
    })
    .then(file => {

        res.status(200).send({success:true,message:'File Unliked Successfully'});
    });
})

router.post('/favorites', (req, res) => {
    let body = JSON.parse(Object.keys(req.body)[0]);  
    let payload = null;  
    let userId; 
    let error = false;
    if(body.token) {
        try {
            payload = jwt.verify(JSON.parse(body.token), SECRET_KEY);
        } catch(err) {
            error = true; 
        }
    }

    if(error) {
        res.status(200).send({success: false, message: 'unauthorized', redirectTo:'login'});
    } else {
        userId = payload.id
    }
    
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

module.exports = router