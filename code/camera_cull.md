---
title: Camera Culling (Frustrum)
layout: page
---
## Camera Culling

If you're working in a maya scene with a lot of layout, it can be quite taxing on your framerate.
Assuming the camera is more or less locked down, it can be helpful to hide everything the camera does not see.

This snippet does just that. Simply select the camera (or cameras) that you wish to see through, and run the code.
Everything outside the camera view will be placed into a new display layer and hidden. Feel free to inspect the layer to see what was hidden. :)

{% highlight python %}
# Put elements outside of camera view in display layer

from __future__ import division
from collections import defaultdict
import maya.api.OpenMaya as om
from itertools import izip
import maya.cmds as cmds
import maya.mel as mel
import operator

# States
NO_VIS, PART_VIS, FULL_VIS = xrange(3)

def main(camShapes=None, Fmin=None, Fmax=None, Fsub=1.0, layerName="AutoFrustrumCull"):
    # Get selection
    if camShapes is None: camShapes = set(cmds.ls(sl=True, type="camera", l=True) + [b for a in cmds.ls(sl=True, type="transform", l=True) for b in cmds.listRelatives(a, type="camera", f=True) or []])
    if not camShapes: return cmds.confirmDialog(t="Just a sec...", m="Please select a camera.")

    # Convert to api
    tmp = om.MSelectionList()
    for a in camShapes: tmp.add(a)
    camPaths = [tmp.getDagPath(a) for a in xrange(tmp.length())]
    camFns = [om.MFnCamera(a) for a in camPaths]

    # Get frame range
    if Fmin is None: Fmin = cmds.playbackOptions(q=True, min=True)
    if Fmax is None: Fmax = cmds.playbackOptions(q=True, max=True)

    # Manage our scene.
    scene = defaultdict(int)

    # Ignore some nodes
    blacklist = ["camera", "light"]
    scene.update(("|".join(a[:c+2]), PART_VIS)
        for a in (b.split("|")
        for b in cmds.ls(type=blacklist, l=True))
        for c in xrange(len(a)-1))

    # Use a filter to only expose nodes we want to traverse
    nodeFilter = lambda a: (b for b in a if b.apiType() == om.MFn.kTransform and b.isVisible())

    # Get display layer and empty it
    layer, = [a for a in cmds.ls(type="displayLayer") if a == layerName] or [cmds.createDisplayLayer(e=True, n=layerName)]
    cmds.editDisplayLayerMembers("defaultLayer", *cmds.editDisplayLayerMembers(layer, q=True, fn=True) or [])

    # Loop frames
    for fr in xrange(int((Fmax - Fmin) / Fsub) + 1):
        cmds.currentTime(fr * Fsub + Fmin)

        # Build frustum planes
        planes = [i
            for a in (([e(f[b], f[c])
            for b, c in izip([3,7,11,15],d)]
            for d in ([0,4,8,12],[1,5,9,13],[2,6,10,14])
            for e in (operator.sub, operator.add))
            for f in (om.MFloatMatrix(g.inclusiveMatrixInverse()) * h.projectionMatrix() * h.postProjectionMatrix()
            for g, h in izip(camPaths, camFns)))
            for i in a]

        # Record visible entities
        def search(node):
            # Break if no checks needed.
            name = node.fullPathName()
            if scene[name] == FULL_VIS: return

            # Check if in cameras view
            bbox = om.MFnDagNode(node).boundingBox
            bbox = [bbox.min * node.exclusiveMatrix(), bbox.max * node.exclusiveMatrix()]
            full_vis = True
            for plane in planes:
                near = om.MVector(*(bbox[plane[a] > 0][a] for a in xrange(3)))
                far = om.MVector(*(bbox[plane[a] <= 0][a] for a in xrange(3)))
                normal = om.MVector(*plane[:3])
                if near * normal + plane[3] <= 0: return
                if full_vis and far * normal + plane[3] < 0: full_vis = False
            if full_vis: scene[name] = FULL_VIS; return
            scene[name] = PART_VIS

            # Descend to children
            for child in nodeFilter(om.MDagPath.getAPathTo(node.child(a))
            for a in xrange(node.childCount())): search(child)

        # Loop objects
        tmp = om.MSelectionList()
        for a in cmds.ls(assemblies=True, l=True): tmp.add(a)
        for node in nodeFilter(tmp.getDagPath(a) for a in xrange(tmp.length())): search(node)

    # Add elements to displayLayer and turn off visibility
    cmds.editDisplayLayerMembers(layer, *(a for a in scene if scene[a] == NO_VIS))
    cmds.setAttr("%s.lod" % layer, 1)
    cmds.setAttr("%s.v" % layer, 0)
main()
{% endhighlight %}

<script src="https://gist.github.com/internetimagery/c4a0d57c6afa8177fd4b53baf07aecff.js"></script>
