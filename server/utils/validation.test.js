const expect = require('expect');

const { isRealString } = require('./validation');


describe('isRealString', () => {

    it('should reject non-string values', () => {
        let testString = 4,
            result = isRealString(testString);
        
        expect(result).toBe(false);
    
    });

    it('should reject string with only spaces', () => {
        let testString = '    ',
            result = isRealString(testString);

        expect(result).toBe(false);
    });

    it('should allow string with non-space characters', () => {
        let testString = '  foobar  ',
            result = isRealString(testString);

        expect(result).toBe(true);
    });

});