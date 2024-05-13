import React, { useState } from "react";
import axios from "axios";
import { uploadFileToS3 } from "../utils/s3";

export const Account = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTitleChange = (e) => {
    setTitle(e.target.value.toLowerCase());
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
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

    if (!title || !content || !url) {
      setError("Please fill in all fields");
      return;
    }

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
      <div className="mb-3">
        <label htmlFor="title" className="form-label">
          Title
        </label>
        <input
          type="text"
          className="form-control"
          id="title"
          placeholder="Type title..."
          name="text"
          value={title}
          onChange={handleTitleChange}
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
      <div className="mb-3">
        <label htmlFor="file" className="form-label">
          Image
        </label>
        <div className="input-group">
          <input
            type="file"
            className="form-control"
            id="file"
            onChange={handleFileChange}
          />
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
      <button type="submit" className="btn btn-primary">
        Create Blog Post
      </button>
    </form>
  );
};
