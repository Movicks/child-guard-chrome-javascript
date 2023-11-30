chrome.runtime.onInstalled.addListener(function () {
  console.log('Extension Installed');
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'addUrl') {
    const url = request.url;

    // Use Chrome Storage API to store the URL
    chrome.storage.local.get({ urls: [] }, function (result) {
      const urls = result.urls || [];
      urls.push(url);

      chrome.storage.local.set({ urls: urls }, function () {
        if (chrome.runtime.lastError) {
          console.error('Error saving URL:', chrome.runtime.lastError);
        } else {
          console.log('URL added:', url);
        }
      });
    });
  }
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (tab.active && changeInfo.url && changeInfo.url !== 'chrome://newtab/') {
    const currentURL = changeInfo.url;

    // Check if the current URL matches any blocked URL
    chrome.storage.local.get({ blockedURLs: [] }, function (result) {
      const blockedURLs = result.blockedURLs || [];

      const isBlocked = blockedURLs.some(blockedURL => currentURL.includes(blockedURL));

      if (isBlocked) {
        // Update the tab with the 404 page
        chrome.tabs.update(tabId, { url: '404page.html' });
      } else {
        // Display the current tab's contents
        chrome.tabs.sendMessage(tabId, { action: 'displayContents' }, function (response) {
          if (chrome.runtime.lastError) {
            console.error('Error sending message to content script:', chrome.runtime.lastError);
          } else {
            console.log('Received response from content script:', response);
          }
        });

        // Display the current tab's contents using a port
        const port = chrome.runtime.connect({ name: 'content-script' });

        port.postMessage({ action: 'displayContents' });

        port.onDisconnect.addListener(function () {
          if (chrome.runtime.lastError) {
            console.error('Port disconnected:', chrome.runtime.lastError);
          }
        });
      }
    });
  }
});

