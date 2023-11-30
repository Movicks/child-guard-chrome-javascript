// content-script

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'displayContents') {
      // Perform actions to display contents or gather information from the current tab
      const pageContents = document.documentElement.outerHTML;
  
      // Send the gathered information back to the background script
      sendResponse({ contents: pageContents });
  
      // You can also modify the DOM or perform other actions as needed
    }
  });
  