import { colors } from "./colors.js";

const panel          = document.getElementById("color-panel");
const canvas         = document.getElementById("canvas");
const brushSizeInput = document.getElementById("brush-size");
const brushSizeVal   = document.getElementById("brush-size-val");
const brushPreview   = document.getElementById("brush-preview");
const eraserBtn      = document.getElementById("eraser-btn");
const brushBtn       = document.getElementById("brush-btn");
const cursor         = document.getElementById("brush-cursor");

let currentColor = "#FFFF00";
let currentSize  = 5;
let is_drawing   = false;
let isEraser     = false;

canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");

colors.forEach((color) => {
  const box = document.createElement("div");
  box.style.backgroundColor = color.hex;
  box.setAttribute("data-tooltip", color.name);
  box.classList.add("color-box");

  if (color.hex.toUpperCase() === currentColor.toUpperCase()) {
    box.classList.add("active");
  }

  box.addEventListener("click", () => {
    document.querySelectorAll(".color-box").forEach((b) => b.classList.remove("active"));
    box.classList.add("active");
    currentColor = color.hex;
    
    if (isEraser) {
      isEraser = false;
      eraserBtn.classList.remove("active");
      brushBtn.classList.add("active");
      ctx.globalCompositeOperation = "source-over";
    }
    
    updateCursorStyle();
    updatePreview();
  });

  panel.appendChild(box);
});

function updatePreview() {
  const sz = Math.min(currentSize, 60);
  brushPreview.style.width           = sz + "px";
  brushPreview.style.height          = sz + "px";
  
  if (isEraser) {
    brushPreview.style.backgroundColor = "transparent";
    brushPreview.style.border = "2px dashed #a1a1aa";
  } else {
    brushPreview.style.backgroundColor = currentColor;
    brushPreview.style.border = "none";
  }
}

brushSizeInput.addEventListener("input", () => {
  currentSize = Number(brushSizeInput.value);
  brushSizeVal.textContent = currentSize + "px";
  updateCursorStyle();
  updatePreview();
});

updatePreview();

eraserBtn.addEventListener("click", () => {
  if (!isEraser) {
    isEraser = true;
    eraserBtn.classList.add("active");
    brushBtn.classList.remove("active");
    ctx.globalCompositeOperation = "destination-out";
    updateCursorStyle();
    updatePreview();
  }
});

brushBtn.addEventListener("click", () => {
  if (isEraser) {
    isEraser = false;
    brushBtn.classList.add("active");
    eraserBtn.classList.remove("active");
    ctx.globalCompositeOperation = "source-over";
    updateCursorStyle();
    updatePreview();
  }
});

function updateCursorStyle() {
  const d = currentSize;
  cursor.style.width       = d + "px";
  cursor.style.height      = d + "px";
  if (isEraser) {
    cursor.style.borderColor = "#a1a1aa";
    cursor.style.borderStyle = "dashed";
    cursor.style.boxShadow   = `0 0 ${Math.round(d * 0.4)}px rgba(255,255,255,0.2)`;
  } else {
    cursor.style.borderColor = currentColor;
    cursor.style.borderStyle = "solid";
    cursor.style.boxShadow   = `0 0 ${Math.round(d * 0.6)}px ${currentColor}88,
                                 inset 0 0 ${Math.round(d * 0.3)}px ${currentColor}22`;
  }
}
updateCursorStyle();

function getPos(e) {
  const rect = canvas.getBoundingClientRect();
  return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}

document.addEventListener("contextmenu", (e) => e.preventDefault());

canvas.addEventListener("mouseenter", () => { cursor.style.opacity = "1"; });
canvas.addEventListener("mouseleave", () => {
  cursor.style.opacity = "0";
  stopDrawing_internal();
});

canvas.addEventListener("mousemove", (e) => {
  const pos = getPos(e);
  cursor.style.transform = `translate(${e.clientX - currentSize / 2}px, ${e.clientY - currentSize / 2}px)`;

  if (is_drawing) {
    ctx.strokeStyle = currentColor;
    ctx.lineWidth   = currentSize;
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  }
  e.preventDefault();
});

canvas.addEventListener("mousedown", (e) => {
  if (e.button !== 0) return;
  const pos = getPos(e);
  is_drawing = true;
  cursor.classList.add("drawing");
  ctx.beginPath();
  ctx.lineWidth   = currentSize;
  ctx.lineCap     = "round";
  ctx.lineJoin    = "round";
  ctx.strokeStyle = currentColor;
  ctx.moveTo(pos.x, pos.y);
  e.preventDefault();
});

canvas.addEventListener("mouseup", (e) => { stopDrawing_internal(); e.preventDefault(); });

function stopDrawing_internal() {
  if (is_drawing) {
    ctx.stroke();
    ctx.closePath();
    is_drawing = false;
    cursor.classList.remove("drawing");
  }
}

window.addEventListener("resize", () => {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx.putImageData(imageData, 0, 0);
  ctx.globalCompositeOperation = isEraser ? "destination-out" : "source-over";
});
