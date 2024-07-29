import React, { useState } from 'react';

interface ItemCounterProps {
  onCountChange: (count: number) => void;
  maxCount?: number;
}

const ItemCounter: React.FC<ItemCounterProps> = ({
  onCountChange,
  maxCount = 10,
}) => {
  const [count, setCount] = useState(0);

  const increment = () => {
    if (count < maxCount) {
      const newCount = count + 1;
      setCount(newCount);
      onCountChange(newCount);
    }
  };

  const decrement = () => {
    if (count > 0) {
      const newCount = count - 1;
      setCount(newCount);
      onCountChange(newCount);
    }
  };

  return (
    <div className="flex items-center">
      <button
        onClick={decrement}
        className="px-3 py-1 text-xl font-semibold"
        aria-label="Decrease quantity"
      >
        -
      </button>
      <span className="mx-2 w-8 text-center">{count}</span>
      <button
        onClick={increment}
        className="px-3 py-1 text-xl font-semibold"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
};

export default ItemCounter;
