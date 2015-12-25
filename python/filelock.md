---
title: File Lock
layout: page
---
## File Lock

Working in a team is great. Version control distributed systems also. However sometimes it's just simpler to work in a shared environment, such as a local network or dropbox.

The problem with such a setup is that, in the situation two people might open the same file at the same time and work on it. Anyone saving the file will overwrite the other persons work entirely!

This tool runs in the background "locking" a file while in use. If someone tries to open the file while it is in use they will be presented with a warning message.

To install, download the following file and drag - drop it into Maya's viewport.

__<download>filelock</download>__

The tool will begin to run in the background. There is nothing more to do. :)


__TIPS:__

* While you are working on a file, a new file (with the same name, plus ".lock" extension) will be created. Don't worry about it. It will be gone when you close the file. So long as the file is shared to everyone, your scene will be safe.
