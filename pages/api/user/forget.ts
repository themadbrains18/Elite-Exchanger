import type { NextApiRequest, NextApiResponse } from "next";
import { createRouter, expressWrapper } from "next-connect";
import { putData } from "../../../libs/requestMethod";
// import CryptoJS from "crypto-js";
import AES from "crypto-js/aes";
import { enc } from "crypto-js";

const router = createRouter<NextApiRequest, NextApiResponse>();

export const config = {
  api: {
    bodyParser: true,
  },
};

router
  // Use express middleware in next-connect with expressWrapper function
  .post(async (req, res) => {
    try {
      const decodedStr = decodeURIComponent(req.body);
      let formData = AES.decrypt(
        decodedStr,
        `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`
      ).toString(enc.Utf8);
      let token = req.headers.authorization;
   
      let data = await putData(
        `${process.env.NEXT_PUBLIC_APIURL}/user/forget`,
        JSON.parse(formData),
        token
      );
      return res.status(200).send({ status: 200, data });
    } catch (error: any) {
      throw new Error(error.message);
    }
  });

export default router.handler({
  onError: (err: any, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).end(err.message);
  },
});
