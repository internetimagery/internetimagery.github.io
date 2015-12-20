---
title: Auto Load Modules
layout: page
---
## On Demand Auto Load Modules / Submodules

Sometimes it's convenient if you have a LOT of submodules (probably a design problem :P) to load them on demand. Treating them like folders.

Put this snippet into your __init__.py file, in the module and let it do its magic.


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
#        s.local["_sys"].path.insert(0, s.root)
        s.local["_sys"].path = [s.root]
        try: s.cache[k] = __import__(k)
        finally: s.local["_sys"].path[:] = path
        return s.cache[k]
_sys.modules[__name__] = Package(locals())
{% endhighlight %}
