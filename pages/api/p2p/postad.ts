import type { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from 'next/server';
import { createRouter, expressWrapper } from "next-connect";
import {  getMethod, postData } from "../../../libs/requestMethod";
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
            const decodedStr = decodeURIComponent(req.body);
            let formData =  AES.decrypt(decodedStr, `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`).toString(enc.Utf8);
            
            let token = req.headers.authorization;
            let data = await postData(`${process.env.NEXT_PUBLIC_APIURL}/post/create`, JSON.parse(formData),token);
            return res.status(200).send({ data });
            
        } catch (error: any) {
            throw new Error(error.message)
        }
    });

  router
    .get(async (req, res) => {
        try {
            
            let {user_id}= req.query;
            let data = await getMethod(`${process.env.NEXT_PUBLIC_APIURL}/post/ordertotal/${user_id}`,'');
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

export async function OPTIONS(request: Request) {
    const allowedOrigin = request.headers.get("origin");
    
    const response = new NextResponse(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers":
          "Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version",
        "Access-Control-Max-Age": "86400",
      },
    });
  // console.log(response,'==============response');
  
    return response;
  }