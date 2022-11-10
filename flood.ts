import { GameState, Coord, FCoordStatus } from './types'

export const initNodeMap = (gs: GameState): Map<Coord, FCoordStatus> => {
    let newMap: Map<Coord, FCoordStatus> = new Map<Coord, FCoordStatus>();
  
    for (let i = 0; i < gs.board.width; i++){
        for (let j = 0; j < gs.board.height; j++){
            newMap.set({x: i, y: j}, FCoordStatus.EMPTY)
        }
    }
  
    return newMap;
}


export const snakeNodeMap = (gs: GameState, map: Map<Coord, FCoordStatus>): Map<Coord, FCoordStatus> => {

    const snakes = gs.board.snakes;

    for (let i = 0; i < snakes.length; i++){
        for (let j = 0; j < snakes[i].body.length; j++){
            map.set({x: snakes[i].body[j].x, y: snakes[i].body[j].y}, FCoordStatus.SNAKE)
        }
    }

    return map;
}

export const foodNodeMap = (gs: GameState, map: Map<Coord, FCoordStatus>): Map<Coord, FCoordStatus> => {
    
    const food = gs.board.food;
    
    for (let i = 0; i < food.length; i++){
        map.set({x: food[i].x, y: food[i].y}, FCoordStatus.FOOD)
    }

    return map;
}

export const hazNodeMap = (gs: GameState, map: Map<Coord, FCoordStatus>): Map<Coord, FCoordStatus> => {

    const hazards = gs.board.hazards;

    for (let i = 0; i < hazards.length; i++){
        map.set({x: hazards[i].x, y: hazards[i].y}, FCoordStatus.HAZARD)
    }
    return map;
}