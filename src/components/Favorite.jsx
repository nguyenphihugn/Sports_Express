import React, { useEffect, useState } from "react";
import moment from "moment";
import { CirclesWithBar } from "react-loader-spinner";
import axios from "axios";
import FullImage from "./FullImage";
import "../styles/Home.css";
import "react-datepicker/dist/react-datepicker.css";
import HeartIconComponent from "./HeartIcon";

export function Favorite() {
  const [items, setItems] = useState([]);
  const [isError, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const loadAllPosts = async () => {
      const savedPostIds = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.match(/^\d+$/)) {
          const post = JSON.parse(localStorage.getItem(key));
          savedPostIds.push(post.id);
        }
      }
      try {
        let index = 0;
        let allPosts = [];
        while (true) {
          const newPosts = await fetchMoreData(index);
          const mark = newPosts.filter((post) =>
            savedPostIds.includes(post.id)
          );
          allPosts = allPosts.concat(mark);
          if (newPosts.length !== 9) break;
          index++;
        }
        if (allPosts.length === 0) {
          setError("You don't have any favorite Blog!");
        } else setError(null);
        setItems(allPosts);
        setHasMore(false);
      } catch (err) {
        console.error(err);
        // Consider displaying an error message to the user or retrying the API call
      }
    };
    loadAllPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMoreData = async (index) => {
    try {
      const params = {
        skip: index,
        limit: 9,
      };
      const res = await axios.get(`/api/presign-urls`, { params });

      // if (res.data.presign_urls.length < 9 && items.length === 0) {
      //   setError("You don't have any favorite Blog!");
      // } else setError(null);
      return res.data.presign_urls;
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div>
      <div>
        <div className="container mt-5">
          <div className="row">
            {isError ? (
              <h4 className="d-flex align-items-center justify-content-center mb-0">
                {isError}
              </h4>
            ) : null}
            {items &&
              items.map((item, index) => (
                <div
                  className="col-md-4 mb-4"
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(item);
                  }}
                >
                  <div className="hover hover-4 text-white rounded">
                    <img src={item.url} alt={`Pic ${index + 1}`} />
                    <div className="hover-overlay d-flex align-items-center justify-content-center">
                      <HeartIconComponent item={item} />
                      <div className="hover-4-content">
                        <h3 className="hover-4-title text-white mb-0">
                          {item.title}
                        </h3>
                        <p className="hover-4-description text-uppercase mb-0 small">
                          {moment(item.create_at).format(
                            "MMMM Do YYYY, h:mm a"
                          )}
                          <br />
                          Created By: {item.owner.username}
                          <br />
                          {item.content.length > 20
                            ? item.content.substring(0, 20) + "..."
                            : item.content}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
        {hasMore ? (
          <div className="d-flex justify-content-center mb-4">
            <CirclesWithBar
              height="60"
              width="60"
              color="#2683b9"
              outerCircleColor="#24c3e3"
              innerCircleColor="#2683b9"
              barColor="#24c3e3"
              ariaLabel="circles-with-bar-loading"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
            />
          </div>
        ) : null}
        {selectedImage && (
          <FullImage
            image={selectedImage}
            content={selectedImage.content}
            createdAt={selectedImage.create_at}
            createdBy={selectedImage.owner}
            onClose={() => setSelectedImage(null)}
          />
        )}
      </div>
    </div>
  );
}
