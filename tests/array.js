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
            var one = new types.NumericLiteral([Token.create('Numeric', 1)]);
            expect(() => helpers.createArray(one)).to.throw(Error);
        });

        it('should create array', () => {
            var one = new types.NumericLiteral([Token.create('Numeric', 1)]);
            var arr = helpers.createArray([one]);
            expect(arr.getSourceCode()).to.eql('[1]');
        });

        it('should create array with severals elements', () => {
            var one = new types.NumericLiteral([new Token('Numeric', 1)]);
            var two = new types.NumericLiteral([new Token('Numeric', 2)]);
            var arr = helpers.createArray([one, two]);
            expect(arr.getSourceCode()).to.eql('[1,2]');
        });

        it('should create array with severals elements and whitespace', () => {
            var one = new types.NumericLiteral([new Token('Numeric', 1)]);
            var two = new types.NumericLiteral([new Token('Numeric', 2)]);
            var arr = helpers.createArray([one, two], true);
            expect(arr.getSourceCode()).to.eql('[1, 2]');
        });

        it('should create array with severals elements of diff types', () => {
            var one = new types.NumericLiteral([new Token('Numeric', 1)]);
            var two = new types.StringLiteral([new Token('String', '"str"')]);
            var arr = helpers.createArray([one, two], true);
            expect(arr.getSourceCode()).to.eql('[1, "str"]');
            var arr2 = helpers.createArray([one.cloneElement(), two.cloneElement(), arr], true);
            expect(arr2.getSourceCode()).to.eql('[1, "str", [1, "str"]]');
        });

    });

    describe('remove', () => {
        it('should remove from array [x]', () => {
            var one = new types.NumericLiteral([Token.create('Numeric', 1)]);
            var arr = helpers.createArray([one]);
            helpers.removeElementFromArray(arr, one);
            expect(arr.getSourceCode()).to.eql('[]');
        });

        it('should remove from array [1, x, 3]', () => {
            var one = new types.NumericLiteral([new Token('Numeric', 1)]);
            var two = new types.NumericLiteral([new Token('Numeric', 2)]);
            var three = new types.StringLiteral([new Token('String', '"three"')]);
            var arr = helpers.createArray([one, two, three]);

            helpers.removeElementFromArray(arr, two);
            expect(arr.getSourceCode()).to.eql('[1,"three"]');

            var arr2 = helpers.createArray([one.cloneElement(), (two = two.cloneElement()), three.cloneElement()], true);

            helpers.removeElementFromArray(arr2, two);
            expect(arr2.getSourceCode()).to.eql('[1, "three"]');
        });

        it('should remove from array [1, x]', () => {
            var one = new types.NumericLiteral([new Token('Numeric', 1)]);
            var two = new types.NumericLiteral([new Token('Numeric', 2)]);
            var arr = helpers.createArray([one, two]);

            helpers.removeElementFromArray(arr, two);
            expect(arr.getSourceCode()).to.eql('[1]');

            var arr2 = helpers.createArray([one.cloneElement(), (two = two.cloneElement())], true);

            helpers.removeElementFromArray(arr2, two);
            expect(arr2.getSourceCode()).to.eql('[1]');
        });

        it('should remove from array [x, 1, 2]', () => {
            var one = new types.NumericLiteral([new Token('Numeric', 1)]);
            var two = new types.NumericLiteral([new Token('Numeric', 2)]);
            var three = new types.StringLiteral([new Token('String', '"three"')]);
            var arr = helpers.createArray([one, two, three]);

            helpers.removeElementFromArray(arr, one);
            expect(arr.getSourceCode()).to.eql('[2,"three"]');

            var arr2 = helpers.createArray([(one = one.cloneElement()), two.cloneElement(), three.cloneElement()], true);

            helpers.removeElementFromArray(arr2, one);
            expect(arr2.getSourceCode()).to.eql('[2, "three"]');
        });

        it('should remove from array [x, 1]', () => {
            var one = new types.NumericLiteral([new Token('Numeric', 1)]);
            var two = new types.NumericLiteral([new Token('Numeric', 2)]);
            var arr = helpers.createArray([one, two]);

            helpers.removeElementFromArray(arr, one);
            expect(arr.getSourceCode()).to.eql('[2]');

            var arr2 = helpers.createArray([(one = one.cloneElement()), two.cloneElement()], true);

            helpers.removeElementFromArray(arr2, one);
            expect(arr2.getSourceCode()).to.eql('[2]');
        });

    });

});
