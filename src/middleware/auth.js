const adminAuth = (req, res, next) => {
    console.log('Admin Middleware auth is checked');
    const token = 'xyz';
    const isAdminAuthorized = token === 'xyz';
    if (!isAdminAuthorized) {
      res.status(401).send('You are not authorized');
    }else { 
      next();
    }
  }

  const userAuth = (req, res, next) => {
    const token = 'abc';
    const isUserAuthorized = token === 'abc';
    if (!isUserAuthorized) {
      res.status(401).send('You are not authorized');
    }
    else {
      next();
    }
    }

  module.exports = { adminAuth, userAuth };