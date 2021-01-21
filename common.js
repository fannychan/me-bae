const {
  SSMClient,
  GetParametersByPathCommand,
  PutParameterCommand,
  ParameterType,
} = require("@aws-sdk/client-ssm");

const client = new SSMClient({ region: "eu-north-1" });

exports.getParameters = async () => {
  const data = await client.send(
    new GetParametersByPathCommand({
      Path: "/me-bae/config/",
    })
  );

  const obj = data.Parameters.reduce(
    (o, key) => ({ ...o, [key.Name.substring(15)]: key.Value }),
    {}
  );
  return obj;
};

exports.putParameter = async (name, value) => {
  await client.send(
    new PutParameterCommand({
      Name: name,
      Value: value,
      Overwrite: true,
      Type: ParameterType.STRING,
    })
  );
};

exports.createFormBody = (body) => {
  let formBody = [];
  for (let property in body) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(body[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");
  return formBody;
};

exports.checkResponse = (response) => {
  if (response.ok) {
    return response;
  } else {
    throw Error(response.statusText);
  }
};
