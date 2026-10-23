const pageWidth = 210;
const margin = 16;
const contentWidth = pageWidth - margin * 2;

const toText = (value, fallback = "Not provided") => {
    if (value === null || value === undefined || value === "") return fallback;
    return String(value).replace(/\s+/g, " ").trim();
};

export const createResultScorecard = async (result) => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ format: "a4", unit: "mm" });
    const examTitle = toText(result.examId?.title, "Examination");
    const candidateName = toText(result.examineeId?.name, "Student");
    const answers = Array.isArray(result.submittedAnswers) ? result.submittedAnswers : [];
    const score = Number(result.score) || 0;
    const totalMarks = Number(result.totalMarks) || 0;
    const passingMarks = Number(result.passingMarks) || 0;
    const percentage = totalMarks > 0 ? Math.max(0, (score / totalMarks) * 100) : 0;
    const correctCount = answers.filter((answer) => answer.isCorrect).length;
    const attemptedCount = answers.filter((answer) => (
        answer.selectedOption !== null
        && answer.selectedOption !== undefined
        && String(answer.selectedOption).trim() !== ""
    )).length;
    const incorrectCount = attemptedCount - correctCount;
    const passed = result.status === "Passed" || result.status === "Pass";
    const statusLabel = passed ? "PASSED" : "FAILED";
    const statusColor = passed ? [16, 137, 92] : [211, 68, 83];

    doc.setFillColor(24, 34, 69);
    doc.rect(0, 0, pageWidth, 54, "F");
    doc.setTextColor(174, 190, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("SMARTEXAM  /  OFFICIAL SCORECARD", margin, 13);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(19);
    doc.text(doc.splitTextToSize(examTitle, 136).slice(0, 2), margin, 24);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Candidate: ${candidateName}`, margin, 44);

    doc.setFillColor(...statusColor);
    doc.roundedRect(159, 18, 35, 12, 6, 6, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(statusLabel, 176.5, 25.7, { align: "center" });

    doc.setFillColor(246, 248, 255);
    doc.roundedRect(margin, 64, contentWidth, 48, 5, 5, "F");
    doc.setTextColor(99, 111, 142);
    doc.setFontSize(9);
    doc.text("FINAL SCORE", margin + 8, 76);
    doc.setTextColor(37, 52, 91);
    doc.setFontSize(28);
    doc.text(`${score}`, margin + 8, 94);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(13);
    doc.setTextColor(117, 128, 153);
    doc.text(`/ ${totalMarks} marks`, margin + 30, 93.5);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(70, 88, 210);
    doc.text(`${percentage.toFixed(1)}%`, pageWidth - margin - 8, 91, { align: "right" });
    doc.setFontSize(8);
    doc.setTextColor(99, 111, 142);
    doc.text("OVERALL PERCENTAGE", pageWidth - margin - 8, 101, { align: "right" });

    const metrics = [
        { label: "CORRECT", value: correctCount, color: [16, 137, 92] },
        { label: "INCORRECT", value: incorrectCount, color: [211, 68, 83] },
        { label: "ATTEMPTED", value: attemptedCount, color: [70, 88, 210] },
        { label: "NOT ATTEMPTED", value: Math.max(answers.length - attemptedCount, 0), color: [190, 128, 39] },
    ];
    const metricGap = 4;
    const metricWidth = (contentWidth - metricGap * 3) / 4;
    metrics.forEach((metric, index) => {
        const x = margin + index * (metricWidth + metricGap);
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(229, 233, 244);
        doc.roundedRect(x, 120, metricWidth, 25, 3, 3, "FD");
        doc.setTextColor(...metric.color);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text(String(metric.value), x + 5, 131);
        doc.setFontSize(6.5);
        doc.text(metric.label, x + 5, 139);
    });

    doc.setTextColor(37, 52, 91);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("RESULT OVERVIEW", margin, 162);
    doc.setDrawColor(229, 233, 244);
    doc.line(margin, 166, pageWidth - margin, 166);

    const examDate = result.createdAt
        ? new Date(result.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        })
        : "Not provided";
    const overview = [
        ["Candidate email", toText(result.examineeId?.email)],
        ["Passing score", `${passingMarks} / ${totalMarks} marks`],
        ["Questions", String(answers.length)],
        ["Exam date", examDate],
    ];
    overview.forEach(([label, value], index) => {
        const column = index % 2;
        const row = Math.floor(index / 2);
        const x = margin + column * (contentWidth / 2);
        const y = 178 + row * 22;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(111, 123, 150);
        doc.text(label.toUpperCase(), x, y);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(37, 52, 91);
        doc.text(doc.splitTextToSize(value, contentWidth / 2 - 8)[0], x, y + 7);
    });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(132, 142, 163);
    doc.text("Generated by SmartExam | Keep this scorecard for your records.", margin, 278);

    // Keep PDF strictly as score summary only.
    // Full answer breakdown is intentionally excluded from PDFs.

    const fileName = examTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") || "exam";
    return { doc, fileName: `${fileName}-scorecard.pdf` };
};

export const downloadResultScorecard = async (result) => {
    const { doc, fileName } = await createResultScorecard(result);
    doc.save(fileName);
};
