var compare = {};
compare.compareApiResults = function(arrayA, arrayB, arrayC){
  compare.matches = [];
  compare.matchesPair = [];
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
    //console.log(compare.matches.length, compare.matches);
    //console.log(compare.matchesPair.length, compare.matchesPair);
  } // end of compare

module.exports = compare;
