# Scoring Theory

Once we have a list of matching items, they need to be ranked by a **relevance score**. This score is determined by three factors:

- Fuzziness score
- Key weight
- Field-length norm

### Fuzziness Score

The fuzziness score is internally calculated via a modified implementation of the [Bitap](https://en.wikipedia.org/wiki/Bitap_algorithm) algorithm.

#### Distance, Threshold, and Location

The calculation for something to be considered a match (whether fuzzy or exact) takes into account how far the pattern is from the expected location, within a threshold.

To illustrate, consider the following options:

- `location` defaults to `0`
- `distance` defaults to `100`
- `threshold` defaults to `0.6`

With the above options, for something to be considered a match, it would have to be within (threshold) `0.6` x (distance) `100` = `60` characters away from the expected location `0`.

For example, consider the string `"Fuse.js is a powerful, lightweight fuzzy-search library, with zero dependencies"`. Searching for the pattern `"zero"` would not match anything, even though it occurs in the string. The reason is that with the above defaults, for it to be considered a match it would have to be within `60` characters away from the expected location `0`. However, `"zero"` appears at index `62`.

::: tip
If you don't care where the pattern appears in the string is, and you still want to consider it a match, set `location` to a large number.
:::

### Key Weight

User inputted weight of the key. The higher the weight, the higher its relevance score. This is optional, athough Fuse.js will internally default it to `1` if one isn't provided. This boosting is applied at query time.

### Field-length Norm

The shorter the field, the higher its relevance. If a pattern matches a short field (such as a `title` field) it is likely to be more relevant than the same pattern matched with a bigger field. This is calculated at index time.
