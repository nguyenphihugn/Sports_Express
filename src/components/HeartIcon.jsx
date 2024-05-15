import React, { useState, useEffect } from "react";
import Heart from "react-animated-heart";

const HeartIconComponent = ({ item }) => {
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    setIsSelected(false);
    const storedItem = localStorage.getItem(`${item.id}`);
    if (storedItem) {
      setIsSelected(true);
    }
  }, [item.id]);

  const handleHeartClick = (e) => {
    e.stopPropagation();
    if (isSelected) {
      localStorage.removeItem(`${item.id}`);
    } else {
      localStorage.setItem(`${item.id}`, JSON.stringify(item));
    }
    setIsSelected(!isSelected);
  };

  return (
    <div className="hover-4-mark">
      <Heart isClick={isSelected} onClick={handleHeartClick} />
    </div>
  );
};

export default HeartIconComponent;
