const authService = require('./../services/auth.service');
const  {signUpSchema, loginSchema}  = require('./../validators/auth.validator');

exports.signUp = async ( req, res ) => {

  const result = signUpSchema.safeParse(req.body);
  
  
    if (!result.success) {
    return res.status(400).json({
      errors: result.error.flatten().fieldErrors,
    });
  }
    const { name, email, password, role = 'student', phone } = result.data;

    const user = await authService.signUp({name, email, password, role, phone});
    if(!user) return res.status(400).json({ message: 'User already exists' });

    res.cookie('refreshToken', user.refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
  });

   res.status(201).json({ accessToken: user.accessToken , user : user.newUser});

};



exports.login = async (req, res) => {
  const result = loginSchema.safeParse(req.body);

    if (!result.success) {
    return res.status(400).json({
      errors: result.error.flatten().fieldErrors,
    });
  }

  const { email, password } = result.data;
  const user = await authService.login({ email, password });

  if (!user) return res.status(401).json({ message: 'Youre email or password is incorrect' });

  res.cookie('refreshToken', user.refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
  });

  res.json({ accessToken: user.accessToken });
};


exports.refresh = async (req, res) => {
  try {
     const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) return res.status(401).json({ message: 'No token' });

       const newAccessToken = await authService.refresh(refreshToken);
      
       
       res.json({ accessToken: newAccessToken });
  } catch (error) {
     res.status(403).json({ message: 'Invalid refresh token' });
  }
};


exports.logout = async (req, res ) => {
  try {

    res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict'
  });
  res.status(200).json({ message: 'Logged out successfully' });
  
  }catch (error) {
    res.status(500).json({ message: 'Logout failed' });
  }

};

exports.protectedRoute = (req, res) => {
  res.json({ message: 'You are authorized', userId: req.user.id });
};