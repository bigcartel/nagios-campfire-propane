# nagios-campfire-propane
=======================

Notification script to send alerts to a campfire room and a modification script for Propane to make them beautiful.
This works by adding a caveatPatchor.js script and modifying the cf_chat.css file, saving the original.

## Installation

Install the Propane javascript and stylesheets by going to a terminal as your normal user:

    curl https://raw.github.com/bigcartel/nagios-campfire-propane/master/install.sh | bash

## Notes

We use this internally and since there can only be one caveatPatchor.js script at a time,
this also includes a module to display CloudApp images inline which is on by default, and a module to
show the Basecamp Avatar, which is off by default.