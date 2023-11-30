# Child Guard Chrome Extension

# Overview

Child Guard is a Chrome extension designed to help parents or guardians manage and control the content their child can access on the internet. 
The extension allows users to block specific URLs or hostnames, redirecting the user to a 404 page when attempting to access a blocked site.

# Features

- Add URLs to the blocklist
- Display a customizable 404 page when accessing a blocked URL
- Real-time update of blocked URLs
- User-friendly popup interface

# Installation

1. Clone or download this repository to your local machine.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" at the top right.
4. Click on "Load unpacked" and select the directory where you cloned/downloaded the extension.

# Usage

# Popup Interface

1. Click on the Child Guard icon in the Chrome toolbar to open the popup.
2. Enter the URL you want to block in the input field.
3. Click the "Block" button to add the URL to the blocklist.

# Managing Blocked URLs

- To remove a blocked URL, click the delete button (X) next to the URL in the popup.

# Background Process

- The extension runs in the background and actively monitors the URLs visited in open tabs.
- If a visited URL is in the blocklist, the extension redirects the user to a 404 page.

# Structure

- `background/background.js`: Manages background processes and tab updates.
- `popup/popup.html`, `popup/style.css`, `popup/popup.js`: Popup interface for user interaction.
- `404page.html`: Customizable 404 page displayed for blocked URLs.
- `scripts/index.js`: Script for content script communication.
- `manifest.json`: Chrome extension manifest file.

# Web Accessible Resources

- `404page.html` is made accessible to content scripts for redirection.

# Permissions

- `storage`: Required to store and retrieve blocked URLs.
- `activeTab`, `tabs`: Used for monitoring and updating tab URLs.

# Author

Onaiterimoh Victor Idepe 
(Movicks)
