const getRandomColor = function () {
  let colors = [
    "#FFBC26",
    "#FD413C",
    "#2D9CFC",
    "#ffffff",
    "#6DACCB",
    "#894FC6",
    "#F934A4",
    "#36D9D8",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export default getRandomColor;
