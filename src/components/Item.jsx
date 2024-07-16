import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

function Item({ data, isDetailedView, toggleView }) {
  const [shouldShowDetails, setShouldShowDetails] = useState(false);
  const { id } = data;

  // Handler for adding to basket
  const addToBasket = (event) => {
    event.stopPropagation();
    console.log(`Add item to basket, id = ${id}`);
  };

  useEffect(() => {
    if (isDetailedView) {
      // Wait for the resize transition of item-rhs to finish before showing details
      setTimeout(() => {
        setShouldShowDetails(true);
      }, 500); // This matches the duration of the resize transition
    } else {
      setShouldShowDetails(false);
    }
  }, [isDetailedView]);

  return (
    <div className="item" onClick={toggleView}>
      {/* Image container */}
      <div className="item-lhs p-4">
        <img
          src={data.imageSrc}
          alt={`${data.name} image`}
          className="item-image h-96 w-auto p-4"
        />
      </div>
      {/* Description box that resizes and then fades in content */}
      <div
        className={`item-rhs flex flex-col content-center justify-center overflow-hidden transition-all duration-500 ease-in-out ${isDetailedView ? 'w-80 gap-4 p-4' : 'w-0 gap-0 p-0'} ${shouldShowDetails ? 'opacity-100' : 'opacity-0'}`}
      >
        {shouldShowDetails && (
          <>
            <div className="item-details-container font-sans tracking-widest text-moss-950">
              <h3 className="item-header font-semibold">{data.name}</h3>
              <div className="flex flex-col content-center justify-center">
                <ul className="item-ingredients w-max list-disc self-center text-start">
                  {data.ingredients.map((ingredient, index) => (
                    <li key={index} className="ingredient">
                      {ingredient}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <button
              className="add-button w-max self-center rounded border border-moss-800 bg-moss-800 px-4 py-2 font-semibold text-slate-100 transition-colors duration-200 ease-in-out hover:border-moss-950 hover:bg-moss-950"
              onClick={addToBasket}
            >
              Add to basket
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// Define the expected prop types
Item.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    imageSrc: PropTypes.string.isRequired,
    ingredients: PropTypes.array.isRequired,
  }).isRequired,
  isDetailedView: PropTypes.bool.isRequired,
  toggleView: PropTypes.func.isRequired,
};

export default Item;
