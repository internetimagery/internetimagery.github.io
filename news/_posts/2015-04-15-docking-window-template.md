---
title: Docking Window Template
layout: post
thumb: /img/posts/dock_window.jpg
---

I've been making a few Maya scripts here and there. Cobbling together code from various google searches and figuring things out on my own. There were a number of aspects to Docking windows I never found online and had to figure out myself. So I've made a template to get started.

There are a few tricks in here. Such as keeping windows from doubling up, and ensuring the docked window closes itself like a regular window. But you don't have to worry about that. :)

Just chuck the below code into your script and play around.

###Quick Start Template

####[You can find the most up to date code here...](https://gist.github.com/internetimagery/dd0959a19e5fe9e0a8cf)

{% highlight python %}
##############################################
# Dockable window template
# Created: 15/4/15
# Jason Dixon (jason.dixon.email[AT]gmail.com)
##############################################
import maya.cmds as cmds
from functools import wraps
import sys


def unique(item):
    """
    Only keep one window open at a time
    """
    items = {}
    
    @wraps(item)
    def UniqueItem(*args, **kwargs):
        if (item in items and sys.getrefcount(items[item]) < 3) or item not in items:
            items[item] = item(*args, **kwargs)
        return items[item]
    return UniqueItem


@unique
class MainWindow(object):
    """
    Main GUI Window
    """
    def __init__(self):
        self.GUI = {}  # Store GUI elements
        title = "My Window"

        self.GUI['window'] = cmds.window(title=title, rtf=True, s=False)
        self.GUI['layout1'] = cmds.columnLayout(adjustableColumn=True)
        self.GUI['button1'] = cmds.button(l='Click Me', h=25, c=self.ButtonClick)
        allowed_areas = ['right', 'left']
        self.GUI['dock'] = cmds.dockControl(a='left', content=self.GUI['window'], aa=allowed_areas, fl=True, l=title, fcc=self.moveDock, vcc=self.closeDock)

        self.getLocation()
        if self.location == 'float':
            cmds.dockControl(self.GUI['dock'], e=True, fl=True)
        elif self.location in allowed_areas:
            cmds.dockControl(self.GUI['dock'], e=True, a=self.location)

    def ButtonClick(self, button):  # Button Test
        if cmds.confirmDialog(title='How Amazing!', message="Did you click the button?") == 'Confirm':
            print "Button Clicked"

    def moveDock(self):  # Update dock location information
        if cmds.dockControl(self.GUI['dock'], q=True, fl=True):
            self.setLocation("float")
            print "Floating Dock."
        else:
            area = cmds.dockControl(self.GUI['dock'], q=True, a=True)
            self.setLocation(area)
            print "Docking %s." % area

    def closeDock(self, *loop):
        visible = cmds.dockControl(self.GUI['dock'], q=True, vis=True)
        if not visible and loop:
            cmds.scriptJob(ie=self.closeDock, p=self.GUI['dock'], ro=True)
        elif not visible:
            cmds.deleteUI(self.GUI['dock'], control=True)
            print "Window closed."

    def getLocation(self):
        self.location = "float"  # You can replace this with code that loads persistant data

    def setLocation(self, location):
        self.location = location  # You can replace this with code that saves persistant data

MainWindow()
{% endhighlight %}

There we have it. Hope it helps! :)