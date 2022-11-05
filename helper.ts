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

export const CountOpenSquares = (gs: GameState, moves: ScoredMoves) => {
    let myHead: Coord = gs.you.head;

    // distance from my head to each wall

    const distanceToLeftWall = myHead.x
    let clearanceLeft = 0;
    const distanceToRightWall = gs.board.width - myHead.x
    let clearanceRight = 0;

    const distanceToTopWall = gs.board.height - myHead.y
    let clearanceTop = 0;
    const distanceToBottomWall = myHead.y;
    let clearanceBottom = 0;

    for (let i = myHead.x - 1; i >= 0; i--){
        if (!checkIfCoordIsSnake(gs, {x: i, y: myHead.y})){
            clearanceLeft++;
        } else {
            break;
        }
    }

    for (let i = myHead.x + 1; i < gs.board.width; i++){
        if (!checkIfCoordIsSnake(gs, {x: i, y: myHead.y})){
            clearanceRight++;
        } else {
            break;
        }
    }

    for (let i = myHead.y - 1; i >= 0; i--){
        if (!checkIfCoordIsSnake(gs, {x: myHead.x, y: i})){
            clearanceBottom++;
        } else {
            break;
        }
    }

    for (let i = myHead.y + 1; i < gs.board.height; i++){
        if (!checkIfCoordIsSnake(gs, {x: myHead.x, y: i})){
            clearanceTop++;
        } else {
            break;
        }
    }

    console.log(`clearanceLeft: ${clearanceLeft}`)
    console.log(`clearanceRight: ${clearanceRight}`)
    console.log(`clearanceDown: ${clearanceBottom}`)
    console.log(`clearanceUp: ${clearanceTop}`)
    


    moves.left.score += clearanceLeft * 15;
    moves.right.score += clearanceRight * 15;
    moves.down.score += clearanceBottom * 15;
    moves.up.score += clearanceTop * 15;
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

export const generateRandomHexColor = () => {
    let r = Math.floor(Math.random() * 255) + 110;
    const rHex = r.toString(16);
    let g = Math.floor(Math.random() * 255) + 110;
    const gHex = g.toString(16);
    let b = Math.floor(Math.random() * 255) + 110;
    const bHex = b.toString(16);

    console.log(`#${rHex}${gHex}${bHex}`)
    let hexString = `#${rHex}${gHex}${bHex}`;
    return hexString;
}