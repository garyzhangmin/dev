var iBox = function (options) {
    iBox.cache.push(this);
    $.extend(this, iBox.defaults, options);
    !this.cleanMod && this.init();
};

iBox.prototype = {
    init: function () {
        if (this.follow) {
            //如果有follow对象的话，忽略静止定位
            this.fixed = false;
        }
        this.buildDom();
        this.bindEvents();
        //window和document事件。只需绑一次
        if (!iBox.hasBindEvents) {
            iBox.hasBindEvents = this.bindGlobalEvents();
        }
        this.onFinish && this.onFinish();
    },
    buildDom: function () {
        this.buildBox();
        this.hasOverlay && this.buildOverlay();
        this.loadContent();
        this.setSize(this.contentWidth, this.contentHeight);
    },

    buildBox: function () {
        var tplArr = [
            '<div class="ibox" tabindex="-1">',
            this.hasClose ? '<div class="ibox-close" title="关闭" data-role="boxClose" style="display: block;">×</div>' : "",
            '<div class="ibox-content" style="background-color: #fff; height: 100%; zoom: 1;">',
            this.hasTitle ? '<div class="ibox-title" data-role="boxTitle">' + this.title + '</div>' : "",
            '<div data-role="boxContent"></div>',
            '</div>',
            '</div>'
        ];

        this.tpl = tplArr.join("");
        this.self = $(this.tpl).appendTo(this.appendTo).css({"zIndex": this.zIndex}).css({"position": this.fixed ? "fixed" : "absolute"});
        this.boxTitle = this.self.find("[data-role=boxTitle]");
        this.boxContent = this.self.find("[data-role=boxContent]");
        this.boxClose = this.self.find("[data-role=boxClose]");
    },

    buildOverlay: function () {
        //遮罩层
        var zIdx = this.zIndex - 1;
        this.overlayInner = $('<div style="height:100%;background-color:' + this.overlayColor + ';filter:alpha(opacity=0);opacity:0;"></div>').css("opacity", this.overlayOpacity);
        this.overlayInner.html('<iframe src="about:blank" style="width:100%;height:100%;position:absolute;top:0;left:0;filter:alpha(opacity=0)"></iframe>');
        this.overlayOuter = $('<div style="' + 'display:none;width:100%;height:100%;position:absolute;z-index:' + zIdx + ';top:0;left:0;overflow:hidden;"></div>').append(this.overlayInner).appendTo(document.body);
        this.overlayOuter.css({height: $(document).height()});
    },


    showBox: function () {
        var _this = this;
        if (this.isHidden) {
            this.cleanMod && this.init();
            this.setBoxPosition(this.follow);
            this.hasOverlay && this.overlayOuter.show();
            this.self[this.showEffect == "fade" ? "fadeIn" : (this.showEffect == "slide" ? "slideDown" : "show")](this.showTime, function () {
                _this.afterShow();
            });
        }
        return this;
    },

    afterShow: function () {
        var _this = this;

        this.isHidden = false;
        if (this.timeout) {
            clearTimeout(this.closeBoxTimeOut);
            this.closeBoxTimeOut = setTimeout(function () {
                _this.closeBox();
            }, this.timeout);
        }
        this.onShow && this.onShow.call(this);
    },

    closeBox: function () {
        var _this = this;
        if (!this.isHidden) {
            this.self[this.hideEffect == "fade" ? "fadeOut" : (this.hideEffect == "slide" ? "slideUp" : "hide")](this.hideTime, function () {
                _this.afterClose();
            });

        }
        return this;
    },

    afterClose: function () {
        this.hasOverlay && this.overlayOuter.hide();
        this.timeout && clearTimeout(this.closeBoxTimeOut);
        this.cleanMod && this.destroy();
        this.isHidden = true;
        this.onClose && this.onClose.call(this);
    },

    /*
     * 装载iBoxbox内容 包括html Iframe Ajax Img等
     */
    loadContent: function () {
        var _this = this;
        var con = this.boxContent;
        if (this.requestType && $.inArray(this.requestType, ['iframe', 'ajax', 'img', 'dom']) != -1) {
            if (this.requestType === "img") {
                var $img = $("<img />");
                $img.bind("load", function () {
                    //load完图片后实际大小有变，重新居中
                    _this.setBoxPosition(_this.follow);
                });
                $img.appendTo(con.empty());
                $img.attr("src", this.requestTarget);
            } else if (this.requestType === "ajax") {
                $.ajax({
                    url: this.requestTarget,
                    dataType: 'text',
                    success: function (data) {
                        con.html(data);
                    }
                });
            } else if (this.requestType === "iframe") {
                var $ifr = $("<iframe name='boxIframe' style='width:100%;height:100%;' scrolling='auto' frameborder='0' src='' ></iframe>");
                $ifr.bind("load", function () {
                    _this.setBoxPosition(_this.follow);
                });
                $ifr.appendTo(con.empty());
                $ifr.attr("src", this.requestTarget);
            } else {
                $(typeof this.requestTarget == "string" ? "#" + this.requestTarget : this.requestTarget).css({display: "block"}).appendTo(con.empty());
            }
        } else if (this.contentHtml) {
            con.html(this.contentHtml);
        } else {
            con.append(document.createTextNode(this.contentText));
        }
    },

    bindEvents: function () {
        var _this = this;
        this.boxClose.click(function () {
            _this.closeBox();
        });
    },

    /*
     * window事件绑定
     */
    bindGlobalEvents: function () {
        var _this = this;

        $(document).keypress(function (e) {
            var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
            if (key === 27) {
                $(iBox.cache).each(function () {
                    this.closeBox();
                });
            }
            return true;
        });

        $(window).resize(function () {
            $(iBox.cache).each(function () {
                this.setBoxPosition(_this.follow);
                this.overlayOuter.css({height: $(document).height()});
            });
        });
        return true;
    },

    setBoxPosition: function (followObj) {
        var temp, wh;
        if (followObj) {
            temp = $(followObj).offset();
            this.self.css({
                left: temp.left + "px",
                top: temp.top + $(followObj).outerHeight() + "px"
            });
        } else {
            temp = this.calPosition(this.self.outerWidth(), this.self.outerHeight());
            this.self.css({
                left: this.left || temp[0] + "px",
                top: this.top || temp[1] + "px"
            });
        }
        return this;
    },
    setSize: function (w, h) {
        w && this.boxContent.css({width: w}) && this.boxTitle.css({width: w});
        h && this.boxContent.css({height: h});
        return this;
    },

    //更新内容
    setContent: function (content) {
        var con = this.boxContent;
        if (typeof content == "object") {
            con.empty().append($(content));
        } else if (typeof content == "string") {
            con.html(content);
        }
        return this;
    },

    //get内容
    getContent: function (content) {
        return this.boxContent.html();
    },

    setTitle: function (newTitle) {
        if (typeof newTitle === "string") {
            this.boxTitle.html(newTitle);
        }
        return this;
    },

    //重新装载内容
    reloadContent: function (requestType, requestTarget) {
        this.requestType = requestType;
        this.requestTarget = requestTarget;
        this.loadContent();
        return this;
    },
    destroy: function () {
        //销毁ibox
        this.self.remove();
        this.hasOverlay && this.overlayOuter.remove();
    },
    /*
     * 加上滚动位移，使位置居中
     */
    calPosition: function (w, h) {
        return [ (this.fixed ? 0 : $(document).scrollLeft()) + ($(window).width() - w) / 2, (this.fixed ? 0 : $(document).scrollTop()) + ($(window).height() - h) / 3];
    }

};

/** @lends iBox.prototype */
iBox.defaults = {
    /**
     * 是否是无侵入模式，即在每次iBox 显示和隐藏时都会创建和删除iBox的Dom节点，默认为false
     * @type Boolean
     * @default false
     */
    cleanMod: false,

    /**
     * 插入iBox对象的位置
     * @type Dom Obj
     * @default document.body
     */
    appendTo: document.body,

    /**
     * 遮罩层背景透明度
     * @type float 0~1
     * @default 0.1
     */
    overlayOpacity: 0.2,

    /**
     * 遮罩背景颜色
     * @type string color
     * @default '#333'
     */
    overlayColor: '#000',
    /**
     * 对话框叠加高度值
     * @type int
     * @default 2011
     */
    zIndex: 2011,

    /**
     * iBox自动Close的timeout毫秒数
     * @type int
     * @default 0
     */
    timeout: 0,

    left: null,
    top: null,

    fixed: true,

    requestTarget: null, //加载页面URL或IMG URL
    requestType: null,
    title: "",
    contentHtml: '', //弹出框HTML内容
    contentText: '', //弹出框Text内容
    contentWidth: 'auto', //弹出框内容width
    contentHeight: 'auto', //弹出框内容height
    follow: null, //iBox定位时以该对象为参照物
    isHidden: true, //默认初始状态为隐藏
    hasClose: true,
    hasTitle: true,
    hasOverlay: true, //遮罩层

    // 显示和隐藏的效果
    showEffect: 'fade', //  fade 或 slide
    showTime: 150, //  默认 0
    hideEffect: 'fade', //  fade 或 slide
    hideTime: 150, //  默认 150
    onShow: null,
    onClose: null,
    onFinish: null
};

//当前页面iBox对象的Cache
iBox.cache = [];

//已经绑过document事件
iBox.hasBindEvents = false;