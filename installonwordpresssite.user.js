// ==UserScript==
// @name         Install on WordPress site
// @namespace    https://wiidatabase.de
// @version      1.0
// @description  Adds a button to WordPress Plugins site where you can install a plugin on your site
// @author       Brawl345

// @match        https://wordpress.org/plugins/*
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// ==/UserScript==

// Initialize GM_config
const iframestyle = 'height: 30%; max-height: 440px; top: calc(50% - 215px); width: 300px; left: calc(50% - 150px); border: 1px solid #000; border-radius: 4px; margin: 0px; opacity: 1; overflow: auto; padding: 0px; position: fixed; z-index: 9999; display: block; right: auto; bottom: auto;';
GM_config.init(
    {
        'id': 'InstallOnWordPressSite', // The id used for this instance of GM_config
        'title': 'Settings', // Panel Title
        'fields': {
            'WordPressSite': {
                'label': 'URL to WordPress site (without /wp-admin)', // Appears next to field
                'type': 'text', // Makes this setting a text field
                'default': 'https://example.com' // Default value if user doesn't change it
            }
        },
        'events': {
            'save': function() { apply(); },
        }
    });

// Get plugin name and site url
const pluginName = window.location.pathname.split('/')[2];
var siteURL = GM_config.get('WordPressSite');

// Create install button
var installButton = document.createElement('a');
installButton.id = 'InstallOnWordPressSite_InstallButton';
installButton.classList.add('plugin-download', 'button', 'download-button', 'button-large');
installButton.setAttribute('href', siteURL + '/wp-admin/plugin-install.php?tab=plugin-information&plugin=' + pluginName);
installButton.setAttribute('target', '_blank');
installButton.text = 'Install';

// Append install button to download button along with whitespace
var dlButton = document.getElementsByClassName('plugin-download')[0];
if (typeof dlButton === "undefined") {
    return;
}
var dlButton = dlButton.parentNode.insertBefore(document.createTextNode("\u00A0"), dlButton.nextSibling);
dlButton.parentNode.insertBefore(installButton, dlButton.nextSibling);

// If config is saved, change button URL
function apply() {
    const pattern = new RegExp('^https?:\/\/.*\/?$');
    var siteURL = GM_config.get('WordPressSite');

    // Simple test to check if URL is valid
    if(!pattern.test(siteURL)) {
        alert("Please enter a valid URL.");
        GM_config.reset();
        GM_config.write();
        return false;
    } else {
        var newSiteURL = siteURL.replace(/\/+$/, ""); // remove trailing slash
        installButton.setAttribute('href', newSiteURL + '/wp-admin/plugin-install.php?tab=plugin-information&plugin=' + pluginName);
        GM_config.set('WordPressSite', newSiteURL);
        GM_config.write();
        GM_config.close();
    }
}

// Register config
function openconfig() {
    GM_config.open();
    InstallOnWordPressSite.style = iframestyle;
}
GM_registerMenuCommand('Set WordPress Site URL', openconfig, "w");