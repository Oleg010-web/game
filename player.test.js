import { Player } from "./player.js";
import { SamuraiNumberUtility } from "./samurai-number-utility.js";

describe('Player', () => {
    let player;
    let numberUtility
    beforeEach(() => {
        numberUtility = new SamuraiNumberUtility();
        player = new Player();
    });

    test('should set position to a random point within the range when given a positive integer', () => {
        const value = 10;
        player.setPosition( value, value, numberUtility);
        expect(player.position.x).toBeGreaterThanOrEqual(0);
        expect(player.position.x).toBeLessThan(value);
        expect(player.position.y).toBeGreaterThanOrEqual(0);
        expect(player.position.y).toBeLessThan(value);
    });

    test('should set position to different values when called multiple times with the same range', () => {
        const value = 10;
        player.setPosition( value, value, numberUtility);
        const firstPosition = player.position;
        player.setPosition( value, value, numberUtility);
        const secondPosition = player.position;
        expect(firstPosition).not.toEqual(secondPosition);
    });

    test('should return an object with x and y properties after setting position', () => {
        const value = 10;
        player.setPosition( value, value, numberUtility);
        expect(player.position).toHaveProperty('x');
        expect(player.position).toHaveProperty('y');
    });
});
