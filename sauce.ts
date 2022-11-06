import { transpileModule } from "typescript";
import { GameState, ScoredMoves, Coord } from "./types"
import { FindNextCoord } from "./helper";

export const PreferNotSaucyMoves = (gs: GameState, moves: ScoredMoves) => {
    const myHead: Coord = gs.you.body[0];
    const hazards = gs.board.hazards;

    if (hazards.length > 0) {
        for(let i = 0; i < hazards.length; i++){
            if(myHead.x - 1 == hazards[i].x && myHead.y == hazards[i].y){
                moves.left.score -= 50;
            }
            if(myHead.x + 1 == hazards[i].x && myHead.y == hazards[i].y){
                moves.right.score -= 50;
            }
            if(myHead.x == hazards[i].x && myHead.y + 1 == hazards[i].y){
                moves.up.score -= 50;
            }
            if(myHead.x == hazards[i].x && myHead.y - 1 == hazards[i].y){
                moves.down.score -= 50;
            }
        }
    }
}

export const CheckIfCurrentlyInSauce = (gs: GameState): boolean => {
    const myHead = gs.you.body[0];
    const hazards = gs.board.hazards;

    for (let i = 0; i < hazards.length; i++){
        if (hazards[i].x == myHead.x && hazards[i].y == myHead.y){
            return true;
        }
    }

    return false;
}

export const MoveOutOfSauce = (gs: GameState, moves: ScoredMoves): void => {
    const myHead = gs.you.body[0];
    const hazards = gs.board.hazards;

    for (let i = 0; i < hazards.length; i++){
        if (FindNextCoord(gs, "left", myHead) == hazards[i]) {
			moves.left.score -= 75
		}
		if (FindNextCoord(gs, "right", myHead) == hazards[i]) {
			moves.right.score -= 75
		}
		if (FindNextCoord(gs, "up", myHead) == hazards[i]) {
			moves.up.score -= 75
		}
		if (FindNextCoord(gs, "down", myHead) == hazards[i]) {
			moves.down.score -= 75
		}
    }

}