function addChip(color, slot){
	var stack = $("#board .stack").get(slot);
	var chip = $("<div/>").addClass("chip");
	
	var finalHeight = stack.children.length*50;
	console.log("final height:"+finalHeight);
	
	chip.addClass(color);
	chip.css({bottom:$(stack).height()});
	$(stack).append(chip);
	//$(chip).slideDown();
	$(chip).animate({bottom:finalHeight});
	//$(".stack").append(chip);
}

function emptyStack(stack, n){
	var childs = $(stack).children();
	for(var i=0;i<childs.length;i++){
		if(i < childs.length-1)
			$(childs[i]).delay(100*i).animate({bottom:-500},600);
		else
			$(childs[i]).delay(100*i).animate({bottom:-500},600,function(){
				$(stack).empty();
			});
	}
}

function clearBoard(e){
	$("#board .stack").each(function(){emptyStack(this);});
}

function showTurnPrompt(game){
	var playerInfo = game.currentTurnTaker();
	$("#banner h2").text(playerInfo.name+"'s turn" );
	$("#banner h2").css({color:playerInfo.textColor});
}

function announceResult(game){
	var playerInfo = game.winner();
	var splashMessage = playerInfo.hasOwnProperty("name") ?
		playerInfo.name + "'s Wins!!!" :
		"Tie Game";
	
	$("#splash").fadeIn();
	$("#splash").delay(2000).fadeOut();
	
	$("#banner h2").text("Game Over");
	$("#banner h2").css({color:'white'});
	
	$("#splash h1").text(splashMessage);
	$("#splash h1").css({color:playerInfo.textColor});
	$("#splash h1").css({'margin-top':-200});
	$("#splash h1").delay(400).animate({'margin-top':300});
	
}

function setButtonStates(game, openStacks){
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
	var game = new C4GameState(7,6);
	game.subscribe(C4GameState.CHIP_ADDED, function(e){ addChip(e.chipColor, e.slotId); });
	game.subscribe(C4GameState.RESET, function(e){ clearBoard(); });
	game.subscribe(C4GameState.GAME_OVER, function(e){ announceResult(this); });
	game.subscribe(C4GameState.PLAYER_TURN, function(e){ showTurnPrompt(this); });
	game.subscribe(C4GameState.STACKS_UPDATE, function(e){ setButtonStates(this,e); });
	
	//var buttons = $("#columnButtons button");
	for(var i=0;i<game.stacks.length;i++){
		var button = $("<button/>");
		button.click(makeClickHandler(game,i));
		$("#columnButtons").append(button);
	}
	$("#resetButton").click(function(){game.reset()});
	
});