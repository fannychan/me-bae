const fetch = require("node-fetch");
const {
  getParameters,
  putParameter,
  createFormBody,
  checkResponse,
} = require("./common");

exports.handler = async () => {
  try {
    const data = await getParameters();
    const body = {
      refresh_token: data.REFRESH_TOKEN,
      grant_type: "refresh_token",
    };

    const formBody = createFormBody(body);

    const auth = Buffer.from(
      `${data.CLIENT_ID}:${data.CLIENT_SECRET}`
    ).toString("base64");

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

    console.log("Successful exchange of token");

    const response = {
      statusCode: 200,
      body: JSON.stringify(`Successful refresh of access token`),
    };
    return response;
  } catch (error) {
    console.log("Error received", error);
    const response = {
      statusCode: 400,
      body: JSON.stringify(`Unsuccessful refresh of access token, ${error}`),
    };
    return response;
  }
};
