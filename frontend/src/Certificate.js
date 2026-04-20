import React from "react";
import logo from "./assets/logo.png";
import sign from "./assets/sign.png";
import stamp from "./assets/stamp.png";

export const CERT_W = 800;
export const CERT_H = 496;

// sigCx offset from center
const SIG_OFFSET = 50;

export default function Certificate({ data, certRef }) {
  const { studentName, registrationNo, collegeName, programName, startDate, endDate, description, extraNote } = data;
  const sigLeft = `calc(50% + ${SIG_OFFSET}px)`;

  return (
    <div
      ref={certRef}
      style={{
        width: `${CERT_W}px`,
        height: `${CERT_H}px`,
        background: "#ffffff",
        position: "relative",
        fontFamily: "Georgia, 'Times New Roman', serif",
        color: "#1a1a1a",
        overflow: "hidden",
        boxSizing: "border-box",
        flexShrink: 0,
        flexGrow: 0,
      }}
    >
      {/* TOP-RIGHT waves */}
      <div style={{ position:"absolute", top:0, right:0, width:"220px", height:"160px", background:"#1a1a1a", clipPath:"polygon(100% 0,100% 100%,38% 52%,8% 28%)", zIndex:0 }} />
      <div style={{ position:"absolute", top:0, right:0, width:"200px", height:"130px", background:"#c9a84c", clipPath:"polygon(100% 0,100% 100%,42% 48%,12% 22%)", zIndex:0 }} />
      <div style={{ position:"absolute", top:0, right:0, width:"175px", height:"90px",  background:"#e8c96a", clipPath:"polygon(100% 0,100% 100%,48% 56%,22% 18%)", zIndex:0, opacity:0.8 }} />

      {/* BOTTOM-LEFT waves */}
      <div style={{ position:"absolute", bottom:0, left:0, width:"270px", height:"160px", background:"#1a1a1a", clipPath:"polygon(0 100%,100% 100%,72% 32%,0 52%)", zIndex:0 }} />
      <div style={{ position:"absolute", bottom:0, left:0, width:"245px", height:"140px", background:"#c9a84c", clipPath:"polygon(0 100%,100% 100%,68% 28%,0 46%)", zIndex:0 }} />
      <div style={{ position:"absolute", bottom:0, left:0, width:"205px", height:"120px", background:"#e8c96a", clipPath:"polygon(0 100%,100% 100%,62% 26%,0 40%)", zIndex:0, opacity:0.8 }} />

      {/* Gold border */}
      <div style={{ position:"absolute", inset:"12px", border:"2px solid #c9a84c", pointerEvents:"none", zIndex:1 }} />
      <div style={{ position:"absolute", inset:"17px", border:"1px solid rgba(201,168,76,0.4)", pointerEvents:"none", zIndex:1 }} />

      {/* Corner ornament top-left */}
      <svg style={{ position:"absolute", top:6, left:6, zIndex:2 }} width="80" height="80" viewBox="0 0 100 100">
        <g fill="none" stroke="#c9a84c" strokeWidth="1.5">
          <path d="M8,8 L8,46 Q8,58 20,58 L58,58"/><path d="M8,8 L46,8 Q58,8 58,20 L58,58"/>
          <circle cx="8" cy="8" r="3" fill="#c9a84c"/><circle cx="58" cy="58" r="3" fill="#c9a84c"/>
          <circle cx="33" cy="33" r="11" strokeWidth="1"/><circle cx="33" cy="33" r="4" fill="#c9a84c" stroke="none"/>
          <path d="M33,18 Q37,23 33,28 Q29,23 33,18Z" fill="#c9a84c" stroke="none"/>
          <path d="M33,38 Q37,43 33,48 Q29,43 33,38Z" fill="#c9a84c" stroke="none"/>
          <path d="M18,33 Q23,37 28,33 Q23,29 18,33Z" fill="#c9a84c" stroke="none"/>
          <path d="M38,33 Q43,37 48,33 Q43,29 38,33Z" fill="#c9a84c" stroke="none"/>
          <path d="M8,22 Q3,27 8,32" strokeWidth="1.2"/><path d="M22,8 Q27,3 32,8" strokeWidth="1.2"/>
          <path d="M58,44 Q63,39 58,34" strokeWidth="1.2"/><path d="M44,58 Q39,63 34,58" strokeWidth="1.2"/>
        </g>
      </svg>

      {/* Corner ornament bottom-right */}
      <svg style={{ position:"absolute", bottom:6, right:6, zIndex:2 }} width="80" height="80" viewBox="0 0 100 100">
        <g fill="none" stroke="#c9a84c" strokeWidth="1.5" transform="rotate(180,50,50)">
          <path d="M8,8 L8,46 Q8,58 20,58 L58,58"/><path d="M8,8 L46,8 Q58,8 58,20 L58,58"/>
          <circle cx="8" cy="8" r="3" fill="#c9a84c"/><circle cx="58" cy="58" r="3" fill="#c9a84c"/>
          <circle cx="33" cy="33" r="11" strokeWidth="1"/><circle cx="33" cy="33" r="4" fill="#c9a84c" stroke="none"/>
          <path d="M33,18 Q37,23 33,28 Q29,23 33,18Z" fill="#c9a84c" stroke="none"/>
          <path d="M33,38 Q37,43 33,48 Q29,43 33,38Z" fill="#c9a84c" stroke="none"/>
          <path d="M18,33 Q23,37 28,33 Q23,29 18,33Z" fill="#c9a84c" stroke="none"/>
          <path d="M38,33 Q43,37 48,33 Q43,29 38,33Z" fill="#c9a84c" stroke="none"/>
          <path d="M8,22 Q3,27 8,32" strokeWidth="1.2"/><path d="M22,8 Q27,3 32,8" strokeWidth="1.2"/>
          <path d="M58,44 Q63,39 58,34" strokeWidth="1.2"/><path d="M44,58 Q39,63 34,58" strokeWidth="1.2"/>
        </g>
      </svg>

      {/* MAIN CONTENT — 20px top padding */}
      <div style={{ position:"relative", zIndex:3, display:"flex", flexDirection:"column", alignItems:"center", paddingTop:"20px", paddingLeft:"80px", paddingRight:"80px" }}>

        {/* Logo (doubled: 128px) + Title — logo left, title starts right of logo */}
        <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"4px", width:"100%", paddingLeft:"0" }}>
          <img src={logo} alt="TSS" style={{ height:"70px", objectFit:"contain", opacity:1, flexShrink:0 }} />
          <div>
            <h1 style={{ fontSize:"34px", fontWeight:"900", letterSpacing:"8px", color:"#1a1a1a", margin:0, fontFamily:"Arial Black, sans-serif", textTransform:"uppercase", lineHeight:1.1 }}>
              CERTIFICATE
            </h1>
            <p style={{ fontSize:"11px", letterSpacing:"5px", color:"#555", textTransform:"uppercase", margin:"2px 0 0", fontFamily:"Arial, sans-serif" }}>
              OF ACHIEVEMENT
            </p>
            <div style={{ display:"flex", alignItems:"center", gap:"6px", marginTop:"4px" }}>
              <div style={{ width:"55px", height:"1px", background:"linear-gradient(to right,transparent,#c9a84c)" }} />
              <span style={{ color:"#c9a84c", fontSize:"12px" }}>✦</span>
              <div style={{ width:"55px", height:"1px", background:"linear-gradient(to left,transparent,#c9a84c)" }} />
            </div>
          </div>
        </div>

        <p style={{ fontSize:"12px", color:"#555", margin:"0 0 1px" }}>This certificate is proudly presented to</p>

        {/* Student name */}
        <p style={{ fontSize:"48px", fontFamily:"'Dancing Script','Brush Script MT',cursive", color:"#1a1a1a", margin:"0", lineHeight:1.05, fontWeight:"700" }}>
          {studentName}
        </p>

        {/* Dotted separator */}
        <div style={{ display:"flex", gap:"3px", margin:"2px 0 5px" }}>
          {Array.from({ length: 50 }).map((_, i) => (
            <div key={i} style={{ width:"5px", height:"1.5px", background: i%6===0 ? "#c9a84c" : "rgba(201,168,76,0.35)" }} />
          ))}
        </div>

        {/* Body */}
        <p style={{ fontSize:"12px", color:"#333", textAlign:"center", lineHeight:"1.7", margin:"0 0 3px", maxWidth:"620px" }}>
          {registrationNo && <><strong>{registrationNo}</strong> — </>}
          of <strong>{collegeName}</strong> for successfully completing {description}{" "}
          <strong>"{programName}"</strong> conducted by TechSign Solutions Pvt Ltd (TSS) from{" "}
          <strong>{startDate}</strong> to <strong>{endDate}</strong>.
        </p>
        {extraNote && (
          <p style={{ fontSize:"11px", color:"#444", textAlign:"center", lineHeight:"1.6", margin:"2px 0 0", maxWidth:"580px", fontStyle:"italic" }}>
            {extraNote}
          </p>
        )}
      </div>

      {/* SIGNATURE BLOCK — all at same horizontal center (sigLeft), stacked vertically */}
      {/* stamp behind */}
      <img src={stamp} alt="stamp" style={{
        position:"absolute", bottom:"52px", left:sigLeft, transform:"translateX(-50%)",
        width:"80px", height:"80px", objectFit:"contain", opacity:0.55, zIndex:3,
      }} />
      {/* sign on top — bigger: 60px height */}
      <img src={sign} alt="sign" style={{
        position:"absolute", bottom:"100px", left:sigLeft, transform:"translateX(-50%)",
        height:"60px", objectFit:"contain", zIndex:4,
      }} />
      {/* underline */}
      <div style={{
        position:"absolute", bottom:"48px", left:sigLeft, transform:"translateX(-50%)",
        width:"180px", height:"1px", background:"#1a1a1a", zIndex:5,
      }} />
      {/* SIGNATURE text */}
      <p style={{
        position:"absolute", bottom:"30px", left:sigLeft, transform:"translateX(-50%)",
        width:"200px", textAlign:"center",
        fontSize:"10px", letterSpacing:"3px", color:"#555", textTransform:"uppercase",
        margin:0, fontFamily:"Arial, sans-serif", zIndex:5,
      }}>Signature</p>
      {/* CEO label */}
      <p style={{
        position:"absolute", bottom:"12px", left:sigLeft, transform:"translateX(-50%)",
        width:"260px", textAlign:"center",
        fontSize:"11px", fontWeight:"700", color:"#1a1a1a",
        margin:0, fontFamily:"Arial, sans-serif", zIndex:5,
      }}>CEO, TechSign Solutions Pvt. Ltd</p>
    </div>
  );
}
