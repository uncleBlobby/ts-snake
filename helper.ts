import { GameState, Coord, Move, ScoredMoves } from "./types";

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