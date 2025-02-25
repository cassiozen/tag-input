/** @type {import('@ladle/react').UserConfig} */
export default {
  stories: "src/**/stories.{ts,tsx,mdx}",
  addons: {
    rtl: {
      enabled: false,
      defaultState: false,
    },
    theme: {
      enabled: false,
      defaultState: "light",
    },
    mode: {
      enabled: false,
    },
    width: {
      enabled: false,
      defaultState: 0,
    },
  },
};
