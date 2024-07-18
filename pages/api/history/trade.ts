import type { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import { getMethod } from "../../../libs/requestMethod";

// Create a router instance for handling API requests.
const router = createRouter<NextApiRequest, NextApiResponse>();

// Configuration for this API route.
export const config = {
    api: {
        bodyParser: true,
    },
}

// Add a GET handler to the router.
router.get(async (req, res) => {
    try {
        // Destructure and retrieve variables from the query parameters.
        let { itemOffset, itemsPerPage, currency,date } = req.query;
        // Retrieve the authorization token from the request headers.
        let token = req.headers.authorization;
        // Call the API using a helper function and pass the necessary parameters.
        let data = await getMethod(`${process.env.NEXT_PUBLIC_APIURL}/market/order/list/${req.query.userid}/${itemOffset}/${itemsPerPage}/${currency}/${date}`, token);
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