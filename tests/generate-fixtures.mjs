import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import fs from 'fs';
import path from 'path';

async function generateFixtures() {
  const fixturesDir = path.resolve(process.cwd(), 'tests/fixtures');
  if (!fs.existsSync(fixturesDir)) {
    fs.mkdirSync(fixturesDir, { recursive: true });
  }

  // 1. Generate sample.pdf
  console.log('Generating sample.pdf...');
  const pdfDoc = await PDFDocument.create();
  const page1 = pdfDoc.addPage([600, 800]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  page1.drawText('SAMPLE TEST INVOICE & CONFIDENTIAL CONTRACT', {
    x: 50,
    y: 740,
    size: 18,
    font: fontBold,
    color: rgb(0.9, 0.2, 0.2),
  });

  page1.drawText('Customer Name: NGUYEN VAN AN', {
    x: 50,
    y: 690,
    size: 13,
    font: font,
    color: rgb(0.1, 0.1, 0.1),
  });

  page1.drawText('Confidential Credit Card: 4532 8923 1109 8832', {
    x: 50,
    y: 660,
    size: 13,
    font: font,
    color: rgb(0.8, 0.1, 0.1),
  });

  page1.drawText('National ID (CCCD): 079198002345 (SECRET)', {
    x: 50,
    y: 630,
    size: 13,
    font: font,
    color: rgb(0.8, 0.1, 0.1),
  });

  page1.drawText('Status: PENDING REVIEW FOR REDACTION', {
    x: 50,
    y: 600,
    size: 13,
    font: fontBold,
    color: rgb(0.2, 0.5, 0.8),
  });

  const page2 = pdfDoc.addPage([600, 800]);
  page2.drawText('PAGE 2 - ATTACHMENTS AND METADATA', {
    x: 50,
    y: 740,
    size: 16,
    font: fontBold,
    color: rgb(0.1, 0.1, 0.1),
  });

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(path.join(fixturesDir, 'sample.pdf'), Buffer.from(pdfBytes));

  // 2. Generate sample.docx
  console.log('Generating sample.docx...');
  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            text: 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM',
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            text: 'HỢP ĐỒNG BẢO MẬT VÀ CHUYỂN GIAO CÔNG NGHỆ',
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Bên A: Nguyễn Văn An - Số CCCD bí mật: 079198002345',
                bold: true,
              }),
            ],
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: 'Tài liệu này được dùng để kiểm thử tự động luồng nạp Word, bôi xóa / che phủ và xuất tệp.',
            spacing: { after: 200 },
          }),
        ],
      },
    ],
  });

  const docxBuffer = await Packer.toBuffer(doc);
  fs.writeFileSync(path.join(fixturesDir, 'sample.docx'), docxBuffer);

  // 3. Generate sample.png
  console.log('Generating sample.png...');
  const pngBase64 = 
    'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mNk+M9QzwAEjDAGYzMQAgA4mg/52L1X/wAAAABJRU5ErkJggg==';
  fs.writeFileSync(path.join(fixturesDir, 'sample.png'), Buffer.from(pngBase64, 'base64'));

  // 4. Generate sample.jpg
  console.log('Generating sample.jpg...');
  const jpgBase64 = 
    '/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAAKAAoBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=';
  fs.writeFileSync(path.join(fixturesDir, 'sample.jpg'), Buffer.from(jpgBase64, 'base64'));

  console.log('Fixtures generated successfully at', fixturesDir);
}

generateFixtures().catch(console.error);
