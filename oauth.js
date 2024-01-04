const axios = require("axios");

const githubOAuth = async (ctx) => {
  const clientID = "8711063080da5366fd36";
  const clientSecret = "44286cedd719c50e6c95ee1d64f20f5124d94543";

  const token = ctx.request.query.code;

  const resp = await axios({
    method: "post",
    url:
      "https://github.com/login/oauth/access_token?" +
      `client_id=${clientID}&` +
      `client_secret=${clientSecret}&` +
      `code=${token}`,
    headers: {
      accept: "application/json",
    }
  });
  const accessToken = resp.data.access_token;

  const result = await axios({
    method: 'get',
    url: `https://api.github.com/user`,
    headers: {
        accept: 'application/json',
        Authorization: `token ${accessToken}`
    }
  });
  return result.data;
};

module.exports = {githubOAuth}
