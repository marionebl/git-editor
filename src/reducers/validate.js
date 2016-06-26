module.exports = function(state = [], action) {
  switch(action.type) {
    case 'BLUR_INPUT':
      console.log('BLUR_INPUT!');
    default:
      return state;
  }
};
