var roleUpgrader = require('role.upgrader');
var taskHarvesting = require('task.harvesting');
var LaborCycle = require('tick.laborCycle');
var SMADS = require('SMADS');
module.exports = {
    // a function to run the logic for this role
    run: function(creep) {

        // if creep is trying to complete a constructionSite but has no energy left
        // if creep is bringing energy to the controller but has no energy left
        if (creep.memory.working === true && creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
            creep.memory.working = false;
            SMADS.push(creep);
            creep.memory.dsToken = false;
            creep.say('UWU');
            
        }
        else if (creep.memory.working === false && creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
            creep.memory.working = true;
            creep.memory.dsToken = true;
            creep.say('💪');
        }

        
        var constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
        // if creep is supposed to complete a constructionSite
        if (creep.memory.working == true && (constructionSite != null || constructionSite != 'undefined')) {
            
            if(creep.memory.dsToken == true && (creep.getFreeCapacity>10)){
                SMADS.push(creep);
                creep.memory.dsToken = false;
                creep.say('UWU');
            }
            // find closest constructionSite
            var constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            // if one is found
            if (constructionSite != undefined) {
                // try to build, if the constructionSite is not in range
                if (creep.build(constructionSite) == ERR_NOT_IN_RANGE) {
                    // move towards the constructionSite
                    creep.moveTo(constructionSite);
                }
            }
            

            // if no constructionSite is found
            
     
            else if (creep.memory.prestige < 3) {
                let oldprestige = creep.memory.prestige;
                let newprestige = oldprestige + 1;
                creep.memory.prestige = newprestige;
                const nextRole = LaborCycle.tick(creep);
                creep.memory.role = nextRole;
                creep.say(`${nextRole}!`);
            }
            
            else {
                creep.memory.role ='upgrader';
            }
        }
        // if creep is supposed to harvest energy from source
        else{
                taskHarvesting.run(creep);
        }

    }
};
