var compare = {};
compare.compareApiResults = function(arrayA, arrayB, arrayC, lastOrigin){
  compare.matches = [];
  compare.matchesPair = [];
  console.log('lastOrigin: ', lastOrigin);
  var i = arrayA.length;
  while (i--) {
    var j = arrayB.length;
    var k = arrayC.length;
    //console.log(i);
    var aAtI = arrayA[i];
    // console.log(aAtI[1]);
    // console.log(aAtI[0]);
    // console.log(aAtI[0] - .02);
    // console.log(aAtI[1]);
    // console.log(aAtI[1] + .02);
    while (j--) {
      var bAtJ = arrayB[j];
      if (aAtI[1] > bAtJ[1] -.02 && aAtI[1] < bAtJ[1] + .0002) {
        if(aAtI[0] > bAtJ[0] -.02 && aAtI[0] < bAtJ[0] + .0002){
          compare.matches.push(aAtI);
          compare.matchesPair.push(bAtJ);
          //console.log("match found: ", match, arrayB[j]);
        }
      }
    }
    while (k--) {
      var cAtK = arrayC[k];
      //console.log(cAtK);
      if(aAtI[1] > cAtK[1] - .002 && aAtI[1] < cAtK[1] + .002){
        //if(aAtI[0] > bAtJ[0] - .02 && aAtI[0] < bAtJ[0] + .02){
        if(aAtI[0] > cAtK[0] - .002 && aAtI[0] < cAtK[0] + .002){
          compare.matches.push(aAtI);
          compare.matchesPair.push(cAtK);
          //console.log("match found: ", match, arrayC[k]);
        }
      }
    }
  } console.log(compare.matches.length);
  console.log(compare.matchesPair.length);
  if (compare.matches == []) {
    console.log(error);
  } else {
    var usefulCoordinate = compare.findBestPoint(compare.matches, compare.matchesPair, lastOrigin);
    //console.log(usefulCoordinate);
    return usefulCoordinate
  }
  //console.log(compare.matches.length, compare.matches);
  //console.log(compare.matchesPair.length, compare.matchesPair);
} // end of compare

compare.findBestPoint = function(matches, matchesPair, lastOrigin){
    //console.log(matches);
    //console.log(matchesPair);
    console.log(lastOrigin);
    var ml = matches.length;
    var mpl = matchesPair.length;
    for(var i = 0; i < ml; i ++){
      var matchesAtI = matches[i];
      for (var j = 0; j < mpl; j++) {
        var matchesPairAtJ = matchesPair[j];
        if(matchesAtI[0] - matchesPairAtJ[0] < .002 && matchesAtI[0] - matchesPairAtJ[0] > (-.002) && !(matchesAtI[0] < lastOrigin[0] - .02 && matchesAtI[0] > lastOrigin[0] + .02)){
          if (matchesAtI[1] - matchesPairAtJ[1] < .002 && matchesAtI[1] - matchesPairAtJ[1] > (-.002) && !(matchesAtI[1] < lastOrigin[1] - .02 && matchesAtI[1] > lastOrigin[1] + .02)) {
            // console.log(matchesAtI[0] - matchesPairAtJ[0]);
            // console.log(matchesAtI[1] - matchesPairAtJ[1]);
            var usefulCoordinate = matchesAtI;
            // console.log(compare.trip.usefulCoordinate);
            console.log('best match found', usefulCoordinate);
            return usefulCoordinate;
          }
        }
      }
    }
  }

module.exports = compare;
