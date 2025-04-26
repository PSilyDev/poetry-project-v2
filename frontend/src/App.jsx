import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import './App.css';
import SearchBox from "./components/SearchBox";
import Card from "./components/Card";

function App() {
  const [quoteData, setQuoteData] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [showHeading, setShowHeading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(false);
  const [showCarousel, setShowCarousel] = useState(false);


  console.log('showSearch - ', showSearch);

  useEffect(() => {
    if (showSearch) {
      const timer = setTimeout(() => {
        setShowCarousel(true);
      }, 500); // match with dropdown animation duration
      return () => clearTimeout(timer);
    }
  }, [showSearch]);
  

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowHeading(true);
    }, 300);
    return () => clearTimeout(timeout);
  }, []);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % quoteData.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + quoteData.length) % quoteData.length);
  };

  return (
    <>
      <div className="base" style={{ position: "relative", overflow: "hidden" }}>
        <div className="content">
          <div className="master">
          <div className={`search_parent ${showHeading ? 'dropdown' : ''}`}>
            <div className={`search_heading ${!showCarousel ? 'center-heading' : ''}`}>
              {showCarousel && (<button onClick={handlePrev}>Prev</button>)}
              <h1>Poetry Postcards</h1>
              {showCarousel && (<button onClick={handleNext}>Next</button>)}
            </div>
          </div>
            <div className="left">
            {quoteData.length > 0 && showCarousel && (
              <div className="card-carousel">
                <>
                  <Card
                    position="left"
                      quoteData={quoteData[(currentIndex - 1 + quoteData.length) % quoteData.length]}
                    onClick={() => handlePrev()}
                  />
                  <Card
                    quoteData={quoteData[currentIndex]}
                    position="center"
                    className={fadeIn ? 'fade-in' : ''}
                  />
                  <Card
                    quoteData={quoteData[(currentIndex + 1) % quoteData.length]}
                    position="right"
                    onClick={() => handleNext()}
                  />
                </>
              </div>  
            )}
            </div>
          </div>
          <div className={`search_left ${!showSearch ? 'centered' : ''} ${showSearch && !showHeading ? 'animate-slide' : ''}`}>
            <SearchBox setQuoteData={setQuoteData} setShowSearch={setShowSearch} />
          </div>
        </div>
  
        <div className="made_with_love">
          Made with love
          <FontAwesomeIcon
            icon={faHeart}
            size="sm"
            style={{ color: "#ff0000", marginLeft: "5px", marginRight: "5px" }}
          />
          by <em>Prakhar</em> and <em>Neelabh.</em>
        </div>
      </div>
    </>
  );
  
}

export default App;
