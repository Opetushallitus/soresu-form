import { expect } from 'chai'
import _ from 'lodash'
import FormUtil from '../form/FormUtil'

describe('Form util', function() {
  it('returns first field matching id', function() {
    const tree = {
      children: [
        {
          id: "foo1",
          children: [
            {id: "foo2", content: "cont"}
          ]
        },
        {id: "foo3"}
      ]
    }
    expect(FormUtil.findField(tree, "foo2")).to.eql({id: "foo2", content: "cont"})
  })

  it('returns first field matching type', function() {
    const tree = {
      children: [
        {
          id: "foo1",
          children: [
            {id: "foo2", fieldType: "vaBudget"}
          ]
        },
        {id: "foo3"}
      ]
    }
    expect(FormUtil.findFieldByFieldType(tree, "vaBudget")).to.eql({id: "foo2", fieldType: "vaBudget"})
  })

  describe("Finding first matching field, ignoring id's index suffix", function() {
    it('returns object when ids match exactly', function() {
      const tree = {
        children: [
          {
            id: "foo1",
            children: [
              {id: "foo2", content: "cont"}
            ]
          },
          {id: "foo3"}
        ]
      }
      expect(FormUtil.findFieldIgnoringIndex(tree, "foo2")).to.eql({id: "foo2", content: "cont"})
    })

    it('returns object when ids match, sans index suffix', function() {
      const tree = {
        children: [
          {
            id: "foo1",
            children: [
              {id: "foo2-2", content: "cont"}
            ]
          },
          {id: "foo3"}
        ]
      }
      expect(FormUtil.findFieldIgnoringIndex(tree, "foo2")).to.eql({id: "foo2-2", content: "cont"})
    })
  })

  describe("Finding index of first matching field, ignoring id's index suffix", function() {
    it('returns object when ids match exactly', function() {
      const tree = {
        children: [
          {
            id: "foo1",
            children: [
              {id: "foo2", content: "cont"}
            ]
          },
          {id: "foo3"}
        ]
      }
      expect(FormUtil.findFieldIndex(tree, "foo2")).to.equal(4)
    })

    it('returns index when ids match, sans index suffix', function() {
      const tree = {
        children: [
          {
            id: "foo1",
            children: [
              {id: "foo2-2", content: "cont"}
            ]
          },
          {id: "foo3"}
        ]
      }
      expect(FormUtil.findFieldIndex(tree, "foo2")).to.equal(4)
    })
  })

  it('returns first field having child with matching id', function() {
    const tree = {
      children: [
        {
          id: "foo1",
          children: [
            {id: "foo21", content: "cont"},
            {id: "foo22", content: "cont"}
          ]
        }
      ]
    }
    expect(FormUtil.findFieldWithDirectChild(tree, "foo22")).to.eql({
      id: "foo1",
      children: [
        {id: "foo21", content: "cont"},
        {id: "foo22", content: "cont"}
      ]
    })
  })

  it('returns id without index', function() {
    expect(FormUtil.withOutIndex('foo.man-1.bar_zap-2')).to.equal('foo.man.bar_zap')
  })

  describe('Rounding decimals', function() {
    it('rounds decimal with traditional rounding', function() {
      expect(FormUtil.roundDecimal(0.1,  1).toString()).to.equal('0.1')
      expect(FormUtil.roundDecimal(0.14, 1).toString()).to.equal('0.1')
      expect(FormUtil.roundDecimal(0.15, 1).toString()).to.equal('0.2')
      expect(FormUtil.roundDecimal(13.455, 2).toString()).to.equal('13.46')
    })

    it('rounds decimal with floor rounding', function() {
      expect(FormUtil.roundDecimal(0.1,  1, 'floor').toString()).to.equal('0.1')
      expect(FormUtil.roundDecimal(0.10, 1, 'floor').toString()).to.equal('0.1')
      expect(FormUtil.roundDecimal(0.19, 1, 'floor').toString()).to.equal('0.1')
      expect(FormUtil.roundDecimal(13.119, 2, 'floor').toString()).to.equal('13.11')
    })

    it('rounds decimal with ceil rounding', function() {
      expect(FormUtil.roundDecimal(0.1,  1, 'ceil').toString()).to.equal('0.1')
      expect(FormUtil.roundDecimal(0.10, 1, 'ceil').toString()).to.equal('0.1')
      expect(FormUtil.roundDecimal(0.11, 1, 'ceil').toString()).to.equal('0.2')
      expect(FormUtil.roundDecimal(13.111, 2, 'ceil').toString()).to.equal('13.12')
    })

    it('does not display digits after decimal point when result is integer', function() {
      expect(FormUtil.roundDecimal(0.04, 1).toString()).to.equal('0')
      expect(FormUtil.roundDecimal(1.04, 1).toString()).to.equal('1')
      expect(FormUtil.roundDecimal(0.09, 1, 'floor').toString()).to.equal('0')
      expect(FormUtil.roundDecimal(1.09, 1, 'floor').toString()).to.equal('1')
      expect(FormUtil.roundDecimal(-1.01, 1, 'ceil').toString()).to.equal('-1')
      expect(FormUtil.roundDecimal(0.91, 1, 'ceil').toString()).to.equal('1')
    })

    it('keeps precision', function() {
      expect(FormUtil.roundDecimal(1.005, 2).toString()).to.equal('1.01')
    })
  })

  it('formats decimal', function() {
    expect(FormUtil.formatDecimal(1.01)).to.equal('1,01')
  })

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
