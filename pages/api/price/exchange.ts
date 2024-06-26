import type { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";

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
                    currency: req.query.tsyms === 'BTCB' ? 'BTC' : req.query.tsyms === 'BNBT' ? 'BNB' : req.query.tsyms,
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

// Define the error handler for the router.
export default router.handler({
    onError: (err: any, req, res) => {
        console.error(err.stack);
        res.status(err.statusCode || 500).end(err.message);
    },
});