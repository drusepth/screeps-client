module.exports = {
  find: function (creep, find_query) {
    var results = creep.room.find(find_query);
    return _.sortBy(results, result => creep.pos.getRangeTo(result));
  }
};
