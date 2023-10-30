import type { NextApiRequest, NextApiResponse } from "next";
import { createRouter, expressWrapper } from "next-connect";
import { postData } from "../../../../libs/requestMethod";
import AES from 'crypto-js/aes';
import { enc } from 'crypto-js';
// import CryptoJS from "crypto-js";

const router = createRouter<NextApiRequest, NextApiResponse>();

export const config = {
    api: {
      bodyParser: true,
    },
}

router
    .post(async (req, res) => {
        try {
            console.log('==========here=============');
            return;
            const decodedStr = decodeURIComponent(req.body);
            let formData =  AES.decrypt(decodedStr, `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`).toString(enc.Utf8);

            
            let token = '';
            let data = await postData(`${process.env.NEXT_PUBLIC_APIURL}/user/login`, JSON.parse(formData),token);
            return res.status(data.status).send({ data });
            
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