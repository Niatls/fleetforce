// Utility functions for exporting candidate dossiers to CSV and Word (.doc)

export const handleExportCSV = (candidates = []) => {
  let csv = 'ID,Full Name,Rank,Status,Email,Phone,Marlins,Ready Date\n';
  candidates.forEach((c) => {
    csv += `"${c.id}","${c.fullName}","${c.appliedRank}","${c.status}","${c.email}","${c.phone}","${c.marlinsScore}","${c.readyDate}"\n`;
  });
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `FleetForce_Seafarers_Export_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

export const handleExportDoc = (cand) => {
  if (!cand) return;
  const cleanName = (cand.fullName || 'Seafarer').replace(/[^a-zA-Z0-9_\-\u0400-\u04FF\s]/g, '');
  const seaServiceRows = (cand.seaService || []).map(s => `
    <tr>
      <td style="padding:6px;border:1px solid #ccc;font-weight:bold;">${s.vesselName || '-'}</td>
      <td style="padding:6px;border:1px solid #ccc;">${s.vesselType || '-'}</td>
      <td style="padding:6px;border:1px solid #ccc;">${s.dwtGrt || '-'} / ${s.engineBhp || '-'}</td>
      <td style="padding:6px;border:1px solid #ccc;">${s.rankHeld || '-'}</td>
      <td style="padding:6px;border:1px solid #ccc;">${s.manningCompany || '-'}</td>
      <td style="padding:6px;border:1px solid #ccc;">${s.dateFrom || '-'} — ${s.dateTo || '-'}</td>
    </tr>
  `).join('');

  const htmlContent = `
    <html xmlns:o='urn:schemas-microsoft-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>Seafarer Application - ${cand.fullName}</title>
      <style>
        body { font-family: Arial, sans-serif; font-size: 11pt; color: #111; margin: 20px; }
        h1 { color: #003366; font-size: 18pt; margin-bottom: 2px; }
        .sub { color: #666; font-size: 10pt; margin-bottom: 20px; }
        h3 { color: #003366; font-size: 13pt; border-bottom: 1px solid #003366; padding-bottom: 4px; margin-top: 18px; }
        table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 10pt; }
        th { background: #f0f4f8; color: #003366; padding: 6px; border: 1px solid #ccc; text-align: left; }
        td { padding: 6px; border: 1px solid #ccc; }
        .info-grid { width: 100%; margin-bottom: 10px; }
        .info-grid td { border: none; padding: 4px 8px; }
      </style>
    </head>
    <body>
      <h1>FLEETFORCE CREWING ALLIANCE</h1>
      <div class="sub">INTERNATIONAL SEAFARER APPLICATION DOSSIER | REF: ${cand.id} | Date: ${new Date().toLocaleDateString()}</div>

      <h3>1. PERSONAL DETAILS / ЛИЧНЫЕ ДАННЫЕ</h3>
      <table class="info-grid">
        <tr><td><strong>Full Name:</strong> ${cand.fullName}</td><td><strong>Date of Birth:</strong> ${cand.dob || '-'}</td></tr>
        <tr><td><strong>Phone:</strong> ${cand.phone || '-'}</td><td><strong>Citizenship:</strong> ${cand.citizenship || '-'}</td></tr>
        <tr><td><strong>Email:</strong> ${cand.email || '-'}</td><td><strong>Passport / Seaman Book:</strong> ${cand.passportNo || 'Included in Attached Docs'}</td></tr>
      </table>

      <h3>2. APPLICATION DETAILS / ДАННЫЕ ВАКАНСИИ И АНГЛИЙСКИЙ</h3>
      <table class="info-grid">
        <tr><td><strong>Applied Rank:</strong> ${cand.appliedRank}</td><td><strong>Min Desired Salary:</strong> $${cand.minSalary || '0'} / month</td></tr>
        <tr><td><strong>Availability Date:</strong> ${cand.readyDate || '-'}</td><td><strong>Marlins Score:</strong> ${cand.marlinsScore || 'N/A'} (${cand.englishLevel || 'Good'})</td></tr>
      </table>

      <h3>3. SEA EXPERIENCE RECORD MATRIX / ОПЫТ РАБОТЫ В МОРЕ</h3>
      <table>
        <thead>
          <tr>
            <th>Vessel Name</th>
            <th>Type</th>
            <th>DWT / Engine</th>
            <th>Rank</th>
            <th>Manning Company</th>
            <th>Period</th>
          </tr>
        </thead>
        <tbody>
          ${seaServiceRows || '<tr><td colspan="6">No sea experience recorded</td></tr>'}
        </tbody>
      </table>

      ${cand.notes ? `<h3>4. RECRUITER & MANAGER NOTES</h3><p style="background:#fffbe6;padding:10px;border:1px solid #ffe58f;">${cand.notes}</p>` : ''}
      <br/><br/>
      <div style="font-size:9pt;color:#888;text-align:center;border-top:1px solid #ccc;padding-top:8px;">
        Document generated automatically by FleetForce Crewing Platform • ISO 9001 & MLC 2006 Certified System
      </div>
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `FleetForce_Application_${cleanName}_${cand.id}.doc`;
  a.click();
  URL.revokeObjectURL(url);
};
