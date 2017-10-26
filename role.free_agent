var constants = require('constants');

var roleFreeAgent = {
    run: function(creep) {
        this.creep = creep;
        this.room  = creep.room;
        this.creep.say('free');

        this.creep.moveTo(37, 33, { visualizePathStyle: { stroke: '#ffffff' } });

        // Runoff all excess free agents to upgraders
        // TODO: we should set a tick buffer before runoff so other jobs can have a first pick, while still allowing proper runoff
        this.convertToUpgrader();
	},

	convertToUpgrader: function () {
	    this.creep.memory.role = 'upgrader';
	}
};

module.exports = roleFreeAgent;
