const {documentElement} = process.env.NODE_ENV === 'test' ? {} : document
const rootStyles = process.env.NODE_ENV === 'test' ? {} : getComputedStyle(documentElement)

export const getCssVar = key => rootStyles.getPropertyValue(key)
export const setCssVar = (key, val) => documentElement.style.setProperty(key, val)
