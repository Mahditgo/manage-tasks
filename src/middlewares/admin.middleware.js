const isAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    console.log(req.user.admin);
    
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong', error });
  }
};

module.exports = isAdmin;
