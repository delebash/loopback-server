module.exports = function (app) {
  var _ = require('lodash');
  var User = app.models.user;
  var Role = app.models.Role;
  var RoleMapping = app.models.RoleMapping;
  var ACL = app.models.ACL;


  //
  // User.addRole = async function (role) {
  //   let roleid = await Role.create({
  //     name: role,
  //     description: "role"
  //   });
  // };

  // User.remoteMethod('addRole', {
  //   accepts: [
  //     {
  //       arg: 'role',
  //       type: 'string',
  //       required: true
  //     }
  //   ],
  //   returns: {}
  //   ,
  //   http: {
  //     verb: 'post',
  //     path: '/addRole'
  //   }
  // });


  // // Add method getAllRoles to user
  // User.getAllRolesByCurrentUser = function (req, next) {
  //   let userId = req.accessToken.userId;
  //   if (!userId) {
  //     return sendError(next, 'You are not connected', 401);
  //   }
  //   Role.getRoles({principalType: RoleMapping.USER, principalId: userId}, function (err, ids) {
  //     if (err) {
  //       return next(err);
  //     }
  //     let dataIds = _.filter(ids, (id) => {
  //       return !_.isString(id) || id.substr(0, 1) !== '$'
  //     });
  //     let dynamicRoles = _.filter(ids, (id) => {
  //       return _.isString(id) && id.substr(0, 1) === '$'
  //     });
  //     // Treat this separately because if dataIds = [], all roles will be return by find request
  //     if (dataIds.length === 0) {
  //       next(null, dynamicRoles);
  //       return Promise.resolve(dynamicRoles);
  //     }
  //     Role.find({where: {id: {inq: dataIds}}})
  //       .then(function (roles) {
  //         let result = _.map(roles, 'name');
  //         result = _.uniq(result.concat(dynamicRoles));
  //         next(null, result);
  //         return result;
  //       })
  //       .catch(function (error) {
  //         return sendError(next, 'Internal error', 500);
  //       })
  //   });
  // };
  //
  // User.remoteMethod('getAllRolesByCurrentUser', {
  //   accepts: [
  //     {
  //       arg: 'context',
  //       type: 'object',
  //       http: {source: 'req'},
  //       required: true
  //     }
  //   ],
  //   returns: {
  //     arg: 'roles',
  //     type: '[string]'
  //   }
  //   ,
  //   http: {
  //     verb: 'get',
  //     path: '/getroles'
  //   }
  // });
  //
  // User.addToRole = async function (userId, roleID) {
  //   let rm = await RoleMapping.create({
  //     principalType: RoleMapping.USER,
  //     principalId: userId,
  //     roleId: roleId
  //   });
  // };


  /*
   * Configure relationships
   */

  // User.hasMany(Role, {through: RoleMapping, foreignKey: 'principalId'});
  // User.hasMany(RoleMapping, {foreignKey: 'principalId'});
  // Role.hasMany(RoleMapping, {foreignKey: 'roleId'});
  // Role.hasMany(User, {through: RoleMapping, foreignKey: 'roleId'});

  // ACL.create({
  //   model: 'user',
  //   property: '*',
  //   accessType: '*',
  //   principalType: 'ROLE',
  //   principalId: '$everyone',
  //   permission: 'DENY'
  // }, function (err, acl) { // Create the acl
  //   if (err) console.error(err);
  // });

  //
  //    ACL.create({
  //   model: 'Role',
  //   property: '*',
  //   accessType: '*',
  //   principalType: 'ROLE',
  //   principalId: 'admin',
  //   permission: 'ALLOW'
  // }, function (err, acl) { // Create the acl
  //   if (err) console.error(err);
  // });
  //
  // ACL.create({
  //   model: 'RoleMapping',
  //   property: '*',
  //   accessType: '*',
  //   principalType: 'ROLE',
  //   principalId: 'admin',
  //   permission: 'ALLOW'
  // }, function (err, acl) { // Create the acl
  //   if (err) console.error(err);
  // });
  //
  // ACL.create({
  //   model: 'user',
  //   property: '*',
  //   accessType: '*',
  //   principalType: 'ROLE',
  //   principalId: 'admin',
  //   permission: 'ALLOW'
  // }, function (err, acl) { // Create the acl
  //   if (err) console.error(err);
  // });
  //

};
