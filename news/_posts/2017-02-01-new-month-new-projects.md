---
title: New month, New projects
layout: post
thumb: /img/posts/folder_process.jpg
---

Having kids puts a lot of importance on photos. I want to ensure they last a long time. Knowing how to organize photos and back them up is an important piece of knowledge for anyone. Here is my take...

A quick backstory, ramble. I used to be an avid iPhoto user (it's a great program). But having since had to switch back to windows, I've discovered that migrating out of iPhoto and trying to find another photo organizer has proven to be annoying with slim pickings.

What is more, I want to ensure my photos are still organized years from now, when software will have long since changed. What to do?

So below I'm going to outline the steps I've taken to storing photos, both for my benefit, and yours. Lets begin this journey!

### A good folder structure

So, since we're not going to be using any external photo organizing software. We are going to organize photos ourselves in a way that works using just the regular file system.

Most organizers use *dates and events* to organize things. This is what I suggest also. The first folder you see should be the year, and it should contain all media that was taken then. Some like to add the month after that, though I personally don't take enough photos to justify that many subsections.

Then we have *events*. Holidays. Weddings. Birthdays etc. We need this information as well, otherwise we'll have no idea what the dates really mean. This the "human readable" element.

> The most important thing about organizing photos, to my mind, is to ensure that each subfolder contains some info about the preceding folder. In this way, even a stranded picture knows where to go.

If I took a photo today, example of my suggested folder structure would be as follows.

```
2017 / 17-02-01 Example_photo / 17-02-01 Example_photo_01.jpg
```

You probably notice a lot of redundancy in this. This is intentional. What this does, is ensure that every folder and every photo has its place. If you somehow misplace a photo, or lose it and recover it. You know exactly where it goes. However it also allows you to search for metadata in the images in a similar way that actual photo organizers do. See below!

### Allow searching

One of the things we use photo organizers for, is to make it easier to search through photo metadata and find the needle in the haystack.

If I have a birthday I want to find, I should be able to search for it and see images all related to it. If I want to limit that search to a certain person at the birthday I should be able to do that also.

**WE CAN**

...and we can do it using nothing more than a smart folder structure and naming scheme.

As we saw above, we can sort out folders and images by naming them with the date first. But when we throw in the event name into the folder *and the enclosing images also share the name* then we can find the entire contents of the folder just by searching.

Let me show an example.

```
2016 / 16-03-03 Aarons Birthday / 16-03-03 Aarons Birthday_01.jpg
2016 / 16-03-03 Aarons Birthday / 16-03-03 Aarons Birthday_02.jpg
2016 / 16-03-03 Aarons Birthday / 16-03-03 Aarons Birthday_03.jpg
```

Here we have three photos using the folder structure above. If we were to search for "birthday" guess what pops up! Every image that has birthday in the name! If we wanted a specific birthday, we can search for "Aarons Birthday". If we wanted a specific year we can just perform the search in the correct folder ("2016"). Perfect!

Now lets take this a step further...

```
2016 / 16-03-03 Aarons Birthday / 16-03-03 Aarons Birthday_01[aaron mark].jpg
2016 / 16-03-03 Aarons Birthday / 16-03-03 Aarons Birthday_02[aaron].jpg
2016 / 16-03-03 Aarons Birthday / 16-03-03 Aarons Birthday_03[tom mark].jpg
```

What if we wanted to search for the *people* in the images. This is something only advanced photo organizers do, and still something we can easily pull off without anything other than names!

You see above we have some names in square brackets. If we were to search for "mark" we would find all images with mark in the brackets. If we were to search for "aarons birthday mark" we would get all photos of Mark at Aarons birthday. Perfect.

But that is tedious! How can I be expected to write peoples names in the photos?

Enter, [TAGSPACES](https://www.tagspaces.org/) https://www.tagspaces.org/

This wonderful software simplifies greatly the process of tagging files. Each and every tag gets placed on the file directly within square brackets (above) and you can save tags for use later!

Going through your photos and quickly tagging people inside them has never been easier! It's something done all the time on facebook, and now we're doing it in our personal photo library!

Naming and structuring files in this way lets us use every part of the file path to the fullest. It gives us almost every feature we lost by saying goodbye to dedicated photo organizers. Finally we can be sure that in 20+ years our photo system will still work 100%. No matter what software has come and gone in the meantime, and no matter if we are on linux, windows, apple, VR_OS.

### Automate the process

Ok so now we have this system in place. There are a couple of tedious elements that can be automated. Lets go over them really quick:

##### Face detection to tag photos automatically.

Unfortunately I don't yet have a solution to this one, but I am on the look out. If you see anything or have any ideas, let me know! *However* I don't believe you can do it without at least checking that the program chose the people to tag correctly. In which case, you might as well tag them manually. Takes the same time.

##### Naming photos to match their folder.

This one is much easier. All that needs to be done is to rename all images in a folder to match the folder name, and number them. For this I have made a small program: [Download it here](https://github.com/internetimagery/folder-process/releases/latest)

The program (pictured at the top of this page) is simple. Just drag and drop a folder full of images and it will perform the following:

* Rename files. Numbering them *and* retaining any tags within square brackets.
* Compress the images. Using Mozjpeg it will shrink the images without losing quality. We do this because it saves on size and cost when backing up later.
* Convert videos to h264. As this is the new standard, we can compress movies to a much smaller size without affecting the quality. Again, the reason for this is to save space in the long run.

### Backing up

Now that we have our well laid out photo library. We need to back it up! **YES KEEP BACKUPS!**

For this I have a useful tool I use and recommend. [RClone](http://rclone.org/) http://rclone.org/

It is a command line tool that works like rsync to copy across files that are new, or have changed, in order to keep the remote drive in sync. This is exactly what we need to keep a couple of backups.

Next we need to determine where and how we will be backing things up. It is a mistake to think you can leave photos on the phone / camera that took them and that they'll be safe.

##### 3 - 2 - 1 Backup Rule

A well known rule for backups [reads as the following:](http://blog.wisefaq.com/2010/01/05/backups-with-the-3-2-1-rule/)

* **3** Have three copies of all your data (photos etc)
* **2** Use two different *local* storage methods. External hardrive fits here.
* **1** Have at least one offsite backup. Online backup options work for this.

The easiest way I've found to do backups is to throw a little script in the photo folder that does backups. This way it's easy to get to when you are done naming photos, and it gets backed up with the photos themselves!

Thankfully rclone does it all!

```
rclone copy <input> <output>
```

##### Make all files read only

This step is not required... but I believe it's a good idea.

You do this so that you cannot accidently modify any photos at any stage. It isn't likely to happen, but as we're aiming for the long term, who knows what we (or someone else) might do one day.

A windows command to *read only* all files within a folder is the following (replace <folder> with the path to your photos)

```
attrib +R * /S
```

##### Local backup

To use rclone locally. You just need to plug in your external hard drive and run the above rclone code. Replacing <input> with the path to your photos, and <output> with the path to your backup. I will put a download to an example setup at the end of this **LONG** post.

##### Online backup

To backup online, you have many options and many questions to ask yourself. What do they cost? How reliable are they? How often will I access them?

Thankfully, rclone supports a large number of online options. Through the website you can find information on how to set up account credentials for backing up to the storage option of your choice (or more than one!)

Personally I chose [Amazon Glacier](https://aws.amazon.com/glacier/pricing/) and would recommend it. You access Glacier through Amazon S3 (using rclone!).

Its advantage is in its extremely cheap pricing, and its limitless storage. You pay for what you use. It also is extremely safe. To quote their website:

> Amazon Glacier provides a highly durable storage infrastructure designed for long-term data archival storage. It is designed to provide average annual durability of 99.999999999% for an archive.

The disadvantages with it, is the delay and potential cost involved in retrieving data. This is a real backup in the truest sense. One that I hope I will never have to access, but I'm glad it is there!

### Conclusion

So that's it!

We have a process of naming and organizing our photos. If your friend uses the same organizational system, and they give you a photo. You can insert it into your system easily, as you know exactly where it should go (based on name).

We can search for whatever we want within our images / movies. Even after we have years of photos, numbering in the tens of thousands we can still find what we want.

We have a means of compressing the images and videos so our storage costs remain low.

We have resilient backups and peace of mind that our memories will be there in years to come.

Thanks for coming on this journey! I hope this inspired you!
