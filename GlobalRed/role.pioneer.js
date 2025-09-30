/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.pioneer');
 * mod.thing == 'a thing'; // true
 */
var devpath = require('task.devpath');
module.exports = {
        run: function(creep){   
            let targetRoom = Memory.buildRoomName;
        
            creep.move(BOTTOM);
            if (creep.room.name != targetRoom) {
                devpath.run(creep);
                
            }
            else{
                
                creep.move(BOTTOM);
                creep.memory.role = 'builder'; 
            }
         
        }
};