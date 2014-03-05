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
	$("#board").children().each(function(){emptyStack(this);});
}

function showTurnPrompt(game){
	var playerInfo = game.currentTurnTaker();
	$("#banner").text(playerInfo.name+"'s turn" );
	$("#banner").css({color:playerInfo.color});
}

function announceWinner(game){
	var playerInfo = game.winner();
	$("#splash").text(playerInfo.name+" wins!!" );
	$("#splash").css({color:playerInfo.color});
	$("#splash").fadeIn();
	$("#splash").css({margin-top:-20)
	$("#splash").delay(200).animate({margin-top:300});
	$("#splash").delay(2000).fadeOut();
}

function setButtonStates(game){
	
}


$(document).ready(function(){
	var game = new C4GameState(7,6);
	
	game.subscribe(C4GameState.CHIP_ADDED, function(e){ addChip(e.chipColor, e.slotId); });
	game.subscribe(C4GameState.RESET, function(e){ clearBoard(); });
	game.subscribe(C4GameState.GAME_OVER, function(e){ announceWinner(game); });
	game.subscribe(C4GameState.PLAYER_TURN, function(e){ showTurnPrompt(game); });
	game.subscribe(null, function(e){ setButtonStates(game); });
	
});