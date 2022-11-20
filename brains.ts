import { Coord, GameState, ScoredMoves } from "./types";
import { getClosestFoodCoord, getDistanceBetweenCoords, getGeneralDirectionToCoord } from "./helper";

export const AvoidNeckMoves = (gameState: GameState, scoredMoves: ScoredMoves) => {
// We've included code to prevent your Battlesnake from moving backwards
  const myHead = gameState.you.body[0];
  const myNeck = gameState.you.body[1];

  if (myNeck.x < myHead.x) {        // Neck is left of head, don't move left
    scoredMoves.left.score -= 10000;
  }

  if (myNeck.x > myHead.x) { // Neck is right of head, don't move right
    scoredMoves.right.score -= 10000;
  }

  if (myNeck.y < myHead.y) { // Neck is below head, don't move down
    scoredMoves.down.score -= 10000;
  }

  if (myNeck.y > myHead.y) { // Neck is above head, don't move up
    scoredMoves.up.score -= 10000;
  }
}

export const AvoidOutOfBoundsMoves = (gameState: GameState, scoredMoves: ScoredMoves) => {
    if (gameState.game.ruleset.name != "wrapped"){
      const myHead = gameState.you.body[0];

      const boardWidth = gameState.board.width;
      const boardHeight = gameState.board.height;
    
      if (myHead.x - 1 < 0){
        scoredMoves.left.score -= 1000;
      }
    
      if (myHead.x + 1 >= boardWidth){
        scoredMoves.right.score -= 1000;
      }
    
      if (myHead.y - 1 < 0){
        scoredMoves.down.score -= 1000;
      }
    
      if (myHead.y + 1 >= boardHeight){
        scoredMoves.up.score -= 1000;
      }
    }
    
}

export const AvoidOwnBodyMoves = (gameState: GameState, scoredMoves: ScoredMoves) => {
    const myHead = gameState.you.body[0];
    const myBody = gameState.you.body;

    if (myBody[myBody.length] != myBody[myBody.length-1]){
      for (let i = 0; i < myBody.length - 1; i++){
        if (myHead.x + 1 == myBody[i].x && myHead.y == myBody[i].y){
          
          scoredMoves.right.score -= 1000;
        }
        if (myHead.x - 1 == myBody[i].x && myHead.y == myBody[i].y){
          
          scoredMoves.left.score -= 1000;
        }
        if (myHead.x == myBody[i].x && myHead.y + 1 == myBody[i].y){
          
          scoredMoves.up.score -= 1000;
        }
        if (myHead.x == myBody[i].x && myHead.y - 1== myBody[i].y){
          
          scoredMoves.down.score -= 1000;
        }
      }
    } else {
      for (let i = 0; i < myBody.length; i++){
        if (myHead.x + 1 == myBody[i].x && myHead.y == myBody[i].y){
          
          scoredMoves.right.score -= 1000;
        }
        if (myHead.x - 1 == myBody[i].x && myHead.y == myBody[i].y){
          
          scoredMoves.left.score -= 1000;
        }
        if (myHead.x == myBody[i].x && myHead.y + 1 == myBody[i].y){
          
          scoredMoves.up.score -= 1000;
        }
        if (myHead.x == myBody[i].x && myHead.y - 1== myBody[i].y){
          
          scoredMoves.down.score -= 1000;
        }
      }
    }
    
}

export const PreferTowardsClosestFoodMoves = (gameState: GameState, scoredMoves: ScoredMoves) => {
    let closestFoodCoord = getClosestFoodCoord(gameState);
    const myHead = gameState.you.body[0];

    if (gameState.you.health - 35 < getDistanceBetweenCoords(myHead, closestFoodCoord)){
      switch(getGeneralDirectionToCoord(gameState, closestFoodCoord)){
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

export const StillPreferFoodEvenIfNotStarving = (gs: GameState, moves: ScoredMoves) => {
  const closestFoodCoord = getClosestFoodCoord(gs);
  const myHead = gs.you.body[0];

  const myDistanceToClosestFood = getDistanceBetweenCoords(myHead, closestFoodCoord)

  let meBeClosestToTheFood = true;
  let meBeLongestSnakeOnBoard = true;

  for (let i = 0; i < gs.board.snakes.length; i++){
    if (myDistanceToClosestFood > getDistanceBetweenCoords(gs.board.snakes[i].head, closestFoodCoord)){
      meBeClosestToTheFood = false;
    }
    if(gs.board.snakes[i].body.length > gs.you.body.length){
      meBeLongestSnakeOnBoard = false;
    }
  }

  



  if (meBeClosestToTheFood && !meBeLongestSnakeOnBoard){
    switch(getGeneralDirectionToCoord(gs, closestFoodCoord)){
      case "right":
        moves.right.score += 55;
        break;
      case "left":
        moves.left.score += 55;
        break;
      case "up":
        moves.up.score += 55;
        break;
      case "down":
        moves.down.score += 55;
        break;
      default:
        break;
    }
  }
  
  
}

export const PreferTowardCentreMoves = (gameState: GameState, scoredMoves: ScoredMoves) => {
    const myHead = gameState.you.body[0];
    const boardWidth = gameState.board.width;
    const boardHeight = gameState.board.height;

    let count: number = 0;
    
    if (myHead.x > boardWidth / 2){
        scoredMoves.left.score += myHead.x;
        count++;
      }
    
      if (myHead.x < boardWidth / 2){
        scoredMoves.right.score += boardWidth - myHead.x;
        count++;
      }
    
      if (myHead.y > boardHeight / 2){
        scoredMoves.down.score += boardHeight;
        count++;
      }
    
      if (myHead.y < boardHeight / 2){
        scoredMoves.up.score += boardHeight - myHead.y;
        count++;
      }

      if (count > 1){
        scoredMoves.left.score += count;
        scoredMoves.right.score += count;
        scoredMoves.down.score += count;
        scoredMoves.up.score += count;

      }
}

export const PreferAwayFromOtherSnakeBody = (gameState: GameState, scoredMoves: ScoredMoves) => {
    const opponents = gameState.board.snakes;
    const myHead = gameState.you.body[0];
  
    for (let i = 0; i < opponents.length; i++){
      if(opponents[i].id != gameState.you.id){
        for (let j = 0; j < opponents[i].length; j++){
          if (myHead.x + 1 == opponents[i].body[j].x && myHead.y == opponents[i].body[j].y){
            scoredMoves.right.score -= 500;
          }
          if (myHead.x - 1 == opponents[i].body[j].x && myHead.y == opponents[i].body[j].y){
            scoredMoves.left.score -= 500;
          }
          if (myHead.x == opponents[i].body[j].x && myHead.y + 1 == opponents[i].body[j].y){
            scoredMoves.up.score -= 500;
          }
          if (myHead.x == opponents[i].body[j].x && myHead.y - 1 == opponents[i].body[j].y){
            scoredMoves.down.score -= 500;
          }
        }
      }
    }
}

export const PreferAwayFromLargerSnakeHead = (gs: GameState, moves: ScoredMoves) => {
  const opponents = gs.board.snakes;
  const myHead = gs.you.body[0];

  for (let i = 0; i < opponents.length; i++){
    if(opponents[i].id != gs.you.id){
      let enemy = opponents[i];
      if (enemy.body.length >= gs.you.body.length){
        if (myHead.x + 2 == enemy.head.x && myHead.y == enemy.head.y){
          moves.right.score -= 155;
        }
  
        if (myHead.x - 2 == enemy.head.x && myHead.y == enemy.head.y){
          moves.left.score -= 155;
        }
  
        if (myHead.x == enemy.head.x && myHead.y + 2 == enemy.head.y){
          moves.up.score -= 155;
        }
  
        if (myHead.x == enemy.head.x && myHead.y -2 == enemy.head.y){
          moves.down.score -= 155;
        }

        if (myHead.x == enemy.head.x + 1 && myHead.y == enemy.head.y - 1){
          moves.up.score -= 155;
          moves.left.score -= 155;
        }

        if (myHead.x == enemy.head.x - 1 && myHead.y == enemy.head.y - 1){
          moves.up.score -= 155;
          moves.right.score -= 155;
        }

        if (myHead.x == enemy.head.x + 1 && myHead.y == enemy.head.y + 1){
          moves.down.score -= 155;
          moves.left.score -= 155;
        }

        if (myHead.x == enemy.head.x - 1 && myHead.y == enemy.head.y + 1){
          moves.down.score -= 155;
          moves.right.score -= 155;
        }

      }
      
    }
  }
}

export const PreferTowardOwnTail = (gameState: GameState, scoredMoves: ScoredMoves) => {
    const myHead = gameState.you.body[0];
    const myTail = gameState.you.body[gameState.you.body.length - 1];
    const myHealth = gameState.you.health;
    const tailPrefValue = gameState.you.body.length / 2;

    const directionToTail: string = getGeneralDirectionToCoord(gameState, myTail);
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
    
    if (myHealth > 75){
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

