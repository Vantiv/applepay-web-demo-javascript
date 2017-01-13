/*
Copyright (C) 2016 Vantiv. All Rights Reserved.

Adapted from EmporiumWeb:
https://developer.apple.com/library/content/samplecode/EmporiumWeb/Introduction/Intro.html
*/

function setLitleResponseFields(response) {
    var regId = response.paypageRegistrationId;
    console.log('regId: ' + regId);
    alert('regId: ' + regId);

    sendToIP(regId);
}
function submitAfterLitle(response) {
    console.log('setLiteResponseFields response ' + response);
    setLitleResponseFields(response);
}
function timeoutOnLitle() {
    alert("We are experiencing technical difficulties. Please try again later or call 555-555-1212 (timeout)");
}
function onErrorAfterLitle(response) {
    setLitleResponseFields(response);
    if (response.response == '871') {
        alert("Invalid card number. Check and retry. (Not Mod10)");
    }
    else if (response.response == '872') {
        alert("Invalid card number. Check and retry. (Too short)");
    }
    else if (response.response == '873') {
        alert("Invalid card number. Check and retry. (Too long)");
    }
    else if (response.response == '874') {
        alert("Invalid card number. Check and retry. (Not a number)");
    }
    else if (response.response == '875') {
        alert("We are experiencing technical difficulties. Please try again later or call 555-555-1212");
    }
    else if (response.response == '876') {
        alert("Invalid card number. Check and retry. (Failure from Server)");
    }
    else if (response.response == '881') {
        alert("Invalid card validation code. Check and retry. (Not a number)");
    }
    else if (response.response == '882') {
        alert("Invalid card validation code. Check and retry. (Too short)");
    }
    else if (response.response == '883') {
        alert("Invalid card validation code. Check and retry. (Too long)");
    }
    else if (response.response == '889') {
        alert("We are experiencing technical difficulties. Please try again later or call 555-555-1212");
    }
    return false;
}

function sendToLitle(payment) {
    console.log("sendToLitle hit");
    console.log(applePay);
    var litleRequest = {
        "paypageId": "<REPLACE_ME>",
        "reportGroup": "reportGroup",
        "orderId": "orderId",
        "id": "id",
        "applepay": payment.token.paymentData,
        "url": "https://request-prelive.np-securepaypage-litle.com"
    };
    console.log(litleRequest);
    var formFields = {
        "paypageRegistrationId": document.createElement("input")
    };
    console.log(formFields);
    var response = new LitlePayPage().sendToLitle(litleRequest, formFields, submitAfterLitle, onErrorAfterLitle, timeoutOnLitle, 15000);
    return false;
}

function sendToIP(registrationId) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/makeVantivIPCall');
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                alert(xhr.response);
                window.location.href = "/success.html";
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify({ registrationId: registrationId, amount: "8.99" }));
    });
}