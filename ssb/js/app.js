(function () {
  const state = {
    view: "quick",
    backView: "quick",
    agreed: false,
    phone: "18650338765",
    code: "",
    sentCode: "",
    countdown: 0,
    mode: "guest",
    tab: "home",
    fileView: "empty",
    files: [],
    uploadOpen: false,
    uploadExpanded: false,
    progress: 12,
    chatStep: 0,
    chatResult: "",
    sheet: "",
    product: "财产保全保函",
    flowAgree: false,
    personKind: "person",
    applicant: null,
    respondent: null,
    payView: "main",
    fileWarn: false,
    reqOpen: "apply",
    checking: false
  };

  const sampleFiles = [
    ["聊天记录.jpg", "1.8MB", "img"],
    ["案件证据材料1.jpg", "1.2MB", "img"],
    ["案件证据材料3.jpg", "2.1MB", "pdf"],
    ["案件证据材料3.jpg", "1.8MB", "img"],
    ["案件证据材料3.jpg", "1.8MB", "img"],
    ["案件证据清单.docx", "2.0MB", "doc"],
    ["案件证据材料4.jpg", "2.1MB", "img"],
    ["保全申请书.pdf", "2.1MB", "pdf"],
    ["案件证据材料4.jpg", "2.1MB", "img"],
    ["案件证据材料2.jpg", "2.4MB", "img"]
  ];

  const titles = {
    quick: "",
    phone: "登录",
    agreement: "用户协议",
    privacy: "隐私政策",
    done: "",
    "flow-info": "保函申请",
    "flow-files": "案件材料",
    "flow-org": "选择金融机构",
    "flow-sign": "签章",
    "flow-pay": "支付信息",
    "flow-wait": ""
  };

  const agreementHtml = `
    <article class="legal">
      <p class="indent lead">感谢您(以下或称“用户”)访问并使用国函通旗下产品服务!本协议是您与国函通所有者就提供的服务的相关事宜所订立的协议(以下称“本协议”)。尊敬的用户，为维护您自身权益，在登录注册前请您仔细阅读本协议，当您点击登录、注册或绑定按钮即代表您已完全阅读并同意所有服务条款，并自愿遵守本协议。如您对本协议任何条款有异议，请您联系以便我们为您进行解释和说明，使您能够充分理解，从而帮助您自主决定是否接受本协议及是否使用我们的服务。</p>
      <h2>一、相关定义</h2>
      <p class="indent">除非本协议另有约定，本协议下列术语定义如下：<br>1.1 国函通旗下产品服务：是指由国函通科技有限公司及其关联公司旗下运营之“国函通”、“诉讼保”、“保函通”等小程序及网站。<br>1.2 “诉讼保”：指国函通旗下运营的诉讼保服务平台，我们提供用于在线提交诉讼保全保函申请及查询申请进度的服务平台。<br>1.3 “国函通”：指由国函通旗下运营的综合咨询服务平台，用于提供在线保函询价、信用额度查询以及相关资讯服务。<br>1.4 保函：指由保险公司、银行或担保公司提供的保函（包含电子保函或纸质保函）。保函询价：指用户在线提交申请材料后由保险公司、银行或担保公司提供报价参考。<br>1.5 查询额度：为企业提供在线信用额度查询，由接入的银行提供信用额度结果。<br>1.6 账户：指用户注册成功后系统生成的相关电子账户，用于储存用户的账户信息、被关联的企业信息、及申请时所需的信息等。<br>1.7 企业关联：指账户管理员将所属企业于注册账户进行绑定关联的行为。</p>
    </article>`;

  const privacyHtml = `
    <article class="legal">
      <h2>引言</h2>
      <p class="indent">欢迎您使用国函通旗下产品服务!我们非常重视您的隐私和个人信息保护。您在使用我们产品与/或服务时，我们可能会收集和使用您的相关信息。我们希望通过本隐私政策向您说明在您使用我们的产品与/或服务时我们如何收集、使用、保存、共享和转移这些信息，以及我们为您提供的访问、更新、删除和保护这些信息的方式。</p>
      <p class="lines">本隐私政策将帮助您了解以下内容：<br>一、我们如何收集和使用您的个人信息<br>二、我们如何使用 Cookies 和同类技术<br>三、我们如何保护您的个人信息<br>四、我们如何对外提供您的个人信息<br>五、您如何管理个人信息<br>六、未成年人的个人信息保护<br>七、本隐私政策的通知和修订<br>八、如何联系我们</p>
      <h2>一、我们如何收集和使用您的个人信息</h2>
      <p class="indent">您使用国函通旗下产品服务的过程中，以下情形中我们需要收集您的一些信息，用以向您提供服务。我们会遵循正当、合法、必要的原则，出于本政策所述的以下目的，收集和使用您在使用产品与/或服务过程中主动提供或因使用产品与/或服务而产生的个人信息，以及从第三方获取您的相关个人信息。</p>
      <p>（一）注册成为用户<br><span class="indent">您在使用国函通提供的服务时，首先需要成为我们的注册/登录用户，当您注册账户时（包括个人及企业），您需要提供以下信息：企业名称、统一社会信用代码、手机号、联系人姓名、联系人手机号、账户名、登录密码。</span><br>（二）在线申请<br><span class="indent">为能向您提供在线申请服务，您需要提供使用申请服务功能过程中必要的信息，包括但不限于：所在地、所在法院、案件类型、案件金额、申请人信息等。同时，为了验证您提供信息的准确性和完整性，我们会与合法留存您的信息的机构进行核对。</span></p>
    </article>`;

  const pages = document.getElementById("pages");
  const navTitle = document.getElementById("navTitle");
  const toastEl = document.getElementById("toast");
  const mask = document.getElementById("mask");
  let toastTimer = 0;
  let countTimer = 0;

  function agreeBlock() {
    return `<div class="agree${state.agreed ? " on" : ""}" id="agree">
      <button class="dot" type="button" data-act="toggle-agree" aria-label="同意协议"></button>
      <span class="agree-text">阅读并同意<button class="link" type="button" data-act="go-agreement">《用户协议》</button>和<button class="link" type="button" data-act="go-privacy">《隐私政策》</button></span>
    </div>`;
  }

  function brand() {
    return `<img class="logo" src="assets/logo.png" alt="诉讼保">
      <img class="slogan" src="assets/slogan.png" alt="诉讼保，在身边">`;
  }

  function selectedCount() {
    return state.files.filter(function (file) { return file.on; }).length;
  }

  function tabbar(active) {
    const items = [
      ["home", "首页", '<path d="M4 11.5 12 5l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1z"/>'],
      ["tools", "工具", '<rect x="4" y="4" width="7" height="7" rx="1.4"/><rect x="13" y="4" width="7" height="7" rx="1.4"/><rect x="4" y="13" width="7" height="7" rx="1.4"/><rect x="13" y="13" width="7" height="7" rx="1.4"/>'],
      ["service", "客服", '<path d="M5 12a7 7 0 0 1 14 0"/><rect x="3.5" y="11" width="3.5" height="6" rx="1.2"/><rect x="17" y="11" width="3.5" height="6" rx="1.2"/><path d="M12 19.5h3.5a2 2 0 0 0 2-2"/>'],
      ["mine", "我的", '<circle cx="12" cy="9" r="3.2"/><path d="M5.5 19.2a6.5 6.5 0 0 1 13 0"/>']
    ];
    return `<nav class="tabbar">${items.map(function (item) {
      const on = item[0] === active;
      const color = on ? "#0b75ff" : "#1f3566";
      return `<button type="button" class="${on ? "on" : ""}" data-act="tab" data-tab="${item[0]}"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.6">${item[2]}</svg>${item[1]}</button>`;
    }).join("")}</nav>`;
  }

  function homePage() {
    const doc = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.7"><path d="M7 3.5h7l4 4V20a1.5 1.5 0 0 1-1.5 1.5h-9.5A1.5 1.5 0 0 1 5.5 20V5A1.5 1.5 0 0 1 7 3.5z"/><path d="M14 3.5V8h4.5M8.5 12h7M8.5 16h5"/></svg>`;
    const cards = [
      ["财产保全保函", "#006aff", "#009dff", `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.7"><path d="M12 3.2l7 2.6v5.4c0 4.2-2.9 7.1-7 8.6-4.1-1.5-7-4.4-7-8.6V5.8l7-2.6z"/><path d="M9 12.1l2 2 4-4.2"/></svg>`],
      ["证据保全保函", "#595bf9", "#5e82fb", doc],
      ["行为保全保函", "#00cdd9", "#09cfdc", `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.7"><path d="M12 3v18M4.5 8h15"/><path d="M7.5 8L5 14h5l-2.5-6zM16.5 8L14 14h5l-2.5-6z"/></svg>`],
      ["解封保全保函", "#3d7eff", "#6aa6ff", `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.7"><rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7.5a4 4 0 0 1 7.5-2"/></svg>`],
      ["继续保全保函", "#595bf9", "#5e82fb", `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.7"><rect x="4" y="5" width="16" height="14" rx="2"/><path d="M10 9.5v5l5-2.5-5-2.5z"/></svg>`],
      ["先予保全保函", "#ffb957", "#fe9c23", `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.7"><path d="M14 4l6 6-8 8H6v-6l8-8z"/><path d="M4 20h7"/></svg>`]
    ];
    const news = [
      ["21", "2026.03", "某汽车销售有限公司等诉纷案", "北京琮某汽车配件销售有限公司诉讼案件称琮某配件公司）以库存为抵押，多次向北京市某小额贷借贷，应出借人要求，将抵押库存汽车配..."],
      ["16", "2026.02", "诉讼保课堂，诉讼财产保全是否适用于执行异议程序？", "中华人民共和国民事诉讼法（以下简称琮某配件公司）以库存为抵押，多次向北京市某小额贷借贷，应出借人要求，将抵押库存汽车配..."],
      ["08", "2026.02", "最高法发布新规，进一步规范诉前财产保全适用条件", "新规明确了诉前保全的担保数额标准，对申请人提交"]
    ];
    return `<section class="home-page">
      <img class="home-hero" src="assets/home-hero.png" alt="">
      <article class="order-card">
        <img class="bell" src="assets/铃铛.svg" alt="">
        <div class="order-top"><strong>福州市中级人民法院</strong><em>等待出函</em></div>
        <p class="sub">财产保全·诉中保全·10000.00</p>
        <p class="tip">请及时核对保单及保函相关信息。如需打印使用，保单、保函及诉讼责任..</p>
        <button class="chev" type="button" data-act="order">›</button>
      </article>
      <div class="apply-head">
        <h2>快捷申请 <i>?</i></h2>
        <button class="ai-entry" type="button" data-act="go-ai">✦ AI智能申请 ›</button>
      </div>
      <div class="shortcut-grid">
        ${cards.map(function (card) {
          return `<button class="shortcut" type="button" data-act="product" data-name="${card[0]}"><b style="background:linear-gradient(180deg,${card[1]},${card[2]})">${card[3]}</b><span>${card[0]}</span></button>`;
        }).join("")}
      </div>
      <img class="home-banner" src="assets/home-banner.png" alt="文书助手">
      <section class="news-card">
        <div class="news-head"><h2>诉讼指南专区</h2><button type="button" data-act="more">更多 ›</button></div>
        <div class="news-list">
          ${news.map(function (item) {
            return `<article class="news-item"><div class="news-date"><strong>${item[0]}</strong><span>${item[1]}</span></div><div><h3>${item[2]}</h3><p>${item[3]}</p></div></article>`;
          }).join("")}
        </div>
      </section>
      <section class="partner">
        <h2>合作机构</h2>
        <img src="assets/home-logos.png" alt="合作机构">
      </section>
    </section>${tabbar(state.tab)}`;
  }

  function fileRows() {
    return state.files.map(function (file, index) {
      return `<div class="file-row">
        <button class="tick${file.on ? " on" : ""}" type="button" data-act="toggle-file" data-i="${index}">✓</button>
        <div class="thumb ${file.kind}">${file.kind === "pdf" ? "P" : file.kind === "doc" ? "W" : "图"}</div>
        <div class="meta"><b>${file.name}</b><span>${file.size}</span></div>
        <button class="del" type="button" data-act="remove-file" data-i="${index}">×</button>
      </div>`;
    }).join("");
  }

  function uploadSheet() {
    const count = selectedCount();
    const list = state.fileView !== "empty";
    const body = !list
      ? `<div class="upload-empty"><h2>请上传案件材料</h2><p>上传起诉状、保全申请书、案件证据材料，可多次添加<br>支持图片、Word、PDF、Zip 格式</p><button class="pick" type="button" data-act="pick-files">+ 点击上传</button></div>
         <div class="suggest">
           <button type="button" data-act="ask">办理财产保全保函需要哪些材料？</button>
           <button type="button" data-act="ask">需要提交哪些材料给到法院？</button>
           <button type="button" data-act="ask">出函时效一般要多长？</button>
           <button type="button" data-act="ask">诉前保全与诉中保全的区别？</button>
         </div>`
      : `<div class="file-head"><span>材料列表 (${state.files.length})</span><button type="button" data-act="toggle-grid" aria-label="切换视图">${state.fileView === "grid" ? listIcon() : gridIcon()}</button></div>`
        + (state.fileView === "grid" ? fileGrid() : `<div class="file-list">${fileRows()}</div>`);
    const uploading = state.uploadOpen ? `<div class="up-mask"><div class="up-box">
      <header>正在上传<span>${state.progress}% · 2.4 MB/s</span></header>
      <div class="bar"><i style="width:${state.progress}%"></i></div>
      ${state.uploadExpanded ? `<div class="up-more">${state.files.filter(function (f) { return f.on; }).slice(0, 5).map(function (f) { return `<p>↑ ${f.name}</p>`; }).join("")}</div>` : `<p class="up-file">↑ ${ (state.files.find(function (f) { return f.on; }) || state.files[0] || {name:""}).name }</p>`}
      <div class="up-foot"><span>1 / ${count} 已完成</span><button type="button" data-act="toggle-upload">${state.uploadExpanded ? "收起" : "详情"}</button></div>
    </div></div>` : "";
    return `<section class="sheet">
      <h2 class="sheet-greet">今天有什么可以帮到你？</h2>
      <div class="source-bar">
        <button class="chip" type="button">本地</button>
        <button class="chip" type="button">相册</button>
        <button class="chip" type="button">微信</button>
        <button class="chip" type="button">扫描</button>
        <button class="x" type="button" data-act="close-upload">×</button>
      </div>
      <div class="sheet-body">${body}</div>
      <div class="sheet-foot">
        ${list ? `<button class="all" type="button" data-act="toggle-all">${count === state.files.length ? "◉" : "○"} 全选 ｜ 已选 ${count}/${state.files.length}</button>` : "<span></span>"}
        <button class="go" type="button" data-act="submit-files" ${list && !count ? "disabled" : ""}>上传提交</button>
      </div>
      ${uploading}
    </section>`;
  }

  function gridIcon() {
    return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#606266" stroke-width="1.7"><rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/></svg>`;
  }

  function listIcon() {
    return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#606266" stroke-width="1.7"><path d="M5 7h14M5 12h14M5 17h14"/></svg>`;
  }

  function fileGrid() {
    return `<div class="file-grid">${state.files.map(function (file, index) {
      const mark = file.kind === "pdf" ? "P" : file.kind === "doc" ? "W" : "图";
      return `<div class="cell"><div class="shot"><button class="tick${file.on ? " on" : ""}" type="button" data-act="toggle-file" data-i="${index}">✓</button><button class="del" type="button" data-act="remove-file" data-i="${index}">×</button><div class="thumb ${file.kind}">${mark}</div></div><p>${file.name}</p><span>${file.size}</span></div>`;
    }).join("")}</div>`;
  }

  function composerHtml() {
    return `<div class="composer">
      <button class="round" type="button" aria-label="语音"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#606266" stroke-width="1.6" stroke-linecap="round"><path d="M4 10v4M8 6v12M12 3v18M16 7v10M20 10v4"/></svg></button>
      <input class="input" readonly>
      <button class="plus" type="button" data-act="go-upload" aria-label="上传">+</button>
    </div>`;
  }

  function chatPage() {
    const steps = ["文件上传成功", "文件解压与安全校验", "识别案件材料类型", "智能提取案件信息", "生成解析结果"];
    const stepHtml = steps.map(function (label, index) {
      const ok = index < state.chatStep;
      const run = index === state.chatStep && !state.chatResult;
      return `<div class="step${ok ? " ok" : ""}${run ? " run" : ""}"><span class="mark">${ok ? "✓" : "○"}</span>${label}</div>`;
    }).join("");
    const ok = state.chatResult === "ok";
    const bad = state.chatResult === "bad";
    const result = !state.chatResult ? "" : `<article class="result-card">
      <h3>解析结果</h3>
      ${bad ? `<p class="warn">法院缺失；案号缺失；被申请人身份信息不完整；保全请求缺失</p>` : ""}
      <div class="kv"><em>法院名称</em><span>${bad ? "-" : "蒙古族藏族自治州中级人民法院"}</span></div>
      <div class="kv"><em>保全类型</em><span>财产保全</span></div>
      <div class="kv"><em>保全类别</em><span>诉前保全</span></div>
      <div class="kv"><em>案由</em><span>股东损害公司债权人利益责任纠纷</span></div>
      <div class="kv"><em>案号</em><span>${bad ? "-" : "(2025)京0105民初1234号"}</span></div>
      <div class="kv"><em>诉讼标的</em><span>¥10303</span></div>
      <div class="kv"><em>保全金额</em><span>¥10303</span></div>
      <h4>当事人</h4>
      <p class="who"><b>申请人</b>余汉宗 110101199001933456<br>贵州沿河土家族自治县夹石镇桃园</p>
      <p class="who"><b>被申请人</b>福建零点智能工程有限公司<br>福建省福州市鼓楼区北二环中路</p>
      ${ok ? `<p class="who"><b>第三方</b>张正源 110101199001933456<br>贵州沿河土家族自治县夹石镇桃园</p><h4>保全请求</h4><p class="who"><b>银行存款</b>福建零点智能工程有限公司 ¥10303<br>请求冻结被申请人张凯、鲁安娜名下银行存款人民币8200元。</p><h4>事实与理由</h4><p class="who">申请人因买卖合同纠纷起诉被申请人福建零点智能工程有限公司。2026年6月15日至2026年9月3日，公司向申请人采购电线。申请人完成供货，经对账尚欠货款10303元；被申请人余汉宗名下财产存在被刑事程序处置风险，申请人已购买诉讼财产保全责任保险作为担保。</p><button class="apply-btn" type="button" data-act="apply">保函申请</button>` : ""}
    </article>`;
    return `<section class="ai-page">
      <div class="ai-scroll">
        <div class="bubble"><i>图</i><div><b>法院诉责-廖显全.jpg</b><span>16.2MB</span></div></div>
        <article class="parse-card">
          <h3>材料解析 法院诉责-廖显全.jpg</h3>
          ${stepHtml}
          ${state.chatResult ? `<div class="chips"><span>起诉状.pdf 起诉状</span><span>保全申请书.pdf 保全申请书</span></div><button class="linkish" type="button">展开其余${bad ? "2" : "8"}份材料</button>` : ""}
        </article>
        ${result}
      </div>
      ${composerHtml()}
    </section>`;
  }

  function render() {
    const device = document.getElementById("device");
    const tabView = state.view === "home" || state.view === "tools" || state.view === "service" || state.view === "mine";
    device.classList.toggle("is-home", tabView);
    device.classList.toggle("is-ai", state.view === "ai" || state.view === "ai-upload" || state.view === "ai-chat");
    device.classList.toggle("is-flow", state.view.indexOf("flow-") === 0);
    navTitle.textContent = titles[state.view] || "";
    if (state.view === "quick") {
      pages.innerHTML = `<section class="page page-quick">
        ${brand()}
        <button class="btn btn-primary" type="button" data-act="quick-login">一键快捷登录</button>
        <button class="btn btn-ghost" type="button" data-act="skip">暂不登录</button>
        <button class="text-link" type="button" data-act="go-phone">手机号登录</button>
        ${agreeBlock()}
      </section>`;
    } else if (state.view === "phone") {
      const wait = state.countdown > 0;
      pages.innerHTML = `<section class="page page-phone">
        ${brand()}
        <input class="field field-phone" id="phone" inputmode="numeric" maxlength="11" placeholder="请输入手机号" value="${escapeAttr(state.phone)}" autocomplete="tel">
        <div class="field field-code">
          <input id="sms" inputmode="numeric" maxlength="6" placeholder="请输入短信验证码" value="${escapeAttr(state.code)}" autocomplete="one-time-code">
          <button class="get-code" id="getCode" type="button" data-act="get-code" ${wait ? "disabled" : ""}>${wait ? state.countdown + "s后重新获取" : "获取验证码"}</button>
        </div>
        <button class="btn btn-primary" type="button" data-act="phone-login">登录</button>
        ${agreeBlock()}
      </section>`;
    } else if (state.view === "agreement") {
      pages.innerHTML = agreementHtml;
    } else if (state.view === "privacy") {
      pages.innerHTML = privacyHtml;
    } else if (state.view === "home") {
      pages.innerHTML = homePage() + Flow.overlay(state);
    } else if (state.view === "tools" || state.view === "service" || state.view === "mine") {
      const names = { tools: "工具", service: "客服", mine: "我的" };
      pages.innerHTML = `<section class="placeholder-page">${names[state.view]}</section>${tabbar(state.view)}`;
    } else if (state.view === "ai") {
      pages.innerHTML = `<section class="ai-page">
        <div class="ai-scroll">
          <div class="ai-hello"><h2>欢迎使用</h2><p>上传起诉状、保全申请书、案件证据材料等帮你快速申请获取报价</p></div>
          <div class="ai-tip">点击这里上传案件材料</div>
        </div>
        ${composerHtml()}
      </section>`;
    } else if (state.view === "ai-upload") {
      pages.innerHTML = uploadSheet();
    } else if (state.view === "ai-chat") {
      pages.innerHTML = chatPage();
    } else if (state.view.indexOf("flow-") === 0) {
      pages.innerHTML = Flow.page(state);
    } else if (state.view === "done") {
      const guest = state.mode === "guest";
      const title = guest ? "暂不登录" : "登录成功";
      const desc = guest
        ? "您可以先浏览，登录后使用完整服务"
        : state.mode === "quick"
          ? "已完成本机号码一键登录"
          : "当前账号 " + maskPhone(state.phone);
      navTitle.textContent = title;
      pages.innerHTML = `<section class="done">
        ${brand()}
        <h2>${title}</h2>
        <p>${desc}</p>
        <button class="btn btn-primary" type="button" data-act="reset">${guest ? "去登录" : "退出登录"}</button>
      </section>`;
    }
  }

  function escapeAttr(value) {
    return String(value).replace(/"/g, "&quot;");
  }

  function maskPhone(phone) {
    if (!/^1\d{10}$/.test(phone)) return phone;
    return phone.slice(0, 3) + "****" + phone.slice(7);
  }

  function toast(message, duration) {
    toastEl.textContent = message;
    toastEl.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.hidden = true; }, duration || 1800);
  }

  function go(view) {
    state.view = view;
    toastEl.hidden = true;
    clearTimeout(toastTimer);
    render();
  }

  let uploadTimer = 0;
  let chatTimer = 0;

  function beginUpload() {
    state.uploadOpen = true;
    state.uploadExpanded = false;
    state.progress = 8;
    render();
    clearInterval(uploadTimer);
    uploadTimer = setInterval(function () {
      state.progress = Math.min(100, state.progress + 14);
      if (state.progress >= 100) {
        clearInterval(uploadTimer);
        state.uploadOpen = false;
        state.chatStep = 0;
        state.chatResult = "";
        go("ai-chat");
        startChat();
        return;
      }
      if (state.view === "ai-upload") render();
    }, 380);
  }

  function startChat() {
    clearInterval(chatTimer);
    chatTimer = setInterval(function () {
      if (state.view !== "ai-chat") { clearInterval(chatTimer); return; }
      if (state.chatStep < 5) state.chatStep += 1;
      if (state.chatStep >= 5 && !state.chatResult) {
        state.chatResult = selectedCount() === state.files.length ? "ok" : "bad";
        clearInterval(chatTimer);
      }
      render();
    }, 700);
  }

  function requireAgree() {
    if (state.agreed) return true;
    const row = document.getElementById("agree");
    if (row) {
      row.classList.remove("shake");
      void row.offsetWidth;
      row.classList.add("shake");
    }
    toast("请先阅读并同意\n《用户协议》和《隐私政策》");
    return false;
  }

  function validPhone(phone) {
    return /^1\d{10}$/.test(phone);
  }

  function syncInputs() {
    const phone = document.getElementById("phone");
    const sms = document.getElementById("sms");
    if (phone) state.phone = phone.value.replace(/\D/g, "").slice(0, 11);
    if (sms) state.code = sms.value.replace(/\D/g, "").slice(0, 6);
    if (phone && phone.value !== state.phone) phone.value = state.phone;
    if (sms && sms.value !== state.code) sms.value = state.code;
  }

  function openLegal(view) {
    syncInputs();
    state.backView = state.view === "agreement" || state.view === "privacy" ? state.backView : state.view;
    go(view);
  }

  document.getElementById("device").addEventListener("click", function (event) {
    const target = event.target.closest("[data-act]");
    if (!target) return;
    const act = target.dataset.act;
    if (act === "toggle-agree") {
      state.agreed = !state.agreed;
      const row = document.getElementById("agree");
      if (row) row.classList.toggle("on", state.agreed);
      return;
    }
    if (act === "go-agreement") { openLegal("agreement"); return; }
    if (act === "go-privacy") { openLegal("privacy"); return; }
    if (act === "go-phone") { go("phone"); return; }
    if (act === "back") {
      if (state.sheet) { state.sheet = ""; render(); return; }
      if (state.view === "agreement" || state.view === "privacy") go(state.backView || "quick");
      else if (state.view === "phone" || state.view === "done") go("quick");
      else if (state.view === "ai" || state.view === "ai-upload" || state.view === "ai-chat") go("home");
      else if (Flow.back(state, go)) return;
      return;
    }
    if (Flow.act(state, act, target, { go: go, render: render, toast: toast })) return;
    if (act === "quick-login") {
      if (!requireAgree()) return;
      state.mode = "quick";
      state.tab = "home";
      go("home");
      return;
    }
    if (act === "skip") {
      state.mode = "guest";
      state.tab = "home";
      go("home");
      return;
    }
    if (act === "get-code") {
      syncInputs();
      if (!state.phone) { toast("请输入手机号"); return; }
      if (!validPhone(state.phone)) { toast("请输入正确的手机号"); return; }
      if (!requireAgree()) return;
      if (state.countdown > 0) return;
      openCaptcha();
      return;
    }
    if (act === "phone-login") {
      syncInputs();
      if (!state.phone) { toast("请输入手机号"); return; }
      if (!validPhone(state.phone)) { toast("请输入正确的手机号"); return; }
      if (!state.sentCode) { toast("请先获取验证码"); return; }
      if (!state.code) { toast("请输入短信验证码"); return; }
      if (state.code !== state.sentCode) { toast("验证码错误"); return; }
      if (!requireAgree()) return;
      state.mode = "phone";
      state.tab = "home";
      go("home");
      return;
    }
    if (act === "tab") {
      state.tab = target.dataset.tab;
      go(state.tab);
      return;
    }
    if (act === "go-ai") { go("ai"); return; }
    if (act === "order") { go("flow-wait"); return; }
    if (act === "go-upload") {
      state.fileView = state.files.length ? state.fileView : "empty";
      go("ai-upload");
      return;
    }
    if (act === "close-upload") { go("ai"); return; }
    if (act === "pick-files") {
      state.files = sampleFiles.map(function (item, index) {
        return { name: item[0], size: item[1], kind: item[2], on: index !== 6 && index !== 8 };
      });
      state.fileView = "list";
      render();
      return;
    }
    if (act === "toggle-grid") {
      state.fileView = state.fileView === "grid" ? "list" : "grid";
      render();
      return;
    }
    if (act === "toggle-file") {
      const file = state.files[Number(target.dataset.i)];
      if (file) file.on = !file.on;
      render();
      return;
    }
    if (act === "remove-file") {
      state.files.splice(Number(target.dataset.i), 1);
      if (!state.files.length) state.fileView = "empty";
      render();
      return;
    }
    if (act === "toggle-all") {
      const all = selectedCount() === state.files.length;
      state.files.forEach(function (file) { file.on = !all; });
      render();
      return;
    }
    if (act === "toggle-upload") {
      state.uploadExpanded = !state.uploadExpanded;
      render();
      return;
    }
    if (act === "submit-files") {
      if (!state.files.length) { toast("请先上传案件材料"); return; }
      if (!selectedCount()) { toast("请选择要上传的材料"); return; }
      beginUpload();
      return;
    }
    if (act === "ask") { toast(target.textContent); return; }
    if (act === "more") { toast("更多内容"); return; }
    if (act === "apply") { go("flow-info"); return; }
    if (act === "reset") {
      state.mode = "guest";
      state.sentCode = "";
      state.code = "";
      go("quick");
      return;
    }
    if (act === "close-captcha") { closeCaptcha(false); return; }
    if (act === "refresh-captcha") { buildCaptcha(); return; }
  });

  document.getElementById("device").addEventListener("input", function (event) {
    if (event.target.id === "phone" || event.target.id === "sms") syncInputs();
  });

  function startCountdown() {
    state.countdown = 60;
    clearInterval(countTimer);
    countTimer = setInterval(function () {
      state.countdown -= 1;
      const btn = document.getElementById("getCode");
      if (state.countdown <= 0) {
        state.countdown = 0;
        clearInterval(countTimer);
        if (btn) { btn.disabled = false; btn.textContent = "获取验证码"; }
        return;
      }
      if (btn) { btn.disabled = true; btn.textContent = state.countdown + "s后重新获取"; }
    }, 1000);
    const btn = document.getElementById("getCode");
    if (btn) { btn.disabled = true; btn.textContent = "60s后重新获取"; }
  }

  const puzzle = {
    w: 278,
    h: 150,
    size: 46,
    tab: 10,
    targetX: 180,
    targetY: 48,
    startX: 12,
    x: 12,
    variant: 0,
    clean: document.createElement("canvas"),
    dragging: false,
    origin: 0,
    handleLeft: 0,
    passed: false
  };

  function openCaptcha() {
    mask.hidden = false;
    buildCaptcha();
  }

  function closeCaptcha(passed) {
    mask.hidden = true;
    puzzle.dragging = false;
    if (!passed) return;
    state.sentCode = String(Math.floor(100000 + Math.random() * 900000));
    startCountdown();
    toast("验证码已发送 " + state.sentCode, 5000);
  }

  function buildCaptcha() {
    puzzle.passed = false;
    puzzle.variant = (puzzle.variant + 1) % 3;
    puzzle.targetX = 150 + Math.round(Math.random() * 60);
    puzzle.targetY = 36 + Math.round(Math.random() * 36);
    puzzle.x = puzzle.startX;
    const track = document.getElementById("sliderTrack");
    const tip = document.getElementById("sliderTip");
    const handle = document.getElementById("sliderHandle");
    track.classList.remove("ok", "fail");
    tip.textContent = "向右拖动滑块";
    handle.style.left = "0px";
    drawScene();
    drawPiece();
  }

  function prepareCanvas(canvas) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = puzzle.w * dpr;
    canvas.height = puzzle.h * dpr;
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return ctx;
  }

  function drawScene() {
    const ctx = prepareCanvas(puzzle.clean);
    const w = puzzle.w;
    const h = puzzle.h;
    const v = puzzle.variant;
    const sky = ctx.createLinearGradient(0, 0, 0, h * 0.62);
    const skies = [
      ["#8ec9f8", "#d7f0fb", "#e7f6ea"],
      ["#f7c98a", "#f6e2c4", "#d7ecf4"],
      ["#9fd0f5", "#e7f3fb", "#f3f7e8"]
    ];
    sky.addColorStop(0, skies[v][0]);
    sky.addColorStop(0.55, skies[v][1]);
    sky.addColorStop(1, skies[v][2]);
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = v === 1 ? "#f4efe8" : "#e7eef5";
    mountain(ctx, [0, h * 0.48, w * 0.16, h * 0.24, w * 0.3, h * 0.4, w * 0.46, h * 0.16, w * 0.62, h * 0.36, w * 0.78, h * 0.18, w, h * 0.42, w, h * 0.56, 0, h * 0.56]);
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.moveTo(w * 0.4, h * 0.22);
    ctx.lineTo(w * 0.46, h * 0.16);
    ctx.lineTo(w * 0.52, h * 0.25);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(w * 0.72, h * 0.24);
    ctx.lineTo(w * 0.78, h * 0.18);
    ctx.lineTo(w * 0.84, h * 0.27);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = v === 1 ? "#8ea4b8" : "#9eb4c6";
    mountain(ctx, [0, h * 0.62, w * 0.22, h * 0.4, w * 0.4, h * 0.58, w * 0.58, h * 0.34, w * 0.78, h * 0.56, w, h * 0.42, w, h * 0.7, 0, h * 0.7]);

    forest(ctx, 8, h * 0.58, 14);
    forest(ctx, w * 0.72, h * 0.55, 8);

    const lake = ctx.createLinearGradient(0, h * 0.6, 0, h);
    lake.addColorStop(0, v === 1 ? "#8fb8c9" : "#7eb6d8");
    lake.addColorStop(1, v === 1 ? "#4e8498" : "#3f7eaa");
    ctx.fillStyle = lake;
    ctx.fillRect(0, h * 0.62, w, h * 0.38);
    ctx.strokeStyle = "rgba(255,255,255,0.35)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(20, h * 0.72 + i * 12);
      ctx.bezierCurveTo(w * 0.3, h * 0.68 + i * 12, w * 0.6, h * 0.76 + i * 12, w - 16, h * 0.7 + i * 12);
      ctx.stroke();
    }

    const view = prepareCanvas(document.getElementById("scene"));
    view.drawImage(puzzle.clean, 0, 0, puzzle.w, puzzle.h);
    punchHole(view);
  }

  function mountain(ctx, points) {
    ctx.beginPath();
    ctx.moveTo(points[0], points[1]);
    for (let i = 2; i < points.length; i += 2) ctx.lineTo(points[i], points[i + 1]);
    ctx.closePath();
    ctx.fill();
  }

  function forest(ctx, x, y, n) {
    for (let i = 0; i < n; i++) {
      const px = x + i * 11;
      ctx.fillStyle = i % 2 ? "#2f6b45" : "#3e8054";
      ctx.beginPath();
      ctx.moveTo(px, y + 16);
      ctx.lineTo(px + 7, y - 8 - (i % 3) * 3);
      ctx.lineTo(px + 14, y + 16);
      ctx.fill();
    }
  }

  function piecePath(ctx, x, y, s, tab) {
    const r = tab;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + s * 0.32, y);
    ctx.arc(x + s * 0.5, y, r, Math.PI, 0, true);
    ctx.lineTo(x + s, y);
    ctx.lineTo(x + s, y + s * 0.32);
    ctx.arc(x + s, y + s * 0.5, r, -Math.PI / 2, Math.PI / 2, false);
    ctx.lineTo(x + s, y + s);
    ctx.lineTo(x, y + s);
    ctx.closePath();
  }

  function punchHole(ctx) {
    ctx.save();
    piecePath(ctx, puzzle.targetX, puzzle.targetY, puzzle.size, puzzle.tab);
    ctx.fillStyle = "rgba(0,0,0,0.45)";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(255,255,255,0.85)";
    ctx.stroke();
    ctx.restore();
  }

  function drawPiece() {
    const canvas = document.getElementById("piece");
    const ctx = prepareCanvas(canvas);
    ctx.clearRect(0, 0, puzzle.w, puzzle.h);
    ctx.save();
    ctx.translate(1, 2);
    piecePath(ctx, puzzle.x, puzzle.targetY, puzzle.size, puzzle.tab);
    ctx.fillStyle = "rgba(0,0,0,0.16)";
    ctx.fill();
    ctx.restore();
    ctx.save();
    piecePath(ctx, puzzle.x, puzzle.targetY, puzzle.size, puzzle.tab);
    ctx.clip();
    ctx.drawImage(puzzle.clean, puzzle.x - puzzle.targetX, 0, puzzle.w, puzzle.h);
    ctx.restore();
    ctx.save();
    piecePath(ctx, puzzle.x, puzzle.targetY, puzzle.size, puzzle.tab);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = "rgba(255,255,255,0.95)";
    ctx.stroke();
    ctx.restore();
  }

  const handle = document.getElementById("sliderHandle");
  const track = document.getElementById("sliderTrack");

  function maxSlide() {
    return track.offsetWidth - handle.offsetWidth;
  }

  function moveHandle(clientX) {
    if (puzzle.passed) return;
    const rect = track.getBoundingClientRect();
    const scale = rect.width / track.offsetWidth;
    let left = (clientX - puzzle.origin) / scale;
    left = Math.max(0, Math.min(maxSlide(), left));
    puzzle.handleLeft = left;
    handle.style.left = left + "px";
    const travel = puzzle.w - puzzle.size - puzzle.tab - puzzle.startX;
    puzzle.x = puzzle.startX + (left / maxSlide()) * travel;
    drawPiece();
    document.getElementById("sliderTip").textContent = "";
  }

  function endDrag() {
    if (!puzzle.dragging) return;
    puzzle.dragging = false;
    if (Math.abs(puzzle.x - puzzle.targetX) <= 5) {
      puzzle.passed = true;
      puzzle.x = puzzle.targetX;
      drawPiece();
      track.classList.add("ok");
      document.getElementById("sliderTip").textContent = "验证通过";
      setTimeout(function () { closeCaptcha(true); }, 450);
      return;
    }
    track.classList.add("fail");
    puzzle.x = puzzle.startX;
    puzzle.handleLeft = 0;
    handle.style.left = "0px";
    drawPiece();
    document.getElementById("sliderTip").textContent = "向右拖动滑块";
    setTimeout(function () { track.classList.remove("fail"); }, 360);
  }

  handle.addEventListener("pointerdown", function (event) {
    if (puzzle.passed) return;
    puzzle.dragging = true;
    const rect = track.getBoundingClientRect();
    const scale = rect.width / track.offsetWidth;
    puzzle.origin = event.clientX - puzzle.handleLeft * scale;
    try { handle.setPointerCapture(event.pointerId); } catch (err) {}
    event.preventDefault();
  });
  handle.addEventListener("pointermove", function (event) {
    if (!puzzle.dragging) return;
    moveHandle(event.clientX);
  });
  handle.addEventListener("pointerup", endDrag);
  handle.addEventListener("pointercancel", endDrag);

  function tickClock() {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    document.getElementById("clock").textContent = hh + ":" + mm;
  }

  function fit() {
    const viewport = window.visualViewport;
    const width = viewport ? viewport.width : window.innerWidth;
    const height = viewport ? viewport.height : window.innerHeight;
    const scale = Math.min(width / 375, height / 812);
    document.documentElement.style.setProperty("--s", String(scale));
  }

  window.addEventListener("resize", fit);
  if (window.visualViewport) window.visualViewport.addEventListener("resize", fit);
  tickClock();
  setInterval(tickClock, 10000);
  fit();
  render();
})();
