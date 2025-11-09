import { useEffect, useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"; // Import arrow icons

const SlotSelector = ({ docSlots, slotIndex, slotTime, setSlotTime }) => {
  const containerRef = useRef(null);

  // Auto-scroll to last item on load
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollLeft = containerRef.current.scrollWidth;
    }
  }, [docSlots]);

  // Function to scroll left
  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: containerRef.current.scrollLeft > 0 && -200,
        behavior: "smooth",
      });
    }
  };

  // Function to scroll right
  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  return (
    <div className="flex items-center relative w-full mt-3 sm:mt-4">
      {/* Left Arrow Button */}
      <div className="flex mr-1 sm:mr-2">
        <button
          className="p-1.5 sm:p-2 bg-gray-100 rounded-full shadow-md hover:bg-gray-300 transition"
          onClick={scrollLeft}
        >
          <FaChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
      </div>

      {/* Scrollable Slots Container */}
      <div className="overflow-x-hidden flex-1">
        <div
          ref={containerRef}
          className="flex items-center gap-2 sm:gap-3 w-full overflow-x-auto snap-x snap-mandatory px-2 sm:px-4 md:px-6 lg:px-8 py-2 scrollbar-hide"
        >
          {docSlots.length > 0 &&
            docSlots[slotIndex].map((item, index) => (
              <p
                onClick={() => setSlotTime(item?.time)}
                className={`text-xs sm:text-sm font-light flex-shrink-0 px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 rounded-full cursor-pointer snap-end ${
                  item.time === slotTime
                    ? "bg-primary text-white"
                    : "text-gray-400 border border-gray-300"
                }`}
                key={index}
              >
                {item.time === false
                  ? "No slot available"
                  : item?.time?.toLowerCase()}
              </p>
            ))}
        </div>
      </div>

      {/* Right Arrow Button */}
      <div className="flex ml-1 sm:ml-2">
        <button
          className="p-1.5 sm:p-2 bg-gray-100 rounded-full shadow-md hover:bg-gray-300 transition"
          onClick={scrollRight}
        >
          <FaChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
      </div>
    </div>
  );
};

export default SlotSelector;
