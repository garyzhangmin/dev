# coding=utf-8
__author__ = 'zhangmin'

import xlrd
import json
import string


book = xlrd.open_workbook('file.xls')
sheet_name = book.sheet_names()[0]  #获得指定索引的sheet名字
print sheet_name
sheet = book.sheet_by_name(sheet_name)  #通过sheet名字来获取，当然如果你知道sheet名字了可以直接指定
#sheet=book.sheet_by_index(0)


#获取行数和列数：

nrows = sheet.nrows  #行总数
ncols = sheet.ncols  #列总数

#获得指定行、列的值，返回对象为一个值列表

row_data = sheet.row_values(0)  #获得第1行的数据列表
col_data = sheet.col_values(0)  #获得第一列的数据列表，然后就可以迭代里面的数据了

#通过cell的位置坐标获得指定cell的值
cell_value1 = sheet.cell_value(1, 0)  ##只有cell的值内容，如：http://xxx.xxx.xxx.xxx:8850/2/photos/square/
print cell_value1
cell_value2 = sheet.cell(1, 1)  ##除了cell值内容外还有附加属性，如：text:u'http://xxx.xxx.xxx.xxx:8850/2/photos/square/'
print cell_value2

print(sheet.nrows)
print(sheet.ncols)

rr = range(2, nrows)
rc = range(3,5)

jsonObj = {}
print rc
for w in rr:
    for ww in rc:
        if(ww==4):
            if (not jsonObj.has_key(sheet.cell_value(w, ww - 1))):
                jsonObj[sheet.cell_value(w, ww - 1)] = sheet.cell_value(w, ww)
            else:
                jsonObj[sheet.cell_value(w, ww - 1)] += sheet.cell_value(w, ww)



print json.dumps(['foo', {'bar': ('baz', None, 1.0, 2)}])

print json.dumps({'4': 5, '6': 7}, sort_keys=True, indent=4, separators=(',', ':'))

print json.dumps(jsonObj, sort_keys=True, indent=4, separators=(',', ':'))


print jsonObj["UAP-[no-behaviour]"]


"UAP-[accountInputValid_TAccount]-[TAccountLoginSuccess]-[accountInputValid_TAccount]".split("[")