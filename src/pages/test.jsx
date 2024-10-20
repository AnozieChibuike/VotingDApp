import React, { useEffect, useRef, useState } from "react";
import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import "@tensorflow/tfjs";
// import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { useVisitorData } from "@fingerprintjs/fingerprintjs-pro-react";

// const getDeviceFingerprint = async () => {
//   // Load the FingerprintJS library
//   const fp = await FingerprintJS.load();
//   // Get the unique fingerprint for the device
//   const result = await fp.get();
//   console.log(result);
//   return result.visitorId; // This is the unique device identifier
// };

// function Test() {
//   const {isLoading, error, data, getData} = useVisitorData(
//     {extendedResult: true},
//     {immediate: true}
//   )
//   // getDeviceFingerprint();
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const [detector, setDetector] = useState(null);

//   // Load the face landmarks detection model
//   useEffect(() => {
//     const loadModel = async () => {
//       const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
//       const detectorConfig = {
//         runtime: "tfjs", // You can switch to 'mediapipe' if you want to use MediaPipe runtime
//       };
//       const detector = await faceLandmarksDetection.createDetector(
//         model,
//         detectorConfig
//       );
//       console.log(detector);
//       setDetector(detector);
//       console.log("Model loaded successfully");
//     };
//     loadModel();
//     startVideo();
//   }, []);

//   // Start the video stream
//   const startVideo = async () => {
//     const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//     if (videoRef.current) {
//       videoRef.current.srcObject = stream;
//     }
//   };

//   // Capture the frame and process the face
//   const captureFace = async () => {
//     console.log(20);
//     if (!detector) {
//       console.log(2000);
//       return;
//     }

//     const video = videoRef.current;
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");

//     // Draw the video frame onto the canvas
//     ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

//     // Run face detection
//     const predictions = await detector.estimateFaces(video);

//     if (predictions.length > 0) {
//       console.log("Face detected:", predictions);
//       const faceDescriptor = extractFaceDescriptor(predictions[0]);
//       //   console.log(faceDescriptor);
//       sendFaceDataToBackend(faceDescriptor);
//     } else {
//       alert("No face detected. Try again.");
//     }
//   };

//   // Extract the face descriptor from the model's predictions
//   const extractFaceDescriptor = (prediction) => {
//     return prediction.keypoints.map((point) => [point.x, point.y]); // Get the key facial landmarks
//   };

//   // Send face descriptor to backend
//   const sendFaceDataToBackend = async (faceDescriptor) => {
//     try {
//       const response = await fetch("http://localhost:4000/store-face", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ faceDescriptor }),
//       });

//       const result = await response.json();
//       if (result.success) {
//         console.log(result);
//         alert("Face data stored successfully!");
//       } else {
//         alert("Error storing face data.");
//       }
//     } catch (error) {
//       console.error("Error sending face data:", error);
//       alert("Failed to store face data.");
//     }
//   };

//   return (
//     <div>
//       <h1>Facial Recognition Whitelisting</h1>
//       <video ref={videoRef} width="640" height="480" autoPlay></video>
//       <canvas
//         ref={canvasRef}
//         width="640"
//         height="480"
//         style={{ display: "none" }}
//       ></canvas>
//       <button onClick={captureFace}>Capture Face</button>
//     </div>
//   );
// }

function Test() {
  const { isLoading, error, data, getData } = useVisitorData(
    { extendedResult: true },
    { immediate: true }
  );

  return (
    <div>
      <button onClick={() => getData({ ignoreCache: true })}>
        Reload data
      </button>
      <p>VisitorId: {isLoading ? "Loading..." : data?.visitorId}</p>
      <p>Full visitor data:</p>
      <pre>{error ? error.message : JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default Test;
