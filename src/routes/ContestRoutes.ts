import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import fs from 'fs';
import path from 'path';
import { IReq, IRes } from './types/express/misc';
import ImageService from '@src/services/ImageService';

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

async function submitPrompt(
  req: IReq<{ prompt: string }>,
  res: IRes
): Promise<IRes> {
  const image = await ImageService.generateImage(req.body.prompt);
  if (!image) {
    return res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: 'Could not generate image' });
  }

  return res
    .status(HttpStatusCodes.OK)
    .json({ image: 'data:image/jpeg;base64,' + image });
}

export default {
  getImage,
  submitPrompt,
} as const;
