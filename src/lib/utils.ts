/**
 * Generate random string id with given segments and length
 * @params
 * segments: string = 3
 * length: string = 4
*/
export const generateId = (segments = 3, length = 4) =>
  Array.from({ length: segments }, () =>
    Math.random().toString(16).slice(-length)
  ).join('')
