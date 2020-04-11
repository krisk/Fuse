# Scoring

Once we have a list of matching documents, they need to be ranked by score. The final score of a result is determine by three factors:

1. The bitap score
2. The weight of the key
3. The fied-norm length

### The Bitap score

TODO

### The weight of the key

TODO

### Field-length norm

How long is the field? The shorter the field, the higher the weight. If a term appears in a short field, such as a title field, it is more likely that the content of that field is about the term than if the same term appears in a much bigger body field. The field length norm is calculated as follows:

<code>
// Calculated as the inverse square root of the number of terms in the field.
norm(d) = 1 / √numTerms
</code>
