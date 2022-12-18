CS193X Final Project: SL Helper 
====================
NOTE: As of Dec 18, I am currently working on deploying this correctly - this project is from close to a year ago 

Overview
--------
The SL Helper has a few tools that could help with CS106 section leading to keep everything organized in one place. The site is broken down into 3 parts: a teaching helper, an assignment grading helper, and a LAIR helper.

It is hosted here: https://cs198-sl-helper.herokuapp.com/


Running
-------
There is a 500mb limit so please don't try to upload images too large of a size. I also have some pre mongodb stuff that should be there.

I also have two collections but didn't how to put that in one js file so I have output.js for teach and output2.js for grade.s

Features
--------
Teaching helper:
* form where users can create cards with a photo of their practice teaching whiteboard, links to handout/solutions for reference, notes
* cards can be deleted (hover over the card)

Grading helper:
* form where users can add comments
* copy the comment to clipboard by pressing the copy button
* can view comments for only for that week using the View dropdown


Special notes:
* all forms can be minimized with the small black bar! 

Misc notes:
-------------
I was planning on having an edit option (I was going to turn the text into text areas, transfer the information, and then use PATCH) but I ran out of time. I commented out the edit button on the HTML.

I also planned on having a LAIR (debugger) helper consisting of:
* form where users can upload a photo, notes, and code (using a code editor!)
* feature to view cards only for that class using the View dropdown
* button that displays a whiteboard

I had made the HTML/CSS of the LAIR helper, including a working code text editor that used CodeJar, but didn't have enough time to fully implement the JS so I took it out. I left the HTML/CSS and JS for the code text editor in my project if you guys want to see it, but I just commented it out.
