/**
 * Generates and downloads a complete B2B Lab-Grown Loose Diamond Quotation Catalog
 * covering all 9 diamond shapes from 1.00 Carat to 10.00+ Carats with Surat Direct Reasonable Wholesale Pricing.
 */
export function downloadDemoQuote() {
  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const shapes = [
    { name: 'Round Brilliant', id: 'round', icon: '💎', basePrice: 220 },
    { name: 'Oval', id: 'oval', icon: '🥚', basePrice: 240 },
    { name: 'Emerald', id: 'emerald', icon: '🟩', basePrice: 230 },
    { name: 'Radiant', id: 'radiant', icon: '✨', basePrice: 235 },
    { name: 'Princess', id: 'princess', icon: '🔳', basePrice: 210 },
    { name: 'Pear', id: 'pear', icon: '💧', basePrice: 245 },
    { name: 'Marquise', id: 'marquise', icon: '👁️', basePrice: 250 },
    { name: 'Cushion', id: 'cushion', icon: '🛋️', basePrice: 225 },
    { name: 'Asscher', id: 'asscher', icon: '🏛️', basePrice: 240 },
  ];

  const caratBrackets = [
    { label: '1.00 ct - 1.49 ct', avgCarat: 1.25, mult: 1.0, color: 'D - F', clarity: 'VS1 - VVS2' },
    { label: '1.50 ct - 1.99 ct', avgCarat: 1.75, mult: 1.25, color: 'D - F', clarity: 'VS1 - VVS2' },
    { label: '2.00 ct - 2.99 ct', avgCarat: 2.50, mult: 1.60, color: 'D - F', clarity: 'VVS1 - VS1' },
    { label: '3.00 ct - 3.99 ct', avgCarat: 3.50, mult: 2.00, color: 'D - F', clarity: 'VVS1 - VVS2' },
    { label: '4.00 ct - 4.99 ct', avgCarat: 4.50, mult: 2.50, color: 'D - F', clarity: 'VVS1 - VVS2' },
    { label: '5.00 ct - 6.99 ct', avgCarat: 5.50, mult: 3.20, color: 'D - F', clarity: 'IF - VVS1' },
    { label: '7.00 ct - 9.99 ct', avgCarat: 8.00, mult: 4.20, color: 'D - E', clarity: 'IF - VVS1' },
    { label: '10.00 ct+ (Jumbo Carat)', avgCarat: 10.00, mult: 5.50, color: 'D - E', clarity: 'IF - VVS1' },
  ];

  let shapeSectionsHtml = '';
  let navLinksHtml = '';

  shapes.forEach((shape) => {
    navLinksHtml += `<a href="#${shape.id}">${shape.name}</a>`;

    let rowsHtml = '';
    caratBrackets.forEach((bracket) => {
      const perCaratRate = Math.round(shape.basePrice * bracket.mult);
      const estTotal = Math.round(perCaratRate * bracket.avgCarat);

      rowsHtml += `
        <tr>
          <td style="font-weight: 600; color: #ffffff;">${bracket.label}</td>
          <td><span class="badge badge-lab">Lab-Grown</span></td>
          <td>${bracket.color}</td>
          <td>${bracket.clarity}</td>
          <td>IGI Certified</td>
          <td style="color: #38bdf8; font-weight: 600;">$${perCaratRate.toLocaleString()} / ct</td>
          <td style="color: #10b981; font-weight: 700;">$${estTotal.toLocaleString()} USD</td>
        </tr>
      `;
    });

    shapeSectionsHtml += `
      <div id="${shape.id}" class="shape-card">
        <div class="shape-header">
          <div class="shape-title font-sans">
            <span style="font-size: 20px;">${shape.icon}</span> ${shape.name} Loose Diamonds
          </div>
          <div class="shape-subtitle">1.00ct to 10.00ct+ Sourcing Matrix • Reasonable Surat Wholesale Rates • IGI Certified</div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Carat Range</th>
              <th>Category</th>
              <th>Color Grade</th>
              <th>Clarity Grade</th>
              <th>Certification</th>
              <th>Price / Carat (USD)</th>
              <th>Est. Sample Total</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
    `;
  });

  const htmlDocument = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>NIVVAN JEWELS - Lab-Grown Loose Diamonds B2B Wholesale Catalog (1ct - 10ct+)</title>
  <style>
    body {
      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
      background-color: #070a0f;
      color: #e2e8f0;
      margin: 0;
      padding: 30px 20px;
    }
    .container {
      max-width: 950px;
      margin: 0 auto;
      background-color: #0b131f;
      border: 1px solid #1e293b;
      border-radius: 14px;
      padding: 32px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #10b981;
      padding-bottom: 20px;
      margin-bottom: 24px;
    }
    .brand {
      font-size: 26px;
      font-weight: 800;
      color: #ffffff;
      letter-spacing: 1.5px;
    }
    .sub-brand {
      font-size: 12px;
      color: #10b981;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-top: 4px;
      font-weight: 600;
    }
    .doc-title {
      text-align: right;
    }
    .doc-title h2 {
      margin: 0;
      font-size: 16px;
      color: #38bdf8;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .doc-meta {
      font-size: 11px;
      color: #94a3b8;
      margin-top: 4px;
      font-family: monospace;
    }
    .shape-nav {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      background: #0f172a;
      padding: 14px;
      border-radius: 10px;
      border: 1px solid #1e293b;
      margin-bottom: 28px;
    }
    .shape-nav span {
      font-size: 11px;
      text-transform: uppercase;
      color: #94a3b8;
      font-weight: 600;
      width: 100%;
      margin-bottom: 4px;
    }
    .shape-nav a {
      color: #34d399;
      background: #064e3b;
      padding: 4px 10px;
      border-radius: 6px;
      text-decoration: none;
      font-size: 12px;
      font-weight: 600;
      transition: background 0.2s;
    }
    .shape-nav a:hover {
      background: #059669;
      color: #ffffff;
    }
    .shape-card {
      background: #0f172a;
      border: 1px solid #1e293b;
      border-radius: 10px;
      padding: 20px;
      margin-bottom: 24px;
    }
    .shape-header {
      margin-bottom: 16px;
      border-bottom: 1px solid #1e293b;
      padding-bottom: 10px;
    }
    .shape-title {
      font-size: 18px;
      font-weight: 700;
      color: #ffffff;
    }
    .shape-subtitle {
      font-size: 11px;
      color: #94a3b8;
      font-family: monospace;
      margin-top: 2px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
    }
    th {
      background-color: #1e293b;
      color: #38bdf8;
      text-align: left;
      padding: 8px 10px;
      font-weight: 600;
      text-transform: uppercase;
      font-size: 10px;
      letter-spacing: 0.5px;
      border-bottom: 1px solid #334155;
    }
    td {
      padding: 10px;
      border-bottom: 1px solid #1e293b;
      color: #cbd5e1;
    }
    tr:nth-child(even) td {
      background-color: rgba(15, 23, 42, 0.4);
    }
    .badge {
      display: inline-block;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 600;
      font-family: monospace;
    }
    .badge-lab { background: #064e3b; color: #34d399; }
    .terms {
      background-color: #0f172a;
      border: 1px solid #1e293b;
      padding: 18px;
      border-radius: 10px;
      font-size: 12px;
      color: #94a3b8;
      line-height: 1.6;
      margin-top: 32px;
    }
    .terms h4 {
      margin: 0 0 8px 0;
      color: #10b981;
      font-size: 13px;
      text-transform: uppercase;
    }
    .footer {
      text-align: center;
      margin-top: 32px;
      font-size: 11px;
      color: #64748b;
      border-top: 1px solid #1e293b;
      padding-top: 16px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div>
        <div class="brand">NIVVAN JEWELS</div>
        <div class="sub-brand">Gigakelvin Diamonds • Surat Sourcing Desk</div>
      </div>
      <div class="doc-title">
        <h2>Lab-Grown Loose Diamond Wholesale Catalog</h2>
        <div class="doc-meta">REASONABLE SURAT FACTORY PRICING (1.00ct - 10.00ct+)</div>
        <div class="doc-meta">DATE: ${dateStr}</div>
      </div>
    </div>

    <div class="shape-nav">
      <span>Quick Shape Navigation Menu:</span>
      ${navLinksHtml}
    </div>

    ${shapeSectionsHtml}

    <div class="terms">
      <h4>Surat Direct Commercial & Quality Terms (Lab-Grown Inventory):</h4>
      • <strong>Reasonable Wholesale Pricing:</strong> Direct Surat manufacturing & polishing rates with zero middleman markups.<br>
      • <strong>100% Lab-Grown Focus:</strong> Exclusively IGI certified lab-grown loose diamonds (GCAL 8X available on request).<br>
      • <strong>1.00ct to 10.00ct+ Sourcing:</strong> Full inventory availability from standard solitaire sizes to custom fancy cuts & jumbo carat stones.<br>
      • <strong>Pre-Shipment HD Media Approval:</strong> 360° HD macro video and high-resolution cert scan provided before final dispatch.<br>
      • <strong>Fulfillment SLA:</strong> ~7-day fully insured door-to-door transit to US, CA, UK, and AU.<br>
      • <strong>Official Contact:</strong> Email <a href="mailto:jenis.rakholiya9081@gmail.com" style="color:#34d399;">jenis.rakholiya9081@gmail.com</a> | WhatsApp <a href="https://wa.me/919081847956" style="color:#34d399;">+91 90818 47956</a>
    </div>

    <div class="footer">
      NIVVAN JEWELS / Gigakelvin Diamonds • Surat Manufacturing Base, Gujarat, India • Trade Loose Diamonds Only
    </div>
  </div>
</body>
</html>`;

  const blob = new Blob([htmlDocument], { type: 'text/html;charset=utf-8' });

  if (typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function') {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Nivvan_Jewels_LabGrown_Diamond_Quotation_Catalog_1ct_10ct.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (typeof URL.revokeObjectURL === 'function') {
      URL.revokeObjectURL(url);
    }
  } else if (typeof document !== 'undefined') {
    const link = document.createElement('a');
    link.href = 'data:text/html;charset=utf-8,' + encodeURIComponent(htmlDocument);
    link.download = 'Nivvan_Jewels_LabGrown_Diamond_Quotation_Catalog_1ct_10ct.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
