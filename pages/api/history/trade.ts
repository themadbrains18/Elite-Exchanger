import type { NextApiRequest, NextApiResponse } from "next";
import { createRouter, expressWrapper } from "next-connect";
import { getMethod, postData } from "../../../libs/requestMethod";
import AES from 'crypto-js/aes';
import { enc } from 'crypto-js';

const router = createRouter<NextApiRequest, NextApiResponse>();


export const config = {
    api: {
      bodyParser: true,
    },
}

// get user market all trade history by token and user id
    router.get(async (req, res)=>{
        try {
            let token = req.headers.authorization;
            let data = await getMethod(`${process.env.NEXT_PUBLIC_APIURL}/market/order/list/${req.query.userid}`, token);

            return res.status(200).send({ data });
        } catch (error:any) {
            throw new Error(error.message);
        }
    })


export default router.handler({
    onError: (err: any, req, res) => {
        console.error(err.stack);
        res.status(err.statusCode || 500).end(err.message);
    },
});