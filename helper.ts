import { GameState, Coord, Move, ScoredMoves, FCoordStatus } from "./types";

export const checkIfCoordIsSnake = (gs: GameState, target: Coord): boolean => {

    // need to write this to take the node map as a parameter
    // and check whether target is a member of node map snakes.
    
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

export const checkIfNodeIsSnake = (nm: Map<string, FCoordStatus>, target: Coord): boolean => {
    //console.log(`current nodeMap :${JSON.stringify(nm)}`)
    //console.log(`target in checkifNode: ${JSON.stringify(target)}`);
    //console.log(`type of target: ${typeof(target)}`);
    //console.log(`what target looks like: x: ${target.x} y: ${target.y}`)
    const thisTarget: Coord = {x: target.x, y: target.y}
    //console.log(`this target: ${JSON.stringify(target)}`)
    if (nm.get(JSON.stringify({x: target.x, y: target.y})) == FCoordStatus.SNAKE){
        //console.log(`found target, it's a snake! `)
        return true;
    } else {
        //console.log(`this target: ${thisTarget}`)
    }
    return false;
}

export const CountOpenSquares = (gs: GameState, moves: ScoredMoves) => {
    const TimeStart = performance.now();
    let myHead: Coord = gs.you.body[0];

    

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
            //console.log(`we have left clearance here, my head at ${JSON.stringify(myHead)}`)
            clearanceLeft++;
            for (let j = myHead.y + 1; j < gs.board.height; j++){
                if(!checkIfCoordIsSnake(gs, {x: i, y: j})){
                    clearanceLeft++
                } else {
                    break;
                }
            }
            for (let j = myHead.y - 1 ; j >= 0; j--){
                if(!checkIfCoordIsSnake(gs, {x: i, y: j})){
                    clearanceLeft++
                } else {
                    break;
                }
            }
        } else {
            break;
        }
    }

    for (let i = myHead.x + 1; i < gs.board.width; i++){
        if (!checkIfCoordIsSnake(gs, {x: i, y: myHead.y})){
            clearanceRight++;
            for (let j = myHead.y + 1; j < gs.board.height; j++){
                if(!checkIfCoordIsSnake(gs, {x: i, y: j})){
                    clearanceRight++
                } else {
                    break;
                }
            }
            for (let j = myHead.y - 1; j >= 0; j--){
                if(!checkIfCoordIsSnake(gs, {x: i, y: j})){
                    clearanceRight++
                } else {
                    break;
                }
            }
        } else {
            break;
        }
    }

    for (let i = myHead.y - 1; i >= 0; i--){
        if (!checkIfCoordIsSnake(gs, {x: myHead.x, y: i})){
            clearanceBottom++;
            for (let j = myHead.x; j < gs.board.width; j++){
                if(!checkIfCoordIsSnake(gs, {x: j, y: i})){
                    clearanceBottom++;
                } else {
                    break;
                }
            }
            for (let j = myHead.x -1; j >=0; j--){
                if(!checkIfCoordIsSnake(gs, {x: j, y: i})){
                    clearanceBottom++;
                } else {
                    break;
                }
            }
        } else {
            break;
        }
    }

    for (let i = myHead.y + 1; i < gs.board.height; i++){
        if (!checkIfCoordIsSnake(gs, {x: myHead.x, y: i})){
            clearanceTop++;
            for (let j = myHead.x; j < gs.board.width; j++){
                if(!checkIfCoordIsSnake(gs, {x: j, y: i})){
                    clearanceTop++;
                } else {
                    break;
                }
            }
            for (let j = myHead.x -1; j >=0; j--){
                if(!checkIfCoordIsSnake(gs, {x: j, y: i})){
                    clearanceTop++;
                } else {
                    break;
                }
            }
        } else {
            break;
        }
    }

    console.log(`clearanceLeft: ${clearanceLeft}`)
    console.log(`clearanceRight: ${clearanceRight}`)
    console.log(`clearanceDown: ${clearanceBottom}`)
    console.log(`clearanceUp: ${clearanceTop}`)
    
    const myLength = gs.you.body.length;


    moves.left.score += clearanceLeft * 2;
    moves.right.score += clearanceRight * 2;
    moves.down.score += clearanceBottom * 2;
    moves.up.score += clearanceTop * 2;

    const TimeEnd = performance.now();
    console.log(`time taken for old flood: ${TimeEnd - TimeStart}`)
}

export const CountOpenNodes = (gs: GameState, nm: Map<string, FCoordStatus>, moves: ScoredMoves) => {
    const TimeStart = performance.now();
    let myHead: Coord = gs.you.body[0];

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
        if (!checkIfNodeIsSnake(nm, {x: i, y: myHead.y})){
            //console.log(`we have left clearance here, my head at ${JSON.stringify(myHead)}`)
            clearanceLeft++;
            for (let j = myHead.y + 1; j < gs.board.height; j++){
                if(!checkIfNodeIsSnake(nm, {x: i, y: j})){
                    clearanceLeft++
                } else {
                    break;
                }
            }
            for (let j = myHead.y - 1 ; j >= 0; j--){
                if(!checkIfNodeIsSnake(nm, {x: i, y: j})){
                    clearanceLeft++
                } else {
                    break;
                }
            }
        } else {
            break;
        }
    }

    for (let i = myHead.x + 1; i < gs.board.width; i++){
        if (!checkIfNodeIsSnake(nm, {x: i, y: myHead.y})){
            clearanceRight++;
            for (let j = myHead.y + 1; j < gs.board.height; j++){
                if(!checkIfNodeIsSnake(nm, {x: i, y: j})){
                    clearanceRight++
                } else {
                    break;
                }
            }
            for (let j = myHead.y - 1; j >= 0; j--){
                if(!checkIfNodeIsSnake(nm, {x: i, y: j})){
                    clearanceRight++
                } else {
                    break;
                }
            }
        } else {
            break;
        }
    }

    for (let i = myHead.y - 1; i >= 0; i--){
        if (!checkIfNodeIsSnake(nm, {x: myHead.x, y: i})){
            clearanceBottom++;
            for (let j = myHead.x; j < gs.board.width; j++){
                if(!checkIfNodeIsSnake(nm, {x: j, y: i})){
                    clearanceBottom++;
                } else {
                    break;
                }
            }
            for (let j = myHead.x -1; j >=0; j--){
                if(!checkIfNodeIsSnake(nm, {x: j, y: i})){
                    clearanceBottom++;
                } else {
                    break;
                }
            }
        } else {
            break;
        }
    }

    for (let i = myHead.y + 1; i < gs.board.height; i++){
        if (!checkIfNodeIsSnake(nm, {x: myHead.x, y: i})){
            clearanceTop++;
            for (let j = myHead.x; j < gs.board.width; j++){
                if(!checkIfNodeIsSnake(nm, {x: j, y: i})){
                    clearanceTop++;
                } else {
                    break;
                }
            }
            for (let j = myHead.x -1; j >=0; j--){
                if(!checkIfNodeIsSnake(nm, {x: j, y: i})){
                    clearanceTop++;
                } else {
                    break;
                }
            }
        } else {
            break;
        }
    }

    console.log(`new flood clearanceLeft: ${clearanceLeft}`)
    console.log(`new flood clearanceRight: ${clearanceRight}`)
    console.log(`new flood clearanceDown: ${clearanceBottom}`)
    console.log(`new flood clearanceUp: ${clearanceTop}`)
    
    const myLength = gs.you.body.length;


    moves.left.score += clearanceLeft * 5;
    moves.right.score += clearanceRight * 5;
    moves.down.score += clearanceBottom * 5;
    moves.up.score += clearanceTop * 5;

    const TimeEnd = performance.now();
    console.log(`time taken for new flood: ${TimeEnd - TimeStart}`)
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
    let r = 241;
    const rHex = r.toString(16);
    let g = 241;
    const gHex = g.toString(16);
    let b = 241;
    const bHex = b.toString(16);

    console.log(`#${rHex}${gHex}${bHex}`)
    let hexString = `#${rHex}${gHex}${bHex}`;
    return hexString;
}

export const randomBetween = (min: number, max: number): number => {
    min = Math.ceil(min);
    max= Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

export const FindNextCoord = (gs: GameState, direction: string, start: Coord): Coord => {


    switch (direction){
        case "left":
            return {x: start.x - 1, y: start.y};
        case "right":
            return {x: start.x + 1, y: start.y};
        case "up":
            return {x: start.x, y: start.y + 1};
        case "down":
            return {x: start.x, y: start.y - 1};
        default: 
            console.log(`error in finding next coord...`);
            return {x: -1, y: -1}
    }
}