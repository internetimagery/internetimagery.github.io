---
title: Pull Dense
layout: page
---
## Pull Dense

Working with dense keyframes from baked simulations or performance capture can be really rewarding. Lots of little hints of motion that would otherwise be quite tricky to put in yourself.

However sometimes you _do_ have to edit the stuff, and yearn for a cleaner curve. Well you can have your cake and eat it with this fancy little snippet.

Essentially all it does is take the difference between your current animation curve and the one in your buffer curve, and apply it to an animation layer. In practice the workflow is thus:

* Take your dense data. Make a buffer curve snapshot (the gui on this snippet has a couple of helper buttons).
* Simplify the curve using any method you desire. Make it something you want to work with.
* Run the tool and apply the difference onto an animation layer.
* Animate with your new curve, while the little details in the motion reside somewhere else, safe.

{% highlight python %}
# Export buffer to layer
import maya.cmds as cmds

GREEN = (0.2, 0.5, 0.4)
YELLOW = (0.7, 0.7, 0.1)

WHEIGHT = 30

def curve_to_attribute(curve, objects, seen=None):
    for attr in ascend("%s.output" % curve):
        obj, at = attr.rsplit(".", 1)
        if obj in objects: return attr
    return ""

def ascend(attribute, seen=None):
    if seen is None: seen = set()
    if attribute not in seen:
        seen.add(attribute)
        obj, attr = attribute.rsplit(".",1)
        if cmds.attributeQuery(attr, n=obj, ex=True):
            yield attribute
            for plug in cmds.listConnections(obj, s=False, scn=True, plugs=True) or []:
                for at in ascend(plug, seen): yield at

class Window(object):
    def __init__(s):
        name = "BufferLayer"
        s.new_layer = "New Layer"
        if cmds.window(name, q=True, ex=True): cmds.deleteUI(name)
        cmds.window(name, t="Buffer Layer", mb=True, rtf=True)
        cmds.menu(l="View")
        cmds.menuItem(l="Show Buffer Curves", c=lambda _: s.display_curves(True))
        cmds.menuItem(l="Hide Buffer Curves", c=lambda _: s.display_curves(False))
        cmds.menu(l="Buffer")
        cmds.menuItem(l="Create Buffer", c=s.buff_make)
        cmds.menuItem(l="Swap Buffer", c=s.buff_swap)
        cmds.columnLayout(adj=True)
        s.layer = cmds.optionMenuGrp(l="Output layer:", h=WHEIGHT)
        cmds.menuItem(l=s.new_layer)
        cmds.button(l="Extract Buffer", h=WHEIGHT*2, bgc=GREEN, c=s.doit)
        cmds.showWindow(name)
        s.update_layers()

    def update_layers(s):
        val = cmds.optionMenuGrp(s.layer, q=True, v=True)
        children = cmds.optionMenuGrp(s.layer, q=True, ill=True)
        if children: cmds.deleteUI(children)
        parent = s.layer + "|OptionMenu"
        cmds.menuItem(l=s.new_layer, p=parent)
        for layer in cmds.ls(type="animLayer"):
            if layer != cmds.animLayer(q=True, r=True): cmds.menuItem(l=layer, p=parent)
            if layer == val: cmds.optionMenuGrp(s.layer, e=True, v=val)

    def display_curves(s, enable):
        editors = (a for a in cmds.lsUI(ed=True) if cmds.animCurveEditor(a, q=True, ex=True))
        for editor in editors: cmds.animCurveEditor(editor, e=True, showBufferCurves="on" if enable else "off")

    def get_selection(s):
        curves = cmds.keyframe(q=True, sl=True, n=True) or []
        objects = cmds.ls(sl=True)
        selection = [b for b in ((curve_to_attribute(a, objects),a) for a in curves) if b[0]]

        # if not selection:
        #     selection = set("{}.{}".format(o, cmds.attributeName("{}.{}".format(o, at), l=True)) for o in cmds.ls(sl=True) for at in cmds.channelBox("mainChannelBox", sma=True, q=True) or [] if cmds.attributeQuery(at, n=o, ex=True))
        if not selection: cmds.warning("Please select something in the graph editor.")
        return selection

    def buff_make(s, *_):
        for at in s.get_selection(): cmds.bufferCurve(at, ov=True)

    def buff_swap(s, *_):
        for at in s.get_selection(): cmds.bufferCurve(at, swap=True)

    def doit(s, *_):
        err, sel = cmds.undoInfo(openChunk=True), cmds.sets()
        try:
            layer = cmds.optionMenuGrp(s.layer, q=True, v=True)
            if layer == s.new_layer:
                layer = cmds.animLayer("Buff_Data")
                s.update_layers()
                cmds.optionMenuGrp(s.layer, e=True, v=layer)

            selection = s.get_selection()
            for attr, curve in selection:
                if not cmds.bufferCurve(curve, q=True, ex=True):
                    cmds.warning("No curve buffer on %s. Skipping." % attr)
                    continue

                layer_curve = set(cmds.ls(cmds.listHistory(cmds.listConnections(attr, d=False)), type="animCurve")).intersection(cmds.animLayer(layer, q=True, anc=True) or [])
                if layer_curve:
                    cmds.warning("Animation %s already in layer %s. Skipping." % (attr, layer))
                    continue

                cmds.bufferCurve(curve, swap=True)
                try:
                    frames = cmds.keyframe(curve, q=True, tc=True)
                    if not frames:
                        cmds.warning("No keyframes could be found for %s. Skipping." % attr)
                        continue
                    data = {a: cmds.keyframe(curve, q=True, t=(a,), eval=True)[0] for a in range(int(min(frames)), int(max(frames))+1)}
                finally: cmds.bufferCurve(curve, swap=True)

                cmds.animLayer(layer, e=True, at=attr)
                for time, value in data.items():
                    cmds.setKeyframe(attr, al=layer, t=time, v=value)
            cmds.selectKey(clear=True)
            for attr, curve in selection: cmds.selectKey(curve, add=True, k=True)
        except Exception as err: raise
        finally:
            if cmds.objExists(sel): cmds.select(sel); cmds.delete(sel)
            cmds.undoInfo(closeChunk=True)
            if err: cmds.undo()

Window()
{% endhighlight %}
