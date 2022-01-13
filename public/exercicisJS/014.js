window.addEventListener('load', () => { init() })

let arrossegableBob = undefined

function init () {
    
    let refBob = document.querySelector('#bob')

    arrossegableBob = new Arrossegable(refBob)
}

function recoloca (ref) {

    let refBob = document.querySelector('#bob')

    if (ref == refBob) {
        refBob.style.zIndex = 1
    } else {
        refBob.style.zIndex = 0
    }
}

class Arrossegable {

    constructor (ref) {

        this.ref = ref
        this.lastX = 0
        this.lastY = 0

        this.listenerDown   = (e) => { this.mouseDown(e) } 
        this.listenerUp     = (e) => { this.mouseUp(e) }
        this.listenerDrag   = (e) => { this.elementDrag(e) }
        
        ref.addEventListener('mousedown', this.listenerDown)
    }

    mouseDown(evt) {

        evt.preventDefault();

        this.lastX = evt.clientX;
        this.lastY = evt.clientY;

        document.addEventListener('mousemove', this.listenerDrag)
        document.addEventListener('mouseup', this.listenerUp)

        recoloca(this.ref)
    }

    elementDrag(evt) {

        evt.preventDefault();

        let x = this.lastX - evt.clientX;
        let y = this.lastY - evt.clientY;

        this.lastX = evt.clientX;
        this.lastY = evt.clientY;

        this.ref.style.top = (this.ref.offsetTop - y) + "px";
        this.ref.style.left = (this.ref.offsetLeft - x) + "px";
    }

    mouseUp() {

        document.removeEventListener('mouseup', this.listenerUp)
        document.removeEventListener('mousemove', this.listenerDrag)
    }
}