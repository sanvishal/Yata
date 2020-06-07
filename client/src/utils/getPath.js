export const getPath = (path) => {
  return process.env.NODE_ENV === "development"
    ? `http://localhost:8080${path}`
    : `https://yata-brain.herokuapp.com${path}`;
};
