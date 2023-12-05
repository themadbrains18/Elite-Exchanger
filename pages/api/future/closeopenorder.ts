import type { NextApiRequest, NextApiResponse } from "next";
import { createRouter, expressWrapper } from "next-connect";
import { getMethod, postData, deleteMethod } from "../../../libs/requestMethod";

const router = createRouter<NextApiRequest, NextApiResponse>();

export const config = {
    api: {
        bodyParser: true,
    },
}

// ==========================================
// Create buy/sell order by user for trading
// ==========================================
router.post(async (req, res) => {
    try {
        // const decodedStr = decodeURIComponent(req.body);
        // let formData = AES.decrypt(decodedStr, `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`).toString(enc.Utf8);

        let token = req.headers.authorization;
        let data = await deleteMethod(`${process.env.NEXT_PUBLIC_APIURL}/futureorder/close/${req?.body?.id}`, token);

        return res.status(200).send({ data });

    } catch (error: any) {
        throw new Error(error.message)
    }
})

export default router.handler({
    onError: (err: any, req, res) => {
        console.error(err.stack);
        res.status(err.statusCode || 500).end(err.message);
    },
});