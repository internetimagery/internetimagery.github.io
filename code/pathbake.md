---
title: Path Bake
layout: page
---
## Path Bake

Sometimes you need to adjust (or simply inspect) the speed of an object in motion.
This tool is for that. Inspired by Morgan Loomis's awesome worldbake tool.

Running with something selected bakes out its motion onto a motion-path (locator). Selecting the locator and running the tool again bakes the motion _back_ onto the object.

This is especially useful when things are flying through the air, as you can take an existing motion arc, and tweak the "distance along the curve" value and bake it back into anim.
It's similar to working with timewarps (just for position attrs) except you get to view and directly manipulate the speed of the object as a curve. Timewarps of course come in linear, regardless of what your animation looks like.

{% highlight python %}
# Bake onto path and back

import maya.cmds as cmds

def main(step=1.0, subframes=2):
    selection = cmds.ls(sl=True, l=True)
    Fmin = cmds.playbackOptions(q=True, min=True)
    Fmax = cmds.playbackOptions(q=True, max=True)

    if not selection: raise RuntimeError("Please select something.")
    from_path = {a: cmds.listConnections("%s.bake" % a, d=False) for a in selection if cmds.attributeQuery("bake", n=a, ex=True, msg=True) and cmds.attributeQuery("delete", n=a, ex=True, msg=True)}
    to_path = {a: {} for a in selection if a not in from_path}
    frames = set(a * step + Fmin for a in xrange(int((Fmax - Fmin) / step + 1)))
    substep = subframes and step / subframes
    subframes -= 1

    err, sel, auto = cmds.undoInfo(openChunk=True), cmds.sets(), cmds.autoKeyframe(q=True, st=True)
    cmds.autoKeyframe(st=False)
    try:
        for fr in sorted(frames):
            cmds.currentTime(fr)
            for obj in selection:
                pos = cmds.xform(obj, q=True, ws=True, t=True)

                # Bake from path
                bake_obj = from_path.get(obj)
                if bake_obj is not None:
                    cmds.xform(bake_obj, ws=True, t=pos)
                    cmds.setKeyframe(bake_obj, at="t")

                # Bake to path
                data = to_path.get(obj)
                if data is not None:
                    data[fr] = pos
                    for sfr in xrange(subframes):
                        fr += substep
                        cmds.currentTime(fr)
                        data[fr] = cmds.xform(obj, q=True, ws=True, t=True)

        # Bake from path cont...
        for obj in from_path:
            cmds.delete([obj] + cmds.listConnections("%s.delete" % obj, d=False) or [])

        # Bake to path cont...
        for obj in to_path:
            basecurve = cmds.curve(d=1, p=[to_path[obj][a] for a in sorted(to_path[obj])])
            try: fitcurve, = cmds.fitBspline(basecurve, tol=0.01, ch=False, n="|PATH_FOLLOW_%s" % obj)
            except: raise RuntimeError("There was a problem creating your curve. Does '%s' have motion?" % obj)
            cmds.delete(basecurve)

            loc, = cmds.spaceLocator(n="|PATH_%s" % obj)
            cmds.addAttr(loc, ln="distance", k=True)
            cmds.addAttr(loc, ln="bake", at="message")
            cmds.addAttr(loc, ln="delete", at="message", m=True, im=False)
            info = cmds.shadingNode("nearestPointOnCurve", au=True)
            dec = cmds.shadingNode("decomposeMatrix", au=True)
            comp = cmds.shadingNode("composeMatrix", au=True)
            mul = cmds.shadingNode("multMatrix", au=True)
            motion = cmds.pathAnimation(fitcurve, loc)
            cmds.delete(cmds.listConnections("%s.u" % motion, d=False))

            for ax in "xyz":
                conn = cmds.listConnections("%s.t%s" % (loc, ax), p=True, c=True, d=False)
                if conn:
                    cmds.connectAttr(conn[1], "%s.it%s" % (comp, ax))
                    cmds.connectAttr("%s.ot%s" % (dec, ax), conn[0], f=True)
            cmds.connectAttr("%s.omat" % comp, "%s.i[0]" % mul)
            cmds.connectAttr("%s.pim" % loc, "%s.i[1]" % mul)
            cmds.connectAttr("%s.o" % mul, "%s.imat" % dec)

            cmds.connectAttr("%s.msg" % obj, "%s.bake" % loc)
            cmds.connectAttr("%s.bbsi" % obj, "%s.los" % loc)
            cmds.connectAttr("%s.l" % fitcurve, "%s.ic" % info)
            cmds.connectAttr("%s.msg" % dec, "%s.delete" % loc, na=True)
            cmds.connectAttr("%s.msg" % mul, "%s.delete" % loc, na=True)
            cmds.connectAttr("%s.msg" % comp, "%s.delete" % loc, na=True)
            cmds.connectAttr("%s.msg" % motion, "%s.delete" % loc, na=True)
            cmds.connectAttr("%s.msg" % fitcurve, "%s.delete" % loc, na=True)
            cmds.connectAttr("%s.distance" % loc, "%s.u" % motion, f=True)
            for fr in frames:
                val = to_path[obj][fr]
                for at, v in zip("xyz", val): cmds.setAttr("%s.ip%s" % (info, at), v)
                uv = cmds.getAttr("%s.pr" % info)
                cmds.setKeyframe("%s.distance" % loc, t=fr, v=uv)
            cmds.delete(info)
    except Exception as err: raise
    finally:
        if cmds.objExists(sel): cmds.select(sel); cmds.delete(sel)
        cmds.autoKeyframe(st=auto)
        cmds.undoInfo(closeChunk=True)
        if err: cmds.undo()

main()
{% endhighlight %}
