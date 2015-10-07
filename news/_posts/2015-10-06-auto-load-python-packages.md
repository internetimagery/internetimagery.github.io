---
title: Python Package Autoload
layout: post
thumb: /img/posts/gist.png
---

Sorting through lots python imports is mildly annoying. Very mild.
So with that in mind, [here is a possible solution](https://gist.github.com/internetimagery/4be797eae970652385e6):

In your package folder, in the init file, you can stick this at the base, and it will attempt to dynamically load any modules you request.

So for instance, you could import "one" and then use "one.two.three.four()" provided the init files all contain this snippet.

{% highlight python %}
# Stick the following in the bottom of your __init__.py, then simply import the base package. Use submodules as you need them and they'll be imported as you go.
import sys as _sys
class Package(object):
    def __init__(s, local):
        import os.path
        s.cache = {}
        s.local = dict((k, local[k]) for k in local)
        s.root = os.path.realpath(os.path.dirname(s.local["__file__"]))
    def __getattr__(s, k):
        if k in s.local: return s.local[k]
        if k in s.cache: return s.cache[k]
        path = list(s.local["_sys"].path)
        s.local["_sys"].path = [s.root]
        try: s.cache[k] = __import__(k)
        finally: s.local["_sys"].path[:] = path
        return s.cache[k]
_sys.modules[__name__] = Package(locals())
{% endhighlight %}

As an added bonus, you could put one class in each file, with the same name as the file, and by replacing a couple of lines, you can have it pull out the class/variable instead of the entire module. Therefore everything can be split into a nice file structure.

{% highlight python %}
import sys as _sys
class Package(object):
    def __init__(s, local):
        import os.path
        s.cache = {}
        s.local = dict((k, local[k]) for k in local)
        s.root = os.path.realpath(os.path.dirname(s.local["__file__"]))
    def __getattr__(s, k):
        if k in s.local: return s.local[k]
        if k in s.cache: return s.cache[k]
        path = list(s.local["_sys"].path)
        s.local["_sys"].path = [s.root]
        try:
            module = __import__(k)
            name = k[0].capitalize() + k[1:]
            s.cache[k] = getattr(module, name) if hasattr(module, name) else module
        finally: s.local["_sys"].path[:] = path
        return s.cache[k]
_sys.modules[__name__] = Package(locals())
{% endhighlight %}
