# 默认配置

| Html | Javascript | Usage |
| --- | --- | --- |
| data-dv-reg | reg | 正则表达式 |
| data-dv-required | required | 是否不能为空 |
| data-dv-min-length | min-length | 最小长度 |
| data-dv-max-length | max-length | 最大长度 |
| data-dv-confirm | confirm | 确认密码 |


| initEvent | 触发校验的事件，如：input,blur等，默认为input |
| --- | --- |
| shorthand | 插件名的简写，DataVerify简写为dv，这也是html中格式data-dv-xxxxx的由来 |

+ 系统默认的配置，用户可以直接使用，Html列表示在html中书写的格式，这是用户尤其需要注意的地方。如果您需要扩展自定义校验规则，则需要按照Javascript的格式书写。例如：

```
<div class="form-group">
    <label for="password">密码</label>
    <input id="password" type="password" class="form-control" placeholder="请输入密码"
           data-dv-reg="^\w+$"
           data-dv-reg-message="请输入正确的密码(6-16字母数字下划线)!"
           data-dv-required=true
           data-dv-required-message="密码不能为空!"
           data-dv-min-length="6"
           data-dv-min-length-message="密码不能少于6位!"
           data-dv-max-length="16"
           data-dv-max-length-message="密码不能大于16位!">
</div>
```

+ 凡是系统默认配置，用户均可按喜好进行覆盖，但是使用的时候需要传递一个options参数，options是一个Object对象，其内容即为您即将覆盖掉的配置。例如系统默认触发校验的事件是表单元素的input事件，但是我们可以自行修改为blur事件。

```
    $("form").dataVerify({initEvent:"blur"});
```

# 基本使用
+ 引入jquery文件及本文件，由于本文件是基于jquery开发的，因此jquery置于前，本文件置于后。例如：
  
```
    <script src="lib/jquery-2.2.4.js"></script>
    <script src="lib/dataVerify.js"></script>
```
+ 由于本插件专门用于表单的校验，因此只可用于表单控件。另外，由于本插件主要是基于配置进行，非常的灵活，用户使用起来也很简单，一行代码搞定：

```
    $("form").dataVerify();
    或
    $("form").dataVerify({initEvent:"blur"});  //以默认配置为优先，以用户配置为覆盖
```

# 支持扩展
本插件有很好的扩展性，支持用户自定义校验规则。需要注意以下几点：
+ extendVerify定义在dataVerify函数上(即函数dataVerify的静态方法),而函数dataVerify是在jQuery的原型对象上进行扩展的。
+ extendVerify接收一个Object对象的参数options，其key为校验规则名称(即第一部分默认配置中的Javascript格式)，value为一个匿名函数，该匿名函数用于处理校验的过程，它接收一个参数data，表示用户在html中为该规则配置的值，比如:data-dv-required=true，则正在被校验的表单元素的required规则对应的值为true，也就是data为true.
+ 处理具体校验过程的匿名函数，其内部的this代表的是当前被校验表单元素的jQuery对象。注意它获取值的的api是this.val()，而不是原生的this.value。

```
    //用户自定义的校验规则会合并到默认的RULES中。
    jQuery.prototype.dataVerify.extendVerify({
        //表示只接受qq邮箱
        "qq-mail": function (data) {
            return data ? this.val().indexOf("@qq.com") > 0 : true;
        }
    });
```
# 基本原理
本插件的核心原理是当使用$("form").dataVerify()时，会自动给表单的所有input元素去绑定监听事件，当事件响应时，我们去用相应的校验规则对齐进行校验即可！最后下面再粘贴一份简单使用代码片段。


```
    <script>
        $(function () {
            //dataVerify里的核心功能就是给表单的所有input元素绑定事件.
            $("form").dataVerify({
              initEvent:"blur"
            });

            //用户自定义的校验规则会合并到默认的RULES中。
            jQuery.prototype.dataVerify.extendVerify({
                //表示只接受qq邮箱
                "qq-mail": function (data) {
                    return data ? this.val().indexOf("@qq.com") > 0 : true;
                }
            });
        });
    </script>
```

