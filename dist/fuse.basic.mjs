/**
 * Fuse.js v7.6.0-beta.5 - Lightweight fuzzy-search (https://www.fusejs.io)
 *
 * Copyright (c) 2026 Kiro Risk
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
const INVALID_INDEX_RECORD = "Invalid index record: document indexes, field keys and array positions must be non-negative integers below 2^31";
const INVALID_DOC_INDEX = "Invalid doc index: must be a non-negative integer within the bounds of the docs array";
const LOGICAL_SEARCH_INVALID_QUERY_FOR_KEY = (key) => `Invalid value for key ${key}`;
const OBJECT_QUERY_UNAVAILABLE = "Object query syntax is not available in this build";
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
		if (!path[index]) if (isArray(obj)) {
			arr = true;
			for (let i = 0, len = obj.length; i < len; i += 1) deepGet(obj[i], path, index, i);
		} else list.push(arrayIndex !== void 0 ? {
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
	fieldNormWeight: 1,
	matchAlgorithm: "myers"
};
const Config = Object.freeze({
	...BasicOptions,
	...MatchOptions,
	...FuzzyOptions,
	...AdvancedOptions
});

//#endregion
//#region src/tools/fieldNorm.ts
function countWords(value) {
	let numTokens = 0;
	let inWord = false;
	for (let i = 0, len = value.length; i < len; i++) {
		const code = value.charCodeAt(i);
		if (code > 32 ? code !== 160 : code !== 32 && (code < 9 || code > 13)) {
			if (!inWord) {
				numTokens++;
				inWord = true;
			}
		} else inWord = false;
	}
	if (numTokens === 0) numTokens = 1;
	return numTokens;
}
function norm(weight = 1, mantissa = 3) {
	let cache = [];
	const m = Math.pow(10, mantissa);
	const fromCount = (numTokens) => {
		const cached = cache[numTokens];
		if (cached !== void 0) return cached;
		const n = Math.round(m / Math.pow(numTokens, .5 * weight)) / m;
		cache[numTokens] = n;
		return n;
	};
	return {
		get(value) {
			return fromCount(countWords(value));
		},
		fromCount,
		clear() {
			cache = [];
		}
	};
}

//#endregion
//#region src/tools/FuseIndex.ts
const STRING_RECORD = 0;
const OBJECT_RECORD = 1;
const SCALAR = -1;
const EMPTY_ARRAY = -2;
let warnedRecordsDeprecated = false;
var FuseIndex = class FuseIndex {
	constructor({ getFn = Config.getFn, fieldNormWeight = Config.fieldNormWeight } = {}) {
		this._recCount = 0;
		this._recDoc = /* @__PURE__ */ new Int32Array(16);
		this._recKind = /* @__PURE__ */ new Uint8Array(16);
		this._recStart = /* @__PURE__ */ new Uint32Array(16);
		this._recLen = /* @__PURE__ */ new Uint32Array(16);
		this._entCount = 0;
		this._entDead = 0;
		this._entKey = /* @__PURE__ */ new Uint32Array(64);
		this._entIdx = /* @__PURE__ */ new Int32Array(64);
		this._entNormId = /* @__PURE__ */ new Uint32Array(64);
		this._normValues = [];
		this._normIds = /* @__PURE__ */ new Map();
		this._normCache = (/* @__PURE__ */ new Int32Array(1024)).fill(-1);
		this._idByCount = [];
		this._idByCountNorm = null;
		this._entValue = [];
		this.norm = norm(fieldNormWeight, 3);
		this.getFn = getFn;
		this.isCreated = false;
		this.docs = [];
		this.keys = [];
		this._keysMap = {};
	}
	/**
	* @deprecated Will be removed in v8. Returns a detached snapshot of the
	* index in the record format: a fresh copy on each access, so changes to it
	* don't affect search. Use `toJSON()` to serialize an index.
	*/
	get records() {
		if (!warnedRecordsDeprecated) {
			warnedRecordsDeprecated = true;
			console.warn("[Fuse] FuseIndex.records is deprecated and will be removed in v8; use toJSON() to serialize an index.");
		}
		return this._materializeAll();
	}
	set records(records) {
		this.setIndexRecords(records);
	}
	setSources(docs = []) {
		this.docs = docs;
	}
	setIndexRecords(records = []) {
		this._reset(records.length, estimateEntries(records));
		for (let i = 0, len = records.length; i < len; i += 1) {
			const record = records[i];
			if (record.v !== void 0) {
				if (this._recCount === this._recDoc.length) this._growRecords();
				if (this._entCount === this._entKey.length) this._growEntries();
				const r = this._recCount;
				const e = this._entCount;
				this._recDoc[r] = checkPosition(record.i);
				this._recKind[r] = 0;
				this._recStart[r] = e;
				this._recLen[r] = 1;
				this._entKey[e] = 0;
				this._entIdx[e] = -1;
				this._entNormId[e] = this._normIdOf(record.n);
				this._entValue[e] = record.v;
				this._recCount = r + 1;
				this._entCount = e + 1;
			} else this._appendRecord(record);
		}
		this._trim();
	}
	clone() {
		const copy = new FuseIndex({ getFn: this.getFn });
		copy.norm = this.norm;
		copy.isCreated = this.isCreated;
		copy.setSources(this.docs);
		copy.setKeys(this.keys);
		copy._recCount = this._recCount;
		copy._recDoc = this._recDoc.slice(0, this._recCount);
		copy._recKind = this._recKind.slice(0, this._recCount);
		copy._recStart = this._recStart.slice(0, this._recCount);
		copy._recLen = this._recLen.slice(0, this._recCount);
		copy._entCount = this._entCount;
		copy._entDead = this._entDead;
		copy._entKey = this._entKey.slice(0, this._entCount);
		copy._entIdx = this._entIdx.slice(0, this._entCount);
		copy._entNormId = this._entNormId.slice(0, this._entCount);
		copy._normValues = this._normValues.slice();
		copy._normIds = new Map(this._normIds);
		copy._normCache = this._normCache.slice();
		copy._idByCount = this._idByCount.slice();
		copy._idByCountNorm = this._idByCountNorm;
		copy._entValue = this._entValue.slice(0, this._entCount);
		return copy;
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
		const isStringList = isString(this.docs[0]);
		this._reset(len, isStringList ? len : len * 4);
		if (isStringList) {
			const docs = this.docs;
			const recDoc = this._recDoc;
			const recKind = this._recKind;
			const recStart = this._recStart;
			const recLen = this._recLen;
			const entKey = this._entKey;
			const entIdx = this._entIdx;
			const entNormId = this._entNormId;
			const entValue = this._entValue;
			let n = 0;
			for (let i = 0; i < len; i++) {
				const doc = docs[i];
				if (!isDefined(doc) || isBlank(doc)) continue;
				recDoc[n] = i;
				recKind[n] = 0;
				recStart[n] = n;
				recLen[n] = 1;
				entKey[n] = 0;
				entIdx[n] = -1;
				entNormId[n] = this._textNormId(doc);
				entValue[n] = doc;
				n += 1;
			}
			this._recCount = n;
			this._entCount = n;
		} else for (let i = 0; i < len; i++) this._addObject(this.docs[i], i);
		this._trim();
		this.norm.clear();
	}
	add(doc, docIndex) {
		if (!Number.isInteger(docIndex) || docIndex < 0) throw new Error(INVALID_DOC_INDEX);
		return (isString(doc) ? this._addString(doc, docIndex) : (this._addObject(doc, docIndex), true)) ? this._materialize(this._recCount - 1) : null;
	}
	removeAt(idx) {
		if (!Number.isInteger(idx) || idx < 0) throw new Error(INVALID_DOC_INDEX);
		for (let r = 0; r < this._recCount; r += 1) if (this._recDoc[r] === idx) {
			this._removeRecordAt(r);
			break;
		}
		for (let r = 0; r < this._recCount; r += 1) if (this._recDoc[r] > idx) this._recDoc[r] -= 1;
	}
	removeAll(indices) {
		const toRemove = /* @__PURE__ */ new Set();
		for (const v of indices) if (Number.isInteger(v) && v >= 0) toRemove.add(v);
		if (toRemove.size === 0) return;
		const sorted = Array.from(toRemove).sort((a, b) => a - b);
		const recDoc = this._recDoc;
		const recKind = this._recKind;
		const recStart = this._recStart;
		const recLen = this._recLen;
		let w = 0;
		for (let r = 0, n = this._recCount; r < n; r += 1) {
			const docIdx = recDoc[r];
			if (toRemove.has(docIdx)) {
				this._entDead += recLen[r];
				continue;
			}
			let lo = 0;
			let hi = sorted.length;
			while (lo < hi) {
				const mid = lo + hi >>> 1;
				if (sorted[mid] < docIdx) lo = mid + 1;
				else hi = mid;
			}
			recDoc[w] = docIdx - lo;
			if (w !== r) {
				recKind[w] = recKind[r];
				recStart[w] = recStart[r];
				recLen[w] = recLen[r];
			}
			w += 1;
		}
		this._recCount = w;
		if (this._entDead > this._entCount - this._entDead) this._compact();
	}
	getValueForItemAtKeyId(item, keyId) {
		return item[this._keysMap[keyId]];
	}
	size() {
		return this._recCount;
	}
	_keyRange(r, keyIdx) {
		let start = this._recStart[r];
		const end = start + this._recLen[r];
		while (start < end && this._entKey[start] < keyIdx) start += 1;
		let stop = start;
		while (stop < end && this._entKey[stop] === keyIdx) stop += 1;
		return [start, stop];
	}
	_forEachText(r, fn) {
		const start = this._recStart[r];
		const end = start + this._recLen[r];
		for (let e = start; e < end; e += 1) if (this._entIdx[e] !== -2) fn(this._entValue[e]);
	}
	toJSON() {
		return {
			keys: this.keys.map(({ getFn, ...key }) => key),
			records: this._materializeAll()
		};
	}
	_materializeAll() {
		const records = new Array(this._recCount);
		for (let r = 0; r < this._recCount; r += 1) records[r] = this._materialize(r);
		return records;
	}
	_materialize(r) {
		const start = this._recStart[r];
		if (this._recKind[r] === 0) return {
			v: this._entValue[start],
			i: this._recDoc[r],
			n: this._normValues[this._entNormId[start]]
		};
		return {
			i: this._recDoc[r],
			$: this._materializeFields(r)
		};
	}
	_materializeFields(r) {
		const fields = {};
		const start = this._recStart[r];
		const end = start + this._recLen[r];
		for (let e = start; e < end; e += 1) {
			const key = this._entKey[e];
			const pos = this._entIdx[e];
			if (pos === -1) fields[key] = {
				v: this._entValue[e],
				n: this._normValues[this._entNormId[e]]
			};
			else {
				let list = fields[key];
				if (!list) {
					list = [];
					fields[key] = list;
				}
				if (pos !== -2) list.push({
					v: this._entValue[e],
					i: pos,
					n: this._normValues[this._entNormId[e]]
				});
			}
		}
		return fields;
	}
	_addString(doc, docIndex) {
		if (!isDefined(doc) || isBlank(doc)) return false;
		this._beginRecord(docIndex, 0);
		this._pushEntry(0, -1, this._textNormId(doc), doc);
		this._endRecord();
		return true;
	}
	_addObject(doc, docIndex) {
		this._beginRecord(docIndex, 1);
		for (let keyIndex = 0, keyLen = this.keys.length; keyIndex < keyLen; keyIndex++) {
			const key = this.keys[keyIndex];
			const value = key.getFn ? key.getFn(doc) : this.getFn(doc, key.path);
			if (!isDefined(value)) continue;
			if (isArray(value)) {
				const before = this._entCount;
				for (let i = 0, len = value.length; i < len; i += 1) {
					const item = value[i];
					if (!isDefined(item)) continue;
					if (isString(item)) {
						if (!isBlank(item)) this._pushEntry(keyIndex, i, this._textNormId(item), item);
					} else if (isDefined(item.v)) {
						const text = isString(item.v) ? item.v : toString(item.v);
						if (!isBlank(text)) this._pushEntry(keyIndex, item.i, this._textNormId(text), text);
					}
				}
				if (this._entCount === before) this._pushEntry(keyIndex, -2, this._normIdOf(0), "");
			} else if (isString(value) && !isBlank(value)) this._pushEntry(keyIndex, -1, this._textNormId(value), value);
		}
		this._endRecord();
	}
	_appendRecord(record) {
		if (record.v !== void 0) {
			this._beginRecord(checkPosition(record.i), 0);
			this._pushEntry(0, -1, this._normIdOf(record.n), record.v);
			this._endRecord();
			return;
		}
		this._beginRecord(checkPosition(record.i), 1);
		const fields = record.$ || {};
		for (const k in fields) {
			const key = checkPosition(+k);
			const value = fields[key];
			if (!isDefined(value)) continue;
			if (isArray(value)) {
				if (!value.length) this._pushEntry(key, -2, this._normIdOf(0), "");
				for (const sub of value) this._pushEntry(key, checkPosition(sub.i), this._normIdOf(sub.n), sub.v);
			} else this._pushEntry(key, -1, this._normIdOf(value.n), value.v);
		}
		this._endRecord();
	}
	_reset(expectedRecords, expectedEntries = expectedRecords * 2) {
		const recCap = Math.max(16, expectedRecords);
		this._recCount = 0;
		this._recDoc = new Int32Array(recCap);
		this._recKind = new Uint8Array(recCap);
		this._recStart = new Uint32Array(recCap);
		this._recLen = new Uint32Array(recCap);
		this._entCount = 0;
		this._entDead = 0;
		this._entKey = new Uint32Array(Math.max(64, expectedEntries));
		this._entIdx = new Int32Array(this._entKey.length);
		this._entNormId = new Uint32Array(this._entKey.length);
		this._normValues = [];
		this._idByCount = [];
		this._normIds = /* @__PURE__ */ new Map();
		this._normCache.fill(-1);
		this._entValue = [];
	}
	_beginRecord(docIndex, kind) {
		if (docIndex > 2147483647) throw new Error(INVALID_DOC_INDEX);
		if (this._recCount === this._recDoc.length) this._growRecords();
		const r = this._recCount;
		this._recDoc[r] = docIndex;
		this._recKind[r] = kind;
		this._recStart[r] = this._entCount;
		this._recLen[r] = 0;
	}
	_growRecords() {
		const cap = Math.max(16, this._recDoc.length * 2);
		this._recDoc = grow(this._recDoc, new Int32Array(cap));
		this._recKind = grow(this._recKind, new Uint8Array(cap));
		this._recStart = grow(this._recStart, new Uint32Array(cap));
		this._recLen = grow(this._recLen, new Uint32Array(cap));
	}
	_growEntries() {
		const cap = Math.max(64, this._entKey.length * 2);
		this._entKey = grow(this._entKey, new Uint32Array(cap));
		this._entIdx = grow(this._entIdx, new Int32Array(cap));
		this._entNormId = grow(this._entNormId, new Uint32Array(cap));
	}
	_endRecord() {
		const r = this._recCount;
		this._recLen[r] = this._entCount - this._recStart[r];
		this._recCount += 1;
	}
	_pushEntry(key, pos, normId, value) {
		if (this._entCount === this._entKey.length) this._growEntries();
		const e = this._entCount;
		this._entKey[e] = key;
		this._entIdx[e] = pos;
		this._entNormId[e] = normId;
		this._entValue[e] = value;
		this._entCount += 1;
	}
	_textNormId(text) {
		const { norm } = this;
		if (!norm.fromCount) return this._normIdOf(norm.get(text));
		if (norm !== this._idByCountNorm) {
			this._idByCount = [];
			this._idByCountNorm = norm;
		}
		const count = countWords(text);
		let id = this._idByCount[count];
		if (id === void 0) {
			id = this._normIdOf(norm.fromCount(count));
			this._idByCount[count] = id;
		}
		return id;
	}
	_normIdOf(norm) {
		const slot = norm * 1048576 & 1023;
		let normId = this._normCache[slot];
		const hit = normId >= 0 ? this._normValues[normId] : void 0;
		if (hit !== norm || norm === 0 && 1 / hit !== 1 / norm) {
			const key = Object.is(norm, -0) ? NEGATIVE_ZERO_KEY : norm;
			let id = this._normIds.get(key);
			if (id === void 0) {
				id = this._normValues.length;
				this._normValues.push(norm);
				this._normIds.set(key, id);
			}
			normId = id;
			this._normCache[slot] = normId;
		}
		return normId;
	}
	_removeRecordAt(r) {
		const n = this._recCount;
		this._entDead += this._recLen[r];
		this._recDoc.copyWithin(r, r + 1, n);
		this._recKind.copyWithin(r, r + 1, n);
		this._recStart.copyWithin(r, r + 1, n);
		this._recLen.copyWithin(r, r + 1, n);
		this._recCount = n - 1;
		if (this._entDead > this._entCount - this._entDead) this._compact();
	}
	_compact() {
		const live = this._entCount - this._entDead;
		const cap = Math.max(64, live);
		const key = new Uint32Array(cap);
		const idx = new Int32Array(cap);
		const normId = new Uint32Array(cap);
		const value = new Array(live);
		let p = 0;
		for (let r = 0; r < this._recCount; r += 1) {
			const start = this._recStart[r];
			const len = this._recLen[r];
			key.set(this._entKey.subarray(start, start + len), p);
			idx.set(this._entIdx.subarray(start, start + len), p);
			normId.set(this._entNormId.subarray(start, start + len), p);
			for (let k = 0; k < len; k += 1) value[p + k] = this._entValue[start + k];
			this._recStart[r] = p;
			p += len;
		}
		this._entKey = key;
		this._entIdx = idx;
		this._entNormId = normId;
		this._entValue = value;
		this._entCount = p;
		this._entDead = 0;
	}
	_trim() {
		const rc = Math.max(16, this._recCount);
		if (this._recDoc.length > rc * 1.25) {
			this._recDoc = this._recDoc.slice(0, rc);
			this._recKind = this._recKind.slice(0, rc);
			this._recStart = this._recStart.slice(0, rc);
			this._recLen = this._recLen.slice(0, rc);
		}
		const ec = Math.max(64, this._entCount);
		if (this._entKey.length > ec * 1.25) {
			this._entKey = this._entKey.slice(0, ec);
			this._entIdx = this._entIdx.slice(0, ec);
			this._entNormId = this._entNormId.slice(0, ec);
		}
	}
};
const NEGATIVE_ZERO_KEY = "-0";
function checkPosition(value) {
	const n = value;
	if ((n | 0) !== n || n < 0) throw new Error(INVALID_INDEX_RECORD);
	return n;
}
function estimateEntries(records) {
	if (!records.length) return 0;
	const first = records[0];
	let perRecord = 1;
	if (first.v === void 0 && first.$) {
		perRecord = 0;
		for (const k in first.$) {
			const value = first.$[+k];
			perRecord += isArray(value) ? Math.max(1, value.length) : 1;
		}
	}
	return Math.ceil(records.length * Math.max(1, perRecord) * 1.25);
}
function grow(from, to) {
	to.set(from);
	return to;
}
function createIndex$1(keys, docs, { getFn = Config.getFn, fieldNormWeight = Config.fieldNormWeight } = {}) {
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
//#region src/search/fuzzy/convertMaskToIndices.ts
function convertMaskToIndices(matchmask = [], minMatchCharLength = Config.minMatchCharLength, from = 0, to = matchmask.length) {
	const indices = [];
	if (to <= from) return indices;
	let start = -1;
	let end = -1;
	let i = from;
	for (; i < to; i += 1) {
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
//#region src/search/fuzzy/bitap.ts
const MAX_SHARED_ROW_LENGTH = 65536;
let bitArr = /* @__PURE__ */ new Int32Array(256);
let lastBitArr = /* @__PURE__ */ new Int32Array(256);
function getBitArrs(size) {
	if (size > MAX_SHARED_ROW_LENGTH) return [new Int32Array(size), new Int32Array(size)];
	if (bitArr.length < size) {
		let capacity = bitArr.length;
		while (capacity < size) capacity *= 2;
		bitArr = new Int32Array(capacity);
		lastBitArr = new Int32Array(capacity);
	}
	return [bitArr, lastBitArr];
}
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
	let [row, lastRow] = getBitArrs(textLen + patternLen + 2);
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
		row.fill(0, 0, finish + 2);
		row[finish + 1] = (1 << i) - 1;
		for (let j = finish; j >= start; j -= 1) {
			const currentLocation = j - 1;
			const charMatch = currentLocation < textLen ? patternAlphabet[text.charCodeAt(currentLocation)] : 0;
			let bits = (row[j + 1] << 1 | 1) & charMatch;
			if (i) bits |= (lastRow[j + 1] | lastRow[j]) << 1 | 1 | lastRow[j + 1];
			row[j] = bits;
			if (bits & mask) {
				const score = calcScore(i, currentLocation);
				if (score <= currentThreshold) {
					finalScore = score;
					currentThreshold = score;
					bestLocation = currentLocation;
					bestErrors = i;
					if (bestLocation <= expectedLocation) break;
					start = Math.max(1, 2 * expectedLocation - bestLocation);
				}
			}
		}
		if (calcScore(i + 1, expectedLocation) > currentThreshold) break;
		const swap = lastRow;
		lastRow = row;
		row = swap;
	}
	if (computeMatches && bestLocation >= 0) {
		const matchEnd = Math.min(textLen - 1, bestLocation + patternLen - 1 + bestErrors);
		for (let k = bestLocation; k <= matchEnd; k += 1) if (patternAlphabet[text.charCodeAt(k)]) matchMask[k] = 1;
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
//#region src/search/fuzzy/myers.ts
const MAX_SHARED_MASK_LENGTH = 65536;
let sharedMatchMask = /* @__PURE__ */ new Uint8Array(256);
function bitCount(v) {
	v = v - (v >>> 1 & 1431655765);
	v = (v & 858993459) + (v >>> 2 & 858993459);
	return Math.imul(v + (v >>> 4) & 252645135, 16843009) >>> 24;
}
function myersSearch(text, pattern, patternAlphabet, { location = Config.location, distance = Config.distance, threshold = Config.threshold, minMatchCharLength = Config.minMatchCharLength, includeMatches = Config.includeMatches, ignoreLocation = Config.ignoreLocation } = {}) {
	const patternLen = pattern.length;
	if (patternLen > 32) throw new Error(PATTERN_LENGTH_TOO_LARGE(32));
	const textLen = text.length;
	const expectedLocation = Math.max(0, Math.min(location, textLen));
	const lastLevel = patternLen - 1;
	let currentThreshold = threshold;
	let bestLocation = -1;
	let bestErrors = 0;
	const computeMatches = minMatchCharLength > 1 || includeMatches;
	let matchMask = sharedMatchMask;
	let maskLo = textLen;
	let maskHi = -1;
	if (computeMatches) {
		if (textLen > MAX_SHARED_MASK_LENGTH) matchMask = new Uint8Array(textLen);
		else if (matchMask.length < textLen) {
			let capacity = matchMask.length;
			while (capacity < textLen) capacity *= 2;
			matchMask = sharedMatchMask = new Uint8Array(capacity);
		}
	}
	const firstExact = text.indexOf(pattern, expectedLocation);
	if (firstExact > -1) {
		const proximity = Math.abs(firstExact - expectedLocation);
		let score;
		if (ignoreLocation) score = 0;
		else if (!distance) score = proximity ? 1 : 0;
		else score = 0 / patternLen + proximity / distance;
		if (score < currentThreshold) currentThreshold = score;
		if (computeMatches) {
			let index = firstExact;
			maskLo = index;
			do {
				matchMask.fill(1, index, index + patternLen);
				maskHi = index + patternLen - 1;
			} while ((index = text.indexOf(pattern, maskHi + 1)) > -1);
		}
	}
	let maxErrors = Math.floor(currentThreshold * patternLen);
	if (maxErrors > lastLevel) maxErrors = lastLevel;
	while (maxErrors < lastLevel && (maxErrors + 1) / patternLen <= currentThreshold) maxErrors += 1;
	while (maxErrors >= 0 && maxErrors / patternLen > currentThreshold) maxErrors -= 1;
	const initialMaxErrors = maxErrors;
	const bounded = !ignoreLocation && distance > 0 && distance < Infinity;
	if (maxErrors === 0) {
		if (firstExact > -1) {
			const proximity = Math.abs(firstExact - expectedLocation);
			const score = ignoreLocation ? 0 : !distance ? proximity ? 1 : 0 : proximity / distance;
			if (score <= currentThreshold) {
				bestLocation = firstExact;
				currentThreshold = score;
			}
		}
		if (expectedLocation > 0 && bestLocation !== expectedLocation) {
			const left = text.lastIndexOf(pattern, expectedLocation - 1);
			if (left > -1 && (bestLocation < 0 || left >= 2 * expectedLocation - bestLocation - 1)) {
				const proximity = expectedLocation - left;
				const score = ignoreLocation ? 0 : !distance ? 1 : proximity / distance;
				if (score <= currentThreshold) {
					bestLocation = left;
					currentThreshold = score;
				}
			}
		}
	} else if (maxErrors > 0) {
		let lowest = 0;
		let highest = textLen - 1;
		if (bounded) {
			const reach = Math.floor(currentThreshold * distance) + 1;
			if (expectedLocation - reach > 0) lowest = Math.ceil(expectedLocation - reach);
			if (expectedLocation + reach < highest) highest = Math.floor(expectedLocation + reach);
		} else if (!ignoreLocation && distance === 0 && currentThreshold < 1) {
			lowest = Math.ceil(expectedLocation);
			if (expectedLocation < highest) highest = Math.floor(expectedLocation);
		}
		let s = Math.min(textLen, highest + patternLen + maxErrors) - 1;
		let pv = -1;
		let mv = 0;
		for (; s > highest; s -= 1) {
			const eq = patternAlphabet[text.charCodeAt(s)] | 0;
			const xv = eq | mv;
			const xh = (eq & pv) + pv ^ pv | eq;
			const ph = (mv | ~(xh | pv)) << 1;
			pv = (pv & xh) << 1 | ~(xv | ph);
			mv = ph & xv;
		}
		const low = patternLen === 32 ? -1 : (1 << patternLen) - 1;
		let errors = bitCount(pv & low) - bitCount(mv & low);
		for (; s >= lowest; s -= 1) {
			const eq = patternAlphabet[text.charCodeAt(s)] | 0;
			const xv = eq | mv;
			const xh = (eq & pv) + pv ^ pv | eq;
			let ph = mv | ~(xh | pv);
			const mh = pv & xh;
			errors += (ph >>> lastLevel & 1) - (mh >>> lastLevel & 1);
			ph <<= 1;
			pv = mh << 1 | ~(xv | ph);
			mv = ph & xv;
			if (errors <= maxErrors) {
				let level = errors;
				let score;
				if (ignoreLocation) score = level / patternLen;
				else if (!distance) if (s === expectedLocation) score = level / patternLen;
				else {
					score = 1;
					level = initialMaxErrors;
				}
				else score = level / patternLen + Math.abs(expectedLocation - s) / distance;
				if (score <= currentThreshold && (score < currentThreshold || bestLocation < 0 || level > bestErrors || level === bestErrors && bestLocation > expectedLocation && s >= 2 * expectedLocation - bestLocation - 1)) {
					currentThreshold = score;
					bestLocation = s;
					bestErrors = level;
					maxErrors = Math.floor(score * patternLen);
					if (maxErrors > lastLevel) maxErrors = lastLevel;
					while (maxErrors < lastLevel && (maxErrors + 1) / patternLen <= score) maxErrors += 1;
					while (maxErrors > 0 && maxErrors / patternLen > score) maxErrors -= 1;
					if (bounded) {
						const reach = Math.floor(score * distance) + 1;
						if (expectedLocation - reach > lowest) lowest = Math.ceil(expectedLocation - reach);
					}
				}
			}
		}
	}
	if (computeMatches && bestLocation >= 0) {
		const matchEnd = Math.min(textLen - 1, bestLocation + patternLen - 1 + bestErrors);
		for (let k = bestLocation; k <= matchEnd; k += 1) if (patternAlphabet[text.charCodeAt(k)]) {
			matchMask[k] = 1;
			if (k < maskLo) maskLo = k;
			if (k > maskHi) maskHi = k;
		}
	}
	const result = {
		isMatch: bestLocation >= 0,
		score: bestLocation >= 0 ? Math.max(.001, currentThreshold) : 1
	};
	if (computeMatches) {
		const indices = convertMaskToIndices(matchMask, minMatchCharLength, maskLo, maskHi + 1);
		if (maskHi >= 0) matchMask.fill(0, maskLo, maskHi + 1);
		if (!indices.length) result.isMatch = false;
		else if (includeMatches) result.indices = indices;
	}
	return result;
}

//#endregion
//#region src/search/fuzzy/createPatternAlphabet.ts
const MAX_TABLE_CODE = 1024;
function createPatternAlphabet(pattern) {
	const len = pattern.length;
	let maxCode = 0;
	for (let i = 0; i < len; i += 1) {
		const code = pattern.charCodeAt(i);
		if (code > maxCode) maxCode = code;
	}
	const mask = maxCode < MAX_TABLE_CODE ? new Int32Array(maxCode < 256 ? 256 : maxCode + 1) : {};
	for (let i = 0; i < len; i += 1) {
		const code = pattern.charCodeAt(i);
		mask[code] = (mask[code] || 0) | 1 << len - i - 1;
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
const NON_ASCII_RE = /[^\x00-\x7F]/;
const stripDiacritics = typeof String.prototype.normalize === "function" ? (str) => !NON_ASCII_RE.test(str) ? str : str.normalize("NFD").replace(/[\u0300-\u036F\u0483-\u0489\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u07FD\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u08D3-\u08E1\u08E3-\u0903\u093A-\u093C\u093E-\u094F\u0951-\u0957\u0962\u0963\u0981-\u0983\u09BC\u09BE-\u09C4\u09C7\u09C8\u09CB-\u09CD\u09D7\u09E2\u09E3\u09FE\u0A01-\u0A03\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81-\u0A83\u0ABC\u0ABE-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AE2\u0AE3\u0AFA-\u0AFF\u0B01-\u0B03\u0B3C\u0B3E-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B62\u0B63\u0B82\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD7\u0C00-\u0C04\u0C3E-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C81-\u0C83\u0CBC\u0CBE-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CE2\u0CE3\u0D00-\u0D03\u0D3B\u0D3C\u0D3E-\u0D44\u0D46-\u0D48\u0D4A-\u0D4D\u0D57\u0D62\u0D63\u0D82\u0D83\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DF2\u0DF3\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0EB1\u0EB4-\u0EB9\u0EBB\u0EBC\u0EC8-\u0ECD\u0F18\u0F19\u0F35\u0F37\u0F39\u0F3E\u0F3F\u0F71-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102B-\u103E\u1056-\u1059\u105E-\u1060\u1062-\u1064\u1067-\u106D\u1071-\u1074\u1082-\u108D\u108F\u109A-\u109D\u135D-\u135F\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4-\u17D3\u17DD\u180B-\u180D\u1885\u1886\u18A9\u1920-\u192B\u1930-\u193B\u1A17-\u1A1B\u1A55-\u1A5E\u1A60-\u1A7C\u1A7F\u1AB0-\u1ABE\u1B00-\u1B04\u1B34-\u1B44\u1B6B-\u1B73\u1B80-\u1B82\u1BA1-\u1BAD\u1BE6-\u1BF3\u1C24-\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE8\u1CED\u1CF2-\u1CF4\u1CF7-\u1CF9\u1DC0-\u1DF9\u1DFB-\u1DFF\u20D0-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302F\u3099\u309A\uA66F-\uA672\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA823-\uA827\uA880\uA881\uA8B4-\uA8C5\uA8E0-\uA8F1\uA8FF\uA926-\uA92D\uA947-\uA953\uA980-\uA983\uA9B3-\uA9C0\uA9E5\uAA29-\uAA36\uAA43\uAA4C\uAA4D\uAA7B-\uAA7D\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEB-\uAAEF\uAAF5\uAAF6\uABE3-\uABEA\uABEC\uABED\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F]/g, "").replace(NON_DECOMPOSABLE_RE, (ch) => NON_DECOMPOSABLE_MAP[ch]).normalize("NFC") : (str) => str;

//#endregion
//#region src/search/fuzzy/index.ts
var FuzzySearch = class {
	constructor(pattern, { location = Config.location, threshold = Config.threshold, distance = Config.distance, includeMatches = Config.includeMatches, findAllMatches = Config.findAllMatches, minMatchCharLength = Config.minMatchCharLength, isCaseSensitive = Config.isCaseSensitive, ignoreDiacritics = Config.ignoreDiacritics, ignoreLocation = Config.ignoreLocation, matchAlgorithm = Config.matchAlgorithm } = {}) {
		this.options = {
			location,
			threshold,
			distance,
			includeMatches,
			findAllMatches,
			minMatchCharLength,
			isCaseSensitive,
			ignoreDiacritics,
			ignoreLocation,
			matchAlgorithm
		};
		this._scan = matchAlgorithm === "myers" && (ignoreLocation || !(distance < 0)) ? myersSearch : search;
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
			const { isMatch, score, indices } = this._scan(text, pattern, alphabet, {
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
let objectCompiler = null;
function getObjectCompiler() {
	return objectCompiler;
}
function createSearcher(pattern, options) {
	for (let i = 0, len = registeredSearchers.length; i < len; i += 1) {
		const searcherClass = registeredSearchers[i];
		if (searcherClass.condition(pattern, options)) return new searcherClass(pattern, options);
	}
	return new FuzzySearch(pattern, options);
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
			const value = isQueryPath ? query[KeyType.PATTERN] : query[key];
			if (isString(value)) {
				const obj = {
					keyId: createKeyId(key),
					pattern: value
				};
				if (auto) obj.searcher = createSearcher(value, options);
				return obj;
			}
			if (isObjectLike(value) && !isArray(value)) {
				const obj = {
					keyId: createKeyId(key),
					fieldQuery: value
				};
				if (auto) {
					const compile = getObjectCompiler();
					if (!compile) throw new Error(OBJECT_QUERY_UNAVAILABLE);
					obj.searcher = compile(value, isArray(key) ? key.join(".") : String(key), options);
				}
				return obj;
			}
			throw new Error(LOGICAL_SEARCH_INVALID_QUERY_FOR_KEY(key));
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
		const len = this.heap.length;
		if (len < this.limit) {
			this.heap.push(item);
			this._bubbleUp(len);
		} else if (this.comparator(item, this.heap[0]) < 0) {
			this.heap[0] = item;
			this._sinkDown(0);
		}
	}
	extractSorted() {
		return this.heap.sort(this.comparator);
	}
	_bubbleUp(i) {
		const { heap, comparator } = this;
		const item = heap[i];
		while (i > 0) {
			const parent = i - 1 >> 1;
			if (comparator(item, heap[parent]) <= 0) break;
			heap[i] = heap[parent];
			i = parent;
		}
		heap[i] = item;
	}
	_sinkDown(i) {
		const { heap, comparator } = this;
		const len = heap.length;
		const item = heap[i];
		for (;;) {
			const left = 2 * i + 1;
			if (left >= len) break;
			let next = comparator(heap[left], item) > 0 ? left : -1;
			if (left + 1 < len && comparator(heap[left + 1], next < 0 ? item : heap[left]) > 0) next = left + 1;
			if (next < 0) break;
			heap[i] = heap[next];
			i = next;
		}
		heap[i] = item;
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
const HITS_BITS = 4;
const HITS_ESCAPE = (1 << HITS_BITS) - 1;
const MAX_TERM_ID = 2 ** (32 - HITS_BITS) - 1;
function createIndex() {
	return {
		fieldCount: 0,
		termInfo: /* @__PURE__ */ new Map(),
		termsById: [],
		get df() {
			const snapshot = /* @__PURE__ */ new Map();
			for (const info of this.termsById) if (info.df > 0) snapshot.set(info.term, info.df);
			return snapshot;
		},
		pool: /* @__PURE__ */ new Uint32Array(1024),
		poolLen: 0,
		deadSlots: 0,
		docStart: [],
		docLen: [],
		docFields: []
	};
}
function internTerm(index, term) {
	let info = index.termInfo.get(term);
	if (info === void 0) {
		const id = index.termsById.length;
		if (id > MAX_TERM_ID) throw new Error("Token search vocabulary exceeds the supported size");
		info = {
			id,
			term,
			df: 0
		};
		index.termInfo.set(term, info);
		index.termsById.push(info);
	}
	return info;
}
function reservePool(index, slots) {
	const needed = index.poolLen + slots;
	if (needed <= index.pool.length) return;
	let capacity = index.pool.length;
	while (capacity < needed) capacity *= 2;
	const next = new Uint32Array(capacity);
	next.set(index.pool.subarray(0, index.poolLen));
	index.pool = next;
}
function ensureDoc(index, docIdx) {
	for (let d = index.docLen.length; d <= docIdx; d += 1) {
		index.docStart.push(0);
		index.docLen.push(0);
		index.docFields.push(0);
	}
}
function collectTexts(forEachText, analyzer) {
	const hits = /* @__PURE__ */ new Map();
	let fields = 0;
	forEachText((text) => {
		const tokens = analyzer.tokenize(text);
		if (!tokens.length) return;
		fields += 1;
		for (const term of new Set(tokens)) hits.set(term, (hits.get(term) || 0) + 1);
	});
	return {
		fields,
		hits
	};
}
function recordTexts(record, keyCount) {
	return (fn) => {
		const { v, $: values } = record;
		if (v !== void 0) fn(v);
		else if (values) for (let keyIdx = 0; keyIdx < keyCount; keyIdx += 1) {
			const value = values[keyIdx];
			if (!value) continue;
			if (Array.isArray(value)) for (const sub of value) fn(sub.v);
			else fn(value.v);
		}
	};
}
function ingestRecord(index, record, keyCount, analyzer) {
	ingest(index, record.i, recordTexts(record, keyCount), analyzer);
}
function ingest(index, docIdx, forEachText, analyzer) {
	const { fields, hits } = collectTexts(forEachText, analyzer);
	if (fields) record(index, docIdx, fields, hits);
}
function record(index, docIdx, fields, hits) {
	ensureDoc(index, docIdx);
	index.fieldCount += fields;
	reservePool(index, hits.size * 2);
	const start = index.poolLen;
	const pool = index.pool;
	let p = start;
	for (const [term, count] of hits) {
		const info = internTerm(index, term);
		info.df += count;
		const id = info.id;
		if (count < HITS_ESCAPE) pool[p++] = id << HITS_BITS | count;
		else {
			pool[p++] = id << HITS_BITS | HITS_ESCAPE;
			pool[p++] = count;
		}
	}
	index.poolLen = p;
	index.docStart[docIdx] = start;
	index.docLen[docIdx] = p - start;
	index.docFields[docIdx] = fields;
}
function forEachEntry(index, docIdx, fn) {
	const { pool } = index;
	const end = index.docStart[docIdx] + index.docLen[docIdx];
	let p = index.docStart[docIdx];
	while (p < end) {
		const entry = pool[p++];
		const id = entry >>> HITS_BITS;
		let count = entry & HITS_ESCAPE;
		if (count === HITS_ESCAPE) count = pool[p++];
		fn(id, count);
	}
}
function subtractDoc(index, docIdx) {
	if (docIdx >= index.docLen.length || !index.docFields[docIdx]) return;
	index.fieldCount -= index.docFields[docIdx];
	forEachEntry(index, docIdx, (id, count) => {
		const info = index.termsById[id];
		info.df = Math.max(0, info.df - count);
	});
	index.deadSlots += index.docLen[docIdx];
}
function compactPool(index) {
	const remap = new Int32Array(index.termsById.length).fill(-1);
	const liveTerms = [];
	for (const info of index.termsById) if (info.df > 0) {
		remap[info.id] = liveTerms.length;
		info.id = liveTerms.length;
		liveTerms.push(info);
	} else index.termInfo.delete(info.term);
	index.termsById = liveTerms;
	const live = index.poolLen - index.deadSlots;
	const next = new Uint32Array(Math.max(1024, live * 2));
	const { pool } = index;
	let p = 0;
	for (let d = 0; d < index.docLen.length; d += 1) {
		const len = index.docLen[d];
		if (!len) continue;
		const end = index.docStart[d] + len;
		let q = index.docStart[d];
		index.docStart[d] = p;
		while (q < end) {
			const entry = pool[q++];
			const hits = entry & HITS_ESCAPE;
			next[p++] = remap[entry >>> HITS_BITS] << HITS_BITS | hits;
			if (hits === HITS_ESCAPE) next[p++] = pool[q++];
		}
	}
	index.pool = next;
	index.poolLen = p;
	index.deadSlots = 0;
}
function buildInvertedIndexFromColumns(source, keyCount, analyzer) {
	const index = createIndex();
	const hits = /* @__PURE__ */ new Map();
	for (let r = 0, n = source.size(); r < n; r += 1) {
		hits.clear();
		let fields = 0;
		const start = source._recStart[r];
		const end = start + source._recLen[r];
		const isString = source._recKind[r] === 0;
		for (let e = start; e < end; e += 1) {
			if (source._entIdx[e] === -2) continue;
			if (!isString && source._entKey[e] >= keyCount) continue;
			const tokens = analyzer.tokenize(source._entValue[e]);
			if (!tokens.length) continue;
			fields += 1;
			for (const term of new Set(tokens)) hits.set(term, (hits.get(term) || 0) + 1);
		}
		if (fields) record(index, source._recDoc[r], fields, hits);
	}
	if (index.pool.length > index.poolLen + 1024) index.pool = index.pool.slice(0, index.poolLen + 1024);
	return index;
}
function addToInvertedIndex(index, record, keyCount, analyzer) {
	ingestRecord(index, record, keyCount, analyzer);
}
function removeAndShiftInvertedIndex(index, removedIndices) {
	if (removedIndices.length === 0) return;
	const removed = new Set(removedIndices);
	for (const idx of removed) subtractDoc(index, idx);
	let w = 0;
	for (let r = 0; r < index.docLen.length; r += 1) {
		if (removed.has(r)) continue;
		index.docStart[w] = index.docStart[r];
		index.docLen[w] = index.docLen[r];
		index.docFields[w] = index.docFields[r];
		w += 1;
	}
	index.docStart.length = w;
	index.docLen.length = w;
	index.docFields.length = w;
	if (index.deadSlots > index.poolLen - index.deadSlots) compactPool(index);
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
		this._ownsIndex = true;
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
		this._ownsIndex = !index;
		this._myIndex = index || createIndex$1(this.options.keys, this._docs, {
			getFn: this.options.getFn,
			fieldNormWeight: this.options.fieldNormWeight
		});
		if (this.options.useTokenSearch) {
			const analyzer = createAnalyzer({
				isCaseSensitive: this.options.isCaseSensitive,
				ignoreDiacritics: this.options.ignoreDiacritics,
				tokenize: this.options.tokenize
			});
			this._invertedIndex = buildInvertedIndexFromColumns(this._myIndex, this._myIndex.keys.length, analyzer);
		}
		this._invalidateSearcherCache();
	}
	add(doc) {
		if (!isDefined(doc)) return;
		this._ensureOwnIndex();
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
			this._ensureOwnIndex();
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
		this._ensureOwnIndex();
		const doc = this._docs.splice(idx, 1)[0];
		this._myIndex.removeAt(idx);
		this._invalidateSearcherCache();
		return doc;
	}
	_ensureOwnIndex() {
		if (!this._ownsIndex) {
			this._myIndex = this._myIndex.clone();
			this._ownsIndex = true;
		}
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
		const useHeap = shouldSort && Number.isInteger(limit) && limit > 0 && isString(query);
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
		const index = this._myIndex;
		const recCount = index.size();
		const recKind = index._recKind;
		const recDoc = index._recDoc;
		const recStart = index._recStart;
		const entValue = index._entValue;
		const normValues = index._normValues;
		const entNormId = index._entNormId;
		const results = heap ? null : [];
		for (let r = 0; r < recCount; r += 1) {
			if (recKind[r] !== 0) continue;
			const e = recStart[r];
			const text = entValue[e];
			const idx = recDoc[r];
			const searchResult = searcher.searchIn(text);
			if (searchResult.isMatch) {
				const match = {
					score: searchResult.score,
					value: text,
					norm: normValues[entNormId[e]],
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
		}
		return results;
	}
	_searchLogical(query) {
		throw new Error(LOGICAL_SEARCH_UNAVAILABLE);
	}
	_searchObjectList(query, { heap, ignoreFieldNorm } = {}) {
		const searcher = this._getSearcher(query);
		const requireAllTokens = this.options.useTokenSearch && this.options.tokenMatch === "all";
		const index = this._myIndex;
		const recCount = index.size();
		const recKind = index._recKind;
		const recDoc = index._recDoc;
		const recStart = index._recStart;
		const recLen = index._recLen;
		const entKey = index._entKey;
		const keys = this._normalizedKeys();
		const keyCount = keys.length;
		const needItem = this.options.sortFn !== Config.sortFn;
		const results = heap ? null : [];
		for (let r = 0; r < recCount; r += 1) {
			if (recKind[r] !== 1) continue;
			const matches = [];
			let anyKeyFailed = false;
			let hasInverse = false;
			let cursor = recStart[r];
			const end = cursor + recLen[r];
			for (let keyIndex = 0; keyIndex < keyCount; keyIndex += 1) {
				while (cursor < end && entKey[cursor] < keyIndex) cursor += 1;
				let stop = cursor;
				while (stop < end && entKey[stop] === keyIndex) stop += 1;
				const keyMatches = this._findMatches(keys[keyIndex], cursor, stop, searcher);
				cursor = stop;
				if (keyMatches.length) {
					matches.push(...keyMatches);
					if (keyMatches[0].hasInverse) hasInverse = true;
				} else anyKeyFailed = true;
			}
			if (hasInverse && anyKeyFailed) continue;
			if (matches.length && (!requireAllTokens || this._coversAllTokens(matches))) {
				const result = {
					idx: recDoc[r],
					item: needItem ? index._materializeFields(r) : void 0,
					matches
				};
				if (heap) {
					result.score = computeScoreSingle(result.matches, { ignoreFieldNorm });
					heap.insert(result);
				} else results.push(result);
			}
		}
		return results;
	}
	_findMatches(key, start, end, searcher) {
		if (start === end) return [];
		const index = this._myIndex;
		const entIdx = index._entIdx;
		const pos = entIdx[start];
		if (pos === -2) return [];
		const entValue = index._entValue;
		const normValues = index._normValues;
		const entNormId = index._entNormId;
		const matches = [];
		if (pos !== -1) {
			let anyElementFailed = false;
			let hasInverse = false;
			for (let e = start; e < end; e += 1) {
				const text = entValue[e];
				const searchResult = searcher.searchIn(text);
				if (searchResult.isMatch) {
					const match = {
						score: searchResult.score,
						key,
						value: text,
						idx: entIdx[e],
						norm: normValues[entNormId[e]],
						indices: searchResult.indices,
						hasInverse: searchResult.hasInverse
					};
					if (searchResult.termCount !== void 0) {
						match.matchedMask = searchResult.matchedMask;
						match.matchedTerms = searchResult.matchedTerms;
						match.termCount = searchResult.termCount;
					}
					matches.push(match);
					hasInverse || (hasInverse = !!searchResult.hasInverse);
				} else anyElementFailed = true;
			}
			if (hasInverse && anyElementFailed) return [];
		} else {
			const text = entValue[start];
			const searchResult = searcher.searchIn(text);
			if (searchResult.isMatch) {
				const match = {
					score: searchResult.score,
					key,
					value: text,
					norm: normValues[entNormId[start]],
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
Fuse.version = "7.6.0-beta.5";
Fuse.createIndex = createIndex$1;
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
export { entry_default as default };