import aws from "aws-sdk";
import { ExceptionsConstants } from "@/commons/consts/exceptions";
import { HttpStatus, ResponseError } from "@foundation/lib";
import { generateRandomHex } from "./generate-random-hex";

const AWS_S3_ACCESS_KEY_ID = process.env.AFYA_ADMIN_CREDENTIALS.split(";")[0];
const AWS_S3_SECRET_KEY = process.env.AFYA_ADMIN_CREDENTIALS.split(";")[1];

aws.config.update({
  accessKeyId: AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: AWS_S3_SECRET_KEY,
  region: "us-east-1",
});

const s3 = new aws.S3();
const REGEX_IMAGE_DATA = /^data:image\/(\w+);base64,/;

export async function uploadImageToS3(file: string) {
  try {
    if (!file || typeof file !== "string") {
      throw new ResponseError(ExceptionsConstants.INVALID_IMAGE_DATA, HttpStatus.BAD_REQUEST);
    }

    if (!REGEX_IMAGE_DATA.test(file)) {
      throw new ResponseError(ExceptionsConstants.INVALID_BASE64_FORMAT, HttpStatus.BAD_REQUEST);
    }

    const base64string = file.split(";")[1]?.replace("base64,", "") || "";
    const extension = file.match(REGEX_IMAGE_DATA)[1] || "png";

    const buffer = Buffer.from(base64string, "base64");

    const hash = await generateRandomHex();

    const bucketName = process.env.NODE_ENV === "production" ? "afya-static-insights" : "afya-static-insights-qa";

    const params = {
      Bucket: bucketName,
      Key: `profile/${hash}-${Date.now()}.${extension}`,
      Body: buffer,
      ACL: "public-read",
      ContentType: `image/${extension}`,
    };

    const { Location } = await s3.upload(params).promise();

    return Location;
  } catch (error) {
    if (error instanceof ResponseError) throw error;

    throw new ResponseError(
      ExceptionsConstants.INTERNAL_SERVER_ERROR,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
