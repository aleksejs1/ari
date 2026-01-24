import { jsxs as ye, jsx as z } from 'react/jsx-runtime'
import { lazy as je, Suspense as Oe } from 'react'
import { useTranslation as Ve } from 'react-i18next'
import { Gift as De } from 'lucide-react'
import { Link as Fe } from 'react-router-dom'
class $e {
  registerTranslations(o, r) {
    Object.keys(o).forEach((t) => {
      r.addResourceBundle(t, this.name, o[t], !0, !0)
    })
  }
}
function ve(e) {
  var o,
    r,
    t = ''
  if (typeof e == 'string' || typeof e == 'number') t += e
  else if (typeof e == 'object')
    if (Array.isArray(e)) {
      var a = e.length
      for (o = 0; o < a; o++) e[o] && (r = ve(e[o])) && (t && (t += ' '), (t += r))
    } else for (r in e) e[r] && (t && (t += ' '), (t += r))
  return t
}
function Be() {
  for (var e, o, r = 0, t = '', a = arguments.length; r < a; r++)
    (e = arguments[r]) && (o = ve(e)) && (t && (t += ' '), (t += o))
  return t
}
const _e = (e, o) => {
    const r = new Array(e.length + o.length)
    for (let t = 0; t < e.length; t++) r[t] = e[t]
    for (let t = 0; t < o.length; t++) r[e.length + t] = o[t]
    return r
  },
  We = (e, o) => ({
    classGroupId: e,
    validator: o,
  }),
  Ce = (e = /* @__PURE__ */ new Map(), o = null, r) => ({
    nextPart: e,
    validators: o,
    classGroupId: r,
  }),
  Q = '-',
  ge = [],
  Ue = 'arbitrary..',
  Ye = (e) => {
    const o = Xe(e),
      { conflictingClassGroups: r, conflictingClassGroupModifiers: t } = e
    return {
      getClassGroupId: (i) => {
        if (i.startsWith('[') && i.endsWith(']')) return qe(i)
        const u = i.split(Q),
          c = u[0] === '' && u.length > 1 ? 1 : 0
        return ze(u, c, o)
      },
      getConflictingClassGroupIds: (i, u) => {
        if (u) {
          const c = t[i],
            f = r[i]
          return c ? (f ? _e(f, c) : c) : f || ge
        }
        return r[i] || ge
      },
    }
  },
  ze = (e, o, r) => {
    if (e.length - o === 0) return r.classGroupId
    const a = e[o],
      d = r.nextPart.get(a)
    if (d) {
      const f = ze(e, o + 1, d)
      if (f) return f
    }
    const i = r.validators
    if (i === null) return
    const u = o === 0 ? e.join(Q) : e.slice(o).join(Q),
      c = i.length
    for (let f = 0; f < c; f++) {
      const h = i[f]
      if (h.validator(u)) return h.classGroupId
    }
  },
  qe = (e) =>
    e.slice(1, -1).indexOf(':') === -1
      ? void 0
      : (() => {
          const o = e.slice(1, -1),
            r = o.indexOf(':'),
            t = o.slice(0, r)
          return t ? Ue + t : void 0
        })(),
  Xe = (e) => {
    const { theme: o, classGroups: r } = e
    return Je(r, o)
  },
  Je = (e, o) => {
    const r = Ce()
    for (const t in e) {
      const a = e[t]
      ae(a, r, t, o)
    }
    return r
  },
  ae = (e, o, r, t) => {
    const a = e.length
    for (let d = 0; d < a; d++) {
      const i = e[d]
      He(i, o, r, t)
    }
  },
  He = (e, o, r, t) => {
    if (typeof e == 'string') {
      Ke(e, o, r)
      return
    }
    if (typeof e == 'function') {
      Qe(e, o, r, t)
      return
    }
    Ze(e, o, r, t)
  },
  Ke = (e, o, r) => {
    const t = e === '' ? o : Ae(o, e)
    t.classGroupId = r
  },
  Qe = (e, o, r, t) => {
    if (et(e)) {
      ae(e(t), o, r, t)
      return
    }
    ;(o.validators === null && (o.validators = []), o.validators.push(We(r, e)))
  },
  Ze = (e, o, r, t) => {
    const a = Object.entries(e),
      d = a.length
    for (let i = 0; i < d; i++) {
      const [u, c] = a[i]
      ae(c, Ae(o, u), r, t)
    }
  },
  Ae = (e, o) => {
    let r = e
    const t = o.split(Q),
      a = t.length
    for (let d = 0; d < a; d++) {
      const i = t[d]
      let u = r.nextPart.get(i)
      ;(u || ((u = Ce()), r.nextPart.set(i, u)), (r = u))
    }
    return r
  },
  et = (e) => 'isThemeGetter' in e && e.isThemeGetter === !0,
  tt = (e) => {
    if (e < 1)
      return {
        get: () => {},
        set: () => {},
      }
    let o = 0,
      r = /* @__PURE__ */ Object.create(null),
      t = /* @__PURE__ */ Object.create(null)
    const a = (d, i) => {
      ;((r[d] = i), o++, o > e && ((o = 0), (t = r), (r = /* @__PURE__ */ Object.create(null))))
    }
    return {
      get(d) {
        let i = r[d]
        if (i !== void 0) return i
        if ((i = t[d]) !== void 0) return (a(d, i), i)
      },
      set(d, i) {
        d in r ? (r[d] = i) : a(d, i)
      },
    }
  },
  se = '!',
  be = ':',
  ot = [],
  he = (e, o, r, t, a) => ({
    modifiers: e,
    hasImportantModifier: o,
    baseClassName: r,
    maybePostfixModifierPosition: t,
    isExternal: a,
  }),
  rt = (e) => {
    const { prefix: o, experimentalParseClassName: r } = e
    let t = (a) => {
      const d = []
      let i = 0,
        u = 0,
        c = 0,
        f
      const h = a.length
      for (let v = 0; v < h; v++) {
        const x = a[v]
        if (i === 0 && u === 0) {
          if (x === be) {
            ;(d.push(a.slice(c, v)), (c = v + 1))
            continue
          }
          if (x === '/') {
            f = v
            continue
          }
        }
        x === '[' ? i++ : x === ']' ? i-- : x === '(' ? u++ : x === ')' && u--
      }
      const y = d.length === 0 ? a : a.slice(c)
      let C = y,
        I = !1
      y.endsWith(se)
        ? ((C = y.slice(0, -1)), (I = !0))
        : /**
           * In Tailwind CSS v3 the important modifier was at the start of the base class name. This is still supported for legacy reasons.
           * @see https://github.com/dcastil/tailwind-merge/issues/513#issuecomment-2614029864
           */
          y.startsWith(se) && ((C = y.slice(1)), (I = !0))
      const T = f && f > c ? f - c : void 0
      return he(d, I, C, T)
    }
    if (o) {
      const a = o + be,
        d = t
      t = (i) => (i.startsWith(a) ? d(i.slice(a.length)) : he(ot, !1, i, void 0, !0))
    }
    if (r) {
      const a = t
      t = (d) =>
        r({
          className: d,
          parseClassName: a,
        })
    }
    return t
  },
  st = (e) => {
    const o = /* @__PURE__ */ new Map()
    return (
      e.orderSensitiveModifiers.forEach((r, t) => {
        o.set(r, 1e6 + t)
      }),
      (r) => {
        const t = []
        let a = []
        for (let d = 0; d < r.length; d++) {
          const i = r[d],
            u = i[0] === '[',
            c = o.has(i)
          u || c ? (a.length > 0 && (a.sort(), t.push(...a), (a = [])), t.push(i)) : a.push(i)
        }
        return (a.length > 0 && (a.sort(), t.push(...a)), t)
      }
    )
  },
  nt = (e) => ({
    cache: tt(e.cacheSize),
    parseClassName: rt(e),
    sortModifiers: st(e),
    ...Ye(e),
  }),
  at = /\s+/,
  it = (e, o) => {
    const {
        parseClassName: r,
        getClassGroupId: t,
        getConflictingClassGroupIds: a,
        sortModifiers: d,
      } = o,
      i = [],
      u = e.trim().split(at)
    let c = ''
    for (let f = u.length - 1; f >= 0; f -= 1) {
      const h = u[f],
        {
          isExternal: y,
          modifiers: C,
          hasImportantModifier: I,
          baseClassName: T,
          maybePostfixModifierPosition: v,
        } = r(h)
      if (y) {
        c = h + (c.length > 0 ? ' ' + c : c)
        continue
      }
      let x = !!v,
        P = t(x ? T.substring(0, v) : T)
      if (!P) {
        if (!x) {
          c = h + (c.length > 0 ? ' ' + c : c)
          continue
        }
        if (((P = t(T)), !P)) {
          c = h + (c.length > 0 ? ' ' + c : c)
          continue
        }
        x = !1
      }
      const W = C.length === 0 ? '' : C.length === 1 ? C[0] : d(C).join(':'),
        $ = I ? W + se : W,
        E = $ + P
      if (i.indexOf(E) > -1) continue
      i.push(E)
      const j = a(P, x)
      for (let M = 0; M < j.length; ++M) {
        const B = j[M]
        i.push($ + B)
      }
      c = h + (c.length > 0 ? ' ' + c : c)
    }
    return c
  },
  lt = (...e) => {
    let o = 0,
      r,
      t,
      a = ''
    for (; o < e.length; ) (r = e[o++]) && (t = Se(r)) && (a && (a += ' '), (a += t))
    return a
  },
  Se = (e) => {
    if (typeof e == 'string') return e
    let o,
      r = ''
    for (let t = 0; t < e.length; t++) e[t] && (o = Se(e[t])) && (r && (r += ' '), (r += o))
    return r
  },
  ct = (e, ...o) => {
    let r, t, a, d
    const i = (c) => {
        const f = o.reduce((h, y) => y(h), e())
        return ((r = nt(f)), (t = r.cache.get), (a = r.cache.set), (d = u), u(c))
      },
      u = (c) => {
        const f = t(c)
        if (f) return f
        const h = it(c, r)
        return (a(c, h), h)
      }
    return ((d = i), (...c) => d(lt(...c)))
  },
  dt = [],
  g = (e) => {
    const o = (r) => r[e] || dt
    return ((o.isThemeGetter = !0), o)
  },
  Re = /^\[(?:(\w[\w-]*):)?(.+)\]$/i,
  Ge = /^\((?:(\w[\w-]*):)?(.+)\)$/i,
  mt = /^\d+\/\d+$/,
  pt = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/,
  ut =
    /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/,
  ft = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/,
  gt = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/,
  bt =
    /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/,
  V = (e) => mt.test(e),
  p = (e) => !!e && !Number.isNaN(Number(e)),
  G = (e) => !!e && Number.isInteger(Number(e)),
  oe = (e) => e.endsWith('%') && p(e.slice(0, -1)),
  R = (e) => pt.test(e),
  ht = () => !0,
  kt = (e) =>
    // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
    // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
    // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
    ut.test(e) && !ft.test(e),
  Ie = () => !1,
  xt = (e) => gt.test(e),
  wt = (e) => bt.test(e),
  yt = (e) => !s(e) && !n(e),
  vt = (e) => D(e, Me, Ie),
  s = (e) => Re.test(e),
  N = (e) => D(e, Le, kt),
  re = (e) => D(e, Rt, p),
  ke = (e) => D(e, Te, Ie),
  Ct = (e) => D(e, Pe, wt),
  H = (e) => D(e, Ne, xt),
  n = (e) => Ge.test(e),
  _ = (e) => F(e, Le),
  zt = (e) => F(e, Gt),
  xe = (e) => F(e, Te),
  At = (e) => F(e, Me),
  St = (e) => F(e, Pe),
  K = (e) => F(e, Ne, !0),
  D = (e, o, r) => {
    const t = Re.exec(e)
    return t ? (t[1] ? o(t[1]) : r(t[2])) : !1
  },
  F = (e, o, r = !1) => {
    const t = Ge.exec(e)
    return t ? (t[1] ? o(t[1]) : r) : !1
  },
  Te = (e) => e === 'position' || e === 'percentage',
  Pe = (e) => e === 'image' || e === 'url',
  Me = (e) => e === 'length' || e === 'size' || e === 'bg-size',
  Le = (e) => e === 'length',
  Rt = (e) => e === 'number',
  Gt = (e) => e === 'family-name',
  Ne = (e) => e === 'shadow',
  It = () => {
    const e = g('color'),
      o = g('font'),
      r = g('text'),
      t = g('font-weight'),
      a = g('tracking'),
      d = g('leading'),
      i = g('breakpoint'),
      u = g('container'),
      c = g('spacing'),
      f = g('radius'),
      h = g('shadow'),
      y = g('inset-shadow'),
      C = g('text-shadow'),
      I = g('drop-shadow'),
      T = g('blur'),
      v = g('perspective'),
      x = g('aspect'),
      P = g('ease'),
      W = g('animate'),
      $ = () => ['auto', 'avoid', 'all', 'avoid-page', 'page', 'left', 'right', 'column'],
      E = () => [
        'center',
        'top',
        'bottom',
        'left',
        'right',
        'top-left',
        // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
        'left-top',
        'top-right',
        // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
        'right-top',
        'bottom-right',
        // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
        'right-bottom',
        'bottom-left',
        // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
        'left-bottom',
      ],
      j = () => [...E(), n, s],
      M = () => ['auto', 'hidden', 'clip', 'visible', 'scroll'],
      B = () => ['auto', 'contain', 'none'],
      m = () => [n, s, c],
      A = () => [V, 'full', 'auto', ...m()],
      ie = () => [G, 'none', 'subgrid', n, s],
      le = () => [
        'auto',
        {
          span: ['full', G, n, s],
        },
        G,
        n,
        s,
      ],
      U = () => [G, 'auto', n, s],
      ce = () => ['auto', 'min', 'max', 'fr', n, s],
      Z = () => [
        'start',
        'end',
        'center',
        'between',
        'around',
        'evenly',
        'stretch',
        'baseline',
        'center-safe',
        'end-safe',
      ],
      O = () => ['start', 'end', 'center', 'stretch', 'center-safe', 'end-safe'],
      S = () => ['auto', ...m()],
      L = () => [
        V,
        'auto',
        'full',
        'dvw',
        'dvh',
        'lvw',
        'lvh',
        'svw',
        'svh',
        'min',
        'max',
        'fit',
        ...m(),
      ],
      l = () => [e, n, s],
      de = () => [
        ...E(),
        xe,
        ke,
        {
          position: [n, s],
        },
      ],
      me = () => [
        'no-repeat',
        {
          repeat: ['', 'x', 'y', 'space', 'round'],
        },
      ],
      pe = () => [
        'auto',
        'cover',
        'contain',
        At,
        vt,
        {
          size: [n, s],
        },
      ],
      ee = () => [oe, _, N],
      k = () => [
        // Deprecated since Tailwind CSS v4.0.0
        '',
        'none',
        'full',
        f,
        n,
        s,
      ],
      w = () => ['', p, _, N],
      Y = () => ['solid', 'dashed', 'dotted', 'double'],
      ue = () => [
        'normal',
        'multiply',
        'screen',
        'overlay',
        'darken',
        'lighten',
        'color-dodge',
        'color-burn',
        'hard-light',
        'soft-light',
        'difference',
        'exclusion',
        'hue',
        'saturation',
        'color',
        'luminosity',
      ],
      b = () => [p, oe, xe, ke],
      fe = () => [
        // Deprecated since Tailwind CSS v4.0.0
        '',
        'none',
        T,
        n,
        s,
      ],
      q = () => ['none', p, n, s],
      X = () => ['none', p, n, s],
      te = () => [p, n, s],
      J = () => [V, 'full', ...m()]
    return {
      cacheSize: 500,
      theme: {
        animate: ['spin', 'ping', 'pulse', 'bounce'],
        aspect: ['video'],
        blur: [R],
        breakpoint: [R],
        color: [ht],
        container: [R],
        'drop-shadow': [R],
        ease: ['in', 'out', 'in-out'],
        font: [yt],
        'font-weight': [
          'thin',
          'extralight',
          'light',
          'normal',
          'medium',
          'semibold',
          'bold',
          'extrabold',
          'black',
        ],
        'inset-shadow': [R],
        leading: ['none', 'tight', 'snug', 'normal', 'relaxed', 'loose'],
        perspective: ['dramatic', 'near', 'normal', 'midrange', 'distant', 'none'],
        radius: [R],
        shadow: [R],
        spacing: ['px', p],
        text: [R],
        'text-shadow': [R],
        tracking: ['tighter', 'tight', 'normal', 'wide', 'wider', 'widest'],
      },
      classGroups: {
        // --------------
        // --- Layout ---
        // --------------
        /**
         * Aspect Ratio
         * @see https://tailwindcss.com/docs/aspect-ratio
         */
        aspect: [
          {
            aspect: ['auto', 'square', V, s, n, x],
          },
        ],
        /**
         * Container
         * @see https://tailwindcss.com/docs/container
         * @deprecated since Tailwind CSS v4.0.0
         */
        container: ['container'],
        /**
         * Columns
         * @see https://tailwindcss.com/docs/columns
         */
        columns: [
          {
            columns: [p, s, n, u],
          },
        ],
        /**
         * Break After
         * @see https://tailwindcss.com/docs/break-after
         */
        'break-after': [
          {
            'break-after': $(),
          },
        ],
        /**
         * Break Before
         * @see https://tailwindcss.com/docs/break-before
         */
        'break-before': [
          {
            'break-before': $(),
          },
        ],
        /**
         * Break Inside
         * @see https://tailwindcss.com/docs/break-inside
         */
        'break-inside': [
          {
            'break-inside': ['auto', 'avoid', 'avoid-page', 'avoid-column'],
          },
        ],
        /**
         * Box Decoration Break
         * @see https://tailwindcss.com/docs/box-decoration-break
         */
        'box-decoration': [
          {
            'box-decoration': ['slice', 'clone'],
          },
        ],
        /**
         * Box Sizing
         * @see https://tailwindcss.com/docs/box-sizing
         */
        box: [
          {
            box: ['border', 'content'],
          },
        ],
        /**
         * Display
         * @see https://tailwindcss.com/docs/display
         */
        display: [
          'block',
          'inline-block',
          'inline',
          'flex',
          'inline-flex',
          'table',
          'inline-table',
          'table-caption',
          'table-cell',
          'table-column',
          'table-column-group',
          'table-footer-group',
          'table-header-group',
          'table-row-group',
          'table-row',
          'flow-root',
          'grid',
          'inline-grid',
          'contents',
          'list-item',
          'hidden',
        ],
        /**
         * Screen Reader Only
         * @see https://tailwindcss.com/docs/display#screen-reader-only
         */
        sr: ['sr-only', 'not-sr-only'],
        /**
         * Floats
         * @see https://tailwindcss.com/docs/float
         */
        float: [
          {
            float: ['right', 'left', 'none', 'start', 'end'],
          },
        ],
        /**
         * Clear
         * @see https://tailwindcss.com/docs/clear
         */
        clear: [
          {
            clear: ['left', 'right', 'both', 'none', 'start', 'end'],
          },
        ],
        /**
         * Isolation
         * @see https://tailwindcss.com/docs/isolation
         */
        isolation: ['isolate', 'isolation-auto'],
        /**
         * Object Fit
         * @see https://tailwindcss.com/docs/object-fit
         */
        'object-fit': [
          {
            object: ['contain', 'cover', 'fill', 'none', 'scale-down'],
          },
        ],
        /**
         * Object Position
         * @see https://tailwindcss.com/docs/object-position
         */
        'object-position': [
          {
            object: j(),
          },
        ],
        /**
         * Overflow
         * @see https://tailwindcss.com/docs/overflow
         */
        overflow: [
          {
            overflow: M(),
          },
        ],
        /**
         * Overflow X
         * @see https://tailwindcss.com/docs/overflow
         */
        'overflow-x': [
          {
            'overflow-x': M(),
          },
        ],
        /**
         * Overflow Y
         * @see https://tailwindcss.com/docs/overflow
         */
        'overflow-y': [
          {
            'overflow-y': M(),
          },
        ],
        /**
         * Overscroll Behavior
         * @see https://tailwindcss.com/docs/overscroll-behavior
         */
        overscroll: [
          {
            overscroll: B(),
          },
        ],
        /**
         * Overscroll Behavior X
         * @see https://tailwindcss.com/docs/overscroll-behavior
         */
        'overscroll-x': [
          {
            'overscroll-x': B(),
          },
        ],
        /**
         * Overscroll Behavior Y
         * @see https://tailwindcss.com/docs/overscroll-behavior
         */
        'overscroll-y': [
          {
            'overscroll-y': B(),
          },
        ],
        /**
         * Position
         * @see https://tailwindcss.com/docs/position
         */
        position: ['static', 'fixed', 'absolute', 'relative', 'sticky'],
        /**
         * Top / Right / Bottom / Left
         * @see https://tailwindcss.com/docs/top-right-bottom-left
         */
        inset: [
          {
            inset: A(),
          },
        ],
        /**
         * Right / Left
         * @see https://tailwindcss.com/docs/top-right-bottom-left
         */
        'inset-x': [
          {
            'inset-x': A(),
          },
        ],
        /**
         * Top / Bottom
         * @see https://tailwindcss.com/docs/top-right-bottom-left
         */
        'inset-y': [
          {
            'inset-y': A(),
          },
        ],
        /**
         * Start
         * @see https://tailwindcss.com/docs/top-right-bottom-left
         */
        start: [
          {
            start: A(),
          },
        ],
        /**
         * End
         * @see https://tailwindcss.com/docs/top-right-bottom-left
         */
        end: [
          {
            end: A(),
          },
        ],
        /**
         * Top
         * @see https://tailwindcss.com/docs/top-right-bottom-left
         */
        top: [
          {
            top: A(),
          },
        ],
        /**
         * Right
         * @see https://tailwindcss.com/docs/top-right-bottom-left
         */
        right: [
          {
            right: A(),
          },
        ],
        /**
         * Bottom
         * @see https://tailwindcss.com/docs/top-right-bottom-left
         */
        bottom: [
          {
            bottom: A(),
          },
        ],
        /**
         * Left
         * @see https://tailwindcss.com/docs/top-right-bottom-left
         */
        left: [
          {
            left: A(),
          },
        ],
        /**
         * Visibility
         * @see https://tailwindcss.com/docs/visibility
         */
        visibility: ['visible', 'invisible', 'collapse'],
        /**
         * Z-Index
         * @see https://tailwindcss.com/docs/z-index
         */
        z: [
          {
            z: [G, 'auto', n, s],
          },
        ],
        // ------------------------
        // --- Flexbox and Grid ---
        // ------------------------
        /**
         * Flex Basis
         * @see https://tailwindcss.com/docs/flex-basis
         */
        basis: [
          {
            basis: [V, 'full', 'auto', u, ...m()],
          },
        ],
        /**
         * Flex Direction
         * @see https://tailwindcss.com/docs/flex-direction
         */
        'flex-direction': [
          {
            flex: ['row', 'row-reverse', 'col', 'col-reverse'],
          },
        ],
        /**
         * Flex Wrap
         * @see https://tailwindcss.com/docs/flex-wrap
         */
        'flex-wrap': [
          {
            flex: ['nowrap', 'wrap', 'wrap-reverse'],
          },
        ],
        /**
         * Flex
         * @see https://tailwindcss.com/docs/flex
         */
        flex: [
          {
            flex: [p, V, 'auto', 'initial', 'none', s],
          },
        ],
        /**
         * Flex Grow
         * @see https://tailwindcss.com/docs/flex-grow
         */
        grow: [
          {
            grow: ['', p, n, s],
          },
        ],
        /**
         * Flex Shrink
         * @see https://tailwindcss.com/docs/flex-shrink
         */
        shrink: [
          {
            shrink: ['', p, n, s],
          },
        ],
        /**
         * Order
         * @see https://tailwindcss.com/docs/order
         */
        order: [
          {
            order: [G, 'first', 'last', 'none', n, s],
          },
        ],
        /**
         * Grid Template Columns
         * @see https://tailwindcss.com/docs/grid-template-columns
         */
        'grid-cols': [
          {
            'grid-cols': ie(),
          },
        ],
        /**
         * Grid Column Start / End
         * @see https://tailwindcss.com/docs/grid-column
         */
        'col-start-end': [
          {
            col: le(),
          },
        ],
        /**
         * Grid Column Start
         * @see https://tailwindcss.com/docs/grid-column
         */
        'col-start': [
          {
            'col-start': U(),
          },
        ],
        /**
         * Grid Column End
         * @see https://tailwindcss.com/docs/grid-column
         */
        'col-end': [
          {
            'col-end': U(),
          },
        ],
        /**
         * Grid Template Rows
         * @see https://tailwindcss.com/docs/grid-template-rows
         */
        'grid-rows': [
          {
            'grid-rows': ie(),
          },
        ],
        /**
         * Grid Row Start / End
         * @see https://tailwindcss.com/docs/grid-row
         */
        'row-start-end': [
          {
            row: le(),
          },
        ],
        /**
         * Grid Row Start
         * @see https://tailwindcss.com/docs/grid-row
         */
        'row-start': [
          {
            'row-start': U(),
          },
        ],
        /**
         * Grid Row End
         * @see https://tailwindcss.com/docs/grid-row
         */
        'row-end': [
          {
            'row-end': U(),
          },
        ],
        /**
         * Grid Auto Flow
         * @see https://tailwindcss.com/docs/grid-auto-flow
         */
        'grid-flow': [
          {
            'grid-flow': ['row', 'col', 'dense', 'row-dense', 'col-dense'],
          },
        ],
        /**
         * Grid Auto Columns
         * @see https://tailwindcss.com/docs/grid-auto-columns
         */
        'auto-cols': [
          {
            'auto-cols': ce(),
          },
        ],
        /**
         * Grid Auto Rows
         * @see https://tailwindcss.com/docs/grid-auto-rows
         */
        'auto-rows': [
          {
            'auto-rows': ce(),
          },
        ],
        /**
         * Gap
         * @see https://tailwindcss.com/docs/gap
         */
        gap: [
          {
            gap: m(),
          },
        ],
        /**
         * Gap X
         * @see https://tailwindcss.com/docs/gap
         */
        'gap-x': [
          {
            'gap-x': m(),
          },
        ],
        /**
         * Gap Y
         * @see https://tailwindcss.com/docs/gap
         */
        'gap-y': [
          {
            'gap-y': m(),
          },
        ],
        /**
         * Justify Content
         * @see https://tailwindcss.com/docs/justify-content
         */
        'justify-content': [
          {
            justify: [...Z(), 'normal'],
          },
        ],
        /**
         * Justify Items
         * @see https://tailwindcss.com/docs/justify-items
         */
        'justify-items': [
          {
            'justify-items': [...O(), 'normal'],
          },
        ],
        /**
         * Justify Self
         * @see https://tailwindcss.com/docs/justify-self
         */
        'justify-self': [
          {
            'justify-self': ['auto', ...O()],
          },
        ],
        /**
         * Align Content
         * @see https://tailwindcss.com/docs/align-content
         */
        'align-content': [
          {
            content: ['normal', ...Z()],
          },
        ],
        /**
         * Align Items
         * @see https://tailwindcss.com/docs/align-items
         */
        'align-items': [
          {
            items: [
              ...O(),
              {
                baseline: ['', 'last'],
              },
            ],
          },
        ],
        /**
         * Align Self
         * @see https://tailwindcss.com/docs/align-self
         */
        'align-self': [
          {
            self: [
              'auto',
              ...O(),
              {
                baseline: ['', 'last'],
              },
            ],
          },
        ],
        /**
         * Place Content
         * @see https://tailwindcss.com/docs/place-content
         */
        'place-content': [
          {
            'place-content': Z(),
          },
        ],
        /**
         * Place Items
         * @see https://tailwindcss.com/docs/place-items
         */
        'place-items': [
          {
            'place-items': [...O(), 'baseline'],
          },
        ],
        /**
         * Place Self
         * @see https://tailwindcss.com/docs/place-self
         */
        'place-self': [
          {
            'place-self': ['auto', ...O()],
          },
        ],
        // Spacing
        /**
         * Padding
         * @see https://tailwindcss.com/docs/padding
         */
        p: [
          {
            p: m(),
          },
        ],
        /**
         * Padding X
         * @see https://tailwindcss.com/docs/padding
         */
        px: [
          {
            px: m(),
          },
        ],
        /**
         * Padding Y
         * @see https://tailwindcss.com/docs/padding
         */
        py: [
          {
            py: m(),
          },
        ],
        /**
         * Padding Start
         * @see https://tailwindcss.com/docs/padding
         */
        ps: [
          {
            ps: m(),
          },
        ],
        /**
         * Padding End
         * @see https://tailwindcss.com/docs/padding
         */
        pe: [
          {
            pe: m(),
          },
        ],
        /**
         * Padding Top
         * @see https://tailwindcss.com/docs/padding
         */
        pt: [
          {
            pt: m(),
          },
        ],
        /**
         * Padding Right
         * @see https://tailwindcss.com/docs/padding
         */
        pr: [
          {
            pr: m(),
          },
        ],
        /**
         * Padding Bottom
         * @see https://tailwindcss.com/docs/padding
         */
        pb: [
          {
            pb: m(),
          },
        ],
        /**
         * Padding Left
         * @see https://tailwindcss.com/docs/padding
         */
        pl: [
          {
            pl: m(),
          },
        ],
        /**
         * Margin
         * @see https://tailwindcss.com/docs/margin
         */
        m: [
          {
            m: S(),
          },
        ],
        /**
         * Margin X
         * @see https://tailwindcss.com/docs/margin
         */
        mx: [
          {
            mx: S(),
          },
        ],
        /**
         * Margin Y
         * @see https://tailwindcss.com/docs/margin
         */
        my: [
          {
            my: S(),
          },
        ],
        /**
         * Margin Start
         * @see https://tailwindcss.com/docs/margin
         */
        ms: [
          {
            ms: S(),
          },
        ],
        /**
         * Margin End
         * @see https://tailwindcss.com/docs/margin
         */
        me: [
          {
            me: S(),
          },
        ],
        /**
         * Margin Top
         * @see https://tailwindcss.com/docs/margin
         */
        mt: [
          {
            mt: S(),
          },
        ],
        /**
         * Margin Right
         * @see https://tailwindcss.com/docs/margin
         */
        mr: [
          {
            mr: S(),
          },
        ],
        /**
         * Margin Bottom
         * @see https://tailwindcss.com/docs/margin
         */
        mb: [
          {
            mb: S(),
          },
        ],
        /**
         * Margin Left
         * @see https://tailwindcss.com/docs/margin
         */
        ml: [
          {
            ml: S(),
          },
        ],
        /**
         * Space Between X
         * @see https://tailwindcss.com/docs/margin#adding-space-between-children
         */
        'space-x': [
          {
            'space-x': m(),
          },
        ],
        /**
         * Space Between X Reverse
         * @see https://tailwindcss.com/docs/margin#adding-space-between-children
         */
        'space-x-reverse': ['space-x-reverse'],
        /**
         * Space Between Y
         * @see https://tailwindcss.com/docs/margin#adding-space-between-children
         */
        'space-y': [
          {
            'space-y': m(),
          },
        ],
        /**
         * Space Between Y Reverse
         * @see https://tailwindcss.com/docs/margin#adding-space-between-children
         */
        'space-y-reverse': ['space-y-reverse'],
        // --------------
        // --- Sizing ---
        // --------------
        /**
         * Size
         * @see https://tailwindcss.com/docs/width#setting-both-width-and-height
         */
        size: [
          {
            size: L(),
          },
        ],
        /**
         * Width
         * @see https://tailwindcss.com/docs/width
         */
        w: [
          {
            w: [u, 'screen', ...L()],
          },
        ],
        /**
         * Min-Width
         * @see https://tailwindcss.com/docs/min-width
         */
        'min-w': [
          {
            'min-w': [
              u,
              'screen',
              /** Deprecated. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
              'none',
              ...L(),
            ],
          },
        ],
        /**
         * Max-Width
         * @see https://tailwindcss.com/docs/max-width
         */
        'max-w': [
          {
            'max-w': [
              u,
              'screen',
              'none',
              /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
              'prose',
              /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
              {
                screen: [i],
              },
              ...L(),
            ],
          },
        ],
        /**
         * Height
         * @see https://tailwindcss.com/docs/height
         */
        h: [
          {
            h: ['screen', 'lh', ...L()],
          },
        ],
        /**
         * Min-Height
         * @see https://tailwindcss.com/docs/min-height
         */
        'min-h': [
          {
            'min-h': ['screen', 'lh', 'none', ...L()],
          },
        ],
        /**
         * Max-Height
         * @see https://tailwindcss.com/docs/max-height
         */
        'max-h': [
          {
            'max-h': ['screen', 'lh', ...L()],
          },
        ],
        // ------------------
        // --- Typography ---
        // ------------------
        /**
         * Font Size
         * @see https://tailwindcss.com/docs/font-size
         */
        'font-size': [
          {
            text: ['base', r, _, N],
          },
        ],
        /**
         * Font Smoothing
         * @see https://tailwindcss.com/docs/font-smoothing
         */
        'font-smoothing': ['antialiased', 'subpixel-antialiased'],
        /**
         * Font Style
         * @see https://tailwindcss.com/docs/font-style
         */
        'font-style': ['italic', 'not-italic'],
        /**
         * Font Weight
         * @see https://tailwindcss.com/docs/font-weight
         */
        'font-weight': [
          {
            font: [t, n, re],
          },
        ],
        /**
         * Font Stretch
         * @see https://tailwindcss.com/docs/font-stretch
         */
        'font-stretch': [
          {
            'font-stretch': [
              'ultra-condensed',
              'extra-condensed',
              'condensed',
              'semi-condensed',
              'normal',
              'semi-expanded',
              'expanded',
              'extra-expanded',
              'ultra-expanded',
              oe,
              s,
            ],
          },
        ],
        /**
         * Font Family
         * @see https://tailwindcss.com/docs/font-family
         */
        'font-family': [
          {
            font: [zt, s, o],
          },
        ],
        /**
         * Font Variant Numeric
         * @see https://tailwindcss.com/docs/font-variant-numeric
         */
        'fvn-normal': ['normal-nums'],
        /**
         * Font Variant Numeric
         * @see https://tailwindcss.com/docs/font-variant-numeric
         */
        'fvn-ordinal': ['ordinal'],
        /**
         * Font Variant Numeric
         * @see https://tailwindcss.com/docs/font-variant-numeric
         */
        'fvn-slashed-zero': ['slashed-zero'],
        /**
         * Font Variant Numeric
         * @see https://tailwindcss.com/docs/font-variant-numeric
         */
        'fvn-figure': ['lining-nums', 'oldstyle-nums'],
        /**
         * Font Variant Numeric
         * @see https://tailwindcss.com/docs/font-variant-numeric
         */
        'fvn-spacing': ['proportional-nums', 'tabular-nums'],
        /**
         * Font Variant Numeric
         * @see https://tailwindcss.com/docs/font-variant-numeric
         */
        'fvn-fraction': ['diagonal-fractions', 'stacked-fractions'],
        /**
         * Letter Spacing
         * @see https://tailwindcss.com/docs/letter-spacing
         */
        tracking: [
          {
            tracking: [a, n, s],
          },
        ],
        /**
         * Line Clamp
         * @see https://tailwindcss.com/docs/line-clamp
         */
        'line-clamp': [
          {
            'line-clamp': [p, 'none', n, re],
          },
        ],
        /**
         * Line Height
         * @see https://tailwindcss.com/docs/line-height
         */
        leading: [
          {
            leading: [
              /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
              d,
              ...m(),
            ],
          },
        ],
        /**
         * List Style Image
         * @see https://tailwindcss.com/docs/list-style-image
         */
        'list-image': [
          {
            'list-image': ['none', n, s],
          },
        ],
        /**
         * List Style Position
         * @see https://tailwindcss.com/docs/list-style-position
         */
        'list-style-position': [
          {
            list: ['inside', 'outside'],
          },
        ],
        /**
         * List Style Type
         * @see https://tailwindcss.com/docs/list-style-type
         */
        'list-style-type': [
          {
            list: ['disc', 'decimal', 'none', n, s],
          },
        ],
        /**
         * Text Alignment
         * @see https://tailwindcss.com/docs/text-align
         */
        'text-alignment': [
          {
            text: ['left', 'center', 'right', 'justify', 'start', 'end'],
          },
        ],
        /**
         * Placeholder Color
         * @deprecated since Tailwind CSS v3.0.0
         * @see https://v3.tailwindcss.com/docs/placeholder-color
         */
        'placeholder-color': [
          {
            placeholder: l(),
          },
        ],
        /**
         * Text Color
         * @see https://tailwindcss.com/docs/text-color
         */
        'text-color': [
          {
            text: l(),
          },
        ],
        /**
         * Text Decoration
         * @see https://tailwindcss.com/docs/text-decoration
         */
        'text-decoration': ['underline', 'overline', 'line-through', 'no-underline'],
        /**
         * Text Decoration Style
         * @see https://tailwindcss.com/docs/text-decoration-style
         */
        'text-decoration-style': [
          {
            decoration: [...Y(), 'wavy'],
          },
        ],
        /**
         * Text Decoration Thickness
         * @see https://tailwindcss.com/docs/text-decoration-thickness
         */
        'text-decoration-thickness': [
          {
            decoration: [p, 'from-font', 'auto', n, N],
          },
        ],
        /**
         * Text Decoration Color
         * @see https://tailwindcss.com/docs/text-decoration-color
         */
        'text-decoration-color': [
          {
            decoration: l(),
          },
        ],
        /**
         * Text Underline Offset
         * @see https://tailwindcss.com/docs/text-underline-offset
         */
        'underline-offset': [
          {
            'underline-offset': [p, 'auto', n, s],
          },
        ],
        /**
         * Text Transform
         * @see https://tailwindcss.com/docs/text-transform
         */
        'text-transform': ['uppercase', 'lowercase', 'capitalize', 'normal-case'],
        /**
         * Text Overflow
         * @see https://tailwindcss.com/docs/text-overflow
         */
        'text-overflow': ['truncate', 'text-ellipsis', 'text-clip'],
        /**
         * Text Wrap
         * @see https://tailwindcss.com/docs/text-wrap
         */
        'text-wrap': [
          {
            text: ['wrap', 'nowrap', 'balance', 'pretty'],
          },
        ],
        /**
         * Text Indent
         * @see https://tailwindcss.com/docs/text-indent
         */
        indent: [
          {
            indent: m(),
          },
        ],
        /**
         * Vertical Alignment
         * @see https://tailwindcss.com/docs/vertical-align
         */
        'vertical-align': [
          {
            align: [
              'baseline',
              'top',
              'middle',
              'bottom',
              'text-top',
              'text-bottom',
              'sub',
              'super',
              n,
              s,
            ],
          },
        ],
        /**
         * Whitespace
         * @see https://tailwindcss.com/docs/whitespace
         */
        whitespace: [
          {
            whitespace: ['normal', 'nowrap', 'pre', 'pre-line', 'pre-wrap', 'break-spaces'],
          },
        ],
        /**
         * Word Break
         * @see https://tailwindcss.com/docs/word-break
         */
        break: [
          {
            break: ['normal', 'words', 'all', 'keep'],
          },
        ],
        /**
         * Overflow Wrap
         * @see https://tailwindcss.com/docs/overflow-wrap
         */
        wrap: [
          {
            wrap: ['break-word', 'anywhere', 'normal'],
          },
        ],
        /**
         * Hyphens
         * @see https://tailwindcss.com/docs/hyphens
         */
        hyphens: [
          {
            hyphens: ['none', 'manual', 'auto'],
          },
        ],
        /**
         * Content
         * @see https://tailwindcss.com/docs/content
         */
        content: [
          {
            content: ['none', n, s],
          },
        ],
        // -------------------
        // --- Backgrounds ---
        // -------------------
        /**
         * Background Attachment
         * @see https://tailwindcss.com/docs/background-attachment
         */
        'bg-attachment': [
          {
            bg: ['fixed', 'local', 'scroll'],
          },
        ],
        /**
         * Background Clip
         * @see https://tailwindcss.com/docs/background-clip
         */
        'bg-clip': [
          {
            'bg-clip': ['border', 'padding', 'content', 'text'],
          },
        ],
        /**
         * Background Origin
         * @see https://tailwindcss.com/docs/background-origin
         */
        'bg-origin': [
          {
            'bg-origin': ['border', 'padding', 'content'],
          },
        ],
        /**
         * Background Position
         * @see https://tailwindcss.com/docs/background-position
         */
        'bg-position': [
          {
            bg: de(),
          },
        ],
        /**
         * Background Repeat
         * @see https://tailwindcss.com/docs/background-repeat
         */
        'bg-repeat': [
          {
            bg: me(),
          },
        ],
        /**
         * Background Size
         * @see https://tailwindcss.com/docs/background-size
         */
        'bg-size': [
          {
            bg: pe(),
          },
        ],
        /**
         * Background Image
         * @see https://tailwindcss.com/docs/background-image
         */
        'bg-image': [
          {
            bg: [
              'none',
              {
                linear: [
                  {
                    to: ['t', 'tr', 'r', 'br', 'b', 'bl', 'l', 'tl'],
                  },
                  G,
                  n,
                  s,
                ],
                radial: ['', n, s],
                conic: [G, n, s],
              },
              St,
              Ct,
            ],
          },
        ],
        /**
         * Background Color
         * @see https://tailwindcss.com/docs/background-color
         */
        'bg-color': [
          {
            bg: l(),
          },
        ],
        /**
         * Gradient Color Stops From Position
         * @see https://tailwindcss.com/docs/gradient-color-stops
         */
        'gradient-from-pos': [
          {
            from: ee(),
          },
        ],
        /**
         * Gradient Color Stops Via Position
         * @see https://tailwindcss.com/docs/gradient-color-stops
         */
        'gradient-via-pos': [
          {
            via: ee(),
          },
        ],
        /**
         * Gradient Color Stops To Position
         * @see https://tailwindcss.com/docs/gradient-color-stops
         */
        'gradient-to-pos': [
          {
            to: ee(),
          },
        ],
        /**
         * Gradient Color Stops From
         * @see https://tailwindcss.com/docs/gradient-color-stops
         */
        'gradient-from': [
          {
            from: l(),
          },
        ],
        /**
         * Gradient Color Stops Via
         * @see https://tailwindcss.com/docs/gradient-color-stops
         */
        'gradient-via': [
          {
            via: l(),
          },
        ],
        /**
         * Gradient Color Stops To
         * @see https://tailwindcss.com/docs/gradient-color-stops
         */
        'gradient-to': [
          {
            to: l(),
          },
        ],
        // ---------------
        // --- Borders ---
        // ---------------
        /**
         * Border Radius
         * @see https://tailwindcss.com/docs/border-radius
         */
        rounded: [
          {
            rounded: k(),
          },
        ],
        /**
         * Border Radius Start
         * @see https://tailwindcss.com/docs/border-radius
         */
        'rounded-s': [
          {
            'rounded-s': k(),
          },
        ],
        /**
         * Border Radius End
         * @see https://tailwindcss.com/docs/border-radius
         */
        'rounded-e': [
          {
            'rounded-e': k(),
          },
        ],
        /**
         * Border Radius Top
         * @see https://tailwindcss.com/docs/border-radius
         */
        'rounded-t': [
          {
            'rounded-t': k(),
          },
        ],
        /**
         * Border Radius Right
         * @see https://tailwindcss.com/docs/border-radius
         */
        'rounded-r': [
          {
            'rounded-r': k(),
          },
        ],
        /**
         * Border Radius Bottom
         * @see https://tailwindcss.com/docs/border-radius
         */
        'rounded-b': [
          {
            'rounded-b': k(),
          },
        ],
        /**
         * Border Radius Left
         * @see https://tailwindcss.com/docs/border-radius
         */
        'rounded-l': [
          {
            'rounded-l': k(),
          },
        ],
        /**
         * Border Radius Start Start
         * @see https://tailwindcss.com/docs/border-radius
         */
        'rounded-ss': [
          {
            'rounded-ss': k(),
          },
        ],
        /**
         * Border Radius Start End
         * @see https://tailwindcss.com/docs/border-radius
         */
        'rounded-se': [
          {
            'rounded-se': k(),
          },
        ],
        /**
         * Border Radius End End
         * @see https://tailwindcss.com/docs/border-radius
         */
        'rounded-ee': [
          {
            'rounded-ee': k(),
          },
        ],
        /**
         * Border Radius End Start
         * @see https://tailwindcss.com/docs/border-radius
         */
        'rounded-es': [
          {
            'rounded-es': k(),
          },
        ],
        /**
         * Border Radius Top Left
         * @see https://tailwindcss.com/docs/border-radius
         */
        'rounded-tl': [
          {
            'rounded-tl': k(),
          },
        ],
        /**
         * Border Radius Top Right
         * @see https://tailwindcss.com/docs/border-radius
         */
        'rounded-tr': [
          {
            'rounded-tr': k(),
          },
        ],
        /**
         * Border Radius Bottom Right
         * @see https://tailwindcss.com/docs/border-radius
         */
        'rounded-br': [
          {
            'rounded-br': k(),
          },
        ],
        /**
         * Border Radius Bottom Left
         * @see https://tailwindcss.com/docs/border-radius
         */
        'rounded-bl': [
          {
            'rounded-bl': k(),
          },
        ],
        /**
         * Border Width
         * @see https://tailwindcss.com/docs/border-width
         */
        'border-w': [
          {
            border: w(),
          },
        ],
        /**
         * Border Width X
         * @see https://tailwindcss.com/docs/border-width
         */
        'border-w-x': [
          {
            'border-x': w(),
          },
        ],
        /**
         * Border Width Y
         * @see https://tailwindcss.com/docs/border-width
         */
        'border-w-y': [
          {
            'border-y': w(),
          },
        ],
        /**
         * Border Width Start
         * @see https://tailwindcss.com/docs/border-width
         */
        'border-w-s': [
          {
            'border-s': w(),
          },
        ],
        /**
         * Border Width End
         * @see https://tailwindcss.com/docs/border-width
         */
        'border-w-e': [
          {
            'border-e': w(),
          },
        ],
        /**
         * Border Width Top
         * @see https://tailwindcss.com/docs/border-width
         */
        'border-w-t': [
          {
            'border-t': w(),
          },
        ],
        /**
         * Border Width Right
         * @see https://tailwindcss.com/docs/border-width
         */
        'border-w-r': [
          {
            'border-r': w(),
          },
        ],
        /**
         * Border Width Bottom
         * @see https://tailwindcss.com/docs/border-width
         */
        'border-w-b': [
          {
            'border-b': w(),
          },
        ],
        /**
         * Border Width Left
         * @see https://tailwindcss.com/docs/border-width
         */
        'border-w-l': [
          {
            'border-l': w(),
          },
        ],
        /**
         * Divide Width X
         * @see https://tailwindcss.com/docs/border-width#between-children
         */
        'divide-x': [
          {
            'divide-x': w(),
          },
        ],
        /**
         * Divide Width X Reverse
         * @see https://tailwindcss.com/docs/border-width#between-children
         */
        'divide-x-reverse': ['divide-x-reverse'],
        /**
         * Divide Width Y
         * @see https://tailwindcss.com/docs/border-width#between-children
         */
        'divide-y': [
          {
            'divide-y': w(),
          },
        ],
        /**
         * Divide Width Y Reverse
         * @see https://tailwindcss.com/docs/border-width#between-children
         */
        'divide-y-reverse': ['divide-y-reverse'],
        /**
         * Border Style
         * @see https://tailwindcss.com/docs/border-style
         */
        'border-style': [
          {
            border: [...Y(), 'hidden', 'none'],
          },
        ],
        /**
         * Divide Style
         * @see https://tailwindcss.com/docs/border-style#setting-the-divider-style
         */
        'divide-style': [
          {
            divide: [...Y(), 'hidden', 'none'],
          },
        ],
        /**
         * Border Color
         * @see https://tailwindcss.com/docs/border-color
         */
        'border-color': [
          {
            border: l(),
          },
        ],
        /**
         * Border Color X
         * @see https://tailwindcss.com/docs/border-color
         */
        'border-color-x': [
          {
            'border-x': l(),
          },
        ],
        /**
         * Border Color Y
         * @see https://tailwindcss.com/docs/border-color
         */
        'border-color-y': [
          {
            'border-y': l(),
          },
        ],
        /**
         * Border Color S
         * @see https://tailwindcss.com/docs/border-color
         */
        'border-color-s': [
          {
            'border-s': l(),
          },
        ],
        /**
         * Border Color E
         * @see https://tailwindcss.com/docs/border-color
         */
        'border-color-e': [
          {
            'border-e': l(),
          },
        ],
        /**
         * Border Color Top
         * @see https://tailwindcss.com/docs/border-color
         */
        'border-color-t': [
          {
            'border-t': l(),
          },
        ],
        /**
         * Border Color Right
         * @see https://tailwindcss.com/docs/border-color
         */
        'border-color-r': [
          {
            'border-r': l(),
          },
        ],
        /**
         * Border Color Bottom
         * @see https://tailwindcss.com/docs/border-color
         */
        'border-color-b': [
          {
            'border-b': l(),
          },
        ],
        /**
         * Border Color Left
         * @see https://tailwindcss.com/docs/border-color
         */
        'border-color-l': [
          {
            'border-l': l(),
          },
        ],
        /**
         * Divide Color
         * @see https://tailwindcss.com/docs/divide-color
         */
        'divide-color': [
          {
            divide: l(),
          },
        ],
        /**
         * Outline Style
         * @see https://tailwindcss.com/docs/outline-style
         */
        'outline-style': [
          {
            outline: [...Y(), 'none', 'hidden'],
          },
        ],
        /**
         * Outline Offset
         * @see https://tailwindcss.com/docs/outline-offset
         */
        'outline-offset': [
          {
            'outline-offset': [p, n, s],
          },
        ],
        /**
         * Outline Width
         * @see https://tailwindcss.com/docs/outline-width
         */
        'outline-w': [
          {
            outline: ['', p, _, N],
          },
        ],
        /**
         * Outline Color
         * @see https://tailwindcss.com/docs/outline-color
         */
        'outline-color': [
          {
            outline: l(),
          },
        ],
        // ---------------
        // --- Effects ---
        // ---------------
        /**
         * Box Shadow
         * @see https://tailwindcss.com/docs/box-shadow
         */
        shadow: [
          {
            shadow: [
              // Deprecated since Tailwind CSS v4.0.0
              '',
              'none',
              h,
              K,
              H,
            ],
          },
        ],
        /**
         * Box Shadow Color
         * @see https://tailwindcss.com/docs/box-shadow#setting-the-shadow-color
         */
        'shadow-color': [
          {
            shadow: l(),
          },
        ],
        /**
         * Inset Box Shadow
         * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-shadow
         */
        'inset-shadow': [
          {
            'inset-shadow': ['none', y, K, H],
          },
        ],
        /**
         * Inset Box Shadow Color
         * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-shadow-color
         */
        'inset-shadow-color': [
          {
            'inset-shadow': l(),
          },
        ],
        /**
         * Ring Width
         * @see https://tailwindcss.com/docs/box-shadow#adding-a-ring
         */
        'ring-w': [
          {
            ring: w(),
          },
        ],
        /**
         * Ring Width Inset
         * @see https://v3.tailwindcss.com/docs/ring-width#inset-rings
         * @deprecated since Tailwind CSS v4.0.0
         * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
         */
        'ring-w-inset': ['ring-inset'],
        /**
         * Ring Color
         * @see https://tailwindcss.com/docs/box-shadow#setting-the-ring-color
         */
        'ring-color': [
          {
            ring: l(),
          },
        ],
        /**
         * Ring Offset Width
         * @see https://v3.tailwindcss.com/docs/ring-offset-width
         * @deprecated since Tailwind CSS v4.0.0
         * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
         */
        'ring-offset-w': [
          {
            'ring-offset': [p, N],
          },
        ],
        /**
         * Ring Offset Color
         * @see https://v3.tailwindcss.com/docs/ring-offset-color
         * @deprecated since Tailwind CSS v4.0.0
         * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
         */
        'ring-offset-color': [
          {
            'ring-offset': l(),
          },
        ],
        /**
         * Inset Ring Width
         * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-ring
         */
        'inset-ring-w': [
          {
            'inset-ring': w(),
          },
        ],
        /**
         * Inset Ring Color
         * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-ring-color
         */
        'inset-ring-color': [
          {
            'inset-ring': l(),
          },
        ],
        /**
         * Text Shadow
         * @see https://tailwindcss.com/docs/text-shadow
         */
        'text-shadow': [
          {
            'text-shadow': ['none', C, K, H],
          },
        ],
        /**
         * Text Shadow Color
         * @see https://tailwindcss.com/docs/text-shadow#setting-the-shadow-color
         */
        'text-shadow-color': [
          {
            'text-shadow': l(),
          },
        ],
        /**
         * Opacity
         * @see https://tailwindcss.com/docs/opacity
         */
        opacity: [
          {
            opacity: [p, n, s],
          },
        ],
        /**
         * Mix Blend Mode
         * @see https://tailwindcss.com/docs/mix-blend-mode
         */
        'mix-blend': [
          {
            'mix-blend': [...ue(), 'plus-darker', 'plus-lighter'],
          },
        ],
        /**
         * Background Blend Mode
         * @see https://tailwindcss.com/docs/background-blend-mode
         */
        'bg-blend': [
          {
            'bg-blend': ue(),
          },
        ],
        /**
         * Mask Clip
         * @see https://tailwindcss.com/docs/mask-clip
         */
        'mask-clip': [
          {
            'mask-clip': ['border', 'padding', 'content', 'fill', 'stroke', 'view'],
          },
          'mask-no-clip',
        ],
        /**
         * Mask Composite
         * @see https://tailwindcss.com/docs/mask-composite
         */
        'mask-composite': [
          {
            mask: ['add', 'subtract', 'intersect', 'exclude'],
          },
        ],
        /**
         * Mask Image
         * @see https://tailwindcss.com/docs/mask-image
         */
        'mask-image-linear-pos': [
          {
            'mask-linear': [p],
          },
        ],
        'mask-image-linear-from-pos': [
          {
            'mask-linear-from': b(),
          },
        ],
        'mask-image-linear-to-pos': [
          {
            'mask-linear-to': b(),
          },
        ],
        'mask-image-linear-from-color': [
          {
            'mask-linear-from': l(),
          },
        ],
        'mask-image-linear-to-color': [
          {
            'mask-linear-to': l(),
          },
        ],
        'mask-image-t-from-pos': [
          {
            'mask-t-from': b(),
          },
        ],
        'mask-image-t-to-pos': [
          {
            'mask-t-to': b(),
          },
        ],
        'mask-image-t-from-color': [
          {
            'mask-t-from': l(),
          },
        ],
        'mask-image-t-to-color': [
          {
            'mask-t-to': l(),
          },
        ],
        'mask-image-r-from-pos': [
          {
            'mask-r-from': b(),
          },
        ],
        'mask-image-r-to-pos': [
          {
            'mask-r-to': b(),
          },
        ],
        'mask-image-r-from-color': [
          {
            'mask-r-from': l(),
          },
        ],
        'mask-image-r-to-color': [
          {
            'mask-r-to': l(),
          },
        ],
        'mask-image-b-from-pos': [
          {
            'mask-b-from': b(),
          },
        ],
        'mask-image-b-to-pos': [
          {
            'mask-b-to': b(),
          },
        ],
        'mask-image-b-from-color': [
          {
            'mask-b-from': l(),
          },
        ],
        'mask-image-b-to-color': [
          {
            'mask-b-to': l(),
          },
        ],
        'mask-image-l-from-pos': [
          {
            'mask-l-from': b(),
          },
        ],
        'mask-image-l-to-pos': [
          {
            'mask-l-to': b(),
          },
        ],
        'mask-image-l-from-color': [
          {
            'mask-l-from': l(),
          },
        ],
        'mask-image-l-to-color': [
          {
            'mask-l-to': l(),
          },
        ],
        'mask-image-x-from-pos': [
          {
            'mask-x-from': b(),
          },
        ],
        'mask-image-x-to-pos': [
          {
            'mask-x-to': b(),
          },
        ],
        'mask-image-x-from-color': [
          {
            'mask-x-from': l(),
          },
        ],
        'mask-image-x-to-color': [
          {
            'mask-x-to': l(),
          },
        ],
        'mask-image-y-from-pos': [
          {
            'mask-y-from': b(),
          },
        ],
        'mask-image-y-to-pos': [
          {
            'mask-y-to': b(),
          },
        ],
        'mask-image-y-from-color': [
          {
            'mask-y-from': l(),
          },
        ],
        'mask-image-y-to-color': [
          {
            'mask-y-to': l(),
          },
        ],
        'mask-image-radial': [
          {
            'mask-radial': [n, s],
          },
        ],
        'mask-image-radial-from-pos': [
          {
            'mask-radial-from': b(),
          },
        ],
        'mask-image-radial-to-pos': [
          {
            'mask-radial-to': b(),
          },
        ],
        'mask-image-radial-from-color': [
          {
            'mask-radial-from': l(),
          },
        ],
        'mask-image-radial-to-color': [
          {
            'mask-radial-to': l(),
          },
        ],
        'mask-image-radial-shape': [
          {
            'mask-radial': ['circle', 'ellipse'],
          },
        ],
        'mask-image-radial-size': [
          {
            'mask-radial': [
              {
                closest: ['side', 'corner'],
                farthest: ['side', 'corner'],
              },
            ],
          },
        ],
        'mask-image-radial-pos': [
          {
            'mask-radial-at': E(),
          },
        ],
        'mask-image-conic-pos': [
          {
            'mask-conic': [p],
          },
        ],
        'mask-image-conic-from-pos': [
          {
            'mask-conic-from': b(),
          },
        ],
        'mask-image-conic-to-pos': [
          {
            'mask-conic-to': b(),
          },
        ],
        'mask-image-conic-from-color': [
          {
            'mask-conic-from': l(),
          },
        ],
        'mask-image-conic-to-color': [
          {
            'mask-conic-to': l(),
          },
        ],
        /**
         * Mask Mode
         * @see https://tailwindcss.com/docs/mask-mode
         */
        'mask-mode': [
          {
            mask: ['alpha', 'luminance', 'match'],
          },
        ],
        /**
         * Mask Origin
         * @see https://tailwindcss.com/docs/mask-origin
         */
        'mask-origin': [
          {
            'mask-origin': ['border', 'padding', 'content', 'fill', 'stroke', 'view'],
          },
        ],
        /**
         * Mask Position
         * @see https://tailwindcss.com/docs/mask-position
         */
        'mask-position': [
          {
            mask: de(),
          },
        ],
        /**
         * Mask Repeat
         * @see https://tailwindcss.com/docs/mask-repeat
         */
        'mask-repeat': [
          {
            mask: me(),
          },
        ],
        /**
         * Mask Size
         * @see https://tailwindcss.com/docs/mask-size
         */
        'mask-size': [
          {
            mask: pe(),
          },
        ],
        /**
         * Mask Type
         * @see https://tailwindcss.com/docs/mask-type
         */
        'mask-type': [
          {
            'mask-type': ['alpha', 'luminance'],
          },
        ],
        /**
         * Mask Image
         * @see https://tailwindcss.com/docs/mask-image
         */
        'mask-image': [
          {
            mask: ['none', n, s],
          },
        ],
        // ---------------
        // --- Filters ---
        // ---------------
        /**
         * Filter
         * @see https://tailwindcss.com/docs/filter
         */
        filter: [
          {
            filter: [
              // Deprecated since Tailwind CSS v3.0.0
              '',
              'none',
              n,
              s,
            ],
          },
        ],
        /**
         * Blur
         * @see https://tailwindcss.com/docs/blur
         */
        blur: [
          {
            blur: fe(),
          },
        ],
        /**
         * Brightness
         * @see https://tailwindcss.com/docs/brightness
         */
        brightness: [
          {
            brightness: [p, n, s],
          },
        ],
        /**
         * Contrast
         * @see https://tailwindcss.com/docs/contrast
         */
        contrast: [
          {
            contrast: [p, n, s],
          },
        ],
        /**
         * Drop Shadow
         * @see https://tailwindcss.com/docs/drop-shadow
         */
        'drop-shadow': [
          {
            'drop-shadow': [
              // Deprecated since Tailwind CSS v4.0.0
              '',
              'none',
              I,
              K,
              H,
            ],
          },
        ],
        /**
         * Drop Shadow Color
         * @see https://tailwindcss.com/docs/filter-drop-shadow#setting-the-shadow-color
         */
        'drop-shadow-color': [
          {
            'drop-shadow': l(),
          },
        ],
        /**
         * Grayscale
         * @see https://tailwindcss.com/docs/grayscale
         */
        grayscale: [
          {
            grayscale: ['', p, n, s],
          },
        ],
        /**
         * Hue Rotate
         * @see https://tailwindcss.com/docs/hue-rotate
         */
        'hue-rotate': [
          {
            'hue-rotate': [p, n, s],
          },
        ],
        /**
         * Invert
         * @see https://tailwindcss.com/docs/invert
         */
        invert: [
          {
            invert: ['', p, n, s],
          },
        ],
        /**
         * Saturate
         * @see https://tailwindcss.com/docs/saturate
         */
        saturate: [
          {
            saturate: [p, n, s],
          },
        ],
        /**
         * Sepia
         * @see https://tailwindcss.com/docs/sepia
         */
        sepia: [
          {
            sepia: ['', p, n, s],
          },
        ],
        /**
         * Backdrop Filter
         * @see https://tailwindcss.com/docs/backdrop-filter
         */
        'backdrop-filter': [
          {
            'backdrop-filter': [
              // Deprecated since Tailwind CSS v3.0.0
              '',
              'none',
              n,
              s,
            ],
          },
        ],
        /**
         * Backdrop Blur
         * @see https://tailwindcss.com/docs/backdrop-blur
         */
        'backdrop-blur': [
          {
            'backdrop-blur': fe(),
          },
        ],
        /**
         * Backdrop Brightness
         * @see https://tailwindcss.com/docs/backdrop-brightness
         */
        'backdrop-brightness': [
          {
            'backdrop-brightness': [p, n, s],
          },
        ],
        /**
         * Backdrop Contrast
         * @see https://tailwindcss.com/docs/backdrop-contrast
         */
        'backdrop-contrast': [
          {
            'backdrop-contrast': [p, n, s],
          },
        ],
        /**
         * Backdrop Grayscale
         * @see https://tailwindcss.com/docs/backdrop-grayscale
         */
        'backdrop-grayscale': [
          {
            'backdrop-grayscale': ['', p, n, s],
          },
        ],
        /**
         * Backdrop Hue Rotate
         * @see https://tailwindcss.com/docs/backdrop-hue-rotate
         */
        'backdrop-hue-rotate': [
          {
            'backdrop-hue-rotate': [p, n, s],
          },
        ],
        /**
         * Backdrop Invert
         * @see https://tailwindcss.com/docs/backdrop-invert
         */
        'backdrop-invert': [
          {
            'backdrop-invert': ['', p, n, s],
          },
        ],
        /**
         * Backdrop Opacity
         * @see https://tailwindcss.com/docs/backdrop-opacity
         */
        'backdrop-opacity': [
          {
            'backdrop-opacity': [p, n, s],
          },
        ],
        /**
         * Backdrop Saturate
         * @see https://tailwindcss.com/docs/backdrop-saturate
         */
        'backdrop-saturate': [
          {
            'backdrop-saturate': [p, n, s],
          },
        ],
        /**
         * Backdrop Sepia
         * @see https://tailwindcss.com/docs/backdrop-sepia
         */
        'backdrop-sepia': [
          {
            'backdrop-sepia': ['', p, n, s],
          },
        ],
        // --------------
        // --- Tables ---
        // --------------
        /**
         * Border Collapse
         * @see https://tailwindcss.com/docs/border-collapse
         */
        'border-collapse': [
          {
            border: ['collapse', 'separate'],
          },
        ],
        /**
         * Border Spacing
         * @see https://tailwindcss.com/docs/border-spacing
         */
        'border-spacing': [
          {
            'border-spacing': m(),
          },
        ],
        /**
         * Border Spacing X
         * @see https://tailwindcss.com/docs/border-spacing
         */
        'border-spacing-x': [
          {
            'border-spacing-x': m(),
          },
        ],
        /**
         * Border Spacing Y
         * @see https://tailwindcss.com/docs/border-spacing
         */
        'border-spacing-y': [
          {
            'border-spacing-y': m(),
          },
        ],
        /**
         * Table Layout
         * @see https://tailwindcss.com/docs/table-layout
         */
        'table-layout': [
          {
            table: ['auto', 'fixed'],
          },
        ],
        /**
         * Caption Side
         * @see https://tailwindcss.com/docs/caption-side
         */
        caption: [
          {
            caption: ['top', 'bottom'],
          },
        ],
        // ---------------------------------
        // --- Transitions and Animation ---
        // ---------------------------------
        /**
         * Transition Property
         * @see https://tailwindcss.com/docs/transition-property
         */
        transition: [
          {
            transition: ['', 'all', 'colors', 'opacity', 'shadow', 'transform', 'none', n, s],
          },
        ],
        /**
         * Transition Behavior
         * @see https://tailwindcss.com/docs/transition-behavior
         */
        'transition-behavior': [
          {
            transition: ['normal', 'discrete'],
          },
        ],
        /**
         * Transition Duration
         * @see https://tailwindcss.com/docs/transition-duration
         */
        duration: [
          {
            duration: [p, 'initial', n, s],
          },
        ],
        /**
         * Transition Timing Function
         * @see https://tailwindcss.com/docs/transition-timing-function
         */
        ease: [
          {
            ease: ['linear', 'initial', P, n, s],
          },
        ],
        /**
         * Transition Delay
         * @see https://tailwindcss.com/docs/transition-delay
         */
        delay: [
          {
            delay: [p, n, s],
          },
        ],
        /**
         * Animation
         * @see https://tailwindcss.com/docs/animation
         */
        animate: [
          {
            animate: ['none', W, n, s],
          },
        ],
        // ------------------
        // --- Transforms ---
        // ------------------
        /**
         * Backface Visibility
         * @see https://tailwindcss.com/docs/backface-visibility
         */
        backface: [
          {
            backface: ['hidden', 'visible'],
          },
        ],
        /**
         * Perspective
         * @see https://tailwindcss.com/docs/perspective
         */
        perspective: [
          {
            perspective: [v, n, s],
          },
        ],
        /**
         * Perspective Origin
         * @see https://tailwindcss.com/docs/perspective-origin
         */
        'perspective-origin': [
          {
            'perspective-origin': j(),
          },
        ],
        /**
         * Rotate
         * @see https://tailwindcss.com/docs/rotate
         */
        rotate: [
          {
            rotate: q(),
          },
        ],
        /**
         * Rotate X
         * @see https://tailwindcss.com/docs/rotate
         */
        'rotate-x': [
          {
            'rotate-x': q(),
          },
        ],
        /**
         * Rotate Y
         * @see https://tailwindcss.com/docs/rotate
         */
        'rotate-y': [
          {
            'rotate-y': q(),
          },
        ],
        /**
         * Rotate Z
         * @see https://tailwindcss.com/docs/rotate
         */
        'rotate-z': [
          {
            'rotate-z': q(),
          },
        ],
        /**
         * Scale
         * @see https://tailwindcss.com/docs/scale
         */
        scale: [
          {
            scale: X(),
          },
        ],
        /**
         * Scale X
         * @see https://tailwindcss.com/docs/scale
         */
        'scale-x': [
          {
            'scale-x': X(),
          },
        ],
        /**
         * Scale Y
         * @see https://tailwindcss.com/docs/scale
         */
        'scale-y': [
          {
            'scale-y': X(),
          },
        ],
        /**
         * Scale Z
         * @see https://tailwindcss.com/docs/scale
         */
        'scale-z': [
          {
            'scale-z': X(),
          },
        ],
        /**
         * Scale 3D
         * @see https://tailwindcss.com/docs/scale
         */
        'scale-3d': ['scale-3d'],
        /**
         * Skew
         * @see https://tailwindcss.com/docs/skew
         */
        skew: [
          {
            skew: te(),
          },
        ],
        /**
         * Skew X
         * @see https://tailwindcss.com/docs/skew
         */
        'skew-x': [
          {
            'skew-x': te(),
          },
        ],
        /**
         * Skew Y
         * @see https://tailwindcss.com/docs/skew
         */
        'skew-y': [
          {
            'skew-y': te(),
          },
        ],
        /**
         * Transform
         * @see https://tailwindcss.com/docs/transform
         */
        transform: [
          {
            transform: [n, s, '', 'none', 'gpu', 'cpu'],
          },
        ],
        /**
         * Transform Origin
         * @see https://tailwindcss.com/docs/transform-origin
         */
        'transform-origin': [
          {
            origin: j(),
          },
        ],
        /**
         * Transform Style
         * @see https://tailwindcss.com/docs/transform-style
         */
        'transform-style': [
          {
            transform: ['3d', 'flat'],
          },
        ],
        /**
         * Translate
         * @see https://tailwindcss.com/docs/translate
         */
        translate: [
          {
            translate: J(),
          },
        ],
        /**
         * Translate X
         * @see https://tailwindcss.com/docs/translate
         */
        'translate-x': [
          {
            'translate-x': J(),
          },
        ],
        /**
         * Translate Y
         * @see https://tailwindcss.com/docs/translate
         */
        'translate-y': [
          {
            'translate-y': J(),
          },
        ],
        /**
         * Translate Z
         * @see https://tailwindcss.com/docs/translate
         */
        'translate-z': [
          {
            'translate-z': J(),
          },
        ],
        /**
         * Translate None
         * @see https://tailwindcss.com/docs/translate
         */
        'translate-none': ['translate-none'],
        // ---------------------
        // --- Interactivity ---
        // ---------------------
        /**
         * Accent Color
         * @see https://tailwindcss.com/docs/accent-color
         */
        accent: [
          {
            accent: l(),
          },
        ],
        /**
         * Appearance
         * @see https://tailwindcss.com/docs/appearance
         */
        appearance: [
          {
            appearance: ['none', 'auto'],
          },
        ],
        /**
         * Caret Color
         * @see https://tailwindcss.com/docs/just-in-time-mode#caret-color-utilities
         */
        'caret-color': [
          {
            caret: l(),
          },
        ],
        /**
         * Color Scheme
         * @see https://tailwindcss.com/docs/color-scheme
         */
        'color-scheme': [
          {
            scheme: ['normal', 'dark', 'light', 'light-dark', 'only-dark', 'only-light'],
          },
        ],
        /**
         * Cursor
         * @see https://tailwindcss.com/docs/cursor
         */
        cursor: [
          {
            cursor: [
              'auto',
              'default',
              'pointer',
              'wait',
              'text',
              'move',
              'help',
              'not-allowed',
              'none',
              'context-menu',
              'progress',
              'cell',
              'crosshair',
              'vertical-text',
              'alias',
              'copy',
              'no-drop',
              'grab',
              'grabbing',
              'all-scroll',
              'col-resize',
              'row-resize',
              'n-resize',
              'e-resize',
              's-resize',
              'w-resize',
              'ne-resize',
              'nw-resize',
              'se-resize',
              'sw-resize',
              'ew-resize',
              'ns-resize',
              'nesw-resize',
              'nwse-resize',
              'zoom-in',
              'zoom-out',
              n,
              s,
            ],
          },
        ],
        /**
         * Field Sizing
         * @see https://tailwindcss.com/docs/field-sizing
         */
        'field-sizing': [
          {
            'field-sizing': ['fixed', 'content'],
          },
        ],
        /**
         * Pointer Events
         * @see https://tailwindcss.com/docs/pointer-events
         */
        'pointer-events': [
          {
            'pointer-events': ['auto', 'none'],
          },
        ],
        /**
         * Resize
         * @see https://tailwindcss.com/docs/resize
         */
        resize: [
          {
            resize: ['none', '', 'y', 'x'],
          },
        ],
        /**
         * Scroll Behavior
         * @see https://tailwindcss.com/docs/scroll-behavior
         */
        'scroll-behavior': [
          {
            scroll: ['auto', 'smooth'],
          },
        ],
        /**
         * Scroll Margin
         * @see https://tailwindcss.com/docs/scroll-margin
         */
        'scroll-m': [
          {
            'scroll-m': m(),
          },
        ],
        /**
         * Scroll Margin X
         * @see https://tailwindcss.com/docs/scroll-margin
         */
        'scroll-mx': [
          {
            'scroll-mx': m(),
          },
        ],
        /**
         * Scroll Margin Y
         * @see https://tailwindcss.com/docs/scroll-margin
         */
        'scroll-my': [
          {
            'scroll-my': m(),
          },
        ],
        /**
         * Scroll Margin Start
         * @see https://tailwindcss.com/docs/scroll-margin
         */
        'scroll-ms': [
          {
            'scroll-ms': m(),
          },
        ],
        /**
         * Scroll Margin End
         * @see https://tailwindcss.com/docs/scroll-margin
         */
        'scroll-me': [
          {
            'scroll-me': m(),
          },
        ],
        /**
         * Scroll Margin Top
         * @see https://tailwindcss.com/docs/scroll-margin
         */
        'scroll-mt': [
          {
            'scroll-mt': m(),
          },
        ],
        /**
         * Scroll Margin Right
         * @see https://tailwindcss.com/docs/scroll-margin
         */
        'scroll-mr': [
          {
            'scroll-mr': m(),
          },
        ],
        /**
         * Scroll Margin Bottom
         * @see https://tailwindcss.com/docs/scroll-margin
         */
        'scroll-mb': [
          {
            'scroll-mb': m(),
          },
        ],
        /**
         * Scroll Margin Left
         * @see https://tailwindcss.com/docs/scroll-margin
         */
        'scroll-ml': [
          {
            'scroll-ml': m(),
          },
        ],
        /**
         * Scroll Padding
         * @see https://tailwindcss.com/docs/scroll-padding
         */
        'scroll-p': [
          {
            'scroll-p': m(),
          },
        ],
        /**
         * Scroll Padding X
         * @see https://tailwindcss.com/docs/scroll-padding
         */
        'scroll-px': [
          {
            'scroll-px': m(),
          },
        ],
        /**
         * Scroll Padding Y
         * @see https://tailwindcss.com/docs/scroll-padding
         */
        'scroll-py': [
          {
            'scroll-py': m(),
          },
        ],
        /**
         * Scroll Padding Start
         * @see https://tailwindcss.com/docs/scroll-padding
         */
        'scroll-ps': [
          {
            'scroll-ps': m(),
          },
        ],
        /**
         * Scroll Padding End
         * @see https://tailwindcss.com/docs/scroll-padding
         */
        'scroll-pe': [
          {
            'scroll-pe': m(),
          },
        ],
        /**
         * Scroll Padding Top
         * @see https://tailwindcss.com/docs/scroll-padding
         */
        'scroll-pt': [
          {
            'scroll-pt': m(),
          },
        ],
        /**
         * Scroll Padding Right
         * @see https://tailwindcss.com/docs/scroll-padding
         */
        'scroll-pr': [
          {
            'scroll-pr': m(),
          },
        ],
        /**
         * Scroll Padding Bottom
         * @see https://tailwindcss.com/docs/scroll-padding
         */
        'scroll-pb': [
          {
            'scroll-pb': m(),
          },
        ],
        /**
         * Scroll Padding Left
         * @see https://tailwindcss.com/docs/scroll-padding
         */
        'scroll-pl': [
          {
            'scroll-pl': m(),
          },
        ],
        /**
         * Scroll Snap Align
         * @see https://tailwindcss.com/docs/scroll-snap-align
         */
        'snap-align': [
          {
            snap: ['start', 'end', 'center', 'align-none'],
          },
        ],
        /**
         * Scroll Snap Stop
         * @see https://tailwindcss.com/docs/scroll-snap-stop
         */
        'snap-stop': [
          {
            snap: ['normal', 'always'],
          },
        ],
        /**
         * Scroll Snap Type
         * @see https://tailwindcss.com/docs/scroll-snap-type
         */
        'snap-type': [
          {
            snap: ['none', 'x', 'y', 'both'],
          },
        ],
        /**
         * Scroll Snap Type Strictness
         * @see https://tailwindcss.com/docs/scroll-snap-type
         */
        'snap-strictness': [
          {
            snap: ['mandatory', 'proximity'],
          },
        ],
        /**
         * Touch Action
         * @see https://tailwindcss.com/docs/touch-action
         */
        touch: [
          {
            touch: ['auto', 'none', 'manipulation'],
          },
        ],
        /**
         * Touch Action X
         * @see https://tailwindcss.com/docs/touch-action
         */
        'touch-x': [
          {
            'touch-pan': ['x', 'left', 'right'],
          },
        ],
        /**
         * Touch Action Y
         * @see https://tailwindcss.com/docs/touch-action
         */
        'touch-y': [
          {
            'touch-pan': ['y', 'up', 'down'],
          },
        ],
        /**
         * Touch Action Pinch Zoom
         * @see https://tailwindcss.com/docs/touch-action
         */
        'touch-pz': ['touch-pinch-zoom'],
        /**
         * User Select
         * @see https://tailwindcss.com/docs/user-select
         */
        select: [
          {
            select: ['none', 'text', 'all', 'auto'],
          },
        ],
        /**
         * Will Change
         * @see https://tailwindcss.com/docs/will-change
         */
        'will-change': [
          {
            'will-change': ['auto', 'scroll', 'contents', 'transform', n, s],
          },
        ],
        // -----------
        // --- SVG ---
        // -----------
        /**
         * Fill
         * @see https://tailwindcss.com/docs/fill
         */
        fill: [
          {
            fill: ['none', ...l()],
          },
        ],
        /**
         * Stroke Width
         * @see https://tailwindcss.com/docs/stroke-width
         */
        'stroke-w': [
          {
            stroke: [p, _, N, re],
          },
        ],
        /**
         * Stroke
         * @see https://tailwindcss.com/docs/stroke
         */
        stroke: [
          {
            stroke: ['none', ...l()],
          },
        ],
        // ---------------------
        // --- Accessibility ---
        // ---------------------
        /**
         * Forced Color Adjust
         * @see https://tailwindcss.com/docs/forced-color-adjust
         */
        'forced-color-adjust': [
          {
            'forced-color-adjust': ['auto', 'none'],
          },
        ],
      },
      conflictingClassGroups: {
        overflow: ['overflow-x', 'overflow-y'],
        overscroll: ['overscroll-x', 'overscroll-y'],
        inset: ['inset-x', 'inset-y', 'start', 'end', 'top', 'right', 'bottom', 'left'],
        'inset-x': ['right', 'left'],
        'inset-y': ['top', 'bottom'],
        flex: ['basis', 'grow', 'shrink'],
        gap: ['gap-x', 'gap-y'],
        p: ['px', 'py', 'ps', 'pe', 'pt', 'pr', 'pb', 'pl'],
        px: ['pr', 'pl'],
        py: ['pt', 'pb'],
        m: ['mx', 'my', 'ms', 'me', 'mt', 'mr', 'mb', 'ml'],
        mx: ['mr', 'ml'],
        my: ['mt', 'mb'],
        size: ['w', 'h'],
        'font-size': ['leading'],
        'fvn-normal': [
          'fvn-ordinal',
          'fvn-slashed-zero',
          'fvn-figure',
          'fvn-spacing',
          'fvn-fraction',
        ],
        'fvn-ordinal': ['fvn-normal'],
        'fvn-slashed-zero': ['fvn-normal'],
        'fvn-figure': ['fvn-normal'],
        'fvn-spacing': ['fvn-normal'],
        'fvn-fraction': ['fvn-normal'],
        'line-clamp': ['display', 'overflow'],
        rounded: [
          'rounded-s',
          'rounded-e',
          'rounded-t',
          'rounded-r',
          'rounded-b',
          'rounded-l',
          'rounded-ss',
          'rounded-se',
          'rounded-ee',
          'rounded-es',
          'rounded-tl',
          'rounded-tr',
          'rounded-br',
          'rounded-bl',
        ],
        'rounded-s': ['rounded-ss', 'rounded-es'],
        'rounded-e': ['rounded-se', 'rounded-ee'],
        'rounded-t': ['rounded-tl', 'rounded-tr'],
        'rounded-r': ['rounded-tr', 'rounded-br'],
        'rounded-b': ['rounded-br', 'rounded-bl'],
        'rounded-l': ['rounded-tl', 'rounded-bl'],
        'border-spacing': ['border-spacing-x', 'border-spacing-y'],
        'border-w': [
          'border-w-x',
          'border-w-y',
          'border-w-s',
          'border-w-e',
          'border-w-t',
          'border-w-r',
          'border-w-b',
          'border-w-l',
        ],
        'border-w-x': ['border-w-r', 'border-w-l'],
        'border-w-y': ['border-w-t', 'border-w-b'],
        'border-color': [
          'border-color-x',
          'border-color-y',
          'border-color-s',
          'border-color-e',
          'border-color-t',
          'border-color-r',
          'border-color-b',
          'border-color-l',
        ],
        'border-color-x': ['border-color-r', 'border-color-l'],
        'border-color-y': ['border-color-t', 'border-color-b'],
        translate: ['translate-x', 'translate-y', 'translate-none'],
        'translate-none': ['translate', 'translate-x', 'translate-y', 'translate-z'],
        'scroll-m': [
          'scroll-mx',
          'scroll-my',
          'scroll-ms',
          'scroll-me',
          'scroll-mt',
          'scroll-mr',
          'scroll-mb',
          'scroll-ml',
        ],
        'scroll-mx': ['scroll-mr', 'scroll-ml'],
        'scroll-my': ['scroll-mt', 'scroll-mb'],
        'scroll-p': [
          'scroll-px',
          'scroll-py',
          'scroll-ps',
          'scroll-pe',
          'scroll-pt',
          'scroll-pr',
          'scroll-pb',
          'scroll-pl',
        ],
        'scroll-px': ['scroll-pr', 'scroll-pl'],
        'scroll-py': ['scroll-pt', 'scroll-pb'],
        touch: ['touch-x', 'touch-y', 'touch-pz'],
        'touch-x': ['touch'],
        'touch-y': ['touch'],
        'touch-pz': ['touch'],
      },
      conflictingClassGroupModifiers: {
        'font-size': ['leading'],
      },
      orderSensitiveModifiers: [
        '*',
        '**',
        'after',
        'backdrop',
        'before',
        'details-content',
        'file',
        'first-letter',
        'first-line',
        'marker',
        'placeholder',
        'selection',
      ],
    }
  },
  Tt = /* @__PURE__ */ ct(It)
function Ee(...e) {
  return Tt(Be(e))
}
function Pt({ to: e, icon: o, label: r, onClick: t, variant: a = 'default' }) {
  return /* @__PURE__ */ ye(Fe, {
    to: e,
    onClick: t,
    className: Ee(
      'flex items-center gap-2 rounded-lg px-4 py-2 transition-colors',
      {
        default: 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700',
        danger: 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20',
      }[a],
    ),
    children: [
      /* @__PURE__ */ z(o, { className: 'h-5 w-5' }),
      /* @__PURE__ */ z('span', { children: r }),
    ],
  })
}
function Mt({ onNavigate: e }) {
  const { t: o } = Ve('gift-plugin')
  return /* @__PURE__ */ z(Pt, {
    to: '/gift-lists',
    icon: De,
    label: o('sidebar', 'Gifts'),
    onClick: e,
  })
}
function we({ className: e, ...o }) {
  return /* @__PURE__ */ z('div', { className: Ee('animate-pulse rounded-md bg-muted', e), ...o })
}
function Lt() {
  return /* @__PURE__ */ ye('div', {
    className: 'space-y-4 p-6',
    children: [
      /* @__PURE__ */ z(we, { className: 'h-10 w-48' }),
      /* @__PURE__ */ z('div', {
        className: 'grid gap-4 md:grid-cols-2 lg:grid-cols-3',
        children: [1, 2, 3].map((e) => /* @__PURE__ */ z(we, { className: 'h-32' }, e)),
      }),
    ],
  })
}
let ne = null
const Nt = (e) => {
    ne = e
  },
  ro = () => {
    if (!ne) throw new Error('API client not initialized. Ensure plugin is registered.')
    return ne
  },
  Et = 'Gift Lists',
  jt = 'Gifts',
  Ot = { addList: 'Add List', edit: 'Edit', delete: 'Delete' },
  Vt = {
    createTitle: 'Create Gift List',
    editTitle: 'Edit Gift List',
    createDescription: 'Fill in the details to create a new gift list.',
    editDescription: 'Update the details of your gift list.',
  },
  Dt = { name: 'Name', description: 'Description', eventDate: 'Event Date' },
  Ft = 'This action cannot be undone. This will permanently delete the gift list.',
  $t = { generic: 'An error occurred while saving.' },
  Bt = {
    title: Et,
    sidebar: jt,
    actions: Ot,
    dialog: Vt,
    fields: Dt,
    deleteConfirm: Ft,
    error: $t,
  },
  _t = 'Списки подарков',
  Wt = 'Подарки',
  Ut = { addList: 'Добавить список', edit: 'Редактировать', delete: 'Удалить' },
  Yt = {
    createTitle: 'Создать список подарков',
    editTitle: 'Редактировать список подарков',
    createDescription: 'Заполните детали для создания нового списка подарков.',
    editDescription: 'Обновите детали вашего списка подарков.',
  },
  qt = { name: 'Название', description: 'Описание', eventDate: 'Дата события' },
  Xt = 'Это действие нельзя отменить. Список подарков будет удален безвозвратно.',
  Jt = { generic: 'Произошла ошибка при сохранении.' },
  Ht = {
    title: _t,
    sidebar: Wt,
    actions: Ut,
    dialog: Yt,
    fields: qt,
    deleteConfirm: Xt,
    error: Jt,
  },
  Kt = je(() => import('./GiftListsPage-DL7EsLUo.js'))
class so extends $e {
  name = 'gift-plugin'
  register(o) {
    ;(this.registerTranslations({ en: Bt, ru: Ht }, o.i18n), Nt(o.api))
    const { routeRegistry: r, sidebarRegistry: t } = o
    ;(r.register('dashboard', {
      path: '/gift-lists',
      element: /* @__PURE__ */ z(Oe, {
        fallback: /* @__PURE__ */ z(Lt, {}),
        children: /* @__PURE__ */ z(Kt, {}),
      }),
    }),
      t.register({
        id: 'gifts',
        component: Mt,
        order: 60,
        // After contacts
      }))
  }
}
export { so as G, we as S, Ee as a, Be as c, ro as g }
