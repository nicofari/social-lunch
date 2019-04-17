Social Lunch
============

This is a very simple webapp to help my collegues and me organize our lunch at a nearby restaurant.
I've created it initially in **Glitch** ([about Glitch](https://glitch.com/about).
Then I moved it to github.

Purpose
-------

Everyday we go for lunch to a nearby restaurant. Every day the restaurant waitress would like to know how many are we (because some of us are not able to come to the restaurant every day, so the group change every day).
We don't usually talk to each other in the morning (we work in separated rooms) and, on the other hand, don't have a whatsapp group or anything similar.
So the idea of a webapp came to my mind.
The structure is very simple: just a single html form initially composed by only two input fields (name and date) and two button, one to subscribe, and one to print out the subscribers list.
I deployed the project on heroku, and sent the link to all interested collegues and to the restaurant waitress.
In the morning people who think to join the group lunch subscribes entering the name (the date is prefilled with the current date).
The restaurant check the number of people using the "list" button.
In this way the lunch is organized.

Technology
----------
At start I saw this project as a way to experiment with heroku, github, airtable and other cloud services.
I've started with a simple Node js backend coupled with a plain js - html frontend.
The only library included was, at the beginning, Axios, used to leverage the Airtable Api.


