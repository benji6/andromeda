export const initialState = [
  'detuned',
  'fm',
  'sine',
  'supersaw',
  'triangles'
]

export default (state = initialState, {type}) => {
  switch (type) {
    default:
      return state
  }
}
