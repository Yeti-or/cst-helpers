var chai = require('chai');
var expect = chai.expect;

var helpers = require('..');

describe('Array: ', () => {

    it('should be func', () => expect(typeof helpers.removeElementFromArray).to.eql('function'));

});
