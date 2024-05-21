import React, { useState } from "react";
import axios from "axios";
import FileUpload from "../utils/FileUpload";
import Select from "react-select";
import "../styles/Add.css";
import { useNavigate } from "react-router-dom";

export const Account = () => {
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);
  const [selectedOption, setSelectedOption] = useState({
    value: "soccer",
    label: "Soccer",
  });
  const navigate = useNavigate();

  const options = [
    { value: "soccer", label: "Soccer" },
    { value: "basketball", label: "Basketball" },
    { value: "tennis", label: "Tennis" },
    { value: "swimming", label: "Swimming" },
  ];

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const token = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("UserToken"),
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = localStorage.getItem("ImageURL");
    if (!selectedOption || !content || !url) {
      setError("Please fill in all fields");
      // console.log(selectedOption, content, url, "Dieu Kien");
      return;
    }
    const title = selectedOption.value;
    // console.log(title, content, url);
    try {
      const response = await axios.post(
        "/api/blogs",
        { title, content, url },
        token
      );
      console.log(response.data);
      localStorage.removeItem("ImageURL");
      localStorage.removeItem("PresignURL");
      navigate("/home");
      // Redirect to blog post list or show success message
    } catch (error) {
      setError(error.message);
      localStorage.setItem("UserToken", "");
      navigate("/", { replace: true });
    }
  };

  return (
    <div className="container mt-5 mt-add">
      <div className="row">
        <div className="col-md-7 d-flex align-items-center justify-content-center">
          <FileUpload />
        </div>
        <form onSubmit={handleSubmit} className="col-md-5 margin">
          {/* <div className="col-md-5"> */}
          {error && <p style={{ color: "red" }}>{error}</p>}
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
              className="form-control text-big"
              id="content"
              rows="3"
              value={content}
              onChange={handleContentChange}
            ></textarea>
          </div>
          <button type="submit" className="upload-btn mb-3">
            Create Blog Post
          </button>
          {/* </div> */}
        </form>
      </div>
    </div>
  );
};
