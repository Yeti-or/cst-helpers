var chai = require('chai');
var expect = chai.expect;

var cst = require('cst');
var Token = cst.Token;
var types = cst.types;

var helpers = require('..');

describe('Array:', () => {

	describe('create', () => {
		it('should create empty array', () => {
			var arr = helpers.createArray([]);
			expect(arr.getSourceCode()).to.eql('[]');
		});

		it('should throw if we provide not array', () => {
			expect(() => helpers.createArray()).to.throw(Error);
			var one = new types.NumericLiteral([Token.create('Numeric', 1)])
			expect(() => helpers.createArray(one)).to.throw(Error);
		});

		it('should create array', () => {
			var one = new types.NumericLiteral([Token.create('Numeric', 1)])
			var arr = helpers.createArray([one]);
			expect(arr.getSourceCode()).to.eql('[1]');
		});

		it('should create array with severals elements', () => {
			var one = new types.NumericLiteral([new Token('Numeric', 1)])
			var two = new types.NumericLiteral([new Token('Numeric', 2)])
			var arr = helpers.createArray([one, two]);
			expect(arr.getSourceCode()).to.eql('[1,2]');
		});

		it('should create array with severals elements and whitespace', () => {
			var one = new types.NumericLiteral([new Token('Numeric', 1)])
			var two = new types.NumericLiteral([new Token('Numeric', 2)])
			var arr = helpers.createArray([one, two], true);
			expect(arr.getSourceCode()).to.eql('[1, 2]');
		});

		it('should create array with severals elements of diff types', () => {
			var one = new types.NumericLiteral([new Token('Numeric', 1)])
			var two = new types.StringLiteral([new Token('String', '"str"')])
			var arr = helpers.createArray([one, two], true);
			expect(arr.getSourceCode()).to.eql('[1, "str"]');
			var arr2 = helpers.createArray([one, two, arr], true);
			expect(arr2.getSourceCode()).to.eql('[1, "str", [1, "str"]]');
		});
	});


});
