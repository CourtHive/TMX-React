import { drawInfo } from 'engineFactory/pdfEngine/node_modules/functions/draws/querying/drawInfo';
import { generateRange } from 'functions/arrays';

export function getFeedOptions({ stageDraws, selectedStage }) {
  const mainDraw = stageDraws && stageDraws.M[0];
  const mainDrawInfo = mainDraw && drawInfo(mainDraw.draw);
  const depth = (mainDrawInfo && mainDrawInfo.depth) || 1;

  let skipRoundsRange, feedRoundsRange;
  if (selectedStage === 'C') {
    skipRoundsRange = generateRange(0, depth - 1);
    feedRoundsRange = generateRange(1, depth);
  } else {
    skipRoundsRange = [0, 1, 2, 3];
    feedRoundsRange = [1, 2, 3, 4];
  }

  const skipRoundsOptions = skipRoundsRange.map((o) => ({ text: o, value: o }));
  const feedRoundsOptions = feedRoundsRange.map((o) => ({ text: o, value: o }));

  return { skipRoundsOptions, feedRoundsOptions };
}
