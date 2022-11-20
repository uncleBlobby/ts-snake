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

import { AvoidNeckMoves, AvoidOutOfBoundsMoves, AvoidOwnBodyMoves, PreferAwayFromLargerSnakeHead, PreferAwayFromOtherSnakeBody, PreferTowardCentreMoves, PreferTowardOwnTail, PreferTowardsClosestFoodMoves, StillPreferFoodEvenIfNotStarving } from './brains';
import { foodNodeMap, hazNodeMap, initNodeMap, snakeNodeMap } from './flood';
import { getHighScoreMove, generateRandomHexColor, CountOpenSquares, CountOpenNodes } from './helper';
import { PreferNotSaucyMoves } from './sauce';
import runServer from './server';
import { basicTurn } from './turn';
import { Coord, FCoordStatus, GameState, InfoResponse, MoveResponse, ScoredMoves } from './types';

// info is called when you create your Battlesnake on play.battlesnake.com
// and controls your Battlesnake's appearance
// TIP: If you open your Battlesnake URL in a browser you should see this data
function info(): InfoResponse {
  console.log("INFO");

  const hexColor = generateRandomHexColor();

  return {
    apiversion: "1",
    author: "uncleBlobby",       // TODO: Your Battlesnake Username
    color: hexColor, // TODO: Choose color
    head: "iguana",  // TODO: Choose head
    tail: "iguana",  // TODO: Choose tail
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

  //  TODO: implement logic in such a way that we can run a
  //        'basicTurn' function for each snake in the game
  //        and associate their scoredMoves with each snakeID.
  //  THEN: implement a function that updates the gameState with
  //        each snake's 'predicted' move and iterate again

  let nodeMap: Map<string, FCoordStatus> = initNodeMap(gameState);
  nodeMap = snakeNodeMap(gameState, nodeMap);
  nodeMap = foodNodeMap(gameState, nodeMap);
  nodeMap = hazNodeMap(gameState, nodeMap);

  let scoredMoves: ScoredMoves = {  left:   {direction: "left",   score: 0}, 
                                    right:  {direction: "right",  score: 0},
                                    up:     {direction: "up",     score: 0},
                                    down:   {direction: "down",   score: 0}};

  
  scoredMoves = basicTurn(gameState, scoredMoves, nodeMap)  
  
  // Choose the highest scored move and send response
  const nextMove = getHighScoreMove(scoredMoves);

  console.log(`MOVE ${gameState.turn}: ${nextMove}`)
  return { move: nextMove };
}

runServer({
  info: info,
  start: start,
  move: move,
  end: end
});
