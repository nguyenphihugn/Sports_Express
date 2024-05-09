import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import moment from "moment";
import { CirclesWithBar } from "react-loader-spinner";
import axios from "axios";
import FullImage from "./FullImage";
import "../styles/Home.css";
import DatePicker from "react-datepicker";
import Select from "react-select";

import "react-datepicker/dist/react-datepicker.css";
// import Heart from "react-animated-heart";

export function Home() {
  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [index, setIndex] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [selectedOption, setSelectedOption] = useState(null);

  const options = [
    { value: "soccer", label: "Soccer" },
    { value: "basketball", label: "Basketball" },
    { value: "tennis", label: "Tennis" },
    { value: "swimming", label: "Swimming" },
  ];

  useEffect(() => {
    console.log(selectedOption);
    if (selectedOption !== null) {
      axios
        .get("/api/presign-urls", {
          params: {
            skip: 0,
            limit: 9,
            date: startDate,
            subject: selectedOption.value,
          },
        })
        .then((res) => setItems(res.data.presign_urls))
        .catch((err) => console.log(err));
    } else {
      axios
        .get("/api/presign-urls", {
          params: {
            skip: 0,
            limit: 9,
            date: startDate,
          },
        })
        .then((res) => setItems(res.data.presign_urls))
        .catch((err) => console.log(err));
    }
  }, [startDate, selectedOption]);

  const fetchMoreData = () => {
    if (selectedOption !== null) {
      axios
        .get(`/api/presign-urls`, {
          params: {
            skip: index,
            limit: 9,
            date: startDate,
            subject: selectedOption.value,
          },
        })
        .then((res) => {
          setItems((prevItems) => [...prevItems, ...res.data.presign_urls]);

          if (res.data.length < 9) {
            setHasMore(false);
          } else {
            setHasMore(true);
          }
        })
        .catch((err) => console.log(err));
    } else {
      axios
        .get(`/api/presign-urls`, {
          params: {
            skip: index,
            limit: 9,
            date: startDate,
          },
        })
        .then((res) => {
          setItems((prevItems) => [...prevItems, ...res.data.presign_urls]);

          res.data.length > 0 ? setHasMore(true) : setHasMore(false);
        })
        .catch((err) => console.log(err));
    }

    setIndex((prevIndex) => prevIndex + 1);
  };

  return (
    <div>
      <div className="d-flex justify-content-center gap-8">
        <DatePicker
          className="datecus"
          selected={startDate}
          onChange={(date) => setStartDate(date)}
        />
        <Select
          options={options}
          isClearable={true}
          defaultValue={selectedOption}
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
      <InfiniteScroll
        dataLength={items.length}
        next={fetchMoreData}
        hasMore={hasMore}
        onScroll={() => console.log("scroll")}
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
                <div
                  className="col-md-4 mb-4"
                  key={index}
                  onClick={() => setSelectedImage(item)}
                >
                  <div className="hover hover-4 text-white rounded">
                    <img src={item.url} alt={`Pic ${index + 1}`} />
                    <div className="hover-overlay d-flex align-items-center justify-content-center">
                      {/* <div className="hover-4-mark">
                        <Heart
                        isClick={isClick}
                        onClick={() => setClick(!isClick)}
                        />
                      </div> */}
                      <div className="hover-4-content">
                        <h3 className="hover-4-title text-white mb-0">
                          {item.title}
                        </h3>
                        <p className="hover-4-description text-uppercase mb-0 small">
                          {moment(item.create_at).format(
                            "MMMM Do YYYY, h:mm:ss a"
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
        {selectedImage && (
          <FullImage
            image={selectedImage}
            content={selectedImage.content}
            createdAt={selectedImage.create_at}
            createdBy={selectedImage.owner}
            onClose={() => setSelectedImage(null)}
          />
        )}
      </InfiniteScroll>
    </div>
  );
}
