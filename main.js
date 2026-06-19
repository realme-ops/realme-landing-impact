/* ===== 리얼미 랜딩 — 인터랙션 & 트래킹 ===== */
(function () {
  "use strict";

  var CFG = window.REALME_CONFIG || {};

  /* 통합 이벤트 전송: GTM(dataLayer) + GA4(gtag) + 메타픽셀(fbq) 동시 발사 */
  function trackEvent(name, params) {
    params = params || {};
    try { (window.dataLayer = window.dataLayer || []).push(Object.assign({ event: name }, params)); } catch (e) {}
    try { if (typeof window.gtag === "function") window.gtag("event", name, params); } catch (e) {}
    try {
      if (typeof window.fbq === "function") {
        // 표준 이벤트 매핑 (메타 전환 목표 = Lead)
        var map = { cta_click: "Lead", form_submit: "CompleteRegistration" };
        if (map[name]) window.fbq("track", map[name], params);
        else window.fbq("trackCustom", name, params);
      }
    } catch (e) {}
  }
  window.trackEvent = trackEvent;

  /* ---- 1) 스크롤 리빌 애니메이션 ---- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("is-visible");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---- 2) 고정 푸터 CTA 버튼: 메타 전환(Lead) + 폼으로 이동 ---- */
  var ctaBtn = document.getElementById("ctaBtn");
  if (ctaBtn) {
    ctaBtn.addEventListener("click", function () {
      trackEvent("cta_click", { location: "sticky_footer", label: "상담 신청하기" });
      // href="#apply" 앵커가 부드럽게 스크롤(스무스 스크롤 CSS 적용)
    });
  }

  /* ---- 3) 신청 폼: 검증 → 전환 이벤트 → (선택)전송 → 완료 메시지 ---- */
  var form = document.getElementById("applyForm");
  var msg = document.getElementById("formMsg");

  function showMsg(text, type) {
    if (!msg) return;
    msg.textContent = text;
    msg.className = "form-msg " + (type || "");
  }

  // 전화번호 자동 하이픈 (010-0000-0000)
  var phone = document.getElementById("f-phone");
  if (phone) {
    phone.addEventListener("input", function () {
      var v = phone.value.replace(/\D/g, "").slice(0, 11);
      if (v.length >= 8) v = v.replace(/(\d{3})(\d{4})(\d{1,4})/, "$1-$2-$3");
      else if (v.length >= 4) v = v.replace(/(\d{3})(\d{1,4})/, "$1-$2");
      phone.value = v;
    });
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = (document.getElementById("f-name").value || "").trim();
      var age = (document.getElementById("f-age").value || "").trim();
      var phoneVal = (document.getElementById("f-phone").value || "").trim();
      var consent = document.getElementById("f-consent").checked;
      var consent2 = document.getElementById("f-consent2").checked;
      var digits = phoneVal.replace(/\D/g, "");

      if (!name) { showMsg("이름을 입력해 주세요.", "error"); return; }
      if (!age) { showMsg("나이를 입력해 주세요.", "error"); return; }
      if (digits.length < 10 || digits.length > 11) { showMsg("전화번호를 정확히 입력해 주세요.", "error"); return; }
      if (!consent) { showMsg("개인정보 수집·이용에 동의해 주세요.", "error"); return; }
      if (!consent2) { showMsg("예약금·환불 정책에 동의해 주세요.", "error"); return; }

      // 전환 이벤트 발사 (메타 CompleteRegistration + GA4 + GTM)
      trackEvent("form_submit", { location: "apply_section" });

      var submitBtn = document.getElementById("applySubmit");
      var payload = { name: name, age: age, phone: phoneVal };

      // 전송 주소가 설정돼 있으면 실제 전송, 없으면 완료 메시지만 표시(초안)
      if (CFG.FORM_ENDPOINT) {
        if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "신청 중..."; }
        fetch(CFG.FORM_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }).then(function () {
          form.reset();
          showMsg("✅ 신청이 완료되었습니다! 입력하신 번호로 사전 설문지를 보내드릴게요.", "ok");
        }).catch(function () {
          showMsg("일시적인 오류가 발생했어요. 잠시 후 다시 시도해 주세요.", "error");
        }).finally(function () {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = "사전 설문지 신청하기"; }
        });
      } else {
        form.reset();
        showMsg("✅ 신청이 완료되었습니다! 입력하신 번호로 사전 설문지를 보내드릴게요.", "ok");
      }
    });
  }
})();
