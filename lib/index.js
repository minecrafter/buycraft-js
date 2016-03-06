"use strict";
var request = require('superagent');
var BuycraftAPI = (function () {
    function BuycraftAPI(secret) {
        this.secret = secret;
    }
    BuycraftAPI.prototype.doJsonGet = function (path, callback) {
        request.get('https://plugin.buycraft.net' + path)
            .set('X-Buycraft-Secret', this.secret)
            .end(function (err, response) {
            if (err) {
                if (typeof err.response.body.error_code !== 'undefined') {
                    // Buycraft error
                    callback(new Error(err.response.body.error_message), null);
                    return;
                } else {
                    callback(err, null);
                    return;
                }
            }
            callback(null, response.body);
        });
    };
    /**
     * Retrieves information about this server, webstore and the account associated with it.
     * @param callback
     */
    BuycraftAPI.prototype.information = function (callback) {
        this.doJsonGet('/information', function (err, result) {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, result);
        });
    };
    /**
     * Retrieves a full listing of all items available for purchase.
     * @param callback
     */
    BuycraftAPI.prototype.listing = function (callback) {
        this.doJsonGet('/listing', function (err, result) {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, result);
        });
    };
    /**
     * Retrieves a full listing of players with players due.
     * @param page the page to start from, default is 0
     * @param callback
     */
    BuycraftAPI.prototype.duePlayers = function (page, callback) {
        var realCallback = (typeof page === 'function' ? page : callback);
        var realPage = (typeof page === 'function' ? 0 : page);
        this.doJsonGet('/queue?page=' + realPage, function (err, result) {
            if (err) {
                realCallback(err, null);
                return;
            }
            realCallback(null, result);
        });
    };
    /**
     * Retrieves a full listing of commands that should be executed immediately.
     * @param callback
     */
    BuycraftAPI.prototype.getOfflineCommands = function (callback) {
        this.doJsonGet('/queue/offline-commands', function (err, result) {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, result);
        });
    };
    /**
     * Retrieves a listing of commands for a specific player.
     * @param id the player ID
     * @param callback
     */
    BuycraftAPI.prototype.getOnlineCommands = function (id, callback) {
        this.doJsonGet('/queue/online-commands/' + id, function (err, result) {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, result);
        });
    };
    /**
     * Marks the specified commands as completed.
     * @param ids the command ID(s) to mark completed
     * @param callback
     */
    BuycraftAPI.prototype.deleteCommands = function (ids, callback) {
        request.del('https://plugin.buycraft.net/queue')
            .set('X-Buycraft-Secret', this.secret)
            .query({ 'ids[]': ids })
            .end(function (err, response) {
                if (err) {
                    if (typeof err.response.body.error_code !== 'undefined') {
                        // Buycraft error
                        callback(new Error(err.response.body.error_message), false);
                    } else {
                        callback(err, false);
                    }
                } else {
                    callback(null, response.status == 204);
                }
            });
    };
    /**
     * Retrieves the list of most recent payments.
     * @param limit the limit on what payments to retrieve, API limits to 100
     * @param callback
     */
    BuycraftAPI.prototype.getRecentPayments = function (limit, callback) {
        request.get('https://plugin.buycraft.net/payments')
            .set('X-Buycraft-Secret', this.secret)
            .query({ limit: limit })
            .end(function (err, response) {
                if (err) {
                    if (typeof err.response.body.error_code !== 'undefined') {
                        // Buycraft error
                        callback(new Error(err.response.body.error_message), null);
                        return;
                    } else {
                        callback(err, null);
                        return;
                    }
                }
                callback(null, response.body);
            });
    };
    /**
     * Creates a checkout link.
     * @param username the username to checkout for
     * @param package_id the package ID to be checked out
     * @param callback
     */
    BuycraftAPI.prototype.createCheckoutLink = function (username, package_id, callback) {
        request.post('https://plugin.buycraft.net/checkout')
            .set('X-Buycraft-Secret', this.secret)
            .query({ username: username, package_id: package_id })
            .end(function (err, response) {
                if (err) {
                    if (typeof err.response.body.error_code !== 'undefined') {
                        // Buycraft error
                        callback(new Error(err.response.body.error_message), null);
                        return;
                    } else {
                        callback(err, null);
                        return;
                    }
                }
                callback(null, response.body);
            });
    };
    return BuycraftAPI;
}());
module.exports = BuycraftAPI;
