import React, { useState, useEffect } from "react";
import Button from "./Button";
import Count from "./Count";

export interface CounterProps {
  defaultCount?: number;
}

const Counter: React.FC<CounterProps> = ({ defaultCount = 0 }) => {
  const [count, setCount] = useState<number>(defaultCount);
  useEffect(() => {
    setCount(defaultCount);
  }, [defaultCount]);
  function handleClick() {
    setCount((count) => count + 1);
  }
  return (
    <div>
      <Button onClick={handleClick} />
      <Count count={count} />
    </div>
  );
};

export default Counter;
