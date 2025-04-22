const express = require('express');
const authController = require('./../controllers/auth.controller');
const protectAccessToken = require('./../middlewares/auth.middleware');

const router = express.Router();


router
.post('/signup',                        authController.signUp)
.post('/login',                         authController.login)
.post('/refresh',                       authController.refresh)
.post('/logout',                        authController.logout)
.get('/protect',   protectAccessToken,  authController.protectedRoute)


module.exports = router;