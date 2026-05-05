// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();
import * as fs from "fs";
import { APIGatewayProxyEvent } from "aws-lambda";
import Fastify from "fastify";
import {
  auth,
  definePassword,
  sendMailDefinePassword,
  tokenValidate,
} from "@/modules/auth/controllers/auth-controller";

const app = Fastify();
const port = 45000;

const mapperPathRequest = [
  {
    path: "/auth/sign-in",
    lambda: auth,
  },
  {
    path: "/auth/send-define-password",
    lambda: sendMailDefinePassword,
  },
  {
    path: "/auth/define-password",
    lambda: definePassword,
  },
  {
    path: "/auth/validate-token",
    lambda: tokenValidate,
  },
];

app.get("/doc", (_, res) => {
  res.header("Content-Type", "text/plain; charset=utf-8");

  res.send(fs.readFileSync("README.md"));
});

app.post("/lambda", async (req, res) => {
  const body = req.body as unknown as APIGatewayProxyEvent;
  const path = body.path;

  const mappedPath = mapperPathRequest.find(pathIn => pathIn.path === path);

  if (!mappedPath) {
    throw Error("Path não encontrado");
  }

  let reqBody = null;

  if (typeof body !== "string") {
    reqBody = JSON.stringify(body.body);
  }

  const result = await mappedPath.lambda({
    headers: req.headers,
    body: reqBody,
  });

  res.send(result);
});

app.listen({ port }, () => {
  console.log(`Running app listening on port ${port}`);
});
