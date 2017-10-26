var constants = require('constants');

var roleHarvester = {
    run: function(creep) {
        this.creep = creep;
        this.room  = creep.room;
        this.creep.say('harvester');

	    if (this.canCarryMoreEnergy()) {
            this.mineEnergy();
        } else {
            this.returnEnergyToDeposit();
        }
	},

	canCarryMoreEnergy: function () {
	    return this.creep.carry.energy < this.creep.carryCapacity;
	},

	mineEnergy: function () {
	    var energySources = this.energySourcesByDistance();
	    var assignedSource = this.decideWhichSourceToMine();

        if (this.creep.harvest(energySources[assignedSource]) == ERR_NOT_IN_RANGE) {
            this.moveTowardsEnergySource(energySources[assignedSource]);
        }
	},

	energySourcesByDistance: function () {
	    var activeSources = this.creep.room.find(FIND_SOURCES_ACTIVE);
	    return _.sortBy(activeSources, s => Game.spawns['Ankov'].pos.getRangeTo(s));
	},

	decideWhichSourceToMine: function () {
	    var harvesterCount = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester').length;
	    var distancedEnergySources = this.energySourcesByDistance();

	    // TODO: grab the creeps-per-source constant from service.population instead of using a hard-coded value here
	    var creepsPerSource = 4;

	    // We sort energy sources by distance and then bucket by roleId for assignment, so the first N creeps go to the closest
	    // energy source, then the next N creeps go to the next-closest, and so on.
	    var sourceGroup = parseInt(this.creep.memory.roleId / creepsPerSource, 10);
	    var assignedSourceId = parseInt(sourceGroup % distancedEnergySources.length, 10);

        return assignedSourceId;
	},

	moveTowardsEnergySource: function (energySource) {
	    this.creep.moveTo(energySource, { visualizePathStyle: { stroke: constants.colors.harvester.path_to_energy } });
	},

	validEnergyDeposits: function () {
	    return this.creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (
                    structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_SPAWN ||
                    structure.structureType == STRUCTURE_TOWER ||
                    structure.structureType == STRUCTURE_CONTAINER
                ) && (
                    structure.energy < structure.energyCapacity
                );
            }
        });
	},

	returnEnergyToDeposit: function () {
	    var deposits = this.validEnergyDeposits();

        if (deposits.length > 0) {
            var assignedDeposit = null;

            // TODO: This clearly needs a higher-order reduce or something.
            for (var i = 0; i < deposits.length; i++) {
                if (deposits[i].energy < deposits[i].energyCapacity) {
                    assignedDeposit = deposits[i];
                    break;
                }
            }

            if (this.creep.transfer(assignedDeposit, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                this.creep.moveTo(assignedDeposit, { visualizePathStyle: { stroke: constants.colors.harvester.path_from_energy } });
            }
        } else {
            this.creep.say('Job done.');
            this.creep.memory.role = 'free-agent';
        }
	}
};

module.exports = roleHarvester;
