module.exports ={
     roll: function(percentchance){
         var result = Math.random() * 100;
          if (result < percentchance) {
                return true
            }
            else{
                return false
            }
     }
};
