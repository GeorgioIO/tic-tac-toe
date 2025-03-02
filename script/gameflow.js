const form = document.getElementById("setup");
const gameContainer = document.querySelector(".game-container");
const cells = document.querySelectorAll(".board button");
const restartButton = document.getElementById("restartButton");
const resetButton = document.getElementById("resetButton");
let player1;
let player2;

form.addEventListener("submit" , (event) => {
    event.preventDefault();

    const p1Pick = document.getElementById("p1Select").value;
    const p2Pick = document.getElementById("p2Select").value;
    
    if(p1Pick === p2Pick)
    {
        const errorDiv = document.createElement("div");
        const errorMessage = document.createElement("p");
        errorMessage.innerText = "Players symbols can't be the same!";
        errorDiv.appendChild(errorMessage);
        const formHeader = document.querySelector(".header")
        formHeader.after(errorDiv);
        
        setTimeout(() => {
            errorDiv.style.display = "none";
        },2500)
    }
    else
    {
        form.classList.add("slideOut")
        savePlayers();
        
        setTimeout(()=>{
            gameContainer.style.display = "flex";
            form.style.display = "none";
        },500)
        gameContainer.classList.add("slideIn")

        populateBoard();
    }
})

function savePlayers()
{
    let player1Name = document.getElementById("p1Name").value;
    let player1Symbol = document.getElementById("p1Select").value;
 
    let player2Name = document.getElementById("p2Name").value;
    let player2Symbol = document.getElementById("p2Select").value;

    player1 = Player(player1Name , player1Symbol);
    player2 = Player(player2Name , player2Symbol);

    GameController.setPlayers(player1 , player2)

    
}

function populateBoard()
{
    document.querySelector("#player1-information .player-name").innerHTML = player1.name;
    document.querySelector("#player1-information .player-symbol").innerHTML = player1.symbol;
    document.querySelector("#player2-information .player-name").innerHTML = player2.name;
    document.querySelector("#player2-information .player-symbol").innerHTML = player2.symbol;
}

cells.forEach(cell => {
    cell.addEventListener("click" , (event)  => {
        let position = event.currentTarget.dataset.position;
        let [row , col] = position.split("-");
        GameController.playRound(row , col);
    })
})


let Gameboard = (function(){
    let rows = 3;
    let cols = 3;
    const board = []

    // Create board
    for(let i = 0 ; i < rows ; i++)
    {
        board[i] = [];
        for(let j = 0 ; j < cols ; j++)
        {
            board[i].push("-")
        }
    }

    // function that return a copy of the current board
    const getBoard = () => board.map(row => [...row]);

    // function to print board
    const printBoard = () => {
        for(let i = 0 ; i < rows ; i++)
        {
            console.log(board[i]);
        }
    }

    const resetBoard = () => {
        for(let i = 0 ; i < rows ; i++)
        {
            for(let j = 0 ; j < cols ; j++)
            {
                board[i][j] = "-"
            }
        }

        cells.forEach(cell => {
            cell.innerText = ""
        })
        
    }

    // function to fill board with symbol
    const fillCell = (row , cell , playerSymbol) => {
        board[row][cell] = playerSymbol;
        let position = `${row}-${cell}`;
        document.querySelector(`[data-position="${position}"]`).innerHTML = playerSymbol;
    }

    return {printBoard , getBoard , fillCell , resetBoard}
})();


const Player = (name , symbol) =>
{
    return ({name , symbol ,});
}


const GameController = (function(){
    let roundsPlayed = 1;
    let players = [];
    let activePlayer = null;
    let latestWinner = null;

    const setPlayers = (p1 , p2) => {
        players = [
            {
                name : p1.name,
                symbol : p1.symbol,
                score : 0,
                number : 1,
                isLatestWinner : false,
            },
            {
                name : p2.name,
                symbol : p2.symbol,
                score : 0,
                number : 2,
                isLatestWinner : false,
            }
        ]
        activePlayer = players[0]
    }

    const getRound = () => roundsPlayed;

    const increaseRounds = () => roundsPlayed++;

    const getPlayerBySymbol = (sym) => players.find( player => player.symbol === sym);

    const getWinner = () => players.find(player => player.isLatestWinner === true);

    const getMatchWinner = () => players.find(player => player.score === 3);

    const setLatestWinner = (player) => {
        if(GameController.getRound() == 1)
        {
            player.isLatestWinner = true;
        }
        else
        {
            if(player.name !== getWinner().name)
            {
                getWinner().isLatestWinner = false;
                player.isLatestWinner = true;
                console.log("inside else " , players[0] , players[1])
            }
        }
    }

    const switchturn = () =>
    {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
        
                 
        if(activePlayer == players[0])
        {
            document.querySelector("#player1-information .turn").style.backgroundColor = "green";
            document.querySelector("#player2-information .turn").style.backgroundColor = "red";
        }
        else
        {
            document.querySelector("#player1-information .turn").style.backgroundColor = "red";
            document.querySelector("#player2-information .turn").style.backgroundColor = "green";
        }
    }

    const getActivePlayer = () => activePlayer ;
    
    const increaseScore = (player) =>  {
        const playerContainer = getPlayerContainer(player.number);
        player.score++;
        playerContainer.querySelector(".score").innerHTML = player.score;
    };



    const playRound = (row , col) => 
    {
        if(players.length === 0) return false;

        if(makeMove(row , col))
        {
            if (checkWin()) {
                increaseScore(getActivePlayer()); 
                showMessage(`Game over! ${getActivePlayer().name} wins!` , "information");
                setLatestWinner(getActivePlayer())
                addRound(getRound() , getWinner().name);
                checkMatchWinner();
                cells.forEach(cell => {
                    cell.disabled = true;
                })
                return;
            }

            if (checkTie()) {
                showMessage("It's a tie!" , "information");
                addRound(getRound() , "Tie!")
                return;
            }

            switchturn();
        }
                
    }

    const makeMove = (row , col) => 
    {
        let player = getActivePlayer();
        if(Gameboard.getBoard()[row][col] == "-") // Cell is empty
        {
            Gameboard.fillCell(row , col , player.symbol);
            Gameboard.printBoard()
            return true;
        }
        else
        {
            showMessage("Cell is already filled!" , "error")
            return false
        }
    }

    const checkTie = () =>
    {
        // Check if all cells are filled
        const isBoardFull = Gameboard.getBoard().every(row => row.every(cell => cell != "-"))

        if (isBoardFull && !checkWin())
        {
            return true
        }
        return false
    }

    const checkWin = () =>
    {
        // Check horizontal wins
        for (let i = 0 ; i < Gameboard.getBoard().length ; i++)
        {
            let row = Gameboard.getBoard()[i];
            if(row.every(val => val === row[0] && row[0] != "-"))
            {

                console.log(`winner is ${getPlayerBySymbol(row[0]).name}`)
                return true;
            }
        }

        let transposedBoard = Gameboard.getBoard()[0].map((_, colIndex) => Gameboard.getBoard().map(row => row[colIndex]));

        // Check vertical wins
        for (let i = 0 ; i < transposedBoard.length ; i++)
        {
            let row = transposedBoard[i];
            if(row.every(val => val === row[0] && row[0] != "-"))
            {
                console.log(`winner is ${getPlayerBySymbol(row[0]).name}`)
                return true;
            }
        }



        // Check diagonal wins
        let board = Gameboard.getBoard();
        let mainDiagonalWin = board.every((row, index) => row[index] === board[0][0] && board[0][0] !== "-");
        let antiDiagonalWin = board.every((row, index) => row[board.length - 1 - index] === board[0][board.length - 1] && board[0][board.length - 1] !== "-");

        if (mainDiagonalWin) {
            console.log(`Winner is ${getPlayerBySymbol(board[0][0]).name}`);
            return true;
        }

        if (antiDiagonalWin) {
            console.log(`Winner is ${getPlayerBySymbol(board[0][board.length - 1]).name}`);
            return true;
        }
        return false;
    }

    const checkMatchWinner = () => {
        console.log(1)
        if(players[0].score == 3 || players[1].score == 3)
        {
        console.log(2)

            document.querySelector(".control-footer p").innerHTML = `${getMatchWinner().name} Wins!`
        }
    }
    
    const restartRound = () => {
        if(players[0].score != 3 && players[1].score != 3)
        {
            Gameboard.resetBoard();
            activePlayer = players[0];
            document.querySelector("#player1-information .turn").style.backgroundColor = "green";
            document.querySelector("#player2-information .turn").style.backgroundColor = "red";
            document.querySelector(".game-message").classList.remove("messageIn")
            cells.forEach(cell => {
                cell.disabled = false;
            })
        }
        else
        {
            showMessage(`${getMatchWinner().name} already won the match` , "error")
        }
    }

    const resetGame = () => {
        location.reload();
    }



    return {resetGame ,restartRound, getPlayerBySymbol , increaseRounds , getRound , getWinner , switchturn , getActivePlayer  , makeMove , playRound , checkTie , checkWin , setPlayers}
})();

function getPlayerContainer(playerNumber)
{
    return document.querySelector(`.player-information[data-number="${playerNumber}"]`);
}

function showMessage(message , type)
{
    const messageContainer = document.querySelector(".game-message");
    if(type == "error")
    {
        messageContainer.innerHTML = message;
        messageContainer.style.backgroundColor = "red";
        messageContainer.classList.remove("messageIn")

        setTimeout(()=> {
            messageContainer.classList.add("messageIn")
        }, 200)

        setTimeout(() => {
            messageContainer.classList.remove("bar")
            messageContainer.classList.add("bar")
        } , 500)

        setTimeout(() => {
            messageContainer.classList.remove("bar")
            messageContainer.classList.remove("messageIn")
        } , 8500)
    }
    else if(type == "information")
    {
        messageContainer.innerHTML = message;
        messageContainer.style.backgroundColor = "green";
        messageContainer.classList.remove("messageIn")
        messageContainer.classList.remove("bar")
        setTimeout(()=> {
            messageContainer.classList.add("messageIn")
        }, 200)
    }
}

function addRound(roundsPlayed , playerName)
{
    if(GameController.getRound() == 1)
    {
        const roundsList = document.querySelector(".rounds");
        roundsList.innerHTML = "";
        roundsList.innerHTML += `<li>Round ${roundsPlayed} winner is ${playerName}`;
        GameController.increaseRounds();
    }
    else
    {
        const roundsList = document.querySelector(".rounds");
        roundsList.innerHTML += `<li>Round ${roundsPlayed} winner is ${playerName}`;
        GameController.increaseRounds();
    }
}

resetButton.addEventListener("click" , GameController.resetGame)
restartButton.addEventListener("click" , GameController.restartRound);
