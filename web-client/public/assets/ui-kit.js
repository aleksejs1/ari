import { jsx as p, jsxs as ie, Fragment as ot } from "react/jsx-runtime";
import * as s from "react";
import { useState as Or } from "react";
import * as Dr from "react-dom";
import Ir from "react-dom";
import { X as Tr } from "lucide-react";
import { useFormContext as Mr, FormProvider as Fr, Controller as _r } from "react-hook-form";
function at(e, t) {
  if (typeof e == "function")
    return e(t);
  e != null && (e.current = t);
}
function Ne(...e) {
  return (t) => {
    let r = !1;
    const n = e.map((o) => {
      const a = at(o, t);
      return !r && typeof a == "function" && (r = !0), a;
    });
    if (r)
      return () => {
        for (let o = 0; o < n.length; o++) {
          const a = n[o];
          typeof a == "function" ? a() : at(e[o], null);
        }
      };
  };
}
function q(...e) {
  return s.useCallback(Ne(...e), e);
}
var Lr = /* @__PURE__ */ Symbol.for("react.lazy"), Ee = s[" use ".trim().toString()];
function zr(e) {
  return typeof e == "object" && e !== null && "then" in e;
}
function St(e) {
  return e != null && typeof e == "object" && "$$typeof" in e && e.$$typeof === Lr && "_payload" in e && zr(e._payload);
}
// @__NO_SIDE_EFFECTS__
function Nt(e) {
  const t = /* @__PURE__ */ Wr(e), r = s.forwardRef((n, o) => {
    let { children: a, ...l } = n;
    St(a) && typeof Ee == "function" && (a = Ee(a._payload));
    const i = s.Children.toArray(a), c = i.find(Vr);
    if (c) {
      const u = c.props.children, d = i.map((m) => m === c ? s.Children.count(u) > 1 ? s.Children.only(null) : s.isValidElement(u) ? u.props.children : null : m);
      return /* @__PURE__ */ p(t, { ...l, ref: o, children: s.isValidElement(u) ? s.cloneElement(u, void 0, d) : null });
    }
    return /* @__PURE__ */ p(t, { ...l, ref: o, children: a });
  });
  return r.displayName = `${e}.Slot`, r;
}
var Rt = /* @__PURE__ */ Nt("Slot");
// @__NO_SIDE_EFFECTS__
function Wr(e) {
  const t = s.forwardRef((r, n) => {
    let { children: o, ...a } = r;
    if (St(o) && typeof Ee == "function" && (o = Ee(o._payload)), s.isValidElement(o)) {
      const l = jr(o), i = Br(a, o.props);
      return o.type !== s.Fragment && (i.ref = n ? Ne(n, l) : l), s.cloneElement(o, i);
    }
    return s.Children.count(o) > 1 ? s.Children.only(null) : null;
  });
  return t.displayName = `${e}.SlotClone`, t;
}
var $r = /* @__PURE__ */ Symbol("radix.slottable");
function Vr(e) {
  return s.isValidElement(e) && typeof e.type == "function" && "__radixId" in e.type && e.type.__radixId === $r;
}
function Br(e, t) {
  const r = { ...t };
  for (const n in t) {
    const o = e[n], a = t[n];
    /^on[A-Z]/.test(n) ? o && a ? r[n] = (...i) => {
      const c = a(...i);
      return o(...i), c;
    } : o && (r[n] = o) : n === "style" ? r[n] = { ...o, ...a } : n === "className" && (r[n] = [o, a].filter(Boolean).join(" "));
  }
  return { ...e, ...r };
}
function jr(e) {
  let t = Object.getOwnPropertyDescriptor(e.props, "ref")?.get, r = t && "isReactWarning" in t && t.isReactWarning;
  return r ? e.ref : (t = Object.getOwnPropertyDescriptor(e, "ref")?.get, r = t && "isReactWarning" in t && t.isReactWarning, r ? e.props.ref : e.props.ref || e.ref);
}
function Pt(e) {
  var t, r, n = "";
  if (typeof e == "string" || typeof e == "number") n += e;
  else if (typeof e == "object") if (Array.isArray(e)) {
    var o = e.length;
    for (t = 0; t < o; t++) e[t] && (r = Pt(e[t])) && (n && (n += " "), n += r);
  } else for (r in e) e[r] && (n && (n += " "), n += r);
  return n;
}
function At() {
  for (var e, t, r = 0, n = "", o = arguments.length; r < o; r++) (e = arguments[r]) && (t = Pt(e)) && (n && (n += " "), n += t);
  return n;
}
const st = (e) => typeof e == "boolean" ? `${e}` : e === 0 ? "0" : e, it = At, Ke = (e, t) => (r) => {
  var n;
  if (t?.variants == null) return it(e, r?.class, r?.className);
  const { variants: o, defaultVariants: a } = t, l = Object.keys(o).map((u) => {
    const d = r?.[u], m = a?.[u];
    if (d === null) return null;
    const h = st(d) || st(m);
    return o[u][h];
  }), i = r && Object.entries(r).reduce((u, d) => {
    let [m, h] = d;
    return h === void 0 || (u[m] = h), u;
  }, {}), c = t == null || (n = t.compoundVariants) === null || n === void 0 ? void 0 : n.reduce((u, d) => {
    let { class: m, className: h, ...w } = d;
    return Object.entries(w).every((S) => {
      let [f, b] = S;
      return Array.isArray(b) ? b.includes({
        ...a,
        ...i
      }[f]) : {
        ...a,
        ...i
      }[f] === b;
    }) ? [
      ...u,
      m,
      h
    ] : u;
  }, []);
  return it(e, l, c, r?.class, r?.className);
}, Ur = (e, t) => {
  const r = new Array(e.length + t.length);
  for (let n = 0; n < e.length; n++)
    r[n] = e[n];
  for (let n = 0; n < t.length; n++)
    r[e.length + n] = t[n];
  return r;
}, Gr = (e, t) => ({
  classGroupId: e,
  validator: t
}), Ot = (e = /* @__PURE__ */ new Map(), t = null, r) => ({
  nextPart: e,
  validators: t,
  classGroupId: r
}), ke = "-", lt = [], Hr = "arbitrary..", Kr = (e) => {
  const t = Xr(e), {
    conflictingClassGroups: r,
    conflictingClassGroupModifiers: n
  } = e;
  return {
    getClassGroupId: (l) => {
      if (l.startsWith("[") && l.endsWith("]"))
        return Yr(l);
      const i = l.split(ke), c = i[0] === "" && i.length > 1 ? 1 : 0;
      return Dt(i, c, t);
    },
    getConflictingClassGroupIds: (l, i) => {
      if (i) {
        const c = n[l], u = r[l];
        return c ? u ? Ur(u, c) : c : u || lt;
      }
      return r[l] || lt;
    }
  };
}, Dt = (e, t, r) => {
  if (e.length - t === 0)
    return r.classGroupId;
  const o = e[t], a = r.nextPart.get(o);
  if (a) {
    const u = Dt(e, t + 1, a);
    if (u) return u;
  }
  const l = r.validators;
  if (l === null)
    return;
  const i = t === 0 ? e.join(ke) : e.slice(t).join(ke), c = l.length;
  for (let u = 0; u < c; u++) {
    const d = l[u];
    if (d.validator(i))
      return d.classGroupId;
  }
}, Yr = (e) => e.slice(1, -1).indexOf(":") === -1 ? void 0 : (() => {
  const t = e.slice(1, -1), r = t.indexOf(":"), n = t.slice(0, r);
  return n ? Hr + n : void 0;
})(), Xr = (e) => {
  const {
    theme: t,
    classGroups: r
  } = e;
  return Zr(r, t);
}, Zr = (e, t) => {
  const r = Ot();
  for (const n in e) {
    const o = e[n];
    Ye(o, r, n, t);
  }
  return r;
}, Ye = (e, t, r, n) => {
  const o = e.length;
  for (let a = 0; a < o; a++) {
    const l = e[a];
    qr(l, t, r, n);
  }
}, qr = (e, t, r, n) => {
  if (typeof e == "string") {
    Qr(e, t, r);
    return;
  }
  if (typeof e == "function") {
    Jr(e, t, r, n);
    return;
  }
  en(e, t, r, n);
}, Qr = (e, t, r) => {
  const n = e === "" ? t : It(t, e);
  n.classGroupId = r;
}, Jr = (e, t, r, n) => {
  if (tn(e)) {
    Ye(e(n), t, r, n);
    return;
  }
  t.validators === null && (t.validators = []), t.validators.push(Gr(r, e));
}, en = (e, t, r, n) => {
  const o = Object.entries(e), a = o.length;
  for (let l = 0; l < a; l++) {
    const [i, c] = o[l];
    Ye(c, It(t, i), r, n);
  }
}, It = (e, t) => {
  let r = e;
  const n = t.split(ke), o = n.length;
  for (let a = 0; a < o; a++) {
    const l = n[a];
    let i = r.nextPart.get(l);
    i || (i = Ot(), r.nextPart.set(l, i)), r = i;
  }
  return r;
}, tn = (e) => "isThemeGetter" in e && e.isThemeGetter === !0, rn = (e) => {
  if (e < 1)
    return {
      get: () => {
      },
      set: () => {
      }
    };
  let t = 0, r = /* @__PURE__ */ Object.create(null), n = /* @__PURE__ */ Object.create(null);
  const o = (a, l) => {
    r[a] = l, t++, t > e && (t = 0, n = r, r = /* @__PURE__ */ Object.create(null));
  };
  return {
    get(a) {
      let l = r[a];
      if (l !== void 0)
        return l;
      if ((l = n[a]) !== void 0)
        return o(a, l), l;
    },
    set(a, l) {
      a in r ? r[a] = l : o(a, l);
    }
  };
}, Ue = "!", ct = ":", nn = [], ut = (e, t, r, n, o) => ({
  modifiers: e,
  hasImportantModifier: t,
  baseClassName: r,
  maybePostfixModifierPosition: n,
  isExternal: o
}), on = (e) => {
  const {
    prefix: t,
    experimentalParseClassName: r
  } = e;
  let n = (o) => {
    const a = [];
    let l = 0, i = 0, c = 0, u;
    const d = o.length;
    for (let f = 0; f < d; f++) {
      const b = o[f];
      if (l === 0 && i === 0) {
        if (b === ct) {
          a.push(o.slice(c, f)), c = f + 1;
          continue;
        }
        if (b === "/") {
          u = f;
          continue;
        }
      }
      b === "[" ? l++ : b === "]" ? l-- : b === "(" ? i++ : b === ")" && i--;
    }
    const m = a.length === 0 ? o : o.slice(c);
    let h = m, w = !1;
    m.endsWith(Ue) ? (h = m.slice(0, -1), w = !0) : (
      /**
       * In Tailwind CSS v3 the important modifier was at the start of the base class name. This is still supported for legacy reasons.
       * @see https://github.com/dcastil/tailwind-merge/issues/513#issuecomment-2614029864
       */
      m.startsWith(Ue) && (h = m.slice(1), w = !0)
    );
    const S = u && u > c ? u - c : void 0;
    return ut(a, w, h, S);
  };
  if (t) {
    const o = t + ct, a = n;
    n = (l) => l.startsWith(o) ? a(l.slice(o.length)) : ut(nn, !1, l, void 0, !0);
  }
  if (r) {
    const o = n;
    n = (a) => r({
      className: a,
      parseClassName: o
    });
  }
  return n;
}, an = (e) => {
  const t = /* @__PURE__ */ new Map();
  return e.orderSensitiveModifiers.forEach((r, n) => {
    t.set(r, 1e6 + n);
  }), (r) => {
    const n = [];
    let o = [];
    for (let a = 0; a < r.length; a++) {
      const l = r[a], i = l[0] === "[", c = t.has(l);
      i || c ? (o.length > 0 && (o.sort(), n.push(...o), o = []), n.push(l)) : o.push(l);
    }
    return o.length > 0 && (o.sort(), n.push(...o)), n;
  };
}, sn = (e) => ({
  cache: rn(e.cacheSize),
  parseClassName: on(e),
  sortModifiers: an(e),
  ...Kr(e)
}), ln = /\s+/, cn = (e, t) => {
  const {
    parseClassName: r,
    getClassGroupId: n,
    getConflictingClassGroupIds: o,
    sortModifiers: a
  } = t, l = [], i = e.trim().split(ln);
  let c = "";
  for (let u = i.length - 1; u >= 0; u -= 1) {
    const d = i[u], {
      isExternal: m,
      modifiers: h,
      hasImportantModifier: w,
      baseClassName: S,
      maybePostfixModifierPosition: f
    } = r(d);
    if (m) {
      c = d + (c.length > 0 ? " " + c : c);
      continue;
    }
    let b = !!f, E = n(b ? S.substring(0, f) : S);
    if (!E) {
      if (!b) {
        c = d + (c.length > 0 ? " " + c : c);
        continue;
      }
      if (E = n(S), !E) {
        c = d + (c.length > 0 ? " " + c : c);
        continue;
      }
      b = !1;
    }
    const R = h.length === 0 ? "" : h.length === 1 ? h[0] : a(h).join(":"), P = w ? R + Ue : R, N = P + E;
    if (l.indexOf(N) > -1)
      continue;
    l.push(N);
    const A = o(E, b);
    for (let D = 0; D < A.length; ++D) {
      const k = A[D];
      l.push(P + k);
    }
    c = d + (c.length > 0 ? " " + c : c);
  }
  return c;
}, un = (...e) => {
  let t = 0, r, n, o = "";
  for (; t < e.length; )
    (r = e[t++]) && (n = Tt(r)) && (o && (o += " "), o += n);
  return o;
}, Tt = (e) => {
  if (typeof e == "string")
    return e;
  let t, r = "";
  for (let n = 0; n < e.length; n++)
    e[n] && (t = Tt(e[n])) && (r && (r += " "), r += t);
  return r;
}, dn = (e, ...t) => {
  let r, n, o, a;
  const l = (c) => {
    const u = t.reduce((d, m) => m(d), e());
    return r = sn(u), n = r.cache.get, o = r.cache.set, a = i, i(c);
  }, i = (c) => {
    const u = n(c);
    if (u)
      return u;
    const d = cn(c, r);
    return o(c, d), d;
  };
  return a = l, (...c) => a(un(...c));
}, fn = [], I = (e) => {
  const t = (r) => r[e] || fn;
  return t.isThemeGetter = !0, t;
}, Mt = /^\[(?:(\w[\w-]*):)?(.+)\]$/i, Ft = /^\((?:(\w[\w-]*):)?(.+)\)$/i, mn = /^\d+\/\d+$/, pn = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, gn = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, vn = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, hn = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, bn = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, J = (e) => mn.test(e), C = (e) => !!e && !Number.isNaN(Number(e)), j = (e) => !!e && Number.isInteger(Number(e)), Me = (e) => e.endsWith("%") && C(e.slice(0, -1)), $ = (e) => pn.test(e), yn = () => !0, wn = (e) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  gn.test(e) && !vn.test(e)
), _t = () => !1, xn = (e) => hn.test(e), Cn = (e) => bn.test(e), En = (e) => !g(e) && !v(e), kn = (e) => oe(e, Wt, _t), g = (e) => Mt.test(e), X = (e) => oe(e, $t, wn), Fe = (e) => oe(e, An, C), dt = (e) => oe(e, Lt, _t), Sn = (e) => oe(e, zt, Cn), pe = (e) => oe(e, Vt, xn), v = (e) => Ft.test(e), se = (e) => ae(e, $t), Nn = (e) => ae(e, On), ft = (e) => ae(e, Lt), Rn = (e) => ae(e, Wt), Pn = (e) => ae(e, zt), ge = (e) => ae(e, Vt, !0), oe = (e, t, r) => {
  const n = Mt.exec(e);
  return n ? n[1] ? t(n[1]) : r(n[2]) : !1;
}, ae = (e, t, r = !1) => {
  const n = Ft.exec(e);
  return n ? n[1] ? t(n[1]) : r : !1;
}, Lt = (e) => e === "position" || e === "percentage", zt = (e) => e === "image" || e === "url", Wt = (e) => e === "length" || e === "size" || e === "bg-size", $t = (e) => e === "length", An = (e) => e === "number", On = (e) => e === "family-name", Vt = (e) => e === "shadow", Dn = () => {
  const e = I("color"), t = I("font"), r = I("text"), n = I("font-weight"), o = I("tracking"), a = I("leading"), l = I("breakpoint"), i = I("container"), c = I("spacing"), u = I("radius"), d = I("shadow"), m = I("inset-shadow"), h = I("text-shadow"), w = I("drop-shadow"), S = I("blur"), f = I("perspective"), b = I("aspect"), E = I("ease"), R = I("animate"), P = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], N = () => [
    "center",
    "top",
    "bottom",
    "left",
    "right",
    "top-left",
    // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
    "left-top",
    "top-right",
    // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
    "right-top",
    "bottom-right",
    // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
    "right-bottom",
    "bottom-left",
    // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
    "left-bottom"
  ], A = () => [...N(), v, g], D = () => ["auto", "hidden", "clip", "visible", "scroll"], k = () => ["auto", "contain", "none"], y = () => [v, g, c], M = () => [J, "full", "auto", ...y()], B = () => [j, "none", "subgrid", v, g], H = () => ["auto", {
    span: ["full", j, v, g]
  }, j, v, g], K = () => [j, "auto", v, g], Qe = () => ["auto", "min", "max", "fr", v, g], De = () => ["start", "end", "center", "between", "around", "evenly", "stretch", "baseline", "center-safe", "end-safe"], Q = () => ["start", "end", "center", "stretch", "center-safe", "end-safe"], W = () => ["auto", ...y()], Y = () => [J, "auto", "full", "dvw", "dvh", "lvw", "lvh", "svw", "svh", "min", "max", "fit", ...y()], x = () => [e, v, g], Je = () => [...N(), ft, dt, {
    position: [v, g]
  }], et = () => ["no-repeat", {
    repeat: ["", "x", "y", "space", "round"]
  }], tt = () => ["auto", "cover", "contain", Rn, kn, {
    size: [v, g]
  }], Ie = () => [Me, se, X], F = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    "full",
    u,
    v,
    g
  ], _ = () => ["", C, se, X], ue = () => ["solid", "dashed", "dotted", "double"], rt = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], T = () => [C, Me, ft, dt], nt = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    S,
    v,
    g
  ], de = () => ["none", C, v, g], fe = () => ["none", C, v, g], Te = () => [C, v, g], me = () => [J, "full", ...y()];
  return {
    cacheSize: 500,
    theme: {
      animate: ["spin", "ping", "pulse", "bounce"],
      aspect: ["video"],
      blur: [$],
      breakpoint: [$],
      color: [yn],
      container: [$],
      "drop-shadow": [$],
      ease: ["in", "out", "in-out"],
      font: [En],
      "font-weight": ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black"],
      "inset-shadow": [$],
      leading: ["none", "tight", "snug", "normal", "relaxed", "loose"],
      perspective: ["dramatic", "near", "normal", "midrange", "distant", "none"],
      radius: [$],
      shadow: [$],
      spacing: ["px", C],
      text: [$],
      "text-shadow": [$],
      tracking: ["tighter", "tight", "normal", "wide", "wider", "widest"]
    },
    classGroups: {
      // --------------
      // --- Layout ---
      // --------------
      /**
       * Aspect Ratio
       * @see https://tailwindcss.com/docs/aspect-ratio
       */
      aspect: [{
        aspect: ["auto", "square", J, g, v, b]
      }],
      /**
       * Container
       * @see https://tailwindcss.com/docs/container
       * @deprecated since Tailwind CSS v4.0.0
       */
      container: ["container"],
      /**
       * Columns
       * @see https://tailwindcss.com/docs/columns
       */
      columns: [{
        columns: [C, g, v, i]
      }],
      /**
       * Break After
       * @see https://tailwindcss.com/docs/break-after
       */
      "break-after": [{
        "break-after": P()
      }],
      /**
       * Break Before
       * @see https://tailwindcss.com/docs/break-before
       */
      "break-before": [{
        "break-before": P()
      }],
      /**
       * Break Inside
       * @see https://tailwindcss.com/docs/break-inside
       */
      "break-inside": [{
        "break-inside": ["auto", "avoid", "avoid-page", "avoid-column"]
      }],
      /**
       * Box Decoration Break
       * @see https://tailwindcss.com/docs/box-decoration-break
       */
      "box-decoration": [{
        "box-decoration": ["slice", "clone"]
      }],
      /**
       * Box Sizing
       * @see https://tailwindcss.com/docs/box-sizing
       */
      box: [{
        box: ["border", "content"]
      }],
      /**
       * Display
       * @see https://tailwindcss.com/docs/display
       */
      display: ["block", "inline-block", "inline", "flex", "inline-flex", "table", "inline-table", "table-caption", "table-cell", "table-column", "table-column-group", "table-footer-group", "table-header-group", "table-row-group", "table-row", "flow-root", "grid", "inline-grid", "contents", "list-item", "hidden"],
      /**
       * Screen Reader Only
       * @see https://tailwindcss.com/docs/display#screen-reader-only
       */
      sr: ["sr-only", "not-sr-only"],
      /**
       * Floats
       * @see https://tailwindcss.com/docs/float
       */
      float: [{
        float: ["right", "left", "none", "start", "end"]
      }],
      /**
       * Clear
       * @see https://tailwindcss.com/docs/clear
       */
      clear: [{
        clear: ["left", "right", "both", "none", "start", "end"]
      }],
      /**
       * Isolation
       * @see https://tailwindcss.com/docs/isolation
       */
      isolation: ["isolate", "isolation-auto"],
      /**
       * Object Fit
       * @see https://tailwindcss.com/docs/object-fit
       */
      "object-fit": [{
        object: ["contain", "cover", "fill", "none", "scale-down"]
      }],
      /**
       * Object Position
       * @see https://tailwindcss.com/docs/object-position
       */
      "object-position": [{
        object: A()
      }],
      /**
       * Overflow
       * @see https://tailwindcss.com/docs/overflow
       */
      overflow: [{
        overflow: D()
      }],
      /**
       * Overflow X
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-x": [{
        "overflow-x": D()
      }],
      /**
       * Overflow Y
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-y": [{
        "overflow-y": D()
      }],
      /**
       * Overscroll Behavior
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      overscroll: [{
        overscroll: k()
      }],
      /**
       * Overscroll Behavior X
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-x": [{
        "overscroll-x": k()
      }],
      /**
       * Overscroll Behavior Y
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-y": [{
        "overscroll-y": k()
      }],
      /**
       * Position
       * @see https://tailwindcss.com/docs/position
       */
      position: ["static", "fixed", "absolute", "relative", "sticky"],
      /**
       * Top / Right / Bottom / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      inset: [{
        inset: M()
      }],
      /**
       * Right / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-x": [{
        "inset-x": M()
      }],
      /**
       * Top / Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-y": [{
        "inset-y": M()
      }],
      /**
       * Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      start: [{
        start: M()
      }],
      /**
       * End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      end: [{
        end: M()
      }],
      /**
       * Top
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      top: [{
        top: M()
      }],
      /**
       * Right
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      right: [{
        right: M()
      }],
      /**
       * Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      bottom: [{
        bottom: M()
      }],
      /**
       * Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      left: [{
        left: M()
      }],
      /**
       * Visibility
       * @see https://tailwindcss.com/docs/visibility
       */
      visibility: ["visible", "invisible", "collapse"],
      /**
       * Z-Index
       * @see https://tailwindcss.com/docs/z-index
       */
      z: [{
        z: [j, "auto", v, g]
      }],
      // ------------------------
      // --- Flexbox and Grid ---
      // ------------------------
      /**
       * Flex Basis
       * @see https://tailwindcss.com/docs/flex-basis
       */
      basis: [{
        basis: [J, "full", "auto", i, ...y()]
      }],
      /**
       * Flex Direction
       * @see https://tailwindcss.com/docs/flex-direction
       */
      "flex-direction": [{
        flex: ["row", "row-reverse", "col", "col-reverse"]
      }],
      /**
       * Flex Wrap
       * @see https://tailwindcss.com/docs/flex-wrap
       */
      "flex-wrap": [{
        flex: ["nowrap", "wrap", "wrap-reverse"]
      }],
      /**
       * Flex
       * @see https://tailwindcss.com/docs/flex
       */
      flex: [{
        flex: [C, J, "auto", "initial", "none", g]
      }],
      /**
       * Flex Grow
       * @see https://tailwindcss.com/docs/flex-grow
       */
      grow: [{
        grow: ["", C, v, g]
      }],
      /**
       * Flex Shrink
       * @see https://tailwindcss.com/docs/flex-shrink
       */
      shrink: [{
        shrink: ["", C, v, g]
      }],
      /**
       * Order
       * @see https://tailwindcss.com/docs/order
       */
      order: [{
        order: [j, "first", "last", "none", v, g]
      }],
      /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */
      "grid-cols": [{
        "grid-cols": B()
      }],
      /**
       * Grid Column Start / End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start-end": [{
        col: H()
      }],
      /**
       * Grid Column Start
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start": [{
        "col-start": K()
      }],
      /**
       * Grid Column End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-end": [{
        "col-end": K()
      }],
      /**
       * Grid Template Rows
       * @see https://tailwindcss.com/docs/grid-template-rows
       */
      "grid-rows": [{
        "grid-rows": B()
      }],
      /**
       * Grid Row Start / End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start-end": [{
        row: H()
      }],
      /**
       * Grid Row Start
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start": [{
        "row-start": K()
      }],
      /**
       * Grid Row End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-end": [{
        "row-end": K()
      }],
      /**
       * Grid Auto Flow
       * @see https://tailwindcss.com/docs/grid-auto-flow
       */
      "grid-flow": [{
        "grid-flow": ["row", "col", "dense", "row-dense", "col-dense"]
      }],
      /**
       * Grid Auto Columns
       * @see https://tailwindcss.com/docs/grid-auto-columns
       */
      "auto-cols": [{
        "auto-cols": Qe()
      }],
      /**
       * Grid Auto Rows
       * @see https://tailwindcss.com/docs/grid-auto-rows
       */
      "auto-rows": [{
        "auto-rows": Qe()
      }],
      /**
       * Gap
       * @see https://tailwindcss.com/docs/gap
       */
      gap: [{
        gap: y()
      }],
      /**
       * Gap X
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-x": [{
        "gap-x": y()
      }],
      /**
       * Gap Y
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-y": [{
        "gap-y": y()
      }],
      /**
       * Justify Content
       * @see https://tailwindcss.com/docs/justify-content
       */
      "justify-content": [{
        justify: [...De(), "normal"]
      }],
      /**
       * Justify Items
       * @see https://tailwindcss.com/docs/justify-items
       */
      "justify-items": [{
        "justify-items": [...Q(), "normal"]
      }],
      /**
       * Justify Self
       * @see https://tailwindcss.com/docs/justify-self
       */
      "justify-self": [{
        "justify-self": ["auto", ...Q()]
      }],
      /**
       * Align Content
       * @see https://tailwindcss.com/docs/align-content
       */
      "align-content": [{
        content: ["normal", ...De()]
      }],
      /**
       * Align Items
       * @see https://tailwindcss.com/docs/align-items
       */
      "align-items": [{
        items: [...Q(), {
          baseline: ["", "last"]
        }]
      }],
      /**
       * Align Self
       * @see https://tailwindcss.com/docs/align-self
       */
      "align-self": [{
        self: ["auto", ...Q(), {
          baseline: ["", "last"]
        }]
      }],
      /**
       * Place Content
       * @see https://tailwindcss.com/docs/place-content
       */
      "place-content": [{
        "place-content": De()
      }],
      /**
       * Place Items
       * @see https://tailwindcss.com/docs/place-items
       */
      "place-items": [{
        "place-items": [...Q(), "baseline"]
      }],
      /**
       * Place Self
       * @see https://tailwindcss.com/docs/place-self
       */
      "place-self": [{
        "place-self": ["auto", ...Q()]
      }],
      // Spacing
      /**
       * Padding
       * @see https://tailwindcss.com/docs/padding
       */
      p: [{
        p: y()
      }],
      /**
       * Padding X
       * @see https://tailwindcss.com/docs/padding
       */
      px: [{
        px: y()
      }],
      /**
       * Padding Y
       * @see https://tailwindcss.com/docs/padding
       */
      py: [{
        py: y()
      }],
      /**
       * Padding Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [{
        ps: y()
      }],
      /**
       * Padding End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [{
        pe: y()
      }],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [{
        pt: y()
      }],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [{
        pr: y()
      }],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [{
        pb: y()
      }],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [{
        pl: y()
      }],
      /**
       * Margin
       * @see https://tailwindcss.com/docs/margin
       */
      m: [{
        m: W()
      }],
      /**
       * Margin X
       * @see https://tailwindcss.com/docs/margin
       */
      mx: [{
        mx: W()
      }],
      /**
       * Margin Y
       * @see https://tailwindcss.com/docs/margin
       */
      my: [{
        my: W()
      }],
      /**
       * Margin Start
       * @see https://tailwindcss.com/docs/margin
       */
      ms: [{
        ms: W()
      }],
      /**
       * Margin End
       * @see https://tailwindcss.com/docs/margin
       */
      me: [{
        me: W()
      }],
      /**
       * Margin Top
       * @see https://tailwindcss.com/docs/margin
       */
      mt: [{
        mt: W()
      }],
      /**
       * Margin Right
       * @see https://tailwindcss.com/docs/margin
       */
      mr: [{
        mr: W()
      }],
      /**
       * Margin Bottom
       * @see https://tailwindcss.com/docs/margin
       */
      mb: [{
        mb: W()
      }],
      /**
       * Margin Left
       * @see https://tailwindcss.com/docs/margin
       */
      ml: [{
        ml: W()
      }],
      /**
       * Space Between X
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-x": [{
        "space-x": y()
      }],
      /**
       * Space Between X Reverse
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-x-reverse": ["space-x-reverse"],
      /**
       * Space Between Y
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-y": [{
        "space-y": y()
      }],
      /**
       * Space Between Y Reverse
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-y-reverse": ["space-y-reverse"],
      // --------------
      // --- Sizing ---
      // --------------
      /**
       * Size
       * @see https://tailwindcss.com/docs/width#setting-both-width-and-height
       */
      size: [{
        size: Y()
      }],
      /**
       * Width
       * @see https://tailwindcss.com/docs/width
       */
      w: [{
        w: [i, "screen", ...Y()]
      }],
      /**
       * Min-Width
       * @see https://tailwindcss.com/docs/min-width
       */
      "min-w": [{
        "min-w": [
          i,
          "screen",
          /** Deprecated. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          "none",
          ...Y()
        ]
      }],
      /**
       * Max-Width
       * @see https://tailwindcss.com/docs/max-width
       */
      "max-w": [{
        "max-w": [
          i,
          "screen",
          "none",
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          "prose",
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          {
            screen: [l]
          },
          ...Y()
        ]
      }],
      /**
       * Height
       * @see https://tailwindcss.com/docs/height
       */
      h: [{
        h: ["screen", "lh", ...Y()]
      }],
      /**
       * Min-Height
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-h": [{
        "min-h": ["screen", "lh", "none", ...Y()]
      }],
      /**
       * Max-Height
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-h": [{
        "max-h": ["screen", "lh", ...Y()]
      }],
      // ------------------
      // --- Typography ---
      // ------------------
      /**
       * Font Size
       * @see https://tailwindcss.com/docs/font-size
       */
      "font-size": [{
        text: ["base", r, se, X]
      }],
      /**
       * Font Smoothing
       * @see https://tailwindcss.com/docs/font-smoothing
       */
      "font-smoothing": ["antialiased", "subpixel-antialiased"],
      /**
       * Font Style
       * @see https://tailwindcss.com/docs/font-style
       */
      "font-style": ["italic", "not-italic"],
      /**
       * Font Weight
       * @see https://tailwindcss.com/docs/font-weight
       */
      "font-weight": [{
        font: [n, v, Fe]
      }],
      /**
       * Font Stretch
       * @see https://tailwindcss.com/docs/font-stretch
       */
      "font-stretch": [{
        "font-stretch": ["ultra-condensed", "extra-condensed", "condensed", "semi-condensed", "normal", "semi-expanded", "expanded", "extra-expanded", "ultra-expanded", Me, g]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      "font-family": [{
        font: [Nn, g, t]
      }],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-normal": ["normal-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-ordinal": ["ordinal"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-slashed-zero": ["slashed-zero"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-figure": ["lining-nums", "oldstyle-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-spacing": ["proportional-nums", "tabular-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-fraction": ["diagonal-fractions", "stacked-fractions"],
      /**
       * Letter Spacing
       * @see https://tailwindcss.com/docs/letter-spacing
       */
      tracking: [{
        tracking: [o, v, g]
      }],
      /**
       * Line Clamp
       * @see https://tailwindcss.com/docs/line-clamp
       */
      "line-clamp": [{
        "line-clamp": [C, "none", v, Fe]
      }],
      /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */
      leading: [{
        leading: [
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          a,
          ...y()
        ]
      }],
      /**
       * List Style Image
       * @see https://tailwindcss.com/docs/list-style-image
       */
      "list-image": [{
        "list-image": ["none", v, g]
      }],
      /**
       * List Style Position
       * @see https://tailwindcss.com/docs/list-style-position
       */
      "list-style-position": [{
        list: ["inside", "outside"]
      }],
      /**
       * List Style Type
       * @see https://tailwindcss.com/docs/list-style-type
       */
      "list-style-type": [{
        list: ["disc", "decimal", "none", v, g]
      }],
      /**
       * Text Alignment
       * @see https://tailwindcss.com/docs/text-align
       */
      "text-alignment": [{
        text: ["left", "center", "right", "justify", "start", "end"]
      }],
      /**
       * Placeholder Color
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://v3.tailwindcss.com/docs/placeholder-color
       */
      "placeholder-color": [{
        placeholder: x()
      }],
      /**
       * Text Color
       * @see https://tailwindcss.com/docs/text-color
       */
      "text-color": [{
        text: x()
      }],
      /**
       * Text Decoration
       * @see https://tailwindcss.com/docs/text-decoration
       */
      "text-decoration": ["underline", "overline", "line-through", "no-underline"],
      /**
       * Text Decoration Style
       * @see https://tailwindcss.com/docs/text-decoration-style
       */
      "text-decoration-style": [{
        decoration: [...ue(), "wavy"]
      }],
      /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */
      "text-decoration-thickness": [{
        decoration: [C, "from-font", "auto", v, X]
      }],
      /**
       * Text Decoration Color
       * @see https://tailwindcss.com/docs/text-decoration-color
       */
      "text-decoration-color": [{
        decoration: x()
      }],
      /**
       * Text Underline Offset
       * @see https://tailwindcss.com/docs/text-underline-offset
       */
      "underline-offset": [{
        "underline-offset": [C, "auto", v, g]
      }],
      /**
       * Text Transform
       * @see https://tailwindcss.com/docs/text-transform
       */
      "text-transform": ["uppercase", "lowercase", "capitalize", "normal-case"],
      /**
       * Text Overflow
       * @see https://tailwindcss.com/docs/text-overflow
       */
      "text-overflow": ["truncate", "text-ellipsis", "text-clip"],
      /**
       * Text Wrap
       * @see https://tailwindcss.com/docs/text-wrap
       */
      "text-wrap": [{
        text: ["wrap", "nowrap", "balance", "pretty"]
      }],
      /**
       * Text Indent
       * @see https://tailwindcss.com/docs/text-indent
       */
      indent: [{
        indent: y()
      }],
      /**
       * Vertical Alignment
       * @see https://tailwindcss.com/docs/vertical-align
       */
      "vertical-align": [{
        align: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super", v, g]
      }],
      /**
       * Whitespace
       * @see https://tailwindcss.com/docs/whitespace
       */
      whitespace: [{
        whitespace: ["normal", "nowrap", "pre", "pre-line", "pre-wrap", "break-spaces"]
      }],
      /**
       * Word Break
       * @see https://tailwindcss.com/docs/word-break
       */
      break: [{
        break: ["normal", "words", "all", "keep"]
      }],
      /**
       * Overflow Wrap
       * @see https://tailwindcss.com/docs/overflow-wrap
       */
      wrap: [{
        wrap: ["break-word", "anywhere", "normal"]
      }],
      /**
       * Hyphens
       * @see https://tailwindcss.com/docs/hyphens
       */
      hyphens: [{
        hyphens: ["none", "manual", "auto"]
      }],
      /**
       * Content
       * @see https://tailwindcss.com/docs/content
       */
      content: [{
        content: ["none", v, g]
      }],
      // -------------------
      // --- Backgrounds ---
      // -------------------
      /**
       * Background Attachment
       * @see https://tailwindcss.com/docs/background-attachment
       */
      "bg-attachment": [{
        bg: ["fixed", "local", "scroll"]
      }],
      /**
       * Background Clip
       * @see https://tailwindcss.com/docs/background-clip
       */
      "bg-clip": [{
        "bg-clip": ["border", "padding", "content", "text"]
      }],
      /**
       * Background Origin
       * @see https://tailwindcss.com/docs/background-origin
       */
      "bg-origin": [{
        "bg-origin": ["border", "padding", "content"]
      }],
      /**
       * Background Position
       * @see https://tailwindcss.com/docs/background-position
       */
      "bg-position": [{
        bg: Je()
      }],
      /**
       * Background Repeat
       * @see https://tailwindcss.com/docs/background-repeat
       */
      "bg-repeat": [{
        bg: et()
      }],
      /**
       * Background Size
       * @see https://tailwindcss.com/docs/background-size
       */
      "bg-size": [{
        bg: tt()
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      "bg-image": [{
        bg: ["none", {
          linear: [{
            to: ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
          }, j, v, g],
          radial: ["", v, g],
          conic: [j, v, g]
        }, Pn, Sn]
      }],
      /**
       * Background Color
       * @see https://tailwindcss.com/docs/background-color
       */
      "bg-color": [{
        bg: x()
      }],
      /**
       * Gradient Color Stops From Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from-pos": [{
        from: Ie()
      }],
      /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via-pos": [{
        via: Ie()
      }],
      /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to-pos": [{
        to: Ie()
      }],
      /**
       * Gradient Color Stops From
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from": [{
        from: x()
      }],
      /**
       * Gradient Color Stops Via
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via": [{
        via: x()
      }],
      /**
       * Gradient Color Stops To
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to": [{
        to: x()
      }],
      // ---------------
      // --- Borders ---
      // ---------------
      /**
       * Border Radius
       * @see https://tailwindcss.com/docs/border-radius
       */
      rounded: [{
        rounded: F()
      }],
      /**
       * Border Radius Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-s": [{
        "rounded-s": F()
      }],
      /**
       * Border Radius End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-e": [{
        "rounded-e": F()
      }],
      /**
       * Border Radius Top
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-t": [{
        "rounded-t": F()
      }],
      /**
       * Border Radius Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-r": [{
        "rounded-r": F()
      }],
      /**
       * Border Radius Bottom
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-b": [{
        "rounded-b": F()
      }],
      /**
       * Border Radius Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-l": [{
        "rounded-l": F()
      }],
      /**
       * Border Radius Start Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ss": [{
        "rounded-ss": F()
      }],
      /**
       * Border Radius Start End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-se": [{
        "rounded-se": F()
      }],
      /**
       * Border Radius End End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ee": [{
        "rounded-ee": F()
      }],
      /**
       * Border Radius End Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-es": [{
        "rounded-es": F()
      }],
      /**
       * Border Radius Top Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tl": [{
        "rounded-tl": F()
      }],
      /**
       * Border Radius Top Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tr": [{
        "rounded-tr": F()
      }],
      /**
       * Border Radius Bottom Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-br": [{
        "rounded-br": F()
      }],
      /**
       * Border Radius Bottom Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-bl": [{
        "rounded-bl": F()
      }],
      /**
       * Border Width
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w": [{
        border: _()
      }],
      /**
       * Border Width X
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-x": [{
        "border-x": _()
      }],
      /**
       * Border Width Y
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-y": [{
        "border-y": _()
      }],
      /**
       * Border Width Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-s": [{
        "border-s": _()
      }],
      /**
       * Border Width End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-e": [{
        "border-e": _()
      }],
      /**
       * Border Width Top
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-t": [{
        "border-t": _()
      }],
      /**
       * Border Width Right
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-r": [{
        "border-r": _()
      }],
      /**
       * Border Width Bottom
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-b": [{
        "border-b": _()
      }],
      /**
       * Border Width Left
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-l": [{
        "border-l": _()
      }],
      /**
       * Divide Width X
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-x": [{
        "divide-x": _()
      }],
      /**
       * Divide Width X Reverse
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-x-reverse": ["divide-x-reverse"],
      /**
       * Divide Width Y
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-y": [{
        "divide-y": _()
      }],
      /**
       * Divide Width Y Reverse
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-y-reverse": ["divide-y-reverse"],
      /**
       * Border Style
       * @see https://tailwindcss.com/docs/border-style
       */
      "border-style": [{
        border: [...ue(), "hidden", "none"]
      }],
      /**
       * Divide Style
       * @see https://tailwindcss.com/docs/border-style#setting-the-divider-style
       */
      "divide-style": [{
        divide: [...ue(), "hidden", "none"]
      }],
      /**
       * Border Color
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color": [{
        border: x()
      }],
      /**
       * Border Color X
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-x": [{
        "border-x": x()
      }],
      /**
       * Border Color Y
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-y": [{
        "border-y": x()
      }],
      /**
       * Border Color S
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-s": [{
        "border-s": x()
      }],
      /**
       * Border Color E
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-e": [{
        "border-e": x()
      }],
      /**
       * Border Color Top
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-t": [{
        "border-t": x()
      }],
      /**
       * Border Color Right
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-r": [{
        "border-r": x()
      }],
      /**
       * Border Color Bottom
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-b": [{
        "border-b": x()
      }],
      /**
       * Border Color Left
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-l": [{
        "border-l": x()
      }],
      /**
       * Divide Color
       * @see https://tailwindcss.com/docs/divide-color
       */
      "divide-color": [{
        divide: x()
      }],
      /**
       * Outline Style
       * @see https://tailwindcss.com/docs/outline-style
       */
      "outline-style": [{
        outline: [...ue(), "none", "hidden"]
      }],
      /**
       * Outline Offset
       * @see https://tailwindcss.com/docs/outline-offset
       */
      "outline-offset": [{
        "outline-offset": [C, v, g]
      }],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      "outline-w": [{
        outline: ["", C, se, X]
      }],
      /**
       * Outline Color
       * @see https://tailwindcss.com/docs/outline-color
       */
      "outline-color": [{
        outline: x()
      }],
      // ---------------
      // --- Effects ---
      // ---------------
      /**
       * Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow
       */
      shadow: [{
        shadow: [
          // Deprecated since Tailwind CSS v4.0.0
          "",
          "none",
          d,
          ge,
          pe
        ]
      }],
      /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-shadow-color
       */
      "shadow-color": [{
        shadow: x()
      }],
      /**
       * Inset Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-shadow
       */
      "inset-shadow": [{
        "inset-shadow": ["none", m, ge, pe]
      }],
      /**
       * Inset Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-shadow-color
       */
      "inset-shadow-color": [{
        "inset-shadow": x()
      }],
      /**
       * Ring Width
       * @see https://tailwindcss.com/docs/box-shadow#adding-a-ring
       */
      "ring-w": [{
        ring: _()
      }],
      /**
       * Ring Width Inset
       * @see https://v3.tailwindcss.com/docs/ring-width#inset-rings
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-w-inset": ["ring-inset"],
      /**
       * Ring Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-ring-color
       */
      "ring-color": [{
        ring: x()
      }],
      /**
       * Ring Offset Width
       * @see https://v3.tailwindcss.com/docs/ring-offset-width
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-offset-w": [{
        "ring-offset": [C, X]
      }],
      /**
       * Ring Offset Color
       * @see https://v3.tailwindcss.com/docs/ring-offset-color
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-offset-color": [{
        "ring-offset": x()
      }],
      /**
       * Inset Ring Width
       * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-ring
       */
      "inset-ring-w": [{
        "inset-ring": _()
      }],
      /**
       * Inset Ring Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-ring-color
       */
      "inset-ring-color": [{
        "inset-ring": x()
      }],
      /**
       * Text Shadow
       * @see https://tailwindcss.com/docs/text-shadow
       */
      "text-shadow": [{
        "text-shadow": ["none", h, ge, pe]
      }],
      /**
       * Text Shadow Color
       * @see https://tailwindcss.com/docs/text-shadow#setting-the-shadow-color
       */
      "text-shadow-color": [{
        "text-shadow": x()
      }],
      /**
       * Opacity
       * @see https://tailwindcss.com/docs/opacity
       */
      opacity: [{
        opacity: [C, v, g]
      }],
      /**
       * Mix Blend Mode
       * @see https://tailwindcss.com/docs/mix-blend-mode
       */
      "mix-blend": [{
        "mix-blend": [...rt(), "plus-darker", "plus-lighter"]
      }],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      "bg-blend": [{
        "bg-blend": rt()
      }],
      /**
       * Mask Clip
       * @see https://tailwindcss.com/docs/mask-clip
       */
      "mask-clip": [{
        "mask-clip": ["border", "padding", "content", "fill", "stroke", "view"]
      }, "mask-no-clip"],
      /**
       * Mask Composite
       * @see https://tailwindcss.com/docs/mask-composite
       */
      "mask-composite": [{
        mask: ["add", "subtract", "intersect", "exclude"]
      }],
      /**
       * Mask Image
       * @see https://tailwindcss.com/docs/mask-image
       */
      "mask-image-linear-pos": [{
        "mask-linear": [C]
      }],
      "mask-image-linear-from-pos": [{
        "mask-linear-from": T()
      }],
      "mask-image-linear-to-pos": [{
        "mask-linear-to": T()
      }],
      "mask-image-linear-from-color": [{
        "mask-linear-from": x()
      }],
      "mask-image-linear-to-color": [{
        "mask-linear-to": x()
      }],
      "mask-image-t-from-pos": [{
        "mask-t-from": T()
      }],
      "mask-image-t-to-pos": [{
        "mask-t-to": T()
      }],
      "mask-image-t-from-color": [{
        "mask-t-from": x()
      }],
      "mask-image-t-to-color": [{
        "mask-t-to": x()
      }],
      "mask-image-r-from-pos": [{
        "mask-r-from": T()
      }],
      "mask-image-r-to-pos": [{
        "mask-r-to": T()
      }],
      "mask-image-r-from-color": [{
        "mask-r-from": x()
      }],
      "mask-image-r-to-color": [{
        "mask-r-to": x()
      }],
      "mask-image-b-from-pos": [{
        "mask-b-from": T()
      }],
      "mask-image-b-to-pos": [{
        "mask-b-to": T()
      }],
      "mask-image-b-from-color": [{
        "mask-b-from": x()
      }],
      "mask-image-b-to-color": [{
        "mask-b-to": x()
      }],
      "mask-image-l-from-pos": [{
        "mask-l-from": T()
      }],
      "mask-image-l-to-pos": [{
        "mask-l-to": T()
      }],
      "mask-image-l-from-color": [{
        "mask-l-from": x()
      }],
      "mask-image-l-to-color": [{
        "mask-l-to": x()
      }],
      "mask-image-x-from-pos": [{
        "mask-x-from": T()
      }],
      "mask-image-x-to-pos": [{
        "mask-x-to": T()
      }],
      "mask-image-x-from-color": [{
        "mask-x-from": x()
      }],
      "mask-image-x-to-color": [{
        "mask-x-to": x()
      }],
      "mask-image-y-from-pos": [{
        "mask-y-from": T()
      }],
      "mask-image-y-to-pos": [{
        "mask-y-to": T()
      }],
      "mask-image-y-from-color": [{
        "mask-y-from": x()
      }],
      "mask-image-y-to-color": [{
        "mask-y-to": x()
      }],
      "mask-image-radial": [{
        "mask-radial": [v, g]
      }],
      "mask-image-radial-from-pos": [{
        "mask-radial-from": T()
      }],
      "mask-image-radial-to-pos": [{
        "mask-radial-to": T()
      }],
      "mask-image-radial-from-color": [{
        "mask-radial-from": x()
      }],
      "mask-image-radial-to-color": [{
        "mask-radial-to": x()
      }],
      "mask-image-radial-shape": [{
        "mask-radial": ["circle", "ellipse"]
      }],
      "mask-image-radial-size": [{
        "mask-radial": [{
          closest: ["side", "corner"],
          farthest: ["side", "corner"]
        }]
      }],
      "mask-image-radial-pos": [{
        "mask-radial-at": N()
      }],
      "mask-image-conic-pos": [{
        "mask-conic": [C]
      }],
      "mask-image-conic-from-pos": [{
        "mask-conic-from": T()
      }],
      "mask-image-conic-to-pos": [{
        "mask-conic-to": T()
      }],
      "mask-image-conic-from-color": [{
        "mask-conic-from": x()
      }],
      "mask-image-conic-to-color": [{
        "mask-conic-to": x()
      }],
      /**
       * Mask Mode
       * @see https://tailwindcss.com/docs/mask-mode
       */
      "mask-mode": [{
        mask: ["alpha", "luminance", "match"]
      }],
      /**
       * Mask Origin
       * @see https://tailwindcss.com/docs/mask-origin
       */
      "mask-origin": [{
        "mask-origin": ["border", "padding", "content", "fill", "stroke", "view"]
      }],
      /**
       * Mask Position
       * @see https://tailwindcss.com/docs/mask-position
       */
      "mask-position": [{
        mask: Je()
      }],
      /**
       * Mask Repeat
       * @see https://tailwindcss.com/docs/mask-repeat
       */
      "mask-repeat": [{
        mask: et()
      }],
      /**
       * Mask Size
       * @see https://tailwindcss.com/docs/mask-size
       */
      "mask-size": [{
        mask: tt()
      }],
      /**
       * Mask Type
       * @see https://tailwindcss.com/docs/mask-type
       */
      "mask-type": [{
        "mask-type": ["alpha", "luminance"]
      }],
      /**
       * Mask Image
       * @see https://tailwindcss.com/docs/mask-image
       */
      "mask-image": [{
        mask: ["none", v, g]
      }],
      // ---------------
      // --- Filters ---
      // ---------------
      /**
       * Filter
       * @see https://tailwindcss.com/docs/filter
       */
      filter: [{
        filter: [
          // Deprecated since Tailwind CSS v3.0.0
          "",
          "none",
          v,
          g
        ]
      }],
      /**
       * Blur
       * @see https://tailwindcss.com/docs/blur
       */
      blur: [{
        blur: nt()
      }],
      /**
       * Brightness
       * @see https://tailwindcss.com/docs/brightness
       */
      brightness: [{
        brightness: [C, v, g]
      }],
      /**
       * Contrast
       * @see https://tailwindcss.com/docs/contrast
       */
      contrast: [{
        contrast: [C, v, g]
      }],
      /**
       * Drop Shadow
       * @see https://tailwindcss.com/docs/drop-shadow
       */
      "drop-shadow": [{
        "drop-shadow": [
          // Deprecated since Tailwind CSS v4.0.0
          "",
          "none",
          w,
          ge,
          pe
        ]
      }],
      /**
       * Drop Shadow Color
       * @see https://tailwindcss.com/docs/filter-drop-shadow#setting-the-shadow-color
       */
      "drop-shadow-color": [{
        "drop-shadow": x()
      }],
      /**
       * Grayscale
       * @see https://tailwindcss.com/docs/grayscale
       */
      grayscale: [{
        grayscale: ["", C, v, g]
      }],
      /**
       * Hue Rotate
       * @see https://tailwindcss.com/docs/hue-rotate
       */
      "hue-rotate": [{
        "hue-rotate": [C, v, g]
      }],
      /**
       * Invert
       * @see https://tailwindcss.com/docs/invert
       */
      invert: [{
        invert: ["", C, v, g]
      }],
      /**
       * Saturate
       * @see https://tailwindcss.com/docs/saturate
       */
      saturate: [{
        saturate: [C, v, g]
      }],
      /**
       * Sepia
       * @see https://tailwindcss.com/docs/sepia
       */
      sepia: [{
        sepia: ["", C, v, g]
      }],
      /**
       * Backdrop Filter
       * @see https://tailwindcss.com/docs/backdrop-filter
       */
      "backdrop-filter": [{
        "backdrop-filter": [
          // Deprecated since Tailwind CSS v3.0.0
          "",
          "none",
          v,
          g
        ]
      }],
      /**
       * Backdrop Blur
       * @see https://tailwindcss.com/docs/backdrop-blur
       */
      "backdrop-blur": [{
        "backdrop-blur": nt()
      }],
      /**
       * Backdrop Brightness
       * @see https://tailwindcss.com/docs/backdrop-brightness
       */
      "backdrop-brightness": [{
        "backdrop-brightness": [C, v, g]
      }],
      /**
       * Backdrop Contrast
       * @see https://tailwindcss.com/docs/backdrop-contrast
       */
      "backdrop-contrast": [{
        "backdrop-contrast": [C, v, g]
      }],
      /**
       * Backdrop Grayscale
       * @see https://tailwindcss.com/docs/backdrop-grayscale
       */
      "backdrop-grayscale": [{
        "backdrop-grayscale": ["", C, v, g]
      }],
      /**
       * Backdrop Hue Rotate
       * @see https://tailwindcss.com/docs/backdrop-hue-rotate
       */
      "backdrop-hue-rotate": [{
        "backdrop-hue-rotate": [C, v, g]
      }],
      /**
       * Backdrop Invert
       * @see https://tailwindcss.com/docs/backdrop-invert
       */
      "backdrop-invert": [{
        "backdrop-invert": ["", C, v, g]
      }],
      /**
       * Backdrop Opacity
       * @see https://tailwindcss.com/docs/backdrop-opacity
       */
      "backdrop-opacity": [{
        "backdrop-opacity": [C, v, g]
      }],
      /**
       * Backdrop Saturate
       * @see https://tailwindcss.com/docs/backdrop-saturate
       */
      "backdrop-saturate": [{
        "backdrop-saturate": [C, v, g]
      }],
      /**
       * Backdrop Sepia
       * @see https://tailwindcss.com/docs/backdrop-sepia
       */
      "backdrop-sepia": [{
        "backdrop-sepia": ["", C, v, g]
      }],
      // --------------
      // --- Tables ---
      // --------------
      /**
       * Border Collapse
       * @see https://tailwindcss.com/docs/border-collapse
       */
      "border-collapse": [{
        border: ["collapse", "separate"]
      }],
      /**
       * Border Spacing
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing": [{
        "border-spacing": y()
      }],
      /**
       * Border Spacing X
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-x": [{
        "border-spacing-x": y()
      }],
      /**
       * Border Spacing Y
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-y": [{
        "border-spacing-y": y()
      }],
      /**
       * Table Layout
       * @see https://tailwindcss.com/docs/table-layout
       */
      "table-layout": [{
        table: ["auto", "fixed"]
      }],
      /**
       * Caption Side
       * @see https://tailwindcss.com/docs/caption-side
       */
      caption: [{
        caption: ["top", "bottom"]
      }],
      // ---------------------------------
      // --- Transitions and Animation ---
      // ---------------------------------
      /**
       * Transition Property
       * @see https://tailwindcss.com/docs/transition-property
       */
      transition: [{
        transition: ["", "all", "colors", "opacity", "shadow", "transform", "none", v, g]
      }],
      /**
       * Transition Behavior
       * @see https://tailwindcss.com/docs/transition-behavior
       */
      "transition-behavior": [{
        transition: ["normal", "discrete"]
      }],
      /**
       * Transition Duration
       * @see https://tailwindcss.com/docs/transition-duration
       */
      duration: [{
        duration: [C, "initial", v, g]
      }],
      /**
       * Transition Timing Function
       * @see https://tailwindcss.com/docs/transition-timing-function
       */
      ease: [{
        ease: ["linear", "initial", E, v, g]
      }],
      /**
       * Transition Delay
       * @see https://tailwindcss.com/docs/transition-delay
       */
      delay: [{
        delay: [C, v, g]
      }],
      /**
       * Animation
       * @see https://tailwindcss.com/docs/animation
       */
      animate: [{
        animate: ["none", R, v, g]
      }],
      // ------------------
      // --- Transforms ---
      // ------------------
      /**
       * Backface Visibility
       * @see https://tailwindcss.com/docs/backface-visibility
       */
      backface: [{
        backface: ["hidden", "visible"]
      }],
      /**
       * Perspective
       * @see https://tailwindcss.com/docs/perspective
       */
      perspective: [{
        perspective: [f, v, g]
      }],
      /**
       * Perspective Origin
       * @see https://tailwindcss.com/docs/perspective-origin
       */
      "perspective-origin": [{
        "perspective-origin": A()
      }],
      /**
       * Rotate
       * @see https://tailwindcss.com/docs/rotate
       */
      rotate: [{
        rotate: de()
      }],
      /**
       * Rotate X
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-x": [{
        "rotate-x": de()
      }],
      /**
       * Rotate Y
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-y": [{
        "rotate-y": de()
      }],
      /**
       * Rotate Z
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-z": [{
        "rotate-z": de()
      }],
      /**
       * Scale
       * @see https://tailwindcss.com/docs/scale
       */
      scale: [{
        scale: fe()
      }],
      /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-x": [{
        "scale-x": fe()
      }],
      /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-y": [{
        "scale-y": fe()
      }],
      /**
       * Scale Z
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-z": [{
        "scale-z": fe()
      }],
      /**
       * Scale 3D
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-3d": ["scale-3d"],
      /**
       * Skew
       * @see https://tailwindcss.com/docs/skew
       */
      skew: [{
        skew: Te()
      }],
      /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-x": [{
        "skew-x": Te()
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-y": [{
        "skew-y": Te()
      }],
      /**
       * Transform
       * @see https://tailwindcss.com/docs/transform
       */
      transform: [{
        transform: [v, g, "", "none", "gpu", "cpu"]
      }],
      /**
       * Transform Origin
       * @see https://tailwindcss.com/docs/transform-origin
       */
      "transform-origin": [{
        origin: A()
      }],
      /**
       * Transform Style
       * @see https://tailwindcss.com/docs/transform-style
       */
      "transform-style": [{
        transform: ["3d", "flat"]
      }],
      /**
       * Translate
       * @see https://tailwindcss.com/docs/translate
       */
      translate: [{
        translate: me()
      }],
      /**
       * Translate X
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-x": [{
        "translate-x": me()
      }],
      /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-y": [{
        "translate-y": me()
      }],
      /**
       * Translate Z
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-z": [{
        "translate-z": me()
      }],
      /**
       * Translate None
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-none": ["translate-none"],
      // ---------------------
      // --- Interactivity ---
      // ---------------------
      /**
       * Accent Color
       * @see https://tailwindcss.com/docs/accent-color
       */
      accent: [{
        accent: x()
      }],
      /**
       * Appearance
       * @see https://tailwindcss.com/docs/appearance
       */
      appearance: [{
        appearance: ["none", "auto"]
      }],
      /**
       * Caret Color
       * @see https://tailwindcss.com/docs/just-in-time-mode#caret-color-utilities
       */
      "caret-color": [{
        caret: x()
      }],
      /**
       * Color Scheme
       * @see https://tailwindcss.com/docs/color-scheme
       */
      "color-scheme": [{
        scheme: ["normal", "dark", "light", "light-dark", "only-dark", "only-light"]
      }],
      /**
       * Cursor
       * @see https://tailwindcss.com/docs/cursor
       */
      cursor: [{
        cursor: ["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", v, g]
      }],
      /**
       * Field Sizing
       * @see https://tailwindcss.com/docs/field-sizing
       */
      "field-sizing": [{
        "field-sizing": ["fixed", "content"]
      }],
      /**
       * Pointer Events
       * @see https://tailwindcss.com/docs/pointer-events
       */
      "pointer-events": [{
        "pointer-events": ["auto", "none"]
      }],
      /**
       * Resize
       * @see https://tailwindcss.com/docs/resize
       */
      resize: [{
        resize: ["none", "", "y", "x"]
      }],
      /**
       * Scroll Behavior
       * @see https://tailwindcss.com/docs/scroll-behavior
       */
      "scroll-behavior": [{
        scroll: ["auto", "smooth"]
      }],
      /**
       * Scroll Margin
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-m": [{
        "scroll-m": y()
      }],
      /**
       * Scroll Margin X
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mx": [{
        "scroll-mx": y()
      }],
      /**
       * Scroll Margin Y
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-my": [{
        "scroll-my": y()
      }],
      /**
       * Scroll Margin Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ms": [{
        "scroll-ms": y()
      }],
      /**
       * Scroll Margin End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-me": [{
        "scroll-me": y()
      }],
      /**
       * Scroll Margin Top
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mt": [{
        "scroll-mt": y()
      }],
      /**
       * Scroll Margin Right
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mr": [{
        "scroll-mr": y()
      }],
      /**
       * Scroll Margin Bottom
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mb": [{
        "scroll-mb": y()
      }],
      /**
       * Scroll Margin Left
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ml": [{
        "scroll-ml": y()
      }],
      /**
       * Scroll Padding
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-p": [{
        "scroll-p": y()
      }],
      /**
       * Scroll Padding X
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-px": [{
        "scroll-px": y()
      }],
      /**
       * Scroll Padding Y
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-py": [{
        "scroll-py": y()
      }],
      /**
       * Scroll Padding Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-ps": [{
        "scroll-ps": y()
      }],
      /**
       * Scroll Padding End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pe": [{
        "scroll-pe": y()
      }],
      /**
       * Scroll Padding Top
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pt": [{
        "scroll-pt": y()
      }],
      /**
       * Scroll Padding Right
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pr": [{
        "scroll-pr": y()
      }],
      /**
       * Scroll Padding Bottom
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pb": [{
        "scroll-pb": y()
      }],
      /**
       * Scroll Padding Left
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pl": [{
        "scroll-pl": y()
      }],
      /**
       * Scroll Snap Align
       * @see https://tailwindcss.com/docs/scroll-snap-align
       */
      "snap-align": [{
        snap: ["start", "end", "center", "align-none"]
      }],
      /**
       * Scroll Snap Stop
       * @see https://tailwindcss.com/docs/scroll-snap-stop
       */
      "snap-stop": [{
        snap: ["normal", "always"]
      }],
      /**
       * Scroll Snap Type
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      "snap-type": [{
        snap: ["none", "x", "y", "both"]
      }],
      /**
       * Scroll Snap Type Strictness
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      "snap-strictness": [{
        snap: ["mandatory", "proximity"]
      }],
      /**
       * Touch Action
       * @see https://tailwindcss.com/docs/touch-action
       */
      touch: [{
        touch: ["auto", "none", "manipulation"]
      }],
      /**
       * Touch Action X
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-x": [{
        "touch-pan": ["x", "left", "right"]
      }],
      /**
       * Touch Action Y
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-y": [{
        "touch-pan": ["y", "up", "down"]
      }],
      /**
       * Touch Action Pinch Zoom
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-pz": ["touch-pinch-zoom"],
      /**
       * User Select
       * @see https://tailwindcss.com/docs/user-select
       */
      select: [{
        select: ["none", "text", "all", "auto"]
      }],
      /**
       * Will Change
       * @see https://tailwindcss.com/docs/will-change
       */
      "will-change": [{
        "will-change": ["auto", "scroll", "contents", "transform", v, g]
      }],
      // -----------
      // --- SVG ---
      // -----------
      /**
       * Fill
       * @see https://tailwindcss.com/docs/fill
       */
      fill: [{
        fill: ["none", ...x()]
      }],
      /**
       * Stroke Width
       * @see https://tailwindcss.com/docs/stroke-width
       */
      "stroke-w": [{
        stroke: [C, se, X, Fe]
      }],
      /**
       * Stroke
       * @see https://tailwindcss.com/docs/stroke
       */
      stroke: [{
        stroke: ["none", ...x()]
      }],
      // ---------------------
      // --- Accessibility ---
      // ---------------------
      /**
       * Forced Color Adjust
       * @see https://tailwindcss.com/docs/forced-color-adjust
       */
      "forced-color-adjust": [{
        "forced-color-adjust": ["auto", "none"]
      }]
    },
    conflictingClassGroups: {
      overflow: ["overflow-x", "overflow-y"],
      overscroll: ["overscroll-x", "overscroll-y"],
      inset: ["inset-x", "inset-y", "start", "end", "top", "right", "bottom", "left"],
      "inset-x": ["right", "left"],
      "inset-y": ["top", "bottom"],
      flex: ["basis", "grow", "shrink"],
      gap: ["gap-x", "gap-y"],
      p: ["px", "py", "ps", "pe", "pt", "pr", "pb", "pl"],
      px: ["pr", "pl"],
      py: ["pt", "pb"],
      m: ["mx", "my", "ms", "me", "mt", "mr", "mb", "ml"],
      mx: ["mr", "ml"],
      my: ["mt", "mb"],
      size: ["w", "h"],
      "font-size": ["leading"],
      "fvn-normal": ["fvn-ordinal", "fvn-slashed-zero", "fvn-figure", "fvn-spacing", "fvn-fraction"],
      "fvn-ordinal": ["fvn-normal"],
      "fvn-slashed-zero": ["fvn-normal"],
      "fvn-figure": ["fvn-normal"],
      "fvn-spacing": ["fvn-normal"],
      "fvn-fraction": ["fvn-normal"],
      "line-clamp": ["display", "overflow"],
      rounded: ["rounded-s", "rounded-e", "rounded-t", "rounded-r", "rounded-b", "rounded-l", "rounded-ss", "rounded-se", "rounded-ee", "rounded-es", "rounded-tl", "rounded-tr", "rounded-br", "rounded-bl"],
      "rounded-s": ["rounded-ss", "rounded-es"],
      "rounded-e": ["rounded-se", "rounded-ee"],
      "rounded-t": ["rounded-tl", "rounded-tr"],
      "rounded-r": ["rounded-tr", "rounded-br"],
      "rounded-b": ["rounded-br", "rounded-bl"],
      "rounded-l": ["rounded-tl", "rounded-bl"],
      "border-spacing": ["border-spacing-x", "border-spacing-y"],
      "border-w": ["border-w-x", "border-w-y", "border-w-s", "border-w-e", "border-w-t", "border-w-r", "border-w-b", "border-w-l"],
      "border-w-x": ["border-w-r", "border-w-l"],
      "border-w-y": ["border-w-t", "border-w-b"],
      "border-color": ["border-color-x", "border-color-y", "border-color-s", "border-color-e", "border-color-t", "border-color-r", "border-color-b", "border-color-l"],
      "border-color-x": ["border-color-r", "border-color-l"],
      "border-color-y": ["border-color-t", "border-color-b"],
      translate: ["translate-x", "translate-y", "translate-none"],
      "translate-none": ["translate", "translate-x", "translate-y", "translate-z"],
      "scroll-m": ["scroll-mx", "scroll-my", "scroll-ms", "scroll-me", "scroll-mt", "scroll-mr", "scroll-mb", "scroll-ml"],
      "scroll-mx": ["scroll-mr", "scroll-ml"],
      "scroll-my": ["scroll-mt", "scroll-mb"],
      "scroll-p": ["scroll-px", "scroll-py", "scroll-ps", "scroll-pe", "scroll-pt", "scroll-pr", "scroll-pb", "scroll-pl"],
      "scroll-px": ["scroll-pr", "scroll-pl"],
      "scroll-py": ["scroll-pt", "scroll-pb"],
      touch: ["touch-x", "touch-y", "touch-pz"],
      "touch-x": ["touch"],
      "touch-y": ["touch"],
      "touch-pz": ["touch"]
    },
    conflictingClassGroupModifiers: {
      "font-size": ["leading"]
    },
    orderSensitiveModifiers: ["*", "**", "after", "backdrop", "before", "details-content", "file", "first-letter", "first-line", "marker", "placeholder", "selection"]
  };
}, In = /* @__PURE__ */ dn(Dn);
function O(...e) {
  return In(At(e));
}
const Tn = Ke(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
), Mn = s.forwardRef(
  ({ className: e, variant: t, size: r, asChild: n = !1, ...o }, a) => /* @__PURE__ */ p(n ? Rt : "button", { className: O(Tn({ variant: t, size: r, className: e })), ref: a, ...o })
);
Mn.displayName = "Button";
const Fn = s.forwardRef(
  ({ className: e, type: t, ...r }, n) => /* @__PURE__ */ p(
    "input",
    {
      type: t,
      className: O(
        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        e
      ),
      ref: n,
      ...r
    }
  )
);
Fn.displayName = "Input";
var _n = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "select",
  "span",
  "svg",
  "ul"
], Ln = _n.reduce((e, t) => {
  const r = /* @__PURE__ */ Nt(`Primitive.${t}`), n = s.forwardRef((o, a) => {
    const { asChild: l, ...i } = o, c = l ? r : t;
    return typeof window < "u" && (window[/* @__PURE__ */ Symbol.for("radix-ui")] = !0), /* @__PURE__ */ p(c, { ...i, ref: a });
  });
  return n.displayName = `Primitive.${t}`, { ...e, [t]: n };
}, {}), zn = "Label", Bt = s.forwardRef((e, t) => /* @__PURE__ */ p(
  Ln.label,
  {
    ...e,
    ref: t,
    onMouseDown: (r) => {
      r.target.closest("button, input, select, textarea") || (e.onMouseDown?.(r), !r.defaultPrevented && r.detail > 1 && r.preventDefault());
    }
  }
));
Bt.displayName = zn;
var jt = Bt;
const Wn = Ke(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
), Ut = s.forwardRef(({ className: e, ...t }, r) => /* @__PURE__ */ p(jt, { ref: r, className: O(Wn(), e), ...t }));
Ut.displayName = jt.displayName;
const $n = s.forwardRef(
  ({ className: e, ...t }, r) => /* @__PURE__ */ p(
    "textarea",
    {
      className: O(
        "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        e
      ),
      ref: r,
      ...t
    }
  )
);
$n.displayName = "Textarea";
function ts({ className: e, ...t }) {
  return /* @__PURE__ */ p("div", { className: O("animate-pulse rounded-md bg-muted", e), ...t });
}
const Vn = s.forwardRef(
  ({ className: e, ...t }, r) => /* @__PURE__ */ p(
    "div",
    {
      ref: r,
      className: O("rounded-xl border bg-card text-card-foreground shadow", e),
      ...t
    }
  )
);
Vn.displayName = "Card";
const Bn = s.forwardRef(
  ({ className: e, ...t }, r) => /* @__PURE__ */ p("div", { ref: r, className: O("flex flex-col space-y-1.5 p-6", e), ...t })
);
Bn.displayName = "CardHeader";
const jn = s.forwardRef(
  ({ className: e, ...t }, r) => /* @__PURE__ */ p(
    "div",
    {
      ref: r,
      className: O("font-semibold leading-none tracking-tight", e),
      ...t
    }
  )
);
jn.displayName = "CardTitle";
const Un = s.forwardRef(
  ({ className: e, ...t }, r) => /* @__PURE__ */ p("div", { ref: r, className: O("text-sm text-muted-foreground", e), ...t })
);
Un.displayName = "CardDescription";
const Gn = s.forwardRef(
  ({ className: e, ...t }, r) => /* @__PURE__ */ p("div", { ref: r, className: O("p-6 pt-0", e), ...t })
);
Gn.displayName = "CardContent";
const Hn = s.forwardRef(
  ({ className: e, ...t }, r) => /* @__PURE__ */ p("div", { ref: r, className: O("flex items-center p-6 pt-0", e), ...t })
);
Hn.displayName = "CardFooter";
function G(e, t, { checkForDefaultPrevented: r = !0 } = {}) {
  return function(o) {
    if (e?.(o), r === !1 || !o.defaultPrevented)
      return t?.(o);
  };
}
function Kn(e, t) {
  const r = s.createContext(t), n = (a) => {
    const { children: l, ...i } = a, c = s.useMemo(() => i, Object.values(i));
    return /* @__PURE__ */ p(r.Provider, { value: c, children: l });
  };
  n.displayName = e + "Provider";
  function o(a) {
    const l = s.useContext(r);
    if (l) return l;
    if (t !== void 0) return t;
    throw new Error(`\`${a}\` must be used within \`${e}\``);
  }
  return [n, o];
}
function Yn(e, t = []) {
  let r = [];
  function n(a, l) {
    const i = s.createContext(l), c = r.length;
    r = [...r, l];
    const u = (m) => {
      const { scope: h, children: w, ...S } = m, f = h?.[e]?.[c] || i, b = s.useMemo(() => S, Object.values(S));
      return /* @__PURE__ */ p(f.Provider, { value: b, children: w });
    };
    u.displayName = a + "Provider";
    function d(m, h) {
      const w = h?.[e]?.[c] || i, S = s.useContext(w);
      if (S) return S;
      if (l !== void 0) return l;
      throw new Error(`\`${m}\` must be used within \`${a}\``);
    }
    return [u, d];
  }
  const o = () => {
    const a = r.map((l) => s.createContext(l));
    return function(i) {
      const c = i?.[e] || a;
      return s.useMemo(
        () => ({ [`__scope${e}`]: { ...i, [e]: c } }),
        [i, c]
      );
    };
  };
  return o.scopeName = e, [n, Xn(o, ...t)];
}
function Xn(...e) {
  const t = e[0];
  if (e.length === 1) return t;
  const r = () => {
    const n = e.map((o) => ({
      useScope: o(),
      scopeName: o.scopeName
    }));
    return function(a) {
      const l = n.reduce((i, { useScope: c, scopeName: u }) => {
        const m = c(a)[`__scope${u}`];
        return { ...i, ...m };
      }, {});
      return s.useMemo(() => ({ [`__scope${t.scopeName}`]: l }), [l]);
    };
  };
  return r.scopeName = t.scopeName, r;
}
var le = globalThis?.document ? s.useLayoutEffect : () => {
}, Zn = s[" useId ".trim().toString()] || (() => {
}), qn = 0;
function _e(e) {
  const [t, r] = s.useState(Zn());
  return le(() => {
    r((n) => n ?? String(qn++));
  }, [e]), e || (t ? `radix-${t}` : "");
}
var Qn = s[" useInsertionEffect ".trim().toString()] || le;
function Jn({
  prop: e,
  defaultProp: t,
  onChange: r = () => {
  },
  caller: n
}) {
  const [o, a, l] = eo({
    defaultProp: t,
    onChange: r
  }), i = e !== void 0, c = i ? e : o;
  {
    const d = s.useRef(e !== void 0);
    s.useEffect(() => {
      const m = d.current;
      m !== i && console.warn(
        `${n} is changing from ${m ? "controlled" : "uncontrolled"} to ${i ? "controlled" : "uncontrolled"}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`
      ), d.current = i;
    }, [i, n]);
  }
  const u = s.useCallback(
    (d) => {
      if (i) {
        const m = to(d) ? d(e) : d;
        m !== e && l.current?.(m);
      } else
        a(d);
    },
    [i, e, a, l]
  );
  return [c, u];
}
function eo({
  defaultProp: e,
  onChange: t
}) {
  const [r, n] = s.useState(e), o = s.useRef(r), a = s.useRef(t);
  return Qn(() => {
    a.current = t;
  }, [t]), s.useEffect(() => {
    o.current !== r && (a.current?.(r), o.current = r);
  }, [r, o]), [r, n, a];
}
function to(e) {
  return typeof e == "function";
}
// @__NO_SIDE_EFFECTS__
function ro(e) {
  const t = /* @__PURE__ */ no(e), r = s.forwardRef((n, o) => {
    const { children: a, ...l } = n, i = s.Children.toArray(a), c = i.find(ao);
    if (c) {
      const u = c.props.children, d = i.map((m) => m === c ? s.Children.count(u) > 1 ? s.Children.only(null) : s.isValidElement(u) ? u.props.children : null : m);
      return /* @__PURE__ */ p(t, { ...l, ref: o, children: s.isValidElement(u) ? s.cloneElement(u, void 0, d) : null });
    }
    return /* @__PURE__ */ p(t, { ...l, ref: o, children: a });
  });
  return r.displayName = `${e}.Slot`, r;
}
// @__NO_SIDE_EFFECTS__
function no(e) {
  const t = s.forwardRef((r, n) => {
    const { children: o, ...a } = r;
    if (s.isValidElement(o)) {
      const l = io(o), i = so(a, o.props);
      return o.type !== s.Fragment && (i.ref = n ? Ne(n, l) : l), s.cloneElement(o, i);
    }
    return s.Children.count(o) > 1 ? s.Children.only(null) : null;
  });
  return t.displayName = `${e}.SlotClone`, t;
}
var oo = /* @__PURE__ */ Symbol("radix.slottable");
function ao(e) {
  return s.isValidElement(e) && typeof e.type == "function" && "__radixId" in e.type && e.type.__radixId === oo;
}
function so(e, t) {
  const r = { ...t };
  for (const n in t) {
    const o = e[n], a = t[n];
    /^on[A-Z]/.test(n) ? o && a ? r[n] = (...i) => {
      const c = a(...i);
      return o(...i), c;
    } : o && (r[n] = o) : n === "style" ? r[n] = { ...o, ...a } : n === "className" && (r[n] = [o, a].filter(Boolean).join(" "));
  }
  return { ...e, ...r };
}
function io(e) {
  let t = Object.getOwnPropertyDescriptor(e.props, "ref")?.get, r = t && "isReactWarning" in t && t.isReactWarning;
  return r ? e.ref : (t = Object.getOwnPropertyDescriptor(e, "ref")?.get, r = t && "isReactWarning" in t && t.isReactWarning, r ? e.props.ref : e.props.ref || e.ref);
}
var lo = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "select",
  "span",
  "svg",
  "ul"
], V = lo.reduce((e, t) => {
  const r = /* @__PURE__ */ ro(`Primitive.${t}`), n = s.forwardRef((o, a) => {
    const { asChild: l, ...i } = o, c = l ? r : t;
    return typeof window < "u" && (window[/* @__PURE__ */ Symbol.for("radix-ui")] = !0), /* @__PURE__ */ p(c, { ...i, ref: a });
  });
  return n.displayName = `Primitive.${t}`, { ...e, [t]: n };
}, {});
function co(e, t) {
  e && Dr.flushSync(() => e.dispatchEvent(t));
}
function ce(e) {
  const t = s.useRef(e);
  return s.useEffect(() => {
    t.current = e;
  }), s.useMemo(() => (...r) => t.current?.(...r), []);
}
function uo(e, t = globalThis?.document) {
  const r = ce(e);
  s.useEffect(() => {
    const n = (o) => {
      o.key === "Escape" && r(o);
    };
    return t.addEventListener("keydown", n, { capture: !0 }), () => t.removeEventListener("keydown", n, { capture: !0 });
  }, [r, t]);
}
var fo = "DismissableLayer", Ge = "dismissableLayer.update", mo = "dismissableLayer.pointerDownOutside", po = "dismissableLayer.focusOutside", mt, Gt = s.createContext({
  layers: /* @__PURE__ */ new Set(),
  layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
  branches: /* @__PURE__ */ new Set()
}), Ht = s.forwardRef(
  (e, t) => {
    const {
      disableOutsidePointerEvents: r = !1,
      onEscapeKeyDown: n,
      onPointerDownOutside: o,
      onFocusOutside: a,
      onInteractOutside: l,
      onDismiss: i,
      ...c
    } = e, u = s.useContext(Gt), [d, m] = s.useState(null), h = d?.ownerDocument ?? globalThis?.document, [, w] = s.useState({}), S = q(t, (k) => m(k)), f = Array.from(u.layers), [b] = [...u.layersWithOutsidePointerEventsDisabled].slice(-1), E = f.indexOf(b), R = d ? f.indexOf(d) : -1, P = u.layersWithOutsidePointerEventsDisabled.size > 0, N = R >= E, A = ho((k) => {
      const y = k.target, M = [...u.branches].some((B) => B.contains(y));
      !N || M || (o?.(k), l?.(k), k.defaultPrevented || i?.());
    }, h), D = bo((k) => {
      const y = k.target;
      [...u.branches].some((B) => B.contains(y)) || (a?.(k), l?.(k), k.defaultPrevented || i?.());
    }, h);
    return uo((k) => {
      R === u.layers.size - 1 && (n?.(k), !k.defaultPrevented && i && (k.preventDefault(), i()));
    }, h), s.useEffect(() => {
      if (d)
        return r && (u.layersWithOutsidePointerEventsDisabled.size === 0 && (mt = h.body.style.pointerEvents, h.body.style.pointerEvents = "none"), u.layersWithOutsidePointerEventsDisabled.add(d)), u.layers.add(d), pt(), () => {
          r && u.layersWithOutsidePointerEventsDisabled.size === 1 && (h.body.style.pointerEvents = mt);
        };
    }, [d, h, r, u]), s.useEffect(() => () => {
      d && (u.layers.delete(d), u.layersWithOutsidePointerEventsDisabled.delete(d), pt());
    }, [d, u]), s.useEffect(() => {
      const k = () => w({});
      return document.addEventListener(Ge, k), () => document.removeEventListener(Ge, k);
    }, []), /* @__PURE__ */ p(
      V.div,
      {
        ...c,
        ref: S,
        style: {
          pointerEvents: P ? N ? "auto" : "none" : void 0,
          ...e.style
        },
        onFocusCapture: G(e.onFocusCapture, D.onFocusCapture),
        onBlurCapture: G(e.onBlurCapture, D.onBlurCapture),
        onPointerDownCapture: G(
          e.onPointerDownCapture,
          A.onPointerDownCapture
        )
      }
    );
  }
);
Ht.displayName = fo;
var go = "DismissableLayerBranch", vo = s.forwardRef((e, t) => {
  const r = s.useContext(Gt), n = s.useRef(null), o = q(t, n);
  return s.useEffect(() => {
    const a = n.current;
    if (a)
      return r.branches.add(a), () => {
        r.branches.delete(a);
      };
  }, [r.branches]), /* @__PURE__ */ p(V.div, { ...e, ref: o });
});
vo.displayName = go;
function ho(e, t = globalThis?.document) {
  const r = ce(e), n = s.useRef(!1), o = s.useRef(() => {
  });
  return s.useEffect(() => {
    const a = (i) => {
      if (i.target && !n.current) {
        let c = function() {
          Kt(
            mo,
            r,
            u,
            { discrete: !0 }
          );
        };
        const u = { originalEvent: i };
        i.pointerType === "touch" ? (t.removeEventListener("click", o.current), o.current = c, t.addEventListener("click", o.current, { once: !0 })) : c();
      } else
        t.removeEventListener("click", o.current);
      n.current = !1;
    }, l = window.setTimeout(() => {
      t.addEventListener("pointerdown", a);
    }, 0);
    return () => {
      window.clearTimeout(l), t.removeEventListener("pointerdown", a), t.removeEventListener("click", o.current);
    };
  }, [t, r]), {
    // ensures we check React component tree (not just DOM tree)
    onPointerDownCapture: () => n.current = !0
  };
}
function bo(e, t = globalThis?.document) {
  const r = ce(e), n = s.useRef(!1);
  return s.useEffect(() => {
    const o = (a) => {
      a.target && !n.current && Kt(po, r, { originalEvent: a }, {
        discrete: !1
      });
    };
    return t.addEventListener("focusin", o), () => t.removeEventListener("focusin", o);
  }, [t, r]), {
    onFocusCapture: () => n.current = !0,
    onBlurCapture: () => n.current = !1
  };
}
function pt() {
  const e = new CustomEvent(Ge);
  document.dispatchEvent(e);
}
function Kt(e, t, r, { discrete: n }) {
  const o = r.originalEvent.target, a = new CustomEvent(e, { bubbles: !1, cancelable: !0, detail: r });
  t && o.addEventListener(e, t, { once: !0 }), n ? co(o, a) : o.dispatchEvent(a);
}
var Le = "focusScope.autoFocusOnMount", ze = "focusScope.autoFocusOnUnmount", gt = { bubbles: !1, cancelable: !0 }, yo = "FocusScope", Yt = s.forwardRef((e, t) => {
  const {
    loop: r = !1,
    trapped: n = !1,
    onMountAutoFocus: o,
    onUnmountAutoFocus: a,
    ...l
  } = e, [i, c] = s.useState(null), u = ce(o), d = ce(a), m = s.useRef(null), h = q(t, (f) => c(f)), w = s.useRef({
    paused: !1,
    pause() {
      this.paused = !0;
    },
    resume() {
      this.paused = !1;
    }
  }).current;
  s.useEffect(() => {
    if (n) {
      let f = function(P) {
        if (w.paused || !i) return;
        const N = P.target;
        i.contains(N) ? m.current = N : U(m.current, { select: !0 });
      }, b = function(P) {
        if (w.paused || !i) return;
        const N = P.relatedTarget;
        N !== null && (i.contains(N) || U(m.current, { select: !0 }));
      }, E = function(P) {
        if (document.activeElement === document.body)
          for (const A of P)
            A.removedNodes.length > 0 && U(i);
      };
      document.addEventListener("focusin", f), document.addEventListener("focusout", b);
      const R = new MutationObserver(E);
      return i && R.observe(i, { childList: !0, subtree: !0 }), () => {
        document.removeEventListener("focusin", f), document.removeEventListener("focusout", b), R.disconnect();
      };
    }
  }, [n, i, w.paused]), s.useEffect(() => {
    if (i) {
      ht.add(w);
      const f = document.activeElement;
      if (!i.contains(f)) {
        const E = new CustomEvent(Le, gt);
        i.addEventListener(Le, u), i.dispatchEvent(E), E.defaultPrevented || (wo(So(Xt(i)), { select: !0 }), document.activeElement === f && U(i));
      }
      return () => {
        i.removeEventListener(Le, u), setTimeout(() => {
          const E = new CustomEvent(ze, gt);
          i.addEventListener(ze, d), i.dispatchEvent(E), E.defaultPrevented || U(f ?? document.body, { select: !0 }), i.removeEventListener(ze, d), ht.remove(w);
        }, 0);
      };
    }
  }, [i, u, d, w]);
  const S = s.useCallback(
    (f) => {
      if (!r && !n || w.paused) return;
      const b = f.key === "Tab" && !f.altKey && !f.ctrlKey && !f.metaKey, E = document.activeElement;
      if (b && E) {
        const R = f.currentTarget, [P, N] = xo(R);
        P && N ? !f.shiftKey && E === N ? (f.preventDefault(), r && U(P, { select: !0 })) : f.shiftKey && E === P && (f.preventDefault(), r && U(N, { select: !0 })) : E === R && f.preventDefault();
      }
    },
    [r, n, w.paused]
  );
  return /* @__PURE__ */ p(V.div, { tabIndex: -1, ...l, ref: h, onKeyDown: S });
});
Yt.displayName = yo;
function wo(e, { select: t = !1 } = {}) {
  const r = document.activeElement;
  for (const n of e)
    if (U(n, { select: t }), document.activeElement !== r) return;
}
function xo(e) {
  const t = Xt(e), r = vt(t, e), n = vt(t.reverse(), e);
  return [r, n];
}
function Xt(e) {
  const t = [], r = document.createTreeWalker(e, NodeFilter.SHOW_ELEMENT, {
    acceptNode: (n) => {
      const o = n.tagName === "INPUT" && n.type === "hidden";
      return n.disabled || n.hidden || o ? NodeFilter.FILTER_SKIP : n.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    }
  });
  for (; r.nextNode(); ) t.push(r.currentNode);
  return t;
}
function vt(e, t) {
  for (const r of e)
    if (!Co(r, { upTo: t })) return r;
}
function Co(e, { upTo: t }) {
  if (getComputedStyle(e).visibility === "hidden") return !0;
  for (; e; ) {
    if (t !== void 0 && e === t) return !1;
    if (getComputedStyle(e).display === "none") return !0;
    e = e.parentElement;
  }
  return !1;
}
function Eo(e) {
  return e instanceof HTMLInputElement && "select" in e;
}
function U(e, { select: t = !1 } = {}) {
  if (e && e.focus) {
    const r = document.activeElement;
    e.focus({ preventScroll: !0 }), e !== r && Eo(e) && t && e.select();
  }
}
var ht = ko();
function ko() {
  let e = [];
  return {
    add(t) {
      const r = e[0];
      t !== r && r?.pause(), e = bt(e, t), e.unshift(t);
    },
    remove(t) {
      e = bt(e, t), e[0]?.resume();
    }
  };
}
function bt(e, t) {
  const r = [...e], n = r.indexOf(t);
  return n !== -1 && r.splice(n, 1), r;
}
function So(e) {
  return e.filter((t) => t.tagName !== "A");
}
var No = "Portal", Zt = s.forwardRef((e, t) => {
  const { container: r, ...n } = e, [o, a] = s.useState(!1);
  le(() => a(!0), []);
  const l = r || o && globalThis?.document?.body;
  return l ? Ir.createPortal(/* @__PURE__ */ p(V.div, { ...n, ref: t }), l) : null;
});
Zt.displayName = No;
function Ro(e, t) {
  return s.useReducer((r, n) => t[r][n] ?? r, e);
}
var Re = (e) => {
  const { present: t, children: r } = e, n = Po(t), o = typeof r == "function" ? r({ present: n.isPresent }) : s.Children.only(r), a = q(n.ref, Ao(o));
  return typeof r == "function" || n.isPresent ? s.cloneElement(o, { ref: a }) : null;
};
Re.displayName = "Presence";
function Po(e) {
  const [t, r] = s.useState(), n = s.useRef(null), o = s.useRef(e), a = s.useRef("none"), l = e ? "mounted" : "unmounted", [i, c] = Ro(l, {
    mounted: {
      UNMOUNT: "unmounted",
      ANIMATION_OUT: "unmountSuspended"
    },
    unmountSuspended: {
      MOUNT: "mounted",
      ANIMATION_END: "unmounted"
    },
    unmounted: {
      MOUNT: "mounted"
    }
  });
  return s.useEffect(() => {
    const u = ve(n.current);
    a.current = i === "mounted" ? u : "none";
  }, [i]), le(() => {
    const u = n.current, d = o.current;
    if (d !== e) {
      const h = a.current, w = ve(u);
      e ? c("MOUNT") : w === "none" || u?.display === "none" ? c("UNMOUNT") : c(d && h !== w ? "ANIMATION_OUT" : "UNMOUNT"), o.current = e;
    }
  }, [e, c]), le(() => {
    if (t) {
      let u;
      const d = t.ownerDocument.defaultView ?? window, m = (w) => {
        const f = ve(n.current).includes(CSS.escape(w.animationName));
        if (w.target === t && f && (c("ANIMATION_END"), !o.current)) {
          const b = t.style.animationFillMode;
          t.style.animationFillMode = "forwards", u = d.setTimeout(() => {
            t.style.animationFillMode === "forwards" && (t.style.animationFillMode = b);
          });
        }
      }, h = (w) => {
        w.target === t && (a.current = ve(n.current));
      };
      return t.addEventListener("animationstart", h), t.addEventListener("animationcancel", m), t.addEventListener("animationend", m), () => {
        d.clearTimeout(u), t.removeEventListener("animationstart", h), t.removeEventListener("animationcancel", m), t.removeEventListener("animationend", m);
      };
    } else
      c("ANIMATION_END");
  }, [t, c]), {
    isPresent: ["mounted", "unmountSuspended"].includes(i),
    ref: s.useCallback((u) => {
      n.current = u ? getComputedStyle(u) : null, r(u);
    }, [])
  };
}
function ve(e) {
  return e?.animationName || "none";
}
function Ao(e) {
  let t = Object.getOwnPropertyDescriptor(e.props, "ref")?.get, r = t && "isReactWarning" in t && t.isReactWarning;
  return r ? e.ref : (t = Object.getOwnPropertyDescriptor(e, "ref")?.get, r = t && "isReactWarning" in t && t.isReactWarning, r ? e.props.ref : e.props.ref || e.ref);
}
var We = 0;
function Oo() {
  s.useEffect(() => {
    const e = document.querySelectorAll("[data-radix-focus-guard]");
    return document.body.insertAdjacentElement("afterbegin", e[0] ?? yt()), document.body.insertAdjacentElement("beforeend", e[1] ?? yt()), We++, () => {
      We === 1 && document.querySelectorAll("[data-radix-focus-guard]").forEach((t) => t.remove()), We--;
    };
  }, []);
}
function yt() {
  const e = document.createElement("span");
  return e.setAttribute("data-radix-focus-guard", ""), e.tabIndex = 0, e.style.outline = "none", e.style.opacity = "0", e.style.position = "fixed", e.style.pointerEvents = "none", e;
}
var z = function() {
  return z = Object.assign || function(t) {
    for (var r, n = 1, o = arguments.length; n < o; n++) {
      r = arguments[n];
      for (var a in r) Object.prototype.hasOwnProperty.call(r, a) && (t[a] = r[a]);
    }
    return t;
  }, z.apply(this, arguments);
};
function qt(e, t) {
  var r = {};
  for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && t.indexOf(n) < 0 && (r[n] = e[n]);
  if (e != null && typeof Object.getOwnPropertySymbols == "function")
    for (var o = 0, n = Object.getOwnPropertySymbols(e); o < n.length; o++)
      t.indexOf(n[o]) < 0 && Object.prototype.propertyIsEnumerable.call(e, n[o]) && (r[n[o]] = e[n[o]]);
  return r;
}
function Do(e, t, r) {
  if (r || arguments.length === 2) for (var n = 0, o = t.length, a; n < o; n++)
    (a || !(n in t)) && (a || (a = Array.prototype.slice.call(t, 0, n)), a[n] = t[n]);
  return e.concat(a || Array.prototype.slice.call(t));
}
var xe = "right-scroll-bar-position", Ce = "width-before-scroll-bar", Io = "with-scroll-bars-hidden", To = "--removed-body-scroll-bar-size";
function $e(e, t) {
  return typeof e == "function" ? e(t) : e && (e.current = t), e;
}
function Mo(e, t) {
  var r = Or(function() {
    return {
      // value
      value: e,
      // last callback
      callback: t,
      // "memoized" public interface
      facade: {
        get current() {
          return r.value;
        },
        set current(n) {
          var o = r.value;
          o !== n && (r.value = n, r.callback(n, o));
        }
      }
    };
  })[0];
  return r.callback = t, r.facade;
}
var Fo = typeof window < "u" ? s.useLayoutEffect : s.useEffect, wt = /* @__PURE__ */ new WeakMap();
function _o(e, t) {
  var r = Mo(null, function(n) {
    return e.forEach(function(o) {
      return $e(o, n);
    });
  });
  return Fo(function() {
    var n = wt.get(r);
    if (n) {
      var o = new Set(n), a = new Set(e), l = r.current;
      o.forEach(function(i) {
        a.has(i) || $e(i, null);
      }), a.forEach(function(i) {
        o.has(i) || $e(i, l);
      });
    }
    wt.set(r, e);
  }, [e]), r;
}
function Lo(e) {
  return e;
}
function zo(e, t) {
  t === void 0 && (t = Lo);
  var r = [], n = !1, o = {
    read: function() {
      if (n)
        throw new Error("Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.");
      return r.length ? r[r.length - 1] : e;
    },
    useMedium: function(a) {
      var l = t(a, n);
      return r.push(l), function() {
        r = r.filter(function(i) {
          return i !== l;
        });
      };
    },
    assignSyncMedium: function(a) {
      for (n = !0; r.length; ) {
        var l = r;
        r = [], l.forEach(a);
      }
      r = {
        push: function(i) {
          return a(i);
        },
        filter: function() {
          return r;
        }
      };
    },
    assignMedium: function(a) {
      n = !0;
      var l = [];
      if (r.length) {
        var i = r;
        r = [], i.forEach(a), l = r;
      }
      var c = function() {
        var d = l;
        l = [], d.forEach(a);
      }, u = function() {
        return Promise.resolve().then(c);
      };
      u(), r = {
        push: function(d) {
          l.push(d), u();
        },
        filter: function(d) {
          return l = l.filter(d), r;
        }
      };
    }
  };
  return o;
}
function Wo(e) {
  e === void 0 && (e = {});
  var t = zo(null);
  return t.options = z({ async: !0, ssr: !1 }, e), t;
}
var Qt = function(e) {
  var t = e.sideCar, r = qt(e, ["sideCar"]);
  if (!t)
    throw new Error("Sidecar: please provide `sideCar` property to import the right car");
  var n = t.read();
  if (!n)
    throw new Error("Sidecar medium not found");
  return s.createElement(n, z({}, r));
};
Qt.isSideCarExport = !0;
function $o(e, t) {
  return e.useMedium(t), Qt;
}
var Jt = Wo(), Ve = function() {
}, Pe = s.forwardRef(function(e, t) {
  var r = s.useRef(null), n = s.useState({
    onScrollCapture: Ve,
    onWheelCapture: Ve,
    onTouchMoveCapture: Ve
  }), o = n[0], a = n[1], l = e.forwardProps, i = e.children, c = e.className, u = e.removeScrollBar, d = e.enabled, m = e.shards, h = e.sideCar, w = e.noRelative, S = e.noIsolation, f = e.inert, b = e.allowPinchZoom, E = e.as, R = E === void 0 ? "div" : E, P = e.gapMode, N = qt(e, ["forwardProps", "children", "className", "removeScrollBar", "enabled", "shards", "sideCar", "noRelative", "noIsolation", "inert", "allowPinchZoom", "as", "gapMode"]), A = h, D = _o([r, t]), k = z(z({}, N), o);
  return s.createElement(
    s.Fragment,
    null,
    d && s.createElement(A, { sideCar: Jt, removeScrollBar: u, shards: m, noRelative: w, noIsolation: S, inert: f, setCallbacks: a, allowPinchZoom: !!b, lockRef: r, gapMode: P }),
    l ? s.cloneElement(s.Children.only(i), z(z({}, k), { ref: D })) : s.createElement(R, z({}, k, { className: c, ref: D }), i)
  );
});
Pe.defaultProps = {
  enabled: !0,
  removeScrollBar: !0,
  inert: !1
};
Pe.classNames = {
  fullWidth: Ce,
  zeroRight: xe
};
var Vo = function() {
  if (typeof __webpack_nonce__ < "u")
    return __webpack_nonce__;
};
function Bo() {
  if (!document)
    return null;
  var e = document.createElement("style");
  e.type = "text/css";
  var t = Vo();
  return t && e.setAttribute("nonce", t), e;
}
function jo(e, t) {
  e.styleSheet ? e.styleSheet.cssText = t : e.appendChild(document.createTextNode(t));
}
function Uo(e) {
  var t = document.head || document.getElementsByTagName("head")[0];
  t.appendChild(e);
}
var Go = function() {
  var e = 0, t = null;
  return {
    add: function(r) {
      e == 0 && (t = Bo()) && (jo(t, r), Uo(t)), e++;
    },
    remove: function() {
      e--, !e && t && (t.parentNode && t.parentNode.removeChild(t), t = null);
    }
  };
}, Ho = function() {
  var e = Go();
  return function(t, r) {
    s.useEffect(function() {
      return e.add(t), function() {
        e.remove();
      };
    }, [t && r]);
  };
}, er = function() {
  var e = Ho(), t = function(r) {
    var n = r.styles, o = r.dynamic;
    return e(n, o), null;
  };
  return t;
}, Ko = {
  left: 0,
  top: 0,
  right: 0,
  gap: 0
}, Be = function(e) {
  return parseInt(e || "", 10) || 0;
}, Yo = function(e) {
  var t = window.getComputedStyle(document.body), r = t[e === "padding" ? "paddingLeft" : "marginLeft"], n = t[e === "padding" ? "paddingTop" : "marginTop"], o = t[e === "padding" ? "paddingRight" : "marginRight"];
  return [Be(r), Be(n), Be(o)];
}, Xo = function(e) {
  if (e === void 0 && (e = "margin"), typeof window > "u")
    return Ko;
  var t = Yo(e), r = document.documentElement.clientWidth, n = window.innerWidth;
  return {
    left: t[0],
    top: t[1],
    right: t[2],
    gap: Math.max(0, n - r + t[2] - t[0])
  };
}, Zo = er(), ne = "data-scroll-locked", qo = function(e, t, r, n) {
  var o = e.left, a = e.top, l = e.right, i = e.gap;
  return r === void 0 && (r = "margin"), `
  .`.concat(Io, ` {
   overflow: hidden `).concat(n, `;
   padding-right: `).concat(i, "px ").concat(n, `;
  }
  body[`).concat(ne, `] {
    overflow: hidden `).concat(n, `;
    overscroll-behavior: contain;
    `).concat([
    t && "position: relative ".concat(n, ";"),
    r === "margin" && `
    padding-left: `.concat(o, `px;
    padding-top: `).concat(a, `px;
    padding-right: `).concat(l, `px;
    margin-left:0;
    margin-top:0;
    margin-right: `).concat(i, "px ").concat(n, `;
    `),
    r === "padding" && "padding-right: ".concat(i, "px ").concat(n, ";")
  ].filter(Boolean).join(""), `
  }
  
  .`).concat(xe, ` {
    right: `).concat(i, "px ").concat(n, `;
  }
  
  .`).concat(Ce, ` {
    margin-right: `).concat(i, "px ").concat(n, `;
  }
  
  .`).concat(xe, " .").concat(xe, ` {
    right: 0 `).concat(n, `;
  }
  
  .`).concat(Ce, " .").concat(Ce, ` {
    margin-right: 0 `).concat(n, `;
  }
  
  body[`).concat(ne, `] {
    `).concat(To, ": ").concat(i, `px;
  }
`);
}, xt = function() {
  var e = parseInt(document.body.getAttribute(ne) || "0", 10);
  return isFinite(e) ? e : 0;
}, Qo = function() {
  s.useEffect(function() {
    return document.body.setAttribute(ne, (xt() + 1).toString()), function() {
      var e = xt() - 1;
      e <= 0 ? document.body.removeAttribute(ne) : document.body.setAttribute(ne, e.toString());
    };
  }, []);
}, Jo = function(e) {
  var t = e.noRelative, r = e.noImportant, n = e.gapMode, o = n === void 0 ? "margin" : n;
  Qo();
  var a = s.useMemo(function() {
    return Xo(o);
  }, [o]);
  return s.createElement(Zo, { styles: qo(a, !t, o, r ? "" : "!important") });
}, He = !1;
if (typeof window < "u")
  try {
    var he = Object.defineProperty({}, "passive", {
      get: function() {
        return He = !0, !0;
      }
    });
    window.addEventListener("test", he, he), window.removeEventListener("test", he, he);
  } catch {
    He = !1;
  }
var ee = He ? { passive: !1 } : !1, ea = function(e) {
  return e.tagName === "TEXTAREA";
}, tr = function(e, t) {
  if (!(e instanceof Element))
    return !1;
  var r = window.getComputedStyle(e);
  return (
    // not-not-scrollable
    r[t] !== "hidden" && // contains scroll inside self
    !(r.overflowY === r.overflowX && !ea(e) && r[t] === "visible")
  );
}, ta = function(e) {
  return tr(e, "overflowY");
}, ra = function(e) {
  return tr(e, "overflowX");
}, Ct = function(e, t) {
  var r = t.ownerDocument, n = t;
  do {
    typeof ShadowRoot < "u" && n instanceof ShadowRoot && (n = n.host);
    var o = rr(e, n);
    if (o) {
      var a = nr(e, n), l = a[1], i = a[2];
      if (l > i)
        return !0;
    }
    n = n.parentNode;
  } while (n && n !== r.body);
  return !1;
}, na = function(e) {
  var t = e.scrollTop, r = e.scrollHeight, n = e.clientHeight;
  return [
    t,
    r,
    n
  ];
}, oa = function(e) {
  var t = e.scrollLeft, r = e.scrollWidth, n = e.clientWidth;
  return [
    t,
    r,
    n
  ];
}, rr = function(e, t) {
  return e === "v" ? ta(t) : ra(t);
}, nr = function(e, t) {
  return e === "v" ? na(t) : oa(t);
}, aa = function(e, t) {
  return e === "h" && t === "rtl" ? -1 : 1;
}, sa = function(e, t, r, n, o) {
  var a = aa(e, window.getComputedStyle(t).direction), l = a * n, i = r.target, c = t.contains(i), u = !1, d = l > 0, m = 0, h = 0;
  do {
    if (!i)
      break;
    var w = nr(e, i), S = w[0], f = w[1], b = w[2], E = f - b - a * S;
    (S || E) && rr(e, i) && (m += E, h += S);
    var R = i.parentNode;
    i = R && R.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? R.host : R;
  } while (
    // portaled content
    !c && i !== document.body || // self content
    c && (t.contains(i) || t === i)
  );
  return (d && Math.abs(m) < 1 || !d && Math.abs(h) < 1) && (u = !0), u;
}, be = function(e) {
  return "changedTouches" in e ? [e.changedTouches[0].clientX, e.changedTouches[0].clientY] : [0, 0];
}, Et = function(e) {
  return [e.deltaX, e.deltaY];
}, kt = function(e) {
  return e && "current" in e ? e.current : e;
}, ia = function(e, t) {
  return e[0] === t[0] && e[1] === t[1];
}, la = function(e) {
  return `
  .block-interactivity-`.concat(e, ` {pointer-events: none;}
  .allow-interactivity-`).concat(e, ` {pointer-events: all;}
`);
}, ca = 0, te = [];
function ua(e) {
  var t = s.useRef([]), r = s.useRef([0, 0]), n = s.useRef(), o = s.useState(ca++)[0], a = s.useState(er)[0], l = s.useRef(e);
  s.useEffect(function() {
    l.current = e;
  }, [e]), s.useEffect(function() {
    if (e.inert) {
      document.body.classList.add("block-interactivity-".concat(o));
      var f = Do([e.lockRef.current], (e.shards || []).map(kt), !0).filter(Boolean);
      return f.forEach(function(b) {
        return b.classList.add("allow-interactivity-".concat(o));
      }), function() {
        document.body.classList.remove("block-interactivity-".concat(o)), f.forEach(function(b) {
          return b.classList.remove("allow-interactivity-".concat(o));
        });
      };
    }
  }, [e.inert, e.lockRef.current, e.shards]);
  var i = s.useCallback(function(f, b) {
    if ("touches" in f && f.touches.length === 2 || f.type === "wheel" && f.ctrlKey)
      return !l.current.allowPinchZoom;
    var E = be(f), R = r.current, P = "deltaX" in f ? f.deltaX : R[0] - E[0], N = "deltaY" in f ? f.deltaY : R[1] - E[1], A, D = f.target, k = Math.abs(P) > Math.abs(N) ? "h" : "v";
    if ("touches" in f && k === "h" && D.type === "range")
      return !1;
    var y = window.getSelection(), M = y && y.anchorNode, B = M ? M === D || M.contains(D) : !1;
    if (B)
      return !1;
    var H = Ct(k, D);
    if (!H)
      return !0;
    if (H ? A = k : (A = k === "v" ? "h" : "v", H = Ct(k, D)), !H)
      return !1;
    if (!n.current && "changedTouches" in f && (P || N) && (n.current = A), !A)
      return !0;
    var K = n.current || A;
    return sa(K, b, f, K === "h" ? P : N);
  }, []), c = s.useCallback(function(f) {
    var b = f;
    if (!(!te.length || te[te.length - 1] !== a)) {
      var E = "deltaY" in b ? Et(b) : be(b), R = t.current.filter(function(A) {
        return A.name === b.type && (A.target === b.target || b.target === A.shadowParent) && ia(A.delta, E);
      })[0];
      if (R && R.should) {
        b.cancelable && b.preventDefault();
        return;
      }
      if (!R) {
        var P = (l.current.shards || []).map(kt).filter(Boolean).filter(function(A) {
          return A.contains(b.target);
        }), N = P.length > 0 ? i(b, P[0]) : !l.current.noIsolation;
        N && b.cancelable && b.preventDefault();
      }
    }
  }, []), u = s.useCallback(function(f, b, E, R) {
    var P = { name: f, delta: b, target: E, should: R, shadowParent: da(E) };
    t.current.push(P), setTimeout(function() {
      t.current = t.current.filter(function(N) {
        return N !== P;
      });
    }, 1);
  }, []), d = s.useCallback(function(f) {
    r.current = be(f), n.current = void 0;
  }, []), m = s.useCallback(function(f) {
    u(f.type, Et(f), f.target, i(f, e.lockRef.current));
  }, []), h = s.useCallback(function(f) {
    u(f.type, be(f), f.target, i(f, e.lockRef.current));
  }, []);
  s.useEffect(function() {
    return te.push(a), e.setCallbacks({
      onScrollCapture: m,
      onWheelCapture: m,
      onTouchMoveCapture: h
    }), document.addEventListener("wheel", c, ee), document.addEventListener("touchmove", c, ee), document.addEventListener("touchstart", d, ee), function() {
      te = te.filter(function(f) {
        return f !== a;
      }), document.removeEventListener("wheel", c, ee), document.removeEventListener("touchmove", c, ee), document.removeEventListener("touchstart", d, ee);
    };
  }, []);
  var w = e.removeScrollBar, S = e.inert;
  return s.createElement(
    s.Fragment,
    null,
    S ? s.createElement(a, { styles: la(o) }) : null,
    w ? s.createElement(Jo, { noRelative: e.noRelative, gapMode: e.gapMode }) : null
  );
}
function da(e) {
  for (var t = null; e !== null; )
    e instanceof ShadowRoot && (t = e.host, e = e.host), e = e.parentNode;
  return t;
}
const fa = $o(Jt, ua);
var or = s.forwardRef(function(e, t) {
  return s.createElement(Pe, z({}, e, { ref: t, sideCar: fa }));
});
or.classNames = Pe.classNames;
var ma = function(e) {
  if (typeof document > "u")
    return null;
  var t = Array.isArray(e) ? e[0] : e;
  return t.ownerDocument.body;
}, re = /* @__PURE__ */ new WeakMap(), ye = /* @__PURE__ */ new WeakMap(), we = {}, je = 0, ar = function(e) {
  return e && (e.host || ar(e.parentNode));
}, pa = function(e, t) {
  return t.map(function(r) {
    if (e.contains(r))
      return r;
    var n = ar(r);
    return n && e.contains(n) ? n : (console.error("aria-hidden", r, "in not contained inside", e, ". Doing nothing"), null);
  }).filter(function(r) {
    return !!r;
  });
}, ga = function(e, t, r, n) {
  var o = pa(t, Array.isArray(e) ? e : [e]);
  we[r] || (we[r] = /* @__PURE__ */ new WeakMap());
  var a = we[r], l = [], i = /* @__PURE__ */ new Set(), c = new Set(o), u = function(m) {
    !m || i.has(m) || (i.add(m), u(m.parentNode));
  };
  o.forEach(u);
  var d = function(m) {
    !m || c.has(m) || Array.prototype.forEach.call(m.children, function(h) {
      if (i.has(h))
        d(h);
      else
        try {
          var w = h.getAttribute(n), S = w !== null && w !== "false", f = (re.get(h) || 0) + 1, b = (a.get(h) || 0) + 1;
          re.set(h, f), a.set(h, b), l.push(h), f === 1 && S && ye.set(h, !0), b === 1 && h.setAttribute(r, "true"), S || h.setAttribute(n, "true");
        } catch (E) {
          console.error("aria-hidden: cannot operate on ", h, E);
        }
    });
  };
  return d(t), i.clear(), je++, function() {
    l.forEach(function(m) {
      var h = re.get(m) - 1, w = a.get(m) - 1;
      re.set(m, h), a.set(m, w), h || (ye.has(m) || m.removeAttribute(n), ye.delete(m)), w || m.removeAttribute(r);
    }), je--, je || (re = /* @__PURE__ */ new WeakMap(), re = /* @__PURE__ */ new WeakMap(), ye = /* @__PURE__ */ new WeakMap(), we = {});
  };
}, va = function(e, t, r) {
  r === void 0 && (r = "data-aria-hidden");
  var n = Array.from(Array.isArray(e) ? e : [e]), o = ma(e);
  return o ? (n.push.apply(n, Array.from(o.querySelectorAll("[aria-live], script"))), ga(n, o, r, "aria-hidden")) : function() {
    return null;
  };
};
// @__NO_SIDE_EFFECTS__
function ha(e) {
  const t = /* @__PURE__ */ ba(e), r = s.forwardRef((n, o) => {
    const { children: a, ...l } = n, i = s.Children.toArray(a), c = i.find(wa);
    if (c) {
      const u = c.props.children, d = i.map((m) => m === c ? s.Children.count(u) > 1 ? s.Children.only(null) : s.isValidElement(u) ? u.props.children : null : m);
      return /* @__PURE__ */ p(t, { ...l, ref: o, children: s.isValidElement(u) ? s.cloneElement(u, void 0, d) : null });
    }
    return /* @__PURE__ */ p(t, { ...l, ref: o, children: a });
  });
  return r.displayName = `${e}.Slot`, r;
}
// @__NO_SIDE_EFFECTS__
function ba(e) {
  const t = s.forwardRef((r, n) => {
    const { children: o, ...a } = r;
    if (s.isValidElement(o)) {
      const l = Ca(o), i = xa(a, o.props);
      return o.type !== s.Fragment && (i.ref = n ? Ne(n, l) : l), s.cloneElement(o, i);
    }
    return s.Children.count(o) > 1 ? s.Children.only(null) : null;
  });
  return t.displayName = `${e}.SlotClone`, t;
}
var ya = /* @__PURE__ */ Symbol("radix.slottable");
function wa(e) {
  return s.isValidElement(e) && typeof e.type == "function" && "__radixId" in e.type && e.type.__radixId === ya;
}
function xa(e, t) {
  const r = { ...t };
  for (const n in t) {
    const o = e[n], a = t[n];
    /^on[A-Z]/.test(n) ? o && a ? r[n] = (...i) => {
      const c = a(...i);
      return o(...i), c;
    } : o && (r[n] = o) : n === "style" ? r[n] = { ...o, ...a } : n === "className" && (r[n] = [o, a].filter(Boolean).join(" "));
  }
  return { ...e, ...r };
}
function Ca(e) {
  let t = Object.getOwnPropertyDescriptor(e.props, "ref")?.get, r = t && "isReactWarning" in t && t.isReactWarning;
  return r ? e.ref : (t = Object.getOwnPropertyDescriptor(e, "ref")?.get, r = t && "isReactWarning" in t && t.isReactWarning, r ? e.props.ref : e.props.ref || e.ref);
}
var Ae = "Dialog", [sr] = Yn(Ae), [Ea, L] = sr(Ae), ir = (e) => {
  const {
    __scopeDialog: t,
    children: r,
    open: n,
    defaultOpen: o,
    onOpenChange: a,
    modal: l = !0
  } = e, i = s.useRef(null), c = s.useRef(null), [u, d] = Jn({
    prop: n,
    defaultProp: o ?? !1,
    onChange: a,
    caller: Ae
  });
  return /* @__PURE__ */ p(
    Ea,
    {
      scope: t,
      triggerRef: i,
      contentRef: c,
      contentId: _e(),
      titleId: _e(),
      descriptionId: _e(),
      open: u,
      onOpenChange: d,
      onOpenToggle: s.useCallback(() => d((m) => !m), [d]),
      modal: l,
      children: r
    }
  );
};
ir.displayName = Ae;
var lr = "DialogTrigger", cr = s.forwardRef(
  (e, t) => {
    const { __scopeDialog: r, ...n } = e, o = L(lr, r), a = q(t, o.triggerRef);
    return /* @__PURE__ */ p(
      V.button,
      {
        type: "button",
        "aria-haspopup": "dialog",
        "aria-expanded": o.open,
        "aria-controls": o.contentId,
        "data-state": qe(o.open),
        ...n,
        ref: a,
        onClick: G(e.onClick, o.onOpenToggle)
      }
    );
  }
);
cr.displayName = lr;
var Xe = "DialogPortal", [ka, ur] = sr(Xe, {
  forceMount: void 0
}), dr = (e) => {
  const { __scopeDialog: t, forceMount: r, children: n, container: o } = e, a = L(Xe, t);
  return /* @__PURE__ */ p(ka, { scope: t, forceMount: r, children: s.Children.map(n, (l) => /* @__PURE__ */ p(Re, { present: r || a.open, children: /* @__PURE__ */ p(Zt, { asChild: !0, container: o, children: l }) })) });
};
dr.displayName = Xe;
var Se = "DialogOverlay", fr = s.forwardRef(
  (e, t) => {
    const r = ur(Se, e.__scopeDialog), { forceMount: n = r.forceMount, ...o } = e, a = L(Se, e.__scopeDialog);
    return a.modal ? /* @__PURE__ */ p(Re, { present: n || a.open, children: /* @__PURE__ */ p(Na, { ...o, ref: t }) }) : null;
  }
);
fr.displayName = Se;
var Sa = /* @__PURE__ */ ha("DialogOverlay.RemoveScroll"), Na = s.forwardRef(
  (e, t) => {
    const { __scopeDialog: r, ...n } = e, o = L(Se, r);
    return (
      // Make sure `Content` is scrollable even when it doesn't live inside `RemoveScroll`
      // ie. when `Overlay` and `Content` are siblings
      /* @__PURE__ */ p(or, { as: Sa, allowPinchZoom: !0, shards: [o.contentRef], children: /* @__PURE__ */ p(
        V.div,
        {
          "data-state": qe(o.open),
          ...n,
          ref: t,
          style: { pointerEvents: "auto", ...n.style }
        }
      ) })
    );
  }
), Z = "DialogContent", mr = s.forwardRef(
  (e, t) => {
    const r = ur(Z, e.__scopeDialog), { forceMount: n = r.forceMount, ...o } = e, a = L(Z, e.__scopeDialog);
    return /* @__PURE__ */ p(Re, { present: n || a.open, children: a.modal ? /* @__PURE__ */ p(Ra, { ...o, ref: t }) : /* @__PURE__ */ p(Pa, { ...o, ref: t }) });
  }
);
mr.displayName = Z;
var Ra = s.forwardRef(
  (e, t) => {
    const r = L(Z, e.__scopeDialog), n = s.useRef(null), o = q(t, r.contentRef, n);
    return s.useEffect(() => {
      const a = n.current;
      if (a) return va(a);
    }, []), /* @__PURE__ */ p(
      pr,
      {
        ...e,
        ref: o,
        trapFocus: r.open,
        disableOutsidePointerEvents: !0,
        onCloseAutoFocus: G(e.onCloseAutoFocus, (a) => {
          a.preventDefault(), r.triggerRef.current?.focus();
        }),
        onPointerDownOutside: G(e.onPointerDownOutside, (a) => {
          const l = a.detail.originalEvent, i = l.button === 0 && l.ctrlKey === !0;
          (l.button === 2 || i) && a.preventDefault();
        }),
        onFocusOutside: G(
          e.onFocusOutside,
          (a) => a.preventDefault()
        )
      }
    );
  }
), Pa = s.forwardRef(
  (e, t) => {
    const r = L(Z, e.__scopeDialog), n = s.useRef(!1), o = s.useRef(!1);
    return /* @__PURE__ */ p(
      pr,
      {
        ...e,
        ref: t,
        trapFocus: !1,
        disableOutsidePointerEvents: !1,
        onCloseAutoFocus: (a) => {
          e.onCloseAutoFocus?.(a), a.defaultPrevented || (n.current || r.triggerRef.current?.focus(), a.preventDefault()), n.current = !1, o.current = !1;
        },
        onInteractOutside: (a) => {
          e.onInteractOutside?.(a), a.defaultPrevented || (n.current = !0, a.detail.originalEvent.type === "pointerdown" && (o.current = !0));
          const l = a.target;
          r.triggerRef.current?.contains(l) && a.preventDefault(), a.detail.originalEvent.type === "focusin" && o.current && a.preventDefault();
        }
      }
    );
  }
), pr = s.forwardRef(
  (e, t) => {
    const { __scopeDialog: r, trapFocus: n, onOpenAutoFocus: o, onCloseAutoFocus: a, ...l } = e, i = L(Z, r), c = s.useRef(null), u = q(t, c);
    return Oo(), /* @__PURE__ */ ie(ot, { children: [
      /* @__PURE__ */ p(
        Yt,
        {
          asChild: !0,
          loop: !0,
          trapped: n,
          onMountAutoFocus: o,
          onUnmountAutoFocus: a,
          children: /* @__PURE__ */ p(
            Ht,
            {
              role: "dialog",
              id: i.contentId,
              "aria-describedby": i.descriptionId,
              "aria-labelledby": i.titleId,
              "data-state": qe(i.open),
              ...l,
              ref: u,
              onDismiss: () => i.onOpenChange(!1)
            }
          )
        }
      ),
      /* @__PURE__ */ ie(ot, { children: [
        /* @__PURE__ */ p(Aa, { titleId: i.titleId }),
        /* @__PURE__ */ p(Da, { contentRef: c, descriptionId: i.descriptionId })
      ] })
    ] });
  }
), Ze = "DialogTitle", gr = s.forwardRef(
  (e, t) => {
    const { __scopeDialog: r, ...n } = e, o = L(Ze, r);
    return /* @__PURE__ */ p(V.h2, { id: o.titleId, ...n, ref: t });
  }
);
gr.displayName = Ze;
var vr = "DialogDescription", hr = s.forwardRef(
  (e, t) => {
    const { __scopeDialog: r, ...n } = e, o = L(vr, r);
    return /* @__PURE__ */ p(V.p, { id: o.descriptionId, ...n, ref: t });
  }
);
hr.displayName = vr;
var br = "DialogClose", yr = s.forwardRef(
  (e, t) => {
    const { __scopeDialog: r, ...n } = e, o = L(br, r);
    return /* @__PURE__ */ p(
      V.button,
      {
        type: "button",
        ...n,
        ref: t,
        onClick: G(e.onClick, () => o.onOpenChange(!1))
      }
    );
  }
);
yr.displayName = br;
function qe(e) {
  return e ? "open" : "closed";
}
var wr = "DialogTitleWarning", [rs, xr] = Kn(wr, {
  contentName: Z,
  titleName: Ze,
  docsSlug: "dialog"
}), Aa = ({ titleId: e }) => {
  const t = xr(wr), r = `\`${t.contentName}\` requires a \`${t.titleName}\` for the component to be accessible for screen reader users.

If you want to hide the \`${t.titleName}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://radix-ui.com/primitives/docs/components/${t.docsSlug}`;
  return s.useEffect(() => {
    e && (document.getElementById(e) || console.error(r));
  }, [r, e]), null;
}, Oa = "DialogDescriptionWarning", Da = ({ contentRef: e, descriptionId: t }) => {
  const n = `Warning: Missing \`Description\` or \`aria-describedby={undefined}\` for {${xr(Oa).contentName}}.`;
  return s.useEffect(() => {
    const o = e.current?.getAttribute("aria-describedby");
    t && o && (document.getElementById(t) || console.warn(n));
  }, [n, e, t]), null;
}, Ia = ir, Ta = cr, Ma = dr, Cr = fr, Er = mr, kr = gr, Sr = hr, Nr = yr;
const ns = Ia, os = Ta, Fa = Ma, as = Nr, Rr = s.forwardRef(({ className: e, ...t }, r) => /* @__PURE__ */ p(
  Cr,
  {
    ref: r,
    className: O(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      e
    ),
    ...t
  }
));
Rr.displayName = Cr.displayName;
const _a = s.forwardRef(({ className: e, children: t, ...r }, n) => /* @__PURE__ */ ie(Fa, { children: [
  /* @__PURE__ */ p(Rr, {}),
  /* @__PURE__ */ ie(
    Er,
    {
      ref: n,
      className: O(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        e
      ),
      ...r,
      children: [
        t,
        /* @__PURE__ */ ie(Nr, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground", children: [
          /* @__PURE__ */ p(Tr, { className: "h-4 w-4" }),
          /* @__PURE__ */ p("span", { className: "sr-only", children: "Close" })
        ] })
      ]
    }
  )
] }));
_a.displayName = Er.displayName;
const La = ({ className: e, ...t }) => /* @__PURE__ */ p("div", { className: O("flex flex-col space-y-1.5 text-center sm:text-left", e), ...t });
La.displayName = "DialogHeader";
const za = ({ className: e, ...t }) => /* @__PURE__ */ p(
  "div",
  {
    className: O("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", e),
    ...t
  }
);
za.displayName = "DialogFooter";
const Wa = s.forwardRef(({ className: e, ...t }, r) => /* @__PURE__ */ p(
  kr,
  {
    ref: r,
    className: O("text-lg font-semibold leading-none tracking-tight", e),
    ...t
  }
));
Wa.displayName = kr.displayName;
const $a = s.forwardRef(({ className: e, ...t }, r) => /* @__PURE__ */ p(
  Sr,
  {
    ref: r,
    className: O("text-sm text-muted-foreground", e),
    ...t
  }
));
$a.displayName = Sr.displayName;
const Va = Ke(
  "relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
), Ba = s.forwardRef(({ className: e, variant: t, ...r }, n) => /* @__PURE__ */ p("div", { ref: n, role: "alert", className: O(Va({ variant: t }), e), ...r }));
Ba.displayName = "Alert";
const ja = s.forwardRef(
  ({ className: e, ...t }, r) => (
    // eslint-disable-next-line jsx-a11y/heading-has-content
    /* @__PURE__ */ p(
      "h5",
      {
        ref: r,
        className: O("mb-1 font-medium leading-none tracking-tight", e),
        ...t
      }
    )
  )
);
ja.displayName = "AlertTitle";
const Ua = s.forwardRef(({ className: e, ...t }, r) => /* @__PURE__ */ p("div", { ref: r, className: O("text-sm [&_p]:leading-relaxed", e), ...t }));
Ua.displayName = "AlertDescription";
const ss = Fr, Pr = s.createContext(null), is = ({
  ...e
}) => /* @__PURE__ */ p(Pr.Provider, { value: { name: e.name }, children: /* @__PURE__ */ p(_r, { ...e }) }), Oe = () => {
  const e = s.useContext(Pr), t = s.useContext(Ar), { getFieldState: r, formState: n } = Mr();
  if (!e)
    throw new Error("useFormField should be used within <FormField>");
  if (!t)
    throw new Error("useFormField should be used within <FormItem>");
  const o = r(e.name, n), { id: a } = t;
  return {
    id: a,
    name: e.name,
    formItemId: `${a}-form-item`,
    formDescriptionId: `${a}-form-item-description`,
    formMessageId: `${a}-form-item-message`,
    ...o
  };
}, Ar = s.createContext(null), Ga = s.forwardRef(
  ({ className: e, ...t }, r) => {
    const n = s.useId();
    return /* @__PURE__ */ p(Ar.Provider, { value: { id: n }, children: /* @__PURE__ */ p("div", { ref: r, className: O("space-y-2", e), ...t }) });
  }
);
Ga.displayName = "FormItem";
const Ha = s.forwardRef(({ className: e, ...t }, r) => {
  const { error: n, formItemId: o } = Oe();
  return /* @__PURE__ */ p(
    Ut,
    {
      ref: r,
      className: O(n && "text-destructive", e),
      htmlFor: o,
      ...t
    }
  );
});
Ha.displayName = "FormLabel";
const Ka = s.forwardRef(({ ...e }, t) => {
  const { error: r, formItemId: n, formDescriptionId: o, formMessageId: a } = Oe();
  return /* @__PURE__ */ p(
    Rt,
    {
      ref: t,
      id: n,
      "aria-describedby": r ? `${o} ${a}` : `${o}`,
      "aria-invalid": !!r,
      ...e
    }
  );
});
Ka.displayName = "FormControl";
const Ya = s.forwardRef(({ className: e, ...t }, r) => {
  const { formDescriptionId: n } = Oe();
  return /* @__PURE__ */ p(
    "p",
    {
      ref: r,
      id: n,
      className: O("text-[0.8rem] text-muted-foreground", e),
      ...t
    }
  );
});
Ya.displayName = "FormDescription";
const Xa = s.forwardRef(({ className: e, children: t, ...r }, n) => {
  const { error: o, formMessageId: a } = Oe(), l = o ? String(o?.message ?? "") : t;
  return l ? /* @__PURE__ */ p(
    "p",
    {
      ref: n,
      id: a,
      className: O("text-[0.8rem] font-medium text-destructive", e),
      ...r,
      children: l
    }
  ) : null;
});
Xa.displayName = "FormMessage";
export {
  Ba as Alert,
  Ua as AlertDescription,
  ja as AlertTitle,
  Mn as Button,
  Vn as Card,
  Gn as CardContent,
  Un as CardDescription,
  Hn as CardFooter,
  Bn as CardHeader,
  jn as CardTitle,
  ns as Dialog,
  as as DialogClose,
  _a as DialogContent,
  $a as DialogDescription,
  za as DialogFooter,
  La as DialogHeader,
  Rr as DialogOverlay,
  Fa as DialogPortal,
  Wa as DialogTitle,
  os as DialogTrigger,
  ss as Form,
  Ka as FormControl,
  Ya as FormDescription,
  is as FormField,
  Ga as FormItem,
  Ha as FormLabel,
  Xa as FormMessage,
  Fn as Input,
  Ut as Label,
  ts as Skeleton,
  $n as Textarea,
  Tn as buttonVariants,
  Oe as useFormField
};
