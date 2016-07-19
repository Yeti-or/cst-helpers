var chai = require('chai');
var expect = chai.expect;

var cst = require('cst');
var Token = cst.Token;
var types = cst.types;

var helpers = require('..');

// TODO: move to util?
var toMap = function(obj) {
    var map = new Map();
    Object.keys(obj).forEach(key => map.set(key, obj[key]));
    return map;
};

describe('Object:', () => {

    describe('create', () => {
        it('should create empty object', () => {
            var obj = helpers.createObject(new Map());
            expect(obj.getSourceCode()).to.eql('{}');
        });

        it('should throw if we provide not object', () => {
            expect(() => helpers.createObject()).to.throw(Error);
            var one = new types.NumericLiteral([Token.create('Numeric', 1)]);
            expect(() => helpers.createObject(one)).to.throw(Error);
        });

        it('should create simple object object', () => {
            var one = new types.NumericLiteral([Token.create('Numeric', 1)]);
            var map = new Map();
            map.set(1, one);
            var obj = helpers.createObject(map);

            expect(obj.getSourceCode()).to.eql('{1: 1}');
        });

        it('should create object with numreric as value', () => {
            var one = new types.NumericLiteral([new Token('Numeric', 1)]);
            var two = new types.NumericLiteral([new Token('Numeric', 2)]);
            var map = new Map();
            map.set(1, one);
            map.set(2, two);
            var obj = helpers.createObject(map);

            expect(obj.getSourceCode()).to.eql('{1: 1, 2: 2}');
        });

        it('should create object with String as value', () => {
            var one = new types.StringLiteral([new Token('String', 'one')]);
            var two = new types.StringLiteral([new Token('String', 'two')]);
            var map = new Map();
            map.set(1, one);
            map.set(2, two);
            var obj = helpers.createObject(map);

            expect(obj.getSourceCode()).to.eql('{1: \'one\', 2: \'two\'}');
        });

        it('should create object with identifier as value', () => {
            var one = new types.Identifier([new Token('Identifier', 'x')]);
            var two = new types.Identifier([new Token('Identifier', 'y')]);
            var map = new Map();
            map.set(1, one);
            map.set(2, two);
            var obj = helpers.createObject(map);

            expect(obj.getSourceCode()).to.eql('{1: x, 2: y}');
        });

        it('should create object with diff elements', () => {
            var one = new types.NumericLiteral([new Token('Numeric', 1)]);
            var two = new types.Identifier([new Token('Identifier', 'x')]);
            var three = new types.StringLiteral([new Token('String', '@@@')]);
            var four = new types.BooleanLiteral([new Token('Boolean', false)]);
            // var five = new types.StringLiteral([new Token('String', "doublequote")]);

            var map = new Map();
            map.set(1, one);
            map.set(2, two);
            map.set('three', three);
            map.set(4, four);
            var obj = helpers.createObject(map);

            expect(obj.getSourceCode())
                .to.eql('{1: 1, 2: x, three: \'@@@\', 4: false}');
        });

        describe('opts', () => {
            beforeEach(() => {
                this.createObj = (opts) => {
                    var one = new types.NumericLiteral([new Token('Numeric', 1)]);
                    var two = new types.NumericLiteral([new Token('Numeric', 2)]);
                    var map = new Map();
                    map.set(1, one);
                    map.set(2, two);
                    return helpers.createObject(map, opts);
                };
            });

            it('should work without opts', () => {
                var obj = this.createObj();
                expect(obj.getSourceCode()).to.eql('{1: 1, 2: 2}');
                obj = this.createObj({});
                expect(obj.getSourceCode()).to.eql('{1: 1, 2: 2}');
            });

            it('spaceBeforeObjectValues', () => {
                var obj = this.createObj({spaceBeforeObjectValues: true});
                expect(obj.getSourceCode()).to.eql('{1: 1, 2: 2}');
                obj = this.createObj({spaceBeforeObjectValues: false});
                expect(obj.getSourceCode()).to.eql('{1:1, 2:2}');
            });

            it('spaceAfterObjectKeys', () => {
                var obj = this.createObj({spaceAfterObjectKeys: true});
                expect(obj.getSourceCode()).to.eql('{1 : 1, 2 : 2}');
                obj = this.createObj({spaceAfterObjectKeys: false});
                expect(obj.getSourceCode()).to.eql('{1: 1, 2: 2}');
            });

            it('spacesInsideObjectBrackets', () => {
                var obj = this.createObj({spacesInsideObjectBrackets: true});
                expect(obj.getSourceCode()).to.eql('{ 1: 1, 2: 2 }');
                obj = this.createObj({spacesInsideObjectBrackets: false});
                expect(obj.getSourceCode()).to.eql('{1: 1, 2: 2}');
            });

            it('paddingNewLinesInObjects', () => {
                var obj = this.createObj({paddingNewLinesInObjects: true});
                expect(obj.getSourceCode()).to.eql('{\n1: 1, 2: 2\n}');
                obj = this.createObj({paddingNewLinesInObjects: false});
                expect(obj.getSourceCode()).to.eql('{1: 1, 2: 2}');
            });

            it('objectKeysOnNewLine', () => {
                var obj = this.createObj({objectKeysOnNewLine: true});
                expect(obj.getSourceCode()).to.eql('{1: 1,\n2: 2}');
                obj = this.createObj({objectKeysOnNewLine: false});
                expect(obj.getSourceCode()).to.eql('{1: 1, 2: 2}');
            });

            it('multiLine', () => {
                var obj = this.createObj({multiLine: true});
                expect(obj.getSourceCode()).to.eql('{\n1: 1,\n2: 2\n}');
                obj = this.createObj({multiLine: false});
                expect(obj.getSourceCode()).to.eql('{1: 1, 2: 2}');
            });

            it('quotes', () => {
                var one = new types.StringLiteral([new Token('String', 'one')]);
                var two = new types.StringLiteral([new Token('String', 'two')]);
                var obj = helpers.createObject(toMap({1: one, 2: two}));

                expect(obj.getSourceCode()).to.eql('{1: \'one\', 2: \'two\'}', 'default');

                obj = helpers.createObject(toMap({1: one.cloneElement(), 2: two.cloneElement()}), {singleQuotes: true});
                expect(obj.getSourceCode()).to.eql('{1: \'one\', 2: \'two\'}', 'singleQuote');

                obj = helpers.createObject(toMap({1: one.cloneElement(), 2: two.cloneElement()}), {singleQuotes: false});
                expect(obj.getSourceCode()).to.eql('{1: "one", 2: "two"}', 'doubleQuote');
            });

            it('quotedKeysInObjects', () => {
                var one = new types.StringLiteral([new Token('String', 'one')]);
                var two = new types.StringLiteral([new Token('String', 'two')]);
                var obj = helpers.createObject(toMap({one: one, two: two}));

                expect(obj.getSourceCode()).to.eql('{one: \'one\', two: \'two\'}', 'default');

                obj = helpers.createObject(toMap({one: one.cloneElement(), two: two.cloneElement()}), {quotedKeysInObjects: true, singleQuotes: true});
                expect(obj.getSourceCode()).to.eql('{\'one\': \'one\', \'two\': \'two\'}', 'singleQuote');

                obj = helpers.createObject(toMap({one: one.cloneElement(), two: two.cloneElement()}), {quotedKeysInObjects: true, singleQuotes: false});
                expect(obj.getSourceCode()).to.eql('{"one": "one", "two": "two"}', 'doubleQuote');

                obj = helpers.createObject(toMap({one: one.cloneElement(), two: two.cloneElement()}), {quotedKeysInObjects: false});
                expect(obj.getSourceCode()).to.eql('{one: \'one\', two: \'two\'}', 'don\'t quote');
            });

        });

    });

    describe('get', () => {
        beforeEach(() => {
            this.createObj = (opts) => {
                var map = new Map();
                map.set(1, new types.NumericLiteral([new Token('Numeric', 1)]));
                map.set(2, new types.Identifier([new Token('Identifier', 'x')]));
                map.set('three', new types.StringLiteral([new Token('String', '@')]));
                map.set('4', new types.BooleanLiteral([new Token('Boolean', false)]));
                return helpers.createObject(map, opts);
            };
        });

        describe('props', () => {
            it('should get prop by it\'s key name', () => {
                var obj = this.createObj();
                var prop = helpers.getPropFromObjectByKeyName(obj, 1);
                expect(prop.getSourceCode()).to.eql('1: 1');

                prop = helpers.getPropFromObjectByKeyName(obj, 2);
                expect(prop.getSourceCode()).to.eql('2: x');

                prop = helpers.getPropFromObjectByKeyName(obj, 'three');
                expect(prop.getSourceCode()).to.eql('three: \'@\'');

                prop = helpers.getPropFromObjectByKeyName(obj, 4);
                expect(prop.getSourceCode()).to.eql('4: false');
            });

            it('should get no prop from empty obj', () => {
                var obj = helpers.createObject(toMap({}));
                expect(helpers.getPropFromObjectByKeyName(obj, 1)).to.eql(null);
            });

            it('should get no prop for wrong key', () => {
                var obj = this.createObj();
                var prop = helpers.getPropFromObjectByKeyName(obj, 1);
                expect(prop.getSourceCode()).to.eql('1: 1');
                prop = helpers.getPropFromObjectByKeyName(obj, 42);
                expect(prop).to.eql(null);
            });
        });

        describe('keys', () => {
            it('should get all keys from object', () => {
                var obj = this.createObj();
                var keys = helpers.getKeysFromObject(obj);
                expect(keys).to.eql(['1', '2', 'three', '4']);
            });

            it('should get empty arr of keys from empty obj', () => {
                var obj = helpers.createObject(toMap({}));
                expect(helpers.getKeysFromObject(obj)).to.eql([]);
            });
        });

        describe('values', () => {
            it('should get all values from object', () => {
                var obj = this.createObj();
                var values = helpers.getValuesFromObject(obj);
                expect(values).to.eql([1, 'x', '@', false]);
            });

            it('should get empty arr of keys from empty obj', () => {
                var obj = helpers.createObject(toMap({}));
                expect(helpers.getValuesFromObject(obj)).to.eql([]);
            });
        });
    });

    describe('update', () => {
        beforeEach(() => {
            this.createObj = (opts) => {
                var map = new Map();
                map.set(1, new types.NumericLiteral([Token.create('Numeric', 1)]));
                map.set(2, new types.NumericLiteral([Token.create('Numeric', 2)]));
                map.set(3, new types.NumericLiteral([Token.create('Numeric', 3)]));
                return helpers.createObject(map, opts);
            };
        });

        it('should update prop.value for keyName', () => {
            // TODO : do we need such helper ?
            var obj = this.createObj();
            var prop =  helpers.getPropFromObjectByKeyName(obj, 2);
            prop.replaceChild(this.createObj(), prop.value);
            expect(obj.getSourceCode()).to.eql('{1: 1, 2: {1: 1, 2: 2, 3: 3}, 3: 3}');
        });

        it('update prop.keyName for keyName', () => {
            // TODO : do we need such helper ?
            var obj = this.createObj();
            var prop =  helpers.getPropFromObjectByKeyName(obj, 2);
            prop.replaceChild(new types.StringLiteral([new Token('String', '"two"')]), prop.key);
            expect(obj.getSourceCode()).to.eql('{1: 1, "two": 2, 3: 3}');
        });
    });

    describe('add prop', () => {
    });

    describe('remove', () => {
        beforeEach(() => {
            this.createObj = (opts) => {
                var map = new Map();
                map.set(1, new types.NumericLiteral([Token.create('Numeric', 1)]));
                map.set(2, new types.NumericLiteral([Token.create('Numeric', 2)]));
                map.set(3, new types.NumericLiteral([Token.create('Numeric', 3)]));
                return helpers.createObject(map, opts);
            };
        });

        it('should remove from object {x:x}', () => {
            var one = new types.NumericLiteral([Token.create('Numeric', 1)]);
            var obj = helpers.createObject(toMap({1: one}));
            var prop = helpers.getPropFromObjectByKeyName(obj, 1);
            helpers.removePropertyFromObject(obj, prop);
            expect(obj.getSourceCode()).to.eql('{}');

            obj = helpers.createObject(toMap({1: one.cloneElement()}), {multiLine: true});
            helpers.removePropertyFromObjectByKeyName(obj, 1);
            expect(obj.getSourceCode()).to.eql('{}');

            obj = helpers.createObject(toMap({1: one.cloneElement()}), {spaceBeforeObjectValues: false});
            helpers.removePropertyFromObjectByKeyName(obj, 1);
            expect(obj.getSourceCode()).to.eql('{}');

            obj = helpers.createObject(toMap({1: one.cloneElement()}), {spaceAfterObjectKeys: true});
            helpers.removePropertyFromObjectByKeyName(obj, 1);
            expect(obj.getSourceCode()).to.eql('{}');

            obj = helpers.createObject(toMap({1: one.cloneElement()}), {spacesInsideObjectBrackets: true});
            helpers.removePropertyFromObjectByKeyName(obj, 1);
            expect(obj.getSourceCode()).to.eql('{}');

            obj = helpers.createObject(toMap({1: one.cloneElement()}), {paddingNewLinesInObjects: true});
            helpers.removePropertyFromObjectByKeyName(obj, 1);
            expect(obj.getSourceCode()).to.eql('{}');

            obj = helpers.createObject(toMap({1: one.cloneElement()}), {objectKeysOnNewLine: true});
            helpers.removePropertyFromObjectByKeyName(obj, 1);
            expect(obj.getSourceCode()).to.eql('{}');
        });

        it('should not remove prop of diff object', () => {
            var obj1 = this.createObj();
            var obj2 = this.createObj();
            var prop = helpers.getPropFromObjectByKeyName(obj2, 2);
            expect(() => {
                helpers.removePropertyFromObject(obj1, prop);
            }).to.throw(Error);
            expect(obj1.getSourceCode()).to.eql('{1: 1, 2: 2, 3: 3}');
            expect(obj2.getSourceCode()).to.eql('{1: 1, 2: 2, 3: 3}');
            expect(() => {
                helpers.removePropertyFromObjectByKeyName(obj1, prop);
            }).to.throw(Error);
            expect(obj1.getSourceCode()).to.eql('{1: 1, 2: 2, 3: 3}');
            expect(obj2.getSourceCode()).to.eql('{1: 1, 2: 2, 3: 3}');
        });

        it('should remove from object {1:1, x:x, 3:3}', () => {
            var obj = this.createObj();
            var prop = helpers.getPropFromObjectByKeyName(obj, '2');
            helpers.removePropertyFromObject(obj, prop);
            expect(obj.getSourceCode()).to.eql('{1: 1, 3: 3}');

            obj = this.createObj({spaceBeforeObjectValues: false});
            helpers.removePropertyFromObjectByKeyName(obj, 2);
            expect(obj.getSourceCode()).to.eql('{1:1, 3:3}');

            obj = this.createObj({spaceAfterObjectKeys: true});
            helpers.removePropertyFromObjectByKeyName(obj, 2);
            expect(obj.getSourceCode()).to.eql('{1 : 1, 3 : 3}');

            obj = this.createObj({spacesInsideObjectBrackets: true});
            helpers.removePropertyFromObjectByKeyName(obj, 2);
            expect(obj.getSourceCode()).to.eql('{ 1: 1, 3: 3 }');

            obj = this.createObj({paddingNewLinesInObjects: true});
            helpers.removePropertyFromObjectByKeyName(obj, 2);
            expect(obj.getSourceCode()).to.eql('{\n1: 1, 3: 3\n}');

            obj = this.createObj({objectKeysOnNewLine: true});
            helpers.removePropertyFromObjectByKeyName(obj, 2);
            expect(obj.getSourceCode()).to.eql('{1: 1,\n3: 3}');

            obj = this.createObj({multiLine: true});
            helpers.removePropertyFromObjectByKeyName(obj, 2);
            expect(obj.getSourceCode()).to.eql('{\n1: 1,\n3: 3\n}');

        });

        it('should remove from object {x:x, 2:2}', () => {
            this.createObj = (opts) => {
                var map = new Map();
                map.set(1, new types.NumericLiteral([Token.create('Numeric', 1)]));
                map.set(2, new types.NumericLiteral([Token.create('Numeric', 2)]));
                return helpers.createObject(map, opts);
            };
            var obj = this.createObj();
            var prop = helpers.getPropFromObjectByKeyName(obj, 1);
            helpers.removePropertyFromObject(obj, prop);
            expect(obj.getSourceCode()).to.eql('{2: 2}');

            obj = this.createObj({spaceBeforeObjectValues: false});
            helpers.removePropertyFromObjectByKeyName(obj, 1);
            expect(obj.getSourceCode()).to.eql('{2:2}');

            obj = this.createObj({spaceAfterObjectKeys: true});
            helpers.removePropertyFromObjectByKeyName(obj, 1);
            expect(obj.getSourceCode()).to.eql('{2 : 2}');

            obj = this.createObj({spacesInsideObjectBrackets: true});
            helpers.removePropertyFromObjectByKeyName(obj, 1);
            expect(obj.getSourceCode()).to.eql('{ 2: 2 }');

            obj = this.createObj({paddingNewLinesInObjects: true});
            helpers.removePropertyFromObjectByKeyName(obj, 1);
            expect(obj.getSourceCode()).to.eql('{\n2: 2\n}');

            obj = this.createObj({objectKeysOnNewLine: true});
            helpers.removePropertyFromObjectByKeyName(obj, 1);
            expect(obj.getSourceCode()).to.eql('{2: 2}');

            obj = this.createObj({multiLine: true});
            helpers.removePropertyFromObjectByKeyName(obj, 1);
            expect(obj.getSourceCode()).to.eql('{\n2: 2\n}');
        });

        it('should remove from object {1:1, x:x}', () => {
            this.createObj = (opts) => {
                var map = new Map();
                map.set(1, new types.NumericLiteral([Token.create('Numeric', 1)]));
                map.set(2, new types.NumericLiteral([Token.create('Numeric', 2)]));
                return helpers.createObject(map, opts);
            };
            var obj = this.createObj();
            var prop = helpers.getPropFromObjectByKeyName(obj, 2);
            helpers.removePropertyFromObject(obj, prop);
            expect(obj.getSourceCode()).to.eql('{1: 1}');

            obj = this.createObj({spaceBeforeObjectValues: false});
            helpers.removePropertyFromObjectByKeyName(obj, 2);
            expect(obj.getSourceCode()).to.eql('{1:1}');

            obj = this.createObj({spaceAfterObjectKeys: true});
            helpers.removePropertyFromObjectByKeyName(obj, 2);
            expect(obj.getSourceCode()).to.eql('{1 : 1}');

            obj = this.createObj({spacesInsideObjectBrackets: true});
            helpers.removePropertyFromObjectByKeyName(obj, 2);
            expect(obj.getSourceCode()).to.eql('{ 1: 1 }');

            obj = this.createObj({paddingNewLinesInObjects: true});
            helpers.removePropertyFromObjectByKeyName(obj, 2);
            expect(obj.getSourceCode()).to.eql('{\n1: 1\n}');

            obj = this.createObj({objectKeysOnNewLine: true});
            helpers.removePropertyFromObjectByKeyName(obj, 2);
            expect(obj.getSourceCode()).to.eql('{1: 1}');

            obj = this.createObj({multiLine: true});
            helpers.removePropertyFromObjectByKeyName(obj, 2);
            expect(obj.getSourceCode()).to.eql('{\n1: 1\n}');
        });

        it('should remove from object {x:x, 2:2, 3:3}', () => {
            var obj = this.createObj();
            var prop = helpers.getPropFromObjectByKeyName(obj, 1);
            helpers.removePropertyFromObject(obj, prop);
            expect(obj.getSourceCode()).to.eql('{2: 2, 3: 3}');

            obj = this.createObj({spaceBeforeObjectValues: false});
            helpers.removePropertyFromObjectByKeyName(obj, 1);
            expect(obj.getSourceCode()).to.eql('{2:2, 3:3}');

            obj = this.createObj({spaceAfterObjectKeys: true});
            helpers.removePropertyFromObjectByKeyName(obj, 1);
            expect(obj.getSourceCode()).to.eql('{2 : 2, 3 : 3}');

            obj = this.createObj({spacesInsideObjectBrackets: true});
            helpers.removePropertyFromObjectByKeyName(obj, 1);
            expect(obj.getSourceCode()).to.eql('{ 2: 2, 3: 3 }');

            obj = this.createObj({paddingNewLinesInObjects: true});
            helpers.removePropertyFromObjectByKeyName(obj, 1);
            expect(obj.getSourceCode()).to.eql('{\n2: 2, 3: 3\n}');

            obj = this.createObj({objectKeysOnNewLine: true});
            helpers.removePropertyFromObjectByKeyName(obj, 1);
            expect(obj.getSourceCode()).to.eql('{2: 2,\n3: 3}');

            obj = this.createObj({multiLine: true});
            helpers.removePropertyFromObjectByKeyName(obj, 1);
            expect(obj.getSourceCode()).to.eql('{\n2: 2,\n3: 3\n}');
        });

        it('should remove from object {1:1, 2:2, x:x}', () => {
            var obj = this.createObj();
            var prop = helpers.getPropFromObjectByKeyName(obj, 3);
            helpers.removePropertyFromObject(obj, prop);
            expect(obj.getSourceCode()).to.eql('{1: 1, 2: 2}');

            obj = this.createObj({spaceBeforeObjectValues: false});
            helpers.removePropertyFromObjectByKeyName(obj, 3);
            expect(obj.getSourceCode()).to.eql('{1:1, 2:2}');

            obj = this.createObj({spaceAfterObjectKeys: true});
            helpers.removePropertyFromObjectByKeyName(obj, 3);
            expect(obj.getSourceCode()).to.eql('{1 : 1, 2 : 2}');

            obj = this.createObj({spacesInsideObjectBrackets: true});
            helpers.removePropertyFromObjectByKeyName(obj, 3);
            expect(obj.getSourceCode()).to.eql('{ 1: 1, 2: 2 }');

            obj = this.createObj({paddingNewLinesInObjects: true});
            helpers.removePropertyFromObjectByKeyName(obj, 3);
            expect(obj.getSourceCode()).to.eql('{\n1: 1, 2: 2\n}');

            obj = this.createObj({objectKeysOnNewLine: true});
            helpers.removePropertyFromObjectByKeyName(obj, 3);
            expect(obj.getSourceCode()).to.eql('{1: 1,\n2: 2}');

            obj = this.createObj({multiLine: true});
            helpers.removePropertyFromObjectByKeyName(obj, 3);
            expect(obj.getSourceCode()).to.eql('{\n1: 1,\n2: 2\n}');
        });

    });

});
