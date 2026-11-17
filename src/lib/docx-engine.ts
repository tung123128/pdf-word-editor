import { Document, Packer, Paragraph, TextRun } from 'docx';
import * as mammoth from 'mammoth';

export interface DocxContent {
  html: string;
  rawText: string;
  messages: string[];
}

/**
 * Parse DOCX file bytes into formatted HTML and plain text
 */
export async function parseDocxFile(arrayBuffer: ArrayBuffer): Promise<DocxContent> {
  const buffer = typeof Buffer !== 'undefined'
    ? (Buffer.isBuffer(arrayBuffer) ? arrayBuffer : Buffer.from(arrayBuffer))
    : undefined;
  const options: any = { arrayBuffer };
  if (buffer) options.buffer = buffer;

  const result = await mammoth.convertToHtml(options);
  const rawTextResult = await mammoth.extractRawText(options);

  return {
    html: result.value || '<p>Không thể đọc nội dung văn bản</p>',
    rawText: rawTextResult.value || '',
    messages: result.messages.map((m) => m.message),
  };
}

/**
 * Generate a new DOCX Blob from edited text paragraphs
 */
export async function exportModifiedDocx(paragraphsText: string[]): Promise<Blob> {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: paragraphsText.map(
          (text) =>
            new Paragraph({
              children: [
                new TextRun({
                  text: text,
                  font: 'Arial',
                  size: 24, // 12pt
                }),
              ],
              spacing: {
                after: 200,
                line: 360,
              },
            })
        ),
      },
    ],
  });

  return await Packer.toBlob(doc);
}
