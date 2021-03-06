QUnit.test( "testStateConstructor", function( assert ) {
	var testState = new State("test");
	assert.equal(testState.name, "test");
	assert.deepEqual(testState.adjacencyList, {});
});


QUnit.test( "testSetTransitionFunction", function ( assert ) {
	var testState = new State("test");
	var transitionStates = ["i", "j"];
	testState.setTransition("n", transitionStates);
	assert.equal(testState.adjacencyList["n"][0],"i");
	assert.equal(testState.adjacencyList["n"][1],"j")
});


QUnit.test( "testGetStatesEmpty", function ( assert ) {
	var testResult = getStates("");
	assert.equal(testResult.length, 0 );
});


QUnit.test( "testGetStates", function ( assert ){
	var testResult = getStates("i,j,k");
	assert.equal(testResult[0],"i");
	assert.equal(testResult[1],"j");
	assert.equal(testResult[2],"k");
});

QUnit.test( "testBuildJSON", function ( assert ){
	var testState = new State("test");
	var testArray = [testState];
	var testJSONArr = buildJSON(testArray);
	assert.equal(testJSONArr.nodes[0].name,"test");
});