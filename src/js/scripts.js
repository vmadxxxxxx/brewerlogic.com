;(function(window, document, undefined){

    'use strict';

    /**
     * Name-spacing
     */
    window.Site = {
        basePath: document.body.getAttribute('data-basepath'),
        userAgent: navigator.userAgent,
        platform: navigator.platform
    };

    var tweetsOn = false;
    var htmlEl = document.documentElement;
    if (htmlEl.classList && htmlEl.classList.toString().indexOf('tweets-on') != -1) {
        tweetsOn = true;
    }


    /**
     * Twitter Updates
     *
     */
    var request = new XMLHttpRequest();
    request.open('GET', Site.basePath + '/api/twitter', true);

    request.onload = function() {
        if (request.status >= 200 && request.status < 400){

            var resp = JSON.parse(request.responseText);
            var tweets = resp.tweets;
            var filter = resp.filter || false;
            var x = 0;

            // Template and container nodes
            var $tweetContainer = document.getElementById('tweets');
            var $templateOriginal = document.getElementById('tweet-template');
            var $template = $templateOriginal.cloneNode(true);
            var frag = document.createDocumentFragment();

            // remove the template from the DOM
            $templateOriginal.parentNode.removeChild($templateOriginal);

            var $tweet = document.createElement('div');

            for (x; x < tweets.length; x++) {
                $tweet = new Tweet(tweets[x], $template, filter);
                frag.appendChild($tweet);
            }

            $tweetContainer.appendChild(frag);

        }
    };

    request.onerror = function() {
      // There was a connection error of some sort
    };

    if (tweetsOn) {
        request.send();
    }

}(window, document));
