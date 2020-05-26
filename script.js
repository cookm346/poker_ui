const hand_num = document.getElementById('hand_num');
const card = document.getElementById('our_card');
const winnings = document.getElementById('winnings');
const pot = document.getElementById('pot');
const last_action = document.getElementById('last_action');

const ante_size = 1;
const bet_size = 2;
const raise_size = 6;

var n = 1;
var win_amount = 0;
var current_winnings = 0;
var won_hand = "won";
var pot_size = ante_size*2;
var hand_history = "";
var in_position = false;

var weights = {"10": [0.999956, 0.000044],
"10b": [0.397868, 0.498905, 0.103226],
"10br": [0.962471, 0.037529],
"10p": [0.999986, 0.000014],
"10pb": [0.997378, 0.002355, 0.000268],
"10pbr": [0.925413, 0.074587],
"11": [0.999995, 0.000005],
"11b": [0.010676, 0.970481, 0.018844],
"11br": [0.978401, 0.021599],
"11p": [0.760017, 0.239983],
"11pb": [0.000005, 0.999557, 0.000438],
"11pbr": [0.847462, 0.152538],
"12": [0.945193, 0.054807],
"12b": [0.000000, 0.999971, 0.000029],
"12br": [0.970961, 0.029039],
"12p": [0.000000, 1.000000],
"12pb": [0.000000, 0.999948, 0.000052],
"12pbr": [0.705133, 0.294867],
"13": [0.566766, 0.433234],
"13b": [0.000000, 0.999886, 0.000114],
"13br": [0.998353, 0.001647],
"13p": [0.000000, 1.000000],
"13pb": [0.000000, 0.999987, 0.000013],
"13pbr": [0.384506, 0.615494],
"14": [0.270042, 0.729958],
"14b": [0.000000, 0.000000, 1.000000],
"14br": [0.000000, 1.000000],
"14p": [0.000000, 1.000000],
"14pb": [0.000000, 0.000000, 1.000000],
"14pbr": [0.000000, 1.000000],
"2": [0.698966, 0.301034],
"2b": [1.000000, 0.000000, 0.000000],
"2br": [0.999999, 0.000001],
"2p": [0.000034, 0.999966],
"2pb": [1.000000, 0.000000, 0.000000],
"2pbr": [1.000000, 0.000000],
"3": [0.693457, 0.306543],
"3b": [1.000000, 0.000000, 0.000000],
"3br": [1.000000, 0.000000],
"3p": [0.380265, 0.619735],
"3pb": [1.000000, 0.000000, 0.000000],
"3pbr": [1.000000, 0.000000],
"4": [0.999806, 0.000194],
"4b": [0.948113, 0.038845, 0.013042],
"4br": [0.999497, 0.000503],
"4p": [0.999985, 0.000015],
"4pb": [0.645749, 0.317352, 0.036899],
"4pbr": [0.997824, 0.002176],
"5": [1.000000, 0.000000],
"5b": [0.973667, 0.001264, 0.025069],
"5br": [0.500000, 0.500000],
"5p": [0.999991, 0.000009],
"5pb": [0.994492, 0.003957, 0.001551],
"5pbr": [0.996293, 0.003707],
"6": [1.000000, 0.000000],
"6b": [0.644678, 0.177048, 0.178274],
"6br": [0.143836, 0.856164],
"6p": [0.999997, 0.000003],
"6pb": [0.842967, 0.155827, 0.001206],
"6pbr": [0.652520, 0.347480],
"7": [0.998847, 0.001153],
"7b": [0.816468, 0.160827, 0.022705],
"7br": [0.999915, 0.000085],
"7p": [1.000000, 0.000000],
"7pb": [0.558818, 0.438700, 0.002483],
"7pbr": [0.286155, 0.713845],
"8": [1.000000, 0.000000],
"8b": [0.647956, 0.338064, 0.013980],
"8br": [0.204648, 0.795352],
"8p": [1.000000, 0.000000],
"8pb": [0.252759, 0.741388, 0.005853],
"8pbr": [0.500000, 0.500000],
"9": [1.000000, 0.000000],
"9b": [0.559532, 0.433916, 0.006553],
"9br": [0.069079, 0.930921],
"9p": [0.999999, 0.000001],
"9pb": [0.600751, 0.340032, 0.059217],
"9pbr": [0.956028, 0.043972]}

var shuffled_cards = shuffle();

card.innerHTML = "<img src='https://raw.githubusercontent.com/cookm346/poker_ui/master/images/" + (shuffled_cards[0]-1) + ".png'>";
//card.innerText = shuffled_cards[0];

winnings.innerText = "Winnings: " + win_amount;
pot.innerText = 'Pot size: ' + pot_size;
hand_num.innerText = "Hand number: " + n;
last_action.innerText = "History: " + hand_history;


function shuffle(){
	var cards = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
	
	for(var i = cards.length - 1; i > 0; i--){
		var index = Math.floor(Math.random() * (i + 1));
		var tmp = cards[index];
		cards[index] = cards[i];
		cards[i] = tmp;
	}
	return cards;
}

function raise_possible(){
	if(hand_history.substring(hand_history.length - 1) === "b"){
		update_history("r");
	}
}

function update_history(action){
	hand_history += action;
	last_action.innerText = "History: " + hand_history;
	if(hand_history.substring(hand_history.length - 2) === "rb"){
		pot_size += raise_size - bet_size;
	} else if(action === "b"){
				pot_size += bet_size;
	}
	else if(action === "r"){
		pot_size += raise_size;
	}
		
	pot.innerText = 'Pot size: ' + pot_size;
	winnings.innerText = "Winnings: " + win_amount;
	hand_num.innerText = "Hand number: " + n;
	
	if(hand_over()){
		var ai_card = shuffled_cards[1];
		if(ai_card == 11){
			ai_card = "J";
		} else if(ai_card == 12){
			ai_card = "Q";
		} else if(ai_card == 13){
			ai_card = "K";
		} else if (ai_card == 14) {
			ai_card = "A";
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
			if(ai_card == 11){
				ai_card = "J";
			} else if(ai_card == 12){
				ai_card = "Q";
			} else if(ai_card == 13){
				ai_card = "K";
			} else if (ai_card == 14) {
				ai_card = "A";
			}
			alert("Hand over! AI had: " + ai_card + ". You " + won_hand + " " + Math.abs(current_winnings));
			clear_history();
		}
	}
}

function clear_history(){
	shuffled_cards = shuffle();
	card.innerHTML = "<img src='https://raw.githubusercontent.com/cookm346/poker_ui/master/images/" + (shuffled_cards[0]-1) + ".png'>";
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
	var r = Math.random();
	var info_set = "";
	info_set += shuffled_cards[1] + hand_history;
	if(r < weights[info_set][0]){
		return "p";
	} else if (r < weights[info_set][0] + weights[info_set][1]){
		return "b";
	} else {
		return "r";
	}
	
	//if(r < weights[shuffled_cards[1] + hand_history][0]){
	//return "p";
	//} else{
	//	return "b";
	//}
}

function hand_over(){
	current_winnings = 0;
	if(hand_history === "pp"){
		shuffled_cards[0] > shuffled_cards[1] ? current_winnings = ante_size : current_winnings = -ante_size;
		won_hand = current_winnings > 0 ? "won" : "lost";
		win_amount += current_winnings;
		return true;
	} else if(hand_history === "pbp"){
		current_winnings = in_position ? ante_size : -ante_size;
		won_hand = current_winnings > 0 ? "won" : "lost";
		win_amount += current_winnings;
		return true;
	} else if(hand_history === "pbb"){
		shuffled_cards[0] > shuffled_cards[1] ? current_winnings = ante_size + bet_size : current_winnings = -(ante_size + bet_size);
		won_hand = current_winnings > 0 ? "won" : "lost";
		win_amount += current_winnings;
		return true;
	} else if(hand_history === "pbrp"){
		current_winnings = !in_position ? ante_size + bet_size : -(ante_size + bet_size);
		won_hand = current_winnings > 0 ? "won" : "lost";
		win_amount += current_winnings;
		return true;
	} else if(hand_history === "pbrb"){
		shuffled_cards[0] > shuffled_cards[1] ? current_winnings = ante_size + raise_size : current_winnings = -(ante_size + raise_size);
		won_hand = current_winnings > 0 ? "won" : "lost";
		win_amount += current_winnings;
		return true;
	} else if(hand_history === "bp"){
		current_winnings = !in_position ? ante_size : -ante_size;
		won_hand = current_winnings > 0 ? "won" : "lost";
		win_amount += current_winnings;
		return true;
	} else if(hand_history === "bb"){
		shuffled_cards[0] > shuffled_cards[1] ? current_winnings = ante_size + bet_size : current_winnings = -(ante_size + bet_size);
		won_hand = current_winnings > 0 ? "won" : "lost";
		win_amount += current_winnings;
		return true;
	} else if(hand_history === "brp"){
		current_winnings = in_position ? ante_size + raise_size : -(ante_size + raise_size);
		won_hand = current_winnings > 0 ? "won" : "lost";
		win_amount += current_winnings;
		return true;
	} else if(hand_history === "brb"){
		shuffled_cards[0] > shuffled_cards[1] ? current_winnings = ante_size + raise_size : current_winnings = -(ante_size + raise_size);
		won_hand = current_winnings > 0 ? "won" : "lost";
		win_amount += current_winnings;
		return true;
	} else {
		return false;
	}
}



/*
	if(hand_history.length > 1){
		if(hand_history.charAt(hand_history.length - 1) === "p"){
			if(hand_history === "pp"){
				shuffled_cards[0] > shuffled_cards[1] ? current_winnings = ante_size : current_winnings = -ante_size;
			} else if (hand_history === "pbp"){
				current_winnings = in_position ? ante_size : -ante_size;
			} else if (hand_history === "bp") {
				current_winnings = !in_position ? ante_size : -ante_size;
			} else if (hand_history === "pbrp"){
				current_winnings = !in_position ? ante_size + bet_size : -(ante_size + bet_size);
			} else { //brp
				current_winnings = in_position ? ante_size + bet_size : -(ante_size + bet_size);
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
		} else if (hand_history.substring(hand_history.length - 2) === "rb"){
			if(shuffled_cards[0] > shuffled_cards[1]){
				current_winnings = ante_size + raise_size;
			} else {
				current_winnings = -1 * (ante_size + raise_size);
			}
			won_hand = current_winnings > 0 ? "won" : "lost";
			win_amount += current_winnings;
			return true;
		}
	}
*/







