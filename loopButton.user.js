// ==UserScript==
// @name         loopButton
// @namespace    https://github.com/Makhloufbel
// @homepage     https://github.com/Makhloufbel
// @version      0.1
// @description  try to take over the world!
// @author       Makhloufbel
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// ==/UserScript==
(function () {
    'use strict';
    const STATE = {
        IDLE: 0,
        ACTIVE: 1
    };
    const SELECTOR = {
        UNIQUENESS_CUE: 'head title',
        BUTTON_RACK: 'div.ytp-chrome-controls > div.ytp-right-controls',
        VIDEO: 'video.html5-main-video',
    };
    const LOOP_BUTTON_CLASSNAMES = ['ytp-loop-button', 'ytp-button'];
    const iconPrototype = '<?xml version="1.0" encoding="UTF-8"?><svg class="style-scope yt-icon" display="' +
            'block" pointer-events="none" style="height:28px;width:28px;padding-bottom:10px;"' +
            ' focusable="false" viewBox="0 0 24 24" mlns="http://www.w3.org/2000/svg"><g clas' +
            's="style-scope yt-icon"><path class="style-scope yt-icon" stroke = "rgb(208, 208' +
            ', 208)"  stroke-opacity="0.4" fill = "rgb(208, 208, 208)"  fill-opacity="0.4" id' +
            ' = "svg_makhlouf"  d="M21,13h1v5L3.93,18.03l2.62,2.62l-0.71,0.71L1.99,17.5l3.85-' +
            '3.85l0.71,0.71l-2.67,2.67L21,17V13z M3,7l17.12-0.03 l-2.67,2.67l0.71,0.71l3.85-3' +
            '.85l-3.85-3.85l-0.71,0.71l2.62,2.62L2,6v5h1V7z"/></g></svg>';
    class LoopButton {
        constructor() {
            this.state = STATE.IDLE;
            this.URI = '';
            this.DOMObj = {
                'head': document.querySelector(SELECTOR.UNIQUENESS_CUE),
                'buttonRack': null,
                'video': null
            };
            let observer = new MutationObserver((mutations) => {
                this.pageChangeHandler()
            });
            observer.observe(this.DOMObj.head, {
                attributes: true,
                childList: true,
                characterData: true
            })
        }
        pageChangeHandler() {
            let currentURI = window.location.href;
            if (this.URI == currentURI) {
                return
            }
            this.URI = currentURI;
            if (!/(^https?:\/\/)?(www\.)?youtube.com\/watch.+/.test(currentURI)) {
                return;
            }
            if (this.DOMObj.loopButton) {
                this.setState(STATE.IDLE)
            } else {
                this.DOMObj.buttonRack = document.querySelector(SELECTOR.BUTTON_RACK);
                this.DOMObj.video = document.querySelector(SELECTOR.VIDEO);
                if (this.DOMObj.buttonRack && this.DOMObj.video) {
                    this.placeButton()
                } else {
                    console.error('loop-button-for-youtube : query resulted in nothing. aborting placement.')
                }
            }
        }
        placeButton() {
            let loopButton = document.createElement('button');
            loopButton.innerHTML = iconPrototype;
            loopButton
                .classList
                .add(...LOOP_BUTTON_CLASSNAMES);
            let list = document.querySelector("div.ytp-chrome-controls > div.ytp-right-controls");
            list.insertBefore(loopButton, list.children[3]);
            loopButton.addEventListener('click', this.buttonClickHandler.bind(this));
            this.DOMObj.loopButton = loopButton
        }
        buttonClickHandler(event) {
            switch (this.state) {
                case STATE.ACTIVE:
                    this.setState(STATE.IDLE);
                    break;
                case STATE.IDLE:
                    this.setState(STATE.ACTIVE);
                    break
            }
        }
        setState(state) {
            switch (state) {
                case STATE.ACTIVE:
                    this.state = STATE.ACTIVE;
                    document
                        .getElementById("svg_makhlouf")
                        .setAttribute("stroke-opacity", "1");
                    document
                        .getElementById("svg_makhlouf")
                        .setAttribute("fill-opacity", "1");
                    this.DOMObj.video.loop = true;
                    break;
                case STATE.IDLE:
                    this.state = STATE.IDLE;
                    document
                        .getElementById("svg_makhlouf")
                        .setAttribute("stroke-opacity", "0.4");
                    document
                        .getElementById("svg_makhlouf")
                        .setAttribute("fill-opacity", "0.4");
                    this.DOMObj.video.loop = false;
                    break
            }
        }
    }
    let loopButton = new LoopButton()
})();

