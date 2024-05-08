import React from "react";
import moment from "moment";
import "../styles/FullImage.css";

const FullImage = ({ image, content, createdAt, createdBy, onClose }) => {
  return (
    <div
      className="modal fade show"
      aria-hidden="true"
      aria-labelledby="exampleModalToggleLabel"
      tabindex="-1"
      style={{ display: "block" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <div className="card text-white border-0">
              <img
                src={image.url}
                alt={image.title}
                className="card-img-overlay --card-img-overlay-purple d-flex flex-column justify-content-between align-items-start"
              />

              <div className="card-img-overlay card-overlay-black hover-light d-flex flex-column justify-content-between align-items-start">
                <div className="d-flex justify-content-between w-100 mb-3">
                  <div className="d-flex justify-content-between gap-3">
                    <span className="badge badge-lightblue mr-2 text-uppercase">
                      {" "}
                      {createdBy.username}
                    </span>
                    <span className="badge badge-warning text-uppercase">
                      {" "}
                      {image.title}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <p>
              <strong>Created At:</strong>{" "}
              {moment(createdAt).format("MMMM Do YYYY, h:mm:ss a")}
            </p>
            <p>
              <strong>Content:</strong> {content}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullImage;
