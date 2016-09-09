const computedStyle = getComputedStyle(document.body)
const prop = name => computedStyle.getPropertyValue(name).trim()

export const green50 = prop('--green-50')
export const pink50 = prop('--pink-50')
