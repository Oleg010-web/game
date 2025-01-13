import {Game} from "./game.js";
import {GameStatuses} from "./GAME_STATUSES.js";
import { MoveDirections } from "./move-directions.js";
import { SamuraiNumberUtility } from "./samurai-number-utility.js";

describe('game', () => {
    it('should have Pending status after creating', () => {
        const numberUtility = new SamuraiNumberUtility();
        const game = new Game(numberUtility);
        expect(game.status).toBe(GameStatuses.PENDING)
    })

    it('should have InProgress status after start', () => {
        const numberUtility = new SamuraiNumberUtility()
        const game = new Game(numberUtility)
        game.start()
        expect(game.status).toBe(GameStatuses.IN_PROGRESS)
    })
    it('google should be in the Grid after start', () => {
        const numberUtility = new SamuraiNumberUtility()
        const game = new Game(numberUtility)
        game.start()
        expect(game.googlePosition.x).toBeLessThan(game.gridSize.columnsCount)
        expect(game.googlePosition.x).toBeGreaterThanOrEqual(0)
        expect(game.googlePosition.y).toBeLessThan(game.gridSize.rowsCount)
        expect(game.googlePosition.y).toBeGreaterThanOrEqual(0)
    })

    it('should verify that googlePoints starts at zero when googleEscaped is invoked', () => {
        const numberUtility = new SamuraiNumberUtility();
        const game = new Game(numberUtility);
        game.start();
        expect(game.googlePoints).toBe(0);
    })

    it('should verify that googleEscaped does not alter googlePosition directly', async () => {
        const numberUtility = new SamuraiNumberUtility();
        const game = new Game(numberUtility);
        game.googleJumpInterval = 1;
        game.start();

        const initialPosition = game.googlePosition;
        await delay(1); // Allow one interval to pass

        expect(game.googlePosition).not.toBe(initialPosition);
        expect(game.googlePosition).not.toEqual(initialPosition);
    })

    it('google should be in the Grid but in new position after jump', async () => {
        const numberUtility = new SamuraiNumberUtility();
        const game = new Game(numberUtility);
        game.googleJumpInterval = 1;
        game.start() // jump -> webAPI/browser 10

        for (let i = 0; i < game.googleWinningPoints; i++) {
            const prevGooglePosition = game.googlePosition;
            await delay(1) // await -> webAPI/browser 10 // after 10 ms: macrotasks: [jump, await]
            const currentGooglePosition = game.googlePosition;
            expect(prevGooglePosition).not.toEqual(currentGooglePosition)
        }
    })

    it('should set the game status to LOSS when googlePoints reaches googleWinningPoints', async () => {
        const numberUtility = new SamuraiNumberUtility();
        const game = new Game(numberUtility);
        game.googleJumpInterval = 1;
        game.start();

        // Wait until googlePoints reaches googleWinningPoints
        await delay(1000);

        expect(game.status).toBe(GameStatuses.LOSS);
    });

    it('should verify that googlePoints increments correctly with each interval tick', async () => {
        const numberUtility = new SamuraiNumberUtility();
        const game = new Game(numberUtility);
        game.googleJumpInterval = 1; // Set interval to 1 ms for testing
        game.start();

        const initialPoints = game.googlePoints;
        await delay(1000); // Wait for a few intervals to pass

        expect(game.googlePoints).toBeGreaterThan(initialPoints);
        expect(game.googlePoints).toBe(15); // Ensure it increments correctly
    })

    it('should confirm that googleEscaped does not modify game status before googlePoints reaches googleWinningPoints', async () => {
        const numberUtility = new SamuraiNumberUtility();
        const game = new Game(numberUtility);
        game.googleJumpInterval = 1;
        game.start();

        // Wait for a duration less than required to reach googleWinningPoints
        await delay((game.gridSize.columnsCount * game.gridSize.rowsCount * game.googleJumpInterval) / 2);

        expect(game.status).toBe(GameStatuses.IN_PROGRESS);
    })

    // it('players should move in correct directions', () => {
    //     // composition root
    //     const numberUtilityMock = { // fake, stub, mock, spy
    //         _callCounter: 0,
    //         returnValues: [3,3,2,2],
    //         getRandomInteger() {
    //             const returnValue = this.returnValues[this._callCounter]
    //             if (returnValue === undefined) throw new Error('set more values for test')
    //             this._callCounter++;
    //             return returnValue
    //         }
    //     }
    //     const game = new Game(numberUtilityMock)
    //     game.start()

    //     // [ ][ ][ ][ ]
    //     // [ ][ ][ ][ ]
    //     // [ ][ ][ ][ ]
    //     // [ ][ ][ ][p1]
    //     expect(game.player1Position).toEqual({x: 3, y: 3});

    //     game.movePlayer(1, MoveDirections.RIGHT);
    //     expect(game.player1Position).toEqual({x: 3, y: 3});

    //     game.movePlayer(1, MoveDirections.DOWN);
    //     expect(game.player1Position).toEqual({x: 3, y: 3});

    //     game.movePlayer(1, MoveDirections.UP);
    //     // [ ][ ][ ][ ]
    //     // [ ][ ][ ][ ]
    //     // [ ][ ][ ][p1]
    //     // [ ][ ][ ][ ]
    //     expect(game.player1Position).toEqual({x: 3, y: 2});

    //     game.movePlayer(1, MoveDirections.LEFT);
    //     // [ ][ ][ ][ ]
    //     // [ ][ ][ ][ ]
    //     // [ ][ ][p1][ ]
    //     // [ ][ ][ ][ ]
    //     expect(game.player1Position).toEqual({x: 2, y: 2});

    //     game.movePlayer(1, MoveDirections.LEFT);
    //     // [ ][ ][ ][ ]
    //     // [ ][ ][ ][ ]
    //     // [ ][p1][ ][ ]
    //     // [ ][ ][ ][ ]
    //     expect(game.player1Position).toEqual({x: 1, y: 2});

    //     game.movePlayer(1, MoveDirections.LEFT);
    //     // [ ][ ][ ][ ]
    //     // [ ][ ][ ][ ]
    //     // [p1][ ][ ][ ]
    //     // [ ][ ][ ][ ]
    //     expect(game.player1Position).toEqual({x: 0, y: 2});

    //     game.movePlayer(1, MoveDirections.LEFT);
    //     // [ ][ ][ ][ ]
    //     // [ ][ ][ ][ ]
    //     // [p1][ ][ ][ ]
    //     // [ ][ ][ ][ ]
    //     // can't move left through the border
    //     expect(game.player1Position).toEqual({x: 0, y: 2});

    //     game.movePlayer(1, MoveDirections.UP);
    //     // [ ][ ][ ][ ]
    //     // [p1][ ][ ][ ]
    //     // [ ][ ][ ][ ]
    //     // [ ][ ][ ][ ]
    //     // can't move left through the border
    //     expect(game.player1Position).toEqual({x: 0, y: 1});

    //     game.movePlayer(1, MoveDirections.UP);
    //     // [p1][ ][ ][ ]
    //     // [ ][ ][ ][ ]
    //     // [ ][ ][ ][ ]
    //     // [ ][ ][ ][ ]
    //     // can't move left through the border
    //     expect(game.player1Position).toEqual({x: 0, y: 0});

    //     game.movePlayer(1, MoveDirections.UP);

    //     // can't move up through the border
    //     expect(game.player1Position).toEqual({x: 0, y: 0});
    // });

    it('players should move in correct directions', () => {
        const numberUtilityMock = {
            _callCounter: 0,
            getRandomInteger() {
                this._callCounter++;
                if(this._callCounter >= 5) return 0
                if (this._callCounter > 2 && this._callCounter <= 4) return 2
                else return 3
            }
        }
        const game = new Game(numberUtilityMock)
        game.googleJumpInterval = 1;
        game.start()
        const playerNumbers = Object.keys(game.playersPosition)

        // [][][][]
        // [][][][]
        // [][][p][]
        // [][][][p]
        expect(game.player1.position).toEqual({x: 3, y: 3});
        expect(game.player2.position).toEqual({x:2, y: 2});

        //player1 position - X
        expect(game.player1.position.x).toBeGreaterThanOrEqual(0);
        expect(game.player1.position.x).toBeLessThan(4);
        //player2 position - X
        expect(game.player2.position.x).toBeGreaterThanOrEqual(0);
        expect(game.player2.position.x).toBeLessThan(4);
        //player1 position - Y
        expect(game.player1.position.y).toBeGreaterThanOrEqual(0);
        expect(game.player1.position.y).toBeLessThan(4);
        //player2 position - Y
        expect(game.player2.position.y).toBeGreaterThanOrEqual(0);
        expect(game.player2.position.y).toBeLessThan(4);

        expect(() => {game.movePlayer(1, MoveDirections.RIGHT, playerNumbers)}).toThrow("Player cant move outside the grid")
        

        expect(game.player1.position).toEqual({x: 3, y: 3});

        expect(() => {game.movePlayer(1, MoveDirections.DOWN, playerNumbers)}).toThrow("Player cant move outside the grid")
        

        expect(game.player1.position).toEqual({x: 3, y: 3});

        game.movePlayer(1, MoveDirections.UP, playerNumbers);
        // [][][][]
        // [][][][]
        // [][][][p1]
        // [][][][]
        expect(game.player1Position).toEqual({x: 3, y: 2});

        game.movePlayer(2, MoveDirections.DOWN, playerNumbers);
        // [][][][]
        // [][][][]
        // [][][][p]
        // [][][p2][]
        expect(game.player2Position).toEqual({x: 2, y: 3});


        game.movePlayer(1, MoveDirections.LEFT, playerNumbers)
        expect(game.player1Position).toEqual({x: 2, y: 2});

        
        // [][][][]
        // [][][][]
        // [][][p][]
        // [][][][]

        game.movePlayer(1, MoveDirections.UP, playerNumbers);
        // [][][][]
        // [][][p1][]
        // [][][][]
        // [][][][]
        expect(game.player1Position).toEqual({x: 2, y: 1});

        game.movePlayer(1, MoveDirections.UP, playerNumbers);
        // [][][p1][]
        // [][][][]
        // [][][][]
        // [][][][]
        expect(game.player1Position).toEqual({x: 2, y: 0});

        game.movePlayer(1, MoveDirections.LEFT, playerNumbers);
        // [][p1][][]
        // [][][][]
        // [][][][]
        // [][][][]
        expect(game.player1Position).toEqual({x: 1, y: 0});

        game.movePlayer(1, MoveDirections.LEFT, playerNumbers);
        // [p][][][]
        // [][][][]
        // [][][][]
        // [][][][]
        expect(game.player1Position).toEqual({x: 0, y: 0});
        expect(game.player1.currentPoints).toBe(1);

        expect(() => {game.movePlayer(1, MoveDirections.LEFT, playerNumbers)}).toThrow("Player cant move outside the grid");
        // [p][][][]
        // [][][][]
        // [][][][]
        // [][][][]
        expect(game.player1Position).toEqual({x: 0, y: 0});

        
        // [p][][][]
        // [][][][]
        // [][][][]
        // [][][][]
        expect(() => {game.movePlayer(1, MoveDirections.UP, playerNumbers)}).toThrow("Player cant move outside the grid");
    })

    it('should throw an error if a player tries to move to a position occupied by another player', () => {
        const numberUtilityMock = {
            _callCounter: 0,
            getRandomInteger() {
                this._callCounter++;
                if (this._callCounter >= 5) return 0;
                if (this._callCounter > 2 && this._callCounter <= 4) return 2;
                else return 3;
            }
        };
        const game = new Game(numberUtilityMock);
        game.start();
        const playerNumbers = Object.keys(game.playersPosition);
        
        // Двигаем первого игрока, чтобы занять позицию второго
        game.movePlayer(1, MoveDirections.LEFT, playerNumbers);
        
        // Теперь будем пытаться переместить второго игрока на ту же позицию, что занята первым
        expect(() => {
            game.movePlayer(2, MoveDirections.DOWN, playerNumbers);
        }).toThrow();
    

    });

    
})

const delay = (ms) => new Promise(res => setTimeout(res, ms))