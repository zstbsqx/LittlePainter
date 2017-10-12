// 就这么喜欢撸码吗？你这个小码农！

(function() {
    "use strict";

    console.log('loading...');
    const $ = ((selector) => document.querySelector(selector));
    const $$ = ((selector) => document.querySelectorAll(selector));
    const word1 = $('#word1');
    const word2 = $('#word2');

    /* A wrapper */
    class Timer {
        constructor(func, ...args) {
            this.func = func;
            this.args = args;
            this.timer = null;
        }

        start(delay) {
            let self = this;
            if(self.timer) {
                clearTimeout(self.timer);
            }
            self.timer = setTimeout(() => {
                self.timer = null;
                self.func(self.args);
            }, delay);
        }
    }

    /* 定义了你的表情包用的那张图。 */
    let selectedPosture = null;
    class Posture {
        constructor(postureElem) {
            this.postureElem = postureElem;
            this.imgElem = postureElem.firstElementChild;
        }

        static fromPostureElement(elem) {
            return Posture(elem);
        }

        get width() {
            return this.imgElem.width;
        }

        get height() {
            return this.imgElem.height;
        }

        setSelected() {
            if (selectedPosture === this) {
                return;
            }
            if (selectedPosture) {
                selectedPosture.postureElem.classList.remove('selected');
            }
            selectedPosture = this;
            this.postureElem.classList.add('selected');
        }
    }
    
    class Painter {
        constructor(canvas) {
            this.canvas = canvas;
        }

        getFontSize(text, width) {
            let ctx = this.canvas.getContext('2d');
            ctx.font = '100px SimHei';
            let tmpMetric = ctx.measureText(text);
            let fixedSize = width * 100 / tmpMetric.width;
            return Math.round(fixedSize);
        }

        paint(posture, str1, str2) {
            let sentence1 = `就这么喜欢${str1}吗`;
            let sentence2 = `你这个${str2}`;

            // fixed image size
            let fixedImageWidth = 320;
            let fixedImageHeight = Math.round(fixedImageWidth * posture.height / posture.width);

            // height = 20 + fixed height + 20 +  text height (including line spacing)

            let size1 = this.getFontSize(sentence1, 360);
            let yoffset1 = 20 + fixedImageHeight + 20;

            let size2 = this.getFontSize(sentence2, 280);
            let yoffset2 = yoffset1 + Math.round(size1 * 1.5);

            // total height
            this.canvas.height = yoffset2 + size2;

            let ctx = canvas.getContext('2d');
            ctx.textAlign = 'center';
            ctx.drawImage(posture.imgElem, 40, 20, fixedImageWidth, fixedImageHeight);
            ctx.font = `${size1}px SimHei`;
            ctx.fillText(sentence1, 200, yoffset1 + Math.round(size1/2));
            ctx.font = `${size2}px SimHei`;
            ctx.fillText(sentence2, 200, yoffset2 + Math.round(size2/2));
        }
    }

    // init
    const canvas = $('canvas');
    // check for canvas support
    if (!('getContext' in canvas)) {
        console.warn('No canvas support');
        return;
    }
    const painter = new Painter(canvas);
    // init postures
    let postures = Array.from($$('.posture')).map((elem) => new Posture(elem));
    // choose a posture randomly
    let randomPosture = postures[Math.floor(Math.random() * postures.length)];
    selectPosture(randomPosture);

    // refresh function
    function refreshCanvas() {
        console.log('refreshing');
        painter.paint(selectedPosture, word1.value || word1.placeholder, word2.value || word2.placeholder);
    }

    function selectPosture(posture) {
        posture.setSelected();
        refreshCanvas();
    }

    // register events
    const timer = new Timer(refreshCanvas);
    word1.addEventListener('input', () => {timer.start(500);});
    word2.addEventListener('input', () => {timer.start(500);});

    function handleSelect(event) {
        selectPosture(new Posture(event.currentTarget));
    }

    for (let postureElem of $$('.posture')) {
        postureElem.addEventListener('click', handleSelect);
    }


    console.log('loaded');
})();
