---
title: Hotkeys
layout: page
---

# Custom Hotkeys I use

Here are some custom hotkeys for easy reference

####(=)
Adding an inbetween (note, this will take over "increase manipulator size", but that is ok).

    timeSliderEditKeys addInbetween;

----

####(-)
Remove inbetween. (note this will remove "decrease manipulator size" this will need to be redone).

    timeSliderEditKeys removeInbetween;

----

####(_)
remap decrease manipulator size. Found under Manipulators>DecreaseManipulator

----

####alt + (.)
Next frame. Without undo.

    undoInfo -stateWithoutFlush off;
    currentTime ( `currentTime -q` + 1 );
    undoInfo -stateWithoutFlush on;

----

####alt + (,)
Previous frame, without undo.

    undoInfo -stateWithoutFlush off;
    currentTime ( `currentTime -q` - 1 );
    undoInfo -stateWithoutFlush on;

----

####(.)
Next key without undo.

    undoInfo -stateWithoutFlush off;
    currentTime -edit `findKeyframe -timeSlider -which next`;
    undoInfo -stateWithoutFlush on;

----

####(,)

Previous key without undo.

    undoInfo -stateWithoutFlush off;
    currentTime -edit `findKeyframe -timeSlider  -which previous`;
    undoInfo -stateWithoutFlush on;

----






