const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    const authToken = req.headers.authorization;
    if (authToken) {
      const token = authToken.split(" ")[1];
      //   console.log(token);
      try {
        const decodedPayload = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decodedPayload;
        next();
      } catch (err) {
        res.status(401).json({ message: "Invalid Token, Access denied" });
      }
    } else {
      res.status(401).json({ message: "No Token provided, Access denied" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: `Error: ${err}` });
  }
};

module.exports = verifyToken;
