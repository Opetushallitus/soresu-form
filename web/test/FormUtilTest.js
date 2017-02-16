import { expect } from 'chai'
import _ from 'lodash'
import FormUtil from '../form/FormUtil'

describe('Form util', function() {
  describe('Deep-merging field trees', function() {
    it('merges two trees', function() {
      const a = {
        children: [
          {id: "1-a"},
          {
            id: "1-c",
            children: [
              {id: "2-a"}
            ]
          }
        ]
      }
      const b = {
        children: [
          {
            id: "1-c",
            children: [{id: "2-b"}]
          },
          {id: "1-b"}
        ]
      }
      const c = {
        children: [
          {id: "1-a"},
          {
            id: "1-c",
            children: [{id: "2-a"}, {id: "2-b"}]
          },
          {id: "1-b"}
        ]
      }
      expect(FormUtil.mergeDeepFieldTrees(a, b)).to.eql(c)
    })

    it('returns new copy', function() {
      const a = {children: [{id: "1-a"}]}
      const aCopy = _.cloneDeep(a)
      const b = {children: [{id: "1-b"}]}
      const bCopy = _.cloneDeep(b)
      const c = FormUtil.mergeDeepFieldTrees(a, b)
      expect(c).not.to.equal(a)
      expect(c).not.to.equal(b)
      expect(a).to.eql(aCopy)
      expect(b).to.eql(bCopy)
    })

    it('ignores empty source object', function() {
      const tree = {
        children: [
          {id: "1-a"},
          {
            id: "1-c",
            children: [
              {id: "2-a"}
            ]
          }
        ]
      }
      expect(FormUtil.mergeDeepFieldTrees(tree, {})).to.eql(tree)
    })

    it('merges three trees', function() {
      const a = {
        children: [
          {id: "1-a"},
          {
            id: "1-d",
            children: [
              {id: "2-a"},
              {id: "2-d"}
            ]
          }
        ]
      }
      const b = {
        children: [
          {
            id: "1-d",
            children: [
              {id: "2-b"},
              {
                id: "2-d",
                children: [{id: "3-b"}]
              }
            ]
          },
          {id: "1-b"}
        ]
      }
      const c = {
        children: [
          {id: "1-c"},
          {
            id: "1-d",
            children: [
              {
                id: "2-d",
                children: [{id: "3-c"}]
              },
              {id: "2-c"}
            ]
          }
        ]
      }
      const d = {
        children: [
          {id: "1-a"},
          {
            id: "1-d",
            children: [
              {id: "2-a"},
              {
                id: "2-d",
                children: [
                  {id: "3-b"},
                  {id: "3-c"}
                ]
              },
              {id: "2-b"},
              {id: "2-c"}
            ]
          },
          {id: "1-b"},
          {id: "1-c"}
        ]
      }
      expect(FormUtil.mergeDeepFieldTrees(a, b, c)).to.eql(d)
    })
  })
})
