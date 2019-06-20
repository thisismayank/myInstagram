'use strict';

const express = require('express');
const app = express();
const router = express.Router();

const cors = require('cors');
const authUtils = require('../utils/122-auth-utils');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'secretKey';

const { User } = require('../sequelize');

const emailUtils = require('../utils/133-email-utils');

router.use(cors());

router.post('/fetchUsers', (req, res) => {
    User.findAll().then(users => res.json(users))
})


router.post('/login', (req, res)=>{
    User.findOne({
        where: {
            userCode: req.body.userCode,
            isActive: true
        }
    })
    .then((user, err) => {
        if(err) {
            res.status(401).send('Wrong Username or password');
        }

        if (authUtils.comparePassword(req.body.password, user.dataValues.password)) {
            if(user.otp) {
                res.status(401).send({success: false, message: 'go to the link sent in the email to activate account'});
            }
            let token = jwt.sign(user.dataValues, SECRET_KEY);
            res.json({token: token});
        } else {
            res.status(401).send('Wrong Username or password');
        }
    });
});

router.post('/generateOTP', (req, res) => {
    let email = req.body.email;
    let otp = {
        otp:authUtils.generateOTP()
    };
    User.findOne({
        where: {
            email: email,
            isActive: true
        }
    })
    .then(user=>{
        user.dataValues.otp = otp.otp;
        return user.save()
    })
        .then(data=>{
        let url = body.url || 'localhost:3000';
        let text = `Go to ${url}/verifyOTP and enter ${otp.otp}`;        
        let emailUtility = emailUtils.sendEmail(data.dataValues.email, text);
            emailUtility.transporter.sendMail(emailUtility.mailOptions, (err, data)=>{
                if(err) {
                    res.status(400).send('email not sent');
                } else {
                    res.status(200).send('Email generated and sent, check email for otp');
                }
            });
        });
})

router.post('/verifyOTP', (req, res)=>{
    let check = false;
    User.findOne({
        where: {
            userCode: req.body.userCode,
            otp: req.body.otp,
            isActive: true
        }
    })
    .then((user, err) => {
        if(err || !user) {
            check = true;
            return User.findOne({where: {userCode: req.body.userCode, isActive: true}});
        } else {
            user.otp = null;
            return user.save();
        }
    })
    .then((user, err)=>{
        if(err) {
            res.status(401).send('Some error occured');
        }
        if(check) {
            user.loginRetryCount = user.loginRetryCount + 1;
            return user.save();
        } else {
            res.status(200).send({success: true, redirectTo: '/login'});
        }
    })
    .then((user, err)=>{
        if(check) {
            res.redirect('/');
        }
    })
});

router.post('/signup', (req, res)=>{

    let body = req.body;
    let otp;
    User.findOne({
        where: {
         userCode: body.userCode.toString(),
         email: body.email.toString(),
         isActive: true   
        }
    })
    .then((user, err) => {
        if(user) {
            res.status(400).send('User already exists');
        }
        otp = authUtils.generateOTP();
        let data = {
            firstName: body.firstName ? body.firstName.toString(): null,
            lastName: body.lastName ? body.lastName.toString(): null,
            email: body.email ? body.email.toString() : null,
            password: body.password ? authUtils.hashPassword(body.password).toString():null,
            userCode: body.userCode ? body.userCode.toString(): null,
            isActive: true,
            isRoot: false,
            dob: body.dob ? body.dob : null,
            otp: otp,
            loginRetryCount: 0
        };
       return User.create(data)
    })
        .then((user) => {
            if(!user) {
                res.status(400).send('User not created');
            }
    
            let url = body.url || 'localhost:3000';
            let text = `Go to ${url}/verifyOTP and enter ${otp}`;
           
            let emailUtility = emailUtils.sendEmail(user.dataValues.email, text);
            emailUtility.transporter.sendMail(emailUtility.mailOptions, (err, data)=>{
                if(err) {
                    res.status(400).send('User not created');
                } else {
                    res.status(200).send('User created, check email for otp');
                }
            });
        });
});


router.put('/updatePassword', (req, res)=>{
    let userCode = jwt.verify(JSON.parse(req.body.token), SECRET_KEY).userCode;

    let body = req.body;
        let data = {
            password: authUtils.hashPassword(body.password).toString()
        };

        return User.update(data, {
            where: {
                userCode: userCode,
            } 
        })
        .then((user) => {
            if(!user) {
                res.status(400).send('Password not updated');
            }
            res.status(200).send('Password updated successfully');
        });
});

router.put('/updateEmail', (req, res)=>{
    let userCode = jwt.verify(JSON.parse(req.body.token), SECRET_KEY).userCode;

    let body = req.body;
    let otp = authUtils.generateOTP();
        let data = {
            email: body.email.toString(),
            otp: otp
        };

        return User.update(data, {
            where: {
                userCode: userCode,
            } 
        })
        .then((user, err) => {
            if(err || !user) {
                res.status(400).send('Email not updated');
            }

            let url = body.url || 'localhost:3000';
            let text = `Go to ${url}/verifyOTP and enter ${otp} to authenticate account`;
            let emailUtility = emailUtils.sendEmail(body.email, text);
            emailUtility.transporter.sendMail(emailUtility.mailOptions, (err, data)=>{
                if(err) {
                    res.status(400).send('Email not updated');
                } else {
                    res.status(200).send('Email updated, check email for otp');
                }
            });

        });
});

module.exports = router