"use strict";

function startGame() {
    // Make the body load this <body onload="startGame()">
    myGameArea.start();
}

var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        console.log("Inserting the game area...");
        document.body
            .querySelector("main")
            .insertBefore(
                this.canvas,
                document.body.querySelector("main").childNodes[0]
            );
    },
};

export { startGame };