const configService = require('./config.service')
const { getUserInput } = require('../util/input')
const { sortListByKeys } = require('../util/common')

const filterNonDefault = category => category !== 'default'

const getAllCategoryKeysCombinations = () => {
  const configurations = configService.listConfigurations()

  const produceCategoryKeysCombinations = ([head, ...tail]) => {
    const categoryValues = Object.keys(configurations[head])
    const headValues = categoryValues.map(categoryValue => ({ [head]: categoryValue }))
    const mergeWithChildren = value =>
      produceCategoryKeysCombinations(tail).map(childValue => ({ ...value, ...childValue }))

    return tail.length > 0 ? headValues.flatMap(mergeWithChildren) : headValues
  }

  const categoryKeys = Object.keys(configurations).filter(filterNonDefault)
  return produceCategoryKeysCombinations(categoryKeys)
}

const selectCategories = passedCategories => {
  const configurations = configService.listConfigurations()
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

    if (!configurations.hasOwnProperty(categoryKey))
      throw new Error(`Key ${categoryKey} not found in variables`)
    if (!configurations[categoryKey].hasOwnProperty(categoryValue))
      throw new Error(`Key ${categoryValue} not found in ${categoryKey} variables`)
  })

  Object.keys(configurations)
    .filter(filterNonDefault)
    .forEach(categoryKey => {
      if (categories.hasOwnProperty(categoryKey)) return

      const categoryValues = Object.keys(configurations[categoryKey])
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

module.exports = {
  getAllCategoryKeysCombinations,
  selectCategories
}
