/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('run.Midwife');
 * mod.thing == 'a thing'; // true
 */
require('prototype.spawn')();

var SMAER = require('SMAER');
var SMADS = require('SMADS');

module.exports = {
        run: function( room, roomName, spawn, energy, discretionaryEnergy){
            
            /*INSTANTIATING METRICS USED FOR SPAWNING CONDITIONS */
            var hostiles = Game.rooms[roomName].find(FIND_HOSTILE_CREEPS);
            var EmptyBirthCanal = Game.rooms[roomName].find(FIND_MY_STRUCTURES, {
                // the second argument for findClosestByPath is an object which takes
                // a property called filter which can be a function
                // we use the arrow operator to define it
                filter: (s) => (((s.structureType == STRUCTURE_SPAWN
                             || s.structureType == STRUCTURE_EXTENSION)
                             && (s.energy < s.energyCapacity)))
                            
            });
            
            Memory.numberOfWarriors = _.sum(Game.creeps, (c) => c.memory.role === 'warrior');
            Memory.numberOfExterminators = _.sum(Game.creeps, (c) => c.memory.role === 'exterminator');   
            
            let sizeOfLaborForce = _.sum(Game.creeps, (c) => (c.memory.role =='builder' || c.memory.role == 'harvester' || c.memory.role == 'repairer' || c.memory.role == 'upgrader') && c.room.name === roomName);
            let numberEmployed = _.sum(Game.creeps, (c) => (c.memory.role =='builder' || c.memory.role == 'harvester' || c.memory.role == 'repairer' || c.memory.role == 'upgrader')&& c.room.name === roomName && c.store.getUsedCapacity(RESOURCE_ENERGY) >= 5);
            let numberOfGaurds = _.sum(Game.creeps, (c) => (c.memory.role =='gaurd' && c.room.name === roomName));
            let EmploymentRatio = numberEmployed/sizeOfLaborForce;
                // Update and get the SMAER
            SMAER.update(roomName,EmploymentRatio);
            let SMAERResult = SMAER.get(roomName);
                
            // A simplified spawning goal based on employment ratio
            let goalpostBirth = (25 + SMADS.get(roomName))/(25 + (2*SMADS.get(roomName)));
            
            
            
             if (!room) {
            console.log(`Error: Room "${roomName}" not found or no vision.`);
            return null;
            }

            // Find all of your creeps in the specified room
            const creepsInRoom = room.find(FIND_MY_CREEPS);

            // Return null if there are no creeps in the room
            if (creepsInRoom.length === 0) {
            return null;
            }

            // The youngest creep has the highest ticksToLive value.
            // We can find this creep using the Lodash _.max function.
            const youngestCreep = _.max(creepsInRoom, c => c.ticksToLive);

            
            /*END OF INSTANTIATING METRICS */
         
         
         
            /*SPAWNING LOGIC*/
            
            
            if (hostiles.length > 0 && room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } }).length === 0  &&  numberOfGaurds < 3) {
                    spawn.createCustomCreep(discretionaryEnergy, 'gaurd');
                }
           
            let sizeOfQuadSquad = _.sum(Game.creeps, (c) => (c.memory.role == 'quadsquad'));
            
            //if (youngestCreep.ticksToLive > 1400 && energy > 2000 && Memory.numberOfExterminators < 1){
                //spawn.createCustomCreep(energy, 'pioneer');
            //}
            if (youngestCreep.ticksToLive > 1200 && Memory.QSMode == 0 &&  energy > 2000 && sizeOfQuadSquad < 4){
                spawn.createCustomCreep(energy, 'quadsquad');
            }
            let numberOfDecoys = _.sum(Game.creeps, (c) => (c.memory.role == 'decoy'));
            if (Game.time % (75 * (2**numberOfDecoys))==0) {spawn.createCustomCreep(discretionaryEnergy, 'decoy');
            }
            /*
            if(Game.time % 750 == 0){
                if(Game.time % 1500 ==0){
                spawn.createCustomCreep(discretionaryEnergy, 'guerrilla');
                }
                else{
                     spawn.createCustomCreep(discretionaryEnergy, 'decoy');
                }
            }
            */
             
            if (Game.time % 3 == 0){
                console.log(" ");
                console.log(" ");
                console.log(" ");
                console.log(" ");
                console.log("Room: " + room.name);
                console.log('sizeOfLaborForce :' + sizeOfLaborForce);
                console.log("SMAER: " + SMAERResult);
                console.log('SMADS: ' + SMADS.get(roomName));
                console.log("goalpostBirth: " + goalpostBirth);
                console.log("Energy Capacity: " + room.energyCapacityAvailable);


                console.log('goalpostRepair: ' + Memory.goalpostRepair);
                console.log('goalpostStorage: ' +Memory.goalpostStorage);
            }
                
            if ((SMAERResult > goalpostBirth)  || (youngestCreep.ticksToLive < 800 && creepsInRoom.length <2)) {
                    spawn.createCustomCreep(energy, 'harvester');
                }
            
            if (sizeOfLaborForce <1){
                    spawn.createCustomCreep(discretionaryEnergy, 'harvester');
                }
        }
};