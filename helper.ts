import { GameState, Coord, Move, ScoredMoves } from "./types";

export const checkIfCoordIsSnake = (gs: GameState, target: Coord): boolean => {
    const snakes = gs.board.snakes;

    for (let i = 0; i < gs.board.snakes.length; i++){
        for (let j = 0; j < gs.board.snakes[i].body.length; j++){
            if (target.x == gs.board.snakes[i].body[j].x && target.y == gs.board.snakes[i].body[j].y){
                return true;
            }
        }
    }

    return false;

}

export const countOpenCoordsRight = (gs: GameState): number => {
    let count = 0;
    let myHead = gs.you.head;

    

    for (let i = myHead.x; i < gs.board.width - 1; i++){
        let next: Coord = {x : myHead.x + i, y: myHead.y};
        if (!checkIfCoordIsSnake(gs, next)){
            count += 1;
        }
        else {
            return count;
            break;
        }
    }
    

    return count;
}

export const getHighScoreMove = (moves: ScoredMoves) => {
    let bestMove: Move = moves.left;


    if (moves.right.score > bestMove.score){
        bestMove = moves.right;
    }

    if (moves.up.score > bestMove.score){
        bestMove = moves.up;
    }

    if (moves.down.score > bestMove.score){
        bestMove = moves.down;
    }

    if (moves.left.score > bestMove.score){
        bestMove = moves.left;
    }

    return bestMove.direction;
}

export const getDistanceBetweenCoords = (one: Coord, two: Coord) => {
    let distance: number = 0;

    let xDistance: number = Math.abs(one.x - two.x);
    let yDistance: number = Math.abs(one.y - two.y);

    distance = xDistance + yDistance;

    return distance;
}

export const getClosestFoodCoord = (gameState: GameState) => {
    const myHead = gameState.you.head;
    const food = gameState.board.food;

    let closestFood = food[0];
    let distanceToClosestFood = getDistanceBetweenCoords(myHead, food[0]);
    for (let i = 0; i < food.length; i++){
        if (getDistanceBetweenCoords(myHead, food[i]) < distanceToClosestFood){
            closestFood = food[i];
        }
    }

    return closestFood;
}

export const getGeneralDirectionToCoord = (gameState: GameState, target: Coord) => {
    const myHead = gameState.you.head;
    const objective = target;

    if (objective.x > myHead.x){
        return "right";
    }

    if (objective.x < myHead.x){
        return "left";
    }

    if (objective.y > myHead.y){
        return "up";
    }

    if (objective.y < myHead.y){
        return "down";
    }

    return "";
}