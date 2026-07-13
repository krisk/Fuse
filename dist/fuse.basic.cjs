/**
 * Fuse.js v7.5.0 - Lightweight fuzzy-search (http://fusejs.io)
 *
 * Copyright (c) 2026 Kiro Risk (http://kiro.me)
 * All Rights Reserved. Apache Software License 2.0
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */

//#region src/helpers/typeGuards.ts
function isArray(value) {
	return !Array.isArray ? getTag(value) === "[object Array]" : Array.isArray(value);
}
function baseToString(value) {
	if (typeof value == "string") return value;
	if (typeof value === "bigint") return value.toString();
	const result = value + "";
	return result == "0" && 1 / value == -Infinity ? "-0" : result;
}
function toString(value) {
	return value == null ? "" : baseToString(value);
}
function isString(value) {
	return typeof value === "string";
}
function isNumber(value) {
	return typeof value === "number";
}
function isBoolean(value) {
	return value === true || value === false || isObjectLike(value) && getTag(value) == "[object Boolean]";
}
function isObject(value) {
	return typeof value === "object";
}
function isObjectLike(value) {
	return isObject(value) && value !== null;
}
function isDefined(value) {
	return value !== void 0 && value !== null;
}
function isBlank(value) {
	return !value.trim().length;
}
function getTag(value) {
	return value == null ? value === void 0 ? "[object Undefined]" : "[object Null]" : Object.prototype.toString.call(value);
}

//#endregion
//#region src/core/errorMessages.ts
const EXTENDED_SEARCH_UNAVAILABLE = "Extended search is not available";
const LOGICAL_SEARCH_UNAVAILABLE = "Logical search is not available";
const TOKEN_SEARCH_UNAVAILABLE = "Token search is not available";
const INCORRECT_INDEX_TYPE = "Incorrect 'index' type";
const INVALID_DOC_INDEX = "Invalid doc index: must be a non-negative integer within the bounds of the docs array";
const LOGICAL_SEARCH_INVALID_QUERY_FOR_KEY = (key) => `Invalid value for key ${key}`;
const PATTERN_LENGTH_TOO_LARGE = (max) => `Pattern length exceeds max of ${max}.`;
const MISSING_KEY_PROPERTY = (name) => `Missing ${name} property in key`;
const INVALID_KEY_WEIGHT_VALUE = (key) => `Property 'weight' in key '${key}' must be a positive integer`;
const FUSE_MATCH_TOKEN_SEARCH_UNSUPPORTED = "Fuse.match does not support useTokenSearch: token search requires corpus-level statistics (df, fieldCount) that a one-off string comparison does not have. Use new Fuse(...).search(...) instead.";

//#endregion
//#region src/tools/KeyStore.ts
const hasOwn = Object.prototype.hasOwnProperty;
var KeyStore = class {
	constructor(keys) {
		this._keys = [];
		this._keyMap = {};
		let totalWeight = 0;
		keys.forEach((key) => {
			const obj = createKey(key);
			this._keys.push(obj);
			this._keyMap[obj.id] = obj;
			totalWeight += obj.weight;
		});
		this._keys.forEach((key) => {
			key.weight /= totalWeight;
		});
	}
	get(keyId) {
		return this._keyMap[keyId];
	}
	keys() {
		return this._keys;
	}
	toJSON() {
		return JSON.stringify(this._keys);
	}
};
function createKey(key) {
	let path = null;
	let id = null;
	let src = null;
	let weight = 1;
	let getFn = null;
	if (isString(key) || isArray(key)) {
		src = key;
		path = createKeyPath(key);
		id = createKeyId(key);
	} else {
		if (!hasOwn.call(key, "name")) throw new Error(MISSING_KEY_PROPERTY("name"));
		const name = key.name;
		src = name;
		if (hasOwn.call(key, "weight") && key.weight !== void 0) {
			weight = key.weight;
			if (weight <= 0) throw new Error(INVALID_KEY_WEIGHT_VALUE(createKeyId(name)));
		}
		path = createKeyPath(name);
		id = createKeyId(name);
		getFn = key.getFn ?? null;
	}
	return {
		path,
		id,
		weight,
		src,
		getFn
	};
}
function createKeyPath(key) {
	return isArray(key) ? key : key.split(".");
}
function createKeyId(key) {
	return isArray(key) ? key.join(".") : key;
}

//#endregion
//#region src/helpers/get.ts
function get(obj, path) {
	const list = [];
	let arr = false;
	const deepGet = (obj, path, index, arrayIndex) => {
		if (!isDefined(obj)) return;
		if (!path[index]) list.push(arrayIndex !== void 0 ? {
			v: obj,
			i: arrayIndex
		} : obj);
		else {
			const value = obj[path[index]];
			if (!isDefined(value)) return;
			if (index === path.length - 1 && (isString(value) || isNumber(value) || isBoolean(value) || typeof value === "bigint")) list.push(arrayIndex !== void 0 ? {
				v: toString(value),
				i: arrayIndex
			} : toString(value));
			else if (isArray(value)) {
				arr = true;
				for (let i = 0, len = value.length; i < len; i += 1) deepGet(value[i], path, index + 1, i);
			} else if (path.length) deepGet(value, path, index + 1, arrayIndex);
		}
	};
	deepGet(obj, isString(path) ? path.split(".") : path, 0);
	return arr ? list : list[0];
}

//#endregion
//#region src/core/config.ts
const MatchOptions = {
	includeMatches: false,
	findAllMatches: false,
	minMatchCharLength: 1
};
const BasicOptions = {
	isCaseSensitive: false,
	ignoreDiacritics: false,
	includeScore: false,
	keys: [],
	shouldSort: true,
	sortFn: (a, b) => a.score === b.score ? a.idx < b.idx ? -1 : 1 : a.score < b.score ? -1 : 1
};
const FuzzyOptions = {
	location: 0,
	threshold: .6,
	distance: 100
};
const AdvancedOptions = {
	useExtendedSearch: false,
	useTokenSearch: false,
	tokenize: void 0,
	tokenMatch: "any",
	getFn: get,
	ignoreLocation: false,
	ignoreFieldNorm: false,
	fieldNormWeight: 1
};
const Config = Object.freeze({
	...BasicOptions,
	...MatchOptions,
	...FuzzyOptions,
	...AdvancedOptions
});

//#endregion
//#region src/tools/fieldNorm.ts
function isWordSeparator(code) {
	return code >= 9 && code <= 13 || code === 32 || code === 160;
}
function norm(weight = 1, mantissa = 3) {
	const cache = /* @__PURE__ */ new Map();
	const m = Math.pow(10, mantissa);
	return {
		get(value) {
			let numTokens = 0;
			let inWord = false;
			for (let i = 0; i < value.length; i++) if (!isWordSeparator(value.charCodeAt(i))) {
				if (!inWord) {
					numTokens++;
					inWord = true;
				}
			} else inWord = false;
			if (numTokens === 0) numTokens = 1;
			if (cache.has(numTokens)) return cache.get(numTokens);
			const n = Math.round(m / Math.pow(numTokens, .5 * weight)) / m;
			cache.set(numTokens, n);
			return n;
		},
		clear() {
			cache.clear();
		}
	};
}

//#endregion
//#region src/tools/FuseIndex.ts
var FuseIndex = class {
	constructor({ getFn = Config.getFn, fieldNormWeight = Config.fieldNormWeight } = {}) {
		this.norm = norm(fieldNormWeight, 3);
		this.getFn = getFn;
		this.isCreated = false;
		this.docs = [];
		this.keys = [];
		this._keysMap = {};
		this.setIndexRecords();
	}
	setSources(docs = []) {
		this.docs = docs;
	}
	setIndexRecords(records = []) {
		this.records = records;
	}
	setKeys(keys = []) {
		this.keys = keys;
		this._keysMap = {};
		keys.forEach((key, idx) => {
			this._keysMap[key.id] = idx;
		});
	}
	create() {
		if (this.isCreated || !this.docs.length) return;
		this.isCreated = true;
		const len = this.docs.length;
		this.records = new Array(len);
		let recordCount = 0;
		if (isString(this.docs[0])) for (let i = 0; i < len; i++) {
			const record = this._createStringRecord(this.docs[i], i);
			if (record) this.records[recordCount++] = record;
		}
		else for (let i = 0; i < len; i++) this.records[recordCount++] = this._createObjectRecord(this.docs[i], i);
		this.records.length = recordCount;
		this.norm.clear();
	}
	add(doc, docIndex) {
		if (!Number.isInteger(docIndex) || docIndex < 0) throw new Error(INVALID_DOC_INDEX);
		if (isString(doc)) {
			const record = this._createStringRecord(doc, docIndex);
			if (record) this.records.push(record);
			return record;
		}
		const record = this._createObjectRecord(doc, docIndex);
		this.records.push(record);
		return record;
	}
	removeAt(idx) {
		if (!Number.isInteger(idx) || idx < 0) throw new Error(INVALID_DOC_INDEX);
		for (let i = 0, len = this.records.length; i < len; i += 1) if (this.records[i].i === idx) {
			this.records.splice(i, 1);
			break;
		}
		for (let i = 0, len = this.records.length; i < len; i += 1) if (this.records[i].i > idx) this.records[i].i -= 1;
	}
	removeAll(indices) {
		const toRemove = /* @__PURE__ */ new Set();
		for (const v of indices) if (Number.isInteger(v) && v >= 0) toRemove.add(v);
		if (toRemove.size === 0) return;
		this.records = this.records.filter((r) => !toRemove.has(r.i));
		const sorted = Array.from(toRemove).sort((a, b) => a - b);
		for (const record of this.records) {
			let lo = 0;
			let hi = sorted.length;
			while (lo < hi) {
				const mid = lo + hi >>> 1;
				if (sorted[mid] < record.i) lo = mid + 1;
				else hi = mid;
			}
			record.i -= lo;
		}
	}
	getValueForItemAtKeyId(item, keyId) {
		return item[this._keysMap[keyId]];
	}
	size() {
		return this.records.length;
	}
	_createStringRecord(doc, docIndex) {
		if (!isDefined(doc) || isBlank(doc)) return null;
		return {
			v: doc,
			i: docIndex,
			n: this.norm.get(doc)
		};
	}
	_createObjectRecord(doc, docIndex) {
		const record = {
			i: docIndex,
			$: {}
		};
		for (let keyIndex = 0, keyLen = this.keys.length; keyIndex < keyLen; keyIndex++) {
			const key = this.keys[keyIndex];
			const value = key.getFn ? key.getFn(doc) : this.getFn(doc, key.path);
			if (!isDefined(value)) continue;
			if (isArray(value)) {
				const subRecords = [];
				for (let i = 0, len = value.length; i < len; i += 1) {
					const item = value[i];
					if (!isDefined(item)) continue;
					if (isString(item)) {
						if (!isBlank(item)) {
							const subRecord = {
								v: item,
								i,
								n: this.norm.get(item)
							};
							subRecords.push(subRecord);
						}
					} else if (isDefined(item.v)) {
						const text = isString(item.v) ? item.v : toString(item.v);
						if (!isBlank(text)) {
							const subRecord = {
								v: text,
								i: item.i,
								n: this.norm.get(text)
							};
							subRecords.push(subRecord);
						}
					}
				}
				record.$[keyIndex] = subRecords;
			} else if (isString(value) && !isBlank(value)) {
				const subRecord = {
					v: value,
					n: this.norm.get(value)
				};
				record.$[keyIndex] = subRecord;
			}
		}
		return record;
	}
	toJSON() {
		return {
			keys: this.keys.map(({ getFn, ...key }) => key),
			records: this.records
		};
	}
};
function createIndex(keys, docs, { getFn = Config.getFn, fieldNormWeight = Config.fieldNormWeight } = {}) {
	const myIndex = new FuseIndex({
		getFn,
		fieldNormWeight
	});
	myIndex.setKeys(keys.map(createKey));
	myIndex.setSources(docs);
	myIndex.create();
	return myIndex;
}
function parseIndex(data, { getFn = Config.getFn, fieldNormWeight = Config.fieldNormWeight } = {}) {
	const { keys, records } = data;
	const myIndex = new FuseIndex({
		getFn,
		fieldNormWeight
	});
	myIndex.setKeys(keys);
	myIndex.setIndexRecords(records);
	return myIndex;
}

//#endregion
//#region src/search/bitap/convertMaskToIndices.ts
function convertMaskToIndices(matchmask = [], minMatchCharLength = Config.minMatchCharLength) {
	const indices = [];
	let start = -1;
	let end = -1;
	let i = 0;
	for (let len = matchmask.length; i < len; i += 1) {
		const match = matchmask[i];
		if (match && start === -1) start = i;
		else if (!match && start !== -1) {
			end = i - 1;
			if (end - start + 1 >= minMatchCharLength) indices.push([start, end]);
			start = -1;
		}
	}
	if (matchmask[i - 1] && i - start >= minMatchCharLength) indices.push([start, i - 1]);
	return indices;
}

//#endregion
//#region src/search/bitap/search.ts
function search(text, pattern, patternAlphabet, { location = Config.location, distance = Config.distance, threshold = Config.threshold, findAllMatches = Config.findAllMatches, minMatchCharLength = Config.minMatchCharLength, includeMatches = Config.includeMatches, ignoreLocation = Config.ignoreLocation } = {}) {
	if (pattern.length > 32) throw new Error(PATTERN_LENGTH_TOO_LARGE(32));
	const patternLen = pattern.length;
	const textLen = text.length;
	const expectedLocation = Math.max(0, Math.min(location, textLen));
	let currentThreshold = threshold;
	let bestLocation = expectedLocation;
	const calcScore = (errors, currentLocation) => {
		const accuracy = errors / patternLen;
		if (ignoreLocation) return accuracy;
		const proximity = Math.abs(expectedLocation - currentLocation);
		if (!distance) return proximity ? 1 : accuracy;
		return accuracy + proximity / distance;
	};
	const computeMatches = minMatchCharLength > 1 || includeMatches;
	const matchMask = computeMatches ? Array(textLen) : [];
	let index;
	while ((index = text.indexOf(pattern, bestLocation)) > -1) {
		const score = calcScore(0, index);
		currentThreshold = Math.min(score, currentThreshold);
		bestLocation = index + patternLen;
		if (computeMatches) {
			let i = 0;
			while (i < patternLen) {
				matchMask[index + i] = 1;
				i += 1;
			}
		}
	}
	bestLocation = -1;
	let lastBitArr = [];
	let finalScore = 1;
	let bestErrors = 0;
	let binMax = patternLen + textLen;
	const mask = 1 << patternLen - 1;
	for (let i = 0; i < patternLen; i += 1) {
		let binMin = 0;
		let binMid = binMax;
		while (binMin < binMid) {
			if (calcScore(i, expectedLocation + binMid) <= currentThreshold) binMin = binMid;
			else binMax = binMid;
			binMid = Math.floor((binMax - binMin) / 2 + binMin);
		}
		binMax = binMid;
		let start = Math.max(1, expectedLocation - binMid + 1);
		const finish = findAllMatches ? textLen : Math.min(expectedLocation + binMid, textLen) + patternLen;
		const bitArr = Array(finish + 2);
		bitArr[finish + 1] = (1 << i) - 1;
		for (let j = finish; j >= start; j -= 1) {
			const currentLocation = j - 1;
			const charMatch = patternAlphabet[text[currentLocation]];
			bitArr[j] = (bitArr[j + 1] << 1 | 1) & charMatch;
			if (i) bitArr[j] |= (lastBitArr[j + 1] | lastBitArr[j]) << 1 | 1 | lastBitArr[j + 1];
			if (bitArr[j] & mask) {
				finalScore = calcScore(i, currentLocation);
				if (finalScore <= currentThreshold) {
					currentThreshold = finalScore;
					bestLocation = currentLocation;
					bestErrors = i;
					if (bestLocation <= expectedLocation) break;
					start = Math.max(1, 2 * expectedLocation - bestLocation);
				}
			}
		}
		if (calcScore(i + 1, expectedLocation) > currentThreshold) break;
		lastBitArr = bitArr;
	}
	if (computeMatches && bestLocation >= 0) {
		const matchEnd = Math.min(textLen - 1, bestLocation + patternLen - 1 + bestErrors);
		for (let k = bestLocation; k <= matchEnd; k += 1) if (patternAlphabet[text[k]]) matchMask[k] = 1;
	}
	const result = {
		isMatch: bestLocation >= 0,
		score: Math.max(.001, finalScore)
	};
	if (computeMatches) {
		const indices = convertMaskToIndices(matchMask, minMatchCharLength);
		if (!indices.length) result.isMatch = false;
		else if (includeMatches) result.indices = indices;
	}
	return result;
}

//#endregion
//#region src/search/bitap/createPatternAlphabet.ts
function createPatternAlphabet(pattern) {
	const mask = {};
	for (let i = 0, len = pattern.length; i < len; i += 1) {
		const char = pattern.charAt(i);
		mask[char] = (mask[char] || 0) | 1 << len - i - 1;
	}
	return mask;
}

//#endregion
//#region src/helpers/mergeIndices.ts
function mergeIndices(indices) {
	if (indices.length <= 1) return indices;
	indices.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
	const merged = [indices[0]];
	for (let i = 1, len = indices.length; i < len; i += 1) {
		const last = merged[merged.length - 1];
		const curr = indices[i];
		if (curr[0] <= last[1] + 1) last[1] = Math.max(last[1], curr[1]);
		else merged.push(curr);
	}
	return merged;
}

//#endregion
//#region src/helpers/diacritics.ts
const NON_DECOMPOSABLE_MAP = {
	"ł": "l",
	"Ł": "L",
	"đ": "d",
	"Đ": "D",
	"ø": "o",
	"Ø": "O",
	"ħ": "h",
	"Ħ": "H",
	"ŧ": "t",
	"Ŧ": "T",
	"ı": "i",
	"ß": "ss"
};
const NON_DECOMPOSABLE_RE = new RegExp("[" + Object.keys(NON_DECOMPOSABLE_MAP).join("") + "]", "g");
const stripDiacritics = typeof String.prototype.normalize === "function" ? (str) => str.normalize("NFD").replace(/[\u0300-\u036F\u0483-\u0489\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u07FD\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u08D3-\u08E1\u08E3-\u0903\u093A-\u093C\u093E-\u094F\u0951-\u0957\u0962\u0963\u0981-\u0983\u09BC\u09BE-\u09C4\u09C7\u09C8\u09CB-\u09CD\u09D7\u09E2\u09E3\u09FE\u0A01-\u0A03\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81-\u0A83\u0ABC\u0ABE-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AE2\u0AE3\u0AFA-\u0AFF\u0B01-\u0B03\u0B3C\u0B3E-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B62\u0B63\u0B82\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD7\u0C00-\u0C04\u0C3E-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C81-\u0C83\u0CBC\u0CBE-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CE2\u0CE3\u0D00-\u0D03\u0D3B\u0D3C\u0D3E-\u0D44\u0D46-\u0D48\u0D4A-\u0D4D\u0D57\u0D62\u0D63\u0D82\u0D83\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DF2\u0DF3\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0EB1\u0EB4-\u0EB9\u0EBB\u0EBC\u0EC8-\u0ECD\u0F18\u0F19\u0F35\u0F37\u0F39\u0F3E\u0F3F\u0F71-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102B-\u103E\u1056-\u1059\u105E-\u1060\u1062-\u1064\u1067-\u106D\u1071-\u1074\u1082-\u108D\u108F\u109A-\u109D\u135D-\u135F\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4-\u17D3\u17DD\u180B-\u180D\u1885\u1886\u18A9\u1920-\u192B\u1930-\u193B\u1A17-\u1A1B\u1A55-\u1A5E\u1A60-\u1A7C\u1A7F\u1AB0-\u1ABE\u1B00-\u1B04\u1B34-\u1B44\u1B6B-\u1B73\u1B80-\u1B82\u1BA1-\u1BAD\u1BE6-\u1BF3\u1C24-\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE8\u1CED\u1CF2-\u1CF4\u1CF7-\u1CF9\u1DC0-\u1DF9\u1DFB-\u1DFF\u20D0-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302F\u3099\u309A\uA66F-\uA672\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA823-\uA827\uA880\uA881\uA8B4-\uA8C5\uA8E0-\uA8F1\uA8FF\uA926-\uA92D\uA947-\uA953\uA980-\uA983\uA9B3-\uA9C0\uA9E5\uAA29-\uAA36\uAA43\uAA4C\uAA4D\uAA7B-\uAA7D\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEB-\uAAEF\uAAF5\uAAF6\uABE3-\uABEA\uABEC\uABED\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F]/g, "").replace(NON_DECOMPOSABLE_RE, (ch) => NON_DECOMPOSABLE_MAP[ch]) : (str) => str;

//#endregion
//#region src/search/bitap/index.ts
var BitapSearch = class {
	constructor(pattern, { location = Config.location, threshold = Config.threshold, distance = Config.distance, includeMatches = Config.includeMatches, findAllMatches = Config.findAllMatches, minMatchCharLength = Config.minMatchCharLength, isCaseSensitive = Config.isCaseSensitive, ignoreDiacritics = Config.ignoreDiacritics, ignoreLocation = Config.ignoreLocation } = {}) {
		this.options = {
			location,
			threshold,
			distance,
			includeMatches,
			findAllMatches,
			minMatchCharLength,
			isCaseSensitive,
			ignoreDiacritics,
			ignoreLocation
		};
		pattern = isCaseSensitive ? pattern : pattern.toLowerCase();
		pattern = ignoreDiacritics ? stripDiacritics(pattern) : pattern;
		this.pattern = pattern;
		this.chunks = [];
		if (!this.pattern.length) return;
		const addChunk = (pattern, startIndex) => {
			this.chunks.push({
				pattern,
				alphabet: createPatternAlphabet(pattern),
				startIndex
			});
		};
		const len = this.pattern.length;
		if (len > 32) {
			let i = 0;
			const remainder = len % 32;
			const end = len - remainder;
			while (i < end) {
				addChunk(this.pattern.substr(i, 32), i);
				i += 32;
			}
			if (remainder) {
				const startIndex = len - 32;
				addChunk(this.pattern.substr(startIndex), startIndex);
			}
		} else addChunk(this.pattern, 0);
	}
	searchIn(text) {
		const { isCaseSensitive, ignoreDiacritics, includeMatches } = this.options;
		text = isCaseSensitive ? text : text.toLowerCase();
		text = ignoreDiacritics ? stripDiacritics(text) : text;
		if (this.pattern === text) {
			if (text.length < this.options.minMatchCharLength) return {
				isMatch: false,
				score: 1
			};
			const result = {
				isMatch: true,
				score: 0
			};
			if (includeMatches) result.indices = [[0, text.length - 1]];
			return result;
		}
		const { location, distance, threshold, findAllMatches, minMatchCharLength, ignoreLocation } = this.options;
		const allIndices = [];
		let totalScore = 0;
		let hasMatches = false;
		this.chunks.forEach(({ pattern, alphabet, startIndex }) => {
			const { isMatch, score, indices } = search(text, pattern, alphabet, {
				location: location + startIndex,
				distance,
				threshold,
				findAllMatches,
				minMatchCharLength,
				includeMatches,
				ignoreLocation
			});
			if (isMatch) hasMatches = true;
			totalScore += score;
			if (isMatch && indices) allIndices.push(...indices);
		});
		const result = {
			isMatch: hasMatches,
			score: hasMatches ? totalScore / this.chunks.length : 1
		};
		if (hasMatches && includeMatches) result.indices = mergeIndices(allIndices);
		return result;
	}
};

//#endregion
//#region src/core/register.ts
const registeredSearchers = [];
function register(...args) {
	registeredSearchers.push(...args);
}
function createSearcher(pattern, options) {
	for (let i = 0, len = registeredSearchers.length; i < len; i += 1) {
		const searcherClass = registeredSearchers[i];
		if (searcherClass.condition(pattern, options)) return new searcherClass(pattern, options);
	}
	return new BitapSearch(pattern, options);
}

//#endregion
//#region src/core/queryParser.ts
const LogicalOperator = {
	AND: "$and",
	OR: "$or"
};
const KeyType = {
	PATH: "$path",
	PATTERN: "$val"
};
const isExpression = (query) => !!(query[LogicalOperator.AND] || query[LogicalOperator.OR]);
const isPath = (query) => !!query[KeyType.PATH];
const isLeaf = (query) => !isArray(query) && isObject(query) && !isExpression(query);
const convertToExplicit = (query) => ({ [LogicalOperator.AND]: Object.keys(query).map((key) => ({ [key]: query[key] })) });
function parse(query, options, { auto = true } = {}) {
	const next = (query) => {
		if (isString(query)) {
			const obj = {
				keyId: null,
				pattern: query
			};
			if (auto) obj.searcher = createSearcher(query, options);
			return obj;
		}
		const keys = Object.keys(query);
		const isQueryPath = isPath(query);
		if (!isQueryPath && keys.length > 1 && !isExpression(query)) return next(convertToExplicit(query));
		if (isLeaf(query)) {
			const key = isQueryPath ? query[KeyType.PATH] : keys[0];
			const pattern = isQueryPath ? query[KeyType.PATTERN] : query[key];
			if (!isString(pattern)) throw new Error(LOGICAL_SEARCH_INVALID_QUERY_FOR_KEY(key));
			const obj = {
				keyId: createKeyId(key),
				pattern
			};
			if (auto) obj.searcher = createSearcher(pattern, options);
			return obj;
		}
		const node = {
			children: [],
			operator: keys[0]
		};
		keys.forEach((key) => {
			const value = query[key];
			if (isArray(value)) value.forEach((item) => {
				node.children.push(next(item));
			});
		});
		return node;
	};
	if (!isExpression(query)) query = convertToExplicit(query);
	return next(query);
}

//#endregion
//#region src/core/computeScore.ts
function computeScoreSingle(matches, { ignoreFieldNorm = Config.ignoreFieldNorm }) {
	let totalScore = 1;
	matches.forEach(({ key, norm, score }) => {
		const weight = key ? key.weight : null;
		totalScore *= Math.pow(score === 0 && weight ? Number.EPSILON : score, (weight || 1) * (ignoreFieldNorm ? 1 : norm));
	});
	return totalScore;
}
function computeScore(results, { ignoreFieldNorm = Config.ignoreFieldNorm }) {
	results.forEach((result) => {
		result.score = computeScoreSingle(result.matches, { ignoreFieldNorm });
	});
}

//#endregion
//#region src/tools/MaxHeap.ts
var MaxHeap = class {
	constructor(limit, comparator) {
		this.limit = limit;
		this.heap = [];
		this.comparator = comparator;
	}
	get size() {
		return this.heap.length;
	}
	insert(item) {
		if (this.size < this.limit) {
			this.heap.push(item);
			this._bubbleUp(this.size - 1);
		} else if (this.comparator(item, this.heap[0]) < 0) {
			this.heap[0] = item;
			this._sinkDown(0);
		}
	}
	extractSorted() {
		return this.heap.sort(this.comparator);
	}
	_bubbleUp(i) {
		const heap = this.heap;
		while (i > 0) {
			const parent = i - 1 >> 1;
			if (this.comparator(heap[i], heap[parent]) <= 0) break;
			const tmp = heap[i];
			heap[i] = heap[parent];
			heap[parent] = tmp;
			i = parent;
		}
	}
	_sinkDown(i) {
		const heap = this.heap;
		const len = heap.length;
		let largest = i;
		do {
			i = largest;
			const left = 2 * i + 1;
			const right = 2 * i + 2;
			if (left < len && this.comparator(heap[left], heap[largest]) > 0) largest = left;
			if (right < len && this.comparator(heap[right], heap[largest]) > 0) largest = right;
			if (largest !== i) {
				const tmp = heap[i];
				heap[i] = heap[largest];
				heap[largest] = tmp;
			}
		} while (largest !== i);
	}
};

//#endregion
//#region src/core/formatMatches.ts
function formatMatches(result) {
	const matches = [];
	result.matches.forEach((match) => {
		if (!isDefined(match.indices) || !match.indices.length) return;
		const obj = {
			indices: match.indices,
			value: match.value
		};
		if (match.key) obj.key = match.key.id;
		if (match.idx > -1) obj.refIndex = match.idx;
		matches.push(obj);
	});
	return matches;
}

//#endregion
//#region src/core/format.ts
function format(results, docs, { includeMatches = Config.includeMatches, includeScore = Config.includeScore } = {}) {
	return results.map((result) => {
		const { idx } = result;
		const data = {
			item: docs[idx],
			refIndex: idx
		};
		if (includeMatches) data.matches = formatMatches(result);
		if (includeScore) data.score = result.score;
		return data;
	});
}

//#endregion
//#region src/search/token/analyzer.ts
const DEFAULT_TOKEN = /[\p{L}\p{M}\p{N}_]+/gu;
const warned = /* @__PURE__ */ new WeakSet();
function warnNonGlobal(regex) {
	if (!warned.has(regex)) {
		warned.add(regex);
		console.warn(`[Fuse] tokenize regex ${regex} lacks the global flag; only the first match per text will be returned. Add the 'g' flag.`);
	}
}
function resolveTokenize(tokenize) {
	if (typeof tokenize === "function") {
		let validated = false;
		return (text) => {
			const result = tokenize(text);
			if (!validated) {
				validated = true;
				if (!Array.isArray(result) || result.some((t) => typeof t !== "string")) throw new Error(`[Fuse] tokenize function must return string[]; received ${Array.isArray(result) ? "array containing non-strings" : typeof result}.`);
			}
			return result;
		};
	}
	if (tokenize instanceof RegExp) {
		if (!tokenize.global) warnNonGlobal(tokenize);
		return (text) => text.match(tokenize) || [];
	}
	return (text) => text.match(DEFAULT_TOKEN) || [];
}
function createAnalyzer({ isCaseSensitive = false, ignoreDiacritics = false, tokenize } = {}) {
	const tokenizeFn = resolveTokenize(tokenize);
	return { tokenize(text) {
		if (!isCaseSensitive) text = text.toLowerCase();
		if (ignoreDiacritics) text = stripDiacritics(text);
		return tokenizeFn(text);
	} };
}

//#endregion
//#region src/search/token/InvertedIndex.ts
function addField(index, text, docIdx, analyzer) {
	const tokens = analyzer.tokenize(text);
	if (!tokens.length) return;
	index.fieldCount++;
	index.docFieldCount.set(docIdx, (index.docFieldCount.get(docIdx) || 0) + 1);
	const distinctTerms = new Set(tokens);
	let perDocTerms = index.docTermFieldHits.get(docIdx);
	if (!perDocTerms) {
		perDocTerms = /* @__PURE__ */ new Map();
		index.docTermFieldHits.set(docIdx, perDocTerms);
	}
	for (const term of distinctTerms) {
		perDocTerms.set(term, (perDocTerms.get(term) || 0) + 1);
		index.df.set(term, (index.df.get(term) || 0) + 1);
	}
}
function ingestRecord(index, record, keyCount, analyzer) {
	const { i: docIdx, v, $: fields } = record;
	if (v !== void 0) {
		addField(index, v, docIdx, analyzer);
		return;
	}
	if (!fields) return;
	for (let keyIdx = 0; keyIdx < keyCount; keyIdx++) {
		const value = fields[keyIdx];
		if (!value) continue;
		if (Array.isArray(value)) for (const sub of value) addField(index, sub.v, docIdx, analyzer);
		else addField(index, value.v, docIdx, analyzer);
	}
}
function buildInvertedIndex(records, keyCount, analyzer) {
	const index = {
		fieldCount: 0,
		df: /* @__PURE__ */ new Map(),
		docFieldCount: /* @__PURE__ */ new Map(),
		docTermFieldHits: /* @__PURE__ */ new Map()
	};
	for (const record of records) ingestRecord(index, record, keyCount, analyzer);
	return index;
}
function addToInvertedIndex(index, record, keyCount, analyzer) {
	ingestRecord(index, record, keyCount, analyzer);
}
function removeFromInvertedIndex(index, docIdx) {
	const fieldCount = index.docFieldCount.get(docIdx);
	if (fieldCount === void 0) return;
	index.fieldCount -= fieldCount;
	index.docFieldCount.delete(docIdx);
	const perDocTerms = index.docTermFieldHits.get(docIdx);
	if (!perDocTerms) return;
	for (const [term, hits] of perDocTerms) {
		const next = (index.df.get(term) || 0) - hits;
		if (next <= 0) index.df.delete(term);
		else index.df.set(term, next);
	}
	index.docTermFieldHits.delete(docIdx);
}
function removeAndShiftInvertedIndex(index, removedIndices) {
	if (removedIndices.length === 0) return;
	const sorted = Array.from(new Set(removedIndices)).sort((a, b) => a - b);
	for (const idx of sorted) removeFromInvertedIndex(index, idx);
	const shift = (oldIdx) => {
		let lo = 0;
		let hi = sorted.length;
		while (lo < hi) {
			const mid = lo + hi >>> 1;
			if (sorted[mid] < oldIdx) lo = mid + 1;
			else hi = mid;
		}
		return oldIdx - lo;
	};
	const firstRemoved = sorted[0];
	const shiftedDocFieldCount = /* @__PURE__ */ new Map();
	for (const [oldKey, count] of index.docFieldCount) shiftedDocFieldCount.set(oldKey > firstRemoved ? shift(oldKey) : oldKey, count);
	index.docFieldCount = shiftedDocFieldCount;
	const shiftedDocTermFieldHits = /* @__PURE__ */ new Map();
	for (const [oldKey, terms] of index.docTermFieldHits) shiftedDocTermFieldHits.set(oldKey > firstRemoved ? shift(oldKey) : oldKey, terms);
	index.docTermFieldHits = shiftedDocTermFieldHits;
}

//#endregion
//#region src/core/index.ts
var Fuse = class {
	constructor(docs, options, index) {
		this.options = {
			...Config,
			...options
		};
		if (this.options.useExtendedSearch && true) throw new Error(EXTENDED_SEARCH_UNAVAILABLE);
		if (this.options.useTokenSearch && true) throw new Error(TOKEN_SEARCH_UNAVAILABLE);
		this._keyStore = new KeyStore(this.options.keys);
		this._docs = docs;
		this._myIndex = null;
		this._invertedIndex = null;
		this.setCollection(docs, index);
		this._lastQuery = null;
		this._lastSearcher = null;
	}
	_getSearcher(query) {
		if (this._lastQuery === query) return this._lastSearcher;
		const searcher = createSearcher(query, this._invertedIndex ? {
			...this.options,
			_invertedIndex: this._invertedIndex
		} : this.options);
		this._lastQuery = query;
		this._lastSearcher = searcher;
		return searcher;
	}
	setCollection(docs, index) {
		this._docs = docs;
		if (index && !(index instanceof FuseIndex)) throw new Error(INCORRECT_INDEX_TYPE);
		this._myIndex = index || createIndex(this.options.keys, this._docs, {
			getFn: this.options.getFn,
			fieldNormWeight: this.options.fieldNormWeight
		});
		if (this.options.useTokenSearch) {
			const analyzer = createAnalyzer({
				isCaseSensitive: this.options.isCaseSensitive,
				ignoreDiacritics: this.options.ignoreDiacritics,
				tokenize: this.options.tokenize
			});
			this._invertedIndex = buildInvertedIndex(this._myIndex.records, this._myIndex.keys.length, analyzer);
		}
		this._invalidateSearcherCache();
	}
	add(doc) {
		if (!isDefined(doc)) return;
		this._docs.push(doc);
		const record = this._myIndex.add(doc, this._docs.length - 1);
		if (this._invertedIndex && record) {
			const analyzer = createAnalyzer({
				isCaseSensitive: this.options.isCaseSensitive,
				ignoreDiacritics: this.options.ignoreDiacritics,
				tokenize: this.options.tokenize
			});
			addToInvertedIndex(this._invertedIndex, record, this._myIndex.keys.length, analyzer);
		}
		this._invalidateSearcherCache();
	}
	remove(predicate = () => false) {
		const results = [];
		const indicesToRemove = [];
		for (let i = 0, len = this._docs.length; i < len; i += 1) if (predicate(this._docs[i], i)) {
			results.push(this._docs[i]);
			indicesToRemove.push(i);
		}
		if (indicesToRemove.length) {
			if (this._invertedIndex) removeAndShiftInvertedIndex(this._invertedIndex, indicesToRemove);
			const toRemove = new Set(indicesToRemove);
			this._docs = this._docs.filter((_, i) => !toRemove.has(i));
			this._myIndex.removeAll(indicesToRemove);
			this._invalidateSearcherCache();
		}
		return results;
	}
	removeAt(idx) {
		if (!Number.isInteger(idx) || idx < 0 || idx >= this._docs.length) throw new Error(INVALID_DOC_INDEX);
		if (this._invertedIndex) removeAndShiftInvertedIndex(this._invertedIndex, [idx]);
		const doc = this._docs.splice(idx, 1)[0];
		this._myIndex.removeAt(idx);
		this._invalidateSearcherCache();
		return doc;
	}
	_invalidateSearcherCache() {
		this._lastQuery = null;
		this._lastSearcher = null;
	}
	getIndex() {
		return this._myIndex;
	}
	_normalizedKeys() {
		return this._myIndex.keys.map((key) => this._keyStore.get(key.id) || key);
	}
	search(query, options) {
		const { limit = -1 } = options || {};
		const { includeMatches, includeScore, shouldSort, sortFn, ignoreFieldNorm } = this.options;
		if (isString(query) && !query.trim()) {
			let docs = this._docs.map((item, idx) => ({
				item,
				refIndex: idx
			}));
			if (isNumber(limit) && limit > -1) docs = docs.slice(0, limit);
			return docs;
		}
		const useHeap = shouldSort && isNumber(limit) && limit > 0 && isString(query);
		const comparator = sortFn;
		const stable = (a, b) => comparator(a, b) || a.idx - b.idx;
		let results;
		if (useHeap) {
			const heap = new MaxHeap(limit, stable);
			if (isString(this._docs[0])) this._searchStringList(query, {
				heap,
				ignoreFieldNorm
			});
			else this._searchObjectList(query, {
				heap,
				ignoreFieldNorm
			});
			results = heap.extractSorted();
		} else {
			results = isString(query) ? isString(this._docs[0]) ? this._searchStringList(query) : this._searchObjectList(query) : this._searchLogical(query);
			computeScore(results, { ignoreFieldNorm });
			if (shouldSort) results.sort(isString(query) ? stable : comparator);
			if (isNumber(limit) && limit > -1) results = results.slice(0, limit);
		}
		return format(results, this._docs, {
			includeMatches,
			includeScore
		});
	}
	_searchStringList(query, { heap, ignoreFieldNorm } = {}) {
		const searcher = this._getSearcher(query);
		const requireAllTokens = this.options.useTokenSearch && this.options.tokenMatch === "all";
		const { records } = this._myIndex;
		const results = heap ? null : [];
		records.forEach(({ v: text, i: idx, n: norm }) => {
			if (!isDefined(text)) return;
			const searchResult = searcher.searchIn(text);
			if (searchResult.isMatch) {
				const match = {
					score: searchResult.score,
					value: text,
					norm,
					indices: searchResult.indices
				};
				if (requireAllTokens) {
					match.matchedMask = searchResult.matchedMask;
					match.matchedTerms = searchResult.matchedTerms;
					match.termCount = searchResult.termCount;
				}
				const matches = [match];
				if (!requireAllTokens || this._coversAllTokens(matches)) {
					const result = {
						item: text,
						idx,
						matches
					};
					if (heap) {
						result.score = computeScoreSingle(result.matches, { ignoreFieldNorm });
						heap.insert(result);
					} else results.push(result);
				}
			}
		});
		return results;
	}
	_searchLogical(query) {
		throw new Error(LOGICAL_SEARCH_UNAVAILABLE);
	}
	_searchObjectList(query, { heap, ignoreFieldNorm } = {}) {
		const searcher = this._getSearcher(query);
		const requireAllTokens = this.options.useTokenSearch && this.options.tokenMatch === "all";
		const { records } = this._myIndex;
		const keys = this._normalizedKeys();
		const results = heap ? null : [];
		records.forEach(({ $: item, i: idx }) => {
			if (!isDefined(item)) return;
			const matches = [];
			let anyKeyFailed = false;
			let hasInverse = false;
			keys.forEach((key, keyIndex) => {
				const keyMatches = this._findMatches({
					key,
					value: item[keyIndex],
					searcher
				});
				if (keyMatches.length) {
					matches.push(...keyMatches);
					if (keyMatches[0].hasInverse) hasInverse = true;
				} else anyKeyFailed = true;
			});
			if (hasInverse && anyKeyFailed) return;
			if (matches.length && (!requireAllTokens || this._coversAllTokens(matches))) {
				const result = {
					idx,
					item,
					matches
				};
				if (heap) {
					result.score = computeScoreSingle(result.matches, { ignoreFieldNorm });
					heap.insert(result);
				} else results.push(result);
			}
		});
		return results;
	}
	_findMatches({ key, value, searcher }) {
		if (!isDefined(value)) return [];
		const matches = [];
		if (isArray(value)) value.forEach(({ v: text, i: idx, n: norm }) => {
			if (!isDefined(text)) return;
			const searchResult = searcher.searchIn(text);
			if (searchResult.isMatch) {
				const match = {
					score: searchResult.score,
					key,
					value: text,
					idx,
					norm,
					indices: searchResult.indices,
					hasInverse: searchResult.hasInverse
				};
				if (searchResult.termCount !== void 0) {
					match.matchedMask = searchResult.matchedMask;
					match.matchedTerms = searchResult.matchedTerms;
					match.termCount = searchResult.termCount;
				}
				matches.push(match);
			}
		});
		else {
			const { v: text, n: norm } = value;
			const searchResult = searcher.searchIn(text);
			if (searchResult.isMatch) {
				const match = {
					score: searchResult.score,
					key,
					value: text,
					norm,
					indices: searchResult.indices,
					hasInverse: searchResult.hasInverse
				};
				if (searchResult.termCount !== void 0) {
					match.matchedMask = searchResult.matchedMask;
					match.matchedTerms = searchResult.matchedTerms;
					match.termCount = searchResult.termCount;
				}
				matches.push(match);
			}
		}
		return matches;
	}
	_coversAllTokens(matches) {
		const termCount = matches.length ? matches[0].termCount : void 0;
		if (termCount === void 0) return true;
		if (termCount <= 31) {
			let coverage = 0;
			for (let i = 0; i < matches.length; i++) coverage |= matches[i].matchedMask || 0;
			return coverage === 2 ** termCount - 1;
		}
		const coverage = /* @__PURE__ */ new Set();
		for (let i = 0; i < matches.length; i++) {
			const terms = matches[i].matchedTerms;
			if (terms) for (const t of terms) coverage.add(t);
		}
		return coverage.size === termCount;
	}
};

//#endregion
//#region src/entry.ts
Fuse.version = "7.5.0";
Fuse.createIndex = createIndex;
Fuse.parseIndex = parseIndex;
Fuse.config = Config;
Fuse.match = function(pattern, text, options) {
	if (options && options.useTokenSearch) throw new Error(FUSE_MATCH_TOKEN_SEARCH_UNSUPPORTED);
	return createSearcher(pattern, {
		...Config,
		...options
	}).searchIn(text);
};
Fuse.parseQuery = parse;
Fuse.use = function(...plugins) {
	plugins.forEach((plugin) => register(plugin));
};
var entry_default = Fuse;

//#endregion
module.exports = entry_default;