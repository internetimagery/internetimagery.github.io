---
title: Animation Sanity Check
layout: post
thumb: /img/posts/keys.jpg
---
Animation Sanity check is a script for maya that does what it implies on the tin. Checks your animation, to save your sanity!

It's designed to check for technical issues with your keyframes, so you don't have to go hunting through each and every key. Things such as flat curves that should be moving holds, and stray stepped tangents etc.<!-- more -->

###KEEP YOUR SANITY

####[You can download the script HERE.](https://github.com/internetimagery/animsanity/releases)

To install the script, place the contents of the zip into your scripts folder. If you already have a smartselection.py file, it's ok to replace it. Multiple scripts use the same file.

To run the script simply type into maya, or create a shelf button with the following python script:

{% highlight python %}
import animsanity
animsanity.GUI()
{% endhighlight %}

Selecting the objects you wish to check and pressing the big button at the bottom will run a check. The results are shown above. Ideally with everything ticked. ;)

For checks that fail, you'll have two buttons light up. _Show_ and _Fix it_.

* Clicking Show will highlight everything that the check picked up. Allowing you to figure out what you want to do about it (if anything).
* Clicking Fix it will attempt to fix the issue automatically. In general it's better to fix the issue manually so you have total control. But in some cases the automatic fix is good enough. In all cases, automatic fixing is a time saver!
* Be smart. Sometimes it's ok for checks to fail. For instance, you'll have moving hold errors on things like feet if they're locked in place.


###What is with that folder?

You may notice a folder that comes with the script files, full of other script files. This folder contains all the checks that are run when you use the code above. If there are some checks that you simply want to remove from the script, all you have to do is delete them here. Likewise if you want to create your own checks you can place them here.

I'll periodically be updating this script with more checks. Which can either mean downloading from here again, or [downloading the latest checks here.](https://code.google.com/p/maya-anim-tools/source/browse/#svn%2Ftrunk%2Fsanity_modules)

To create your own checks simply modify this script template, save it as something memorable and throw it in the folder with the rest of the scripts:

{% highlight python %}
import maya.cmds as cmds
class load(object):
	def __init__(self):
		self.sel = {}
		self.label = "LABEL TO GO IN THE GUI GOES HERE"
		self.description = """
A long description of your check and what it does can go here.
This will be displayed when the ? button is pressed.
"""
	def search(self, obj, attr, keys):
		print 'CODE TO SEARCH FOR THE ISSUE GOES HERE. THIS WILL BE RUN FOR EACH CHANNEL.\n
				MAKE SURE YOU POPULATE self.sel WITH FOUND KEYS AND ATTRIBUTES IN THE FORMAT\N
				{obj: {attr: [keys] }}'

	def fix(self):
		print 'CODE TO FIX THE ISSUE CAN GO HERE. THIS WILL BE RUN IF SOMEONE PRESSES THE "FIX IT" BUTTON.
{% endhighlight %}

* __ __init__ __ runs when the check is loaded. It is also run when the reset button is pressed, so be sure to initialise any variables you'll be using here.

* __self.sel__ Add to this during the search command (explained below). Leaving this empty signifies the check passed (didn't find anything to fix).

* __self.label__ contains the name of the check, that will be seen in the GUI.

* __self.description__ write in here a long description of what the check does. This will be displayed when someone presses the ? button. You can use tripple quotes """ to allow you to type in a more natural way with new lines if you like.

* __search()__ is run multiple times when scanning for problems in the animation. Once for every channel in the selection. Each time it is run the obj, attr, keys variables will be populated with the objects, attributes, and keys it's working on. You can make new variables to store info between function calls if you like. The only thing you _have_ to do here, is populate the variable _self.sel_ with keys that match your search criteria. An easy way to do this is to use this code:

{% highlight python %}
if "your search criteria here":
	self.sel[obj] = self.sel.get(obj, {})
	self.sel[obj][attr] = self.sel[obj].get(attr, [])+["Your keyframe here"]
{% endhighlight %}

* __fix()__ code is run when someone presses the Fix It button. This is where you get to attempt to fix the issue you've found. Remember _self.sel_ contains the information you searched earlier. Use this to work out a solution to the problem. An easy way to run through the list is as follows:

{% highlight python %}
for o in self.sel:
	for at in self.sel[o]:
		for k in in self.sel[o][at]:
			print 'Code goes here! o= objects, at= attributes, k= keys'
{% endhighlight %}

* __show()__ This command isn't in the template above. Its an optional one that, if exists, will override the "show" buttons default function of selecting keys. Use this if you have different information to pass on.
