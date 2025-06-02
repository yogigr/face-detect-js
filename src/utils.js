// src/utils.js

let loadImage;
if (typeof window === 'undefined') { // Check if running in Node.js
  const canvasModule = await import('canvas');
  loadImage = canvasModule.loadImage;
}

/**
 * Validasi gambar.
 * Akan beradaptasi untuk Node.js (menggunakan imagePath) atau Browser (menggunakan HTMLImageElement).
 * @param {string | HTMLImageElement} input - Path gambar (Node.js) atau elemen gambar (Browser).
 */
export async function validateImage(input) {
  let imageElement;
  if (typeof window === 'undefined') {
    // Node.js environment: input is imagePath string
    imageElement = await loadImage(input);
  } else {
    // Browser environment: input is HTMLImageElement
    if (!(input instanceof HTMLImageElement)) {
      throw new Error('Di lingkungan browser, validateImage mengharapkan HTMLImageElement.');
    }
    imageElement = input;
  }

  if (imageElement.width < 300 || imageElement.height < 300) {
    throw new Error('Resolusi gambar terlalu rendah. Minimal 300x300 piksel.');
  }
}