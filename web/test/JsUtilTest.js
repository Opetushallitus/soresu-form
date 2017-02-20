import { expect } from 'chai'
import _ from 'lodash'
import JsUtil from '../form/JSUtil'

describe('Js util', function() {
  it('collects objects matching a predicate', function() {
    const found = JsUtil.flatFilter(Tree, el => /id-\d+/.test(el.id))
    expect(found).to.eql([
      {id: 'id-1'},
      {id: 'id-2'},
      {id: 'id-3', token: Token},
      {id: 'id-4'}
    ])
  })

  it('finds index of first matching object', function() {
    const index = JsUtil.findIndexOfFirst(Tree, el => el.token === Token)
    expect(index).to.equal(TraversingStepsToToken - 1)
  })
})

const Token = 'find me'

const TraversingStepsToToken = 13

const Tree = {
  a1: {
    a2a: [
      {a3a: {id: 'id-1'}},
      {a3b: {id: 'id-2'}}
    ],
    a2b: {id: 'id-foo'}
  },
  b1: [
    {
      b2a: [
        {b3a: {id: 'id-3', token: Token}},
        {b3a: {id: 'id-4'}}
      ]
    }
  ]
}
