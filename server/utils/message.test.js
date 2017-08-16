const expect = require('expect');
const { generateMessage, generateLocationMessage } = require('./message');

describe('generateMessage', () => {
    it('should generate the correct message object', () => {
        let expectedFrom = 'testFromString',
            expectedText = 'testTextString',
            message = generateMessage(expectedFrom, expectedText);

        expect(message).toBeA('object');
        expect(message.from).toBe(expectedFrom);
        expect(message.text).toBe(expectedText);
        expect(message.createdAt).toBeA('number');
    });
});

describe('generateLocationMessage', () => {
    it('should generate the correct location object', () => {
        let expectedFrom = 'testFromString',
            expectedLat = '83.234234234234',
            expectedLong = '-53.434234235234',
            expectedUrl = `https://www.google.com/maps?q=${expectedLat},${expectedLong}`,
            message = generateLocationMessage(expectedFrom, expectedLat, expectedLong);

        expect(message).toBeA('object');
        expect(message.from).toBe(expectedFrom);
        expect(message.url).toBe(expectedUrl);
        expect(message.createdAt).toBeA('number');
    });
});