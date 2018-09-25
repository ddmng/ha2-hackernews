export const toObject = (data) => {
  const sliced = data.map(i => ({[i]: ""}))
  const remapped = sliced.reduce((obj, e) => {
    obj[Object.keys(e)[0]] = {loaded: false}
    return obj
  } , {})
  return remapped
}

export const slice = (data, size) => 
  data.slice(0,size)
