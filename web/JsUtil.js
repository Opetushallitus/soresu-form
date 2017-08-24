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
      return true
    })
    return results
  }

  static findFirst(objectOrArray, nodePredicate) {
    let found = false
    let object = null
    JsUtil.fastTraverse(objectOrArray, element => {
      if (found) {
        return false  // no need to search further
      } else {
        if (nodePredicate(element)) {
          found = true
          object = element
          return false
        }
        return true  // keep searching
      }
    })
    return object
  }

  static findIndexOfFirst(objectOrArray, nodePredicate) {
    let index = 0
    let found = false
    JsUtil.fastTraverse(objectOrArray, element => {
      if (found) {
        return false  // no need to search further
      } else {
        if (nodePredicate(element)) {
          found = true
          return false
        }
        index += 1
        return true  // keep searching
      }
    })
    return index
  }

  static findJsonNodeContainingId(objectOrArray, idToFind) {
    const allNodesContainingNode = _.filter(objectOrArray, function (parentNode) {
      return JsUtil.findFirst(parentNode, childNode => childNode.id === idToFind) !== null
    })
    if (allNodesContainingNode.length > 1) {
      throw new Error("Cannot handle case with " + allNodesContainingNode.length +
        " parents (" + JSON.stringify(allNodesContainingNode) + "), expected a single one. fieldId=" + idToFind)
    }
    return _.first(allNodesContainingNode)
  }

  static fastTraverse(x, func) {
    const shouldContinue = func(x)

    if (shouldContinue) {
      if (isObject(x)) {
        traverseObject(x)
      } else if (isArray(x)) {
        traverseArray(x)
      }
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
