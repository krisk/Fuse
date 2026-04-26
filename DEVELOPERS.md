# Developing Fuse.js

- [Setup](#setup)
- [Scripts](#scripts)
- [Project Structure](#structure)
- [Commit Message Guidelines](#commits)

## <a name="setup"></a> Setup

```shell
npm install
```

## <a name="scripts"></a> Scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Build all dist targets (CJS, ESM, minified, types) |
| `npm test` | Run the test suite (vitest) |
| `npm run typecheck` | Type-check the source without emitting |
| `npm run lint` | Lint source and tests (eslint) |
| `npm run dev` | Watch mode for ESM dev build |
| `npm run dev:cjs` | Watch mode for CJS dev build |
| `npm run bench` | Build, then run the core search + index regression benchmarks |
| `npm run bench:search` | Search benchmark (object/string fuzzy, scaling, remove) |
| `npm run bench:index` | Index creation benchmark across dataset sizes |
| `npm run bench:extended` | Extended search + logical query benchmark |
| `npm run bench:tokens` | Token search vs Bitap A/B benchmark |
| `npm run bench:workers` | Single-thread vs parallel workers benchmark |

## <a name="structure"></a> Project Structure

Source is TypeScript. Types are emitted from source via `rollup-plugin-dts`.

```
src/
  core/         — Fuse class, config, scoring, query parser, formatting
  search/       — Bitap algorithm + extended search (operators, matchers)
  tools/        — FuseIndex, KeyStore, MaxHeap, field-length norm
  helpers/      — Utility functions (type guards, get, diacritics)
  types.ts      — Shared type definitions
  entry.ts      — Entry point with static methods and type exports
test/           — Tests and fixtures
bench/          — Benchmarks (search, index creation, extended, tokens, workers)
scripts/        — Rollup build configs
dist/           — Built output (CJS, ESM, .d.ts)
```

## <a name="commits"></a> Git Commit Guidelines

Fuse.js follows [conventional commits](https://www.conventionalcommits.org/en/v1.0.0-beta.2/). Commit messages are used to generate the [changelog](CHANGELOG.md).

### Format

```
<type>(<scope>): <subject>
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Formatting, missing semi-colons, etc.
- **refactor**: Code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding or correcting tests
- **chore**: Build process or auxiliary tools

### Scope

The scope specifies the area of the change, e.g. `search`, `index`, `options`. Use `*` for changes affecting multiple scopes.

### Subject

- Imperative, present tense: "change" not "changed"
- Don't capitalize the first letter
- No period at the end
