---
title: Shot Pieces
layout: post
thumb: /img/posts/map.jpg
---
The maya script, Shot Pieces.

Sometimes you want to jump around your shot to work on, or isolate certain sections. This script provides an interface to save and retrieve different timeline selections.<!-- more -->

#### You can download the script here: <download>shot_pieces</download>

Download the above script. Drag and drop it into the Maya viewport to install.

Either use the provided shelf button, or create a shelf icon with the following:

{% highlight python %}
import shot_pieces
shot_pieces.GUI()
{% endhighlight %}

### HOW TO USE IT

<div class="js-video [vimeo, widescreen]"><iframe width="420" height="315" src="//www.youtube-nocookie.com/embed/9TS-JMb7imk?rel=0" frameborder="0" allowfullscreen></iframe></div>

Upon running the above code a simple GUI will pop up. It has one button.

Press the button.

A new window will pop up allowing you to create a new selection.

* Fill in the first box with a description of what your selection is going to hold. ie: Guy falls down.

* Fill in the two number boxes below corresponding to the frame range you wish to use.

* Alternatively you can click the "Get from Selection" button to auto fill it. It will use your selection if you have highlighted the timeline (shift drag) otherwise it will use the range you're looking at.

* The next button lets you choose a colour for the selection button. Clicking will prompt you to choose a colour.

* Create the selection with the final button.

You now have a selection in the GUI. Click it to change the timeline range to the selection.

Right click on the buttons to edit or delete them.

### Some additional notes...

If you look in the outliner, you'll spot a new object titled "Shot_Pieces_Data". This is where the selections are stored for the scene (they will be saved with the scene). If you wish to delete all selections, you can simply delete this item and they'll be gone.

The buttons will size themselves slightly bigger or smaller depending on the range of selection. So larger selections will have visibly bigger buttons.

You can dock the main window on either side of the main viewport if you like. Which keeps it handy and out of the way.
