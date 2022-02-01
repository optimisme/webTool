function updateBackground () {
    let refColors = document.querySelectorAll("input[name='background']:checked")
    let values = Array.from(refColors).map((item) => { return item.value})

    let refColoredBox = document.querySelector("#coloredBox")

    let red = 0
    let green = 0
    let blue = 0

    if (values.indexOf('red') != -1) {
        red = 255
    }
    if (values.indexOf('green') != -1) {
        green = 255
    }

    // Actualitza el color
    refColoredBox.style.backgroundColor = `rgb(${red}, ${green}, ${blue})`
}

function updateBorder () {
    let refColors = undefined
    let values = Array.from(refColors).map((item) => { return item.value})

    let refColoredBox = document.querySelector("#coloredBox")

    console.log(values)

    let red = 0
    let green = 0
    let blue = 0

    if (values.indexOf('red') != -1) {
        red = 255
    }
    if (values.indexOf('green') != -1) {
        green = 255
    }

    // Actualitza el color
    refColoredBox.style.borderColor = `rgb(${red}, ${green}, ${blue})`
}