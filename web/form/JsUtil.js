import _ from 'lodash'

export default class JsUtil {
  static flatFilter(objectOrArray, nodePredicate) {
    return JsUtil.traverseMatching(objectOrArray, nodePredicate, _.identity)
  }

  static traverseMatching(objectOrArray, nodePredicate, operation) {
    const results = []
    JsUtil.fastTraverse(objectOrArray, element => {
      if (nodePredicate(element)) {
        results.push(operation(element))
      }
    })
    return results
  }

  static findIndexOfFirst(objectOrArray, nodePredicate) {
    const result = {found: false, index: 0}
    JsUtil.fastTraverse(objectOrArray, element => {
      if (!result.found) {
        if (nodePredicate(element)) {
          result.found = true
        } else {
          result.index++
        }
      }
    })
    return result.index
  }

  static findJsonNodeContainingId(objectOrArray, idToFind) {
    const allNodesContainingNode = _.filter(objectOrArray, function (parentNode) {
      return !_.isEmpty(JsUtil.flatFilter(parentNode, childNode => { return childNode.id === idToFind }))
    })
    if (allNodesContainingNode.length > 1) {
      throw new Error("Cannot handle case with " + allNodesContainingNode.length +
        " parents (" + JSON.stringify(allNodesContainingNode) + "), expected a single one. fieldId=" + idToFind)
    }
    return _.first(allNodesContainingNode)
  }

  static fastTraverse(x, func) {
    func(x)
    if (isObject(x)) {
      traverseObject(x)
    } else if (isArray(x)) {
      traverseArray(x)
    }

    function traverseObject(o) {
      for (var i in o) {
        const element = o[i]
        if (element !== null && (isObject(element) || isArray(element))) {
          JsUtil.fastTraverse(element, func)
        }
      }
    }
    function traverseArray(arr) {
      for (var i = 0; i < arr.length; i++) {
        JsUtil.fastTraverse(arr[i])
      }
    }

    function isObject(element) {
      return typeof(element) === "object"
    }
    function isArray(element) {
      return typeof(element) === "array"
    }
  }

  static naturalCompare(a, b) {
    if (!_.isString(a) || !_.isString(b)) {
      console.log('Warning: do not know how to do natural comparison of "' + a + '" and "' + b + '", returning 0')
      return 0
    }
    const ax = [], bx = []

    a.replace(/(\d+)|(\D+)/g, function(_, $1, $2) { ax.push([$1 || Infinity, $2 || ""]) })
    b.replace(/(\d+)|(\D+)/g, function(_, $1, $2) { bx.push([$1 || Infinity, $2 || ""]) })

    while(ax.length && bx.length) {
      var an = ax.shift()
      var bn = bx.shift()
      var nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1])
      if(nn) {
        return nn
      }
    }

    return ax.length - bx.length
  }
}
