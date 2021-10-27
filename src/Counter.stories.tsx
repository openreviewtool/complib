import React from "react";
import Counter, { CounterProps } from "./Counter";

export default {
  title: "Counter",
  component: Counter,
};

const Template = (args: CounterProps) => <Counter {...args} />;

export const Basic = Template.bind({});
Basic.args = {};
export const WithDefaultCounter = Template.bind({});
WithDefaultCounter.args = { defaultCount: 1000 };
