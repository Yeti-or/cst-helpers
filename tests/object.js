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

		it('should create object with severals elements', () => {
			var one = new types.NumericLiteral([new Token('Numeric', 1)]);
			var two = new types.NumericLiteral([new Token('Numeric', 2)]);
			var obj = helpers.createObject({'1': one, '2': two});

			expect(obj.getSourceCode()).to.eql('{1: 1, 2: 2}');
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
        });

    });

});
