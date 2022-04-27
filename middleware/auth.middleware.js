const jwt = require("jsonwebtoken");

const authenticateJWT = (req, res, next) => {
  console.log(req)
  const token = req.signedCookies.token;
  console.log(token)
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).send({ msg: "something wrong" });
      }

      req.user = user;
      console.log(user)
      next();
    });
  }
  else {
    res.status(401).send({ message: "you have no privilage" });
  }

};

module.exports = authenticateJWT;


