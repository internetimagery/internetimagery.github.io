---
title: Clean Constraints
layout: post
thumb: /img/posts/duster.png
---

Constraints can be confusing, and damn are they annoying and unintuitive!
So here is an effort to clean things up and hopefully make constraining a little more logical and easy.

This script attempts to consolidate the constraint weights and blend parents into a single switcher.<!-- more -->

<div class="js-video [vimeo, widescreen]"><iframe width="420" height="315" src="//www.youtube.com/embed/0qxEGJ4gNOc" frameborder="0" allowfullscreen></iframe></div>

#### How do I use it?!

To use it, copy the below and paste it into a new shelf button as a PYTHON script. Then set up your constraints, and select the object with constraints on it. Press your new shelf button and watch the magic happen!

----
{% highlight python %}
# simplify constraint setup
import maya.cmds as cmds
import re
# create condition node
class condition(object):
	#create node
	def __init__(self):
		self.node = cmds.shadingNode( "condition", au = True)
		cmds.setAttr( "%s.ctr" % self.node, 1) #set TRUE to be 1
		cmds.setAttr( "%s.cfr" % self.node, 0) #set FALSE to be 0
	#set condition value
	def set_value(self, value):
		cmds.setAttr( "%s.secondTerm" % self.node, value )
		return self
	#connect input
	def connect_in(self, into):
		cmds.connectAttr( into, "%s.ft" % self.node, f=True )
		return self
	#connect output
	def connect_out(self, out):
		cmds.connectAttr( "%s.ocr" % self.node, out, f=True )
		return self
# create clamp node
class clamp(object):
	#create node
	def __init__(self):
		self.node = cmds.shadingNode( "clamp", au = True)
		cmds.setAttr( "%s.mxr" % self.node, 1) #set MAX to be 1
	#connect input
	def connect_in(self, into):
		cmds.connectAttr( into, "%s.ipr" % self.node, f=True )
		return self
	#connect output
	def connect_out(self, out):
		cmds.connectAttr( "%s.opr" % self.node, out, f=True )
		return self
# warning message
def message(mess):
	cmds.confirmDialog(t='Yeah, nah bro.', m=mess)
# get working!
sel = cmds.ls(sl=True)
if len(sel) == 1:
	sel = sel[0]
	for at in ["translate", "rotate"]: #add keyframe if none to force a pairBlend
		if not cmds.keyframe( sel, at= at, q=True ):
			cmds.setKeyframe( sel, at=at )
	blend_reg = re.compile("pairBlend[0-9]+") #regex for getting the blendparent node
	const_reg = re.compile("_[a-z]+Constraint[0-9]+")# check contraint is there
	opt = {} #menu options - different constraints
	children = cmds.listRelatives( sel, typ="transform")
	if children:
		for child in children: #find constraint
			if const_reg.search( child ):
				attr = cmds.listConnections( child, p=True, c=True) #find pairBlend
				for at in attr:
					if blend_reg.search( at ):
						opt.setdefault("nothing", set()).add(cmds.listConnections("%s.w" % at.split(".")[0], p=True, d=False )[0])
				for node in cmds.listAttr( child, sn= True, st="w*", k=True ): #grab the constraint attributes
					attr = "%s.%s" % (child, node)
					opt.setdefault(cmds.attributeName(attr, l=True )[0:-2], set()).add(attr)
		if opt: #we now have our connection information
			dropdown_opt = sorted(list(set(opt.keys()))) # create list of possible connections
			dropdown_opt.insert(0, dropdown_opt.pop(dropdown_opt.index("nothing"))) #make sure animation is first
			if cmds.objExists( "%s.atch" % sel ): #create or update the drop down button
				old_keys = cmds.keyframe( sel, at="atch", q=True ) #update keyframes
				old_opt = cmds.addAttr( "%s.atch" % sel, q=True, en=True).split(":")
				if old_keys:
					print "Updating keyframes..."
					old_new = {}
					for old in old_opt:
						try:
							old_new[old_opt.index(old)] = dropdown_opt.index(old)
						except ValueError:
							old_new[old_opt.index(old)] = "remove" #constraint was removed, mark for removal
					for key in old_keys:
						old_val = cmds.keyframe( sel, at="atch", t=(key,key), q=True, vc=True)[0]
						new_val = old_new[int(old_val)]
						if new_val == "remove":
							cmds.cutKey( sel, at="atch", cl=True, t=(key,key))
						else:
							cmds.keyframe( sel, at="atch", e=True, t=(key,key), vc=new_val )
				cmds.addAttr( "%s.atch" % sel, e=True, en= ":".join(dropdown_opt) )
			else:
				cmds.addAttr( ln= "attach_to", sn="atch", k=True, at="enum", en= ":".join(dropdown_opt) )
			for i in range(len(dropdown_opt)): #connect up our items
				if i: #set up constraints
					for link in opt[dropdown_opt[i]]:
						condition().set_value(i).connect_in("%s.atch" % sel).connect_out(link)
				else: #set up blend node
					for link in opt[dropdown_opt[i]]:
						clamp().connect_in("%s.atch" % sel).connect_out(link)
			cmds.select(sel)
		else:
			message("Cannot find the constraint.\nEnsure the constraint is under the object in the outliner.")
	else:
		message("Cannot find the constraint.\nEnsure the constraint is under the object in the outliner.")
else:
	message("You can only select one object at a time.")
{% endhighlight %}
----
