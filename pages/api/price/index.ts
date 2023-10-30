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

            var requestOptions: any = {
                method: 'GET',
                redirect: 'follow'
            };
            let responseData = await fetch(`https://min-api.cryptocompare.com/data/price?fsym=${req.query.fsym}&tsyms=${req.query.tsyms}`, requestOptions);

            // let responseData = await fetch("https://api.livecoinwatch.com/coins/list", {
            //     method: "POST",
            //     headers: new Headers({
            //         "content-type": "application/json",
            //         "x-api-key": "543bc2be-caf7-4e9c-b83d-1eb9c6d08c20",
            //     }),
            //     body: JSON.stringify({
            //         currency: "USD",
            //         sort: "rank",
            //         order: "ascending",
            //         offset: 0,
            //         limit: 100,
            //         meta: true,
            //     }),
            // });
            
            let data = await responseData.json();

            return res.status(200).send({ data });
        } catch (error: any) {
            throw new Error(error.message)
        }
    });
router.post(async (req, res) => {
    try {
        let token = req.headers.authorization;

        const decodedStr = decodeURIComponent(req.body);
        let formData = AES.decrypt(decodedStr, `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`).toString(enc.Utf8);

        let data = await postData(`${process.env.NEXT_PUBLIC_APIURL}/convert/create`, JSON.parse(formData), token);
        return res.status(200).send({ data });

    } catch (error: any) {
        throw new Error(error.message);
    }
})

export default router.handler({
    onError: (err: any, req, res) => {
        console.error(err.stack);
        res.status(err.statusCode || 500).end(err.message);
    },
});