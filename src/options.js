// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';
/*
let page = document.getElementById('buttonDiv');
const kButtonColors = ['#3aa757', '#e8453c', '#f9bb2d', '#4688f1'];
function constructOptions(kButtonColors) {
  for (let item of kButtonColors) {
    let button = document.createElement('button');
    button.style.backgroundColor = item;
    button.addEventListener('click', function() {
      chrome.storage.sync.set({color: item}, function() {
        console.log('color is ' + item);
      })
    });
    page.appendChild(button);
  }
}
constructOptions(kButtonColors);

*/

const display = document.getElementById('data');
chrome.storage.sync.get('savedKeys', (data) => {
  console.log(JSON.parse(data.savedKeys));
  Object.keys(JSON.parse(data.savedKeys)).forEach((key) => {
    display.innerHTML += `<p>ID: ${key}, PIN: ${JSON.parse(data.savedKeys)[key]}</p>`;
  });

});