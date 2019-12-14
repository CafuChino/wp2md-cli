# wp2md-cli

[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

一个把wordpress导出的文件便携地转码为markdown的小工具
本工具已测试通过wordpress版本5.3，其他版本兼容性未知。

开发进度：

- [x] 基本功能  
- [x] 在导出文章中附注原链接  
- [ ] 支持旧版本wordpress  
- [ ] 支持本地化图片资源  

## 内容列表

- [背景](#背景)
- [安装](#安装)
- [使用](#使用)
- [相关仓库](#相关仓库)
- [维护者](#维护者)
- [使用许可](#使用许可)

## 背景

`wp2md-cli` 诞生的原因是因为github上的其他相同功能的仓库都已经数年没有更新，没有办法满足我的需要了。而我恰好有了把我的wordpress博客上的文章发布在其他平台上的需要。


## 安装

这个项目使用 [node](http://nodejs.org) 和 [npm](https://npmjs.com). 请确保你本地安装了它们。
```sh
$ npm install --global wp2md-cli
```
或
```sh
$ yarn global add wp2md-cli
```
## 使用说明

这只是一个小工具，所以使用起来非常简单

首先请到你的wordpress站点导出文章，请只选择导出文章选项。

```sh
wp2md-cli -f <导出文件.xml>
```
接下来的选项和导出文件夹可以在cli中操作，默认位置为./markdown/

## 相关仓库

- [html-to-md](https://github.com/stonehank/html-to-md) - A JS library for convert HTML<String> to markdown<String>, gzip 7kb

## 维护者

[@CafuChino](https://github.com/CafuChino).

## 如何贡献

非常欢迎你的加入! 此repo可能更新缓慢，不过欢迎提出issues和PR。


## 使用许可

[GPL-3.0-only](LICENSE)
