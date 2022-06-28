const { getUserInput } = require('./input')
const { loadVariablesConfig } = require('./files')
const { sortListByKeys } = require('./common')

module.exports.getAllCategoryKeysCombinations = () => {
  const variablesConfig = loadVariablesConfig()

  const produceCategoryKeysCombinations = ([head, ...tail]) => {
    const categoryValues = Object.keys(variablesConfig[head])
    const headValues = categoryValues.map(categoryValue => ({ [head]: categoryValue }))
    const mergeWithChildren = value =>
      produceCategoryKeysCombinations(tail).map(childValue => ({ ...value, ...childValue }))

    return tail.length > 0 ? headValues.flatMap(mergeWithChildren) : headValues
  }

  const categoryKeys = Object.keys(variablesConfig).filter(key => key !== 'common')
  return produceCategoryKeysCombinations(categoryKeys)
}

module.exports.selectCategories = passedCategories => {
  const variablesConfig = loadVariablesConfig()
  const categories = Object.assign(
    {},
    ...passedCategories.map(category => {
      const splitted = category.split(':')
      const categoryKey = splitted[0]
      const categoryValue = splitted[1]
      return { [categoryKey]: categoryValue }
    })
  )

  Object.keys(categories).forEach(categoryKey => {
    const categoryValue = categories[categoryKey]

    if (!variablesConfig.hasOwnProperty(categoryKey))
      throw new Error(`Key ${categoryKey} not found in variables`)
    if (!variablesConfig[categoryKey].hasOwnProperty(categoryValue))
      throw new Error(`Key ${categoryValue} not found in ${categoryKey} variables`)
  })

  Object.keys(variablesConfig)
    .filter(categoryKey => categoryKey !== 'common')
    .forEach(categoryKey => {
      if (categories.hasOwnProperty(categoryKey)) return

      const categoryValues = Object.keys(variablesConfig[categoryKey])
      const categoryValuesList = categoryValues
        .map((categoryValue, index) => `${index + 1}. ${categoryValue}`)
        .join('\n')

      let selectedCategoryValue = null
      while (!selectedCategoryValue) {
        console.log(`Please select ${categoryKey}:`)
        console.log(categoryValuesList)
        const selectedIndex = parseInt(getUserInput()) - 1
        if (selectedIndex >= 0 && selectedIndex < categoryValues.length)
          selectedCategoryValue = categoryValues[selectedIndex]
      }

      categories[categoryKey] = selectedCategoryValue
    })

  return sortListByKeys(categories)
}
