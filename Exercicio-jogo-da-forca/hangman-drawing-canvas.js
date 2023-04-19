export function head(context) {
  context.lineWidth = 5;
  context.beginPath();
  context.arc(100, 50, 25, 0, Math.PI * 2, true);
  context.closePath();
  context.stroke();
}

export function body(context) {
  context.beginPath();
  context.moveTo(100, 75);
  context.lineTo(100, 140);
  context.stroke();
}

export function rightArm(context) {
  context.beginPath();
  context.moveTo(100, 85);
  context.lineTo(60, 100);
  context.stroke();
}
export function leftArm(context) {
  context.beginPath();
  context.moveTo(100, 85);
  context.lineTo(140, 100);
  context.stroke();
}

export function rightLeg(context) {
  context.beginPath();
  context.moveTo(100, 140);
  context.lineTo(80, 190);
  context.stroke();
}

export function leftLeg(context) {
  context.beginPath();
  context.moveTo(100, 140);
  context.lineTo(125, 190);
  context.stroke();
}

export function suporte(context) {
  context.strokeStyle = '#444';
  context.lineWidth = 10;
  context.beginPath();
  context.moveTo(175, 225);
  context.lineTo(5, 225);
  context.moveTo(40, 225);
  context.lineTo(25, 5);
  context.lineTo(100, 5);
  context.lineTo(100, 25);
  context.stroke();
}
