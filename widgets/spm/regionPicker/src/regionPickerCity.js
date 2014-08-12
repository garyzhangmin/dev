define(function (require, exports, module) {

    var $ = require("$");

    var RegionPicker = require("./jqueryrp.js");

    var dataSource = require("./regionDataCity.js");

    var regionPickerCss = require("./regionPicker.css");

    (function ($) {

        $.fn.regionPicker = function (options) {
            return this.each(function () {
                var self = $(this), data = self.data("regionpicker");
                if (!data) {
                    var opts = $.extend(self.data(), options || {});
                    self.data('regionpicker', (data = new RegionPicker(self, opts, dataSource)));
                }
            });
        };

        $.getRegionById = function (id, ds) {
            var rg;
            ds = ds || dataSource;
            for (var i = 0, l = ds.length; i < l; i++) {
                if (ds[i]["i"] == id) {
                    rg = ds[i];
                } else if (ds[i]["c"] && ds[i]["c"].length) {
                    rg = $.getRegionById(id, ds[i]["c"]);
                }
                if (rg) return rg;
            }
            return false;
        };

        $.getRegionByName = function (name, ds) {
            var rg;
            ds = ds || dataSource;
            for (var i = 0, l = ds.length; i < l; i++) {
                if (ds[i]["n"] == name) {
                    rg = ds[i];
                } else if (ds[i]["c"] && ds[i]["c"].length) {
                    rg = $.getRegionByName(name, ds[i]["c"]);
                }
                if (rg) return rg;
            }
            return false;
        };

    })($);

});