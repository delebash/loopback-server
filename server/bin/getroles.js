module.exports = function (app) {
  var _ = require('lodash');
  var User = app.models.user;
  var Role = app.models.Role;
  var RoleMapping = app.models.RoleMapping;
  var ACL = app.models.ACL;


// Add method getAllRoles to user
User.getAllRoles = function (req, next) {
  let userId = req.accessToken.userId;
  if (!userId) {
    return sendError(next, 'You are not connected', 401);
  }
  Role.getRoles({principalType: RoleMapping.USER, principalId: userId}, function (err, ids) {
    if (err) {
      return next(err);
    }
    let dataIds = _.filter(ids, (id) => {
      return !_.isString(id) || id.substr(0, 1) !== '$'
    });
    let dynamicRoles = _.filter(ids, (id) => {
      return _.isString(id) && id.substr(0, 1) === '$'
    });
    // Treat this separately because if dataIds = [], all roles will be return by find request
    if (dataIds.length === 0) {
      next(null, dynamicRoles);
      return Promise.resolve(dynamicRoles);
    }
    Role.find({where: {id: {inq: dataIds}}})
      .then(function (roles) {
        let result = _.map(roles, 'name');
        result = _.uniq(result.concat(dynamicRoles));
        next(null, result);
        return result;
      })
      .catch(function (error) {
        return sendError(next, 'Internal error', 500);
      })
  });
};

User.remoteMethod('getAllRoles', {
  accepts: [
    {
      arg: 'context',
      type: 'object',
      http: {source: 'req'},
      required: true
    }
  ],
  returns: {
    arg: 'roles',
    type: '[string]'
  }
  ,
  http: {
    verb: 'get',
    path: '/roles'
  }
});
};
