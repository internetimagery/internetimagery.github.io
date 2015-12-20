---
title: Constraint Switcher
layout: page
---
## Constraint Switcher

When dealing with multiple constraints such as a character picking up an object and passing it to another character, it is a pain keeping track of the constraints and which goes to where. Let alone switching between them.

This script assists with this situation by creating a dropdown switcher box.

Copy the code below and add it to a shelf icon.

To use:

* Select the object __WITH THE CONSTRAINT__. This means the object that is being driven, not the one that is doing the driving. In the case of a character picking something up, this tool works on the object being picked up.
* Click the shelf button to set up a switcher (you'll find it in the channel box)
* If you change, update or delete the constraints after having created the switcher. Be sure to select the object again and press the shelf icon again. This will update the switcher correctly.


{% highlight python %}
# Constraint Switcher
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
# simplify constraint setup

import functools
import collections
import maya.cmds as cmds

class Node(object):
    """ Generic node """
    node = ""
    in_attr = ""
    out_attr = ""
    def connect_in(s, val):
        cmds.connectAttr(val, s.node + s.in_attr, f=True)
        return s

    def connect_out(s, val):
        cmds.connectAttr(s.node + s.out_attr, val, f=True)
        return s

class Condition(Node):
    """ Create a condition node """
    def __init__(s):
        s.node = cmds.shadingNode("condition", au = True)
        cmds.setAttr("%s.ctr" % s.node, 1) #set TRUE to be 1
        cmds.setAttr("%s.cfr" % s.node, 0) #set FALSE to be 0
        s.in_attr = ".ft"
        s.out_attr = ".ocr"

    def set_value(s, value):
        cmds.setAttr("%s.secondTerm" % s.node, value)
        return s

class Clamp(Node):
    """ Create a clamp node """
    def __init__(s):
        s.node = cmds.shadingNode("clamp", au = True)
        cmds.setAttr("%s.mxr" % s.node, 1) #set MAX to be 1
        s.in_attr = ".ipr"
        s.out_attr = ".opr"

def get_pairBlend(obj):
    """ Retrieve pairBlend nodes from obj """
    return set(cmds.listConnections(obj, type="pairBlend", exactType=True) or [])

def get_constraints(obj):
    """ Get attached constraints """
    return set(cmds.listConnections(obj, s=False, type="constraint") or [])

def main(selection):
    """ Create constraint switcher """
    cmds.undoInfo(openChunk=True)
    err = None
    try:
        for sel in selection: # Run on multiple objects
            if "transform" != cmds.objectType(sel): # Basic validation
                print "%s not transform. Skipping." % sel
                continue

            constraints = get_constraints(sel)
            if not constraints:
                print "%s has no constraints. Skipping." % sel
                continue

            for at in (a + b for a in ("translate", "rotate") for b in ("X", "Y", "Z")):
                try:
                    if not cmds.keyframe(sel, at=at, q=True): # Add keyframe if none to force pairBlend
                        cmds.setKeyframe(sel, at=at)
                except RuntimeError:
                    pass

            options = collections.defaultdict(set) # Options for switching
            for const in constraints:
                blend = get_pairBlend(const) # Start by following blend parents
                for b in blend:
                    blend_attr = cmds.listConnections("%s.w" % b, p=True, d=False)
                    if blend_attr: # blend attribute on object
                        options["nothing"].add(blend_attr[0])
                for weight in cmds.listAttr(const, sn=True, st="w*", k=True) or []: # Get contraint weights
                    attr = ".".join((const, weight))
                    name = cmds.attributeName(attr, l=True)[:-2] # Pull target name from attribute
                    options[name].add(attr)

            if options: # Build our selector
                opt_names = sorted(list(set(options.keys())))
                opt_names.insert(0, opt_names.pop(opt_names.index("nothing"))) # Move "nothing" to the front
                keyframe = functools.partial(cmds.keyframe, sel, at="atch")

                if cmds.objExists("%s.atch" % sel): # Check if switcher already exists
                    old_keys = keyframe(q=True) # backup existing keys
                    old_opt = cmds.addAttr("%s.atch" % sel, q=True, en=True).split(":") # backup existing options

                    if old_keys: # we have something to update
                        print "Updating existing keyframes..."
                        buff = {}
                        for opt in old_opt:
                            try: # Map old keys to new keys
                                buff[old_opt.index(opt)] = opt_names.index(opt)
                            except ValueError:
                                buff[old_opt.index(opt)] = None

                        for key in old_keys:
                            old_val = keyframe(t=(key,key), q=True, vc=True)[0]
                            new_val = buff[int(old_val)]
                            if new_val is None: # Constraint was removed. Remove keys too
                                cmds.cutKey(sel, at="atch", cl=True, t=(key,key))
                            else:
                                keyframe(e=True, t=(key,key), vc=new_val)

                    cmds.addAttr("%s.atch" % sel, e=True, en=":".join(opt_names)) # Update switcher
                else: # Create switcher
                    cmds.addAttr(ln="attach_to",sn="atch", k=True, at="enum", en=":".join(opt_names))

                for i, opt in enumerate(opt_names): # Connect up our switcher
                    if i: # Set up constraints
                        for link in options[opt]:
                            Condition().set_value(i).connect_in("%s.atch" % sel).connect_out(link)
                    else: # Set up blend node
                        for link in options[opt]:
                            Clamp().connect_in("%s.atch" % sel).connect_out(link)
    finally:
        cmds.undoInfo(closeChunk=True)
        if err:
            cmds.undo()
        cmds.select(selection, r=True)

main(cmds.ls(sl=True))
{% endhighlight %}
