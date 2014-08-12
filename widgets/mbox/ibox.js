// private methods
function extend (target, source, isOverwrite) {
    if (isOverwrite == undefined) {
        isOverwrite = true;
    }
    for (var k in source) {
        if (!(k in target) || isOverwrite) {
            target[k] = source[k];
        }
    }
    return target;
}

//eScroll
/**
 * eScroll
 * @opt [object]
 * {
            element: ,
            isEase: ,
            mouseSimulate: ,
            lockY: ,
            lockX:
       }
 */
var EScroll = function (opt) {

    this.opt = {
        //defaults
        element: null,
        isEase: true,
        mouseSimulate: false,
        lockY: false,
        lockX: true
    };
    extend(this.opt, opt || {});
    if (!this.opt.element) {
        return (console && console.error('EScroll - no element'));
    }

    this.element = typeof this.opt.element == 'string' ? document.querySelector(this.opt.element) : this.opt.element;
    this.con = this.element.querySelector('*');
    if (this.opt.mouseSimulate) { this.element.style.overflow = 'hidden'; }

    this.supportTransform3d = ('WebKitCSSMatrix' in window);
    this.supportTouch = ('ontouchstart' in window);
    this._e = {
        'start': this.supportTouch ? 'touchstart' : 'mousedown',
        'move': this.supportTouch ? 'touchmove' : 'mousemove',
        'end': this.supportTouch ? 'touchend' : 'mouseup'
    };

    this._touchStartY = 0;
    this._translateY = 0;
    this._newTranslateY = 0;
    this._isTouching = false;

    this._lastMovingY = 0;
    this.speedY = 0;

    this._bind();
}
EScroll.prototype = {
    _bind: function () {
        var me = this;

        this.element.addEventListener('touchstart', function (e) { me._onTouchStart(e) }, false);
        this.element.addEventListener('touchmove', function (e) { me._onTouchMove(e) }, false);
        this.element.addEventListener('touchend', function (e) { me._onTouchEnd(e) }, false);
        this.element.addEventListener('touchcancel', function (e) { me._onTouchCancel(e) }, false);
    },
    _getPage: function (event, page) {
        return this.supportTouch ? event.changedTouches[0][page] : event[page];
    },
    _getTranslateY: function (y) {
        return this.supportTransform3d ? 'translate3d(0, '+y+'px, 0)' : 'translate(0, '+y+'px)';
    },
    _getTranslateX: function (x) {
        return this.supportTransform3d ? 'translate3d('+x+'px, 0, 0)' : 'translate('+x+'px, 0)';
    },
    _limitY: function (y) {
        var minY = this.element.offsetHeight - this.element.scrollHeight;
        if (y > 0) {
            y = 0;
        } else if (y < minY) {
            y = minY;
        }

        return y;
    },
    _limitY2: function (y) {
        var minY = this.element.offsetHeight - this.element.scrollHeight - 60,
            maxY = 60;
        if (y > maxY) {
            y = maxY;
        } else if (y < minY) {
            y = minY;
        }

        return y;
    },
    _isOverLimit: function (y) {
        return (y > 0 || y < this.element.offsetHeight - this.element.scrollHeight) ? true : false;
    },

    _onTouchStart: function (e) {
        clearTimeout(this.__fixPosTimer);
        this._isTouching = true;
        this._touchStartY = this._getPage(e, 'pageY');
        this._lastMovingY = this._touchStartY;

        this.con.style.webkitTransitionDuration = '0';
    },
    _onTouchMove: function (e) {
        this.supportTouch && e.preventDefault();

        if (this._isTouching) {
            clearTimeout(this.__fixPosTimer);
            var nowY = this._getPage(e, 'pageY'),
                disY = nowY - this._touchStartY;

            //get speed
            this.speedY = nowY - this._lastMovingY;
            this._lastMovingY = nowY;

            this._newTranslateY = this._translateY + disY;
            //limit translateY
            if (!this.opt.isEase) {
                this._newTranslateY = this._limitY(this._newTranslateY);
            }

            this.con.style.webkitTransform = this._getTranslateY(this._newTranslateY);
        }


    },
    _onTouchEnd: function (e) {
        if (!this._isTouching) { return; }
        var me = this;

        this._isTouching = false;
        this._translateY = this._newTranslateY;

        //handle ease
        if (this.opt.isEase) {
            this.con.style.webkitTransitionDuration = '500ms';

            if (this._isOverLimit(this._translateY)) {
                clearTimeout(this.__fixPosTimer);
                me._translateY = me._limitY(me._translateY);
                me.con.style.webkitTransform = me._getTranslateY(me._translateY);
            } else {
                var tempY = this._translateY + this.speedY * 10;
                this._translateY = this._limitY2(tempY);
                this.con.style.webkitTransform = this._getTranslateY(this._translateY);

                clearTimeout(this.__fixPosTimer);
                this.__fixPosTimer = setTimeout(function () {
                    me._translateY = me._limitY(me._translateY);
                    me.con.style.webkitTransform = me._getTranslateY(me._translateY);
                    me._newTranslateY = me._translateY;
                }, 500);
            }

        }

        this.speedY = 0;
        this._newTranslateY = this._translateY;
    },
    _onTouchCancel: function (e) {

    },
    /**
     * scrollTo
     * @pos [number] set the pos of scrollTo
     */
    scrollTo: function (pos) {
        if (this.supportTouch) {
            this.con.style.webkitTransitionDuration = '500ms';
            pos = this._limitY(pos);
            this.con.style.webkitTransform = this._getTranslateY(pos);
            this._translateY = pos;
        } else {
            this.element.scrollTop = 0 - pos;
        }
    },
    setActiveEl: function (el) {
        el = typeof el == 'string' ? document.querySelector(el) : el;
        this.con = el;
        this.con.style.webkitTransform = this._getTranslateY(0);
        this._translateY = 0;
        this._newTranslateY = 0;
        this.speedY = 0;
        this._lastMovingY = 0;
    }

};


/**
 * @description iBox 基于jquery的扩展组件
 * @author  min.zhangmzm
 * @example
 var ibox=new FE.Widget.iBox({
  cleanMod:true,
  title: "无侵入式加载iBox",
  contentHtml: "iBox Widgets Is Based On jquery.js",
  contentWidth:360,
  contentHeight:60
  });

 ibox.showBox();
 */
var iBox = function (options) {
    iBox.cache.push(this);
    $.extend(this, iBox.defaults, options);
    !this.cleanMod && this.init();
};

iBox.prototype = {
    init:function () {
        if (this.follow) {
            //如果有follow对象的话，忽略静止定位
            this.fixed = false;
        }
        this.buildDom();
        this.bindEvents();
        //window和document事件。只需绑一次
        if (!iBox.hasBindGlobalEvents) {
            iBox.hasBindGlobalEvents = this.bindGlobalEvents();
        }
        this.onFinish && this.onFinish();
    },
    buildDom:function () {
        this.buildBox();
        this.hasOverlay && this.buildOverlay();
        this.loadContent();
        this.setSize(this.contentWidth, this.contentHeight);
    },

    buildBox:function () {

        var uid = +new Date;

        var tplArr = [
            '<div class="ibox" tabindex="-1" id="ibox' + uid + '">',
            this.hasClose ? '<div class="ibox-close" title="关闭" data-role="boxClose" style="display: block;">×</div>' : "",
            '<div class="ibox-content" style="background-color: #fff; height: 100%; zoom: 1;">',
            this.hasTitle ? '<div class="ibox-title" data-role="boxTitle">' + this.title + "</div>" : "",
            '<div data-role="boxContent" class="ibox-content-inner" ><div data-role="boxContentWrap"></div></div>',
            "</div>",
            "</div>"
        ];

        this.tpl = tplArr.join("");
        this.self = $(this.tpl).appendTo(this.appendTo).css({"zIndex":this.zIndex}).css({"position":(this.fixed ? "fixed" : "absolute")});
        this.boxTitle = this.self.find("[data-role=boxTitle]");
        this.boxContent = this.self.find("[data-role=boxContent]");
        this.boxContentWrap = this.self.find("[data-role=boxContentWrap]");
        this.boxClose = this.self.find("[data-role=boxClose]");
        new EScroll({element: "#ibox" + uid + " [data-role=boxContent]"});
    },



    buildOverlay:function () {
        //遮罩层
        var zIdx = this.zIndex - 1;
        this.overlayInner = $('<div style="height:100%;background-color:' + this.overlayColor + ';"></div>').css("opacity", this.overlayOpacity);
        this.overlayOuter = $('<div style="' + 'display:none;width:100%;height:100%;position:absolute;z-index:' + zIdx + ';top:0;left:0;overflow:hidden;"></div>').append(this.overlayInner).appendTo(document.body);
        this.overlayOuter.css({height:$(window).height()});
    },



    showBox:function () {
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

    afterShow:function () {
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

    closeBox:function () {
        var _this = this;
        if (!this.isHidden) {
            this.self[this.hideEffect == "fade" ? "fadeOut" : (this.hideEffect == "slide" ? "slideUp" : "hide")](this.hideTime, function () {
                _this.afterClose();
            });

        }
        return this;
    },

    afterClose:function () {
        this.hasOverlay && this.overlayOuter.hide();
        this.timeout && clearTimeout(this.closeBoxTimeOut);
        this.cleanMod && this.destroy();
        this.isHidden = true;
        this.onClose && this.onClose.call(this);
    },

    /*
     * 装载iBoxbox内容 包括html Iframe Ajax Img等
     */
    loadContent:function () {
        var con = this.boxContentWrap;
        if (this.contentHtml) {
            con.html(this.contentHtml);
        } else if(this.contentText) {
            con.text(this.contentText);
        }
        return this;
    },

    bindEvents:function(){
        var _this = this;
        this.boxClose.on("click",function () {
            _this.closeBox();
        });
    },

    /*
     * window事件绑定
     */
    bindGlobalEvents:function () {
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
            setTimeout(function(){
                $(iBox.cache).each(function () {
                    this.setBoxPosition(_this.follow);
                    this.overlayOuter.css({height:$(window).height()});
                });
            },100);
        });
        return true;
    },

    setBoxPosition:function (followObj) {
        var temp;
        if (followObj) {
            temp = $(followObj).offset();
            this.self.css({
                left:temp.left + "px",
                top:temp.top + $(followObj).outerHeight() + "px"
            });
        } else {
            temp = this.calPosition(this.self.outerWidth(), this.self.outerHeight());
            this.self.css({
                left:this.left || temp[0] + "px",
                top:this.top || temp[1] + "px"
            });
        }

        return this;
    },
    setSize:function (w, h) {
        w && this.boxContent.css({width:w}) && this.boxTitle.css({width:w});
        h && this.boxContent.css({height:h});
        return this;
    },

    //更新内容
    setContent:function (content) {
        var con = this.boxContentWrap;
        if (typeof content == "object") {
            con.empty().append($(content));
        } else if (typeof content == "string") {
            con.html(content);
        }

        return this;
    },

    //get内容
    getContent:function () {
        return this.boxContentWrap.html();
    },

    setTitle:function (newTitle) {
        if (typeof newTitle === "string") {
            this.boxTitle.html(newTitle);
        }
        return this;
    },
    destroy:function () {
        //销毁ibox
        this.self.remove();
        this.hasOverlay && this.overlayOuter.remove();
    },
    /*
     * 加上滚动位移，使位置居中
     */
    calPosition:function (w, h) {
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
    cleanMod:false,

    /**
     * 插入iBox对象的位置
     * @type Dom Obj
     * @default document.body
     */
    appendTo:document.body,

    /**
     * 遮罩层背景透明度
     * @type float 0~1
     * @default 0.1
     */
    overlayOpacity:0.8,

    /**
     * 遮罩背景颜色
     * @type string color
     * @default '#333'
     */
    overlayColor:'#000',
    /**
     * 对话框叠加高度值
     * @type int
     * @default 2011
     */
    zIndex:2011,

    /**
     * iBox自动Close的timeout毫秒数
     * @type int
     * @default 0
     */
    timeout:0,

    left:null,
    top:null,

    fixed:true,

    title:"",
    contentHtml:'', //弹出框HTML内容
    contentText:'', //弹出框Text内容
    contentWidth:'auto', //弹出框内容width
    contentHeight:'auto', //弹出框内容height
    follow:null, //iBox定位时以该对象为参照物
    isHidden:true, //默认初始状态为隐藏
    hasClose:true,
    hasTitle:true,
    hasOverlay:true, //遮罩层

    // 显示和隐藏的效果
    showEffect:'fade', //  fade 或 slide
    showTime:300, //  默认 0
    hideEffect:'fade', //  fade 或 slide
    hideTime:150, //  默认 150
    onShow:null,
    onClose:null,
    onFinish:null
};

//当前页面iBox对象的Cache
iBox.cache = [];

//已经绑过document事件
iBox.hasBindGlobalEvents = false;
