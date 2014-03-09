(function(window){

C4GameState.CHIP_ADDED = "chipAdded";
C4GameState.RESET = "reset";
C4GameState.GAME_OVER = "gameOver";
C4GameState.PLAYER_TURN = "playerTurn";
C4GameState.STACKS_UPDATE = "stacksUpdate";

function C4GameState(nstacks, depth){
	this.stacks = [];
	for(var i=0;i<nstacks;i++)
		this.stacks.push([]);
	
	this.players = [
		{name:"Player 1", colorClass:"red", textColor:"#ff0000"},
		{name:"Player 2", colorClass:"yellow", textColor:"#ffff00"}
	];
	this.stackDepth = depth;
	this.gameWinner = null;
}

///Adds a chip to the board at the top of stack [stackIndex]. Returns true if the move was committed.
C4GameState.prototype.move = function(stackIndex){
	console.log("adding chip at:"+stackIndex);
	
	//validation
	if(this.gameWinner) return false;
	if(stackIndex >= this.stacks.length || stackIndex < 0)
		return false;
	var stack = this.stacks[stackIndex];
	if(stack.length >= this.stackDepth)
		return false;
	//actual move	
	var tt = this.currentTurnTaker();
	stack.push(tt);
	this.publish(C4GameState.CHIP_ADDED, {chipColor:tt.colorClass, slotId:stackIndex});
	
	//aftermath
	var winner;
	if(winner = this.isWinningMove(stackIndex)){
		this.gameWinner = winner;
		this.publish(C4GameState.GAME_OVER, winner);
		return true;
	}
	
	var openStacks = this.openStacks();
	var anyOpen = false;
	openStacks.forEach(function(v){anyOpen = anyOpen || v});
	this.publish(C4GameState.STACKS_UPDATE, openStacks);
	if(!anyOpen){
		this.gameWinner = "tie";
		this.publish(C4GameState.GAME_OVER, "tie");
	}else
		this.publish(C4GameState.PLAYER_TURN);
				
	return true;
}

/// Returns the player object of the player whose turn it is.
C4GameState.prototype.currentTurnTaker = function(){
	var balance = 0;
	var firstPlayer = this.players[0];
	this.stacks.forEach(function(stack) {
		stack.forEach(function(chip){
			balance += (chip == firstPlayer) ? 1 : -1;
		});
	});
	
	return this.players[balance % this.players.length];
}

///looks for a winner in a single run of slots, given a start point and a direction
C4GameState.prototype.checkRun = function(i,j,iStep,jStep){
	var run = 0;
	var last = this.stacks[i][j];
	var reverse = false;
	while(dist < 4 && i >=0 && i<this.stacks.length && j<this.stacks[i].length && j >= 0){
		if(this.stacks[i][j] == last){
			run++;
			if(run == 4) return last;
		}else{
			if(reverse) return null;
			iStep *= -1;
			jStep *= -1;
		}
		i += iStep;
		j += jStep;
		dist++;
	}

	return null;	
}

C4GameState.prototype.checkRun = function(i,j,iStep,jStep){
	var color = this.stacks[i][j];
	var length = 1;
	var reversed = false;
	
	do{
		i += iStep;
		j += jStep;
		if(i >=0 && i<this.stacks.length && j<this.stacks[i].length && j >= 0 && this.stacks[i][j] == color){
			length++;
			if(length >= 4) return true;
		}else{
			if(reversed) return false;
			length = 0;
			iStep *= -1;
			jStep *= -1;
			reversed = true;
		}
	}while(true)
}

/// Checks if anyone has won the game by placing a chip at [stackIndex], returns the winner or null
C4GameState.prototype.isWinningMove = function(stackIndex){
	var stack = this.stacks[stackIndex];
	var height = this.stacks[stackIndex].length - 1;
	//console.log("wtf:"+ this.stacks[stackIndex].length +" "+height);
	var move = this.stacks[stackIndex][height];
	
	//check all four directions
	if(this.checkRun(stackIndex, height, -1, -1)) return move;	//SW
	if(this.checkRun(stackIndex, height, 0, -1)) return move; 	//S
	if(this.checkRun(stackIndex, height, 1, -1)) return move;	//SE
	if(this.checkRun(stackIndex, height, 1, 0)) return move;	//E
	
	return null;
}

/// Returns the winner of this game, if any.
C4GameState.prototype.winner = function(){
	return this.gameWinner;
}

/// Returns an array of boolean values, indicating whether a new chip is allowed in each column.
C4GameState.prototype.openStacks = function(){
	var output = [];
	for(var i=0;i<this.stacks.length;i++){
		output.push(this.stacks[i].length < this.stackDepth);
	}
	return output;
}

/// Starts a new game. Clears the board.
C4GameState.prototype.reset = function(){
	this.stacks.forEach(function(stack){
		stack.length = 0;
	});
	this.gameWinner = null;
	
	this.publish(C4GameState.RESET);
	this.publish(C4GameState.STACKS_UPDATE, this.openStacks());
	this.publish(C4GameState.PLAYER_TURN);
}

/// Forces a specific configuration of chips into the board.
C4GameState.prototype.forceState = function(input){
	var playerH = {r: this.players[0], y: this.players[1]};
	for(var i=0;i<input.length;i++){
		var chips = input[i].split('');
		var stack = this.stacks[i];
		chips.forEach(function(chipChar){
			stack.push(playerH[chipChar]);
		});
	}
	console.log("forced:"+this.openStacks());
}

// ================ publish / subscribe ================

var subscriptions = new Object();
C4GameState.prototype.subscribe = function(mtype, callback){
	if(!subscriptions.hasOwnProperty(mtype))
		subscriptions[mtype] = [];
	subscriptions[mtype].push({callback:callback});
}
C4GameState.prototype.publish = function(mtype, obj){
	var subs = subscriptions[mtype];
	var game = this;
	if(!subs) return;
	
	subs.forEach(function(sub) {
    	sub.callback.call(game,obj);
	});
}


window.C4GameState = C4GameState;
	
}(window));
