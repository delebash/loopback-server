module.exports = function RowCount (Model) {
  'use strict';

  // Model.afterRemote('findById', injectCounts);
  // Model.afterRemote('findOne', injectCounts);
  Model.afterRemote('find', injectCounts);

  function injectCounts (ctx, unused, next) {
    var resources = ctx.result;
    if (!Array.isArray(resources)) resources = [resources];
    if (resources.length) {
      ctx.result = {
        count: resources.length,
        rows: resources
      };
      return next();
    }
  }

};

