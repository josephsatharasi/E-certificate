import { useState, useRef } from "react";
import * as XLSX from "xlsx";
import Certificate from "./Certificate";
import { downloadCert, downloadCertToBlob } from "./downloadCert";

const PROGRAMS = [
  "Industry Ready Java Full Stack Developer Program",
  "Industry Ready MERN Stack Developer Program",
  "Industry Ready Python Full Stack Developer Program",
  "Workshop on Web Development",
  "Workshop on Data Science & AI",
  "Workshop on Cloud Computing",
  "CRT – Campus Recruitment Training",
];

const initialForm = {
  programName: "", customProgram: "",
  startDate: "", endDate: "",
  description: "", extraNote: "",
};

export default function CertificateForm() {
  const [form, setForm] = useState(initialForm);
  const [students, setStudents] = useState([]); // [{studentName, registrationNo, collegeName}]
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkProgress, setBulkProgress] = useState(0);
  const [mode, setMode] = useState("single"); // "single" | "bulk"
  const certRef = useRef();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const resolvedProgram = form.programName === "__custom__" ? form.customProgram : form.programName;

  // ── Parse uploaded file ──
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const wb = XLSX.read(evt.target.result, { type: "binary" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(ws, { defval: "" });
      // Normalize column names (case-insensitive)
      const normalized = rows.map((row) => {
        const lower = {};
        Object.keys(row).forEach((k) => { lower[k.toLowerCase().replace(/\s+/g, "")] = row[k]; });
        return {
          studentName: lower["studentname"] || lower["name"] || lower["student"] || "",
          registrationNo: lower["registrationno"] || lower["regno"] || lower["rollno"] || lower["registration"] || "",
          collegeName: lower["collegename"] || lower["college"] || lower["institution"] || "",
        };
      }).filter((r) => r.studentName);
      setStudents(normalized);
    };
    reader.readAsBinaryString(file);
  };

  // ── Single preview ──
  const handlePreview = (e) => {
    e.preventDefault();
    setPreview(true);
    setTimeout(() => document.getElementById("preview-section")?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  // ── Single download — renders off-screen at full size for pixel-perfect capture ──
  const handleDownload = async () => {
    setLoading(true);
    try {
      await downloadCert({
        studentName: form.studentName,
        registrationNo: form.registrationNo,
        collegeName: form.collegeName,
        programName: resolvedProgram,
        startDate: form.startDate,
        endDate: form.endDate,
        description: form.description,
        extraNote: form.extraNote,
      }, form.studentName || "certificate");
    } catch (err) {
      alert("Download failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Bulk download ──
  const handleBulkDownload = async () => {
    if (!students.length) return alert("Please upload a file with student data first.");
    if (!resolvedProgram) return alert("Please select a program.");
    setBulkLoading(true);
    setBulkProgress(0);

    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();

    const { downloadCertToBlob } = await import("./downloadCert");

    for (let i = 0; i < students.length; i++) {
      const student = students[i];
      const data = {
        ...student,
        programName: resolvedProgram,
        startDate: form.startDate,
        endDate: form.endDate,
        description: form.description,
        extraNote: form.extraNote,
      };
      const blob = await downloadCertToBlob(data);
      const safeName = (student.studentName || `student_${i + 1}`).replace(/[^a-z0-9]/gi, "_");
      zip.file(`${safeName}_certificate.pdf`, blob);
      setBulkProgress(i + 1);
    }

    const zipBlob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement("a");
    a.href = url; a.download = "certificates.zip"; a.click();
    URL.revokeObjectURL(url);
    setBulkLoading(false);
    setBulkProgress(0);
  };

  const inputCls = "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 transition";

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <span className="inline-block bg-yellow-500 text-white text-xs font-bold tracking-widest px-4 py-1 rounded-full mb-3">
            TECHSIGN SOLUTIONS PVT. LTD
          </span>
          <h1 className="text-3xl font-black text-gray-800">Certificate Generator</h1>
          <p className="text-gray-500 text-sm mt-1">Generate certificates for single student or bulk upload</p>
        </div>

        {/* Mode toggle */}
        <div className="flex rounded-xl overflow-hidden border border-gray-200 mb-6">
          <button onClick={() => setMode("single")}
            className={`flex-1 py-2.5 text-sm font-bold transition ${mode === "single" ? "bg-yellow-500 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}>
            Single Certificate
          </button>
          <button onClick={() => setMode("bulk")}
            className={`flex-1 py-2.5 text-sm font-bold transition ${mode === "bulk" ? "bg-yellow-500 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}>
            Bulk Upload & Download
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">

          {/* ── SHARED: Program + Certificate Text ── */}
          <div className="space-y-5">
            <div>
              <p className="text-xs font-bold text-yellow-600 uppercase tracking-widest mb-3">Program Details</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Program / Workshop</label>
                  <select name="programName" value={form.programName} onChange={handleChange} className={inputCls + " bg-white"}>
                    <option value="">-- Select a program --</option>
                    {PROGRAMS.map(p => <option key={p} value={p}>{p}</option>)}
                    <option value="__custom__">Other (type manually)</option>
                  </select>
                </div>
                {form.programName === "__custom__" && (
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Custom Program Name</label>
                    <input name="customProgram" placeholder="Type program name..." value={form.customProgram} onChange={handleChange} className={inputCls} />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input type="date" name="startDate" value={form.startDate} onChange={handleChange} className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input type="date" name="endDate" value={form.endDate} onChange={handleChange} className={inputCls} />
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-yellow-600 uppercase tracking-widest mb-3">Certificate Text</p>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-gray-400 font-normal text-xs">e.g. "150 hours of hands on training"</span>
                  </label>
                  <textarea name="description" rows={2} placeholder="e.g. 150 hours of hands on training" value={form.description} onChange={handleChange}
                    className={inputCls + " resize-none"} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Note <span className="text-gray-400 font-normal text-xs">(optional)</span>
                  </label>
                  <textarea name="extraNote" rows={2}
                    placeholder="e.g. This student has demonstrated great initiative..."
                    value={form.extraNote} onChange={handleChange} className={inputCls + " resize-none"} />
                </div>
              </div>
            </div>

            {/* ── SINGLE MODE ── */}
            {mode === "single" && (
              <form onSubmit={handlePreview}>
                <p className="text-xs font-bold text-yellow-600 uppercase tracking-widest mb-3">Student Details</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Student Full Name</label>
                    <input name="studentName" required placeholder="e.g. Rahul Kumar"
                      value={form.studentName || ""} onChange={handleChange} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Registration No <span className="text-gray-400 font-normal">(optional)</span></label>
                    <input name="registrationNo" placeholder="e.g. 22A91A0501"
                      value={form.registrationNo || ""} onChange={handleChange} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">College Name</label>
                    <input name="collegeName" required placeholder="e.g. Malla Reddy Institute"
                      value={form.collegeName || ""} onChange={handleChange} className={inputCls} />
                  </div>
                </div>
                <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-lg transition">
                  Preview Certificate →
                </button>
              </form>
            )}

            {/* ── BULK MODE ── */}
            {mode === "bulk" && (
              <div>
                <p className="text-xs font-bold text-yellow-600 uppercase tracking-widest mb-3">Upload Student Data</p>

                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-yellow-400 transition">
                  <p className="text-gray-500 text-sm mb-2">Upload Excel (.xlsx), CSV (.csv)</p>
                  <p className="text-gray-400 text-xs mb-4">
                    Required columns: <strong>Student Name</strong>, <strong>College Name</strong><br />
                    Optional: <strong>Registration No</strong>
                  </p>
                  <input type="file" accept=".xlsx,.xls,.csv" onChange={handleFileUpload}
                    className="block mx-auto text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-yellow-500 file:text-white file:font-bold hover:file:bg-yellow-600 cursor-pointer" />
                </div>

                {students.length > 0 && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-gray-700">{students.length} students loaded</p>
                      <button onClick={() => setStudents([])} className="text-xs text-red-500 hover:underline">Clear</button>
                    </div>
                    <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
                      <table className="w-full text-xs">
                        <thead className="bg-gray-50 sticky top-0">
                          <tr>
                            <th className="px-3 py-2 text-left text-gray-600">#</th>
                            <th className="px-3 py-2 text-left text-gray-600">Name</th>
                            <th className="px-3 py-2 text-left text-gray-600">Reg No</th>
                            <th className="px-3 py-2 text-left text-gray-600">College</th>
                          </tr>
                        </thead>
                        <tbody>
                          {students.map((s, i) => (
                            <tr key={i} className="border-t border-gray-100">
                              <td className="px-3 py-1.5 text-gray-400">{i + 1}</td>
                              <td className="px-3 py-1.5 font-medium text-gray-800">{s.studentName}</td>
                              <td className="px-3 py-1.5 text-gray-500">{s.registrationNo || "—"}</td>
                              <td className="px-3 py-1.5 text-gray-500">{s.collegeName || "—"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Progress bar */}
                {bulkLoading && (
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Generating certificates...</span>
                      <span>{bulkProgress} / {students.length}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full transition-all"
                        style={{ width: `${students.length ? (bulkProgress / students.length) * 100 : 0}%` }} />
                    </div>
                  </div>
                )}

                {/* Always-visible download button */}
                <button onClick={handleBulkDownload} disabled={bulkLoading || students.length === 0}
                  className="mt-4 w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-lg transition disabled:opacity-40">
                  {bulkLoading
                    ? `Generating... (${bulkProgress}/${students.length})`
                    : students.length > 0
                      ? `⬇ Download All ${students.length} Certificates (ZIP)`
                      : "⬇ Download All Certificates (upload file first)"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── SINGLE PREVIEW ── */}
        {preview && mode === "single" && (
          <div id="preview-section" className="mt-12 flex flex-col items-center gap-6">
            <h3 className="text-xl font-bold text-gray-700">Certificate Preview</h3>
            <div style={{ width: "100%", overflowX: "auto", display: "flex", justifyContent: "center" }}>
              <div style={{ filter: "drop-shadow(0 8px 40px rgba(0,0,0,0.18))", flexShrink: 0 }}>
                <Certificate
                  data={{
                    studentName: form.studentName,
                    registrationNo: form.registrationNo,
                    collegeName: form.collegeName,
                    programName: resolvedProgram,
                    startDate: form.startDate,
                    endDate: form.endDate,
                    description: form.description,
                    extraNote: form.extraNote,
                  }}
                  certRef={certRef}
                />
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setPreview(false)}
                className="px-6 py-2.5 border border-gray-400 text-gray-700 rounded-lg hover:bg-gray-100 transition text-sm font-medium">
                ← Edit Details
              </button>
              <button onClick={handleDownload} disabled={loading}
                className="px-8 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition font-bold text-sm disabled:opacity-60">
                {loading ? "Generating PDF..." : "⬇ Download Certificate"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
