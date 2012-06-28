/*
  As of version 1.1.2, Propane will load and execute the contents of
  ~Library/Application Support/Propane/unsupported/caveatPatchor.js
  immediately following the execution of its own enhancer.js file.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/

var displayAvatars = false;
var displayCloudAppImages = true;
var formatNagiosMessages = true;

/* 
  Format nagios messages appropriately based on what's going on
*/


if (formatNagiosMessages) {
  Object.extend(Campfire.Message.prototype, {
    toNagios: function() {
      if (this.actsLikeTextMessage()) {
        var author = this.authorElement(), author_html;
        var body = this.bodyElement(), body_html;

        if (this.author() == 'Nagios') {
          var data = [];
					if (this.bodyCell.textContent.match(/\$NAGIOS\$/)) {
						data = this.bodyCell.textContent.split("|");
					}
					// If there is no data, leave it alone
					if (data.length == 0) { return; }

					// Always show the author for our iconography
					author.show();

					if (data[1] == 'notification' && data.length == 7) {
	        	if (data[2] == '0') {
							var url = 'http://files.softicons.com/download/application-icons/32x32-free-design-icons-by-aha-soft/png/32/Ok.png', alt = 'Ok';
							this.bodyElement().parentNode.className += ' nagios_ok';
						} else if (data[2] == '1') {
							var url = 'http://files.softicons.com/download/application-icons/32x32-free-design-icons-by-aha-soft/png/32/Warning.png', alt = 'Warning';
							this.bodyElement().parentNode.className += ' nagios_warning';
						} else if (data[2] == '2') {
							var url = 'http://files.softicons.com/download/application-icons/32x32-free-design-icons-by-aha-soft/png/32/Danger.png', alt = 'Critical';
							this.bodyElement().parentNode.className += ' nagios_critical';
						} else {
							var url = 'http://files.softicons.com/download/application-icons/32x32-free-design-icons-by-aha-soft/png/32/Help.png', alt = 'Unknown';
							this.bodyElement().parentNode.className += ' nagios_unknown';
						}
						var author_html = '<img alt="'+alt+'" width="32" height="32" align="top" style="opacity: 1.0; margin-left: 5px; border-radius:3px" src="'+url+'"/>';
						var body_html = '<div class="nagios_subject">'+data[5]+' ('+data[4]+')</div><div class="nagios_message">'+data[6]+'</div><div class="nagios_time">- '+data[3]+'</div>';
					} else if (data[1] == 'summary') {
						var author_html = '<img alt="Information" width="32" height="32" align="top" style="opacity: 1.0; margin-left: 5px; border-radius:3px" src="http://files.softicons.com/download/application-icons/32x32-free-design-icons-by-aha-soft/png/32/Diagram.png"/>';
					}
					if (author_html) { author.update(author_html); }
					if (body_html) { body.update(body_html); }
        }
      }
    }
  });

  /* if you can wrap rather than rewrite, use swizzle like this: */
  swizzle(Campfire.Message, {
    setAuthorVisibilityInRelationTo: function($super, message) {
      $super(message);
      this.toNagios();
    }
  });


  /* defining a new responder is probably the best way to insulate your hacks from Campfire and Propane */
  Campfire.NagiosFormatter = Class.create({
    initialize: function(chat) {
      this.chat = chat;

			document.createStyleSheet('https://raw.github.com/bigcartel/nagios-campfire-propane/master/nagios.css');
      var messages = this.chat.transcript.messages;
      for (var i = 0; i < messages.length; i++) {
        var message = messages[i];
        message.toNagios();
      }

      this.chat.layoutmanager.layout();
      this.chat.windowmanager.scrollToBottom();
    },

    onMessagesInserted: function(messages) {
      var scrolledToBottom = this.chat.windowmanager.isScrolledToBottom();

      for (var i = 0; i < messages.length; i++) {
        var message = messages[i];
        message.toNagios();
      }

      if (scrolledToBottom) {
        this.chat.windowmanager.scrollToBottom();
      }
    }
  });

  /* Here is how to install your responder into the running chat */
  Campfire.Responders.push("NagiosFormatter");
  window.chat.installPropaneResponder("NagiosFormatter", "nagiosformatter");
}

/* 
  Display avatars in the chat view - based on code originally by @tmm1
*/

if (displayAvatars) {

  Object.extend(Campfire.Message.prototype, {
    addAvatar: function() {
      if (this.actsLikeTextMessage()) {
        var author = this.authorElement();
        var avatar = '';

        if (author.visible()) {
          author.hide();
          if (this.bodyCell.select('strong').length === 0) {
            this.bodyCell.insert({top: '<strong style="color:#333;">'+author.textContent+'</strong><br>'});
            avatar = author.getAttribute('data-avatar') || 'http://asset1.37img.com/global/missing/avatar.png?r=3';
            author.insert({after: '<img alt="'+this.author()+'" width="32" height="32" align="top" style="opacity: 1.0; margin-left: 5px; border-radius:3px" src="'+avatar+'">'});
          }
        }
      }
    }
  });

  /* if you can wrap rather than rewrite, use swizzle like this: */
  swizzle(Campfire.Message, {
    setAuthorVisibilityInRelationTo: function($super, message) {
      $super(message);
      this.addAvatar();
    }
  });


  /* defining a new responder is probably the best way to insulate your hacks from Campfire and Propane */
  Campfire.AvatarMangler = Class.create({
    initialize: function(chat) {
      this.chat = chat;

      var messages = this.chat.transcript.messages;
      for (var i = 0; i < messages.length; i++) {
        var message = messages[i];
        message.addAvatar();
      }

      this.chat.layoutmanager.layout();
      this.chat.windowmanager.scrollToBottom();
    },

    onMessagesInserted: function(messages) {
      var scrolledToBottom = this.chat.windowmanager.isScrolledToBottom();

      for (var i = 0; i < messages.length; i++) {
        var message = messages[i];
        message.addAvatar();
      }

      if (scrolledToBottom) {
        this.chat.windowmanager.scrollToBottom();
      }
    }
  });

  /* Here is how to install your responder into the running chat */
  Campfire.Responders.push("AvatarMangler");
  window.chat.installPropaneResponder("AvatarMangler", "avatarmangler");
}


/* 
  Display CloudApp images inline.

  This responder illustrates using Propane's requestJSON service to request 
  JSON from remote (non-authenticated) servers and have the results passed
  to a callback of your choosing.
*/

if (displayCloudAppImages) {

  Campfire.CloudAppExpander = Class.create({
    initialize: function(chat) {
      this.chat = chat;
      var messages = this.chat.transcript.messages;
      for (var i = 0; i < messages.length; i++) {
        this.detectCloudAppURL(messages[i]);
      }
    },

    detectCloudAppURL: function(message) {
      /* we are going to use the messageID to uniquely identify our requestJSON request
         so we don't check pending messages */
      if (!message.pending() && message.kind === 'text') {
        var links = message.bodyElement().select('a:not(image)');
        if (links.length != 1) {
          return;
        }
        var href = links[0].getAttribute('href');
        var match = href.match(/^https?:\/\/cl.ly\/[A-Za-z0-9]+\/?$/);
        if (!match) return;
        window.propane.requestJSON(message.id(), href, 'window.chat.cloudappexpander', 'onEmbedDataLoaded', 'onEmbedDataFailed');
      }
    },

    onEmbedDataLoaded: function(messageID, data) {
      var message = window.chat.transcript.getMessageById(messageID);
      if (!message) return;

      if (data['item_type'] === 'image') {
        var imageURL = data['content_url'];
        message.resize((function() {
          message.bodyCell.insert({bottom: '<div style="width:100%; margin-top:5px; padding-top: 5px; border-top:1px dotted #ccc;"><a href="'+imageURL+'" class="image loading" target="_blank">' + '<img src="'+imageURL+'" onload="$dispatch(&quot;inlineImageLoaded&quot;, this)" onerror="$dispatch(&quot;inlineImageLoadFailed&quot;, this)" /></a></div>'});
        }).bind(this));
      }
    },

    onEmbedDataFailed: function(messageID) {
      /* No cleanup required, we only alter the HTML after we get back a succesful load from the data */
    },

    onMessagesInsertedBeforeDisplay: function(messages) {
      for (var i = 0; i < messages.length; i++) {
        this.detectCloudAppURL(messages[i]);
      }
    },

    onMessageAccepted: function(message, messageID) {
      this.detectCloudAppURL(message);
    }
  });

  Campfire.Responders.push("CloudAppExpander");
  window.chat.installPropaneResponder("CloudAppExpander", "cloudappexpander");
}
