// import NextCors from 'nextjs-cors';
// import type { NextApiRequest, NextApiResponse } from 'next'

// type Data = {
//   name: string
// }

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {

//   console.log('========here==========');
    
//   await NextCors(req, res, {
//     methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
//     origin: '*',
//     optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
//  });

// //  res.json({ message: 'Hello NextJs Cors!' });
//   res.status(200).json({
//     message: 'Hello NextJs Cors!'
//    })
// }
