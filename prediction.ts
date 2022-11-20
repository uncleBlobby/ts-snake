import { SnakeAvoidNeck, SnakeAvoidOB, SnakeAvoidOwnBody, SnakePreferAwayFromLargerSnakeHead, SnakePreferAwayFromOtherSnakeBody, SnakePreferTowardClosestFoodMoves, SnakePreferTowardOwnTail } from "./anySnakeBrain";
import { getDistanceBetweenCoords, checkIfNodeIsSnake } from "./helper"
import { DetermineNextGameState } from "./nextTurnGameState";
import { Battlesnake, Coord, FCoordStatus, DepthSearch, GameState, Predicter, ScoredMoves } from "./types";

export const InitDepthSearch = (gs: GameState): DepthSearch => {
    let newDepthSearch: DepthSearch = {predicter: new Array<Predicter>}

    const snakes = gs.board.snakes;

    if (newDepthSearch !== undefined){
        for (let i = 0; i < snakes.length; i++){
            newDepthSearch.predicter[i] = {snake: snakes[i], 
                scoredMoves: {  left:   {direction: "left",   score: 0}, 
                                right:  {direction: "right",  score: 0},
                                up:     {direction: "up",     score: 0},
                                down:   {direction: "down",   score: 0}},
                bestMove: ""};

        }
    }
    
    if (newDepthSearch === undefined){
        console.warn(`depthsearch is still undefined...`)
    }
    return newDepthSearch;
}

export const AnySnakeAvoidNeckMoves = (gs: GameState, ds: DepthSearch) => {
    const numSnakes = ds.predicter.length;

    for (let i = 0; i < numSnakes; i++){
        SnakeAvoidNeck(ds.predicter[i].snake, ds.predicter[i].scoredMoves);
    }
    
}

export const AnySnakeAvoidOutOfBoundsMoves = (gs: GameState, ds: DepthSearch) => {
    const numSnakes = ds.predicter.length;

    for (let i = 0; i < numSnakes; i++){
        SnakeAvoidOB(gs, ds.predicter[i].snake, ds.predicter[i].scoredMoves)
    }
    
}

export const AnySnakeAvoidOwnBodyMoves = (gs: GameState, ds: DepthSearch) => {
    const numSnakes = ds.predicter.length;

    for (let i = 0; i < numSnakes; i++){
        SnakeAvoidOwnBody(ds.predicter[i].snake, ds.predicter[i].scoredMoves)
    }
}

export const AnySnakePreferTowardsClosestFoodMoves = (gs: GameState, ds: DepthSearch) => {
    const numSnakes = ds.predicter.length;

    for (let i = 0; i < numSnakes; i++){
        SnakePreferTowardClosestFoodMoves(gs, ds.predicter[i].snake, ds.predicter[i].scoredMoves)
    }
}

export const AnySnakeStillPreferFoodEvenIfNotStarving = (gs: GameState, ds: DepthSearch) => {
    const numSnakes = ds.predicter.length;

    for (let i = 0; i < numSnakes; i++){
        SnakePreferTowardClosestFoodMoves(gs, ds.predicter[i].snake, ds.predicter[i].scoredMoves)
    }
}

export const RunPredicter = (gs: GameState, ds: DepthSearch, nm: Map<string, FCoordStatus>, pc: number, turnStart: number) => {
    const numSnakes = ds.predicter.length;

    for (let i = 0; i < numSnakes; i++){
        SnakeAvoidNeck(ds.predicter[i].snake, ds.predicter[i].scoredMoves);
        SnakeAvoidOB(gs, ds.predicter[i].snake, ds.predicter[i].scoredMoves);
        SnakeAvoidOwnBody(ds.predicter[i].snake, ds.predicter[i].scoredMoves);
        SnakePreferTowardClosestFoodMoves(gs, ds.predicter[i].snake, ds.predicter[i].scoredMoves);
        SnakePreferTowardClosestFoodMoves(gs, ds.predicter[i].snake, ds.predicter[i].scoredMoves);
        SnakePreferAwayFromOtherSnakeBody(gs, ds.predicter[i].snake, ds.predicter[i].scoredMoves);
        SnakePreferAwayFromLargerSnakeHead(gs, ds.predicter[i].snake, ds.predicter[i].scoredMoves);
        SnakePreferTowardOwnTail(gs, ds.predicter[i].snake, ds.predicter[i].scoredMoves);
        SnakeCountOpenNodes(gs, ds.predicter[i].snake, nm, ds.predicter[i].scoredMoves);
    }
    pc++;
    //console.log(`predictions ran: ${pc}`)
    let turnTime = performance.now() - turnStart;
    if (turnTime < 400 && pc < 2){
        RunPredicter(DetermineNextGameState(gs, ds), ds, nm, pc, turnStart)
    } else {
        console.log(`looked ahead: ${pc} turns`)
        return;
    }
    
    //DetermineNextGameState(gs, ds);
}

export const LogDepthSearchResults = (ds: DepthSearch) => {
    for (let i = 0; i < ds.predicter.length; i++){
        console.log(ds.predicter[i].snake.name)
        console.log(ds.predicter[i].scoredMoves)
    }
}

export const SnakeGetClosestFoodCoord = (snake: Battlesnake, gs: GameState) => {
    const head = snake.body[0];
    const food = gs.board.food;

    let closestFood = food[0];
    let distanceToClosestFood = getDistanceBetweenCoords(head, food[0]);
    for (let i = 0; i < food.length; i++){
        if (getDistanceBetweenCoords(head, food[i]) < distanceToClosestFood){
            closestFood = food[i];
        }
    }

    return closestFood;
}

export const SnakeGetGeneralDirectionToCoord = (snake: Battlesnake, target: Coord) => {
    const head = snake.body[0];
    const objective = target;

    if (objective.x > head.x){
        return "right";
    }

    if (objective.x < head.x){
        return "left";
    }

    if (objective.y > head.y){
        return "up";
    }

    if (objective.y < head.y){
        return "down";
    }

    return "";
}

export const SnakeCountOpenNodes = (gs: GameState, snake: Battlesnake, nm: Map<string, FCoordStatus>, scoredMoves: ScoredMoves) => {
    const head = snake.body[0];

    let clearanceLeft = 0;
    let clearanceRight = 0;
    let clearanceTop = 0;
    let clearanceBottom = 0;

    for (let i = head.x - 1; i >= 0; i--){
        if (!checkIfNodeIsSnake(nm, {x: i, y: head.y})){
            //console.log(`we have left clearance here, my head at ${JSON.stringify(head)}`)
            clearanceLeft++;
            for (let j = head.y + 1; j < gs.board.height; j++){
                if(!checkIfNodeIsSnake(nm, {x: i, y: j})){
                    clearanceLeft++
                } else {
                    break;
                }
            }
            for (let j = head.y - 1 ; j >= 0; j--){
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

    for (let i = head.x + 1; i < gs.board.width; i++){
        if (!checkIfNodeIsSnake(nm, {x: i, y: head.y})){
            clearanceRight++;
            for (let j = head.y + 1; j < gs.board.height; j++){
                if(!checkIfNodeIsSnake(nm, {x: i, y: j})){
                    clearanceRight++
                } else {
                    break;
                }
            }
            for (let j = head.y - 1; j >= 0; j--){
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

    for (let i = head.y - 1; i >= 0; i--){
        if (!checkIfNodeIsSnake(nm, {x: head.x, y: i})){
            clearanceBottom++;
            for (let j = head.x; j < gs.board.width; j++){
                if(!checkIfNodeIsSnake(nm, {x: j, y: i})){
                    clearanceBottom++;
                } else {
                    break;
                }
            }
            for (let j = head.x -1; j >=0; j--){
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

    for (let i = head.y + 1; i < gs.board.height; i++){
        if (!checkIfNodeIsSnake(nm, {x: head.x, y: i})){
            clearanceTop++;
            for (let j = head.x; j < gs.board.width; j++){
                if(!checkIfNodeIsSnake(nm, {x: j, y: i})){
                    clearanceTop++;
                } else {
                    break;
                }
            }
            for (let j = head.x -1; j >=0; j--){
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

    //console.log(`new flood clearanceLeft: ${clearanceLeft}`)
    //console.log(`new flood clearanceRight: ${clearanceRight}`)
    //console.log(`new flood clearanceDown: ${clearanceBottom}`)
    //console.log(`new flood clearanceUp: ${clearanceTop}`)
    
    
    scoredMoves.left.score += clearanceLeft * 5;
    scoredMoves.right.score += clearanceRight * 5;
    scoredMoves.down.score += clearanceBottom * 5;
    scoredMoves.up.score += clearanceTop * 5;

    
}

export const MyPredictor = (snake: Battlesnake, ds: DepthSearch): ScoredMoves => {
    let sm = {  left:   {direction: "left",   score: 0}, 
                right:  {direction: "right",  score: 0},
                up:     {direction: "up",     score: 0},
                down:   {direction: "down",   score: 0}}
    
    for (let i = 0; i < ds.predicter.length; i++){
        if (snake.id == ds.predicter[i].snake.id){
            sm = ds.predicter[i].scoredMoves;
        }
    }
    console.log(`my predictor: ${JSON.stringify(sm)}`)
    return sm;
}