import Config from "./config.js";
import { transformScore } from "../transform/index.js";
import { transformMatches } from "../transform/index.js";

function format(
  results,
  docs,
  {
    includeMatches = Config.includeMatches,
    includeScore = Config.includeScore,
  } = {}
) {
  const transformers = [];

  if (includeMatches) transformers.push(transformMatches);

  if (includeScore) transformers.push(transformScore);

  return results.map((result) => {
    const { idx } = result;

    const data = {
      item: docs[idx],
      refIndex: idx,
    };

    if (transformers.length)
      transformers.forEach((transformer) => {
        transformer(result, data);
      });

    return data;
  });
}

export default format;
