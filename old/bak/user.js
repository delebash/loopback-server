let jwt = require('jsonwebtoken');
let config = require('../../server/config.json');
let models = require('../../server/model-config.json');
let app = require('../../server/server.js');
let Role = app.models.role;
let RoleMapping = app.models.rolemapping;
let ACL = app.models.acl;


module.exports = function (user) {

  user.greet = function(msg, cb) {
    cb(null, 'Greetings... ' + msg);
  };

  user.remoteMethod('greet', {
    accepts: {arg: 'msg', type: 'string'},
    returns: {arg: 'greeting', type: 'string'}
  });


  // // provide own createAccessToken to create JWTs
  user.prototype.createAccessToken = function (ttl, options, cb) {
    if (cb === undefined && typeof options === 'function') {
      cb = options;
      options = undefined;
    }

    // token payload
    let payload = {};
    for (let key in config.jwt.properties) {
      payload[key] = this[config.jwt.properties[key]];
    }

    payload.iss = "Ageektech";
    payload.sub = "Loopback api key";


    let secret = config.jwt.client_secret;
    let at_ttl = config.jwt.access_token_ttl;
    let rt_ttl = config.jwt.refresh_token_ttl;

    // response body
    let response = {
      user_id: this.id,
      access_token: jwt.sign(payload, secret, {expiresIn: at_ttl})
    };

    if (rt_ttl) {
      response.refresh_token = jwt.sign(payload, secret, {expiresIn: rt_ttl});
    }

    if (typeof cb !== 'function') return response;

    return cb(null, response);
  }






  // Add method getAllRoles to user


  // user.getAllRoles = function (req, next) {
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
  // user.remoteMethod('getAllRoles', {
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
  //     path: '/roles'
  //   }
  // });
};
