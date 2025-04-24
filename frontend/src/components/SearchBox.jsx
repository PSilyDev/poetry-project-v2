import { useRef, useState, useEffect, useCallback } from 'react';
import './SearchBox.css';

const suggestions = [
    'Shakespeare', 'Emily Dickinson', 'Robert Frost', 'Maya Angelou',
    'Walt Whitman', 'John Milton', 'Langston Hughes', 'Sylvia Plath',
    'E. E. Cummings', 'Pablo Neruda', 'Rumi', 'Edgar Allan Poe', 'William Blake'
];

function SearchBox({ setQuoteData, setShowSearch }) {
  const scrollRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [showLeftChevron, setShowLeftChevron] = useState(false);
  const [showRightChevron, setShowRightChevron] = useState(false);

  const checkScrollPosition = useCallback(() => {
    const element = scrollRef.current;
    if (element) {
      const scrollLeft = Math.round(element.scrollLeft); // Round for better comparison
      const maxScrollLeft = Math.round(element.scrollWidth - element.clientWidth);

      const canScrollLeft = scrollLeft > 0;
      // Use a small tolerance for floating point issues at the end
      const canScrollRight = scrollLeft < maxScrollLeft - 1;

      setShowLeftChevron(canScrollLeft);
      setShowRightChevron(canScrollRight);
    }
  }, []);

  useEffect(() => {
    const element = scrollRef.current;
    let resizeObserver;

    if (element) {
        checkScrollPosition(); // Initial check

        element.addEventListener('scroll', checkScrollPosition, { passive: true }); // Use passive listener

        // Use ResizeObserver for better performance than window resize listener
        resizeObserver = new ResizeObserver(checkScrollPosition);
        resizeObserver.observe(element);

        return () => {
            element.removeEventListener('scroll', checkScrollPosition);
            if (resizeObserver) {
              resizeObserver.unobserve(element);
            }
        };
    }
     // Cleanup function for the component unmount (just in case element wasn't available initially)
     return () => {
       if (resizeObserver) {
         resizeObserver.disconnect(); // Disconnect observer fully on unmount
       }
     }
  }, [checkScrollPosition]); // Dependency array


  const scroll = (scrollOffset) => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += scrollOffset;
    }
  };

  const handleSearch = async (term) => {
    // ... (handleSearch function remains the same)
    console.log('Handling search for term:', term);
    if (!term || !term.trim()) {
      alert('Please select or enter a valid author name.');
      return;
    }
    setLoading(true);
    setSelectedAuthor(term);

    try {
      const response = await fetch(`http://localhost:5000/api/poems/${encodeURIComponent(term)}`);
       if (!response.ok) {
           const errorData = await response.json().catch(() => ({ message: "Unknown server error" }));
           console.error("Server error:", response.status, errorData);
           alert(`Error fetching poems: ${errorData?.message || response.statusText || 'Server error'}`);
           setLoading(false);
           return;
       }
      const data = await response.json();
      console.log('Response received: ', data);
      if (data?.length > 0) {
        setQuoteData(data.map(poem => ({ ...poem, author: term })));
        setShowSearch(true);
      } else {
        alert(`No poems found for author: ${term}`);
         setShowSearch(false);
         setQuoteData(null);
      }
    } catch (error) {
      console.error("Error fetching poems:", error);
      alert("Failed to fetch poems. Check the console or network tab for details. Is the backend server running?");
    } finally {
      setLoading(false);
    }
  };

  // --- Helper to generate dynamic class names ---
  const getScrollButtonClasses = () => {
    let classes = 'scroll_buttons';
    if (showLeftChevron) classes += ' fade-left-visible';
    if (showRightChevron) classes += ' fade-right-visible';
    return classes;
  }

  return (
    <div className="search_box">
       {/* --- Apply dynamic classes here --- */}
      <div className={getScrollButtonClasses()}>
        {showLeftChevron && (
            <button
                onClick={() => scroll(-250)}
                className="chevron chevron-left"
                aria-label="Scroll suggestions left"
            >
                ❮ {/* Using actual chevron character */}
            </button>
        )}

        <div ref={scrollRef} className="suggestion_container">
          {suggestions.map((item, idx) => (
            <button
              key={`${item}-${idx}`}
              className={`suggestion_pill ${selectedAuthor === item ? 'selected' : ''}`}
              onClick={() => handleSearch(item)}
              disabled={loading}
            >
              {item}
            </button>
          ))}
        </div>

        {showRightChevron && (
            <button
                onClick={() => scroll(250)}
                className="chevron chevron-right"
                aria-label="Scroll suggestions right"
            >
                ❯ {/* Using actual chevron character */}
            </button>
        )}
      </div>
       {/* {loading && <div className="loading-indicator">Loading...</div>} */}
    </div>
  );
}

export default SearchBox;