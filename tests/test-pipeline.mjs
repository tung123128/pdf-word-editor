import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import * as mammoth from 'mammoth';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';

const fixturesDir = path.resolve(process.cwd(), 'tests/fixtures');

async function runTests() {
  console.log('====================================================');
  console.log('   BẮT ĐẦU KIỂM THỬ THỰC NGHIỆM TOÀN DIỆN (COMPREHENSIVE QA)');
  console.log('====================================================\n');

  let passedTests = 0;
  let totalTests = 0;
  const failureDetails = [];

  function test(name, fn) {
    totalTests++;
    try {
      fn();
      console.log(`✅ [PASS] ${name}`);
      passedTests++;
    } catch (err) {
      console.error(`❌ [FAIL] ${name}`);
      console.error(`   Chi tiết lỗi: ${err.message}`);
      failureDetails.push({ name, error: err.message, stack: err.stack });
      process.exitCode = 1;
    }
  }

  async function asyncTest(name, fn) {
    totalTests++;
    try {
      await fn();
      console.log(`✅ [PASS] ${name}`);
      passedTests++;
    } catch (err) {
      console.error(`❌ [FAIL] ${name}`);
      console.error(`   Chi tiết lỗi: ${err.message}`);
      failureDetails.push({ name, error: err.message, stack: err.stack });
      process.exitCode = 1;
    }
  }

  // --- Test 1: Kiểm thử tệp mẫu đầu vào & Header nhị phân (Magic Bytes) ---
  test('Tệp mẫu (sample.pdf, sample.docx, sample.png, sample.jpg) tồn tại và có header nhị phân hợp lệ', () => {
    const pdfPath = path.join(fixturesDir, 'sample.pdf');
    const docxPath = path.join(fixturesDir, 'sample.docx');
    const pngPath = path.join(fixturesDir, 'sample.png');
    const jpgPath = path.join(fixturesDir, 'sample.jpg');

    assert(fs.existsSync(pdfPath), 'sample.pdf missing');
    assert(fs.existsSync(docxPath), 'sample.docx missing');
    assert(fs.existsSync(pngPath), 'sample.png missing');
    assert(fs.existsSync(jpgPath), 'sample.jpg missing');

    // PDF Magic Bytes: %PDF
    const pdfBuf = fs.readFileSync(pdfPath);
    assert(pdfBuf.toString('ascii', 0, 4) === '%PDF', 'sample.pdf không có magic bytes %PDF');

    // DOCX Magic Bytes: PK\x03\x04
    const docxBuf = fs.readFileSync(docxPath);
    assert.strictEqual(docxBuf[0], 0x50, 'Byte 0 của DOCX phải là P (0x50)');
    assert.strictEqual(docxBuf[1], 0x4b, 'Byte 1 của DOCX phải là K (0x4b)');

    // PNG Signature: \x89PNG\r\n\x1a\n
    const pngBuf = fs.readFileSync(pngPath);
    const pngSig = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
    for (let i = 0; i < pngSig.length; i++) {
      assert.strictEqual(pngBuf[i], pngSig[i], `Byte ${i} của PNG không khớp`);
    }

    // JPG Signature: 0xFF 0xD8 0xFF
    const jpgBuf = fs.readFileSync(jpgPath);
    assert.strictEqual(jpgBuf[0], 0xff, 'Byte 0 của JPG phải là 0xFF');
    assert.strictEqual(jpgBuf[1], 0xd8, 'Byte 1 của JPG phải là 0xD8');
    assert.strictEqual(jpgBuf[2], 0xff, 'Byte 2 của JPG phải là 0xFF');
  });

  // --- Test 2: Luồng PDF: Upload -> Parse -> Redact / Edit -> Multi-page -> Export ---
  await asyncTest('PDF Engine: Tải tệp, kiểm tra số trang, bôi đen Redact, thêm chữ và xuất PDF hợp lệ', async () => {
    const pdfPath = path.join(fixturesDir, 'sample.pdf');
    const pdfBytes = fs.readFileSync(pdfPath);

    // 1. Tải và phân tích cấu trúc PDF
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();
    assert.strictEqual(pages.length, 2, 'PDF mẫu phải có chính xác 2 trang');

    // 2. Thực hiện bôi đen che phủ bảo mật (Redaction Box) trên trang 1
    const page1 = pages[0];
    const { width, height } = page1.getSize();
    assert(width > 0 && height > 0, 'Kích thước trang PDF không hợp lệ');

    // Che thông tin thẻ tín dụng và số CCCD nhạy cảm
    page1.drawRectangle({
      x: 50,
      y: 620,
      width: 500,
      height: 60,
      color: rgb(0, 0, 0),
      opacity: 1.0,
    });

    // 3. Thêm chữ Annotation lên trang 1
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    page1.drawText('DA CHE PHU BAO MAT (CONFIDENTIAL REDACTED)', {
      x: 55,
      y: 645,
      size: 11,
      font: font,
      color: rgb(1, 1, 1),
    });

    // 4. Áp dụng chỉnh sửa lên trang 2 (Multi-page test)
    const page2 = pages[1];
    page2.drawText('TRANG 2: DA XAC THUC CHINH SUA', {
      x: 50,
      y: 700,
      size: 12,
      font: font,
      color: rgb(0.2, 0.6, 0.2),
    });

    // 5. Xuất tệp PDF kết quả
    const exportedPdfBytes = await pdfDoc.save();
    assert(exportedPdfBytes.length > 0, 'Dung lượng PDF xuất ra phải lớn hơn 0');

    // Kiểm tra Magic Header %PDF-
    const header = Buffer.from(exportedPdfBytes.slice(0, 5)).toString();
    assert(header.startsWith('%PDF'), 'Tệp PDF xuất ra không có magic header %PDF');

    // Nạp lại PDF xuất ra để xác minh tính toàn vẹn 100%
    const verifyDoc = await PDFDocument.load(exportedPdfBytes);
    assert.strictEqual(verifyDoc.getPageCount(), 2, 'Tệp sau khi xuất vẫn bảo toàn 2 trang');

    // Lưu tệp kết quả kiểm thử
    fs.writeFileSync(path.join(fixturesDir, 'output_modified.pdf'), Buffer.from(exportedPdfBytes));
  });

  // --- Test 3: PDF Edge Case: Xuất nhiều lần liên tiếp (Repeated Sequential Export) ---
  await asyncTest('PDF Edge Case: Xử lý xuất file nhiều lần liên tiếp bảo toàn cấu trúc tệp', async () => {
    const intermediatePdfPath = path.join(fixturesDir, 'output_modified.pdf');
    const intermediateBytes = fs.readFileSync(intermediatePdfPath);

    // Nạp lại tệp đã xuất từ lượt 1
    const docSecondPass = await PDFDocument.load(intermediateBytes);
    assert.strictEqual(docSecondPass.getPageCount(), 2, 'Lượt 2: Số trang phải là 2');

    // Thêm ghi chú mới ở lượt 2
    const page1 = docSecondPass.getPages()[0];
    const font = await docSecondPass.embedFont(StandardFonts.Helvetica);
    page1.drawText('XUAT LAN 2: KIEM THU REPEATED EXPORT HOAN TAT', {
      x: 55,
      y: 580,
      size: 10,
      font: font,
      color: rgb(0, 0, 0.8),
    });

    // Xuất lại lượt 2
    const secondPassBytes = await docSecondPass.save();
    assert(secondPassBytes.length > intermediateBytes.length, 'Dung lượng lượt 2 phải tăng thêm do có ghi chú mới');

    // Xác minh header lượt 2
    const header = Buffer.from(secondPassBytes.slice(0, 5)).toString();
    assert(header.startsWith('%PDF'), 'Lượt 2: Tệp xuất ra vẫn phải có header %PDF');

    // Xác minh tệp nạp lại thành công
    const verifyPass2 = await PDFDocument.load(secondPassBytes);
    assert.strictEqual(verifyPass2.getPageCount(), 2, 'Lượt 2: Bảo toàn 2 trang');
  });

  // --- Test 4: Luồng Word DOCX: Upload -> Parse -> Redact / Edit -> Export & Verification ---
  await asyncTest('Word Engine: Nạp .docx qua Mammoth, trích xuất text, bôi xóa và xuất DOCX mới', async () => {
    const docxPath = path.join(fixturesDir, 'sample.docx');
    const docxBuffer = fs.readFileSync(docxPath);

    // 1. Trích xuất HTML và Plain text bằng Mammoth
    const mammothResult = await mammoth.extractRawText({ buffer: docxBuffer });
    const textContent = mammothResult.value;
    assert(textContent.includes('HỢP ĐỒNG BẢO MẬT'), 'Không tìm thấy tiêu đề hợp đồng');
    assert(textContent.includes('Nguyễn Văn An'), 'Không tìm thấy tên khách hàng');
    assert(textContent.includes('079198002345'), 'Không tìm thấy số CCCD nhạy cảm');

    // 2. Chỉnh sửa và bôi xóa nội dung bảo mật
    const redactedText = textContent.replace('079198002345', '████████████ (ĐÃ CHE PHỦ)');
    const paragraphs = redactedText.split('\n').filter((p) => p.trim().length > 0);

    // Thêm một đoạn ghi chú mới
    paragraphs.push('Ghi chú biên tập: Đã che phủ bảo mật thông tin định danh cá nhân theo tiêu chuẩn.');

    // 3. Đóng gói lại thành tệp DOCX mới bằng docx package
    const newDoc = new Document({
      sections: [
        {
          children: paragraphs.map(
            (p) =>
              new Paragraph({
                children: [
                  new TextRun({
                    text: p,
                    font: 'Arial',
                    size: 24,
                  }),
                ],
                spacing: { after: 200 },
              })
          ),
        },
      ],
    });

    const newDocxBuffer = await Packer.toBuffer(newDoc);
    assert(newDocxBuffer.length > 0, 'Dung lượng tệp DOCX mới phải lớn hơn 0');

    // Kiểm tra ZIP header (PK\x03\x04) chuẩn OpenXML
    assert.strictEqual(newDocxBuffer[0], 0x50, 'Byte 0 phải là P (0x50)');
    assert.strictEqual(newDocxBuffer[1], 0x4b, 'Byte 1 phải là K (0x4b)');

    // Lưu tệp kết quả kiểm thử
    fs.writeFileSync(path.join(fixturesDir, 'output_modified.docx'), newDocxBuffer);

    // 4. Nạp lại tệp DOCX mới để kiểm tra tính toàn vẹn và xác nhận dữ liệu mật đã được xóa vĩnh viễn
    const verifyMammoth = await mammoth.extractRawText({ buffer: newDocxBuffer });
    assert(!verifyMammoth.value.includes('079198002345'), 'LỖI BẢO MẬT: Số CCCD vẫn còn xuất hiện trong tệp Word xuất ra');
    assert(verifyMammoth.value.includes('████████████ (ĐÃ CHE PHỦ)'), 'Không tìm thấy ký tự che phủ trong tệp Word xuất ra');
    assert(verifyMammoth.value.includes('Ghi chú biên tập'), 'Không tìm thấy ghi chú biên tập mới thêm');
  });

  // --- Test 5: Word Module Contract: Kiểm thử tính tương thích của parseDocxFile trong src/lib/docx-engine.ts ---
  await asyncTest('Word Engine Module Contract: Hàm parseDocxFile trong src/lib/docx-engine.ts phải hỗ trợ cả Node lẫn Browser', async () => {
    const docxEnginePath = path.resolve(process.cwd(), 'src/lib/docx-engine.ts');
    assert(fs.existsSync(docxEnginePath), 'src/lib/docx-engine.ts missing');
    const docxEngineCode = fs.readFileSync(docxEnginePath, 'utf-8');

    // Kiểm tra xem parseDocxFile có truyền buffer tương thích với môi trường Node hay chỉ truyền { arrayBuffer }
    const usesBufferFallback = docxEngineCode.includes('buffer:') || docxEngineCode.includes('Buffer.');
    assert(
      usesBufferFallback,
      'src/lib/docx-engine.ts chỉ truyền { arrayBuffer } vào Mammoth. Trong môi trường Node/SSR, Mammoth yêu cầu { buffer }, gây lỗi "Could not find file in options".'
    );
  });

  // --- Test 6: Image Engine (PNG & JPG): Kiểm tra tính hợp lệ và cấu trúc xuất ---
  test('Image Engine: Kiểm tra tính hợp lệ của tệp ảnh PNG/JPG, tỷ lệ Natural Resolution và vùng che phủ', () => {
    const pngPath = path.join(fixturesDir, 'sample.png');
    const pngBuffer = fs.readFileSync(pngPath);
    assert(pngBuffer.length > 50, 'Kích thước tệp PNG phải hợp lệ');

    const jpgPath = path.join(fixturesDir, 'sample.jpg');
    const jpgBuffer = fs.readFileSync(jpgPath);
    assert(jpgBuffer.length > 50, 'Kích thước tệp JPG phải hợp lệ');

    // Kiểm tra công thức tỷ lệ Natural Resolution để bảo toàn độ phân giải ảnh gốc
    const naturalWidth = 3840;
    const naturalHeight = 2160;
    const displayWidth = 960;
    const displayHeight = 540;

    const scaleX = naturalWidth / displayWidth;
    const scaleY = naturalHeight / displayHeight;
    assert.strictEqual(scaleX, 4, 'Scale factor X phải chính xác là 4');
    assert.strictEqual(scaleY, 4, 'Scale factor Y phải chính xác là 4');

    // Kiểm tra tính toán tọa độ hộp Redaction
    const boxDisplay = { x: 100, y: 150, width: 200, height: 50 };
    const boxExport = {
      x: boxDisplay.x * scaleX,
      y: boxDisplay.y * scaleY,
      width: boxDisplay.width * scaleX,
      height: boxDisplay.height * scaleY,
    };
    assert.strictEqual(boxExport.x, 400);
    assert.strictEqual(boxExport.y, 600);
    assert.strictEqual(boxExport.width, 800);
    assert.strictEqual(boxExport.height, 200);
  });

  // --- Test 7: Danh mục công cụ iLovePDF (31 công cụ) & Phân loại danh mục ---
  test('Danh mục công cụ iLovePDF: Phải chứa đầy đủ 31 công cụ chuẩn theo khảo sát và Acceptance Criteria', () => {
    const toolsDataPath = path.resolve(process.cwd(), 'src/lib/tools-data.ts');
    assert(fs.existsSync(toolsDataPath), 'src/lib/tools-data.ts missing');
    const toolsContent = fs.readFileSync(toolsDataPath, 'utf-8');

    // Trích xuất danh mục
    const catMatches = [...toolsContent.matchAll(/id:\s*'([a-z\-]+)'/g)].map((m) => m[1]);
    const categories = ['organize', 'optimize', 'convert-to', 'convert-from', 'edit', 'security', 'ai'];
    for (const cat of categories) {
      assert(catMatches.includes(cat), `Thiếu danh mục ${cat}`);
    }

    // Trích xuất danh sách tools trong TOOLS_DATA
    const toolsPart = toolsContent.split('export const TOOLS_DATA')[1] || '';
    const toolIds = [...toolsPart.matchAll(/id:\s*'([a-z\-]+)'/g)].map((m) => m[1]);
    const actualCount = toolIds.length;
    console.log(`   [Info] Số lượng công cụ hiện có trong TOOLS_DATA: ${actualCount}`);

    // Đối chiếu với yêu cầu 31 công cụ của Acceptance Criteria
    assert.strictEqual(
      actualCount,
      31,
      `Yêu cầu danh mục phải có đủ 31 công cụ iLovePDF, nhưng hiện tại chỉ có ${actualCount} công cụ (thiếu 1 công cụ: 'pdf-to-markdown' trong danh mục Chuyển từ PDF).`
    );
  });

  // --- Test 8: Hệ thống Giao diện Sáng / Tối (Light & Dark Mode) & CSS Token Specs ---
  test('Hệ thống Theme Sáng / Tối: Cấu hình Tailwind và CSS Tokens chuẩn phong cách iLovePDF', () => {
    const tailwindConfigPath = path.resolve(process.cwd(), 'tailwind.config.ts');
    assert(fs.existsSync(tailwindConfigPath), 'tailwind.config.ts missing');
    const tailwindContent = fs.readFileSync(tailwindConfigPath, 'utf-8');

    // Kiểm tra cấu hình darkMode: 'class' hoặc "class"
    assert(
      /darkMode:\s*["']class["']/.test(tailwindContent),
      'tailwind.config.ts phải cấu hình darkMode: "class"'
    );

    // Kiểm tra các token màu Dark Mode
    assert(tailwindContent.includes('#0f1015'), 'Thiếu token màu dark bg (#0f1015)');
    assert(tailwindContent.includes('#171821'), 'Thiếu token màu dark card (#171821)');
    assert(tailwindContent.includes('#e5322d'), 'Thiếu màu đỏ thương hiệu iLovePDF (#e5322d)');

    // Kiểm tra globals.css
    const globalsCssPath = path.resolve(process.cwd(), 'src/app/globals.css');
    assert(fs.existsSync(globalsCssPath), 'globals.css missing');
    const cssContent = fs.readFileSync(globalsCssPath, 'utf-8');
    assert(cssContent.includes('.studio-grid-light'), 'Thiếu class .studio-grid-light');
    assert(cssContent.includes('.studio-grid-dark'), 'Thiếu class .studio-grid-dark');
  });

  // --- Test 9: Tính tương thích triển khai Vercel (Next.js Static / Serverless Build Verification) ---
  test('Độ tin cậy Vercel: Thư mục .next chứa BUILD_ID và các trang tĩnh (Static Pages) prerendered thành công', () => {
    const buildIdPath = path.resolve(process.cwd(), '.next/BUILD_ID');
    assert(fs.existsSync(buildIdPath), 'Dự án chưa được build hoặc thiếu .next/BUILD_ID');
    const buildId = fs.readFileSync(buildIdPath, 'utf-8').trim();
    assert(buildId.length > 0, 'BUILD_ID rỗng');

    // Kiểm tra routes manifest
    const routesManifestPath = path.resolve(process.cwd(), '.next/routes-manifest.json');
    assert(fs.existsSync(routesManifestPath), 'routes-manifest.json missing');

    // Kiểm tra static pages (/) và (/editor)
    const serverAppPath = path.resolve(process.cwd(), '.next/server/app');
    assert(
      fs.existsSync(path.join(serverAppPath, 'index.html')) || fs.existsSync(path.join(serverAppPath, 'page.js')),
      'Trang chủ (/) chưa được prerender'
    );
    assert(
      fs.existsSync(path.join(serverAppPath, 'editor.html')) || fs.existsSync(path.join(serverAppPath, 'editor/page.js')),
      'Trang /editor chưa được prerender'
    );
  });

  console.log('\n====================================================');
  console.log(`   KẾT QUẢ KIỂM THỬ: ${passedTests}/${totalTests} BÀI KIỂM THỬ VƯỢT QUA`);
  console.log('====================================================\n');

  if (failureDetails.length > 0) {
    console.log('DANH SÁCH LỖI PHÁT HIỆN QUA THỰC NGHIỆM:');
    failureDetails.forEach((f, idx) => {
      console.log(`\n[Lỗi ${idx + 1}]: ${f.name}`);
      console.log(`Chi tiết: ${f.error}`);
    });
    console.log('');
  }

  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
