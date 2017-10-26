var optimalService = require('service.optimization');

module.exports = {
    tagEachRole: function () {
        // TODO: stick these in a more reusable constant?
        var allRoles = ['harvester', 'builder', 'upgrader', 'fortifier', 'free-agent'];

        for (var i = 0; i < allRoles.length; i++) {
            var role = allRoles[i];
            var maximumForThisRole = optimalService.optimalRoleCount(role);
            var screepsOfThisRole = _.filter(Game.creeps, (creep) => creep.memory.role == role);

            for (var j = 0; j < screepsOfThisRole.length; j++) {
                if (j < maximumForThisRole) {
                    screepsOfThisRole[j].memory.roleId = j;
                } else {
                    // Allow role overflow on upgraders
                    if (role != 'upgrader') {
                        screepsOfThisRole[j].memory.role = 'free-agent';
                    }
                }
            }
        }
    }
};
