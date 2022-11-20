import { AvoidNeckMoves, AvoidOutOfBoundsMoves, AvoidOwnBodyMoves, PreferAwayFromLargerSnakeHead, PreferAwayFromOtherSnakeBody, PreferTowardCentreMoves, PreferTowardOwnTail, PreferTowardsClosestFoodMoves, StillPreferFoodEvenIfNotStarving } from './brains';
import { foodNodeMap, hazNodeMap, initNodeMap, snakeNodeMap } from './flood';
import { getHighScoreMove, generateRandomHexColor, CountOpenSquares, CountOpenNodes } from './helper';
import { PreferNotSaucyMoves } from './sauce';
import runServer from './server';
import { Coord, FCoordStatus, GameState, InfoResponse, MoveResponse, ScoredMoves } from './types';


export const basicTurn = (gs: GameState, sm: ScoredMoves, nm: Map<string, FCoordStatus>): ScoredMoves => {
    
    //
    //  AvoidNeckMoves
    //  Updates 'neck move' direction with -10000 score (the move is never preferred)
    
    AvoidNeckMoves(gs, sm);
    
    //
    //  Avoid OutOfBoundsMoves
    //  Updates out of bounds moves with -10000 score (the move is never preferred)
    //  Note: only applies in non-wrapped game modes
    
    AvoidOutOfBoundsMoves(gs, sm);
    
    //
    //  AvoidOwnBodyMoves
    //  Updates moves that will collide with our own body with -1000 score.
    //  Note: tries to account for scenario where we just ate and tail won't move

    AvoidOwnBodyMoves(gs, sm);
    
    //
    //  PreferTowardCentreMoves
    //  Updates moves with a slight preference if they are toward the center of the board
    //  Currently disabled, needs further thought.
    
    //PreferTowardCentreMoves(gs, sm);

    //
    //  PreferTowardsClosestFoodMoves
    //  Updates moves with a +100 weight if they are in the general direction of
    //  closest food to your head.
    //  TODO:   Maybe the weight should be adjusted based on missing health.
    //  Note:   Currently triggers based on missing health vs distance to closest food.
    //  TODO:   Improve with pathfinding from anti-blobby so that we don't try to
    //          travel straight through snake bodies to get to food.

    PreferTowardsClosestFoodMoves(gs, sm);
    
    //
    //  PreferFoodEvenIfNotStarving
    //  Adds some weight to the closest food move even when the snake isn't below threshold
    //  for above function to trigger.
    //  Note: only applies weight if you are the closest snake to the food
    //  Note: only applies weight if you are NOT currently the longest snake on board
    //  Conditions should perhaps be reconsidered.
    //  TODO: update so pathfinding works like TODO above

    StillPreferFoodEvenIfNotStarving(gs, sm);
    
    //
    //  PreferAwayFromOtherSnakeBody
    //  Adds weight to prevent us from colliding with other snakes body (currently upped to -500)
    //  TODO: May need to tune this weight further.

    PreferAwayFromOtherSnakeBody(gs, sm)
    
    //
    //  PreferNotSaucyMoves
    //  Adds weight to prefer not moving into the sauce.
    //  TODO: Adjust weight calculation (based on hazard damage?)

    
    PreferNotSaucyMoves(gs, sm)

    //
    //  PreferTowardOwnTail
    //  Adds some weight toward the moves in the general direction of our
    //  own tail.  Adds double the weight if we have more than 75 health.
    //  TODO:   Figure out parameters for weight toward tail
    //  TODO:   Are there other conditions to think about here?
    PreferTowardOwnTail(gs, sm);

    //
    //  PreferAwayFromLargerSnakeHead
    //  Adds weight to various particular sets of moves that would lead us
    //  into the proximity of a larger snake's head
    //  TODO:   add any more dangerous coords as they come up

    PreferAwayFromLargerSnakeHead(gs, sm);

    //
    //  CountOpenNodes
    //  New Flood fill algo with FCOORD datatype
    //  TODO:   implement flag to determine whether a coord has or has not been
    //  searched in a particular direction
    //  TODO:   implement next iteration so we can search backward behind ourselves
    //          and around corners
    CountOpenNodes(gs, nm, sm);

    
    return sm;
}