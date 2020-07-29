#关于 ant-design-vue-pro-plus
ant-design-vue-pro-plus 是在 ant-design-vue-pro 的基础上根据开发的需要增加一些新的功能。  
ant-design-vue-pro-plus 是一个未完成的作品
# 作者的想法
>以下是作者不成熟的想法，如果不当请轻点喷   

作者认为 vue 对前端来说，最大的作用是将 数据 与 标签（组件、视图）分离。同样的一组数据，我们可以渲染成table、select、tree等等。那么这就意味着—— 不同的组件只是数据的不同展示方式而已。   
在 ant-design-vue 中 table 、select 和 tree 使用的 key 和 name 是不同的：
* table一般使用的是后台回传的原生数据
* select 和 radio 使用的是 array<{value, label}>
* tree 使用的是 array<{key, title}>   

在实际工作中，我们不可能为两个数据写两个组件。如：student 和 teacher 不可能为他们两写两个 StudentSelect 和 TeacherSelect 的组件。最多写一个通用的方法，而通用的方法散落在各个页面中显然不利于代码的管理和维护。   
为了利于管理，且参考 mvc 中 m 层的概念，创建了modular层，因此 modular层 诞生。
## modular层
modular层的本意是用来处理后台数据与前端视图数据的数据结构转换。然这单独抽出一层显得太单调和单一。   
因此将 modular 由模块之间的差异表述， 引申为 modular 自身的表述。由此来扩展 modular 的含义。   
那么 一个 modular 需要包含
* 数据结构 到 视图 的转换
* 对应 增删改查等 功能的视图描述(描述位置或者描述规则)

# 主要功能
* 列表页面配置生成 —— 大体完成
* 增加、修改表单配置 —— 未完成   
    在antd中，表单验证对 a 、 a.b 支持很好，但是对 a[0].b 这种表单支持就很差。因此根据经验把表单分为简单、复合以及复杂的。
    * 简单的 
    * 复合的
    * 复杂的 
* 前端缓存 —— 未完成   
    为何需要缓存呢？主要是有的表单关联多，在编辑表单时需要多次重复的向后台请求数据。虽然可以获得最新的数据、但是在实际工作中显然不会特别频繁的更新某些数据，因此可以将这些数据缓存在 vuex 中。

#新增组件
HButtonGroup 列表页面按钮组  
HDatePicker 传入时间字符串返回时间字符串   
HRangePicker 传入时间字符串数组返回时间字符串数组   
HList 与 AList 一样 多了分页功能   
HServerSelect 基于 ASelect基础上封装的   
HTable 在 STable 基础上新增某些功能   
HTableColumnAction Table操作列组件   
HTableSearch Table 搜索字段组件   

#相关信息
