export default (state = 0, {type, value}) => {
  switch (type) {
    case 'UPDATE_ROOT_NOTE':
      return value;
    default:
      return state;
  }
};
