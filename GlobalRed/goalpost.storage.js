/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('goalpost.storage');
 * mod.thing == 'a thing'; // true
 */


module.exports = {   
    set: function(){
        if(Memory.goalpostStorage== 'undefined'){
            Memory.goalpostStorage= 0;
        }
        else {
                
                Memory.goalpostStorage =  ((Memory.Epoch % 50) * 10000)+510000;
           
        }
    }
};

    