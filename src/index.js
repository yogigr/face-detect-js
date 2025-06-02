// src/index.js
import { loadModelsLazy as loadModelsLazyInternal, detectFace as detectFaceInternal } from './faceDetection.js';
import { validateImage as validateImageInternal } from './utils.js';

// Fungsi untuk memuat model secara lazy
export async function loadModelsLazy(modelPath) {
  await loadModelsLazyInternal(modelPath);
}

// Fungsi untuk mendeteksi wajah
export async function detectFace(imagePath) {
  return await detectFaceInternal(imagePath);
}

// Fungsi untuk validasi gambar
export async function validateImage(imagePath) {
  validateImageInternal(imagePath);
}