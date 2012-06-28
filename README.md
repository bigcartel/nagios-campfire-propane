# nagios-campfire-propane
=======================

Notification script to send alerts to a campfire room and a modification script for Propane to make them beautiful.
This works by adding a caveatPatchor.js script and modifying the cf_chat.css file, saving the original.

## Installation

Install the Propane javascript and stylesheets by going to a terminal as your normal user:

    curl https://raw.github.com/bigcartel/nagios-campfire-propane/master/install.sh | bash

Install the 'tinder' gem:

    gem install tinder

Configure the commands in your nagios commands.cfg or wherever the appropriate place is:

    # 'notify-host-by-campfire' command definition
    define command{
      command_name    notify-host-by-campfire
      command_line    /usr/bin/printf "%b" "type:$NOTIFICATIONTYPE$\nhost:$HOSTNAME$\nstate:$HOSTSTATE$\naddress:$HOSTADDRESS$\nduration:$HOSTDURATIONSEC$\nnumber:$HOSTNOTIFICATIONNUMBER$\ninfo:$HOSTOUTPUT$" | /usr/bin/ruby $USER1$/notify-by-campfire -r <room>  -s <subdomain> -t <token>
    }   

    # 'notify-service-by-campfire' command definition
    define command{
      command_name    notify-service-by-campfire
      command_line    /usr/bin/printf "%b" "type:$NOTIFICATIONTYPE$\nhost:$HOSTALIAS$\nstate:$SERVICESTATE$\nservice:$SERVICEDESC$\nduration:$SERVICEDURATIONSEC$\nnumber:$SERVICENOTIFICATIONNUMBER$\ninfo:$SERVICEOUTPUT$" | /usr/bin/ruby $USER1$/notify-by-campfire -r <room>  -s <subdomain> -t <token>
    }

Configure the contact template to notify via campfire

    define contact{
      name                            campfire-contact
      service_notification_period     24x7
      host_notification_period        24x7
      service_notification_options    w,u,c,r,f,s
      host_notification_options       d,u,r,f,s
      service_notification_commands   notify-service-by-campfire
      host_notification_commands      notify-host-by-campfire
      register                        0
    }

And then set it up like anything else is set up, should be fine.
    
## Notes

We use this internally and since there can only be one caveatPatchor.js script at a time,
this also includes a module to display CloudApp images inline which is on by default, and a module to
show the Basecamp Avatar, which is off by default.