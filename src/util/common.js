const isString = value => typeof value === 'string' || value instanceof String

const sortListByKeys = list =>
  Array.isArray(list)
    ? list.sort()
    : Object.assign(
        {},
        ...Object.keys(list)
          .sort()
          .map(key => ({ [key]: list[key] }))
      )

module.exports = {
  isString,
  sortListByKeys
}
