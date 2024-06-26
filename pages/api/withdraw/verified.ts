import type { NextApiRequest, NextApiResponse } from "next";
import { createRouter, expressWrapper } from "next-connect";

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
            // Call the API using a helper function and pass the necessary parameters.
            let responseData = await fetch(`https://checkcryptoaddress.com/api/check-address`, {
                method: "POST",
                headers: new Headers({
                    "content-type": "application/json",
                }),
                redirect: 'follow',
                body: req.body
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