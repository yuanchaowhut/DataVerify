(function (window, factory, plugin) {
    factory(jQuery, plugin);
})(this, function (jQuery, plugin) {
    var DEFAULT = {
        initEvent: "input",
        shorthand: "dv"
    };

    var RULES = {
        /*
         * data参数就是传递过来的校验规则，比如：正则表达式，最小长度，最大长度等等。
         * 但是这里还存在一个问题，需要得到输入的值，本来也可以作为参数传入的，但是不如直接把元素对象传入方便！
         * */
        "reg": function (data) {
            return new RegExp(data).test(this.val());
        },
        "required": function (data) {
            return data ? this.val().length > 0 : true;
        },
        "min-length": function (data) {
            return this.val().length >= data;
        },
        "max-length": function (data) {
            return this.val().length <= data;
        },
        "confirm": function (data) {
            //$(":password")表示获取所有type=password的元素
            var passEle = $(":password")[0];
            return this.val().length > 0 && this.val() === $(passEle).val();
        }
    }

    jQuery.prototype[plugin] = function (options) {
        //this是jQuery对象的实例，比如:$("form").这里如果不是form的jQuery对象，就停止执行。
        if (!this.is("form")) {
            return;
        }
        this.$field = this.find("input");
        //体现：以默认配置为优先，以用户配置为覆盖。
        $.extend(this, DEFAULT, options);

        //给所有input元素绑定事件.要注意，外面的this和事件里边的this不一样，外面的是form的jQuery对象，里边是事件源的原生Dom对象.
        this.$field.on(this.initEvent, function () {
            //此处this是事件源，即input元素。我们将它包装为jQuery对象。
            var _this = $(this);
            //先删除同级的紧跟在元素后面的p标签(用于错误提示消息)
            _this.nextAll().remove();
            //遍历校验规则，挨个校验
            $.each(RULES, function (key, fn) {
                var value = _this.data(DEFAULT.shorthand + "-" + key);
                var message = _this.data(DEFAULT.shorthand + "-" + key + "-message");
                if (value) {
                    //注意RULE对象中的this本来是window对象，但是这里切换为事件源对象，并且是包装后的jQuery对象.
                    var result = fn.call(_this, value);
                    if (!result) {
                        _this.after("<p style='color: red;'>" + message + "</p>");
                    }
                }
            });
        });

        //给表单元素添加提交事件.当点击提交按钮时，表单会响应submis事件，此时我们去校验所有字段。
        //注意：同一个元素，连续两次包装为jQuery对象，视为2个不同对象。即：console.log($(this)==$(this)) false
        var $this = this;
        this.on("submit", function () {
            $this.$field.trigger($this.initEvent);
            //触发绑定到被选元素的所有事件
            return false;
        });
    }

    //扩展到dataVerify函数身上，相当于它的静态方法。这里接受用户自行扩展的校验规则.
    jQuery.prototype[plugin].extendVerify = function (options) {
        $.extend(RULES, options);
        console.log(RULES);
    }
}, "dataVerify");