define(function (require, exports, module) {

    var $ = require("$");

    var juicer = require('./juicer');

    var iPageCss = require("./iPage.css");

    var iPage = function(options) {
        $.extend(this, iPage.defaults, options);
        this.init();
    };

    /**
     * iPage defaults
     */
    iPage.defaults = {
        target:"", //可以是ID或node对象
        pageSize:0, //每页显示条数
        pageShow:7, //要显示的页数  0表示全部显示
        tpl:'<div class="mi-paging fn-right"> <span class="mi-paging-info fn-ml15">每页</span> <div class="mi-paging-select mi-paging-select-normal-border" data-role="sizeSelect"> <p data-role="sizeValue">${pageSize}</p> <ul data-role="sizeOptions"> <li data-role="sizeOpt">10</li> <li data-role="sizeOpt" class="bg-gray">20</li> <li data-role="sizeOpt">50</li> </ul> <div class="arrow" data-role="sizeSelect"> <div></div> </div> </div><span class="mi-paging-info mi-paging-which"> <input type="text" name="pageRedirect" value="${currentPage}" data-role="gotoNum" /> </span> <a class="mi-paging-item mi-paging-goto" href="javascript:void(0)" data-role="goto"><span class="paging-text">跳转</span></a> <span class="mi-paging-info fn-ml15"><span class="paging-text mi-paging-bold">${currentPage}/${totalPage}</span>页</span>{@if isFirstPage } <span href="#" class="mi-paging-item mi-paging-prev mi-paging-prev-disabled fn-mr10"><span class="paging-text">上一页</span><span class="mi-paging-icon"></span></span> {@else} <a href="#" class="mi-paging-item mi-paging-prev fn-mr10" data-role="prev"><span class="paging-text">上一页</span><span class="mi-paging-icon"></span></a> {@/if}{@if isLastPage } <span href="#" class="mi-paging-item mi-paging-next mi-paging-next-disabled"><span class="paging-text">下一页</span><span class="mi-paging-icon"></span></span> {@else} <a href="#" class="mi-paging-item mi-paging-next" data-role="next"><span class="paging-text">下一页</span><span class="mi-paging-icon"></span></a> {@/if} </div>',  //模板
        totalSize:0, //数据总数
        currentPage:1, //当前显示第几页
        beforeChange:null,//翻页前的回调方法
        onChange:null, //翻页的回调方法
        auto:true //自动填充Dom对象to target
    };

    iPage.prototype = {
        init:function() {

            if(this.target && typeof (this.target) == "string"){
                this.target = $(this.target);
            }
            if(this.target && this.auto){
                this.gotoPage(this.currentPage);
            }else{
                this.initAttr();
            }
        },

        initAttr : function(){

            this.currentPage = ~~this.currentPage;
            this.totalSize = ~~this.totalSize;
            this.pageShow = ~~this.pageShow;
            this.pageSize = ~~this.pageSize;

            if(this.currentPage < 1){
                this.currentPage = 1;
            }

            if(this.currentPage > this.totalPage) {
                this.currentPage = this.totalPage;
            }

            this.realPageSize = (this.pageSize > this.totalSize) ? this.totalSize : this.pageSize;

            this.totalPage = (this.realPageSize == 0 ? 1 : Math.ceil(this.totalSize / this.realPageSize));

            var arr = [],start,end;

            if(this.pageShow == 0 || this.pageShow >= this.totalPage){
                start = 1;
                end = this.totalPage;
            }else{
                var temp = Math.floor(this.pageShow/2);
                start = this.currentPage - temp;
                end  =  start + this.pageShow -1;
                if(start < 1){
                    start = 1;
                    end = this.pageShow;
                }

                if(end > this.totalPage){
                    end=this.totalPage;
                    start =  end -  this.pageShow +1
                }

            }
            for (; start <= end; start++) {
                arr.push(start);
            }

            this.pageNumbers = arr;
            this.currentFrom = this.realPageSize * (this.currentPage-1) + 1;
            this.currentTo =  this.realPageSize * this.currentPage;
            this.isFirstPage = (this.currentPage == 1);
            this.isLastPage = (this.currentPage == this.totalPage);

        },



        /**
         * 根据dom data-role绑定相应事件
         * data-role="prev" 跳转上一页
         * data-role="next" 跳转下一页
         * data-role="first" 跳转首页
         * data-role="last" 跳转尾页
         * data-role="goto" 跳转指定页
         * data-role="current" 当前页
         */
        bindEvents:function () {
            var that = this;
            this.targetHandler =this.target.click(function (e) {
                if(that.changing){
                    return false;
                }
                that.changing = true;
                var $el = $(e.target),
                    roleVal = $el.attr("data-role") || $el.parent().attr("data-role");
                switch (roleVal) {
                    case "prev":
                        that.gotoPage(that.getPrevPageIndex());
                        break;
                    case "next":
                        that.gotoPage(that.getNextPageIndex());
                        break;
                    case "first":
                        that.gotoPage(1);
                        break;
                    case "last":
                        that.gotoPage(that.totalPage);
                        break;
                    case "goto":
                        that.gotoPage(that.target.find("[data-role=gotoNum]").val());
                        break;
                    case "pageNum":
                        if($el.attr("data-role") == "pageNum"){
                            $el = $el.children(":first");
                        }
                        that.gotoPage($el.html());
                        break;
                    case "sizeSelect"://选择PageSize
                        that.target.find("[data-role=sizeOptions]").toggle();
                        break;
                    case "sizeOpt"://选择PageSize
                        that.pageSize = ~~$el.html();
                        that.gotoPage(1);
                        break;
                    default:

                        if (!$el.parents("[data-role=sizeSelect]").length) {
                            that.target.find("[data-role=sizeOptions]").hide();
                        }

                        break;
                }

                that.changing = false;
            });

            $(window).click(function (e) {

                if (!$(e.target).parents("[data-role=sizeSelect]").length) {
                    that.target.find("[data-role=sizeOptions]").hide();
                }

            });
        },

        destroy:function(){
            this.target.unbind("click").html("");
        },

        pgNumInputBindEvents: function() {
            var that = this, $pgNumInput = this.target.find("[data-role=gotoNum]");
            $pgNumInput.keypress(function(e) {
                var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
                if (key == 13) {
                    that.gotoPage(parseInt($pgNumInput.val(), 10));
                }
            });
        },

        /**
         * 获取当前页的前一页
         * @return {Number}
         */
        getPrevPageIndex:function() {
            this.currentPage = ~~this.currentPage;
            return this.currentPage - 1 > 1 ? this.currentPage - 1 : 1;
        },
        /**
         * 获取当前页的下一页页码
         * @return {Number}
         */
        getNextPageIndex:function() {
            this.currentPage = ~~this.currentPage;
            this.totalPage = ~~this.totalPage;
            return this.currentPage + 1 <= this.totalPage ? this.currentPage + 1 : this.totalPage;
        },
        /**
         * 跳转到指定页
         * @param {Number} 需要跳转的页码
         */
        gotoPage:function(pgNum) {
            this.currentPage = ~~pgNum;
            this.initAttr();
            this.beforeChange && this.beforeChange.call(this);
            this.renderPage();
            this.onChange && this.onChange.call(this);
        },

        /**
         * 计算分页数值，起始页数，末尾页数
         */
        renderPage:function() {

            if(this.totalPage > 1){
                this.target.html(juicer.to_html(this.tpl, this));
                if(!this.hasBindEvents){
                    //分页标签点击事件绑定，绑在target上，只要绑定一次
                    this.bindEvents();
                    this.hasBindEvents = true;
                }
                //输入页码框事件绑定，每次render后要重新绑定
                this.pgNumInputBindEvents();

            }else {
                this.target.html("");
            }
        }
    };


    return iPage;

});
