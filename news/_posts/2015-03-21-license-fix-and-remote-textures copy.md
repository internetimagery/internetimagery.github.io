---
title: License Fix and Remote Textures
layout: post
thumb: /img/posts/web-hosting-reviews.png
---

I've had some time, and what better way to spend it than filling some small annoying holes in Maya workflow (actually I'm sure there are many better things to do, yet here we are).

First up...

### License Fix

Ever play around with file referencing? If not, you really should. It's a great workflow... However there is one caveat. If you're running the student version of Maya, you get one of those student popups for each and every file referenced in. 

>Ideally Maya would throw a SINGLE popup if ANY of the files, in use or referenced were used by students.

So this is where this script comes in. You can't prevent the popup entirely (go buy the full version!) but you can prevent it from firing on each and every referenced file.

This script alters the license on each save. So when you save and leave the file. Then reference it in, it no longer is treated as a student file.

#### Install

* First things first. __DOWNLOAD THE SCRIPT FROM HERE: <download>license_fix</download>]__.
* Unzip the file (license_fix) and move it into your scripts directory.
* Create a shelf icon with the following _PYTHON_ code:

{% highlight python %}
import license_fix
{% endhighlight %}

Then simply click your shelf button when you load up Maya. The script will run in the background until you next close maya. :)

### Remote Textures

Sometimes you find an image online you really need in your scene. Or you're intentionally looking for an image for that very purpose. This script saves the hassle of downloading the image yourself, moving it to a location outside your downloads folder, and setting it up.

Same steps as above...

* __DOWNLOAD THE SCRIPT HERE: <download>remote_texture</download>__
* Unzip the file (remote_texture) and place it in your scripts directory.
* Create a shelf icon with the following code:

{% highlight python %}
import remote_texture
{% endhighlight %}

Click the shelf icon to set the script running. This one also will continue to run in the background until maya is shut down.

* To use it, simply find yourself an image online.
* Copy the web address (it will end with .jpg .png etc).
* Edit your texture, or create a new one. Pasting the website into the filename for the texture.

<div class="js-video [vimeo, widescreen]"><iframe width="420" height="315" src="https://www.youtube.com/embed/Q5piSnQkePA" frameborder="0" allowfullscreen></iframe></div>

Have fun taking all the images!!
