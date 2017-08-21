module.exports = function (app) {
  let user = app.models.user;
  let Role = app.models.Role;
  let RoleMapping = app.models.RoleMapping;
  let _ = require('lodash');

  // Add method getAllRoles to user
  user.getAllRoles = function (req, next) {

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



  // Add method addRole to user
  user.addRole = function (id, role, next) {
    next = next || function () {
    };
    return Role.findOne({where: {name: role}})
      .then(function (role) {
        if (!role) return sendError(next, 'No role found', 404);
        return RoleMapping.findOrCreate({principalType: RoleMapping.USER, principalId: id, roleId: role.id});
      })
      .then(function (data) {
        next(null);
        return null;
      })
      .catch(function (error) {
        return sendError(next, 'Internal error', 500);
      })
  };

  // Add method removeRole to user
  user.removeRole = function (id, role, next) {
    next = next || function () {
    };
    return Role.findOne({where: {name: role}})
      .then(function (role) {
        if (!role) return sendError(next, 'No role found', 404);
        return RoleMapping.findOne({where: {principalType: RoleMapping.USER, principalId: id, roleId: role.id}});
      })
      .then(function (roleMapping) {
        if (!roleMapping) return;
        return roleMapping.destroy();
      })
      .then(function () {
        next(null);
        return null;
      })
      .catch(function (error) {
        return sendError(next, 'Internal error', 500);
      })
  };

  // Add method findByRole to user
  user.findByRole = function (role, next) {
    next = next || function () {
    };
    return Role.findOne({where: {name: role}})
      .then(function (role) {
        if (!role) return sendError(next, 'No role found', 404);
        return RoleMapping.find({where: {roleId: role.id, principalType: 'USER'}});
      })
      .then(function (roleMappings) {
        let ids = _.uniq(_.map(roleMappings, 'principalId'));
        return user.find({where: {id: {inq: ids}}});
      })
      .then(function (users) {
        next(null, users);
        return users;
      })
      .catch(function (error) {
        return sendError(next, 'Internal error', 500);
      })
  };


// Register remote method
  user.remoteMethod('getAllRoles', {
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
      path: '/myrole'
    }
  });

  user.remoteMethod('addRole', {
    accepts: [
      {
        arg: 'id',
        type: 'string',
        required: true
      },
      {
        arg: 'role',
        type: 'string',
        required: true
      }
    ],
    returns: {}
    ,
    http: {
      verb: 'post',
      path: '/:id/addRole'
    }
  });
  user.remoteMethod('removeRole', {
    accepts: [
      {
        arg: 'id',
        type: 'string',
        required: true
      },
      {
        arg: 'role',
        type: 'string',
        required: true
      }
    ],
    returns: {}
    ,
    http: {
      verb: 'post',
      path: '/:id/removeRole'
    }
  });
  user.remoteMethod('findByRole', {
    accepts: {
      arg: 'role',
      type: 'string',
      required: true
    },
    returns: {
      arg: 'users',
      type: '[object]'
    },
    http: {
      verb: 'get'
    }
  });

  user.remoteMethod('getPersistedRoles', {
    accepts: [
      {
        arg: 'id',
        type: 'string',
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
      path: '/:id/persistedRoles'
    }
  });


};
