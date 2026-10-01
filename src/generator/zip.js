import JSZip from 'jszip';

export async function makeZip(files = {}) {
  const zip = new JSZip();

  if (files.html) {
    zip.file('index.html', files.html);
  }
  if (files.css) {
    zip.file('style.css', files.css);
  }
  if (files.readme) {
    zip.file('README.txt', files.readme);
  }

  // If in browser, generate blob; otherwise uint8array
  const isBrowser = typeof window !== 'undefined' && typeof Blob !== 'undefined';
  const type = isBrowser ? 'blob' : 'uint8array';
  return await zip.generateAsync({ type });
}

export function triggerDownload(blob, filename = 'site-atolyesi.zip') {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
