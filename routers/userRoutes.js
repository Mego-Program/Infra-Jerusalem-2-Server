import getUserImg from '../controllers/userController'
import app from '../app';



function verifyToken(req, res, next) {
    const token = req.headers.authorization;
    if (!token) return res.status(403).send({ auth: false, message: 'No token provided.' });
  
    jwt.verify(token, 'secret', (err, decoded) => {
      if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
  
      req.userName = decoded.userName;
      next();
    });
  }



app.post('/userNameImg',verifyToken,getUserImg)