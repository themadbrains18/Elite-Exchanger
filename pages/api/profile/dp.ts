


import type { NextApiRequest, NextApiResponse } from "next";
import { createRouter, expressWrapper } from "next-connect";
import { postForm, getMethod, postData } from "../../../libs/requestMethod";
import AES from 'crypto-js/aes';
import { enc } from 'crypto-js';
import axios from "axios";
const router = createRouter<NextApiRequest, NextApiResponse>();

export const config = {
    api: {
        bodyParser: true,
    }
}

router
    .post(async (req: NextApiRequest, res: NextApiResponse) => {
        try {

            // let headers = {
            //     "Content-Type": req.headers["content-type"],
            //     'authorization': `${req.headers.authorization}`,
            // }
            // let data = await postForm(`${process.env.NEXT_PUBLIC_APIURL}/user/profile/dp`, req, headers);

            let token = req.headers.authorization;
            let data = await postData(`${process.env.NEXT_PUBLIC_APIURL}/user/profile/dp`, JSON.parse(req.body), token);
            
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