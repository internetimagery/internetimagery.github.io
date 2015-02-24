---
title: Attribute Snap
layout: post
thumb: /img/posts/magnet.jpg
---
The attribute snapping script for Maya!<!-- more -->

###[You can download the script HERE](https://github.com/internetimagery/attrsnap/releases)

Sometimes you just want two objects to 'stick' together. This script lets you do that.

Begin by selecting two objects to join together and then select the arributes you wish to use to join them together.

Now I know what you're saying. Why not just use a constraint?! Why waste my time on this slow ass script when I could constrain in half the time and get realtime feedback!?

Well you're right. Sorry...

###Understanding the script.

<div class="js-video [vimeo, widescreen]"><iframe width="420" height="315" src="//www.youtube-nocookie.com/embed/9E86CirMOfc?rel=0" frameborder="0" allowfullscreen></iframe></div>

Ok are they gone? Alright for the attentitive few still reading, the power is not so much in replicating a constraint (though you can do that) but in using arbitrary attributes. You *could* select two objects, then select all the transforms of one of the objects and it would be the same as a constraint, but what if you want two objects to be locked together by controlling another object or custom attribute?

This is what this script is designed for.

For example, you might want an elbow to lock to a table. But you want it to stay there by using the shoulder rotate attributes. You can't do this with constraints. Or you might have some custom attribute like an arm stretch, and you want to use that to stick a hand to an object in motion. Again you can't do that with constraints.

So now that we understand what this script is for, lets go over the usage.

###Using the Script

First things first. You need to copy the script to your script folder and load the GUI. You can do so by typing this code into the script editor or by making a shelf icon with the code:

	import attrsnap
	attrsnap.GUI()

From here you'll get a nice neat little window pop up. This is where all your control will come from.

Load two objects by selecting two objects and pressing the load objects button. You'll know you're successful when their names appear in the right hand collumn.

Next you'll need to select the objects and attributes you want to load up. You can select them all at once or load them one at a time. Pressing the Load Attribute button for each attribute.

Review the attributes you've just loaded. Be sure they are the correct ones. You can delete attributes by clicking the little X button next to them. You can also narrow the range in which the script will opperate by changing the values on the right hand side of the GUI. This is recommended so the script doesn't waste time searching in dead areas and to narrow down all possible options to just what fits in that section.

Press the Run Scan button if you want a single scan, or select a range of time on the timeslider (shift click-drag) before pressing the button to have the script run through the whole section.

###Some quick notes:

Try to use as few attributes as possible. In order for this script to handle as many custom senarios as possible, it uses a blatant brute force approach at working out the attribue values. This means that the more attributes it has to check, the more combinations it has to run through, the longer it will take.

Try to limit the range of the attributes to one solution. What this means is that in addition to using as few attributes as you can (which also helps with animating) you should ideally limit the range it has to search. When you load an attribute into the GUI you'll see two boxes with numbers. It's a good idea to type in numbers that are closer to the range you're expecting to use to ensure speed and accuracy. Most notibly this can happen with rotations, where there could be multiple values that are all valid solutions but only one you're interested in.

If the script has trouble narrowing down your criteria try increasing (or decreasing) the steps. This will make it take longer, but the chances of finding a complex attribute combination will improve.

The accuracy box referres to how close the script will go before it considers itself done. There isn't really a need to worry about this value but it's here if you want to mess with it.