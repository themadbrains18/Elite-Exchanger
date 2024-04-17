


import type { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import { postForm, getMethod } from "../../../libs/requestMethod";
const router = createRouter<NextApiRequest, NextApiResponse>();

export const config = {
    api: {
        bodyParser: false,
    }
}

router.get(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        let {itemOffset,itemsPerPage}= req.query;
        let token = req.headers.authorization;
        
        let data = await getMethod(`${process.env.NEXT_PUBLIC_APIURL}/p2p/all/${req?.query?.userid}/${itemOffset}/${itemsPerPage}`, token);

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