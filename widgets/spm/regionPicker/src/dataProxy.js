define(function (require, exports, module) {

    var $ = require("$");

    var regionData = require("./regionData");

    /*
     DataProxy, load data from remote json files, and cache these files
     the callback function will be call with 2 arguments, the first one is DataProxy object,
     and another one is RegionCollection object
     @param {String} remote, the URI path of remote files
     @param {Function} init, callback function
     @return {Object} DataProxy object
     @example: new DataProxy('/remote/', function(proxy, collection){})
     */
    var DataProxy = ChineseRegion.DataProxy = function (remote, init) {
        this._remote = (remote + '/').replace(/\/+/g, '/');

        this.load('all', function (collection, proxy) {
            if (ChineseRegion.ifn(init)) {
                init(proxy, collection);
            }
        });
        return this;
    };

    DataProxy.prototype = {
        /**
         Convert region ID to special format, in order to match the json filename
         @param {String} id
         @return {String}
         @example: _index('310105') should get '310000'
         */
        _index: function (id) {
            return id.replace(/\d{4}$/, '0000');
        },

        /**
         Convert region ID to special cache-id format, in order to cache a collection totally
         @param {String} id
         @return {String}
         @example: _cacheid('310105') should get 'cached_310000'
         */
        _cacheid: function (id) {
            return 'cached_' + this._index(id);
        },

        /**
         Convert region ID to related json-file's url
         @param {String} id
         @return {String}
         @example: _url('310105') should get '/a_remote_path/310105.json'
         */
        _url: function (id) {
            return this._remote + this._index(id) + '.json';
        },

        /**
         Load data asynchoronize, the callback function will call with 2 arguments,
         the first is RegionCollection object,
         and the second is DataProxy object

         @param {String} id
         @param {Function} callback function,
         @exapmle load('310105', function(collection, proxy){})
         */
        load: function (id, f) {
            var self = this, cache_id = this._cacheid(id);
            if (!ChineseRegion.ifn(f)) {
                f = function () {
                };
            }

            if (ChineseRegion._caches[cache_id]) {
                f(new RegionCollection(ChineseRegion._caches[cache_id], cache_id), self);
                return;
            }

            ChineseRegion._caches[cache_id] = (id == "all" ? window.RegionDataSource : window.RegionDataCache[id]);
            f(new RegionCollection((id == "all" ? window.RegionDataSource : window.RegionDataCache[id]), cache_id), self);
        },

        /**
         Provide cached collections
         @return {Array}
         */
        collections: function () {
            var coll = [];
            for (var i in ChineseRegion._caches) {
                coll.push(new RegionCollection(ChineseRegion._caches[i], i));
            }
            return coll;
        },

        /**
         Get a collection named the specified argument
         @param {String} value
         @return {Array}
         @example: collection('index'), collection('310105')
         */
        collection: function (value) {
            var cid = this._cacheid(value);
            return this.collections().filter(function (c) {
                return c.name === cid;
            })[0];
        },

        /**
         Provide the index collection
         @return {Array}
         */
        indices: function () {
            return this.collection('all');
        }
    };

});