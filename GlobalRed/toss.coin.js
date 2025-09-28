module.exports ={
     toss: function(){
         var result = Game.time % 2;
          if (result == 1) {
                return true
            }
            else{
                return false
            }
     }
};
