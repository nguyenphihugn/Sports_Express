import React, { useRef, useState } from "react";
import "../styles/FileUpload.css";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import "material-symbols";

const FileUpload = () => {
  const inputRef = useRef();

  const [selectedFile, setSelectedFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("select");
  const [uploadedFileSize, setUploadedFileSize] = useState(0);
  // const [totalFileSize, setTotalFileSize] = useState(0);

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const onChooseFile = () => {
    inputRef.current.click();
  };

  const clearFileInput = () => {
    inputRef.current.value = "";
    setSelectedFile(null);
    setProgress(0);
    setUploadStatus("select");
    localStorage.removeItem("ImageURL");
    localStorage.removeItem("PresignURL");
  };

  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  const handleUpload = async () => {
    if (uploadStatus === "done") {
      clearFileInput();
      return;
    }

    const list = {
      key: `${uuidv4()}.${selectedFile.type.split("/")[1]}`,
    };

    const config = {
      headers: {
        "Content-Type": "application/octet-stream",
      },
      onUploadProgress: (progressEvent) => {
        console.log(progressEvent);
        // if (progressEvent.total >= 1024 * 1024) {
        //   const loadedSize = parseInt(
        //     (progressEvent.loaded / (1024 * 1024)).toFixed(2)
        //   );
        //   const totalSize = parseInt(
        //     (progressEvent.total / (1024 * 1024)).toFixed(2)
        //   );
        //   setUploadedFileSize(loadedSize);
        //   setTotalFileSize(totalSize);
        // } else {
        //   const loadedSize = Math.round(progressEvent.loaded / 1024);
        //   const totalSize = Math.round(progressEvent.total / 1024);
        //   setUploadedFileSize(loadedSize);
        //   setTotalFileSize(totalSize);
        // }
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        console.log(percentCompleted);

        setUploadedFileSize(progressEvent.loaded);
        setProgress(percentCompleted);
      },
    };

    try {
      const response = await axios.get(`/api/presign-url-upload`, {
        params: {
          key: list.key,
        },
      });
      setUploadStatus("uploading");
      await axios.put(response.data.url, selectedFile, config);
      localStorage.setItem("ImageURL", list.key);
      localStorage.setItem("PresignURL", response.data.url);
      setUploadStatus("done");
    } catch (error) {
      setUploadStatus("select");
    }
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {/* Button to trigger the file input dialog */}
      {!selectedFile && (
        <button className="file-btn" onClick={onChooseFile}>
          <span className="material-symbols-outlined">upload</span> Upload File
        </button>
      )}

      {selectedFile && (
        <>
          <div className="file-card">
            <span className="material-symbols-outlined icon">description</span>

            <div className="file-info">
              <div style={{ flex: 1 }}>
                <h6>{selectedFile?.name}</h6>

                <h6>
                  {formatBytes(uploadedFileSize)} /{" "}
                  {formatBytes(selectedFile?.size)}
                </h6>

                <div className="progress-bg">
                  <div className="progress" style={{ width: `${progress}%` }} />
                </div>
              </div>

              {uploadStatus === "select" ? (
                <button onClick={clearFileInput}>
                  <span className="material-symbols-outlined close-icon">
                    close
                  </span>
                </button>
              ) : (
                <div className="check-circle">
                  {uploadStatus === "uploading" ? (
                    `${progress}%`
                  ) : uploadStatus === "done" ? (
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: "20px" }}
                    >
                      check
                    </span>
                  ) : null}
                </div>
              )}
            </div>
          </div>
          <button className="upload-btn" onClick={handleUpload}>
            {uploadStatus === "select" || uploadStatus === "uploading"
              ? "Upload"
              : "Click to Change Image"}
          </button>
        </>
      )}
    </div>
  );
};

export default FileUpload;
