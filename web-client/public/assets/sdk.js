var Xx = Object.defineProperty;
var Qx = (e, t, n) => t in e ? Xx(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var j = (e, t, n) => (Qx(e, typeof t != "symbol" ? t + "" : t, n), n);
import * as xF from "@tanstack/react-query";
import * as SF from "react-router-dom";
import { X as Fh, ChevronLeftIcon as eS, ChevronRightIcon as tS, ChevronDownIcon as nS, Check as Wh, Circle as Lh, ChevronRight as rS } from "lucide-react";
import * as OF from "lucide-react";
import { FormProvider as oS, Controller as iS, useFormContext as aS } from "react-hook-form";
import { Controller as T2, useFieldArray as C2, useForm as M2 } from "react-hook-form";
import { zodResolver as R2 } from "@hookform/resolvers/zod";
import { Trans as U2, useTranslation as j2 } from "react-i18next";
import { jsx as y, jsxs as Ge, Fragment as Gi } from "react/jsx-runtime";
import * as m from "react";
import R, { useState as Vi, createContext as sS, useContext as cS, useCallback as lt, useRef as Ai, useLayoutEffect as Zh, useEffect as uS, useMemo as Ui } from "react";
import * as Yh from "react-dom";
import lS from "react-dom";
class TF {
  constructor() {
    j(this, "name", "");
  }
  register(t) {
  }
  registerTranslations(t, n) {
    Object.keys(t).forEach((o) => {
      n.addResourceBundle(o, this.name, t[o], !0, !0);
    });
  }
}
function Bh(e, t) {
  return function() {
    return e.apply(t, arguments);
  };
}
const { toString: dS } = Object.prototype, { getPrototypeOf: $u } = Object, { iterator: $a, toStringTag: Hh } = Symbol, ka = ((e) => (t) => {
  const n = dS.call(t);
  return e[n] || (e[n] = n.slice(8, -1).toLowerCase());
})(/* @__PURE__ */ Object.create(null)), xt = (e) => (e = e.toLowerCase(), (t) => ka(t) === e), xa = (e) => (t) => typeof t === e, { isArray: Sr } = Array, ur = xa("undefined");
function uo(e) {
  return e !== null && !ur(e) && e.constructor !== null && !ur(e.constructor) && qe(e.constructor.isBuffer) && e.constructor.isBuffer(e);
}
const Gh = xt("ArrayBuffer");
function fS(e) {
  let t;
  return typeof ArrayBuffer < "u" && ArrayBuffer.isView ? t = ArrayBuffer.isView(e) : t = e && e.buffer && Gh(e.buffer), t;
}
const mS = xa("string"), qe = xa("function"), Vh = xa("number"), lo = (e) => e !== null && typeof e == "object", hS = (e) => e === !0 || e === !1, ji = (e) => {
  if (ka(e) !== "object")
    return !1;
  const t = $u(e);
  return (t === null || t === Object.prototype || Object.getPrototypeOf(t) === null) && !(Hh in e) && !($a in e);
}, gS = (e) => {
  if (!lo(e) || uo(e))
    return !1;
  try {
    return Object.keys(e).length === 0 && Object.getPrototypeOf(e) === Object.prototype;
  } catch {
    return !1;
  }
}, pS = xt("Date"), vS = xt("File"), yS = xt("Blob"), bS = xt("FileList"), wS = (e) => lo(e) && qe(e.pipe), _S = (e) => {
  let t;
  return e && (typeof FormData == "function" && e instanceof FormData || qe(e.append) && ((t = ka(e)) === "formdata" || // detect form-data instance
  t === "object" && qe(e.toString) && e.toString() === "[object FormData]"));
}, $S = xt("URLSearchParams"), [kS, xS, SS, DS] = ["ReadableStream", "Request", "Response", "Headers"].map(xt), OS = (e) => e.trim ? e.trim() : e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
function fo(e, t, { allOwnKeys: n = !1 } = {}) {
  if (e === null || typeof e > "u")
    return;
  let o, r;
  if (typeof e != "object" && (e = [e]), Sr(e))
    for (o = 0, r = e.length; o < r; o++)
      t.call(null, e[o], o, e);
  else {
    if (uo(e))
      return;
    const i = n ? Object.getOwnPropertyNames(e) : Object.keys(e), a = i.length;
    let s;
    for (o = 0; o < a; o++)
      s = i[o], t.call(null, e[s], s, e);
  }
}
function qh(e, t) {
  if (uo(e))
    return null;
  t = t.toLowerCase();
  const n = Object.keys(e);
  let o = n.length, r;
  for (; o-- > 0; )
    if (r = n[o], t === r.toLowerCase())
      return r;
  return null;
}
const En = (() => typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : global)(), Jh = (e) => !ur(e) && e !== En;
function Kc() {
  const { caseless: e, skipUndefined: t } = Jh(this) && this || {}, n = {}, o = (r, i) => {
    const a = e && qh(n, i) || i;
    ji(n[a]) && ji(r) ? n[a] = Kc(n[a], r) : ji(r) ? n[a] = Kc({}, r) : Sr(r) ? n[a] = r.slice() : (!t || !ur(r)) && (n[a] = r);
  };
  for (let r = 0, i = arguments.length; r < i; r++)
    arguments[r] && fo(arguments[r], o);
  return n;
}
const IS = (e, t, n, { allOwnKeys: o } = {}) => (fo(t, (r, i) => {
  n && qe(r) ? e[i] = Bh(r, n) : e[i] = r;
}, { allOwnKeys: o }), e), NS = (e) => (e.charCodeAt(0) === 65279 && (e = e.slice(1)), e), ES = (e, t, n, o) => {
  e.prototype = Object.create(t.prototype, o), e.prototype.constructor = e, Object.defineProperty(e, "super", {
    value: t.prototype
  }), n && Object.assign(e.prototype, n);
}, PS = (e, t, n, o) => {
  let r, i, a;
  const s = {};
  if (t = t || {}, e == null)
    return t;
  do {
    for (r = Object.getOwnPropertyNames(e), i = r.length; i-- > 0; )
      a = r[i], (!o || o(a, e, t)) && !s[a] && (t[a] = e[a], s[a] = !0);
    e = n !== !1 && $u(e);
  } while (e && (!n || n(e, t)) && e !== Object.prototype);
  return t;
}, TS = (e, t, n) => {
  e = String(e), (n === void 0 || n > e.length) && (n = e.length), n -= t.length;
  const o = e.indexOf(t, n);
  return o !== -1 && o === n;
}, CS = (e) => {
  if (!e)
    return null;
  if (Sr(e))
    return e;
  let t = e.length;
  if (!Vh(t))
    return null;
  const n = new Array(t);
  for (; t-- > 0; )
    n[t] = e[t];
  return n;
}, MS = ((e) => (t) => e && t instanceof e)(typeof Uint8Array < "u" && $u(Uint8Array)), zS = (e, t) => {
  const o = (e && e[$a]).call(e);
  let r;
  for (; (r = o.next()) && !r.done; ) {
    const i = r.value;
    t.call(e, i[0], i[1]);
  }
}, RS = (e, t) => {
  let n;
  const o = [];
  for (; (n = e.exec(t)) !== null; )
    o.push(n);
  return o;
}, AS = xt("HTMLFormElement"), US = (e) => e.toLowerCase().replace(
  /[-_\s]([a-z\d])(\w*)/g,
  function(n, o, r) {
    return o.toUpperCase() + r;
  }
), lm = (({ hasOwnProperty: e }) => (t, n) => e.call(t, n))(Object.prototype), jS = xt("RegExp"), Kh = (e, t) => {
  const n = Object.getOwnPropertyDescriptors(e), o = {};
  fo(n, (r, i) => {
    let a;
    (a = t(r, i, e)) !== !1 && (o[i] = a || r);
  }), Object.defineProperties(e, o);
}, FS = (e) => {
  Kh(e, (t, n) => {
    if (qe(e) && ["arguments", "caller", "callee"].indexOf(n) !== -1)
      return !1;
    const o = e[n];
    if (qe(o)) {
      if (t.enumerable = !1, "writable" in t) {
        t.writable = !1;
        return;
      }
      t.set || (t.set = () => {
        throw Error("Can not rewrite read-only method '" + n + "'");
      });
    }
  });
}, WS = (e, t) => {
  const n = {}, o = (r) => {
    r.forEach((i) => {
      n[i] = !0;
    });
  };
  return Sr(e) ? o(e) : o(String(e).split(t)), n;
}, LS = () => {
}, ZS = (e, t) => e != null && Number.isFinite(e = +e) ? e : t;
function YS(e) {
  return !!(e && qe(e.append) && e[Hh] === "FormData" && e[$a]);
}
const BS = (e) => {
  const t = new Array(10), n = (o, r) => {
    if (lo(o)) {
      if (t.indexOf(o) >= 0)
        return;
      if (uo(o))
        return o;
      if (!("toJSON" in o)) {
        t[r] = o;
        const i = Sr(o) ? [] : {};
        return fo(o, (a, s) => {
          const c = n(a, r + 1);
          !ur(c) && (i[s] = c);
        }), t[r] = void 0, i;
      }
    }
    return o;
  };
  return n(e, 0);
}, HS = xt("AsyncFunction"), GS = (e) => e && (lo(e) || qe(e)) && qe(e.then) && qe(e.catch), Xh = ((e, t) => e ? setImmediate : t ? ((n, o) => (En.addEventListener("message", ({ source: r, data: i }) => {
  r === En && i === n && o.length && o.shift()();
}, !1), (r) => {
  o.push(r), En.postMessage(n, "*");
}))(`axios@${Math.random()}`, []) : (n) => setTimeout(n))(
  typeof setImmediate == "function",
  qe(En.postMessage)
), VS = typeof queueMicrotask < "u" ? queueMicrotask.bind(En) : typeof process < "u" && process.nextTick || Xh, qS = (e) => e != null && qe(e[$a]), O = {
  isArray: Sr,
  isArrayBuffer: Gh,
  isBuffer: uo,
  isFormData: _S,
  isArrayBufferView: fS,
  isString: mS,
  isNumber: Vh,
  isBoolean: hS,
  isObject: lo,
  isPlainObject: ji,
  isEmptyObject: gS,
  isReadableStream: kS,
  isRequest: xS,
  isResponse: SS,
  isHeaders: DS,
  isUndefined: ur,
  isDate: pS,
  isFile: vS,
  isBlob: yS,
  isRegExp: jS,
  isFunction: qe,
  isStream: wS,
  isURLSearchParams: $S,
  isTypedArray: MS,
  isFileList: bS,
  forEach: fo,
  merge: Kc,
  extend: IS,
  trim: OS,
  stripBOM: NS,
  inherits: ES,
  toFlatObject: PS,
  kindOf: ka,
  kindOfTest: xt,
  endsWith: TS,
  toArray: CS,
  forEachEntry: zS,
  matchAll: RS,
  isHTMLForm: AS,
  hasOwnProperty: lm,
  hasOwnProp: lm,
  // an alias to avoid ESLint no-prototype-builtins detection
  reduceDescriptors: Kh,
  freezeMethods: FS,
  toObjectSet: WS,
  toCamelCase: US,
  noop: LS,
  toFiniteNumber: ZS,
  findKey: qh,
  global: En,
  isContextDefined: Jh,
  isSpecCompliantForm: YS,
  toJSONObject: BS,
  isAsyncFn: HS,
  isThenable: GS,
  setImmediate: Xh,
  asap: VS,
  isIterable: qS
};
function ne(e, t, n, o, r) {
  Error.call(this), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack, this.message = e, this.name = "AxiosError", t && (this.code = t), n && (this.config = n), o && (this.request = o), r && (this.response = r, this.status = r.status ? r.status : null);
}
O.inherits(ne, Error, {
  toJSON: function() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: O.toJSONObject(this.config),
      code: this.code,
      status: this.status
    };
  }
});
const Qh = ne.prototype, eg = {};
[
  "ERR_BAD_OPTION_VALUE",
  "ERR_BAD_OPTION",
  "ECONNABORTED",
  "ETIMEDOUT",
  "ERR_NETWORK",
  "ERR_FR_TOO_MANY_REDIRECTS",
  "ERR_DEPRECATED",
  "ERR_BAD_RESPONSE",
  "ERR_BAD_REQUEST",
  "ERR_CANCELED",
  "ERR_NOT_SUPPORT",
  "ERR_INVALID_URL"
  // eslint-disable-next-line func-names
].forEach((e) => {
  eg[e] = { value: e };
});
Object.defineProperties(ne, eg);
Object.defineProperty(Qh, "isAxiosError", { value: !0 });
ne.from = (e, t, n, o, r, i) => {
  const a = Object.create(Qh);
  O.toFlatObject(e, a, function(l) {
    return l !== Error.prototype;
  }, (u) => u !== "isAxiosError");
  const s = e && e.message ? e.message : "Error", c = t == null && e ? e.code : t;
  return ne.call(a, s, c, n, o, r), e && a.cause == null && Object.defineProperty(a, "cause", { value: e, configurable: !0 }), a.name = e && e.name || "Error", i && Object.assign(a, i), a;
};
const JS = null;
function Xc(e) {
  return O.isPlainObject(e) || O.isArray(e);
}
function tg(e) {
  return O.endsWith(e, "[]") ? e.slice(0, -2) : e;
}
function dm(e, t, n) {
  return e ? e.concat(t).map(function(r, i) {
    return r = tg(r), !n && i ? "[" + r + "]" : r;
  }).join(n ? "." : "") : t;
}
function KS(e) {
  return O.isArray(e) && !e.some(Xc);
}
const XS = O.toFlatObject(O, {}, null, function(t) {
  return /^is[A-Z]/.test(t);
});
function Sa(e, t, n) {
  if (!O.isObject(e))
    throw new TypeError("target must be an object");
  t = t || new FormData(), n = O.toFlatObject(n, {
    metaTokens: !0,
    dots: !1,
    indexes: !1
  }, !1, function(p, v) {
    return !O.isUndefined(v[p]);
  });
  const o = n.metaTokens, r = n.visitor || l, i = n.dots, a = n.indexes, c = (n.Blob || typeof Blob < "u" && Blob) && O.isSpecCompliantForm(t);
  if (!O.isFunction(r))
    throw new TypeError("visitor must be a function");
  function u(g) {
    if (g === null)
      return "";
    if (O.isDate(g))
      return g.toISOString();
    if (O.isBoolean(g))
      return g.toString();
    if (!c && O.isBlob(g))
      throw new ne("Blob is not supported. Use a Buffer instead.");
    return O.isArrayBuffer(g) || O.isTypedArray(g) ? c && typeof Blob == "function" ? new Blob([g]) : Buffer.from(g) : g;
  }
  function l(g, p, v) {
    let b = g;
    if (g && !v && typeof g == "object") {
      if (O.endsWith(p, "{}"))
        p = o ? p : p.slice(0, -2), g = JSON.stringify(g);
      else if (O.isArray(g) && KS(g) || (O.isFileList(g) || O.endsWith(p, "[]")) && (b = O.toArray(g)))
        return p = tg(p), b.forEach(function($, x) {
          !(O.isUndefined($) || $ === null) && t.append(
            // eslint-disable-next-line no-nested-ternary
            a === !0 ? dm([p], x, i) : a === null ? p : p + "[]",
            u($)
          );
        }), !1;
    }
    return Xc(g) ? !0 : (t.append(dm(v, p, i), u(g)), !1);
  }
  const d = [], f = Object.assign(XS, {
    defaultVisitor: l,
    convertValue: u,
    isVisitable: Xc
  });
  function h(g, p) {
    if (!O.isUndefined(g)) {
      if (d.indexOf(g) !== -1)
        throw Error("Circular reference detected in " + p.join("."));
      d.push(g), O.forEach(g, function(b, _) {
        (!(O.isUndefined(b) || b === null) && r.call(
          t,
          b,
          O.isString(_) ? _.trim() : _,
          p,
          f
        )) === !0 && h(b, p ? p.concat(_) : [_]);
      }), d.pop();
    }
  }
  if (!O.isObject(e))
    throw new TypeError("data must be an object");
  return h(e), t;
}
function fm(e) {
  const t = {
    "!": "%21",
    "'": "%27",
    "(": "%28",
    ")": "%29",
    "~": "%7E",
    "%20": "+",
    "%00": "\0"
  };
  return encodeURIComponent(e).replace(/[!'()~]|%20|%00/g, function(o) {
    return t[o];
  });
}
function ku(e, t) {
  this._pairs = [], e && Sa(e, this, t);
}
const ng = ku.prototype;
ng.append = function(t, n) {
  this._pairs.push([t, n]);
};
ng.toString = function(t) {
  const n = t ? function(o) {
    return t.call(this, o, fm);
  } : fm;
  return this._pairs.map(function(r) {
    return n(r[0]) + "=" + n(r[1]);
  }, "").join("&");
};
function QS(e) {
  return encodeURIComponent(e).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+");
}
function rg(e, t, n) {
  if (!t)
    return e;
  const o = n && n.encode || QS;
  O.isFunction(n) && (n = {
    serialize: n
  });
  const r = n && n.serialize;
  let i;
  if (r ? i = r(t, n) : i = O.isURLSearchParams(t) ? t.toString() : new ku(t, n).toString(o), i) {
    const a = e.indexOf("#");
    a !== -1 && (e = e.slice(0, a)), e += (e.indexOf("?") === -1 ? "?" : "&") + i;
  }
  return e;
}
class e0 {
  constructor() {
    this.handlers = [];
  }
  /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   *
   * @return {Number} An ID used to remove interceptor later
   */
  use(t, n, o) {
    return this.handlers.push({
      fulfilled: t,
      rejected: n,
      synchronous: o ? o.synchronous : !1,
      runWhen: o ? o.runWhen : null
    }), this.handlers.length - 1;
  }
  /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   *
   * @returns {void}
   */
  eject(t) {
    this.handlers[t] && (this.handlers[t] = null);
  }
  /**
   * Clear all interceptors from the stack
   *
   * @returns {void}
   */
  clear() {
    this.handlers && (this.handlers = []);
  }
  /**
   * Iterate over all the registered interceptors
   *
   * This method is particularly useful for skipping over any
   * interceptors that may have become `null` calling `eject`.
   *
   * @param {Function} fn The function to call for each interceptor
   *
   * @returns {void}
   */
  forEach(t) {
    O.forEach(this.handlers, function(o) {
      o !== null && t(o);
    });
  }
}
const mm = e0, og = {
  silentJSONParsing: !0,
  forcedJSONParsing: !0,
  clarifyTimeoutError: !1
}, t0 = typeof URLSearchParams < "u" ? URLSearchParams : ku, n0 = typeof FormData < "u" ? FormData : null, r0 = typeof Blob < "u" ? Blob : null, o0 = {
  isBrowser: !0,
  classes: {
    URLSearchParams: t0,
    FormData: n0,
    Blob: r0
  },
  protocols: ["http", "https", "file", "blob", "url", "data"]
}, xu = typeof window < "u" && typeof document < "u", Qc = typeof navigator == "object" && navigator || void 0, i0 = xu && (!Qc || ["ReactNative", "NativeScript", "NS"].indexOf(Qc.product) < 0), a0 = (() => typeof WorkerGlobalScope < "u" && // eslint-disable-next-line no-undef
self instanceof WorkerGlobalScope && typeof self.importScripts == "function")(), s0 = xu && window.location.href || "http://localhost", c0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  hasBrowserEnv: xu,
  hasStandardBrowserEnv: i0,
  hasStandardBrowserWebWorkerEnv: a0,
  navigator: Qc,
  origin: s0
}, Symbol.toStringTag, { value: "Module" })), Fe = {
  ...c0,
  ...o0
};
function u0(e, t) {
  return Sa(e, new Fe.classes.URLSearchParams(), {
    visitor: function(n, o, r, i) {
      return Fe.isNode && O.isBuffer(n) ? (this.append(o, n.toString("base64")), !1) : i.defaultVisitor.apply(this, arguments);
    },
    ...t
  });
}
function l0(e) {
  return O.matchAll(/\w+|\[(\w*)]/g, e).map((t) => t[0] === "[]" ? "" : t[1] || t[0]);
}
function d0(e) {
  const t = {}, n = Object.keys(e);
  let o;
  const r = n.length;
  let i;
  for (o = 0; o < r; o++)
    i = n[o], t[i] = e[i];
  return t;
}
function ig(e) {
  function t(n, o, r, i) {
    let a = n[i++];
    if (a === "__proto__")
      return !0;
    const s = Number.isFinite(+a), c = i >= n.length;
    return a = !a && O.isArray(r) ? r.length : a, c ? (O.hasOwnProp(r, a) ? r[a] = [r[a], o] : r[a] = o, !s) : ((!r[a] || !O.isObject(r[a])) && (r[a] = []), t(n, o, r[a], i) && O.isArray(r[a]) && (r[a] = d0(r[a])), !s);
  }
  if (O.isFormData(e) && O.isFunction(e.entries)) {
    const n = {};
    return O.forEachEntry(e, (o, r) => {
      t(l0(o), r, n, 0);
    }), n;
  }
  return null;
}
function f0(e, t, n) {
  if (O.isString(e))
    try {
      return (t || JSON.parse)(e), O.trim(e);
    } catch (o) {
      if (o.name !== "SyntaxError")
        throw o;
    }
  return (n || JSON.stringify)(e);
}
const Su = {
  transitional: og,
  adapter: ["xhr", "http", "fetch"],
  transformRequest: [function(t, n) {
    const o = n.getContentType() || "", r = o.indexOf("application/json") > -1, i = O.isObject(t);
    if (i && O.isHTMLForm(t) && (t = new FormData(t)), O.isFormData(t))
      return r ? JSON.stringify(ig(t)) : t;
    if (O.isArrayBuffer(t) || O.isBuffer(t) || O.isStream(t) || O.isFile(t) || O.isBlob(t) || O.isReadableStream(t))
      return t;
    if (O.isArrayBufferView(t))
      return t.buffer;
    if (O.isURLSearchParams(t))
      return n.setContentType("application/x-www-form-urlencoded;charset=utf-8", !1), t.toString();
    let s;
    if (i) {
      if (o.indexOf("application/x-www-form-urlencoded") > -1)
        return u0(t, this.formSerializer).toString();
      if ((s = O.isFileList(t)) || o.indexOf("multipart/form-data") > -1) {
        const c = this.env && this.env.FormData;
        return Sa(
          s ? { "files[]": t } : t,
          c && new c(),
          this.formSerializer
        );
      }
    }
    return i || r ? (n.setContentType("application/json", !1), f0(t)) : t;
  }],
  transformResponse: [function(t) {
    const n = this.transitional || Su.transitional, o = n && n.forcedJSONParsing, r = this.responseType === "json";
    if (O.isResponse(t) || O.isReadableStream(t))
      return t;
    if (t && O.isString(t) && (o && !this.responseType || r)) {
      const a = !(n && n.silentJSONParsing) && r;
      try {
        return JSON.parse(t, this.parseReviver);
      } catch (s) {
        if (a)
          throw s.name === "SyntaxError" ? ne.from(s, ne.ERR_BAD_RESPONSE, this, null, this.response) : s;
      }
    }
    return t;
  }],
  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  maxContentLength: -1,
  maxBodyLength: -1,
  env: {
    FormData: Fe.classes.FormData,
    Blob: Fe.classes.Blob
  },
  validateStatus: function(t) {
    return t >= 200 && t < 300;
  },
  headers: {
    common: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": void 0
    }
  }
};
O.forEach(["delete", "get", "head", "post", "put", "patch"], (e) => {
  Su.headers[e] = {};
});
const Du = Su, m0 = O.toObjectSet([
  "age",
  "authorization",
  "content-length",
  "content-type",
  "etag",
  "expires",
  "from",
  "host",
  "if-modified-since",
  "if-unmodified-since",
  "last-modified",
  "location",
  "max-forwards",
  "proxy-authorization",
  "referer",
  "retry-after",
  "user-agent"
]), h0 = (e) => {
  const t = {};
  let n, o, r;
  return e && e.split(`
`).forEach(function(a) {
    r = a.indexOf(":"), n = a.substring(0, r).trim().toLowerCase(), o = a.substring(r + 1).trim(), !(!n || t[n] && m0[n]) && (n === "set-cookie" ? t[n] ? t[n].push(o) : t[n] = [o] : t[n] = t[n] ? t[n] + ", " + o : o);
  }), t;
}, hm = Symbol("internals");
function Hr(e) {
  return e && String(e).trim().toLowerCase();
}
function Fi(e) {
  return e === !1 || e == null ? e : O.isArray(e) ? e.map(Fi) : String(e);
}
function g0(e) {
  const t = /* @__PURE__ */ Object.create(null), n = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
  let o;
  for (; o = n.exec(e); )
    t[o[1]] = o[2];
  return t;
}
const p0 = (e) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(e.trim());
function Ec(e, t, n, o, r) {
  if (O.isFunction(o))
    return o.call(this, t, n);
  if (r && (t = n), !!O.isString(t)) {
    if (O.isString(o))
      return t.indexOf(o) !== -1;
    if (O.isRegExp(o))
      return o.test(t);
  }
}
function v0(e) {
  return e.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, (t, n, o) => n.toUpperCase() + o);
}
function y0(e, t) {
  const n = O.toCamelCase(" " + t);
  ["get", "set", "has"].forEach((o) => {
    Object.defineProperty(e, o + n, {
      value: function(r, i, a) {
        return this[o].call(this, t, r, i, a);
      },
      configurable: !0
    });
  });
}
let Da = class {
  constructor(t) {
    t && this.set(t);
  }
  set(t, n, o) {
    const r = this;
    function i(s, c, u) {
      const l = Hr(c);
      if (!l)
        throw new Error("header name must be a non-empty string");
      const d = O.findKey(r, l);
      (!d || r[d] === void 0 || u === !0 || u === void 0 && r[d] !== !1) && (r[d || c] = Fi(s));
    }
    const a = (s, c) => O.forEach(s, (u, l) => i(u, l, c));
    if (O.isPlainObject(t) || t instanceof this.constructor)
      a(t, n);
    else if (O.isString(t) && (t = t.trim()) && !p0(t))
      a(h0(t), n);
    else if (O.isObject(t) && O.isIterable(t)) {
      let s = {}, c, u;
      for (const l of t) {
        if (!O.isArray(l))
          throw TypeError("Object iterator must return a key-value pair");
        s[u = l[0]] = (c = s[u]) ? O.isArray(c) ? [...c, l[1]] : [c, l[1]] : l[1];
      }
      a(s, n);
    } else
      t != null && i(n, t, o);
    return this;
  }
  get(t, n) {
    if (t = Hr(t), t) {
      const o = O.findKey(this, t);
      if (o) {
        const r = this[o];
        if (!n)
          return r;
        if (n === !0)
          return g0(r);
        if (O.isFunction(n))
          return n.call(this, r, o);
        if (O.isRegExp(n))
          return n.exec(r);
        throw new TypeError("parser must be boolean|regexp|function");
      }
    }
  }
  has(t, n) {
    if (t = Hr(t), t) {
      const o = O.findKey(this, t);
      return !!(o && this[o] !== void 0 && (!n || Ec(this, this[o], o, n)));
    }
    return !1;
  }
  delete(t, n) {
    const o = this;
    let r = !1;
    function i(a) {
      if (a = Hr(a), a) {
        const s = O.findKey(o, a);
        s && (!n || Ec(o, o[s], s, n)) && (delete o[s], r = !0);
      }
    }
    return O.isArray(t) ? t.forEach(i) : i(t), r;
  }
  clear(t) {
    const n = Object.keys(this);
    let o = n.length, r = !1;
    for (; o--; ) {
      const i = n[o];
      (!t || Ec(this, this[i], i, t, !0)) && (delete this[i], r = !0);
    }
    return r;
  }
  normalize(t) {
    const n = this, o = {};
    return O.forEach(this, (r, i) => {
      const a = O.findKey(o, i);
      if (a) {
        n[a] = Fi(r), delete n[i];
        return;
      }
      const s = t ? v0(i) : String(i).trim();
      s !== i && delete n[i], n[s] = Fi(r), o[s] = !0;
    }), this;
  }
  concat(...t) {
    return this.constructor.concat(this, ...t);
  }
  toJSON(t) {
    const n = /* @__PURE__ */ Object.create(null);
    return O.forEach(this, (o, r) => {
      o != null && o !== !1 && (n[r] = t && O.isArray(o) ? o.join(", ") : o);
    }), n;
  }
  [Symbol.iterator]() {
    return Object.entries(this.toJSON())[Symbol.iterator]();
  }
  toString() {
    return Object.entries(this.toJSON()).map(([t, n]) => t + ": " + n).join(`
`);
  }
  getSetCookie() {
    return this.get("set-cookie") || [];
  }
  get [Symbol.toStringTag]() {
    return "AxiosHeaders";
  }
  static from(t) {
    return t instanceof this ? t : new this(t);
  }
  static concat(t, ...n) {
    const o = new this(t);
    return n.forEach((r) => o.set(r)), o;
  }
  static accessor(t) {
    const o = (this[hm] = this[hm] = {
      accessors: {}
    }).accessors, r = this.prototype;
    function i(a) {
      const s = Hr(a);
      o[s] || (y0(r, a), o[s] = !0);
    }
    return O.isArray(t) ? t.forEach(i) : i(t), this;
  }
};
Da.accessor(["Content-Type", "Content-Length", "Accept", "Accept-Encoding", "User-Agent", "Authorization"]);
O.reduceDescriptors(Da.prototype, ({ value: e }, t) => {
  let n = t[0].toUpperCase() + t.slice(1);
  return {
    get: () => e,
    set(o) {
      this[n] = o;
    }
  };
});
O.freezeMethods(Da);
const wt = Da;
function Pc(e, t) {
  const n = this || Du, o = t || n, r = wt.from(o.headers);
  let i = o.data;
  return O.forEach(e, function(s) {
    i = s.call(n, i, r.normalize(), t ? t.status : void 0);
  }), r.normalize(), i;
}
function ag(e) {
  return !!(e && e.__CANCEL__);
}
function Dr(e, t, n) {
  ne.call(this, e ?? "canceled", ne.ERR_CANCELED, t, n), this.name = "CanceledError";
}
O.inherits(Dr, ne, {
  __CANCEL__: !0
});
function sg(e, t, n) {
  const o = n.config.validateStatus;
  !n.status || !o || o(n.status) ? e(n) : t(new ne(
    "Request failed with status code " + n.status,
    [ne.ERR_BAD_REQUEST, ne.ERR_BAD_RESPONSE][Math.floor(n.status / 100) - 4],
    n.config,
    n.request,
    n
  ));
}
function b0(e) {
  const t = /^([-+\w]{1,25})(:?\/\/|:)/.exec(e);
  return t && t[1] || "";
}
function w0(e, t) {
  e = e || 10;
  const n = new Array(e), o = new Array(e);
  let r = 0, i = 0, a;
  return t = t !== void 0 ? t : 1e3, function(c) {
    const u = Date.now(), l = o[i];
    a || (a = u), n[r] = c, o[r] = u;
    let d = i, f = 0;
    for (; d !== r; )
      f += n[d++], d = d % e;
    if (r = (r + 1) % e, r === i && (i = (i + 1) % e), u - a < t)
      return;
    const h = l && u - l;
    return h ? Math.round(f * 1e3 / h) : void 0;
  };
}
function _0(e, t) {
  let n = 0, o = 1e3 / t, r, i;
  const a = (u, l = Date.now()) => {
    n = l, r = null, i && (clearTimeout(i), i = null), e(...u);
  };
  return [(...u) => {
    const l = Date.now(), d = l - n;
    d >= o ? a(u, l) : (r = u, i || (i = setTimeout(() => {
      i = null, a(r);
    }, o - d)));
  }, () => r && a(r)];
}
const qi = (e, t, n = 3) => {
  let o = 0;
  const r = w0(50, 250);
  return _0((i) => {
    const a = i.loaded, s = i.lengthComputable ? i.total : void 0, c = a - o, u = r(c), l = a <= s;
    o = a;
    const d = {
      loaded: a,
      total: s,
      progress: s ? a / s : void 0,
      bytes: c,
      rate: u || void 0,
      estimated: u && s && l ? (s - a) / u : void 0,
      event: i,
      lengthComputable: s != null,
      [t ? "download" : "upload"]: !0
    };
    e(d);
  }, n);
}, gm = (e, t) => {
  const n = e != null;
  return [(o) => t[0]({
    lengthComputable: n,
    total: e,
    loaded: o
  }), t[1]];
}, pm = (e) => (...t) => O.asap(() => e(...t)), $0 = Fe.hasStandardBrowserEnv ? ((e, t) => (n) => (n = new URL(n, Fe.origin), e.protocol === n.protocol && e.host === n.host && (t || e.port === n.port)))(
  new URL(Fe.origin),
  Fe.navigator && /(msie|trident)/i.test(Fe.navigator.userAgent)
) : () => !0, k0 = Fe.hasStandardBrowserEnv ? (
  // Standard browser envs support document.cookie
  {
    write(e, t, n, o, r, i, a) {
      if (typeof document > "u")
        return;
      const s = [`${e}=${encodeURIComponent(t)}`];
      O.isNumber(n) && s.push(`expires=${new Date(n).toUTCString()}`), O.isString(o) && s.push(`path=${o}`), O.isString(r) && s.push(`domain=${r}`), i === !0 && s.push("secure"), O.isString(a) && s.push(`SameSite=${a}`), document.cookie = s.join("; ");
    },
    read(e) {
      if (typeof document > "u")
        return null;
      const t = document.cookie.match(new RegExp("(?:^|; )" + e + "=([^;]*)"));
      return t ? decodeURIComponent(t[1]) : null;
    },
    remove(e) {
      this.write(e, "", Date.now() - 864e5, "/");
    }
  }
) : (
  // Non-standard browser env (web workers, react-native) lack needed support.
  {
    write() {
    },
    read() {
      return null;
    },
    remove() {
    }
  }
);
function x0(e) {
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(e);
}
function S0(e, t) {
  return t ? e.replace(/\/?\/$/, "") + "/" + t.replace(/^\/+/, "") : e;
}
function cg(e, t, n) {
  let o = !x0(t);
  return e && (o || n == !1) ? S0(e, t) : t;
}
const vm = (e) => e instanceof wt ? { ...e } : e;
function zn(e, t) {
  t = t || {};
  const n = {};
  function o(u, l, d, f) {
    return O.isPlainObject(u) && O.isPlainObject(l) ? O.merge.call({ caseless: f }, u, l) : O.isPlainObject(l) ? O.merge({}, l) : O.isArray(l) ? l.slice() : l;
  }
  function r(u, l, d, f) {
    if (O.isUndefined(l)) {
      if (!O.isUndefined(u))
        return o(void 0, u, d, f);
    } else
      return o(u, l, d, f);
  }
  function i(u, l) {
    if (!O.isUndefined(l))
      return o(void 0, l);
  }
  function a(u, l) {
    if (O.isUndefined(l)) {
      if (!O.isUndefined(u))
        return o(void 0, u);
    } else
      return o(void 0, l);
  }
  function s(u, l, d) {
    if (d in t)
      return o(u, l);
    if (d in e)
      return o(void 0, u);
  }
  const c = {
    url: i,
    method: i,
    data: i,
    baseURL: a,
    transformRequest: a,
    transformResponse: a,
    paramsSerializer: a,
    timeout: a,
    timeoutMessage: a,
    withCredentials: a,
    withXSRFToken: a,
    adapter: a,
    responseType: a,
    xsrfCookieName: a,
    xsrfHeaderName: a,
    onUploadProgress: a,
    onDownloadProgress: a,
    decompress: a,
    maxContentLength: a,
    maxBodyLength: a,
    beforeRedirect: a,
    transport: a,
    httpAgent: a,
    httpsAgent: a,
    cancelToken: a,
    socketPath: a,
    responseEncoding: a,
    validateStatus: s,
    headers: (u, l, d) => r(vm(u), vm(l), d, !0)
  };
  return O.forEach(Object.keys({ ...e, ...t }), function(l) {
    const d = c[l] || r, f = d(e[l], t[l], l);
    O.isUndefined(f) && d !== s || (n[l] = f);
  }), n;
}
const ug = (e) => {
  const t = zn({}, e);
  let { data: n, withXSRFToken: o, xsrfHeaderName: r, xsrfCookieName: i, headers: a, auth: s } = t;
  if (t.headers = a = wt.from(a), t.url = rg(cg(t.baseURL, t.url, t.allowAbsoluteUrls), e.params, e.paramsSerializer), s && a.set(
    "Authorization",
    "Basic " + btoa((s.username || "") + ":" + (s.password ? unescape(encodeURIComponent(s.password)) : ""))
  ), O.isFormData(n)) {
    if (Fe.hasStandardBrowserEnv || Fe.hasStandardBrowserWebWorkerEnv)
      a.setContentType(void 0);
    else if (O.isFunction(n.getHeaders)) {
      const c = n.getHeaders(), u = ["content-type", "content-length"];
      Object.entries(c).forEach(([l, d]) => {
        u.includes(l.toLowerCase()) && a.set(l, d);
      });
    }
  }
  if (Fe.hasStandardBrowserEnv && (o && O.isFunction(o) && (o = o(t)), o || o !== !1 && $0(t.url))) {
    const c = r && i && k0.read(i);
    c && a.set(r, c);
  }
  return t;
}, D0 = typeof XMLHttpRequest < "u", O0 = D0 && function(e) {
  return new Promise(function(n, o) {
    const r = ug(e);
    let i = r.data;
    const a = wt.from(r.headers).normalize();
    let { responseType: s, onUploadProgress: c, onDownloadProgress: u } = r, l, d, f, h, g;
    function p() {
      h && h(), g && g(), r.cancelToken && r.cancelToken.unsubscribe(l), r.signal && r.signal.removeEventListener("abort", l);
    }
    let v = new XMLHttpRequest();
    v.open(r.method.toUpperCase(), r.url, !0), v.timeout = r.timeout;
    function b() {
      if (!v)
        return;
      const $ = wt.from(
        "getAllResponseHeaders" in v && v.getAllResponseHeaders()
      ), S = {
        data: !s || s === "text" || s === "json" ? v.responseText : v.response,
        status: v.status,
        statusText: v.statusText,
        headers: $,
        config: e,
        request: v
      };
      sg(function(I) {
        n(I), p();
      }, function(I) {
        o(I), p();
      }, S), v = null;
    }
    "onloadend" in v ? v.onloadend = b : v.onreadystatechange = function() {
      !v || v.readyState !== 4 || v.status === 0 && !(v.responseURL && v.responseURL.indexOf("file:") === 0) || setTimeout(b);
    }, v.onabort = function() {
      v && (o(new ne("Request aborted", ne.ECONNABORTED, e, v)), v = null);
    }, v.onerror = function(x) {
      const S = x && x.message ? x.message : "Network Error", w = new ne(S, ne.ERR_NETWORK, e, v);
      w.event = x || null, o(w), v = null;
    }, v.ontimeout = function() {
      let x = r.timeout ? "timeout of " + r.timeout + "ms exceeded" : "timeout exceeded";
      const S = r.transitional || og;
      r.timeoutErrorMessage && (x = r.timeoutErrorMessage), o(new ne(
        x,
        S.clarifyTimeoutError ? ne.ETIMEDOUT : ne.ECONNABORTED,
        e,
        v
      )), v = null;
    }, i === void 0 && a.setContentType(null), "setRequestHeader" in v && O.forEach(a.toJSON(), function(x, S) {
      v.setRequestHeader(S, x);
    }), O.isUndefined(r.withCredentials) || (v.withCredentials = !!r.withCredentials), s && s !== "json" && (v.responseType = r.responseType), u && ([f, g] = qi(u, !0), v.addEventListener("progress", f)), c && v.upload && ([d, h] = qi(c), v.upload.addEventListener("progress", d), v.upload.addEventListener("loadend", h)), (r.cancelToken || r.signal) && (l = ($) => {
      v && (o(!$ || $.type ? new Dr(null, e, v) : $), v.abort(), v = null);
    }, r.cancelToken && r.cancelToken.subscribe(l), r.signal && (r.signal.aborted ? l() : r.signal.addEventListener("abort", l)));
    const _ = b0(r.url);
    if (_ && Fe.protocols.indexOf(_) === -1) {
      o(new ne("Unsupported protocol " + _ + ":", ne.ERR_BAD_REQUEST, e));
      return;
    }
    v.send(i || null);
  });
}, I0 = (e, t) => {
  const { length: n } = e = e ? e.filter(Boolean) : [];
  if (t || n) {
    let o = new AbortController(), r;
    const i = function(u) {
      if (!r) {
        r = !0, s();
        const l = u instanceof Error ? u : this.reason;
        o.abort(l instanceof ne ? l : new Dr(l instanceof Error ? l.message : l));
      }
    };
    let a = t && setTimeout(() => {
      a = null, i(new ne(`timeout ${t} of ms exceeded`, ne.ETIMEDOUT));
    }, t);
    const s = () => {
      e && (a && clearTimeout(a), a = null, e.forEach((u) => {
        u.unsubscribe ? u.unsubscribe(i) : u.removeEventListener("abort", i);
      }), e = null);
    };
    e.forEach((u) => u.addEventListener("abort", i));
    const { signal: c } = o;
    return c.unsubscribe = () => O.asap(s), c;
  }
}, N0 = I0, E0 = function* (e, t) {
  let n = e.byteLength;
  if (!t || n < t) {
    yield e;
    return;
  }
  let o = 0, r;
  for (; o < n; )
    r = o + t, yield e.slice(o, r), o = r;
}, P0 = async function* (e, t) {
  for await (const n of T0(e))
    yield* E0(n, t);
}, T0 = async function* (e) {
  if (e[Symbol.asyncIterator]) {
    yield* e;
    return;
  }
  const t = e.getReader();
  try {
    for (; ; ) {
      const { done: n, value: o } = await t.read();
      if (n)
        break;
      yield o;
    }
  } finally {
    await t.cancel();
  }
}, ym = (e, t, n, o) => {
  const r = P0(e, t);
  let i = 0, a, s = (c) => {
    a || (a = !0, o && o(c));
  };
  return new ReadableStream({
    async pull(c) {
      try {
        const { done: u, value: l } = await r.next();
        if (u) {
          s(), c.close();
          return;
        }
        let d = l.byteLength;
        if (n) {
          let f = i += d;
          n(f);
        }
        c.enqueue(new Uint8Array(l));
      } catch (u) {
        throw s(u), u;
      }
    },
    cancel(c) {
      return s(c), r.return();
    }
  }, {
    highWaterMark: 2
  });
}, bm = 64 * 1024, { isFunction: ki } = O, C0 = (({ Request: e, Response: t }) => ({
  Request: e,
  Response: t
}))(O.global), {
  ReadableStream: wm,
  TextEncoder: _m
} = O.global, $m = (e, ...t) => {
  try {
    return !!e(...t);
  } catch {
    return !1;
  }
}, M0 = (e) => {
  e = O.merge.call({
    skipUndefined: !0
  }, C0, e);
  const { fetch: t, Request: n, Response: o } = e, r = t ? ki(t) : typeof fetch == "function", i = ki(n), a = ki(o);
  if (!r)
    return !1;
  const s = r && ki(wm), c = r && (typeof _m == "function" ? ((g) => (p) => g.encode(p))(new _m()) : async (g) => new Uint8Array(await new n(g).arrayBuffer())), u = i && s && $m(() => {
    let g = !1;
    const p = new n(Fe.origin, {
      body: new wm(),
      method: "POST",
      get duplex() {
        return g = !0, "half";
      }
    }).headers.has("Content-Type");
    return g && !p;
  }), l = a && s && $m(() => O.isReadableStream(new o("").body)), d = {
    stream: l && ((g) => g.body)
  };
  r && ["text", "arrayBuffer", "blob", "formData", "stream"].forEach((g) => {
    !d[g] && (d[g] = (p, v) => {
      let b = p && p[g];
      if (b)
        return b.call(p);
      throw new ne(`Response type '${g}' is not supported`, ne.ERR_NOT_SUPPORT, v);
    });
  });
  const f = async (g) => {
    if (g == null)
      return 0;
    if (O.isBlob(g))
      return g.size;
    if (O.isSpecCompliantForm(g))
      return (await new n(Fe.origin, {
        method: "POST",
        body: g
      }).arrayBuffer()).byteLength;
    if (O.isArrayBufferView(g) || O.isArrayBuffer(g))
      return g.byteLength;
    if (O.isURLSearchParams(g) && (g = g + ""), O.isString(g))
      return (await c(g)).byteLength;
  }, h = async (g, p) => {
    const v = O.toFiniteNumber(g.getContentLength());
    return v ?? f(p);
  };
  return async (g) => {
    let {
      url: p,
      method: v,
      data: b,
      signal: _,
      cancelToken: $,
      timeout: x,
      onDownloadProgress: S,
      onUploadProgress: w,
      responseType: I,
      headers: D,
      withCredentials: P = "same-origin",
      fetchOptions: M
    } = ug(g), B = t || fetch;
    I = I ? (I + "").toLowerCase() : "text";
    let K = N0([_, $ && $.toAbortSignal()], x), Q = null;
    const V = K && K.unsubscribe && (() => {
      K.unsubscribe();
    });
    let ue;
    try {
      if (w && u && v !== "get" && v !== "head" && (ue = await h(D, b)) !== 0) {
        let se = new n(p, {
          method: "POST",
          body: b,
          duplex: "half"
        }), ke;
        if (O.isFormData(b) && (ke = se.headers.get("content-type")) && D.setContentType(ke), se.body) {
          const [me, pe] = gm(
            ue,
            qi(pm(w))
          );
          b = ym(se.body, bm, me, pe);
        }
      }
      O.isString(P) || (P = P ? "include" : "omit");
      const H = i && "credentials" in n.prototype, ce = {
        ...M,
        signal: K,
        method: v.toUpperCase(),
        headers: D.normalize().toJSON(),
        body: b,
        duplex: "half",
        credentials: H ? P : void 0
      };
      Q = i && new n(p, ce);
      let T = await (i ? B(Q, M) : B(p, ce));
      const A = l && (I === "stream" || I === "response");
      if (l && (S || A && V)) {
        const se = {};
        ["status", "statusText", "headers"].forEach((ze) => {
          se[ze] = T[ze];
        });
        const ke = O.toFiniteNumber(T.headers.get("content-length")), [me, pe] = S && gm(
          ke,
          qi(pm(S), !0)
        ) || [];
        T = new o(
          ym(T.body, bm, me, () => {
            pe && pe(), V && V();
          }),
          se
        );
      }
      I = I || "text";
      let oe = await d[O.findKey(d, I) || "text"](T, g);
      return !A && V && V(), await new Promise((se, ke) => {
        sg(se, ke, {
          data: oe,
          headers: wt.from(T.headers),
          status: T.status,
          statusText: T.statusText,
          config: g,
          request: Q
        });
      });
    } catch (H) {
      throw V && V(), H && H.name === "TypeError" && /Load failed|fetch/i.test(H.message) ? Object.assign(
        new ne("Network Error", ne.ERR_NETWORK, g, Q),
        {
          cause: H.cause || H
        }
      ) : ne.from(H, H && H.code, g, Q);
    }
  };
}, z0 = /* @__PURE__ */ new Map(), lg = (e) => {
  let t = e && e.env || {};
  const { fetch: n, Request: o, Response: r } = t, i = [
    o,
    r,
    n
  ];
  let a = i.length, s = a, c, u, l = z0;
  for (; s--; )
    c = i[s], u = l.get(c), u === void 0 && l.set(c, u = s ? /* @__PURE__ */ new Map() : M0(t)), l = u;
  return u;
};
lg();
const Ou = {
  http: JS,
  xhr: O0,
  fetch: {
    get: lg
  }
};
O.forEach(Ou, (e, t) => {
  if (e) {
    try {
      Object.defineProperty(e, "name", { value: t });
    } catch {
    }
    Object.defineProperty(e, "adapterName", { value: t });
  }
});
const km = (e) => `- ${e}`, R0 = (e) => O.isFunction(e) || e === null || e === !1;
function A0(e, t) {
  e = O.isArray(e) ? e : [e];
  const { length: n } = e;
  let o, r;
  const i = {};
  for (let a = 0; a < n; a++) {
    o = e[a];
    let s;
    if (r = o, !R0(o) && (r = Ou[(s = String(o)).toLowerCase()], r === void 0))
      throw new ne(`Unknown adapter '${s}'`);
    if (r && (O.isFunction(r) || (r = r.get(t))))
      break;
    i[s || "#" + a] = r;
  }
  if (!r) {
    const a = Object.entries(i).map(
      ([c, u]) => `adapter ${c} ` + (u === !1 ? "is not supported by the environment" : "is not available in the build")
    );
    let s = n ? a.length > 1 ? `since :
` + a.map(km).join(`
`) : " " + km(a[0]) : "as no adapter specified";
    throw new ne(
      "There is no suitable adapter to dispatch the request " + s,
      "ERR_NOT_SUPPORT"
    );
  }
  return r;
}
const dg = {
  /**
   * Resolve an adapter from a list of adapter names or functions.
   * @type {Function}
   */
  getAdapter: A0,
  /**
   * Exposes all known adapters
   * @type {Object<string, Function|Object>}
   */
  adapters: Ou
};
function Tc(e) {
  if (e.cancelToken && e.cancelToken.throwIfRequested(), e.signal && e.signal.aborted)
    throw new Dr(null, e);
}
function xm(e) {
  return Tc(e), e.headers = wt.from(e.headers), e.data = Pc.call(
    e,
    e.transformRequest
  ), ["post", "put", "patch"].indexOf(e.method) !== -1 && e.headers.setContentType("application/x-www-form-urlencoded", !1), dg.getAdapter(e.adapter || Du.adapter, e)(e).then(function(o) {
    return Tc(e), o.data = Pc.call(
      e,
      e.transformResponse,
      o
    ), o.headers = wt.from(o.headers), o;
  }, function(o) {
    return ag(o) || (Tc(e), o && o.response && (o.response.data = Pc.call(
      e,
      e.transformResponse,
      o.response
    ), o.response.headers = wt.from(o.response.headers))), Promise.reject(o);
  });
}
const fg = "1.13.2", Oa = {};
["object", "boolean", "number", "function", "string", "symbol"].forEach((e, t) => {
  Oa[e] = function(o) {
    return typeof o === e || "a" + (t < 1 ? "n " : " ") + e;
  };
});
const Sm = {};
Oa.transitional = function(t, n, o) {
  function r(i, a) {
    return "[Axios v" + fg + "] Transitional option '" + i + "'" + a + (o ? ". " + o : "");
  }
  return (i, a, s) => {
    if (t === !1)
      throw new ne(
        r(a, " has been removed" + (n ? " in " + n : "")),
        ne.ERR_DEPRECATED
      );
    return n && !Sm[a] && (Sm[a] = !0, console.warn(
      r(
        a,
        " has been deprecated since v" + n + " and will be removed in the near future"
      )
    )), t ? t(i, a, s) : !0;
  };
};
Oa.spelling = function(t) {
  return (n, o) => (console.warn(`${o} is likely a misspelling of ${t}`), !0);
};
function U0(e, t, n) {
  if (typeof e != "object")
    throw new ne("options must be an object", ne.ERR_BAD_OPTION_VALUE);
  const o = Object.keys(e);
  let r = o.length;
  for (; r-- > 0; ) {
    const i = o[r], a = t[i];
    if (a) {
      const s = e[i], c = s === void 0 || a(s, i, e);
      if (c !== !0)
        throw new ne("option " + i + " must be " + c, ne.ERR_BAD_OPTION_VALUE);
      continue;
    }
    if (n !== !0)
      throw new ne("Unknown option " + i, ne.ERR_BAD_OPTION);
  }
}
const Wi = {
  assertOptions: U0,
  validators: Oa
}, It = Wi.validators;
let Ji = class {
  constructor(t) {
    this.defaults = t || {}, this.interceptors = {
      request: new mm(),
      response: new mm()
    };
  }
  /**
   * Dispatch a request
   *
   * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
   * @param {?Object} config
   *
   * @returns {Promise} The Promise to be fulfilled
   */
  async request(t, n) {
    try {
      return await this._request(t, n);
    } catch (o) {
      if (o instanceof Error) {
        let r = {};
        Error.captureStackTrace ? Error.captureStackTrace(r) : r = new Error();
        const i = r.stack ? r.stack.replace(/^.+\n/, "") : "";
        try {
          o.stack ? i && !String(o.stack).endsWith(i.replace(/^.+\n.+\n/, "")) && (o.stack += `
` + i) : o.stack = i;
        } catch {
        }
      }
      throw o;
    }
  }
  _request(t, n) {
    typeof t == "string" ? (n = n || {}, n.url = t) : n = t || {}, n = zn(this.defaults, n);
    const { transitional: o, paramsSerializer: r, headers: i } = n;
    o !== void 0 && Wi.assertOptions(o, {
      silentJSONParsing: It.transitional(It.boolean),
      forcedJSONParsing: It.transitional(It.boolean),
      clarifyTimeoutError: It.transitional(It.boolean)
    }, !1), r != null && (O.isFunction(r) ? n.paramsSerializer = {
      serialize: r
    } : Wi.assertOptions(r, {
      encode: It.function,
      serialize: It.function
    }, !0)), n.allowAbsoluteUrls !== void 0 || (this.defaults.allowAbsoluteUrls !== void 0 ? n.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls : n.allowAbsoluteUrls = !0), Wi.assertOptions(n, {
      baseUrl: It.spelling("baseURL"),
      withXsrfToken: It.spelling("withXSRFToken")
    }, !0), n.method = (n.method || this.defaults.method || "get").toLowerCase();
    let a = i && O.merge(
      i.common,
      i[n.method]
    );
    i && O.forEach(
      ["delete", "get", "head", "post", "put", "patch", "common"],
      (g) => {
        delete i[g];
      }
    ), n.headers = wt.concat(a, i);
    const s = [];
    let c = !0;
    this.interceptors.request.forEach(function(p) {
      typeof p.runWhen == "function" && p.runWhen(n) === !1 || (c = c && p.synchronous, s.unshift(p.fulfilled, p.rejected));
    });
    const u = [];
    this.interceptors.response.forEach(function(p) {
      u.push(p.fulfilled, p.rejected);
    });
    let l, d = 0, f;
    if (!c) {
      const g = [xm.bind(this), void 0];
      for (g.unshift(...s), g.push(...u), f = g.length, l = Promise.resolve(n); d < f; )
        l = l.then(g[d++], g[d++]);
      return l;
    }
    f = s.length;
    let h = n;
    for (; d < f; ) {
      const g = s[d++], p = s[d++];
      try {
        h = g(h);
      } catch (v) {
        p.call(this, v);
        break;
      }
    }
    try {
      l = xm.call(this, h);
    } catch (g) {
      return Promise.reject(g);
    }
    for (d = 0, f = u.length; d < f; )
      l = l.then(u[d++], u[d++]);
    return l;
  }
  getUri(t) {
    t = zn(this.defaults, t);
    const n = cg(t.baseURL, t.url, t.allowAbsoluteUrls);
    return rg(n, t.params, t.paramsSerializer);
  }
};
O.forEach(["delete", "get", "head", "options"], function(t) {
  Ji.prototype[t] = function(n, o) {
    return this.request(zn(o || {}, {
      method: t,
      url: n,
      data: (o || {}).data
    }));
  };
});
O.forEach(["post", "put", "patch"], function(t) {
  function n(o) {
    return function(i, a, s) {
      return this.request(zn(s || {}, {
        method: t,
        headers: o ? {
          "Content-Type": "multipart/form-data"
        } : {},
        url: i,
        data: a
      }));
    };
  }
  Ji.prototype[t] = n(), Ji.prototype[t + "Form"] = n(!0);
});
const Li = Ji;
let j0 = class mg {
  constructor(t) {
    if (typeof t != "function")
      throw new TypeError("executor must be a function.");
    let n;
    this.promise = new Promise(function(i) {
      n = i;
    });
    const o = this;
    this.promise.then((r) => {
      if (!o._listeners)
        return;
      let i = o._listeners.length;
      for (; i-- > 0; )
        o._listeners[i](r);
      o._listeners = null;
    }), this.promise.then = (r) => {
      let i;
      const a = new Promise((s) => {
        o.subscribe(s), i = s;
      }).then(r);
      return a.cancel = function() {
        o.unsubscribe(i);
      }, a;
    }, t(function(i, a, s) {
      o.reason || (o.reason = new Dr(i, a, s), n(o.reason));
    });
  }
  /**
   * Throws a `CanceledError` if cancellation has been requested.
   */
  throwIfRequested() {
    if (this.reason)
      throw this.reason;
  }
  /**
   * Subscribe to the cancel signal
   */
  subscribe(t) {
    if (this.reason) {
      t(this.reason);
      return;
    }
    this._listeners ? this._listeners.push(t) : this._listeners = [t];
  }
  /**
   * Unsubscribe from the cancel signal
   */
  unsubscribe(t) {
    if (!this._listeners)
      return;
    const n = this._listeners.indexOf(t);
    n !== -1 && this._listeners.splice(n, 1);
  }
  toAbortSignal() {
    const t = new AbortController(), n = (o) => {
      t.abort(o);
    };
    return this.subscribe(n), t.signal.unsubscribe = () => this.unsubscribe(n), t.signal;
  }
  /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */
  static source() {
    let t;
    return {
      token: new mg(function(r) {
        t = r;
      }),
      cancel: t
    };
  }
};
const F0 = j0;
function W0(e) {
  return function(n) {
    return e.apply(null, n);
  };
}
function L0(e) {
  return O.isObject(e) && e.isAxiosError === !0;
}
const eu = {
  Continue: 100,
  SwitchingProtocols: 101,
  Processing: 102,
  EarlyHints: 103,
  Ok: 200,
  Created: 201,
  Accepted: 202,
  NonAuthoritativeInformation: 203,
  NoContent: 204,
  ResetContent: 205,
  PartialContent: 206,
  MultiStatus: 207,
  AlreadyReported: 208,
  ImUsed: 226,
  MultipleChoices: 300,
  MovedPermanently: 301,
  Found: 302,
  SeeOther: 303,
  NotModified: 304,
  UseProxy: 305,
  Unused: 306,
  TemporaryRedirect: 307,
  PermanentRedirect: 308,
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  NotAcceptable: 406,
  ProxyAuthenticationRequired: 407,
  RequestTimeout: 408,
  Conflict: 409,
  Gone: 410,
  LengthRequired: 411,
  PreconditionFailed: 412,
  PayloadTooLarge: 413,
  UriTooLong: 414,
  UnsupportedMediaType: 415,
  RangeNotSatisfiable: 416,
  ExpectationFailed: 417,
  ImATeapot: 418,
  MisdirectedRequest: 421,
  UnprocessableEntity: 422,
  Locked: 423,
  FailedDependency: 424,
  TooEarly: 425,
  UpgradeRequired: 426,
  PreconditionRequired: 428,
  TooManyRequests: 429,
  RequestHeaderFieldsTooLarge: 431,
  UnavailableForLegalReasons: 451,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
  HttpVersionNotSupported: 505,
  VariantAlsoNegotiates: 506,
  InsufficientStorage: 507,
  LoopDetected: 508,
  NotExtended: 510,
  NetworkAuthenticationRequired: 511,
  WebServerIsDown: 521,
  ConnectionTimedOut: 522,
  OriginIsUnreachable: 523,
  TimeoutOccurred: 524,
  SslHandshakeFailed: 525,
  InvalidSslCertificate: 526
};
Object.entries(eu).forEach(([e, t]) => {
  eu[t] = e;
});
const Z0 = eu;
function hg(e) {
  const t = new Li(e), n = Bh(Li.prototype.request, t);
  return O.extend(n, Li.prototype, t, { allOwnKeys: !0 }), O.extend(n, t, null, { allOwnKeys: !0 }), n.create = function(r) {
    return hg(zn(e, r));
  }, n;
}
const Pe = hg(Du);
Pe.Axios = Li;
Pe.CanceledError = Dr;
Pe.CancelToken = F0;
Pe.isCancel = ag;
Pe.VERSION = fg;
Pe.toFormData = Sa;
Pe.AxiosError = ne;
Pe.Cancel = Pe.CanceledError;
Pe.all = function(t) {
  return Promise.all(t);
};
Pe.spread = W0;
Pe.isAxiosError = L0;
Pe.mergeConfig = zn;
Pe.AxiosHeaders = wt;
Pe.formToJSON = (e) => ig(O.isHTMLForm(e) ? new FormData(e) : e);
Pe.getAdapter = dg.getAdapter;
Pe.HttpStatusCode = Z0;
Pe.default = Pe;
const gg = Pe, {
  Axios: zF,
  AxiosError: RF,
  CanceledError: AF,
  isCancel: UF,
  CancelToken: jF,
  VERSION: FF,
  all: WF,
  Cancel: LF,
  isAxiosError: ZF,
  spread: YF,
  toFormData: BF,
  AxiosHeaders: HF,
  HttpStatusCode: GF,
  formToJSON: VF,
  getAdapter: qF,
  mergeConfig: JF
} = gg;
function pg(e) {
  var t, n, o = "";
  if (typeof e == "string" || typeof e == "number")
    o += e;
  else if (typeof e == "object")
    if (Array.isArray(e)) {
      var r = e.length;
      for (t = 0; t < r; t++)
        e[t] && (n = pg(e[t])) && (o && (o += " "), o += n);
    } else
      for (n in e)
        e[n] && (o && (o += " "), o += n);
  return o;
}
function Iu() {
  for (var e, t, n = 0, o = "", r = arguments.length; n < r; n++)
    (e = arguments[n]) && (t = pg(e)) && (o && (o += " "), o += t);
  return o;
}
const Y0 = (e, t) => {
  const n = new Array(e.length + t.length);
  for (let o = 0; o < e.length; o++)
    n[o] = e[o];
  for (let o = 0; o < t.length; o++)
    n[e.length + o] = t[o];
  return n;
}, B0 = (e, t) => ({
  classGroupId: e,
  validator: t
}), vg = (e = /* @__PURE__ */ new Map(), t = null, n) => ({
  nextPart: e,
  validators: t,
  classGroupId: n
}), Ki = "-", Dm = [], H0 = "arbitrary..", G0 = (e) => {
  const t = q0(e), {
    conflictingClassGroups: n,
    conflictingClassGroupModifiers: o
  } = e;
  return {
    getClassGroupId: (a) => {
      if (a.startsWith("[") && a.endsWith("]"))
        return V0(a);
      const s = a.split(Ki), c = s[0] === "" && s.length > 1 ? 1 : 0;
      return yg(s, c, t);
    },
    getConflictingClassGroupIds: (a, s) => {
      if (s) {
        const c = o[a], u = n[a];
        return c ? u ? Y0(u, c) : c : u || Dm;
      }
      return n[a] || Dm;
    }
  };
}, yg = (e, t, n) => {
  if (e.length - t === 0)
    return n.classGroupId;
  const r = e[t], i = n.nextPart.get(r);
  if (i) {
    const u = yg(e, t + 1, i);
    if (u)
      return u;
  }
  const a = n.validators;
  if (a === null)
    return;
  const s = t === 0 ? e.join(Ki) : e.slice(t).join(Ki), c = a.length;
  for (let u = 0; u < c; u++) {
    const l = a[u];
    if (l.validator(s))
      return l.classGroupId;
  }
}, V0 = (e) => e.slice(1, -1).indexOf(":") === -1 ? void 0 : (() => {
  const t = e.slice(1, -1), n = t.indexOf(":"), o = t.slice(0, n);
  return o ? H0 + o : void 0;
})(), q0 = (e) => {
  const {
    theme: t,
    classGroups: n
  } = e;
  return J0(n, t);
}, J0 = (e, t) => {
  const n = vg();
  for (const o in e) {
    const r = e[o];
    Nu(r, n, o, t);
  }
  return n;
}, Nu = (e, t, n, o) => {
  const r = e.length;
  for (let i = 0; i < r; i++) {
    const a = e[i];
    K0(a, t, n, o);
  }
}, K0 = (e, t, n, o) => {
  if (typeof e == "string") {
    X0(e, t, n);
    return;
  }
  if (typeof e == "function") {
    Q0(e, t, n, o);
    return;
  }
  eD(e, t, n, o);
}, X0 = (e, t, n) => {
  const o = e === "" ? t : bg(t, e);
  o.classGroupId = n;
}, Q0 = (e, t, n, o) => {
  if (tD(e)) {
    Nu(e(o), t, n, o);
    return;
  }
  t.validators === null && (t.validators = []), t.validators.push(B0(n, e));
}, eD = (e, t, n, o) => {
  const r = Object.entries(e), i = r.length;
  for (let a = 0; a < i; a++) {
    const [s, c] = r[a];
    Nu(c, bg(t, s), n, o);
  }
}, bg = (e, t) => {
  let n = e;
  const o = t.split(Ki), r = o.length;
  for (let i = 0; i < r; i++) {
    const a = o[i];
    let s = n.nextPart.get(a);
    s || (s = vg(), n.nextPart.set(a, s)), n = s;
  }
  return n;
}, tD = (e) => "isThemeGetter" in e && e.isThemeGetter === !0, nD = (e) => {
  if (e < 1)
    return {
      get: () => {
      },
      set: () => {
      }
    };
  let t = 0, n = /* @__PURE__ */ Object.create(null), o = /* @__PURE__ */ Object.create(null);
  const r = (i, a) => {
    n[i] = a, t++, t > e && (t = 0, o = n, n = /* @__PURE__ */ Object.create(null));
  };
  return {
    get(i) {
      let a = n[i];
      if (a !== void 0)
        return a;
      if ((a = o[i]) !== void 0)
        return r(i, a), a;
    },
    set(i, a) {
      i in n ? n[i] = a : r(i, a);
    }
  };
}, tu = "!", Om = ":", rD = [], Im = (e, t, n, o, r) => ({
  modifiers: e,
  hasImportantModifier: t,
  baseClassName: n,
  maybePostfixModifierPosition: o,
  isExternal: r
}), oD = (e) => {
  const {
    prefix: t,
    experimentalParseClassName: n
  } = e;
  let o = (r) => {
    const i = [];
    let a = 0, s = 0, c = 0, u;
    const l = r.length;
    for (let p = 0; p < l; p++) {
      const v = r[p];
      if (a === 0 && s === 0) {
        if (v === Om) {
          i.push(r.slice(c, p)), c = p + 1;
          continue;
        }
        if (v === "/") {
          u = p;
          continue;
        }
      }
      v === "[" ? a++ : v === "]" ? a-- : v === "(" ? s++ : v === ")" && s--;
    }
    const d = i.length === 0 ? r : r.slice(c);
    let f = d, h = !1;
    d.endsWith(tu) ? (f = d.slice(0, -1), h = !0) : (
      /**
       * In Tailwind CSS v3 the important modifier was at the start of the base class name. This is still supported for legacy reasons.
       * @see https://github.com/dcastil/tailwind-merge/issues/513#issuecomment-2614029864
       */
      d.startsWith(tu) && (f = d.slice(1), h = !0)
    );
    const g = u && u > c ? u - c : void 0;
    return Im(i, h, f, g);
  };
  if (t) {
    const r = t + Om, i = o;
    o = (a) => a.startsWith(r) ? i(a.slice(r.length)) : Im(rD, !1, a, void 0, !0);
  }
  if (n) {
    const r = o;
    o = (i) => n({
      className: i,
      parseClassName: r
    });
  }
  return o;
}, iD = (e) => {
  const t = /* @__PURE__ */ new Map();
  return e.orderSensitiveModifiers.forEach((n, o) => {
    t.set(n, 1e6 + o);
  }), (n) => {
    const o = [];
    let r = [];
    for (let i = 0; i < n.length; i++) {
      const a = n[i], s = a[0] === "[", c = t.has(a);
      s || c ? (r.length > 0 && (r.sort(), o.push(...r), r = []), o.push(a)) : r.push(a);
    }
    return r.length > 0 && (r.sort(), o.push(...r)), o;
  };
}, aD = (e) => ({
  cache: nD(e.cacheSize),
  parseClassName: oD(e),
  sortModifiers: iD(e),
  ...G0(e)
}), sD = /\s+/, cD = (e, t) => {
  const {
    parseClassName: n,
    getClassGroupId: o,
    getConflictingClassGroupIds: r,
    sortModifiers: i
  } = t, a = [], s = e.trim().split(sD);
  let c = "";
  for (let u = s.length - 1; u >= 0; u -= 1) {
    const l = s[u], {
      isExternal: d,
      modifiers: f,
      hasImportantModifier: h,
      baseClassName: g,
      maybePostfixModifierPosition: p
    } = n(l);
    if (d) {
      c = l + (c.length > 0 ? " " + c : c);
      continue;
    }
    let v = !!p, b = o(v ? g.substring(0, p) : g);
    if (!b) {
      if (!v) {
        c = l + (c.length > 0 ? " " + c : c);
        continue;
      }
      if (b = o(g), !b) {
        c = l + (c.length > 0 ? " " + c : c);
        continue;
      }
      v = !1;
    }
    const _ = f.length === 0 ? "" : f.length === 1 ? f[0] : i(f).join(":"), $ = h ? _ + tu : _, x = $ + b;
    if (a.indexOf(x) > -1)
      continue;
    a.push(x);
    const S = r(b, v);
    for (let w = 0; w < S.length; ++w) {
      const I = S[w];
      a.push($ + I);
    }
    c = l + (c.length > 0 ? " " + c : c);
  }
  return c;
}, uD = (...e) => {
  let t = 0, n, o, r = "";
  for (; t < e.length; )
    (n = e[t++]) && (o = wg(n)) && (r && (r += " "), r += o);
  return r;
}, wg = (e) => {
  if (typeof e == "string")
    return e;
  let t, n = "";
  for (let o = 0; o < e.length; o++)
    e[o] && (t = wg(e[o])) && (n && (n += " "), n += t);
  return n;
}, lD = (e, ...t) => {
  let n, o, r, i;
  const a = (c) => {
    const u = t.reduce((l, d) => d(l), e());
    return n = aD(u), o = n.cache.get, r = n.cache.set, i = s, s(c);
  }, s = (c) => {
    const u = o(c);
    if (u)
      return u;
    const l = cD(c, n);
    return r(c, l), l;
  };
  return i = a, (...c) => i(uD(...c));
}, dD = [], Ce = (e) => {
  const t = (n) => n[e] || dD;
  return t.isThemeGetter = !0, t;
}, _g = /^\[(?:(\w[\w-]*):)?(.+)\]$/i, $g = /^\((?:(\w[\w-]*):)?(.+)\)$/i, fD = /^\d+\/\d+$/, mD = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, hD = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, gD = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, pD = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, vD = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, qn = (e) => fD.test(e), ae = (e) => !!e && !Number.isNaN(Number(e)), dn = (e) => !!e && Number.isInteger(Number(e)), Cc = (e) => e.endsWith("%") && ae(e.slice(0, -1)), Gt = (e) => mD.test(e), yD = () => !0, bD = (e) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  hD.test(e) && !gD.test(e)
), kg = () => !1, wD = (e) => pD.test(e), _D = (e) => vD.test(e), $D = (e) => !F(e) && !W(e), kD = (e) => Or(e, Dg, kg), F = (e) => _g.test(e), In = (e) => Or(e, Og, bD), Mc = (e) => Or(e, ID, ae), Nm = (e) => Or(e, xg, kg), xD = (e) => Or(e, Sg, _D), xi = (e) => Or(e, Ig, wD), W = (e) => $g.test(e), Gr = (e) => Ir(e, Og), SD = (e) => Ir(e, ND), Em = (e) => Ir(e, xg), DD = (e) => Ir(e, Dg), OD = (e) => Ir(e, Sg), Si = (e) => Ir(e, Ig, !0), Or = (e, t, n) => {
  const o = _g.exec(e);
  return o ? o[1] ? t(o[1]) : n(o[2]) : !1;
}, Ir = (e, t, n = !1) => {
  const o = $g.exec(e);
  return o ? o[1] ? t(o[1]) : n : !1;
}, xg = (e) => e === "position" || e === "percentage", Sg = (e) => e === "image" || e === "url", Dg = (e) => e === "length" || e === "size" || e === "bg-size", Og = (e) => e === "length", ID = (e) => e === "number", ND = (e) => e === "family-name", Ig = (e) => e === "shadow", ED = () => {
  const e = Ce("color"), t = Ce("font"), n = Ce("text"), o = Ce("font-weight"), r = Ce("tracking"), i = Ce("leading"), a = Ce("breakpoint"), s = Ce("container"), c = Ce("spacing"), u = Ce("radius"), l = Ce("shadow"), d = Ce("inset-shadow"), f = Ce("text-shadow"), h = Ce("drop-shadow"), g = Ce("blur"), p = Ce("perspective"), v = Ce("aspect"), b = Ce("ease"), _ = Ce("animate"), $ = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], x = () => [
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
  ], S = () => [...x(), W, F], w = () => ["auto", "hidden", "clip", "visible", "scroll"], I = () => ["auto", "contain", "none"], D = () => [W, F, c], P = () => [qn, "full", "auto", ...D()], M = () => [dn, "none", "subgrid", W, F], B = () => ["auto", {
    span: ["full", dn, W, F]
  }, dn, W, F], K = () => [dn, "auto", W, F], Q = () => ["auto", "min", "max", "fr", W, F], V = () => ["start", "end", "center", "between", "around", "evenly", "stretch", "baseline", "center-safe", "end-safe"], ue = () => ["start", "end", "center", "stretch", "center-safe", "end-safe"], H = () => ["auto", ...D()], ce = () => [qn, "auto", "full", "dvw", "dvh", "lvw", "lvh", "svw", "svh", "min", "max", "fit", ...D()], T = () => [e, W, F], A = () => [...x(), Em, Nm, {
    position: [W, F]
  }], oe = () => ["no-repeat", {
    repeat: ["", "x", "y", "space", "round"]
  }], se = () => ["auto", "cover", "contain", DD, kD, {
    size: [W, F]
  }], ke = () => [Cc, Gr, In], me = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    "full",
    u,
    W,
    F
  ], pe = () => ["", ae, Gr, In], ze = () => ["solid", "dashed", "dotted", "double"], Xe = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], fe = () => [ae, Cc, Em, Nm], Ot = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    g,
    W,
    F
  ], Ee = () => ["none", ae, W, F], Ze = () => ["none", ae, W, F], ln = () => [ae, W, F], Ht = () => [qn, "full", ...D()];
  return {
    cacheSize: 500,
    theme: {
      animate: ["spin", "ping", "pulse", "bounce"],
      aspect: ["video"],
      blur: [Gt],
      breakpoint: [Gt],
      color: [yD],
      container: [Gt],
      "drop-shadow": [Gt],
      ease: ["in", "out", "in-out"],
      font: [$D],
      "font-weight": ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black"],
      "inset-shadow": [Gt],
      leading: ["none", "tight", "snug", "normal", "relaxed", "loose"],
      perspective: ["dramatic", "near", "normal", "midrange", "distant", "none"],
      radius: [Gt],
      shadow: [Gt],
      spacing: ["px", ae],
      text: [Gt],
      "text-shadow": [Gt],
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
        aspect: ["auto", "square", qn, F, W, v]
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
        columns: [ae, F, W, s]
      }],
      /**
       * Break After
       * @see https://tailwindcss.com/docs/break-after
       */
      "break-after": [{
        "break-after": $()
      }],
      /**
       * Break Before
       * @see https://tailwindcss.com/docs/break-before
       */
      "break-before": [{
        "break-before": $()
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
        object: S()
      }],
      /**
       * Overflow
       * @see https://tailwindcss.com/docs/overflow
       */
      overflow: [{
        overflow: w()
      }],
      /**
       * Overflow X
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-x": [{
        "overflow-x": w()
      }],
      /**
       * Overflow Y
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-y": [{
        "overflow-y": w()
      }],
      /**
       * Overscroll Behavior
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      overscroll: [{
        overscroll: I()
      }],
      /**
       * Overscroll Behavior X
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-x": [{
        "overscroll-x": I()
      }],
      /**
       * Overscroll Behavior Y
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-y": [{
        "overscroll-y": I()
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
        inset: P()
      }],
      /**
       * Right / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-x": [{
        "inset-x": P()
      }],
      /**
       * Top / Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-y": [{
        "inset-y": P()
      }],
      /**
       * Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      start: [{
        start: P()
      }],
      /**
       * End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      end: [{
        end: P()
      }],
      /**
       * Top
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      top: [{
        top: P()
      }],
      /**
       * Right
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      right: [{
        right: P()
      }],
      /**
       * Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      bottom: [{
        bottom: P()
      }],
      /**
       * Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      left: [{
        left: P()
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
        z: [dn, "auto", W, F]
      }],
      // ------------------------
      // --- Flexbox and Grid ---
      // ------------------------
      /**
       * Flex Basis
       * @see https://tailwindcss.com/docs/flex-basis
       */
      basis: [{
        basis: [qn, "full", "auto", s, ...D()]
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
        flex: [ae, qn, "auto", "initial", "none", F]
      }],
      /**
       * Flex Grow
       * @see https://tailwindcss.com/docs/flex-grow
       */
      grow: [{
        grow: ["", ae, W, F]
      }],
      /**
       * Flex Shrink
       * @see https://tailwindcss.com/docs/flex-shrink
       */
      shrink: [{
        shrink: ["", ae, W, F]
      }],
      /**
       * Order
       * @see https://tailwindcss.com/docs/order
       */
      order: [{
        order: [dn, "first", "last", "none", W, F]
      }],
      /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */
      "grid-cols": [{
        "grid-cols": M()
      }],
      /**
       * Grid Column Start / End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start-end": [{
        col: B()
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
        "grid-rows": M()
      }],
      /**
       * Grid Row Start / End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start-end": [{
        row: B()
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
        "auto-cols": Q()
      }],
      /**
       * Grid Auto Rows
       * @see https://tailwindcss.com/docs/grid-auto-rows
       */
      "auto-rows": [{
        "auto-rows": Q()
      }],
      /**
       * Gap
       * @see https://tailwindcss.com/docs/gap
       */
      gap: [{
        gap: D()
      }],
      /**
       * Gap X
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-x": [{
        "gap-x": D()
      }],
      /**
       * Gap Y
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-y": [{
        "gap-y": D()
      }],
      /**
       * Justify Content
       * @see https://tailwindcss.com/docs/justify-content
       */
      "justify-content": [{
        justify: [...V(), "normal"]
      }],
      /**
       * Justify Items
       * @see https://tailwindcss.com/docs/justify-items
       */
      "justify-items": [{
        "justify-items": [...ue(), "normal"]
      }],
      /**
       * Justify Self
       * @see https://tailwindcss.com/docs/justify-self
       */
      "justify-self": [{
        "justify-self": ["auto", ...ue()]
      }],
      /**
       * Align Content
       * @see https://tailwindcss.com/docs/align-content
       */
      "align-content": [{
        content: ["normal", ...V()]
      }],
      /**
       * Align Items
       * @see https://tailwindcss.com/docs/align-items
       */
      "align-items": [{
        items: [...ue(), {
          baseline: ["", "last"]
        }]
      }],
      /**
       * Align Self
       * @see https://tailwindcss.com/docs/align-self
       */
      "align-self": [{
        self: ["auto", ...ue(), {
          baseline: ["", "last"]
        }]
      }],
      /**
       * Place Content
       * @see https://tailwindcss.com/docs/place-content
       */
      "place-content": [{
        "place-content": V()
      }],
      /**
       * Place Items
       * @see https://tailwindcss.com/docs/place-items
       */
      "place-items": [{
        "place-items": [...ue(), "baseline"]
      }],
      /**
       * Place Self
       * @see https://tailwindcss.com/docs/place-self
       */
      "place-self": [{
        "place-self": ["auto", ...ue()]
      }],
      // Spacing
      /**
       * Padding
       * @see https://tailwindcss.com/docs/padding
       */
      p: [{
        p: D()
      }],
      /**
       * Padding X
       * @see https://tailwindcss.com/docs/padding
       */
      px: [{
        px: D()
      }],
      /**
       * Padding Y
       * @see https://tailwindcss.com/docs/padding
       */
      py: [{
        py: D()
      }],
      /**
       * Padding Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [{
        ps: D()
      }],
      /**
       * Padding End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [{
        pe: D()
      }],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [{
        pt: D()
      }],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [{
        pr: D()
      }],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [{
        pb: D()
      }],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [{
        pl: D()
      }],
      /**
       * Margin
       * @see https://tailwindcss.com/docs/margin
       */
      m: [{
        m: H()
      }],
      /**
       * Margin X
       * @see https://tailwindcss.com/docs/margin
       */
      mx: [{
        mx: H()
      }],
      /**
       * Margin Y
       * @see https://tailwindcss.com/docs/margin
       */
      my: [{
        my: H()
      }],
      /**
       * Margin Start
       * @see https://tailwindcss.com/docs/margin
       */
      ms: [{
        ms: H()
      }],
      /**
       * Margin End
       * @see https://tailwindcss.com/docs/margin
       */
      me: [{
        me: H()
      }],
      /**
       * Margin Top
       * @see https://tailwindcss.com/docs/margin
       */
      mt: [{
        mt: H()
      }],
      /**
       * Margin Right
       * @see https://tailwindcss.com/docs/margin
       */
      mr: [{
        mr: H()
      }],
      /**
       * Margin Bottom
       * @see https://tailwindcss.com/docs/margin
       */
      mb: [{
        mb: H()
      }],
      /**
       * Margin Left
       * @see https://tailwindcss.com/docs/margin
       */
      ml: [{
        ml: H()
      }],
      /**
       * Space Between X
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-x": [{
        "space-x": D()
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
        "space-y": D()
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
        size: ce()
      }],
      /**
       * Width
       * @see https://tailwindcss.com/docs/width
       */
      w: [{
        w: [s, "screen", ...ce()]
      }],
      /**
       * Min-Width
       * @see https://tailwindcss.com/docs/min-width
       */
      "min-w": [{
        "min-w": [
          s,
          "screen",
          /** Deprecated. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          "none",
          ...ce()
        ]
      }],
      /**
       * Max-Width
       * @see https://tailwindcss.com/docs/max-width
       */
      "max-w": [{
        "max-w": [
          s,
          "screen",
          "none",
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          "prose",
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          {
            screen: [a]
          },
          ...ce()
        ]
      }],
      /**
       * Height
       * @see https://tailwindcss.com/docs/height
       */
      h: [{
        h: ["screen", "lh", ...ce()]
      }],
      /**
       * Min-Height
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-h": [{
        "min-h": ["screen", "lh", "none", ...ce()]
      }],
      /**
       * Max-Height
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-h": [{
        "max-h": ["screen", "lh", ...ce()]
      }],
      // ------------------
      // --- Typography ---
      // ------------------
      /**
       * Font Size
       * @see https://tailwindcss.com/docs/font-size
       */
      "font-size": [{
        text: ["base", n, Gr, In]
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
        font: [o, W, Mc]
      }],
      /**
       * Font Stretch
       * @see https://tailwindcss.com/docs/font-stretch
       */
      "font-stretch": [{
        "font-stretch": ["ultra-condensed", "extra-condensed", "condensed", "semi-condensed", "normal", "semi-expanded", "expanded", "extra-expanded", "ultra-expanded", Cc, F]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      "font-family": [{
        font: [SD, F, t]
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
        tracking: [r, W, F]
      }],
      /**
       * Line Clamp
       * @see https://tailwindcss.com/docs/line-clamp
       */
      "line-clamp": [{
        "line-clamp": [ae, "none", W, Mc]
      }],
      /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */
      leading: [{
        leading: [
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          i,
          ...D()
        ]
      }],
      /**
       * List Style Image
       * @see https://tailwindcss.com/docs/list-style-image
       */
      "list-image": [{
        "list-image": ["none", W, F]
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
        list: ["disc", "decimal", "none", W, F]
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
        placeholder: T()
      }],
      /**
       * Text Color
       * @see https://tailwindcss.com/docs/text-color
       */
      "text-color": [{
        text: T()
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
        decoration: [...ze(), "wavy"]
      }],
      /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */
      "text-decoration-thickness": [{
        decoration: [ae, "from-font", "auto", W, In]
      }],
      /**
       * Text Decoration Color
       * @see https://tailwindcss.com/docs/text-decoration-color
       */
      "text-decoration-color": [{
        decoration: T()
      }],
      /**
       * Text Underline Offset
       * @see https://tailwindcss.com/docs/text-underline-offset
       */
      "underline-offset": [{
        "underline-offset": [ae, "auto", W, F]
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
        indent: D()
      }],
      /**
       * Vertical Alignment
       * @see https://tailwindcss.com/docs/vertical-align
       */
      "vertical-align": [{
        align: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super", W, F]
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
        content: ["none", W, F]
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
        bg: A()
      }],
      /**
       * Background Repeat
       * @see https://tailwindcss.com/docs/background-repeat
       */
      "bg-repeat": [{
        bg: oe()
      }],
      /**
       * Background Size
       * @see https://tailwindcss.com/docs/background-size
       */
      "bg-size": [{
        bg: se()
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      "bg-image": [{
        bg: ["none", {
          linear: [{
            to: ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
          }, dn, W, F],
          radial: ["", W, F],
          conic: [dn, W, F]
        }, OD, xD]
      }],
      /**
       * Background Color
       * @see https://tailwindcss.com/docs/background-color
       */
      "bg-color": [{
        bg: T()
      }],
      /**
       * Gradient Color Stops From Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from-pos": [{
        from: ke()
      }],
      /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via-pos": [{
        via: ke()
      }],
      /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to-pos": [{
        to: ke()
      }],
      /**
       * Gradient Color Stops From
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from": [{
        from: T()
      }],
      /**
       * Gradient Color Stops Via
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via": [{
        via: T()
      }],
      /**
       * Gradient Color Stops To
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to": [{
        to: T()
      }],
      // ---------------
      // --- Borders ---
      // ---------------
      /**
       * Border Radius
       * @see https://tailwindcss.com/docs/border-radius
       */
      rounded: [{
        rounded: me()
      }],
      /**
       * Border Radius Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-s": [{
        "rounded-s": me()
      }],
      /**
       * Border Radius End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-e": [{
        "rounded-e": me()
      }],
      /**
       * Border Radius Top
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-t": [{
        "rounded-t": me()
      }],
      /**
       * Border Radius Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-r": [{
        "rounded-r": me()
      }],
      /**
       * Border Radius Bottom
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-b": [{
        "rounded-b": me()
      }],
      /**
       * Border Radius Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-l": [{
        "rounded-l": me()
      }],
      /**
       * Border Radius Start Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ss": [{
        "rounded-ss": me()
      }],
      /**
       * Border Radius Start End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-se": [{
        "rounded-se": me()
      }],
      /**
       * Border Radius End End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ee": [{
        "rounded-ee": me()
      }],
      /**
       * Border Radius End Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-es": [{
        "rounded-es": me()
      }],
      /**
       * Border Radius Top Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tl": [{
        "rounded-tl": me()
      }],
      /**
       * Border Radius Top Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tr": [{
        "rounded-tr": me()
      }],
      /**
       * Border Radius Bottom Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-br": [{
        "rounded-br": me()
      }],
      /**
       * Border Radius Bottom Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-bl": [{
        "rounded-bl": me()
      }],
      /**
       * Border Width
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w": [{
        border: pe()
      }],
      /**
       * Border Width X
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-x": [{
        "border-x": pe()
      }],
      /**
       * Border Width Y
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-y": [{
        "border-y": pe()
      }],
      /**
       * Border Width Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-s": [{
        "border-s": pe()
      }],
      /**
       * Border Width End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-e": [{
        "border-e": pe()
      }],
      /**
       * Border Width Top
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-t": [{
        "border-t": pe()
      }],
      /**
       * Border Width Right
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-r": [{
        "border-r": pe()
      }],
      /**
       * Border Width Bottom
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-b": [{
        "border-b": pe()
      }],
      /**
       * Border Width Left
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-l": [{
        "border-l": pe()
      }],
      /**
       * Divide Width X
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-x": [{
        "divide-x": pe()
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
        "divide-y": pe()
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
        border: [...ze(), "hidden", "none"]
      }],
      /**
       * Divide Style
       * @see https://tailwindcss.com/docs/border-style#setting-the-divider-style
       */
      "divide-style": [{
        divide: [...ze(), "hidden", "none"]
      }],
      /**
       * Border Color
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color": [{
        border: T()
      }],
      /**
       * Border Color X
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-x": [{
        "border-x": T()
      }],
      /**
       * Border Color Y
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-y": [{
        "border-y": T()
      }],
      /**
       * Border Color S
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-s": [{
        "border-s": T()
      }],
      /**
       * Border Color E
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-e": [{
        "border-e": T()
      }],
      /**
       * Border Color Top
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-t": [{
        "border-t": T()
      }],
      /**
       * Border Color Right
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-r": [{
        "border-r": T()
      }],
      /**
       * Border Color Bottom
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-b": [{
        "border-b": T()
      }],
      /**
       * Border Color Left
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-l": [{
        "border-l": T()
      }],
      /**
       * Divide Color
       * @see https://tailwindcss.com/docs/divide-color
       */
      "divide-color": [{
        divide: T()
      }],
      /**
       * Outline Style
       * @see https://tailwindcss.com/docs/outline-style
       */
      "outline-style": [{
        outline: [...ze(), "none", "hidden"]
      }],
      /**
       * Outline Offset
       * @see https://tailwindcss.com/docs/outline-offset
       */
      "outline-offset": [{
        "outline-offset": [ae, W, F]
      }],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      "outline-w": [{
        outline: ["", ae, Gr, In]
      }],
      /**
       * Outline Color
       * @see https://tailwindcss.com/docs/outline-color
       */
      "outline-color": [{
        outline: T()
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
          l,
          Si,
          xi
        ]
      }],
      /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-shadow-color
       */
      "shadow-color": [{
        shadow: T()
      }],
      /**
       * Inset Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-shadow
       */
      "inset-shadow": [{
        "inset-shadow": ["none", d, Si, xi]
      }],
      /**
       * Inset Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-shadow-color
       */
      "inset-shadow-color": [{
        "inset-shadow": T()
      }],
      /**
       * Ring Width
       * @see https://tailwindcss.com/docs/box-shadow#adding-a-ring
       */
      "ring-w": [{
        ring: pe()
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
        ring: T()
      }],
      /**
       * Ring Offset Width
       * @see https://v3.tailwindcss.com/docs/ring-offset-width
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-offset-w": [{
        "ring-offset": [ae, In]
      }],
      /**
       * Ring Offset Color
       * @see https://v3.tailwindcss.com/docs/ring-offset-color
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-offset-color": [{
        "ring-offset": T()
      }],
      /**
       * Inset Ring Width
       * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-ring
       */
      "inset-ring-w": [{
        "inset-ring": pe()
      }],
      /**
       * Inset Ring Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-ring-color
       */
      "inset-ring-color": [{
        "inset-ring": T()
      }],
      /**
       * Text Shadow
       * @see https://tailwindcss.com/docs/text-shadow
       */
      "text-shadow": [{
        "text-shadow": ["none", f, Si, xi]
      }],
      /**
       * Text Shadow Color
       * @see https://tailwindcss.com/docs/text-shadow#setting-the-shadow-color
       */
      "text-shadow-color": [{
        "text-shadow": T()
      }],
      /**
       * Opacity
       * @see https://tailwindcss.com/docs/opacity
       */
      opacity: [{
        opacity: [ae, W, F]
      }],
      /**
       * Mix Blend Mode
       * @see https://tailwindcss.com/docs/mix-blend-mode
       */
      "mix-blend": [{
        "mix-blend": [...Xe(), "plus-darker", "plus-lighter"]
      }],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      "bg-blend": [{
        "bg-blend": Xe()
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
        "mask-linear": [ae]
      }],
      "mask-image-linear-from-pos": [{
        "mask-linear-from": fe()
      }],
      "mask-image-linear-to-pos": [{
        "mask-linear-to": fe()
      }],
      "mask-image-linear-from-color": [{
        "mask-linear-from": T()
      }],
      "mask-image-linear-to-color": [{
        "mask-linear-to": T()
      }],
      "mask-image-t-from-pos": [{
        "mask-t-from": fe()
      }],
      "mask-image-t-to-pos": [{
        "mask-t-to": fe()
      }],
      "mask-image-t-from-color": [{
        "mask-t-from": T()
      }],
      "mask-image-t-to-color": [{
        "mask-t-to": T()
      }],
      "mask-image-r-from-pos": [{
        "mask-r-from": fe()
      }],
      "mask-image-r-to-pos": [{
        "mask-r-to": fe()
      }],
      "mask-image-r-from-color": [{
        "mask-r-from": T()
      }],
      "mask-image-r-to-color": [{
        "mask-r-to": T()
      }],
      "mask-image-b-from-pos": [{
        "mask-b-from": fe()
      }],
      "mask-image-b-to-pos": [{
        "mask-b-to": fe()
      }],
      "mask-image-b-from-color": [{
        "mask-b-from": T()
      }],
      "mask-image-b-to-color": [{
        "mask-b-to": T()
      }],
      "mask-image-l-from-pos": [{
        "mask-l-from": fe()
      }],
      "mask-image-l-to-pos": [{
        "mask-l-to": fe()
      }],
      "mask-image-l-from-color": [{
        "mask-l-from": T()
      }],
      "mask-image-l-to-color": [{
        "mask-l-to": T()
      }],
      "mask-image-x-from-pos": [{
        "mask-x-from": fe()
      }],
      "mask-image-x-to-pos": [{
        "mask-x-to": fe()
      }],
      "mask-image-x-from-color": [{
        "mask-x-from": T()
      }],
      "mask-image-x-to-color": [{
        "mask-x-to": T()
      }],
      "mask-image-y-from-pos": [{
        "mask-y-from": fe()
      }],
      "mask-image-y-to-pos": [{
        "mask-y-to": fe()
      }],
      "mask-image-y-from-color": [{
        "mask-y-from": T()
      }],
      "mask-image-y-to-color": [{
        "mask-y-to": T()
      }],
      "mask-image-radial": [{
        "mask-radial": [W, F]
      }],
      "mask-image-radial-from-pos": [{
        "mask-radial-from": fe()
      }],
      "mask-image-radial-to-pos": [{
        "mask-radial-to": fe()
      }],
      "mask-image-radial-from-color": [{
        "mask-radial-from": T()
      }],
      "mask-image-radial-to-color": [{
        "mask-radial-to": T()
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
        "mask-radial-at": x()
      }],
      "mask-image-conic-pos": [{
        "mask-conic": [ae]
      }],
      "mask-image-conic-from-pos": [{
        "mask-conic-from": fe()
      }],
      "mask-image-conic-to-pos": [{
        "mask-conic-to": fe()
      }],
      "mask-image-conic-from-color": [{
        "mask-conic-from": T()
      }],
      "mask-image-conic-to-color": [{
        "mask-conic-to": T()
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
        mask: A()
      }],
      /**
       * Mask Repeat
       * @see https://tailwindcss.com/docs/mask-repeat
       */
      "mask-repeat": [{
        mask: oe()
      }],
      /**
       * Mask Size
       * @see https://tailwindcss.com/docs/mask-size
       */
      "mask-size": [{
        mask: se()
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
        mask: ["none", W, F]
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
          W,
          F
        ]
      }],
      /**
       * Blur
       * @see https://tailwindcss.com/docs/blur
       */
      blur: [{
        blur: Ot()
      }],
      /**
       * Brightness
       * @see https://tailwindcss.com/docs/brightness
       */
      brightness: [{
        brightness: [ae, W, F]
      }],
      /**
       * Contrast
       * @see https://tailwindcss.com/docs/contrast
       */
      contrast: [{
        contrast: [ae, W, F]
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
          h,
          Si,
          xi
        ]
      }],
      /**
       * Drop Shadow Color
       * @see https://tailwindcss.com/docs/filter-drop-shadow#setting-the-shadow-color
       */
      "drop-shadow-color": [{
        "drop-shadow": T()
      }],
      /**
       * Grayscale
       * @see https://tailwindcss.com/docs/grayscale
       */
      grayscale: [{
        grayscale: ["", ae, W, F]
      }],
      /**
       * Hue Rotate
       * @see https://tailwindcss.com/docs/hue-rotate
       */
      "hue-rotate": [{
        "hue-rotate": [ae, W, F]
      }],
      /**
       * Invert
       * @see https://tailwindcss.com/docs/invert
       */
      invert: [{
        invert: ["", ae, W, F]
      }],
      /**
       * Saturate
       * @see https://tailwindcss.com/docs/saturate
       */
      saturate: [{
        saturate: [ae, W, F]
      }],
      /**
       * Sepia
       * @see https://tailwindcss.com/docs/sepia
       */
      sepia: [{
        sepia: ["", ae, W, F]
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
          W,
          F
        ]
      }],
      /**
       * Backdrop Blur
       * @see https://tailwindcss.com/docs/backdrop-blur
       */
      "backdrop-blur": [{
        "backdrop-blur": Ot()
      }],
      /**
       * Backdrop Brightness
       * @see https://tailwindcss.com/docs/backdrop-brightness
       */
      "backdrop-brightness": [{
        "backdrop-brightness": [ae, W, F]
      }],
      /**
       * Backdrop Contrast
       * @see https://tailwindcss.com/docs/backdrop-contrast
       */
      "backdrop-contrast": [{
        "backdrop-contrast": [ae, W, F]
      }],
      /**
       * Backdrop Grayscale
       * @see https://tailwindcss.com/docs/backdrop-grayscale
       */
      "backdrop-grayscale": [{
        "backdrop-grayscale": ["", ae, W, F]
      }],
      /**
       * Backdrop Hue Rotate
       * @see https://tailwindcss.com/docs/backdrop-hue-rotate
       */
      "backdrop-hue-rotate": [{
        "backdrop-hue-rotate": [ae, W, F]
      }],
      /**
       * Backdrop Invert
       * @see https://tailwindcss.com/docs/backdrop-invert
       */
      "backdrop-invert": [{
        "backdrop-invert": ["", ae, W, F]
      }],
      /**
       * Backdrop Opacity
       * @see https://tailwindcss.com/docs/backdrop-opacity
       */
      "backdrop-opacity": [{
        "backdrop-opacity": [ae, W, F]
      }],
      /**
       * Backdrop Saturate
       * @see https://tailwindcss.com/docs/backdrop-saturate
       */
      "backdrop-saturate": [{
        "backdrop-saturate": [ae, W, F]
      }],
      /**
       * Backdrop Sepia
       * @see https://tailwindcss.com/docs/backdrop-sepia
       */
      "backdrop-sepia": [{
        "backdrop-sepia": ["", ae, W, F]
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
        "border-spacing": D()
      }],
      /**
       * Border Spacing X
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-x": [{
        "border-spacing-x": D()
      }],
      /**
       * Border Spacing Y
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-y": [{
        "border-spacing-y": D()
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
        transition: ["", "all", "colors", "opacity", "shadow", "transform", "none", W, F]
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
        duration: [ae, "initial", W, F]
      }],
      /**
       * Transition Timing Function
       * @see https://tailwindcss.com/docs/transition-timing-function
       */
      ease: [{
        ease: ["linear", "initial", b, W, F]
      }],
      /**
       * Transition Delay
       * @see https://tailwindcss.com/docs/transition-delay
       */
      delay: [{
        delay: [ae, W, F]
      }],
      /**
       * Animation
       * @see https://tailwindcss.com/docs/animation
       */
      animate: [{
        animate: ["none", _, W, F]
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
        perspective: [p, W, F]
      }],
      /**
       * Perspective Origin
       * @see https://tailwindcss.com/docs/perspective-origin
       */
      "perspective-origin": [{
        "perspective-origin": S()
      }],
      /**
       * Rotate
       * @see https://tailwindcss.com/docs/rotate
       */
      rotate: [{
        rotate: Ee()
      }],
      /**
       * Rotate X
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-x": [{
        "rotate-x": Ee()
      }],
      /**
       * Rotate Y
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-y": [{
        "rotate-y": Ee()
      }],
      /**
       * Rotate Z
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-z": [{
        "rotate-z": Ee()
      }],
      /**
       * Scale
       * @see https://tailwindcss.com/docs/scale
       */
      scale: [{
        scale: Ze()
      }],
      /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-x": [{
        "scale-x": Ze()
      }],
      /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-y": [{
        "scale-y": Ze()
      }],
      /**
       * Scale Z
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-z": [{
        "scale-z": Ze()
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
        skew: ln()
      }],
      /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-x": [{
        "skew-x": ln()
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-y": [{
        "skew-y": ln()
      }],
      /**
       * Transform
       * @see https://tailwindcss.com/docs/transform
       */
      transform: [{
        transform: [W, F, "", "none", "gpu", "cpu"]
      }],
      /**
       * Transform Origin
       * @see https://tailwindcss.com/docs/transform-origin
       */
      "transform-origin": [{
        origin: S()
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
        translate: Ht()
      }],
      /**
       * Translate X
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-x": [{
        "translate-x": Ht()
      }],
      /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-y": [{
        "translate-y": Ht()
      }],
      /**
       * Translate Z
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-z": [{
        "translate-z": Ht()
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
        accent: T()
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
        caret: T()
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
        cursor: ["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", W, F]
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
        "scroll-m": D()
      }],
      /**
       * Scroll Margin X
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mx": [{
        "scroll-mx": D()
      }],
      /**
       * Scroll Margin Y
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-my": [{
        "scroll-my": D()
      }],
      /**
       * Scroll Margin Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ms": [{
        "scroll-ms": D()
      }],
      /**
       * Scroll Margin End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-me": [{
        "scroll-me": D()
      }],
      /**
       * Scroll Margin Top
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mt": [{
        "scroll-mt": D()
      }],
      /**
       * Scroll Margin Right
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mr": [{
        "scroll-mr": D()
      }],
      /**
       * Scroll Margin Bottom
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mb": [{
        "scroll-mb": D()
      }],
      /**
       * Scroll Margin Left
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ml": [{
        "scroll-ml": D()
      }],
      /**
       * Scroll Padding
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-p": [{
        "scroll-p": D()
      }],
      /**
       * Scroll Padding X
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-px": [{
        "scroll-px": D()
      }],
      /**
       * Scroll Padding Y
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-py": [{
        "scroll-py": D()
      }],
      /**
       * Scroll Padding Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-ps": [{
        "scroll-ps": D()
      }],
      /**
       * Scroll Padding End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pe": [{
        "scroll-pe": D()
      }],
      /**
       * Scroll Padding Top
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pt": [{
        "scroll-pt": D()
      }],
      /**
       * Scroll Padding Right
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pr": [{
        "scroll-pr": D()
      }],
      /**
       * Scroll Padding Bottom
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pb": [{
        "scroll-pb": D()
      }],
      /**
       * Scroll Padding Left
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pl": [{
        "scroll-pl": D()
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
        "will-change": ["auto", "scroll", "contents", "transform", W, F]
      }],
      // -----------
      // --- SVG ---
      // -----------
      /**
       * Fill
       * @see https://tailwindcss.com/docs/fill
       */
      fill: [{
        fill: ["none", ...T()]
      }],
      /**
       * Stroke Width
       * @see https://tailwindcss.com/docs/stroke-width
       */
      "stroke-w": [{
        stroke: [ae, Gr, In, Mc]
      }],
      /**
       * Stroke
       * @see https://tailwindcss.com/docs/stroke
       */
      stroke: [{
        stroke: ["none", ...T()]
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
}, Ng = /* @__PURE__ */ lD(ED), Eu = Object.freeze({
  status: "aborted"
});
function k(e, t, n) {
  function o(s, c) {
    if (s._zod || Object.defineProperty(s, "_zod", {
      value: {
        def: c,
        constr: a,
        traits: /* @__PURE__ */ new Set()
      },
      enumerable: !1
    }), s._zod.traits.has(e))
      return;
    s._zod.traits.add(e), t(s, c);
    const u = a.prototype, l = Object.keys(u);
    for (let d = 0; d < l.length; d++) {
      const f = l[d];
      f in s || (s[f] = u[f].bind(s));
    }
  }
  const r = (n == null ? void 0 : n.Parent) ?? Object;
  class i extends r {
  }
  Object.defineProperty(i, "name", { value: e });
  function a(s) {
    var c;
    const u = n != null && n.Parent ? new i() : this;
    o(u, s), (c = u._zod).deferred ?? (c.deferred = []);
    for (const l of u._zod.deferred)
      l();
    return u;
  }
  return Object.defineProperty(a, "init", { value: o }), Object.defineProperty(a, Symbol.hasInstance, {
    value: (s) => {
      var c, u;
      return n != null && n.Parent && s instanceof n.Parent ? !0 : (u = (c = s == null ? void 0 : s._zod) == null ? void 0 : c.traits) == null ? void 0 : u.has(e);
    }
  }), Object.defineProperty(a, "name", { value: e }), a;
}
const Pu = Symbol("zod_brand");
class Mn extends Error {
  constructor() {
    super("Encountered Promise during synchronous parse. Use .parseAsync() instead.");
  }
}
class Ia extends Error {
  constructor(t) {
    super(`Encountered unidirectional transform during encode: ${t}`), this.name = "ZodEncodeError";
  }
}
const Xi = {};
function Ue(e) {
  return e && Object.assign(Xi, e), Xi;
}
function PD(e) {
  return e;
}
function TD(e) {
  return e;
}
function CD(e) {
}
function MD(e) {
  throw new Error("Unexpected value in exhaustive check");
}
function zD(e) {
}
function Tu(e) {
  const t = Object.values(e).filter((o) => typeof o == "number");
  return Object.entries(e).filter(([o, r]) => t.indexOf(+o) === -1).map(([o, r]) => r);
}
function C(e, t = "|") {
  return e.map((n) => q(n)).join(t);
}
function Qi(e, t) {
  return typeof t == "bigint" ? t.toString() : t;
}
function mo(e) {
  return {
    get value() {
      {
        const t = e();
        return Object.defineProperty(this, "value", { value: t }), t;
      }
    }
  };
}
function Ln(e) {
  return e == null;
}
function Na(e) {
  const t = e.startsWith("^") ? 1 : 0, n = e.endsWith("$") ? e.length - 1 : e.length;
  return e.slice(t, n);
}
function Eg(e, t) {
  const n = (e.toString().split(".")[1] || "").length, o = t.toString();
  let r = (o.split(".")[1] || "").length;
  if (r === 0 && /\d?e-\d?/.test(o)) {
    const c = o.match(/\d?e-(\d?)/);
    c != null && c[1] && (r = Number.parseInt(c[1]));
  }
  const i = n > r ? n : r, a = Number.parseInt(e.toFixed(i).replace(".", "")), s = Number.parseInt(t.toFixed(i).replace(".", ""));
  return a % s / 10 ** i;
}
const Pm = Symbol("evaluating");
function ie(e, t, n) {
  let o;
  Object.defineProperty(e, t, {
    get() {
      if (o !== Pm)
        return o === void 0 && (o = Pm, o = n()), o;
    },
    set(r) {
      Object.defineProperty(e, t, {
        value: r
        // configurable: true,
      });
    },
    configurable: !0
  });
}
function RD(e) {
  return Object.create(Object.getPrototypeOf(e), Object.getOwnPropertyDescriptors(e));
}
function wn(e, t, n) {
  Object.defineProperty(e, t, {
    value: n,
    writable: !0,
    enumerable: !0,
    configurable: !0
  });
}
function Wt(...e) {
  const t = {};
  for (const n of e) {
    const o = Object.getOwnPropertyDescriptors(n);
    Object.assign(t, o);
  }
  return Object.defineProperties({}, t);
}
function AD(e) {
  return Wt(e._zod.def);
}
function UD(e, t) {
  return t ? t.reduce((n, o) => n == null ? void 0 : n[o], e) : e;
}
function jD(e) {
  const t = Object.keys(e), n = t.map((o) => e[o]);
  return Promise.all(n).then((o) => {
    const r = {};
    for (let i = 0; i < t.length; i++)
      r[t[i]] = o[i];
    return r;
  });
}
function FD(e = 10) {
  const t = "abcdefghijklmnopqrstuvwxyz";
  let n = "";
  for (let o = 0; o < e; o++)
    n += t[Math.floor(Math.random() * t.length)];
  return n;
}
function nu(e) {
  return JSON.stringify(e);
}
function Pg(e) {
  return e.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}
const Cu = "captureStackTrace" in Error ? Error.captureStackTrace : (...e) => {
};
function lr(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
const Tg = mo(() => {
  var e;
  if (typeof navigator < "u" && ((e = navigator == null ? void 0 : navigator.userAgent) != null && e.includes("Cloudflare")))
    return !1;
  try {
    const t = Function;
    return new t(""), !0;
  } catch {
    return !1;
  }
});
function Rn(e) {
  if (lr(e) === !1)
    return !1;
  const t = e.constructor;
  if (t === void 0 || typeof t != "function")
    return !0;
  const n = t.prototype;
  return !(lr(n) === !1 || Object.prototype.hasOwnProperty.call(n, "isPrototypeOf") === !1);
}
function Ea(e) {
  return Rn(e) ? { ...e } : Array.isArray(e) ? [...e] : e;
}
function WD(e) {
  let t = 0;
  for (const n in e)
    Object.prototype.hasOwnProperty.call(e, n) && t++;
  return t;
}
const LD = (e) => {
  const t = typeof e;
  switch (t) {
    case "undefined":
      return "undefined";
    case "string":
      return "string";
    case "number":
      return Number.isNaN(e) ? "nan" : "number";
    case "boolean":
      return "boolean";
    case "function":
      return "function";
    case "bigint":
      return "bigint";
    case "symbol":
      return "symbol";
    case "object":
      return Array.isArray(e) ? "array" : e === null ? "null" : e.then && typeof e.then == "function" && e.catch && typeof e.catch == "function" ? "promise" : typeof Map < "u" && e instanceof Map ? "map" : typeof Set < "u" && e instanceof Set ? "set" : typeof Date < "u" && e instanceof Date ? "date" : typeof File < "u" && e instanceof File ? "file" : "object";
    default:
      throw new Error(`Unknown data type: ${t}`);
  }
}, ea = /* @__PURE__ */ new Set(["string", "number", "symbol"]), Cg = /* @__PURE__ */ new Set(["string", "number", "bigint", "boolean", "symbol", "undefined"]);
function Xt(e) {
  return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function ct(e, t, n) {
  const o = new e._zod.constr(t ?? e._zod.def);
  return (!t || n != null && n.parent) && (o._zod.parent = e), o;
}
function E(e) {
  const t = e;
  if (!t)
    return {};
  if (typeof t == "string")
    return { error: () => t };
  if ((t == null ? void 0 : t.message) !== void 0) {
    if ((t == null ? void 0 : t.error) !== void 0)
      throw new Error("Cannot specify both `message` and `error` params");
    t.error = t.message;
  }
  return delete t.message, typeof t.error == "string" ? { ...t, error: () => t.error } : t;
}
function ZD(e) {
  let t;
  return new Proxy({}, {
    get(n, o, r) {
      return t ?? (t = e()), Reflect.get(t, o, r);
    },
    set(n, o, r, i) {
      return t ?? (t = e()), Reflect.set(t, o, r, i);
    },
    has(n, o) {
      return t ?? (t = e()), Reflect.has(t, o);
    },
    deleteProperty(n, o) {
      return t ?? (t = e()), Reflect.deleteProperty(t, o);
    },
    ownKeys(n) {
      return t ?? (t = e()), Reflect.ownKeys(t);
    },
    getOwnPropertyDescriptor(n, o) {
      return t ?? (t = e()), Reflect.getOwnPropertyDescriptor(t, o);
    },
    defineProperty(n, o, r) {
      return t ?? (t = e()), Reflect.defineProperty(t, o, r);
    }
  });
}
function q(e) {
  return typeof e == "bigint" ? e.toString() + "n" : typeof e == "string" ? `"${e}"` : `${e}`;
}
function Mg(e) {
  return Object.keys(e).filter((t) => e[t]._zod.optin === "optional" && e[t]._zod.optout === "optional");
}
const zg = {
  safeint: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
  int32: [-2147483648, 2147483647],
  uint32: [0, 4294967295],
  float32: [-34028234663852886e22, 34028234663852886e22],
  float64: [-Number.MAX_VALUE, Number.MAX_VALUE]
}, Rg = {
  int64: [/* @__PURE__ */ BigInt("-9223372036854775808"), /* @__PURE__ */ BigInt("9223372036854775807")],
  uint64: [/* @__PURE__ */ BigInt(0), /* @__PURE__ */ BigInt("18446744073709551615")]
};
function Ag(e, t) {
  const n = e._zod.def, o = n.checks;
  if (o && o.length > 0)
    throw new Error(".pick() cannot be used on object schemas containing refinements");
  const i = Wt(e._zod.def, {
    get shape() {
      const a = {};
      for (const s in t) {
        if (!(s in n.shape))
          throw new Error(`Unrecognized key: "${s}"`);
        t[s] && (a[s] = n.shape[s]);
      }
      return wn(this, "shape", a), a;
    },
    checks: []
  });
  return ct(e, i);
}
function Ug(e, t) {
  const n = e._zod.def, o = n.checks;
  if (o && o.length > 0)
    throw new Error(".omit() cannot be used on object schemas containing refinements");
  const i = Wt(e._zod.def, {
    get shape() {
      const a = { ...e._zod.def.shape };
      for (const s in t) {
        if (!(s in n.shape))
          throw new Error(`Unrecognized key: "${s}"`);
        t[s] && delete a[s];
      }
      return wn(this, "shape", a), a;
    },
    checks: []
  });
  return ct(e, i);
}
function jg(e, t) {
  if (!Rn(t))
    throw new Error("Invalid input to extend: expected a plain object");
  const n = e._zod.def.checks;
  if (n && n.length > 0) {
    const i = e._zod.def.shape;
    for (const a in t)
      if (Object.getOwnPropertyDescriptor(i, a) !== void 0)
        throw new Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.");
  }
  const r = Wt(e._zod.def, {
    get shape() {
      const i = { ...e._zod.def.shape, ...t };
      return wn(this, "shape", i), i;
    }
  });
  return ct(e, r);
}
function Fg(e, t) {
  if (!Rn(t))
    throw new Error("Invalid input to safeExtend: expected a plain object");
  const n = Wt(e._zod.def, {
    get shape() {
      const o = { ...e._zod.def.shape, ...t };
      return wn(this, "shape", o), o;
    }
  });
  return ct(e, n);
}
function Wg(e, t) {
  const n = Wt(e._zod.def, {
    get shape() {
      const o = { ...e._zod.def.shape, ...t._zod.def.shape };
      return wn(this, "shape", o), o;
    },
    get catchall() {
      return t._zod.def.catchall;
    },
    checks: []
    // delete existing checks
  });
  return ct(e, n);
}
function Lg(e, t, n) {
  const r = t._zod.def.checks;
  if (r && r.length > 0)
    throw new Error(".partial() cannot be used on object schemas containing refinements");
  const a = Wt(t._zod.def, {
    get shape() {
      const s = t._zod.def.shape, c = { ...s };
      if (n)
        for (const u in n) {
          if (!(u in s))
            throw new Error(`Unrecognized key: "${u}"`);
          n[u] && (c[u] = e ? new e({
            type: "optional",
            innerType: s[u]
          }) : s[u]);
        }
      else
        for (const u in s)
          c[u] = e ? new e({
            type: "optional",
            innerType: s[u]
          }) : s[u];
      return wn(this, "shape", c), c;
    },
    checks: []
  });
  return ct(t, a);
}
function Zg(e, t, n) {
  const o = Wt(t._zod.def, {
    get shape() {
      const r = t._zod.def.shape, i = { ...r };
      if (n)
        for (const a in n) {
          if (!(a in i))
            throw new Error(`Unrecognized key: "${a}"`);
          n[a] && (i[a] = new e({
            type: "nonoptional",
            innerType: r[a]
          }));
        }
      else
        for (const a in r)
          i[a] = new e({
            type: "nonoptional",
            innerType: r[a]
          });
      return wn(this, "shape", i), i;
    }
  });
  return ct(t, o);
}
function Pn(e, t = 0) {
  var n;
  if (e.aborted === !0)
    return !0;
  for (let o = t; o < e.issues.length; o++)
    if (((n = e.issues[o]) == null ? void 0 : n.continue) !== !0)
      return !0;
  return !1;
}
function vt(e, t) {
  return t.map((n) => {
    var o;
    return (o = n).path ?? (o.path = []), n.path.unshift(e), n;
  });
}
function Kr(e) {
  return typeof e == "string" ? e : e == null ? void 0 : e.message;
}
function mt(e, t, n) {
  var r, i, a, s, c, u;
  const o = { ...e, path: e.path ?? [] };
  if (!e.message) {
    const l = Kr((a = (i = (r = e.inst) == null ? void 0 : r._zod.def) == null ? void 0 : i.error) == null ? void 0 : a.call(i, e)) ?? Kr((s = t == null ? void 0 : t.error) == null ? void 0 : s.call(t, e)) ?? Kr((c = n.customError) == null ? void 0 : c.call(n, e)) ?? Kr((u = n.localeError) == null ? void 0 : u.call(n, e)) ?? "Invalid input";
    o.message = l;
  }
  return delete o.inst, delete o.continue, t != null && t.reportInput || delete o.input, o;
}
function Pa(e) {
  return e instanceof Set ? "set" : e instanceof Map ? "map" : e instanceof File ? "file" : "unknown";
}
function Ta(e) {
  return Array.isArray(e) ? "array" : typeof e == "string" ? "string" : "unknown";
}
function X(e) {
  const t = typeof e;
  switch (t) {
    case "number":
      return Number.isNaN(e) ? "nan" : "number";
    case "object": {
      if (e === null)
        return "null";
      if (Array.isArray(e))
        return "array";
      const n = e;
      if (n && Object.getPrototypeOf(n) !== Object.prototype && "constructor" in n && n.constructor)
        return n.constructor.name;
    }
  }
  return t;
}
function dr(...e) {
  const [t, n, o] = e;
  return typeof t == "string" ? {
    message: t,
    code: "custom",
    input: n,
    inst: o
  } : { ...t };
}
function YD(e) {
  return Object.entries(e).filter(([t, n]) => Number.isNaN(Number.parseInt(t, 10))).map((t) => t[1]);
}
function Yg(e) {
  const t = atob(e), n = new Uint8Array(t.length);
  for (let o = 0; o < t.length; o++)
    n[o] = t.charCodeAt(o);
  return n;
}
function Bg(e) {
  let t = "";
  for (let n = 0; n < e.length; n++)
    t += String.fromCharCode(e[n]);
  return btoa(t);
}
function BD(e) {
  const t = e.replace(/-/g, "+").replace(/_/g, "/"), n = "=".repeat((4 - t.length % 4) % 4);
  return Yg(t + n);
}
function HD(e) {
  return Bg(e).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}
function GD(e) {
  const t = e.replace(/^0x/, "");
  if (t.length % 2 !== 0)
    throw new Error("Invalid hex string length");
  const n = new Uint8Array(t.length / 2);
  for (let o = 0; o < t.length; o += 2)
    n[o / 2] = Number.parseInt(t.slice(o, o + 2), 16);
  return n;
}
function VD(e) {
  return Array.from(e).map((t) => t.toString(16).padStart(2, "0")).join("");
}
class qD {
  constructor(...t) {
  }
}
const Mu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  BIGINT_FORMAT_RANGES: Rg,
  Class: qD,
  NUMBER_FORMAT_RANGES: zg,
  aborted: Pn,
  allowsEval: Tg,
  assert: zD,
  assertEqual: PD,
  assertIs: CD,
  assertNever: MD,
  assertNotEqual: TD,
  assignProp: wn,
  base64ToUint8Array: Yg,
  base64urlToUint8Array: BD,
  cached: mo,
  captureStackTrace: Cu,
  cleanEnum: YD,
  cleanRegex: Na,
  clone: ct,
  cloneDef: AD,
  createTransparentProxy: ZD,
  defineLazy: ie,
  esc: nu,
  escapeRegex: Xt,
  extend: jg,
  finalizeIssue: mt,
  floatSafeRemainder: Eg,
  getElementAtPath: UD,
  getEnumValues: Tu,
  getLengthableOrigin: Ta,
  getParsedType: LD,
  getSizableOrigin: Pa,
  hexToUint8Array: GD,
  isObject: lr,
  isPlainObject: Rn,
  issue: dr,
  joinValues: C,
  jsonStringifyReplacer: Qi,
  merge: Wg,
  mergeDefs: Wt,
  normalizeParams: E,
  nullish: Ln,
  numKeys: WD,
  objectClone: RD,
  omit: Ug,
  optionalKeys: Mg,
  parsedType: X,
  partial: Lg,
  pick: Ag,
  prefixIssues: vt,
  primitiveTypes: Cg,
  promiseAllObject: jD,
  propertyKeyTypes: ea,
  randomString: FD,
  required: Zg,
  safeExtend: Fg,
  shallowClone: Ea,
  slugify: Pg,
  stringifyPrimitive: q,
  uint8ArrayToBase64: Bg,
  uint8ArrayToBase64url: HD,
  uint8ArrayToHex: VD,
  unwrapMessage: Kr
}, Symbol.toStringTag, { value: "Module" })), Hg = (e, t) => {
  e.name = "$ZodError", Object.defineProperty(e, "_zod", {
    value: e._zod,
    enumerable: !1
  }), Object.defineProperty(e, "issues", {
    value: t,
    enumerable: !1
  }), e.message = JSON.stringify(t, Qi, 2), Object.defineProperty(e, "toString", {
    value: () => e.message,
    enumerable: !1
  });
}, zu = k("$ZodError", Hg), ut = k("$ZodError", Hg, { Parent: Error });
function Ca(e, t = (n) => n.message) {
  const n = {}, o = [];
  for (const r of e.issues)
    r.path.length > 0 ? (n[r.path[0]] = n[r.path[0]] || [], n[r.path[0]].push(t(r))) : o.push(t(r));
  return { formErrors: o, fieldErrors: n };
}
function Ma(e, t = (n) => n.message) {
  const n = { _errors: [] }, o = (r) => {
    for (const i of r.issues)
      if (i.code === "invalid_union" && i.errors.length)
        i.errors.map((a) => o({ issues: a }));
      else if (i.code === "invalid_key")
        o({ issues: i.issues });
      else if (i.code === "invalid_element")
        o({ issues: i.issues });
      else if (i.path.length === 0)
        n._errors.push(t(i));
      else {
        let a = n, s = 0;
        for (; s < i.path.length; ) {
          const c = i.path[s];
          s === i.path.length - 1 ? (a[c] = a[c] || { _errors: [] }, a[c]._errors.push(t(i))) : a[c] = a[c] || { _errors: [] }, a = a[c], s++;
        }
      }
  };
  return o(e), n;
}
function Ru(e, t = (n) => n.message) {
  const n = { errors: [] }, o = (r, i = []) => {
    var a, s;
    for (const c of r.issues)
      if (c.code === "invalid_union" && c.errors.length)
        c.errors.map((u) => o({ issues: u }, c.path));
      else if (c.code === "invalid_key")
        o({ issues: c.issues }, c.path);
      else if (c.code === "invalid_element")
        o({ issues: c.issues }, c.path);
      else {
        const u = [...i, ...c.path];
        if (u.length === 0) {
          n.errors.push(t(c));
          continue;
        }
        let l = n, d = 0;
        for (; d < u.length; ) {
          const f = u[d], h = d === u.length - 1;
          typeof f == "string" ? (l.properties ?? (l.properties = {}), (a = l.properties)[f] ?? (a[f] = { errors: [] }), l = l.properties[f]) : (l.items ?? (l.items = []), (s = l.items)[f] ?? (s[f] = { errors: [] }), l = l.items[f]), h && l.errors.push(t(c)), d++;
        }
      }
  };
  return o(e), n;
}
function Gg(e) {
  const t = [], n = e.map((o) => typeof o == "object" ? o.key : o);
  for (const o of n)
    typeof o == "number" ? t.push(`[${o}]`) : typeof o == "symbol" ? t.push(`[${JSON.stringify(String(o))}]`) : /[^\w$]/.test(o) ? t.push(`[${JSON.stringify(o)}]`) : (t.length && t.push("."), t.push(o));
  return t.join("");
}
function Au(e) {
  var o;
  const t = [], n = [...e.issues].sort((r, i) => (r.path ?? []).length - (i.path ?? []).length);
  for (const r of n)
    t.push(`✖ ${r.message}`), (o = r.path) != null && o.length && t.push(`  → at ${Gg(r.path)}`);
  return t.join(`
`);
}
const ho = (e) => (t, n, o, r) => {
  const i = o ? Object.assign(o, { async: !1 }) : { async: !1 }, a = t._zod.run({ value: n, issues: [] }, i);
  if (a instanceof Promise)
    throw new Mn();
  if (a.issues.length) {
    const s = new ((r == null ? void 0 : r.Err) ?? e)(a.issues.map((c) => mt(c, i, Ue())));
    throw Cu(s, r == null ? void 0 : r.callee), s;
  }
  return a.value;
}, ru = /* @__PURE__ */ ho(ut), go = (e) => async (t, n, o, r) => {
  const i = o ? Object.assign(o, { async: !0 }) : { async: !0 };
  let a = t._zod.run({ value: n, issues: [] }, i);
  if (a instanceof Promise && (a = await a), a.issues.length) {
    const s = new ((r == null ? void 0 : r.Err) ?? e)(a.issues.map((c) => mt(c, i, Ue())));
    throw Cu(s, r == null ? void 0 : r.callee), s;
  }
  return a.value;
}, ou = /* @__PURE__ */ go(ut), po = (e) => (t, n, o) => {
  const r = o ? { ...o, async: !1 } : { async: !1 }, i = t._zod.run({ value: n, issues: [] }, r);
  if (i instanceof Promise)
    throw new Mn();
  return i.issues.length ? {
    success: !1,
    error: new (e ?? zu)(i.issues.map((a) => mt(a, r, Ue())))
  } : { success: !0, data: i.value };
}, Vg = /* @__PURE__ */ po(ut), vo = (e) => async (t, n, o) => {
  const r = o ? Object.assign(o, { async: !0 }) : { async: !0 };
  let i = t._zod.run({ value: n, issues: [] }, r);
  return i instanceof Promise && (i = await i), i.issues.length ? {
    success: !1,
    error: new e(i.issues.map((a) => mt(a, r, Ue())))
  } : { success: !0, data: i.value };
}, qg = /* @__PURE__ */ vo(ut), Uu = (e) => (t, n, o) => {
  const r = o ? Object.assign(o, { direction: "backward" }) : { direction: "backward" };
  return ho(e)(t, n, r);
}, JD = /* @__PURE__ */ Uu(ut), ju = (e) => (t, n, o) => ho(e)(t, n, o), KD = /* @__PURE__ */ ju(ut), Fu = (e) => async (t, n, o) => {
  const r = o ? Object.assign(o, { direction: "backward" }) : { direction: "backward" };
  return go(e)(t, n, r);
}, XD = /* @__PURE__ */ Fu(ut), Wu = (e) => async (t, n, o) => go(e)(t, n, o), QD = /* @__PURE__ */ Wu(ut), Lu = (e) => (t, n, o) => {
  const r = o ? Object.assign(o, { direction: "backward" }) : { direction: "backward" };
  return po(e)(t, n, r);
}, eO = /* @__PURE__ */ Lu(ut), Zu = (e) => (t, n, o) => po(e)(t, n, o), tO = /* @__PURE__ */ Zu(ut), Yu = (e) => async (t, n, o) => {
  const r = o ? Object.assign(o, { direction: "backward" }) : { direction: "backward" };
  return vo(e)(t, n, r);
}, nO = /* @__PURE__ */ Yu(ut), Bu = (e) => async (t, n, o) => vo(e)(t, n, o), rO = /* @__PURE__ */ Bu(ut), Jg = /^[cC][^\s-]{8,}$/, Kg = /^[0-9a-z]+$/, Xg = /^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/, Qg = /^[0-9a-vA-V]{20}$/, ep = /^[A-Za-z0-9]{27}$/, tp = /^[a-zA-Z0-9_-]{21}$/, np = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/, oO = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/, rp = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/, fr = (e) => e ? new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${e}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`) : /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/, iO = /* @__PURE__ */ fr(4), aO = /* @__PURE__ */ fr(6), sO = /* @__PURE__ */ fr(7), op = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/, cO = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/, uO = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, ip = /^[^\s@"]{1,64}@[^\s@]{1,255}$/u, lO = ip, dO = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/, fO = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$";
function ap() {
  return new RegExp(fO, "u");
}
const sp = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, cp = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/, up = (e) => {
  const t = Xt(e ?? ":");
  return new RegExp(`^(?:[0-9A-F]{2}${t}){5}[0-9A-F]{2}$|^(?:[0-9a-f]{2}${t}){5}[0-9a-f]{2}$`);
}, lp = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/, dp = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/, fp = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/, Hu = /^[A-Za-z0-9_-]*$/, mp = /^(?=.{1,253}\.?$)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[-0-9a-zA-Z]{0,61}[0-9a-zA-Z])?)*\.?$/, hp = /^([a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/, gp = /^\+[1-9]\d{6,14}$/, pp = "(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))", vp = /* @__PURE__ */ new RegExp(`^${pp}$`);
function yp(e) {
  const t = "(?:[01]\\d|2[0-3]):[0-5]\\d";
  return typeof e.precision == "number" ? e.precision === -1 ? `${t}` : e.precision === 0 ? `${t}:[0-5]\\d` : `${t}:[0-5]\\d\\.\\d{${e.precision}}` : `${t}(?::[0-5]\\d(?:\\.\\d+)?)?`;
}
function bp(e) {
  return new RegExp(`^${yp(e)}$`);
}
function wp(e) {
  const t = yp({ precision: e.precision }), n = ["Z"];
  e.local && n.push(""), e.offset && n.push("([+-](?:[01]\\d|2[0-3]):[0-5]\\d)");
  const o = `${t}(?:${n.join("|")})`;
  return new RegExp(`^${pp}T(?:${o})$`);
}
const _p = (e) => {
  const t = e ? `[\\s\\S]{${(e == null ? void 0 : e.minimum) ?? 0},${(e == null ? void 0 : e.maximum) ?? ""}}` : "[\\s\\S]*";
  return new RegExp(`^${t}$`);
}, $p = /^-?\d+n?$/, kp = /^-?\d+$/, Gu = /^-?\d+(?:\.\d+)?$/, xp = /^(?:true|false)$/i, Sp = /^null$/i, Dp = /^undefined$/i, Op = /^[^A-Z]*$/, Ip = /^[^a-z]*$/, Np = /^[0-9a-fA-F]*$/;
function yo(e, t) {
  return new RegExp(`^[A-Za-z0-9+/]{${e}}${t}$`);
}
function bo(e) {
  return new RegExp(`^[A-Za-z0-9_-]{${e}}$`);
}
const mO = /^[0-9a-fA-F]{32}$/, hO = /* @__PURE__ */ yo(22, "=="), gO = /* @__PURE__ */ bo(22), pO = /^[0-9a-fA-F]{40}$/, vO = /* @__PURE__ */ yo(27, "="), yO = /* @__PURE__ */ bo(27), bO = /^[0-9a-fA-F]{64}$/, wO = /* @__PURE__ */ yo(43, "="), _O = /* @__PURE__ */ bo(43), $O = /^[0-9a-fA-F]{96}$/, kO = /* @__PURE__ */ yo(64, ""), xO = /* @__PURE__ */ bo(64), SO = /^[0-9a-fA-F]{128}$/, DO = /* @__PURE__ */ yo(86, "=="), OO = /* @__PURE__ */ bo(86), za = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  base64: fp,
  base64url: Hu,
  bigint: $p,
  boolean: xp,
  browserEmail: dO,
  cidrv4: lp,
  cidrv6: dp,
  cuid: Jg,
  cuid2: Kg,
  date: vp,
  datetime: wp,
  domain: hp,
  duration: np,
  e164: gp,
  email: op,
  emoji: ap,
  extendedDuration: oO,
  guid: rp,
  hex: Np,
  hostname: mp,
  html5Email: cO,
  idnEmail: lO,
  integer: kp,
  ipv4: sp,
  ipv6: cp,
  ksuid: ep,
  lowercase: Op,
  mac: up,
  md5_base64: hO,
  md5_base64url: gO,
  md5_hex: mO,
  nanoid: tp,
  null: Sp,
  number: Gu,
  rfc5322Email: uO,
  sha1_base64: vO,
  sha1_base64url: yO,
  sha1_hex: pO,
  sha256_base64: wO,
  sha256_base64url: _O,
  sha256_hex: bO,
  sha384_base64: kO,
  sha384_base64url: xO,
  sha384_hex: $O,
  sha512_base64: DO,
  sha512_base64url: OO,
  sha512_hex: SO,
  string: _p,
  time: bp,
  ulid: Xg,
  undefined: Dp,
  unicodeEmail: ip,
  uppercase: Ip,
  uuid: fr,
  uuid4: iO,
  uuid6: aO,
  uuid7: sO,
  xid: Qg
}, Symbol.toStringTag, { value: "Module" })), xe = /* @__PURE__ */ k("$ZodCheck", (e, t) => {
  var n;
  e._zod ?? (e._zod = {}), e._zod.def = t, (n = e._zod).onattach ?? (n.onattach = []);
}), Ep = {
  number: "number",
  bigint: "bigint",
  object: "date"
}, Vu = /* @__PURE__ */ k("$ZodCheckLessThan", (e, t) => {
  xe.init(e, t);
  const n = Ep[typeof t.value];
  e._zod.onattach.push((o) => {
    const r = o._zod.bag, i = (t.inclusive ? r.maximum : r.exclusiveMaximum) ?? Number.POSITIVE_INFINITY;
    t.value < i && (t.inclusive ? r.maximum = t.value : r.exclusiveMaximum = t.value);
  }), e._zod.check = (o) => {
    (t.inclusive ? o.value <= t.value : o.value < t.value) || o.issues.push({
      origin: n,
      code: "too_big",
      maximum: typeof t.value == "object" ? t.value.getTime() : t.value,
      input: o.value,
      inclusive: t.inclusive,
      inst: e,
      continue: !t.abort
    });
  };
}), qu = /* @__PURE__ */ k("$ZodCheckGreaterThan", (e, t) => {
  xe.init(e, t);
  const n = Ep[typeof t.value];
  e._zod.onattach.push((o) => {
    const r = o._zod.bag, i = (t.inclusive ? r.minimum : r.exclusiveMinimum) ?? Number.NEGATIVE_INFINITY;
    t.value > i && (t.inclusive ? r.minimum = t.value : r.exclusiveMinimum = t.value);
  }), e._zod.check = (o) => {
    (t.inclusive ? o.value >= t.value : o.value > t.value) || o.issues.push({
      origin: n,
      code: "too_small",
      minimum: typeof t.value == "object" ? t.value.getTime() : t.value,
      input: o.value,
      inclusive: t.inclusive,
      inst: e,
      continue: !t.abort
    });
  };
}), Pp = /* @__PURE__ */ k("$ZodCheckMultipleOf", (e, t) => {
  xe.init(e, t), e._zod.onattach.push((n) => {
    var o;
    (o = n._zod.bag).multipleOf ?? (o.multipleOf = t.value);
  }), e._zod.check = (n) => {
    if (typeof n.value != typeof t.value)
      throw new Error("Cannot mix number and bigint in multiple_of check.");
    (typeof n.value == "bigint" ? n.value % t.value === BigInt(0) : Eg(n.value, t.value) === 0) || n.issues.push({
      origin: typeof n.value,
      code: "not_multiple_of",
      divisor: t.value,
      input: n.value,
      inst: e,
      continue: !t.abort
    });
  };
}), Tp = /* @__PURE__ */ k("$ZodCheckNumberFormat", (e, t) => {
  var a;
  xe.init(e, t), t.format = t.format || "float64";
  const n = (a = t.format) == null ? void 0 : a.includes("int"), o = n ? "int" : "number", [r, i] = zg[t.format];
  e._zod.onattach.push((s) => {
    const c = s._zod.bag;
    c.format = t.format, c.minimum = r, c.maximum = i, n && (c.pattern = kp);
  }), e._zod.check = (s) => {
    const c = s.value;
    if (n) {
      if (!Number.isInteger(c)) {
        s.issues.push({
          expected: o,
          format: t.format,
          code: "invalid_type",
          continue: !1,
          input: c,
          inst: e
        });
        return;
      }
      if (!Number.isSafeInteger(c)) {
        c > 0 ? s.issues.push({
          input: c,
          code: "too_big",
          maximum: Number.MAX_SAFE_INTEGER,
          note: "Integers must be within the safe integer range.",
          inst: e,
          origin: o,
          inclusive: !0,
          continue: !t.abort
        }) : s.issues.push({
          input: c,
          code: "too_small",
          minimum: Number.MIN_SAFE_INTEGER,
          note: "Integers must be within the safe integer range.",
          inst: e,
          origin: o,
          inclusive: !0,
          continue: !t.abort
        });
        return;
      }
    }
    c < r && s.issues.push({
      origin: "number",
      input: c,
      code: "too_small",
      minimum: r,
      inclusive: !0,
      inst: e,
      continue: !t.abort
    }), c > i && s.issues.push({
      origin: "number",
      input: c,
      code: "too_big",
      maximum: i,
      inclusive: !0,
      inst: e,
      continue: !t.abort
    });
  };
}), Cp = /* @__PURE__ */ k("$ZodCheckBigIntFormat", (e, t) => {
  xe.init(e, t);
  const [n, o] = Rg[t.format];
  e._zod.onattach.push((r) => {
    const i = r._zod.bag;
    i.format = t.format, i.minimum = n, i.maximum = o;
  }), e._zod.check = (r) => {
    const i = r.value;
    i < n && r.issues.push({
      origin: "bigint",
      input: i,
      code: "too_small",
      minimum: n,
      inclusive: !0,
      inst: e,
      continue: !t.abort
    }), i > o && r.issues.push({
      origin: "bigint",
      input: i,
      code: "too_big",
      maximum: o,
      inclusive: !0,
      inst: e,
      continue: !t.abort
    });
  };
}), Mp = /* @__PURE__ */ k("$ZodCheckMaxSize", (e, t) => {
  var n;
  xe.init(e, t), (n = e._zod.def).when ?? (n.when = (o) => {
    const r = o.value;
    return !Ln(r) && r.size !== void 0;
  }), e._zod.onattach.push((o) => {
    const r = o._zod.bag.maximum ?? Number.POSITIVE_INFINITY;
    t.maximum < r && (o._zod.bag.maximum = t.maximum);
  }), e._zod.check = (o) => {
    const r = o.value;
    r.size <= t.maximum || o.issues.push({
      origin: Pa(r),
      code: "too_big",
      maximum: t.maximum,
      inclusive: !0,
      input: r,
      inst: e,
      continue: !t.abort
    });
  };
}), zp = /* @__PURE__ */ k("$ZodCheckMinSize", (e, t) => {
  var n;
  xe.init(e, t), (n = e._zod.def).when ?? (n.when = (o) => {
    const r = o.value;
    return !Ln(r) && r.size !== void 0;
  }), e._zod.onattach.push((o) => {
    const r = o._zod.bag.minimum ?? Number.NEGATIVE_INFINITY;
    t.minimum > r && (o._zod.bag.minimum = t.minimum);
  }), e._zod.check = (o) => {
    const r = o.value;
    r.size >= t.minimum || o.issues.push({
      origin: Pa(r),
      code: "too_small",
      minimum: t.minimum,
      inclusive: !0,
      input: r,
      inst: e,
      continue: !t.abort
    });
  };
}), Rp = /* @__PURE__ */ k("$ZodCheckSizeEquals", (e, t) => {
  var n;
  xe.init(e, t), (n = e._zod.def).when ?? (n.when = (o) => {
    const r = o.value;
    return !Ln(r) && r.size !== void 0;
  }), e._zod.onattach.push((o) => {
    const r = o._zod.bag;
    r.minimum = t.size, r.maximum = t.size, r.size = t.size;
  }), e._zod.check = (o) => {
    const r = o.value, i = r.size;
    if (i === t.size)
      return;
    const a = i > t.size;
    o.issues.push({
      origin: Pa(r),
      ...a ? { code: "too_big", maximum: t.size } : { code: "too_small", minimum: t.size },
      inclusive: !0,
      exact: !0,
      input: o.value,
      inst: e,
      continue: !t.abort
    });
  };
}), Ap = /* @__PURE__ */ k("$ZodCheckMaxLength", (e, t) => {
  var n;
  xe.init(e, t), (n = e._zod.def).when ?? (n.when = (o) => {
    const r = o.value;
    return !Ln(r) && r.length !== void 0;
  }), e._zod.onattach.push((o) => {
    const r = o._zod.bag.maximum ?? Number.POSITIVE_INFINITY;
    t.maximum < r && (o._zod.bag.maximum = t.maximum);
  }), e._zod.check = (o) => {
    const r = o.value;
    if (r.length <= t.maximum)
      return;
    const a = Ta(r);
    o.issues.push({
      origin: a,
      code: "too_big",
      maximum: t.maximum,
      inclusive: !0,
      input: r,
      inst: e,
      continue: !t.abort
    });
  };
}), Up = /* @__PURE__ */ k("$ZodCheckMinLength", (e, t) => {
  var n;
  xe.init(e, t), (n = e._zod.def).when ?? (n.when = (o) => {
    const r = o.value;
    return !Ln(r) && r.length !== void 0;
  }), e._zod.onattach.push((o) => {
    const r = o._zod.bag.minimum ?? Number.NEGATIVE_INFINITY;
    t.minimum > r && (o._zod.bag.minimum = t.minimum);
  }), e._zod.check = (o) => {
    const r = o.value;
    if (r.length >= t.minimum)
      return;
    const a = Ta(r);
    o.issues.push({
      origin: a,
      code: "too_small",
      minimum: t.minimum,
      inclusive: !0,
      input: r,
      inst: e,
      continue: !t.abort
    });
  };
}), jp = /* @__PURE__ */ k("$ZodCheckLengthEquals", (e, t) => {
  var n;
  xe.init(e, t), (n = e._zod.def).when ?? (n.when = (o) => {
    const r = o.value;
    return !Ln(r) && r.length !== void 0;
  }), e._zod.onattach.push((o) => {
    const r = o._zod.bag;
    r.minimum = t.length, r.maximum = t.length, r.length = t.length;
  }), e._zod.check = (o) => {
    const r = o.value, i = r.length;
    if (i === t.length)
      return;
    const a = Ta(r), s = i > t.length;
    o.issues.push({
      origin: a,
      ...s ? { code: "too_big", maximum: t.length } : { code: "too_small", minimum: t.length },
      inclusive: !0,
      exact: !0,
      input: o.value,
      inst: e,
      continue: !t.abort
    });
  };
}), wo = /* @__PURE__ */ k("$ZodCheckStringFormat", (e, t) => {
  var n, o;
  xe.init(e, t), e._zod.onattach.push((r) => {
    const i = r._zod.bag;
    i.format = t.format, t.pattern && (i.patterns ?? (i.patterns = /* @__PURE__ */ new Set()), i.patterns.add(t.pattern));
  }), t.pattern ? (n = e._zod).check ?? (n.check = (r) => {
    t.pattern.lastIndex = 0, !t.pattern.test(r.value) && r.issues.push({
      origin: "string",
      code: "invalid_format",
      format: t.format,
      input: r.value,
      ...t.pattern ? { pattern: t.pattern.toString() } : {},
      inst: e,
      continue: !t.abort
    });
  }) : (o = e._zod).check ?? (o.check = () => {
  });
}), Fp = /* @__PURE__ */ k("$ZodCheckRegex", (e, t) => {
  wo.init(e, t), e._zod.check = (n) => {
    t.pattern.lastIndex = 0, !t.pattern.test(n.value) && n.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "regex",
      input: n.value,
      pattern: t.pattern.toString(),
      inst: e,
      continue: !t.abort
    });
  };
}), Wp = /* @__PURE__ */ k("$ZodCheckLowerCase", (e, t) => {
  t.pattern ?? (t.pattern = Op), wo.init(e, t);
}), Lp = /* @__PURE__ */ k("$ZodCheckUpperCase", (e, t) => {
  t.pattern ?? (t.pattern = Ip), wo.init(e, t);
}), Zp = /* @__PURE__ */ k("$ZodCheckIncludes", (e, t) => {
  xe.init(e, t);
  const n = Xt(t.includes), o = new RegExp(typeof t.position == "number" ? `^.{${t.position}}${n}` : n);
  t.pattern = o, e._zod.onattach.push((r) => {
    const i = r._zod.bag;
    i.patterns ?? (i.patterns = /* @__PURE__ */ new Set()), i.patterns.add(o);
  }), e._zod.check = (r) => {
    r.value.includes(t.includes, t.position) || r.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "includes",
      includes: t.includes,
      input: r.value,
      inst: e,
      continue: !t.abort
    });
  };
}), Yp = /* @__PURE__ */ k("$ZodCheckStartsWith", (e, t) => {
  xe.init(e, t);
  const n = new RegExp(`^${Xt(t.prefix)}.*`);
  t.pattern ?? (t.pattern = n), e._zod.onattach.push((o) => {
    const r = o._zod.bag;
    r.patterns ?? (r.patterns = /* @__PURE__ */ new Set()), r.patterns.add(n);
  }), e._zod.check = (o) => {
    o.value.startsWith(t.prefix) || o.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "starts_with",
      prefix: t.prefix,
      input: o.value,
      inst: e,
      continue: !t.abort
    });
  };
}), Bp = /* @__PURE__ */ k("$ZodCheckEndsWith", (e, t) => {
  xe.init(e, t);
  const n = new RegExp(`.*${Xt(t.suffix)}$`);
  t.pattern ?? (t.pattern = n), e._zod.onattach.push((o) => {
    const r = o._zod.bag;
    r.patterns ?? (r.patterns = /* @__PURE__ */ new Set()), r.patterns.add(n);
  }), e._zod.check = (o) => {
    o.value.endsWith(t.suffix) || o.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "ends_with",
      suffix: t.suffix,
      input: o.value,
      inst: e,
      continue: !t.abort
    });
  };
});
function Tm(e, t, n) {
  e.issues.length && t.issues.push(...vt(n, e.issues));
}
const Hp = /* @__PURE__ */ k("$ZodCheckProperty", (e, t) => {
  xe.init(e, t), e._zod.check = (n) => {
    const o = t.schema._zod.run({
      value: n.value[t.property],
      issues: []
    }, {});
    if (o instanceof Promise)
      return o.then((r) => Tm(r, n, t.property));
    Tm(o, n, t.property);
  };
}), Gp = /* @__PURE__ */ k("$ZodCheckMimeType", (e, t) => {
  xe.init(e, t);
  const n = new Set(t.mime);
  e._zod.onattach.push((o) => {
    o._zod.bag.mime = t.mime;
  }), e._zod.check = (o) => {
    n.has(o.value.type) || o.issues.push({
      code: "invalid_value",
      values: t.mime,
      input: o.value.type,
      inst: e,
      continue: !t.abort
    });
  };
}), Vp = /* @__PURE__ */ k("$ZodCheckOverwrite", (e, t) => {
  xe.init(e, t), e._zod.check = (n) => {
    n.value = t.tx(n.value);
  };
});
class qp {
  constructor(t = []) {
    this.content = [], this.indent = 0, this && (this.args = t);
  }
  indented(t) {
    this.indent += 1, t(this), this.indent -= 1;
  }
  write(t) {
    if (typeof t == "function") {
      t(this, { execution: "sync" }), t(this, { execution: "async" });
      return;
    }
    const o = t.split(`
`).filter((a) => a), r = Math.min(...o.map((a) => a.length - a.trimStart().length)), i = o.map((a) => a.slice(r)).map((a) => " ".repeat(this.indent * 2) + a);
    for (const a of i)
      this.content.push(a);
  }
  compile() {
    const t = Function, n = this == null ? void 0 : this.args, r = [...((this == null ? void 0 : this.content) ?? [""]).map((i) => `  ${i}`)];
    return new t(...n, r.join(`
`));
  }
}
const Jp = {
  major: 4,
  minor: 3,
  patch: 6
}, ee = /* @__PURE__ */ k("$ZodType", (e, t) => {
  var r;
  var n;
  e ?? (e = {}), e._zod.def = t, e._zod.bag = e._zod.bag || {}, e._zod.version = Jp;
  const o = [...e._zod.def.checks ?? []];
  e._zod.traits.has("$ZodCheck") && o.unshift(e);
  for (const i of o)
    for (const a of i._zod.onattach)
      a(e);
  if (o.length === 0)
    (n = e._zod).deferred ?? (n.deferred = []), (r = e._zod.deferred) == null || r.push(() => {
      e._zod.run = e._zod.parse;
    });
  else {
    const i = (s, c, u) => {
      let l = Pn(s), d;
      for (const f of c) {
        if (f._zod.def.when) {
          if (!f._zod.def.when(s))
            continue;
        } else if (l)
          continue;
        const h = s.issues.length, g = f._zod.check(s);
        if (g instanceof Promise && (u == null ? void 0 : u.async) === !1)
          throw new Mn();
        if (d || g instanceof Promise)
          d = (d ?? Promise.resolve()).then(async () => {
            await g, s.issues.length !== h && (l || (l = Pn(s, h)));
          });
        else {
          if (s.issues.length === h)
            continue;
          l || (l = Pn(s, h));
        }
      }
      return d ? d.then(() => s) : s;
    }, a = (s, c, u) => {
      if (Pn(s))
        return s.aborted = !0, s;
      const l = i(c, o, u);
      if (l instanceof Promise) {
        if (u.async === !1)
          throw new Mn();
        return l.then((d) => e._zod.parse(d, u));
      }
      return e._zod.parse(l, u);
    };
    e._zod.run = (s, c) => {
      if (c.skipChecks)
        return e._zod.parse(s, c);
      if (c.direction === "backward") {
        const l = e._zod.parse({ value: s.value, issues: [] }, { ...c, skipChecks: !0 });
        return l instanceof Promise ? l.then((d) => a(d, s, c)) : a(l, s, c);
      }
      const u = e._zod.parse(s, c);
      if (u instanceof Promise) {
        if (c.async === !1)
          throw new Mn();
        return u.then((l) => i(l, o, c));
      }
      return i(u, o, c);
    };
  }
  ie(e, "~standard", () => ({
    validate: (i) => {
      var a;
      try {
        const s = Vg(e, i);
        return s.success ? { value: s.data } : { issues: (a = s.error) == null ? void 0 : a.issues };
      } catch {
        return qg(e, i).then((c) => {
          var u;
          return c.success ? { value: c.data } : { issues: (u = c.error) == null ? void 0 : u.issues };
        });
      }
    },
    vendor: "zod",
    version: 1
  }));
}), _o = /* @__PURE__ */ k("$ZodString", (e, t) => {
  var n;
  ee.init(e, t), e._zod.pattern = [...((n = e == null ? void 0 : e._zod.bag) == null ? void 0 : n.patterns) ?? []].pop() ?? _p(e._zod.bag), e._zod.parse = (o, r) => {
    if (t.coerce)
      try {
        o.value = String(o.value);
      } catch {
      }
    return typeof o.value == "string" || o.issues.push({
      expected: "string",
      code: "invalid_type",
      input: o.value,
      inst: e
    }), o;
  };
}), $e = /* @__PURE__ */ k("$ZodStringFormat", (e, t) => {
  wo.init(e, t), _o.init(e, t);
}), Kp = /* @__PURE__ */ k("$ZodGUID", (e, t) => {
  t.pattern ?? (t.pattern = rp), $e.init(e, t);
}), Xp = /* @__PURE__ */ k("$ZodUUID", (e, t) => {
  if (t.version) {
    const o = {
      v1: 1,
      v2: 2,
      v3: 3,
      v4: 4,
      v5: 5,
      v6: 6,
      v7: 7,
      v8: 8
    }[t.version];
    if (o === void 0)
      throw new Error(`Invalid UUID version: "${t.version}"`);
    t.pattern ?? (t.pattern = fr(o));
  } else
    t.pattern ?? (t.pattern = fr());
  $e.init(e, t);
}), Qp = /* @__PURE__ */ k("$ZodEmail", (e, t) => {
  t.pattern ?? (t.pattern = op), $e.init(e, t);
}), ev = /* @__PURE__ */ k("$ZodURL", (e, t) => {
  $e.init(e, t), e._zod.check = (n) => {
    try {
      const o = n.value.trim(), r = new URL(o);
      t.hostname && (t.hostname.lastIndex = 0, t.hostname.test(r.hostname) || n.issues.push({
        code: "invalid_format",
        format: "url",
        note: "Invalid hostname",
        pattern: t.hostname.source,
        input: n.value,
        inst: e,
        continue: !t.abort
      })), t.protocol && (t.protocol.lastIndex = 0, t.protocol.test(r.protocol.endsWith(":") ? r.protocol.slice(0, -1) : r.protocol) || n.issues.push({
        code: "invalid_format",
        format: "url",
        note: "Invalid protocol",
        pattern: t.protocol.source,
        input: n.value,
        inst: e,
        continue: !t.abort
      })), t.normalize ? n.value = r.href : n.value = o;
      return;
    } catch {
      n.issues.push({
        code: "invalid_format",
        format: "url",
        input: n.value,
        inst: e,
        continue: !t.abort
      });
    }
  };
}), tv = /* @__PURE__ */ k("$ZodEmoji", (e, t) => {
  t.pattern ?? (t.pattern = ap()), $e.init(e, t);
}), nv = /* @__PURE__ */ k("$ZodNanoID", (e, t) => {
  t.pattern ?? (t.pattern = tp), $e.init(e, t);
}), rv = /* @__PURE__ */ k("$ZodCUID", (e, t) => {
  t.pattern ?? (t.pattern = Jg), $e.init(e, t);
}), ov = /* @__PURE__ */ k("$ZodCUID2", (e, t) => {
  t.pattern ?? (t.pattern = Kg), $e.init(e, t);
}), iv = /* @__PURE__ */ k("$ZodULID", (e, t) => {
  t.pattern ?? (t.pattern = Xg), $e.init(e, t);
}), av = /* @__PURE__ */ k("$ZodXID", (e, t) => {
  t.pattern ?? (t.pattern = Qg), $e.init(e, t);
}), sv = /* @__PURE__ */ k("$ZodKSUID", (e, t) => {
  t.pattern ?? (t.pattern = ep), $e.init(e, t);
}), cv = /* @__PURE__ */ k("$ZodISODateTime", (e, t) => {
  t.pattern ?? (t.pattern = wp(t)), $e.init(e, t);
}), uv = /* @__PURE__ */ k("$ZodISODate", (e, t) => {
  t.pattern ?? (t.pattern = vp), $e.init(e, t);
}), lv = /* @__PURE__ */ k("$ZodISOTime", (e, t) => {
  t.pattern ?? (t.pattern = bp(t)), $e.init(e, t);
}), dv = /* @__PURE__ */ k("$ZodISODuration", (e, t) => {
  t.pattern ?? (t.pattern = np), $e.init(e, t);
}), fv = /* @__PURE__ */ k("$ZodIPv4", (e, t) => {
  t.pattern ?? (t.pattern = sp), $e.init(e, t), e._zod.bag.format = "ipv4";
}), mv = /* @__PURE__ */ k("$ZodIPv6", (e, t) => {
  t.pattern ?? (t.pattern = cp), $e.init(e, t), e._zod.bag.format = "ipv6", e._zod.check = (n) => {
    try {
      new URL(`http://[${n.value}]`);
    } catch {
      n.issues.push({
        code: "invalid_format",
        format: "ipv6",
        input: n.value,
        inst: e,
        continue: !t.abort
      });
    }
  };
}), hv = /* @__PURE__ */ k("$ZodMAC", (e, t) => {
  t.pattern ?? (t.pattern = up(t.delimiter)), $e.init(e, t), e._zod.bag.format = "mac";
}), gv = /* @__PURE__ */ k("$ZodCIDRv4", (e, t) => {
  t.pattern ?? (t.pattern = lp), $e.init(e, t);
}), pv = /* @__PURE__ */ k("$ZodCIDRv6", (e, t) => {
  t.pattern ?? (t.pattern = dp), $e.init(e, t), e._zod.check = (n) => {
    const o = n.value.split("/");
    try {
      if (o.length !== 2)
        throw new Error();
      const [r, i] = o;
      if (!i)
        throw new Error();
      const a = Number(i);
      if (`${a}` !== i)
        throw new Error();
      if (a < 0 || a > 128)
        throw new Error();
      new URL(`http://[${r}]`);
    } catch {
      n.issues.push({
        code: "invalid_format",
        format: "cidrv6",
        input: n.value,
        inst: e,
        continue: !t.abort
      });
    }
  };
});
function Ju(e) {
  if (e === "")
    return !0;
  if (e.length % 4 !== 0)
    return !1;
  try {
    return atob(e), !0;
  } catch {
    return !1;
  }
}
const vv = /* @__PURE__ */ k("$ZodBase64", (e, t) => {
  t.pattern ?? (t.pattern = fp), $e.init(e, t), e._zod.bag.contentEncoding = "base64", e._zod.check = (n) => {
    Ju(n.value) || n.issues.push({
      code: "invalid_format",
      format: "base64",
      input: n.value,
      inst: e,
      continue: !t.abort
    });
  };
});
function yv(e) {
  if (!Hu.test(e))
    return !1;
  const t = e.replace(/[-_]/g, (o) => o === "-" ? "+" : "/"), n = t.padEnd(Math.ceil(t.length / 4) * 4, "=");
  return Ju(n);
}
const bv = /* @__PURE__ */ k("$ZodBase64URL", (e, t) => {
  t.pattern ?? (t.pattern = Hu), $e.init(e, t), e._zod.bag.contentEncoding = "base64url", e._zod.check = (n) => {
    yv(n.value) || n.issues.push({
      code: "invalid_format",
      format: "base64url",
      input: n.value,
      inst: e,
      continue: !t.abort
    });
  };
}), wv = /* @__PURE__ */ k("$ZodE164", (e, t) => {
  t.pattern ?? (t.pattern = gp), $e.init(e, t);
});
function _v(e, t = null) {
  try {
    const n = e.split(".");
    if (n.length !== 3)
      return !1;
    const [o] = n;
    if (!o)
      return !1;
    const r = JSON.parse(atob(o));
    return !("typ" in r && (r == null ? void 0 : r.typ) !== "JWT" || !r.alg || t && (!("alg" in r) || r.alg !== t));
  } catch {
    return !1;
  }
}
const $v = /* @__PURE__ */ k("$ZodJWT", (e, t) => {
  $e.init(e, t), e._zod.check = (n) => {
    _v(n.value, t.alg) || n.issues.push({
      code: "invalid_format",
      format: "jwt",
      input: n.value,
      inst: e,
      continue: !t.abort
    });
  };
}), kv = /* @__PURE__ */ k("$ZodCustomStringFormat", (e, t) => {
  $e.init(e, t), e._zod.check = (n) => {
    t.fn(n.value) || n.issues.push({
      code: "invalid_format",
      format: t.format,
      input: n.value,
      inst: e,
      continue: !t.abort
    });
  };
}), Ku = /* @__PURE__ */ k("$ZodNumber", (e, t) => {
  ee.init(e, t), e._zod.pattern = e._zod.bag.pattern ?? Gu, e._zod.parse = (n, o) => {
    if (t.coerce)
      try {
        n.value = Number(n.value);
      } catch {
      }
    const r = n.value;
    if (typeof r == "number" && !Number.isNaN(r) && Number.isFinite(r))
      return n;
    const i = typeof r == "number" ? Number.isNaN(r) ? "NaN" : Number.isFinite(r) ? void 0 : "Infinity" : void 0;
    return n.issues.push({
      expected: "number",
      code: "invalid_type",
      input: r,
      inst: e,
      ...i ? { received: i } : {}
    }), n;
  };
}), xv = /* @__PURE__ */ k("$ZodNumberFormat", (e, t) => {
  Tp.init(e, t), Ku.init(e, t);
}), Xu = /* @__PURE__ */ k("$ZodBoolean", (e, t) => {
  ee.init(e, t), e._zod.pattern = xp, e._zod.parse = (n, o) => {
    if (t.coerce)
      try {
        n.value = !!n.value;
      } catch {
      }
    const r = n.value;
    return typeof r == "boolean" || n.issues.push({
      expected: "boolean",
      code: "invalid_type",
      input: r,
      inst: e
    }), n;
  };
}), Qu = /* @__PURE__ */ k("$ZodBigInt", (e, t) => {
  ee.init(e, t), e._zod.pattern = $p, e._zod.parse = (n, o) => {
    if (t.coerce)
      try {
        n.value = BigInt(n.value);
      } catch {
      }
    return typeof n.value == "bigint" || n.issues.push({
      expected: "bigint",
      code: "invalid_type",
      input: n.value,
      inst: e
    }), n;
  };
}), Sv = /* @__PURE__ */ k("$ZodBigIntFormat", (e, t) => {
  Cp.init(e, t), Qu.init(e, t);
}), Dv = /* @__PURE__ */ k("$ZodSymbol", (e, t) => {
  ee.init(e, t), e._zod.parse = (n, o) => {
    const r = n.value;
    return typeof r == "symbol" || n.issues.push({
      expected: "symbol",
      code: "invalid_type",
      input: r,
      inst: e
    }), n;
  };
}), Ov = /* @__PURE__ */ k("$ZodUndefined", (e, t) => {
  ee.init(e, t), e._zod.pattern = Dp, e._zod.values = /* @__PURE__ */ new Set([void 0]), e._zod.optin = "optional", e._zod.optout = "optional", e._zod.parse = (n, o) => {
    const r = n.value;
    return typeof r > "u" || n.issues.push({
      expected: "undefined",
      code: "invalid_type",
      input: r,
      inst: e
    }), n;
  };
}), Iv = /* @__PURE__ */ k("$ZodNull", (e, t) => {
  ee.init(e, t), e._zod.pattern = Sp, e._zod.values = /* @__PURE__ */ new Set([null]), e._zod.parse = (n, o) => {
    const r = n.value;
    return r === null || n.issues.push({
      expected: "null",
      code: "invalid_type",
      input: r,
      inst: e
    }), n;
  };
}), Nv = /* @__PURE__ */ k("$ZodAny", (e, t) => {
  ee.init(e, t), e._zod.parse = (n) => n;
}), Ev = /* @__PURE__ */ k("$ZodUnknown", (e, t) => {
  ee.init(e, t), e._zod.parse = (n) => n;
}), Pv = /* @__PURE__ */ k("$ZodNever", (e, t) => {
  ee.init(e, t), e._zod.parse = (n, o) => (n.issues.push({
    expected: "never",
    code: "invalid_type",
    input: n.value,
    inst: e
  }), n);
}), Tv = /* @__PURE__ */ k("$ZodVoid", (e, t) => {
  ee.init(e, t), e._zod.parse = (n, o) => {
    const r = n.value;
    return typeof r > "u" || n.issues.push({
      expected: "void",
      code: "invalid_type",
      input: r,
      inst: e
    }), n;
  };
}), Cv = /* @__PURE__ */ k("$ZodDate", (e, t) => {
  ee.init(e, t), e._zod.parse = (n, o) => {
    if (t.coerce)
      try {
        n.value = new Date(n.value);
      } catch {
      }
    const r = n.value, i = r instanceof Date;
    return i && !Number.isNaN(r.getTime()) || n.issues.push({
      expected: "date",
      code: "invalid_type",
      input: r,
      ...i ? { received: "Invalid Date" } : {},
      inst: e
    }), n;
  };
});
function Cm(e, t, n) {
  e.issues.length && t.issues.push(...vt(n, e.issues)), t.value[n] = e.value;
}
const Mv = /* @__PURE__ */ k("$ZodArray", (e, t) => {
  ee.init(e, t), e._zod.parse = (n, o) => {
    const r = n.value;
    if (!Array.isArray(r))
      return n.issues.push({
        expected: "array",
        code: "invalid_type",
        input: r,
        inst: e
      }), n;
    n.value = Array(r.length);
    const i = [];
    for (let a = 0; a < r.length; a++) {
      const s = r[a], c = t.element._zod.run({
        value: s,
        issues: []
      }, o);
      c instanceof Promise ? i.push(c.then((u) => Cm(u, n, a))) : Cm(c, n, a);
    }
    return i.length ? Promise.all(i).then(() => n) : n;
  };
});
function ta(e, t, n, o, r) {
  if (e.issues.length) {
    if (r && !(n in o))
      return;
    t.issues.push(...vt(n, e.issues));
  }
  e.value === void 0 ? n in o && (t.value[n] = void 0) : t.value[n] = e.value;
}
function zv(e) {
  var o, r, i, a;
  const t = Object.keys(e.shape);
  for (const s of t)
    if (!((a = (i = (r = (o = e.shape) == null ? void 0 : o[s]) == null ? void 0 : r._zod) == null ? void 0 : i.traits) != null && a.has("$ZodType")))
      throw new Error(`Invalid element at key "${s}": expected a Zod schema`);
  const n = Mg(e.shape);
  return {
    ...e,
    keys: t,
    keySet: new Set(t),
    numKeys: t.length,
    optionalKeys: new Set(n)
  };
}
function Rv(e, t, n, o, r, i) {
  const a = [], s = r.keySet, c = r.catchall._zod, u = c.def.type, l = c.optout === "optional";
  for (const d in t) {
    if (s.has(d))
      continue;
    if (u === "never") {
      a.push(d);
      continue;
    }
    const f = c.run({ value: t[d], issues: [] }, o);
    f instanceof Promise ? e.push(f.then((h) => ta(h, n, d, t, l))) : ta(f, n, d, t, l);
  }
  return a.length && n.issues.push({
    code: "unrecognized_keys",
    keys: a,
    input: t,
    inst: i
  }), e.length ? Promise.all(e).then(() => n) : n;
}
const Av = /* @__PURE__ */ k("$ZodObject", (e, t) => {
  ee.init(e, t);
  const n = Object.getOwnPropertyDescriptor(t, "shape");
  if (!(n != null && n.get)) {
    const s = t.shape;
    Object.defineProperty(t, "shape", {
      get: () => {
        const c = { ...s };
        return Object.defineProperty(t, "shape", {
          value: c
        }), c;
      }
    });
  }
  const o = mo(() => zv(t));
  ie(e._zod, "propValues", () => {
    const s = t.shape, c = {};
    for (const u in s) {
      const l = s[u]._zod;
      if (l.values) {
        c[u] ?? (c[u] = /* @__PURE__ */ new Set());
        for (const d of l.values)
          c[u].add(d);
      }
    }
    return c;
  });
  const r = lr, i = t.catchall;
  let a;
  e._zod.parse = (s, c) => {
    a ?? (a = o.value);
    const u = s.value;
    if (!r(u))
      return s.issues.push({
        expected: "object",
        code: "invalid_type",
        input: u,
        inst: e
      }), s;
    s.value = {};
    const l = [], d = a.shape;
    for (const f of a.keys) {
      const h = d[f], g = h._zod.optout === "optional", p = h._zod.run({ value: u[f], issues: [] }, c);
      p instanceof Promise ? l.push(p.then((v) => ta(v, s, f, u, g))) : ta(p, s, f, u, g);
    }
    return i ? Rv(l, u, s, c, o.value, e) : l.length ? Promise.all(l).then(() => s) : s;
  };
}), Uv = /* @__PURE__ */ k("$ZodObjectJIT", (e, t) => {
  Av.init(e, t);
  const n = e._zod.parse, o = mo(() => zv(t)), r = (f) => {
    var $;
    const h = new qp(["shape", "payload", "ctx"]), g = o.value, p = (x) => {
      const S = nu(x);
      return `shape[${S}]._zod.run({ value: input[${S}], issues: [] }, ctx)`;
    };
    h.write("const input = payload.value;");
    const v = /* @__PURE__ */ Object.create(null);
    let b = 0;
    for (const x of g.keys)
      v[x] = `key_${b++}`;
    h.write("const newResult = {};");
    for (const x of g.keys) {
      const S = v[x], w = nu(x), I = f[x], D = (($ = I == null ? void 0 : I._zod) == null ? void 0 : $.optout) === "optional";
      h.write(`const ${S} = ${p(x)};`), D ? h.write(`
        if (${S}.issues.length) {
          if (${w} in input) {
            payload.issues = payload.issues.concat(${S}.issues.map(iss => ({
              ...iss,
              path: iss.path ? [${w}, ...iss.path] : [${w}]
            })));
          }
        }
        
        if (${S}.value === undefined) {
          if (${w} in input) {
            newResult[${w}] = undefined;
          }
        } else {
          newResult[${w}] = ${S}.value;
        }
        
      `) : h.write(`
        if (${S}.issues.length) {
          payload.issues = payload.issues.concat(${S}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${w}, ...iss.path] : [${w}]
          })));
        }
        
        if (${S}.value === undefined) {
          if (${w} in input) {
            newResult[${w}] = undefined;
          }
        } else {
          newResult[${w}] = ${S}.value;
        }
        
      `);
    }
    h.write("payload.value = newResult;"), h.write("return payload;");
    const _ = h.compile();
    return (x, S) => _(f, x, S);
  };
  let i;
  const a = lr, s = !Xi.jitless, u = s && Tg.value, l = t.catchall;
  let d;
  e._zod.parse = (f, h) => {
    d ?? (d = o.value);
    const g = f.value;
    return a(g) ? s && u && (h == null ? void 0 : h.async) === !1 && h.jitless !== !0 ? (i || (i = r(t.shape)), f = i(f, h), l ? Rv([], g, f, h, d, e) : f) : n(f, h) : (f.issues.push({
      expected: "object",
      code: "invalid_type",
      input: g,
      inst: e
    }), f);
  };
});
function Mm(e, t, n, o) {
  for (const i of e)
    if (i.issues.length === 0)
      return t.value = i.value, t;
  const r = e.filter((i) => !Pn(i));
  return r.length === 1 ? (t.value = r[0].value, r[0]) : (t.issues.push({
    code: "invalid_union",
    input: t.value,
    inst: n,
    errors: e.map((i) => i.issues.map((a) => mt(a, o, Ue())))
  }), t);
}
const Ra = /* @__PURE__ */ k("$ZodUnion", (e, t) => {
  ee.init(e, t), ie(e._zod, "optin", () => t.options.some((r) => r._zod.optin === "optional") ? "optional" : void 0), ie(e._zod, "optout", () => t.options.some((r) => r._zod.optout === "optional") ? "optional" : void 0), ie(e._zod, "values", () => {
    if (t.options.every((r) => r._zod.values))
      return new Set(t.options.flatMap((r) => Array.from(r._zod.values)));
  }), ie(e._zod, "pattern", () => {
    if (t.options.every((r) => r._zod.pattern)) {
      const r = t.options.map((i) => i._zod.pattern);
      return new RegExp(`^(${r.map((i) => Na(i.source)).join("|")})$`);
    }
  });
  const n = t.options.length === 1, o = t.options[0]._zod.run;
  e._zod.parse = (r, i) => {
    if (n)
      return o(r, i);
    let a = !1;
    const s = [];
    for (const c of t.options) {
      const u = c._zod.run({
        value: r.value,
        issues: []
      }, i);
      if (u instanceof Promise)
        s.push(u), a = !0;
      else {
        if (u.issues.length === 0)
          return u;
        s.push(u);
      }
    }
    return a ? Promise.all(s).then((c) => Mm(c, r, e, i)) : Mm(s, r, e, i);
  };
});
function zm(e, t, n, o) {
  const r = e.filter((i) => i.issues.length === 0);
  return r.length === 1 ? (t.value = r[0].value, t) : (r.length === 0 ? t.issues.push({
    code: "invalid_union",
    input: t.value,
    inst: n,
    errors: e.map((i) => i.issues.map((a) => mt(a, o, Ue())))
  }) : t.issues.push({
    code: "invalid_union",
    input: t.value,
    inst: n,
    errors: [],
    inclusive: !1
  }), t);
}
const jv = /* @__PURE__ */ k("$ZodXor", (e, t) => {
  Ra.init(e, t), t.inclusive = !1;
  const n = t.options.length === 1, o = t.options[0]._zod.run;
  e._zod.parse = (r, i) => {
    if (n)
      return o(r, i);
    let a = !1;
    const s = [];
    for (const c of t.options) {
      const u = c._zod.run({
        value: r.value,
        issues: []
      }, i);
      u instanceof Promise ? (s.push(u), a = !0) : s.push(u);
    }
    return a ? Promise.all(s).then((c) => zm(c, r, e, i)) : zm(s, r, e, i);
  };
}), Fv = /* @__PURE__ */ k("$ZodDiscriminatedUnion", (e, t) => {
  t.inclusive = !1, Ra.init(e, t);
  const n = e._zod.parse;
  ie(e._zod, "propValues", () => {
    const r = {};
    for (const i of t.options) {
      const a = i._zod.propValues;
      if (!a || Object.keys(a).length === 0)
        throw new Error(`Invalid discriminated union option at index "${t.options.indexOf(i)}"`);
      for (const [s, c] of Object.entries(a)) {
        r[s] || (r[s] = /* @__PURE__ */ new Set());
        for (const u of c)
          r[s].add(u);
      }
    }
    return r;
  });
  const o = mo(() => {
    var a;
    const r = t.options, i = /* @__PURE__ */ new Map();
    for (const s of r) {
      const c = (a = s._zod.propValues) == null ? void 0 : a[t.discriminator];
      if (!c || c.size === 0)
        throw new Error(`Invalid discriminated union option at index "${t.options.indexOf(s)}"`);
      for (const u of c) {
        if (i.has(u))
          throw new Error(`Duplicate discriminator value "${String(u)}"`);
        i.set(u, s);
      }
    }
    return i;
  });
  e._zod.parse = (r, i) => {
    const a = r.value;
    if (!lr(a))
      return r.issues.push({
        code: "invalid_type",
        expected: "object",
        input: a,
        inst: e
      }), r;
    const s = o.value.get(a == null ? void 0 : a[t.discriminator]);
    return s ? s._zod.run(r, i) : t.unionFallback ? n(r, i) : (r.issues.push({
      code: "invalid_union",
      errors: [],
      note: "No matching discriminator",
      discriminator: t.discriminator,
      input: a,
      path: [t.discriminator],
      inst: e
    }), r);
  };
}), Wv = /* @__PURE__ */ k("$ZodIntersection", (e, t) => {
  ee.init(e, t), e._zod.parse = (n, o) => {
    const r = n.value, i = t.left._zod.run({ value: r, issues: [] }, o), a = t.right._zod.run({ value: r, issues: [] }, o);
    return i instanceof Promise || a instanceof Promise ? Promise.all([i, a]).then(([c, u]) => Rm(n, c, u)) : Rm(n, i, a);
  };
});
function iu(e, t) {
  if (e === t)
    return { valid: !0, data: e };
  if (e instanceof Date && t instanceof Date && +e == +t)
    return { valid: !0, data: e };
  if (Rn(e) && Rn(t)) {
    const n = Object.keys(t), o = Object.keys(e).filter((i) => n.indexOf(i) !== -1), r = { ...e, ...t };
    for (const i of o) {
      const a = iu(e[i], t[i]);
      if (!a.valid)
        return {
          valid: !1,
          mergeErrorPath: [i, ...a.mergeErrorPath]
        };
      r[i] = a.data;
    }
    return { valid: !0, data: r };
  }
  if (Array.isArray(e) && Array.isArray(t)) {
    if (e.length !== t.length)
      return { valid: !1, mergeErrorPath: [] };
    const n = [];
    for (let o = 0; o < e.length; o++) {
      const r = e[o], i = t[o], a = iu(r, i);
      if (!a.valid)
        return {
          valid: !1,
          mergeErrorPath: [o, ...a.mergeErrorPath]
        };
      n.push(a.data);
    }
    return { valid: !0, data: n };
  }
  return { valid: !1, mergeErrorPath: [] };
}
function Rm(e, t, n) {
  const o = /* @__PURE__ */ new Map();
  let r;
  for (const s of t.issues)
    if (s.code === "unrecognized_keys") {
      r ?? (r = s);
      for (const c of s.keys)
        o.has(c) || o.set(c, {}), o.get(c).l = !0;
    } else
      e.issues.push(s);
  for (const s of n.issues)
    if (s.code === "unrecognized_keys")
      for (const c of s.keys)
        o.has(c) || o.set(c, {}), o.get(c).r = !0;
    else
      e.issues.push(s);
  const i = [...o].filter(([, s]) => s.l && s.r).map(([s]) => s);
  if (i.length && r && e.issues.push({ ...r, keys: i }), Pn(e))
    return e;
  const a = iu(t.value, n.value);
  if (!a.valid)
    throw new Error(`Unmergable intersection. Error path: ${JSON.stringify(a.mergeErrorPath)}`);
  return e.value = a.data, e;
}
const el = /* @__PURE__ */ k("$ZodTuple", (e, t) => {
  ee.init(e, t);
  const n = t.items;
  e._zod.parse = (o, r) => {
    const i = o.value;
    if (!Array.isArray(i))
      return o.issues.push({
        input: i,
        inst: e,
        expected: "tuple",
        code: "invalid_type"
      }), o;
    o.value = [];
    const a = [], s = [...n].reverse().findIndex((l) => l._zod.optin !== "optional"), c = s === -1 ? 0 : n.length - s;
    if (!t.rest) {
      const l = i.length > n.length, d = i.length < c - 1;
      if (l || d)
        return o.issues.push({
          ...l ? { code: "too_big", maximum: n.length, inclusive: !0 } : { code: "too_small", minimum: n.length },
          input: i,
          inst: e,
          origin: "array"
        }), o;
    }
    let u = -1;
    for (const l of n) {
      if (u++, u >= i.length && u >= c)
        continue;
      const d = l._zod.run({
        value: i[u],
        issues: []
      }, r);
      d instanceof Promise ? a.push(d.then((f) => Di(f, o, u))) : Di(d, o, u);
    }
    if (t.rest) {
      const l = i.slice(n.length);
      for (const d of l) {
        u++;
        const f = t.rest._zod.run({
          value: d,
          issues: []
        }, r);
        f instanceof Promise ? a.push(f.then((h) => Di(h, o, u))) : Di(f, o, u);
      }
    }
    return a.length ? Promise.all(a).then(() => o) : o;
  };
});
function Di(e, t, n) {
  e.issues.length && t.issues.push(...vt(n, e.issues)), t.value[n] = e.value;
}
const Lv = /* @__PURE__ */ k("$ZodRecord", (e, t) => {
  ee.init(e, t), e._zod.parse = (n, o) => {
    const r = n.value;
    if (!Rn(r))
      return n.issues.push({
        expected: "record",
        code: "invalid_type",
        input: r,
        inst: e
      }), n;
    const i = [], a = t.keyType._zod.values;
    if (a) {
      n.value = {};
      const s = /* @__PURE__ */ new Set();
      for (const u of a)
        if (typeof u == "string" || typeof u == "number" || typeof u == "symbol") {
          s.add(typeof u == "number" ? u.toString() : u);
          const l = t.valueType._zod.run({ value: r[u], issues: [] }, o);
          l instanceof Promise ? i.push(l.then((d) => {
            d.issues.length && n.issues.push(...vt(u, d.issues)), n.value[u] = d.value;
          })) : (l.issues.length && n.issues.push(...vt(u, l.issues)), n.value[u] = l.value);
        }
      let c;
      for (const u in r)
        s.has(u) || (c = c ?? [], c.push(u));
      c && c.length > 0 && n.issues.push({
        code: "unrecognized_keys",
        input: r,
        inst: e,
        keys: c
      });
    } else {
      n.value = {};
      for (const s of Reflect.ownKeys(r)) {
        if (s === "__proto__")
          continue;
        let c = t.keyType._zod.run({ value: s, issues: [] }, o);
        if (c instanceof Promise)
          throw new Error("Async schemas not supported in object keys currently");
        if (typeof s == "string" && Gu.test(s) && c.issues.length) {
          const d = t.keyType._zod.run({ value: Number(s), issues: [] }, o);
          if (d instanceof Promise)
            throw new Error("Async schemas not supported in object keys currently");
          d.issues.length === 0 && (c = d);
        }
        if (c.issues.length) {
          t.mode === "loose" ? n.value[s] = r[s] : n.issues.push({
            code: "invalid_key",
            origin: "record",
            issues: c.issues.map((d) => mt(d, o, Ue())),
            input: s,
            path: [s],
            inst: e
          });
          continue;
        }
        const l = t.valueType._zod.run({ value: r[s], issues: [] }, o);
        l instanceof Promise ? i.push(l.then((d) => {
          d.issues.length && n.issues.push(...vt(s, d.issues)), n.value[c.value] = d.value;
        })) : (l.issues.length && n.issues.push(...vt(s, l.issues)), n.value[c.value] = l.value);
      }
    }
    return i.length ? Promise.all(i).then(() => n) : n;
  };
}), Zv = /* @__PURE__ */ k("$ZodMap", (e, t) => {
  ee.init(e, t), e._zod.parse = (n, o) => {
    const r = n.value;
    if (!(r instanceof Map))
      return n.issues.push({
        expected: "map",
        code: "invalid_type",
        input: r,
        inst: e
      }), n;
    const i = [];
    n.value = /* @__PURE__ */ new Map();
    for (const [a, s] of r) {
      const c = t.keyType._zod.run({ value: a, issues: [] }, o), u = t.valueType._zod.run({ value: s, issues: [] }, o);
      c instanceof Promise || u instanceof Promise ? i.push(Promise.all([c, u]).then(([l, d]) => {
        Am(l, d, n, a, r, e, o);
      })) : Am(c, u, n, a, r, e, o);
    }
    return i.length ? Promise.all(i).then(() => n) : n;
  };
});
function Am(e, t, n, o, r, i, a) {
  e.issues.length && (ea.has(typeof o) ? n.issues.push(...vt(o, e.issues)) : n.issues.push({
    code: "invalid_key",
    origin: "map",
    input: r,
    inst: i,
    issues: e.issues.map((s) => mt(s, a, Ue()))
  })), t.issues.length && (ea.has(typeof o) ? n.issues.push(...vt(o, t.issues)) : n.issues.push({
    origin: "map",
    code: "invalid_element",
    input: r,
    inst: i,
    key: o,
    issues: t.issues.map((s) => mt(s, a, Ue()))
  })), n.value.set(e.value, t.value);
}
const Yv = /* @__PURE__ */ k("$ZodSet", (e, t) => {
  ee.init(e, t), e._zod.parse = (n, o) => {
    const r = n.value;
    if (!(r instanceof Set))
      return n.issues.push({
        input: r,
        inst: e,
        expected: "set",
        code: "invalid_type"
      }), n;
    const i = [];
    n.value = /* @__PURE__ */ new Set();
    for (const a of r) {
      const s = t.valueType._zod.run({ value: a, issues: [] }, o);
      s instanceof Promise ? i.push(s.then((c) => Um(c, n))) : Um(s, n);
    }
    return i.length ? Promise.all(i).then(() => n) : n;
  };
});
function Um(e, t) {
  e.issues.length && t.issues.push(...e.issues), t.value.add(e.value);
}
const Bv = /* @__PURE__ */ k("$ZodEnum", (e, t) => {
  ee.init(e, t);
  const n = Tu(t.entries), o = new Set(n);
  e._zod.values = o, e._zod.pattern = new RegExp(`^(${n.filter((r) => ea.has(typeof r)).map((r) => typeof r == "string" ? Xt(r) : r.toString()).join("|")})$`), e._zod.parse = (r, i) => {
    const a = r.value;
    return o.has(a) || r.issues.push({
      code: "invalid_value",
      values: n,
      input: a,
      inst: e
    }), r;
  };
}), Hv = /* @__PURE__ */ k("$ZodLiteral", (e, t) => {
  if (ee.init(e, t), t.values.length === 0)
    throw new Error("Cannot create literal schema with no valid values");
  const n = new Set(t.values);
  e._zod.values = n, e._zod.pattern = new RegExp(`^(${t.values.map((o) => typeof o == "string" ? Xt(o) : o ? Xt(o.toString()) : String(o)).join("|")})$`), e._zod.parse = (o, r) => {
    const i = o.value;
    return n.has(i) || o.issues.push({
      code: "invalid_value",
      values: t.values,
      input: i,
      inst: e
    }), o;
  };
}), Gv = /* @__PURE__ */ k("$ZodFile", (e, t) => {
  ee.init(e, t), e._zod.parse = (n, o) => {
    const r = n.value;
    return r instanceof File || n.issues.push({
      expected: "file",
      code: "invalid_type",
      input: r,
      inst: e
    }), n;
  };
}), Vv = /* @__PURE__ */ k("$ZodTransform", (e, t) => {
  ee.init(e, t), e._zod.parse = (n, o) => {
    if (o.direction === "backward")
      throw new Ia(e.constructor.name);
    const r = t.transform(n.value, n);
    if (o.async)
      return (r instanceof Promise ? r : Promise.resolve(r)).then((a) => (n.value = a, n));
    if (r instanceof Promise)
      throw new Mn();
    return n.value = r, n;
  };
});
function jm(e, t) {
  return e.issues.length && t === void 0 ? { issues: [], value: void 0 } : e;
}
const tl = /* @__PURE__ */ k("$ZodOptional", (e, t) => {
  ee.init(e, t), e._zod.optin = "optional", e._zod.optout = "optional", ie(e._zod, "values", () => t.innerType._zod.values ? /* @__PURE__ */ new Set([...t.innerType._zod.values, void 0]) : void 0), ie(e._zod, "pattern", () => {
    const n = t.innerType._zod.pattern;
    return n ? new RegExp(`^(${Na(n.source)})?$`) : void 0;
  }), e._zod.parse = (n, o) => {
    if (t.innerType._zod.optin === "optional") {
      const r = t.innerType._zod.run(n, o);
      return r instanceof Promise ? r.then((i) => jm(i, n.value)) : jm(r, n.value);
    }
    return n.value === void 0 ? n : t.innerType._zod.run(n, o);
  };
}), qv = /* @__PURE__ */ k("$ZodExactOptional", (e, t) => {
  tl.init(e, t), ie(e._zod, "values", () => t.innerType._zod.values), ie(e._zod, "pattern", () => t.innerType._zod.pattern), e._zod.parse = (n, o) => t.innerType._zod.run(n, o);
}), Jv = /* @__PURE__ */ k("$ZodNullable", (e, t) => {
  ee.init(e, t), ie(e._zod, "optin", () => t.innerType._zod.optin), ie(e._zod, "optout", () => t.innerType._zod.optout), ie(e._zod, "pattern", () => {
    const n = t.innerType._zod.pattern;
    return n ? new RegExp(`^(${Na(n.source)}|null)$`) : void 0;
  }), ie(e._zod, "values", () => t.innerType._zod.values ? /* @__PURE__ */ new Set([...t.innerType._zod.values, null]) : void 0), e._zod.parse = (n, o) => n.value === null ? n : t.innerType._zod.run(n, o);
}), Kv = /* @__PURE__ */ k("$ZodDefault", (e, t) => {
  ee.init(e, t), e._zod.optin = "optional", ie(e._zod, "values", () => t.innerType._zod.values), e._zod.parse = (n, o) => {
    if (o.direction === "backward")
      return t.innerType._zod.run(n, o);
    if (n.value === void 0)
      return n.value = t.defaultValue, n;
    const r = t.innerType._zod.run(n, o);
    return r instanceof Promise ? r.then((i) => Fm(i, t)) : Fm(r, t);
  };
});
function Fm(e, t) {
  return e.value === void 0 && (e.value = t.defaultValue), e;
}
const Xv = /* @__PURE__ */ k("$ZodPrefault", (e, t) => {
  ee.init(e, t), e._zod.optin = "optional", ie(e._zod, "values", () => t.innerType._zod.values), e._zod.parse = (n, o) => (o.direction === "backward" || n.value === void 0 && (n.value = t.defaultValue), t.innerType._zod.run(n, o));
}), Qv = /* @__PURE__ */ k("$ZodNonOptional", (e, t) => {
  ee.init(e, t), ie(e._zod, "values", () => {
    const n = t.innerType._zod.values;
    return n ? new Set([...n].filter((o) => o !== void 0)) : void 0;
  }), e._zod.parse = (n, o) => {
    const r = t.innerType._zod.run(n, o);
    return r instanceof Promise ? r.then((i) => Wm(i, e)) : Wm(r, e);
  };
});
function Wm(e, t) {
  return !e.issues.length && e.value === void 0 && e.issues.push({
    code: "invalid_type",
    expected: "nonoptional",
    input: e.value,
    inst: t
  }), e;
}
const ey = /* @__PURE__ */ k("$ZodSuccess", (e, t) => {
  ee.init(e, t), e._zod.parse = (n, o) => {
    if (o.direction === "backward")
      throw new Ia("ZodSuccess");
    const r = t.innerType._zod.run(n, o);
    return r instanceof Promise ? r.then((i) => (n.value = i.issues.length === 0, n)) : (n.value = r.issues.length === 0, n);
  };
}), ty = /* @__PURE__ */ k("$ZodCatch", (e, t) => {
  ee.init(e, t), ie(e._zod, "optin", () => t.innerType._zod.optin), ie(e._zod, "optout", () => t.innerType._zod.optout), ie(e._zod, "values", () => t.innerType._zod.values), e._zod.parse = (n, o) => {
    if (o.direction === "backward")
      return t.innerType._zod.run(n, o);
    const r = t.innerType._zod.run(n, o);
    return r instanceof Promise ? r.then((i) => (n.value = i.value, i.issues.length && (n.value = t.catchValue({
      ...n,
      error: {
        issues: i.issues.map((a) => mt(a, o, Ue()))
      },
      input: n.value
    }), n.issues = []), n)) : (n.value = r.value, r.issues.length && (n.value = t.catchValue({
      ...n,
      error: {
        issues: r.issues.map((i) => mt(i, o, Ue()))
      },
      input: n.value
    }), n.issues = []), n);
  };
}), ny = /* @__PURE__ */ k("$ZodNaN", (e, t) => {
  ee.init(e, t), e._zod.parse = (n, o) => ((typeof n.value != "number" || !Number.isNaN(n.value)) && n.issues.push({
    input: n.value,
    inst: e,
    expected: "nan",
    code: "invalid_type"
  }), n);
}), ry = /* @__PURE__ */ k("$ZodPipe", (e, t) => {
  ee.init(e, t), ie(e._zod, "values", () => t.in._zod.values), ie(e._zod, "optin", () => t.in._zod.optin), ie(e._zod, "optout", () => t.out._zod.optout), ie(e._zod, "propValues", () => t.in._zod.propValues), e._zod.parse = (n, o) => {
    if (o.direction === "backward") {
      const i = t.out._zod.run(n, o);
      return i instanceof Promise ? i.then((a) => Oi(a, t.in, o)) : Oi(i, t.in, o);
    }
    const r = t.in._zod.run(n, o);
    return r instanceof Promise ? r.then((i) => Oi(i, t.out, o)) : Oi(r, t.out, o);
  };
});
function Oi(e, t, n) {
  return e.issues.length ? (e.aborted = !0, e) : t._zod.run({ value: e.value, issues: e.issues }, n);
}
const nl = /* @__PURE__ */ k("$ZodCodec", (e, t) => {
  ee.init(e, t), ie(e._zod, "values", () => t.in._zod.values), ie(e._zod, "optin", () => t.in._zod.optin), ie(e._zod, "optout", () => t.out._zod.optout), ie(e._zod, "propValues", () => t.in._zod.propValues), e._zod.parse = (n, o) => {
    if ((o.direction || "forward") === "forward") {
      const i = t.in._zod.run(n, o);
      return i instanceof Promise ? i.then((a) => Ii(a, t, o)) : Ii(i, t, o);
    } else {
      const i = t.out._zod.run(n, o);
      return i instanceof Promise ? i.then((a) => Ii(a, t, o)) : Ii(i, t, o);
    }
  };
});
function Ii(e, t, n) {
  if (e.issues.length)
    return e.aborted = !0, e;
  if ((n.direction || "forward") === "forward") {
    const r = t.transform(e.value, e);
    return r instanceof Promise ? r.then((i) => Ni(e, i, t.out, n)) : Ni(e, r, t.out, n);
  } else {
    const r = t.reverseTransform(e.value, e);
    return r instanceof Promise ? r.then((i) => Ni(e, i, t.in, n)) : Ni(e, r, t.in, n);
  }
}
function Ni(e, t, n, o) {
  return e.issues.length ? (e.aborted = !0, e) : n._zod.run({ value: t, issues: e.issues }, o);
}
const oy = /* @__PURE__ */ k("$ZodReadonly", (e, t) => {
  ee.init(e, t), ie(e._zod, "propValues", () => t.innerType._zod.propValues), ie(e._zod, "values", () => t.innerType._zod.values), ie(e._zod, "optin", () => {
    var n, o;
    return (o = (n = t.innerType) == null ? void 0 : n._zod) == null ? void 0 : o.optin;
  }), ie(e._zod, "optout", () => {
    var n, o;
    return (o = (n = t.innerType) == null ? void 0 : n._zod) == null ? void 0 : o.optout;
  }), e._zod.parse = (n, o) => {
    if (o.direction === "backward")
      return t.innerType._zod.run(n, o);
    const r = t.innerType._zod.run(n, o);
    return r instanceof Promise ? r.then(Lm) : Lm(r);
  };
});
function Lm(e) {
  return e.value = Object.freeze(e.value), e;
}
const iy = /* @__PURE__ */ k("$ZodTemplateLiteral", (e, t) => {
  ee.init(e, t);
  const n = [];
  for (const o of t.parts)
    if (typeof o == "object" && o !== null) {
      if (!o._zod.pattern)
        throw new Error(`Invalid template literal part, no pattern found: ${[...o._zod.traits].shift()}`);
      const r = o._zod.pattern instanceof RegExp ? o._zod.pattern.source : o._zod.pattern;
      if (!r)
        throw new Error(`Invalid template literal part: ${o._zod.traits}`);
      const i = r.startsWith("^") ? 1 : 0, a = r.endsWith("$") ? r.length - 1 : r.length;
      n.push(r.slice(i, a));
    } else if (o === null || Cg.has(typeof o))
      n.push(Xt(`${o}`));
    else
      throw new Error(`Invalid template literal part: ${o}`);
  e._zod.pattern = new RegExp(`^${n.join("")}$`), e._zod.parse = (o, r) => typeof o.value != "string" ? (o.issues.push({
    input: o.value,
    inst: e,
    expected: "string",
    code: "invalid_type"
  }), o) : (e._zod.pattern.lastIndex = 0, e._zod.pattern.test(o.value) || o.issues.push({
    input: o.value,
    inst: e,
    code: "invalid_format",
    format: t.format ?? "template_literal",
    pattern: e._zod.pattern.source
  }), o);
}), ay = /* @__PURE__ */ k("$ZodFunction", (e, t) => (ee.init(e, t), e._def = t, e._zod.def = t, e.implement = (n) => {
  if (typeof n != "function")
    throw new Error("implement() must be called with a function");
  return function(...o) {
    const r = e._def.input ? ru(e._def.input, o) : o, i = Reflect.apply(n, this, r);
    return e._def.output ? ru(e._def.output, i) : i;
  };
}, e.implementAsync = (n) => {
  if (typeof n != "function")
    throw new Error("implementAsync() must be called with a function");
  return async function(...o) {
    const r = e._def.input ? await ou(e._def.input, o) : o, i = await Reflect.apply(n, this, r);
    return e._def.output ? await ou(e._def.output, i) : i;
  };
}, e._zod.parse = (n, o) => typeof n.value != "function" ? (n.issues.push({
  code: "invalid_type",
  expected: "function",
  input: n.value,
  inst: e
}), n) : (e._def.output && e._def.output._zod.def.type === "promise" ? n.value = e.implementAsync(n.value) : n.value = e.implement(n.value), n), e.input = (...n) => {
  const o = e.constructor;
  return Array.isArray(n[0]) ? new o({
    type: "function",
    input: new el({
      type: "tuple",
      items: n[0],
      rest: n[1]
    }),
    output: e._def.output
  }) : new o({
    type: "function",
    input: n[0],
    output: e._def.output
  });
}, e.output = (n) => {
  const o = e.constructor;
  return new o({
    type: "function",
    input: e._def.input,
    output: n
  });
}, e)), sy = /* @__PURE__ */ k("$ZodPromise", (e, t) => {
  ee.init(e, t), e._zod.parse = (n, o) => Promise.resolve(n.value).then((r) => t.innerType._zod.run({ value: r, issues: [] }, o));
}), cy = /* @__PURE__ */ k("$ZodLazy", (e, t) => {
  ee.init(e, t), ie(e._zod, "innerType", () => t.getter()), ie(e._zod, "pattern", () => {
    var n, o;
    return (o = (n = e._zod.innerType) == null ? void 0 : n._zod) == null ? void 0 : o.pattern;
  }), ie(e._zod, "propValues", () => {
    var n, o;
    return (o = (n = e._zod.innerType) == null ? void 0 : n._zod) == null ? void 0 : o.propValues;
  }), ie(e._zod, "optin", () => {
    var n, o;
    return ((o = (n = e._zod.innerType) == null ? void 0 : n._zod) == null ? void 0 : o.optin) ?? void 0;
  }), ie(e._zod, "optout", () => {
    var n, o;
    return ((o = (n = e._zod.innerType) == null ? void 0 : n._zod) == null ? void 0 : o.optout) ?? void 0;
  }), e._zod.parse = (n, o) => e._zod.innerType._zod.run(n, o);
}), uy = /* @__PURE__ */ k("$ZodCustom", (e, t) => {
  xe.init(e, t), ee.init(e, t), e._zod.parse = (n, o) => n, e._zod.check = (n) => {
    const o = n.value, r = t.fn(o);
    if (r instanceof Promise)
      return r.then((i) => Zm(i, n, o, e));
    Zm(r, n, o, e);
  };
});
function Zm(e, t, n, o) {
  if (!e) {
    const r = {
      code: "custom",
      input: n,
      inst: o,
      // incorporates params.error into issue reporting
      path: [...o._zod.def.path ?? []],
      // incorporates params.error into issue reporting
      continue: !o._zod.def.abort
      // params: inst._zod.def.params,
    };
    o._zod.def.params && (r.params = o._zod.def.params), t.issues.push(dr(r));
  }
}
const IO = () => {
  const e = {
    string: { unit: "حرف", verb: "أن يحوي" },
    file: { unit: "بايت", verb: "أن يحوي" },
    array: { unit: "عنصر", verb: "أن يحوي" },
    set: { unit: "عنصر", verb: "أن يحوي" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "مدخل",
    email: "بريد إلكتروني",
    url: "رابط",
    emoji: "إيموجي",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "تاريخ ووقت بمعيار ISO",
    date: "تاريخ بمعيار ISO",
    time: "وقت بمعيار ISO",
    duration: "مدة بمعيار ISO",
    ipv4: "عنوان IPv4",
    ipv6: "عنوان IPv6",
    cidrv4: "مدى عناوين بصيغة IPv4",
    cidrv6: "مدى عناوين بصيغة IPv6",
    base64: "نَص بترميز base64-encoded",
    base64url: "نَص بترميز base64url-encoded",
    json_string: "نَص على هيئة JSON",
    e164: "رقم هاتف بمعيار E.164",
    jwt: "JWT",
    template_literal: "مدخل"
  }, o = {
    nan: "NaN"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const i = o[r.expected] ?? r.expected, a = X(r.input), s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `مدخلات غير مقبولة: يفترض إدخال instanceof ${r.expected}، ولكن تم إدخال ${s}` : `مدخلات غير مقبولة: يفترض إدخال ${i}، ولكن تم إدخال ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `مدخلات غير مقبولة: يفترض إدخال ${q(r.values[0])}` : `اختيار غير مقبول: يتوقع انتقاء أحد هذه الخيارات: ${C(r.values, "|")}`;
      case "too_big": {
        const i = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? ` أكبر من اللازم: يفترض أن تكون ${r.origin ?? "القيمة"} ${i} ${r.maximum.toString()} ${a.unit ?? "عنصر"}` : `أكبر من اللازم: يفترض أن تكون ${r.origin ?? "القيمة"} ${i} ${r.maximum.toString()}`;
      }
      case "too_small": {
        const i = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `أصغر من اللازم: يفترض لـ ${r.origin} أن يكون ${i} ${r.minimum.toString()} ${a.unit}` : `أصغر من اللازم: يفترض لـ ${r.origin} أن يكون ${i} ${r.minimum.toString()}`;
      }
      case "invalid_format": {
        const i = r;
        return i.format === "starts_with" ? `نَص غير مقبول: يجب أن يبدأ بـ "${r.prefix}"` : i.format === "ends_with" ? `نَص غير مقبول: يجب أن ينتهي بـ "${i.suffix}"` : i.format === "includes" ? `نَص غير مقبول: يجب أن يتضمَّن "${i.includes}"` : i.format === "regex" ? `نَص غير مقبول: يجب أن يطابق النمط ${i.pattern}` : `${n[i.format] ?? r.format} غير مقبول`;
      }
      case "not_multiple_of":
        return `رقم غير مقبول: يجب أن يكون من مضاعفات ${r.divisor}`;
      case "unrecognized_keys":
        return `معرف${r.keys.length > 1 ? "ات" : ""} غريب${r.keys.length > 1 ? "ة" : ""}: ${C(r.keys, "، ")}`;
      case "invalid_key":
        return `معرف غير مقبول في ${r.origin}`;
      case "invalid_union":
        return "مدخل غير مقبول";
      case "invalid_element":
        return `مدخل غير مقبول في ${r.origin}`;
      default:
        return "مدخل غير مقبول";
    }
  };
};
function NO() {
  return {
    localeError: IO()
  };
}
const EO = () => {
  const e = {
    string: { unit: "simvol", verb: "olmalıdır" },
    file: { unit: "bayt", verb: "olmalıdır" },
    array: { unit: "element", verb: "olmalıdır" },
    set: { unit: "element", verb: "olmalıdır" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "input",
    email: "email address",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO datetime",
    date: "ISO date",
    time: "ISO time",
    duration: "ISO duration",
    ipv4: "IPv4 address",
    ipv6: "IPv6 address",
    cidrv4: "IPv4 range",
    cidrv6: "IPv6 range",
    base64: "base64-encoded string",
    base64url: "base64url-encoded string",
    json_string: "JSON string",
    e164: "E.164 number",
    jwt: "JWT",
    template_literal: "input"
  }, o = {
    nan: "NaN"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const i = o[r.expected] ?? r.expected, a = X(r.input), s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Yanlış dəyər: gözlənilən instanceof ${r.expected}, daxil olan ${s}` : `Yanlış dəyər: gözlənilən ${i}, daxil olan ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Yanlış dəyər: gözlənilən ${q(r.values[0])}` : `Yanlış seçim: aşağıdakılardan biri olmalıdır: ${C(r.values, "|")}`;
      case "too_big": {
        const i = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `Çox böyük: gözlənilən ${r.origin ?? "dəyər"} ${i}${r.maximum.toString()} ${a.unit ?? "element"}` : `Çox böyük: gözlənilən ${r.origin ?? "dəyər"} ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        const i = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `Çox kiçik: gözlənilən ${r.origin} ${i}${r.minimum.toString()} ${a.unit}` : `Çox kiçik: gözlənilən ${r.origin} ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        const i = r;
        return i.format === "starts_with" ? `Yanlış mətn: "${i.prefix}" ilə başlamalıdır` : i.format === "ends_with" ? `Yanlış mətn: "${i.suffix}" ilə bitməlidir` : i.format === "includes" ? `Yanlış mətn: "${i.includes}" daxil olmalıdır` : i.format === "regex" ? `Yanlış mətn: ${i.pattern} şablonuna uyğun olmalıdır` : `Yanlış ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Yanlış ədəd: ${r.divisor} ilə bölünə bilən olmalıdır`;
      case "unrecognized_keys":
        return `Tanınmayan açar${r.keys.length > 1 ? "lar" : ""}: ${C(r.keys, ", ")}`;
      case "invalid_key":
        return `${r.origin} daxilində yanlış açar`;
      case "invalid_union":
        return "Yanlış dəyər";
      case "invalid_element":
        return `${r.origin} daxilində yanlış dəyər`;
      default:
        return "Yanlış dəyər";
    }
  };
};
function PO() {
  return {
    localeError: EO()
  };
}
function Ym(e, t, n, o) {
  const r = Math.abs(e), i = r % 10, a = r % 100;
  return a >= 11 && a <= 19 ? o : i === 1 ? t : i >= 2 && i <= 4 ? n : o;
}
const TO = () => {
  const e = {
    string: {
      unit: {
        one: "сімвал",
        few: "сімвалы",
        many: "сімвалаў"
      },
      verb: "мець"
    },
    array: {
      unit: {
        one: "элемент",
        few: "элементы",
        many: "элементаў"
      },
      verb: "мець"
    },
    set: {
      unit: {
        one: "элемент",
        few: "элементы",
        many: "элементаў"
      },
      verb: "мець"
    },
    file: {
      unit: {
        one: "байт",
        few: "байты",
        many: "байтаў"
      },
      verb: "мець"
    }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "увод",
    email: "email адрас",
    url: "URL",
    emoji: "эмодзі",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO дата і час",
    date: "ISO дата",
    time: "ISO час",
    duration: "ISO працягласць",
    ipv4: "IPv4 адрас",
    ipv6: "IPv6 адрас",
    cidrv4: "IPv4 дыяпазон",
    cidrv6: "IPv6 дыяпазон",
    base64: "радок у фармаце base64",
    base64url: "радок у фармаце base64url",
    json_string: "JSON радок",
    e164: "нумар E.164",
    jwt: "JWT",
    template_literal: "увод"
  }, o = {
    nan: "NaN",
    number: "лік",
    array: "масіў"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const i = o[r.expected] ?? r.expected, a = X(r.input), s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Няправільны ўвод: чакаўся instanceof ${r.expected}, атрымана ${s}` : `Няправільны ўвод: чакаўся ${i}, атрымана ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Няправільны ўвод: чакалася ${q(r.values[0])}` : `Няправільны варыянт: чакаўся адзін з ${C(r.values, "|")}`;
      case "too_big": {
        const i = r.inclusive ? "<=" : "<", a = t(r.origin);
        if (a) {
          const s = Number(r.maximum), c = Ym(s, a.unit.one, a.unit.few, a.unit.many);
          return `Занадта вялікі: чакалася, што ${r.origin ?? "значэнне"} павінна ${a.verb} ${i}${r.maximum.toString()} ${c}`;
        }
        return `Занадта вялікі: чакалася, што ${r.origin ?? "значэнне"} павінна быць ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        const i = r.inclusive ? ">=" : ">", a = t(r.origin);
        if (a) {
          const s = Number(r.minimum), c = Ym(s, a.unit.one, a.unit.few, a.unit.many);
          return `Занадта малы: чакалася, што ${r.origin} павінна ${a.verb} ${i}${r.minimum.toString()} ${c}`;
        }
        return `Занадта малы: чакалася, што ${r.origin} павінна быць ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        const i = r;
        return i.format === "starts_with" ? `Няправільны радок: павінен пачынацца з "${i.prefix}"` : i.format === "ends_with" ? `Няправільны радок: павінен заканчвацца на "${i.suffix}"` : i.format === "includes" ? `Няправільны радок: павінен змяшчаць "${i.includes}"` : i.format === "regex" ? `Няправільны радок: павінен адпавядаць шаблону ${i.pattern}` : `Няправільны ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Няправільны лік: павінен быць кратным ${r.divisor}`;
      case "unrecognized_keys":
        return `Нераспазнаны ${r.keys.length > 1 ? "ключы" : "ключ"}: ${C(r.keys, ", ")}`;
      case "invalid_key":
        return `Няправільны ключ у ${r.origin}`;
      case "invalid_union":
        return "Няправільны ўвод";
      case "invalid_element":
        return `Няправільнае значэнне ў ${r.origin}`;
      default:
        return "Няправільны ўвод";
    }
  };
};
function CO() {
  return {
    localeError: TO()
  };
}
const MO = () => {
  const e = {
    string: { unit: "символа", verb: "да съдържа" },
    file: { unit: "байта", verb: "да съдържа" },
    array: { unit: "елемента", verb: "да съдържа" },
    set: { unit: "елемента", verb: "да съдържа" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "вход",
    email: "имейл адрес",
    url: "URL",
    emoji: "емоджи",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO време",
    date: "ISO дата",
    time: "ISO време",
    duration: "ISO продължителност",
    ipv4: "IPv4 адрес",
    ipv6: "IPv6 адрес",
    cidrv4: "IPv4 диапазон",
    cidrv6: "IPv6 диапазон",
    base64: "base64-кодиран низ",
    base64url: "base64url-кодиран низ",
    json_string: "JSON низ",
    e164: "E.164 номер",
    jwt: "JWT",
    template_literal: "вход"
  }, o = {
    nan: "NaN",
    number: "число",
    array: "масив"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const i = o[r.expected] ?? r.expected, a = X(r.input), s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Невалиден вход: очакван instanceof ${r.expected}, получен ${s}` : `Невалиден вход: очакван ${i}, получен ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Невалиден вход: очакван ${q(r.values[0])}` : `Невалидна опция: очаквано едно от ${C(r.values, "|")}`;
      case "too_big": {
        const i = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `Твърде голямо: очаква се ${r.origin ?? "стойност"} да съдържа ${i}${r.maximum.toString()} ${a.unit ?? "елемента"}` : `Твърде голямо: очаква се ${r.origin ?? "стойност"} да бъде ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        const i = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `Твърде малко: очаква се ${r.origin} да съдържа ${i}${r.minimum.toString()} ${a.unit}` : `Твърде малко: очаква се ${r.origin} да бъде ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        const i = r;
        if (i.format === "starts_with")
          return `Невалиден низ: трябва да започва с "${i.prefix}"`;
        if (i.format === "ends_with")
          return `Невалиден низ: трябва да завършва с "${i.suffix}"`;
        if (i.format === "includes")
          return `Невалиден низ: трябва да включва "${i.includes}"`;
        if (i.format === "regex")
          return `Невалиден низ: трябва да съвпада с ${i.pattern}`;
        let a = "Невалиден";
        return i.format === "emoji" && (a = "Невалидно"), i.format === "datetime" && (a = "Невалидно"), i.format === "date" && (a = "Невалидна"), i.format === "time" && (a = "Невалидно"), i.format === "duration" && (a = "Невалидна"), `${a} ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Невалидно число: трябва да бъде кратно на ${r.divisor}`;
      case "unrecognized_keys":
        return `Неразпознат${r.keys.length > 1 ? "и" : ""} ключ${r.keys.length > 1 ? "ове" : ""}: ${C(r.keys, ", ")}`;
      case "invalid_key":
        return `Невалиден ключ в ${r.origin}`;
      case "invalid_union":
        return "Невалиден вход";
      case "invalid_element":
        return `Невалидна стойност в ${r.origin}`;
      default:
        return "Невалиден вход";
    }
  };
};
function zO() {
  return {
    localeError: MO()
  };
}
const RO = () => {
  const e = {
    string: { unit: "caràcters", verb: "contenir" },
    file: { unit: "bytes", verb: "contenir" },
    array: { unit: "elements", verb: "contenir" },
    set: { unit: "elements", verb: "contenir" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "entrada",
    email: "adreça electrònica",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "data i hora ISO",
    date: "data ISO",
    time: "hora ISO",
    duration: "durada ISO",
    ipv4: "adreça IPv4",
    ipv6: "adreça IPv6",
    cidrv4: "rang IPv4",
    cidrv6: "rang IPv6",
    base64: "cadena codificada en base64",
    base64url: "cadena codificada en base64url",
    json_string: "cadena JSON",
    e164: "número E.164",
    jwt: "JWT",
    template_literal: "entrada"
  }, o = {
    nan: "NaN"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const i = o[r.expected] ?? r.expected, a = X(r.input), s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Tipus invàlid: s'esperava instanceof ${r.expected}, s'ha rebut ${s}` : `Tipus invàlid: s'esperava ${i}, s'ha rebut ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Valor invàlid: s'esperava ${q(r.values[0])}` : `Opció invàlida: s'esperava una de ${C(r.values, " o ")}`;
      case "too_big": {
        const i = r.inclusive ? "com a màxim" : "menys de", a = t(r.origin);
        return a ? `Massa gran: s'esperava que ${r.origin ?? "el valor"} contingués ${i} ${r.maximum.toString()} ${a.unit ?? "elements"}` : `Massa gran: s'esperava que ${r.origin ?? "el valor"} fos ${i} ${r.maximum.toString()}`;
      }
      case "too_small": {
        const i = r.inclusive ? "com a mínim" : "més de", a = t(r.origin);
        return a ? `Massa petit: s'esperava que ${r.origin} contingués ${i} ${r.minimum.toString()} ${a.unit}` : `Massa petit: s'esperava que ${r.origin} fos ${i} ${r.minimum.toString()}`;
      }
      case "invalid_format": {
        const i = r;
        return i.format === "starts_with" ? `Format invàlid: ha de començar amb "${i.prefix}"` : i.format === "ends_with" ? `Format invàlid: ha d'acabar amb "${i.suffix}"` : i.format === "includes" ? `Format invàlid: ha d'incloure "${i.includes}"` : i.format === "regex" ? `Format invàlid: ha de coincidir amb el patró ${i.pattern}` : `Format invàlid per a ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Número invàlid: ha de ser múltiple de ${r.divisor}`;
      case "unrecognized_keys":
        return `Clau${r.keys.length > 1 ? "s" : ""} no reconeguda${r.keys.length > 1 ? "s" : ""}: ${C(r.keys, ", ")}`;
      case "invalid_key":
        return `Clau invàlida a ${r.origin}`;
      case "invalid_union":
        return "Entrada invàlida";
      case "invalid_element":
        return `Element invàlid a ${r.origin}`;
      default:
        return "Entrada invàlida";
    }
  };
};
function AO() {
  return {
    localeError: RO()
  };
}
const UO = () => {
  const e = {
    string: { unit: "znaků", verb: "mít" },
    file: { unit: "bajtů", verb: "mít" },
    array: { unit: "prvků", verb: "mít" },
    set: { unit: "prvků", verb: "mít" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "regulární výraz",
    email: "e-mailová adresa",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "datum a čas ve formátu ISO",
    date: "datum ve formátu ISO",
    time: "čas ve formátu ISO",
    duration: "doba trvání ISO",
    ipv4: "IPv4 adresa",
    ipv6: "IPv6 adresa",
    cidrv4: "rozsah IPv4",
    cidrv6: "rozsah IPv6",
    base64: "řetězec zakódovaný ve formátu base64",
    base64url: "řetězec zakódovaný ve formátu base64url",
    json_string: "řetězec ve formátu JSON",
    e164: "číslo E.164",
    jwt: "JWT",
    template_literal: "vstup"
  }, o = {
    nan: "NaN",
    number: "číslo",
    string: "řetězec",
    function: "funkce",
    array: "pole"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const i = o[r.expected] ?? r.expected, a = X(r.input), s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Neplatný vstup: očekáváno instanceof ${r.expected}, obdrženo ${s}` : `Neplatný vstup: očekáváno ${i}, obdrženo ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Neplatný vstup: očekáváno ${q(r.values[0])}` : `Neplatná možnost: očekávána jedna z hodnot ${C(r.values, "|")}`;
      case "too_big": {
        const i = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `Hodnota je příliš velká: ${r.origin ?? "hodnota"} musí mít ${i}${r.maximum.toString()} ${a.unit ?? "prvků"}` : `Hodnota je příliš velká: ${r.origin ?? "hodnota"} musí být ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        const i = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `Hodnota je příliš malá: ${r.origin ?? "hodnota"} musí mít ${i}${r.minimum.toString()} ${a.unit ?? "prvků"}` : `Hodnota je příliš malá: ${r.origin ?? "hodnota"} musí být ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        const i = r;
        return i.format === "starts_with" ? `Neplatný řetězec: musí začínat na "${i.prefix}"` : i.format === "ends_with" ? `Neplatný řetězec: musí končit na "${i.suffix}"` : i.format === "includes" ? `Neplatný řetězec: musí obsahovat "${i.includes}"` : i.format === "regex" ? `Neplatný řetězec: musí odpovídat vzoru ${i.pattern}` : `Neplatný formát ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Neplatné číslo: musí být násobkem ${r.divisor}`;
      case "unrecognized_keys":
        return `Neznámé klíče: ${C(r.keys, ", ")}`;
      case "invalid_key":
        return `Neplatný klíč v ${r.origin}`;
      case "invalid_union":
        return "Neplatný vstup";
      case "invalid_element":
        return `Neplatná hodnota v ${r.origin}`;
      default:
        return "Neplatný vstup";
    }
  };
};
function jO() {
  return {
    localeError: UO()
  };
}
const FO = () => {
  const e = {
    string: { unit: "tegn", verb: "havde" },
    file: { unit: "bytes", verb: "havde" },
    array: { unit: "elementer", verb: "indeholdt" },
    set: { unit: "elementer", verb: "indeholdt" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "input",
    email: "e-mailadresse",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO dato- og klokkeslæt",
    date: "ISO-dato",
    time: "ISO-klokkeslæt",
    duration: "ISO-varighed",
    ipv4: "IPv4-område",
    ipv6: "IPv6-område",
    cidrv4: "IPv4-spektrum",
    cidrv6: "IPv6-spektrum",
    base64: "base64-kodet streng",
    base64url: "base64url-kodet streng",
    json_string: "JSON-streng",
    e164: "E.164-nummer",
    jwt: "JWT",
    template_literal: "input"
  }, o = {
    nan: "NaN",
    string: "streng",
    number: "tal",
    boolean: "boolean",
    array: "liste",
    object: "objekt",
    set: "sæt",
    file: "fil"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const i = o[r.expected] ?? r.expected, a = X(r.input), s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Ugyldigt input: forventede instanceof ${r.expected}, fik ${s}` : `Ugyldigt input: forventede ${i}, fik ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Ugyldig værdi: forventede ${q(r.values[0])}` : `Ugyldigt valg: forventede en af følgende ${C(r.values, "|")}`;
      case "too_big": {
        const i = r.inclusive ? "<=" : "<", a = t(r.origin), s = o[r.origin] ?? r.origin;
        return a ? `For stor: forventede ${s ?? "value"} ${a.verb} ${i} ${r.maximum.toString()} ${a.unit ?? "elementer"}` : `For stor: forventede ${s ?? "value"} havde ${i} ${r.maximum.toString()}`;
      }
      case "too_small": {
        const i = r.inclusive ? ">=" : ">", a = t(r.origin), s = o[r.origin] ?? r.origin;
        return a ? `For lille: forventede ${s} ${a.verb} ${i} ${r.minimum.toString()} ${a.unit}` : `For lille: forventede ${s} havde ${i} ${r.minimum.toString()}`;
      }
      case "invalid_format": {
        const i = r;
        return i.format === "starts_with" ? `Ugyldig streng: skal starte med "${i.prefix}"` : i.format === "ends_with" ? `Ugyldig streng: skal ende med "${i.suffix}"` : i.format === "includes" ? `Ugyldig streng: skal indeholde "${i.includes}"` : i.format === "regex" ? `Ugyldig streng: skal matche mønsteret ${i.pattern}` : `Ugyldig ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Ugyldigt tal: skal være deleligt med ${r.divisor}`;
      case "unrecognized_keys":
        return `${r.keys.length > 1 ? "Ukendte nøgler" : "Ukendt nøgle"}: ${C(r.keys, ", ")}`;
      case "invalid_key":
        return `Ugyldig nøgle i ${r.origin}`;
      case "invalid_union":
        return "Ugyldigt input: matcher ingen af de tilladte typer";
      case "invalid_element":
        return `Ugyldig værdi i ${r.origin}`;
      default:
        return "Ugyldigt input";
    }
  };
};
function WO() {
  return {
    localeError: FO()
  };
}
const LO = () => {
  const e = {
    string: { unit: "Zeichen", verb: "zu haben" },
    file: { unit: "Bytes", verb: "zu haben" },
    array: { unit: "Elemente", verb: "zu haben" },
    set: { unit: "Elemente", verb: "zu haben" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "Eingabe",
    email: "E-Mail-Adresse",
    url: "URL",
    emoji: "Emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO-Datum und -Uhrzeit",
    date: "ISO-Datum",
    time: "ISO-Uhrzeit",
    duration: "ISO-Dauer",
    ipv4: "IPv4-Adresse",
    ipv6: "IPv6-Adresse",
    cidrv4: "IPv4-Bereich",
    cidrv6: "IPv6-Bereich",
    base64: "Base64-codierter String",
    base64url: "Base64-URL-codierter String",
    json_string: "JSON-String",
    e164: "E.164-Nummer",
    jwt: "JWT",
    template_literal: "Eingabe"
  }, o = {
    nan: "NaN",
    number: "Zahl",
    array: "Array"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const i = o[r.expected] ?? r.expected, a = X(r.input), s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Ungültige Eingabe: erwartet instanceof ${r.expected}, erhalten ${s}` : `Ungültige Eingabe: erwartet ${i}, erhalten ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Ungültige Eingabe: erwartet ${q(r.values[0])}` : `Ungültige Option: erwartet eine von ${C(r.values, "|")}`;
      case "too_big": {
        const i = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `Zu groß: erwartet, dass ${r.origin ?? "Wert"} ${i}${r.maximum.toString()} ${a.unit ?? "Elemente"} hat` : `Zu groß: erwartet, dass ${r.origin ?? "Wert"} ${i}${r.maximum.toString()} ist`;
      }
      case "too_small": {
        const i = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `Zu klein: erwartet, dass ${r.origin} ${i}${r.minimum.toString()} ${a.unit} hat` : `Zu klein: erwartet, dass ${r.origin} ${i}${r.minimum.toString()} ist`;
      }
      case "invalid_format": {
        const i = r;
        return i.format === "starts_with" ? `Ungültiger String: muss mit "${i.prefix}" beginnen` : i.format === "ends_with" ? `Ungültiger String: muss mit "${i.suffix}" enden` : i.format === "includes" ? `Ungültiger String: muss "${i.includes}" enthalten` : i.format === "regex" ? `Ungültiger String: muss dem Muster ${i.pattern} entsprechen` : `Ungültig: ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Ungültige Zahl: muss ein Vielfaches von ${r.divisor} sein`;
      case "unrecognized_keys":
        return `${r.keys.length > 1 ? "Unbekannte Schlüssel" : "Unbekannter Schlüssel"}: ${C(r.keys, ", ")}`;
      case "invalid_key":
        return `Ungültiger Schlüssel in ${r.origin}`;
      case "invalid_union":
        return "Ungültige Eingabe";
      case "invalid_element":
        return `Ungültiger Wert in ${r.origin}`;
      default:
        return "Ungültige Eingabe";
    }
  };
};
function ZO() {
  return {
    localeError: LO()
  };
}
const YO = () => {
  const e = {
    string: { unit: "characters", verb: "to have" },
    file: { unit: "bytes", verb: "to have" },
    array: { unit: "items", verb: "to have" },
    set: { unit: "items", verb: "to have" },
    map: { unit: "entries", verb: "to have" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "input",
    email: "email address",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO datetime",
    date: "ISO date",
    time: "ISO time",
    duration: "ISO duration",
    ipv4: "IPv4 address",
    ipv6: "IPv6 address",
    mac: "MAC address",
    cidrv4: "IPv4 range",
    cidrv6: "IPv6 range",
    base64: "base64-encoded string",
    base64url: "base64url-encoded string",
    json_string: "JSON string",
    e164: "E.164 number",
    jwt: "JWT",
    template_literal: "input"
  }, o = {
    // Compatibility: "nan" -> "NaN" for display
    nan: "NaN"
    // All other type names omitted - they fall back to raw values via ?? operator
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const i = o[r.expected] ?? r.expected, a = X(r.input), s = o[a] ?? a;
        return `Invalid input: expected ${i}, received ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Invalid input: expected ${q(r.values[0])}` : `Invalid option: expected one of ${C(r.values, "|")}`;
      case "too_big": {
        const i = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `Too big: expected ${r.origin ?? "value"} to have ${i}${r.maximum.toString()} ${a.unit ?? "elements"}` : `Too big: expected ${r.origin ?? "value"} to be ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        const i = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `Too small: expected ${r.origin} to have ${i}${r.minimum.toString()} ${a.unit}` : `Too small: expected ${r.origin} to be ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        const i = r;
        return i.format === "starts_with" ? `Invalid string: must start with "${i.prefix}"` : i.format === "ends_with" ? `Invalid string: must end with "${i.suffix}"` : i.format === "includes" ? `Invalid string: must include "${i.includes}"` : i.format === "regex" ? `Invalid string: must match pattern ${i.pattern}` : `Invalid ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Invalid number: must be a multiple of ${r.divisor}`;
      case "unrecognized_keys":
        return `Unrecognized key${r.keys.length > 1 ? "s" : ""}: ${C(r.keys, ", ")}`;
      case "invalid_key":
        return `Invalid key in ${r.origin}`;
      case "invalid_union":
        return "Invalid input";
      case "invalid_element":
        return `Invalid value in ${r.origin}`;
      default:
        return "Invalid input";
    }
  };
};
function ly() {
  return {
    localeError: YO()
  };
}
const BO = () => {
  const e = {
    string: { unit: "karaktrojn", verb: "havi" },
    file: { unit: "bajtojn", verb: "havi" },
    array: { unit: "elementojn", verb: "havi" },
    set: { unit: "elementojn", verb: "havi" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "enigo",
    email: "retadreso",
    url: "URL",
    emoji: "emoĝio",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO-datotempo",
    date: "ISO-dato",
    time: "ISO-tempo",
    duration: "ISO-daŭro",
    ipv4: "IPv4-adreso",
    ipv6: "IPv6-adreso",
    cidrv4: "IPv4-rango",
    cidrv6: "IPv6-rango",
    base64: "64-ume kodita karaktraro",
    base64url: "URL-64-ume kodita karaktraro",
    json_string: "JSON-karaktraro",
    e164: "E.164-nombro",
    jwt: "JWT",
    template_literal: "enigo"
  }, o = {
    nan: "NaN",
    number: "nombro",
    array: "tabelo",
    null: "senvalora"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const i = o[r.expected] ?? r.expected, a = X(r.input), s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Nevalida enigo: atendiĝis instanceof ${r.expected}, riceviĝis ${s}` : `Nevalida enigo: atendiĝis ${i}, riceviĝis ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Nevalida enigo: atendiĝis ${q(r.values[0])}` : `Nevalida opcio: atendiĝis unu el ${C(r.values, "|")}`;
      case "too_big": {
        const i = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `Tro granda: atendiĝis ke ${r.origin ?? "valoro"} havu ${i}${r.maximum.toString()} ${a.unit ?? "elementojn"}` : `Tro granda: atendiĝis ke ${r.origin ?? "valoro"} havu ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        const i = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `Tro malgranda: atendiĝis ke ${r.origin} havu ${i}${r.minimum.toString()} ${a.unit}` : `Tro malgranda: atendiĝis ke ${r.origin} estu ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        const i = r;
        return i.format === "starts_with" ? `Nevalida karaktraro: devas komenciĝi per "${i.prefix}"` : i.format === "ends_with" ? `Nevalida karaktraro: devas finiĝi per "${i.suffix}"` : i.format === "includes" ? `Nevalida karaktraro: devas inkluzivi "${i.includes}"` : i.format === "regex" ? `Nevalida karaktraro: devas kongrui kun la modelo ${i.pattern}` : `Nevalida ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Nevalida nombro: devas esti oblo de ${r.divisor}`;
      case "unrecognized_keys":
        return `Nekonata${r.keys.length > 1 ? "j" : ""} ŝlosilo${r.keys.length > 1 ? "j" : ""}: ${C(r.keys, ", ")}`;
      case "invalid_key":
        return `Nevalida ŝlosilo en ${r.origin}`;
      case "invalid_union":
        return "Nevalida enigo";
      case "invalid_element":
        return `Nevalida valoro en ${r.origin}`;
      default:
        return "Nevalida enigo";
    }
  };
};
function HO() {
  return {
    localeError: BO()
  };
}
const GO = () => {
  const e = {
    string: { unit: "caracteres", verb: "tener" },
    file: { unit: "bytes", verb: "tener" },
    array: { unit: "elementos", verb: "tener" },
    set: { unit: "elementos", verb: "tener" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "entrada",
    email: "dirección de correo electrónico",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "fecha y hora ISO",
    date: "fecha ISO",
    time: "hora ISO",
    duration: "duración ISO",
    ipv4: "dirección IPv4",
    ipv6: "dirección IPv6",
    cidrv4: "rango IPv4",
    cidrv6: "rango IPv6",
    base64: "cadena codificada en base64",
    base64url: "URL codificada en base64",
    json_string: "cadena JSON",
    e164: "número E.164",
    jwt: "JWT",
    template_literal: "entrada"
  }, o = {
    nan: "NaN",
    string: "texto",
    number: "número",
    boolean: "booleano",
    array: "arreglo",
    object: "objeto",
    set: "conjunto",
    file: "archivo",
    date: "fecha",
    bigint: "número grande",
    symbol: "símbolo",
    undefined: "indefinido",
    null: "nulo",
    function: "función",
    map: "mapa",
    record: "registro",
    tuple: "tupla",
    enum: "enumeración",
    union: "unión",
    literal: "literal",
    promise: "promesa",
    void: "vacío",
    never: "nunca",
    unknown: "desconocido",
    any: "cualquiera"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const i = o[r.expected] ?? r.expected, a = X(r.input), s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Entrada inválida: se esperaba instanceof ${r.expected}, recibido ${s}` : `Entrada inválida: se esperaba ${i}, recibido ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Entrada inválida: se esperaba ${q(r.values[0])}` : `Opción inválida: se esperaba una de ${C(r.values, "|")}`;
      case "too_big": {
        const i = r.inclusive ? "<=" : "<", a = t(r.origin), s = o[r.origin] ?? r.origin;
        return a ? `Demasiado grande: se esperaba que ${s ?? "valor"} tuviera ${i}${r.maximum.toString()} ${a.unit ?? "elementos"}` : `Demasiado grande: se esperaba que ${s ?? "valor"} fuera ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        const i = r.inclusive ? ">=" : ">", a = t(r.origin), s = o[r.origin] ?? r.origin;
        return a ? `Demasiado pequeño: se esperaba que ${s} tuviera ${i}${r.minimum.toString()} ${a.unit}` : `Demasiado pequeño: se esperaba que ${s} fuera ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        const i = r;
        return i.format === "starts_with" ? `Cadena inválida: debe comenzar con "${i.prefix}"` : i.format === "ends_with" ? `Cadena inválida: debe terminar en "${i.suffix}"` : i.format === "includes" ? `Cadena inválida: debe incluir "${i.includes}"` : i.format === "regex" ? `Cadena inválida: debe coincidir con el patrón ${i.pattern}` : `Inválido ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Número inválido: debe ser múltiplo de ${r.divisor}`;
      case "unrecognized_keys":
        return `Llave${r.keys.length > 1 ? "s" : ""} desconocida${r.keys.length > 1 ? "s" : ""}: ${C(r.keys, ", ")}`;
      case "invalid_key":
        return `Llave inválida en ${o[r.origin] ?? r.origin}`;
      case "invalid_union":
        return "Entrada inválida";
      case "invalid_element":
        return `Valor inválido en ${o[r.origin] ?? r.origin}`;
      default:
        return "Entrada inválida";
    }
  };
};
function VO() {
  return {
    localeError: GO()
  };
}
const qO = () => {
  const e = {
    string: { unit: "کاراکتر", verb: "داشته باشد" },
    file: { unit: "بایت", verb: "داشته باشد" },
    array: { unit: "آیتم", verb: "داشته باشد" },
    set: { unit: "آیتم", verb: "داشته باشد" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "ورودی",
    email: "آدرس ایمیل",
    url: "URL",
    emoji: "ایموجی",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "تاریخ و زمان ایزو",
    date: "تاریخ ایزو",
    time: "زمان ایزو",
    duration: "مدت زمان ایزو",
    ipv4: "IPv4 آدرس",
    ipv6: "IPv6 آدرس",
    cidrv4: "IPv4 دامنه",
    cidrv6: "IPv6 دامنه",
    base64: "base64-encoded رشته",
    base64url: "base64url-encoded رشته",
    json_string: "JSON رشته",
    e164: "E.164 عدد",
    jwt: "JWT",
    template_literal: "ورودی"
  }, o = {
    nan: "NaN",
    number: "عدد",
    array: "آرایه"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const i = o[r.expected] ?? r.expected, a = X(r.input), s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `ورودی نامعتبر: می‌بایست instanceof ${r.expected} می‌بود، ${s} دریافت شد` : `ورودی نامعتبر: می‌بایست ${i} می‌بود، ${s} دریافت شد`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `ورودی نامعتبر: می‌بایست ${q(r.values[0])} می‌بود` : `گزینه نامعتبر: می‌بایست یکی از ${C(r.values, "|")} می‌بود`;
      case "too_big": {
        const i = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `خیلی بزرگ: ${r.origin ?? "مقدار"} باید ${i}${r.maximum.toString()} ${a.unit ?? "عنصر"} باشد` : `خیلی بزرگ: ${r.origin ?? "مقدار"} باید ${i}${r.maximum.toString()} باشد`;
      }
      case "too_small": {
        const i = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `خیلی کوچک: ${r.origin} باید ${i}${r.minimum.toString()} ${a.unit} باشد` : `خیلی کوچک: ${r.origin} باید ${i}${r.minimum.toString()} باشد`;
      }
      case "invalid_format": {
        const i = r;
        return i.format === "starts_with" ? `رشته نامعتبر: باید با "${i.prefix}" شروع شود` : i.format === "ends_with" ? `رشته نامعتبر: باید با "${i.suffix}" تمام شود` : i.format === "includes" ? `رشته نامعتبر: باید شامل "${i.includes}" باشد` : i.format === "regex" ? `رشته نامعتبر: باید با الگوی ${i.pattern} مطابقت داشته باشد` : `${n[i.format] ?? r.format} نامعتبر`;
      }
      case "not_multiple_of":
        return `عدد نامعتبر: باید مضرب ${r.divisor} باشد`;
      case "unrecognized_keys":
        return `کلید${r.keys.length > 1 ? "های" : ""} ناشناس: ${C(r.keys, ", ")}`;
      case "invalid_key":
        return `کلید ناشناس در ${r.origin}`;
      case "invalid_union":
        return "ورودی نامعتبر";
      case "invalid_element":
        return `مقدار نامعتبر در ${r.origin}`;
      default:
        return "ورودی نامعتبر";
    }
  };
};
function JO() {
  return {
    localeError: qO()
  };
}
const KO = () => {
  const e = {
    string: { unit: "merkkiä", subject: "merkkijonon" },
    file: { unit: "tavua", subject: "tiedoston" },
    array: { unit: "alkiota", subject: "listan" },
    set: { unit: "alkiota", subject: "joukon" },
    number: { unit: "", subject: "luvun" },
    bigint: { unit: "", subject: "suuren kokonaisluvun" },
    int: { unit: "", subject: "kokonaisluvun" },
    date: { unit: "", subject: "päivämäärän" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "säännöllinen lauseke",
    email: "sähköpostiosoite",
    url: "URL-osoite",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO-aikaleima",
    date: "ISO-päivämäärä",
    time: "ISO-aika",
    duration: "ISO-kesto",
    ipv4: "IPv4-osoite",
    ipv6: "IPv6-osoite",
    cidrv4: "IPv4-alue",
    cidrv6: "IPv6-alue",
    base64: "base64-koodattu merkkijono",
    base64url: "base64url-koodattu merkkijono",
    json_string: "JSON-merkkijono",
    e164: "E.164-luku",
    jwt: "JWT",
    template_literal: "templaattimerkkijono"
  }, o = {
    nan: "NaN"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const i = o[r.expected] ?? r.expected, a = X(r.input), s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Virheellinen tyyppi: odotettiin instanceof ${r.expected}, oli ${s}` : `Virheellinen tyyppi: odotettiin ${i}, oli ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Virheellinen syöte: täytyy olla ${q(r.values[0])}` : `Virheellinen valinta: täytyy olla yksi seuraavista: ${C(r.values, "|")}`;
      case "too_big": {
        const i = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `Liian suuri: ${a.subject} täytyy olla ${i}${r.maximum.toString()} ${a.unit}`.trim() : `Liian suuri: arvon täytyy olla ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        const i = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `Liian pieni: ${a.subject} täytyy olla ${i}${r.minimum.toString()} ${a.unit}`.trim() : `Liian pieni: arvon täytyy olla ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        const i = r;
        return i.format === "starts_with" ? `Virheellinen syöte: täytyy alkaa "${i.prefix}"` : i.format === "ends_with" ? `Virheellinen syöte: täytyy loppua "${i.suffix}"` : i.format === "includes" ? `Virheellinen syöte: täytyy sisältää "${i.includes}"` : i.format === "regex" ? `Virheellinen syöte: täytyy vastata säännöllistä lauseketta ${i.pattern}` : `Virheellinen ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Virheellinen luku: täytyy olla luvun ${r.divisor} monikerta`;
      case "unrecognized_keys":
        return `${r.keys.length > 1 ? "Tuntemattomat avaimet" : "Tuntematon avain"}: ${C(r.keys, ", ")}`;
      case "invalid_key":
        return "Virheellinen avain tietueessa";
      case "invalid_union":
        return "Virheellinen unioni";
      case "invalid_element":
        return "Virheellinen arvo joukossa";
      default:
        return "Virheellinen syöte";
    }
  };
};
function XO() {
  return {
    localeError: KO()
  };
}
const QO = () => {
  const e = {
    string: { unit: "caractères", verb: "avoir" },
    file: { unit: "octets", verb: "avoir" },
    array: { unit: "éléments", verb: "avoir" },
    set: { unit: "éléments", verb: "avoir" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "entrée",
    email: "adresse e-mail",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "date et heure ISO",
    date: "date ISO",
    time: "heure ISO",
    duration: "durée ISO",
    ipv4: "adresse IPv4",
    ipv6: "adresse IPv6",
    cidrv4: "plage IPv4",
    cidrv6: "plage IPv6",
    base64: "chaîne encodée en base64",
    base64url: "chaîne encodée en base64url",
    json_string: "chaîne JSON",
    e164: "numéro E.164",
    jwt: "JWT",
    template_literal: "entrée"
  }, o = {
    nan: "NaN",
    number: "nombre",
    array: "tableau"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const i = o[r.expected] ?? r.expected, a = X(r.input), s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Entrée invalide : instanceof ${r.expected} attendu, ${s} reçu` : `Entrée invalide : ${i} attendu, ${s} reçu`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Entrée invalide : ${q(r.values[0])} attendu` : `Option invalide : une valeur parmi ${C(r.values, "|")} attendue`;
      case "too_big": {
        const i = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `Trop grand : ${r.origin ?? "valeur"} doit ${a.verb} ${i}${r.maximum.toString()} ${a.unit ?? "élément(s)"}` : `Trop grand : ${r.origin ?? "valeur"} doit être ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        const i = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `Trop petit : ${r.origin} doit ${a.verb} ${i}${r.minimum.toString()} ${a.unit}` : `Trop petit : ${r.origin} doit être ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        const i = r;
        return i.format === "starts_with" ? `Chaîne invalide : doit commencer par "${i.prefix}"` : i.format === "ends_with" ? `Chaîne invalide : doit se terminer par "${i.suffix}"` : i.format === "includes" ? `Chaîne invalide : doit inclure "${i.includes}"` : i.format === "regex" ? `Chaîne invalide : doit correspondre au modèle ${i.pattern}` : `${n[i.format] ?? r.format} invalide`;
      }
      case "not_multiple_of":
        return `Nombre invalide : doit être un multiple de ${r.divisor}`;
      case "unrecognized_keys":
        return `Clé${r.keys.length > 1 ? "s" : ""} non reconnue${r.keys.length > 1 ? "s" : ""} : ${C(r.keys, ", ")}`;
      case "invalid_key":
        return `Clé invalide dans ${r.origin}`;
      case "invalid_union":
        return "Entrée invalide";
      case "invalid_element":
        return `Valeur invalide dans ${r.origin}`;
      default:
        return "Entrée invalide";
    }
  };
};
function eI() {
  return {
    localeError: QO()
  };
}
const tI = () => {
  const e = {
    string: { unit: "caractères", verb: "avoir" },
    file: { unit: "octets", verb: "avoir" },
    array: { unit: "éléments", verb: "avoir" },
    set: { unit: "éléments", verb: "avoir" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "entrée",
    email: "adresse courriel",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "date-heure ISO",
    date: "date ISO",
    time: "heure ISO",
    duration: "durée ISO",
    ipv4: "adresse IPv4",
    ipv6: "adresse IPv6",
    cidrv4: "plage IPv4",
    cidrv6: "plage IPv6",
    base64: "chaîne encodée en base64",
    base64url: "chaîne encodée en base64url",
    json_string: "chaîne JSON",
    e164: "numéro E.164",
    jwt: "JWT",
    template_literal: "entrée"
  }, o = {
    nan: "NaN"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const i = o[r.expected] ?? r.expected, a = X(r.input), s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Entrée invalide : attendu instanceof ${r.expected}, reçu ${s}` : `Entrée invalide : attendu ${i}, reçu ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Entrée invalide : attendu ${q(r.values[0])}` : `Option invalide : attendu l'une des valeurs suivantes ${C(r.values, "|")}`;
      case "too_big": {
        const i = r.inclusive ? "≤" : "<", a = t(r.origin);
        return a ? `Trop grand : attendu que ${r.origin ?? "la valeur"} ait ${i}${r.maximum.toString()} ${a.unit}` : `Trop grand : attendu que ${r.origin ?? "la valeur"} soit ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        const i = r.inclusive ? "≥" : ">", a = t(r.origin);
        return a ? `Trop petit : attendu que ${r.origin} ait ${i}${r.minimum.toString()} ${a.unit}` : `Trop petit : attendu que ${r.origin} soit ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        const i = r;
        return i.format === "starts_with" ? `Chaîne invalide : doit commencer par "${i.prefix}"` : i.format === "ends_with" ? `Chaîne invalide : doit se terminer par "${i.suffix}"` : i.format === "includes" ? `Chaîne invalide : doit inclure "${i.includes}"` : i.format === "regex" ? `Chaîne invalide : doit correspondre au motif ${i.pattern}` : `${n[i.format] ?? r.format} invalide`;
      }
      case "not_multiple_of":
        return `Nombre invalide : doit être un multiple de ${r.divisor}`;
      case "unrecognized_keys":
        return `Clé${r.keys.length > 1 ? "s" : ""} non reconnue${r.keys.length > 1 ? "s" : ""} : ${C(r.keys, ", ")}`;
      case "invalid_key":
        return `Clé invalide dans ${r.origin}`;
      case "invalid_union":
        return "Entrée invalide";
      case "invalid_element":
        return `Valeur invalide dans ${r.origin}`;
      default:
        return "Entrée invalide";
    }
  };
};
function nI() {
  return {
    localeError: tI()
  };
}
const rI = () => {
  const e = {
    string: { label: "מחרוזת", gender: "f" },
    number: { label: "מספר", gender: "m" },
    boolean: { label: "ערך בוליאני", gender: "m" },
    bigint: { label: "BigInt", gender: "m" },
    date: { label: "תאריך", gender: "m" },
    array: { label: "מערך", gender: "m" },
    object: { label: "אובייקט", gender: "m" },
    null: { label: "ערך ריק (null)", gender: "m" },
    undefined: { label: "ערך לא מוגדר (undefined)", gender: "m" },
    symbol: { label: "סימבול (Symbol)", gender: "m" },
    function: { label: "פונקציה", gender: "f" },
    map: { label: "מפה (Map)", gender: "f" },
    set: { label: "קבוצה (Set)", gender: "f" },
    file: { label: "קובץ", gender: "m" },
    promise: { label: "Promise", gender: "m" },
    NaN: { label: "NaN", gender: "m" },
    unknown: { label: "ערך לא ידוע", gender: "m" },
    value: { label: "ערך", gender: "m" }
  }, t = {
    string: { unit: "תווים", shortLabel: "קצר", longLabel: "ארוך" },
    file: { unit: "בייטים", shortLabel: "קטן", longLabel: "גדול" },
    array: { unit: "פריטים", shortLabel: "קטן", longLabel: "גדול" },
    set: { unit: "פריטים", shortLabel: "קטן", longLabel: "גדול" },
    number: { unit: "", shortLabel: "קטן", longLabel: "גדול" }
    // no unit
  }, n = (u) => u ? e[u] : void 0, o = (u) => {
    const l = n(u);
    return l ? l.label : u ?? e.unknown.label;
  }, r = (u) => `ה${o(u)}`, i = (u) => {
    const l = n(u);
    return ((l == null ? void 0 : l.gender) ?? "m") === "f" ? "צריכה להיות" : "צריך להיות";
  }, a = (u) => u ? t[u] ?? null : null, s = {
    regex: { label: "קלט", gender: "m" },
    email: { label: "כתובת אימייל", gender: "f" },
    url: { label: "כתובת רשת", gender: "f" },
    emoji: { label: "אימוג'י", gender: "m" },
    uuid: { label: "UUID", gender: "m" },
    nanoid: { label: "nanoid", gender: "m" },
    guid: { label: "GUID", gender: "m" },
    cuid: { label: "cuid", gender: "m" },
    cuid2: { label: "cuid2", gender: "m" },
    ulid: { label: "ULID", gender: "m" },
    xid: { label: "XID", gender: "m" },
    ksuid: { label: "KSUID", gender: "m" },
    datetime: { label: "תאריך וזמן ISO", gender: "m" },
    date: { label: "תאריך ISO", gender: "m" },
    time: { label: "זמן ISO", gender: "m" },
    duration: { label: "משך זמן ISO", gender: "m" },
    ipv4: { label: "כתובת IPv4", gender: "f" },
    ipv6: { label: "כתובת IPv6", gender: "f" },
    cidrv4: { label: "טווח IPv4", gender: "m" },
    cidrv6: { label: "טווח IPv6", gender: "m" },
    base64: { label: "מחרוזת בבסיס 64", gender: "f" },
    base64url: { label: "מחרוזת בבסיס 64 לכתובות רשת", gender: "f" },
    json_string: { label: "מחרוזת JSON", gender: "f" },
    e164: { label: "מספר E.164", gender: "m" },
    jwt: { label: "JWT", gender: "m" },
    ends_with: { label: "קלט", gender: "m" },
    includes: { label: "קלט", gender: "m" },
    lowercase: { label: "קלט", gender: "m" },
    starts_with: { label: "קלט", gender: "m" },
    uppercase: { label: "קלט", gender: "m" }
  }, c = {
    nan: "NaN"
  };
  return (u) => {
    var l;
    switch (u.code) {
      case "invalid_type": {
        const d = u.expected, f = c[d ?? ""] ?? o(d), h = X(u.input), g = c[h] ?? ((l = e[h]) == null ? void 0 : l.label) ?? h;
        return /^[A-Z]/.test(u.expected) ? `קלט לא תקין: צריך להיות instanceof ${u.expected}, התקבל ${g}` : `קלט לא תקין: צריך להיות ${f}, התקבל ${g}`;
      }
      case "invalid_value": {
        if (u.values.length === 1)
          return `ערך לא תקין: הערך חייב להיות ${q(u.values[0])}`;
        const d = u.values.map((g) => q(g));
        if (u.values.length === 2)
          return `ערך לא תקין: האפשרויות המתאימות הן ${d[0]} או ${d[1]}`;
        const f = d[d.length - 1];
        return `ערך לא תקין: האפשרויות המתאימות הן ${d.slice(0, -1).join(", ")} או ${f}`;
      }
      case "too_big": {
        const d = a(u.origin), f = r(u.origin ?? "value");
        if (u.origin === "string")
          return `${(d == null ? void 0 : d.longLabel) ?? "ארוך"} מדי: ${f} צריכה להכיל ${u.maximum.toString()} ${(d == null ? void 0 : d.unit) ?? ""} ${u.inclusive ? "או פחות" : "לכל היותר"}`.trim();
        if (u.origin === "number") {
          const p = u.inclusive ? `קטן או שווה ל-${u.maximum}` : `קטן מ-${u.maximum}`;
          return `גדול מדי: ${f} צריך להיות ${p}`;
        }
        if (u.origin === "array" || u.origin === "set") {
          const p = u.origin === "set" ? "צריכה" : "צריך", v = u.inclusive ? `${u.maximum} ${(d == null ? void 0 : d.unit) ?? ""} או פחות` : `פחות מ-${u.maximum} ${(d == null ? void 0 : d.unit) ?? ""}`;
          return `גדול מדי: ${f} ${p} להכיל ${v}`.trim();
        }
        const h = u.inclusive ? "<=" : "<", g = i(u.origin ?? "value");
        return d != null && d.unit ? `${d.longLabel} מדי: ${f} ${g} ${h}${u.maximum.toString()} ${d.unit}` : `${(d == null ? void 0 : d.longLabel) ?? "גדול"} מדי: ${f} ${g} ${h}${u.maximum.toString()}`;
      }
      case "too_small": {
        const d = a(u.origin), f = r(u.origin ?? "value");
        if (u.origin === "string")
          return `${(d == null ? void 0 : d.shortLabel) ?? "קצר"} מדי: ${f} צריכה להכיל ${u.minimum.toString()} ${(d == null ? void 0 : d.unit) ?? ""} ${u.inclusive ? "או יותר" : "לפחות"}`.trim();
        if (u.origin === "number") {
          const p = u.inclusive ? `גדול או שווה ל-${u.minimum}` : `גדול מ-${u.minimum}`;
          return `קטן מדי: ${f} צריך להיות ${p}`;
        }
        if (u.origin === "array" || u.origin === "set") {
          const p = u.origin === "set" ? "צריכה" : "צריך";
          if (u.minimum === 1 && u.inclusive) {
            const b = (u.origin === "set", "לפחות פריט אחד");
            return `קטן מדי: ${f} ${p} להכיל ${b}`;
          }
          const v = u.inclusive ? `${u.minimum} ${(d == null ? void 0 : d.unit) ?? ""} או יותר` : `יותר מ-${u.minimum} ${(d == null ? void 0 : d.unit) ?? ""}`;
          return `קטן מדי: ${f} ${p} להכיל ${v}`.trim();
        }
        const h = u.inclusive ? ">=" : ">", g = i(u.origin ?? "value");
        return d != null && d.unit ? `${d.shortLabel} מדי: ${f} ${g} ${h}${u.minimum.toString()} ${d.unit}` : `${(d == null ? void 0 : d.shortLabel) ?? "קטן"} מדי: ${f} ${g} ${h}${u.minimum.toString()}`;
      }
      case "invalid_format": {
        const d = u;
        if (d.format === "starts_with")
          return `המחרוזת חייבת להתחיל ב "${d.prefix}"`;
        if (d.format === "ends_with")
          return `המחרוזת חייבת להסתיים ב "${d.suffix}"`;
        if (d.format === "includes")
          return `המחרוזת חייבת לכלול "${d.includes}"`;
        if (d.format === "regex")
          return `המחרוזת חייבת להתאים לתבנית ${d.pattern}`;
        const f = s[d.format], h = (f == null ? void 0 : f.label) ?? d.format, p = ((f == null ? void 0 : f.gender) ?? "m") === "f" ? "תקינה" : "תקין";
        return `${h} לא ${p}`;
      }
      case "not_multiple_of":
        return `מספר לא תקין: חייב להיות מכפלה של ${u.divisor}`;
      case "unrecognized_keys":
        return `מפתח${u.keys.length > 1 ? "ות" : ""} לא מזוה${u.keys.length > 1 ? "ים" : "ה"}: ${C(u.keys, ", ")}`;
      case "invalid_key":
        return "שדה לא תקין באובייקט";
      case "invalid_union":
        return "קלט לא תקין";
      case "invalid_element":
        return `ערך לא תקין ב${r(u.origin ?? "array")}`;
      default:
        return "קלט לא תקין";
    }
  };
};
function oI() {
  return {
    localeError: rI()
  };
}
const iI = () => {
  const e = {
    string: { unit: "karakter", verb: "legyen" },
    file: { unit: "byte", verb: "legyen" },
    array: { unit: "elem", verb: "legyen" },
    set: { unit: "elem", verb: "legyen" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "bemenet",
    email: "email cím",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO időbélyeg",
    date: "ISO dátum",
    time: "ISO idő",
    duration: "ISO időintervallum",
    ipv4: "IPv4 cím",
    ipv6: "IPv6 cím",
    cidrv4: "IPv4 tartomány",
    cidrv6: "IPv6 tartomány",
    base64: "base64-kódolt string",
    base64url: "base64url-kódolt string",
    json_string: "JSON string",
    e164: "E.164 szám",
    jwt: "JWT",
    template_literal: "bemenet"
  }, o = {
    nan: "NaN",
    number: "szám",
    array: "tömb"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const i = o[r.expected] ?? r.expected, a = X(r.input), s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Érvénytelen bemenet: a várt érték instanceof ${r.expected}, a kapott érték ${s}` : `Érvénytelen bemenet: a várt érték ${i}, a kapott érték ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Érvénytelen bemenet: a várt érték ${q(r.values[0])}` : `Érvénytelen opció: valamelyik érték várt ${C(r.values, "|")}`;
      case "too_big": {
        const i = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `Túl nagy: ${r.origin ?? "érték"} mérete túl nagy ${i}${r.maximum.toString()} ${a.unit ?? "elem"}` : `Túl nagy: a bemeneti érték ${r.origin ?? "érték"} túl nagy: ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        const i = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `Túl kicsi: a bemeneti érték ${r.origin} mérete túl kicsi ${i}${r.minimum.toString()} ${a.unit}` : `Túl kicsi: a bemeneti érték ${r.origin} túl kicsi ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        const i = r;
        return i.format === "starts_with" ? `Érvénytelen string: "${i.prefix}" értékkel kell kezdődnie` : i.format === "ends_with" ? `Érvénytelen string: "${i.suffix}" értékkel kell végződnie` : i.format === "includes" ? `Érvénytelen string: "${i.includes}" értéket kell tartalmaznia` : i.format === "regex" ? `Érvénytelen string: ${i.pattern} mintának kell megfelelnie` : `Érvénytelen ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Érvénytelen szám: ${r.divisor} többszörösének kell lennie`;
      case "unrecognized_keys":
        return `Ismeretlen kulcs${r.keys.length > 1 ? "s" : ""}: ${C(r.keys, ", ")}`;
      case "invalid_key":
        return `Érvénytelen kulcs ${r.origin}`;
      case "invalid_union":
        return "Érvénytelen bemenet";
      case "invalid_element":
        return `Érvénytelen érték: ${r.origin}`;
      default:
        return "Érvénytelen bemenet";
    }
  };
};
function aI() {
  return {
    localeError: iI()
  };
}
function Bm(e, t, n) {
  return Math.abs(e) === 1 ? t : n;
}
function Jn(e) {
  if (!e)
    return "";
  const t = ["ա", "ե", "ը", "ի", "ո", "ու", "օ"], n = e[e.length - 1];
  return e + (t.includes(n) ? "ն" : "ը");
}
const sI = () => {
  const e = {
    string: {
      unit: {
        one: "նշան",
        many: "նշաններ"
      },
      verb: "ունենալ"
    },
    file: {
      unit: {
        one: "բայթ",
        many: "բայթեր"
      },
      verb: "ունենալ"
    },
    array: {
      unit: {
        one: "տարր",
        many: "տարրեր"
      },
      verb: "ունենալ"
    },
    set: {
      unit: {
        one: "տարր",
        many: "տարրեր"
      },
      verb: "ունենալ"
    }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "մուտք",
    email: "էլ. հասցե",
    url: "URL",
    emoji: "էմոջի",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO ամսաթիվ և ժամ",
    date: "ISO ամսաթիվ",
    time: "ISO ժամ",
    duration: "ISO տևողություն",
    ipv4: "IPv4 հասցե",
    ipv6: "IPv6 հասցե",
    cidrv4: "IPv4 միջակայք",
    cidrv6: "IPv6 միջակայք",
    base64: "base64 ձևաչափով տող",
    base64url: "base64url ձևաչափով տող",
    json_string: "JSON տող",
    e164: "E.164 համար",
    jwt: "JWT",
    template_literal: "մուտք"
  }, o = {
    nan: "NaN",
    number: "թիվ",
    array: "զանգված"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const i = o[r.expected] ?? r.expected, a = X(r.input), s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Սխալ մուտքագրում․ սպասվում էր instanceof ${r.expected}, ստացվել է ${s}` : `Սխալ մուտքագրում․ սպասվում էր ${i}, ստացվել է ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Սխալ մուտքագրում․ սպասվում էր ${q(r.values[1])}` : `Սխալ տարբերակ․ սպասվում էր հետևյալներից մեկը՝ ${C(r.values, "|")}`;
      case "too_big": {
        const i = r.inclusive ? "<=" : "<", a = t(r.origin);
        if (a) {
          const s = Number(r.maximum), c = Bm(s, a.unit.one, a.unit.many);
          return `Չափազանց մեծ արժեք․ սպասվում է, որ ${Jn(r.origin ?? "արժեք")} կունենա ${i}${r.maximum.toString()} ${c}`;
        }
        return `Չափազանց մեծ արժեք․ սպասվում է, որ ${Jn(r.origin ?? "արժեք")} լինի ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        const i = r.inclusive ? ">=" : ">", a = t(r.origin);
        if (a) {
          const s = Number(r.minimum), c = Bm(s, a.unit.one, a.unit.many);
          return `Չափազանց փոքր արժեք․ սպասվում է, որ ${Jn(r.origin)} կունենա ${i}${r.minimum.toString()} ${c}`;
        }
        return `Չափազանց փոքր արժեք․ սպասվում է, որ ${Jn(r.origin)} լինի ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        const i = r;
        return i.format === "starts_with" ? `Սխալ տող․ պետք է սկսվի "${i.prefix}"-ով` : i.format === "ends_with" ? `Սխալ տող․ պետք է ավարտվի "${i.suffix}"-ով` : i.format === "includes" ? `Սխալ տող․ պետք է պարունակի "${i.includes}"` : i.format === "regex" ? `Սխալ տող․ պետք է համապատասխանի ${i.pattern} ձևաչափին` : `Սխալ ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Սխալ թիվ․ պետք է բազմապատիկ լինի ${r.divisor}-ի`;
      case "unrecognized_keys":
        return `Չճանաչված բանալի${r.keys.length > 1 ? "ներ" : ""}. ${C(r.keys, ", ")}`;
      case "invalid_key":
        return `Սխալ բանալի ${Jn(r.origin)}-ում`;
      case "invalid_union":
        return "Սխալ մուտքագրում";
      case "invalid_element":
        return `Սխալ արժեք ${Jn(r.origin)}-ում`;
      default:
        return "Սխալ մուտքագրում";
    }
  };
};
function cI() {
  return {
    localeError: sI()
  };
}
const uI = () => {
  const e = {
    string: { unit: "karakter", verb: "memiliki" },
    file: { unit: "byte", verb: "memiliki" },
    array: { unit: "item", verb: "memiliki" },
    set: { unit: "item", verb: "memiliki" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "input",
    email: "alamat email",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "tanggal dan waktu format ISO",
    date: "tanggal format ISO",
    time: "jam format ISO",
    duration: "durasi format ISO",
    ipv4: "alamat IPv4",
    ipv6: "alamat IPv6",
    cidrv4: "rentang alamat IPv4",
    cidrv6: "rentang alamat IPv6",
    base64: "string dengan enkode base64",
    base64url: "string dengan enkode base64url",
    json_string: "string JSON",
    e164: "angka E.164",
    jwt: "JWT",
    template_literal: "input"
  }, o = {
    nan: "NaN"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const i = o[r.expected] ?? r.expected, a = X(r.input), s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Input tidak valid: diharapkan instanceof ${r.expected}, diterima ${s}` : `Input tidak valid: diharapkan ${i}, diterima ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Input tidak valid: diharapkan ${q(r.values[0])}` : `Pilihan tidak valid: diharapkan salah satu dari ${C(r.values, "|")}`;
      case "too_big": {
        const i = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `Terlalu besar: diharapkan ${r.origin ?? "value"} memiliki ${i}${r.maximum.toString()} ${a.unit ?? "elemen"}` : `Terlalu besar: diharapkan ${r.origin ?? "value"} menjadi ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        const i = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `Terlalu kecil: diharapkan ${r.origin} memiliki ${i}${r.minimum.toString()} ${a.unit}` : `Terlalu kecil: diharapkan ${r.origin} menjadi ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        const i = r;
        return i.format === "starts_with" ? `String tidak valid: harus dimulai dengan "${i.prefix}"` : i.format === "ends_with" ? `String tidak valid: harus berakhir dengan "${i.suffix}"` : i.format === "includes" ? `String tidak valid: harus menyertakan "${i.includes}"` : i.format === "regex" ? `String tidak valid: harus sesuai pola ${i.pattern}` : `${n[i.format] ?? r.format} tidak valid`;
      }
      case "not_multiple_of":
        return `Angka tidak valid: harus kelipatan dari ${r.divisor}`;
      case "unrecognized_keys":
        return `Kunci tidak dikenali ${r.keys.length > 1 ? "s" : ""}: ${C(r.keys, ", ")}`;
      case "invalid_key":
        return `Kunci tidak valid di ${r.origin}`;
      case "invalid_union":
        return "Input tidak valid";
      case "invalid_element":
        return `Nilai tidak valid di ${r.origin}`;
      default:
        return "Input tidak valid";
    }
  };
};
function lI() {
  return {
    localeError: uI()
  };
}
const dI = () => {
  const e = {
    string: { unit: "stafi", verb: "að hafa" },
    file: { unit: "bæti", verb: "að hafa" },
    array: { unit: "hluti", verb: "að hafa" },
    set: { unit: "hluti", verb: "að hafa" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "gildi",
    email: "netfang",
    url: "vefslóð",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO dagsetning og tími",
    date: "ISO dagsetning",
    time: "ISO tími",
    duration: "ISO tímalengd",
    ipv4: "IPv4 address",
    ipv6: "IPv6 address",
    cidrv4: "IPv4 range",
    cidrv6: "IPv6 range",
    base64: "base64-encoded strengur",
    base64url: "base64url-encoded strengur",
    json_string: "JSON strengur",
    e164: "E.164 tölugildi",
    jwt: "JWT",
    template_literal: "gildi"
  }, o = {
    nan: "NaN",
    number: "númer",
    array: "fylki"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const i = o[r.expected] ?? r.expected, a = X(r.input), s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Rangt gildi: Þú slóst inn ${s} þar sem á að vera instanceof ${r.expected}` : `Rangt gildi: Þú slóst inn ${s} þar sem á að vera ${i}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Rangt gildi: gert ráð fyrir ${q(r.values[0])}` : `Ógilt val: má vera eitt af eftirfarandi ${C(r.values, "|")}`;
      case "too_big": {
        const i = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `Of stórt: gert er ráð fyrir að ${r.origin ?? "gildi"} hafi ${i}${r.maximum.toString()} ${a.unit ?? "hluti"}` : `Of stórt: gert er ráð fyrir að ${r.origin ?? "gildi"} sé ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        const i = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `Of lítið: gert er ráð fyrir að ${r.origin} hafi ${i}${r.minimum.toString()} ${a.unit}` : `Of lítið: gert er ráð fyrir að ${r.origin} sé ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        const i = r;
        return i.format === "starts_with" ? `Ógildur strengur: verður að byrja á "${i.prefix}"` : i.format === "ends_with" ? `Ógildur strengur: verður að enda á "${i.suffix}"` : i.format === "includes" ? `Ógildur strengur: verður að innihalda "${i.includes}"` : i.format === "regex" ? `Ógildur strengur: verður að fylgja mynstri ${i.pattern}` : `Rangt ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Röng tala: verður að vera margfeldi af ${r.divisor}`;
      case "unrecognized_keys":
        return `Óþekkt ${r.keys.length > 1 ? "ir lyklar" : "ur lykill"}: ${C(r.keys, ", ")}`;
      case "invalid_key":
        return `Rangur lykill í ${r.origin}`;
      case "invalid_union":
        return "Rangt gildi";
      case "invalid_element":
        return `Rangt gildi í ${r.origin}`;
      default:
        return "Rangt gildi";
    }
  };
};
function fI() {
  return {
    localeError: dI()
  };
}
const mI = () => {
  const e = {
    string: { unit: "caratteri", verb: "avere" },
    file: { unit: "byte", verb: "avere" },
    array: { unit: "elementi", verb: "avere" },
    set: { unit: "elementi", verb: "avere" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "input",
    email: "indirizzo email",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "data e ora ISO",
    date: "data ISO",
    time: "ora ISO",
    duration: "durata ISO",
    ipv4: "indirizzo IPv4",
    ipv6: "indirizzo IPv6",
    cidrv4: "intervallo IPv4",
    cidrv6: "intervallo IPv6",
    base64: "stringa codificata in base64",
    base64url: "URL codificata in base64",
    json_string: "stringa JSON",
    e164: "numero E.164",
    jwt: "JWT",
    template_literal: "input"
  }, o = {
    nan: "NaN",
    number: "numero",
    array: "vettore"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const i = o[r.expected] ?? r.expected, a = X(r.input), s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Input non valido: atteso instanceof ${r.expected}, ricevuto ${s}` : `Input non valido: atteso ${i}, ricevuto ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Input non valido: atteso ${q(r.values[0])}` : `Opzione non valida: atteso uno tra ${C(r.values, "|")}`;
      case "too_big": {
        const i = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `Troppo grande: ${r.origin ?? "valore"} deve avere ${i}${r.maximum.toString()} ${a.unit ?? "elementi"}` : `Troppo grande: ${r.origin ?? "valore"} deve essere ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        const i = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `Troppo piccolo: ${r.origin} deve avere ${i}${r.minimum.toString()} ${a.unit}` : `Troppo piccolo: ${r.origin} deve essere ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        const i = r;
        return i.format === "starts_with" ? `Stringa non valida: deve iniziare con "${i.prefix}"` : i.format === "ends_with" ? `Stringa non valida: deve terminare con "${i.suffix}"` : i.format === "includes" ? `Stringa non valida: deve includere "${i.includes}"` : i.format === "regex" ? `Stringa non valida: deve corrispondere al pattern ${i.pattern}` : `Invalid ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Numero non valido: deve essere un multiplo di ${r.divisor}`;
      case "unrecognized_keys":
        return `Chiav${r.keys.length > 1 ? "i" : "e"} non riconosciut${r.keys.length > 1 ? "e" : "a"}: ${C(r.keys, ", ")}`;
      case "invalid_key":
        return `Chiave non valida in ${r.origin}`;
      case "invalid_union":
        return "Input non valido";
      case "invalid_element":
        return `Valore non valido in ${r.origin}`;
      default:
        return "Input non valido";
    }
  };
};
function hI() {
  return {
    localeError: mI()
  };
}
const gI = () => {
  const e = {
    string: { unit: "文字", verb: "である" },
    file: { unit: "バイト", verb: "である" },
    array: { unit: "要素", verb: "である" },
    set: { unit: "要素", verb: "である" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "入力値",
    email: "メールアドレス",
    url: "URL",
    emoji: "絵文字",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO日時",
    date: "ISO日付",
    time: "ISO時刻",
    duration: "ISO期間",
    ipv4: "IPv4アドレス",
    ipv6: "IPv6アドレス",
    cidrv4: "IPv4範囲",
    cidrv6: "IPv6範囲",
    base64: "base64エンコード文字列",
    base64url: "base64urlエンコード文字列",
    json_string: "JSON文字列",
    e164: "E.164番号",
    jwt: "JWT",
    template_literal: "入力値"
  }, o = {
    nan: "NaN",
    number: "数値",
    array: "配列"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const i = o[r.expected] ?? r.expected, a = X(r.input), s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `無効な入力: instanceof ${r.expected}が期待されましたが、${s}が入力されました` : `無効な入力: ${i}が期待されましたが、${s}が入力されました`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `無効な入力: ${q(r.values[0])}が期待されました` : `無効な選択: ${C(r.values, "、")}のいずれかである必要があります`;
      case "too_big": {
        const i = r.inclusive ? "以下である" : "より小さい", a = t(r.origin);
        return a ? `大きすぎる値: ${r.origin ?? "値"}は${r.maximum.toString()}${a.unit ?? "要素"}${i}必要があります` : `大きすぎる値: ${r.origin ?? "値"}は${r.maximum.toString()}${i}必要があります`;
      }
      case "too_small": {
        const i = r.inclusive ? "以上である" : "より大きい", a = t(r.origin);
        return a ? `小さすぎる値: ${r.origin}は${r.minimum.toString()}${a.unit}${i}必要があります` : `小さすぎる値: ${r.origin}は${r.minimum.toString()}${i}必要があります`;
      }
      case "invalid_format": {
        const i = r;
        return i.format === "starts_with" ? `無効な文字列: "${i.prefix}"で始まる必要があります` : i.format === "ends_with" ? `無効な文字列: "${i.suffix}"で終わる必要があります` : i.format === "includes" ? `無効な文字列: "${i.includes}"を含む必要があります` : i.format === "regex" ? `無効な文字列: パターン${i.pattern}に一致する必要があります` : `無効な${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `無効な数値: ${r.divisor}の倍数である必要があります`;
      case "unrecognized_keys":
        return `認識されていないキー${r.keys.length > 1 ? "群" : ""}: ${C(r.keys, "、")}`;
      case "invalid_key":
        return `${r.origin}内の無効なキー`;
      case "invalid_union":
        return "無効な入力";
      case "invalid_element":
        return `${r.origin}内の無効な値`;
      default:
        return "無効な入力";
    }
  };
};
function pI() {
  return {
    localeError: gI()
  };
}
const vI = () => {
  const e = {
    string: { unit: "სიმბოლო", verb: "უნდა შეიცავდეს" },
    file: { unit: "ბაიტი", verb: "უნდა შეიცავდეს" },
    array: { unit: "ელემენტი", verb: "უნდა შეიცავდეს" },
    set: { unit: "ელემენტი", verb: "უნდა შეიცავდეს" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "შეყვანა",
    email: "ელ-ფოსტის მისამართი",
    url: "URL",
    emoji: "ემოჯი",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "თარიღი-დრო",
    date: "თარიღი",
    time: "დრო",
    duration: "ხანგრძლივობა",
    ipv4: "IPv4 მისამართი",
    ipv6: "IPv6 მისამართი",
    cidrv4: "IPv4 დიაპაზონი",
    cidrv6: "IPv6 დიაპაზონი",
    base64: "base64-კოდირებული სტრინგი",
    base64url: "base64url-კოდირებული სტრინგი",
    json_string: "JSON სტრინგი",
    e164: "E.164 ნომერი",
    jwt: "JWT",
    template_literal: "შეყვანა"
  }, o = {
    nan: "NaN",
    number: "რიცხვი",
    string: "სტრინგი",
    boolean: "ბულეანი",
    function: "ფუნქცია",
    array: "მასივი"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const i = o[r.expected] ?? r.expected, a = X(r.input), s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `არასწორი შეყვანა: მოსალოდნელი instanceof ${r.expected}, მიღებული ${s}` : `არასწორი შეყვანა: მოსალოდნელი ${i}, მიღებული ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `არასწორი შეყვანა: მოსალოდნელი ${q(r.values[0])}` : `არასწორი ვარიანტი: მოსალოდნელია ერთ-ერთი ${C(r.values, "|")}-დან`;
      case "too_big": {
        const i = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `ზედმეტად დიდი: მოსალოდნელი ${r.origin ?? "მნიშვნელობა"} ${a.verb} ${i}${r.maximum.toString()} ${a.unit}` : `ზედმეტად დიდი: მოსალოდნელი ${r.origin ?? "მნიშვნელობა"} იყოს ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        const i = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `ზედმეტად პატარა: მოსალოდნელი ${r.origin} ${a.verb} ${i}${r.minimum.toString()} ${a.unit}` : `ზედმეტად პატარა: მოსალოდნელი ${r.origin} იყოს ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        const i = r;
        return i.format === "starts_with" ? `არასწორი სტრინგი: უნდა იწყებოდეს "${i.prefix}"-ით` : i.format === "ends_with" ? `არასწორი სტრინგი: უნდა მთავრდებოდეს "${i.suffix}"-ით` : i.format === "includes" ? `არასწორი სტრინგი: უნდა შეიცავდეს "${i.includes}"-ს` : i.format === "regex" ? `არასწორი სტრინგი: უნდა შეესაბამებოდეს შაბლონს ${i.pattern}` : `არასწორი ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `არასწორი რიცხვი: უნდა იყოს ${r.divisor}-ის ჯერადი`;
      case "unrecognized_keys":
        return `უცნობი გასაღებ${r.keys.length > 1 ? "ები" : "ი"}: ${C(r.keys, ", ")}`;
      case "invalid_key":
        return `არასწორი გასაღები ${r.origin}-ში`;
      case "invalid_union":
        return "არასწორი შეყვანა";
      case "invalid_element":
        return `არასწორი მნიშვნელობა ${r.origin}-ში`;
      default:
        return "არასწორი შეყვანა";
    }
  };
};
function yI() {
  return {
    localeError: vI()
  };
}
const bI = () => {
  const e = {
    string: { unit: "តួអក្សរ", verb: "គួរមាន" },
    file: { unit: "បៃ", verb: "គួរមាន" },
    array: { unit: "ធាតុ", verb: "គួរមាន" },
    set: { unit: "ធាតុ", verb: "គួរមាន" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "ទិន្នន័យបញ្ចូល",
    email: "អាសយដ្ឋានអ៊ីមែល",
    url: "URL",
    emoji: "សញ្ញាអារម្មណ៍",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "កាលបរិច្ឆេទ និងម៉ោង ISO",
    date: "កាលបរិច្ឆេទ ISO",
    time: "ម៉ោង ISO",
    duration: "រយៈពេល ISO",
    ipv4: "អាសយដ្ឋាន IPv4",
    ipv6: "អាសយដ្ឋាន IPv6",
    cidrv4: "ដែនអាសយដ្ឋាន IPv4",
    cidrv6: "ដែនអាសយដ្ឋាន IPv6",
    base64: "ខ្សែអក្សរអ៊ិកូដ base64",
    base64url: "ខ្សែអក្សរអ៊ិកូដ base64url",
    json_string: "ខ្សែអក្សរ JSON",
    e164: "លេខ E.164",
    jwt: "JWT",
    template_literal: "ទិន្នន័យបញ្ចូល"
  }, o = {
    nan: "NaN",
    number: "លេខ",
    array: "អារេ (Array)",
    null: "គ្មានតម្លៃ (null)"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const i = o[r.expected] ?? r.expected, a = X(r.input), s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `ទិន្នន័យបញ្ចូលមិនត្រឹមត្រូវ៖ ត្រូវការ instanceof ${r.expected} ប៉ុន្តែទទួលបាន ${s}` : `ទិន្នន័យបញ្ចូលមិនត្រឹមត្រូវ៖ ត្រូវការ ${i} ប៉ុន្តែទទួលបាន ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `ទិន្នន័យបញ្ចូលមិនត្រឹមត្រូវ៖ ត្រូវការ ${q(r.values[0])}` : `ជម្រើសមិនត្រឹមត្រូវ៖ ត្រូវជាមួយក្នុងចំណោម ${C(r.values, "|")}`;
      case "too_big": {
        const i = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `ធំពេក៖ ត្រូវការ ${r.origin ?? "តម្លៃ"} ${i} ${r.maximum.toString()} ${a.unit ?? "ធាតុ"}` : `ធំពេក៖ ត្រូវការ ${r.origin ?? "តម្លៃ"} ${i} ${r.maximum.toString()}`;
      }
      case "too_small": {
        const i = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `តូចពេក៖ ត្រូវការ ${r.origin} ${i} ${r.minimum.toString()} ${a.unit}` : `តូចពេក៖ ត្រូវការ ${r.origin} ${i} ${r.minimum.toString()}`;
      }
      case "invalid_format": {
        const i = r;
        return i.format === "starts_with" ? `ខ្សែអក្សរមិនត្រឹមត្រូវ៖ ត្រូវចាប់ផ្តើមដោយ "${i.prefix}"` : i.format === "ends_with" ? `ខ្សែអក្សរមិនត្រឹមត្រូវ៖ ត្រូវបញ្ចប់ដោយ "${i.suffix}"` : i.format === "includes" ? `ខ្សែអក្សរមិនត្រឹមត្រូវ៖ ត្រូវមាន "${i.includes}"` : i.format === "regex" ? `ខ្សែអក្សរមិនត្រឹមត្រូវ៖ ត្រូវតែផ្គូផ្គងនឹងទម្រង់ដែលបានកំណត់ ${i.pattern}` : `មិនត្រឹមត្រូវ៖ ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `លេខមិនត្រឹមត្រូវ៖ ត្រូវតែជាពហុគុណនៃ ${r.divisor}`;
      case "unrecognized_keys":
        return `រកឃើញសោមិនស្គាល់៖ ${C(r.keys, ", ")}`;
      case "invalid_key":
        return `សោមិនត្រឹមត្រូវនៅក្នុង ${r.origin}`;
      case "invalid_union":
        return "ទិន្នន័យមិនត្រឹមត្រូវ";
      case "invalid_element":
        return `ទិន្នន័យមិនត្រឹមត្រូវនៅក្នុង ${r.origin}`;
      default:
        return "ទិន្នន័យមិនត្រឹមត្រូវ";
    }
  };
};
function dy() {
  return {
    localeError: bI()
  };
}
function wI() {
  return dy();
}
const _I = () => {
  const e = {
    string: { unit: "문자", verb: "to have" },
    file: { unit: "바이트", verb: "to have" },
    array: { unit: "개", verb: "to have" },
    set: { unit: "개", verb: "to have" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "입력",
    email: "이메일 주소",
    url: "URL",
    emoji: "이모지",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO 날짜시간",
    date: "ISO 날짜",
    time: "ISO 시간",
    duration: "ISO 기간",
    ipv4: "IPv4 주소",
    ipv6: "IPv6 주소",
    cidrv4: "IPv4 범위",
    cidrv6: "IPv6 범위",
    base64: "base64 인코딩 문자열",
    base64url: "base64url 인코딩 문자열",
    json_string: "JSON 문자열",
    e164: "E.164 번호",
    jwt: "JWT",
    template_literal: "입력"
  }, o = {
    nan: "NaN"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const i = o[r.expected] ?? r.expected, a = X(r.input), s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `잘못된 입력: 예상 타입은 instanceof ${r.expected}, 받은 타입은 ${s}입니다` : `잘못된 입력: 예상 타입은 ${i}, 받은 타입은 ${s}입니다`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `잘못된 입력: 값은 ${q(r.values[0])} 이어야 합니다` : `잘못된 옵션: ${C(r.values, "또는 ")} 중 하나여야 합니다`;
      case "too_big": {
        const i = r.inclusive ? "이하" : "미만", a = i === "미만" ? "이어야 합니다" : "여야 합니다", s = t(r.origin), c = (s == null ? void 0 : s.unit) ?? "요소";
        return s ? `${r.origin ?? "값"}이 너무 큽니다: ${r.maximum.toString()}${c} ${i}${a}` : `${r.origin ?? "값"}이 너무 큽니다: ${r.maximum.toString()} ${i}${a}`;
      }
      case "too_small": {
        const i = r.inclusive ? "이상" : "초과", a = i === "이상" ? "이어야 합니다" : "여야 합니다", s = t(r.origin), c = (s == null ? void 0 : s.unit) ?? "요소";
        return s ? `${r.origin ?? "값"}이 너무 작습니다: ${r.minimum.toString()}${c} ${i}${a}` : `${r.origin ?? "값"}이 너무 작습니다: ${r.minimum.toString()} ${i}${a}`;
      }
      case "invalid_format": {
        const i = r;
        return i.format === "starts_with" ? `잘못된 문자열: "${i.prefix}"(으)로 시작해야 합니다` : i.format === "ends_with" ? `잘못된 문자열: "${i.suffix}"(으)로 끝나야 합니다` : i.format === "includes" ? `잘못된 문자열: "${i.includes}"을(를) 포함해야 합니다` : i.format === "regex" ? `잘못된 문자열: 정규식 ${i.pattern} 패턴과 일치해야 합니다` : `잘못된 ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `잘못된 숫자: ${r.divisor}의 배수여야 합니다`;
      case "unrecognized_keys":
        return `인식할 수 없는 키: ${C(r.keys, ", ")}`;
      case "invalid_key":
        return `잘못된 키: ${r.origin}`;
      case "invalid_union":
        return "잘못된 입력";
      case "invalid_element":
        return `잘못된 값: ${r.origin}`;
      default:
        return "잘못된 입력";
    }
  };
};
function $I() {
  return {
    localeError: _I()
  };
}
const Vr = (e) => e.charAt(0).toUpperCase() + e.slice(1);
function Hm(e) {
  const t = Math.abs(e), n = t % 10, o = t % 100;
  return o >= 11 && o <= 19 || n === 0 ? "many" : n === 1 ? "one" : "few";
}
const kI = () => {
  const e = {
    string: {
      unit: {
        one: "simbolis",
        few: "simboliai",
        many: "simbolių"
      },
      verb: {
        smaller: {
          inclusive: "turi būti ne ilgesnė kaip",
          notInclusive: "turi būti trumpesnė kaip"
        },
        bigger: {
          inclusive: "turi būti ne trumpesnė kaip",
          notInclusive: "turi būti ilgesnė kaip"
        }
      }
    },
    file: {
      unit: {
        one: "baitas",
        few: "baitai",
        many: "baitų"
      },
      verb: {
        smaller: {
          inclusive: "turi būti ne didesnis kaip",
          notInclusive: "turi būti mažesnis kaip"
        },
        bigger: {
          inclusive: "turi būti ne mažesnis kaip",
          notInclusive: "turi būti didesnis kaip"
        }
      }
    },
    array: {
      unit: {
        one: "elementą",
        few: "elementus",
        many: "elementų"
      },
      verb: {
        smaller: {
          inclusive: "turi turėti ne daugiau kaip",
          notInclusive: "turi turėti mažiau kaip"
        },
        bigger: {
          inclusive: "turi turėti ne mažiau kaip",
          notInclusive: "turi turėti daugiau kaip"
        }
      }
    },
    set: {
      unit: {
        one: "elementą",
        few: "elementus",
        many: "elementų"
      },
      verb: {
        smaller: {
          inclusive: "turi turėti ne daugiau kaip",
          notInclusive: "turi turėti mažiau kaip"
        },
        bigger: {
          inclusive: "turi turėti ne mažiau kaip",
          notInclusive: "turi turėti daugiau kaip"
        }
      }
    }
  };
  function t(r, i, a, s) {
    const c = e[r] ?? null;
    return c === null ? c : {
      unit: c.unit[i],
      verb: c.verb[s][a ? "inclusive" : "notInclusive"]
    };
  }
  const n = {
    regex: "įvestis",
    email: "el. pašto adresas",
    url: "URL",
    emoji: "jaustukas",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO data ir laikas",
    date: "ISO data",
    time: "ISO laikas",
    duration: "ISO trukmė",
    ipv4: "IPv4 adresas",
    ipv6: "IPv6 adresas",
    cidrv4: "IPv4 tinklo prefiksas (CIDR)",
    cidrv6: "IPv6 tinklo prefiksas (CIDR)",
    base64: "base64 užkoduota eilutė",
    base64url: "base64url užkoduota eilutė",
    json_string: "JSON eilutė",
    e164: "E.164 numeris",
    jwt: "JWT",
    template_literal: "įvestis"
  }, o = {
    nan: "NaN",
    number: "skaičius",
    bigint: "sveikasis skaičius",
    string: "eilutė",
    boolean: "loginė reikšmė",
    undefined: "neapibrėžta reikšmė",
    function: "funkcija",
    symbol: "simbolis",
    array: "masyvas",
    object: "objektas",
    null: "nulinė reikšmė"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const i = o[r.expected] ?? r.expected, a = X(r.input), s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Gautas tipas ${s}, o tikėtasi - instanceof ${r.expected}` : `Gautas tipas ${s}, o tikėtasi - ${i}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Privalo būti ${q(r.values[0])}` : `Privalo būti vienas iš ${C(r.values, "|")} pasirinkimų`;
      case "too_big": {
        const i = o[r.origin] ?? r.origin, a = t(r.origin, Hm(Number(r.maximum)), r.inclusive ?? !1, "smaller");
        if (a != null && a.verb)
          return `${Vr(i ?? r.origin ?? "reikšmė")} ${a.verb} ${r.maximum.toString()} ${a.unit ?? "elementų"}`;
        const s = r.inclusive ? "ne didesnis kaip" : "mažesnis kaip";
        return `${Vr(i ?? r.origin ?? "reikšmė")} turi būti ${s} ${r.maximum.toString()} ${a == null ? void 0 : a.unit}`;
      }
      case "too_small": {
        const i = o[r.origin] ?? r.origin, a = t(r.origin, Hm(Number(r.minimum)), r.inclusive ?? !1, "bigger");
        if (a != null && a.verb)
          return `${Vr(i ?? r.origin ?? "reikšmė")} ${a.verb} ${r.minimum.toString()} ${a.unit ?? "elementų"}`;
        const s = r.inclusive ? "ne mažesnis kaip" : "didesnis kaip";
        return `${Vr(i ?? r.origin ?? "reikšmė")} turi būti ${s} ${r.minimum.toString()} ${a == null ? void 0 : a.unit}`;
      }
      case "invalid_format": {
        const i = r;
        return i.format === "starts_with" ? `Eilutė privalo prasidėti "${i.prefix}"` : i.format === "ends_with" ? `Eilutė privalo pasibaigti "${i.suffix}"` : i.format === "includes" ? `Eilutė privalo įtraukti "${i.includes}"` : i.format === "regex" ? `Eilutė privalo atitikti ${i.pattern}` : `Neteisingas ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Skaičius privalo būti ${r.divisor} kartotinis.`;
      case "unrecognized_keys":
        return `Neatpažint${r.keys.length > 1 ? "i" : "as"} rakt${r.keys.length > 1 ? "ai" : "as"}: ${C(r.keys, ", ")}`;
      case "invalid_key":
        return "Rastas klaidingas raktas";
      case "invalid_union":
        return "Klaidinga įvestis";
      case "invalid_element": {
        const i = o[r.origin] ?? r.origin;
        return `${Vr(i ?? r.origin ?? "reikšmė")} turi klaidingą įvestį`;
      }
      default:
        return "Klaidinga įvestis";
    }
  };
};
function xI() {
  return {
    localeError: kI()
  };
}
const SI = () => {
  const e = {
    string: { unit: "знаци", verb: "да имаат" },
    file: { unit: "бајти", verb: "да имаат" },
    array: { unit: "ставки", verb: "да имаат" },
    set: { unit: "ставки", verb: "да имаат" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "внес",
    email: "адреса на е-пошта",
    url: "URL",
    emoji: "емоџи",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO датум и време",
    date: "ISO датум",
    time: "ISO време",
    duration: "ISO времетраење",
    ipv4: "IPv4 адреса",
    ipv6: "IPv6 адреса",
    cidrv4: "IPv4 опсег",
    cidrv6: "IPv6 опсег",
    base64: "base64-енкодирана низа",
    base64url: "base64url-енкодирана низа",
    json_string: "JSON низа",
    e164: "E.164 број",
    jwt: "JWT",
    template_literal: "внес"
  }, o = {
    nan: "NaN",
    number: "број",
    array: "низа"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const i = o[r.expected] ?? r.expected, a = X(r.input), s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Грешен внес: се очекува instanceof ${r.expected}, примено ${s}` : `Грешен внес: се очекува ${i}, примено ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Invalid input: expected ${q(r.values[0])}` : `Грешана опција: се очекува една ${C(r.values, "|")}`;
      case "too_big": {
        const i = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `Премногу голем: се очекува ${r.origin ?? "вредноста"} да има ${i}${r.maximum.toString()} ${a.unit ?? "елементи"}` : `Премногу голем: се очекува ${r.origin ?? "вредноста"} да биде ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        const i = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `Премногу мал: се очекува ${r.origin} да има ${i}${r.minimum.toString()} ${a.unit}` : `Премногу мал: се очекува ${r.origin} да биде ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        const i = r;
        return i.format === "starts_with" ? `Неважечка низа: мора да започнува со "${i.prefix}"` : i.format === "ends_with" ? `Неважечка низа: мора да завршува со "${i.suffix}"` : i.format === "includes" ? `Неважечка низа: мора да вклучува "${i.includes}"` : i.format === "regex" ? `Неважечка низа: мора да одгоара на патернот ${i.pattern}` : `Invalid ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Грешен број: мора да биде делив со ${r.divisor}`;
      case "unrecognized_keys":
        return `${r.keys.length > 1 ? "Непрепознаени клучеви" : "Непрепознаен клуч"}: ${C(r.keys, ", ")}`;
      case "invalid_key":
        return `Грешен клуч во ${r.origin}`;
      case "invalid_union":
        return "Грешен внес";
      case "invalid_element":
        return `Грешна вредност во ${r.origin}`;
      default:
        return "Грешен внес";
    }
  };
};
function DI() {
  return {
    localeError: SI()
  };
}
const OI = () => {
  const e = {
    string: { unit: "aksara", verb: "mempunyai" },
    file: { unit: "bait", verb: "mempunyai" },
    array: { unit: "elemen", verb: "mempunyai" },
    set: { unit: "elemen", verb: "mempunyai" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "input",
    email: "alamat e-mel",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "tarikh masa ISO",
    date: "tarikh ISO",
    time: "masa ISO",
    duration: "tempoh ISO",
    ipv4: "alamat IPv4",
    ipv6: "alamat IPv6",
    cidrv4: "julat IPv4",
    cidrv6: "julat IPv6",
    base64: "string dikodkan base64",
    base64url: "string dikodkan base64url",
    json_string: "string JSON",
    e164: "nombor E.164",
    jwt: "JWT",
    template_literal: "input"
  }, o = {
    nan: "NaN",
    number: "nombor"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const i = o[r.expected] ?? r.expected, a = X(r.input), s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Input tidak sah: dijangka instanceof ${r.expected}, diterima ${s}` : `Input tidak sah: dijangka ${i}, diterima ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Input tidak sah: dijangka ${q(r.values[0])}` : `Pilihan tidak sah: dijangka salah satu daripada ${C(r.values, "|")}`;
      case "too_big": {
        const i = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `Terlalu besar: dijangka ${r.origin ?? "nilai"} ${a.verb} ${i}${r.maximum.toString()} ${a.unit ?? "elemen"}` : `Terlalu besar: dijangka ${r.origin ?? "nilai"} adalah ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        const i = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `Terlalu kecil: dijangka ${r.origin} ${a.verb} ${i}${r.minimum.toString()} ${a.unit}` : `Terlalu kecil: dijangka ${r.origin} adalah ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        const i = r;
        return i.format === "starts_with" ? `String tidak sah: mesti bermula dengan "${i.prefix}"` : i.format === "ends_with" ? `String tidak sah: mesti berakhir dengan "${i.suffix}"` : i.format === "includes" ? `String tidak sah: mesti mengandungi "${i.includes}"` : i.format === "regex" ? `String tidak sah: mesti sepadan dengan corak ${i.pattern}` : `${n[i.format] ?? r.format} tidak sah`;
      }
      case "not_multiple_of":
        return `Nombor tidak sah: perlu gandaan ${r.divisor}`;
      case "unrecognized_keys":
        return `Kunci tidak dikenali: ${C(r.keys, ", ")}`;
      case "invalid_key":
        return `Kunci tidak sah dalam ${r.origin}`;
      case "invalid_union":
        return "Input tidak sah";
      case "invalid_element":
        return `Nilai tidak sah dalam ${r.origin}`;
      default:
        return "Input tidak sah";
    }
  };
};
function II() {
  return {
    localeError: OI()
  };
}
const NI = () => {
  const e = {
    string: { unit: "tekens", verb: "heeft" },
    file: { unit: "bytes", verb: "heeft" },
    array: { unit: "elementen", verb: "heeft" },
    set: { unit: "elementen", verb: "heeft" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "invoer",
    email: "emailadres",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO datum en tijd",
    date: "ISO datum",
    time: "ISO tijd",
    duration: "ISO duur",
    ipv4: "IPv4-adres",
    ipv6: "IPv6-adres",
    cidrv4: "IPv4-bereik",
    cidrv6: "IPv6-bereik",
    base64: "base64-gecodeerde tekst",
    base64url: "base64 URL-gecodeerde tekst",
    json_string: "JSON string",
    e164: "E.164-nummer",
    jwt: "JWT",
    template_literal: "invoer"
  }, o = {
    nan: "NaN",
    number: "getal"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const i = o[r.expected] ?? r.expected, a = X(r.input), s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Ongeldige invoer: verwacht instanceof ${r.expected}, ontving ${s}` : `Ongeldige invoer: verwacht ${i}, ontving ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Ongeldige invoer: verwacht ${q(r.values[0])}` : `Ongeldige optie: verwacht één van ${C(r.values, "|")}`;
      case "too_big": {
        const i = r.inclusive ? "<=" : "<", a = t(r.origin), s = r.origin === "date" ? "laat" : r.origin === "string" ? "lang" : "groot";
        return a ? `Te ${s}: verwacht dat ${r.origin ?? "waarde"} ${i}${r.maximum.toString()} ${a.unit ?? "elementen"} ${a.verb}` : `Te ${s}: verwacht dat ${r.origin ?? "waarde"} ${i}${r.maximum.toString()} is`;
      }
      case "too_small": {
        const i = r.inclusive ? ">=" : ">", a = t(r.origin), s = r.origin === "date" ? "vroeg" : r.origin === "string" ? "kort" : "klein";
        return a ? `Te ${s}: verwacht dat ${r.origin} ${i}${r.minimum.toString()} ${a.unit} ${a.verb}` : `Te ${s}: verwacht dat ${r.origin} ${i}${r.minimum.toString()} is`;
      }
      case "invalid_format": {
        const i = r;
        return i.format === "starts_with" ? `Ongeldige tekst: moet met "${i.prefix}" beginnen` : i.format === "ends_with" ? `Ongeldige tekst: moet op "${i.suffix}" eindigen` : i.format === "includes" ? `Ongeldige tekst: moet "${i.includes}" bevatten` : i.format === "regex" ? `Ongeldige tekst: moet overeenkomen met patroon ${i.pattern}` : `Ongeldig: ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Ongeldig getal: moet een veelvoud van ${r.divisor} zijn`;
      case "unrecognized_keys":
        return `Onbekende key${r.keys.length > 1 ? "s" : ""}: ${C(r.keys, ", ")}`;
      case "invalid_key":
        return `Ongeldige key in ${r.origin}`;
      case "invalid_union":
        return "Ongeldige invoer";
      case "invalid_element":
        return `Ongeldige waarde in ${r.origin}`;
      default:
        return "Ongeldige invoer";
    }
  };
};
function EI() {
  return {
    localeError: NI()
  };
}
const PI = () => {
  const e = {
    string: { unit: "tegn", verb: "å ha" },
    file: { unit: "bytes", verb: "å ha" },
    array: { unit: "elementer", verb: "å inneholde" },
    set: { unit: "elementer", verb: "å inneholde" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "input",
    email: "e-postadresse",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO dato- og klokkeslett",
    date: "ISO-dato",
    time: "ISO-klokkeslett",
    duration: "ISO-varighet",
    ipv4: "IPv4-område",
    ipv6: "IPv6-område",
    cidrv4: "IPv4-spekter",
    cidrv6: "IPv6-spekter",
    base64: "base64-enkodet streng",
    base64url: "base64url-enkodet streng",
    json_string: "JSON-streng",
    e164: "E.164-nummer",
    jwt: "JWT",
    template_literal: "input"
  }, o = {
    nan: "NaN",
    number: "tall",
    array: "liste"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const i = o[r.expected] ?? r.expected, a = X(r.input), s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Ugyldig input: forventet instanceof ${r.expected}, fikk ${s}` : `Ugyldig input: forventet ${i}, fikk ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Ugyldig verdi: forventet ${q(r.values[0])}` : `Ugyldig valg: forventet en av ${C(r.values, "|")}`;
      case "too_big": {
        const i = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `For stor(t): forventet ${r.origin ?? "value"} til å ha ${i}${r.maximum.toString()} ${a.unit ?? "elementer"}` : `For stor(t): forventet ${r.origin ?? "value"} til å ha ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        const i = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `For lite(n): forventet ${r.origin} til å ha ${i}${r.minimum.toString()} ${a.unit}` : `For lite(n): forventet ${r.origin} til å ha ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        const i = r;
        return i.format === "starts_with" ? `Ugyldig streng: må starte med "${i.prefix}"` : i.format === "ends_with" ? `Ugyldig streng: må ende med "${i.suffix}"` : i.format === "includes" ? `Ugyldig streng: må inneholde "${i.includes}"` : i.format === "regex" ? `Ugyldig streng: må matche mønsteret ${i.pattern}` : `Ugyldig ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Ugyldig tall: må være et multiplum av ${r.divisor}`;
      case "unrecognized_keys":
        return `${r.keys.length > 1 ? "Ukjente nøkler" : "Ukjent nøkkel"}: ${C(r.keys, ", ")}`;
      case "invalid_key":
        return `Ugyldig nøkkel i ${r.origin}`;
      case "invalid_union":
        return "Ugyldig input";
      case "invalid_element":
        return `Ugyldig verdi i ${r.origin}`;
      default:
        return "Ugyldig input";
    }
  };
};
function TI() {
  return {
    localeError: PI()
  };
}
const CI = () => {
  const e = {
    string: { unit: "harf", verb: "olmalıdır" },
    file: { unit: "bayt", verb: "olmalıdır" },
    array: { unit: "unsur", verb: "olmalıdır" },
    set: { unit: "unsur", verb: "olmalıdır" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "giren",
    email: "epostagâh",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO hengâmı",
    date: "ISO tarihi",
    time: "ISO zamanı",
    duration: "ISO müddeti",
    ipv4: "IPv4 nişânı",
    ipv6: "IPv6 nişânı",
    cidrv4: "IPv4 menzili",
    cidrv6: "IPv6 menzili",
    base64: "base64-şifreli metin",
    base64url: "base64url-şifreli metin",
    json_string: "JSON metin",
    e164: "E.164 sayısı",
    jwt: "JWT",
    template_literal: "giren"
  }, o = {
    nan: "NaN",
    number: "numara",
    array: "saf",
    null: "gayb"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const i = o[r.expected] ?? r.expected, a = X(r.input), s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Fâsit giren: umulan instanceof ${r.expected}, alınan ${s}` : `Fâsit giren: umulan ${i}, alınan ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Fâsit giren: umulan ${q(r.values[0])}` : `Fâsit tercih: mûteberler ${C(r.values, "|")}`;
      case "too_big": {
        const i = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `Fazla büyük: ${r.origin ?? "value"}, ${i}${r.maximum.toString()} ${a.unit ?? "elements"} sahip olmalıydı.` : `Fazla büyük: ${r.origin ?? "value"}, ${i}${r.maximum.toString()} olmalıydı.`;
      }
      case "too_small": {
        const i = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `Fazla küçük: ${r.origin}, ${i}${r.minimum.toString()} ${a.unit} sahip olmalıydı.` : `Fazla küçük: ${r.origin}, ${i}${r.minimum.toString()} olmalıydı.`;
      }
      case "invalid_format": {
        const i = r;
        return i.format === "starts_with" ? `Fâsit metin: "${i.prefix}" ile başlamalı.` : i.format === "ends_with" ? `Fâsit metin: "${i.suffix}" ile bitmeli.` : i.format === "includes" ? `Fâsit metin: "${i.includes}" ihtivâ etmeli.` : i.format === "regex" ? `Fâsit metin: ${i.pattern} nakşına uymalı.` : `Fâsit ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Fâsit sayı: ${r.divisor} katı olmalıydı.`;
      case "unrecognized_keys":
        return `Tanınmayan anahtar ${r.keys.length > 1 ? "s" : ""}: ${C(r.keys, ", ")}`;
      case "invalid_key":
        return `${r.origin} için tanınmayan anahtar var.`;
      case "invalid_union":
        return "Giren tanınamadı.";
      case "invalid_element":
        return `${r.origin} için tanınmayan kıymet var.`;
      default:
        return "Kıymet tanınamadı.";
    }
  };
};
function MI() {
  return {
    localeError: CI()
  };
}
const zI = () => {
  const e = {
    string: { unit: "توکي", verb: "ولري" },
    file: { unit: "بایټس", verb: "ولري" },
    array: { unit: "توکي", verb: "ولري" },
    set: { unit: "توکي", verb: "ولري" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "ورودي",
    email: "بریښنالیک",
    url: "یو آر ال",
    emoji: "ایموجي",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "نیټه او وخت",
    date: "نېټه",
    time: "وخت",
    duration: "موده",
    ipv4: "د IPv4 پته",
    ipv6: "د IPv6 پته",
    cidrv4: "د IPv4 ساحه",
    cidrv6: "د IPv6 ساحه",
    base64: "base64-encoded متن",
    base64url: "base64url-encoded متن",
    json_string: "JSON متن",
    e164: "د E.164 شمېره",
    jwt: "JWT",
    template_literal: "ورودي"
  }, o = {
    nan: "NaN",
    number: "عدد",
    array: "ارې"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const i = o[r.expected] ?? r.expected, a = X(r.input), s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `ناسم ورودي: باید instanceof ${r.expected} وای, مګر ${s} ترلاسه شو` : `ناسم ورودي: باید ${i} وای, مګر ${s} ترلاسه شو`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `ناسم ورودي: باید ${q(r.values[0])} وای` : `ناسم انتخاب: باید یو له ${C(r.values, "|")} څخه وای`;
      case "too_big": {
        const i = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `ډیر لوی: ${r.origin ?? "ارزښت"} باید ${i}${r.maximum.toString()} ${a.unit ?? "عنصرونه"} ولري` : `ډیر لوی: ${r.origin ?? "ارزښت"} باید ${i}${r.maximum.toString()} وي`;
      }
      case "too_small": {
        const i = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `ډیر کوچنی: ${r.origin} باید ${i}${r.minimum.toString()} ${a.unit} ولري` : `ډیر کوچنی: ${r.origin} باید ${i}${r.minimum.toString()} وي`;
      }
      case "invalid_format": {
        const i = r;
        return i.format === "starts_with" ? `ناسم متن: باید د "${i.prefix}" سره پیل شي` : i.format === "ends_with" ? `ناسم متن: باید د "${i.suffix}" سره پای ته ورسيږي` : i.format === "includes" ? `ناسم متن: باید "${i.includes}" ولري` : i.format === "regex" ? `ناسم متن: باید د ${i.pattern} سره مطابقت ولري` : `${n[i.format] ?? r.format} ناسم دی`;
      }
      case "not_multiple_of":
        return `ناسم عدد: باید د ${r.divisor} مضرب وي`;
      case "unrecognized_keys":
        return `ناسم ${r.keys.length > 1 ? "کلیډونه" : "کلیډ"}: ${C(r.keys, ", ")}`;
      case "invalid_key":
        return `ناسم کلیډ په ${r.origin} کې`;
      case "invalid_union":
        return "ناسمه ورودي";
      case "invalid_element":
        return `ناسم عنصر په ${r.origin} کې`;
      default:
        return "ناسمه ورودي";
    }
  };
};
function RI() {
  return {
    localeError: zI()
  };
}
const AI = () => {
  const e = {
    string: { unit: "znaków", verb: "mieć" },
    file: { unit: "bajtów", verb: "mieć" },
    array: { unit: "elementów", verb: "mieć" },
    set: { unit: "elementów", verb: "mieć" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "wyrażenie",
    email: "adres email",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "data i godzina w formacie ISO",
    date: "data w formacie ISO",
    time: "godzina w formacie ISO",
    duration: "czas trwania ISO",
    ipv4: "adres IPv4",
    ipv6: "adres IPv6",
    cidrv4: "zakres IPv4",
    cidrv6: "zakres IPv6",
    base64: "ciąg znaków zakodowany w formacie base64",
    base64url: "ciąg znaków zakodowany w formacie base64url",
    json_string: "ciąg znaków w formacie JSON",
    e164: "liczba E.164",
    jwt: "JWT",
    template_literal: "wejście"
  }, o = {
    nan: "NaN",
    number: "liczba",
    array: "tablica"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const i = o[r.expected] ?? r.expected, a = X(r.input), s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Nieprawidłowe dane wejściowe: oczekiwano instanceof ${r.expected}, otrzymano ${s}` : `Nieprawidłowe dane wejściowe: oczekiwano ${i}, otrzymano ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Nieprawidłowe dane wejściowe: oczekiwano ${q(r.values[0])}` : `Nieprawidłowa opcja: oczekiwano jednej z wartości ${C(r.values, "|")}`;
      case "too_big": {
        const i = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `Za duża wartość: oczekiwano, że ${r.origin ?? "wartość"} będzie mieć ${i}${r.maximum.toString()} ${a.unit ?? "elementów"}` : `Zbyt duż(y/a/e): oczekiwano, że ${r.origin ?? "wartość"} będzie wynosić ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        const i = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `Za mała wartość: oczekiwano, że ${r.origin ?? "wartość"} będzie mieć ${i}${r.minimum.toString()} ${a.unit ?? "elementów"}` : `Zbyt mał(y/a/e): oczekiwano, że ${r.origin ?? "wartość"} będzie wynosić ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        const i = r;
        return i.format === "starts_with" ? `Nieprawidłowy ciąg znaków: musi zaczynać się od "${i.prefix}"` : i.format === "ends_with" ? `Nieprawidłowy ciąg znaków: musi kończyć się na "${i.suffix}"` : i.format === "includes" ? `Nieprawidłowy ciąg znaków: musi zawierać "${i.includes}"` : i.format === "regex" ? `Nieprawidłowy ciąg znaków: musi odpowiadać wzorcowi ${i.pattern}` : `Nieprawidłow(y/a/e) ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Nieprawidłowa liczba: musi być wielokrotnością ${r.divisor}`;
      case "unrecognized_keys":
        return `Nierozpoznane klucze${r.keys.length > 1 ? "s" : ""}: ${C(r.keys, ", ")}`;
      case "invalid_key":
        return `Nieprawidłowy klucz w ${r.origin}`;
      case "invalid_union":
        return "Nieprawidłowe dane wejściowe";
      case "invalid_element":
        return `Nieprawidłowa wartość w ${r.origin}`;
      default:
        return "Nieprawidłowe dane wejściowe";
    }
  };
};
function UI() {
  return {
    localeError: AI()
  };
}
const jI = () => {
  const e = {
    string: { unit: "caracteres", verb: "ter" },
    file: { unit: "bytes", verb: "ter" },
    array: { unit: "itens", verb: "ter" },
    set: { unit: "itens", verb: "ter" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "padrão",
    email: "endereço de e-mail",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "data e hora ISO",
    date: "data ISO",
    time: "hora ISO",
    duration: "duração ISO",
    ipv4: "endereço IPv4",
    ipv6: "endereço IPv6",
    cidrv4: "faixa de IPv4",
    cidrv6: "faixa de IPv6",
    base64: "texto codificado em base64",
    base64url: "URL codificada em base64",
    json_string: "texto JSON",
    e164: "número E.164",
    jwt: "JWT",
    template_literal: "entrada"
  }, o = {
    nan: "NaN",
    number: "número",
    null: "nulo"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const i = o[r.expected] ?? r.expected, a = X(r.input), s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Tipo inválido: esperado instanceof ${r.expected}, recebido ${s}` : `Tipo inválido: esperado ${i}, recebido ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Entrada inválida: esperado ${q(r.values[0])}` : `Opção inválida: esperada uma das ${C(r.values, "|")}`;
      case "too_big": {
        const i = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `Muito grande: esperado que ${r.origin ?? "valor"} tivesse ${i}${r.maximum.toString()} ${a.unit ?? "elementos"}` : `Muito grande: esperado que ${r.origin ?? "valor"} fosse ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        const i = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `Muito pequeno: esperado que ${r.origin} tivesse ${i}${r.minimum.toString()} ${a.unit}` : `Muito pequeno: esperado que ${r.origin} fosse ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        const i = r;
        return i.format === "starts_with" ? `Texto inválido: deve começar com "${i.prefix}"` : i.format === "ends_with" ? `Texto inválido: deve terminar com "${i.suffix}"` : i.format === "includes" ? `Texto inválido: deve incluir "${i.includes}"` : i.format === "regex" ? `Texto inválido: deve corresponder ao padrão ${i.pattern}` : `${n[i.format] ?? r.format} inválido`;
      }
      case "not_multiple_of":
        return `Número inválido: deve ser múltiplo de ${r.divisor}`;
      case "unrecognized_keys":
        return `Chave${r.keys.length > 1 ? "s" : ""} desconhecida${r.keys.length > 1 ? "s" : ""}: ${C(r.keys, ", ")}`;
      case "invalid_key":
        return `Chave inválida em ${r.origin}`;
      case "invalid_union":
        return "Entrada inválida";
      case "invalid_element":
        return `Valor inválido em ${r.origin}`;
      default:
        return "Campo inválido";
    }
  };
};
function FI() {
  return {
    localeError: jI()
  };
}
function Gm(e, t, n, o) {
  const r = Math.abs(e), i = r % 10, a = r % 100;
  return a >= 11 && a <= 19 ? o : i === 1 ? t : i >= 2 && i <= 4 ? n : o;
}
const WI = () => {
  const e = {
    string: {
      unit: {
        one: "символ",
        few: "символа",
        many: "символов"
      },
      verb: "иметь"
    },
    file: {
      unit: {
        one: "байт",
        few: "байта",
        many: "байт"
      },
      verb: "иметь"
    },
    array: {
      unit: {
        one: "элемент",
        few: "элемента",
        many: "элементов"
      },
      verb: "иметь"
    },
    set: {
      unit: {
        one: "элемент",
        few: "элемента",
        many: "элементов"
      },
      verb: "иметь"
    }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "ввод",
    email: "email адрес",
    url: "URL",
    emoji: "эмодзи",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO дата и время",
    date: "ISO дата",
    time: "ISO время",
    duration: "ISO длительность",
    ipv4: "IPv4 адрес",
    ipv6: "IPv6 адрес",
    cidrv4: "IPv4 диапазон",
    cidrv6: "IPv6 диапазон",
    base64: "строка в формате base64",
    base64url: "строка в формате base64url",
    json_string: "JSON строка",
    e164: "номер E.164",
    jwt: "JWT",
    template_literal: "ввод"
  }, o = {
    nan: "NaN",
    number: "число",
    array: "массив"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const i = o[r.expected] ?? r.expected, a = X(r.input), s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Неверный ввод: ожидалось instanceof ${r.expected}, получено ${s}` : `Неверный ввод: ожидалось ${i}, получено ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Неверный ввод: ожидалось ${q(r.values[0])}` : `Неверный вариант: ожидалось одно из ${C(r.values, "|")}`;
      case "too_big": {
        const i = r.inclusive ? "<=" : "<", a = t(r.origin);
        if (a) {
          const s = Number(r.maximum), c = Gm(s, a.unit.one, a.unit.few, a.unit.many);
          return `Слишком большое значение: ожидалось, что ${r.origin ?? "значение"} будет иметь ${i}${r.maximum.toString()} ${c}`;
        }
        return `Слишком большое значение: ожидалось, что ${r.origin ?? "значение"} будет ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        const i = r.inclusive ? ">=" : ">", a = t(r.origin);
        if (a) {
          const s = Number(r.minimum), c = Gm(s, a.unit.one, a.unit.few, a.unit.many);
          return `Слишком маленькое значение: ожидалось, что ${r.origin} будет иметь ${i}${r.minimum.toString()} ${c}`;
        }
        return `Слишком маленькое значение: ожидалось, что ${r.origin} будет ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        const i = r;
        return i.format === "starts_with" ? `Неверная строка: должна начинаться с "${i.prefix}"` : i.format === "ends_with" ? `Неверная строка: должна заканчиваться на "${i.suffix}"` : i.format === "includes" ? `Неверная строка: должна содержать "${i.includes}"` : i.format === "regex" ? `Неверная строка: должна соответствовать шаблону ${i.pattern}` : `Неверный ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Неверное число: должно быть кратным ${r.divisor}`;
      case "unrecognized_keys":
        return `Нераспознанн${r.keys.length > 1 ? "ые" : "ый"} ключ${r.keys.length > 1 ? "и" : ""}: ${C(r.keys, ", ")}`;
      case "invalid_key":
        return `Неверный ключ в ${r.origin}`;
      case "invalid_union":
        return "Неверные входные данные";
      case "invalid_element":
        return `Неверное значение в ${r.origin}`;
      default:
        return "Неверные входные данные";
    }
  };
};
function LI() {
  return {
    localeError: WI()
  };
}
const ZI = () => {
  const e = {
    string: { unit: "znakov", verb: "imeti" },
    file: { unit: "bajtov", verb: "imeti" },
    array: { unit: "elementov", verb: "imeti" },
    set: { unit: "elementov", verb: "imeti" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "vnos",
    email: "e-poštni naslov",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO datum in čas",
    date: "ISO datum",
    time: "ISO čas",
    duration: "ISO trajanje",
    ipv4: "IPv4 naslov",
    ipv6: "IPv6 naslov",
    cidrv4: "obseg IPv4",
    cidrv6: "obseg IPv6",
    base64: "base64 kodiran niz",
    base64url: "base64url kodiran niz",
    json_string: "JSON niz",
    e164: "E.164 številka",
    jwt: "JWT",
    template_literal: "vnos"
  }, o = {
    nan: "NaN",
    number: "število",
    array: "tabela"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const i = o[r.expected] ?? r.expected, a = X(r.input), s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Neveljaven vnos: pričakovano instanceof ${r.expected}, prejeto ${s}` : `Neveljaven vnos: pričakovano ${i}, prejeto ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Neveljaven vnos: pričakovano ${q(r.values[0])}` : `Neveljavna možnost: pričakovano eno izmed ${C(r.values, "|")}`;
      case "too_big": {
        const i = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `Preveliko: pričakovano, da bo ${r.origin ?? "vrednost"} imelo ${i}${r.maximum.toString()} ${a.unit ?? "elementov"}` : `Preveliko: pričakovano, da bo ${r.origin ?? "vrednost"} ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        const i = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `Premajhno: pričakovano, da bo ${r.origin} imelo ${i}${r.minimum.toString()} ${a.unit}` : `Premajhno: pričakovano, da bo ${r.origin} ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        const i = r;
        return i.format === "starts_with" ? `Neveljaven niz: mora se začeti z "${i.prefix}"` : i.format === "ends_with" ? `Neveljaven niz: mora se končati z "${i.suffix}"` : i.format === "includes" ? `Neveljaven niz: mora vsebovati "${i.includes}"` : i.format === "regex" ? `Neveljaven niz: mora ustrezati vzorcu ${i.pattern}` : `Neveljaven ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Neveljavno število: mora biti večkratnik ${r.divisor}`;
      case "unrecognized_keys":
        return `Neprepoznan${r.keys.length > 1 ? "i ključi" : " ključ"}: ${C(r.keys, ", ")}`;
      case "invalid_key":
        return `Neveljaven ključ v ${r.origin}`;
      case "invalid_union":
        return "Neveljaven vnos";
      case "invalid_element":
        return `Neveljavna vrednost v ${r.origin}`;
      default:
        return "Neveljaven vnos";
    }
  };
};
function YI() {
  return {
    localeError: ZI()
  };
}
const BI = () => {
  const e = {
    string: { unit: "tecken", verb: "att ha" },
    file: { unit: "bytes", verb: "att ha" },
    array: { unit: "objekt", verb: "att innehålla" },
    set: { unit: "objekt", verb: "att innehålla" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "reguljärt uttryck",
    email: "e-postadress",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO-datum och tid",
    date: "ISO-datum",
    time: "ISO-tid",
    duration: "ISO-varaktighet",
    ipv4: "IPv4-intervall",
    ipv6: "IPv6-intervall",
    cidrv4: "IPv4-spektrum",
    cidrv6: "IPv6-spektrum",
    base64: "base64-kodad sträng",
    base64url: "base64url-kodad sträng",
    json_string: "JSON-sträng",
    e164: "E.164-nummer",
    jwt: "JWT",
    template_literal: "mall-literal"
  }, o = {
    nan: "NaN",
    number: "antal",
    array: "lista"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const i = o[r.expected] ?? r.expected, a = X(r.input), s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Ogiltig inmatning: förväntat instanceof ${r.expected}, fick ${s}` : `Ogiltig inmatning: förväntat ${i}, fick ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Ogiltig inmatning: förväntat ${q(r.values[0])}` : `Ogiltigt val: förväntade en av ${C(r.values, "|")}`;
      case "too_big": {
        const i = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `För stor(t): förväntade ${r.origin ?? "värdet"} att ha ${i}${r.maximum.toString()} ${a.unit ?? "element"}` : `För stor(t): förväntat ${r.origin ?? "värdet"} att ha ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        const i = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `För lite(t): förväntade ${r.origin ?? "värdet"} att ha ${i}${r.minimum.toString()} ${a.unit}` : `För lite(t): förväntade ${r.origin ?? "värdet"} att ha ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        const i = r;
        return i.format === "starts_with" ? `Ogiltig sträng: måste börja med "${i.prefix}"` : i.format === "ends_with" ? `Ogiltig sträng: måste sluta med "${i.suffix}"` : i.format === "includes" ? `Ogiltig sträng: måste innehålla "${i.includes}"` : i.format === "regex" ? `Ogiltig sträng: måste matcha mönstret "${i.pattern}"` : `Ogiltig(t) ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Ogiltigt tal: måste vara en multipel av ${r.divisor}`;
      case "unrecognized_keys":
        return `${r.keys.length > 1 ? "Okända nycklar" : "Okänd nyckel"}: ${C(r.keys, ", ")}`;
      case "invalid_key":
        return `Ogiltig nyckel i ${r.origin ?? "värdet"}`;
      case "invalid_union":
        return "Ogiltig input";
      case "invalid_element":
        return `Ogiltigt värde i ${r.origin ?? "värdet"}`;
      default:
        return "Ogiltig input";
    }
  };
};
function HI() {
  return {
    localeError: BI()
  };
}
const GI = () => {
  const e = {
    string: { unit: "எழுத்துக்கள்", verb: "கொண்டிருக்க வேண்டும்" },
    file: { unit: "பைட்டுகள்", verb: "கொண்டிருக்க வேண்டும்" },
    array: { unit: "உறுப்புகள்", verb: "கொண்டிருக்க வேண்டும்" },
    set: { unit: "உறுப்புகள்", verb: "கொண்டிருக்க வேண்டும்" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "உள்ளீடு",
    email: "மின்னஞ்சல் முகவரி",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO தேதி நேரம்",
    date: "ISO தேதி",
    time: "ISO நேரம்",
    duration: "ISO கால அளவு",
    ipv4: "IPv4 முகவரி",
    ipv6: "IPv6 முகவரி",
    cidrv4: "IPv4 வரம்பு",
    cidrv6: "IPv6 வரம்பு",
    base64: "base64-encoded சரம்",
    base64url: "base64url-encoded சரம்",
    json_string: "JSON சரம்",
    e164: "E.164 எண்",
    jwt: "JWT",
    template_literal: "input"
  }, o = {
    nan: "NaN",
    number: "எண்",
    array: "அணி",
    null: "வெறுமை"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const i = o[r.expected] ?? r.expected, a = X(r.input), s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `தவறான உள்ளீடு: எதிர்பார்க்கப்பட்டது instanceof ${r.expected}, பெறப்பட்டது ${s}` : `தவறான உள்ளீடு: எதிர்பார்க்கப்பட்டது ${i}, பெறப்பட்டது ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `தவறான உள்ளீடு: எதிர்பார்க்கப்பட்டது ${q(r.values[0])}` : `தவறான விருப்பம்: எதிர்பார்க்கப்பட்டது ${C(r.values, "|")} இல் ஒன்று`;
      case "too_big": {
        const i = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `மிக பெரியது: எதிர்பார்க்கப்பட்டது ${r.origin ?? "மதிப்பு"} ${i}${r.maximum.toString()} ${a.unit ?? "உறுப்புகள்"} ஆக இருக்க வேண்டும்` : `மிக பெரியது: எதிர்பார்க்கப்பட்டது ${r.origin ?? "மதிப்பு"} ${i}${r.maximum.toString()} ஆக இருக்க வேண்டும்`;
      }
      case "too_small": {
        const i = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `மிகச் சிறியது: எதிர்பார்க்கப்பட்டது ${r.origin} ${i}${r.minimum.toString()} ${a.unit} ஆக இருக்க வேண்டும்` : `மிகச் சிறியது: எதிர்பார்க்கப்பட்டது ${r.origin} ${i}${r.minimum.toString()} ஆக இருக்க வேண்டும்`;
      }
      case "invalid_format": {
        const i = r;
        return i.format === "starts_with" ? `தவறான சரம்: "${i.prefix}" இல் தொடங்க வேண்டும்` : i.format === "ends_with" ? `தவறான சரம்: "${i.suffix}" இல் முடிவடைய வேண்டும்` : i.format === "includes" ? `தவறான சரம்: "${i.includes}" ஐ உள்ளடக்க வேண்டும்` : i.format === "regex" ? `தவறான சரம்: ${i.pattern} முறைபாட்டுடன் பொருந்த வேண்டும்` : `தவறான ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `தவறான எண்: ${r.divisor} இன் பலமாக இருக்க வேண்டும்`;
      case "unrecognized_keys":
        return `அடையாளம் தெரியாத விசை${r.keys.length > 1 ? "கள்" : ""}: ${C(r.keys, ", ")}`;
      case "invalid_key":
        return `${r.origin} இல் தவறான விசை`;
      case "invalid_union":
        return "தவறான உள்ளீடு";
      case "invalid_element":
        return `${r.origin} இல் தவறான மதிப்பு`;
      default:
        return "தவறான உள்ளீடு";
    }
  };
};
function VI() {
  return {
    localeError: GI()
  };
}
const qI = () => {
  const e = {
    string: { unit: "ตัวอักษร", verb: "ควรมี" },
    file: { unit: "ไบต์", verb: "ควรมี" },
    array: { unit: "รายการ", verb: "ควรมี" },
    set: { unit: "รายการ", verb: "ควรมี" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "ข้อมูลที่ป้อน",
    email: "ที่อยู่อีเมล",
    url: "URL",
    emoji: "อิโมจิ",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "วันที่เวลาแบบ ISO",
    date: "วันที่แบบ ISO",
    time: "เวลาแบบ ISO",
    duration: "ช่วงเวลาแบบ ISO",
    ipv4: "ที่อยู่ IPv4",
    ipv6: "ที่อยู่ IPv6",
    cidrv4: "ช่วง IP แบบ IPv4",
    cidrv6: "ช่วง IP แบบ IPv6",
    base64: "ข้อความแบบ Base64",
    base64url: "ข้อความแบบ Base64 สำหรับ URL",
    json_string: "ข้อความแบบ JSON",
    e164: "เบอร์โทรศัพท์ระหว่างประเทศ (E.164)",
    jwt: "โทเคน JWT",
    template_literal: "ข้อมูลที่ป้อน"
  }, o = {
    nan: "NaN",
    number: "ตัวเลข",
    array: "อาร์เรย์ (Array)",
    null: "ไม่มีค่า (null)"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const i = o[r.expected] ?? r.expected, a = X(r.input), s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `ประเภทข้อมูลไม่ถูกต้อง: ควรเป็น instanceof ${r.expected} แต่ได้รับ ${s}` : `ประเภทข้อมูลไม่ถูกต้อง: ควรเป็น ${i} แต่ได้รับ ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `ค่าไม่ถูกต้อง: ควรเป็น ${q(r.values[0])}` : `ตัวเลือกไม่ถูกต้อง: ควรเป็นหนึ่งใน ${C(r.values, "|")}`;
      case "too_big": {
        const i = r.inclusive ? "ไม่เกิน" : "น้อยกว่า", a = t(r.origin);
        return a ? `เกินกำหนด: ${r.origin ?? "ค่า"} ควรมี${i} ${r.maximum.toString()} ${a.unit ?? "รายการ"}` : `เกินกำหนด: ${r.origin ?? "ค่า"} ควรมี${i} ${r.maximum.toString()}`;
      }
      case "too_small": {
        const i = r.inclusive ? "อย่างน้อย" : "มากกว่า", a = t(r.origin);
        return a ? `น้อยกว่ากำหนด: ${r.origin} ควรมี${i} ${r.minimum.toString()} ${a.unit}` : `น้อยกว่ากำหนด: ${r.origin} ควรมี${i} ${r.minimum.toString()}`;
      }
      case "invalid_format": {
        const i = r;
        return i.format === "starts_with" ? `รูปแบบไม่ถูกต้อง: ข้อความต้องขึ้นต้นด้วย "${i.prefix}"` : i.format === "ends_with" ? `รูปแบบไม่ถูกต้อง: ข้อความต้องลงท้ายด้วย "${i.suffix}"` : i.format === "includes" ? `รูปแบบไม่ถูกต้อง: ข้อความต้องมี "${i.includes}" อยู่ในข้อความ` : i.format === "regex" ? `รูปแบบไม่ถูกต้อง: ต้องตรงกับรูปแบบที่กำหนด ${i.pattern}` : `รูปแบบไม่ถูกต้อง: ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `ตัวเลขไม่ถูกต้อง: ต้องเป็นจำนวนที่หารด้วย ${r.divisor} ได้ลงตัว`;
      case "unrecognized_keys":
        return `พบคีย์ที่ไม่รู้จัก: ${C(r.keys, ", ")}`;
      case "invalid_key":
        return `คีย์ไม่ถูกต้องใน ${r.origin}`;
      case "invalid_union":
        return "ข้อมูลไม่ถูกต้อง: ไม่ตรงกับรูปแบบยูเนียนที่กำหนดไว้";
      case "invalid_element":
        return `ข้อมูลไม่ถูกต้องใน ${r.origin}`;
      default:
        return "ข้อมูลไม่ถูกต้อง";
    }
  };
};
function JI() {
  return {
    localeError: qI()
  };
}
const KI = () => {
  const e = {
    string: { unit: "karakter", verb: "olmalı" },
    file: { unit: "bayt", verb: "olmalı" },
    array: { unit: "öğe", verb: "olmalı" },
    set: { unit: "öğe", verb: "olmalı" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "girdi",
    email: "e-posta adresi",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO tarih ve saat",
    date: "ISO tarih",
    time: "ISO saat",
    duration: "ISO süre",
    ipv4: "IPv4 adresi",
    ipv6: "IPv6 adresi",
    cidrv4: "IPv4 aralığı",
    cidrv6: "IPv6 aralığı",
    base64: "base64 ile şifrelenmiş metin",
    base64url: "base64url ile şifrelenmiş metin",
    json_string: "JSON dizesi",
    e164: "E.164 sayısı",
    jwt: "JWT",
    template_literal: "Şablon dizesi"
  }, o = {
    nan: "NaN"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const i = o[r.expected] ?? r.expected, a = X(r.input), s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Geçersiz değer: beklenen instanceof ${r.expected}, alınan ${s}` : `Geçersiz değer: beklenen ${i}, alınan ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Geçersiz değer: beklenen ${q(r.values[0])}` : `Geçersiz seçenek: aşağıdakilerden biri olmalı: ${C(r.values, "|")}`;
      case "too_big": {
        const i = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `Çok büyük: beklenen ${r.origin ?? "değer"} ${i}${r.maximum.toString()} ${a.unit ?? "öğe"}` : `Çok büyük: beklenen ${r.origin ?? "değer"} ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        const i = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `Çok küçük: beklenen ${r.origin} ${i}${r.minimum.toString()} ${a.unit}` : `Çok küçük: beklenen ${r.origin} ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        const i = r;
        return i.format === "starts_with" ? `Geçersiz metin: "${i.prefix}" ile başlamalı` : i.format === "ends_with" ? `Geçersiz metin: "${i.suffix}" ile bitmeli` : i.format === "includes" ? `Geçersiz metin: "${i.includes}" içermeli` : i.format === "regex" ? `Geçersiz metin: ${i.pattern} desenine uymalı` : `Geçersiz ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Geçersiz sayı: ${r.divisor} ile tam bölünebilmeli`;
      case "unrecognized_keys":
        return `Tanınmayan anahtar${r.keys.length > 1 ? "lar" : ""}: ${C(r.keys, ", ")}`;
      case "invalid_key":
        return `${r.origin} içinde geçersiz anahtar`;
      case "invalid_union":
        return "Geçersiz değer";
      case "invalid_element":
        return `${r.origin} içinde geçersiz değer`;
      default:
        return "Geçersiz değer";
    }
  };
};
function XI() {
  return {
    localeError: KI()
  };
}
const QI = () => {
  const e = {
    string: { unit: "символів", verb: "матиме" },
    file: { unit: "байтів", verb: "матиме" },
    array: { unit: "елементів", verb: "матиме" },
    set: { unit: "елементів", verb: "матиме" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "вхідні дані",
    email: "адреса електронної пошти",
    url: "URL",
    emoji: "емодзі",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "дата та час ISO",
    date: "дата ISO",
    time: "час ISO",
    duration: "тривалість ISO",
    ipv4: "адреса IPv4",
    ipv6: "адреса IPv6",
    cidrv4: "діапазон IPv4",
    cidrv6: "діапазон IPv6",
    base64: "рядок у кодуванні base64",
    base64url: "рядок у кодуванні base64url",
    json_string: "рядок JSON",
    e164: "номер E.164",
    jwt: "JWT",
    template_literal: "вхідні дані"
  }, o = {
    nan: "NaN",
    number: "число",
    array: "масив"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const i = o[r.expected] ?? r.expected, a = X(r.input), s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Неправильні вхідні дані: очікується instanceof ${r.expected}, отримано ${s}` : `Неправильні вхідні дані: очікується ${i}, отримано ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Неправильні вхідні дані: очікується ${q(r.values[0])}` : `Неправильна опція: очікується одне з ${C(r.values, "|")}`;
      case "too_big": {
        const i = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `Занадто велике: очікується, що ${r.origin ?? "значення"} ${a.verb} ${i}${r.maximum.toString()} ${a.unit ?? "елементів"}` : `Занадто велике: очікується, що ${r.origin ?? "значення"} буде ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        const i = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `Занадто мале: очікується, що ${r.origin} ${a.verb} ${i}${r.minimum.toString()} ${a.unit}` : `Занадто мале: очікується, що ${r.origin} буде ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        const i = r;
        return i.format === "starts_with" ? `Неправильний рядок: повинен починатися з "${i.prefix}"` : i.format === "ends_with" ? `Неправильний рядок: повинен закінчуватися на "${i.suffix}"` : i.format === "includes" ? `Неправильний рядок: повинен містити "${i.includes}"` : i.format === "regex" ? `Неправильний рядок: повинен відповідати шаблону ${i.pattern}` : `Неправильний ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Неправильне число: повинно бути кратним ${r.divisor}`;
      case "unrecognized_keys":
        return `Нерозпізнаний ключ${r.keys.length > 1 ? "і" : ""}: ${C(r.keys, ", ")}`;
      case "invalid_key":
        return `Неправильний ключ у ${r.origin}`;
      case "invalid_union":
        return "Неправильні вхідні дані";
      case "invalid_element":
        return `Неправильне значення у ${r.origin}`;
      default:
        return "Неправильні вхідні дані";
    }
  };
};
function fy() {
  return {
    localeError: QI()
  };
}
function eN() {
  return fy();
}
const tN = () => {
  const e = {
    string: { unit: "حروف", verb: "ہونا" },
    file: { unit: "بائٹس", verb: "ہونا" },
    array: { unit: "آئٹمز", verb: "ہونا" },
    set: { unit: "آئٹمز", verb: "ہونا" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "ان پٹ",
    email: "ای میل ایڈریس",
    url: "یو آر ایل",
    emoji: "ایموجی",
    uuid: "یو یو آئی ڈی",
    uuidv4: "یو یو آئی ڈی وی 4",
    uuidv6: "یو یو آئی ڈی وی 6",
    nanoid: "نینو آئی ڈی",
    guid: "جی یو آئی ڈی",
    cuid: "سی یو آئی ڈی",
    cuid2: "سی یو آئی ڈی 2",
    ulid: "یو ایل آئی ڈی",
    xid: "ایکس آئی ڈی",
    ksuid: "کے ایس یو آئی ڈی",
    datetime: "آئی ایس او ڈیٹ ٹائم",
    date: "آئی ایس او تاریخ",
    time: "آئی ایس او وقت",
    duration: "آئی ایس او مدت",
    ipv4: "آئی پی وی 4 ایڈریس",
    ipv6: "آئی پی وی 6 ایڈریس",
    cidrv4: "آئی پی وی 4 رینج",
    cidrv6: "آئی پی وی 6 رینج",
    base64: "بیس 64 ان کوڈڈ سٹرنگ",
    base64url: "بیس 64 یو آر ایل ان کوڈڈ سٹرنگ",
    json_string: "جے ایس او این سٹرنگ",
    e164: "ای 164 نمبر",
    jwt: "جے ڈبلیو ٹی",
    template_literal: "ان پٹ"
  }, o = {
    nan: "NaN",
    number: "نمبر",
    array: "آرے",
    null: "نل"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const i = o[r.expected] ?? r.expected, a = X(r.input), s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `غلط ان پٹ: instanceof ${r.expected} متوقع تھا، ${s} موصول ہوا` : `غلط ان پٹ: ${i} متوقع تھا، ${s} موصول ہوا`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `غلط ان پٹ: ${q(r.values[0])} متوقع تھا` : `غلط آپشن: ${C(r.values, "|")} میں سے ایک متوقع تھا`;
      case "too_big": {
        const i = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `بہت بڑا: ${r.origin ?? "ویلیو"} کے ${i}${r.maximum.toString()} ${a.unit ?? "عناصر"} ہونے متوقع تھے` : `بہت بڑا: ${r.origin ?? "ویلیو"} کا ${i}${r.maximum.toString()} ہونا متوقع تھا`;
      }
      case "too_small": {
        const i = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `بہت چھوٹا: ${r.origin} کے ${i}${r.minimum.toString()} ${a.unit} ہونے متوقع تھے` : `بہت چھوٹا: ${r.origin} کا ${i}${r.minimum.toString()} ہونا متوقع تھا`;
      }
      case "invalid_format": {
        const i = r;
        return i.format === "starts_with" ? `غلط سٹرنگ: "${i.prefix}" سے شروع ہونا چاہیے` : i.format === "ends_with" ? `غلط سٹرنگ: "${i.suffix}" پر ختم ہونا چاہیے` : i.format === "includes" ? `غلط سٹرنگ: "${i.includes}" شامل ہونا چاہیے` : i.format === "regex" ? `غلط سٹرنگ: پیٹرن ${i.pattern} سے میچ ہونا چاہیے` : `غلط ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `غلط نمبر: ${r.divisor} کا مضاعف ہونا چاہیے`;
      case "unrecognized_keys":
        return `غیر تسلیم شدہ کی${r.keys.length > 1 ? "ز" : ""}: ${C(r.keys, "، ")}`;
      case "invalid_key":
        return `${r.origin} میں غلط کی`;
      case "invalid_union":
        return "غلط ان پٹ";
      case "invalid_element":
        return `${r.origin} میں غلط ویلیو`;
      default:
        return "غلط ان پٹ";
    }
  };
};
function nN() {
  return {
    localeError: tN()
  };
}
const rN = () => {
  const e = {
    string: { unit: "belgi", verb: "bo‘lishi kerak" },
    file: { unit: "bayt", verb: "bo‘lishi kerak" },
    array: { unit: "element", verb: "bo‘lishi kerak" },
    set: { unit: "element", verb: "bo‘lishi kerak" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "kirish",
    email: "elektron pochta manzili",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO sana va vaqti",
    date: "ISO sana",
    time: "ISO vaqt",
    duration: "ISO davomiylik",
    ipv4: "IPv4 manzil",
    ipv6: "IPv6 manzil",
    mac: "MAC manzil",
    cidrv4: "IPv4 diapazon",
    cidrv6: "IPv6 diapazon",
    base64: "base64 kodlangan satr",
    base64url: "base64url kodlangan satr",
    json_string: "JSON satr",
    e164: "E.164 raqam",
    jwt: "JWT",
    template_literal: "kirish"
  }, o = {
    nan: "NaN",
    number: "raqam",
    array: "massiv"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const i = o[r.expected] ?? r.expected, a = X(r.input), s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Noto‘g‘ri kirish: kutilgan instanceof ${r.expected}, qabul qilingan ${s}` : `Noto‘g‘ri kirish: kutilgan ${i}, qabul qilingan ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Noto‘g‘ri kirish: kutilgan ${q(r.values[0])}` : `Noto‘g‘ri variant: quyidagilardan biri kutilgan ${C(r.values, "|")}`;
      case "too_big": {
        const i = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `Juda katta: kutilgan ${r.origin ?? "qiymat"} ${i}${r.maximum.toString()} ${a.unit} ${a.verb}` : `Juda katta: kutilgan ${r.origin ?? "qiymat"} ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        const i = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `Juda kichik: kutilgan ${r.origin} ${i}${r.minimum.toString()} ${a.unit} ${a.verb}` : `Juda kichik: kutilgan ${r.origin} ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        const i = r;
        return i.format === "starts_with" ? `Noto‘g‘ri satr: "${i.prefix}" bilan boshlanishi kerak` : i.format === "ends_with" ? `Noto‘g‘ri satr: "${i.suffix}" bilan tugashi kerak` : i.format === "includes" ? `Noto‘g‘ri satr: "${i.includes}" ni o‘z ichiga olishi kerak` : i.format === "regex" ? `Noto‘g‘ri satr: ${i.pattern} shabloniga mos kelishi kerak` : `Noto‘g‘ri ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Noto‘g‘ri raqam: ${r.divisor} ning karralisi bo‘lishi kerak`;
      case "unrecognized_keys":
        return `Noma’lum kalit${r.keys.length > 1 ? "lar" : ""}: ${C(r.keys, ", ")}`;
      case "invalid_key":
        return `${r.origin} dagi kalit noto‘g‘ri`;
      case "invalid_union":
        return "Noto‘g‘ri kirish";
      case "invalid_element":
        return `${r.origin} da noto‘g‘ri qiymat`;
      default:
        return "Noto‘g‘ri kirish";
    }
  };
};
function oN() {
  return {
    localeError: rN()
  };
}
const iN = () => {
  const e = {
    string: { unit: "ký tự", verb: "có" },
    file: { unit: "byte", verb: "có" },
    array: { unit: "phần tử", verb: "có" },
    set: { unit: "phần tử", verb: "có" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "đầu vào",
    email: "địa chỉ email",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ngày giờ ISO",
    date: "ngày ISO",
    time: "giờ ISO",
    duration: "khoảng thời gian ISO",
    ipv4: "địa chỉ IPv4",
    ipv6: "địa chỉ IPv6",
    cidrv4: "dải IPv4",
    cidrv6: "dải IPv6",
    base64: "chuỗi mã hóa base64",
    base64url: "chuỗi mã hóa base64url",
    json_string: "chuỗi JSON",
    e164: "số E.164",
    jwt: "JWT",
    template_literal: "đầu vào"
  }, o = {
    nan: "NaN",
    number: "số",
    array: "mảng"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const i = o[r.expected] ?? r.expected, a = X(r.input), s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Đầu vào không hợp lệ: mong đợi instanceof ${r.expected}, nhận được ${s}` : `Đầu vào không hợp lệ: mong đợi ${i}, nhận được ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Đầu vào không hợp lệ: mong đợi ${q(r.values[0])}` : `Tùy chọn không hợp lệ: mong đợi một trong các giá trị ${C(r.values, "|")}`;
      case "too_big": {
        const i = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `Quá lớn: mong đợi ${r.origin ?? "giá trị"} ${a.verb} ${i}${r.maximum.toString()} ${a.unit ?? "phần tử"}` : `Quá lớn: mong đợi ${r.origin ?? "giá trị"} ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        const i = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `Quá nhỏ: mong đợi ${r.origin} ${a.verb} ${i}${r.minimum.toString()} ${a.unit}` : `Quá nhỏ: mong đợi ${r.origin} ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        const i = r;
        return i.format === "starts_with" ? `Chuỗi không hợp lệ: phải bắt đầu bằng "${i.prefix}"` : i.format === "ends_with" ? `Chuỗi không hợp lệ: phải kết thúc bằng "${i.suffix}"` : i.format === "includes" ? `Chuỗi không hợp lệ: phải bao gồm "${i.includes}"` : i.format === "regex" ? `Chuỗi không hợp lệ: phải khớp với mẫu ${i.pattern}` : `${n[i.format] ?? r.format} không hợp lệ`;
      }
      case "not_multiple_of":
        return `Số không hợp lệ: phải là bội số của ${r.divisor}`;
      case "unrecognized_keys":
        return `Khóa không được nhận dạng: ${C(r.keys, ", ")}`;
      case "invalid_key":
        return `Khóa không hợp lệ trong ${r.origin}`;
      case "invalid_union":
        return "Đầu vào không hợp lệ";
      case "invalid_element":
        return `Giá trị không hợp lệ trong ${r.origin}`;
      default:
        return "Đầu vào không hợp lệ";
    }
  };
};
function aN() {
  return {
    localeError: iN()
  };
}
const sN = () => {
  const e = {
    string: { unit: "字符", verb: "包含" },
    file: { unit: "字节", verb: "包含" },
    array: { unit: "项", verb: "包含" },
    set: { unit: "项", verb: "包含" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "输入",
    email: "电子邮件",
    url: "URL",
    emoji: "表情符号",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO日期时间",
    date: "ISO日期",
    time: "ISO时间",
    duration: "ISO时长",
    ipv4: "IPv4地址",
    ipv6: "IPv6地址",
    cidrv4: "IPv4网段",
    cidrv6: "IPv6网段",
    base64: "base64编码字符串",
    base64url: "base64url编码字符串",
    json_string: "JSON字符串",
    e164: "E.164号码",
    jwt: "JWT",
    template_literal: "输入"
  }, o = {
    nan: "NaN",
    number: "数字",
    array: "数组",
    null: "空值(null)"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const i = o[r.expected] ?? r.expected, a = X(r.input), s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `无效输入：期望 instanceof ${r.expected}，实际接收 ${s}` : `无效输入：期望 ${i}，实际接收 ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `无效输入：期望 ${q(r.values[0])}` : `无效选项：期望以下之一 ${C(r.values, "|")}`;
      case "too_big": {
        const i = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `数值过大：期望 ${r.origin ?? "值"} ${i}${r.maximum.toString()} ${a.unit ?? "个元素"}` : `数值过大：期望 ${r.origin ?? "值"} ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        const i = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `数值过小：期望 ${r.origin} ${i}${r.minimum.toString()} ${a.unit}` : `数值过小：期望 ${r.origin} ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        const i = r;
        return i.format === "starts_with" ? `无效字符串：必须以 "${i.prefix}" 开头` : i.format === "ends_with" ? `无效字符串：必须以 "${i.suffix}" 结尾` : i.format === "includes" ? `无效字符串：必须包含 "${i.includes}"` : i.format === "regex" ? `无效字符串：必须满足正则表达式 ${i.pattern}` : `无效${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `无效数字：必须是 ${r.divisor} 的倍数`;
      case "unrecognized_keys":
        return `出现未知的键(key): ${C(r.keys, ", ")}`;
      case "invalid_key":
        return `${r.origin} 中的键(key)无效`;
      case "invalid_union":
        return "无效输入";
      case "invalid_element":
        return `${r.origin} 中包含无效值(value)`;
      default:
        return "无效输入";
    }
  };
};
function cN() {
  return {
    localeError: sN()
  };
}
const uN = () => {
  const e = {
    string: { unit: "字元", verb: "擁有" },
    file: { unit: "位元組", verb: "擁有" },
    array: { unit: "項目", verb: "擁有" },
    set: { unit: "項目", verb: "擁有" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "輸入",
    email: "郵件地址",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO 日期時間",
    date: "ISO 日期",
    time: "ISO 時間",
    duration: "ISO 期間",
    ipv4: "IPv4 位址",
    ipv6: "IPv6 位址",
    cidrv4: "IPv4 範圍",
    cidrv6: "IPv6 範圍",
    base64: "base64 編碼字串",
    base64url: "base64url 編碼字串",
    json_string: "JSON 字串",
    e164: "E.164 數值",
    jwt: "JWT",
    template_literal: "輸入"
  }, o = {
    nan: "NaN"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const i = o[r.expected] ?? r.expected, a = X(r.input), s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `無效的輸入值：預期為 instanceof ${r.expected}，但收到 ${s}` : `無效的輸入值：預期為 ${i}，但收到 ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `無效的輸入值：預期為 ${q(r.values[0])}` : `無效的選項：預期為以下其中之一 ${C(r.values, "|")}`;
      case "too_big": {
        const i = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `數值過大：預期 ${r.origin ?? "值"} 應為 ${i}${r.maximum.toString()} ${a.unit ?? "個元素"}` : `數值過大：預期 ${r.origin ?? "值"} 應為 ${i}${r.maximum.toString()}`;
      }
      case "too_small": {
        const i = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `數值過小：預期 ${r.origin} 應為 ${i}${r.minimum.toString()} ${a.unit}` : `數值過小：預期 ${r.origin} 應為 ${i}${r.minimum.toString()}`;
      }
      case "invalid_format": {
        const i = r;
        return i.format === "starts_with" ? `無效的字串：必須以 "${i.prefix}" 開頭` : i.format === "ends_with" ? `無效的字串：必須以 "${i.suffix}" 結尾` : i.format === "includes" ? `無效的字串：必須包含 "${i.includes}"` : i.format === "regex" ? `無效的字串：必須符合格式 ${i.pattern}` : `無效的 ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `無效的數字：必須為 ${r.divisor} 的倍數`;
      case "unrecognized_keys":
        return `無法識別的鍵值${r.keys.length > 1 ? "們" : ""}：${C(r.keys, "、")}`;
      case "invalid_key":
        return `${r.origin} 中有無效的鍵值`;
      case "invalid_union":
        return "無效的輸入值";
      case "invalid_element":
        return `${r.origin} 中有無效的值`;
      default:
        return "無效的輸入值";
    }
  };
};
function lN() {
  return {
    localeError: uN()
  };
}
const dN = () => {
  const e = {
    string: { unit: "àmi", verb: "ní" },
    file: { unit: "bytes", verb: "ní" },
    array: { unit: "nkan", verb: "ní" },
    set: { unit: "nkan", verb: "ní" }
  };
  function t(r) {
    return e[r] ?? null;
  }
  const n = {
    regex: "ẹ̀rọ ìbáwọlé",
    email: "àdírẹ́sì ìmẹ́lì",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "àkókò ISO",
    date: "ọjọ́ ISO",
    time: "àkókò ISO",
    duration: "àkókò tó pé ISO",
    ipv4: "àdírẹ́sì IPv4",
    ipv6: "àdírẹ́sì IPv6",
    cidrv4: "àgbègbè IPv4",
    cidrv6: "àgbègbè IPv6",
    base64: "ọ̀rọ̀ tí a kọ́ ní base64",
    base64url: "ọ̀rọ̀ base64url",
    json_string: "ọ̀rọ̀ JSON",
    e164: "nọ́mbà E.164",
    jwt: "JWT",
    template_literal: "ẹ̀rọ ìbáwọlé"
  }, o = {
    nan: "NaN",
    number: "nọ́mbà",
    array: "akopọ"
  };
  return (r) => {
    switch (r.code) {
      case "invalid_type": {
        const i = o[r.expected] ?? r.expected, a = X(r.input), s = o[a] ?? a;
        return /^[A-Z]/.test(r.expected) ? `Ìbáwọlé aṣìṣe: a ní láti fi instanceof ${r.expected}, àmọ̀ a rí ${s}` : `Ìbáwọlé aṣìṣe: a ní láti fi ${i}, àmọ̀ a rí ${s}`;
      }
      case "invalid_value":
        return r.values.length === 1 ? `Ìbáwọlé aṣìṣe: a ní láti fi ${q(r.values[0])}` : `Àṣàyàn aṣìṣe: yan ọ̀kan lára ${C(r.values, "|")}`;
      case "too_big": {
        const i = r.inclusive ? "<=" : "<", a = t(r.origin);
        return a ? `Tó pọ̀ jù: a ní láti jẹ́ pé ${r.origin ?? "iye"} ${a.verb} ${i}${r.maximum} ${a.unit}` : `Tó pọ̀ jù: a ní láti jẹ́ ${i}${r.maximum}`;
      }
      case "too_small": {
        const i = r.inclusive ? ">=" : ">", a = t(r.origin);
        return a ? `Kéré ju: a ní láti jẹ́ pé ${r.origin} ${a.verb} ${i}${r.minimum} ${a.unit}` : `Kéré ju: a ní láti jẹ́ ${i}${r.minimum}`;
      }
      case "invalid_format": {
        const i = r;
        return i.format === "starts_with" ? `Ọ̀rọ̀ aṣìṣe: gbọ́dọ̀ bẹ̀rẹ̀ pẹ̀lú "${i.prefix}"` : i.format === "ends_with" ? `Ọ̀rọ̀ aṣìṣe: gbọ́dọ̀ parí pẹ̀lú "${i.suffix}"` : i.format === "includes" ? `Ọ̀rọ̀ aṣìṣe: gbọ́dọ̀ ní "${i.includes}"` : i.format === "regex" ? `Ọ̀rọ̀ aṣìṣe: gbọ́dọ̀ bá àpẹẹrẹ mu ${i.pattern}` : `Aṣìṣe: ${n[i.format] ?? r.format}`;
      }
      case "not_multiple_of":
        return `Nọ́mbà aṣìṣe: gbọ́dọ̀ jẹ́ èyà pípín ti ${r.divisor}`;
      case "unrecognized_keys":
        return `Bọtìnì àìmọ̀: ${C(r.keys, ", ")}`;
      case "invalid_key":
        return `Bọtìnì aṣìṣe nínú ${r.origin}`;
      case "invalid_union":
        return "Ìbáwọlé aṣìṣe";
      case "invalid_element":
        return `Iye aṣìṣe nínú ${r.origin}`;
      default:
        return "Ìbáwọlé aṣìṣe";
    }
  };
};
function fN() {
  return {
    localeError: dN()
  };
}
const rl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ar: NO,
  az: PO,
  be: CO,
  bg: zO,
  ca: AO,
  cs: jO,
  da: WO,
  de: ZO,
  en: ly,
  eo: HO,
  es: VO,
  fa: JO,
  fi: XO,
  fr: eI,
  frCA: nI,
  he: oI,
  hu: aI,
  hy: cI,
  id: lI,
  is: fI,
  it: hI,
  ja: pI,
  ka: yI,
  kh: wI,
  km: dy,
  ko: $I,
  lt: xI,
  mk: DI,
  ms: II,
  nl: EI,
  no: TI,
  ota: MI,
  pl: UI,
  ps: RI,
  pt: FI,
  ru: LI,
  sl: YI,
  sv: HI,
  ta: VI,
  th: JI,
  tr: XI,
  ua: eN,
  uk: fy,
  ur: nN,
  uz: oN,
  vi: aN,
  yo: fN,
  zhCN: cN,
  zhTW: lN
}, Symbol.toStringTag, { value: "Module" }));
var Vm;
const ol = Symbol("ZodOutput"), il = Symbol("ZodInput");
class my {
  constructor() {
    this._map = /* @__PURE__ */ new WeakMap(), this._idmap = /* @__PURE__ */ new Map();
  }
  add(t, ...n) {
    const o = n[0];
    return this._map.set(t, o), o && typeof o == "object" && "id" in o && this._idmap.set(o.id, t), this;
  }
  clear() {
    return this._map = /* @__PURE__ */ new WeakMap(), this._idmap = /* @__PURE__ */ new Map(), this;
  }
  remove(t) {
    const n = this._map.get(t);
    return n && typeof n == "object" && "id" in n && this._idmap.delete(n.id), this._map.delete(t), this;
  }
  get(t) {
    const n = t._zod.parent;
    if (n) {
      const o = { ...this.get(n) ?? {} };
      delete o.id;
      const r = { ...o, ...this._map.get(t) };
      return Object.keys(r).length ? r : void 0;
    }
    return this._map.get(t);
  }
  has(t) {
    return this._map.has(t);
  }
}
function Aa() {
  return new my();
}
(Vm = globalThis).__zod_globalRegistry ?? (Vm.__zod_globalRegistry = Aa());
const ot = globalThis.__zod_globalRegistry;
// @__NO_SIDE_EFFECTS__
function hy(e, t) {
  return new e({
    type: "string",
    ...E(t)
  });
}
// @__NO_SIDE_EFFECTS__
function gy(e, t) {
  return new e({
    type: "string",
    coerce: !0,
    ...E(t)
  });
}
// @__NO_SIDE_EFFECTS__
function al(e, t) {
  return new e({
    type: "string",
    format: "email",
    check: "string_format",
    abort: !1,
    ...E(t)
  });
}
// @__NO_SIDE_EFFECTS__
function na(e, t) {
  return new e({
    type: "string",
    format: "guid",
    check: "string_format",
    abort: !1,
    ...E(t)
  });
}
// @__NO_SIDE_EFFECTS__
function sl(e, t) {
  return new e({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: !1,
    ...E(t)
  });
}
// @__NO_SIDE_EFFECTS__
function cl(e, t) {
  return new e({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: !1,
    version: "v4",
    ...E(t)
  });
}
// @__NO_SIDE_EFFECTS__
function ul(e, t) {
  return new e({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: !1,
    version: "v6",
    ...E(t)
  });
}
// @__NO_SIDE_EFFECTS__
function ll(e, t) {
  return new e({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: !1,
    version: "v7",
    ...E(t)
  });
}
// @__NO_SIDE_EFFECTS__
function Ua(e, t) {
  return new e({
    type: "string",
    format: "url",
    check: "string_format",
    abort: !1,
    ...E(t)
  });
}
// @__NO_SIDE_EFFECTS__
function dl(e, t) {
  return new e({
    type: "string",
    format: "emoji",
    check: "string_format",
    abort: !1,
    ...E(t)
  });
}
// @__NO_SIDE_EFFECTS__
function fl(e, t) {
  return new e({
    type: "string",
    format: "nanoid",
    check: "string_format",
    abort: !1,
    ...E(t)
  });
}
// @__NO_SIDE_EFFECTS__
function ml(e, t) {
  return new e({
    type: "string",
    format: "cuid",
    check: "string_format",
    abort: !1,
    ...E(t)
  });
}
// @__NO_SIDE_EFFECTS__
function hl(e, t) {
  return new e({
    type: "string",
    format: "cuid2",
    check: "string_format",
    abort: !1,
    ...E(t)
  });
}
// @__NO_SIDE_EFFECTS__
function gl(e, t) {
  return new e({
    type: "string",
    format: "ulid",
    check: "string_format",
    abort: !1,
    ...E(t)
  });
}
// @__NO_SIDE_EFFECTS__
function pl(e, t) {
  return new e({
    type: "string",
    format: "xid",
    check: "string_format",
    abort: !1,
    ...E(t)
  });
}
// @__NO_SIDE_EFFECTS__
function vl(e, t) {
  return new e({
    type: "string",
    format: "ksuid",
    check: "string_format",
    abort: !1,
    ...E(t)
  });
}
// @__NO_SIDE_EFFECTS__
function yl(e, t) {
  return new e({
    type: "string",
    format: "ipv4",
    check: "string_format",
    abort: !1,
    ...E(t)
  });
}
// @__NO_SIDE_EFFECTS__
function bl(e, t) {
  return new e({
    type: "string",
    format: "ipv6",
    check: "string_format",
    abort: !1,
    ...E(t)
  });
}
// @__NO_SIDE_EFFECTS__
function py(e, t) {
  return new e({
    type: "string",
    format: "mac",
    check: "string_format",
    abort: !1,
    ...E(t)
  });
}
// @__NO_SIDE_EFFECTS__
function wl(e, t) {
  return new e({
    type: "string",
    format: "cidrv4",
    check: "string_format",
    abort: !1,
    ...E(t)
  });
}
// @__NO_SIDE_EFFECTS__
function _l(e, t) {
  return new e({
    type: "string",
    format: "cidrv6",
    check: "string_format",
    abort: !1,
    ...E(t)
  });
}
// @__NO_SIDE_EFFECTS__
function $l(e, t) {
  return new e({
    type: "string",
    format: "base64",
    check: "string_format",
    abort: !1,
    ...E(t)
  });
}
// @__NO_SIDE_EFFECTS__
function kl(e, t) {
  return new e({
    type: "string",
    format: "base64url",
    check: "string_format",
    abort: !1,
    ...E(t)
  });
}
// @__NO_SIDE_EFFECTS__
function xl(e, t) {
  return new e({
    type: "string",
    format: "e164",
    check: "string_format",
    abort: !1,
    ...E(t)
  });
}
// @__NO_SIDE_EFFECTS__
function Sl(e, t) {
  return new e({
    type: "string",
    format: "jwt",
    check: "string_format",
    abort: !1,
    ...E(t)
  });
}
const Dl = {
  Any: null,
  Minute: -1,
  Second: 0,
  Millisecond: 3,
  Microsecond: 6
};
// @__NO_SIDE_EFFECTS__
function vy(e, t) {
  return new e({
    type: "string",
    format: "datetime",
    check: "string_format",
    offset: !1,
    local: !1,
    precision: null,
    ...E(t)
  });
}
// @__NO_SIDE_EFFECTS__
function yy(e, t) {
  return new e({
    type: "string",
    format: "date",
    check: "string_format",
    ...E(t)
  });
}
// @__NO_SIDE_EFFECTS__
function by(e, t) {
  return new e({
    type: "string",
    format: "time",
    check: "string_format",
    precision: null,
    ...E(t)
  });
}
// @__NO_SIDE_EFFECTS__
function wy(e, t) {
  return new e({
    type: "string",
    format: "duration",
    check: "string_format",
    ...E(t)
  });
}
// @__NO_SIDE_EFFECTS__
function _y(e, t) {
  return new e({
    type: "number",
    checks: [],
    ...E(t)
  });
}
// @__NO_SIDE_EFFECTS__
function $y(e, t) {
  return new e({
    type: "number",
    coerce: !0,
    checks: [],
    ...E(t)
  });
}
// @__NO_SIDE_EFFECTS__
function ky(e, t) {
  return new e({
    type: "number",
    check: "number_format",
    abort: !1,
    format: "safeint",
    ...E(t)
  });
}
// @__NO_SIDE_EFFECTS__
function xy(e, t) {
  return new e({
    type: "number",
    check: "number_format",
    abort: !1,
    format: "float32",
    ...E(t)
  });
}
// @__NO_SIDE_EFFECTS__
function Sy(e, t) {
  return new e({
    type: "number",
    check: "number_format",
    abort: !1,
    format: "float64",
    ...E(t)
  });
}
// @__NO_SIDE_EFFECTS__
function Dy(e, t) {
  return new e({
    type: "number",
    check: "number_format",
    abort: !1,
    format: "int32",
    ...E(t)
  });
}
// @__NO_SIDE_EFFECTS__
function Oy(e, t) {
  return new e({
    type: "number",
    check: "number_format",
    abort: !1,
    format: "uint32",
    ...E(t)
  });
}
// @__NO_SIDE_EFFECTS__
function Iy(e, t) {
  return new e({
    type: "boolean",
    ...E(t)
  });
}
// @__NO_SIDE_EFFECTS__
function Ny(e, t) {
  return new e({
    type: "boolean",
    coerce: !0,
    ...E(t)
  });
}
// @__NO_SIDE_EFFECTS__
function Ey(e, t) {
  return new e({
    type: "bigint",
    ...E(t)
  });
}
// @__NO_SIDE_EFFECTS__
function Py(e, t) {
  return new e({
    type: "bigint",
    coerce: !0,
    ...E(t)
  });
}
// @__NO_SIDE_EFFECTS__
function Ty(e, t) {
  return new e({
    type: "bigint",
    check: "bigint_format",
    abort: !1,
    format: "int64",
    ...E(t)
  });
}
// @__NO_SIDE_EFFECTS__
function Cy(e, t) {
  return new e({
    type: "bigint",
    check: "bigint_format",
    abort: !1,
    format: "uint64",
    ...E(t)
  });
}
// @__NO_SIDE_EFFECTS__
function My(e, t) {
  return new e({
    type: "symbol",
    ...E(t)
  });
}
// @__NO_SIDE_EFFECTS__
function zy(e, t) {
  return new e({
    type: "undefined",
    ...E(t)
  });
}
// @__NO_SIDE_EFFECTS__
function Ry(e, t) {
  return new e({
    type: "null",
    ...E(t)
  });
}
// @__NO_SIDE_EFFECTS__
function Ay(e) {
  return new e({
    type: "any"
  });
}
// @__NO_SIDE_EFFECTS__
function Uy(e) {
  return new e({
    type: "unknown"
  });
}
// @__NO_SIDE_EFFECTS__
function jy(e, t) {
  return new e({
    type: "never",
    ...E(t)
  });
}
// @__NO_SIDE_EFFECTS__
function Fy(e, t) {
  return new e({
    type: "void",
    ...E(t)
  });
}
// @__NO_SIDE_EFFECTS__
function Wy(e, t) {
  return new e({
    type: "date",
    ...E(t)
  });
}
// @__NO_SIDE_EFFECTS__
function Ly(e, t) {
  return new e({
    type: "date",
    coerce: !0,
    ...E(t)
  });
}
// @__NO_SIDE_EFFECTS__
function Zy(e, t) {
  return new e({
    type: "nan",
    ...E(t)
  });
}
// @__NO_SIDE_EFFECTS__
function Qt(e, t) {
  return new Vu({
    check: "less_than",
    ...E(t),
    value: e,
    inclusive: !1
  });
}
// @__NO_SIDE_EFFECTS__
function it(e, t) {
  return new Vu({
    check: "less_than",
    ...E(t),
    value: e,
    inclusive: !0
  });
}
// @__NO_SIDE_EFFECTS__
function en(e, t) {
  return new qu({
    check: "greater_than",
    ...E(t),
    value: e,
    inclusive: !1
  });
}
// @__NO_SIDE_EFFECTS__
function He(e, t) {
  return new qu({
    check: "greater_than",
    ...E(t),
    value: e,
    inclusive: !0
  });
}
// @__NO_SIDE_EFFECTS__
function ja(e) {
  return /* @__PURE__ */ en(0, e);
}
// @__NO_SIDE_EFFECTS__
function Fa(e) {
  return /* @__PURE__ */ Qt(0, e);
}
// @__NO_SIDE_EFFECTS__
function Wa(e) {
  return /* @__PURE__ */ it(0, e);
}
// @__NO_SIDE_EFFECTS__
function La(e) {
  return /* @__PURE__ */ He(0, e);
}
// @__NO_SIDE_EFFECTS__
function An(e, t) {
  return new Pp({
    check: "multiple_of",
    ...E(t),
    value: e
  });
}
// @__NO_SIDE_EFFECTS__
function Zn(e, t) {
  return new Mp({
    check: "max_size",
    ...E(t),
    maximum: e
  });
}
// @__NO_SIDE_EFFECTS__
function tn(e, t) {
  return new zp({
    check: "min_size",
    ...E(t),
    minimum: e
  });
}
// @__NO_SIDE_EFFECTS__
function Nr(e, t) {
  return new Rp({
    check: "size_equals",
    ...E(t),
    size: e
  });
}
// @__NO_SIDE_EFFECTS__
function Er(e, t) {
  return new Ap({
    check: "max_length",
    ...E(t),
    maximum: e
  });
}
// @__NO_SIDE_EFFECTS__
function hn(e, t) {
  return new Up({
    check: "min_length",
    ...E(t),
    minimum: e
  });
}
// @__NO_SIDE_EFFECTS__
function Pr(e, t) {
  return new jp({
    check: "length_equals",
    ...E(t),
    length: e
  });
}
// @__NO_SIDE_EFFECTS__
function $o(e, t) {
  return new Fp({
    check: "string_format",
    format: "regex",
    ...E(t),
    pattern: e
  });
}
// @__NO_SIDE_EFFECTS__
function ko(e) {
  return new Wp({
    check: "string_format",
    format: "lowercase",
    ...E(e)
  });
}
// @__NO_SIDE_EFFECTS__
function xo(e) {
  return new Lp({
    check: "string_format",
    format: "uppercase",
    ...E(e)
  });
}
// @__NO_SIDE_EFFECTS__
function So(e, t) {
  return new Zp({
    check: "string_format",
    format: "includes",
    ...E(t),
    includes: e
  });
}
// @__NO_SIDE_EFFECTS__
function Do(e, t) {
  return new Yp({
    check: "string_format",
    format: "starts_with",
    ...E(t),
    prefix: e
  });
}
// @__NO_SIDE_EFFECTS__
function Oo(e, t) {
  return new Bp({
    check: "string_format",
    format: "ends_with",
    ...E(t),
    suffix: e
  });
}
// @__NO_SIDE_EFFECTS__
function Za(e, t, n) {
  return new Hp({
    check: "property",
    property: e,
    schema: t,
    ...E(n)
  });
}
// @__NO_SIDE_EFFECTS__
function Io(e, t) {
  return new Gp({
    check: "mime_type",
    mime: e,
    ...E(t)
  });
}
// @__NO_SIDE_EFFECTS__
function Lt(e) {
  return new Vp({
    check: "overwrite",
    tx: e
  });
}
// @__NO_SIDE_EFFECTS__
function No(e) {
  return /* @__PURE__ */ Lt((t) => t.normalize(e));
}
// @__NO_SIDE_EFFECTS__
function Eo() {
  return /* @__PURE__ */ Lt((e) => e.trim());
}
// @__NO_SIDE_EFFECTS__
function Po() {
  return /* @__PURE__ */ Lt((e) => e.toLowerCase());
}
// @__NO_SIDE_EFFECTS__
function To() {
  return /* @__PURE__ */ Lt((e) => e.toUpperCase());
}
// @__NO_SIDE_EFFECTS__
function Co() {
  return /* @__PURE__ */ Lt((e) => Pg(e));
}
// @__NO_SIDE_EFFECTS__
function Yy(e, t, n) {
  return new e({
    type: "array",
    element: t,
    // get element() {
    //   return element;
    // },
    ...E(n)
  });
}
// @__NO_SIDE_EFFECTS__
function mN(e, t, n) {
  return new e({
    type: "union",
    options: t,
    ...E(n)
  });
}
function hN(e, t, n) {
  return new e({
    type: "union",
    options: t,
    inclusive: !1,
    ...E(n)
  });
}
// @__NO_SIDE_EFFECTS__
function gN(e, t, n, o) {
  return new e({
    type: "union",
    options: n,
    discriminator: t,
    ...E(o)
  });
}
// @__NO_SIDE_EFFECTS__
function pN(e, t, n) {
  return new e({
    type: "intersection",
    left: t,
    right: n
  });
}
// @__NO_SIDE_EFFECTS__
function vN(e, t, n, o) {
  const r = n instanceof ee, i = r ? o : n, a = r ? n : null;
  return new e({
    type: "tuple",
    items: t,
    rest: a,
    ...E(i)
  });
}
// @__NO_SIDE_EFFECTS__
function yN(e, t, n, o) {
  return new e({
    type: "record",
    keyType: t,
    valueType: n,
    ...E(o)
  });
}
// @__NO_SIDE_EFFECTS__
function bN(e, t, n, o) {
  return new e({
    type: "map",
    keyType: t,
    valueType: n,
    ...E(o)
  });
}
// @__NO_SIDE_EFFECTS__
function wN(e, t, n) {
  return new e({
    type: "set",
    valueType: t,
    ...E(n)
  });
}
// @__NO_SIDE_EFFECTS__
function _N(e, t, n) {
  const o = Array.isArray(t) ? Object.fromEntries(t.map((r) => [r, r])) : t;
  return new e({
    type: "enum",
    entries: o,
    ...E(n)
  });
}
// @__NO_SIDE_EFFECTS__
function $N(e, t, n) {
  return new e({
    type: "enum",
    entries: t,
    ...E(n)
  });
}
// @__NO_SIDE_EFFECTS__
function kN(e, t, n) {
  return new e({
    type: "literal",
    values: Array.isArray(t) ? t : [t],
    ...E(n)
  });
}
// @__NO_SIDE_EFFECTS__
function By(e, t) {
  return new e({
    type: "file",
    ...E(t)
  });
}
// @__NO_SIDE_EFFECTS__
function xN(e, t) {
  return new e({
    type: "transform",
    transform: t
  });
}
// @__NO_SIDE_EFFECTS__
function SN(e, t) {
  return new e({
    type: "optional",
    innerType: t
  });
}
// @__NO_SIDE_EFFECTS__
function DN(e, t) {
  return new e({
    type: "nullable",
    innerType: t
  });
}
// @__NO_SIDE_EFFECTS__
function ON(e, t, n) {
  return new e({
    type: "default",
    innerType: t,
    get defaultValue() {
      return typeof n == "function" ? n() : Ea(n);
    }
  });
}
// @__NO_SIDE_EFFECTS__
function IN(e, t, n) {
  return new e({
    type: "nonoptional",
    innerType: t,
    ...E(n)
  });
}
// @__NO_SIDE_EFFECTS__
function NN(e, t) {
  return new e({
    type: "success",
    innerType: t
  });
}
// @__NO_SIDE_EFFECTS__
function EN(e, t, n) {
  return new e({
    type: "catch",
    innerType: t,
    catchValue: typeof n == "function" ? n : () => n
  });
}
// @__NO_SIDE_EFFECTS__
function PN(e, t, n) {
  return new e({
    type: "pipe",
    in: t,
    out: n
  });
}
// @__NO_SIDE_EFFECTS__
function TN(e, t) {
  return new e({
    type: "readonly",
    innerType: t
  });
}
// @__NO_SIDE_EFFECTS__
function CN(e, t, n) {
  return new e({
    type: "template_literal",
    parts: t,
    ...E(n)
  });
}
// @__NO_SIDE_EFFECTS__
function MN(e, t) {
  return new e({
    type: "lazy",
    getter: t
  });
}
// @__NO_SIDE_EFFECTS__
function zN(e, t) {
  return new e({
    type: "promise",
    innerType: t
  });
}
// @__NO_SIDE_EFFECTS__
function Hy(e, t, n) {
  const o = E(n);
  return o.abort ?? (o.abort = !0), new e({
    type: "custom",
    check: "custom",
    fn: t,
    ...o
  });
}
// @__NO_SIDE_EFFECTS__
function Gy(e, t, n) {
  return new e({
    type: "custom",
    check: "custom",
    fn: t,
    ...E(n)
  });
}
// @__NO_SIDE_EFFECTS__
function Vy(e) {
  const t = /* @__PURE__ */ qy((n) => (n.addIssue = (o) => {
    if (typeof o == "string")
      n.issues.push(dr(o, n.value, t._zod.def));
    else {
      const r = o;
      r.fatal && (r.continue = !1), r.code ?? (r.code = "custom"), r.input ?? (r.input = n.value), r.inst ?? (r.inst = t), r.continue ?? (r.continue = !t._zod.def.abort), n.issues.push(dr(r));
    }
  }, e(n.value, n)));
  return t;
}
// @__NO_SIDE_EFFECTS__
function qy(e, t) {
  const n = new xe({
    check: "custom",
    ...E(t)
  });
  return n._zod.check = e, n;
}
// @__NO_SIDE_EFFECTS__
function Jy(e) {
  const t = new xe({ check: "describe" });
  return t._zod.onattach = [
    (n) => {
      const o = ot.get(n) ?? {};
      ot.add(n, { ...o, description: e });
    }
  ], t._zod.check = () => {
  }, t;
}
// @__NO_SIDE_EFFECTS__
function Ky(e) {
  const t = new xe({ check: "meta" });
  return t._zod.onattach = [
    (n) => {
      const o = ot.get(n) ?? {};
      ot.add(n, { ...o, ...e });
    }
  ], t._zod.check = () => {
  }, t;
}
// @__NO_SIDE_EFFECTS__
function Xy(e, t) {
  const n = E(t);
  let o = n.truthy ?? ["true", "1", "yes", "on", "y", "enabled"], r = n.falsy ?? ["false", "0", "no", "off", "n", "disabled"];
  n.case !== "sensitive" && (o = o.map((h) => typeof h == "string" ? h.toLowerCase() : h), r = r.map((h) => typeof h == "string" ? h.toLowerCase() : h));
  const i = new Set(o), a = new Set(r), s = e.Codec ?? nl, c = e.Boolean ?? Xu, u = e.String ?? _o, l = new u({ type: "string", error: n.error }), d = new c({ type: "boolean", error: n.error }), f = new s({
    type: "pipe",
    in: l,
    out: d,
    transform: (h, g) => {
      let p = h;
      return n.case !== "sensitive" && (p = p.toLowerCase()), i.has(p) ? !0 : a.has(p) ? !1 : (g.issues.push({
        code: "invalid_value",
        expected: "stringbool",
        values: [...i, ...a],
        input: g.value,
        inst: f,
        continue: !1
      }), {});
    },
    reverseTransform: (h, g) => h === !0 ? o[0] || "true" : r[0] || "false",
    error: n.error
  });
  return f;
}
// @__NO_SIDE_EFFECTS__
function Mo(e, t, n, o = {}) {
  const r = E(o), i = {
    ...E(o),
    check: "string_format",
    type: "string",
    format: t,
    fn: typeof n == "function" ? n : (s) => n.test(s),
    ...r
  };
  return n instanceof RegExp && (i.pattern = n), new e(i);
}
function mr(e) {
  let t = (e == null ? void 0 : e.target) ?? "draft-2020-12";
  return t === "draft-4" && (t = "draft-04"), t === "draft-7" && (t = "draft-07"), {
    processors: e.processors ?? {},
    metadataRegistry: (e == null ? void 0 : e.metadata) ?? ot,
    target: t,
    unrepresentable: (e == null ? void 0 : e.unrepresentable) ?? "throw",
    override: (e == null ? void 0 : e.override) ?? (() => {
    }),
    io: (e == null ? void 0 : e.io) ?? "output",
    counter: 0,
    seen: /* @__PURE__ */ new Map(),
    cycles: (e == null ? void 0 : e.cycles) ?? "ref",
    reused: (e == null ? void 0 : e.reused) ?? "inline",
    external: (e == null ? void 0 : e.external) ?? void 0
  };
}
function be(e, t, n = { path: [], schemaPath: [] }) {
  var l, d;
  var o;
  const r = e._zod.def, i = t.seen.get(e);
  if (i)
    return i.count++, n.schemaPath.includes(e) && (i.cycle = n.path), i.schema;
  const a = { schema: {}, count: 1, cycle: void 0, path: n.path };
  t.seen.set(e, a);
  const s = (d = (l = e._zod).toJSONSchema) == null ? void 0 : d.call(l);
  if (s)
    a.schema = s;
  else {
    const f = {
      ...n,
      schemaPath: [...n.schemaPath, e],
      path: n.path
    };
    if (e._zod.processJSONSchema)
      e._zod.processJSONSchema(t, a.schema, f);
    else {
      const g = a.schema, p = t.processors[r.type];
      if (!p)
        throw new Error(`[toJSONSchema]: Non-representable type encountered: ${r.type}`);
      p(e, t, g, f);
    }
    const h = e._zod.parent;
    h && (a.ref || (a.ref = h), be(h, t, f), t.seen.get(h).isParent = !0);
  }
  const c = t.metadataRegistry.get(e);
  return c && Object.assign(a.schema, c), t.io === "input" && Be(e) && (delete a.schema.examples, delete a.schema.default), t.io === "input" && a.schema._prefault && ((o = a.schema).default ?? (o.default = a.schema._prefault)), delete a.schema._prefault, t.seen.get(e).schema;
}
function hr(e, t) {
  var a, s, c, u;
  const n = e.seen.get(t);
  if (!n)
    throw new Error("Unprocessed schema. This is a bug in Zod.");
  const o = /* @__PURE__ */ new Map();
  for (const l of e.seen.entries()) {
    const d = (a = e.metadataRegistry.get(l[0])) == null ? void 0 : a.id;
    if (d) {
      const f = o.get(d);
      if (f && f !== l[0])
        throw new Error(`Duplicate schema id "${d}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);
      o.set(d, l[0]);
    }
  }
  const r = (l) => {
    var p;
    const d = e.target === "draft-2020-12" ? "$defs" : "definitions";
    if (e.external) {
      const v = (p = e.external.registry.get(l[0])) == null ? void 0 : p.id, b = e.external.uri ?? (($) => $);
      if (v)
        return { ref: b(v) };
      const _ = l[1].defId ?? l[1].schema.id ?? `schema${e.counter++}`;
      return l[1].defId = _, { defId: _, ref: `${b("__shared")}#/${d}/${_}` };
    }
    if (l[1] === n)
      return { ref: "#" };
    const h = `#/${d}/`, g = l[1].schema.id ?? `__schema${e.counter++}`;
    return { defId: g, ref: h + g };
  }, i = (l) => {
    if (l[1].schema.$ref)
      return;
    const d = l[1], { ref: f, defId: h } = r(l);
    d.def = { ...d.schema }, h && (d.defId = h);
    const g = d.schema;
    for (const p in g)
      delete g[p];
    g.$ref = f;
  };
  if (e.cycles === "throw")
    for (const l of e.seen.entries()) {
      const d = l[1];
      if (d.cycle)
        throw new Error(`Cycle detected: #/${(s = d.cycle) == null ? void 0 : s.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`);
    }
  for (const l of e.seen.entries()) {
    const d = l[1];
    if (t === l[0]) {
      i(l);
      continue;
    }
    if (e.external) {
      const h = (c = e.external.registry.get(l[0])) == null ? void 0 : c.id;
      if (t !== l[0] && h) {
        i(l);
        continue;
      }
    }
    if ((u = e.metadataRegistry.get(l[0])) == null ? void 0 : u.id) {
      i(l);
      continue;
    }
    if (d.cycle) {
      i(l);
      continue;
    }
    if (d.count > 1 && e.reused === "ref") {
      i(l);
      continue;
    }
  }
}
function gr(e, t) {
  var a, s, c;
  const n = e.seen.get(t);
  if (!n)
    throw new Error("Unprocessed schema. This is a bug in Zod.");
  const o = (u) => {
    const l = e.seen.get(u);
    if (l.ref === null)
      return;
    const d = l.def ?? l.schema, f = { ...d }, h = l.ref;
    if (l.ref = null, h) {
      o(h);
      const p = e.seen.get(h), v = p.schema;
      if (v.$ref && (e.target === "draft-07" || e.target === "draft-04" || e.target === "openapi-3.0") ? (d.allOf = d.allOf ?? [], d.allOf.push(v)) : Object.assign(d, v), Object.assign(d, f), u._zod.parent === h)
        for (const _ in d)
          _ === "$ref" || _ === "allOf" || _ in f || delete d[_];
      if (v.$ref && p.def)
        for (const _ in d)
          _ === "$ref" || _ === "allOf" || _ in p.def && JSON.stringify(d[_]) === JSON.stringify(p.def[_]) && delete d[_];
    }
    const g = u._zod.parent;
    if (g && g !== h) {
      o(g);
      const p = e.seen.get(g);
      if (p != null && p.schema.$ref && (d.$ref = p.schema.$ref, p.def))
        for (const v in d)
          v === "$ref" || v === "allOf" || v in p.def && JSON.stringify(d[v]) === JSON.stringify(p.def[v]) && delete d[v];
    }
    e.override({
      zodSchema: u,
      jsonSchema: d,
      path: l.path ?? []
    });
  };
  for (const u of [...e.seen.entries()].reverse())
    o(u[0]);
  const r = {};
  if (e.target === "draft-2020-12" ? r.$schema = "https://json-schema.org/draft/2020-12/schema" : e.target === "draft-07" ? r.$schema = "http://json-schema.org/draft-07/schema#" : e.target === "draft-04" ? r.$schema = "http://json-schema.org/draft-04/schema#" : e.target, (a = e.external) != null && a.uri) {
    const u = (s = e.external.registry.get(t)) == null ? void 0 : s.id;
    if (!u)
      throw new Error("Schema is missing an `id` property");
    r.$id = e.external.uri(u);
  }
  Object.assign(r, n.def ?? n.schema);
  const i = ((c = e.external) == null ? void 0 : c.defs) ?? {};
  for (const u of e.seen.entries()) {
    const l = u[1];
    l.def && l.defId && (i[l.defId] = l.def);
  }
  e.external || Object.keys(i).length > 0 && (e.target === "draft-2020-12" ? r.$defs = i : r.definitions = i);
  try {
    const u = JSON.parse(JSON.stringify(r));
    return Object.defineProperty(u, "~standard", {
      value: {
        ...t["~standard"],
        jsonSchema: {
          input: to(t, "input", e.processors),
          output: to(t, "output", e.processors)
        }
      },
      enumerable: !1,
      writable: !1
    }), u;
  } catch {
    throw new Error("Error converting schema to JSON.");
  }
}
function Be(e, t) {
  const n = t ?? { seen: /* @__PURE__ */ new Set() };
  if (n.seen.has(e))
    return !1;
  n.seen.add(e);
  const o = e._zod.def;
  if (o.type === "transform")
    return !0;
  if (o.type === "array")
    return Be(o.element, n);
  if (o.type === "set")
    return Be(o.valueType, n);
  if (o.type === "lazy")
    return Be(o.getter(), n);
  if (o.type === "promise" || o.type === "optional" || o.type === "nonoptional" || o.type === "nullable" || o.type === "readonly" || o.type === "default" || o.type === "prefault")
    return Be(o.innerType, n);
  if (o.type === "intersection")
    return Be(o.left, n) || Be(o.right, n);
  if (o.type === "record" || o.type === "map")
    return Be(o.keyType, n) || Be(o.valueType, n);
  if (o.type === "pipe")
    return Be(o.in, n) || Be(o.out, n);
  if (o.type === "object") {
    for (const r in o.shape)
      if (Be(o.shape[r], n))
        return !0;
    return !1;
  }
  if (o.type === "union") {
    for (const r of o.options)
      if (Be(r, n))
        return !0;
    return !1;
  }
  if (o.type === "tuple") {
    for (const r of o.items)
      if (Be(r, n))
        return !0;
    return !!(o.rest && Be(o.rest, n));
  }
  return !1;
}
const Qy = (e, t = {}) => (n) => {
  const o = mr({ ...n, processors: t });
  return be(e, o), hr(o, e), gr(o, e);
}, to = (e, t, n = {}) => (o) => {
  const { libraryOptions: r, target: i } = o ?? {}, a = mr({ ...r ?? {}, target: i, io: t, processors: n });
  return be(e, a), hr(a, e), gr(a, e);
}, RN = {
  guid: "uuid",
  url: "uri",
  datetime: "date-time",
  json_string: "json-string",
  regex: ""
  // do not set
}, eb = (e, t, n, o) => {
  const r = n;
  r.type = "string";
  const { minimum: i, maximum: a, format: s, patterns: c, contentEncoding: u } = e._zod.bag;
  if (typeof i == "number" && (r.minLength = i), typeof a == "number" && (r.maxLength = a), s && (r.format = RN[s] ?? s, r.format === "" && delete r.format, s === "time" && delete r.format), u && (r.contentEncoding = u), c && c.size > 0) {
    const l = [...c];
    l.length === 1 ? r.pattern = l[0].source : l.length > 1 && (r.allOf = [
      ...l.map((d) => ({
        ...t.target === "draft-07" || t.target === "draft-04" || t.target === "openapi-3.0" ? { type: "string" } : {},
        pattern: d.source
      }))
    ]);
  }
}, tb = (e, t, n, o) => {
  const r = n, { minimum: i, maximum: a, format: s, multipleOf: c, exclusiveMaximum: u, exclusiveMinimum: l } = e._zod.bag;
  typeof s == "string" && s.includes("int") ? r.type = "integer" : r.type = "number", typeof l == "number" && (t.target === "draft-04" || t.target === "openapi-3.0" ? (r.minimum = l, r.exclusiveMinimum = !0) : r.exclusiveMinimum = l), typeof i == "number" && (r.minimum = i, typeof l == "number" && t.target !== "draft-04" && (l >= i ? delete r.minimum : delete r.exclusiveMinimum)), typeof u == "number" && (t.target === "draft-04" || t.target === "openapi-3.0" ? (r.maximum = u, r.exclusiveMaximum = !0) : r.exclusiveMaximum = u), typeof a == "number" && (r.maximum = a, typeof u == "number" && t.target !== "draft-04" && (u <= a ? delete r.maximum : delete r.exclusiveMaximum)), typeof c == "number" && (r.multipleOf = c);
}, nb = (e, t, n, o) => {
  n.type = "boolean";
}, rb = (e, t, n, o) => {
  if (t.unrepresentable === "throw")
    throw new Error("BigInt cannot be represented in JSON Schema");
}, ob = (e, t, n, o) => {
  if (t.unrepresentable === "throw")
    throw new Error("Symbols cannot be represented in JSON Schema");
}, ib = (e, t, n, o) => {
  t.target === "openapi-3.0" ? (n.type = "string", n.nullable = !0, n.enum = [null]) : n.type = "null";
}, ab = (e, t, n, o) => {
  if (t.unrepresentable === "throw")
    throw new Error("Undefined cannot be represented in JSON Schema");
}, sb = (e, t, n, o) => {
  if (t.unrepresentable === "throw")
    throw new Error("Void cannot be represented in JSON Schema");
}, cb = (e, t, n, o) => {
  n.not = {};
}, ub = (e, t, n, o) => {
}, lb = (e, t, n, o) => {
}, db = (e, t, n, o) => {
  if (t.unrepresentable === "throw")
    throw new Error("Date cannot be represented in JSON Schema");
}, fb = (e, t, n, o) => {
  const r = e._zod.def, i = Tu(r.entries);
  i.every((a) => typeof a == "number") && (n.type = "number"), i.every((a) => typeof a == "string") && (n.type = "string"), n.enum = i;
}, mb = (e, t, n, o) => {
  const r = e._zod.def, i = [];
  for (const a of r.values)
    if (a === void 0) {
      if (t.unrepresentable === "throw")
        throw new Error("Literal `undefined` cannot be represented in JSON Schema");
    } else if (typeof a == "bigint") {
      if (t.unrepresentable === "throw")
        throw new Error("BigInt literals cannot be represented in JSON Schema");
      i.push(Number(a));
    } else
      i.push(a);
  if (i.length !== 0)
    if (i.length === 1) {
      const a = i[0];
      n.type = a === null ? "null" : typeof a, t.target === "draft-04" || t.target === "openapi-3.0" ? n.enum = [a] : n.const = a;
    } else
      i.every((a) => typeof a == "number") && (n.type = "number"), i.every((a) => typeof a == "string") && (n.type = "string"), i.every((a) => typeof a == "boolean") && (n.type = "boolean"), i.every((a) => a === null) && (n.type = "null"), n.enum = i;
}, hb = (e, t, n, o) => {
  if (t.unrepresentable === "throw")
    throw new Error("NaN cannot be represented in JSON Schema");
}, gb = (e, t, n, o) => {
  const r = n, i = e._zod.pattern;
  if (!i)
    throw new Error("Pattern not found in template literal");
  r.type = "string", r.pattern = i.source;
}, pb = (e, t, n, o) => {
  const r = n, i = {
    type: "string",
    format: "binary",
    contentEncoding: "binary"
  }, { minimum: a, maximum: s, mime: c } = e._zod.bag;
  a !== void 0 && (i.minLength = a), s !== void 0 && (i.maxLength = s), c ? c.length === 1 ? (i.contentMediaType = c[0], Object.assign(r, i)) : (Object.assign(r, i), r.anyOf = c.map((u) => ({ contentMediaType: u }))) : Object.assign(r, i);
}, vb = (e, t, n, o) => {
  n.type = "boolean";
}, yb = (e, t, n, o) => {
  if (t.unrepresentable === "throw")
    throw new Error("Custom types cannot be represented in JSON Schema");
}, bb = (e, t, n, o) => {
  if (t.unrepresentable === "throw")
    throw new Error("Function types cannot be represented in JSON Schema");
}, wb = (e, t, n, o) => {
  if (t.unrepresentable === "throw")
    throw new Error("Transforms cannot be represented in JSON Schema");
}, _b = (e, t, n, o) => {
  if (t.unrepresentable === "throw")
    throw new Error("Map cannot be represented in JSON Schema");
}, $b = (e, t, n, o) => {
  if (t.unrepresentable === "throw")
    throw new Error("Set cannot be represented in JSON Schema");
}, kb = (e, t, n, o) => {
  const r = n, i = e._zod.def, { minimum: a, maximum: s } = e._zod.bag;
  typeof a == "number" && (r.minItems = a), typeof s == "number" && (r.maxItems = s), r.type = "array", r.items = be(i.element, t, { ...o, path: [...o.path, "items"] });
}, xb = (e, t, n, o) => {
  var u;
  const r = n, i = e._zod.def;
  r.type = "object", r.properties = {};
  const a = i.shape;
  for (const l in a)
    r.properties[l] = be(a[l], t, {
      ...o,
      path: [...o.path, "properties", l]
    });
  const s = new Set(Object.keys(a)), c = new Set([...s].filter((l) => {
    const d = i.shape[l]._zod;
    return t.io === "input" ? d.optin === void 0 : d.optout === void 0;
  }));
  c.size > 0 && (r.required = Array.from(c)), ((u = i.catchall) == null ? void 0 : u._zod.def.type) === "never" ? r.additionalProperties = !1 : i.catchall ? i.catchall && (r.additionalProperties = be(i.catchall, t, {
    ...o,
    path: [...o.path, "additionalProperties"]
  })) : t.io === "output" && (r.additionalProperties = !1);
}, Ol = (e, t, n, o) => {
  const r = e._zod.def, i = r.inclusive === !1, a = r.options.map((s, c) => be(s, t, {
    ...o,
    path: [...o.path, i ? "oneOf" : "anyOf", c]
  }));
  i ? n.oneOf = a : n.anyOf = a;
}, Sb = (e, t, n, o) => {
  const r = e._zod.def, i = be(r.left, t, {
    ...o,
    path: [...o.path, "allOf", 0]
  }), a = be(r.right, t, {
    ...o,
    path: [...o.path, "allOf", 1]
  }), s = (u) => "allOf" in u && Object.keys(u).length === 1, c = [
    ...s(i) ? i.allOf : [i],
    ...s(a) ? a.allOf : [a]
  ];
  n.allOf = c;
}, Db = (e, t, n, o) => {
  const r = n, i = e._zod.def;
  r.type = "array";
  const a = t.target === "draft-2020-12" ? "prefixItems" : "items", s = t.target === "draft-2020-12" || t.target === "openapi-3.0" ? "items" : "additionalItems", c = i.items.map((f, h) => be(f, t, {
    ...o,
    path: [...o.path, a, h]
  })), u = i.rest ? be(i.rest, t, {
    ...o,
    path: [...o.path, s, ...t.target === "openapi-3.0" ? [i.items.length] : []]
  }) : null;
  t.target === "draft-2020-12" ? (r.prefixItems = c, u && (r.items = u)) : t.target === "openapi-3.0" ? (r.items = {
    anyOf: c
  }, u && r.items.anyOf.push(u), r.minItems = c.length, u || (r.maxItems = c.length)) : (r.items = c, u && (r.additionalItems = u));
  const { minimum: l, maximum: d } = e._zod.bag;
  typeof l == "number" && (r.minItems = l), typeof d == "number" && (r.maxItems = d);
}, Ob = (e, t, n, o) => {
  const r = n, i = e._zod.def;
  r.type = "object";
  const a = i.keyType, s = a._zod.bag, c = s == null ? void 0 : s.patterns;
  if (i.mode === "loose" && c && c.size > 0) {
    const l = be(i.valueType, t, {
      ...o,
      path: [...o.path, "patternProperties", "*"]
    });
    r.patternProperties = {};
    for (const d of c)
      r.patternProperties[d.source] = l;
  } else
    (t.target === "draft-07" || t.target === "draft-2020-12") && (r.propertyNames = be(i.keyType, t, {
      ...o,
      path: [...o.path, "propertyNames"]
    })), r.additionalProperties = be(i.valueType, t, {
      ...o,
      path: [...o.path, "additionalProperties"]
    });
  const u = a._zod.values;
  if (u) {
    const l = [...u].filter((d) => typeof d == "string" || typeof d == "number");
    l.length > 0 && (r.required = l);
  }
}, Ib = (e, t, n, o) => {
  const r = e._zod.def, i = be(r.innerType, t, o), a = t.seen.get(e);
  t.target === "openapi-3.0" ? (a.ref = r.innerType, n.nullable = !0) : n.anyOf = [i, { type: "null" }];
}, Nb = (e, t, n, o) => {
  const r = e._zod.def;
  be(r.innerType, t, o);
  const i = t.seen.get(e);
  i.ref = r.innerType;
}, Eb = (e, t, n, o) => {
  const r = e._zod.def;
  be(r.innerType, t, o);
  const i = t.seen.get(e);
  i.ref = r.innerType, n.default = JSON.parse(JSON.stringify(r.defaultValue));
}, Pb = (e, t, n, o) => {
  const r = e._zod.def;
  be(r.innerType, t, o);
  const i = t.seen.get(e);
  i.ref = r.innerType, t.io === "input" && (n._prefault = JSON.parse(JSON.stringify(r.defaultValue)));
}, Tb = (e, t, n, o) => {
  const r = e._zod.def;
  be(r.innerType, t, o);
  const i = t.seen.get(e);
  i.ref = r.innerType;
  let a;
  try {
    a = r.catchValue(void 0);
  } catch {
    throw new Error("Dynamic catch values are not supported in JSON Schema");
  }
  n.default = a;
}, Cb = (e, t, n, o) => {
  const r = e._zod.def, i = t.io === "input" ? r.in._zod.def.type === "transform" ? r.out : r.in : r.out;
  be(i, t, o);
  const a = t.seen.get(e);
  a.ref = i;
}, Mb = (e, t, n, o) => {
  const r = e._zod.def;
  be(r.innerType, t, o);
  const i = t.seen.get(e);
  i.ref = r.innerType, n.readOnly = !0;
}, zb = (e, t, n, o) => {
  const r = e._zod.def;
  be(r.innerType, t, o);
  const i = t.seen.get(e);
  i.ref = r.innerType;
}, Il = (e, t, n, o) => {
  const r = e._zod.def;
  be(r.innerType, t, o);
  const i = t.seen.get(e);
  i.ref = r.innerType;
}, Rb = (e, t, n, o) => {
  const r = e._zod.innerType;
  be(r, t, o);
  const i = t.seen.get(e);
  i.ref = r;
}, au = {
  string: eb,
  number: tb,
  boolean: nb,
  bigint: rb,
  symbol: ob,
  null: ib,
  undefined: ab,
  void: sb,
  never: cb,
  any: ub,
  unknown: lb,
  date: db,
  enum: fb,
  literal: mb,
  nan: hb,
  template_literal: gb,
  file: pb,
  success: vb,
  custom: yb,
  function: bb,
  transform: wb,
  map: _b,
  set: $b,
  array: kb,
  object: xb,
  union: Ol,
  intersection: Sb,
  tuple: Db,
  record: Ob,
  nullable: Ib,
  nonoptional: Nb,
  default: Eb,
  prefault: Pb,
  catch: Tb,
  pipe: Cb,
  readonly: Mb,
  promise: zb,
  optional: Il,
  lazy: Rb
};
function Nl(e, t) {
  if ("_idmap" in e) {
    const o = e, r = mr({ ...t, processors: au }), i = {};
    for (const c of o._idmap.entries()) {
      const [u, l] = c;
      be(l, r);
    }
    const a = {}, s = {
      registry: o,
      uri: t == null ? void 0 : t.uri,
      defs: i
    };
    r.external = s;
    for (const c of o._idmap.entries()) {
      const [u, l] = c;
      hr(r, l), a[u] = gr(r, l);
    }
    if (Object.keys(i).length > 0) {
      const c = r.target === "draft-2020-12" ? "$defs" : "definitions";
      a.__shared = {
        [c]: i
      };
    }
    return { schemas: a };
  }
  const n = mr({ ...t, processors: au });
  return be(e, n), hr(n, e), gr(n, e);
}
class AN {
  /** @deprecated Access via ctx instead */
  get metadataRegistry() {
    return this.ctx.metadataRegistry;
  }
  /** @deprecated Access via ctx instead */
  get target() {
    return this.ctx.target;
  }
  /** @deprecated Access via ctx instead */
  get unrepresentable() {
    return this.ctx.unrepresentable;
  }
  /** @deprecated Access via ctx instead */
  get override() {
    return this.ctx.override;
  }
  /** @deprecated Access via ctx instead */
  get io() {
    return this.ctx.io;
  }
  /** @deprecated Access via ctx instead */
  get counter() {
    return this.ctx.counter;
  }
  set counter(t) {
    this.ctx.counter = t;
  }
  /** @deprecated Access via ctx instead */
  get seen() {
    return this.ctx.seen;
  }
  constructor(t) {
    let n = (t == null ? void 0 : t.target) ?? "draft-2020-12";
    n === "draft-4" && (n = "draft-04"), n === "draft-7" && (n = "draft-07"), this.ctx = mr({
      processors: au,
      target: n,
      ...(t == null ? void 0 : t.metadata) && { metadata: t.metadata },
      ...(t == null ? void 0 : t.unrepresentable) && { unrepresentable: t.unrepresentable },
      ...(t == null ? void 0 : t.override) && { override: t.override },
      ...(t == null ? void 0 : t.io) && { io: t.io }
    });
  }
  /**
   * Process a schema to prepare it for JSON Schema generation.
   * This must be called before emit().
   */
  process(t, n = { path: [], schemaPath: [] }) {
    return be(t, this.ctx, n);
  }
  /**
   * Emit the final JSON Schema after processing.
   * Must call process() first.
   */
  emit(t, n) {
    n && (n.cycles && (this.ctx.cycles = n.cycles), n.reused && (this.ctx.reused = n.reused), n.external && (this.ctx.external = n.external)), hr(this.ctx, t);
    const o = gr(this.ctx, t), { "~standard": r, ...i } = o;
    return i;
  }
}
const UN = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null
}, Symbol.toStringTag, { value: "Module" })), Ab = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  $ZodAny: Nv,
  $ZodArray: Mv,
  $ZodAsyncError: Mn,
  $ZodBase64: vv,
  $ZodBase64URL: bv,
  $ZodBigInt: Qu,
  $ZodBigIntFormat: Sv,
  $ZodBoolean: Xu,
  $ZodCIDRv4: gv,
  $ZodCIDRv6: pv,
  $ZodCUID: rv,
  $ZodCUID2: ov,
  $ZodCatch: ty,
  $ZodCheck: xe,
  $ZodCheckBigIntFormat: Cp,
  $ZodCheckEndsWith: Bp,
  $ZodCheckGreaterThan: qu,
  $ZodCheckIncludes: Zp,
  $ZodCheckLengthEquals: jp,
  $ZodCheckLessThan: Vu,
  $ZodCheckLowerCase: Wp,
  $ZodCheckMaxLength: Ap,
  $ZodCheckMaxSize: Mp,
  $ZodCheckMimeType: Gp,
  $ZodCheckMinLength: Up,
  $ZodCheckMinSize: zp,
  $ZodCheckMultipleOf: Pp,
  $ZodCheckNumberFormat: Tp,
  $ZodCheckOverwrite: Vp,
  $ZodCheckProperty: Hp,
  $ZodCheckRegex: Fp,
  $ZodCheckSizeEquals: Rp,
  $ZodCheckStartsWith: Yp,
  $ZodCheckStringFormat: wo,
  $ZodCheckUpperCase: Lp,
  $ZodCodec: nl,
  $ZodCustom: uy,
  $ZodCustomStringFormat: kv,
  $ZodDate: Cv,
  $ZodDefault: Kv,
  $ZodDiscriminatedUnion: Fv,
  $ZodE164: wv,
  $ZodEmail: Qp,
  $ZodEmoji: tv,
  $ZodEncodeError: Ia,
  $ZodEnum: Bv,
  $ZodError: zu,
  $ZodExactOptional: qv,
  $ZodFile: Gv,
  $ZodFunction: ay,
  $ZodGUID: Kp,
  $ZodIPv4: fv,
  $ZodIPv6: mv,
  $ZodISODate: uv,
  $ZodISODateTime: cv,
  $ZodISODuration: dv,
  $ZodISOTime: lv,
  $ZodIntersection: Wv,
  $ZodJWT: $v,
  $ZodKSUID: sv,
  $ZodLazy: cy,
  $ZodLiteral: Hv,
  $ZodMAC: hv,
  $ZodMap: Zv,
  $ZodNaN: ny,
  $ZodNanoID: nv,
  $ZodNever: Pv,
  $ZodNonOptional: Qv,
  $ZodNull: Iv,
  $ZodNullable: Jv,
  $ZodNumber: Ku,
  $ZodNumberFormat: xv,
  $ZodObject: Av,
  $ZodObjectJIT: Uv,
  $ZodOptional: tl,
  $ZodPipe: ry,
  $ZodPrefault: Xv,
  $ZodPromise: sy,
  $ZodReadonly: oy,
  $ZodRealError: ut,
  $ZodRecord: Lv,
  $ZodRegistry: my,
  $ZodSet: Yv,
  $ZodString: _o,
  $ZodStringFormat: $e,
  $ZodSuccess: ey,
  $ZodSymbol: Dv,
  $ZodTemplateLiteral: iy,
  $ZodTransform: Vv,
  $ZodTuple: el,
  $ZodType: ee,
  $ZodULID: iv,
  $ZodURL: ev,
  $ZodUUID: Xp,
  $ZodUndefined: Ov,
  $ZodUnion: Ra,
  $ZodUnknown: Ev,
  $ZodVoid: Tv,
  $ZodXID: av,
  $ZodXor: jv,
  $brand: Pu,
  $constructor: k,
  $input: il,
  $output: ol,
  Doc: qp,
  JSONSchema: UN,
  JSONSchemaGenerator: AN,
  NEVER: Eu,
  TimePrecision: Dl,
  _any: Ay,
  _array: Yy,
  _base64: $l,
  _base64url: kl,
  _bigint: Ey,
  _boolean: Iy,
  _catch: EN,
  _check: qy,
  _cidrv4: wl,
  _cidrv6: _l,
  _coercedBigint: Py,
  _coercedBoolean: Ny,
  _coercedDate: Ly,
  _coercedNumber: $y,
  _coercedString: gy,
  _cuid: ml,
  _cuid2: hl,
  _custom: Hy,
  _date: Wy,
  _decode: ju,
  _decodeAsync: Wu,
  _default: ON,
  _discriminatedUnion: gN,
  _e164: xl,
  _email: al,
  _emoji: dl,
  _encode: Uu,
  _encodeAsync: Fu,
  _endsWith: Oo,
  _enum: _N,
  _file: By,
  _float32: xy,
  _float64: Sy,
  _gt: en,
  _gte: He,
  _guid: na,
  _includes: So,
  _int: ky,
  _int32: Dy,
  _int64: Ty,
  _intersection: pN,
  _ipv4: yl,
  _ipv6: bl,
  _isoDate: yy,
  _isoDateTime: vy,
  _isoDuration: wy,
  _isoTime: by,
  _jwt: Sl,
  _ksuid: vl,
  _lazy: MN,
  _length: Pr,
  _literal: kN,
  _lowercase: ko,
  _lt: Qt,
  _lte: it,
  _mac: py,
  _map: bN,
  _max: it,
  _maxLength: Er,
  _maxSize: Zn,
  _mime: Io,
  _min: He,
  _minLength: hn,
  _minSize: tn,
  _multipleOf: An,
  _nan: Zy,
  _nanoid: fl,
  _nativeEnum: $N,
  _negative: Fa,
  _never: jy,
  _nonnegative: La,
  _nonoptional: IN,
  _nonpositive: Wa,
  _normalize: No,
  _null: Ry,
  _nullable: DN,
  _number: _y,
  _optional: SN,
  _overwrite: Lt,
  _parse: ho,
  _parseAsync: go,
  _pipe: PN,
  _positive: ja,
  _promise: zN,
  _property: Za,
  _readonly: TN,
  _record: yN,
  _refine: Gy,
  _regex: $o,
  _safeDecode: Zu,
  _safeDecodeAsync: Bu,
  _safeEncode: Lu,
  _safeEncodeAsync: Yu,
  _safeParse: po,
  _safeParseAsync: vo,
  _set: wN,
  _size: Nr,
  _slugify: Co,
  _startsWith: Do,
  _string: hy,
  _stringFormat: Mo,
  _stringbool: Xy,
  _success: NN,
  _superRefine: Vy,
  _symbol: My,
  _templateLiteral: CN,
  _toLowerCase: Po,
  _toUpperCase: To,
  _transform: xN,
  _trim: Eo,
  _tuple: vN,
  _uint32: Oy,
  _uint64: Cy,
  _ulid: gl,
  _undefined: zy,
  _union: mN,
  _unknown: Uy,
  _uppercase: xo,
  _url: Ua,
  _uuid: sl,
  _uuidv4: cl,
  _uuidv6: ul,
  _uuidv7: ll,
  _void: Fy,
  _xid: pl,
  _xor: hN,
  clone: ct,
  config: Ue,
  createStandardJSONSchemaMethod: to,
  createToJSONSchemaMethod: Qy,
  decode: KD,
  decodeAsync: QD,
  describe: Jy,
  encode: JD,
  encodeAsync: XD,
  extractDefs: hr,
  finalize: gr,
  flattenError: Ca,
  formatError: Ma,
  globalConfig: Xi,
  globalRegistry: ot,
  initializeContext: mr,
  isValidBase64: Ju,
  isValidBase64URL: yv,
  isValidJWT: _v,
  locales: rl,
  meta: Ky,
  parse: ru,
  parseAsync: ou,
  prettifyError: Au,
  process: be,
  regexes: za,
  registry: Aa,
  safeDecode: tO,
  safeDecodeAsync: rO,
  safeEncode: eO,
  safeEncodeAsync: nO,
  safeParse: Vg,
  safeParseAsync: qg,
  toDotPath: Gg,
  toJSONSchema: Nl,
  treeifyError: Ru,
  util: Mu,
  version: Jp
}, Symbol.toStringTag, { value: "Module" })), jN = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  endsWith: Oo,
  gt: en,
  gte: He,
  includes: So,
  length: Pr,
  lowercase: ko,
  lt: Qt,
  lte: it,
  maxLength: Er,
  maxSize: Zn,
  mime: Io,
  minLength: hn,
  minSize: tn,
  multipleOf: An,
  negative: Fa,
  nonnegative: La,
  nonpositive: Wa,
  normalize: No,
  overwrite: Lt,
  positive: ja,
  property: Za,
  regex: $o,
  size: Nr,
  slugify: Co,
  startsWith: Do,
  toLowerCase: Po,
  toUpperCase: To,
  trim: Eo,
  uppercase: xo
}, Symbol.toStringTag, { value: "Module" })), Ya = /* @__PURE__ */ k("ZodISODateTime", (e, t) => {
  cv.init(e, t), we.init(e, t);
});
function Ub(e) {
  return /* @__PURE__ */ vy(Ya, e);
}
const Ba = /* @__PURE__ */ k("ZodISODate", (e, t) => {
  uv.init(e, t), we.init(e, t);
});
function jb(e) {
  return /* @__PURE__ */ yy(Ba, e);
}
const Ha = /* @__PURE__ */ k("ZodISOTime", (e, t) => {
  lv.init(e, t), we.init(e, t);
});
function Fb(e) {
  return /* @__PURE__ */ by(Ha, e);
}
const Ga = /* @__PURE__ */ k("ZodISODuration", (e, t) => {
  dv.init(e, t), we.init(e, t);
});
function Wb(e) {
  return /* @__PURE__ */ wy(Ga, e);
}
const El = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ZodISODate: Ba,
  ZodISODateTime: Ya,
  ZodISODuration: Ga,
  ZodISOTime: Ha,
  date: jb,
  datetime: Ub,
  duration: Wb,
  time: Fb
}, Symbol.toStringTag, { value: "Module" })), Lb = (e, t) => {
  zu.init(e, t), e.name = "ZodError", Object.defineProperties(e, {
    format: {
      value: (n) => Ma(e, n)
      // enumerable: false,
    },
    flatten: {
      value: (n) => Ca(e, n)
      // enumerable: false,
    },
    addIssue: {
      value: (n) => {
        e.issues.push(n), e.message = JSON.stringify(e.issues, Qi, 2);
      }
      // enumerable: false,
    },
    addIssues: {
      value: (n) => {
        e.issues.push(...n), e.message = JSON.stringify(e.issues, Qi, 2);
      }
      // enumerable: false,
    },
    isEmpty: {
      get() {
        return e.issues.length === 0;
      }
      // enumerable: false,
    }
  });
}, Zb = k("ZodError", Lb), Ke = k("ZodError", Lb, {
  Parent: Error
}), Pl = /* @__PURE__ */ ho(Ke), Tl = /* @__PURE__ */ go(Ke), Cl = /* @__PURE__ */ po(Ke), Ml = /* @__PURE__ */ vo(Ke), zl = /* @__PURE__ */ Uu(Ke), Rl = /* @__PURE__ */ ju(Ke), Al = /* @__PURE__ */ Fu(Ke), Ul = /* @__PURE__ */ Wu(Ke), jl = /* @__PURE__ */ Lu(Ke), Fl = /* @__PURE__ */ Zu(Ke), Wl = /* @__PURE__ */ Yu(Ke), Ll = /* @__PURE__ */ Bu(Ke), te = /* @__PURE__ */ k("ZodType", (e, t) => (ee.init(e, t), Object.assign(e["~standard"], {
  jsonSchema: {
    input: to(e, "input"),
    output: to(e, "output")
  }
}), e.toJSONSchema = Qy(e, {}), e.def = t, e.type = t.type, Object.defineProperty(e, "_def", { value: t }), e.check = (...n) => e.clone(Wt(t, {
  checks: [
    ...t.checks ?? [],
    ...n.map((o) => typeof o == "function" ? { _zod: { check: o, def: { check: "custom" }, onattach: [] } } : o)
  ]
}), {
  parent: !0
}), e.with = e.check, e.clone = (n, o) => ct(e, n, o), e.brand = () => e, e.register = (n, o) => (n.add(e, o), e), e.parse = (n, o) => Pl(e, n, o, { callee: e.parse }), e.safeParse = (n, o) => Cl(e, n, o), e.parseAsync = async (n, o) => Tl(e, n, o, { callee: e.parseAsync }), e.safeParseAsync = async (n, o) => Ml(e, n, o), e.spa = e.safeParseAsync, e.encode = (n, o) => zl(e, n, o), e.decode = (n, o) => Rl(e, n, o), e.encodeAsync = async (n, o) => Al(e, n, o), e.decodeAsync = async (n, o) => Ul(e, n, o), e.safeEncode = (n, o) => jl(e, n, o), e.safeDecode = (n, o) => Fl(e, n, o), e.safeEncodeAsync = async (n, o) => Wl(e, n, o), e.safeDecodeAsync = async (n, o) => Ll(e, n, o), e.refine = (n, o) => e.check(As(n, o)), e.superRefine = (n) => e.check(Us(n)), e.overwrite = (n) => e.check(/* @__PURE__ */ Lt(n)), e.optional = () => vr(e), e.exactOptional = () => bs(e), e.nullable = () => yr(e), e.nullish = () => vr(yr(e)), e.nonoptional = (n) => Ss(e, n), e.array = () => Ar(e), e.or = (n) => ti([e, n]), e.and = (n) => us(e, n), e.transform = (n) => br(e, ri(n)), e.default = (n) => $s(e, n), e.prefault = (n) => xs(e, n), e.catch = (n) => Is(e, n), e.pipe = (n) => br(e, n), e.readonly = () => Ps(e), e.describe = (n) => {
  const o = e.clone();
  return ot.add(o, { description: n }), o;
}, Object.defineProperty(e, "description", {
  get() {
    var n;
    return (n = ot.get(e)) == null ? void 0 : n.description;
  },
  configurable: !0
}), e.meta = (...n) => {
  if (n.length === 0)
    return ot.get(e);
  const o = e.clone();
  return ot.add(o, n[0]), o;
}, e.isOptional = () => e.safeParse(void 0).success, e.isNullable = () => e.safeParse(null).success, e.apply = (n) => n(e), e)), zo = /* @__PURE__ */ k("_ZodString", (e, t) => {
  _o.init(e, t), te.init(e, t), e._zod.processJSONSchema = (o, r, i) => eb(e, o, r);
  const n = e._zod.bag;
  e.format = n.format ?? null, e.minLength = n.minimum ?? null, e.maxLength = n.maximum ?? null, e.regex = (...o) => e.check(/* @__PURE__ */ $o(...o)), e.includes = (...o) => e.check(/* @__PURE__ */ So(...o)), e.startsWith = (...o) => e.check(/* @__PURE__ */ Do(...o)), e.endsWith = (...o) => e.check(/* @__PURE__ */ Oo(...o)), e.min = (...o) => e.check(/* @__PURE__ */ hn(...o)), e.max = (...o) => e.check(/* @__PURE__ */ Er(...o)), e.length = (...o) => e.check(/* @__PURE__ */ Pr(...o)), e.nonempty = (...o) => e.check(/* @__PURE__ */ hn(1, ...o)), e.lowercase = (o) => e.check(/* @__PURE__ */ ko(o)), e.uppercase = (o) => e.check(/* @__PURE__ */ xo(o)), e.trim = () => e.check(/* @__PURE__ */ Eo()), e.normalize = (...o) => e.check(/* @__PURE__ */ No(...o)), e.toLowerCase = () => e.check(/* @__PURE__ */ Po()), e.toUpperCase = () => e.check(/* @__PURE__ */ To()), e.slugify = () => e.check(/* @__PURE__ */ Co());
}), Tr = /* @__PURE__ */ k("ZodString", (e, t) => {
  _o.init(e, t), zo.init(e, t), e.email = (n) => e.check(/* @__PURE__ */ al(Ro, n)), e.url = (n) => e.check(/* @__PURE__ */ Ua(Cr, n)), e.jwt = (n) => e.check(/* @__PURE__ */ Sl(Ko, n)), e.emoji = (n) => e.check(/* @__PURE__ */ dl(Ao, n)), e.guid = (n) => e.check(/* @__PURE__ */ na(pr, n)), e.uuid = (n) => e.check(/* @__PURE__ */ sl(yt, n)), e.uuidv4 = (n) => e.check(/* @__PURE__ */ cl(yt, n)), e.uuidv6 = (n) => e.check(/* @__PURE__ */ ul(yt, n)), e.uuidv7 = (n) => e.check(/* @__PURE__ */ ll(yt, n)), e.nanoid = (n) => e.check(/* @__PURE__ */ fl(Uo, n)), e.guid = (n) => e.check(/* @__PURE__ */ na(pr, n)), e.cuid = (n) => e.check(/* @__PURE__ */ ml(jo, n)), e.cuid2 = (n) => e.check(/* @__PURE__ */ hl(Fo, n)), e.ulid = (n) => e.check(/* @__PURE__ */ gl(Wo, n)), e.base64 = (n) => e.check(/* @__PURE__ */ $l(Vo, n)), e.base64url = (n) => e.check(/* @__PURE__ */ kl(qo, n)), e.xid = (n) => e.check(/* @__PURE__ */ pl(Lo, n)), e.ksuid = (n) => e.check(/* @__PURE__ */ vl(Zo, n)), e.ipv4 = (n) => e.check(/* @__PURE__ */ yl(Yo, n)), e.ipv6 = (n) => e.check(/* @__PURE__ */ bl(Bo, n)), e.cidrv4 = (n) => e.check(/* @__PURE__ */ wl(Ho, n)), e.cidrv6 = (n) => e.check(/* @__PURE__ */ _l(Go, n)), e.e164 = (n) => e.check(/* @__PURE__ */ xl(Jo, n)), e.datetime = (n) => e.check(Ub(n)), e.date = (n) => e.check(jb(n)), e.time = (n) => e.check(Fb(n)), e.duration = (n) => e.check(Wb(n));
});
function no(e) {
  return /* @__PURE__ */ hy(Tr, e);
}
const we = /* @__PURE__ */ k("ZodStringFormat", (e, t) => {
  $e.init(e, t), zo.init(e, t);
}), Ro = /* @__PURE__ */ k("ZodEmail", (e, t) => {
  Qp.init(e, t), we.init(e, t);
});
function Zl(e) {
  return /* @__PURE__ */ al(Ro, e);
}
const pr = /* @__PURE__ */ k("ZodGUID", (e, t) => {
  Kp.init(e, t), we.init(e, t);
});
function Yl(e) {
  return /* @__PURE__ */ na(pr, e);
}
const yt = /* @__PURE__ */ k("ZodUUID", (e, t) => {
  Xp.init(e, t), we.init(e, t);
});
function Bl(e) {
  return /* @__PURE__ */ sl(yt, e);
}
function Hl(e) {
  return /* @__PURE__ */ cl(yt, e);
}
function Gl(e) {
  return /* @__PURE__ */ ul(yt, e);
}
function Vl(e) {
  return /* @__PURE__ */ ll(yt, e);
}
const Cr = /* @__PURE__ */ k("ZodURL", (e, t) => {
  ev.init(e, t), we.init(e, t);
});
function ql(e) {
  return /* @__PURE__ */ Ua(Cr, e);
}
function Jl(e) {
  return /* @__PURE__ */ Ua(Cr, {
    protocol: /^https?$/,
    hostname: hp,
    ...E(e)
  });
}
const Ao = /* @__PURE__ */ k("ZodEmoji", (e, t) => {
  tv.init(e, t), we.init(e, t);
});
function Kl(e) {
  return /* @__PURE__ */ dl(Ao, e);
}
const Uo = /* @__PURE__ */ k("ZodNanoID", (e, t) => {
  nv.init(e, t), we.init(e, t);
});
function Xl(e) {
  return /* @__PURE__ */ fl(Uo, e);
}
const jo = /* @__PURE__ */ k("ZodCUID", (e, t) => {
  rv.init(e, t), we.init(e, t);
});
function Ql(e) {
  return /* @__PURE__ */ ml(jo, e);
}
const Fo = /* @__PURE__ */ k("ZodCUID2", (e, t) => {
  ov.init(e, t), we.init(e, t);
});
function ed(e) {
  return /* @__PURE__ */ hl(Fo, e);
}
const Wo = /* @__PURE__ */ k("ZodULID", (e, t) => {
  iv.init(e, t), we.init(e, t);
});
function td(e) {
  return /* @__PURE__ */ gl(Wo, e);
}
const Lo = /* @__PURE__ */ k("ZodXID", (e, t) => {
  av.init(e, t), we.init(e, t);
});
function nd(e) {
  return /* @__PURE__ */ pl(Lo, e);
}
const Zo = /* @__PURE__ */ k("ZodKSUID", (e, t) => {
  sv.init(e, t), we.init(e, t);
});
function rd(e) {
  return /* @__PURE__ */ vl(Zo, e);
}
const Yo = /* @__PURE__ */ k("ZodIPv4", (e, t) => {
  fv.init(e, t), we.init(e, t);
});
function od(e) {
  return /* @__PURE__ */ yl(Yo, e);
}
const Va = /* @__PURE__ */ k("ZodMAC", (e, t) => {
  hv.init(e, t), we.init(e, t);
});
function id(e) {
  return /* @__PURE__ */ py(Va, e);
}
const Bo = /* @__PURE__ */ k("ZodIPv6", (e, t) => {
  mv.init(e, t), we.init(e, t);
});
function ad(e) {
  return /* @__PURE__ */ bl(Bo, e);
}
const Ho = /* @__PURE__ */ k("ZodCIDRv4", (e, t) => {
  gv.init(e, t), we.init(e, t);
});
function sd(e) {
  return /* @__PURE__ */ wl(Ho, e);
}
const Go = /* @__PURE__ */ k("ZodCIDRv6", (e, t) => {
  pv.init(e, t), we.init(e, t);
});
function cd(e) {
  return /* @__PURE__ */ _l(Go, e);
}
const Vo = /* @__PURE__ */ k("ZodBase64", (e, t) => {
  vv.init(e, t), we.init(e, t);
});
function ud(e) {
  return /* @__PURE__ */ $l(Vo, e);
}
const qo = /* @__PURE__ */ k("ZodBase64URL", (e, t) => {
  bv.init(e, t), we.init(e, t);
});
function ld(e) {
  return /* @__PURE__ */ kl(qo, e);
}
const Jo = /* @__PURE__ */ k("ZodE164", (e, t) => {
  wv.init(e, t), we.init(e, t);
});
function dd(e) {
  return /* @__PURE__ */ xl(Jo, e);
}
const Ko = /* @__PURE__ */ k("ZodJWT", (e, t) => {
  $v.init(e, t), we.init(e, t);
});
function fd(e) {
  return /* @__PURE__ */ Sl(Ko, e);
}
const Yn = /* @__PURE__ */ k("ZodCustomStringFormat", (e, t) => {
  kv.init(e, t), we.init(e, t);
});
function md(e, t, n = {}) {
  return /* @__PURE__ */ Mo(Yn, e, t, n);
}
function hd(e) {
  return /* @__PURE__ */ Mo(Yn, "hostname", mp, e);
}
function gd(e) {
  return /* @__PURE__ */ Mo(Yn, "hex", Np, e);
}
function pd(e, t) {
  const n = (t == null ? void 0 : t.enc) ?? "hex", o = `${e}_${n}`, r = za[o];
  if (!r)
    throw new Error(`Unrecognized hash format: ${o}`);
  return /* @__PURE__ */ Mo(Yn, o, r, t);
}
const Mr = /* @__PURE__ */ k("ZodNumber", (e, t) => {
  Ku.init(e, t), te.init(e, t), e._zod.processJSONSchema = (o, r, i) => tb(e, o, r), e.gt = (o, r) => e.check(/* @__PURE__ */ en(o, r)), e.gte = (o, r) => e.check(/* @__PURE__ */ He(o, r)), e.min = (o, r) => e.check(/* @__PURE__ */ He(o, r)), e.lt = (o, r) => e.check(/* @__PURE__ */ Qt(o, r)), e.lte = (o, r) => e.check(/* @__PURE__ */ it(o, r)), e.max = (o, r) => e.check(/* @__PURE__ */ it(o, r)), e.int = (o) => e.check(ro(o)), e.safe = (o) => e.check(ro(o)), e.positive = (o) => e.check(/* @__PURE__ */ en(0, o)), e.nonnegative = (o) => e.check(/* @__PURE__ */ He(0, o)), e.negative = (o) => e.check(/* @__PURE__ */ Qt(0, o)), e.nonpositive = (o) => e.check(/* @__PURE__ */ it(0, o)), e.multipleOf = (o, r) => e.check(/* @__PURE__ */ An(o, r)), e.step = (o, r) => e.check(/* @__PURE__ */ An(o, r)), e.finite = () => e;
  const n = e._zod.bag;
  e.minValue = Math.max(n.minimum ?? Number.NEGATIVE_INFINITY, n.exclusiveMinimum ?? Number.NEGATIVE_INFINITY) ?? null, e.maxValue = Math.min(n.maximum ?? Number.POSITIVE_INFINITY, n.exclusiveMaximum ?? Number.POSITIVE_INFINITY) ?? null, e.isInt = (n.format ?? "").includes("int") || Number.isSafeInteger(n.multipleOf ?? 0.5), e.isFinite = !0, e.format = n.format ?? null;
});
function qa(e) {
  return /* @__PURE__ */ _y(Mr, e);
}
const _n = /* @__PURE__ */ k("ZodNumberFormat", (e, t) => {
  xv.init(e, t), Mr.init(e, t);
});
function ro(e) {
  return /* @__PURE__ */ ky(_n, e);
}
function vd(e) {
  return /* @__PURE__ */ xy(_n, e);
}
function yd(e) {
  return /* @__PURE__ */ Sy(_n, e);
}
function bd(e) {
  return /* @__PURE__ */ Dy(_n, e);
}
function wd(e) {
  return /* @__PURE__ */ Oy(_n, e);
}
const zr = /* @__PURE__ */ k("ZodBoolean", (e, t) => {
  Xu.init(e, t), te.init(e, t), e._zod.processJSONSchema = (n, o, r) => nb(e, n, o);
});
function Ja(e) {
  return /* @__PURE__ */ Iy(zr, e);
}
const Rr = /* @__PURE__ */ k("ZodBigInt", (e, t) => {
  Qu.init(e, t), te.init(e, t), e._zod.processJSONSchema = (o, r, i) => rb(e, o), e.gte = (o, r) => e.check(/* @__PURE__ */ He(o, r)), e.min = (o, r) => e.check(/* @__PURE__ */ He(o, r)), e.gt = (o, r) => e.check(/* @__PURE__ */ en(o, r)), e.gte = (o, r) => e.check(/* @__PURE__ */ He(o, r)), e.min = (o, r) => e.check(/* @__PURE__ */ He(o, r)), e.lt = (o, r) => e.check(/* @__PURE__ */ Qt(o, r)), e.lte = (o, r) => e.check(/* @__PURE__ */ it(o, r)), e.max = (o, r) => e.check(/* @__PURE__ */ it(o, r)), e.positive = (o) => e.check(/* @__PURE__ */ en(BigInt(0), o)), e.negative = (o) => e.check(/* @__PURE__ */ Qt(BigInt(0), o)), e.nonpositive = (o) => e.check(/* @__PURE__ */ it(BigInt(0), o)), e.nonnegative = (o) => e.check(/* @__PURE__ */ He(BigInt(0), o)), e.multipleOf = (o, r) => e.check(/* @__PURE__ */ An(o, r));
  const n = e._zod.bag;
  e.minValue = n.minimum ?? null, e.maxValue = n.maximum ?? null, e.format = n.format ?? null;
});
function _d(e) {
  return /* @__PURE__ */ Ey(Rr, e);
}
const Xo = /* @__PURE__ */ k("ZodBigIntFormat", (e, t) => {
  Sv.init(e, t), Rr.init(e, t);
});
function $d(e) {
  return /* @__PURE__ */ Ty(Xo, e);
}
function kd(e) {
  return /* @__PURE__ */ Cy(Xo, e);
}
const Ka = /* @__PURE__ */ k("ZodSymbol", (e, t) => {
  Dv.init(e, t), te.init(e, t), e._zod.processJSONSchema = (n, o, r) => ob(e, n);
});
function xd(e) {
  return /* @__PURE__ */ My(Ka, e);
}
const Xa = /* @__PURE__ */ k("ZodUndefined", (e, t) => {
  Ov.init(e, t), te.init(e, t), e._zod.processJSONSchema = (n, o, r) => ab(e, n);
});
function Sd(e) {
  return /* @__PURE__ */ zy(Xa, e);
}
const Qa = /* @__PURE__ */ k("ZodNull", (e, t) => {
  Iv.init(e, t), te.init(e, t), e._zod.processJSONSchema = (n, o, r) => ib(e, n, o);
});
function es(e) {
  return /* @__PURE__ */ Ry(Qa, e);
}
const ts = /* @__PURE__ */ k("ZodAny", (e, t) => {
  Nv.init(e, t), te.init(e, t), e._zod.processJSONSchema = (n, o, r) => ub();
});
function Dd() {
  return /* @__PURE__ */ Ay(ts);
}
const ns = /* @__PURE__ */ k("ZodUnknown", (e, t) => {
  Ev.init(e, t), te.init(e, t), e._zod.processJSONSchema = (n, o, r) => lb();
});
function gn() {
  return /* @__PURE__ */ Uy(ns);
}
const rs = /* @__PURE__ */ k("ZodNever", (e, t) => {
  Pv.init(e, t), te.init(e, t), e._zod.processJSONSchema = (n, o, r) => cb(e, n, o);
});
function Qo(e) {
  return /* @__PURE__ */ jy(rs, e);
}
const os = /* @__PURE__ */ k("ZodVoid", (e, t) => {
  Tv.init(e, t), te.init(e, t), e._zod.processJSONSchema = (n, o, r) => sb(e, n);
});
function Od(e) {
  return /* @__PURE__ */ Fy(os, e);
}
const ei = /* @__PURE__ */ k("ZodDate", (e, t) => {
  Cv.init(e, t), te.init(e, t), e._zod.processJSONSchema = (o, r, i) => db(e, o), e.min = (o, r) => e.check(/* @__PURE__ */ He(o, r)), e.max = (o, r) => e.check(/* @__PURE__ */ it(o, r));
  const n = e._zod.bag;
  e.minDate = n.minimum ? new Date(n.minimum) : null, e.maxDate = n.maximum ? new Date(n.maximum) : null;
});
function Id(e) {
  return /* @__PURE__ */ Wy(ei, e);
}
const is = /* @__PURE__ */ k("ZodArray", (e, t) => {
  Mv.init(e, t), te.init(e, t), e._zod.processJSONSchema = (n, o, r) => kb(e, n, o, r), e.element = t.element, e.min = (n, o) => e.check(/* @__PURE__ */ hn(n, o)), e.nonempty = (n) => e.check(/* @__PURE__ */ hn(1, n)), e.max = (n, o) => e.check(/* @__PURE__ */ Er(n, o)), e.length = (n, o) => e.check(/* @__PURE__ */ Pr(n, o)), e.unwrap = () => e.element;
});
function Ar(e, t) {
  return /* @__PURE__ */ Yy(is, e, t);
}
function Nd(e) {
  const t = e._zod.def.shape;
  return ni(Object.keys(t));
}
const Ur = /* @__PURE__ */ k("ZodObject", (e, t) => {
  Uv.init(e, t), te.init(e, t), e._zod.processJSONSchema = (n, o, r) => xb(e, n, o, r), ie(e, "shape", () => t.shape), e.keyof = () => ni(Object.keys(e._zod.def.shape)), e.catchall = (n) => e.clone({ ...e._zod.def, catchall: n }), e.passthrough = () => e.clone({ ...e._zod.def, catchall: gn() }), e.loose = () => e.clone({ ...e._zod.def, catchall: gn() }), e.strict = () => e.clone({ ...e._zod.def, catchall: Qo() }), e.strip = () => e.clone({ ...e._zod.def, catchall: void 0 }), e.extend = (n) => jg(e, n), e.safeExtend = (n) => Fg(e, n), e.merge = (n) => Wg(e, n), e.pick = (n) => Ag(e, n), e.omit = (n) => Ug(e, n), e.partial = (...n) => Lg(oi, e, n[0]), e.required = (...n) => Zg(ii, e, n[0]);
});
function Ed(e, t) {
  const n = {
    type: "object",
    shape: e ?? {},
    ...E(t)
  };
  return new Ur(n);
}
function Pd(e, t) {
  return new Ur({
    type: "object",
    shape: e,
    catchall: Qo(),
    ...E(t)
  });
}
function Td(e, t) {
  return new Ur({
    type: "object",
    shape: e,
    catchall: gn(),
    ...E(t)
  });
}
const jr = /* @__PURE__ */ k("ZodUnion", (e, t) => {
  Ra.init(e, t), te.init(e, t), e._zod.processJSONSchema = (n, o, r) => Ol(e, n, o, r), e.options = t.options;
});
function ti(e, t) {
  return new jr({
    type: "union",
    options: e,
    ...E(t)
  });
}
const as = /* @__PURE__ */ k("ZodXor", (e, t) => {
  jr.init(e, t), jv.init(e, t), e._zod.processJSONSchema = (n, o, r) => Ol(e, n, o, r), e.options = t.options;
});
function Cd(e, t) {
  return new as({
    type: "union",
    options: e,
    inclusive: !1,
    ...E(t)
  });
}
const ss = /* @__PURE__ */ k("ZodDiscriminatedUnion", (e, t) => {
  jr.init(e, t), Fv.init(e, t);
});
function Md(e, t, n) {
  return new ss({
    type: "union",
    options: t,
    discriminator: e,
    ...E(n)
  });
}
const cs = /* @__PURE__ */ k("ZodIntersection", (e, t) => {
  Wv.init(e, t), te.init(e, t), e._zod.processJSONSchema = (n, o, r) => Sb(e, n, o, r);
});
function us(e, t) {
  return new cs({
    type: "intersection",
    left: e,
    right: t
  });
}
const ls = /* @__PURE__ */ k("ZodTuple", (e, t) => {
  el.init(e, t), te.init(e, t), e._zod.processJSONSchema = (n, o, r) => Db(e, n, o, r), e.rest = (n) => e.clone({
    ...e._zod.def,
    rest: n
  });
});
function ds(e, t, n) {
  const o = t instanceof ee, r = o ? n : t, i = o ? t : null;
  return new ls({
    type: "tuple",
    items: e,
    rest: i,
    ...E(r)
  });
}
const Fr = /* @__PURE__ */ k("ZodRecord", (e, t) => {
  Lv.init(e, t), te.init(e, t), e._zod.processJSONSchema = (n, o, r) => Ob(e, n, o, r), e.keyType = t.keyType, e.valueType = t.valueType;
});
function fs(e, t, n) {
  return new Fr({
    type: "record",
    keyType: e,
    valueType: t,
    ...E(n)
  });
}
function zd(e, t, n) {
  const o = ct(e);
  return o._zod.values = void 0, new Fr({
    type: "record",
    keyType: o,
    valueType: t,
    ...E(n)
  });
}
function Rd(e, t, n) {
  return new Fr({
    type: "record",
    keyType: e,
    valueType: t,
    mode: "loose",
    ...E(n)
  });
}
const ms = /* @__PURE__ */ k("ZodMap", (e, t) => {
  Zv.init(e, t), te.init(e, t), e._zod.processJSONSchema = (n, o, r) => _b(e, n), e.keyType = t.keyType, e.valueType = t.valueType, e.min = (...n) => e.check(/* @__PURE__ */ tn(...n)), e.nonempty = (n) => e.check(/* @__PURE__ */ tn(1, n)), e.max = (...n) => e.check(/* @__PURE__ */ Zn(...n)), e.size = (...n) => e.check(/* @__PURE__ */ Nr(...n));
});
function Ad(e, t, n) {
  return new ms({
    type: "map",
    keyType: e,
    valueType: t,
    ...E(n)
  });
}
const hs = /* @__PURE__ */ k("ZodSet", (e, t) => {
  Yv.init(e, t), te.init(e, t), e._zod.processJSONSchema = (n, o, r) => $b(e, n), e.min = (...n) => e.check(/* @__PURE__ */ tn(...n)), e.nonempty = (n) => e.check(/* @__PURE__ */ tn(1, n)), e.max = (...n) => e.check(/* @__PURE__ */ Zn(...n)), e.size = (...n) => e.check(/* @__PURE__ */ Nr(...n));
});
function Ud(e, t) {
  return new hs({
    type: "set",
    valueType: e,
    ...E(t)
  });
}
const Un = /* @__PURE__ */ k("ZodEnum", (e, t) => {
  Bv.init(e, t), te.init(e, t), e._zod.processJSONSchema = (o, r, i) => fb(e, o, r), e.enum = t.entries, e.options = Object.values(t.entries);
  const n = new Set(Object.keys(t.entries));
  e.extract = (o, r) => {
    const i = {};
    for (const a of o)
      if (n.has(a))
        i[a] = t.entries[a];
      else
        throw new Error(`Key ${a} not found in enum`);
    return new Un({
      ...t,
      checks: [],
      ...E(r),
      entries: i
    });
  }, e.exclude = (o, r) => {
    const i = { ...t.entries };
    for (const a of o)
      if (n.has(a))
        delete i[a];
      else
        throw new Error(`Key ${a} not found in enum`);
    return new Un({
      ...t,
      checks: [],
      ...E(r),
      entries: i
    });
  };
});
function ni(e, t) {
  const n = Array.isArray(e) ? Object.fromEntries(e.map((o) => [o, o])) : e;
  return new Un({
    type: "enum",
    entries: n,
    ...E(t)
  });
}
function jd(e, t) {
  return new Un({
    type: "enum",
    entries: e,
    ...E(t)
  });
}
const gs = /* @__PURE__ */ k("ZodLiteral", (e, t) => {
  Hv.init(e, t), te.init(e, t), e._zod.processJSONSchema = (n, o, r) => mb(e, n, o), e.values = new Set(t.values), Object.defineProperty(e, "value", {
    get() {
      if (t.values.length > 1)
        throw new Error("This schema contains multiple valid literal values. Use `.values` instead.");
      return t.values[0];
    }
  });
});
function Fd(e, t) {
  return new gs({
    type: "literal",
    values: Array.isArray(e) ? e : [e],
    ...E(t)
  });
}
const ps = /* @__PURE__ */ k("ZodFile", (e, t) => {
  Gv.init(e, t), te.init(e, t), e._zod.processJSONSchema = (n, o, r) => pb(e, n, o), e.min = (n, o) => e.check(/* @__PURE__ */ tn(n, o)), e.max = (n, o) => e.check(/* @__PURE__ */ Zn(n, o)), e.mime = (n, o) => e.check(/* @__PURE__ */ Io(Array.isArray(n) ? n : [n], o));
});
function Wd(e) {
  return /* @__PURE__ */ By(ps, e);
}
const vs = /* @__PURE__ */ k("ZodTransform", (e, t) => {
  Vv.init(e, t), te.init(e, t), e._zod.processJSONSchema = (n, o, r) => wb(e, n), e._zod.parse = (n, o) => {
    if (o.direction === "backward")
      throw new Ia(e.constructor.name);
    n.addIssue = (i) => {
      if (typeof i == "string")
        n.issues.push(dr(i, n.value, t));
      else {
        const a = i;
        a.fatal && (a.continue = !1), a.code ?? (a.code = "custom"), a.input ?? (a.input = n.value), a.inst ?? (a.inst = e), n.issues.push(dr(a));
      }
    };
    const r = t.transform(n.value, n);
    return r instanceof Promise ? r.then((i) => (n.value = i, n)) : (n.value = r, n);
  };
});
function ri(e) {
  return new vs({
    type: "transform",
    transform: e
  });
}
const oi = /* @__PURE__ */ k("ZodOptional", (e, t) => {
  tl.init(e, t), te.init(e, t), e._zod.processJSONSchema = (n, o, r) => Il(e, n, o, r), e.unwrap = () => e._zod.def.innerType;
});
function vr(e) {
  return new oi({
    type: "optional",
    innerType: e
  });
}
const ys = /* @__PURE__ */ k("ZodExactOptional", (e, t) => {
  qv.init(e, t), te.init(e, t), e._zod.processJSONSchema = (n, o, r) => Il(e, n, o, r), e.unwrap = () => e._zod.def.innerType;
});
function bs(e) {
  return new ys({
    type: "optional",
    innerType: e
  });
}
const ws = /* @__PURE__ */ k("ZodNullable", (e, t) => {
  Jv.init(e, t), te.init(e, t), e._zod.processJSONSchema = (n, o, r) => Ib(e, n, o, r), e.unwrap = () => e._zod.def.innerType;
});
function yr(e) {
  return new ws({
    type: "nullable",
    innerType: e
  });
}
function Ld(e) {
  return vr(yr(e));
}
const _s = /* @__PURE__ */ k("ZodDefault", (e, t) => {
  Kv.init(e, t), te.init(e, t), e._zod.processJSONSchema = (n, o, r) => Eb(e, n, o, r), e.unwrap = () => e._zod.def.innerType, e.removeDefault = e.unwrap;
});
function $s(e, t) {
  return new _s({
    type: "default",
    innerType: e,
    get defaultValue() {
      return typeof t == "function" ? t() : Ea(t);
    }
  });
}
const ks = /* @__PURE__ */ k("ZodPrefault", (e, t) => {
  Xv.init(e, t), te.init(e, t), e._zod.processJSONSchema = (n, o, r) => Pb(e, n, o, r), e.unwrap = () => e._zod.def.innerType;
});
function xs(e, t) {
  return new ks({
    type: "prefault",
    innerType: e,
    get defaultValue() {
      return typeof t == "function" ? t() : Ea(t);
    }
  });
}
const ii = /* @__PURE__ */ k("ZodNonOptional", (e, t) => {
  Qv.init(e, t), te.init(e, t), e._zod.processJSONSchema = (n, o, r) => Nb(e, n, o, r), e.unwrap = () => e._zod.def.innerType;
});
function Ss(e, t) {
  return new ii({
    type: "nonoptional",
    innerType: e,
    ...E(t)
  });
}
const Ds = /* @__PURE__ */ k("ZodSuccess", (e, t) => {
  ey.init(e, t), te.init(e, t), e._zod.processJSONSchema = (n, o, r) => vb(e, n, o), e.unwrap = () => e._zod.def.innerType;
});
function Zd(e) {
  return new Ds({
    type: "success",
    innerType: e
  });
}
const Os = /* @__PURE__ */ k("ZodCatch", (e, t) => {
  ty.init(e, t), te.init(e, t), e._zod.processJSONSchema = (n, o, r) => Tb(e, n, o, r), e.unwrap = () => e._zod.def.innerType, e.removeCatch = e.unwrap;
});
function Is(e, t) {
  return new Os({
    type: "catch",
    innerType: e,
    catchValue: typeof t == "function" ? t : () => t
  });
}
const Ns = /* @__PURE__ */ k("ZodNaN", (e, t) => {
  ny.init(e, t), te.init(e, t), e._zod.processJSONSchema = (n, o, r) => hb(e, n);
});
function Yd(e) {
  return /* @__PURE__ */ Zy(Ns, e);
}
const ai = /* @__PURE__ */ k("ZodPipe", (e, t) => {
  ry.init(e, t), te.init(e, t), e._zod.processJSONSchema = (n, o, r) => Cb(e, n, o, r), e.in = t.in, e.out = t.out;
});
function br(e, t) {
  return new ai({
    type: "pipe",
    in: e,
    out: t
    // ...util.normalizeParams(params),
  });
}
const si = /* @__PURE__ */ k("ZodCodec", (e, t) => {
  ai.init(e, t), nl.init(e, t);
});
function Bd(e, t, n) {
  return new si({
    type: "pipe",
    in: e,
    out: t,
    transform: n.decode,
    reverseTransform: n.encode
  });
}
const Es = /* @__PURE__ */ k("ZodReadonly", (e, t) => {
  oy.init(e, t), te.init(e, t), e._zod.processJSONSchema = (n, o, r) => Mb(e, n, o, r), e.unwrap = () => e._zod.def.innerType;
});
function Ps(e) {
  return new Es({
    type: "readonly",
    innerType: e
  });
}
const Ts = /* @__PURE__ */ k("ZodTemplateLiteral", (e, t) => {
  iy.init(e, t), te.init(e, t), e._zod.processJSONSchema = (n, o, r) => gb(e, n, o);
});
function Hd(e, t) {
  return new Ts({
    type: "template_literal",
    parts: e,
    ...E(t)
  });
}
const Cs = /* @__PURE__ */ k("ZodLazy", (e, t) => {
  cy.init(e, t), te.init(e, t), e._zod.processJSONSchema = (n, o, r) => Rb(e, n, o, r), e.unwrap = () => e._zod.def.getter();
});
function Ms(e) {
  return new Cs({
    type: "lazy",
    getter: e
  });
}
const zs = /* @__PURE__ */ k("ZodPromise", (e, t) => {
  sy.init(e, t), te.init(e, t), e._zod.processJSONSchema = (n, o, r) => zb(e, n, o, r), e.unwrap = () => e._zod.def.innerType;
});
function Gd(e) {
  return new zs({
    type: "promise",
    innerType: e
  });
}
const Rs = /* @__PURE__ */ k("ZodFunction", (e, t) => {
  ay.init(e, t), te.init(e, t), e._zod.processJSONSchema = (n, o, r) => bb(e, n);
});
function wr(e) {
  return new Rs({
    type: "function",
    input: Array.isArray(e == null ? void 0 : e.input) ? ds(e == null ? void 0 : e.input) : (e == null ? void 0 : e.input) ?? Ar(gn()),
    output: (e == null ? void 0 : e.output) ?? gn()
  });
}
const Wr = /* @__PURE__ */ k("ZodCustom", (e, t) => {
  uy.init(e, t), te.init(e, t), e._zod.processJSONSchema = (n, o, r) => yb(e, n);
});
function Vd(e) {
  const t = new xe({
    check: "custom"
    // ...util.normalizeParams(params),
  });
  return t._zod.check = e, t;
}
function qd(e, t) {
  return /* @__PURE__ */ Hy(Wr, e ?? (() => !0), t);
}
function As(e, t = {}) {
  return /* @__PURE__ */ Gy(Wr, e, t);
}
function Us(e) {
  return /* @__PURE__ */ Vy(e);
}
const Jd = Jy, Kd = Ky;
function Xd(e, t = {}) {
  const n = new Wr({
    type: "custom",
    check: "custom",
    fn: (o) => o instanceof e,
    abort: !0,
    ...E(t)
  });
  return n._zod.bag.Class = e, n._zod.check = (o) => {
    o.value instanceof e || o.issues.push({
      code: "invalid_type",
      expected: e.name,
      input: o.value,
      inst: n,
      path: [...n._zod.def.path ?? []]
    });
  }, n;
}
const Qd = (...e) => /* @__PURE__ */ Xy({
  Codec: si,
  Boolean: zr,
  String: Tr
}, ...e);
function ef(e) {
  const t = Ms(() => ti([no(e), qa(), Ja(), es(), Ar(t), fs(no(), t)]));
  return t;
}
function tf(e, t) {
  return br(ri(e), t);
}
const FN = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ZodAny: ts,
  ZodArray: is,
  ZodBase64: Vo,
  ZodBase64URL: qo,
  ZodBigInt: Rr,
  ZodBigIntFormat: Xo,
  ZodBoolean: zr,
  ZodCIDRv4: Ho,
  ZodCIDRv6: Go,
  ZodCUID: jo,
  ZodCUID2: Fo,
  ZodCatch: Os,
  ZodCodec: si,
  ZodCustom: Wr,
  ZodCustomStringFormat: Yn,
  ZodDate: ei,
  ZodDefault: _s,
  ZodDiscriminatedUnion: ss,
  ZodE164: Jo,
  ZodEmail: Ro,
  ZodEmoji: Ao,
  ZodEnum: Un,
  ZodExactOptional: ys,
  ZodFile: ps,
  ZodFunction: Rs,
  ZodGUID: pr,
  ZodIPv4: Yo,
  ZodIPv6: Bo,
  ZodIntersection: cs,
  ZodJWT: Ko,
  ZodKSUID: Zo,
  ZodLazy: Cs,
  ZodLiteral: gs,
  ZodMAC: Va,
  ZodMap: ms,
  ZodNaN: Ns,
  ZodNanoID: Uo,
  ZodNever: rs,
  ZodNonOptional: ii,
  ZodNull: Qa,
  ZodNullable: ws,
  ZodNumber: Mr,
  ZodNumberFormat: _n,
  ZodObject: Ur,
  ZodOptional: oi,
  ZodPipe: ai,
  ZodPrefault: ks,
  ZodPromise: zs,
  ZodReadonly: Es,
  ZodRecord: Fr,
  ZodSet: hs,
  ZodString: Tr,
  ZodStringFormat: we,
  ZodSuccess: Ds,
  ZodSymbol: Ka,
  ZodTemplateLiteral: Ts,
  ZodTransform: vs,
  ZodTuple: ls,
  ZodType: te,
  ZodULID: Wo,
  ZodURL: Cr,
  ZodUUID: yt,
  ZodUndefined: Xa,
  ZodUnion: jr,
  ZodUnknown: ns,
  ZodVoid: os,
  ZodXID: Lo,
  ZodXor: as,
  _ZodString: zo,
  _default: $s,
  _function: wr,
  any: Dd,
  array: Ar,
  base64: ud,
  base64url: ld,
  bigint: _d,
  boolean: Ja,
  catch: Is,
  check: Vd,
  cidrv4: sd,
  cidrv6: cd,
  codec: Bd,
  cuid: Ql,
  cuid2: ed,
  custom: qd,
  date: Id,
  describe: Jd,
  discriminatedUnion: Md,
  e164: dd,
  email: Zl,
  emoji: Kl,
  enum: ni,
  exactOptional: bs,
  file: Wd,
  float32: vd,
  float64: yd,
  function: wr,
  guid: Yl,
  hash: pd,
  hex: gd,
  hostname: hd,
  httpUrl: Jl,
  instanceof: Xd,
  int: ro,
  int32: bd,
  int64: $d,
  intersection: us,
  ipv4: od,
  ipv6: ad,
  json: ef,
  jwt: fd,
  keyof: Nd,
  ksuid: rd,
  lazy: Ms,
  literal: Fd,
  looseObject: Td,
  looseRecord: Rd,
  mac: id,
  map: Ad,
  meta: Kd,
  nan: Yd,
  nanoid: Xl,
  nativeEnum: jd,
  never: Qo,
  nonoptional: Ss,
  null: es,
  nullable: yr,
  nullish: Ld,
  number: qa,
  object: Ed,
  optional: vr,
  partialRecord: zd,
  pipe: br,
  prefault: xs,
  preprocess: tf,
  promise: Gd,
  readonly: Ps,
  record: fs,
  refine: As,
  set: Ud,
  strictObject: Pd,
  string: no,
  stringFormat: md,
  stringbool: Qd,
  success: Zd,
  superRefine: Us,
  symbol: xd,
  templateLiteral: Hd,
  transform: ri,
  tuple: ds,
  uint32: wd,
  uint64: kd,
  ulid: td,
  undefined: Sd,
  union: ti,
  unknown: gn,
  url: ql,
  uuid: Bl,
  uuidv4: Hl,
  uuidv6: Gl,
  uuidv7: Vl,
  void: Od,
  xid: nd,
  xor: Cd
}, Symbol.toStringTag, { value: "Module" })), Yb = {
  invalid_type: "invalid_type",
  too_big: "too_big",
  too_small: "too_small",
  invalid_format: "invalid_format",
  not_multiple_of: "not_multiple_of",
  unrecognized_keys: "unrecognized_keys",
  invalid_union: "invalid_union",
  invalid_key: "invalid_key",
  invalid_element: "invalid_element",
  invalid_value: "invalid_value",
  custom: "custom"
};
function Bb(e) {
  Ue({
    customError: e
  });
}
function Hb() {
  return Ue().customError;
}
var ra;
ra || (ra = {});
const U = {
  ...FN,
  ...jN,
  iso: El
}, WN = /* @__PURE__ */ new Set([
  // Schema identification
  "$schema",
  "$ref",
  "$defs",
  "definitions",
  // Core schema keywords
  "$id",
  "id",
  "$comment",
  "$anchor",
  "$vocabulary",
  "$dynamicRef",
  "$dynamicAnchor",
  // Type
  "type",
  "enum",
  "const",
  // Composition
  "anyOf",
  "oneOf",
  "allOf",
  "not",
  // Object
  "properties",
  "required",
  "additionalProperties",
  "patternProperties",
  "propertyNames",
  "minProperties",
  "maxProperties",
  // Array
  "items",
  "prefixItems",
  "additionalItems",
  "minItems",
  "maxItems",
  "uniqueItems",
  "contains",
  "minContains",
  "maxContains",
  // String
  "minLength",
  "maxLength",
  "pattern",
  "format",
  // Number
  "minimum",
  "maximum",
  "exclusiveMinimum",
  "exclusiveMaximum",
  "multipleOf",
  // Already handled metadata
  "description",
  "default",
  // Content
  "contentEncoding",
  "contentMediaType",
  "contentSchema",
  // Unsupported (error-throwing)
  "unevaluatedItems",
  "unevaluatedProperties",
  "if",
  "then",
  "else",
  "dependentSchemas",
  "dependentRequired",
  // OpenAPI
  "nullable",
  "readOnly"
]);
function LN(e, t) {
  const n = e.$schema;
  return n === "https://json-schema.org/draft/2020-12/schema" ? "draft-2020-12" : n === "http://json-schema.org/draft-07/schema#" ? "draft-7" : n === "http://json-schema.org/draft-04/schema#" ? "draft-4" : t ?? "draft-2020-12";
}
function ZN(e, t) {
  if (!e.startsWith("#"))
    throw new Error("External $ref is not supported, only local refs (#/...) are allowed");
  const n = e.slice(1).split("/").filter(Boolean);
  if (n.length === 0)
    return t.rootSchema;
  const o = t.version === "draft-2020-12" ? "$defs" : "definitions";
  if (n[0] === o) {
    const r = n[1];
    if (!r || !t.defs[r])
      throw new Error(`Reference not found: ${e}`);
    return t.defs[r];
  }
  throw new Error(`Reference not found: ${e}`);
}
function Gb(e, t) {
  if (e.not !== void 0) {
    if (typeof e.not == "object" && Object.keys(e.not).length === 0)
      return U.never();
    throw new Error("not is not supported in Zod (except { not: {} } for never)");
  }
  if (e.unevaluatedItems !== void 0)
    throw new Error("unevaluatedItems is not supported");
  if (e.unevaluatedProperties !== void 0)
    throw new Error("unevaluatedProperties is not supported");
  if (e.if !== void 0 || e.then !== void 0 || e.else !== void 0)
    throw new Error("Conditional schemas (if/then/else) are not supported");
  if (e.dependentSchemas !== void 0 || e.dependentRequired !== void 0)
    throw new Error("dependentSchemas and dependentRequired are not supported");
  if (e.$ref) {
    const r = e.$ref;
    if (t.refs.has(r))
      return t.refs.get(r);
    if (t.processing.has(r))
      return U.lazy(() => {
        if (!t.refs.has(r))
          throw new Error(`Circular reference not resolved: ${r}`);
        return t.refs.get(r);
      });
    t.processing.add(r);
    const i = ZN(r, t), a = je(i, t);
    return t.refs.set(r, a), t.processing.delete(r), a;
  }
  if (e.enum !== void 0) {
    const r = e.enum;
    if (t.version === "openapi-3.0" && e.nullable === !0 && r.length === 1 && r[0] === null)
      return U.null();
    if (r.length === 0)
      return U.never();
    if (r.length === 1)
      return U.literal(r[0]);
    if (r.every((a) => typeof a == "string"))
      return U.enum(r);
    const i = r.map((a) => U.literal(a));
    return i.length < 2 ? i[0] : U.union([i[0], i[1], ...i.slice(2)]);
  }
  if (e.const !== void 0)
    return U.literal(e.const);
  const n = e.type;
  if (Array.isArray(n)) {
    const r = n.map((i) => {
      const a = { ...e, type: i };
      return Gb(a, t);
    });
    return r.length === 0 ? U.never() : r.length === 1 ? r[0] : U.union(r);
  }
  if (!n)
    return U.any();
  let o;
  switch (n) {
    case "string": {
      let r = U.string();
      if (e.format) {
        const i = e.format;
        i === "email" ? r = r.check(U.email()) : i === "uri" || i === "uri-reference" ? r = r.check(U.url()) : i === "uuid" || i === "guid" ? r = r.check(U.uuid()) : i === "date-time" ? r = r.check(U.iso.datetime()) : i === "date" ? r = r.check(U.iso.date()) : i === "time" ? r = r.check(U.iso.time()) : i === "duration" ? r = r.check(U.iso.duration()) : i === "ipv4" ? r = r.check(U.ipv4()) : i === "ipv6" ? r = r.check(U.ipv6()) : i === "mac" ? r = r.check(U.mac()) : i === "cidr" ? r = r.check(U.cidrv4()) : i === "cidr-v6" ? r = r.check(U.cidrv6()) : i === "base64" ? r = r.check(U.base64()) : i === "base64url" ? r = r.check(U.base64url()) : i === "e164" ? r = r.check(U.e164()) : i === "jwt" ? r = r.check(U.jwt()) : i === "emoji" ? r = r.check(U.emoji()) : i === "nanoid" ? r = r.check(U.nanoid()) : i === "cuid" ? r = r.check(U.cuid()) : i === "cuid2" ? r = r.check(U.cuid2()) : i === "ulid" ? r = r.check(U.ulid()) : i === "xid" ? r = r.check(U.xid()) : i === "ksuid" && (r = r.check(U.ksuid()));
      }
      typeof e.minLength == "number" && (r = r.min(e.minLength)), typeof e.maxLength == "number" && (r = r.max(e.maxLength)), e.pattern && (r = r.regex(new RegExp(e.pattern))), o = r;
      break;
    }
    case "number":
    case "integer": {
      let r = n === "integer" ? U.number().int() : U.number();
      typeof e.minimum == "number" && (r = r.min(e.minimum)), typeof e.maximum == "number" && (r = r.max(e.maximum)), typeof e.exclusiveMinimum == "number" ? r = r.gt(e.exclusiveMinimum) : e.exclusiveMinimum === !0 && typeof e.minimum == "number" && (r = r.gt(e.minimum)), typeof e.exclusiveMaximum == "number" ? r = r.lt(e.exclusiveMaximum) : e.exclusiveMaximum === !0 && typeof e.maximum == "number" && (r = r.lt(e.maximum)), typeof e.multipleOf == "number" && (r = r.multipleOf(e.multipleOf)), o = r;
      break;
    }
    case "boolean": {
      o = U.boolean();
      break;
    }
    case "null": {
      o = U.null();
      break;
    }
    case "object": {
      const r = {}, i = e.properties || {}, a = new Set(e.required || []);
      for (const [c, u] of Object.entries(i)) {
        const l = je(u, t);
        r[c] = a.has(c) ? l : l.optional();
      }
      if (e.propertyNames) {
        const c = je(e.propertyNames, t), u = e.additionalProperties && typeof e.additionalProperties == "object" ? je(e.additionalProperties, t) : U.any();
        if (Object.keys(r).length === 0) {
          o = U.record(c, u);
          break;
        }
        const l = U.object(r).passthrough(), d = U.looseRecord(c, u);
        o = U.intersection(l, d);
        break;
      }
      if (e.patternProperties) {
        const c = e.patternProperties, u = Object.keys(c), l = [];
        for (const f of u) {
          const h = je(c[f], t), g = U.string().regex(new RegExp(f));
          l.push(U.looseRecord(g, h));
        }
        const d = [];
        if (Object.keys(r).length > 0 && d.push(U.object(r).passthrough()), d.push(...l), d.length === 0)
          o = U.object({}).passthrough();
        else if (d.length === 1)
          o = d[0];
        else {
          let f = U.intersection(d[0], d[1]);
          for (let h = 2; h < d.length; h++)
            f = U.intersection(f, d[h]);
          o = f;
        }
        break;
      }
      const s = U.object(r);
      e.additionalProperties === !1 ? o = s.strict() : typeof e.additionalProperties == "object" ? o = s.catchall(je(e.additionalProperties, t)) : o = s.passthrough();
      break;
    }
    case "array": {
      const r = e.prefixItems, i = e.items;
      if (r && Array.isArray(r)) {
        const a = r.map((c) => je(c, t)), s = i && typeof i == "object" && !Array.isArray(i) ? je(i, t) : void 0;
        s ? o = U.tuple(a).rest(s) : o = U.tuple(a), typeof e.minItems == "number" && (o = o.check(U.minLength(e.minItems))), typeof e.maxItems == "number" && (o = o.check(U.maxLength(e.maxItems)));
      } else if (Array.isArray(i)) {
        const a = i.map((c) => je(c, t)), s = e.additionalItems && typeof e.additionalItems == "object" ? je(e.additionalItems, t) : void 0;
        s ? o = U.tuple(a).rest(s) : o = U.tuple(a), typeof e.minItems == "number" && (o = o.check(U.minLength(e.minItems))), typeof e.maxItems == "number" && (o = o.check(U.maxLength(e.maxItems)));
      } else if (i !== void 0) {
        const a = je(i, t);
        let s = U.array(a);
        typeof e.minItems == "number" && (s = s.min(e.minItems)), typeof e.maxItems == "number" && (s = s.max(e.maxItems)), o = s;
      } else
        o = U.array(U.any());
      break;
    }
    default:
      throw new Error(`Unsupported type: ${n}`);
  }
  return e.description && (o = o.describe(e.description)), e.default !== void 0 && (o = o.default(e.default)), o;
}
function je(e, t) {
  if (typeof e == "boolean")
    return e ? U.any() : U.never();
  let n = Gb(e, t);
  const o = e.type || e.enum !== void 0 || e.const !== void 0;
  if (e.anyOf && Array.isArray(e.anyOf)) {
    const s = e.anyOf.map((u) => je(u, t)), c = U.union(s);
    n = o ? U.intersection(n, c) : c;
  }
  if (e.oneOf && Array.isArray(e.oneOf)) {
    const s = e.oneOf.map((u) => je(u, t)), c = U.xor(s);
    n = o ? U.intersection(n, c) : c;
  }
  if (e.allOf && Array.isArray(e.allOf))
    if (e.allOf.length === 0)
      n = o ? n : U.any();
    else {
      let s = o ? n : je(e.allOf[0], t);
      const c = o ? 0 : 1;
      for (let u = c; u < e.allOf.length; u++)
        s = U.intersection(s, je(e.allOf[u], t));
      n = s;
    }
  e.nullable === !0 && t.version === "openapi-3.0" && (n = U.nullable(n)), e.readOnly === !0 && (n = U.readonly(n));
  const r = {}, i = ["$id", "id", "$comment", "$anchor", "$vocabulary", "$dynamicRef", "$dynamicAnchor"];
  for (const s of i)
    s in e && (r[s] = e[s]);
  const a = ["contentEncoding", "contentMediaType", "contentSchema"];
  for (const s of a)
    s in e && (r[s] = e[s]);
  for (const s of Object.keys(e))
    WN.has(s) || (r[s] = e[s]);
  return Object.keys(r).length > 0 && t.registry.add(n, r), n;
}
function Vb(e, t) {
  if (typeof e == "boolean")
    return e ? U.any() : U.never();
  const n = LN(e, t == null ? void 0 : t.defaultTarget), o = e.$defs || e.definitions || {}, r = {
    version: n,
    defs: o,
    refs: /* @__PURE__ */ new Map(),
    processing: /* @__PURE__ */ new Set(),
    rootSchema: e,
    registry: (t == null ? void 0 : t.registry) ?? ot
  };
  return je(e, r);
}
function YN(e) {
  return /* @__PURE__ */ gy(Tr, e);
}
function BN(e) {
  return /* @__PURE__ */ $y(Mr, e);
}
function HN(e) {
  return /* @__PURE__ */ Ny(zr, e);
}
function GN(e) {
  return /* @__PURE__ */ Py(Rr, e);
}
function VN(e) {
  return /* @__PURE__ */ Ly(ei, e);
}
const qb = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  bigint: GN,
  boolean: HN,
  date: VN,
  number: BN,
  string: YN
}, Symbol.toStringTag, { value: "Module" }));
Ue(ly());
const qm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  $brand: Pu,
  $input: il,
  $output: ol,
  NEVER: Eu,
  TimePrecision: Dl,
  ZodAny: ts,
  ZodArray: is,
  ZodBase64: Vo,
  ZodBase64URL: qo,
  ZodBigInt: Rr,
  ZodBigIntFormat: Xo,
  ZodBoolean: zr,
  ZodCIDRv4: Ho,
  ZodCIDRv6: Go,
  ZodCUID: jo,
  ZodCUID2: Fo,
  ZodCatch: Os,
  ZodCodec: si,
  ZodCustom: Wr,
  ZodCustomStringFormat: Yn,
  ZodDate: ei,
  ZodDefault: _s,
  ZodDiscriminatedUnion: ss,
  ZodE164: Jo,
  ZodEmail: Ro,
  ZodEmoji: Ao,
  ZodEnum: Un,
  ZodError: Zb,
  ZodExactOptional: ys,
  ZodFile: ps,
  get ZodFirstPartyTypeKind() {
    return ra;
  },
  ZodFunction: Rs,
  ZodGUID: pr,
  ZodIPv4: Yo,
  ZodIPv6: Bo,
  ZodISODate: Ba,
  ZodISODateTime: Ya,
  ZodISODuration: Ga,
  ZodISOTime: Ha,
  ZodIntersection: cs,
  ZodIssueCode: Yb,
  ZodJWT: Ko,
  ZodKSUID: Zo,
  ZodLazy: Cs,
  ZodLiteral: gs,
  ZodMAC: Va,
  ZodMap: ms,
  ZodNaN: Ns,
  ZodNanoID: Uo,
  ZodNever: rs,
  ZodNonOptional: ii,
  ZodNull: Qa,
  ZodNullable: ws,
  ZodNumber: Mr,
  ZodNumberFormat: _n,
  ZodObject: Ur,
  ZodOptional: oi,
  ZodPipe: ai,
  ZodPrefault: ks,
  ZodPromise: zs,
  ZodReadonly: Es,
  ZodRealError: Ke,
  ZodRecord: Fr,
  ZodSet: hs,
  ZodString: Tr,
  ZodStringFormat: we,
  ZodSuccess: Ds,
  ZodSymbol: Ka,
  ZodTemplateLiteral: Ts,
  ZodTransform: vs,
  ZodTuple: ls,
  ZodType: te,
  ZodULID: Wo,
  ZodURL: Cr,
  ZodUUID: yt,
  ZodUndefined: Xa,
  ZodUnion: jr,
  ZodUnknown: ns,
  ZodVoid: os,
  ZodXID: Lo,
  ZodXor: as,
  _ZodString: zo,
  _default: $s,
  _function: wr,
  any: Dd,
  array: Ar,
  base64: ud,
  base64url: ld,
  bigint: _d,
  boolean: Ja,
  catch: Is,
  check: Vd,
  cidrv4: sd,
  cidrv6: cd,
  clone: ct,
  codec: Bd,
  coerce: qb,
  config: Ue,
  core: Ab,
  cuid: Ql,
  cuid2: ed,
  custom: qd,
  date: Id,
  decode: Rl,
  decodeAsync: Ul,
  describe: Jd,
  discriminatedUnion: Md,
  e164: dd,
  email: Zl,
  emoji: Kl,
  encode: zl,
  encodeAsync: Al,
  endsWith: Oo,
  enum: ni,
  exactOptional: bs,
  file: Wd,
  flattenError: Ca,
  float32: vd,
  float64: yd,
  formatError: Ma,
  fromJSONSchema: Vb,
  function: wr,
  getErrorMap: Hb,
  globalRegistry: ot,
  gt: en,
  gte: He,
  guid: Yl,
  hash: pd,
  hex: gd,
  hostname: hd,
  httpUrl: Jl,
  includes: So,
  instanceof: Xd,
  int: ro,
  int32: bd,
  int64: $d,
  intersection: us,
  ipv4: od,
  ipv6: ad,
  iso: El,
  json: ef,
  jwt: fd,
  keyof: Nd,
  ksuid: rd,
  lazy: Ms,
  length: Pr,
  literal: Fd,
  locales: rl,
  looseObject: Td,
  looseRecord: Rd,
  lowercase: ko,
  lt: Qt,
  lte: it,
  mac: id,
  map: Ad,
  maxLength: Er,
  maxSize: Zn,
  meta: Kd,
  mime: Io,
  minLength: hn,
  minSize: tn,
  multipleOf: An,
  nan: Yd,
  nanoid: Xl,
  nativeEnum: jd,
  negative: Fa,
  never: Qo,
  nonnegative: La,
  nonoptional: Ss,
  nonpositive: Wa,
  normalize: No,
  null: es,
  nullable: yr,
  nullish: Ld,
  number: qa,
  object: Ed,
  optional: vr,
  overwrite: Lt,
  parse: Pl,
  parseAsync: Tl,
  partialRecord: zd,
  pipe: br,
  positive: ja,
  prefault: xs,
  preprocess: tf,
  prettifyError: Au,
  promise: Gd,
  property: Za,
  readonly: Ps,
  record: fs,
  refine: As,
  regex: $o,
  regexes: za,
  registry: Aa,
  safeDecode: Fl,
  safeDecodeAsync: Ll,
  safeEncode: jl,
  safeEncodeAsync: Wl,
  safeParse: Cl,
  safeParseAsync: Ml,
  set: Ud,
  setErrorMap: Bb,
  size: Nr,
  slugify: Co,
  startsWith: Do,
  strictObject: Pd,
  string: no,
  stringFormat: md,
  stringbool: Qd,
  success: Zd,
  superRefine: Us,
  symbol: xd,
  templateLiteral: Hd,
  toJSONSchema: Nl,
  toLowerCase: Po,
  toUpperCase: To,
  transform: ri,
  treeifyError: Ru,
  trim: Eo,
  tuple: ds,
  uint32: wd,
  uint64: kd,
  ulid: td,
  undefined: Sd,
  union: ti,
  unknown: gn,
  uppercase: xo,
  url: ql,
  util: Mu,
  uuid: Bl,
  uuidv4: Hl,
  uuidv6: Gl,
  uuidv7: Vl,
  void: Od,
  xid: nd,
  xor: Cd
}, Symbol.toStringTag, { value: "Module" })), KF = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  $brand: Pu,
  $input: il,
  $output: ol,
  NEVER: Eu,
  TimePrecision: Dl,
  ZodAny: ts,
  ZodArray: is,
  ZodBase64: Vo,
  ZodBase64URL: qo,
  ZodBigInt: Rr,
  ZodBigIntFormat: Xo,
  ZodBoolean: zr,
  ZodCIDRv4: Ho,
  ZodCIDRv6: Go,
  ZodCUID: jo,
  ZodCUID2: Fo,
  ZodCatch: Os,
  ZodCodec: si,
  ZodCustom: Wr,
  ZodCustomStringFormat: Yn,
  ZodDate: ei,
  ZodDefault: _s,
  ZodDiscriminatedUnion: ss,
  ZodE164: Jo,
  ZodEmail: Ro,
  ZodEmoji: Ao,
  ZodEnum: Un,
  ZodError: Zb,
  ZodExactOptional: ys,
  ZodFile: ps,
  get ZodFirstPartyTypeKind() {
    return ra;
  },
  ZodFunction: Rs,
  ZodGUID: pr,
  ZodIPv4: Yo,
  ZodIPv6: Bo,
  ZodISODate: Ba,
  ZodISODateTime: Ya,
  ZodISODuration: Ga,
  ZodISOTime: Ha,
  ZodIntersection: cs,
  ZodIssueCode: Yb,
  ZodJWT: Ko,
  ZodKSUID: Zo,
  ZodLazy: Cs,
  ZodLiteral: gs,
  ZodMAC: Va,
  ZodMap: ms,
  ZodNaN: Ns,
  ZodNanoID: Uo,
  ZodNever: rs,
  ZodNonOptional: ii,
  ZodNull: Qa,
  ZodNullable: ws,
  ZodNumber: Mr,
  ZodNumberFormat: _n,
  ZodObject: Ur,
  ZodOptional: oi,
  ZodPipe: ai,
  ZodPrefault: ks,
  ZodPromise: zs,
  ZodReadonly: Es,
  ZodRealError: Ke,
  ZodRecord: Fr,
  ZodSet: hs,
  ZodString: Tr,
  ZodStringFormat: we,
  ZodSuccess: Ds,
  ZodSymbol: Ka,
  ZodTemplateLiteral: Ts,
  ZodTransform: vs,
  ZodTuple: ls,
  ZodType: te,
  ZodULID: Wo,
  ZodURL: Cr,
  ZodUUID: yt,
  ZodUndefined: Xa,
  ZodUnion: jr,
  ZodUnknown: ns,
  ZodVoid: os,
  ZodXID: Lo,
  ZodXor: as,
  _ZodString: zo,
  _default: $s,
  _function: wr,
  any: Dd,
  array: Ar,
  base64: ud,
  base64url: ld,
  bigint: _d,
  boolean: Ja,
  catch: Is,
  check: Vd,
  cidrv4: sd,
  cidrv6: cd,
  clone: ct,
  codec: Bd,
  coerce: qb,
  config: Ue,
  core: Ab,
  cuid: Ql,
  cuid2: ed,
  custom: qd,
  date: Id,
  decode: Rl,
  decodeAsync: Ul,
  default: qm,
  describe: Jd,
  discriminatedUnion: Md,
  e164: dd,
  email: Zl,
  emoji: Kl,
  encode: zl,
  encodeAsync: Al,
  endsWith: Oo,
  enum: ni,
  exactOptional: bs,
  file: Wd,
  flattenError: Ca,
  float32: vd,
  float64: yd,
  formatError: Ma,
  fromJSONSchema: Vb,
  function: wr,
  getErrorMap: Hb,
  globalRegistry: ot,
  gt: en,
  gte: He,
  guid: Yl,
  hash: pd,
  hex: gd,
  hostname: hd,
  httpUrl: Jl,
  includes: So,
  instanceof: Xd,
  int: ro,
  int32: bd,
  int64: $d,
  intersection: us,
  ipv4: od,
  ipv6: ad,
  iso: El,
  json: ef,
  jwt: fd,
  keyof: Nd,
  ksuid: rd,
  lazy: Ms,
  length: Pr,
  literal: Fd,
  locales: rl,
  looseObject: Td,
  looseRecord: Rd,
  lowercase: ko,
  lt: Qt,
  lte: it,
  mac: id,
  map: Ad,
  maxLength: Er,
  maxSize: Zn,
  meta: Kd,
  mime: Io,
  minLength: hn,
  minSize: tn,
  multipleOf: An,
  nan: Yd,
  nanoid: Xl,
  nativeEnum: jd,
  negative: Fa,
  never: Qo,
  nonnegative: La,
  nonoptional: Ss,
  nonpositive: Wa,
  normalize: No,
  null: es,
  nullable: yr,
  nullish: Ld,
  number: qa,
  object: Ed,
  optional: vr,
  overwrite: Lt,
  parse: Pl,
  parseAsync: Tl,
  partialRecord: zd,
  pipe: br,
  positive: ja,
  prefault: xs,
  preprocess: tf,
  prettifyError: Au,
  promise: Gd,
  property: Za,
  readonly: Ps,
  record: fs,
  refine: As,
  regex: $o,
  regexes: za,
  registry: Aa,
  safeDecode: Fl,
  safeDecodeAsync: Ll,
  safeEncode: jl,
  safeEncodeAsync: Wl,
  safeParse: Cl,
  safeParseAsync: Ml,
  set: Ud,
  setErrorMap: Bb,
  size: Nr,
  slugify: Co,
  startsWith: Do,
  strictObject: Pd,
  string: no,
  stringFormat: md,
  stringbool: Qd,
  success: Zd,
  superRefine: Us,
  symbol: xd,
  templateLiteral: Hd,
  toJSONSchema: Nl,
  toLowerCase: Po,
  toUpperCase: To,
  transform: ri,
  treeifyError: Ru,
  trim: Eo,
  tuple: ds,
  uint32: wd,
  uint64: kd,
  ulid: td,
  undefined: Sd,
  union: ti,
  unknown: gn,
  uppercase: xo,
  url: ql,
  util: Mu,
  uuid: Bl,
  uuidv4: Hl,
  uuidv6: Gl,
  uuidv7: Vl,
  void: Od,
  xid: nd,
  xor: Cd,
  z: qm
}, Symbol.toStringTag, { value: "Module" }));
function Jm(e, t) {
  if (typeof e == "function")
    return e(t);
  e != null && (e.current = t);
}
function cn(...e) {
  return (t) => {
    let n = !1;
    const o = e.map((r) => {
      const i = Jm(r, t);
      return !n && typeof i == "function" && (n = !0), i;
    });
    if (n)
      return () => {
        for (let r = 0; r < o.length; r++) {
          const i = o[r];
          typeof i == "function" ? i() : Jm(e[r], null);
        }
      };
  };
}
function ye(...e) {
  return m.useCallback(cn(...e), e);
}
var qN = Symbol.for("react.lazy"), oa = m[" use ".trim().toString()];
function JN(e) {
  return typeof e == "object" && e !== null && "then" in e;
}
function Jb(e) {
  return e != null && typeof e == "object" && "$$typeof" in e && e.$$typeof === qN && "_payload" in e && JN(e._payload);
}
// @__NO_SIDE_EFFECTS__
function Kb(e) {
  const t = /* @__PURE__ */ KN(e), n = m.forwardRef((o, r) => {
    let { children: i, ...a } = o;
    Jb(i) && typeof oa == "function" && (i = oa(i._payload));
    const s = m.Children.toArray(i), c = s.find(QN);
    if (c) {
      const u = c.props.children, l = s.map((d) => d === c ? m.Children.count(u) > 1 ? m.Children.only(null) : m.isValidElement(u) ? u.props.children : null : d);
      return /* @__PURE__ */ y(t, { ...a, ref: r, children: m.isValidElement(u) ? m.cloneElement(u, void 0, l) : null });
    }
    return /* @__PURE__ */ y(t, { ...a, ref: r, children: i });
  });
  return n.displayName = `${e}.Slot`, n;
}
var Xb = /* @__PURE__ */ Kb("Slot");
// @__NO_SIDE_EFFECTS__
function KN(e) {
  const t = m.forwardRef((n, o) => {
    let { children: r, ...i } = n;
    if (Jb(r) && typeof oa == "function" && (r = oa(r._payload)), m.isValidElement(r)) {
      const a = tE(r), s = eE(i, r.props);
      return r.type !== m.Fragment && (s.ref = o ? cn(o, a) : a), m.cloneElement(r, s);
    }
    return m.Children.count(r) > 1 ? m.Children.only(null) : null;
  });
  return t.displayName = `${e}.SlotClone`, t;
}
var XN = Symbol("radix.slottable");
function QN(e) {
  return m.isValidElement(e) && typeof e.type == "function" && "__radixId" in e.type && e.type.__radixId === XN;
}
function eE(e, t) {
  const n = { ...t };
  for (const o in t) {
    const r = e[o], i = t[o];
    /^on[A-Z]/.test(o) ? r && i ? n[o] = (...s) => {
      const c = i(...s);
      return r(...s), c;
    } : r && (n[o] = r) : o === "style" ? n[o] = { ...r, ...i } : o === "className" && (n[o] = [r, i].filter(Boolean).join(" "));
  }
  return { ...e, ...n };
}
function tE(e) {
  var o, r;
  let t = (o = Object.getOwnPropertyDescriptor(e.props, "ref")) == null ? void 0 : o.get, n = t && "isReactWarning" in t && t.isReactWarning;
  return n ? e.ref : (t = (r = Object.getOwnPropertyDescriptor(e, "ref")) == null ? void 0 : r.get, n = t && "isReactWarning" in t && t.isReactWarning, n ? e.props.ref : e.props.ref || e.ref);
}
const Km = (e) => typeof e == "boolean" ? `${e}` : e === 0 ? "0" : e, Xm = Iu, js = (e, t) => (n) => {
  var o;
  if ((t == null ? void 0 : t.variants) == null)
    return Xm(e, n == null ? void 0 : n.class, n == null ? void 0 : n.className);
  const { variants: r, defaultVariants: i } = t, a = Object.keys(r).map((u) => {
    const l = n == null ? void 0 : n[u], d = i == null ? void 0 : i[u];
    if (l === null)
      return null;
    const f = Km(l) || Km(d);
    return r[u][f];
  }), s = n && Object.entries(n).reduce((u, l) => {
    let [d, f] = l;
    return f === void 0 || (u[d] = f), u;
  }, {}), c = t == null || (o = t.compoundVariants) === null || o === void 0 ? void 0 : o.reduce((u, l) => {
    let { class: d, className: f, ...h } = l;
    return Object.entries(h).every((g) => {
      let [p, v] = g;
      return Array.isArray(v) ? v.includes({
        ...i,
        ...s
      }[p]) : {
        ...i,
        ...s
      }[p] === v;
    }) ? [
      ...u,
      d,
      f
    ] : u;
  }, []);
  return Xm(e, a, c, n == null ? void 0 : n.class, n == null ? void 0 : n.className);
}, Qb = 7, ia = 365.2425, ci = 6048e5, ew = 864e5, nn = 6e4, Bn = 36e5, nf = 1e3, Qm = 525600, rr = 43200, aa = 1440, tw = 60, nw = 3, rw = 12, ow = 4, Fs = 3600, rf = 60, of = Fs * 24, nE = of * 7, iw = of * ia, aw = iw / 12, rE = aw * 3, eh = Symbol.for("constructDateFrom");
function L(e, t) {
  return typeof e == "function" ? e(t) : e && typeof e == "object" && eh in e ? e[eh](t) : e instanceof Date ? new e.constructor(t) : new Date(t);
}
function N(e, t) {
  return L(t || e, e);
}
function _t(e, t, n) {
  const o = N(e, n == null ? void 0 : n.in);
  return isNaN(t) ? L((n == null ? void 0 : n.in) || e, NaN) : (t && o.setDate(o.getDate() + t), o);
}
function Lr(e, t, n) {
  const o = N(e, n == null ? void 0 : n.in);
  if (isNaN(t))
    return L((n == null ? void 0 : n.in) || e, NaN);
  if (!t)
    return o;
  const r = o.getDate(), i = L((n == null ? void 0 : n.in) || e, o.getTime());
  i.setMonth(o.getMonth() + t + 1, 0);
  const a = i.getDate();
  return r >= a ? i : (o.setFullYear(
    i.getFullYear(),
    i.getMonth(),
    r
  ), o);
}
function nr(e, t, n) {
  const {
    years: o = 0,
    months: r = 0,
    weeks: i = 0,
    days: a = 0,
    hours: s = 0,
    minutes: c = 0,
    seconds: u = 0
  } = t, l = N(e, n == null ? void 0 : n.in), d = r || o ? Lr(l, r + o * 12) : l, f = a || i ? _t(d, a + i * 7) : d, h = c + s * 60, p = (u + h * 60) * 1e3;
  return L((n == null ? void 0 : n.in) || e, +f + p);
}
function sw(e, t) {
  return N(e, t == null ? void 0 : t.in).getDay() === 6;
}
function cw(e, t) {
  return N(e, t == null ? void 0 : t.in).getDay() === 0;
}
function or(e, t) {
  const n = N(e, t == null ? void 0 : t.in).getDay();
  return n === 0 || n === 6;
}
function uw(e, t, n) {
  const o = N(e, n == null ? void 0 : n.in), r = or(o, n);
  if (isNaN(t))
    return L(n == null ? void 0 : n.in, NaN);
  const i = o.getHours(), a = t < 0 ? -1 : 1, s = Math.trunc(t / 5);
  o.setDate(o.getDate() + s * 7);
  let c = Math.abs(t % 5);
  for (; c > 0; )
    o.setDate(o.getDate() + a), or(o, n) || (c -= 1);
  return r && or(o, n) && t !== 0 && (sw(o, n) && o.setDate(o.getDate() + (a < 0 ? 2 : -1)), cw(o, n) && o.setDate(o.getDate() + (a < 0 ? 1 : -2))), o.setHours(i), o;
}
function Ws(e, t, n) {
  return L((n == null ? void 0 : n.in) || e, +N(e) + t);
}
function lw(e, t, n) {
  return Ws(e, t * Bn, n);
}
let dw = {};
function Ve() {
  return dw;
}
function oE(e) {
  dw = e;
}
function Me(e, t) {
  var s, c, u, l;
  const n = Ve(), o = (t == null ? void 0 : t.weekStartsOn) ?? ((c = (s = t == null ? void 0 : t.locale) == null ? void 0 : s.options) == null ? void 0 : c.weekStartsOn) ?? n.weekStartsOn ?? ((l = (u = n.locale) == null ? void 0 : u.options) == null ? void 0 : l.weekStartsOn) ?? 0, r = N(e, t == null ? void 0 : t.in), i = r.getDay(), a = (i < o ? 7 : 0) + i - o;
  return r.setDate(r.getDate() - a), r.setHours(0, 0, 0, 0), r;
}
function ht(e, t) {
  return Me(e, { ...t, weekStartsOn: 1 });
}
function pn(e, t) {
  const n = N(e, t == null ? void 0 : t.in), o = n.getFullYear(), r = L(n, 0);
  r.setFullYear(o + 1, 0, 4), r.setHours(0, 0, 0, 0);
  const i = ht(r), a = L(n, 0);
  a.setFullYear(o, 0, 4), a.setHours(0, 0, 0, 0);
  const s = ht(a);
  return n.getTime() >= i.getTime() ? o + 1 : n.getTime() >= s.getTime() ? o : o - 1;
}
function Je(e) {
  const t = N(e), n = new Date(
    Date.UTC(
      t.getFullYear(),
      t.getMonth(),
      t.getDate(),
      t.getHours(),
      t.getMinutes(),
      t.getSeconds(),
      t.getMilliseconds()
    )
  );
  return n.setUTCFullYear(t.getFullYear()), +e - +n;
}
function _e(e, ...t) {
  const n = L.bind(
    null,
    e || t.find((o) => typeof o == "object")
  );
  return t.map(n);
}
function jn(e, t) {
  const n = N(e, t == null ? void 0 : t.in);
  return n.setHours(0, 0, 0, 0), n;
}
function dt(e, t, n) {
  const [o, r] = _e(
    n == null ? void 0 : n.in,
    e,
    t
  ), i = jn(o), a = jn(r), s = +i - Je(i), c = +a - Je(a);
  return Math.round((s - c) / ew);
}
function vn(e, t) {
  const n = pn(e, t), o = L((t == null ? void 0 : t.in) || e, 0);
  return o.setFullYear(n, 0, 4), o.setHours(0, 0, 0, 0), ht(o);
}
function fw(e, t, n) {
  let o = N(e, n == null ? void 0 : n.in);
  const r = dt(
    o,
    vn(o, n)
  ), i = L((n == null ? void 0 : n.in) || e, 0);
  return i.setFullYear(t, 0, 4), i.setHours(0, 0, 0, 0), o = vn(i), o.setDate(o.getDate() + r), o;
}
function mw(e, t, n) {
  return fw(e, pn(e, n) + t, n);
}
function af(e, t, n) {
  const o = N(e, n == null ? void 0 : n.in);
  return o.setTime(o.getTime() + t * nn), o;
}
function sf(e, t, n) {
  return Lr(e, t * 3, n);
}
function hw(e, t, n) {
  return Ws(e, t * 1e3, n);
}
function ui(e, t, n) {
  return _t(e, t * 7, n);
}
function cf(e, t, n) {
  return Lr(e, t * 12, n);
}
function iE(e, t, n) {
  const [o, r] = [
    +N(e.start, n == null ? void 0 : n.in),
    +N(e.end, n == null ? void 0 : n.in)
  ].sort((s, c) => s - c), [i, a] = [
    +N(t.start, n == null ? void 0 : n.in),
    +N(t.end, n == null ? void 0 : n.in)
  ].sort((s, c) => s - c);
  return n != null && n.inclusive ? o <= a && i <= r : o < a && i < r;
}
function uf(e, t) {
  let n, o = t == null ? void 0 : t.in;
  return e.forEach((r) => {
    !o && typeof r == "object" && (o = L.bind(null, r));
    const i = N(r, o);
    (!n || n < i || isNaN(+i)) && (n = i);
  }), L(o, n || NaN);
}
function lf(e, t) {
  let n, o = t == null ? void 0 : t.in;
  return e.forEach((r) => {
    !o && typeof r == "object" && (o = L.bind(null, r));
    const i = N(r, o);
    (!n || n > i || isNaN(+i)) && (n = i);
  }), L(o, n || NaN);
}
function aE(e, t, n) {
  const [o, r, i] = _e(
    n == null ? void 0 : n.in,
    e,
    t.start,
    t.end
  );
  return lf([uf([o, r], n), i], n);
}
function gw(e, t) {
  const n = +N(e);
  if (isNaN(n))
    return NaN;
  let o, r;
  return t.forEach((i, a) => {
    const s = N(i);
    if (isNaN(+s)) {
      o = NaN, r = NaN;
      return;
    }
    const c = Math.abs(n - +s);
    (o == null || c < r) && (o = a, r = c);
  }), o;
}
function sE(e, t, n) {
  const [o, ...r] = _e(
    n == null ? void 0 : n.in,
    e,
    ...t
  ), i = gw(o, r);
  if (typeof i == "number" && isNaN(i))
    return L(o, NaN);
  if (i !== void 0)
    return r[i];
}
function Ut(e, t) {
  const n = +N(e) - +N(t);
  return n < 0 ? -1 : n > 0 ? 1 : n;
}
function cE(e, t) {
  const n = +N(e) - +N(t);
  return n > 0 ? -1 : n < 0 ? 1 : n;
}
function Te(e) {
  return L(e, Date.now());
}
function uE(e) {
  const t = Math.trunc(e / Qb);
  return t === 0 ? 0 : t;
}
function Zr(e, t, n) {
  const [o, r] = _e(
    n == null ? void 0 : n.in,
    e,
    t
  );
  return +jn(o) == +jn(r);
}
function df(e) {
  return e instanceof Date || typeof e == "object" && Object.prototype.toString.call(e) === "[object Date]";
}
function rn(e) {
  return !(!df(e) && typeof e != "number" || isNaN(+N(e)));
}
function lE(e, t, n) {
  const [o, r] = _e(
    n == null ? void 0 : n.in,
    e,
    t
  );
  if (!rn(o) || !rn(r))
    return NaN;
  const i = dt(o, r), a = i < 0 ? -1 : 1, s = Math.trunc(i / 7);
  let c = s * 5, u = _t(r, s * 7);
  for (; !Zr(o, u); )
    c += or(u, n) ? 0 : a, u = _t(u, a);
  return c === 0 ? 0 : c;
}
function pw(e, t, n) {
  const [o, r] = _e(
    n == null ? void 0 : n.in,
    e,
    t
  );
  return pn(o, n) - pn(r, n);
}
function dE(e, t, n) {
  const [o, r] = _e(
    n == null ? void 0 : n.in,
    e,
    t
  ), i = ht(o), a = ht(r), s = +i - Je(i), c = +a - Je(a);
  return Math.round((s - c) / ci);
}
function _r(e, t, n) {
  const [o, r] = _e(
    n == null ? void 0 : n.in,
    e,
    t
  ), i = o.getFullYear() - r.getFullYear(), a = o.getMonth() - r.getMonth();
  return i * 12 + a;
}
function su(e, t) {
  const n = N(e, t == null ? void 0 : t.in);
  return Math.trunc(n.getMonth() / 3) + 1;
}
function Zi(e, t, n) {
  const [o, r] = _e(
    n == null ? void 0 : n.in,
    e,
    t
  ), i = o.getFullYear() - r.getFullYear(), a = su(o) - su(r);
  return i * 4 + a;
}
function sa(e, t, n) {
  const [o, r] = _e(
    n == null ? void 0 : n.in,
    e,
    t
  ), i = Me(o, n), a = Me(r, n), s = +i - Je(i), c = +a - Je(a);
  return Math.round((s - c) / ci);
}
function eo(e, t, n) {
  const [o, r] = _e(
    n == null ? void 0 : n.in,
    e,
    t
  );
  return o.getFullYear() - r.getFullYear();
}
function ff(e, t, n) {
  const [o, r] = _e(
    n == null ? void 0 : n.in,
    e,
    t
  ), i = th(o, r), a = Math.abs(
    dt(o, r)
  );
  o.setDate(o.getDate() - i * a);
  const s = +(th(o, r) === -i), c = i * (a - s);
  return c === 0 ? 0 : c;
}
function th(e, t) {
  const n = e.getFullYear() - t.getFullYear() || e.getMonth() - t.getMonth() || e.getDate() - t.getDate() || e.getHours() - t.getHours() || e.getMinutes() - t.getMinutes() || e.getSeconds() - t.getSeconds() || e.getMilliseconds() - t.getMilliseconds();
  return n < 0 ? -1 : n > 0 ? 1 : n;
}
function $n(e) {
  return (t) => {
    const o = (e ? Math[e] : Math.trunc)(t);
    return o === 0 ? 0 : o;
  };
}
function ca(e, t, n) {
  const [o, r] = _e(
    n == null ? void 0 : n.in,
    e,
    t
  ), i = (+o - +r) / Bn;
  return $n(n == null ? void 0 : n.roundingMethod)(i);
}
function vw(e, t, n) {
  return mw(e, -t, n);
}
function fE(e, t, n) {
  const [o, r] = _e(
    n == null ? void 0 : n.in,
    e,
    t
  ), i = Ut(o, r), a = Math.abs(
    pw(o, r, n)
  ), s = vw(o, i * a, n), c = +(Ut(s, r) === -i), u = i * (a - c);
  return u === 0 ? 0 : u;
}
function mf(e, t) {
  return +N(e) - +N(t);
}
function ua(e, t, n) {
  const o = mf(e, t) / nn;
  return $n(n == null ? void 0 : n.roundingMethod)(o);
}
function hf(e, t) {
  const n = N(e, t == null ? void 0 : t.in);
  return n.setHours(23, 59, 59, 999), n;
}
function Ls(e, t) {
  const n = N(e, t == null ? void 0 : t.in), o = n.getMonth();
  return n.setFullYear(n.getFullYear(), o + 1, 0), n.setHours(23, 59, 59, 999), n;
}
function yw(e, t) {
  const n = N(e, t == null ? void 0 : t.in);
  return +hf(n, t) == +Ls(n, t);
}
function Zs(e, t, n) {
  const [o, r, i] = _e(
    n == null ? void 0 : n.in,
    e,
    e,
    t
  ), a = Ut(r, i), s = Math.abs(
    _r(r, i)
  );
  if (s < 1)
    return 0;
  r.getMonth() === 1 && r.getDate() > 27 && r.setDate(30), r.setMonth(r.getMonth() - a * s);
  let c = Ut(r, i) === -a;
  yw(o) && s === 1 && Ut(o, i) === 1 && (c = !1);
  const u = a * (s - +c);
  return u === 0 ? 0 : u;
}
function mE(e, t, n) {
  const o = Zs(e, t, n) / 3;
  return $n(n == null ? void 0 : n.roundingMethod)(o);
}
function ir(e, t, n) {
  const o = mf(e, t) / 1e3;
  return $n(n == null ? void 0 : n.roundingMethod)(o);
}
function hE(e, t, n) {
  const o = ff(e, t, n) / 7;
  return $n(n == null ? void 0 : n.roundingMethod)(o);
}
function bw(e, t, n) {
  const [o, r] = _e(
    n == null ? void 0 : n.in,
    e,
    t
  ), i = Ut(o, r), a = Math.abs(eo(o, r));
  o.setFullYear(1584), r.setFullYear(1584);
  const s = Ut(o, r) === -i, c = i * (a - +s);
  return c === 0 ? 0 : c;
}
function un(e, t) {
  const [n, o] = _e(e, t.start, t.end);
  return { start: n, end: o };
}
function ww(e, t) {
  const { start: n, end: o } = un(t == null ? void 0 : t.in, e);
  let r = +n > +o;
  const i = r ? +n : +o, a = r ? o : n;
  a.setHours(0, 0, 0, 0);
  let s = (t == null ? void 0 : t.step) ?? 1;
  if (!s)
    return [];
  s < 0 && (s = -s, r = !r);
  const c = [];
  for (; +a <= i; )
    c.push(L(n, a)), a.setDate(a.getDate() + s), a.setHours(0, 0, 0, 0);
  return r ? c.reverse() : c;
}
function gE(e, t) {
  const { start: n, end: o } = un(t == null ? void 0 : t.in, e);
  let r = +n > +o;
  const i = r ? +n : +o, a = r ? o : n;
  a.setMinutes(0, 0, 0);
  let s = (t == null ? void 0 : t.step) ?? 1;
  if (!s)
    return [];
  s < 0 && (s = -s, r = !r);
  const c = [];
  for (; +a <= i; )
    c.push(L(n, a)), a.setHours(a.getHours() + s);
  return r ? c.reverse() : c;
}
function pE(e, t) {
  const { start: n, end: o } = un(t == null ? void 0 : t.in, e);
  n.setSeconds(0, 0);
  let r = +n > +o;
  const i = r ? +n : +o;
  let a = r ? o : n, s = (t == null ? void 0 : t.step) ?? 1;
  if (!s)
    return [];
  s < 0 && (s = -s, r = !r);
  const c = [];
  for (; +a <= i; )
    c.push(L(n, a)), a = af(a, s);
  return r ? c.reverse() : c;
}
function _w(e, t) {
  const { start: n, end: o } = un(t == null ? void 0 : t.in, e);
  let r = +n > +o;
  const i = r ? +n : +o, a = r ? o : n;
  a.setHours(0, 0, 0, 0), a.setDate(1);
  let s = (t == null ? void 0 : t.step) ?? 1;
  if (!s)
    return [];
  s < 0 && (s = -s, r = !r);
  const c = [];
  for (; +a <= i; )
    c.push(L(n, a)), a.setMonth(a.getMonth() + s);
  return r ? c.reverse() : c;
}
function Tn(e, t) {
  const n = N(e, t == null ? void 0 : t.in), o = n.getMonth(), r = o - o % 3;
  return n.setMonth(r, 1), n.setHours(0, 0, 0, 0), n;
}
function vE(e, t) {
  const { start: n, end: o } = un(t == null ? void 0 : t.in, e);
  let r = +n > +o;
  const i = r ? +Tn(n) : +Tn(o);
  let a = Tn(r ? o : n), s = (t == null ? void 0 : t.step) ?? 1;
  if (!s)
    return [];
  s < 0 && (s = -s, r = !r);
  const c = [];
  for (; +a <= i; )
    c.push(L(n, a)), a = sf(a, s);
  return r ? c.reverse() : c;
}
function yE(e, t) {
  const { start: n, end: o } = un(t == null ? void 0 : t.in, e);
  let r = +n > +o;
  const i = Me(r ? o : n, t), a = Me(r ? n : o, t);
  i.setHours(15), a.setHours(15);
  const s = +a.getTime();
  let c = i, u = (t == null ? void 0 : t.step) ?? 1;
  if (!u)
    return [];
  u < 0 && (u = -u, r = !r);
  const l = [];
  for (; +c <= s; )
    c.setHours(0), l.push(L(n, c)), c = ui(c, u), c.setHours(15);
  return r ? l.reverse() : l;
}
function gf(e, t) {
  const { start: n, end: o } = un(t == null ? void 0 : t.in, e), r = ww({ start: n, end: o }, t), i = [];
  let a = 0;
  for (; a < r.length; ) {
    const s = r[a++];
    or(s) && i.push(L(n, s));
  }
  return i;
}
function li(e, t) {
  const n = N(e, t == null ? void 0 : t.in);
  return n.setDate(1), n.setHours(0, 0, 0, 0), n;
}
function bE(e, t) {
  const n = li(e, t), o = Ls(e, t);
  return gf({ start: n, end: o }, t);
}
function pf(e, t) {
  const n = N(e, t == null ? void 0 : t.in), o = n.getFullYear();
  return n.setFullYear(o + 1, 0, 0), n.setHours(23, 59, 59, 999), n;
}
function Ys(e, t) {
  const n = N(e, t == null ? void 0 : t.in);
  return n.setFullYear(n.getFullYear(), 0, 1), n.setHours(0, 0, 0, 0), n;
}
function wE(e, t) {
  const n = Ys(e, t), o = pf(e, t);
  return gf({ start: n, end: o }, t);
}
function $w(e, t) {
  const { start: n, end: o } = un(t == null ? void 0 : t.in, e);
  let r = +n > +o;
  const i = r ? +n : +o, a = r ? o : n;
  a.setHours(0, 0, 0, 0), a.setMonth(0, 1);
  let s = (t == null ? void 0 : t.step) ?? 1;
  if (!s)
    return [];
  s < 0 && (s = -s, r = !r);
  const c = [];
  for (; +a <= i; )
    c.push(L(n, a)), a.setFullYear(a.getFullYear() + s);
  return r ? c.reverse() : c;
}
function _E(e, t) {
  const n = N(e, t == null ? void 0 : t.in), o = n.getFullYear(), r = 9 + Math.floor(o / 10) * 10;
  return n.setFullYear(r, 11, 31), n.setHours(23, 59, 59, 999), n;
}
function $E(e, t) {
  const n = N(e, t == null ? void 0 : t.in);
  return n.setMinutes(59, 59, 999), n;
}
function vf(e, t) {
  var s, c, u, l;
  const n = Ve(), o = (t == null ? void 0 : t.weekStartsOn) ?? ((c = (s = t == null ? void 0 : t.locale) == null ? void 0 : s.options) == null ? void 0 : c.weekStartsOn) ?? n.weekStartsOn ?? ((l = (u = n.locale) == null ? void 0 : u.options) == null ? void 0 : l.weekStartsOn) ?? 0, r = N(e, t == null ? void 0 : t.in), i = r.getDay(), a = (i < o ? -7 : 0) + 6 - (i - o);
  return r.setDate(r.getDate() + a), r.setHours(23, 59, 59, 999), r;
}
function kw(e, t) {
  return vf(e, { ...t, weekStartsOn: 1 });
}
function kE(e, t) {
  const n = pn(e, t), o = L((t == null ? void 0 : t.in) || e, 0);
  o.setFullYear(n + 1, 0, 4), o.setHours(0, 0, 0, 0);
  const r = ht(o, t);
  return r.setMilliseconds(r.getMilliseconds() - 1), r;
}
function xE(e, t) {
  const n = N(e, t == null ? void 0 : t.in);
  return n.setSeconds(59, 999), n;
}
function SE(e, t) {
  const n = N(e, t == null ? void 0 : t.in), o = n.getMonth(), r = o - o % 3 + 3;
  return n.setMonth(r, 0), n.setHours(23, 59, 59, 999), n;
}
function DE(e, t) {
  const n = N(e, t == null ? void 0 : t.in);
  return n.setMilliseconds(999), n;
}
function OE(e) {
  return hf(Date.now(), e);
}
function IE(e) {
  const t = Te(e == null ? void 0 : e.in), n = t.getFullYear(), o = t.getMonth(), r = t.getDate(), i = Te(e == null ? void 0 : e.in);
  return i.setFullYear(n, o, r + 1), i.setHours(23, 59, 59, 999), e != null && e.in ? e.in(i) : i;
}
function NE(e) {
  const t = Te(e == null ? void 0 : e.in), n = L(e == null ? void 0 : e.in, 0);
  return n.setFullYear(t.getFullYear(), t.getMonth(), t.getDate() - 1), n.setHours(23, 59, 59, 999), n;
}
const EE = {
  lessThanXSeconds: {
    one: "less than a second",
    other: "less than {{count}} seconds"
  },
  xSeconds: {
    one: "1 second",
    other: "{{count}} seconds"
  },
  halfAMinute: "half a minute",
  lessThanXMinutes: {
    one: "less than a minute",
    other: "less than {{count}} minutes"
  },
  xMinutes: {
    one: "1 minute",
    other: "{{count}} minutes"
  },
  aboutXHours: {
    one: "about 1 hour",
    other: "about {{count}} hours"
  },
  xHours: {
    one: "1 hour",
    other: "{{count}} hours"
  },
  xDays: {
    one: "1 day",
    other: "{{count}} days"
  },
  aboutXWeeks: {
    one: "about 1 week",
    other: "about {{count}} weeks"
  },
  xWeeks: {
    one: "1 week",
    other: "{{count}} weeks"
  },
  aboutXMonths: {
    one: "about 1 month",
    other: "about {{count}} months"
  },
  xMonths: {
    one: "1 month",
    other: "{{count}} months"
  },
  aboutXYears: {
    one: "about 1 year",
    other: "about {{count}} years"
  },
  xYears: {
    one: "1 year",
    other: "{{count}} years"
  },
  overXYears: {
    one: "over 1 year",
    other: "over {{count}} years"
  },
  almostXYears: {
    one: "almost 1 year",
    other: "almost {{count}} years"
  }
}, PE = (e, t, n) => {
  let o;
  const r = EE[e];
  return typeof r == "string" ? o = r : t === 1 ? o = r.one : o = r.other.replace("{{count}}", t.toString()), n != null && n.addSuffix ? n.comparison && n.comparison > 0 ? "in " + o : o + " ago" : o;
};
function ar(e) {
  return (t = {}) => {
    const n = t.width ? String(t.width) : e.defaultWidth;
    return e.formats[n] || e.formats[e.defaultWidth];
  };
}
const TE = {
  full: "EEEE, MMMM do, y",
  long: "MMMM do, y",
  medium: "MMM d, y",
  short: "MM/dd/yyyy"
}, CE = {
  full: "h:mm:ss a zzzz",
  long: "h:mm:ss a z",
  medium: "h:mm:ss a",
  short: "h:mm a"
}, ME = {
  full: "{{date}} 'at' {{time}}",
  long: "{{date}} 'at' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
}, zE = {
  date: ar({
    formats: TE,
    defaultWidth: "full"
  }),
  time: ar({
    formats: CE,
    defaultWidth: "full"
  }),
  dateTime: ar({
    formats: ME,
    defaultWidth: "full"
  })
}, RE = {
  lastWeek: "'last' eeee 'at' p",
  yesterday: "'yesterday at' p",
  today: "'today at' p",
  tomorrow: "'tomorrow at' p",
  nextWeek: "eeee 'at' p",
  other: "P"
}, AE = (e, t, n, o) => RE[e];
function Pt(e) {
  return (t, n) => {
    const o = n != null && n.context ? String(n.context) : "standalone";
    let r;
    if (o === "formatting" && e.formattingValues) {
      const a = e.defaultFormattingWidth || e.defaultWidth, s = n != null && n.width ? String(n.width) : a;
      r = e.formattingValues[s] || e.formattingValues[a];
    } else {
      const a = e.defaultWidth, s = n != null && n.width ? String(n.width) : e.defaultWidth;
      r = e.values[s] || e.values[a];
    }
    const i = e.argumentCallback ? e.argumentCallback(t) : t;
    return r[i];
  };
}
const UE = {
  narrow: ["B", "A"],
  abbreviated: ["BC", "AD"],
  wide: ["Before Christ", "Anno Domini"]
}, jE = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["Q1", "Q2", "Q3", "Q4"],
  wide: ["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"]
}, FE = {
  narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
  abbreviated: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ],
  wide: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ]
}, WE = {
  narrow: ["S", "M", "T", "W", "T", "F", "S"],
  short: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
  abbreviated: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  wide: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ]
}, LE = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "mi",
    noon: "n",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "midnight",
    noon: "noon",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night"
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "midnight",
    noon: "noon",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night"
  }
}, ZE = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "mi",
    noon: "n",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "midnight",
    noon: "noon",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night"
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "midnight",
    noon: "noon",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night"
  }
}, YE = (e, t) => {
  const n = Number(e), o = n % 100;
  if (o > 20 || o < 10)
    switch (o % 10) {
      case 1:
        return n + "st";
      case 2:
        return n + "nd";
      case 3:
        return n + "rd";
    }
  return n + "th";
}, BE = {
  ordinalNumber: YE,
  era: Pt({
    values: UE,
    defaultWidth: "wide"
  }),
  quarter: Pt({
    values: jE,
    defaultWidth: "wide",
    argumentCallback: (e) => e - 1
  }),
  month: Pt({
    values: FE,
    defaultWidth: "wide"
  }),
  day: Pt({
    values: WE,
    defaultWidth: "wide"
  }),
  dayPeriod: Pt({
    values: LE,
    defaultWidth: "wide",
    formattingValues: ZE,
    defaultFormattingWidth: "wide"
  })
};
function Tt(e) {
  return (t, n = {}) => {
    const o = n.width, r = o && e.matchPatterns[o] || e.matchPatterns[e.defaultMatchWidth], i = t.match(r);
    if (!i)
      return null;
    const a = i[0], s = o && e.parsePatterns[o] || e.parsePatterns[e.defaultParseWidth], c = Array.isArray(s) ? GE(s, (d) => d.test(a)) : (
      // [TODO] -- I challenge you to fix the type
      HE(s, (d) => d.test(a))
    );
    let u;
    u = e.valueCallback ? e.valueCallback(c) : c, u = n.valueCallback ? (
      // [TODO] -- I challenge you to fix the type
      n.valueCallback(u)
    ) : u;
    const l = t.slice(a.length);
    return { value: u, rest: l };
  };
}
function HE(e, t) {
  for (const n in e)
    if (Object.prototype.hasOwnProperty.call(e, n) && t(e[n]))
      return n;
}
function GE(e, t) {
  for (let n = 0; n < e.length; n++)
    if (t(e[n]))
      return n;
}
function xw(e) {
  return (t, n = {}) => {
    const o = t.match(e.matchPattern);
    if (!o)
      return null;
    const r = o[0], i = t.match(e.parsePattern);
    if (!i)
      return null;
    let a = e.valueCallback ? e.valueCallback(i[0]) : i[0];
    a = n.valueCallback ? n.valueCallback(a) : a;
    const s = t.slice(r.length);
    return { value: a, rest: s };
  };
}
const VE = /^(\d+)(th|st|nd|rd)?/i, qE = /\d+/i, JE = {
  narrow: /^(b|a)/i,
  abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
  wide: /^(before christ|before common era|anno domini|common era)/i
}, KE = {
  any: [/^b/i, /^(a|c)/i]
}, XE = {
  narrow: /^[1234]/i,
  abbreviated: /^q[1234]/i,
  wide: /^[1234](th|st|nd|rd)? quarter/i
}, QE = {
  any: [/1/i, /2/i, /3/i, /4/i]
}, eP = {
  narrow: /^[jfmasond]/i,
  abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
  wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
}, tP = {
  narrow: [
    /^j/i,
    /^f/i,
    /^m/i,
    /^a/i,
    /^m/i,
    /^j/i,
    /^j/i,
    /^a/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ],
  any: [
    /^ja/i,
    /^f/i,
    /^mar/i,
    /^ap/i,
    /^may/i,
    /^jun/i,
    /^jul/i,
    /^au/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ]
}, nP = {
  narrow: /^[smtwf]/i,
  short: /^(su|mo|tu|we|th|fr|sa)/i,
  abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
  wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
}, rP = {
  narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
  any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i]
}, oP = {
  narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
  any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
}, iP = {
  any: {
    am: /^a/i,
    pm: /^p/i,
    midnight: /^mi/i,
    noon: /^no/i,
    morning: /morning/i,
    afternoon: /afternoon/i,
    evening: /evening/i,
    night: /night/i
  }
}, aP = {
  ordinalNumber: xw({
    matchPattern: VE,
    parsePattern: qE,
    valueCallback: (e) => parseInt(e, 10)
  }),
  era: Tt({
    matchPatterns: JE,
    defaultMatchWidth: "wide",
    parsePatterns: KE,
    defaultParseWidth: "any"
  }),
  quarter: Tt({
    matchPatterns: XE,
    defaultMatchWidth: "wide",
    parsePatterns: QE,
    defaultParseWidth: "any",
    valueCallback: (e) => e + 1
  }),
  month: Tt({
    matchPatterns: eP,
    defaultMatchWidth: "wide",
    parsePatterns: tP,
    defaultParseWidth: "any"
  }),
  day: Tt({
    matchPatterns: nP,
    defaultMatchWidth: "wide",
    parsePatterns: rP,
    defaultParseWidth: "any"
  }),
  dayPeriod: Tt({
    matchPatterns: oP,
    defaultMatchWidth: "any",
    parsePatterns: iP,
    defaultParseWidth: "any"
  })
}, rt = {
  code: "en-US",
  formatDistance: PE,
  formatLong: zE,
  formatRelative: AE,
  localize: BE,
  match: aP,
  options: {
    weekStartsOn: 0,
    firstWeekContainsDate: 1
  }
};
function Sw(e, t) {
  const n = N(e, t == null ? void 0 : t.in);
  return dt(n, Ys(n)) + 1;
}
function di(e, t) {
  const n = N(e, t == null ? void 0 : t.in), o = +ht(n) - +vn(n);
  return Math.round(o / ci) + 1;
}
function Bs(e, t) {
  var l, d, f, h;
  const n = N(e, t == null ? void 0 : t.in), o = n.getFullYear(), r = Ve(), i = (t == null ? void 0 : t.firstWeekContainsDate) ?? ((d = (l = t == null ? void 0 : t.locale) == null ? void 0 : l.options) == null ? void 0 : d.firstWeekContainsDate) ?? r.firstWeekContainsDate ?? ((h = (f = r.locale) == null ? void 0 : f.options) == null ? void 0 : h.firstWeekContainsDate) ?? 1, a = L((t == null ? void 0 : t.in) || e, 0);
  a.setFullYear(o + 1, 0, i), a.setHours(0, 0, 0, 0);
  const s = Me(a, t), c = L((t == null ? void 0 : t.in) || e, 0);
  c.setFullYear(o, 0, i), c.setHours(0, 0, 0, 0);
  const u = Me(c, t);
  return +n >= +s ? o + 1 : +n >= +u ? o : o - 1;
}
function la(e, t) {
  var s, c, u, l;
  const n = Ve(), o = (t == null ? void 0 : t.firstWeekContainsDate) ?? ((c = (s = t == null ? void 0 : t.locale) == null ? void 0 : s.options) == null ? void 0 : c.firstWeekContainsDate) ?? n.firstWeekContainsDate ?? ((l = (u = n.locale) == null ? void 0 : u.options) == null ? void 0 : l.firstWeekContainsDate) ?? 1, r = Bs(e, t), i = L((t == null ? void 0 : t.in) || e, 0);
  return i.setFullYear(r, 0, o), i.setHours(0, 0, 0, 0), Me(i, t);
}
function fi(e, t) {
  const n = N(e, t == null ? void 0 : t.in), o = +Me(n, t) - +la(n, t);
  return Math.round(o / ci) + 1;
}
function G(e, t) {
  const n = e < 0 ? "-" : "", o = Math.abs(e).toString().padStart(t, "0");
  return n + o;
}
const Nt = {
  // Year
  y(e, t) {
    const n = e.getFullYear(), o = n > 0 ? n : 1 - n;
    return G(t === "yy" ? o % 100 : o, t.length);
  },
  // Month
  M(e, t) {
    const n = e.getMonth();
    return t === "M" ? String(n + 1) : G(n + 1, 2);
  },
  // Day of the month
  d(e, t) {
    return G(e.getDate(), t.length);
  },
  // AM or PM
  a(e, t) {
    const n = e.getHours() / 12 >= 1 ? "pm" : "am";
    switch (t) {
      case "a":
      case "aa":
        return n.toUpperCase();
      case "aaa":
        return n;
      case "aaaaa":
        return n[0];
      case "aaaa":
      default:
        return n === "am" ? "a.m." : "p.m.";
    }
  },
  // Hour [1-12]
  h(e, t) {
    return G(e.getHours() % 12 || 12, t.length);
  },
  // Hour [0-23]
  H(e, t) {
    return G(e.getHours(), t.length);
  },
  // Minute
  m(e, t) {
    return G(e.getMinutes(), t.length);
  },
  // Second
  s(e, t) {
    return G(e.getSeconds(), t.length);
  },
  // Fraction of second
  S(e, t) {
    const n = t.length, o = e.getMilliseconds(), r = Math.trunc(
      o * Math.pow(10, n - 3)
    );
    return G(r, t.length);
  }
}, Kn = {
  am: "am",
  pm: "pm",
  midnight: "midnight",
  noon: "noon",
  morning: "morning",
  afternoon: "afternoon",
  evening: "evening",
  night: "night"
}, cu = {
  // Era
  G: function(e, t, n) {
    const o = e.getFullYear() > 0 ? 1 : 0;
    switch (t) {
      case "G":
      case "GG":
      case "GGG":
        return n.era(o, { width: "abbreviated" });
      case "GGGGG":
        return n.era(o, { width: "narrow" });
      case "GGGG":
      default:
        return n.era(o, { width: "wide" });
    }
  },
  // Year
  y: function(e, t, n) {
    if (t === "yo") {
      const o = e.getFullYear(), r = o > 0 ? o : 1 - o;
      return n.ordinalNumber(r, { unit: "year" });
    }
    return Nt.y(e, t);
  },
  // Local week-numbering year
  Y: function(e, t, n, o) {
    const r = Bs(e, o), i = r > 0 ? r : 1 - r;
    if (t === "YY") {
      const a = i % 100;
      return G(a, 2);
    }
    return t === "Yo" ? n.ordinalNumber(i, { unit: "year" }) : G(i, t.length);
  },
  // ISO week-numbering year
  R: function(e, t) {
    const n = pn(e);
    return G(n, t.length);
  },
  // Extended year. This is a single number designating the year of this calendar system.
  // The main difference between `y` and `u` localizers are B.C. years:
  // | Year | `y` | `u` |
  // |------|-----|-----|
  // | AC 1 |   1 |   1 |
  // | BC 1 |   1 |   0 |
  // | BC 2 |   2 |  -1 |
  // Also `yy` always returns the last two digits of a year,
  // while `uu` pads single digit years to 2 characters and returns other years unchanged.
  u: function(e, t) {
    const n = e.getFullYear();
    return G(n, t.length);
  },
  // Quarter
  Q: function(e, t, n) {
    const o = Math.ceil((e.getMonth() + 1) / 3);
    switch (t) {
      case "Q":
        return String(o);
      case "QQ":
        return G(o, 2);
      case "Qo":
        return n.ordinalNumber(o, { unit: "quarter" });
      case "QQQ":
        return n.quarter(o, {
          width: "abbreviated",
          context: "formatting"
        });
      case "QQQQQ":
        return n.quarter(o, {
          width: "narrow",
          context: "formatting"
        });
      case "QQQQ":
      default:
        return n.quarter(o, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Stand-alone quarter
  q: function(e, t, n) {
    const o = Math.ceil((e.getMonth() + 1) / 3);
    switch (t) {
      case "q":
        return String(o);
      case "qq":
        return G(o, 2);
      case "qo":
        return n.ordinalNumber(o, { unit: "quarter" });
      case "qqq":
        return n.quarter(o, {
          width: "abbreviated",
          context: "standalone"
        });
      case "qqqqq":
        return n.quarter(o, {
          width: "narrow",
          context: "standalone"
        });
      case "qqqq":
      default:
        return n.quarter(o, {
          width: "wide",
          context: "standalone"
        });
    }
  },
  // Month
  M: function(e, t, n) {
    const o = e.getMonth();
    switch (t) {
      case "M":
      case "MM":
        return Nt.M(e, t);
      case "Mo":
        return n.ordinalNumber(o + 1, { unit: "month" });
      case "MMM":
        return n.month(o, {
          width: "abbreviated",
          context: "formatting"
        });
      case "MMMMM":
        return n.month(o, {
          width: "narrow",
          context: "formatting"
        });
      case "MMMM":
      default:
        return n.month(o, { width: "wide", context: "formatting" });
    }
  },
  // Stand-alone month
  L: function(e, t, n) {
    const o = e.getMonth();
    switch (t) {
      case "L":
        return String(o + 1);
      case "LL":
        return G(o + 1, 2);
      case "Lo":
        return n.ordinalNumber(o + 1, { unit: "month" });
      case "LLL":
        return n.month(o, {
          width: "abbreviated",
          context: "standalone"
        });
      case "LLLLL":
        return n.month(o, {
          width: "narrow",
          context: "standalone"
        });
      case "LLLL":
      default:
        return n.month(o, { width: "wide", context: "standalone" });
    }
  },
  // Local week of year
  w: function(e, t, n, o) {
    const r = fi(e, o);
    return t === "wo" ? n.ordinalNumber(r, { unit: "week" }) : G(r, t.length);
  },
  // ISO week of year
  I: function(e, t, n) {
    const o = di(e);
    return t === "Io" ? n.ordinalNumber(o, { unit: "week" }) : G(o, t.length);
  },
  // Day of the month
  d: function(e, t, n) {
    return t === "do" ? n.ordinalNumber(e.getDate(), { unit: "date" }) : Nt.d(e, t);
  },
  // Day of year
  D: function(e, t, n) {
    const o = Sw(e);
    return t === "Do" ? n.ordinalNumber(o, { unit: "dayOfYear" }) : G(o, t.length);
  },
  // Day of week
  E: function(e, t, n) {
    const o = e.getDay();
    switch (t) {
      case "E":
      case "EE":
      case "EEE":
        return n.day(o, {
          width: "abbreviated",
          context: "formatting"
        });
      case "EEEEE":
        return n.day(o, {
          width: "narrow",
          context: "formatting"
        });
      case "EEEEEE":
        return n.day(o, {
          width: "short",
          context: "formatting"
        });
      case "EEEE":
      default:
        return n.day(o, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Local day of week
  e: function(e, t, n, o) {
    const r = e.getDay(), i = (r - o.weekStartsOn + 8) % 7 || 7;
    switch (t) {
      case "e":
        return String(i);
      case "ee":
        return G(i, 2);
      case "eo":
        return n.ordinalNumber(i, { unit: "day" });
      case "eee":
        return n.day(r, {
          width: "abbreviated",
          context: "formatting"
        });
      case "eeeee":
        return n.day(r, {
          width: "narrow",
          context: "formatting"
        });
      case "eeeeee":
        return n.day(r, {
          width: "short",
          context: "formatting"
        });
      case "eeee":
      default:
        return n.day(r, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Stand-alone local day of week
  c: function(e, t, n, o) {
    const r = e.getDay(), i = (r - o.weekStartsOn + 8) % 7 || 7;
    switch (t) {
      case "c":
        return String(i);
      case "cc":
        return G(i, t.length);
      case "co":
        return n.ordinalNumber(i, { unit: "day" });
      case "ccc":
        return n.day(r, {
          width: "abbreviated",
          context: "standalone"
        });
      case "ccccc":
        return n.day(r, {
          width: "narrow",
          context: "standalone"
        });
      case "cccccc":
        return n.day(r, {
          width: "short",
          context: "standalone"
        });
      case "cccc":
      default:
        return n.day(r, {
          width: "wide",
          context: "standalone"
        });
    }
  },
  // ISO day of week
  i: function(e, t, n) {
    const o = e.getDay(), r = o === 0 ? 7 : o;
    switch (t) {
      case "i":
        return String(r);
      case "ii":
        return G(r, t.length);
      case "io":
        return n.ordinalNumber(r, { unit: "day" });
      case "iii":
        return n.day(o, {
          width: "abbreviated",
          context: "formatting"
        });
      case "iiiii":
        return n.day(o, {
          width: "narrow",
          context: "formatting"
        });
      case "iiiiii":
        return n.day(o, {
          width: "short",
          context: "formatting"
        });
      case "iiii":
      default:
        return n.day(o, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // AM or PM
  a: function(e, t, n) {
    const r = e.getHours() / 12 >= 1 ? "pm" : "am";
    switch (t) {
      case "a":
      case "aa":
        return n.dayPeriod(r, {
          width: "abbreviated",
          context: "formatting"
        });
      case "aaa":
        return n.dayPeriod(r, {
          width: "abbreviated",
          context: "formatting"
        }).toLowerCase();
      case "aaaaa":
        return n.dayPeriod(r, {
          width: "narrow",
          context: "formatting"
        });
      case "aaaa":
      default:
        return n.dayPeriod(r, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // AM, PM, midnight, noon
  b: function(e, t, n) {
    const o = e.getHours();
    let r;
    switch (o === 12 ? r = Kn.noon : o === 0 ? r = Kn.midnight : r = o / 12 >= 1 ? "pm" : "am", t) {
      case "b":
      case "bb":
        return n.dayPeriod(r, {
          width: "abbreviated",
          context: "formatting"
        });
      case "bbb":
        return n.dayPeriod(r, {
          width: "abbreviated",
          context: "formatting"
        }).toLowerCase();
      case "bbbbb":
        return n.dayPeriod(r, {
          width: "narrow",
          context: "formatting"
        });
      case "bbbb":
      default:
        return n.dayPeriod(r, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // in the morning, in the afternoon, in the evening, at night
  B: function(e, t, n) {
    const o = e.getHours();
    let r;
    switch (o >= 17 ? r = Kn.evening : o >= 12 ? r = Kn.afternoon : o >= 4 ? r = Kn.morning : r = Kn.night, t) {
      case "B":
      case "BB":
      case "BBB":
        return n.dayPeriod(r, {
          width: "abbreviated",
          context: "formatting"
        });
      case "BBBBB":
        return n.dayPeriod(r, {
          width: "narrow",
          context: "formatting"
        });
      case "BBBB":
      default:
        return n.dayPeriod(r, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Hour [1-12]
  h: function(e, t, n) {
    if (t === "ho") {
      let o = e.getHours() % 12;
      return o === 0 && (o = 12), n.ordinalNumber(o, { unit: "hour" });
    }
    return Nt.h(e, t);
  },
  // Hour [0-23]
  H: function(e, t, n) {
    return t === "Ho" ? n.ordinalNumber(e.getHours(), { unit: "hour" }) : Nt.H(e, t);
  },
  // Hour [0-11]
  K: function(e, t, n) {
    const o = e.getHours() % 12;
    return t === "Ko" ? n.ordinalNumber(o, { unit: "hour" }) : G(o, t.length);
  },
  // Hour [1-24]
  k: function(e, t, n) {
    let o = e.getHours();
    return o === 0 && (o = 24), t === "ko" ? n.ordinalNumber(o, { unit: "hour" }) : G(o, t.length);
  },
  // Minute
  m: function(e, t, n) {
    return t === "mo" ? n.ordinalNumber(e.getMinutes(), { unit: "minute" }) : Nt.m(e, t);
  },
  // Second
  s: function(e, t, n) {
    return t === "so" ? n.ordinalNumber(e.getSeconds(), { unit: "second" }) : Nt.s(e, t);
  },
  // Fraction of second
  S: function(e, t) {
    return Nt.S(e, t);
  },
  // Timezone (ISO-8601. If offset is 0, output is always `'Z'`)
  X: function(e, t, n) {
    const o = e.getTimezoneOffset();
    if (o === 0)
      return "Z";
    switch (t) {
      case "X":
        return rh(o);
      case "XXXX":
      case "XX":
        return Nn(o);
      case "XXXXX":
      case "XXX":
      default:
        return Nn(o, ":");
    }
  },
  // Timezone (ISO-8601. If offset is 0, output is `'+00:00'` or equivalent)
  x: function(e, t, n) {
    const o = e.getTimezoneOffset();
    switch (t) {
      case "x":
        return rh(o);
      case "xxxx":
      case "xx":
        return Nn(o);
      case "xxxxx":
      case "xxx":
      default:
        return Nn(o, ":");
    }
  },
  // Timezone (GMT)
  O: function(e, t, n) {
    const o = e.getTimezoneOffset();
    switch (t) {
      case "O":
      case "OO":
      case "OOO":
        return "GMT" + nh(o, ":");
      case "OOOO":
      default:
        return "GMT" + Nn(o, ":");
    }
  },
  // Timezone (specific non-location)
  z: function(e, t, n) {
    const o = e.getTimezoneOffset();
    switch (t) {
      case "z":
      case "zz":
      case "zzz":
        return "GMT" + nh(o, ":");
      case "zzzz":
      default:
        return "GMT" + Nn(o, ":");
    }
  },
  // Seconds timestamp
  t: function(e, t, n) {
    const o = Math.trunc(+e / 1e3);
    return G(o, t.length);
  },
  // Milliseconds timestamp
  T: function(e, t, n) {
    return G(+e, t.length);
  }
};
function nh(e, t = "") {
  const n = e > 0 ? "-" : "+", o = Math.abs(e), r = Math.trunc(o / 60), i = o % 60;
  return i === 0 ? n + String(r) : n + String(r) + t + G(i, 2);
}
function rh(e, t) {
  return e % 60 === 0 ? (e > 0 ? "-" : "+") + G(Math.abs(e) / 60, 2) : Nn(e, t);
}
function Nn(e, t = "") {
  const n = e > 0 ? "-" : "+", o = Math.abs(e), r = G(Math.trunc(o / 60), 2), i = G(o % 60, 2);
  return n + r + t + i;
}
const oh = (e, t) => {
  switch (e) {
    case "P":
      return t.date({ width: "short" });
    case "PP":
      return t.date({ width: "medium" });
    case "PPP":
      return t.date({ width: "long" });
    case "PPPP":
    default:
      return t.date({ width: "full" });
  }
}, Dw = (e, t) => {
  switch (e) {
    case "p":
      return t.time({ width: "short" });
    case "pp":
      return t.time({ width: "medium" });
    case "ppp":
      return t.time({ width: "long" });
    case "pppp":
    default:
      return t.time({ width: "full" });
  }
}, sP = (e, t) => {
  const n = e.match(/(P+)(p+)?/) || [], o = n[1], r = n[2];
  if (!r)
    return oh(e, t);
  let i;
  switch (o) {
    case "P":
      i = t.dateTime({ width: "short" });
      break;
    case "PP":
      i = t.dateTime({ width: "medium" });
      break;
    case "PPP":
      i = t.dateTime({ width: "long" });
      break;
    case "PPPP":
    default:
      i = t.dateTime({ width: "full" });
      break;
  }
  return i.replace("{{date}}", oh(o, t)).replace("{{time}}", Dw(r, t));
}, da = {
  p: Dw,
  P: sP
}, cP = /^D+$/, uP = /^Y+$/, lP = ["D", "DD", "YY", "YYYY"];
function Ow(e) {
  return cP.test(e);
}
function Iw(e) {
  return uP.test(e);
}
function uu(e, t, n) {
  const o = dP(e, t, n);
  if (console.warn(o), lP.includes(e))
    throw new RangeError(o);
}
function dP(e, t, n) {
  const o = e[0] === "Y" ? "years" : "days of the month";
  return `Use \`${e.toLowerCase()}\` instead of \`${e}\` (in \`${t}\`) for formatting ${o} to the input \`${n}\`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md`;
}
const fP = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g, mP = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g, hP = /^'([^]*?)'?$/, gP = /''/g, pP = /[a-zA-Z]/;
function Vt(e, t, n) {
  var l, d, f, h, g, p, v, b;
  const o = Ve(), r = (n == null ? void 0 : n.locale) ?? o.locale ?? rt, i = (n == null ? void 0 : n.firstWeekContainsDate) ?? ((d = (l = n == null ? void 0 : n.locale) == null ? void 0 : l.options) == null ? void 0 : d.firstWeekContainsDate) ?? o.firstWeekContainsDate ?? ((h = (f = o.locale) == null ? void 0 : f.options) == null ? void 0 : h.firstWeekContainsDate) ?? 1, a = (n == null ? void 0 : n.weekStartsOn) ?? ((p = (g = n == null ? void 0 : n.locale) == null ? void 0 : g.options) == null ? void 0 : p.weekStartsOn) ?? o.weekStartsOn ?? ((b = (v = o.locale) == null ? void 0 : v.options) == null ? void 0 : b.weekStartsOn) ?? 0, s = N(e, n == null ? void 0 : n.in);
  if (!rn(s))
    throw new RangeError("Invalid time value");
  let c = t.match(mP).map((_) => {
    const $ = _[0];
    if ($ === "p" || $ === "P") {
      const x = da[$];
      return x(_, r.formatLong);
    }
    return _;
  }).join("").match(fP).map((_) => {
    if (_ === "''")
      return { isToken: !1, value: "'" };
    const $ = _[0];
    if ($ === "'")
      return { isToken: !1, value: vP(_) };
    if (cu[$])
      return { isToken: !0, value: _ };
    if ($.match(pP))
      throw new RangeError(
        "Format string contains an unescaped latin alphabet character `" + $ + "`"
      );
    return { isToken: !1, value: _ };
  });
  r.localize.preprocessor && (c = r.localize.preprocessor(s, c));
  const u = {
    firstWeekContainsDate: i,
    weekStartsOn: a,
    locale: r
  };
  return c.map((_) => {
    if (!_.isToken)
      return _.value;
    const $ = _.value;
    (!(n != null && n.useAdditionalWeekYearTokens) && Iw($) || !(n != null && n.useAdditionalDayOfYearTokens) && Ow($)) && uu($, t, String(e));
    const x = cu[$[0]];
    return x(s, $, r.localize, u);
  }).join("");
}
function vP(e) {
  const t = e.match(hP);
  return t ? t[1].replace(gP, "'") : e;
}
function Nw(e, t, n) {
  const o = Ve(), r = (n == null ? void 0 : n.locale) ?? o.locale ?? rt, i = 2520, a = Ut(e, t);
  if (isNaN(a))
    throw new RangeError("Invalid time value");
  const s = Object.assign({}, n, {
    addSuffix: n == null ? void 0 : n.addSuffix,
    comparison: a
  }), [c, u] = _e(
    n == null ? void 0 : n.in,
    ...a > 0 ? [t, e] : [e, t]
  ), l = ir(u, c), d = (Je(u) - Je(c)) / 1e3, f = Math.round((l - d) / 60);
  let h;
  if (f < 2)
    return n != null && n.includeSeconds ? l < 5 ? r.formatDistance("lessThanXSeconds", 5, s) : l < 10 ? r.formatDistance("lessThanXSeconds", 10, s) : l < 20 ? r.formatDistance("lessThanXSeconds", 20, s) : l < 40 ? r.formatDistance("halfAMinute", 0, s) : l < 60 ? r.formatDistance("lessThanXMinutes", 1, s) : r.formatDistance("xMinutes", 1, s) : f === 0 ? r.formatDistance("lessThanXMinutes", 1, s) : r.formatDistance("xMinutes", f, s);
  if (f < 45)
    return r.formatDistance("xMinutes", f, s);
  if (f < 90)
    return r.formatDistance("aboutXHours", 1, s);
  if (f < aa) {
    const g = Math.round(f / 60);
    return r.formatDistance("aboutXHours", g, s);
  } else {
    if (f < i)
      return r.formatDistance("xDays", 1, s);
    if (f < rr) {
      const g = Math.round(f / aa);
      return r.formatDistance("xDays", g, s);
    } else if (f < rr * 2)
      return h = Math.round(f / rr), r.formatDistance("aboutXMonths", h, s);
  }
  if (h = Zs(u, c), h < 12) {
    const g = Math.round(f / rr);
    return r.formatDistance("xMonths", g, s);
  } else {
    const g = h % 12, p = Math.trunc(h / 12);
    return g < 3 ? r.formatDistance("aboutXYears", p, s) : g < 9 ? r.formatDistance("overXYears", p, s) : r.formatDistance("almostXYears", p + 1, s);
  }
}
function Ew(e, t, n) {
  const o = Ve(), r = (n == null ? void 0 : n.locale) ?? o.locale ?? rt, i = Ut(e, t);
  if (isNaN(i))
    throw new RangeError("Invalid time value");
  const a = Object.assign({}, n, {
    addSuffix: n == null ? void 0 : n.addSuffix,
    comparison: i
  }), [s, c] = _e(
    n == null ? void 0 : n.in,
    ...i > 0 ? [t, e] : [e, t]
  ), u = $n((n == null ? void 0 : n.roundingMethod) ?? "round"), l = c.getTime() - s.getTime(), d = l / nn, f = Je(c) - Je(s), h = (l - f) / nn, g = n == null ? void 0 : n.unit;
  let p;
  if (g ? p = g : d < 1 ? p = "second" : d < 60 ? p = "minute" : d < aa ? p = "hour" : h < rr ? p = "day" : h < Qm ? p = "month" : p = "year", p === "second") {
    const v = u(l / 1e3);
    return r.formatDistance("xSeconds", v, a);
  } else if (p === "minute") {
    const v = u(d);
    return r.formatDistance("xMinutes", v, a);
  } else if (p === "hour") {
    const v = u(d / 60);
    return r.formatDistance("xHours", v, a);
  } else if (p === "day") {
    const v = u(h / aa);
    return r.formatDistance("xDays", v, a);
  } else if (p === "month") {
    const v = u(h / rr);
    return v === 12 && g !== "month" ? r.formatDistance("xYears", 1, a) : r.formatDistance("xMonths", v, a);
  } else {
    const v = u(h / Qm);
    return r.formatDistance("xYears", v, a);
  }
}
function yP(e, t) {
  return Nw(e, Te(e), t);
}
function bP(e, t) {
  return Ew(e, Te(e), t);
}
const wP = [
  "years",
  "months",
  "weeks",
  "days",
  "hours",
  "minutes",
  "seconds"
];
function _P(e, t) {
  const n = Ve(), o = (t == null ? void 0 : t.locale) ?? n.locale ?? rt, r = (t == null ? void 0 : t.format) ?? wP, i = (t == null ? void 0 : t.zero) ?? !1, a = (t == null ? void 0 : t.delimiter) ?? " ";
  return o.formatDistance ? r.reduce((c, u) => {
    const l = `x${u.replace(/(^.)/, (f) => f.toUpperCase())}`, d = e[u];
    return d !== void 0 && (i || e[u]) ? c.concat(o.formatDistance(l, d)) : c;
  }, []).join(a) : "";
}
function $P(e, t) {
  const n = N(e, t == null ? void 0 : t.in);
  if (isNaN(+n))
    throw new RangeError("Invalid time value");
  const o = (t == null ? void 0 : t.format) ?? "extended", r = (t == null ? void 0 : t.representation) ?? "complete";
  let i = "", a = "";
  const s = o === "extended" ? "-" : "", c = o === "extended" ? ":" : "";
  if (r !== "time") {
    const u = G(n.getDate(), 2), l = G(n.getMonth() + 1, 2);
    i = `${G(n.getFullYear(), 4)}${s}${l}${s}${u}`;
  }
  if (r !== "date") {
    const u = n.getTimezoneOffset();
    if (u !== 0) {
      const p = Math.abs(u), v = G(Math.trunc(p / 60), 2), b = G(p % 60, 2);
      a = `${u < 0 ? "+" : "-"}${v}:${b}`;
    } else
      a = "Z";
    const l = G(n.getHours(), 2), d = G(n.getMinutes(), 2), f = G(n.getSeconds(), 2), h = i === "" ? "" : "T", g = [l, d, f].join(c);
    i = `${i}${h}${g}${a}`;
  }
  return i;
}
function kP(e, t) {
  const n = N(e, t == null ? void 0 : t.in);
  if (!rn(n))
    throw new RangeError("Invalid time value");
  const o = (t == null ? void 0 : t.format) ?? "extended", r = (t == null ? void 0 : t.representation) ?? "complete";
  let i = "";
  const a = o === "extended" ? "-" : "", s = o === "extended" ? ":" : "";
  if (r !== "time") {
    const c = G(n.getDate(), 2), u = G(n.getMonth() + 1, 2);
    i = `${G(n.getFullYear(), 4)}${a}${u}${a}${c}`;
  }
  if (r !== "date") {
    const c = G(n.getHours(), 2), u = G(n.getMinutes(), 2), l = G(n.getSeconds(), 2);
    i = `${i}${i === "" ? "" : " "}${c}${s}${u}${s}${l}`;
  }
  return i;
}
function xP(e) {
  const {
    years: t = 0,
    months: n = 0,
    days: o = 0,
    hours: r = 0,
    minutes: i = 0,
    seconds: a = 0
  } = e;
  return `P${t}Y${n}M${o}DT${r}H${i}M${a}S`;
}
function SP(e, t) {
  const n = N(e, t == null ? void 0 : t.in);
  if (!rn(n))
    throw new RangeError("Invalid time value");
  const o = (t == null ? void 0 : t.fractionDigits) ?? 0, r = G(n.getDate(), 2), i = G(n.getMonth() + 1, 2), a = n.getFullYear(), s = G(n.getHours(), 2), c = G(n.getMinutes(), 2), u = G(n.getSeconds(), 2);
  let l = "";
  if (o > 0) {
    const h = n.getMilliseconds(), g = Math.trunc(
      h * Math.pow(10, o - 3)
    );
    l = "." + G(g, o);
  }
  let d = "";
  const f = n.getTimezoneOffset();
  if (f !== 0) {
    const h = Math.abs(f), g = G(Math.trunc(h / 60), 2), p = G(h % 60, 2);
    d = `${f < 0 ? "+" : "-"}${g}:${p}`;
  } else
    d = "Z";
  return `${a}-${i}-${r}T${s}:${c}:${u}${l}${d}`;
}
const DP = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], OP = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];
function IP(e) {
  const t = N(e);
  if (!rn(t))
    throw new RangeError("Invalid time value");
  const n = DP[t.getUTCDay()], o = G(t.getUTCDate(), 2), r = OP[t.getUTCMonth()], i = t.getUTCFullYear(), a = G(t.getUTCHours(), 2), s = G(t.getUTCMinutes(), 2), c = G(t.getUTCSeconds(), 2);
  return `${n}, ${o} ${r} ${i} ${a}:${s}:${c} GMT`;
}
function NP(e, t, n) {
  var d, f, h, g;
  const [o, r] = _e(n == null ? void 0 : n.in, e, t), i = Ve(), a = (n == null ? void 0 : n.locale) ?? i.locale ?? rt, s = (n == null ? void 0 : n.weekStartsOn) ?? ((f = (d = n == null ? void 0 : n.locale) == null ? void 0 : d.options) == null ? void 0 : f.weekStartsOn) ?? i.weekStartsOn ?? ((g = (h = i.locale) == null ? void 0 : h.options) == null ? void 0 : g.weekStartsOn) ?? 0, c = dt(o, r);
  if (isNaN(c))
    throw new RangeError("Invalid time value");
  let u;
  c < -6 ? u = "other" : c < -1 ? u = "lastWeek" : c < 0 ? u = "yesterday" : c < 1 ? u = "today" : c < 2 ? u = "tomorrow" : c < 7 ? u = "nextWeek" : u = "other";
  const l = a.formatRelative(u, o, r, {
    locale: a,
    weekStartsOn: s
  });
  return Vt(o, l, { locale: a, weekStartsOn: s });
}
function EP(e, t) {
  return N(e * 1e3, t == null ? void 0 : t.in);
}
function Pw(e, t) {
  return N(e, t == null ? void 0 : t.in).getDate();
}
function Hs(e, t) {
  return N(e, t == null ? void 0 : t.in).getDay();
}
function Tw(e, t) {
  const n = N(e, t == null ? void 0 : t.in), o = n.getFullYear(), r = n.getMonth(), i = L(n, 0);
  return i.setFullYear(o, r + 1, 0), i.setHours(0, 0, 0, 0), i.getDate();
}
function Cw(e, t) {
  const o = N(e, t == null ? void 0 : t.in).getFullYear();
  return o % 400 === 0 || o % 4 === 0 && o % 100 !== 0;
}
function PP(e, t) {
  const n = N(e, t == null ? void 0 : t.in);
  return Number.isNaN(+n) ? NaN : Cw(n) ? 366 : 365;
}
function TP(e, t) {
  const o = N(e, t == null ? void 0 : t.in).getFullYear();
  return Math.floor(o / 10) * 10;
}
function Mw() {
  return Object.assign({}, Ve());
}
function CP(e, t) {
  return N(e, t == null ? void 0 : t.in).getHours();
}
function zw(e, t) {
  const n = N(e, t == null ? void 0 : t.in).getDay();
  return n === 0 ? 7 : n;
}
function MP(e, t) {
  const n = vn(e, t), r = +vn(ui(n, 60)) - +n;
  return Math.round(r / ci);
}
function zP(e) {
  return N(e).getMilliseconds();
}
function RP(e, t) {
  return N(e, t == null ? void 0 : t.in).getMinutes();
}
function Rw(e, t) {
  return N(e, t == null ? void 0 : t.in).getMonth();
}
function AP(e, t) {
  const [n, o] = [
    +N(e.start),
    +N(e.end)
  ].sort((d, f) => d - f), [r, i] = [
    +N(t.start),
    +N(t.end)
  ].sort((d, f) => d - f);
  if (!(n < i && r < o))
    return 0;
  const s = r < n ? n : r, c = s - Je(s), u = i > o ? o : i, l = u - Je(u);
  return Math.ceil((l - c) / ew);
}
function UP(e) {
  return N(e).getSeconds();
}
function jP(e) {
  return +N(e);
}
function FP(e) {
  return Math.trunc(+N(e) / 1e3);
}
function WP(e, t) {
  var c, u, l, d;
  const n = Ve(), o = (t == null ? void 0 : t.weekStartsOn) ?? ((u = (c = t == null ? void 0 : t.locale) == null ? void 0 : c.options) == null ? void 0 : u.weekStartsOn) ?? n.weekStartsOn ?? ((d = (l = n.locale) == null ? void 0 : l.options) == null ? void 0 : d.weekStartsOn) ?? 0, r = Pw(N(e, t == null ? void 0 : t.in));
  if (isNaN(r))
    return NaN;
  const i = Hs(li(e, t));
  let a = o - i;
  a <= 0 && (a += 7);
  const s = r - a;
  return Math.ceil(s / 7) + 1;
}
function Aw(e, t) {
  const n = N(e, t == null ? void 0 : t.in), o = n.getMonth();
  return n.setFullYear(n.getFullYear(), o + 1, 0), n.setHours(0, 0, 0, 0), N(n, t == null ? void 0 : t.in);
}
function LP(e, t) {
  const n = N(e, t == null ? void 0 : t.in);
  return sa(
    Aw(n, t),
    li(n, t),
    t
  ) + 1;
}
function Uw(e, t) {
  return N(e, t == null ? void 0 : t.in).getFullYear();
}
function ZP(e) {
  return Math.trunc(e * Bn);
}
function YP(e) {
  return Math.trunc(e * tw);
}
function BP(e) {
  return Math.trunc(e * Fs);
}
function HP(e, t, n) {
  const [o, r] = _e(n == null ? void 0 : n.in, e, t);
  if (isNaN(+o))
    throw new TypeError("Start date is invalid");
  if (isNaN(+r))
    throw new TypeError("End date is invalid");
  if (n != null && n.assertPositive && +o > +r)
    throw new TypeError("End date must be after start date");
  return { start: o, end: r };
}
function GP(e, t) {
  const { start: n, end: o } = un(t == null ? void 0 : t.in, e), r = {}, i = bw(o, n);
  i && (r.years = i);
  const a = nr(n, { years: r.years }), s = Zs(o, a);
  s && (r.months = s);
  const c = nr(a, { months: r.months }), u = ff(o, c);
  u && (r.days = u);
  const l = nr(c, { days: r.days }), d = ca(o, l);
  d && (r.hours = d);
  const f = nr(l, { hours: r.hours }), h = ua(o, f);
  h && (r.minutes = h);
  const g = nr(f, { minutes: r.minutes }), p = ir(o, g);
  return p && (r.seconds = p), r;
}
function VP(e, t, n) {
  let o;
  return qP(t) ? o = t : n = t, new Intl.DateTimeFormat(n == null ? void 0 : n.locale, o).format(
    N(e)
  );
}
function qP(e) {
  return e !== void 0 && !("locale" in e);
}
function JP(e, t, n) {
  let o = 0, r;
  const [i, a] = _e(
    n == null ? void 0 : n.in,
    e,
    t
  );
  if (n != null && n.unit)
    r = n == null ? void 0 : n.unit, r === "second" ? o = ir(i, a) : r === "minute" ? o = ua(i, a) : r === "hour" ? o = ca(i, a) : r === "day" ? o = dt(i, a) : r === "week" ? o = sa(i, a) : r === "month" ? o = _r(i, a) : r === "quarter" ? o = Zi(i, a) : r === "year" && (o = eo(i, a));
  else {
    const c = ir(i, a);
    Math.abs(c) < rf ? (o = ir(i, a), r = "second") : Math.abs(c) < Fs ? (o = ua(i, a), r = "minute") : Math.abs(c) < of && Math.abs(dt(i, a)) < 1 ? (o = ca(i, a), r = "hour") : Math.abs(c) < nE && (o = dt(i, a)) && Math.abs(o) < 7 ? r = "day" : Math.abs(c) < aw ? (o = sa(i, a), r = "week") : Math.abs(c) < rE ? (o = _r(i, a), r = "month") : Math.abs(c) < iw && Zi(i, a) < 4 ? (o = Zi(i, a), r = "quarter") : (o = eo(i, a), r = "year");
  }
  return new Intl.RelativeTimeFormat(n == null ? void 0 : n.locale, {
    numeric: "auto",
    ...n
  }).format(o, r);
}
function jw(e, t) {
  return +N(e) > +N(t);
}
function Fw(e, t) {
  return +N(e) < +N(t);
}
function KP(e, t) {
  return +N(e) == +N(t);
}
function XP(e, t, n) {
  const o = new Date(e, t, n);
  return o.getFullYear() === e && o.getMonth() === t && o.getDate() === n;
}
function QP(e, t) {
  return N(e, t == null ? void 0 : t.in).getDate() === 1;
}
function eT(e, t) {
  return N(e, t == null ? void 0 : t.in).getDay() === 5;
}
function tT(e) {
  return +N(e) > Date.now();
}
function Ww(e, t) {
  const n = nT(t) ? new t(0) : L(t, 0);
  return n.setFullYear(e.getFullYear(), e.getMonth(), e.getDate()), n.setHours(
    e.getHours(),
    e.getMinutes(),
    e.getSeconds(),
    e.getMilliseconds()
  ), n;
}
function nT(e) {
  var t;
  return typeof e == "function" && ((t = e.prototype) == null ? void 0 : t.constructor) === e;
}
const rT = 10;
class Lw {
  constructor() {
    j(this, "subPriority", 0);
  }
  validate(t, n) {
    return !0;
  }
}
class oT extends Lw {
  constructor(t, n, o, r, i) {
    super(), this.value = t, this.validateValue = n, this.setValue = o, this.priority = r, i && (this.subPriority = i);
  }
  validate(t, n) {
    return this.validateValue(t, this.value, n);
  }
  set(t, n, o) {
    return this.setValue(t, n, this.value, o);
  }
}
class iT extends Lw {
  constructor(n, o) {
    super();
    j(this, "priority", rT);
    j(this, "subPriority", -1);
    this.context = n || ((r) => L(o, r));
  }
  set(n, o) {
    return o.timestampIsSet ? n : L(n, Ww(n, this.context));
  }
}
class ge {
  run(t, n, o, r) {
    const i = this.parse(t, n, o, r);
    return i ? {
      setter: new oT(
        i.value,
        this.validate,
        this.set,
        this.priority,
        this.subPriority
      ),
      rest: i.rest
    } : null;
  }
  validate(t, n, o) {
    return !0;
  }
}
class aT extends ge {
  constructor() {
    super(...arguments);
    j(this, "priority", 140);
    j(this, "incompatibleTokens", ["R", "u", "t", "T"]);
  }
  parse(n, o, r) {
    switch (o) {
      case "G":
      case "GG":
      case "GGG":
        return r.era(n, { width: "abbreviated" }) || r.era(n, { width: "narrow" });
      case "GGGGG":
        return r.era(n, { width: "narrow" });
      case "GGGG":
      default:
        return r.era(n, { width: "wide" }) || r.era(n, { width: "abbreviated" }) || r.era(n, { width: "narrow" });
    }
  }
  set(n, o, r) {
    return o.era = r, n.setFullYear(r, 0, 1), n.setHours(0, 0, 0, 0), n;
  }
}
const Ie = {
  month: /^(1[0-2]|0?\d)/,
  // 0 to 12
  date: /^(3[0-1]|[0-2]?\d)/,
  // 0 to 31
  dayOfYear: /^(36[0-6]|3[0-5]\d|[0-2]?\d?\d)/,
  // 0 to 366
  week: /^(5[0-3]|[0-4]?\d)/,
  // 0 to 53
  hour23h: /^(2[0-3]|[0-1]?\d)/,
  // 0 to 23
  hour24h: /^(2[0-4]|[0-1]?\d)/,
  // 0 to 24
  hour11h: /^(1[0-1]|0?\d)/,
  // 0 to 11
  hour12h: /^(1[0-2]|0?\d)/,
  // 0 to 12
  minute: /^[0-5]?\d/,
  // 0 to 59
  second: /^[0-5]?\d/,
  // 0 to 59
  singleDigit: /^\d/,
  // 0 to 9
  twoDigits: /^\d{1,2}/,
  // 0 to 99
  threeDigits: /^\d{1,3}/,
  // 0 to 999
  fourDigits: /^\d{1,4}/,
  // 0 to 9999
  anyDigitsSigned: /^-?\d+/,
  singleDigitSigned: /^-?\d/,
  // 0 to 9, -0 to -9
  twoDigitsSigned: /^-?\d{1,2}/,
  // 0 to 99, -0 to -99
  threeDigitsSigned: /^-?\d{1,3}/,
  // 0 to 999, -0 to -999
  fourDigitsSigned: /^-?\d{1,4}/
  // 0 to 9999, -0 to -9999
}, Ct = {
  basicOptionalMinutes: /^([+-])(\d{2})(\d{2})?|Z/,
  basic: /^([+-])(\d{2})(\d{2})|Z/,
  basicOptionalSeconds: /^([+-])(\d{2})(\d{2})((\d{2}))?|Z/,
  extended: /^([+-])(\d{2}):(\d{2})|Z/,
  extendedOptionalSeconds: /^([+-])(\d{2}):(\d{2})(:(\d{2}))?|Z/
};
function Ne(e, t) {
  return e && {
    value: t(e.value),
    rest: e.rest
  };
}
function De(e, t) {
  const n = t.match(e);
  return n ? {
    value: parseInt(n[0], 10),
    rest: t.slice(n[0].length)
  } : null;
}
function Mt(e, t) {
  const n = t.match(e);
  if (!n)
    return null;
  if (n[0] === "Z")
    return {
      value: 0,
      rest: t.slice(1)
    };
  const o = n[1] === "+" ? 1 : -1, r = n[2] ? parseInt(n[2], 10) : 0, i = n[3] ? parseInt(n[3], 10) : 0, a = n[5] ? parseInt(n[5], 10) : 0;
  return {
    value: o * (r * Bn + i * nn + a * nf),
    rest: t.slice(n[0].length)
  };
}
function Zw(e) {
  return De(Ie.anyDigitsSigned, e);
}
function Oe(e, t) {
  switch (e) {
    case 1:
      return De(Ie.singleDigit, t);
    case 2:
      return De(Ie.twoDigits, t);
    case 3:
      return De(Ie.threeDigits, t);
    case 4:
      return De(Ie.fourDigits, t);
    default:
      return De(new RegExp("^\\d{1," + e + "}"), t);
  }
}
function fa(e, t) {
  switch (e) {
    case 1:
      return De(Ie.singleDigitSigned, t);
    case 2:
      return De(Ie.twoDigitsSigned, t);
    case 3:
      return De(Ie.threeDigitsSigned, t);
    case 4:
      return De(Ie.fourDigitsSigned, t);
    default:
      return De(new RegExp("^-?\\d{1," + e + "}"), t);
  }
}
function yf(e) {
  switch (e) {
    case "morning":
      return 4;
    case "evening":
      return 17;
    case "pm":
    case "noon":
    case "afternoon":
      return 12;
    case "am":
    case "midnight":
    case "night":
    default:
      return 0;
  }
}
function Yw(e, t) {
  const n = t > 0, o = n ? t : 1 - t;
  let r;
  if (o <= 50)
    r = e || 100;
  else {
    const i = o + 50, a = Math.trunc(i / 100) * 100, s = e >= i % 100;
    r = e + a - (s ? 100 : 0);
  }
  return n ? r : 1 - r;
}
function Bw(e) {
  return e % 400 === 0 || e % 4 === 0 && e % 100 !== 0;
}
class sT extends ge {
  constructor() {
    super(...arguments);
    j(this, "priority", 130);
    j(this, "incompatibleTokens", ["Y", "R", "u", "w", "I", "i", "e", "c", "t", "T"]);
  }
  parse(n, o, r) {
    const i = (a) => ({
      year: a,
      isTwoDigitYear: o === "yy"
    });
    switch (o) {
      case "y":
        return Ne(Oe(4, n), i);
      case "yo":
        return Ne(
          r.ordinalNumber(n, {
            unit: "year"
          }),
          i
        );
      default:
        return Ne(Oe(o.length, n), i);
    }
  }
  validate(n, o) {
    return o.isTwoDigitYear || o.year > 0;
  }
  set(n, o, r) {
    const i = n.getFullYear();
    if (r.isTwoDigitYear) {
      const s = Yw(
        r.year,
        i
      );
      return n.setFullYear(s, 0, 1), n.setHours(0, 0, 0, 0), n;
    }
    const a = !("era" in o) || o.era === 1 ? r.year : 1 - r.year;
    return n.setFullYear(a, 0, 1), n.setHours(0, 0, 0, 0), n;
  }
}
class cT extends ge {
  constructor() {
    super(...arguments);
    j(this, "priority", 130);
    j(this, "incompatibleTokens", [
      "y",
      "R",
      "u",
      "Q",
      "q",
      "M",
      "L",
      "I",
      "d",
      "D",
      "i",
      "t",
      "T"
    ]);
  }
  parse(n, o, r) {
    const i = (a) => ({
      year: a,
      isTwoDigitYear: o === "YY"
    });
    switch (o) {
      case "Y":
        return Ne(Oe(4, n), i);
      case "Yo":
        return Ne(
          r.ordinalNumber(n, {
            unit: "year"
          }),
          i
        );
      default:
        return Ne(Oe(o.length, n), i);
    }
  }
  validate(n, o) {
    return o.isTwoDigitYear || o.year > 0;
  }
  set(n, o, r, i) {
    const a = Bs(n, i);
    if (r.isTwoDigitYear) {
      const c = Yw(
        r.year,
        a
      );
      return n.setFullYear(
        c,
        0,
        i.firstWeekContainsDate
      ), n.setHours(0, 0, 0, 0), Me(n, i);
    }
    const s = !("era" in o) || o.era === 1 ? r.year : 1 - r.year;
    return n.setFullYear(s, 0, i.firstWeekContainsDate), n.setHours(0, 0, 0, 0), Me(n, i);
  }
}
class uT extends ge {
  constructor() {
    super(...arguments);
    j(this, "priority", 130);
    j(this, "incompatibleTokens", [
      "G",
      "y",
      "Y",
      "u",
      "Q",
      "q",
      "M",
      "L",
      "w",
      "d",
      "D",
      "e",
      "c",
      "t",
      "T"
    ]);
  }
  parse(n, o) {
    return fa(o === "R" ? 4 : o.length, n);
  }
  set(n, o, r) {
    const i = L(n, 0);
    return i.setFullYear(r, 0, 4), i.setHours(0, 0, 0, 0), ht(i);
  }
}
class lT extends ge {
  constructor() {
    super(...arguments);
    j(this, "priority", 130);
    j(this, "incompatibleTokens", ["G", "y", "Y", "R", "w", "I", "i", "e", "c", "t", "T"]);
  }
  parse(n, o) {
    return fa(o === "u" ? 4 : o.length, n);
  }
  set(n, o, r) {
    return n.setFullYear(r, 0, 1), n.setHours(0, 0, 0, 0), n;
  }
}
class dT extends ge {
  constructor() {
    super(...arguments);
    j(this, "priority", 120);
    j(this, "incompatibleTokens", [
      "Y",
      "R",
      "q",
      "M",
      "L",
      "w",
      "I",
      "d",
      "D",
      "i",
      "e",
      "c",
      "t",
      "T"
    ]);
  }
  parse(n, o, r) {
    switch (o) {
      case "Q":
      case "QQ":
        return Oe(o.length, n);
      case "Qo":
        return r.ordinalNumber(n, { unit: "quarter" });
      case "QQQ":
        return r.quarter(n, {
          width: "abbreviated",
          context: "formatting"
        }) || r.quarter(n, {
          width: "narrow",
          context: "formatting"
        });
      case "QQQQQ":
        return r.quarter(n, {
          width: "narrow",
          context: "formatting"
        });
      case "QQQQ":
      default:
        return r.quarter(n, {
          width: "wide",
          context: "formatting"
        }) || r.quarter(n, {
          width: "abbreviated",
          context: "formatting"
        }) || r.quarter(n, {
          width: "narrow",
          context: "formatting"
        });
    }
  }
  validate(n, o) {
    return o >= 1 && o <= 4;
  }
  set(n, o, r) {
    return n.setMonth((r - 1) * 3, 1), n.setHours(0, 0, 0, 0), n;
  }
}
class fT extends ge {
  constructor() {
    super(...arguments);
    j(this, "priority", 120);
    j(this, "incompatibleTokens", [
      "Y",
      "R",
      "Q",
      "M",
      "L",
      "w",
      "I",
      "d",
      "D",
      "i",
      "e",
      "c",
      "t",
      "T"
    ]);
  }
  parse(n, o, r) {
    switch (o) {
      case "q":
      case "qq":
        return Oe(o.length, n);
      case "qo":
        return r.ordinalNumber(n, { unit: "quarter" });
      case "qqq":
        return r.quarter(n, {
          width: "abbreviated",
          context: "standalone"
        }) || r.quarter(n, {
          width: "narrow",
          context: "standalone"
        });
      case "qqqqq":
        return r.quarter(n, {
          width: "narrow",
          context: "standalone"
        });
      case "qqqq":
      default:
        return r.quarter(n, {
          width: "wide",
          context: "standalone"
        }) || r.quarter(n, {
          width: "abbreviated",
          context: "standalone"
        }) || r.quarter(n, {
          width: "narrow",
          context: "standalone"
        });
    }
  }
  validate(n, o) {
    return o >= 1 && o <= 4;
  }
  set(n, o, r) {
    return n.setMonth((r - 1) * 3, 1), n.setHours(0, 0, 0, 0), n;
  }
}
class mT extends ge {
  constructor() {
    super(...arguments);
    j(this, "incompatibleTokens", [
      "Y",
      "R",
      "q",
      "Q",
      "L",
      "w",
      "I",
      "D",
      "i",
      "e",
      "c",
      "t",
      "T"
    ]);
    j(this, "priority", 110);
  }
  parse(n, o, r) {
    const i = (a) => a - 1;
    switch (o) {
      case "M":
        return Ne(
          De(Ie.month, n),
          i
        );
      case "MM":
        return Ne(Oe(2, n), i);
      case "Mo":
        return Ne(
          r.ordinalNumber(n, {
            unit: "month"
          }),
          i
        );
      case "MMM":
        return r.month(n, {
          width: "abbreviated",
          context: "formatting"
        }) || r.month(n, { width: "narrow", context: "formatting" });
      case "MMMMM":
        return r.month(n, {
          width: "narrow",
          context: "formatting"
        });
      case "MMMM":
      default:
        return r.month(n, { width: "wide", context: "formatting" }) || r.month(n, {
          width: "abbreviated",
          context: "formatting"
        }) || r.month(n, { width: "narrow", context: "formatting" });
    }
  }
  validate(n, o) {
    return o >= 0 && o <= 11;
  }
  set(n, o, r) {
    return n.setMonth(r, 1), n.setHours(0, 0, 0, 0), n;
  }
}
class hT extends ge {
  constructor() {
    super(...arguments);
    j(this, "priority", 110);
    j(this, "incompatibleTokens", [
      "Y",
      "R",
      "q",
      "Q",
      "M",
      "w",
      "I",
      "D",
      "i",
      "e",
      "c",
      "t",
      "T"
    ]);
  }
  parse(n, o, r) {
    const i = (a) => a - 1;
    switch (o) {
      case "L":
        return Ne(
          De(Ie.month, n),
          i
        );
      case "LL":
        return Ne(Oe(2, n), i);
      case "Lo":
        return Ne(
          r.ordinalNumber(n, {
            unit: "month"
          }),
          i
        );
      case "LLL":
        return r.month(n, {
          width: "abbreviated",
          context: "standalone"
        }) || r.month(n, { width: "narrow", context: "standalone" });
      case "LLLLL":
        return r.month(n, {
          width: "narrow",
          context: "standalone"
        });
      case "LLLL":
      default:
        return r.month(n, { width: "wide", context: "standalone" }) || r.month(n, {
          width: "abbreviated",
          context: "standalone"
        }) || r.month(n, { width: "narrow", context: "standalone" });
    }
  }
  validate(n, o) {
    return o >= 0 && o <= 11;
  }
  set(n, o, r) {
    return n.setMonth(r, 1), n.setHours(0, 0, 0, 0), n;
  }
}
function Hw(e, t, n) {
  const o = N(e, n == null ? void 0 : n.in), r = fi(o, n) - t;
  return o.setDate(o.getDate() - r * 7), N(o, n == null ? void 0 : n.in);
}
class gT extends ge {
  constructor() {
    super(...arguments);
    j(this, "priority", 100);
    j(this, "incompatibleTokens", [
      "y",
      "R",
      "u",
      "q",
      "Q",
      "M",
      "L",
      "I",
      "d",
      "D",
      "i",
      "t",
      "T"
    ]);
  }
  parse(n, o, r) {
    switch (o) {
      case "w":
        return De(Ie.week, n);
      case "wo":
        return r.ordinalNumber(n, { unit: "week" });
      default:
        return Oe(o.length, n);
    }
  }
  validate(n, o) {
    return o >= 1 && o <= 53;
  }
  set(n, o, r, i) {
    return Me(Hw(n, r, i), i);
  }
}
function Gw(e, t, n) {
  const o = N(e, n == null ? void 0 : n.in), r = di(o, n) - t;
  return o.setDate(o.getDate() - r * 7), o;
}
class pT extends ge {
  constructor() {
    super(...arguments);
    j(this, "priority", 100);
    j(this, "incompatibleTokens", [
      "y",
      "Y",
      "u",
      "q",
      "Q",
      "M",
      "L",
      "w",
      "d",
      "D",
      "e",
      "c",
      "t",
      "T"
    ]);
  }
  parse(n, o, r) {
    switch (o) {
      case "I":
        return De(Ie.week, n);
      case "Io":
        return r.ordinalNumber(n, { unit: "week" });
      default:
        return Oe(o.length, n);
    }
  }
  validate(n, o) {
    return o >= 1 && o <= 53;
  }
  set(n, o, r) {
    return ht(Gw(n, r));
  }
}
const vT = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], yT = [
  31,
  29,
  31,
  30,
  31,
  30,
  31,
  31,
  30,
  31,
  30,
  31
];
class bT extends ge {
  constructor() {
    super(...arguments);
    j(this, "priority", 90);
    j(this, "subPriority", 1);
    j(this, "incompatibleTokens", [
      "Y",
      "R",
      "q",
      "Q",
      "w",
      "I",
      "D",
      "i",
      "e",
      "c",
      "t",
      "T"
    ]);
  }
  parse(n, o, r) {
    switch (o) {
      case "d":
        return De(Ie.date, n);
      case "do":
        return r.ordinalNumber(n, { unit: "date" });
      default:
        return Oe(o.length, n);
    }
  }
  validate(n, o) {
    const r = n.getFullYear(), i = Bw(r), a = n.getMonth();
    return i ? o >= 1 && o <= yT[a] : o >= 1 && o <= vT[a];
  }
  set(n, o, r) {
    return n.setDate(r), n.setHours(0, 0, 0, 0), n;
  }
}
class wT extends ge {
  constructor() {
    super(...arguments);
    j(this, "priority", 90);
    j(this, "subpriority", 1);
    j(this, "incompatibleTokens", [
      "Y",
      "R",
      "q",
      "Q",
      "M",
      "L",
      "w",
      "I",
      "d",
      "E",
      "i",
      "e",
      "c",
      "t",
      "T"
    ]);
  }
  parse(n, o, r) {
    switch (o) {
      case "D":
      case "DD":
        return De(Ie.dayOfYear, n);
      case "Do":
        return r.ordinalNumber(n, { unit: "date" });
      default:
        return Oe(o.length, n);
    }
  }
  validate(n, o) {
    const r = n.getFullYear();
    return Bw(r) ? o >= 1 && o <= 366 : o >= 1 && o <= 365;
  }
  set(n, o, r) {
    return n.setMonth(0, r), n.setHours(0, 0, 0, 0), n;
  }
}
function Gs(e, t, n) {
  var d, f, h, g;
  const o = Ve(), r = (n == null ? void 0 : n.weekStartsOn) ?? ((f = (d = n == null ? void 0 : n.locale) == null ? void 0 : d.options) == null ? void 0 : f.weekStartsOn) ?? o.weekStartsOn ?? ((g = (h = o.locale) == null ? void 0 : h.options) == null ? void 0 : g.weekStartsOn) ?? 0, i = N(e, n == null ? void 0 : n.in), a = i.getDay(), c = (t % 7 + 7) % 7, u = 7 - r, l = t < 0 || t > 6 ? t - (a + u) % 7 : (c + u) % 7 - (a + u) % 7;
  return _t(i, l, n);
}
class _T extends ge {
  constructor() {
    super(...arguments);
    j(this, "priority", 90);
    j(this, "incompatibleTokens", ["D", "i", "e", "c", "t", "T"]);
  }
  parse(n, o, r) {
    switch (o) {
      case "E":
      case "EE":
      case "EEE":
        return r.day(n, {
          width: "abbreviated",
          context: "formatting"
        }) || r.day(n, { width: "short", context: "formatting" }) || r.day(n, { width: "narrow", context: "formatting" });
      case "EEEEE":
        return r.day(n, {
          width: "narrow",
          context: "formatting"
        });
      case "EEEEEE":
        return r.day(n, { width: "short", context: "formatting" }) || r.day(n, { width: "narrow", context: "formatting" });
      case "EEEE":
      default:
        return r.day(n, { width: "wide", context: "formatting" }) || r.day(n, {
          width: "abbreviated",
          context: "formatting"
        }) || r.day(n, { width: "short", context: "formatting" }) || r.day(n, { width: "narrow", context: "formatting" });
    }
  }
  validate(n, o) {
    return o >= 0 && o <= 6;
  }
  set(n, o, r, i) {
    return n = Gs(n, r, i), n.setHours(0, 0, 0, 0), n;
  }
}
class $T extends ge {
  constructor() {
    super(...arguments);
    j(this, "priority", 90);
    j(this, "incompatibleTokens", [
      "y",
      "R",
      "u",
      "q",
      "Q",
      "M",
      "L",
      "I",
      "d",
      "D",
      "E",
      "i",
      "c",
      "t",
      "T"
    ]);
  }
  parse(n, o, r, i) {
    const a = (s) => {
      const c = Math.floor((s - 1) / 7) * 7;
      return (s + i.weekStartsOn + 6) % 7 + c;
    };
    switch (o) {
      case "e":
      case "ee":
        return Ne(Oe(o.length, n), a);
      case "eo":
        return Ne(
          r.ordinalNumber(n, {
            unit: "day"
          }),
          a
        );
      case "eee":
        return r.day(n, {
          width: "abbreviated",
          context: "formatting"
        }) || r.day(n, { width: "short", context: "formatting" }) || r.day(n, { width: "narrow", context: "formatting" });
      case "eeeee":
        return r.day(n, {
          width: "narrow",
          context: "formatting"
        });
      case "eeeeee":
        return r.day(n, { width: "short", context: "formatting" }) || r.day(n, { width: "narrow", context: "formatting" });
      case "eeee":
      default:
        return r.day(n, { width: "wide", context: "formatting" }) || r.day(n, {
          width: "abbreviated",
          context: "formatting"
        }) || r.day(n, { width: "short", context: "formatting" }) || r.day(n, { width: "narrow", context: "formatting" });
    }
  }
  validate(n, o) {
    return o >= 0 && o <= 6;
  }
  set(n, o, r, i) {
    return n = Gs(n, r, i), n.setHours(0, 0, 0, 0), n;
  }
}
class kT extends ge {
  constructor() {
    super(...arguments);
    j(this, "priority", 90);
    j(this, "incompatibleTokens", [
      "y",
      "R",
      "u",
      "q",
      "Q",
      "M",
      "L",
      "I",
      "d",
      "D",
      "E",
      "i",
      "e",
      "t",
      "T"
    ]);
  }
  parse(n, o, r, i) {
    const a = (s) => {
      const c = Math.floor((s - 1) / 7) * 7;
      return (s + i.weekStartsOn + 6) % 7 + c;
    };
    switch (o) {
      case "c":
      case "cc":
        return Ne(Oe(o.length, n), a);
      case "co":
        return Ne(
          r.ordinalNumber(n, {
            unit: "day"
          }),
          a
        );
      case "ccc":
        return r.day(n, {
          width: "abbreviated",
          context: "standalone"
        }) || r.day(n, { width: "short", context: "standalone" }) || r.day(n, { width: "narrow", context: "standalone" });
      case "ccccc":
        return r.day(n, {
          width: "narrow",
          context: "standalone"
        });
      case "cccccc":
        return r.day(n, { width: "short", context: "standalone" }) || r.day(n, { width: "narrow", context: "standalone" });
      case "cccc":
      default:
        return r.day(n, { width: "wide", context: "standalone" }) || r.day(n, {
          width: "abbreviated",
          context: "standalone"
        }) || r.day(n, { width: "short", context: "standalone" }) || r.day(n, { width: "narrow", context: "standalone" });
    }
  }
  validate(n, o) {
    return o >= 0 && o <= 6;
  }
  set(n, o, r, i) {
    return n = Gs(n, r, i), n.setHours(0, 0, 0, 0), n;
  }
}
function Vw(e, t, n) {
  const o = N(e, n == null ? void 0 : n.in), r = zw(o, n), i = t - r;
  return _t(o, i, n);
}
class xT extends ge {
  constructor() {
    super(...arguments);
    j(this, "priority", 90);
    j(this, "incompatibleTokens", [
      "y",
      "Y",
      "u",
      "q",
      "Q",
      "M",
      "L",
      "w",
      "d",
      "D",
      "E",
      "e",
      "c",
      "t",
      "T"
    ]);
  }
  parse(n, o, r) {
    const i = (a) => a === 0 ? 7 : a;
    switch (o) {
      case "i":
      case "ii":
        return Oe(o.length, n);
      case "io":
        return r.ordinalNumber(n, { unit: "day" });
      case "iii":
        return Ne(
          r.day(n, {
            width: "abbreviated",
            context: "formatting"
          }) || r.day(n, {
            width: "short",
            context: "formatting"
          }) || r.day(n, {
            width: "narrow",
            context: "formatting"
          }),
          i
        );
      case "iiiii":
        return Ne(
          r.day(n, {
            width: "narrow",
            context: "formatting"
          }),
          i
        );
      case "iiiiii":
        return Ne(
          r.day(n, {
            width: "short",
            context: "formatting"
          }) || r.day(n, {
            width: "narrow",
            context: "formatting"
          }),
          i
        );
      case "iiii":
      default:
        return Ne(
          r.day(n, {
            width: "wide",
            context: "formatting"
          }) || r.day(n, {
            width: "abbreviated",
            context: "formatting"
          }) || r.day(n, {
            width: "short",
            context: "formatting"
          }) || r.day(n, {
            width: "narrow",
            context: "formatting"
          }),
          i
        );
    }
  }
  validate(n, o) {
    return o >= 1 && o <= 7;
  }
  set(n, o, r) {
    return n = Vw(n, r), n.setHours(0, 0, 0, 0), n;
  }
}
class ST extends ge {
  constructor() {
    super(...arguments);
    j(this, "priority", 80);
    j(this, "incompatibleTokens", ["b", "B", "H", "k", "t", "T"]);
  }
  parse(n, o, r) {
    switch (o) {
      case "a":
      case "aa":
      case "aaa":
        return r.dayPeriod(n, {
          width: "abbreviated",
          context: "formatting"
        }) || r.dayPeriod(n, {
          width: "narrow",
          context: "formatting"
        });
      case "aaaaa":
        return r.dayPeriod(n, {
          width: "narrow",
          context: "formatting"
        });
      case "aaaa":
      default:
        return r.dayPeriod(n, {
          width: "wide",
          context: "formatting"
        }) || r.dayPeriod(n, {
          width: "abbreviated",
          context: "formatting"
        }) || r.dayPeriod(n, {
          width: "narrow",
          context: "formatting"
        });
    }
  }
  set(n, o, r) {
    return n.setHours(yf(r), 0, 0, 0), n;
  }
}
class DT extends ge {
  constructor() {
    super(...arguments);
    j(this, "priority", 80);
    j(this, "incompatibleTokens", ["a", "B", "H", "k", "t", "T"]);
  }
  parse(n, o, r) {
    switch (o) {
      case "b":
      case "bb":
      case "bbb":
        return r.dayPeriod(n, {
          width: "abbreviated",
          context: "formatting"
        }) || r.dayPeriod(n, {
          width: "narrow",
          context: "formatting"
        });
      case "bbbbb":
        return r.dayPeriod(n, {
          width: "narrow",
          context: "formatting"
        });
      case "bbbb":
      default:
        return r.dayPeriod(n, {
          width: "wide",
          context: "formatting"
        }) || r.dayPeriod(n, {
          width: "abbreviated",
          context: "formatting"
        }) || r.dayPeriod(n, {
          width: "narrow",
          context: "formatting"
        });
    }
  }
  set(n, o, r) {
    return n.setHours(yf(r), 0, 0, 0), n;
  }
}
class OT extends ge {
  constructor() {
    super(...arguments);
    j(this, "priority", 80);
    j(this, "incompatibleTokens", ["a", "b", "t", "T"]);
  }
  parse(n, o, r) {
    switch (o) {
      case "B":
      case "BB":
      case "BBB":
        return r.dayPeriod(n, {
          width: "abbreviated",
          context: "formatting"
        }) || r.dayPeriod(n, {
          width: "narrow",
          context: "formatting"
        });
      case "BBBBB":
        return r.dayPeriod(n, {
          width: "narrow",
          context: "formatting"
        });
      case "BBBB":
      default:
        return r.dayPeriod(n, {
          width: "wide",
          context: "formatting"
        }) || r.dayPeriod(n, {
          width: "abbreviated",
          context: "formatting"
        }) || r.dayPeriod(n, {
          width: "narrow",
          context: "formatting"
        });
    }
  }
  set(n, o, r) {
    return n.setHours(yf(r), 0, 0, 0), n;
  }
}
class IT extends ge {
  constructor() {
    super(...arguments);
    j(this, "priority", 70);
    j(this, "incompatibleTokens", ["H", "K", "k", "t", "T"]);
  }
  parse(n, o, r) {
    switch (o) {
      case "h":
        return De(Ie.hour12h, n);
      case "ho":
        return r.ordinalNumber(n, { unit: "hour" });
      default:
        return Oe(o.length, n);
    }
  }
  validate(n, o) {
    return o >= 1 && o <= 12;
  }
  set(n, o, r) {
    const i = n.getHours() >= 12;
    return i && r < 12 ? n.setHours(r + 12, 0, 0, 0) : !i && r === 12 ? n.setHours(0, 0, 0, 0) : n.setHours(r, 0, 0, 0), n;
  }
}
class NT extends ge {
  constructor() {
    super(...arguments);
    j(this, "priority", 70);
    j(this, "incompatibleTokens", ["a", "b", "h", "K", "k", "t", "T"]);
  }
  parse(n, o, r) {
    switch (o) {
      case "H":
        return De(Ie.hour23h, n);
      case "Ho":
        return r.ordinalNumber(n, { unit: "hour" });
      default:
        return Oe(o.length, n);
    }
  }
  validate(n, o) {
    return o >= 0 && o <= 23;
  }
  set(n, o, r) {
    return n.setHours(r, 0, 0, 0), n;
  }
}
class ET extends ge {
  constructor() {
    super(...arguments);
    j(this, "priority", 70);
    j(this, "incompatibleTokens", ["h", "H", "k", "t", "T"]);
  }
  parse(n, o, r) {
    switch (o) {
      case "K":
        return De(Ie.hour11h, n);
      case "Ko":
        return r.ordinalNumber(n, { unit: "hour" });
      default:
        return Oe(o.length, n);
    }
  }
  validate(n, o) {
    return o >= 0 && o <= 11;
  }
  set(n, o, r) {
    return n.getHours() >= 12 && r < 12 ? n.setHours(r + 12, 0, 0, 0) : n.setHours(r, 0, 0, 0), n;
  }
}
class PT extends ge {
  constructor() {
    super(...arguments);
    j(this, "priority", 70);
    j(this, "incompatibleTokens", ["a", "b", "h", "H", "K", "t", "T"]);
  }
  parse(n, o, r) {
    switch (o) {
      case "k":
        return De(Ie.hour24h, n);
      case "ko":
        return r.ordinalNumber(n, { unit: "hour" });
      default:
        return Oe(o.length, n);
    }
  }
  validate(n, o) {
    return o >= 1 && o <= 24;
  }
  set(n, o, r) {
    const i = r <= 24 ? r % 24 : r;
    return n.setHours(i, 0, 0, 0), n;
  }
}
class TT extends ge {
  constructor() {
    super(...arguments);
    j(this, "priority", 60);
    j(this, "incompatibleTokens", ["t", "T"]);
  }
  parse(n, o, r) {
    switch (o) {
      case "m":
        return De(Ie.minute, n);
      case "mo":
        return r.ordinalNumber(n, { unit: "minute" });
      default:
        return Oe(o.length, n);
    }
  }
  validate(n, o) {
    return o >= 0 && o <= 59;
  }
  set(n, o, r) {
    return n.setMinutes(r, 0, 0), n;
  }
}
class CT extends ge {
  constructor() {
    super(...arguments);
    j(this, "priority", 50);
    j(this, "incompatibleTokens", ["t", "T"]);
  }
  parse(n, o, r) {
    switch (o) {
      case "s":
        return De(Ie.second, n);
      case "so":
        return r.ordinalNumber(n, { unit: "second" });
      default:
        return Oe(o.length, n);
    }
  }
  validate(n, o) {
    return o >= 0 && o <= 59;
  }
  set(n, o, r) {
    return n.setSeconds(r, 0), n;
  }
}
class MT extends ge {
  constructor() {
    super(...arguments);
    j(this, "priority", 30);
    j(this, "incompatibleTokens", ["t", "T"]);
  }
  parse(n, o) {
    const r = (i) => Math.trunc(i * Math.pow(10, -o.length + 3));
    return Ne(Oe(o.length, n), r);
  }
  set(n, o, r) {
    return n.setMilliseconds(r), n;
  }
}
class zT extends ge {
  constructor() {
    super(...arguments);
    j(this, "priority", 10);
    j(this, "incompatibleTokens", ["t", "T", "x"]);
  }
  parse(n, o) {
    switch (o) {
      case "X":
        return Mt(
          Ct.basicOptionalMinutes,
          n
        );
      case "XX":
        return Mt(Ct.basic, n);
      case "XXXX":
        return Mt(
          Ct.basicOptionalSeconds,
          n
        );
      case "XXXXX":
        return Mt(
          Ct.extendedOptionalSeconds,
          n
        );
      case "XXX":
      default:
        return Mt(Ct.extended, n);
    }
  }
  set(n, o, r) {
    return o.timestampIsSet ? n : L(
      n,
      n.getTime() - Je(n) - r
    );
  }
}
class RT extends ge {
  constructor() {
    super(...arguments);
    j(this, "priority", 10);
    j(this, "incompatibleTokens", ["t", "T", "X"]);
  }
  parse(n, o) {
    switch (o) {
      case "x":
        return Mt(
          Ct.basicOptionalMinutes,
          n
        );
      case "xx":
        return Mt(Ct.basic, n);
      case "xxxx":
        return Mt(
          Ct.basicOptionalSeconds,
          n
        );
      case "xxxxx":
        return Mt(
          Ct.extendedOptionalSeconds,
          n
        );
      case "xxx":
      default:
        return Mt(Ct.extended, n);
    }
  }
  set(n, o, r) {
    return o.timestampIsSet ? n : L(
      n,
      n.getTime() - Je(n) - r
    );
  }
}
class AT extends ge {
  constructor() {
    super(...arguments);
    j(this, "priority", 40);
    j(this, "incompatibleTokens", "*");
  }
  parse(n) {
    return Zw(n);
  }
  set(n, o, r) {
    return [L(n, r * 1e3), { timestampIsSet: !0 }];
  }
}
class UT extends ge {
  constructor() {
    super(...arguments);
    j(this, "priority", 20);
    j(this, "incompatibleTokens", "*");
  }
  parse(n) {
    return Zw(n);
  }
  set(n, o, r) {
    return [L(n, r), { timestampIsSet: !0 }];
  }
}
const qw = {
  G: new aT(),
  y: new sT(),
  Y: new cT(),
  R: new uT(),
  u: new lT(),
  Q: new dT(),
  q: new fT(),
  M: new mT(),
  L: new hT(),
  w: new gT(),
  I: new pT(),
  d: new bT(),
  D: new wT(),
  E: new _T(),
  e: new $T(),
  c: new kT(),
  i: new xT(),
  a: new ST(),
  b: new DT(),
  B: new OT(),
  h: new IT(),
  H: new NT(),
  K: new ET(),
  k: new PT(),
  m: new TT(),
  s: new CT(),
  S: new MT(),
  X: new zT(),
  x: new RT(),
  t: new AT(),
  T: new UT()
}, jT = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g, FT = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g, WT = /^'([^]*?)'?$/, LT = /''/g, ZT = /\S/, YT = /[a-zA-Z]/;
function Jw(e, t, n, o) {
  var v, b, _, $, x, S, w, I;
  const r = () => L((o == null ? void 0 : o.in) || n, NaN), i = Mw(), a = (o == null ? void 0 : o.locale) ?? i.locale ?? rt, s = (o == null ? void 0 : o.firstWeekContainsDate) ?? ((b = (v = o == null ? void 0 : o.locale) == null ? void 0 : v.options) == null ? void 0 : b.firstWeekContainsDate) ?? i.firstWeekContainsDate ?? (($ = (_ = i.locale) == null ? void 0 : _.options) == null ? void 0 : $.firstWeekContainsDate) ?? 1, c = (o == null ? void 0 : o.weekStartsOn) ?? ((S = (x = o == null ? void 0 : o.locale) == null ? void 0 : x.options) == null ? void 0 : S.weekStartsOn) ?? i.weekStartsOn ?? ((I = (w = i.locale) == null ? void 0 : w.options) == null ? void 0 : I.weekStartsOn) ?? 0;
  if (!t)
    return e ? r() : N(n, o == null ? void 0 : o.in);
  const u = {
    firstWeekContainsDate: s,
    weekStartsOn: c,
    locale: a
  }, l = [new iT(o == null ? void 0 : o.in, n)], d = t.match(FT).map((D) => {
    const P = D[0];
    if (P in da) {
      const M = da[P];
      return M(D, a.formatLong);
    }
    return D;
  }).join("").match(jT), f = [];
  for (let D of d) {
    !(o != null && o.useAdditionalWeekYearTokens) && Iw(D) && uu(D, t, e), !(o != null && o.useAdditionalDayOfYearTokens) && Ow(D) && uu(D, t, e);
    const P = D[0], M = qw[P];
    if (M) {
      const { incompatibleTokens: B } = M;
      if (Array.isArray(B)) {
        const Q = f.find(
          (V) => B.includes(V.token) || V.token === P
        );
        if (Q)
          throw new RangeError(
            `The format string mustn't contain \`${Q.fullToken}\` and \`${D}\` at the same time`
          );
      } else if (M.incompatibleTokens === "*" && f.length > 0)
        throw new RangeError(
          `The format string mustn't contain \`${D}\` and any other token at the same time`
        );
      f.push({ token: P, fullToken: D });
      const K = M.run(
        e,
        D,
        a.match,
        u
      );
      if (!K)
        return r();
      l.push(K.setter), e = K.rest;
    } else {
      if (P.match(YT))
        throw new RangeError(
          "Format string contains an unescaped latin alphabet character `" + P + "`"
        );
      if (D === "''" ? D = "'" : P === "'" && (D = BT(D)), e.indexOf(D) === 0)
        e = e.slice(D.length);
      else
        return r();
    }
  }
  if (e.length > 0 && ZT.test(e))
    return r();
  const h = l.map((D) => D.priority).sort((D, P) => P - D).filter((D, P, M) => M.indexOf(D) === P).map(
    (D) => l.filter((P) => P.priority === D).sort((P, M) => M.subPriority - P.subPriority)
  ).map((D) => D[0]);
  let g = N(n, o == null ? void 0 : o.in);
  if (isNaN(+g))
    return r();
  const p = {};
  for (const D of h) {
    if (!D.validate(g, u))
      return r();
    const P = D.set(g, p, u);
    Array.isArray(P) ? (g = P[0], Object.assign(p, P[1])) : g = P;
  }
  return g;
}
function BT(e) {
  return e.match(WT)[1].replace(LT, "'");
}
function HT(e, t, n) {
  return rn(Jw(e, t, /* @__PURE__ */ new Date(), n));
}
function GT(e, t) {
  return N(e, t == null ? void 0 : t.in).getDay() === 1;
}
function VT(e) {
  return +N(e) < Date.now();
}
function lu(e, t) {
  const n = N(e, t == null ? void 0 : t.in);
  return n.setMinutes(0, 0, 0), n;
}
function Kw(e, t, n) {
  const [o, r] = _e(
    n == null ? void 0 : n.in,
    e,
    t
  );
  return +lu(o) == +lu(r);
}
function oo(e, t, n) {
  const [o, r] = _e(
    n == null ? void 0 : n.in,
    e,
    t
  );
  return +Me(o, n) == +Me(r, n);
}
function Xw(e, t, n) {
  return oo(e, t, { ...n, weekStartsOn: 1 });
}
function qT(e, t, n) {
  const [o, r] = _e(
    n == null ? void 0 : n.in,
    e,
    t
  );
  return +vn(o) == +vn(r);
}
function du(e, t) {
  const n = N(e, t == null ? void 0 : t.in);
  return n.setSeconds(0, 0), n;
}
function Qw(e, t) {
  return +du(e) == +du(t);
}
function bf(e, t, n) {
  const [o, r] = _e(
    n == null ? void 0 : n.in,
    e,
    t
  );
  return o.getFullYear() === r.getFullYear() && o.getMonth() === r.getMonth();
}
function e_(e, t, n) {
  const [o, r] = _e(
    n == null ? void 0 : n.in,
    e,
    t
  );
  return +Tn(o) == +Tn(r);
}
function fu(e, t) {
  const n = N(e, t == null ? void 0 : t.in);
  return n.setMilliseconds(0), n;
}
function t_(e, t) {
  return +fu(e) == +fu(t);
}
function wf(e, t, n) {
  const [o, r] = _e(
    n == null ? void 0 : n.in,
    e,
    t
  );
  return o.getFullYear() === r.getFullYear();
}
function JT(e, t) {
  return Kw(
    N(e, t == null ? void 0 : t.in),
    Te((t == null ? void 0 : t.in) || e)
  );
}
function KT(e, t) {
  return Xw(
    L((t == null ? void 0 : t.in) || e, e),
    Te((t == null ? void 0 : t.in) || e)
  );
}
function XT(e) {
  return Qw(e, Te(e));
}
function QT(e, t) {
  return bf(
    L((t == null ? void 0 : t.in) || e, e),
    Te((t == null ? void 0 : t.in) || e)
  );
}
function e1(e, t) {
  return e_(
    L((t == null ? void 0 : t.in) || e, e),
    Te((t == null ? void 0 : t.in) || e)
  );
}
function t1(e) {
  return t_(e, Te(e));
}
function n1(e, t) {
  return oo(
    L((t == null ? void 0 : t.in) || e, e),
    Te((t == null ? void 0 : t.in) || e),
    t
  );
}
function r1(e, t) {
  return wf(
    L((t == null ? void 0 : t.in) || e, e),
    Te((t == null ? void 0 : t.in) || e)
  );
}
function o1(e, t) {
  return N(e, t == null ? void 0 : t.in).getDay() === 4;
}
function i1(e, t) {
  return Zr(
    L((t == null ? void 0 : t.in) || e, e),
    Te((t == null ? void 0 : t.in) || e)
  );
}
function a1(e, t) {
  return Zr(
    e,
    _t(Te((t == null ? void 0 : t.in) || e), 1),
    t
  );
}
function s1(e, t) {
  return N(e, t == null ? void 0 : t.in).getDay() === 2;
}
function c1(e, t) {
  return N(e, t == null ? void 0 : t.in).getDay() === 3;
}
function u1(e, t, n) {
  const o = +N(e, n == null ? void 0 : n.in), [r, i] = [
    +N(t.start, n == null ? void 0 : n.in),
    +N(t.end, n == null ? void 0 : n.in)
  ].sort((a, s) => a - s);
  return o >= r && o <= i;
}
function Vs(e, t, n) {
  return _t(e, -t, n);
}
function l1(e, t) {
  return Zr(
    L((t == null ? void 0 : t.in) || e, e),
    Vs(Te((t == null ? void 0 : t.in) || e), 1)
  );
}
function d1(e, t) {
  const n = N(e, t == null ? void 0 : t.in), o = n.getFullYear(), r = 9 + Math.floor(o / 10) * 10;
  return n.setFullYear(r + 1, 0, 0), n.setHours(0, 0, 0, 0), N(n, t == null ? void 0 : t.in);
}
function n_(e, t) {
  var s, c, u, l;
  const n = Ve(), o = (t == null ? void 0 : t.weekStartsOn) ?? ((c = (s = t == null ? void 0 : t.locale) == null ? void 0 : s.options) == null ? void 0 : c.weekStartsOn) ?? n.weekStartsOn ?? ((l = (u = n.locale) == null ? void 0 : u.options) == null ? void 0 : l.weekStartsOn) ?? 0, r = N(e, t == null ? void 0 : t.in), i = r.getDay(), a = (i < o ? -7 : 0) + 6 - (i - o);
  return r.setHours(0, 0, 0, 0), r.setDate(r.getDate() + a), r;
}
function f1(e, t) {
  return n_(e, { ...t, weekStartsOn: 1 });
}
function m1(e, t) {
  const n = pn(e, t), o = L((t == null ? void 0 : t.in) || e, 0);
  o.setFullYear(n + 1, 0, 4), o.setHours(0, 0, 0, 0);
  const r = ht(o, t);
  return r.setDate(r.getDate() - 1), r;
}
function h1(e, t) {
  const n = N(e, t == null ? void 0 : t.in), o = n.getMonth(), r = o - o % 3 + 3;
  return n.setMonth(r, 0), n.setHours(0, 0, 0, 0), n;
}
function g1(e, t) {
  const n = N(e, t == null ? void 0 : t.in), o = n.getFullYear();
  return n.setFullYear(o + 1, 0, 0), n.setHours(0, 0, 0, 0), n;
}
const p1 = /(\w)\1*|''|'(''|[^'])+('|$)|./g, v1 = /^'([^]*?)'?$/, y1 = /''/g, b1 = /[a-zA-Z]/;
function w1(e, t) {
  const n = N(e);
  if (!rn(n))
    throw new RangeError("Invalid time value");
  const o = t.match(p1);
  return o ? o.map((i) => {
    if (i === "''")
      return "'";
    const a = i[0];
    if (a === "'")
      return _1(i);
    const s = Nt[a];
    if (s)
      return s(n, i);
    if (a.match(b1))
      throw new RangeError(
        "Format string contains an unescaped latin alphabet character `" + a + "`"
      );
    return i;
  }).join("") : "";
}
function _1(e) {
  const t = e.match(v1);
  return t ? t[1].replace(y1, "'") : e;
}
function $1({
  years: e,
  months: t,
  weeks: n,
  days: o,
  hours: r,
  minutes: i,
  seconds: a
}) {
  let s = 0;
  e && (s += e * ia), t && (s += t * (ia / 12)), n && (s += n * 7), o && (s += o);
  let c = s * 24 * 60 * 60;
  return r && (c += r * 60 * 60), i && (c += i * 60), a && (c += a), Math.trunc(c * 1e3);
}
function k1(e) {
  const t = e / Bn;
  return Math.trunc(t);
}
function x1(e) {
  const t = e / nn;
  return Math.trunc(t);
}
function S1(e) {
  const t = e / nf;
  return Math.trunc(t);
}
function D1(e) {
  const t = e / tw;
  return Math.trunc(t);
}
function O1(e) {
  return Math.trunc(e * nn);
}
function I1(e) {
  return Math.trunc(e * rf);
}
function N1(e) {
  const t = e / nw;
  return Math.trunc(t);
}
function E1(e) {
  const t = e / rw;
  return Math.trunc(t);
}
function kn(e, t, n) {
  let o = t - Hs(e, n);
  return o <= 0 && (o += 7), _t(e, o, n);
}
function P1(e, t) {
  return kn(e, 5, t);
}
function T1(e, t) {
  return kn(e, 1, t);
}
function C1(e, t) {
  return kn(e, 6, t);
}
function M1(e, t) {
  return kn(e, 0, t);
}
function z1(e, t) {
  return kn(e, 4, t);
}
function R1(e, t) {
  return kn(e, 2, t);
}
function A1(e, t) {
  return kn(e, 3, t);
}
function U1(e, t) {
  const n = () => L(t == null ? void 0 : t.in, NaN), o = (t == null ? void 0 : t.additionalDigits) ?? 2, r = L1(e);
  let i;
  if (r.date) {
    const u = Z1(r.date, o);
    i = Y1(u.restDateString, u.year);
  }
  if (!i || isNaN(+i))
    return n();
  const a = +i;
  let s = 0, c;
  if (r.time && (s = B1(r.time), isNaN(s)))
    return n();
  if (r.timezone) {
    if (c = H1(r.timezone), isNaN(c))
      return n();
  } else {
    const u = new Date(a + s), l = N(0, t == null ? void 0 : t.in);
    return l.setFullYear(
      u.getUTCFullYear(),
      u.getUTCMonth(),
      u.getUTCDate()
    ), l.setHours(
      u.getUTCHours(),
      u.getUTCMinutes(),
      u.getUTCSeconds(),
      u.getUTCMilliseconds()
    ), l;
  }
  return N(a + s + c, t == null ? void 0 : t.in);
}
const Ei = {
  dateTimeDelimiter: /[T ]/,
  timeZoneDelimiter: /[Z ]/i,
  timezone: /([Z+-].*)$/
}, j1 = /^-?(?:(\d{3})|(\d{2})(?:-?(\d{2}))?|W(\d{2})(?:-?(\d{1}))?|)$/, F1 = /^(\d{2}(?:[.,]\d*)?)(?::?(\d{2}(?:[.,]\d*)?))?(?::?(\d{2}(?:[.,]\d*)?))?$/, W1 = /^([+-])(\d{2})(?::?(\d{2}))?$/;
function L1(e) {
  const t = {}, n = e.split(Ei.dateTimeDelimiter);
  let o;
  if (n.length > 2)
    return t;
  if (/:/.test(n[0]) ? o = n[0] : (t.date = n[0], o = n[1], Ei.timeZoneDelimiter.test(t.date) && (t.date = e.split(Ei.timeZoneDelimiter)[0], o = e.substr(
    t.date.length,
    e.length
  ))), o) {
    const r = Ei.timezone.exec(o);
    r ? (t.time = o.replace(r[1], ""), t.timezone = r[1]) : t.time = o;
  }
  return t;
}
function Z1(e, t) {
  const n = new RegExp(
    "^(?:(\\d{4}|[+-]\\d{" + (4 + t) + "})|(\\d{2}|[+-]\\d{" + (2 + t) + "})$)"
  ), o = e.match(n);
  if (!o)
    return { year: NaN, restDateString: "" };
  const r = o[1] ? parseInt(o[1]) : null, i = o[2] ? parseInt(o[2]) : null;
  return {
    year: i === null ? r : i * 100,
    restDateString: e.slice((o[1] || o[2]).length)
  };
}
function Y1(e, t) {
  if (t === null)
    return /* @__PURE__ */ new Date(NaN);
  const n = e.match(j1);
  if (!n)
    return /* @__PURE__ */ new Date(NaN);
  const o = !!n[4], r = qr(n[1]), i = qr(n[2]) - 1, a = qr(n[3]), s = qr(n[4]), c = qr(n[5]) - 1;
  if (o)
    return K1(t, s, c) ? G1(t, s, c) : /* @__PURE__ */ new Date(NaN);
  {
    const u = /* @__PURE__ */ new Date(0);
    return !q1(t, i, a) || !J1(t, r) ? /* @__PURE__ */ new Date(NaN) : (u.setUTCFullYear(t, i, Math.max(r, a)), u);
  }
}
function qr(e) {
  return e ? parseInt(e) : 1;
}
function B1(e) {
  const t = e.match(F1);
  if (!t)
    return NaN;
  const n = zc(t[1]), o = zc(t[2]), r = zc(t[3]);
  return X1(n, o, r) ? n * Bn + o * nn + r * 1e3 : NaN;
}
function zc(e) {
  return e && parseFloat(e.replace(",", ".")) || 0;
}
function H1(e) {
  if (e === "Z")
    return 0;
  const t = e.match(W1);
  if (!t)
    return 0;
  const n = t[1] === "+" ? -1 : 1, o = parseInt(t[2]), r = t[3] && parseInt(t[3]) || 0;
  return Q1(o, r) ? n * (o * Bn + r * nn) : NaN;
}
function G1(e, t, n) {
  const o = /* @__PURE__ */ new Date(0);
  o.setUTCFullYear(e, 0, 4);
  const r = o.getUTCDay() || 7, i = (t - 1) * 7 + n + 1 - r;
  return o.setUTCDate(o.getUTCDate() + i), o;
}
const V1 = [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
function r_(e) {
  return e % 400 === 0 || e % 4 === 0 && e % 100 !== 0;
}
function q1(e, t, n) {
  return t >= 0 && t <= 11 && n >= 1 && n <= (V1[t] || (r_(e) ? 29 : 28));
}
function J1(e, t) {
  return t >= 1 && t <= (r_(e) ? 366 : 365);
}
function K1(e, t, n) {
  return t >= 1 && t <= 53 && n >= 0 && n <= 6;
}
function X1(e, t, n) {
  return e === 24 ? t === 0 && n === 0 : n >= 0 && n < 60 && t >= 0 && t < 60 && e >= 0 && e < 25;
}
function Q1(e, t) {
  return t >= 0 && t <= 59;
}
function eC(e, t) {
  const n = e.match(
    /(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2}):(\d{2})(?:\.(\d{0,7}))?(?:Z|(.)(\d{2}):?(\d{2})?)?/
  );
  return N(
    n ? Date.UTC(
      +n[1],
      +n[2] - 1,
      +n[3],
      +n[4] - (+n[9] || 0) * (n[8] == "-" ? -1 : 1),
      +n[5] - (+n[10] || 0) * (n[8] == "-" ? -1 : 1),
      +n[6],
      +((n[7] || "0") + "00").substring(0, 3)
    ) : NaN,
    t == null ? void 0 : t.in
  );
}
function xn(e, t, n) {
  let o = Hs(e, n) - t;
  return o <= 0 && (o += 7), Vs(e, o, n);
}
function tC(e, t) {
  return xn(e, 5, t);
}
function nC(e, t) {
  return xn(e, 1, t);
}
function rC(e, t) {
  return xn(e, 6, t);
}
function oC(e, t) {
  return xn(e, 0, t);
}
function iC(e, t) {
  return xn(e, 4, t);
}
function aC(e, t) {
  return xn(e, 2, t);
}
function sC(e, t) {
  return xn(e, 3, t);
}
function cC(e) {
  return Math.trunc(e * nw);
}
function uC(e) {
  const t = e / ow;
  return Math.trunc(t);
}
function lC(e, t) {
  const n = (t == null ? void 0 : t.nearestTo) ?? 1;
  if (n < 1 || n > 12)
    return L((t == null ? void 0 : t.in) || e, NaN);
  const o = N(e, t == null ? void 0 : t.in), r = o.getMinutes() / 60, i = o.getSeconds() / 60 / 60, a = o.getMilliseconds() / 1e3 / 60 / 60, s = o.getHours() + r + i + a, c = (t == null ? void 0 : t.roundingMethod) ?? "round", l = $n(c)(s / n) * n;
  return o.setHours(l, 0, 0, 0), o;
}
function dC(e, t) {
  const n = (t == null ? void 0 : t.nearestTo) ?? 1;
  if (n < 1 || n > 30)
    return L(e, NaN);
  const o = N(e, t == null ? void 0 : t.in), r = o.getSeconds() / 60, i = o.getMilliseconds() / 1e3 / 60, a = o.getMinutes() + r + i, s = (t == null ? void 0 : t.roundingMethod) ?? "round", u = $n(s)(a / n) * n;
  return o.setMinutes(u, 0, 0), o;
}
function fC(e) {
  const t = e / Fs;
  return Math.trunc(t);
}
function mC(e) {
  return e * nf;
}
function hC(e) {
  const t = e / rf;
  return Math.trunc(t);
}
function qs(e, t, n) {
  const o = N(e, n == null ? void 0 : n.in), r = o.getFullYear(), i = o.getDate(), a = L((n == null ? void 0 : n.in) || e, 0);
  a.setFullYear(r, t, 15), a.setHours(0, 0, 0, 0);
  const s = Tw(a);
  return o.setMonth(t, Math.min(i, s)), o;
}
function gC(e, t, n) {
  let o = N(e, n == null ? void 0 : n.in);
  return isNaN(+o) ? L((n == null ? void 0 : n.in) || e, NaN) : (t.year != null && o.setFullYear(t.year), t.month != null && (o = qs(o, t.month)), t.date != null && o.setDate(t.date), t.hours != null && o.setHours(t.hours), t.minutes != null && o.setMinutes(t.minutes), t.seconds != null && o.setSeconds(t.seconds), t.milliseconds != null && o.setMilliseconds(t.milliseconds), o);
}
function pC(e, t, n) {
  const o = N(e, n == null ? void 0 : n.in);
  return o.setDate(t), o;
}
function vC(e, t, n) {
  const o = N(e, n == null ? void 0 : n.in);
  return o.setMonth(0), o.setDate(t), o;
}
function yC(e) {
  const t = {}, n = Ve();
  for (const o in n)
    Object.prototype.hasOwnProperty.call(n, o) && (t[o] = n[o]);
  for (const o in e)
    Object.prototype.hasOwnProperty.call(e, o) && (e[o] === void 0 ? delete t[o] : t[o] = e[o]);
  oE(t);
}
function bC(e, t, n) {
  const o = N(e, n == null ? void 0 : n.in);
  return o.setHours(t), o;
}
function wC(e, t, n) {
  const o = N(e, n == null ? void 0 : n.in);
  return o.setMilliseconds(t), o;
}
function _C(e, t, n) {
  const o = N(e, n == null ? void 0 : n.in);
  return o.setMinutes(t), o;
}
function $C(e, t, n) {
  const o = N(e, n == null ? void 0 : n.in), r = Math.trunc(o.getMonth() / 3) + 1, i = t - r;
  return qs(o, o.getMonth() + i * 3);
}
function kC(e, t, n) {
  const o = N(e, n == null ? void 0 : n.in);
  return o.setSeconds(t), o;
}
function xC(e, t, n) {
  var c, u, l, d;
  const o = Ve(), r = (n == null ? void 0 : n.firstWeekContainsDate) ?? ((u = (c = n == null ? void 0 : n.locale) == null ? void 0 : c.options) == null ? void 0 : u.firstWeekContainsDate) ?? o.firstWeekContainsDate ?? ((d = (l = o.locale) == null ? void 0 : l.options) == null ? void 0 : d.firstWeekContainsDate) ?? 1, i = dt(
    N(e, n == null ? void 0 : n.in),
    la(e, n),
    n
  ), a = L((n == null ? void 0 : n.in) || e, 0);
  a.setFullYear(t, 0, r), a.setHours(0, 0, 0, 0);
  const s = la(a, n);
  return s.setDate(s.getDate() + i), s;
}
function o_(e, t, n) {
  const o = N(e, n == null ? void 0 : n.in);
  return isNaN(+o) ? L((n == null ? void 0 : n.in) || e, NaN) : (o.setFullYear(t), o);
}
function SC(e, t) {
  const n = N(e, t == null ? void 0 : t.in), o = n.getFullYear(), r = Math.floor(o / 10) * 10;
  return n.setFullYear(r, 0, 1), n.setHours(0, 0, 0, 0), n;
}
function DC(e) {
  return jn(Date.now(), e);
}
function OC(e) {
  const t = Te(e == null ? void 0 : e.in), n = t.getFullYear(), o = t.getMonth(), r = t.getDate(), i = L(e == null ? void 0 : e.in, 0);
  return i.setFullYear(n, o, r + 1), i.setHours(0, 0, 0, 0), i;
}
function IC(e) {
  const t = Te(e == null ? void 0 : e.in), n = t.getFullYear(), o = t.getMonth(), r = t.getDate(), i = Te(e == null ? void 0 : e.in);
  return i.setFullYear(n, o, r - 1), i.setHours(0, 0, 0, 0), i;
}
function i_(e, t, n) {
  return Lr(e, -t, n);
}
function NC(e, t, n) {
  const {
    years: o = 0,
    months: r = 0,
    weeks: i = 0,
    days: a = 0,
    hours: s = 0,
    minutes: c = 0,
    seconds: u = 0
  } = t, l = i_(e, r + o * 12, n), d = Vs(l, a + i * 7, n), f = c + s * 60, g = (u + f * 60) * 1e3;
  return L((n == null ? void 0 : n.in) || e, +d - g);
}
function EC(e, t, n) {
  return uw(e, -t, n);
}
function PC(e, t, n) {
  return lw(e, -t, n);
}
function TC(e, t, n) {
  return Ws(e, -t, n);
}
function CC(e, t, n) {
  return af(e, -t, n);
}
function MC(e, t, n) {
  return sf(e, -t, n);
}
function zC(e, t, n) {
  return hw(e, -t, n);
}
function RC(e, t, n) {
  return ui(e, -t, n);
}
function AC(e, t, n) {
  return cf(e, -t, n);
}
function UC(e) {
  return Math.trunc(e * Qb);
}
function jC(e) {
  return Math.trunc(e * ia);
}
function FC(e) {
  return Math.trunc(e * rw);
}
function WC(e) {
  return Math.trunc(e * ow);
}
const XF = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  add: nr,
  addBusinessDays: uw,
  addDays: _t,
  addHours: lw,
  addISOWeekYears: mw,
  addMilliseconds: Ws,
  addMinutes: af,
  addMonths: Lr,
  addQuarters: sf,
  addSeconds: hw,
  addWeeks: ui,
  addYears: cf,
  areIntervalsOverlapping: iE,
  clamp: aE,
  closestIndexTo: gw,
  closestTo: sE,
  compareAsc: Ut,
  compareDesc: cE,
  constructFrom: L,
  constructNow: Te,
  daysToWeeks: uE,
  differenceInBusinessDays: lE,
  differenceInCalendarDays: dt,
  differenceInCalendarISOWeekYears: pw,
  differenceInCalendarISOWeeks: dE,
  differenceInCalendarMonths: _r,
  differenceInCalendarQuarters: Zi,
  differenceInCalendarWeeks: sa,
  differenceInCalendarYears: eo,
  differenceInDays: ff,
  differenceInHours: ca,
  differenceInISOWeekYears: fE,
  differenceInMilliseconds: mf,
  differenceInMinutes: ua,
  differenceInMonths: Zs,
  differenceInQuarters: mE,
  differenceInSeconds: ir,
  differenceInWeeks: hE,
  differenceInYears: bw,
  eachDayOfInterval: ww,
  eachHourOfInterval: gE,
  eachMinuteOfInterval: pE,
  eachMonthOfInterval: _w,
  eachQuarterOfInterval: vE,
  eachWeekOfInterval: yE,
  eachWeekendOfInterval: gf,
  eachWeekendOfMonth: bE,
  eachWeekendOfYear: wE,
  eachYearOfInterval: $w,
  endOfDay: hf,
  endOfDecade: _E,
  endOfHour: $E,
  endOfISOWeek: kw,
  endOfISOWeekYear: kE,
  endOfMinute: xE,
  endOfMonth: Ls,
  endOfQuarter: SE,
  endOfSecond: DE,
  endOfToday: OE,
  endOfTomorrow: IE,
  endOfWeek: vf,
  endOfYear: pf,
  endOfYesterday: NE,
  format: Vt,
  formatDate: Vt,
  formatDistance: Nw,
  formatDistanceStrict: Ew,
  formatDistanceToNow: yP,
  formatDistanceToNowStrict: bP,
  formatDuration: _P,
  formatISO: $P,
  formatISO9075: kP,
  formatISODuration: xP,
  formatRFC3339: SP,
  formatRFC7231: IP,
  formatRelative: NP,
  formatters: cu,
  fromUnixTime: EP,
  getDate: Pw,
  getDay: Hs,
  getDayOfYear: Sw,
  getDaysInMonth: Tw,
  getDaysInYear: PP,
  getDecade: TP,
  getDefaultOptions: Mw,
  getHours: CP,
  getISODay: zw,
  getISOWeek: di,
  getISOWeekYear: pn,
  getISOWeeksInYear: MP,
  getMilliseconds: zP,
  getMinutes: RP,
  getMonth: Rw,
  getOverlappingDaysInIntervals: AP,
  getQuarter: su,
  getSeconds: UP,
  getTime: jP,
  getUnixTime: FP,
  getWeek: fi,
  getWeekOfMonth: WP,
  getWeekYear: Bs,
  getWeeksInMonth: LP,
  getYear: Uw,
  hoursToMilliseconds: ZP,
  hoursToMinutes: YP,
  hoursToSeconds: BP,
  interval: HP,
  intervalToDuration: GP,
  intlFormat: VP,
  intlFormatDistance: JP,
  isAfter: jw,
  isBefore: Fw,
  isDate: df,
  isEqual: KP,
  isExists: XP,
  isFirstDayOfMonth: QP,
  isFriday: eT,
  isFuture: tT,
  isLastDayOfMonth: yw,
  isLeapYear: Cw,
  isMatch: HT,
  isMonday: GT,
  isPast: VT,
  isSameDay: Zr,
  isSameHour: Kw,
  isSameISOWeek: Xw,
  isSameISOWeekYear: qT,
  isSameMinute: Qw,
  isSameMonth: bf,
  isSameQuarter: e_,
  isSameSecond: t_,
  isSameWeek: oo,
  isSameYear: wf,
  isSaturday: sw,
  isSunday: cw,
  isThisHour: JT,
  isThisISOWeek: KT,
  isThisMinute: XT,
  isThisMonth: QT,
  isThisQuarter: e1,
  isThisSecond: t1,
  isThisWeek: n1,
  isThisYear: r1,
  isThursday: o1,
  isToday: i1,
  isTomorrow: a1,
  isTuesday: s1,
  isValid: rn,
  isWednesday: c1,
  isWeekend: or,
  isWithinInterval: u1,
  isYesterday: l1,
  lastDayOfDecade: d1,
  lastDayOfISOWeek: f1,
  lastDayOfISOWeekYear: m1,
  lastDayOfMonth: Aw,
  lastDayOfQuarter: h1,
  lastDayOfWeek: n_,
  lastDayOfYear: g1,
  lightFormat: w1,
  lightFormatters: Nt,
  longFormatters: da,
  max: uf,
  milliseconds: $1,
  millisecondsToHours: k1,
  millisecondsToMinutes: x1,
  millisecondsToSeconds: S1,
  min: lf,
  minutesToHours: D1,
  minutesToMilliseconds: O1,
  minutesToSeconds: I1,
  monthsToQuarters: N1,
  monthsToYears: E1,
  nextDay: kn,
  nextFriday: P1,
  nextMonday: T1,
  nextSaturday: C1,
  nextSunday: M1,
  nextThursday: z1,
  nextTuesday: R1,
  nextWednesday: A1,
  parse: Jw,
  parseISO: U1,
  parseJSON: eC,
  parsers: qw,
  previousDay: xn,
  previousFriday: tC,
  previousMonday: nC,
  previousSaturday: rC,
  previousSunday: oC,
  previousThursday: iC,
  previousTuesday: aC,
  previousWednesday: sC,
  quartersToMonths: cC,
  quartersToYears: uC,
  roundToNearestHours: lC,
  roundToNearestMinutes: dC,
  secondsToHours: fC,
  secondsToMilliseconds: mC,
  secondsToMinutes: hC,
  set: gC,
  setDate: pC,
  setDay: Gs,
  setDayOfYear: vC,
  setDefaultOptions: yC,
  setHours: bC,
  setISODay: Vw,
  setISOWeek: Gw,
  setISOWeekYear: fw,
  setMilliseconds: wC,
  setMinutes: _C,
  setMonth: qs,
  setQuarter: $C,
  setSeconds: kC,
  setWeek: Hw,
  setWeekYear: xC,
  setYear: o_,
  startOfDay: jn,
  startOfDecade: SC,
  startOfHour: lu,
  startOfISOWeek: ht,
  startOfISOWeekYear: vn,
  startOfMinute: du,
  startOfMonth: li,
  startOfQuarter: Tn,
  startOfSecond: fu,
  startOfToday: DC,
  startOfTomorrow: OC,
  startOfWeek: Me,
  startOfWeekYear: la,
  startOfYear: Ys,
  startOfYesterday: IC,
  sub: NC,
  subBusinessDays: EC,
  subDays: Vs,
  subHours: PC,
  subISOWeekYears: vw,
  subMilliseconds: TC,
  subMinutes: CC,
  subMonths: i_,
  subQuarters: MC,
  subSeconds: zC,
  subWeeks: RC,
  subYears: AC,
  toDate: N,
  transpose: Ww,
  weeksToDays: UC,
  yearsToDays: jC,
  yearsToMonths: FC,
  yearsToQuarters: WC
}, Symbol.toStringTag, { value: "Module" }));
function Jr(e, t) {
  if (e.one !== void 0 && t === 1)
    return e.one;
  const n = t % 10, o = t % 100;
  return n === 1 && o !== 11 ? e.singularNominative.replace("{{count}}", String(t)) : n >= 2 && n <= 4 && (o < 10 || o > 20) ? e.singularGenitive.replace("{{count}}", String(t)) : e.pluralGenitive.replace("{{count}}", String(t));
}
function Ye(e) {
  return (t, n) => n != null && n.addSuffix ? n.comparison && n.comparison > 0 ? e.future ? Jr(e.future, t) : "через " + Jr(e.regular, t) : e.past ? Jr(e.past, t) : Jr(e.regular, t) + " назад" : Jr(e.regular, t);
}
const LC = {
  lessThanXSeconds: Ye({
    regular: {
      one: "меньше секунды",
      singularNominative: "меньше {{count}} секунды",
      singularGenitive: "меньше {{count}} секунд",
      pluralGenitive: "меньше {{count}} секунд"
    },
    future: {
      one: "меньше, чем через секунду",
      singularNominative: "меньше, чем через {{count}} секунду",
      singularGenitive: "меньше, чем через {{count}} секунды",
      pluralGenitive: "меньше, чем через {{count}} секунд"
    }
  }),
  xSeconds: Ye({
    regular: {
      singularNominative: "{{count}} секунда",
      singularGenitive: "{{count}} секунды",
      pluralGenitive: "{{count}} секунд"
    },
    past: {
      singularNominative: "{{count}} секунду назад",
      singularGenitive: "{{count}} секунды назад",
      pluralGenitive: "{{count}} секунд назад"
    },
    future: {
      singularNominative: "через {{count}} секунду",
      singularGenitive: "через {{count}} секунды",
      pluralGenitive: "через {{count}} секунд"
    }
  }),
  halfAMinute: (e, t) => t != null && t.addSuffix ? t.comparison && t.comparison > 0 ? "через полминуты" : "полминуты назад" : "полминуты",
  lessThanXMinutes: Ye({
    regular: {
      one: "меньше минуты",
      singularNominative: "меньше {{count}} минуты",
      singularGenitive: "меньше {{count}} минут",
      pluralGenitive: "меньше {{count}} минут"
    },
    future: {
      one: "меньше, чем через минуту",
      singularNominative: "меньше, чем через {{count}} минуту",
      singularGenitive: "меньше, чем через {{count}} минуты",
      pluralGenitive: "меньше, чем через {{count}} минут"
    }
  }),
  xMinutes: Ye({
    regular: {
      singularNominative: "{{count}} минута",
      singularGenitive: "{{count}} минуты",
      pluralGenitive: "{{count}} минут"
    },
    past: {
      singularNominative: "{{count}} минуту назад",
      singularGenitive: "{{count}} минуты назад",
      pluralGenitive: "{{count}} минут назад"
    },
    future: {
      singularNominative: "через {{count}} минуту",
      singularGenitive: "через {{count}} минуты",
      pluralGenitive: "через {{count}} минут"
    }
  }),
  aboutXHours: Ye({
    regular: {
      singularNominative: "около {{count}} часа",
      singularGenitive: "около {{count}} часов",
      pluralGenitive: "около {{count}} часов"
    },
    future: {
      singularNominative: "приблизительно через {{count}} час",
      singularGenitive: "приблизительно через {{count}} часа",
      pluralGenitive: "приблизительно через {{count}} часов"
    }
  }),
  xHours: Ye({
    regular: {
      singularNominative: "{{count}} час",
      singularGenitive: "{{count}} часа",
      pluralGenitive: "{{count}} часов"
    }
  }),
  xDays: Ye({
    regular: {
      singularNominative: "{{count}} день",
      singularGenitive: "{{count}} дня",
      pluralGenitive: "{{count}} дней"
    }
  }),
  aboutXWeeks: Ye({
    regular: {
      singularNominative: "около {{count}} недели",
      singularGenitive: "около {{count}} недель",
      pluralGenitive: "около {{count}} недель"
    },
    future: {
      singularNominative: "приблизительно через {{count}} неделю",
      singularGenitive: "приблизительно через {{count}} недели",
      pluralGenitive: "приблизительно через {{count}} недель"
    }
  }),
  xWeeks: Ye({
    regular: {
      singularNominative: "{{count}} неделя",
      singularGenitive: "{{count}} недели",
      pluralGenitive: "{{count}} недель"
    }
  }),
  aboutXMonths: Ye({
    regular: {
      singularNominative: "около {{count}} месяца",
      singularGenitive: "около {{count}} месяцев",
      pluralGenitive: "около {{count}} месяцев"
    },
    future: {
      singularNominative: "приблизительно через {{count}} месяц",
      singularGenitive: "приблизительно через {{count}} месяца",
      pluralGenitive: "приблизительно через {{count}} месяцев"
    }
  }),
  xMonths: Ye({
    regular: {
      singularNominative: "{{count}} месяц",
      singularGenitive: "{{count}} месяца",
      pluralGenitive: "{{count}} месяцев"
    }
  }),
  aboutXYears: Ye({
    regular: {
      singularNominative: "около {{count}} года",
      singularGenitive: "около {{count}} лет",
      pluralGenitive: "около {{count}} лет"
    },
    future: {
      singularNominative: "приблизительно через {{count}} год",
      singularGenitive: "приблизительно через {{count}} года",
      pluralGenitive: "приблизительно через {{count}} лет"
    }
  }),
  xYears: Ye({
    regular: {
      singularNominative: "{{count}} год",
      singularGenitive: "{{count}} года",
      pluralGenitive: "{{count}} лет"
    }
  }),
  overXYears: Ye({
    regular: {
      singularNominative: "больше {{count}} года",
      singularGenitive: "больше {{count}} лет",
      pluralGenitive: "больше {{count}} лет"
    },
    future: {
      singularNominative: "больше, чем через {{count}} год",
      singularGenitive: "больше, чем через {{count}} года",
      pluralGenitive: "больше, чем через {{count}} лет"
    }
  }),
  almostXYears: Ye({
    regular: {
      singularNominative: "почти {{count}} год",
      singularGenitive: "почти {{count}} года",
      pluralGenitive: "почти {{count}} лет"
    },
    future: {
      singularNominative: "почти через {{count}} год",
      singularGenitive: "почти через {{count}} года",
      pluralGenitive: "почти через {{count}} лет"
    }
  })
}, ZC = (e, t, n) => LC[e](t, n), YC = {
  full: "EEEE, d MMMM y 'г.'",
  long: "d MMMM y 'г.'",
  medium: "d MMM y 'г.'",
  short: "dd.MM.y"
}, BC = {
  full: "H:mm:ss zzzz",
  long: "H:mm:ss z",
  medium: "H:mm:ss",
  short: "H:mm"
}, HC = {
  any: "{{date}}, {{time}}"
}, GC = {
  date: ar({
    formats: YC,
    defaultWidth: "full"
  }),
  time: ar({
    formats: BC,
    defaultWidth: "full"
  }),
  dateTime: ar({
    formats: HC,
    defaultWidth: "any"
  })
}, _f = [
  "воскресенье",
  "понедельник",
  "вторник",
  "среду",
  "четверг",
  "пятницу",
  "субботу"
];
function VC(e) {
  const t = _f[e];
  switch (e) {
    case 0:
      return "'в прошлое " + t + " в' p";
    case 1:
    case 2:
    case 4:
      return "'в прошлый " + t + " в' p";
    case 3:
    case 5:
    case 6:
      return "'в прошлую " + t + " в' p";
  }
}
function ih(e) {
  const t = _f[e];
  return e === 2 ? "'во " + t + " в' p" : "'в " + t + " в' p";
}
function qC(e) {
  const t = _f[e];
  switch (e) {
    case 0:
      return "'в следующее " + t + " в' p";
    case 1:
    case 2:
    case 4:
      return "'в следующий " + t + " в' p";
    case 3:
    case 5:
    case 6:
      return "'в следующую " + t + " в' p";
  }
}
const JC = {
  lastWeek: (e, t, n) => {
    const o = e.getDay();
    return oo(e, t, n) ? ih(o) : VC(o);
  },
  yesterday: "'вчера в' p",
  today: "'сегодня в' p",
  tomorrow: "'завтра в' p",
  nextWeek: (e, t, n) => {
    const o = e.getDay();
    return oo(e, t, n) ? ih(o) : qC(o);
  },
  other: "P"
}, KC = (e, t, n, o) => {
  const r = JC[e];
  return typeof r == "function" ? r(t, n, o) : r;
}, XC = {
  narrow: ["до н.э.", "н.э."],
  abbreviated: ["до н. э.", "н. э."],
  wide: ["до нашей эры", "нашей эры"]
}, QC = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["1-й кв.", "2-й кв.", "3-й кв.", "4-й кв."],
  wide: ["1-й квартал", "2-й квартал", "3-й квартал", "4-й квартал"]
}, eM = {
  narrow: ["Я", "Ф", "М", "А", "М", "И", "И", "А", "С", "О", "Н", "Д"],
  abbreviated: [
    "янв.",
    "фев.",
    "март",
    "апр.",
    "май",
    "июнь",
    "июль",
    "авг.",
    "сент.",
    "окт.",
    "нояб.",
    "дек."
  ],
  wide: [
    "январь",
    "февраль",
    "март",
    "апрель",
    "май",
    "июнь",
    "июль",
    "август",
    "сентябрь",
    "октябрь",
    "ноябрь",
    "декабрь"
  ]
}, tM = {
  narrow: ["Я", "Ф", "М", "А", "М", "И", "И", "А", "С", "О", "Н", "Д"],
  abbreviated: [
    "янв.",
    "фев.",
    "мар.",
    "апр.",
    "мая",
    "июн.",
    "июл.",
    "авг.",
    "сент.",
    "окт.",
    "нояб.",
    "дек."
  ],
  wide: [
    "января",
    "февраля",
    "марта",
    "апреля",
    "мая",
    "июня",
    "июля",
    "августа",
    "сентября",
    "октября",
    "ноября",
    "декабря"
  ]
}, nM = {
  narrow: ["В", "П", "В", "С", "Ч", "П", "С"],
  short: ["вс", "пн", "вт", "ср", "чт", "пт", "сб"],
  abbreviated: ["вск", "пнд", "втр", "срд", "чтв", "птн", "суб"],
  wide: [
    "воскресенье",
    "понедельник",
    "вторник",
    "среда",
    "четверг",
    "пятница",
    "суббота"
  ]
}, rM = {
  narrow: {
    am: "ДП",
    pm: "ПП",
    midnight: "полн.",
    noon: "полд.",
    morning: "утро",
    afternoon: "день",
    evening: "веч.",
    night: "ночь"
  },
  abbreviated: {
    am: "ДП",
    pm: "ПП",
    midnight: "полн.",
    noon: "полд.",
    morning: "утро",
    afternoon: "день",
    evening: "веч.",
    night: "ночь"
  },
  wide: {
    am: "ДП",
    pm: "ПП",
    midnight: "полночь",
    noon: "полдень",
    morning: "утро",
    afternoon: "день",
    evening: "вечер",
    night: "ночь"
  }
}, oM = {
  narrow: {
    am: "ДП",
    pm: "ПП",
    midnight: "полн.",
    noon: "полд.",
    morning: "утра",
    afternoon: "дня",
    evening: "веч.",
    night: "ночи"
  },
  abbreviated: {
    am: "ДП",
    pm: "ПП",
    midnight: "полн.",
    noon: "полд.",
    morning: "утра",
    afternoon: "дня",
    evening: "веч.",
    night: "ночи"
  },
  wide: {
    am: "ДП",
    pm: "ПП",
    midnight: "полночь",
    noon: "полдень",
    morning: "утра",
    afternoon: "дня",
    evening: "вечера",
    night: "ночи"
  }
}, iM = (e, t) => {
  const n = Number(e), o = t == null ? void 0 : t.unit;
  let r;
  return o === "date" ? r = "-е" : o === "week" || o === "minute" || o === "second" ? r = "-я" : r = "-й", n + r;
}, aM = {
  ordinalNumber: iM,
  era: Pt({
    values: XC,
    defaultWidth: "wide"
  }),
  quarter: Pt({
    values: QC,
    defaultWidth: "wide",
    argumentCallback: (e) => e - 1
  }),
  month: Pt({
    values: eM,
    defaultWidth: "wide",
    formattingValues: tM,
    defaultFormattingWidth: "wide"
  }),
  day: Pt({
    values: nM,
    defaultWidth: "wide"
  }),
  dayPeriod: Pt({
    values: rM,
    defaultWidth: "any",
    formattingValues: oM,
    defaultFormattingWidth: "wide"
  })
}, sM = /^(\d+)(-?(е|я|й|ое|ье|ая|ья|ый|ой|ий|ый))?/i, cM = /\d+/i, uM = {
  narrow: /^((до )?н\.?\s?э\.?)/i,
  abbreviated: /^((до )?н\.?\s?э\.?)/i,
  wide: /^(до нашей эры|нашей эры|наша эра)/i
}, lM = {
  any: [/^д/i, /^н/i]
}, dM = {
  narrow: /^[1234]/i,
  abbreviated: /^[1234](-?[ыои]?й?)? кв.?/i,
  wide: /^[1234](-?[ыои]?й?)? квартал/i
}, fM = {
  any: [/1/i, /2/i, /3/i, /4/i]
}, mM = {
  narrow: /^[яфмаисонд]/i,
  abbreviated: /^(янв|фев|март?|апр|ма[йя]|июн[ья]?|июл[ья]?|авг|сент?|окт|нояб?|дек)\.?/i,
  wide: /^(январ[ья]|феврал[ья]|марта?|апрел[ья]|ма[йя]|июн[ья]|июл[ья]|августа?|сентябр[ья]|октябр[ья]|октябр[ья]|ноябр[ья]|декабр[ья])/i
}, hM = {
  narrow: [
    /^я/i,
    /^ф/i,
    /^м/i,
    /^а/i,
    /^м/i,
    /^и/i,
    /^и/i,
    /^а/i,
    /^с/i,
    /^о/i,
    /^н/i,
    /^я/i
  ],
  any: [
    /^я/i,
    /^ф/i,
    /^мар/i,
    /^ап/i,
    /^ма[йя]/i,
    /^июн/i,
    /^июл/i,
    /^ав/i,
    /^с/i,
    /^о/i,
    /^н/i,
    /^д/i
  ]
}, gM = {
  narrow: /^[впсч]/i,
  short: /^(вс|во|пн|по|вт|ср|чт|че|пт|пя|сб|су)\.?/i,
  abbreviated: /^(вск|вос|пнд|пон|втр|вто|срд|сре|чтв|чет|птн|пят|суб).?/i,
  wide: /^(воскресень[ея]|понедельника?|вторника?|сред[аы]|четверга?|пятниц[аы]|суббот[аы])/i
}, pM = {
  narrow: [/^в/i, /^п/i, /^в/i, /^с/i, /^ч/i, /^п/i, /^с/i],
  any: [/^в[ос]/i, /^п[он]/i, /^в/i, /^ср/i, /^ч/i, /^п[ят]/i, /^с[уб]/i]
}, vM = {
  narrow: /^([дп]п|полн\.?|полд\.?|утр[оа]|день|дня|веч\.?|ноч[ьи])/i,
  abbreviated: /^([дп]п|полн\.?|полд\.?|утр[оа]|день|дня|веч\.?|ноч[ьи])/i,
  wide: /^([дп]п|полночь|полдень|утр[оа]|день|дня|вечера?|ноч[ьи])/i
}, yM = {
  any: {
    am: /^дп/i,
    pm: /^пп/i,
    midnight: /^полн/i,
    noon: /^полд/i,
    morning: /^у/i,
    afternoon: /^д[ен]/i,
    evening: /^в/i,
    night: /^н/i
  }
}, bM = {
  ordinalNumber: xw({
    matchPattern: sM,
    parsePattern: cM,
    valueCallback: (e) => parseInt(e, 10)
  }),
  era: Tt({
    matchPatterns: uM,
    defaultMatchWidth: "wide",
    parsePatterns: lM,
    defaultParseWidth: "any"
  }),
  quarter: Tt({
    matchPatterns: dM,
    defaultMatchWidth: "wide",
    parsePatterns: fM,
    defaultParseWidth: "any",
    valueCallback: (e) => e + 1
  }),
  month: Tt({
    matchPatterns: mM,
    defaultMatchWidth: "wide",
    parsePatterns: hM,
    defaultParseWidth: "any"
  }),
  day: Tt({
    matchPatterns: gM,
    defaultMatchWidth: "wide",
    parsePatterns: pM,
    defaultParseWidth: "any"
  }),
  dayPeriod: Tt({
    matchPatterns: vM,
    defaultMatchWidth: "wide",
    parsePatterns: yM,
    defaultParseWidth: "any"
  })
}, wM = {
  code: "ru",
  formatDistance: ZC,
  formatLong: GC,
  formatRelative: KC,
  localize: aM,
  match: bM,
  options: {
    weekStartsOn: 1,
    firstWeekContainsDate: 1
  }
};
function z(...e) {
  return Ng(Iu(e));
}
function QF(e) {
  return (typeof e == "string" ? new Date(e) : e).toISOString().replace(/\.\d{3}Z$/, "+00:00");
}
const _M = {
  en: rt,
  ru: wM
};
function $M(e, t = "en", n = "PPP") {
  const o = typeof e == "string" || typeof e == "number" ? new Date(e) : e;
  return isNaN(o.getTime()) ? typeof e == "string" ? e : "" : Vt(o, n, { locale: _M[t] || rt });
}
function e2(e, t = "en") {
  return $M(e, t, "PPP p");
}
function t2(e, t) {
  if (!e.trim())
    return null;
  const n = e.split(/[./-]/);
  if (n.length !== 3)
    return null;
  let o, r, i;
  if (t === "dd.mm.yyyy" ? (o = parseInt(n[0], 10), r = parseInt(n[1], 10), i = parseInt(n[2], 10)) : (r = parseInt(n[0], 10), o = parseInt(n[1], 10), i = parseInt(n[2], 10)), isNaN(o) || isNaN(r) || isNaN(i) || r < 1 || r > 12 || o < 1 || o > 31 || i < 1e3 || i > 9999)
    return null;
  const a = `${i}-${String(r).padStart(2, "0")}-${String(o).padStart(2, "0")}`, s = new Date(a);
  return isNaN(s.getTime()) ? null : a;
}
const mu = js(
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
), a_ = m.forwardRef(
  ({ className: e, variant: t, size: n, asChild: o = !1, ...r }, i) => /* @__PURE__ */ y(o ? Xb : "button", { className: z(mu({ variant: t, size: n, className: e })), ref: i, ...r })
);
a_.displayName = "Button";
const kM = m.forwardRef(
  ({ className: e, type: t, ...n }, o) => /* @__PURE__ */ y(
    "input",
    {
      type: t,
      className: z(
        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        e
      ),
      ref: o,
      ...n
    }
  )
);
kM.displayName = "Input";
var xM = [
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
], SM = xM.reduce((e, t) => {
  const n = /* @__PURE__ */ Kb(`Primitive.${t}`), o = m.forwardRef((r, i) => {
    const { asChild: a, ...s } = r, c = a ? n : t;
    return typeof window < "u" && (window[Symbol.for("radix-ui")] = !0), /* @__PURE__ */ y(c, { ...s, ref: i });
  });
  return o.displayName = `Primitive.${t}`, { ...e, [t]: o };
}, {}), DM = "Label", s_ = m.forwardRef((e, t) => /* @__PURE__ */ y(
  SM.label,
  {
    ...e,
    ref: t,
    onMouseDown: (n) => {
      var r;
      n.target.closest("button, input, select, textarea") || ((r = e.onMouseDown) == null || r.call(e, n), !n.defaultPrevented && n.detail > 1 && n.preventDefault());
    }
  }
));
s_.displayName = DM;
var c_ = s_;
const OM = js(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
), u_ = m.forwardRef(({ className: e, ...t }, n) => /* @__PURE__ */ y(c_, { ref: n, className: z(OM(), e), ...t }));
u_.displayName = c_.displayName;
const n2 = oS, l_ = m.createContext(null), r2 = ({
  ...e
}) => /* @__PURE__ */ y(l_.Provider, { value: { name: e.name }, children: /* @__PURE__ */ y(iS, { ...e }) }), Js = () => {
  const e = m.useContext(l_), t = m.useContext(d_), { getFieldState: n, formState: o } = aS();
  if (!e)
    throw new Error("useFormField should be used within <FormField>");
  if (!t)
    throw new Error("useFormField should be used within <FormItem>");
  const r = n(e.name, o), { id: i } = t;
  return {
    id: i,
    name: e.name,
    formItemId: `${i}-form-item`,
    formDescriptionId: `${i}-form-item-description`,
    formMessageId: `${i}-form-item-message`,
    ...r
  };
}, d_ = m.createContext(null), IM = m.forwardRef(
  ({ className: e, ...t }, n) => {
    const o = m.useId();
    return /* @__PURE__ */ y(d_.Provider, { value: { id: o }, children: /* @__PURE__ */ y("div", { ref: n, className: z("space-y-2", e), ...t }) });
  }
);
IM.displayName = "FormItem";
const NM = m.forwardRef(({ className: e, ...t }, n) => {
  const { error: o, formItemId: r } = Js();
  return /* @__PURE__ */ y(
    u_,
    {
      ref: n,
      className: z(o && "text-destructive", e),
      htmlFor: r,
      ...t
    }
  );
});
NM.displayName = "FormLabel";
const EM = m.forwardRef(({ ...e }, t) => {
  const { error: n, formItemId: o, formDescriptionId: r, formMessageId: i } = Js();
  return /* @__PURE__ */ y(
    Xb,
    {
      ref: t,
      id: o,
      "aria-describedby": n ? `${r} ${i}` : `${r}`,
      "aria-invalid": !!n,
      ...e
    }
  );
});
EM.displayName = "FormControl";
const PM = m.forwardRef(({ className: e, ...t }, n) => {
  const { formDescriptionId: o } = Js();
  return /* @__PURE__ */ y(
    "p",
    {
      ref: n,
      id: o,
      className: z("text-[0.8rem] text-muted-foreground", e),
      ...t
    }
  );
});
PM.displayName = "FormDescription";
const TM = m.forwardRef(({ className: e, children: t, ...n }, o) => {
  const { error: r, formMessageId: i } = Js(), a = r ? String((r == null ? void 0 : r.message) ?? "") : t;
  return a ? /* @__PURE__ */ y(
    "p",
    {
      ref: o,
      id: i,
      className: z("text-[0.8rem] font-medium text-destructive", e),
      ...n,
      children: a
    }
  ) : null;
});
TM.displayName = "FormMessage";
const CM = m.forwardRef(
  ({ className: e, ...t }, n) => /* @__PURE__ */ y(
    "textarea",
    {
      className: z(
        "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        e
      ),
      ref: n,
      ...t
    }
  )
);
CM.displayName = "Textarea";
function Y(e, t, { checkForDefaultPrevented: n = !0 } = {}) {
  return function(r) {
    if (e == null || e(r), n === !1 || !r.defaultPrevented)
      return t == null ? void 0 : t(r);
  };
}
function MM(e, t) {
  const n = m.createContext(t), o = (i) => {
    const { children: a, ...s } = i, c = m.useMemo(() => s, Object.values(s));
    return /* @__PURE__ */ y(n.Provider, { value: c, children: a });
  };
  o.displayName = e + "Provider";
  function r(i) {
    const a = m.useContext(n);
    if (a)
      return a;
    if (t !== void 0)
      return t;
    throw new Error(`\`${i}\` must be used within \`${e}\``);
  }
  return [o, r];
}
function St(e, t = []) {
  let n = [];
  function o(i, a) {
    const s = m.createContext(a), c = n.length;
    n = [...n, a];
    const u = (d) => {
      var b;
      const { scope: f, children: h, ...g } = d, p = ((b = f == null ? void 0 : f[e]) == null ? void 0 : b[c]) || s, v = m.useMemo(() => g, Object.values(g));
      return /* @__PURE__ */ y(p.Provider, { value: v, children: h });
    };
    u.displayName = i + "Provider";
    function l(d, f) {
      var p;
      const h = ((p = f == null ? void 0 : f[e]) == null ? void 0 : p[c]) || s, g = m.useContext(h);
      if (g)
        return g;
      if (a !== void 0)
        return a;
      throw new Error(`\`${d}\` must be used within \`${i}\``);
    }
    return [u, l];
  }
  const r = () => {
    const i = n.map((a) => m.createContext(a));
    return function(s) {
      const c = (s == null ? void 0 : s[e]) || i;
      return m.useMemo(
        () => ({ [`__scope${e}`]: { ...s, [e]: c } }),
        [s, c]
      );
    };
  };
  return r.scopeName = e, [o, zM(r, ...t)];
}
function zM(...e) {
  const t = e[0];
  if (e.length === 1)
    return t;
  const n = () => {
    const o = e.map((r) => ({
      useScope: r(),
      scopeName: r.scopeName
    }));
    return function(i) {
      const a = o.reduce((s, { useScope: c, scopeName: u }) => {
        const d = c(i)[`__scope${u}`];
        return { ...s, ...d };
      }, {});
      return m.useMemo(() => ({ [`__scope${t.scopeName}`]: a }), [a]);
    };
  };
  return n.scopeName = t.scopeName, n;
}
var on = globalThis != null && globalThis.document ? m.useLayoutEffect : () => {
}, RM = m[" useId ".trim().toString()] || (() => {
}), AM = 0;
function Kt(e) {
  const [t, n] = m.useState(RM());
  return on(() => {
    e || n((o) => o ?? String(AM++));
  }, [e]), e || (t ? `radix-${t}` : "");
}
var UM = m[" useInsertionEffect ".trim().toString()] || on;
function Hn({
  prop: e,
  defaultProp: t,
  onChange: n = () => {
  },
  caller: o
}) {
  const [r, i, a] = jM({
    defaultProp: t,
    onChange: n
  }), s = e !== void 0, c = s ? e : r;
  {
    const l = m.useRef(e !== void 0);
    m.useEffect(() => {
      const d = l.current;
      d !== s && console.warn(
        `${o} is changing from ${d ? "controlled" : "uncontrolled"} to ${s ? "controlled" : "uncontrolled"}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`
      ), l.current = s;
    }, [s, o]);
  }
  const u = m.useCallback(
    (l) => {
      var d;
      if (s) {
        const f = FM(l) ? l(e) : l;
        f !== e && ((d = a.current) == null || d.call(a, f));
      } else
        i(l);
    },
    [s, e, i, a]
  );
  return [c, u];
}
function jM({
  defaultProp: e,
  onChange: t
}) {
  const [n, o] = m.useState(e), r = m.useRef(n), i = m.useRef(t);
  return UM(() => {
    i.current = t;
  }, [t]), m.useEffect(() => {
    var a;
    r.current !== n && ((a = i.current) == null || a.call(i, n), r.current = n);
  }, [n, r]), [n, o, i];
}
function FM(e) {
  return typeof e == "function";
}
// @__NO_SIDE_EFFECTS__
function WM(e) {
  const t = /* @__PURE__ */ LM(e), n = m.forwardRef((o, r) => {
    const { children: i, ...a } = o, s = m.Children.toArray(i), c = s.find(YM);
    if (c) {
      const u = c.props.children, l = s.map((d) => d === c ? m.Children.count(u) > 1 ? m.Children.only(null) : m.isValidElement(u) ? u.props.children : null : d);
      return /* @__PURE__ */ y(t, { ...a, ref: r, children: m.isValidElement(u) ? m.cloneElement(u, void 0, l) : null });
    }
    return /* @__PURE__ */ y(t, { ...a, ref: r, children: i });
  });
  return n.displayName = `${e}.Slot`, n;
}
// @__NO_SIDE_EFFECTS__
function LM(e) {
  const t = m.forwardRef((n, o) => {
    const { children: r, ...i } = n;
    if (m.isValidElement(r)) {
      const a = HM(r), s = BM(i, r.props);
      return r.type !== m.Fragment && (s.ref = o ? cn(o, a) : a), m.cloneElement(r, s);
    }
    return m.Children.count(r) > 1 ? m.Children.only(null) : null;
  });
  return t.displayName = `${e}.SlotClone`, t;
}
var ZM = Symbol("radix.slottable");
function YM(e) {
  return m.isValidElement(e) && typeof e.type == "function" && "__radixId" in e.type && e.type.__radixId === ZM;
}
function BM(e, t) {
  const n = { ...t };
  for (const o in t) {
    const r = e[o], i = t[o];
    /^on[A-Z]/.test(o) ? r && i ? n[o] = (...s) => {
      const c = i(...s);
      return r(...s), c;
    } : r && (n[o] = r) : o === "style" ? n[o] = { ...r, ...i } : o === "className" && (n[o] = [r, i].filter(Boolean).join(" "));
  }
  return { ...e, ...n };
}
function HM(e) {
  var o, r;
  let t = (o = Object.getOwnPropertyDescriptor(e.props, "ref")) == null ? void 0 : o.get, n = t && "isReactWarning" in t && t.isReactWarning;
  return n ? e.ref : (t = (r = Object.getOwnPropertyDescriptor(e, "ref")) == null ? void 0 : r.get, n = t && "isReactWarning" in t && t.isReactWarning, n ? e.props.ref : e.props.ref || e.ref);
}
var GM = [
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
], de = GM.reduce((e, t) => {
  const n = /* @__PURE__ */ WM(`Primitive.${t}`), o = m.forwardRef((r, i) => {
    const { asChild: a, ...s } = r, c = a ? n : t;
    return typeof window < "u" && (window[Symbol.for("radix-ui")] = !0), /* @__PURE__ */ y(c, { ...s, ref: i });
  });
  return o.displayName = `Primitive.${t}`, { ...e, [t]: o };
}, {});
function f_(e, t) {
  e && Yh.flushSync(() => e.dispatchEvent(t));
}
function Ae(e) {
  const t = m.useRef(e);
  return m.useEffect(() => {
    t.current = e;
  }), m.useMemo(() => (...n) => {
    var o;
    return (o = t.current) == null ? void 0 : o.call(t, ...n);
  }, []);
}
function VM(e, t = globalThis == null ? void 0 : globalThis.document) {
  const n = Ae(e);
  m.useEffect(() => {
    const o = (r) => {
      r.key === "Escape" && n(r);
    };
    return t.addEventListener("keydown", o, { capture: !0 }), () => t.removeEventListener("keydown", o, { capture: !0 });
  }, [n, t]);
}
var qM = "DismissableLayer", hu = "dismissableLayer.update", JM = "dismissableLayer.pointerDownOutside", KM = "dismissableLayer.focusOutside", ah, m_ = m.createContext({
  layers: /* @__PURE__ */ new Set(),
  layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
  branches: /* @__PURE__ */ new Set()
}), Ks = m.forwardRef(
  (e, t) => {
    const {
      disableOutsidePointerEvents: n = !1,
      onEscapeKeyDown: o,
      onPointerDownOutside: r,
      onFocusOutside: i,
      onInteractOutside: a,
      onDismiss: s,
      ...c
    } = e, u = m.useContext(m_), [l, d] = m.useState(null), f = (l == null ? void 0 : l.ownerDocument) ?? (globalThis == null ? void 0 : globalThis.document), [, h] = m.useState({}), g = ye(t, (I) => d(I)), p = Array.from(u.layers), [v] = [...u.layersWithOutsidePointerEventsDisabled].slice(-1), b = p.indexOf(v), _ = l ? p.indexOf(l) : -1, $ = u.layersWithOutsidePointerEventsDisabled.size > 0, x = _ >= b, S = ez((I) => {
      const D = I.target, P = [...u.branches].some((M) => M.contains(D));
      !x || P || (r == null || r(I), a == null || a(I), I.defaultPrevented || s == null || s());
    }, f), w = tz((I) => {
      const D = I.target;
      [...u.branches].some((M) => M.contains(D)) || (i == null || i(I), a == null || a(I), I.defaultPrevented || s == null || s());
    }, f);
    return VM((I) => {
      _ === u.layers.size - 1 && (o == null || o(I), !I.defaultPrevented && s && (I.preventDefault(), s()));
    }, f), m.useEffect(() => {
      if (l)
        return n && (u.layersWithOutsidePointerEventsDisabled.size === 0 && (ah = f.body.style.pointerEvents, f.body.style.pointerEvents = "none"), u.layersWithOutsidePointerEventsDisabled.add(l)), u.layers.add(l), sh(), () => {
          n && u.layersWithOutsidePointerEventsDisabled.size === 1 && (f.body.style.pointerEvents = ah);
        };
    }, [l, f, n, u]), m.useEffect(() => () => {
      l && (u.layers.delete(l), u.layersWithOutsidePointerEventsDisabled.delete(l), sh());
    }, [l, u]), m.useEffect(() => {
      const I = () => h({});
      return document.addEventListener(hu, I), () => document.removeEventListener(hu, I);
    }, []), /* @__PURE__ */ y(
      de.div,
      {
        ...c,
        ref: g,
        style: {
          pointerEvents: $ ? x ? "auto" : "none" : void 0,
          ...e.style
        },
        onFocusCapture: Y(e.onFocusCapture, w.onFocusCapture),
        onBlurCapture: Y(e.onBlurCapture, w.onBlurCapture),
        onPointerDownCapture: Y(
          e.onPointerDownCapture,
          S.onPointerDownCapture
        )
      }
    );
  }
);
Ks.displayName = qM;
var XM = "DismissableLayerBranch", QM = m.forwardRef((e, t) => {
  const n = m.useContext(m_), o = m.useRef(null), r = ye(t, o);
  return m.useEffect(() => {
    const i = o.current;
    if (i)
      return n.branches.add(i), () => {
        n.branches.delete(i);
      };
  }, [n.branches]), /* @__PURE__ */ y(de.div, { ...e, ref: r });
});
QM.displayName = XM;
function ez(e, t = globalThis == null ? void 0 : globalThis.document) {
  const n = Ae(e), o = m.useRef(!1), r = m.useRef(() => {
  });
  return m.useEffect(() => {
    const i = (s) => {
      if (s.target && !o.current) {
        let c = function() {
          h_(
            JM,
            n,
            u,
            { discrete: !0 }
          );
        };
        const u = { originalEvent: s };
        s.pointerType === "touch" ? (t.removeEventListener("click", r.current), r.current = c, t.addEventListener("click", r.current, { once: !0 })) : c();
      } else
        t.removeEventListener("click", r.current);
      o.current = !1;
    }, a = window.setTimeout(() => {
      t.addEventListener("pointerdown", i);
    }, 0);
    return () => {
      window.clearTimeout(a), t.removeEventListener("pointerdown", i), t.removeEventListener("click", r.current);
    };
  }, [t, n]), {
    // ensures we check React component tree (not just DOM tree)
    onPointerDownCapture: () => o.current = !0
  };
}
function tz(e, t = globalThis == null ? void 0 : globalThis.document) {
  const n = Ae(e), o = m.useRef(!1);
  return m.useEffect(() => {
    const r = (i) => {
      i.target && !o.current && h_(KM, n, { originalEvent: i }, {
        discrete: !1
      });
    };
    return t.addEventListener("focusin", r), () => t.removeEventListener("focusin", r);
  }, [t, n]), {
    onFocusCapture: () => o.current = !0,
    onBlurCapture: () => o.current = !1
  };
}
function sh() {
  const e = new CustomEvent(hu);
  document.dispatchEvent(e);
}
function h_(e, t, n, { discrete: o }) {
  const r = n.originalEvent.target, i = new CustomEvent(e, { bubbles: !1, cancelable: !0, detail: n });
  t && r.addEventListener(e, t, { once: !0 }), o ? f_(r, i) : r.dispatchEvent(i);
}
var Rc = "focusScope.autoFocusOnMount", Ac = "focusScope.autoFocusOnUnmount", ch = { bubbles: !1, cancelable: !0 }, nz = "FocusScope", Xs = m.forwardRef((e, t) => {
  const {
    loop: n = !1,
    trapped: o = !1,
    onMountAutoFocus: r,
    onUnmountAutoFocus: i,
    ...a
  } = e, [s, c] = m.useState(null), u = Ae(r), l = Ae(i), d = m.useRef(null), f = ye(t, (p) => c(p)), h = m.useRef({
    paused: !1,
    pause() {
      this.paused = !0;
    },
    resume() {
      this.paused = !1;
    }
  }).current;
  m.useEffect(() => {
    if (o) {
      let p = function($) {
        if (h.paused || !s)
          return;
        const x = $.target;
        s.contains(x) ? d.current = x : fn(d.current, { select: !0 });
      }, v = function($) {
        if (h.paused || !s)
          return;
        const x = $.relatedTarget;
        x !== null && (s.contains(x) || fn(d.current, { select: !0 }));
      }, b = function($) {
        if (document.activeElement === document.body)
          for (const S of $)
            S.removedNodes.length > 0 && fn(s);
      };
      document.addEventListener("focusin", p), document.addEventListener("focusout", v);
      const _ = new MutationObserver(b);
      return s && _.observe(s, { childList: !0, subtree: !0 }), () => {
        document.removeEventListener("focusin", p), document.removeEventListener("focusout", v), _.disconnect();
      };
    }
  }, [o, s, h.paused]), m.useEffect(() => {
    if (s) {
      lh.add(h);
      const p = document.activeElement;
      if (!s.contains(p)) {
        const b = new CustomEvent(Rc, ch);
        s.addEventListener(Rc, u), s.dispatchEvent(b), b.defaultPrevented || (rz(cz(g_(s)), { select: !0 }), document.activeElement === p && fn(s));
      }
      return () => {
        s.removeEventListener(Rc, u), setTimeout(() => {
          const b = new CustomEvent(Ac, ch);
          s.addEventListener(Ac, l), s.dispatchEvent(b), b.defaultPrevented || fn(p ?? document.body, { select: !0 }), s.removeEventListener(Ac, l), lh.remove(h);
        }, 0);
      };
    }
  }, [s, u, l, h]);
  const g = m.useCallback(
    (p) => {
      if (!n && !o || h.paused)
        return;
      const v = p.key === "Tab" && !p.altKey && !p.ctrlKey && !p.metaKey, b = document.activeElement;
      if (v && b) {
        const _ = p.currentTarget, [$, x] = oz(_);
        $ && x ? !p.shiftKey && b === x ? (p.preventDefault(), n && fn($, { select: !0 })) : p.shiftKey && b === $ && (p.preventDefault(), n && fn(x, { select: !0 })) : b === _ && p.preventDefault();
      }
    },
    [n, o, h.paused]
  );
  return /* @__PURE__ */ y(de.div, { tabIndex: -1, ...a, ref: f, onKeyDown: g });
});
Xs.displayName = nz;
function rz(e, { select: t = !1 } = {}) {
  const n = document.activeElement;
  for (const o of e)
    if (fn(o, { select: t }), document.activeElement !== n)
      return;
}
function oz(e) {
  const t = g_(e), n = uh(t, e), o = uh(t.reverse(), e);
  return [n, o];
}
function g_(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_ELEMENT, {
    acceptNode: (o) => {
      const r = o.tagName === "INPUT" && o.type === "hidden";
      return o.disabled || o.hidden || r ? NodeFilter.FILTER_SKIP : o.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    }
  });
  for (; n.nextNode(); )
    t.push(n.currentNode);
  return t;
}
function uh(e, t) {
  for (const n of e)
    if (!iz(n, { upTo: t }))
      return n;
}
function iz(e, { upTo: t }) {
  if (getComputedStyle(e).visibility === "hidden")
    return !0;
  for (; e; ) {
    if (t !== void 0 && e === t)
      return !1;
    if (getComputedStyle(e).display === "none")
      return !0;
    e = e.parentElement;
  }
  return !1;
}
function az(e) {
  return e instanceof HTMLInputElement && "select" in e;
}
function fn(e, { select: t = !1 } = {}) {
  if (e && e.focus) {
    const n = document.activeElement;
    e.focus({ preventScroll: !0 }), e !== n && az(e) && t && e.select();
  }
}
var lh = sz();
function sz() {
  let e = [];
  return {
    add(t) {
      const n = e[0];
      t !== n && (n == null || n.pause()), e = dh(e, t), e.unshift(t);
    },
    remove(t) {
      var n;
      e = dh(e, t), (n = e[0]) == null || n.resume();
    }
  };
}
function dh(e, t) {
  const n = [...e], o = n.indexOf(t);
  return o !== -1 && n.splice(o, 1), n;
}
function cz(e) {
  return e.filter((t) => t.tagName !== "A");
}
var uz = "Portal", Qs = m.forwardRef((e, t) => {
  var s;
  const { container: n, ...o } = e, [r, i] = m.useState(!1);
  on(() => i(!0), []);
  const a = n || r && ((s = globalThis == null ? void 0 : globalThis.document) == null ? void 0 : s.body);
  return a ? lS.createPortal(/* @__PURE__ */ y(de.div, { ...o, ref: t }), a) : null;
});
Qs.displayName = uz;
function lz(e, t) {
  return m.useReducer((n, o) => t[n][o] ?? n, e);
}
var We = (e) => {
  const { present: t, children: n } = e, o = dz(t), r = typeof n == "function" ? n({ present: o.isPresent }) : m.Children.only(n), i = ye(o.ref, fz(r));
  return typeof n == "function" || o.isPresent ? m.cloneElement(r, { ref: i }) : null;
};
We.displayName = "Presence";
function dz(e) {
  const [t, n] = m.useState(), o = m.useRef(null), r = m.useRef(e), i = m.useRef("none"), a = e ? "mounted" : "unmounted", [s, c] = lz(a, {
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
  return m.useEffect(() => {
    const u = Pi(o.current);
    i.current = s === "mounted" ? u : "none";
  }, [s]), on(() => {
    const u = o.current, l = r.current;
    if (l !== e) {
      const f = i.current, h = Pi(u);
      e ? c("MOUNT") : h === "none" || (u == null ? void 0 : u.display) === "none" ? c("UNMOUNT") : c(l && f !== h ? "ANIMATION_OUT" : "UNMOUNT"), r.current = e;
    }
  }, [e, c]), on(() => {
    if (t) {
      let u;
      const l = t.ownerDocument.defaultView ?? window, d = (h) => {
        const p = Pi(o.current).includes(CSS.escape(h.animationName));
        if (h.target === t && p && (c("ANIMATION_END"), !r.current)) {
          const v = t.style.animationFillMode;
          t.style.animationFillMode = "forwards", u = l.setTimeout(() => {
            t.style.animationFillMode === "forwards" && (t.style.animationFillMode = v);
          });
        }
      }, f = (h) => {
        h.target === t && (i.current = Pi(o.current));
      };
      return t.addEventListener("animationstart", f), t.addEventListener("animationcancel", d), t.addEventListener("animationend", d), () => {
        l.clearTimeout(u), t.removeEventListener("animationstart", f), t.removeEventListener("animationcancel", d), t.removeEventListener("animationend", d);
      };
    } else
      c("ANIMATION_END");
  }, [t, c]), {
    isPresent: ["mounted", "unmountSuspended"].includes(s),
    ref: m.useCallback((u) => {
      o.current = u ? getComputedStyle(u) : null, n(u);
    }, [])
  };
}
function Pi(e) {
  return (e == null ? void 0 : e.animationName) || "none";
}
function fz(e) {
  var o, r;
  let t = (o = Object.getOwnPropertyDescriptor(e.props, "ref")) == null ? void 0 : o.get, n = t && "isReactWarning" in t && t.isReactWarning;
  return n ? e.ref : (t = (r = Object.getOwnPropertyDescriptor(e, "ref")) == null ? void 0 : r.get, n = t && "isReactWarning" in t && t.isReactWarning, n ? e.props.ref : e.props.ref || e.ref);
}
var Uc = 0;
function $f() {
  m.useEffect(() => {
    const e = document.querySelectorAll("[data-radix-focus-guard]");
    return document.body.insertAdjacentElement("afterbegin", e[0] ?? fh()), document.body.insertAdjacentElement("beforeend", e[1] ?? fh()), Uc++, () => {
      Uc === 1 && document.querySelectorAll("[data-radix-focus-guard]").forEach((t) => t.remove()), Uc--;
    };
  }, []);
}
function fh() {
  const e = document.createElement("span");
  return e.setAttribute("data-radix-focus-guard", ""), e.tabIndex = 0, e.style.outline = "none", e.style.opacity = "0", e.style.position = "fixed", e.style.pointerEvents = "none", e;
}
var zt = function() {
  return zt = Object.assign || function(t) {
    for (var n, o = 1, r = arguments.length; o < r; o++) {
      n = arguments[o];
      for (var i in n)
        Object.prototype.hasOwnProperty.call(n, i) && (t[i] = n[i]);
    }
    return t;
  }, zt.apply(this, arguments);
};
function p_(e, t) {
  var n = {};
  for (var o in e)
    Object.prototype.hasOwnProperty.call(e, o) && t.indexOf(o) < 0 && (n[o] = e[o]);
  if (e != null && typeof Object.getOwnPropertySymbols == "function")
    for (var r = 0, o = Object.getOwnPropertySymbols(e); r < o.length; r++)
      t.indexOf(o[r]) < 0 && Object.prototype.propertyIsEnumerable.call(e, o[r]) && (n[o[r]] = e[o[r]]);
  return n;
}
function mz(e, t, n) {
  if (n || arguments.length === 2)
    for (var o = 0, r = t.length, i; o < r; o++)
      (i || !(o in t)) && (i || (i = Array.prototype.slice.call(t, 0, o)), i[o] = t[o]);
  return e.concat(i || Array.prototype.slice.call(t));
}
var Yi = "right-scroll-bar-position", Bi = "width-before-scroll-bar", hz = "with-scroll-bars-hidden", gz = "--removed-body-scroll-bar-size";
function jc(e, t) {
  return typeof e == "function" ? e(t) : e && (e.current = t), e;
}
function pz(e, t) {
  var n = Vi(function() {
    return {
      // value
      value: e,
      // last callback
      callback: t,
      // "memoized" public interface
      facade: {
        get current() {
          return n.value;
        },
        set current(o) {
          var r = n.value;
          r !== o && (n.value = o, n.callback(o, r));
        }
      }
    };
  })[0];
  return n.callback = t, n.facade;
}
var vz = typeof window < "u" ? m.useLayoutEffect : m.useEffect, mh = /* @__PURE__ */ new WeakMap();
function yz(e, t) {
  var n = pz(t || null, function(o) {
    return e.forEach(function(r) {
      return jc(r, o);
    });
  });
  return vz(function() {
    var o = mh.get(n);
    if (o) {
      var r = new Set(o), i = new Set(e), a = n.current;
      r.forEach(function(s) {
        i.has(s) || jc(s, null);
      }), i.forEach(function(s) {
        r.has(s) || jc(s, a);
      });
    }
    mh.set(n, e);
  }, [e]), n;
}
function bz(e) {
  return e;
}
function wz(e, t) {
  t === void 0 && (t = bz);
  var n = [], o = !1, r = {
    read: function() {
      if (o)
        throw new Error("Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.");
      return n.length ? n[n.length - 1] : e;
    },
    useMedium: function(i) {
      var a = t(i, o);
      return n.push(a), function() {
        n = n.filter(function(s) {
          return s !== a;
        });
      };
    },
    assignSyncMedium: function(i) {
      for (o = !0; n.length; ) {
        var a = n;
        n = [], a.forEach(i);
      }
      n = {
        push: function(s) {
          return i(s);
        },
        filter: function() {
          return n;
        }
      };
    },
    assignMedium: function(i) {
      o = !0;
      var a = [];
      if (n.length) {
        var s = n;
        n = [], s.forEach(i), a = n;
      }
      var c = function() {
        var l = a;
        a = [], l.forEach(i);
      }, u = function() {
        return Promise.resolve().then(c);
      };
      u(), n = {
        push: function(l) {
          a.push(l), u();
        },
        filter: function(l) {
          return a = a.filter(l), n;
        }
      };
    }
  };
  return r;
}
function _z(e) {
  e === void 0 && (e = {});
  var t = wz(null);
  return t.options = zt({ async: !0, ssr: !1 }, e), t;
}
var v_ = function(e) {
  var t = e.sideCar, n = p_(e, ["sideCar"]);
  if (!t)
    throw new Error("Sidecar: please provide `sideCar` property to import the right car");
  var o = t.read();
  if (!o)
    throw new Error("Sidecar medium not found");
  return m.createElement(o, zt({}, n));
};
v_.isSideCarExport = !0;
function $z(e, t) {
  return e.useMedium(t), v_;
}
var y_ = _z(), Fc = function() {
}, ec = m.forwardRef(function(e, t) {
  var n = m.useRef(null), o = m.useState({
    onScrollCapture: Fc,
    onWheelCapture: Fc,
    onTouchMoveCapture: Fc
  }), r = o[0], i = o[1], a = e.forwardProps, s = e.children, c = e.className, u = e.removeScrollBar, l = e.enabled, d = e.shards, f = e.sideCar, h = e.noRelative, g = e.noIsolation, p = e.inert, v = e.allowPinchZoom, b = e.as, _ = b === void 0 ? "div" : b, $ = e.gapMode, x = p_(e, ["forwardProps", "children", "className", "removeScrollBar", "enabled", "shards", "sideCar", "noRelative", "noIsolation", "inert", "allowPinchZoom", "as", "gapMode"]), S = f, w = yz([n, t]), I = zt(zt({}, x), r);
  return m.createElement(
    m.Fragment,
    null,
    l && m.createElement(S, { sideCar: y_, removeScrollBar: u, shards: d, noRelative: h, noIsolation: g, inert: p, setCallbacks: i, allowPinchZoom: !!v, lockRef: n, gapMode: $ }),
    a ? m.cloneElement(m.Children.only(s), zt(zt({}, I), { ref: w })) : m.createElement(_, zt({}, I, { className: c, ref: w }), s)
  );
});
ec.defaultProps = {
  enabled: !0,
  removeScrollBar: !0,
  inert: !1
};
ec.classNames = {
  fullWidth: Bi,
  zeroRight: Yi
};
var hh, kz = function() {
  if (hh)
    return hh;
  if (typeof __webpack_nonce__ < "u")
    return __webpack_nonce__;
};
function xz() {
  if (!document)
    return null;
  var e = document.createElement("style");
  e.type = "text/css";
  var t = kz();
  return t && e.setAttribute("nonce", t), e;
}
function Sz(e, t) {
  e.styleSheet ? e.styleSheet.cssText = t : e.appendChild(document.createTextNode(t));
}
function Dz(e) {
  var t = document.head || document.getElementsByTagName("head")[0];
  t.appendChild(e);
}
var Oz = function() {
  var e = 0, t = null;
  return {
    add: function(n) {
      e == 0 && (t = xz()) && (Sz(t, n), Dz(t)), e++;
    },
    remove: function() {
      e--, !e && t && (t.parentNode && t.parentNode.removeChild(t), t = null);
    }
  };
}, Iz = function() {
  var e = Oz();
  return function(t, n) {
    m.useEffect(function() {
      return e.add(t), function() {
        e.remove();
      };
    }, [t && n]);
  };
}, b_ = function() {
  var e = Iz(), t = function(n) {
    var o = n.styles, r = n.dynamic;
    return e(o, r), null;
  };
  return t;
}, Nz = {
  left: 0,
  top: 0,
  right: 0,
  gap: 0
}, Wc = function(e) {
  return parseInt(e || "", 10) || 0;
}, Ez = function(e) {
  var t = window.getComputedStyle(document.body), n = t[e === "padding" ? "paddingLeft" : "marginLeft"], o = t[e === "padding" ? "paddingTop" : "marginTop"], r = t[e === "padding" ? "paddingRight" : "marginRight"];
  return [Wc(n), Wc(o), Wc(r)];
}, Pz = function(e) {
  if (e === void 0 && (e = "margin"), typeof window > "u")
    return Nz;
  var t = Ez(e), n = document.documentElement.clientWidth, o = window.innerWidth;
  return {
    left: t[0],
    top: t[1],
    right: t[2],
    gap: Math.max(0, o - n + t[2] - t[0])
  };
}, Tz = b_(), sr = "data-scroll-locked", Cz = function(e, t, n, o) {
  var r = e.left, i = e.top, a = e.right, s = e.gap;
  return n === void 0 && (n = "margin"), `
  .`.concat(hz, ` {
   overflow: hidden `).concat(o, `;
   padding-right: `).concat(s, "px ").concat(o, `;
  }
  body[`).concat(sr, `] {
    overflow: hidden `).concat(o, `;
    overscroll-behavior: contain;
    `).concat([
    t && "position: relative ".concat(o, ";"),
    n === "margin" && `
    padding-left: `.concat(r, `px;
    padding-top: `).concat(i, `px;
    padding-right: `).concat(a, `px;
    margin-left:0;
    margin-top:0;
    margin-right: `).concat(s, "px ").concat(o, `;
    `),
    n === "padding" && "padding-right: ".concat(s, "px ").concat(o, ";")
  ].filter(Boolean).join(""), `
  }
  
  .`).concat(Yi, ` {
    right: `).concat(s, "px ").concat(o, `;
  }
  
  .`).concat(Bi, ` {
    margin-right: `).concat(s, "px ").concat(o, `;
  }
  
  .`).concat(Yi, " .").concat(Yi, ` {
    right: 0 `).concat(o, `;
  }
  
  .`).concat(Bi, " .").concat(Bi, ` {
    margin-right: 0 `).concat(o, `;
  }
  
  body[`).concat(sr, `] {
    `).concat(gz, ": ").concat(s, `px;
  }
`);
}, gh = function() {
  var e = parseInt(document.body.getAttribute(sr) || "0", 10);
  return isFinite(e) ? e : 0;
}, Mz = function() {
  m.useEffect(function() {
    return document.body.setAttribute(sr, (gh() + 1).toString()), function() {
      var e = gh() - 1;
      e <= 0 ? document.body.removeAttribute(sr) : document.body.setAttribute(sr, e.toString());
    };
  }, []);
}, zz = function(e) {
  var t = e.noRelative, n = e.noImportant, o = e.gapMode, r = o === void 0 ? "margin" : o;
  Mz();
  var i = m.useMemo(function() {
    return Pz(r);
  }, [r]);
  return m.createElement(Tz, { styles: Cz(i, !t, r, n ? "" : "!important") });
}, gu = !1;
if (typeof window < "u")
  try {
    var Ti = Object.defineProperty({}, "passive", {
      get: function() {
        return gu = !0, !0;
      }
    });
    window.addEventListener("test", Ti, Ti), window.removeEventListener("test", Ti, Ti);
  } catch {
    gu = !1;
  }
var Xn = gu ? { passive: !1 } : !1, Rz = function(e) {
  return e.tagName === "TEXTAREA";
}, w_ = function(e, t) {
  if (!(e instanceof Element))
    return !1;
  var n = window.getComputedStyle(e);
  return (
    // not-not-scrollable
    n[t] !== "hidden" && // contains scroll inside self
    !(n.overflowY === n.overflowX && !Rz(e) && n[t] === "visible")
  );
}, Az = function(e) {
  return w_(e, "overflowY");
}, Uz = function(e) {
  return w_(e, "overflowX");
}, ph = function(e, t) {
  var n = t.ownerDocument, o = t;
  do {
    typeof ShadowRoot < "u" && o instanceof ShadowRoot && (o = o.host);
    var r = __(e, o);
    if (r) {
      var i = $_(e, o), a = i[1], s = i[2];
      if (a > s)
        return !0;
    }
    o = o.parentNode;
  } while (o && o !== n.body);
  return !1;
}, jz = function(e) {
  var t = e.scrollTop, n = e.scrollHeight, o = e.clientHeight;
  return [
    t,
    n,
    o
  ];
}, Fz = function(e) {
  var t = e.scrollLeft, n = e.scrollWidth, o = e.clientWidth;
  return [
    t,
    n,
    o
  ];
}, __ = function(e, t) {
  return e === "v" ? Az(t) : Uz(t);
}, $_ = function(e, t) {
  return e === "v" ? jz(t) : Fz(t);
}, Wz = function(e, t) {
  return e === "h" && t === "rtl" ? -1 : 1;
}, Lz = function(e, t, n, o, r) {
  var i = Wz(e, window.getComputedStyle(t).direction), a = i * o, s = n.target, c = t.contains(s), u = !1, l = a > 0, d = 0, f = 0;
  do {
    if (!s)
      break;
    var h = $_(e, s), g = h[0], p = h[1], v = h[2], b = p - v - i * g;
    (g || b) && __(e, s) && (d += b, f += g);
    var _ = s.parentNode;
    s = _ && _.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? _.host : _;
  } while (
    // portaled content
    !c && s !== document.body || // self content
    c && (t.contains(s) || t === s)
  );
  return (l && (r && Math.abs(d) < 1 || !r && a > d) || !l && (r && Math.abs(f) < 1 || !r && -a > f)) && (u = !0), u;
}, Ci = function(e) {
  return "changedTouches" in e ? [e.changedTouches[0].clientX, e.changedTouches[0].clientY] : [0, 0];
}, vh = function(e) {
  return [e.deltaX, e.deltaY];
}, yh = function(e) {
  return e && "current" in e ? e.current : e;
}, Zz = function(e, t) {
  return e[0] === t[0] && e[1] === t[1];
}, Yz = function(e) {
  return `
  .block-interactivity-`.concat(e, ` {pointer-events: none;}
  .allow-interactivity-`).concat(e, ` {pointer-events: all;}
`);
}, Bz = 0, Qn = [];
function Hz(e) {
  var t = m.useRef([]), n = m.useRef([0, 0]), o = m.useRef(), r = m.useState(Bz++)[0], i = m.useState(b_)[0], a = m.useRef(e);
  m.useEffect(function() {
    a.current = e;
  }, [e]), m.useEffect(function() {
    if (e.inert) {
      document.body.classList.add("block-interactivity-".concat(r));
      var p = mz([e.lockRef.current], (e.shards || []).map(yh), !0).filter(Boolean);
      return p.forEach(function(v) {
        return v.classList.add("allow-interactivity-".concat(r));
      }), function() {
        document.body.classList.remove("block-interactivity-".concat(r)), p.forEach(function(v) {
          return v.classList.remove("allow-interactivity-".concat(r));
        });
      };
    }
  }, [e.inert, e.lockRef.current, e.shards]);
  var s = m.useCallback(function(p, v) {
    if ("touches" in p && p.touches.length === 2 || p.type === "wheel" && p.ctrlKey)
      return !a.current.allowPinchZoom;
    var b = Ci(p), _ = n.current, $ = "deltaX" in p ? p.deltaX : _[0] - b[0], x = "deltaY" in p ? p.deltaY : _[1] - b[1], S, w = p.target, I = Math.abs($) > Math.abs(x) ? "h" : "v";
    if ("touches" in p && I === "h" && w.type === "range")
      return !1;
    var D = window.getSelection(), P = D && D.anchorNode, M = P ? P === w || P.contains(w) : !1;
    if (M)
      return !1;
    var B = ph(I, w);
    if (!B)
      return !0;
    if (B ? S = I : (S = I === "v" ? "h" : "v", B = ph(I, w)), !B)
      return !1;
    if (!o.current && "changedTouches" in p && ($ || x) && (o.current = S), !S)
      return !0;
    var K = o.current || S;
    return Lz(K, v, p, K === "h" ? $ : x, !0);
  }, []), c = m.useCallback(function(p) {
    var v = p;
    if (!(!Qn.length || Qn[Qn.length - 1] !== i)) {
      var b = "deltaY" in v ? vh(v) : Ci(v), _ = t.current.filter(function(S) {
        return S.name === v.type && (S.target === v.target || v.target === S.shadowParent) && Zz(S.delta, b);
      })[0];
      if (_ && _.should) {
        v.cancelable && v.preventDefault();
        return;
      }
      if (!_) {
        var $ = (a.current.shards || []).map(yh).filter(Boolean).filter(function(S) {
          return S.contains(v.target);
        }), x = $.length > 0 ? s(v, $[0]) : !a.current.noIsolation;
        x && v.cancelable && v.preventDefault();
      }
    }
  }, []), u = m.useCallback(function(p, v, b, _) {
    var $ = { name: p, delta: v, target: b, should: _, shadowParent: Gz(b) };
    t.current.push($), setTimeout(function() {
      t.current = t.current.filter(function(x) {
        return x !== $;
      });
    }, 1);
  }, []), l = m.useCallback(function(p) {
    n.current = Ci(p), o.current = void 0;
  }, []), d = m.useCallback(function(p) {
    u(p.type, vh(p), p.target, s(p, e.lockRef.current));
  }, []), f = m.useCallback(function(p) {
    u(p.type, Ci(p), p.target, s(p, e.lockRef.current));
  }, []);
  m.useEffect(function() {
    return Qn.push(i), e.setCallbacks({
      onScrollCapture: d,
      onWheelCapture: d,
      onTouchMoveCapture: f
    }), document.addEventListener("wheel", c, Xn), document.addEventListener("touchmove", c, Xn), document.addEventListener("touchstart", l, Xn), function() {
      Qn = Qn.filter(function(p) {
        return p !== i;
      }), document.removeEventListener("wheel", c, Xn), document.removeEventListener("touchmove", c, Xn), document.removeEventListener("touchstart", l, Xn);
    };
  }, []);
  var h = e.removeScrollBar, g = e.inert;
  return m.createElement(
    m.Fragment,
    null,
    g ? m.createElement(i, { styles: Yz(r) }) : null,
    h ? m.createElement(zz, { noRelative: e.noRelative, gapMode: e.gapMode }) : null
  );
}
function Gz(e) {
  for (var t = null; e !== null; )
    e instanceof ShadowRoot && (t = e.host, e = e.host), e = e.parentNode;
  return t;
}
const Vz = $z(y_, Hz);
var k_ = m.forwardRef(function(e, t) {
  return m.createElement(ec, zt({}, e, { ref: t, sideCar: Vz }));
});
k_.classNames = ec.classNames;
const kf = k_;
var qz = function(e) {
  if (typeof document > "u")
    return null;
  var t = Array.isArray(e) ? e[0] : e;
  return t.ownerDocument.body;
}, er = /* @__PURE__ */ new WeakMap(), Mi = /* @__PURE__ */ new WeakMap(), zi = {}, Lc = 0, x_ = function(e) {
  return e && (e.host || x_(e.parentNode));
}, Jz = function(e, t) {
  return t.map(function(n) {
    if (e.contains(n))
      return n;
    var o = x_(n);
    return o && e.contains(o) ? o : (console.error("aria-hidden", n, "in not contained inside", e, ". Doing nothing"), null);
  }).filter(function(n) {
    return !!n;
  });
}, Kz = function(e, t, n, o) {
  var r = Jz(t, Array.isArray(e) ? e : [e]);
  zi[n] || (zi[n] = /* @__PURE__ */ new WeakMap());
  var i = zi[n], a = [], s = /* @__PURE__ */ new Set(), c = new Set(r), u = function(d) {
    !d || s.has(d) || (s.add(d), u(d.parentNode));
  };
  r.forEach(u);
  var l = function(d) {
    !d || c.has(d) || Array.prototype.forEach.call(d.children, function(f) {
      if (s.has(f))
        l(f);
      else
        try {
          var h = f.getAttribute(o), g = h !== null && h !== "false", p = (er.get(f) || 0) + 1, v = (i.get(f) || 0) + 1;
          er.set(f, p), i.set(f, v), a.push(f), p === 1 && g && Mi.set(f, !0), v === 1 && f.setAttribute(n, "true"), g || f.setAttribute(o, "true");
        } catch (b) {
          console.error("aria-hidden: cannot operate on ", f, b);
        }
    });
  };
  return l(t), s.clear(), Lc++, function() {
    a.forEach(function(d) {
      var f = er.get(d) - 1, h = i.get(d) - 1;
      er.set(d, f), i.set(d, h), f || (Mi.has(d) || d.removeAttribute(o), Mi.delete(d)), h || d.removeAttribute(n);
    }), Lc--, Lc || (er = /* @__PURE__ */ new WeakMap(), er = /* @__PURE__ */ new WeakMap(), Mi = /* @__PURE__ */ new WeakMap(), zi = {});
  };
}, xf = function(e, t, n) {
  n === void 0 && (n = "data-aria-hidden");
  var o = Array.from(Array.isArray(e) ? e : [e]), r = t || qz(e);
  return r ? (o.push.apply(o, Array.from(r.querySelectorAll("[aria-live], script"))), Kz(o, r, n, "aria-hidden")) : function() {
    return null;
  };
};
// @__NO_SIDE_EFFECTS__
function Xz(e) {
  const t = /* @__PURE__ */ Qz(e), n = m.forwardRef((o, r) => {
    const { children: i, ...a } = o, s = m.Children.toArray(i), c = s.find(tR);
    if (c) {
      const u = c.props.children, l = s.map((d) => d === c ? m.Children.count(u) > 1 ? m.Children.only(null) : m.isValidElement(u) ? u.props.children : null : d);
      return /* @__PURE__ */ y(t, { ...a, ref: r, children: m.isValidElement(u) ? m.cloneElement(u, void 0, l) : null });
    }
    return /* @__PURE__ */ y(t, { ...a, ref: r, children: i });
  });
  return n.displayName = `${e}.Slot`, n;
}
// @__NO_SIDE_EFFECTS__
function Qz(e) {
  const t = m.forwardRef((n, o) => {
    const { children: r, ...i } = n;
    if (m.isValidElement(r)) {
      const a = rR(r), s = nR(i, r.props);
      return r.type !== m.Fragment && (s.ref = o ? cn(o, a) : a), m.cloneElement(r, s);
    }
    return m.Children.count(r) > 1 ? m.Children.only(null) : null;
  });
  return t.displayName = `${e}.SlotClone`, t;
}
var eR = Symbol("radix.slottable");
function tR(e) {
  return m.isValidElement(e) && typeof e.type == "function" && "__radixId" in e.type && e.type.__radixId === eR;
}
function nR(e, t) {
  const n = { ...t };
  for (const o in t) {
    const r = e[o], i = t[o];
    /^on[A-Z]/.test(o) ? r && i ? n[o] = (...s) => {
      const c = i(...s);
      return r(...s), c;
    } : r && (n[o] = r) : o === "style" ? n[o] = { ...r, ...i } : o === "className" && (n[o] = [r, i].filter(Boolean).join(" "));
  }
  return { ...e, ...n };
}
function rR(e) {
  var o, r;
  let t = (o = Object.getOwnPropertyDescriptor(e.props, "ref")) == null ? void 0 : o.get, n = t && "isReactWarning" in t && t.isReactWarning;
  return n ? e.ref : (t = (r = Object.getOwnPropertyDescriptor(e, "ref")) == null ? void 0 : r.get, n = t && "isReactWarning" in t && t.isReactWarning, n ? e.props.ref : e.props.ref || e.ref);
}
var tc = "Dialog", [S_, o2] = St(tc), [oR, Dt] = S_(tc), D_ = (e) => {
  const {
    __scopeDialog: t,
    children: n,
    open: o,
    defaultOpen: r,
    onOpenChange: i,
    modal: a = !0
  } = e, s = m.useRef(null), c = m.useRef(null), [u, l] = Hn({
    prop: o,
    defaultProp: r ?? !1,
    onChange: i,
    caller: tc
  });
  return /* @__PURE__ */ y(
    oR,
    {
      scope: t,
      triggerRef: s,
      contentRef: c,
      contentId: Kt(),
      titleId: Kt(),
      descriptionId: Kt(),
      open: u,
      onOpenChange: l,
      onOpenToggle: m.useCallback(() => l((d) => !d), [l]),
      modal: a,
      children: n
    }
  );
};
D_.displayName = tc;
var O_ = "DialogTrigger", I_ = m.forwardRef(
  (e, t) => {
    const { __scopeDialog: n, ...o } = e, r = Dt(O_, n), i = ye(t, r.triggerRef);
    return /* @__PURE__ */ y(
      de.button,
      {
        type: "button",
        "aria-haspopup": "dialog",
        "aria-expanded": r.open,
        "aria-controls": r.contentId,
        "data-state": Of(r.open),
        ...o,
        ref: i,
        onClick: Y(e.onClick, r.onOpenToggle)
      }
    );
  }
);
I_.displayName = O_;
var Sf = "DialogPortal", [iR, N_] = S_(Sf, {
  forceMount: void 0
}), E_ = (e) => {
  const { __scopeDialog: t, forceMount: n, children: o, container: r } = e, i = Dt(Sf, t);
  return /* @__PURE__ */ y(iR, { scope: t, forceMount: n, children: m.Children.map(o, (a) => /* @__PURE__ */ y(We, { present: n || i.open, children: /* @__PURE__ */ y(Qs, { asChild: !0, container: r, children: a }) })) });
};
E_.displayName = Sf;
var ma = "DialogOverlay", P_ = m.forwardRef(
  (e, t) => {
    const n = N_(ma, e.__scopeDialog), { forceMount: o = n.forceMount, ...r } = e, i = Dt(ma, e.__scopeDialog);
    return i.modal ? /* @__PURE__ */ y(We, { present: o || i.open, children: /* @__PURE__ */ y(sR, { ...r, ref: t }) }) : null;
  }
);
P_.displayName = ma;
var aR = /* @__PURE__ */ Xz("DialogOverlay.RemoveScroll"), sR = m.forwardRef(
  (e, t) => {
    const { __scopeDialog: n, ...o } = e, r = Dt(ma, n);
    return (
      // Make sure `Content` is scrollable even when it doesn't live inside `RemoveScroll`
      // ie. when `Overlay` and `Content` are siblings
      /* @__PURE__ */ y(kf, { as: aR, allowPinchZoom: !0, shards: [r.contentRef], children: /* @__PURE__ */ y(
        de.div,
        {
          "data-state": Of(r.open),
          ...o,
          ref: t,
          style: { pointerEvents: "auto", ...o.style }
        }
      ) })
    );
  }
), Fn = "DialogContent", T_ = m.forwardRef(
  (e, t) => {
    const n = N_(Fn, e.__scopeDialog), { forceMount: o = n.forceMount, ...r } = e, i = Dt(Fn, e.__scopeDialog);
    return /* @__PURE__ */ y(We, { present: o || i.open, children: i.modal ? /* @__PURE__ */ y(cR, { ...r, ref: t }) : /* @__PURE__ */ y(uR, { ...r, ref: t }) });
  }
);
T_.displayName = Fn;
var cR = m.forwardRef(
  (e, t) => {
    const n = Dt(Fn, e.__scopeDialog), o = m.useRef(null), r = ye(t, n.contentRef, o);
    return m.useEffect(() => {
      const i = o.current;
      if (i)
        return xf(i);
    }, []), /* @__PURE__ */ y(
      C_,
      {
        ...e,
        ref: r,
        trapFocus: n.open,
        disableOutsidePointerEvents: !0,
        onCloseAutoFocus: Y(e.onCloseAutoFocus, (i) => {
          var a;
          i.preventDefault(), (a = n.triggerRef.current) == null || a.focus();
        }),
        onPointerDownOutside: Y(e.onPointerDownOutside, (i) => {
          const a = i.detail.originalEvent, s = a.button === 0 && a.ctrlKey === !0;
          (a.button === 2 || s) && i.preventDefault();
        }),
        onFocusOutside: Y(
          e.onFocusOutside,
          (i) => i.preventDefault()
        )
      }
    );
  }
), uR = m.forwardRef(
  (e, t) => {
    const n = Dt(Fn, e.__scopeDialog), o = m.useRef(!1), r = m.useRef(!1);
    return /* @__PURE__ */ y(
      C_,
      {
        ...e,
        ref: t,
        trapFocus: !1,
        disableOutsidePointerEvents: !1,
        onCloseAutoFocus: (i) => {
          var a, s;
          (a = e.onCloseAutoFocus) == null || a.call(e, i), i.defaultPrevented || (o.current || (s = n.triggerRef.current) == null || s.focus(), i.preventDefault()), o.current = !1, r.current = !1;
        },
        onInteractOutside: (i) => {
          var c, u;
          (c = e.onInteractOutside) == null || c.call(e, i), i.defaultPrevented || (o.current = !0, i.detail.originalEvent.type === "pointerdown" && (r.current = !0));
          const a = i.target;
          ((u = n.triggerRef.current) == null ? void 0 : u.contains(a)) && i.preventDefault(), i.detail.originalEvent.type === "focusin" && r.current && i.preventDefault();
        }
      }
    );
  }
), C_ = m.forwardRef(
  (e, t) => {
    const { __scopeDialog: n, trapFocus: o, onOpenAutoFocus: r, onCloseAutoFocus: i, ...a } = e, s = Dt(Fn, n), c = m.useRef(null), u = ye(t, c);
    return $f(), /* @__PURE__ */ Ge(Gi, { children: [
      /* @__PURE__ */ y(
        Xs,
        {
          asChild: !0,
          loop: !0,
          trapped: o,
          onMountAutoFocus: r,
          onUnmountAutoFocus: i,
          children: /* @__PURE__ */ y(
            Ks,
            {
              role: "dialog",
              id: s.contentId,
              "aria-describedby": s.descriptionId,
              "aria-labelledby": s.titleId,
              "data-state": Of(s.open),
              ...a,
              ref: u,
              onDismiss: () => s.onOpenChange(!1)
            }
          )
        }
      ),
      /* @__PURE__ */ Ge(Gi, { children: [
        /* @__PURE__ */ y(lR, { titleId: s.titleId }),
        /* @__PURE__ */ y(fR, { contentRef: c, descriptionId: s.descriptionId })
      ] })
    ] });
  }
), Df = "DialogTitle", M_ = m.forwardRef(
  (e, t) => {
    const { __scopeDialog: n, ...o } = e, r = Dt(Df, n);
    return /* @__PURE__ */ y(de.h2, { id: r.titleId, ...o, ref: t });
  }
);
M_.displayName = Df;
var z_ = "DialogDescription", R_ = m.forwardRef(
  (e, t) => {
    const { __scopeDialog: n, ...o } = e, r = Dt(z_, n);
    return /* @__PURE__ */ y(de.p, { id: r.descriptionId, ...o, ref: t });
  }
);
R_.displayName = z_;
var A_ = "DialogClose", U_ = m.forwardRef(
  (e, t) => {
    const { __scopeDialog: n, ...o } = e, r = Dt(A_, n);
    return /* @__PURE__ */ y(
      de.button,
      {
        type: "button",
        ...o,
        ref: t,
        onClick: Y(e.onClick, () => r.onOpenChange(!1))
      }
    );
  }
);
U_.displayName = A_;
function Of(e) {
  return e ? "open" : "closed";
}
var j_ = "DialogTitleWarning", [i2, F_] = MM(j_, {
  contentName: Fn,
  titleName: Df,
  docsSlug: "dialog"
}), lR = ({ titleId: e }) => {
  const t = F_(j_), n = `\`${t.contentName}\` requires a \`${t.titleName}\` for the component to be accessible for screen reader users.

If you want to hide the \`${t.titleName}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://radix-ui.com/primitives/docs/components/${t.docsSlug}`;
  return m.useEffect(() => {
    e && (document.getElementById(e) || console.error(n));
  }, [n, e]), null;
}, dR = "DialogDescriptionWarning", fR = ({ contentRef: e, descriptionId: t }) => {
  const o = `Warning: Missing \`Description\` or \`aria-describedby={undefined}\` for {${F_(dR).contentName}}.`;
  return m.useEffect(() => {
    var i;
    const r = (i = e.current) == null ? void 0 : i.getAttribute("aria-describedby");
    t && r && (document.getElementById(t) || console.warn(o));
  }, [o, e, t]), null;
}, W_ = D_, L_ = I_, Z_ = E_, nc = P_, rc = T_, oc = M_, ic = R_, ac = U_;
const a2 = W_, s2 = L_, mR = Z_, c2 = ac, Y_ = m.forwardRef(({ className: e, ...t }, n) => /* @__PURE__ */ y(
  nc,
  {
    ref: n,
    className: z(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      e
    ),
    ...t
  }
));
Y_.displayName = nc.displayName;
const hR = m.forwardRef(({ className: e, children: t, ...n }, o) => /* @__PURE__ */ Ge(mR, { children: [
  /* @__PURE__ */ y(Y_, {}),
  /* @__PURE__ */ Ge(
    rc,
    {
      ref: o,
      className: z(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        e
      ),
      ...n,
      children: [
        t,
        /* @__PURE__ */ Ge(ac, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground", children: [
          /* @__PURE__ */ y(Fh, { className: "h-4 w-4" }),
          /* @__PURE__ */ y("span", { className: "sr-only", children: "Close" })
        ] })
      ]
    }
  )
] }));
hR.displayName = rc.displayName;
const gR = ({ className: e, ...t }) => /* @__PURE__ */ y("div", { className: z("flex flex-col space-y-1.5 text-center sm:text-left", e), ...t });
gR.displayName = "DialogHeader";
const pR = ({ className: e, ...t }) => /* @__PURE__ */ y(
  "div",
  {
    className: z("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", e),
    ...t
  }
);
pR.displayName = "DialogFooter";
const vR = m.forwardRef(({ className: e, ...t }, n) => /* @__PURE__ */ y(
  oc,
  {
    ref: n,
    className: z("text-lg font-semibold leading-none tracking-tight", e),
    ...t
  }
));
vR.displayName = oc.displayName;
const yR = m.forwardRef(({ className: e, ...t }, n) => /* @__PURE__ */ y(
  ic,
  {
    ref: n,
    className: z("text-sm text-muted-foreground", e),
    ...t
  }
));
yR.displayName = ic.displayName;
const bR = js(
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
), wR = m.forwardRef(({ className: e, variant: t, ...n }, o) => /* @__PURE__ */ y("div", { ref: o, role: "alert", className: z(bR({ variant: t }), e), ...n }));
wR.displayName = "Alert";
const _R = m.forwardRef(
  ({ className: e, ...t }, n) => /* @__PURE__ */ y(
    "h5",
    {
      ref: n,
      className: z("mb-1 font-medium leading-none tracking-tight", e),
      ...t
    }
  )
);
_R.displayName = "AlertTitle";
const $R = m.forwardRef(({ className: e, ...t }, n) => /* @__PURE__ */ y("div", { ref: n, className: z("text-sm [&_p]:leading-relaxed", e), ...t }));
$R.displayName = "AlertDescription";
const kR = m.forwardRef(
  ({ className: e, ...t }, n) => /* @__PURE__ */ y(
    "div",
    {
      ref: n,
      className: z("rounded-xl border bg-card text-card-foreground shadow", e),
      ...t
    }
  )
);
kR.displayName = "Card";
const xR = m.forwardRef(
  ({ className: e, ...t }, n) => /* @__PURE__ */ y("div", { ref: n, className: z("flex flex-col space-y-1.5 p-6", e), ...t })
);
xR.displayName = "CardHeader";
const SR = m.forwardRef(
  ({ className: e, ...t }, n) => /* @__PURE__ */ y(
    "div",
    {
      ref: n,
      className: z("font-semibold leading-none tracking-tight", e),
      ...t
    }
  )
);
SR.displayName = "CardTitle";
const DR = m.forwardRef(
  ({ className: e, ...t }, n) => /* @__PURE__ */ y("div", { ref: n, className: z("text-sm text-muted-foreground", e), ...t })
);
DR.displayName = "CardDescription";
const OR = m.forwardRef(
  ({ className: e, ...t }, n) => /* @__PURE__ */ y("div", { ref: n, className: z("p-6 pt-0", e), ...t })
);
OR.displayName = "CardContent";
const IR = m.forwardRef(
  ({ className: e, ...t }, n) => /* @__PURE__ */ y("div", { ref: n, className: z("flex items-center p-6 pt-0", e), ...t })
);
IR.displayName = "CardFooter";
function NR(e, t, n = "long") {
  return new Intl.DateTimeFormat("en-US", {
    // Enforces engine to render the time. Without the option JavaScriptCore omits it.
    hour: "numeric",
    timeZone: e,
    timeZoneName: n
  }).format(t).split(/\s/g).slice(2).join(" ");
}
const Zc = {}, Xr = {};
function Cn(e, t) {
  try {
    const o = (Zc[e] || (Zc[e] = new Intl.DateTimeFormat("en-US", {
      timeZone: e,
      timeZoneName: "longOffset"
    }).format))(t).split("GMT")[1];
    return o in Xr ? Xr[o] : bh(o, o.split(":"));
  } catch {
    if (e in Xr)
      return Xr[e];
    const n = e == null ? void 0 : e.match(ER);
    return n ? bh(e, n.slice(1)) : NaN;
  }
}
const ER = /([+-]\d\d):?(\d\d)?/;
function bh(e, t) {
  const n = +(t[0] || 0), o = +(t[1] || 0), r = +(t[2] || 0) / 60;
  return Xr[e] = n * 60 + o > 0 ? n * 60 + o + r : n * 60 - o - r;
}
class Rt extends Date {
  //#region static
  constructor(...t) {
    super(), t.length > 1 && typeof t[t.length - 1] == "string" && (this.timeZone = t.pop()), this.internal = /* @__PURE__ */ new Date(), isNaN(Cn(this.timeZone, this)) ? this.setTime(NaN) : t.length ? typeof t[0] == "number" && (t.length === 1 || t.length === 2 && typeof t[1] != "number") ? this.setTime(t[0]) : typeof t[0] == "string" ? this.setTime(+new Date(t[0])) : t[0] instanceof Date ? this.setTime(+t[0]) : (this.setTime(+new Date(...t)), B_(this), pu(this)) : this.setTime(Date.now());
  }
  static tz(t, ...n) {
    return n.length ? new Rt(...n, t) : new Rt(Date.now(), t);
  }
  //#endregion
  //#region time zone
  withTimeZone(t) {
    return new Rt(+this, t);
  }
  getTimezoneOffset() {
    const t = -Cn(this.timeZone, this);
    return t > 0 ? Math.floor(t) : Math.ceil(t);
  }
  //#endregion
  //#region time
  setTime(t) {
    return Date.prototype.setTime.apply(this, arguments), pu(this), +this;
  }
  //#endregion
  //#region date-fns integration
  [Symbol.for("constructDateFrom")](t) {
    return new Rt(+new Date(t), this.timeZone);
  }
  //#endregion
}
const wh = /^(get|set)(?!UTC)/;
Object.getOwnPropertyNames(Date.prototype).forEach((e) => {
  if (!wh.test(e))
    return;
  const t = e.replace(wh, "$1UTC");
  Rt.prototype[t] && (e.startsWith("get") ? Rt.prototype[e] = function() {
    return this.internal[t]();
  } : (Rt.prototype[e] = function() {
    return Date.prototype[t].apply(this.internal, arguments), PR(this), +this;
  }, Rt.prototype[t] = function() {
    return Date.prototype[t].apply(this, arguments), pu(this), +this;
  }));
});
function pu(e) {
  e.internal.setTime(+e), e.internal.setUTCSeconds(e.internal.getUTCSeconds() - Math.round(-Cn(e.timeZone, e) * 60));
}
function PR(e) {
  Date.prototype.setFullYear.call(e, e.internal.getUTCFullYear(), e.internal.getUTCMonth(), e.internal.getUTCDate()), Date.prototype.setHours.call(e, e.internal.getUTCHours(), e.internal.getUTCMinutes(), e.internal.getUTCSeconds(), e.internal.getUTCMilliseconds()), B_(e);
}
function B_(e) {
  const t = Cn(e.timeZone, e), n = t > 0 ? Math.floor(t) : Math.ceil(t), o = /* @__PURE__ */ new Date(+e);
  o.setUTCHours(o.getUTCHours() - 1);
  const r = -(/* @__PURE__ */ new Date(+e)).getTimezoneOffset(), i = -(/* @__PURE__ */ new Date(+o)).getTimezoneOffset(), a = r - i, s = Date.prototype.getHours.apply(e) !== e.internal.getUTCHours();
  a && s && e.internal.setUTCMinutes(e.internal.getUTCMinutes() + a);
  const c = r - n;
  c && Date.prototype.setUTCMinutes.call(e, Date.prototype.getUTCMinutes.call(e) + c);
  const u = /* @__PURE__ */ new Date(+e);
  u.setUTCSeconds(0);
  const l = r > 0 ? u.getSeconds() : (u.getSeconds() - 60) % 60, d = Math.round(-(Cn(e.timeZone, e) * 60)) % 60;
  (d || l) && (e.internal.setUTCSeconds(e.internal.getUTCSeconds() + d), Date.prototype.setUTCSeconds.call(e, Date.prototype.getUTCSeconds.call(e) + d + l));
  const f = Cn(e.timeZone, e), h = f > 0 ? Math.floor(f) : Math.ceil(f), p = -(/* @__PURE__ */ new Date(+e)).getTimezoneOffset() - h, v = h !== n, b = p - c;
  if (v && b) {
    Date.prototype.setUTCMinutes.call(e, Date.prototype.getUTCMinutes.call(e) + b);
    const _ = Cn(e.timeZone, e), $ = _ > 0 ? Math.floor(_) : Math.ceil(_), x = h - $;
    x && (e.internal.setUTCMinutes(e.internal.getUTCMinutes() + x), Date.prototype.setUTCMinutes.call(e, Date.prototype.getUTCMinutes.call(e) + x));
  }
}
class Re extends Rt {
  //#region static
  static tz(t, ...n) {
    return n.length ? new Re(...n, t) : new Re(Date.now(), t);
  }
  //#endregion
  //#region representation
  toISOString() {
    const [t, n, o] = this.tzComponents(), r = `${t}${n}:${o}`;
    return this.internal.toISOString().slice(0, -1) + r;
  }
  toString() {
    return `${this.toDateString()} ${this.toTimeString()}`;
  }
  toDateString() {
    const [t, n, o, r] = this.internal.toUTCString().split(" ");
    return `${t == null ? void 0 : t.slice(0, -1)} ${o} ${n} ${r}`;
  }
  toTimeString() {
    const t = this.internal.toUTCString().split(" ")[4], [n, o, r] = this.tzComponents();
    return `${t} GMT${n}${o}${r} (${NR(this.timeZone, this)})`;
  }
  toLocaleString(t, n) {
    return Date.prototype.toLocaleString.call(this, t, {
      ...n,
      timeZone: (n == null ? void 0 : n.timeZone) || this.timeZone
    });
  }
  toLocaleDateString(t, n) {
    return Date.prototype.toLocaleDateString.call(this, t, {
      ...n,
      timeZone: (n == null ? void 0 : n.timeZone) || this.timeZone
    });
  }
  toLocaleTimeString(t, n) {
    return Date.prototype.toLocaleTimeString.call(this, t, {
      ...n,
      timeZone: (n == null ? void 0 : n.timeZone) || this.timeZone
    });
  }
  //#endregion
  //#region private
  tzComponents() {
    const t = this.getTimezoneOffset(), n = t > 0 ? "-" : "+", o = String(Math.floor(Math.abs(t) / 60)).padStart(2, "0"), r = String(Math.abs(t) % 60).padStart(2, "0");
    return [n, o, r];
  }
  //#endregion
  withTimeZone(t) {
    return new Re(+this, t);
  }
  //#region date-fns integration
  [Symbol.for("constructDateFrom")](t) {
    return new Re(+new Date(t), this.timeZone);
  }
  //#endregion
}
const _h = 5, TR = 4;
function CR(e, t) {
  const n = t.startOfMonth(e), o = n.getDay() > 0 ? n.getDay() : 7, r = t.addDays(e, -o + 1), i = t.addDays(r, _h * 7 - 1);
  return t.getMonth(e) === t.getMonth(i) ? _h : TR;
}
function H_(e, t) {
  const n = t.startOfMonth(e), o = n.getDay();
  return o === 1 ? n : o === 0 ? t.addDays(n, -1 * 6) : t.addDays(n, -1 * (o - 1));
}
function MR(e, t) {
  const n = H_(e, t), o = CR(e, t);
  return t.addDays(n, o * 7 - 1);
}
const G_ = {
  ...rt,
  labels: {
    labelDayButton: (e, t, n, o) => {
      let r;
      o && typeof o.format == "function" ? r = o.format.bind(o) : r = (a, s) => Vt(a, s, { locale: rt, ...n });
      let i = r(e, "PPPP");
      return t.today && (i = `Today, ${i}`), t.selected && (i = `${i}, selected`), i;
    },
    labelMonthDropdown: "Choose the Month",
    labelNext: "Go to the Next Month",
    labelPrevious: "Go to the Previous Month",
    labelWeekNumber: (e) => `Week ${e}`,
    labelYearDropdown: "Choose the Year",
    labelGrid: (e, t, n) => {
      let o;
      return n && typeof n.format == "function" ? o = n.format.bind(n) : o = (r, i) => Vt(r, i, { locale: rt, ...t }), o(e, "LLLL yyyy");
    },
    labelGridcell: (e, t, n, o) => {
      let r;
      o && typeof o.format == "function" ? r = o.format.bind(o) : r = (a, s) => Vt(a, s, { locale: rt, ...n });
      let i = r(e, "PPPP");
      return t != null && t.today && (i = `Today, ${i}`), i;
    },
    labelNav: "Navigation bar",
    labelWeekNumberHeader: "Week Number",
    labelWeekday: (e, t, n) => {
      let o;
      return n && typeof n.format == "function" ? o = n.format.bind(n) : o = (r, i) => Vt(r, i, { locale: rt, ...t }), o(e, "cccc");
    }
  }
};
class st {
  /**
   * Creates an instance of `DateLib`.
   *
   * @param options Configuration options for the date library.
   * @param overrides Custom overrides for the date library functions.
   */
  constructor(t, n) {
    this.Date = Date, this.today = () => {
      var o;
      return (o = this.overrides) != null && o.today ? this.overrides.today() : this.options.timeZone ? Re.tz(this.options.timeZone) : new this.Date();
    }, this.newDate = (o, r, i) => {
      var a;
      return (a = this.overrides) != null && a.newDate ? this.overrides.newDate(o, r, i) : this.options.timeZone ? new Re(o, r, i, this.options.timeZone) : new Date(o, r, i);
    }, this.addDays = (o, r) => {
      var i;
      return (i = this.overrides) != null && i.addDays ? this.overrides.addDays(o, r) : _t(o, r);
    }, this.addMonths = (o, r) => {
      var i;
      return (i = this.overrides) != null && i.addMonths ? this.overrides.addMonths(o, r) : Lr(o, r);
    }, this.addWeeks = (o, r) => {
      var i;
      return (i = this.overrides) != null && i.addWeeks ? this.overrides.addWeeks(o, r) : ui(o, r);
    }, this.addYears = (o, r) => {
      var i;
      return (i = this.overrides) != null && i.addYears ? this.overrides.addYears(o, r) : cf(o, r);
    }, this.differenceInCalendarDays = (o, r) => {
      var i;
      return (i = this.overrides) != null && i.differenceInCalendarDays ? this.overrides.differenceInCalendarDays(o, r) : dt(o, r);
    }, this.differenceInCalendarMonths = (o, r) => {
      var i;
      return (i = this.overrides) != null && i.differenceInCalendarMonths ? this.overrides.differenceInCalendarMonths(o, r) : _r(o, r);
    }, this.eachMonthOfInterval = (o) => {
      var r;
      return (r = this.overrides) != null && r.eachMonthOfInterval ? this.overrides.eachMonthOfInterval(o) : _w(o);
    }, this.eachYearOfInterval = (o) => {
      var s;
      const r = (s = this.overrides) != null && s.eachYearOfInterval ? this.overrides.eachYearOfInterval(o) : $w(o), i = new Set(r.map((c) => this.getYear(c)));
      if (i.size === r.length)
        return r;
      const a = [];
      return i.forEach((c) => {
        a.push(new Date(c, 0, 1));
      }), a;
    }, this.endOfBroadcastWeek = (o) => {
      var r;
      return (r = this.overrides) != null && r.endOfBroadcastWeek ? this.overrides.endOfBroadcastWeek(o) : MR(o, this);
    }, this.endOfISOWeek = (o) => {
      var r;
      return (r = this.overrides) != null && r.endOfISOWeek ? this.overrides.endOfISOWeek(o) : kw(o);
    }, this.endOfMonth = (o) => {
      var r;
      return (r = this.overrides) != null && r.endOfMonth ? this.overrides.endOfMonth(o) : Ls(o);
    }, this.endOfWeek = (o, r) => {
      var i;
      return (i = this.overrides) != null && i.endOfWeek ? this.overrides.endOfWeek(o, r) : vf(o, this.options);
    }, this.endOfYear = (o) => {
      var r;
      return (r = this.overrides) != null && r.endOfYear ? this.overrides.endOfYear(o) : pf(o);
    }, this.format = (o, r, i) => {
      var s;
      const a = (s = this.overrides) != null && s.format ? this.overrides.format(o, r, this.options) : Vt(o, r, this.options);
      return this.options.numerals && this.options.numerals !== "latn" ? this.replaceDigits(a) : a;
    }, this.getISOWeek = (o) => {
      var r;
      return (r = this.overrides) != null && r.getISOWeek ? this.overrides.getISOWeek(o) : di(o);
    }, this.getMonth = (o, r) => {
      var i;
      return (i = this.overrides) != null && i.getMonth ? this.overrides.getMonth(o, this.options) : Rw(o, this.options);
    }, this.getYear = (o, r) => {
      var i;
      return (i = this.overrides) != null && i.getYear ? this.overrides.getYear(o, this.options) : Uw(o, this.options);
    }, this.getWeek = (o, r) => {
      var i;
      return (i = this.overrides) != null && i.getWeek ? this.overrides.getWeek(o, this.options) : fi(o, this.options);
    }, this.isAfter = (o, r) => {
      var i;
      return (i = this.overrides) != null && i.isAfter ? this.overrides.isAfter(o, r) : jw(o, r);
    }, this.isBefore = (o, r) => {
      var i;
      return (i = this.overrides) != null && i.isBefore ? this.overrides.isBefore(o, r) : Fw(o, r);
    }, this.isDate = (o) => {
      var r;
      return (r = this.overrides) != null && r.isDate ? this.overrides.isDate(o) : df(o);
    }, this.isSameDay = (o, r) => {
      var i;
      return (i = this.overrides) != null && i.isSameDay ? this.overrides.isSameDay(o, r) : Zr(o, r);
    }, this.isSameMonth = (o, r) => {
      var i;
      return (i = this.overrides) != null && i.isSameMonth ? this.overrides.isSameMonth(o, r) : bf(o, r);
    }, this.isSameYear = (o, r) => {
      var i;
      return (i = this.overrides) != null && i.isSameYear ? this.overrides.isSameYear(o, r) : wf(o, r);
    }, this.max = (o) => {
      var r;
      return (r = this.overrides) != null && r.max ? this.overrides.max(o) : uf(o);
    }, this.min = (o) => {
      var r;
      return (r = this.overrides) != null && r.min ? this.overrides.min(o) : lf(o);
    }, this.setMonth = (o, r) => {
      var i;
      return (i = this.overrides) != null && i.setMonth ? this.overrides.setMonth(o, r) : qs(o, r);
    }, this.setYear = (o, r) => {
      var i;
      return (i = this.overrides) != null && i.setYear ? this.overrides.setYear(o, r) : o_(o, r);
    }, this.startOfBroadcastWeek = (o, r) => {
      var i;
      return (i = this.overrides) != null && i.startOfBroadcastWeek ? this.overrides.startOfBroadcastWeek(o, this) : H_(o, this);
    }, this.startOfDay = (o) => {
      var r;
      return (r = this.overrides) != null && r.startOfDay ? this.overrides.startOfDay(o) : jn(o);
    }, this.startOfISOWeek = (o) => {
      var r;
      return (r = this.overrides) != null && r.startOfISOWeek ? this.overrides.startOfISOWeek(o) : ht(o);
    }, this.startOfMonth = (o) => {
      var r;
      return (r = this.overrides) != null && r.startOfMonth ? this.overrides.startOfMonth(o) : li(o);
    }, this.startOfWeek = (o, r) => {
      var i;
      return (i = this.overrides) != null && i.startOfWeek ? this.overrides.startOfWeek(o, this.options) : Me(o, this.options);
    }, this.startOfYear = (o) => {
      var r;
      return (r = this.overrides) != null && r.startOfYear ? this.overrides.startOfYear(o) : Ys(o);
    }, this.options = { locale: G_, ...t }, this.overrides = n;
  }
  /**
   * Generates a mapping of Arabic digits (0-9) to the target numbering system
   * digits.
   *
   * @since 9.5.0
   * @returns A record mapping Arabic digits to the target numerals.
   */
  getDigitMap() {
    const { numerals: t = "latn" } = this.options, n = new Intl.NumberFormat("en-US", {
      numberingSystem: t
    }), o = {};
    for (let r = 0; r < 10; r++)
      o[r.toString()] = n.format(r);
    return o;
  }
  /**
   * Replaces Arabic digits in a string with the target numbering system digits.
   *
   * @since 9.5.0
   * @param input The string containing Arabic digits.
   * @returns The string with digits replaced.
   */
  replaceDigits(t) {
    const n = this.getDigitMap();
    return t.replace(/\d/g, (o) => n[o] || o);
  }
  /**
   * Formats a number using the configured numbering system.
   *
   * @since 9.5.0
   * @param value The number to format.
   * @returns The formatted number as a string.
   */
  formatNumber(t) {
    return this.replaceDigits(t.toString());
  }
  /**
   * Returns the preferred ordering for month and year labels for the current
   * locale.
   */
  getMonthYearOrder() {
    var n;
    const t = (n = this.options.locale) == null ? void 0 : n.code;
    return t && st.yearFirstLocales.has(t) ? "year-first" : "month-first";
  }
  /**
   * Formats the month/year pair respecting locale conventions.
   *
   * @since 9.11.0
   */
  formatMonthYear(t) {
    const { locale: n, timeZone: o, numerals: r } = this.options, i = n == null ? void 0 : n.code;
    if (i && st.yearFirstLocales.has(i))
      try {
        return new Intl.DateTimeFormat(i, {
          month: "long",
          year: "numeric",
          timeZone: o,
          numberingSystem: r
        }).format(t);
      } catch {
      }
    const a = this.getMonthYearOrder() === "year-first" ? "y LLLL" : "LLLL y";
    return this.format(t, a);
  }
}
st.yearFirstLocales = /* @__PURE__ */ new Set([
  "eu",
  "hu",
  "ja",
  "ja-Hira",
  "ja-JP",
  "ko",
  "ko-KR",
  "lt",
  "lt-LT",
  "lv",
  "lv-LV",
  "mn",
  "mn-MN",
  "zh",
  "zh-CN",
  "zh-HK",
  "zh-TW"
]);
const Zt = new st();
class V_ {
  constructor(t, n, o = Zt) {
    this.date = t, this.displayMonth = n, this.outside = !!(n && !o.isSameMonth(t, n)), this.dateLib = o, this.isoDate = o.format(t, "yyyy-MM-dd"), this.displayMonthId = o.format(n, "yyyy-MM"), this.dateMonthId = o.format(t, "yyyy-MM");
  }
  /**
   * Checks if this day is equal to another `CalendarDay`, considering both the
   * date and the displayed month.
   *
   * @param day The `CalendarDay` to compare with.
   * @returns `true` if the days are equal, otherwise `false`.
   */
  isEqualTo(t) {
    return this.dateLib.isSameDay(t.date, this.date) && this.dateLib.isSameMonth(t.displayMonth, this.displayMonth);
  }
}
class zR {
  constructor(t, n) {
    this.date = t, this.weeks = n;
  }
}
class RR {
  constructor(t, n) {
    this.days = n, this.weekNumber = t;
  }
}
function AR(e) {
  return R.createElement("button", { ...e });
}
function UR(e) {
  return R.createElement("span", { ...e });
}
function jR(e) {
  const { size: t = 24, orientation: n = "left", className: o } = e;
  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: handled by the parent component
    R.createElement(
      "svg",
      { className: o, width: t, height: t, viewBox: "0 0 24 24" },
      n === "up" && R.createElement("polygon", { points: "6.77 17 12.5 11.43 18.24 17 20 15.28 12.5 8 5 15.28" }),
      n === "down" && R.createElement("polygon", { points: "6.77 8 12.5 13.57 18.24 8 20 9.72 12.5 17 5 9.72" }),
      n === "left" && R.createElement("polygon", { points: "16 18.112 9.81111111 12 16 5.87733333 14.0888889 4 6 12 14.0888889 20" }),
      n === "right" && R.createElement("polygon", { points: "8 18.112 14.18888889 12 8 5.87733333 9.91111111 4 18 12 9.91111111 20" })
    )
  );
}
function FR(e) {
  const { day: t, modifiers: n, ...o } = e;
  return R.createElement("td", { ...o });
}
function WR(e) {
  const { day: t, modifiers: n, ...o } = e, r = R.useRef(null);
  return R.useEffect(() => {
    var i;
    n.focused && ((i = r.current) == null || i.focus());
  }, [n.focused]), R.createElement("button", { ref: r, ...o });
}
var Z;
(function(e) {
  e.Root = "root", e.Chevron = "chevron", e.Day = "day", e.DayButton = "day_button", e.CaptionLabel = "caption_label", e.Dropdowns = "dropdowns", e.Dropdown = "dropdown", e.DropdownRoot = "dropdown_root", e.Footer = "footer", e.MonthGrid = "month_grid", e.MonthCaption = "month_caption", e.MonthsDropdown = "months_dropdown", e.Month = "month", e.Months = "months", e.Nav = "nav", e.NextMonthButton = "button_next", e.PreviousMonthButton = "button_previous", e.Week = "week", e.Weeks = "weeks", e.Weekday = "weekday", e.Weekdays = "weekdays", e.WeekNumber = "week_number", e.WeekNumberHeader = "week_number_header", e.YearsDropdown = "years_dropdown";
})(Z || (Z = {}));
var Se;
(function(e) {
  e.disabled = "disabled", e.hidden = "hidden", e.outside = "outside", e.focused = "focused", e.today = "today";
})(Se || (Se = {}));
var bt;
(function(e) {
  e.range_end = "range_end", e.range_middle = "range_middle", e.range_start = "range_start", e.selected = "selected";
})(bt || (bt = {}));
var tt;
(function(e) {
  e.weeks_before_enter = "weeks_before_enter", e.weeks_before_exit = "weeks_before_exit", e.weeks_after_enter = "weeks_after_enter", e.weeks_after_exit = "weeks_after_exit", e.caption_after_enter = "caption_after_enter", e.caption_after_exit = "caption_after_exit", e.caption_before_enter = "caption_before_enter", e.caption_before_exit = "caption_before_exit";
})(tt || (tt = {}));
function LR(e) {
  const { options: t, className: n, components: o, classNames: r, ...i } = e, a = [r[Z.Dropdown], n].join(" "), s = t == null ? void 0 : t.find(({ value: c }) => c === i.value);
  return R.createElement(
    "span",
    { "data-disabled": i.disabled, className: r[Z.DropdownRoot] },
    R.createElement(o.Select, { className: a, ...i }, t == null ? void 0 : t.map(({ value: c, label: u, disabled: l }) => R.createElement(o.Option, { key: c, value: c, disabled: l }, u))),
    R.createElement(
      "span",
      { className: r[Z.CaptionLabel], "aria-hidden": !0 },
      s == null ? void 0 : s.label,
      R.createElement(o.Chevron, { orientation: "down", size: 18, className: r[Z.Chevron] })
    )
  );
}
function ZR(e) {
  return R.createElement("div", { ...e });
}
function YR(e) {
  return R.createElement("div", { ...e });
}
function BR(e) {
  const { calendarMonth: t, displayIndex: n, ...o } = e;
  return R.createElement("div", { ...o }, e.children);
}
function HR(e) {
  const { calendarMonth: t, displayIndex: n, ...o } = e;
  return R.createElement("div", { ...o });
}
function GR(e) {
  return R.createElement("table", { ...e });
}
function VR(e) {
  return R.createElement("div", { ...e });
}
const q_ = sS(void 0);
function mi() {
  const e = cS(q_);
  if (e === void 0)
    throw new Error("useDayPicker() must be used within a custom component.");
  return e;
}
function qR(e) {
  const { components: t } = mi();
  return R.createElement(t.Dropdown, { ...e });
}
function JR(e) {
  const { onPreviousClick: t, onNextClick: n, previousMonth: o, nextMonth: r, ...i } = e, { components: a, classNames: s, labels: { labelPrevious: c, labelNext: u } } = mi(), l = lt((f) => {
    r && (n == null || n(f));
  }, [r, n]), d = lt((f) => {
    o && (t == null || t(f));
  }, [o, t]);
  return R.createElement(
    "nav",
    { ...i },
    R.createElement(
      a.PreviousMonthButton,
      { type: "button", className: s[Z.PreviousMonthButton], tabIndex: o ? void 0 : -1, "aria-disabled": o ? void 0 : !0, "aria-label": c(o), onClick: d },
      R.createElement(a.Chevron, { disabled: o ? void 0 : !0, className: s[Z.Chevron], orientation: "left" })
    ),
    R.createElement(
      a.NextMonthButton,
      { type: "button", className: s[Z.NextMonthButton], tabIndex: r ? void 0 : -1, "aria-disabled": r ? void 0 : !0, "aria-label": u(r), onClick: l },
      R.createElement(a.Chevron, { disabled: r ? void 0 : !0, orientation: "right", className: s[Z.Chevron] })
    )
  );
}
function KR(e) {
  const { components: t } = mi();
  return R.createElement(t.Button, { ...e });
}
function XR(e) {
  return R.createElement("option", { ...e });
}
function QR(e) {
  const { components: t } = mi();
  return R.createElement(t.Button, { ...e });
}
function eA(e) {
  const { rootRef: t, ...n } = e;
  return R.createElement("div", { ...n, ref: t });
}
function tA(e) {
  return R.createElement("select", { ...e });
}
function nA(e) {
  const { week: t, ...n } = e;
  return R.createElement("tr", { ...n });
}
function rA(e) {
  return R.createElement("th", { ...e });
}
function oA(e) {
  return R.createElement(
    "thead",
    { "aria-hidden": !0 },
    R.createElement("tr", { ...e })
  );
}
function iA(e) {
  const { week: t, ...n } = e;
  return R.createElement("th", { ...n });
}
function aA(e) {
  return R.createElement("th", { ...e });
}
function sA(e) {
  return R.createElement("tbody", { ...e });
}
function cA(e) {
  const { components: t } = mi();
  return R.createElement(t.Dropdown, { ...e });
}
const uA = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Button: AR,
  CaptionLabel: UR,
  Chevron: jR,
  Day: FR,
  DayButton: WR,
  Dropdown: LR,
  DropdownNav: ZR,
  Footer: YR,
  Month: BR,
  MonthCaption: HR,
  MonthGrid: GR,
  Months: VR,
  MonthsDropdown: qR,
  Nav: JR,
  NextMonthButton: KR,
  Option: XR,
  PreviousMonthButton: QR,
  Root: eA,
  Select: tA,
  Week: nA,
  WeekNumber: iA,
  WeekNumberHeader: aA,
  Weekday: rA,
  Weekdays: oA,
  Weeks: sA,
  YearsDropdown: cA
}, Symbol.toStringTag, { value: "Module" }));
function qt(e, t, n = !1, o = Zt) {
  let { from: r, to: i } = e;
  const { differenceInCalendarDays: a, isSameDay: s } = o;
  return r && i ? (a(i, r) < 0 && ([r, i] = [i, r]), a(t, r) >= (n ? 1 : 0) && a(i, t) >= (n ? 1 : 0)) : !n && i ? s(i, t) : !n && r ? s(r, t) : !1;
}
function If(e) {
  return !!(e && typeof e == "object" && "before" in e && "after" in e);
}
function sc(e) {
  return !!(e && typeof e == "object" && "from" in e);
}
function Nf(e) {
  return !!(e && typeof e == "object" && "after" in e);
}
function Ef(e) {
  return !!(e && typeof e == "object" && "before" in e);
}
function J_(e) {
  return !!(e && typeof e == "object" && "dayOfWeek" in e);
}
function K_(e, t) {
  return Array.isArray(e) && e.every(t.isDate);
}
function Jt(e, t, n = Zt) {
  const o = Array.isArray(t) ? t : [t], { isSameDay: r, differenceInCalendarDays: i, isAfter: a } = n;
  return o.some((s) => {
    if (typeof s == "boolean")
      return s;
    if (n.isDate(s))
      return r(e, s);
    if (K_(s, n))
      return s.some((c) => r(e, c));
    if (sc(s))
      return qt(s, e, !1, n);
    if (J_(s))
      return Array.isArray(s.dayOfWeek) ? s.dayOfWeek.includes(e.getDay()) : s.dayOfWeek === e.getDay();
    if (If(s)) {
      const c = i(s.before, e), u = i(s.after, e), l = c > 0, d = u < 0;
      return a(s.before, s.after) ? d && l : l || d;
    }
    return Nf(s) ? i(e, s.after) > 0 : Ef(s) ? i(s.before, e) > 0 : typeof s == "function" ? s(e) : !1;
  });
}
function lA(e, t, n, o, r) {
  const { disabled: i, hidden: a, modifiers: s, showOutsideDays: c, broadcastCalendar: u, today: l = r.today() } = t, { isSameDay: d, isSameMonth: f, startOfMonth: h, isBefore: g, endOfMonth: p, isAfter: v } = r, b = n && h(n), _ = o && p(o), $ = {
    [Se.focused]: [],
    [Se.outside]: [],
    [Se.disabled]: [],
    [Se.hidden]: [],
    [Se.today]: []
  }, x = {};
  for (const S of e) {
    const { date: w, displayMonth: I } = S, D = !!(I && !f(w, I)), P = !!(b && g(w, b)), M = !!(_ && v(w, _)), B = !!(i && Jt(w, i, r)), K = !!(a && Jt(w, a, r)) || P || M || // Broadcast calendar will show outside days as default
    !u && !c && D || u && c === !1 && D, Q = d(w, l);
    D && $.outside.push(S), B && $.disabled.push(S), K && $.hidden.push(S), Q && $.today.push(S), s && Object.keys(s).forEach((V) => {
      const ue = s == null ? void 0 : s[V];
      ue && Jt(w, ue, r) && (x[V] ? x[V].push(S) : x[V] = [S]);
    });
  }
  return (S) => {
    const w = {
      [Se.focused]: !1,
      [Se.disabled]: !1,
      [Se.hidden]: !1,
      [Se.outside]: !1,
      [Se.today]: !1
    }, I = {};
    for (const D in $) {
      const P = $[D];
      w[D] = P.some((M) => M === S);
    }
    for (const D in x)
      I[D] = x[D].some((P) => P === S);
    return {
      ...w,
      // custom modifiers should override all the previous ones
      ...I
    };
  };
}
function dA(e, t, n = {}) {
  return Object.entries(e).filter(([, r]) => r === !0).reduce((r, [i]) => (n[i] ? r.push(n[i]) : t[Se[i]] ? r.push(t[Se[i]]) : t[bt[i]] && r.push(t[bt[i]]), r), [t[Z.Day]]);
}
function fA(e) {
  return {
    ...uA,
    ...e
  };
}
function mA(e) {
  const t = {
    "data-mode": e.mode ?? void 0,
    "data-required": "required" in e ? e.required : void 0,
    "data-multiple-months": e.numberOfMonths && e.numberOfMonths > 1 || void 0,
    "data-week-numbers": e.showWeekNumber || void 0,
    "data-broadcast-calendar": e.broadcastCalendar || void 0,
    "data-nav-layout": e.navLayout || void 0
  };
  return Object.entries(e).forEach(([n, o]) => {
    n.startsWith("data-") && (t[n] = o);
  }), t;
}
function Pf() {
  const e = {};
  for (const t in Z)
    e[Z[t]] = `rdp-${Z[t]}`;
  for (const t in Se)
    e[Se[t]] = `rdp-${Se[t]}`;
  for (const t in bt)
    e[bt[t]] = `rdp-${bt[t]}`;
  for (const t in tt)
    e[tt[t]] = `rdp-${tt[t]}`;
  return e;
}
function X_(e, t, n) {
  return (n ?? new st(t)).formatMonthYear(e);
}
const hA = X_;
function gA(e, t, n) {
  return (n ?? new st(t)).format(e, "d");
}
function pA(e, t = Zt) {
  return t.format(e, "LLLL");
}
function vA(e, t, n) {
  return (n ?? new st(t)).format(e, "cccccc");
}
function yA(e, t = Zt) {
  return e < 10 ? t.formatNumber(`0${e.toLocaleString()}`) : t.formatNumber(`${e.toLocaleString()}`);
}
function bA() {
  return "";
}
function Q_(e, t = Zt) {
  return t.format(e, "yyyy");
}
const wA = Q_, _A = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  formatCaption: X_,
  formatDay: gA,
  formatMonthCaption: hA,
  formatMonthDropdown: pA,
  formatWeekNumber: yA,
  formatWeekNumberHeader: bA,
  formatWeekdayName: vA,
  formatYearCaption: wA,
  formatYearDropdown: Q_
}, Symbol.toStringTag, { value: "Module" }));
function $A(e) {
  return e != null && e.formatMonthCaption && !e.formatCaption && (e.formatCaption = e.formatMonthCaption), e != null && e.formatYearCaption && !e.formatYearDropdown && (e.formatYearDropdown = e.formatYearCaption), {
    ..._A,
    ...e
  };
}
function Tf(e, t, n, o) {
  let r = (o ?? new st(n)).format(e, "PPPP");
  return t.today && (r = `Today, ${r}`), t.selected && (r = `${r}, selected`), r;
}
const kA = Tf;
function Cf(e, t, n) {
  return (n ?? new st(t)).formatMonthYear(e);
}
const xA = Cf;
function e$(e, t, n, o) {
  let r = (o ?? new st(n)).format(e, "PPPP");
  return t != null && t.today && (r = `Today, ${r}`), r;
}
function t$(e) {
  return "Choose the Month";
}
function n$() {
  return "";
}
const SA = "Go to the Next Month";
function r$(e, t) {
  return SA;
}
function o$(e) {
  return "Go to the Previous Month";
}
function i$(e, t, n) {
  return (n ?? new st(t)).format(e, "cccc");
}
function a$(e, t) {
  return `Week ${e}`;
}
function s$(e) {
  return "Week Number";
}
function c$(e) {
  return "Choose the Year";
}
const DA = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  labelCaption: xA,
  labelDay: kA,
  labelDayButton: Tf,
  labelGrid: Cf,
  labelGridcell: e$,
  labelMonthDropdown: t$,
  labelNav: n$,
  labelNext: r$,
  labelPrevious: o$,
  labelWeekNumber: a$,
  labelWeekNumberHeader: s$,
  labelWeekday: i$,
  labelYearDropdown: c$
}, Symbol.toStringTag, { value: "Module" })), pt = (e, t, n) => t || (n ? typeof n == "function" ? n : (...o) => n : e);
function OA(e, t) {
  var o;
  const n = ((o = t.locale) == null ? void 0 : o.labels) ?? {};
  return {
    ...DA,
    ...e ?? {},
    labelDayButton: pt(Tf, e == null ? void 0 : e.labelDayButton, n.labelDayButton),
    labelMonthDropdown: pt(t$, e == null ? void 0 : e.labelMonthDropdown, n.labelMonthDropdown),
    labelNext: pt(r$, e == null ? void 0 : e.labelNext, n.labelNext),
    labelPrevious: pt(o$, e == null ? void 0 : e.labelPrevious, n.labelPrevious),
    labelWeekNumber: pt(a$, e == null ? void 0 : e.labelWeekNumber, n.labelWeekNumber),
    labelYearDropdown: pt(c$, e == null ? void 0 : e.labelYearDropdown, n.labelYearDropdown),
    labelGrid: pt(Cf, e == null ? void 0 : e.labelGrid, n.labelGrid),
    labelGridcell: pt(e$, e == null ? void 0 : e.labelGridcell, n.labelGridcell),
    labelNav: pt(n$, e == null ? void 0 : e.labelNav, n.labelNav),
    labelWeekNumberHeader: pt(s$, e == null ? void 0 : e.labelWeekNumberHeader, n.labelWeekNumberHeader),
    labelWeekday: pt(i$, e == null ? void 0 : e.labelWeekday, n.labelWeekday)
  };
}
function IA(e, t, n, o, r) {
  const { startOfMonth: i, startOfYear: a, endOfYear: s, eachMonthOfInterval: c, getMonth: u } = r;
  return c({
    start: a(e),
    end: s(e)
  }).map((f) => {
    const h = o.formatMonthDropdown(f, r), g = u(f), p = t && f < i(t) || n && f > i(n) || !1;
    return { value: g, label: h, disabled: p };
  });
}
function NA(e, t = {}, n = {}) {
  let o = { ...t == null ? void 0 : t[Z.Day] };
  return Object.entries(e).filter(([, r]) => r === !0).forEach(([r]) => {
    o = {
      ...o,
      ...n == null ? void 0 : n[r]
    };
  }), o;
}
function EA(e, t, n, o) {
  const r = o ?? e.today(), i = n ? e.startOfBroadcastWeek(r, e) : t ? e.startOfISOWeek(r) : e.startOfWeek(r), a = [];
  for (let s = 0; s < 7; s++) {
    const c = e.addDays(i, s);
    a.push(c);
  }
  return a;
}
function PA(e, t, n, o, r = !1) {
  if (!e || !t)
    return;
  const { startOfYear: i, endOfYear: a, eachYearOfInterval: s, getYear: c } = o, u = i(e), l = a(t), d = s({ start: u, end: l });
  return r && d.reverse(), d.map((f) => {
    const h = n.formatYearDropdown(f, o);
    return {
      value: c(f),
      label: h,
      disabled: !1
    };
  });
}
function TA(e, t = {}) {
  var s;
  const { weekStartsOn: n, locale: o } = t, r = n ?? ((s = o == null ? void 0 : o.options) == null ? void 0 : s.weekStartsOn) ?? 0, i = (c) => {
    const u = typeof c == "number" || typeof c == "string" ? new Date(c) : c;
    return new Re(u.getFullYear(), u.getMonth(), u.getDate(), 12, 0, 0, e);
  }, a = (c) => {
    const u = i(c);
    return new Date(u.getFullYear(), u.getMonth(), u.getDate(), 0, 0, 0, 0);
  };
  return {
    today: () => i(Re.tz(e)),
    newDate: (c, u, l) => new Re(c, u, l, 12, 0, 0, e),
    startOfDay: (c) => i(c),
    startOfWeek: (c, u) => {
      const l = i(c), d = (u == null ? void 0 : u.weekStartsOn) ?? r, f = (l.getDay() - d + 7) % 7;
      return l.setDate(l.getDate() - f), l;
    },
    startOfISOWeek: (c) => {
      const u = i(c), l = (u.getDay() - 1 + 7) % 7;
      return u.setDate(u.getDate() - l), u;
    },
    startOfMonth: (c) => {
      const u = i(c);
      return u.setDate(1), u;
    },
    startOfYear: (c) => {
      const u = i(c);
      return u.setMonth(0, 1), u;
    },
    endOfWeek: (c, u) => {
      const l = i(c), h = ((((u == null ? void 0 : u.weekStartsOn) ?? r) + 6) % 7 - l.getDay() + 7) % 7;
      return l.setDate(l.getDate() + h), l;
    },
    endOfISOWeek: (c) => {
      const u = i(c), l = (7 - u.getDay()) % 7;
      return u.setDate(u.getDate() + l), u;
    },
    endOfMonth: (c) => {
      const u = i(c);
      return u.setMonth(u.getMonth() + 1, 0), u;
    },
    endOfYear: (c) => {
      const u = i(c);
      return u.setMonth(11, 31), u;
    },
    eachMonthOfInterval: (c) => {
      const u = i(c.start), l = i(c.end), d = [], f = new Re(u.getFullYear(), u.getMonth(), 1, 12, 0, 0, e), h = l.getFullYear() * 12 + l.getMonth();
      for (; f.getFullYear() * 12 + f.getMonth() <= h; )
        d.push(new Re(f, e)), f.setMonth(f.getMonth() + 1, 1);
      return d;
    },
    // Normalize to noon once before arithmetic (avoid DST/midnight edge cases),
    // mutate the same TZDate, and return it.
    addDays: (c, u) => {
      const l = i(c);
      return l.setDate(l.getDate() + u), l;
    },
    addWeeks: (c, u) => {
      const l = i(c);
      return l.setDate(l.getDate() + u * 7), l;
    },
    addMonths: (c, u) => {
      const l = i(c);
      return l.setMonth(l.getMonth() + u), l;
    },
    addYears: (c, u) => {
      const l = i(c);
      return l.setFullYear(l.getFullYear() + u), l;
    },
    eachYearOfInterval: (c) => {
      const u = i(c.start), l = i(c.end), d = [], f = new Re(u.getFullYear(), 0, 1, 12, 0, 0, e);
      for (; f.getFullYear() <= l.getFullYear(); )
        d.push(new Re(f, e)), f.setFullYear(f.getFullYear() + 1, 0, 1);
      return d;
    },
    getWeek: (c, u) => {
      var d;
      const l = a(c);
      return fi(l, {
        weekStartsOn: (u == null ? void 0 : u.weekStartsOn) ?? r,
        firstWeekContainsDate: (u == null ? void 0 : u.firstWeekContainsDate) ?? ((d = o == null ? void 0 : o.options) == null ? void 0 : d.firstWeekContainsDate) ?? 1
      });
    },
    getISOWeek: (c) => {
      const u = a(c);
      return di(u);
    },
    differenceInCalendarDays: (c, u) => {
      const l = a(c), d = a(u);
      return dt(l, d);
    },
    differenceInCalendarMonths: (c, u) => {
      const l = a(c), d = a(u);
      return _r(l, d);
    }
  };
}
const hi = (e) => e instanceof HTMLElement ? e : null, Yc = (e) => [
  ...e.querySelectorAll("[data-animated-month]") ?? []
], CA = (e) => hi(e.querySelector("[data-animated-month]")), Bc = (e) => hi(e.querySelector("[data-animated-caption]")), Hc = (e) => hi(e.querySelector("[data-animated-weeks]")), MA = (e) => hi(e.querySelector("[data-animated-nav]")), zA = (e) => hi(e.querySelector("[data-animated-weekdays]"));
function RA(e, t, { classNames: n, months: o, focused: r, dateLib: i }) {
  const a = Ai(null), s = Ai(o), c = Ai(!1);
  Zh(() => {
    const u = s.current;
    if (s.current = o, !t || !e.current || // safety check because the ref can be set to anything by consumers
    !(e.current instanceof HTMLElement) || // validation required for the animation to work as expected
    o.length === 0 || u.length === 0 || o.length !== u.length)
      return;
    const l = i.isSameMonth(o[0].date, u[0].date), d = i.isAfter(o[0].date, u[0].date), f = d ? n[tt.caption_after_enter] : n[tt.caption_before_enter], h = d ? n[tt.weeks_after_enter] : n[tt.weeks_before_enter], g = a.current, p = e.current.cloneNode(!0);
    if (p instanceof HTMLElement ? (Yc(p).forEach(($) => {
      if (!($ instanceof HTMLElement))
        return;
      const x = CA($);
      x && $.contains(x) && $.removeChild(x);
      const S = Bc($);
      S && S.classList.remove(f);
      const w = Hc($);
      w && w.classList.remove(h);
    }), a.current = p) : a.current = null, c.current || l || // skip animation if a day is focused because it can cause issues to the animation and is better for a11y
    r)
      return;
    const v = g instanceof HTMLElement ? Yc(g) : [], b = Yc(e.current);
    if (b != null && b.every((_) => _ instanceof HTMLElement) && v && v.every((_) => _ instanceof HTMLElement)) {
      c.current = !0, e.current.style.isolation = "isolate";
      const _ = MA(e.current);
      _ && (_.style.zIndex = "1"), b.forEach(($, x) => {
        const S = v[x];
        if (!S)
          return;
        $.style.position = "relative", $.style.overflow = "hidden";
        const w = Bc($);
        w && w.classList.add(f);
        const I = Hc($);
        I && I.classList.add(h);
        const D = () => {
          c.current = !1, e.current && (e.current.style.isolation = ""), _ && (_.style.zIndex = ""), w && w.classList.remove(f), I && I.classList.remove(h), $.style.position = "", $.style.overflow = "", $.contains(S) && $.removeChild(S);
        };
        S.style.pointerEvents = "none", S.style.position = "absolute", S.style.overflow = "hidden", S.setAttribute("aria-hidden", "true");
        const P = zA(S);
        P && (P.style.opacity = "0");
        const M = Bc(S);
        M && (M.classList.add(d ? n[tt.caption_before_exit] : n[tt.caption_after_exit]), M.addEventListener("animationend", D));
        const B = Hc(S);
        B && B.classList.add(d ? n[tt.weeks_before_exit] : n[tt.weeks_after_exit]), $.insertBefore(S, $.firstChild);
      });
    }
  });
}
function AA(e, t, n, o) {
  const r = e[0], i = e[e.length - 1], { ISOWeek: a, fixedWeeks: s, broadcastCalendar: c } = n ?? {}, { addDays: u, differenceInCalendarDays: l, differenceInCalendarMonths: d, endOfBroadcastWeek: f, endOfISOWeek: h, endOfMonth: g, endOfWeek: p, isAfter: v, startOfBroadcastWeek: b, startOfISOWeek: _, startOfWeek: $ } = o, x = c ? b(r, o) : a ? _(r) : $(r), S = c ? f(i) : a ? h(g(i)) : p(g(i)), w = t && (c ? f(t) : a ? h(t) : p(t)), I = w && v(S, w) ? w : S, D = l(I, x), P = d(i, r) + 1, M = [];
  for (let Q = 0; Q <= D; Q++) {
    const V = u(x, Q);
    M.push(V);
  }
  const K = (c ? 35 : 42) * P;
  if (s && M.length < K) {
    const Q = K - M.length;
    for (let V = 0; V < Q; V++) {
      const ue = u(M[M.length - 1], 1);
      M.push(ue);
    }
  }
  return M;
}
function UA(e) {
  const t = [];
  return e.reduce((n, o) => {
    const r = o.weeks.reduce((i, a) => i.concat(a.days.slice()), t.slice());
    return n.concat(r.slice());
  }, t.slice());
}
function jA(e, t, n, o) {
  const { numberOfMonths: r = 1 } = n, i = [];
  for (let a = 0; a < r; a++) {
    const s = o.addMonths(e, a);
    if (t && s > t)
      break;
    i.push(s);
  }
  return i;
}
function $h(e, t, n, o) {
  const { month: r, defaultMonth: i, today: a = o.today(), numberOfMonths: s = 1 } = e;
  let c = r || i || a;
  const { differenceInCalendarMonths: u, addMonths: l, startOfMonth: d } = o;
  if (n && u(n, c) < s - 1) {
    const f = -1 * (s - 1);
    c = l(n, f);
  }
  return t && u(c, t) < 0 && (c = t), d(c);
}
function FA(e, t, n, o) {
  const { addDays: r, endOfBroadcastWeek: i, endOfISOWeek: a, endOfMonth: s, endOfWeek: c, getISOWeek: u, getWeek: l, startOfBroadcastWeek: d, startOfISOWeek: f, startOfWeek: h } = o, g = e.reduce((p, v) => {
    const b = n.broadcastCalendar ? d(v, o) : n.ISOWeek ? f(v) : h(v), _ = n.broadcastCalendar ? i(v) : n.ISOWeek ? a(s(v)) : c(s(v)), $ = t.filter((I) => I >= b && I <= _), x = n.broadcastCalendar ? 35 : 42;
    if (n.fixedWeeks && $.length < x) {
      const I = t.filter((D) => {
        const P = x - $.length;
        return D > _ && D <= r(_, P);
      });
      $.push(...I);
    }
    const S = $.reduce((I, D) => {
      const P = n.ISOWeek ? u(D) : l(D), M = I.find((K) => K.weekNumber === P), B = new V_(D, v, o);
      return M ? M.days.push(B) : I.push(new RR(P, [B])), I;
    }, []), w = new zR(v, S);
    return p.push(w), p;
  }, []);
  return n.reverseMonths ? g.reverse() : g;
}
function WA(e, t) {
  let { startMonth: n, endMonth: o } = e;
  const { startOfYear: r, startOfDay: i, startOfMonth: a, endOfMonth: s, addYears: c, endOfYear: u, newDate: l, today: d } = t, { fromYear: f, toYear: h, fromMonth: g, toMonth: p } = e;
  !n && g && (n = g), !n && f && (n = t.newDate(f, 0, 1)), !o && p && (o = p), !o && h && (o = l(h, 11, 31));
  const v = e.captionLayout === "dropdown" || e.captionLayout === "dropdown-years";
  return n ? n = a(n) : f ? n = l(f, 0, 1) : !n && v && (n = r(c(e.today ?? d(), -100))), o ? o = s(o) : h ? o = l(h, 11, 31) : !o && v && (o = u(e.today ?? d())), [
    n && i(n),
    o && i(o)
  ];
}
function LA(e, t, n, o) {
  if (n.disableNavigation)
    return;
  const { pagedNavigation: r, numberOfMonths: i = 1 } = n, { startOfMonth: a, addMonths: s, differenceInCalendarMonths: c } = o, u = r ? i : 1, l = a(e);
  if (!t)
    return s(l, u);
  if (!(c(t, e) < i))
    return s(l, u);
}
function ZA(e, t, n, o) {
  if (n.disableNavigation)
    return;
  const { pagedNavigation: r, numberOfMonths: i } = n, { startOfMonth: a, addMonths: s, differenceInCalendarMonths: c } = o, u = r ? i ?? 1 : 1, l = a(e);
  if (!t)
    return s(l, -u);
  if (!(c(l, t) <= 0))
    return s(l, -u);
}
function YA(e) {
  const t = [];
  return e.reduce((n, o) => n.concat(o.weeks.slice()), t.slice());
}
function cc(e, t) {
  const [n, o] = Vi(e);
  return [t === void 0 ? n : t, o];
}
function BA(e, t) {
  var x;
  const [n, o] = WA(e, t), { startOfMonth: r, endOfMonth: i } = t, a = $h(e, n, o, t), [s, c] = cc(
    a,
    // initialMonth is always computed from props.month if provided
    e.month ? a : void 0
  );
  uS(() => {
    const S = $h(e, n, o, t);
    c(S);
  }, [e.timeZone]);
  const { months: u, weeks: l, days: d, previousMonth: f, nextMonth: h } = Ui(() => {
    const S = jA(s, o, { numberOfMonths: e.numberOfMonths }, t), w = AA(S, e.endMonth ? i(e.endMonth) : void 0, {
      ISOWeek: e.ISOWeek,
      fixedWeeks: e.fixedWeeks,
      broadcastCalendar: e.broadcastCalendar
    }, t), I = FA(S, w, {
      broadcastCalendar: e.broadcastCalendar,
      fixedWeeks: e.fixedWeeks,
      ISOWeek: e.ISOWeek,
      reverseMonths: e.reverseMonths
    }, t), D = YA(I), P = UA(I), M = ZA(s, n, e, t), B = LA(s, o, e, t);
    return {
      months: I,
      weeks: D,
      days: P,
      previousMonth: M,
      nextMonth: B
    };
  }, [
    t,
    s.getTime(),
    o == null ? void 0 : o.getTime(),
    n == null ? void 0 : n.getTime(),
    e.disableNavigation,
    e.broadcastCalendar,
    (x = e.endMonth) == null ? void 0 : x.getTime(),
    e.fixedWeeks,
    e.ISOWeek,
    e.numberOfMonths,
    e.pagedNavigation,
    e.reverseMonths
  ]), { disableNavigation: g, onMonthChange: p } = e, v = (S) => l.some((w) => w.days.some((I) => I.isEqualTo(S))), b = (S) => {
    if (g)
      return;
    let w = r(S);
    n && w < r(n) && (w = r(n)), o && w > r(o) && (w = r(o)), c(w), p == null || p(w);
  };
  return {
    months: u,
    weeks: l,
    days: d,
    navStart: n,
    navEnd: o,
    previousMonth: f,
    nextMonth: h,
    goToMonth: b,
    goToDay: (S) => {
      v(S) || b(S.date);
    }
  };
}
var Et;
(function(e) {
  e[e.Today = 0] = "Today", e[e.Selected = 1] = "Selected", e[e.LastFocused = 2] = "LastFocused", e[e.FocusedModifier = 3] = "FocusedModifier";
})(Et || (Et = {}));
function kh(e) {
  return !e[Se.disabled] && !e[Se.hidden] && !e[Se.outside];
}
function HA(e, t, n, o) {
  let r, i = -1;
  for (const a of e) {
    const s = t(a);
    kh(s) && (s[Se.focused] && i < Et.FocusedModifier ? (r = a, i = Et.FocusedModifier) : o != null && o.isEqualTo(a) && i < Et.LastFocused ? (r = a, i = Et.LastFocused) : n(a.date) && i < Et.Selected ? (r = a, i = Et.Selected) : s[Se.today] && i < Et.Today && (r = a, i = Et.Today));
  }
  return r || (r = e.find((a) => kh(t(a)))), r;
}
function GA(e, t, n, o, r, i, a) {
  const { ISOWeek: s, broadcastCalendar: c } = i, { addDays: u, addMonths: l, addWeeks: d, addYears: f, endOfBroadcastWeek: h, endOfISOWeek: g, endOfWeek: p, max: v, min: b, startOfBroadcastWeek: _, startOfISOWeek: $, startOfWeek: x } = a;
  let w = {
    day: u,
    week: d,
    month: l,
    year: f,
    startOfWeek: (I) => c ? _(I, a) : s ? $(I) : x(I),
    endOfWeek: (I) => c ? h(I) : s ? g(I) : p(I)
  }[e](n, t === "after" ? 1 : -1);
  return t === "before" && o ? w = v([o, w]) : t === "after" && r && (w = b([r, w])), w;
}
function u$(e, t, n, o, r, i, a, s = 0) {
  if (s > 365)
    return;
  const c = GA(e, t, n.date, o, r, i, a), u = !!(i.disabled && Jt(c, i.disabled, a)), l = !!(i.hidden && Jt(c, i.hidden, a)), d = c, f = new V_(c, d, a);
  return !u && !l ? f : u$(e, t, f, o, r, i, a, s + 1);
}
function VA(e, t, n, o, r) {
  const { autoFocus: i } = e, [a, s] = Vi(), c = HA(t.days, n, o || (() => !1), a), [u, l] = Vi(i ? c : void 0);
  return {
    isFocusTarget: (p) => !!(c != null && c.isEqualTo(p)),
    setFocused: l,
    focused: u,
    blur: () => {
      s(u), l(void 0);
    },
    moveFocus: (p, v) => {
      if (!u)
        return;
      const b = u$(p, v, u, t.navStart, t.navEnd, e, r);
      b && (e.disableNavigation && !t.days.some(($) => $.isEqualTo(b)) || (t.goToDay(b), l(b)));
    }
  };
}
function qA(e, t) {
  const { selected: n, required: o, onSelect: r } = e, [i, a] = cc(n, r ? n : void 0), s = r ? n : i, { isSameDay: c } = t, u = (h) => (s == null ? void 0 : s.some((g) => c(g, h))) ?? !1, { min: l, max: d } = e;
  return {
    selected: s,
    select: (h, g, p) => {
      let v = [...s ?? []];
      if (u(h)) {
        if ((s == null ? void 0 : s.length) === l || o && (s == null ? void 0 : s.length) === 1)
          return;
        v = s == null ? void 0 : s.filter((b) => !c(b, h));
      } else
        (s == null ? void 0 : s.length) === d ? v = [h] : v = [...v, h];
      return r || a(v), r == null || r(v, h, g, p), v;
    },
    isSelected: u
  };
}
function JA(e, t, n = 0, o = 0, r = !1, i = Zt) {
  const { from: a, to: s } = t || {}, { isSameDay: c, isAfter: u, isBefore: l } = i;
  let d;
  if (!a && !s)
    d = { from: e, to: n > 0 ? void 0 : e };
  else if (a && !s)
    c(a, e) ? n === 0 ? d = { from: a, to: e } : r ? d = { from: a, to: void 0 } : d = void 0 : l(e, a) ? d = { from: e, to: a } : d = { from: a, to: e };
  else if (a && s)
    if (c(a, e) && c(s, e))
      r ? d = { from: a, to: s } : d = void 0;
    else if (c(a, e))
      d = { from: a, to: n > 0 ? void 0 : e };
    else if (c(s, e))
      d = { from: e, to: n > 0 ? void 0 : e };
    else if (l(e, a))
      d = { from: e, to: s };
    else if (u(e, a))
      d = { from: a, to: e };
    else if (u(e, s))
      d = { from: a, to: e };
    else
      throw new Error("Invalid range");
  if (d != null && d.from && (d != null && d.to)) {
    const f = i.differenceInCalendarDays(d.to, d.from);
    o > 0 && f > o ? d = { from: e, to: void 0 } : n > 1 && f < n && (d = { from: e, to: void 0 });
  }
  return d;
}
function KA(e, t, n = Zt) {
  const o = Array.isArray(t) ? t : [t];
  let r = e.from;
  const i = n.differenceInCalendarDays(e.to, e.from), a = Math.min(i, 6);
  for (let s = 0; s <= a; s++) {
    if (o.includes(r.getDay()))
      return !0;
    r = n.addDays(r, 1);
  }
  return !1;
}
function xh(e, t, n = Zt) {
  return qt(e, t.from, !1, n) || qt(e, t.to, !1, n) || qt(t, e.from, !1, n) || qt(t, e.to, !1, n);
}
function XA(e, t, n = Zt) {
  const o = Array.isArray(t) ? t : [t];
  if (o.filter((s) => typeof s != "function").some((s) => typeof s == "boolean" ? s : n.isDate(s) ? qt(e, s, !1, n) : K_(s, n) ? s.some((c) => qt(e, c, !1, n)) : sc(s) ? s.from && s.to ? xh(e, { from: s.from, to: s.to }, n) : !1 : J_(s) ? KA(e, s.dayOfWeek, n) : If(s) ? n.isAfter(s.before, s.after) ? xh(e, {
    from: n.addDays(s.after, 1),
    to: n.addDays(s.before, -1)
  }, n) : Jt(e.from, s, n) || Jt(e.to, s, n) : Nf(s) || Ef(s) ? Jt(e.from, s, n) || Jt(e.to, s, n) : !1))
    return !0;
  const a = o.filter((s) => typeof s == "function");
  if (a.length) {
    let s = e.from;
    const c = n.differenceInCalendarDays(e.to, e.from);
    for (let u = 0; u <= c; u++) {
      if (a.some((l) => l(s)))
        return !0;
      s = n.addDays(s, 1);
    }
  }
  return !1;
}
function QA(e, t) {
  const { disabled: n, excludeDisabled: o, selected: r, required: i, onSelect: a } = e, [s, c] = cc(r, a ? r : void 0), u = a ? r : s;
  return {
    selected: u,
    select: (f, h, g) => {
      const { min: p, max: v } = e, b = f ? JA(f, u, p, v, i, t) : void 0;
      return o && n && (b != null && b.from) && b.to && XA({ from: b.from, to: b.to }, n, t) && (b.from = f, b.to = void 0), a || c(b), a == null || a(b, f, h, g), b;
    },
    isSelected: (f) => u && qt(u, f, !1, t)
  };
}
function e4(e, t) {
  const { selected: n, required: o, onSelect: r } = e, [i, a] = cc(n, r ? n : void 0), s = r ? n : i, { isSameDay: c } = t;
  return {
    selected: s,
    select: (d, f, h) => {
      let g = d;
      return !o && s && s && c(d, s) && (g = void 0), r || a(g), r == null || r(g, d, f, h), g;
    },
    isSelected: (d) => s ? c(s, d) : !1
  };
}
function t4(e, t) {
  const n = e4(e, t), o = qA(e, t), r = QA(e, t);
  switch (e.mode) {
    case "single":
      return n;
    case "multiple":
      return o;
    case "range":
      return r;
    default:
      return;
  }
}
function et(e, t) {
  return e instanceof Re && e.timeZone === t ? e : new Re(e, t);
}
function tr(e, t, n) {
  if (!n)
    return et(e, t);
  const o = et(e, t), r = new Re(o.getFullYear(), o.getMonth(), o.getDate(), 12, 0, 0, t);
  return new Date(r.getTime());
}
function Sh(e, t, n) {
  return typeof e == "boolean" || typeof e == "function" ? e : e instanceof Date ? tr(e, t, n) : Array.isArray(e) ? e.map((o) => o instanceof Date ? tr(o, t, n) : o) : sc(e) ? {
    ...e,
    from: e.from ? et(e.from, t) : e.from,
    to: e.to ? et(e.to, t) : e.to
  } : If(e) ? {
    before: tr(e.before, t, n),
    after: tr(e.after, t, n)
  } : Nf(e) ? {
    after: tr(e.after, t, n)
  } : Ef(e) ? {
    before: tr(e.before, t, n)
  } : e;
}
function Gc(e, t, n) {
  return e && (Array.isArray(e) ? e.map((o) => Sh(o, t, n)) : Sh(e, t, n));
}
function n4(e) {
  var um;
  let t = e;
  const n = t.timeZone;
  if (n && (t = {
    ...e,
    timeZone: n
  }, t.today && (t.today = et(t.today, n)), t.month && (t.month = et(t.month, n)), t.defaultMonth && (t.defaultMonth = et(t.defaultMonth, n)), t.startMonth && (t.startMonth = et(t.startMonth, n)), t.endMonth && (t.endMonth = et(t.endMonth, n)), t.mode === "single" && t.selected ? t.selected = et(t.selected, n) : t.mode === "multiple" && t.selected ? t.selected = (um = t.selected) == null ? void 0 : um.map((re) => et(re, n)) : t.mode === "range" && t.selected && (t.selected = {
    from: t.selected.from ? et(t.selected.from, n) : t.selected.from,
    to: t.selected.to ? et(t.selected.to, n) : t.selected.to
  }), t.disabled !== void 0 && (t.disabled = Gc(t.disabled, n)), t.hidden !== void 0 && (t.hidden = Gc(t.hidden, n)), t.modifiers)) {
    const re = {};
    Object.keys(t.modifiers).forEach((ve) => {
      var J;
      re[ve] = Gc((J = t.modifiers) == null ? void 0 : J[ve], n);
    }), t.modifiers = re;
  }
  const { components: o, formatters: r, labels: i, dateLib: a, locale: s, classNames: c } = Ui(() => {
    const re = { ...G_, ...t.locale }, ve = t.broadcastCalendar ? 1 : t.weekStartsOn, J = t.noonSafe && t.timeZone ? TA(t.timeZone, {
      weekStartsOn: ve,
      locale: re
    }) : void 0, he = t.dateLib && J ? { ...J, ...t.dateLib } : t.dateLib ?? J, Qe = new st({
      locale: re,
      weekStartsOn: ve,
      firstWeekContainsDate: t.firstWeekContainsDate,
      useAdditionalWeekYearTokens: t.useAdditionalWeekYearTokens,
      useAdditionalDayOfYearTokens: t.useAdditionalDayOfYearTokens,
      timeZone: t.timeZone,
      numerals: t.numerals
    }, he);
    return {
      dateLib: Qe,
      components: fA(t.components),
      formatters: $A(t.formatters),
      labels: OA(t.labels, Qe.options),
      locale: re,
      classNames: { ...Pf(), ...t.classNames }
    };
  }, [
    t.locale,
    t.broadcastCalendar,
    t.weekStartsOn,
    t.firstWeekContainsDate,
    t.useAdditionalWeekYearTokens,
    t.useAdditionalDayOfYearTokens,
    t.timeZone,
    t.numerals,
    t.dateLib,
    t.noonSafe,
    t.components,
    t.formatters,
    t.labels,
    t.classNames
  ]);
  t.today || (t = { ...t, today: a.today() });
  const { captionLayout: u, mode: l, navLayout: d, numberOfMonths: f = 1, onDayBlur: h, onDayClick: g, onDayFocus: p, onDayKeyDown: v, onDayMouseEnter: b, onDayMouseLeave: _, onNextClick: $, onPrevClick: x, showWeekNumber: S, styles: w } = t, { formatCaption: I, formatDay: D, formatMonthDropdown: P, formatWeekNumber: M, formatWeekNumberHeader: B, formatWeekdayName: K, formatYearDropdown: Q } = r, V = BA(t, a), { days: ue, months: H, navStart: ce, navEnd: T, previousMonth: A, nextMonth: oe, goToMonth: se } = V, ke = lA(ue, t, ce, T, a), { isSelected: me, select: pe, selected: ze } = t4(t, a) ?? {}, { blur: Xe, focused: fe, isFocusTarget: Ot, moveFocus: Ee, setFocused: Ze } = VA(t, V, ke, me ?? (() => !1), a), { labelDayButton: ln, labelGridcell: Ht, labelGrid: On, labelMonthDropdown: _i, labelNav: $i, labelPrevious: kc, labelNext: xc, labelWeekday: Sc, labelWeekNumber: Vn, labelWeekNumberHeader: Mx, labelYearDropdown: zx } = i, Rx = Ui(() => EA(a, t.ISOWeek, t.broadcastCalendar, t.today), [a, t.ISOWeek, t.broadcastCalendar, t.today]), sm = l !== void 0 || g !== void 0, Dc = lt(() => {
    A && (se(A), x == null || x(A));
  }, [A, se, x]), Oc = lt(() => {
    oe && (se(oe), $ == null || $(oe));
  }, [se, oe, $]), Ax = lt((re, ve) => (J) => {
    J.preventDefault(), J.stopPropagation(), Ze(re), !ve.disabled && (pe == null || pe(re.date, ve, J), g == null || g(re.date, ve, J));
  }, [pe, g, Ze]), Ux = lt((re, ve) => (J) => {
    Ze(re), p == null || p(re.date, ve, J);
  }, [p, Ze]), jx = lt((re, ve) => (J) => {
    Xe(), h == null || h(re.date, ve, J);
  }, [Xe, h]), Fx = lt((re, ve) => (J) => {
    const he = {
      ArrowLeft: [
        J.shiftKey ? "month" : "day",
        t.dir === "rtl" ? "after" : "before"
      ],
      ArrowRight: [
        J.shiftKey ? "month" : "day",
        t.dir === "rtl" ? "before" : "after"
      ],
      ArrowDown: [J.shiftKey ? "year" : "week", "after"],
      ArrowUp: [J.shiftKey ? "year" : "week", "before"],
      PageUp: [J.shiftKey ? "year" : "month", "before"],
      PageDown: [J.shiftKey ? "year" : "month", "after"],
      Home: ["startOfWeek", "before"],
      End: ["endOfWeek", "after"]
    };
    if (he[J.key]) {
      J.preventDefault(), J.stopPropagation();
      const [Qe, le] = he[J.key];
      Ee(Qe, le);
    }
    v == null || v(re.date, ve, J);
  }, [Ee, v, t.dir]), Wx = lt((re, ve) => (J) => {
    b == null || b(re.date, ve, J);
  }, [b]), Lx = lt((re, ve) => (J) => {
    _ == null || _(re.date, ve, J);
  }, [_]), Zx = lt((re) => (ve) => {
    const J = Number(ve.target.value), he = a.setMonth(a.startOfMonth(re), J);
    se(he);
  }, [a, se]), Yx = lt((re) => (ve) => {
    const J = Number(ve.target.value), he = a.setYear(a.startOfMonth(re), J);
    se(he);
  }, [a, se]), { className: Bx, style: Hx } = Ui(() => ({
    className: [c[Z.Root], t.className].filter(Boolean).join(" "),
    style: { ...w == null ? void 0 : w[Z.Root], ...t.style }
  }), [c, t.className, t.style, w]), Gx = mA(t), cm = Ai(null);
  RA(cm, !!t.animate, {
    classNames: c,
    months: H,
    focused: fe,
    dateLib: a
  });
  const Vx = {
    dayPickerProps: t,
    selected: ze,
    select: pe,
    isSelected: me,
    months: H,
    nextMonth: oe,
    previousMonth: A,
    goToMonth: se,
    getModifiers: ke,
    components: o,
    classNames: c,
    styles: w,
    labels: i,
    formatters: r
  };
  return R.createElement(
    q_.Provider,
    { value: Vx },
    R.createElement(
      o.Root,
      { rootRef: t.animate ? cm : void 0, className: Bx, style: Hx, dir: t.dir, id: t.id, lang: t.lang, nonce: t.nonce, title: t.title, role: t.role, "aria-label": t["aria-label"], "aria-labelledby": t["aria-labelledby"], ...Gx },
      R.createElement(
        o.Months,
        { className: c[Z.Months], style: w == null ? void 0 : w[Z.Months] },
        !t.hideNavigation && !d && R.createElement(o.Nav, { "data-animated-nav": t.animate ? "true" : void 0, className: c[Z.Nav], style: w == null ? void 0 : w[Z.Nav], "aria-label": $i(), onPreviousClick: Dc, onNextClick: Oc, previousMonth: A, nextMonth: oe }),
        H.map((re, ve) => R.createElement(
          o.Month,
          {
            "data-animated-month": t.animate ? "true" : void 0,
            className: c[Z.Month],
            style: w == null ? void 0 : w[Z.Month],
            // biome-ignore lint/suspicious/noArrayIndexKey: breaks animation
            key: ve,
            displayIndex: ve,
            calendarMonth: re
          },
          d === "around" && !t.hideNavigation && ve === 0 && R.createElement(
            o.PreviousMonthButton,
            { type: "button", className: c[Z.PreviousMonthButton], tabIndex: A ? void 0 : -1, "aria-disabled": A ? void 0 : !0, "aria-label": kc(A), onClick: Dc, "data-animated-button": t.animate ? "true" : void 0 },
            R.createElement(o.Chevron, { disabled: A ? void 0 : !0, className: c[Z.Chevron], orientation: t.dir === "rtl" ? "right" : "left" })
          ),
          R.createElement(o.MonthCaption, { "data-animated-caption": t.animate ? "true" : void 0, className: c[Z.MonthCaption], style: w == null ? void 0 : w[Z.MonthCaption], calendarMonth: re, displayIndex: ve }, u != null && u.startsWith("dropdown") ? R.createElement(
            o.DropdownNav,
            { className: c[Z.Dropdowns], style: w == null ? void 0 : w[Z.Dropdowns] },
            (() => {
              const J = u === "dropdown" || u === "dropdown-months" ? R.createElement(o.MonthsDropdown, { key: "month", className: c[Z.MonthsDropdown], "aria-label": _i(), classNames: c, components: o, disabled: !!t.disableNavigation, onChange: Zx(re.date), options: IA(re.date, ce, T, r, a), style: w == null ? void 0 : w[Z.Dropdown], value: a.getMonth(re.date) }) : R.createElement("span", { key: "month" }, P(re.date, a)), he = u === "dropdown" || u === "dropdown-years" ? R.createElement(o.YearsDropdown, { key: "year", className: c[Z.YearsDropdown], "aria-label": zx(a.options), classNames: c, components: o, disabled: !!t.disableNavigation, onChange: Yx(re.date), options: PA(ce, T, r, a, !!t.reverseYears), style: w == null ? void 0 : w[Z.Dropdown], value: a.getYear(re.date) }) : R.createElement("span", { key: "year" }, Q(re.date, a));
              return a.getMonthYearOrder() === "year-first" ? [he, J] : [J, he];
            })(),
            R.createElement("span", { role: "status", "aria-live": "polite", style: {
              border: 0,
              clip: "rect(0 0 0 0)",
              height: "1px",
              margin: "-1px",
              overflow: "hidden",
              padding: 0,
              position: "absolute",
              width: "1px",
              whiteSpace: "nowrap",
              wordWrap: "normal"
            } }, I(re.date, a.options, a))
          ) : R.createElement(o.CaptionLabel, { className: c[Z.CaptionLabel], role: "status", "aria-live": "polite" }, I(re.date, a.options, a))),
          d === "around" && !t.hideNavigation && ve === f - 1 && R.createElement(
            o.NextMonthButton,
            { type: "button", className: c[Z.NextMonthButton], tabIndex: oe ? void 0 : -1, "aria-disabled": oe ? void 0 : !0, "aria-label": xc(oe), onClick: Oc, "data-animated-button": t.animate ? "true" : void 0 },
            R.createElement(o.Chevron, { disabled: oe ? void 0 : !0, className: c[Z.Chevron], orientation: t.dir === "rtl" ? "left" : "right" })
          ),
          ve === f - 1 && d === "after" && !t.hideNavigation && R.createElement(o.Nav, { "data-animated-nav": t.animate ? "true" : void 0, className: c[Z.Nav], style: w == null ? void 0 : w[Z.Nav], "aria-label": $i(), onPreviousClick: Dc, onNextClick: Oc, previousMonth: A, nextMonth: oe }),
          R.createElement(
            o.MonthGrid,
            { role: "grid", "aria-multiselectable": l === "multiple" || l === "range", "aria-label": On(re.date, a.options, a) || void 0, className: c[Z.MonthGrid], style: w == null ? void 0 : w[Z.MonthGrid] },
            !t.hideWeekdays && R.createElement(
              o.Weekdays,
              { "data-animated-weekdays": t.animate ? "true" : void 0, className: c[Z.Weekdays], style: w == null ? void 0 : w[Z.Weekdays] },
              S && R.createElement(o.WeekNumberHeader, { "aria-label": Mx(a.options), className: c[Z.WeekNumberHeader], style: w == null ? void 0 : w[Z.WeekNumberHeader], scope: "col" }, B()),
              Rx.map((J) => R.createElement(o.Weekday, { "aria-label": Sc(J, a.options, a), className: c[Z.Weekday], key: String(J), style: w == null ? void 0 : w[Z.Weekday], scope: "col" }, K(J, a.options, a)))
            ),
            R.createElement(o.Weeks, { "data-animated-weeks": t.animate ? "true" : void 0, className: c[Z.Weeks], style: w == null ? void 0 : w[Z.Weeks] }, re.weeks.map((J) => R.createElement(
              o.Week,
              { className: c[Z.Week], key: J.weekNumber, style: w == null ? void 0 : w[Z.Week], week: J },
              S && R.createElement(o.WeekNumber, { week: J, style: w == null ? void 0 : w[Z.WeekNumber], "aria-label": Vn(J.weekNumber, {
                locale: s
              }), className: c[Z.WeekNumber], scope: "row", role: "rowheader" }, M(J.weekNumber, a)),
              J.days.map((he) => {
                const { date: Qe } = he, le = ke(he);
                if (le[Se.focused] = !le.hidden && !!(fe != null && fe.isEqualTo(he)), le[bt.selected] = (me == null ? void 0 : me(Qe)) || le.selected, sc(ze)) {
                  const { from: Ic, to: Nc } = ze;
                  le[bt.range_start] = !!(Ic && Nc && a.isSameDay(Qe, Ic)), le[bt.range_end] = !!(Ic && Nc && a.isSameDay(Qe, Nc)), le[bt.range_middle] = qt(ze, Qe, !0, a);
                }
                const qx = NA(le, w, t.modifiersStyles), Jx = dA(le, c, t.modifiersClassNames), Kx = !sm && !le.hidden ? Ht(Qe, le, a.options, a) : void 0;
                return R.createElement(o.Day, { key: `${he.isoDate}_${he.displayMonthId}`, day: he, modifiers: le, className: Jx.join(" "), style: qx, role: "gridcell", "aria-selected": le.selected || void 0, "aria-label": Kx, "data-day": he.isoDate, "data-month": he.outside ? he.dateMonthId : void 0, "data-selected": le.selected || void 0, "data-disabled": le.disabled || void 0, "data-hidden": le.hidden || void 0, "data-outside": he.outside || void 0, "data-focused": le.focused || void 0, "data-today": le.today || void 0 }, !le.hidden && sm ? R.createElement(o.DayButton, { className: c[Z.DayButton], style: w == null ? void 0 : w[Z.DayButton], type: "button", day: he, modifiers: le, disabled: !le.focused && le.disabled || void 0, "aria-disabled": le.focused && le.disabled || void 0, tabIndex: Ot(he) ? 0 : -1, "aria-label": ln(Qe, le, a.options, a), onClick: Ax(he, le), onBlur: jx(he, le), onFocus: Ux(he, le), onKeyDown: Fx(he, le), onMouseEnter: Wx(he, le), onMouseLeave: Lx(he, le) }, D(Qe, a.options, a)) : !le.hidden && D(he.date, a.options, a));
              })
            )))
          )
        ))
      ),
      t.footer && R.createElement(o.Footer, { className: c[Z.Footer], style: w == null ? void 0 : w[Z.Footer], role: "status", "aria-live": "polite" }, t.footer)
    )
  );
}
function u2({
  className: e,
  classNames: t,
  showOutsideDays: n = !0,
  captionLayout: o = "label",
  buttonVariant: r = "ghost",
  formatters: i,
  components: a,
  ...s
}) {
  const c = Pf();
  return /* @__PURE__ */ y(
    n4,
    {
      showOutsideDays: n,
      className: z(
        "group/calendar bg-background p-3 [--cell-size:2rem] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        e
      ),
      captionLayout: o,
      hideNavigation: !1,
      formatters: {
        formatMonthDropdown: (u) => u.toLocaleString("default", { month: "short" }),
        ...i
      },
      classNames: {
        root: z("w-fit", c.root),
        months: z("relative flex flex-col gap-4 md:flex-row", c.months),
        month: z("flex w-full flex-col gap-4", c.month),
        nav: z(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
          c.nav
        ),
        button_previous: z(
          mu({ variant: r }),
          "h-[--cell-size] w-[--cell-size] select-none p-0 aria-disabled:opacity-50",
          c.button_previous
        ),
        button_next: z(
          mu({ variant: r }),
          "h-[--cell-size] w-[--cell-size] select-none p-0 aria-disabled:opacity-50",
          c.button_next
        ),
        month_caption: z(
          "flex h-[--cell-size] w-full items-center justify-center px-[--cell-size]",
          c.month_caption
        ),
        dropdowns: z(
          "flex h-[--cell-size] w-full items-center justify-center gap-1.5 text-sm font-medium",
          c.dropdowns
        ),
        dropdown_root: z(
          "has-focus:border-ring border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] relative rounded-md border",
          c.dropdown_root
        ),
        dropdown: z(
          "bg-popover absolute inset-0 cursor-pointer opacity-0",
          c.dropdown
        ),
        caption_label: z(
          "select-none font-medium",
          o === "label" ? "text-sm" : "[&>svg]:text-muted-foreground flex h-8 items-center gap-1 rounded-md pl-2 pr-1 text-sm [&>svg]:size-3.5",
          c.caption_label
        ),
        table: "w-full border-collapse",
        weekdays: z("flex", c.weekdays),
        weekday: z(
          "text-muted-foreground flex-1 select-none rounded-md text-[0.8rem] font-normal",
          c.weekday
        ),
        week: z("mt-2 flex w-full", c.week),
        week_number_header: z("w-[--cell-size] select-none", c.week_number_header),
        week_number: z(
          "text-muted-foreground select-none text-[0.8rem]",
          c.week_number
        ),
        day: z(
          "group/day relative aspect-square h-full w-full select-none p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md",
          c.day
        ),
        range_start: z("bg-accent rounded-l-md", c.range_start),
        range_middle: z("rounded-none", c.range_middle),
        range_end: z("bg-accent rounded-r-md", c.range_end),
        today: z(
          "bg-accent text-accent-foreground rounded-md data-[selected=true]:rounded-none",
          c.today
        ),
        outside: z(
          "text-muted-foreground aria-selected:text-muted-foreground",
          c.outside
        ),
        disabled: z("text-muted-foreground opacity-50", c.disabled),
        hidden: z("invisible", c.hidden),
        ...t
      },
      components: {
        Root: ({ className: u, rootRef: l, ...d }) => /* @__PURE__ */ y("div", { "data-slot": "calendar", ref: l, className: z(u), ...d }),
        Chevron: ({ className: u, orientation: l, ...d }) => l === "left" ? /* @__PURE__ */ y(eS, { className: z("size-4", u), ...d }) : l === "right" ? /* @__PURE__ */ y(tS, { className: z("size-4", u), ...d }) : /* @__PURE__ */ y(nS, { className: z("size-4", u), ...d }),
        DayButton: r4,
        WeekNumber: ({ children: u, ...l }) => /* @__PURE__ */ y("td", { ...l, children: /* @__PURE__ */ y("div", { className: "flex size-[--cell-size] items-center justify-center text-center", children: u }) }),
        ...a
      },
      ...s
    }
  );
}
function r4({
  className: e,
  day: t,
  modifiers: n,
  ...o
}) {
  const r = Pf(), i = m.useRef(null);
  return m.useEffect(() => {
    var a;
    n.focused && ((a = i.current) == null || a.focus());
  }, [n.focused]), /* @__PURE__ */ y(
    a_,
    {
      ref: i,
      variant: "ghost",
      size: "icon",
      "data-day": t.date.toLocaleDateString(),
      "data-selected-single": !!(n.selected && !n.range_start && !n.range_end && !n.range_middle),
      "data-range-start": n.range_start,
      "data-range-end": n.range_end,
      "data-range-middle": n.range_middle,
      className: z(
        "flex aspect-square h-auto w-full min-w-[--cell-size] flex-col gap-1 font-normal leading-none data-[range-end=true]:rounded-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md data-[range-end=true]:bg-primary data-[range-middle=true]:bg-accent data-[range-start=true]:bg-primary data-[selected-single=true]:bg-primary data-[range-end=true]:text-primary-foreground data-[range-middle=true]:text-accent-foreground data-[range-start=true]:text-primary-foreground data-[selected-single=true]:text-primary-foreground group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-[3px] group-data-[focused=true]/day:ring-ring/50 [&>span]:text-xs [&>span]:opacity-70",
        r.day,
        e
      ),
      ...o
    }
  );
}
const o4 = ["top", "right", "bottom", "left"], yn = Math.min, nt = Math.max, ha = Math.round, Ri = Math.floor, jt = (e) => ({
  x: e,
  y: e
}), i4 = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
}, a4 = {
  start: "end",
  end: "start"
};
function vu(e, t, n) {
  return nt(e, yn(t, n));
}
function an(e, t) {
  return typeof e == "function" ? e(t) : e;
}
function sn(e) {
  return e.split("-")[0];
}
function Yr(e) {
  return e.split("-")[1];
}
function Mf(e) {
  return e === "x" ? "y" : "x";
}
function zf(e) {
  return e === "y" ? "height" : "width";
}
const s4 = /* @__PURE__ */ new Set(["top", "bottom"]);
function At(e) {
  return s4.has(sn(e)) ? "y" : "x";
}
function Rf(e) {
  return Mf(At(e));
}
function c4(e, t, n) {
  n === void 0 && (n = !1);
  const o = Yr(e), r = Rf(e), i = zf(r);
  let a = r === "x" ? o === (n ? "end" : "start") ? "right" : "left" : o === "start" ? "bottom" : "top";
  return t.reference[i] > t.floating[i] && (a = ga(a)), [a, ga(a)];
}
function u4(e) {
  const t = ga(e);
  return [yu(e), t, yu(t)];
}
function yu(e) {
  return e.replace(/start|end/g, (t) => a4[t]);
}
const Dh = ["left", "right"], Oh = ["right", "left"], l4 = ["top", "bottom"], d4 = ["bottom", "top"];
function f4(e, t, n) {
  switch (e) {
    case "top":
    case "bottom":
      return n ? t ? Oh : Dh : t ? Dh : Oh;
    case "left":
    case "right":
      return t ? l4 : d4;
    default:
      return [];
  }
}
function m4(e, t, n, o) {
  const r = Yr(e);
  let i = f4(sn(e), n === "start", o);
  return r && (i = i.map((a) => a + "-" + r), t && (i = i.concat(i.map(yu)))), i;
}
function ga(e) {
  return e.replace(/left|right|bottom|top/g, (t) => i4[t]);
}
function h4(e) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...e
  };
}
function l$(e) {
  return typeof e != "number" ? h4(e) : {
    top: e,
    right: e,
    bottom: e,
    left: e
  };
}
function pa(e) {
  const {
    x: t,
    y: n,
    width: o,
    height: r
  } = e;
  return {
    width: o,
    height: r,
    top: n,
    left: t,
    right: t + o,
    bottom: n + r,
    x: t,
    y: n
  };
}
function Ih(e, t, n) {
  let {
    reference: o,
    floating: r
  } = e;
  const i = At(t), a = Rf(t), s = zf(a), c = sn(t), u = i === "y", l = o.x + o.width / 2 - r.width / 2, d = o.y + o.height / 2 - r.height / 2, f = o[s] / 2 - r[s] / 2;
  let h;
  switch (c) {
    case "top":
      h = {
        x: l,
        y: o.y - r.height
      };
      break;
    case "bottom":
      h = {
        x: l,
        y: o.y + o.height
      };
      break;
    case "right":
      h = {
        x: o.x + o.width,
        y: d
      };
      break;
    case "left":
      h = {
        x: o.x - r.width,
        y: d
      };
      break;
    default:
      h = {
        x: o.x,
        y: o.y
      };
  }
  switch (Yr(t)) {
    case "start":
      h[a] -= f * (n && u ? -1 : 1);
      break;
    case "end":
      h[a] += f * (n && u ? -1 : 1);
      break;
  }
  return h;
}
const g4 = async (e, t, n) => {
  const {
    placement: o = "bottom",
    strategy: r = "absolute",
    middleware: i = [],
    platform: a
  } = n, s = i.filter(Boolean), c = await (a.isRTL == null ? void 0 : a.isRTL(t));
  let u = await a.getElementRects({
    reference: e,
    floating: t,
    strategy: r
  }), {
    x: l,
    y: d
  } = Ih(u, o, c), f = o, h = {}, g = 0;
  for (let p = 0; p < s.length; p++) {
    const {
      name: v,
      fn: b
    } = s[p], {
      x: _,
      y: $,
      data: x,
      reset: S
    } = await b({
      x: l,
      y: d,
      initialPlacement: o,
      placement: f,
      strategy: r,
      middlewareData: h,
      rects: u,
      platform: a,
      elements: {
        reference: e,
        floating: t
      }
    });
    l = _ ?? l, d = $ ?? d, h = {
      ...h,
      [v]: {
        ...h[v],
        ...x
      }
    }, S && g <= 50 && (g++, typeof S == "object" && (S.placement && (f = S.placement), S.rects && (u = S.rects === !0 ? await a.getElementRects({
      reference: e,
      floating: t,
      strategy: r
    }) : S.rects), {
      x: l,
      y: d
    } = Ih(u, f, c)), p = -1);
  }
  return {
    x: l,
    y: d,
    placement: f,
    strategy: r,
    middlewareData: h
  };
};
async function io(e, t) {
  var n;
  t === void 0 && (t = {});
  const {
    x: o,
    y: r,
    platform: i,
    rects: a,
    elements: s,
    strategy: c
  } = e, {
    boundary: u = "clippingAncestors",
    rootBoundary: l = "viewport",
    elementContext: d = "floating",
    altBoundary: f = !1,
    padding: h = 0
  } = an(t, e), g = l$(h), v = s[f ? d === "floating" ? "reference" : "floating" : d], b = pa(await i.getClippingRect({
    element: (n = await (i.isElement == null ? void 0 : i.isElement(v))) == null || n ? v : v.contextElement || await (i.getDocumentElement == null ? void 0 : i.getDocumentElement(s.floating)),
    boundary: u,
    rootBoundary: l,
    strategy: c
  })), _ = d === "floating" ? {
    x: o,
    y: r,
    width: a.floating.width,
    height: a.floating.height
  } : a.reference, $ = await (i.getOffsetParent == null ? void 0 : i.getOffsetParent(s.floating)), x = await (i.isElement == null ? void 0 : i.isElement($)) ? await (i.getScale == null ? void 0 : i.getScale($)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  }, S = pa(i.convertOffsetParentRelativeRectToViewportRelativeRect ? await i.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements: s,
    rect: _,
    offsetParent: $,
    strategy: c
  }) : _);
  return {
    top: (b.top - S.top + g.top) / x.y,
    bottom: (S.bottom - b.bottom + g.bottom) / x.y,
    left: (b.left - S.left + g.left) / x.x,
    right: (S.right - b.right + g.right) / x.x
  };
}
const p4 = (e) => ({
  name: "arrow",
  options: e,
  async fn(t) {
    const {
      x: n,
      y: o,
      placement: r,
      rects: i,
      platform: a,
      elements: s,
      middlewareData: c
    } = t, {
      element: u,
      padding: l = 0
    } = an(e, t) || {};
    if (u == null)
      return {};
    const d = l$(l), f = {
      x: n,
      y: o
    }, h = Rf(r), g = zf(h), p = await a.getDimensions(u), v = h === "y", b = v ? "top" : "left", _ = v ? "bottom" : "right", $ = v ? "clientHeight" : "clientWidth", x = i.reference[g] + i.reference[h] - f[h] - i.floating[g], S = f[h] - i.reference[h], w = await (a.getOffsetParent == null ? void 0 : a.getOffsetParent(u));
    let I = w ? w[$] : 0;
    (!I || !await (a.isElement == null ? void 0 : a.isElement(w))) && (I = s.floating[$] || i.floating[g]);
    const D = x / 2 - S / 2, P = I / 2 - p[g] / 2 - 1, M = yn(d[b], P), B = yn(d[_], P), K = M, Q = I - p[g] - B, V = I / 2 - p[g] / 2 + D, ue = vu(K, V, Q), H = !c.arrow && Yr(r) != null && V !== ue && i.reference[g] / 2 - (V < K ? M : B) - p[g] / 2 < 0, ce = H ? V < K ? V - K : V - Q : 0;
    return {
      [h]: f[h] + ce,
      data: {
        [h]: ue,
        centerOffset: V - ue - ce,
        ...H && {
          alignmentOffset: ce
        }
      },
      reset: H
    };
  }
}), v4 = function(e) {
  return e === void 0 && (e = {}), {
    name: "flip",
    options: e,
    async fn(t) {
      var n, o;
      const {
        placement: r,
        middlewareData: i,
        rects: a,
        initialPlacement: s,
        platform: c,
        elements: u
      } = t, {
        mainAxis: l = !0,
        crossAxis: d = !0,
        fallbackPlacements: f,
        fallbackStrategy: h = "bestFit",
        fallbackAxisSideDirection: g = "none",
        flipAlignment: p = !0,
        ...v
      } = an(e, t);
      if ((n = i.arrow) != null && n.alignmentOffset)
        return {};
      const b = sn(r), _ = At(s), $ = sn(s) === s, x = await (c.isRTL == null ? void 0 : c.isRTL(u.floating)), S = f || ($ || !p ? [ga(s)] : u4(s)), w = g !== "none";
      !f && w && S.push(...m4(s, p, g, x));
      const I = [s, ...S], D = await io(t, v), P = [];
      let M = ((o = i.flip) == null ? void 0 : o.overflows) || [];
      if (l && P.push(D[b]), d) {
        const V = c4(r, a, x);
        P.push(D[V[0]], D[V[1]]);
      }
      if (M = [...M, {
        placement: r,
        overflows: P
      }], !P.every((V) => V <= 0)) {
        var B, K;
        const V = (((B = i.flip) == null ? void 0 : B.index) || 0) + 1, ue = I[V];
        if (ue && (!(d === "alignment" ? _ !== At(ue) : !1) || // We leave the current main axis only if every placement on that axis
        // overflows the main axis.
        M.every((T) => At(T.placement) === _ ? T.overflows[0] > 0 : !0)))
          return {
            data: {
              index: V,
              overflows: M
            },
            reset: {
              placement: ue
            }
          };
        let H = (K = M.filter((ce) => ce.overflows[0] <= 0).sort((ce, T) => ce.overflows[1] - T.overflows[1])[0]) == null ? void 0 : K.placement;
        if (!H)
          switch (h) {
            case "bestFit": {
              var Q;
              const ce = (Q = M.filter((T) => {
                if (w) {
                  const A = At(T.placement);
                  return A === _ || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  A === "y";
                }
                return !0;
              }).map((T) => [T.placement, T.overflows.filter((A) => A > 0).reduce((A, oe) => A + oe, 0)]).sort((T, A) => T[1] - A[1])[0]) == null ? void 0 : Q[0];
              ce && (H = ce);
              break;
            }
            case "initialPlacement":
              H = s;
              break;
          }
        if (r !== H)
          return {
            reset: {
              placement: H
            }
          };
      }
      return {};
    }
  };
};
function Nh(e, t) {
  return {
    top: e.top - t.height,
    right: e.right - t.width,
    bottom: e.bottom - t.height,
    left: e.left - t.width
  };
}
function Eh(e) {
  return o4.some((t) => e[t] >= 0);
}
const y4 = function(e) {
  return e === void 0 && (e = {}), {
    name: "hide",
    options: e,
    async fn(t) {
      const {
        rects: n
      } = t, {
        strategy: o = "referenceHidden",
        ...r
      } = an(e, t);
      switch (o) {
        case "referenceHidden": {
          const i = await io(t, {
            ...r,
            elementContext: "reference"
          }), a = Nh(i, n.reference);
          return {
            data: {
              referenceHiddenOffsets: a,
              referenceHidden: Eh(a)
            }
          };
        }
        case "escaped": {
          const i = await io(t, {
            ...r,
            altBoundary: !0
          }), a = Nh(i, n.floating);
          return {
            data: {
              escapedOffsets: a,
              escaped: Eh(a)
            }
          };
        }
        default:
          return {};
      }
    }
  };
}, d$ = /* @__PURE__ */ new Set(["left", "top"]);
async function b4(e, t) {
  const {
    placement: n,
    platform: o,
    elements: r
  } = e, i = await (o.isRTL == null ? void 0 : o.isRTL(r.floating)), a = sn(n), s = Yr(n), c = At(n) === "y", u = d$.has(a) ? -1 : 1, l = i && c ? -1 : 1, d = an(t, e);
  let {
    mainAxis: f,
    crossAxis: h,
    alignmentAxis: g
  } = typeof d == "number" ? {
    mainAxis: d,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: d.mainAxis || 0,
    crossAxis: d.crossAxis || 0,
    alignmentAxis: d.alignmentAxis
  };
  return s && typeof g == "number" && (h = s === "end" ? g * -1 : g), c ? {
    x: h * l,
    y: f * u
  } : {
    x: f * u,
    y: h * l
  };
}
const w4 = function(e) {
  return e === void 0 && (e = 0), {
    name: "offset",
    options: e,
    async fn(t) {
      var n, o;
      const {
        x: r,
        y: i,
        placement: a,
        middlewareData: s
      } = t, c = await b4(t, e);
      return a === ((n = s.offset) == null ? void 0 : n.placement) && (o = s.arrow) != null && o.alignmentOffset ? {} : {
        x: r + c.x,
        y: i + c.y,
        data: {
          ...c,
          placement: a
        }
      };
    }
  };
}, _4 = function(e) {
  return e === void 0 && (e = {}), {
    name: "shift",
    options: e,
    async fn(t) {
      const {
        x: n,
        y: o,
        placement: r
      } = t, {
        mainAxis: i = !0,
        crossAxis: a = !1,
        limiter: s = {
          fn: (v) => {
            let {
              x: b,
              y: _
            } = v;
            return {
              x: b,
              y: _
            };
          }
        },
        ...c
      } = an(e, t), u = {
        x: n,
        y: o
      }, l = await io(t, c), d = At(sn(r)), f = Mf(d);
      let h = u[f], g = u[d];
      if (i) {
        const v = f === "y" ? "top" : "left", b = f === "y" ? "bottom" : "right", _ = h + l[v], $ = h - l[b];
        h = vu(_, h, $);
      }
      if (a) {
        const v = d === "y" ? "top" : "left", b = d === "y" ? "bottom" : "right", _ = g + l[v], $ = g - l[b];
        g = vu(_, g, $);
      }
      const p = s.fn({
        ...t,
        [f]: h,
        [d]: g
      });
      return {
        ...p,
        data: {
          x: p.x - n,
          y: p.y - o,
          enabled: {
            [f]: i,
            [d]: a
          }
        }
      };
    }
  };
}, $4 = function(e) {
  return e === void 0 && (e = {}), {
    options: e,
    fn(t) {
      const {
        x: n,
        y: o,
        placement: r,
        rects: i,
        middlewareData: a
      } = t, {
        offset: s = 0,
        mainAxis: c = !0,
        crossAxis: u = !0
      } = an(e, t), l = {
        x: n,
        y: o
      }, d = At(r), f = Mf(d);
      let h = l[f], g = l[d];
      const p = an(s, t), v = typeof p == "number" ? {
        mainAxis: p,
        crossAxis: 0
      } : {
        mainAxis: 0,
        crossAxis: 0,
        ...p
      };
      if (c) {
        const $ = f === "y" ? "height" : "width", x = i.reference[f] - i.floating[$] + v.mainAxis, S = i.reference[f] + i.reference[$] - v.mainAxis;
        h < x ? h = x : h > S && (h = S);
      }
      if (u) {
        var b, _;
        const $ = f === "y" ? "width" : "height", x = d$.has(sn(r)), S = i.reference[d] - i.floating[$] + (x && ((b = a.offset) == null ? void 0 : b[d]) || 0) + (x ? 0 : v.crossAxis), w = i.reference[d] + i.reference[$] + (x ? 0 : ((_ = a.offset) == null ? void 0 : _[d]) || 0) - (x ? v.crossAxis : 0);
        g < S ? g = S : g > w && (g = w);
      }
      return {
        [f]: h,
        [d]: g
      };
    }
  };
}, k4 = function(e) {
  return e === void 0 && (e = {}), {
    name: "size",
    options: e,
    async fn(t) {
      var n, o;
      const {
        placement: r,
        rects: i,
        platform: a,
        elements: s
      } = t, {
        apply: c = () => {
        },
        ...u
      } = an(e, t), l = await io(t, u), d = sn(r), f = Yr(r), h = At(r) === "y", {
        width: g,
        height: p
      } = i.floating;
      let v, b;
      d === "top" || d === "bottom" ? (v = d, b = f === (await (a.isRTL == null ? void 0 : a.isRTL(s.floating)) ? "start" : "end") ? "left" : "right") : (b = d, v = f === "end" ? "top" : "bottom");
      const _ = p - l.top - l.bottom, $ = g - l.left - l.right, x = yn(p - l[v], _), S = yn(g - l[b], $), w = !t.middlewareData.shift;
      let I = x, D = S;
      if ((n = t.middlewareData.shift) != null && n.enabled.x && (D = $), (o = t.middlewareData.shift) != null && o.enabled.y && (I = _), w && !f) {
        const M = nt(l.left, 0), B = nt(l.right, 0), K = nt(l.top, 0), Q = nt(l.bottom, 0);
        h ? D = g - 2 * (M !== 0 || B !== 0 ? M + B : nt(l.left, l.right)) : I = p - 2 * (K !== 0 || Q !== 0 ? K + Q : nt(l.top, l.bottom));
      }
      await c({
        ...t,
        availableWidth: D,
        availableHeight: I
      });
      const P = await a.getDimensions(s.floating);
      return g !== P.width || p !== P.height ? {
        reset: {
          rects: !0
        }
      } : {};
    }
  };
};
function uc() {
  return typeof window < "u";
}
function Br(e) {
  return f$(e) ? (e.nodeName || "").toLowerCase() : "#document";
}
function at(e) {
  var t;
  return (e == null || (t = e.ownerDocument) == null ? void 0 : t.defaultView) || window;
}
function Yt(e) {
  var t;
  return (t = (f$(e) ? e.ownerDocument : e.document) || window.document) == null ? void 0 : t.documentElement;
}
function f$(e) {
  return uc() ? e instanceof Node || e instanceof at(e).Node : !1;
}
function $t(e) {
  return uc() ? e instanceof Element || e instanceof at(e).Element : !1;
}
function Ft(e) {
  return uc() ? e instanceof HTMLElement || e instanceof at(e).HTMLElement : !1;
}
function Ph(e) {
  return !uc() || typeof ShadowRoot > "u" ? !1 : e instanceof ShadowRoot || e instanceof at(e).ShadowRoot;
}
const x4 = /* @__PURE__ */ new Set(["inline", "contents"]);
function gi(e) {
  const {
    overflow: t,
    overflowX: n,
    overflowY: o,
    display: r
  } = kt(e);
  return /auto|scroll|overlay|hidden|clip/.test(t + o + n) && !x4.has(r);
}
const S4 = /* @__PURE__ */ new Set(["table", "td", "th"]);
function D4(e) {
  return S4.has(Br(e));
}
const O4 = [":popover-open", ":modal"];
function lc(e) {
  return O4.some((t) => {
    try {
      return e.matches(t);
    } catch {
      return !1;
    }
  });
}
const I4 = ["transform", "translate", "scale", "rotate", "perspective"], N4 = ["transform", "translate", "scale", "rotate", "perspective", "filter"], E4 = ["paint", "layout", "strict", "content"];
function Af(e) {
  const t = Uf(), n = $t(e) ? kt(e) : e;
  return I4.some((o) => n[o] ? n[o] !== "none" : !1) || (n.containerType ? n.containerType !== "normal" : !1) || !t && (n.backdropFilter ? n.backdropFilter !== "none" : !1) || !t && (n.filter ? n.filter !== "none" : !1) || N4.some((o) => (n.willChange || "").includes(o)) || E4.some((o) => (n.contain || "").includes(o));
}
function P4(e) {
  let t = bn(e);
  for (; Ft(t) && !$r(t); ) {
    if (Af(t))
      return t;
    if (lc(t))
      return null;
    t = bn(t);
  }
  return null;
}
function Uf() {
  return typeof CSS > "u" || !CSS.supports ? !1 : CSS.supports("-webkit-backdrop-filter", "none");
}
const T4 = /* @__PURE__ */ new Set(["html", "body", "#document"]);
function $r(e) {
  return T4.has(Br(e));
}
function kt(e) {
  return at(e).getComputedStyle(e);
}
function dc(e) {
  return $t(e) ? {
    scrollLeft: e.scrollLeft,
    scrollTop: e.scrollTop
  } : {
    scrollLeft: e.scrollX,
    scrollTop: e.scrollY
  };
}
function bn(e) {
  if (Br(e) === "html")
    return e;
  const t = (
    // Step into the shadow DOM of the parent of a slotted node.
    e.assignedSlot || // DOM Element detected.
    e.parentNode || // ShadowRoot detected.
    Ph(e) && e.host || // Fallback.
    Yt(e)
  );
  return Ph(t) ? t.host : t;
}
function m$(e) {
  const t = bn(e);
  return $r(t) ? e.ownerDocument ? e.ownerDocument.body : e.body : Ft(t) && gi(t) ? t : m$(t);
}
function ao(e, t, n) {
  var o;
  t === void 0 && (t = []), n === void 0 && (n = !0);
  const r = m$(e), i = r === ((o = e.ownerDocument) == null ? void 0 : o.body), a = at(r);
  if (i) {
    const s = bu(a);
    return t.concat(a, a.visualViewport || [], gi(r) ? r : [], s && n ? ao(s) : []);
  }
  return t.concat(r, ao(r, [], n));
}
function bu(e) {
  return e.parent && Object.getPrototypeOf(e.parent) ? e.frameElement : null;
}
function h$(e) {
  const t = kt(e);
  let n = parseFloat(t.width) || 0, o = parseFloat(t.height) || 0;
  const r = Ft(e), i = r ? e.offsetWidth : n, a = r ? e.offsetHeight : o, s = ha(n) !== i || ha(o) !== a;
  return s && (n = i, o = a), {
    width: n,
    height: o,
    $: s
  };
}
function jf(e) {
  return $t(e) ? e : e.contextElement;
}
function cr(e) {
  const t = jf(e);
  if (!Ft(t))
    return jt(1);
  const n = t.getBoundingClientRect(), {
    width: o,
    height: r,
    $: i
  } = h$(t);
  let a = (i ? ha(n.width) : n.width) / o, s = (i ? ha(n.height) : n.height) / r;
  return (!a || !Number.isFinite(a)) && (a = 1), (!s || !Number.isFinite(s)) && (s = 1), {
    x: a,
    y: s
  };
}
const C4 = /* @__PURE__ */ jt(0);
function g$(e) {
  const t = at(e);
  return !Uf() || !t.visualViewport ? C4 : {
    x: t.visualViewport.offsetLeft,
    y: t.visualViewport.offsetTop
  };
}
function M4(e, t, n) {
  return t === void 0 && (t = !1), !n || t && n !== at(e) ? !1 : t;
}
function Wn(e, t, n, o) {
  t === void 0 && (t = !1), n === void 0 && (n = !1);
  const r = e.getBoundingClientRect(), i = jf(e);
  let a = jt(1);
  t && (o ? $t(o) && (a = cr(o)) : a = cr(e));
  const s = M4(i, n, o) ? g$(i) : jt(0);
  let c = (r.left + s.x) / a.x, u = (r.top + s.y) / a.y, l = r.width / a.x, d = r.height / a.y;
  if (i) {
    const f = at(i), h = o && $t(o) ? at(o) : o;
    let g = f, p = bu(g);
    for (; p && o && h !== g; ) {
      const v = cr(p), b = p.getBoundingClientRect(), _ = kt(p), $ = b.left + (p.clientLeft + parseFloat(_.paddingLeft)) * v.x, x = b.top + (p.clientTop + parseFloat(_.paddingTop)) * v.y;
      c *= v.x, u *= v.y, l *= v.x, d *= v.y, c += $, u += x, g = at(p), p = bu(g);
    }
  }
  return pa({
    width: l,
    height: d,
    x: c,
    y: u
  });
}
function fc(e, t) {
  const n = dc(e).scrollLeft;
  return t ? t.left + n : Wn(Yt(e)).left + n;
}
function p$(e, t) {
  const n = e.getBoundingClientRect(), o = n.left + t.scrollLeft - fc(e, n), r = n.top + t.scrollTop;
  return {
    x: o,
    y: r
  };
}
function z4(e) {
  let {
    elements: t,
    rect: n,
    offsetParent: o,
    strategy: r
  } = e;
  const i = r === "fixed", a = Yt(o), s = t ? lc(t.floating) : !1;
  if (o === a || s && i)
    return n;
  let c = {
    scrollLeft: 0,
    scrollTop: 0
  }, u = jt(1);
  const l = jt(0), d = Ft(o);
  if ((d || !d && !i) && ((Br(o) !== "body" || gi(a)) && (c = dc(o)), Ft(o))) {
    const h = Wn(o);
    u = cr(o), l.x = h.x + o.clientLeft, l.y = h.y + o.clientTop;
  }
  const f = a && !d && !i ? p$(a, c) : jt(0);
  return {
    width: n.width * u.x,
    height: n.height * u.y,
    x: n.x * u.x - c.scrollLeft * u.x + l.x + f.x,
    y: n.y * u.y - c.scrollTop * u.y + l.y + f.y
  };
}
function R4(e) {
  return Array.from(e.getClientRects());
}
function A4(e) {
  const t = Yt(e), n = dc(e), o = e.ownerDocument.body, r = nt(t.scrollWidth, t.clientWidth, o.scrollWidth, o.clientWidth), i = nt(t.scrollHeight, t.clientHeight, o.scrollHeight, o.clientHeight);
  let a = -n.scrollLeft + fc(e);
  const s = -n.scrollTop;
  return kt(o).direction === "rtl" && (a += nt(t.clientWidth, o.clientWidth) - r), {
    width: r,
    height: i,
    x: a,
    y: s
  };
}
const Th = 25;
function U4(e, t) {
  const n = at(e), o = Yt(e), r = n.visualViewport;
  let i = o.clientWidth, a = o.clientHeight, s = 0, c = 0;
  if (r) {
    i = r.width, a = r.height;
    const l = Uf();
    (!l || l && t === "fixed") && (s = r.offsetLeft, c = r.offsetTop);
  }
  const u = fc(o);
  if (u <= 0) {
    const l = o.ownerDocument, d = l.body, f = getComputedStyle(d), h = l.compatMode === "CSS1Compat" && parseFloat(f.marginLeft) + parseFloat(f.marginRight) || 0, g = Math.abs(o.clientWidth - d.clientWidth - h);
    g <= Th && (i -= g);
  } else
    u <= Th && (i += u);
  return {
    width: i,
    height: a,
    x: s,
    y: c
  };
}
const j4 = /* @__PURE__ */ new Set(["absolute", "fixed"]);
function F4(e, t) {
  const n = Wn(e, !0, t === "fixed"), o = n.top + e.clientTop, r = n.left + e.clientLeft, i = Ft(e) ? cr(e) : jt(1), a = e.clientWidth * i.x, s = e.clientHeight * i.y, c = r * i.x, u = o * i.y;
  return {
    width: a,
    height: s,
    x: c,
    y: u
  };
}
function Ch(e, t, n) {
  let o;
  if (t === "viewport")
    o = U4(e, n);
  else if (t === "document")
    o = A4(Yt(e));
  else if ($t(t))
    o = F4(t, n);
  else {
    const r = g$(e);
    o = {
      x: t.x - r.x,
      y: t.y - r.y,
      width: t.width,
      height: t.height
    };
  }
  return pa(o);
}
function v$(e, t) {
  const n = bn(e);
  return n === t || !$t(n) || $r(n) ? !1 : kt(n).position === "fixed" || v$(n, t);
}
function W4(e, t) {
  const n = t.get(e);
  if (n)
    return n;
  let o = ao(e, [], !1).filter((s) => $t(s) && Br(s) !== "body"), r = null;
  const i = kt(e).position === "fixed";
  let a = i ? bn(e) : e;
  for (; $t(a) && !$r(a); ) {
    const s = kt(a), c = Af(a);
    !c && s.position === "fixed" && (r = null), (i ? !c && !r : !c && s.position === "static" && !!r && j4.has(r.position) || gi(a) && !c && v$(e, a)) ? o = o.filter((l) => l !== a) : r = s, a = bn(a);
  }
  return t.set(e, o), o;
}
function L4(e) {
  let {
    element: t,
    boundary: n,
    rootBoundary: o,
    strategy: r
  } = e;
  const a = [...n === "clippingAncestors" ? lc(t) ? [] : W4(t, this._c) : [].concat(n), o], s = a[0], c = a.reduce((u, l) => {
    const d = Ch(t, l, r);
    return u.top = nt(d.top, u.top), u.right = yn(d.right, u.right), u.bottom = yn(d.bottom, u.bottom), u.left = nt(d.left, u.left), u;
  }, Ch(t, s, r));
  return {
    width: c.right - c.left,
    height: c.bottom - c.top,
    x: c.left,
    y: c.top
  };
}
function Z4(e) {
  const {
    width: t,
    height: n
  } = h$(e);
  return {
    width: t,
    height: n
  };
}
function Y4(e, t, n) {
  const o = Ft(t), r = Yt(t), i = n === "fixed", a = Wn(e, !0, i, t);
  let s = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const c = jt(0);
  function u() {
    c.x = fc(r);
  }
  if (o || !o && !i)
    if ((Br(t) !== "body" || gi(r)) && (s = dc(t)), o) {
      const h = Wn(t, !0, i, t);
      c.x = h.x + t.clientLeft, c.y = h.y + t.clientTop;
    } else
      r && u();
  i && !o && r && u();
  const l = r && !o && !i ? p$(r, s) : jt(0), d = a.left + s.scrollLeft - c.x - l.x, f = a.top + s.scrollTop - c.y - l.y;
  return {
    x: d,
    y: f,
    width: a.width,
    height: a.height
  };
}
function Vc(e) {
  return kt(e).position === "static";
}
function Mh(e, t) {
  if (!Ft(e) || kt(e).position === "fixed")
    return null;
  if (t)
    return t(e);
  let n = e.offsetParent;
  return Yt(e) === n && (n = n.ownerDocument.body), n;
}
function y$(e, t) {
  const n = at(e);
  if (lc(e))
    return n;
  if (!Ft(e)) {
    let r = bn(e);
    for (; r && !$r(r); ) {
      if ($t(r) && !Vc(r))
        return r;
      r = bn(r);
    }
    return n;
  }
  let o = Mh(e, t);
  for (; o && D4(o) && Vc(o); )
    o = Mh(o, t);
  return o && $r(o) && Vc(o) && !Af(o) ? n : o || P4(e) || n;
}
const B4 = async function(e) {
  const t = this.getOffsetParent || y$, n = this.getDimensions, o = await n(e.floating);
  return {
    reference: Y4(e.reference, await t(e.floating), e.strategy),
    floating: {
      x: 0,
      y: 0,
      width: o.width,
      height: o.height
    }
  };
};
function H4(e) {
  return kt(e).direction === "rtl";
}
const G4 = {
  convertOffsetParentRelativeRectToViewportRelativeRect: z4,
  getDocumentElement: Yt,
  getClippingRect: L4,
  getOffsetParent: y$,
  getElementRects: B4,
  getClientRects: R4,
  getDimensions: Z4,
  getScale: cr,
  isElement: $t,
  isRTL: H4
};
function b$(e, t) {
  return e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height;
}
function V4(e, t) {
  let n = null, o;
  const r = Yt(e);
  function i() {
    var s;
    clearTimeout(o), (s = n) == null || s.disconnect(), n = null;
  }
  function a(s, c) {
    s === void 0 && (s = !1), c === void 0 && (c = 1), i();
    const u = e.getBoundingClientRect(), {
      left: l,
      top: d,
      width: f,
      height: h
    } = u;
    if (s || t(), !f || !h)
      return;
    const g = Ri(d), p = Ri(r.clientWidth - (l + f)), v = Ri(r.clientHeight - (d + h)), b = Ri(l), $ = {
      rootMargin: -g + "px " + -p + "px " + -v + "px " + -b + "px",
      threshold: nt(0, yn(1, c)) || 1
    };
    let x = !0;
    function S(w) {
      const I = w[0].intersectionRatio;
      if (I !== c) {
        if (!x)
          return a();
        I ? a(!1, I) : o = setTimeout(() => {
          a(!1, 1e-7);
        }, 1e3);
      }
      I === 1 && !b$(u, e.getBoundingClientRect()) && a(), x = !1;
    }
    try {
      n = new IntersectionObserver(S, {
        ...$,
        // Handle <iframe>s
        root: r.ownerDocument
      });
    } catch {
      n = new IntersectionObserver(S, $);
    }
    n.observe(e);
  }
  return a(!0), i;
}
function q4(e, t, n, o) {
  o === void 0 && (o = {});
  const {
    ancestorScroll: r = !0,
    ancestorResize: i = !0,
    elementResize: a = typeof ResizeObserver == "function",
    layoutShift: s = typeof IntersectionObserver == "function",
    animationFrame: c = !1
  } = o, u = jf(e), l = r || i ? [...u ? ao(u) : [], ...ao(t)] : [];
  l.forEach((b) => {
    r && b.addEventListener("scroll", n, {
      passive: !0
    }), i && b.addEventListener("resize", n);
  });
  const d = u && s ? V4(u, n) : null;
  let f = -1, h = null;
  a && (h = new ResizeObserver((b) => {
    let [_] = b;
    _ && _.target === u && h && (h.unobserve(t), cancelAnimationFrame(f), f = requestAnimationFrame(() => {
      var $;
      ($ = h) == null || $.observe(t);
    })), n();
  }), u && !c && h.observe(u), h.observe(t));
  let g, p = c ? Wn(e) : null;
  c && v();
  function v() {
    const b = Wn(e);
    p && !b$(p, b) && n(), p = b, g = requestAnimationFrame(v);
  }
  return n(), () => {
    var b;
    l.forEach((_) => {
      r && _.removeEventListener("scroll", n), i && _.removeEventListener("resize", n);
    }), d == null || d(), (b = h) == null || b.disconnect(), h = null, c && cancelAnimationFrame(g);
  };
}
const J4 = w4, K4 = _4, X4 = v4, Q4 = k4, eU = y4, zh = p4, tU = $4, nU = (e, t, n) => {
  const o = /* @__PURE__ */ new Map(), r = {
    platform: G4,
    ...n
  }, i = {
    ...r.platform,
    _c: o
  };
  return g4(e, t, {
    ...r,
    platform: i
  });
};
var rU = typeof document < "u", oU = function() {
}, Hi = rU ? Zh : oU;
function va(e, t) {
  if (e === t)
    return !0;
  if (typeof e != typeof t)
    return !1;
  if (typeof e == "function" && e.toString() === t.toString())
    return !0;
  let n, o, r;
  if (e && t && typeof e == "object") {
    if (Array.isArray(e)) {
      if (n = e.length, n !== t.length)
        return !1;
      for (o = n; o-- !== 0; )
        if (!va(e[o], t[o]))
          return !1;
      return !0;
    }
    if (r = Object.keys(e), n = r.length, n !== Object.keys(t).length)
      return !1;
    for (o = n; o-- !== 0; )
      if (!{}.hasOwnProperty.call(t, r[o]))
        return !1;
    for (o = n; o-- !== 0; ) {
      const i = r[o];
      if (!(i === "_owner" && e.$$typeof) && !va(e[i], t[i]))
        return !1;
    }
    return !0;
  }
  return e !== e && t !== t;
}
function w$(e) {
  return typeof window > "u" ? 1 : (e.ownerDocument.defaultView || window).devicePixelRatio || 1;
}
function Rh(e, t) {
  const n = w$(e);
  return Math.round(t * n) / n;
}
function qc(e) {
  const t = m.useRef(e);
  return Hi(() => {
    t.current = e;
  }), t;
}
function iU(e) {
  e === void 0 && (e = {});
  const {
    placement: t = "bottom",
    strategy: n = "absolute",
    middleware: o = [],
    platform: r,
    elements: {
      reference: i,
      floating: a
    } = {},
    transform: s = !0,
    whileElementsMounted: c,
    open: u
  } = e, [l, d] = m.useState({
    x: 0,
    y: 0,
    strategy: n,
    placement: t,
    middlewareData: {},
    isPositioned: !1
  }), [f, h] = m.useState(o);
  va(f, o) || h(o);
  const [g, p] = m.useState(null), [v, b] = m.useState(null), _ = m.useCallback((T) => {
    T !== w.current && (w.current = T, p(T));
  }, []), $ = m.useCallback((T) => {
    T !== I.current && (I.current = T, b(T));
  }, []), x = i || g, S = a || v, w = m.useRef(null), I = m.useRef(null), D = m.useRef(l), P = c != null, M = qc(c), B = qc(r), K = qc(u), Q = m.useCallback(() => {
    if (!w.current || !I.current)
      return;
    const T = {
      placement: t,
      strategy: n,
      middleware: f
    };
    B.current && (T.platform = B.current), nU(w.current, I.current, T).then((A) => {
      const oe = {
        ...A,
        // The floating element's position may be recomputed while it's closed
        // but still mounted (such as when transitioning out). To ensure
        // `isPositioned` will be `false` initially on the next open, avoid
        // setting it to `true` when `open === false` (must be specified).
        isPositioned: K.current !== !1
      };
      V.current && !va(D.current, oe) && (D.current = oe, Yh.flushSync(() => {
        d(oe);
      }));
    });
  }, [f, t, n, B, K]);
  Hi(() => {
    u === !1 && D.current.isPositioned && (D.current.isPositioned = !1, d((T) => ({
      ...T,
      isPositioned: !1
    })));
  }, [u]);
  const V = m.useRef(!1);
  Hi(() => (V.current = !0, () => {
    V.current = !1;
  }), []), Hi(() => {
    if (x && (w.current = x), S && (I.current = S), x && S) {
      if (M.current)
        return M.current(x, S, Q);
      Q();
    }
  }, [x, S, Q, M, P]);
  const ue = m.useMemo(() => ({
    reference: w,
    floating: I,
    setReference: _,
    setFloating: $
  }), [_, $]), H = m.useMemo(() => ({
    reference: x,
    floating: S
  }), [x, S]), ce = m.useMemo(() => {
    const T = {
      position: n,
      left: 0,
      top: 0
    };
    if (!H.floating)
      return T;
    const A = Rh(H.floating, l.x), oe = Rh(H.floating, l.y);
    return s ? {
      ...T,
      transform: "translate(" + A + "px, " + oe + "px)",
      ...w$(H.floating) >= 1.5 && {
        willChange: "transform"
      }
    } : {
      position: n,
      left: A,
      top: oe
    };
  }, [n, s, H.floating, l.x, l.y]);
  return m.useMemo(() => ({
    ...l,
    update: Q,
    refs: ue,
    elements: H,
    floatingStyles: ce
  }), [l, Q, ue, H, ce]);
}
const aU = (e) => {
  function t(n) {
    return {}.hasOwnProperty.call(n, "current");
  }
  return {
    name: "arrow",
    options: e,
    fn(n) {
      const {
        element: o,
        padding: r
      } = typeof e == "function" ? e(n) : e;
      return o && t(o) ? o.current != null ? zh({
        element: o.current,
        padding: r
      }).fn(n) : {} : o ? zh({
        element: o,
        padding: r
      }).fn(n) : {};
    }
  };
}, sU = (e, t) => ({
  ...J4(e),
  options: [e, t]
}), cU = (e, t) => ({
  ...K4(e),
  options: [e, t]
}), uU = (e, t) => ({
  ...tU(e),
  options: [e, t]
}), lU = (e, t) => ({
  ...X4(e),
  options: [e, t]
}), dU = (e, t) => ({
  ...Q4(e),
  options: [e, t]
}), fU = (e, t) => ({
  ...eU(e),
  options: [e, t]
}), mU = (e, t) => ({
  ...aU(e),
  options: [e, t]
});
var hU = "Arrow", _$ = m.forwardRef((e, t) => {
  const { children: n, width: o = 10, height: r = 5, ...i } = e;
  return /* @__PURE__ */ y(
    de.svg,
    {
      ...i,
      ref: t,
      width: o,
      height: r,
      viewBox: "0 0 30 10",
      preserveAspectRatio: "none",
      children: e.asChild ? n : /* @__PURE__ */ y("polygon", { points: "0,0 30,0 15,10" })
    }
  );
});
_$.displayName = hU;
var gU = _$;
function Ff(e) {
  const [t, n] = m.useState(void 0);
  return on(() => {
    if (e) {
      n({ width: e.offsetWidth, height: e.offsetHeight });
      const o = new ResizeObserver((r) => {
        if (!Array.isArray(r) || !r.length)
          return;
        const i = r[0];
        let a, s;
        if ("borderBoxSize" in i) {
          const c = i.borderBoxSize, u = Array.isArray(c) ? c[0] : c;
          a = u.inlineSize, s = u.blockSize;
        } else
          a = e.offsetWidth, s = e.offsetHeight;
        n({ width: a, height: s });
      });
      return o.observe(e, { box: "border-box" }), () => o.unobserve(e);
    } else
      n(void 0);
  }, [e]), t;
}
var Wf = "Popper", [$$, mc] = St(Wf), [pU, k$] = $$(Wf), x$ = (e) => {
  const { __scopePopper: t, children: n } = e, [o, r] = m.useState(null);
  return /* @__PURE__ */ y(pU, { scope: t, anchor: o, onAnchorChange: r, children: n });
};
x$.displayName = Wf;
var S$ = "PopperAnchor", D$ = m.forwardRef(
  (e, t) => {
    const { __scopePopper: n, virtualRef: o, ...r } = e, i = k$(S$, n), a = m.useRef(null), s = ye(t, a), c = m.useRef(null);
    return m.useEffect(() => {
      const u = c.current;
      c.current = (o == null ? void 0 : o.current) || a.current, u !== c.current && i.onAnchorChange(c.current);
    }), o ? null : /* @__PURE__ */ y(de.div, { ...r, ref: s });
  }
);
D$.displayName = S$;
var Lf = "PopperContent", [vU, yU] = $$(Lf), O$ = m.forwardRef(
  (e, t) => {
    var fe, Ot, Ee, Ze, ln, Ht;
    const {
      __scopePopper: n,
      side: o = "bottom",
      sideOffset: r = 0,
      align: i = "center",
      alignOffset: a = 0,
      arrowPadding: s = 0,
      avoidCollisions: c = !0,
      collisionBoundary: u = [],
      collisionPadding: l = 0,
      sticky: d = "partial",
      hideWhenDetached: f = !1,
      updatePositionStrategy: h = "optimized",
      onPlaced: g,
      ...p
    } = e, v = k$(Lf, n), [b, _] = m.useState(null), $ = ye(t, (On) => _(On)), [x, S] = m.useState(null), w = Ff(x), I = (w == null ? void 0 : w.width) ?? 0, D = (w == null ? void 0 : w.height) ?? 0, P = o + (i !== "center" ? "-" + i : ""), M = typeof l == "number" ? l : { top: 0, right: 0, bottom: 0, left: 0, ...l }, B = Array.isArray(u) ? u : [u], K = B.length > 0, Q = {
      padding: M,
      boundary: B.filter(wU),
      // with `strategy: 'fixed'`, this is the only way to get it to respect boundaries
      altBoundary: K
    }, { refs: V, floatingStyles: ue, placement: H, isPositioned: ce, middlewareData: T } = iU({
      // default to `fixed` strategy so users don't have to pick and we also avoid focus scroll issues
      strategy: "fixed",
      placement: P,
      whileElementsMounted: (...On) => q4(...On, {
        animationFrame: h === "always"
      }),
      elements: {
        reference: v.anchor
      },
      middleware: [
        sU({ mainAxis: r + D, alignmentAxis: a }),
        c && cU({
          mainAxis: !0,
          crossAxis: !1,
          limiter: d === "partial" ? uU() : void 0,
          ...Q
        }),
        c && lU({ ...Q }),
        dU({
          ...Q,
          apply: ({ elements: On, rects: _i, availableWidth: $i, availableHeight: kc }) => {
            const { width: xc, height: Sc } = _i.reference, Vn = On.floating.style;
            Vn.setProperty("--radix-popper-available-width", `${$i}px`), Vn.setProperty("--radix-popper-available-height", `${kc}px`), Vn.setProperty("--radix-popper-anchor-width", `${xc}px`), Vn.setProperty("--radix-popper-anchor-height", `${Sc}px`);
          }
        }),
        x && mU({ element: x, padding: s }),
        _U({ arrowWidth: I, arrowHeight: D }),
        f && fU({ strategy: "referenceHidden", ...Q })
      ]
    }), [A, oe] = E$(H), se = Ae(g);
    on(() => {
      ce && (se == null || se());
    }, [ce, se]);
    const ke = (fe = T.arrow) == null ? void 0 : fe.x, me = (Ot = T.arrow) == null ? void 0 : Ot.y, pe = ((Ee = T.arrow) == null ? void 0 : Ee.centerOffset) !== 0, [ze, Xe] = m.useState();
    return on(() => {
      b && Xe(window.getComputedStyle(b).zIndex);
    }, [b]), /* @__PURE__ */ y(
      "div",
      {
        ref: V.setFloating,
        "data-radix-popper-content-wrapper": "",
        style: {
          ...ue,
          transform: ce ? ue.transform : "translate(0, -200%)",
          // keep off the page when measuring
          minWidth: "max-content",
          zIndex: ze,
          "--radix-popper-transform-origin": [
            (Ze = T.transformOrigin) == null ? void 0 : Ze.x,
            (ln = T.transformOrigin) == null ? void 0 : ln.y
          ].join(" "),
          // hide the content if using the hide middleware and should be hidden
          // set visibility to hidden and disable pointer events so the UI behaves
          // as if the PopperContent isn't there at all
          ...((Ht = T.hide) == null ? void 0 : Ht.referenceHidden) && {
            visibility: "hidden",
            pointerEvents: "none"
          }
        },
        dir: e.dir,
        children: /* @__PURE__ */ y(
          vU,
          {
            scope: n,
            placedSide: A,
            onArrowChange: S,
            arrowX: ke,
            arrowY: me,
            shouldHideArrow: pe,
            children: /* @__PURE__ */ y(
              de.div,
              {
                "data-side": A,
                "data-align": oe,
                ...p,
                ref: $,
                style: {
                  ...p.style,
                  // if the PopperContent hasn't been placed yet (not all measurements done)
                  // we prevent animations so that users's animation don't kick in too early referring wrong sides
                  animation: ce ? void 0 : "none"
                }
              }
            )
          }
        )
      }
    );
  }
);
O$.displayName = Lf;
var I$ = "PopperArrow", bU = {
  top: "bottom",
  right: "left",
  bottom: "top",
  left: "right"
}, N$ = m.forwardRef(function(t, n) {
  const { __scopePopper: o, ...r } = t, i = yU(I$, o), a = bU[i.placedSide];
  return (
    // we have to use an extra wrapper because `ResizeObserver` (used by `useSize`)
    // doesn't report size as we'd expect on SVG elements.
    // it reports their bounding box which is effectively the largest path inside the SVG.
    /* @__PURE__ */ y(
      "span",
      {
        ref: i.onArrowChange,
        style: {
          position: "absolute",
          left: i.arrowX,
          top: i.arrowY,
          [a]: 0,
          transformOrigin: {
            top: "",
            right: "0 0",
            bottom: "center 0",
            left: "100% 0"
          }[i.placedSide],
          transform: {
            top: "translateY(100%)",
            right: "translateY(50%) rotate(90deg) translateX(-50%)",
            bottom: "rotate(180deg)",
            left: "translateY(50%) rotate(-90deg) translateX(50%)"
          }[i.placedSide],
          visibility: i.shouldHideArrow ? "hidden" : void 0
        },
        children: /* @__PURE__ */ y(
          gU,
          {
            ...r,
            ref: n,
            style: {
              ...r.style,
              // ensures the element can be measured correctly (mostly for if SVG)
              display: "block"
            }
          }
        )
      }
    )
  );
});
N$.displayName = I$;
function wU(e) {
  return e !== null;
}
var _U = (e) => ({
  name: "transformOrigin",
  options: e,
  fn(t) {
    var v, b, _;
    const { placement: n, rects: o, middlewareData: r } = t, a = ((v = r.arrow) == null ? void 0 : v.centerOffset) !== 0, s = a ? 0 : e.arrowWidth, c = a ? 0 : e.arrowHeight, [u, l] = E$(n), d = { start: "0%", center: "50%", end: "100%" }[l], f = (((b = r.arrow) == null ? void 0 : b.x) ?? 0) + s / 2, h = (((_ = r.arrow) == null ? void 0 : _.y) ?? 0) + c / 2;
    let g = "", p = "";
    return u === "bottom" ? (g = a ? d : `${f}px`, p = `${-c}px`) : u === "top" ? (g = a ? d : `${f}px`, p = `${o.floating.height + c}px`) : u === "right" ? (g = `${-c}px`, p = a ? d : `${h}px`) : u === "left" && (g = `${o.floating.width + c}px`, p = a ? d : `${h}px`), { data: { x: g, y: p } };
  }
});
function E$(e) {
  const [t, n = "center"] = e.split("-");
  return [t, n];
}
var Zf = x$, Yf = D$, P$ = O$, T$ = N$;
// @__NO_SIDE_EFFECTS__
function $U(e) {
  const t = /* @__PURE__ */ kU(e), n = m.forwardRef((o, r) => {
    const { children: i, ...a } = o, s = m.Children.toArray(i), c = s.find(SU);
    if (c) {
      const u = c.props.children, l = s.map((d) => d === c ? m.Children.count(u) > 1 ? m.Children.only(null) : m.isValidElement(u) ? u.props.children : null : d);
      return /* @__PURE__ */ y(t, { ...a, ref: r, children: m.isValidElement(u) ? m.cloneElement(u, void 0, l) : null });
    }
    return /* @__PURE__ */ y(t, { ...a, ref: r, children: i });
  });
  return n.displayName = `${e}.Slot`, n;
}
// @__NO_SIDE_EFFECTS__
function kU(e) {
  const t = m.forwardRef((n, o) => {
    const { children: r, ...i } = n;
    if (m.isValidElement(r)) {
      const a = OU(r), s = DU(i, r.props);
      return r.type !== m.Fragment && (s.ref = o ? cn(o, a) : a), m.cloneElement(r, s);
    }
    return m.Children.count(r) > 1 ? m.Children.only(null) : null;
  });
  return t.displayName = `${e}.SlotClone`, t;
}
var xU = Symbol("radix.slottable");
function SU(e) {
  return m.isValidElement(e) && typeof e.type == "function" && "__radixId" in e.type && e.type.__radixId === xU;
}
function DU(e, t) {
  const n = { ...t };
  for (const o in t) {
    const r = e[o], i = t[o];
    /^on[A-Z]/.test(o) ? r && i ? n[o] = (...s) => {
      const c = i(...s);
      return r(...s), c;
    } : r && (n[o] = r) : o === "style" ? n[o] = { ...r, ...i } : o === "className" && (n[o] = [r, i].filter(Boolean).join(" "));
  }
  return { ...e, ...n };
}
function OU(e) {
  var o, r;
  let t = (o = Object.getOwnPropertyDescriptor(e.props, "ref")) == null ? void 0 : o.get, n = t && "isReactWarning" in t && t.isReactWarning;
  return n ? e.ref : (t = (r = Object.getOwnPropertyDescriptor(e, "ref")) == null ? void 0 : r.get, n = t && "isReactWarning" in t && t.isReactWarning, n ? e.props.ref : e.props.ref || e.ref);
}
var hc = "Popover", [C$, l2] = St(hc, [
  mc
]), pi = mc(), [IU, Sn] = C$(hc), M$ = (e) => {
  const {
    __scopePopover: t,
    children: n,
    open: o,
    defaultOpen: r,
    onOpenChange: i,
    modal: a = !1
  } = e, s = pi(t), c = m.useRef(null), [u, l] = m.useState(!1), [d, f] = Hn({
    prop: o,
    defaultProp: r ?? !1,
    onChange: i,
    caller: hc
  });
  return /* @__PURE__ */ y(Zf, { ...s, children: /* @__PURE__ */ y(
    IU,
    {
      scope: t,
      contentId: Kt(),
      triggerRef: c,
      open: d,
      onOpenChange: f,
      onOpenToggle: m.useCallback(() => f((h) => !h), [f]),
      hasCustomAnchor: u,
      onCustomAnchorAdd: m.useCallback(() => l(!0), []),
      onCustomAnchorRemove: m.useCallback(() => l(!1), []),
      modal: a,
      children: n
    }
  ) });
};
M$.displayName = hc;
var z$ = "PopoverAnchor", R$ = m.forwardRef(
  (e, t) => {
    const { __scopePopover: n, ...o } = e, r = Sn(z$, n), i = pi(n), { onCustomAnchorAdd: a, onCustomAnchorRemove: s } = r;
    return m.useEffect(() => (a(), () => s()), [a, s]), /* @__PURE__ */ y(Yf, { ...i, ...o, ref: t });
  }
);
R$.displayName = z$;
var A$ = "PopoverTrigger", U$ = m.forwardRef(
  (e, t) => {
    const { __scopePopover: n, ...o } = e, r = Sn(A$, n), i = pi(n), a = ye(t, r.triggerRef), s = /* @__PURE__ */ y(
      de.button,
      {
        type: "button",
        "aria-haspopup": "dialog",
        "aria-expanded": r.open,
        "aria-controls": r.contentId,
        "data-state": Z$(r.open),
        ...o,
        ref: a,
        onClick: Y(e.onClick, r.onOpenToggle)
      }
    );
    return r.hasCustomAnchor ? s : /* @__PURE__ */ y(Yf, { asChild: !0, ...i, children: s });
  }
);
U$.displayName = A$;
var Bf = "PopoverPortal", [NU, EU] = C$(Bf, {
  forceMount: void 0
}), j$ = (e) => {
  const { __scopePopover: t, forceMount: n, children: o, container: r } = e, i = Sn(Bf, t);
  return /* @__PURE__ */ y(NU, { scope: t, forceMount: n, children: /* @__PURE__ */ y(We, { present: n || i.open, children: /* @__PURE__ */ y(Qs, { asChild: !0, container: r, children: o }) }) });
};
j$.displayName = Bf;
var kr = "PopoverContent", F$ = m.forwardRef(
  (e, t) => {
    const n = EU(kr, e.__scopePopover), { forceMount: o = n.forceMount, ...r } = e, i = Sn(kr, e.__scopePopover);
    return /* @__PURE__ */ y(We, { present: o || i.open, children: i.modal ? /* @__PURE__ */ y(TU, { ...r, ref: t }) : /* @__PURE__ */ y(CU, { ...r, ref: t }) });
  }
);
F$.displayName = kr;
var PU = /* @__PURE__ */ $U("PopoverContent.RemoveScroll"), TU = m.forwardRef(
  (e, t) => {
    const n = Sn(kr, e.__scopePopover), o = m.useRef(null), r = ye(t, o), i = m.useRef(!1);
    return m.useEffect(() => {
      const a = o.current;
      if (a)
        return xf(a);
    }, []), /* @__PURE__ */ y(kf, { as: PU, allowPinchZoom: !0, children: /* @__PURE__ */ y(
      W$,
      {
        ...e,
        ref: r,
        trapFocus: n.open,
        disableOutsidePointerEvents: !0,
        onCloseAutoFocus: Y(e.onCloseAutoFocus, (a) => {
          var s;
          a.preventDefault(), i.current || (s = n.triggerRef.current) == null || s.focus();
        }),
        onPointerDownOutside: Y(
          e.onPointerDownOutside,
          (a) => {
            const s = a.detail.originalEvent, c = s.button === 0 && s.ctrlKey === !0, u = s.button === 2 || c;
            i.current = u;
          },
          { checkForDefaultPrevented: !1 }
        ),
        onFocusOutside: Y(
          e.onFocusOutside,
          (a) => a.preventDefault(),
          { checkForDefaultPrevented: !1 }
        )
      }
    ) });
  }
), CU = m.forwardRef(
  (e, t) => {
    const n = Sn(kr, e.__scopePopover), o = m.useRef(!1), r = m.useRef(!1);
    return /* @__PURE__ */ y(
      W$,
      {
        ...e,
        ref: t,
        trapFocus: !1,
        disableOutsidePointerEvents: !1,
        onCloseAutoFocus: (i) => {
          var a, s;
          (a = e.onCloseAutoFocus) == null || a.call(e, i), i.defaultPrevented || (o.current || (s = n.triggerRef.current) == null || s.focus(), i.preventDefault()), o.current = !1, r.current = !1;
        },
        onInteractOutside: (i) => {
          var c, u;
          (c = e.onInteractOutside) == null || c.call(e, i), i.defaultPrevented || (o.current = !0, i.detail.originalEvent.type === "pointerdown" && (r.current = !0));
          const a = i.target;
          ((u = n.triggerRef.current) == null ? void 0 : u.contains(a)) && i.preventDefault(), i.detail.originalEvent.type === "focusin" && r.current && i.preventDefault();
        }
      }
    );
  }
), W$ = m.forwardRef(
  (e, t) => {
    const {
      __scopePopover: n,
      trapFocus: o,
      onOpenAutoFocus: r,
      onCloseAutoFocus: i,
      disableOutsidePointerEvents: a,
      onEscapeKeyDown: s,
      onPointerDownOutside: c,
      onFocusOutside: u,
      onInteractOutside: l,
      ...d
    } = e, f = Sn(kr, n), h = pi(n);
    return $f(), /* @__PURE__ */ y(
      Xs,
      {
        asChild: !0,
        loop: !0,
        trapped: o,
        onMountAutoFocus: r,
        onUnmountAutoFocus: i,
        children: /* @__PURE__ */ y(
          Ks,
          {
            asChild: !0,
            disableOutsidePointerEvents: a,
            onInteractOutside: l,
            onEscapeKeyDown: s,
            onPointerDownOutside: c,
            onFocusOutside: u,
            onDismiss: () => f.onOpenChange(!1),
            children: /* @__PURE__ */ y(
              P$,
              {
                "data-state": Z$(f.open),
                role: "dialog",
                id: f.contentId,
                ...h,
                ...d,
                ref: t,
                style: {
                  ...d.style,
                  "--radix-popover-content-transform-origin": "var(--radix-popper-transform-origin)",
                  "--radix-popover-content-available-width": "var(--radix-popper-available-width)",
                  "--radix-popover-content-available-height": "var(--radix-popper-available-height)",
                  "--radix-popover-trigger-width": "var(--radix-popper-anchor-width)",
                  "--radix-popover-trigger-height": "var(--radix-popper-anchor-height)"
                }
              }
            )
          }
        )
      }
    );
  }
), L$ = "PopoverClose", MU = m.forwardRef(
  (e, t) => {
    const { __scopePopover: n, ...o } = e, r = Sn(L$, n);
    return /* @__PURE__ */ y(
      de.button,
      {
        type: "button",
        ...o,
        ref: t,
        onClick: Y(e.onClick, () => r.onOpenChange(!1))
      }
    );
  }
);
MU.displayName = L$;
var zU = "PopoverArrow", RU = m.forwardRef(
  (e, t) => {
    const { __scopePopover: n, ...o } = e, r = pi(n);
    return /* @__PURE__ */ y(T$, { ...r, ...o, ref: t });
  }
);
RU.displayName = zU;
function Z$(e) {
  return e ? "open" : "closed";
}
var AU = M$, UU = R$, jU = U$, FU = j$, Y$ = F$;
const d2 = AU, f2 = jU, m2 = UU, WU = m.forwardRef(({ className: e, align: t = "center", sideOffset: n = 4, ...o }, r) => /* @__PURE__ */ y(FU, { children: /* @__PURE__ */ y(
  Y$,
  {
    ref: r,
    align: t,
    sideOffset: n,
    className: z(
      "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      e
    ),
    ...o
  }
) }));
WU.displayName = Y$.displayName;
function B$(e) {
  const t = m.useRef({ value: e, previous: e });
  return m.useMemo(() => (t.current.value !== e && (t.current.previous = t.current.value, t.current.value = e), t.current.previous), [e]);
}
var gc = "Checkbox", [LU, h2] = St(gc), [ZU, Hf] = LU(gc);
function YU(e) {
  const {
    __scopeCheckbox: t,
    checked: n,
    children: o,
    defaultChecked: r,
    disabled: i,
    form: a,
    name: s,
    onCheckedChange: c,
    required: u,
    value: l = "on",
    // @ts-expect-error
    internal_do_not_use_render: d
  } = e, [f, h] = Hn({
    prop: n,
    defaultProp: r ?? !1,
    onChange: c,
    caller: gc
  }), [g, p] = m.useState(null), [v, b] = m.useState(null), _ = m.useRef(!1), $ = g ? !!a || !!g.closest("form") : (
    // We set this to true by default so that events bubble to forms without JS (SSR)
    !0
  ), x = {
    checked: f,
    disabled: i,
    setChecked: h,
    control: g,
    setControl: p,
    name: s,
    form: a,
    value: l,
    hasConsumerStoppedPropagationRef: _,
    required: u,
    defaultChecked: mn(r) ? !1 : r,
    isFormControl: $,
    bubbleInput: v,
    setBubbleInput: b
  };
  return /* @__PURE__ */ y(
    ZU,
    {
      scope: t,
      ...x,
      children: BU(d) ? d(x) : o
    }
  );
}
var H$ = "CheckboxTrigger", G$ = m.forwardRef(
  ({ __scopeCheckbox: e, onKeyDown: t, onClick: n, ...o }, r) => {
    const {
      control: i,
      value: a,
      disabled: s,
      checked: c,
      required: u,
      setControl: l,
      setChecked: d,
      hasConsumerStoppedPropagationRef: f,
      isFormControl: h,
      bubbleInput: g
    } = Hf(H$, e), p = ye(r, l), v = m.useRef(c);
    return m.useEffect(() => {
      const b = i == null ? void 0 : i.form;
      if (b) {
        const _ = () => d(v.current);
        return b.addEventListener("reset", _), () => b.removeEventListener("reset", _);
      }
    }, [i, d]), /* @__PURE__ */ y(
      de.button,
      {
        type: "button",
        role: "checkbox",
        "aria-checked": mn(c) ? "mixed" : c,
        "aria-required": u,
        "data-state": X$(c),
        "data-disabled": s ? "" : void 0,
        disabled: s,
        value: a,
        ...o,
        ref: p,
        onKeyDown: Y(t, (b) => {
          b.key === "Enter" && b.preventDefault();
        }),
        onClick: Y(n, (b) => {
          d((_) => mn(_) ? !0 : !_), g && h && (f.current = b.isPropagationStopped(), f.current || b.stopPropagation());
        })
      }
    );
  }
);
G$.displayName = H$;
var Gf = m.forwardRef(
  (e, t) => {
    const {
      __scopeCheckbox: n,
      name: o,
      checked: r,
      defaultChecked: i,
      required: a,
      disabled: s,
      value: c,
      onCheckedChange: u,
      form: l,
      ...d
    } = e;
    return /* @__PURE__ */ y(
      YU,
      {
        __scopeCheckbox: n,
        checked: r,
        defaultChecked: i,
        disabled: s,
        required: a,
        onCheckedChange: u,
        name: o,
        form: l,
        value: c,
        internal_do_not_use_render: ({ isFormControl: f }) => /* @__PURE__ */ Ge(Gi, { children: [
          /* @__PURE__ */ y(
            G$,
            {
              ...d,
              ref: t,
              __scopeCheckbox: n
            }
          ),
          f && /* @__PURE__ */ y(
            K$,
            {
              __scopeCheckbox: n
            }
          )
        ] })
      }
    );
  }
);
Gf.displayName = gc;
var V$ = "CheckboxIndicator", q$ = m.forwardRef(
  (e, t) => {
    const { __scopeCheckbox: n, forceMount: o, ...r } = e, i = Hf(V$, n);
    return /* @__PURE__ */ y(
      We,
      {
        present: o || mn(i.checked) || i.checked === !0,
        children: /* @__PURE__ */ y(
          de.span,
          {
            "data-state": X$(i.checked),
            "data-disabled": i.disabled ? "" : void 0,
            ...r,
            ref: t,
            style: { pointerEvents: "none", ...e.style }
          }
        )
      }
    );
  }
);
q$.displayName = V$;
var J$ = "CheckboxBubbleInput", K$ = m.forwardRef(
  ({ __scopeCheckbox: e, ...t }, n) => {
    const {
      control: o,
      hasConsumerStoppedPropagationRef: r,
      checked: i,
      defaultChecked: a,
      required: s,
      disabled: c,
      name: u,
      value: l,
      form: d,
      bubbleInput: f,
      setBubbleInput: h
    } = Hf(J$, e), g = ye(n, h), p = B$(i), v = Ff(o);
    m.useEffect(() => {
      const _ = f;
      if (!_)
        return;
      const $ = window.HTMLInputElement.prototype, S = Object.getOwnPropertyDescriptor(
        $,
        "checked"
      ).set, w = !r.current;
      if (p !== i && S) {
        const I = new Event("click", { bubbles: w });
        _.indeterminate = mn(i), S.call(_, mn(i) ? !1 : i), _.dispatchEvent(I);
      }
    }, [f, p, i, r]);
    const b = m.useRef(mn(i) ? !1 : i);
    return /* @__PURE__ */ y(
      de.input,
      {
        type: "checkbox",
        "aria-hidden": !0,
        defaultChecked: a ?? b.current,
        required: s,
        disabled: c,
        name: u,
        value: l,
        form: d,
        ...t,
        tabIndex: -1,
        ref: g,
        style: {
          ...t.style,
          ...v,
          position: "absolute",
          pointerEvents: "none",
          opacity: 0,
          margin: 0,
          // We transform because the input is absolutely positioned but we have
          // rendered it **after** the button. This pulls it back to sit on top
          // of the button.
          transform: "translateX(-100%)"
        }
      }
    );
  }
);
K$.displayName = J$;
function BU(e) {
  return typeof e == "function";
}
function mn(e) {
  return e === "indeterminate";
}
function X$(e) {
  return mn(e) ? "indeterminate" : e ? "checked" : "unchecked";
}
const HU = m.forwardRef(({ className: e, ...t }, n) => /* @__PURE__ */ y(
  Gf,
  {
    ref: n,
    className: z(
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      e
    ),
    ...t,
    children: /* @__PURE__ */ y(q$, { className: z("flex items-center justify-center text-current"), children: /* @__PURE__ */ y(Wh, { className: "h-4 w-4" }) })
  }
));
HU.displayName = Gf.displayName;
// @__NO_SIDE_EFFECTS__
function Ah(e) {
  const t = /* @__PURE__ */ GU(e), n = m.forwardRef((o, r) => {
    const { children: i, ...a } = o, s = m.Children.toArray(i), c = s.find(qU);
    if (c) {
      const u = c.props.children, l = s.map((d) => d === c ? m.Children.count(u) > 1 ? m.Children.only(null) : m.isValidElement(u) ? u.props.children : null : d);
      return /* @__PURE__ */ y(t, { ...a, ref: r, children: m.isValidElement(u) ? m.cloneElement(u, void 0, l) : null });
    }
    return /* @__PURE__ */ y(t, { ...a, ref: r, children: i });
  });
  return n.displayName = `${e}.Slot`, n;
}
// @__NO_SIDE_EFFECTS__
function GU(e) {
  const t = m.forwardRef((n, o) => {
    const { children: r, ...i } = n;
    if (m.isValidElement(r)) {
      const a = KU(r), s = JU(i, r.props);
      return r.type !== m.Fragment && (s.ref = o ? cn(o, a) : a), m.cloneElement(r, s);
    }
    return m.Children.count(r) > 1 ? m.Children.only(null) : null;
  });
  return t.displayName = `${e}.SlotClone`, t;
}
var VU = Symbol("radix.slottable");
function qU(e) {
  return m.isValidElement(e) && typeof e.type == "function" && "__radixId" in e.type && e.type.__radixId === VU;
}
function JU(e, t) {
  const n = { ...t };
  for (const o in t) {
    const r = e[o], i = t[o];
    /^on[A-Z]/.test(o) ? r && i ? n[o] = (...s) => {
      const c = i(...s);
      return r(...s), c;
    } : r && (n[o] = r) : o === "style" ? n[o] = { ...r, ...i } : o === "className" && (n[o] = [r, i].filter(Boolean).join(" "));
  }
  return { ...e, ...n };
}
function KU(e) {
  var o, r;
  let t = (o = Object.getOwnPropertyDescriptor(e.props, "ref")) == null ? void 0 : o.get, n = t && "isReactWarning" in t && t.isReactWarning;
  return n ? e.ref : (t = (r = Object.getOwnPropertyDescriptor(e, "ref")) == null ? void 0 : r.get, n = t && "isReactWarning" in t && t.isReactWarning, n ? e.props.ref : e.props.ref || e.ref);
}
function Q$(e) {
  const t = e + "CollectionProvider", [n, o] = St(t), [r, i] = n(
    t,
    { collectionRef: { current: null }, itemMap: /* @__PURE__ */ new Map() }
  ), a = (p) => {
    const { scope: v, children: b } = p, _ = R.useRef(null), $ = R.useRef(/* @__PURE__ */ new Map()).current;
    return /* @__PURE__ */ y(r, { scope: v, itemMap: $, collectionRef: _, children: b });
  };
  a.displayName = t;
  const s = e + "CollectionSlot", c = /* @__PURE__ */ Ah(s), u = R.forwardRef(
    (p, v) => {
      const { scope: b, children: _ } = p, $ = i(s, b), x = ye(v, $.collectionRef);
      return /* @__PURE__ */ y(c, { ref: x, children: _ });
    }
  );
  u.displayName = s;
  const l = e + "CollectionItemSlot", d = "data-radix-collection-item", f = /* @__PURE__ */ Ah(l), h = R.forwardRef(
    (p, v) => {
      const { scope: b, children: _, ...$ } = p, x = R.useRef(null), S = ye(v, x), w = i(l, b);
      return R.useEffect(() => (w.itemMap.set(x, { ref: x, ...$ }), () => void w.itemMap.delete(x))), /* @__PURE__ */ y(f, { [d]: "", ref: S, children: _ });
    }
  );
  h.displayName = l;
  function g(p) {
    const v = i(e + "CollectionConsumer", p);
    return R.useCallback(() => {
      const _ = v.collectionRef.current;
      if (!_)
        return [];
      const $ = Array.from(_.querySelectorAll(`[${d}]`));
      return Array.from(v.itemMap.values()).sort(
        (w, I) => $.indexOf(w.ref.current) - $.indexOf(I.ref.current)
      );
    }, [v.collectionRef, v.itemMap]);
  }
  return [
    { Provider: a, Slot: u, ItemSlot: h },
    g,
    o
  ];
}
var XU = m.createContext(void 0);
function pc(e) {
  const t = m.useContext(XU);
  return e || t || "ltr";
}
var Jc = "rovingFocusGroup.onEntryFocus", QU = { bubbles: !1, cancelable: !0 }, vi = "RovingFocusGroup", [wu, ek, ej] = Q$(vi), [tj, vc] = St(
  vi,
  [ej]
), [nj, rj] = tj(vi), tk = m.forwardRef(
  (e, t) => /* @__PURE__ */ y(wu.Provider, { scope: e.__scopeRovingFocusGroup, children: /* @__PURE__ */ y(wu.Slot, { scope: e.__scopeRovingFocusGroup, children: /* @__PURE__ */ y(oj, { ...e, ref: t }) }) })
);
tk.displayName = vi;
var oj = m.forwardRef((e, t) => {
  const {
    __scopeRovingFocusGroup: n,
    orientation: o,
    loop: r = !1,
    dir: i,
    currentTabStopId: a,
    defaultCurrentTabStopId: s,
    onCurrentTabStopIdChange: c,
    onEntryFocus: u,
    preventScrollOnEntryFocus: l = !1,
    ...d
  } = e, f = m.useRef(null), h = ye(t, f), g = pc(i), [p, v] = Hn({
    prop: a,
    defaultProp: s ?? null,
    onChange: c,
    caller: vi
  }), [b, _] = m.useState(!1), $ = Ae(u), x = ek(n), S = m.useRef(!1), [w, I] = m.useState(0);
  return m.useEffect(() => {
    const D = f.current;
    if (D)
      return D.addEventListener(Jc, $), () => D.removeEventListener(Jc, $);
  }, [$]), /* @__PURE__ */ y(
    nj,
    {
      scope: n,
      orientation: o,
      dir: g,
      loop: r,
      currentTabStopId: p,
      onItemFocus: m.useCallback(
        (D) => v(D),
        [v]
      ),
      onItemShiftTab: m.useCallback(() => _(!0), []),
      onFocusableItemAdd: m.useCallback(
        () => I((D) => D + 1),
        []
      ),
      onFocusableItemRemove: m.useCallback(
        () => I((D) => D - 1),
        []
      ),
      children: /* @__PURE__ */ y(
        de.div,
        {
          tabIndex: b || w === 0 ? -1 : 0,
          "data-orientation": o,
          ...d,
          ref: h,
          style: { outline: "none", ...e.style },
          onMouseDown: Y(e.onMouseDown, () => {
            S.current = !0;
          }),
          onFocus: Y(e.onFocus, (D) => {
            const P = !S.current;
            if (D.target === D.currentTarget && P && !b) {
              const M = new CustomEvent(Jc, QU);
              if (D.currentTarget.dispatchEvent(M), !M.defaultPrevented) {
                const B = x().filter((H) => H.focusable), K = B.find((H) => H.active), Q = B.find((H) => H.id === p), ue = [K, Q, ...B].filter(
                  Boolean
                ).map((H) => H.ref.current);
                ok(ue, l);
              }
            }
            S.current = !1;
          }),
          onBlur: Y(e.onBlur, () => _(!1))
        }
      )
    }
  );
}), nk = "RovingFocusGroupItem", rk = m.forwardRef(
  (e, t) => {
    const {
      __scopeRovingFocusGroup: n,
      focusable: o = !0,
      active: r = !1,
      tabStopId: i,
      children: a,
      ...s
    } = e, c = Kt(), u = i || c, l = rj(nk, n), d = l.currentTabStopId === u, f = ek(n), { onFocusableItemAdd: h, onFocusableItemRemove: g, currentTabStopId: p } = l;
    return m.useEffect(() => {
      if (o)
        return h(), () => g();
    }, [o, h, g]), /* @__PURE__ */ y(
      wu.ItemSlot,
      {
        scope: n,
        id: u,
        focusable: o,
        active: r,
        children: /* @__PURE__ */ y(
          de.span,
          {
            tabIndex: d ? 0 : -1,
            "data-orientation": l.orientation,
            ...s,
            ref: t,
            onMouseDown: Y(e.onMouseDown, (v) => {
              o ? l.onItemFocus(u) : v.preventDefault();
            }),
            onFocus: Y(e.onFocus, () => l.onItemFocus(u)),
            onKeyDown: Y(e.onKeyDown, (v) => {
              if (v.key === "Tab" && v.shiftKey) {
                l.onItemShiftTab();
                return;
              }
              if (v.target !== v.currentTarget)
                return;
              const b = sj(v, l.orientation, l.dir);
              if (b !== void 0) {
                if (v.metaKey || v.ctrlKey || v.altKey || v.shiftKey)
                  return;
                v.preventDefault();
                let $ = f().filter((x) => x.focusable).map((x) => x.ref.current);
                if (b === "last")
                  $.reverse();
                else if (b === "prev" || b === "next") {
                  b === "prev" && $.reverse();
                  const x = $.indexOf(v.currentTarget);
                  $ = l.loop ? cj($, x + 1) : $.slice(x + 1);
                }
                setTimeout(() => ok($));
              }
            }),
            children: typeof a == "function" ? a({ isCurrentTabStop: d, hasTabStop: p != null }) : a
          }
        )
      }
    );
  }
);
rk.displayName = nk;
var ij = {
  ArrowLeft: "prev",
  ArrowUp: "prev",
  ArrowRight: "next",
  ArrowDown: "next",
  PageUp: "first",
  Home: "first",
  PageDown: "last",
  End: "last"
};
function aj(e, t) {
  return t !== "rtl" ? e : e === "ArrowLeft" ? "ArrowRight" : e === "ArrowRight" ? "ArrowLeft" : e;
}
function sj(e, t, n) {
  const o = aj(e.key, n);
  if (!(t === "vertical" && ["ArrowLeft", "ArrowRight"].includes(o)) && !(t === "horizontal" && ["ArrowUp", "ArrowDown"].includes(o)))
    return ij[o];
}
function ok(e, t = !1) {
  const n = document.activeElement;
  for (const o of e)
    if (o === n || (o.focus({ preventScroll: t }), document.activeElement !== n))
      return;
}
function cj(e, t) {
  return e.map((n, o) => e[(t + o) % e.length]);
}
var ik = tk, ak = rk, Vf = "Radio", [uj, sk] = St(Vf), [lj, dj] = uj(Vf), ck = m.forwardRef(
  (e, t) => {
    const {
      __scopeRadio: n,
      name: o,
      checked: r = !1,
      required: i,
      disabled: a,
      value: s = "on",
      onCheck: c,
      form: u,
      ...l
    } = e, [d, f] = m.useState(null), h = ye(t, (v) => f(v)), g = m.useRef(!1), p = d ? u || !!d.closest("form") : !0;
    return /* @__PURE__ */ Ge(lj, { scope: n, checked: r, disabled: a, children: [
      /* @__PURE__ */ y(
        de.button,
        {
          type: "button",
          role: "radio",
          "aria-checked": r,
          "data-state": fk(r),
          "data-disabled": a ? "" : void 0,
          disabled: a,
          value: s,
          ...l,
          ref: h,
          onClick: Y(e.onClick, (v) => {
            r || c == null || c(), p && (g.current = v.isPropagationStopped(), g.current || v.stopPropagation());
          })
        }
      ),
      p && /* @__PURE__ */ y(
        dk,
        {
          control: d,
          bubbles: !g.current,
          name: o,
          value: s,
          checked: r,
          required: i,
          disabled: a,
          form: u,
          style: { transform: "translateX(-100%)" }
        }
      )
    ] });
  }
);
ck.displayName = Vf;
var uk = "RadioIndicator", lk = m.forwardRef(
  (e, t) => {
    const { __scopeRadio: n, forceMount: o, ...r } = e, i = dj(uk, n);
    return /* @__PURE__ */ y(We, { present: o || i.checked, children: /* @__PURE__ */ y(
      de.span,
      {
        "data-state": fk(i.checked),
        "data-disabled": i.disabled ? "" : void 0,
        ...r,
        ref: t
      }
    ) });
  }
);
lk.displayName = uk;
var fj = "RadioBubbleInput", dk = m.forwardRef(
  ({
    __scopeRadio: e,
    control: t,
    checked: n,
    bubbles: o = !0,
    ...r
  }, i) => {
    const a = m.useRef(null), s = ye(a, i), c = B$(n), u = Ff(t);
    return m.useEffect(() => {
      const l = a.current;
      if (!l)
        return;
      const d = window.HTMLInputElement.prototype, h = Object.getOwnPropertyDescriptor(
        d,
        "checked"
      ).set;
      if (c !== n && h) {
        const g = new Event("click", { bubbles: o });
        h.call(l, n), l.dispatchEvent(g);
      }
    }, [c, n, o]), /* @__PURE__ */ y(
      de.input,
      {
        type: "radio",
        "aria-hidden": !0,
        defaultChecked: n,
        ...r,
        tabIndex: -1,
        ref: s,
        style: {
          ...r.style,
          ...u,
          position: "absolute",
          pointerEvents: "none",
          opacity: 0,
          margin: 0
        }
      }
    );
  }
);
dk.displayName = fj;
function fk(e) {
  return e ? "checked" : "unchecked";
}
var mj = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"], yc = "RadioGroup", [hj, g2] = St(yc, [
  vc,
  sk
]), mk = vc(), hk = sk(), [gj, pj] = hj(yc), gk = m.forwardRef(
  (e, t) => {
    const {
      __scopeRadioGroup: n,
      name: o,
      defaultValue: r,
      value: i,
      required: a = !1,
      disabled: s = !1,
      orientation: c,
      dir: u,
      loop: l = !0,
      onValueChange: d,
      ...f
    } = e, h = mk(n), g = pc(u), [p, v] = Hn({
      prop: i,
      defaultProp: r ?? null,
      onChange: d,
      caller: yc
    });
    return /* @__PURE__ */ y(
      gj,
      {
        scope: n,
        name: o,
        required: a,
        disabled: s,
        value: p,
        onValueChange: v,
        children: /* @__PURE__ */ y(
          ik,
          {
            asChild: !0,
            ...h,
            orientation: c,
            dir: g,
            loop: l,
            children: /* @__PURE__ */ y(
              de.div,
              {
                role: "radiogroup",
                "aria-required": a,
                "aria-orientation": c,
                "data-disabled": s ? "" : void 0,
                dir: g,
                ...f,
                ref: t
              }
            )
          }
        )
      }
    );
  }
);
gk.displayName = yc;
var pk = "RadioGroupItem", vk = m.forwardRef(
  (e, t) => {
    const { __scopeRadioGroup: n, disabled: o, ...r } = e, i = pj(pk, n), a = i.disabled || o, s = mk(n), c = hk(n), u = m.useRef(null), l = ye(t, u), d = i.value === r.value, f = m.useRef(!1);
    return m.useEffect(() => {
      const h = (p) => {
        mj.includes(p.key) && (f.current = !0);
      }, g = () => f.current = !1;
      return document.addEventListener("keydown", h), document.addEventListener("keyup", g), () => {
        document.removeEventListener("keydown", h), document.removeEventListener("keyup", g);
      };
    }, []), /* @__PURE__ */ y(
      ak,
      {
        asChild: !0,
        ...s,
        focusable: !a,
        active: d,
        children: /* @__PURE__ */ y(
          ck,
          {
            disabled: a,
            required: i.required,
            checked: d,
            ...c,
            ...r,
            name: i.name,
            ref: l,
            onCheck: () => i.onValueChange(r.value),
            onKeyDown: Y((h) => {
              h.key === "Enter" && h.preventDefault();
            }),
            onFocus: Y(r.onFocus, () => {
              var h;
              f.current && ((h = u.current) == null || h.click());
            })
          }
        )
      }
    );
  }
);
vk.displayName = pk;
var vj = "RadioGroupIndicator", yk = m.forwardRef(
  (e, t) => {
    const { __scopeRadioGroup: n, ...o } = e, r = hk(n);
    return /* @__PURE__ */ y(lk, { ...r, ...o, ref: t });
  }
);
yk.displayName = vj;
var bk = gk, wk = vk, yj = yk;
const bj = m.forwardRef(({ className: e, ...t }, n) => /* @__PURE__ */ y(bk, { className: z("grid gap-2", e), ...t, ref: n }));
bj.displayName = bk.displayName;
const wj = m.forwardRef(({ className: e, ...t }, n) => /* @__PURE__ */ y(
  wk,
  {
    ref: n,
    className: z(
      "aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
      e
    ),
    ...t,
    children: /* @__PURE__ */ y(yj, { className: "flex items-center justify-center", children: /* @__PURE__ */ y(Lh, { className: "h-3.5 w-3.5 fill-primary" }) })
  }
));
wj.displayName = wk.displayName;
function _j(e, [t, n]) {
  return Math.min(n, Math.max(t, e));
}
function $j(e, t) {
  return m.useReducer((n, o) => t[n][o] ?? n, e);
}
var qf = "ScrollArea", [_k, p2] = St(qf), [kj, gt] = _k(qf), $k = m.forwardRef(
  (e, t) => {
    const {
      __scopeScrollArea: n,
      type: o = "hover",
      dir: r,
      scrollHideDelay: i = 600,
      ...a
    } = e, [s, c] = m.useState(null), [u, l] = m.useState(null), [d, f] = m.useState(null), [h, g] = m.useState(null), [p, v] = m.useState(null), [b, _] = m.useState(0), [$, x] = m.useState(0), [S, w] = m.useState(!1), [I, D] = m.useState(!1), P = ye(t, (B) => c(B)), M = pc(r);
    return /* @__PURE__ */ y(
      kj,
      {
        scope: n,
        type: o,
        dir: M,
        scrollHideDelay: i,
        scrollArea: s,
        viewport: u,
        onViewportChange: l,
        content: d,
        onContentChange: f,
        scrollbarX: h,
        onScrollbarXChange: g,
        scrollbarXEnabled: S,
        onScrollbarXEnabledChange: w,
        scrollbarY: p,
        onScrollbarYChange: v,
        scrollbarYEnabled: I,
        onScrollbarYEnabledChange: D,
        onCornerWidthChange: _,
        onCornerHeightChange: x,
        children: /* @__PURE__ */ y(
          de.div,
          {
            dir: M,
            ...a,
            ref: P,
            style: {
              position: "relative",
              // Pass corner sizes as CSS vars to reduce re-renders of context consumers
              "--radix-scroll-area-corner-width": b + "px",
              "--radix-scroll-area-corner-height": $ + "px",
              ...e.style
            }
          }
        )
      }
    );
  }
);
$k.displayName = qf;
var kk = "ScrollAreaViewport", xk = m.forwardRef(
  (e, t) => {
    const { __scopeScrollArea: n, children: o, nonce: r, ...i } = e, a = gt(kk, n), s = m.useRef(null), c = ye(t, s, a.onViewportChange);
    return /* @__PURE__ */ Ge(Gi, { children: [
      /* @__PURE__ */ y(
        "style",
        {
          dangerouslySetInnerHTML: {
            __html: "[data-radix-scroll-area-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-scroll-area-viewport]::-webkit-scrollbar{display:none}"
          },
          nonce: r
        }
      ),
      /* @__PURE__ */ y(
        de.div,
        {
          "data-radix-scroll-area-viewport": "",
          ...i,
          ref: c,
          style: {
            /**
             * We don't support `visible` because the intention is to have at least one scrollbar
             * if this component is used and `visible` will behave like `auto` in that case
             * https://developer.mozilla.org/en-US/docs/Web/CSS/overflow#description
             *
             * We don't handle `auto` because the intention is for the native implementation
             * to be hidden if using this component. We just want to ensure the node is scrollable
             * so could have used either `scroll` or `auto` here. We picked `scroll` to prevent
             * the browser from having to work out whether to render native scrollbars or not,
             * we tell it to with the intention of hiding them in CSS.
             */
            overflowX: a.scrollbarXEnabled ? "scroll" : "hidden",
            overflowY: a.scrollbarYEnabled ? "scroll" : "hidden",
            ...e.style
          },
          children: /* @__PURE__ */ y("div", { ref: a.onContentChange, style: { minWidth: "100%", display: "table" }, children: o })
        }
      )
    ] });
  }
);
xk.displayName = kk;
var Bt = "ScrollAreaScrollbar", Jf = m.forwardRef(
  (e, t) => {
    const { forceMount: n, ...o } = e, r = gt(Bt, e.__scopeScrollArea), { onScrollbarXEnabledChange: i, onScrollbarYEnabledChange: a } = r, s = e.orientation === "horizontal";
    return m.useEffect(() => (s ? i(!0) : a(!0), () => {
      s ? i(!1) : a(!1);
    }), [s, i, a]), r.type === "hover" ? /* @__PURE__ */ y(xj, { ...o, ref: t, forceMount: n }) : r.type === "scroll" ? /* @__PURE__ */ y(Sj, { ...o, ref: t, forceMount: n }) : r.type === "auto" ? /* @__PURE__ */ y(Sk, { ...o, ref: t, forceMount: n }) : r.type === "always" ? /* @__PURE__ */ y(Kf, { ...o, ref: t }) : null;
  }
);
Jf.displayName = Bt;
var xj = m.forwardRef((e, t) => {
  const { forceMount: n, ...o } = e, r = gt(Bt, e.__scopeScrollArea), [i, a] = m.useState(!1);
  return m.useEffect(() => {
    const s = r.scrollArea;
    let c = 0;
    if (s) {
      const u = () => {
        window.clearTimeout(c), a(!0);
      }, l = () => {
        c = window.setTimeout(() => a(!1), r.scrollHideDelay);
      };
      return s.addEventListener("pointerenter", u), s.addEventListener("pointerleave", l), () => {
        window.clearTimeout(c), s.removeEventListener("pointerenter", u), s.removeEventListener("pointerleave", l);
      };
    }
  }, [r.scrollArea, r.scrollHideDelay]), /* @__PURE__ */ y(We, { present: n || i, children: /* @__PURE__ */ y(
    Sk,
    {
      "data-state": i ? "visible" : "hidden",
      ...o,
      ref: t
    }
  ) });
}), Sj = m.forwardRef((e, t) => {
  const { forceMount: n, ...o } = e, r = gt(Bt, e.__scopeScrollArea), i = e.orientation === "horizontal", a = wc(() => c("SCROLL_END"), 100), [s, c] = $j("hidden", {
    hidden: {
      SCROLL: "scrolling"
    },
    scrolling: {
      SCROLL_END: "idle",
      POINTER_ENTER: "interacting"
    },
    interacting: {
      SCROLL: "interacting",
      POINTER_LEAVE: "idle"
    },
    idle: {
      HIDE: "hidden",
      SCROLL: "scrolling",
      POINTER_ENTER: "interacting"
    }
  });
  return m.useEffect(() => {
    if (s === "idle") {
      const u = window.setTimeout(() => c("HIDE"), r.scrollHideDelay);
      return () => window.clearTimeout(u);
    }
  }, [s, r.scrollHideDelay, c]), m.useEffect(() => {
    const u = r.viewport, l = i ? "scrollLeft" : "scrollTop";
    if (u) {
      let d = u[l];
      const f = () => {
        const h = u[l];
        d !== h && (c("SCROLL"), a()), d = h;
      };
      return u.addEventListener("scroll", f), () => u.removeEventListener("scroll", f);
    }
  }, [r.viewport, i, c, a]), /* @__PURE__ */ y(We, { present: n || s !== "hidden", children: /* @__PURE__ */ y(
    Kf,
    {
      "data-state": s === "hidden" ? "hidden" : "visible",
      ...o,
      ref: t,
      onPointerEnter: Y(e.onPointerEnter, () => c("POINTER_ENTER")),
      onPointerLeave: Y(e.onPointerLeave, () => c("POINTER_LEAVE"))
    }
  ) });
}), Sk = m.forwardRef((e, t) => {
  const n = gt(Bt, e.__scopeScrollArea), { forceMount: o, ...r } = e, [i, a] = m.useState(!1), s = e.orientation === "horizontal", c = wc(() => {
    if (n.viewport) {
      const u = n.viewport.offsetWidth < n.viewport.scrollWidth, l = n.viewport.offsetHeight < n.viewport.scrollHeight;
      a(s ? u : l);
    }
  }, 10);
  return xr(n.viewport, c), xr(n.content, c), /* @__PURE__ */ y(We, { present: o || i, children: /* @__PURE__ */ y(
    Kf,
    {
      "data-state": i ? "visible" : "hidden",
      ...r,
      ref: t
    }
  ) });
}), Kf = m.forwardRef((e, t) => {
  const { orientation: n = "vertical", ...o } = e, r = gt(Bt, e.__scopeScrollArea), i = m.useRef(null), a = m.useRef(0), [s, c] = m.useState({
    content: 0,
    viewport: 0,
    scrollbar: { size: 0, paddingStart: 0, paddingEnd: 0 }
  }), u = Ek(s.viewport, s.content), l = {
    ...o,
    sizes: s,
    onSizesChange: c,
    hasThumb: u > 0 && u < 1,
    onThumbChange: (f) => i.current = f,
    onThumbPointerUp: () => a.current = 0,
    onThumbPointerDown: (f) => a.current = f
  };
  function d(f, h) {
    return Pj(f, a.current, s, h);
  }
  return n === "horizontal" ? /* @__PURE__ */ y(
    Dj,
    {
      ...l,
      ref: t,
      onThumbPositionChange: () => {
        if (r.viewport && i.current) {
          const f = r.viewport.scrollLeft, h = Uh(f, s, r.dir);
          i.current.style.transform = `translate3d(${h}px, 0, 0)`;
        }
      },
      onWheelScroll: (f) => {
        r.viewport && (r.viewport.scrollLeft = f);
      },
      onDragScroll: (f) => {
        r.viewport && (r.viewport.scrollLeft = d(f, r.dir));
      }
    }
  ) : n === "vertical" ? /* @__PURE__ */ y(
    Oj,
    {
      ...l,
      ref: t,
      onThumbPositionChange: () => {
        if (r.viewport && i.current) {
          const f = r.viewport.scrollTop, h = Uh(f, s);
          i.current.style.transform = `translate3d(0, ${h}px, 0)`;
        }
      },
      onWheelScroll: (f) => {
        r.viewport && (r.viewport.scrollTop = f);
      },
      onDragScroll: (f) => {
        r.viewport && (r.viewport.scrollTop = d(f));
      }
    }
  ) : null;
}), Dj = m.forwardRef((e, t) => {
  const { sizes: n, onSizesChange: o, ...r } = e, i = gt(Bt, e.__scopeScrollArea), [a, s] = m.useState(), c = m.useRef(null), u = ye(t, c, i.onScrollbarXChange);
  return m.useEffect(() => {
    c.current && s(getComputedStyle(c.current));
  }, [c]), /* @__PURE__ */ y(
    Ok,
    {
      "data-orientation": "horizontal",
      ...r,
      ref: u,
      sizes: n,
      style: {
        bottom: 0,
        left: i.dir === "rtl" ? "var(--radix-scroll-area-corner-width)" : 0,
        right: i.dir === "ltr" ? "var(--radix-scroll-area-corner-width)" : 0,
        "--radix-scroll-area-thumb-width": bc(n) + "px",
        ...e.style
      },
      onThumbPointerDown: (l) => e.onThumbPointerDown(l.x),
      onDragScroll: (l) => e.onDragScroll(l.x),
      onWheelScroll: (l, d) => {
        if (i.viewport) {
          const f = i.viewport.scrollLeft + l.deltaX;
          e.onWheelScroll(f), Tk(f, d) && l.preventDefault();
        }
      },
      onResize: () => {
        c.current && i.viewport && a && o({
          content: i.viewport.scrollWidth,
          viewport: i.viewport.offsetWidth,
          scrollbar: {
            size: c.current.clientWidth,
            paddingStart: ba(a.paddingLeft),
            paddingEnd: ba(a.paddingRight)
          }
        });
      }
    }
  );
}), Oj = m.forwardRef((e, t) => {
  const { sizes: n, onSizesChange: o, ...r } = e, i = gt(Bt, e.__scopeScrollArea), [a, s] = m.useState(), c = m.useRef(null), u = ye(t, c, i.onScrollbarYChange);
  return m.useEffect(() => {
    c.current && s(getComputedStyle(c.current));
  }, [c]), /* @__PURE__ */ y(
    Ok,
    {
      "data-orientation": "vertical",
      ...r,
      ref: u,
      sizes: n,
      style: {
        top: 0,
        right: i.dir === "ltr" ? 0 : void 0,
        left: i.dir === "rtl" ? 0 : void 0,
        bottom: "var(--radix-scroll-area-corner-height)",
        "--radix-scroll-area-thumb-height": bc(n) + "px",
        ...e.style
      },
      onThumbPointerDown: (l) => e.onThumbPointerDown(l.y),
      onDragScroll: (l) => e.onDragScroll(l.y),
      onWheelScroll: (l, d) => {
        if (i.viewport) {
          const f = i.viewport.scrollTop + l.deltaY;
          e.onWheelScroll(f), Tk(f, d) && l.preventDefault();
        }
      },
      onResize: () => {
        c.current && i.viewport && a && o({
          content: i.viewport.scrollHeight,
          viewport: i.viewport.offsetHeight,
          scrollbar: {
            size: c.current.clientHeight,
            paddingStart: ba(a.paddingTop),
            paddingEnd: ba(a.paddingBottom)
          }
        });
      }
    }
  );
}), [Ij, Dk] = _k(Bt), Ok = m.forwardRef((e, t) => {
  const {
    __scopeScrollArea: n,
    sizes: o,
    hasThumb: r,
    onThumbChange: i,
    onThumbPointerUp: a,
    onThumbPointerDown: s,
    onThumbPositionChange: c,
    onDragScroll: u,
    onWheelScroll: l,
    onResize: d,
    ...f
  } = e, h = gt(Bt, n), [g, p] = m.useState(null), v = ye(t, (P) => p(P)), b = m.useRef(null), _ = m.useRef(""), $ = h.viewport, x = o.content - o.viewport, S = Ae(l), w = Ae(c), I = wc(d, 10);
  function D(P) {
    if (b.current) {
      const M = P.clientX - b.current.left, B = P.clientY - b.current.top;
      u({ x: M, y: B });
    }
  }
  return m.useEffect(() => {
    const P = (M) => {
      const B = M.target;
      (g == null ? void 0 : g.contains(B)) && S(M, x);
    };
    return document.addEventListener("wheel", P, { passive: !1 }), () => document.removeEventListener("wheel", P, { passive: !1 });
  }, [$, g, x, S]), m.useEffect(w, [o, w]), xr(g, I), xr(h.content, I), /* @__PURE__ */ y(
    Ij,
    {
      scope: n,
      scrollbar: g,
      hasThumb: r,
      onThumbChange: Ae(i),
      onThumbPointerUp: Ae(a),
      onThumbPositionChange: w,
      onThumbPointerDown: Ae(s),
      children: /* @__PURE__ */ y(
        de.div,
        {
          ...f,
          ref: v,
          style: { position: "absolute", ...f.style },
          onPointerDown: Y(e.onPointerDown, (P) => {
            P.button === 0 && (P.target.setPointerCapture(P.pointerId), b.current = g.getBoundingClientRect(), _.current = document.body.style.webkitUserSelect, document.body.style.webkitUserSelect = "none", h.viewport && (h.viewport.style.scrollBehavior = "auto"), D(P));
          }),
          onPointerMove: Y(e.onPointerMove, D),
          onPointerUp: Y(e.onPointerUp, (P) => {
            const M = P.target;
            M.hasPointerCapture(P.pointerId) && M.releasePointerCapture(P.pointerId), document.body.style.webkitUserSelect = _.current, h.viewport && (h.viewport.style.scrollBehavior = ""), b.current = null;
          })
        }
      )
    }
  );
}), ya = "ScrollAreaThumb", Ik = m.forwardRef(
  (e, t) => {
    const { forceMount: n, ...o } = e, r = Dk(ya, e.__scopeScrollArea);
    return /* @__PURE__ */ y(We, { present: n || r.hasThumb, children: /* @__PURE__ */ y(Nj, { ref: t, ...o }) });
  }
), Nj = m.forwardRef(
  (e, t) => {
    const { __scopeScrollArea: n, style: o, ...r } = e, i = gt(ya, n), a = Dk(ya, n), { onThumbPositionChange: s } = a, c = ye(
      t,
      (d) => a.onThumbChange(d)
    ), u = m.useRef(void 0), l = wc(() => {
      u.current && (u.current(), u.current = void 0);
    }, 100);
    return m.useEffect(() => {
      const d = i.viewport;
      if (d) {
        const f = () => {
          if (l(), !u.current) {
            const h = Tj(d, s);
            u.current = h, s();
          }
        };
        return s(), d.addEventListener("scroll", f), () => d.removeEventListener("scroll", f);
      }
    }, [i.viewport, l, s]), /* @__PURE__ */ y(
      de.div,
      {
        "data-state": a.hasThumb ? "visible" : "hidden",
        ...r,
        ref: c,
        style: {
          width: "var(--radix-scroll-area-thumb-width)",
          height: "var(--radix-scroll-area-thumb-height)",
          ...o
        },
        onPointerDownCapture: Y(e.onPointerDownCapture, (d) => {
          const h = d.target.getBoundingClientRect(), g = d.clientX - h.left, p = d.clientY - h.top;
          a.onThumbPointerDown({ x: g, y: p });
        }),
        onPointerUp: Y(e.onPointerUp, a.onThumbPointerUp)
      }
    );
  }
);
Ik.displayName = ya;
var Xf = "ScrollAreaCorner", Nk = m.forwardRef(
  (e, t) => {
    const n = gt(Xf, e.__scopeScrollArea), o = !!(n.scrollbarX && n.scrollbarY);
    return n.type !== "scroll" && o ? /* @__PURE__ */ y(Ej, { ...e, ref: t }) : null;
  }
);
Nk.displayName = Xf;
var Ej = m.forwardRef((e, t) => {
  const { __scopeScrollArea: n, ...o } = e, r = gt(Xf, n), [i, a] = m.useState(0), [s, c] = m.useState(0), u = !!(i && s);
  return xr(r.scrollbarX, () => {
    var d;
    const l = ((d = r.scrollbarX) == null ? void 0 : d.offsetHeight) || 0;
    r.onCornerHeightChange(l), c(l);
  }), xr(r.scrollbarY, () => {
    var d;
    const l = ((d = r.scrollbarY) == null ? void 0 : d.offsetWidth) || 0;
    r.onCornerWidthChange(l), a(l);
  }), u ? /* @__PURE__ */ y(
    de.div,
    {
      ...o,
      ref: t,
      style: {
        width: i,
        height: s,
        position: "absolute",
        right: r.dir === "ltr" ? 0 : void 0,
        left: r.dir === "rtl" ? 0 : void 0,
        bottom: 0,
        ...e.style
      }
    }
  ) : null;
});
function ba(e) {
  return e ? parseInt(e, 10) : 0;
}
function Ek(e, t) {
  const n = e / t;
  return isNaN(n) ? 0 : n;
}
function bc(e) {
  const t = Ek(e.viewport, e.content), n = e.scrollbar.paddingStart + e.scrollbar.paddingEnd, o = (e.scrollbar.size - n) * t;
  return Math.max(o, 18);
}
function Pj(e, t, n, o = "ltr") {
  const r = bc(n), i = r / 2, a = t || i, s = r - a, c = n.scrollbar.paddingStart + a, u = n.scrollbar.size - n.scrollbar.paddingEnd - s, l = n.content - n.viewport, d = o === "ltr" ? [0, l] : [l * -1, 0];
  return Pk([c, u], d)(e);
}
function Uh(e, t, n = "ltr") {
  const o = bc(t), r = t.scrollbar.paddingStart + t.scrollbar.paddingEnd, i = t.scrollbar.size - r, a = t.content - t.viewport, s = i - o, c = n === "ltr" ? [0, a] : [a * -1, 0], u = _j(e, c);
  return Pk([0, a], [0, s])(u);
}
function Pk(e, t) {
  return (n) => {
    if (e[0] === e[1] || t[0] === t[1])
      return t[0];
    const o = (t[1] - t[0]) / (e[1] - e[0]);
    return t[0] + o * (n - e[0]);
  };
}
function Tk(e, t) {
  return e > 0 && e < t;
}
var Tj = (e, t = () => {
}) => {
  let n = { left: e.scrollLeft, top: e.scrollTop }, o = 0;
  return function r() {
    const i = { left: e.scrollLeft, top: e.scrollTop }, a = n.left !== i.left, s = n.top !== i.top;
    (a || s) && t(), n = i, o = window.requestAnimationFrame(r);
  }(), () => window.cancelAnimationFrame(o);
};
function wc(e, t) {
  const n = Ae(e), o = m.useRef(0);
  return m.useEffect(() => () => window.clearTimeout(o.current), []), m.useCallback(() => {
    window.clearTimeout(o.current), o.current = window.setTimeout(n, t);
  }, [n, t]);
}
function xr(e, t) {
  const n = Ae(t);
  on(() => {
    let o = 0;
    if (e) {
      const r = new ResizeObserver(() => {
        cancelAnimationFrame(o), o = window.requestAnimationFrame(n);
      });
      return r.observe(e), () => {
        window.cancelAnimationFrame(o), r.unobserve(e);
      };
    }
  }, [e, n]);
}
var Ck = $k, Cj = xk, Mj = Nk;
const zj = m.forwardRef(({ className: e, children: t, ...n }, o) => /* @__PURE__ */ Ge(
  Ck,
  {
    ref: o,
    className: z("relative overflow-hidden", e),
    ...n,
    children: [
      /* @__PURE__ */ y(Cj, { className: "h-full w-full rounded-[inherit]", children: t }),
      /* @__PURE__ */ y(Mk, {}),
      /* @__PURE__ */ y(Mj, {})
    ]
  }
));
zj.displayName = Ck.displayName;
const Mk = m.forwardRef(({ className: e, orientation: t = "vertical", ...n }, o) => /* @__PURE__ */ y(
  Jf,
  {
    ref: o,
    orientation: t,
    className: z(
      "flex touch-none select-none transition-colors",
      t === "vertical" && "h-full w-2.5 border-l border-l-transparent p-[1px]",
      t === "horizontal" && "h-2.5 border-t border-t-transparent p-[1px]",
      e
    ),
    ...n,
    children: /* @__PURE__ */ y(Ik, { className: "relative flex-1 rounded-full bg-border" })
  }
));
Mk.displayName = Jf.displayName;
const v2 = W_, y2 = L_, b2 = ac, Rj = Z_, zk = m.forwardRef(({ className: e, ...t }, n) => /* @__PURE__ */ y(
  nc,
  {
    className: z(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      e
    ),
    ...t,
    ref: n
  }
));
zk.displayName = nc.displayName;
const Aj = js(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
      }
    },
    defaultVariants: {
      side: "right"
    }
  }
), Uj = m.forwardRef(({ side: e = "right", className: t, children: n, ...o }, r) => /* @__PURE__ */ Ge(Rj, { children: [
  /* @__PURE__ */ y(zk, {}),
  /* @__PURE__ */ Ge(rc, { ref: r, className: z(Aj({ side: e }), t), ...o, children: [
    /* @__PURE__ */ Ge(ac, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary", children: [
      /* @__PURE__ */ y(Fh, { className: "h-4 w-4" }),
      /* @__PURE__ */ y("span", { className: "sr-only", children: "Close" })
    ] }),
    n
  ] })
] }));
Uj.displayName = rc.displayName;
const jj = ({ className: e, ...t }) => /* @__PURE__ */ y("div", { className: z("flex flex-col space-y-2 text-center sm:text-left", e), ...t });
jj.displayName = "SheetHeader";
const Fj = ({ className: e, ...t }) => /* @__PURE__ */ y(
  "div",
  {
    className: z("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", e),
    ...t
  }
);
Fj.displayName = "SheetFooter";
const Wj = m.forwardRef(({ className: e, ...t }, n) => /* @__PURE__ */ y(
  oc,
  {
    ref: n,
    className: z("text-lg font-semibold text-foreground", e),
    ...t
  }
));
Wj.displayName = oc.displayName;
const Lj = m.forwardRef(({ className: e, ...t }, n) => /* @__PURE__ */ y(
  ic,
  {
    ref: n,
    className: z("text-sm text-muted-foreground", e),
    ...t
  }
));
Lj.displayName = ic.displayName;
const Zj = m.forwardRef(
  ({ className: e, children: t, ...n }, o) => /* @__PURE__ */ y("div", { className: "relative w-full overflow-auto", children: /* @__PURE__ */ y("table", { ref: o, className: z("w-full caption-bottom text-sm", e), ...n, children: t }) })
);
Zj.displayName = "Table";
const Yj = m.forwardRef(({ className: e, ...t }, n) => /* @__PURE__ */ y("thead", { ref: n, className: z("[&_tr]:border-b", e), ...t }));
Yj.displayName = "TableHeader";
const Bj = m.forwardRef(({ className: e, ...t }, n) => /* @__PURE__ */ y("tbody", { ref: n, className: z("[&_tr:last-child]:border-0", e), ...t }));
Bj.displayName = "TableBody";
const Hj = m.forwardRef(({ className: e, ...t }, n) => /* @__PURE__ */ y(
  "tfoot",
  {
    ref: n,
    className: z("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", e),
    ...t
  }
));
Hj.displayName = "TableFooter";
const Gj = m.forwardRef(
  ({ className: e, ...t }, n) => /* @__PURE__ */ y(
    "tr",
    {
      ref: n,
      className: z(
        "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
        e
      ),
      ...t
    }
  )
);
Gj.displayName = "TableRow";
const Vj = m.forwardRef(({ className: e, ...t }, n) => /* @__PURE__ */ y(
  "th",
  {
    ref: n,
    className: z(
      "h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      e
    ),
    ...t
  }
));
Vj.displayName = "TableHead";
const qj = m.forwardRef(({ className: e, ...t }, n) => /* @__PURE__ */ y(
  "td",
  {
    ref: n,
    className: z(
      "p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      e
    ),
    ...t
  }
));
qj.displayName = "TableCell";
const Jj = m.forwardRef(({ className: e, ...t }, n) => /* @__PURE__ */ y("caption", { ref: n, className: z("mt-4 text-sm text-muted-foreground", e), ...t }));
Jj.displayName = "TableCaption";
// @__NO_SIDE_EFFECTS__
function Kj(e) {
  const t = /* @__PURE__ */ Xj(e), n = m.forwardRef((o, r) => {
    const { children: i, ...a } = o, s = m.Children.toArray(i), c = s.find(e6);
    if (c) {
      const u = c.props.children, l = s.map((d) => d === c ? m.Children.count(u) > 1 ? m.Children.only(null) : m.isValidElement(u) ? u.props.children : null : d);
      return /* @__PURE__ */ y(t, { ...a, ref: r, children: m.isValidElement(u) ? m.cloneElement(u, void 0, l) : null });
    }
    return /* @__PURE__ */ y(t, { ...a, ref: r, children: i });
  });
  return n.displayName = `${e}.Slot`, n;
}
// @__NO_SIDE_EFFECTS__
function Xj(e) {
  const t = m.forwardRef((n, o) => {
    const { children: r, ...i } = n;
    if (m.isValidElement(r)) {
      const a = n6(r), s = t6(i, r.props);
      return r.type !== m.Fragment && (s.ref = o ? cn(o, a) : a), m.cloneElement(r, s);
    }
    return m.Children.count(r) > 1 ? m.Children.only(null) : null;
  });
  return t.displayName = `${e}.SlotClone`, t;
}
var Qj = Symbol("radix.slottable");
function e6(e) {
  return m.isValidElement(e) && typeof e.type == "function" && "__radixId" in e.type && e.type.__radixId === Qj;
}
function t6(e, t) {
  const n = { ...t };
  for (const o in t) {
    const r = e[o], i = t[o];
    /^on[A-Z]/.test(o) ? r && i ? n[o] = (...s) => {
      const c = i(...s);
      return r(...s), c;
    } : r && (n[o] = r) : o === "style" ? n[o] = { ...r, ...i } : o === "className" && (n[o] = [r, i].filter(Boolean).join(" "));
  }
  return { ...e, ...n };
}
function n6(e) {
  var o, r;
  let t = (o = Object.getOwnPropertyDescriptor(e.props, "ref")) == null ? void 0 : o.get, n = t && "isReactWarning" in t && t.isReactWarning;
  return n ? e.ref : (t = (r = Object.getOwnPropertyDescriptor(e, "ref")) == null ? void 0 : r.get, n = t && "isReactWarning" in t && t.isReactWarning, n ? e.props.ref : e.props.ref || e.ref);
}
var _u = ["Enter", " "], r6 = ["ArrowDown", "PageUp", "Home"], Rk = ["ArrowUp", "PageDown", "End"], o6 = [...r6, ...Rk], i6 = {
  ltr: [..._u, "ArrowRight"],
  rtl: [..._u, "ArrowLeft"]
}, a6 = {
  ltr: ["ArrowLeft"],
  rtl: ["ArrowRight"]
}, yi = "Menu", [so, s6, c6] = Q$(yi), [Gn, Ak] = St(yi, [
  c6,
  mc,
  vc
]), bi = mc(), Uk = vc(), [jk, Dn] = Gn(yi), [u6, wi] = Gn(yi), Fk = (e) => {
  const { __scopeMenu: t, open: n = !1, children: o, dir: r, onOpenChange: i, modal: a = !0 } = e, s = bi(t), [c, u] = m.useState(null), l = m.useRef(!1), d = Ae(i), f = pc(r);
  return m.useEffect(() => {
    const h = () => {
      l.current = !0, document.addEventListener("pointerdown", g, { capture: !0, once: !0 }), document.addEventListener("pointermove", g, { capture: !0, once: !0 });
    }, g = () => l.current = !1;
    return document.addEventListener("keydown", h, { capture: !0 }), () => {
      document.removeEventListener("keydown", h, { capture: !0 }), document.removeEventListener("pointerdown", g, { capture: !0 }), document.removeEventListener("pointermove", g, { capture: !0 });
    };
  }, []), /* @__PURE__ */ y(Zf, { ...s, children: /* @__PURE__ */ y(
    jk,
    {
      scope: t,
      open: n,
      onOpenChange: d,
      content: c,
      onContentChange: u,
      children: /* @__PURE__ */ y(
        u6,
        {
          scope: t,
          onClose: m.useCallback(() => d(!1), [d]),
          isUsingKeyboardRef: l,
          dir: f,
          modal: a,
          children: o
        }
      )
    }
  ) });
};
Fk.displayName = yi;
var l6 = "MenuAnchor", Qf = m.forwardRef(
  (e, t) => {
    const { __scopeMenu: n, ...o } = e, r = bi(n);
    return /* @__PURE__ */ y(Yf, { ...r, ...o, ref: t });
  }
);
Qf.displayName = l6;
var em = "MenuPortal", [d6, Wk] = Gn(em, {
  forceMount: void 0
}), Lk = (e) => {
  const { __scopeMenu: t, forceMount: n, children: o, container: r } = e, i = Dn(em, t);
  return /* @__PURE__ */ y(d6, { scope: t, forceMount: n, children: /* @__PURE__ */ y(We, { present: n || i.open, children: /* @__PURE__ */ y(Qs, { asChild: !0, container: r, children: o }) }) });
};
Lk.displayName = em;
var ft = "MenuContent", [f6, tm] = Gn(ft), Zk = m.forwardRef(
  (e, t) => {
    const n = Wk(ft, e.__scopeMenu), { forceMount: o = n.forceMount, ...r } = e, i = Dn(ft, e.__scopeMenu), a = wi(ft, e.__scopeMenu);
    return /* @__PURE__ */ y(so.Provider, { scope: e.__scopeMenu, children: /* @__PURE__ */ y(We, { present: o || i.open, children: /* @__PURE__ */ y(so.Slot, { scope: e.__scopeMenu, children: a.modal ? /* @__PURE__ */ y(m6, { ...r, ref: t }) : /* @__PURE__ */ y(h6, { ...r, ref: t }) }) }) });
  }
), m6 = m.forwardRef(
  (e, t) => {
    const n = Dn(ft, e.__scopeMenu), o = m.useRef(null), r = ye(t, o);
    return m.useEffect(() => {
      const i = o.current;
      if (i)
        return xf(i);
    }, []), /* @__PURE__ */ y(
      nm,
      {
        ...e,
        ref: r,
        trapFocus: n.open,
        disableOutsidePointerEvents: n.open,
        disableOutsideScroll: !0,
        onFocusOutside: Y(
          e.onFocusOutside,
          (i) => i.preventDefault(),
          { checkForDefaultPrevented: !1 }
        ),
        onDismiss: () => n.onOpenChange(!1)
      }
    );
  }
), h6 = m.forwardRef((e, t) => {
  const n = Dn(ft, e.__scopeMenu);
  return /* @__PURE__ */ y(
    nm,
    {
      ...e,
      ref: t,
      trapFocus: !1,
      disableOutsidePointerEvents: !1,
      disableOutsideScroll: !1,
      onDismiss: () => n.onOpenChange(!1)
    }
  );
}), g6 = /* @__PURE__ */ Kj("MenuContent.ScrollLock"), nm = m.forwardRef(
  (e, t) => {
    const {
      __scopeMenu: n,
      loop: o = !1,
      trapFocus: r,
      onOpenAutoFocus: i,
      onCloseAutoFocus: a,
      disableOutsidePointerEvents: s,
      onEntryFocus: c,
      onEscapeKeyDown: u,
      onPointerDownOutside: l,
      onFocusOutside: d,
      onInteractOutside: f,
      onDismiss: h,
      disableOutsideScroll: g,
      ...p
    } = e, v = Dn(ft, n), b = wi(ft, n), _ = bi(n), $ = Uk(n), x = s6(n), [S, w] = m.useState(null), I = m.useRef(null), D = ye(t, I, v.onContentChange), P = m.useRef(0), M = m.useRef(""), B = m.useRef(0), K = m.useRef(null), Q = m.useRef("right"), V = m.useRef(0), ue = g ? kf : m.Fragment, H = g ? { as: g6, allowPinchZoom: !0 } : void 0, ce = (A) => {
      var fe, Ot;
      const oe = M.current + A, se = x().filter((Ee) => !Ee.disabled), ke = document.activeElement, me = (fe = se.find((Ee) => Ee.ref.current === ke)) == null ? void 0 : fe.textValue, pe = se.map((Ee) => Ee.textValue), ze = O6(pe, oe, me), Xe = (Ot = se.find((Ee) => Ee.textValue === ze)) == null ? void 0 : Ot.ref.current;
      (function Ee(Ze) {
        M.current = Ze, window.clearTimeout(P.current), Ze !== "" && (P.current = window.setTimeout(() => Ee(""), 1e3));
      })(oe), Xe && setTimeout(() => Xe.focus());
    };
    m.useEffect(() => () => window.clearTimeout(P.current), []), $f();
    const T = m.useCallback((A) => {
      var se, ke;
      return Q.current === ((se = K.current) == null ? void 0 : se.side) && N6(A, (ke = K.current) == null ? void 0 : ke.area);
    }, []);
    return /* @__PURE__ */ y(
      f6,
      {
        scope: n,
        searchRef: M,
        onItemEnter: m.useCallback(
          (A) => {
            T(A) && A.preventDefault();
          },
          [T]
        ),
        onItemLeave: m.useCallback(
          (A) => {
            var oe;
            T(A) || ((oe = I.current) == null || oe.focus(), w(null));
          },
          [T]
        ),
        onTriggerLeave: m.useCallback(
          (A) => {
            T(A) && A.preventDefault();
          },
          [T]
        ),
        pointerGraceTimerRef: B,
        onPointerGraceIntentChange: m.useCallback((A) => {
          K.current = A;
        }, []),
        children: /* @__PURE__ */ y(ue, { ...H, children: /* @__PURE__ */ y(
          Xs,
          {
            asChild: !0,
            trapped: r,
            onMountAutoFocus: Y(i, (A) => {
              var oe;
              A.preventDefault(), (oe = I.current) == null || oe.focus({ preventScroll: !0 });
            }),
            onUnmountAutoFocus: a,
            children: /* @__PURE__ */ y(
              Ks,
              {
                asChild: !0,
                disableOutsidePointerEvents: s,
                onEscapeKeyDown: u,
                onPointerDownOutside: l,
                onFocusOutside: d,
                onInteractOutside: f,
                onDismiss: h,
                children: /* @__PURE__ */ y(
                  ik,
                  {
                    asChild: !0,
                    ...$,
                    dir: b.dir,
                    orientation: "vertical",
                    loop: o,
                    currentTabStopId: S,
                    onCurrentTabStopIdChange: w,
                    onEntryFocus: Y(c, (A) => {
                      b.isUsingKeyboardRef.current || A.preventDefault();
                    }),
                    preventScrollOnEntryFocus: !0,
                    children: /* @__PURE__ */ y(
                      P$,
                      {
                        role: "menu",
                        "aria-orientation": "vertical",
                        "data-state": ax(v.open),
                        "data-radix-menu-content": "",
                        dir: b.dir,
                        ..._,
                        ...p,
                        ref: D,
                        style: { outline: "none", ...p.style },
                        onKeyDown: Y(p.onKeyDown, (A) => {
                          const se = A.target.closest("[data-radix-menu-content]") === A.currentTarget, ke = A.ctrlKey || A.altKey || A.metaKey, me = A.key.length === 1;
                          se && (A.key === "Tab" && A.preventDefault(), !ke && me && ce(A.key));
                          const pe = I.current;
                          if (A.target !== pe || !o6.includes(A.key))
                            return;
                          A.preventDefault();
                          const Xe = x().filter((fe) => !fe.disabled).map((fe) => fe.ref.current);
                          Rk.includes(A.key) && Xe.reverse(), S6(Xe);
                        }),
                        onBlur: Y(e.onBlur, (A) => {
                          A.currentTarget.contains(A.target) || (window.clearTimeout(P.current), M.current = "");
                        }),
                        onPointerMove: Y(
                          e.onPointerMove,
                          co((A) => {
                            const oe = A.target, se = V.current !== A.clientX;
                            if (A.currentTarget.contains(oe) && se) {
                              const ke = A.clientX > V.current ? "right" : "left";
                              Q.current = ke, V.current = A.clientX;
                            }
                          })
                        )
                      }
                    )
                  }
                )
              }
            )
          }
        ) })
      }
    );
  }
);
Zk.displayName = ft;
var p6 = "MenuGroup", rm = m.forwardRef(
  (e, t) => {
    const { __scopeMenu: n, ...o } = e;
    return /* @__PURE__ */ y(de.div, { role: "group", ...o, ref: t });
  }
);
rm.displayName = p6;
var v6 = "MenuLabel", Yk = m.forwardRef(
  (e, t) => {
    const { __scopeMenu: n, ...o } = e;
    return /* @__PURE__ */ y(de.div, { ...o, ref: t });
  }
);
Yk.displayName = v6;
var wa = "MenuItem", jh = "menu.itemSelect", _c = m.forwardRef(
  (e, t) => {
    const { disabled: n = !1, onSelect: o, ...r } = e, i = m.useRef(null), a = wi(wa, e.__scopeMenu), s = tm(wa, e.__scopeMenu), c = ye(t, i), u = m.useRef(!1), l = () => {
      const d = i.current;
      if (!n && d) {
        const f = new CustomEvent(jh, { bubbles: !0, cancelable: !0 });
        d.addEventListener(jh, (h) => o == null ? void 0 : o(h), { once: !0 }), f_(d, f), f.defaultPrevented ? u.current = !1 : a.onClose();
      }
    };
    return /* @__PURE__ */ y(
      Bk,
      {
        ...r,
        ref: c,
        disabled: n,
        onClick: Y(e.onClick, l),
        onPointerDown: (d) => {
          var f;
          (f = e.onPointerDown) == null || f.call(e, d), u.current = !0;
        },
        onPointerUp: Y(e.onPointerUp, (d) => {
          var f;
          u.current || (f = d.currentTarget) == null || f.click();
        }),
        onKeyDown: Y(e.onKeyDown, (d) => {
          const f = s.searchRef.current !== "";
          n || f && d.key === " " || _u.includes(d.key) && (d.currentTarget.click(), d.preventDefault());
        })
      }
    );
  }
);
_c.displayName = wa;
var Bk = m.forwardRef(
  (e, t) => {
    const { __scopeMenu: n, disabled: o = !1, textValue: r, ...i } = e, a = tm(wa, n), s = Uk(n), c = m.useRef(null), u = ye(t, c), [l, d] = m.useState(!1), [f, h] = m.useState("");
    return m.useEffect(() => {
      const g = c.current;
      g && h((g.textContent ?? "").trim());
    }, [i.children]), /* @__PURE__ */ y(
      so.ItemSlot,
      {
        scope: n,
        disabled: o,
        textValue: r ?? f,
        children: /* @__PURE__ */ y(ak, { asChild: !0, ...s, focusable: !o, children: /* @__PURE__ */ y(
          de.div,
          {
            role: "menuitem",
            "data-highlighted": l ? "" : void 0,
            "aria-disabled": o || void 0,
            "data-disabled": o ? "" : void 0,
            ...i,
            ref: u,
            onPointerMove: Y(
              e.onPointerMove,
              co((g) => {
                o ? a.onItemLeave(g) : (a.onItemEnter(g), g.defaultPrevented || g.currentTarget.focus({ preventScroll: !0 }));
              })
            ),
            onPointerLeave: Y(
              e.onPointerLeave,
              co((g) => a.onItemLeave(g))
            ),
            onFocus: Y(e.onFocus, () => d(!0)),
            onBlur: Y(e.onBlur, () => d(!1))
          }
        ) })
      }
    );
  }
), y6 = "MenuCheckboxItem", Hk = m.forwardRef(
  (e, t) => {
    const { checked: n = !1, onCheckedChange: o, ...r } = e;
    return /* @__PURE__ */ y(Kk, { scope: e.__scopeMenu, checked: n, children: /* @__PURE__ */ y(
      _c,
      {
        role: "menuitemcheckbox",
        "aria-checked": _a(n) ? "mixed" : n,
        ...r,
        ref: t,
        "data-state": am(n),
        onSelect: Y(
          r.onSelect,
          () => o == null ? void 0 : o(_a(n) ? !0 : !n),
          { checkForDefaultPrevented: !1 }
        )
      }
    ) });
  }
);
Hk.displayName = y6;
var Gk = "MenuRadioGroup", [b6, w6] = Gn(
  Gk,
  { value: void 0, onValueChange: () => {
  } }
), Vk = m.forwardRef(
  (e, t) => {
    const { value: n, onValueChange: o, ...r } = e, i = Ae(o);
    return /* @__PURE__ */ y(b6, { scope: e.__scopeMenu, value: n, onValueChange: i, children: /* @__PURE__ */ y(rm, { ...r, ref: t }) });
  }
);
Vk.displayName = Gk;
var qk = "MenuRadioItem", Jk = m.forwardRef(
  (e, t) => {
    const { value: n, ...o } = e, r = w6(qk, e.__scopeMenu), i = n === r.value;
    return /* @__PURE__ */ y(Kk, { scope: e.__scopeMenu, checked: i, children: /* @__PURE__ */ y(
      _c,
      {
        role: "menuitemradio",
        "aria-checked": i,
        ...o,
        ref: t,
        "data-state": am(i),
        onSelect: Y(
          o.onSelect,
          () => {
            var a;
            return (a = r.onValueChange) == null ? void 0 : a.call(r, n);
          },
          { checkForDefaultPrevented: !1 }
        )
      }
    ) });
  }
);
Jk.displayName = qk;
var om = "MenuItemIndicator", [Kk, _6] = Gn(
  om,
  { checked: !1 }
), Xk = m.forwardRef(
  (e, t) => {
    const { __scopeMenu: n, forceMount: o, ...r } = e, i = _6(om, n);
    return /* @__PURE__ */ y(
      We,
      {
        present: o || _a(i.checked) || i.checked === !0,
        children: /* @__PURE__ */ y(
          de.span,
          {
            ...r,
            ref: t,
            "data-state": am(i.checked)
          }
        )
      }
    );
  }
);
Xk.displayName = om;
var $6 = "MenuSeparator", Qk = m.forwardRef(
  (e, t) => {
    const { __scopeMenu: n, ...o } = e;
    return /* @__PURE__ */ y(
      de.div,
      {
        role: "separator",
        "aria-orientation": "horizontal",
        ...o,
        ref: t
      }
    );
  }
);
Qk.displayName = $6;
var k6 = "MenuArrow", ex = m.forwardRef(
  (e, t) => {
    const { __scopeMenu: n, ...o } = e, r = bi(n);
    return /* @__PURE__ */ y(T$, { ...r, ...o, ref: t });
  }
);
ex.displayName = k6;
var im = "MenuSub", [x6, tx] = Gn(im), nx = (e) => {
  const { __scopeMenu: t, children: n, open: o = !1, onOpenChange: r } = e, i = Dn(im, t), a = bi(t), [s, c] = m.useState(null), [u, l] = m.useState(null), d = Ae(r);
  return m.useEffect(() => (i.open === !1 && d(!1), () => d(!1)), [i.open, d]), /* @__PURE__ */ y(Zf, { ...a, children: /* @__PURE__ */ y(
    jk,
    {
      scope: t,
      open: o,
      onOpenChange: d,
      content: u,
      onContentChange: l,
      children: /* @__PURE__ */ y(
        x6,
        {
          scope: t,
          contentId: Kt(),
          triggerId: Kt(),
          trigger: s,
          onTriggerChange: c,
          children: n
        }
      )
    }
  ) });
};
nx.displayName = im;
var Qr = "MenuSubTrigger", rx = m.forwardRef(
  (e, t) => {
    const n = Dn(Qr, e.__scopeMenu), o = wi(Qr, e.__scopeMenu), r = tx(Qr, e.__scopeMenu), i = tm(Qr, e.__scopeMenu), a = m.useRef(null), { pointerGraceTimerRef: s, onPointerGraceIntentChange: c } = i, u = { __scopeMenu: e.__scopeMenu }, l = m.useCallback(() => {
      a.current && window.clearTimeout(a.current), a.current = null;
    }, []);
    return m.useEffect(() => l, [l]), m.useEffect(() => {
      const d = s.current;
      return () => {
        window.clearTimeout(d), c(null);
      };
    }, [s, c]), /* @__PURE__ */ y(Qf, { asChild: !0, ...u, children: /* @__PURE__ */ y(
      Bk,
      {
        id: r.triggerId,
        "aria-haspopup": "menu",
        "aria-expanded": n.open,
        "aria-controls": r.contentId,
        "data-state": ax(n.open),
        ...e,
        ref: cn(t, r.onTriggerChange),
        onClick: (d) => {
          var f;
          (f = e.onClick) == null || f.call(e, d), !(e.disabled || d.defaultPrevented) && (d.currentTarget.focus(), n.open || n.onOpenChange(!0));
        },
        onPointerMove: Y(
          e.onPointerMove,
          co((d) => {
            i.onItemEnter(d), !d.defaultPrevented && !e.disabled && !n.open && !a.current && (i.onPointerGraceIntentChange(null), a.current = window.setTimeout(() => {
              n.onOpenChange(!0), l();
            }, 100));
          })
        ),
        onPointerLeave: Y(
          e.onPointerLeave,
          co((d) => {
            var h, g;
            l();
            const f = (h = n.content) == null ? void 0 : h.getBoundingClientRect();
            if (f) {
              const p = (g = n.content) == null ? void 0 : g.dataset.side, v = p === "right", b = v ? -5 : 5, _ = f[v ? "left" : "right"], $ = f[v ? "right" : "left"];
              i.onPointerGraceIntentChange({
                area: [
                  // Apply a bleed on clientX to ensure that our exit point is
                  // consistently within polygon bounds
                  { x: d.clientX + b, y: d.clientY },
                  { x: _, y: f.top },
                  { x: $, y: f.top },
                  { x: $, y: f.bottom },
                  { x: _, y: f.bottom }
                ],
                side: p
              }), window.clearTimeout(s.current), s.current = window.setTimeout(
                () => i.onPointerGraceIntentChange(null),
                300
              );
            } else {
              if (i.onTriggerLeave(d), d.defaultPrevented)
                return;
              i.onPointerGraceIntentChange(null);
            }
          })
        ),
        onKeyDown: Y(e.onKeyDown, (d) => {
          var h;
          const f = i.searchRef.current !== "";
          e.disabled || f && d.key === " " || i6[o.dir].includes(d.key) && (n.onOpenChange(!0), (h = n.content) == null || h.focus(), d.preventDefault());
        })
      }
    ) });
  }
);
rx.displayName = Qr;
var ox = "MenuSubContent", ix = m.forwardRef(
  (e, t) => {
    const n = Wk(ft, e.__scopeMenu), { forceMount: o = n.forceMount, ...r } = e, i = Dn(ft, e.__scopeMenu), a = wi(ft, e.__scopeMenu), s = tx(ox, e.__scopeMenu), c = m.useRef(null), u = ye(t, c);
    return /* @__PURE__ */ y(so.Provider, { scope: e.__scopeMenu, children: /* @__PURE__ */ y(We, { present: o || i.open, children: /* @__PURE__ */ y(so.Slot, { scope: e.__scopeMenu, children: /* @__PURE__ */ y(
      nm,
      {
        id: s.contentId,
        "aria-labelledby": s.triggerId,
        ...r,
        ref: u,
        align: "start",
        side: a.dir === "rtl" ? "left" : "right",
        disableOutsidePointerEvents: !1,
        disableOutsideScroll: !1,
        trapFocus: !1,
        onOpenAutoFocus: (l) => {
          var d;
          a.isUsingKeyboardRef.current && ((d = c.current) == null || d.focus()), l.preventDefault();
        },
        onCloseAutoFocus: (l) => l.preventDefault(),
        onFocusOutside: Y(e.onFocusOutside, (l) => {
          l.target !== s.trigger && i.onOpenChange(!1);
        }),
        onEscapeKeyDown: Y(e.onEscapeKeyDown, (l) => {
          a.onClose(), l.preventDefault();
        }),
        onKeyDown: Y(e.onKeyDown, (l) => {
          var h;
          const d = l.currentTarget.contains(l.target), f = a6[a.dir].includes(l.key);
          d && f && (i.onOpenChange(!1), (h = s.trigger) == null || h.focus(), l.preventDefault());
        })
      }
    ) }) }) });
  }
);
ix.displayName = ox;
function ax(e) {
  return e ? "open" : "closed";
}
function _a(e) {
  return e === "indeterminate";
}
function am(e) {
  return _a(e) ? "indeterminate" : e ? "checked" : "unchecked";
}
function S6(e) {
  const t = document.activeElement;
  for (const n of e)
    if (n === t || (n.focus(), document.activeElement !== t))
      return;
}
function D6(e, t) {
  return e.map((n, o) => e[(t + o) % e.length]);
}
function O6(e, t, n) {
  const r = t.length > 1 && Array.from(t).every((u) => u === t[0]) ? t[0] : t, i = n ? e.indexOf(n) : -1;
  let a = D6(e, Math.max(i, 0));
  r.length === 1 && (a = a.filter((u) => u !== n));
  const c = a.find(
    (u) => u.toLowerCase().startsWith(r.toLowerCase())
  );
  return c !== n ? c : void 0;
}
function I6(e, t) {
  const { x: n, y: o } = e;
  let r = !1;
  for (let i = 0, a = t.length - 1; i < t.length; a = i++) {
    const s = t[i], c = t[a], u = s.x, l = s.y, d = c.x, f = c.y;
    l > o != f > o && n < (d - u) * (o - l) / (f - l) + u && (r = !r);
  }
  return r;
}
function N6(e, t) {
  if (!t)
    return !1;
  const n = { x: e.clientX, y: e.clientY };
  return I6(n, t);
}
function co(e) {
  return (t) => t.pointerType === "mouse" ? e(t) : void 0;
}
var E6 = Fk, P6 = Qf, T6 = Lk, C6 = Zk, M6 = rm, z6 = Yk, R6 = _c, A6 = Hk, U6 = Vk, j6 = Jk, F6 = Xk, W6 = Qk, L6 = ex, Z6 = nx, Y6 = rx, B6 = ix, $c = "DropdownMenu", [H6, w2] = St(
  $c,
  [Ak]
), Le = Ak(), [G6, sx] = H6($c), cx = (e) => {
  const {
    __scopeDropdownMenu: t,
    children: n,
    dir: o,
    open: r,
    defaultOpen: i,
    onOpenChange: a,
    modal: s = !0
  } = e, c = Le(t), u = m.useRef(null), [l, d] = Hn({
    prop: r,
    defaultProp: i ?? !1,
    onChange: a,
    caller: $c
  });
  return /* @__PURE__ */ y(
    G6,
    {
      scope: t,
      triggerId: Kt(),
      triggerRef: u,
      contentId: Kt(),
      open: l,
      onOpenChange: d,
      onOpenToggle: m.useCallback(() => d((f) => !f), [d]),
      modal: s,
      children: /* @__PURE__ */ y(E6, { ...c, open: l, onOpenChange: d, dir: o, modal: s, children: n })
    }
  );
};
cx.displayName = $c;
var ux = "DropdownMenuTrigger", lx = m.forwardRef(
  (e, t) => {
    const { __scopeDropdownMenu: n, disabled: o = !1, ...r } = e, i = sx(ux, n), a = Le(n);
    return /* @__PURE__ */ y(P6, { asChild: !0, ...a, children: /* @__PURE__ */ y(
      de.button,
      {
        type: "button",
        id: i.triggerId,
        "aria-haspopup": "menu",
        "aria-expanded": i.open,
        "aria-controls": i.open ? i.contentId : void 0,
        "data-state": i.open ? "open" : "closed",
        "data-disabled": o ? "" : void 0,
        disabled: o,
        ...r,
        ref: cn(t, i.triggerRef),
        onPointerDown: Y(e.onPointerDown, (s) => {
          !o && s.button === 0 && s.ctrlKey === !1 && (i.onOpenToggle(), i.open || s.preventDefault());
        }),
        onKeyDown: Y(e.onKeyDown, (s) => {
          o || (["Enter", " "].includes(s.key) && i.onOpenToggle(), s.key === "ArrowDown" && i.onOpenChange(!0), ["Enter", " ", "ArrowDown"].includes(s.key) && s.preventDefault());
        })
      }
    ) });
  }
);
lx.displayName = ux;
var V6 = "DropdownMenuPortal", dx = (e) => {
  const { __scopeDropdownMenu: t, ...n } = e, o = Le(t);
  return /* @__PURE__ */ y(T6, { ...o, ...n });
};
dx.displayName = V6;
var fx = "DropdownMenuContent", mx = m.forwardRef(
  (e, t) => {
    const { __scopeDropdownMenu: n, ...o } = e, r = sx(fx, n), i = Le(n), a = m.useRef(!1);
    return /* @__PURE__ */ y(
      C6,
      {
        id: r.contentId,
        "aria-labelledby": r.triggerId,
        ...i,
        ...o,
        ref: t,
        onCloseAutoFocus: Y(e.onCloseAutoFocus, (s) => {
          var c;
          a.current || (c = r.triggerRef.current) == null || c.focus(), a.current = !1, s.preventDefault();
        }),
        onInteractOutside: Y(e.onInteractOutside, (s) => {
          const c = s.detail.originalEvent, u = c.button === 0 && c.ctrlKey === !0, l = c.button === 2 || u;
          (!r.modal || l) && (a.current = !0);
        }),
        style: {
          ...e.style,
          "--radix-dropdown-menu-content-transform-origin": "var(--radix-popper-transform-origin)",
          "--radix-dropdown-menu-content-available-width": "var(--radix-popper-available-width)",
          "--radix-dropdown-menu-content-available-height": "var(--radix-popper-available-height)",
          "--radix-dropdown-menu-trigger-width": "var(--radix-popper-anchor-width)",
          "--radix-dropdown-menu-trigger-height": "var(--radix-popper-anchor-height)"
        }
      }
    );
  }
);
mx.displayName = fx;
var q6 = "DropdownMenuGroup", hx = m.forwardRef(
  (e, t) => {
    const { __scopeDropdownMenu: n, ...o } = e, r = Le(n);
    return /* @__PURE__ */ y(M6, { ...r, ...o, ref: t });
  }
);
hx.displayName = q6;
var J6 = "DropdownMenuLabel", gx = m.forwardRef(
  (e, t) => {
    const { __scopeDropdownMenu: n, ...o } = e, r = Le(n);
    return /* @__PURE__ */ y(z6, { ...r, ...o, ref: t });
  }
);
gx.displayName = J6;
var K6 = "DropdownMenuItem", px = m.forwardRef(
  (e, t) => {
    const { __scopeDropdownMenu: n, ...o } = e, r = Le(n);
    return /* @__PURE__ */ y(R6, { ...r, ...o, ref: t });
  }
);
px.displayName = K6;
var X6 = "DropdownMenuCheckboxItem", vx = m.forwardRef((e, t) => {
  const { __scopeDropdownMenu: n, ...o } = e, r = Le(n);
  return /* @__PURE__ */ y(A6, { ...r, ...o, ref: t });
});
vx.displayName = X6;
var Q6 = "DropdownMenuRadioGroup", yx = m.forwardRef((e, t) => {
  const { __scopeDropdownMenu: n, ...o } = e, r = Le(n);
  return /* @__PURE__ */ y(U6, { ...r, ...o, ref: t });
});
yx.displayName = Q6;
var eF = "DropdownMenuRadioItem", bx = m.forwardRef((e, t) => {
  const { __scopeDropdownMenu: n, ...o } = e, r = Le(n);
  return /* @__PURE__ */ y(j6, { ...r, ...o, ref: t });
});
bx.displayName = eF;
var tF = "DropdownMenuItemIndicator", wx = m.forwardRef((e, t) => {
  const { __scopeDropdownMenu: n, ...o } = e, r = Le(n);
  return /* @__PURE__ */ y(F6, { ...r, ...o, ref: t });
});
wx.displayName = tF;
var nF = "DropdownMenuSeparator", _x = m.forwardRef((e, t) => {
  const { __scopeDropdownMenu: n, ...o } = e, r = Le(n);
  return /* @__PURE__ */ y(W6, { ...r, ...o, ref: t });
});
_x.displayName = nF;
var rF = "DropdownMenuArrow", oF = m.forwardRef(
  (e, t) => {
    const { __scopeDropdownMenu: n, ...o } = e, r = Le(n);
    return /* @__PURE__ */ y(L6, { ...r, ...o, ref: t });
  }
);
oF.displayName = rF;
var iF = (e) => {
  const { __scopeDropdownMenu: t, children: n, open: o, onOpenChange: r, defaultOpen: i } = e, a = Le(t), [s, c] = Hn({
    prop: o,
    defaultProp: i ?? !1,
    onChange: r,
    caller: "DropdownMenuSub"
  });
  return /* @__PURE__ */ y(Z6, { ...a, open: s, onOpenChange: c, children: n });
}, aF = "DropdownMenuSubTrigger", $x = m.forwardRef((e, t) => {
  const { __scopeDropdownMenu: n, ...o } = e, r = Le(n);
  return /* @__PURE__ */ y(Y6, { ...r, ...o, ref: t });
});
$x.displayName = aF;
var sF = "DropdownMenuSubContent", kx = m.forwardRef((e, t) => {
  const { __scopeDropdownMenu: n, ...o } = e, r = Le(n);
  return /* @__PURE__ */ y(
    B6,
    {
      ...r,
      ...o,
      ref: t,
      style: {
        ...e.style,
        "--radix-dropdown-menu-content-transform-origin": "var(--radix-popper-transform-origin)",
        "--radix-dropdown-menu-content-available-width": "var(--radix-popper-available-width)",
        "--radix-dropdown-menu-content-available-height": "var(--radix-popper-available-height)",
        "--radix-dropdown-menu-trigger-width": "var(--radix-popper-anchor-width)",
        "--radix-dropdown-menu-trigger-height": "var(--radix-popper-anchor-height)"
      }
    }
  );
});
kx.displayName = sF;
var cF = cx, uF = lx, xx = dx, Sx = mx, lF = hx, Dx = gx, Ox = px, Ix = vx, dF = yx, Nx = bx, Ex = wx, Px = _x, fF = iF, Tx = $x, Cx = kx;
const _2 = cF, $2 = uF, k2 = lF, x2 = xx, S2 = fF, D2 = dF, mF = m.forwardRef(({ className: e, inset: t, children: n, ...o }, r) => /* @__PURE__ */ Ge(
  Tx,
  {
    ref: r,
    className: z(
      "flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      t && "pl-8",
      e
    ),
    ...o,
    children: [
      n,
      /* @__PURE__ */ y(rS, { className: "ml-auto" })
    ]
  }
));
mF.displayName = Tx.displayName;
const hF = m.forwardRef(({ className: e, ...t }, n) => /* @__PURE__ */ y(
  Cx,
  {
    ref: n,
    className: z(
      "z-50 min-w-[8rem] origin-[--radix-dropdown-menu-content-transform-origin] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      e
    ),
    ...t
  }
));
hF.displayName = Cx.displayName;
const gF = m.forwardRef(({ className: e, sideOffset: t = 4, ...n }, o) => /* @__PURE__ */ y(xx, { children: /* @__PURE__ */ y(
  Sx,
  {
    ref: o,
    sideOffset: t,
    className: z(
      "z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
      "origin-[--radix-dropdown-menu-content-transform-origin] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      e
    ),
    ...n
  }
) }));
gF.displayName = Sx.displayName;
const pF = m.forwardRef(({ className: e, inset: t, ...n }, o) => /* @__PURE__ */ y(
  Ox,
  {
    ref: o,
    className: z(
      "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0",
      t && "pl-8",
      e
    ),
    ...n
  }
));
pF.displayName = Ox.displayName;
const vF = m.forwardRef(({ className: e, children: t, checked: n, ...o }, r) => /* @__PURE__ */ Ge(
  Ix,
  {
    ref: r,
    className: z(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      e
    ),
    checked: n,
    ...o,
    children: [
      /* @__PURE__ */ y("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ y(Ex, { children: /* @__PURE__ */ y(Wh, { className: "h-4 w-4" }) }) }),
      t
    ]
  }
));
vF.displayName = Ix.displayName;
const yF = m.forwardRef(({ className: e, children: t, ...n }, o) => /* @__PURE__ */ Ge(
  Nx,
  {
    ref: o,
    className: z(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      e
    ),
    ...n,
    children: [
      /* @__PURE__ */ y("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ y(Ex, { children: /* @__PURE__ */ y(Lh, { className: "h-2 w-2 fill-current" }) }) }),
      t
    ]
  }
));
yF.displayName = Nx.displayName;
const bF = m.forwardRef(({ className: e, inset: t, ...n }, o) => /* @__PURE__ */ y(
  Dx,
  {
    ref: o,
    className: z("px-2 py-1.5 text-sm font-semibold", t && "pl-8", e),
    ...n
  }
));
bF.displayName = Dx.displayName;
const wF = m.forwardRef(({ className: e, ...t }, n) => /* @__PURE__ */ y(
  Px,
  {
    ref: n,
    className: z("-mx-1 my-1 h-px bg-muted", e),
    ...t
  }
));
wF.displayName = Px.displayName;
const _F = ({ className: e, ...t }) => /* @__PURE__ */ y("span", { className: z("ml-auto text-xs tracking-widest opacity-60", e), ...t });
_F.displayName = "DropdownMenuShortcut";
function O2({ className: e, ...t }) {
  return /* @__PURE__ */ y("div", { className: z("animate-pulse rounded-md bg-muted", e), ...t });
}
let $F = gg.create();
function I2(e) {
  $F = e;
}
function N2(...e) {
  return Ng(Iu(e));
}
export {
  wR as Alert,
  $R as AlertDescription,
  _R as AlertTitle,
  RF as AxiosError,
  TF as BasePlugin,
  a_ as Button,
  u2 as Calendar,
  r4 as CalendarDayButton,
  kR as Card,
  OR as CardContent,
  DR as CardDescription,
  IR as CardFooter,
  xR as CardHeader,
  SR as CardTitle,
  HU as Checkbox,
  T2 as Controller,
  a2 as Dialog,
  c2 as DialogClose,
  hR as DialogContent,
  yR as DialogDescription,
  pR as DialogFooter,
  gR as DialogHeader,
  Y_ as DialogOverlay,
  mR as DialogPortal,
  vR as DialogTitle,
  s2 as DialogTrigger,
  _2 as DropdownMenu,
  vF as DropdownMenuCheckboxItem,
  gF as DropdownMenuContent,
  k2 as DropdownMenuGroup,
  pF as DropdownMenuItem,
  bF as DropdownMenuLabel,
  x2 as DropdownMenuPortal,
  D2 as DropdownMenuRadioGroup,
  yF as DropdownMenuRadioItem,
  wF as DropdownMenuSeparator,
  _F as DropdownMenuShortcut,
  S2 as DropdownMenuSub,
  hF as DropdownMenuSubContent,
  mF as DropdownMenuSubTrigger,
  $2 as DropdownMenuTrigger,
  n2 as Form,
  EM as FormControl,
  PM as FormDescription,
  r2 as FormField,
  IM as FormItem,
  NM as FormLabel,
  TM as FormMessage,
  OF as Icons,
  kM as Input,
  u_ as Label,
  d2 as Popover,
  m2 as PopoverAnchor,
  WU as PopoverContent,
  f2 as PopoverTrigger,
  xF as Query,
  bj as RadioGroup,
  wj as RadioGroupItem,
  SF as Router,
  zj as ScrollArea,
  Mk as ScrollBar,
  v2 as Sheet,
  b2 as SheetClose,
  Uj as SheetContent,
  Lj as SheetDescription,
  Fj as SheetFooter,
  jj as SheetHeader,
  zk as SheetOverlay,
  Rj as SheetPortal,
  Wj as SheetTitle,
  y2 as SheetTrigger,
  O2 as Skeleton,
  Zj as Table,
  Bj as TableBody,
  Jj as TableCaption,
  qj as TableCell,
  Hj as TableFooter,
  Vj as TableHead,
  Yj as TableHeader,
  Gj as TableRow,
  CM as Textarea,
  U2 as Trans,
  mu as buttonVariants,
  N2 as cn,
  XF as dateFns,
  QF as formatApiDate,
  $M as formatLocalizedDate,
  e2 as formatLocalizedDateTime,
  $F as http,
  t2 as parseLocalizedDate,
  I2 as setSdkApi,
  C2 as useFieldArray,
  M2 as useForm,
  Js as useFormField,
  j2 as useTranslation,
  KF as z,
  R2 as zodResolver
};
