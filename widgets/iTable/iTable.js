/** begin ---iTable.js---*/
(function() {

    iTable = function(options) {

        $.extend(this, iTable.defaults, options);
        //target可以是id 或 node对象
        if(typeof (this.target) == "string"){
            this.target = $("#"+this.target);
        }else if(typeof (this.target) == "object"){
            this.target = $(this.target);
        }
        this.target && this.init();
    };

    iTable.defaults = {
        target:document.body,
        tableTpl: '%20%3Cdiv%20class%3D%22mi-itable%20mi-corner-top%20mi-corner-bottom%22%20style%3D%22width%3A%24%7BcontainerWidth%7Dpx%3B%22%20data-role%3D%22tableSelf%22%3E%0A%20%0A%20%20%20%20%20%3Cdiv%20class%3D%22mi-itable-container%22%20style%3D%22width%3A%24%7BcontainerWidth%7Dpx%3B%22%3E%0A%20%20%20%20%20%3C%21--iTable%20topBar--%3E%0A%20%20%20%20%20%3Cdiv%20class%3D%22mi-tb-titlebar%20mi-corner-top%20mi-helper-clearfix%22%20data-role%3D%22topBar%22%3E%0A%20%20%20%20%20%20%20%20%20%3Cdiv%3E%3C%2Fdiv%3E%0A%20%20%20%20%20%20%20%20%20%3Cdiv%20class%3D%22mi-tb-search%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class%3D%22add-on%22%3E%E6%90%9C%E7%B4%A2%3C%2Fspan%3E%3Cinput%20class%3D%22search-input%22%20size%3D%2216%22%20type%3D%22text%22%20data-role%3D%22search%22%3E%0A%20%20%20%20%20%20%20%20%20%3C%2Fdiv%3E%0A%20%20%20%20%20%3C%2Fdiv%3E%0A%20%20%20%20%20%3C%21--iTable%20topBar--%3E%0A%20%0A%20%20%20%20%20%3C%21--iTable%20table%20head--%3E%0A%20%20%20%20%20%3Cdiv%20style%3D%22width%3A%24%7BcontainerWidth%7Dpx%3B%20display%3A%20block%3B%22%20class%3D%22mi-state-default%20mi-grid-hdiv%22%20data-role%3D%22theadContainer%22%3E%0A%20%20%20%20%20%20%20%20%20%3Cdiv%20class%3D%22mi-grid-hbox%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ctable%20class%3D%22mi-grid-htable%22%20cellspacing%3D%220%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20cellpadding%3D%220%22%20border%3D%220%22%20style%3D%22width%3A%24%7BtableWidth%7Dpx%3B%22%20data-role%3D%22table%5Fhead%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cthead%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ctr%20class%3D%22mi-grid-labels%20mi-row-ltr%22%20data-role%3D%22rowheader%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7B%40each%20columns%20as%20column%2Cindex%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cth%20style%3D%22width%3A%24%7Bcolumn.width%7Dpx%3B%22%20class%3D%22mi-state-default%20mi-th-column%20mi-th-ltr%22%20idx%3D%22%24%7Bindex%7D%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class%3D%22mi-grid-resize%20mi-grid-resize-ltr%22%20style%3D%22cursor%3A%20col-resize%3B%22%20data-role%3D%22resizeBar%22%3E%26nbsp%3B%3C%2Fspan%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class%3D%22mi-sort-wrapper%20mi-th-div-ie%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7B%40if%20column.sortType%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cspan%20class%3D%22mi-sort-default%22%20data-role%3D%22sortIcon%22%3E%24%7Bcolumn.name%7D%3C%2Fspan%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7B%40else%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%24%7Bcolumn.name%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7B%40%2Fif%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%2Fdiv%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%2Fth%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7B%40%2Feach%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%2Ftr%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%2Fthead%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%2Ftable%3E%0A%20%20%20%20%20%20%20%20%20%3C%2Fdiv%3E%0A%20%20%20%20%20%3C%2Fdiv%3E%0A%20%20%20%20%20%3C%21--iTable%20table%20head--%3E%0A%20%0A%20%20%20%20%20%3C%21--iTable%20table%20data--%3E%0A%20%20%20%20%20%3Cdiv%20class%3D%22mi-grid-bdiv%22%20style%3D%22height%3A%20%24%7BdataHeight%7Dpx%3B%20width%3A%24%7BcontainerWidth%7Dpx%3B%22%20data-role%3D%22tbodyContainer%22%3E%0A%20%20%20%20%20%20%20%20%20%3Cdiv%20style%3D%22position%3Arelative%3B%22%20data-role%3D%22dataGrid%22%3E%0A%20%20%20%20%20%20%20%20%20%3C%2Fdiv%3E%0A%20%20%20%20%20%3C%2Fdiv%3E%0A%20%0A%20%20%20%20%20%3C%2Fdiv%3E%0A%20%20%20%20%20%3C%21--iTable%20table%20data--%3E%0A%20%0A%20%20%20%20%20%3Cdiv%20class%3D%22mi-resize-bar%22%20data-role%3D%22resizeBarMark%22%3E%26nbsp%3B%3C%2Fdiv%3E%0A%20%0A%20%20%20%20%20%3C%21--iTable%20pageBar--%3E%0A%20%20%20%20%20%3Cdiv%20class%3D%22mi-tb-pagebar%20mi-corner-bottom%20mi-helper-clearfix%22%20style%3D%22%7B%40if%20page.totalPage%20%3C%3D%201%20%7Ddisplay%3Anone%3B%7B%40%2Fif%7D%22%20data-role%3D%22pageBar%22%3E%0A%20%0A%20%20%20%20%20%3C%2Fdiv%3E%0A%20%20%20%20%20%3C%21--iTable%20pageBar--%3E%0A%20%0A%20%3C%2Fdiv%3E%0A',
        gridTpl:  '%20%3Ctable%20class%3D%22mi-grid-table%22%20cellpadding%3D%220%22%20cellspacing%3D%220%22%20style%3D%22width%3A%24%7BtableWidth%7Dpx%3B%22%20data-role%3D%22gridTable%22%3E%0A%20%20%20%20%20%3Ctbody%3E%0A%20%20%20%20%20%3Ctr%20style%3D%22height%3Aauto%22%20class%3D%22%20mi-row-ltr%22%20data-role%3D%22%22%3E%0A%20%20%20%20%20%20%20%20%20%7B%40each%20columns%20as%20column%2Cindex%7D%0A%20%20%20%20%20%20%20%20%20%3Ctd%20data-role%3D%22col%5F%24%7Bindex%7D%5Fbody%22%20style%3D%22height%3A0px%3Bwidth%3A%24%7Bcolumn.width%7Dpx%3Bpadding-top%3A0%3Bpadding-bottom%3A0%3B%22%3E%3C%2Ftd%3E%0A%20%20%20%20%20%20%20%20%20%7B%40%2Feach%7D%0A%20%20%20%20%20%3C%2Ftr%3E%0A%20%0A%20%20%20%20%20%7B%40if%20rows.length%20%3D%3D%200%20%7D%0A%20%20%20%20%20%3Ctr%20class%3D%22mi-row-ltr%20grid-row%22%20dataindex%3D%220%22%3E%0A%20%20%20%20%20%20%20%20%20%3Ctd%20style%3D%22text-align%3A%20center%3B%22%20colspan%3D%227%22%3E%E6%B2%A1%E6%9C%89%E6%82%A8%E8%A6%81%E6%90%9C%E7%B4%A2%E7%9A%84%E5%86%85%E5%AE%B9%3C%2Ftd%3E%0A%20%20%20%20%20%3C%2Ftr%3E%0A%20%20%20%20%20%7B%40else%7D%0A%20%20%20%20%20%7B%40each%20rows%20as%20row%2Cindex%7D%0A%20%20%20%20%20%7B%40if%20index%20%3E%3D%20page.currentFrom-1%20%26%26%20index%20%3C%3D%20page.currentTo-1%20%7D%0A%20%20%20%20%20%3Ctr%20class%3D%22%7B%40if%20index%252%20%21%3D%3D0%7Dmi-itable-spliter%7B%40%2Fif%7D%20mi-row-ltr%20grid-row%20%7B%40if%20row.selected%7Dmi-state-highlight%7B%40%2Fif%7D%22%20dataIndex%3D%22%24%7Bindex%7D%22%3E%0A%20%20%20%20%20%20%20%20%20%7B%40each%20row.cells%20as%20cell%2Cindex2%7D%0A%20%20%20%20%20%20%20%20%20%3Ctd%7B%40if%20columns%5Bindex2%5D.align%7D%20style%3D%22text-align%3A%20%24%7Bcolumns%5Bindex2%5D.align%7D%3B%22%7B%40%2Fif%7D%3E%24%24%7Bcell%7Chighlight%7D%3C%2Ftd%3E%0A%20%20%20%20%20%20%20%20%20%7B%40%2Feach%7D%0A%20%20%20%20%20%3C%2Ftr%3E%0A%20%20%20%20%20%7B%40%2Fif%7D%0A%20%20%20%20%20%7B%40%2Feach%7D%0A%20%0A%20%20%20%20%20%7B%40%2Fif%7D%0A%20%20%20%20%20%3C%2Ftbody%3E%0A%20%3C%2Ftable%3E%0A',
        pageTpl : '%20%3Cdiv%20class%3D%22fn-left%22%3E%0A%20%20%20%20%20%3Cspan%20class%3D%22mi-paging-info%20mi-paging-info-left%22%3E%3Cstrong%3E%24%7BcurrentFrom%7D%3C%2Fstrong%3E%20-%20%3Cstrong%3E%24%7BcurrentTo%7D%3C%2Fstrong%3E%20%2F%20%3Cstrong%3E%24%7BtotalSize%7D%3C%2Fstrong%3E%20%E6%9D%A1%3C%2Fspan%3E%0A%20%3C%2Fdiv%3E%0A%20%3Cdiv%20class%3D%22mi-paging%20fn-right%22%3E%0A%20%0A%20%20%20%20%20%7B%40if%20isFirstPage%20%7D%0A%20%20%20%20%20%20%20%20%20%3Cspan%20class%3D%22mi-paging-first%22%20data-role%3D%22first%22%3E%E9%A6%96%E9%A1%B5%3C%2Fspan%3E%0A%20%20%20%20%20%20%20%20%20%3Cspan%20class%3D%22mi-paging-prev%22%3E%E4%B8%8A%E4%B8%80%E9%A1%B5%3C%2Fspan%3E%0A%20%20%20%20%20%7B%40else%7D%0A%20%20%20%20%20%20%20%20%20%3Ca%20href%3D%22javascript%3Avoid%280%29%22%20class%3D%22mi-paging-first%22%20data-role%3D%22first%22%3E%E9%A6%96%E9%A1%B5%3C%2Fa%3E%0A%20%20%20%20%20%20%20%20%20%3Ca%20href%3D%22javascript%3Avoid%280%29%22%20class%3D%22mi-paging-prev%22%20data-role%3D%22prev%22%3E%E4%B8%8A%E4%B8%80%E9%A1%B5%3C%2Fa%3E%0A%20%20%20%20%20%7B%40%2Fif%7D%0A%20%0A%20%20%20%20%20%7B%40each%20pageNumbers%20as%20it%2Cindex%7D%0A%20%0A%20%20%20%20%20%20%20%20%20%7B%40if%20it%20%3D%3D%20currentPage%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ca%20href%3D%22javascript%3Avoid%280%29%22%20class%3D%22mi-paging-item%20mi-paging-current%22%20data-role%3D%22current%22%3E%3Cspan%3E%24%7Bit%7D%3C%2Fspan%3E%3C%2Fa%3E%0A%20%20%20%20%20%20%20%20%20%7B%40else%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ca%20href%3D%22javascript%3Avoid%280%29%22%20class%3D%22mi-paging-item%22%20data-role%3D%22pageNum%22%3E%3Cspan%3E%24%7Bit%7D%3C%2Fspan%3E%3C%2Fa%3E%0A%20%20%20%20%20%20%20%20%20%7B%40%2Fif%7D%0A%20%0A%20%20%20%20%20%7B%40%2Feach%7D%0A%20%0A%20%20%20%20%20%7B%40if%20isLastPage%20%7D%0A%20%20%20%20%20%20%20%20%20%3Cspan%20class%3D%22mi-paging-next%22%3E%E4%B8%8B%E4%B8%80%E9%A1%B5%3C%2Fspan%3E%0A%20%20%20%20%20%20%20%20%20%3Cspan%20class%3D%22mi-paging-last%22%3E%E5%B0%BE%E9%A1%B5%3C%2Fspan%3E%0A%20%20%20%20%20%7B%40else%7D%0A%20%20%20%20%20%20%20%20%20%3Ca%20href%3D%22javascript%3Avoid%280%29%22%20class%3D%22mi-paging-next%22%20data-role%3D%22next%22%3E%E4%B8%8B%E4%B8%80%E9%A1%B5%3C%2Fa%3E%0A%20%20%20%20%20%20%20%20%20%3Ca%20href%3D%22javascript%3Avoid%280%29%22%20class%3D%22mi-paging-last%22%20data-role%3D%22last%22%3E%E5%B0%BE%E9%A1%B5%3C%2Fa%3E%0A%20%20%20%20%20%7B%40%2Fif%7D%0A%20%0A%20%20%20%20%20%3Cspan%20class%3D%22mi-paging-info%20fn-ml0%22%3E%3Cspan%20class%3D%22mi-paging-info%20mi-paging-which%22%3E%3Cinput%20type%3D%22text%22%20data-role%3D%22gotoNum%22%20value%3D%22%24%7BcurrentPage%7D%22%3E%3C%2Fspan%3E%2F%3Cstrong%3E%24%7BtotalPage%7D%3C%2Fstrong%3E%20%E9%A1%B5%3C%2Fspan%3E%0A%20%3C%2Fdiv%3E%0A',
        dataHeight:"",
        columns:[],
        rows:[],
        headers:[],
        searchDefer : 100,
        searchVal:"",
        currentPage:1,
        pageSize:30,
        pageShow:5,
//        multiSelect:false, //行多选
        onSort:function() {
        },
        onResize:function() {
        },
        onSearch:function() {
        }
    }

    iTable.prototype = {
        init:function() {
            this.initData();
            this.buildPage();
            this.buildTable();
            this.renderDataGrid();
            //计算itable 标题和数据的实际高度
            this.tableHeight = this.theadContainer.outerHeight() + this.tbodyContainer.outerHeight() - 6;
            this.theadBindEvents();
            this.searchBindEvents();
        },

        //初始化构造iTable的数据
        initData:function(){
            var that=this,sumWidth = 0, cw;
            //计算table宽度，容器宽度
            for(var i=0,l=this.columns.length;i<l;i++){
                cw = parseInt(this.columns[i].width);
                if(isNaN(cw)){
                    cw = 100;
                }
                this.columns[i].width = cw;
                sumWidth+=cw;
            }
            this.tableWidth = sumWidth+35;
            this.containerWidth = sumWidth+35+20;

            //模板String decode
            this.gridTpl = decodeURIComponent(this.gridTpl.replace(/\+/g," "));
            this.pageTpl = decodeURIComponent(this.pageTpl.replace(/\+/g," "));
            this.tableTpl = decodeURIComponent(this.tableTpl.replace(/\+/g," "));



            //设置rows数据源缓存
            this.rowsCache = this.rows;
            //juicer 模板注册搜索高亮方法
            juicer.register('highlight', function(data) {
                return !that.searchVal? data : String(data).replace(new RegExp("("+that.escapePattern(that.searchVal)+")", 'igm'),"<em>$1</em>");
            });
        },

        /**
         * 构造底部分页标签
         */
        buildPage:function(){
            var that = this;

            this.page = new iPage({
                totalSize:this.rows.length,
                pageSize:this.pageSize,
                currentPage:this.currentPage,
                pageShow:this.pageShow,
                tpl:this.pageTpl,
                auto:false,
                onChange:function() {
                    that.renderDataGrid();
                }
            });
        },

        buildTable:function() {
            var that = this;
            this.tableSelf = $(juicer.to_html(this.tableTpl, this));
            this.target.append(this.tableSelf);
            this.dataGrid = this.tableSelf.find("div[data-role=dataGrid]");

            this.dataGrid.on("mouseover",function (e) {
                var $row = $(e.target).hasClass("grid-row") ? $(e.target) : $(e.target).parent("tr.grid-row");
                $row && $row.addClass("mi-state-hover");
            }).on("mouseout",function (e) {
                var $row = $(e.target).hasClass("grid-row") ? $(e.target) : $(e.target).parent("tr.grid-row");
                $row && $row.removeClass("mi-state-hover");
            }).on("click",function (e) {
                var $row = $(e.target).hasClass("grid-row") ? $(e.target) : $(e.target).parent("tr.grid-row");
                $row && that.selectRow($row);
            });

            this.theadContainer = this.tableSelf.find("div[data-role=theadContainer]");
            this.theadContainer.on("mouseover",function (e) {
                var $col = $(e.target).hasClass("mi-th-column") ? $(e.target) : $(e.target).parent("th.mi-th-column");
                $col && $col.addClass("mi-state-hover");
            }).on("mouseout",function (e) {
                var $col = $(e.target).hasClass("mi-th-column") ? $(e.target) : $(e.target).parent("th.mi-th-column");
                $col && $col.removeClass("mi-state-hover");
            });
            this.tbodyContainer = this.tableSelf.find("div[data-role=tbodyContainer]");
            this.topBar = this.tableSelf.find("div[data-role=topBar]");
            this.ths = this.tableSelf.find("table[data-role=table_head] th");
            this.resizeBarMark = this.tableSelf.find("div[data-role=resizeBarMark]");

            this.tbodyContainer.on("scroll",scrollDiv);
            this.theadContainer.on("scroll",scrollDiv);

            function scrollDiv(e){
                that.theadContainer[0].scrollLeft = that.tbodyContainer[0].scrollLeft;
                if( e ) { e.stopPropagation();e.preventDefault(); }
            }

            this.page.target = this.tableSelf.find("div[data-role=pageBar]");
            this.page.renderPage();

        },

        renderDataGrid:function(o){
            this.dataGrid.html(juicer.to_html(this.gridTpl, this));
            this.gridTable = this.tableSelf.find("table[data-role=gridTable]")[0];
            this.gridTableCols = this.gridTable.rows[0].cells;
        },

        /**
         * 数据类型转换
         */
        _convert : function (sValue, sDataType) {
            if (sDataType == "int") {
                return parseInt(sValue || "0");
            } else if (sDataType == "float") {
                return parseFloat(sValue || "0");
            } else if (sDataType == "date") {
                return new Date(Date.parse(sValue.replace(/-|年|月|日/g, '/')));
            } else {
                return sValue;
            }
        },

        /**
         * 行数据比较函数
         */
        rowsCompare : function(columnIndex,sortType){
            var that = this;
            return function compareTRs(row1, row2) {
                var data1 = that._convert(row1.cells[columnIndex],sortType);
                var data2 = that._convert(row2.cells[columnIndex],sortType);
                return data1 < data2 ? 1 : (data1 > data2 ? -1 : 0);
            };
        },

        /**
         * 选中某一行
         */
        selectRow:function($row){
            var dataIndex = parseInt($row.attr("dataIndex"),10),
                row = this.rows[dataIndex];
            if($row.hasClass("mi-state-highlight")){
                $row.removeClass("mi-state-highlight");
                row.selected = false;
            }else{
                $row.addClass("mi-state-highlight");
                row.selected = true;
            }
        },

        /**
         * 表格排序功能
         */
        theadBindEvents : function() {
            var that = this;

            //给对应的列添加相应的排序
            this.ths.each(function(index , eachTh) {

                that.headers[index] = {width: that.columns[index].width,el: $(eachTh)};
                $(eachTh).on('mousedown', function(e) {
                    document.onselectstart = function() {
                        return false;
                    };
                    document.body.style.MozUserSelect="none";
                    var el = e.target;
                    if($(el).attr("data-role")==="resizeBar"){
                        that.beforeDrag($(el),e);
                        return false;
                    }

                    var idx = parseInt($(eachTh).attr("idx"),10),
                        sType = that.columns[index].sortType,
                        sState = that.headers[index].sortState || "default",
                        sIcon = that.headers[idx].el.find("[data-role=sortIcon]");

                    if(!sType){
                        return false;
                    }

                    switch (sState) {
                        case "default":
                            that.rows.sort(that.rowsCompare(idx,sType));
                            that.headers[index].sortState = "desc";
                            sIcon.removeClass('mi-sort-default').addClass('mi-sort-desc');
                            that.resetSortedCol(index);
                            break;
                        case "asc":
                            that.rows.reverse();
                            that.headers[index].sortState = "desc";
                            sIcon.removeClass('mi-sort-asc').addClass('mi-sort-desc');
                            break;
                        case "desc":
                            that.rows.reverse();
                            that.headers[index].sortState = "asc";
                            sIcon.removeClass('mi-sort-desc').addClass('mi-sort-asc');
                            break;
                        default:
                            break;
                    }
                    //重绘表格数据
                    that.renderDataGrid();
                    //排序回调
                    that.onSort && that.onSort.call(that);

                });

                $(eachTh).on('mouseup', function(e) {
                    document.onselectstart = function() {
                        return true;
                    };
                    document.body.style.MozUserSelect="";
                    that.resizeBarMark.css({display:"none"});
                });
            });

        },

        searchBindEvents:function(){
            var that=this,
                searchInput = this.tableSelf.find("input[data-role=search]");
            searchInput.on("keyup", function () {
                that.doSearch(searchInput.val());
            });
        },


        doSearch:function(val){
            var that = this;
            if(this.searchVal !== val){
                this.searchVal = val;
                this.searchDeferTimeout && clearTimeout(this.searchDeferTimeout);
                // 当输入字符串过快的时候，加入setTimeout
                this.searchDeferTimeout = setTimeout(function () {
                    that.searchFilter();
                    that.resetSortedCol();
                }, this.searchDefer);
            }
        },

        /**
         * 去掉正则表达式中的特殊字符
         * 可以扩展支持正则表达式 todo
         */
        escapePattern:function(str){
            return str.replace(/[\\\$\(\)\[\]\+\^\{\}\?\*\|\.]/igm, function($) {
                return '\\' + $;
            });
        },

        searchFilter:function(){
            if(this.searchVal){
                this.filterRows();
            } else {
                this.rows = this.rowsCache;
            }

            this.renderDataGrid();
            this.page.totalSize = this.rows.length;
            this.page.gotoPage(1);
            this.page.target.css({display:(this.page.totalPage <= 1 ?"none":"block")});
            this.onSearch && this.onSearch.call(this);
        },

        filterRows:function(){
            this.rows = [];
            var searchReg = new RegExp(this.escapePattern(this.searchVal), 'igm'),cells;
            for(var i = 0,l = this.rowsCache.length;i<l;i++){
                cells = this.rowsCache[i].cells;
                for(var j = 0,l2 = cells.length;j<l2;j++){
                    if(searchReg.test(String(cells[j]))){
                        this.rows.push(this.rowsCache[i]);
                        break;
                    }
                }
            }
        },

        /**
         * 排序头部还原
         */
        resetSortedCol:function(colIdx){
            if(typeof (this.sortedColIdx) == "number"){
                this.headers[this.sortedColIdx].sortState = "default";
                this.headers[this.sortedColIdx].el.find("[data-role=sortIcon]").removeClass('mi-sort-asc').removeClass('mi-sort-desc').addClass('mi-sort-default');
            }
            this.sortedColIdx = colIdx;
        },

        beforeDrag:function(bar,e){
            var that=this ,barPosition = bar.position();
            barPosition.top += this.topBar.outerHeight();
            this.resizing ={
                idx:parseInt(bar.parent().attr("idx")||"-1",10),
                mouseXStart: e.clientX,
                barXStart:barPosition.left+3
            };
            this.theadContainer[0].style.cursor = "col-resize";
            this.resizeBarMark.css({top:barPosition.top,left:barPosition.left+3,display:"block",height:this.tableHeight});


            document.onselectstart = function() {
                return false;
            };
            document.body.style.MozUserSelect="none";
            this.tableSelf.on("mousemove.itable", function(e){
                that.onDragMove(e);
            });
            $(document).on("mouseup.itable", function(e){
                that.resizeColWidth();
                that.tableSelf.off("mousemove.itable");
                $(document).off("mouseup.itable");
                that.onResize && that.onResize.call(that);
            });

        },

        onDragMove:function(e){
            if (this.resizing) {
                var diff = e.clientX - this.resizing.mouseXStart,
                    idx = this.resizing.idx,
                    h = this.headers[idx],
                    newWidth = h.width + diff;
                if (newWidth > 33) {
                    this.resizeBarMark.css({left: (this.resizing.barXStart + diff)});
                    this.newWidth = this.tableWidth + diff;
                    h.newWidth = newWidth;
                }
            }
        },

        /**
         * 调整对应的列宽度
         */
        resizeColWidth:function() {
            if (this.resizing) {
                var idx = this.resizing.idx,
                    nw = this.headers[idx].newWidth || this.headers[idx].width;
                nw = parseInt(nw, 10);
                this.resizing = false;
                this.resizeBarMark.css({display:"none"});
                this.columns[idx].width = nw;
                this.headers[idx].width = nw;
                this.headers[idx].el[0].style.width = nw + "px";
                this.gridTableCols[idx].style.width = nw + "px";
                this.tableWidth = this.newWidth || this.tableWidth;
                this.tbodyContainer.find("table").css("width", this.tableWidth);
                this.theadContainer.find("table").css("width", this.tableWidth);
                this.theadContainer[0].scrollLeft = this.tbodyContainer[0].scrollLeft;
            }
            document.onselectstart = function() {
                return true;
            };
            document.body.style.MozUserSelect="";
            this.theadContainer[0].style.cursor = "default";
        }
    };
})();