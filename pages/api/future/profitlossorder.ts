import type { NextApiRequest, NextApiResponse } from "next";
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

// Add a GET handler to the router.
router
    .get(async (req, res) => {
        try {

            // Retrieve the authorization token from the request headers.
            let token = req.headers.authorization;
            // Call the API using a helper function and pass the necessary parameters.
            let data = await getMethod(`${process.env.NEXT_PUBLIC_APIURL}/profitloss/all/`, token);
            // Respond with a 200 status and send the retrieved data.
            return res.status(200).send({ data });

        } catch (error: any) {
            // If an error occurs, throw it with its message for further handling.
            throw new Error(error.message)
        }
    });

// ==========================================
// Create buy/sell order by user for trading
// ==========================================
router.post(async (req, res) => {
    try {
        const decodedStr = decodeURIComponent(req.body);
        let formData = AES.decrypt(decodedStr, `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`).toString(enc.Utf8);

        // Retrieve the authorization token from the request headers.
        let token = req.headers.authorization;
        // Call the API using a helper function and pass the necessary parameters.
        let data = await postData(`${process.env.NEXT_PUBLIC_APIURL}/profitloss/create`, JSON.parse(formData), token);
        // Respond with a 200 status and send the retrieved data.
        return res.status(data.status).send({ data });

    } catch (error: any) {
        // If an error occurs, throw it with its message for further handling.
        throw new Error(error.message)
    }
})

// Define the error handler for the router.
export default router.handler({
    onError: (err: any, req, res) => {
        console.error(err.stack);
        res.status(err.statusCode || 500).end(err.message);
    },
});