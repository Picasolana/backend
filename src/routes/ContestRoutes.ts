import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import fs from 'fs';
import path from 'path';
import { IReq, IRes } from './types/types';

// eslint-disable-next-line @typescript-eslint/require-await
async function getImage(_req: IReq, res: IRes): Promise<IRes> {
  const imagePath = path.join(__dirname, '../public/images/picasso.jpg');

  const fileContent = fs.readFileSync(imagePath);
  if (fileContent) {
    return res.status(HttpStatusCodes.OK).json({
      image: 'data:image/jpeg;base64,' + fileContent.toString('base64'),
    });
  }

  return res
    .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
    .json({ error: 'Could not read image' });
}

export default {
  getImage,
} as const;
