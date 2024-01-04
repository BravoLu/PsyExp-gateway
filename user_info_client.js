const protoLoader = require("@grpc/proto-loader");
const grpc = require("@grpc/grpc-js");
const path = require("path");
const jwt = require("jsonwebtoken");
const hash = require("./utils/passwdhash");

const UserInfoClient = () => {
  const USER_INFO_PROTO = path.resolve(__dirname, "user_info/user_info.proto");

  const userInfoDefinition = protoLoader.loadSync(USER_INFO_PROTO, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });
  const {
    grpc: {
      bravo_studio: {
        user_info_server: { UserService }, // This is the service name
      },
    },
  } = grpc.loadPackageDefinition(userInfoDefinition);

  const cli = new UserService(
    "localhost:50051",
    grpc.credentials.createInsecure()
  );

  return cli;
};

const register = async (req) => {
  req["password"] = await hash.generateHashedPassword(req["password"]);
  return new Promise((resolve, reject) => {
    console.log("req: ", req);
    UserInfoClient().Register(req, (error, response) => {
      if (!error) {
        resolve(response);
      } else {
        console.error(error);
        reject(error);
      }
    });
  });
};

const login = (req) => {
  return new Promise((resolve, reject) => {
    UserInfoClient().Login(req, (error, response) => {
      if (!error) {
        resolve(response);
      } else {
        reject(error);
      }
    });
  });
};

const updateUser = (req) => {
  return new Promise((resolve, reject) => {
    UserInfoClient().UpdateUser(req, (error, response) => {
      if (!error) {
        resolve(response);
      } else {
        console.error(error);
        reject(error);
      }
    });
  });
};

const user = (req) => {
  return new Promise((resolve, reject) => {
    UserInfoClient().QueryUser(req, (error, response) => {
      if (!error) {
        resolve(response);
      } else {
        reject(error);
      }
    });
  });
};

const exist = (req) => {
  return new Promise((resolve, reject) => {
    UserInfoClient().Exist(req, (error, response) => {
      if (!error) {
        console.log(response);
        resolve(response);
      } else {
        console.log(error)
        reject(error);
      }
    });
  });
};

const queryUsers = (req) => {
  return new Promise((resolve, reject) => {
    UserInfoClient().QueryUsers(req, (error, response) => {
      if (!error) {
        console.log(response);
        resolve(response);
      } else {
        console.log(error)
        reject(error);
      }
    });
  });
};


module.exports = { register, login, user, updateUser, exist, queryUsers };
