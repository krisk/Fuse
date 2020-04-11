# Scoring

Once we have a list of matching documents, they need to be ranked by score. The final score of a result is determined by three factors:

1. The initial score
2. The weight of the key
3. The fied-norm length

--

`weight(key)`

`norm(value(key))`

`boost(key,value) = weight(key)·norm(value(key))`

<code>
<span><strong>final_score(doc)</strong> = </span><span>score(value(key))<sup>boost(key,value)</sup></span>
</code>

### Initial score

`score(value(key, doc))`

### Key Weight

`weight(key)`

### Field-length Norm

The shorter the field, the higher the weight. If a term appears in a short field, such as a title field, it is more likely that the content of that field is about the term than if the same term appears in a much bigger field.

The field length norm is calculated as:

`norm(v) = 1 / √numTerms(v)`
