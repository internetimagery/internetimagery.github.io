---
title: Curve Combiner
layout: page
---
## Curve Combiner

Combining Nurbs curves is a really nice thing to do when creating controls for rigs. It allows all manner of complicated control shapes.

Unfortunately Maya doesn't make it easy to combine them. The process is fairly convoluted.

So here is a simple script to help.

Copy the code below into a shelf icon.

To use:

* Create your curves.
* Select them all and press the shelf icon. Combined!


{% highlight python %}
# Curve Combiner
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

err = None
cmds.undoInfo(openChunk=True)
try:
    sel = cmds.ls(sl=True, type="transform") # Grab the current selection...
    if len(sel) > 1:
    	cmds.makeIdentity(sel, a=True) # Freeze Transforms
    	parent = sel[-1] # The object we will parent to.
    	del sel[-1]
    	curves = cmds.listRelatives(sel , s=True) # The curves we want to combine.
    	cmds.parent(curves, parent, s=True, r=True)
    	cmds.delete(sel)
    	cmds.select(parent)
    else:
    	cmds.confirmDialog(t='Yeah, nah bro.', m="You need to select more than one curve to combine them.")
except Exception as err:
	raise
finally:
	cmds.undoInfo(closeChunk=True)
	if err: cmds.undo()
{% endhighlight %}
