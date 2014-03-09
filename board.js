function addChip(color, slot){
	var stack = $("#board .stack").get(slot);
	var chip = $("<div/>").addClass("chip");
	
	//calculates final vertical position
	var finalHeight = stack.children.length*95 + 18;
	
	//configures piece
	chip.addClass(color);
	chip.css({bottom:$(stack).height()});
	$(stack).append(chip);
	
	//starts animation
	$(chip).animate({bottom:finalHeight});
}

///empties a single stack of chips in an animation
function emptyStack(stack, button){
	$(button).prop("disabled","disabled");
	var childs = $(stack).children();
	for(var i=0;i<childs.length;i++){
		if(i < childs.length-1)
			$(childs[i]).delay(100*i+Math.random(10)).animate({bottom:-500},600);
		else
			$(childs[i]).delay(100*i+11).animate({bottom:-500},600,function(){
				$(stack).empty();
				$(button).prop("disabled",null); //re-enable button after animation finishes
			});
	}
}

///empties all stacks
function clearBoard(e){
	var stacks = $("#board .stack");
	var buttons = $("#columnButtons button");
	for(var i=0;i<stacks.length;i++)
		emptyStack(stacks[i], buttons[i]);
}

function showTurnPrompt(game){
	var playerInfo = game.currentTurnTaker();
	$("#banner h2").text(playerInfo.name+"'s turn" );
	$("#banner h2").css({color:playerInfo.textColor});
}

function announceResult(game){
	var playerInfo = game.winner();
	var splashMessage = playerInfo.hasOwnProperty("name") ?
		playerInfo.name + " Wins!!!" :
		"Tie Game";
	
	//splash fadein / fade out
	$("#splash").fadeIn();
	$("#splash").delay(2000).fadeOut();
	
	//banner text
	$("#banner h2").text("Game Over");
	$("#banner h2").css({color:'white'});
	
	//splash text / animation
	$("#splash h1").text(splashMessage);
	$("#splash h1").css({color:playerInfo.textColor});
	$("#splash h1").css({'margin-top':-200});
	$("#splash h1").delay(400).animate({'margin-top':350});
	
}

function setButtonStates(openStacks){
	if(!openStacks.hasOwnProperty("length")){
		$("#columnButtons button").prop("disabled",openStacks ? null : "disabled");
		return;
	}
	var buttons = $("#columnButtons button");
	for(var i=0;i<openStacks.length;i++){
		$(buttons[i]).prop("disabled",openStacks[i] ? null : "disabled");
	}
}

function makeClickHandler(game, i){
	return function(e){
		game.move(i);
	}
}

$(document).ready(function(){
	//configure game state object 
	var game = new C4GameState(7,6);
	game.players = [
		{name:"Player 1", colorClass:"red", textColor:"#d34757"},
		{name:"Player 2", colorClass:"yellow", textColor:"#ffff00"}
	];
	
	//set subscriptions to all relivant game event streams
	game.subscribe(C4GameState.CHIP_ADDED, function(e){ addChip(e.chipColor, e.slotId); });
	game.subscribe(C4GameState.RESET, function(e){ clearBoard(); });
	game.subscribe(C4GameState.GAME_OVER, function(e){ announceResult(this); });
	game.subscribe(C4GameState.PLAYER_TURN, function(e){ showTurnPrompt(this); });
	game.subscribe(C4GameState.STACKS_UPDATE, function(e){ setButtonStates(e); });
	
	//creates column buttons
	for(var i=0;i<game.stacks.length;i++){
		var button = $("<button/>");
		button.click(makeClickHandler(game,i));
		$("#columnButtons").append(button);
	}
	$("#resetButton").click(function(){game.reset()});
	
});