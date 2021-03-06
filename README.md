# zipcode-tw-react
提供台灣縣市、行政區下拉選單以及郵遞區號輸入欄位組合的React Component  
藉由RawData快速進行郵遞區號切換，並提供地址合併顯示。

[![travis-ci Status](https://travis-ci.org/Chris-Tsai/zipcode-tw-react.svg?branch=master)](https://travis-ci.org/Chris-Tsai/zipcode-tw-react.svg?branch=master)
[![Coverage Status](https://coveralls.io/repos/github/Chris-Tsai/zipcode-tw-react/badge.svg?branch=master&service=github)](https://coveralls.io/github/Chris-Tsai/zipcode-tw-react?branch=master)
[![License](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/Chris-Tsai/zipcode-tw-react/blob/master/LICENSE)


## Feature
 - 挑選台灣縣市、行政區下拉選單，快速帶出郵遞區號。
 - 提供可自定義台灣縣市下拉選單排序(countySort)。
 - 輸入郵遞區號，快速帶出台灣縣市、行政區。
 - 提供完整地址(fullAddress)或路段地址(address)欄位傳入，合併顯示郵遞區號及地址。
 - 可自定義下拉選單、輸入欄位、地址顯示欄位的CSS, Style，達到畫面的一致性。


## Demo
Try it online: https://chris-tsai.github.io/

![pic](demo.png)

## Installation

```bash
npm install zipcode-tw-react --save
```
or use package.json

```bash
"dependencies": {
      ...
    + "@softleader/zipcode-tw-react": "v1.3.0-sl-hotfix.4",
 },
```

## Usage

```javascript
import {ZipCodeTW} from "zipcode-tw-react";

<ZipCodeTW displayType="text"
          ...
/>
```
Example : [zipcode-tw-react-example](https://github.com/Chris-Tsai/zipcode-tw-react/tree/master/_example) 

## Props

###### Field

 Name | Type | Default | Description
:--- | :--- | :--- | :---
displayType| one of: 'text', 'display' | 'text' | displayType= display<br/>1. 以span顯示且包含readOnly & disabled屬性<br/>2. 提供fullAddress、address參數合併顯示郵遞區號及地址
rowData| object | {'': {'':''}, 基隆市: {仁愛區: '200', 信義區: '201', 中正區: '202', 中山區: '203', 安樂區: '204', 暖暖區: '205', 七堵區: '206', }}|
countySort| object | {"基隆市": 1, "台北市":2, "新北市":3, <br/>"桃園市":4, "新竹市":5, "新竹縣":6,<br/> "苗栗縣":7, "台中市":8, "彰化縣":9,<br/> "南投縣":10,"雲林縣":11, "嘉義市":12,<br/> "嘉義縣":13, "台南市":14, "高雄市":15,<br/> "屏東縣":16, "台東縣":17, "花蓮縣":18,<br/> "宜蘭縣":19, "澎湖縣":20,"金門縣":21,<br/> "連江縣":22}|
zipCodePositionLast| bool | true| Decide zipCode input text position, <br/>when displayType= display, position is fixed 
countyFieldName | string |'county' |
countyValue | string | |
countyReadonly | boolean | false | 此設定於 displayType='text' 時有效, 縣市欄位是否唯讀
districtFieldName | string |'district' |
districtValue | string | |
districtReadonly | boolean | false | 此設定於 displayType='text' 時有效, 鄉鎮區欄位是否唯讀
zipCodeFieldName | string |'zipCode' |
zipCodeValue | string | |
zipCodeReadonly | boolean | false | 此設定於 displayType='text' 時有效, 郵遞區號欄位是否唯讀
countyClass | string |'form-control' |
countyStyle | object | {} |
districtClass | string |'form-control' |
districtStyle | object | displayType= 'text'<br/>預設為 {marginLeft:'5px', minWidth:'107px', paddingRight:'0px'} |
zipClass | string | 'form-control'|
zipStyle | object | displayType= 'text'<br/>預設為 {marginLeft:'5px', width: '50px'}|
zipCodePlaceholder | string | |
fullAddress | string | | 完整地址(優化顯示)
address | string | | 路段地址資訊(優化顯示)
addressClass | string | 'form-control'|
addressStyle | object | {} |
rowData | object | 預設為全台各縣市鄉鎮資料 | 當只需要部份資料時可自行傳入

###### Method

 Name | Return | Description
 :---  | :--- | :--- 
 handleChangeCounty | { countyFieldName, countyValue, <br/>districtFieldName, districtValue, <br/>zipFieldName, zipValue }
 handleChangeDistrict | { countyFieldName, countyValue, <br/>districtFieldName, districtValue, <br/>zipFieldName, zipValue }
 handleChangeZipCode | { zipFieldName, zipValue }
 handleBlurZipCode | { countyFieldName, countyValue, <br/>districtFieldName, districtValue, <br/>zipFieldName, zipValue }
 handleZipCodeNotExists | { countyFieldName, countyValue, <br/>districtFieldName, districtValue, <br/>zipFieldName, zipValue, origZipCode }

<!--
## Stargazers over time
[![Stargazers over time](https://starcharts.herokuapp.com/Chris-Tsai/zipcode-tw-react.svg)](https://starcharts.herokuapp.com/Chris-Tsai/zipcode-tw-react)
-->
