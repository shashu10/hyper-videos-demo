/* =============================================================================
 * working-hard · animation primitives (extends first-reel)
 *
 * Mounted on window.__hf. Each helper takes a paused GSAP timeline + a target +
 * a time position + an options bag.
 *
 * Each helper does TWO things:
 *   1. `gsap.set(target, fromState)` immediately at script-load. This pins the
 *      element to its FROM state from frame 0 of the scene, regardless of
 *      where in the timeline the entrance tween sits.
 *   2. `tl.fromTo(target, fromState, toState, time)` to perform the entrance.
 *
 * Why both? Inside a `.clip` sub-composition, the GSAP timeline is paused and
 * only ticks when HF nests it into the master timeline. `tl.fromTo`'s default
 * `immediateRender: true` doesn't reliably write the FROM state during the
 * capture engine's non-linear seeks, so elements appear "fully visible until
 * the entrance fires" in rendered frames (preview is fine because it plays
 * linearly from t=0). The standalone `gsap.set` is the deterministic lock.
 *
 * For fast-paced multi-segment scenes, every segment (clip) inside the scene
 * needs its own entrance helper call. Segments are on the SAME track and
 * are sequential — HF handles visibility, we handle the entrance polish.
 * ===========================================================================*/

(function () {
  if (typeof window === "undefined") return;
  if (window.__hf && window.__hf.__initialized) return;

  var NS = (window.__hf = window.__hf || {});
  NS.__initialized = true;

  function defaults(opts, fallback) {
    opts = opts || {};
    for (var k in fallback) {
      if (opts[k] === undefined) opts[k] = fallback[k];
    }
    return opts;
  }

  /* ---- caption word-by-word utilities ---------------------------------- */

  function getDuration(el) {
    var curr = el;
    while (curr) {
      if (curr.getAttribute("data-duration")) {
        return parseFloat(curr.getAttribute("data-duration"));
      }
      curr = curr.parentElement;
    }
    return 2.0; // fallback duration in seconds
  }

  function splitTextElementIntoWords(element) {
    var textNodes = [];
    var walk = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
    var node;
    while (node = walk.nextNode()) {
      textNodes.push(node);
    }

    textNodes.forEach(function (textNode) {
      var text = textNode.nodeValue;
      if (!text) return;

      // Split text preserving exactly the whitespace
      var words = text.split(/(\s+)/);
      var fragment = document.createDocumentFragment();

      words.forEach(function (part) {
        if (/\s+/.test(part)) {
          // Normalize any whitespace/newline/tab into a single non-breaking space to prevent collapse
          fragment.appendChild(document.createTextNode("\u00A0"));
        } else if (part !== "") {
          var span = document.createElement("span");
          span.className = "cap-word";
          span.style.display = "inline-block";
          span.textContent = part;
          fragment.appendChild(span);
        }
      });

      textNode.parentNode.replaceChild(fragment, textNode);
    });
  }

  window.__caption_logs = window.__caption_logs || [];
  function logDebug() {
    var msg = Array.prototype.slice.call(arguments).join(" ");
    window.__caption_logs.push(msg);
    console.log(msg);
  }

  function setupWordByWordCaption(tl, targetSelector, startTime, options) {
    logDebug("[HyperFrames Captions] setupWordByWordCaption called for: " + targetSelector);
    var elements = document.querySelectorAll(targetSelector);
    logDebug("[HyperFrames Captions] Elements found: " + elements.length);
    if (!elements || elements.length === 0) return;

    elements.forEach(function (el) {
      // Find the caption container or text element
      var isCap = el.classList.contains("seg__caption") ||
                   el.classList.contains("seg__caption-text") ||
                   el.querySelector(".seg__caption-text") !== null;

      logDebug("[HyperFrames Captions] Processing element: classList=" + el.className + " isCap=" + isCap);
      if (!isCap) return;

      var textEl = el.classList.contains("seg__caption-text") 
        ? el 
        : el.querySelector(".seg__caption-text");
      
      if (!textEl) return;

      if (textEl.getAttribute("data-word-split") === "true") return;
      textEl.setAttribute("data-word-split", "true");

      // Split in-place preserving styles (e.g. <em> tags)
      splitTextElementIntoWords(textEl);

      var wordSpans = textEl.querySelectorAll(".cap-word");
      if (wordSpans.length === 0) return;

      var duration = getDuration(el);

      // Stagger word timing over the segment duration
      var startDelay = 0.25; 
      var endBuffer = 0.15; 
      
      var wordsStart = startTime + startDelay;
      var wordsEnd = startTime + duration - endBuffer;

      if (wordsEnd <= wordsStart) {
        wordsStart = startTime;
        wordsEnd = startTime + duration;
      }

      var totalHighlightTime = wordsEnd - wordsStart;
      var timePerWord = totalHighlightTime / wordSpans.length;

      // Lock the starting state (dimmed) at t=0 of the timeline
      gsap.set(wordSpans, {
        color: "rgba(245, 244, 240, 0.35)",
        scale: 1.0,
        textShadow: "none"
      });

      wordSpans.forEach(function (span, idx) {
        var wordStart = wordsStart + idx * timePerWord;
        var wordDur = timePerWord;

        // Active highlight: bright energetic yellow pop
        tl.to(span, {
          color: "#ffe600",
          scale: 1.18,
          textShadow: "0 0 16px rgba(255, 230, 0, 0.7)",
          duration: Math.min(0.12, wordDur * 0.4),
          ease: "power2.out"
        }, wordStart);

        // Spoken state: revert to soft clear white
        var nextWordStart = wordStart + wordDur;
        tl.to(span, {
          color: "rgba(245, 244, 240, 0.75)",
          scale: 1.0,
          textShadow: "none",
          duration: Math.min(0.12, wordDur * 0.4),
          ease: "power2.in"
        }, nextWordStart);
      });
    });
  }

  /* ---- atomic primitives ------------------------------------------------ */

  NS.fadeIn = function (tl, target, time, opts) {
    opts = defaults(opts, { duration: 0.6, ease: "power2.out" });
    gsap.set(target, { opacity: 0 });
    return tl.fromTo(
      target,
      { opacity: 0 },
      { opacity: 1, duration: opts.duration, ease: opts.ease },
      time,
    );
  };

  NS.fadeInUp = function (tl, target, time, opts) {
    opts = defaults(opts, { y: 40, duration: 0.8, ease: "power3.out" });
    gsap.set(target, { y: opts.y, opacity: 0 });
    var tween = tl.fromTo(
      target,
      { y: opts.y, opacity: 0 },
      { y: 0, opacity: 1, duration: opts.duration, ease: opts.ease },
      time,
    );
    setupWordByWordCaption(tl, target, time, opts);
    return tween;
  };

  NS.fadeInDown = function (tl, target, time, opts) {
    opts = defaults(opts, { y: -32, duration: 0.7, ease: "power3.out" });
    gsap.set(target, { y: opts.y, opacity: 0 });
    return tl.fromTo(
      target,
      { y: opts.y, opacity: 0 },
      { y: 0, opacity: 1, duration: opts.duration, ease: opts.ease },
      time,
    );
  };

  NS.fadeInLeft = function (tl, target, time, opts) {
    opts = defaults(opts, { x: -40, duration: 0.7, ease: "power3.out" });
    gsap.set(target, { x: opts.x, opacity: 0 });
    return tl.fromTo(
      target,
      { x: opts.x, opacity: 0 },
      { x: 0, opacity: 1, duration: opts.duration, ease: opts.ease },
      time,
    );
  };

  NS.fadeInRight = function (tl, target, time, opts) {
    opts = defaults(opts, { x: 40, duration: 0.7, ease: "power3.out" });
    gsap.set(target, { x: opts.x, opacity: 0 });
    return tl.fromTo(
      target,
      { x: opts.x, opacity: 0 },
      { x: 0, opacity: 1, duration: opts.duration, ease: opts.ease },
      time,
    );
  };

  /* ---- pop · scale + opacity (segments 8-12 "Promotion", "Title"...) --- */

  NS.popIn = function (tl, target, time, opts) {
    opts = defaults(opts, { fromScale: 0.72, duration: 0.45, ease: "power3.out" });
    gsap.set(target, { scale: opts.fromScale, opacity: 0, transformOrigin: "center center" });
    var tween = tl.fromTo(
      target,
      { scale: opts.fromScale, opacity: 0 },
      { scale: 1, opacity: 1, duration: opts.duration, ease: opts.ease },
      time,
    );
    setupWordByWordCaption(tl, target, time, opts);
    return tween;
  };

  /* ---- slam · text slams onto screen (segments 23-25 "Harder to stop") -- */

  NS.slamIn = function (tl, target, time, opts) {
    opts = defaults(opts, { fromScale: 1.6, duration: 0.32, ease: "power4.out" });
    gsap.set(target, { scale: opts.fromScale, opacity: 0, transformOrigin: "center center" });
    return tl.fromTo(
      target,
      { scale: opts.fromScale, opacity: 0 },
      { scale: 1, opacity: 1, duration: opts.duration, ease: opts.ease },
      time,
    );
  };

  /* ---- zoom · text rushes in from large (segments 17-20 "A higher title") */

  NS.zoomInBig = function (tl, target, time, opts) {
    opts = defaults(opts, { fromScale: 0.35, duration: 0.5, ease: "expo.out" });
    gsap.set(target, { scale: opts.fromScale, opacity: 0, transformOrigin: "center center" });
    return tl.fromTo(
      target,
      { scale: opts.fromScale, opacity: 0 },
      { scale: 1, opacity: 1, duration: opts.duration, ease: opts.ease },
      time,
    );
  };

  /* ---- scaleUp · zooms up to fill (segment 45 "Can you adapt quickly?") -- */

  NS.scaleUp = function (tl, target, time, opts) {
    opts = defaults(opts, { fromScale: 0.6, toScale: 1.12, duration: 0.6, ease: "expo.out" });
    gsap.set(target, { scale: opts.fromScale, opacity: 0, transformOrigin: "center center" });
    return tl.fromTo(
      target,
      { scale: opts.fromScale, opacity: 0 },
      { scale: opts.toScale, opacity: 1, duration: opts.duration, ease: opts.ease },
      time,
    );
  };

  /* ---- kinetic · directional slide-in for typography (segments 41-44) --- */

  NS.kineticIn = function (tl, target, time, opts) {
    opts = defaults(opts, {
      direction: "left",
      distance: 600,
      duration: 0.55,
      ease: "power4.out",
    });
    var dx = 0, dy = 0;
    switch (opts.direction) {
      case "left":   dx = -opts.distance; break;
      case "right":  dx =  opts.distance; break;
      case "top":    dy = -opts.distance; break;
      case "bottom": dy =  opts.distance; break;
    }
    gsap.set(target, { x: dx, y: dy, opacity: 0 });
    return tl.fromTo(
      target,
      { x: dx, y: dy, opacity: 0 },
      { x: 0, y: 0, opacity: 1, duration: opts.duration, ease: opts.ease },
      time,
    );
  };

  /* ---- marker sweep · highlight stroke draws across a span -------------- */
  /* Pairs with .seg__marker (CSS class with ::before pseudo) */

  NS.markerSweep = function (tl, target, time, opts) {
    opts = defaults(opts, { duration: 0.6, ease: "power2.out", delay: 0.1 });
    // Text fades in first, then the marker fill sweeps across.
    gsap.set(target, { opacity: 0 });
    tl.fromTo(
      target,
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: "power2.out" },
      time,
    );
    // The marker fill is the ::before pseudo. We animate a CSS variable on
    // the target to drive scaleX of the pseudo via attr() trick? Simpler:
    // we animate the target's `--marker-scale` and CSS uses it. To avoid
    // requiring CSS var support, we drive a child .marker-fill element.
    return tl;
  };

  /* ---- stagger list reveal (segments 7-12 stacking words, 47-49 ladder) - */

  NS.staggerInUp = function (tl, target, time, opts) {
    opts = defaults(opts, {
      y: 32,
      duration: 0.55,
      ease: "power3.out",
      stagger: 0.12,
    });
    gsap.set(target, { y: opts.y, opacity: 0 });
    return tl.fromTo(
      target,
      { y: opts.y, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: opts.duration,
        ease: opts.ease,
        stagger: opts.stagger,
      },
      time,
    );
  };

  /* ---- MediaMask reveal · scale + fade on the placeholder/video --------- */

  NS.maskReveal = function (tl, target, time, opts) {
    opts = defaults(opts, { fromScale: 0.92, duration: 0.7, ease: "expo.out" });
    gsap.set(target, {
      scale: opts.fromScale,
      opacity: 0,
      transformOrigin: opts.origin || "center center",
    });
    return tl.fromTo(
      target,
      { scale: opts.fromScale, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: opts.duration,
        ease: opts.ease,
        transformOrigin: opts.origin || "center center",
      },
      time,
    );
  };

  /* ---- rule / underline draw ------------------------------------------- */

  NS.ruleDraw = function (tl, target, time, opts) {
    opts = defaults(opts, { duration: 0.7, ease: "power3.out", origin: "left center" });
    gsap.set(target, { scaleX: 0, transformOrigin: opts.origin });
    return tl.fromTo(
      target,
      { scaleX: 0, transformOrigin: opts.origin },
      { scaleX: 1, duration: opts.duration, ease: opts.ease },
      time,
    );
  };

  /* ---- color flash · whole frame flashes a contrast color --------------- */
  /* Used by the "color flash to break the pattern" segments. The bg color is
   * set via CSS class (.seg--flash-clay); this helper just bursts opacity in. */

  NS.flashIn = function (tl, target, time, opts) {
    opts = defaults(opts, { duration: 0.18, ease: "power1.out" });
    gsap.set(target, { opacity: 0 });
    return tl.fromTo(
      target,
      { opacity: 0 },
      { opacity: 1, duration: opts.duration, ease: opts.ease },
      time,
    );
  };

  /* ---- glitch in · short shudder-style opacity stutter ------------------ */

  NS.glitchIn = function (tl, target, time, opts) {
    opts = defaults(opts, { duration: 0.35, ease: "steps(5)" });
    gsap.set(target, { opacity: 0, x: 0 });
    tl.fromTo(
      target,
      { opacity: 0 },
      { opacity: 1, duration: opts.duration, ease: opts.ease },
      time,
    );
    // tiny x shudder, deterministic offsets, no random
    tl.fromTo(
      target,
      { x: -6 },
      { x: 0, duration: 0.14, ease: "power1.inOut", yoyo: true, repeat: 2 },
      time,
    );
    return tl;
  };

  /* ---- scene-level helpers -------------------------------------------- */
  /* Reserved for the final scene's exit fade. Per HF rules, only the final
   * scene may animate opacity to 0. */

  NS.sceneIn = function (tl, target, opts) {
    opts = defaults(opts, { duration: 0.45, ease: "power2.inOut" });
    gsap.set(target, { opacity: 0 });
    return tl.fromTo(
      target,
      { opacity: 0 },
      { opacity: 1, duration: opts.duration, ease: opts.ease },
      0,
    );
  };

  NS.sceneOut = function (tl, target, time, opts) {
    opts = defaults(opts, { duration: 0.6, ease: "power2.inOut" });
    return tl.to(
      target,
      { opacity: 0, duration: opts.duration, ease: opts.ease },
      time,
    );
  };
})();
