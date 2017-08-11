//sets compare object
var compare = {};
// compares the route and isochrones to find a common point one hour from the origin
compare.compareApiResults = function(arrayA, arrayB, arrayC, lastOrigin){
  //sets the arrays of matches to empty arrays
  compare.matches = [];
  compare.matchesPair = [];
  console.log('lastOrigin: ', lastOrigin);
  var i = arrayA.length;
  // loops through i until it is 0
  while (i--) {
    var j = arrayB.length;
    var k = arrayC.length;
    // sests aAtI for use through checks
    var aAtI = arrayA[i];
    // loops through array b
    while (j--) {
      var bAtJ = arrayB[j];
      //checks if the coordinate aAtI is within a reasonable margin of error of the isochrone
      if (aAtI[1] > bAtJ[1] -.02 && aAtI[1] < bAtJ[1] + .0002) {
        if(aAtI[0] > bAtJ[0] -.02 && aAtI[0] < bAtJ[0] + .0002){
          // pushes matches to array for secondary check
          compare.matches.push(aAtI);
          compare.matchesPair.push(bAtJ);
        }
      }
    }
    //loops through array c
    while (k--) {
      var cAtK = arrayC[k];
      //checks if aAtI is within a reasonable margin of error
      if(aAtI[1] > cAtK[1] - .002 && aAtI[1] < cAtK[1] + .002){
        if(aAtI[0] > cAtK[0] - .002 && aAtI[0] < cAtK[0] + .002){
          // pushes matches to array for secondary check
          compare.matches.push(aAtI);
          compare.matchesPair.push(cAtK);
          //console.log("match found: ", match, arrayC[k]);
        }
      }
    }
  } console.log(compare.matches.length);
  console.log(compare.matchesPair.length);
  //checks of there were no matches
  if (compare.matches == []) {
    console.log('error');
    return 'error'
  } else {
    // checks for closest match
    var usefulCoordinate = compare.filterCoordinates(compare.matches, compare.matchesPair, lastOrigin);
    // returns good coordinate
    return usefulCoordinate
  }
} // end of compare

//checks for best matching point
compare.filterCoordinates = function(matches, matchesPair, lastOrigin){
    console.log(lastOrigin);
    var ml = matches.length;
    var mpl = matchesPair.length;
    for(var i = 0; i < ml; i ++){
      var matchesAtI = matches[i];
      for (var j = 0; j < mpl; j++) {
        var matchesPairAtJ = matchesPair[j];
        //checks if the point is a match for the last query
        if(matchesAtI[0] - matchesPairAtJ[0] < .002 && matchesAtI[0] - matchesPairAtJ[0] > (-.002) && !(matchesAtI[0] < lastOrigin[0] - .02 && matchesAtI[0] > lastOrigin[0] + .02)){
          if (matchesAtI[1] - matchesPairAtJ[1] < .002 && matchesAtI[1] - matchesPairAtJ[1] > (-.002) && !(matchesAtI[1] < lastOrigin[1] - .02 && matchesAtI[1] > lastOrigin[1] + .02)) {
            var usefulCoordinate = matchesAtI;
            console.log('best match found', usefulCoordinate);
            // returns good coordinate
            return usefulCoordinate;
          }
        }
      }
    }
  }

//export module
module.exports = compare;
