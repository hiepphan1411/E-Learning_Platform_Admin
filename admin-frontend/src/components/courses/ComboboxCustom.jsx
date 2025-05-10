import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";


 const Combobox = ({ value, options, onChange, width }) => {
    const [isOpen, setIsOpen] = useState(false);
    const comboboxRef = useRef(null);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          comboboxRef.current &&
          !comboboxRef.current.contains(event.target)
        ) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isOpen]);

    return (
      <div className="relative" style={{ width }} ref={comboboxRef}>
        <button
          className="w-full flex items-center justify-between bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>{value}</span>
          <ChevronDown size={16} />
        </button>

        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-gray-700 rounded-md shadow-lg">
            {options.map((option) => (
              <div
                key={option}
                className="cursor-pointer px-4 py-2 hover:bg-gray-600 text-white"
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  export default Combobox;