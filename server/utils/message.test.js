const expect = require('expect');
const { generateMessage } = require('./message');

describe('When making a message', () => {
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