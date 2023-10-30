// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { promises as fs } from "fs";

import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  let SimpleNav = fs.readFile(process.cwd()+'/jsonData/simle-nav.json',"utf-8")
  let ProfileNav = fs.readFile(process.cwd()+'/jsonData/profile.json',"utf-8")

//  res.json({ message: 'Hello NextJs Cors!' });
}
