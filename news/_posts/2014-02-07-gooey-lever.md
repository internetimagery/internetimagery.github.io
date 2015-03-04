---
title: Gooey Lever Simple Maya GUI
layout: post
thumb: /img/posts/gooey.jpg
---
Spent the evening learning how to make scrips for Maya. SO CONFUSING!

But not spent in vain. <!-- more -->

[Here I've made the script/plugin Gooey Lever.](http://internetimagery.com/downloads/Gooey_Lever.zip) A GUI lever that can be attached to channels in the channel box for visual control.

<div class="js-video [vimeo, widescreen]"><iframe width="420" height="315" src="//www.youtube-nocookie.com/embed/5eJU4u-Hkmc?rel=0" frameborder="0" allowfullscreen></iframe></div>

[Click here to download the script!](http://internetimagery.com/downloads/Gooey_Lever.zip)

To run, place in your scripts directory.
[Here is a nice tutorial for installing scripts into Maya](http://cgartistry.com/running-python-scripts-in-maya/)

Then create a shelf icon with this code (in the python section)

{% highlight python %}
import Gooey_Lever as GL
GL.createGUI()
{% endhighlight %}

Click it to bring up the window and follow the instructions.


Couple things to note that aren't in that video:

* You can select more than one channel in the channelbox. The lever will control as many as you like with a caveat, that you can only control channels in the upper section of the channel box.

* You can also select more than one object and control all their channels together, provided they share the same channel across all objects.

* With the circle at the base of the lever, you can not only move it around. But also scale it if you want it to be a different size.


----

Just added another video with a bit of a ramble attached. Rambltastic.

<div class="js-video [vimeo, widescreen]"><iframe width="420" height="315" src="//www.youtube-nocookie.com/embed/OG7Cd2lUSDM?rel=0" frameborder="0" allowfullscreen></iframe></div>