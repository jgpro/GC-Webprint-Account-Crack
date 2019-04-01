// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({color: '#3aa757'}, function() {
    console.log('The color is green.');
  });
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {hostEquals: '10.250.80.17'},
      })],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});

var lastID = 0;

chrome.runtime.onMessage.addListener(function (msg, sender) {
  if ((msg.from === 'content') && (msg.subject === 'try')) {
    lastID = msg.id;
  }
  if ((msg.from === 'content') && (msg.subject === 'lastId')) {
    sendResponse({last: lastID});
  }
  if ((msg.from === 'content') && (msg.subject === 'success')) {
    chrome.storage.sync.set({bruteForce: true}, function() {
      console.log('bruteForce: ' + true);
      setTimeout(() => {
        chrome.tabs.executeScript(
          tabs[0].id,
          {code: 
            `
            go(${lastID}).value);
            `});
      }, 500);
    });
    // Set as lastID to db
    chrome.storage.sync.get('savedKeys', (data) => {
      let list = JSON.parse(data.savedKeys);
      list[lastID] = '1234';
      chrome.storage.sync.set({savedKeys: JSON.stringify(list)}, () => {
        console.log('Added ' + lastID + ' to local storage.')
      });
    });
  }
  if ((msg.from === 'content') && (msg.subject === 'fail')) {
    setTimeout(() => {
      chrome.tabs.executeScript(
        tabs[0].id,
        {code: `console.log(${lastID}); go(${lastID});`
      });
    }, 500);
  }
});