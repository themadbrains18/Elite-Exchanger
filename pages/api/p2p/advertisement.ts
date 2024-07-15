import type { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import { getMethod, deleteMethod } from "../../../libs/requestMethod";

// Create a router instance for handling API requests.
const router = createRouter<NextApiRequest, NextApiResponse>();

import AES from 'crypto-js/aes';
import { enc } from 'crypto-js';

// Configuration for this API route.
export const config = {
    api: {
        bodyParser: true,
    }
}

// Add a GET handler to the router.
router.get(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        // Retrieve the authorization token from the request headers.
        let token = req.headers.authorization;

        console.log(token,"==here token");
        
        // Destructure and retrieve variables from the query parameters.
        let { status, itemOffset, itemsPerPage,currency,pmMethod,date } = req.query;
        // Call the API using a helper function and pass the necessary parameters.
        let data = await getMethod(`${process.env.NEXT_PUBLIC_APIURL}/post/get/${status}/${itemOffset}/${itemsPerPage}/${currency}/${pmMethod}/${date}`, token);
        // Respond with a 200 status and send the retrieved data.
        return res.status(200).send({ data });
    } catch (error: any) {
        // If an error occurs, throw it with its message for further handling.
        throw new Error(error.message)
    }
});

// Add a POST handler to the router.
router
    .post(async (req, res) => {
        try {
            const decodedStr = decodeURIComponent(req.body);
            let formData = AES.decrypt(decodedStr, `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`).toString(enc.Utf8);

            let form = JSON.parse(formData);
            // Retrieve the authorization token from the request headers.
            let token = req.headers.authorization;
            // Call the API using a helper function and pass the necessary parameters.
            let data = await deleteMethod(`${process.env.NEXT_PUBLIC_APIURL}/post/delete/${form?.post_id}/${form?.user_id}`, token);
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