---
title: Curve Combiner AND Constraint Locator scripts
layout: post
thumb: /img/posts/tape.jpg
---

__There is still time left in the year for new stuff!__

Introducing __Curve Combiner__ and __Constraint Locator!__

----

###Curve Combiner

While messing with rigging I've come across the need to combine nurbs curve shapes into a single object. Thankfully it is not something that is hard to do, but the process is tedious and incredibly counter intuitive!

So here is a simple script to help with that!

In your shelf editor, simply make a new shelf button with this PYTHON code:


{% highlight python %}
# Combine nurbs curves into one single nurbs shape!
import maya.cmds as cmds
sel = cmds.ls( sl=True ) # Grab the current selection...
if len(sel) > 1:
	cmds.makeIdentity( sel, a=True) # Freeze Transforms
	parent = sel[-1] # The object we will parent to.
	del sel[-1]
	curves = cmds.listRelatives( sel , s=True) # The curves we want to combine.
	cmds.parent( curves, parent, s=True, r=True )
	cmds.delete( sel )
	cmds.select( parent )
else:
	cmds.confirmDialog(t='Yeah, nah bro.', m="You need to select more than one curve to combine them.")
{% endhighlight %}


Then select all the curves you wish to combine and hit the button! Time Saved!

----

###Constraint Locator

Another common task I (and perhaps you too?) find myself doing is creating locators to aid in constraining objects to one another.

Picking up that pencil? Want a parent / parent-constraint heirachy to give maximum flexability? TEDIOUS!

So here is a script that goes and does the hard work for you.

To use it, simply copy and paste the below into a PYTHON button on your shelf.

Select **ONE** object and a locator will be created, with the object parented to it. So you can use the locator to control the object.

Select **TWO** objects and a locator will be parented to the first object, and constrained to the second object.

{% highlight python %}
# One object selected: Parent object to a Locator.
# Two objects selected: Set up locator on first object and parent second to the locator.
import maya.cmds as cmds
sel = cmds.ls(sl=True)
if len(sel) < 3:
	if len(sel):
		xyz = {'X':0,'Y':1,'Z':2}
		d = cmds.xform( sel[-1], bb=True, q=True )
		lnb = "locator_"
		n = 1
		ln = lnb+sel[0]
		while cmds.objExists( ln ): # no duplicates
			ln = lnb+str(n)+"_"+sel[0]
			n += 1
		loc = cmds.spaceLocator( n= ln )[0]# create locator
		shape = cmds.listRelatives( loc , s=True)[0]+".localScale"
		for ax in xyz: #scale locator
			cmds.setAttr( shape+ax, d[xyz[ax]+3] - d[xyz[ax]] )
		grp = "world_"+sel[0] if len(sel) == 1 else "constraint_"+sel[0]
		if cmds.objExists( grp ): # check if group already exists (ie more than one constraint setup)
			cmds.parent( loc, grp, r=True )
		else: #doesn't exist? create the group
			grp = cmds.group( loc, n=grp)
			if not len(sel) == 1:
				cmds.parentConstraint( sel[0], grp ) #move locator to position
		cmds.delete( cmds.parentConstraint( sel[-1], loc) )
		cmds.parentConstraint( loc, sel[-1] )
		cmds.select( loc )
	else:
		cmds.confirmDialog(t='Yeah, nah bro.', m="You have nothing selected.\n\nOne object selected: Parent object to a Locator.\nTwo objects selected: Set up locator on first object and parent second to the locator.")
else:
	cmds.confirmDialog(t='Yeah, nah bro.', m="You selected heaps as!\nJust select one or two objects.")
{% endhighlight %}