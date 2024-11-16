import type { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import { createRouter, expressWrapper } from "next-connect";
import { postData } from "../../../libs/requestMethod";
import AES from "crypto-js/aes";
import { enc } from "crypto-js";
import useragent from "useragent";

// Create a router instance for handling API requests.
const router = createRouter<NextApiRequest, NextApiResponse>();

/**
 * Configuration settings for the API.
 * 
 * @constant
 * @type {Object}
 * @property {Object} api - API configuration options.
 * @property {boolean} api.bodyParser - Enables or disables the body parser middleware.
 * 
 * Enables the body parser to handle JSON and other content types in the request body.
 */
export const config = {
  api: {
    bodyParser: true,
  },
};

// Add a POST handler to the router.
router.post(
  /**
    * Handles POST request to delete a user address based on provided data.
    * 
    * @async
    * @function
    * @param {Request} req - The request object, containing the encoded and encrypted body data.
    * @param {Response} res - The response object to send the deletion result.
    * 
    * @throws {Error} If an error occurs during decryption, data parsing, or API call.
    */
  async (req, res) => {
    try {
      const userAgentString = req.headers["user-agent"];
      const userAgent = useragent.parse(userAgentString);
      const deviceType = userAgent.device.family.toLowerCase();
      let device = ''
      if (deviceType.includes("iphone") || deviceType.includes("android")) {
        device = "mobile"
      } else if (deviceType.includes("ipad") || deviceType.includes("tablet")) {
        device = "tablet"
      } else {
        device = "desktop"
      }
      const browser = userAgent.toAgent();
      const os = userAgent.os.toString();

      const decodedStr = decodeURIComponent(req.body);
      let formData = AES.decrypt(
        decodedStr,
        `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`
      ).toString(enc.Utf8);

      let formdata = JSON.parse(formData);
      formdata.deviceType = device
      formdata.os = os
      formdata.browser = browser

      let token = "";
      let data = await postData(
        `${process.env.NEXT_PUBLIC_APIURL}/user/login`,
        formdata,
        token
      );

      return res.status(200).send({ data });
    } catch (error: any) {
      throw new Error(error.message);
    }
  });

/**
 * Sets up the router handler with error handling for API requests.
 *
 * @function
 * @param {Object} router.handler - The router handler object containing route definitions.
 * @param {function} onError - A custom error handler to catch and respond to errors.
 *
 * @onError
 * Handles errors by logging the error stack and sending an appropriate HTTP status code
 * and error message in the response.
 * 
 * @param {Error} err - The error object containing stack trace and message.
 * @param {Request} req - The request object for the API call.
 * @param {Response} res - The response object to send error details.
 */
export default router.handler({
  onError: (err: any, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).end(err.message);
  },
});

export async function OPTIONS(request: Request) {
  const allowedOrigin = request.headers.get("origin");

  const response = new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers":
        "Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version",
      "Access-Control-Max-Age": "86400",
    },
  });
  return response;
}
