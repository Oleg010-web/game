import {GameStatuses} from "./GAME_STATUSES.js";
import { MoveDirections } from "./move-directions.js";
import { Player } from "./player.js";
import { Position } from "./position.js";
import {SamuraiNumberUtility} from "./samurai-number-utility.js";

export class Game {
    #currentGameMode;
    #settings = {
        gridSize: {
            columnsCount: 4, //x
            rowsCount: 4 //y
        },
        googleJumpInterval: 1000,
        // googleWinningPoints: this.#currentGameMode === '7x7' ? 80 : this.#currentGameMode === '10x10' ? 200 :  30,
        // playerWinningPoints: this.#currentGameMode === '7x7' ? 40 : this.#currentGameMode === '10x10' ? 95  :  15, 
    }
    #status = GameStatuses.PENDING
    #googlePoints = 0
    #googlePosition = null
    #numberUtility
    #callBacksProps = {}
    /**
     * @type Player // JSDoc
     */
    #player1;
    /** 
     * @type Player // JSDoc
     */
    #player2;
    

    constructor(numberUtility, callBacksProps) {
        this.#numberUtility = numberUtility
        this.#player1 = new Player()
        this.#player2 = new Player()
        this.#callBacksProps = callBacksProps
    }
    #playersPosition = {
        '1': null,
        '2': null
    }
    #players = {
        '1': null,
        '2': null
    }
    /** 
     * @param {number} value
     */
    set googleJumpInterval(value) {
        if (!Number.isInteger(value) || value <= 0) {
            throw new Error('Google jump interval must be a positive integer')
        }
        this.#settings.googleJumpInterval = value
        this.#callBacksProps.onChange()
    }

    get status() {
        return this.#status
    }

    get googlePosition() {
        return this.#googlePosition
    }

    get gridSize() {
        return this.#settings.gridSize
    }

    get googlePoints(){
        return this.#googlePoints
    }

    get googleWinningPoints() {
        return this.#currentGameMode === '7x7' ? 80 : this.#currentGameMode === '10x10' ? 200 : 30;
    }

    get playerWinningPoints() {
        return this.#currentGameMode === '7x7' ? 40 : this.#currentGameMode === '10x10' ? 95 : 15;
    }

    get gameSettings() {
        return this.#settings;
    }

    get player1Position() {
        return this.#playersPosition['1']
    }

    get player2Position() {
        return this.#playersPosition['2']
    }

    get playersPosition() {
        return this.#playersPosition;
    }

    get players() {
        return this.#players;
    }

    get player1() {
        return this.#player1
    }

    get player2() {
        return this.#player2
    }

    get gameMode() {
        return this.#currentGameMode
    }

    set googlePoints(value) {
        this.#googlePoints = value;
    }

    changeGameMode(mode){
        this.#currentGameMode = mode;
        console.log('Mode ' + this.#currentGameMode);
    }

    start() {
        this.#status = GameStatuses.IN_PROGRESS
        this.player1.setPosition(this.#settings.gridSize.columnsCount, this.#settings.gridSize.rowsCount, this.#numberUtility)
        this.#playersPosition['1'] = this.player1.position
        this.player2.setPosition(this.#settings.gridSize.columnsCount, this.#settings.gridSize.rowsCount, this.#numberUtility)
        this.#playersPosition['2'] = this.player2.position
        const player1PositionChecked = this.#player1.checkUniqPlayerPosition(this.#playersPosition['2']);
        const player2PositionChecked = this.#player2.checkUniqPlayerPosition(this.#playersPosition['1']);
        if (player1PositionChecked || player2PositionChecked) {
            this.start();
            return
        }
        this.#players['1'] = this.player1
        this.#players['2'] = this.player2
        this.#jumpGoogle()
        this.#callBacksProps.onChange()
        this.#runGoogleEscapedInterval()
    }
    
    #jumpGoogle() {
         const newPosition = new Position(this.#settings.gridSize.columnsCount, this.#settings.gridSize.rowsCount, this.#numberUtility)
        const googlePositionValid = this.#checkPosition(newPosition, this.googlePosition);
        const player1PositionValid = this.#checkPosition(newPosition, this.player1Position);
        const player2PositionValid = this.#checkPosition(newPosition, this.player2Position);
        if (googlePositionValid ||player1PositionValid ||player2PositionValid){
            this.#jumpGoogle();
            return;
        }

        this.#googlePosition = newPosition
    }
 
    #googleEscaped() {
            this.#jumpGoogle();
            this.googlePoints += 1;
    
    }

    #runGoogleEscapedInterval() {
        let intervalId = setInterval(() => {
            this.#googleEscaped()
            this.#callBacksProps.onChange()
            if (this.googlePoints === this.googleWinningPoints) {
                clearInterval(intervalId); 
                this.#status = GameStatuses.LOSS; 
                this.#callBacksProps.onChange()
                return; 
            }
            if (this.player1.currentPoints === this.playerWinningPoints || this.player2.currentPoints === this.playerWinningPoints) {
                clearInterval(intervalId);
                this.#status = GameStatuses.WIN
            }
        }, this.#settings.googleJumpInterval);
    }

    /**
     * Checks if the new position is the same as the start position and triggers a new jump if they match.
     * 
     * @param {Object} newPosition - The new position to check.
     * @param {number} newPosition.x - The x-coordinate of the new position.
     * @param {number} newPosition.y - The y-coordinate of the new position.
     * @param {Object} startPosition - The starting position to compare against.
     * @param {number} startPosition.x - The x-coordinate of the start position.
     * @param {number} startPosition.y - The y-coordinate of the start position.
     * @returns {void}
     */
    #checkPosition(newPosition, startPosition) {
        if(typeof newPosition !== 'object' && typeof startPosition!== 'object'){
             throw new Error('Both newPosition and startPosition must be objects')
        } 
        if (newPosition.x === startPosition?.x && newPosition.y === startPosition?.y){
            return true;
        }
        
    }

    // #catchGoogle(playerPosition, playerIndex) {
    //     if(playerPosition.x === this.googlePosition.x 
    //         && playerPosition.y === this.googlePosition.y){
    //         if(this.players[playerIndex].currentPoints === this.#settings.playerWinningPoints) {
    //             this.#status = GameStatuses.WIN;
    //             return;
    //         }
    //        this.players[playerIndex].increesPoints()
    //     } 
    // }

    createEasyGrid(){
        this.#settings.gridSize = {
            columnsCount: 4,
            rowsCount: 4
        }
        console.log('easyGrid function called!');
        return '4x4';
    }

    createMediumGrid(){
        this.#settings.gridSize = {
            columnsCount: 7,
            rowsCount: 7
        }
        console.log('MediumGrid function called!');
        return '7x7';
    }

    createHardGrid(){
        this.#settings.gridSize = {
            columnsCount: 10,
            rowsCount: 10
        }
        console.log('HardGrid function called!');
        return '10x10';
    }

    backToStart(){
        this.player1.resetCurrentPoints()
        this.player2.resetCurrentPoints()
        this.#googlePoints = 0;
        this.#status = GameStatuses.PENDING
        this.#callBacksProps.onChange()
        
    }

    movePlayer(player, moveDirection, playerNumbers) {
        const newPosition = {...this.#playersPosition[player] };
        const otherPlayersPosition = playerNumbers.filter(p => p !== player);
        switch(moveDirection) {
            case MoveDirections.UP: {
                newPosition.y--;
                break;
            }
            case MoveDirections.DOWN: {
                newPosition.y++;
                break;
            }
            case MoveDirections.LEFT: {
                newPosition.x--;
                break;
            }
            case MoveDirections.RIGHT: {
                newPosition.x++;
                break;
            }
        }

        if(newPosition.x >=0 && newPosition.x < this.#settings.gridSize.columnsCount && newPosition.y >=0 && newPosition.y < this.#settings.gridSize.rowsCount){
            const positionChecked = otherPlayersPosition.some(p => this.playersPosition[p].x === newPosition.x && this.playersPosition[p].y === newPosition.y)
            if(!positionChecked ){
                this.#playersPosition[player] = newPosition;
                //this.#callBacksProps.onChange()
                //this.#catchGoogle(this.#playersPosition[player], player);
                if(this.#playersPosition[player].x === this.googlePosition.x && this.#playersPosition[player].y === this.googlePosition.y){
                    if(this.#players[player].currentPoints === this.playerWinningPoints) {
                        this.#status = GameStatuses.WIN;
                        this.#callBacksProps.onChange()
                        return;
                    }
                   this.#players[player].increesPoints()
                   //this.#callBacksProps.onChange()
                } 
            }else{
                throw new Error('Another player is already in this position')
                
            } 
        } else {
            throw new Error('Player cant move outside the grid')
        }
    }

    // movePlayer(player, moveDirection, playerNumbers) {
    //     const newPosition = {...this.#playersPosition[player] };
    //     const allPlayersPosition = playerNumbers.map( p => ({...this.#playersPosition[p]}))
    //     const otherPlayersPosition = allPlayersPosition.filter(p => p.x !== this.playersPosition[player].x && p.y !== this.playersPosition[player].y);
    //     switch(moveDirection) {
    //         case MoveDirections.UP: {
    //             newPosition.y--;
    //             break;
    //         }
    //         case MoveDirections.DOWN: {
    //             newPosition.y++;
    //             break;
    //         }
    //         case MoveDirections.LEFT: {
    //             newPosition.x--;
    //             break;
    //         }
    //         case MoveDirections.RIGHT: {
    //             newPosition.x++;
    //             break;
    //         }
    //     }

    //     if(newPosition.x >=0 && newPosition.x < this.#settings.gridSize.columnsCount && newPosition.y >=0 && newPosition.y < this.#settings.gridSize.rowsCount){
    //         const positionChecked = otherPlayersPosition.some(p => p.x === newPosition.x && p.y === newPosition.y)
    //         if(positionChecked === false){
    //             this.#playersPosition[player] = newPosition;
    //         }else {
    //             throw new Error('Player cant move to the same position as another player')
    //         }
            
    //     }
    // }
}

