


import type { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import { postForm, getMethod, deleteMethod } from "../../../libs/requestMethod";
const router = createRouter<NextApiRequest, NextApiResponse>();

import AES from 'crypto-js/aes';
import { enc } from 'crypto-js';

export const config = {
    api: {
        bodyParser: true,
    }
}

router
    .post(async (req, res) => {
        try {
            
            const decodedStr = decodeURIComponent(req.body);
            let formData =  AES.decrypt(decodedStr, `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`).toString(enc.Utf8);

            let form = JSON.parse(formData);
            
            let token = req.headers.authorization;
            let data = await deleteMethod(`${process.env.NEXT_PUBLIC_APIURL}/user/clearactivity/${form?.user_id}`,token);
            return res.status(200).send({ data });
            
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