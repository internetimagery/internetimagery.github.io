---
title: Iteration Snippets
layout: page
---
## Various Iteration Snippets

#### Chunks

Loop over an iterable in chunks. Perfect if you have a long flat list that needs to be grouped into pairs etc.
[1,2,3] [4,5,6] [7,8,9]

{% highlight python %}
import itertools
def chunk(iterable, size, default=None):
    """ iterate in chunks ie [1,2,3] [4,5,6] """
    i = iter(iterable)
    return itertools.izip_longest(*[i]*size, fillvalue=default)
{% endhighlight %}


#### Shift

Iterate over an iterable in shifting groups.
[1,2,3] [2,3,4] [3,4,5]

{% highlight python %}
import itertools
def shift(iterable, size):
    """ iterate in groups ie [1,2,3] [2,3,4] """
    i = itertools.tee(iterable, size)
    for a, b in enumerate(i):
        try:
            for c in range(a):
                b.next()
        except StopIteration:
            pass
    return itertools.izip(*i)
{% endhighlight %}
