import { colors } from "./colors.js";

let main = document.querySelector("main");
let brush = document.querySelector(".brush");
let colordiv = document.querySelector(".color-box");
let panel = document.querySelector(".color-panel");
let canvas = document.querySelector("#canvas");

let mouseX = 0;
let mouseY = 0;

main.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function Cursor() {
  brush.style.transform = `translate(${Math.round(mouseX - 20)}px, ${Math.round(
    mouseY - 20
  )}px)`;
  requestAnimationFrame(Cursor);
}

// Cursor();

// document.addEventListener("DOMContentLoaded", () => {
//   colors.forEach((color) => {
//     let colorbox = document.createElement("div");
//     // colorbox.textContent = color.name;
//     colorbox.style.backgroundColor = color.hex;
//     colorbox.setAttribute("data-tooltip", color.name);
//     colorbox.classList.add("color-box");
//     panel.appendChild(colorbox);
//   });
// });

document.addEventListener("contextmenu", (e) => e.preventDefault());

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.width = window.innerWidth + "px";
canvas.style.height = window.innerHeight + "px";

const ctx = canvas.getContext("2d");

ctx.fillStyle = "#091207de";
ctx.fillRect(0, 0, canvas.width, canvas.height);

canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseout", stopDrawing);

let is_drawing = false;

function startDrawing(e) {
  if (e.button !== 0) return;
  mouseX = e.clientX;
  mouseY = e.clientY;
  is_drawing = true;
  ctx.beginPath();

  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  ctx.moveTo(mouseX, mouseY);
  e.preventDefault();
}
function drawing(e) {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (is_drawing) {
    ctx.lineTo(mouseX, mouseY);
    ctx.strokeStyle = "yellow";
    ctx.stroke();
  }
  e.preventDefault();
}
function stopDrawing(e) {
  if (is_drawing) {
    ctx.stroke();
    ctx.closePath();
    is_drawing = false;
  }
  e.preventDefault();
}
