// test.js
import { loadModelsLazy, detectFace, validateImage, faceapi } from './src/index.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Replikasi __dirname dan __filename untuk ES Modules di Node.js
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function test() {
  try {
    console.time('Test Execution Time');

    const modelPath = path.resolve(__dirname, './models');
    console.log('Model Path:', modelPath);

    // --- Memuat Model Secara Lazy ---
    console.time('Model Loading Time');
    await loadModelsLazy(modelPath);
    console.timeEnd('Model Loading Time');
    console.log('Models loaded successfully.');

    // --- Path Gambar untuk Pengujian ---
    const imagePath = path.resolve(__dirname, './test-image.jpeg');
    console.log('Image Path:', imagePath);

    // --- Validasi Gambar ---
    console.time('Image Validation Time');
    await validateImage(imagePath);
    console.timeEnd('Image Validation Time');
    console.log('Image validated successfully.');

    // --- Deteksi Wajah ---
    console.time('Face Detection Time');
    // `detections` sekarang adalah array dari objek hasil deteksi,
    // di mana setiap objek memiliki properti `descriptor`.
    const detections = await detectFace(imagePath);
    console.timeEnd('Face Detection Time');

    if (detections.length > 0) {
      console.log(`Wajah terdeteksi: ${detections.length}`);

      // Iterasi setiap deteksi untuk mendapatkan descriptor
      detections.forEach((detection, index) => {
        const descriptor = detection.descriptor; // Ini adalah descriptor yang Anda cari!

        console.log(`Descriptor untuk wajah ke-${index + 1}:`);
        // Cetak 10 elemen pertama dan panjang descriptor untuk verifikasi
        console.log(descriptor.slice(0, 10), '...');
        console.log('Panjang Descriptor:', descriptor.length);

        // Jika Anda ingin melihat seluruh descriptor (hati-hati, bisa sangat panjang!)
        // console.log('Full Descriptor:', descriptor); 
      });
    } else {
      console.log('Tidak ada wajah terdeteksi.');
    }

    console.timeEnd('Test Execution Time');
  } catch (error) {
    console.error('Terjadi Error:', error.message);
    console.error(error); // Cetak stack trace penuh untuk debugging
  }
}

// Panggil fungsi pengujian
test();