// src/faceDetection.js

// Conditional imports for Node.js specific modules
let createCanvas, loadImage, createImageData;
if (typeof window === 'undefined') { // Check if running in Node.js
  // Hanya import 'canvas' jika di Node.js
  const canvasModule = await import('canvas');
  createCanvas = canvasModule.createCanvas;
  loadImage = canvasModule.loadImage;
  createImageData = canvasModule.createImageData;
}

let faceapiModule = null;
let modelsLoaded = false;

/**
 * Memuat library face-api.js dan model-modelnya secara dinamis (lazy load).
 * Akan beradaptasi untuk Node.js (loadFromDisk) atau Browser (loadFromUri).
 * @param {string} modelPath - Path ke folder model (lokal untuk Node.js, URL untuk Browser).
 */
export async function loadModelsLazy(modelPath) {
  if (!faceapiModule) {
    console.log('[faceDetection.js]: Dynamically importing face-api.js...');
    faceapiModule = await import('face-api.js');

    // Monkey patching hanya jika di Node.js
    if (typeof window === 'undefined') {
      try {
        const dummyCanvas = createCanvas(1, 1);
        faceapiModule.env.monkeyPatch({
          Canvas: dummyCanvas.constructor,
          Image: loadImage,
          ImageData: createImageData,
        });
        console.log('[faceDetection.js]: face-api.js monkey-patched for Node.js environment.');
      } catch (e) {
        console.warn('[faceDetection.js]: Could not monkey-patch face-api.js in Node.js environment. Error:', e);
      }
    }
  }

  if (!modelsLoaded) {
    console.log('[faceDetection.js]: Loading face-api.js models...');
    if (typeof window === 'undefined') {
      // Node.js: load from disk
      await faceapiModule.nets.ssdMobilenetv1.loadFromDisk(modelPath);
      await faceapiModule.nets.faceLandmark68Net.loadFromDisk(modelPath);
      await faceapiModule.nets.faceRecognitionNet.loadFromDisk(modelPath);
      console.log('[faceDetection.js]: Models loaded from disk (Node.js).');
    } else {
      // Browser: load from URI
      // Pastikan modelPath adalah URL yang dapat diakses (misalnya, '/models' jika di-host di server yang sama)
      await faceapiModule.nets.ssdMobilenetv1.loadFromUri(modelPath);
      await faceapiModule.nets.faceLandmark68Net.loadFromUri(modelPath);
      await faceapiModule.nets.faceRecognitionNet.loadFromUri(modelPath);
      console.log('[faceDetection.js]: Models loaded from URI (Browser).');
    }
    modelsLoaded = true;
  }
}

/**
 * Deteksi wajah dan ekstraksi descriptor.
 * Akan beradaptasi untuk Node.js (menggunakan imagePath) atau Browser (menggunakan HTMLImageElement/HTMLCanvasElement/HTMLVideoElement).
 * @param {string | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement} input - Path gambar (Node.js) atau elemen media (Browser).
 * @returns {Promise<Array<faceapi.WithFaceDescriptor<faceapi.WithFaceLandmarks<faceapi.WithFaceDetection<{}>>>>>>} Detections array.
 */
export async function detectFace(input) {
  if (!faceapiModule || !modelsLoaded) {
    throw new Error('Face-API.js library or models not loaded. Call loadModelsLazy() first.');
  }

  let mediaElement;
  let tensor; // Hanya digunakan di Node.js

  if (typeof window === 'undefined') {
    // Node.js environment: input is imagePath string
    const uploadedImage = await loadImage(input);
    const canvasObj = createCanvas(uploadedImage.width, uploadedImage.height);
    const ctx = canvasObj.getContext('2d');
    ctx.drawImage(uploadedImage, 0, 0, uploadedImage.width, uploadedImage.height);
    tensor = faceapiModule.tf.browser.fromPixels(canvasObj);
    mediaElement = canvasObj; // Gunakan canvas untuk deteksi di Node.js
  } else {
    // Browser environment: input is HTMLImageElement, HTMLCanvasElement, or HTMLVideoElement
    if (!(input instanceof HTMLImageElement || input instanceof HTMLCanvasElement || input instanceof HTMLVideoElement)) {
      throw new Error('Di lingkungan browser, detectFace mengharapkan HTMLImageElement, HTMLCanvasElement, atau HTMLVideoElement.');
    }
    mediaElement = input;
    // face-api.js dapat langsung mengambil elemen media HTML, ia akan membuat tensor secara internal
  }

  const detections = await faceapiModule
    .detectAllFaces(mediaElement)
    .withFaceLandmarks()
    .withFaceDescriptors();

  // Buang tensor hanya jika dibuat secara manual (di Node.js)
  if (tensor) {
    tensor.dispose();
  }

  return detections; // Mengembalikan seluruh array deteksi
}