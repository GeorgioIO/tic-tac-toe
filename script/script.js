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

    // function that return board
    const getBoard = () => board;

    // function to print board
    const printBoard = () => {
        for(let i = 0 ; i < rows ; i++)
        {
            console.log(board[i]);
        }
    }

    // function to fill board with symbol
    const fillCell = (row , cell , player) => {
        if(board[row][cell] == "-")
        {
            alert("Cell is not empty");
            return;
        }

        board[row][cell] = player;

    }

    return {printBoard , getBoard , fillCell}
})();


const Player = (name , symbol) =>
{
    return ({name , symbol ,});
}


const GameController = (function(p1 , p2){
    
    const players = [
        {
            name : p1.name,
            symbol : p1.symbol,
            score : 0,
            isWinner : false,
        },
        {
            name : p2.name,
            symbol : p2.symbol,
            score : 0,
            isWinner : false,
        }
    ]

    const getPlayer = (sym) => players.find( player => player.symbol === sym);

    const getWinner = () => players.find(player => player.isWinner === true);

    let activePlayer = players[0];

    const switchturn = () =>
    {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    const getActivePlayer = () => activePlayer ;
    
    const increaseScore = (player) =>  player.score++;

    const printNewBoard = () =>
    {
        Gameboard.printBoard();
        console.log(`its ${getActivePlayer().name} turn`);
    }

    const playMatch = () =>
    {
        if(players[0].score === 3 || players[1].score === 3)
        {
            throw new Error(`Match over ${getWinner().name} has already won`)
        }
        playRound()
    }

    const playTurn = (row , col) => 
    {
        let player = getActivePlayer();
        if(Gameboard.getBoard[row][col] == "-") // Cell is empty
        {
            Gameboard.fillCell(row , col , player.symbol);
            printNewBoard();
        }
        else
        {
            alert("Cell is already filled")
        }
    }

    const playRound = (row , col) => 
    {
        while(true)
        {
            if(checkWin())
            {
                increaseScore()
                
            }
        }
    }

    const checkTie = () =>
    {
        // Check if all cells are filled
        const isBoardFull = Gameboard.getBoard().every(row => row.every(cell => cell != "-"))

        if (isBoardFull && !checkWin())
        {
            // Tie
            return true
        }
        
        // Not tie
        return false
    }

    const checkWin = () =>
    {
        // Check horizontal wins
        for (let i = 0 ; i < Gameboard.rows ; i++)
        {
            let row = Gameboard.getBoard()[i];
            if(row.every(val => val === row[0] && row[0] != "-"))
            {
                console.log(`winner is ${getPlayer(row[0]).name}`)
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
                console.log(`winner is ${getPlayer(row[0]).name}`)
                return true;
            }
        }

        

        // Check diagonal wins
        let board = Gameboard.getBoard();
        let mainDiagonalWin = board.every((row, index) => row[index] === board[0][0] && board[0][0] !== "-");
        let antiDiagonalWin = board.every((row, index) => row[board.length - 1 - index] === board[0][board.length - 1] && board[0][board.length - 1] !== "-");

        if (mainDiagonalWin) {
            console.log(`Winner is ${getPlayer(board[0][0]).name}`);
            return true;
        }

        if (antiDiagonalWin) {
            console.log(`Winner is ${getPlayer(board[0][board.length - 1]).name}`);
            return true;
        }
        return false;
    }
    

})(Player("Georgio" , "X") , Player("Gara" , "O"));

Gameboard.fillCell(1 , 1 , "X");
Gameboard.printBoard();

