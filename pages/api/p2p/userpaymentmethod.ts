


import type { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import { postData, getMethod } from "../../../libs/requestMethod";
const router = createRouter<NextApiRequest, NextApiResponse>();
import AES from 'crypto-js/aes';
import { enc } from 'crypto-js';

export const config = {
    api: {
        bodyParser: true,
    }
}

router.get(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        let token = req.headers.authorization;

        let data = await getMethod(`${process.env.NEXT_PUBLIC_APIURL}/payment/get-method`, token);

        return res.status(200).send({ data });
    } catch (error: any) {
        throw new Error(error.message)
    }
});

router.post(async (req: NextApiRequest, res: NextApiResponse) => {
    try {

        const decodedStr = decodeURIComponent(req.body);
        let formData = AES.decrypt(decodedStr, `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`).toString(enc.Utf8);
        let token = req.headers.authorization;

        let data = await postData(`${process.env.NEXT_PUBLIC_APIURL}/payment/addmethod`, JSON.parse(formData), token);

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