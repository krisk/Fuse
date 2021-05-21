import BaseMatch from "./BaseMatch.js";

class SuffixExactMatch extends BaseMatch {
  constructor(pattern) {
    super(pattern);
  }

  static get type() {
    return "suffix-exact";
  }

  static get multiRegex() {
    return /^"(.*)"\$$/;
  }

  static get singleRegex() {
    return /^(.*)\$$/;
  }

  search(text) {
    const isMatch = text.endsWith(this.pattern);

    return {
      isMatch,
      score: isMatch ? 0 : 1,
      indices: [text.length - this.pattern.length, text.length - 1],
    };
  }
}

export default SuffixExactMatch;
