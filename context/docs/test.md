# 测试文档，一级标题
这是正文

---

## 测试1

[链接文本](https://example.com)

![图片描述](https://example.com/image.jpg)

> 这是引用

## 测试2
这是第二节
### 测试2.1

> 123abc

### 测试2.2

这是一个段落，包含**加粗**和*斜体*文本。

- 无序列表项1
- 无序列表项2
- 无序列表项3

1. 有序列表项1
2. 有序列表项2
3. 有序列表项3


## 表格测试
 
Item     | Value
-------- | ---
Computer | \$1600
Phone    | \$12
Pipe     | \$1
 
可以指定对齐方式, 如Item列左对齐, Value列右对齐, Qty列居中对齐
 
| Item     | Value | Qty   |
| :------- | ----: | :---: |
| Computer | \$1600 |  5    |
| Phone    | \$12   |  12   |
| Pipe     | \$1    |  234  |


## Html 标签测试
 
支持在 Markdown 语法中嵌套 Html 标签，譬如，你可以用 Html 写一个纵跨两行的表格：
 
    <table>
        <tr>
            <th rowspan="2">值班人员</th>
            <th>星期一</th>
            <th>星期二</th>
            <th>星期三</th>
        </tr>
        <tr>
            <td>李强</td>
            <td>张明</td>
            <td>王平</td>
        </tr>
    </table>
 
 
<table>
    <tr>
        <th rowspan="2">值班人员</th>
        <th>星期一</th>
        <th>星期二</th>
        <th>星期三</th>
    </tr>
    <tr>
        <td>李强</td>
        <td>张明</td>
        <td>王平</td>
    </tr>
</table>
 
**提示**, 如果想对图片的宽度和高度进行控制, 你也可以通过img标签, 如:
 
<img src="http://leanote.com/images/logo/leanote_icon_blue.png" width="50px" />
 