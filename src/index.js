// src/index.js
import { 
  loadModelsLazy as loadModelsLazyInternal, 
  detectFace as detectFaceInternal,
  faceapi // <--- Impor 'faceapi' yang diekspor dari faceDetection.js
} from './faceDetection.js';

import { validateImage as validateImageInternal } from './utils.js';

// Re-export fungsi-fungsi utama
export { loadModelsLazyInternal as loadModelsLazy };
export { detectFaceInternal as detectFace };
export { validateImageInternal as validateImage };

// --- PENTING ---
// Mengekspor objek faceapi yang diimpor dari faceDetection.js.
// Ini akan membuat 'faceapi' tersedia saat diimpor dari bundle Anda.
// Misalnya: `import { faceapi } from 'your-bundle';`
export { faceapi }; // Re-export faceapi