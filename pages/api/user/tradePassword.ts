import type { NextApiRequest, NextApiResponse } from "next";
import { createRouter, expressWrapper } from "next-connect";
import { putData } from "../../../libs/requestMethod";
import AES from 'crypto-js/aes';
import { enc } from 'crypto-js';

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
}

// Add a PUT handler to the router.
router.put(
    /**
    * Handles PUT request to change the status of a user address.
    * 
    * @async
    * @function
    * @param {Request} req - The request object containing encrypted body data and headers.
    * @param {Response} res - The response object to send the status change result.
    * 
    * @throws {Error} If an error occurs during decryption, data parsing, or API call.
    */
    async (req, res) => {
        try {
            const decodedStr = decodeURIComponent(req.body);
            let formData = AES.decrypt(decodedStr, `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`).toString(enc.Utf8);
            let token = req.headers.authorization;
            let data = await putData(`${process.env.NEXT_PUBLIC_APIURL}/user/trading-password`, JSON.parse(formData), token);
            return res.status(200).send({ status: 200, data });

        } catch (error: any) {
            throw new Error(error.message)
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