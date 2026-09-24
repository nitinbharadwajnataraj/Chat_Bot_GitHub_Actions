import "@testing-library/jest-dom/vitest";

// jsdom does not implement scrollIntoView; App.tsx calls it to auto-scroll the chat window.
Element.prototype.scrollIntoView = () => {};
