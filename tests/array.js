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

        it('should remove from array [1, x, 3]', () => {
            var arr = this.createArr();
            helpers.removeElementFromArray(arr, arr.elements[1]);
            expect(arr.getSourceCode()).to.eql('[1, 3]');

            arr = this.createArr({spacesInsideArrayBrackets: true});
            helpers.removeElementFromArray(arr, arr.elements[1]);
            expect(arr.getSourceCode()).to.eql('[ 1, 3 ]');

            arr = this.createArr({newlineAfterArrayElements: true});
            helpers.removeElementFromArray(arr, arr.elements[1]);
            expect(arr.getSourceCode()).to.eql('[1,\n3]');

            arr = this.createArr({paddingNewLinesInArray: true});
            helpers.removeElementFromArray(arr, arr.elements[1]);
            expect(arr.getSourceCode()).to.eql('[\n1, 3\n]');

            arr = this.createArr({multiLine: true});
            helpers.removeElementFromArray(arr, arr.elements[1]);
            expect(arr.getSourceCode()).to.eql('[\n1,\n3\n]');
        });

        it('should remove from array [x, 2, 3]', () => {
            var arr = this.createArr();
            helpers.removeElementFromArray(arr, arr.elements[0]);
            expect(arr.getSourceCode()).to.eql('[2, 3]');

            arr = this.createArr({spacesInsideArrayBrackets: true});
            helpers.removeElementFromArray(arr, arr.elements[0]);
            expect(arr.getSourceCode()).to.eql('[ 2, 3 ]');

            arr = this.createArr({newlineAfterArrayElements: true});
            helpers.removeElementFromArray(arr, arr.elements[0]);
            expect(arr.getSourceCode()).to.eql('[2,\n3]');

            arr = this.createArr({paddingNewLinesInArray: true});
            helpers.removeElementFromArray(arr, arr.elements[0]);
            expect(arr.getSourceCode()).to.eql('[\n2, 3\n]');

            arr = this.createArr({multiLine: true});
            helpers.removeElementFromArray(arr, arr.elements[0]);
            expect(arr.getSourceCode()).to.eql('[\n2,\n3\n]');
        });

        it('should remove from array [1, 2, x]', () => {
            var arr = this.createArr();
            helpers.removeElementFromArray(arr, arr.elements[2]);
            expect(arr.getSourceCode()).to.eql('[1, 2]');

            arr = this.createArr({spacesInsideArrayBrackets: true});
            helpers.removeElementFromArray(arr, arr.elements[2]);
            expect(arr.getSourceCode()).to.eql('[ 1, 2 ]');

            arr = this.createArr({newlineAfterArrayElements: true});
            helpers.removeElementFromArray(arr, arr.elements[2]);
            expect(arr.getSourceCode()).to.eql('[1,\n2]');

            arr = this.createArr({paddingNewLinesInArray: true});
            helpers.removeElementFromArray(arr, arr.elements[2]);
            expect(arr.getSourceCode()).to.eql('[\n1, 2\n]');

            arr = this.createArr({multiLine: true});
            helpers.removeElementFromArray(arr, arr.elements[2]);
            expect(arr.getSourceCode()).to.eql('[\n1,\n2\n]');
        });

        it('should remove from array [1, x]', () => {
            var arr = this.createArr();
            helpers.removeElementFromArray(arr, arr.elements[2]);
            helpers.removeElementFromArray(arr, arr.elements[1]);
            expect(arr.getSourceCode()).to.eql('[1]');

            arr = this.createArr({spacesInsideArrayBrackets: true});
            helpers.removeElementFromArray(arr, arr.elements[2]);
            helpers.removeElementFromArray(arr, arr.elements[1]);
            expect(arr.getSourceCode()).to.eql('[ 1 ]');

            arr = this.createArr({newlineAfterArrayElements: true});
            helpers.removeElementFromArray(arr, arr.elements[2]);
            helpers.removeElementFromArray(arr, arr.elements[1]);
            expect(arr.getSourceCode()).to.eql('[1]');

            arr = this.createArr({paddingNewLinesInArray: true});
            helpers.removeElementFromArray(arr, arr.elements[2]);
            helpers.removeElementFromArray(arr, arr.elements[1]);
            expect(arr.getSourceCode()).to.eql('[\n1\n]');

            arr = this.createArr({multiLine: true});
            helpers.removeElementFromArray(arr, arr.elements[2]);
            helpers.removeElementFromArray(arr, arr.elements[1]);
            expect(arr.getSourceCode()).to.eql('[\n1\n]');
        });

        it('should remove from array [x, 2]', () => {
            var arr = this.createArr();
            helpers.removeElementFromArray(arr, arr.elements[2]);
            helpers.removeElementFromArray(arr, arr.elements[0]);
            expect(arr.getSourceCode()).to.eql('[2]');

            arr = this.createArr({spacesInsideArrayBrackets: true});
            helpers.removeElementFromArray(arr, arr.elements[2]);
            helpers.removeElementFromArray(arr, arr.elements[0]);
            expect(arr.getSourceCode()).to.eql('[ 2 ]');

            arr = this.createArr({newlineAfterArrayElements: true});
            helpers.removeElementFromArray(arr, arr.elements[2]);
            helpers.removeElementFromArray(arr, arr.elements[0]);
            expect(arr.getSourceCode()).to.eql('[2]');

            arr = this.createArr({paddingNewLinesInArray: true});
            helpers.removeElementFromArray(arr, arr.elements[2]);
            helpers.removeElementFromArray(arr, arr.elements[0]);
            expect(arr.getSourceCode()).to.eql('[\n2\n]');

            arr = this.createArr({multiLine: true});
            helpers.removeElementFromArray(arr, arr.elements[2]);
            helpers.removeElementFromArray(arr, arr.elements[0]);
            expect(arr.getSourceCode()).to.eql('[\n2\n]');
        });

        it('should remove from array [x]', () => {
            var arr = this.createArr();
            helpers.removeElementFromArray(arr, arr.elements[2]);
            helpers.removeElementFromArray(arr, arr.elements[1]);
            helpers.removeElementFromArray(arr, arr.elements[0]);
            expect(arr.getSourceCode()).to.eql('[]');

            arr = this.createArr({spacesInsideArrayBrackets: true});
            helpers.removeElementFromArray(arr, arr.elements[2]);
            helpers.removeElementFromArray(arr, arr.elements[1]);
            helpers.removeElementFromArray(arr, arr.elements[0]);
            expect(arr.getSourceCode()).to.eql('[]');

            arr = this.createArr({newlineAfterArrayElements: true});
            helpers.removeElementFromArray(arr, arr.elements[2]);
            helpers.removeElementFromArray(arr, arr.elements[1]);
            helpers.removeElementFromArray(arr, arr.elements[0]);
            expect(arr.getSourceCode()).to.eql('[]');

            arr = this.createArr({paddingNewLinesInArray: true});
            helpers.removeElementFromArray(arr, arr.elements[2]);
            helpers.removeElementFromArray(arr, arr.elements[1]);
            helpers.removeElementFromArray(arr, arr.elements[0]);
            expect(arr.getSourceCode()).to.eql('[]');

            arr = this.createArr({multiLine: true});
            helpers.removeElementFromArray(arr, arr.elements[2]);
            helpers.removeElementFromArray(arr, arr.elements[1]);
            helpers.removeElementFromArray(arr, arr.elements[0]);
            expect(arr.getSourceCode()).to.eql('[]');
        });

    });

});
