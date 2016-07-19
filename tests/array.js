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
            expect(arr.getSourceCode()).to.eql('[1, 2]');
        });

        it('should create array with severals elements of diff types', () => {
            var one = new types.NumericLiteral([new Token('Numeric', 1)]);
            var two = new types.StringLiteral([new Token('String', '"str"')]);
            var arr = helpers.createArray([one, two]);
            // TODO: fix string
            // TODO: check Identifier
            expect(arr.getSourceCode()).to.eql('[1, "str"]');
            var arr2 = helpers.createArray([one.cloneElement(), two.cloneElement(), arr]);
            expect(arr2.getSourceCode()).to.eql('[1, "str", [1, "str"]]');
        });

        describe('opts', () => {
            beforeEach(() => {
                this.createArr = (opts) => {
                    var arr = [
                        new types.NumericLiteral([new Token('Numeric', 1)]),
                        new types.NumericLiteral([new Token('Numeric', 2)]),
                        new types.NumericLiteral([new Token('Numeric', 3)])
                    ];
                    return helpers.createArray(arr, opts);
                };
            });

            it('should work without opts', () => {
                var arr = this.createArr();
                expect(arr.getSourceCode()).to.eql('[1, 2, 3]');
                this.createArr({});
                expect(arr.getSourceCode()).to.eql('[1, 2, 3]');
            });

            it('spacesInsideArrayBrackets', () => {
                var arr = this.createArr({spacesInsideArrayBrackets: true});
                expect(arr.getSourceCode()).to.eql('[ 1, 2, 3 ]');
                arr = this.createArr({spacesInsideArrayBrackets: false});
                expect(arr.getSourceCode()).to.eql('[1, 2, 3]');
            });

            it('newlineAfterArrayElements', () => {
                var arr = this.createArr({newlineAfterArrayElements: true});
                expect(arr.getSourceCode()).to.eql('[1,\n2,\n3]');
                arr = this.createArr({newlineAfterArrayElements: false});
                expect(arr.getSourceCode()).to.eql('[1, 2, 3]');
            });

            it('paddingNewLinesInArray', () => {
                var arr = this.createArr({paddingNewLinesInArray: true});
                expect(arr.getSourceCode()).to.eql('[\n1, 2, 3\n]');
                arr = this.createArr({paddingNewLinesInArray: false});
                expect(arr.getSourceCode()).to.eql('[1, 2, 3]');
            });

            it('multiLine', () => {
                var arr = this.createArr({multiLine: true});
                expect(arr.getSourceCode()).to.eql('[\n1,\n2,\n3\n]');
                arr = this.createArr({multiLine: false});
                expect(arr.getSourceCode()).to.eql('[1, 2, 3]');
            });

        });

    });

    describe('remove', () => {
        it('should remove from array [x]', () => {
            var one = new types.NumericLiteral([Token.create('Numeric', 1)]);
            var arr = helpers.createArray([one]);
            helpers.removeElementFromArray(arr, one);
            expect(arr.getSourceCode()).to.eql('[]');

            arr = helpers.createArray([(one = one.cloneElement())], {multiLine: true});
            helpers.removeElementFromArray(arr, one);
            expect(arr.getSourceCode()).to.eql('[]');
        });

        it('should remove from array [1, x, 3]', () => {
            var one = new types.NumericLiteral([new Token('Numeric', 1)]);
            var two = new types.NumericLiteral([new Token('Numeric', 2)]);
            var three = new types.StringLiteral([new Token('String', '"three"')]);
            var arr = helpers.createArray([one, two, three]);

            helpers.removeElementFromArray(arr, two);
            // expect(arr.getSourceCode()).to.eql('[1,"three"]');

            var arr2 = helpers.createArray([one.cloneElement(), (two = two.cloneElement()), three.cloneElement()]);

            helpers.removeElementFromArray(arr2, two);
            expect(arr2.getSourceCode()).to.eql('[1, "three"]');
        });

        it('should remove from array [1, x]', () => {
            var one = new types.NumericLiteral([new Token('Numeric', 1)]);
            var two = new types.NumericLiteral([new Token('Numeric', 2)]);
            var arr = helpers.createArray([one, two]);

            helpers.removeElementFromArray(arr, two);
            expect(arr.getSourceCode()).to.eql('[1]');

            var arr2 = helpers.createArray([one.cloneElement(), (two = two.cloneElement())]);

            helpers.removeElementFromArray(arr2, two);
            expect(arr2.getSourceCode()).to.eql('[1]');
        });

        it('should remove from array [x, 1, 2]', () => {
            var one = new types.NumericLiteral([new Token('Numeric', 1)]);
            var two = new types.NumericLiteral([new Token('Numeric', 2)]);
            var three = new types.StringLiteral([new Token('String', '"three"')]);
            var arr = helpers.createArray([one, two, three]);

            helpers.removeElementFromArray(arr, one);
            // expect(arr.getSourceCode()).to.eql('[2,"three"]');

            var arr2 = helpers.createArray([(one = one.cloneElement()), two.cloneElement(), three.cloneElement()]);

            helpers.removeElementFromArray(arr2, one);
            expect(arr2.getSourceCode()).to.eql('[2, "three"]');
        });

        it('should remove from array [x, 1]', () => {
            var one = new types.NumericLiteral([new Token('Numeric', 1)]);
            var two = new types.NumericLiteral([new Token('Numeric', 2)]);
            var arr = helpers.createArray([one, two]);

            helpers.removeElementFromArray(arr, one);
            expect(arr.getSourceCode()).to.eql('[2]');

            var arr2 = helpers.createArray([(one = one.cloneElement()), two.cloneElement()]);

            helpers.removeElementFromArray(arr2, one);
            expect(arr2.getSourceCode()).to.eql('[2]');
        });

    });

});
