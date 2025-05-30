(function () {
    function simulateDrag(el, startX, startY, endX, endY) {
        function dispatchEvent(target, type, x, y) {
            const evt = new MouseEvent(type, {
                bubbles: true,
                cancelable: true,
                clientX: x,
                clientY: y,
                view: window
            });
            target.dispatchEvent(evt);
        }

        dispatchEvent(el, "mousedown", startX, startY);

        let currentX = startX;
        let currentY = startY;
        const stepX = (endX - startX) / 20;
        const stepY = (endY - startY) / 20;

        function step() {
            currentX += stepX;
            currentY += stepY;
            dispatchEvent(document, "mousemove", currentX, currentY);

            if (
                Math.abs(currentX - endX) < Math.abs(stepX) &&
                Math.abs(currentY - endY) < Math.abs(stepY)
            ) {
                dispatchEvent(document, "mouseup", endX, endY);
                setTimeout(() => {
                    if (typeof simulateDrag.onComplete === "function") {
                        simulateDrag.onComplete();
                    }
                }, 100);
            } else {
                requestAnimationFrame(step);
            }
        }

        requestAnimationFrame(step);
    }

    function start() {
        const items = document.querySelectorAll(".item");
        if (items.length === 0) {
            console.error("No .item elements found");
            return;
        }

        let index = 0;

        function processNext() {
            if (index >= items.length) {
                index = 0;
            }

            const el = items[index];
            const rect = el.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            simulateDrag.onComplete = () => {
                index++;
                processNext();
            };

            simulateDrag(el, centerX, centerY, 500, 100);
        }

        processNext();
    }

    start();

    // Click clear button every 10 seconds
    setInterval(() => {
        const clearBtn = document.querySelector(".clear");
        if (clearBtn) {
            clearBtn.click();
            setTimeout(() => {
                const confirmBtn = document.querySelector("dialog .action-btn.action-danger");
                if (confirmBtn) {
                    confirmBtn.click();
                }
            }, 50);
        }
    }, 10000);
})();
