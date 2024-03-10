import ContestEntry from '@src/models/Contest';
import ImageService from './ImageService';
import fs from 'fs';

async function getBestEntry(sessionId: string) {
  const entries = await ContestEntry.find({ sessionId }).sort({
    score: -1,
  });
  return entries[0];
}

async function init(prompt: string) {
  // return today file exists return
  const todayJsonPath = __dirname + '/../public/today.json';
  if (fs.existsSync(todayJsonPath)) {
    return;
  }
  const generatedImage = await ImageService.generateImage(prompt);
  const score = await ImageService.scoreImage(generatedImage, generatedImage);

  // save to file in ppublic
  const data = JSON.stringify({ generatedImage, score, prompt });
  fs.writeFileSync(todayJsonPath, data);
}

export default { getBestEntry, init };
