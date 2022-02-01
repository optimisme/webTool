function updateColor () {
    let refRed = document.querySelector("#red")
    let refRedValue = document.querySelector("#redValue")

    let refGreen = document.querySelector("#green")
    let refGreenValue = document.querySelector("#greenValue")

    let refColoredBox = document.querySelector("#coloredBox")

    // Actualitza els valors numèrics
    refRedValue.textContent = refRed.value

    // Actualitza el color
    refColoredBox.style.backgroundColor = `rgb(${refRed.value}, 0, 0)`
}
