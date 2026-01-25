import * as Cb from "@tanstack/react-query";
import * as Fb from "react-router-dom";
import * as Lb from "lucide-react";
import { Controller as m$, useFieldArray as f$, useForm as p$ } from "react-hook-form";
import { zodResolver as v$ } from "@hookform/resolvers/zod";
import { Trans as b$, useTranslation as $$ } from "react-i18next";
class Jb {
  name = "";
  register(n) {
  }
  registerTranslations(n, r) {
    Object.keys(n).forEach((o) => {
      r.addResourceBundle(o, this.name, n[o], !0, !0);
    });
  }
}
function Qc(e, n) {
  return function() {
    return e.apply(n, arguments);
  };
}
const { toString: nf } = Object.prototype, { getPrototypeOf: Ei } = Object, { iterator: tr, toStringTag: es } = Symbol, nr = /* @__PURE__ */ ((e) => (n) => {
  const r = nf.call(n);
  return e[r] || (e[r] = r.slice(8, -1).toLowerCase());
})(/* @__PURE__ */ Object.create(null)), pe = (e) => (e = e.toLowerCase(), (n) => nr(n) === e), rr = (e) => (n) => typeof n === e, { isArray: at } = Array, qe = rr("undefined");
function Et(e) {
  return e !== null && !qe(e) && e.constructor !== null && !qe(e.constructor) && ne(e.constructor.isBuffer) && e.constructor.isBuffer(e);
}
const ts = pe("ArrayBuffer");
function rf(e) {
  let n;
  return typeof ArrayBuffer < "u" && ArrayBuffer.isView ? n = ArrayBuffer.isView(e) : n = e && e.buffer && ts(e.buffer), n;
}
const of = rr("string"), ne = rr("function"), ns = rr("number"), Nt = (e) => e !== null && typeof e == "object", af = (e) => e === !0 || e === !1, Bn = (e) => {
  if (nr(e) !== "object")
    return !1;
  const n = Ei(e);
  return (n === null || n === Object.prototype || Object.getPrototypeOf(n) === null) && !(es in e) && !(tr in e);
}, cf = (e) => {
  if (!Nt(e) || Et(e))
    return !1;
  try {
    return Object.keys(e).length === 0 && Object.getPrototypeOf(e) === Object.prototype;
  } catch {
    return !1;
  }
}, sf = pe("Date"), uf = pe("File"), lf = pe("Blob"), df = pe("FileList"), mf = (e) => Nt(e) && ne(e.pipe), ff = (e) => {
  let n;
  return e && (typeof FormData == "function" && e instanceof FormData || ne(e.append) && ((n = nr(e)) === "formdata" || // detect form-data instance
  n === "object" && ne(e.toString) && e.toString() === "[object FormData]"));
}, pf = pe("URLSearchParams"), [gf, vf, hf, bf] = ["ReadableStream", "Request", "Response", "Headers"].map(pe), $f = (e) => e.trim ? e.trim() : e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
function Pt(e, n, { allOwnKeys: r = !1 } = {}) {
  if (e === null || typeof e > "u")
    return;
  let o, t;
  if (typeof e != "object" && (e = [e]), at(e))
    for (o = 0, t = e.length; o < t; o++)
      n.call(null, e[o], o, e);
  else {
    if (Et(e))
      return;
    const i = r ? Object.getOwnPropertyNames(e) : Object.keys(e), a = i.length;
    let c;
    for (o = 0; o < a; o++)
      c = i[o], n.call(null, e[c], c, e);
  }
}
function rs(e, n) {
  if (Et(e))
    return null;
  n = n.toLowerCase();
  const r = Object.keys(e);
  let o = r.length, t;
  for (; o-- > 0; )
    if (t = r[o], n === t.toLowerCase())
      return t;
  return null;
}
const Pe = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : global, is = (e) => !qe(e) && e !== Pe;
function wi() {
  const { caseless: e, skipUndefined: n } = is(this) && this || {}, r = {}, o = (t, i) => {
    const a = e && rs(r, i) || i;
    Bn(r[a]) && Bn(t) ? r[a] = wi(r[a], t) : Bn(t) ? r[a] = wi({}, t) : at(t) ? r[a] = t.slice() : (!n || !qe(t)) && (r[a] = t);
  };
  for (let t = 0, i = arguments.length; t < i; t++)
    arguments[t] && Pt(arguments[t], o);
  return r;
}
const yf = (e, n, r, { allOwnKeys: o } = {}) => (Pt(n, (t, i) => {
  r && ne(t) ? e[i] = Qc(t, r) : e[i] = t;
}, { allOwnKeys: o }), e), _f = (e) => (e.charCodeAt(0) === 65279 && (e = e.slice(1)), e), kf = (e, n, r, o) => {
  e.prototype = Object.create(n.prototype, o), e.prototype.constructor = e, Object.defineProperty(e, "super", {
    value: n.prototype
  }), r && Object.assign(e.prototype, r);
}, wf = (e, n, r, o) => {
  let t, i, a;
  const c = {};
  if (n = n || {}, e == null) return n;
  do {
    for (t = Object.getOwnPropertyNames(e), i = t.length; i-- > 0; )
      a = t[i], (!o || o(a, e, n)) && !c[a] && (n[a] = e[a], c[a] = !0);
    e = r !== !1 && Ei(e);
  } while (e && (!r || r(e, n)) && e !== Object.prototype);
  return n;
}, Sf = (e, n, r) => {
  e = String(e), (r === void 0 || r > e.length) && (r = e.length), r -= n.length;
  const o = e.indexOf(n, r);
  return o !== -1 && o === r;
}, xf = (e) => {
  if (!e) return null;
  if (at(e)) return e;
  let n = e.length;
  if (!ns(n)) return null;
  const r = new Array(n);
  for (; n-- > 0; )
    r[n] = e[n];
  return r;
}, zf = /* @__PURE__ */ ((e) => (n) => e && n instanceof e)(typeof Uint8Array < "u" && Ei(Uint8Array)), If = (e, n) => {
  const o = (e && e[tr]).call(e);
  let t;
  for (; (t = o.next()) && !t.done; ) {
    const i = t.value;
    n.call(e, i[0], i[1]);
  }
}, Of = (e, n) => {
  let r;
  const o = [];
  for (; (r = e.exec(n)) !== null; )
    o.push(r);
  return o;
}, Uf = pe("HTMLFormElement"), jf = (e) => e.toLowerCase().replace(
  /[-_\s]([a-z\d])(\w*)/g,
  function(r, o, t) {
    return o.toUpperCase() + t;
  }
), fc = (({ hasOwnProperty: e }) => (n, r) => e.call(n, r))(Object.prototype), Df = pe("RegExp"), os = (e, n) => {
  const r = Object.getOwnPropertyDescriptors(e), o = {};
  Pt(r, (t, i) => {
    let a;
    (a = n(t, i, e)) !== !1 && (o[i] = a || t);
  }), Object.defineProperties(e, o);
}, Tf = (e) => {
  os(e, (n, r) => {
    if (ne(e) && ["arguments", "caller", "callee"].indexOf(r) !== -1)
      return !1;
    const o = e[r];
    if (ne(o)) {
      if (n.enumerable = !1, "writable" in n) {
        n.writable = !1;
        return;
      }
      n.set || (n.set = () => {
        throw Error("Can not rewrite read-only method '" + r + "'");
      });
    }
  });
}, Ef = (e, n) => {
  const r = {}, o = (t) => {
    t.forEach((i) => {
      r[i] = !0;
    });
  };
  return at(e) ? o(e) : o(String(e).split(n)), r;
}, Nf = () => {
}, Pf = (e, n) => e != null && Number.isFinite(e = +e) ? e : n;
function Af(e) {
  return !!(e && ne(e.append) && e[es] === "FormData" && e[tr]);
}
const Zf = (e) => {
  const n = new Array(10), r = (o, t) => {
    if (Nt(o)) {
      if (n.indexOf(o) >= 0)
        return;
      if (Et(o))
        return o;
      if (!("toJSON" in o)) {
        n[t] = o;
        const i = at(o) ? [] : {};
        return Pt(o, (a, c) => {
          const u = r(a, t + 1);
          !qe(u) && (i[c] = u);
        }), n[t] = void 0, i;
      }
    }
    return o;
  };
  return r(e, 0);
}, Rf = pe("AsyncFunction"), Cf = (e) => e && (Nt(e) || ne(e)) && ne(e.then) && ne(e.catch), as = ((e, n) => e ? setImmediate : n ? ((r, o) => (Pe.addEventListener("message", ({ source: t, data: i }) => {
  t === Pe && i === r && o.length && o.shift()();
}, !1), (t) => {
  o.push(t), Pe.postMessage(r, "*");
}))(`axios@${Math.random()}`, []) : (r) => setTimeout(r))(
  typeof setImmediate == "function",
  ne(Pe.postMessage)
), Ff = typeof queueMicrotask < "u" ? queueMicrotask.bind(Pe) : typeof process < "u" && process.nextTick || as, Lf = (e) => e != null && ne(e[tr]), f = {
  isArray: at,
  isArrayBuffer: ts,
  isBuffer: Et,
  isFormData: ff,
  isArrayBufferView: rf,
  isString: of,
  isNumber: ns,
  isBoolean: af,
  isObject: Nt,
  isPlainObject: Bn,
  isEmptyObject: cf,
  isReadableStream: gf,
  isRequest: vf,
  isResponse: hf,
  isHeaders: bf,
  isUndefined: qe,
  isDate: sf,
  isFile: uf,
  isBlob: lf,
  isRegExp: Df,
  isFunction: ne,
  isStream: mf,
  isURLSearchParams: pf,
  isTypedArray: zf,
  isFileList: df,
  forEach: Pt,
  merge: wi,
  extend: yf,
  trim: $f,
  stripBOM: _f,
  inherits: kf,
  toFlatObject: wf,
  kindOf: nr,
  kindOfTest: pe,
  endsWith: Sf,
  toArray: xf,
  forEachEntry: If,
  matchAll: Of,
  isHTMLForm: Uf,
  hasOwnProperty: fc,
  hasOwnProp: fc,
  // an alias to avoid ESLint no-prototype-builtins detection
  reduceDescriptors: os,
  freezeMethods: Tf,
  toObjectSet: Ef,
  toCamelCase: jf,
  noop: Nf,
  toFiniteNumber: Pf,
  findKey: rs,
  global: Pe,
  isContextDefined: is,
  isSpecCompliantForm: Af,
  toJSONObject: Zf,
  isAsyncFn: Rf,
  isThenable: Cf,
  setImmediate: as,
  asap: Ff,
  isIterable: Lf
};
function j(e, n, r, o, t) {
  Error.call(this), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack, this.message = e, this.name = "AxiosError", n && (this.code = n), r && (this.config = r), o && (this.request = o), t && (this.response = t, this.status = t.status ? t.status : null);
}
f.inherits(j, Error, {
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
      config: f.toJSONObject(this.config),
      code: this.code,
      status: this.status
    };
  }
});
const cs = j.prototype, ss = {};
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
  ss[e] = { value: e };
});
Object.defineProperties(j, ss);
Object.defineProperty(cs, "isAxiosError", { value: !0 });
j.from = (e, n, r, o, t, i) => {
  const a = Object.create(cs);
  f.toFlatObject(e, a, function(l) {
    return l !== Error.prototype;
  }, (s) => s !== "isAxiosError");
  const c = e && e.message ? e.message : "Error", u = n == null && e ? e.code : n;
  return j.call(a, c, u, r, o, t), e && a.cause == null && Object.defineProperty(a, "cause", { value: e, configurable: !0 }), a.name = e && e.name || "Error", i && Object.assign(a, i), a;
};
const Jf = null;
function Si(e) {
  return f.isPlainObject(e) || f.isArray(e);
}
function us(e) {
  return f.endsWith(e, "[]") ? e.slice(0, -2) : e;
}
function pc(e, n, r) {
  return e ? e.concat(n).map(function(t, i) {
    return t = us(t), !r && i ? "[" + t + "]" : t;
  }).join(r ? "." : "") : n;
}
function Mf(e) {
  return f.isArray(e) && !e.some(Si);
}
const Bf = f.toFlatObject(f, {}, null, function(n) {
  return /^is[A-Z]/.test(n);
});
function ir(e, n, r) {
  if (!f.isObject(e))
    throw new TypeError("target must be an object");
  n = n || new FormData(), r = f.toFlatObject(r, {
    metaTokens: !0,
    dots: !1,
    indexes: !1
  }, !1, function($, y) {
    return !f.isUndefined(y[$]);
  });
  const o = r.metaTokens, t = r.visitor || l, i = r.dots, a = r.indexes, u = (r.Blob || typeof Blob < "u" && Blob) && f.isSpecCompliantForm(n);
  if (!f.isFunction(t))
    throw new TypeError("visitor must be a function");
  function s(p) {
    if (p === null) return "";
    if (f.isDate(p))
      return p.toISOString();
    if (f.isBoolean(p))
      return p.toString();
    if (!u && f.isBlob(p))
      throw new j("Blob is not supported. Use a Buffer instead.");
    return f.isArrayBuffer(p) || f.isTypedArray(p) ? u && typeof Blob == "function" ? new Blob([p]) : Buffer.from(p) : p;
  }
  function l(p, $, y) {
    let A = p;
    if (p && !y && typeof p == "object") {
      if (f.endsWith($, "{}"))
        $ = o ? $ : $.slice(0, -2), p = JSON.stringify(p);
      else if (f.isArray(p) && Mf(p) || (f.isFileList(p) || f.endsWith($, "[]")) && (A = f.toArray(p)))
        return $ = us($), A.forEach(function(N, E) {
          !(f.isUndefined(N) || N === null) && n.append(
            // eslint-disable-next-line no-nested-ternary
            a === !0 ? pc([$], E, i) : a === null ? $ : $ + "[]",
            s(N)
          );
        }), !1;
    }
    return Si(p) ? !0 : (n.append(pc(y, $, i), s(p)), !1);
  }
  const d = [], g = Object.assign(Bf, {
    defaultVisitor: l,
    convertValue: s,
    isVisitable: Si
  });
  function h(p, $) {
    if (!f.isUndefined(p)) {
      if (d.indexOf(p) !== -1)
        throw Error("Circular reference detected in " + $.join("."));
      d.push(p), f.forEach(p, function(A, B) {
        (!(f.isUndefined(A) || A === null) && t.call(
          n,
          A,
          f.isString(B) ? B.trim() : B,
          $,
          g
        )) === !0 && h(A, $ ? $.concat(B) : [B]);
      }), d.pop();
    }
  }
  if (!f.isObject(e))
    throw new TypeError("data must be an object");
  return h(e), n;
}
function gc(e) {
  const n = {
    "!": "%21",
    "'": "%27",
    "(": "%28",
    ")": "%29",
    "~": "%7E",
    "%20": "+",
    "%00": "\0"
  };
  return encodeURIComponent(e).replace(/[!'()~]|%20|%00/g, function(o) {
    return n[o];
  });
}
function Ni(e, n) {
  this._pairs = [], e && ir(e, this, n);
}
const ls = Ni.prototype;
ls.append = function(n, r) {
  this._pairs.push([n, r]);
};
ls.toString = function(n) {
  const r = n ? function(o) {
    return n.call(this, o, gc);
  } : gc;
  return this._pairs.map(function(t) {
    return r(t[0]) + "=" + r(t[1]);
  }, "").join("&");
};
function Vf(e) {
  return encodeURIComponent(e).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+");
}
function ds(e, n, r) {
  if (!n)
    return e;
  const o = r && r.encode || Vf;
  f.isFunction(r) && (r = {
    serialize: r
  });
  const t = r && r.serialize;
  let i;
  if (t ? i = t(n, r) : i = f.isURLSearchParams(n) ? n.toString() : new Ni(n, r).toString(o), i) {
    const a = e.indexOf("#");
    a !== -1 && (e = e.slice(0, a)), e += (e.indexOf("?") === -1 ? "?" : "&") + i;
  }
  return e;
}
class vc {
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
  use(n, r, o) {
    return this.handlers.push({
      fulfilled: n,
      rejected: r,
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
  eject(n) {
    this.handlers[n] && (this.handlers[n] = null);
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
  forEach(n) {
    f.forEach(this.handlers, function(o) {
      o !== null && n(o);
    });
  }
}
const ms = {
  silentJSONParsing: !0,
  forcedJSONParsing: !0,
  clarifyTimeoutError: !1
}, Gf = typeof URLSearchParams < "u" ? URLSearchParams : Ni, Wf = typeof FormData < "u" ? FormData : null, qf = typeof Blob < "u" ? Blob : null, Kf = {
  isBrowser: !0,
  classes: {
    URLSearchParams: Gf,
    FormData: Wf,
    Blob: qf
  },
  protocols: ["http", "https", "file", "blob", "url", "data"]
}, Pi = typeof window < "u" && typeof document < "u", xi = typeof navigator == "object" && navigator || void 0, Xf = Pi && (!xi || ["ReactNative", "NativeScript", "NS"].indexOf(xi.product) < 0), Hf = typeof WorkerGlobalScope < "u" && // eslint-disable-next-line no-undef
self instanceof WorkerGlobalScope && typeof self.importScripts == "function", Yf = Pi && window.location.href || "http://localhost", Qf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  hasBrowserEnv: Pi,
  hasStandardBrowserEnv: Xf,
  hasStandardBrowserWebWorkerEnv: Hf,
  navigator: xi,
  origin: Yf
}, Symbol.toStringTag, { value: "Module" })), Y = {
  ...Qf,
  ...Kf
};
function ep(e, n) {
  return ir(e, new Y.classes.URLSearchParams(), {
    visitor: function(r, o, t, i) {
      return Y.isNode && f.isBuffer(r) ? (this.append(o, r.toString("base64")), !1) : i.defaultVisitor.apply(this, arguments);
    },
    ...n
  });
}
function tp(e) {
  return f.matchAll(/\w+|\[(\w*)]/g, e).map((n) => n[0] === "[]" ? "" : n[1] || n[0]);
}
function np(e) {
  const n = {}, r = Object.keys(e);
  let o;
  const t = r.length;
  let i;
  for (o = 0; o < t; o++)
    i = r[o], n[i] = e[i];
  return n;
}
function fs(e) {
  function n(r, o, t, i) {
    let a = r[i++];
    if (a === "__proto__") return !0;
    const c = Number.isFinite(+a), u = i >= r.length;
    return a = !a && f.isArray(t) ? t.length : a, u ? (f.hasOwnProp(t, a) ? t[a] = [t[a], o] : t[a] = o, !c) : ((!t[a] || !f.isObject(t[a])) && (t[a] = []), n(r, o, t[a], i) && f.isArray(t[a]) && (t[a] = np(t[a])), !c);
  }
  if (f.isFormData(e) && f.isFunction(e.entries)) {
    const r = {};
    return f.forEachEntry(e, (o, t) => {
      n(tp(o), t, r, 0);
    }), r;
  }
  return null;
}
function rp(e, n, r) {
  if (f.isString(e))
    try {
      return (n || JSON.parse)(e), f.trim(e);
    } catch (o) {
      if (o.name !== "SyntaxError")
        throw o;
    }
  return (r || JSON.stringify)(e);
}
const At = {
  transitional: ms,
  adapter: ["xhr", "http", "fetch"],
  transformRequest: [function(n, r) {
    const o = r.getContentType() || "", t = o.indexOf("application/json") > -1, i = f.isObject(n);
    if (i && f.isHTMLForm(n) && (n = new FormData(n)), f.isFormData(n))
      return t ? JSON.stringify(fs(n)) : n;
    if (f.isArrayBuffer(n) || f.isBuffer(n) || f.isStream(n) || f.isFile(n) || f.isBlob(n) || f.isReadableStream(n))
      return n;
    if (f.isArrayBufferView(n))
      return n.buffer;
    if (f.isURLSearchParams(n))
      return r.setContentType("application/x-www-form-urlencoded;charset=utf-8", !1), n.toString();
    let c;
    if (i) {
      if (o.indexOf("application/x-www-form-urlencoded") > -1)
        return ep(n, this.formSerializer).toString();
      if ((c = f.isFileList(n)) || o.indexOf("multipart/form-data") > -1) {
        const u = this.env && this.env.FormData;
        return ir(
          c ? { "files[]": n } : n,
          u && new u(),
          this.formSerializer
        );
      }
    }
    return i || t ? (r.setContentType("application/json", !1), rp(n)) : n;
  }],
  transformResponse: [function(n) {
    const r = this.transitional || At.transitional, o = r && r.forcedJSONParsing, t = this.responseType === "json";
    if (f.isResponse(n) || f.isReadableStream(n))
      return n;
    if (n && f.isString(n) && (o && !this.responseType || t)) {
      const a = !(r && r.silentJSONParsing) && t;
      try {
        return JSON.parse(n, this.parseReviver);
      } catch (c) {
        if (a)
          throw c.name === "SyntaxError" ? j.from(c, j.ERR_BAD_RESPONSE, this, null, this.response) : c;
      }
    }
    return n;
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
    FormData: Y.classes.FormData,
    Blob: Y.classes.Blob
  },
  validateStatus: function(n) {
    return n >= 200 && n < 300;
  },
  headers: {
    common: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": void 0
    }
  }
};
f.forEach(["delete", "get", "head", "post", "put", "patch"], (e) => {
  At.headers[e] = {};
});
const ip = f.toObjectSet([
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
]), op = (e) => {
  const n = {};
  let r, o, t;
  return e && e.split(`
`).forEach(function(a) {
    t = a.indexOf(":"), r = a.substring(0, t).trim().toLowerCase(), o = a.substring(t + 1).trim(), !(!r || n[r] && ip[r]) && (r === "set-cookie" ? n[r] ? n[r].push(o) : n[r] = [o] : n[r] = n[r] ? n[r] + ", " + o : o);
  }), n;
}, hc = /* @__PURE__ */ Symbol("internals");
function zt(e) {
  return e && String(e).trim().toLowerCase();
}
function Vn(e) {
  return e === !1 || e == null ? e : f.isArray(e) ? e.map(Vn) : String(e);
}
function ap(e) {
  const n = /* @__PURE__ */ Object.create(null), r = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
  let o;
  for (; o = r.exec(e); )
    n[o[1]] = o[2];
  return n;
}
const cp = (e) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(e.trim());
function bi(e, n, r, o, t) {
  if (f.isFunction(o))
    return o.call(this, n, r);
  if (t && (n = r), !!f.isString(n)) {
    if (f.isString(o))
      return n.indexOf(o) !== -1;
    if (f.isRegExp(o))
      return o.test(n);
  }
}
function sp(e) {
  return e.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, (n, r, o) => r.toUpperCase() + o);
}
function up(e, n) {
  const r = f.toCamelCase(" " + n);
  ["get", "set", "has"].forEach((o) => {
    Object.defineProperty(e, o + r, {
      value: function(t, i, a) {
        return this[o].call(this, n, t, i, a);
      },
      configurable: !0
    });
  });
}
let re = class {
  constructor(n) {
    n && this.set(n);
  }
  set(n, r, o) {
    const t = this;
    function i(c, u, s) {
      const l = zt(u);
      if (!l)
        throw new Error("header name must be a non-empty string");
      const d = f.findKey(t, l);
      (!d || t[d] === void 0 || s === !0 || s === void 0 && t[d] !== !1) && (t[d || u] = Vn(c));
    }
    const a = (c, u) => f.forEach(c, (s, l) => i(s, l, u));
    if (f.isPlainObject(n) || n instanceof this.constructor)
      a(n, r);
    else if (f.isString(n) && (n = n.trim()) && !cp(n))
      a(op(n), r);
    else if (f.isObject(n) && f.isIterable(n)) {
      let c = {}, u, s;
      for (const l of n) {
        if (!f.isArray(l))
          throw TypeError("Object iterator must return a key-value pair");
        c[s = l[0]] = (u = c[s]) ? f.isArray(u) ? [...u, l[1]] : [u, l[1]] : l[1];
      }
      a(c, r);
    } else
      n != null && i(r, n, o);
    return this;
  }
  get(n, r) {
    if (n = zt(n), n) {
      const o = f.findKey(this, n);
      if (o) {
        const t = this[o];
        if (!r)
          return t;
        if (r === !0)
          return ap(t);
        if (f.isFunction(r))
          return r.call(this, t, o);
        if (f.isRegExp(r))
          return r.exec(t);
        throw new TypeError("parser must be boolean|regexp|function");
      }
    }
  }
  has(n, r) {
    if (n = zt(n), n) {
      const o = f.findKey(this, n);
      return !!(o && this[o] !== void 0 && (!r || bi(this, this[o], o, r)));
    }
    return !1;
  }
  delete(n, r) {
    const o = this;
    let t = !1;
    function i(a) {
      if (a = zt(a), a) {
        const c = f.findKey(o, a);
        c && (!r || bi(o, o[c], c, r)) && (delete o[c], t = !0);
      }
    }
    return f.isArray(n) ? n.forEach(i) : i(n), t;
  }
  clear(n) {
    const r = Object.keys(this);
    let o = r.length, t = !1;
    for (; o--; ) {
      const i = r[o];
      (!n || bi(this, this[i], i, n, !0)) && (delete this[i], t = !0);
    }
    return t;
  }
  normalize(n) {
    const r = this, o = {};
    return f.forEach(this, (t, i) => {
      const a = f.findKey(o, i);
      if (a) {
        r[a] = Vn(t), delete r[i];
        return;
      }
      const c = n ? sp(i) : String(i).trim();
      c !== i && delete r[i], r[c] = Vn(t), o[c] = !0;
    }), this;
  }
  concat(...n) {
    return this.constructor.concat(this, ...n);
  }
  toJSON(n) {
    const r = /* @__PURE__ */ Object.create(null);
    return f.forEach(this, (o, t) => {
      o != null && o !== !1 && (r[t] = n && f.isArray(o) ? o.join(", ") : o);
    }), r;
  }
  [Symbol.iterator]() {
    return Object.entries(this.toJSON())[Symbol.iterator]();
  }
  toString() {
    return Object.entries(this.toJSON()).map(([n, r]) => n + ": " + r).join(`
`);
  }
  getSetCookie() {
    return this.get("set-cookie") || [];
  }
  get [Symbol.toStringTag]() {
    return "AxiosHeaders";
  }
  static from(n) {
    return n instanceof this ? n : new this(n);
  }
  static concat(n, ...r) {
    const o = new this(n);
    return r.forEach((t) => o.set(t)), o;
  }
  static accessor(n) {
    const o = (this[hc] = this[hc] = {
      accessors: {}
    }).accessors, t = this.prototype;
    function i(a) {
      const c = zt(a);
      o[c] || (up(t, a), o[c] = !0);
    }
    return f.isArray(n) ? n.forEach(i) : i(n), this;
  }
};
re.accessor(["Content-Type", "Content-Length", "Accept", "Accept-Encoding", "User-Agent", "Authorization"]);
f.reduceDescriptors(re.prototype, ({ value: e }, n) => {
  let r = n[0].toUpperCase() + n.slice(1);
  return {
    get: () => e,
    set(o) {
      this[r] = o;
    }
  };
});
f.freezeMethods(re);
function $i(e, n) {
  const r = this || At, o = n || r, t = re.from(o.headers);
  let i = o.data;
  return f.forEach(e, function(c) {
    i = c.call(r, i, t.normalize(), n ? n.status : void 0);
  }), t.normalize(), i;
}
function ps(e) {
  return !!(e && e.__CANCEL__);
}
function ct(e, n, r) {
  j.call(this, e ?? "canceled", j.ERR_CANCELED, n, r), this.name = "CanceledError";
}
f.inherits(ct, j, {
  __CANCEL__: !0
});
function gs(e, n, r) {
  const o = r.config.validateStatus;
  !r.status || !o || o(r.status) ? e(r) : n(new j(
    "Request failed with status code " + r.status,
    [j.ERR_BAD_REQUEST, j.ERR_BAD_RESPONSE][Math.floor(r.status / 100) - 4],
    r.config,
    r.request,
    r
  ));
}
function lp(e) {
  const n = /^([-+\w]{1,25})(:?\/\/|:)/.exec(e);
  return n && n[1] || "";
}
function dp(e, n) {
  e = e || 10;
  const r = new Array(e), o = new Array(e);
  let t = 0, i = 0, a;
  return n = n !== void 0 ? n : 1e3, function(u) {
    const s = Date.now(), l = o[i];
    a || (a = s), r[t] = u, o[t] = s;
    let d = i, g = 0;
    for (; d !== t; )
      g += r[d++], d = d % e;
    if (t = (t + 1) % e, t === i && (i = (i + 1) % e), s - a < n)
      return;
    const h = l && s - l;
    return h ? Math.round(g * 1e3 / h) : void 0;
  };
}
function mp(e, n) {
  let r = 0, o = 1e3 / n, t, i;
  const a = (s, l = Date.now()) => {
    r = l, t = null, i && (clearTimeout(i), i = null), e(...s);
  };
  return [(...s) => {
    const l = Date.now(), d = l - r;
    d >= o ? a(s, l) : (t = s, i || (i = setTimeout(() => {
      i = null, a(t);
    }, o - d)));
  }, () => t && a(t)];
}
const Wn = (e, n, r = 3) => {
  let o = 0;
  const t = dp(50, 250);
  return mp((i) => {
    const a = i.loaded, c = i.lengthComputable ? i.total : void 0, u = a - o, s = t(u), l = a <= c;
    o = a;
    const d = {
      loaded: a,
      total: c,
      progress: c ? a / c : void 0,
      bytes: u,
      rate: s || void 0,
      estimated: s && c && l ? (c - a) / s : void 0,
      event: i,
      lengthComputable: c != null,
      [n ? "download" : "upload"]: !0
    };
    e(d);
  }, r);
}, bc = (e, n) => {
  const r = e != null;
  return [(o) => n[0]({
    lengthComputable: r,
    total: e,
    loaded: o
  }), n[1]];
}, $c = (e) => (...n) => f.asap(() => e(...n)), fp = Y.hasStandardBrowserEnv ? /* @__PURE__ */ ((e, n) => (r) => (r = new URL(r, Y.origin), e.protocol === r.protocol && e.host === r.host && (n || e.port === r.port)))(
  new URL(Y.origin),
  Y.navigator && /(msie|trident)/i.test(Y.navigator.userAgent)
) : () => !0, pp = Y.hasStandardBrowserEnv ? (
  // Standard browser envs support document.cookie
  {
    write(e, n, r, o, t, i, a) {
      if (typeof document > "u") return;
      const c = [`${e}=${encodeURIComponent(n)}`];
      f.isNumber(r) && c.push(`expires=${new Date(r).toUTCString()}`), f.isString(o) && c.push(`path=${o}`), f.isString(t) && c.push(`domain=${t}`), i === !0 && c.push("secure"), f.isString(a) && c.push(`SameSite=${a}`), document.cookie = c.join("; ");
    },
    read(e) {
      if (typeof document > "u") return null;
      const n = document.cookie.match(new RegExp("(?:^|; )" + e + "=([^;]*)"));
      return n ? decodeURIComponent(n[1]) : null;
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
function gp(e) {
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(e);
}
function vp(e, n) {
  return n ? e.replace(/\/?\/$/, "") + "/" + n.replace(/^\/+/, "") : e;
}
function vs(e, n, r) {
  let o = !gp(n);
  return e && (o || r == !1) ? vp(e, n) : n;
}
const yc = (e) => e instanceof re ? { ...e } : e;
function Ce(e, n) {
  n = n || {};
  const r = {};
  function o(s, l, d, g) {
    return f.isPlainObject(s) && f.isPlainObject(l) ? f.merge.call({ caseless: g }, s, l) : f.isPlainObject(l) ? f.merge({}, l) : f.isArray(l) ? l.slice() : l;
  }
  function t(s, l, d, g) {
    if (f.isUndefined(l)) {
      if (!f.isUndefined(s))
        return o(void 0, s, d, g);
    } else return o(s, l, d, g);
  }
  function i(s, l) {
    if (!f.isUndefined(l))
      return o(void 0, l);
  }
  function a(s, l) {
    if (f.isUndefined(l)) {
      if (!f.isUndefined(s))
        return o(void 0, s);
    } else return o(void 0, l);
  }
  function c(s, l, d) {
    if (d in n)
      return o(s, l);
    if (d in e)
      return o(void 0, s);
  }
  const u = {
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
    validateStatus: c,
    headers: (s, l, d) => t(yc(s), yc(l), d, !0)
  };
  return f.forEach(Object.keys({ ...e, ...n }), function(l) {
    const d = u[l] || t, g = d(e[l], n[l], l);
    f.isUndefined(g) && d !== c || (r[l] = g);
  }), r;
}
const hs = (e) => {
  const n = Ce({}, e);
  let { data: r, withXSRFToken: o, xsrfHeaderName: t, xsrfCookieName: i, headers: a, auth: c } = n;
  if (n.headers = a = re.from(a), n.url = ds(vs(n.baseURL, n.url, n.allowAbsoluteUrls), e.params, e.paramsSerializer), c && a.set(
    "Authorization",
    "Basic " + btoa((c.username || "") + ":" + (c.password ? unescape(encodeURIComponent(c.password)) : ""))
  ), f.isFormData(r)) {
    if (Y.hasStandardBrowserEnv || Y.hasStandardBrowserWebWorkerEnv)
      a.setContentType(void 0);
    else if (f.isFunction(r.getHeaders)) {
      const u = r.getHeaders(), s = ["content-type", "content-length"];
      Object.entries(u).forEach(([l, d]) => {
        s.includes(l.toLowerCase()) && a.set(l, d);
      });
    }
  }
  if (Y.hasStandardBrowserEnv && (o && f.isFunction(o) && (o = o(n)), o || o !== !1 && fp(n.url))) {
    const u = t && i && pp.read(i);
    u && a.set(t, u);
  }
  return n;
}, hp = typeof XMLHttpRequest < "u", bp = hp && function(e) {
  return new Promise(function(r, o) {
    const t = hs(e);
    let i = t.data;
    const a = re.from(t.headers).normalize();
    let { responseType: c, onUploadProgress: u, onDownloadProgress: s } = t, l, d, g, h, p;
    function $() {
      h && h(), p && p(), t.cancelToken && t.cancelToken.unsubscribe(l), t.signal && t.signal.removeEventListener("abort", l);
    }
    let y = new XMLHttpRequest();
    y.open(t.method.toUpperCase(), t.url, !0), y.timeout = t.timeout;
    function A() {
      if (!y)
        return;
      const N = re.from(
        "getAllResponseHeaders" in y && y.getAllResponseHeaders()
      ), P = {
        data: !c || c === "text" || c === "json" ? y.responseText : y.response,
        status: y.status,
        statusText: y.statusText,
        headers: N,
        config: e,
        request: y
      };
      gs(function(J) {
        r(J), $();
      }, function(J) {
        o(J), $();
      }, P), y = null;
    }
    "onloadend" in y ? y.onloadend = A : y.onreadystatechange = function() {
      !y || y.readyState !== 4 || y.status === 0 && !(y.responseURL && y.responseURL.indexOf("file:") === 0) || setTimeout(A);
    }, y.onabort = function() {
      y && (o(new j("Request aborted", j.ECONNABORTED, e, y)), y = null);
    }, y.onerror = function(E) {
      const P = E && E.message ? E.message : "Network Error", X = new j(P, j.ERR_NETWORK, e, y);
      X.event = E || null, o(X), y = null;
    }, y.ontimeout = function() {
      let E = t.timeout ? "timeout of " + t.timeout + "ms exceeded" : "timeout exceeded";
      const P = t.transitional || ms;
      t.timeoutErrorMessage && (E = t.timeoutErrorMessage), o(new j(
        E,
        P.clarifyTimeoutError ? j.ETIMEDOUT : j.ECONNABORTED,
        e,
        y
      )), y = null;
    }, i === void 0 && a.setContentType(null), "setRequestHeader" in y && f.forEach(a.toJSON(), function(E, P) {
      y.setRequestHeader(P, E);
    }), f.isUndefined(t.withCredentials) || (y.withCredentials = !!t.withCredentials), c && c !== "json" && (y.responseType = t.responseType), s && ([g, p] = Wn(s, !0), y.addEventListener("progress", g)), u && y.upload && ([d, h] = Wn(u), y.upload.addEventListener("progress", d), y.upload.addEventListener("loadend", h)), (t.cancelToken || t.signal) && (l = (N) => {
      y && (o(!N || N.type ? new ct(null, e, y) : N), y.abort(), y = null);
    }, t.cancelToken && t.cancelToken.subscribe(l), t.signal && (t.signal.aborted ? l() : t.signal.addEventListener("abort", l)));
    const B = lp(t.url);
    if (B && Y.protocols.indexOf(B) === -1) {
      o(new j("Unsupported protocol " + B + ":", j.ERR_BAD_REQUEST, e));
      return;
    }
    y.send(i || null);
  });
}, $p = (e, n) => {
  const { length: r } = e = e ? e.filter(Boolean) : [];
  if (n || r) {
    let o = new AbortController(), t;
    const i = function(s) {
      if (!t) {
        t = !0, c();
        const l = s instanceof Error ? s : this.reason;
        o.abort(l instanceof j ? l : new ct(l instanceof Error ? l.message : l));
      }
    };
    let a = n && setTimeout(() => {
      a = null, i(new j(`timeout ${n} of ms exceeded`, j.ETIMEDOUT));
    }, n);
    const c = () => {
      e && (a && clearTimeout(a), a = null, e.forEach((s) => {
        s.unsubscribe ? s.unsubscribe(i) : s.removeEventListener("abort", i);
      }), e = null);
    };
    e.forEach((s) => s.addEventListener("abort", i));
    const { signal: u } = o;
    return u.unsubscribe = () => f.asap(c), u;
  }
}, yp = function* (e, n) {
  let r = e.byteLength;
  if (r < n) {
    yield e;
    return;
  }
  let o = 0, t;
  for (; o < r; )
    t = o + n, yield e.slice(o, t), o = t;
}, _p = async function* (e, n) {
  for await (const r of kp(e))
    yield* yp(r, n);
}, kp = async function* (e) {
  if (e[Symbol.asyncIterator]) {
    yield* e;
    return;
  }
  const n = e.getReader();
  try {
    for (; ; ) {
      const { done: r, value: o } = await n.read();
      if (r)
        break;
      yield o;
    }
  } finally {
    await n.cancel();
  }
}, _c = (e, n, r, o) => {
  const t = _p(e, n);
  let i = 0, a, c = (u) => {
    a || (a = !0, o && o(u));
  };
  return new ReadableStream({
    async pull(u) {
      try {
        const { done: s, value: l } = await t.next();
        if (s) {
          c(), u.close();
          return;
        }
        let d = l.byteLength;
        if (r) {
          let g = i += d;
          r(g);
        }
        u.enqueue(new Uint8Array(l));
      } catch (s) {
        throw c(s), s;
      }
    },
    cancel(u) {
      return c(u), t.return();
    }
  }, {
    highWaterMark: 2
  });
}, kc = 64 * 1024, { isFunction: Zn } = f, wp = (({ Request: e, Response: n }) => ({
  Request: e,
  Response: n
}))(f.global), {
  ReadableStream: wc,
  TextEncoder: Sc
} = f.global, xc = (e, ...n) => {
  try {
    return !!e(...n);
  } catch {
    return !1;
  }
}, Sp = (e) => {
  e = f.merge.call({
    skipUndefined: !0
  }, wp, e);
  const { fetch: n, Request: r, Response: o } = e, t = n ? Zn(n) : typeof fetch == "function", i = Zn(r), a = Zn(o);
  if (!t)
    return !1;
  const c = t && Zn(wc), u = t && (typeof Sc == "function" ? /* @__PURE__ */ ((p) => ($) => p.encode($))(new Sc()) : async (p) => new Uint8Array(await new r(p).arrayBuffer())), s = i && c && xc(() => {
    let p = !1;
    const $ = new r(Y.origin, {
      body: new wc(),
      method: "POST",
      get duplex() {
        return p = !0, "half";
      }
    }).headers.has("Content-Type");
    return p && !$;
  }), l = a && c && xc(() => f.isReadableStream(new o("").body)), d = {
    stream: l && ((p) => p.body)
  };
  t && ["text", "arrayBuffer", "blob", "formData", "stream"].forEach((p) => {
    !d[p] && (d[p] = ($, y) => {
      let A = $ && $[p];
      if (A)
        return A.call($);
      throw new j(`Response type '${p}' is not supported`, j.ERR_NOT_SUPPORT, y);
    });
  });
  const g = async (p) => {
    if (p == null)
      return 0;
    if (f.isBlob(p))
      return p.size;
    if (f.isSpecCompliantForm(p))
      return (await new r(Y.origin, {
        method: "POST",
        body: p
      }).arrayBuffer()).byteLength;
    if (f.isArrayBufferView(p) || f.isArrayBuffer(p))
      return p.byteLength;
    if (f.isURLSearchParams(p) && (p = p + ""), f.isString(p))
      return (await u(p)).byteLength;
  }, h = async (p, $) => {
    const y = f.toFiniteNumber(p.getContentLength());
    return y ?? g($);
  };
  return async (p) => {
    let {
      url: $,
      method: y,
      data: A,
      signal: B,
      cancelToken: N,
      timeout: E,
      onDownloadProgress: P,
      onUploadProgress: X,
      responseType: J,
      headers: I,
      withCredentials: te = "same-origin",
      fetchOptions: wt
    } = hs(p), St = n || fetch;
    J = J ? (J + "").toLowerCase() : "text";
    let ye = $p([B, N && N.toAbortSignal()], E), Ie = null;
    const le = ye && ye.unsubscribe && (() => {
      ye.unsubscribe();
    });
    let _e;
    try {
      if (X && s && y !== "get" && y !== "head" && (_e = await h(I, A)) !== 0) {
        let de = new r($, {
          method: "POST",
          body: A,
          duplex: "half"
        }), ve;
        if (f.isFormData(A) && (ve = de.headers.get("content-type")) && I.setContentType(ve), de.body) {
          const [V, W] = bc(
            _e,
            Wn($c(X))
          );
          A = _c(de.body, kc, V, W);
        }
      }
      f.isString(te) || (te = te ? "include" : "omit");
      const M = i && "credentials" in r.prototype, ge = {
        ...wt,
        signal: ye,
        method: y.toUpperCase(),
        headers: I.normalize().toJSON(),
        body: A,
        duplex: "half",
        credentials: M ? te : void 0
      };
      Ie = i && new r($, ge);
      let S = await (i ? St(Ie, wt) : St($, ge));
      const xt = l && (J === "stream" || J === "response");
      if (l && (P || xt && le)) {
        const de = {};
        ["status", "statusText", "headers"].forEach((Ee) => {
          de[Ee] = S[Ee];
        });
        const ve = f.toFiniteNumber(S.headers.get("content-length")), [V, W] = P && bc(
          ve,
          Wn($c(P), !0)
        ) || [];
        S = new o(
          _c(S.body, kc, V, () => {
            W && W(), le && le();
          }),
          de
        );
      }
      J = J || "text";
      let En = await d[f.findKey(d, J) || "text"](S, p);
      return !xt && le && le(), await new Promise((de, ve) => {
        gs(de, ve, {
          data: En,
          headers: re.from(S.headers),
          status: S.status,
          statusText: S.statusText,
          config: p,
          request: Ie
        });
      });
    } catch (M) {
      throw le && le(), M && M.name === "TypeError" && /Load failed|fetch/i.test(M.message) ? Object.assign(
        new j("Network Error", j.ERR_NETWORK, p, Ie),
        {
          cause: M.cause || M
        }
      ) : j.from(M, M && M.code, p, Ie);
    }
  };
}, xp = /* @__PURE__ */ new Map(), bs = (e) => {
  let n = e && e.env || {};
  const { fetch: r, Request: o, Response: t } = n, i = [
    o,
    t,
    r
  ];
  let a = i.length, c = a, u, s, l = xp;
  for (; c--; )
    u = i[c], s = l.get(u), s === void 0 && l.set(u, s = c ? /* @__PURE__ */ new Map() : Sp(n)), l = s;
  return s;
};
bs();
const Ai = {
  http: Jf,
  xhr: bp,
  fetch: {
    get: bs
  }
};
f.forEach(Ai, (e, n) => {
  if (e) {
    try {
      Object.defineProperty(e, "name", { value: n });
    } catch {
    }
    Object.defineProperty(e, "adapterName", { value: n });
  }
});
const zc = (e) => `- ${e}`, zp = (e) => f.isFunction(e) || e === null || e === !1;
function Ip(e, n) {
  e = f.isArray(e) ? e : [e];
  const { length: r } = e;
  let o, t;
  const i = {};
  for (let a = 0; a < r; a++) {
    o = e[a];
    let c;
    if (t = o, !zp(o) && (t = Ai[(c = String(o)).toLowerCase()], t === void 0))
      throw new j(`Unknown adapter '${c}'`);
    if (t && (f.isFunction(t) || (t = t.get(n))))
      break;
    i[c || "#" + a] = t;
  }
  if (!t) {
    const a = Object.entries(i).map(
      ([u, s]) => `adapter ${u} ` + (s === !1 ? "is not supported by the environment" : "is not available in the build")
    );
    let c = r ? a.length > 1 ? `since :
` + a.map(zc).join(`
`) : " " + zc(a[0]) : "as no adapter specified";
    throw new j(
      "There is no suitable adapter to dispatch the request " + c,
      "ERR_NOT_SUPPORT"
    );
  }
  return t;
}
const $s = {
  /**
   * Resolve an adapter from a list of adapter names or functions.
   * @type {Function}
   */
  getAdapter: Ip,
  /**
   * Exposes all known adapters
   * @type {Object<string, Function|Object>}
   */
  adapters: Ai
};
function yi(e) {
  if (e.cancelToken && e.cancelToken.throwIfRequested(), e.signal && e.signal.aborted)
    throw new ct(null, e);
}
function Ic(e) {
  return yi(e), e.headers = re.from(e.headers), e.data = $i.call(
    e,
    e.transformRequest
  ), ["post", "put", "patch"].indexOf(e.method) !== -1 && e.headers.setContentType("application/x-www-form-urlencoded", !1), $s.getAdapter(e.adapter || At.adapter, e)(e).then(function(o) {
    return yi(e), o.data = $i.call(
      e,
      e.transformResponse,
      o
    ), o.headers = re.from(o.headers), o;
  }, function(o) {
    return ps(o) || (yi(e), o && o.response && (o.response.data = $i.call(
      e,
      e.transformResponse,
      o.response
    ), o.response.headers = re.from(o.response.headers))), Promise.reject(o);
  });
}
const ys = "1.13.2", or = {};
["object", "boolean", "number", "function", "string", "symbol"].forEach((e, n) => {
  or[e] = function(o) {
    return typeof o === e || "a" + (n < 1 ? "n " : " ") + e;
  };
});
const Oc = {};
or.transitional = function(n, r, o) {
  function t(i, a) {
    return "[Axios v" + ys + "] Transitional option '" + i + "'" + a + (o ? ". " + o : "");
  }
  return (i, a, c) => {
    if (n === !1)
      throw new j(
        t(a, " has been removed" + (r ? " in " + r : "")),
        j.ERR_DEPRECATED
      );
    return r && !Oc[a] && (Oc[a] = !0, console.warn(
      t(
        a,
        " has been deprecated since v" + r + " and will be removed in the near future"
      )
    )), n ? n(i, a, c) : !0;
  };
};
or.spelling = function(n) {
  return (r, o) => (console.warn(`${o} is likely a misspelling of ${n}`), !0);
};
function Op(e, n, r) {
  if (typeof e != "object")
    throw new j("options must be an object", j.ERR_BAD_OPTION_VALUE);
  const o = Object.keys(e);
  let t = o.length;
  for (; t-- > 0; ) {
    const i = o[t], a = n[i];
    if (a) {
      const c = e[i], u = c === void 0 || a(c, i, e);
      if (u !== !0)
        throw new j("option " + i + " must be " + u, j.ERR_BAD_OPTION_VALUE);
      continue;
    }
    if (r !== !0)
      throw new j("Unknown option " + i, j.ERR_BAD_OPTION);
  }
}
const Gn = {
  assertOptions: Op,
  validators: or
}, he = Gn.validators;
let Ze = class {
  constructor(n) {
    this.defaults = n || {}, this.interceptors = {
      request: new vc(),
      response: new vc()
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
  async request(n, r) {
    try {
      return await this._request(n, r);
    } catch (o) {
      if (o instanceof Error) {
        let t = {};
        Error.captureStackTrace ? Error.captureStackTrace(t) : t = new Error();
        const i = t.stack ? t.stack.replace(/^.+\n/, "") : "";
        try {
          o.stack ? i && !String(o.stack).endsWith(i.replace(/^.+\n.+\n/, "")) && (o.stack += `
` + i) : o.stack = i;
        } catch {
        }
      }
      throw o;
    }
  }
  _request(n, r) {
    typeof n == "string" ? (r = r || {}, r.url = n) : r = n || {}, r = Ce(this.defaults, r);
    const { transitional: o, paramsSerializer: t, headers: i } = r;
    o !== void 0 && Gn.assertOptions(o, {
      silentJSONParsing: he.transitional(he.boolean),
      forcedJSONParsing: he.transitional(he.boolean),
      clarifyTimeoutError: he.transitional(he.boolean)
    }, !1), t != null && (f.isFunction(t) ? r.paramsSerializer = {
      serialize: t
    } : Gn.assertOptions(t, {
      encode: he.function,
      serialize: he.function
    }, !0)), r.allowAbsoluteUrls !== void 0 || (this.defaults.allowAbsoluteUrls !== void 0 ? r.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls : r.allowAbsoluteUrls = !0), Gn.assertOptions(r, {
      baseUrl: he.spelling("baseURL"),
      withXsrfToken: he.spelling("withXSRFToken")
    }, !0), r.method = (r.method || this.defaults.method || "get").toLowerCase();
    let a = i && f.merge(
      i.common,
      i[r.method]
    );
    i && f.forEach(
      ["delete", "get", "head", "post", "put", "patch", "common"],
      (p) => {
        delete i[p];
      }
    ), r.headers = re.concat(a, i);
    const c = [];
    let u = !0;
    this.interceptors.request.forEach(function($) {
      typeof $.runWhen == "function" && $.runWhen(r) === !1 || (u = u && $.synchronous, c.unshift($.fulfilled, $.rejected));
    });
    const s = [];
    this.interceptors.response.forEach(function($) {
      s.push($.fulfilled, $.rejected);
    });
    let l, d = 0, g;
    if (!u) {
      const p = [Ic.bind(this), void 0];
      for (p.unshift(...c), p.push(...s), g = p.length, l = Promise.resolve(r); d < g; )
        l = l.then(p[d++], p[d++]);
      return l;
    }
    g = c.length;
    let h = r;
    for (; d < g; ) {
      const p = c[d++], $ = c[d++];
      try {
        h = p(h);
      } catch (y) {
        $.call(this, y);
        break;
      }
    }
    try {
      l = Ic.call(this, h);
    } catch (p) {
      return Promise.reject(p);
    }
    for (d = 0, g = s.length; d < g; )
      l = l.then(s[d++], s[d++]);
    return l;
  }
  getUri(n) {
    n = Ce(this.defaults, n);
    const r = vs(n.baseURL, n.url, n.allowAbsoluteUrls);
    return ds(r, n.params, n.paramsSerializer);
  }
};
f.forEach(["delete", "get", "head", "options"], function(n) {
  Ze.prototype[n] = function(r, o) {
    return this.request(Ce(o || {}, {
      method: n,
      url: r,
      data: (o || {}).data
    }));
  };
});
f.forEach(["post", "put", "patch"], function(n) {
  function r(o) {
    return function(i, a, c) {
      return this.request(Ce(c || {}, {
        method: n,
        headers: o ? {
          "Content-Type": "multipart/form-data"
        } : {},
        url: i,
        data: a
      }));
    };
  }
  Ze.prototype[n] = r(), Ze.prototype[n + "Form"] = r(!0);
});
let Up = class _s {
  constructor(n) {
    if (typeof n != "function")
      throw new TypeError("executor must be a function.");
    let r;
    this.promise = new Promise(function(i) {
      r = i;
    });
    const o = this;
    this.promise.then((t) => {
      if (!o._listeners) return;
      let i = o._listeners.length;
      for (; i-- > 0; )
        o._listeners[i](t);
      o._listeners = null;
    }), this.promise.then = (t) => {
      let i;
      const a = new Promise((c) => {
        o.subscribe(c), i = c;
      }).then(t);
      return a.cancel = function() {
        o.unsubscribe(i);
      }, a;
    }, n(function(i, a, c) {
      o.reason || (o.reason = new ct(i, a, c), r(o.reason));
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
  subscribe(n) {
    if (this.reason) {
      n(this.reason);
      return;
    }
    this._listeners ? this._listeners.push(n) : this._listeners = [n];
  }
  /**
   * Unsubscribe from the cancel signal
   */
  unsubscribe(n) {
    if (!this._listeners)
      return;
    const r = this._listeners.indexOf(n);
    r !== -1 && this._listeners.splice(r, 1);
  }
  toAbortSignal() {
    const n = new AbortController(), r = (o) => {
      n.abort(o);
    };
    return this.subscribe(r), n.signal.unsubscribe = () => this.unsubscribe(r), n.signal;
  }
  /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */
  static source() {
    let n;
    return {
      token: new _s(function(t) {
        n = t;
      }),
      cancel: n
    };
  }
};
function jp(e) {
  return function(r) {
    return e.apply(null, r);
  };
}
function Dp(e) {
  return f.isObject(e) && e.isAxiosError === !0;
}
const zi = {
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
Object.entries(zi).forEach(([e, n]) => {
  zi[n] = e;
});
function ks(e) {
  const n = new Ze(e), r = Qc(Ze.prototype.request, n);
  return f.extend(r, Ze.prototype, n, { allOwnKeys: !0 }), f.extend(r, n, null, { allOwnKeys: !0 }), r.create = function(t) {
    return ks(Ce(e, t));
  }, r;
}
const L = ks(At);
L.Axios = Ze;
L.CanceledError = ct;
L.CancelToken = Up;
L.isCancel = ps;
L.VERSION = ys;
L.toFormData = ir;
L.AxiosError = j;
L.Cancel = L.CanceledError;
L.all = function(n) {
  return Promise.all(n);
};
L.spread = jp;
L.isAxiosError = Dp;
L.mergeConfig = Ce;
L.AxiosHeaders = re;
L.formToJSON = (e) => fs(f.isHTMLForm(e) ? new FormData(e) : e);
L.getAdapter = $s.getAdapter;
L.HttpStatusCode = zi;
L.default = L;
const {
  Axios: Vb,
  AxiosError: Gb,
  CanceledError: Wb,
  isCancel: qb,
  CancelToken: Kb,
  VERSION: Xb,
  all: Hb,
  Cancel: Yb,
  isAxiosError: Qb,
  spread: e$,
  toFormData: t$,
  AxiosHeaders: n$,
  HttpStatusCode: r$,
  formToJSON: i$,
  getAdapter: o$,
  mergeConfig: a$
} = L;
function ws(e) {
  var n, r, o = "";
  if (typeof e == "string" || typeof e == "number") o += e;
  else if (typeof e == "object") if (Array.isArray(e)) {
    var t = e.length;
    for (n = 0; n < t; n++) e[n] && (r = ws(e[n])) && (o && (o += " "), o += r);
  } else for (r in e) e[r] && (o && (o += " "), o += r);
  return o;
}
function Tp() {
  for (var e, n, r = 0, o = "", t = arguments.length; r < t; r++) (e = arguments[r]) && (n = ws(e)) && (o && (o += " "), o += n);
  return o;
}
const Ep = (e, n) => {
  const r = new Array(e.length + n.length);
  for (let o = 0; o < e.length; o++)
    r[o] = e[o];
  for (let o = 0; o < n.length; o++)
    r[e.length + o] = n[o];
  return r;
}, Np = (e, n) => ({
  classGroupId: e,
  validator: n
}), Ss = (e = /* @__PURE__ */ new Map(), n = null, r) => ({
  nextPart: e,
  validators: n,
  classGroupId: r
}), qn = "-", Uc = [], Pp = "arbitrary..", Ap = (e) => {
  const n = Rp(e), {
    conflictingClassGroups: r,
    conflictingClassGroupModifiers: o
  } = e;
  return {
    getClassGroupId: (a) => {
      if (a.startsWith("[") && a.endsWith("]"))
        return Zp(a);
      const c = a.split(qn), u = c[0] === "" && c.length > 1 ? 1 : 0;
      return xs(c, u, n);
    },
    getConflictingClassGroupIds: (a, c) => {
      if (c) {
        const u = o[a], s = r[a];
        return u ? s ? Ep(s, u) : u : s || Uc;
      }
      return r[a] || Uc;
    }
  };
}, xs = (e, n, r) => {
  if (e.length - n === 0)
    return r.classGroupId;
  const t = e[n], i = r.nextPart.get(t);
  if (i) {
    const s = xs(e, n + 1, i);
    if (s) return s;
  }
  const a = r.validators;
  if (a === null)
    return;
  const c = n === 0 ? e.join(qn) : e.slice(n).join(qn), u = a.length;
  for (let s = 0; s < u; s++) {
    const l = a[s];
    if (l.validator(c))
      return l.classGroupId;
  }
}, Zp = (e) => e.slice(1, -1).indexOf(":") === -1 ? void 0 : (() => {
  const n = e.slice(1, -1), r = n.indexOf(":"), o = n.slice(0, r);
  return o ? Pp + o : void 0;
})(), Rp = (e) => {
  const {
    theme: n,
    classGroups: r
  } = e;
  return Cp(r, n);
}, Cp = (e, n) => {
  const r = Ss();
  for (const o in e) {
    const t = e[o];
    Zi(t, r, o, n);
  }
  return r;
}, Zi = (e, n, r, o) => {
  const t = e.length;
  for (let i = 0; i < t; i++) {
    const a = e[i];
    Fp(a, n, r, o);
  }
}, Fp = (e, n, r, o) => {
  if (typeof e == "string") {
    Lp(e, n, r);
    return;
  }
  if (typeof e == "function") {
    Jp(e, n, r, o);
    return;
  }
  Mp(e, n, r, o);
}, Lp = (e, n, r) => {
  const o = e === "" ? n : zs(n, e);
  o.classGroupId = r;
}, Jp = (e, n, r, o) => {
  if (Bp(e)) {
    Zi(e(o), n, r, o);
    return;
  }
  n.validators === null && (n.validators = []), n.validators.push(Np(r, e));
}, Mp = (e, n, r, o) => {
  const t = Object.entries(e), i = t.length;
  for (let a = 0; a < i; a++) {
    const [c, u] = t[a];
    Zi(u, zs(n, c), r, o);
  }
}, zs = (e, n) => {
  let r = e;
  const o = n.split(qn), t = o.length;
  for (let i = 0; i < t; i++) {
    const a = o[i];
    let c = r.nextPart.get(a);
    c || (c = Ss(), r.nextPart.set(a, c)), r = c;
  }
  return r;
}, Bp = (e) => "isThemeGetter" in e && e.isThemeGetter === !0, Vp = (e) => {
  if (e < 1)
    return {
      get: () => {
      },
      set: () => {
      }
    };
  let n = 0, r = /* @__PURE__ */ Object.create(null), o = /* @__PURE__ */ Object.create(null);
  const t = (i, a) => {
    r[i] = a, n++, n > e && (n = 0, o = r, r = /* @__PURE__ */ Object.create(null));
  };
  return {
    get(i) {
      let a = r[i];
      if (a !== void 0)
        return a;
      if ((a = o[i]) !== void 0)
        return t(i, a), a;
    },
    set(i, a) {
      i in r ? r[i] = a : t(i, a);
    }
  };
}, Ii = "!", jc = ":", Gp = [], Dc = (e, n, r, o, t) => ({
  modifiers: e,
  hasImportantModifier: n,
  baseClassName: r,
  maybePostfixModifierPosition: o,
  isExternal: t
}), Wp = (e) => {
  const {
    prefix: n,
    experimentalParseClassName: r
  } = e;
  let o = (t) => {
    const i = [];
    let a = 0, c = 0, u = 0, s;
    const l = t.length;
    for (let $ = 0; $ < l; $++) {
      const y = t[$];
      if (a === 0 && c === 0) {
        if (y === jc) {
          i.push(t.slice(u, $)), u = $ + 1;
          continue;
        }
        if (y === "/") {
          s = $;
          continue;
        }
      }
      y === "[" ? a++ : y === "]" ? a-- : y === "(" ? c++ : y === ")" && c--;
    }
    const d = i.length === 0 ? t : t.slice(u);
    let g = d, h = !1;
    d.endsWith(Ii) ? (g = d.slice(0, -1), h = !0) : (
      /**
       * In Tailwind CSS v3 the important modifier was at the start of the base class name. This is still supported for legacy reasons.
       * @see https://github.com/dcastil/tailwind-merge/issues/513#issuecomment-2614029864
       */
      d.startsWith(Ii) && (g = d.slice(1), h = !0)
    );
    const p = s && s > u ? s - u : void 0;
    return Dc(i, h, g, p);
  };
  if (n) {
    const t = n + jc, i = o;
    o = (a) => a.startsWith(t) ? i(a.slice(t.length)) : Dc(Gp, !1, a, void 0, !0);
  }
  if (r) {
    const t = o;
    o = (i) => r({
      className: i,
      parseClassName: t
    });
  }
  return o;
}, qp = (e) => {
  const n = /* @__PURE__ */ new Map();
  return e.orderSensitiveModifiers.forEach((r, o) => {
    n.set(r, 1e6 + o);
  }), (r) => {
    const o = [];
    let t = [];
    for (let i = 0; i < r.length; i++) {
      const a = r[i], c = a[0] === "[", u = n.has(a);
      c || u ? (t.length > 0 && (t.sort(), o.push(...t), t = []), o.push(a)) : t.push(a);
    }
    return t.length > 0 && (t.sort(), o.push(...t)), o;
  };
}, Kp = (e) => ({
  cache: Vp(e.cacheSize),
  parseClassName: Wp(e),
  sortModifiers: qp(e),
  ...Ap(e)
}), Xp = /\s+/, Hp = (e, n) => {
  const {
    parseClassName: r,
    getClassGroupId: o,
    getConflictingClassGroupIds: t,
    sortModifiers: i
  } = n, a = [], c = e.trim().split(Xp);
  let u = "";
  for (let s = c.length - 1; s >= 0; s -= 1) {
    const l = c[s], {
      isExternal: d,
      modifiers: g,
      hasImportantModifier: h,
      baseClassName: p,
      maybePostfixModifierPosition: $
    } = r(l);
    if (d) {
      u = l + (u.length > 0 ? " " + u : u);
      continue;
    }
    let y = !!$, A = o(y ? p.substring(0, $) : p);
    if (!A) {
      if (!y) {
        u = l + (u.length > 0 ? " " + u : u);
        continue;
      }
      if (A = o(p), !A) {
        u = l + (u.length > 0 ? " " + u : u);
        continue;
      }
      y = !1;
    }
    const B = g.length === 0 ? "" : g.length === 1 ? g[0] : i(g).join(":"), N = h ? B + Ii : B, E = N + A;
    if (a.indexOf(E) > -1)
      continue;
    a.push(E);
    const P = t(A, y);
    for (let X = 0; X < P.length; ++X) {
      const J = P[X];
      a.push(N + J);
    }
    u = l + (u.length > 0 ? " " + u : u);
  }
  return u;
}, Yp = (...e) => {
  let n = 0, r, o, t = "";
  for (; n < e.length; )
    (r = e[n++]) && (o = Is(r)) && (t && (t += " "), t += o);
  return t;
}, Is = (e) => {
  if (typeof e == "string")
    return e;
  let n, r = "";
  for (let o = 0; o < e.length; o++)
    e[o] && (n = Is(e[o])) && (r && (r += " "), r += n);
  return r;
}, Qp = (e, ...n) => {
  let r, o, t, i;
  const a = (u) => {
    const s = n.reduce((l, d) => d(l), e());
    return r = Kp(s), o = r.cache.get, t = r.cache.set, i = c, c(u);
  }, c = (u) => {
    const s = o(u);
    if (s)
      return s;
    const l = Hp(u, r);
    return t(u, l), l;
  };
  return i = a, (...u) => i(Yp(...u));
}, eg = [], G = (e) => {
  const n = (r) => r[e] || eg;
  return n.isThemeGetter = !0, n;
}, Os = /^\[(?:(\w[\w-]*):)?(.+)\]$/i, Us = /^\((?:(\w[\w-]*):)?(.+)\)$/i, tg = /^\d+\/\d+$/, ng = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, rg = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, ig = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, og = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, ag = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, Ge = (e) => tg.test(e), T = (e) => !!e && !Number.isNaN(Number(e)), Oe = (e) => !!e && Number.isInteger(Number(e)), _i = (e) => e.endsWith("%") && T(e.slice(0, -1)), ke = (e) => ng.test(e), cg = () => !0, sg = (e) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  rg.test(e) && !ig.test(e)
), js = () => !1, ug = (e) => og.test(e), lg = (e) => ag.test(e), dg = (e) => !k(e) && !w(e), mg = (e) => st(e, Es, js), k = (e) => Os.test(e), Ne = (e) => st(e, Ns, sg), ki = (e) => st(e, hg, T), Tc = (e) => st(e, Ds, js), fg = (e) => st(e, Ts, lg), Rn = (e) => st(e, Ps, ug), w = (e) => Us.test(e), It = (e) => ut(e, Ns), pg = (e) => ut(e, bg), Ec = (e) => ut(e, Ds), gg = (e) => ut(e, Es), vg = (e) => ut(e, Ts), Cn = (e) => ut(e, Ps, !0), st = (e, n, r) => {
  const o = Os.exec(e);
  return o ? o[1] ? n(o[1]) : r(o[2]) : !1;
}, ut = (e, n, r = !1) => {
  const o = Us.exec(e);
  return o ? o[1] ? n(o[1]) : r : !1;
}, Ds = (e) => e === "position" || e === "percentage", Ts = (e) => e === "image" || e === "url", Es = (e) => e === "length" || e === "size" || e === "bg-size", Ns = (e) => e === "length", hg = (e) => e === "number", bg = (e) => e === "family-name", Ps = (e) => e === "shadow", $g = () => {
  const e = G("color"), n = G("font"), r = G("text"), o = G("font-weight"), t = G("tracking"), i = G("leading"), a = G("breakpoint"), c = G("container"), u = G("spacing"), s = G("radius"), l = G("shadow"), d = G("inset-shadow"), g = G("text-shadow"), h = G("drop-shadow"), p = G("blur"), $ = G("perspective"), y = G("aspect"), A = G("ease"), B = G("animate"), N = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], E = () => [
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
  ], P = () => [...E(), w, k], X = () => ["auto", "hidden", "clip", "visible", "scroll"], J = () => ["auto", "contain", "none"], I = () => [w, k, u], te = () => [Ge, "full", "auto", ...I()], wt = () => [Oe, "none", "subgrid", w, k], St = () => ["auto", {
    span: ["full", Oe, w, k]
  }, Oe, w, k], ye = () => [Oe, "auto", w, k], Ie = () => ["auto", "min", "max", "fr", w, k], le = () => ["start", "end", "center", "between", "around", "evenly", "stretch", "baseline", "center-safe", "end-safe"], _e = () => ["start", "end", "center", "stretch", "center-safe", "end-safe"], M = () => ["auto", ...I()], ge = () => [Ge, "auto", "full", "dvw", "dvh", "lvw", "lvh", "svw", "svh", "min", "max", "fit", ...I()], S = () => [e, w, k], xt = () => [...E(), Ec, Tc, {
    position: [w, k]
  }], En = () => ["no-repeat", {
    repeat: ["", "x", "y", "space", "round"]
  }], de = () => ["auto", "cover", "contain", gg, mg, {
    size: [w, k]
  }], ve = () => [_i, It, Ne], V = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    "full",
    s,
    w,
    k
  ], W = () => ["", T, It, Ne], Ee = () => ["solid", "dashed", "dotted", "double"], dc = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], q = () => [T, _i, Ec, Tc], mc = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    p,
    w,
    k
  ], Nn = () => ["none", T, w, k], Pn = () => ["none", T, w, k], hi = () => [T, w, k], An = () => [Ge, "full", ...I()];
  return {
    cacheSize: 500,
    theme: {
      animate: ["spin", "ping", "pulse", "bounce"],
      aspect: ["video"],
      blur: [ke],
      breakpoint: [ke],
      color: [cg],
      container: [ke],
      "drop-shadow": [ke],
      ease: ["in", "out", "in-out"],
      font: [dg],
      "font-weight": ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black"],
      "inset-shadow": [ke],
      leading: ["none", "tight", "snug", "normal", "relaxed", "loose"],
      perspective: ["dramatic", "near", "normal", "midrange", "distant", "none"],
      radius: [ke],
      shadow: [ke],
      spacing: ["px", T],
      text: [ke],
      "text-shadow": [ke],
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
        aspect: ["auto", "square", Ge, k, w, y]
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
        columns: [T, k, w, c]
      }],
      /**
       * Break After
       * @see https://tailwindcss.com/docs/break-after
       */
      "break-after": [{
        "break-after": N()
      }],
      /**
       * Break Before
       * @see https://tailwindcss.com/docs/break-before
       */
      "break-before": [{
        "break-before": N()
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
        object: P()
      }],
      /**
       * Overflow
       * @see https://tailwindcss.com/docs/overflow
       */
      overflow: [{
        overflow: X()
      }],
      /**
       * Overflow X
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-x": [{
        "overflow-x": X()
      }],
      /**
       * Overflow Y
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-y": [{
        "overflow-y": X()
      }],
      /**
       * Overscroll Behavior
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      overscroll: [{
        overscroll: J()
      }],
      /**
       * Overscroll Behavior X
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-x": [{
        "overscroll-x": J()
      }],
      /**
       * Overscroll Behavior Y
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-y": [{
        "overscroll-y": J()
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
        inset: te()
      }],
      /**
       * Right / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-x": [{
        "inset-x": te()
      }],
      /**
       * Top / Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-y": [{
        "inset-y": te()
      }],
      /**
       * Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      start: [{
        start: te()
      }],
      /**
       * End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      end: [{
        end: te()
      }],
      /**
       * Top
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      top: [{
        top: te()
      }],
      /**
       * Right
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      right: [{
        right: te()
      }],
      /**
       * Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      bottom: [{
        bottom: te()
      }],
      /**
       * Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      left: [{
        left: te()
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
        z: [Oe, "auto", w, k]
      }],
      // ------------------------
      // --- Flexbox and Grid ---
      // ------------------------
      /**
       * Flex Basis
       * @see https://tailwindcss.com/docs/flex-basis
       */
      basis: [{
        basis: [Ge, "full", "auto", c, ...I()]
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
        flex: [T, Ge, "auto", "initial", "none", k]
      }],
      /**
       * Flex Grow
       * @see https://tailwindcss.com/docs/flex-grow
       */
      grow: [{
        grow: ["", T, w, k]
      }],
      /**
       * Flex Shrink
       * @see https://tailwindcss.com/docs/flex-shrink
       */
      shrink: [{
        shrink: ["", T, w, k]
      }],
      /**
       * Order
       * @see https://tailwindcss.com/docs/order
       */
      order: [{
        order: [Oe, "first", "last", "none", w, k]
      }],
      /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */
      "grid-cols": [{
        "grid-cols": wt()
      }],
      /**
       * Grid Column Start / End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start-end": [{
        col: St()
      }],
      /**
       * Grid Column Start
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start": [{
        "col-start": ye()
      }],
      /**
       * Grid Column End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-end": [{
        "col-end": ye()
      }],
      /**
       * Grid Template Rows
       * @see https://tailwindcss.com/docs/grid-template-rows
       */
      "grid-rows": [{
        "grid-rows": wt()
      }],
      /**
       * Grid Row Start / End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start-end": [{
        row: St()
      }],
      /**
       * Grid Row Start
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start": [{
        "row-start": ye()
      }],
      /**
       * Grid Row End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-end": [{
        "row-end": ye()
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
        "auto-cols": Ie()
      }],
      /**
       * Grid Auto Rows
       * @see https://tailwindcss.com/docs/grid-auto-rows
       */
      "auto-rows": [{
        "auto-rows": Ie()
      }],
      /**
       * Gap
       * @see https://tailwindcss.com/docs/gap
       */
      gap: [{
        gap: I()
      }],
      /**
       * Gap X
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-x": [{
        "gap-x": I()
      }],
      /**
       * Gap Y
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-y": [{
        "gap-y": I()
      }],
      /**
       * Justify Content
       * @see https://tailwindcss.com/docs/justify-content
       */
      "justify-content": [{
        justify: [...le(), "normal"]
      }],
      /**
       * Justify Items
       * @see https://tailwindcss.com/docs/justify-items
       */
      "justify-items": [{
        "justify-items": [..._e(), "normal"]
      }],
      /**
       * Justify Self
       * @see https://tailwindcss.com/docs/justify-self
       */
      "justify-self": [{
        "justify-self": ["auto", ..._e()]
      }],
      /**
       * Align Content
       * @see https://tailwindcss.com/docs/align-content
       */
      "align-content": [{
        content: ["normal", ...le()]
      }],
      /**
       * Align Items
       * @see https://tailwindcss.com/docs/align-items
       */
      "align-items": [{
        items: [..._e(), {
          baseline: ["", "last"]
        }]
      }],
      /**
       * Align Self
       * @see https://tailwindcss.com/docs/align-self
       */
      "align-self": [{
        self: ["auto", ..._e(), {
          baseline: ["", "last"]
        }]
      }],
      /**
       * Place Content
       * @see https://tailwindcss.com/docs/place-content
       */
      "place-content": [{
        "place-content": le()
      }],
      /**
       * Place Items
       * @see https://tailwindcss.com/docs/place-items
       */
      "place-items": [{
        "place-items": [..._e(), "baseline"]
      }],
      /**
       * Place Self
       * @see https://tailwindcss.com/docs/place-self
       */
      "place-self": [{
        "place-self": ["auto", ..._e()]
      }],
      // Spacing
      /**
       * Padding
       * @see https://tailwindcss.com/docs/padding
       */
      p: [{
        p: I()
      }],
      /**
       * Padding X
       * @see https://tailwindcss.com/docs/padding
       */
      px: [{
        px: I()
      }],
      /**
       * Padding Y
       * @see https://tailwindcss.com/docs/padding
       */
      py: [{
        py: I()
      }],
      /**
       * Padding Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [{
        ps: I()
      }],
      /**
       * Padding End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [{
        pe: I()
      }],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [{
        pt: I()
      }],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [{
        pr: I()
      }],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [{
        pb: I()
      }],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [{
        pl: I()
      }],
      /**
       * Margin
       * @see https://tailwindcss.com/docs/margin
       */
      m: [{
        m: M()
      }],
      /**
       * Margin X
       * @see https://tailwindcss.com/docs/margin
       */
      mx: [{
        mx: M()
      }],
      /**
       * Margin Y
       * @see https://tailwindcss.com/docs/margin
       */
      my: [{
        my: M()
      }],
      /**
       * Margin Start
       * @see https://tailwindcss.com/docs/margin
       */
      ms: [{
        ms: M()
      }],
      /**
       * Margin End
       * @see https://tailwindcss.com/docs/margin
       */
      me: [{
        me: M()
      }],
      /**
       * Margin Top
       * @see https://tailwindcss.com/docs/margin
       */
      mt: [{
        mt: M()
      }],
      /**
       * Margin Right
       * @see https://tailwindcss.com/docs/margin
       */
      mr: [{
        mr: M()
      }],
      /**
       * Margin Bottom
       * @see https://tailwindcss.com/docs/margin
       */
      mb: [{
        mb: M()
      }],
      /**
       * Margin Left
       * @see https://tailwindcss.com/docs/margin
       */
      ml: [{
        ml: M()
      }],
      /**
       * Space Between X
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-x": [{
        "space-x": I()
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
        "space-y": I()
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
        size: ge()
      }],
      /**
       * Width
       * @see https://tailwindcss.com/docs/width
       */
      w: [{
        w: [c, "screen", ...ge()]
      }],
      /**
       * Min-Width
       * @see https://tailwindcss.com/docs/min-width
       */
      "min-w": [{
        "min-w": [
          c,
          "screen",
          /** Deprecated. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          "none",
          ...ge()
        ]
      }],
      /**
       * Max-Width
       * @see https://tailwindcss.com/docs/max-width
       */
      "max-w": [{
        "max-w": [
          c,
          "screen",
          "none",
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          "prose",
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          {
            screen: [a]
          },
          ...ge()
        ]
      }],
      /**
       * Height
       * @see https://tailwindcss.com/docs/height
       */
      h: [{
        h: ["screen", "lh", ...ge()]
      }],
      /**
       * Min-Height
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-h": [{
        "min-h": ["screen", "lh", "none", ...ge()]
      }],
      /**
       * Max-Height
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-h": [{
        "max-h": ["screen", "lh", ...ge()]
      }],
      // ------------------
      // --- Typography ---
      // ------------------
      /**
       * Font Size
       * @see https://tailwindcss.com/docs/font-size
       */
      "font-size": [{
        text: ["base", r, It, Ne]
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
        font: [o, w, ki]
      }],
      /**
       * Font Stretch
       * @see https://tailwindcss.com/docs/font-stretch
       */
      "font-stretch": [{
        "font-stretch": ["ultra-condensed", "extra-condensed", "condensed", "semi-condensed", "normal", "semi-expanded", "expanded", "extra-expanded", "ultra-expanded", _i, k]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      "font-family": [{
        font: [pg, k, n]
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
        tracking: [t, w, k]
      }],
      /**
       * Line Clamp
       * @see https://tailwindcss.com/docs/line-clamp
       */
      "line-clamp": [{
        "line-clamp": [T, "none", w, ki]
      }],
      /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */
      leading: [{
        leading: [
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          i,
          ...I()
        ]
      }],
      /**
       * List Style Image
       * @see https://tailwindcss.com/docs/list-style-image
       */
      "list-image": [{
        "list-image": ["none", w, k]
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
        list: ["disc", "decimal", "none", w, k]
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
        placeholder: S()
      }],
      /**
       * Text Color
       * @see https://tailwindcss.com/docs/text-color
       */
      "text-color": [{
        text: S()
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
        decoration: [...Ee(), "wavy"]
      }],
      /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */
      "text-decoration-thickness": [{
        decoration: [T, "from-font", "auto", w, Ne]
      }],
      /**
       * Text Decoration Color
       * @see https://tailwindcss.com/docs/text-decoration-color
       */
      "text-decoration-color": [{
        decoration: S()
      }],
      /**
       * Text Underline Offset
       * @see https://tailwindcss.com/docs/text-underline-offset
       */
      "underline-offset": [{
        "underline-offset": [T, "auto", w, k]
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
        indent: I()
      }],
      /**
       * Vertical Alignment
       * @see https://tailwindcss.com/docs/vertical-align
       */
      "vertical-align": [{
        align: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super", w, k]
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
        content: ["none", w, k]
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
        bg: xt()
      }],
      /**
       * Background Repeat
       * @see https://tailwindcss.com/docs/background-repeat
       */
      "bg-repeat": [{
        bg: En()
      }],
      /**
       * Background Size
       * @see https://tailwindcss.com/docs/background-size
       */
      "bg-size": [{
        bg: de()
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      "bg-image": [{
        bg: ["none", {
          linear: [{
            to: ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
          }, Oe, w, k],
          radial: ["", w, k],
          conic: [Oe, w, k]
        }, vg, fg]
      }],
      /**
       * Background Color
       * @see https://tailwindcss.com/docs/background-color
       */
      "bg-color": [{
        bg: S()
      }],
      /**
       * Gradient Color Stops From Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from-pos": [{
        from: ve()
      }],
      /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via-pos": [{
        via: ve()
      }],
      /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to-pos": [{
        to: ve()
      }],
      /**
       * Gradient Color Stops From
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from": [{
        from: S()
      }],
      /**
       * Gradient Color Stops Via
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via": [{
        via: S()
      }],
      /**
       * Gradient Color Stops To
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to": [{
        to: S()
      }],
      // ---------------
      // --- Borders ---
      // ---------------
      /**
       * Border Radius
       * @see https://tailwindcss.com/docs/border-radius
       */
      rounded: [{
        rounded: V()
      }],
      /**
       * Border Radius Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-s": [{
        "rounded-s": V()
      }],
      /**
       * Border Radius End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-e": [{
        "rounded-e": V()
      }],
      /**
       * Border Radius Top
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-t": [{
        "rounded-t": V()
      }],
      /**
       * Border Radius Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-r": [{
        "rounded-r": V()
      }],
      /**
       * Border Radius Bottom
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-b": [{
        "rounded-b": V()
      }],
      /**
       * Border Radius Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-l": [{
        "rounded-l": V()
      }],
      /**
       * Border Radius Start Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ss": [{
        "rounded-ss": V()
      }],
      /**
       * Border Radius Start End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-se": [{
        "rounded-se": V()
      }],
      /**
       * Border Radius End End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ee": [{
        "rounded-ee": V()
      }],
      /**
       * Border Radius End Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-es": [{
        "rounded-es": V()
      }],
      /**
       * Border Radius Top Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tl": [{
        "rounded-tl": V()
      }],
      /**
       * Border Radius Top Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tr": [{
        "rounded-tr": V()
      }],
      /**
       * Border Radius Bottom Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-br": [{
        "rounded-br": V()
      }],
      /**
       * Border Radius Bottom Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-bl": [{
        "rounded-bl": V()
      }],
      /**
       * Border Width
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w": [{
        border: W()
      }],
      /**
       * Border Width X
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-x": [{
        "border-x": W()
      }],
      /**
       * Border Width Y
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-y": [{
        "border-y": W()
      }],
      /**
       * Border Width Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-s": [{
        "border-s": W()
      }],
      /**
       * Border Width End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-e": [{
        "border-e": W()
      }],
      /**
       * Border Width Top
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-t": [{
        "border-t": W()
      }],
      /**
       * Border Width Right
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-r": [{
        "border-r": W()
      }],
      /**
       * Border Width Bottom
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-b": [{
        "border-b": W()
      }],
      /**
       * Border Width Left
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-l": [{
        "border-l": W()
      }],
      /**
       * Divide Width X
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-x": [{
        "divide-x": W()
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
        "divide-y": W()
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
        border: [...Ee(), "hidden", "none"]
      }],
      /**
       * Divide Style
       * @see https://tailwindcss.com/docs/border-style#setting-the-divider-style
       */
      "divide-style": [{
        divide: [...Ee(), "hidden", "none"]
      }],
      /**
       * Border Color
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color": [{
        border: S()
      }],
      /**
       * Border Color X
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-x": [{
        "border-x": S()
      }],
      /**
       * Border Color Y
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-y": [{
        "border-y": S()
      }],
      /**
       * Border Color S
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-s": [{
        "border-s": S()
      }],
      /**
       * Border Color E
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-e": [{
        "border-e": S()
      }],
      /**
       * Border Color Top
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-t": [{
        "border-t": S()
      }],
      /**
       * Border Color Right
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-r": [{
        "border-r": S()
      }],
      /**
       * Border Color Bottom
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-b": [{
        "border-b": S()
      }],
      /**
       * Border Color Left
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-l": [{
        "border-l": S()
      }],
      /**
       * Divide Color
       * @see https://tailwindcss.com/docs/divide-color
       */
      "divide-color": [{
        divide: S()
      }],
      /**
       * Outline Style
       * @see https://tailwindcss.com/docs/outline-style
       */
      "outline-style": [{
        outline: [...Ee(), "none", "hidden"]
      }],
      /**
       * Outline Offset
       * @see https://tailwindcss.com/docs/outline-offset
       */
      "outline-offset": [{
        "outline-offset": [T, w, k]
      }],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      "outline-w": [{
        outline: ["", T, It, Ne]
      }],
      /**
       * Outline Color
       * @see https://tailwindcss.com/docs/outline-color
       */
      "outline-color": [{
        outline: S()
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
          Cn,
          Rn
        ]
      }],
      /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-shadow-color
       */
      "shadow-color": [{
        shadow: S()
      }],
      /**
       * Inset Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-shadow
       */
      "inset-shadow": [{
        "inset-shadow": ["none", d, Cn, Rn]
      }],
      /**
       * Inset Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-shadow-color
       */
      "inset-shadow-color": [{
        "inset-shadow": S()
      }],
      /**
       * Ring Width
       * @see https://tailwindcss.com/docs/box-shadow#adding-a-ring
       */
      "ring-w": [{
        ring: W()
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
        ring: S()
      }],
      /**
       * Ring Offset Width
       * @see https://v3.tailwindcss.com/docs/ring-offset-width
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-offset-w": [{
        "ring-offset": [T, Ne]
      }],
      /**
       * Ring Offset Color
       * @see https://v3.tailwindcss.com/docs/ring-offset-color
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-offset-color": [{
        "ring-offset": S()
      }],
      /**
       * Inset Ring Width
       * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-ring
       */
      "inset-ring-w": [{
        "inset-ring": W()
      }],
      /**
       * Inset Ring Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-ring-color
       */
      "inset-ring-color": [{
        "inset-ring": S()
      }],
      /**
       * Text Shadow
       * @see https://tailwindcss.com/docs/text-shadow
       */
      "text-shadow": [{
        "text-shadow": ["none", g, Cn, Rn]
      }],
      /**
       * Text Shadow Color
       * @see https://tailwindcss.com/docs/text-shadow#setting-the-shadow-color
       */
      "text-shadow-color": [{
        "text-shadow": S()
      }],
      /**
       * Opacity
       * @see https://tailwindcss.com/docs/opacity
       */
      opacity: [{
        opacity: [T, w, k]
      }],
      /**
       * Mix Blend Mode
       * @see https://tailwindcss.com/docs/mix-blend-mode
       */
      "mix-blend": [{
        "mix-blend": [...dc(), "plus-darker", "plus-lighter"]
      }],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      "bg-blend": [{
        "bg-blend": dc()
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
        "mask-linear": [T]
      }],
      "mask-image-linear-from-pos": [{
        "mask-linear-from": q()
      }],
      "mask-image-linear-to-pos": [{
        "mask-linear-to": q()
      }],
      "mask-image-linear-from-color": [{
        "mask-linear-from": S()
      }],
      "mask-image-linear-to-color": [{
        "mask-linear-to": S()
      }],
      "mask-image-t-from-pos": [{
        "mask-t-from": q()
      }],
      "mask-image-t-to-pos": [{
        "mask-t-to": q()
      }],
      "mask-image-t-from-color": [{
        "mask-t-from": S()
      }],
      "mask-image-t-to-color": [{
        "mask-t-to": S()
      }],
      "mask-image-r-from-pos": [{
        "mask-r-from": q()
      }],
      "mask-image-r-to-pos": [{
        "mask-r-to": q()
      }],
      "mask-image-r-from-color": [{
        "mask-r-from": S()
      }],
      "mask-image-r-to-color": [{
        "mask-r-to": S()
      }],
      "mask-image-b-from-pos": [{
        "mask-b-from": q()
      }],
      "mask-image-b-to-pos": [{
        "mask-b-to": q()
      }],
      "mask-image-b-from-color": [{
        "mask-b-from": S()
      }],
      "mask-image-b-to-color": [{
        "mask-b-to": S()
      }],
      "mask-image-l-from-pos": [{
        "mask-l-from": q()
      }],
      "mask-image-l-to-pos": [{
        "mask-l-to": q()
      }],
      "mask-image-l-from-color": [{
        "mask-l-from": S()
      }],
      "mask-image-l-to-color": [{
        "mask-l-to": S()
      }],
      "mask-image-x-from-pos": [{
        "mask-x-from": q()
      }],
      "mask-image-x-to-pos": [{
        "mask-x-to": q()
      }],
      "mask-image-x-from-color": [{
        "mask-x-from": S()
      }],
      "mask-image-x-to-color": [{
        "mask-x-to": S()
      }],
      "mask-image-y-from-pos": [{
        "mask-y-from": q()
      }],
      "mask-image-y-to-pos": [{
        "mask-y-to": q()
      }],
      "mask-image-y-from-color": [{
        "mask-y-from": S()
      }],
      "mask-image-y-to-color": [{
        "mask-y-to": S()
      }],
      "mask-image-radial": [{
        "mask-radial": [w, k]
      }],
      "mask-image-radial-from-pos": [{
        "mask-radial-from": q()
      }],
      "mask-image-radial-to-pos": [{
        "mask-radial-to": q()
      }],
      "mask-image-radial-from-color": [{
        "mask-radial-from": S()
      }],
      "mask-image-radial-to-color": [{
        "mask-radial-to": S()
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
        "mask-radial-at": E()
      }],
      "mask-image-conic-pos": [{
        "mask-conic": [T]
      }],
      "mask-image-conic-from-pos": [{
        "mask-conic-from": q()
      }],
      "mask-image-conic-to-pos": [{
        "mask-conic-to": q()
      }],
      "mask-image-conic-from-color": [{
        "mask-conic-from": S()
      }],
      "mask-image-conic-to-color": [{
        "mask-conic-to": S()
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
        mask: xt()
      }],
      /**
       * Mask Repeat
       * @see https://tailwindcss.com/docs/mask-repeat
       */
      "mask-repeat": [{
        mask: En()
      }],
      /**
       * Mask Size
       * @see https://tailwindcss.com/docs/mask-size
       */
      "mask-size": [{
        mask: de()
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
        mask: ["none", w, k]
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
          w,
          k
        ]
      }],
      /**
       * Blur
       * @see https://tailwindcss.com/docs/blur
       */
      blur: [{
        blur: mc()
      }],
      /**
       * Brightness
       * @see https://tailwindcss.com/docs/brightness
       */
      brightness: [{
        brightness: [T, w, k]
      }],
      /**
       * Contrast
       * @see https://tailwindcss.com/docs/contrast
       */
      contrast: [{
        contrast: [T, w, k]
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
          Cn,
          Rn
        ]
      }],
      /**
       * Drop Shadow Color
       * @see https://tailwindcss.com/docs/filter-drop-shadow#setting-the-shadow-color
       */
      "drop-shadow-color": [{
        "drop-shadow": S()
      }],
      /**
       * Grayscale
       * @see https://tailwindcss.com/docs/grayscale
       */
      grayscale: [{
        grayscale: ["", T, w, k]
      }],
      /**
       * Hue Rotate
       * @see https://tailwindcss.com/docs/hue-rotate
       */
      "hue-rotate": [{
        "hue-rotate": [T, w, k]
      }],
      /**
       * Invert
       * @see https://tailwindcss.com/docs/invert
       */
      invert: [{
        invert: ["", T, w, k]
      }],
      /**
       * Saturate
       * @see https://tailwindcss.com/docs/saturate
       */
      saturate: [{
        saturate: [T, w, k]
      }],
      /**
       * Sepia
       * @see https://tailwindcss.com/docs/sepia
       */
      sepia: [{
        sepia: ["", T, w, k]
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
          w,
          k
        ]
      }],
      /**
       * Backdrop Blur
       * @see https://tailwindcss.com/docs/backdrop-blur
       */
      "backdrop-blur": [{
        "backdrop-blur": mc()
      }],
      /**
       * Backdrop Brightness
       * @see https://tailwindcss.com/docs/backdrop-brightness
       */
      "backdrop-brightness": [{
        "backdrop-brightness": [T, w, k]
      }],
      /**
       * Backdrop Contrast
       * @see https://tailwindcss.com/docs/backdrop-contrast
       */
      "backdrop-contrast": [{
        "backdrop-contrast": [T, w, k]
      }],
      /**
       * Backdrop Grayscale
       * @see https://tailwindcss.com/docs/backdrop-grayscale
       */
      "backdrop-grayscale": [{
        "backdrop-grayscale": ["", T, w, k]
      }],
      /**
       * Backdrop Hue Rotate
       * @see https://tailwindcss.com/docs/backdrop-hue-rotate
       */
      "backdrop-hue-rotate": [{
        "backdrop-hue-rotate": [T, w, k]
      }],
      /**
       * Backdrop Invert
       * @see https://tailwindcss.com/docs/backdrop-invert
       */
      "backdrop-invert": [{
        "backdrop-invert": ["", T, w, k]
      }],
      /**
       * Backdrop Opacity
       * @see https://tailwindcss.com/docs/backdrop-opacity
       */
      "backdrop-opacity": [{
        "backdrop-opacity": [T, w, k]
      }],
      /**
       * Backdrop Saturate
       * @see https://tailwindcss.com/docs/backdrop-saturate
       */
      "backdrop-saturate": [{
        "backdrop-saturate": [T, w, k]
      }],
      /**
       * Backdrop Sepia
       * @see https://tailwindcss.com/docs/backdrop-sepia
       */
      "backdrop-sepia": [{
        "backdrop-sepia": ["", T, w, k]
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
        "border-spacing": I()
      }],
      /**
       * Border Spacing X
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-x": [{
        "border-spacing-x": I()
      }],
      /**
       * Border Spacing Y
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-y": [{
        "border-spacing-y": I()
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
        transition: ["", "all", "colors", "opacity", "shadow", "transform", "none", w, k]
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
        duration: [T, "initial", w, k]
      }],
      /**
       * Transition Timing Function
       * @see https://tailwindcss.com/docs/transition-timing-function
       */
      ease: [{
        ease: ["linear", "initial", A, w, k]
      }],
      /**
       * Transition Delay
       * @see https://tailwindcss.com/docs/transition-delay
       */
      delay: [{
        delay: [T, w, k]
      }],
      /**
       * Animation
       * @see https://tailwindcss.com/docs/animation
       */
      animate: [{
        animate: ["none", B, w, k]
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
        perspective: [$, w, k]
      }],
      /**
       * Perspective Origin
       * @see https://tailwindcss.com/docs/perspective-origin
       */
      "perspective-origin": [{
        "perspective-origin": P()
      }],
      /**
       * Rotate
       * @see https://tailwindcss.com/docs/rotate
       */
      rotate: [{
        rotate: Nn()
      }],
      /**
       * Rotate X
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-x": [{
        "rotate-x": Nn()
      }],
      /**
       * Rotate Y
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-y": [{
        "rotate-y": Nn()
      }],
      /**
       * Rotate Z
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-z": [{
        "rotate-z": Nn()
      }],
      /**
       * Scale
       * @see https://tailwindcss.com/docs/scale
       */
      scale: [{
        scale: Pn()
      }],
      /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-x": [{
        "scale-x": Pn()
      }],
      /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-y": [{
        "scale-y": Pn()
      }],
      /**
       * Scale Z
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-z": [{
        "scale-z": Pn()
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
        skew: hi()
      }],
      /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-x": [{
        "skew-x": hi()
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-y": [{
        "skew-y": hi()
      }],
      /**
       * Transform
       * @see https://tailwindcss.com/docs/transform
       */
      transform: [{
        transform: [w, k, "", "none", "gpu", "cpu"]
      }],
      /**
       * Transform Origin
       * @see https://tailwindcss.com/docs/transform-origin
       */
      "transform-origin": [{
        origin: P()
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
        translate: An()
      }],
      /**
       * Translate X
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-x": [{
        "translate-x": An()
      }],
      /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-y": [{
        "translate-y": An()
      }],
      /**
       * Translate Z
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-z": [{
        "translate-z": An()
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
        accent: S()
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
        caret: S()
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
        cursor: ["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", w, k]
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
        "scroll-m": I()
      }],
      /**
       * Scroll Margin X
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mx": [{
        "scroll-mx": I()
      }],
      /**
       * Scroll Margin Y
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-my": [{
        "scroll-my": I()
      }],
      /**
       * Scroll Margin Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ms": [{
        "scroll-ms": I()
      }],
      /**
       * Scroll Margin End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-me": [{
        "scroll-me": I()
      }],
      /**
       * Scroll Margin Top
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mt": [{
        "scroll-mt": I()
      }],
      /**
       * Scroll Margin Right
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mr": [{
        "scroll-mr": I()
      }],
      /**
       * Scroll Margin Bottom
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mb": [{
        "scroll-mb": I()
      }],
      /**
       * Scroll Margin Left
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ml": [{
        "scroll-ml": I()
      }],
      /**
       * Scroll Padding
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-p": [{
        "scroll-p": I()
      }],
      /**
       * Scroll Padding X
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-px": [{
        "scroll-px": I()
      }],
      /**
       * Scroll Padding Y
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-py": [{
        "scroll-py": I()
      }],
      /**
       * Scroll Padding Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-ps": [{
        "scroll-ps": I()
      }],
      /**
       * Scroll Padding End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pe": [{
        "scroll-pe": I()
      }],
      /**
       * Scroll Padding Top
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pt": [{
        "scroll-pt": I()
      }],
      /**
       * Scroll Padding Right
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pr": [{
        "scroll-pr": I()
      }],
      /**
       * Scroll Padding Bottom
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pb": [{
        "scroll-pb": I()
      }],
      /**
       * Scroll Padding Left
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pl": [{
        "scroll-pl": I()
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
        "will-change": ["auto", "scroll", "contents", "transform", w, k]
      }],
      // -----------
      // --- SVG ---
      // -----------
      /**
       * Fill
       * @see https://tailwindcss.com/docs/fill
       */
      fill: [{
        fill: ["none", ...S()]
      }],
      /**
       * Stroke Width
       * @see https://tailwindcss.com/docs/stroke-width
       */
      "stroke-w": [{
        stroke: [T, It, Ne, ki]
      }],
      /**
       * Stroke
       * @see https://tailwindcss.com/docs/stroke
       */
      stroke: [{
        stroke: ["none", ...S()]
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
}, yg = /* @__PURE__ */ Qp($g), Ri = Object.freeze({
  status: "aborted"
});
function m(e, n, r) {
  function o(c, u) {
    if (c._zod || Object.defineProperty(c, "_zod", {
      value: {
        def: u,
        constr: a,
        traits: /* @__PURE__ */ new Set()
      },
      enumerable: !1
    }), c._zod.traits.has(e))
      return;
    c._zod.traits.add(e), n(c, u);
    const s = a.prototype, l = Object.keys(s);
    for (let d = 0; d < l.length; d++) {
      const g = l[d];
      g in c || (c[g] = s[g].bind(c));
    }
  }
  const t = r?.Parent ?? Object;
  class i extends t {
  }
  Object.defineProperty(i, "name", { value: e });
  function a(c) {
    var u;
    const s = r?.Parent ? new i() : this;
    o(s, c), (u = s._zod).deferred ?? (u.deferred = []);
    for (const l of s._zod.deferred)
      l();
    return s;
  }
  return Object.defineProperty(a, "init", { value: o }), Object.defineProperty(a, Symbol.hasInstance, {
    value: (c) => r?.Parent && c instanceof r.Parent ? !0 : c?._zod?.traits?.has(e)
  }), Object.defineProperty(a, "name", { value: e }), a;
}
const Ci = /* @__PURE__ */ Symbol("zod_brand");
class Re extends Error {
  constructor() {
    super("Encountered Promise during synchronous parse. Use .parseAsync() instead.");
  }
}
class ar extends Error {
  constructor(n) {
    super(`Encountered unidirectional transform during encode: ${n}`), this.name = "ZodEncodeError";
  }
}
const Kn = {};
function K(e) {
  return e && Object.assign(Kn, e), Kn;
}
function _g(e) {
  return e;
}
function kg(e) {
  return e;
}
function wg(e) {
}
function Sg(e) {
  throw new Error("Unexpected value in exhaustive check");
}
function xg(e) {
}
function Fi(e) {
  const n = Object.values(e).filter((o) => typeof o == "number");
  return Object.entries(e).filter(([o, t]) => n.indexOf(+o) === -1).map(([o, t]) => t);
}
function b(e, n = "|") {
  return e.map((r) => x(r)).join(n);
}
function Xn(e, n) {
  return typeof n == "bigint" ? n.toString() : n;
}
function Zt(e) {
  return {
    get value() {
      {
        const n = e();
        return Object.defineProperty(this, "value", { value: n }), n;
      }
    }
  };
}
function Me(e) {
  return e == null;
}
function cr(e) {
  const n = e.startsWith("^") ? 1 : 0, r = e.endsWith("$") ? e.length - 1 : e.length;
  return e.slice(n, r);
}
function As(e, n) {
  const r = (e.toString().split(".")[1] || "").length, o = n.toString();
  let t = (o.split(".")[1] || "").length;
  if (t === 0 && /\d?e-\d?/.test(o)) {
    const u = o.match(/\d?e-(\d?)/);
    u?.[1] && (t = Number.parseInt(u[1]));
  }
  const i = r > t ? r : t, a = Number.parseInt(e.toFixed(i).replace(".", "")), c = Number.parseInt(n.toFixed(i).replace(".", ""));
  return a % c / 10 ** i;
}
const Nc = /* @__PURE__ */ Symbol("evaluating");
function D(e, n, r) {
  let o;
  Object.defineProperty(e, n, {
    get() {
      if (o !== Nc)
        return o === void 0 && (o = Nc, o = r()), o;
    },
    set(t) {
      Object.defineProperty(e, n, {
        value: t
        // configurable: true,
      });
    },
    configurable: !0
  });
}
function zg(e) {
  return Object.create(Object.getPrototypeOf(e), Object.getOwnPropertyDescriptors(e));
}
function De(e, n, r) {
  Object.defineProperty(e, n, {
    value: r,
    writable: !0,
    enumerable: !0,
    configurable: !0
  });
}
function be(...e) {
  const n = {};
  for (const r of e) {
    const o = Object.getOwnPropertyDescriptors(r);
    Object.assign(n, o);
  }
  return Object.defineProperties({}, n);
}
function Ig(e) {
  return be(e._zod.def);
}
function Og(e, n) {
  return n ? n.reduce((r, o) => r?.[o], e) : e;
}
function Ug(e) {
  const n = Object.keys(e), r = n.map((o) => e[o]);
  return Promise.all(r).then((o) => {
    const t = {};
    for (let i = 0; i < n.length; i++)
      t[n[i]] = o[i];
    return t;
  });
}
function jg(e = 10) {
  const n = "abcdefghijklmnopqrstuvwxyz";
  let r = "";
  for (let o = 0; o < e; o++)
    r += n[Math.floor(Math.random() * n.length)];
  return r;
}
function Oi(e) {
  return JSON.stringify(e);
}
function Zs(e) {
  return e.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}
const Li = "captureStackTrace" in Error ? Error.captureStackTrace : (...e) => {
};
function Ke(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
const Rs = Zt(() => {
  if (typeof navigator < "u" && navigator?.userAgent?.includes("Cloudflare"))
    return !1;
  try {
    const e = Function;
    return new e(""), !0;
  } catch {
    return !1;
  }
});
function Fe(e) {
  if (Ke(e) === !1)
    return !1;
  const n = e.constructor;
  if (n === void 0 || typeof n != "function")
    return !0;
  const r = n.prototype;
  return !(Ke(r) === !1 || Object.prototype.hasOwnProperty.call(r, "isPrototypeOf") === !1);
}
function sr(e) {
  return Fe(e) ? { ...e } : Array.isArray(e) ? [...e] : e;
}
function Dg(e) {
  let n = 0;
  for (const r in e)
    Object.prototype.hasOwnProperty.call(e, r) && n++;
  return n;
}
const Tg = (e) => {
  const n = typeof e;
  switch (n) {
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
      throw new Error(`Unknown data type: ${n}`);
  }
}, Hn = /* @__PURE__ */ new Set(["string", "number", "symbol"]), Cs = /* @__PURE__ */ new Set(["string", "number", "bigint", "boolean", "symbol", "undefined"]);
function we(e) {
  return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function ce(e, n, r) {
  const o = new e._zod.constr(n ?? e._zod.def);
  return (!n || r?.parent) && (o._zod.parent = e), o;
}
function v(e) {
  const n = e;
  if (!n)
    return {};
  if (typeof n == "string")
    return { error: () => n };
  if (n?.message !== void 0) {
    if (n?.error !== void 0)
      throw new Error("Cannot specify both `message` and `error` params");
    n.error = n.message;
  }
  return delete n.message, typeof n.error == "string" ? { ...n, error: () => n.error } : n;
}
function Eg(e) {
  let n;
  return new Proxy({}, {
    get(r, o, t) {
      return n ?? (n = e()), Reflect.get(n, o, t);
    },
    set(r, o, t, i) {
      return n ?? (n = e()), Reflect.set(n, o, t, i);
    },
    has(r, o) {
      return n ?? (n = e()), Reflect.has(n, o);
    },
    deleteProperty(r, o) {
      return n ?? (n = e()), Reflect.deleteProperty(n, o);
    },
    ownKeys(r) {
      return n ?? (n = e()), Reflect.ownKeys(n);
    },
    getOwnPropertyDescriptor(r, o) {
      return n ?? (n = e()), Reflect.getOwnPropertyDescriptor(n, o);
    },
    defineProperty(r, o, t) {
      return n ?? (n = e()), Reflect.defineProperty(n, o, t);
    }
  });
}
function x(e) {
  return typeof e == "bigint" ? e.toString() + "n" : typeof e == "string" ? `"${e}"` : `${e}`;
}
function Fs(e) {
  return Object.keys(e).filter((n) => e[n]._zod.optin === "optional" && e[n]._zod.optout === "optional");
}
const Ls = {
  safeint: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
  int32: [-2147483648, 2147483647],
  uint32: [0, 4294967295],
  float32: [-34028234663852886e22, 34028234663852886e22],
  float64: [-Number.MAX_VALUE, Number.MAX_VALUE]
}, Js = {
  int64: [/* @__PURE__ */ BigInt("-9223372036854775808"), /* @__PURE__ */ BigInt("9223372036854775807")],
  uint64: [/* @__PURE__ */ BigInt(0), /* @__PURE__ */ BigInt("18446744073709551615")]
};
function Ms(e, n) {
  const r = e._zod.def, o = r.checks;
  if (o && o.length > 0)
    throw new Error(".pick() cannot be used on object schemas containing refinements");
  const i = be(e._zod.def, {
    get shape() {
      const a = {};
      for (const c in n) {
        if (!(c in r.shape))
          throw new Error(`Unrecognized key: "${c}"`);
        n[c] && (a[c] = r.shape[c]);
      }
      return De(this, "shape", a), a;
    },
    checks: []
  });
  return ce(e, i);
}
function Bs(e, n) {
  const r = e._zod.def, o = r.checks;
  if (o && o.length > 0)
    throw new Error(".omit() cannot be used on object schemas containing refinements");
  const i = be(e._zod.def, {
    get shape() {
      const a = { ...e._zod.def.shape };
      for (const c in n) {
        if (!(c in r.shape))
          throw new Error(`Unrecognized key: "${c}"`);
        n[c] && delete a[c];
      }
      return De(this, "shape", a), a;
    },
    checks: []
  });
  return ce(e, i);
}
function Vs(e, n) {
  if (!Fe(n))
    throw new Error("Invalid input to extend: expected a plain object");
  const r = e._zod.def.checks;
  if (r && r.length > 0) {
    const i = e._zod.def.shape;
    for (const a in n)
      if (Object.getOwnPropertyDescriptor(i, a) !== void 0)
        throw new Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.");
  }
  const t = be(e._zod.def, {
    get shape() {
      const i = { ...e._zod.def.shape, ...n };
      return De(this, "shape", i), i;
    }
  });
  return ce(e, t);
}
function Gs(e, n) {
  if (!Fe(n))
    throw new Error("Invalid input to safeExtend: expected a plain object");
  const r = be(e._zod.def, {
    get shape() {
      const o = { ...e._zod.def.shape, ...n };
      return De(this, "shape", o), o;
    }
  });
  return ce(e, r);
}
function Ws(e, n) {
  const r = be(e._zod.def, {
    get shape() {
      const o = { ...e._zod.def.shape, ...n._zod.def.shape };
      return De(this, "shape", o), o;
    },
    get catchall() {
      return n._zod.def.catchall;
    },
    checks: []
    // delete existing checks
  });
  return ce(e, r);
}
function qs(e, n, r) {
  const t = n._zod.def.checks;
  if (t && t.length > 0)
    throw new Error(".partial() cannot be used on object schemas containing refinements");
  const a = be(n._zod.def, {
    get shape() {
      const c = n._zod.def.shape, u = { ...c };
      if (r)
        for (const s in r) {
          if (!(s in c))
            throw new Error(`Unrecognized key: "${s}"`);
          r[s] && (u[s] = e ? new e({
            type: "optional",
            innerType: c[s]
          }) : c[s]);
        }
      else
        for (const s in c)
          u[s] = e ? new e({
            type: "optional",
            innerType: c[s]
          }) : c[s];
      return De(this, "shape", u), u;
    },
    checks: []
  });
  return ce(n, a);
}
function Ks(e, n, r) {
  const o = be(n._zod.def, {
    get shape() {
      const t = n._zod.def.shape, i = { ...t };
      if (r)
        for (const a in r) {
          if (!(a in i))
            throw new Error(`Unrecognized key: "${a}"`);
          r[a] && (i[a] = new e({
            type: "nonoptional",
            innerType: t[a]
          }));
        }
      else
        for (const a in t)
          i[a] = new e({
            type: "nonoptional",
            innerType: t[a]
          });
      return De(this, "shape", i), i;
    }
  });
  return ce(n, o);
}
function Ae(e, n = 0) {
  if (e.aborted === !0)
    return !0;
  for (let r = n; r < e.issues.length; r++)
    if (e.issues[r]?.continue !== !0)
      return !0;
  return !1;
}
function me(e, n) {
  return n.map((r) => {
    var o;
    return (o = r).path ?? (o.path = []), r.path.unshift(e), r;
  });
}
function Ut(e) {
  return typeof e == "string" ? e : e?.message;
}
function ue(e, n, r) {
  const o = { ...e, path: e.path ?? [] };
  if (!e.message) {
    const t = Ut(e.inst?._zod.def?.error?.(e)) ?? Ut(n?.error?.(e)) ?? Ut(r.customError?.(e)) ?? Ut(r.localeError?.(e)) ?? "Invalid input";
    o.message = t;
  }
  return delete o.inst, delete o.continue, n?.reportInput || delete o.input, o;
}
function ur(e) {
  return e instanceof Set ? "set" : e instanceof Map ? "map" : e instanceof File ? "file" : "unknown";
}
function lr(e) {
  return Array.isArray(e) ? "array" : typeof e == "string" ? "string" : "unknown";
}
function z(e) {
  const n = typeof e;
  switch (n) {
    case "number":
      return Number.isNaN(e) ? "nan" : "number";
    case "object": {
      if (e === null)
        return "null";
      if (Array.isArray(e))
        return "array";
      const r = e;
      if (r && Object.getPrototypeOf(r) !== Object.prototype && "constructor" in r && r.constructor)
        return r.constructor.name;
    }
  }
  return n;
}
function Xe(...e) {
  const [n, r, o] = e;
  return typeof n == "string" ? {
    message: n,
    code: "custom",
    input: r,
    inst: o
  } : { ...n };
}
function Ng(e) {
  return Object.entries(e).filter(([n, r]) => Number.isNaN(Number.parseInt(n, 10))).map((n) => n[1]);
}
function Xs(e) {
  const n = atob(e), r = new Uint8Array(n.length);
  for (let o = 0; o < n.length; o++)
    r[o] = n.charCodeAt(o);
  return r;
}
function Hs(e) {
  let n = "";
  for (let r = 0; r < e.length; r++)
    n += String.fromCharCode(e[r]);
  return btoa(n);
}
function Pg(e) {
  const n = e.replace(/-/g, "+").replace(/_/g, "/"), r = "=".repeat((4 - n.length % 4) % 4);
  return Xs(n + r);
}
function Ag(e) {
  return Hs(e).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}
function Zg(e) {
  const n = e.replace(/^0x/, "");
  if (n.length % 2 !== 0)
    throw new Error("Invalid hex string length");
  const r = new Uint8Array(n.length / 2);
  for (let o = 0; o < n.length; o += 2)
    r[o / 2] = Number.parseInt(n.slice(o, o + 2), 16);
  return r;
}
function Rg(e) {
  return Array.from(e).map((n) => n.toString(16).padStart(2, "0")).join("");
}
class Cg {
  constructor(...n) {
  }
}
const Ji = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  BIGINT_FORMAT_RANGES: Js,
  Class: Cg,
  NUMBER_FORMAT_RANGES: Ls,
  aborted: Ae,
  allowsEval: Rs,
  assert: xg,
  assertEqual: _g,
  assertIs: wg,
  assertNever: Sg,
  assertNotEqual: kg,
  assignProp: De,
  base64ToUint8Array: Xs,
  base64urlToUint8Array: Pg,
  cached: Zt,
  captureStackTrace: Li,
  cleanEnum: Ng,
  cleanRegex: cr,
  clone: ce,
  cloneDef: Ig,
  createTransparentProxy: Eg,
  defineLazy: D,
  esc: Oi,
  escapeRegex: we,
  extend: Vs,
  finalizeIssue: ue,
  floatSafeRemainder: As,
  getElementAtPath: Og,
  getEnumValues: Fi,
  getLengthableOrigin: lr,
  getParsedType: Tg,
  getSizableOrigin: ur,
  hexToUint8Array: Zg,
  isObject: Ke,
  isPlainObject: Fe,
  issue: Xe,
  joinValues: b,
  jsonStringifyReplacer: Xn,
  merge: Ws,
  mergeDefs: be,
  normalizeParams: v,
  nullish: Me,
  numKeys: Dg,
  objectClone: zg,
  omit: Bs,
  optionalKeys: Fs,
  parsedType: z,
  partial: qs,
  pick: Ms,
  prefixIssues: me,
  primitiveTypes: Cs,
  promiseAllObject: Ug,
  propertyKeyTypes: Hn,
  randomString: jg,
  required: Ks,
  safeExtend: Gs,
  shallowClone: sr,
  slugify: Zs,
  stringifyPrimitive: x,
  uint8ArrayToBase64: Hs,
  uint8ArrayToBase64url: Ag,
  uint8ArrayToHex: Rg,
  unwrapMessage: Ut
}, Symbol.toStringTag, { value: "Module" })), Ys = (e, n) => {
  e.name = "$ZodError", Object.defineProperty(e, "_zod", {
    value: e._zod,
    enumerable: !1
  }), Object.defineProperty(e, "issues", {
    value: n,
    enumerable: !1
  }), e.message = JSON.stringify(n, Xn, 2), Object.defineProperty(e, "toString", {
    value: () => e.message,
    enumerable: !1
  });
}, Mi = m("$ZodError", Ys), se = m("$ZodError", Ys, { Parent: Error });
function dr(e, n = (r) => r.message) {
  const r = {}, o = [];
  for (const t of e.issues)
    t.path.length > 0 ? (r[t.path[0]] = r[t.path[0]] || [], r[t.path[0]].push(n(t))) : o.push(n(t));
  return { formErrors: o, fieldErrors: r };
}
function mr(e, n = (r) => r.message) {
  const r = { _errors: [] }, o = (t) => {
    for (const i of t.issues)
      if (i.code === "invalid_union" && i.errors.length)
        i.errors.map((a) => o({ issues: a }));
      else if (i.code === "invalid_key")
        o({ issues: i.issues });
      else if (i.code === "invalid_element")
        o({ issues: i.issues });
      else if (i.path.length === 0)
        r._errors.push(n(i));
      else {
        let a = r, c = 0;
        for (; c < i.path.length; ) {
          const u = i.path[c];
          c === i.path.length - 1 ? (a[u] = a[u] || { _errors: [] }, a[u]._errors.push(n(i))) : a[u] = a[u] || { _errors: [] }, a = a[u], c++;
        }
      }
  };
  return o(e), r;
}
function Bi(e, n = (r) => r.message) {
  const r = { errors: [] }, o = (t, i = []) => {
    var a, c;
    for (const u of t.issues)
      if (u.code === "invalid_union" && u.errors.length)
        u.errors.map((s) => o({ issues: s }, u.path));
      else if (u.code === "invalid_key")
        o({ issues: u.issues }, u.path);
      else if (u.code === "invalid_element")
        o({ issues: u.issues }, u.path);
      else {
        const s = [...i, ...u.path];
        if (s.length === 0) {
          r.errors.push(n(u));
          continue;
        }
        let l = r, d = 0;
        for (; d < s.length; ) {
          const g = s[d], h = d === s.length - 1;
          typeof g == "string" ? (l.properties ?? (l.properties = {}), (a = l.properties)[g] ?? (a[g] = { errors: [] }), l = l.properties[g]) : (l.items ?? (l.items = []), (c = l.items)[g] ?? (c[g] = { errors: [] }), l = l.items[g]), h && l.errors.push(n(u)), d++;
        }
      }
  };
  return o(e), r;
}
function Qs(e) {
  const n = [], r = e.map((o) => typeof o == "object" ? o.key : o);
  for (const o of r)
    typeof o == "number" ? n.push(`[${o}]`) : typeof o == "symbol" ? n.push(`[${JSON.stringify(String(o))}]`) : /[^\w$]/.test(o) ? n.push(`[${JSON.stringify(o)}]`) : (n.length && n.push("."), n.push(o));
  return n.join("");
}
function Vi(e) {
  const n = [], r = [...e.issues].sort((o, t) => (o.path ?? []).length - (t.path ?? []).length);
  for (const o of r)
    n.push(`✖ ${o.message}`), o.path?.length && n.push(`  → at ${Qs(o.path)}`);
  return n.join(`
`);
}
const Rt = (e) => (n, r, o, t) => {
  const i = o ? Object.assign(o, { async: !1 }) : { async: !1 }, a = n._zod.run({ value: r, issues: [] }, i);
  if (a instanceof Promise)
    throw new Re();
  if (a.issues.length) {
    const c = new (t?.Err ?? e)(a.issues.map((u) => ue(u, i, K())));
    throw Li(c, t?.callee), c;
  }
  return a.value;
}, Ui = /* @__PURE__ */ Rt(se), Ct = (e) => async (n, r, o, t) => {
  const i = o ? Object.assign(o, { async: !0 }) : { async: !0 };
  let a = n._zod.run({ value: r, issues: [] }, i);
  if (a instanceof Promise && (a = await a), a.issues.length) {
    const c = new (t?.Err ?? e)(a.issues.map((u) => ue(u, i, K())));
    throw Li(c, t?.callee), c;
  }
  return a.value;
}, ji = /* @__PURE__ */ Ct(se), Ft = (e) => (n, r, o) => {
  const t = o ? { ...o, async: !1 } : { async: !1 }, i = n._zod.run({ value: r, issues: [] }, t);
  if (i instanceof Promise)
    throw new Re();
  return i.issues.length ? {
    success: !1,
    error: new (e ?? Mi)(i.issues.map((a) => ue(a, t, K())))
  } : { success: !0, data: i.value };
}, eu = /* @__PURE__ */ Ft(se), Lt = (e) => async (n, r, o) => {
  const t = o ? Object.assign(o, { async: !0 }) : { async: !0 };
  let i = n._zod.run({ value: r, issues: [] }, t);
  return i instanceof Promise && (i = await i), i.issues.length ? {
    success: !1,
    error: new e(i.issues.map((a) => ue(a, t, K())))
  } : { success: !0, data: i.value };
}, tu = /* @__PURE__ */ Lt(se), Gi = (e) => (n, r, o) => {
  const t = o ? Object.assign(o, { direction: "backward" }) : { direction: "backward" };
  return Rt(e)(n, r, t);
}, Fg = /* @__PURE__ */ Gi(se), Wi = (e) => (n, r, o) => Rt(e)(n, r, o), Lg = /* @__PURE__ */ Wi(se), qi = (e) => async (n, r, o) => {
  const t = o ? Object.assign(o, { direction: "backward" }) : { direction: "backward" };
  return Ct(e)(n, r, t);
}, Jg = /* @__PURE__ */ qi(se), Ki = (e) => async (n, r, o) => Ct(e)(n, r, o), Mg = /* @__PURE__ */ Ki(se), Xi = (e) => (n, r, o) => {
  const t = o ? Object.assign(o, { direction: "backward" }) : { direction: "backward" };
  return Ft(e)(n, r, t);
}, Bg = /* @__PURE__ */ Xi(se), Hi = (e) => (n, r, o) => Ft(e)(n, r, o), Vg = /* @__PURE__ */ Hi(se), Yi = (e) => async (n, r, o) => {
  const t = o ? Object.assign(o, { direction: "backward" }) : { direction: "backward" };
  return Lt(e)(n, r, t);
}, Gg = /* @__PURE__ */ Yi(se), Qi = (e) => async (n, r, o) => Lt(e)(n, r, o), Wg = /* @__PURE__ */ Qi(se), nu = /^[cC][^\s-]{8,}$/, ru = /^[0-9a-z]+$/, iu = /^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/, ou = /^[0-9a-vA-V]{20}$/, au = /^[A-Za-z0-9]{27}$/, cu = /^[a-zA-Z0-9_-]{21}$/, su = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/, qg = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/, uu = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/, He = (e) => e ? new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${e}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`) : /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/, Kg = /* @__PURE__ */ He(4), Xg = /* @__PURE__ */ He(6), Hg = /* @__PURE__ */ He(7), lu = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/, Yg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/, Qg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, du = /^[^\s@"]{1,64}@[^\s@]{1,255}$/u, ev = du, tv = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/, nv = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$";
function mu() {
  return new RegExp(nv, "u");
}
const fu = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, pu = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/, gu = (e) => {
  const n = we(e ?? ":");
  return new RegExp(`^(?:[0-9A-F]{2}${n}){5}[0-9A-F]{2}$|^(?:[0-9a-f]{2}${n}){5}[0-9a-f]{2}$`);
}, vu = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/, hu = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/, bu = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/, eo = /^[A-Za-z0-9_-]*$/, $u = /^(?=.{1,253}\.?$)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[-0-9a-zA-Z]{0,61}[0-9a-zA-Z])?)*\.?$/, yu = /^([a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/, _u = /^\+[1-9]\d{6,14}$/, ku = "(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))", wu = /* @__PURE__ */ new RegExp(`^${ku}$`);
function Su(e) {
  const n = "(?:[01]\\d|2[0-3]):[0-5]\\d";
  return typeof e.precision == "number" ? e.precision === -1 ? `${n}` : e.precision === 0 ? `${n}:[0-5]\\d` : `${n}:[0-5]\\d\\.\\d{${e.precision}}` : `${n}(?::[0-5]\\d(?:\\.\\d+)?)?`;
}
function xu(e) {
  return new RegExp(`^${Su(e)}$`);
}
function zu(e) {
  const n = Su({ precision: e.precision }), r = ["Z"];
  e.local && r.push(""), e.offset && r.push("([+-](?:[01]\\d|2[0-3]):[0-5]\\d)");
  const o = `${n}(?:${r.join("|")})`;
  return new RegExp(`^${ku}T(?:${o})$`);
}
const Iu = (e) => {
  const n = e ? `[\\s\\S]{${e?.minimum ?? 0},${e?.maximum ?? ""}}` : "[\\s\\S]*";
  return new RegExp(`^${n}$`);
}, Ou = /^-?\d+n?$/, Uu = /^-?\d+$/, to = /^-?\d+(?:\.\d+)?$/, ju = /^(?:true|false)$/i, Du = /^null$/i, Tu = /^undefined$/i, Eu = /^[^A-Z]*$/, Nu = /^[^a-z]*$/, Pu = /^[0-9a-fA-F]*$/;
function Jt(e, n) {
  return new RegExp(`^[A-Za-z0-9+/]{${e}}${n}$`);
}
function Mt(e) {
  return new RegExp(`^[A-Za-z0-9_-]{${e}}$`);
}
const rv = /^[0-9a-fA-F]{32}$/, iv = /* @__PURE__ */ Jt(22, "=="), ov = /* @__PURE__ */ Mt(22), av = /^[0-9a-fA-F]{40}$/, cv = /* @__PURE__ */ Jt(27, "="), sv = /* @__PURE__ */ Mt(27), uv = /^[0-9a-fA-F]{64}$/, lv = /* @__PURE__ */ Jt(43, "="), dv = /* @__PURE__ */ Mt(43), mv = /^[0-9a-fA-F]{96}$/, fv = /* @__PURE__ */ Jt(64, ""), pv = /* @__PURE__ */ Mt(64), gv = /^[0-9a-fA-F]{128}$/, vv = /* @__PURE__ */ Jt(86, "=="), hv = /* @__PURE__ */ Mt(86), fr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  base64: bu,
  base64url: eo,
  bigint: Ou,
  boolean: ju,
  browserEmail: tv,
  cidrv4: vu,
  cidrv6: hu,
  cuid: nu,
  cuid2: ru,
  date: wu,
  datetime: zu,
  domain: yu,
  duration: su,
  e164: _u,
  email: lu,
  emoji: mu,
  extendedDuration: qg,
  guid: uu,
  hex: Pu,
  hostname: $u,
  html5Email: Yg,
  idnEmail: ev,
  integer: Uu,
  ipv4: fu,
  ipv6: pu,
  ksuid: au,
  lowercase: Eu,
  mac: gu,
  md5_base64: iv,
  md5_base64url: ov,
  md5_hex: rv,
  nanoid: cu,
  null: Du,
  number: to,
  rfc5322Email: Qg,
  sha1_base64: cv,
  sha1_base64url: sv,
  sha1_hex: av,
  sha256_base64: lv,
  sha256_base64url: dv,
  sha256_hex: uv,
  sha384_base64: fv,
  sha384_base64url: pv,
  sha384_hex: mv,
  sha512_base64: vv,
  sha512_base64url: hv,
  sha512_hex: gv,
  string: Iu,
  time: xu,
  ulid: iu,
  undefined: Tu,
  unicodeEmail: du,
  uppercase: Nu,
  uuid: He,
  uuid4: Kg,
  uuid6: Xg,
  uuid7: Hg,
  xid: ou
}, Symbol.toStringTag, { value: "Module" })), F = /* @__PURE__ */ m("$ZodCheck", (e, n) => {
  var r;
  e._zod ?? (e._zod = {}), e._zod.def = n, (r = e._zod).onattach ?? (r.onattach = []);
}), Au = {
  number: "number",
  bigint: "bigint",
  object: "date"
}, no = /* @__PURE__ */ m("$ZodCheckLessThan", (e, n) => {
  F.init(e, n);
  const r = Au[typeof n.value];
  e._zod.onattach.push((o) => {
    const t = o._zod.bag, i = (n.inclusive ? t.maximum : t.exclusiveMaximum) ?? Number.POSITIVE_INFINITY;
    n.value < i && (n.inclusive ? t.maximum = n.value : t.exclusiveMaximum = n.value);
  }), e._zod.check = (o) => {
    (n.inclusive ? o.value <= n.value : o.value < n.value) || o.issues.push({
      origin: r,
      code: "too_big",
      maximum: typeof n.value == "object" ? n.value.getTime() : n.value,
      input: o.value,
      inclusive: n.inclusive,
      inst: e,
      continue: !n.abort
    });
  };
}), ro = /* @__PURE__ */ m("$ZodCheckGreaterThan", (e, n) => {
  F.init(e, n);
  const r = Au[typeof n.value];
  e._zod.onattach.push((o) => {
    const t = o._zod.bag, i = (n.inclusive ? t.minimum : t.exclusiveMinimum) ?? Number.NEGATIVE_INFINITY;
    n.value > i && (n.inclusive ? t.minimum = n.value : t.exclusiveMinimum = n.value);
  }), e._zod.check = (o) => {
    (n.inclusive ? o.value >= n.value : o.value > n.value) || o.issues.push({
      origin: r,
      code: "too_small",
      minimum: typeof n.value == "object" ? n.value.getTime() : n.value,
      input: o.value,
      inclusive: n.inclusive,
      inst: e,
      continue: !n.abort
    });
  };
}), Zu = /* @__PURE__ */ m("$ZodCheckMultipleOf", (e, n) => {
  F.init(e, n), e._zod.onattach.push((r) => {
    var o;
    (o = r._zod.bag).multipleOf ?? (o.multipleOf = n.value);
  }), e._zod.check = (r) => {
    if (typeof r.value != typeof n.value)
      throw new Error("Cannot mix number and bigint in multiple_of check.");
    (typeof r.value == "bigint" ? r.value % n.value === BigInt(0) : As(r.value, n.value) === 0) || r.issues.push({
      origin: typeof r.value,
      code: "not_multiple_of",
      divisor: n.value,
      input: r.value,
      inst: e,
      continue: !n.abort
    });
  };
}), Ru = /* @__PURE__ */ m("$ZodCheckNumberFormat", (e, n) => {
  F.init(e, n), n.format = n.format || "float64";
  const r = n.format?.includes("int"), o = r ? "int" : "number", [t, i] = Ls[n.format];
  e._zod.onattach.push((a) => {
    const c = a._zod.bag;
    c.format = n.format, c.minimum = t, c.maximum = i, r && (c.pattern = Uu);
  }), e._zod.check = (a) => {
    const c = a.value;
    if (r) {
      if (!Number.isInteger(c)) {
        a.issues.push({
          expected: o,
          format: n.format,
          code: "invalid_type",
          continue: !1,
          input: c,
          inst: e
        });
        return;
      }
      if (!Number.isSafeInteger(c)) {
        c > 0 ? a.issues.push({
          input: c,
          code: "too_big",
          maximum: Number.MAX_SAFE_INTEGER,
          note: "Integers must be within the safe integer range.",
          inst: e,
          origin: o,
          inclusive: !0,
          continue: !n.abort
        }) : a.issues.push({
          input: c,
          code: "too_small",
          minimum: Number.MIN_SAFE_INTEGER,
          note: "Integers must be within the safe integer range.",
          inst: e,
          origin: o,
          inclusive: !0,
          continue: !n.abort
        });
        return;
      }
    }
    c < t && a.issues.push({
      origin: "number",
      input: c,
      code: "too_small",
      minimum: t,
      inclusive: !0,
      inst: e,
      continue: !n.abort
    }), c > i && a.issues.push({
      origin: "number",
      input: c,
      code: "too_big",
      maximum: i,
      inclusive: !0,
      inst: e,
      continue: !n.abort
    });
  };
}), Cu = /* @__PURE__ */ m("$ZodCheckBigIntFormat", (e, n) => {
  F.init(e, n);
  const [r, o] = Js[n.format];
  e._zod.onattach.push((t) => {
    const i = t._zod.bag;
    i.format = n.format, i.minimum = r, i.maximum = o;
  }), e._zod.check = (t) => {
    const i = t.value;
    i < r && t.issues.push({
      origin: "bigint",
      input: i,
      code: "too_small",
      minimum: r,
      inclusive: !0,
      inst: e,
      continue: !n.abort
    }), i > o && t.issues.push({
      origin: "bigint",
      input: i,
      code: "too_big",
      maximum: o,
      inclusive: !0,
      inst: e,
      continue: !n.abort
    });
  };
}), Fu = /* @__PURE__ */ m("$ZodCheckMaxSize", (e, n) => {
  var r;
  F.init(e, n), (r = e._zod.def).when ?? (r.when = (o) => {
    const t = o.value;
    return !Me(t) && t.size !== void 0;
  }), e._zod.onattach.push((o) => {
    const t = o._zod.bag.maximum ?? Number.POSITIVE_INFINITY;
    n.maximum < t && (o._zod.bag.maximum = n.maximum);
  }), e._zod.check = (o) => {
    const t = o.value;
    t.size <= n.maximum || o.issues.push({
      origin: ur(t),
      code: "too_big",
      maximum: n.maximum,
      inclusive: !0,
      input: t,
      inst: e,
      continue: !n.abort
    });
  };
}), Lu = /* @__PURE__ */ m("$ZodCheckMinSize", (e, n) => {
  var r;
  F.init(e, n), (r = e._zod.def).when ?? (r.when = (o) => {
    const t = o.value;
    return !Me(t) && t.size !== void 0;
  }), e._zod.onattach.push((o) => {
    const t = o._zod.bag.minimum ?? Number.NEGATIVE_INFINITY;
    n.minimum > t && (o._zod.bag.minimum = n.minimum);
  }), e._zod.check = (o) => {
    const t = o.value;
    t.size >= n.minimum || o.issues.push({
      origin: ur(t),
      code: "too_small",
      minimum: n.minimum,
      inclusive: !0,
      input: t,
      inst: e,
      continue: !n.abort
    });
  };
}), Ju = /* @__PURE__ */ m("$ZodCheckSizeEquals", (e, n) => {
  var r;
  F.init(e, n), (r = e._zod.def).when ?? (r.when = (o) => {
    const t = o.value;
    return !Me(t) && t.size !== void 0;
  }), e._zod.onattach.push((o) => {
    const t = o._zod.bag;
    t.minimum = n.size, t.maximum = n.size, t.size = n.size;
  }), e._zod.check = (o) => {
    const t = o.value, i = t.size;
    if (i === n.size)
      return;
    const a = i > n.size;
    o.issues.push({
      origin: ur(t),
      ...a ? { code: "too_big", maximum: n.size } : { code: "too_small", minimum: n.size },
      inclusive: !0,
      exact: !0,
      input: o.value,
      inst: e,
      continue: !n.abort
    });
  };
}), Mu = /* @__PURE__ */ m("$ZodCheckMaxLength", (e, n) => {
  var r;
  F.init(e, n), (r = e._zod.def).when ?? (r.when = (o) => {
    const t = o.value;
    return !Me(t) && t.length !== void 0;
  }), e._zod.onattach.push((o) => {
    const t = o._zod.bag.maximum ?? Number.POSITIVE_INFINITY;
    n.maximum < t && (o._zod.bag.maximum = n.maximum);
  }), e._zod.check = (o) => {
    const t = o.value;
    if (t.length <= n.maximum)
      return;
    const a = lr(t);
    o.issues.push({
      origin: a,
      code: "too_big",
      maximum: n.maximum,
      inclusive: !0,
      input: t,
      inst: e,
      continue: !n.abort
    });
  };
}), Bu = /* @__PURE__ */ m("$ZodCheckMinLength", (e, n) => {
  var r;
  F.init(e, n), (r = e._zod.def).when ?? (r.when = (o) => {
    const t = o.value;
    return !Me(t) && t.length !== void 0;
  }), e._zod.onattach.push((o) => {
    const t = o._zod.bag.minimum ?? Number.NEGATIVE_INFINITY;
    n.minimum > t && (o._zod.bag.minimum = n.minimum);
  }), e._zod.check = (o) => {
    const t = o.value;
    if (t.length >= n.minimum)
      return;
    const a = lr(t);
    o.issues.push({
      origin: a,
      code: "too_small",
      minimum: n.minimum,
      inclusive: !0,
      input: t,
      inst: e,
      continue: !n.abort
    });
  };
}), Vu = /* @__PURE__ */ m("$ZodCheckLengthEquals", (e, n) => {
  var r;
  F.init(e, n), (r = e._zod.def).when ?? (r.when = (o) => {
    const t = o.value;
    return !Me(t) && t.length !== void 0;
  }), e._zod.onattach.push((o) => {
    const t = o._zod.bag;
    t.minimum = n.length, t.maximum = n.length, t.length = n.length;
  }), e._zod.check = (o) => {
    const t = o.value, i = t.length;
    if (i === n.length)
      return;
    const a = lr(t), c = i > n.length;
    o.issues.push({
      origin: a,
      ...c ? { code: "too_big", maximum: n.length } : { code: "too_small", minimum: n.length },
      inclusive: !0,
      exact: !0,
      input: o.value,
      inst: e,
      continue: !n.abort
    });
  };
}), Bt = /* @__PURE__ */ m("$ZodCheckStringFormat", (e, n) => {
  var r, o;
  F.init(e, n), e._zod.onattach.push((t) => {
    const i = t._zod.bag;
    i.format = n.format, n.pattern && (i.patterns ?? (i.patterns = /* @__PURE__ */ new Set()), i.patterns.add(n.pattern));
  }), n.pattern ? (r = e._zod).check ?? (r.check = (t) => {
    n.pattern.lastIndex = 0, !n.pattern.test(t.value) && t.issues.push({
      origin: "string",
      code: "invalid_format",
      format: n.format,
      input: t.value,
      ...n.pattern ? { pattern: n.pattern.toString() } : {},
      inst: e,
      continue: !n.abort
    });
  }) : (o = e._zod).check ?? (o.check = () => {
  });
}), Gu = /* @__PURE__ */ m("$ZodCheckRegex", (e, n) => {
  Bt.init(e, n), e._zod.check = (r) => {
    n.pattern.lastIndex = 0, !n.pattern.test(r.value) && r.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "regex",
      input: r.value,
      pattern: n.pattern.toString(),
      inst: e,
      continue: !n.abort
    });
  };
}), Wu = /* @__PURE__ */ m("$ZodCheckLowerCase", (e, n) => {
  n.pattern ?? (n.pattern = Eu), Bt.init(e, n);
}), qu = /* @__PURE__ */ m("$ZodCheckUpperCase", (e, n) => {
  n.pattern ?? (n.pattern = Nu), Bt.init(e, n);
}), Ku = /* @__PURE__ */ m("$ZodCheckIncludes", (e, n) => {
  F.init(e, n);
  const r = we(n.includes), o = new RegExp(typeof n.position == "number" ? `^.{${n.position}}${r}` : r);
  n.pattern = o, e._zod.onattach.push((t) => {
    const i = t._zod.bag;
    i.patterns ?? (i.patterns = /* @__PURE__ */ new Set()), i.patterns.add(o);
  }), e._zod.check = (t) => {
    t.value.includes(n.includes, n.position) || t.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "includes",
      includes: n.includes,
      input: t.value,
      inst: e,
      continue: !n.abort
    });
  };
}), Xu = /* @__PURE__ */ m("$ZodCheckStartsWith", (e, n) => {
  F.init(e, n);
  const r = new RegExp(`^${we(n.prefix)}.*`);
  n.pattern ?? (n.pattern = r), e._zod.onattach.push((o) => {
    const t = o._zod.bag;
    t.patterns ?? (t.patterns = /* @__PURE__ */ new Set()), t.patterns.add(r);
  }), e._zod.check = (o) => {
    o.value.startsWith(n.prefix) || o.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "starts_with",
      prefix: n.prefix,
      input: o.value,
      inst: e,
      continue: !n.abort
    });
  };
}), Hu = /* @__PURE__ */ m("$ZodCheckEndsWith", (e, n) => {
  F.init(e, n);
  const r = new RegExp(`.*${we(n.suffix)}$`);
  n.pattern ?? (n.pattern = r), e._zod.onattach.push((o) => {
    const t = o._zod.bag;
    t.patterns ?? (t.patterns = /* @__PURE__ */ new Set()), t.patterns.add(r);
  }), e._zod.check = (o) => {
    o.value.endsWith(n.suffix) || o.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "ends_with",
      suffix: n.suffix,
      input: o.value,
      inst: e,
      continue: !n.abort
    });
  };
});
function Pc(e, n, r) {
  e.issues.length && n.issues.push(...me(r, e.issues));
}
const Yu = /* @__PURE__ */ m("$ZodCheckProperty", (e, n) => {
  F.init(e, n), e._zod.check = (r) => {
    const o = n.schema._zod.run({
      value: r.value[n.property],
      issues: []
    }, {});
    if (o instanceof Promise)
      return o.then((t) => Pc(t, r, n.property));
    Pc(o, r, n.property);
  };
}), Qu = /* @__PURE__ */ m("$ZodCheckMimeType", (e, n) => {
  F.init(e, n);
  const r = new Set(n.mime);
  e._zod.onattach.push((o) => {
    o._zod.bag.mime = n.mime;
  }), e._zod.check = (o) => {
    r.has(o.value.type) || o.issues.push({
      code: "invalid_value",
      values: n.mime,
      input: o.value.type,
      inst: e,
      continue: !n.abort
    });
  };
}), el = /* @__PURE__ */ m("$ZodCheckOverwrite", (e, n) => {
  F.init(e, n), e._zod.check = (r) => {
    r.value = n.tx(r.value);
  };
});
class tl {
  constructor(n = []) {
    this.content = [], this.indent = 0, this && (this.args = n);
  }
  indented(n) {
    this.indent += 1, n(this), this.indent -= 1;
  }
  write(n) {
    if (typeof n == "function") {
      n(this, { execution: "sync" }), n(this, { execution: "async" });
      return;
    }
    const o = n.split(`
`).filter((a) => a), t = Math.min(...o.map((a) => a.length - a.trimStart().length)), i = o.map((a) => a.slice(t)).map((a) => " ".repeat(this.indent * 2) + a);
    for (const a of i)
      this.content.push(a);
  }
  compile() {
    const n = Function, r = this?.args, t = [...(this?.content ?? [""]).map((i) => `  ${i}`)];
    return new n(...r, t.join(`
`));
  }
}
const nl = {
  major: 4,
  minor: 3,
  patch: 6
}, O = /* @__PURE__ */ m("$ZodType", (e, n) => {
  var r;
  e ?? (e = {}), e._zod.def = n, e._zod.bag = e._zod.bag || {}, e._zod.version = nl;
  const o = [...e._zod.def.checks ?? []];
  e._zod.traits.has("$ZodCheck") && o.unshift(e);
  for (const t of o)
    for (const i of t._zod.onattach)
      i(e);
  if (o.length === 0)
    (r = e._zod).deferred ?? (r.deferred = []), e._zod.deferred?.push(() => {
      e._zod.run = e._zod.parse;
    });
  else {
    const t = (a, c, u) => {
      let s = Ae(a), l;
      for (const d of c) {
        if (d._zod.def.when) {
          if (!d._zod.def.when(a))
            continue;
        } else if (s)
          continue;
        const g = a.issues.length, h = d._zod.check(a);
        if (h instanceof Promise && u?.async === !1)
          throw new Re();
        if (l || h instanceof Promise)
          l = (l ?? Promise.resolve()).then(async () => {
            await h, a.issues.length !== g && (s || (s = Ae(a, g)));
          });
        else {
          if (a.issues.length === g)
            continue;
          s || (s = Ae(a, g));
        }
      }
      return l ? l.then(() => a) : a;
    }, i = (a, c, u) => {
      if (Ae(a))
        return a.aborted = !0, a;
      const s = t(c, o, u);
      if (s instanceof Promise) {
        if (u.async === !1)
          throw new Re();
        return s.then((l) => e._zod.parse(l, u));
      }
      return e._zod.parse(s, u);
    };
    e._zod.run = (a, c) => {
      if (c.skipChecks)
        return e._zod.parse(a, c);
      if (c.direction === "backward") {
        const s = e._zod.parse({ value: a.value, issues: [] }, { ...c, skipChecks: !0 });
        return s instanceof Promise ? s.then((l) => i(l, a, c)) : i(s, a, c);
      }
      const u = e._zod.parse(a, c);
      if (u instanceof Promise) {
        if (c.async === !1)
          throw new Re();
        return u.then((s) => t(s, o, c));
      }
      return t(u, o, c);
    };
  }
  D(e, "~standard", () => ({
    validate: (t) => {
      try {
        const i = eu(e, t);
        return i.success ? { value: i.data } : { issues: i.error?.issues };
      } catch {
        return tu(e, t).then((a) => a.success ? { value: a.data } : { issues: a.error?.issues });
      }
    },
    vendor: "zod",
    version: 1
  }));
}), Vt = /* @__PURE__ */ m("$ZodString", (e, n) => {
  O.init(e, n), e._zod.pattern = [...e?._zod.bag?.patterns ?? []].pop() ?? Iu(e._zod.bag), e._zod.parse = (r, o) => {
    if (n.coerce)
      try {
        r.value = String(r.value);
      } catch {
      }
    return typeof r.value == "string" || r.issues.push({
      expected: "string",
      code: "invalid_type",
      input: r.value,
      inst: e
    }), r;
  };
}), C = /* @__PURE__ */ m("$ZodStringFormat", (e, n) => {
  Bt.init(e, n), Vt.init(e, n);
}), rl = /* @__PURE__ */ m("$ZodGUID", (e, n) => {
  n.pattern ?? (n.pattern = uu), C.init(e, n);
}), il = /* @__PURE__ */ m("$ZodUUID", (e, n) => {
  if (n.version) {
    const o = {
      v1: 1,
      v2: 2,
      v3: 3,
      v4: 4,
      v5: 5,
      v6: 6,
      v7: 7,
      v8: 8
    }[n.version];
    if (o === void 0)
      throw new Error(`Invalid UUID version: "${n.version}"`);
    n.pattern ?? (n.pattern = He(o));
  } else
    n.pattern ?? (n.pattern = He());
  C.init(e, n);
}), ol = /* @__PURE__ */ m("$ZodEmail", (e, n) => {
  n.pattern ?? (n.pattern = lu), C.init(e, n);
}), al = /* @__PURE__ */ m("$ZodURL", (e, n) => {
  C.init(e, n), e._zod.check = (r) => {
    try {
      const o = r.value.trim(), t = new URL(o);
      n.hostname && (n.hostname.lastIndex = 0, n.hostname.test(t.hostname) || r.issues.push({
        code: "invalid_format",
        format: "url",
        note: "Invalid hostname",
        pattern: n.hostname.source,
        input: r.value,
        inst: e,
        continue: !n.abort
      })), n.protocol && (n.protocol.lastIndex = 0, n.protocol.test(t.protocol.endsWith(":") ? t.protocol.slice(0, -1) : t.protocol) || r.issues.push({
        code: "invalid_format",
        format: "url",
        note: "Invalid protocol",
        pattern: n.protocol.source,
        input: r.value,
        inst: e,
        continue: !n.abort
      })), n.normalize ? r.value = t.href : r.value = o;
      return;
    } catch {
      r.issues.push({
        code: "invalid_format",
        format: "url",
        input: r.value,
        inst: e,
        continue: !n.abort
      });
    }
  };
}), cl = /* @__PURE__ */ m("$ZodEmoji", (e, n) => {
  n.pattern ?? (n.pattern = mu()), C.init(e, n);
}), sl = /* @__PURE__ */ m("$ZodNanoID", (e, n) => {
  n.pattern ?? (n.pattern = cu), C.init(e, n);
}), ul = /* @__PURE__ */ m("$ZodCUID", (e, n) => {
  n.pattern ?? (n.pattern = nu), C.init(e, n);
}), ll = /* @__PURE__ */ m("$ZodCUID2", (e, n) => {
  n.pattern ?? (n.pattern = ru), C.init(e, n);
}), dl = /* @__PURE__ */ m("$ZodULID", (e, n) => {
  n.pattern ?? (n.pattern = iu), C.init(e, n);
}), ml = /* @__PURE__ */ m("$ZodXID", (e, n) => {
  n.pattern ?? (n.pattern = ou), C.init(e, n);
}), fl = /* @__PURE__ */ m("$ZodKSUID", (e, n) => {
  n.pattern ?? (n.pattern = au), C.init(e, n);
}), pl = /* @__PURE__ */ m("$ZodISODateTime", (e, n) => {
  n.pattern ?? (n.pattern = zu(n)), C.init(e, n);
}), gl = /* @__PURE__ */ m("$ZodISODate", (e, n) => {
  n.pattern ?? (n.pattern = wu), C.init(e, n);
}), vl = /* @__PURE__ */ m("$ZodISOTime", (e, n) => {
  n.pattern ?? (n.pattern = xu(n)), C.init(e, n);
}), hl = /* @__PURE__ */ m("$ZodISODuration", (e, n) => {
  n.pattern ?? (n.pattern = su), C.init(e, n);
}), bl = /* @__PURE__ */ m("$ZodIPv4", (e, n) => {
  n.pattern ?? (n.pattern = fu), C.init(e, n), e._zod.bag.format = "ipv4";
}), $l = /* @__PURE__ */ m("$ZodIPv6", (e, n) => {
  n.pattern ?? (n.pattern = pu), C.init(e, n), e._zod.bag.format = "ipv6", e._zod.check = (r) => {
    try {
      new URL(`http://[${r.value}]`);
    } catch {
      r.issues.push({
        code: "invalid_format",
        format: "ipv6",
        input: r.value,
        inst: e,
        continue: !n.abort
      });
    }
  };
}), yl = /* @__PURE__ */ m("$ZodMAC", (e, n) => {
  n.pattern ?? (n.pattern = gu(n.delimiter)), C.init(e, n), e._zod.bag.format = "mac";
}), _l = /* @__PURE__ */ m("$ZodCIDRv4", (e, n) => {
  n.pattern ?? (n.pattern = vu), C.init(e, n);
}), kl = /* @__PURE__ */ m("$ZodCIDRv6", (e, n) => {
  n.pattern ?? (n.pattern = hu), C.init(e, n), e._zod.check = (r) => {
    const o = r.value.split("/");
    try {
      if (o.length !== 2)
        throw new Error();
      const [t, i] = o;
      if (!i)
        throw new Error();
      const a = Number(i);
      if (`${a}` !== i)
        throw new Error();
      if (a < 0 || a > 128)
        throw new Error();
      new URL(`http://[${t}]`);
    } catch {
      r.issues.push({
        code: "invalid_format",
        format: "cidrv6",
        input: r.value,
        inst: e,
        continue: !n.abort
      });
    }
  };
});
function io(e) {
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
const wl = /* @__PURE__ */ m("$ZodBase64", (e, n) => {
  n.pattern ?? (n.pattern = bu), C.init(e, n), e._zod.bag.contentEncoding = "base64", e._zod.check = (r) => {
    io(r.value) || r.issues.push({
      code: "invalid_format",
      format: "base64",
      input: r.value,
      inst: e,
      continue: !n.abort
    });
  };
});
function Sl(e) {
  if (!eo.test(e))
    return !1;
  const n = e.replace(/[-_]/g, (o) => o === "-" ? "+" : "/"), r = n.padEnd(Math.ceil(n.length / 4) * 4, "=");
  return io(r);
}
const xl = /* @__PURE__ */ m("$ZodBase64URL", (e, n) => {
  n.pattern ?? (n.pattern = eo), C.init(e, n), e._zod.bag.contentEncoding = "base64url", e._zod.check = (r) => {
    Sl(r.value) || r.issues.push({
      code: "invalid_format",
      format: "base64url",
      input: r.value,
      inst: e,
      continue: !n.abort
    });
  };
}), zl = /* @__PURE__ */ m("$ZodE164", (e, n) => {
  n.pattern ?? (n.pattern = _u), C.init(e, n);
});
function Il(e, n = null) {
  try {
    const r = e.split(".");
    if (r.length !== 3)
      return !1;
    const [o] = r;
    if (!o)
      return !1;
    const t = JSON.parse(atob(o));
    return !("typ" in t && t?.typ !== "JWT" || !t.alg || n && (!("alg" in t) || t.alg !== n));
  } catch {
    return !1;
  }
}
const Ol = /* @__PURE__ */ m("$ZodJWT", (e, n) => {
  C.init(e, n), e._zod.check = (r) => {
    Il(r.value, n.alg) || r.issues.push({
      code: "invalid_format",
      format: "jwt",
      input: r.value,
      inst: e,
      continue: !n.abort
    });
  };
}), Ul = /* @__PURE__ */ m("$ZodCustomStringFormat", (e, n) => {
  C.init(e, n), e._zod.check = (r) => {
    n.fn(r.value) || r.issues.push({
      code: "invalid_format",
      format: n.format,
      input: r.value,
      inst: e,
      continue: !n.abort
    });
  };
}), oo = /* @__PURE__ */ m("$ZodNumber", (e, n) => {
  O.init(e, n), e._zod.pattern = e._zod.bag.pattern ?? to, e._zod.parse = (r, o) => {
    if (n.coerce)
      try {
        r.value = Number(r.value);
      } catch {
      }
    const t = r.value;
    if (typeof t == "number" && !Number.isNaN(t) && Number.isFinite(t))
      return r;
    const i = typeof t == "number" ? Number.isNaN(t) ? "NaN" : Number.isFinite(t) ? void 0 : "Infinity" : void 0;
    return r.issues.push({
      expected: "number",
      code: "invalid_type",
      input: t,
      inst: e,
      ...i ? { received: i } : {}
    }), r;
  };
}), jl = /* @__PURE__ */ m("$ZodNumberFormat", (e, n) => {
  Ru.init(e, n), oo.init(e, n);
}), ao = /* @__PURE__ */ m("$ZodBoolean", (e, n) => {
  O.init(e, n), e._zod.pattern = ju, e._zod.parse = (r, o) => {
    if (n.coerce)
      try {
        r.value = !!r.value;
      } catch {
      }
    const t = r.value;
    return typeof t == "boolean" || r.issues.push({
      expected: "boolean",
      code: "invalid_type",
      input: t,
      inst: e
    }), r;
  };
}), co = /* @__PURE__ */ m("$ZodBigInt", (e, n) => {
  O.init(e, n), e._zod.pattern = Ou, e._zod.parse = (r, o) => {
    if (n.coerce)
      try {
        r.value = BigInt(r.value);
      } catch {
      }
    return typeof r.value == "bigint" || r.issues.push({
      expected: "bigint",
      code: "invalid_type",
      input: r.value,
      inst: e
    }), r;
  };
}), Dl = /* @__PURE__ */ m("$ZodBigIntFormat", (e, n) => {
  Cu.init(e, n), co.init(e, n);
}), Tl = /* @__PURE__ */ m("$ZodSymbol", (e, n) => {
  O.init(e, n), e._zod.parse = (r, o) => {
    const t = r.value;
    return typeof t == "symbol" || r.issues.push({
      expected: "symbol",
      code: "invalid_type",
      input: t,
      inst: e
    }), r;
  };
}), El = /* @__PURE__ */ m("$ZodUndefined", (e, n) => {
  O.init(e, n), e._zod.pattern = Tu, e._zod.values = /* @__PURE__ */ new Set([void 0]), e._zod.optin = "optional", e._zod.optout = "optional", e._zod.parse = (r, o) => {
    const t = r.value;
    return typeof t > "u" || r.issues.push({
      expected: "undefined",
      code: "invalid_type",
      input: t,
      inst: e
    }), r;
  };
}), Nl = /* @__PURE__ */ m("$ZodNull", (e, n) => {
  O.init(e, n), e._zod.pattern = Du, e._zod.values = /* @__PURE__ */ new Set([null]), e._zod.parse = (r, o) => {
    const t = r.value;
    return t === null || r.issues.push({
      expected: "null",
      code: "invalid_type",
      input: t,
      inst: e
    }), r;
  };
}), Pl = /* @__PURE__ */ m("$ZodAny", (e, n) => {
  O.init(e, n), e._zod.parse = (r) => r;
}), Al = /* @__PURE__ */ m("$ZodUnknown", (e, n) => {
  O.init(e, n), e._zod.parse = (r) => r;
}), Zl = /* @__PURE__ */ m("$ZodNever", (e, n) => {
  O.init(e, n), e._zod.parse = (r, o) => (r.issues.push({
    expected: "never",
    code: "invalid_type",
    input: r.value,
    inst: e
  }), r);
}), Rl = /* @__PURE__ */ m("$ZodVoid", (e, n) => {
  O.init(e, n), e._zod.parse = (r, o) => {
    const t = r.value;
    return typeof t > "u" || r.issues.push({
      expected: "void",
      code: "invalid_type",
      input: t,
      inst: e
    }), r;
  };
}), Cl = /* @__PURE__ */ m("$ZodDate", (e, n) => {
  O.init(e, n), e._zod.parse = (r, o) => {
    if (n.coerce)
      try {
        r.value = new Date(r.value);
      } catch {
      }
    const t = r.value, i = t instanceof Date;
    return i && !Number.isNaN(t.getTime()) || r.issues.push({
      expected: "date",
      code: "invalid_type",
      input: t,
      ...i ? { received: "Invalid Date" } : {},
      inst: e
    }), r;
  };
});
function Ac(e, n, r) {
  e.issues.length && n.issues.push(...me(r, e.issues)), n.value[r] = e.value;
}
const Fl = /* @__PURE__ */ m("$ZodArray", (e, n) => {
  O.init(e, n), e._zod.parse = (r, o) => {
    const t = r.value;
    if (!Array.isArray(t))
      return r.issues.push({
        expected: "array",
        code: "invalid_type",
        input: t,
        inst: e
      }), r;
    r.value = Array(t.length);
    const i = [];
    for (let a = 0; a < t.length; a++) {
      const c = t[a], u = n.element._zod.run({
        value: c,
        issues: []
      }, o);
      u instanceof Promise ? i.push(u.then((s) => Ac(s, r, a))) : Ac(u, r, a);
    }
    return i.length ? Promise.all(i).then(() => r) : r;
  };
});
function Yn(e, n, r, o, t) {
  if (e.issues.length) {
    if (t && !(r in o))
      return;
    n.issues.push(...me(r, e.issues));
  }
  e.value === void 0 ? r in o && (n.value[r] = void 0) : n.value[r] = e.value;
}
function Ll(e) {
  const n = Object.keys(e.shape);
  for (const o of n)
    if (!e.shape?.[o]?._zod?.traits?.has("$ZodType"))
      throw new Error(`Invalid element at key "${o}": expected a Zod schema`);
  const r = Fs(e.shape);
  return {
    ...e,
    keys: n,
    keySet: new Set(n),
    numKeys: n.length,
    optionalKeys: new Set(r)
  };
}
function Jl(e, n, r, o, t, i) {
  const a = [], c = t.keySet, u = t.catchall._zod, s = u.def.type, l = u.optout === "optional";
  for (const d in n) {
    if (c.has(d))
      continue;
    if (s === "never") {
      a.push(d);
      continue;
    }
    const g = u.run({ value: n[d], issues: [] }, o);
    g instanceof Promise ? e.push(g.then((h) => Yn(h, r, d, n, l))) : Yn(g, r, d, n, l);
  }
  return a.length && r.issues.push({
    code: "unrecognized_keys",
    keys: a,
    input: n,
    inst: i
  }), e.length ? Promise.all(e).then(() => r) : r;
}
const Ml = /* @__PURE__ */ m("$ZodObject", (e, n) => {
  if (O.init(e, n), !Object.getOwnPropertyDescriptor(n, "shape")?.get) {
    const c = n.shape;
    Object.defineProperty(n, "shape", {
      get: () => {
        const u = { ...c };
        return Object.defineProperty(n, "shape", {
          value: u
        }), u;
      }
    });
  }
  const o = Zt(() => Ll(n));
  D(e._zod, "propValues", () => {
    const c = n.shape, u = {};
    for (const s in c) {
      const l = c[s]._zod;
      if (l.values) {
        u[s] ?? (u[s] = /* @__PURE__ */ new Set());
        for (const d of l.values)
          u[s].add(d);
      }
    }
    return u;
  });
  const t = Ke, i = n.catchall;
  let a;
  e._zod.parse = (c, u) => {
    a ?? (a = o.value);
    const s = c.value;
    if (!t(s))
      return c.issues.push({
        expected: "object",
        code: "invalid_type",
        input: s,
        inst: e
      }), c;
    c.value = {};
    const l = [], d = a.shape;
    for (const g of a.keys) {
      const h = d[g], p = h._zod.optout === "optional", $ = h._zod.run({ value: s[g], issues: [] }, u);
      $ instanceof Promise ? l.push($.then((y) => Yn(y, c, g, s, p))) : Yn($, c, g, s, p);
    }
    return i ? Jl(l, s, c, u, o.value, e) : l.length ? Promise.all(l).then(() => c) : c;
  };
}), Bl = /* @__PURE__ */ m("$ZodObjectJIT", (e, n) => {
  Ml.init(e, n);
  const r = e._zod.parse, o = Zt(() => Ll(n)), t = (g) => {
    const h = new tl(["shape", "payload", "ctx"]), p = o.value, $ = (N) => {
      const E = Oi(N);
      return `shape[${E}]._zod.run({ value: input[${E}], issues: [] }, ctx)`;
    };
    h.write("const input = payload.value;");
    const y = /* @__PURE__ */ Object.create(null);
    let A = 0;
    for (const N of p.keys)
      y[N] = `key_${A++}`;
    h.write("const newResult = {};");
    for (const N of p.keys) {
      const E = y[N], P = Oi(N), J = g[N]?._zod?.optout === "optional";
      h.write(`const ${E} = ${$(N)};`), J ? h.write(`
        if (${E}.issues.length) {
          if (${P} in input) {
            payload.issues = payload.issues.concat(${E}.issues.map(iss => ({
              ...iss,
              path: iss.path ? [${P}, ...iss.path] : [${P}]
            })));
          }
        }
        
        if (${E}.value === undefined) {
          if (${P} in input) {
            newResult[${P}] = undefined;
          }
        } else {
          newResult[${P}] = ${E}.value;
        }
        
      `) : h.write(`
        if (${E}.issues.length) {
          payload.issues = payload.issues.concat(${E}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${P}, ...iss.path] : [${P}]
          })));
        }
        
        if (${E}.value === undefined) {
          if (${P} in input) {
            newResult[${P}] = undefined;
          }
        } else {
          newResult[${P}] = ${E}.value;
        }
        
      `);
    }
    h.write("payload.value = newResult;"), h.write("return payload;");
    const B = h.compile();
    return (N, E) => B(g, N, E);
  };
  let i;
  const a = Ke, c = !Kn.jitless, s = c && Rs.value, l = n.catchall;
  let d;
  e._zod.parse = (g, h) => {
    d ?? (d = o.value);
    const p = g.value;
    return a(p) ? c && s && h?.async === !1 && h.jitless !== !0 ? (i || (i = t(n.shape)), g = i(g, h), l ? Jl([], p, g, h, d, e) : g) : r(g, h) : (g.issues.push({
      expected: "object",
      code: "invalid_type",
      input: p,
      inst: e
    }), g);
  };
});
function Zc(e, n, r, o) {
  for (const i of e)
    if (i.issues.length === 0)
      return n.value = i.value, n;
  const t = e.filter((i) => !Ae(i));
  return t.length === 1 ? (n.value = t[0].value, t[0]) : (n.issues.push({
    code: "invalid_union",
    input: n.value,
    inst: r,
    errors: e.map((i) => i.issues.map((a) => ue(a, o, K())))
  }), n);
}
const pr = /* @__PURE__ */ m("$ZodUnion", (e, n) => {
  O.init(e, n), D(e._zod, "optin", () => n.options.some((t) => t._zod.optin === "optional") ? "optional" : void 0), D(e._zod, "optout", () => n.options.some((t) => t._zod.optout === "optional") ? "optional" : void 0), D(e._zod, "values", () => {
    if (n.options.every((t) => t._zod.values))
      return new Set(n.options.flatMap((t) => Array.from(t._zod.values)));
  }), D(e._zod, "pattern", () => {
    if (n.options.every((t) => t._zod.pattern)) {
      const t = n.options.map((i) => i._zod.pattern);
      return new RegExp(`^(${t.map((i) => cr(i.source)).join("|")})$`);
    }
  });
  const r = n.options.length === 1, o = n.options[0]._zod.run;
  e._zod.parse = (t, i) => {
    if (r)
      return o(t, i);
    let a = !1;
    const c = [];
    for (const u of n.options) {
      const s = u._zod.run({
        value: t.value,
        issues: []
      }, i);
      if (s instanceof Promise)
        c.push(s), a = !0;
      else {
        if (s.issues.length === 0)
          return s;
        c.push(s);
      }
    }
    return a ? Promise.all(c).then((u) => Zc(u, t, e, i)) : Zc(c, t, e, i);
  };
});
function Rc(e, n, r, o) {
  const t = e.filter((i) => i.issues.length === 0);
  return t.length === 1 ? (n.value = t[0].value, n) : (t.length === 0 ? n.issues.push({
    code: "invalid_union",
    input: n.value,
    inst: r,
    errors: e.map((i) => i.issues.map((a) => ue(a, o, K())))
  }) : n.issues.push({
    code: "invalid_union",
    input: n.value,
    inst: r,
    errors: [],
    inclusive: !1
  }), n);
}
const Vl = /* @__PURE__ */ m("$ZodXor", (e, n) => {
  pr.init(e, n), n.inclusive = !1;
  const r = n.options.length === 1, o = n.options[0]._zod.run;
  e._zod.parse = (t, i) => {
    if (r)
      return o(t, i);
    let a = !1;
    const c = [];
    for (const u of n.options) {
      const s = u._zod.run({
        value: t.value,
        issues: []
      }, i);
      s instanceof Promise ? (c.push(s), a = !0) : c.push(s);
    }
    return a ? Promise.all(c).then((u) => Rc(u, t, e, i)) : Rc(c, t, e, i);
  };
}), Gl = /* @__PURE__ */ m("$ZodDiscriminatedUnion", (e, n) => {
  n.inclusive = !1, pr.init(e, n);
  const r = e._zod.parse;
  D(e._zod, "propValues", () => {
    const t = {};
    for (const i of n.options) {
      const a = i._zod.propValues;
      if (!a || Object.keys(a).length === 0)
        throw new Error(`Invalid discriminated union option at index "${n.options.indexOf(i)}"`);
      for (const [c, u] of Object.entries(a)) {
        t[c] || (t[c] = /* @__PURE__ */ new Set());
        for (const s of u)
          t[c].add(s);
      }
    }
    return t;
  });
  const o = Zt(() => {
    const t = n.options, i = /* @__PURE__ */ new Map();
    for (const a of t) {
      const c = a._zod.propValues?.[n.discriminator];
      if (!c || c.size === 0)
        throw new Error(`Invalid discriminated union option at index "${n.options.indexOf(a)}"`);
      for (const u of c) {
        if (i.has(u))
          throw new Error(`Duplicate discriminator value "${String(u)}"`);
        i.set(u, a);
      }
    }
    return i;
  });
  e._zod.parse = (t, i) => {
    const a = t.value;
    if (!Ke(a))
      return t.issues.push({
        code: "invalid_type",
        expected: "object",
        input: a,
        inst: e
      }), t;
    const c = o.value.get(a?.[n.discriminator]);
    return c ? c._zod.run(t, i) : n.unionFallback ? r(t, i) : (t.issues.push({
      code: "invalid_union",
      errors: [],
      note: "No matching discriminator",
      discriminator: n.discriminator,
      input: a,
      path: [n.discriminator],
      inst: e
    }), t);
  };
}), Wl = /* @__PURE__ */ m("$ZodIntersection", (e, n) => {
  O.init(e, n), e._zod.parse = (r, o) => {
    const t = r.value, i = n.left._zod.run({ value: t, issues: [] }, o), a = n.right._zod.run({ value: t, issues: [] }, o);
    return i instanceof Promise || a instanceof Promise ? Promise.all([i, a]).then(([u, s]) => Cc(r, u, s)) : Cc(r, i, a);
  };
});
function Di(e, n) {
  if (e === n)
    return { valid: !0, data: e };
  if (e instanceof Date && n instanceof Date && +e == +n)
    return { valid: !0, data: e };
  if (Fe(e) && Fe(n)) {
    const r = Object.keys(n), o = Object.keys(e).filter((i) => r.indexOf(i) !== -1), t = { ...e, ...n };
    for (const i of o) {
      const a = Di(e[i], n[i]);
      if (!a.valid)
        return {
          valid: !1,
          mergeErrorPath: [i, ...a.mergeErrorPath]
        };
      t[i] = a.data;
    }
    return { valid: !0, data: t };
  }
  if (Array.isArray(e) && Array.isArray(n)) {
    if (e.length !== n.length)
      return { valid: !1, mergeErrorPath: [] };
    const r = [];
    for (let o = 0; o < e.length; o++) {
      const t = e[o], i = n[o], a = Di(t, i);
      if (!a.valid)
        return {
          valid: !1,
          mergeErrorPath: [o, ...a.mergeErrorPath]
        };
      r.push(a.data);
    }
    return { valid: !0, data: r };
  }
  return { valid: !1, mergeErrorPath: [] };
}
function Cc(e, n, r) {
  const o = /* @__PURE__ */ new Map();
  let t;
  for (const c of n.issues)
    if (c.code === "unrecognized_keys") {
      t ?? (t = c);
      for (const u of c.keys)
        o.has(u) || o.set(u, {}), o.get(u).l = !0;
    } else
      e.issues.push(c);
  for (const c of r.issues)
    if (c.code === "unrecognized_keys")
      for (const u of c.keys)
        o.has(u) || o.set(u, {}), o.get(u).r = !0;
    else
      e.issues.push(c);
  const i = [...o].filter(([, c]) => c.l && c.r).map(([c]) => c);
  if (i.length && t && e.issues.push({ ...t, keys: i }), Ae(e))
    return e;
  const a = Di(n.value, r.value);
  if (!a.valid)
    throw new Error(`Unmergable intersection. Error path: ${JSON.stringify(a.mergeErrorPath)}`);
  return e.value = a.data, e;
}
const so = /* @__PURE__ */ m("$ZodTuple", (e, n) => {
  O.init(e, n);
  const r = n.items;
  e._zod.parse = (o, t) => {
    const i = o.value;
    if (!Array.isArray(i))
      return o.issues.push({
        input: i,
        inst: e,
        expected: "tuple",
        code: "invalid_type"
      }), o;
    o.value = [];
    const a = [], c = [...r].reverse().findIndex((l) => l._zod.optin !== "optional"), u = c === -1 ? 0 : r.length - c;
    if (!n.rest) {
      const l = i.length > r.length, d = i.length < u - 1;
      if (l || d)
        return o.issues.push({
          ...l ? { code: "too_big", maximum: r.length, inclusive: !0 } : { code: "too_small", minimum: r.length },
          input: i,
          inst: e,
          origin: "array"
        }), o;
    }
    let s = -1;
    for (const l of r) {
      if (s++, s >= i.length && s >= u)
        continue;
      const d = l._zod.run({
        value: i[s],
        issues: []
      }, t);
      d instanceof Promise ? a.push(d.then((g) => Fn(g, o, s))) : Fn(d, o, s);
    }
    if (n.rest) {
      const l = i.slice(r.length);
      for (const d of l) {
        s++;
        const g = n.rest._zod.run({
          value: d,
          issues: []
        }, t);
        g instanceof Promise ? a.push(g.then((h) => Fn(h, o, s))) : Fn(g, o, s);
      }
    }
    return a.length ? Promise.all(a).then(() => o) : o;
  };
});
function Fn(e, n, r) {
  e.issues.length && n.issues.push(...me(r, e.issues)), n.value[r] = e.value;
}
const ql = /* @__PURE__ */ m("$ZodRecord", (e, n) => {
  O.init(e, n), e._zod.parse = (r, o) => {
    const t = r.value;
    if (!Fe(t))
      return r.issues.push({
        expected: "record",
        code: "invalid_type",
        input: t,
        inst: e
      }), r;
    const i = [], a = n.keyType._zod.values;
    if (a) {
      r.value = {};
      const c = /* @__PURE__ */ new Set();
      for (const s of a)
        if (typeof s == "string" || typeof s == "number" || typeof s == "symbol") {
          c.add(typeof s == "number" ? s.toString() : s);
          const l = n.valueType._zod.run({ value: t[s], issues: [] }, o);
          l instanceof Promise ? i.push(l.then((d) => {
            d.issues.length && r.issues.push(...me(s, d.issues)), r.value[s] = d.value;
          })) : (l.issues.length && r.issues.push(...me(s, l.issues)), r.value[s] = l.value);
        }
      let u;
      for (const s in t)
        c.has(s) || (u = u ?? [], u.push(s));
      u && u.length > 0 && r.issues.push({
        code: "unrecognized_keys",
        input: t,
        inst: e,
        keys: u
      });
    } else {
      r.value = {};
      for (const c of Reflect.ownKeys(t)) {
        if (c === "__proto__")
          continue;
        let u = n.keyType._zod.run({ value: c, issues: [] }, o);
        if (u instanceof Promise)
          throw new Error("Async schemas not supported in object keys currently");
        if (typeof c == "string" && to.test(c) && u.issues.length) {
          const d = n.keyType._zod.run({ value: Number(c), issues: [] }, o);
          if (d instanceof Promise)
            throw new Error("Async schemas not supported in object keys currently");
          d.issues.length === 0 && (u = d);
        }
        if (u.issues.length) {
          n.mode === "loose" ? r.value[c] = t[c] : r.issues.push({
            code: "invalid_key",
            origin: "record",
            issues: u.issues.map((d) => ue(d, o, K())),
            input: c,
            path: [c],
            inst: e
          });
          continue;
        }
        const l = n.valueType._zod.run({ value: t[c], issues: [] }, o);
        l instanceof Promise ? i.push(l.then((d) => {
          d.issues.length && r.issues.push(...me(c, d.issues)), r.value[u.value] = d.value;
        })) : (l.issues.length && r.issues.push(...me(c, l.issues)), r.value[u.value] = l.value);
      }
    }
    return i.length ? Promise.all(i).then(() => r) : r;
  };
}), Kl = /* @__PURE__ */ m("$ZodMap", (e, n) => {
  O.init(e, n), e._zod.parse = (r, o) => {
    const t = r.value;
    if (!(t instanceof Map))
      return r.issues.push({
        expected: "map",
        code: "invalid_type",
        input: t,
        inst: e
      }), r;
    const i = [];
    r.value = /* @__PURE__ */ new Map();
    for (const [a, c] of t) {
      const u = n.keyType._zod.run({ value: a, issues: [] }, o), s = n.valueType._zod.run({ value: c, issues: [] }, o);
      u instanceof Promise || s instanceof Promise ? i.push(Promise.all([u, s]).then(([l, d]) => {
        Fc(l, d, r, a, t, e, o);
      })) : Fc(u, s, r, a, t, e, o);
    }
    return i.length ? Promise.all(i).then(() => r) : r;
  };
});
function Fc(e, n, r, o, t, i, a) {
  e.issues.length && (Hn.has(typeof o) ? r.issues.push(...me(o, e.issues)) : r.issues.push({
    code: "invalid_key",
    origin: "map",
    input: t,
    inst: i,
    issues: e.issues.map((c) => ue(c, a, K()))
  })), n.issues.length && (Hn.has(typeof o) ? r.issues.push(...me(o, n.issues)) : r.issues.push({
    origin: "map",
    code: "invalid_element",
    input: t,
    inst: i,
    key: o,
    issues: n.issues.map((c) => ue(c, a, K()))
  })), r.value.set(e.value, n.value);
}
const Xl = /* @__PURE__ */ m("$ZodSet", (e, n) => {
  O.init(e, n), e._zod.parse = (r, o) => {
    const t = r.value;
    if (!(t instanceof Set))
      return r.issues.push({
        input: t,
        inst: e,
        expected: "set",
        code: "invalid_type"
      }), r;
    const i = [];
    r.value = /* @__PURE__ */ new Set();
    for (const a of t) {
      const c = n.valueType._zod.run({ value: a, issues: [] }, o);
      c instanceof Promise ? i.push(c.then((u) => Lc(u, r))) : Lc(c, r);
    }
    return i.length ? Promise.all(i).then(() => r) : r;
  };
});
function Lc(e, n) {
  e.issues.length && n.issues.push(...e.issues), n.value.add(e.value);
}
const Hl = /* @__PURE__ */ m("$ZodEnum", (e, n) => {
  O.init(e, n);
  const r = Fi(n.entries), o = new Set(r);
  e._zod.values = o, e._zod.pattern = new RegExp(`^(${r.filter((t) => Hn.has(typeof t)).map((t) => typeof t == "string" ? we(t) : t.toString()).join("|")})$`), e._zod.parse = (t, i) => {
    const a = t.value;
    return o.has(a) || t.issues.push({
      code: "invalid_value",
      values: r,
      input: a,
      inst: e
    }), t;
  };
}), Yl = /* @__PURE__ */ m("$ZodLiteral", (e, n) => {
  if (O.init(e, n), n.values.length === 0)
    throw new Error("Cannot create literal schema with no valid values");
  const r = new Set(n.values);
  e._zod.values = r, e._zod.pattern = new RegExp(`^(${n.values.map((o) => typeof o == "string" ? we(o) : o ? we(o.toString()) : String(o)).join("|")})$`), e._zod.parse = (o, t) => {
    const i = o.value;
    return r.has(i) || o.issues.push({
      code: "invalid_value",
      values: n.values,
      input: i,
      inst: e
    }), o;
  };
}), Ql = /* @__PURE__ */ m("$ZodFile", (e, n) => {
  O.init(e, n), e._zod.parse = (r, o) => {
    const t = r.value;
    return t instanceof File || r.issues.push({
      expected: "file",
      code: "invalid_type",
      input: t,
      inst: e
    }), r;
  };
}), ed = /* @__PURE__ */ m("$ZodTransform", (e, n) => {
  O.init(e, n), e._zod.parse = (r, o) => {
    if (o.direction === "backward")
      throw new ar(e.constructor.name);
    const t = n.transform(r.value, r);
    if (o.async)
      return (t instanceof Promise ? t : Promise.resolve(t)).then((a) => (r.value = a, r));
    if (t instanceof Promise)
      throw new Re();
    return r.value = t, r;
  };
});
function Jc(e, n) {
  return e.issues.length && n === void 0 ? { issues: [], value: void 0 } : e;
}
const uo = /* @__PURE__ */ m("$ZodOptional", (e, n) => {
  O.init(e, n), e._zod.optin = "optional", e._zod.optout = "optional", D(e._zod, "values", () => n.innerType._zod.values ? /* @__PURE__ */ new Set([...n.innerType._zod.values, void 0]) : void 0), D(e._zod, "pattern", () => {
    const r = n.innerType._zod.pattern;
    return r ? new RegExp(`^(${cr(r.source)})?$`) : void 0;
  }), e._zod.parse = (r, o) => {
    if (n.innerType._zod.optin === "optional") {
      const t = n.innerType._zod.run(r, o);
      return t instanceof Promise ? t.then((i) => Jc(i, r.value)) : Jc(t, r.value);
    }
    return r.value === void 0 ? r : n.innerType._zod.run(r, o);
  };
}), td = /* @__PURE__ */ m("$ZodExactOptional", (e, n) => {
  uo.init(e, n), D(e._zod, "values", () => n.innerType._zod.values), D(e._zod, "pattern", () => n.innerType._zod.pattern), e._zod.parse = (r, o) => n.innerType._zod.run(r, o);
}), nd = /* @__PURE__ */ m("$ZodNullable", (e, n) => {
  O.init(e, n), D(e._zod, "optin", () => n.innerType._zod.optin), D(e._zod, "optout", () => n.innerType._zod.optout), D(e._zod, "pattern", () => {
    const r = n.innerType._zod.pattern;
    return r ? new RegExp(`^(${cr(r.source)}|null)$`) : void 0;
  }), D(e._zod, "values", () => n.innerType._zod.values ? /* @__PURE__ */ new Set([...n.innerType._zod.values, null]) : void 0), e._zod.parse = (r, o) => r.value === null ? r : n.innerType._zod.run(r, o);
}), rd = /* @__PURE__ */ m("$ZodDefault", (e, n) => {
  O.init(e, n), e._zod.optin = "optional", D(e._zod, "values", () => n.innerType._zod.values), e._zod.parse = (r, o) => {
    if (o.direction === "backward")
      return n.innerType._zod.run(r, o);
    if (r.value === void 0)
      return r.value = n.defaultValue, r;
    const t = n.innerType._zod.run(r, o);
    return t instanceof Promise ? t.then((i) => Mc(i, n)) : Mc(t, n);
  };
});
function Mc(e, n) {
  return e.value === void 0 && (e.value = n.defaultValue), e;
}
const id = /* @__PURE__ */ m("$ZodPrefault", (e, n) => {
  O.init(e, n), e._zod.optin = "optional", D(e._zod, "values", () => n.innerType._zod.values), e._zod.parse = (r, o) => (o.direction === "backward" || r.value === void 0 && (r.value = n.defaultValue), n.innerType._zod.run(r, o));
}), od = /* @__PURE__ */ m("$ZodNonOptional", (e, n) => {
  O.init(e, n), D(e._zod, "values", () => {
    const r = n.innerType._zod.values;
    return r ? new Set([...r].filter((o) => o !== void 0)) : void 0;
  }), e._zod.parse = (r, o) => {
    const t = n.innerType._zod.run(r, o);
    return t instanceof Promise ? t.then((i) => Bc(i, e)) : Bc(t, e);
  };
});
function Bc(e, n) {
  return !e.issues.length && e.value === void 0 && e.issues.push({
    code: "invalid_type",
    expected: "nonoptional",
    input: e.value,
    inst: n
  }), e;
}
const ad = /* @__PURE__ */ m("$ZodSuccess", (e, n) => {
  O.init(e, n), e._zod.parse = (r, o) => {
    if (o.direction === "backward")
      throw new ar("ZodSuccess");
    const t = n.innerType._zod.run(r, o);
    return t instanceof Promise ? t.then((i) => (r.value = i.issues.length === 0, r)) : (r.value = t.issues.length === 0, r);
  };
}), cd = /* @__PURE__ */ m("$ZodCatch", (e, n) => {
  O.init(e, n), D(e._zod, "optin", () => n.innerType._zod.optin), D(e._zod, "optout", () => n.innerType._zod.optout), D(e._zod, "values", () => n.innerType._zod.values), e._zod.parse = (r, o) => {
    if (o.direction === "backward")
      return n.innerType._zod.run(r, o);
    const t = n.innerType._zod.run(r, o);
    return t instanceof Promise ? t.then((i) => (r.value = i.value, i.issues.length && (r.value = n.catchValue({
      ...r,
      error: {
        issues: i.issues.map((a) => ue(a, o, K()))
      },
      input: r.value
    }), r.issues = []), r)) : (r.value = t.value, t.issues.length && (r.value = n.catchValue({
      ...r,
      error: {
        issues: t.issues.map((i) => ue(i, o, K()))
      },
      input: r.value
    }), r.issues = []), r);
  };
}), sd = /* @__PURE__ */ m("$ZodNaN", (e, n) => {
  O.init(e, n), e._zod.parse = (r, o) => ((typeof r.value != "number" || !Number.isNaN(r.value)) && r.issues.push({
    input: r.value,
    inst: e,
    expected: "nan",
    code: "invalid_type"
  }), r);
}), ud = /* @__PURE__ */ m("$ZodPipe", (e, n) => {
  O.init(e, n), D(e._zod, "values", () => n.in._zod.values), D(e._zod, "optin", () => n.in._zod.optin), D(e._zod, "optout", () => n.out._zod.optout), D(e._zod, "propValues", () => n.in._zod.propValues), e._zod.parse = (r, o) => {
    if (o.direction === "backward") {
      const i = n.out._zod.run(r, o);
      return i instanceof Promise ? i.then((a) => Ln(a, n.in, o)) : Ln(i, n.in, o);
    }
    const t = n.in._zod.run(r, o);
    return t instanceof Promise ? t.then((i) => Ln(i, n.out, o)) : Ln(t, n.out, o);
  };
});
function Ln(e, n, r) {
  return e.issues.length ? (e.aborted = !0, e) : n._zod.run({ value: e.value, issues: e.issues }, r);
}
const lo = /* @__PURE__ */ m("$ZodCodec", (e, n) => {
  O.init(e, n), D(e._zod, "values", () => n.in._zod.values), D(e._zod, "optin", () => n.in._zod.optin), D(e._zod, "optout", () => n.out._zod.optout), D(e._zod, "propValues", () => n.in._zod.propValues), e._zod.parse = (r, o) => {
    if ((o.direction || "forward") === "forward") {
      const i = n.in._zod.run(r, o);
      return i instanceof Promise ? i.then((a) => Jn(a, n, o)) : Jn(i, n, o);
    } else {
      const i = n.out._zod.run(r, o);
      return i instanceof Promise ? i.then((a) => Jn(a, n, o)) : Jn(i, n, o);
    }
  };
});
function Jn(e, n, r) {
  if (e.issues.length)
    return e.aborted = !0, e;
  if ((r.direction || "forward") === "forward") {
    const t = n.transform(e.value, e);
    return t instanceof Promise ? t.then((i) => Mn(e, i, n.out, r)) : Mn(e, t, n.out, r);
  } else {
    const t = n.reverseTransform(e.value, e);
    return t instanceof Promise ? t.then((i) => Mn(e, i, n.in, r)) : Mn(e, t, n.in, r);
  }
}
function Mn(e, n, r, o) {
  return e.issues.length ? (e.aborted = !0, e) : r._zod.run({ value: n, issues: e.issues }, o);
}
const ld = /* @__PURE__ */ m("$ZodReadonly", (e, n) => {
  O.init(e, n), D(e._zod, "propValues", () => n.innerType._zod.propValues), D(e._zod, "values", () => n.innerType._zod.values), D(e._zod, "optin", () => n.innerType?._zod?.optin), D(e._zod, "optout", () => n.innerType?._zod?.optout), e._zod.parse = (r, o) => {
    if (o.direction === "backward")
      return n.innerType._zod.run(r, o);
    const t = n.innerType._zod.run(r, o);
    return t instanceof Promise ? t.then(Vc) : Vc(t);
  };
});
function Vc(e) {
  return e.value = Object.freeze(e.value), e;
}
const dd = /* @__PURE__ */ m("$ZodTemplateLiteral", (e, n) => {
  O.init(e, n);
  const r = [];
  for (const o of n.parts)
    if (typeof o == "object" && o !== null) {
      if (!o._zod.pattern)
        throw new Error(`Invalid template literal part, no pattern found: ${[...o._zod.traits].shift()}`);
      const t = o._zod.pattern instanceof RegExp ? o._zod.pattern.source : o._zod.pattern;
      if (!t)
        throw new Error(`Invalid template literal part: ${o._zod.traits}`);
      const i = t.startsWith("^") ? 1 : 0, a = t.endsWith("$") ? t.length - 1 : t.length;
      r.push(t.slice(i, a));
    } else if (o === null || Cs.has(typeof o))
      r.push(we(`${o}`));
    else
      throw new Error(`Invalid template literal part: ${o}`);
  e._zod.pattern = new RegExp(`^${r.join("")}$`), e._zod.parse = (o, t) => typeof o.value != "string" ? (o.issues.push({
    input: o.value,
    inst: e,
    expected: "string",
    code: "invalid_type"
  }), o) : (e._zod.pattern.lastIndex = 0, e._zod.pattern.test(o.value) || o.issues.push({
    input: o.value,
    inst: e,
    code: "invalid_format",
    format: n.format ?? "template_literal",
    pattern: e._zod.pattern.source
  }), o);
}), md = /* @__PURE__ */ m("$ZodFunction", (e, n) => (O.init(e, n), e._def = n, e._zod.def = n, e.implement = (r) => {
  if (typeof r != "function")
    throw new Error("implement() must be called with a function");
  return function(...o) {
    const t = e._def.input ? Ui(e._def.input, o) : o, i = Reflect.apply(r, this, t);
    return e._def.output ? Ui(e._def.output, i) : i;
  };
}, e.implementAsync = (r) => {
  if (typeof r != "function")
    throw new Error("implementAsync() must be called with a function");
  return async function(...o) {
    const t = e._def.input ? await ji(e._def.input, o) : o, i = await Reflect.apply(r, this, t);
    return e._def.output ? await ji(e._def.output, i) : i;
  };
}, e._zod.parse = (r, o) => typeof r.value != "function" ? (r.issues.push({
  code: "invalid_type",
  expected: "function",
  input: r.value,
  inst: e
}), r) : (e._def.output && e._def.output._zod.def.type === "promise" ? r.value = e.implementAsync(r.value) : r.value = e.implement(r.value), r), e.input = (...r) => {
  const o = e.constructor;
  return Array.isArray(r[0]) ? new o({
    type: "function",
    input: new so({
      type: "tuple",
      items: r[0],
      rest: r[1]
    }),
    output: e._def.output
  }) : new o({
    type: "function",
    input: r[0],
    output: e._def.output
  });
}, e.output = (r) => {
  const o = e.constructor;
  return new o({
    type: "function",
    input: e._def.input,
    output: r
  });
}, e)), fd = /* @__PURE__ */ m("$ZodPromise", (e, n) => {
  O.init(e, n), e._zod.parse = (r, o) => Promise.resolve(r.value).then((t) => n.innerType._zod.run({ value: t, issues: [] }, o));
}), pd = /* @__PURE__ */ m("$ZodLazy", (e, n) => {
  O.init(e, n), D(e._zod, "innerType", () => n.getter()), D(e._zod, "pattern", () => e._zod.innerType?._zod?.pattern), D(e._zod, "propValues", () => e._zod.innerType?._zod?.propValues), D(e._zod, "optin", () => e._zod.innerType?._zod?.optin ?? void 0), D(e._zod, "optout", () => e._zod.innerType?._zod?.optout ?? void 0), e._zod.parse = (r, o) => e._zod.innerType._zod.run(r, o);
}), gd = /* @__PURE__ */ m("$ZodCustom", (e, n) => {
  F.init(e, n), O.init(e, n), e._zod.parse = (r, o) => r, e._zod.check = (r) => {
    const o = r.value, t = n.fn(o);
    if (t instanceof Promise)
      return t.then((i) => Gc(i, r, o, e));
    Gc(t, r, o, e);
  };
});
function Gc(e, n, r, o) {
  if (!e) {
    const t = {
      code: "custom",
      input: r,
      inst: o,
      // incorporates params.error into issue reporting
      path: [...o._zod.def.path ?? []],
      // incorporates params.error into issue reporting
      continue: !o._zod.def.abort
      // params: inst._zod.def.params,
    };
    o._zod.def.params && (t.params = o._zod.def.params), n.issues.push(Xe(t));
  }
}
const bv = () => {
  const e = {
    string: { unit: "حرف", verb: "أن يحوي" },
    file: { unit: "بايت", verb: "أن يحوي" },
    array: { unit: "عنصر", verb: "أن يحوي" },
    set: { unit: "عنصر", verb: "أن يحوي" }
  };
  function n(t) {
    return e[t] ?? null;
  }
  const r = {
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
  return (t) => {
    switch (t.code) {
      case "invalid_type": {
        const i = o[t.expected] ?? t.expected, a = z(t.input), c = o[a] ?? a;
        return /^[A-Z]/.test(t.expected) ? `مدخلات غير مقبولة: يفترض إدخال instanceof ${t.expected}، ولكن تم إدخال ${c}` : `مدخلات غير مقبولة: يفترض إدخال ${i}، ولكن تم إدخال ${c}`;
      }
      case "invalid_value":
        return t.values.length === 1 ? `مدخلات غير مقبولة: يفترض إدخال ${x(t.values[0])}` : `اختيار غير مقبول: يتوقع انتقاء أحد هذه الخيارات: ${b(t.values, "|")}`;
      case "too_big": {
        const i = t.inclusive ? "<=" : "<", a = n(t.origin);
        return a ? ` أكبر من اللازم: يفترض أن تكون ${t.origin ?? "القيمة"} ${i} ${t.maximum.toString()} ${a.unit ?? "عنصر"}` : `أكبر من اللازم: يفترض أن تكون ${t.origin ?? "القيمة"} ${i} ${t.maximum.toString()}`;
      }
      case "too_small": {
        const i = t.inclusive ? ">=" : ">", a = n(t.origin);
        return a ? `أصغر من اللازم: يفترض لـ ${t.origin} أن يكون ${i} ${t.minimum.toString()} ${a.unit}` : `أصغر من اللازم: يفترض لـ ${t.origin} أن يكون ${i} ${t.minimum.toString()}`;
      }
      case "invalid_format": {
        const i = t;
        return i.format === "starts_with" ? `نَص غير مقبول: يجب أن يبدأ بـ "${t.prefix}"` : i.format === "ends_with" ? `نَص غير مقبول: يجب أن ينتهي بـ "${i.suffix}"` : i.format === "includes" ? `نَص غير مقبول: يجب أن يتضمَّن "${i.includes}"` : i.format === "regex" ? `نَص غير مقبول: يجب أن يطابق النمط ${i.pattern}` : `${r[i.format] ?? t.format} غير مقبول`;
      }
      case "not_multiple_of":
        return `رقم غير مقبول: يجب أن يكون من مضاعفات ${t.divisor}`;
      case "unrecognized_keys":
        return `معرف${t.keys.length > 1 ? "ات" : ""} غريب${t.keys.length > 1 ? "ة" : ""}: ${b(t.keys, "، ")}`;
      case "invalid_key":
        return `معرف غير مقبول في ${t.origin}`;
      case "invalid_union":
        return "مدخل غير مقبول";
      case "invalid_element":
        return `مدخل غير مقبول في ${t.origin}`;
      default:
        return "مدخل غير مقبول";
    }
  };
};
function $v() {
  return {
    localeError: bv()
  };
}
const yv = () => {
  const e = {
    string: { unit: "simvol", verb: "olmalıdır" },
    file: { unit: "bayt", verb: "olmalıdır" },
    array: { unit: "element", verb: "olmalıdır" },
    set: { unit: "element", verb: "olmalıdır" }
  };
  function n(t) {
    return e[t] ?? null;
  }
  const r = {
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
  return (t) => {
    switch (t.code) {
      case "invalid_type": {
        const i = o[t.expected] ?? t.expected, a = z(t.input), c = o[a] ?? a;
        return /^[A-Z]/.test(t.expected) ? `Yanlış dəyər: gözlənilən instanceof ${t.expected}, daxil olan ${c}` : `Yanlış dəyər: gözlənilən ${i}, daxil olan ${c}`;
      }
      case "invalid_value":
        return t.values.length === 1 ? `Yanlış dəyər: gözlənilən ${x(t.values[0])}` : `Yanlış seçim: aşağıdakılardan biri olmalıdır: ${b(t.values, "|")}`;
      case "too_big": {
        const i = t.inclusive ? "<=" : "<", a = n(t.origin);
        return a ? `Çox böyük: gözlənilən ${t.origin ?? "dəyər"} ${i}${t.maximum.toString()} ${a.unit ?? "element"}` : `Çox böyük: gözlənilən ${t.origin ?? "dəyər"} ${i}${t.maximum.toString()}`;
      }
      case "too_small": {
        const i = t.inclusive ? ">=" : ">", a = n(t.origin);
        return a ? `Çox kiçik: gözlənilən ${t.origin} ${i}${t.minimum.toString()} ${a.unit}` : `Çox kiçik: gözlənilən ${t.origin} ${i}${t.minimum.toString()}`;
      }
      case "invalid_format": {
        const i = t;
        return i.format === "starts_with" ? `Yanlış mətn: "${i.prefix}" ilə başlamalıdır` : i.format === "ends_with" ? `Yanlış mətn: "${i.suffix}" ilə bitməlidir` : i.format === "includes" ? `Yanlış mətn: "${i.includes}" daxil olmalıdır` : i.format === "regex" ? `Yanlış mətn: ${i.pattern} şablonuna uyğun olmalıdır` : `Yanlış ${r[i.format] ?? t.format}`;
      }
      case "not_multiple_of":
        return `Yanlış ədəd: ${t.divisor} ilə bölünə bilən olmalıdır`;
      case "unrecognized_keys":
        return `Tanınmayan açar${t.keys.length > 1 ? "lar" : ""}: ${b(t.keys, ", ")}`;
      case "invalid_key":
        return `${t.origin} daxilində yanlış açar`;
      case "invalid_union":
        return "Yanlış dəyər";
      case "invalid_element":
        return `${t.origin} daxilində yanlış dəyər`;
      default:
        return "Yanlış dəyər";
    }
  };
};
function _v() {
  return {
    localeError: yv()
  };
}
function Wc(e, n, r, o) {
  const t = Math.abs(e), i = t % 10, a = t % 100;
  return a >= 11 && a <= 19 ? o : i === 1 ? n : i >= 2 && i <= 4 ? r : o;
}
const kv = () => {
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
  function n(t) {
    return e[t] ?? null;
  }
  const r = {
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
  return (t) => {
    switch (t.code) {
      case "invalid_type": {
        const i = o[t.expected] ?? t.expected, a = z(t.input), c = o[a] ?? a;
        return /^[A-Z]/.test(t.expected) ? `Няправільны ўвод: чакаўся instanceof ${t.expected}, атрымана ${c}` : `Няправільны ўвод: чакаўся ${i}, атрымана ${c}`;
      }
      case "invalid_value":
        return t.values.length === 1 ? `Няправільны ўвод: чакалася ${x(t.values[0])}` : `Няправільны варыянт: чакаўся адзін з ${b(t.values, "|")}`;
      case "too_big": {
        const i = t.inclusive ? "<=" : "<", a = n(t.origin);
        if (a) {
          const c = Number(t.maximum), u = Wc(c, a.unit.one, a.unit.few, a.unit.many);
          return `Занадта вялікі: чакалася, што ${t.origin ?? "значэнне"} павінна ${a.verb} ${i}${t.maximum.toString()} ${u}`;
        }
        return `Занадта вялікі: чакалася, што ${t.origin ?? "значэнне"} павінна быць ${i}${t.maximum.toString()}`;
      }
      case "too_small": {
        const i = t.inclusive ? ">=" : ">", a = n(t.origin);
        if (a) {
          const c = Number(t.minimum), u = Wc(c, a.unit.one, a.unit.few, a.unit.many);
          return `Занадта малы: чакалася, што ${t.origin} павінна ${a.verb} ${i}${t.minimum.toString()} ${u}`;
        }
        return `Занадта малы: чакалася, што ${t.origin} павінна быць ${i}${t.minimum.toString()}`;
      }
      case "invalid_format": {
        const i = t;
        return i.format === "starts_with" ? `Няправільны радок: павінен пачынацца з "${i.prefix}"` : i.format === "ends_with" ? `Няправільны радок: павінен заканчвацца на "${i.suffix}"` : i.format === "includes" ? `Няправільны радок: павінен змяшчаць "${i.includes}"` : i.format === "regex" ? `Няправільны радок: павінен адпавядаць шаблону ${i.pattern}` : `Няправільны ${r[i.format] ?? t.format}`;
      }
      case "not_multiple_of":
        return `Няправільны лік: павінен быць кратным ${t.divisor}`;
      case "unrecognized_keys":
        return `Нераспазнаны ${t.keys.length > 1 ? "ключы" : "ключ"}: ${b(t.keys, ", ")}`;
      case "invalid_key":
        return `Няправільны ключ у ${t.origin}`;
      case "invalid_union":
        return "Няправільны ўвод";
      case "invalid_element":
        return `Няправільнае значэнне ў ${t.origin}`;
      default:
        return "Няправільны ўвод";
    }
  };
};
function wv() {
  return {
    localeError: kv()
  };
}
const Sv = () => {
  const e = {
    string: { unit: "символа", verb: "да съдържа" },
    file: { unit: "байта", verb: "да съдържа" },
    array: { unit: "елемента", verb: "да съдържа" },
    set: { unit: "елемента", verb: "да съдържа" }
  };
  function n(t) {
    return e[t] ?? null;
  }
  const r = {
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
  return (t) => {
    switch (t.code) {
      case "invalid_type": {
        const i = o[t.expected] ?? t.expected, a = z(t.input), c = o[a] ?? a;
        return /^[A-Z]/.test(t.expected) ? `Невалиден вход: очакван instanceof ${t.expected}, получен ${c}` : `Невалиден вход: очакван ${i}, получен ${c}`;
      }
      case "invalid_value":
        return t.values.length === 1 ? `Невалиден вход: очакван ${x(t.values[0])}` : `Невалидна опция: очаквано едно от ${b(t.values, "|")}`;
      case "too_big": {
        const i = t.inclusive ? "<=" : "<", a = n(t.origin);
        return a ? `Твърде голямо: очаква се ${t.origin ?? "стойност"} да съдържа ${i}${t.maximum.toString()} ${a.unit ?? "елемента"}` : `Твърде голямо: очаква се ${t.origin ?? "стойност"} да бъде ${i}${t.maximum.toString()}`;
      }
      case "too_small": {
        const i = t.inclusive ? ">=" : ">", a = n(t.origin);
        return a ? `Твърде малко: очаква се ${t.origin} да съдържа ${i}${t.minimum.toString()} ${a.unit}` : `Твърде малко: очаква се ${t.origin} да бъде ${i}${t.minimum.toString()}`;
      }
      case "invalid_format": {
        const i = t;
        if (i.format === "starts_with")
          return `Невалиден низ: трябва да започва с "${i.prefix}"`;
        if (i.format === "ends_with")
          return `Невалиден низ: трябва да завършва с "${i.suffix}"`;
        if (i.format === "includes")
          return `Невалиден низ: трябва да включва "${i.includes}"`;
        if (i.format === "regex")
          return `Невалиден низ: трябва да съвпада с ${i.pattern}`;
        let a = "Невалиден";
        return i.format === "emoji" && (a = "Невалидно"), i.format === "datetime" && (a = "Невалидно"), i.format === "date" && (a = "Невалидна"), i.format === "time" && (a = "Невалидно"), i.format === "duration" && (a = "Невалидна"), `${a} ${r[i.format] ?? t.format}`;
      }
      case "not_multiple_of":
        return `Невалидно число: трябва да бъде кратно на ${t.divisor}`;
      case "unrecognized_keys":
        return `Неразпознат${t.keys.length > 1 ? "и" : ""} ключ${t.keys.length > 1 ? "ове" : ""}: ${b(t.keys, ", ")}`;
      case "invalid_key":
        return `Невалиден ключ в ${t.origin}`;
      case "invalid_union":
        return "Невалиден вход";
      case "invalid_element":
        return `Невалидна стойност в ${t.origin}`;
      default:
        return "Невалиден вход";
    }
  };
};
function xv() {
  return {
    localeError: Sv()
  };
}
const zv = () => {
  const e = {
    string: { unit: "caràcters", verb: "contenir" },
    file: { unit: "bytes", verb: "contenir" },
    array: { unit: "elements", verb: "contenir" },
    set: { unit: "elements", verb: "contenir" }
  };
  function n(t) {
    return e[t] ?? null;
  }
  const r = {
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
  return (t) => {
    switch (t.code) {
      case "invalid_type": {
        const i = o[t.expected] ?? t.expected, a = z(t.input), c = o[a] ?? a;
        return /^[A-Z]/.test(t.expected) ? `Tipus invàlid: s'esperava instanceof ${t.expected}, s'ha rebut ${c}` : `Tipus invàlid: s'esperava ${i}, s'ha rebut ${c}`;
      }
      case "invalid_value":
        return t.values.length === 1 ? `Valor invàlid: s'esperava ${x(t.values[0])}` : `Opció invàlida: s'esperava una de ${b(t.values, " o ")}`;
      case "too_big": {
        const i = t.inclusive ? "com a màxim" : "menys de", a = n(t.origin);
        return a ? `Massa gran: s'esperava que ${t.origin ?? "el valor"} contingués ${i} ${t.maximum.toString()} ${a.unit ?? "elements"}` : `Massa gran: s'esperava que ${t.origin ?? "el valor"} fos ${i} ${t.maximum.toString()}`;
      }
      case "too_small": {
        const i = t.inclusive ? "com a mínim" : "més de", a = n(t.origin);
        return a ? `Massa petit: s'esperava que ${t.origin} contingués ${i} ${t.minimum.toString()} ${a.unit}` : `Massa petit: s'esperava que ${t.origin} fos ${i} ${t.minimum.toString()}`;
      }
      case "invalid_format": {
        const i = t;
        return i.format === "starts_with" ? `Format invàlid: ha de començar amb "${i.prefix}"` : i.format === "ends_with" ? `Format invàlid: ha d'acabar amb "${i.suffix}"` : i.format === "includes" ? `Format invàlid: ha d'incloure "${i.includes}"` : i.format === "regex" ? `Format invàlid: ha de coincidir amb el patró ${i.pattern}` : `Format invàlid per a ${r[i.format] ?? t.format}`;
      }
      case "not_multiple_of":
        return `Número invàlid: ha de ser múltiple de ${t.divisor}`;
      case "unrecognized_keys":
        return `Clau${t.keys.length > 1 ? "s" : ""} no reconeguda${t.keys.length > 1 ? "s" : ""}: ${b(t.keys, ", ")}`;
      case "invalid_key":
        return `Clau invàlida a ${t.origin}`;
      case "invalid_union":
        return "Entrada invàlida";
      // Could also be "Tipus d'unió invàlid" but "Entrada invàlida" is more general
      case "invalid_element":
        return `Element invàlid a ${t.origin}`;
      default:
        return "Entrada invàlida";
    }
  };
};
function Iv() {
  return {
    localeError: zv()
  };
}
const Ov = () => {
  const e = {
    string: { unit: "znaků", verb: "mít" },
    file: { unit: "bajtů", verb: "mít" },
    array: { unit: "prvků", verb: "mít" },
    set: { unit: "prvků", verb: "mít" }
  };
  function n(t) {
    return e[t] ?? null;
  }
  const r = {
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
  return (t) => {
    switch (t.code) {
      case "invalid_type": {
        const i = o[t.expected] ?? t.expected, a = z(t.input), c = o[a] ?? a;
        return /^[A-Z]/.test(t.expected) ? `Neplatný vstup: očekáváno instanceof ${t.expected}, obdrženo ${c}` : `Neplatný vstup: očekáváno ${i}, obdrženo ${c}`;
      }
      case "invalid_value":
        return t.values.length === 1 ? `Neplatný vstup: očekáváno ${x(t.values[0])}` : `Neplatná možnost: očekávána jedna z hodnot ${b(t.values, "|")}`;
      case "too_big": {
        const i = t.inclusive ? "<=" : "<", a = n(t.origin);
        return a ? `Hodnota je příliš velká: ${t.origin ?? "hodnota"} musí mít ${i}${t.maximum.toString()} ${a.unit ?? "prvků"}` : `Hodnota je příliš velká: ${t.origin ?? "hodnota"} musí být ${i}${t.maximum.toString()}`;
      }
      case "too_small": {
        const i = t.inclusive ? ">=" : ">", a = n(t.origin);
        return a ? `Hodnota je příliš malá: ${t.origin ?? "hodnota"} musí mít ${i}${t.minimum.toString()} ${a.unit ?? "prvků"}` : `Hodnota je příliš malá: ${t.origin ?? "hodnota"} musí být ${i}${t.minimum.toString()}`;
      }
      case "invalid_format": {
        const i = t;
        return i.format === "starts_with" ? `Neplatný řetězec: musí začínat na "${i.prefix}"` : i.format === "ends_with" ? `Neplatný řetězec: musí končit na "${i.suffix}"` : i.format === "includes" ? `Neplatný řetězec: musí obsahovat "${i.includes}"` : i.format === "regex" ? `Neplatný řetězec: musí odpovídat vzoru ${i.pattern}` : `Neplatný formát ${r[i.format] ?? t.format}`;
      }
      case "not_multiple_of":
        return `Neplatné číslo: musí být násobkem ${t.divisor}`;
      case "unrecognized_keys":
        return `Neznámé klíče: ${b(t.keys, ", ")}`;
      case "invalid_key":
        return `Neplatný klíč v ${t.origin}`;
      case "invalid_union":
        return "Neplatný vstup";
      case "invalid_element":
        return `Neplatná hodnota v ${t.origin}`;
      default:
        return "Neplatný vstup";
    }
  };
};
function Uv() {
  return {
    localeError: Ov()
  };
}
const jv = () => {
  const e = {
    string: { unit: "tegn", verb: "havde" },
    file: { unit: "bytes", verb: "havde" },
    array: { unit: "elementer", verb: "indeholdt" },
    set: { unit: "elementer", verb: "indeholdt" }
  };
  function n(t) {
    return e[t] ?? null;
  }
  const r = {
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
  return (t) => {
    switch (t.code) {
      case "invalid_type": {
        const i = o[t.expected] ?? t.expected, a = z(t.input), c = o[a] ?? a;
        return /^[A-Z]/.test(t.expected) ? `Ugyldigt input: forventede instanceof ${t.expected}, fik ${c}` : `Ugyldigt input: forventede ${i}, fik ${c}`;
      }
      case "invalid_value":
        return t.values.length === 1 ? `Ugyldig værdi: forventede ${x(t.values[0])}` : `Ugyldigt valg: forventede en af følgende ${b(t.values, "|")}`;
      case "too_big": {
        const i = t.inclusive ? "<=" : "<", a = n(t.origin), c = o[t.origin] ?? t.origin;
        return a ? `For stor: forventede ${c ?? "value"} ${a.verb} ${i} ${t.maximum.toString()} ${a.unit ?? "elementer"}` : `For stor: forventede ${c ?? "value"} havde ${i} ${t.maximum.toString()}`;
      }
      case "too_small": {
        const i = t.inclusive ? ">=" : ">", a = n(t.origin), c = o[t.origin] ?? t.origin;
        return a ? `For lille: forventede ${c} ${a.verb} ${i} ${t.minimum.toString()} ${a.unit}` : `For lille: forventede ${c} havde ${i} ${t.minimum.toString()}`;
      }
      case "invalid_format": {
        const i = t;
        return i.format === "starts_with" ? `Ugyldig streng: skal starte med "${i.prefix}"` : i.format === "ends_with" ? `Ugyldig streng: skal ende med "${i.suffix}"` : i.format === "includes" ? `Ugyldig streng: skal indeholde "${i.includes}"` : i.format === "regex" ? `Ugyldig streng: skal matche mønsteret ${i.pattern}` : `Ugyldig ${r[i.format] ?? t.format}`;
      }
      case "not_multiple_of":
        return `Ugyldigt tal: skal være deleligt med ${t.divisor}`;
      case "unrecognized_keys":
        return `${t.keys.length > 1 ? "Ukendte nøgler" : "Ukendt nøgle"}: ${b(t.keys, ", ")}`;
      case "invalid_key":
        return `Ugyldig nøgle i ${t.origin}`;
      case "invalid_union":
        return "Ugyldigt input: matcher ingen af de tilladte typer";
      case "invalid_element":
        return `Ugyldig værdi i ${t.origin}`;
      default:
        return "Ugyldigt input";
    }
  };
};
function Dv() {
  return {
    localeError: jv()
  };
}
const Tv = () => {
  const e = {
    string: { unit: "Zeichen", verb: "zu haben" },
    file: { unit: "Bytes", verb: "zu haben" },
    array: { unit: "Elemente", verb: "zu haben" },
    set: { unit: "Elemente", verb: "zu haben" }
  };
  function n(t) {
    return e[t] ?? null;
  }
  const r = {
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
  return (t) => {
    switch (t.code) {
      case "invalid_type": {
        const i = o[t.expected] ?? t.expected, a = z(t.input), c = o[a] ?? a;
        return /^[A-Z]/.test(t.expected) ? `Ungültige Eingabe: erwartet instanceof ${t.expected}, erhalten ${c}` : `Ungültige Eingabe: erwartet ${i}, erhalten ${c}`;
      }
      case "invalid_value":
        return t.values.length === 1 ? `Ungültige Eingabe: erwartet ${x(t.values[0])}` : `Ungültige Option: erwartet eine von ${b(t.values, "|")}`;
      case "too_big": {
        const i = t.inclusive ? "<=" : "<", a = n(t.origin);
        return a ? `Zu groß: erwartet, dass ${t.origin ?? "Wert"} ${i}${t.maximum.toString()} ${a.unit ?? "Elemente"} hat` : `Zu groß: erwartet, dass ${t.origin ?? "Wert"} ${i}${t.maximum.toString()} ist`;
      }
      case "too_small": {
        const i = t.inclusive ? ">=" : ">", a = n(t.origin);
        return a ? `Zu klein: erwartet, dass ${t.origin} ${i}${t.minimum.toString()} ${a.unit} hat` : `Zu klein: erwartet, dass ${t.origin} ${i}${t.minimum.toString()} ist`;
      }
      case "invalid_format": {
        const i = t;
        return i.format === "starts_with" ? `Ungültiger String: muss mit "${i.prefix}" beginnen` : i.format === "ends_with" ? `Ungültiger String: muss mit "${i.suffix}" enden` : i.format === "includes" ? `Ungültiger String: muss "${i.includes}" enthalten` : i.format === "regex" ? `Ungültiger String: muss dem Muster ${i.pattern} entsprechen` : `Ungültig: ${r[i.format] ?? t.format}`;
      }
      case "not_multiple_of":
        return `Ungültige Zahl: muss ein Vielfaches von ${t.divisor} sein`;
      case "unrecognized_keys":
        return `${t.keys.length > 1 ? "Unbekannte Schlüssel" : "Unbekannter Schlüssel"}: ${b(t.keys, ", ")}`;
      case "invalid_key":
        return `Ungültiger Schlüssel in ${t.origin}`;
      case "invalid_union":
        return "Ungültige Eingabe";
      case "invalid_element":
        return `Ungültiger Wert in ${t.origin}`;
      default:
        return "Ungültige Eingabe";
    }
  };
};
function Ev() {
  return {
    localeError: Tv()
  };
}
const Nv = () => {
  const e = {
    string: { unit: "characters", verb: "to have" },
    file: { unit: "bytes", verb: "to have" },
    array: { unit: "items", verb: "to have" },
    set: { unit: "items", verb: "to have" },
    map: { unit: "entries", verb: "to have" }
  };
  function n(t) {
    return e[t] ?? null;
  }
  const r = {
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
  return (t) => {
    switch (t.code) {
      case "invalid_type": {
        const i = o[t.expected] ?? t.expected, a = z(t.input), c = o[a] ?? a;
        return `Invalid input: expected ${i}, received ${c}`;
      }
      case "invalid_value":
        return t.values.length === 1 ? `Invalid input: expected ${x(t.values[0])}` : `Invalid option: expected one of ${b(t.values, "|")}`;
      case "too_big": {
        const i = t.inclusive ? "<=" : "<", a = n(t.origin);
        return a ? `Too big: expected ${t.origin ?? "value"} to have ${i}${t.maximum.toString()} ${a.unit ?? "elements"}` : `Too big: expected ${t.origin ?? "value"} to be ${i}${t.maximum.toString()}`;
      }
      case "too_small": {
        const i = t.inclusive ? ">=" : ">", a = n(t.origin);
        return a ? `Too small: expected ${t.origin} to have ${i}${t.minimum.toString()} ${a.unit}` : `Too small: expected ${t.origin} to be ${i}${t.minimum.toString()}`;
      }
      case "invalid_format": {
        const i = t;
        return i.format === "starts_with" ? `Invalid string: must start with "${i.prefix}"` : i.format === "ends_with" ? `Invalid string: must end with "${i.suffix}"` : i.format === "includes" ? `Invalid string: must include "${i.includes}"` : i.format === "regex" ? `Invalid string: must match pattern ${i.pattern}` : `Invalid ${r[i.format] ?? t.format}`;
      }
      case "not_multiple_of":
        return `Invalid number: must be a multiple of ${t.divisor}`;
      case "unrecognized_keys":
        return `Unrecognized key${t.keys.length > 1 ? "s" : ""}: ${b(t.keys, ", ")}`;
      case "invalid_key":
        return `Invalid key in ${t.origin}`;
      case "invalid_union":
        return "Invalid input";
      case "invalid_element":
        return `Invalid value in ${t.origin}`;
      default:
        return "Invalid input";
    }
  };
};
function vd() {
  return {
    localeError: Nv()
  };
}
const Pv = () => {
  const e = {
    string: { unit: "karaktrojn", verb: "havi" },
    file: { unit: "bajtojn", verb: "havi" },
    array: { unit: "elementojn", verb: "havi" },
    set: { unit: "elementojn", verb: "havi" }
  };
  function n(t) {
    return e[t] ?? null;
  }
  const r = {
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
  return (t) => {
    switch (t.code) {
      case "invalid_type": {
        const i = o[t.expected] ?? t.expected, a = z(t.input), c = o[a] ?? a;
        return /^[A-Z]/.test(t.expected) ? `Nevalida enigo: atendiĝis instanceof ${t.expected}, riceviĝis ${c}` : `Nevalida enigo: atendiĝis ${i}, riceviĝis ${c}`;
      }
      case "invalid_value":
        return t.values.length === 1 ? `Nevalida enigo: atendiĝis ${x(t.values[0])}` : `Nevalida opcio: atendiĝis unu el ${b(t.values, "|")}`;
      case "too_big": {
        const i = t.inclusive ? "<=" : "<", a = n(t.origin);
        return a ? `Tro granda: atendiĝis ke ${t.origin ?? "valoro"} havu ${i}${t.maximum.toString()} ${a.unit ?? "elementojn"}` : `Tro granda: atendiĝis ke ${t.origin ?? "valoro"} havu ${i}${t.maximum.toString()}`;
      }
      case "too_small": {
        const i = t.inclusive ? ">=" : ">", a = n(t.origin);
        return a ? `Tro malgranda: atendiĝis ke ${t.origin} havu ${i}${t.minimum.toString()} ${a.unit}` : `Tro malgranda: atendiĝis ke ${t.origin} estu ${i}${t.minimum.toString()}`;
      }
      case "invalid_format": {
        const i = t;
        return i.format === "starts_with" ? `Nevalida karaktraro: devas komenciĝi per "${i.prefix}"` : i.format === "ends_with" ? `Nevalida karaktraro: devas finiĝi per "${i.suffix}"` : i.format === "includes" ? `Nevalida karaktraro: devas inkluzivi "${i.includes}"` : i.format === "regex" ? `Nevalida karaktraro: devas kongrui kun la modelo ${i.pattern}` : `Nevalida ${r[i.format] ?? t.format}`;
      }
      case "not_multiple_of":
        return `Nevalida nombro: devas esti oblo de ${t.divisor}`;
      case "unrecognized_keys":
        return `Nekonata${t.keys.length > 1 ? "j" : ""} ŝlosilo${t.keys.length > 1 ? "j" : ""}: ${b(t.keys, ", ")}`;
      case "invalid_key":
        return `Nevalida ŝlosilo en ${t.origin}`;
      case "invalid_union":
        return "Nevalida enigo";
      case "invalid_element":
        return `Nevalida valoro en ${t.origin}`;
      default:
        return "Nevalida enigo";
    }
  };
};
function Av() {
  return {
    localeError: Pv()
  };
}
const Zv = () => {
  const e = {
    string: { unit: "caracteres", verb: "tener" },
    file: { unit: "bytes", verb: "tener" },
    array: { unit: "elementos", verb: "tener" },
    set: { unit: "elementos", verb: "tener" }
  };
  function n(t) {
    return e[t] ?? null;
  }
  const r = {
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
  return (t) => {
    switch (t.code) {
      case "invalid_type": {
        const i = o[t.expected] ?? t.expected, a = z(t.input), c = o[a] ?? a;
        return /^[A-Z]/.test(t.expected) ? `Entrada inválida: se esperaba instanceof ${t.expected}, recibido ${c}` : `Entrada inválida: se esperaba ${i}, recibido ${c}`;
      }
      case "invalid_value":
        return t.values.length === 1 ? `Entrada inválida: se esperaba ${x(t.values[0])}` : `Opción inválida: se esperaba una de ${b(t.values, "|")}`;
      case "too_big": {
        const i = t.inclusive ? "<=" : "<", a = n(t.origin), c = o[t.origin] ?? t.origin;
        return a ? `Demasiado grande: se esperaba que ${c ?? "valor"} tuviera ${i}${t.maximum.toString()} ${a.unit ?? "elementos"}` : `Demasiado grande: se esperaba que ${c ?? "valor"} fuera ${i}${t.maximum.toString()}`;
      }
      case "too_small": {
        const i = t.inclusive ? ">=" : ">", a = n(t.origin), c = o[t.origin] ?? t.origin;
        return a ? `Demasiado pequeño: se esperaba que ${c} tuviera ${i}${t.minimum.toString()} ${a.unit}` : `Demasiado pequeño: se esperaba que ${c} fuera ${i}${t.minimum.toString()}`;
      }
      case "invalid_format": {
        const i = t;
        return i.format === "starts_with" ? `Cadena inválida: debe comenzar con "${i.prefix}"` : i.format === "ends_with" ? `Cadena inválida: debe terminar en "${i.suffix}"` : i.format === "includes" ? `Cadena inválida: debe incluir "${i.includes}"` : i.format === "regex" ? `Cadena inválida: debe coincidir con el patrón ${i.pattern}` : `Inválido ${r[i.format] ?? t.format}`;
      }
      case "not_multiple_of":
        return `Número inválido: debe ser múltiplo de ${t.divisor}`;
      case "unrecognized_keys":
        return `Llave${t.keys.length > 1 ? "s" : ""} desconocida${t.keys.length > 1 ? "s" : ""}: ${b(t.keys, ", ")}`;
      case "invalid_key":
        return `Llave inválida en ${o[t.origin] ?? t.origin}`;
      case "invalid_union":
        return "Entrada inválida";
      case "invalid_element":
        return `Valor inválido en ${o[t.origin] ?? t.origin}`;
      default:
        return "Entrada inválida";
    }
  };
};
function Rv() {
  return {
    localeError: Zv()
  };
}
const Cv = () => {
  const e = {
    string: { unit: "کاراکتر", verb: "داشته باشد" },
    file: { unit: "بایت", verb: "داشته باشد" },
    array: { unit: "آیتم", verb: "داشته باشد" },
    set: { unit: "آیتم", verb: "داشته باشد" }
  };
  function n(t) {
    return e[t] ?? null;
  }
  const r = {
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
  return (t) => {
    switch (t.code) {
      case "invalid_type": {
        const i = o[t.expected] ?? t.expected, a = z(t.input), c = o[a] ?? a;
        return /^[A-Z]/.test(t.expected) ? `ورودی نامعتبر: می‌بایست instanceof ${t.expected} می‌بود، ${c} دریافت شد` : `ورودی نامعتبر: می‌بایست ${i} می‌بود، ${c} دریافت شد`;
      }
      case "invalid_value":
        return t.values.length === 1 ? `ورودی نامعتبر: می‌بایست ${x(t.values[0])} می‌بود` : `گزینه نامعتبر: می‌بایست یکی از ${b(t.values, "|")} می‌بود`;
      case "too_big": {
        const i = t.inclusive ? "<=" : "<", a = n(t.origin);
        return a ? `خیلی بزرگ: ${t.origin ?? "مقدار"} باید ${i}${t.maximum.toString()} ${a.unit ?? "عنصر"} باشد` : `خیلی بزرگ: ${t.origin ?? "مقدار"} باید ${i}${t.maximum.toString()} باشد`;
      }
      case "too_small": {
        const i = t.inclusive ? ">=" : ">", a = n(t.origin);
        return a ? `خیلی کوچک: ${t.origin} باید ${i}${t.minimum.toString()} ${a.unit} باشد` : `خیلی کوچک: ${t.origin} باید ${i}${t.minimum.toString()} باشد`;
      }
      case "invalid_format": {
        const i = t;
        return i.format === "starts_with" ? `رشته نامعتبر: باید با "${i.prefix}" شروع شود` : i.format === "ends_with" ? `رشته نامعتبر: باید با "${i.suffix}" تمام شود` : i.format === "includes" ? `رشته نامعتبر: باید شامل "${i.includes}" باشد` : i.format === "regex" ? `رشته نامعتبر: باید با الگوی ${i.pattern} مطابقت داشته باشد` : `${r[i.format] ?? t.format} نامعتبر`;
      }
      case "not_multiple_of":
        return `عدد نامعتبر: باید مضرب ${t.divisor} باشد`;
      case "unrecognized_keys":
        return `کلید${t.keys.length > 1 ? "های" : ""} ناشناس: ${b(t.keys, ", ")}`;
      case "invalid_key":
        return `کلید ناشناس در ${t.origin}`;
      case "invalid_union":
        return "ورودی نامعتبر";
      case "invalid_element":
        return `مقدار نامعتبر در ${t.origin}`;
      default:
        return "ورودی نامعتبر";
    }
  };
};
function Fv() {
  return {
    localeError: Cv()
  };
}
const Lv = () => {
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
  function n(t) {
    return e[t] ?? null;
  }
  const r = {
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
  return (t) => {
    switch (t.code) {
      case "invalid_type": {
        const i = o[t.expected] ?? t.expected, a = z(t.input), c = o[a] ?? a;
        return /^[A-Z]/.test(t.expected) ? `Virheellinen tyyppi: odotettiin instanceof ${t.expected}, oli ${c}` : `Virheellinen tyyppi: odotettiin ${i}, oli ${c}`;
      }
      case "invalid_value":
        return t.values.length === 1 ? `Virheellinen syöte: täytyy olla ${x(t.values[0])}` : `Virheellinen valinta: täytyy olla yksi seuraavista: ${b(t.values, "|")}`;
      case "too_big": {
        const i = t.inclusive ? "<=" : "<", a = n(t.origin);
        return a ? `Liian suuri: ${a.subject} täytyy olla ${i}${t.maximum.toString()} ${a.unit}`.trim() : `Liian suuri: arvon täytyy olla ${i}${t.maximum.toString()}`;
      }
      case "too_small": {
        const i = t.inclusive ? ">=" : ">", a = n(t.origin);
        return a ? `Liian pieni: ${a.subject} täytyy olla ${i}${t.minimum.toString()} ${a.unit}`.trim() : `Liian pieni: arvon täytyy olla ${i}${t.minimum.toString()}`;
      }
      case "invalid_format": {
        const i = t;
        return i.format === "starts_with" ? `Virheellinen syöte: täytyy alkaa "${i.prefix}"` : i.format === "ends_with" ? `Virheellinen syöte: täytyy loppua "${i.suffix}"` : i.format === "includes" ? `Virheellinen syöte: täytyy sisältää "${i.includes}"` : i.format === "regex" ? `Virheellinen syöte: täytyy vastata säännöllistä lauseketta ${i.pattern}` : `Virheellinen ${r[i.format] ?? t.format}`;
      }
      case "not_multiple_of":
        return `Virheellinen luku: täytyy olla luvun ${t.divisor} monikerta`;
      case "unrecognized_keys":
        return `${t.keys.length > 1 ? "Tuntemattomat avaimet" : "Tuntematon avain"}: ${b(t.keys, ", ")}`;
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
function Jv() {
  return {
    localeError: Lv()
  };
}
const Mv = () => {
  const e = {
    string: { unit: "caractères", verb: "avoir" },
    file: { unit: "octets", verb: "avoir" },
    array: { unit: "éléments", verb: "avoir" },
    set: { unit: "éléments", verb: "avoir" }
  };
  function n(t) {
    return e[t] ?? null;
  }
  const r = {
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
  return (t) => {
    switch (t.code) {
      case "invalid_type": {
        const i = o[t.expected] ?? t.expected, a = z(t.input), c = o[a] ?? a;
        return /^[A-Z]/.test(t.expected) ? `Entrée invalide : instanceof ${t.expected} attendu, ${c} reçu` : `Entrée invalide : ${i} attendu, ${c} reçu`;
      }
      case "invalid_value":
        return t.values.length === 1 ? `Entrée invalide : ${x(t.values[0])} attendu` : `Option invalide : une valeur parmi ${b(t.values, "|")} attendue`;
      case "too_big": {
        const i = t.inclusive ? "<=" : "<", a = n(t.origin);
        return a ? `Trop grand : ${t.origin ?? "valeur"} doit ${a.verb} ${i}${t.maximum.toString()} ${a.unit ?? "élément(s)"}` : `Trop grand : ${t.origin ?? "valeur"} doit être ${i}${t.maximum.toString()}`;
      }
      case "too_small": {
        const i = t.inclusive ? ">=" : ">", a = n(t.origin);
        return a ? `Trop petit : ${t.origin} doit ${a.verb} ${i}${t.minimum.toString()} ${a.unit}` : `Trop petit : ${t.origin} doit être ${i}${t.minimum.toString()}`;
      }
      case "invalid_format": {
        const i = t;
        return i.format === "starts_with" ? `Chaîne invalide : doit commencer par "${i.prefix}"` : i.format === "ends_with" ? `Chaîne invalide : doit se terminer par "${i.suffix}"` : i.format === "includes" ? `Chaîne invalide : doit inclure "${i.includes}"` : i.format === "regex" ? `Chaîne invalide : doit correspondre au modèle ${i.pattern}` : `${r[i.format] ?? t.format} invalide`;
      }
      case "not_multiple_of":
        return `Nombre invalide : doit être un multiple de ${t.divisor}`;
      case "unrecognized_keys":
        return `Clé${t.keys.length > 1 ? "s" : ""} non reconnue${t.keys.length > 1 ? "s" : ""} : ${b(t.keys, ", ")}`;
      case "invalid_key":
        return `Clé invalide dans ${t.origin}`;
      case "invalid_union":
        return "Entrée invalide";
      case "invalid_element":
        return `Valeur invalide dans ${t.origin}`;
      default:
        return "Entrée invalide";
    }
  };
};
function Bv() {
  return {
    localeError: Mv()
  };
}
const Vv = () => {
  const e = {
    string: { unit: "caractères", verb: "avoir" },
    file: { unit: "octets", verb: "avoir" },
    array: { unit: "éléments", verb: "avoir" },
    set: { unit: "éléments", verb: "avoir" }
  };
  function n(t) {
    return e[t] ?? null;
  }
  const r = {
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
  return (t) => {
    switch (t.code) {
      case "invalid_type": {
        const i = o[t.expected] ?? t.expected, a = z(t.input), c = o[a] ?? a;
        return /^[A-Z]/.test(t.expected) ? `Entrée invalide : attendu instanceof ${t.expected}, reçu ${c}` : `Entrée invalide : attendu ${i}, reçu ${c}`;
      }
      case "invalid_value":
        return t.values.length === 1 ? `Entrée invalide : attendu ${x(t.values[0])}` : `Option invalide : attendu l'une des valeurs suivantes ${b(t.values, "|")}`;
      case "too_big": {
        const i = t.inclusive ? "≤" : "<", a = n(t.origin);
        return a ? `Trop grand : attendu que ${t.origin ?? "la valeur"} ait ${i}${t.maximum.toString()} ${a.unit}` : `Trop grand : attendu que ${t.origin ?? "la valeur"} soit ${i}${t.maximum.toString()}`;
      }
      case "too_small": {
        const i = t.inclusive ? "≥" : ">", a = n(t.origin);
        return a ? `Trop petit : attendu que ${t.origin} ait ${i}${t.minimum.toString()} ${a.unit}` : `Trop petit : attendu que ${t.origin} soit ${i}${t.minimum.toString()}`;
      }
      case "invalid_format": {
        const i = t;
        return i.format === "starts_with" ? `Chaîne invalide : doit commencer par "${i.prefix}"` : i.format === "ends_with" ? `Chaîne invalide : doit se terminer par "${i.suffix}"` : i.format === "includes" ? `Chaîne invalide : doit inclure "${i.includes}"` : i.format === "regex" ? `Chaîne invalide : doit correspondre au motif ${i.pattern}` : `${r[i.format] ?? t.format} invalide`;
      }
      case "not_multiple_of":
        return `Nombre invalide : doit être un multiple de ${t.divisor}`;
      case "unrecognized_keys":
        return `Clé${t.keys.length > 1 ? "s" : ""} non reconnue${t.keys.length > 1 ? "s" : ""} : ${b(t.keys, ", ")}`;
      case "invalid_key":
        return `Clé invalide dans ${t.origin}`;
      case "invalid_union":
        return "Entrée invalide";
      case "invalid_element":
        return `Valeur invalide dans ${t.origin}`;
      default:
        return "Entrée invalide";
    }
  };
};
function Gv() {
  return {
    localeError: Vv()
  };
}
const Wv = () => {
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
  }, n = {
    string: { unit: "תווים", shortLabel: "קצר", longLabel: "ארוך" },
    file: { unit: "בייטים", shortLabel: "קטן", longLabel: "גדול" },
    array: { unit: "פריטים", shortLabel: "קטן", longLabel: "גדול" },
    set: { unit: "פריטים", shortLabel: "קטן", longLabel: "גדול" },
    number: { unit: "", shortLabel: "קטן", longLabel: "גדול" }
    // no unit
  }, r = (s) => s ? e[s] : void 0, o = (s) => {
    const l = r(s);
    return l ? l.label : s ?? e.unknown.label;
  }, t = (s) => `ה${o(s)}`, i = (s) => (r(s)?.gender ?? "m") === "f" ? "צריכה להיות" : "צריך להיות", a = (s) => s ? n[s] ?? null : null, c = {
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
  }, u = {
    nan: "NaN"
  };
  return (s) => {
    switch (s.code) {
      case "invalid_type": {
        const l = s.expected, d = u[l ?? ""] ?? o(l), g = z(s.input), h = u[g] ?? e[g]?.label ?? g;
        return /^[A-Z]/.test(s.expected) ? `קלט לא תקין: צריך להיות instanceof ${s.expected}, התקבל ${h}` : `קלט לא תקין: צריך להיות ${d}, התקבל ${h}`;
      }
      case "invalid_value": {
        if (s.values.length === 1)
          return `ערך לא תקין: הערך חייב להיות ${x(s.values[0])}`;
        const l = s.values.map((h) => x(h));
        if (s.values.length === 2)
          return `ערך לא תקין: האפשרויות המתאימות הן ${l[0]} או ${l[1]}`;
        const d = l[l.length - 1];
        return `ערך לא תקין: האפשרויות המתאימות הן ${l.slice(0, -1).join(", ")} או ${d}`;
      }
      case "too_big": {
        const l = a(s.origin), d = t(s.origin ?? "value");
        if (s.origin === "string")
          return `${l?.longLabel ?? "ארוך"} מדי: ${d} צריכה להכיל ${s.maximum.toString()} ${l?.unit ?? ""} ${s.inclusive ? "או פחות" : "לכל היותר"}`.trim();
        if (s.origin === "number") {
          const p = s.inclusive ? `קטן או שווה ל-${s.maximum}` : `קטן מ-${s.maximum}`;
          return `גדול מדי: ${d} צריך להיות ${p}`;
        }
        if (s.origin === "array" || s.origin === "set") {
          const p = s.origin === "set" ? "צריכה" : "צריך", $ = s.inclusive ? `${s.maximum} ${l?.unit ?? ""} או פחות` : `פחות מ-${s.maximum} ${l?.unit ?? ""}`;
          return `גדול מדי: ${d} ${p} להכיל ${$}`.trim();
        }
        const g = s.inclusive ? "<=" : "<", h = i(s.origin ?? "value");
        return l?.unit ? `${l.longLabel} מדי: ${d} ${h} ${g}${s.maximum.toString()} ${l.unit}` : `${l?.longLabel ?? "גדול"} מדי: ${d} ${h} ${g}${s.maximum.toString()}`;
      }
      case "too_small": {
        const l = a(s.origin), d = t(s.origin ?? "value");
        if (s.origin === "string")
          return `${l?.shortLabel ?? "קצר"} מדי: ${d} צריכה להכיל ${s.minimum.toString()} ${l?.unit ?? ""} ${s.inclusive ? "או יותר" : "לפחות"}`.trim();
        if (s.origin === "number") {
          const p = s.inclusive ? `גדול או שווה ל-${s.minimum}` : `גדול מ-${s.minimum}`;
          return `קטן מדי: ${d} צריך להיות ${p}`;
        }
        if (s.origin === "array" || s.origin === "set") {
          const p = s.origin === "set" ? "צריכה" : "צריך";
          if (s.minimum === 1 && s.inclusive) {
            const y = (s.origin === "set", "לפחות פריט אחד");
            return `קטן מדי: ${d} ${p} להכיל ${y}`;
          }
          const $ = s.inclusive ? `${s.minimum} ${l?.unit ?? ""} או יותר` : `יותר מ-${s.minimum} ${l?.unit ?? ""}`;
          return `קטן מדי: ${d} ${p} להכיל ${$}`.trim();
        }
        const g = s.inclusive ? ">=" : ">", h = i(s.origin ?? "value");
        return l?.unit ? `${l.shortLabel} מדי: ${d} ${h} ${g}${s.minimum.toString()} ${l.unit}` : `${l?.shortLabel ?? "קטן"} מדי: ${d} ${h} ${g}${s.minimum.toString()}`;
      }
      case "invalid_format": {
        const l = s;
        if (l.format === "starts_with")
          return `המחרוזת חייבת להתחיל ב "${l.prefix}"`;
        if (l.format === "ends_with")
          return `המחרוזת חייבת להסתיים ב "${l.suffix}"`;
        if (l.format === "includes")
          return `המחרוזת חייבת לכלול "${l.includes}"`;
        if (l.format === "regex")
          return `המחרוזת חייבת להתאים לתבנית ${l.pattern}`;
        const d = c[l.format], g = d?.label ?? l.format, p = (d?.gender ?? "m") === "f" ? "תקינה" : "תקין";
        return `${g} לא ${p}`;
      }
      case "not_multiple_of":
        return `מספר לא תקין: חייב להיות מכפלה של ${s.divisor}`;
      case "unrecognized_keys":
        return `מפתח${s.keys.length > 1 ? "ות" : ""} לא מזוה${s.keys.length > 1 ? "ים" : "ה"}: ${b(s.keys, ", ")}`;
      case "invalid_key":
        return "שדה לא תקין באובייקט";
      case "invalid_union":
        return "קלט לא תקין";
      case "invalid_element":
        return `ערך לא תקין ב${t(s.origin ?? "array")}`;
      default:
        return "קלט לא תקין";
    }
  };
};
function qv() {
  return {
    localeError: Wv()
  };
}
const Kv = () => {
  const e = {
    string: { unit: "karakter", verb: "legyen" },
    file: { unit: "byte", verb: "legyen" },
    array: { unit: "elem", verb: "legyen" },
    set: { unit: "elem", verb: "legyen" }
  };
  function n(t) {
    return e[t] ?? null;
  }
  const r = {
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
  return (t) => {
    switch (t.code) {
      case "invalid_type": {
        const i = o[t.expected] ?? t.expected, a = z(t.input), c = o[a] ?? a;
        return /^[A-Z]/.test(t.expected) ? `Érvénytelen bemenet: a várt érték instanceof ${t.expected}, a kapott érték ${c}` : `Érvénytelen bemenet: a várt érték ${i}, a kapott érték ${c}`;
      }
      case "invalid_value":
        return t.values.length === 1 ? `Érvénytelen bemenet: a várt érték ${x(t.values[0])}` : `Érvénytelen opció: valamelyik érték várt ${b(t.values, "|")}`;
      case "too_big": {
        const i = t.inclusive ? "<=" : "<", a = n(t.origin);
        return a ? `Túl nagy: ${t.origin ?? "érték"} mérete túl nagy ${i}${t.maximum.toString()} ${a.unit ?? "elem"}` : `Túl nagy: a bemeneti érték ${t.origin ?? "érték"} túl nagy: ${i}${t.maximum.toString()}`;
      }
      case "too_small": {
        const i = t.inclusive ? ">=" : ">", a = n(t.origin);
        return a ? `Túl kicsi: a bemeneti érték ${t.origin} mérete túl kicsi ${i}${t.minimum.toString()} ${a.unit}` : `Túl kicsi: a bemeneti érték ${t.origin} túl kicsi ${i}${t.minimum.toString()}`;
      }
      case "invalid_format": {
        const i = t;
        return i.format === "starts_with" ? `Érvénytelen string: "${i.prefix}" értékkel kell kezdődnie` : i.format === "ends_with" ? `Érvénytelen string: "${i.suffix}" értékkel kell végződnie` : i.format === "includes" ? `Érvénytelen string: "${i.includes}" értéket kell tartalmaznia` : i.format === "regex" ? `Érvénytelen string: ${i.pattern} mintának kell megfelelnie` : `Érvénytelen ${r[i.format] ?? t.format}`;
      }
      case "not_multiple_of":
        return `Érvénytelen szám: ${t.divisor} többszörösének kell lennie`;
      case "unrecognized_keys":
        return `Ismeretlen kulcs${t.keys.length > 1 ? "s" : ""}: ${b(t.keys, ", ")}`;
      case "invalid_key":
        return `Érvénytelen kulcs ${t.origin}`;
      case "invalid_union":
        return "Érvénytelen bemenet";
      case "invalid_element":
        return `Érvénytelen érték: ${t.origin}`;
      default:
        return "Érvénytelen bemenet";
    }
  };
};
function Xv() {
  return {
    localeError: Kv()
  };
}
function qc(e, n, r) {
  return Math.abs(e) === 1 ? n : r;
}
function We(e) {
  if (!e)
    return "";
  const n = ["ա", "ե", "ը", "ի", "ո", "ու", "օ"], r = e[e.length - 1];
  return e + (n.includes(r) ? "ն" : "ը");
}
const Hv = () => {
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
  function n(t) {
    return e[t] ?? null;
  }
  const r = {
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
  return (t) => {
    switch (t.code) {
      case "invalid_type": {
        const i = o[t.expected] ?? t.expected, a = z(t.input), c = o[a] ?? a;
        return /^[A-Z]/.test(t.expected) ? `Սխալ մուտքագրում․ սպասվում էր instanceof ${t.expected}, ստացվել է ${c}` : `Սխալ մուտքագրում․ սպասվում էր ${i}, ստացվել է ${c}`;
      }
      case "invalid_value":
        return t.values.length === 1 ? `Սխալ մուտքագրում․ սպասվում էր ${x(t.values[1])}` : `Սխալ տարբերակ․ սպասվում էր հետևյալներից մեկը՝ ${b(t.values, "|")}`;
      case "too_big": {
        const i = t.inclusive ? "<=" : "<", a = n(t.origin);
        if (a) {
          const c = Number(t.maximum), u = qc(c, a.unit.one, a.unit.many);
          return `Չափազանց մեծ արժեք․ սպասվում է, որ ${We(t.origin ?? "արժեք")} կունենա ${i}${t.maximum.toString()} ${u}`;
        }
        return `Չափազանց մեծ արժեք․ սպասվում է, որ ${We(t.origin ?? "արժեք")} լինի ${i}${t.maximum.toString()}`;
      }
      case "too_small": {
        const i = t.inclusive ? ">=" : ">", a = n(t.origin);
        if (a) {
          const c = Number(t.minimum), u = qc(c, a.unit.one, a.unit.many);
          return `Չափազանց փոքր արժեք․ սպասվում է, որ ${We(t.origin)} կունենա ${i}${t.minimum.toString()} ${u}`;
        }
        return `Չափազանց փոքր արժեք․ սպասվում է, որ ${We(t.origin)} լինի ${i}${t.minimum.toString()}`;
      }
      case "invalid_format": {
        const i = t;
        return i.format === "starts_with" ? `Սխալ տող․ պետք է սկսվի "${i.prefix}"-ով` : i.format === "ends_with" ? `Սխալ տող․ պետք է ավարտվի "${i.suffix}"-ով` : i.format === "includes" ? `Սխալ տող․ պետք է պարունակի "${i.includes}"` : i.format === "regex" ? `Սխալ տող․ պետք է համապատասխանի ${i.pattern} ձևաչափին` : `Սխալ ${r[i.format] ?? t.format}`;
      }
      case "not_multiple_of":
        return `Սխալ թիվ․ պետք է բազմապատիկ լինի ${t.divisor}-ի`;
      case "unrecognized_keys":
        return `Չճանաչված բանալի${t.keys.length > 1 ? "ներ" : ""}. ${b(t.keys, ", ")}`;
      case "invalid_key":
        return `Սխալ բանալի ${We(t.origin)}-ում`;
      case "invalid_union":
        return "Սխալ մուտքագրում";
      case "invalid_element":
        return `Սխալ արժեք ${We(t.origin)}-ում`;
      default:
        return "Սխալ մուտքագրում";
    }
  };
};
function Yv() {
  return {
    localeError: Hv()
  };
}
const Qv = () => {
  const e = {
    string: { unit: "karakter", verb: "memiliki" },
    file: { unit: "byte", verb: "memiliki" },
    array: { unit: "item", verb: "memiliki" },
    set: { unit: "item", verb: "memiliki" }
  };
  function n(t) {
    return e[t] ?? null;
  }
  const r = {
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
  return (t) => {
    switch (t.code) {
      case "invalid_type": {
        const i = o[t.expected] ?? t.expected, a = z(t.input), c = o[a] ?? a;
        return /^[A-Z]/.test(t.expected) ? `Input tidak valid: diharapkan instanceof ${t.expected}, diterima ${c}` : `Input tidak valid: diharapkan ${i}, diterima ${c}`;
      }
      case "invalid_value":
        return t.values.length === 1 ? `Input tidak valid: diharapkan ${x(t.values[0])}` : `Pilihan tidak valid: diharapkan salah satu dari ${b(t.values, "|")}`;
      case "too_big": {
        const i = t.inclusive ? "<=" : "<", a = n(t.origin);
        return a ? `Terlalu besar: diharapkan ${t.origin ?? "value"} memiliki ${i}${t.maximum.toString()} ${a.unit ?? "elemen"}` : `Terlalu besar: diharapkan ${t.origin ?? "value"} menjadi ${i}${t.maximum.toString()}`;
      }
      case "too_small": {
        const i = t.inclusive ? ">=" : ">", a = n(t.origin);
        return a ? `Terlalu kecil: diharapkan ${t.origin} memiliki ${i}${t.minimum.toString()} ${a.unit}` : `Terlalu kecil: diharapkan ${t.origin} menjadi ${i}${t.minimum.toString()}`;
      }
      case "invalid_format": {
        const i = t;
        return i.format === "starts_with" ? `String tidak valid: harus dimulai dengan "${i.prefix}"` : i.format === "ends_with" ? `String tidak valid: harus berakhir dengan "${i.suffix}"` : i.format === "includes" ? `String tidak valid: harus menyertakan "${i.includes}"` : i.format === "regex" ? `String tidak valid: harus sesuai pola ${i.pattern}` : `${r[i.format] ?? t.format} tidak valid`;
      }
      case "not_multiple_of":
        return `Angka tidak valid: harus kelipatan dari ${t.divisor}`;
      case "unrecognized_keys":
        return `Kunci tidak dikenali ${t.keys.length > 1 ? "s" : ""}: ${b(t.keys, ", ")}`;
      case "invalid_key":
        return `Kunci tidak valid di ${t.origin}`;
      case "invalid_union":
        return "Input tidak valid";
      case "invalid_element":
        return `Nilai tidak valid di ${t.origin}`;
      default:
        return "Input tidak valid";
    }
  };
};
function eh() {
  return {
    localeError: Qv()
  };
}
const th = () => {
  const e = {
    string: { unit: "stafi", verb: "að hafa" },
    file: { unit: "bæti", verb: "að hafa" },
    array: { unit: "hluti", verb: "að hafa" },
    set: { unit: "hluti", verb: "að hafa" }
  };
  function n(t) {
    return e[t] ?? null;
  }
  const r = {
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
  return (t) => {
    switch (t.code) {
      case "invalid_type": {
        const i = o[t.expected] ?? t.expected, a = z(t.input), c = o[a] ?? a;
        return /^[A-Z]/.test(t.expected) ? `Rangt gildi: Þú slóst inn ${c} þar sem á að vera instanceof ${t.expected}` : `Rangt gildi: Þú slóst inn ${c} þar sem á að vera ${i}`;
      }
      case "invalid_value":
        return t.values.length === 1 ? `Rangt gildi: gert ráð fyrir ${x(t.values[0])}` : `Ógilt val: má vera eitt af eftirfarandi ${b(t.values, "|")}`;
      case "too_big": {
        const i = t.inclusive ? "<=" : "<", a = n(t.origin);
        return a ? `Of stórt: gert er ráð fyrir að ${t.origin ?? "gildi"} hafi ${i}${t.maximum.toString()} ${a.unit ?? "hluti"}` : `Of stórt: gert er ráð fyrir að ${t.origin ?? "gildi"} sé ${i}${t.maximum.toString()}`;
      }
      case "too_small": {
        const i = t.inclusive ? ">=" : ">", a = n(t.origin);
        return a ? `Of lítið: gert er ráð fyrir að ${t.origin} hafi ${i}${t.minimum.toString()} ${a.unit}` : `Of lítið: gert er ráð fyrir að ${t.origin} sé ${i}${t.minimum.toString()}`;
      }
      case "invalid_format": {
        const i = t;
        return i.format === "starts_with" ? `Ógildur strengur: verður að byrja á "${i.prefix}"` : i.format === "ends_with" ? `Ógildur strengur: verður að enda á "${i.suffix}"` : i.format === "includes" ? `Ógildur strengur: verður að innihalda "${i.includes}"` : i.format === "regex" ? `Ógildur strengur: verður að fylgja mynstri ${i.pattern}` : `Rangt ${r[i.format] ?? t.format}`;
      }
      case "not_multiple_of":
        return `Röng tala: verður að vera margfeldi af ${t.divisor}`;
      case "unrecognized_keys":
        return `Óþekkt ${t.keys.length > 1 ? "ir lyklar" : "ur lykill"}: ${b(t.keys, ", ")}`;
      case "invalid_key":
        return `Rangur lykill í ${t.origin}`;
      case "invalid_union":
        return "Rangt gildi";
      case "invalid_element":
        return `Rangt gildi í ${t.origin}`;
      default:
        return "Rangt gildi";
    }
  };
};
function nh() {
  return {
    localeError: th()
  };
}
const rh = () => {
  const e = {
    string: { unit: "caratteri", verb: "avere" },
    file: { unit: "byte", verb: "avere" },
    array: { unit: "elementi", verb: "avere" },
    set: { unit: "elementi", verb: "avere" }
  };
  function n(t) {
    return e[t] ?? null;
  }
  const r = {
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
  return (t) => {
    switch (t.code) {
      case "invalid_type": {
        const i = o[t.expected] ?? t.expected, a = z(t.input), c = o[a] ?? a;
        return /^[A-Z]/.test(t.expected) ? `Input non valido: atteso instanceof ${t.expected}, ricevuto ${c}` : `Input non valido: atteso ${i}, ricevuto ${c}`;
      }
      case "invalid_value":
        return t.values.length === 1 ? `Input non valido: atteso ${x(t.values[0])}` : `Opzione non valida: atteso uno tra ${b(t.values, "|")}`;
      case "too_big": {
        const i = t.inclusive ? "<=" : "<", a = n(t.origin);
        return a ? `Troppo grande: ${t.origin ?? "valore"} deve avere ${i}${t.maximum.toString()} ${a.unit ?? "elementi"}` : `Troppo grande: ${t.origin ?? "valore"} deve essere ${i}${t.maximum.toString()}`;
      }
      case "too_small": {
        const i = t.inclusive ? ">=" : ">", a = n(t.origin);
        return a ? `Troppo piccolo: ${t.origin} deve avere ${i}${t.minimum.toString()} ${a.unit}` : `Troppo piccolo: ${t.origin} deve essere ${i}${t.minimum.toString()}`;
      }
      case "invalid_format": {
        const i = t;
        return i.format === "starts_with" ? `Stringa non valida: deve iniziare con "${i.prefix}"` : i.format === "ends_with" ? `Stringa non valida: deve terminare con "${i.suffix}"` : i.format === "includes" ? `Stringa non valida: deve includere "${i.includes}"` : i.format === "regex" ? `Stringa non valida: deve corrispondere al pattern ${i.pattern}` : `Invalid ${r[i.format] ?? t.format}`;
      }
      case "not_multiple_of":
        return `Numero non valido: deve essere un multiplo di ${t.divisor}`;
      case "unrecognized_keys":
        return `Chiav${t.keys.length > 1 ? "i" : "e"} non riconosciut${t.keys.length > 1 ? "e" : "a"}: ${b(t.keys, ", ")}`;
      case "invalid_key":
        return `Chiave non valida in ${t.origin}`;
      case "invalid_union":
        return "Input non valido";
      case "invalid_element":
        return `Valore non valido in ${t.origin}`;
      default:
        return "Input non valido";
    }
  };
};
function ih() {
  return {
    localeError: rh()
  };
}
const oh = () => {
  const e = {
    string: { unit: "文字", verb: "である" },
    file: { unit: "バイト", verb: "である" },
    array: { unit: "要素", verb: "である" },
    set: { unit: "要素", verb: "である" }
  };
  function n(t) {
    return e[t] ?? null;
  }
  const r = {
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
  return (t) => {
    switch (t.code) {
      case "invalid_type": {
        const i = o[t.expected] ?? t.expected, a = z(t.input), c = o[a] ?? a;
        return /^[A-Z]/.test(t.expected) ? `無効な入力: instanceof ${t.expected}が期待されましたが、${c}が入力されました` : `無効な入力: ${i}が期待されましたが、${c}が入力されました`;
      }
      case "invalid_value":
        return t.values.length === 1 ? `無効な入力: ${x(t.values[0])}が期待されました` : `無効な選択: ${b(t.values, "、")}のいずれかである必要があります`;
      case "too_big": {
        const i = t.inclusive ? "以下である" : "より小さい", a = n(t.origin);
        return a ? `大きすぎる値: ${t.origin ?? "値"}は${t.maximum.toString()}${a.unit ?? "要素"}${i}必要があります` : `大きすぎる値: ${t.origin ?? "値"}は${t.maximum.toString()}${i}必要があります`;
      }
      case "too_small": {
        const i = t.inclusive ? "以上である" : "より大きい", a = n(t.origin);
        return a ? `小さすぎる値: ${t.origin}は${t.minimum.toString()}${a.unit}${i}必要があります` : `小さすぎる値: ${t.origin}は${t.minimum.toString()}${i}必要があります`;
      }
      case "invalid_format": {
        const i = t;
        return i.format === "starts_with" ? `無効な文字列: "${i.prefix}"で始まる必要があります` : i.format === "ends_with" ? `無効な文字列: "${i.suffix}"で終わる必要があります` : i.format === "includes" ? `無効な文字列: "${i.includes}"を含む必要があります` : i.format === "regex" ? `無効な文字列: パターン${i.pattern}に一致する必要があります` : `無効な${r[i.format] ?? t.format}`;
      }
      case "not_multiple_of":
        return `無効な数値: ${t.divisor}の倍数である必要があります`;
      case "unrecognized_keys":
        return `認識されていないキー${t.keys.length > 1 ? "群" : ""}: ${b(t.keys, "、")}`;
      case "invalid_key":
        return `${t.origin}内の無効なキー`;
      case "invalid_union":
        return "無効な入力";
      case "invalid_element":
        return `${t.origin}内の無効な値`;
      default:
        return "無効な入力";
    }
  };
};
function ah() {
  return {
    localeError: oh()
  };
}
const ch = () => {
  const e = {
    string: { unit: "სიმბოლო", verb: "უნდა შეიცავდეს" },
    file: { unit: "ბაიტი", verb: "უნდა შეიცავდეს" },
    array: { unit: "ელემენტი", verb: "უნდა შეიცავდეს" },
    set: { unit: "ელემენტი", verb: "უნდა შეიცავდეს" }
  };
  function n(t) {
    return e[t] ?? null;
  }
  const r = {
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
  return (t) => {
    switch (t.code) {
      case "invalid_type": {
        const i = o[t.expected] ?? t.expected, a = z(t.input), c = o[a] ?? a;
        return /^[A-Z]/.test(t.expected) ? `არასწორი შეყვანა: მოსალოდნელი instanceof ${t.expected}, მიღებული ${c}` : `არასწორი შეყვანა: მოსალოდნელი ${i}, მიღებული ${c}`;
      }
      case "invalid_value":
        return t.values.length === 1 ? `არასწორი შეყვანა: მოსალოდნელი ${x(t.values[0])}` : `არასწორი ვარიანტი: მოსალოდნელია ერთ-ერთი ${b(t.values, "|")}-დან`;
      case "too_big": {
        const i = t.inclusive ? "<=" : "<", a = n(t.origin);
        return a ? `ზედმეტად დიდი: მოსალოდნელი ${t.origin ?? "მნიშვნელობა"} ${a.verb} ${i}${t.maximum.toString()} ${a.unit}` : `ზედმეტად დიდი: მოსალოდნელი ${t.origin ?? "მნიშვნელობა"} იყოს ${i}${t.maximum.toString()}`;
      }
      case "too_small": {
        const i = t.inclusive ? ">=" : ">", a = n(t.origin);
        return a ? `ზედმეტად პატარა: მოსალოდნელი ${t.origin} ${a.verb} ${i}${t.minimum.toString()} ${a.unit}` : `ზედმეტად პატარა: მოსალოდნელი ${t.origin} იყოს ${i}${t.minimum.toString()}`;
      }
      case "invalid_format": {
        const i = t;
        return i.format === "starts_with" ? `არასწორი სტრინგი: უნდა იწყებოდეს "${i.prefix}"-ით` : i.format === "ends_with" ? `არასწორი სტრინგი: უნდა მთავრდებოდეს "${i.suffix}"-ით` : i.format === "includes" ? `არასწორი სტრინგი: უნდა შეიცავდეს "${i.includes}"-ს` : i.format === "regex" ? `არასწორი სტრინგი: უნდა შეესაბამებოდეს შაბლონს ${i.pattern}` : `არასწორი ${r[i.format] ?? t.format}`;
      }
      case "not_multiple_of":
        return `არასწორი რიცხვი: უნდა იყოს ${t.divisor}-ის ჯერადი`;
      case "unrecognized_keys":
        return `უცნობი გასაღებ${t.keys.length > 1 ? "ები" : "ი"}: ${b(t.keys, ", ")}`;
      case "invalid_key":
        return `არასწორი გასაღები ${t.origin}-ში`;
      case "invalid_union":
        return "არასწორი შეყვანა";
      case "invalid_element":
        return `არასწორი მნიშვნელობა ${t.origin}-ში`;
      default:
        return "არასწორი შეყვანა";
    }
  };
};
function sh() {
  return {
    localeError: ch()
  };
}
const uh = () => {
  const e = {
    string: { unit: "តួអក្សរ", verb: "គួរមាន" },
    file: { unit: "បៃ", verb: "គួរមាន" },
    array: { unit: "ធាតុ", verb: "គួរមាន" },
    set: { unit: "ធាតុ", verb: "គួរមាន" }
  };
  function n(t) {
    return e[t] ?? null;
  }
  const r = {
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
  return (t) => {
    switch (t.code) {
      case "invalid_type": {
        const i = o[t.expected] ?? t.expected, a = z(t.input), c = o[a] ?? a;
        return /^[A-Z]/.test(t.expected) ? `ទិន្នន័យបញ្ចូលមិនត្រឹមត្រូវ៖ ត្រូវការ instanceof ${t.expected} ប៉ុន្តែទទួលបាន ${c}` : `ទិន្នន័យបញ្ចូលមិនត្រឹមត្រូវ៖ ត្រូវការ ${i} ប៉ុន្តែទទួលបាន ${c}`;
      }
      case "invalid_value":
        return t.values.length === 1 ? `ទិន្នន័យបញ្ចូលមិនត្រឹមត្រូវ៖ ត្រូវការ ${x(t.values[0])}` : `ជម្រើសមិនត្រឹមត្រូវ៖ ត្រូវជាមួយក្នុងចំណោម ${b(t.values, "|")}`;
      case "too_big": {
        const i = t.inclusive ? "<=" : "<", a = n(t.origin);
        return a ? `ធំពេក៖ ត្រូវការ ${t.origin ?? "តម្លៃ"} ${i} ${t.maximum.toString()} ${a.unit ?? "ធាតុ"}` : `ធំពេក៖ ត្រូវការ ${t.origin ?? "តម្លៃ"} ${i} ${t.maximum.toString()}`;
      }
      case "too_small": {
        const i = t.inclusive ? ">=" : ">", a = n(t.origin);
        return a ? `តូចពេក៖ ត្រូវការ ${t.origin} ${i} ${t.minimum.toString()} ${a.unit}` : `តូចពេក៖ ត្រូវការ ${t.origin} ${i} ${t.minimum.toString()}`;
      }
      case "invalid_format": {
        const i = t;
        return i.format === "starts_with" ? `ខ្សែអក្សរមិនត្រឹមត្រូវ៖ ត្រូវចាប់ផ្តើមដោយ "${i.prefix}"` : i.format === "ends_with" ? `ខ្សែអក្សរមិនត្រឹមត្រូវ៖ ត្រូវបញ្ចប់ដោយ "${i.suffix}"` : i.format === "includes" ? `ខ្សែអក្សរមិនត្រឹមត្រូវ៖ ត្រូវមាន "${i.includes}"` : i.format === "regex" ? `ខ្សែអក្សរមិនត្រឹមត្រូវ៖ ត្រូវតែផ្គូផ្គងនឹងទម្រង់ដែលបានកំណត់ ${i.pattern}` : `មិនត្រឹមត្រូវ៖ ${r[i.format] ?? t.format}`;
      }
      case "not_multiple_of":
        return `លេខមិនត្រឹមត្រូវ៖ ត្រូវតែជាពហុគុណនៃ ${t.divisor}`;
      case "unrecognized_keys":
        return `រកឃើញសោមិនស្គាល់៖ ${b(t.keys, ", ")}`;
      case "invalid_key":
        return `សោមិនត្រឹមត្រូវនៅក្នុង ${t.origin}`;
      case "invalid_union":
        return "ទិន្នន័យមិនត្រឹមត្រូវ";
      case "invalid_element":
        return `ទិន្នន័យមិនត្រឹមត្រូវនៅក្នុង ${t.origin}`;
      default:
        return "ទិន្នន័យមិនត្រឹមត្រូវ";
    }
  };
};
function hd() {
  return {
    localeError: uh()
  };
}
function lh() {
  return hd();
}
const dh = () => {
  const e = {
    string: { unit: "문자", verb: "to have" },
    file: { unit: "바이트", verb: "to have" },
    array: { unit: "개", verb: "to have" },
    set: { unit: "개", verb: "to have" }
  };
  function n(t) {
    return e[t] ?? null;
  }
  const r = {
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
  return (t) => {
    switch (t.code) {
      case "invalid_type": {
        const i = o[t.expected] ?? t.expected, a = z(t.input), c = o[a] ?? a;
        return /^[A-Z]/.test(t.expected) ? `잘못된 입력: 예상 타입은 instanceof ${t.expected}, 받은 타입은 ${c}입니다` : `잘못된 입력: 예상 타입은 ${i}, 받은 타입은 ${c}입니다`;
      }
      case "invalid_value":
        return t.values.length === 1 ? `잘못된 입력: 값은 ${x(t.values[0])} 이어야 합니다` : `잘못된 옵션: ${b(t.values, "또는 ")} 중 하나여야 합니다`;
      case "too_big": {
        const i = t.inclusive ? "이하" : "미만", a = i === "미만" ? "이어야 합니다" : "여야 합니다", c = n(t.origin), u = c?.unit ?? "요소";
        return c ? `${t.origin ?? "값"}이 너무 큽니다: ${t.maximum.toString()}${u} ${i}${a}` : `${t.origin ?? "값"}이 너무 큽니다: ${t.maximum.toString()} ${i}${a}`;
      }
      case "too_small": {
        const i = t.inclusive ? "이상" : "초과", a = i === "이상" ? "이어야 합니다" : "여야 합니다", c = n(t.origin), u = c?.unit ?? "요소";
        return c ? `${t.origin ?? "값"}이 너무 작습니다: ${t.minimum.toString()}${u} ${i}${a}` : `${t.origin ?? "값"}이 너무 작습니다: ${t.minimum.toString()} ${i}${a}`;
      }
      case "invalid_format": {
        const i = t;
        return i.format === "starts_with" ? `잘못된 문자열: "${i.prefix}"(으)로 시작해야 합니다` : i.format === "ends_with" ? `잘못된 문자열: "${i.suffix}"(으)로 끝나야 합니다` : i.format === "includes" ? `잘못된 문자열: "${i.includes}"을(를) 포함해야 합니다` : i.format === "regex" ? `잘못된 문자열: 정규식 ${i.pattern} 패턴과 일치해야 합니다` : `잘못된 ${r[i.format] ?? t.format}`;
      }
      case "not_multiple_of":
        return `잘못된 숫자: ${t.divisor}의 배수여야 합니다`;
      case "unrecognized_keys":
        return `인식할 수 없는 키: ${b(t.keys, ", ")}`;
      case "invalid_key":
        return `잘못된 키: ${t.origin}`;
      case "invalid_union":
        return "잘못된 입력";
      case "invalid_element":
        return `잘못된 값: ${t.origin}`;
      default:
        return "잘못된 입력";
    }
  };
};
function mh() {
  return {
    localeError: dh()
  };
}
const Ot = (e) => e.charAt(0).toUpperCase() + e.slice(1);
function Kc(e) {
  const n = Math.abs(e), r = n % 10, o = n % 100;
  return o >= 11 && o <= 19 || r === 0 ? "many" : r === 1 ? "one" : "few";
}
const fh = () => {
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
  function n(t, i, a, c) {
    const u = e[t] ?? null;
    return u === null ? u : {
      unit: u.unit[i],
      verb: u.verb[c][a ? "inclusive" : "notInclusive"]
    };
  }
  const r = {
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
  return (t) => {
    switch (t.code) {
      case "invalid_type": {
        const i = o[t.expected] ?? t.expected, a = z(t.input), c = o[a] ?? a;
        return /^[A-Z]/.test(t.expected) ? `Gautas tipas ${c}, o tikėtasi - instanceof ${t.expected}` : `Gautas tipas ${c}, o tikėtasi - ${i}`;
      }
      case "invalid_value":
        return t.values.length === 1 ? `Privalo būti ${x(t.values[0])}` : `Privalo būti vienas iš ${b(t.values, "|")} pasirinkimų`;
      case "too_big": {
        const i = o[t.origin] ?? t.origin, a = n(t.origin, Kc(Number(t.maximum)), t.inclusive ?? !1, "smaller");
        if (a?.verb)
          return `${Ot(i ?? t.origin ?? "reikšmė")} ${a.verb} ${t.maximum.toString()} ${a.unit ?? "elementų"}`;
        const c = t.inclusive ? "ne didesnis kaip" : "mažesnis kaip";
        return `${Ot(i ?? t.origin ?? "reikšmė")} turi būti ${c} ${t.maximum.toString()} ${a?.unit}`;
      }
      case "too_small": {
        const i = o[t.origin] ?? t.origin, a = n(t.origin, Kc(Number(t.minimum)), t.inclusive ?? !1, "bigger");
        if (a?.verb)
          return `${Ot(i ?? t.origin ?? "reikšmė")} ${a.verb} ${t.minimum.toString()} ${a.unit ?? "elementų"}`;
        const c = t.inclusive ? "ne mažesnis kaip" : "didesnis kaip";
        return `${Ot(i ?? t.origin ?? "reikšmė")} turi būti ${c} ${t.minimum.toString()} ${a?.unit}`;
      }
      case "invalid_format": {
        const i = t;
        return i.format === "starts_with" ? `Eilutė privalo prasidėti "${i.prefix}"` : i.format === "ends_with" ? `Eilutė privalo pasibaigti "${i.suffix}"` : i.format === "includes" ? `Eilutė privalo įtraukti "${i.includes}"` : i.format === "regex" ? `Eilutė privalo atitikti ${i.pattern}` : `Neteisingas ${r[i.format] ?? t.format}`;
      }
      case "not_multiple_of":
        return `Skaičius privalo būti ${t.divisor} kartotinis.`;
      case "unrecognized_keys":
        return `Neatpažint${t.keys.length > 1 ? "i" : "as"} rakt${t.keys.length > 1 ? "ai" : "as"}: ${b(t.keys, ", ")}`;
      case "invalid_key":
        return "Rastas klaidingas raktas";
      case "invalid_union":
        return "Klaidinga įvestis";
      case "invalid_element": {
        const i = o[t.origin] ?? t.origin;
        return `${Ot(i ?? t.origin ?? "reikšmė")} turi klaidingą įvestį`;
      }
      default:
        return "Klaidinga įvestis";
    }
  };
};
function ph() {
  return {
    localeError: fh()
  };
}
const gh = () => {
  const e = {
    string: { unit: "знаци", verb: "да имаат" },
    file: { unit: "бајти", verb: "да имаат" },
    array: { unit: "ставки", verb: "да имаат" },
    set: { unit: "ставки", verb: "да имаат" }
  };
  function n(t) {
    return e[t] ?? null;
  }
  const r = {
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
  return (t) => {
    switch (t.code) {
      case "invalid_type": {
        const i = o[t.expected] ?? t.expected, a = z(t.input), c = o[a] ?? a;
        return /^[A-Z]/.test(t.expected) ? `Грешен внес: се очекува instanceof ${t.expected}, примено ${c}` : `Грешен внес: се очекува ${i}, примено ${c}`;
      }
      case "invalid_value":
        return t.values.length === 1 ? `Invalid input: expected ${x(t.values[0])}` : `Грешана опција: се очекува една ${b(t.values, "|")}`;
      case "too_big": {
        const i = t.inclusive ? "<=" : "<", a = n(t.origin);
        return a ? `Премногу голем: се очекува ${t.origin ?? "вредноста"} да има ${i}${t.maximum.toString()} ${a.unit ?? "елементи"}` : `Премногу голем: се очекува ${t.origin ?? "вредноста"} да биде ${i}${t.maximum.toString()}`;
      }
      case "too_small": {
        const i = t.inclusive ? ">=" : ">", a = n(t.origin);
        return a ? `Премногу мал: се очекува ${t.origin} да има ${i}${t.minimum.toString()} ${a.unit}` : `Премногу мал: се очекува ${t.origin} да биде ${i}${t.minimum.toString()}`;
      }
      case "invalid_format": {
        const i = t;
        return i.format === "starts_with" ? `Неважечка низа: мора да започнува со "${i.prefix}"` : i.format === "ends_with" ? `Неважечка низа: мора да завршува со "${i.suffix}"` : i.format === "includes" ? `Неважечка низа: мора да вклучува "${i.includes}"` : i.format === "regex" ? `Неважечка низа: мора да одгоара на патернот ${i.pattern}` : `Invalid ${r[i.format] ?? t.format}`;
      }
      case "not_multiple_of":
        return `Грешен број: мора да биде делив со ${t.divisor}`;
      case "unrecognized_keys":
        return `${t.keys.length > 1 ? "Непрепознаени клучеви" : "Непрепознаен клуч"}: ${b(t.keys, ", ")}`;
      case "invalid_key":
        return `Грешен клуч во ${t.origin}`;
      case "invalid_union":
        return "Грешен внес";
      case "invalid_element":
        return `Грешна вредност во ${t.origin}`;
      default:
        return "Грешен внес";
    }
  };
};
function vh() {
  return {
    localeError: gh()
  };
}
const hh = () => {
  const e = {
    string: { unit: "aksara", verb: "mempunyai" },
    file: { unit: "bait", verb: "mempunyai" },
    array: { unit: "elemen", verb: "mempunyai" },
    set: { unit: "elemen", verb: "mempunyai" }
  };
  function n(t) {
    return e[t] ?? null;
  }
  const r = {
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
  return (t) => {
    switch (t.code) {
      case "invalid_type": {
        const i = o[t.expected] ?? t.expected, a = z(t.input), c = o[a] ?? a;
        return /^[A-Z]/.test(t.expected) ? `Input tidak sah: dijangka instanceof ${t.expected}, diterima ${c}` : `Input tidak sah: dijangka ${i}, diterima ${c}`;
      }
      case "invalid_value":
        return t.values.length === 1 ? `Input tidak sah: dijangka ${x(t.values[0])}` : `Pilihan tidak sah: dijangka salah satu daripada ${b(t.values, "|")}`;
      case "too_big": {
        const i = t.inclusive ? "<=" : "<", a = n(t.origin);
        return a ? `Terlalu besar: dijangka ${t.origin ?? "nilai"} ${a.verb} ${i}${t.maximum.toString()} ${a.unit ?? "elemen"}` : `Terlalu besar: dijangka ${t.origin ?? "nilai"} adalah ${i}${t.maximum.toString()}`;
      }
      case "too_small": {
        const i = t.inclusive ? ">=" : ">", a = n(t.origin);
        return a ? `Terlalu kecil: dijangka ${t.origin} ${a.verb} ${i}${t.minimum.toString()} ${a.unit}` : `Terlalu kecil: dijangka ${t.origin} adalah ${i}${t.minimum.toString()}`;
      }
      case "invalid_format": {
        const i = t;
        return i.format === "starts_with" ? `String tidak sah: mesti bermula dengan "${i.prefix}"` : i.format === "ends_with" ? `String tidak sah: mesti berakhir dengan "${i.suffix}"` : i.format === "includes" ? `String tidak sah: mesti mengandungi "${i.includes}"` : i.format === "regex" ? `String tidak sah: mesti sepadan dengan corak ${i.pattern}` : `${r[i.format] ?? t.format} tidak sah`;
      }
      case "not_multiple_of":
        return `Nombor tidak sah: perlu gandaan ${t.divisor}`;
      case "unrecognized_keys":
        return `Kunci tidak dikenali: ${b(t.keys, ", ")}`;
      case "invalid_key":
        return `Kunci tidak sah dalam ${t.origin}`;
      case "invalid_union":
        return "Input tidak sah";
      case "invalid_element":
        return `Nilai tidak sah dalam ${t.origin}`;
      default:
        return "Input tidak sah";
    }
  };
};
function bh() {
  return {
    localeError: hh()
  };
}
const $h = () => {
  const e = {
    string: { unit: "tekens", verb: "heeft" },
    file: { unit: "bytes", verb: "heeft" },
    array: { unit: "elementen", verb: "heeft" },
    set: { unit: "elementen", verb: "heeft" }
  };
  function n(t) {
    return e[t] ?? null;
  }
  const r = {
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
  return (t) => {
    switch (t.code) {
      case "invalid_type": {
        const i = o[t.expected] ?? t.expected, a = z(t.input), c = o[a] ?? a;
        return /^[A-Z]/.test(t.expected) ? `Ongeldige invoer: verwacht instanceof ${t.expected}, ontving ${c}` : `Ongeldige invoer: verwacht ${i}, ontving ${c}`;
      }
      case "invalid_value":
        return t.values.length === 1 ? `Ongeldige invoer: verwacht ${x(t.values[0])}` : `Ongeldige optie: verwacht één van ${b(t.values, "|")}`;
      case "too_big": {
        const i = t.inclusive ? "<=" : "<", a = n(t.origin), c = t.origin === "date" ? "laat" : t.origin === "string" ? "lang" : "groot";
        return a ? `Te ${c}: verwacht dat ${t.origin ?? "waarde"} ${i}${t.maximum.toString()} ${a.unit ?? "elementen"} ${a.verb}` : `Te ${c}: verwacht dat ${t.origin ?? "waarde"} ${i}${t.maximum.toString()} is`;
      }
      case "too_small": {
        const i = t.inclusive ? ">=" : ">", a = n(t.origin), c = t.origin === "date" ? "vroeg" : t.origin === "string" ? "kort" : "klein";
        return a ? `Te ${c}: verwacht dat ${t.origin} ${i}${t.minimum.toString()} ${a.unit} ${a.verb}` : `Te ${c}: verwacht dat ${t.origin} ${i}${t.minimum.toString()} is`;
      }
      case "invalid_format": {
        const i = t;
        return i.format === "starts_with" ? `Ongeldige tekst: moet met "${i.prefix}" beginnen` : i.format === "ends_with" ? `Ongeldige tekst: moet op "${i.suffix}" eindigen` : i.format === "includes" ? `Ongeldige tekst: moet "${i.includes}" bevatten` : i.format === "regex" ? `Ongeldige tekst: moet overeenkomen met patroon ${i.pattern}` : `Ongeldig: ${r[i.format] ?? t.format}`;
      }
      case "not_multiple_of":
        return `Ongeldig getal: moet een veelvoud van ${t.divisor} zijn`;
      case "unrecognized_keys":
        return `Onbekende key${t.keys.length > 1 ? "s" : ""}: ${b(t.keys, ", ")}`;
      case "invalid_key":
        return `Ongeldige key in ${t.origin}`;
      case "invalid_union":
        return "Ongeldige invoer";
      case "invalid_element":
        return `Ongeldige waarde in ${t.origin}`;
      default:
        return "Ongeldige invoer";
    }
  };
};
function yh() {
  return {
    localeError: $h()
  };
}
const _h = () => {
  const e = {
    string: { unit: "tegn", verb: "å ha" },
    file: { unit: "bytes", verb: "å ha" },
    array: { unit: "elementer", verb: "å inneholde" },
    set: { unit: "elementer", verb: "å inneholde" }
  };
  function n(t) {
    return e[t] ?? null;
  }
  const r = {
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
  return (t) => {
    switch (t.code) {
      case "invalid_type": {
        const i = o[t.expected] ?? t.expected, a = z(t.input), c = o[a] ?? a;
        return /^[A-Z]/.test(t.expected) ? `Ugyldig input: forventet instanceof ${t.expected}, fikk ${c}` : `Ugyldig input: forventet ${i}, fikk ${c}`;
      }
      case "invalid_value":
        return t.values.length === 1 ? `Ugyldig verdi: forventet ${x(t.values[0])}` : `Ugyldig valg: forventet en av ${b(t.values, "|")}`;
      case "too_big": {
        const i = t.inclusive ? "<=" : "<", a = n(t.origin);
        return a ? `For stor(t): forventet ${t.origin ?? "value"} til å ha ${i}${t.maximum.toString()} ${a.unit ?? "elementer"}` : `For stor(t): forventet ${t.origin ?? "value"} til å ha ${i}${t.maximum.toString()}`;
      }
      case "too_small": {
        const i = t.inclusive ? ">=" : ">", a = n(t.origin);
        return a ? `For lite(n): forventet ${t.origin} til å ha ${i}${t.minimum.toString()} ${a.unit}` : `For lite(n): forventet ${t.origin} til å ha ${i}${t.minimum.toString()}`;
      }
      case "invalid_format": {
        const i = t;
        return i.format === "starts_with" ? `Ugyldig streng: må starte med "${i.prefix}"` : i.format === "ends_with" ? `Ugyldig streng: må ende med "${i.suffix}"` : i.format === "includes" ? `Ugyldig streng: må inneholde "${i.includes}"` : i.format === "regex" ? `Ugyldig streng: må matche mønsteret ${i.pattern}` : `Ugyldig ${r[i.format] ?? t.format}`;
      }
      case "not_multiple_of":
        return `Ugyldig tall: må være et multiplum av ${t.divisor}`;
      case "unrecognized_keys":
        return `${t.keys.length > 1 ? "Ukjente nøkler" : "Ukjent nøkkel"}: ${b(t.keys, ", ")}`;
      case "invalid_key":
        return `Ugyldig nøkkel i ${t.origin}`;
      case "invalid_union":
        return "Ugyldig input";
      case "invalid_element":
        return `Ugyldig verdi i ${t.origin}`;
      default:
        return "Ugyldig input";
    }
  };
};
function kh() {
  return {
    localeError: _h()
  };
}
const wh = () => {
  const e = {
    string: { unit: "harf", verb: "olmalıdır" },
    file: { unit: "bayt", verb: "olmalıdır" },
    array: { unit: "unsur", verb: "olmalıdır" },
    set: { unit: "unsur", verb: "olmalıdır" }
  };
  function n(t) {
    return e[t] ?? null;
  }
  const r = {
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
  return (t) => {
    switch (t.code) {
      case "invalid_type": {
        const i = o[t.expected] ?? t.expected, a = z(t.input), c = o[a] ?? a;
        return /^[A-Z]/.test(t.expected) ? `Fâsit giren: umulan instanceof ${t.expected}, alınan ${c}` : `Fâsit giren: umulan ${i}, alınan ${c}`;
      }
      case "invalid_value":
        return t.values.length === 1 ? `Fâsit giren: umulan ${x(t.values[0])}` : `Fâsit tercih: mûteberler ${b(t.values, "|")}`;
      case "too_big": {
        const i = t.inclusive ? "<=" : "<", a = n(t.origin);
        return a ? `Fazla büyük: ${t.origin ?? "value"}, ${i}${t.maximum.toString()} ${a.unit ?? "elements"} sahip olmalıydı.` : `Fazla büyük: ${t.origin ?? "value"}, ${i}${t.maximum.toString()} olmalıydı.`;
      }
      case "too_small": {
        const i = t.inclusive ? ">=" : ">", a = n(t.origin);
        return a ? `Fazla küçük: ${t.origin}, ${i}${t.minimum.toString()} ${a.unit} sahip olmalıydı.` : `Fazla küçük: ${t.origin}, ${i}${t.minimum.toString()} olmalıydı.`;
      }
      case "invalid_format": {
        const i = t;
        return i.format === "starts_with" ? `Fâsit metin: "${i.prefix}" ile başlamalı.` : i.format === "ends_with" ? `Fâsit metin: "${i.suffix}" ile bitmeli.` : i.format === "includes" ? `Fâsit metin: "${i.includes}" ihtivâ etmeli.` : i.format === "regex" ? `Fâsit metin: ${i.pattern} nakşına uymalı.` : `Fâsit ${r[i.format] ?? t.format}`;
      }
      case "not_multiple_of":
        return `Fâsit sayı: ${t.divisor} katı olmalıydı.`;
      case "unrecognized_keys":
        return `Tanınmayan anahtar ${t.keys.length > 1 ? "s" : ""}: ${b(t.keys, ", ")}`;
      case "invalid_key":
        return `${t.origin} için tanınmayan anahtar var.`;
      case "invalid_union":
        return "Giren tanınamadı.";
      case "invalid_element":
        return `${t.origin} için tanınmayan kıymet var.`;
      default:
        return "Kıymet tanınamadı.";
    }
  };
};
function Sh() {
  return {
    localeError: wh()
  };
}
const xh = () => {
  const e = {
    string: { unit: "توکي", verb: "ولري" },
    file: { unit: "بایټس", verb: "ولري" },
    array: { unit: "توکي", verb: "ولري" },
    set: { unit: "توکي", verb: "ولري" }
  };
  function n(t) {
    return e[t] ?? null;
  }
  const r = {
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
  return (t) => {
    switch (t.code) {
      case "invalid_type": {
        const i = o[t.expected] ?? t.expected, a = z(t.input), c = o[a] ?? a;
        return /^[A-Z]/.test(t.expected) ? `ناسم ورودي: باید instanceof ${t.expected} وای, مګر ${c} ترلاسه شو` : `ناسم ورودي: باید ${i} وای, مګر ${c} ترلاسه شو`;
      }
      case "invalid_value":
        return t.values.length === 1 ? `ناسم ورودي: باید ${x(t.values[0])} وای` : `ناسم انتخاب: باید یو له ${b(t.values, "|")} څخه وای`;
      case "too_big": {
        const i = t.inclusive ? "<=" : "<", a = n(t.origin);
        return a ? `ډیر لوی: ${t.origin ?? "ارزښت"} باید ${i}${t.maximum.toString()} ${a.unit ?? "عنصرونه"} ولري` : `ډیر لوی: ${t.origin ?? "ارزښت"} باید ${i}${t.maximum.toString()} وي`;
      }
      case "too_small": {
        const i = t.inclusive ? ">=" : ">", a = n(t.origin);
        return a ? `ډیر کوچنی: ${t.origin} باید ${i}${t.minimum.toString()} ${a.unit} ولري` : `ډیر کوچنی: ${t.origin} باید ${i}${t.minimum.toString()} وي`;
      }
      case "invalid_format": {
        const i = t;
        return i.format === "starts_with" ? `ناسم متن: باید د "${i.prefix}" سره پیل شي` : i.format === "ends_with" ? `ناسم متن: باید د "${i.suffix}" سره پای ته ورسيږي` : i.format === "includes" ? `ناسم متن: باید "${i.includes}" ولري` : i.format === "regex" ? `ناسم متن: باید د ${i.pattern} سره مطابقت ولري` : `${r[i.format] ?? t.format} ناسم دی`;
      }
      case "not_multiple_of":
        return `ناسم عدد: باید د ${t.divisor} مضرب وي`;
      case "unrecognized_keys":
        return `ناسم ${t.keys.length > 1 ? "کلیډونه" : "کلیډ"}: ${b(t.keys, ", ")}`;
      case "invalid_key":
        return `ناسم کلیډ په ${t.origin} کې`;
      case "invalid_union":
        return "ناسمه ورودي";
      case "invalid_element":
        return `ناسم عنصر په ${t.origin} کې`;
      default:
        return "ناسمه ورودي";
    }
  };
};
function zh() {
  return {
    localeError: xh()
  };
}
const Ih = () => {
  const e = {
    string: { unit: "znaków", verb: "mieć" },
    file: { unit: "bajtów", verb: "mieć" },
    array: { unit: "elementów", verb: "mieć" },
    set: { unit: "elementów", verb: "mieć" }
  };
  function n(t) {
    return e[t] ?? null;
  }
  const r = {
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
  return (t) => {
    switch (t.code) {
      case "invalid_type": {
        const i = o[t.expected] ?? t.expected, a = z(t.input), c = o[a] ?? a;
        return /^[A-Z]/.test(t.expected) ? `Nieprawidłowe dane wejściowe: oczekiwano instanceof ${t.expected}, otrzymano ${c}` : `Nieprawidłowe dane wejściowe: oczekiwano ${i}, otrzymano ${c}`;
      }
      case "invalid_value":
        return t.values.length === 1 ? `Nieprawidłowe dane wejściowe: oczekiwano ${x(t.values[0])}` : `Nieprawidłowa opcja: oczekiwano jednej z wartości ${b(t.values, "|")}`;
      case "too_big": {
        const i = t.inclusive ? "<=" : "<", a = n(t.origin);
        return a ? `Za duża wartość: oczekiwano, że ${t.origin ?? "wartość"} będzie mieć ${i}${t.maximum.toString()} ${a.unit ?? "elementów"}` : `Zbyt duż(y/a/e): oczekiwano, że ${t.origin ?? "wartość"} będzie wynosić ${i}${t.maximum.toString()}`;
      }
      case "too_small": {
        const i = t.inclusive ? ">=" : ">", a = n(t.origin);
        return a ? `Za mała wartość: oczekiwano, że ${t.origin ?? "wartość"} będzie mieć ${i}${t.minimum.toString()} ${a.unit ?? "elementów"}` : `Zbyt mał(y/a/e): oczekiwano, że ${t.origin ?? "wartość"} będzie wynosić ${i}${t.minimum.toString()}`;
      }
      case "invalid_format": {
        const i = t;
        return i.format === "starts_with" ? `Nieprawidłowy ciąg znaków: musi zaczynać się od "${i.prefix}"` : i.format === "ends_with" ? `Nieprawidłowy ciąg znaków: musi kończyć się na "${i.suffix}"` : i.format === "includes" ? `Nieprawidłowy ciąg znaków: musi zawierać "${i.includes}"` : i.format === "regex" ? `Nieprawidłowy ciąg znaków: musi odpowiadać wzorcowi ${i.pattern}` : `Nieprawidłow(y/a/e) ${r[i.format] ?? t.format}`;
      }
      case "not_multiple_of":
        return `Nieprawidłowa liczba: musi być wielokrotnością ${t.divisor}`;
      case "unrecognized_keys":
        return `Nierozpoznane klucze${t.keys.length > 1 ? "s" : ""}: ${b(t.keys, ", ")}`;
      case "invalid_key":
        return `Nieprawidłowy klucz w ${t.origin}`;
      case "invalid_union":
        return "Nieprawidłowe dane wejściowe";
      case "invalid_element":
        return `Nieprawidłowa wartość w ${t.origin}`;
      default:
        return "Nieprawidłowe dane wejściowe";
    }
  };
};
function Oh() {
  return {
    localeError: Ih()
  };
}
const Uh = () => {
  const e = {
    string: { unit: "caracteres", verb: "ter" },
    file: { unit: "bytes", verb: "ter" },
    array: { unit: "itens", verb: "ter" },
    set: { unit: "itens", verb: "ter" }
  };
  function n(t) {
    return e[t] ?? null;
  }
  const r = {
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
  return (t) => {
    switch (t.code) {
      case "invalid_type": {
        const i = o[t.expected] ?? t.expected, a = z(t.input), c = o[a] ?? a;
        return /^[A-Z]/.test(t.expected) ? `Tipo inválido: esperado instanceof ${t.expected}, recebido ${c}` : `Tipo inválido: esperado ${i}, recebido ${c}`;
      }
      case "invalid_value":
        return t.values.length === 1 ? `Entrada inválida: esperado ${x(t.values[0])}` : `Opção inválida: esperada uma das ${b(t.values, "|")}`;
      case "too_big": {
        const i = t.inclusive ? "<=" : "<", a = n(t.origin);
        return a ? `Muito grande: esperado que ${t.origin ?? "valor"} tivesse ${i}${t.maximum.toString()} ${a.unit ?? "elementos"}` : `Muito grande: esperado que ${t.origin ?? "valor"} fosse ${i}${t.maximum.toString()}`;
      }
      case "too_small": {
        const i = t.inclusive ? ">=" : ">", a = n(t.origin);
        return a ? `Muito pequeno: esperado que ${t.origin} tivesse ${i}${t.minimum.toString()} ${a.unit}` : `Muito pequeno: esperado que ${t.origin} fosse ${i}${t.minimum.toString()}`;
      }
      case "invalid_format": {
        const i = t;
        return i.format === "starts_with" ? `Texto inválido: deve começar com "${i.prefix}"` : i.format === "ends_with" ? `Texto inválido: deve terminar com "${i.suffix}"` : i.format === "includes" ? `Texto inválido: deve incluir "${i.includes}"` : i.format === "regex" ? `Texto inválido: deve corresponder ao padrão ${i.pattern}` : `${r[i.format] ?? t.format} inválido`;
      }
      case "not_multiple_of":
        return `Número inválido: deve ser múltiplo de ${t.divisor}`;
      case "unrecognized_keys":
        return `Chave${t.keys.length > 1 ? "s" : ""} desconhecida${t.keys.length > 1 ? "s" : ""}: ${b(t.keys, ", ")}`;
      case "invalid_key":
        return `Chave inválida em ${t.origin}`;
      case "invalid_union":
        return "Entrada inválida";
      case "invalid_element":
        return `Valor inválido em ${t.origin}`;
      default:
        return "Campo inválido";
    }
  };
};
function jh() {
  return {
    localeError: Uh()
  };
}
function Xc(e, n, r, o) {
  const t = Math.abs(e), i = t % 10, a = t % 100;
  return a >= 11 && a <= 19 ? o : i === 1 ? n : i >= 2 && i <= 4 ? r : o;
}
const Dh = () => {
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
  function n(t) {
    return e[t] ?? null;
  }
  const r = {
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
  return (t) => {
    switch (t.code) {
      case "invalid_type": {
        const i = o[t.expected] ?? t.expected, a = z(t.input), c = o[a] ?? a;
        return /^[A-Z]/.test(t.expected) ? `Неверный ввод: ожидалось instanceof ${t.expected}, получено ${c}` : `Неверный ввод: ожидалось ${i}, получено ${c}`;
      }
      case "invalid_value":
        return t.values.length === 1 ? `Неверный ввод: ожидалось ${x(t.values[0])}` : `Неверный вариант: ожидалось одно из ${b(t.values, "|")}`;
      case "too_big": {
        const i = t.inclusive ? "<=" : "<", a = n(t.origin);
        if (a) {
          const c = Number(t.maximum), u = Xc(c, a.unit.one, a.unit.few, a.unit.many);
          return `Слишком большое значение: ожидалось, что ${t.origin ?? "значение"} будет иметь ${i}${t.maximum.toString()} ${u}`;
        }
        return `Слишком большое значение: ожидалось, что ${t.origin ?? "значение"} будет ${i}${t.maximum.toString()}`;
      }
      case "too_small": {
        const i = t.inclusive ? ">=" : ">", a = n(t.origin);
        if (a) {
          const c = Number(t.minimum), u = Xc(c, a.unit.one, a.unit.few, a.unit.many);
          return `Слишком маленькое значение: ожидалось, что ${t.origin} будет иметь ${i}${t.minimum.toString()} ${u}`;
        }
        return `Слишком маленькое значение: ожидалось, что ${t.origin} будет ${i}${t.minimum.toString()}`;
      }
      case "invalid_format": {
        const i = t;
        return i.format === "starts_with" ? `Неверная строка: должна начинаться с "${i.prefix}"` : i.format === "ends_with" ? `Неверная строка: должна заканчиваться на "${i.suffix}"` : i.format === "includes" ? `Неверная строка: должна содержать "${i.includes}"` : i.format === "regex" ? `Неверная строка: должна соответствовать шаблону ${i.pattern}` : `Неверный ${r[i.format] ?? t.format}`;
      }
      case "not_multiple_of":
        return `Неверное число: должно быть кратным ${t.divisor}`;
      case "unrecognized_keys":
        return `Нераспознанн${t.keys.length > 1 ? "ые" : "ый"} ключ${t.keys.length > 1 ? "и" : ""}: ${b(t.keys, ", ")}`;
      case "invalid_key":
        return `Неверный ключ в ${t.origin}`;
      case "invalid_union":
        return "Неверные входные данные";
      case "invalid_element":
        return `Неверное значение в ${t.origin}`;
      default:
        return "Неверные входные данные";
    }
  };
};
function Th() {
  return {
    localeError: Dh()
  };
}
const Eh = () => {
  const e = {
    string: { unit: "znakov", verb: "imeti" },
    file: { unit: "bajtov", verb: "imeti" },
    array: { unit: "elementov", verb: "imeti" },
    set: { unit: "elementov", verb: "imeti" }
  };
  function n(t) {
    return e[t] ?? null;
  }
  const r = {
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
  return (t) => {
    switch (t.code) {
      case "invalid_type": {
        const i = o[t.expected] ?? t.expected, a = z(t.input), c = o[a] ?? a;
        return /^[A-Z]/.test(t.expected) ? `Neveljaven vnos: pričakovano instanceof ${t.expected}, prejeto ${c}` : `Neveljaven vnos: pričakovano ${i}, prejeto ${c}`;
      }
      case "invalid_value":
        return t.values.length === 1 ? `Neveljaven vnos: pričakovano ${x(t.values[0])}` : `Neveljavna možnost: pričakovano eno izmed ${b(t.values, "|")}`;
      case "too_big": {
        const i = t.inclusive ? "<=" : "<", a = n(t.origin);
        return a ? `Preveliko: pričakovano, da bo ${t.origin ?? "vrednost"} imelo ${i}${t.maximum.toString()} ${a.unit ?? "elementov"}` : `Preveliko: pričakovano, da bo ${t.origin ?? "vrednost"} ${i}${t.maximum.toString()}`;
      }
      case "too_small": {
        const i = t.inclusive ? ">=" : ">", a = n(t.origin);
        return a ? `Premajhno: pričakovano, da bo ${t.origin} imelo ${i}${t.minimum.toString()} ${a.unit}` : `Premajhno: pričakovano, da bo ${t.origin} ${i}${t.minimum.toString()}`;
      }
      case "invalid_format": {
        const i = t;
        return i.format === "starts_with" ? `Neveljaven niz: mora se začeti z "${i.prefix}"` : i.format === "ends_with" ? `Neveljaven niz: mora se končati z "${i.suffix}"` : i.format === "includes" ? `Neveljaven niz: mora vsebovati "${i.includes}"` : i.format === "regex" ? `Neveljaven niz: mora ustrezati vzorcu ${i.pattern}` : `Neveljaven ${r[i.format] ?? t.format}`;
      }
      case "not_multiple_of":
        return `Neveljavno število: mora biti večkratnik ${t.divisor}`;
      case "unrecognized_keys":
        return `Neprepoznan${t.keys.length > 1 ? "i ključi" : " ključ"}: ${b(t.keys, ", ")}`;
      case "invalid_key":
        return `Neveljaven ključ v ${t.origin}`;
      case "invalid_union":
        return "Neveljaven vnos";
      case "invalid_element":
        return `Neveljavna vrednost v ${t.origin}`;
      default:
        return "Neveljaven vnos";
    }
  };
};
function Nh() {
  return {
    localeError: Eh()
  };
}
const Ph = () => {
  const e = {
    string: { unit: "tecken", verb: "att ha" },
    file: { unit: "bytes", verb: "att ha" },
    array: { unit: "objekt", verb: "att innehålla" },
    set: { unit: "objekt", verb: "att innehålla" }
  };
  function n(t) {
    return e[t] ?? null;
  }
  const r = {
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
  return (t) => {
    switch (t.code) {
      case "invalid_type": {
        const i = o[t.expected] ?? t.expected, a = z(t.input), c = o[a] ?? a;
        return /^[A-Z]/.test(t.expected) ? `Ogiltig inmatning: förväntat instanceof ${t.expected}, fick ${c}` : `Ogiltig inmatning: förväntat ${i}, fick ${c}`;
      }
      case "invalid_value":
        return t.values.length === 1 ? `Ogiltig inmatning: förväntat ${x(t.values[0])}` : `Ogiltigt val: förväntade en av ${b(t.values, "|")}`;
      case "too_big": {
        const i = t.inclusive ? "<=" : "<", a = n(t.origin);
        return a ? `För stor(t): förväntade ${t.origin ?? "värdet"} att ha ${i}${t.maximum.toString()} ${a.unit ?? "element"}` : `För stor(t): förväntat ${t.origin ?? "värdet"} att ha ${i}${t.maximum.toString()}`;
      }
      case "too_small": {
        const i = t.inclusive ? ">=" : ">", a = n(t.origin);
        return a ? `För lite(t): förväntade ${t.origin ?? "värdet"} att ha ${i}${t.minimum.toString()} ${a.unit}` : `För lite(t): förväntade ${t.origin ?? "värdet"} att ha ${i}${t.minimum.toString()}`;
      }
      case "invalid_format": {
        const i = t;
        return i.format === "starts_with" ? `Ogiltig sträng: måste börja med "${i.prefix}"` : i.format === "ends_with" ? `Ogiltig sträng: måste sluta med "${i.suffix}"` : i.format === "includes" ? `Ogiltig sträng: måste innehålla "${i.includes}"` : i.format === "regex" ? `Ogiltig sträng: måste matcha mönstret "${i.pattern}"` : `Ogiltig(t) ${r[i.format] ?? t.format}`;
      }
      case "not_multiple_of":
        return `Ogiltigt tal: måste vara en multipel av ${t.divisor}`;
      case "unrecognized_keys":
        return `${t.keys.length > 1 ? "Okända nycklar" : "Okänd nyckel"}: ${b(t.keys, ", ")}`;
      case "invalid_key":
        return `Ogiltig nyckel i ${t.origin ?? "värdet"}`;
      case "invalid_union":
        return "Ogiltig input";
      case "invalid_element":
        return `Ogiltigt värde i ${t.origin ?? "värdet"}`;
      default:
        return "Ogiltig input";
    }
  };
};
function Ah() {
  return {
    localeError: Ph()
  };
}
const Zh = () => {
  const e = {
    string: { unit: "எழுத்துக்கள்", verb: "கொண்டிருக்க வேண்டும்" },
    file: { unit: "பைட்டுகள்", verb: "கொண்டிருக்க வேண்டும்" },
    array: { unit: "உறுப்புகள்", verb: "கொண்டிருக்க வேண்டும்" },
    set: { unit: "உறுப்புகள்", verb: "கொண்டிருக்க வேண்டும்" }
  };
  function n(t) {
    return e[t] ?? null;
  }
  const r = {
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
  return (t) => {
    switch (t.code) {
      case "invalid_type": {
        const i = o[t.expected] ?? t.expected, a = z(t.input), c = o[a] ?? a;
        return /^[A-Z]/.test(t.expected) ? `தவறான உள்ளீடு: எதிர்பார்க்கப்பட்டது instanceof ${t.expected}, பெறப்பட்டது ${c}` : `தவறான உள்ளீடு: எதிர்பார்க்கப்பட்டது ${i}, பெறப்பட்டது ${c}`;
      }
      case "invalid_value":
        return t.values.length === 1 ? `தவறான உள்ளீடு: எதிர்பார்க்கப்பட்டது ${x(t.values[0])}` : `தவறான விருப்பம்: எதிர்பார்க்கப்பட்டது ${b(t.values, "|")} இல் ஒன்று`;
      case "too_big": {
        const i = t.inclusive ? "<=" : "<", a = n(t.origin);
        return a ? `மிக பெரியது: எதிர்பார்க்கப்பட்டது ${t.origin ?? "மதிப்பு"} ${i}${t.maximum.toString()} ${a.unit ?? "உறுப்புகள்"} ஆக இருக்க வேண்டும்` : `மிக பெரியது: எதிர்பார்க்கப்பட்டது ${t.origin ?? "மதிப்பு"} ${i}${t.maximum.toString()} ஆக இருக்க வேண்டும்`;
      }
      case "too_small": {
        const i = t.inclusive ? ">=" : ">", a = n(t.origin);
        return a ? `மிகச் சிறியது: எதிர்பார்க்கப்பட்டது ${t.origin} ${i}${t.minimum.toString()} ${a.unit} ஆக இருக்க வேண்டும்` : `மிகச் சிறியது: எதிர்பார்க்கப்பட்டது ${t.origin} ${i}${t.minimum.toString()} ஆக இருக்க வேண்டும்`;
      }
      case "invalid_format": {
        const i = t;
        return i.format === "starts_with" ? `தவறான சரம்: "${i.prefix}" இல் தொடங்க வேண்டும்` : i.format === "ends_with" ? `தவறான சரம்: "${i.suffix}" இல் முடிவடைய வேண்டும்` : i.format === "includes" ? `தவறான சரம்: "${i.includes}" ஐ உள்ளடக்க வேண்டும்` : i.format === "regex" ? `தவறான சரம்: ${i.pattern} முறைபாட்டுடன் பொருந்த வேண்டும்` : `தவறான ${r[i.format] ?? t.format}`;
      }
      case "not_multiple_of":
        return `தவறான எண்: ${t.divisor} இன் பலமாக இருக்க வேண்டும்`;
      case "unrecognized_keys":
        return `அடையாளம் தெரியாத விசை${t.keys.length > 1 ? "கள்" : ""}: ${b(t.keys, ", ")}`;
      case "invalid_key":
        return `${t.origin} இல் தவறான விசை`;
      case "invalid_union":
        return "தவறான உள்ளீடு";
      case "invalid_element":
        return `${t.origin} இல் தவறான மதிப்பு`;
      default:
        return "தவறான உள்ளீடு";
    }
  };
};
function Rh() {
  return {
    localeError: Zh()
  };
}
const Ch = () => {
  const e = {
    string: { unit: "ตัวอักษร", verb: "ควรมี" },
    file: { unit: "ไบต์", verb: "ควรมี" },
    array: { unit: "รายการ", verb: "ควรมี" },
    set: { unit: "รายการ", verb: "ควรมี" }
  };
  function n(t) {
    return e[t] ?? null;
  }
  const r = {
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
  return (t) => {
    switch (t.code) {
      case "invalid_type": {
        const i = o[t.expected] ?? t.expected, a = z(t.input), c = o[a] ?? a;
        return /^[A-Z]/.test(t.expected) ? `ประเภทข้อมูลไม่ถูกต้อง: ควรเป็น instanceof ${t.expected} แต่ได้รับ ${c}` : `ประเภทข้อมูลไม่ถูกต้อง: ควรเป็น ${i} แต่ได้รับ ${c}`;
      }
      case "invalid_value":
        return t.values.length === 1 ? `ค่าไม่ถูกต้อง: ควรเป็น ${x(t.values[0])}` : `ตัวเลือกไม่ถูกต้อง: ควรเป็นหนึ่งใน ${b(t.values, "|")}`;
      case "too_big": {
        const i = t.inclusive ? "ไม่เกิน" : "น้อยกว่า", a = n(t.origin);
        return a ? `เกินกำหนด: ${t.origin ?? "ค่า"} ควรมี${i} ${t.maximum.toString()} ${a.unit ?? "รายการ"}` : `เกินกำหนด: ${t.origin ?? "ค่า"} ควรมี${i} ${t.maximum.toString()}`;
      }
      case "too_small": {
        const i = t.inclusive ? "อย่างน้อย" : "มากกว่า", a = n(t.origin);
        return a ? `น้อยกว่ากำหนด: ${t.origin} ควรมี${i} ${t.minimum.toString()} ${a.unit}` : `น้อยกว่ากำหนด: ${t.origin} ควรมี${i} ${t.minimum.toString()}`;
      }
      case "invalid_format": {
        const i = t;
        return i.format === "starts_with" ? `รูปแบบไม่ถูกต้อง: ข้อความต้องขึ้นต้นด้วย "${i.prefix}"` : i.format === "ends_with" ? `รูปแบบไม่ถูกต้อง: ข้อความต้องลงท้ายด้วย "${i.suffix}"` : i.format === "includes" ? `รูปแบบไม่ถูกต้อง: ข้อความต้องมี "${i.includes}" อยู่ในข้อความ` : i.format === "regex" ? `รูปแบบไม่ถูกต้อง: ต้องตรงกับรูปแบบที่กำหนด ${i.pattern}` : `รูปแบบไม่ถูกต้อง: ${r[i.format] ?? t.format}`;
      }
      case "not_multiple_of":
        return `ตัวเลขไม่ถูกต้อง: ต้องเป็นจำนวนที่หารด้วย ${t.divisor} ได้ลงตัว`;
      case "unrecognized_keys":
        return `พบคีย์ที่ไม่รู้จัก: ${b(t.keys, ", ")}`;
      case "invalid_key":
        return `คีย์ไม่ถูกต้องใน ${t.origin}`;
      case "invalid_union":
        return "ข้อมูลไม่ถูกต้อง: ไม่ตรงกับรูปแบบยูเนียนที่กำหนดไว้";
      case "invalid_element":
        return `ข้อมูลไม่ถูกต้องใน ${t.origin}`;
      default:
        return "ข้อมูลไม่ถูกต้อง";
    }
  };
};
function Fh() {
  return {
    localeError: Ch()
  };
}
const Lh = () => {
  const e = {
    string: { unit: "karakter", verb: "olmalı" },
    file: { unit: "bayt", verb: "olmalı" },
    array: { unit: "öğe", verb: "olmalı" },
    set: { unit: "öğe", verb: "olmalı" }
  };
  function n(t) {
    return e[t] ?? null;
  }
  const r = {
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
  return (t) => {
    switch (t.code) {
      case "invalid_type": {
        const i = o[t.expected] ?? t.expected, a = z(t.input), c = o[a] ?? a;
        return /^[A-Z]/.test(t.expected) ? `Geçersiz değer: beklenen instanceof ${t.expected}, alınan ${c}` : `Geçersiz değer: beklenen ${i}, alınan ${c}`;
      }
      case "invalid_value":
        return t.values.length === 1 ? `Geçersiz değer: beklenen ${x(t.values[0])}` : `Geçersiz seçenek: aşağıdakilerden biri olmalı: ${b(t.values, "|")}`;
      case "too_big": {
        const i = t.inclusive ? "<=" : "<", a = n(t.origin);
        return a ? `Çok büyük: beklenen ${t.origin ?? "değer"} ${i}${t.maximum.toString()} ${a.unit ?? "öğe"}` : `Çok büyük: beklenen ${t.origin ?? "değer"} ${i}${t.maximum.toString()}`;
      }
      case "too_small": {
        const i = t.inclusive ? ">=" : ">", a = n(t.origin);
        return a ? `Çok küçük: beklenen ${t.origin} ${i}${t.minimum.toString()} ${a.unit}` : `Çok küçük: beklenen ${t.origin} ${i}${t.minimum.toString()}`;
      }
      case "invalid_format": {
        const i = t;
        return i.format === "starts_with" ? `Geçersiz metin: "${i.prefix}" ile başlamalı` : i.format === "ends_with" ? `Geçersiz metin: "${i.suffix}" ile bitmeli` : i.format === "includes" ? `Geçersiz metin: "${i.includes}" içermeli` : i.format === "regex" ? `Geçersiz metin: ${i.pattern} desenine uymalı` : `Geçersiz ${r[i.format] ?? t.format}`;
      }
      case "not_multiple_of":
        return `Geçersiz sayı: ${t.divisor} ile tam bölünebilmeli`;
      case "unrecognized_keys":
        return `Tanınmayan anahtar${t.keys.length > 1 ? "lar" : ""}: ${b(t.keys, ", ")}`;
      case "invalid_key":
        return `${t.origin} içinde geçersiz anahtar`;
      case "invalid_union":
        return "Geçersiz değer";
      case "invalid_element":
        return `${t.origin} içinde geçersiz değer`;
      default:
        return "Geçersiz değer";
    }
  };
};
function Jh() {
  return {
    localeError: Lh()
  };
}
const Mh = () => {
  const e = {
    string: { unit: "символів", verb: "матиме" },
    file: { unit: "байтів", verb: "матиме" },
    array: { unit: "елементів", verb: "матиме" },
    set: { unit: "елементів", verb: "матиме" }
  };
  function n(t) {
    return e[t] ?? null;
  }
  const r = {
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
  return (t) => {
    switch (t.code) {
      case "invalid_type": {
        const i = o[t.expected] ?? t.expected, a = z(t.input), c = o[a] ?? a;
        return /^[A-Z]/.test(t.expected) ? `Неправильні вхідні дані: очікується instanceof ${t.expected}, отримано ${c}` : `Неправильні вхідні дані: очікується ${i}, отримано ${c}`;
      }
      case "invalid_value":
        return t.values.length === 1 ? `Неправильні вхідні дані: очікується ${x(t.values[0])}` : `Неправильна опція: очікується одне з ${b(t.values, "|")}`;
      case "too_big": {
        const i = t.inclusive ? "<=" : "<", a = n(t.origin);
        return a ? `Занадто велике: очікується, що ${t.origin ?? "значення"} ${a.verb} ${i}${t.maximum.toString()} ${a.unit ?? "елементів"}` : `Занадто велике: очікується, що ${t.origin ?? "значення"} буде ${i}${t.maximum.toString()}`;
      }
      case "too_small": {
        const i = t.inclusive ? ">=" : ">", a = n(t.origin);
        return a ? `Занадто мале: очікується, що ${t.origin} ${a.verb} ${i}${t.minimum.toString()} ${a.unit}` : `Занадто мале: очікується, що ${t.origin} буде ${i}${t.minimum.toString()}`;
      }
      case "invalid_format": {
        const i = t;
        return i.format === "starts_with" ? `Неправильний рядок: повинен починатися з "${i.prefix}"` : i.format === "ends_with" ? `Неправильний рядок: повинен закінчуватися на "${i.suffix}"` : i.format === "includes" ? `Неправильний рядок: повинен містити "${i.includes}"` : i.format === "regex" ? `Неправильний рядок: повинен відповідати шаблону ${i.pattern}` : `Неправильний ${r[i.format] ?? t.format}`;
      }
      case "not_multiple_of":
        return `Неправильне число: повинно бути кратним ${t.divisor}`;
      case "unrecognized_keys":
        return `Нерозпізнаний ключ${t.keys.length > 1 ? "і" : ""}: ${b(t.keys, ", ")}`;
      case "invalid_key":
        return `Неправильний ключ у ${t.origin}`;
      case "invalid_union":
        return "Неправильні вхідні дані";
      case "invalid_element":
        return `Неправильне значення у ${t.origin}`;
      default:
        return "Неправильні вхідні дані";
    }
  };
};
function bd() {
  return {
    localeError: Mh()
  };
}
function Bh() {
  return bd();
}
const Vh = () => {
  const e = {
    string: { unit: "حروف", verb: "ہونا" },
    file: { unit: "بائٹس", verb: "ہونا" },
    array: { unit: "آئٹمز", verb: "ہونا" },
    set: { unit: "آئٹمز", verb: "ہونا" }
  };
  function n(t) {
    return e[t] ?? null;
  }
  const r = {
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
  return (t) => {
    switch (t.code) {
      case "invalid_type": {
        const i = o[t.expected] ?? t.expected, a = z(t.input), c = o[a] ?? a;
        return /^[A-Z]/.test(t.expected) ? `غلط ان پٹ: instanceof ${t.expected} متوقع تھا، ${c} موصول ہوا` : `غلط ان پٹ: ${i} متوقع تھا، ${c} موصول ہوا`;
      }
      case "invalid_value":
        return t.values.length === 1 ? `غلط ان پٹ: ${x(t.values[0])} متوقع تھا` : `غلط آپشن: ${b(t.values, "|")} میں سے ایک متوقع تھا`;
      case "too_big": {
        const i = t.inclusive ? "<=" : "<", a = n(t.origin);
        return a ? `بہت بڑا: ${t.origin ?? "ویلیو"} کے ${i}${t.maximum.toString()} ${a.unit ?? "عناصر"} ہونے متوقع تھے` : `بہت بڑا: ${t.origin ?? "ویلیو"} کا ${i}${t.maximum.toString()} ہونا متوقع تھا`;
      }
      case "too_small": {
        const i = t.inclusive ? ">=" : ">", a = n(t.origin);
        return a ? `بہت چھوٹا: ${t.origin} کے ${i}${t.minimum.toString()} ${a.unit} ہونے متوقع تھے` : `بہت چھوٹا: ${t.origin} کا ${i}${t.minimum.toString()} ہونا متوقع تھا`;
      }
      case "invalid_format": {
        const i = t;
        return i.format === "starts_with" ? `غلط سٹرنگ: "${i.prefix}" سے شروع ہونا چاہیے` : i.format === "ends_with" ? `غلط سٹرنگ: "${i.suffix}" پر ختم ہونا چاہیے` : i.format === "includes" ? `غلط سٹرنگ: "${i.includes}" شامل ہونا چاہیے` : i.format === "regex" ? `غلط سٹرنگ: پیٹرن ${i.pattern} سے میچ ہونا چاہیے` : `غلط ${r[i.format] ?? t.format}`;
      }
      case "not_multiple_of":
        return `غلط نمبر: ${t.divisor} کا مضاعف ہونا چاہیے`;
      case "unrecognized_keys":
        return `غیر تسلیم شدہ کی${t.keys.length > 1 ? "ز" : ""}: ${b(t.keys, "، ")}`;
      case "invalid_key":
        return `${t.origin} میں غلط کی`;
      case "invalid_union":
        return "غلط ان پٹ";
      case "invalid_element":
        return `${t.origin} میں غلط ویلیو`;
      default:
        return "غلط ان پٹ";
    }
  };
};
function Gh() {
  return {
    localeError: Vh()
  };
}
const Wh = () => {
  const e = {
    string: { unit: "belgi", verb: "bo‘lishi kerak" },
    file: { unit: "bayt", verb: "bo‘lishi kerak" },
    array: { unit: "element", verb: "bo‘lishi kerak" },
    set: { unit: "element", verb: "bo‘lishi kerak" }
  };
  function n(t) {
    return e[t] ?? null;
  }
  const r = {
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
  return (t) => {
    switch (t.code) {
      case "invalid_type": {
        const i = o[t.expected] ?? t.expected, a = z(t.input), c = o[a] ?? a;
        return /^[A-Z]/.test(t.expected) ? `Noto‘g‘ri kirish: kutilgan instanceof ${t.expected}, qabul qilingan ${c}` : `Noto‘g‘ri kirish: kutilgan ${i}, qabul qilingan ${c}`;
      }
      case "invalid_value":
        return t.values.length === 1 ? `Noto‘g‘ri kirish: kutilgan ${x(t.values[0])}` : `Noto‘g‘ri variant: quyidagilardan biri kutilgan ${b(t.values, "|")}`;
      case "too_big": {
        const i = t.inclusive ? "<=" : "<", a = n(t.origin);
        return a ? `Juda katta: kutilgan ${t.origin ?? "qiymat"} ${i}${t.maximum.toString()} ${a.unit} ${a.verb}` : `Juda katta: kutilgan ${t.origin ?? "qiymat"} ${i}${t.maximum.toString()}`;
      }
      case "too_small": {
        const i = t.inclusive ? ">=" : ">", a = n(t.origin);
        return a ? `Juda kichik: kutilgan ${t.origin} ${i}${t.minimum.toString()} ${a.unit} ${a.verb}` : `Juda kichik: kutilgan ${t.origin} ${i}${t.minimum.toString()}`;
      }
      case "invalid_format": {
        const i = t;
        return i.format === "starts_with" ? `Noto‘g‘ri satr: "${i.prefix}" bilan boshlanishi kerak` : i.format === "ends_with" ? `Noto‘g‘ri satr: "${i.suffix}" bilan tugashi kerak` : i.format === "includes" ? `Noto‘g‘ri satr: "${i.includes}" ni o‘z ichiga olishi kerak` : i.format === "regex" ? `Noto‘g‘ri satr: ${i.pattern} shabloniga mos kelishi kerak` : `Noto‘g‘ri ${r[i.format] ?? t.format}`;
      }
      case "not_multiple_of":
        return `Noto‘g‘ri raqam: ${t.divisor} ning karralisi bo‘lishi kerak`;
      case "unrecognized_keys":
        return `Noma’lum kalit${t.keys.length > 1 ? "lar" : ""}: ${b(t.keys, ", ")}`;
      case "invalid_key":
        return `${t.origin} dagi kalit noto‘g‘ri`;
      case "invalid_union":
        return "Noto‘g‘ri kirish";
      case "invalid_element":
        return `${t.origin} da noto‘g‘ri qiymat`;
      default:
        return "Noto‘g‘ri kirish";
    }
  };
};
function qh() {
  return {
    localeError: Wh()
  };
}
const Kh = () => {
  const e = {
    string: { unit: "ký tự", verb: "có" },
    file: { unit: "byte", verb: "có" },
    array: { unit: "phần tử", verb: "có" },
    set: { unit: "phần tử", verb: "có" }
  };
  function n(t) {
    return e[t] ?? null;
  }
  const r = {
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
  return (t) => {
    switch (t.code) {
      case "invalid_type": {
        const i = o[t.expected] ?? t.expected, a = z(t.input), c = o[a] ?? a;
        return /^[A-Z]/.test(t.expected) ? `Đầu vào không hợp lệ: mong đợi instanceof ${t.expected}, nhận được ${c}` : `Đầu vào không hợp lệ: mong đợi ${i}, nhận được ${c}`;
      }
      case "invalid_value":
        return t.values.length === 1 ? `Đầu vào không hợp lệ: mong đợi ${x(t.values[0])}` : `Tùy chọn không hợp lệ: mong đợi một trong các giá trị ${b(t.values, "|")}`;
      case "too_big": {
        const i = t.inclusive ? "<=" : "<", a = n(t.origin);
        return a ? `Quá lớn: mong đợi ${t.origin ?? "giá trị"} ${a.verb} ${i}${t.maximum.toString()} ${a.unit ?? "phần tử"}` : `Quá lớn: mong đợi ${t.origin ?? "giá trị"} ${i}${t.maximum.toString()}`;
      }
      case "too_small": {
        const i = t.inclusive ? ">=" : ">", a = n(t.origin);
        return a ? `Quá nhỏ: mong đợi ${t.origin} ${a.verb} ${i}${t.minimum.toString()} ${a.unit}` : `Quá nhỏ: mong đợi ${t.origin} ${i}${t.minimum.toString()}`;
      }
      case "invalid_format": {
        const i = t;
        return i.format === "starts_with" ? `Chuỗi không hợp lệ: phải bắt đầu bằng "${i.prefix}"` : i.format === "ends_with" ? `Chuỗi không hợp lệ: phải kết thúc bằng "${i.suffix}"` : i.format === "includes" ? `Chuỗi không hợp lệ: phải bao gồm "${i.includes}"` : i.format === "regex" ? `Chuỗi không hợp lệ: phải khớp với mẫu ${i.pattern}` : `${r[i.format] ?? t.format} không hợp lệ`;
      }
      case "not_multiple_of":
        return `Số không hợp lệ: phải là bội số của ${t.divisor}`;
      case "unrecognized_keys":
        return `Khóa không được nhận dạng: ${b(t.keys, ", ")}`;
      case "invalid_key":
        return `Khóa không hợp lệ trong ${t.origin}`;
      case "invalid_union":
        return "Đầu vào không hợp lệ";
      case "invalid_element":
        return `Giá trị không hợp lệ trong ${t.origin}`;
      default:
        return "Đầu vào không hợp lệ";
    }
  };
};
function Xh() {
  return {
    localeError: Kh()
  };
}
const Hh = () => {
  const e = {
    string: { unit: "字符", verb: "包含" },
    file: { unit: "字节", verb: "包含" },
    array: { unit: "项", verb: "包含" },
    set: { unit: "项", verb: "包含" }
  };
  function n(t) {
    return e[t] ?? null;
  }
  const r = {
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
  return (t) => {
    switch (t.code) {
      case "invalid_type": {
        const i = o[t.expected] ?? t.expected, a = z(t.input), c = o[a] ?? a;
        return /^[A-Z]/.test(t.expected) ? `无效输入：期望 instanceof ${t.expected}，实际接收 ${c}` : `无效输入：期望 ${i}，实际接收 ${c}`;
      }
      case "invalid_value":
        return t.values.length === 1 ? `无效输入：期望 ${x(t.values[0])}` : `无效选项：期望以下之一 ${b(t.values, "|")}`;
      case "too_big": {
        const i = t.inclusive ? "<=" : "<", a = n(t.origin);
        return a ? `数值过大：期望 ${t.origin ?? "值"} ${i}${t.maximum.toString()} ${a.unit ?? "个元素"}` : `数值过大：期望 ${t.origin ?? "值"} ${i}${t.maximum.toString()}`;
      }
      case "too_small": {
        const i = t.inclusive ? ">=" : ">", a = n(t.origin);
        return a ? `数值过小：期望 ${t.origin} ${i}${t.minimum.toString()} ${a.unit}` : `数值过小：期望 ${t.origin} ${i}${t.minimum.toString()}`;
      }
      case "invalid_format": {
        const i = t;
        return i.format === "starts_with" ? `无效字符串：必须以 "${i.prefix}" 开头` : i.format === "ends_with" ? `无效字符串：必须以 "${i.suffix}" 结尾` : i.format === "includes" ? `无效字符串：必须包含 "${i.includes}"` : i.format === "regex" ? `无效字符串：必须满足正则表达式 ${i.pattern}` : `无效${r[i.format] ?? t.format}`;
      }
      case "not_multiple_of":
        return `无效数字：必须是 ${t.divisor} 的倍数`;
      case "unrecognized_keys":
        return `出现未知的键(key): ${b(t.keys, ", ")}`;
      case "invalid_key":
        return `${t.origin} 中的键(key)无效`;
      case "invalid_union":
        return "无效输入";
      case "invalid_element":
        return `${t.origin} 中包含无效值(value)`;
      default:
        return "无效输入";
    }
  };
};
function Yh() {
  return {
    localeError: Hh()
  };
}
const Qh = () => {
  const e = {
    string: { unit: "字元", verb: "擁有" },
    file: { unit: "位元組", verb: "擁有" },
    array: { unit: "項目", verb: "擁有" },
    set: { unit: "項目", verb: "擁有" }
  };
  function n(t) {
    return e[t] ?? null;
  }
  const r = {
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
  return (t) => {
    switch (t.code) {
      case "invalid_type": {
        const i = o[t.expected] ?? t.expected, a = z(t.input), c = o[a] ?? a;
        return /^[A-Z]/.test(t.expected) ? `無效的輸入值：預期為 instanceof ${t.expected}，但收到 ${c}` : `無效的輸入值：預期為 ${i}，但收到 ${c}`;
      }
      case "invalid_value":
        return t.values.length === 1 ? `無效的輸入值：預期為 ${x(t.values[0])}` : `無效的選項：預期為以下其中之一 ${b(t.values, "|")}`;
      case "too_big": {
        const i = t.inclusive ? "<=" : "<", a = n(t.origin);
        return a ? `數值過大：預期 ${t.origin ?? "值"} 應為 ${i}${t.maximum.toString()} ${a.unit ?? "個元素"}` : `數值過大：預期 ${t.origin ?? "值"} 應為 ${i}${t.maximum.toString()}`;
      }
      case "too_small": {
        const i = t.inclusive ? ">=" : ">", a = n(t.origin);
        return a ? `數值過小：預期 ${t.origin} 應為 ${i}${t.minimum.toString()} ${a.unit}` : `數值過小：預期 ${t.origin} 應為 ${i}${t.minimum.toString()}`;
      }
      case "invalid_format": {
        const i = t;
        return i.format === "starts_with" ? `無效的字串：必須以 "${i.prefix}" 開頭` : i.format === "ends_with" ? `無效的字串：必須以 "${i.suffix}" 結尾` : i.format === "includes" ? `無效的字串：必須包含 "${i.includes}"` : i.format === "regex" ? `無效的字串：必須符合格式 ${i.pattern}` : `無效的 ${r[i.format] ?? t.format}`;
      }
      case "not_multiple_of":
        return `無效的數字：必須為 ${t.divisor} 的倍數`;
      case "unrecognized_keys":
        return `無法識別的鍵值${t.keys.length > 1 ? "們" : ""}：${b(t.keys, "、")}`;
      case "invalid_key":
        return `${t.origin} 中有無效的鍵值`;
      case "invalid_union":
        return "無效的輸入值";
      case "invalid_element":
        return `${t.origin} 中有無效的值`;
      default:
        return "無效的輸入值";
    }
  };
};
function eb() {
  return {
    localeError: Qh()
  };
}
const tb = () => {
  const e = {
    string: { unit: "àmi", verb: "ní" },
    file: { unit: "bytes", verb: "ní" },
    array: { unit: "nkan", verb: "ní" },
    set: { unit: "nkan", verb: "ní" }
  };
  function n(t) {
    return e[t] ?? null;
  }
  const r = {
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
  return (t) => {
    switch (t.code) {
      case "invalid_type": {
        const i = o[t.expected] ?? t.expected, a = z(t.input), c = o[a] ?? a;
        return /^[A-Z]/.test(t.expected) ? `Ìbáwọlé aṣìṣe: a ní láti fi instanceof ${t.expected}, àmọ̀ a rí ${c}` : `Ìbáwọlé aṣìṣe: a ní láti fi ${i}, àmọ̀ a rí ${c}`;
      }
      case "invalid_value":
        return t.values.length === 1 ? `Ìbáwọlé aṣìṣe: a ní láti fi ${x(t.values[0])}` : `Àṣàyàn aṣìṣe: yan ọ̀kan lára ${b(t.values, "|")}`;
      case "too_big": {
        const i = t.inclusive ? "<=" : "<", a = n(t.origin);
        return a ? `Tó pọ̀ jù: a ní láti jẹ́ pé ${t.origin ?? "iye"} ${a.verb} ${i}${t.maximum} ${a.unit}` : `Tó pọ̀ jù: a ní láti jẹ́ ${i}${t.maximum}`;
      }
      case "too_small": {
        const i = t.inclusive ? ">=" : ">", a = n(t.origin);
        return a ? `Kéré ju: a ní láti jẹ́ pé ${t.origin} ${a.verb} ${i}${t.minimum} ${a.unit}` : `Kéré ju: a ní láti jẹ́ ${i}${t.minimum}`;
      }
      case "invalid_format": {
        const i = t;
        return i.format === "starts_with" ? `Ọ̀rọ̀ aṣìṣe: gbọ́dọ̀ bẹ̀rẹ̀ pẹ̀lú "${i.prefix}"` : i.format === "ends_with" ? `Ọ̀rọ̀ aṣìṣe: gbọ́dọ̀ parí pẹ̀lú "${i.suffix}"` : i.format === "includes" ? `Ọ̀rọ̀ aṣìṣe: gbọ́dọ̀ ní "${i.includes}"` : i.format === "regex" ? `Ọ̀rọ̀ aṣìṣe: gbọ́dọ̀ bá àpẹẹrẹ mu ${i.pattern}` : `Aṣìṣe: ${r[i.format] ?? t.format}`;
      }
      case "not_multiple_of":
        return `Nọ́mbà aṣìṣe: gbọ́dọ̀ jẹ́ èyà pípín ti ${t.divisor}`;
      case "unrecognized_keys":
        return `Bọtìnì àìmọ̀: ${b(t.keys, ", ")}`;
      case "invalid_key":
        return `Bọtìnì aṣìṣe nínú ${t.origin}`;
      case "invalid_union":
        return "Ìbáwọlé aṣìṣe";
      case "invalid_element":
        return `Iye aṣìṣe nínú ${t.origin}`;
      default:
        return "Ìbáwọlé aṣìṣe";
    }
  };
};
function nb() {
  return {
    localeError: tb()
  };
}
const mo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ar: $v,
  az: _v,
  be: wv,
  bg: xv,
  ca: Iv,
  cs: Uv,
  da: Dv,
  de: Ev,
  en: vd,
  eo: Av,
  es: Rv,
  fa: Fv,
  fi: Jv,
  fr: Bv,
  frCA: Gv,
  he: qv,
  hu: Xv,
  hy: Yv,
  id: eh,
  is: nh,
  it: ih,
  ja: ah,
  ka: sh,
  kh: lh,
  km: hd,
  ko: mh,
  lt: ph,
  mk: vh,
  ms: bh,
  nl: yh,
  no: kh,
  ota: Sh,
  pl: Oh,
  ps: zh,
  pt: jh,
  ru: Th,
  sl: Nh,
  sv: Ah,
  ta: Rh,
  th: Fh,
  tr: Jh,
  ua: Bh,
  uk: bd,
  ur: Gh,
  uz: qh,
  vi: Xh,
  yo: nb,
  zhCN: Yh,
  zhTW: eb
}, Symbol.toStringTag, { value: "Module" }));
var Hc;
const fo = /* @__PURE__ */ Symbol("ZodOutput"), po = /* @__PURE__ */ Symbol("ZodInput");
class $d {
  constructor() {
    this._map = /* @__PURE__ */ new WeakMap(), this._idmap = /* @__PURE__ */ new Map();
  }
  add(n, ...r) {
    const o = r[0];
    return this._map.set(n, o), o && typeof o == "object" && "id" in o && this._idmap.set(o.id, n), this;
  }
  clear() {
    return this._map = /* @__PURE__ */ new WeakMap(), this._idmap = /* @__PURE__ */ new Map(), this;
  }
  remove(n) {
    const r = this._map.get(n);
    return r && typeof r == "object" && "id" in r && this._idmap.delete(r.id), this._map.delete(n), this;
  }
  get(n) {
    const r = n._zod.parent;
    if (r) {
      const o = { ...this.get(r) ?? {} };
      delete o.id;
      const t = { ...o, ...this._map.get(n) };
      return Object.keys(t).length ? t : void 0;
    }
    return this._map.get(n);
  }
  has(n) {
    return this._map.has(n);
  }
}
function gr() {
  return new $d();
}
(Hc = globalThis).__zod_globalRegistry ?? (Hc.__zod_globalRegistry = gr());
const oe = globalThis.__zod_globalRegistry;
// @__NO_SIDE_EFFECTS__
function yd(e, n) {
  return new e({
    type: "string",
    ...v(n)
  });
}
// @__NO_SIDE_EFFECTS__
function _d(e, n) {
  return new e({
    type: "string",
    coerce: !0,
    ...v(n)
  });
}
// @__NO_SIDE_EFFECTS__
function go(e, n) {
  return new e({
    type: "string",
    format: "email",
    check: "string_format",
    abort: !1,
    ...v(n)
  });
}
// @__NO_SIDE_EFFECTS__
function Qn(e, n) {
  return new e({
    type: "string",
    format: "guid",
    check: "string_format",
    abort: !1,
    ...v(n)
  });
}
// @__NO_SIDE_EFFECTS__
function vo(e, n) {
  return new e({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: !1,
    ...v(n)
  });
}
// @__NO_SIDE_EFFECTS__
function ho(e, n) {
  return new e({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: !1,
    version: "v4",
    ...v(n)
  });
}
// @__NO_SIDE_EFFECTS__
function bo(e, n) {
  return new e({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: !1,
    version: "v6",
    ...v(n)
  });
}
// @__NO_SIDE_EFFECTS__
function $o(e, n) {
  return new e({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: !1,
    version: "v7",
    ...v(n)
  });
}
// @__NO_SIDE_EFFECTS__
function vr(e, n) {
  return new e({
    type: "string",
    format: "url",
    check: "string_format",
    abort: !1,
    ...v(n)
  });
}
// @__NO_SIDE_EFFECTS__
function yo(e, n) {
  return new e({
    type: "string",
    format: "emoji",
    check: "string_format",
    abort: !1,
    ...v(n)
  });
}
// @__NO_SIDE_EFFECTS__
function _o(e, n) {
  return new e({
    type: "string",
    format: "nanoid",
    check: "string_format",
    abort: !1,
    ...v(n)
  });
}
// @__NO_SIDE_EFFECTS__
function ko(e, n) {
  return new e({
    type: "string",
    format: "cuid",
    check: "string_format",
    abort: !1,
    ...v(n)
  });
}
// @__NO_SIDE_EFFECTS__
function wo(e, n) {
  return new e({
    type: "string",
    format: "cuid2",
    check: "string_format",
    abort: !1,
    ...v(n)
  });
}
// @__NO_SIDE_EFFECTS__
function So(e, n) {
  return new e({
    type: "string",
    format: "ulid",
    check: "string_format",
    abort: !1,
    ...v(n)
  });
}
// @__NO_SIDE_EFFECTS__
function xo(e, n) {
  return new e({
    type: "string",
    format: "xid",
    check: "string_format",
    abort: !1,
    ...v(n)
  });
}
// @__NO_SIDE_EFFECTS__
function zo(e, n) {
  return new e({
    type: "string",
    format: "ksuid",
    check: "string_format",
    abort: !1,
    ...v(n)
  });
}
// @__NO_SIDE_EFFECTS__
function Io(e, n) {
  return new e({
    type: "string",
    format: "ipv4",
    check: "string_format",
    abort: !1,
    ...v(n)
  });
}
// @__NO_SIDE_EFFECTS__
function Oo(e, n) {
  return new e({
    type: "string",
    format: "ipv6",
    check: "string_format",
    abort: !1,
    ...v(n)
  });
}
// @__NO_SIDE_EFFECTS__
function kd(e, n) {
  return new e({
    type: "string",
    format: "mac",
    check: "string_format",
    abort: !1,
    ...v(n)
  });
}
// @__NO_SIDE_EFFECTS__
function Uo(e, n) {
  return new e({
    type: "string",
    format: "cidrv4",
    check: "string_format",
    abort: !1,
    ...v(n)
  });
}
// @__NO_SIDE_EFFECTS__
function jo(e, n) {
  return new e({
    type: "string",
    format: "cidrv6",
    check: "string_format",
    abort: !1,
    ...v(n)
  });
}
// @__NO_SIDE_EFFECTS__
function Do(e, n) {
  return new e({
    type: "string",
    format: "base64",
    check: "string_format",
    abort: !1,
    ...v(n)
  });
}
// @__NO_SIDE_EFFECTS__
function To(e, n) {
  return new e({
    type: "string",
    format: "base64url",
    check: "string_format",
    abort: !1,
    ...v(n)
  });
}
// @__NO_SIDE_EFFECTS__
function Eo(e, n) {
  return new e({
    type: "string",
    format: "e164",
    check: "string_format",
    abort: !1,
    ...v(n)
  });
}
// @__NO_SIDE_EFFECTS__
function No(e, n) {
  return new e({
    type: "string",
    format: "jwt",
    check: "string_format",
    abort: !1,
    ...v(n)
  });
}
const Po = {
  Any: null,
  Minute: -1,
  Second: 0,
  Millisecond: 3,
  Microsecond: 6
};
// @__NO_SIDE_EFFECTS__
function wd(e, n) {
  return new e({
    type: "string",
    format: "datetime",
    check: "string_format",
    offset: !1,
    local: !1,
    precision: null,
    ...v(n)
  });
}
// @__NO_SIDE_EFFECTS__
function Sd(e, n) {
  return new e({
    type: "string",
    format: "date",
    check: "string_format",
    ...v(n)
  });
}
// @__NO_SIDE_EFFECTS__
function xd(e, n) {
  return new e({
    type: "string",
    format: "time",
    check: "string_format",
    precision: null,
    ...v(n)
  });
}
// @__NO_SIDE_EFFECTS__
function zd(e, n) {
  return new e({
    type: "string",
    format: "duration",
    check: "string_format",
    ...v(n)
  });
}
// @__NO_SIDE_EFFECTS__
function Id(e, n) {
  return new e({
    type: "number",
    checks: [],
    ...v(n)
  });
}
// @__NO_SIDE_EFFECTS__
function Od(e, n) {
  return new e({
    type: "number",
    coerce: !0,
    checks: [],
    ...v(n)
  });
}
// @__NO_SIDE_EFFECTS__
function Ud(e, n) {
  return new e({
    type: "number",
    check: "number_format",
    abort: !1,
    format: "safeint",
    ...v(n)
  });
}
// @__NO_SIDE_EFFECTS__
function jd(e, n) {
  return new e({
    type: "number",
    check: "number_format",
    abort: !1,
    format: "float32",
    ...v(n)
  });
}
// @__NO_SIDE_EFFECTS__
function Dd(e, n) {
  return new e({
    type: "number",
    check: "number_format",
    abort: !1,
    format: "float64",
    ...v(n)
  });
}
// @__NO_SIDE_EFFECTS__
function Td(e, n) {
  return new e({
    type: "number",
    check: "number_format",
    abort: !1,
    format: "int32",
    ...v(n)
  });
}
// @__NO_SIDE_EFFECTS__
function Ed(e, n) {
  return new e({
    type: "number",
    check: "number_format",
    abort: !1,
    format: "uint32",
    ...v(n)
  });
}
// @__NO_SIDE_EFFECTS__
function Nd(e, n) {
  return new e({
    type: "boolean",
    ...v(n)
  });
}
// @__NO_SIDE_EFFECTS__
function Pd(e, n) {
  return new e({
    type: "boolean",
    coerce: !0,
    ...v(n)
  });
}
// @__NO_SIDE_EFFECTS__
function Ad(e, n) {
  return new e({
    type: "bigint",
    ...v(n)
  });
}
// @__NO_SIDE_EFFECTS__
function Zd(e, n) {
  return new e({
    type: "bigint",
    coerce: !0,
    ...v(n)
  });
}
// @__NO_SIDE_EFFECTS__
function Rd(e, n) {
  return new e({
    type: "bigint",
    check: "bigint_format",
    abort: !1,
    format: "int64",
    ...v(n)
  });
}
// @__NO_SIDE_EFFECTS__
function Cd(e, n) {
  return new e({
    type: "bigint",
    check: "bigint_format",
    abort: !1,
    format: "uint64",
    ...v(n)
  });
}
// @__NO_SIDE_EFFECTS__
function Fd(e, n) {
  return new e({
    type: "symbol",
    ...v(n)
  });
}
// @__NO_SIDE_EFFECTS__
function Ld(e, n) {
  return new e({
    type: "undefined",
    ...v(n)
  });
}
// @__NO_SIDE_EFFECTS__
function Jd(e, n) {
  return new e({
    type: "null",
    ...v(n)
  });
}
// @__NO_SIDE_EFFECTS__
function Md(e) {
  return new e({
    type: "any"
  });
}
// @__NO_SIDE_EFFECTS__
function Bd(e) {
  return new e({
    type: "unknown"
  });
}
// @__NO_SIDE_EFFECTS__
function Vd(e, n) {
  return new e({
    type: "never",
    ...v(n)
  });
}
// @__NO_SIDE_EFFECTS__
function Gd(e, n) {
  return new e({
    type: "void",
    ...v(n)
  });
}
// @__NO_SIDE_EFFECTS__
function Wd(e, n) {
  return new e({
    type: "date",
    ...v(n)
  });
}
// @__NO_SIDE_EFFECTS__
function qd(e, n) {
  return new e({
    type: "date",
    coerce: !0,
    ...v(n)
  });
}
// @__NO_SIDE_EFFECTS__
function Kd(e, n) {
  return new e({
    type: "nan",
    ...v(n)
  });
}
// @__NO_SIDE_EFFECTS__
function Se(e, n) {
  return new no({
    check: "less_than",
    ...v(n),
    value: e,
    inclusive: !1
  });
}
// @__NO_SIDE_EFFECTS__
function ae(e, n) {
  return new no({
    check: "less_than",
    ...v(n),
    value: e,
    inclusive: !0
  });
}
// @__NO_SIDE_EFFECTS__
function xe(e, n) {
  return new ro({
    check: "greater_than",
    ...v(n),
    value: e,
    inclusive: !1
  });
}
// @__NO_SIDE_EFFECTS__
function ee(e, n) {
  return new ro({
    check: "greater_than",
    ...v(n),
    value: e,
    inclusive: !0
  });
}
// @__NO_SIDE_EFFECTS__
function hr(e) {
  return /* @__PURE__ */ xe(0, e);
}
// @__NO_SIDE_EFFECTS__
function br(e) {
  return /* @__PURE__ */ Se(0, e);
}
// @__NO_SIDE_EFFECTS__
function $r(e) {
  return /* @__PURE__ */ ae(0, e);
}
// @__NO_SIDE_EFFECTS__
function yr(e) {
  return /* @__PURE__ */ ee(0, e);
}
// @__NO_SIDE_EFFECTS__
function Le(e, n) {
  return new Zu({
    check: "multiple_of",
    ...v(n),
    value: e
  });
}
// @__NO_SIDE_EFFECTS__
function Be(e, n) {
  return new Fu({
    check: "max_size",
    ...v(n),
    maximum: e
  });
}
// @__NO_SIDE_EFFECTS__
function ze(e, n) {
  return new Lu({
    check: "min_size",
    ...v(n),
    minimum: e
  });
}
// @__NO_SIDE_EFFECTS__
function lt(e, n) {
  return new Ju({
    check: "size_equals",
    ...v(n),
    size: e
  });
}
// @__NO_SIDE_EFFECTS__
function dt(e, n) {
  return new Mu({
    check: "max_length",
    ...v(n),
    maximum: e
  });
}
// @__NO_SIDE_EFFECTS__
function Ue(e, n) {
  return new Bu({
    check: "min_length",
    ...v(n),
    minimum: e
  });
}
// @__NO_SIDE_EFFECTS__
function mt(e, n) {
  return new Vu({
    check: "length_equals",
    ...v(n),
    length: e
  });
}
// @__NO_SIDE_EFFECTS__
function Gt(e, n) {
  return new Gu({
    check: "string_format",
    format: "regex",
    ...v(n),
    pattern: e
  });
}
// @__NO_SIDE_EFFECTS__
function Wt(e) {
  return new Wu({
    check: "string_format",
    format: "lowercase",
    ...v(e)
  });
}
// @__NO_SIDE_EFFECTS__
function qt(e) {
  return new qu({
    check: "string_format",
    format: "uppercase",
    ...v(e)
  });
}
// @__NO_SIDE_EFFECTS__
function Kt(e, n) {
  return new Ku({
    check: "string_format",
    format: "includes",
    ...v(n),
    includes: e
  });
}
// @__NO_SIDE_EFFECTS__
function Xt(e, n) {
  return new Xu({
    check: "string_format",
    format: "starts_with",
    ...v(n),
    prefix: e
  });
}
// @__NO_SIDE_EFFECTS__
function Ht(e, n) {
  return new Hu({
    check: "string_format",
    format: "ends_with",
    ...v(n),
    suffix: e
  });
}
// @__NO_SIDE_EFFECTS__
function _r(e, n, r) {
  return new Yu({
    check: "property",
    property: e,
    schema: n,
    ...v(r)
  });
}
// @__NO_SIDE_EFFECTS__
function Yt(e, n) {
  return new Qu({
    check: "mime_type",
    mime: e,
    ...v(n)
  });
}
// @__NO_SIDE_EFFECTS__
function $e(e) {
  return new el({
    check: "overwrite",
    tx: e
  });
}
// @__NO_SIDE_EFFECTS__
function Qt(e) {
  return /* @__PURE__ */ $e((n) => n.normalize(e));
}
// @__NO_SIDE_EFFECTS__
function en() {
  return /* @__PURE__ */ $e((e) => e.trim());
}
// @__NO_SIDE_EFFECTS__
function tn() {
  return /* @__PURE__ */ $e((e) => e.toLowerCase());
}
// @__NO_SIDE_EFFECTS__
function nn() {
  return /* @__PURE__ */ $e((e) => e.toUpperCase());
}
// @__NO_SIDE_EFFECTS__
function rn() {
  return /* @__PURE__ */ $e((e) => Zs(e));
}
// @__NO_SIDE_EFFECTS__
function Xd(e, n, r) {
  return new e({
    type: "array",
    element: n,
    // get element() {
    //   return element;
    // },
    ...v(r)
  });
}
// @__NO_SIDE_EFFECTS__
function rb(e, n, r) {
  return new e({
    type: "union",
    options: n,
    ...v(r)
  });
}
function ib(e, n, r) {
  return new e({
    type: "union",
    options: n,
    inclusive: !1,
    ...v(r)
  });
}
// @__NO_SIDE_EFFECTS__
function ob(e, n, r, o) {
  return new e({
    type: "union",
    options: r,
    discriminator: n,
    ...v(o)
  });
}
// @__NO_SIDE_EFFECTS__
function ab(e, n, r) {
  return new e({
    type: "intersection",
    left: n,
    right: r
  });
}
// @__NO_SIDE_EFFECTS__
function cb(e, n, r, o) {
  const t = r instanceof O, i = t ? o : r, a = t ? r : null;
  return new e({
    type: "tuple",
    items: n,
    rest: a,
    ...v(i)
  });
}
// @__NO_SIDE_EFFECTS__
function sb(e, n, r, o) {
  return new e({
    type: "record",
    keyType: n,
    valueType: r,
    ...v(o)
  });
}
// @__NO_SIDE_EFFECTS__
function ub(e, n, r, o) {
  return new e({
    type: "map",
    keyType: n,
    valueType: r,
    ...v(o)
  });
}
// @__NO_SIDE_EFFECTS__
function lb(e, n, r) {
  return new e({
    type: "set",
    valueType: n,
    ...v(r)
  });
}
// @__NO_SIDE_EFFECTS__
function db(e, n, r) {
  const o = Array.isArray(n) ? Object.fromEntries(n.map((t) => [t, t])) : n;
  return new e({
    type: "enum",
    entries: o,
    ...v(r)
  });
}
// @__NO_SIDE_EFFECTS__
function mb(e, n, r) {
  return new e({
    type: "enum",
    entries: n,
    ...v(r)
  });
}
// @__NO_SIDE_EFFECTS__
function fb(e, n, r) {
  return new e({
    type: "literal",
    values: Array.isArray(n) ? n : [n],
    ...v(r)
  });
}
// @__NO_SIDE_EFFECTS__
function Hd(e, n) {
  return new e({
    type: "file",
    ...v(n)
  });
}
// @__NO_SIDE_EFFECTS__
function pb(e, n) {
  return new e({
    type: "transform",
    transform: n
  });
}
// @__NO_SIDE_EFFECTS__
function gb(e, n) {
  return new e({
    type: "optional",
    innerType: n
  });
}
// @__NO_SIDE_EFFECTS__
function vb(e, n) {
  return new e({
    type: "nullable",
    innerType: n
  });
}
// @__NO_SIDE_EFFECTS__
function hb(e, n, r) {
  return new e({
    type: "default",
    innerType: n,
    get defaultValue() {
      return typeof r == "function" ? r() : sr(r);
    }
  });
}
// @__NO_SIDE_EFFECTS__
function bb(e, n, r) {
  return new e({
    type: "nonoptional",
    innerType: n,
    ...v(r)
  });
}
// @__NO_SIDE_EFFECTS__
function $b(e, n) {
  return new e({
    type: "success",
    innerType: n
  });
}
// @__NO_SIDE_EFFECTS__
function yb(e, n, r) {
  return new e({
    type: "catch",
    innerType: n,
    catchValue: typeof r == "function" ? r : () => r
  });
}
// @__NO_SIDE_EFFECTS__
function _b(e, n, r) {
  return new e({
    type: "pipe",
    in: n,
    out: r
  });
}
// @__NO_SIDE_EFFECTS__
function kb(e, n) {
  return new e({
    type: "readonly",
    innerType: n
  });
}
// @__NO_SIDE_EFFECTS__
function wb(e, n, r) {
  return new e({
    type: "template_literal",
    parts: n,
    ...v(r)
  });
}
// @__NO_SIDE_EFFECTS__
function Sb(e, n) {
  return new e({
    type: "lazy",
    getter: n
  });
}
// @__NO_SIDE_EFFECTS__
function xb(e, n) {
  return new e({
    type: "promise",
    innerType: n
  });
}
// @__NO_SIDE_EFFECTS__
function Yd(e, n, r) {
  const o = v(r);
  return o.abort ?? (o.abort = !0), new e({
    type: "custom",
    check: "custom",
    fn: n,
    ...o
  });
}
// @__NO_SIDE_EFFECTS__
function Qd(e, n, r) {
  return new e({
    type: "custom",
    check: "custom",
    fn: n,
    ...v(r)
  });
}
// @__NO_SIDE_EFFECTS__
function em(e) {
  const n = /* @__PURE__ */ tm((r) => (r.addIssue = (o) => {
    if (typeof o == "string")
      r.issues.push(Xe(o, r.value, n._zod.def));
    else {
      const t = o;
      t.fatal && (t.continue = !1), t.code ?? (t.code = "custom"), t.input ?? (t.input = r.value), t.inst ?? (t.inst = n), t.continue ?? (t.continue = !n._zod.def.abort), r.issues.push(Xe(t));
    }
  }, e(r.value, r)));
  return n;
}
// @__NO_SIDE_EFFECTS__
function tm(e, n) {
  const r = new F({
    check: "custom",
    ...v(n)
  });
  return r._zod.check = e, r;
}
// @__NO_SIDE_EFFECTS__
function nm(e) {
  const n = new F({ check: "describe" });
  return n._zod.onattach = [
    (r) => {
      const o = oe.get(r) ?? {};
      oe.add(r, { ...o, description: e });
    }
  ], n._zod.check = () => {
  }, n;
}
// @__NO_SIDE_EFFECTS__
function rm(e) {
  const n = new F({ check: "meta" });
  return n._zod.onattach = [
    (r) => {
      const o = oe.get(r) ?? {};
      oe.add(r, { ...o, ...e });
    }
  ], n._zod.check = () => {
  }, n;
}
// @__NO_SIDE_EFFECTS__
function im(e, n) {
  const r = v(n);
  let o = r.truthy ?? ["true", "1", "yes", "on", "y", "enabled"], t = r.falsy ?? ["false", "0", "no", "off", "n", "disabled"];
  r.case !== "sensitive" && (o = o.map((h) => typeof h == "string" ? h.toLowerCase() : h), t = t.map((h) => typeof h == "string" ? h.toLowerCase() : h));
  const i = new Set(o), a = new Set(t), c = e.Codec ?? lo, u = e.Boolean ?? ao, s = e.String ?? Vt, l = new s({ type: "string", error: r.error }), d = new u({ type: "boolean", error: r.error }), g = new c({
    type: "pipe",
    in: l,
    out: d,
    transform: ((h, p) => {
      let $ = h;
      return r.case !== "sensitive" && ($ = $.toLowerCase()), i.has($) ? !0 : a.has($) ? !1 : (p.issues.push({
        code: "invalid_value",
        expected: "stringbool",
        values: [...i, ...a],
        input: p.value,
        inst: g,
        continue: !1
      }), {});
    }),
    reverseTransform: ((h, p) => h === !0 ? o[0] || "true" : t[0] || "false"),
    error: r.error
  });
  return g;
}
// @__NO_SIDE_EFFECTS__
function on(e, n, r, o = {}) {
  const t = v(o), i = {
    ...v(o),
    check: "string_format",
    type: "string",
    format: n,
    fn: typeof r == "function" ? r : (c) => r.test(c),
    ...t
  };
  return r instanceof RegExp && (i.pattern = r), new e(i);
}
function Ye(e) {
  let n = e?.target ?? "draft-2020-12";
  return n === "draft-4" && (n = "draft-04"), n === "draft-7" && (n = "draft-07"), {
    processors: e.processors ?? {},
    metadataRegistry: e?.metadata ?? oe,
    target: n,
    unrepresentable: e?.unrepresentable ?? "throw",
    override: e?.override ?? (() => {
    }),
    io: e?.io ?? "output",
    counter: 0,
    seen: /* @__PURE__ */ new Map(),
    cycles: e?.cycles ?? "ref",
    reused: e?.reused ?? "inline",
    external: e?.external ?? void 0
  };
}
function Z(e, n, r = { path: [], schemaPath: [] }) {
  var o;
  const t = e._zod.def, i = n.seen.get(e);
  if (i)
    return i.count++, r.schemaPath.includes(e) && (i.cycle = r.path), i.schema;
  const a = { schema: {}, count: 1, cycle: void 0, path: r.path };
  n.seen.set(e, a);
  const c = e._zod.toJSONSchema?.();
  if (c)
    a.schema = c;
  else {
    const l = {
      ...r,
      schemaPath: [...r.schemaPath, e],
      path: r.path
    };
    if (e._zod.processJSONSchema)
      e._zod.processJSONSchema(n, a.schema, l);
    else {
      const g = a.schema, h = n.processors[t.type];
      if (!h)
        throw new Error(`[toJSONSchema]: Non-representable type encountered: ${t.type}`);
      h(e, n, g, l);
    }
    const d = e._zod.parent;
    d && (a.ref || (a.ref = d), Z(d, n, l), n.seen.get(d).isParent = !0);
  }
  const u = n.metadataRegistry.get(e);
  return u && Object.assign(a.schema, u), n.io === "input" && Q(e) && (delete a.schema.examples, delete a.schema.default), n.io === "input" && a.schema._prefault && ((o = a.schema).default ?? (o.default = a.schema._prefault)), delete a.schema._prefault, n.seen.get(e).schema;
}
function Qe(e, n) {
  const r = e.seen.get(n);
  if (!r)
    throw new Error("Unprocessed schema. This is a bug in Zod.");
  const o = /* @__PURE__ */ new Map();
  for (const a of e.seen.entries()) {
    const c = e.metadataRegistry.get(a[0])?.id;
    if (c) {
      const u = o.get(c);
      if (u && u !== a[0])
        throw new Error(`Duplicate schema id "${c}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);
      o.set(c, a[0]);
    }
  }
  const t = (a) => {
    const c = e.target === "draft-2020-12" ? "$defs" : "definitions";
    if (e.external) {
      const d = e.external.registry.get(a[0])?.id, g = e.external.uri ?? ((p) => p);
      if (d)
        return { ref: g(d) };
      const h = a[1].defId ?? a[1].schema.id ?? `schema${e.counter++}`;
      return a[1].defId = h, { defId: h, ref: `${g("__shared")}#/${c}/${h}` };
    }
    if (a[1] === r)
      return { ref: "#" };
    const s = `#/${c}/`, l = a[1].schema.id ?? `__schema${e.counter++}`;
    return { defId: l, ref: s + l };
  }, i = (a) => {
    if (a[1].schema.$ref)
      return;
    const c = a[1], { ref: u, defId: s } = t(a);
    c.def = { ...c.schema }, s && (c.defId = s);
    const l = c.schema;
    for (const d in l)
      delete l[d];
    l.$ref = u;
  };
  if (e.cycles === "throw")
    for (const a of e.seen.entries()) {
      const c = a[1];
      if (c.cycle)
        throw new Error(`Cycle detected: #/${c.cycle?.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`);
    }
  for (const a of e.seen.entries()) {
    const c = a[1];
    if (n === a[0]) {
      i(a);
      continue;
    }
    if (e.external) {
      const s = e.external.registry.get(a[0])?.id;
      if (n !== a[0] && s) {
        i(a);
        continue;
      }
    }
    if (e.metadataRegistry.get(a[0])?.id) {
      i(a);
      continue;
    }
    if (c.cycle) {
      i(a);
      continue;
    }
    if (c.count > 1 && e.reused === "ref") {
      i(a);
      continue;
    }
  }
}
function et(e, n) {
  const r = e.seen.get(n);
  if (!r)
    throw new Error("Unprocessed schema. This is a bug in Zod.");
  const o = (a) => {
    const c = e.seen.get(a);
    if (c.ref === null)
      return;
    const u = c.def ?? c.schema, s = { ...u }, l = c.ref;
    if (c.ref = null, l) {
      o(l);
      const g = e.seen.get(l), h = g.schema;
      if (h.$ref && (e.target === "draft-07" || e.target === "draft-04" || e.target === "openapi-3.0") ? (u.allOf = u.allOf ?? [], u.allOf.push(h)) : Object.assign(u, h), Object.assign(u, s), a._zod.parent === l)
        for (const $ in u)
          $ === "$ref" || $ === "allOf" || $ in s || delete u[$];
      if (h.$ref && g.def)
        for (const $ in u)
          $ === "$ref" || $ === "allOf" || $ in g.def && JSON.stringify(u[$]) === JSON.stringify(g.def[$]) && delete u[$];
    }
    const d = a._zod.parent;
    if (d && d !== l) {
      o(d);
      const g = e.seen.get(d);
      if (g?.schema.$ref && (u.$ref = g.schema.$ref, g.def))
        for (const h in u)
          h === "$ref" || h === "allOf" || h in g.def && JSON.stringify(u[h]) === JSON.stringify(g.def[h]) && delete u[h];
    }
    e.override({
      zodSchema: a,
      jsonSchema: u,
      path: c.path ?? []
    });
  };
  for (const a of [...e.seen.entries()].reverse())
    o(a[0]);
  const t = {};
  if (e.target === "draft-2020-12" ? t.$schema = "https://json-schema.org/draft/2020-12/schema" : e.target === "draft-07" ? t.$schema = "http://json-schema.org/draft-07/schema#" : e.target === "draft-04" ? t.$schema = "http://json-schema.org/draft-04/schema#" : e.target, e.external?.uri) {
    const a = e.external.registry.get(n)?.id;
    if (!a)
      throw new Error("Schema is missing an `id` property");
    t.$id = e.external.uri(a);
  }
  Object.assign(t, r.def ?? r.schema);
  const i = e.external?.defs ?? {};
  for (const a of e.seen.entries()) {
    const c = a[1];
    c.def && c.defId && (i[c.defId] = c.def);
  }
  e.external || Object.keys(i).length > 0 && (e.target === "draft-2020-12" ? t.$defs = i : t.definitions = i);
  try {
    const a = JSON.parse(JSON.stringify(t));
    return Object.defineProperty(a, "~standard", {
      value: {
        ...n["~standard"],
        jsonSchema: {
          input: jt(n, "input", e.processors),
          output: jt(n, "output", e.processors)
        }
      },
      enumerable: !1,
      writable: !1
    }), a;
  } catch {
    throw new Error("Error converting schema to JSON.");
  }
}
function Q(e, n) {
  const r = n ?? { seen: /* @__PURE__ */ new Set() };
  if (r.seen.has(e))
    return !1;
  r.seen.add(e);
  const o = e._zod.def;
  if (o.type === "transform")
    return !0;
  if (o.type === "array")
    return Q(o.element, r);
  if (o.type === "set")
    return Q(o.valueType, r);
  if (o.type === "lazy")
    return Q(o.getter(), r);
  if (o.type === "promise" || o.type === "optional" || o.type === "nonoptional" || o.type === "nullable" || o.type === "readonly" || o.type === "default" || o.type === "prefault")
    return Q(o.innerType, r);
  if (o.type === "intersection")
    return Q(o.left, r) || Q(o.right, r);
  if (o.type === "record" || o.type === "map")
    return Q(o.keyType, r) || Q(o.valueType, r);
  if (o.type === "pipe")
    return Q(o.in, r) || Q(o.out, r);
  if (o.type === "object") {
    for (const t in o.shape)
      if (Q(o.shape[t], r))
        return !0;
    return !1;
  }
  if (o.type === "union") {
    for (const t of o.options)
      if (Q(t, r))
        return !0;
    return !1;
  }
  if (o.type === "tuple") {
    for (const t of o.items)
      if (Q(t, r))
        return !0;
    return !!(o.rest && Q(o.rest, r));
  }
  return !1;
}
const om = (e, n = {}) => (r) => {
  const o = Ye({ ...r, processors: n });
  return Z(e, o), Qe(o, e), et(o, e);
}, jt = (e, n, r = {}) => (o) => {
  const { libraryOptions: t, target: i } = o ?? {}, a = Ye({ ...t ?? {}, target: i, io: n, processors: r });
  return Z(e, a), Qe(a, e), et(a, e);
}, zb = {
  guid: "uuid",
  url: "uri",
  datetime: "date-time",
  json_string: "json-string",
  regex: ""
  // do not set
}, am = (e, n, r, o) => {
  const t = r;
  t.type = "string";
  const { minimum: i, maximum: a, format: c, patterns: u, contentEncoding: s } = e._zod.bag;
  if (typeof i == "number" && (t.minLength = i), typeof a == "number" && (t.maxLength = a), c && (t.format = zb[c] ?? c, t.format === "" && delete t.format, c === "time" && delete t.format), s && (t.contentEncoding = s), u && u.size > 0) {
    const l = [...u];
    l.length === 1 ? t.pattern = l[0].source : l.length > 1 && (t.allOf = [
      ...l.map((d) => ({
        ...n.target === "draft-07" || n.target === "draft-04" || n.target === "openapi-3.0" ? { type: "string" } : {},
        pattern: d.source
      }))
    ]);
  }
}, cm = (e, n, r, o) => {
  const t = r, { minimum: i, maximum: a, format: c, multipleOf: u, exclusiveMaximum: s, exclusiveMinimum: l } = e._zod.bag;
  typeof c == "string" && c.includes("int") ? t.type = "integer" : t.type = "number", typeof l == "number" && (n.target === "draft-04" || n.target === "openapi-3.0" ? (t.minimum = l, t.exclusiveMinimum = !0) : t.exclusiveMinimum = l), typeof i == "number" && (t.minimum = i, typeof l == "number" && n.target !== "draft-04" && (l >= i ? delete t.minimum : delete t.exclusiveMinimum)), typeof s == "number" && (n.target === "draft-04" || n.target === "openapi-3.0" ? (t.maximum = s, t.exclusiveMaximum = !0) : t.exclusiveMaximum = s), typeof a == "number" && (t.maximum = a, typeof s == "number" && n.target !== "draft-04" && (s <= a ? delete t.maximum : delete t.exclusiveMaximum)), typeof u == "number" && (t.multipleOf = u);
}, sm = (e, n, r, o) => {
  r.type = "boolean";
}, um = (e, n, r, o) => {
  if (n.unrepresentable === "throw")
    throw new Error("BigInt cannot be represented in JSON Schema");
}, lm = (e, n, r, o) => {
  if (n.unrepresentable === "throw")
    throw new Error("Symbols cannot be represented in JSON Schema");
}, dm = (e, n, r, o) => {
  n.target === "openapi-3.0" ? (r.type = "string", r.nullable = !0, r.enum = [null]) : r.type = "null";
}, mm = (e, n, r, o) => {
  if (n.unrepresentable === "throw")
    throw new Error("Undefined cannot be represented in JSON Schema");
}, fm = (e, n, r, o) => {
  if (n.unrepresentable === "throw")
    throw new Error("Void cannot be represented in JSON Schema");
}, pm = (e, n, r, o) => {
  r.not = {};
}, gm = (e, n, r, o) => {
}, vm = (e, n, r, o) => {
}, hm = (e, n, r, o) => {
  if (n.unrepresentable === "throw")
    throw new Error("Date cannot be represented in JSON Schema");
}, bm = (e, n, r, o) => {
  const t = e._zod.def, i = Fi(t.entries);
  i.every((a) => typeof a == "number") && (r.type = "number"), i.every((a) => typeof a == "string") && (r.type = "string"), r.enum = i;
}, $m = (e, n, r, o) => {
  const t = e._zod.def, i = [];
  for (const a of t.values)
    if (a === void 0) {
      if (n.unrepresentable === "throw")
        throw new Error("Literal `undefined` cannot be represented in JSON Schema");
    } else if (typeof a == "bigint") {
      if (n.unrepresentable === "throw")
        throw new Error("BigInt literals cannot be represented in JSON Schema");
      i.push(Number(a));
    } else
      i.push(a);
  if (i.length !== 0) if (i.length === 1) {
    const a = i[0];
    r.type = a === null ? "null" : typeof a, n.target === "draft-04" || n.target === "openapi-3.0" ? r.enum = [a] : r.const = a;
  } else
    i.every((a) => typeof a == "number") && (r.type = "number"), i.every((a) => typeof a == "string") && (r.type = "string"), i.every((a) => typeof a == "boolean") && (r.type = "boolean"), i.every((a) => a === null) && (r.type = "null"), r.enum = i;
}, ym = (e, n, r, o) => {
  if (n.unrepresentable === "throw")
    throw new Error("NaN cannot be represented in JSON Schema");
}, _m = (e, n, r, o) => {
  const t = r, i = e._zod.pattern;
  if (!i)
    throw new Error("Pattern not found in template literal");
  t.type = "string", t.pattern = i.source;
}, km = (e, n, r, o) => {
  const t = r, i = {
    type: "string",
    format: "binary",
    contentEncoding: "binary"
  }, { minimum: a, maximum: c, mime: u } = e._zod.bag;
  a !== void 0 && (i.minLength = a), c !== void 0 && (i.maxLength = c), u ? u.length === 1 ? (i.contentMediaType = u[0], Object.assign(t, i)) : (Object.assign(t, i), t.anyOf = u.map((s) => ({ contentMediaType: s }))) : Object.assign(t, i);
}, wm = (e, n, r, o) => {
  r.type = "boolean";
}, Sm = (e, n, r, o) => {
  if (n.unrepresentable === "throw")
    throw new Error("Custom types cannot be represented in JSON Schema");
}, xm = (e, n, r, o) => {
  if (n.unrepresentable === "throw")
    throw new Error("Function types cannot be represented in JSON Schema");
}, zm = (e, n, r, o) => {
  if (n.unrepresentable === "throw")
    throw new Error("Transforms cannot be represented in JSON Schema");
}, Im = (e, n, r, o) => {
  if (n.unrepresentable === "throw")
    throw new Error("Map cannot be represented in JSON Schema");
}, Om = (e, n, r, o) => {
  if (n.unrepresentable === "throw")
    throw new Error("Set cannot be represented in JSON Schema");
}, Um = (e, n, r, o) => {
  const t = r, i = e._zod.def, { minimum: a, maximum: c } = e._zod.bag;
  typeof a == "number" && (t.minItems = a), typeof c == "number" && (t.maxItems = c), t.type = "array", t.items = Z(i.element, n, { ...o, path: [...o.path, "items"] });
}, jm = (e, n, r, o) => {
  const t = r, i = e._zod.def;
  t.type = "object", t.properties = {};
  const a = i.shape;
  for (const s in a)
    t.properties[s] = Z(a[s], n, {
      ...o,
      path: [...o.path, "properties", s]
    });
  const c = new Set(Object.keys(a)), u = new Set([...c].filter((s) => {
    const l = i.shape[s]._zod;
    return n.io === "input" ? l.optin === void 0 : l.optout === void 0;
  }));
  u.size > 0 && (t.required = Array.from(u)), i.catchall?._zod.def.type === "never" ? t.additionalProperties = !1 : i.catchall ? i.catchall && (t.additionalProperties = Z(i.catchall, n, {
    ...o,
    path: [...o.path, "additionalProperties"]
  })) : n.io === "output" && (t.additionalProperties = !1);
}, Ao = (e, n, r, o) => {
  const t = e._zod.def, i = t.inclusive === !1, a = t.options.map((c, u) => Z(c, n, {
    ...o,
    path: [...o.path, i ? "oneOf" : "anyOf", u]
  }));
  i ? r.oneOf = a : r.anyOf = a;
}, Dm = (e, n, r, o) => {
  const t = e._zod.def, i = Z(t.left, n, {
    ...o,
    path: [...o.path, "allOf", 0]
  }), a = Z(t.right, n, {
    ...o,
    path: [...o.path, "allOf", 1]
  }), c = (s) => "allOf" in s && Object.keys(s).length === 1, u = [
    ...c(i) ? i.allOf : [i],
    ...c(a) ? a.allOf : [a]
  ];
  r.allOf = u;
}, Tm = (e, n, r, o) => {
  const t = r, i = e._zod.def;
  t.type = "array";
  const a = n.target === "draft-2020-12" ? "prefixItems" : "items", c = n.target === "draft-2020-12" || n.target === "openapi-3.0" ? "items" : "additionalItems", u = i.items.map((g, h) => Z(g, n, {
    ...o,
    path: [...o.path, a, h]
  })), s = i.rest ? Z(i.rest, n, {
    ...o,
    path: [...o.path, c, ...n.target === "openapi-3.0" ? [i.items.length] : []]
  }) : null;
  n.target === "draft-2020-12" ? (t.prefixItems = u, s && (t.items = s)) : n.target === "openapi-3.0" ? (t.items = {
    anyOf: u
  }, s && t.items.anyOf.push(s), t.minItems = u.length, s || (t.maxItems = u.length)) : (t.items = u, s && (t.additionalItems = s));
  const { minimum: l, maximum: d } = e._zod.bag;
  typeof l == "number" && (t.minItems = l), typeof d == "number" && (t.maxItems = d);
}, Em = (e, n, r, o) => {
  const t = r, i = e._zod.def;
  t.type = "object";
  const a = i.keyType, u = a._zod.bag?.patterns;
  if (i.mode === "loose" && u && u.size > 0) {
    const l = Z(i.valueType, n, {
      ...o,
      path: [...o.path, "patternProperties", "*"]
    });
    t.patternProperties = {};
    for (const d of u)
      t.patternProperties[d.source] = l;
  } else
    (n.target === "draft-07" || n.target === "draft-2020-12") && (t.propertyNames = Z(i.keyType, n, {
      ...o,
      path: [...o.path, "propertyNames"]
    })), t.additionalProperties = Z(i.valueType, n, {
      ...o,
      path: [...o.path, "additionalProperties"]
    });
  const s = a._zod.values;
  if (s) {
    const l = [...s].filter((d) => typeof d == "string" || typeof d == "number");
    l.length > 0 && (t.required = l);
  }
}, Nm = (e, n, r, o) => {
  const t = e._zod.def, i = Z(t.innerType, n, o), a = n.seen.get(e);
  n.target === "openapi-3.0" ? (a.ref = t.innerType, r.nullable = !0) : r.anyOf = [i, { type: "null" }];
}, Pm = (e, n, r, o) => {
  const t = e._zod.def;
  Z(t.innerType, n, o);
  const i = n.seen.get(e);
  i.ref = t.innerType;
}, Am = (e, n, r, o) => {
  const t = e._zod.def;
  Z(t.innerType, n, o);
  const i = n.seen.get(e);
  i.ref = t.innerType, r.default = JSON.parse(JSON.stringify(t.defaultValue));
}, Zm = (e, n, r, o) => {
  const t = e._zod.def;
  Z(t.innerType, n, o);
  const i = n.seen.get(e);
  i.ref = t.innerType, n.io === "input" && (r._prefault = JSON.parse(JSON.stringify(t.defaultValue)));
}, Rm = (e, n, r, o) => {
  const t = e._zod.def;
  Z(t.innerType, n, o);
  const i = n.seen.get(e);
  i.ref = t.innerType;
  let a;
  try {
    a = t.catchValue(void 0);
  } catch {
    throw new Error("Dynamic catch values are not supported in JSON Schema");
  }
  r.default = a;
}, Cm = (e, n, r, o) => {
  const t = e._zod.def, i = n.io === "input" ? t.in._zod.def.type === "transform" ? t.out : t.in : t.out;
  Z(i, n, o);
  const a = n.seen.get(e);
  a.ref = i;
}, Fm = (e, n, r, o) => {
  const t = e._zod.def;
  Z(t.innerType, n, o);
  const i = n.seen.get(e);
  i.ref = t.innerType, r.readOnly = !0;
}, Lm = (e, n, r, o) => {
  const t = e._zod.def;
  Z(t.innerType, n, o);
  const i = n.seen.get(e);
  i.ref = t.innerType;
}, Zo = (e, n, r, o) => {
  const t = e._zod.def;
  Z(t.innerType, n, o);
  const i = n.seen.get(e);
  i.ref = t.innerType;
}, Jm = (e, n, r, o) => {
  const t = e._zod.innerType;
  Z(t, n, o);
  const i = n.seen.get(e);
  i.ref = t;
}, Ti = {
  string: am,
  number: cm,
  boolean: sm,
  bigint: um,
  symbol: lm,
  null: dm,
  undefined: mm,
  void: fm,
  never: pm,
  any: gm,
  unknown: vm,
  date: hm,
  enum: bm,
  literal: $m,
  nan: ym,
  template_literal: _m,
  file: km,
  success: wm,
  custom: Sm,
  function: xm,
  transform: zm,
  map: Im,
  set: Om,
  array: Um,
  object: jm,
  union: Ao,
  intersection: Dm,
  tuple: Tm,
  record: Em,
  nullable: Nm,
  nonoptional: Pm,
  default: Am,
  prefault: Zm,
  catch: Rm,
  pipe: Cm,
  readonly: Fm,
  promise: Lm,
  optional: Zo,
  lazy: Jm
};
function Ro(e, n) {
  if ("_idmap" in e) {
    const o = e, t = Ye({ ...n, processors: Ti }), i = {};
    for (const u of o._idmap.entries()) {
      const [s, l] = u;
      Z(l, t);
    }
    const a = {}, c = {
      registry: o,
      uri: n?.uri,
      defs: i
    };
    t.external = c;
    for (const u of o._idmap.entries()) {
      const [s, l] = u;
      Qe(t, l), a[s] = et(t, l);
    }
    if (Object.keys(i).length > 0) {
      const u = t.target === "draft-2020-12" ? "$defs" : "definitions";
      a.__shared = {
        [u]: i
      };
    }
    return { schemas: a };
  }
  const r = Ye({ ...n, processors: Ti });
  return Z(e, r), Qe(r, e), et(r, e);
}
class Ib {
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
  set counter(n) {
    this.ctx.counter = n;
  }
  /** @deprecated Access via ctx instead */
  get seen() {
    return this.ctx.seen;
  }
  constructor(n) {
    let r = n?.target ?? "draft-2020-12";
    r === "draft-4" && (r = "draft-04"), r === "draft-7" && (r = "draft-07"), this.ctx = Ye({
      processors: Ti,
      target: r,
      ...n?.metadata && { metadata: n.metadata },
      ...n?.unrepresentable && { unrepresentable: n.unrepresentable },
      ...n?.override && { override: n.override },
      ...n?.io && { io: n.io }
    });
  }
  /**
   * Process a schema to prepare it for JSON Schema generation.
   * This must be called before emit().
   */
  process(n, r = { path: [], schemaPath: [] }) {
    return Z(n, this.ctx, r);
  }
  /**
   * Emit the final JSON Schema after processing.
   * Must call process() first.
   */
  emit(n, r) {
    r && (r.cycles && (this.ctx.cycles = r.cycles), r.reused && (this.ctx.reused = r.reused), r.external && (this.ctx.external = r.external)), Qe(this.ctx, n);
    const o = et(this.ctx, n), { "~standard": t, ...i } = o;
    return i;
  }
}
const Ob = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null
}, Symbol.toStringTag, { value: "Module" })), Mm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  $ZodAny: Pl,
  $ZodArray: Fl,
  $ZodAsyncError: Re,
  $ZodBase64: wl,
  $ZodBase64URL: xl,
  $ZodBigInt: co,
  $ZodBigIntFormat: Dl,
  $ZodBoolean: ao,
  $ZodCIDRv4: _l,
  $ZodCIDRv6: kl,
  $ZodCUID: ul,
  $ZodCUID2: ll,
  $ZodCatch: cd,
  $ZodCheck: F,
  $ZodCheckBigIntFormat: Cu,
  $ZodCheckEndsWith: Hu,
  $ZodCheckGreaterThan: ro,
  $ZodCheckIncludes: Ku,
  $ZodCheckLengthEquals: Vu,
  $ZodCheckLessThan: no,
  $ZodCheckLowerCase: Wu,
  $ZodCheckMaxLength: Mu,
  $ZodCheckMaxSize: Fu,
  $ZodCheckMimeType: Qu,
  $ZodCheckMinLength: Bu,
  $ZodCheckMinSize: Lu,
  $ZodCheckMultipleOf: Zu,
  $ZodCheckNumberFormat: Ru,
  $ZodCheckOverwrite: el,
  $ZodCheckProperty: Yu,
  $ZodCheckRegex: Gu,
  $ZodCheckSizeEquals: Ju,
  $ZodCheckStartsWith: Xu,
  $ZodCheckStringFormat: Bt,
  $ZodCheckUpperCase: qu,
  $ZodCodec: lo,
  $ZodCustom: gd,
  $ZodCustomStringFormat: Ul,
  $ZodDate: Cl,
  $ZodDefault: rd,
  $ZodDiscriminatedUnion: Gl,
  $ZodE164: zl,
  $ZodEmail: ol,
  $ZodEmoji: cl,
  $ZodEncodeError: ar,
  $ZodEnum: Hl,
  $ZodError: Mi,
  $ZodExactOptional: td,
  $ZodFile: Ql,
  $ZodFunction: md,
  $ZodGUID: rl,
  $ZodIPv4: bl,
  $ZodIPv6: $l,
  $ZodISODate: gl,
  $ZodISODateTime: pl,
  $ZodISODuration: hl,
  $ZodISOTime: vl,
  $ZodIntersection: Wl,
  $ZodJWT: Ol,
  $ZodKSUID: fl,
  $ZodLazy: pd,
  $ZodLiteral: Yl,
  $ZodMAC: yl,
  $ZodMap: Kl,
  $ZodNaN: sd,
  $ZodNanoID: sl,
  $ZodNever: Zl,
  $ZodNonOptional: od,
  $ZodNull: Nl,
  $ZodNullable: nd,
  $ZodNumber: oo,
  $ZodNumberFormat: jl,
  $ZodObject: Ml,
  $ZodObjectJIT: Bl,
  $ZodOptional: uo,
  $ZodPipe: ud,
  $ZodPrefault: id,
  $ZodPromise: fd,
  $ZodReadonly: ld,
  $ZodRealError: se,
  $ZodRecord: ql,
  $ZodRegistry: $d,
  $ZodSet: Xl,
  $ZodString: Vt,
  $ZodStringFormat: C,
  $ZodSuccess: ad,
  $ZodSymbol: Tl,
  $ZodTemplateLiteral: dd,
  $ZodTransform: ed,
  $ZodTuple: so,
  $ZodType: O,
  $ZodULID: dl,
  $ZodURL: al,
  $ZodUUID: il,
  $ZodUndefined: El,
  $ZodUnion: pr,
  $ZodUnknown: Al,
  $ZodVoid: Rl,
  $ZodXID: ml,
  $ZodXor: Vl,
  $brand: Ci,
  $constructor: m,
  $input: po,
  $output: fo,
  Doc: tl,
  JSONSchema: Ob,
  JSONSchemaGenerator: Ib,
  NEVER: Ri,
  TimePrecision: Po,
  _any: Md,
  _array: Xd,
  _base64: Do,
  _base64url: To,
  _bigint: Ad,
  _boolean: Nd,
  _catch: yb,
  _check: tm,
  _cidrv4: Uo,
  _cidrv6: jo,
  _coercedBigint: Zd,
  _coercedBoolean: Pd,
  _coercedDate: qd,
  _coercedNumber: Od,
  _coercedString: _d,
  _cuid: ko,
  _cuid2: wo,
  _custom: Yd,
  _date: Wd,
  _decode: Wi,
  _decodeAsync: Ki,
  _default: hb,
  _discriminatedUnion: ob,
  _e164: Eo,
  _email: go,
  _emoji: yo,
  _encode: Gi,
  _encodeAsync: qi,
  _endsWith: Ht,
  _enum: db,
  _file: Hd,
  _float32: jd,
  _float64: Dd,
  _gt: xe,
  _gte: ee,
  _guid: Qn,
  _includes: Kt,
  _int: Ud,
  _int32: Td,
  _int64: Rd,
  _intersection: ab,
  _ipv4: Io,
  _ipv6: Oo,
  _isoDate: Sd,
  _isoDateTime: wd,
  _isoDuration: zd,
  _isoTime: xd,
  _jwt: No,
  _ksuid: zo,
  _lazy: Sb,
  _length: mt,
  _literal: fb,
  _lowercase: Wt,
  _lt: Se,
  _lte: ae,
  _mac: kd,
  _map: ub,
  _max: ae,
  _maxLength: dt,
  _maxSize: Be,
  _mime: Yt,
  _min: ee,
  _minLength: Ue,
  _minSize: ze,
  _multipleOf: Le,
  _nan: Kd,
  _nanoid: _o,
  _nativeEnum: mb,
  _negative: br,
  _never: Vd,
  _nonnegative: yr,
  _nonoptional: bb,
  _nonpositive: $r,
  _normalize: Qt,
  _null: Jd,
  _nullable: vb,
  _number: Id,
  _optional: gb,
  _overwrite: $e,
  _parse: Rt,
  _parseAsync: Ct,
  _pipe: _b,
  _positive: hr,
  _promise: xb,
  _property: _r,
  _readonly: kb,
  _record: sb,
  _refine: Qd,
  _regex: Gt,
  _safeDecode: Hi,
  _safeDecodeAsync: Qi,
  _safeEncode: Xi,
  _safeEncodeAsync: Yi,
  _safeParse: Ft,
  _safeParseAsync: Lt,
  _set: lb,
  _size: lt,
  _slugify: rn,
  _startsWith: Xt,
  _string: yd,
  _stringFormat: on,
  _stringbool: im,
  _success: $b,
  _superRefine: em,
  _symbol: Fd,
  _templateLiteral: wb,
  _toLowerCase: tn,
  _toUpperCase: nn,
  _transform: pb,
  _trim: en,
  _tuple: cb,
  _uint32: Ed,
  _uint64: Cd,
  _ulid: So,
  _undefined: Ld,
  _union: rb,
  _unknown: Bd,
  _uppercase: qt,
  _url: vr,
  _uuid: vo,
  _uuidv4: ho,
  _uuidv6: bo,
  _uuidv7: $o,
  _void: Gd,
  _xid: xo,
  _xor: ib,
  clone: ce,
  config: K,
  createStandardJSONSchemaMethod: jt,
  createToJSONSchemaMethod: om,
  decode: Lg,
  decodeAsync: Mg,
  describe: nm,
  encode: Fg,
  encodeAsync: Jg,
  extractDefs: Qe,
  finalize: et,
  flattenError: dr,
  formatError: mr,
  globalConfig: Kn,
  globalRegistry: oe,
  initializeContext: Ye,
  isValidBase64: io,
  isValidBase64URL: Sl,
  isValidJWT: Il,
  locales: mo,
  meta: rm,
  parse: Ui,
  parseAsync: ji,
  prettifyError: Vi,
  process: Z,
  regexes: fr,
  registry: gr,
  safeDecode: Vg,
  safeDecodeAsync: Wg,
  safeEncode: Bg,
  safeEncodeAsync: Gg,
  safeParse: eu,
  safeParseAsync: tu,
  toDotPath: Qs,
  toJSONSchema: Ro,
  treeifyError: Bi,
  util: Ji,
  version: nl
}, Symbol.toStringTag, { value: "Module" })), Ub = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  endsWith: Ht,
  gt: xe,
  gte: ee,
  includes: Kt,
  length: mt,
  lowercase: Wt,
  lt: Se,
  lte: ae,
  maxLength: dt,
  maxSize: Be,
  mime: Yt,
  minLength: Ue,
  minSize: ze,
  multipleOf: Le,
  negative: br,
  nonnegative: yr,
  nonpositive: $r,
  normalize: Qt,
  overwrite: $e,
  positive: hr,
  property: _r,
  regex: Gt,
  size: lt,
  slugify: rn,
  startsWith: Xt,
  toLowerCase: tn,
  toUpperCase: nn,
  trim: en,
  uppercase: qt
}, Symbol.toStringTag, { value: "Module" })), kr = /* @__PURE__ */ m("ZodISODateTime", (e, n) => {
  pl.init(e, n), R.init(e, n);
});
function Bm(e) {
  return /* @__PURE__ */ wd(kr, e);
}
const wr = /* @__PURE__ */ m("ZodISODate", (e, n) => {
  gl.init(e, n), R.init(e, n);
});
function Vm(e) {
  return /* @__PURE__ */ Sd(wr, e);
}
const Sr = /* @__PURE__ */ m("ZodISOTime", (e, n) => {
  vl.init(e, n), R.init(e, n);
});
function Gm(e) {
  return /* @__PURE__ */ xd(Sr, e);
}
const xr = /* @__PURE__ */ m("ZodISODuration", (e, n) => {
  hl.init(e, n), R.init(e, n);
});
function Wm(e) {
  return /* @__PURE__ */ zd(xr, e);
}
const Co = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ZodISODate: wr,
  ZodISODateTime: kr,
  ZodISODuration: xr,
  ZodISOTime: Sr,
  date: Vm,
  datetime: Bm,
  duration: Wm,
  time: Gm
}, Symbol.toStringTag, { value: "Module" })), qm = (e, n) => {
  Mi.init(e, n), e.name = "ZodError", Object.defineProperties(e, {
    format: {
      value: (r) => mr(e, r)
      // enumerable: false,
    },
    flatten: {
      value: (r) => dr(e, r)
      // enumerable: false,
    },
    addIssue: {
      value: (r) => {
        e.issues.push(r), e.message = JSON.stringify(e.issues, Xn, 2);
      }
      // enumerable: false,
    },
    addIssues: {
      value: (r) => {
        e.issues.push(...r), e.message = JSON.stringify(e.issues, Xn, 2);
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
}, Km = m("ZodError", qm), ie = m("ZodError", qm, {
  Parent: Error
}), Fo = /* @__PURE__ */ Rt(ie), Lo = /* @__PURE__ */ Ct(ie), Jo = /* @__PURE__ */ Ft(ie), Mo = /* @__PURE__ */ Lt(ie), Bo = /* @__PURE__ */ Gi(ie), Vo = /* @__PURE__ */ Wi(ie), Go = /* @__PURE__ */ qi(ie), Wo = /* @__PURE__ */ Ki(ie), qo = /* @__PURE__ */ Xi(ie), Ko = /* @__PURE__ */ Hi(ie), Xo = /* @__PURE__ */ Yi(ie), Ho = /* @__PURE__ */ Qi(ie), U = /* @__PURE__ */ m("ZodType", (e, n) => (O.init(e, n), Object.assign(e["~standard"], {
  jsonSchema: {
    input: jt(e, "input"),
    output: jt(e, "output")
  }
}), e.toJSONSchema = om(e, {}), e.def = n, e.type = n.type, Object.defineProperty(e, "_def", { value: n }), e.check = (...r) => e.clone(be(n, {
  checks: [
    ...n.checks ?? [],
    ...r.map((o) => typeof o == "function" ? { _zod: { check: o, def: { check: "custom" }, onattach: [] } } : o)
  ]
}), {
  parent: !0
}), e.with = e.check, e.clone = (r, o) => ce(e, r, o), e.brand = () => e, e.register = ((r, o) => (r.add(e, o), e)), e.parse = (r, o) => Fo(e, r, o, { callee: e.parse }), e.safeParse = (r, o) => Jo(e, r, o), e.parseAsync = async (r, o) => Lo(e, r, o, { callee: e.parseAsync }), e.safeParseAsync = async (r, o) => Mo(e, r, o), e.spa = e.safeParseAsync, e.encode = (r, o) => Bo(e, r, o), e.decode = (r, o) => Vo(e, r, o), e.encodeAsync = async (r, o) => Go(e, r, o), e.decodeAsync = async (r, o) => Wo(e, r, o), e.safeEncode = (r, o) => qo(e, r, o), e.safeDecode = (r, o) => Ko(e, r, o), e.safeEncodeAsync = async (r, o) => Xo(e, r, o), e.safeDecodeAsync = async (r, o) => Ho(e, r, o), e.refine = (r, o) => e.check(gi(r, o)), e.superRefine = (r) => e.check(vi(r)), e.overwrite = (r) => e.check(/* @__PURE__ */ $e(r)), e.optional = () => nt(e), e.exactOptional = () => Hr(e), e.nullable = () => rt(e), e.nullish = () => nt(rt(e)), e.nonoptional = (r) => ri(e, r), e.array = () => bt(e), e.or = (r) => zn([e, r]), e.and = (r) => Lr(e, r), e.transform = (r) => it(e, On(r)), e.default = (r) => ei(e, r), e.prefault = (r) => ni(e, r), e.catch = (r) => ai(e, r), e.pipe = (r) => it(e, r), e.readonly = () => ui(e), e.describe = (r) => {
  const o = e.clone();
  return oe.add(o, { description: r }), o;
}, Object.defineProperty(e, "description", {
  get() {
    return oe.get(e)?.description;
  },
  configurable: !0
}), e.meta = (...r) => {
  if (r.length === 0)
    return oe.get(e);
  const o = e.clone();
  return oe.add(o, r[0]), o;
}, e.isOptional = () => e.safeParse(void 0).success, e.isNullable = () => e.safeParse(null).success, e.apply = (r) => r(e), e)), an = /* @__PURE__ */ m("_ZodString", (e, n) => {
  Vt.init(e, n), U.init(e, n), e._zod.processJSONSchema = (o, t, i) => am(e, o, t);
  const r = e._zod.bag;
  e.format = r.format ?? null, e.minLength = r.minimum ?? null, e.maxLength = r.maximum ?? null, e.regex = (...o) => e.check(/* @__PURE__ */ Gt(...o)), e.includes = (...o) => e.check(/* @__PURE__ */ Kt(...o)), e.startsWith = (...o) => e.check(/* @__PURE__ */ Xt(...o)), e.endsWith = (...o) => e.check(/* @__PURE__ */ Ht(...o)), e.min = (...o) => e.check(/* @__PURE__ */ Ue(...o)), e.max = (...o) => e.check(/* @__PURE__ */ dt(...o)), e.length = (...o) => e.check(/* @__PURE__ */ mt(...o)), e.nonempty = (...o) => e.check(/* @__PURE__ */ Ue(1, ...o)), e.lowercase = (o) => e.check(/* @__PURE__ */ Wt(o)), e.uppercase = (o) => e.check(/* @__PURE__ */ qt(o)), e.trim = () => e.check(/* @__PURE__ */ en()), e.normalize = (...o) => e.check(/* @__PURE__ */ Qt(...o)), e.toLowerCase = () => e.check(/* @__PURE__ */ tn()), e.toUpperCase = () => e.check(/* @__PURE__ */ nn()), e.slugify = () => e.check(/* @__PURE__ */ rn());
}), ft = /* @__PURE__ */ m("ZodString", (e, n) => {
  Vt.init(e, n), an.init(e, n), e.email = (r) => e.check(/* @__PURE__ */ go(cn, r)), e.url = (r) => e.check(/* @__PURE__ */ vr(pt, r)), e.jwt = (r) => e.check(/* @__PURE__ */ No(kn, r)), e.emoji = (r) => e.check(/* @__PURE__ */ yo(sn, r)), e.guid = (r) => e.check(/* @__PURE__ */ Qn(tt, r)), e.uuid = (r) => e.check(/* @__PURE__ */ vo(fe, r)), e.uuidv4 = (r) => e.check(/* @__PURE__ */ ho(fe, r)), e.uuidv6 = (r) => e.check(/* @__PURE__ */ bo(fe, r)), e.uuidv7 = (r) => e.check(/* @__PURE__ */ $o(fe, r)), e.nanoid = (r) => e.check(/* @__PURE__ */ _o(un, r)), e.guid = (r) => e.check(/* @__PURE__ */ Qn(tt, r)), e.cuid = (r) => e.check(/* @__PURE__ */ ko(ln, r)), e.cuid2 = (r) => e.check(/* @__PURE__ */ wo(dn, r)), e.ulid = (r) => e.check(/* @__PURE__ */ So(mn, r)), e.base64 = (r) => e.check(/* @__PURE__ */ Do($n, r)), e.base64url = (r) => e.check(/* @__PURE__ */ To(yn, r)), e.xid = (r) => e.check(/* @__PURE__ */ xo(fn, r)), e.ksuid = (r) => e.check(/* @__PURE__ */ zo(pn, r)), e.ipv4 = (r) => e.check(/* @__PURE__ */ Io(gn, r)), e.ipv6 = (r) => e.check(/* @__PURE__ */ Oo(vn, r)), e.cidrv4 = (r) => e.check(/* @__PURE__ */ Uo(hn, r)), e.cidrv6 = (r) => e.check(/* @__PURE__ */ jo(bn, r)), e.e164 = (r) => e.check(/* @__PURE__ */ Eo(_n, r)), e.datetime = (r) => e.check(Bm(r)), e.date = (r) => e.check(Vm(r)), e.time = (r) => e.check(Gm(r)), e.duration = (r) => e.check(Wm(r));
});
function Dt(e) {
  return /* @__PURE__ */ yd(ft, e);
}
const R = /* @__PURE__ */ m("ZodStringFormat", (e, n) => {
  C.init(e, n), an.init(e, n);
}), cn = /* @__PURE__ */ m("ZodEmail", (e, n) => {
  ol.init(e, n), R.init(e, n);
});
function Yo(e) {
  return /* @__PURE__ */ go(cn, e);
}
const tt = /* @__PURE__ */ m("ZodGUID", (e, n) => {
  rl.init(e, n), R.init(e, n);
});
function Qo(e) {
  return /* @__PURE__ */ Qn(tt, e);
}
const fe = /* @__PURE__ */ m("ZodUUID", (e, n) => {
  il.init(e, n), R.init(e, n);
});
function ea(e) {
  return /* @__PURE__ */ vo(fe, e);
}
function ta(e) {
  return /* @__PURE__ */ ho(fe, e);
}
function na(e) {
  return /* @__PURE__ */ bo(fe, e);
}
function ra(e) {
  return /* @__PURE__ */ $o(fe, e);
}
const pt = /* @__PURE__ */ m("ZodURL", (e, n) => {
  al.init(e, n), R.init(e, n);
});
function ia(e) {
  return /* @__PURE__ */ vr(pt, e);
}
function oa(e) {
  return /* @__PURE__ */ vr(pt, {
    protocol: /^https?$/,
    hostname: yu,
    ...v(e)
  });
}
const sn = /* @__PURE__ */ m("ZodEmoji", (e, n) => {
  cl.init(e, n), R.init(e, n);
});
function aa(e) {
  return /* @__PURE__ */ yo(sn, e);
}
const un = /* @__PURE__ */ m("ZodNanoID", (e, n) => {
  sl.init(e, n), R.init(e, n);
});
function ca(e) {
  return /* @__PURE__ */ _o(un, e);
}
const ln = /* @__PURE__ */ m("ZodCUID", (e, n) => {
  ul.init(e, n), R.init(e, n);
});
function sa(e) {
  return /* @__PURE__ */ ko(ln, e);
}
const dn = /* @__PURE__ */ m("ZodCUID2", (e, n) => {
  ll.init(e, n), R.init(e, n);
});
function ua(e) {
  return /* @__PURE__ */ wo(dn, e);
}
const mn = /* @__PURE__ */ m("ZodULID", (e, n) => {
  dl.init(e, n), R.init(e, n);
});
function la(e) {
  return /* @__PURE__ */ So(mn, e);
}
const fn = /* @__PURE__ */ m("ZodXID", (e, n) => {
  ml.init(e, n), R.init(e, n);
});
function da(e) {
  return /* @__PURE__ */ xo(fn, e);
}
const pn = /* @__PURE__ */ m("ZodKSUID", (e, n) => {
  fl.init(e, n), R.init(e, n);
});
function ma(e) {
  return /* @__PURE__ */ zo(pn, e);
}
const gn = /* @__PURE__ */ m("ZodIPv4", (e, n) => {
  bl.init(e, n), R.init(e, n);
});
function fa(e) {
  return /* @__PURE__ */ Io(gn, e);
}
const zr = /* @__PURE__ */ m("ZodMAC", (e, n) => {
  yl.init(e, n), R.init(e, n);
});
function pa(e) {
  return /* @__PURE__ */ kd(zr, e);
}
const vn = /* @__PURE__ */ m("ZodIPv6", (e, n) => {
  $l.init(e, n), R.init(e, n);
});
function ga(e) {
  return /* @__PURE__ */ Oo(vn, e);
}
const hn = /* @__PURE__ */ m("ZodCIDRv4", (e, n) => {
  _l.init(e, n), R.init(e, n);
});
function va(e) {
  return /* @__PURE__ */ Uo(hn, e);
}
const bn = /* @__PURE__ */ m("ZodCIDRv6", (e, n) => {
  kl.init(e, n), R.init(e, n);
});
function ha(e) {
  return /* @__PURE__ */ jo(bn, e);
}
const $n = /* @__PURE__ */ m("ZodBase64", (e, n) => {
  wl.init(e, n), R.init(e, n);
});
function ba(e) {
  return /* @__PURE__ */ Do($n, e);
}
const yn = /* @__PURE__ */ m("ZodBase64URL", (e, n) => {
  xl.init(e, n), R.init(e, n);
});
function $a(e) {
  return /* @__PURE__ */ To(yn, e);
}
const _n = /* @__PURE__ */ m("ZodE164", (e, n) => {
  zl.init(e, n), R.init(e, n);
});
function ya(e) {
  return /* @__PURE__ */ Eo(_n, e);
}
const kn = /* @__PURE__ */ m("ZodJWT", (e, n) => {
  Ol.init(e, n), R.init(e, n);
});
function _a(e) {
  return /* @__PURE__ */ No(kn, e);
}
const Ve = /* @__PURE__ */ m("ZodCustomStringFormat", (e, n) => {
  Ul.init(e, n), R.init(e, n);
});
function ka(e, n, r = {}) {
  return /* @__PURE__ */ on(Ve, e, n, r);
}
function wa(e) {
  return /* @__PURE__ */ on(Ve, "hostname", $u, e);
}
function Sa(e) {
  return /* @__PURE__ */ on(Ve, "hex", Pu, e);
}
function xa(e, n) {
  const r = n?.enc ?? "hex", o = `${e}_${r}`, t = fr[o];
  if (!t)
    throw new Error(`Unrecognized hash format: ${o}`);
  return /* @__PURE__ */ on(Ve, o, t, n);
}
const gt = /* @__PURE__ */ m("ZodNumber", (e, n) => {
  oo.init(e, n), U.init(e, n), e._zod.processJSONSchema = (o, t, i) => cm(e, o, t), e.gt = (o, t) => e.check(/* @__PURE__ */ xe(o, t)), e.gte = (o, t) => e.check(/* @__PURE__ */ ee(o, t)), e.min = (o, t) => e.check(/* @__PURE__ */ ee(o, t)), e.lt = (o, t) => e.check(/* @__PURE__ */ Se(o, t)), e.lte = (o, t) => e.check(/* @__PURE__ */ ae(o, t)), e.max = (o, t) => e.check(/* @__PURE__ */ ae(o, t)), e.int = (o) => e.check(Tt(o)), e.safe = (o) => e.check(Tt(o)), e.positive = (o) => e.check(/* @__PURE__ */ xe(0, o)), e.nonnegative = (o) => e.check(/* @__PURE__ */ ee(0, o)), e.negative = (o) => e.check(/* @__PURE__ */ Se(0, o)), e.nonpositive = (o) => e.check(/* @__PURE__ */ ae(0, o)), e.multipleOf = (o, t) => e.check(/* @__PURE__ */ Le(o, t)), e.step = (o, t) => e.check(/* @__PURE__ */ Le(o, t)), e.finite = () => e;
  const r = e._zod.bag;
  e.minValue = Math.max(r.minimum ?? Number.NEGATIVE_INFINITY, r.exclusiveMinimum ?? Number.NEGATIVE_INFINITY) ?? null, e.maxValue = Math.min(r.maximum ?? Number.POSITIVE_INFINITY, r.exclusiveMaximum ?? Number.POSITIVE_INFINITY) ?? null, e.isInt = (r.format ?? "").includes("int") || Number.isSafeInteger(r.multipleOf ?? 0.5), e.isFinite = !0, e.format = r.format ?? null;
});
function Ir(e) {
  return /* @__PURE__ */ Id(gt, e);
}
const Te = /* @__PURE__ */ m("ZodNumberFormat", (e, n) => {
  jl.init(e, n), gt.init(e, n);
});
function Tt(e) {
  return /* @__PURE__ */ Ud(Te, e);
}
function za(e) {
  return /* @__PURE__ */ jd(Te, e);
}
function Ia(e) {
  return /* @__PURE__ */ Dd(Te, e);
}
function Oa(e) {
  return /* @__PURE__ */ Td(Te, e);
}
function Ua(e) {
  return /* @__PURE__ */ Ed(Te, e);
}
const vt = /* @__PURE__ */ m("ZodBoolean", (e, n) => {
  ao.init(e, n), U.init(e, n), e._zod.processJSONSchema = (r, o, t) => sm(e, r, o);
});
function Or(e) {
  return /* @__PURE__ */ Nd(vt, e);
}
const ht = /* @__PURE__ */ m("ZodBigInt", (e, n) => {
  co.init(e, n), U.init(e, n), e._zod.processJSONSchema = (o, t, i) => um(e, o), e.gte = (o, t) => e.check(/* @__PURE__ */ ee(o, t)), e.min = (o, t) => e.check(/* @__PURE__ */ ee(o, t)), e.gt = (o, t) => e.check(/* @__PURE__ */ xe(o, t)), e.gte = (o, t) => e.check(/* @__PURE__ */ ee(o, t)), e.min = (o, t) => e.check(/* @__PURE__ */ ee(o, t)), e.lt = (o, t) => e.check(/* @__PURE__ */ Se(o, t)), e.lte = (o, t) => e.check(/* @__PURE__ */ ae(o, t)), e.max = (o, t) => e.check(/* @__PURE__ */ ae(o, t)), e.positive = (o) => e.check(/* @__PURE__ */ xe(BigInt(0), o)), e.negative = (o) => e.check(/* @__PURE__ */ Se(BigInt(0), o)), e.nonpositive = (o) => e.check(/* @__PURE__ */ ae(BigInt(0), o)), e.nonnegative = (o) => e.check(/* @__PURE__ */ ee(BigInt(0), o)), e.multipleOf = (o, t) => e.check(/* @__PURE__ */ Le(o, t));
  const r = e._zod.bag;
  e.minValue = r.minimum ?? null, e.maxValue = r.maximum ?? null, e.format = r.format ?? null;
});
function ja(e) {
  return /* @__PURE__ */ Ad(ht, e);
}
const wn = /* @__PURE__ */ m("ZodBigIntFormat", (e, n) => {
  Dl.init(e, n), ht.init(e, n);
});
function Da(e) {
  return /* @__PURE__ */ Rd(wn, e);
}
function Ta(e) {
  return /* @__PURE__ */ Cd(wn, e);
}
const Ur = /* @__PURE__ */ m("ZodSymbol", (e, n) => {
  Tl.init(e, n), U.init(e, n), e._zod.processJSONSchema = (r, o, t) => lm(e, r);
});
function Ea(e) {
  return /* @__PURE__ */ Fd(Ur, e);
}
const jr = /* @__PURE__ */ m("ZodUndefined", (e, n) => {
  El.init(e, n), U.init(e, n), e._zod.processJSONSchema = (r, o, t) => mm(e, r);
});
function Na(e) {
  return /* @__PURE__ */ Ld(jr, e);
}
const Dr = /* @__PURE__ */ m("ZodNull", (e, n) => {
  Nl.init(e, n), U.init(e, n), e._zod.processJSONSchema = (r, o, t) => dm(e, r, o);
});
function Tr(e) {
  return /* @__PURE__ */ Jd(Dr, e);
}
const Er = /* @__PURE__ */ m("ZodAny", (e, n) => {
  Pl.init(e, n), U.init(e, n), e._zod.processJSONSchema = (r, o, t) => gm();
});
function Pa() {
  return /* @__PURE__ */ Md(Er);
}
const Nr = /* @__PURE__ */ m("ZodUnknown", (e, n) => {
  Al.init(e, n), U.init(e, n), e._zod.processJSONSchema = (r, o, t) => vm();
});
function je() {
  return /* @__PURE__ */ Bd(Nr);
}
const Pr = /* @__PURE__ */ m("ZodNever", (e, n) => {
  Zl.init(e, n), U.init(e, n), e._zod.processJSONSchema = (r, o, t) => pm(e, r, o);
});
function Sn(e) {
  return /* @__PURE__ */ Vd(Pr, e);
}
const Ar = /* @__PURE__ */ m("ZodVoid", (e, n) => {
  Rl.init(e, n), U.init(e, n), e._zod.processJSONSchema = (r, o, t) => fm(e, r);
});
function Aa(e) {
  return /* @__PURE__ */ Gd(Ar, e);
}
const xn = /* @__PURE__ */ m("ZodDate", (e, n) => {
  Cl.init(e, n), U.init(e, n), e._zod.processJSONSchema = (o, t, i) => hm(e, o), e.min = (o, t) => e.check(/* @__PURE__ */ ee(o, t)), e.max = (o, t) => e.check(/* @__PURE__ */ ae(o, t));
  const r = e._zod.bag;
  e.minDate = r.minimum ? new Date(r.minimum) : null, e.maxDate = r.maximum ? new Date(r.maximum) : null;
});
function Za(e) {
  return /* @__PURE__ */ Wd(xn, e);
}
const Zr = /* @__PURE__ */ m("ZodArray", (e, n) => {
  Fl.init(e, n), U.init(e, n), e._zod.processJSONSchema = (r, o, t) => Um(e, r, o, t), e.element = n.element, e.min = (r, o) => e.check(/* @__PURE__ */ Ue(r, o)), e.nonempty = (r) => e.check(/* @__PURE__ */ Ue(1, r)), e.max = (r, o) => e.check(/* @__PURE__ */ dt(r, o)), e.length = (r, o) => e.check(/* @__PURE__ */ mt(r, o)), e.unwrap = () => e.element;
});
function bt(e, n) {
  return /* @__PURE__ */ Xd(Zr, e, n);
}
function Ra(e) {
  const n = e._zod.def.shape;
  return In(Object.keys(n));
}
const $t = /* @__PURE__ */ m("ZodObject", (e, n) => {
  Bl.init(e, n), U.init(e, n), e._zod.processJSONSchema = (r, o, t) => jm(e, r, o, t), D(e, "shape", () => n.shape), e.keyof = () => In(Object.keys(e._zod.def.shape)), e.catchall = (r) => e.clone({ ...e._zod.def, catchall: r }), e.passthrough = () => e.clone({ ...e._zod.def, catchall: je() }), e.loose = () => e.clone({ ...e._zod.def, catchall: je() }), e.strict = () => e.clone({ ...e._zod.def, catchall: Sn() }), e.strip = () => e.clone({ ...e._zod.def, catchall: void 0 }), e.extend = (r) => Vs(e, r), e.safeExtend = (r) => Gs(e, r), e.merge = (r) => Ws(e, r), e.pick = (r) => Ms(e, r), e.omit = (r) => Bs(e, r), e.partial = (...r) => qs(Un, e, r[0]), e.required = (...r) => Ks(jn, e, r[0]);
});
function Ca(e, n) {
  const r = {
    type: "object",
    shape: e ?? {},
    ...v(n)
  };
  return new $t(r);
}
function Fa(e, n) {
  return new $t({
    type: "object",
    shape: e,
    catchall: Sn(),
    ...v(n)
  });
}
function La(e, n) {
  return new $t({
    type: "object",
    shape: e,
    catchall: je(),
    ...v(n)
  });
}
const yt = /* @__PURE__ */ m("ZodUnion", (e, n) => {
  pr.init(e, n), U.init(e, n), e._zod.processJSONSchema = (r, o, t) => Ao(e, r, o, t), e.options = n.options;
});
function zn(e, n) {
  return new yt({
    type: "union",
    options: e,
    ...v(n)
  });
}
const Rr = /* @__PURE__ */ m("ZodXor", (e, n) => {
  yt.init(e, n), Vl.init(e, n), e._zod.processJSONSchema = (r, o, t) => Ao(e, r, o, t), e.options = n.options;
});
function Ja(e, n) {
  return new Rr({
    type: "union",
    options: e,
    inclusive: !1,
    ...v(n)
  });
}
const Cr = /* @__PURE__ */ m("ZodDiscriminatedUnion", (e, n) => {
  yt.init(e, n), Gl.init(e, n);
});
function Ma(e, n, r) {
  return new Cr({
    type: "union",
    options: n,
    discriminator: e,
    ...v(r)
  });
}
const Fr = /* @__PURE__ */ m("ZodIntersection", (e, n) => {
  Wl.init(e, n), U.init(e, n), e._zod.processJSONSchema = (r, o, t) => Dm(e, r, o, t);
});
function Lr(e, n) {
  return new Fr({
    type: "intersection",
    left: e,
    right: n
  });
}
const Jr = /* @__PURE__ */ m("ZodTuple", (e, n) => {
  so.init(e, n), U.init(e, n), e._zod.processJSONSchema = (r, o, t) => Tm(e, r, o, t), e.rest = (r) => e.clone({
    ...e._zod.def,
    rest: r
  });
});
function Mr(e, n, r) {
  const o = n instanceof O, t = o ? r : n, i = o ? n : null;
  return new Jr({
    type: "tuple",
    items: e,
    rest: i,
    ...v(t)
  });
}
const _t = /* @__PURE__ */ m("ZodRecord", (e, n) => {
  ql.init(e, n), U.init(e, n), e._zod.processJSONSchema = (r, o, t) => Em(e, r, o, t), e.keyType = n.keyType, e.valueType = n.valueType;
});
function Br(e, n, r) {
  return new _t({
    type: "record",
    keyType: e,
    valueType: n,
    ...v(r)
  });
}
function Ba(e, n, r) {
  const o = ce(e);
  return o._zod.values = void 0, new _t({
    type: "record",
    keyType: o,
    valueType: n,
    ...v(r)
  });
}
function Va(e, n, r) {
  return new _t({
    type: "record",
    keyType: e,
    valueType: n,
    mode: "loose",
    ...v(r)
  });
}
const Vr = /* @__PURE__ */ m("ZodMap", (e, n) => {
  Kl.init(e, n), U.init(e, n), e._zod.processJSONSchema = (r, o, t) => Im(e, r), e.keyType = n.keyType, e.valueType = n.valueType, e.min = (...r) => e.check(/* @__PURE__ */ ze(...r)), e.nonempty = (r) => e.check(/* @__PURE__ */ ze(1, r)), e.max = (...r) => e.check(/* @__PURE__ */ Be(...r)), e.size = (...r) => e.check(/* @__PURE__ */ lt(...r));
});
function Ga(e, n, r) {
  return new Vr({
    type: "map",
    keyType: e,
    valueType: n,
    ...v(r)
  });
}
const Gr = /* @__PURE__ */ m("ZodSet", (e, n) => {
  Xl.init(e, n), U.init(e, n), e._zod.processJSONSchema = (r, o, t) => Om(e, r), e.min = (...r) => e.check(/* @__PURE__ */ ze(...r)), e.nonempty = (r) => e.check(/* @__PURE__ */ ze(1, r)), e.max = (...r) => e.check(/* @__PURE__ */ Be(...r)), e.size = (...r) => e.check(/* @__PURE__ */ lt(...r));
});
function Wa(e, n) {
  return new Gr({
    type: "set",
    valueType: e,
    ...v(n)
  });
}
const Je = /* @__PURE__ */ m("ZodEnum", (e, n) => {
  Hl.init(e, n), U.init(e, n), e._zod.processJSONSchema = (o, t, i) => bm(e, o, t), e.enum = n.entries, e.options = Object.values(n.entries);
  const r = new Set(Object.keys(n.entries));
  e.extract = (o, t) => {
    const i = {};
    for (const a of o)
      if (r.has(a))
        i[a] = n.entries[a];
      else
        throw new Error(`Key ${a} not found in enum`);
    return new Je({
      ...n,
      checks: [],
      ...v(t),
      entries: i
    });
  }, e.exclude = (o, t) => {
    const i = { ...n.entries };
    for (const a of o)
      if (r.has(a))
        delete i[a];
      else
        throw new Error(`Key ${a} not found in enum`);
    return new Je({
      ...n,
      checks: [],
      ...v(t),
      entries: i
    });
  };
});
function In(e, n) {
  const r = Array.isArray(e) ? Object.fromEntries(e.map((o) => [o, o])) : e;
  return new Je({
    type: "enum",
    entries: r,
    ...v(n)
  });
}
function qa(e, n) {
  return new Je({
    type: "enum",
    entries: e,
    ...v(n)
  });
}
const Wr = /* @__PURE__ */ m("ZodLiteral", (e, n) => {
  Yl.init(e, n), U.init(e, n), e._zod.processJSONSchema = (r, o, t) => $m(e, r, o), e.values = new Set(n.values), Object.defineProperty(e, "value", {
    get() {
      if (n.values.length > 1)
        throw new Error("This schema contains multiple valid literal values. Use `.values` instead.");
      return n.values[0];
    }
  });
});
function Ka(e, n) {
  return new Wr({
    type: "literal",
    values: Array.isArray(e) ? e : [e],
    ...v(n)
  });
}
const qr = /* @__PURE__ */ m("ZodFile", (e, n) => {
  Ql.init(e, n), U.init(e, n), e._zod.processJSONSchema = (r, o, t) => km(e, r, o), e.min = (r, o) => e.check(/* @__PURE__ */ ze(r, o)), e.max = (r, o) => e.check(/* @__PURE__ */ Be(r, o)), e.mime = (r, o) => e.check(/* @__PURE__ */ Yt(Array.isArray(r) ? r : [r], o));
});
function Xa(e) {
  return /* @__PURE__ */ Hd(qr, e);
}
const Kr = /* @__PURE__ */ m("ZodTransform", (e, n) => {
  ed.init(e, n), U.init(e, n), e._zod.processJSONSchema = (r, o, t) => zm(e, r), e._zod.parse = (r, o) => {
    if (o.direction === "backward")
      throw new ar(e.constructor.name);
    r.addIssue = (i) => {
      if (typeof i == "string")
        r.issues.push(Xe(i, r.value, n));
      else {
        const a = i;
        a.fatal && (a.continue = !1), a.code ?? (a.code = "custom"), a.input ?? (a.input = r.value), a.inst ?? (a.inst = e), r.issues.push(Xe(a));
      }
    };
    const t = n.transform(r.value, r);
    return t instanceof Promise ? t.then((i) => (r.value = i, r)) : (r.value = t, r);
  };
});
function On(e) {
  return new Kr({
    type: "transform",
    transform: e
  });
}
const Un = /* @__PURE__ */ m("ZodOptional", (e, n) => {
  uo.init(e, n), U.init(e, n), e._zod.processJSONSchema = (r, o, t) => Zo(e, r, o, t), e.unwrap = () => e._zod.def.innerType;
});
function nt(e) {
  return new Un({
    type: "optional",
    innerType: e
  });
}
const Xr = /* @__PURE__ */ m("ZodExactOptional", (e, n) => {
  td.init(e, n), U.init(e, n), e._zod.processJSONSchema = (r, o, t) => Zo(e, r, o, t), e.unwrap = () => e._zod.def.innerType;
});
function Hr(e) {
  return new Xr({
    type: "optional",
    innerType: e
  });
}
const Yr = /* @__PURE__ */ m("ZodNullable", (e, n) => {
  nd.init(e, n), U.init(e, n), e._zod.processJSONSchema = (r, o, t) => Nm(e, r, o, t), e.unwrap = () => e._zod.def.innerType;
});
function rt(e) {
  return new Yr({
    type: "nullable",
    innerType: e
  });
}
function Ha(e) {
  return nt(rt(e));
}
const Qr = /* @__PURE__ */ m("ZodDefault", (e, n) => {
  rd.init(e, n), U.init(e, n), e._zod.processJSONSchema = (r, o, t) => Am(e, r, o, t), e.unwrap = () => e._zod.def.innerType, e.removeDefault = e.unwrap;
});
function ei(e, n) {
  return new Qr({
    type: "default",
    innerType: e,
    get defaultValue() {
      return typeof n == "function" ? n() : sr(n);
    }
  });
}
const ti = /* @__PURE__ */ m("ZodPrefault", (e, n) => {
  id.init(e, n), U.init(e, n), e._zod.processJSONSchema = (r, o, t) => Zm(e, r, o, t), e.unwrap = () => e._zod.def.innerType;
});
function ni(e, n) {
  return new ti({
    type: "prefault",
    innerType: e,
    get defaultValue() {
      return typeof n == "function" ? n() : sr(n);
    }
  });
}
const jn = /* @__PURE__ */ m("ZodNonOptional", (e, n) => {
  od.init(e, n), U.init(e, n), e._zod.processJSONSchema = (r, o, t) => Pm(e, r, o, t), e.unwrap = () => e._zod.def.innerType;
});
function ri(e, n) {
  return new jn({
    type: "nonoptional",
    innerType: e,
    ...v(n)
  });
}
const ii = /* @__PURE__ */ m("ZodSuccess", (e, n) => {
  ad.init(e, n), U.init(e, n), e._zod.processJSONSchema = (r, o, t) => wm(e, r, o), e.unwrap = () => e._zod.def.innerType;
});
function Ya(e) {
  return new ii({
    type: "success",
    innerType: e
  });
}
const oi = /* @__PURE__ */ m("ZodCatch", (e, n) => {
  cd.init(e, n), U.init(e, n), e._zod.processJSONSchema = (r, o, t) => Rm(e, r, o, t), e.unwrap = () => e._zod.def.innerType, e.removeCatch = e.unwrap;
});
function ai(e, n) {
  return new oi({
    type: "catch",
    innerType: e,
    catchValue: typeof n == "function" ? n : () => n
  });
}
const ci = /* @__PURE__ */ m("ZodNaN", (e, n) => {
  sd.init(e, n), U.init(e, n), e._zod.processJSONSchema = (r, o, t) => ym(e, r);
});
function Qa(e) {
  return /* @__PURE__ */ Kd(ci, e);
}
const Dn = /* @__PURE__ */ m("ZodPipe", (e, n) => {
  ud.init(e, n), U.init(e, n), e._zod.processJSONSchema = (r, o, t) => Cm(e, r, o, t), e.in = n.in, e.out = n.out;
});
function it(e, n) {
  return new Dn({
    type: "pipe",
    in: e,
    out: n
    // ...util.normalizeParams(params),
  });
}
const Tn = /* @__PURE__ */ m("ZodCodec", (e, n) => {
  Dn.init(e, n), lo.init(e, n);
});
function ec(e, n, r) {
  return new Tn({
    type: "pipe",
    in: e,
    out: n,
    transform: r.decode,
    reverseTransform: r.encode
  });
}
const si = /* @__PURE__ */ m("ZodReadonly", (e, n) => {
  ld.init(e, n), U.init(e, n), e._zod.processJSONSchema = (r, o, t) => Fm(e, r, o, t), e.unwrap = () => e._zod.def.innerType;
});
function ui(e) {
  return new si({
    type: "readonly",
    innerType: e
  });
}
const li = /* @__PURE__ */ m("ZodTemplateLiteral", (e, n) => {
  dd.init(e, n), U.init(e, n), e._zod.processJSONSchema = (r, o, t) => _m(e, r, o);
});
function tc(e, n) {
  return new li({
    type: "template_literal",
    parts: e,
    ...v(n)
  });
}
const di = /* @__PURE__ */ m("ZodLazy", (e, n) => {
  pd.init(e, n), U.init(e, n), e._zod.processJSONSchema = (r, o, t) => Jm(e, r, o, t), e.unwrap = () => e._zod.def.getter();
});
function mi(e) {
  return new di({
    type: "lazy",
    getter: e
  });
}
const fi = /* @__PURE__ */ m("ZodPromise", (e, n) => {
  fd.init(e, n), U.init(e, n), e._zod.processJSONSchema = (r, o, t) => Lm(e, r, o, t), e.unwrap = () => e._zod.def.innerType;
});
function nc(e) {
  return new fi({
    type: "promise",
    innerType: e
  });
}
const pi = /* @__PURE__ */ m("ZodFunction", (e, n) => {
  md.init(e, n), U.init(e, n), e._zod.processJSONSchema = (r, o, t) => xm(e, r);
});
function ot(e) {
  return new pi({
    type: "function",
    input: Array.isArray(e?.input) ? Mr(e?.input) : e?.input ?? bt(je()),
    output: e?.output ?? je()
  });
}
const kt = /* @__PURE__ */ m("ZodCustom", (e, n) => {
  gd.init(e, n), U.init(e, n), e._zod.processJSONSchema = (r, o, t) => Sm(e, r);
});
function rc(e) {
  const n = new F({
    check: "custom"
    // ...util.normalizeParams(params),
  });
  return n._zod.check = e, n;
}
function ic(e, n) {
  return /* @__PURE__ */ Yd(kt, e ?? (() => !0), n);
}
function gi(e, n = {}) {
  return /* @__PURE__ */ Qd(kt, e, n);
}
function vi(e) {
  return /* @__PURE__ */ em(e);
}
const oc = nm, ac = rm;
function cc(e, n = {}) {
  const r = new kt({
    type: "custom",
    check: "custom",
    fn: (o) => o instanceof e,
    abort: !0,
    ...v(n)
  });
  return r._zod.bag.Class = e, r._zod.check = (o) => {
    o.value instanceof e || o.issues.push({
      code: "invalid_type",
      expected: e.name,
      input: o.value,
      inst: r,
      path: [...r._zod.def.path ?? []]
    });
  }, r;
}
const sc = (...e) => /* @__PURE__ */ im({
  Codec: Tn,
  Boolean: vt,
  String: ft
}, ...e);
function uc(e) {
  const n = mi(() => zn([Dt(e), Ir(), Or(), Tr(), bt(n), Br(Dt(), n)]));
  return n;
}
function lc(e, n) {
  return it(On(e), n);
}
const jb = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ZodAny: Er,
  ZodArray: Zr,
  ZodBase64: $n,
  ZodBase64URL: yn,
  ZodBigInt: ht,
  ZodBigIntFormat: wn,
  ZodBoolean: vt,
  ZodCIDRv4: hn,
  ZodCIDRv6: bn,
  ZodCUID: ln,
  ZodCUID2: dn,
  ZodCatch: oi,
  ZodCodec: Tn,
  ZodCustom: kt,
  ZodCustomStringFormat: Ve,
  ZodDate: xn,
  ZodDefault: Qr,
  ZodDiscriminatedUnion: Cr,
  ZodE164: _n,
  ZodEmail: cn,
  ZodEmoji: sn,
  ZodEnum: Je,
  ZodExactOptional: Xr,
  ZodFile: qr,
  ZodFunction: pi,
  ZodGUID: tt,
  ZodIPv4: gn,
  ZodIPv6: vn,
  ZodIntersection: Fr,
  ZodJWT: kn,
  ZodKSUID: pn,
  ZodLazy: di,
  ZodLiteral: Wr,
  ZodMAC: zr,
  ZodMap: Vr,
  ZodNaN: ci,
  ZodNanoID: un,
  ZodNever: Pr,
  ZodNonOptional: jn,
  ZodNull: Dr,
  ZodNullable: Yr,
  ZodNumber: gt,
  ZodNumberFormat: Te,
  ZodObject: $t,
  ZodOptional: Un,
  ZodPipe: Dn,
  ZodPrefault: ti,
  ZodPromise: fi,
  ZodReadonly: si,
  ZodRecord: _t,
  ZodSet: Gr,
  ZodString: ft,
  ZodStringFormat: R,
  ZodSuccess: ii,
  ZodSymbol: Ur,
  ZodTemplateLiteral: li,
  ZodTransform: Kr,
  ZodTuple: Jr,
  ZodType: U,
  ZodULID: mn,
  ZodURL: pt,
  ZodUUID: fe,
  ZodUndefined: jr,
  ZodUnion: yt,
  ZodUnknown: Nr,
  ZodVoid: Ar,
  ZodXID: fn,
  ZodXor: Rr,
  _ZodString: an,
  _default: ei,
  _function: ot,
  any: Pa,
  array: bt,
  base64: ba,
  base64url: $a,
  bigint: ja,
  boolean: Or,
  catch: ai,
  check: rc,
  cidrv4: va,
  cidrv6: ha,
  codec: ec,
  cuid: sa,
  cuid2: ua,
  custom: ic,
  date: Za,
  describe: oc,
  discriminatedUnion: Ma,
  e164: ya,
  email: Yo,
  emoji: aa,
  enum: In,
  exactOptional: Hr,
  file: Xa,
  float32: za,
  float64: Ia,
  function: ot,
  guid: Qo,
  hash: xa,
  hex: Sa,
  hostname: wa,
  httpUrl: oa,
  instanceof: cc,
  int: Tt,
  int32: Oa,
  int64: Da,
  intersection: Lr,
  ipv4: fa,
  ipv6: ga,
  json: uc,
  jwt: _a,
  keyof: Ra,
  ksuid: ma,
  lazy: mi,
  literal: Ka,
  looseObject: La,
  looseRecord: Va,
  mac: pa,
  map: Ga,
  meta: ac,
  nan: Qa,
  nanoid: ca,
  nativeEnum: qa,
  never: Sn,
  nonoptional: ri,
  null: Tr,
  nullable: rt,
  nullish: Ha,
  number: Ir,
  object: Ca,
  optional: nt,
  partialRecord: Ba,
  pipe: it,
  prefault: ni,
  preprocess: lc,
  promise: nc,
  readonly: ui,
  record: Br,
  refine: gi,
  set: Wa,
  strictObject: Fa,
  string: Dt,
  stringFormat: ka,
  stringbool: sc,
  success: Ya,
  superRefine: vi,
  symbol: Ea,
  templateLiteral: tc,
  transform: On,
  tuple: Mr,
  uint32: Ua,
  uint64: Ta,
  ulid: la,
  undefined: Na,
  union: zn,
  unknown: je,
  url: ia,
  uuid: ea,
  uuidv4: ta,
  uuidv6: na,
  uuidv7: ra,
  void: Aa,
  xid: da,
  xor: Ja
}, Symbol.toStringTag, { value: "Module" })), Xm = {
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
function Hm(e) {
  K({
    customError: e
  });
}
function Ym() {
  return K().customError;
}
var er;
er || (er = {});
const _ = {
  ...jb,
  ...Ub,
  iso: Co
}, Db = /* @__PURE__ */ new Set([
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
function Tb(e, n) {
  const r = e.$schema;
  return r === "https://json-schema.org/draft/2020-12/schema" ? "draft-2020-12" : r === "http://json-schema.org/draft-07/schema#" ? "draft-7" : r === "http://json-schema.org/draft-04/schema#" ? "draft-4" : n ?? "draft-2020-12";
}
function Eb(e, n) {
  if (!e.startsWith("#"))
    throw new Error("External $ref is not supported, only local refs (#/...) are allowed");
  const r = e.slice(1).split("/").filter(Boolean);
  if (r.length === 0)
    return n.rootSchema;
  const o = n.version === "draft-2020-12" ? "$defs" : "definitions";
  if (r[0] === o) {
    const t = r[1];
    if (!t || !n.defs[t])
      throw new Error(`Reference not found: ${e}`);
    return n.defs[t];
  }
  throw new Error(`Reference not found: ${e}`);
}
function Qm(e, n) {
  if (e.not !== void 0) {
    if (typeof e.not == "object" && Object.keys(e.not).length === 0)
      return _.never();
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
    const t = e.$ref;
    if (n.refs.has(t))
      return n.refs.get(t);
    if (n.processing.has(t))
      return _.lazy(() => {
        if (!n.refs.has(t))
          throw new Error(`Circular reference not resolved: ${t}`);
        return n.refs.get(t);
      });
    n.processing.add(t);
    const i = Eb(t, n), a = H(i, n);
    return n.refs.set(t, a), n.processing.delete(t), a;
  }
  if (e.enum !== void 0) {
    const t = e.enum;
    if (n.version === "openapi-3.0" && e.nullable === !0 && t.length === 1 && t[0] === null)
      return _.null();
    if (t.length === 0)
      return _.never();
    if (t.length === 1)
      return _.literal(t[0]);
    if (t.every((a) => typeof a == "string"))
      return _.enum(t);
    const i = t.map((a) => _.literal(a));
    return i.length < 2 ? i[0] : _.union([i[0], i[1], ...i.slice(2)]);
  }
  if (e.const !== void 0)
    return _.literal(e.const);
  const r = e.type;
  if (Array.isArray(r)) {
    const t = r.map((i) => {
      const a = { ...e, type: i };
      return Qm(a, n);
    });
    return t.length === 0 ? _.never() : t.length === 1 ? t[0] : _.union(t);
  }
  if (!r)
    return _.any();
  let o;
  switch (r) {
    case "string": {
      let t = _.string();
      if (e.format) {
        const i = e.format;
        i === "email" ? t = t.check(_.email()) : i === "uri" || i === "uri-reference" ? t = t.check(_.url()) : i === "uuid" || i === "guid" ? t = t.check(_.uuid()) : i === "date-time" ? t = t.check(_.iso.datetime()) : i === "date" ? t = t.check(_.iso.date()) : i === "time" ? t = t.check(_.iso.time()) : i === "duration" ? t = t.check(_.iso.duration()) : i === "ipv4" ? t = t.check(_.ipv4()) : i === "ipv6" ? t = t.check(_.ipv6()) : i === "mac" ? t = t.check(_.mac()) : i === "cidr" ? t = t.check(_.cidrv4()) : i === "cidr-v6" ? t = t.check(_.cidrv6()) : i === "base64" ? t = t.check(_.base64()) : i === "base64url" ? t = t.check(_.base64url()) : i === "e164" ? t = t.check(_.e164()) : i === "jwt" ? t = t.check(_.jwt()) : i === "emoji" ? t = t.check(_.emoji()) : i === "nanoid" ? t = t.check(_.nanoid()) : i === "cuid" ? t = t.check(_.cuid()) : i === "cuid2" ? t = t.check(_.cuid2()) : i === "ulid" ? t = t.check(_.ulid()) : i === "xid" ? t = t.check(_.xid()) : i === "ksuid" && (t = t.check(_.ksuid()));
      }
      typeof e.minLength == "number" && (t = t.min(e.minLength)), typeof e.maxLength == "number" && (t = t.max(e.maxLength)), e.pattern && (t = t.regex(new RegExp(e.pattern))), o = t;
      break;
    }
    case "number":
    case "integer": {
      let t = r === "integer" ? _.number().int() : _.number();
      typeof e.minimum == "number" && (t = t.min(e.minimum)), typeof e.maximum == "number" && (t = t.max(e.maximum)), typeof e.exclusiveMinimum == "number" ? t = t.gt(e.exclusiveMinimum) : e.exclusiveMinimum === !0 && typeof e.minimum == "number" && (t = t.gt(e.minimum)), typeof e.exclusiveMaximum == "number" ? t = t.lt(e.exclusiveMaximum) : e.exclusiveMaximum === !0 && typeof e.maximum == "number" && (t = t.lt(e.maximum)), typeof e.multipleOf == "number" && (t = t.multipleOf(e.multipleOf)), o = t;
      break;
    }
    case "boolean": {
      o = _.boolean();
      break;
    }
    case "null": {
      o = _.null();
      break;
    }
    case "object": {
      const t = {}, i = e.properties || {}, a = new Set(e.required || []);
      for (const [u, s] of Object.entries(i)) {
        const l = H(s, n);
        t[u] = a.has(u) ? l : l.optional();
      }
      if (e.propertyNames) {
        const u = H(e.propertyNames, n), s = e.additionalProperties && typeof e.additionalProperties == "object" ? H(e.additionalProperties, n) : _.any();
        if (Object.keys(t).length === 0) {
          o = _.record(u, s);
          break;
        }
        const l = _.object(t).passthrough(), d = _.looseRecord(u, s);
        o = _.intersection(l, d);
        break;
      }
      if (e.patternProperties) {
        const u = e.patternProperties, s = Object.keys(u), l = [];
        for (const g of s) {
          const h = H(u[g], n), p = _.string().regex(new RegExp(g));
          l.push(_.looseRecord(p, h));
        }
        const d = [];
        if (Object.keys(t).length > 0 && d.push(_.object(t).passthrough()), d.push(...l), d.length === 0)
          o = _.object({}).passthrough();
        else if (d.length === 1)
          o = d[0];
        else {
          let g = _.intersection(d[0], d[1]);
          for (let h = 2; h < d.length; h++)
            g = _.intersection(g, d[h]);
          o = g;
        }
        break;
      }
      const c = _.object(t);
      e.additionalProperties === !1 ? o = c.strict() : typeof e.additionalProperties == "object" ? o = c.catchall(H(e.additionalProperties, n)) : o = c.passthrough();
      break;
    }
    case "array": {
      const t = e.prefixItems, i = e.items;
      if (t && Array.isArray(t)) {
        const a = t.map((u) => H(u, n)), c = i && typeof i == "object" && !Array.isArray(i) ? H(i, n) : void 0;
        c ? o = _.tuple(a).rest(c) : o = _.tuple(a), typeof e.minItems == "number" && (o = o.check(_.minLength(e.minItems))), typeof e.maxItems == "number" && (o = o.check(_.maxLength(e.maxItems)));
      } else if (Array.isArray(i)) {
        const a = i.map((u) => H(u, n)), c = e.additionalItems && typeof e.additionalItems == "object" ? H(e.additionalItems, n) : void 0;
        c ? o = _.tuple(a).rest(c) : o = _.tuple(a), typeof e.minItems == "number" && (o = o.check(_.minLength(e.minItems))), typeof e.maxItems == "number" && (o = o.check(_.maxLength(e.maxItems)));
      } else if (i !== void 0) {
        const a = H(i, n);
        let c = _.array(a);
        typeof e.minItems == "number" && (c = c.min(e.minItems)), typeof e.maxItems == "number" && (c = c.max(e.maxItems)), o = c;
      } else
        o = _.array(_.any());
      break;
    }
    default:
      throw new Error(`Unsupported type: ${r}`);
  }
  return e.description && (o = o.describe(e.description)), e.default !== void 0 && (o = o.default(e.default)), o;
}
function H(e, n) {
  if (typeof e == "boolean")
    return e ? _.any() : _.never();
  let r = Qm(e, n);
  const o = e.type || e.enum !== void 0 || e.const !== void 0;
  if (e.anyOf && Array.isArray(e.anyOf)) {
    const c = e.anyOf.map((s) => H(s, n)), u = _.union(c);
    r = o ? _.intersection(r, u) : u;
  }
  if (e.oneOf && Array.isArray(e.oneOf)) {
    const c = e.oneOf.map((s) => H(s, n)), u = _.xor(c);
    r = o ? _.intersection(r, u) : u;
  }
  if (e.allOf && Array.isArray(e.allOf))
    if (e.allOf.length === 0)
      r = o ? r : _.any();
    else {
      let c = o ? r : H(e.allOf[0], n);
      const u = o ? 0 : 1;
      for (let s = u; s < e.allOf.length; s++)
        c = _.intersection(c, H(e.allOf[s], n));
      r = c;
    }
  e.nullable === !0 && n.version === "openapi-3.0" && (r = _.nullable(r)), e.readOnly === !0 && (r = _.readonly(r));
  const t = {}, i = ["$id", "id", "$comment", "$anchor", "$vocabulary", "$dynamicRef", "$dynamicAnchor"];
  for (const c of i)
    c in e && (t[c] = e[c]);
  const a = ["contentEncoding", "contentMediaType", "contentSchema"];
  for (const c of a)
    c in e && (t[c] = e[c]);
  for (const c of Object.keys(e))
    Db.has(c) || (t[c] = e[c]);
  return Object.keys(t).length > 0 && n.registry.add(r, t), r;
}
function ef(e, n) {
  if (typeof e == "boolean")
    return e ? _.any() : _.never();
  const r = Tb(e, n?.defaultTarget), o = e.$defs || e.definitions || {}, t = {
    version: r,
    defs: o,
    refs: /* @__PURE__ */ new Map(),
    processing: /* @__PURE__ */ new Set(),
    rootSchema: e,
    registry: n?.registry ?? oe
  };
  return H(e, t);
}
function Nb(e) {
  return /* @__PURE__ */ _d(ft, e);
}
function Pb(e) {
  return /* @__PURE__ */ Od(gt, e);
}
function Ab(e) {
  return /* @__PURE__ */ Pd(vt, e);
}
function Zb(e) {
  return /* @__PURE__ */ Zd(ht, e);
}
function Rb(e) {
  return /* @__PURE__ */ qd(xn, e);
}
const tf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  bigint: Zb,
  boolean: Ab,
  date: Rb,
  number: Pb,
  string: Nb
}, Symbol.toStringTag, { value: "Module" }));
K(vd());
const Yc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  $brand: Ci,
  $input: po,
  $output: fo,
  NEVER: Ri,
  TimePrecision: Po,
  ZodAny: Er,
  ZodArray: Zr,
  ZodBase64: $n,
  ZodBase64URL: yn,
  ZodBigInt: ht,
  ZodBigIntFormat: wn,
  ZodBoolean: vt,
  ZodCIDRv4: hn,
  ZodCIDRv6: bn,
  ZodCUID: ln,
  ZodCUID2: dn,
  ZodCatch: oi,
  ZodCodec: Tn,
  ZodCustom: kt,
  ZodCustomStringFormat: Ve,
  ZodDate: xn,
  ZodDefault: Qr,
  ZodDiscriminatedUnion: Cr,
  ZodE164: _n,
  ZodEmail: cn,
  ZodEmoji: sn,
  ZodEnum: Je,
  ZodError: Km,
  ZodExactOptional: Xr,
  ZodFile: qr,
  get ZodFirstPartyTypeKind() {
    return er;
  },
  ZodFunction: pi,
  ZodGUID: tt,
  ZodIPv4: gn,
  ZodIPv6: vn,
  ZodISODate: wr,
  ZodISODateTime: kr,
  ZodISODuration: xr,
  ZodISOTime: Sr,
  ZodIntersection: Fr,
  ZodIssueCode: Xm,
  ZodJWT: kn,
  ZodKSUID: pn,
  ZodLazy: di,
  ZodLiteral: Wr,
  ZodMAC: zr,
  ZodMap: Vr,
  ZodNaN: ci,
  ZodNanoID: un,
  ZodNever: Pr,
  ZodNonOptional: jn,
  ZodNull: Dr,
  ZodNullable: Yr,
  ZodNumber: gt,
  ZodNumberFormat: Te,
  ZodObject: $t,
  ZodOptional: Un,
  ZodPipe: Dn,
  ZodPrefault: ti,
  ZodPromise: fi,
  ZodReadonly: si,
  ZodRealError: ie,
  ZodRecord: _t,
  ZodSet: Gr,
  ZodString: ft,
  ZodStringFormat: R,
  ZodSuccess: ii,
  ZodSymbol: Ur,
  ZodTemplateLiteral: li,
  ZodTransform: Kr,
  ZodTuple: Jr,
  ZodType: U,
  ZodULID: mn,
  ZodURL: pt,
  ZodUUID: fe,
  ZodUndefined: jr,
  ZodUnion: yt,
  ZodUnknown: Nr,
  ZodVoid: Ar,
  ZodXID: fn,
  ZodXor: Rr,
  _ZodString: an,
  _default: ei,
  _function: ot,
  any: Pa,
  array: bt,
  base64: ba,
  base64url: $a,
  bigint: ja,
  boolean: Or,
  catch: ai,
  check: rc,
  cidrv4: va,
  cidrv6: ha,
  clone: ce,
  codec: ec,
  coerce: tf,
  config: K,
  core: Mm,
  cuid: sa,
  cuid2: ua,
  custom: ic,
  date: Za,
  decode: Vo,
  decodeAsync: Wo,
  describe: oc,
  discriminatedUnion: Ma,
  e164: ya,
  email: Yo,
  emoji: aa,
  encode: Bo,
  encodeAsync: Go,
  endsWith: Ht,
  enum: In,
  exactOptional: Hr,
  file: Xa,
  flattenError: dr,
  float32: za,
  float64: Ia,
  formatError: mr,
  fromJSONSchema: ef,
  function: ot,
  getErrorMap: Ym,
  globalRegistry: oe,
  gt: xe,
  gte: ee,
  guid: Qo,
  hash: xa,
  hex: Sa,
  hostname: wa,
  httpUrl: oa,
  includes: Kt,
  instanceof: cc,
  int: Tt,
  int32: Oa,
  int64: Da,
  intersection: Lr,
  ipv4: fa,
  ipv6: ga,
  iso: Co,
  json: uc,
  jwt: _a,
  keyof: Ra,
  ksuid: ma,
  lazy: mi,
  length: mt,
  literal: Ka,
  locales: mo,
  looseObject: La,
  looseRecord: Va,
  lowercase: Wt,
  lt: Se,
  lte: ae,
  mac: pa,
  map: Ga,
  maxLength: dt,
  maxSize: Be,
  meta: ac,
  mime: Yt,
  minLength: Ue,
  minSize: ze,
  multipleOf: Le,
  nan: Qa,
  nanoid: ca,
  nativeEnum: qa,
  negative: br,
  never: Sn,
  nonnegative: yr,
  nonoptional: ri,
  nonpositive: $r,
  normalize: Qt,
  null: Tr,
  nullable: rt,
  nullish: Ha,
  number: Ir,
  object: Ca,
  optional: nt,
  overwrite: $e,
  parse: Fo,
  parseAsync: Lo,
  partialRecord: Ba,
  pipe: it,
  positive: hr,
  prefault: ni,
  preprocess: lc,
  prettifyError: Vi,
  promise: nc,
  property: _r,
  readonly: ui,
  record: Br,
  refine: gi,
  regex: Gt,
  regexes: fr,
  registry: gr,
  safeDecode: Ko,
  safeDecodeAsync: Ho,
  safeEncode: qo,
  safeEncodeAsync: Xo,
  safeParse: Jo,
  safeParseAsync: Mo,
  set: Wa,
  setErrorMap: Hm,
  size: lt,
  slugify: rn,
  startsWith: Xt,
  strictObject: Fa,
  string: Dt,
  stringFormat: ka,
  stringbool: sc,
  success: Ya,
  superRefine: vi,
  symbol: Ea,
  templateLiteral: tc,
  toJSONSchema: Ro,
  toLowerCase: tn,
  toUpperCase: nn,
  transform: On,
  treeifyError: Bi,
  trim: en,
  tuple: Mr,
  uint32: Ua,
  uint64: Ta,
  ulid: la,
  undefined: Na,
  union: zn,
  unknown: je,
  uppercase: qt,
  url: ia,
  util: Ji,
  uuid: ea,
  uuidv4: ta,
  uuidv6: na,
  uuidv7: ra,
  void: Aa,
  xid: da,
  xor: Ja
}, Symbol.toStringTag, { value: "Module" })), c$ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  $brand: Ci,
  $input: po,
  $output: fo,
  NEVER: Ri,
  TimePrecision: Po,
  ZodAny: Er,
  ZodArray: Zr,
  ZodBase64: $n,
  ZodBase64URL: yn,
  ZodBigInt: ht,
  ZodBigIntFormat: wn,
  ZodBoolean: vt,
  ZodCIDRv4: hn,
  ZodCIDRv6: bn,
  ZodCUID: ln,
  ZodCUID2: dn,
  ZodCatch: oi,
  ZodCodec: Tn,
  ZodCustom: kt,
  ZodCustomStringFormat: Ve,
  ZodDate: xn,
  ZodDefault: Qr,
  ZodDiscriminatedUnion: Cr,
  ZodE164: _n,
  ZodEmail: cn,
  ZodEmoji: sn,
  ZodEnum: Je,
  ZodError: Km,
  ZodExactOptional: Xr,
  ZodFile: qr,
  get ZodFirstPartyTypeKind() {
    return er;
  },
  ZodFunction: pi,
  ZodGUID: tt,
  ZodIPv4: gn,
  ZodIPv6: vn,
  ZodISODate: wr,
  ZodISODateTime: kr,
  ZodISODuration: xr,
  ZodISOTime: Sr,
  ZodIntersection: Fr,
  ZodIssueCode: Xm,
  ZodJWT: kn,
  ZodKSUID: pn,
  ZodLazy: di,
  ZodLiteral: Wr,
  ZodMAC: zr,
  ZodMap: Vr,
  ZodNaN: ci,
  ZodNanoID: un,
  ZodNever: Pr,
  ZodNonOptional: jn,
  ZodNull: Dr,
  ZodNullable: Yr,
  ZodNumber: gt,
  ZodNumberFormat: Te,
  ZodObject: $t,
  ZodOptional: Un,
  ZodPipe: Dn,
  ZodPrefault: ti,
  ZodPromise: fi,
  ZodReadonly: si,
  ZodRealError: ie,
  ZodRecord: _t,
  ZodSet: Gr,
  ZodString: ft,
  ZodStringFormat: R,
  ZodSuccess: ii,
  ZodSymbol: Ur,
  ZodTemplateLiteral: li,
  ZodTransform: Kr,
  ZodTuple: Jr,
  ZodType: U,
  ZodULID: mn,
  ZodURL: pt,
  ZodUUID: fe,
  ZodUndefined: jr,
  ZodUnion: yt,
  ZodUnknown: Nr,
  ZodVoid: Ar,
  ZodXID: fn,
  ZodXor: Rr,
  _ZodString: an,
  _default: ei,
  _function: ot,
  any: Pa,
  array: bt,
  base64: ba,
  base64url: $a,
  bigint: ja,
  boolean: Or,
  catch: ai,
  check: rc,
  cidrv4: va,
  cidrv6: ha,
  clone: ce,
  codec: ec,
  coerce: tf,
  config: K,
  core: Mm,
  cuid: sa,
  cuid2: ua,
  custom: ic,
  date: Za,
  decode: Vo,
  decodeAsync: Wo,
  default: Yc,
  describe: oc,
  discriminatedUnion: Ma,
  e164: ya,
  email: Yo,
  emoji: aa,
  encode: Bo,
  encodeAsync: Go,
  endsWith: Ht,
  enum: In,
  exactOptional: Hr,
  file: Xa,
  flattenError: dr,
  float32: za,
  float64: Ia,
  formatError: mr,
  fromJSONSchema: ef,
  function: ot,
  getErrorMap: Ym,
  globalRegistry: oe,
  gt: xe,
  gte: ee,
  guid: Qo,
  hash: xa,
  hex: Sa,
  hostname: wa,
  httpUrl: oa,
  includes: Kt,
  instanceof: cc,
  int: Tt,
  int32: Oa,
  int64: Da,
  intersection: Lr,
  ipv4: fa,
  ipv6: ga,
  iso: Co,
  json: uc,
  jwt: _a,
  keyof: Ra,
  ksuid: ma,
  lazy: mi,
  length: mt,
  literal: Ka,
  locales: mo,
  looseObject: La,
  looseRecord: Va,
  lowercase: Wt,
  lt: Se,
  lte: ae,
  mac: pa,
  map: Ga,
  maxLength: dt,
  maxSize: Be,
  meta: ac,
  mime: Yt,
  minLength: Ue,
  minSize: ze,
  multipleOf: Le,
  nan: Qa,
  nanoid: ca,
  nativeEnum: qa,
  negative: br,
  never: Sn,
  nonnegative: yr,
  nonoptional: ri,
  nonpositive: $r,
  normalize: Qt,
  null: Tr,
  nullable: rt,
  nullish: Ha,
  number: Ir,
  object: Ca,
  optional: nt,
  overwrite: $e,
  parse: Fo,
  parseAsync: Lo,
  partialRecord: Ba,
  pipe: it,
  positive: hr,
  prefault: ni,
  preprocess: lc,
  prettifyError: Vi,
  promise: nc,
  property: _r,
  readonly: ui,
  record: Br,
  refine: gi,
  regex: Gt,
  regexes: fr,
  registry: gr,
  safeDecode: Ko,
  safeDecodeAsync: Ho,
  safeEncode: qo,
  safeEncodeAsync: Xo,
  safeParse: Jo,
  safeParseAsync: Mo,
  set: Wa,
  setErrorMap: Hm,
  size: lt,
  slugify: rn,
  startsWith: Xt,
  strictObject: Fa,
  string: Dt,
  stringFormat: ka,
  stringbool: sc,
  success: Ya,
  superRefine: vi,
  symbol: Ea,
  templateLiteral: tc,
  toJSONSchema: Ro,
  toLowerCase: tn,
  toUpperCase: nn,
  transform: On,
  treeifyError: Bi,
  trim: en,
  tuple: Mr,
  uint32: Ua,
  uint64: Ta,
  ulid: la,
  undefined: Na,
  union: zn,
  unknown: je,
  uppercase: qt,
  url: ia,
  util: Ji,
  uuid: ea,
  uuidv4: ta,
  uuidv6: na,
  uuidv7: ra,
  void: Aa,
  xid: da,
  xor: Ja,
  z: Yc
}, Symbol.toStringTag, { value: "Module" })), s$ = L.create();
function u$(...e) {
  return yg(Tp(e));
}
export {
  Gb as AxiosError,
  Jb as BasePlugin,
  m$ as Controller,
  Lb as Icons,
  Cb as Query,
  Fb as Router,
  b$ as Trans,
  u$ as cn,
  s$ as http,
  f$ as useFieldArray,
  p$ as useForm,
  $$ as useTranslation,
  c$ as z,
  v$ as zodResolver
};
