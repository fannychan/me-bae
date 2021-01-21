const fetch = require("node-fetch");
const { getParameters, checkResponse } = require("./common");

exports.handler = async () => {
  const parameters = await getParameters();
  const trackResponse = await fetch(
    "https://api.spotify.com/v1/me/top/artists",
    {
      headers: {
        Authorization: `Bearer ${parameters.ACCESS_TOKEN}`,
      },
    }
  )
    .then(checkResponse)
    .then((res) => res.json())
    .catch((err) => {
      console.log(err);
      throw new Error(err);
    });

  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "https://fannychan.github.io/",
    },
    body: JSON.stringify(trackResponse),
  };
  return response;
};
