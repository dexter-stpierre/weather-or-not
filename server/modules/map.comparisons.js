compare.compareApiResults = function(arrayA, arrayB, arrayC){
    var i = arrayA.length;
    var tempMatches = [];
    var tempMatchesPair = [];
    while (i--) {
      var j = arrayB.length;
      var k = arrayC.length;
      console.log(i);
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
            matches.push(aAtI);
            matchesPair.push(bAtJ);
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
            matches.push(aAtI);
            matchesPair.push(cAtK);
            //console.log("match found: ", match, arrayC[k]);
          }
        }
      }
    }console.log(matches);
    console.log(matchesPair);
  } // end of compare

module.exports = compare;
