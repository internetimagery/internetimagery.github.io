---
title: Movable Parent Constraint
layout: page
---
## Movable Parent Constraint

A very commonly used setup when constraining objects together is to first create a hierarchy of objects and constrain to that.
In doing so you retain the ability to easily move objects around and reposition at any time while still "stuck" to the other object.

This script automates that!

Take the code below and throw it in a shelf icon. Then there are two ways to use it:

* As you normally constrain things. Select the driver then the passenger and click the button.
* Select one object only to have it parented to "the world"


{% highlight python %}
# Movable parent constraint
# Created By Jason Dixon. http://internetimagery.com
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.

import maya.cmds as cmds
def constrain(sel):
    """
    One object selected: Parent object to a Locator.
    Two objects selected: Set up locator on first object and parent second to the locator.
    """
    if len(sel) < 3:
    	if len(sel):
    		xyz = {'X':0,'Y':1,'Z':2}
    		b_box = cmds.xform(sel[-1], bb=True, q=True)
    		prefix = "locator_"
    		n = 1
    		name = prefix + sel[0]
    		while cmds.objExists(name): # no duplicates
    			name = prefix + str(n) + "_" + sel[0]
    			n += 1
    		loc = cmds.spaceLocator(n= name)[0]# create locator
    		shape = cmds.listRelatives(loc , s=True)[0] + ".localScale"
    		for ax in xyz: #scale locator
    			cmds.setAttr(shape + ax, b_box[xyz[ax]+3] - b_box[xyz[ax]])
    		grp = "world_" + sel[0] if len(sel) == 1 else "constraint_" + sel[0]
    		if cmds.objExists(grp): # check if group already exists (ie more than one constraint setup)
    			cmds.parent(loc, grp, r=True)
    		else: #doesn't exist? create the group
    			grp = cmds.group(loc, n=grp)
    			if not len(sel) == 1:
    				cmds.parentConstraint(sel[0], grp) #move locator to position
    		cmds.delete(cmds.parentConstraint(sel[-1], loc))
    		cmds.parentConstraint(loc, sel[-1])
    		cmds.select(loc)
    	else:
    		cmds.confirmDialog(t='Yeah, nah bro.', m="You have nothing selected.\n\nOne object selected: Parent object to a Locator.\nTwo objects selected: Set up locator on first object and parent second to the locator.")
    else:
    	cmds.confirmDialog(t='Yeah, nah bro.', m="You selected heaps as!\nJust select one or two objects.")
constrain(cmds.ls(sl=True))
{% endhighlight %}
