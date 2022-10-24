// Welcome to
// __________         __    __  .__                               __
// \______   \_____ _/  |__/  |_|  |   ____   ______ ____ _____  |  | __ ____
//  |    |  _/\__  \\   __\   __\  | _/ __ \ /  ___//    \\__  \ |  |/ // __ \
//  |    |   \ / __ \|  |  |  | |  |_\  ___/ \___ \|   |  \/ __ \|    <\  ___/
//  |________/(______/__|  |__| |____/\_____>______>___|__(______/__|__\\_____>
//
// This file can be a nice home for your Battlesnake logic and helper functions.
//
// To get you started we've included code to prevent your Battlesnake from moving backwards.
// For more info see docs.battlesnake.com

import { AvoidNeckMoves, AvoidOutOfBoundsMoves, AvoidOwnBodyMoves, PreferAwayFromOtherSnakeBody, PreferTowardCentreMoves, PreferTowardOwnTail, PreferTowardsClosestFoodMoves } from './brains';
import { getClosestFoodCoord, getGeneralDirectionToCoord, getHighScoreMove, } from './helper';
import runServer from './server';
import { GameState, InfoResponse, MoveResponse, ScoredMoves } from './types';

// info is called when you create your Battlesnake on play.battlesnake.com
// and controls your Battlesnake's appearance
// TIP: If you open your Battlesnake URL in a browser you should see this data
function info(): InfoResponse {
  console.log("INFO");

  return {
    apiversion: "1",
    author: "uncleBlobby",       // TODO: Your Battlesnake Username
    color: "#888888", // TODO: Choose color
    head: "default",  // TODO: Choose head
    tail: "default",  // TODO: Choose tail
  };
}

// start is called when your Battlesnake begins a game
function start(gameState: GameState): void {
  console.log("GAME START");
}

// end is called when your Battlesnake finishes a game
function end(gameState: GameState): void {
  //console.log(gameState);
  console.log("GAME OVER\n");
}

// move is called on every turn and returns your next move
// Valid moves are "up", "down", "left", or "right"
// See https://docs.battlesnake.com/api/example-move for available data
function move(gameState: GameState): MoveResponse {

  let isMoveSafe: { [key: string]: boolean; } = {
    up: true,
    down: true,
    left: true,
    right: true
  };

  let scoredMoves: ScoredMoves = {  left:   {direction: "left",   score: 0}, 
                                    right:  {direction: "right",  score: 0},
                                    up:     {direction: "up",     score: 0},
                                    down:   {direction: "down",   score: 0}}



  AvoidNeckMoves(gameState, scoredMoves);
  AvoidOutOfBoundsMoves(gameState, scoredMoves);
  AvoidOwnBodyMoves(gameState, scoredMoves);
  PreferTowardCentreMoves(gameState, scoredMoves);
  PreferTowardsClosestFoodMoves(gameState, scoredMoves);
  PreferAwayFromOtherSnakeBody(gameState, scoredMoves);
  PreferTowardOwnTail(gameState, scoredMoves);

  // TODO: Step 3 - Prevent your Battlesnake from colliding with other Battlesnakes




  // Are there any safe moves left?
  const safeMoves = Object.keys(isMoveSafe).filter(key => isMoveSafe[key]);

  console.log(scoredMoves);

  /*
  if (safeMoves.length == 0) {
    console.log(`MOVE ${gameState.turn}: No safe moves detected! Moving down`);
    return { move: "down" };
  }
  */

  // Choose a random move from the safe moves
  const nextMove = getHighScoreMove(scoredMoves);

  // TODO: Step 4 - Move towards food instead of random, to regain health and survive longer
  // food = gameState.board.food;

  console.log(`MOVE ${gameState.turn}: ${nextMove}`)
  return { move: nextMove };
}

runServer({
  info: info,
  start: start,
  move: move,
  end: end
});