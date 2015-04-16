var State = function(name) { 
	this.name = name;
	this.adjacencyList = {};
	
	this.setTransition = function(transition, toStates) {
		this.adjacencyList[transition] = toStates;
	}
};

/**
 * Takes an input of either a string of states or transitions and gives their count
 * @param  {string} inputString      string captured from HTML
 * @return {integer}                 number of states/elements in string, -1 if fail
 */
function stateTransInputValidator(inputString) {
	var arr;
	if (inputString == "") {
		arr = [];
	} else {
		arr = inputString.split(",");
	}

	var duplicateMap = {};

	for (var i = 0; i < arr.length; i++) {
		var elem = arr[i];
		// check against multi-letter state names
		if (elem.length != 1) {
			console.log("Please only single character states/transitions.");
			return -1;
		}

		if (duplicateMap[elem]) {
			console.log("Please no duplicate inputs.")
			return -1;
		}
		duplicateMap[elem] = true;
	};

	return arr.length;
}

/**
 * Gives back an array of states from a field in the HTML
 * @param  {string} id          HTML descriptor of the 
 * @return {array}              array of strings with state names   
 */
function getStates(id) {
	var inputStates = $(id).val().replace(/ /g,'').toUpperCase();
	$(id).val(inputStates);

	var numStates = stateTransInputValidator(inputStates);
	if (numStates > -1) {
		var stateArray;

		if (numStates == 0) {
			stateArray = [];
		} else {
			stateArray = inputStates.split(",");
		}

		return stateArray
	} else {
		return null;
	}
};

/**
 * Gives back an array of the transitions as specified by the 
 * @return {array} 				array of strings with transition names
 */
function getTransitions() {
	// remove spaces and to lowercase
	var inputTransitions = $("#csn_transitions").val().replace(/ /g, '').toLowerCase();
	$("#csn_transitions").val(inputTransitions); // update the field

	var numTrans = stateTransInputValidator(inputTransitions);

	if (numTrans > 0) {
		var transitionArray = inputTransitions.split(",");
		return transitionArray;
	} else {
		return null;
	}
}

function processStates() {
	var stateArray = getStates("#csn_states");
	var transitionArray = getTransitions();

	if (stateArray == null || transitionArray == null) {
		return false;
	}

	$("#csn_button").hide();
	$("#csn_states").prop("disabled", true);
	$("#csn_transitions").prop("disabled", true);
	
	for (var i = 0; i < stateArray.length; i++) {
		for(var j = 0; j < transitionArray.length; j++) {
			// using document.createElement is faster than jQuery's creation

			// create element for input field for d(state i, transition j)
			var transition = $(document.createElement("INPUT"));
			transition.attr({
				"type"        : "text",
				"placeholder" : "d(" + stateArray[i] + "," + transitionArray[j] + ")",
				"Name"        : "textelement_" + i + "-" + j,
				"id"          : "transitition_input_id_" + i + "-" + j
			});

			// add text fields to DOM
			$("#state_input").append(transition);
		}
	}

	// add submit button to DOM
	var submitButton = $(document.createElement("INPUT"));
	submitButton.attr({
		"type"    : "button",
		"class"   : "special",
		"id"      : "submit_nfa_button",
		"Value"   : "Transform",
		"onClick" : "transformNFA()"
	});
	$("#state_input").append(submitButton);

	return true;
}

function resetElements() {
	$('input[id*="transitition_input_id_"]').remove();
	$("#submit_nfa_button").remove();
	$("#csn_button").show();
	$("#csn_text").val("");
}

function generateStateObjects(stateNames, transitions) {
	var objects = [];

	for (var i = 0; i < stateNames.length; i++) {
		var state = new State(stateNames[i]);

		// build up the adjacency list
		for (var j = 0; j < transitions.length; j++) {
			var id = "#transitition_input_id_" + i + "-" + j;
			var toStatesInput = $(id).val();

			if (stateTransInputValidator(toStatesInput) > -1) {
				var toStates = getStates(id);
				state.setTransition(transitions[i], toStates);
			}
		};

		objects.push(state);
	};

	return objects;
}

function transformNFA() {
	// grab every input element
	var stateNames = getStates("#csn_states");
	var transitions = getTransitions();

	var transitionsToStates = [];
	$('input[id*="transitition_input_id_"]').each(function(i,v) {
		var value = $(v).val();
		console.log(value);

		var validate = stateTransInputValidator(value);
		if (validate == -1) {
			console.log("Validation failed at text box " + i);
			return -1;
		}


	});

	// process input
	var stateObjArray = generateStateObjects(stateNames, transitions);

	// build json
	var data = buildJSON(stateObjArray);

	console.log(data);

	// ajax request to servers
	$.ajax({
		url  : "app/transform.php",
		data : data
	}).done(function(response){
		outputDFA(response);
	});
}




/**
 * function used to build the JSON that will be sent to the server
 * @return JSON 
 */
function buildJSON(stateObjArray) {
	var JSONarr = {
		nodes: stateObjArray
	};
	
	return JSONarr;
}




function outputDFA(response) {

}

