// ==UserScript==
// @name         Youtube screenshot
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Adds screenshot button to youtube
// @author       Fungideon
// @match        http://www.youtube.com/watch?*
// @match        https://www.youtube.com/watch?*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    function screenshotYoutube() {
        var elements = document.getElementsByTagName('VIDEO');
        if (elements.length !== 1) {
            alert('Failed to find the video element');
            return;
        }
        
        if (!saveAs) {
            console.log('loading saveas');
            ytp_screenshot_init();
        }

        var video = elements[0];
        var width = video.videoWidth;
        var height = video.videoHeight;

        var canvas = ytp_screenshot_getCanvas();
        canvas.width = width;
        canvas.height = height;

        var ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, width, height);

        canvas.toBlob(function(blob) {
            saveAs(blob, "ytp-screenshot.png");
        });
    }

    function ytp_screenshot_getCanvas() {
        var canvas = document.getElementById('ytp-screenshot-canvas');

        if (!canvas) {
            var c = document.createElement('CANVAS');
            c.style.display = 'none';
            c.id = 'ytp-screenshot-canvas';
            canvas = document.body.appendChild(c);
        }

        return canvas;
    }


    function ytp_screenshot_init() {
        if (typeof saveAs === 'undefined') {
            var s = document.createElement('SCRIPT');
            s.src = 'https://fastcdn.org/FileSaver.js/1.1.20151003/FileSaver.min.js';
            s.id = 'ytp-screenshot-saveas';
            s.type = 'text/javascript';
            document.getElementsByTagName('head')[0].appendChild(s);
        }

        var mybutton = document.getElementById('ytp-screenshot-button');
        if (mybutton)
            return;

        var button = document.createElement('BUTTON');
        button.innerText = '📷';
        button.onclick = () => {
            screenshotYoutube();
        };
        button.style.background = 'transparent';
        button.style.border = 'none';
        button.style.color = 'white';
        button.style.verticalAlign = 'top';
        button.style.fontSize = '18px';
        button.style.textAlign = 'center';
        button.className = 'ytp-button';
        button.id = 'ytp-screenshot-button';

        var controls = document.getElementsByClassName('ytp-right-controls')[0];
        controls.insertBefore(button, controls.firstChild);
    }

    ytp_screenshot_init();
})();