;(function e (t, n, r) {
  function s (o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var a = typeof require === 'function' && require
        if (!u && a) return a(o, !0)
        if (i) return i(o, !0)
        var f = new Error("Cannot find module '" + o + "'")
        throw ((f.code = 'MODULE_NOT_FOUND'), f)
      }
      var l = (n[o] = { exports: {} })
      t[o][0].call(
        l.exports,
        function (e) {
          var n = t[o][1][e]
          return s(n || e)
        },
        l,
        l.exports,
        e,
        t,
        n,
        r
      )
    }
    return n[o].exports
  }
  var i = typeof require === 'function' && require
  for (var o = 0; o < r.length; o++) s(r[o])
  return s
})(
  {
    1: [
      function (require, module, exports) {
        const seek = require('dom-seek')

        window.seek = seek
      },
      { 'dom-seek': 3 }
    ],
    2: [
      function (require, module, exports) {
        module.exports = parents

        function parents (node, filter) {
          var out = []

          filter = filter || noop

          do {
            out.push(node)
            node = node.parentNode
          } while (node && node.tagName && filter(node))

          return out.slice(1)
        }

        function noop (n) {
          return true
        }
      },
      {}
    ],
    3: [
      function (require, module, exports) {
        module.exports = require('./lib')['default']
      },
      { './lib': 4 }
    ],
    4: [
      function (require, module, exports) {
        'use strict'

        exports.__esModule = true
        exports['default'] = seek

        var _ancestors = require('ancestors')

        var _ancestors2 = _interopRequireDefault(_ancestors)

        var _indexOf = require('index-of')

        var _indexOf2 = _interopRequireDefault(_indexOf)

        function _interopRequireDefault (obj) {
          return obj && obj.__esModule ? obj : { default: obj }
        }

        var E_SHOW = 'Argument 1 of seek must use filter NodeFilter.SHOW_TEXT.'
        var E_WHERE = 'Argument 2 of seek must be a number or a Text Node.'

        var SHOW_TEXT = 4
        var TEXT_NODE = 3

        function seek (iter, where) {
          if (iter.whatToShow !== SHOW_TEXT) {
            throw new Error(E_SHOW)
          }

          var count = 0
          var node = iter.referenceNode
          var predicates = null

          if (isNumber(where)) {
            predicates = {
              forward: function forward () {
                return count < where
              },
              backward: function backward () {
                return count > where
              }
            }
          } else if (isText(where)) {
            var forward = before(node, where)
              ? function () {
                return false
              }
              : function () {
                return node !== where
              }
            var backward = function backward () {
              return node != where || !iter.pointerBeforeReferenceNode
            }
            predicates = { forward: forward, backward: backward }
          } else {
            throw new Error(E_WHERE)
          }

          while (predicates.forward() && (node = iter.nextNode()) !== null) {
            count += node.nodeValue.length
          }

          while (
            predicates.backward() &&
            (node = iter.previousNode()) !== null
          ) {
            count -= node.nodeValue.length
          }

          return count
        }

        function isNumber (n) {
          return !isNaN(parseInt(n)) && isFinite(n)
        }

        function isText (node) {
          return node.nodeType === TEXT_NODE
        }

        function before (ref, node) {
          if (ref === node) return false

          var common = null
          var left = [ref].concat((0, _ancestors2['default'])(ref)).reverse()
          var right = [node].concat((0, _ancestors2['default'])(node)).reverse()

          while (left[0] === right[0]) {
            common = left.shift()
            right.shift()
          }

          left = left[0]
          right = right[0]

          var l = (0, _indexOf2['default'])(common.childNodes, left)
          var r = (0, _indexOf2['default'])(common.childNodes, right)

          return l > r
        }
      },
      { ancestors: 2, 'index-of': 5 }
    ],
    5: [
      function (require, module, exports) {
        /*!
 * index-of <https://github.com/jonschlinkert/index-of>
 *
 * Copyright (c) 2014-2015 Jon Schlinkert.
 * Licensed under the MIT license.
 */

        'use strict'

        module.exports = function indexOf (arr, ele, start) {
          start = start || 0
          var idx = -1

          if (arr == null) return idx
          var len = arr.length
          var i = start < 0 ? len + start : start

          if (i >= arr.length) {
            return -1
          }

          while (i < len) {
            if (arr[i] === ele) {
              return i
            }
            i++
          }

          return -1
        }
      },
      {}
    ]
  },
  {},
  [1]
)
