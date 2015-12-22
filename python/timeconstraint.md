---
title: Time Constraint
layout: page
---
## Constrain an object to time

A quick useful constraint system. Constrain an object to another in time. Works like a Parent Constraint, with time as an added variable.

To use simply copy paste the code below into a shelf icon. Then use it as you would any other constraint. Select the driver, then the driven objects and press the button.

A new attribute will be created on the driven object for each axis constrained. A value of 0 means to follow perfectly. Just like a parent constraint.

A negative value means to move that many frames delayed in time. A positive value means to move that many frames into the future.

{% highlight python %}
# Offset constraint for Maya
# Created By Jason Dixon. http://internetimagery.com
#
# Wrap the outermost function calls in the Report class
# As a decorator or as a context manager on the outermost function calls
# For instance, decorate your Main() function,
# or any function that is called directly by a GUI
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
import pymel.core.uitypes as ui

AXIS = tuple(a + b for a in "trs" for b in "xyz")
TRANSLATE = slice(0, 3)
ROTATE = slice(3, 6)
SCALE = slice(6, 9)

class Offset_Constraint(object):
    """ Time constraint. """
    def __init__(s):
        name = "offset_gui"

        if pmc.window(name, ex=True):
            pmc.deleteUI(name)

        with pmc.window(name, t="Offset Constraint"):
            with ui.ColumnLayout(adj=True):
                with pmc.frameLayout(l="Constraint Axis:"):
                    s.trans = ui.CheckBoxGrp(l="Translate:").setValue1(True).onCommand(lambda x:s.uncheck_boxes(s.trans_ax))
                    s.trans_ax = ui.CheckBoxGrp(l="", la3=("X","Y","Z"), ncb=3).onCommand(lambda x:s.uncheck_boxes(s.trans))
                    s.rot = ui.CheckBoxGrp(l="Rotate:").setValue1(True).onCommand(lambda x:s.uncheck_boxes(s.rot_ax))
                    s.rot_ax = ui.CheckBoxGrp(l="", la3=("X","Y","Z"), ncb=3).onCommand(lambda x:s.uncheck_boxes(s.rot))
                    s.sca = ui.CheckBoxGrp(l="Scale:").setValue1(True).onCommand(lambda x:s.uncheck_boxes(s.sca_ax))
                    s.sca_ax = ui.CheckBoxGrp(l="", la3=("X","Y","Z"), ncb=3).onCommand(lambda x:s.uncheck_boxes(s.sca))

                ui.Button(l="Apply", h=40).setCommand(lambda x: s.check_options())

    def uncheck_boxes(s, boxes):
        """ Uncheck boxes """
        boxes.setValueArray3([False]*3)

    def check_options(s):
        """ Check the options and validate selection """
        sel = pmc.ls(sl=True, type="transform")
        if len(sel) != 2: return pmc.warning("Please Select Two Objects.")
        trans = s.trans.getValue1()
        trans_ax = [s.trans_ax.getValue1(), s.trans_ax.getValue2(), s.trans_ax.getValue3()]
        rot = s.rot.getValue1()
        rot_ax = [s.rot_ax.getValue1(), s.rot_ax.getValue2(), s.rot_ax.getValue3()]
        sca = s.sca.getValue1()
        sca_ax = [s.sca_ax.getValue1(), s.sca_ax.getValue2(), s.sca_ax.getValue3()]
        if (not trans and True not in trans_ax) and (not rot and True not in rot_ax) and (not sca and True not in sca_ax):
            return pmc.warning("Please Select at least One Axis.")

        axis = set() # Pull out requested axis
        if trans: axis |= set(AXIS[TRANSLATE])
        if rot: axis |= set(AXIS[ROTATE])
        if sca: axis |= set(AXIS[SCALE])
        axis |= set(b for a, b in zip(trans_ax + rot_ax + sca_ax, AXIS) if a)

        s.apply_constraint(sel[0], sel[1], axis)

    def apply_constraint(s, driver, driven, attributes):
        """ Attach constraint to object """
        err = pmc.undoInfo(openChunk=True)
        try:
            time = pmc.nt.Time("time1") # Time node
            base = pmc.group(em=True, n="%s_offset_base" % driven)
            OK = False # Are we ok to continue?
            for attr in attributes:
                for anim_curve in driver.attr(attr).connections(type="animCurve", d=False): # Get anim curve

                    offset_name = "offset_%s" % attr # Create attribute to offset
                    if not hasattr(driven, offset_name):
                        driven.addAttr(offset_name, k=True)
                    offset_at = driven.attr(offset_name)

                    add_node = pmc.nt.AddDoubleLinear(n="%s_offset_%s" % (driven, attr)) # Create our nodes
                    cache_node = pmc.nt.FrameCache(n="%s_cache_%s" % (driven, attr))

                    offset_at.connect(add_node.input1) # Connect our offset controller
                    time.outTime.connect(add_node.input2) # Connect the scene time

                    add_node.output.connect(cache_node.varyTime) # Connect to cache
                    anim_curve.output.connect(cache_node.stream) # Connect animation curve to cache

                    cache_node.varying.connect(base.attr(attr))

                    OK = True
            if OK:
                # Create a Locator and size it
                driven_pos = driven.getTranslation("world")
                b_box = driven.getBoundingBox()
                b_size = (b_box.width(), b_box.height(), b_box.depth())
                scale = 1.5
                loc = pmc.spaceLocator()
                for a, b in zip("XYZ", b_size):
                    loc.attr("localScale%s" % a).set(b * 0.5 * scale)
                pmc.xform(loc, t=driven_pos)
                pmc.parent(loc, base)

                # Attach object to locator
                skip = set(AXIS) - set(attributes)

                skip_trans = [b for a, b in skip if a == "t"]
                skip_rot = [b for a, b in skip if a == "r"]
                if len(skip_trans) < 3 or len(skip_rot) < 3:
                    pmc.parentConstraint(
                        loc,
                        driven,
                        st=skip_trans,
                        sr=skip_rot,
                        mo=True
                    )

                skip_scale = [b for a, b in skip if a == "s"]
                if len(skip_scale) < 3:
                    pmc.scaleConstraint(
                        loc,
                        driven,
                        sk=skip_scale,
                        mo=True
                    )

        except Exception as err:
            raise
        finally:
            pmc.undoInfo(closeChunk=True)
            if err: pmc.undo()
{% endhighlight %}
