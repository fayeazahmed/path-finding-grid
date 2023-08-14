const LENGTH = 800
const N = 80
const L = LENGTH / N
const W = 1
const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d");
const BTN = document.getElementById("stopBtn")
const HINTS = document.getElementById("hints")
const vertices = []
canvas.height = LENGTH
canvas.width = LENGTH
ctx.fillStyle = "#d3d3d3";
ctx.fillRect(0, 0, LENGTH, LENGTH);
let SRC
let GOAL
let RUNNING = false
const PLAY_ICON = "<i class='fa fa-play' aria-hidden='true'></i>"
const STOP_ICON = "<i class='fa fa-refresh' aria-hidden='true'></i>"
const SRC_DST_MESSAGE = "Select source and destination."
const DST_MESSAGE = "Select destination."
const SRC_MESSAGE = "Select source."
const PLAY_MESSAGE = "Select play."
const DONE_MESSAGE = "Done, Boi."
