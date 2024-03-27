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

router
    .get(async (req, res) => {
        try {

            let currency=  req.query.slug === 'BTCB' ? 'BTC' : req.query.slug === 'BNBT' ? 'BNB' : req.query.slug;
            
            let responseData = await fetch(`https://api.kucoin.com/api/v1/market/stats?symbol=${currency}-USDT`, {
                method: "GET",
                headers: new Headers({
                    "content-type": "application/json",
                }),
            });

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