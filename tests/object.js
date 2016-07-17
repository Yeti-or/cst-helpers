var chai = require('chai');
var expect = chai.expect;

var cst = require('cst');
var Token = cst.Token;
var types = cst.types;

var helpers = require('..');

describe('Object:', () => {

    describe('create', () => {
		it('should create empty object', () => {
			var obj = helpers.createObject({});
			expect(obj.getSourceCode()).to.eql('{}');
		});

		it('should throw if we provide not object', () => {
			expect(() => helpers.createObject()).to.throw(Error);
			var one = new types.NumericLiteral([Token.create('Numeric', 1)]);
			expect(() => helpers.createObject(one)).to.throw(Error);
		});

		it('should create object', () => {
			var one = new types.NumericLiteral([Token.create('Numeric', 1)]);
			var obj = helpers.createObject({1: one});

			expect(obj.getSourceCode()).to.eql('{1: 1}');

			obj = helpers.createObject({'one': one.cloneElement()});
			expect(obj.getSourceCode()).to.eql('{one: 1}');
		});

        it('should create object with numreric as value', () => {
			var one = new types.NumericLiteral([new Token('Numeric', 1)]);
			var two = new types.NumericLiteral([new Token('Numeric', 2)]);
			var obj = helpers.createObject({1: one, 2: two});

			expect(obj.getSourceCode()).to.eql('{1: 1, 2: 2}');
        });

        it('should create object with String as value', () => {
			var one = new types.StringLiteral([new Token('String', 'one')]);
			var two = new types.StringLiteral([new Token('String', 'two')]);
			var obj = helpers.createObject({1: one, 2: two});

			expect(obj.getSourceCode()).to.eql('{1: \'one\', 2: \'two\'}');
        });

        it('should create object with identifier as value', () => {
			var one = new types.Identifier([new Token('Identifier', 'x')]);
			var two = new types.Identifier([new Token('Identifier', 'y')]);
			var obj = helpers.createObject({1: one, 2: two});

			expect(obj.getSourceCode()).to.eql('{1: x, 2: y}');
        });

        // TODO: Order
		xit('should create object with diff elements', () => {
            var one = new types.NumericLiteral([new Token('Numeric', 1)]);
			var two = new types.Identifier([new Token('Identifier', 'x')]);
            var three = new types.StringLiteral([new Token('String', '@@@')]);
            var four = new types.BooleanLiteral([new Token('Boolean', false)]);
            // var five = new types.StringLiteral([new Token('String', "doublequote")]);

            var obj = helpers.createObject({1: one, 2: two, 'three': three, '4': four});

			expect(obj.getSourceCode())
                .to.eql('{1: 1, 2: x, three: \'@@@\', 4: false}');
		});

        describe('opts', () => {
            it('should work without opts', () => {
                var one = new types.NumericLiteral([new Token('Numeric', 1)]);
                var two = new types.NumericLiteral([new Token('Numeric', 2)]);
                var obj = helpers.createObject({'1': one, '2': two});

                expect(obj.getSourceCode()).to.eql('{1: 1, 2: 2}');
            });

            it('spaceBeforeObjectValues', () => {
                var one = new types.NumericLiteral([new Token('Numeric', 1)]);
                var two = new types.NumericLiteral([new Token('Numeric', 2)]);
                var obj = helpers.createObject({'1': one, '2': two});

                expect(obj.getSourceCode()).to.eql('{1: 1, 2: 2}');

                obj = helpers.createObject({'1': one.cloneElement(), '2': two.cloneElement()}, {});
                expect(obj.getSourceCode()).to.eql('{1: 1, 2: 2}');
                obj = helpers.createObject({'1': one.cloneElement(), '2': two.cloneElement()}, {spaceBeforeObjectValues: true});
                expect(obj.getSourceCode()).to.eql('{1: 1, 2: 2}');
                obj = helpers.createObject({'1': one.cloneElement(), '2': two.cloneElement()}, {spaceBeforeObjectValues: false});
                expect(obj.getSourceCode()).to.eql('{1:1, 2:2}');
            });

            it('spaceAfterObjectKeys', () => {
                var one = new types.NumericLiteral([new Token('Numeric', 1)]);
                var two = new types.NumericLiteral([new Token('Numeric', 2)]);
                var obj = helpers.createObject({'1': one, '2': two});

                expect(obj.getSourceCode()).to.eql('{1: 1, 2: 2}');
                obj = helpers.createObject({'1': one.cloneElement(), '2': two.cloneElement()}, {spaceAfterObjectKeys: true});
                expect(obj.getSourceCode()).to.eql('{1 : 1, 2 : 2}');
                obj = helpers.createObject({'1': one.cloneElement(), '2': two.cloneElement()}, {spaceAfterObjectKeys: false});
                expect(obj.getSourceCode()).to.eql('{1: 1, 2: 2}');
            });

            it('spacesInsideObjectBrackets', () => {
                var one = new types.NumericLiteral([new Token('Numeric', 1)]);
                var two = new types.NumericLiteral([new Token('Numeric', 2)]);
                var obj = helpers.createObject({'1': one, '2': two});

                expect(obj.getSourceCode()).to.eql('{1: 1, 2: 2}');
                obj = helpers.createObject({'1': one.cloneElement(), '2': two.cloneElement()}, {spacesInsideObjectBrackets: true});
                expect(obj.getSourceCode()).to.eql('{ 1: 1, 2: 2 }');
                obj = helpers.createObject({'1': one.cloneElement(), '2': two.cloneElement()}, {spacesInsideObjectBrackets: false});
                expect(obj.getSourceCode()).to.eql('{1: 1, 2: 2}');
            });

            it('paddingNewLinesInObjects', () => {
                var one = new types.NumericLiteral([new Token('Numeric', 1)]);
                var two = new types.NumericLiteral([new Token('Numeric', 2)]);
                var obj = helpers.createObject({'1': one, '2': two});

                expect(obj.getSourceCode()).to.eql('{1: 1, 2: 2}');
                obj = helpers.createObject({'1': one.cloneElement(), '2': two.cloneElement()}, {paddingNewLinesInObjects: true});
                expect(obj.getSourceCode()).to.eql('{\n1: 1, 2: 2\n}');
                obj = helpers.createObject({'1': one.cloneElement(), '2': two.cloneElement()}, {paddingNewLinesInObjects: false});
                expect(obj.getSourceCode()).to.eql('{1: 1, 2: 2}');
            });

            it('objectKeysOnNewLine', () => {
                var one = new types.NumericLiteral([new Token('Numeric', 1)]);
                var two = new types.NumericLiteral([new Token('Numeric', 2)]);
                var obj = helpers.createObject({'1': one, '2': two});

                expect(obj.getSourceCode()).to.eql('{1: 1, 2: 2}');
                obj = helpers.createObject({'1': one.cloneElement(), '2': two.cloneElement()}, {objectKeysOnNewLine: true});
                expect(obj.getSourceCode()).to.eql('{1: 1,\n2: 2}');
                obj = helpers.createObject({'1': one.cloneElement(), '2': two.cloneElement()}, {objectKeysOnNewLine: false});
                expect(obj.getSourceCode()).to.eql('{1: 1, 2: 2}');
            });

            it('multiLine', () => {
                var one = new types.NumericLiteral([new Token('Numeric', 1)]);
                var two = new types.NumericLiteral([new Token('Numeric', 2)]);
                var obj = helpers.createObject({'1': one, '2': two});

                expect(obj.getSourceCode()).to.eql('{1: 1, 2: 2}');
                obj = helpers.createObject({'1': one.cloneElement(), '2': two.cloneElement()}, {multiLine: true});
                expect(obj.getSourceCode()).to.eql('{\n1: 1,\n2: 2\n}');
                obj = helpers.createObject({'1': one.cloneElement(), '2': two.cloneElement()}, {multiLine: false});
                expect(obj.getSourceCode()).to.eql('{1: 1, 2: 2}');
            });

            it('quotes', () => {
                var one = new types.StringLiteral([new Token('String', 'one')]);
                var two = new types.StringLiteral([new Token('String', 'two')]);
                var obj = helpers.createObject({1: one, 2: two});

                expect(obj.getSourceCode()).to.eql('{1: \'one\', 2: \'two\'}', 'default');

                obj = helpers.createObject({1: one.cloneElement(), 2: two.cloneElement()}, {singleQuotes: true});
                expect(obj.getSourceCode()).to.eql('{1: \'one\', 2: \'two\'}', 'singleQuote');

                obj = helpers.createObject({1: one.cloneElement(), 2: two.cloneElement()}, {singleQuotes: false});
                expect(obj.getSourceCode()).to.eql('{1: "one", 2: "two"}', 'doubleQuote');
            });

            it('quotedKeysInObjects', () => {
                var one = new types.StringLiteral([new Token('String', 'one')]);
                var two = new types.StringLiteral([new Token('String', 'two')]);
                var obj = helpers.createObject({one: one, two: two});

                expect(obj.getSourceCode()).to.eql('{one: \'one\', two: \'two\'}', 'default');

                obj = helpers.createObject({one: one.cloneElement(), two: two.cloneElement()}, {quotedKeysInObjects: true, singleQuotes: true});
                expect(obj.getSourceCode()).to.eql('{\'one\': \'one\', \'two\': \'two\'}', 'singleQuote');

                obj = helpers.createObject({one: one.cloneElement(), two: two.cloneElement()}, {quotedKeysInObjects: true, singleQuotes: false});
                expect(obj.getSourceCode()).to.eql('{"one": "one", "two": "two"}', 'doubleQuote');

                obj = helpers.createObject({one: one.cloneElement(), two: two.cloneElement()}, {quotedKeysInObjects: false});
                expect(obj.getSourceCode()).to.eql('{one: \'one\', two: \'two\'}', 'don\'t quote');
            });

        });

    });

    xdescribe('get', () => {
        beforeEach(() => {
            var one = new types.NumericLiteral([new Token('Numeric', 1)]);
			var two = new types.Identifier([new Token('Identifier', 'x')]);
            var three = new types.StringLiteral([new Token('String', '@')]);
            var four = new types.BooleanLiteral([new Token('Boolean', false)]);
            this.obj = helpers.createObject({1: one, 2: two, 'three': three, '4': four});
        });
        afterEach(() => {
            this.obj = null;
        });
        describe('keys', () => {
            it('should get all keys from object', () => {
                var keys = helpers.getKeysFromObject(this.obj);
                // TODO: order ?
                expect(keys.map(k => k.value)).to.eql(['1', '2', 'three', '4']);
            });
            it('should get empty arr of keys from empty obj', () => {
                var obj = helpers.createObject({});
                expect(helpers.getKeysFromObject(obj)).to.eql([]);
            });
        });
        describe('values', () => {
            it('should get all values from object', () => {
                var keys = helpers.getValuesFromObject(this.obj);
                expect(keys.map(k => k.value ? k.value : k.name)).to.eql([1, '@']);
            });
            it('should get empty arr of keys from empty obj', () => {
                var obj = helpers.createObject({});
                expect(helpers.getValuesFromObject(obj)).to.eql([]);
            });
        });
    });

    describe('remove', () => {
        it('should remove from object {x:x}', () => {
			var one = new types.NumericLiteral([Token.create('Numeric', 1)]);
			var obj = helpers.createObject({1: one});
            var prop = helpers.getPropFromObjectByKeyName(obj, 1);
            helpers.removeElementFromObject(obj, prop);
			expect(obj.getSourceCode()).to.eql('{}');
        });

   });

});
