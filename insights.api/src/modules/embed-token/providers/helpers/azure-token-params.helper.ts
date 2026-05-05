const getAzureAuthParams = () => {
  return new URLSearchParams({
    grant_type: "password",
    client_id: String(process.env.AZURE_CLIENT_ID),
    client_secret: String(process.env.AZURE_CLIENT_SECRET_VALUE),
    resource: String(process.env.AZURE_RESOURCE),
    username: String(process.env.AZURE_USERNAME),
    password: String(process.env.AZURE_PASSWORD),
  });
};

export default getAzureAuthParams;
