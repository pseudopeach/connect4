//var game = new C4GameState(7,4);



var tests = [
{name:"player 1 turn", fn:function(){return game.currentTurnTaker == game.players[0];} },

//legal moves
{name:"legal move 1", fn:function(){return game.move(0) == true;} }, //red
{name:"legal move 2", fn:function(){return game.move(1) == true;} }, //y
{name:"legal move 3", fn:function(){return game.move(0) == true;} }, //r
{name:"legal move 4", fn:function(){return game.move(0) == true;} }, //y
{name:"legal move 5", fn:function(){return game.move(0) == true;} }, //r

{name:"player 2 turn", fn:function(){return game.currentTurnTaker == game.players[1];} },

//illegal moves
{name:"out of bounds move", fn:function(){return game.move(10) == false;} },
{name:"full column", fn:function(){return game.move(0) == false;} },

{name:"no winner", fn:function(){return game.winner() == null;} },

{name:"row win", fn:function(){
	var gameW1 = new C4GameState(7,4);
	gameW1.setDebugData(["rryy","ryry","ryry","ryy","r"]);
	gameW1.move(3);
	var wi = gameW1.winner();
	return wi && wi.name == gameW1.players[0].name;
}},

{name:"col win", fn:function(){
	var gameW1 = new C4GameState(7,4);
	gameW1.setDebugData(["rryy","ryry","yyy","rrr","r"]);
	gameW1.move(2);
	var wi = gameW1.winner();
	return wi && wi.name == gameW1.players[1].name;
}},

{name:"d1 win", fn:function(){
	var gameW1 = new C4GameState(7,4);
	gameW1.setDebugData([
		"ryry",
		"yryy",
		"ryry",
		"rry"
	]);
	gameW1.move(3);
	var wi = gameW1.winner();
	return wi && wi.name == gameW1.players[0].name;
}},

{name:"d2 win", fn:function(){
	var gameW1 = new C4GameState(7,4);
	gameW1.setDebugData([
		"ryrr",
		"yry",
		"ryyr",
		"yyry",
		"yrrr",
		"ryry",
		"rry"
	]);
	gameW1.move(1);
	var wi = gameW1.winner();
	return wi && wi.name == gameW1.players[1].name;
}},

];

function runTests(){
	var results = []
	for(var i=0;i<tests.length;i++){
		var result = {name:tests[i].name};
		try{
			result.passed = tests[i].fn.call();
		}catch(e){
			result.passed = false;
			result.error = e;
		}
		results.push(result);
	}
	return results;
}
