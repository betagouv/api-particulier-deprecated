const _ = require('lodash')

const pickExtended = (object, paths) => {
  return paths.reduce((result, path) => {
    if (path.includes('[].')) {
      const [collectionPath, itemPath] = path.split(/\[]\.(.+)/)
      const collection = _.get(object, collectionPath)

      if (!_.isArray(collection)) {
        return result
      }

      const partialResult = {}
      _.set(
        partialResult,
        collectionPath,
        _.map(collection, item => pickExtended(item, [itemPath]))
      )

      return _.merge(result, partialResult)
    }

    return _.merge(result, _.pick(object, [path]))
  }, {})
}

module.exports = pickExtended
