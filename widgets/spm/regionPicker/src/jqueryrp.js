define(function (require, exports, module) {

    var $ = require("$");

    var ChineseRegion = require("./chineserp.js");


    'use strict';

    /**
     * RegionPicker
     * @param {Object} el, source element
     * @param {Object} options
     * @return {Object} RegionPicker object
     */
    var RegionPicker = function (el, options , dataSource) {
        this.el = el;
        this.options = $.extend({
            remote: '',
            picked: '',
            visible: 10,
            animate: 0,
            listWidth:200,
            restrict : false,
            selectAll:false//可以选择所有地区
        }, options || {});


        if(this.options.selectAll){
            dataSource = [{
                "c": [
                ],
                "i": "000000",
                "n": "所有地区"
            }].concat(dataSource)
        }


        this.picker = null;

        this.options.picked = String(this.options.picked);
        this.options.visible = parseInt(this.options.visible, 10) || 10;
        this.options.animate = parseInt(this.options.animate, 10) || 0;

        this.data = { regions: [], collections: [] };

        this.el.on('initializing.rp', $.proxy(this._onInitializing, this));
        this.el.on('initialized.rp', $.proxy(this._onInitialized, this));

        var that = this;
        $(document).on('click', function(e){

            that._onCloserClick(e);

        });


        new ChineseRegion.RegionPicker({
            remote: this.options.remote,
            initialized: $.proxy(this._preInitialize, this),
            dataSource:dataSource
        });
    };

    RegionPicker.prototype = {
        constructor: RegionPicker,

        /**
         * _preInitialize, fired when ChineseRegion.RegionPicker initialized
         * @param {Object} picker, ChineseRegion.RegionPicker object
         * @return undefined
         */
        _preInitialize: function (picker) {
            this.picker = picker;
            this.el.trigger('initializing.rp', [this]);
            var pickId = this.options.picked;
            this.picker.pick(this.options.picked, $.proxy(function (regions, collections) {

//                if(regions[0] && regions[0].i == "000000"){
//                    regions[0].i = "";
//                }
                collections = collections || [];

                if(!pickId){
                    this.data.regions = [];
                    this.data.collections = collections.slice(0,1);
                }else if(pickId == regions[0]["i"]){
                    this.data.regions = regions.slice(0,1);
                    this.data.collections = collections.slice(0,2);
                }else if(pickId == regions[1]["i"]){
                    this.data.regions = regions.slice(0,2);
                    this.data.collections = collections.slice(0,3);
                }else{
                    this.data.regions = regions;
                    this.data.collections = collections;
                }

//                this.data.regions = [];
//                this.data.collections = collections.slice(0,1);
//                this.data.regions = regions;
//                this.data.collections = collections;
                this.el.trigger('initialized.rp', [this]);
            }, this));
        },

        /**
         * _onInitializing, fired after ChineseRegion.RegionPicker initialized,
         * before the picker has picked the initial value that specified in options.picked
         * @return undefined
         */
        _onInitializing: function () {

            var that = this;

            this.renderer = $('<div id="region-picker" style="position:absolute;display:none;"></div>')
                .append('<a href="javascript:;" class="region-picker-closer" title="cancel">&#215;</a>')
                .append('<div class="regions"></div>')
                .appendTo('body');

            this.renderer.on('rendered', '.region-list', $.proxy(this._onListRendered, this));
            this.renderer.on('reveal', $.proxy(this._render, this));
            this.renderer.on('picked', '.region-list li', $.proxy(this._onItemPicked, this));
            this.renderer.on('click', '.region-list li', function(e){
                that._onItemClick(e);
                e.stopPropagation();
            });
            this.renderer.on('click', '.region-picker-closer', function(e){
                that._onCloserClick(e);
                e.stopPropagation();
            });
        },

        /**
         * _onInitialized, fired after the picker has picked the initial value that specified in options.picked
         * @return undefined
         */
        _onInitialized: function () {

            var that = this;

            this.el.on('click', function(e){

                that._onClick(e);

                e.stopPropagation();
            });

        },

        /**
         * _onClick, fired when the source element clicked
         * @param {Object} e, event object
         * @return undefined
         */
        _onClick: function (e) {
            e.preventDefault();
            if (this.renderer.css('display') !== 'none') {
                return;
            }
            var offset = this.el.offset();
            this.renderer.css({
                top: offset.top + this.el.outerHeight(true),
                left: offset.left
            }).fadeIn(this.options.animate).trigger('reveal');

        },

        /**
         * _onItemClick, fired when a region item clicked
         * @param {Object} e, event object
         * @return undefined
         */
        _onItemClick: function (e) {

            var that = this;

            var el = $(e.currentTarget), id = el.attr('data-id');
            e.preventDefault();

            this.el.trigger('loading.rp', this);
            this.picker.pick(id, $.proxy(function (regions, collections) {

//                if(regions[0] && regions[0].i == "000000"){
//                    regions[0].i = "";
//                }
//                collections = collections || [];

                if(!that.options.restrict && el.hasClass("picked")){
                    for(var i=0;i<regions.length;i++){
                        if(id == regions[i].i){
                            regions = regions.slice(0,i+1);
                            break;
                        }
                    }
                }

                this.data.regions = regions;
                this.data.collections = collections;
                this.el.trigger('loaded.rp', [this.data, this]);

                var leafNode = (regions[regions.length - 1] && id === regions[regions.length - 1].i);

                if (leafNode) {

                    if(regions[0] && regions[0].i == "000000"){
                        this.el.trigger('picked.rp', [[{
                            "c": [
                            ],
                            "i": "",
                            "n": "所有地区"
                        }], this]);
                    }else{
                        this.el.trigger('picked.rp', [regions, this]);
                    }


                    this._onCloserClick(e);
                } else {
                    this.renderer.trigger('reveal');
                }
            }, this));
        },

        /**
         * _onItemPicked, fired when a region item get a 'picked' css class
         * @param {Object} e, event object
         * @param {Object} list, the list which contains current element
         * @param {Number} index, current element index of it's parent
         * @param {Number} height, the height in pixel of region item
         * @return undefined
         */
        _onItemPicked: function (e, list, index, height) {
            e.stopPropagation();

            //scroll picked item into view
            var offset = index - this.options.visible + 1;
            if (offset >= 0) {
                list.animate({scrollTop: (offset + 1) * height}, Math.max(this.options.animate * 1.5, 200));
            }
        },

        /**
         * _onCloserClick, fired when close button clicked
         * @param {Object} e, event object
         * @return undefined
         */
        _onCloserClick: function (e) {
            if (e.type === 'click' || (e.type === 'keydown' && e.which === 27)) {
                e.stopPropagation();
                if (this.renderer.css('display') !== 'none') {
                    this.renderer.fadeOut(this.options.animate);
                }
            }
        },

        /**
         * _onListRendered, fired when a region list has appended into it's parent element
         * @param {Object} e, event object
         * @param {Object} region, region object which has the same index number of current list in a collection
         * @return undefined
         */
        _onListRendered: function (e, region) {
            var list = $(e.currentTarget);
            var h = $('li:first', list).outerHeight(true);
            list.height(this.options.visible * h);
            list.width(this.options.listWidth);
            $('li', list).each(function (i) {
                if (region && $(this).attr('data-id') === region.i) {
                    $(this).addClass('picked').trigger('picked', [list, i, h]);
                }
            });
        },

        /**
         * _render, fired when current plugin has shown
         * @return undefined
         */
        _render: function () {
            var container = $('.regions', this.renderer).empty(), w=0;
            for (var i = 0; i < this.data.collections.length; i++) {

                var $regionList = $('<ul class="region-list"></ul>');

                var items = this._renderItems(this.data.collections[i]);

                for(var j = 0; j < items.length; j++){
                    $regionList.append(items[j]);
                }

                $regionList.appendTo(container).trigger('rendered', [this.data.regions[i]]);
                w+=$regionList.outerWidth()+parseInt($regionList.css("marginLeft"))+parseInt($regionList.css("marginRight"));//css - margin:5
            }

            container.width(w);
        },

        _renderItems: function (collection) {
            var items = [], r;
            for (var i = 0; i < collection.length; i++) {
                r = collection[i];
                items.push($('<li data-id="' + r.i + '">' + r.n + '</li>').fadeIn(this.options.animate));
            }
            return items;
        }
    };


    return RegionPicker;

});