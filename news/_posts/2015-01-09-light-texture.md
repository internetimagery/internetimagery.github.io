---
title: Light Texture
layout: post
thumb: /img/posts/studio_light.jpg
---

A seemingly obscure but really awesome technique to light your shots is found in the render setting "Final Gather" allowing you to light your scene as though you were using studio lighting. Using little more than a dome of light, a shot can be lit with amazingly soft clean shadows.

This script automates the process of setting it up!

<div class="js-video [vimeo, widescreen]"><iframe width="420" height="315" src="//www.youtube.com/embed/4zGCICXDC0o" frameborder="0" allowfullscreen></iframe></div>


Simply copy and paste the below code into a new shelf icon (PYTHON) and there you have it. Select an object (or objects) you wish to turn into lights (spheres cut in quarters work well) and it will ask you to change your render settings if you so choose. You will need to do so in order for the render to work properly, but you can opt to not let the script do that for you, and do it yourself however you wish.

----
{% highlight python %}
import maya.cmds as cmds
import maya.mel as mel
#turn object into final gather light
class lambert(object): #create material
    def __init__(self, name):
        self.mat = cmds.shadingNode( "lambert", asShader=True, n=name )#make a new material
    def assign(self, obj):#add material to object
        if obj and cmds.objExists( obj ):
            cmds.select( obj )
            cmds.hyperShade( a=self.mat )
        return self
    def connect(self, at):
        cmds.connectAttr( "%s.ir" %obj, at, f=True )
        cmds.connectAttr( "%s.ig" %obj, at, f=True )
        cmds.connectAttr( "%s.ib" %obj, at, f=True )
        return self
    def name(self):
        return self.mat
class math_node(object):
    def __init__(self):
        self.node = cmds.shadingNode( "multiplyDivide", au=True )
    def connect_in(self, R1, G1, B1, R2, G2, B2 ):
        cmds.connectAttr( R1, "%s.i1x" %self.node, f=True )
        cmds.connectAttr( G1, "%s.i1y" %self.node, f=True )
        cmds.connectAttr( B1, "%s.i1z" %self.node, f=True )
        cmds.connectAttr( R2, "%s.i2x" %self.node, f=True )
        cmds.connectAttr( G2, "%s.i2y" %self.node, f=True )
        cmds.connectAttr( B2, "%s.i2z" %self.node, f=True )
        return self
    def connect_out(self, R, G, B ):
        cmds.connectAttr( "%s.ox" %self.node, R, f=True )
        cmds.connectAttr( "%s.oy" %self.node, G, f=True )
        cmds.connectAttr( "%s.oz" %self.node, B, f=True )
        return self
def add_attr( obj, ln, sn, dv ): #safely add attribute
    if not cmds.objExists( "%s.%s" % (obj, sn) ):
        cmds.addAttr( ln=ln, sn=sn, at= "float", k=True, dv=dv )
sel = cmds.ls(sl=True) #grab selection
if sel:
#set up render settings
    mental_ray = "Mayatomr" in cmds.pluginInfo( query=True, listPlugins=True )
    if cmds.getAttr("defaultRenderGlobals.enableDefaultLight") or not cmds.getAttr(	"defaultRenderGlobals.ren") == "mentalRay" or not mental_ray:
        if not mental_ray:
            cmds.loadPlugin('Mayatomr', qt=True) #load mental ray
        #set default render options. No default lights and final gather on
        if cmds.confirmDialog(  t='Render settings could use a tweak.',
                                    m="Would you like me to turn off Global Lighting and 	enable Final Gather?",
                                    b=["Yes please", "No don't do that"],
                                    db="Yes please",
                                    cb="No don't do that") == "Yes please":
            cmds.setAttr("defaultRenderGlobals.enableDefaultLight", 0)
            cmds.setAttr('defaultRenderGlobals.ren', 'mentalRay', type='string')
            if not cmds.objExists( "miDefaultOptions" ):
                mel.eval( "miCreateDefaultNodes" )
            cmds.setAttr('miDefaultOptions.finalGather', 1)
            #cmds.setAttr('miDefaultOptions.finalGatherRebuild', 0) #reduce flickering in 	animation
    for obj in sel:
        mat = lambert("FG_light").assign(obj) #create material
        cmds.select(obj)
        add_attr( obj, "light_R", "ltr", 1)
        add_attr( obj, "light_G", "ltg", 1)
        add_attr( obj, "light_B", "ltb", 1)
        add_attr( obj, "light_brightness", "ltbr", 2)
        math_node().connect_in( "%s.ltr" %obj,
                                "%s.ltg" %obj,
                                "%s.ltb" %obj,
                                "%s.ltbr" %obj,
                                "%s.ltbr" %obj,
                                "%s.ltbr" %obj).connect_out( "%s.ir" %mat.name(),
                                                             "%s.ig" %mat.name(),
                                                             "%s.ib" %mat.name())
        cmds.connectAttr( "%s.ltr" %obj, "%s.cr" %mat.name(), f=True )
        cmds.connectAttr( "%s.ltg" %obj, "%s.cg" %mat.name(), f=True )
        cmds.connectAttr( "%s.ltb" %obj, "%s.cb" %mat.name(), f=True )
        shapes = cmds.listRelatives( obj , s=True) #get shape node to hide it
        for shape in shapes:
            cmds.setAttr( "%s.motionBlur" %shape, 0)
            cmds.setAttr( "%s.smoothShading" %shape, 0)
            cmds.setAttr( "%s.primaryVisibility" %shape, 0)
            cmds.setAttr( "%s.receiveShadows" %shape, 0)
            cmds.setAttr( "%s.castsShadows" %shape, 0)
            cmds.setAttr( "%s.visibleInReflections" %shape, 0)
            cmds.setAttr( "%s.visibleInRefractions" %shape, 0)
            cmds.setAttr( "%s.doubleSided" %shape, 1)
        #add object to layer
        layer = "FG_lights"
        if not cmds.objExists(layer):
            cmds.createDisplayLayer( e=True, n=layer )
        cmds.editDisplayLayerMembers( layer, obj )
    cmds.select( sel )
else:
    cmds.confirmDialog(t='Whoops.', m="You need to select something.")
{% endhighlight %}
----