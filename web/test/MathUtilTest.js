import { expect } from 'chai'
import MathUtil from '../form/MathUtil'

describe('Math utilities', function() {
  it('keeps precision when calculating decimal shares, rounding up', function() {
    expect(MathUtil.decimalShareRoundedUpOf(0.17, 10900)).to.eql(1853)
  })

  describe('Calculating ratio shares', function() {
    it('rounds up to nearest integer', function() {
      expect(MathUtil.ratioShareRoundedUpOf({nominator: 17, denominator: 100}, 6034)).to.eql(1026)
    })

    it('keeps precision when calculating ratio shares', function() {
      expect(MathUtil.ratioShareRoundedUpOf({nominator: 17, denominator: 100}, 10900)).to.eql(1853)
    })

    it('returns nominator when total is the same as the denominator', function() {
      expect(MathUtil.ratioShareRoundedUpOf({nominator: 21, denominator: 3400}, 3400)).to.eql(21)
    })
  })

  it('keeps precision when calculating percentage shares, rounding up', function() {
    expect(MathUtil.percentageShareRoundedUpOf(17, 10900)).to.eql(1853)
  })

  it('calculates percentage', function() {
    expect(MathUtil.percentageOf(1853, 10900)).to.eql(17)
  })

  describe('Rounding decimals', function() {
    it('rounds decimal with traditional rounding', function() {
      expect(MathUtil.roundDecimal(0.1,  1).toString()).to.equal('0.1')
      expect(MathUtil.roundDecimal(0.14, 1).toString()).to.equal('0.1')
      expect(MathUtil.roundDecimal(0.15, 1).toString()).to.equal('0.2')
      expect(MathUtil.roundDecimal(13.455, 2).toString()).to.equal('13.46')
    })

    it('rounds decimal with floor rounding', function() {
      expect(MathUtil.roundDecimal(0.1,  1, 'floor').toString()).to.equal('0.1')
      expect(MathUtil.roundDecimal(0.10, 1, 'floor').toString()).to.equal('0.1')
      expect(MathUtil.roundDecimal(0.19, 1, 'floor').toString()).to.equal('0.1')
      expect(MathUtil.roundDecimal(13.119, 2, 'floor').toString()).to.equal('13.11')
    })

    it('rounds decimal with ceil rounding', function() {
      expect(MathUtil.roundDecimal(0.1,  1, 'ceil').toString()).to.equal('0.1')
      expect(MathUtil.roundDecimal(0.10, 1, 'ceil').toString()).to.equal('0.1')
      expect(MathUtil.roundDecimal(0.11, 1, 'ceil').toString()).to.equal('0.2')
      expect(MathUtil.roundDecimal(13.111, 2, 'ceil').toString()).to.equal('13.12')
    })

    it('does not display digits after decimal point when result is integer', function() {
      expect(MathUtil.roundDecimal(0.04, 1).toString()).to.equal('0')
      expect(MathUtil.roundDecimal(1.04, 1).toString()).to.equal('1')
      expect(MathUtil.roundDecimal(0.09, 1, 'floor').toString()).to.equal('0')
      expect(MathUtil.roundDecimal(1.09, 1, 'floor').toString()).to.equal('1')
      expect(MathUtil.roundDecimal(-1.01, 1, 'ceil').toString()).to.equal('-1')
      expect(MathUtil.roundDecimal(0.91, 1, 'ceil').toString()).to.equal('1')
    })

    it('keeps precision', function() {
      expect(MathUtil.roundDecimal(1.005, 2).toString()).to.equal('1.01')
    })
  })

  it('determines if value is numeric', function() {
    expect(MathUtil.isNumeric(0)).to.be.true
    expect(MathUtil.isNumeric(101)).to.be.true
    expect(MathUtil.isNumeric(1.01)).to.be.true
    expect(MathUtil.isNumeric('0')).to.be.true
    expect(MathUtil.isNumeric('101')).to.be.true
    expect(MathUtil.isNumeric('1.01')).to.be.true
    expect(MathUtil.isNumeric('1,01')).to.be.true
    expect(MathUtil.isNumeric('')).to.be.false
    expect(MathUtil.isNumeric('a')).to.be.false
    expect(MathUtil.isNumeric(null)).to.be.false
    expect(MathUtil.isNumeric(false)).to.be.false
    expect(MathUtil.isNumeric(true)).to.be.false
  })

  it('parses decimal', function() {
    expect(MathUtil.parseDecimal(0)).to.equal(0)
    expect(MathUtil.parseDecimal(101)).to.equal(101)
    expect(MathUtil.parseDecimal(1.01)).to.equal(1.01)
    expect(MathUtil.parseDecimal('0')).to.equal(0)
    expect(MathUtil.parseDecimal('101')).to.equal(101)
    expect(MathUtil.parseDecimal('1.01')).to.equal(1.01)
    expect(MathUtil.parseDecimal('1,01')).to.equal(1.01)
    expect(MathUtil.parseDecimal('')).to.be.NaN
    expect(MathUtil.parseDecimal('a')).to.be.NaN
    expect(MathUtil.parseDecimal(null)).to.be.NaN
    expect(MathUtil.parseDecimal(false)).to.be.NaN
    expect(MathUtil.parseDecimal(true)).to.be.NaN
  })

  it('formats decimal', function() {
    expect(MathUtil.formatDecimal(1.01)).to.equal('1,01')
    expect(MathUtil.formatDecimal('1,01')).to.equal('1,01')
    expect(MathUtil.formatDecimal('1.01')).to.equal('1,01')
  })
})
