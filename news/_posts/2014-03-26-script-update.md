---
title: Script Updates
layout: post
thumb: /img/posts/helmet.jpg
---

With the lower workload this week I've taken the time to update my scripts (downloadable in previous news items) and put them into Google Code.

[You can view the latest codes here...](https://code.google.com/p/maya-anim-tools/source/browse/#svn%2Ftrunk)

Having used the scripts through a full shot there were a few little oddities I noticed and improvements I thought could be made. So if you've downloaded one of the scripts prior to this date(above) they've been updated with the following:

----

####[Gooey Lever](/news/2014/02/07/gooey-lever.html)

Updated the code to run the script to more accuractly stick to conventions

{% highlight python %}
import Gooey_Lever
Gooey_Lever.GUI()
{% endhighlight %}

----

####[Spaces](/news/2014/02/18/spaces-maya.html)

Spaces now utilises the script "smartselection.py". This is actually code I pulled from what was already developed in spaces. Having it in its own separate file means that other scripts can share the same selection methods for convenience and consistency.

Because it is essentially taking code out of one file and placing it in another, there is no change to functionality. So this update is more about maintenance than it is about features.

Updated the code to run the GUI to stick closer to convention:

{% highlight python %}
import spacesGUI
spacesGUI.GUI()
{% endhighlight %}

----

####[Constraint Key](/news/2014/03/02/constraint-key.html)

Constraint key script now has a GUI option (thanks Andre for the request!). To activate it type this code into the script editor.

{% highlight python %}
import constraintkey
constraintkey.GUI()
{% endhighlight %}

The other commands have been redacted and changed to more accuratly reflect coding conventions, ie:

{% highlight python %}
import constraintkey
constraintkey.parent()
{% endhighlight %}

Would parent. Orient, aim etc etc all are the same.

Rotations should now fully respect the object being keyed. There shouldn't be any weird gimbal locking.

Fixed a bug where the aim constraint wouldn't work if the object being aimed had its position animated.

Ensured that any keys that may be lying between frames are removed as new keys are added.


----

####[Click Time](/news/2014/03/14/click-timing.html)

Clicktime will now show the next key ready to be timed. So when you're clicking through each pose to time, you'll visually see the pose that the next click will time out. Just a nice way of visually seeing what is coming up next.

Because scenes can become slow with lots and lots of junk, and changing the current timeslider position can lag a bit, there is an option to turn this off. If you're trying to time out something really quickly and the scene can't update in time before your next click you might want it off.

To run the script with it off, insert "False" into the brackets when executing the script (or in the shelf code). ie:

{% highlight python %}
import clicktime
clicktime.GUI(False)
{% endhighlight %}

----