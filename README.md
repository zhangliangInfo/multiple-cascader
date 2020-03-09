Multiple Cascader
======
基于antd的cascader级联菜单实现的多选级联功能
### Purpose
***
由于项目中有基于多个级联选项来进行查询搜索的需求，基于此扩展了ant的级联菜单只能单选的功能；
目前multiple-cascader只能选中多个三级菜单，选中一、二级时为单选功能，若选到三级时，则无法选中一二级，但可选多个三级；
### Useage
***
* npm install multiple-cascader
```
<MultipleCascader {...props} />
```
### Options
***
* 与antd的cascader参数大部分相同, 以下详细列出当前支持与不支持(后期会迭代版本予以支持)的参数：

| 参数 | 说明 | 类型 | 默认值 | 是否支持 |
| --- | --- | --- | --- | --- |
| selectMax | 最大输入条数 | number | - | 新增 |
| allowClear | 是否支持清除 | boolean | true | Y |
| autoFocus | 自动获取焦点 | boolean | false | N |
| changeOnSelect | 当此项为 true 时，点选每级菜单选项值都会发生变化，具体见上面的演示 | boolean | false | Y |
| selectChange | 选中完成后的回调 | (isCeil, notAllow) => void | - | 新增 |
| className | 自定义类名 | string | - | Y |
| defaultValue | 默认的选中项 | string\[] | \[] | N |
| disabled | 禁用 | boolean | false | Y |
| displayRender | 选择后展示的渲染函数 | `(label, selectedOptions) => ReactNode` | `label => label.join(' / ')` | N |
| expandTrigger | 次级菜单的展开方式，可选 'click' 和 'hover' | string | 'click' | Y |
| fieldNames | 自定义 options 中 label name children 的字段 | object | `{ label: 'label', value: 'value', children: 'children' }` | N |
| getPopupContainer | 菜单渲染父节点。默认渲染到 body 上，如果你遇到菜单滚动定位问题，试试修改为滚动的区域，并相对其定位。[示例](https://codepen.io/afc163/pen/zEjNOy?editors=0010) | Function(triggerNode) | () => document.body | Y |
| loadData | 用于动态加载选项，无法与 `showSearch` 一起使用 | `(selectedOptions) => void` | - | N |
| notFoundContent | 当下拉列表为空时显示的内容 | string | 'Not Found' | Y |
| options | 可选项数据源 | [Option](#Option)[] | - | Y |
| placeholder | 输入框占位文本 | string | '请选择' | Y |
| popupClassName | 自定义浮层类名 | string | - | Y |
| popupPlacement | 浮层预设位置：`bottomLeft` `bottomRight` `topLeft` `topRight` | Enum | `bottomLeft` | Y |
| popupVisible | 控制浮层显隐 | boolean | - | Y |
| showSearch | 在选择框中显示搜索框 | boolean | true | N |
| size | 输入框大小，可选 `large` `default` `small` | string | `default` | N |
| style | 自定义样式 | string | - | N |
| suffixIcon | 自定义的选择框后缀图标 | ReactNode | - | N |
| value | 指定选中项 | string\[] | - | N |
| onChange | 选择完成后的回调 | `(value, selectedOptions) => void` | - | Y |
| onPopupVisibleChange | 显示/隐藏浮层的回调 | `(value) => void` | - | N |
