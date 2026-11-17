// In-memory file transfer between pages (e.g. from Hero to Editor)
// Bypasses sessionStorage quota limits for large files (PDF, Word, Images)

let pendingTransferFile: File | null = null;

export function setTransferFile(file: File) {
  pendingTransferFile = file;
}

export function getTransferFile(): File | null {
  const file = pendingTransferFile;
  pendingTransferFile = null;
  return file;
}
