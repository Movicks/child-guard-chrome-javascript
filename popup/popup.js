document.addEventListener('DOMContentLoaded', function () {
  const urlInput = document.getElementById('urlsInputted');
  const addButton = document.getElementById('blockerBtn');
  const urlList = document.getElementById('urlList');

  // Event listener for the "Add" button
  addButton.addEventListener('click', handleAddButtonClick);

  // Event delegation for handling delete button clicks
  urlList.addEventListener('click', handleDeleteButtonClick);

  // Function to check if the URL or hostname already exists in storage or not
  function isUrlExists(url, callback) {
    chrome.storage.local.get({ urls: [] }, function (result) {
        const urls = result.urls;
        const exists = urls.some(function (storedUrl) {
            return storedUrl === url || new URL(url).hostname === new URL(storedUrl).hostname;
        });

        console.log('Checking if URL exists:', url, 'Exists:', exists);

        if (exists) {
            callback(true);
        } else {
            callback(false);
            alert("url added to storage.! Refresh to update UI");
            urlInput.value = '';
        }
    });
}

  // Function to delete a URL from storage
  function deleteUrlFromStorage(urlToDelete) {
      chrome.storage.local.get({ urls: [] }, function (result) {
          const urls = result.urls;
          const updatedUrls = urls.filter(function (url) {
              return url !== urlToDelete;
          });

          // Save the updated URLs to storage
          chrome.storage.local.set({ urls: updatedUrls }, function () {
              console.log('URL deleted:', urlToDelete);
          });
      });
  }

  // Function to update the URL list in the popup
  function updateUrlList() {
      // Retrieve URLs from Chrome Storage
      chrome.storage.local.get({ urls: [] }, function (result) {
          const urls = result.urls;

          // Clear the existing list
          urlList.innerHTML = '';

          // Populate the list with the stored URLs and delete buttons
          urls.forEach(function (url) {
              const listItem = createListItem(url);
              urlList.appendChild(listItem);
          });
      });
  }

  // Function to handle the "Add" button click
  function handleAddButtonClick() {
      const url = urlInput.value;

      // Validate the URL format
      if (!isValidUrl(url)) {
          alert('Invalid URL format! Please enter a valid URL like https://....');
          return;
      }

      // Check if the URL or hostname already exists in storage
      isUrlExists(url, function (exists) {
          if (!exists) {
              // If it doesn't exist, add it to storage
              chrome.runtime.sendMessage({ action: 'addUrl', url: url });

              // Update the URL list in the popup
              updateUrlList();
          } else {
              // If it already exists, show an alert
              alert('URL or hostname already exists in storage!');
          }
      });
    }

  // Function to handle delete button clicks using event delegation
  function handleDeleteButtonClick(event) {
      if (event.target.classList.contains('deleteButton')) {
          // Get the URL associated with the delete button
          const urlToDelete = event.target.dataset.url;
          // Delete the URL from storage
          deleteUrlFromStorage(urlToDelete);
          alert(urlToDelete + " has been deleted from the storage.  Please refresh to update UI");
          // Updating the URL list in the UI
          updateUrlList();
      }
  }

  // Function to create a list item with a delete button for a given URL
  function createListItem(url) {
      const listItem = document.createElement('li');
      listItem.textContent = url;

      // Create a delete button for each URL
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'X';
      deleteButton.classList.add('deleteButton');
      deleteButton.dataset.url = url;

      // Append the delete button to the list item
      listItem.appendChild(deleteButton);

      return listItem;
  }

  // Function to validate the URL format
  function isValidUrl(url) {
      try {
          new URL(url);
          return true;
      } catch (error) {
          return false;
      }
  }

  // Update the URL list when the popup is opened
  updateUrlList();
  // Add event listener for tab URL changes
  chrome.tabs.onUpdated.addListener(function (tabId, changeInfo) {
    // Check if the URL has been updated
    if (changeInfo.url) {
        console.log('Tab URL updated:', changeInfo.url);
        // Check if the updated URL is in the storage
        isUrlExists(changeInfo.url, function (exists) {
            console.log('URL in storage:', exists);
            if (exists) {
                // Redirect the tab to the 404.html page
                console.log('Redirecting to 404.html');
                chrome.tabs.update(tabId, { url: chrome.runtime.getURL('404.html') });
            }
        });
    }
  });
});
