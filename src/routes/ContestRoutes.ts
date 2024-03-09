import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { IReq, IRes } from './types/express/misc';
import ImageService from '@src/services/ImageService';
import { IUser } from '@src/models/User';
import ContestService from '@src/services/ContestService';

function getTargetImage(_req: IReq, res: IRes): IRes {
  const targetImage = ImageService.targetImage();
  if (targetImage) {
    return res.status(HttpStatusCodes.OK).json({
      image: 'data:image/jpeg;base64,' + targetImage,
    });
  }

  return res
    .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
    .json({ error: 'Could not read image' });
}

async function submitPrompt(
  req: IReq<{ prompt: string; user: IUser }>,
  res: IRes
): Promise<IRes> {
  const isEligible = await ContestService.isEligible(req.body.user);
  if (!isEligible) {
    return res
      .status(HttpStatusCodes.BAD_REQUEST)
      .json({ error: 'User is not eligible' });
  }
  const entry = await ContestService.submitPrompt(
    req.body.user,
    req.body.prompt
  );
  if (!entry) {
    return res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: 'Could not submit entry' });
  }

  return res.status(HttpStatusCodes.OK).json(entry);
}

export default {
  getImage: getTargetImage,
  submitPrompt,
} as const;
