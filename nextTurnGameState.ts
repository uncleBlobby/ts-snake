import { getHighScoreMove } from "./helper";
import { Battlesnake, DepthSearch, GameState } from "./types"

export const DetermineNextGameState = (gs: GameState, ds: DepthSearch): GameState => {
    const numSnakes = ds.predicter.length;
    
    let nextGS = gs;

    for (let i = 0; i < numSnakes; i++){
        ds.predicter[i].bestMove = getHighScoreMove(ds.predicter[i].scoredMoves);
        for (let j = 0; j < nextGS.board.snakes.length; j++){
            if (nextGS.board.snakes[j].id == ds.predicter[i].snake.id){
                nextGS.board.snakes[j] = moveSnake (ds.predicter[i].snake, ds.predicter[i].bestMove)
            }
        }
    }
    
    return nextGS;
}

const moveSnake = (snake: Battlesnake, direction: string) => {
    switch(direction){
        case "left":
            //snake.body[0].x -= 1;
            for (let i = 1; i < snake.body.length; i++){
                snake.body[i] = snake.body[i - 1];
            }
            snake.body[0].x -= 1;
            break;
        case "right":
            for (let i = 1; i < snake.body.length; i++){
                snake.body[i] = snake.body[i - 1];
            }
            snake.body[0].x += 1;
            break;
        case "up":
            for (let i = 1; i < snake.body.length; i++){
                snake.body[i] = snake.body[i - 1];
            }
            snake.body[0].y += 1;
            break;
        case "down":
            for (let i = 1; i < snake.body.length; i++){
                snake.body[i] = snake.body[i - 1];
            }
            snake.body[0].y -= 1;
            break;
    }
    return snake;
}