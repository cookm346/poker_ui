const hand_num = document.getElementById('hand_num');
const card = document.getElementById('our_card');
const winnings = document.getElementById('winnings');
const pot = document.getElementById('pot');
const last_action = document.getElementById('last_action');

const ante_size = 1;
const bet_size = 2;

var chips = 100;
var opp_chips = 100;
var n = 1;
var win_amount = 0;
var current_winnings = 0;
var won_hand = "won";
var pot_size = ante_size*2;
var last = "";
var hand_history = "";


var in_position = false;

var weights = {"1": [0.7728943404731482, 0.22710565952685188],
"10": [0.13607270123898776, 0.8639272987610123],
"10b": [6.508891145304485E-7, 0.9999993491108855],
"10p": [1.301778229060897E-6, 0.9999986982217709],
"10pb": [2.390109351615811E-6, 0.9999976098906483],
"11": [0.6328112766369216, 0.3671887233630784],
"11b": [6.496881496881497E-7, 0.9999993503118503],
"11p": [6.496881496881497E-7, 0.9999993503118503],
"11pb": [2.7317946638833944E-6, 0.9999972682053362],
"12": [0.9500078360262004, 0.04999216397379956],
"12b": [6.493371566305116E-7, 0.9999993506628434],
"12p": [4.622166837357221E-6, 0.9999953778331626],
"12pb": [3.4225940150501274E-7, 0.9999996577405985],
"13": [0.09119595425907032, 0.9088040457409298],
"13b": [6.500496637943139E-7, 0.9999993499503362],
"13p": [8.450645629326081E-6, 0.9999915493543706],
"13pb": [3.5649167464973205E-6, 0.9999964350832535],
"1b": [0.9999993500931317, 6.499068683457661E-7],
"1p": [7.379429556015653E-4, 0.9992620570443984],
"1pb": [0.9999995793086556, 4.206913443849432E-7],
"2": [0.7123095579654501, 0.28769044203454985],
"2b": [0.9999959344051628, 4.065594837253654E-6],
"2p": [0.009012664902454516, 0.9909873350975456],
"2pb": [0.9999995449192677, 4.550807322764535E-7],
"3": [0.4218976667611626, 0.5781023332388373],
"3b": [0.9999949744088932, 5.025591106926514E-6],
"3p": [0.9896076041377059, 0.010392395862294122],
"3pb": [0.9987518722380367, 0.0012481277619633868],
"4": [0.9999978877340391, 2.112265960931529E-6],
"4b": [0.6587124924955705, 0.34128750750442943],
"4p": [0.999969118185402, 3.088181459792909E-5],
"4pb": [0.9545894660573385, 0.0454105339426615],
"5": [0.9999978907116025, 2.1092883974859877E-6],
"5b": [0.8205747389042822, 0.1794252610957178],
"5p": [0.9985341801663848, 0.0014658198336151187],
"5pb": [0.5922998329503559, 0.4077001670496441],
"6": [0.9999923805606947, 7.619439305182433E-6],
"6b": [0.8270181226160073, 0.1729818773839928],
"6p": [0.9999909051458684, 9.09485413153238E-6],
"6pb": [0.5957385342802941, 0.404261465719706],
"7": [0.9933413796388126, 0.006658620361187266],
"7b": [0.3554659875052318, 0.6445340124947683],
"7p": [0.9999865814832426, 1.3418516757352291E-5],
"7pb": [0.7120445536945107, 0.2879554463054892],
"8": [0.9999581363726602, 4.186362733978342E-5],
"8b": [0.74227183415633, 0.25772816584367],
"8p": [0.9999954431533379, 4.55684666210982E-6],
"8pb": [0.7840048035948114, 0.2159951964051885],
"9": [0.9997401999637454, 2.5980003625463956E-4],
"9b": [0.5923126464571746, 0.40768735354282526],
"9p": [0.9993960474008051, 6.039525991948205E-4],
"9pb": [0.13711710019197942, 0.8628828998080206]}

var shuffled_cards = shuffle();

card.innerHTML = "<img src='https://raw.githubusercontent.com/cookm346/poker_ui/master/images/" + shuffled_cards[0] + ".png'>";
//card.innerText = shuffled_cards[0];

winnings.innerText = "Winnings: " + win_amount;
pot.innerText = 'Pot size: ' + pot_size;
hand_num.innerText = "Hand number: " + n;
last_action.innerText = "History: " + hand_history;


function shuffle(){
	var cards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
	
	for(var i = cards.length - 1; i > 0; i--){
		var index = Math.floor(Math.random() * (i + 1));
		var tmp = cards[index];
		cards[index] = cards[i];
		cards[i] = tmp;
	}
	return cards;
}

function update_history(action){
	hand_history += action;
	last_action.innerText = "History: " + hand_history;
	if(action === "b")
		pot_size += bet_size;
	pot.innerText = 'Pot size: ' + pot_size;
	winnings.innerText = "Winnings: " + win_amount;
	hand_num.innerText = "Hand number: " + n;
	
	if(hand_over()){
		var ai_card = shuffled_cards[1];
		if(ai_card == 10){
			ai_card = "J";
		} else if(ai_card == 11){
			ai_card = "Q";
		} else if(ai_card == 12){
			ai_card = "K";
		} else if (ai_card == 13) {
			ai_card = "A";
		} else {
			ai_card++;
		}
		alert("Hand over! AI had: " + ai_card + ". You " + won_hand + " " + Math.abs(current_winnings));
		clear_history();
	} else {
		var ai_move = ai_action();
		hand_history += ai_move;
		last_action.innerText = "History: " + hand_history;
		if(ai_move === "b")
			pot_size += bet_size;
		pot.innerText = 'Pot size: ' + pot_size;
		winnings.innerText = "Winnings: " + win_amount;
		hand_num.innerText = "Hand number: " + n;
		if(hand_over()){
			var ai_card = shuffled_cards[1];
			if(ai_card == 10){
				ai_card = "J";
			} else if(ai_card == 11){
				ai_card = "Q";
			} else if(ai_card == 12){
				ai_card = "K";
			} else if (ai_card == 13) {
				ai_card = "A";
			} else {
			ai_card++;
		}
		alert("Hand over! AI had: " + ai_card + ". You " + won_hand + " " + Math.abs(current_winnings));
		clear_history();
		}
	}
}

function clear_history(){
	shuffled_cards = shuffle();
	card.innerHTML = "<img src='https://raw.githubusercontent.com/cookm346/poker_ui/master/images/" + shuffled_cards[0] + ".png'>";
	in_position = !in_position;
	hand_history = "";
	last_action.innerText = "History: " + hand_history;
	pot_size = ante_size*2;
	pot.innerText = 'Pot size: ' + pot_size;
	winnings.innerText = "Winnings: " + win_amount;
	n++;
	hand_num.innerText = "Hand number: " + n;
	if(in_position){
		var ai_move = ai_action();
		hand_history += ai_move;
		last_action.innerText = "History: " + hand_history;
		if(ai_move === "b")
			pot_size += bet_size;
		pot.innerText = 'Pot size: ' + pot_size;
	}
}

function ai_action(){
	if(Math.random() < weights[shuffled_cards[1] + hand_history][0]){
		return "p";
	} else {
		return "b";
	}
}

function hand_over(){
	current_winnings = 0;
	if(hand_history.length > 1){
		if(hand_history.charAt(hand_history.length - 1) === "p"){
			if(hand_history === "pp"){
				shuffled_cards[0] > shuffled_cards[1] ? current_winnings = ante_size : current_winnings = -ante_size;
			} else if (hand_history === "pbp"){
				current_winnings = in_position ? ante_size : -ante_size;
			} else {  //bp
				current_winnings = !in_position ? ante_size : -ante_size;
			}
			won_hand = current_winnings > 0 ? "won" : "lost";
			win_amount += current_winnings;
			return true;
		} else if (hand_history.substring(hand_history.length - 2) === "bb"){
			if(shuffled_cards[0] > shuffled_cards[1]){
				current_winnings = ante_size + bet_size;
			} else {
				current_winnings = -1 * (ante_size + bet_size);
			}
			won_hand = current_winnings > 0 ? "won" : "lost";
			win_amount += current_winnings;
			return true;
		}
	}
	return false;
}











