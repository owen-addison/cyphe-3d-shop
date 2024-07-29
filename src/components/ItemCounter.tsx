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
    <div className="flex items-center space-x-2">
      <button
        onClick={decrement}
        className="font-mohave flex h-8 w-8 items-center justify-center text-2xl font-light text-moss-800 transition-all hover:text-3xl hover:text-moss-950"
        aria-label="Decrease quantity"
      >
        -
      </button>
      <span className="font-mohave w-8 text-center text-xl font-light text-moss-800">
        {count}
      </span>
      <button
        onClick={increment}
        className="font-mohave flex h-8 w-8 items-center justify-center text-2xl font-light text-moss-800 transition-all hover:text-3xl hover:text-moss-950"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
};

export default ItemCounter;
