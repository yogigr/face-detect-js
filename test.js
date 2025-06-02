// test.js
import { loadModelsLazy, detectFace, validateImage } from './src/index.js'; // Pastikan path ini benar sesuai struktur proyek
import path from 'path';
import { fileURLToPath } from 'url';

// Replikasi __dirname dan __filename untuk ES Modules di Node.js
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function test() {
  try {
    console.time('Test Execution Time'); // Mulai timer untuk seluruh pengujian

    // Pastikan folder 'models' dan 'test-image.jpg' berada di lokasi yang sama
    // dengan file test.js, atau sesuaikan path-nya.
    const modelPath = path.resolve(__dirname, './models');
    console.log('Model Path:', modelPath);

    // --- Memuat Model Secara Lazy ---
    console.time('Model Loading Time'); // Mulai timer untuk loading model
    await loadModelsLazy(modelPath);
    console.timeEnd('Model Loading Time'); // Akhiri timer dan cetak waktu
    console.log('Models loaded successfully.');

    // --- Path Gambar untuk Pengujian ---
    const imagePath = path.resolve(__dirname, './test-image.jpeg');
    console.log('Image Path:', imagePath);

    // --- Validasi Gambar ---
    // Fungsi validateImage di src/utils.js menggunakan loadImage dari 'canvas'.
    // Ini akan bekerja karena Anda berada di lingkungan Node.js dan 'canvas' diinstal.
    console.time('Image Validation Time'); // Mulai timer untuk validasi gambar
    await validateImage(imagePath); // Tambahkan 'await' karena validateImage adalah async
    console.timeEnd('Image Validation Time'); // Akhiri timer dan cetak waktu
    console.log('Image validated successfully.');

    // --- Deteksi Wajah ---
    // Fungsi detectFace di src/faceDetection.js juga menggunakan loadImage dari 'canvas'.
    console.time('Face Detection Time'); // Mulai timer untuk deteksi wajah
    const descriptor = await detectFace(imagePath);
    console.timeEnd('Face Detection Time'); // Akhiri timer dan cetak waktu

    console.log('Face detected. Descriptor:');
    // Untuk descriptor, yang merupakan Float32Array, sebaiknya jangan dicetak seluruhnya
    // karena bisa sangat panjang. Cetak sebagian atau informasi singkat.
    console.log(descriptor.slice(0, 10), '...'); // Cetak 10 elemen pertama
    console.log('Descriptor length:', descriptor.length);

    console.timeEnd('Test Execution Time'); // Akhiri timer untuk seluruh pengujian
  } catch (error) {
    console.error('Test Error:', error.message);
    // Jika ada error, Anda mungkin ingin mencetak stack trace untuk debugging lebih lanjut
    // console.error(error);
  }
}

// Panggil fungsi pengujian
test();