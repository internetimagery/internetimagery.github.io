---
title: Iteration Snippets
layout: page
navigation: false
---
## Various Iteration Snippets

#### Chunks

Loop over an iterable in chunks. Perfect if you have a long flat list that needs to be grouped into pairs etc.

{% highlight python %}
import itertools
def chunk(iterable, size, default=None):
    """ iterate in chunks ie [1,2,3] [4,5,6] """
    i = iter(iterable)
    return itertools.izip_longest(*[i]*size, fillvalue=default)
{% endhighlight %}


#### Groups

Iterate over an iterable in shifting groups.

{% highlight python %}
import itertools
def group(iterable, size):
    """ iterate in groups ie [1,2,3] [2,3,4] """
    i = itertools.tee(iterable, size)
    for a, b in enumerate(i):
        for c in range(a):
            b.next()
    return itertools.izip(*i)
{% endhighlight %}
