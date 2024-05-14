import React, { useState } from "react";
import axios from "axios";
import { uploadFileToS3 } from "../utils/s3";
import Select from "react-select";

export const Account = () => {
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState("");
  // const [title, setTitle] = useState("");
  const [showImage, setShowImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);

  const options = [
    { value: "soccer", label: "Soccer" },
    { value: "basketball", label: "Basketball" },
    { value: "tennis", label: "Tennis" },
    { value: "swimming", label: "Swimming" },
  ];

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setShowImage(URL.createObjectURL(e.target.files[0]));
  };

  const config = {
    headers: {
      "Content-Type": "application/octet-stream",
    },
  };

  const token = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("UserToken"),
    },
  };

  const handleUploadFile = async () => {
    if (!file) {
      setError("Please select a file");
      return;
    }

    setLoading(true);

    try {
      const url = await uploadFileToS3(file);
      console.log(url);
      await axios.put(url.presign, file, config);
      setUrl(url.key);
      setError(null);
      console.log(url);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOption || !content || !url) {
      setError("Please fill in all fields");
      return;
    }
    const title = selectedOption.value;
    console.log(title, content, url);
    try {
      const response = await axios.post(
        "/api/blogs",
        { title, content, url },
        token
      );
      console.log(response.data);
      // Redirect to blog post list or show success message
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="container mt-5">
      <div className="row">
        <div className="col-md-7 d-flex align-items-center justify-content-center">
          <div style={{ width: "80%" }}>
            <div className="input-group">
              {showImage === null ? (
                <label htmlFor="file" className="custum-file-upload">
                  <div className="icon">
                    <svg
                      viewBox="0 0 24 24"
                      fill=""
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V9C19 9.55228 19.4477 10 20 10C20.5523 10 21 9.55228 21 9V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM14 15.5C14 14.1193 15.1193 13 16.5 13C17.8807 13 19 14.1193 19 15.5V16V17H20C21.1046 17 22 17.8954 22 19C22 20.1046 21.1046 21 20 21H13C11.8954 21 11 20.1046 11 19C11 17.8954 11.8954 17 13 17H14V16V15.5ZM16.5 11C14.142 11 12.2076 12.8136 12.0156 15.122C10.2825 15.5606 9 17.1305 9 19C9 21.2091 10.7909 23 13 23H20C22.2091 23 24 21.2091 24 19C24 17.1305 22.7175 15.5606 20.9844 15.122C20.7924 12.8136 18.858 11 16.5 11Z"
                          fill=""
                        ></path>{" "}
                      </g>
                    </svg>
                  </div>
                  <div className="text">
                    <span>Click to upload image</span>
                  </div>
                  <input id="file" type="file" onChange={handleFileChange} />
                </label>
              ) : (
                <label className="custum-file-upload">
                  <img
                    src={showImage}
                    alt="Preview"
                    style={{
                      height: "300px",
                      width: "500px",
                      borderRadius: "10px",
                    }}
                  />
                  <input id="file" type="file" onChange={handleFileChange} />
                </label>
              )}
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={handleUploadFile}
                disabled={!file}
              >
                Upload
              </button>
            </div>
            {loading && <p>Uploading file...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
          </div>
        </div>
        <div className="col-md-5">
          <div className="mb-3">
            <Select
              options={options}
              isClearable={false}
              defaultValue={options[0]}
              onChange={setSelectedOption}
              theme={(theme) => ({
                ...theme,
                borderRadius: 10,
                colors: {
                  ...theme.colors,
                  primary25: "#24c3e3",
                  primary: "#24c3e3",
                },
              })}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="content" className="form-label">
              Content
            </label>
            <textarea
              className="form-control"
              id="content"
              rows="3"
              value={content}
              onChange={handleContentChange}
            ></textarea>
          </div>
          <button type="submit" className="btn btn-primary mb-3">
            Create Blog Post
          </button>
        </div>
      </div>
    </form>
  );
};
