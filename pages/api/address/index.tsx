import type { NextApiRequest, NextApiResponse } from "next";
import { createRouter, expressWrapper } from "next-connect";
import { postData, getMethod } from "../../../libs/requestMethod";
import AES from 'crypto-js/aes';
import { enc } from 'crypto-js';

const router = createRouter<NextApiRequest, NextApiResponse>();


export const config = {
    api: {
      bodyParser: true,
    },
}


router
    .post(async (req, res) => {
        try {
            const decodedStr = decodeURIComponent(req.body);
            let formData =  AES.decrypt(decodedStr, `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`).toString(enc.Utf8);
            
            let token = req.headers.authorization;
            let data = await postData(`${process.env.NEXT_PUBLIC_APIURL}/address/create`, JSON.parse(formData),token);
            return res.status(data.status).send({data});
            
        } catch (error: any) {
            throw new Error(error.message)
        }
    });

    router
    .get(async (req, res) => {
        try {
            let token = req.headers.authorization;
            let data = await getMethod(`${process.env.NEXT_PUBLIC_APIURL}/withdraw/list/${req.query.user_id}`, token);

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