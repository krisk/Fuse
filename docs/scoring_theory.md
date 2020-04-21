# Scoring Theory

### How does scoring work?

Once we have a list of matching items, they need to be ranked by a **relevance score**. This score is determined by three factors:

- Fuzziness score
- Key weight
- Field-length norm

#### Fuzziness Score

The fuzziness score is internally calculated via a modified implementation of the [Bitap](https://en.wikipedia.org/wiki/Bitap_algorithm) algorithm.

#### Key Weight

User inputted weight of the key. The higher the weight, the higher its relevance score. This is optional, athough Fuse.js will internally default it to `1` if one isn't provided. This boosting is applied at query time.

#### Field-length Norm

The shorter the field, the higher its relevance. If a pattern matches a short field (such as a `title` field) it is likely to be more relevant than the same pattern matched with a bigger field. This is calculated at index time.
