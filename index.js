const fetch = require("node-fetch");
const {
  getParameters,
  checkResponse,
  putParameter,
  createFormBody,
} = require("./common");

exports.handler = async (event) => {
  if (event.queryStringParameters) {
    const code = event.queryStringParameters.code;
    try {
      const data = await getParameters();

      const auth = Buffer.from(
        `${data.CLIENT_ID}:${data.CLIENT_SECRET}`
      ).toString("base64");

      const body = {
        code: code,
        grant_type: "authorization_code",
        redirect_uri: data.REDIRECT_URI,
      };

      const formBody = createFormBody(body);
      console.log("Exchanging token");
      const tokenResponse = await fetch(
        "https://accounts.spotify.com/api/token",
        {
          method: "POST",
          body: formBody,
          headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
        .then(checkResponse)
        .then((res) => res.json())
        .catch((err) => {
          console.log(err);
          throw new Error(err);
        });

      await putParameter(
        "/me-bae/config/ACCESS_TOKEN",
        tokenResponse.access_token
      );
      await putParameter(
        "/me-bae/config/REFRESH_TOKEN",
        tokenResponse.refresh_token
      );

      const response = {
        statusCode: 200,
        body: JSON.stringify(`Successful exchange of code to token`),
      };
      return response;
    } catch (error) {
      console.log("Error received", error);
      const response = {
        statusCode: 400,
        body: JSON.stringify(
          `Unsuccessful exchange of code to token, ${error}`
        ),
      };
      return response;
    }
  } else {
    try {
      const data = await getParameters();
      const url = `https://accounts.spotify.com/authorize?client_id=${data.CLIENT_ID}&response_type=code&redirect_uri=${data.REDIRECT_URI}&scope=user-top-read&state=${data.STATE}`;
      const response = {
        statusCode: 302,
        headers: {
          Location: url,
        },
      };
      return response;
    } catch (error) {
      console.log("Error received", error);
      const response = {
        statusCode: 400,
        body: JSON.stringify("Error"),
      };
      return response;
    }
  }
};
