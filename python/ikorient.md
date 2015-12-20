---
title: IK-Like Orient Rig
layout: page
navigation: false
---
## IK-Like Orient Rig

A Quick setup Orient Rig / Look At Constraint. There are times it is simpler and far more convenient to animate orientations in a look-at style situation.

Copy the code below and put it in a shelf icon in Maya. Select the object you wish to set up, and hit the button.

Pick your Up and Out axis (the option for reverse axis is there, -X, -Y, -Z) and GO!

{% highlight python %}
# IK Orientation Control
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


import pymel.core as pmc
import maya.api.OpenMaya as om

def message(text):
    pmc.confirmDialog(t="Uh oh...", m=text)

class Orient(object):
    """ Orient setup using IK-like system """

    AXIS = ("X","Y","Z","-X","-Y","-Z")

    def __init__(s, obj):
        if len(obj) != 1: return message("You must only select one Object")
        s.obj = obj[0]
        name = "ikorientwin"
        if pmc.window(name, ex=True): pmc.deleteUI(name)
        with pmc.window(name, t="IK-Like Orient Constraint") as s.win:
            with pmc.columnLayout(adj=True):
                s.fwd = pmc.optionMenuGrp(l="Forward Axis")
                for ax in s.AXIS: pmc.menuItem(l=ax)
                s.up = pmc.optionMenuGrp(l="Up Axis")
                for ax in s.AXIS: pmc.menuItem(l=ax)
                pmc.button(l="GO!", c=s.build)

    def build(s, *_):
        """ Build Setup """
        fwd = s.AXIS.index(s.fwd.getValue())
        up = s.AXIS.index(s.up.getValue())
        up, up_dir = (up, 1) if up < 3 else (up - 3, -1)
        fwd, fwd_dir = (fwd, 1) if fwd < 3 else (fwd - 3, -1)
        if up == fwd: return message("The two axis must be different.")
        matrix = tuple(om.MVector(a[:3]) for a in s.obj.getMatrix(ws=True))
        b_box = s.obj.getBoundingBox()
        b_size = (b_box.width(), b_box.height(), b_box.depth())
        cam_pos = om.MVector(pmc.modelEditor(pmc.playblast(ae=True), q=True, cam=True).getTranslation("world"))
        offset = (cam_pos - matrix[3]).length() * 0.1
        fwd_pos = matrix[fwd].normalize() * fwd_dir * (b_size[fwd] * 0.5 + offset) + matrix[3]
        up_pos = matrix[up].normalize() * up_dir * (b_size[up] * 0.5 + offset) + matrix[3]
        def locator(name, pos):
            loc = pmc.spaceLocator(n="%s_%s" % (s.obj, name))
            arrow = pmc.annotate(s.obj, tx="", p=(0,0,0))
            arrow.template.set(1)
            pmc.parent(arrow, loc)
            shape = loc.setPosition(pos)
            for ax in s.AXIS[:3]:
                pmc.setAttr("%s.localScale%s" % (shape, ax), offset * 0.5)
            return loc
        fwd_loc = locator("forward", fwd_pos)
        up_loc = locator("up", up_pos)
        control = pmc.group(em=True, n="%s_attach" % s.obj)
        pmc.pointConstraint(s.obj, control)
        pmc.aimConstraint(
            fwd_loc.name(),
            control.name(),
            worldUpType="object",
            worldUpObject=up_loc.name()
        )
        pmc.orientConstraint(control, s.obj, mo=True)
        pmc.group(fwd_loc, up_loc, control, n="%s_Orient_IK" % s.obj)
        pmc.select(fwd_loc, r=True)
        pmc.deleteUI(s.win)

Orient(pmc.ls(sl=True, type="transform"))
{% endhighlight %}
