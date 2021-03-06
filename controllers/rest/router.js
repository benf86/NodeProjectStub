'use strict';

module.exports = globals => {
    var routes = require('./v1')(globals);
    routes.forEach(route => {
        globals.router[route.verb](
            route.path,

            // Authorization middleware
            require('./authorization'),

            // Input input data sanitization middleware
            require('./sanitization'),

            // Request handler
            function handleRequest (req, res, next) {
                route.handler(req)
                .then(r => {
                    res.status(200).json(r.toObject());
                })
                .catch(e => {
                    next(e);
                });
            },

            // Error handler
            require('./error')
        );
    });
};
