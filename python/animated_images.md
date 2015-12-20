---
title: Animated Images
layout: page
navigation: false
---
## Animated Images in Maya

As far as I can tell, Maya does not support animated gifs / animated images in the GUI. This Snippet addresses that by firing up a thread to change the image incrementally over time.


{% highlight python %}
# Stick this Class in a GUI, and provide it a list of sequential images.

import time
import threading
import maya.cmds as cmds
import maya.utils as utils

class Animation(object):
    def __init__(s, frames):
        s.frames = frames
        s.img = cmds.iconTextStaticLabel(style="iconOnly")
        s.frame = 0
        s.playing = False
        s.limit = threading.Semaphore(1)
    def tick(s):
        try:
            s.frame = s.frame - 1 if s.frame else len(s.frames)
            cmds.iconTextStaticLabel(s.img, e=True, i=s.frames[s.frame])
        except:
            s.playing = False
        finally:
            s.limit.release()
    def play(s):
        if not s.playing:
            def go():
                while s.playing:
                    s.limit.acquire()
                    utils.executeDeferred(s.tick)
                    time.sleep(1)
            s.playing = True
            threading.Thread(target=go).start()
    def stop(s):
        s.playing = False
{% endhighlight %}
