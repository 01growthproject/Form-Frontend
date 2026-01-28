import React, { useRef, useState } from "react";
import Webcam from "react-webcam";

const CameraInput = ({ label, name, setFile, error }) => {
  const webcamRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [cameraOn, setCameraOn] = useState(false);

  const startCamera = () => setCameraOn(true);

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    fetch(imageSrc)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], `${name}.jpg`, { type: "image/jpeg" });
        setFile(file);
        setPreview(imageSrc);
        setCameraOn(false); // Close camera after capture
      });
  };

  return (
    <div className="form-group">
      <label>{label} *</label>

      {!cameraOn && !preview && (
        <button type="button" onClick={startCamera}>
          📷 Open Camera
        </button>
      )}

      {cameraOn && (
        <>
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{ facingMode: "user" }}
            width="100%"
          />
          <button type="button" onClick={capture}>
            📸 Capture
          </button>
        </>
      )}

      {preview && (
        <>
          <img src={preview} alt="preview" width="100%" />
          <button type="button" onClick={() => setPreview(null)}>
            🔄 Retake
          </button>
        </>
      )}

      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default CameraInput;
