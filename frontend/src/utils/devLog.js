// src/utils/devLog.js
export const devLog = (source, ...args) => {
  if (import.meta.env.VITE_APP_ENV === "development") {
    console.log(`[DEV][${source}]`, ...args);
  }
};