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

// router.get('/verifyToken/:token', (req, res)=>{
//     let error = false;
//         try {
//             jwt.verify(req.params.token, SECRET_KEY);
//         } catch(err) {
//             error = true; 
//         }

//         if(!error) {
//             res.json({success: true})
//         } else {
//             res.json({success: false})
//         }
// })
router.post('/verifyToken', (req, res)=>{
    let body = JSON.parse(Object.keys(req.body)[0]);  
    let error = false;
 
    if(JSON.parse(body.token)) {
        try {
         jwt.verify(JSON.parse(body.token), SECRET_KEY);
        } catch(err) {
            console.log('error');
            error = true; 
        }
    }
        if(!error) {
            res.json({success: true})
        } else {
            res.json({success: false})
        }
})


router.post('/login', (req, res)=>{
    // next-line to be uncommented to login as root from postman
    // let body = req.body;

    // next-line to be used with front-end
    let body = JSON.parse(Object.keys(req.body)[0]);
    // console.log(body);
    User.findOne({
        where: {
            userCode: body.userCode,
            isActive: true
        }
    })
    .then((user, err) => {
        if(err) {
            res.status(200).send('Wrong Username or password');
        }

        if (authUtils.comparePassword(body.password, user.dataValues.password)) {
            if(user.otp) {
                res.status(200).send({success: false, message: 'go to the link sent in the email to activate account', redirectTo: 'verifyOTP'});
            }
            let token = jwt.sign(user.dataValues, SECRET_KEY);
            res.json({token: token});
        } else {
            res.status(200).send({success: false, message:'Wrong Username or password', redirectTo:'error'});
        }
    });
});

// router.post('/generateOTP', (req, res) => {
//     try {
//         jwt.verify(req.body.token, SECRET_KEY);
//     } catch(err) {
//         error = true; 
//     }

//     let email = req.body.email;
//     let otp = {
//         otp:authUtils.generateOTP()
//     };
//     User.findOne({
//         where: {
//             email: email,
//             isActive: true
//         }
//     })
//     .then(user=>{
//         user.dataValues.otp = otp.otp;
//         return user.save()
//     })
//         .then(data=>{
//         let url = body.url || 'localhost:3000';
//         let text = `Go to ${url}/verifyOTP and enter ${otp.otp}`;        
//         let emailUtility = emailUtils.sendEmail(data.dataValues.email, text);
//             emailUtility.transporter.sendMail(emailUtility.mailOptions, (err, data)=>{
//                 if(err) {
//                     res.status(400).send('email not sent');
//                 } else {
//                     res.status(200).send('Email generated and sent, check email for otp');
//                 }
//             });
//         });
// })

router.post('/generateOTP', (req, res) => {

    let body = JSON.parse(Object.keys(req.body)[0]);  
    let payload = null;
    if(body.token) {
        try {
            payload = jwt.verify(JSON.parse(body.token), SECRET_KEY);
        } catch(err) {
            error = true; 
        }
    }

    let userCode = payload ? payload.userCode : body.userCode;

    let email = body.email;
    let otp = authUtils.generateOTP()
    User.findOne({
        where:{
            email: email,
            userCode: userCode,
            isActive: true
        }
    })
    .then(userData => {
        userData.otp = Number(otp);

        return userData.save()
    })
    .then(userData => {
        let url = body.url || 'localhost:3000';
        let text = `Your forgot password OTP is ${otp}`;        
        let emailUtility = emailUtils.sendEmail(userData.email, text);
        emailUtility.transporter.sendMail(emailUtility.mailOptions, (err, data)=>{
            if(err) {
                res.status(200).send('email not sent');
            } else {
                res.status(200).send({success: true, message:'Email generated and sent, check email for otp', data: userCode});
            }
        });
    });
});

router.post('/verifyOTP', (req, res)=>{
    let check = false;
    // console.log('req.body', req.body);
    let body = JSON.parse(Object.keys(req.body)[0]);
    // console.log(body);
    let payload = null;  
 
    if(body.token) {
        try {
            payload = jwt.verify(JSON.parse(body.token), SECRET_KEY);
        } catch(err) {
            error = true; 
        }
    }
    console.log('payload', payload);
    let userCode = payload ? payload.userCode : body.userCode;
    console.log(userCode)

    User.findOne({
        where: {
            email: body.email,
            userCode: userCode,
            otp: Number(body.otp),
            isActive: true
        }
    })
    .then((user, err) => {
        if(err || !user) {
            check = true;
            return User.findOne({where: {email: body.email, isActive: true}});
        } else {
        console.log('here');

            user.otp = null;
            return user.save();
        }
    })
    .then((user, err)=>{
        if(err) {
            res.status(200).send({success: false, message:'Some error occured'});
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
            res.status(200).send({success: false, message:'Wrong OTP', redirectTo:'wrongotp'});
        }
    })
});

router.post('/signup', (req, res)=>{

    let body = JSON.parse(Object.keys(req.body)[0]);
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
            res.status(200).send({success: false, message: 'User already exists'});
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
                res.status(200).send({success: false, message:'User not created'});
            }
    
            let url = body.url || 'localhost:3000';
            let text = `Go to ${url}/verifyOTP and enter ${otp}`;
           
            let emailUtility = emailUtils.sendEmail(user.dataValues.email, text);
            emailUtility.transporter.sendMail(emailUtility.mailOptions, (err, data)=>{
                if(err) {
                    res.status(200).send({success: false, message: 'User not created'});
                } else {
                    res.status(200).send({success: true, message:'User created, check email for otp'});
                }
            });
        });
});


router.post('/updatePassword', (req, res)=>{
    console.log(req.body);
    let body = JSON.parse(Object.keys(req.body)[0]);    

    let payload = null;  
 
    if(body.token) {
        try {
            payload = jwt.verify(JSON.parse(body.token), SECRET_KEY);
        } catch(err) {
            error = true; 
        }
    }

    let userCode = payload ? payload.userCode : body.userCode;

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
            res.status(200).send({success: true, message:'Password updated successfully'});
        });
});

router.put('/updateEmail', (req, res)=>{
    let body = JSON.parse(Object.keys(req.body)[0]);    

    let payload = null;  
 
    if(body.token) {
        try {
            payload = jwt.verify(JSON.parse(body.token), SECRET_KEY);
        } catch(err) {
            error = true; 
        }
    }

    let userCode = payload ? payload.userCode : body.userCode;
    
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