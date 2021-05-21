import Fuse from "./core/index.js";
import Config from "./core/config.js";
import register from "./core/register.js";
import { parse } from "./core/queryParser.js";
import { parseIndex } from "./tools/FuseIndex.js";
import { createIndex } from "./tools/FuseIndex.js";
import { ExtendedSearch } from "./search/index.js";

Fuse.config = Config;
Fuse.version = "__VERSION__";
Fuse.parseIndex = parseIndex;
Fuse.createIndex = createIndex;

if (process.env.NODE_ENV === "development") Fuse.parseQuery = parse;

if (process.env.EXTENDED_SEARCH_ENABLED) register(ExtendedSearch);

export default Fuse;
