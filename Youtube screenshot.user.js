// ==UserScript==
// @name         Youtube screenshot
// @version      1.2
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
        if (elements.length === 0) {
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
        var videoid = getVideoId();
        var time = document.getElementsByClassName('ytp-time-current')[0].innerHTML.split(':').join('.');

        var canvas = ytp_screenshot_getCanvas();
        canvas.width = width;
        canvas.height = height;

        var ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, width, height);

        canvas.toBlob(function(blob) {
            saveAs(blob, `ytp_${videoid}_snapshot_${time}.png`);
        });
    }

    function getVideoId() {
        var videoid = '';

        for (var text of window.location.search.split('&')) {
            if (text.indexOf('?v=') !== -1) {
                videoid = text.replace('?v=', '');
                break;
            }

            if (text.indexOf('v=') !== -1) {
                videoid = text.replace('v=', '');
                break;
            }
        }

        return videoid;
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
            s.src = 'https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.min.js';
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
        button.style.fontSize = '150%';
        button.style.textAlign = 'center';
        button.className = 'ytp-button';
        button.id = 'ytp-screenshot-button';

        var controls = document.getElementsByClassName('ytp-right-controls');
        controls[0].insertBefore(button, controls[0].firstChild);

        document.addEventListener("keypress", (e) => {
            // Take a screenshot when the s key is pressed.
            if (e.keyCode === 115) {
                screenshotYoutube()
            }
        })
    }

    ytp_screenshot_init();
})();
