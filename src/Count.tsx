import React from "react";

interface CountProps {
  count: number;
}

const Count: React.FC<CountProps> = ({ count }) => {
  return <span>{count}</span>;
};

export default Count;
