import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Papa from 'papaparse';
import { X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getReports } from '../../services/reportService';
import { BranchReport, OverallReport } from '../../types';
import { jsPDF } from 'jspdf';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ReportModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const isBranchSupervisor = user?.role === 'branch_supervisor';
  const branchCode = user?.branchCode;
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [downloadType, setDownloadType] = useState<'pdf' | 'csv'>('pdf');


  const createOverallPDF = (data: OverallReport) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const padding = 15;
    const left = padding;
    const right = pageWidth - padding;
    const lineHeight = 6;
    let y = padding;

    const formattedStart = startDate
      ? startDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
      : 'N/A';

    const formattedEnd = endDate
      ? endDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
      : 'N/A';

    // Draw border around content
    doc.setDrawColor(180);
    doc.setLineWidth(0.5);
    doc.rect(padding - 5, padding - 5, pageWidth - 2 * (padding - 5), pageHeight - 2 * (padding - 5));

    // ====== Heading Section ======
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(40, 40, 90);

    const heading = `\nABC Supermarket Complaint Insights Report\nCovering from ${formattedStart} to ${formattedEnd}\n\n`;
    const lines = doc.splitTextToSize(heading, pageWidth - 2 * padding);

    lines.forEach((line: any) => {
      const textWidth = doc.getTextWidth(line);
      const x = (pageWidth - textWidth) / 2;
      doc.text(line, x, y);
      y += lineHeight;
    });

    // ====== Section Utility Function ======
    const drawSection = (title: string) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(0, 102, 204);
      doc.text(title, left, y);
      y += 2;
      doc.setDrawColor(0, 102, 204);
      doc.setLineWidth(0.4);
      doc.line(left, y, right, y);
      y += lineHeight;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
    };

    // ====== Report Overview ======
    drawSection('Report Overview');
    // Add a brief description for this section
    doc.setFont('helvetica', 'italic');
    doc.text(
      'This section summarizes the overall complaint status, providing insights into resolved, pending, and ongoing issues. The anonymous complaint ratio reflects the proportion of complaints submitted without identifying information. A higher ratio may indicate a lack of trust or fear of repercussions among customers, while a lower ratio suggests transparency and openness in the feedback process.',
      left,
      y,
      { maxWidth: right - left }
    );
    y += lineHeight * 3;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`• Total Complaints: ${data.total_complaints}`, left, y); y += lineHeight;
    doc.text(`• Resolved Complaints: ${data.resolved}`, left, y); y += lineHeight;
    doc.text(`• Pending Complaints: ${data.pending}`, left, y); y += lineHeight;
    doc.text(`• Complaints In Progress: ${data.in_progress}`, left, y); y += lineHeight;
    doc.text(`• Anonymous Complaint Ratio: ${data.anonymous_complaints_ratio}`, left, y); y += lineHeight + 2;

    // ====== Top Branches ======
    drawSection('Top Branches with Highest Complaints');
    // Add a brief description for this section
    doc.setFont('helvetica', 'italic');
    doc.text(
      'Branches listed here have received the highest number of complaints during the reporting period, indicating areas that may require further investigation or improvement.',
      left,
      y,
      { maxWidth: right - left }
    );
    y += lineHeight * 2;
    doc.setFont('helvetica', 'normal');
    data.top_branches_by_complaints.forEach(b => {
      doc.text(`• ${b.branch_name}: ${b.count}`, left, y);
      y += lineHeight;
    });
    y += 2;

    // ====== Highest Pending Branch ======
    drawSection('Branch with Highest Pending Complaints');
    // Add a brief description for this section
    doc.setFont('helvetica', 'italic');
    doc.text(
      'This highlights the branch with the greatest number of unresolved complaints, pinpointing a potential bottleneck in complaint resolution.',
      left,
      y,
      { maxWidth: right - left }
    );
    y += lineHeight * 2;
    doc.setFont('helvetica', 'normal');
    const bh = data.branch_with_highest_pending;
    doc.text(`• ${bh.branch_name}: ${bh.pending}`, left, y);
    y += lineHeight + 2;

    // ====== Frequent Complainers ======
    drawSection('Frequent Complainers');
    // Add a brief description for this section
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.text(
      'This section identifies customers who have submitted multiple complaints, allowing for focused customer service engagement and issue tracking.',
      left,
      y,
      { maxWidth: right - left }
    );
    y += lineHeight * 2;
    doc.setFont('helvetica', 'normal');
    data.most_frequent_complainers.forEach(c => {
      doc.text(`• ${c.name}: ${c.count}`, left, y);
      y += lineHeight;
    });

    // ====== Footer (optional) ======
    doc.setFontSize(8);
    doc.setTextColor(120);
    doc.text(
      `Generated on ${new Date().toLocaleDateString('en-GB')}`,
      left,
      pageHeight - padding
    );

    doc.save('overall-report.pdf');
  };

  const createBranchPDF = (data: BranchReport) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const padding = 15;
    const left = padding;
    const right = pageWidth - padding;
    const lineHeight = 6;
    let y = padding;

    const formattedStart = startDate
      ? startDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
      : 'N/A';

    const formattedEnd = endDate
      ? endDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
      : 'N/A';

    // Draw border around content
    doc.setDrawColor(180);
    doc.setLineWidth(0.5);
    doc.rect(padding - 5, padding - 5, pageWidth - 2 * (padding - 5), pageHeight - 2 * (padding - 5));

    // ====== Heading Section ======
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(40, 40, 90);

    const heading = `\nABC Supermarket Complaint Report\nBranch-Wise Analysis\nCovering ${formattedStart} to ${formattedEnd}\n`;
    const lines = doc.splitTextToSize(heading, pageWidth - 2 * padding);

    lines.forEach((line: any) => {
      const textWidth = doc.getTextWidth(line);
      const x = (pageWidth - textWidth) / 2;
      doc.text(line, x, y);
      y += lineHeight;
    });

    // ====== Highlight Branch Name ======
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(204, 0, 0); // Deep red or choose another
    const branchLine = `Branch: ${data.branch_name}`;
    const branchLineWidth = doc.getTextWidth(branchLine);
    const branchX = (pageWidth - branchLineWidth) / 2;
    doc.text(branchLine, branchX, y);
    y += lineHeight + 2; // Add some spacing before next section

    // ====== Section Utility Function ======
    const drawSection = (title: string) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(0, 102, 204);
      doc.text(title, left, y);
      y += 2;
      doc.setDrawColor(0, 102, 204);
      doc.setLineWidth(0.4);
      doc.line(left, y, right, y);
      y += lineHeight;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
    };

    // ====== Report Overview ======
    drawSection('Report Overview');
    // Add a brief description for this section
    doc.setFont('helvetica', 'italic');
    doc.text(
      'This section summarizes the overall complaint status, providing insights into resolved, pending, and ongoing issues. The anonymous complaint ratio reflects the proportion of complaints submitted without identifying information. A higher ratio may indicate a lack of trust or fear of repercussions among customers, while a lower ratio suggests transparency and openness in the feedback process.',
      left,
      y,
      { maxWidth: right - left }
    );
    y += lineHeight * 3;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`• Total Complaints: ${data.total_complaints}`, left, y); y += lineHeight;
    doc.text(`• Resolved Complaints: ${data.resolved}`, left, y); y += lineHeight;
    doc.text(`• Pending Complaints: ${data.pending}`, left, y); y += lineHeight;
    doc.text(`• Complaints In Progress: ${data.in_progress}`, left, y); y += lineHeight;
    doc.text(`• Anonymous Complaint Ratio: ${data.anonymous_complaints_ratio}`, left, y); y += lineHeight + 2;

    // ====== Frequent Complainers ======
    drawSection('Frequent Complainers');
    // Add a brief description for this section
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.text(
      'This section identifies customers who have submitted multiple complaints, allowing for focused customer service engagement and issue tracking.',
      left,
      y,
      { maxWidth: right - left }
    );
    y += lineHeight * 2;
    doc.setFont('helvetica', 'normal');
    data.most_frequent_complainers.forEach(c => {
      doc.text(`• ${c.name}: ${c.count}`, left, y);
      y += lineHeight;
    });

    // ====== Footer (optional) ======
    doc.setFontSize(8);
    doc.setTextColor(120);
    doc.text(
      `Generated on ${new Date().toLocaleDateString('en-GB')}`,
      left,
      pageHeight - padding
    );

    doc.save('branch-report.pdf');
  };

  const createOverallCSV = (data: OverallReport) => {
    const rows = [
      { Label: 'Total Complaints', Value: data.total_complaints },
      { Label: 'Resolved Complaints', Value: data.resolved },
      { Label: 'Pending Complaints', Value: data.pending },
      { Label: 'Complaints In Progress', Value: data.in_progress },
      { Label: 'Anonymous Complaint Ratio', Value: data.anonymous_complaints_ratio },
      ...data.top_branches_by_complaints.map(b => ({ Label: `Branch: ${b.branch_name}`, Value: b.count })),
      { Label: `Branch with Highest Pending Complaints`, Value: data.branch_with_highest_pending.branch_name },
      ...data.most_frequent_complainers.map(c => ({ Label: c.name, Value: c.count }))
    ];
    const csv = Papa.unparse(rows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'overall-report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const createBranchCSV = (data: BranchReport) => {
    const rows = [
      { Label: `Branch: ${data.branch_name}`, Value: '' },
      { Label: 'Total Complaints', Value: data.total_complaints },
      { Label: 'Resolved Complaints', Value: data.resolved },
      { Label: 'Pending Complaints', Value: data.pending },
      { Label: 'Complaints In Progress', Value: data.in_progress },
      { Label: 'Anonymous Complaint Ratio', Value: data.anonymous_complaints_ratio },
      ...data.most_frequent_complainers.map(c => ({ Label: c.name, Value: c.count }))
    ];
    const csv = Papa.unparse(rows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'branch-report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const fetchReport = async () => {
    if (!startDate || !endDate) return;
    try {
      if (isAdmin) {
        const data = await getReports({ startDate, endDate });
        if (downloadType === 'pdf') createOverallPDF(data as OverallReport);
        else createOverallCSV(data as OverallReport);
      } else if (isBranchSupervisor) {
        const data = await getReports({ startDate, endDate, branchCode });
        if (downloadType === 'pdf') createBranchPDF(data as BranchReport);
        else createBranchCSV(data as BranchReport);
      }
      onClose();
    } catch (error) {
      console.error('Error fetching report:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative transform transition-all duration-300 scale-90 opacity-0 animate-scaleFadeIn" style={{ animationFillMode: 'forwards' }}>
        <button onClick={onClose} className="absolute top-3 right-3 text-neutral-400 hover:text-neutral-700 transition" aria-label="Close">
          <X size={20} />
        </button>
        <h2 className="text-2xl font-semibold text-neutral-800 mb-6">Generate Report</h2>
        <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
          <div className="flex-1">
            <label className="block text-sm font-medium text-neutral-700 mb-1">Start Date</label>
            <DatePicker selected={startDate} onChange={setStartDate} selectsStart startDate={startDate} endDate={endDate} className="custom-datepicker-input" placeholderText="Start date" />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-neutral-700 mb-1">End Date</label>
            <DatePicker selected={endDate} onChange={setEndDate} selectsEnd startDate={startDate} endDate={endDate} className="custom-datepicker-input" placeholderText="End date" />
          </div>
        </div>
        <div className="space-y-4 mt-4">
          <label className="block text-sm font-medium text-neutral-700 mb-1">Download As</label>
          <select value={downloadType} onChange={e => setDownloadType(e.target.value as 'pdf' | 'csv')} className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500 transition text-sm">
            <option value="pdf">PDF</option>
            <option value="csv">CSV</option>
          </select>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 rounded-md bg-neutral-200 text-neutral-700 hover:bg-neutral-300 transition">Cancel</button>
          <button onClick={fetchReport} className="px-4 py-2 rounded-md bg-primary-600 text-white hover:bg-primary-700 transition">Download</button>
        </div>
      </div>
      <style>{`
        @keyframes scaleFadeIn { 0% { opacity: 0; transform: scale(0.9); } 100% { opacity: 1; transform: scale(1); }}
        .animate-scaleFadeIn { animation: scaleFadeIn 0.3s ease forwards; }
        .custom-datepicker-input { width:100%; padding:0.5rem 0.75rem; border:1px solid #d1d5db; border-radius:0.5rem; font-size:0.875rem; transition:border-color 0.2s ease,box-shadow 0.2s ease; outline:none; }
        .custom-datepicker-input:focus { border-color:#3b82f6; box-shadow:0 0 0 3px rgba(59,130,246,0.3); }
      `}</style>
    </div>
  );
};
