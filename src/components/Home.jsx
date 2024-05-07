import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import moment from "moment";
import { CirclesWithBar } from "react-loader-spinner";
import axios from "axios";
import "../styles/Home.css";

export function Home() {
  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [index, setIndex] = useState(1);

  useEffect(() => {
    axios
      .get("/api/presign-urls?skip=0&limit=9")
      .then((res) => setItems(res.data.presign_urls))
      .catch((err) => console.log(err));
  }, []);

  const fetchMoreData = () => {
    axios
      .get(`/api/presign-urls?skip=${index}&limit=9`)
      .then((res) => {
        setItems((prevItems) => [...prevItems, ...res.data.presign_urls]);

        res.data.length > 0 ? setHasMore(true) : setHasMore(false);
      })
      .catch((err) => console.log(err));

    setIndex((prevIndex) => prevIndex + 1);
  };

  return (
    <InfiniteScroll
      dataLength={items.length}
      next={fetchMoreData}
      hasMore={hasMore}
      loader={
        <div className="d-flex justify-content-center mb-4">
          <CirclesWithBar
            height="60"
            width="60"
            color="#4a94fd"
            outerCircleColor="#4a94fd"
            innerCircleColor="#4a94fd"
            barColor="#4a94fd"
            ariaLabel="circles-with-bar-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </div>
      }
    >
      <div className="container mt-5">
        <div className="row">
          {items &&
            items.map((item, index) => (
              <div className="col-md-4 mb-4" key={index}>
                <div className="hover hover-4 text-white rounded">
                  <img src={item.url} alt={`Pic ${index + 1}`} />
                  <div className="hover-overlay d-flex align-items-center justify-content-center">
                    <div className="hover-4-content">
                      <h3 className="hover-4-title text-white mb-0">
                        {item.title}
                      </h3>
                      <p className="hover-4-description text-uppercase mb-0 small">
                        {item.content.length > 50
                          ? item.content.substring(0, 50) + "..."
                          : item.content}
                        <br />
                        {moment(item.create_at).format(
                          "MMMM Do YYYY, h:mm:ss a"
                        )}
                        <br />
                        Created By: {item.owner.username}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </InfiniteScroll>
  );
}
