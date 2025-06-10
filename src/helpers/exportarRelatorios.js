// src/util/exportarRelatorio.js
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Exporta para Excel
async function exportarParaExcel(dados, nomeArquivo) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Relatório');

  // Adiciona cabeçalhos
  const colunas = Object.keys(dados[0]).map(key => ({ header: key, key }));
  sheet.columns = colunas;

  // Adiciona os dados
  dados.forEach(item => sheet.addRow(item));

  const filePath = path.join(__dirname, '..', '..', `${nomeArquivo}.xlsx`);
  await workbook.xlsx.writeFile(filePath);
  console.log(`Excel gerado em: ${filePath}`);
}

// Exporta para PDF
function exportarParaPDF(dados, nomeArquivo) {
  const doc = new PDFDocument();
  const filePath = path.join(__dirname, '..', '..', `${nomeArquivo}.pdf`);
  const stream = fs.createWriteStream(filePath);

  doc.pipe(stream);

  doc.fontSize(16).text('Relatório', { align: 'center' });
  doc.moveDown();

  dados.forEach(item => {
    Object.entries(item).forEach(([key, value]) => {
      doc.fontSize(12).text(`${key}: ${value}`);
    });
    doc.moveDown();
  });

  doc.end();
  console.log(`PDF gerado em: ${filePath}`);
}

// Exporta as funções
module.exports = {
  exportarParaExcel,
  exportarParaPDF
};
