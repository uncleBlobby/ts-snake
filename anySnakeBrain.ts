import { getDistanceBetweenCoords } from "./helper";
import { SnakeGetClosestFoodCoord, SnakeGetGeneralDirectionToCoord } from "./prediction";
import { Battlesnake, ScoredMoves, GameState } from "./types";

export const SnakeAvoidNeck = (snake: Battlesnake, scoredMoves: ScoredMoves) => {
    const head = snake.body[0];
    const neck = snake.body[1];

    if (neck.x < head.x) {        // Neck is left of head, don't move left
        scoredMoves.left.score -= 1000000;
      }
    
      if (neck.x > head.x) { // Neck is right of head, don't move right
        scoredMoves.right.score -= 1000000;
      }
    
      if (neck.y < head.y) { // Neck is below head, don't move down
        scoredMoves.down.score -= 1000000;
      }
    
      if (neck.y > head.y) { // Neck is above head, don't move up
        scoredMoves.up.score -= 1000000;
      }
}

export const SnakeAvoidOB = (gameState: GameState, snake: Battlesnake, scoredMoves: ScoredMoves) => {
    if (gameState.game.ruleset.name != "wrapped"){
        const head = snake.body[0];
        const BW = gameState.board.width;
        const BH = gameState.board.height;

        if (head.x - 1 < 0){
            scoredMoves.left.score -= 100000;
        }
    
        if (head.x + 1 >= BW){
            scoredMoves.right.score -= 100000;
        }
    
        if (head.y - 1 < 0){
            scoredMoves.down.score -= 100000;
        }
    
        if (head.y + 1 >= BH){
            scoredMoves.up.score -= 100000;
        }
    }
}

export const SnakeAvoidOwnBody = (snake: Battlesnake, scoredMoves: ScoredMoves) => {
    const head = snake.body[0];
    const body = snake.body;

    if (body[body.length] != body[body.length-1]){
        for (let i = 0; i < body.length - 1; i++){
          if (head.x + 1 == body[i].x && head.y == body[i].y){
            
            scoredMoves.right.score -= 10000;
          }
          if (head.x - 1 == body[i].x && head.y == body[i].y){
            
            scoredMoves.left.score -= 10000;
          }
          if (head.x == body[i].x && head.y + 1 == body[i].y){
            
            scoredMoves.up.score -= 10000;
          }
          if (head.x == body[i].x && head.y - 1== body[i].y){
            
            scoredMoves.down.score -= 10000;
          }
        }
      } else {
        for (let i = 0; i < body.length; i++){
          if (head.x + 1 == body[i].x && head.y == body[i].y){
            
            scoredMoves.right.score -= 10000;
          }
          if (head.x - 1 == body[i].x && head.y == body[i].y){
            
            scoredMoves.left.score -= 10000;
          }
          if (head.x == body[i].x && head.y + 1 == body[i].y){
            
            scoredMoves.up.score -= 10000;
          }
          if (head.x == body[i].x && head.y - 1== body[i].y){
            
            scoredMoves.down.score -= 10000;
          }
        }
      }
}

export const SnakePreferTowardClosestFoodMoves = (gs: GameState, snake: Battlesnake, scoredMoves: ScoredMoves) => {
    let closestFoodCoord = SnakeGetClosestFoodCoord(snake, gs);
    const head = snake.body[0];

    if (snake.health - 35 < getDistanceBetweenCoords(head, closestFoodCoord)){
        switch(SnakeGetGeneralDirectionToCoord(snake, closestFoodCoord)){
        case "right":
          scoredMoves.right.score += 100;
          break;
        case "left":
          scoredMoves.left.score += 100;
          break;
        case "up":
          scoredMoves.up.score += 100;
          break;
        case "down":
          scoredMoves.down.score += 100;
          break;
        default:
          break;
        }
    }
}

export const SnakeStillPreferFoodEvenIfNotStarving = (gs: GameState, snake: Battlesnake, scoredMoves: ScoredMoves) => {

    const closestFoodCoord = SnakeGetClosestFoodCoord(snake, gs);
    const head = snake.body[0];

    const snakeDistanceToClosestFood = getDistanceBetweenCoords(head, closestFoodCoord);

    let snakeClosestToFood = true;
    let snakeLongestOnBoard = true;

    for (let i = 0; i < gs.board.snakes.length; i++){
        if (snakeDistanceToClosestFood > getDistanceBetweenCoords(gs.board.snakes[i].head, closestFoodCoord)){
            snakeClosestToFood = false;
        }
        if(gs.board.snakes[i].body.length > snake.body.length){
            snakeLongestOnBoard = false;
        }
    }

    if (snakeClosestToFood && !snakeLongestOnBoard){
        switch(SnakeGetGeneralDirectionToCoord(snake, closestFoodCoord)){
            case "right":
                scoredMoves.right.score += 55;
                break;
            case "left":
                scoredMoves.left.score += 55;
                break;
            case "up":
                scoredMoves.up.score += 55;
                break;
            case "down":
                scoredMoves.down.score += 55;
                break;
            default:
                break;
        }
    }
}

export const SnakePreferAwayFromOtherSnakeBody = (gs: GameState, snake: Battlesnake, scoredMoves: ScoredMoves) => {
    const opponents = gs.board.snakes;
    const head = snake.body[0];

    for (let i = 0; i < opponents.length; i++){
        if (opponents[i].id != snake.id){
            for (let j = 0; j < opponents[i].length; j++){
                if (head.x + 1 == opponents[i].body[j].x && head.y == opponents[i].body[j].y){
                  scoredMoves.right.score -= 5000;
                }
                if (head.x - 1 == opponents[i].body[j].x && head.y == opponents[i].body[j].y){
                  scoredMoves.left.score -= 5000;
                }
                if (head.x == opponents[i].body[j].x && head.y + 1 == opponents[i].body[j].y){
                  scoredMoves.up.score -= 5000;
                }
                if (head.x == opponents[i].body[j].x && head.y - 1 == opponents[i].body[j].y){
                  scoredMoves.down.score -= 5000;
                }
              }
        }
    }
}

export const SnakePreferAwayFromLargerSnakeHead = (gs: GameState, snake: Battlesnake, scoredMoves: ScoredMoves) => {
    const opponents = gs.board.snakes;
    const head = snake.body[0];

    for (let i = 0; i < opponents.length; i++){
        if (opponents[i].id != snake.id){
            let enemy = opponents[i];
            if (enemy.body.length >= snake.body.length){
                if (head.x + 2 == enemy.head.x && head.y == enemy.head.y){
                  scoredMoves.right.score -= 1550;
                }
          
                if (head.x - 2 == enemy.head.x && head.y == enemy.head.y){
                  scoredMoves.left.score -= 1550;
                }
          
                if (head.x == enemy.head.x && head.y + 2 == enemy.head.y){
                  scoredMoves.up.score -= 1550;
                }
          
                if (head.x == enemy.head.x && head.y -2 == enemy.head.y){
                  scoredMoves.down.score -= 1550;
                }
        
                if (head.x == enemy.head.x + 1 && head.y == enemy.head.y - 1){
                  scoredMoves.up.score -= 1550;
                  scoredMoves.left.score -= 1550;
                }
        
                if (head.x == enemy.head.x - 1 && head.y == enemy.head.y - 1){
                  scoredMoves.up.score -= 1550;
                  scoredMoves.right.score -= 1550;
                }
        
                if (head.x == enemy.head.x + 1 && head.y == enemy.head.y + 1){
                  scoredMoves.down.score -= 1550;
                  scoredMoves.left.score -= 1550;
                }
        
                if (head.x == enemy.head.x - 1 && head.y == enemy.head.y + 1){
                  scoredMoves.down.score -= 1550;
                  scoredMoves.right.score -= 1550;
                }
        
              }
        }
    }
}

export const SnakePreferTowardOwnTail = (gs: GameState, snake: Battlesnake, scoredMoves: ScoredMoves) => {
    const head = snake.body[0];
    const tail = snake.body[snake.body.length - 1];
    const health = snake.health;
    const tailPrefValue = snake.length / 2;

    const directionToTail: string = SnakeGetGeneralDirectionToCoord(snake, tail);

    switch(directionToTail){
        case "right":
          scoredMoves.right.score += tailPrefValue;
          break;
        case "left":
          scoredMoves.left.score += tailPrefValue;
          break;
        case "up":
          scoredMoves.up.score += tailPrefValue;
          break;
        case "down":
          scoredMoves.down.score += tailPrefValue;
          break;
        default:
          break;
      }
    
    if (health > 75){
      switch(directionToTail){
          case "right":
            scoredMoves.right.score += tailPrefValue *2;
            break;
          case "left":
            scoredMoves.left.score += tailPrefValue *2;
            break;
          case "up":
            scoredMoves.up.score += tailPrefValue *2;
            break;
          case "down":
            scoredMoves.down.score += tailPrefValue *2;
            break;
          default:
            break;
      }
    }
}