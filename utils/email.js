const nodemailer = require("nodemailer");
const jwt = require("./jwt");
const redis = require("./redis");
const cfg = require("../config")

const transporter = nodemailer.createTransport({
  service: "qq",
  auth: {
    user: "260484443@qq.com",
    pass: "ypbzhbzgmgmcbjbb",
  },
});

const preRegister = async (ctx, next) => {
  try {
    const jwtToken = jwt.getJWT(ctx.request.body, "5m");
    // save this to redis
    console.log("jwtToken: ", jwtToken);
    await redis.redisCli.connect();
    await redis.redisCli.setEx(
      jwtToken,
      5 * 60 * 60,
      JSON.stringify(ctx.request.body)
    );
    await redis.redisCli.quit();

    const verificationLink = `http://${cfg.url}/verify/${jwtToken}`;

    const mailOptions = {
      from: "260484443@qq.com",
      to: ctx.request.body.user_info.email,
      subject: "Register Verification",
      text: `Click the following link to verify your email: ${verificationLink} ~`,
    };
    const rsp = await transporter.sendMail(mailOptions);
    ctx.response.body = { code: 0, msg: "success" };
  } catch (error) {
    console.error(error);
  }
  return next();
};

const resetPasswd = async (ctx, next) => {
    try {
        console.log("body: ", ctx.request.body)
        const jwtToken = jwt.getJWT(ctx.request.body, "5m");
        // save this to redis
        await redis.redisCli.connect();
        await redis.redisCli.setEx(
          jwtToken,
          5 * 60 * 60,
          JSON.stringify(ctx.request.body)
        );
        await redis.redisCli.quit();
    
        const verificationLink = `http://${cfg.url}/reset?token=${jwtToken}`;
    
        const mailOptions = {
          from: "260484443@qq.com",
          to: ctx.request.body.email,
          subject: "Reset Password",
          text: `Click the following link to reset your password: ${verificationLink} ~`,
        };
        const rsp = await transporter.sendMail(mailOptions);
        ctx.response.body = { code: 0, msg: "success" };
      } catch (error) {
        console.error(error);
      }
      return next();    
}


module.exports = { preRegister, resetPasswd };
