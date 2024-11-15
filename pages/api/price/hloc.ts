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

            // Destructure and retrieve variables from the query parameters.
            let currency = req.query.slug === 'BTCB' ? 'BTC' : req.query.slug === 'BNBT' ? 'BNB' : req.query.slug;
            console.log(currency,"==currency");
            

            // Call the API using a helper function and pass the necessary parameters.
            let responseData = await fetch(`https://api.kucoin.com/api/v1/market/stats?symbol=${currency}-USDT`, {
                method: "GET",
                headers: new Headers({
                    "content-type": "application/json",
                }),
            });

            // const myHeaders = new Headers();
            //     myHeaders.append("content-type", "application/json");

            //     const requestOptions :any = {
            //     method: "GET",
            //     headers: myHeaders,
            //     redirect: "follow"
            //     };

            //     fetch("https://api.kucoin.com/api/v1/market/stats?symbol=BTC-USDT", requestOptions)
            //     .then((response) => response.json())
            //     .then((result) => console.log(result,'==========hloc data'))
            //     .catch((error) => console.error(error));

            //     return res.status(200).send(null); 

            let data = await responseData.json();
            // Respond with a 200 status and send the retrieved data.
            return res.status(200).send({ data });
        } catch (error: any) {
            // If an error occurs, throw it with its message for further handling.
            console.error('Error:', error.message); // Log the error
            
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