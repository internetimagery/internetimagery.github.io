---
title: Click Timing in Maya
layout: post
thumb: /img/posts/click_timing.jpg
---
Often when animating it's a good idea to tap out the 'beats' of a shot. Some even go so far as to record the tapping, bring it into Maya and move keys to correspond with the peaks on the soundbite.

Sure you COULD do that. You know... if you're not lazy.<!-- more -->

[But it has been said:](http://quoteinvestigator.com/2014/02/26/lazy-job/)

>Choose a Lazy Person To Do a Hard Job Because That Person Will Find an Easy Way To Do It

...and so this script was born!

####[You can DOWNLOAD this script here.](https://github.com/internetimagery/clicktime/releases)

<div class="js-video [vimeo, widescreen]"><iframe width="420" height="315" src="//www.youtube-nocookie.com/embed/eeTAOZToL1M?rel=0" frameborder="0" allowfullscreen></iframe></div>

----

Running the script is easy. Download the file above. Unzip and place the resulting files into your maya script folder.
Place this Python code into a shelf icon, or simply run it from the script window.

	import clicktime
	clicktime.GUI()

####DONE.

>One quick note: ClickTime will jump to the next upcoming pose so you can see which pose the next button press will time. If for some reason you do not want it to do this, or if your scene is running really really slowly you might have difficulty getting quick timings in. To turn this feature off, simply type False in the brackets. eg: *clickTime(False)*

----

####The GUI.

What you'll get is a window with a GIANT button. Not many scripts can boast a button this big!
I know you want to press the big button, but just one moment.

You may need to load some poses if the script hasn't already. To do this, select the objects you are going to retime and press the "load poses" button. You'll also want to load poses any time you make a change to the keyframes or if you've just timed things out and want to do it again.

Now you have poses loaded you can press the button. After this button press you're on the clock.
Press the button for each pose in time to your beats. Maybe play some music and click in time to the beat? :P

----

####How to set up Poses.

The script is very specific in what determines a pose.
**A pose is defined by having a normal (non-breakdown) key on every selected channel, all on the one frame.**

So make sure you have keyed every selected channel, on every selected object, on every pose.

If you have keys on all channels and *DON'T* want it to be considered a pose by the script (ie: breakdowns) you can do a number of things to have the script skip over them.
You can turn at least one key in the pose to Maya's "Breakdown" keys (green keys).
You can delete a key from the pose if it's not nessisary so the pose doesn't have a key on every selected curve.
Or you can simply select the keys on the poses you want to work with in the graph editor and omit selecting the rest.
