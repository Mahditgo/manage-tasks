const userService = require('./../services/user.service');

exports.getAllUsers = async (req, res ) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json({users});
        
    } catch (error) {
         res.status(403).json({ message: 'Invalid refresh token' });
    }
};


exports.getUserById = async ( req, res) => {
    try {
        
        const { id } = req.params;
       
      // console.log( req.user);
        const user = await userService.getUserById(id);
        
        
        res.status(200).json({user})
    } catch (error) {
        console.log(error.message);
         res.status(403).json({ message: 'Internal servere Error' });
    }
};


exports.deleteUserByAdmin = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await userService.deleteUserByAdmin(id);
    return res.json({ success: true, ...result });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
};


exports.updateOwnProfile = async (req, res) => {
  const id = req.user.id; 

  try {
    const user = await userService.updateOwnProfile(id, req.body);
    return res.json({ message: 'Profile updated successfully', user });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
};


exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const userId = req.user.id;
    const filePath = req.file.path; 

    const user = await userService.uploadAvatar(userId, filePath);

    res.json({
      message: 'Avatar uploaded successfully',
      avatar: user.avatar
    });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};


exports.updateUserByAdmin = async (req, res) => {
  const { id } = req.params;
  
  
  
  // const { body } =req.body;
  try {
     const user = await userService.updateUserByAdmin(id, req.body);

    return res.json({ message: 'User updated successfully', user });
  } catch (err) {
     res.status(err.status || 500).json({ success: false, message: err.message });
  }
}


exports.updatePassword = async (req, res) => {
  
  const { currentPassword, newPassword } = req.body;
  console.log( req.user.id);


  
  try {
    await userService.updatePassword(req.user.id, currentPassword, newPassword);
    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
     console.log(error.message);
    res.status(403).json({ message: 'Internal servere Error' });
  }
};



exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const response = await userService.forgotPassword(email, req);
    res.status(200).json({ success: true, message: response });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
};


exports.resetPassword = async (req, res) => {
  const { resetToken } = req.params;
//   console.log(resetToken);
  
  const { newPassword } = req.body;

  try {
    const response = await userService.resetPassword(resetToken, newPassword);
    res.status(200).json({ success: true, message: response });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
};