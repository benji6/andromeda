export default (pattern, currentIndex, length, ascendingVal) => {
  switch (pattern) {
    case 'up':
      return true;
    case 'down':
      return false;
    case 'up and down':
      if (currentIndex === 0) {
        return true;
      } else if (currentIndex === length - 1) {
        return false;
      }
  }
  return ascendingVal;
};
