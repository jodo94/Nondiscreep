/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('tick.colonyattempt');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    tick: function(){
    
    //console.log(Memory.SMAER.length)
    if (typeof Memory.colonyattempt == "undefined"){
        Memory.colonyattempt=0;
        return;
    }
    
    else if (Memory.colonyattempt=1) {
        Memory.colonyattempt=0;
        return;
    }
    else if (Memory.colonyattempt=0){
        Memory.colonyattempt=1;
        return;
    }}
};

