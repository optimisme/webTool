let animacions = ["#titol0", "#titol1", "#titol2"]

function play () {
    let ref = document.querySelector(animacions[0])
    ref.style.animationPlayState = "running"
}

function pause () {
    let ref = document.querySelector(animacions[0])
    ref.style.animationPlayState = "paused"
}

function reset () {
    let ref = document.querySelector(animacions[0])
    ref.style.animation = 'none'
    ref.offsetWidth
    ref.style.animation = null
}

function restart () {
    reset()
    play()
}