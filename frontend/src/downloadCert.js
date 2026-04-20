import jsPDF from "jspdf";
import logoSrc from "./assets/logo.png";
import signSrc from "./assets/sign.png";
import stampSrc from "./assets/stamp.png";

export const CERT_W = 800;
export const CERT_H = 496;

function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

async function drawCertificate(data) {
  const { studentName, registrationNo, collegeName, programName, startDate, endDate, description, extraNote } = data;

  const scale = 2;
  const canvas = document.createElement("canvas");
  canvas.width = CERT_W * scale;
  canvas.height = CERT_H * scale;
  const ctx = canvas.getContext("2d");
  ctx.scale(scale, scale);

  const cx = CERT_W / 2;

  // ── White background ──
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, CERT_W, CERT_H);

  // ── TOP-RIGHT waves ──
  ctx.fillStyle = "#1a1a1a";
  ctx.beginPath();
  ctx.moveTo(CERT_W, 0); ctx.lineTo(CERT_W, 160);
  ctx.bezierCurveTo(CERT_W-55, 125, CERT_W-115, 82, CERT_W-175, 46);
  ctx.bezierCurveTo(CERT_W-210, 26, CERT_W-90, 0, CERT_W, 0);
  ctx.closePath(); ctx.fill();

  ctx.fillStyle = "#c9a84c";
  ctx.beginPath();
  ctx.moveTo(CERT_W, 0); ctx.lineTo(CERT_W, 122);
  ctx.bezierCurveTo(CERT_W-48, 96, CERT_W-100, 60, CERT_W-152, 32);
  ctx.bezierCurveTo(CERT_W-185, 16, CERT_W-72, 0, CERT_W, 0);
  ctx.closePath(); ctx.fill();

  ctx.fillStyle = "#e8c96a"; ctx.globalAlpha = 0.8;
  ctx.beginPath();
  ctx.moveTo(CERT_W, 0); ctx.lineTo(CERT_W, 84);
  ctx.bezierCurveTo(CERT_W-36, 65, CERT_W-78, 40, CERT_W-118, 20);
  ctx.bezierCurveTo(CERT_W-148, 8, CERT_W-55, 0, CERT_W, 0);
  ctx.closePath(); ctx.fill();
  ctx.globalAlpha = 1;

  // ── BOTTOM-LEFT waves ──
  ctx.fillStyle = "#1a1a1a";
  ctx.beginPath();
  ctx.moveTo(0, CERT_H); ctx.lineTo(270, CERT_H);
  ctx.bezierCurveTo(205, CERT_H-38, 138, CERT_H-68, 65, CERT_H-90);
  ctx.bezierCurveTo(25, CERT_H-102, 0, CERT_H-56, 0, CERT_H);
  ctx.closePath(); ctx.fill();

  ctx.fillStyle = "#c9a84c";
  ctx.beginPath();
  ctx.moveTo(0, CERT_H); ctx.lineTo(240, CERT_H);
  ctx.bezierCurveTo(180, CERT_H-34, 118, CERT_H-60, 52, CERT_H-80);
  ctx.bezierCurveTo(18, CERT_H-92, 0, CERT_H-48, 0, CERT_H);
  ctx.closePath(); ctx.fill();

  ctx.fillStyle = "#e8c96a"; ctx.globalAlpha = 0.8;
  ctx.beginPath();
  ctx.moveTo(0, CERT_H); ctx.lineTo(200, CERT_H);
  ctx.bezierCurveTo(148, CERT_H-28, 92, CERT_H-52, 40, CERT_H-68);
  ctx.bezierCurveTo(14, CERT_H-80, 0, CERT_H-40, 0, CERT_H);
  ctx.closePath(); ctx.fill();
  ctx.globalAlpha = 1;

  // ── Gold border ──
  ctx.strokeStyle = "#c9a84c"; ctx.lineWidth = 2;
  ctx.strokeRect(12, 12, CERT_W-24, CERT_H-24);
  ctx.strokeStyle = "rgba(201,168,76,0.4)"; ctx.lineWidth = 1;
  ctx.strokeRect(17, 17, CERT_W-34, CERT_H-34);

  // ── Load images ──
  const [logoImg, signImg, stampImg] = await Promise.all([
    loadImage(logoSrc), loadImage(signSrc), loadImage(stampSrc),
  ]);

  // ── Logo: left side, 105px tall (50% bigger than 70), full opacity ──
  const logoH = 105;
  const logoX = 28;
  const logoY = 18;
  if (logoImg) {
    const logoW = (logoImg.width / logoImg.height) * logoH;
    ctx.globalAlpha = 1.0;
    ctx.drawImage(logoImg, logoX, logoY, logoW, logoH);
    ctx.globalAlpha = 1;
  }

  // ── CERTIFICATE — centered on full page width ──
  ctx.fillStyle = "#1a1a1a";
  ctx.font = "900 44px Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("CERTIFICATE", cx, 66);

  // OF ACHIEVEMENT
  ctx.fillStyle = "#555555";
  ctx.font = "13px Arial, sans-serif";
  ctx.fillText("OF ACHIEVEMENT", cx, 82);

  // Gold divider
  ctx.strokeStyle = "#c9a84c"; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(cx-70, 91); ctx.lineTo(cx-8, 91); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx+8, 91); ctx.lineTo(cx+70, 91); ctx.stroke();
  ctx.fillStyle = "#c9a84c";
  ctx.font = "12px Arial";
  ctx.fillText("✦", cx, 95);

  // ── Presented to ──
  ctx.fillStyle = "#555555";
  ctx.font = "12px Georgia, serif";
  ctx.fillText("This certificate is proudly presented to", cx, 112);

  // ── Student name ──
  ctx.fillStyle = "#1a1a1a";
  ctx.font = "italic 700 38px Georgia, serif";
  ctx.fillText(studentName || "", cx, 154);

  // ── Dotted separator ──
  const dotStart = cx - 125;
  for (let i = 0; i < 50; i++) {
    ctx.fillStyle = i % 6 === 0 ? "#c9a84c" : "rgba(201,168,76,0.35)";
    ctx.fillRect(dotStart + i * 5, 162, 4, 1.5);
  }

  // ── Body text ──
  const bodyFull = [
    registrationNo ? `${registrationNo} — ` : "",
    `of ${collegeName} for successfully completing ${description} `,
    `"${programName}" `,
    `conducted by TechSign Solutions Pvt Ltd (TSS) from ${startDate} to ${endDate}.`,
  ].join("");

  ctx.font = "14px Georgia, serif";
  ctx.fillStyle = "#333333";
  ctx.textAlign = "center";

  const maxLineW = 620;
  const words = bodyFull.split(" ").filter(Boolean);
  const lines = [];
  let cur = "";
  for (const w of words) {
    const test = cur ? cur + " " + w : w;
    if (ctx.measureText(test).width > maxLineW && cur) { lines.push(cur); cur = w; }
    else cur = test;
  }
  if (cur) lines.push(cur);

  let bodyY = 182;
  for (const line of lines) { ctx.fillText(line, cx, bodyY); bodyY += 21; }

  if (extraNote) {
    ctx.font = "italic 12px Georgia, serif";
    ctx.fillStyle = "#444444";
    ctx.fillText(extraNote, cx, bodyY + 5);
  }

  // ── SIGNATURE BLOCK — sign centered ON stamp, moved up 20px ──
  // lineY moved up: CERT_H - 58 (20px higher than before)
  const stampSize = 90;
  const lineY     = CERT_H - 58;
  const stampTopY = lineY - stampSize - 2;

  // 1. Stamp (behind)
  if (stampImg) {
    ctx.globalAlpha = 0.55;
    ctx.drawImage(stampImg, cx - stampSize/2, stampTopY, stampSize, stampSize);
    ctx.globalAlpha = 1;
  }

  // 2. Sign ON TOP of stamp, vertically centered within stamp
  if (signImg) {
    const signH = 52;
    const sw = (signImg.width / signImg.height) * signH;
    const signY = stampTopY + (stampSize - signH) / 2;
    ctx.drawImage(signImg, cx - sw/2, signY, sw, signH);
  }

  // 3. Underline
  ctx.strokeStyle = "#1a1a1a"; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(cx-90, lineY); ctx.lineTo(cx+90, lineY); ctx.stroke();

  // 4. SIGNATURE label
  ctx.fillStyle = "#555555";
  ctx.font = "10px Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("SIGNATURE", cx, lineY + 14);

  // 5. CEO label
  ctx.fillStyle = "#1a1a1a";
  ctx.font = "bold 12px Arial, sans-serif";
  ctx.fillText("CEO, TechSign Solutions Pvt. Ltd", cx, lineY + 28);

  return canvas;
}

export async function downloadCert(data, filename) {
  const canvas = await drawCertificate(data);
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [CERT_W, CERT_H] });
  pdf.addImage(imgData, "PNG", 0, 0, CERT_W, CERT_H);
  pdf.save(`${filename}_certificate.pdf`);
}

export async function downloadCertToBlob(data) {
  const canvas = await drawCertificate(data);
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [CERT_W, CERT_H] });
  pdf.addImage(imgData, "PNG", 0, 0, CERT_W, CERT_H);
  return pdf.output("blob");
}
