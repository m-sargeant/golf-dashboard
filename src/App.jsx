import { useState, useRef, useEffect } from "react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip,
  LineChart, Line, ReferenceLine,
} from "recharts";

function approxFaceAngle(s) {
  return +(s.launchDir - s.spinAxis * 0.15).toFixed(1);
}

const ALL_SHOTS = {
  PW: {
    color: "#4ade80",
    shots: [
      { shot:1,  carry:101.7, total:110.5, ballSpeed:82.2,  launch:20.6, launchDir:0.9,   apex:46.4, side:0.4,   clubSpeed:70.1, smash:1.17, descent:37.9, attack:-6.8, clubPath:5.4,  spin:6978,  spinAxis:-1.7 },
      { shot:2,  carry:113.8, total:122.5, ballSpeed:85.8,  launch:25.4, launchDir:1.2,   apex:66.5, side:1.4,   clubSpeed:73.5, smash:1.17, descent:43.9, attack:-6.8, clubPath:6.4,  spin:4144,  spinAxis:-1.1 },
      { shot:3,  carry:117.1, total:124.7, ballSpeed:88.3,  launch:24.4, launchDir:-1.6,  apex:67.6, side:-2.4,  clubSpeed:73.5, smash:1.20, descent:44.4, attack:-6.4, clubPath:5.1,  spin:5046,  spinAxis:1.6  },
      { shot:4,  carry:118.2, total:124.7, ballSpeed:91.1,  launch:22.9, launchDir:3.4,   apex:67.3, side:11.8,  clubSpeed:72.9, smash:1.25, descent:44.6, attack:-6.7, clubPath:9.3,  spin:7015,  spinAxis:6.3  },
      { shot:5,  carry:123.6, total:131.3, ballSpeed:92.9,  launch:22.3, launchDir:1.2,   apex:68.4, side:0.3,   clubSpeed:72.9, smash:1.27, descent:43.8, attack:-4.9, clubPath:7.0,  spin:5495,  spinAxis:-2.4 },
      { shot:6,  carry:120.3, total:125.8, ballSpeed:91.9,  launch:25.2, launchDir:3.2,   apex:77.7, side:5.5,   clubSpeed:75.1, smash:1.22, descent:47.7, attack:-5.9, clubPath:7.1,  spin:6602,  spinAxis:-1.2 },
      { shot:7,  carry:128.0, total:134.6, ballSpeed:95.9,  launch:22.1, launchDir:-1.4,  apex:73.6, side:-8.2,  clubSpeed:75.1, smash:1.28, descent:45.2, attack:-6.5, clubPath:4.7,  spin:6139,  spinAxis:-5.1 },
      { shot:8,  carry:111.6, total:114.9, ballSpeed:88.5,  launch:27.1, launchDir:-0.6,  apex:76.7, side:-1.3,  clubSpeed:75.1, smash:1.18, descent:49.1, attack:-4.7, clubPath:4.0,  spin:5692,  spinAxis:0.2  },
      { shot:9,  carry:145.5, total:154.3, ballSpeed:97.4,  launch:24.3, launchDir:-1.5,  apex:78.3, side:-8.2,  clubSpeed:76.2, smash:1.28, descent:42.3, attack:-3.2, clubPath:4.1,  spin:5968,  spinAxis:-4.6 },
      { shot:10, carry:129.1, total:133.5, ballSpeed:95.9,  launch:27.3, launchDir:0.6,   apex:93.1, side:1.3,   clubSpeed:76.2, smash:1.26, descent:50.6, attack:-4.5, clubPath:4.4,  spin:5224,  spinAxis:0.2  },
    ]
  },
  "9i": {
    color: "#60a5fa",
    shots: [
      { shot:1,  carry:140.0, total:146.6, ballSpeed:102.8, launch:21.7, launchDir:-1.7,  apex:84.5,  side:-12.3, clubSpeed:78.5, smash:1.31, descent:47.3, attack:-4.7, clubPath:4.1,  spin:6169,  spinAxis:-7.0 },
      { shot:2,  carry:119.2, total:129.1, ballSpeed:86.5,  launch:24.9, launchDir:-0.2,  apex:64.0,  side:-3.8,  clubSpeed:75.1, smash:1.15, descent:41.3, attack:0.5,  clubPath:9.9,  spin:5368,  spinAxis:-4.7 },
      { shot:3,  carry:141.1, total:146.6, ballSpeed:102.3, launch:24.9, launchDir:-0.0,  apex:96.5,  side:2.3,   clubSpeed:77.4, smash:1.32, descent:50.0, attack:-4.1, clubPath:5.7,  spin:5114,  spinAxis:2.5  },
      { shot:4,  carry:123.6, total:126.9, ballSpeed:98.5,  launch:22.1, launchDir:0.9,   apex:74.2,  side:-1.6,  clubSpeed:76.2, smash:1.29, descent:47.4, attack:-4.4, clubPath:4.1,  spin:5495,  spinAxis:-3.8 },
      { shot:5,  carry:136.8, total:142.2, ballSpeed:100.8, launch:24.5, launchDir:-0.6,  apex:92.4,  side:-5.3,  clubSpeed:77.4, smash:1.30, descent:49.7, attack:-2.6, clubPath:5.8,  spin:5951,  spinAxis:-3.3 },
      { shot:6,  carry:135.7, total:141.1, ballSpeed:99.4,  launch:26.0, launchDir:-1.0,  apex:95.3,  side:-6.6,  clubSpeed:77.9, smash:1.28, descent:50.2, attack:-2.3, clubPath:5.2,  spin:4916,  spinAxis:-3.7 },
      { shot:7,  carry:125.8, total:129.1, ballSpeed:98.6,  launch:25.1, launchDir:1.3,   apex:88.7,  side:2.3,   clubSpeed:76.2, smash:1.29, descent:50.9, attack:-3.1, clubPath:6.2,  spin:5495,  spinAxis:-0.4 },
      { shot:8,  carry:126.9, total:133.5, ballSpeed:94.3,  launch:24.2, launchDir:0.3,   apex:78.1,  side:-0.9,  clubSpeed:75.1, smash:1.26, descent:46.6, attack:-4.5, clubPath:3.9,  spin:5368,  spinAxis:-1.4 },
      { shot:9,  carry:132.4, total:137.8, ballSpeed:98.6,  launch:24.7, launchDir:2.1,   apex:88.7,  side:0.5,   clubSpeed:74.6, smash:1.32, descent:49.2, attack:-2.6, clubPath:8.0,  spin:6066,  spinAxis:-4.0 },
      { shot:10, carry:130.2, total:135.7, ballSpeed:98.1,  launch:27.6, launchDir:2.0,   apex:99.1,  side:1.6,   clubSpeed:76.2, smash:1.29, descent:51.8, attack:-1.9, clubPath:4.3,  spin:5619,  spinAxis:-2.8 },
    ]
  },
  "8i": {
    color: "#f472b6",
    shots: [
      { shot:1,  carry:149.9, total:156.4, ballSpeed:108.4, launch:19.0, launchDir:-1.2,  apex:83.5,  side:-11.1, clubSpeed:79.6, smash:1.36, descent:46.1, attack:-2.9, clubPath:5.2,  spin:6236,  spinAxis:-6.3 },
      { shot:2,  carry:143.3, total:148.8, ballSpeed:104.7, launch:21.9, launchDir:1.0,   apex:89.3,  side:-3.0,  clubSpeed:77.4, smash:1.35, descent:48.2, attack:-0.7, clubPath:6.6,  spin:6065,  spinAxis:-4.6 },
      { shot:3,  carry:144.4, total:149.9, ballSpeed:106.0, launch:23.1, launchDir:2.3,   apex:97.2,  side:-0.1,  clubSpeed:78.5, smash:1.35, descent:49.9, attack:-1.7, clubPath:7.0,  spin:5975,  spinAxis:-4.7 },
      { shot:4,  carry:138.9, total:145.5, ballSpeed:102.5, launch:22.0, launchDir:3.5,   apex:85.7,  side:7.5,   clubSpeed:80.1, smash:1.28, descent:47.7, attack:-4.4, clubPath:5.1,  spin:6263,  spinAxis:-0.7 },
    ]
  }
};

const CLUB_NAMES = Object.keys(ALL_SHOTS);
const clubColors = { PW: "#4ade80", "9i": "#60a5fa", "8i": "#f472b6" };

function avg(shots, key) {
  return +(shots.reduce((s, x) => s + x[key], 0) / shots.length).toFixed(2);
}
function stddev(shots, key) {
  const m = avg(shots, key);
  return +(Math.sqrt(shots.reduce((s, x) => s + Math.pow(x[key] - m, 2), 0) / shots.length)).toFixed(2);
}
function isOutlier(val, mean, sd) {
  return Math.abs(val - mean) > 2.0 * sd;
}

const ALL_METRICS = [
  { key: "carry", label: "Carry", unit: "yds" },
  { key: "total", label: "Total", unit: "yds" },
  { key: "ballSpeed", label: "Ball Speed", unit: "mph" },
  { key: "clubSpeed", label: "Club Speed", unit: "mph" },
  { key: "smash", label: "Smash Factor", unit: "" },
  { key: "launch", label: "Launch Angle", unit: "°" },
  { key: "launchDir", label: "Launch Dir", unit: "°" },
  { key: "apex", label: "Apex", unit: "ft" },
  { key: "side", label: "Side Carry", unit: "yds" },
  { key: "descent", label: "Descent Angle", unit: "°" },
  { key: "attack", label: "Attack Angle", unit: "°" },
  { key: "clubPath", label: "Club Path", unit: "°" },
  { key: "spin", label: "Spin Rate", unit: "rpm" },
  { key: "spinAxis", label: "Spin Axis", unit: "°" },
];

// Green View using canvas
function GreenView({ shots, color }) {
  const canvasRef = useRef(null);
  const GREEN_RADIUS_YDS = 10;
  const avgCarry = +avg(shots, "carry");
  const sideMean = +avg(shots, "side");
  const sideSD = +stddev(shots, "side");
  const carrySD = +stddev(shots, "carry");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;
    const scale = (Math.min(W, H) * 0.38) / GREEN_RADIUS_YDS;

    ctx.clearRect(0, 0, W, H);

    // Rough
    ctx.beginPath();
    ctx.arc(cx, cy, GREEN_RADIUS_YDS * scale * 1.55, 0, Math.PI * 2);
    ctx.fillStyle = "#0a1a0a";
    ctx.fill();

    // Fringe
    ctx.beginPath();
    ctx.arc(cx, cy, GREEN_RADIUS_YDS * scale * 1.15, 0, Math.PI * 2);
    ctx.fillStyle = "#0d2010";
    ctx.fill();

    // Green
    ctx.beginPath();
    ctx.arc(cx, cy, GREEN_RADIUS_YDS * scale, 0, Math.PI * 2);
    ctx.fillStyle = "#0f2d13";
    ctx.fill();
    ctx.strokeStyle = "#1a4020";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Grid
    ctx.strokeStyle = "#1a3a1a";
    ctx.lineWidth = 0.5;
    for (let i = -GREEN_RADIUS_YDS; i <= GREEN_RADIUS_YDS; i += 5) {
      const px = cx + i * scale;
      const py = cy + i * scale;
      ctx.beginPath(); ctx.moveTo(px, cy - GREEN_RADIUS_YDS * scale); ctx.lineTo(px, cy + GREEN_RADIUS_YDS * scale); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx - GREEN_RADIUS_YDS * scale, py); ctx.lineTo(cx + GREEN_RADIUS_YDS * scale, py); ctx.stroke();
    }

    // Crosshairs
    ctx.strokeStyle = "#2a5a30";
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(cx, cy - GREEN_RADIUS_YDS * scale); ctx.lineTo(cx, cy + GREEN_RADIUS_YDS * scale); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx - GREEN_RADIUS_YDS * scale, cy); ctx.lineTo(cx + GREEN_RADIUS_YDS * scale, cy); ctx.stroke();
    ctx.setLineDash([]);

    // Shots
    shots.forEach((s) => {
      const dx = s.side;
      const dy = s.carry - avgCarry;
      const px = cx + dx * scale;
      const py = cy - dy * scale;
      const offGreen = Math.sqrt(dx * dx + dy * dy) > GREEN_RADIUS_YDS;
      const outlier = isOutlier(s.carry, avgCarry, carrySD) || isOutlier(s.side, sideMean, sideSD);
      const dotColor = outlier ? "#f59e0b" : offGreen ? "#fb7185" : color;

      ctx.beginPath();
      ctx.arc(px, py, 7, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0,0,0,0.4)";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(px, py, 5.5, 0, Math.PI * 2);
      ctx.fillStyle = dotColor;
      ctx.fill();
      ctx.strokeStyle = "#0a0f1e";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = "#0a0f1e";
      ctx.font = "bold 7px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(s.shot, px, py);
    });

    // Pin
    ctx.fillStyle = "#f1f5f9";
    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#0a0f1e";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx, cy - 4);
    ctx.lineTo(cx, cy - 18);
    ctx.stroke();
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.moveTo(cx, cy - 18);
    ctx.lineTo(cx + 10, cy - 14);
    ctx.lineTo(cx, cy - 10);
    ctx.fill();

    // Labels
    ctx.fillStyle = "#334155";
    ctx.font = "9px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`+${GREEN_RADIUS_YDS} yds`, cx, cy - GREEN_RADIUS_YDS * scale - 10);
    ctx.fillText(`-${GREEN_RADIUS_YDS} yds`, cx, cy + GREEN_RADIUS_YDS * scale + 10);
    ctx.textAlign = "right";
    ctx.fillText(`L${GREEN_RADIUS_YDS}`, cx - GREEN_RADIUS_YDS * scale - 4, cy);
    ctx.textAlign = "left";
    ctx.fillText(`R${GREEN_RADIUS_YDS}`, cx + GREEN_RADIUS_YDS * scale + 4, cy);

  }, [shots, color, avgCarry, carrySD, sideMean, sideSD]);

  const offGreenShots = shots.filter(s => {
    const dx = s.side;
    const dy = s.carry - avgCarry;
    return Math.sqrt(dx * dx + dy * dy) > GREEN_RADIUS_YDS;
  });

  return (
    <div style={{ background: "#0a1005", borderRadius: 12, padding: 14, border: "1px solid #1a3a1a" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <div>
          <div style={{ fontSize: 10, color: "#475569", textTransform: "uppercase", letterSpacing: "0.1em" }}>Green View · 20yd diameter</div>
          <div style={{ fontSize: 10, color: "#334155", marginTop: 3 }}>Pin = avg carry ({avgCarry} yds) · up = long · right = right</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 3, alignItems: "flex-end" }}>
          <span style={{ fontSize: 9, color }}>● on green</span>
          <span style={{ fontSize: 9, color: "#fb7185" }}>● off green</span>
          <span style={{ fontSize: 9, color: "#f59e0b" }}>● outlier</span>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        width={300}
        height={300}
        style={{ width: "100%", maxWidth: 340, display: "block", margin: "0 auto" }}
      />
      <div style={{ fontSize: 10, marginTop: 8, color: offGreenShots.length > 0 ? "#fb7185" : "#4ade80" }}>
        {offGreenShots.length > 0
          ? `⚠ S${offGreenShots.map(s => s.shot).join(", S")} missed the green`
          : "✓ All shots on the green"}
      </div>
    </div>
  );
}

// Variance card
function VarianceCard({ shots, label, unit, color, getVal, metricKey }) {
  const vals = shots.map(s => getVal ? getVal(s) : s[metricKey]);
  const mean = +(vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2);
  const sd = +(Math.sqrt(vals.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / vals.length)).toFixed(2);
  const data = shots.map(s => {
    const v = getVal ? getVal(s) : s[metricKey];
    return { name: `S${s.shot}`, value: v, outlier: Math.abs(v - mean) > 2 * sd };
  });
  const allVals = data.map(d => d.value);
  const minV = Math.min(...allVals);
  const maxV = Math.max(...allVals);
  const pad = (maxV - minV) * 0.4 || 1;
  const hasOutlier = data.some(d => d.outlier);

  return (
    <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, padding: "14px 12px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div>
          <div style={{ fontSize: 10, color: "#475569", textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</div>
          <div style={{ fontSize: 10, color: "#334155", marginTop: 2 }}>σ {sd}{unit}</div>
        </div>
        <div style={{ fontSize: 20, fontWeight: 700, color }}>{mean}<span style={{ fontSize: 11, color: "#475569", marginLeft: 2 }}>{unit}</span></div>
      </div>
      <ResponsiveContainer width="100%" height={80}>
        <LineChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          <YAxis domain={[minV - pad, maxV + pad]} hide />
          <ReferenceLine y={mean} stroke={color + "44"} strokeDasharray="3 2" />
          <Line
            type="monotone" dataKey="value" stroke={color} strokeWidth={1.5}
            dot={(props) => {
              const { cx, cy, payload } = props;
              return <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={payload.outlier ? 5 : 2.5}
                fill={payload.outlier ? "#f59e0b" : color} stroke="#0a0f1e" strokeWidth={1} />;
            }}
            activeDot={false}
          />
        </LineChart>
      </ResponsiveContainer>
      {hasOutlier && (
        <div style={{ fontSize: 10, color: "#f59e0b", marginTop: 6 }}>
          ⚠ {data.filter(d => d.outlier).map(d => d.name).join(", ")} outlier
        </div>
      )}
    </div>
  );
}

function StatPill({ label, value, unit, color }) {
  return (
    <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 10, padding: "12px 14px" }}>
      <div style={{ fontSize: 10, color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 600, color: color || "#94a3b8" }}>
        {value}<span style={{ fontSize: 11, color: "#475569", marginLeft: 3 }}>{unit}</span>
      </div>
    </div>
  );
}

const TABS = ["Overview", "Variance", "Charts", "Table"];

export default function GolfDash() {
  const [activeClub, setActiveClub] = useState("PW");
  const [activeTab, setActiveTab] = useState("Overview");
  const club = ALL_SHOTS[activeClub];
  const shots = club.shots;
  const color = club.color;

  const stats = Object.fromEntries(ALL_METRICS.map(m => [m.key, +avg(shots, m.key)]));
  stats.carryDev = +stddev(shots, "carry");
  const spinSd = +stddev(shots, "spin");
  const spinMean = +avg(shots, "spin");
  const carryData = shots.map(s => ({ name: `S${s.shot}`, carry: s.carry, total: s.total }));

  const radarKeys = ["carry", "ballSpeed", "smash", "spin", "apex", "launch"];
  const radarLabels = { carry: "Carry", ballSpeed: "Ball Spd", smash: "Smash", spin: "Spin", apex: "Apex", launch: "Launch" };
  const allAvgs = Object.fromEntries(CLUB_NAMES.map(c => [c, Object.fromEntries(radarKeys.map(k => [k, +avg(ALL_SHOTS[c].shots, k)]))]));
  const ranges = Object.fromEntries(radarKeys.map(k => {
    const vals = CLUB_NAMES.map(c => allAvgs[c][k]);
    return [k, { min: Math.min(...vals), max: Math.max(...vals) }];
  }));
  const radarData = radarKeys.map(k => {
    const entry = { metric: radarLabels[k] };
    CLUB_NAMES.forEach(c => {
      const { min, max } = ranges[k];
      entry[c] = max === min ? 50 : Math.round(((allAvgs[c][k] - min) / (max - min)) * 60 + 20);
    });
    return entry;
  });

  const tooltipStyle = { background: "#0a0f1e", border: "1px solid #1e293b", borderRadius: 8, fontSize: 11 };

  return (
    <div style={{ background: "#0a0f1e", minHeight: "100vh", color: "#e2e8f0", fontFamily: "'Inter','Helvetica Neue',sans-serif", paddingBottom: 80 }}>

      <div style={{ padding: "20px 16px 0", background: "#0a0f1e", position: "sticky", top: 0, zIndex: 10, borderBottom: "1px solid #1e293b", paddingBottom: 12 }}>
        <div style={{ fontSize: 10, letterSpacing: "0.16em", color: "#64748b", textTransform: "uppercase", marginBottom: 4 }}>Rapsodo MLM2PRO · 06/27/2026</div>
        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", color: "#f1f5f9", marginBottom: 12 }}>Michael's Golf Dashboard</div>
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          {CLUB_NAMES.map(c => (
            <button key={c} onClick={() => setActiveClub(c)} style={{
              flex: 1, padding: "8px 0", borderRadius: 8,
              border: `1.5px solid ${activeClub === c ? clubColors[c] : "#1e293b"}`,
              background: activeClub === c ? clubColors[c] + "22" : "#0f172a",
              color: activeClub === c ? clubColors[c] : "#64748b",
              fontWeight: 600, fontSize: 15, cursor: "pointer"
            }}>{c}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setActiveTab(t)} style={{
              flex: 1, padding: "7px 0", borderRadius: 6, border: "none",
              background: activeTab === t ? color + "22" : "transparent",
              color: activeTab === t ? color : "#475569",
              fontWeight: activeTab === t ? 600 : 400, fontSize: 12, cursor: "pointer"
            }}>{t}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "16px" }}>

        {activeTab === "Overview" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
              <div style={{ background: "#0f172a", border: `1px solid ${color}33`, borderRadius: 12, padding: "16px", gridColumn: "1 / -1" }}>
                <div style={{ fontSize: 10, color: "#475569", textTransform: "uppercase", letterSpacing: "0.1em" }}>Carry Distance</div>
                <div style={{ fontSize: 42, fontWeight: 700, color, lineHeight: 1, marginTop: 6 }}>
                  {stats.carry}<span style={{ fontSize: 16, color: "#64748b", marginLeft: 6, fontWeight: 400 }}>yds</span>
                </div>
                <div style={{ fontSize: 12, color: "#334155", marginTop: 6 }}>±{stats.carryDev} yds std dev · {shots.length} shots</div>
              </div>
              <StatPill label="Ball Speed" value={stats.ballSpeed} unit="mph" color={color} />
              <StatPill label="Smash Factor" value={stats.smash} unit="" color={color} />
              <StatPill label="Spin Rate" value={Math.round(stats.spin).toLocaleString()} unit="rpm" />
              <StatPill label="Club Speed" value={stats.clubSpeed} unit="mph" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
              {[
                { label: "Launch°", value: stats.launch, unit: "°" },
                { label: "Apex", value: stats.apex, unit: "ft" },
                { label: "Descent°", value: stats.descent, unit: "°" },
                { label: "Attack°", value: stats.attack, unit: "°" },
                { label: "Club Path°", value: stats.clubPath, unit: "°" },
                { label: "Side", value: stats.side, unit: "yds" },
              ].map(({ label, value, unit }) => (
                <StatPill key={label} label={label} value={value} unit={unit} />
              ))}
            </div>
            <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, padding: "16px" }}>
              <div style={{ fontSize: 10, color: "#475569", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Club Comparison</div>
              <ResponsiveContainer width="100%" height={200}>
                <RadarChart data={radarData} cx="50%" cy="50%" outerRadius={70}>
                  <PolarGrid stroke="#1e293b" />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: "#64748b", fontSize: 10 }} />
                  {CLUB_NAMES.map(c => (
                    <Radar key={c} name={c} dataKey={c} stroke={clubColors[c]} fill={clubColors[c]}
                      fillOpacity={activeClub === c ? 0.15 : 0.04}
                      strokeWidth={activeClub === c ? 2 : 1}
                      strokeOpacity={activeClub === c ? 1 : 0.3} />
                  ))}
                </RadarChart>
              </ResponsiveContainer>
              <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 4 }}>
                {CLUB_NAMES.map(c => (
                  <span key={c} style={{ fontSize: 11, color: clubColors[c], opacity: activeClub === c ? 1 : 0.4 }}>● {c}</span>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === "Variance" && (
          <>
            <div style={{ fontSize: 11, color: "#334155", marginBottom: 14 }}>
              Shot-by-shot consistency · <span style={{ color: "#f59e0b" }}>●</span> outlier (±2σ)
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <VarianceCard shots={shots} label="Face Angle" unit="°" color={color} getVal={approxFaceAngle} />
              <VarianceCard shots={shots} label="Club Path" unit="°" color={color} metricKey="clubPath" />
              <VarianceCard shots={shots} label="Launch Angle" unit="°" color={color} metricKey="launch" />
              <VarianceCard shots={shots} label="Smash Factor" unit="" color={color} metricKey="smash" />
              <VarianceCard shots={shots} label="Side Carry" unit=" yds" color={color} metricKey="side" />
              <VarianceCard shots={shots} label="Spin Rate" unit=" rpm" color={color} metricKey="spin" />
              <VarianceCard shots={shots} label="Carry" unit=" yds" color={color} metricKey="carry" />
              <VarianceCard shots={shots} label="Ball Speed" unit=" mph" color={color} metricKey="ballSpeed" />
            </div>
          </>
        )}

        {activeTab === "Charts" && (
          <>
            <div style={{ marginBottom: 12 }}>
              <GreenView shots={shots} color={color} />
            </div>
            <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, padding: "16px" }}>
              <div style={{ fontSize: 10, color: "#475569", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>Carry vs Total Distance</div>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={carryData} barGap={2}>
                  <XAxis dataKey="name" tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} width={34} />
                  <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: "#94a3b8" }} />
                  <Bar dataKey="carry" name="Carry" fill={color} radius={[3, 3, 0, 0]} />
                  <Bar dataKey="total" name="Total" fill={color + "44"} radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 8 }}>
                <span style={{ fontSize: 11, color }}>● Carry</span>
                <span style={{ fontSize: 11, color: color + "99" }}>● Total</span>
              </div>
            </div>
          </>
        )}

        {activeTab === "Table" && (
          <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, padding: "16px" }}>
            <div style={{ fontSize: 10, color: "#475569", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>All Shots</div>
            <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, minWidth: 700 }}>
                <thead>
                  <tr>
                    {["#", "Carry", "Total", "Ball", "Club", "Smash", "Launch°", "Apex", "Side", "Spin"].map(h => (
                      <th key={h} style={{ textAlign: "right", color: "#334155", fontWeight: 600, paddingBottom: 10, paddingRight: 10, whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {shots.map((s, i) => {
                    const spinFlag = isOutlier(s.spin, spinMean, spinSd);
                    return (
                      <tr key={i} style={{ borderTop: "1px solid #0f1929", background: spinFlag ? "#f59e0b08" : "transparent" }}>
                        <td style={{ textAlign: "right", padding: "9px 10px 9px 0", color, whiteSpace: "nowrap" }}>{s.shot}</td>
                        <td style={{ textAlign: "right", padding: "9px 10px 9px 0", color: "#94a3b8", whiteSpace: "nowrap" }}>{s.carry}</td>
                        <td style={{ textAlign: "right", padding: "9px 10px 9px 0", color: "#94a3b8", whiteSpace: "nowrap" }}>{s.total}</td>
                        <td style={{ textAlign: "right", padding: "9px 10px 9px 0", color: "#94a3b8", whiteSpace: "nowrap" }}>{s.ballSpeed}</td>
                        <td style={{ textAlign: "right", padding: "9px 10px 9px 0", color: "#94a3b8", whiteSpace: "nowrap" }}>{s.clubSpeed}</td>
                        <td style={{ textAlign: "right", padding: "9px 10px 9px 0", color: "#94a3b8", whiteSpace: "nowrap" }}>{s.smash}</td>
                        <td style={{ textAlign: "right", padding: "9px 10px 9px 0", color: "#94a3b8", whiteSpace: "nowrap" }}>{s.launch}</td>
                        <td style={{ textAlign: "right", padding: "9px 10px 9px 0", color: "#94a3b8", whiteSpace: "nowrap" }}>{s.apex}</td>
                        <td style={{ textAlign: "right", padding: "9px 10px 9px 0", color: "#94a3b8", whiteSpace: "nowrap" }}>{s.side}</td>
                        <td style={{ textAlign: "right", padding: "9px 10px 9px 0", color: spinFlag ? "#f59e0b" : "#94a3b8", fontWeight: spinFlag ? 700 : 400, whiteSpace: "nowrap" }}>
                          {Math.round(s.spin).toLocaleString()}{spinFlag ? " ⚠" : ""}
                        </td>
                      </tr>
                    );
                  })}
                  <tr style={{ borderTop: "2px solid #1e293b" }}>
                    {["Avg", avg(shots,"carry"), avg(shots,"total"), avg(shots,"ballSpeed"), avg(shots,"clubSpeed"),
                      avg(shots,"smash"), avg(shots,"launch"), avg(shots,"apex"), avg(shots,"side"),
                      Math.round(avg(shots,"spin")).toLocaleString()
                    ].map((v, i) => (
                      <td key={i} style={{ textAlign: "right", padding: "10px 10px 0 0", color: "#f1f5f9", fontWeight: 700, whiteSpace: "nowrap" }}>{v}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
