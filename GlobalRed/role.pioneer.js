/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.pioneer');
 * mod.thing == 'a thing'; // true
 */
var warpath = require('task.warpath');
module.exports = {
        run: function(creep){   
            let targetRoom = 'E43S56';
        
           
            if (creep.room.name != targetRoom) {
                warpath.run(creep);
            }
            else{
                creep.move(BOTTOM);
                creep.memory.role = 'builder'; 
            }
         
        }
};