import type { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import { postData } from "../../../libs/requestMethod";
// import CryptoJS from "crypto-js";
import AES from 'crypto-js/aes';
import { enc } from 'crypto-js';

const router = createRouter<NextApiRequest, NextApiResponse>();


export const config = {
    api: {
      bodyParser: true,
    },
}


router
    // Use express middleware in next-connect with expressWrapper function
    .post(async (req, res) => {
        try {         
            const decodedStr = decodeURIComponent(req.body);
            let formData =  AES.decrypt(decodedStr, `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`).toString(enc.Utf8);
            let token = req.headers.authorization;
            let data = await postData(`${process.env.NEXT_PUBLIC_APIURL}/user/googleAuth`, JSON.parse(formData),token);
             return res.status(200).send({ data, status:200 });
            
        } catch (error: any) {
            throw new Error(error.message)
        }
    });


export default router.handler({
    onError: (err: any, req, res) => {
        console.error(err.stack);
        res.status(err.statusCode || 500).end(err.message);
    },
});