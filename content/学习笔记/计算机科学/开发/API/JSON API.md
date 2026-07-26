---
title: JSON API
date: 2025-05-20
---

[**JSON**](https://en.wikipedia.org/wiki/JSON)（JavaScript Object Notation，**JavaScript 对象表示法**）是一种[开放标准](https://en.wikipedia.org/wiki/Open_standard "Open standard")文件格式和 **[数据交换](https://en.wikipedia.org/wiki/Electronic_data_interchange "Electronic data interchange")格式**，它使用[人类可读](https://en.wikipedia.org/wiki/Human-readable_medium_and_data "Human-readable medium and data")的文本来存储和传输由[名称-值对](https://en.wikipedia.org/wiki/Name%E2%80%93value_pair "Name–value pair")和[数组](https://en.wikipedia.org/wiki/Array_data_type "Array data type") （或其他[可序列化](https://en.wikipedia.org/wiki/Serialization "Serialization")值）组成的数据对象。

服务器返回的JSON API：

```JSON
{
  "id": 1,
  "name": "Alice",
  "age": 20
}
```

因为API 用 HTTP 通信，数据格式是 JSON

JSON API 的整体流程
![](https://r2.salix.eu.org/obsidian/{fileName}.{extName}/20260516194222584.webp)

设计风格可参考 [[REST|REST]]。