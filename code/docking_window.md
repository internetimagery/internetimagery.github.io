---
title: Docking Window Template
layout: page
navigation: false
---
## Docking Window Template (Maya)

As it took me a little while to get to grips with the intricacies of the Maya dock. Especially getting windows to close properly.

So take this Template. Tweak it to your liking and make some awesome stuff!


{% highlight python %}
# Dockable window template
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

class MainWindow(object):
    """ Template for Dockable Window """
    def __init__(s):
        title = "My Window" # Title of the window

        win_name = "mywin" # name of dock gui element
        if cmds.dockControl(win_name, ex=True):
            cmds.deleteUI(win_name)

        win = cmds.window(title=title, rtf=True, s=False)
        cmds.columnLayout(adjustableColumn=True)
        cmds.button(l='Click Me', h=25, c=s.button_click) # Test Button
        allowed_areas = ['right', 'left'] # Limit to left / right
        s.dock = cmds.dockControl(win_name, a='left', content=win, aa=allowed_areas, fl=True, l=title, fcc=s.move_dock, vcc=s.close_dock)

        s.get_location()
        if s.location == 'float':
            cmds.dockControl(s.dock, e=True, fl=True)
        elif s.location in allowed_areas:
            cmds.dockControl(s.dock, e=True, a=s.location)

    def button_click(s, *_):  # Button Test
        if cmds.confirmDialog(title='How Amazing!', message="Did you click the button?") == 'Confirm':
            print "Button Clicked"

    def move_dock(s):  # Update dock location information
        if cmds.dockControl(s.dock, q=True, fl=True):
            s.set_location("float")
            print "Floating Dock."
        else:
            area = cmds.dockControl(s.dock, q=True, a=True)
            s.set_location(area)
            print "Docking %s." % area

    def close_dock(s, *loop):
        visible = cmds.dockControl(s.dock, q=True, vis=True)
        if not visible and loop:
            cmds.scriptJob(ie=s.close_dock, p=s.dock, ro=True)
        elif not visible:
            cmds.deleteUI(s.dock, control=True)
            print "Window closed."

    def get_location(s):
        s.location = "float"  # You can replace this with code that loads persistant data

    def set_location(s, location):
        s.location = location  # You can replace this with code that saves persistant data

MainWindow()
{% endhighlight %}
