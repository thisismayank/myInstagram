'use strict';

const express = require('express');
const app = express();
const router = express.Router();

const cors = require('cors');
const _ = require('underscore');

const { File, userFileMapping } = require('../sequelize');
const authUtils = require('../utils/122-auth-utils');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'secretKey';

router.use(cors());

router.post('/uploadFiles', (req, res)=> {
    let isRoot = jwt.verify(JSON.parse(req.body.token), SECRET_KEY).isRoot;
    if(!isRoot) {
        res.status(201).send({success: false, message:'Only root user is authorized'});
    }

    let description = req.body.description ? req.body.description : '';
    let data = {
        fileName: req.body.fileName.toString(),
        description: description,
        numberOfLikes: 0
    };

    File.create(data)
    .then(file => {
        res.status(200).send({success: true, message:'File Uploaded Successfully'});
    });
})

router.post('', (req, res) => {
    let files;
    File.findAll()
    .then((fileData,err) => {
        if(err) {
            res.status(201).send({success: false, message:'files not found'});
        }
        files = fileData;
        console.log(Object.keys(req.body));
        if(Object.keys(req.body)[0] !== '{}') {
            let body = JSON.parse(Object.keys(req.body)[0]);  
            let payload = null;  
        
            if(body.token) {
                try {
                    payload = jwt.verify(JSON.parse(body.token), SECRET_KEY);
                } catch(err) {
                    error = true; 
                }
            }

            let userId = payload ? payload.id : body.id;
            return userFileMapping.findAll({
                where: {
                    userId: userId,
                    isActive: true
                },
                attributes: ['fileId']
            })
        } else {
            return 0;
    }
    })
    .then(filesLikedList => {
        if(filesLikedList !== 0) {
            let likedFilesList = _.map(filesLikedList, (item) => {
                return item.dataValues.fileId;
            })
            let likedFilesListObj = _.object(likedFilesList, likedFilesList);
 
        let tempFiles = files;
            let dataObj = _.map(tempFiles, (file)=>{
                if(likedFilesListObj[file.dataValues.id]) {
                    file.dataValues['liked'] = true;
                }
                return file;
            })
            files = dataObj;
    }
    res.json(files);
    
    });
});


module.exports = router