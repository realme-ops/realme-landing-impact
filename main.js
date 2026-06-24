(function () {
  "use strict";
  var CFG = window.REALME_CONFIG || {};

  /* 통합 이벤트: GA4(gtag) + 메타픽셀(fbq). 폼 제출=Lead, 상단 버튼=커스텀 */
  function trackEvent(name, params) {
    params = params || {};
    try { (window.dataLayer = window.dataLayer || []).push(Object.assign({ event: name }, params)); } catch (e) {}
    try { if (typeof window.gtag === "function") window.gtag("event", name, params); } catch (e) {}
    try {
      if (typeof window.fbq === "function") {
        var map = { form_submit: "Lead" };
        if (map[name]) window.fbq("track", map[name], params);
        else window.fbq("trackCustom", name, params);
      }
    } catch (e) {}
  }
  window.trackEvent = trackEvent;

  /* 스크롤 리빌 */
  var reveal = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveal.forEach(function (el) { io.observe(el); });
  } else { reveal.forEach(function (el) { el.classList.add("is-visible"); }); }

  /* 마퀴 카드 16장 생성 후 2배 복제(무한 루프) — 익명 리뷰 한 줄 포함 */
  (function () {
    var track = document.getElementById("lookTrack");
    if (!track) return;
    var REVIEWS = [
      ["김*준", "어깨라인부터 달라지니까 옷이 사는 느낌이에요."],
      ["이*호", "처음으로 거울 보는 게 즐거워졌습니다."],
      ["박*우", "컬러 하나 바꿨을 뿐인데 인상이 확 변했어요."],
      ["정*민", "회사에서 무슨 일 있냐는 소리 들었습니다 ㅎㅎ"],
      ["최*석", "막연했던 스타일 고민이 한 번에 정리됐어요."],
      ["강*현", "핏 잡는 법 배우고 나서 옷값이 아깝지 않아요."],
      ["윤*탁", "소개팅 자리에서 자신감이 생기더라고요."],
      ["임*규", "헤어까지 같이 봐주셔서 완성도가 다릅니다."],
      ["한*결", "내 장점이 뭔지 처음 알게 됐어요."],
      ["오*진", "사진 찍을 때 더 이상 피하지 않게 됐습니다."],
      ["서*빈", "비포 애프터 보고 제가 더 놀랐어요."],
      ["남*철", "딱 필요한 것만 짚어주셔서 효율적이었어요."],
      ["조*영", "친구들이 스타일리스트 붙였냐고 묻습니다."],
      ["배*훈", "어색할까 걱정했는데 정말 편하게 진행됐어요."],
      ["문*기", "퍼스널컬러 진단 받고 쇼핑이 쉬워졌어요."],
      ["신*우", "한 번의 디렉팅으로 방향이 완전히 잡혔습니다."]
    ];
    function set() {
      var s = "";
      for (var i = 1; i <= 16; i++) {
        var rv = REVIEWS[i - 1];
        s += '<div class="look-card">' +
               '<div class="imgslot" data-label="look-' + i + '.jpg">' +
               '<img src="images/look-' + i + '.jpg" alt="스타일 ' + i + '" onerror="this.style.display=\'none\'"></div>' +
               '<div class="look-cap"><div class="lc-top"><span class="lc-name">' + rv[0] + '</span>' +
               '<span class="lc-stars">★★★★★</span></div><p>' + rv[1] + '</p></div>' +
             '</div>';
      }
      return s;
    }
    track.innerHTML = set() + set();
  })();

  /* 비포/애프터 슬라이더 */
  (function () {
    var track = document.getElementById("baTrack");
    if (!track) return;
    var n = track.children.length, cur = 0, timer = null;
    var dotsWrap = document.getElementById("baDots");
    for (var i = 0; i < n; i++) { var d = document.createElement("div"); d.className = "dot" + (i === 0 ? " active" : ""); d.dataset.i = i; dotsWrap.appendChild(d); }
    var dots = dotsWrap.children;
    function go(k) { cur = (k + n) % n; track.style.transform = "translateX(-" + (cur * 100) + "%)"; for (var i = 0; i < dots.length; i++) dots[i].classList.toggle("active", i === cur); }
    function next() { go(cur + 1); }
    function start() { stop(); timer = setInterval(next, 3500); }
    function stop() { if (timer) clearInterval(timer); }
    document.getElementById("baNext").onclick = function () { next(); start(); };
    document.getElementById("baPrev").onclick = function () { go(cur - 1); start(); };
    for (var j = 0; j < dots.length; j++) dots[j].onclick = function () { go(+this.dataset.i); start(); };
    var x0 = null;
    track.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; stop(); }, { passive: true });
    track.addEventListener("touchend", function (e) { if (x0 === null) return; var dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) { dx < 0 ? next() : go(cur - 1); } x0 = null; start(); }, { passive: true });
    start();
  })();

  /* 모든 CTA → 타입폼 이동 (랜딩 UTM 그대로 전달) + 전환(Lead) 발사 */
  (function () {
    var TYPEFORM = "https://artin1ife.typeform.com/to/nY7F5abi";
    var src = new URLSearchParams(location.search), parts = [];
    ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "fbclid", "gclid"].forEach(function (k) {
      var v = src.get(k); if (v) parts.push(encodeURIComponent(k) + "=" + encodeURIComponent(v));
    });
    var url = TYPEFORM + (parts.length ? "?" + parts.join("&") : "");
    document.querySelectorAll(".js-typeform").forEach(function (a) {
      a.setAttribute("href", url);
      a.addEventListener("click", function () {
        // 전환(Lead)은 타입폼 완료 시 발사. 랜딩에선 퍼널용 cta_click만.
        trackEvent("cta_click", { location: a.getAttribute("data-cta") || "cta", label: (a.textContent || "").trim() });
      });
    });
  })();
})();
