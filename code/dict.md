---
title: Dict Snippets
layout: page
---
## Various Dict Snippets

#### Reversable Dict

Dict accessible by Key or Value. Treated as though it were a Key Key dict. Unique Keys and Values.

{% highlight python %}
import collections
class Reversable_Dict(collections.MutableMapping):
    __slots__ = ("_fwd", "_rev")
    def __init__(s, *args, **kwargs):
        s._fwd = fwd = dict(*args, **kwargs)
        s._rev = dict((v, k) for k, v in fwd.items())
    def __delitem__(s, k):
        fwd, rev = s._fwd, s._rev
        if k in fwd: return rev.pop(fwd.pop(k))
        if k in rev: return fwd.pop(rev.pop(k))
        raise KeyError, "%s not found." % k
    def __getitem__(s, k):
        fwd, rev = s._fwd, s._rev
        if k in fwd: return fwd[k]
        if k in rev: return rev[k]
        raise KeyError, "%s not found." % k
    def __iter__(s): return iter(s._fwd)
    def __repr__(s): return repr(s._fwd)
    def __len__(s): return len(s._fwd)
    def __setitem__(s, k, v):
        try: s.__delitem__(k)
        except KeyError: pass
        try: s.__delitem__(v)
        except KeyError: pass
        s._fwd[k] = v
        s._rev[v] = k
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

#### Zip Dict

Manage a zip file archive as a dict. Keys reflect relative path names to files and values the files themselves.
So add to the values using functions like pickle.dumps or json.dumps etc...

{% highlight python %}
import shutil
import os.path
import zipfile
import collections
try:
    import zlib
    compress = zipfile.ZIP_DEFLATED
except ImportError:
    compress = zipfile.ZIP_STORED

class Zip_Dict(collections.MutableMapping):
    """ Manage Zip files as a Dict """
    def __init__(s, path):
        s._depth = 0
        s._mode = "r"
        s._path = path
        s._dirty = False
        if os.path.isfile(path):
            with s: s._data = dict((a, file) for a in s.z.namelist())
        else:
            s._data = {}
            s._mode = "w"
            with s: pass
    def __enter__(s):
        if not s._depth:
            s.z = zipfile.ZipFile(s._path, s._mode, compress)
        s._depth += 1
        return s
    def __exit__(s, *err):
        s._depth -= 1
        s._mode = "r"
        if not s._depth:
            if s._dirty and not err[0]:
                s._dirty = False
                dirty = set(a for a, b in s._data.items() if b is not file)
                n = set(s.z.namelist())
                if dirty - n and not dirty & n:
                    s.z.close()
                    s._mode = "a"
                    with s:
                        for k in dirty:
                            s.z.writestr(k, s._data[k])
                else:
                    read = s.z
                    s._mode = "w"
                    path, s._path = s._path, "%s.incomplete" % s._path
                    try:
                        with s:
                            s.z.comment = read.comment
                            for k in s._data:
                                if k in dirty:
                                    s.z.writestr(k, s._data[k])
                                else:
                                    s.z.writestr(k, read.read(k))
                        read.close()
                        shutil.move(s._path, path)
                    finally:
                        s._path = path
                s._data = dict((a, file) for a in s.z.namelist())
            else:
                s.z.close()
    def __iter__(s): return iter(s._data)
    def __repr__(s): return repr(s._data)
    def __len__(s): return len(s._data)
    def __getitem__(s, k):
        with s: return s.z.read(k)
    def __setitem__(s, k, v):
        with s:
            s._data[k] = v
            s._dirty = True
    def __delitem__(s, k):
        with s:
            del s._data[k]
            s._dirty = True
{% endhighlight %}
