var constants = require('constants');

var serviceOptimization = require('service.optimization');

module.exports = {
    decideWhatToSpawn: function () {
        // We want to prioritize spawning first-ofs of each role over spawning duplicates of any role
        var nonZeroPreferenceOrder = ['harvester', 'upgrader', 'fortifier', 'builder'];
        for (var i = 0; i < nonZeroPreferenceOrder.length; i++) {
            var role = nonZeroPreferenceOrder[i];
            var roleCurrentCount = _.filter(Game.creeps, (creep) => creep.memory.role == role).length;

            if (roleCurrentCount >= serviceOptimization.optimalRoleCount(role)) {
                continue;
            }

            // Treat 0 and 1 harvesters as the same: we always want at least 2, not at least 1. #needsrefactor
            if (roleCurrentCount == 0 || (roleCurrentCount == 'harvester' && roleCurrentCount == 1)) {
                console.log('new nonzero spawn: ' + role);

                this.spawnOptimalScreeps(role);
                return;
            }
        }

        // If we have at least one of each role, we can go ahead and go down the list and spawn duplicates in the proper order
        var duplicatePreferenceOrder = ['harvester', 'builder', 'fortifier', 'upgrader'];
        for (var i = 0; i < duplicatePreferenceOrder.length; i++) {
            var role = duplicatePreferenceOrder[i];
            var roleCurrentCount = _.filter(Game.creeps, (creep) => creep.memory.role == role).length;


            if (roleCurrentCount < serviceOptimization.optimalRoleCount(role)) {
                console.log('new duplicate spawn: ' + role);
                this.spawnOptimalScreeps(role);
            }
        }
    },

    spawnOptimalScreeps: function (role) {
        var currentRoleCount = _.filter(Game.creeps, (creep) => creep.memory.role == role).length;

        var optimalRoleCount = 0;
        if (role == 'harvester') {
            optimalRoleCount = serviceOptimization.optimalHarvesterCount();
        } else if (role == 'builder') {
            optimalRoleCount = serviceOptimization.optimalBuilderCount();
        } else if (role == 'upgrader') {
            optimalRoleCount = serviceOptimization.optimalUpgraderCount();
        } else if (role == 'fortifier') {
            optimalRoleCount = serviceOptimization.optimalUpgraderCount();
        }

        if (currentRoleCount < optimalRoleCount) {
            var availableFreeAgents = _.filter(Game.creeps, (creep) => creep.memory.role == 'free-agent');
            if (availableFreeAgents.length > 0) {
                this.assignJobToFreeAgent(availableFreeAgents, role);
            } else {
                if (role == 'harvester') {
                    this.spawnBestScreep('harvester', [WORK, CARRY, MOVE], [WORK, MOVE]);
                } else if (role == 'builder') {
                    this.spawnBestScreep('builder', [WORK, CARRY, MOVE], [WORK, MOVE]);
                } else if (role == 'upgrader') {
                    this.spawnBestScreep('upgrader', [WORK, CARRY, MOVE], [WORK, MOVE]);
                } else if (role == 'fortifier') {
                    this.spawnBestScreep('fortifier', [WORK, CARRY, MOVE], [WORK, MOVE]);
                }
            }
        } else {
            console.log('decided not to spawn ' + role);
        }
    },

    assignJobToFreeAgent: function (agents, job) {
        if (agents.length > 0) {
            agents[0].say("-> " + job);
            agents[0].memory.role = job;
        }
    },

    // spawnBestScreep('harvester', [WORK, CARRY, MOVE], [WORK, MOVE])
    spawnBestScreep: function (role, minimumBody, bodyImprovementStep) {
        var bodyToSpawn = [];
        var availableEnergy = Game.spawns['Ankov'].room.energyAvailable;

        for (var i = 0; i < minimumBody.length; i++) {
            var bodyPart = minimumBody[i];

            bodyToSpawn.push(bodyPart);
            availableEnergy -= constants.mechanics.costs.body[bodyPart];
        }

        var improvementStepCost = 0;
        for (var i = 0; i < bodyImprovementStep.length; i++) {
            var bodyPart = bodyImprovementStep[i];
            improvementStepCost += constants.mechanics.costs.body[bodyPart];
        }

        while (improvementStepCost > 0 && availableEnergy >= improvementStepCost) {
            for (var i = 0; i < bodyImprovementStep.length; i++) {
                bodyToSpawn.push(bodyImprovementStep[i]);
            }
            availableEnergy -= improvementStepCost;
        }

        var newName = 'BBB' + Game.time;
        Game.spawns['Ankov'].spawnCreep(bodyToSpawn, newName, { memory: { role: role } });
    }
};
