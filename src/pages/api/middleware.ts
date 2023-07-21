// pages/api/middleware.ts

import { NextApiRequest, NextApiResponse } from 'next';

const loggerMiddleware = (req: NextApiRequest, res: NextApiResponse, next: Function) => {
  console.log(`Incoming ${req.method} request to ${req.url}`);
  next();
};

export default loggerMiddleware;
