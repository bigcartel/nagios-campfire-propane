 if [ ! -f ~/Library/Application\ Support/Propane//styles/cf_chat.css.original ]; then
	echo "Saving current cf_chat.css as backup";
	cp ~/Library/Application\ Support/Propane/styles/cf_chat.css ~/Library/Application\ Support/Propane/styles/cf_chat.css.original
fi

echo "Updating cf_chat.css";
curl -s https://raw.github.com/bigcartel/nagios-campfire-propane/master/nagios.css | cat ~/Library/Application\ Support/Propane/styles/cf_chat.css.original - > ~/Library/Application\ Support/Propane/styles/cf_chat.css 

echo "Updating caveatPatchor.js";
curl -s https://raw.github.com/bigcartel/nagios-campfire-propane/master/caveatPatchor.js > ~/Library/Application\ Support/Propane/unsupported/caveatPatchor.js