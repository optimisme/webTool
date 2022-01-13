window.addEventListener('load', () => { init() })

function init () {
    let refBob = document.querySelector('#bob')

    fesArrossegable(refBob)
}

function fesArrossegable(ref) {
    let lastX = 0, lastY = 0;

    ref.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();

        lastX = e.clientX;
        lastY = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;

        let refBob = document.querySelector('#bob')

        if (e.srcElement == refBob) {
            refBob.style.zIndex = 1
        } else {
            refBob.style.zIndex = 0
        }
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();

        let x = lastX - e.clientX;
        let y = lastY - e.clientY;
        lastX = e.clientX;
        lastY = e.clientY;

        ref.style.top = (ref.offsetTop - y) + "px";
        ref.style.left = (ref.offsetLeft - x) + "px";
    }

    function closeDragElement(e) {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}