/**
 * Class representing a player in the game.
 */

import { Position } from "./position.js";
import { SamuraiNumberUtility } from "./samurai-number-utility.js";

export class Player {
  #position;
  #currentPoints;
    constructor() {
      this.#position = null;
      this.#currentPoints = 0;
    }
  /**
   * Gets the current position of the player.
   * @returns {Object} The current position with x and y coordinates.
   */
  get position() {
    return this.#position
  }

  get currentPoints() {
    return this.#currentPoints
  }
  resetCurrentPoints() {
    this.#currentPoints = 0;
  }

  /**
   * Sets the position of the player to a random point within the specified range.
   * @param {number} value - A positive integer representing the maximum range for the x and y coordinates.
   * @throws Will throw an error if the value is not a positive integer.
   */
  setPosition = function(x, y, numberUtility) {
    if (!Number.isInteger(x) || x < 0) {
      throw new Error('Google jump interval must be a positive integer')
    }
    if (!Number.isInteger(y) || y < 0) {
      throw new Error('Google jump interval must be a positive integer')
    }
    this.#position = new Position(x, y, numberUtility)
  }

  checkUniqPlayerPosition = function(player){
    if(this.position.x === player.x && this.position.y === player.y){
      return true;
    }
  }
  increesPoints = function(){
    this.#currentPoints++;
  }
}

