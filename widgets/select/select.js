function ComSelect(conf) {
    var def = {
        selector: null,
        value: null,
        width: 150,
        isPullDown: false,
        onclickCallback: function () {
        }
    };
    $.extend(this, def, conf);
    this.e = $(this.selector);
    if (this.e.length == 0) return;
    this.init();
}
ComSelect.prototype = {
    constructor: ComSelect,
    //初始化逻辑
    init: function () {
        var me = this;
        this.e.find("li:odd").addClass("bg-gray");
        this.e.css("width", parseInt(this.width) + "px");
        if (!this.value) {
            var defaultSelect = me.e.find("li").eq(0);
            this.value = defaultSelect.data("value");
        }
        me.e.find("p:first-child").html(this.e.find("li[data-value=" + this.value + "]").html());
        this.e.click(function (e) {
            if (e.target.nodeName.toLowerCase() == "li") {
                me.e.removeClass("com-select-mormal-border").addClass("com-select-focus-border");
                me.value = $(e.target).data("value");
                me.e.find("p:first-child").html($(e.target).html());
                if (me.onclickCallback && typeof me.onclickCallback == "function") {
                    me.onclickCallback(e);
                }
            } else {
                me.e.removeClass("com-select-focus-border").addClass("com-select-mormal-border");
            }
            me.toggle();
        });
        $(document.body).click(function (e) {
            if (!$(e.target).parents(me.e.selector).length) {
                me.e.removeClass("com-select-focus-border").addClass("com-select-mormal-border");
                if (me.isPullDown) {
                    me.e.find("ul").hide();
                    me.isPullDown = false;
                }
            }
        });
    },
    /**
     * 主动设置选中，会触发onchange事件
     * @param value
     */
    setSelect: function (value) {
        if (!value) {
            value = this.val();
        }
        var target = this.e.find("li[data-value=" + value + "]");
        if (target.length == 0) {
            return false;
        }
        this.e.removeClass("com-select-mormal-border").addClass("com-select-focus-border");
        this.val(value);
        this.e.find("p:first-child").html(target.html());
        if (this.onclickCallback && typeof this.onclickCallback == "function") {
            this.onclickCallback();
        }
    },
    //用户注册选择事件
    onchange: function (func) {
        this.onclickCallback = func;
    },
    //触发一个选择事件
    triggerOnchange: function () {
        if (this.onclickCallback && typeof this.onclickCallback == "function") {
            this.onclickCallback();
        }
    },
    //展开或收起下拉框
    toggle: function () {
        var that = this;
        if (this.isPullDown) {
            this.e.find("ul").hide();
            this.isPullDown = false;
        } else {
            this.e.find("ul").show();
            this.isPullDown = true;
        }
    },
    //获取本选择域的值
    val: function (value) {
        if (value) this.value = value;
        return this.value;
    }
};