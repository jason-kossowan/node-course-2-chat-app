const expect = require('expect');

const { Users } = require('./users');

var testUsers;

beforeEach(() => {
    testUsers = new Users();

    testUsers.users = [{
        id: '1',
        name: 'Jason',
        room: 'Board Games'
    },
    {
        id: '2',
        name: 'Gen',
        room: 'D&D'
    },
    {
        id: '3',
        name: 'Sarah',
        room: 'Board Games'
    }];
});

describe('Users', () => {
    it('should add new user', () => {
        let users = new Users(),
            user = {
                id: '123',
                name: 'Jason',
                room: 'Board Games'
            };
            
        let result = users.addUser(user.id, user.name, user.room);

        expect(result).toBeA(Object);
        expect(result.id).toBe('123');
        expect(result.name).toBe('Jason');
        expect(result.room).toBe('Board Games');
    });

    it('should return names for Board Games', () => {
        let result = testUsers.getUserList('Board Games');

        expect(result).toBeA(Array);
        expect(result).toEqual(['Jason', 'Sarah']);
    });

    it('should return names for D&D', () => {
        let result = testUsers.getUserList('D&D');

        expect(result).toBeA(Array);
        expect(result).toEqual(['Gen']);
    });

    it('should remove a user', () => {
        var user = testUsers.removeUser('1');

        expect(user.name).toBe('Jason');
        expect(testUsers.users.length).toBe(2);
    });

    it('should not remove a user', () => {
        var user = testUsers.removeUser('51');

        expect(testUsers.users.length).toBe(3);
        expect(user).toBe(undefined);
    });

    it('should find user', () => {
        var user = testUsers.getUser('1');

        expect(user.id).toBe('1');
    });

    it('should not find user', () => {
        var user = testUsers.getUser('51');

        expect(user).toBe(undefined);
    });
});