---
title: Utility Snippets
layout: page
navigation: false
---
## Assorted Snippets

#### Timer

General code timer. Use it as a decorator or context manager, as such:

{% highlight python %}
@Timer("some name") # Use as decorator
def function():
    with Timer("other name"): # or as context manager
        pass
{% endhighlight %}

The code!

{% highlight python %}
import time
import functools
class Timer(object):
    active = True # Enable / Disable all timers
    def __init__(s, name):
        s.name = name # Name displayed with timer
    def __call__(s, func):
        @functools.wraps(func)
        def inner(*args, **kwargs):
            with s:
                return func(*args, **kwargs)
        return inner
    def __enter__(s): s.start = time.time()
    def __exit__(s, err, *_):
        if s.active and not err:
            print "%s...\t\tElapsed time: %sms." % (s.name, (time.time() - s.start) * 1000)
{% endhighlight %}


#### Tempfile

Yes you can use the tempfile module, and in most cases this is the right choice.
Sometimes you may not know when to delete the file and it may fall outside of any context management. Here is one solution.

It subclasses the path to the file itself. When that path goes out of scope (nobody is using the file anymore) it deletes the file.

An example usage:

{% highlight python %}
import tempfile
with tempfile.NamedTemporaryFile(delete=False) as f: path = Temp_Path(f.name)
{% endhighlight %}

Le Code:

{% highlight python %}
import os
import os.path
class Temp_Path(str):
    __slots__ = ()
    def __del__(s):
        if os.path.isfile(s): os.remove(s)
    def __getattribute__(s, k):
        if k[0] == "_": return str.__getattribute__(s, k)
        raise AttributeError, "\"%s\" cannot be modified with \"%s\"" % (s.__class__.__name__, k) # Prevent modification to string.
{% endhighlight %}
