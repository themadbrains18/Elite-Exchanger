import type { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from 'next/server';
import { createRouter, expressWrapper } from "next-connect";
import { getMethod, postData } from "../../../libs/requestMethod";
import AES from 'crypto-js/aes';
import { enc } from 'crypto-js';

// Create a router instance for handling API requests.
const router = createRouter<NextApiRequest, NextApiResponse>();

// Configuration for this API route.
export const config = {
  api: {
    bodyParser: true,
  },
}

// Add a POST handler to the router.
router
  .post(async (req, res) => {
    try {
      const decodedStr = decodeURIComponent(req.body);
      let formData = AES.decrypt(decodedStr, `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`).toString(enc.Utf8);
      // Retrieve the authorization token from the request headers.
      let token = req.headers.authorization;
      // Call the API using a helper function and pass the necessary parameters.
      let data = await postData(`${process.env.NEXT_PUBLIC_APIURL}/post/create`, JSON.parse(formData), token);
      // Respond with a 200 status and send the retrieved data.
      return res.status(200).send({ data });

    } catch (error: any) {
      // If an error occurs, throw it with its message for further handling.
      throw new Error(error.message)
    }
  });
// Add a GET handler to the router.
router
  .get(async (req, res) => {
    try {
      // Destructure and retrieve variables from the query parameters.
      let { user_id } = req.query;
      // Call the API using a helper function and pass the necessary parameters.
      let data = await getMethod(`${process.env.NEXT_PUBLIC_APIURL}/post/ordertotal/${user_id}`, '');
      // Respond with a 200 status and send the retrieved data.
      return res.status(200).send({ data });

    } catch (error: any) {
      // If an error occurs, throw it with its message for further handling.
      throw new Error(error.message)
    }
  });

// Define the error handler for the router.
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
  // console.log(response,'==============response');

  return response;
}