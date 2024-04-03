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

            console.log(req.body, "==req.body");

            let responseData = await fetch(`https://checkcryptoaddress.com/api/check-address`, {
                method: "POST",
                headers: new Headers({
                    "content-type": "application/json",
                }),
                redirect: 'follow',
                body: req.body
            });
            console.log(responseData,"==responseData");
            
            let data = await responseData.json();

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