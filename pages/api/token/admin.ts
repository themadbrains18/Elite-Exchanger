import type { NextApiRequest, NextApiResponse } from "next";
import { createRouter, expressWrapper } from "next-connect";
import { getMethod, putData } from "../../../libs/requestMethod";

const router = createRouter<NextApiRequest, NextApiResponse>();

export const config = {
    api: {
      bodyParser: true,
    },
}

router
    .get(async (req, res) => {
        try {
            let data = await getMethod(`${process.env.NEXT_PUBLIC_APIURL}/token/list/all`);     
            return res.status(200).send({ data });

        } catch (error: any) {
            throw new Error(error.message)
        }
    });

router.put(async(req,res)=>{
    try {
        let token = '';
        let data = await putData(`${process.env.NEXT_PUBLIC_APIURL}/token/change/status`, JSON.parse(req.body),token);
             return res.status(200).send({ data});
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