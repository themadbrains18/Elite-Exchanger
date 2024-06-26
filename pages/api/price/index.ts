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

            // var requestOptions: any = {
            //     method: 'GET',
            //     redirect: 'follow'
            // };
            // let responseData = await fetch(`https://min-api.cryptocompare.com/data/price?fsym=${req.query.fsym}&tsyms=${req.query.tsyms}`, requestOptions);

            // Call the API using a helper function and pass the necessary parameters.
            let responseData = await fetch("https://api.livecoinwatch.com/coins/single", {
                method: "POST",
                headers: new Headers({
                    "content-type": "application/json",
                    "x-api-key": "18ce228e-b0ff-4571-b468-062bc4762734",
                }),
                body: JSON.stringify({
                    currency: "INR",
                    code: req.query.fsym === 'BTCB' ? 'BTC' : req.query.fsym === 'BNBT' ? 'BNB' : req.query.fsym,
                    meta: false
                }),
            });

            let data = await responseData.json();
            // Respond with a 200 status and send the retrieved data.
            return res.status(200).send({ data });
        } catch (error: any) {
            // If an error occurs, throw it with its message for further handling.
            throw new Error(error.message)
        }
    });
// Add a POST handler to the router.
router.post(async (req, res) => {
    try {
        // Retrieve the authorization token from the request headers.
        let token = req.headers.authorization;

        const decodedStr = decodeURIComponent(req.body);
        let formData = AES.decrypt(decodedStr, `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`).toString(enc.Utf8);
        // Call the API using a helper function and pass the necessary parameters.
        let data = await postData(`${process.env.NEXT_PUBLIC_APIURL}/convert/create`, JSON.parse(formData), token);
        // Respond with a 200 status and send the retrieved data.
        return res.status(200).send({ data });

    } catch (error: any) {
        // If an error occurs, throw it with its message for further handling.
        throw new Error(error.message);
    }
})

// Define the error handler for the router.
export default router.handler({
    onError: (err: any, req, res) => {
        console.error(err.stack);
        res.status(err.statusCode || 500).end(err.message);
    },
});