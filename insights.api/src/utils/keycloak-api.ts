import axios from "axios";

const keycloakApi = axios.create({
  baseURL: `${process.env.KEYCLOAK_URL}`,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    "Access-Control-Allow-Origin": "*",
  },
});

export { keycloakApi };
