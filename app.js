const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const router = require("./router");
// const cors = require("@koa/cors");
const cors = require('koa2-cors');

const app = new Koa();

const port = 8080;

// app.use(async (ctx, next) => {
//     ctx.set('Access-Control-Allow-Credentials', 'true');
//     // Other CORS headers...
//     await next();
//   });
app.use(cors({
    credentials: true, // Allow credentials (cookies, headers, etc.)
  }));
app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(port, () => {
  console.log("Gateway Server Start...");
});
