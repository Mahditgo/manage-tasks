const express = require('express');
const userController = require('./../controllers/user.controller');
const protectAccessToken = require('./../middlewares/auth.middleware');
const isAdmin = require('./../middlewares/admin.middleware');
const upload = require('./../middlewares/upload')
const router = express.Router();





router
.get('/',                               protectAccessToken,    isAdmin,           userController.getAllUsers)
.get('/:id',                            protectAccessToken,    isAdmin,           userController.getUserById)
.patch('/updatePassword',               protectAccessToken,      userController.updatePassword)
.patch('/updateByAdmin/:id',            protectAccessToken,    isAdmin,           userController.updateUserByAdmin)
.post('/forgot-password',                                                         userController.forgotPassword)
.post('/reset-password/:resetToken',                                              userController.resetPassword)
.put('/me',                             protectAccessToken,                       userController.updateOwnProfile)
.put('/me/profile',                     protectAccessToken, upload.single('avatar'), userController.uploadAvatar)
.delete('/:id',                         protectAccessToken,     isAdmin,           userController.deleteUserByAdmin)



module.exports = router;