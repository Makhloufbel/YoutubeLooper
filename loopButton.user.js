// ==UserScript==
// @name         loopButton
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  add a loop button to youtube
// @author       Makhloufbel
// @license      https://creativecommons.org/licenses/by-sa/4.0/
// @homepage     https://github.com/Makhloufbel/YoutubeLooper
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const STATE = {
        IDLE: 0,
        ACTIVE: 1
    }

    const SELECTOR = {
        UNIQUENESS_CUE: 'head title',
        BUTTON_RACK: 'div.ytp-chrome-controls > div.ytp-left-controls',
        VIDEO: 'video.html5-main-video',
        PLAY_BUTTON: 'div.ytp-autonav-toggle-button-container'
        //PLAY_BUTTON: 'button.ytp-play-button'
    }

    const LOOP_BUTTON_CLASSNAMES = ['ytp-loop-button', 'ytp-button']

    const iconPrototype ='<?xml version="1.0" encoding="UTF-8"?><svg class="style-scope yt-icon" display="block" pointer-events="none" style="height:60%;width:60%" focusable="false" viewBox="0 0 24 24" mlns="http://www.w3.org/2000/svg"><g class="style-scope yt-icon"><path class="style-scope yt-icon" stroke = "rgb(208, 208, 208)"  stroke-opacity="0.4" id = "svg_makhlouf"  d="M21,13h1v5L3.93,18.03l2.62,2.62l-0.71,0.71L1.99,17.5l3.85-3.85l0.71,0.71l-2.67,2.67L21,17V13z M3,7l17.12-0.03 l-2.67,2.67l0.71,0.71l3.85-3.85l-3.85-3.85l-0.71,0.71l2.62,2.62L2,6v5h1V7z"/></g></svg>';

    class LoopButton {
        constructor() {
            //console.log('loop button loaded!');
            // set initial state
            this.state = STATE.IDLE
            this.URI = ''

            // query all needed DOM
            this.DOMObj = {
                'head': document.querySelector(SELECTOR.UNIQUENESS_CUE),
                'buttonRack': null,
                'playButton': null,
                'video': null
            }

            // add observer to uniqueness cue
            let observer = new MutationObserver((mutations) => {
                this.pageChangeHandler()
            })

            observer.observe(this.DOMObj.head, {
                attributes: true,
                childList: true,
                characterData: true
            })
        }

        pageChangeHandler() {
            // get current uri
            let currentURI = window.location.href
            //console.log('page changed!', currentURI);

            // check changes of URI
            if (this.URI == currentURI) return;
            this.URI = currentURI

            // check if on watch page
            if (!/(^https?:\/\/)?(www\.)?youtube.com\/watch.+/.test(currentURI)) return // do nothing if not on watch page

            // set to idle at first
            if (this.DOMObj.loopButton) {
                //console.log('setting to idle');
                this.setState(STATE.IDLE)
            } else {

                // query all needed DOM
                this.DOMObj.buttonRack = document.querySelector(SELECTOR.BUTTON_RACK)
                this.DOMObj.playButton = document.querySelector(SELECTOR.PLAY_BUTTON)
                this.DOMObj.video = document.querySelector(SELECTOR.VIDEO)

                if (this.DOMObj.buttonRack && this.DOMObj.playButton && this.DOMObj.video) {
                    this.placeButton()
                } else {
                    console.error('loop-button-for-youtube : query resulted in nothing. aborting placement.');
                }
            }
        }

        placeButton() {
            //console.log('placing button');
            let loopButton = document.createElement('button')

            loopButton.innerHTML = iconPrototype
            loopButton.classList.add(...LOOP_BUTTON_CLASSNAMES)
            this.DOMObj.buttonRack.insertBefore(loopButton, this.DOMObj.playButton.nextSibling)
            loopButton.addEventListener('click', this.buttonClickHandler.bind(this))

            this.DOMObj.loopButton = loopButton
        }

        buttonClickHandler(event) {
            //console.log('youtube-loop-button:', 'button clicked at', this.state)

            // toggles
            switch (this.state) {
                case STATE.ACTIVE:
                    this.setState(STATE.IDLE)
                    break
                case STATE.IDLE:
                    this.setState(STATE.ACTIVE)
                    break
            }
        }

        // helpers
        setState(state) {
            switch (state) {
                case STATE.ACTIVE:
                    this.state = STATE.ACTIVE
                    //this.DOMObj.loopButton.querySelector('svg path').classList.remove('ytp-svg-fill')
                    document.getElementById("svg_makhlouf").setAttribute("stroke-opacity", "1")
                    this.DOMObj.video.loop = true
                    break
                case STATE.IDLE:
                    this.state = STATE.IDLE
                    //this.DOMObj.loopButton.querySelector('svg path').classList.add('ytp-svg-fill')
                    document.getElementById("svg_makhlouf").setAttribute("stroke-opacity", "0.4")
                    this.DOMObj.video.loop = false
                    break
            }
        }
    }

    let loopButton = new LoopButton()





    })();