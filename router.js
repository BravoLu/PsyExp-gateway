const Router = require("koa-router");
const UserInfoRpc = require("./user_info_client");
const ExpInfoRpc = require("./exp_info_client");
const oauth = require("./oauth");

const jwt = require("./utils/jwt");

const email = require("./utils/email");

// const redis = require("./utils/redis")

const redis = require("./utils/redis");

const hash = require("./utils/passwdhash");

const router = new Router();

router.get("/", (ctx) => {
  ctx.body = "Hello, Koa!";
});

router.post("/register", email.preRegister);

router.post("/forget", email.resetPasswd);

router.post("/login", async (ctx, next) => {
  try {
    const resp = await UserInfoRpc.login(ctx.request.body);

    console.log("resp: ", resp);

    ctx.response.body = resp;

    if (resp.code === 0) {
      console.log("ctx: ", resp.uid);
      ctx.append("Access-Control-Expose-Headers", "uid");
      ctx.append("uid", resp.uid);

      ctx.cookies.set("uid", resp.uid);
    }
  } catch (error) {}

  return next();
});

router.get("/githubOAuth", async (ctx, next) => {
  ctx.result = oauth.githubOAuth(ctx);

  ctx.status = 200;

  ctx.response.redirect("http://localhost:5173");

  return next();
});

router.get("/myprofile", async (ctx, next) => {
  try {
    // console.log("cookies: ", ctx.cookies);

    const uid = ctx.cookies.get("uid");

    console.log("uid in cookie: ", uid);

    const usr = await UserInfoRpc.user({ uid: uid });

    ctx.body = usr.user_info;
  } catch (error) {}

  return next();
});

router.post("/updateUser", async (ctx, next) => {
  try {
    ctx.request.body["uid"] = ctx.cookies.get("uid");

    const usr = await UserInfoRpc.updateUser(ctx.request.body);

    ctx.body = usr.user_info;
  } catch (error) {}

  return next();
});

router.post("/user", async (ctx, next) => {
  try {
    const usr = await UserInfoRpc.user(ctx.request.body);

    ctx.body = usr.user_info;
  } catch (error) {}

  return next();
});

router.get("/logout", async (ctx, next) => {
  ctx.cookies.set("uid", "");

  ctx.request.headers.authorization = "";

  ctx.status = 200;

  ctx.result = {
    message: "logout success",
  };

  return next();
});

router.post("/addExp", async (ctx, next) => {
  try {
    const rsp = await ExpInfoRpc.addExp(ctx.request.body);

    ctx.response.body = rsp;
  } catch (error) {}

  return next();
});

router.post("/updateExp", async (ctx, next) => {
  try {
    ctx.request.body.rid = Number(ctx.cookies.get("uid"));
    const rsp = await ExpInfoRpc.updateExp(ctx.request.body);
    ctx.response.body = rsp;
  } catch (error) {}
  return next();
});

router.post("/queryExps", async (ctx, next) => {
  try {
    const rsp = await ExpInfoRpc.queryExps(ctx.request.body);

    ctx.response.body = rsp;
  } catch (error) {}

  return next();
});

router.post("/queryExp", async (ctx, next) => {
  try {
    const rsp = await ExpInfoRpc.queryExp(ctx.request.body);

    ctx.response.body = rsp;
  } catch (error) {}

  return next();
});

router.post("/addSub", async (ctx, next) => {
  try {
    const rsp = await ExpInfoRpc.addSub(ctx.request.body);

    ctx.response.body = rsp;
  } catch (error) {}

  return next();
});

router.post("/updateSub", async (ctx, next) => {
  try {
    console.log("updateSub req:", ctx.request.body);

    const rsp = await ExpInfoRpc.updateSub(ctx.request.body);

    ctx.response.body = rsp;
  } catch (error) {
    console.error(error);
  }

  return next();
});

router.post("/querySubs", async (ctx, next) => {
  try {
    const rsp = await ExpInfoRpc.querySubs(ctx.request.body);

    ctx.response.body = rsp;
  } catch (error) {}

  return next();
});

router.post("/querySub", async (ctx, next) => {
  try {
    if (ctx.request.body.pid === undefined) {
      ctx.request.body.pid = Number(ctx.cookies.get("uid"))
    }
    console.log("request body: ", ctx.request.body)
    const rsp = await ExpInfoRpc.querySub(ctx.request.body);
    ctx.response.body = rsp;
  } catch (error) {}
  return next();
});

router.post("/exist", async (ctx, next) => {
  try {
    const rsp = await UserInfoRpc.exist(ctx.request.body);

    console.log(rsp);

    ctx.response.body = rsp;
  } catch (error) {}

  return next();
});

router.post("/queryUsers", async (ctx, next) => {
  try {
    const rsp = await UserInfoRpc.queryUsers(ctx.request.body);
    console.log(rsp);

    ctx.response.body = rsp;
  } catch (error) {}

  return next();
});

router.get("/verify/:token", async (ctx, next) => {
  try {
    const { token } = ctx.params;

    await redis.redisCli.connect();

    const data = await redis.redisCli.get(token);

    await redis.redisCli.quit();

    const rsp = await UserInfoRpc.register(JSON.parse(data));

    if (rsp.code === 0) {
      ctx.response.redirect("http://localhost:5173/success");
    } else {
      ctx.response.redirect("http://localhost:5173/failure");
    }
  } catch (error) {
    ctx.response.redirect("http://localhost:5173");
  }

  // return next();
});

router.post("/reset/:token", async (ctx, next) => {
  try {
    const { token } = ctx.params;

    await redis.redisCli.connect();

    const data = await redis.redisCli.get(token);

    const hashedPasswd = await hash.generateHashedPassword(
      ctx.request.body.password
    ); // console.log("rpcData: ", data)

    const rpcData = {
      uid: JSON.parse(data).uid,

      password: hashedPasswd,
    };

    console.log("rpcData: ", rpcData);

    await redis.redisCli.quit();

    const rsp = await UserInfoRpc.updateUser(rpcData);
  } catch (error) {}
});

module.exports = router;
