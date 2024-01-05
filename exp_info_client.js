const protoLoader = require("@grpc/proto-loader");
const grpc = require("@grpc/grpc-js");
const path = require("path");
const jwt = require("jsonwebtoken");

const ExpInfoClient = () => {
  const PROTO = path.resolve(__dirname, "exp_info/exp_info.proto");

  const protoDefinition = protoLoader.loadSync(PROTO, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });
  const {
    grpc: {
      bravo_studio: {
        exp_info_server: { ExpInfoServer }, // This is the service name
      },
    },
  } = grpc.loadPackageDefinition(protoDefinition);

  const cli = new ExpInfoServer(
    "localhost:50052",
    grpc.credentials.createInsecure()
  );

  return cli;
};

const addExp = (req) => {
  console.log("addExp: ", req)
  return new Promise((resolve, reject) => {
    ExpInfoClient().AddExp(req, (error, response) => {
      if (!error) {
        resolve(response);
      } else {
        reject(error);
      }
    });
  });
};

const queryExps = (req) => {
  return new Promise((resolve, reject) => {
    ExpInfoClient().QueryExps(req, (error, response) => {
      if (!error) {
        resolve(response);
      } else {
        console.error(error);
        reject(error);
      }
    });
  });
};

const updateExp = async (req) => {
  return new Promise((resolve, reject) => {
    ExpInfoClient().UpdateExp(req, (error, response) => {
      if (!error) {
        resolve(response);
      } else {
        console.error(error);
        reject(error);
      }
    })
  })
}

const queryExp = (req) => {
  return new Promise((resolve, reject) => {
    ExpInfoClient().QueryExp(req, (error, response) => {
      if (!error) {
        resolve(response);
      } else {
        reject(error);
      }
    });
  });
};

const addSub = (req) => {
  return new Promise((resolve, reject) => {
    ExpInfoClient().AddSub(req, (error, response) => {
      if (!error) {
        resolve(response);
      } else {
        reject(error);
      }
    });
  });
};

const updateSub = (req) => {
  return new Promise((resolve, reject) => {
    ExpInfoClient().UpdateSub(req, (error, response) => {
      if (!error) {
        resolve(response);
      } else {
        reject(error);
      }
    });
  });
};

const querySubs = (req) => {
  return new Promise((resolve, reject) => {
    ExpInfoClient().QuerySubs(req, (error, response) => {
      if (!error) {
        resolve(response);
      } else {
        reject(error);
      }
    });
  });
};

const querySub = (req) => {
  return new Promise((resolve, reject) => {
    ExpInfoClient().QuerySub(req, (error, response) => {
      if (!error) {
        resolve(response);
      } else {
        reject(error);
      }
    });
  });
};

module.exports = { addExp, queryExps, queryExp, addSub, updateSub, querySubs, updateExp, querySub };
