// 这里编写自定义js脚本；将被静态引入到页面中
// ==UserScript==
// @name           haijiao-vip: 海角社区 解锁收费视频,VIP,去广告
// @namespace      https://github.com/sex4096/haijiao_vip
// @version        1.1.1
// @author         forgetme8
// @description    解锁 海角社区(haijiao.com) 收费视频,VIP,并去除网站广告, TG频道:@svip_nav.本插件完全免费,请注意甄别,避免上当受骗.
// @homepage       https://github.com/sex4096/haijiao_vip#readme
// @supportURL     https://github.com/sex4096/haijiao_vip/issue
// @updateURL      https://raw.githubusercontent.com/sex4096/haijiao_vip/master/haijiao.js
// @downloadURL    https://raw.githubusercontent.com/sex4096/haijiao_vip/master/haijiao.js
// @run-at         document-idle
// @match          https://www.hjcx.org/*
// @match          https://hjcx.org/*
// @match          https://www.haijiao.com/*
// @match          https://haijiao.com/*
// @match          https://*.top/home
// @match          */post/details?pid=*
// @license        MIT
// @connect        cdn.jsdelivr.net
// @require        https://cdn.jsdelivr.net/npm/react@18.3.0/umd/react.production.min.js
// @require        https://cdn.jsdelivr.net/npm/react-dom@18.3.0/umd/react-dom.production.min.js
// @require        https://cdn.jsdelivr.net/npm/dayjs@1/dayjs.min.js
// @require        https://cdn.jsdelivr.net/npm/antd@5.16.4/dist/antd.min.js
// @require        https://cdn.jsdelivr.net/npm/@ant-design/icons@5.3.6/dist/index.umd.min.js
// ==/UserScript==
(function (React$1, ReactDOM, antd, icons) {
  'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var React__default = /*#__PURE__*/_interopDefaultLegacy(React$1);
  var ReactDOM__default = /*#__PURE__*/_interopDefaultLegacy(ReactDOM);

  var __webpack_require__ = undefined;
  var VUE = undefined;
  var STORE = undefined;
  var AXIOS = undefined;
  var callback = undefined;
  function initHookWebpack(initialed) {
    callback = initialed;
    let originCall = Function.prototype.call;
    Function.prototype.call = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      const result = originCall.apply(this, args);
      if (args.length === 4 && args[1] && args[1].exports && args[0] === args[2] && __webpack_require__ === undefined) {
        __webpack_require__ = args[3];
        Function.prototype.call = originCall;
        importModules();
      }
      return result;
    };
  }
  function importModules() {
    VUE = __webpack_require__("2b0e").default;
    STORE = __webpack_require__("4360").a;
    AXIOS = __webpack_require__("bc3a");
    AXIOS = getObject(AXIOS);
    AXIOS = AXIOS.a;
    callback(VUE, STORE, AXIOS);
  }
  function getObject(module) {
    const t = module && module.__esModule ? function () {
      return module.default;
    } : function () {
      return module;
    };
    defineObject(t, "a", t);
    return t;
  }
  function defineObject(module, key, value) {
    Object.prototype.hasOwnProperty.call(module, key) || Object.defineProperty(module, key, {
      enumerable: true,
      get: value
    });
  }

  /**
   * 加载模块
   * @param module
   */
  function getModule(module) {
    if (!__webpack_require__) return null;
    return __webpack_require__(module);
  }

  const Settings = _ref => {
    let {
      initialSettings,
      onFormInstanceReady
    } = _ref;
    const [form] = antd.Form.useForm();
    React$1.useEffect(() => {
      onFormInstanceReady(form);
    }, []);
    initialSettings.viewBanUser = false;
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(antd.Form, {
      form: form,
      name: "settings",
      labelAlign: "right",
      labelCol: {
        span: 8
      },
      wrapperCol: {
        span: 16
      },
      initialValues: initialSettings
    }, /*#__PURE__*/React.createElement(antd.Form.Item, {
      label: "\u53BB\u5E7F\u544A"
    }, /*#__PURE__*/React.createElement(antd.Form.Item, {
      name: "removeAds",
      noStyle: true
    }, /*#__PURE__*/React.createElement(antd.Switch, null)), /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: 10
      }
    }, "\u53BB\u9664\u7F51\u7AD9\u5E7F\u544A")), /*#__PURE__*/React.createElement(antd.Form.Item, {
      label: "\u5C4F\u853D\u7F6E\u9876"
    }, /*#__PURE__*/React.createElement(antd.Form.Item, {
      name: "removeTops",
      noStyle: true
    }, /*#__PURE__*/React.createElement(antd.Switch, null)), /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: 10
      }
    }, "\u5C4F\u853D\u5168\u5C40\u7F6E\u9876\u5E16")), /*#__PURE__*/React.createElement(antd.Form.Item, {
      label: "\u67E5\u770B\u5C01\u7981\u7528\u6237"
    }, /*#__PURE__*/React.createElement(antd.Form.Item, {
      name: "viewBanUser",
      noStyle: true
    }, /*#__PURE__*/React.createElement(antd.Switch, {
      disabled: true
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: 10
      }
    }, "\u67E5\u770B\u88AB\u5C01\u7981\u7684\u7528\u6237\u4FE1\u606F(\u5347\u7EA7\u4E2D)")), /*#__PURE__*/React.createElement(antd.Form.Item, {
      label: "\u89E3\u9501VIP"
    }, /*#__PURE__*/React.createElement(antd.Form.Item, {
      name: "unlockVip",
      noStyle: true
    }, /*#__PURE__*/React.createElement(antd.Switch, null)), /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: 10
      }
    }, "\u53EF\u89C2\u770Bvip\u533A\u7684\u5E16\u5B50\u53CA\u89C6\u9891")), /*#__PURE__*/React.createElement(antd.Form.Item, {
      label: "\u89E3\u9501\u6536\u8D39\u89C6\u9891"
    }, /*#__PURE__*/React.createElement(antd.Form.Item, {
      name: "unlockBuy",
      noStyle: true
    }, /*#__PURE__*/React.createElement(antd.Switch, null)), /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: 10
      }
    }, "\u53EF\u89C2\u770B\u9700\u8981\u8D2D\u4E70\u7684\u89C6\u9891")), /*#__PURE__*/React.createElement(antd.Form.Item, {
      label: "\u670D\u52A1\u5730\u5740"
    }, /*#__PURE__*/React.createElement(antd.Form.Item, {
      name: "host",
      noStyle: true,
      rules: [{
        required: true,
        message: "请输入服务器地址"
      }]
    }, /*#__PURE__*/React.createElement(antd.Input, null)), /*#__PURE__*/React.createElement("h2", {
      style: {
        color: "red",
        marginTop: 5,
        textAlign: "center"
      }
    }, "\u8BF7\u4ED4\u7EC6\u9605\u8BFB!!!!!"), /*#__PURE__*/React.createElement("div", {
      style: {
        color: "red",
        marginTop: 5
      }
    }, /*#__PURE__*/React.createElement("div", null, "\u670D\u52A1\u5668\u5730\u5740\u4E0D\u5B9A\u65F6\u66F4\u6362"), /*#__PURE__*/React.createElement("div", null, "\u60A8\u53EF\u4EE5\u901A\u8FC7\u4EE5\u4E0B\u65B9\u5F0F\u83B7\u53D6\u670D\u52A1\u5730\u5740:"), /*#__PURE__*/React.createElement("div", null, "1. \u8BF7\u8BA2\u9605TG\u9891\u9053:", /*#__PURE__*/React.createElement("a", {
      href: "https://t.me/svip_nav",
      target: "_blank"
    }, "@svip_nav"), "\u83B7\u53D6\u6700\u65B0\u5730\u5740"), /*#__PURE__*/React.createElement("div", null, "2. \u79C1\u4FE1\u6211\u83B7\u53D6\u670D\u52A1\u5730\u5740,\u4E0D\u5B9A\u671F\u665A\u4E0A\u7EDF\u4E00\u56DE\u590D."), /*#__PURE__*/React.createElement("div", null, "3. \u901A\u8FC7", /*#__PURE__*/React.createElement("a", {
      href: "https://hjcx.org",
      target: "_blank"
    }, "https://hjcx.org"), "\u89C2\u770B,\u8BE5\u5730\u5740\u4E0D\u9700\u8981\u586B\u5199\u670D\u52A1\u5730\u5740\u5373\u53EF\u89C2\u770B.")))));
  };

  class PluginStore {
    static get(key, defaultValue) {
      const value = localStorage.getItem(key);
      if (value === null) {
        return defaultValue;
      }
      if (typeof defaultValue === "number") {
        return parseInt(value);
      }
      if (typeof defaultValue === "boolean") {
        return value === "true";
      }
      return value;
    }
    static set(key, value) {
      localStorage.setItem(key, value.toString());
    }
  }

  const App = () => {
    const [isModalOpen, setIsModalOpen] = React$1.useState(false);
    const [formInstance, setFormInstance] = React$1.useState();
    const showModal = () => {
      setIsModalOpen(true);
    };
    const handleOk = async () => {
      const values = await formInstance?.validateFields();
      onCreate(values);
      setIsModalOpen(false);
    };
    const handleCancel = () => {
      setIsModalOpen(false);
    };
    const onCreate = values => {
      console.log("Received values of form: ", values);
      PluginStore.set("removeAds", values.removeAds);
      PluginStore.set("removeTops", values.removeTops);
      PluginStore.set("unlockVip", values.unlockVip);
      PluginStore.set("unlockBuy", values.unlockBuy);
      PluginStore.set("viewBanUser", values.viewBanUser);
      PluginStore.set("host", values.host);
    };
    return /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, /*#__PURE__*/React__default["default"].createElement(antd.FloatButton, {
      type: "primary",
      tooltip: "\u6D77\u89D2VIP\u8BBE\u7F6E",
      style: {
        left: 16
      },
      icon: /*#__PURE__*/React__default["default"].createElement(icons.SettingOutlined, null),
      onClick: showModal
    }), /*#__PURE__*/React__default["default"].createElement(antd.Modal, {
      title: "\u8BBE\u7F6E",
      open: isModalOpen,
      onOk: handleOk,
      onCancel: handleCancel,
      destroyOnClose: true,
      okButtonProps: {
        autoFocus: true
      }
    }, /*#__PURE__*/React__default["default"].createElement(Settings, {
      initialSettings: {
        removeAds: PluginStore.get("removeAds", true),
        removeTops: PluginStore.get("removeTops", true),
        viewBanUser: PluginStore.get("viewBanUser", true),
        unlockVip: PluginStore.get("unlockVip", true),
        unlockBuy: PluginStore.get("unlockBuy", true),
        host: PluginStore.get("host", "https://haijiao.ku-cloud.com")
      },
      onFormInstanceReady: instance => {
        setFormInstance(instance);
      }
    })));
  };

  /**
   * 自定义拦截器
   */
  class Interceptor {
    // axios模块

    constructor(axios) {
      this.axios = axios;
    }

    /**
     * 初始化请求拦截器
     */
    initRequestInterceptor() {
      this.axios.interceptors.request.use(this.requestInterceptor.bind(this));
    }

    /**
     * 初始化返回请求拦截器
     */
    initResponseInterceptor() {
      if (this.axios.interceptors.response.handlers.length != 1) {
        return;
      }
      // 因为返回处理会处理掉config,而我们需要config中的url,所以需要在返回处理之前处理
      if (this.axios.interceptors.response.handlers?.[0].fulfilled) {
        const origin = this.axios.interceptors.response.handlers?.[0].fulfilled;
        this.axios.interceptors.response.handlers[0].fulfilled = async response => {
          const data = await origin(response);
          response = {
            data: data,
            config: response.config
          };
          return response;
        };
      }
      this.axios.interceptors.response.use(this.responseDecodeInterceptor.bind(this));
      this.axios.interceptors.response.use(this.responseInterceptor.bind(this));
      this.axios.interceptors.response.use(this.responseEncodeInterceptor.bind(this));
    }

    /**
     * 请求拦截器
     * @param request
     * @returns
     */
    async requestInterceptor(request) {
      request = await this.requestUnlockBuyInterceptor(request);
      // request = await this.requestUnlockBanUserInterceptor(request);
      // request = await this.requestSearchInterceptor(request);
      return request;
    }

    /**
     * 解锁购买
     * @param request
     * @returns
     */
    async requestUnlockBuyInterceptor(request) {
      if (PluginStore.get("unlockBuy", false) === true && PluginStore.get("host", "").length > 0) {
        if (/\/api\/attachment/g.test(request.url)) {
          console.log("转发请求", request.url, request);
          var host = PluginStore.get("host", "");
          request.baseURL = host;
          request.crossDomain = true;
        }
      }
      return request;
    }

    /**
     * 查看被ban的用户信息
     * @param request
     */
    async requestUnlockBanUserInterceptor(request) {
      if (PluginStore.get("unlockBanUser", true) === true && PluginStore.get("host", "").length > 0) {
        if (/\/api\/user\/info\/\d+/g.test(request.url) || /\/api\/user\/news\/other_news_list/g.test(request.url) || /\/api\/topic\/node\/topics/g.test(request.url) && request.url.includes("userId")) {
          console.log("查看被ban的用户信息", request.url);
          var host = PluginStore.get("host", "");
          request.baseURL = host;
          request.crossDomain = true;
        }
      }
      return request;
    }

    /**
     * 解锁搜索功能
     * @param request
     */
    async requestSearchInterceptor(request) {
      if (PluginStore.get("unlockSearch", true) === true && PluginStore.get("host", "").length > 0) {
        if (/\/api\/user\/search/g.test(request.url)) {
          console.log("搜索", request.url);
          var host = PluginStore.get("host", "");
          request.baseURL = host;
          request.crossDomain = true;
        }
      }
      return request;
    }

    /**
     * 对返回数据进行解码
     * @param response
     */
    async responseDecodeInterceptor(response) {
      if (response.data.status === 200) {
        const origin_response = JSON.parse(JSON.stringify(response.data.data));
        var enc_data = response.data.data.data;
        if (enc_data && typeof enc_data === "string" && enc_data.length > 0) {
          const Base64 = getModule("e762").a;
          enc_data = JSON.parse(Base64.decode(Base64.decode(Base64.decode(enc_data))));
        }
        response = {
          item: enc_data,
          url: response.config.url,
          mobile: true,
          origin_response: origin_response
        };
      } else {
        // 克隆一个原始请求
        const origin_response = JSON.parse(JSON.stringify(response.data));
        const item = JSON.parse(JSON.stringify(response.data.data));
        response = {
          item: item,
          url: response.config.url,
          mobile: false,
          origin_response: origin_response
        };
      }
      return response;
    }

    /**
     * 对reponse重新编码
     * @param response
     * @returns
     */
    async responseEncodeInterceptor(response) {
      if (response.mobile === true) {
        var dec = response.item;
        if (response.origin_response.isEncrypted === true) {
          const Base64 = getModule("e762").a;
          dec = Base64.encode(Base64.encode(Base64.encode(JSON.stringify(response.item))));
        }
        return {
          data: {
            ...response.origin_response,
            data: dec
          }
        };
      } else {
        return {
          ...response.origin_response,
          data: response.item
        };
      }
    }
    async responseInterceptor(response) {
      const url = response.url.toLowerCase();
      var item = response.item;
      console.log("拦截器返回数据", url, item);
      if (/^\/api\/topic\/\d+/g.test(url) && PluginStore.get("unlockVip", true) === true) {
        item = await this.fixTopic(item);
      }
      // 去广告
      else if (/banner\/banner_list/g.test(url) && PluginStore.get("removeAds", true) === true) {
        item = await this.fixAds(item);
      }
      // 屏蔽置顶帖
      else if (/^\/api\/topic\/global\/topics/g.test(url) && PluginStore.get("removeTops", true) === true) {
        item = await this.fixTops(item);
      }
      response.item = item;
      return response;
    }
    /**
     * 修复帖子内容
     * @param {*} data
     * @returns
     */
    async fixTopic(data) {
      console.log("修复帖子内容", data);
      if (data.node?.vipLimit > 0) {
        data.node.vipLimit = 0;
      }
      var content = data.content;
      if (content && !content.startsWith("<html><head></head><body>")) {
        // 删除掉[]标签
        content = content.replace(/\[视频\]/g, "");
        content = content.replace(/\[图片\]/g, "");
        content = content.replace(/此处内容售价\d+金币.*请购买后查看./g, "");
        content = content.replace(/\[sell.*\/sell]/g, "");
        data.attachments?.forEach(attachment => {
          var hasImage,
            hasVideo = false;
          // 处理图片
          if (attachment.category === "images" && attachment.remoteUrl) {
            content = content += `<p><img src="${attachment.remoteUrl}" data-id="${attachment.id}"/>`;
            hasImage = true;
          }
          if (hasImage === true) {
            content = `<p>${content}</p>`;
          }
          if (attachment.category === "video") {
            hasVideo = true;
            content += `<p><video src="${attachment.remoteUrl}" data-id="${attachment.id}"></video></p>`;
          }
          if (hasVideo === true) {
            content = `<p>${content}</p>`;
          }
        });
        content = `<html><head></head><body>${content}</body></html>`;
      } else {
        // 处理html内容

        var parser = new DOMParser();
        var doc = parser.parseFromString(content, "text/html");
        const videoNodes = doc.querySelectorAll("video");
        videoNodes.forEach(videoNode => {
          videoNode.remove();
        });
        const sellContainer = doc.querySelector(".sell-btn");
        if (sellContainer) {
          sellContainer.remove();
        }
        if (Object.hasOwnProperty.call(data, "attachments") && data.attachments.length > 0) {
          data.attachments.forEach(attachment => {
            if (attachment.category === "video") {
              // 创建一个新tag加入到body中
              const video = doc.createElement("video");
              video.src = attachment.remoteUrl;
              video.setAttribute("data-id", attachment.id);
              doc.body.appendChild(video);
            }
          });
        }
        const serializer = new XMLSerializer();
        const serializedHTML = serializer.serializeToString(doc);
        content = serializedHTML;
      }
      data.content = content;
      return data;
    }

    /**
     * 去广告
     * @param data
     */
    async fixAds(data) {
      return null;
    }
    async fixTops(data) {
      return [];
    }
  }

  function addStyle() {
    let script = document.createElement("link");
    script.setAttribute("rel", "stylesheet");
    script.setAttribute("type", "text/css");
    script.href = "https://cdn.jsdelivr.net/npm/antd@5.16.4/dist/reset.min.css";
    document.documentElement.appendChild(script);
  }
  function setCookie(name, value) {
    document.cookie = name + "=" + value + ";path=/;expires=" + new Date(Date.now() + 864e5).toUTCString() + ";";
  }

  function initialed(vue, store, axios) {
    const interceptor = new Interceptor(axios);
    interceptor.initRequestInterceptor();
    interceptor.initResponseInterceptor();
  }
  function initSetting() {
    const myButton = /*#__PURE__*/React__default["default"].createElement(App, null);
    const pluginDiv = document.createElement("div");
    pluginDiv.id = "haijiao-vip-plugin";
    document.body.appendChild(pluginDiv);
    ReactDOM__default["default"].render(myButton, pluginDiv);
  }
  sessionStorage.setItem("pageOpen", "1");
  if (/hjcx.org/.test(window.location.href)) {
    setCookie("is_vip", "1");
  } else {
    addStyle();
    initSetting();
    initHookWebpack(initialed);
  }
  console.log("haijiao-vip-plugin init success");

})(React, ReactDOM, antd, icons);
