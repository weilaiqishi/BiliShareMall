# BiliShareMall Go 后端功能接口文档

本文档列出了 BiliShareMall Go 后端的主要功能点及其简要说明。

## 1. 登录相关功能

### 1.1 获取登录二维码Key和URL

*   **描述**: 用于获取Bilibili登录二维码的Key和URL，供用户扫码登录。
*   **实现文件**: <mcfile name="login.go" path="c:\frontend\BiliShareMall\internal\app\login.go"></mcfile>, <mcfile name="login.go" path="c:\frontend\BiliShareMall\internal\http\login.go"></mcfile>
*   **Go 函数**: 
    *   <mcsymbol name="GetLoginKeyAndUrl" filename="login.go" path="c:\frontend\BiliShareMall\internal\app\login.go" startline="14" type="function"></mcsymbol> (在 `app` 包中)
    *   <mcsymbol name="GetLoginKeyAndUrl" filename="login.go" path="c:\frontend\BiliShareMall\internal\http\login.go" startline="16" type="function"></mcsymbol> (在 `http` 包中)
*   **前端使用**: 
    *   **组件**: <mcfile name="bili-qrlogin.vue" path="c:\frontend\BiliShareMall\frontend\src\views\_builtin\login\modules\bili-qrlogin.vue"></mcfile>
    *   **调用方式**: 通过 Wails 绑定的 Go 函数 `GetLoginKeyAndUrl()` 获取登录二维码信息
    *   **代码示例**:
    ```typescript
    async function initQrurl() {
      GetLoginKeyAndUrl().then(loginInfo => {
        loginUrl.value = loginInfo.login_url;
        loginKey = loginInfo.key;
        loading.value = false;
        startLoginCheck();
      });
    }
    ```

### 1.2 验证登录状态并获取Cookie

*   **描述**: 使用获取到的Key验证用户是否已扫码登录，并返回登录后的Cookie字符串。
*   **实现文件**: <mcfile name="login.go" path="c:\frontend\BiliShareMall\internal\app\login.go"></mcfile>, <mcfile name="login.go" path="c:\frontend\BiliShareMall\internal\http\login.go"></mcfile>
*   **Go 函数**: 
    *   <mcsymbol name="VerifyLogin" filename="login.go" path="c:\frontend\BiliShareMall\internal\app\login.go" startline="26" type="function"></mcsymbol> (在 `app` 包中)
    *   <mcsymbol name="VerifyLogin" filename="login.go" path="c:\frontend\BiliShareMall\internal\http\login.go" startline="34" type="function"></mcsymbol> (在 `http` 包中)
*   **前端使用**: 
    *   **组件**: <mcfile name="bili-qrlogin.vue" path="c:\frontend\BiliShareMall\frontend\src\views\_builtin\login\modules\bili-qrlogin.vue"></mcfile>
    *   **状态管理**: <mcfile name="index.ts" path="c:\frontend\BiliShareMall\frontend\src\store\modules\auth\index.ts"></mcfile>
    *   **调用方式**: 
        1. 通过定时器每3秒调用一次 `VerifyLogin(key)` 检查登录状态
        2. 登录成功后通过 `authStore.setCookies()` 保存 Cookie 并处理登录后的路由跳转
    *   **代码示例**:
    ```typescript
    // 定时检查登录状态
    function startLoginCheck() {
      if (checkInterval) {
        clearInterval(checkInterval);
      }
      checkInterval = setInterval(async () => {
        VerifyLogin(loginKey).then(ret => {
          if (ret.cookies !== '') {
            authStore.setCookies(ret.cookies);
            clearInterval(checkInterval!);
          }
        });
      }, 3000);
    }

    // Auth Store 中的 Cookie 处理
    async function setCookies(cookies: string, redirect = true) {
      localStg.set('cookies', cookies);
      token.value = cookies;
      await routeStore.initAuthRoute();
      await redirectFromLogin(redirect);
      if (routeStore.isInitAuthRoute) {
        window.$notification?.success({
          title: $t('page.login.common.loginSuccess'),
          content: $t('page.login.common.welcomeBack'),
          duration: 4500
        });
        tabStore.clearTabs();
      }
    }
    ```

## 2. 商品搜索与列表功能

### 2.1 列出C2C商品

*   **描述**: 根据分页、过滤名称、排序选项、时间范围和价格范围列出C2C商品。
*   **实现文件**: <mcfile name="search.go" path="c:\frontend\BiliShareMall\internal\app\search.go"></mcfile>, <mcfile name="search.go" path="c:\frontend\BiliShareMall\internal\dao\search.go"></mcfile>
*   **Go 函数**: 
    *   <mcsymbol name="ListC2CItem" filename="search.go" path="c:\frontend\BiliShareMall\internal\app\search.go" startline="30" type="function"></mcsymbol> (在 `app` 包中)
    *   <mcsymbol name="ReadCSCItems" filename="search.go" path="c:\frontend\BiliShareMall\internal\dao\search.go" startline="9" type="function"></mcsymbol> (在 `dao` 包中)

### 2.2 检查商品状态

*   **描述**: 检查C2C商品是否可购买。
*   **实现文件**: <mcfile name="search.go" path="c:\frontend\BiliShareMall\internal\app\search.go"></mcfile>
*   **Go 函数**: <mcsymbol name="checkItemStatus" filename="search.go" path="c:\frontend\BiliShareMall\internal\app\search.go" startline="90" type="function"></mcsymbol>

### 2.3 删除错误商品

*   **描述**: 从数据库中删除不可购买或错误的C2C商品。
*   **实现文件**: <mcfile name="search.go" path="c:\frontend\BiliShareMall\internal\app\search.go"></mcfile>, <mcfile name="search.go" path="c:\frontend\BiliShareMall\internal\dao\search.go"></mcfile>
*   **Go 函数**: 
    *   <mcsymbol name="RemoveErrorItem" filename="search.go" path="c:\frontend\BiliShareMall\internal\app\search.go" startline="69" type="function"></mcsymbol> (在 `app` 包中)
    *   <mcsymbol name="DeleteCSCItem" filename="search.go" path="c:\frontend\BiliShareMall\internal\dao\search.go" startline="114" type="function"></mcsymbol> (在 `dao` 包中)

### 2.4 搜索商品 (V2 API)

*   **描述**: 调用Bilibili的 `/mall/noah/search/v2` API 进行商品搜索。
*   **实现文件**: <mcfile name="search.go" path="c:\frontend\BiliShareMall\internal\app\search.go"></mcfile>
*   **Go 函数**: <mcsymbol name="SearchItemsV2" filename="search.go" path="c:\frontend\BiliShareMall\internal\app\search.go" startline="135" type="function"></mcsymbol>

## 3. 爬虫相关功能

### 3.1 读取所有爬虫任务

*   **描述**: 从数据库中读取所有已配置的爬虫任务。
*   **实现文件**: <mcfile name="scrapy.go" path="c:\frontend\BiliShareMall\internal\app\scrapy.go"></mcfile>, <mcfile name="scrapy.go" path="c:\frontend\BiliShareMall\internal\dao\scrapy.go"></mcfile>
*   **Go 函数**: 
    *   <mcsymbol name="ReadAllScrapyItems" filename="scrapy.go" path="c:\frontend\BiliShareMall\internal\app\scrapy.go" startline="20" type="function"></mcsymbol> (在 `app` 包中)
    *   <mcsymbol name="ReadAllScrapyItems" filename="scrapy.go" path="c:\frontend\BiliShareMall\internal\dao\scrapy.go" startline="90" type="function"></mcsymbol> (在 `dao` 包中)

### 3.2 删除爬虫任务

*   **描述**: 根据ID删除指定的爬虫任务。
*   **实现文件**: <mcfile name="scrapy.go" path="c:\frontend\BiliShareMall\internal\app\scrapy.go"></mcfile>, <mcfile name="scrapy.go" path="c:\frontend\BiliShareMall\internal\dao\scrapy.go"></mcfile>
*   **Go 函数**: 
    *   <mcsymbol name="DeleteScrapyItem" filename="scrapy.go" path="c:\frontend\BiliShareMall\internal\app\scrapy.go" startline="28" type="function"></mcsymbol> (在 `app` 包中)
    *   <mcsymbol name="DeleteScrapyItem" filename="scrapy.go" path="c:\frontend\BiliShareMall\internal\dao\scrapy.go" startline="83" type="function"></mcsymbol> (在 `dao` 包中)

### 3.3 创建爬虫任务

*   **描述**: 创建一个新的爬虫任务并保存到数据库。
*   **实现文件**: <mcfile name="scrapy.go" path="c:\frontend\BiliShareMall\internal\app\scrapy.go"></mcfile>, <mcfile name="scrapy.go" path="c:\frontend\BiliShareMall\internal\dao\scrapy.go"></mcfile>
*   **Go 函数**: 
    *   <mcsymbol name="CreateScrapyItem" filename="scrapy.go" path="c:\frontend\BiliShareMall\internal\app\scrapy.go" startline="36" type="function"></mcsymbol> (在 `app` 包中)
    *   <mcsymbol name="CreateScrapyItem" filename="scrapy.go" path="c:\frontend\BiliShareMall\internal\dao\scrapy.go" startline="20" type="function"></mcsymbol> (在 `dao` 包中)

### 3.4 启动爬虫任务

*   **描述**: 启动指定ID的爬虫任务，如果已有任务在运行，会先取消当前任务。
*   **实现文件**: <mcfile name="scrapy.go" path="c:\frontend\BiliShareMall\internal\app\scrapy.go"></mcfile>
*   **Go 函数**: <mcsymbol name="StartTask" filename="scrapy.go" path="c:\frontend\BiliShareMall\internal\app\scrapy.go" startline="77" type="function"></mcsymbol>

### 3.5 停止爬虫任务

*   **描述**: 停止当前正在运行的爬虫任务。
*   **实现文件**: <mcfile name="scrapy.go" path="c:\frontend\BiliShareMall\internal\app\scrapy.go"></mcfile>
*   **Go 函数**: <mcsymbol name="DoneTask" filename="scrapy.go" path="c:\frontend\BiliShareMall\internal\app\scrapy.go" startline="89" type="function"></mcsymbol>

### 3.6 获取当前运行的爬虫任务ID

*   **描述**: 获取当前正在运行的爬虫任务的ID。
*   **实现文件**: <mcfile name="scrapy.go" path="c:\frontend\BiliShareMall\internal\app\scrapy.go"></mcfile>
*   **Go 函数**: <mcsymbol name="GetNowRunTaskId" filename="scrapy.go" path="c:\frontend\BiliShareMall\internal\app\scrapy.go" startline="95" type="function"></mcsymbol>

### 3.7 执行单次爬虫任务

*   **描述**: 执行一次爬虫任务，更新爬虫项的token、增加数量和总数，并保存到数据库。
*   **实现文件**: <mcfile name="scrapy.go" path="c:\frontend\BiliShareMall\internal\app\scrapy.go"></mcfile>
*   **Go 函数**: <mcsymbol name="scrapyTask" filename="scrapy.go" path="c:\frontend\BiliShareMall\internal\app\scrapy.go" startline="99" type="function"></mcsymbol>

## 4. 数据库操作功能

### 4.1 初始化数据库

*   **描述**: 根据SQL脚本初始化数据库结构。
*   **实现文件**: <mcfile name="app.go" path="c:\frontend\BiliShareMall\internal\app\app.go"></mcfile>, <mcfile name="sqlite.go" path="c:\frontend\BiliShareMall\internal\dao\sqlite.go"></mcfile>
*   **Go 函数**: 
    *   <mcsymbol name="Startup" filename="app.go" path="c:\frontend\BiliShareMall\internal\app\app.go" startline="30" type="function"></mcsymbol> (在 `app` 包中调用)
    *   <mcsymbol name="Init" filename="sqlite.go" path="c:\frontend\BiliShareMall\internal\dao\sqlite.go" startline="45" type="function"></mcsymbol> (在 `dao` 包中)

### 4.2 更新数据库版本

*   **描述**: 更新数据库的版本号。
*   **实现文件**: <mcfile name="app.go" path="c:\frontend\BiliShareMall\internal\app\app.go"></mcfile>, <mcfile name="sqlite.go" path="c:\frontend\BiliShareMall\internal\dao\sqlite.go"></mcfile>
*   **Go 函数**: 
    *   <mcsymbol name="Startup" filename="app.go" path="c:\frontend\BiliShareMall\internal\app\app.go" startline="30" type="function"></mcsymbol> (在 `app` 包中调用)
    *   <mcsymbol name="UpdateVersion" filename="sqlite.go" path="c:\frontend\BiliShareMall\internal\dao\sqlite.go" startline="49" type="function"></mcsymbol> (在 `dao` 包中)

### 4.3 获取数据库版本

*   **描述**: 获取当前数据库的版本号。
*   **实现文件**: <mcfile name="sqlite.go" path="c:\frontend\BiliShareMall\internal\dao\sqlite.go"></mcfile>
*   **Go 函数**: <mcsymbol name="GetVersion" filename="sqlite.go" path="c:\frontend\BiliShareMall\internal\dao\sqlite.go" startline="52" type="function"></mcsymbol>

### 4.4 关闭数据库

*   **描述**: 关闭数据库连接。
*   **实现文件**: <mcfile name="sqlite.go" path="c:\frontend\BiliShareMall\internal\dao\sqlite.go"></mcfile>
*   **Go 函数**: <mcsymbol name="Close" filename="sqlite.go" path="c:\frontend\BiliShareMall\internal\dao\sqlite.go" startline="56" type="function"></mcsymbol>

### 4.5 创建/更新/读取/删除爬虫项 (ScrapyItem)

*   **描述**: 对 `scrapy_items` 表进行增删改查操作。
*   **实现文件**: <mcfile name="scrapy.go" path="c:\frontend\BiliShareMall\internal\dao\scrapy.go"></mcfile>
*   **Go 函数**: 
    *   <mcsymbol name="CreateScrapyItem" filename="scrapy.go" path="c:\frontend\BiliShareMall\internal\dao\scrapy.go" startline="20" type="function"></mcsymbol>
    *   <mcsymbol name="UpdateScrapyItem" filename="scrapy.go" path="c:\frontend\BiliShareMall\internal\dao\scrapy.go" startline="30" type="function"></mcsymbol>
    *   <mcsymbol name="ReadScrapyItem" filename="scrapy.go" path="c:\frontend\BiliShareMall\internal\dao\scrapy.go" startline="40" type="function"></mcsymbol>
    *   <mcsymbol name="DeleteScrapyItem" filename="scrapy.go" path="c:\frontend\BiliShareMall\internal\dao\scrapy.go" startline="83" type="function"></mcsymbol>
    *   <mcsymbol name="ReadAllScrapyItems" filename="scrapy.go" path="c:\frontend\BiliShareMall\internal\dao\scrapy.go" startline="90" type="function"></mcsymbol>

### 4.6 保存邮件列表到数据库

*   **描述**: 将爬取到的邮件列表数据保存到数据库中的 `c2c_items` 表。
*   **实现文件**: <mcfile name="scrapy.go" path="c:\frontend\BiliShareMall\internal\dao\scrapy.go"></mcfile>
*   **Go 函数**: <mcsymbol name="SaveMailListToDB" filename="scrapy.go" path="c:\frontend\BiliShareMall\internal\dao\scrapy.go" startline="140" type="function"></mcsymbol>