
const bcrypt = require('bcrypt');
// const User = require('./../models/user.model');
const tokenUtils = require('./../utils/token.util');
const prisma = require('./../config/db.config')


exports.signUp = async ({name, email, password, role = 'student', phone }) => {
    const existingUser = await prisma.user.findUnique({ where : {email}});
    if(existingUser) return null;

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
     data: {
      name,
      email,
      password: hashedPassword,
      phone,
      role,
    }
    });
   

console.log('newUser.id:', newUser.id);


    const accessToken = tokenUtils.generateAccessToken({ id : newUser.id, role: newUser.role  });
    const refreshToken = tokenUtils.generateRefreshToken({ id: newUser.id});

    return { accessToken, refreshToken, newUser};
};


exports.login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where : {email}});
  if (!user) return null;

  const match = await bcrypt.compare(password, user.password);
  if (!match)  return null;

  const accessToken = tokenUtils.generateAccessToken({ id: user.id, role: user.role});
  const refreshToken = tokenUtils.generateRefreshToken({ id: user.id });

  return { accessToken, refreshToken };
};



exports.refresh = async ( refreshToken ) => {
    const user = tokenUtils.verifyRefreshToken(refreshToken);
    // console.log(user.phone);
    
    const newAccessToken = tokenUtils.generateAccessToken({ id : user.id, role: user.role});
    
    
    return newAccessToken;
}