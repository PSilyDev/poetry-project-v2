import React, { useEffect, useRef, useState } from "react";
import "./Card.css";

function Card({ quoteData, position = 'center', onClick, onNext, onPrev }) {
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);
  const poemRef = useRef(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    handleSwipe();
  };

  const handleSwipe = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      onNext();
    } else if (diff < -50) {
      onPrev();
    }
  };

  useEffect(() => {
    const el = poemRef.current;
    if (el) {
      setIsOverflowing(el.scrollHeight > el.clientHeight);
    }
  }, [quoteData]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onNext, onPrev]);

  useEffect(() => {
    const el = poemRef.current;
    if (el) {
      setIsOverflowing(el.scrollHeight > el.clientHeight);
  
      const handleScroll = () => {
        if (el.scrollTop + el.clientHeight >= el.scrollHeight - 5) {
          setHasScrolled(true); // fully scrolled to bottom
        } else {
          setHasScrolled(false); // still space to scroll
        }
      };
      
  
      el.addEventListener('scroll', handleScroll);
      return () => el.removeEventListener('scroll', handleScroll);
    }
  }, [quoteData]);

  const scrollDown = () => {
    if (poemRef.current) {
      poemRef.current.scrollBy({
        top: 200, // scroll down by 100px (adjust this value as you want)
        behavior: 'smooth', // smooth scrolling
      });
    }
  };
  
  return (
    <div
      className={`card ${position}`}
      onClick={onClick}
      role="button"
      tabIndex="0"
    >
      <div
        className="poem-card"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="content">
          <div className="heading">
            <h2>{quoteData?.title}</h2>
          </div>
          {/* <div className={`card-wrapper`}> */}
            <div className="poem-content" ref={poemRef}>
              <pre className="lines">{quoteData?.lines?.join("\n")}</pre>
            </div>
          {/* </div> */}
        </div>
        {isOverflowing && !hasScrolled && (
          <div className="scroll-hint" onClick={scrollDown}>
            <span className="chevron">&#x25BC;</span> {/* Downward chevron */}
          </div>
        )}
        {/* <button className="author_pill">{quoteData?.author}</button> */}
      </div>
    </div>
  );
}

export default Card;
