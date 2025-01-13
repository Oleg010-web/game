import { SamuraiNumberUtility } from "./samurai-number-utility.js";

/**
 * Represents a position in a 2D space.
 *
 * @class Position
 */
export class Position {
  /**
   * The x-coordinate of the position.
   * @type {number}
   */
  x;

  /**
   * The y-coordinate of the position.
   * @type {number}
   */
  y;


  //#positionCreator

  /**
   * Constructs a new instance of Position.
   *
   * @param {number} x - The maximum x-coordinate value. The actual x-coordinate will be a random integer between 0 and x (inclusive).
   * @param {number} y - The maximum y-coordinate value. The actual y-coordinate will be a random integer between 0 and y (inclusive).
   */
  constructor(x, y, numberUtility) {
    //this.#positionCreator = numberUtility
    this.x = numberUtility.getRandomInteger(0, x);
    this.y = numberUtility.getRandomInteger(0, y);
  }
}
