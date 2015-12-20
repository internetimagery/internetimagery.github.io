---
title: Dict Snippets
layout: page
navigation: false
---
## Various Dict Snippets

#### Reversable Dict

Dict accessible by Key or Value. Treated as though it were a Key Key dict. Unique Keys and Values.

{% highlight python %}
import collections
class Reversable_Dict(collections.MutableMapping):
    __slots__ = ("fwd", "rev")
    def __init__(s, *args, **kwargs):
        s.fwd = dict(*args, **kwargs)
        s.rev = dict((v, k) for k, v in s.fwd.items())
    def __delitem__(s, k):
        if k in s.fwd: return s.rev.pop(s.fwd.pop(k))
        if k in s.rev: return s.fwd.pop(s.rev.pop(k))
        raise KeyError, "%s not found." % k
    def __getitem__(s, k):
        if k in s.fwd: return s.fwd[k]
        if k in s.rev: return s.rev[k]
        raise KeyError, "%s not found." % k
    def __iter__(s): return iter(s.fwd)
    def __repr__(s): return repr(s.fwd)
    def __len__(s): return len(s.fwd)
    def __setitem__(s, k, v):
        try: s.__delitem__(k)
        except KeyError: pass
        try: s.__delitem__(v)
        except KeyError: pass
        s.fwd[k] = v
        s.rev[v] = k
{% endhighlight %}


#### Tree Dict

Dict that inserts new Dicts when they're missing.

{% highlight python %}
class Tree_Dict(dict):
    __slots__ = ()
    def __missing__(s, k):
        v = s[k] = type(s)()
        return v
# Credit : http://stackoverflow.com/questions/635483/what-is-the-best-way-to-implement-nested-dictionaries-in-python/19829714#19829714
{% endhighlight %}


#### Tracker Dict

Dict that keeps track of changes made to it. Not super performant, but is simple to use.
Checking dict_instance.diff returns a tuple of (New, Changed, Removed) or if nothing has changed, None.

{% highlight python %}
try:
    import cPickle as pickle
except ImportError:
    import pickle

class Tracker_Dict(dict):
    """ Dict that tracks changes. Changes = (New, Changed, Removed) """
    def __init__(s, *args, **kwargs):
        dict.__init__(s, *args, **kwargs)
        s._diff = {}; s.diff
    def diff():
        def fget(s):
            diff1 = set(dict.keys(s)) # Current keys
            diff2 = set(s._diff.keys()) # Old keys
            diff3 = dict((a, pickle.dumps(b, -1)) for a, b in dict.items(s)) # Changes
            new = diff1 - diff2 # New keys
            rem = diff2 - diff1 # Removed keys
            chg = set(a for a, b in diff3.items() if a in s._diff and a not in new and a not in rem and b != s._diff[a])
            s._diff = diff3
            return (new, chg, rem) if new or chg or rem else None
        def fset(s, v):
            if v:
                s._diff = {}
            else:
                s.diff
        return locals()
    diff = property(**diff())
{% endhighlight %}
