import { GameStatuses } from "./GAME_STATUSES.js";
import { MoveDirections } from "./move-directions.js";

export class View {
  #callbacks = {}
  #values = {}
  constructor(){
    this.movePlayer1()
    this.movePlayer2()
  }

  setCallBacks(callbacks) {
    this.#callbacks = callbacks;
  }


  movePlayer1(){
    document.addEventListener("keyup", (event) =>{
      switch(event.code) {
        case "ArrowUp":
          this.#callbacks.onMove("1", MoveDirections.UP);
          break;
        case "ArrowDown":
          this.#callbacks.onMove("1", MoveDirections.DOWN);
          break;
        case "ArrowLeft":
          this.#callbacks.onMove("1", MoveDirections.LEFT);
          break;
        case "ArrowRight":
          this.#callbacks.onMove("1", MoveDirections.RIGHT);
          break;
        default: return; // exit this handler for other keys
      }
    })
  }

  movePlayer2() {
    document.addEventListener("keyup", (event) =>{
      switch(event.code) {
        case "KeyW":
          this.#callbacks.onMove("2", MoveDirections.UP);
          break;
        case "KeyS":
          this.#callbacks.onMove("2", MoveDirections.DOWN);
          break;
        case "KeyA":
          this.#callbacks.onMove("2", MoveDirections.LEFT);
          break;
        case "KeyD":
          this.#callbacks.onMove("2", MoveDirections.RIGHT);
          break;
        default: return; // exit this handler for other keys
      }
    })
  }

 
  render(dto) {
    const root = document.getElementById('root');
    const settingsGame = document.createElement('div');
    const mainContent = document.createElement('div');
    mainContent.className ='mainContent';
    settingsGame.className = 'settingsGame';
 
    // Сначала очищаем, а затем добавляем новые элементы
    settingsGame.innerHTML = ''; // Очищаем предыдущие настройки
    mainContent.innerHTML = ''; // Очищаем предыдущий контент
    root.innerHTML = '';

    // Добавляем настройки в корень
    let music = document.createElement('audio')
    music.loop = true;
    const musicRange = document.createElement('input');
    musicRange.type = 'range';
    musicRange.min = 0;
    musicRange.max = 10;
    musicRange.value = 1;
    musicRange.addEventListener('input', (event) => {
      music.volume = event.target.value / 10;
    });
    music.volume = musicRange.value / 10;
    const audioBtn = document.createElement('button');
    audioBtn.className = 'audioBtn';
    const toggleMusic = async() => {
      try {
        if (music.paused) {
          await music.play(); // Добавлено await
          audioBtnImage.src = './images/pause1.png'
          // Изменить изображение кнопки, если музыка играет
        } else {
          music.pause();
          //music.currentTime = 0;
          audioBtnImage.src = './images/play.png'
          // Изменить изображение кнопки, если музыка на паузе
        }
      } catch (error) {
        console.error("Ошибка при управлении воспроизведением музыки:", error);
        music.cloneNode(true).play();
      }
    }
    audioBtn.addEventListener('click', toggleMusic);
    const audioBtnImage = document.createElement('img');
    audioBtnImage.src = './images/play.png';
    audioBtnImage.className = 'audioBtnImage';
    audioBtn.appendChild(audioBtnImage);
    const audioContainer = document.createElement("div");
    audioContainer.className = 'audioContainer';
    audioContainer.appendChild(audioBtn);
    audioContainer.appendChild(musicRange);
    settingsGame.appendChild(this.createSelect(dto.gameMode, root));
    settingsGame.appendChild(audioContainer)
    root.append(settingsGame);
    root.append(mainContent);

    if(dto.status === GameStatuses.PENDING) {
      console.log("Current Status: ", music.paused);
      music.src = './audio/menuAudio.mp3';
      const startButtonElement = document.createElement('button');
      startButtonElement.append('START GAME');
      startButtonElement.className = 'startBtn';
      //pattern observer
      startButtonElement.addEventListener('click', () =>{
        music.pause();
        music.currentTime = 0;
        this.#callbacks.onStart()
      })
      mainContent.append(startButtonElement);
    }else if(dto.status === GameStatuses.IN_PROGRESS){
      console.log("Current Status: ", music.paused);
      console.log('current game mode: ', dto.gameMode );
      // music.src = './audio/gameMusic.mp3';
      // music.volume = musicRange.value / 10;
      const treasure = document.createElement('span')
      const player1Points = document.createElement('span');
      const player2Points = document.createElement('span');
      player1Points.textContent = `Player 1: ${dto.player1Points}`;
      player2Points.textContent = `Player 2: ${dto.player2Points}`;
      treasure.textContent = `Treasure: ${dto.treasure}`;
      const selects =document.querySelectorAll(".gridSizeSettings");
      const options = document.querySelectorAll('.optionInSelect');
      selects.forEach(select => {
        select.textContent = dto.gameMode ? dto.gameMode : '4x4';
        select.style.display = 'none';
        select.disabled = true; // Устанавливаем disabled для каждого найденного select
    });
    options.forEach(option => {
      //option.value = dto.gridSize
      option.textContent = dto.gameMode ? dto.gameMode : '4x4';
      option.style.display = 'none'; // Устанавливаем display: none для каждого найденного option
      option.disabled = true;
    })
    settingsGame.appendChild(treasure)
    settingsGame.appendChild(player1Points)
    settingsGame.appendChild(player2Points)

      const tableElement = document.createElement('table');
      tableElement.style.backgroundImage = dto.gameMode === '7x7' ? 'url("./images/winterImg.png")' : 'url("./images/tableBackground.jpg")'
      for(let y = 0; y < dto.rowsCount; y++) {
        const rowElement = document.createElement('tr');
        for(let x = 0; x < dto.columnsCount; x++) {
          const cellElement = document.createElement('td');
          if(x === dto.googlePosition.x && y === dto.googlePosition.y) {
            const treasureImage = document.createElement('img');
            treasureImage.className = 'treasure';
            treasureImage.src = './images/1_2850.png';
            if(dto.googlePosition.x === dto.player1Position.x && dto.googlePosition.y === dto.player1Position.y || dto.googlePosition.x === dto.player2Position.x && dto.googlePosition.y === dto.player2Position.y ){
              treasureImage.style.display = 'none'
            }
            cellElement.append(treasureImage);
          }
          if(x === dto.player1Position.x && y === dto.player1Position.y) {
            const man1 = document.createElement('img');
            man1.className = 'man1';
            man1.src = './images/pngtree-office-worker-hurriedly-walks-away-semi-flat-color-character-png-image_15592861.png';
            cellElement.append(man1);
          }
          if(x === dto.player2Position.x && y === dto.player2Position.y) {
            const man2 = document.createElement('img');
            man2.className ='man2';
            man2.src = './images/pngtree-man-walking-flat-design-png-image_9018317.png';
            cellElement.append(man2);
          }
          rowElement.append(cellElement);
        }
        tableElement.append(rowElement);
      }
      mainContent.append(tableElement);
    } else if(dto.status === GameStatuses.WIN || dto.status === GameStatuses.LOSS) {
      settingsGame.innerHTML = '';
      mainContent.innerHTML = ''
      const logoContainer = document.createElement('div');
      const logoContainerImage = document.createElement('img');
      const gameStatistics = document.createElement('div');
      const gameStatisticsTitle = document.createElement('h2');
      const gameStatisticsSpan = document.createElement('span');
      const playersStatistics = document.createElement('div');
      const player1Statistic = document.createElement('div');
      const player1StatisticsSpan1 = document.createElement('span');
      const player1StatisticSpan2 = document.createElement('span');
      const player2StatisticSpan1 = document.createElement('span');
      const player2StatisticSpan2 = document.createElement('span');
      const player2Statistic = document.createElement('div');
      const gameStatisticsButton = document.createElement('button');
      gameStatisticsButton.addEventListener('click', () =>{
        this.#callbacks.backToStart()
      })
      gameStatisticsButton.style.top = '85%';
      gameStatisticsButton.style.width = '170px';
      gameStatisticsButton.innerHTML = 'Play again';
      gameStatisticsTitle.innerText = dto.status === GameStatuses.WIN ? 'You Win' : 'You lose';
      gameStatisticsSpan.innerText = dto.status === GameStatuses.WIN ? 'Congratulations' : 'You\'ll be lucky next time';
      player1StatisticsSpan1.innerText = 'Player 1';
      player1StatisticSpan2.innerText = `${dto.player1Points}`;
      player2StatisticSpan1.innerText = 'Player 2';
      player2StatisticSpan2.innerText = `${dto.player2Points}`;
      logoContainerImage.src = dto.status === GameStatuses.WIN ? '/images/Group (1).png' : '/images/cancel_icon.png'
      logoContainer.className = 'logoContainer';
      logoContainerImage.className = 'logoImage';
      gameStatistics.className = 'gameStatistics';
      playersStatistics.className = 'playersStatistics';
      gameStatisticsTitle.className = 'gameStatisticsTitle';
      gameStatisticsButton.className = 'startBtn';
      player1Statistic.className = 'player1Statistic';
      player2Statistic.className = 'player2Statistic';
      player1Statistic.appendChild(player1StatisticsSpan1);
      player1Statistic.appendChild(player1StatisticSpan2);
      player2Statistic.appendChild(player2StatisticSpan1);
      player2Statistic.appendChild(player2StatisticSpan2);
      playersStatistics.appendChild(player1Statistic);
      playersStatistics.appendChild(player2Statistic);
      gameStatistics.appendChild(gameStatisticsTitle);
      gameStatistics.appendChild(gameStatisticsSpan);
      gameStatistics.appendChild(playersStatistics);
      gameStatistics.appendChild(gameStatisticsButton);
      logoContainer.appendChild(logoContainerImage);
      mainContent.appendChild(logoContainer)
      mainContent.appendChild(gameStatistics);
    }
  }

  createSelect(gameMode, root) {
    const selectSettings = document.createElement('select');
    selectSettings.className = 'selectSettings';

    // Создаем массив с опциями
    const options = [
       { value: '4x4', text: '4x4' },
       { value: '7x7', text: '7x7'},
       { value: '10x10', text: '10x10'}
    ];

    // Добавляем опции в select
    options.forEach(option => {
        const opt = document.createElement('option');
        opt.className = 'optionInSelect';
        opt.value = option.value; // Устанавливаем значение
        opt.textContent = option.text; // Устанавливаем текст
        selectSettings.appendChild(opt); // Добавляем option в select
    });

    selectSettings.value = gameMode ? gameMode : "4x4"
    this.#callbacks.changeGameMode(selectSettings.value)
    selectSettings.addEventListener('change', (event) => {
      const selectedValue = event.target.value;
      console.log(selectedValue);
      switch (selectedValue) {
          case '4x4':
              console.log('Calling easyGrid');
              this.#callbacks.changeGameMode(selectedValue)
              root.style.backgroundImage = 'url("./images/summerImg.jpg")'
              this.#callbacks.easyGrid(); // вызов функции для легкой сетки
              break;
          case '7x7':
              console.log('Calling mediumGrid');
              this.#callbacks.changeGameMode(selectedValue)
              root.style.backgroundImage = 'url("./images/winterBackgroundImg.jpg")'
              this.#callbacks.mediumGrid(); // вызов функции для средней сетки
              break;
          case '10x10':
              console.log('Calling hardGrid');
              this.#callbacks.changeGameMode(selectedValue)
              root.style.backgroundImage = 'url("./images/GameBackground.jpg")'
              this.#callbacks.hardGrid(); // вызов функции для сложной сетки
              break;
          default:
              console.log('No matching grid size found');    
      }
      //this.updateGrid(); // обновление сетки
  });


    return selectSettings;
  }
}  