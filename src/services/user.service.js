
const prisma = require('./../config/db.config');
const sendResetPasswordEmail = require('./../utils/emailSender');
const bcrypt = require('bcrypt');
const crypto = require('crypto');


exports.getAllUsers =  async() => {
    const users = await prisma.user.findMany();
    if(!users) throw new Error('No user found');
    return users;
}


exports.getUserById = async(id) => {
    const user = await prisma.user.findUnique({where : { id : Number(id)}});

    if(!user) throw new Error('No user founded with that id');
    return user;
};


exports.deleteUserByAdmin = async (id) => {

  const user = await prisma.user.findUnique({ where: { id: Number(id) } });

  if (!user) {
    const error = new Error('User not found');
    error.status = 404;
    throw error;
  }

  
  await prisma.user.delete({ where: { id: Number(id) } });

  return { message: 'User deleted successfully' };
}



exports.updateUserByAdmin = async (id, body) => {
  const allowedRoles = ['admin', 'user'];
 const allowedFields = ['name', 'email', 'role'];
  const data = {};

  for (const key of allowedFields) {
    if (body[key] !== undefined) {
      if (key === 'role') {
        
        if (!allowedRoles.includes(body[key])) {
          const error = new Error('Invalid role. Only "admin" or "user" are allowed.');
          error.status = 400;
          throw error;
        }
      }

      data[key] = body[key];
    }
  }

  if (Object.keys(data).length === 0) {
    const error = new Error('No valid fields to update');
    error.status = 400;
    throw error;
  }

  const user = await prisma.user.update({
    where: { id: Number(id) },
    data,
  });

  return user;
};




exports.updateOwnProfile = async (id, body) => {
  const allowedFields = ['name', 'email', 'password']; // 👈 بدون username
  const data = {};

  for (const key of allowedFields) {
    if (body[key] !== undefined) {
      data[key] = body[key];
    }
  }

  if (Object.keys(data).length === 0) {
    const error = new Error('No valid fields to update');
    error.status = 400;
    throw error;
  }

  const user = await prisma.user.update({
    where: { id: Number(id) },
    data,
  });

  return user;
};



exports.uploadAvatar = async (userId, filePath) => {
  if (!filePath) {
    const error = new Error('No file path provided');
    error.status = 400;
    throw error;
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: { avatar: filePath }
  });

  return user;
};


exports.updatePassword = async (userId, currentPassword, newPassword) => {
    // console.log(req.user);

     if (!currentPassword || !newPassword) {
        throw new Error('All fields are required');
    }

//  const userIdNum = Number(userId);
    console.log(userId);
    
    const user = await prisma.user.findUnique({ where : { id : Number(userId)}})
     if(!user) throw new Error('User not found');

     const isMatch = await bcrypt.compare(currentPassword, user.password);
     if(!isMatch) throw new Error('Your current password is incorrect');

     const hashedPassword = await bcrypt.hash(newPassword, 10);
     user.password = hashedPassword;

     await prisma.user.update({
    where: { id: Number(userId) },
    data: { password: hashedPassword },
  });


     return true;
};


exports.forgotPassword = async (email, req) => {
    if (!email) {
        const error = new Error('Email is required')
        error.status = 400;
        throw error;
    }

      const user = await prisma.user.findUnique({ where : {email}});
        if (!user) {
        const error = new Error('Invalid user');
        error.status = 400;
        throw error;
  }

    const resetToken = await crypto.randomBytes(20).toString('hex');
    const resetExpires = new Date(Date.now() + 3600000);
    console.log(resetToken);
    
    user.passwordResetToken  = resetToken;
    console.log(user.passwordResetToken );
    
    user.passwordResetExpires = Date.now() + 3600000; //1h
    // await user.save();
      await prisma.user.update({
    where: { email },
    data: {
      passwordResetToken: resetToken,
      passwordResetExpires: resetExpires,
    },
  });
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
    await sendResetPasswordEmail.sendResetPasswordEmail(email, resetURL);

    return 'Password reset link sent to your email';
};




exports.resetPassword = async (resetToken, newPassword) => {
  const user = await prisma.user.findFirst({  where: {
      passwordResetToken: resetToken,
      passwordResetExpires: {
        gt: new Date()
      }
    } 
  })

  if (!user) {
    const error = new Error('User not found or token expired');
    error.status = 404;
    throw error;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  await prisma.user.update({
    where : { id : user.id},
    data : {
     
  password : hashedPassword,
  passwordResetToken : undefined,
  passwordResetExpires : undefined

    }
  })

  return 'Password updated successfully';
};
