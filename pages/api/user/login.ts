import type { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import { createRouter, expressWrapper } from "next-connect";
import { postData } from "../../../libs/requestMethod";
import AES from "crypto-js/aes";
import { enc } from "crypto-js";
import useragent from "useragent";

// import CryptoJS from "crypto-js";
// interface MyApiRequest extends NextApiRequest {
//   useragent?: any; // You can refine the type as needed
// }
const router = createRouter<NextApiRequest, NextApiResponse>();

export const config = {
  api: {
    bodyParser: true,
  },
};

// router.use(withUserAgent);

router.post(async (req, res) => {
  try {
    const userAgentString = req.headers["user-agent"];
    const userAgent = useragent.parse(userAgentString);

    const deviceType = userAgent.device.family.toLowerCase();

    let device = ''
    // You can now check the device type and take appropriate actions
    if (deviceType.includes("iphone") || deviceType.includes("android")) {
      // It's a mobile device
      device = "mobile"
    } else if (deviceType.includes("ipad") || deviceType.includes("tablet")) {
      // It's a tablet
      device = "tablet"
    } else {
      // It's a desktop or other device
      device = "desktop"
    }
    // Access different properties of the user agent object
    const browser = userAgent.toAgent();
    const os = userAgent.os.toString();
    var locationData: any;

    let ip = await fetch("https://api.ipgeolocation.io/getip");
    
    let ipAddress = await ip.json();
    // console.log(await ipAddress.ip,'---------get ip');
    let ipInfoData = await fetch(`https://api.ipgeolocation.io/ipgeo?ip=${ipAddress?.ip}&apiKey=7d5fe611c25341e098d44f283185d665`);
    // .then((response) => response.text())
    // .then((result) => {locationData = JSON.parse(result) })
    // .catch((error) => console.error(error));
    
    // .then(response => response.json())
    // .then(data => {
    //   locationData = data
    // });
    // console.log(await ipInfoData.json(),'-------------ipInfoData');
    locationData = await ipInfoData.json();
    // return 

    const decodedStr = decodeURIComponent(req.body);
    let formData = AES.decrypt(
      decodedStr,
      `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`
    ).toString(enc.Utf8);

    let formdata = JSON.parse(formData);
    formdata.deviceType = device
    formdata.os = os
    formdata.browser = browser
    formdata.ip = locationData?.ip
    formdata.location = locationData?.country_name
    formdata.region = locationData?.state_prov


    let token = "";
    let data = await postData(
      `${process.env.NEXT_PUBLIC_APIURL}/user/login`,
      formdata,
      token
    );
    return res.status(200).send({ data });
  } catch (error: any) {
    console.log(error);

    throw new Error(error.message);
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
  // console.log(allowedOrigin,'============allowedOrigin');

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
