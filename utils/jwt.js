const jwt = require("jsonwebtoken");

const secretKey = "8711063080da5366fd36";

const getJWT = (data, expire) => {
  const token = jwt.sign(data, secretKey, { expiresIn: expire });
  return token;
};

const parseJWT = async (data) => {
  return new Promise((resolve, reject) => {
    jwt.verify(data, secretKey, (error, response) => {
      if (!error) {
        resolve(response);
      } else {
        reject(error);
      }
    });
  });
};

module.exports = { getJWT, parseJWT };
