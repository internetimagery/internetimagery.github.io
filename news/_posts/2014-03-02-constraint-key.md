---
title: Constraint Key script
layout: post
thumb: /img/posts/constraint_key.jpg
---
I've seen scripts like this around before, but never been able to aquire one. They seem so useful too, so I've had to reproduce my own rendition of the script.<!-- more -->

####What does it do?...

----

In a nutshell (or at least inside maya) the script keys objects over a predetermined ammout of time, as though they were constrained.

Using keys instead of constraints has its pros and cons:

Cons being that any changes to the driving object will not be reflected on the following object (because it is only keyed in place). ie: if you key-constrained a cup to a hand (or even a stool!) and then you moved the hand to a different time or position, the cup would still follow where the hand *was* in space. You would have to run the script again to reset it into place.
Another con is that the script only works on constraint weights of 1. What this means, is if you wanted the object to be constrained keyed *between* two objects (not one after the other, but literally floating between) it will not work. The script works in a strictly on/off fashion.

Pros however are numerous. Firstly it's easier to conceptualise dealing with keys. You can visually see exactly where the object will be as you're using the exact same key system as you use to animate. Following from that, it also makes it easier to modify the objects location along the constraint, as you simply have to move keys.
Another pro is that by using keys you eliminate snapping when constraining between more than one object. Simply due to the fact that as the constraint stops affecting the object, it is already keyed at its new location.
Due to using keys we can also summarise that easing into and out of the constraint is MUCH easier. Simply play with your tangents.
You can transfer animation by key constraining a locator to your object, then key constraining the second object to the locator. This can be useful if you want to transfer animation from FK to IK, you can have a locator follow the wrist. Then in IK have the wrist follow the locator.

<div class="js-video [vimeo, widescreen]"><iframe width="420" height="315" src="//www.youtube-nocookie.com/embed/tk1HHp_2cNA?rel=0" frameborder="0" allowfullscreen></iframe>)</div>

----

###I LOVE IT! WHERE CAN I GET IT?

####[YOU CAN DOWNLOAD THE SCRIPT HERE.](https://github.com/internetimagery/constraintkey/releases)

To use the script first ensure you have a command (below) to run for the constraint you wish to use. Then select EITHER one object (exception: aim constraint doesn't work with one), or select multiple objects to constrain. When selecting multiple objects, the **LAST** object (it glows green instead of white) is what all others in the selection will follow. Just remember this:

>Glue to Green

Now with objects selected you just need to select the range of keys you wish to constrain over. To do so, shift and mouse drag in the timeslider to highlight an area. If you choose not to highlight an area, you will get a confirmation box telling you that the script will use the entire timeline. Click confirm if this is what you want.

----

Run the script...

To run the script, first unzip and put the file into your scripts folder.
[Here is a nice writeup detailing how to find the folder.](http://cgartistry.com/running-python-scripts-in-maya/)

Then using Python in the script editor of maya type:

	import constraintkey
	constraintkey.GUI()

To run the constraints more directly, you can replace GUI with the following:

	.parent()
	.orient()
	.pivot()
	.point()
	.aim()

So for instance, to constrain an orient constraint you could simply type:

	import constraintkey
	constraintkey.orient()

These are all valid constraint types. They do what their maya constraint equivalents do. Pivot constraint is essentially a parent constraint without the rotation.

One final note...
If you do not wish the script to key on a particular channel (say you only want to rotate on a couple axis), simply lock the axis you wish to remain untouched before you run the script. You can unlock afterwards.