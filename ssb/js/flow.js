var Flow = (function () {
  var STEPS = ["上传材料", "选机构", "签章支付", "等待出函"];

  function steps(active) {
    return `<div class="steps">${STEPS.map(function (label, index) {
      const n = index + 1;
      const cls = n < active ? "past" : n === active ? "on" : "";
      return `<div class="st ${cls}"><i>${n}</i><b></b><span>${label}</span></div>`;
    }).join("")}</div>`;
  }

  function foot(label, act, agreed) {
    return `<footer class="flow-foot">
      <button class="agree-line${agreed ? " on" : ""}" type="button" id="flowAgree" data-act="flow-agree"><i></i>阅读并同意《用户协议》《隐私政策》</button>
      <button class="flow-next" type="button" data-act="${act}">${label}</button>
    </footer>`;
  }

  function row(star, label, value, placeholder, caret) {
    const shown = value
      ? `<em class="val">${value}</em>`
      : `<em class="ph">${placeholder || ""}</em>`;
    return `<div class="f-row">${star ? `<i class="star">*</i>` : ""}<span>${label}</span>${shown}${caret ? "<s>›</s>" : ""}</div>`;
  }

  function infoPage(state) {
    const who = state.applicant
      ? `<button class="who" type="button" data-act="open-applicant"><b>${state.applicant.name}</b><span>${state.applicant.id}</span><s>›</s></button>`
      : `<button class="who empty" type="button" data-act="open-applicant">请添加 <s>›</s></button>`;
    const resp = state.respondent
      ? `<button class="who" type="button" data-act="open-respondent"><b>${state.respondent.name}</b><span>${state.respondent.id}</span><s>›</s></button>`
      : `<button class="who empty" type="button" data-act="open-respondent">请添加 <s>›</s></button>`;
    return `<section class="flow">
      <div class="flow-scroll">
        ${steps(1)}
        <h2 class="f-sec">法院信息 <s>⌃</s></h2>
        ${row(true, "法院", "", "请输入关键词搜索法院", true)}
        ${row(true, "保全类型", "财产保全")}
        ${row(true, "保全类别", "诉前保全", "", true)}
        ${row(true, "标的金额(元）", "", "请输入请输入保全金额")}
        ${row(true, "案由", "合同纠纷", "", true)}
        ${row(false, "案件号", "", "请咨询法院，如无请填写无")}
        <h2 class="f-sec party"><i class="star">*</i>申请人信息 <button type="button" data-act="open-applicant"><i>+</i>添加</button><s>⌃</s></h2>
        ${who}
        <h2 class="f-sec party"><i class="star">*</i>被申请人信息 <button type="button" data-act="open-respondent"><i>+</i>添加</button><s>⌃</s></h2>
        ${resp}
        ${foot("下一步", "flow-next-info", state.flowAgree)}
      </div>
      ${personSheet(state)}
    </section>`;
  }

  function personSheet(state) {
    if (state.sheet !== "applicant" && state.sheet !== "respondent") return "";
    const resp = state.sheet === "respondent";
    const filled = resp ? state.respondent : state.applicant;
    const kind = state.personKind;
    const idRows = filled ? `
      <div class="id-line"><i class="doc"></i><div><b>身份证人像面</b><em class="ok">校验通过</em></div><button type="button">重新上传</button></div>
      <div class="id-line"><i class="doc"></i><div><b>身份证国徽面</b><em class="bad">校验不符，无误可忽略</em></div><button type="button">重新上传</button></div>` : `
      ${sheetRow(true, "身份证人像面", `<button class="reup" type="button">重新上传</button>`)}
      ${sheetRow(true, "身份证国徽面", `<button class="reup" type="button">重新上传</button>`)}`;
    return `<div class="dim" data-act="close-sheet"></div>
      <section class="psheet">
        <header><b>${resp ? "添加被申请人" : "添加申请人"}</b><button type="button" data-act="close-sheet">×</button></header>
        ${sheetRow(true, "类型", `<div class="kind"><button type="button" class="${kind === "person" ? "on" : ""}" data-act="kind" data-kind="person">自然人</button><button type="button" class="${kind === "org" ? "on" : ""}" data-act="kind" data-kind="org">企业</button></div>`)}
        ${idRows}
        ${sheetRow(true, "姓名", filled ? `<em>${filled.name}</em>` : `<em class="ph">请输入姓名</em>`)}
        ${resp ? "" : sheetRow(true, "证件类型", `<em>身份证 ›</em>`)}
        ${sheetRow(true, resp ? "证件号码" : "证件号码", filled ? `<em>${filled.id}</em>` : `<em class="ph">请输入证件号</em>`)}
        ${resp ? "" : sheetRow(true, "地址", filled ? `<em>${filled.addr}</em>` : `<em class="ph">请输入地址</em>`)}
        ${resp ? "" : sheetRow(true, "手机号", `<em class="phone">${filled ? filled.phone : "18812539983"}<button type="button" data-act="clear-phone">×</button></em>`)}
        <button class="psheet-ok" type="button" data-act="save-person">确定</button>
      </section>`;
  }

  function sheetRow(star, label, right) {
    return `<div class="s-row">${star ? `<i class="star">*</i>` : ""}<span>${label}</span>${right}</div>`;
  }

  function fileBlock(state, item) {
    const open = state.reqOpen === item.key;
    const warn = item.key === "apply" && state.fileWarn;
    return `<section class="mat">
      <div class="mat-h">
        ${item.must ? `<i class="star">*</i>` : ""}<b>${item.name}</b>
        <button type="button" data-act="toggle-req" data-key="${item.key}">材料要求 ${open ? "⌃" : "⌄"}</button>
        <button class="up" type="button" data-act="open-upload" data-key="${item.key}">↑ 点击上传</button>
      </div>
      ${open && item.tips ? `<div class="mat-tip">${item.tips}<button type="button" data-act="sample">查看范例</button></div>` : ""}
      ${warn ? `<p class="mat-warn">文件内容或不符，且缺少签字/盖章</p>` : ""}
      ${(item.files || []).map(function (name) {
        return `<div class="mat-file"><i class="doc"></i><span>${name}</span><i class="box"></i></div>`;
      }).join("")}
    </section>`;
  }

  function filesPage(state) {
    const groups = [
      { key: "sue", must: true, name: "起诉状/仲裁申请书", files: ["起诉状"] },
      { key: "apply", must: true, name: "保全申请书", tips: "<p>·当事人信息、请求事项、事实与理由及具体保全的类目</p><p>·申请人签名或盖章</p>", files: ["保全申请书"] },
      { key: "list", must: false, name: "案件证据清单", files: ["案件证据清单1", "案件证据清单2"] },
      { key: "proof", must: true, name: "案件证据材料", files: [] },
      { key: "court", must: false, name: "法院受理通知书", files: [] },
      { key: "other", must: false, name: "其他材料", files: [] }
    ];
    return `<section class="flow">
      <div class="flow-scroll files">
        <p class="remind">*温馨提醒：若下述材料暂时无法提交请使用电脑登录<br>www.baohantong.net（<button type="button" data-act="copy-link">复制</button>）进行后续提交</p>
        <h2>上传案件材料</h2>
        ${groups.map(function (item) { return fileBlock(state, item); }).join("")}
        ${foot("下一步", "flow-next-files", state.flowAgree)}
      </div>
      ${fileSheets(state)}
    </section>`;
  }

  function fileSheets(state) {
    if (state.sheet === "upload") {
      return `<div class="dim" data-act="close-sheet"></div>
        <section class="usheet">
          <button type="button" data-act="open-docs"><i class="ico a"></i>已生成文书列表选择 <s>›</s></button>
          <button type="button" data-act="open-local"><i class="ico b"></i>上传已有保全申请书 <s>›</s></button>
          <button class="cancel" type="button" data-act="close-sheet">取消</button>
        </section>`;
    }
    if (state.sheet === "local") {
      return `<div class="dim" data-act="close-sheet"></div>
        <section class="lsheet">
          <header>上传文件 <button type="button" data-act="close-sheet">×</button></header>
          <div class="srcs">
            <button type="button" data-act="picked"><i class="wx"></i>微信文件</button>
            <button type="button" data-act="picked"><i class="alb"></i>本地相册</button>
            <button type="button" data-act="picked"><i class="disk"></i>本地文件</button>
          </div>
        </section>`;
    }
    if (state.sheet === "tip") {
      return `<div class="dim"></div>
        <section class="tipbox">
          <h3>温馨提示</h3>
          <p>经校验您上传的材料或存在以下问题：</p>
          <p class="link">·起诉状：文件内容或不符，且缺少签字/盖章<br>·保全申请书：文件内容不符</p>
          <p class="note">建议您仔细核对相关信息，避免影响保函申请。若无误，可继续提交申请。</p>
          <div class="tip-acts"><button type="button" data-act="keep-submit">继续提交</button><button class="solid" type="button" data-act="close-sheet">我再看下</button></div>
        </section>`;
    }
    if (state.checking) return `<div class="check-toast">材料校验中...80%</div>`;
    return "";
  }

  function orgPage() {
    const cards = [
      ["永诚保险", "永诚财产保险股份有限公司", "1000.00", [["面签费", "¥50.00"]], ""],
      ["大家保险", "大家保险股份有限公司湖南分公司", "530.00", [["面签费", "¥50.00"], ["送函费", "¥100.00"], ["客服电话", "95590", "tel"]], "detail"],
      ["天安保险", "天安财产保险股份有限公司", "795.00", [["客服电话", "400-900-8000", "tel"]], ""]
    ];
    return `<section class="flow">
      <div class="flow-scroll org">
        ${steps(2)}
        ${cards.map(function (card, index) {
          return `<article class="org-card">
            <header><b class="brand l${index}">${card[0]}</b><strong><i>¥</i>${card[2]}</strong></header>
            <p class="corp"><i>保险</i>${card[1]} ›</p>
            <p class="fee">${card[3].map(function (pair) { return `<span>${pair[0]} <b class="${pair[2] || ""}">${pair[1]}</b></span>`; }).join("")}</p>
            <p class="tags"><span>24小时内出函</span><span>7天无理由退保 ›</span></p>
            <footer><button type="button">限时优惠 ⌄</button><button class="go" type="button" data-act="buy">立即办理</button></footer>
            ${card[4] ? `<div class="offer"><h4>优惠详情</h4><p>1、优惠活动描述优惠活动描述优惠活动描述优惠活动<br>2、优惠活动描述优惠活动描述优惠</p></div>` : ""}
          </article>`;
        }).join("")}
      </div>
    </section>`;
  }

  function signPage() {
    return `<section class="flow sign">
      <p class="sign-tip">请完成签章：</p>
      <button class="sign-card" type="button" data-act="signed">
        <b>线上签章</b>
        <span>均适合使用线上签章的个人及企业场景</span>
        <i class="stamp"></i>
      </button>
      <p class="sign-alt">无法进行线上签章？ <button type="button" data-act="signed">线下签章</button></p>
    </section>`;
  }

  function payPage(state) {
    const transfer = state.payView === "transfer" || state.payView === "voucher";
    const qr = state.payView === "qr";
    return `<section class="flow">
      <div class="flow-scroll pay">
        ${steps(3)}
        <p class="amount"><i>¥</i>500.00</p>
        <p class="amount-sub">订单提交成功，请尽快完成支付</p>
        <div class="pay-card">
          <p><span>订单号</span><b>202607280941359fa484f20005</b></p>
          <p><span>提交时间</span><b>2024-02-14 12:09</b></p>
          <p><span>商品名称</span><b>购买保函</b></p>
        </div>
        <button class="pay-row" type="button" data-act="wx-pay"><i class="wx"></i>微信支付 <em>去支付 ›</em></button>
        ${qr ? `<div class="qr"><svg viewBox="0 0 29 29">${qrCells()}</svg><p>长按识别二维码付款</p></div>` : ""}
        <button class="pay-row" type="button" data-act="bank-pay"><i class="bank"></i>转账汇款 <em>${transfer ? "获取汇款账号 ⌄" : "获取汇款账号 ›"}</em></button>
        ${transfer ? bankBox() : ""}
      </div>
    </section>`;
  }

  function qrCells() {
    let s = "";
    for (let y = 0; y < 29; y++) {
      for (let x = 0; x < 29; x++) {
        const finder = (x < 7 && y < 7) || (x > 21 && y < 7) || (x < 7 && y > 21);
        const ring = finder && (x === 0 || y === 0 || x === 6 || y === 6 || x === 22 || y === 22 || x === 28 || y === 28 || (x > 1 && x < 5 && y > 1 && y < 5) || (x > 23 && x < 27 && y > 1 && y < 5) || (x > 1 && x < 5 && y > 23 && y < 27));
        const bit = ring || ((x * 7 + y * 3) % 5 === 0);
        if (bit) s += `<rect x="${x}" y="${y}" width="1" height="1"/>`;
      }
    }
    return s;
  }

  function bankBox() {
    const lines = [
      ["收款户名", "大家财产保险有限责任公司"],
      ["开户银行", "中国工商银行福州东街口支行"],
      ["银行账号", "1402211619600012808"],
      ["转账金额", "500.00元"],
      ["备注", "法院诉讼保全保函"]
    ];
    return `<div class="bank-box">
      <h3>收款人信息 <button type="button" data-act="copy-bank">一键复制</button></h3>
      ${lines.map(function (line) { return `<p><span>${line[0]}</span><b>${line[1]}</b></p>`; }).join("")}
      <h3 class="voucher"><i>*</i>上传付款凭证</h3>
      <div class="voucher-row">
        <button class="plus" type="button" data-act="add-voucher">+</button>
        <input placeholder="请输入验证码" maxlength="4">
        <b class="code-img">2VYK</b>
      </div>
      <button class="flow-next slim" type="button" data-act="submit-pay">提交付款凭证</button>
    </div>`;
  }

  function waitPage() {
    const order = [
      ["订单号", "20230330"],
      ["订单金额(元)", "1000.00", "hot"],
      ["提交时间", "2024-02-14 12:09"],
      ["支付时间", "-"],
      ["出函时间", "-"]
    ];
    const matter = [
      ["法院名称", "湘潭市岳塘区人民法院"],
      ["保全类型", "财产保全"],
      ["保全类别", "诉前保全"],
      ["案由", "产品责任纠纷"],
      ["案件号", "19号"],
      ["标的金额(元)", "6892.00"],
      ["申请人", "上海零点职能工程有限公司"],
      ["被申请人", "余汉宗<br>福建省鲸世建设有限公司"],
      ["担保机构", "大家财产保险"]
    ];
    const lines = function (list) {
      return list.map(function (item) {
        return `<p><span>${item[0]}</span><b class="${item[2] || ""}">${item[1]}</b></p>`;
      }).join("");
    };
    return `<section class="flow wait">
      <div class="flow-scroll">
        <header class="wait-h">
          <i></i>
          <div><b>等待出函</b><span>感谢信任，请耐心等待出函！</span></div>
          <button type="button" data-act="refresh-material">材料更新</button>
        </header>
        <article class="wait-card"><h3>订单信息 <i class="svc"></i></h3>${lines(order)}</article>
        <article class="wait-card"><h3>案件信息</h3>${lines(matter)}</article>
        <article class="wait-card fold"><h3>案件材料 <s>⌄</s></h3></article>
        <article class="wait-card fold"><h3>售后服务 <button type="button" data-act="refund">申请退款</button></h3></article>
      </div>
    </section>`;
  }

  function productSheet(state) {
    if (state.sheet !== "product") return "";
    return `<div class="dim" data-act="close-sheet"></div>
      <section class="product-sheet">
        <header><b>${state.product}</b><button type="button" data-act="close-sheet">×</button></header>
        <h3>1. 适用情形</h3>
        <p>担心对方转移、隐匿、处分财产</p>
        <h3>2. 办理财产保全所需材料</h3>
        <ul>
          <li>起诉状 <em>必须</em></li>
          <li>保全申请书 <em>必须</em></li>
          <li>证据材料 <em>必须</em></li>
          <li>保全申请人证件材料 <em>必须</em></li>
          <li>法院受理通知书<br><span>(诉中保全：建议提供进行核对案由与案件号）</span></li>
        </ul>
        <h3>3. 温馨提醒</h3>
        <ul>
          <li>诉前保全保函：未立案前办理<br><span>(诉前保全需在30天内完成立案）</span></li>
          <li>诉中保全保函：立案后或已提交立案申请</li>
        </ul>
        <button class="flow-next" type="button" data-act="start-apply">开始申请</button>
      </section>`;
  }

  function page(state) {
    if (state.view === "flow-info") return infoPage(state);
    if (state.view === "flow-files") return filesPage(state);
    if (state.view === "flow-org") return orgPage();
    if (state.view === "flow-sign") return signPage();
    if (state.view === "flow-pay") return payPage(state);
    if (state.view === "flow-wait") return waitPage();
    return "";
  }

  function overlay(state) {
    return productSheet(state);
  }

  function filledPerson() {
    return { name: "周志森", id: "350102197810216437", addr: "福建省云霄县东厦镇荷中村西", phone: "18812539983" };
  }

  function act(state, name, target, ctx) {
    if (name === "product") {
      state.product = target.dataset.name || "财产保全保函";
      state.sheet = "product";
      ctx.render();
      return true;
    }
    if (name === "close-sheet") { state.sheet = ""; state.checking = false; ctx.render(); return true; }
    if (name === "start-apply") { state.sheet = ""; ctx.go("flow-info"); return true; }
    if (name === "flow-agree") {
      state.flowAgree = !state.flowAgree;
      const row = document.getElementById("flowAgree");
      if (row) row.classList.toggle("on", state.flowAgree);
      return true;
    }
    if (name === "flow-next-info") {
      if (!state.flowAgree) { ctx.toast("请先阅读并同意《用户协议》和《隐私政策》"); return true; }
      if (!state.applicant || !state.respondent) { ctx.toast("请添加申请人与被申请人"); return true; }
      ctx.go("flow-files");
      return true;
    }
    if (name === "open-applicant") { state.sheet = "applicant"; ctx.render(); return true; }
    if (name === "open-respondent") { state.sheet = "respondent"; ctx.render(); return true; }
    if (name === "kind") { state.personKind = target.dataset.kind; ctx.render(); return true; }
    if (name === "save-person") {
      const data = filledPerson();
      if (state.sheet === "respondent") state.respondent = { name: data.name, id: data.id };
      else state.applicant = data;
      state.sheet = "";
      ctx.render();
      return true;
    }
    if (name === "clear-phone") { ctx.toast("已清空手机号"); return true; }
    if (name === "flow-next-files") {
      if (!state.flowAgree) { ctx.toast("请先阅读并同意《用户协议》和《隐私政策》"); return true; }
      state.sheet = "tip";
      ctx.render();
      return true;
    }
    if (name === "toggle-req") {
      state.reqOpen = state.reqOpen === target.dataset.key ? "" : target.dataset.key;
      ctx.render();
      return true;
    }
    if (name === "open-upload") { state.sheet = "upload"; ctx.render(); return true; }
    if (name === "open-local" || name === "open-docs") { state.sheet = "local"; ctx.render(); return true; }
    if (name === "picked") {
      state.sheet = "";
      state.checking = true;
      ctx.render();
      setTimeout(function () {
        state.checking = false;
        state.fileWarn = true;
        state.reqOpen = "apply";
        ctx.render();
      }, 900);
      return true;
    }
    if (name === "copy-link") { ctx.toast("已复制 www.baohantong.net"); return true; }
    if (name === "sample") { ctx.toast("查看范例"); return true; }
    if (name === "keep-submit") { state.sheet = ""; ctx.go("flow-org"); return true; }
    if (name === "buy" || name === "signed") { ctx.go(name === "buy" ? "flow-sign" : "flow-pay"); return true; }
    if (name === "wx-pay") { state.payView = state.payView === "qr" ? "main" : "qr"; ctx.render(); return true; }
    if (name === "bank-pay") { state.payView = state.payView === "transfer" ? "main" : "transfer"; ctx.render(); return true; }
    if (name === "copy-bank") { ctx.toast("已复制收款信息"); return true; }
    if (name === "add-voucher") { state.payView = "voucher"; ctx.toast("已添加付款凭证"); return true; }
    if (name === "submit-pay") { ctx.go("flow-wait"); return true; }
    if (name === "refresh-material") { ctx.toast("材料已是最新"); return true; }
    if (name === "refund") { ctx.toast("已提交退款申请"); return true; }
    return false;
  }

  function back(state, go) {
    const prev = {
      "flow-info": "home",
      "flow-files": "flow-info",
      "flow-org": "flow-files",
      "flow-sign": "flow-org",
      "flow-pay": "flow-sign",
      "flow-wait": "home"
    };
    if (!prev[state.view]) return false;
    go(prev[state.view]);
    return true;
  }

  return { page: page, overlay: overlay, act: act, back: back };
})();
