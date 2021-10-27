module.exports = {
  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)",
    "../src/stories/component/*.stories.@(js|jsx|ts|tsx)",
    "../src/stories/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-knobs",
    "@storybook/addon-essentials"
  ]
}
