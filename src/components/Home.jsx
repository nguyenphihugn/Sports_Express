import React, { useEffect, useState, useRef } from "react";
// import InfiniteScroll from "react-infinite-scroll-component";
import moment from "moment";
import { CirclesWithBar } from "react-loader-spinner";
import axios from "axios";
import FullImage from "./FullImage";
import "../styles/Home.css";
import DatePicker from "react-datepicker";
import Select from "react-select";

import "react-datepicker/dist/react-datepicker.css";
// import Heart from "react-animated-heart";
import HeartIconComponent from "./HeartIcon";

export function Home() {
  const [items, setItems] = useState([]);
  // const [isSelect, setSelect] = useState(true);
  // const [index, setIndex] = useState(1);
  const [isError, setError] = useState(null);
  const hasMore = useRef(true);
  const index = useRef(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [startDateCal, setStartDateCal] = useState(
    moment(new Date()).utcOffset(7).format("YYYY-MM-DD HH:mm:ss.SSS")
  );
  const startDate = useRef(
    moment(new Date()).utcOffset(7).format("YYYY-MM-DD HH:mm:ss.SSS")
  );
  const [selectedOption, setSelectedOption] = useState(null);

  const options = [
    { value: "soccer", label: "Soccer" },
    { value: "basketball", label: "Basketball" },
    { value: "tennis", label: "Tennis" },
    { value: "swimming", label: "Swimming" },
  ];

  useEffect(() => {
    let isLoading = false;
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const threshold = 200;
      if (
        scrollPosition >= document.body.offsetHeight - threshold &&
        !isLoading
      ) {
        isLoading = true;
        loadPosts().finally(() => {
          isLoading = false;
        });
      }
      requestAnimationFrame(handleScroll);
    };
    requestAnimationFrame(handleScroll);

    return () => cancelAnimationFrame(handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadPosts = async () => {
    if (!hasMore.current) {
      // console.log("No more posts");
      return;
    }
    try {
      const newPosts = await fetchMoreData(index.current);
      setItems((prevPosts) => [...prevPosts, ...newPosts]);
      index.current++;

      hasMore.current = newPosts.length === 9;
    } catch (err) {
      console.error(err);
      // Consider displaying an error message to the user or retrying the API call
    }
  };

  const fetchMoreData = async (index) => {
    try {
      const params = {
        skip: index,
        limit: 9,
        date: startDate.current,
      };
      if (selectedOption !== null) {
        params.subject = selectedOption.value;
      }
      const res = await axios.get(`/api/presign-urls`, { params });
      if (res.data.presign_urls.length === 0) {
        setError("There is no Blog!");
      } else setError(null);
      // console.log(res.data.presign_urls.length);
      // console.log(isError);
      return res.data.presign_urls;
    } catch (err) {
      console.error(err);
      // Consider displaying an error message to the user or retrying the API call
    }
  };

  const handleBellClick = async () => {
    index.current = 0;
    const newPosts = await fetchMoreData(index.current);
    setItems(newPosts);
    index.current++;
    hasMore.current = newPosts.length === 9;
  };

  return (
    <div>
      <div className="d-flex justify-content-center gap-8">
        <DatePicker
          className="datecus"
          selected={startDateCal}
          onChange={(date) => {
            setStartDateCal(date);
            startDate.current = moment(date)
              .utcOffset(7)
              .format("YYYY-MM-DD HH:mm:ss.SSS");
          }}
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
        <button className="button" onClick={handleBellClick}>
          <svg
            className="bell"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              // stroke-linecap="round"
              // stroke-width="2"
              d="M18.796 4H5.204a1 1 0 0 0-.753 1.659l5.302 6.058a1 1 0 0 1 .247.659v4.874a.5.5 0 0 0 .2.4l3 2.25a.5.5 0 0 0 .8-.4v-7.124a1 1 0 0 1 .247-.659l5.302-6.059c.566-.646.106-1.658-.753-1.658Z"
            />
          </svg>
        </button>
      </div>
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
                      {/* <div className="hover-4-mark">
                        <Heart
                          isClick={isSelect}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelect(!isSelect);
                          }}
                        />                     
                      </div> */}
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
        {hasMore.current ? (
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
