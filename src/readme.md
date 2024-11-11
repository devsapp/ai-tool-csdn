
> 注：当前项目为 Serverless Devs 应用，由于应用中会存在需要初始化才可运行的变量（例如应用部署地区、函数名等等），所以**不推荐**直接 Clone 本仓库到本地进行部署或直接复制 s.yaml 使用，**强烈推荐**通过 `s init ${模版名称}` 的方法或应用中心进行初始化，详情可参考[部署 & 体验](#部署--体验) 。

# csdn 帮助文档
<p align="center" class="flex justify-center">
    <a href="https://www.serverless-devs.com" class="ml-1">
    <img src="http://editor.devsapp.cn/icon?package=csdn&type=packageType">
  </a>
  <a href="http://www.devsapp.cn/details.html?name=csdn" class="ml-1">
    <img src="http://editor.devsapp.cn/icon?package=csdn&type=packageVersion">
  </a>
  <a href="http://www.devsapp.cn/details.html?name=csdn" class="ml-1">
    <img src="http://editor.devsapp.cn/icon?package=csdn&type=packageDownload">
  </a>
</p>

<description>

CSDN 社区

</description>

<codeUrl>

- [:smiley_cat: 代码](https://github.com/devsapp/fc-embedding-api)

</codeUrl>
<preview>



</preview>


## 前期准备

使用该项目，您需要有开通以下服务并拥有对应权限：

<service>
</service>

<remark>

您还需要注意：   
您还需要注意：  
1.项目依赖阿里云函数计算和阿里云文件存储 Nas，这两款产品都会产生资费，请关注您的资源包使用情况和费用情况 2.项目部署成功之后确保模型加载完毕（左上角选择框有模型显示）再开始推理 3.项目初始启动有大约 1 分钟的白屏时间，这是服务完全冷启动的状态，请耐心等待

</remark>

<disclaimers>

免责声明：   
免责声明：

1. 该项目的构建镜像及应用模板完全开源，由社区开发者贡献，阿里云仅提供了算力支持；

</disclaimers>

## 部署 & 体验

<appcenter>
   
- :fire: 通过 [Serverless 应用中心](https://fcnext.console.aliyun.com/applications/create?template=csdn) ，
  [![Deploy with Severless Devs](https://img.alicdn.com/imgextra/i1/O1CN01w5RFbX1v45s8TIXPz_!!6000000006118-55-tps-95-28.svg)](https://fcnext.console.aliyun.com/applications/create?template=csdn) 该应用。
   
</appcenter>
<deploy>
    
- 通过 [Serverless Devs Cli](https://www.serverless-devs.com/serverless-devs/install) 进行部署：
  - [安装 Serverless Devs Cli 开发者工具](https://www.serverless-devs.com/serverless-devs/install) ，并进行[授权信息配置](https://docs.serverless-devs.com/fc/config) ；
  - 初始化项目：`s init csdn -d csdn`
  - 进入项目，并进行项目部署：`cd csdn && s deploy -y`
   
</deploy>

## 案例介绍

<appdetail id="flushContent">

# 名称 
CSDN 社区

### 描述
管理CSDN社区内容
### 用法



# 插件工具
## publishArticleToCSDN

### 描述
### 入参
### 出参
### http请求示例
### sdk 调用示例

</appdetail>

## 使用流程

<usedetail id="flushContent">

# 普通调用
### http调用
### sdk 调用

# Agent调用

使用ReAct 进行 function call

# 工作流调用

进行函数代码关联

# 网关集成调用

通过网关绑定函数的后端服务

</usedetail>

## 注意事项

<matters id="flushContent">
</matters>


<devgroup>


## 开发者社区

您如果有关于错误的反馈或者未来的期待，您可以在 [Serverless Devs repo Issues](https://github.com/serverless-devs/serverless-devs/issues) 中进行反馈和交流。如果您想要加入我们的讨论组或者了解 FC 组件的最新动态，您可以通过以下渠道进行：

<p align="center">  

| <img src="https://serverless-article-picture.oss-cn-hangzhou.aliyuncs.com/1635407298906_20211028074819117230.png" width="130px" > | <img src="https://serverless-article-picture.oss-cn-hangzhou.aliyuncs.com/1635407044136_20211028074404326599.png" width="130px" > | <img src="https://serverless-article-picture.oss-cn-hangzhou.aliyuncs.com/1635407252200_20211028074732517533.png" width="130px" > |
| --------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| <center>微信公众号：`serverless`</center>                                                                                         | <center>微信小助手：`xiaojiangwh`</center>                                                                                        | <center>钉钉交流群：`33947367`</center>                                                                                           |
</p>
</devgroup>
