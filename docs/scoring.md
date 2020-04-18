# Scoring

Once we have a list of matching documents, they need to be ranked by score. The final score of a result is determined by three factors:

1. The initial score
2. The weight of the key
3. The fied-norm length

--

`weight(key)`

`norm(value(key))`

`boost(key,value) = weight(key)·norm(value(key))`

a\times b=\underbrace {b+\cdots +b} \_{a}

$\mathbb{R}^2$.

<code>
<span>Π<strong>final_score(doc)</strong> = </span><span>score(value(key))<sup>boost(key,value)</sup></span>
</code>

Every document in the list is searched. The values that are searched.

$$R = [r_1, r_2, r_3,..., r_n]$$
$$r_i = [m_1, m_2, m_3,..., m_k]$$

$$m_i = \{score, key, terms\}$$

$$norm(m_i) = \frac{1}{\sqrt{terms}}$$

$$weight(m_i) = \frac{1}{\sqrt{terms}}$$

$$boost(m_i) = weight(m_i)\times norm(m_i)$$

$$score(r_i) = {\prod_{i=1}^{k}}score(m_i)^{boost(m_i)}$$

### Initial score

`score(value(key, doc))`

### Key Weight

`weight(key)`

### Field-length Norm

The shorter the field, the higher the weight. If a term appears in a short field, such as a title field, it is more likely that the content of that field is about the term than if the same term appears in a much bigger field.

The field length norm is calculated as:

`norm(v) = 1 / √numTerms(v)`

$$norm(m_i) = \frac{1}{\sqrt{t}}$$
