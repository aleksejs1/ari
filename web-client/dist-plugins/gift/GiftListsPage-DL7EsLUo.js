import { jsx as E, jsxs as H, Fragment as jr } from 'react/jsx-runtime'
import * as p from 'react'
import $, { useState as gt, useEffect as la } from 'react'
import { useTranslation as es } from 'react-i18next'
import { X as da, AlertCircle as fa, Plus as pa, Edit as ha, Trash2 as ma } from 'lucide-react'
import { c as ga, a as K, g as rn, S as Ur } from './index-DKRGnZVP.js'
import * as ya from 'react-dom'
import va from 'react-dom'
import { useQuery as ba, useQueryClient as nr, useMutation as rr } from '@tanstack/react-query'
function Mr(e, t) {
  if (typeof e == 'function') return e(t)
  e != null && (e.current = t)
}
function on(...e) {
  return (t) => {
    let n = !1
    const r = e.map((o) => {
      const s = Mr(o, t)
      return (!n && typeof s == 'function' && (n = !0), s)
    })
    if (n)
      return () => {
        for (let o = 0; o < r.length; o++) {
          const s = r[o]
          typeof s == 'function' ? s() : Mr(e[o], null)
        }
      }
  }
}
function Xe(...e) {
  return p.useCallback(on(...e), e)
}
var _a = /* @__PURE__ */ Symbol.for('react.lazy'),
  qt = p[' use '.trim().toString()]
function wa(e) {
  return typeof e == 'object' && e !== null && 'then' in e
}
function ts(e) {
  return (
    e != null &&
    typeof e == 'object' &&
    '$$typeof' in e &&
    e.$$typeof === _a &&
    '_payload' in e &&
    wa(e._payload)
  )
}
// @__NO_SIDE_EFFECTS__
function ns(e) {
  const t = /* @__PURE__ */ Ea(e),
    n = p.forwardRef((r, o) => {
      let { children: s, ...i } = r
      ts(s) && typeof qt == 'function' && (s = qt(s._payload))
      const a = p.Children.toArray(s),
        u = a.find(Oa)
      if (u) {
        const c = u.props.children,
          l = a.map((d) =>
            d === u
              ? p.Children.count(c) > 1
                ? p.Children.only(null)
                : p.isValidElement(c)
                  ? c.props.children
                  : null
              : d,
          )
        return /* @__PURE__ */ E(t, {
          ...i,
          ref: o,
          children: p.isValidElement(c) ? p.cloneElement(c, void 0, l) : null,
        })
      }
      return /* @__PURE__ */ E(t, { ...i, ref: o, children: s })
    })
  return ((n.displayName = `${e}.Slot`), n)
}
var rs = /* @__PURE__ */ ns('Slot')
// @__NO_SIDE_EFFECTS__
function Ea(e) {
  const t = p.forwardRef((n, r) => {
    let { children: o, ...s } = n
    if ((ts(o) && typeof qt == 'function' && (o = qt(o._payload)), p.isValidElement(o))) {
      const i = ka(o),
        a = Ca(s, o.props)
      return (o.type !== p.Fragment && (a.ref = r ? on(r, i) : i), p.cloneElement(o, a))
    }
    return p.Children.count(o) > 1 ? p.Children.only(null) : null
  })
  return ((t.displayName = `${e}.SlotClone`), t)
}
var Sa = /* @__PURE__ */ Symbol('radix.slottable')
function Oa(e) {
  return (
    p.isValidElement(e) &&
    typeof e.type == 'function' &&
    '__radixId' in e.type &&
    e.type.__radixId === Sa
  )
}
function Ca(e, t) {
  const n = { ...t }
  for (const r in t) {
    const o = e[r],
      s = t[r]
    ;/^on[A-Z]/.test(r)
      ? o && s
        ? (n[r] = (...a) => {
            const u = s(...a)
            return (o(...a), u)
          })
        : o && (n[r] = o)
      : r === 'style'
        ? (n[r] = { ...o, ...s })
        : r === 'className' && (n[r] = [o, s].filter(Boolean).join(' '))
  }
  return { ...e, ...n }
}
function ka(e) {
  let t = Object.getOwnPropertyDescriptor(e.props, 'ref')?.get,
    n = t && 'isReactWarning' in t && t.isReactWarning
  return n
    ? e.ref
    : ((t = Object.getOwnPropertyDescriptor(e, 'ref')?.get),
      (n = t && 'isReactWarning' in t && t.isReactWarning),
      n ? e.props.ref : e.props.ref || e.ref)
}
const Br = (e) => (typeof e == 'boolean' ? `${e}` : e === 0 ? '0' : e),
  Wr = ga,
  or = (e, t) => (n) => {
    var r
    if (t?.variants == null) return Wr(e, n?.class, n?.className)
    const { variants: o, defaultVariants: s } = t,
      i = Object.keys(o).map((c) => {
        const l = n?.[c],
          d = s?.[c]
        if (l === null) return null
        const m = Br(l) || Br(d)
        return o[c][m]
      }),
      a =
        n &&
        Object.entries(n).reduce((c, l) => {
          let [d, m] = l
          return (m === void 0 || (c[d] = m), c)
        }, {}),
      u =
        t == null || (r = t.compoundVariants) === null || r === void 0
          ? void 0
          : r.reduce((c, l) => {
              let { class: d, className: m, ...v } = l
              return Object.entries(v).every((h) => {
                let [g, _] = h
                return Array.isArray(_)
                  ? _.includes(
                      {
                        ...s,
                        ...a,
                      }[g],
                    )
                  : {
                      ...s,
                      ...a,
                    }[g] === _
              })
                ? [...c, d, m]
                : c
            }, [])
    return Wr(e, i, u, n?.class, n?.className)
  },
  Ra = or(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
    {
      variants: {
        variant: {
          default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
          destructive:
            'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
          outline:
            'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
          secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
          ghost: 'hover:bg-accent hover:text-accent-foreground',
          link: 'text-primary underline-offset-4 hover:underline',
        },
        size: {
          default: 'h-9 px-4 py-2',
          sm: 'h-8 rounded-md px-3 text-xs',
          lg: 'h-10 rounded-md px-8',
          icon: 'h-9 w-9',
        },
      },
      defaultVariants: {
        variant: 'default',
        size: 'default',
      },
    },
  ),
  Ie = p.forwardRef(({ className: e, variant: t, size: n, asChild: r = !1, ...o }, s) =>
    /* @__PURE__ */ E(r ? rs : 'button', {
      className: K(Ra({ variant: t, size: n, className: e })),
      ref: s,
      ...o,
    }),
  )
Ie.displayName = 'Button'
const os = p.forwardRef(({ className: e, ...t }, n) =>
  /* @__PURE__ */ E('div', {
    ref: n,
    className: K('rounded-xl border bg-card text-card-foreground shadow', e),
    ...t,
  }),
)
os.displayName = 'Card'
const ss = p.forwardRef(({ className: e, ...t }, n) =>
  /* @__PURE__ */ E('div', { ref: n, className: K('flex flex-col space-y-1.5 p-6', e), ...t }),
)
ss.displayName = 'CardHeader'
const is = p.forwardRef(({ className: e, ...t }, n) =>
  /* @__PURE__ */ E('div', {
    ref: n,
    className: K('font-semibold leading-none tracking-tight', e),
    ...t,
  }),
)
is.displayName = 'CardTitle'
const Aa = p.forwardRef(({ className: e, ...t }, n) =>
  /* @__PURE__ */ E('div', { ref: n, className: K('text-sm text-muted-foreground', e), ...t }),
)
Aa.displayName = 'CardDescription'
const as = p.forwardRef(({ className: e, ...t }, n) =>
  /* @__PURE__ */ E('div', { ref: n, className: K('p-6 pt-0', e), ...t }),
)
as.displayName = 'CardContent'
const Na = p.forwardRef(({ className: e, ...t }, n) =>
  /* @__PURE__ */ E('div', { ref: n, className: K('flex items-center p-6 pt-0', e), ...t }),
)
Na.displayName = 'CardFooter'
function Le(e, t, { checkForDefaultPrevented: n = !0 } = {}) {
  return function (o) {
    if ((e?.(o), n === !1 || !o.defaultPrevented)) return t?.(o)
  }
}
function Pa(e, t) {
  const n = p.createContext(t),
    r = (s) => {
      const { children: i, ...a } = s,
        u = p.useMemo(() => a, Object.values(a))
      return /* @__PURE__ */ E(n.Provider, { value: u, children: i })
    }
  r.displayName = e + 'Provider'
  function o(s) {
    const i = p.useContext(n)
    if (i) return i
    if (t !== void 0) return t
    throw new Error(`\`${s}\` must be used within \`${e}\``)
  }
  return [r, o]
}
function Ta(e, t = []) {
  let n = []
  function r(s, i) {
    const a = p.createContext(i),
      u = n.length
    n = [...n, i]
    const c = (d) => {
      const { scope: m, children: v, ...h } = d,
        g = m?.[e]?.[u] || a,
        _ = p.useMemo(() => h, Object.values(h))
      return /* @__PURE__ */ E(g.Provider, { value: _, children: v })
    }
    c.displayName = s + 'Provider'
    function l(d, m) {
      const v = m?.[e]?.[u] || a,
        h = p.useContext(v)
      if (h) return h
      if (i !== void 0) return i
      throw new Error(`\`${d}\` must be used within \`${s}\``)
    }
    return [c, l]
  }
  const o = () => {
    const s = n.map((i) => p.createContext(i))
    return function (a) {
      const u = a?.[e] || s
      return p.useMemo(() => ({ [`__scope${e}`]: { ...a, [e]: u } }), [a, u])
    }
  }
  return ((o.scopeName = e), [r, xa(o, ...t)])
}
function xa(...e) {
  const t = e[0]
  if (e.length === 1) return t
  const n = () => {
    const r = e.map((o) => ({
      useScope: o(),
      scopeName: o.scopeName,
    }))
    return function (s) {
      const i = r.reduce((a, { useScope: u, scopeName: c }) => {
        const d = u(s)[`__scope${c}`]
        return { ...a, ...d }
      }, {})
      return p.useMemo(() => ({ [`__scope${t.scopeName}`]: i }), [i])
    }
  }
  return ((n.scopeName = t.scopeName), n)
}
var bt = globalThis?.document ? p.useLayoutEffect : () => {},
  Da = p[' useId '.trim().toString()] || (() => {}),
  za = 0
function An(e) {
  const [t, n] = p.useState(Da())
  return (
    bt(() => {
      n((r) => r ?? String(za++))
    }, [e]),
    e || (t ? `radix-${t}` : '')
  )
}
var $a = p[' useInsertionEffect '.trim().toString()] || bt
function Fa({ prop: e, defaultProp: t, onChange: n = () => {}, caller: r }) {
  const [o, s, i] = Ia({
      defaultProp: t,
      onChange: n,
    }),
    a = e !== void 0,
    u = a ? e : o
  {
    const l = p.useRef(e !== void 0)
    p.useEffect(() => {
      const d = l.current
      ;(d !== a &&
        console.warn(
          `${r} is changing from ${d ? 'controlled' : 'uncontrolled'} to ${a ? 'controlled' : 'uncontrolled'}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`,
        ),
        (l.current = a))
    }, [a, r])
  }
  const c = p.useCallback(
    (l) => {
      if (a) {
        const d = La(l) ? l(e) : l
        d !== e && i.current?.(d)
      } else s(l)
    },
    [a, e, s, i],
  )
  return [u, c]
}
function Ia({ defaultProp: e, onChange: t }) {
  const [n, r] = p.useState(e),
    o = p.useRef(n),
    s = p.useRef(t)
  return (
    $a(() => {
      s.current = t
    }, [t]),
    p.useEffect(() => {
      o.current !== n && (s.current?.(n), (o.current = n))
    }, [n, o]),
    [n, r, s]
  )
}
function La(e) {
  return typeof e == 'function'
}
// @__NO_SIDE_EFFECTS__
function Va(e) {
  const t = /* @__PURE__ */ Za(e),
    n = p.forwardRef((r, o) => {
      const { children: s, ...i } = r,
        a = p.Children.toArray(s),
        u = a.find(Ua)
      if (u) {
        const c = u.props.children,
          l = a.map((d) =>
            d === u
              ? p.Children.count(c) > 1
                ? p.Children.only(null)
                : p.isValidElement(c)
                  ? c.props.children
                  : null
              : d,
          )
        return /* @__PURE__ */ E(t, {
          ...i,
          ref: o,
          children: p.isValidElement(c) ? p.cloneElement(c, void 0, l) : null,
        })
      }
      return /* @__PURE__ */ E(t, { ...i, ref: o, children: s })
    })
  return ((n.displayName = `${e}.Slot`), n)
}
// @__NO_SIDE_EFFECTS__
function Za(e) {
  const t = p.forwardRef((n, r) => {
    const { children: o, ...s } = n
    if (p.isValidElement(o)) {
      const i = Ba(o),
        a = Ma(s, o.props)
      return (o.type !== p.Fragment && (a.ref = r ? on(r, i) : i), p.cloneElement(o, a))
    }
    return p.Children.count(o) > 1 ? p.Children.only(null) : null
  })
  return ((t.displayName = `${e}.SlotClone`), t)
}
var ja = /* @__PURE__ */ Symbol('radix.slottable')
function Ua(e) {
  return (
    p.isValidElement(e) &&
    typeof e.type == 'function' &&
    '__radixId' in e.type &&
    e.type.__radixId === ja
  )
}
function Ma(e, t) {
  const n = { ...t }
  for (const r in t) {
    const o = e[r],
      s = t[r]
    ;/^on[A-Z]/.test(r)
      ? o && s
        ? (n[r] = (...a) => {
            const u = s(...a)
            return (o(...a), u)
          })
        : o && (n[r] = o)
      : r === 'style'
        ? (n[r] = { ...o, ...s })
        : r === 'className' && (n[r] = [o, s].filter(Boolean).join(' '))
  }
  return { ...e, ...n }
}
function Ba(e) {
  let t = Object.getOwnPropertyDescriptor(e.props, 'ref')?.get,
    n = t && 'isReactWarning' in t && t.isReactWarning
  return n
    ? e.ref
    : ((t = Object.getOwnPropertyDescriptor(e, 'ref')?.get),
      (n = t && 'isReactWarning' in t && t.isReactWarning),
      n ? e.props.ref : e.props.ref || e.ref)
}
var Wa = [
    'a',
    'button',
    'div',
    'form',
    'h2',
    'h3',
    'img',
    'input',
    'label',
    'li',
    'nav',
    'ol',
    'p',
    'select',
    'span',
    'svg',
    'ul',
  ],
  De = Wa.reduce((e, t) => {
    const n = /* @__PURE__ */ Va(`Primitive.${t}`),
      r = p.forwardRef((o, s) => {
        const { asChild: i, ...a } = o,
          u = i ? n : t
        return (
          typeof window < 'u' && (window[/* @__PURE__ */ Symbol.for('radix-ui')] = !0),
          /* @__PURE__ */ E(u, { ...a, ref: s })
        )
      })
    return ((r.displayName = `Primitive.${t}`), { ...e, [t]: r })
  }, {})
function Ha(e, t) {
  e && ya.flushSync(() => e.dispatchEvent(t))
}
function _t(e) {
  const t = p.useRef(e)
  return (
    p.useEffect(() => {
      t.current = e
    }),
    p.useMemo(
      () =>
        (...n) =>
          t.current?.(...n),
      [],
    )
  )
}
function qa(e, t = globalThis?.document) {
  const n = _t(e)
  p.useEffect(() => {
    const r = (o) => {
      o.key === 'Escape' && n(o)
    }
    return (
      t.addEventListener('keydown', r, { capture: !0 }),
      () => t.removeEventListener('keydown', r, { capture: !0 })
    )
  }, [n, t])
}
var Ja = 'DismissableLayer',
  Un = 'dismissableLayer.update',
  Ka = 'dismissableLayer.pointerDownOutside',
  Ga = 'dismissableLayer.focusOutside',
  Hr,
  cs = p.createContext({
    layers: /* @__PURE__ */ new Set(),
    layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
    branches: /* @__PURE__ */ new Set(),
  }),
  us = p.forwardRef((e, t) => {
    const {
        disableOutsidePointerEvents: n = !1,
        onEscapeKeyDown: r,
        onPointerDownOutside: o,
        onFocusOutside: s,
        onInteractOutside: i,
        onDismiss: a,
        ...u
      } = e,
      c = p.useContext(cs),
      [l, d] = p.useState(null),
      m = l?.ownerDocument ?? globalThis?.document,
      [, v] = p.useState({}),
      h = Xe(t, (z) => d(z)),
      g = Array.from(c.layers),
      [_] = [...c.layersWithOutsidePointerEventsDisabled].slice(-1),
      P = g.indexOf(_),
      A = l ? g.indexOf(l) : -1,
      x = c.layersWithOutsidePointerEventsDisabled.size > 0,
      O = A >= P,
      R = Qa((z) => {
        const Q = z.target,
          X = [...c.branches].some((ee) => ee.contains(Q))
        !O || X || (o?.(z), i?.(z), z.defaultPrevented || a?.())
      }, m),
      Z = ec((z) => {
        const Q = z.target
        ;[...c.branches].some((ee) => ee.contains(Q)) ||
          (s?.(z), i?.(z), z.defaultPrevented || a?.())
      }, m)
    return (
      qa((z) => {
        A === c.layers.size - 1 && (r?.(z), !z.defaultPrevented && a && (z.preventDefault(), a()))
      }, m),
      p.useEffect(() => {
        if (l)
          return (
            n &&
              (c.layersWithOutsidePointerEventsDisabled.size === 0 &&
                ((Hr = m.body.style.pointerEvents), (m.body.style.pointerEvents = 'none')),
              c.layersWithOutsidePointerEventsDisabled.add(l)),
            c.layers.add(l),
            qr(),
            () => {
              n &&
                c.layersWithOutsidePointerEventsDisabled.size === 1 &&
                (m.body.style.pointerEvents = Hr)
            }
          )
      }, [l, m, n, c]),
      p.useEffect(
        () => () => {
          l && (c.layers.delete(l), c.layersWithOutsidePointerEventsDisabled.delete(l), qr())
        },
        [l, c],
      ),
      p.useEffect(() => {
        const z = () => v({})
        return (document.addEventListener(Un, z), () => document.removeEventListener(Un, z))
      }, []),
      /* @__PURE__ */ E(De.div, {
        ...u,
        ref: h,
        style: {
          pointerEvents: x ? (O ? 'auto' : 'none') : void 0,
          ...e.style,
        },
        onFocusCapture: Le(e.onFocusCapture, Z.onFocusCapture),
        onBlurCapture: Le(e.onBlurCapture, Z.onBlurCapture),
        onPointerDownCapture: Le(e.onPointerDownCapture, R.onPointerDownCapture),
      })
    )
  })
us.displayName = Ja
var Xa = 'DismissableLayerBranch',
  Ya = p.forwardRef((e, t) => {
    const n = p.useContext(cs),
      r = p.useRef(null),
      o = Xe(t, r)
    return (
      p.useEffect(() => {
        const s = r.current
        if (s)
          return (
            n.branches.add(s),
            () => {
              n.branches.delete(s)
            }
          )
      }, [n.branches]),
      /* @__PURE__ */ E(De.div, { ...e, ref: o })
    )
  })
Ya.displayName = Xa
function Qa(e, t = globalThis?.document) {
  const n = _t(e),
    r = p.useRef(!1),
    o = p.useRef(() => {})
  return (
    p.useEffect(() => {
      const s = (a) => {
          if (a.target && !r.current) {
            let u = function () {
              ls(Ka, n, c, { discrete: !0 })
            }
            const c = { originalEvent: a }
            a.pointerType === 'touch'
              ? (t.removeEventListener('click', o.current),
                (o.current = u),
                t.addEventListener('click', o.current, { once: !0 }))
              : u()
          } else t.removeEventListener('click', o.current)
          r.current = !1
        },
        i = window.setTimeout(() => {
          t.addEventListener('pointerdown', s)
        }, 0)
      return () => {
        ;(window.clearTimeout(i),
          t.removeEventListener('pointerdown', s),
          t.removeEventListener('click', o.current))
      }
    }, [t, n]),
    {
      // ensures we check React component tree (not just DOM tree)
      onPointerDownCapture: () => (r.current = !0),
    }
  )
}
function ec(e, t = globalThis?.document) {
  const n = _t(e),
    r = p.useRef(!1)
  return (
    p.useEffect(() => {
      const o = (s) => {
        s.target &&
          !r.current &&
          ls(
            Ga,
            n,
            { originalEvent: s },
            {
              discrete: !1,
            },
          )
      }
      return (t.addEventListener('focusin', o), () => t.removeEventListener('focusin', o))
    }, [t, n]),
    {
      onFocusCapture: () => (r.current = !0),
      onBlurCapture: () => (r.current = !1),
    }
  )
}
function qr() {
  const e = new CustomEvent(Un)
  document.dispatchEvent(e)
}
function ls(e, t, n, { discrete: r }) {
  const o = n.originalEvent.target,
    s = new CustomEvent(e, { bubbles: !1, cancelable: !0, detail: n })
  ;(t && o.addEventListener(e, t, { once: !0 }), r ? Ha(o, s) : o.dispatchEvent(s))
}
var Nn = 'focusScope.autoFocusOnMount',
  Pn = 'focusScope.autoFocusOnUnmount',
  Jr = { bubbles: !1, cancelable: !0 },
  tc = 'FocusScope',
  ds = p.forwardRef((e, t) => {
    const { loop: n = !1, trapped: r = !1, onMountAutoFocus: o, onUnmountAutoFocus: s, ...i } = e,
      [a, u] = p.useState(null),
      c = _t(o),
      l = _t(s),
      d = p.useRef(null),
      m = Xe(t, (g) => u(g)),
      v = p.useRef({
        paused: !1,
        pause() {
          this.paused = !0
        },
        resume() {
          this.paused = !1
        },
      }).current
    ;(p.useEffect(() => {
      if (r) {
        let g = function (x) {
            if (v.paused || !a) return
            const O = x.target
            a.contains(O) ? (d.current = O) : Fe(d.current, { select: !0 })
          },
          _ = function (x) {
            if (v.paused || !a) return
            const O = x.relatedTarget
            O !== null && (a.contains(O) || Fe(d.current, { select: !0 }))
          },
          P = function (x) {
            if (document.activeElement === document.body)
              for (const R of x) R.removedNodes.length > 0 && Fe(a)
          }
        ;(document.addEventListener('focusin', g), document.addEventListener('focusout', _))
        const A = new MutationObserver(P)
        return (
          a && A.observe(a, { childList: !0, subtree: !0 }),
          () => {
            ;(document.removeEventListener('focusin', g),
              document.removeEventListener('focusout', _),
              A.disconnect())
          }
        )
      }
    }, [r, a, v.paused]),
      p.useEffect(() => {
        if (a) {
          Gr.add(v)
          const g = document.activeElement
          if (!a.contains(g)) {
            const P = new CustomEvent(Nn, Jr)
            ;(a.addEventListener(Nn, c),
              a.dispatchEvent(P),
              P.defaultPrevented ||
                (nc(ac(fs(a)), { select: !0 }), document.activeElement === g && Fe(a)))
          }
          return () => {
            ;(a.removeEventListener(Nn, c),
              setTimeout(() => {
                const P = new CustomEvent(Pn, Jr)
                ;(a.addEventListener(Pn, l),
                  a.dispatchEvent(P),
                  P.defaultPrevented || Fe(g ?? document.body, { select: !0 }),
                  a.removeEventListener(Pn, l),
                  Gr.remove(v))
              }, 0))
          }
        }
      }, [a, c, l, v]))
    const h = p.useCallback(
      (g) => {
        if ((!n && !r) || v.paused) return
        const _ = g.key === 'Tab' && !g.altKey && !g.ctrlKey && !g.metaKey,
          P = document.activeElement
        if (_ && P) {
          const A = g.currentTarget,
            [x, O] = rc(A)
          x && O
            ? !g.shiftKey && P === O
              ? (g.preventDefault(), n && Fe(x, { select: !0 }))
              : g.shiftKey && P === x && (g.preventDefault(), n && Fe(O, { select: !0 }))
            : P === A && g.preventDefault()
        }
      },
      [n, r, v.paused],
    )
    return /* @__PURE__ */ E(De.div, { tabIndex: -1, ...i, ref: m, onKeyDown: h })
  })
ds.displayName = tc
function nc(e, { select: t = !1 } = {}) {
  const n = document.activeElement
  for (const r of e) if ((Fe(r, { select: t }), document.activeElement !== n)) return
}
function rc(e) {
  const t = fs(e),
    n = Kr(t, e),
    r = Kr(t.reverse(), e)
  return [n, r]
}
function fs(e) {
  const t = [],
    n = document.createTreeWalker(e, NodeFilter.SHOW_ELEMENT, {
      acceptNode: (r) => {
        const o = r.tagName === 'INPUT' && r.type === 'hidden'
        return r.disabled || r.hidden || o
          ? NodeFilter.FILTER_SKIP
          : r.tabIndex >= 0
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_SKIP
      },
    })
  for (; n.nextNode(); ) t.push(n.currentNode)
  return t
}
function Kr(e, t) {
  for (const n of e) if (!oc(n, { upTo: t })) return n
}
function oc(e, { upTo: t }) {
  if (getComputedStyle(e).visibility === 'hidden') return !0
  for (; e; ) {
    if (t !== void 0 && e === t) return !1
    if (getComputedStyle(e).display === 'none') return !0
    e = e.parentElement
  }
  return !1
}
function sc(e) {
  return e instanceof HTMLInputElement && 'select' in e
}
function Fe(e, { select: t = !1 } = {}) {
  if (e && e.focus) {
    const n = document.activeElement
    ;(e.focus({ preventScroll: !0 }), e !== n && sc(e) && t && e.select())
  }
}
var Gr = ic()
function ic() {
  let e = []
  return {
    add(t) {
      const n = e[0]
      ;(t !== n && n?.pause(), (e = Xr(e, t)), e.unshift(t))
    },
    remove(t) {
      ;((e = Xr(e, t)), e[0]?.resume())
    },
  }
}
function Xr(e, t) {
  const n = [...e],
    r = n.indexOf(t)
  return (r !== -1 && n.splice(r, 1), n)
}
function ac(e) {
  return e.filter((t) => t.tagName !== 'A')
}
var cc = 'Portal',
  ps = p.forwardRef((e, t) => {
    const { container: n, ...r } = e,
      [o, s] = p.useState(!1)
    bt(() => s(!0), [])
    const i = n || (o && globalThis?.document?.body)
    return i ? va.createPortal(/* @__PURE__ */ E(De.div, { ...r, ref: t }), i) : null
  })
ps.displayName = cc
function uc(e, t) {
  return p.useReducer((n, r) => t[n][r] ?? n, e)
}
var sn = (e) => {
  const { present: t, children: n } = e,
    r = lc(t),
    o = typeof n == 'function' ? n({ present: r.isPresent }) : p.Children.only(n),
    s = Xe(r.ref, dc(o))
  return typeof n == 'function' || r.isPresent ? p.cloneElement(o, { ref: s }) : null
}
sn.displayName = 'Presence'
function lc(e) {
  const [t, n] = p.useState(),
    r = p.useRef(null),
    o = p.useRef(e),
    s = p.useRef('none'),
    i = e ? 'mounted' : 'unmounted',
    [a, u] = uc(i, {
      mounted: {
        UNMOUNT: 'unmounted',
        ANIMATION_OUT: 'unmountSuspended',
      },
      unmountSuspended: {
        MOUNT: 'mounted',
        ANIMATION_END: 'unmounted',
      },
      unmounted: {
        MOUNT: 'mounted',
      },
    })
  return (
    p.useEffect(() => {
      const c = Nt(r.current)
      s.current = a === 'mounted' ? c : 'none'
    }, [a]),
    bt(() => {
      const c = r.current,
        l = o.current
      if (l !== e) {
        const m = s.current,
          v = Nt(c)
        ;(e
          ? u('MOUNT')
          : v === 'none' || c?.display === 'none'
            ? u('UNMOUNT')
            : u(l && m !== v ? 'ANIMATION_OUT' : 'UNMOUNT'),
          (o.current = e))
      }
    }, [e, u]),
    bt(() => {
      if (t) {
        let c
        const l = t.ownerDocument.defaultView ?? window,
          d = (v) => {
            const g = Nt(r.current).includes(CSS.escape(v.animationName))
            if (v.target === t && g && (u('ANIMATION_END'), !o.current)) {
              const _ = t.style.animationFillMode
              ;((t.style.animationFillMode = 'forwards'),
                (c = l.setTimeout(() => {
                  t.style.animationFillMode === 'forwards' && (t.style.animationFillMode = _)
                })))
            }
          },
          m = (v) => {
            v.target === t && (s.current = Nt(r.current))
          }
        return (
          t.addEventListener('animationstart', m),
          t.addEventListener('animationcancel', d),
          t.addEventListener('animationend', d),
          () => {
            ;(l.clearTimeout(c),
              t.removeEventListener('animationstart', m),
              t.removeEventListener('animationcancel', d),
              t.removeEventListener('animationend', d))
          }
        )
      } else u('ANIMATION_END')
    }, [t, u]),
    {
      isPresent: ['mounted', 'unmountSuspended'].includes(a),
      ref: p.useCallback((c) => {
        ;((r.current = c ? getComputedStyle(c) : null), n(c))
      }, []),
    }
  )
}
function Nt(e) {
  return e?.animationName || 'none'
}
function dc(e) {
  let t = Object.getOwnPropertyDescriptor(e.props, 'ref')?.get,
    n = t && 'isReactWarning' in t && t.isReactWarning
  return n
    ? e.ref
    : ((t = Object.getOwnPropertyDescriptor(e, 'ref')?.get),
      (n = t && 'isReactWarning' in t && t.isReactWarning),
      n ? e.props.ref : e.props.ref || e.ref)
}
var Tn = 0
function fc() {
  p.useEffect(() => {
    const e = document.querySelectorAll('[data-radix-focus-guard]')
    return (
      document.body.insertAdjacentElement('afterbegin', e[0] ?? Yr()),
      document.body.insertAdjacentElement('beforeend', e[1] ?? Yr()),
      Tn++,
      () => {
        ;(Tn === 1 &&
          document.querySelectorAll('[data-radix-focus-guard]').forEach((t) => t.remove()),
          Tn--)
      }
    )
  }, [])
}
function Yr() {
  const e = document.createElement('span')
  return (
    e.setAttribute('data-radix-focus-guard', ''),
    (e.tabIndex = 0),
    (e.style.outline = 'none'),
    (e.style.opacity = '0'),
    (e.style.position = 'fixed'),
    (e.style.pointerEvents = 'none'),
    e
  )
}
var Ne = function () {
  return (
    (Ne =
      Object.assign ||
      function (t) {
        for (var n, r = 1, o = arguments.length; r < o; r++) {
          n = arguments[r]
          for (var s in n) Object.prototype.hasOwnProperty.call(n, s) && (t[s] = n[s])
        }
        return t
      }),
    Ne.apply(this, arguments)
  )
}
function hs(e, t) {
  var n = {}
  for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r])
  if (e != null && typeof Object.getOwnPropertySymbols == 'function')
    for (var o = 0, r = Object.getOwnPropertySymbols(e); o < r.length; o++)
      t.indexOf(r[o]) < 0 &&
        Object.prototype.propertyIsEnumerable.call(e, r[o]) &&
        (n[r[o]] = e[r[o]])
  return n
}
function pc(e, t, n) {
  if (n || arguments.length === 2)
    for (var r = 0, o = t.length, s; r < o; r++)
      (s || !(r in t)) && (s || (s = Array.prototype.slice.call(t, 0, r)), (s[r] = t[r]))
  return e.concat(s || Array.prototype.slice.call(t))
}
var Lt = 'right-scroll-bar-position',
  Vt = 'width-before-scroll-bar',
  hc = 'with-scroll-bars-hidden',
  mc = '--removed-body-scroll-bar-size'
function xn(e, t) {
  return (typeof e == 'function' ? e(t) : e && (e.current = t), e)
}
function gc(e, t) {
  var n = gt(function () {
    return {
      // value
      value: e,
      // last callback
      callback: t,
      // "memoized" public interface
      facade: {
        get current() {
          return n.value
        },
        set current(r) {
          var o = n.value
          o !== r && ((n.value = r), n.callback(r, o))
        },
      },
    }
  })[0]
  return ((n.callback = t), n.facade)
}
var yc = typeof window < 'u' ? p.useLayoutEffect : p.useEffect,
  Qr = /* @__PURE__ */ new WeakMap()
function vc(e, t) {
  var n = gc(null, function (r) {
    return e.forEach(function (o) {
      return xn(o, r)
    })
  })
  return (
    yc(
      function () {
        var r = Qr.get(n)
        if (r) {
          var o = new Set(r),
            s = new Set(e),
            i = n.current
          ;(o.forEach(function (a) {
            s.has(a) || xn(a, null)
          }),
            s.forEach(function (a) {
              o.has(a) || xn(a, i)
            }))
        }
        Qr.set(n, e)
      },
      [e],
    ),
    n
  )
}
function bc(e) {
  return e
}
function _c(e, t) {
  t === void 0 && (t = bc)
  var n = [],
    r = !1,
    o = {
      read: function () {
        if (r)
          throw new Error(
            'Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.',
          )
        return n.length ? n[n.length - 1] : e
      },
      useMedium: function (s) {
        var i = t(s, r)
        return (
          n.push(i),
          function () {
            n = n.filter(function (a) {
              return a !== i
            })
          }
        )
      },
      assignSyncMedium: function (s) {
        for (r = !0; n.length; ) {
          var i = n
          ;((n = []), i.forEach(s))
        }
        n = {
          push: function (a) {
            return s(a)
          },
          filter: function () {
            return n
          },
        }
      },
      assignMedium: function (s) {
        r = !0
        var i = []
        if (n.length) {
          var a = n
          ;((n = []), a.forEach(s), (i = n))
        }
        var u = function () {
            var l = i
            ;((i = []), l.forEach(s))
          },
          c = function () {
            return Promise.resolve().then(u)
          }
        ;(c(),
          (n = {
            push: function (l) {
              ;(i.push(l), c())
            },
            filter: function (l) {
              return ((i = i.filter(l)), n)
            },
          }))
      },
    }
  return o
}
function wc(e) {
  e === void 0 && (e = {})
  var t = _c(null)
  return ((t.options = Ne({ async: !0, ssr: !1 }, e)), t)
}
var ms = function (e) {
  var t = e.sideCar,
    n = hs(e, ['sideCar'])
  if (!t) throw new Error('Sidecar: please provide `sideCar` property to import the right car')
  var r = t.read()
  if (!r) throw new Error('Sidecar medium not found')
  return p.createElement(r, Ne({}, n))
}
ms.isSideCarExport = !0
function Ec(e, t) {
  return (e.useMedium(t), ms)
}
var gs = wc(),
  Dn = function () {},
  an = p.forwardRef(function (e, t) {
    var n = p.useRef(null),
      r = p.useState({
        onScrollCapture: Dn,
        onWheelCapture: Dn,
        onTouchMoveCapture: Dn,
      }),
      o = r[0],
      s = r[1],
      i = e.forwardProps,
      a = e.children,
      u = e.className,
      c = e.removeScrollBar,
      l = e.enabled,
      d = e.shards,
      m = e.sideCar,
      v = e.noRelative,
      h = e.noIsolation,
      g = e.inert,
      _ = e.allowPinchZoom,
      P = e.as,
      A = P === void 0 ? 'div' : P,
      x = e.gapMode,
      O = hs(e, [
        'forwardProps',
        'children',
        'className',
        'removeScrollBar',
        'enabled',
        'shards',
        'sideCar',
        'noRelative',
        'noIsolation',
        'inert',
        'allowPinchZoom',
        'as',
        'gapMode',
      ]),
      R = m,
      Z = vc([n, t]),
      z = Ne(Ne({}, O), o)
    return p.createElement(
      p.Fragment,
      null,
      l &&
        p.createElement(R, {
          sideCar: gs,
          removeScrollBar: c,
          shards: d,
          noRelative: v,
          noIsolation: h,
          inert: g,
          setCallbacks: s,
          allowPinchZoom: !!_,
          lockRef: n,
          gapMode: x,
        }),
      i
        ? p.cloneElement(p.Children.only(a), Ne(Ne({}, z), { ref: Z }))
        : p.createElement(A, Ne({}, z, { className: u, ref: Z }), a),
    )
  })
an.defaultProps = {
  enabled: !0,
  removeScrollBar: !0,
  inert: !1,
}
an.classNames = {
  fullWidth: Vt,
  zeroRight: Lt,
}
var Sc = function () {
  if (typeof __webpack_nonce__ < 'u') return __webpack_nonce__
}
function Oc() {
  if (!document) return null
  var e = document.createElement('style')
  e.type = 'text/css'
  var t = Sc()
  return (t && e.setAttribute('nonce', t), e)
}
function Cc(e, t) {
  e.styleSheet ? (e.styleSheet.cssText = t) : e.appendChild(document.createTextNode(t))
}
function kc(e) {
  var t = document.head || document.getElementsByTagName('head')[0]
  t.appendChild(e)
}
var Rc = function () {
    var e = 0,
      t = null
    return {
      add: function (n) {
        ;(e == 0 && (t = Oc()) && (Cc(t, n), kc(t)), e++)
      },
      remove: function () {
        ;(e--, !e && t && (t.parentNode && t.parentNode.removeChild(t), (t = null)))
      },
    }
  },
  Ac = function () {
    var e = Rc()
    return function (t, n) {
      p.useEffect(
        function () {
          return (
            e.add(t),
            function () {
              e.remove()
            }
          )
        },
        [t && n],
      )
    }
  },
  ys = function () {
    var e = Ac(),
      t = function (n) {
        var r = n.styles,
          o = n.dynamic
        return (e(r, o), null)
      }
    return t
  },
  Nc = {
    left: 0,
    top: 0,
    right: 0,
    gap: 0,
  },
  zn = function (e) {
    return parseInt(e || '', 10) || 0
  },
  Pc = function (e) {
    var t = window.getComputedStyle(document.body),
      n = t[e === 'padding' ? 'paddingLeft' : 'marginLeft'],
      r = t[e === 'padding' ? 'paddingTop' : 'marginTop'],
      o = t[e === 'padding' ? 'paddingRight' : 'marginRight']
    return [zn(n), zn(r), zn(o)]
  },
  Tc = function (e) {
    if ((e === void 0 && (e = 'margin'), typeof window > 'u')) return Nc
    var t = Pc(e),
      n = document.documentElement.clientWidth,
      r = window.innerWidth
    return {
      left: t[0],
      top: t[1],
      right: t[2],
      gap: Math.max(0, r - n + t[2] - t[0]),
    }
  },
  xc = ys(),
  st = 'data-scroll-locked',
  Dc = function (e, t, n, r) {
    var o = e.left,
      s = e.top,
      i = e.right,
      a = e.gap
    return (
      n === void 0 && (n = 'margin'),
      `
  .`
        .concat(
          hc,
          ` {
   overflow: hidden `,
        )
        .concat(
          r,
          `;
   padding-right: `,
        )
        .concat(a, 'px ')
        .concat(
          r,
          `;
  }
  body[`,
        )
        .concat(
          st,
          `] {
    overflow: hidden `,
        )
        .concat(
          r,
          `;
    overscroll-behavior: contain;
    `,
        )
        .concat(
          [
            t && 'position: relative '.concat(r, ';'),
            n === 'margin' &&
              `
    padding-left: `
                .concat(
                  o,
                  `px;
    padding-top: `,
                )
                .concat(
                  s,
                  `px;
    padding-right: `,
                )
                .concat(
                  i,
                  `px;
    margin-left:0;
    margin-top:0;
    margin-right: `,
                )
                .concat(a, 'px ')
                .concat(
                  r,
                  `;
    `,
                ),
            n === 'padding' && 'padding-right: '.concat(a, 'px ').concat(r, ';'),
          ]
            .filter(Boolean)
            .join(''),
          `
  }
  
  .`,
        )
        .concat(
          Lt,
          ` {
    right: `,
        )
        .concat(a, 'px ')
        .concat(
          r,
          `;
  }
  
  .`,
        )
        .concat(
          Vt,
          ` {
    margin-right: `,
        )
        .concat(a, 'px ')
        .concat(
          r,
          `;
  }
  
  .`,
        )
        .concat(Lt, ' .')
        .concat(
          Lt,
          ` {
    right: 0 `,
        )
        .concat(
          r,
          `;
  }
  
  .`,
        )
        .concat(Vt, ' .')
        .concat(
          Vt,
          ` {
    margin-right: 0 `,
        )
        .concat(
          r,
          `;
  }
  
  body[`,
        )
        .concat(
          st,
          `] {
    `,
        )
        .concat(mc, ': ')
        .concat(
          a,
          `px;
  }
`,
        )
    )
  },
  eo = function () {
    var e = parseInt(document.body.getAttribute(st) || '0', 10)
    return isFinite(e) ? e : 0
  },
  zc = function () {
    p.useEffect(function () {
      return (
        document.body.setAttribute(st, (eo() + 1).toString()),
        function () {
          var e = eo() - 1
          e <= 0 ? document.body.removeAttribute(st) : document.body.setAttribute(st, e.toString())
        }
      )
    }, [])
  },
  $c = function (e) {
    var t = e.noRelative,
      n = e.noImportant,
      r = e.gapMode,
      o = r === void 0 ? 'margin' : r
    zc()
    var s = p.useMemo(
      function () {
        return Tc(o)
      },
      [o],
    )
    return p.createElement(xc, { styles: Dc(s, !t, o, n ? '' : '!important') })
  },
  Mn = !1
if (typeof window < 'u')
  try {
    var Pt = Object.defineProperty({}, 'passive', {
      get: function () {
        return ((Mn = !0), !0)
      },
    })
    ;(window.addEventListener('test', Pt, Pt), window.removeEventListener('test', Pt, Pt))
  } catch {
    Mn = !1
  }
var Qe = Mn ? { passive: !1 } : !1,
  Fc = function (e) {
    return e.tagName === 'TEXTAREA'
  },
  vs = function (e, t) {
    if (!(e instanceof Element)) return !1
    var n = window.getComputedStyle(e)
    return (
      // not-not-scrollable
      n[t] !== 'hidden' && // contains scroll inside self
      !(n.overflowY === n.overflowX && !Fc(e) && n[t] === 'visible')
    )
  },
  Ic = function (e) {
    return vs(e, 'overflowY')
  },
  Lc = function (e) {
    return vs(e, 'overflowX')
  },
  to = function (e, t) {
    var n = t.ownerDocument,
      r = t
    do {
      typeof ShadowRoot < 'u' && r instanceof ShadowRoot && (r = r.host)
      var o = bs(e, r)
      if (o) {
        var s = _s(e, r),
          i = s[1],
          a = s[2]
        if (i > a) return !0
      }
      r = r.parentNode
    } while (r && r !== n.body)
    return !1
  },
  Vc = function (e) {
    var t = e.scrollTop,
      n = e.scrollHeight,
      r = e.clientHeight
    return [t, n, r]
  },
  Zc = function (e) {
    var t = e.scrollLeft,
      n = e.scrollWidth,
      r = e.clientWidth
    return [t, n, r]
  },
  bs = function (e, t) {
    return e === 'v' ? Ic(t) : Lc(t)
  },
  _s = function (e, t) {
    return e === 'v' ? Vc(t) : Zc(t)
  },
  jc = function (e, t) {
    return e === 'h' && t === 'rtl' ? -1 : 1
  },
  Uc = function (e, t, n, r, o) {
    var s = jc(e, window.getComputedStyle(t).direction),
      i = s * r,
      a = n.target,
      u = t.contains(a),
      c = !1,
      l = i > 0,
      d = 0,
      m = 0
    do {
      if (!a) break
      var v = _s(e, a),
        h = v[0],
        g = v[1],
        _ = v[2],
        P = g - _ - s * h
      ;(h || P) && bs(e, a) && ((d += P), (m += h))
      var A = a.parentNode
      a = A && A.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? A.host : A
    } while (
      // portaled content
      (!u && a !== document.body) || // self content
      (u && (t.contains(a) || t === a))
    )
    return (((l && Math.abs(d) < 1) || (!l && Math.abs(m) < 1)) && (c = !0), c)
  },
  Tt = function (e) {
    return 'changedTouches' in e
      ? [e.changedTouches[0].clientX, e.changedTouches[0].clientY]
      : [0, 0]
  },
  no = function (e) {
    return [e.deltaX, e.deltaY]
  },
  ro = function (e) {
    return e && 'current' in e ? e.current : e
  },
  Mc = function (e, t) {
    return e[0] === t[0] && e[1] === t[1]
  },
  Bc = function (e) {
    return `
  .block-interactivity-`
      .concat(
        e,
        ` {pointer-events: none;}
  .allow-interactivity-`,
      )
      .concat(
        e,
        ` {pointer-events: all;}
`,
      )
  },
  Wc = 0,
  et = []
function Hc(e) {
  var t = p.useRef([]),
    n = p.useRef([0, 0]),
    r = p.useRef(),
    o = p.useState(Wc++)[0],
    s = p.useState(ys)[0],
    i = p.useRef(e)
  ;(p.useEffect(
    function () {
      i.current = e
    },
    [e],
  ),
    p.useEffect(
      function () {
        if (e.inert) {
          document.body.classList.add('block-interactivity-'.concat(o))
          var g = pc([e.lockRef.current], (e.shards || []).map(ro), !0).filter(Boolean)
          return (
            g.forEach(function (_) {
              return _.classList.add('allow-interactivity-'.concat(o))
            }),
            function () {
              ;(document.body.classList.remove('block-interactivity-'.concat(o)),
                g.forEach(function (_) {
                  return _.classList.remove('allow-interactivity-'.concat(o))
                }))
            }
          )
        }
      },
      [e.inert, e.lockRef.current, e.shards],
    ))
  var a = p.useCallback(function (g, _) {
      if (('touches' in g && g.touches.length === 2) || (g.type === 'wheel' && g.ctrlKey))
        return !i.current.allowPinchZoom
      var P = Tt(g),
        A = n.current,
        x = 'deltaX' in g ? g.deltaX : A[0] - P[0],
        O = 'deltaY' in g ? g.deltaY : A[1] - P[1],
        R,
        Z = g.target,
        z = Math.abs(x) > Math.abs(O) ? 'h' : 'v'
      if ('touches' in g && z === 'h' && Z.type === 'range') return !1
      var Q = window.getSelection(),
        X = Q && Q.anchorNode,
        ee = X ? X === Z || X.contains(Z) : !1
      if (ee) return !1
      var we = to(z, Z)
      if (!we) return !0
      if ((we ? (R = z) : ((R = z === 'v' ? 'h' : 'v'), (we = to(z, Z))), !we)) return !1
      if ((!r.current && 'changedTouches' in g && (x || O) && (r.current = R), !R)) return !0
      var I = r.current || R
      return Uc(I, _, g, I === 'h' ? x : O)
    }, []),
    u = p.useCallback(function (g) {
      var _ = g
      if (!(!et.length || et[et.length - 1] !== s)) {
        var P = 'deltaY' in _ ? no(_) : Tt(_),
          A = t.current.filter(function (R) {
            return (
              R.name === _.type &&
              (R.target === _.target || _.target === R.shadowParent) &&
              Mc(R.delta, P)
            )
          })[0]
        if (A && A.should) {
          _.cancelable && _.preventDefault()
          return
        }
        if (!A) {
          var x = (i.current.shards || [])
              .map(ro)
              .filter(Boolean)
              .filter(function (R) {
                return R.contains(_.target)
              }),
            O = x.length > 0 ? a(_, x[0]) : !i.current.noIsolation
          O && _.cancelable && _.preventDefault()
        }
      }
    }, []),
    c = p.useCallback(function (g, _, P, A) {
      var x = { name: g, delta: _, target: P, should: A, shadowParent: qc(P) }
      ;(t.current.push(x),
        setTimeout(function () {
          t.current = t.current.filter(function (O) {
            return O !== x
          })
        }, 1))
    }, []),
    l = p.useCallback(function (g) {
      ;((n.current = Tt(g)), (r.current = void 0))
    }, []),
    d = p.useCallback(function (g) {
      c(g.type, no(g), g.target, a(g, e.lockRef.current))
    }, []),
    m = p.useCallback(function (g) {
      c(g.type, Tt(g), g.target, a(g, e.lockRef.current))
    }, [])
  p.useEffect(function () {
    return (
      et.push(s),
      e.setCallbacks({
        onScrollCapture: d,
        onWheelCapture: d,
        onTouchMoveCapture: m,
      }),
      document.addEventListener('wheel', u, Qe),
      document.addEventListener('touchmove', u, Qe),
      document.addEventListener('touchstart', l, Qe),
      function () {
        ;((et = et.filter(function (g) {
          return g !== s
        })),
          document.removeEventListener('wheel', u, Qe),
          document.removeEventListener('touchmove', u, Qe),
          document.removeEventListener('touchstart', l, Qe))
      }
    )
  }, [])
  var v = e.removeScrollBar,
    h = e.inert
  return p.createElement(
    p.Fragment,
    null,
    h ? p.createElement(s, { styles: Bc(o) }) : null,
    v ? p.createElement($c, { noRelative: e.noRelative, gapMode: e.gapMode }) : null,
  )
}
function qc(e) {
  for (var t = null; e !== null; )
    (e instanceof ShadowRoot && ((t = e.host), (e = e.host)), (e = e.parentNode))
  return t
}
const Jc = Ec(gs, Hc)
var ws = p.forwardRef(function (e, t) {
  return p.createElement(an, Ne({}, e, { ref: t, sideCar: Jc }))
})
ws.classNames = an.classNames
var Kc = function (e) {
    if (typeof document > 'u') return null
    var t = Array.isArray(e) ? e[0] : e
    return t.ownerDocument.body
  },
  tt = /* @__PURE__ */ new WeakMap(),
  xt = /* @__PURE__ */ new WeakMap(),
  Dt = {},
  $n = 0,
  Es = function (e) {
    return e && (e.host || Es(e.parentNode))
  },
  Gc = function (e, t) {
    return t
      .map(function (n) {
        if (e.contains(n)) return n
        var r = Es(n)
        return r && e.contains(r)
          ? r
          : (console.error('aria-hidden', n, 'in not contained inside', e, '. Doing nothing'), null)
      })
      .filter(function (n) {
        return !!n
      })
  },
  Xc = function (e, t, n, r) {
    var o = Gc(t, Array.isArray(e) ? e : [e])
    Dt[n] || (Dt[n] = /* @__PURE__ */ new WeakMap())
    var s = Dt[n],
      i = [],
      a = /* @__PURE__ */ new Set(),
      u = new Set(o),
      c = function (d) {
        !d || a.has(d) || (a.add(d), c(d.parentNode))
      }
    o.forEach(c)
    var l = function (d) {
      !d ||
        u.has(d) ||
        Array.prototype.forEach.call(d.children, function (m) {
          if (a.has(m)) l(m)
          else
            try {
              var v = m.getAttribute(r),
                h = v !== null && v !== 'false',
                g = (tt.get(m) || 0) + 1,
                _ = (s.get(m) || 0) + 1
              ;(tt.set(m, g),
                s.set(m, _),
                i.push(m),
                g === 1 && h && xt.set(m, !0),
                _ === 1 && m.setAttribute(n, 'true'),
                h || m.setAttribute(r, 'true'))
            } catch (P) {
              console.error('aria-hidden: cannot operate on ', m, P)
            }
        })
    }
    return (
      l(t),
      a.clear(),
      $n++,
      function () {
        ;(i.forEach(function (d) {
          var m = tt.get(d) - 1,
            v = s.get(d) - 1
          ;(tt.set(d, m),
            s.set(d, v),
            m || (xt.has(d) || d.removeAttribute(r), xt.delete(d)),
            v || d.removeAttribute(n))
        }),
          $n--,
          $n ||
            ((tt = /* @__PURE__ */ new WeakMap()),
            (tt = /* @__PURE__ */ new WeakMap()),
            (xt = /* @__PURE__ */ new WeakMap()),
            (Dt = {})))
      }
    )
  },
  Yc = function (e, t, n) {
    n === void 0 && (n = 'data-aria-hidden')
    var r = Array.from(Array.isArray(e) ? e : [e]),
      o = Kc(e)
    return o
      ? (r.push.apply(r, Array.from(o.querySelectorAll('[aria-live], script'))),
        Xc(r, o, n, 'aria-hidden'))
      : function () {
          return null
        }
  }
// @__NO_SIDE_EFFECTS__
function Qc(e) {
  const t = /* @__PURE__ */ eu(e),
    n = p.forwardRef((r, o) => {
      const { children: s, ...i } = r,
        a = p.Children.toArray(s),
        u = a.find(nu)
      if (u) {
        const c = u.props.children,
          l = a.map((d) =>
            d === u
              ? p.Children.count(c) > 1
                ? p.Children.only(null)
                : p.isValidElement(c)
                  ? c.props.children
                  : null
              : d,
          )
        return /* @__PURE__ */ E(t, {
          ...i,
          ref: o,
          children: p.isValidElement(c) ? p.cloneElement(c, void 0, l) : null,
        })
      }
      return /* @__PURE__ */ E(t, { ...i, ref: o, children: s })
    })
  return ((n.displayName = `${e}.Slot`), n)
}
// @__NO_SIDE_EFFECTS__
function eu(e) {
  const t = p.forwardRef((n, r) => {
    const { children: o, ...s } = n
    if (p.isValidElement(o)) {
      const i = ou(o),
        a = ru(s, o.props)
      return (o.type !== p.Fragment && (a.ref = r ? on(r, i) : i), p.cloneElement(o, a))
    }
    return p.Children.count(o) > 1 ? p.Children.only(null) : null
  })
  return ((t.displayName = `${e}.SlotClone`), t)
}
var tu = /* @__PURE__ */ Symbol('radix.slottable')
function nu(e) {
  return (
    p.isValidElement(e) &&
    typeof e.type == 'function' &&
    '__radixId' in e.type &&
    e.type.__radixId === tu
  )
}
function ru(e, t) {
  const n = { ...t }
  for (const r in t) {
    const o = e[r],
      s = t[r]
    ;/^on[A-Z]/.test(r)
      ? o && s
        ? (n[r] = (...a) => {
            const u = s(...a)
            return (o(...a), u)
          })
        : o && (n[r] = o)
      : r === 'style'
        ? (n[r] = { ...o, ...s })
        : r === 'className' && (n[r] = [o, s].filter(Boolean).join(' '))
  }
  return { ...e, ...n }
}
function ou(e) {
  let t = Object.getOwnPropertyDescriptor(e.props, 'ref')?.get,
    n = t && 'isReactWarning' in t && t.isReactWarning
  return n
    ? e.ref
    : ((t = Object.getOwnPropertyDescriptor(e, 'ref')?.get),
      (n = t && 'isReactWarning' in t && t.isReactWarning),
      n ? e.props.ref : e.props.ref || e.ref)
}
var cn = 'Dialog',
  [Ss] = Ta(cn),
  [su, ke] = Ss(cn),
  Os = (e) => {
    const {
        __scopeDialog: t,
        children: n,
        open: r,
        defaultOpen: o,
        onOpenChange: s,
        modal: i = !0,
      } = e,
      a = p.useRef(null),
      u = p.useRef(null),
      [c, l] = Fa({
        prop: r,
        defaultProp: o ?? !1,
        onChange: s,
        caller: cn,
      })
    return /* @__PURE__ */ E(su, {
      scope: t,
      triggerRef: a,
      contentRef: u,
      contentId: An(),
      titleId: An(),
      descriptionId: An(),
      open: c,
      onOpenChange: l,
      onOpenToggle: p.useCallback(() => l((d) => !d), [l]),
      modal: i,
      children: n,
    })
  }
Os.displayName = cn
var Cs = 'DialogTrigger',
  iu = p.forwardRef((e, t) => {
    const { __scopeDialog: n, ...r } = e,
      o = ke(Cs, n),
      s = Xe(t, o.triggerRef)
    return /* @__PURE__ */ E(De.button, {
      type: 'button',
      'aria-haspopup': 'dialog',
      'aria-expanded': o.open,
      'aria-controls': o.contentId,
      'data-state': ar(o.open),
      ...r,
      ref: s,
      onClick: Le(e.onClick, o.onOpenToggle),
    })
  })
iu.displayName = Cs
var sr = 'DialogPortal',
  [au, ks] = Ss(sr, {
    forceMount: void 0,
  }),
  Rs = (e) => {
    const { __scopeDialog: t, forceMount: n, children: r, container: o } = e,
      s = ke(sr, t)
    return /* @__PURE__ */ E(au, {
      scope: t,
      forceMount: n,
      children: p.Children.map(r, (i) =>
        /* @__PURE__ */ E(sn, {
          present: n || s.open,
          children: /* @__PURE__ */ E(ps, { asChild: !0, container: o, children: i }),
        }),
      ),
    })
  }
Rs.displayName = sr
var Jt = 'DialogOverlay',
  As = p.forwardRef((e, t) => {
    const n = ks(Jt, e.__scopeDialog),
      { forceMount: r = n.forceMount, ...o } = e,
      s = ke(Jt, e.__scopeDialog)
    return s.modal
      ? /* @__PURE__ */ E(sn, {
          present: r || s.open,
          children: /* @__PURE__ */ E(uu, { ...o, ref: t }),
        })
      : null
  })
As.displayName = Jt
var cu = /* @__PURE__ */ Qc('DialogOverlay.RemoveScroll'),
  uu = p.forwardRef((e, t) => {
    const { __scopeDialog: n, ...r } = e,
      o = ke(Jt, n)
    return (
      // Make sure `Content` is scrollable even when it doesn't live inside `RemoveScroll`
      // ie. when `Overlay` and `Content` are siblings
      /* @__PURE__ */ E(ws, {
        as: cu,
        allowPinchZoom: !0,
        shards: [o.contentRef],
        children: /* @__PURE__ */ E(De.div, {
          'data-state': ar(o.open),
          ...r,
          ref: t,
          style: { pointerEvents: 'auto', ...r.style },
        }),
      })
    )
  }),
  qe = 'DialogContent',
  Ns = p.forwardRef((e, t) => {
    const n = ks(qe, e.__scopeDialog),
      { forceMount: r = n.forceMount, ...o } = e,
      s = ke(qe, e.__scopeDialog)
    return /* @__PURE__ */ E(sn, {
      present: r || s.open,
      children: s.modal
        ? /* @__PURE__ */ E(lu, { ...o, ref: t })
        : /* @__PURE__ */ E(du, { ...o, ref: t }),
    })
  })
Ns.displayName = qe
var lu = p.forwardRef((e, t) => {
    const n = ke(qe, e.__scopeDialog),
      r = p.useRef(null),
      o = Xe(t, n.contentRef, r)
    return (
      p.useEffect(() => {
        const s = r.current
        if (s) return Yc(s)
      }, []),
      /* @__PURE__ */ E(Ps, {
        ...e,
        ref: o,
        trapFocus: n.open,
        disableOutsidePointerEvents: !0,
        onCloseAutoFocus: Le(e.onCloseAutoFocus, (s) => {
          ;(s.preventDefault(), n.triggerRef.current?.focus())
        }),
        onPointerDownOutside: Le(e.onPointerDownOutside, (s) => {
          const i = s.detail.originalEvent,
            a = i.button === 0 && i.ctrlKey === !0
          ;(i.button === 2 || a) && s.preventDefault()
        }),
        onFocusOutside: Le(e.onFocusOutside, (s) => s.preventDefault()),
      })
    )
  }),
  du = p.forwardRef((e, t) => {
    const n = ke(qe, e.__scopeDialog),
      r = p.useRef(!1),
      o = p.useRef(!1)
    return /* @__PURE__ */ E(Ps, {
      ...e,
      ref: t,
      trapFocus: !1,
      disableOutsidePointerEvents: !1,
      onCloseAutoFocus: (s) => {
        ;(e.onCloseAutoFocus?.(s),
          s.defaultPrevented || (r.current || n.triggerRef.current?.focus(), s.preventDefault()),
          (r.current = !1),
          (o.current = !1))
      },
      onInteractOutside: (s) => {
        ;(e.onInteractOutside?.(s),
          s.defaultPrevented ||
            ((r.current = !0), s.detail.originalEvent.type === 'pointerdown' && (o.current = !0)))
        const i = s.target
        ;(n.triggerRef.current?.contains(i) && s.preventDefault(),
          s.detail.originalEvent.type === 'focusin' && o.current && s.preventDefault())
      },
    })
  }),
  Ps = p.forwardRef((e, t) => {
    const { __scopeDialog: n, trapFocus: r, onOpenAutoFocus: o, onCloseAutoFocus: s, ...i } = e,
      a = ke(qe, n),
      u = p.useRef(null),
      c = Xe(t, u)
    return (
      fc(),
      /* @__PURE__ */ H(jr, {
        children: [
          /* @__PURE__ */ E(ds, {
            asChild: !0,
            loop: !0,
            trapped: r,
            onMountAutoFocus: o,
            onUnmountAutoFocus: s,
            children: /* @__PURE__ */ E(us, {
              role: 'dialog',
              id: a.contentId,
              'aria-describedby': a.descriptionId,
              'aria-labelledby': a.titleId,
              'data-state': ar(a.open),
              ...i,
              ref: c,
              onDismiss: () => a.onOpenChange(!1),
            }),
          }),
          /* @__PURE__ */ H(jr, {
            children: [
              /* @__PURE__ */ E(fu, { titleId: a.titleId }),
              /* @__PURE__ */ E(hu, { contentRef: u, descriptionId: a.descriptionId }),
            ],
          }),
        ],
      })
    )
  }),
  ir = 'DialogTitle',
  Ts = p.forwardRef((e, t) => {
    const { __scopeDialog: n, ...r } = e,
      o = ke(ir, n)
    return /* @__PURE__ */ E(De.h2, { id: o.titleId, ...r, ref: t })
  })
Ts.displayName = ir
var xs = 'DialogDescription',
  Ds = p.forwardRef((e, t) => {
    const { __scopeDialog: n, ...r } = e,
      o = ke(xs, n)
    return /* @__PURE__ */ E(De.p, { id: o.descriptionId, ...r, ref: t })
  })
Ds.displayName = xs
var zs = 'DialogClose',
  $s = p.forwardRef((e, t) => {
    const { __scopeDialog: n, ...r } = e,
      o = ke(zs, n)
    return /* @__PURE__ */ E(De.button, {
      type: 'button',
      ...r,
      ref: t,
      onClick: Le(e.onClick, () => o.onOpenChange(!1)),
    })
  })
$s.displayName = zs
function ar(e) {
  return e ? 'open' : 'closed'
}
var Fs = 'DialogTitleWarning',
  [mg, Is] = Pa(Fs, {
    contentName: qe,
    titleName: ir,
    docsSlug: 'dialog',
  }),
  fu = ({ titleId: e }) => {
    const t = Is(Fs),
      n = `\`${t.contentName}\` requires a \`${t.titleName}\` for the component to be accessible for screen reader users.

If you want to hide the \`${t.titleName}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://radix-ui.com/primitives/docs/components/${t.docsSlug}`
    return (
      p.useEffect(() => {
        e && (document.getElementById(e) || console.error(n))
      }, [n, e]),
      null
    )
  },
  pu = 'DialogDescriptionWarning',
  hu = ({ contentRef: e, descriptionId: t }) => {
    const r = `Warning: Missing \`Description\` or \`aria-describedby={undefined}\` for {${Is(pu).contentName}}.`
    return (
      p.useEffect(() => {
        const o = e.current?.getAttribute('aria-describedby')
        t && o && (document.getElementById(t) || console.warn(r))
      }, [r, e, t]),
      null
    )
  },
  mu = Os,
  gu = Rs,
  Ls = As,
  Vs = Ns,
  Zs = Ts,
  js = Ds,
  yu = $s
const Us = mu,
  vu = gu,
  Ms = p.forwardRef(({ className: e, ...t }, n) =>
    /* @__PURE__ */ E(Ls, {
      ref: n,
      className: K(
        'fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        e,
      ),
      ...t,
    }),
  )
Ms.displayName = Ls.displayName
const cr = p.forwardRef(({ className: e, children: t, ...n }, r) =>
  /* @__PURE__ */ H(vu, {
    children: [
      /* @__PURE__ */ E(Ms, {}),
      /* @__PURE__ */ H(Vs, {
        ref: r,
        className: K(
          'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg',
          e,
        ),
        ...n,
        children: [
          t,
          /* @__PURE__ */ H(yu, {
            className:
              'absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground',
            children: [
              /* @__PURE__ */ E(da, { className: 'h-4 w-4' }),
              /* @__PURE__ */ E('span', { className: 'sr-only', children: 'Close' }),
            ],
          }),
        ],
      }),
    ],
  }),
)
cr.displayName = Vs.displayName
const ur = ({ className: e, ...t }) =>
  /* @__PURE__ */ E('div', {
    className: K('flex flex-col space-y-1.5 text-center sm:text-left', e),
    ...t,
  })
ur.displayName = 'DialogHeader'
const lr = ({ className: e, ...t }) =>
  /* @__PURE__ */ E('div', {
    className: K('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', e),
    ...t,
  })
lr.displayName = 'DialogFooter'
const dr = p.forwardRef(({ className: e, ...t }, n) =>
  /* @__PURE__ */ E(Zs, {
    ref: n,
    className: K('text-lg font-semibold leading-none tracking-tight', e),
    ...t,
  }),
)
dr.displayName = Zs.displayName
const fr = p.forwardRef(({ className: e, ...t }, n) =>
  /* @__PURE__ */ E(js, {
    ref: n,
    className: K('text-sm text-muted-foreground', e),
    ...t,
  }),
)
fr.displayName = js.displayName
var St = (e) => e.type === 'checkbox',
  Be = (e) => e instanceof Date,
  ge = (e) => e == null
const Bs = (e) => typeof e == 'object'
var re = (e) => !ge(e) && !Array.isArray(e) && Bs(e) && !Be(e),
  Ws = (e) => (re(e) && e.target ? (St(e.target) ? e.target.checked : e.target.value) : e),
  bu = (e) => e.substring(0, e.search(/\.\d+(\.|$)/)) || e,
  Hs = (e, t) => e.has(bu(t)),
  _u = (e) => {
    const t = e.constructor && e.constructor.prototype
    return re(t) && t.hasOwnProperty('isPrototypeOf')
  },
  pr = typeof window < 'u' && typeof window.HTMLElement < 'u' && typeof document < 'u'
function te(e) {
  if (e instanceof Date) return new Date(e)
  const t = typeof FileList < 'u' && e instanceof FileList
  if (pr && (e instanceof Blob || t)) return e
  const n = Array.isArray(e)
  if (!n && !(re(e) && _u(e))) return e
  const r = n ? [] : Object.create(Object.getPrototypeOf(e))
  for (const o in e) Object.prototype.hasOwnProperty.call(e, o) && (r[o] = te(e[o]))
  return r
}
var un = (e) => /^\w*$/.test(e),
  q = (e) => e === void 0,
  hr = (e) => (Array.isArray(e) ? e.filter(Boolean) : []),
  mr = (e) => hr(e.replace(/["|']|\]/g, '').split(/\.|\[/)),
  N = (e, t, n) => {
    if (!t || !re(e)) return n
    const r = (un(t) ? [t] : mr(t)).reduce((o, s) => (ge(o) ? o : o[s]), e)
    return q(r) || r === e ? (q(e[t]) ? n : e[t]) : r
  },
  be = (e) => typeof e == 'boolean',
  he = (e) => typeof e == 'function',
  M = (e, t, n) => {
    let r = -1
    const o = un(t) ? [t] : mr(t),
      s = o.length,
      i = s - 1
    for (; ++r < s; ) {
      const a = o[r]
      let u = n
      if (r !== i) {
        const c = e[a]
        u = re(c) || Array.isArray(c) ? c : isNaN(+o[r + 1]) ? {} : []
      }
      if (a === '__proto__' || a === 'constructor' || a === 'prototype') return
      ;((e[a] = u), (e = e[a]))
    }
  }
const Kt = {
    BLUR: 'blur',
    FOCUS_OUT: 'focusout',
    CHANGE: 'change',
  },
  Oe = {
    onBlur: 'onBlur',
    onChange: 'onChange',
    onSubmit: 'onSubmit',
    onTouched: 'onTouched',
    all: 'all',
  },
  xe = {
    max: 'max',
    min: 'min',
    maxLength: 'maxLength',
    minLength: 'minLength',
    pattern: 'pattern',
    required: 'required',
    validate: 'validate',
  },
  gr = $.createContext(null)
gr.displayName = 'HookFormControlContext'
const yr = () => $.useContext(gr)
var qs = (e, t, n, r = !0) => {
  const o = {
    defaultValues: t._defaultValues,
  }
  for (const s in e)
    Object.defineProperty(o, s, {
      get: () => {
        const i = s
        return (
          t._proxyFormState[i] !== Oe.all && (t._proxyFormState[i] = !r || Oe.all),
          n && (n[i] = !0),
          e[i]
        )
      },
    })
  return o
}
const vr = typeof window < 'u' ? $.useLayoutEffect : $.useEffect
function wu(e) {
  const t = yr(),
    { control: n = t, disabled: r, name: o, exact: s } = e || {},
    [i, a] = $.useState(n._formState),
    u = $.useRef({
      isDirty: !1,
      isLoading: !1,
      dirtyFields: !1,
      touchedFields: !1,
      validatingFields: !1,
      isValidating: !1,
      isValid: !1,
      errors: !1,
    })
  return (
    vr(
      () =>
        n._subscribe({
          name: o,
          formState: u.current,
          exact: s,
          callback: (c) => {
            !r &&
              a({
                ...n._formState,
                ...c,
              })
          },
        }),
      [o, r, s],
    ),
    $.useEffect(() => {
      u.current.isValid && n._setValid(!0)
    }, [n]),
    $.useMemo(() => qs(i, n, u.current, !1), [i, n])
  )
}
var _e = (e) => typeof e == 'string',
  Bn = (e, t, n, r, o) =>
    _e(e)
      ? (r && t.watch.add(e), N(n, e, o))
      : Array.isArray(e)
        ? e.map((s) => (r && t.watch.add(s), N(n, s)))
        : (r && (t.watchAll = !0), n),
  Wn = (e) => ge(e) || !Bs(e)
function Ce(e, t, n = /* @__PURE__ */ new WeakSet()) {
  if (Wn(e) || Wn(t)) return Object.is(e, t)
  if (Be(e) && Be(t)) return Object.is(e.getTime(), t.getTime())
  const r = Object.keys(e),
    o = Object.keys(t)
  if (r.length !== o.length) return !1
  if (n.has(e) || n.has(t)) return !0
  ;(n.add(e), n.add(t))
  for (const s of r) {
    const i = e[s]
    if (!o.includes(s)) return !1
    if (s !== 'ref') {
      const a = t[s]
      if (
        (Be(i) && Be(a)) || (re(i) && re(a)) || (Array.isArray(i) && Array.isArray(a))
          ? !Ce(i, a, n)
          : !Object.is(i, a)
      )
        return !1
    }
  }
  return !0
}
function Eu(e) {
  const t = yr(),
    { control: n = t, name: r, defaultValue: o, disabled: s, exact: i, compute: a } = e || {},
    u = $.useRef(o),
    c = $.useRef(a),
    l = $.useRef(void 0),
    d = $.useRef(n),
    m = $.useRef(r)
  c.current = a
  const [v, h] = $.useState(() => {
      const O = n._getWatch(r, u.current)
      return c.current ? c.current(O) : O
    }),
    g = $.useCallback(
      (O) => {
        const R = Bn(r, n._names, O || n._formValues, !1, u.current)
        return c.current ? c.current(R) : R
      },
      [n._formValues, n._names, r],
    ),
    _ = $.useCallback(
      (O) => {
        if (!s) {
          const R = Bn(r, n._names, O || n._formValues, !1, u.current)
          if (c.current) {
            const Z = c.current(R)
            Ce(Z, l.current) || (h(Z), (l.current = Z))
          } else h(R)
        }
      },
      [n._formValues, n._names, s, r],
    )
  ;(vr(
    () => (
      (d.current !== n || !Ce(m.current, r)) && ((d.current = n), (m.current = r), _()),
      n._subscribe({
        name: r,
        formState: {
          values: !0,
        },
        exact: i,
        callback: (O) => {
          _(O.values)
        },
      })
    ),
    [n, i, r, _],
  ),
    $.useEffect(() => n._removeUnmounted()))
  const P = d.current !== n,
    A = m.current,
    x = $.useMemo(() => {
      if (s) return null
      const O = !P && !Ce(A, r)
      return P || O ? g() : null
    }, [s, P, r, A, g])
  return x !== null ? x : v
}
function Su(e) {
  const t = yr(),
    {
      name: n,
      disabled: r,
      control: o = t,
      shouldUnregister: s,
      defaultValue: i,
      exact: a = !0,
    } = e,
    u = Hs(o._names.array, n),
    c = $.useMemo(() => N(o._formValues, n, N(o._defaultValues, n, i)), [o, n, i]),
    l = Eu({
      control: o,
      name: n,
      defaultValue: c,
      exact: a,
    }),
    d = wu({
      control: o,
      name: n,
      exact: a,
    }),
    m = $.useRef(e),
    v = $.useRef(void 0),
    h = $.useRef(
      o.register(n, {
        ...e.rules,
        value: l,
        ...(be(e.disabled) ? { disabled: e.disabled } : {}),
      }),
    )
  m.current = e
  const g = $.useMemo(
      () =>
        Object.defineProperties(
          {},
          {
            invalid: {
              enumerable: !0,
              get: () => !!N(d.errors, n),
            },
            isDirty: {
              enumerable: !0,
              get: () => !!N(d.dirtyFields, n),
            },
            isTouched: {
              enumerable: !0,
              get: () => !!N(d.touchedFields, n),
            },
            isValidating: {
              enumerable: !0,
              get: () => !!N(d.validatingFields, n),
            },
            error: {
              enumerable: !0,
              get: () => N(d.errors, n),
            },
          },
        ),
      [d, n],
    ),
    _ = $.useCallback(
      (O) =>
        h.current.onChange({
          target: {
            value: Ws(O),
            name: n,
          },
          type: Kt.CHANGE,
        }),
      [n],
    ),
    P = $.useCallback(
      () =>
        h.current.onBlur({
          target: {
            value: N(o._formValues, n),
            name: n,
          },
          type: Kt.BLUR,
        }),
      [n, o._formValues],
    ),
    A = $.useCallback(
      (O) => {
        const R = N(o._fields, n)
        R &&
          R._f &&
          O &&
          (R._f.ref = {
            focus: () => he(O.focus) && O.focus(),
            select: () => he(O.select) && O.select(),
            setCustomValidity: (Z) => he(O.setCustomValidity) && O.setCustomValidity(Z),
            reportValidity: () => he(O.reportValidity) && O.reportValidity(),
          })
      },
      [o._fields, n],
    ),
    x = $.useMemo(
      () => ({
        name: n,
        value: l,
        ...(be(r) || d.disabled ? { disabled: d.disabled || r } : {}),
        onChange: _,
        onBlur: P,
        ref: A,
      }),
      [n, r, d.disabled, _, P, A, l],
    )
  return (
    $.useEffect(() => {
      const O = o._options.shouldUnregister || s,
        R = v.current
      ;(R && R !== n && !u && o.unregister(R),
        o.register(n, {
          ...m.current.rules,
          ...(be(m.current.disabled) ? { disabled: m.current.disabled } : {}),
        }))
      const Z = (z, Q) => {
        const X = N(o._fields, z)
        X && X._f && (X._f.mount = Q)
      }
      if ((Z(n, !0), O)) {
        const z = te(N(o._options.defaultValues, n, m.current.defaultValue))
        ;(M(o._defaultValues, n, z), q(N(o._formValues, n)) && M(o._formValues, n, z))
      }
      return (
        !u && o.register(n),
        (v.current = n),
        () => {
          ;(u ? O && !o._state.action : O) ? o.unregister(n) : Z(n, !1)
        }
      )
    }, [n, o, u, s]),
    $.useEffect(() => {
      o._setDisabledField({
        disabled: r,
        name: n,
      })
    }, [r, n, o]),
    $.useMemo(
      () => ({
        field: x,
        formState: d,
        fieldState: g,
      }),
      [x, d, g],
    )
  )
}
const Ou = (e) => e.render(Su(e)),
  br = $.createContext(null)
br.displayName = 'HookFormContext'
const Cu = () => $.useContext(br),
  ku = (e) => {
    const {
      children: t,
      watch: n,
      getValues: r,
      getFieldState: o,
      setError: s,
      clearErrors: i,
      setValue: a,
      trigger: u,
      formState: c,
      resetField: l,
      reset: d,
      handleSubmit: m,
      unregister: v,
      control: h,
      register: g,
      setFocus: _,
      subscribe: P,
    } = e
    return $.createElement(
      br.Provider,
      {
        value: $.useMemo(
          () => ({
            watch: n,
            getValues: r,
            getFieldState: o,
            setError: s,
            clearErrors: i,
            setValue: a,
            trigger: u,
            formState: c,
            resetField: l,
            reset: d,
            handleSubmit: m,
            unregister: v,
            control: h,
            register: g,
            setFocus: _,
            subscribe: P,
          }),
          [i, h, c, o, r, m, g, d, l, s, _, a, P, u, v, n],
        ),
      },
      $.createElement(gr.Provider, { value: h }, t),
    )
  }
var _r = (e, t, n, r, o) =>
    t
      ? {
          ...n[e],
          types: {
            ...(n[e] && n[e].types ? n[e].types : {}),
            [r]: o || !0,
          },
        }
      : {},
  yt = (e) => (Array.isArray(e) ? e : [e]),
  oo = () => {
    let e = []
    return {
      get observers() {
        return e
      },
      next: (o) => {
        for (const s of e) s.next && s.next(o)
      },
      subscribe: (o) => (
        e.push(o),
        {
          unsubscribe: () => {
            e = e.filter((s) => s !== o)
          },
        }
      ),
      unsubscribe: () => {
        e = []
      },
    }
  }
function Js(e, t) {
  const n = {}
  for (const r in e)
    if (e.hasOwnProperty(r)) {
      const o = e[r],
        s = t[r]
      if (o && re(o) && s) {
        const i = Js(o, s)
        re(i) && (n[r] = i)
      } else e[r] && (n[r] = s)
    }
  return n
}
var pe = (e) => re(e) && !Object.keys(e).length,
  wr = (e) => e.type === 'file',
  Gt = (e) => {
    if (!pr) return !1
    const t = e ? e.ownerDocument : 0
    return e instanceof (t && t.defaultView ? t.defaultView.HTMLElement : HTMLElement)
  },
  Ks = (e) => e.type === 'select-multiple',
  Er = (e) => e.type === 'radio',
  Ru = (e) => Er(e) || St(e),
  Fn = (e) => Gt(e) && e.isConnected
function Au(e, t) {
  const n = t.slice(0, -1).length
  let r = 0
  for (; r < n; ) e = q(e) ? r++ : e[t[r++]]
  return e
}
function Nu(e) {
  for (const t in e) if (e.hasOwnProperty(t) && !q(e[t])) return !1
  return !0
}
function ne(e, t) {
  const n = Array.isArray(t) ? t : un(t) ? [t] : mr(t),
    r = n.length === 1 ? e : Au(e, n),
    o = n.length - 1,
    s = n[o]
  return (
    r && delete r[s],
    o !== 0 && ((re(r) && pe(r)) || (Array.isArray(r) && Nu(r))) && ne(e, n.slice(0, -1)),
    e
  )
}
var Pu = (e) => {
  for (const t in e) if (he(e[t])) return !0
  return !1
}
function Gs(e) {
  return Array.isArray(e) || (re(e) && !Pu(e))
}
function Hn(e, t = {}) {
  for (const n in e) {
    const r = e[n]
    Gs(r) ? ((t[n] = Array.isArray(r) ? [] : {}), Hn(r, t[n])) : q(r) || (t[n] = !0)
  }
  return t
}
function rt(e, t, n) {
  n || (n = Hn(t))
  for (const r in e) {
    const o = e[r]
    if (Gs(o))
      q(t) || Wn(n[r]) ? (n[r] = Hn(o, Array.isArray(o) ? [] : {})) : rt(o, ge(t) ? {} : t[r], n[r])
    else {
      const s = t[r]
      n[r] = !Ce(o, s)
    }
  }
  return n
}
const so = {
    value: !1,
    isValid: !1,
  },
  io = { value: !0, isValid: !0 }
var Xs = (e) => {
    if (Array.isArray(e)) {
      if (e.length > 1) {
        const t = e.filter((n) => n && n.checked && !n.disabled).map((n) => n.value)
        return { value: t, isValid: !!t.length }
      }
      return e[0].checked && !e[0].disabled
        ? // @ts-expect-error expected to work in the browser
          e[0].attributes && !q(e[0].attributes.value)
          ? q(e[0].value) || e[0].value === ''
            ? io
            : { value: e[0].value, isValid: !0 }
          : io
        : so
    }
    return so
  },
  Ys = (e, { valueAsNumber: t, valueAsDate: n, setValueAs: r }) =>
    q(e) ? e : t ? (e === '' ? NaN : e && +e) : n && _e(e) ? new Date(e) : r ? r(e) : e
const ao = {
  isValid: !1,
  value: null,
}
var Qs = (e) =>
  Array.isArray(e)
    ? e.reduce(
        (t, n) =>
          n && n.checked && !n.disabled
            ? {
                isValid: !0,
                value: n.value,
              }
            : t,
        ao,
      )
    : ao
function co(e) {
  const t = e.ref
  return wr(t)
    ? t.files
    : Er(t)
      ? Qs(e.refs).value
      : Ks(t)
        ? [...t.selectedOptions].map(({ value: n }) => n)
        : St(t)
          ? Xs(e.refs).value
          : Ys(q(t.value) ? e.ref.value : t.value, e)
}
var Tu = (e, t, n, r) => {
    const o = {}
    for (const s of e) {
      const i = N(t, s)
      i && M(o, s, i._f)
    }
    return {
      criteriaMode: n,
      names: [...e],
      fields: o,
      shouldUseNativeValidation: r,
    }
  },
  Xt = (e) => e instanceof RegExp,
  pt = (e) => (q(e) ? e : Xt(e) ? e.source : re(e) ? (Xt(e.value) ? e.value.source : e.value) : e),
  uo = (e) => ({
    isOnSubmit: !e || e === Oe.onSubmit,
    isOnBlur: e === Oe.onBlur,
    isOnChange: e === Oe.onChange,
    isOnAll: e === Oe.all,
    isOnTouch: e === Oe.onTouched,
  })
const lo = 'AsyncFunction'
var xu = (e) =>
    !!e &&
    !!e.validate &&
    !!(
      (he(e.validate) && e.validate.constructor.name === lo) ||
      (re(e.validate) && Object.values(e.validate).find((t) => t.constructor.name === lo))
    ),
  Du = (e) =>
    e.mount &&
    (e.required || e.min || e.max || e.maxLength || e.minLength || e.pattern || e.validate),
  fo = (e, t, n) =>
    !n &&
    (t.watchAll ||
      t.watch.has(e) ||
      [...t.watch].some((r) => e.startsWith(r) && /^\.\w+/.test(e.slice(r.length))))
const vt = (e, t, n, r) => {
  for (const o of n || Object.keys(e)) {
    const s = N(e, o)
    if (s) {
      const { _f: i, ...a } = s
      if (i) {
        if (i.refs && i.refs[0] && t(i.refs[0], o) && !r) return !0
        if (i.ref && t(i.ref, i.name) && !r) return !0
        if (vt(a, t)) break
      } else if (re(a) && vt(a, t)) break
    }
  }
}
function po(e, t, n) {
  const r = N(e, n)
  if (r || un(n))
    return {
      error: r,
      name: n,
    }
  const o = n.split('.')
  for (; o.length; ) {
    const s = o.join('.'),
      i = N(t, s),
      a = N(e, s)
    if (i && !Array.isArray(i) && n !== s) return { name: n }
    if (a && a.type)
      return {
        name: s,
        error: a,
      }
    if (a && a.root && a.root.type)
      return {
        name: `${s}.root`,
        error: a.root,
      }
    o.pop()
  }
  return {
    name: n,
  }
}
var zu = (e, t, n, r) => {
    n(e)
    const { name: o, ...s } = e
    return (
      pe(s) ||
      Object.keys(s).length >= Object.keys(t).length ||
      Object.keys(s).find((i) => t[i] === (!r || Oe.all))
    )
  },
  $u = (e, t, n) =>
    !e ||
    !t ||
    e === t ||
    yt(e).some((r) => r && (n ? r === t : r.startsWith(t) || t.startsWith(r))),
  Fu = (e, t, n, r, o) =>
    o.isOnAll
      ? !1
      : !n && o.isOnTouch
        ? !(t || e)
        : (n ? r.isOnBlur : o.isOnBlur)
          ? !e
          : (n ? r.isOnChange : o.isOnChange)
            ? e
            : !0,
  Iu = (e, t) => !hr(N(e, t)).length && ne(e, t),
  Lu = (e, t, n) => {
    const r = yt(N(e, n))
    return (M(r, 'root', t[n]), M(e, n, r), e)
  }
function ho(e, t, n = 'validate') {
  if (_e(e) || (Array.isArray(e) && e.every(_e)) || (be(e) && !e))
    return {
      type: n,
      message: _e(e) ? e : '',
      ref: t,
    }
}
var nt = (e) =>
    re(e) && !Xt(e)
      ? e
      : {
          value: e,
          message: '',
        },
  mo = async (e, t, n, r, o, s) => {
    const {
        ref: i,
        refs: a,
        required: u,
        maxLength: c,
        minLength: l,
        min: d,
        max: m,
        pattern: v,
        validate: h,
        name: g,
        valueAsNumber: _,
        mount: P,
      } = e._f,
      A = N(n, g)
    if (!P || t.has(g)) return {}
    const x = a ? a[0] : i,
      O = (I) => {
        o && x.reportValidity && (x.setCustomValidity(be(I) ? '' : I || ''), x.reportValidity())
      },
      R = {},
      Z = Er(i),
      z = St(i),
      Q = Z || z,
      X =
        ((_ || wr(i)) && q(i.value) && q(A)) ||
        (Gt(i) && i.value === '') ||
        A === '' ||
        (Array.isArray(A) && !A.length),
      ee = _r.bind(null, g, r, R),
      we = (I, V, W, se = xe.maxLength, Y = xe.minLength) => {
        const ue = I ? V : W
        R[g] = {
          type: I ? se : Y,
          message: ue,
          ref: i,
          ...ee(I ? se : Y, ue),
        }
      }
    if (
      s
        ? !Array.isArray(A) || !A.length
        : u &&
          ((!Q && (X || ge(A))) || (be(A) && !A) || (z && !Xs(a).isValid) || (Z && !Qs(a).isValid))
    ) {
      const { value: I, message: V } = _e(u) ? { value: !!u, message: u } : nt(u)
      if (
        I &&
        ((R[g] = {
          type: xe.required,
          message: V,
          ref: x,
          ...ee(xe.required, V),
        }),
        !r)
      )
        return (O(V), R)
    }
    if (!X && (!ge(d) || !ge(m))) {
      let I, V
      const W = nt(m),
        se = nt(d)
      if (!ge(A) && !isNaN(A)) {
        const Y = i.valueAsNumber || (A && +A)
        ;(ge(W.value) || (I = Y > W.value), ge(se.value) || (V = Y < se.value))
      } else {
        const Y = i.valueAsDate || new Date(A),
          ue = (je) =>
            /* @__PURE__ */ new Date(/* @__PURE__ */ new Date().toDateString() + ' ' + je),
          me = i.type == 'time',
          ze = i.type == 'week'
        ;(_e(W.value) &&
          A &&
          (I = me ? ue(A) > ue(W.value) : ze ? A > W.value : Y > new Date(W.value)),
          _e(se.value) &&
            A &&
            (V = me ? ue(A) < ue(se.value) : ze ? A < se.value : Y < new Date(se.value)))
      }
      if ((I || V) && (we(!!I, W.message, se.message, xe.max, xe.min), !r))
        return (O(R[g].message), R)
    }
    if ((c || l) && !X && (_e(A) || (s && Array.isArray(A)))) {
      const I = nt(c),
        V = nt(l),
        W = !ge(I.value) && A.length > +I.value,
        se = !ge(V.value) && A.length < +V.value
      if ((W || se) && (we(W, I.message, V.message), !r)) return (O(R[g].message), R)
    }
    if (v && !X && _e(A)) {
      const { value: I, message: V } = nt(v)
      if (
        Xt(I) &&
        !A.match(I) &&
        ((R[g] = {
          type: xe.pattern,
          message: V,
          ref: i,
          ...ee(xe.pattern, V),
        }),
        !r)
      )
        return (O(V), R)
    }
    if (h) {
      if (he(h)) {
        const I = await h(A, n),
          V = ho(I, x)
        if (
          V &&
          ((R[g] = {
            ...V,
            ...ee(xe.validate, V.message),
          }),
          !r)
        )
          return (O(V.message), R)
      } else if (re(h)) {
        let I = {}
        for (const V in h) {
          if (!pe(I) && !r) break
          const W = ho(await h[V](A, n), x, V)
          W &&
            ((I = {
              ...W,
              ...ee(V, W.message),
            }),
            O(W.message),
            r && (R[g] = I))
        }
        if (
          !pe(I) &&
          ((R[g] = {
            ref: x,
            ...I,
          }),
          !r)
        )
          return R
      }
    }
    return (O(!0), R)
  }
const Vu = {
  mode: Oe.onSubmit,
  reValidateMode: Oe.onChange,
  shouldFocusError: !0,
}
function Zu(e = {}) {
  let t = {
      ...Vu,
      ...e,
    },
    n = {
      submitCount: 0,
      isDirty: !1,
      isReady: !1,
      isLoading: he(t.defaultValues),
      isValidating: !1,
      isSubmitted: !1,
      isSubmitting: !1,
      isSubmitSuccessful: !1,
      isValid: !1,
      touchedFields: {},
      dirtyFields: {},
      validatingFields: {},
      errors: t.errors || {},
      disabled: t.disabled || !1,
    },
    r = {},
    o = re(t.defaultValues) || re(t.values) ? te(t.defaultValues || t.values) || {} : {},
    s = t.shouldUnregister ? {} : te(o),
    i = {
      action: !1,
      mount: !1,
      watch: !1,
      keepIsValid: !1,
    },
    a = {
      mount: /* @__PURE__ */ new Set(),
      disabled: /* @__PURE__ */ new Set(),
      unMount: /* @__PURE__ */ new Set(),
      array: /* @__PURE__ */ new Set(),
      watch: /* @__PURE__ */ new Set(),
    },
    u,
    c = 0
  const l = {
      isDirty: !1,
      dirtyFields: !1,
      validatingFields: !1,
      touchedFields: !1,
      isValidating: !1,
      isValid: !1,
      errors: !1,
    },
    d = {
      ...l,
    }
  let m = {
    ...d,
  }
  const v = {
      array: oo(),
      state: oo(),
    },
    h = t.criteriaMode === Oe.all,
    g = (f) => (y) => {
      ;(clearTimeout(c), (c = setTimeout(f, y)))
    },
    _ = async (f) => {
      if (!i.keepIsValid && !t.disabled && (d.isValid || m.isValid || f)) {
        let y
        ;(t.resolver ? ((y = pe((await Q()).errors)), P()) : (y = await ee(r, !0)),
          y !== n.isValid &&
            v.state.next({
              isValid: y,
            }))
      }
    },
    P = (f, y) => {
      !t.disabled &&
        (d.isValidating || d.validatingFields || m.isValidating || m.validatingFields) &&
        ((f || Array.from(a.mount)).forEach((w) => {
          w && (y ? M(n.validatingFields, w, y) : ne(n.validatingFields, w))
        }),
        v.state.next({
          validatingFields: n.validatingFields,
          isValidating: !pe(n.validatingFields),
        }))
    },
    A = (f, y = [], w, T, k = !0, C = !0) => {
      if (T && w && !t.disabled) {
        if (((i.action = !0), C && Array.isArray(N(r, f)))) {
          const D = w(N(r, f), T.argA, T.argB)
          k && M(r, f, D)
        }
        if (C && Array.isArray(N(n.errors, f))) {
          const D = w(N(n.errors, f), T.argA, T.argB)
          ;(k && M(n.errors, f, D), Iu(n.errors, f))
        }
        if ((d.touchedFields || m.touchedFields) && C && Array.isArray(N(n.touchedFields, f))) {
          const D = w(N(n.touchedFields, f), T.argA, T.argB)
          k && M(n.touchedFields, f, D)
        }
        ;((d.dirtyFields || m.dirtyFields) && (n.dirtyFields = rt(o, s)),
          v.state.next({
            name: f,
            isDirty: I(f, y),
            dirtyFields: n.dirtyFields,
            errors: n.errors,
            isValid: n.isValid,
          }))
      } else M(s, f, y)
    },
    x = (f, y) => {
      ;(M(n.errors, f, y),
        v.state.next({
          errors: n.errors,
        }))
    },
    O = (f) => {
      ;((n.errors = f),
        v.state.next({
          errors: n.errors,
          isValid: !1,
        }))
    },
    R = (f, y, w, T) => {
      const k = N(r, f)
      if (k) {
        const C = N(s, f, q(w) ? N(o, f) : w)
        ;(q(C) || (T && T.defaultChecked) || y ? M(s, f, y ? C : co(k._f)) : se(f, C),
          i.mount && !i.action && _())
      }
    },
    Z = (f, y, w, T, k) => {
      let C = !1,
        D = !1
      const j = {
        name: f,
      }
      if (!t.disabled) {
        if (!w || T) {
          ;(d.isDirty || m.isDirty) &&
            ((D = n.isDirty), (n.isDirty = j.isDirty = I()), (C = D !== j.isDirty))
          const U = Ce(N(o, f), y)
          ;((D = !!N(n.dirtyFields, f)),
            U ? ne(n.dirtyFields, f) : M(n.dirtyFields, f, !0),
            (j.dirtyFields = n.dirtyFields),
            (C = C || ((d.dirtyFields || m.dirtyFields) && D !== !U)))
        }
        if (w) {
          const U = N(n.touchedFields, f)
          U ||
            (M(n.touchedFields, f, w),
            (j.touchedFields = n.touchedFields),
            (C = C || ((d.touchedFields || m.touchedFields) && U !== w)))
        }
        C && k && v.state.next(j)
      }
      return C ? j : {}
    },
    z = (f, y, w, T) => {
      const k = N(n.errors, f),
        C = (d.isValid || m.isValid) && be(y) && n.isValid !== y
      if (
        (t.delayError && w
          ? ((u = g(() => x(f, w))), u(t.delayError))
          : (clearTimeout(c), (u = null), w ? M(n.errors, f, w) : ne(n.errors, f)),
        (w ? !Ce(k, w) : k) || !pe(T) || C)
      ) {
        const D = {
          ...T,
          ...(C && be(y) ? { isValid: y } : {}),
          errors: n.errors,
          name: f,
        }
        ;((n = {
          ...n,
          ...D,
        }),
          v.state.next(D))
      }
    },
    Q = async (f) => (
      P(f, !0),
      await t.resolver(
        s,
        t.context,
        Tu(f || a.mount, r, t.criteriaMode, t.shouldUseNativeValidation),
      )
    ),
    X = async (f) => {
      const { errors: y } = await Q(f)
      if ((P(f), f))
        for (const w of f) {
          const T = N(y, w)
          T ? M(n.errors, w, T) : ne(n.errors, w)
        }
      else n.errors = y
      return y
    },
    ee = async (
      f,
      y,
      w = {
        valid: !0,
      },
    ) => {
      for (const T in f) {
        const k = f[T]
        if (k) {
          const { _f: C, ...D } = k
          if (C) {
            const j = a.array.has(C.name),
              U = k._f && xu(k._f)
            U && d.validatingFields && P([C.name], !0)
            const de = await mo(k, a.disabled, s, h, t.shouldUseNativeValidation && !y, j)
            if (
              (U && d.validatingFields && P([C.name]),
              de[C.name] && ((w.valid = !1), y || e.shouldUseNativeValidation))
            )
              break
            !y &&
              (N(de, C.name)
                ? j
                  ? Lu(n.errors, de, C.name)
                  : M(n.errors, C.name, de[C.name])
                : ne(n.errors, C.name))
          }
          !pe(D) && (await ee(D, y, w))
        }
      }
      return w.valid
    },
    we = () => {
      for (const f of a.unMount) {
        const y = N(r, f)
        y && (y._f.refs ? y._f.refs.every((w) => !Fn(w)) : !Fn(y._f.ref)) && Sn(f)
      }
      a.unMount = /* @__PURE__ */ new Set()
    },
    I = (f, y) => !t.disabled && (f && y && M(s, f, y), !Ce(Se(), o)),
    V = (f, y, w) =>
      Bn(
        f,
        a,
        {
          ...(i.mount ? s : q(y) ? o : _e(f) ? { [f]: y } : y),
        },
        w,
        y,
      ),
    W = (f) => hr(N(i.mount ? s : o, f, t.shouldUnregister ? N(o, f, []) : [])),
    se = (f, y, w = {}) => {
      const T = N(r, f)
      let k = y
      if (T) {
        const C = T._f
        C &&
          (!C.disabled && M(s, f, Ys(y, C)),
          (k = Gt(C.ref) && ge(y) ? '' : y),
          Ks(C.ref)
            ? [...C.ref.options].forEach((D) => (D.selected = k.includes(D.value)))
            : C.refs
              ? St(C.ref)
                ? C.refs.forEach((D) => {
                    ;(!D.defaultChecked || !D.disabled) &&
                      (Array.isArray(k)
                        ? (D.checked = !!k.find((j) => j === D.value))
                        : (D.checked = k === D.value || !!k))
                  })
                : C.refs.forEach((D) => (D.checked = D.value === k))
              : wr(C.ref)
                ? (C.ref.value = '')
                : ((C.ref.value = k),
                  C.ref.type ||
                    v.state.next({
                      name: f,
                      values: te(s),
                    })))
      }
      ;((w.shouldDirty || w.shouldTouch) && Z(f, k, w.shouldTouch, w.shouldDirty, !0),
        w.shouldValidate && je(f))
    },
    Y = (f, y, w) => {
      for (const T in y) {
        if (!y.hasOwnProperty(T)) return
        const k = y[T],
          C = f + '.' + T,
          D = N(r, C)
        ;(a.array.has(f) || re(k) || (D && !D._f)) && !Be(k) ? Y(C, k, w) : se(C, k, w)
      }
    },
    ue = (f, y, w = {}) => {
      const T = N(r, f),
        k = a.array.has(f),
        C = te(y)
      ;(M(s, f, C),
        k
          ? (v.array.next({
              name: f,
              values: te(s),
            }),
            (d.isDirty || d.dirtyFields || m.isDirty || m.dirtyFields) &&
              w.shouldDirty &&
              v.state.next({
                name: f,
                dirtyFields: rt(o, s),
                isDirty: I(f, C),
              }))
          : T && !T._f && !ge(C)
            ? Y(f, C, w)
            : se(f, C, w),
        fo(f, a)
          ? v.state.next({
              ...n,
              name: f,
              values: te(s),
            })
          : v.state.next({
              name: i.mount ? f : void 0,
              values: te(s),
            }))
    },
    me = async (f) => {
      i.mount = !0
      const y = f.target
      let w = y.name,
        T = !0
      const k = N(r, w),
        C = (U) => {
          T = Number.isNaN(U) || (Be(U) && isNaN(U.getTime())) || Ce(U, N(s, w, U))
        },
        D = uo(t.mode),
        j = uo(t.reValidateMode)
      if (k) {
        let U, de
        const Me = y.type ? co(k._f) : Ws(f),
          $e = f.type === Kt.BLUR || f.type === Kt.FOCUS_OUT,
          aa =
            (!Du(k._f) && !t.resolver && !N(n.errors, w) && !k._f.deps) ||
            Fu($e, N(n.touchedFields, w), n.isSubmitted, j, D),
          kn = fo(w, a, $e)
        ;(M(s, w, Me),
          $e
            ? (!y || !y.readOnly) && (k._f.onBlur && k._f.onBlur(f), u && u(0))
            : k._f.onChange && k._f.onChange(f))
        const Rn = Z(w, Me, $e),
          ca = !pe(Rn) || kn
        if (
          (!$e &&
            v.state.next({
              name: w,
              type: f.type,
              values: te(s),
            }),
          aa)
        )
          return (
            (d.isValid || m.isValid) && (t.mode === 'onBlur' ? $e && _() : $e || _()),
            ca && v.state.next({ name: w, ...(kn ? {} : Rn) })
          )
        if ((!$e && kn && v.state.next({ ...n }), t.resolver)) {
          const { errors: Vr } = await Q([w])
          if ((P([w]), C(Me), T)) {
            const ua = po(n.errors, r, w),
              Zr = po(Vr, r, ua.name || w)
            ;((U = Zr.error), (w = Zr.name), (de = pe(Vr)))
          }
        } else
          (P([w], !0),
            (U = (await mo(k, a.disabled, s, h, t.shouldUseNativeValidation))[w]),
            P([w]),
            C(Me),
            T && (U ? (de = !1) : (d.isValid || m.isValid) && (de = await ee(r, !0))))
        T &&
          (k._f.deps && (!Array.isArray(k._f.deps) || k._f.deps.length > 0) && je(k._f.deps),
          z(w, de, U, Rn))
      }
    },
    ze = (f, y) => {
      if (N(n.errors, y) && f.focus) return (f.focus(), 1)
    },
    je = async (f, y = {}) => {
      let w, T
      const k = yt(f)
      if (t.resolver) {
        const C = await X(q(f) ? f : k)
        ;((w = pe(C)), (T = f ? !k.some((D) => N(C, D)) : w))
      } else
        f
          ? ((T = (
              await Promise.all(
                k.map(async (C) => {
                  const D = N(r, C)
                  return await ee(D && D._f ? { [C]: D } : D)
                }),
              )
            ).every(Boolean)),
            !(!T && !n.isValid) && _())
          : (T = w = await ee(r))
      return (
        v.state.next({
          ...(!_e(f) || ((d.isValid || m.isValid) && w !== n.isValid) ? {} : { name: f }),
          ...(t.resolver || !f ? { isValid: w } : {}),
          errors: n.errors,
        }),
        y.shouldFocus && !T && vt(r, ze, f ? k : a.mount),
        T
      )
    },
    Se = (f, y) => {
      let w = {
        ...(i.mount ? s : o),
      }
      return (
        y && (w = Js(y.dirtyFields ? n.dirtyFields : n.touchedFields, w)),
        q(f) ? w : _e(f) ? N(w, f) : f.map((T) => N(w, T))
      )
    },
    Te = (f, y) => ({
      invalid: !!N((y || n).errors, f),
      isDirty: !!N((y || n).dirtyFields, f),
      error: N((y || n).errors, f),
      isValidating: !!N(n.validatingFields, f),
      isTouched: !!N((y || n).touchedFields, f),
    }),
    ft = (f) => {
      ;(f && yt(f).forEach((y) => ne(n.errors, y)),
        v.state.next({
          errors: f ? n.errors : {},
        }))
    },
    Ue = (f, y, w) => {
      const T = (N(r, f, { _f: {} })._f || {}).ref,
        k = N(n.errors, f) || {},
        { ref: C, message: D, type: j, ...U } = k
      ;(M(n.errors, f, {
        ...U,
        ...y,
        ref: T,
      }),
        v.state.next({
          name: f,
          errors: n.errors,
          isValid: !1,
        }),
        w && w.shouldFocus && T && T.focus && T.focus())
    },
    At = (f, y) =>
      he(f)
        ? v.state.subscribe({
            next: (w) => 'values' in w && f(V(void 0, y), w),
          })
        : V(f, y, !0),
    Dr = (f) =>
      v.state.subscribe({
        next: (y) => {
          $u(f.name, y.name, f.exact) &&
            zu(y, f.formState || d, ia, f.reRenderRoot) &&
            f.callback({
              values: { ...s },
              ...n,
              ...y,
              defaultValues: o,
            })
        },
      }).unsubscribe,
    na = (f) => (
      (i.mount = !0),
      (m = {
        ...m,
        ...f.formState,
      }),
      Dr({
        ...f,
        formState: {
          ...l,
          ...f.formState,
        },
      })
    ),
    Sn = (f, y = {}) => {
      for (const w of f ? yt(f) : a.mount)
        (a.mount.delete(w),
          a.array.delete(w),
          y.keepValue || (ne(r, w), ne(s, w)),
          !y.keepError && ne(n.errors, w),
          !y.keepDirty && ne(n.dirtyFields, w),
          !y.keepTouched && ne(n.touchedFields, w),
          !y.keepIsValidating && ne(n.validatingFields, w),
          !t.shouldUnregister && !y.keepDefaultValue && ne(o, w))
      ;(v.state.next({
        values: te(s),
      }),
        v.state.next({
          ...n,
          ...(y.keepDirty ? { isDirty: I() } : {}),
        }),
        !y.keepIsValid && _())
    },
    zr = ({ disabled: f, name: y }) => {
      if ((be(f) && i.mount) || f || a.disabled.has(y)) {
        const k = a.disabled.has(y) !== !!f
        ;(f ? a.disabled.add(y) : a.disabled.delete(y), k && i.mount && !i.action && _())
      }
    },
    On = (f, y = {}) => {
      let w = N(r, f)
      const T = be(y.disabled) || be(t.disabled)
      return (
        M(r, f, {
          ...(w || {}),
          _f: {
            ...(w && w._f ? w._f : { ref: { name: f } }),
            name: f,
            mount: !0,
            ...y,
          },
        }),
        a.mount.add(f),
        w
          ? zr({
              disabled: be(y.disabled) ? y.disabled : t.disabled,
              name: f,
            })
          : R(f, !0, y.value),
        {
          ...(T ? { disabled: y.disabled || t.disabled } : {}),
          ...(t.progressive
            ? {
                required: !!y.required,
                min: pt(y.min),
                max: pt(y.max),
                minLength: pt(y.minLength),
                maxLength: pt(y.maxLength),
                pattern: pt(y.pattern),
              }
            : {}),
          name: f,
          onChange: me,
          onBlur: me,
          ref: (k) => {
            if (k) {
              ;(On(f, y), (w = N(r, f)))
              const C =
                  (q(k.value) &&
                    k.querySelectorAll &&
                    k.querySelectorAll('input,select,textarea')[0]) ||
                  k,
                D = Ru(C),
                j = w._f.refs || []
              if (D ? j.find((U) => U === C) : C === w._f.ref) return
              ;(M(r, f, {
                _f: {
                  ...w._f,
                  ...(D
                    ? {
                        refs: [...j.filter(Fn), C, ...(Array.isArray(N(o, f)) ? [{}] : [])],
                        ref: { type: C.type, name: f },
                      }
                    : { ref: C }),
                },
              }),
                R(f, !1, void 0, C))
            } else
              ((w = N(r, f, {})),
                w._f && (w._f.mount = !1),
                (t.shouldUnregister || y.shouldUnregister) &&
                  !(Hs(a.array, f) && i.action) &&
                  a.unMount.add(f))
          },
        }
      )
    },
    Cn = () => t.shouldFocusError && vt(r, ze, a.mount),
    ra = (f) => {
      be(f) &&
        (v.state.next({ disabled: f }),
        vt(
          r,
          (y, w) => {
            const T = N(r, w)
            T &&
              ((y.disabled = T._f.disabled || f),
              Array.isArray(T._f.refs) &&
                T._f.refs.forEach((k) => {
                  k.disabled = T._f.disabled || f
                }))
          },
          0,
          !1,
        ))
    },
    $r = (f, y) => async (w) => {
      let T
      w && (w.preventDefault && w.preventDefault(), w.persist && w.persist())
      let k = te(s)
      if (
        (v.state.next({
          isSubmitting: !0,
        }),
        t.resolver)
      ) {
        const { errors: C, values: D } = await Q()
        ;(P(), (n.errors = C), (k = te(D)))
      } else await ee(r)
      if (a.disabled.size) for (const C of a.disabled) ne(k, C)
      if ((ne(n.errors, 'root'), pe(n.errors))) {
        v.state.next({
          errors: {},
        })
        try {
          await f(k, w)
        } catch (C) {
          T = C
        }
      } else (y && (await y({ ...n.errors }, w)), Cn(), setTimeout(Cn))
      if (
        (v.state.next({
          isSubmitted: !0,
          isSubmitting: !1,
          isSubmitSuccessful: pe(n.errors) && !T,
          submitCount: n.submitCount + 1,
          errors: n.errors,
        }),
        T)
      )
        throw T
    },
    oa = (f, y = {}) => {
      N(r, f) &&
        (q(y.defaultValue)
          ? ue(f, te(N(o, f)))
          : (ue(f, y.defaultValue), M(o, f, te(y.defaultValue))),
        y.keepTouched || ne(n.touchedFields, f),
        y.keepDirty ||
          (ne(n.dirtyFields, f), (n.isDirty = y.defaultValue ? I(f, te(N(o, f))) : I())),
        y.keepError || (ne(n.errors, f), d.isValid && _()),
        v.state.next({ ...n }))
    },
    Fr = (f, y = {}) => {
      const w = f ? te(f) : o,
        T = te(w),
        k = pe(f),
        C = k ? o : T
      if ((y.keepDefaultValues || (o = w), !y.keepValues)) {
        if (y.keepDirtyValues) {
          const D = /* @__PURE__ */ new Set([...a.mount, ...Object.keys(rt(o, s))])
          for (const j of Array.from(D)) {
            const U = N(n.dirtyFields, j),
              de = N(s, j),
              Me = N(C, j)
            U && !q(de) ? M(C, j, de) : !U && !q(Me) && ue(j, Me)
          }
        } else {
          if (pr && q(f))
            for (const D of a.mount) {
              const j = N(r, D)
              if (j && j._f) {
                const U = Array.isArray(j._f.refs) ? j._f.refs[0] : j._f.ref
                if (Gt(U)) {
                  const de = U.closest('form')
                  if (de) {
                    de.reset()
                    break
                  }
                }
              }
            }
          if (y.keepFieldsRef) for (const D of a.mount) ue(D, N(C, D))
          else r = {}
        }
        ;((s = t.shouldUnregister ? (y.keepDefaultValues ? te(o) : {}) : te(C)),
          v.array.next({
            values: { ...C },
          }),
          v.state.next({
            values: { ...C },
          }))
      }
      ;((a = {
        mount: y.keepDirtyValues ? a.mount : /* @__PURE__ */ new Set(),
        unMount: /* @__PURE__ */ new Set(),
        array: /* @__PURE__ */ new Set(),
        disabled: /* @__PURE__ */ new Set(),
        watch: /* @__PURE__ */ new Set(),
        watchAll: !1,
        focus: '',
      }),
        (i.mount =
          !d.isValid || !!y.keepIsValid || !!y.keepDirtyValues || (!t.shouldUnregister && !pe(C))),
        (i.watch = !!t.shouldUnregister),
        (i.keepIsValid = !!y.keepIsValid),
        (i.action = !1),
        y.keepErrors || (n.errors = {}),
        v.state.next({
          submitCount: y.keepSubmitCount ? n.submitCount : 0,
          isDirty: k ? !1 : y.keepDirty ? n.isDirty : !!(y.keepDefaultValues && !Ce(f, o)),
          isSubmitted: y.keepIsSubmitted ? n.isSubmitted : !1,
          dirtyFields: k
            ? {}
            : y.keepDirtyValues
              ? y.keepDefaultValues && s
                ? rt(o, s)
                : n.dirtyFields
              : y.keepDefaultValues && f
                ? rt(o, f)
                : y.keepDirty
                  ? n.dirtyFields
                  : {},
          touchedFields: y.keepTouched ? n.touchedFields : {},
          errors: y.keepErrors ? n.errors : {},
          isSubmitSuccessful: y.keepIsSubmitSuccessful ? n.isSubmitSuccessful : !1,
          isSubmitting: !1,
          defaultValues: o,
        }))
    },
    Ir = (f, y) => Fr(he(f) ? f(s) : f, { ...t.resetOptions, ...y }),
    sa = (f, y = {}) => {
      const w = N(r, f),
        T = w && w._f
      if (T) {
        const k = T.refs ? T.refs[0] : T.ref
        k.focus &&
          setTimeout(() => {
            ;(k.focus(), y.shouldSelect && he(k.select) && k.select())
          })
      }
    },
    ia = (f) => {
      n = {
        ...n,
        ...f,
      }
    },
    Lr = {
      control: {
        register: On,
        unregister: Sn,
        getFieldState: Te,
        handleSubmit: $r,
        setError: Ue,
        _subscribe: Dr,
        _runSchema: Q,
        _updateIsValidating: P,
        _focusError: Cn,
        _getWatch: V,
        _getDirty: I,
        _setValid: _,
        _setFieldArray: A,
        _setDisabledField: zr,
        _setErrors: O,
        _getFieldArray: W,
        _reset: Fr,
        _resetDefaultValues: () =>
          he(t.defaultValues) &&
          t.defaultValues().then((f) => {
            ;(Ir(f, t.resetOptions),
              v.state.next({
                isLoading: !1,
              }))
          }),
        _removeUnmounted: we,
        _disableForm: ra,
        _subjects: v,
        _proxyFormState: d,
        get _fields() {
          return r
        },
        get _formValues() {
          return s
        },
        get _state() {
          return i
        },
        set _state(f) {
          i = f
        },
        get _defaultValues() {
          return o
        },
        get _names() {
          return a
        },
        set _names(f) {
          a = f
        },
        get _formState() {
          return n
        },
        get _options() {
          return t
        },
        set _options(f) {
          t = {
            ...t,
            ...f,
          }
        },
      },
      subscribe: na,
      trigger: je,
      register: On,
      handleSubmit: $r,
      watch: At,
      setValue: ue,
      getValues: Se,
      reset: Ir,
      resetField: oa,
      clearErrors: ft,
      unregister: Sn,
      setError: Ue,
      setFocus: sa,
      getFieldState: Te,
    }
  return {
    ...Lr,
    formControl: Lr,
  }
}
function ju(e = {}) {
  const t = $.useRef(void 0),
    n = $.useRef(void 0),
    [r, o] = $.useState({
      isDirty: !1,
      isValidating: !1,
      isLoading: he(e.defaultValues),
      isSubmitted: !1,
      isSubmitting: !1,
      isSubmitSuccessful: !1,
      isValid: !1,
      submitCount: 0,
      dirtyFields: {},
      touchedFields: {},
      validatingFields: {},
      errors: e.errors || {},
      disabled: e.disabled || !1,
      isReady: !1,
      defaultValues: he(e.defaultValues) ? void 0 : e.defaultValues,
    })
  if (!t.current)
    if (e.formControl)
      ((t.current = {
        ...e.formControl,
        formState: r,
      }),
        e.defaultValues &&
          !he(e.defaultValues) &&
          e.formControl.reset(e.defaultValues, e.resetOptions))
    else {
      const { formControl: i, ...a } = Zu(e)
      t.current = {
        ...a,
        formState: r,
      }
    }
  const s = t.current.control
  return (
    (s._options = e),
    vr(() => {
      const i = s._subscribe({
        formState: s._proxyFormState,
        callback: () => o({ ...s._formState }),
        reRenderRoot: !0,
      })
      return (
        o((a) => ({
          ...a,
          isReady: !0,
        })),
        (s._formState.isReady = !0),
        i
      )
    }, [s]),
    $.useEffect(() => s._disableForm(e.disabled), [s, e.disabled]),
    $.useEffect(() => {
      ;(e.mode && (s._options.mode = e.mode),
        e.reValidateMode && (s._options.reValidateMode = e.reValidateMode))
    }, [s, e.mode, e.reValidateMode]),
    $.useEffect(() => {
      e.errors && (s._setErrors(e.errors), s._focusError())
    }, [s, e.errors]),
    $.useEffect(() => {
      e.shouldUnregister &&
        s._subjects.state.next({
          values: s._getWatch(),
        })
    }, [s, e.shouldUnregister]),
    $.useEffect(() => {
      if (s._proxyFormState.isDirty) {
        const i = s._getDirty()
        i !== r.isDirty &&
          s._subjects.state.next({
            isDirty: i,
          })
      }
    }, [s, r.isDirty]),
    $.useEffect(() => {
      var i
      e.values && !Ce(e.values, n.current)
        ? (s._reset(e.values, {
            keepFieldsRef: !0,
            ...s._options.resetOptions,
          }),
          (!((i = s._options.resetOptions) === null || i === void 0) && i.keepIsValid) ||
            s._setValid(),
          (n.current = e.values),
          o((a) => ({ ...a })))
        : s._resetDefaultValues()
    }, [s, e.values]),
    $.useEffect(() => {
      ;(s._state.mount || (s._setValid(), (s._state.mount = !0)),
        s._state.watch && ((s._state.watch = !1), s._subjects.state.next({ ...s._formState })),
        s._removeUnmounted())
    }),
    (t.current.formState = $.useMemo(() => qs(r, s), [s, r])),
    t.current
  )
}
const go = (e, t, n) => {
    if (e && 'reportValidity' in e) {
      const r = N(n, t)
      ;(e.setCustomValidity((r && r.message) || ''), e.reportValidity())
    }
  },
  qn = (e, t) => {
    for (const n in t.fields) {
      const r = t.fields[n]
      r && r.ref && 'reportValidity' in r.ref
        ? go(r.ref, n, e)
        : r && r.refs && r.refs.forEach((o) => go(o, n, e))
    }
  },
  yo = (e, t) => {
    t.shouldUseNativeValidation && qn(e, t)
    const n = {}
    for (const r in e) {
      const o = N(t.fields, r),
        s = Object.assign(e[r] || {}, { ref: o && o.ref })
      if (Uu(t.names || Object.keys(e), r)) {
        const i = Object.assign({}, N(n, r))
        ;(M(i, 'root', s), M(n, r, i))
      } else M(n, r, s)
    }
    return n
  },
  Uu = (e, t) => {
    const n = vo(t)
    return e.some((r) => vo(r).match(`^${n}\\.\\d+`))
  }
function vo(e) {
  return e.replace(/\]|\[/g, '')
}
function S(e, t, n) {
  function r(a, u) {
    if (
      (a._zod ||
        Object.defineProperty(a, '_zod', {
          value: {
            def: u,
            constr: i,
            traits: /* @__PURE__ */ new Set(),
          },
          enumerable: !1,
        }),
      a._zod.traits.has(e))
    )
      return
    ;(a._zod.traits.add(e), t(a, u))
    const c = i.prototype,
      l = Object.keys(c)
    for (let d = 0; d < l.length; d++) {
      const m = l[d]
      m in a || (a[m] = c[m].bind(a))
    }
  }
  const o = n?.Parent ?? Object
  class s extends o {}
  Object.defineProperty(s, 'name', { value: e })
  function i(a) {
    var u
    const c = n?.Parent ? new s() : this
    ;(r(c, a), (u = c._zod).deferred ?? (u.deferred = []))
    for (const l of c._zod.deferred) l()
    return c
  }
  return (
    Object.defineProperty(i, 'init', { value: r }),
    Object.defineProperty(i, Symbol.hasInstance, {
      value: (a) => (n?.Parent && a instanceof n.Parent ? !0 : a?._zod?.traits?.has(e)),
    }),
    Object.defineProperty(i, 'name', { value: e }),
    i
  )
}
class it extends Error {
  constructor() {
    super('Encountered Promise during synchronous parse. Use .parseAsync() instead.')
  }
}
class ei extends Error {
  constructor(t) {
    ;(super(`Encountered unidirectional transform during encode: ${t}`),
      (this.name = 'ZodEncodeError'))
  }
}
const ti = {}
function Je(e) {
  return ti
}
function ni(e) {
  const t = Object.values(e).filter((r) => typeof r == 'number')
  return Object.entries(e)
    .filter(([r, o]) => t.indexOf(+r) === -1)
    .map(([r, o]) => o)
}
function Jn(e, t) {
  return typeof t == 'bigint' ? t.toString() : t
}
function Sr(e) {
  return {
    get value() {
      {
        const t = e()
        return (Object.defineProperty(this, 'value', { value: t }), t)
      }
    },
  }
}
function Or(e) {
  return e == null
}
function Cr(e) {
  const t = e.startsWith('^') ? 1 : 0,
    n = e.endsWith('$') ? e.length - 1 : e.length
  return e.slice(t, n)
}
const bo = /* @__PURE__ */ Symbol('evaluating')
function B(e, t, n) {
  let r
  Object.defineProperty(e, t, {
    get() {
      if (r !== bo) return (r === void 0 && ((r = bo), (r = n())), r)
    },
    set(o) {
      Object.defineProperty(e, t, {
        value: o,
        // configurable: true,
      })
    },
    configurable: !0,
  })
}
function Ye(e, t, n) {
  Object.defineProperty(e, t, {
    value: n,
    writable: !0,
    enumerable: !0,
    configurable: !0,
  })
}
function Ve(...e) {
  const t = {}
  for (const n of e) {
    const r = Object.getOwnPropertyDescriptors(n)
    Object.assign(t, r)
  }
  return Object.defineProperties({}, t)
}
function _o(e) {
  return JSON.stringify(e)
}
function Mu(e) {
  return e
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
const ri = 'captureStackTrace' in Error ? Error.captureStackTrace : (...e) => {}
function Yt(e) {
  return typeof e == 'object' && e !== null && !Array.isArray(e)
}
const Bu = Sr(() => {
  if (typeof navigator < 'u' && navigator?.userAgent?.includes('Cloudflare')) return !1
  try {
    const e = Function
    return (new e(''), !0)
  } catch {
    return !1
  }
})
function wt(e) {
  if (Yt(e) === !1) return !1
  const t = e.constructor
  if (t === void 0 || typeof t != 'function') return !0
  const n = t.prototype
  return !(Yt(n) === !1 || Object.prototype.hasOwnProperty.call(n, 'isPrototypeOf') === !1)
}
function oi(e) {
  return wt(e) ? { ...e } : Array.isArray(e) ? [...e] : e
}
const Wu = /* @__PURE__ */ new Set(['string', 'number', 'symbol'])
function ln(e) {
  return e.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
function Ze(e, t, n) {
  const r = new e._zod.constr(t ?? e._zod.def)
  return ((!t || n?.parent) && (r._zod.parent = e), r)
}
function F(e) {
  const t = e
  if (!t) return {}
  if (typeof t == 'string') return { error: () => t }
  if (t?.message !== void 0) {
    if (t?.error !== void 0) throw new Error('Cannot specify both `message` and `error` params')
    t.error = t.message
  }
  return (delete t.message, typeof t.error == 'string' ? { ...t, error: () => t.error } : t)
}
function Hu(e) {
  return Object.keys(e).filter(
    (t) => e[t]._zod.optin === 'optional' && e[t]._zod.optout === 'optional',
  )
}
function qu(e, t) {
  const n = e._zod.def,
    r = n.checks
  if (r && r.length > 0)
    throw new Error('.pick() cannot be used on object schemas containing refinements')
  const s = Ve(e._zod.def, {
    get shape() {
      const i = {}
      for (const a in t) {
        if (!(a in n.shape)) throw new Error(`Unrecognized key: "${a}"`)
        t[a] && (i[a] = n.shape[a])
      }
      return (Ye(this, 'shape', i), i)
    },
    checks: [],
  })
  return Ze(e, s)
}
function Ju(e, t) {
  const n = e._zod.def,
    r = n.checks
  if (r && r.length > 0)
    throw new Error('.omit() cannot be used on object schemas containing refinements')
  const s = Ve(e._zod.def, {
    get shape() {
      const i = { ...e._zod.def.shape }
      for (const a in t) {
        if (!(a in n.shape)) throw new Error(`Unrecognized key: "${a}"`)
        t[a] && delete i[a]
      }
      return (Ye(this, 'shape', i), i)
    },
    checks: [],
  })
  return Ze(e, s)
}
function Ku(e, t) {
  if (!wt(t)) throw new Error('Invalid input to extend: expected a plain object')
  const n = e._zod.def.checks
  if (n && n.length > 0) {
    const s = e._zod.def.shape
    for (const i in t)
      if (Object.getOwnPropertyDescriptor(s, i) !== void 0)
        throw new Error(
          'Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.',
        )
  }
  const o = Ve(e._zod.def, {
    get shape() {
      const s = { ...e._zod.def.shape, ...t }
      return (Ye(this, 'shape', s), s)
    },
  })
  return Ze(e, o)
}
function Gu(e, t) {
  if (!wt(t)) throw new Error('Invalid input to safeExtend: expected a plain object')
  const n = Ve(e._zod.def, {
    get shape() {
      const r = { ...e._zod.def.shape, ...t }
      return (Ye(this, 'shape', r), r)
    },
  })
  return Ze(e, n)
}
function Xu(e, t) {
  const n = Ve(e._zod.def, {
    get shape() {
      const r = { ...e._zod.def.shape, ...t._zod.def.shape }
      return (Ye(this, 'shape', r), r)
    },
    get catchall() {
      return t._zod.def.catchall
    },
    checks: [],
    // delete existing checks
  })
  return Ze(e, n)
}
function Yu(e, t, n) {
  const o = t._zod.def.checks
  if (o && o.length > 0)
    throw new Error('.partial() cannot be used on object schemas containing refinements')
  const i = Ve(t._zod.def, {
    get shape() {
      const a = t._zod.def.shape,
        u = { ...a }
      if (n)
        for (const c in n) {
          if (!(c in a)) throw new Error(`Unrecognized key: "${c}"`)
          n[c] &&
            (u[c] = e
              ? new e({
                  type: 'optional',
                  innerType: a[c],
                })
              : a[c])
        }
      else
        for (const c in a)
          u[c] = e
            ? new e({
                type: 'optional',
                innerType: a[c],
              })
            : a[c]
      return (Ye(this, 'shape', u), u)
    },
    checks: [],
  })
  return Ze(t, i)
}
function Qu(e, t, n) {
  const r = Ve(t._zod.def, {
    get shape() {
      const o = t._zod.def.shape,
        s = { ...o }
      if (n)
        for (const i in n) {
          if (!(i in s)) throw new Error(`Unrecognized key: "${i}"`)
          n[i] &&
            (s[i] = new e({
              type: 'nonoptional',
              innerType: o[i],
            }))
        }
      else
        for (const i in o)
          s[i] = new e({
            type: 'nonoptional',
            innerType: o[i],
          })
      return (Ye(this, 'shape', s), s)
    },
  })
  return Ze(t, r)
}
function ot(e, t = 0) {
  if (e.aborted === !0) return !0
  for (let n = t; n < e.issues.length; n++) if (e.issues[n]?.continue !== !0) return !0
  return !1
}
function si(e, t) {
  return t.map((n) => {
    var r
    return ((r = n).path ?? (r.path = []), n.path.unshift(e), n)
  })
}
function zt(e) {
  return typeof e == 'string' ? e : e?.message
}
function Ke(e, t, n) {
  const r = { ...e, path: e.path ?? [] }
  if (!e.message) {
    const o =
      zt(e.inst?._zod.def?.error?.(e)) ??
      zt(t?.error?.(e)) ??
      zt(n.customError?.(e)) ??
      zt(n.localeError?.(e)) ??
      'Invalid input'
    r.message = o
  }
  return (delete r.inst, delete r.continue, t?.reportInput || delete r.input, r)
}
function kr(e) {
  return Array.isArray(e) ? 'array' : typeof e == 'string' ? 'string' : 'unknown'
}
function Et(...e) {
  const [t, n, r] = e
  return typeof t == 'string'
    ? {
        message: t,
        code: 'custom',
        input: n,
        inst: r,
      }
    : { ...t }
}
const ii = (e, t) => {
    ;((e.name = '$ZodError'),
      Object.defineProperty(e, '_zod', {
        value: e._zod,
        enumerable: !1,
      }),
      Object.defineProperty(e, 'issues', {
        value: t,
        enumerable: !1,
      }),
      (e.message = JSON.stringify(t, Jn, 2)),
      Object.defineProperty(e, 'toString', {
        value: () => e.message,
        enumerable: !1,
      }))
  },
  Rr = S('$ZodError', ii),
  dn = S('$ZodError', ii, { Parent: Error })
function el(e, t = (n) => n.message) {
  const n = {},
    r = []
  for (const o of e.issues)
    o.path.length > 0
      ? ((n[o.path[0]] = n[o.path[0]] || []), n[o.path[0]].push(t(o)))
      : r.push(t(o))
  return { formErrors: r, fieldErrors: n }
}
function tl(e, t = (n) => n.message) {
  const n = { _errors: [] },
    r = (o) => {
      for (const s of o.issues)
        if (s.code === 'invalid_union' && s.errors.length) s.errors.map((i) => r({ issues: i }))
        else if (s.code === 'invalid_key') r({ issues: s.issues })
        else if (s.code === 'invalid_element') r({ issues: s.issues })
        else if (s.path.length === 0) n._errors.push(t(s))
        else {
          let i = n,
            a = 0
          for (; a < s.path.length; ) {
            const u = s.path[a]
            ;(a === s.path.length - 1
              ? ((i[u] = i[u] || { _errors: [] }), i[u]._errors.push(t(s)))
              : (i[u] = i[u] || { _errors: [] }),
              (i = i[u]),
              a++)
          }
        }
    }
  return (r(e), n)
}
const fn = (e) => (t, n, r, o) => {
    const s = r ? Object.assign(r, { async: !1 }) : { async: !1 },
      i = t._zod.run({ value: n, issues: [] }, s)
    if (i instanceof Promise) throw new it()
    if (i.issues.length) {
      const a = new (o?.Err ?? e)(i.issues.map((u) => Ke(u, s, Je())))
      throw (ri(a, o?.callee), a)
    }
    return i.value
  },
  nl = /* @__PURE__ */ fn(dn),
  pn = (e) => async (t, n, r, o) => {
    const s = r ? Object.assign(r, { async: !0 }) : { async: !0 }
    let i = t._zod.run({ value: n, issues: [] }, s)
    if ((i instanceof Promise && (i = await i), i.issues.length)) {
      const a = new (o?.Err ?? e)(i.issues.map((u) => Ke(u, s, Je())))
      throw (ri(a, o?.callee), a)
    }
    return i.value
  },
  rl = /* @__PURE__ */ pn(dn),
  hn = (e) => (t, n, r) => {
    const o = r ? { ...r, async: !1 } : { async: !1 },
      s = t._zod.run({ value: n, issues: [] }, o)
    if (s instanceof Promise) throw new it()
    return s.issues.length
      ? {
          success: !1,
          error: new (e ?? Rr)(s.issues.map((i) => Ke(i, o, Je()))),
        }
      : { success: !0, data: s.value }
  },
  ol = /* @__PURE__ */ hn(dn),
  mn = (e) => async (t, n, r) => {
    const o = r ? Object.assign(r, { async: !0 }) : { async: !0 }
    let s = t._zod.run({ value: n, issues: [] }, o)
    return (
      s instanceof Promise && (s = await s),
      s.issues.length
        ? {
            success: !1,
            error: new e(s.issues.map((i) => Ke(i, o, Je()))),
          }
        : { success: !0, data: s.value }
    )
  },
  sl = /* @__PURE__ */ mn(dn),
  il = (e) => (t, n, r) => {
    const o = r ? Object.assign(r, { direction: 'backward' }) : { direction: 'backward' }
    return fn(e)(t, n, o)
  },
  al = (e) => (t, n, r) => fn(e)(t, n, r),
  cl = (e) => async (t, n, r) => {
    const o = r ? Object.assign(r, { direction: 'backward' }) : { direction: 'backward' }
    return pn(e)(t, n, o)
  },
  ul = (e) => async (t, n, r) => pn(e)(t, n, r),
  ll = (e) => (t, n, r) => {
    const o = r ? Object.assign(r, { direction: 'backward' }) : { direction: 'backward' }
    return hn(e)(t, n, o)
  },
  dl = (e) => (t, n, r) => hn(e)(t, n, r),
  fl = (e) => async (t, n, r) => {
    const o = r ? Object.assign(r, { direction: 'backward' }) : { direction: 'backward' }
    return mn(e)(t, n, o)
  },
  pl = (e) => async (t, n, r) => mn(e)(t, n, r),
  hl = /^[cC][^\s-]{8,}$/,
  ml = /^[0-9a-z]+$/,
  gl = /^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/,
  yl = /^[0-9a-vA-V]{20}$/,
  vl = /^[A-Za-z0-9]{27}$/,
  bl = /^[a-zA-Z0-9_-]{21}$/,
  _l =
    /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/,
  wl = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/,
  wo = (e) =>
    e
      ? new RegExp(
          `^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${e}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`,
        )
      : /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/,
  El =
    /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/,
  Sl = '^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$'
function Ol() {
  return new RegExp(Sl, 'u')
}
const Cl =
    /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/,
  kl =
    /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/,
  Rl =
    /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/,
  Al =
    /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/,
  Nl = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/,
  ai = /^[A-Za-z0-9_-]*$/,
  Pl = /^\+[1-9]\d{6,14}$/,
  ci =
    '(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))',
  Tl = /* @__PURE__ */ new RegExp(`^${ci}$`)
function ui(e) {
  const t = '(?:[01]\\d|2[0-3]):[0-5]\\d'
  return typeof e.precision == 'number'
    ? e.precision === -1
      ? `${t}`
      : e.precision === 0
        ? `${t}:[0-5]\\d`
        : `${t}:[0-5]\\d\\.\\d{${e.precision}}`
    : `${t}(?::[0-5]\\d(?:\\.\\d+)?)?`
}
function xl(e) {
  return new RegExp(`^${ui(e)}$`)
}
function Dl(e) {
  const t = ui({ precision: e.precision }),
    n = ['Z']
  ;(e.local && n.push(''), e.offset && n.push('([+-](?:[01]\\d|2[0-3]):[0-5]\\d)'))
  const r = `${t}(?:${n.join('|')})`
  return new RegExp(`^${ci}T(?:${r})$`)
}
const zl = (e) => {
    const t = e ? `[\\s\\S]{${e?.minimum ?? 0},${e?.maximum ?? ''}}` : '[\\s\\S]*'
    return new RegExp(`^${t}$`)
  },
  $l = /^[^A-Z]*$/,
  Fl = /^[^a-z]*$/,
  Pe = /* @__PURE__ */ S('$ZodCheck', (e, t) => {
    var n
    ;(e._zod ?? (e._zod = {}), (e._zod.def = t), (n = e._zod).onattach ?? (n.onattach = []))
  }),
  Il = /* @__PURE__ */ S('$ZodCheckMaxLength', (e, t) => {
    var n
    ;(Pe.init(e, t),
      (n = e._zod.def).when ??
        (n.when = (r) => {
          const o = r.value
          return !Or(o) && o.length !== void 0
        }),
      e._zod.onattach.push((r) => {
        const o = r._zod.bag.maximum ?? Number.POSITIVE_INFINITY
        t.maximum < o && (r._zod.bag.maximum = t.maximum)
      }),
      (e._zod.check = (r) => {
        const o = r.value
        if (o.length <= t.maximum) return
        const i = kr(o)
        r.issues.push({
          origin: i,
          code: 'too_big',
          maximum: t.maximum,
          inclusive: !0,
          input: o,
          inst: e,
          continue: !t.abort,
        })
      }))
  }),
  Ll = /* @__PURE__ */ S('$ZodCheckMinLength', (e, t) => {
    var n
    ;(Pe.init(e, t),
      (n = e._zod.def).when ??
        (n.when = (r) => {
          const o = r.value
          return !Or(o) && o.length !== void 0
        }),
      e._zod.onattach.push((r) => {
        const o = r._zod.bag.minimum ?? Number.NEGATIVE_INFINITY
        t.minimum > o && (r._zod.bag.minimum = t.minimum)
      }),
      (e._zod.check = (r) => {
        const o = r.value
        if (o.length >= t.minimum) return
        const i = kr(o)
        r.issues.push({
          origin: i,
          code: 'too_small',
          minimum: t.minimum,
          inclusive: !0,
          input: o,
          inst: e,
          continue: !t.abort,
        })
      }))
  }),
  Vl = /* @__PURE__ */ S('$ZodCheckLengthEquals', (e, t) => {
    var n
    ;(Pe.init(e, t),
      (n = e._zod.def).when ??
        (n.when = (r) => {
          const o = r.value
          return !Or(o) && o.length !== void 0
        }),
      e._zod.onattach.push((r) => {
        const o = r._zod.bag
        ;((o.minimum = t.length), (o.maximum = t.length), (o.length = t.length))
      }),
      (e._zod.check = (r) => {
        const o = r.value,
          s = o.length
        if (s === t.length) return
        const i = kr(o),
          a = s > t.length
        r.issues.push({
          origin: i,
          ...(a
            ? { code: 'too_big', maximum: t.length }
            : { code: 'too_small', minimum: t.length }),
          inclusive: !0,
          exact: !0,
          input: r.value,
          inst: e,
          continue: !t.abort,
        })
      }))
  }),
  gn = /* @__PURE__ */ S('$ZodCheckStringFormat', (e, t) => {
    var n, r
    ;(Pe.init(e, t),
      e._zod.onattach.push((o) => {
        const s = o._zod.bag
        ;((s.format = t.format),
          t.pattern &&
            (s.patterns ?? (s.patterns = /* @__PURE__ */ new Set()), s.patterns.add(t.pattern)))
      }),
      t.pattern
        ? ((n = e._zod).check ??
          (n.check = (o) => {
            ;((t.pattern.lastIndex = 0),
              !t.pattern.test(o.value) &&
                o.issues.push({
                  origin: 'string',
                  code: 'invalid_format',
                  format: t.format,
                  input: o.value,
                  ...(t.pattern ? { pattern: t.pattern.toString() } : {}),
                  inst: e,
                  continue: !t.abort,
                }))
          }))
        : ((r = e._zod).check ?? (r.check = () => {})))
  }),
  Zl = /* @__PURE__ */ S('$ZodCheckRegex', (e, t) => {
    ;(gn.init(e, t),
      (e._zod.check = (n) => {
        ;((t.pattern.lastIndex = 0),
          !t.pattern.test(n.value) &&
            n.issues.push({
              origin: 'string',
              code: 'invalid_format',
              format: 'regex',
              input: n.value,
              pattern: t.pattern.toString(),
              inst: e,
              continue: !t.abort,
            }))
      }))
  }),
  jl = /* @__PURE__ */ S('$ZodCheckLowerCase', (e, t) => {
    ;(t.pattern ?? (t.pattern = $l), gn.init(e, t))
  }),
  Ul = /* @__PURE__ */ S('$ZodCheckUpperCase', (e, t) => {
    ;(t.pattern ?? (t.pattern = Fl), gn.init(e, t))
  }),
  Ml = /* @__PURE__ */ S('$ZodCheckIncludes', (e, t) => {
    Pe.init(e, t)
    const n = ln(t.includes),
      r = new RegExp(typeof t.position == 'number' ? `^.{${t.position}}${n}` : n)
    ;((t.pattern = r),
      e._zod.onattach.push((o) => {
        const s = o._zod.bag
        ;(s.patterns ?? (s.patterns = /* @__PURE__ */ new Set()), s.patterns.add(r))
      }),
      (e._zod.check = (o) => {
        o.value.includes(t.includes, t.position) ||
          o.issues.push({
            origin: 'string',
            code: 'invalid_format',
            format: 'includes',
            includes: t.includes,
            input: o.value,
            inst: e,
            continue: !t.abort,
          })
      }))
  }),
  Bl = /* @__PURE__ */ S('$ZodCheckStartsWith', (e, t) => {
    Pe.init(e, t)
    const n = new RegExp(`^${ln(t.prefix)}.*`)
    ;(t.pattern ?? (t.pattern = n),
      e._zod.onattach.push((r) => {
        const o = r._zod.bag
        ;(o.patterns ?? (o.patterns = /* @__PURE__ */ new Set()), o.patterns.add(n))
      }),
      (e._zod.check = (r) => {
        r.value.startsWith(t.prefix) ||
          r.issues.push({
            origin: 'string',
            code: 'invalid_format',
            format: 'starts_with',
            prefix: t.prefix,
            input: r.value,
            inst: e,
            continue: !t.abort,
          })
      }))
  }),
  Wl = /* @__PURE__ */ S('$ZodCheckEndsWith', (e, t) => {
    Pe.init(e, t)
    const n = new RegExp(`.*${ln(t.suffix)}$`)
    ;(t.pattern ?? (t.pattern = n),
      e._zod.onattach.push((r) => {
        const o = r._zod.bag
        ;(o.patterns ?? (o.patterns = /* @__PURE__ */ new Set()), o.patterns.add(n))
      }),
      (e._zod.check = (r) => {
        r.value.endsWith(t.suffix) ||
          r.issues.push({
            origin: 'string',
            code: 'invalid_format',
            format: 'ends_with',
            suffix: t.suffix,
            input: r.value,
            inst: e,
            continue: !t.abort,
          })
      }))
  }),
  Hl = /* @__PURE__ */ S('$ZodCheckOverwrite', (e, t) => {
    ;(Pe.init(e, t),
      (e._zod.check = (n) => {
        n.value = t.tx(n.value)
      }))
  })
class ql {
  constructor(t = []) {
    ;((this.content = []), (this.indent = 0), this && (this.args = t))
  }
  indented(t) {
    ;((this.indent += 1), t(this), (this.indent -= 1))
  }
  write(t) {
    if (typeof t == 'function') {
      ;(t(this, { execution: 'sync' }), t(this, { execution: 'async' }))
      return
    }
    const r = t
        .split(
          `
`,
        )
        .filter((i) => i),
      o = Math.min(...r.map((i) => i.length - i.trimStart().length)),
      s = r.map((i) => i.slice(o)).map((i) => ' '.repeat(this.indent * 2) + i)
    for (const i of s) this.content.push(i)
  }
  compile() {
    const t = Function,
      n = this?.args,
      o = [...(this?.content ?? ['']).map((s) => `  ${s}`)]
    return new t(
      ...n,
      o.join(`
`),
    )
  }
}
const Jl = {
    major: 4,
    minor: 3,
    patch: 6,
  },
  ie = /* @__PURE__ */ S('$ZodType', (e, t) => {
    var n
    ;(e ?? (e = {}), (e._zod.def = t), (e._zod.bag = e._zod.bag || {}), (e._zod.version = Jl))
    const r = [...(e._zod.def.checks ?? [])]
    e._zod.traits.has('$ZodCheck') && r.unshift(e)
    for (const o of r) for (const s of o._zod.onattach) s(e)
    if (r.length === 0)
      ((n = e._zod).deferred ?? (n.deferred = []),
        e._zod.deferred?.push(() => {
          e._zod.run = e._zod.parse
        }))
    else {
      const o = (i, a, u) => {
          let c = ot(i),
            l
          for (const d of a) {
            if (d._zod.def.when) {
              if (!d._zod.def.when(i)) continue
            } else if (c) continue
            const m = i.issues.length,
              v = d._zod.check(i)
            if (v instanceof Promise && u?.async === !1) throw new it()
            if (l || v instanceof Promise)
              l = (l ?? Promise.resolve()).then(async () => {
                ;(await v, i.issues.length !== m && (c || (c = ot(i, m))))
              })
            else {
              if (i.issues.length === m) continue
              c || (c = ot(i, m))
            }
          }
          return l ? l.then(() => i) : i
        },
        s = (i, a, u) => {
          if (ot(i)) return ((i.aborted = !0), i)
          const c = o(a, r, u)
          if (c instanceof Promise) {
            if (u.async === !1) throw new it()
            return c.then((l) => e._zod.parse(l, u))
          }
          return e._zod.parse(c, u)
        }
      e._zod.run = (i, a) => {
        if (a.skipChecks) return e._zod.parse(i, a)
        if (a.direction === 'backward') {
          const c = e._zod.parse({ value: i.value, issues: [] }, { ...a, skipChecks: !0 })
          return c instanceof Promise ? c.then((l) => s(l, i, a)) : s(c, i, a)
        }
        const u = e._zod.parse(i, a)
        if (u instanceof Promise) {
          if (a.async === !1) throw new it()
          return u.then((c) => o(c, r, a))
        }
        return o(u, r, a)
      }
    }
    B(e, '~standard', () => ({
      validate: (o) => {
        try {
          const s = ol(e, o)
          return s.success ? { value: s.data } : { issues: s.error?.issues }
        } catch {
          return sl(e, o).then((i) => (i.success ? { value: i.data } : { issues: i.error?.issues }))
        }
      },
      vendor: 'zod',
      version: 1,
    }))
  }),
  Ar = /* @__PURE__ */ S('$ZodString', (e, t) => {
    ;(ie.init(e, t),
      (e._zod.pattern = [...(e?._zod.bag?.patterns ?? [])].pop() ?? zl(e._zod.bag)),
      (e._zod.parse = (n, r) => {
        if (t.coerce)
          try {
            n.value = String(n.value)
          } catch {}
        return (
          typeof n.value == 'string' ||
            n.issues.push({
              expected: 'string',
              code: 'invalid_type',
              input: n.value,
              inst: e,
            }),
          n
        )
      }))
  }),
  J = /* @__PURE__ */ S('$ZodStringFormat', (e, t) => {
    ;(gn.init(e, t), Ar.init(e, t))
  }),
  Kl = /* @__PURE__ */ S('$ZodGUID', (e, t) => {
    ;(t.pattern ?? (t.pattern = wl), J.init(e, t))
  }),
  Gl = /* @__PURE__ */ S('$ZodUUID', (e, t) => {
    if (t.version) {
      const r = {
        v1: 1,
        v2: 2,
        v3: 3,
        v4: 4,
        v5: 5,
        v6: 6,
        v7: 7,
        v8: 8,
      }[t.version]
      if (r === void 0) throw new Error(`Invalid UUID version: "${t.version}"`)
      t.pattern ?? (t.pattern = wo(r))
    } else t.pattern ?? (t.pattern = wo())
    J.init(e, t)
  }),
  Xl = /* @__PURE__ */ S('$ZodEmail', (e, t) => {
    ;(t.pattern ?? (t.pattern = El), J.init(e, t))
  }),
  Yl = /* @__PURE__ */ S('$ZodURL', (e, t) => {
    ;(J.init(e, t),
      (e._zod.check = (n) => {
        try {
          const r = n.value.trim(),
            o = new URL(r)
          ;(t.hostname &&
            ((t.hostname.lastIndex = 0),
            t.hostname.test(o.hostname) ||
              n.issues.push({
                code: 'invalid_format',
                format: 'url',
                note: 'Invalid hostname',
                pattern: t.hostname.source,
                input: n.value,
                inst: e,
                continue: !t.abort,
              })),
            t.protocol &&
              ((t.protocol.lastIndex = 0),
              t.protocol.test(o.protocol.endsWith(':') ? o.protocol.slice(0, -1) : o.protocol) ||
                n.issues.push({
                  code: 'invalid_format',
                  format: 'url',
                  note: 'Invalid protocol',
                  pattern: t.protocol.source,
                  input: n.value,
                  inst: e,
                  continue: !t.abort,
                })),
            t.normalize ? (n.value = o.href) : (n.value = r))
          return
        } catch {
          n.issues.push({
            code: 'invalid_format',
            format: 'url',
            input: n.value,
            inst: e,
            continue: !t.abort,
          })
        }
      }))
  }),
  Ql = /* @__PURE__ */ S('$ZodEmoji', (e, t) => {
    ;(t.pattern ?? (t.pattern = Ol()), J.init(e, t))
  }),
  ed = /* @__PURE__ */ S('$ZodNanoID', (e, t) => {
    ;(t.pattern ?? (t.pattern = bl), J.init(e, t))
  }),
  td = /* @__PURE__ */ S('$ZodCUID', (e, t) => {
    ;(t.pattern ?? (t.pattern = hl), J.init(e, t))
  }),
  nd = /* @__PURE__ */ S('$ZodCUID2', (e, t) => {
    ;(t.pattern ?? (t.pattern = ml), J.init(e, t))
  }),
  rd = /* @__PURE__ */ S('$ZodULID', (e, t) => {
    ;(t.pattern ?? (t.pattern = gl), J.init(e, t))
  }),
  od = /* @__PURE__ */ S('$ZodXID', (e, t) => {
    ;(t.pattern ?? (t.pattern = yl), J.init(e, t))
  }),
  sd = /* @__PURE__ */ S('$ZodKSUID', (e, t) => {
    ;(t.pattern ?? (t.pattern = vl), J.init(e, t))
  }),
  id = /* @__PURE__ */ S('$ZodISODateTime', (e, t) => {
    ;(t.pattern ?? (t.pattern = Dl(t)), J.init(e, t))
  }),
  ad = /* @__PURE__ */ S('$ZodISODate', (e, t) => {
    ;(t.pattern ?? (t.pattern = Tl), J.init(e, t))
  }),
  cd = /* @__PURE__ */ S('$ZodISOTime', (e, t) => {
    ;(t.pattern ?? (t.pattern = xl(t)), J.init(e, t))
  }),
  ud = /* @__PURE__ */ S('$ZodISODuration', (e, t) => {
    ;(t.pattern ?? (t.pattern = _l), J.init(e, t))
  }),
  ld = /* @__PURE__ */ S('$ZodIPv4', (e, t) => {
    ;(t.pattern ?? (t.pattern = Cl), J.init(e, t), (e._zod.bag.format = 'ipv4'))
  }),
  dd = /* @__PURE__ */ S('$ZodIPv6', (e, t) => {
    ;(t.pattern ?? (t.pattern = kl),
      J.init(e, t),
      (e._zod.bag.format = 'ipv6'),
      (e._zod.check = (n) => {
        try {
          new URL(`http://[${n.value}]`)
        } catch {
          n.issues.push({
            code: 'invalid_format',
            format: 'ipv6',
            input: n.value,
            inst: e,
            continue: !t.abort,
          })
        }
      }))
  }),
  fd = /* @__PURE__ */ S('$ZodCIDRv4', (e, t) => {
    ;(t.pattern ?? (t.pattern = Rl), J.init(e, t))
  }),
  pd = /* @__PURE__ */ S('$ZodCIDRv6', (e, t) => {
    ;(t.pattern ?? (t.pattern = Al),
      J.init(e, t),
      (e._zod.check = (n) => {
        const r = n.value.split('/')
        try {
          if (r.length !== 2) throw new Error()
          const [o, s] = r
          if (!s) throw new Error()
          const i = Number(s)
          if (`${i}` !== s) throw new Error()
          if (i < 0 || i > 128) throw new Error()
          new URL(`http://[${o}]`)
        } catch {
          n.issues.push({
            code: 'invalid_format',
            format: 'cidrv6',
            input: n.value,
            inst: e,
            continue: !t.abort,
          })
        }
      }))
  })
function li(e) {
  if (e === '') return !0
  if (e.length % 4 !== 0) return !1
  try {
    return (atob(e), !0)
  } catch {
    return !1
  }
}
const hd = /* @__PURE__ */ S('$ZodBase64', (e, t) => {
  ;(t.pattern ?? (t.pattern = Nl),
    J.init(e, t),
    (e._zod.bag.contentEncoding = 'base64'),
    (e._zod.check = (n) => {
      li(n.value) ||
        n.issues.push({
          code: 'invalid_format',
          format: 'base64',
          input: n.value,
          inst: e,
          continue: !t.abort,
        })
    }))
})
function md(e) {
  if (!ai.test(e)) return !1
  const t = e.replace(/[-_]/g, (r) => (r === '-' ? '+' : '/')),
    n = t.padEnd(Math.ceil(t.length / 4) * 4, '=')
  return li(n)
}
const gd = /* @__PURE__ */ S('$ZodBase64URL', (e, t) => {
    ;(t.pattern ?? (t.pattern = ai),
      J.init(e, t),
      (e._zod.bag.contentEncoding = 'base64url'),
      (e._zod.check = (n) => {
        md(n.value) ||
          n.issues.push({
            code: 'invalid_format',
            format: 'base64url',
            input: n.value,
            inst: e,
            continue: !t.abort,
          })
      }))
  }),
  yd = /* @__PURE__ */ S('$ZodE164', (e, t) => {
    ;(t.pattern ?? (t.pattern = Pl), J.init(e, t))
  })
function vd(e, t = null) {
  try {
    const n = e.split('.')
    if (n.length !== 3) return !1
    const [r] = n
    if (!r) return !1
    const o = JSON.parse(atob(r))
    return !(('typ' in o && o?.typ !== 'JWT') || !o.alg || (t && (!('alg' in o) || o.alg !== t)))
  } catch {
    return !1
  }
}
const bd = /* @__PURE__ */ S('$ZodJWT', (e, t) => {
    ;(J.init(e, t),
      (e._zod.check = (n) => {
        vd(n.value, t.alg) ||
          n.issues.push({
            code: 'invalid_format',
            format: 'jwt',
            input: n.value,
            inst: e,
            continue: !t.abort,
          })
      }))
  }),
  _d = /* @__PURE__ */ S('$ZodUnknown', (e, t) => {
    ;(ie.init(e, t), (e._zod.parse = (n) => n))
  }),
  wd = /* @__PURE__ */ S('$ZodNever', (e, t) => {
    ;(ie.init(e, t),
      (e._zod.parse = (n, r) => (
        n.issues.push({
          expected: 'never',
          code: 'invalid_type',
          input: n.value,
          inst: e,
        }),
        n
      )))
  })
function Eo(e, t, n) {
  ;(e.issues.length && t.issues.push(...si(n, e.issues)), (t.value[n] = e.value))
}
const Ed = /* @__PURE__ */ S('$ZodArray', (e, t) => {
  ;(ie.init(e, t),
    (e._zod.parse = (n, r) => {
      const o = n.value
      if (!Array.isArray(o))
        return (
          n.issues.push({
            expected: 'array',
            code: 'invalid_type',
            input: o,
            inst: e,
          }),
          n
        )
      n.value = Array(o.length)
      const s = []
      for (let i = 0; i < o.length; i++) {
        const a = o[i],
          u = t.element._zod.run(
            {
              value: a,
              issues: [],
            },
            r,
          )
        u instanceof Promise ? s.push(u.then((c) => Eo(c, n, i))) : Eo(u, n, i)
      }
      return s.length ? Promise.all(s).then(() => n) : n
    }))
})
function Qt(e, t, n, r, o) {
  if (e.issues.length) {
    if (o && !(n in r)) return
    t.issues.push(...si(n, e.issues))
  }
  e.value === void 0 ? n in r && (t.value[n] = void 0) : (t.value[n] = e.value)
}
function di(e) {
  const t = Object.keys(e.shape)
  for (const r of t)
    if (!e.shape?.[r]?._zod?.traits?.has('$ZodType'))
      throw new Error(`Invalid element at key "${r}": expected a Zod schema`)
  const n = Hu(e.shape)
  return {
    ...e,
    keys: t,
    keySet: new Set(t),
    numKeys: t.length,
    optionalKeys: new Set(n),
  }
}
function fi(e, t, n, r, o, s) {
  const i = [],
    a = o.keySet,
    u = o.catchall._zod,
    c = u.def.type,
    l = u.optout === 'optional'
  for (const d in t) {
    if (a.has(d)) continue
    if (c === 'never') {
      i.push(d)
      continue
    }
    const m = u.run({ value: t[d], issues: [] }, r)
    m instanceof Promise ? e.push(m.then((v) => Qt(v, n, d, t, l))) : Qt(m, n, d, t, l)
  }
  return (
    i.length &&
      n.issues.push({
        code: 'unrecognized_keys',
        keys: i,
        input: t,
        inst: s,
      }),
    e.length ? Promise.all(e).then(() => n) : n
  )
}
const Sd = /* @__PURE__ */ S('$ZodObject', (e, t) => {
    if ((ie.init(e, t), !Object.getOwnPropertyDescriptor(t, 'shape')?.get)) {
      const a = t.shape
      Object.defineProperty(t, 'shape', {
        get: () => {
          const u = { ...a }
          return (
            Object.defineProperty(t, 'shape', {
              value: u,
            }),
            u
          )
        },
      })
    }
    const r = Sr(() => di(t))
    B(e._zod, 'propValues', () => {
      const a = t.shape,
        u = {}
      for (const c in a) {
        const l = a[c]._zod
        if (l.values) {
          u[c] ?? (u[c] = /* @__PURE__ */ new Set())
          for (const d of l.values) u[c].add(d)
        }
      }
      return u
    })
    const o = Yt,
      s = t.catchall
    let i
    e._zod.parse = (a, u) => {
      i ?? (i = r.value)
      const c = a.value
      if (!o(c))
        return (
          a.issues.push({
            expected: 'object',
            code: 'invalid_type',
            input: c,
            inst: e,
          }),
          a
        )
      a.value = {}
      const l = [],
        d = i.shape
      for (const m of i.keys) {
        const v = d[m],
          h = v._zod.optout === 'optional',
          g = v._zod.run({ value: c[m], issues: [] }, u)
        g instanceof Promise ? l.push(g.then((_) => Qt(_, a, m, c, h))) : Qt(g, a, m, c, h)
      }
      return s ? fi(l, c, a, u, r.value, e) : l.length ? Promise.all(l).then(() => a) : a
    }
  }),
  Od = /* @__PURE__ */ S('$ZodObjectJIT', (e, t) => {
    Sd.init(e, t)
    const n = e._zod.parse,
      r = Sr(() => di(t)),
      o = (m) => {
        const v = new ql(['shape', 'payload', 'ctx']),
          h = r.value,
          g = (x) => {
            const O = _o(x)
            return `shape[${O}]._zod.run({ value: input[${O}], issues: [] }, ctx)`
          }
        v.write('const input = payload.value;')
        const _ = /* @__PURE__ */ Object.create(null)
        let P = 0
        for (const x of h.keys) _[x] = `key_${P++}`
        v.write('const newResult = {};')
        for (const x of h.keys) {
          const O = _[x],
            R = _o(x),
            z = m[x]?._zod?.optout === 'optional'
          ;(v.write(`const ${O} = ${g(x)};`),
            z
              ? v.write(`
        if (${O}.issues.length) {
          if (${R} in input) {
            payload.issues = payload.issues.concat(${O}.issues.map(iss => ({
              ...iss,
              path: iss.path ? [${R}, ...iss.path] : [${R}]
            })));
          }
        }
        
        if (${O}.value === undefined) {
          if (${R} in input) {
            newResult[${R}] = undefined;
          }
        } else {
          newResult[${R}] = ${O}.value;
        }
        
      `)
              : v.write(`
        if (${O}.issues.length) {
          payload.issues = payload.issues.concat(${O}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${R}, ...iss.path] : [${R}]
          })));
        }
        
        if (${O}.value === undefined) {
          if (${R} in input) {
            newResult[${R}] = undefined;
          }
        } else {
          newResult[${R}] = ${O}.value;
        }
        
      `))
        }
        ;(v.write('payload.value = newResult;'), v.write('return payload;'))
        const A = v.compile()
        return (x, O) => A(m, x, O)
      }
    let s
    const i = Yt,
      a = !ti.jitless,
      c = a && Bu.value,
      l = t.catchall
    let d
    e._zod.parse = (m, v) => {
      d ?? (d = r.value)
      const h = m.value
      return i(h)
        ? a && c && v?.async === !1 && v.jitless !== !0
          ? (s || (s = o(t.shape)), (m = s(m, v)), l ? fi([], h, m, v, d, e) : m)
          : n(m, v)
        : (m.issues.push({
            expected: 'object',
            code: 'invalid_type',
            input: h,
            inst: e,
          }),
          m)
    }
  })
function So(e, t, n, r) {
  for (const s of e) if (s.issues.length === 0) return ((t.value = s.value), t)
  const o = e.filter((s) => !ot(s))
  return o.length === 1
    ? ((t.value = o[0].value), o[0])
    : (t.issues.push({
        code: 'invalid_union',
        input: t.value,
        inst: n,
        errors: e.map((s) => s.issues.map((i) => Ke(i, r, Je()))),
      }),
      t)
}
const Cd = /* @__PURE__ */ S('$ZodUnion', (e, t) => {
    ;(ie.init(e, t),
      B(e._zod, 'optin', () =>
        t.options.some((o) => o._zod.optin === 'optional') ? 'optional' : void 0,
      ),
      B(e._zod, 'optout', () =>
        t.options.some((o) => o._zod.optout === 'optional') ? 'optional' : void 0,
      ),
      B(e._zod, 'values', () => {
        if (t.options.every((o) => o._zod.values))
          return new Set(t.options.flatMap((o) => Array.from(o._zod.values)))
      }),
      B(e._zod, 'pattern', () => {
        if (t.options.every((o) => o._zod.pattern)) {
          const o = t.options.map((s) => s._zod.pattern)
          return new RegExp(`^(${o.map((s) => Cr(s.source)).join('|')})$`)
        }
      }))
    const n = t.options.length === 1,
      r = t.options[0]._zod.run
    e._zod.parse = (o, s) => {
      if (n) return r(o, s)
      let i = !1
      const a = []
      for (const u of t.options) {
        const c = u._zod.run(
          {
            value: o.value,
            issues: [],
          },
          s,
        )
        if (c instanceof Promise) (a.push(c), (i = !0))
        else {
          if (c.issues.length === 0) return c
          a.push(c)
        }
      }
      return i ? Promise.all(a).then((u) => So(u, o, e, s)) : So(a, o, e, s)
    }
  }),
  kd = /* @__PURE__ */ S('$ZodIntersection', (e, t) => {
    ;(ie.init(e, t),
      (e._zod.parse = (n, r) => {
        const o = n.value,
          s = t.left._zod.run({ value: o, issues: [] }, r),
          i = t.right._zod.run({ value: o, issues: [] }, r)
        return s instanceof Promise || i instanceof Promise
          ? Promise.all([s, i]).then(([u, c]) => Oo(n, u, c))
          : Oo(n, s, i)
      }))
  })
function Kn(e, t) {
  if (e === t) return { valid: !0, data: e }
  if (e instanceof Date && t instanceof Date && +e == +t) return { valid: !0, data: e }
  if (wt(e) && wt(t)) {
    const n = Object.keys(t),
      r = Object.keys(e).filter((s) => n.indexOf(s) !== -1),
      o = { ...e, ...t }
    for (const s of r) {
      const i = Kn(e[s], t[s])
      if (!i.valid)
        return {
          valid: !1,
          mergeErrorPath: [s, ...i.mergeErrorPath],
        }
      o[s] = i.data
    }
    return { valid: !0, data: o }
  }
  if (Array.isArray(e) && Array.isArray(t)) {
    if (e.length !== t.length) return { valid: !1, mergeErrorPath: [] }
    const n = []
    for (let r = 0; r < e.length; r++) {
      const o = e[r],
        s = t[r],
        i = Kn(o, s)
      if (!i.valid)
        return {
          valid: !1,
          mergeErrorPath: [r, ...i.mergeErrorPath],
        }
      n.push(i.data)
    }
    return { valid: !0, data: n }
  }
  return { valid: !1, mergeErrorPath: [] }
}
function Oo(e, t, n) {
  const r = /* @__PURE__ */ new Map()
  let o
  for (const a of t.issues)
    if (a.code === 'unrecognized_keys') {
      o ?? (o = a)
      for (const u of a.keys) (r.has(u) || r.set(u, {}), (r.get(u).l = !0))
    } else e.issues.push(a)
  for (const a of n.issues)
    if (a.code === 'unrecognized_keys')
      for (const u of a.keys) (r.has(u) || r.set(u, {}), (r.get(u).r = !0))
    else e.issues.push(a)
  const s = [...r].filter(([, a]) => a.l && a.r).map(([a]) => a)
  if ((s.length && o && e.issues.push({ ...o, keys: s }), ot(e))) return e
  const i = Kn(t.value, n.value)
  if (!i.valid)
    throw new Error(`Unmergable intersection. Error path: ${JSON.stringify(i.mergeErrorPath)}`)
  return ((e.value = i.data), e)
}
const Rd = /* @__PURE__ */ S('$ZodEnum', (e, t) => {
    ie.init(e, t)
    const n = ni(t.entries),
      r = new Set(n)
    ;((e._zod.values = r),
      (e._zod.pattern = new RegExp(
        `^(${n
          .filter((o) => Wu.has(typeof o))
          .map((o) => (typeof o == 'string' ? ln(o) : o.toString()))
          .join('|')})$`,
      )),
      (e._zod.parse = (o, s) => {
        const i = o.value
        return (
          r.has(i) ||
            o.issues.push({
              code: 'invalid_value',
              values: n,
              input: i,
              inst: e,
            }),
          o
        )
      }))
  }),
  Ad = /* @__PURE__ */ S('$ZodTransform', (e, t) => {
    ;(ie.init(e, t),
      (e._zod.parse = (n, r) => {
        if (r.direction === 'backward') throw new ei(e.constructor.name)
        const o = t.transform(n.value, n)
        if (r.async)
          return (o instanceof Promise ? o : Promise.resolve(o)).then((i) => ((n.value = i), n))
        if (o instanceof Promise) throw new it()
        return ((n.value = o), n)
      }))
  })
function Co(e, t) {
  return e.issues.length && t === void 0 ? { issues: [], value: void 0 } : e
}
const pi = /* @__PURE__ */ S('$ZodOptional', (e, t) => {
    ;(ie.init(e, t),
      (e._zod.optin = 'optional'),
      (e._zod.optout = 'optional'),
      B(e._zod, 'values', () =>
        t.innerType._zod.values
          ? /* @__PURE__ */ new Set([...t.innerType._zod.values, void 0])
          : void 0,
      ),
      B(e._zod, 'pattern', () => {
        const n = t.innerType._zod.pattern
        return n ? new RegExp(`^(${Cr(n.source)})?$`) : void 0
      }),
      (e._zod.parse = (n, r) => {
        if (t.innerType._zod.optin === 'optional') {
          const o = t.innerType._zod.run(n, r)
          return o instanceof Promise ? o.then((s) => Co(s, n.value)) : Co(o, n.value)
        }
        return n.value === void 0 ? n : t.innerType._zod.run(n, r)
      }))
  }),
  Nd = /* @__PURE__ */ S('$ZodExactOptional', (e, t) => {
    ;(pi.init(e, t),
      B(e._zod, 'values', () => t.innerType._zod.values),
      B(e._zod, 'pattern', () => t.innerType._zod.pattern),
      (e._zod.parse = (n, r) => t.innerType._zod.run(n, r)))
  }),
  Pd = /* @__PURE__ */ S('$ZodNullable', (e, t) => {
    ;(ie.init(e, t),
      B(e._zod, 'optin', () => t.innerType._zod.optin),
      B(e._zod, 'optout', () => t.innerType._zod.optout),
      B(e._zod, 'pattern', () => {
        const n = t.innerType._zod.pattern
        return n ? new RegExp(`^(${Cr(n.source)}|null)$`) : void 0
      }),
      B(e._zod, 'values', () =>
        t.innerType._zod.values
          ? /* @__PURE__ */ new Set([...t.innerType._zod.values, null])
          : void 0,
      ),
      (e._zod.parse = (n, r) => (n.value === null ? n : t.innerType._zod.run(n, r))))
  }),
  Td = /* @__PURE__ */ S('$ZodDefault', (e, t) => {
    ;(ie.init(e, t),
      (e._zod.optin = 'optional'),
      B(e._zod, 'values', () => t.innerType._zod.values),
      (e._zod.parse = (n, r) => {
        if (r.direction === 'backward') return t.innerType._zod.run(n, r)
        if (n.value === void 0) return ((n.value = t.defaultValue), n)
        const o = t.innerType._zod.run(n, r)
        return o instanceof Promise ? o.then((s) => ko(s, t)) : ko(o, t)
      }))
  })
function ko(e, t) {
  return (e.value === void 0 && (e.value = t.defaultValue), e)
}
const xd = /* @__PURE__ */ S('$ZodPrefault', (e, t) => {
    ;(ie.init(e, t),
      (e._zod.optin = 'optional'),
      B(e._zod, 'values', () => t.innerType._zod.values),
      (e._zod.parse = (n, r) => (
        r.direction === 'backward' || (n.value === void 0 && (n.value = t.defaultValue)),
        t.innerType._zod.run(n, r)
      )))
  }),
  Dd = /* @__PURE__ */ S('$ZodNonOptional', (e, t) => {
    ;(ie.init(e, t),
      B(e._zod, 'values', () => {
        const n = t.innerType._zod.values
        return n ? new Set([...n].filter((r) => r !== void 0)) : void 0
      }),
      (e._zod.parse = (n, r) => {
        const o = t.innerType._zod.run(n, r)
        return o instanceof Promise ? o.then((s) => Ro(s, e)) : Ro(o, e)
      }))
  })
function Ro(e, t) {
  return (
    !e.issues.length &&
      e.value === void 0 &&
      e.issues.push({
        code: 'invalid_type',
        expected: 'nonoptional',
        input: e.value,
        inst: t,
      }),
    e
  )
}
const zd = /* @__PURE__ */ S('$ZodCatch', (e, t) => {
    ;(ie.init(e, t),
      B(e._zod, 'optin', () => t.innerType._zod.optin),
      B(e._zod, 'optout', () => t.innerType._zod.optout),
      B(e._zod, 'values', () => t.innerType._zod.values),
      (e._zod.parse = (n, r) => {
        if (r.direction === 'backward') return t.innerType._zod.run(n, r)
        const o = t.innerType._zod.run(n, r)
        return o instanceof Promise
          ? o.then(
              (s) => (
                (n.value = s.value),
                s.issues.length &&
                  ((n.value = t.catchValue({
                    ...n,
                    error: {
                      issues: s.issues.map((i) => Ke(i, r, Je())),
                    },
                    input: n.value,
                  })),
                  (n.issues = [])),
                n
              ),
            )
          : ((n.value = o.value),
            o.issues.length &&
              ((n.value = t.catchValue({
                ...n,
                error: {
                  issues: o.issues.map((s) => Ke(s, r, Je())),
                },
                input: n.value,
              })),
              (n.issues = [])),
            n)
      }))
  }),
  $d = /* @__PURE__ */ S('$ZodPipe', (e, t) => {
    ;(ie.init(e, t),
      B(e._zod, 'values', () => t.in._zod.values),
      B(e._zod, 'optin', () => t.in._zod.optin),
      B(e._zod, 'optout', () => t.out._zod.optout),
      B(e._zod, 'propValues', () => t.in._zod.propValues),
      (e._zod.parse = (n, r) => {
        if (r.direction === 'backward') {
          const s = t.out._zod.run(n, r)
          return s instanceof Promise ? s.then((i) => $t(i, t.in, r)) : $t(s, t.in, r)
        }
        const o = t.in._zod.run(n, r)
        return o instanceof Promise ? o.then((s) => $t(s, t.out, r)) : $t(o, t.out, r)
      }))
  })
function $t(e, t, n) {
  return e.issues.length
    ? ((e.aborted = !0), e)
    : t._zod.run({ value: e.value, issues: e.issues }, n)
}
const Fd = /* @__PURE__ */ S('$ZodReadonly', (e, t) => {
  ;(ie.init(e, t),
    B(e._zod, 'propValues', () => t.innerType._zod.propValues),
    B(e._zod, 'values', () => t.innerType._zod.values),
    B(e._zod, 'optin', () => t.innerType?._zod?.optin),
    B(e._zod, 'optout', () => t.innerType?._zod?.optout),
    (e._zod.parse = (n, r) => {
      if (r.direction === 'backward') return t.innerType._zod.run(n, r)
      const o = t.innerType._zod.run(n, r)
      return o instanceof Promise ? o.then(Ao) : Ao(o)
    }))
})
function Ao(e) {
  return ((e.value = Object.freeze(e.value)), e)
}
const Id = /* @__PURE__ */ S('$ZodCustom', (e, t) => {
  ;(Pe.init(e, t),
    ie.init(e, t),
    (e._zod.parse = (n, r) => n),
    (e._zod.check = (n) => {
      const r = n.value,
        o = t.fn(r)
      if (o instanceof Promise) return o.then((s) => No(s, n, r, e))
      No(o, n, r, e)
    }))
})
function No(e, t, n, r) {
  if (!e) {
    const o = {
      code: 'custom',
      input: n,
      inst: r,
      // incorporates params.error into issue reporting
      path: [...(r._zod.def.path ?? [])],
      // incorporates params.error into issue reporting
      continue: !r._zod.def.abort,
      // params: inst._zod.def.params,
    }
    ;(r._zod.def.params && (o.params = r._zod.def.params), t.issues.push(Et(o)))
  }
}
var Po
class Ld {
  constructor() {
    ;((this._map = /* @__PURE__ */ new WeakMap()), (this._idmap = /* @__PURE__ */ new Map()))
  }
  add(t, ...n) {
    const r = n[0]
    return (
      this._map.set(t, r),
      r && typeof r == 'object' && 'id' in r && this._idmap.set(r.id, t),
      this
    )
  }
  clear() {
    return (
      (this._map = /* @__PURE__ */ new WeakMap()),
      (this._idmap = /* @__PURE__ */ new Map()),
      this
    )
  }
  remove(t) {
    const n = this._map.get(t)
    return (
      n && typeof n == 'object' && 'id' in n && this._idmap.delete(n.id),
      this._map.delete(t),
      this
    )
  }
  get(t) {
    const n = t._zod.parent
    if (n) {
      const r = { ...(this.get(n) ?? {}) }
      delete r.id
      const o = { ...r, ...this._map.get(t) }
      return Object.keys(o).length ? o : void 0
    }
    return this._map.get(t)
  }
  has(t) {
    return this._map.has(t)
  }
}
function Vd() {
  return new Ld()
}
;(Po = globalThis).__zod_globalRegistry ?? (Po.__zod_globalRegistry = Vd())
const mt = globalThis.__zod_globalRegistry
// @__NO_SIDE_EFFECTS__
function Zd(e, t) {
  return new e({
    type: 'string',
    ...F(t),
  })
}
// @__NO_SIDE_EFFECTS__
function jd(e, t) {
  return new e({
    type: 'string',
    format: 'email',
    check: 'string_format',
    abort: !1,
    ...F(t),
  })
}
// @__NO_SIDE_EFFECTS__
function To(e, t) {
  return new e({
    type: 'string',
    format: 'guid',
    check: 'string_format',
    abort: !1,
    ...F(t),
  })
}
// @__NO_SIDE_EFFECTS__
function Ud(e, t) {
  return new e({
    type: 'string',
    format: 'uuid',
    check: 'string_format',
    abort: !1,
    ...F(t),
  })
}
// @__NO_SIDE_EFFECTS__
function Md(e, t) {
  return new e({
    type: 'string',
    format: 'uuid',
    check: 'string_format',
    abort: !1,
    version: 'v4',
    ...F(t),
  })
}
// @__NO_SIDE_EFFECTS__
function Bd(e, t) {
  return new e({
    type: 'string',
    format: 'uuid',
    check: 'string_format',
    abort: !1,
    version: 'v6',
    ...F(t),
  })
}
// @__NO_SIDE_EFFECTS__
function Wd(e, t) {
  return new e({
    type: 'string',
    format: 'uuid',
    check: 'string_format',
    abort: !1,
    version: 'v7',
    ...F(t),
  })
}
// @__NO_SIDE_EFFECTS__
function Hd(e, t) {
  return new e({
    type: 'string',
    format: 'url',
    check: 'string_format',
    abort: !1,
    ...F(t),
  })
}
// @__NO_SIDE_EFFECTS__
function qd(e, t) {
  return new e({
    type: 'string',
    format: 'emoji',
    check: 'string_format',
    abort: !1,
    ...F(t),
  })
}
// @__NO_SIDE_EFFECTS__
function Jd(e, t) {
  return new e({
    type: 'string',
    format: 'nanoid',
    check: 'string_format',
    abort: !1,
    ...F(t),
  })
}
// @__NO_SIDE_EFFECTS__
function Kd(e, t) {
  return new e({
    type: 'string',
    format: 'cuid',
    check: 'string_format',
    abort: !1,
    ...F(t),
  })
}
// @__NO_SIDE_EFFECTS__
function Gd(e, t) {
  return new e({
    type: 'string',
    format: 'cuid2',
    check: 'string_format',
    abort: !1,
    ...F(t),
  })
}
// @__NO_SIDE_EFFECTS__
function Xd(e, t) {
  return new e({
    type: 'string',
    format: 'ulid',
    check: 'string_format',
    abort: !1,
    ...F(t),
  })
}
// @__NO_SIDE_EFFECTS__
function Yd(e, t) {
  return new e({
    type: 'string',
    format: 'xid',
    check: 'string_format',
    abort: !1,
    ...F(t),
  })
}
// @__NO_SIDE_EFFECTS__
function Qd(e, t) {
  return new e({
    type: 'string',
    format: 'ksuid',
    check: 'string_format',
    abort: !1,
    ...F(t),
  })
}
// @__NO_SIDE_EFFECTS__
function ef(e, t) {
  return new e({
    type: 'string',
    format: 'ipv4',
    check: 'string_format',
    abort: !1,
    ...F(t),
  })
}
// @__NO_SIDE_EFFECTS__
function tf(e, t) {
  return new e({
    type: 'string',
    format: 'ipv6',
    check: 'string_format',
    abort: !1,
    ...F(t),
  })
}
// @__NO_SIDE_EFFECTS__
function nf(e, t) {
  return new e({
    type: 'string',
    format: 'cidrv4',
    check: 'string_format',
    abort: !1,
    ...F(t),
  })
}
// @__NO_SIDE_EFFECTS__
function rf(e, t) {
  return new e({
    type: 'string',
    format: 'cidrv6',
    check: 'string_format',
    abort: !1,
    ...F(t),
  })
}
// @__NO_SIDE_EFFECTS__
function of(e, t) {
  return new e({
    type: 'string',
    format: 'base64',
    check: 'string_format',
    abort: !1,
    ...F(t),
  })
}
// @__NO_SIDE_EFFECTS__
function sf(e, t) {
  return new e({
    type: 'string',
    format: 'base64url',
    check: 'string_format',
    abort: !1,
    ...F(t),
  })
}
// @__NO_SIDE_EFFECTS__
function af(e, t) {
  return new e({
    type: 'string',
    format: 'e164',
    check: 'string_format',
    abort: !1,
    ...F(t),
  })
}
// @__NO_SIDE_EFFECTS__
function cf(e, t) {
  return new e({
    type: 'string',
    format: 'jwt',
    check: 'string_format',
    abort: !1,
    ...F(t),
  })
}
// @__NO_SIDE_EFFECTS__
function uf(e, t) {
  return new e({
    type: 'string',
    format: 'datetime',
    check: 'string_format',
    offset: !1,
    local: !1,
    precision: null,
    ...F(t),
  })
}
// @__NO_SIDE_EFFECTS__
function lf(e, t) {
  return new e({
    type: 'string',
    format: 'date',
    check: 'string_format',
    ...F(t),
  })
}
// @__NO_SIDE_EFFECTS__
function df(e, t) {
  return new e({
    type: 'string',
    format: 'time',
    check: 'string_format',
    precision: null,
    ...F(t),
  })
}
// @__NO_SIDE_EFFECTS__
function ff(e, t) {
  return new e({
    type: 'string',
    format: 'duration',
    check: 'string_format',
    ...F(t),
  })
}
// @__NO_SIDE_EFFECTS__
function pf(e) {
  return new e({
    type: 'unknown',
  })
}
// @__NO_SIDE_EFFECTS__
function hf(e, t) {
  return new e({
    type: 'never',
    ...F(t),
  })
}
// @__NO_SIDE_EFFECTS__
function hi(e, t) {
  return new Il({
    check: 'max_length',
    ...F(t),
    maximum: e,
  })
}
// @__NO_SIDE_EFFECTS__
function en(e, t) {
  return new Ll({
    check: 'min_length',
    ...F(t),
    minimum: e,
  })
}
// @__NO_SIDE_EFFECTS__
function mi(e, t) {
  return new Vl({
    check: 'length_equals',
    ...F(t),
    length: e,
  })
}
// @__NO_SIDE_EFFECTS__
function mf(e, t) {
  return new Zl({
    check: 'string_format',
    format: 'regex',
    ...F(t),
    pattern: e,
  })
}
// @__NO_SIDE_EFFECTS__
function gf(e) {
  return new jl({
    check: 'string_format',
    format: 'lowercase',
    ...F(e),
  })
}
// @__NO_SIDE_EFFECTS__
function yf(e) {
  return new Ul({
    check: 'string_format',
    format: 'uppercase',
    ...F(e),
  })
}
// @__NO_SIDE_EFFECTS__
function vf(e, t) {
  return new Ml({
    check: 'string_format',
    format: 'includes',
    ...F(t),
    includes: e,
  })
}
// @__NO_SIDE_EFFECTS__
function bf(e, t) {
  return new Bl({
    check: 'string_format',
    format: 'starts_with',
    ...F(t),
    prefix: e,
  })
}
// @__NO_SIDE_EFFECTS__
function _f(e, t) {
  return new Wl({
    check: 'string_format',
    format: 'ends_with',
    ...F(t),
    suffix: e,
  })
}
// @__NO_SIDE_EFFECTS__
function ut(e) {
  return new Hl({
    check: 'overwrite',
    tx: e,
  })
}
// @__NO_SIDE_EFFECTS__
function wf(e) {
  return /* @__PURE__ */ ut((t) => t.normalize(e))
}
// @__NO_SIDE_EFFECTS__
function Ef() {
  return /* @__PURE__ */ ut((e) => e.trim())
}
// @__NO_SIDE_EFFECTS__
function Sf() {
  return /* @__PURE__ */ ut((e) => e.toLowerCase())
}
// @__NO_SIDE_EFFECTS__
function Of() {
  return /* @__PURE__ */ ut((e) => e.toUpperCase())
}
// @__NO_SIDE_EFFECTS__
function Cf() {
  return /* @__PURE__ */ ut((e) => Mu(e))
}
// @__NO_SIDE_EFFECTS__
function kf(e, t, n) {
  return new e({
    type: 'array',
    element: t,
    // get element() {
    //   return element;
    // },
    ...F(n),
  })
}
// @__NO_SIDE_EFFECTS__
function Rf(e, t, n) {
  return new e({
    type: 'custom',
    check: 'custom',
    fn: t,
    ...F(n),
  })
}
// @__NO_SIDE_EFFECTS__
function Af(e) {
  const t = /* @__PURE__ */ Nf(
    (n) => (
      (n.addIssue = (r) => {
        if (typeof r == 'string') n.issues.push(Et(r, n.value, t._zod.def))
        else {
          const o = r
          ;(o.fatal && (o.continue = !1),
            o.code ?? (o.code = 'custom'),
            o.input ?? (o.input = n.value),
            o.inst ?? (o.inst = t),
            o.continue ?? (o.continue = !t._zod.def.abort),
            n.issues.push(Et(o)))
        }
      }),
      e(n.value, n)
    ),
  )
  return t
}
// @__NO_SIDE_EFFECTS__
function Nf(e, t) {
  const n = new Pe({
    check: 'custom',
    ...F(t),
  })
  return ((n._zod.check = e), n)
}
function gi(e) {
  let t = e?.target ?? 'draft-2020-12'
  return (
    t === 'draft-4' && (t = 'draft-04'),
    t === 'draft-7' && (t = 'draft-07'),
    {
      processors: e.processors ?? {},
      metadataRegistry: e?.metadata ?? mt,
      target: t,
      unrepresentable: e?.unrepresentable ?? 'throw',
      override: e?.override ?? (() => {}),
      io: e?.io ?? 'output',
      counter: 0,
      seen: /* @__PURE__ */ new Map(),
      cycles: e?.cycles ?? 'ref',
      reused: e?.reused ?? 'inline',
      external: e?.external ?? void 0,
    }
  )
}
function ce(e, t, n = { path: [], schemaPath: [] }) {
  var r
  const o = e._zod.def,
    s = t.seen.get(e)
  if (s) return (s.count++, n.schemaPath.includes(e) && (s.cycle = n.path), s.schema)
  const i = { schema: {}, count: 1, cycle: void 0, path: n.path }
  t.seen.set(e, i)
  const a = e._zod.toJSONSchema?.()
  if (a) i.schema = a
  else {
    const l = {
      ...n,
      schemaPath: [...n.schemaPath, e],
      path: n.path,
    }
    if (e._zod.processJSONSchema) e._zod.processJSONSchema(t, i.schema, l)
    else {
      const m = i.schema,
        v = t.processors[o.type]
      if (!v) throw new Error(`[toJSONSchema]: Non-representable type encountered: ${o.type}`)
      v(e, t, m, l)
    }
    const d = e._zod.parent
    d && (i.ref || (i.ref = d), ce(d, t, l), (t.seen.get(d).isParent = !0))
  }
  const u = t.metadataRegistry.get(e)
  return (
    u && Object.assign(i.schema, u),
    t.io === 'input' && fe(e) && (delete i.schema.examples, delete i.schema.default),
    t.io === 'input' &&
      i.schema._prefault &&
      ((r = i.schema).default ?? (r.default = i.schema._prefault)),
    delete i.schema._prefault,
    t.seen.get(e).schema
  )
}
function yi(e, t) {
  const n = e.seen.get(t)
  if (!n) throw new Error('Unprocessed schema. This is a bug in Zod.')
  const r = /* @__PURE__ */ new Map()
  for (const i of e.seen.entries()) {
    const a = e.metadataRegistry.get(i[0])?.id
    if (a) {
      const u = r.get(a)
      if (u && u !== i[0])
        throw new Error(
          `Duplicate schema id "${a}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`,
        )
      r.set(a, i[0])
    }
  }
  const o = (i) => {
      const a = e.target === 'draft-2020-12' ? '$defs' : 'definitions'
      if (e.external) {
        const d = e.external.registry.get(i[0])?.id,
          m = e.external.uri ?? ((h) => h)
        if (d) return { ref: m(d) }
        const v = i[1].defId ?? i[1].schema.id ?? `schema${e.counter++}`
        return ((i[1].defId = v), { defId: v, ref: `${m('__shared')}#/${a}/${v}` })
      }
      if (i[1] === n) return { ref: '#' }
      const c = `#/${a}/`,
        l = i[1].schema.id ?? `__schema${e.counter++}`
      return { defId: l, ref: c + l }
    },
    s = (i) => {
      if (i[1].schema.$ref) return
      const a = i[1],
        { ref: u, defId: c } = o(i)
      ;((a.def = { ...a.schema }), c && (a.defId = c))
      const l = a.schema
      for (const d in l) delete l[d]
      l.$ref = u
    }
  if (e.cycles === 'throw')
    for (const i of e.seen.entries()) {
      const a = i[1]
      if (a.cycle)
        throw new Error(`Cycle detected: #/${a.cycle?.join('/')}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`)
    }
  for (const i of e.seen.entries()) {
    const a = i[1]
    if (t === i[0]) {
      s(i)
      continue
    }
    if (e.external) {
      const c = e.external.registry.get(i[0])?.id
      if (t !== i[0] && c) {
        s(i)
        continue
      }
    }
    if (e.metadataRegistry.get(i[0])?.id) {
      s(i)
      continue
    }
    if (a.cycle) {
      s(i)
      continue
    }
    if (a.count > 1 && e.reused === 'ref') {
      s(i)
      continue
    }
  }
}
function vi(e, t) {
  const n = e.seen.get(t)
  if (!n) throw new Error('Unprocessed schema. This is a bug in Zod.')
  const r = (i) => {
    const a = e.seen.get(i)
    if (a.ref === null) return
    const u = a.def ?? a.schema,
      c = { ...u },
      l = a.ref
    if (((a.ref = null), l)) {
      r(l)
      const m = e.seen.get(l),
        v = m.schema
      if (
        (v.$ref &&
        (e.target === 'draft-07' || e.target === 'draft-04' || e.target === 'openapi-3.0')
          ? ((u.allOf = u.allOf ?? []), u.allOf.push(v))
          : Object.assign(u, v),
        Object.assign(u, c),
        i._zod.parent === l)
      )
        for (const g in u) g === '$ref' || g === 'allOf' || g in c || delete u[g]
      if (v.$ref && m.def)
        for (const g in u)
          g === '$ref' ||
            g === 'allOf' ||
            (g in m.def && JSON.stringify(u[g]) === JSON.stringify(m.def[g]) && delete u[g])
    }
    const d = i._zod.parent
    if (d && d !== l) {
      r(d)
      const m = e.seen.get(d)
      if (m?.schema.$ref && ((u.$ref = m.schema.$ref), m.def))
        for (const v in u)
          v === '$ref' ||
            v === 'allOf' ||
            (v in m.def && JSON.stringify(u[v]) === JSON.stringify(m.def[v]) && delete u[v])
    }
    e.override({
      zodSchema: i,
      jsonSchema: u,
      path: a.path ?? [],
    })
  }
  for (const i of [...e.seen.entries()].reverse()) r(i[0])
  const o = {}
  if (
    (e.target === 'draft-2020-12'
      ? (o.$schema = 'https://json-schema.org/draft/2020-12/schema')
      : e.target === 'draft-07'
        ? (o.$schema = 'http://json-schema.org/draft-07/schema#')
        : e.target === 'draft-04'
          ? (o.$schema = 'http://json-schema.org/draft-04/schema#')
          : e.target,
    e.external?.uri)
  ) {
    const i = e.external.registry.get(t)?.id
    if (!i) throw new Error('Schema is missing an `id` property')
    o.$id = e.external.uri(i)
  }
  Object.assign(o, n.def ?? n.schema)
  const s = e.external?.defs ?? {}
  for (const i of e.seen.entries()) {
    const a = i[1]
    a.def && a.defId && (s[a.defId] = a.def)
  }
  e.external ||
    (Object.keys(s).length > 0 &&
      (e.target === 'draft-2020-12' ? (o.$defs = s) : (o.definitions = s)))
  try {
    const i = JSON.parse(JSON.stringify(o))
    return (
      Object.defineProperty(i, '~standard', {
        value: {
          ...t['~standard'],
          jsonSchema: {
            input: tn(t, 'input', e.processors),
            output: tn(t, 'output', e.processors),
          },
        },
        enumerable: !1,
        writable: !1,
      }),
      i
    )
  } catch {
    throw new Error('Error converting schema to JSON.')
  }
}
function fe(e, t) {
  const n = t ?? { seen: /* @__PURE__ */ new Set() }
  if (n.seen.has(e)) return !1
  n.seen.add(e)
  const r = e._zod.def
  if (r.type === 'transform') return !0
  if (r.type === 'array') return fe(r.element, n)
  if (r.type === 'set') return fe(r.valueType, n)
  if (r.type === 'lazy') return fe(r.getter(), n)
  if (
    r.type === 'promise' ||
    r.type === 'optional' ||
    r.type === 'nonoptional' ||
    r.type === 'nullable' ||
    r.type === 'readonly' ||
    r.type === 'default' ||
    r.type === 'prefault'
  )
    return fe(r.innerType, n)
  if (r.type === 'intersection') return fe(r.left, n) || fe(r.right, n)
  if (r.type === 'record' || r.type === 'map') return fe(r.keyType, n) || fe(r.valueType, n)
  if (r.type === 'pipe') return fe(r.in, n) || fe(r.out, n)
  if (r.type === 'object') {
    for (const o in r.shape) if (fe(r.shape[o], n)) return !0
    return !1
  }
  if (r.type === 'union') {
    for (const o of r.options) if (fe(o, n)) return !0
    return !1
  }
  if (r.type === 'tuple') {
    for (const o of r.items) if (fe(o, n)) return !0
    return !!(r.rest && fe(r.rest, n))
  }
  return !1
}
const Pf =
    (e, t = {}) =>
    (n) => {
      const r = gi({ ...n, processors: t })
      return (ce(e, r), yi(r, e), vi(r, e))
    },
  tn =
    (e, t, n = {}) =>
    (r) => {
      const { libraryOptions: o, target: s } = r ?? {},
        i = gi({ ...(o ?? {}), target: s, io: t, processors: n })
      return (ce(e, i), yi(i, e), vi(i, e))
    },
  Tf = {
    guid: 'uuid',
    url: 'uri',
    datetime: 'date-time',
    json_string: 'json-string',
    regex: '',
    // do not set
  },
  xf = (e, t, n, r) => {
    const o = n
    o.type = 'string'
    const { minimum: s, maximum: i, format: a, patterns: u, contentEncoding: c } = e._zod.bag
    if (
      (typeof s == 'number' && (o.minLength = s),
      typeof i == 'number' && (o.maxLength = i),
      a &&
        ((o.format = Tf[a] ?? a),
        o.format === '' && delete o.format,
        a === 'time' && delete o.format),
      c && (o.contentEncoding = c),
      u && u.size > 0)
    ) {
      const l = [...u]
      l.length === 1
        ? (o.pattern = l[0].source)
        : l.length > 1 &&
          (o.allOf = [
            ...l.map((d) => ({
              ...(t.target === 'draft-07' || t.target === 'draft-04' || t.target === 'openapi-3.0'
                ? { type: 'string' }
                : {}),
              pattern: d.source,
            })),
          ])
    }
  },
  Df = (e, t, n, r) => {
    n.not = {}
  },
  zf = (e, t, n, r) => {},
  $f = (e, t, n, r) => {
    const o = e._zod.def,
      s = ni(o.entries)
    ;(s.every((i) => typeof i == 'number') && (n.type = 'number'),
      s.every((i) => typeof i == 'string') && (n.type = 'string'),
      (n.enum = s))
  },
  Ff = (e, t, n, r) => {
    if (t.unrepresentable === 'throw')
      throw new Error('Custom types cannot be represented in JSON Schema')
  },
  If = (e, t, n, r) => {
    if (t.unrepresentable === 'throw')
      throw new Error('Transforms cannot be represented in JSON Schema')
  },
  Lf = (e, t, n, r) => {
    const o = n,
      s = e._zod.def,
      { minimum: i, maximum: a } = e._zod.bag
    ;(typeof i == 'number' && (o.minItems = i),
      typeof a == 'number' && (o.maxItems = a),
      (o.type = 'array'),
      (o.items = ce(s.element, t, { ...r, path: [...r.path, 'items'] })))
  },
  Vf = (e, t, n, r) => {
    const o = n,
      s = e._zod.def
    ;((o.type = 'object'), (o.properties = {}))
    const i = s.shape
    for (const c in i)
      o.properties[c] = ce(i[c], t, {
        ...r,
        path: [...r.path, 'properties', c],
      })
    const a = new Set(Object.keys(i)),
      u = new Set(
        [...a].filter((c) => {
          const l = s.shape[c]._zod
          return t.io === 'input' ? l.optin === void 0 : l.optout === void 0
        }),
      )
    ;(u.size > 0 && (o.required = Array.from(u)),
      s.catchall?._zod.def.type === 'never'
        ? (o.additionalProperties = !1)
        : s.catchall
          ? s.catchall &&
            (o.additionalProperties = ce(s.catchall, t, {
              ...r,
              path: [...r.path, 'additionalProperties'],
            }))
          : t.io === 'output' && (o.additionalProperties = !1))
  },
  Zf = (e, t, n, r) => {
    const o = e._zod.def,
      s = o.inclusive === !1,
      i = o.options.map((a, u) =>
        ce(a, t, {
          ...r,
          path: [...r.path, s ? 'oneOf' : 'anyOf', u],
        }),
      )
    s ? (n.oneOf = i) : (n.anyOf = i)
  },
  jf = (e, t, n, r) => {
    const o = e._zod.def,
      s = ce(o.left, t, {
        ...r,
        path: [...r.path, 'allOf', 0],
      }),
      i = ce(o.right, t, {
        ...r,
        path: [...r.path, 'allOf', 1],
      }),
      a = (c) => 'allOf' in c && Object.keys(c).length === 1,
      u = [...(a(s) ? s.allOf : [s]), ...(a(i) ? i.allOf : [i])]
    n.allOf = u
  },
  Uf = (e, t, n, r) => {
    const o = e._zod.def,
      s = ce(o.innerType, t, r),
      i = t.seen.get(e)
    t.target === 'openapi-3.0'
      ? ((i.ref = o.innerType), (n.nullable = !0))
      : (n.anyOf = [s, { type: 'null' }])
  },
  Mf = (e, t, n, r) => {
    const o = e._zod.def
    ce(o.innerType, t, r)
    const s = t.seen.get(e)
    s.ref = o.innerType
  },
  Bf = (e, t, n, r) => {
    const o = e._zod.def
    ce(o.innerType, t, r)
    const s = t.seen.get(e)
    ;((s.ref = o.innerType), (n.default = JSON.parse(JSON.stringify(o.defaultValue))))
  },
  Wf = (e, t, n, r) => {
    const o = e._zod.def
    ce(o.innerType, t, r)
    const s = t.seen.get(e)
    ;((s.ref = o.innerType),
      t.io === 'input' && (n._prefault = JSON.parse(JSON.stringify(o.defaultValue))))
  },
  Hf = (e, t, n, r) => {
    const o = e._zod.def
    ce(o.innerType, t, r)
    const s = t.seen.get(e)
    s.ref = o.innerType
    let i
    try {
      i = o.catchValue(void 0)
    } catch {
      throw new Error('Dynamic catch values are not supported in JSON Schema')
    }
    n.default = i
  },
  qf = (e, t, n, r) => {
    const o = e._zod.def,
      s = t.io === 'input' ? (o.in._zod.def.type === 'transform' ? o.out : o.in) : o.out
    ce(s, t, r)
    const i = t.seen.get(e)
    i.ref = s
  },
  Jf = (e, t, n, r) => {
    const o = e._zod.def
    ce(o.innerType, t, r)
    const s = t.seen.get(e)
    ;((s.ref = o.innerType), (n.readOnly = !0))
  },
  bi = (e, t, n, r) => {
    const o = e._zod.def
    ce(o.innerType, t, r)
    const s = t.seen.get(e)
    s.ref = o.innerType
  }
function xo(e, t) {
  try {
    var n = e()
  } catch (r) {
    return t(r)
  }
  return n && n.then ? n.then(void 0, t) : n
}
function Kf(e, t) {
  for (var n = {}; e.length; ) {
    var r = e[0],
      o = r.code,
      s = r.message,
      i = r.path.join('.')
    if (!n[i])
      if ('unionErrors' in r) {
        var a = r.unionErrors[0].errors[0]
        n[i] = { message: a.message, type: a.code }
      } else n[i] = { message: s, type: o }
    if (
      ('unionErrors' in r &&
        r.unionErrors.forEach(function (l) {
          return l.errors.forEach(function (d) {
            return e.push(d)
          })
        }),
      t)
    ) {
      var u = n[i].types,
        c = u && u[r.code]
      n[i] = _r(i, t, n, o, c ? [].concat(c, r.message) : r.message)
    }
    e.shift()
  }
  return n
}
function Gf(e, t) {
  for (var n = {}; e.length; ) {
    var r = e[0],
      o = r.code,
      s = r.message,
      i = r.path.join('.')
    if (!n[i])
      if (r.code === 'invalid_union' && r.errors.length > 0) {
        var a = r.errors[0][0]
        n[i] = { message: a.message, type: a.code }
      } else n[i] = { message: s, type: o }
    if (
      (r.code === 'invalid_union' &&
        r.errors.forEach(function (l) {
          return l.forEach(function (d) {
            return e.push(d)
          })
        }),
      t)
    ) {
      var u = n[i].types,
        c = u && u[r.code]
      n[i] = _r(i, t, n, o, c ? [].concat(c, r.message) : r.message)
    }
    e.shift()
  }
  return n
}
function Xf(e, t, n) {
  if (
    (n === void 0 && (n = {}),
    (function (r) {
      return '_def' in r && typeof r._def == 'object' && 'typeName' in r._def
    })(e))
  )
    return function (r, o, s) {
      try {
        return Promise.resolve(
          xo(
            function () {
              return Promise.resolve(e[n.mode === 'sync' ? 'parse' : 'parseAsync'](r, t)).then(
                function (i) {
                  return (
                    s.shouldUseNativeValidation && qn({}, s),
                    { errors: {}, values: n.raw ? Object.assign({}, r) : i }
                  )
                },
              )
            },
            function (i) {
              if (
                (function (a) {
                  return Array.isArray(a?.issues)
                })(i)
              )
                return {
                  values: {},
                  errors: yo(
                    Kf(i.errors, !s.shouldUseNativeValidation && s.criteriaMode === 'all'),
                    s,
                  ),
                }
              throw i
            },
          ),
        )
      } catch (i) {
        return Promise.reject(i)
      }
    }
  if (
    (function (r) {
      return '_zod' in r && typeof r._zod == 'object'
    })(e)
  )
    return function (r, o, s) {
      try {
        return Promise.resolve(
          xo(
            function () {
              return Promise.resolve((n.mode === 'sync' ? nl : rl)(e, r, t)).then(function (i) {
                return (
                  s.shouldUseNativeValidation && qn({}, s),
                  { errors: {}, values: n.raw ? Object.assign({}, r) : i }
                )
              })
            },
            function (i) {
              if (
                (function (a) {
                  return a instanceof Rr
                })(i)
              )
                return {
                  values: {},
                  errors: yo(
                    Gf(i.issues, !s.shouldUseNativeValidation && s.criteriaMode === 'all'),
                    s,
                  ),
                }
              throw i
            },
          ),
        )
      } catch (i) {
        return Promise.reject(i)
      }
    }
  throw new Error('Invalid input: not a Zod schema')
}
function _i(e, t) {
  return function () {
    return e.apply(t, arguments)
  }
}
const { toString: Yf } = Object.prototype,
  { getPrototypeOf: Nr } = Object,
  { iterator: yn, toStringTag: wi } = Symbol,
  vn = /* @__PURE__ */ ((e) => (t) => {
    const n = Yf.call(t)
    return e[n] || (e[n] = n.slice(8, -1).toLowerCase())
  })(/* @__PURE__ */ Object.create(null)),
  Re = (e) => ((e = e.toLowerCase()), (t) => vn(t) === e),
  bn = (e) => (t) => typeof t === e,
  { isArray: lt } = Array,
  at = bn('undefined')
function Ot(e) {
  return (
    e !== null &&
    !at(e) &&
    e.constructor !== null &&
    !at(e.constructor) &&
    ye(e.constructor.isBuffer) &&
    e.constructor.isBuffer(e)
  )
}
const Ei = Re('ArrayBuffer')
function Qf(e) {
  let t
  return (
    typeof ArrayBuffer < 'u' && ArrayBuffer.isView
      ? (t = ArrayBuffer.isView(e))
      : (t = e && e.buffer && Ei(e.buffer)),
    t
  )
}
const ep = bn('string'),
  ye = bn('function'),
  Si = bn('number'),
  Ct = (e) => e !== null && typeof e == 'object',
  tp = (e) => e === !0 || e === !1,
  Zt = (e) => {
    if (vn(e) !== 'object') return !1
    const t = Nr(e)
    return (
      (t === null || t === Object.prototype || Object.getPrototypeOf(t) === null) &&
      !(wi in e) &&
      !(yn in e)
    )
  },
  np = (e) => {
    if (!Ct(e) || Ot(e)) return !1
    try {
      return Object.keys(e).length === 0 && Object.getPrototypeOf(e) === Object.prototype
    } catch {
      return !1
    }
  },
  rp = Re('Date'),
  op = Re('File'),
  sp = Re('Blob'),
  ip = Re('FileList'),
  ap = (e) => Ct(e) && ye(e.pipe),
  cp = (e) => {
    let t
    return (
      e &&
      ((typeof FormData == 'function' && e instanceof FormData) ||
        (ye(e.append) &&
          ((t = vn(e)) === 'formdata' || // detect form-data instance
            (t === 'object' && ye(e.toString) && e.toString() === '[object FormData]'))))
    )
  },
  up = Re('URLSearchParams'),
  [lp, dp, fp, pp] = ['ReadableStream', 'Request', 'Response', 'Headers'].map(Re),
  hp = (e) => (e.trim ? e.trim() : e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, ''))
function kt(e, t, { allOwnKeys: n = !1 } = {}) {
  if (e === null || typeof e > 'u') return
  let r, o
  if ((typeof e != 'object' && (e = [e]), lt(e)))
    for (r = 0, o = e.length; r < o; r++) t.call(null, e[r], r, e)
  else {
    if (Ot(e)) return
    const s = n ? Object.getOwnPropertyNames(e) : Object.keys(e),
      i = s.length
    let a
    for (r = 0; r < i; r++) ((a = s[r]), t.call(null, e[a], a, e))
  }
}
function Oi(e, t) {
  if (Ot(e)) return null
  t = t.toLowerCase()
  const n = Object.keys(e)
  let r = n.length,
    o
  for (; r-- > 0; ) if (((o = n[r]), t === o.toLowerCase())) return o
  return null
}
const We =
    typeof globalThis < 'u'
      ? globalThis
      : typeof self < 'u'
        ? self
        : typeof window < 'u'
          ? window
          : global,
  Ci = (e) => !at(e) && e !== We
function Gn() {
  const { caseless: e, skipUndefined: t } = (Ci(this) && this) || {},
    n = {},
    r = (o, s) => {
      const i = (e && Oi(n, s)) || s
      Zt(n[i]) && Zt(o)
        ? (n[i] = Gn(n[i], o))
        : Zt(o)
          ? (n[i] = Gn({}, o))
          : lt(o)
            ? (n[i] = o.slice())
            : (!t || !at(o)) && (n[i] = o)
    }
  for (let o = 0, s = arguments.length; o < s; o++) arguments[o] && kt(arguments[o], r)
  return n
}
const mp = (e, t, n, { allOwnKeys: r } = {}) => (
    kt(
      t,
      (o, s) => {
        n && ye(o) ? (e[s] = _i(o, n)) : (e[s] = o)
      },
      { allOwnKeys: r },
    ),
    e
  ),
  gp = (e) => (e.charCodeAt(0) === 65279 && (e = e.slice(1)), e),
  yp = (e, t, n, r) => {
    ;((e.prototype = Object.create(t.prototype, r)),
      (e.prototype.constructor = e),
      Object.defineProperty(e, 'super', {
        value: t.prototype,
      }),
      n && Object.assign(e.prototype, n))
  },
  vp = (e, t, n, r) => {
    let o, s, i
    const a = {}
    if (((t = t || {}), e == null)) return t
    do {
      for (o = Object.getOwnPropertyNames(e), s = o.length; s-- > 0; )
        ((i = o[s]), (!r || r(i, e, t)) && !a[i] && ((t[i] = e[i]), (a[i] = !0)))
      e = n !== !1 && Nr(e)
    } while (e && (!n || n(e, t)) && e !== Object.prototype)
    return t
  },
  bp = (e, t, n) => {
    ;((e = String(e)), (n === void 0 || n > e.length) && (n = e.length), (n -= t.length))
    const r = e.indexOf(t, n)
    return r !== -1 && r === n
  },
  _p = (e) => {
    if (!e) return null
    if (lt(e)) return e
    let t = e.length
    if (!Si(t)) return null
    const n = new Array(t)
    for (; t-- > 0; ) n[t] = e[t]
    return n
  },
  wp = /* @__PURE__ */ (
    (e) => (t) =>
      e && t instanceof e
  )(typeof Uint8Array < 'u' && Nr(Uint8Array)),
  Ep = (e, t) => {
    const r = (e && e[yn]).call(e)
    let o
    for (; (o = r.next()) && !o.done; ) {
      const s = o.value
      t.call(e, s[0], s[1])
    }
  },
  Sp = (e, t) => {
    let n
    const r = []
    for (; (n = e.exec(t)) !== null; ) r.push(n)
    return r
  },
  Op = Re('HTMLFormElement'),
  Cp = (e) =>
    e.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g, function (n, r, o) {
      return r.toUpperCase() + o
    }),
  Do = (
    ({ hasOwnProperty: e }) =>
    (t, n) =>
      e.call(t, n)
  )(Object.prototype),
  kp = Re('RegExp'),
  ki = (e, t) => {
    const n = Object.getOwnPropertyDescriptors(e),
      r = {}
    ;(kt(n, (o, s) => {
      let i
      ;(i = t(o, s, e)) !== !1 && (r[s] = i || o)
    }),
      Object.defineProperties(e, r))
  },
  Rp = (e) => {
    ki(e, (t, n) => {
      if (ye(e) && ['arguments', 'caller', 'callee'].indexOf(n) !== -1) return !1
      const r = e[n]
      if (ye(r)) {
        if (((t.enumerable = !1), 'writable' in t)) {
          t.writable = !1
          return
        }
        t.set ||
          (t.set = () => {
            throw Error("Can not rewrite read-only method '" + n + "'")
          })
      }
    })
  },
  Ap = (e, t) => {
    const n = {},
      r = (o) => {
        o.forEach((s) => {
          n[s] = !0
        })
      }
    return (lt(e) ? r(e) : r(String(e).split(t)), n)
  },
  Np = () => {},
  Pp = (e, t) => (e != null && Number.isFinite((e = +e)) ? e : t)
function Tp(e) {
  return !!(e && ye(e.append) && e[wi] === 'FormData' && e[yn])
}
const xp = (e) => {
    const t = new Array(10),
      n = (r, o) => {
        if (Ct(r)) {
          if (t.indexOf(r) >= 0) return
          if (Ot(r)) return r
          if (!('toJSON' in r)) {
            t[o] = r
            const s = lt(r) ? [] : {}
            return (
              kt(r, (i, a) => {
                const u = n(i, o + 1)
                !at(u) && (s[a] = u)
              }),
              (t[o] = void 0),
              s
            )
          }
        }
        return r
      }
    return n(e, 0)
  },
  Dp = Re('AsyncFunction'),
  zp = (e) => e && (Ct(e) || ye(e)) && ye(e.then) && ye(e.catch),
  Ri = ((e, t) =>
    e
      ? setImmediate
      : t
        ? ((n, r) => (
            We.addEventListener(
              'message',
              ({ source: o, data: s }) => {
                o === We && s === n && r.length && r.shift()()
              },
              !1,
            ),
            (o) => {
              ;(r.push(o), We.postMessage(n, '*'))
            }
          ))(`axios@${Math.random()}`, [])
        : (n) => setTimeout(n))(typeof setImmediate == 'function', ye(We.postMessage)),
  $p =
    typeof queueMicrotask < 'u'
      ? queueMicrotask.bind(We)
      : (typeof process < 'u' && process.nextTick) || Ri,
  Fp = (e) => e != null && ye(e[yn]),
  b = {
    isArray: lt,
    isArrayBuffer: Ei,
    isBuffer: Ot,
    isFormData: cp,
    isArrayBufferView: Qf,
    isString: ep,
    isNumber: Si,
    isBoolean: tp,
    isObject: Ct,
    isPlainObject: Zt,
    isEmptyObject: np,
    isReadableStream: lp,
    isRequest: dp,
    isResponse: fp,
    isHeaders: pp,
    isUndefined: at,
    isDate: rp,
    isFile: op,
    isBlob: sp,
    isRegExp: kp,
    isFunction: ye,
    isStream: ap,
    isURLSearchParams: up,
    isTypedArray: wp,
    isFileList: ip,
    forEach: kt,
    merge: Gn,
    extend: mp,
    trim: hp,
    stripBOM: gp,
    inherits: yp,
    toFlatObject: vp,
    kindOf: vn,
    kindOfTest: Re,
    endsWith: bp,
    toArray: _p,
    forEachEntry: Ep,
    matchAll: Sp,
    isHTMLForm: Op,
    hasOwnProperty: Do,
    hasOwnProp: Do,
    // an alias to avoid ESLint no-prototype-builtins detection
    reduceDescriptors: ki,
    freezeMethods: Rp,
    toObjectSet: Ap,
    toCamelCase: Cp,
    noop: Np,
    toFiniteNumber: Pp,
    findKey: Oi,
    global: We,
    isContextDefined: Ci,
    isSpecCompliantForm: Tp,
    toJSONObject: xp,
    isAsyncFn: Dp,
    isThenable: zp,
    setImmediate: Ri,
    asap: $p,
    isIterable: Fp,
  }
function L(e, t, n, r, o) {
  ;(Error.call(this),
    Error.captureStackTrace
      ? Error.captureStackTrace(this, this.constructor)
      : (this.stack = new Error().stack),
    (this.message = e),
    (this.name = 'AxiosError'),
    t && (this.code = t),
    n && (this.config = n),
    r && (this.request = r),
    o && ((this.response = o), (this.status = o.status ? o.status : null)))
}
b.inherits(L, Error, {
  toJSON: function () {
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
      config: b.toJSONObject(this.config),
      code: this.code,
      status: this.status,
    }
  },
})
const Ai = L.prototype,
  Ni = {}
;[
  'ERR_BAD_OPTION_VALUE',
  'ERR_BAD_OPTION',
  'ECONNABORTED',
  'ETIMEDOUT',
  'ERR_NETWORK',
  'ERR_FR_TOO_MANY_REDIRECTS',
  'ERR_DEPRECATED',
  'ERR_BAD_RESPONSE',
  'ERR_BAD_REQUEST',
  'ERR_CANCELED',
  'ERR_NOT_SUPPORT',
  'ERR_INVALID_URL',
].forEach((e) => {
  Ni[e] = { value: e }
})
Object.defineProperties(L, Ni)
Object.defineProperty(Ai, 'isAxiosError', { value: !0 })
L.from = (e, t, n, r, o, s) => {
  const i = Object.create(Ai)
  b.toFlatObject(
    e,
    i,
    function (l) {
      return l !== Error.prototype
    },
    (c) => c !== 'isAxiosError',
  )
  const a = e && e.message ? e.message : 'Error',
    u = t == null && e ? e.code : t
  return (
    L.call(i, a, u, n, r, o),
    e && i.cause == null && Object.defineProperty(i, 'cause', { value: e, configurable: !0 }),
    (i.name = (e && e.name) || 'Error'),
    s && Object.assign(i, s),
    i
  )
}
const Ip = null
function Xn(e) {
  return b.isPlainObject(e) || b.isArray(e)
}
function Pi(e) {
  return b.endsWith(e, '[]') ? e.slice(0, -2) : e
}
function zo(e, t, n) {
  return e
    ? e
        .concat(t)
        .map(function (o, s) {
          return ((o = Pi(o)), !n && s ? '[' + o + ']' : o)
        })
        .join(n ? '.' : '')
    : t
}
function Lp(e) {
  return b.isArray(e) && !e.some(Xn)
}
const Vp = b.toFlatObject(b, {}, null, function (t) {
  return /^is[A-Z]/.test(t)
})
function _n(e, t, n) {
  if (!b.isObject(e)) throw new TypeError('target must be an object')
  ;((t = t || new FormData()),
    (n = b.toFlatObject(
      n,
      {
        metaTokens: !0,
        dots: !1,
        indexes: !1,
      },
      !1,
      function (g, _) {
        return !b.isUndefined(_[g])
      },
    )))
  const r = n.metaTokens,
    o = n.visitor || l,
    s = n.dots,
    i = n.indexes,
    u = (n.Blob || (typeof Blob < 'u' && Blob)) && b.isSpecCompliantForm(t)
  if (!b.isFunction(o)) throw new TypeError('visitor must be a function')
  function c(h) {
    if (h === null) return ''
    if (b.isDate(h)) return h.toISOString()
    if (b.isBoolean(h)) return h.toString()
    if (!u && b.isBlob(h)) throw new L('Blob is not supported. Use a Buffer instead.')
    return b.isArrayBuffer(h) || b.isTypedArray(h)
      ? u && typeof Blob == 'function'
        ? new Blob([h])
        : Buffer.from(h)
      : h
  }
  function l(h, g, _) {
    let P = h
    if (h && !_ && typeof h == 'object') {
      if (b.endsWith(g, '{}')) ((g = r ? g : g.slice(0, -2)), (h = JSON.stringify(h)))
      else if (
        (b.isArray(h) && Lp(h)) ||
        ((b.isFileList(h) || b.endsWith(g, '[]')) && (P = b.toArray(h)))
      )
        return (
          (g = Pi(g)),
          P.forEach(function (x, O) {
            !(b.isUndefined(x) || x === null) &&
              t.append(i === !0 ? zo([g], O, s) : i === null ? g : g + '[]', c(x))
          }),
          !1
        )
    }
    return Xn(h) ? !0 : (t.append(zo(_, g, s), c(h)), !1)
  }
  const d = [],
    m = Object.assign(Vp, {
      defaultVisitor: l,
      convertValue: c,
      isVisitable: Xn,
    })
  function v(h, g) {
    if (!b.isUndefined(h)) {
      if (d.indexOf(h) !== -1) throw Error('Circular reference detected in ' + g.join('.'))
      ;(d.push(h),
        b.forEach(h, function (P, A) {
          ;(!(b.isUndefined(P) || P === null) &&
            o.call(t, P, b.isString(A) ? A.trim() : A, g, m)) === !0 && v(P, g ? g.concat(A) : [A])
        }),
        d.pop())
    }
  }
  if (!b.isObject(e)) throw new TypeError('data must be an object')
  return (v(e), t)
}
function $o(e) {
  const t = {
    '!': '%21',
    "'": '%27',
    '(': '%28',
    ')': '%29',
    '~': '%7E',
    '%20': '+',
    '%00': '\0',
  }
  return encodeURIComponent(e).replace(/[!'()~]|%20|%00/g, function (r) {
    return t[r]
  })
}
function Pr(e, t) {
  ;((this._pairs = []), e && _n(e, this, t))
}
const Ti = Pr.prototype
Ti.append = function (t, n) {
  this._pairs.push([t, n])
}
Ti.toString = function (t) {
  const n = t
    ? function (r) {
        return t.call(this, r, $o)
      }
    : $o
  return this._pairs
    .map(function (o) {
      return n(o[0]) + '=' + n(o[1])
    }, '')
    .join('&')
}
function Zp(e) {
  return encodeURIComponent(e)
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
}
function xi(e, t, n) {
  if (!t) return e
  const r = (n && n.encode) || Zp
  b.isFunction(n) &&
    (n = {
      serialize: n,
    })
  const o = n && n.serialize
  let s
  if (
    (o ? (s = o(t, n)) : (s = b.isURLSearchParams(t) ? t.toString() : new Pr(t, n).toString(r)), s)
  ) {
    const i = e.indexOf('#')
    ;(i !== -1 && (e = e.slice(0, i)), (e += (e.indexOf('?') === -1 ? '?' : '&') + s))
  }
  return e
}
class Fo {
  constructor() {
    this.handlers = []
  }
  /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   *
   * @return {Number} An ID used to remove interceptor later
   */
  use(t, n, r) {
    return (
      this.handlers.push({
        fulfilled: t,
        rejected: n,
        synchronous: r ? r.synchronous : !1,
        runWhen: r ? r.runWhen : null,
      }),
      this.handlers.length - 1
    )
  }
  /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   *
   * @returns {void}
   */
  eject(t) {
    this.handlers[t] && (this.handlers[t] = null)
  }
  /**
   * Clear all interceptors from the stack
   *
   * @returns {void}
   */
  clear() {
    this.handlers && (this.handlers = [])
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
    b.forEach(this.handlers, function (r) {
      r !== null && t(r)
    })
  }
}
const Di = {
    silentJSONParsing: !0,
    forcedJSONParsing: !0,
    clarifyTimeoutError: !1,
  },
  jp = typeof URLSearchParams < 'u' ? URLSearchParams : Pr,
  Up = typeof FormData < 'u' ? FormData : null,
  Mp = typeof Blob < 'u' ? Blob : null,
  Bp = {
    isBrowser: !0,
    classes: {
      URLSearchParams: jp,
      FormData: Up,
      Blob: Mp,
    },
    protocols: ['http', 'https', 'file', 'blob', 'url', 'data'],
  },
  Tr = typeof window < 'u' && typeof document < 'u',
  Yn = (typeof navigator == 'object' && navigator) || void 0,
  Wp = Tr && (!Yn || ['ReactNative', 'NativeScript', 'NS'].indexOf(Yn.product) < 0),
  Hp =
    typeof WorkerGlobalScope < 'u' &&
    self instanceof WorkerGlobalScope &&
    typeof self.importScripts == 'function',
  qp = (Tr && window.location.href) || 'http://localhost',
  Jp = /* @__PURE__ */ Object.freeze(
    /* @__PURE__ */ Object.defineProperty(
      {
        __proto__: null,
        hasBrowserEnv: Tr,
        hasStandardBrowserEnv: Wp,
        hasStandardBrowserWebWorkerEnv: Hp,
        navigator: Yn,
        origin: qp,
      },
      Symbol.toStringTag,
      { value: 'Module' },
    ),
  ),
  le = {
    ...Jp,
    ...Bp,
  }
function Kp(e, t) {
  return _n(e, new le.classes.URLSearchParams(), {
    visitor: function (n, r, o, s) {
      return le.isNode && b.isBuffer(n)
        ? (this.append(r, n.toString('base64')), !1)
        : s.defaultVisitor.apply(this, arguments)
    },
    ...t,
  })
}
function Gp(e) {
  return b.matchAll(/\w+|\[(\w*)]/g, e).map((t) => (t[0] === '[]' ? '' : t[1] || t[0]))
}
function Xp(e) {
  const t = {},
    n = Object.keys(e)
  let r
  const o = n.length
  let s
  for (r = 0; r < o; r++) ((s = n[r]), (t[s] = e[s]))
  return t
}
function zi(e) {
  function t(n, r, o, s) {
    let i = n[s++]
    if (i === '__proto__') return !0
    const a = Number.isFinite(+i),
      u = s >= n.length
    return (
      (i = !i && b.isArray(o) ? o.length : i),
      u
        ? (b.hasOwnProp(o, i) ? (o[i] = [o[i], r]) : (o[i] = r), !a)
        : ((!o[i] || !b.isObject(o[i])) && (o[i] = []),
          t(n, r, o[i], s) && b.isArray(o[i]) && (o[i] = Xp(o[i])),
          !a)
    )
  }
  if (b.isFormData(e) && b.isFunction(e.entries)) {
    const n = {}
    return (
      b.forEachEntry(e, (r, o) => {
        t(Gp(r), o, n, 0)
      }),
      n
    )
  }
  return null
}
function Yp(e, t, n) {
  if (b.isString(e))
    try {
      return ((t || JSON.parse)(e), b.trim(e))
    } catch (r) {
      if (r.name !== 'SyntaxError') throw r
    }
  return (n || JSON.stringify)(e)
}
const Rt = {
  transitional: Di,
  adapter: ['xhr', 'http', 'fetch'],
  transformRequest: [
    function (t, n) {
      const r = n.getContentType() || '',
        o = r.indexOf('application/json') > -1,
        s = b.isObject(t)
      if ((s && b.isHTMLForm(t) && (t = new FormData(t)), b.isFormData(t)))
        return o ? JSON.stringify(zi(t)) : t
      if (
        b.isArrayBuffer(t) ||
        b.isBuffer(t) ||
        b.isStream(t) ||
        b.isFile(t) ||
        b.isBlob(t) ||
        b.isReadableStream(t)
      )
        return t
      if (b.isArrayBufferView(t)) return t.buffer
      if (b.isURLSearchParams(t))
        return (
          n.setContentType('application/x-www-form-urlencoded;charset=utf-8', !1),
          t.toString()
        )
      let a
      if (s) {
        if (r.indexOf('application/x-www-form-urlencoded') > -1)
          return Kp(t, this.formSerializer).toString()
        if ((a = b.isFileList(t)) || r.indexOf('multipart/form-data') > -1) {
          const u = this.env && this.env.FormData
          return _n(a ? { 'files[]': t } : t, u && new u(), this.formSerializer)
        }
      }
      return s || o ? (n.setContentType('application/json', !1), Yp(t)) : t
    },
  ],
  transformResponse: [
    function (t) {
      const n = this.transitional || Rt.transitional,
        r = n && n.forcedJSONParsing,
        o = this.responseType === 'json'
      if (b.isResponse(t) || b.isReadableStream(t)) return t
      if (t && b.isString(t) && ((r && !this.responseType) || o)) {
        const i = !(n && n.silentJSONParsing) && o
        try {
          return JSON.parse(t, this.parseReviver)
        } catch (a) {
          if (i)
            throw a.name === 'SyntaxError'
              ? L.from(a, L.ERR_BAD_RESPONSE, this, null, this.response)
              : a
        }
      }
      return t
    },
  ],
  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  maxContentLength: -1,
  maxBodyLength: -1,
  env: {
    FormData: le.classes.FormData,
    Blob: le.classes.Blob,
  },
  validateStatus: function (t) {
    return t >= 200 && t < 300
  },
  headers: {
    common: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': void 0,
    },
  },
}
b.forEach(['delete', 'get', 'head', 'post', 'put', 'patch'], (e) => {
  Rt.headers[e] = {}
})
const Qp = b.toObjectSet([
    'age',
    'authorization',
    'content-length',
    'content-type',
    'etag',
    'expires',
    'from',
    'host',
    'if-modified-since',
    'if-unmodified-since',
    'last-modified',
    'location',
    'max-forwards',
    'proxy-authorization',
    'referer',
    'retry-after',
    'user-agent',
  ]),
  eh = (e) => {
    const t = {}
    let n, r, o
    return (
      e &&
        e
          .split(
            `
`,
          )
          .forEach(function (i) {
            ;((o = i.indexOf(':')),
              (n = i.substring(0, o).trim().toLowerCase()),
              (r = i.substring(o + 1).trim()),
              !(!n || (t[n] && Qp[n])) &&
                (n === 'set-cookie'
                  ? t[n]
                    ? t[n].push(r)
                    : (t[n] = [r])
                  : (t[n] = t[n] ? t[n] + ', ' + r : r)))
          }),
      t
    )
  },
  Io = /* @__PURE__ */ Symbol('internals')
function ht(e) {
  return e && String(e).trim().toLowerCase()
}
function jt(e) {
  return e === !1 || e == null ? e : b.isArray(e) ? e.map(jt) : String(e)
}
function th(e) {
  const t = /* @__PURE__ */ Object.create(null),
    n = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g
  let r
  for (; (r = n.exec(e)); ) t[r[1]] = r[2]
  return t
}
const nh = (e) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(e.trim())
function In(e, t, n, r, o) {
  if (b.isFunction(r)) return r.call(this, t, n)
  if ((o && (t = n), !!b.isString(t))) {
    if (b.isString(r)) return t.indexOf(r) !== -1
    if (b.isRegExp(r)) return r.test(t)
  }
}
function rh(e) {
  return e
    .trim()
    .toLowerCase()
    .replace(/([a-z\d])(\w*)/g, (t, n, r) => n.toUpperCase() + r)
}
function oh(e, t) {
  const n = b.toCamelCase(' ' + t)
  ;['get', 'set', 'has'].forEach((r) => {
    Object.defineProperty(e, r + n, {
      value: function (o, s, i) {
        return this[r].call(this, t, o, s, i)
      },
      configurable: !0,
    })
  })
}
let ve = class {
  constructor(t) {
    t && this.set(t)
  }
  set(t, n, r) {
    const o = this
    function s(a, u, c) {
      const l = ht(u)
      if (!l) throw new Error('header name must be a non-empty string')
      const d = b.findKey(o, l)
      ;(!d || o[d] === void 0 || c === !0 || (c === void 0 && o[d] !== !1)) && (o[d || u] = jt(a))
    }
    const i = (a, u) => b.forEach(a, (c, l) => s(c, l, u))
    if (b.isPlainObject(t) || t instanceof this.constructor) i(t, n)
    else if (b.isString(t) && (t = t.trim()) && !nh(t)) i(eh(t), n)
    else if (b.isObject(t) && b.isIterable(t)) {
      let a = {},
        u,
        c
      for (const l of t) {
        if (!b.isArray(l)) throw TypeError('Object iterator must return a key-value pair')
        a[(c = l[0])] = (u = a[c]) ? (b.isArray(u) ? [...u, l[1]] : [u, l[1]]) : l[1]
      }
      i(a, n)
    } else t != null && s(n, t, r)
    return this
  }
  get(t, n) {
    if (((t = ht(t)), t)) {
      const r = b.findKey(this, t)
      if (r) {
        const o = this[r]
        if (!n) return o
        if (n === !0) return th(o)
        if (b.isFunction(n)) return n.call(this, o, r)
        if (b.isRegExp(n)) return n.exec(o)
        throw new TypeError('parser must be boolean|regexp|function')
      }
    }
  }
  has(t, n) {
    if (((t = ht(t)), t)) {
      const r = b.findKey(this, t)
      return !!(r && this[r] !== void 0 && (!n || In(this, this[r], r, n)))
    }
    return !1
  }
  delete(t, n) {
    const r = this
    let o = !1
    function s(i) {
      if (((i = ht(i)), i)) {
        const a = b.findKey(r, i)
        a && (!n || In(r, r[a], a, n)) && (delete r[a], (o = !0))
      }
    }
    return (b.isArray(t) ? t.forEach(s) : s(t), o)
  }
  clear(t) {
    const n = Object.keys(this)
    let r = n.length,
      o = !1
    for (; r--; ) {
      const s = n[r]
      ;(!t || In(this, this[s], s, t, !0)) && (delete this[s], (o = !0))
    }
    return o
  }
  normalize(t) {
    const n = this,
      r = {}
    return (
      b.forEach(this, (o, s) => {
        const i = b.findKey(r, s)
        if (i) {
          ;((n[i] = jt(o)), delete n[s])
          return
        }
        const a = t ? rh(s) : String(s).trim()
        ;(a !== s && delete n[s], (n[a] = jt(o)), (r[a] = !0))
      }),
      this
    )
  }
  concat(...t) {
    return this.constructor.concat(this, ...t)
  }
  toJSON(t) {
    const n = /* @__PURE__ */ Object.create(null)
    return (
      b.forEach(this, (r, o) => {
        r != null && r !== !1 && (n[o] = t && b.isArray(r) ? r.join(', ') : r)
      }),
      n
    )
  }
  [Symbol.iterator]() {
    return Object.entries(this.toJSON())[Symbol.iterator]()
  }
  toString() {
    return Object.entries(this.toJSON()).map(([t, n]) => t + ': ' + n).join(`
`)
  }
  getSetCookie() {
    return this.get('set-cookie') || []
  }
  get [Symbol.toStringTag]() {
    return 'AxiosHeaders'
  }
  static from(t) {
    return t instanceof this ? t : new this(t)
  }
  static concat(t, ...n) {
    const r = new this(t)
    return (n.forEach((o) => r.set(o)), r)
  }
  static accessor(t) {
    const r = (this[Io] = this[Io] =
        {
          accessors: {},
        }).accessors,
      o = this.prototype
    function s(i) {
      const a = ht(i)
      r[a] || (oh(o, i), (r[a] = !0))
    }
    return (b.isArray(t) ? t.forEach(s) : s(t), this)
  }
}
ve.accessor([
  'Content-Type',
  'Content-Length',
  'Accept',
  'Accept-Encoding',
  'User-Agent',
  'Authorization',
])
b.reduceDescriptors(ve.prototype, ({ value: e }, t) => {
  let n = t[0].toUpperCase() + t.slice(1)
  return {
    get: () => e,
    set(r) {
      this[n] = r
    },
  }
})
b.freezeMethods(ve)
function Ln(e, t) {
  const n = this || Rt,
    r = t || n,
    o = ve.from(r.headers)
  let s = r.data
  return (
    b.forEach(e, function (a) {
      s = a.call(n, s, o.normalize(), t ? t.status : void 0)
    }),
    o.normalize(),
    s
  )
}
function $i(e) {
  return !!(e && e.__CANCEL__)
}
function dt(e, t, n) {
  ;(L.call(this, e ?? 'canceled', L.ERR_CANCELED, t, n), (this.name = 'CanceledError'))
}
b.inherits(dt, L, {
  __CANCEL__: !0,
})
function Fi(e, t, n) {
  const r = n.config.validateStatus
  !n.status || !r || r(n.status)
    ? e(n)
    : t(
        new L(
          'Request failed with status code ' + n.status,
          [L.ERR_BAD_REQUEST, L.ERR_BAD_RESPONSE][Math.floor(n.status / 100) - 4],
          n.config,
          n.request,
          n,
        ),
      )
}
function sh(e) {
  const t = /^([-+\w]{1,25})(:?\/\/|:)/.exec(e)
  return (t && t[1]) || ''
}
function ih(e, t) {
  e = e || 10
  const n = new Array(e),
    r = new Array(e)
  let o = 0,
    s = 0,
    i
  return (
    (t = t !== void 0 ? t : 1e3),
    function (u) {
      const c = Date.now(),
        l = r[s]
      ;(i || (i = c), (n[o] = u), (r[o] = c))
      let d = s,
        m = 0
      for (; d !== o; ) ((m += n[d++]), (d = d % e))
      if (((o = (o + 1) % e), o === s && (s = (s + 1) % e), c - i < t)) return
      const v = l && c - l
      return v ? Math.round((m * 1e3) / v) : void 0
    }
  )
}
function ah(e, t) {
  let n = 0,
    r = 1e3 / t,
    o,
    s
  const i = (c, l = Date.now()) => {
    ;((n = l), (o = null), s && (clearTimeout(s), (s = null)), e(...c))
  }
  return [
    (...c) => {
      const l = Date.now(),
        d = l - n
      d >= r
        ? i(c, l)
        : ((o = c),
          s ||
            (s = setTimeout(() => {
              ;((s = null), i(o))
            }, r - d)))
    },
    () => o && i(o),
  ]
}
const nn = (e, t, n = 3) => {
    let r = 0
    const o = ih(50, 250)
    return ah((s) => {
      const i = s.loaded,
        a = s.lengthComputable ? s.total : void 0,
        u = i - r,
        c = o(u),
        l = i <= a
      r = i
      const d = {
        loaded: i,
        total: a,
        progress: a ? i / a : void 0,
        bytes: u,
        rate: c || void 0,
        estimated: c && a && l ? (a - i) / c : void 0,
        event: s,
        lengthComputable: a != null,
        [t ? 'download' : 'upload']: !0,
      }
      e(d)
    }, n)
  },
  Lo = (e, t) => {
    const n = e != null
    return [
      (r) =>
        t[0]({
          lengthComputable: n,
          total: e,
          loaded: r,
        }),
      t[1],
    ]
  },
  Vo =
    (e) =>
    (...t) =>
      b.asap(() => e(...t)),
  ch = le.hasStandardBrowserEnv
    ? /* @__PURE__ */ ((e, t) => (n) => (
        (n = new URL(n, le.origin)),
        e.protocol === n.protocol && e.host === n.host && (t || e.port === n.port)
      ))(new URL(le.origin), le.navigator && /(msie|trident)/i.test(le.navigator.userAgent))
    : () => !0,
  uh = le.hasStandardBrowserEnv
    ? // Standard browser envs support document.cookie
      {
        write(e, t, n, r, o, s, i) {
          if (typeof document > 'u') return
          const a = [`${e}=${encodeURIComponent(t)}`]
          ;(b.isNumber(n) && a.push(`expires=${new Date(n).toUTCString()}`),
            b.isString(r) && a.push(`path=${r}`),
            b.isString(o) && a.push(`domain=${o}`),
            s === !0 && a.push('secure'),
            b.isString(i) && a.push(`SameSite=${i}`),
            (document.cookie = a.join('; ')))
        },
        read(e) {
          if (typeof document > 'u') return null
          const t = document.cookie.match(new RegExp('(?:^|; )' + e + '=([^;]*)'))
          return t ? decodeURIComponent(t[1]) : null
        },
        remove(e) {
          this.write(e, '', Date.now() - 864e5, '/')
        },
      }
    : // Non-standard browser env (web workers, react-native) lack needed support.
      {
        write() {},
        read() {
          return null
        },
        remove() {},
      }
function lh(e) {
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(e)
}
function dh(e, t) {
  return t ? e.replace(/\/?\/$/, '') + '/' + t.replace(/^\/+/, '') : e
}
function Ii(e, t, n) {
  let r = !lh(t)
  return e && (r || n == !1) ? dh(e, t) : t
}
const Zo = (e) => (e instanceof ve ? { ...e } : e)
function Ge(e, t) {
  t = t || {}
  const n = {}
  function r(c, l, d, m) {
    return b.isPlainObject(c) && b.isPlainObject(l)
      ? b.merge.call({ caseless: m }, c, l)
      : b.isPlainObject(l)
        ? b.merge({}, l)
        : b.isArray(l)
          ? l.slice()
          : l
  }
  function o(c, l, d, m) {
    if (b.isUndefined(l)) {
      if (!b.isUndefined(c)) return r(void 0, c, d, m)
    } else return r(c, l, d, m)
  }
  function s(c, l) {
    if (!b.isUndefined(l)) return r(void 0, l)
  }
  function i(c, l) {
    if (b.isUndefined(l)) {
      if (!b.isUndefined(c)) return r(void 0, c)
    } else return r(void 0, l)
  }
  function a(c, l, d) {
    if (d in t) return r(c, l)
    if (d in e) return r(void 0, c)
  }
  const u = {
    url: s,
    method: s,
    data: s,
    baseURL: i,
    transformRequest: i,
    transformResponse: i,
    paramsSerializer: i,
    timeout: i,
    timeoutMessage: i,
    withCredentials: i,
    withXSRFToken: i,
    adapter: i,
    responseType: i,
    xsrfCookieName: i,
    xsrfHeaderName: i,
    onUploadProgress: i,
    onDownloadProgress: i,
    decompress: i,
    maxContentLength: i,
    maxBodyLength: i,
    beforeRedirect: i,
    transport: i,
    httpAgent: i,
    httpsAgent: i,
    cancelToken: i,
    socketPath: i,
    responseEncoding: i,
    validateStatus: a,
    headers: (c, l, d) => o(Zo(c), Zo(l), d, !0),
  }
  return (
    b.forEach(Object.keys({ ...e, ...t }), function (l) {
      const d = u[l] || o,
        m = d(e[l], t[l], l)
      ;(b.isUndefined(m) && d !== a) || (n[l] = m)
    }),
    n
  )
}
const Li = (e) => {
    const t = Ge({}, e)
    let { data: n, withXSRFToken: r, xsrfHeaderName: o, xsrfCookieName: s, headers: i, auth: a } = t
    if (
      ((t.headers = i = ve.from(i)),
      (t.url = xi(Ii(t.baseURL, t.url, t.allowAbsoluteUrls), e.params, e.paramsSerializer)),
      a &&
        i.set(
          'Authorization',
          'Basic ' +
            btoa(
              (a.username || '') +
                ':' +
                (a.password ? unescape(encodeURIComponent(a.password)) : ''),
            ),
        ),
      b.isFormData(n))
    ) {
      if (le.hasStandardBrowserEnv || le.hasStandardBrowserWebWorkerEnv) i.setContentType(void 0)
      else if (b.isFunction(n.getHeaders)) {
        const u = n.getHeaders(),
          c = ['content-type', 'content-length']
        Object.entries(u).forEach(([l, d]) => {
          c.includes(l.toLowerCase()) && i.set(l, d)
        })
      }
    }
    if (
      le.hasStandardBrowserEnv &&
      (r && b.isFunction(r) && (r = r(t)), r || (r !== !1 && ch(t.url)))
    ) {
      const u = o && s && uh.read(s)
      u && i.set(o, u)
    }
    return t
  },
  fh = typeof XMLHttpRequest < 'u',
  ph =
    fh &&
    function (e) {
      return new Promise(function (n, r) {
        const o = Li(e)
        let s = o.data
        const i = ve.from(o.headers).normalize()
        let { responseType: a, onUploadProgress: u, onDownloadProgress: c } = o,
          l,
          d,
          m,
          v,
          h
        function g() {
          ;(v && v(),
            h && h(),
            o.cancelToken && o.cancelToken.unsubscribe(l),
            o.signal && o.signal.removeEventListener('abort', l))
        }
        let _ = new XMLHttpRequest()
        ;(_.open(o.method.toUpperCase(), o.url, !0), (_.timeout = o.timeout))
        function P() {
          if (!_) return
          const x = ve.from('getAllResponseHeaders' in _ && _.getAllResponseHeaders()),
            R = {
              data: !a || a === 'text' || a === 'json' ? _.responseText : _.response,
              status: _.status,
              statusText: _.statusText,
              headers: x,
              config: e,
              request: _,
            }
          ;(Fi(
            function (z) {
              ;(n(z), g())
            },
            function (z) {
              ;(r(z), g())
            },
            R,
          ),
            (_ = null))
        }
        ;('onloadend' in _
          ? (_.onloadend = P)
          : (_.onreadystatechange = function () {
              !_ ||
                _.readyState !== 4 ||
                (_.status === 0 && !(_.responseURL && _.responseURL.indexOf('file:') === 0)) ||
                setTimeout(P)
            }),
          (_.onabort = function () {
            _ && (r(new L('Request aborted', L.ECONNABORTED, e, _)), (_ = null))
          }),
          (_.onerror = function (O) {
            const R = O && O.message ? O.message : 'Network Error',
              Z = new L(R, L.ERR_NETWORK, e, _)
            ;((Z.event = O || null), r(Z), (_ = null))
          }),
          (_.ontimeout = function () {
            let O = o.timeout ? 'timeout of ' + o.timeout + 'ms exceeded' : 'timeout exceeded'
            const R = o.transitional || Di
            ;(o.timeoutErrorMessage && (O = o.timeoutErrorMessage),
              r(new L(O, R.clarifyTimeoutError ? L.ETIMEDOUT : L.ECONNABORTED, e, _)),
              (_ = null))
          }),
          s === void 0 && i.setContentType(null),
          'setRequestHeader' in _ &&
            b.forEach(i.toJSON(), function (O, R) {
              _.setRequestHeader(R, O)
            }),
          b.isUndefined(o.withCredentials) || (_.withCredentials = !!o.withCredentials),
          a && a !== 'json' && (_.responseType = o.responseType),
          c && (([m, h] = nn(c, !0)), _.addEventListener('progress', m)),
          u &&
            _.upload &&
            (([d, v] = nn(u)),
            _.upload.addEventListener('progress', d),
            _.upload.addEventListener('loadend', v)),
          (o.cancelToken || o.signal) &&
            ((l = (x) => {
              _ && (r(!x || x.type ? new dt(null, e, _) : x), _.abort(), (_ = null))
            }),
            o.cancelToken && o.cancelToken.subscribe(l),
            o.signal && (o.signal.aborted ? l() : o.signal.addEventListener('abort', l))))
        const A = sh(o.url)
        if (A && le.protocols.indexOf(A) === -1) {
          r(new L('Unsupported protocol ' + A + ':', L.ERR_BAD_REQUEST, e))
          return
        }
        _.send(s || null)
      })
    },
  hh = (e, t) => {
    const { length: n } = (e = e ? e.filter(Boolean) : [])
    if (t || n) {
      let r = new AbortController(),
        o
      const s = function (c) {
        if (!o) {
          ;((o = !0), a())
          const l = c instanceof Error ? c : this.reason
          r.abort(l instanceof L ? l : new dt(l instanceof Error ? l.message : l))
        }
      }
      let i =
        t &&
        setTimeout(() => {
          ;((i = null), s(new L(`timeout ${t} of ms exceeded`, L.ETIMEDOUT)))
        }, t)
      const a = () => {
        e &&
          (i && clearTimeout(i),
          (i = null),
          e.forEach((c) => {
            c.unsubscribe ? c.unsubscribe(s) : c.removeEventListener('abort', s)
          }),
          (e = null))
      }
      e.forEach((c) => c.addEventListener('abort', s))
      const { signal: u } = r
      return ((u.unsubscribe = () => b.asap(a)), u)
    }
  },
  mh = function* (e, t) {
    let n = e.byteLength
    if (n < t) {
      yield e
      return
    }
    let r = 0,
      o
    for (; r < n; ) ((o = r + t), yield e.slice(r, o), (r = o))
  },
  gh = async function* (e, t) {
    for await (const n of yh(e)) yield* mh(n, t)
  },
  yh = async function* (e) {
    if (e[Symbol.asyncIterator]) {
      yield* e
      return
    }
    const t = e.getReader()
    try {
      for (;;) {
        const { done: n, value: r } = await t.read()
        if (n) break
        yield r
      }
    } finally {
      await t.cancel()
    }
  },
  jo = (e, t, n, r) => {
    const o = gh(e, t)
    let s = 0,
      i,
      a = (u) => {
        i || ((i = !0), r && r(u))
      }
    return new ReadableStream(
      {
        async pull(u) {
          try {
            const { done: c, value: l } = await o.next()
            if (c) {
              ;(a(), u.close())
              return
            }
            let d = l.byteLength
            if (n) {
              let m = (s += d)
              n(m)
            }
            u.enqueue(new Uint8Array(l))
          } catch (c) {
            throw (a(c), c)
          }
        },
        cancel(u) {
          return (a(u), o.return())
        },
      },
      {
        highWaterMark: 2,
      },
    )
  },
  Uo = 64 * 1024,
  { isFunction: Ft } = b,
  vh = (({ Request: e, Response: t }) => ({
    Request: e,
    Response: t,
  }))(b.global),
  { ReadableStream: Mo, TextEncoder: Bo } = b.global,
  Wo = (e, ...t) => {
    try {
      return !!e(...t)
    } catch {
      return !1
    }
  },
  bh = (e) => {
    e = b.merge.call(
      {
        skipUndefined: !0,
      },
      vh,
      e,
    )
    const { fetch: t, Request: n, Response: r } = e,
      o = t ? Ft(t) : typeof fetch == 'function',
      s = Ft(n),
      i = Ft(r)
    if (!o) return !1
    const a = o && Ft(Mo),
      u =
        o &&
        (typeof Bo == 'function'
          ? /* @__PURE__ */ (
              (h) => (g) =>
                h.encode(g)
            )(new Bo())
          : async (h) => new Uint8Array(await new n(h).arrayBuffer())),
      c =
        s &&
        a &&
        Wo(() => {
          let h = !1
          const g = new n(le.origin, {
            body: new Mo(),
            method: 'POST',
            get duplex() {
              return ((h = !0), 'half')
            },
          }).headers.has('Content-Type')
          return h && !g
        }),
      l = i && a && Wo(() => b.isReadableStream(new r('').body)),
      d = {
        stream: l && ((h) => h.body),
      }
    o &&
      ['text', 'arrayBuffer', 'blob', 'formData', 'stream'].forEach((h) => {
        !d[h] &&
          (d[h] = (g, _) => {
            let P = g && g[h]
            if (P) return P.call(g)
            throw new L(`Response type '${h}' is not supported`, L.ERR_NOT_SUPPORT, _)
          })
      })
    const m = async (h) => {
        if (h == null) return 0
        if (b.isBlob(h)) return h.size
        if (b.isSpecCompliantForm(h))
          return (
            await new n(le.origin, {
              method: 'POST',
              body: h,
            }).arrayBuffer()
          ).byteLength
        if (b.isArrayBufferView(h) || b.isArrayBuffer(h)) return h.byteLength
        if ((b.isURLSearchParams(h) && (h = h + ''), b.isString(h))) return (await u(h)).byteLength
      },
      v = async (h, g) => {
        const _ = b.toFiniteNumber(h.getContentLength())
        return _ ?? m(g)
      }
    return async (h) => {
      let {
          url: g,
          method: _,
          data: P,
          signal: A,
          cancelToken: x,
          timeout: O,
          onDownloadProgress: R,
          onUploadProgress: Z,
          responseType: z,
          headers: Q,
          withCredentials: X = 'same-origin',
          fetchOptions: ee,
        } = Li(h),
        we = t || fetch
      z = z ? (z + '').toLowerCase() : 'text'
      let I = hh([A, x && x.toAbortSignal()], O),
        V = null
      const W =
        I &&
        I.unsubscribe &&
        (() => {
          I.unsubscribe()
        })
      let se
      try {
        if (Z && c && _ !== 'get' && _ !== 'head' && (se = await v(Q, P)) !== 0) {
          let Se = new n(g, {
              method: 'POST',
              body: P,
              duplex: 'half',
            }),
            Te
          if (
            (b.isFormData(P) && (Te = Se.headers.get('content-type')) && Q.setContentType(Te),
            Se.body)
          ) {
            const [ft, Ue] = Lo(se, nn(Vo(Z)))
            P = jo(Se.body, Uo, ft, Ue)
          }
        }
        b.isString(X) || (X = X ? 'include' : 'omit')
        const Y = s && 'credentials' in n.prototype,
          ue = {
            ...ee,
            signal: I,
            method: _.toUpperCase(),
            headers: Q.normalize().toJSON(),
            body: P,
            duplex: 'half',
            credentials: Y ? X : void 0,
          }
        V = s && new n(g, ue)
        let me = await (s ? we(V, ee) : we(g, ue))
        const ze = l && (z === 'stream' || z === 'response')
        if (l && (R || (ze && W))) {
          const Se = {}
          ;['status', 'statusText', 'headers'].forEach((At) => {
            Se[At] = me[At]
          })
          const Te = b.toFiniteNumber(me.headers.get('content-length')),
            [ft, Ue] = (R && Lo(Te, nn(Vo(R), !0))) || []
          me = new r(
            jo(me.body, Uo, ft, () => {
              ;(Ue && Ue(), W && W())
            }),
            Se,
          )
        }
        z = z || 'text'
        let je = await d[b.findKey(d, z) || 'text'](me, h)
        return (
          !ze && W && W(),
          await new Promise((Se, Te) => {
            Fi(Se, Te, {
              data: je,
              headers: ve.from(me.headers),
              status: me.status,
              statusText: me.statusText,
              config: h,
              request: V,
            })
          })
        )
      } catch (Y) {
        throw (
          W && W(),
          Y && Y.name === 'TypeError' && /Load failed|fetch/i.test(Y.message)
            ? Object.assign(new L('Network Error', L.ERR_NETWORK, h, V), {
                cause: Y.cause || Y,
              })
            : L.from(Y, Y && Y.code, h, V)
        )
      }
    }
  },
  _h = /* @__PURE__ */ new Map(),
  Vi = (e) => {
    let t = (e && e.env) || {}
    const { fetch: n, Request: r, Response: o } = t,
      s = [r, o, n]
    let i = s.length,
      a = i,
      u,
      c,
      l = _h
    for (; a--; )
      ((u = s[a]),
        (c = l.get(u)),
        c === void 0 && l.set(u, (c = a ? /* @__PURE__ */ new Map() : bh(t))),
        (l = c))
    return c
  }
Vi()
const xr = {
  http: Ip,
  xhr: ph,
  fetch: {
    get: Vi,
  },
}
b.forEach(xr, (e, t) => {
  if (e) {
    try {
      Object.defineProperty(e, 'name', { value: t })
    } catch {}
    Object.defineProperty(e, 'adapterName', { value: t })
  }
})
const Ho = (e) => `- ${e}`,
  wh = (e) => b.isFunction(e) || e === null || e === !1
function Eh(e, t) {
  e = b.isArray(e) ? e : [e]
  const { length: n } = e
  let r, o
  const s = {}
  for (let i = 0; i < n; i++) {
    r = e[i]
    let a
    if (((o = r), !wh(r) && ((o = xr[(a = String(r)).toLowerCase()]), o === void 0)))
      throw new L(`Unknown adapter '${a}'`)
    if (o && (b.isFunction(o) || (o = o.get(t)))) break
    s[a || '#' + i] = o
  }
  if (!o) {
    const i = Object.entries(s).map(
      ([u, c]) =>
        `adapter ${u} ` +
        (c === !1 ? 'is not supported by the environment' : 'is not available in the build'),
    )
    let a = n
      ? i.length > 1
        ? `since :
` +
          i.map(Ho).join(`
`)
        : ' ' + Ho(i[0])
      : 'as no adapter specified'
    throw new L('There is no suitable adapter to dispatch the request ' + a, 'ERR_NOT_SUPPORT')
  }
  return o
}
const Zi = {
  /**
   * Resolve an adapter from a list of adapter names or functions.
   * @type {Function}
   */
  getAdapter: Eh,
  /**
   * Exposes all known adapters
   * @type {Object<string, Function|Object>}
   */
  adapters: xr,
}
function Vn(e) {
  if ((e.cancelToken && e.cancelToken.throwIfRequested(), e.signal && e.signal.aborted))
    throw new dt(null, e)
}
function qo(e) {
  return (
    Vn(e),
    (e.headers = ve.from(e.headers)),
    (e.data = Ln.call(e, e.transformRequest)),
    ['post', 'put', 'patch'].indexOf(e.method) !== -1 &&
      e.headers.setContentType('application/x-www-form-urlencoded', !1),
    Zi.getAdapter(
      e.adapter || Rt.adapter,
      e,
    )(e).then(
      function (r) {
        return (
          Vn(e),
          (r.data = Ln.call(e, e.transformResponse, r)),
          (r.headers = ve.from(r.headers)),
          r
        )
      },
      function (r) {
        return (
          $i(r) ||
            (Vn(e),
            r &&
              r.response &&
              ((r.response.data = Ln.call(e, e.transformResponse, r.response)),
              (r.response.headers = ve.from(r.response.headers)))),
          Promise.reject(r)
        )
      },
    )
  )
}
const ji = '1.13.2',
  wn = {}
;['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach((e, t) => {
  wn[e] = function (r) {
    return typeof r === e || 'a' + (t < 1 ? 'n ' : ' ') + e
  }
})
const Jo = {}
wn.transitional = function (t, n, r) {
  function o(s, i) {
    return '[Axios v' + ji + "] Transitional option '" + s + "'" + i + (r ? '. ' + r : '')
  }
  return (s, i, a) => {
    if (t === !1) throw new L(o(i, ' has been removed' + (n ? ' in ' + n : '')), L.ERR_DEPRECATED)
    return (
      n &&
        !Jo[i] &&
        ((Jo[i] = !0),
        console.warn(
          o(i, ' has been deprecated since v' + n + ' and will be removed in the near future'),
        )),
      t ? t(s, i, a) : !0
    )
  }
}
wn.spelling = function (t) {
  return (n, r) => (console.warn(`${r} is likely a misspelling of ${t}`), !0)
}
function Sh(e, t, n) {
  if (typeof e != 'object') throw new L('options must be an object', L.ERR_BAD_OPTION_VALUE)
  const r = Object.keys(e)
  let o = r.length
  for (; o-- > 0; ) {
    const s = r[o],
      i = t[s]
    if (i) {
      const a = e[s],
        u = a === void 0 || i(a, s, e)
      if (u !== !0) throw new L('option ' + s + ' must be ' + u, L.ERR_BAD_OPTION_VALUE)
      continue
    }
    if (n !== !0) throw new L('Unknown option ' + s, L.ERR_BAD_OPTION)
  }
}
const Ut = {
    assertOptions: Sh,
    validators: wn,
  },
  Ae = Ut.validators
let He = class {
  constructor(t) {
    ;((this.defaults = t || {}),
      (this.interceptors = {
        request: new Fo(),
        response: new Fo(),
      }))
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
      return await this._request(t, n)
    } catch (r) {
      if (r instanceof Error) {
        let o = {}
        Error.captureStackTrace ? Error.captureStackTrace(o) : (o = new Error())
        const s = o.stack ? o.stack.replace(/^.+\n/, '') : ''
        try {
          r.stack
            ? s &&
              !String(r.stack).endsWith(s.replace(/^.+\n.+\n/, '')) &&
              (r.stack +=
                `
` + s)
            : (r.stack = s)
        } catch {}
      }
      throw r
    }
  }
  _request(t, n) {
    ;(typeof t == 'string' ? ((n = n || {}), (n.url = t)) : (n = t || {}),
      (n = Ge(this.defaults, n)))
    const { transitional: r, paramsSerializer: o, headers: s } = n
    ;(r !== void 0 &&
      Ut.assertOptions(
        r,
        {
          silentJSONParsing: Ae.transitional(Ae.boolean),
          forcedJSONParsing: Ae.transitional(Ae.boolean),
          clarifyTimeoutError: Ae.transitional(Ae.boolean),
        },
        !1,
      ),
      o != null &&
        (b.isFunction(o)
          ? (n.paramsSerializer = {
              serialize: o,
            })
          : Ut.assertOptions(
              o,
              {
                encode: Ae.function,
                serialize: Ae.function,
              },
              !0,
            )),
      n.allowAbsoluteUrls !== void 0 ||
        (this.defaults.allowAbsoluteUrls !== void 0
          ? (n.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls)
          : (n.allowAbsoluteUrls = !0)),
      Ut.assertOptions(
        n,
        {
          baseUrl: Ae.spelling('baseURL'),
          withXsrfToken: Ae.spelling('withXSRFToken'),
        },
        !0,
      ),
      (n.method = (n.method || this.defaults.method || 'get').toLowerCase()))
    let i = s && b.merge(s.common, s[n.method])
    ;(s &&
      b.forEach(['delete', 'get', 'head', 'post', 'put', 'patch', 'common'], (h) => {
        delete s[h]
      }),
      (n.headers = ve.concat(i, s)))
    const a = []
    let u = !0
    this.interceptors.request.forEach(function (g) {
      ;(typeof g.runWhen == 'function' && g.runWhen(n) === !1) ||
        ((u = u && g.synchronous), a.unshift(g.fulfilled, g.rejected))
    })
    const c = []
    this.interceptors.response.forEach(function (g) {
      c.push(g.fulfilled, g.rejected)
    })
    let l,
      d = 0,
      m
    if (!u) {
      const h = [qo.bind(this), void 0]
      for (h.unshift(...a), h.push(...c), m = h.length, l = Promise.resolve(n); d < m; )
        l = l.then(h[d++], h[d++])
      return l
    }
    m = a.length
    let v = n
    for (; d < m; ) {
      const h = a[d++],
        g = a[d++]
      try {
        v = h(v)
      } catch (_) {
        g.call(this, _)
        break
      }
    }
    try {
      l = qo.call(this, v)
    } catch (h) {
      return Promise.reject(h)
    }
    for (d = 0, m = c.length; d < m; ) l = l.then(c[d++], c[d++])
    return l
  }
  getUri(t) {
    t = Ge(this.defaults, t)
    const n = Ii(t.baseURL, t.url, t.allowAbsoluteUrls)
    return xi(n, t.params, t.paramsSerializer)
  }
}
b.forEach(['delete', 'get', 'head', 'options'], function (t) {
  He.prototype[t] = function (n, r) {
    return this.request(
      Ge(r || {}, {
        method: t,
        url: n,
        data: (r || {}).data,
      }),
    )
  }
})
b.forEach(['post', 'put', 'patch'], function (t) {
  function n(r) {
    return function (s, i, a) {
      return this.request(
        Ge(a || {}, {
          method: t,
          headers: r
            ? {
                'Content-Type': 'multipart/form-data',
              }
            : {},
          url: s,
          data: i,
        }),
      )
    }
  }
  ;((He.prototype[t] = n()), (He.prototype[t + 'Form'] = n(!0)))
})
let Oh = class Ui {
  constructor(t) {
    if (typeof t != 'function') throw new TypeError('executor must be a function.')
    let n
    this.promise = new Promise(function (s) {
      n = s
    })
    const r = this
    ;(this.promise.then((o) => {
      if (!r._listeners) return
      let s = r._listeners.length
      for (; s-- > 0; ) r._listeners[s](o)
      r._listeners = null
    }),
      (this.promise.then = (o) => {
        let s
        const i = new Promise((a) => {
          ;(r.subscribe(a), (s = a))
        }).then(o)
        return (
          (i.cancel = function () {
            r.unsubscribe(s)
          }),
          i
        )
      }),
      t(function (s, i, a) {
        r.reason || ((r.reason = new dt(s, i, a)), n(r.reason))
      }))
  }
  /**
   * Throws a `CanceledError` if cancellation has been requested.
   */
  throwIfRequested() {
    if (this.reason) throw this.reason
  }
  /**
   * Subscribe to the cancel signal
   */
  subscribe(t) {
    if (this.reason) {
      t(this.reason)
      return
    }
    this._listeners ? this._listeners.push(t) : (this._listeners = [t])
  }
  /**
   * Unsubscribe from the cancel signal
   */
  unsubscribe(t) {
    if (!this._listeners) return
    const n = this._listeners.indexOf(t)
    n !== -1 && this._listeners.splice(n, 1)
  }
  toAbortSignal() {
    const t = new AbortController(),
      n = (r) => {
        t.abort(r)
      }
    return (this.subscribe(n), (t.signal.unsubscribe = () => this.unsubscribe(n)), t.signal)
  }
  /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */
  static source() {
    let t
    return {
      token: new Ui(function (o) {
        t = o
      }),
      cancel: t,
    }
  }
}
function Ch(e) {
  return function (n) {
    return e.apply(null, n)
  }
}
function kh(e) {
  return b.isObject(e) && e.isAxiosError === !0
}
const Qn = {
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
  InvalidSslCertificate: 526,
}
Object.entries(Qn).forEach(([e, t]) => {
  Qn[t] = e
})
function Mi(e) {
  const t = new He(e),
    n = _i(He.prototype.request, t)
  return (
    b.extend(n, He.prototype, t, { allOwnKeys: !0 }),
    b.extend(n, t, null, { allOwnKeys: !0 }),
    (n.create = function (o) {
      return Mi(Ge(e, o))
    }),
    n
  )
}
const oe = Mi(Rt)
oe.Axios = He
oe.CanceledError = dt
oe.CancelToken = Oh
oe.isCancel = $i
oe.VERSION = ji
oe.toFormData = _n
oe.AxiosError = L
oe.Cancel = oe.CanceledError
oe.all = function (t) {
  return Promise.all(t)
}
oe.spread = Ch
oe.isAxiosError = kh
oe.mergeConfig = Ge
oe.AxiosHeaders = ve
oe.formToJSON = (e) => zi(b.isHTMLForm(e) ? new FormData(e) : e)
oe.getAdapter = Zi.getAdapter
oe.HttpStatusCode = Qn
oe.default = oe
const {
    Axios: vg,
    AxiosError: Rh,
    CanceledError: bg,
    isCancel: _g,
    CancelToken: wg,
    VERSION: Eg,
    all: Sg,
    Cancel: Og,
    isAxiosError: Cg,
    spread: kg,
    toFormData: Rg,
    AxiosHeaders: Ag,
    HttpStatusCode: Ng,
    formToJSON: Pg,
    getAdapter: Tg,
    mergeConfig: xg,
  } = oe,
  Ah = /* @__PURE__ */ S('ZodISODateTime', (e, t) => {
    ;(id.init(e, t), G.init(e, t))
  })
function Nh(e) {
  return /* @__PURE__ */ uf(Ah, e)
}
const Ph = /* @__PURE__ */ S('ZodISODate', (e, t) => {
  ;(ad.init(e, t), G.init(e, t))
})
function Th(e) {
  return /* @__PURE__ */ lf(Ph, e)
}
const xh = /* @__PURE__ */ S('ZodISOTime', (e, t) => {
  ;(cd.init(e, t), G.init(e, t))
})
function Dh(e) {
  return /* @__PURE__ */ df(xh, e)
}
const zh = /* @__PURE__ */ S('ZodISODuration', (e, t) => {
  ;(ud.init(e, t), G.init(e, t))
})
function $h(e) {
  return /* @__PURE__ */ ff(zh, e)
}
const Fh = (e, t) => {
    ;(Rr.init(e, t),
      (e.name = 'ZodError'),
      Object.defineProperties(e, {
        format: {
          value: (n) => tl(e, n),
          // enumerable: false,
        },
        flatten: {
          value: (n) => el(e, n),
          // enumerable: false,
        },
        addIssue: {
          value: (n) => {
            ;(e.issues.push(n), (e.message = JSON.stringify(e.issues, Jn, 2)))
          },
          // enumerable: false,
        },
        addIssues: {
          value: (n) => {
            ;(e.issues.push(...n), (e.message = JSON.stringify(e.issues, Jn, 2)))
          },
          // enumerable: false,
        },
        isEmpty: {
          get() {
            return e.issues.length === 0
          },
          // enumerable: false,
        },
      }))
  },
  Ee = S('ZodError', Fh, {
    Parent: Error,
  }),
  Ih = /* @__PURE__ */ fn(Ee),
  Lh = /* @__PURE__ */ pn(Ee),
  Vh = /* @__PURE__ */ hn(Ee),
  Zh = /* @__PURE__ */ mn(Ee),
  jh = /* @__PURE__ */ il(Ee),
  Uh = /* @__PURE__ */ al(Ee),
  Mh = /* @__PURE__ */ cl(Ee),
  Bh = /* @__PURE__ */ ul(Ee),
  Wh = /* @__PURE__ */ ll(Ee),
  Hh = /* @__PURE__ */ dl(Ee),
  qh = /* @__PURE__ */ fl(Ee),
  Jh = /* @__PURE__ */ pl(Ee),
  ae = /* @__PURE__ */ S(
    'ZodType',
    (e, t) => (
      ie.init(e, t),
      Object.assign(e['~standard'], {
        jsonSchema: {
          input: tn(e, 'input'),
          output: tn(e, 'output'),
        },
      }),
      (e.toJSONSchema = Pf(e, {})),
      (e.def = t),
      (e.type = t.type),
      Object.defineProperty(e, '_def', { value: t }),
      (e.check = (...n) =>
        e.clone(
          Ve(t, {
            checks: [
              ...(t.checks ?? []),
              ...n.map((r) =>
                typeof r == 'function'
                  ? { _zod: { check: r, def: { check: 'custom' }, onattach: [] } }
                  : r,
              ),
            ],
          }),
          {
            parent: !0,
          },
        )),
      (e.with = e.check),
      (e.clone = (n, r) => Ze(e, n, r)),
      (e.brand = () => e),
      (e.register = (n, r) => (n.add(e, r), e)),
      (e.parse = (n, r) => Ih(e, n, r, { callee: e.parse })),
      (e.safeParse = (n, r) => Vh(e, n, r)),
      (e.parseAsync = async (n, r) => Lh(e, n, r, { callee: e.parseAsync })),
      (e.safeParseAsync = async (n, r) => Zh(e, n, r)),
      (e.spa = e.safeParseAsync),
      (e.encode = (n, r) => jh(e, n, r)),
      (e.decode = (n, r) => Uh(e, n, r)),
      (e.encodeAsync = async (n, r) => Mh(e, n, r)),
      (e.decodeAsync = async (n, r) => Bh(e, n, r)),
      (e.safeEncode = (n, r) => Wh(e, n, r)),
      (e.safeDecode = (n, r) => Hh(e, n, r)),
      (e.safeEncodeAsync = async (n, r) => qh(e, n, r)),
      (e.safeDecodeAsync = async (n, r) => Jh(e, n, r)),
      (e.refine = (n, r) => e.check(jm(n, r))),
      (e.superRefine = (n) => e.check(Um(n))),
      (e.overwrite = (n) => e.check(/* @__PURE__ */ ut(n))),
      (e.optional = () => Xo(e)),
      (e.exactOptional = () => Am(e)),
      (e.nullable = () => Yo(e)),
      (e.nullish = () => Xo(Yo(e))),
      (e.nonoptional = (n) => zm(e, n)),
      (e.array = () => ym(e)),
      (e.or = (n) => wm([e, n])),
      (e.and = (n) => Sm(e, n)),
      (e.transform = (n) => Qo(e, km(n))),
      (e.default = (n) => Tm(e, n)),
      (e.prefault = (n) => Dm(e, n)),
      (e.catch = (n) => Fm(e, n)),
      (e.pipe = (n) => Qo(e, n)),
      (e.readonly = () => Vm(e)),
      (e.describe = (n) => {
        const r = e.clone()
        return (mt.add(r, { description: n }), r)
      }),
      Object.defineProperty(e, 'description', {
        get() {
          return mt.get(e)?.description
        },
        configurable: !0,
      }),
      (e.meta = (...n) => {
        if (n.length === 0) return mt.get(e)
        const r = e.clone()
        return (mt.add(r, n[0]), r)
      }),
      (e.isOptional = () => e.safeParse(void 0).success),
      (e.isNullable = () => e.safeParse(null).success),
      (e.apply = (n) => n(e)),
      e
    ),
  ),
  Bi = /* @__PURE__ */ S('_ZodString', (e, t) => {
    ;(Ar.init(e, t), ae.init(e, t), (e._zod.processJSONSchema = (r, o, s) => xf(e, r, o)))
    const n = e._zod.bag
    ;((e.format = n.format ?? null),
      (e.minLength = n.minimum ?? null),
      (e.maxLength = n.maximum ?? null),
      (e.regex = (...r) => e.check(/* @__PURE__ */ mf(...r))),
      (e.includes = (...r) => e.check(/* @__PURE__ */ vf(...r))),
      (e.startsWith = (...r) => e.check(/* @__PURE__ */ bf(...r))),
      (e.endsWith = (...r) => e.check(/* @__PURE__ */ _f(...r))),
      (e.min = (...r) => e.check(/* @__PURE__ */ en(...r))),
      (e.max = (...r) => e.check(/* @__PURE__ */ hi(...r))),
      (e.length = (...r) => e.check(/* @__PURE__ */ mi(...r))),
      (e.nonempty = (...r) => e.check(/* @__PURE__ */ en(1, ...r))),
      (e.lowercase = (r) => e.check(/* @__PURE__ */ gf(r))),
      (e.uppercase = (r) => e.check(/* @__PURE__ */ yf(r))),
      (e.trim = () => e.check(/* @__PURE__ */ Ef())),
      (e.normalize = (...r) => e.check(/* @__PURE__ */ wf(...r))),
      (e.toLowerCase = () => e.check(/* @__PURE__ */ Sf())),
      (e.toUpperCase = () => e.check(/* @__PURE__ */ Of())),
      (e.slugify = () => e.check(/* @__PURE__ */ Cf())))
  }),
  Kh = /* @__PURE__ */ S('ZodString', (e, t) => {
    ;(Ar.init(e, t),
      Bi.init(e, t),
      (e.email = (n) => e.check(/* @__PURE__ */ jd(Gh, n))),
      (e.url = (n) => e.check(/* @__PURE__ */ Hd(Xh, n))),
      (e.jwt = (n) => e.check(/* @__PURE__ */ cf(fm, n))),
      (e.emoji = (n) => e.check(/* @__PURE__ */ qd(Yh, n))),
      (e.guid = (n) => e.check(/* @__PURE__ */ To(Ko, n))),
      (e.uuid = (n) => e.check(/* @__PURE__ */ Ud(It, n))),
      (e.uuidv4 = (n) => e.check(/* @__PURE__ */ Md(It, n))),
      (e.uuidv6 = (n) => e.check(/* @__PURE__ */ Bd(It, n))),
      (e.uuidv7 = (n) => e.check(/* @__PURE__ */ Wd(It, n))),
      (e.nanoid = (n) => e.check(/* @__PURE__ */ Jd(Qh, n))),
      (e.guid = (n) => e.check(/* @__PURE__ */ To(Ko, n))),
      (e.cuid = (n) => e.check(/* @__PURE__ */ Kd(em, n))),
      (e.cuid2 = (n) => e.check(/* @__PURE__ */ Gd(tm, n))),
      (e.ulid = (n) => e.check(/* @__PURE__ */ Xd(nm, n))),
      (e.base64 = (n) => e.check(/* @__PURE__ */ of(um, n))),
      (e.base64url = (n) => e.check(/* @__PURE__ */ sf(lm, n))),
      (e.xid = (n) => e.check(/* @__PURE__ */ Yd(rm, n))),
      (e.ksuid = (n) => e.check(/* @__PURE__ */ Qd(om, n))),
      (e.ipv4 = (n) => e.check(/* @__PURE__ */ ef(sm, n))),
      (e.ipv6 = (n) => e.check(/* @__PURE__ */ tf(im, n))),
      (e.cidrv4 = (n) => e.check(/* @__PURE__ */ nf(am, n))),
      (e.cidrv6 = (n) => e.check(/* @__PURE__ */ rf(cm, n))),
      (e.e164 = (n) => e.check(/* @__PURE__ */ af(dm, n))),
      (e.datetime = (n) => e.check(Nh(n))),
      (e.date = (n) => e.check(Th(n))),
      (e.time = (n) => e.check(Dh(n))),
      (e.duration = (n) => e.check($h(n))))
  })
function Zn(e) {
  return /* @__PURE__ */ Zd(Kh, e)
}
const G = /* @__PURE__ */ S('ZodStringFormat', (e, t) => {
    ;(J.init(e, t), Bi.init(e, t))
  }),
  Gh = /* @__PURE__ */ S('ZodEmail', (e, t) => {
    ;(Xl.init(e, t), G.init(e, t))
  }),
  Ko = /* @__PURE__ */ S('ZodGUID', (e, t) => {
    ;(Kl.init(e, t), G.init(e, t))
  }),
  It = /* @__PURE__ */ S('ZodUUID', (e, t) => {
    ;(Gl.init(e, t), G.init(e, t))
  }),
  Xh = /* @__PURE__ */ S('ZodURL', (e, t) => {
    ;(Yl.init(e, t), G.init(e, t))
  }),
  Yh = /* @__PURE__ */ S('ZodEmoji', (e, t) => {
    ;(Ql.init(e, t), G.init(e, t))
  }),
  Qh = /* @__PURE__ */ S('ZodNanoID', (e, t) => {
    ;(ed.init(e, t), G.init(e, t))
  }),
  em = /* @__PURE__ */ S('ZodCUID', (e, t) => {
    ;(td.init(e, t), G.init(e, t))
  }),
  tm = /* @__PURE__ */ S('ZodCUID2', (e, t) => {
    ;(nd.init(e, t), G.init(e, t))
  }),
  nm = /* @__PURE__ */ S('ZodULID', (e, t) => {
    ;(rd.init(e, t), G.init(e, t))
  }),
  rm = /* @__PURE__ */ S('ZodXID', (e, t) => {
    ;(od.init(e, t), G.init(e, t))
  }),
  om = /* @__PURE__ */ S('ZodKSUID', (e, t) => {
    ;(sd.init(e, t), G.init(e, t))
  }),
  sm = /* @__PURE__ */ S('ZodIPv4', (e, t) => {
    ;(ld.init(e, t), G.init(e, t))
  }),
  im = /* @__PURE__ */ S('ZodIPv6', (e, t) => {
    ;(dd.init(e, t), G.init(e, t))
  }),
  am = /* @__PURE__ */ S('ZodCIDRv4', (e, t) => {
    ;(fd.init(e, t), G.init(e, t))
  }),
  cm = /* @__PURE__ */ S('ZodCIDRv6', (e, t) => {
    ;(pd.init(e, t), G.init(e, t))
  }),
  um = /* @__PURE__ */ S('ZodBase64', (e, t) => {
    ;(hd.init(e, t), G.init(e, t))
  }),
  lm = /* @__PURE__ */ S('ZodBase64URL', (e, t) => {
    ;(gd.init(e, t), G.init(e, t))
  }),
  dm = /* @__PURE__ */ S('ZodE164', (e, t) => {
    ;(yd.init(e, t), G.init(e, t))
  }),
  fm = /* @__PURE__ */ S('ZodJWT', (e, t) => {
    ;(bd.init(e, t), G.init(e, t))
  }),
  pm = /* @__PURE__ */ S('ZodUnknown', (e, t) => {
    ;(_d.init(e, t), ae.init(e, t), (e._zod.processJSONSchema = (n, r, o) => zf()))
  })
function Go() {
  return /* @__PURE__ */ pf(pm)
}
const hm = /* @__PURE__ */ S('ZodNever', (e, t) => {
  ;(wd.init(e, t), ae.init(e, t), (e._zod.processJSONSchema = (n, r, o) => Df(e, n, r)))
})
function mm(e) {
  return /* @__PURE__ */ hf(hm, e)
}
const gm = /* @__PURE__ */ S('ZodArray', (e, t) => {
  ;(Ed.init(e, t),
    ae.init(e, t),
    (e._zod.processJSONSchema = (n, r, o) => Lf(e, n, r, o)),
    (e.element = t.element),
    (e.min = (n, r) => e.check(/* @__PURE__ */ en(n, r))),
    (e.nonempty = (n) => e.check(/* @__PURE__ */ en(1, n))),
    (e.max = (n, r) => e.check(/* @__PURE__ */ hi(n, r))),
    (e.length = (n, r) => e.check(/* @__PURE__ */ mi(n, r))),
    (e.unwrap = () => e.element))
})
function ym(e, t) {
  return /* @__PURE__ */ kf(gm, e, t)
}
const vm = /* @__PURE__ */ S('ZodObject', (e, t) => {
  ;(Od.init(e, t),
    ae.init(e, t),
    (e._zod.processJSONSchema = (n, r, o) => Vf(e, n, r, o)),
    B(e, 'shape', () => t.shape),
    (e.keyof = () => Om(Object.keys(e._zod.def.shape))),
    (e.catchall = (n) => e.clone({ ...e._zod.def, catchall: n })),
    (e.passthrough = () => e.clone({ ...e._zod.def, catchall: Go() })),
    (e.loose = () => e.clone({ ...e._zod.def, catchall: Go() })),
    (e.strict = () => e.clone({ ...e._zod.def, catchall: mm() })),
    (e.strip = () => e.clone({ ...e._zod.def, catchall: void 0 })),
    (e.extend = (n) => Ku(e, n)),
    (e.safeExtend = (n) => Gu(e, n)),
    (e.merge = (n) => Xu(e, n)),
    (e.pick = (n) => qu(e, n)),
    (e.omit = (n) => Ju(e, n)),
    (e.partial = (...n) => Yu(Wi, e, n[0])),
    (e.required = (...n) => Qu(Hi, e, n[0])))
})
function bm(e, t) {
  const n = {
    type: 'object',
    shape: e ?? {},
    ...F(t),
  }
  return new vm(n)
}
const _m = /* @__PURE__ */ S('ZodUnion', (e, t) => {
  ;(Cd.init(e, t),
    ae.init(e, t),
    (e._zod.processJSONSchema = (n, r, o) => Zf(e, n, r, o)),
    (e.options = t.options))
})
function wm(e, t) {
  return new _m({
    type: 'union',
    options: e,
    ...F(t),
  })
}
const Em = /* @__PURE__ */ S('ZodIntersection', (e, t) => {
  ;(kd.init(e, t), ae.init(e, t), (e._zod.processJSONSchema = (n, r, o) => jf(e, n, r, o)))
})
function Sm(e, t) {
  return new Em({
    type: 'intersection',
    left: e,
    right: t,
  })
}
const er = /* @__PURE__ */ S('ZodEnum', (e, t) => {
  ;(Rd.init(e, t),
    ae.init(e, t),
    (e._zod.processJSONSchema = (r, o, s) => $f(e, r, o)),
    (e.enum = t.entries),
    (e.options = Object.values(t.entries)))
  const n = new Set(Object.keys(t.entries))
  ;((e.extract = (r, o) => {
    const s = {}
    for (const i of r)
      if (n.has(i)) s[i] = t.entries[i]
      else throw new Error(`Key ${i} not found in enum`)
    return new er({
      ...t,
      checks: [],
      ...F(o),
      entries: s,
    })
  }),
    (e.exclude = (r, o) => {
      const s = { ...t.entries }
      for (const i of r)
        if (n.has(i)) delete s[i]
        else throw new Error(`Key ${i} not found in enum`)
      return new er({
        ...t,
        checks: [],
        ...F(o),
        entries: s,
      })
    }))
})
function Om(e, t) {
  const n = Array.isArray(e) ? Object.fromEntries(e.map((r) => [r, r])) : e
  return new er({
    type: 'enum',
    entries: n,
    ...F(t),
  })
}
const Cm = /* @__PURE__ */ S('ZodTransform', (e, t) => {
  ;(Ad.init(e, t),
    ae.init(e, t),
    (e._zod.processJSONSchema = (n, r, o) => If(e, n)),
    (e._zod.parse = (n, r) => {
      if (r.direction === 'backward') throw new ei(e.constructor.name)
      n.addIssue = (s) => {
        if (typeof s == 'string') n.issues.push(Et(s, n.value, t))
        else {
          const i = s
          ;(i.fatal && (i.continue = !1),
            i.code ?? (i.code = 'custom'),
            i.input ?? (i.input = n.value),
            i.inst ?? (i.inst = e),
            n.issues.push(Et(i)))
        }
      }
      const o = t.transform(n.value, n)
      return o instanceof Promise ? o.then((s) => ((n.value = s), n)) : ((n.value = o), n)
    }))
})
function km(e) {
  return new Cm({
    type: 'transform',
    transform: e,
  })
}
const Wi = /* @__PURE__ */ S('ZodOptional', (e, t) => {
  ;(pi.init(e, t),
    ae.init(e, t),
    (e._zod.processJSONSchema = (n, r, o) => bi(e, n, r, o)),
    (e.unwrap = () => e._zod.def.innerType))
})
function Xo(e) {
  return new Wi({
    type: 'optional',
    innerType: e,
  })
}
const Rm = /* @__PURE__ */ S('ZodExactOptional', (e, t) => {
  ;(Nd.init(e, t),
    ae.init(e, t),
    (e._zod.processJSONSchema = (n, r, o) => bi(e, n, r, o)),
    (e.unwrap = () => e._zod.def.innerType))
})
function Am(e) {
  return new Rm({
    type: 'optional',
    innerType: e,
  })
}
const Nm = /* @__PURE__ */ S('ZodNullable', (e, t) => {
  ;(Pd.init(e, t),
    ae.init(e, t),
    (e._zod.processJSONSchema = (n, r, o) => Uf(e, n, r, o)),
    (e.unwrap = () => e._zod.def.innerType))
})
function Yo(e) {
  return new Nm({
    type: 'nullable',
    innerType: e,
  })
}
const Pm = /* @__PURE__ */ S('ZodDefault', (e, t) => {
  ;(Td.init(e, t),
    ae.init(e, t),
    (e._zod.processJSONSchema = (n, r, o) => Bf(e, n, r, o)),
    (e.unwrap = () => e._zod.def.innerType),
    (e.removeDefault = e.unwrap))
})
function Tm(e, t) {
  return new Pm({
    type: 'default',
    innerType: e,
    get defaultValue() {
      return typeof t == 'function' ? t() : oi(t)
    },
  })
}
const xm = /* @__PURE__ */ S('ZodPrefault', (e, t) => {
  ;(xd.init(e, t),
    ae.init(e, t),
    (e._zod.processJSONSchema = (n, r, o) => Wf(e, n, r, o)),
    (e.unwrap = () => e._zod.def.innerType))
})
function Dm(e, t) {
  return new xm({
    type: 'prefault',
    innerType: e,
    get defaultValue() {
      return typeof t == 'function' ? t() : oi(t)
    },
  })
}
const Hi = /* @__PURE__ */ S('ZodNonOptional', (e, t) => {
  ;(Dd.init(e, t),
    ae.init(e, t),
    (e._zod.processJSONSchema = (n, r, o) => Mf(e, n, r, o)),
    (e.unwrap = () => e._zod.def.innerType))
})
function zm(e, t) {
  return new Hi({
    type: 'nonoptional',
    innerType: e,
    ...F(t),
  })
}
const $m = /* @__PURE__ */ S('ZodCatch', (e, t) => {
  ;(zd.init(e, t),
    ae.init(e, t),
    (e._zod.processJSONSchema = (n, r, o) => Hf(e, n, r, o)),
    (e.unwrap = () => e._zod.def.innerType),
    (e.removeCatch = e.unwrap))
})
function Fm(e, t) {
  return new $m({
    type: 'catch',
    innerType: e,
    catchValue: typeof t == 'function' ? t : () => t,
  })
}
const Im = /* @__PURE__ */ S('ZodPipe', (e, t) => {
  ;($d.init(e, t),
    ae.init(e, t),
    (e._zod.processJSONSchema = (n, r, o) => qf(e, n, r, o)),
    (e.in = t.in),
    (e.out = t.out))
})
function Qo(e, t) {
  return new Im({
    type: 'pipe',
    in: e,
    out: t,
    // ...util.normalizeParams(params),
  })
}
const Lm = /* @__PURE__ */ S('ZodReadonly', (e, t) => {
  ;(Fd.init(e, t),
    ae.init(e, t),
    (e._zod.processJSONSchema = (n, r, o) => Jf(e, n, r, o)),
    (e.unwrap = () => e._zod.def.innerType))
})
function Vm(e) {
  return new Lm({
    type: 'readonly',
    innerType: e,
  })
}
const Zm = /* @__PURE__ */ S('ZodCustom', (e, t) => {
  ;(Id.init(e, t), ae.init(e, t), (e._zod.processJSONSchema = (n, r, o) => Ff(e, n)))
})
function jm(e, t = {}) {
  return /* @__PURE__ */ Rf(Zm, e, t)
}
function Um(e) {
  return /* @__PURE__ */ Af(e)
}
const Mm = or(
    'relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7',
    {
      variants: {
        variant: {
          default: 'bg-background text-foreground',
          destructive:
            'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive',
        },
      },
      defaultVariants: {
        variant: 'default',
      },
    },
  ),
  qi = p.forwardRef(({ className: e, variant: t, ...n }, r) =>
    /* @__PURE__ */ E('div', { ref: r, role: 'alert', className: K(Mm({ variant: t }), e), ...n }),
  )
qi.displayName = 'Alert'
const Ji = p.forwardRef(({ className: e, ...t }, n) =>
  // eslint-disable-next-line jsx-a11y/heading-has-content
  /* @__PURE__ */ E('h5', {
    ref: n,
    className: K('mb-1 font-medium leading-none tracking-tight', e),
    ...t,
  }),
)
Ji.displayName = 'AlertTitle'
const Ki = p.forwardRef(({ className: e, ...t }, n) =>
  /* @__PURE__ */ E('div', { ref: n, className: K('text-sm [&_p]:leading-relaxed', e), ...t }),
)
Ki.displayName = 'AlertDescription'
var Bm = [
    'a',
    'button',
    'div',
    'form',
    'h2',
    'h3',
    'img',
    'input',
    'label',
    'li',
    'nav',
    'ol',
    'p',
    'select',
    'span',
    'svg',
    'ul',
  ],
  Wm = Bm.reduce((e, t) => {
    const n = /* @__PURE__ */ ns(`Primitive.${t}`),
      r = p.forwardRef((o, s) => {
        const { asChild: i, ...a } = o,
          u = i ? n : t
        return (
          typeof window < 'u' && (window[/* @__PURE__ */ Symbol.for('radix-ui')] = !0),
          /* @__PURE__ */ E(u, { ...a, ref: s })
        )
      })
    return ((r.displayName = `Primitive.${t}`), { ...e, [t]: r })
  }, {}),
  Hm = 'Label',
  Gi = p.forwardRef((e, t) =>
    /* @__PURE__ */ E(Wm.label, {
      ...e,
      ref: t,
      onMouseDown: (n) => {
        n.target.closest('button, input, select, textarea') ||
          (e.onMouseDown?.(n), !n.defaultPrevented && n.detail > 1 && n.preventDefault())
      },
    }),
  )
Gi.displayName = Hm
var Xi = Gi
const qm = or(
    'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
  ),
  Yi = p.forwardRef(({ className: e, ...t }, n) =>
    /* @__PURE__ */ E(Xi, { ref: n, className: K(qm(), e), ...t }),
  )
Yi.displayName = Xi.displayName
const Jm = ku,
  Qi = p.createContext(null),
  jn = ({ ...e }) =>
    /* @__PURE__ */ E(Qi.Provider, {
      value: { name: e.name },
      children: /* @__PURE__ */ E(Ou, { ...e }),
    }),
  En = () => {
    const e = p.useContext(Qi),
      t = p.useContext(ea),
      { getFieldState: n, formState: r } = Cu()
    if (!e) throw new Error('useFormField should be used within <FormField>')
    if (!t) throw new Error('useFormField should be used within <FormItem>')
    const o = n(e.name, r),
      { id: s } = t
    return {
      id: s,
      name: e.name,
      formItemId: `${s}-form-item`,
      formDescriptionId: `${s}-form-item-description`,
      formMessageId: `${s}-form-item-message`,
      ...o,
    }
  },
  ea = p.createContext(null),
  Mt = p.forwardRef(({ className: e, ...t }, n) => {
    const r = p.useId()
    return /* @__PURE__ */ E(ea.Provider, {
      value: { id: r },
      children: /* @__PURE__ */ E('div', { ref: n, className: K('space-y-2', e), ...t }),
    })
  })
Mt.displayName = 'FormItem'
const Bt = p.forwardRef(({ className: e, ...t }, n) => {
  const { error: r, formItemId: o } = En()
  return /* @__PURE__ */ E(Yi, {
    ref: n,
    className: K(r && 'text-destructive', e),
    htmlFor: o,
    ...t,
  })
})
Bt.displayName = 'FormLabel'
const Wt = p.forwardRef(({ ...e }, t) => {
  const { error: n, formItemId: r, formDescriptionId: o, formMessageId: s } = En()
  return /* @__PURE__ */ E(rs, {
    ref: t,
    id: r,
    'aria-describedby': n ? `${o} ${s}` : `${o}`,
    'aria-invalid': !!n,
    ...e,
  })
})
Wt.displayName = 'FormControl'
const Km = p.forwardRef(({ className: e, ...t }, n) => {
  const { formDescriptionId: r } = En()
  return /* @__PURE__ */ E('p', {
    ref: n,
    id: r,
    className: K('text-[0.8rem] text-muted-foreground', e),
    ...t,
  })
})
Km.displayName = 'FormDescription'
const Ht = p.forwardRef(({ className: e, children: t, ...n }, r) => {
  const { error: o, formMessageId: s } = En(),
    i = o ? String(o?.message ?? '') : t
  return i
    ? /* @__PURE__ */ E('p', {
        ref: r,
        id: s,
        className: K('text-[0.8rem] font-medium text-destructive', e),
        ...n,
        children: i,
      })
    : null
})
Ht.displayName = 'FormMessage'
const tr = p.forwardRef(({ className: e, type: t, ...n }, r) =>
  /* @__PURE__ */ E('input', {
    type: t,
    className: K(
      'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
      e,
    ),
    ref: r,
    ...n,
  }),
)
tr.displayName = 'Input'
const ta = p.forwardRef(({ className: e, ...t }, n) =>
  /* @__PURE__ */ E('textarea', {
    className: K(
      'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      e,
    ),
    ref: n,
    ...t,
  }),
)
ta.displayName = 'Textarea'
function Gm(e) {
  return e ? (Array.isArray(e) ? e : e.member || e['hydra:member'] || []) : []
}
const ct = {
    all: ['gift-lists'],
    lists: () => [...ct.all, 'list'],
    detail: (e) => [...ct.lists(), e],
  },
  Xm = async () => {
    const e = rn(),
      { data: t } = await e.get('/gift_lists')
    return Gm(t)
  },
  Ym = async (e) => {
    const t = rn(),
      { data: n } = await t.post('/gift_lists', e)
    return n
  },
  Qm = async ({ id: e, ...t }) => {
    const n = rn(),
      { data: r } = await n.patch(`/gift_lists/${e}`, t, {
        headers: {
          'Content-Type': 'application/merge-patch+json',
        },
      })
    return r
  },
  eg = async (e) => {
    await rn().delete(`/gift_lists/${e}`)
  }
function tg() {
  return ba({
    queryKey: ct.lists(),
    queryFn: Xm,
  })
}
function ng() {
  const e = nr()
  return rr({
    mutationFn: Ym,
    onSuccess: () => {
      e.invalidateQueries({ queryKey: ct.lists() })
    },
  })
}
function rg() {
  const e = nr()
  return rr({
    mutationFn: Qm,
    onSuccess: () => {
      e.invalidateQueries({ queryKey: ct.lists() })
    },
  })
}
function og() {
  const e = nr()
  return rr({
    mutationFn: eg,
    onSuccess: () => {
      e.invalidateQueries({ queryKey: ct.lists() })
    },
  })
}
const sg = bm({
  name: Zn().min(1, 'Name is required'),
  description: Zn().optional(),
  eventDate: Zn().optional(),
})
function ig({ open: e, onOpenChange: t, listToEdit: n }) {
  const { t: r } = es('gift-plugin'),
    o = ng(),
    s = rg(),
    [i, a] = gt(null),
    u = ju({
      resolver: Xf(sg),
      defaultValues: {
        name: '',
        description: '',
        eventDate: '',
      },
    })
  la(() => {
    e &&
      u.reset({
        name: n?.name || '',
        description: n?.description || '',
        eventDate: n?.eventDate ? new Date(n.eventDate).toISOString().split('T')[0] : '',
      })
  }, [e, n, u])
  const c = async (m) => {
      try {
        ;(n ? await s.mutateAsync({ id: n.id, ...m }) : await o.mutateAsync(m), t(!1))
      } catch (v) {
        if ((console.error('Failed to save gift list', v), v instanceof Rh)) {
          const h = v.response?.data
          if (h && typeof h == 'object') {
            const g = h.description || h.detail || h['hydra:description']
            if (g) {
              a(g)
              return
            }
          }
        }
        a(r('error.generic', 'An error occurred while saving.'))
      }
    },
    l = o.isPending || s.isPending
  let d = r('common.create', 'Create')
  return (
    l ? (d = r('common.saving', 'Saving...')) : n && (d = r('common.save', 'Save')),
    /* @__PURE__ */ E(Us, {
      open: e,
      onOpenChange: t,
      children: /* @__PURE__ */ H(cr, {
        children: [
          /* @__PURE__ */ H(ur, {
            children: [
              /* @__PURE__ */ E(dr, {
                children: n
                  ? r('dialog.editTitle', 'Edit Gift List')
                  : r('dialog.createTitle', 'Create Gift List'),
              }),
              /* @__PURE__ */ E(fr, {
                children: n
                  ? r('dialog.editDescription', 'Update the details of your gift list.')
                  : r('dialog.createDescription', 'Fill in the details to create a new gift list.'),
              }),
            ],
          }),
          /* @__PURE__ */ E(Jm, {
            ...u,
            children: /* @__PURE__ */ H('form', {
              onSubmit: u.handleSubmit(c),
              className: 'space-y-4',
              children: [
                i
                  ? /* @__PURE__ */ H(qi, {
                      variant: 'destructive',
                      children: [
                        /* @__PURE__ */ E(fa, { className: 'h-4 w-4' }),
                        /* @__PURE__ */ E(Ji, { children: r('common.error', 'Error') }),
                        /* @__PURE__ */ E(Ki, { children: i }),
                      ],
                    })
                  : null,
                /* @__PURE__ */ E(jn, {
                  control: u.control,
                  name: 'name',
                  render: ({ field: m }) =>
                    /* @__PURE__ */ H(Mt, {
                      children: [
                        /* @__PURE__ */ E(Bt, { children: r('fields.name', 'Name') }),
                        /* @__PURE__ */ E(Wt, { children: /* @__PURE__ */ E(tr, { ...m }) }),
                        /* @__PURE__ */ E(Ht, {}),
                      ],
                    }),
                }),
                /* @__PURE__ */ E(jn, {
                  control: u.control,
                  name: 'description',
                  render: ({ field: m }) =>
                    /* @__PURE__ */ H(Mt, {
                      children: [
                        /* @__PURE__ */ E(Bt, { children: r('fields.description', 'Description') }),
                        /* @__PURE__ */ E(Wt, { children: /* @__PURE__ */ E(ta, { ...m }) }),
                        /* @__PURE__ */ E(Ht, {}),
                      ],
                    }),
                }),
                /* @__PURE__ */ E(jn, {
                  control: u.control,
                  name: 'eventDate',
                  render: ({ field: m }) =>
                    /* @__PURE__ */ H(Mt, {
                      children: [
                        /* @__PURE__ */ E(Bt, { children: r('fields.eventDate', 'Event Date') }),
                        /* @__PURE__ */ E(Wt, {
                          children: /* @__PURE__ */ E(tr, { type: 'date', ...m }),
                        }),
                        /* @__PURE__ */ E(Ht, {}),
                      ],
                    }),
                }),
                /* @__PURE__ */ H(lr, {
                  children: [
                    /* @__PURE__ */ E(Ie, {
                      type: 'button',
                      variant: 'outline',
                      onClick: () => t(!1),
                      children: r('common.cancel', 'Cancel'),
                    }),
                    /* @__PURE__ */ E(Ie, { type: 'submit', disabled: l, children: d }),
                  ],
                }),
              ],
            }),
          }),
        ],
      }),
    })
  )
}
function Dg() {
  const { t: e } = es('gift-plugin'),
    { data: t, isLoading: n } = tg(),
    r = og(),
    [o, s] = gt(!1),
    [i, a] = gt(void 0),
    [u, c] = gt(null),
    l = () => {
      ;(a(void 0), s(!0))
    },
    d = (h) => {
      ;(a(h), s(!0))
    },
    m = (h) => {
      c(h)
    },
    v = async () => {
      u && (await r.mutateAsync(u), c(null))
    }
  return n
    ? /* @__PURE__ */ H('div', {
        className: 'space-y-4 p-6',
        children: [
          /* @__PURE__ */ E(Ur, { className: 'h-10 w-48' }),
          /* @__PURE__ */ E('div', {
            className: 'grid gap-4 md:grid-cols-2 lg:grid-cols-3',
            children: [1, 2, 3].map((h) => /* @__PURE__ */ E(Ur, { className: 'h-32' }, h)),
          }),
        ],
      })
    : /* @__PURE__ */ H('div', {
        className: 'space-y-6 p-6',
        children: [
          /* @__PURE__ */ H('div', {
            className: 'flex items-center justify-between',
            children: [
              /* @__PURE__ */ E('h1', {
                className: 'text-3xl font-bold tracking-tight',
                children: e('title', 'Gift Lists'),
              }),
              /* @__PURE__ */ H(Ie, {
                onClick: l,
                children: [
                  /* @__PURE__ */ E(pa, { className: 'mr-2 h-4 w-4' }),
                  e('actions.addList', 'Add List'),
                ],
              }),
            ],
          }),
          /* @__PURE__ */ E('div', {
            className: 'grid gap-4 md:grid-cols-2 lg:grid-cols-3',
            children: t?.map((h) =>
              /* @__PURE__ */ H(
                os,
                {
                  children: [
                    /* @__PURE__ */ E(ss, {
                      className: 'flex flex-row items-center justify-between space-y-0 pb-2',
                      children: /* @__PURE__ */ E(is, {
                        className: 'text-xl font-medium',
                        children: h.name,
                      }),
                    }),
                    /* @__PURE__ */ H(as, {
                      children: [
                        h.description
                          ? /* @__PURE__ */ E('p', {
                              className: 'mb-2 text-sm text-gray-500',
                              children: h.description,
                            })
                          : null,
                        h.eventDate
                          ? /* @__PURE__ */ E('p', {
                              className: 'mb-4 text-sm text-gray-400',
                              children: new Date(h.eventDate).toLocaleDateString(),
                            })
                          : null,
                        /* @__PURE__ */ H('div', {
                          className: 'mt-4 flex justify-end gap-2',
                          children: [
                            /* @__PURE__ */ H(Ie, {
                              variant: 'ghost',
                              size: 'sm',
                              onClick: () => d(h),
                              children: [
                                /* @__PURE__ */ E(ha, { className: 'mr-1 h-4 w-4' }),
                                e('actions.edit', 'Edit'),
                              ],
                            }),
                            /* @__PURE__ */ H(Ie, {
                              variant: 'ghost',
                              size: 'sm',
                              className: 'text-red-500 hover:bg-red-50 hover:text-red-700',
                              onClick: () => m(h.id),
                              children: [
                                /* @__PURE__ */ E(ma, { className: 'mr-1 h-4 w-4' }),
                                e('actions.delete', 'Delete'),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                },
                h.id,
              ),
            ),
          }),
          /* @__PURE__ */ E(ig, { open: o, onOpenChange: s, listToEdit: i }),
          /* @__PURE__ */ E(Us, {
            open: !!u,
            onOpenChange: (h) => !h && c(null),
            children: /* @__PURE__ */ H(cr, {
              children: [
                /* @__PURE__ */ H(ur, {
                  children: [
                    /* @__PURE__ */ E(dr, { children: e('common.areYouSure', 'Are you sure?') }),
                    /* @__PURE__ */ E(fr, {
                      children: e(
                        'deleteConfirm',
                        'This action cannot be undone. This will permanently delete the gift list.',
                      ),
                    }),
                  ],
                }),
                /* @__PURE__ */ H(lr, {
                  children: [
                    /* @__PURE__ */ E(Ie, {
                      variant: 'outline',
                      onClick: () => c(null),
                      children: e('common.cancel', 'Cancel'),
                    }),
                    /* @__PURE__ */ E(Ie, {
                      variant: 'destructive',
                      onClick: v,
                      children: e('common.delete', 'Delete'),
                    }),
                  ],
                }),
              ],
            }),
          }),
        ],
      })
}
export { Dg as default }
