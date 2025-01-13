import { Game } from "./game.js";
import { SamuraiNumberUtility } from "./samurai-number-utility.js";
import { View } from "./view.js";

export class Controller {
  constructor(view) {
    const randonUtil = new SamuraiNumberUtility();
    this.model = new Game(randonUtil, {
      onChange: () => {
        this.#renderView()
      }
    });
    this.view = view;
    this.view.setCallBacks({
      onStart: () => {
        this.start()
      },
      onMove: (playerNumber, directions) => {
        this.model.movePlayer(playerNumber, directions, Object.keys(this.model.players))
        this.#renderView()
      },
      easyGrid: () => {
        this.model.createEasyGrid()
      },
      hardGrid: () => {
        this.model.createHardGrid()
      },
      mediumGrid: () => {
        this.model.createMediumGrid()
      },
      changeGameMode: (mode) => {
        this.model.changeGameMode(mode)
      },
      backToStart: () => {
        this.model.backToStart()
      }
    })
    this.#renderView()
  }
  start(){
    this.model.start()
    this.#renderView()
  }

  #renderView() {
    this.view.render({
      status: this.model.status,
      rowsCount: this.model.gridSize.rowsCount,
      columnsCount: this.model.gridSize.columnsCount,
      googlePosition: this.model.googlePosition,
      player1Position: this.model.player1Position,
      player2Position: this.model.player2Position,
      gridSize: this.model.gridSize,
      gameMode: this.model.gameMode,
      player1Points: this.model.player1.currentPoints,
      player2Points: this.model.player2.currentPoints,
      treasure: this.model.googlePoints
    })
  }
}