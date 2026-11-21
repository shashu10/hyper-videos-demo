/* frame-templates · animation presets from frame.md */

(function () {
  if (typeof window === "undefined") return;
  if (window.__hf && window.__hf.__initialized) return;

  var NS = (window.__hf = window.__hf || {});
  NS.__initialized = true;

  function opts(o, d) {
    o = o || {};
    for (var k in d) {
      if (o[k] === undefined) o[k] = d[k];
    }
    return o;
  }

  NS.gridDraw = function (tl, hTarget, vTarget, time, o) {
    o = opts(o, { duration: 0.9, ease: "power2.inOut", stagger: 0.14 });
    gsap.set(hTarget, { clipPath: "inset(0 100% 0 0)" });
    gsap.set(vTarget, { clipPath: "inset(0 0 100% 0)" });
    tl.fromTo(
      hTarget,
      { clipPath: "inset(0 100% 0 0)" },
      { clipPath: "inset(0 0 0 0)", duration: o.duration, ease: o.ease },
      time,
    );
    tl.fromTo(
      vTarget,
      { clipPath: "inset(0 0 100% 0)" },
      { clipPath: "inset(0 0 0 0)", duration: o.duration, ease: o.ease },
      time + o.stagger,
    );
  };

  NS.riseIn = function (tl, target, time, o) {
    o = opts(o, { y: 40, duration: 0.5, ease: "power3.out" });
    gsap.set(target, { opacity: 0, y: o.y });
    tl.fromTo(target, { opacity: 0, y: o.y }, { opacity: 1, y: 0, duration: o.duration, ease: o.ease }, time);
  };

  NS.maskWipe = function (tl, target, time, o) {
    o = opts(o, { duration: 0.6, ease: "power2.inOut" });
    gsap.set(target, { clipPath: "inset(0 100% 0 0)" });
    tl.fromTo(
      target,
      { clipPath: "inset(0 100% 0 0)" },
      { clipPath: "inset(0 0% 0 0)", duration: o.duration, ease: o.ease },
      time,
    );
  };

  NS.tileSnap = function (tl, target, time, o) {
    o = opts(o, { duration: 0.4, ease: "back.out(1.4)", stagger: 0.06 });
    var els = gsap.utils.toArray(target);
    els.forEach(function (el) {
      gsap.set(el, { opacity: 0, scale: 0.92 });
    });
    tl.fromTo(
      els,
      { opacity: 0, scale: 0.92 },
      { opacity: 1, scale: 1, duration: o.duration, ease: o.ease, stagger: o.stagger },
      time,
    );
  };

  NS.countUp = function (tl, target, time, end, o) {
    o = opts(o, { duration: 0.9, ease: "power2.out", prefix: "", suffix: "", decimals: 0 });
    var els = gsap.utils.toArray(target);
    var proxy = { v: 0 };
    gsap.set(els, { opacity: 1 });
    tl.fromTo(
      proxy,
      { v: 0 },
      {
        v: end,
        duration: o.duration,
        ease: o.ease,
        onUpdate: function () {
          var n = o.decimals ? proxy.v.toFixed(o.decimals) : Math.round(proxy.v);
          var text = o.prefix + n + o.suffix;
          els.forEach(function (el) {
            el.textContent = text;
          });
        },
      },
      time,
    );
  };

  NS.barGrow = function (tl, target, time, o) {
    o = opts(o, { duration: 0.7, ease: "power3.out", stagger: 0.08 });
    var els = gsap.utils.toArray(target);
    els.forEach(function (el) {
      gsap.set(el, { scaleX: 0 });
    });
    tl.fromTo(els, { scaleX: 0 }, { scaleX: 1, duration: o.duration, ease: o.ease, stagger: o.stagger }, time);
  };

  NS.kickerStamp = function (tl, target, time, o) {
    o = opts(o, { duration: 0.3, ease: "expo.out", y: 16 });
    gsap.set(target, { opacity: 0, y: o.y });
    tl.fromTo(target, { opacity: 0, y: o.y }, { opacity: 1, y: 0, duration: o.duration, ease: o.ease }, time);
  };

  NS.lockIn = function (tl, target, time, o) {
    o = opts(o, { duration: 0.35, ease: "back.out(2)" });
    gsap.set(target, { scale: 1.25, rotation: 2 });
    tl.fromTo(target, { scale: 1.25, rotation: 2 }, { scale: 1, rotation: 0, duration: o.duration, ease: o.ease }, time);
  };

  NS.stamp = function (tl, target, time, o) {
    o = opts(o, { duration: 0.3, ease: "expo.out" });
    gsap.set(target, { opacity: 0, scale: 1.6, rotation: -8 });
    tl.fromTo(
      target,
      { opacity: 0, scale: 1.6, rotation: -8 },
      { opacity: 1, scale: 1, rotation: -4, duration: o.duration, ease: o.ease },
      time,
    );
    tl.to(target, { x: "+=4", duration: 0.05, yoyo: true, repeat: 3 }, time + o.duration);
  };

  NS.mascotPeek = function (tl, target, time, o) {
    o = opts(o, { duration: 0.6, ease: "back.out(1.2)", x: 120 });
    gsap.set(target, { opacity: 1, x: o.x, rotation: 5 });
    tl.fromTo(target, { x: o.x, rotation: 5 }, { x: 0, rotation: 0, duration: o.duration, ease: o.ease }, time);
  };

  NS.mascotReact = function (tl, target, time) {
    tl.to(target, { rotation: 3, duration: 0.15, ease: "power2.out" }, time);
    tl.to(target, { rotation: 0, duration: 0.15, ease: "power2.in" }, time + 0.15);
  };

  NS.pulseGlow = function (tl, target, time, o) {
    o = opts(o, { duration: 0.6, repeats: 1 });
    tl.fromTo(
      target,
      { scale: 1 },
      { scale: 1.04, duration: o.duration * 0.5, ease: "power2.out", yoyo: true, repeat: o.repeats },
      time,
    );
  };

  NS.highlightSweep = function (tl, target, time, o) {
    o = opts(o, { duration: 0.4, ease: "power2.inOut", height: "100%" });
    var fromSize = "0% " + o.height;
    var toSize = "100% " + o.height;
    gsap.set(target, { backgroundSize: fromSize });
    tl.fromTo(target, { backgroundSize: fromSize }, { backgroundSize: toSize, duration: o.duration, ease: o.ease }, time);
  };
})();
