var Jd = Object.defineProperty;
var Mi = (t) => {
  throw TypeError(t);
};
var Bd = (t, e, r) => e in t ? Jd(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : t[e] = r;
var Br = (t, e, r) => Bd(t, typeof e != "symbol" ? e + "" : e, r), Ks = (t, e, r) => e.has(t) || Mi("Cannot " + r);
var Y = (t, e, r) => (Ks(t, e, "read from private field"), r ? r.call(t) : e.get(t)), ot = (t, e, r) => e.has(t) ? Mi("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, r), Ke = (t, e, r, n) => (Ks(t, e, "write to private field"), n ? n.call(t, r) : e.set(t, r), r), yt = (t, e, r) => (Ks(t, e, "access private method"), r);
import Sl, { ipcMain as mt, Menu as Wd, app as Ft, BrowserWindow as Pl, nativeImage as Xd, Tray as Yd } from "electron";
import { fileURLToPath as Qd } from "node:url";
import re from "node:path";
import me from "node:process";
import { promisify as Ne, isDeepStrictEqual as Vi } from "node:util";
import Q from "node:fs";
import rr, { randomUUID as Zd } from "node:crypto";
import Fi from "node:assert";
import Ol from "node:os";
import "node:events";
import "node:stream";
const pr = (t) => {
  const e = typeof t;
  return t !== null && (e === "object" || e === "function");
}, Nl = /* @__PURE__ */ new Set([
  "__proto__",
  "prototype",
  "constructor"
]), Rl = 1e6, ef = (t) => t >= "0" && t <= "9";
function jl(t) {
  if (t === "0")
    return !0;
  if (/^[1-9]\d*$/.test(t)) {
    const e = Number.parseInt(t, 10);
    return e <= Number.MAX_SAFE_INTEGER && e <= Rl;
  }
  return !1;
}
function qs(t, e) {
  return Nl.has(t) ? !1 : (t && jl(t) ? e.push(Number.parseInt(t, 10)) : e.push(t), !0);
}
function tf(t) {
  if (typeof t != "string")
    throw new TypeError(`Expected a string, got ${typeof t}`);
  const e = [];
  let r = "", n = "start", s = !1, a = 0;
  for (const o of t) {
    if (a++, s) {
      r += o, s = !1;
      continue;
    }
    if (o === "\\") {
      if (n === "index")
        throw new Error(`Invalid character '${o}' in an index at position ${a}`);
      if (n === "indexEnd")
        throw new Error(`Invalid character '${o}' after an index at position ${a}`);
      s = !0, n = n === "start" ? "property" : n;
      continue;
    }
    switch (o) {
      case ".": {
        if (n === "index")
          throw new Error(`Invalid character '${o}' in an index at position ${a}`);
        if (n === "indexEnd") {
          n = "property";
          break;
        }
        if (!qs(r, e))
          return [];
        r = "", n = "property";
        break;
      }
      case "[": {
        if (n === "index")
          throw new Error(`Invalid character '${o}' in an index at position ${a}`);
        if (n === "indexEnd") {
          n = "index";
          break;
        }
        if (n === "property" || n === "start") {
          if ((r || n === "property") && !qs(r, e))
            return [];
          r = "";
        }
        n = "index";
        break;
      }
      case "]": {
        if (n === "index") {
          if (r === "")
            r = (e.pop() || "") + "[]", n = "property";
          else {
            const i = Number.parseInt(r, 10);
            !Number.isNaN(i) && Number.isFinite(i) && i >= 0 && i <= Number.MAX_SAFE_INTEGER && i <= Rl && r === String(i) ? e.push(i) : e.push(r), r = "", n = "indexEnd";
          }
          break;
        }
        if (n === "indexEnd")
          throw new Error(`Invalid character '${o}' after an index at position ${a}`);
        r += o;
        break;
      }
      default: {
        if (n === "index" && !ef(o))
          throw new Error(`Invalid character '${o}' in an index at position ${a}`);
        if (n === "indexEnd")
          throw new Error(`Invalid character '${o}' after an index at position ${a}`);
        n === "start" && (n = "property"), r += o;
      }
    }
  }
  switch (s && (r += "\\"), n) {
    case "property": {
      if (!qs(r, e))
        return [];
      break;
    }
    case "index":
      throw new Error("Index was not closed");
    case "start": {
      e.push("");
      break;
    }
  }
  return e;
}
function ws(t) {
  if (typeof t == "string")
    return tf(t);
  if (Array.isArray(t)) {
    const e = [];
    for (const [r, n] of t.entries()) {
      if (typeof n != "string" && typeof n != "number")
        throw new TypeError(`Expected a string or number for path segment at index ${r}, got ${typeof n}`);
      if (typeof n == "number" && !Number.isFinite(n))
        throw new TypeError(`Path segment at index ${r} must be a finite number, got ${n}`);
      if (Nl.has(n))
        return [];
      typeof n == "string" && jl(n) ? e.push(Number.parseInt(n, 10)) : e.push(n);
    }
    return e;
  }
  return [];
}
function zi(t, e, r) {
  if (!pr(t) || typeof e != "string" && !Array.isArray(e))
    return r === void 0 ? t : r;
  const n = ws(e);
  if (n.length === 0)
    return r;
  for (let s = 0; s < n.length; s++) {
    const a = n[s];
    if (t = t[a], t == null) {
      if (s !== n.length - 1)
        return r;
      break;
    }
  }
  return t === void 0 ? r : t;
}
function Rn(t, e, r) {
  if (!pr(t) || typeof e != "string" && !Array.isArray(e))
    return t;
  const n = t, s = ws(e);
  if (s.length === 0)
    return t;
  for (let a = 0; a < s.length; a++) {
    const o = s[a];
    if (a === s.length - 1)
      t[o] = r;
    else if (!pr(t[o])) {
      const c = typeof s[a + 1] == "number";
      t[o] = c ? [] : {};
    }
    t = t[o];
  }
  return n;
}
function rf(t, e) {
  if (!pr(t) || typeof e != "string" && !Array.isArray(e))
    return !1;
  const r = ws(e);
  if (r.length === 0)
    return !1;
  for (let n = 0; n < r.length; n++) {
    const s = r[n];
    if (n === r.length - 1)
      return Object.hasOwn(t, s) ? (delete t[s], !0) : !1;
    if (t = t[s], !pr(t))
      return !1;
  }
}
function xs(t, e) {
  if (!pr(t) || typeof e != "string" && !Array.isArray(e))
    return !1;
  const r = ws(e);
  if (r.length === 0)
    return !1;
  for (const n of r) {
    if (!pr(t) || !(n in t))
      return !1;
    t = t[n];
  }
  return !0;
}
const Dt = Ol.homedir(), Ma = Ol.tmpdir(), { env: Or } = me, nf = (t) => {
  const e = re.join(Dt, "Library");
  return {
    data: re.join(e, "Application Support", t),
    config: re.join(e, "Preferences", t),
    cache: re.join(e, "Caches", t),
    log: re.join(e, "Logs", t),
    temp: re.join(Ma, t)
  };
}, sf = (t) => {
  const e = Or.APPDATA || re.join(Dt, "AppData", "Roaming"), r = Or.LOCALAPPDATA || re.join(Dt, "AppData", "Local");
  return {
    // Data/config/cache/log are invented by me as Windows isn't opinionated about this
    data: re.join(r, t, "Data"),
    config: re.join(e, t, "Config"),
    cache: re.join(r, t, "Cache"),
    log: re.join(r, t, "Log"),
    temp: re.join(Ma, t)
  };
}, af = (t) => {
  const e = re.basename(Dt);
  return {
    data: re.join(Or.XDG_DATA_HOME || re.join(Dt, ".local", "share"), t),
    config: re.join(Or.XDG_CONFIG_HOME || re.join(Dt, ".config"), t),
    cache: re.join(Or.XDG_CACHE_HOME || re.join(Dt, ".cache"), t),
    // https://wiki.debian.org/XDGBaseDirectorySpecification#state
    log: re.join(Or.XDG_STATE_HOME || re.join(Dt, ".local", "state"), t),
    temp: re.join(Ma, e, t)
  };
};
function of(t, { suffix: e = "nodejs" } = {}) {
  if (typeof t != "string")
    throw new TypeError(`Expected a string, got ${typeof t}`);
  return e && (t += `-${e}`), me.platform === "darwin" ? nf(t) : me.platform === "win32" ? sf(t) : af(t);
}
const Pt = (t, e) => {
  const { onError: r } = e;
  return function(...s) {
    return t.apply(void 0, s).catch(r);
  };
}, $t = (t, e) => {
  const { onError: r } = e;
  return function(...s) {
    try {
      return t.apply(void 0, s);
    } catch (a) {
      return r(a);
    }
  };
}, cf = 250, Ot = (t, e) => {
  const { isRetriable: r } = e;
  return function(s) {
    const { timeout: a } = s, o = s.interval ?? cf, i = Date.now() + a;
    return function c(...l) {
      return t.apply(void 0, l).catch((d) => {
        if (!r(d) || Date.now() >= i)
          throw d;
        const f = Math.round(o * Math.random());
        return f > 0 ? new Promise((g) => setTimeout(g, f)).then(() => c.apply(void 0, l)) : c.apply(void 0, l);
      });
    };
  };
}, Nt = (t, e) => {
  const { isRetriable: r } = e;
  return function(s) {
    const { timeout: a } = s, o = Date.now() + a;
    return function(...c) {
      for (; ; )
        try {
          return t.apply(void 0, c);
        } catch (l) {
          if (!r(l) || Date.now() >= o)
            throw l;
          continue;
        }
    };
  };
}, Nr = {
  /* API */
  isChangeErrorOk: (t) => {
    if (!Nr.isNodeError(t))
      return !1;
    const { code: e } = t;
    return e === "ENOSYS" || !lf && (e === "EINVAL" || e === "EPERM");
  },
  isNodeError: (t) => t instanceof Error,
  isRetriableError: (t) => {
    if (!Nr.isNodeError(t))
      return !1;
    const { code: e } = t;
    return e === "EMFILE" || e === "ENFILE" || e === "EAGAIN" || e === "EBUSY" || e === "EACCESS" || e === "EACCES" || e === "EACCS" || e === "EPERM";
  },
  onChangeError: (t) => {
    if (!Nr.isNodeError(t))
      throw t;
    if (!Nr.isChangeErrorOk(t))
      throw t;
  }
}, jn = {
  onError: Nr.onChangeError
}, qe = {
  onError: () => {
  }
}, lf = me.getuid ? !me.getuid() : !1, Re = {
  isRetriable: Nr.isRetriableError
}, Ie = {
  attempt: {
    /* ASYNC */
    chmod: Pt(Ne(Q.chmod), jn),
    chown: Pt(Ne(Q.chown), jn),
    close: Pt(Ne(Q.close), qe),
    fsync: Pt(Ne(Q.fsync), qe),
    mkdir: Pt(Ne(Q.mkdir), qe),
    realpath: Pt(Ne(Q.realpath), qe),
    stat: Pt(Ne(Q.stat), qe),
    unlink: Pt(Ne(Q.unlink), qe),
    /* SYNC */
    chmodSync: $t(Q.chmodSync, jn),
    chownSync: $t(Q.chownSync, jn),
    closeSync: $t(Q.closeSync, qe),
    existsSync: $t(Q.existsSync, qe),
    fsyncSync: $t(Q.fsync, qe),
    mkdirSync: $t(Q.mkdirSync, qe),
    realpathSync: $t(Q.realpathSync, qe),
    statSync: $t(Q.statSync, qe),
    unlinkSync: $t(Q.unlinkSync, qe)
  },
  retry: {
    /* ASYNC */
    close: Ot(Ne(Q.close), Re),
    fsync: Ot(Ne(Q.fsync), Re),
    open: Ot(Ne(Q.open), Re),
    readFile: Ot(Ne(Q.readFile), Re),
    rename: Ot(Ne(Q.rename), Re),
    stat: Ot(Ne(Q.stat), Re),
    write: Ot(Ne(Q.write), Re),
    writeFile: Ot(Ne(Q.writeFile), Re),
    /* SYNC */
    closeSync: Nt(Q.closeSync, Re),
    fsyncSync: Nt(Q.fsyncSync, Re),
    openSync: Nt(Q.openSync, Re),
    readFileSync: Nt(Q.readFileSync, Re),
    renameSync: Nt(Q.renameSync, Re),
    statSync: Nt(Q.statSync, Re),
    writeSync: Nt(Q.writeSync, Re),
    writeFileSync: Nt(Q.writeFileSync, Re)
  }
}, uf = "utf8", Ui = 438, df = 511, ff = {}, hf = me.geteuid ? me.geteuid() : -1, pf = me.getegid ? me.getegid() : -1, mf = 1e3, gf = !!me.getuid;
me.getuid && me.getuid();
const Ki = 128, yf = (t) => t instanceof Error && "code" in t, qi = (t) => typeof t == "string", Gs = (t) => t === void 0, $f = me.platform === "linux", Tl = me.platform === "win32", Va = ["SIGHUP", "SIGINT", "SIGTERM"];
Tl || Va.push("SIGALRM", "SIGABRT", "SIGVTALRM", "SIGXCPU", "SIGXFSZ", "SIGUSR2", "SIGTRAP", "SIGSYS", "SIGQUIT", "SIGIOT");
$f && Va.push("SIGIO", "SIGPOLL", "SIGPWR", "SIGSTKFLT");
class vf {
  /* CONSTRUCTOR */
  constructor() {
    this.callbacks = /* @__PURE__ */ new Set(), this.exited = !1, this.exit = (e) => {
      if (!this.exited) {
        this.exited = !0;
        for (const r of this.callbacks)
          r();
        e && (Tl && e !== "SIGINT" && e !== "SIGTERM" && e !== "SIGKILL" ? me.kill(me.pid, "SIGTERM") : me.kill(me.pid, e));
      }
    }, this.hook = () => {
      me.once("exit", () => this.exit());
      for (const e of Va)
        try {
          me.once(e, () => this.exit(e));
        } catch {
        }
    }, this.register = (e) => (this.callbacks.add(e), () => {
      this.callbacks.delete(e);
    }), this.hook();
  }
}
const _f = new vf(), wf = _f.register, ke = {
  /* VARIABLES */
  store: {},
  // filePath => purge
  /* API */
  create: (t) => {
    const e = `000000${Math.floor(Math.random() * 16777215).toString(16)}`.slice(-6), s = `.tmp-${Date.now().toString().slice(-10)}${e}`;
    return `${t}${s}`;
  },
  get: (t, e, r = !0) => {
    const n = ke.truncate(e(t));
    return n in ke.store ? ke.get(t, e, r) : (ke.store[n] = r, [n, () => delete ke.store[n]]);
  },
  purge: (t) => {
    ke.store[t] && (delete ke.store[t], Ie.attempt.unlink(t));
  },
  purgeSync: (t) => {
    ke.store[t] && (delete ke.store[t], Ie.attempt.unlinkSync(t));
  },
  purgeSyncAll: () => {
    for (const t in ke.store)
      ke.purgeSync(t);
  },
  truncate: (t) => {
    const e = re.basename(t);
    if (e.length <= Ki)
      return t;
    const r = /^(\.?)(.*?)((?:\.[^.]+)?(?:\.tmp-\d{10}[a-f0-9]{6})?)$/.exec(e);
    if (!r)
      return t;
    const n = e.length - Ki;
    return `${t.slice(0, -e.length)}${r[1]}${r[2].slice(0, -n)}${r[3]}`;
  }
};
wf(ke.purgeSyncAll);
function Il(t, e, r = ff) {
  if (qi(r))
    return Il(t, e, { encoding: r });
  const s = { timeout: r.timeout ?? mf };
  let a = null, o = null, i = null;
  try {
    const c = Ie.attempt.realpathSync(t), l = !!c;
    t = c || t, [o, a] = ke.get(t, r.tmpCreate || ke.create, r.tmpPurge !== !1);
    const d = gf && Gs(r.chown), f = Gs(r.mode);
    if (l && (d || f)) {
      const w = Ie.attempt.statSync(t);
      w && (r = { ...r }, d && (r.chown = { uid: w.uid, gid: w.gid }), f && (r.mode = w.mode));
    }
    if (!l) {
      const w = re.dirname(t);
      Ie.attempt.mkdirSync(w, {
        mode: df,
        recursive: !0
      });
    }
    i = Ie.retry.openSync(s)(o, "w", r.mode || Ui), r.tmpCreated && r.tmpCreated(o), qi(e) ? Ie.retry.writeSync(s)(i, e, 0, r.encoding || uf) : Gs(e) || Ie.retry.writeSync(s)(i, e, 0, e.length, 0), r.fsync !== !1 && (r.fsyncWait !== !1 ? Ie.retry.fsyncSync(s)(i) : Ie.attempt.fsync(i)), Ie.retry.closeSync(s)(i), i = null, r.chown && (r.chown.uid !== hf || r.chown.gid !== pf) && Ie.attempt.chownSync(o, r.chown.uid, r.chown.gid), r.mode && r.mode !== Ui && Ie.attempt.chmodSync(o, r.mode);
    try {
      Ie.retry.renameSync(s)(o, t);
    } catch (w) {
      if (!yf(w) || w.code !== "ENAMETOOLONG")
        throw w;
      Ie.retry.renameSync(s)(o, ke.truncate(t));
    }
    a(), o = null;
  } finally {
    i && Ie.attempt.closeSync(i), o && ke.purge(o);
  }
}
function kl(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var ma = { exports: {} }, Cl = {}, rt = {}, Cr = {}, wn = {}, Z = {}, $n = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.regexpCode = t.getEsmExportName = t.getProperty = t.safeStringify = t.stringify = t.strConcat = t.addCodeArg = t.str = t._ = t.nil = t._Code = t.Name = t.IDENTIFIER = t._CodeOrName = void 0;
  class e {
  }
  t._CodeOrName = e, t.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
  class r extends e {
    constructor(E) {
      if (super(), !t.IDENTIFIER.test(E))
        throw new Error("CodeGen: name must be a valid identifier");
      this.str = E;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      return !1;
    }
    get names() {
      return { [this.str]: 1 };
    }
  }
  t.Name = r;
  class n extends e {
    constructor(E) {
      super(), this._items = typeof E == "string" ? [E] : E;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      if (this._items.length > 1)
        return !1;
      const E = this._items[0];
      return E === "" || E === '""';
    }
    get str() {
      var E;
      return (E = this._str) !== null && E !== void 0 ? E : this._str = this._items.reduce((P, N) => `${P}${N}`, "");
    }
    get names() {
      var E;
      return (E = this._names) !== null && E !== void 0 ? E : this._names = this._items.reduce((P, N) => (N instanceof r && (P[N.str] = (P[N.str] || 0) + 1), P), {});
    }
  }
  t._Code = n, t.nil = new n("");
  function s(p, ...E) {
    const P = [p[0]];
    let N = 0;
    for (; N < E.length; )
      i(P, E[N]), P.push(p[++N]);
    return new n(P);
  }
  t._ = s;
  const a = new n("+");
  function o(p, ...E) {
    const P = [g(p[0])];
    let N = 0;
    for (; N < E.length; )
      P.push(a), i(P, E[N]), P.push(a, g(p[++N]));
    return c(P), new n(P);
  }
  t.str = o;
  function i(p, E) {
    E instanceof n ? p.push(...E._items) : E instanceof r ? p.push(E) : p.push(f(E));
  }
  t.addCodeArg = i;
  function c(p) {
    let E = 1;
    for (; E < p.length - 1; ) {
      if (p[E] === a) {
        const P = l(p[E - 1], p[E + 1]);
        if (P !== void 0) {
          p.splice(E - 1, 3, P);
          continue;
        }
        p[E++] = "+";
      }
      E++;
    }
  }
  function l(p, E) {
    if (E === '""')
      return p;
    if (p === '""')
      return E;
    if (typeof p == "string")
      return E instanceof r || p[p.length - 1] !== '"' ? void 0 : typeof E != "string" ? `${p.slice(0, -1)}${E}"` : E[0] === '"' ? p.slice(0, -1) + E.slice(1) : void 0;
    if (typeof E == "string" && E[0] === '"' && !(p instanceof r))
      return `"${p}${E.slice(1)}`;
  }
  function d(p, E) {
    return E.emptyStr() ? p : p.emptyStr() ? E : o`${p}${E}`;
  }
  t.strConcat = d;
  function f(p) {
    return typeof p == "number" || typeof p == "boolean" || p === null ? p : g(Array.isArray(p) ? p.join(",") : p);
  }
  function w(p) {
    return new n(g(p));
  }
  t.stringify = w;
  function g(p) {
    return JSON.stringify(p).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
  }
  t.safeStringify = g;
  function y(p) {
    return typeof p == "string" && t.IDENTIFIER.test(p) ? new n(`.${p}`) : s`[${p}]`;
  }
  t.getProperty = y;
  function v(p) {
    if (typeof p == "string" && t.IDENTIFIER.test(p))
      return new n(`${p}`);
    throw new Error(`CodeGen: invalid export name: ${p}, use explicit $id name mapping`);
  }
  t.getEsmExportName = v;
  function $(p) {
    return new n(p.toString());
  }
  t.regexpCode = $;
})($n);
var ga = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.ValueScope = t.ValueScopeName = t.Scope = t.varKinds = t.UsedValueState = void 0;
  const e = $n;
  class r extends Error {
    constructor(l) {
      super(`CodeGen: "code" for ${l} not defined`), this.value = l.value;
    }
  }
  var n;
  (function(c) {
    c[c.Started = 0] = "Started", c[c.Completed = 1] = "Completed";
  })(n || (t.UsedValueState = n = {})), t.varKinds = {
    const: new e.Name("const"),
    let: new e.Name("let"),
    var: new e.Name("var")
  };
  class s {
    constructor({ prefixes: l, parent: d } = {}) {
      this._names = {}, this._prefixes = l, this._parent = d;
    }
    toName(l) {
      return l instanceof e.Name ? l : this.name(l);
    }
    name(l) {
      return new e.Name(this._newName(l));
    }
    _newName(l) {
      const d = this._names[l] || this._nameGroup(l);
      return `${l}${d.index++}`;
    }
    _nameGroup(l) {
      var d, f;
      if (!((f = (d = this._parent) === null || d === void 0 ? void 0 : d._prefixes) === null || f === void 0) && f.has(l) || this._prefixes && !this._prefixes.has(l))
        throw new Error(`CodeGen: prefix "${l}" is not allowed in this scope`);
      return this._names[l] = { prefix: l, index: 0 };
    }
  }
  t.Scope = s;
  class a extends e.Name {
    constructor(l, d) {
      super(d), this.prefix = l;
    }
    setValue(l, { property: d, itemIndex: f }) {
      this.value = l, this.scopePath = (0, e._)`.${new e.Name(d)}[${f}]`;
    }
  }
  t.ValueScopeName = a;
  const o = (0, e._)`\n`;
  class i extends s {
    constructor(l) {
      super(l), this._values = {}, this._scope = l.scope, this.opts = { ...l, _n: l.lines ? o : e.nil };
    }
    get() {
      return this._scope;
    }
    name(l) {
      return new a(l, this._newName(l));
    }
    value(l, d) {
      var f;
      if (d.ref === void 0)
        throw new Error("CodeGen: ref must be passed in value");
      const w = this.toName(l), { prefix: g } = w, y = (f = d.key) !== null && f !== void 0 ? f : d.ref;
      let v = this._values[g];
      if (v) {
        const E = v.get(y);
        if (E)
          return E;
      } else
        v = this._values[g] = /* @__PURE__ */ new Map();
      v.set(y, w);
      const $ = this._scope[g] || (this._scope[g] = []), p = $.length;
      return $[p] = d.ref, w.setValue(d, { property: g, itemIndex: p }), w;
    }
    getValue(l, d) {
      const f = this._values[l];
      if (f)
        return f.get(d);
    }
    scopeRefs(l, d = this._values) {
      return this._reduceValues(d, (f) => {
        if (f.scopePath === void 0)
          throw new Error(`CodeGen: name "${f}" has no value`);
        return (0, e._)`${l}${f.scopePath}`;
      });
    }
    scopeCode(l = this._values, d, f) {
      return this._reduceValues(l, (w) => {
        if (w.value === void 0)
          throw new Error(`CodeGen: name "${w}" has no value`);
        return w.value.code;
      }, d, f);
    }
    _reduceValues(l, d, f = {}, w) {
      let g = e.nil;
      for (const y in l) {
        const v = l[y];
        if (!v)
          continue;
        const $ = f[y] = f[y] || /* @__PURE__ */ new Map();
        v.forEach((p) => {
          if ($.has(p))
            return;
          $.set(p, n.Started);
          let E = d(p);
          if (E) {
            const P = this.opts.es5 ? t.varKinds.var : t.varKinds.const;
            g = (0, e._)`${g}${P} ${p} = ${E};${this.opts._n}`;
          } else if (E = w == null ? void 0 : w(p))
            g = (0, e._)`${g}${E}${this.opts._n}`;
          else
            throw new r(p);
          $.set(p, n.Completed);
        });
      }
      return g;
    }
  }
  t.ValueScope = i;
})(ga);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.or = t.and = t.not = t.CodeGen = t.operators = t.varKinds = t.ValueScopeName = t.ValueScope = t.Scope = t.Name = t.regexpCode = t.stringify = t.getProperty = t.nil = t.strConcat = t.str = t._ = void 0;
  const e = $n, r = ga;
  var n = $n;
  Object.defineProperty(t, "_", { enumerable: !0, get: function() {
    return n._;
  } }), Object.defineProperty(t, "str", { enumerable: !0, get: function() {
    return n.str;
  } }), Object.defineProperty(t, "strConcat", { enumerable: !0, get: function() {
    return n.strConcat;
  } }), Object.defineProperty(t, "nil", { enumerable: !0, get: function() {
    return n.nil;
  } }), Object.defineProperty(t, "getProperty", { enumerable: !0, get: function() {
    return n.getProperty;
  } }), Object.defineProperty(t, "stringify", { enumerable: !0, get: function() {
    return n.stringify;
  } }), Object.defineProperty(t, "regexpCode", { enumerable: !0, get: function() {
    return n.regexpCode;
  } }), Object.defineProperty(t, "Name", { enumerable: !0, get: function() {
    return n.Name;
  } });
  var s = ga;
  Object.defineProperty(t, "Scope", { enumerable: !0, get: function() {
    return s.Scope;
  } }), Object.defineProperty(t, "ValueScope", { enumerable: !0, get: function() {
    return s.ValueScope;
  } }), Object.defineProperty(t, "ValueScopeName", { enumerable: !0, get: function() {
    return s.ValueScopeName;
  } }), Object.defineProperty(t, "varKinds", { enumerable: !0, get: function() {
    return s.varKinds;
  } }), t.operators = {
    GT: new e._Code(">"),
    GTE: new e._Code(">="),
    LT: new e._Code("<"),
    LTE: new e._Code("<="),
    EQ: new e._Code("==="),
    NEQ: new e._Code("!=="),
    NOT: new e._Code("!"),
    OR: new e._Code("||"),
    AND: new e._Code("&&"),
    ADD: new e._Code("+")
  };
  class a {
    optimizeNodes() {
      return this;
    }
    optimizeNames(u, h) {
      return this;
    }
  }
  class o extends a {
    constructor(u, h, S) {
      super(), this.varKind = u, this.name = h, this.rhs = S;
    }
    render({ es5: u, _n: h }) {
      const S = u ? r.varKinds.var : this.varKind, T = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
      return `${S} ${this.name}${T};` + h;
    }
    optimizeNames(u, h) {
      if (u[this.name.str])
        return this.rhs && (this.rhs = j(this.rhs, u, h)), this;
    }
    get names() {
      return this.rhs instanceof e._CodeOrName ? this.rhs.names : {};
    }
  }
  class i extends a {
    constructor(u, h, S) {
      super(), this.lhs = u, this.rhs = h, this.sideEffects = S;
    }
    render({ _n: u }) {
      return `${this.lhs} = ${this.rhs};` + u;
    }
    optimizeNames(u, h) {
      if (!(this.lhs instanceof e.Name && !u[this.lhs.str] && !this.sideEffects))
        return this.rhs = j(this.rhs, u, h), this;
    }
    get names() {
      const u = this.lhs instanceof e.Name ? {} : { ...this.lhs.names };
      return X(u, this.rhs);
    }
  }
  class c extends i {
    constructor(u, h, S, T) {
      super(u, S, T), this.op = h;
    }
    render({ _n: u }) {
      return `${this.lhs} ${this.op}= ${this.rhs};` + u;
    }
  }
  class l extends a {
    constructor(u) {
      super(), this.label = u, this.names = {};
    }
    render({ _n: u }) {
      return `${this.label}:` + u;
    }
  }
  class d extends a {
    constructor(u) {
      super(), this.label = u, this.names = {};
    }
    render({ _n: u }) {
      return `break${this.label ? ` ${this.label}` : ""};` + u;
    }
  }
  class f extends a {
    constructor(u) {
      super(), this.error = u;
    }
    render({ _n: u }) {
      return `throw ${this.error};` + u;
    }
    get names() {
      return this.error.names;
    }
  }
  class w extends a {
    constructor(u) {
      super(), this.code = u;
    }
    render({ _n: u }) {
      return `${this.code};` + u;
    }
    optimizeNodes() {
      return `${this.code}` ? this : void 0;
    }
    optimizeNames(u, h) {
      return this.code = j(this.code, u, h), this;
    }
    get names() {
      return this.code instanceof e._CodeOrName ? this.code.names : {};
    }
  }
  class g extends a {
    constructor(u = []) {
      super(), this.nodes = u;
    }
    render(u) {
      return this.nodes.reduce((h, S) => h + S.render(u), "");
    }
    optimizeNodes() {
      const { nodes: u } = this;
      let h = u.length;
      for (; h--; ) {
        const S = u[h].optimizeNodes();
        Array.isArray(S) ? u.splice(h, 1, ...S) : S ? u[h] = S : u.splice(h, 1);
      }
      return u.length > 0 ? this : void 0;
    }
    optimizeNames(u, h) {
      const { nodes: S } = this;
      let T = S.length;
      for (; T--; ) {
        const I = S[T];
        I.optimizeNames(u, h) || (k(u, I.names), S.splice(T, 1));
      }
      return S.length > 0 ? this : void 0;
    }
    get names() {
      return this.nodes.reduce((u, h) => H(u, h.names), {});
    }
  }
  class y extends g {
    render(u) {
      return "{" + u._n + super.render(u) + "}" + u._n;
    }
  }
  class v extends g {
  }
  class $ extends y {
  }
  $.kind = "else";
  class p extends y {
    constructor(u, h) {
      super(h), this.condition = u;
    }
    render(u) {
      let h = `if(${this.condition})` + super.render(u);
      return this.else && (h += "else " + this.else.render(u)), h;
    }
    optimizeNodes() {
      super.optimizeNodes();
      const u = this.condition;
      if (u === !0)
        return this.nodes;
      let h = this.else;
      if (h) {
        const S = h.optimizeNodes();
        h = this.else = Array.isArray(S) ? new $(S) : S;
      }
      if (h)
        return u === !1 ? h instanceof p ? h : h.nodes : this.nodes.length ? this : new p(A(u), h instanceof p ? [h] : h.nodes);
      if (!(u === !1 || !this.nodes.length))
        return this;
    }
    optimizeNames(u, h) {
      var S;
      if (this.else = (S = this.else) === null || S === void 0 ? void 0 : S.optimizeNames(u, h), !!(super.optimizeNames(u, h) || this.else))
        return this.condition = j(this.condition, u, h), this;
    }
    get names() {
      const u = super.names;
      return X(u, this.condition), this.else && H(u, this.else.names), u;
    }
  }
  p.kind = "if";
  class E extends y {
  }
  E.kind = "for";
  class P extends E {
    constructor(u) {
      super(), this.iteration = u;
    }
    render(u) {
      return `for(${this.iteration})` + super.render(u);
    }
    optimizeNames(u, h) {
      if (super.optimizeNames(u, h))
        return this.iteration = j(this.iteration, u, h), this;
    }
    get names() {
      return H(super.names, this.iteration.names);
    }
  }
  class N extends E {
    constructor(u, h, S, T) {
      super(), this.varKind = u, this.name = h, this.from = S, this.to = T;
    }
    render(u) {
      const h = u.es5 ? r.varKinds.var : this.varKind, { name: S, from: T, to: I } = this;
      return `for(${h} ${S}=${T}; ${S}<${I}; ${S}++)` + super.render(u);
    }
    get names() {
      const u = X(super.names, this.from);
      return X(u, this.to);
    }
  }
  class R extends E {
    constructor(u, h, S, T) {
      super(), this.loop = u, this.varKind = h, this.name = S, this.iterable = T;
    }
    render(u) {
      return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(u);
    }
    optimizeNames(u, h) {
      if (super.optimizeNames(u, h))
        return this.iterable = j(this.iterable, u, h), this;
    }
    get names() {
      return H(super.names, this.iterable.names);
    }
  }
  class z extends y {
    constructor(u, h, S) {
      super(), this.name = u, this.args = h, this.async = S;
    }
    render(u) {
      return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(u);
    }
  }
  z.kind = "func";
  class G extends g {
    render(u) {
      return "return " + super.render(u);
    }
  }
  G.kind = "return";
  class ue extends y {
    render(u) {
      let h = "try" + super.render(u);
      return this.catch && (h += this.catch.render(u)), this.finally && (h += this.finally.render(u)), h;
    }
    optimizeNodes() {
      var u, h;
      return super.optimizeNodes(), (u = this.catch) === null || u === void 0 || u.optimizeNodes(), (h = this.finally) === null || h === void 0 || h.optimizeNodes(), this;
    }
    optimizeNames(u, h) {
      var S, T;
      return super.optimizeNames(u, h), (S = this.catch) === null || S === void 0 || S.optimizeNames(u, h), (T = this.finally) === null || T === void 0 || T.optimizeNames(u, h), this;
    }
    get names() {
      const u = super.names;
      return this.catch && H(u, this.catch.names), this.finally && H(u, this.finally.names), u;
    }
  }
  class ie extends y {
    constructor(u) {
      super(), this.error = u;
    }
    render(u) {
      return `catch(${this.error})` + super.render(u);
    }
  }
  ie.kind = "catch";
  class ce extends y {
    render(u) {
      return "finally" + super.render(u);
    }
  }
  ce.kind = "finally";
  class U {
    constructor(u, h = {}) {
      this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = { ...h, _n: h.lines ? `
` : "" }, this._extScope = u, this._scope = new r.Scope({ parent: u }), this._nodes = [new v()];
    }
    toString() {
      return this._root.render(this.opts);
    }
    // returns unique name in the internal scope
    name(u) {
      return this._scope.name(u);
    }
    // reserves unique name in the external scope
    scopeName(u) {
      return this._extScope.name(u);
    }
    // reserves unique name in the external scope and assigns value to it
    scopeValue(u, h) {
      const S = this._extScope.value(u, h);
      return (this._values[S.prefix] || (this._values[S.prefix] = /* @__PURE__ */ new Set())).add(S), S;
    }
    getScopeValue(u, h) {
      return this._extScope.getValue(u, h);
    }
    // return code that assigns values in the external scope to the names that are used internally
    // (same names that were returned by gen.scopeName or gen.scopeValue)
    scopeRefs(u) {
      return this._extScope.scopeRefs(u, this._values);
    }
    scopeCode() {
      return this._extScope.scopeCode(this._values);
    }
    _def(u, h, S, T) {
      const I = this._scope.toName(h);
      return S !== void 0 && T && (this._constants[I.str] = S), this._leafNode(new o(u, I, S)), I;
    }
    // `const` declaration (`var` in es5 mode)
    const(u, h, S) {
      return this._def(r.varKinds.const, u, h, S);
    }
    // `let` declaration with optional assignment (`var` in es5 mode)
    let(u, h, S) {
      return this._def(r.varKinds.let, u, h, S);
    }
    // `var` declaration with optional assignment
    var(u, h, S) {
      return this._def(r.varKinds.var, u, h, S);
    }
    // assignment code
    assign(u, h, S) {
      return this._leafNode(new i(u, h, S));
    }
    // `+=` code
    add(u, h) {
      return this._leafNode(new c(u, t.operators.ADD, h));
    }
    // appends passed SafeExpr to code or executes Block
    code(u) {
      return typeof u == "function" ? u() : u !== e.nil && this._leafNode(new w(u)), this;
    }
    // returns code for object literal for the passed argument list of key-value pairs
    object(...u) {
      const h = ["{"];
      for (const [S, T] of u)
        h.length > 1 && h.push(","), h.push(S), (S !== T || this.opts.es5) && (h.push(":"), (0, e.addCodeArg)(h, T));
      return h.push("}"), new e._Code(h);
    }
    // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
    if(u, h, S) {
      if (this._blockNode(new p(u)), h && S)
        this.code(h).else().code(S).endIf();
      else if (h)
        this.code(h).endIf();
      else if (S)
        throw new Error('CodeGen: "else" body without "then" body');
      return this;
    }
    // `else if` clause - invalid without `if` or after `else` clauses
    elseIf(u) {
      return this._elseNode(new p(u));
    }
    // `else` clause - only valid after `if` or `else if` clauses
    else() {
      return this._elseNode(new $());
    }
    // end `if` statement (needed if gen.if was used only with condition)
    endIf() {
      return this._endBlockNode(p, $);
    }
    _for(u, h) {
      return this._blockNode(u), h && this.code(h).endFor(), this;
    }
    // a generic `for` clause (or statement if `forBody` is passed)
    for(u, h) {
      return this._for(new P(u), h);
    }
    // `for` statement for a range of values
    forRange(u, h, S, T, I = this.opts.es5 ? r.varKinds.var : r.varKinds.let) {
      const K = this._scope.toName(u);
      return this._for(new N(I, K, h, S), () => T(K));
    }
    // `for-of` statement (in es5 mode replace with a normal for loop)
    forOf(u, h, S, T = r.varKinds.const) {
      const I = this._scope.toName(u);
      if (this.opts.es5) {
        const K = h instanceof e.Name ? h : this.var("_arr", h);
        return this.forRange("_i", 0, (0, e._)`${K}.length`, (F) => {
          this.var(I, (0, e._)`${K}[${F}]`), S(I);
        });
      }
      return this._for(new R("of", T, I, h), () => S(I));
    }
    // `for-in` statement.
    // With option `ownProperties` replaced with a `for-of` loop for object keys
    forIn(u, h, S, T = this.opts.es5 ? r.varKinds.var : r.varKinds.const) {
      if (this.opts.ownProperties)
        return this.forOf(u, (0, e._)`Object.keys(${h})`, S);
      const I = this._scope.toName(u);
      return this._for(new R("in", T, I, h), () => S(I));
    }
    // end `for` loop
    endFor() {
      return this._endBlockNode(E);
    }
    // `label` statement
    label(u) {
      return this._leafNode(new l(u));
    }
    // `break` statement
    break(u) {
      return this._leafNode(new d(u));
    }
    // `return` statement
    return(u) {
      const h = new G();
      if (this._blockNode(h), this.code(u), h.nodes.length !== 1)
        throw new Error('CodeGen: "return" should have one node');
      return this._endBlockNode(G);
    }
    // `try` statement
    try(u, h, S) {
      if (!h && !S)
        throw new Error('CodeGen: "try" without "catch" and "finally"');
      const T = new ue();
      if (this._blockNode(T), this.code(u), h) {
        const I = this.name("e");
        this._currNode = T.catch = new ie(I), h(I);
      }
      return S && (this._currNode = T.finally = new ce(), this.code(S)), this._endBlockNode(ie, ce);
    }
    // `throw` statement
    throw(u) {
      return this._leafNode(new f(u));
    }
    // start self-balancing block
    block(u, h) {
      return this._blockStarts.push(this._nodes.length), u && this.code(u).endBlock(h), this;
    }
    // end the current self-balancing block
    endBlock(u) {
      const h = this._blockStarts.pop();
      if (h === void 0)
        throw new Error("CodeGen: not in self-balancing block");
      const S = this._nodes.length - h;
      if (S < 0 || u !== void 0 && S !== u)
        throw new Error(`CodeGen: wrong number of nodes: ${S} vs ${u} expected`);
      return this._nodes.length = h, this;
    }
    // `function` heading (or definition if funcBody is passed)
    func(u, h = e.nil, S, T) {
      return this._blockNode(new z(u, h, S)), T && this.code(T).endFunc(), this;
    }
    // end function definition
    endFunc() {
      return this._endBlockNode(z);
    }
    optimize(u = 1) {
      for (; u-- > 0; )
        this._root.optimizeNodes(), this._root.optimizeNames(this._root.names, this._constants);
    }
    _leafNode(u) {
      return this._currNode.nodes.push(u), this;
    }
    _blockNode(u) {
      this._currNode.nodes.push(u), this._nodes.push(u);
    }
    _endBlockNode(u, h) {
      const S = this._currNode;
      if (S instanceof u || h && S instanceof h)
        return this._nodes.pop(), this;
      throw new Error(`CodeGen: not in block "${h ? `${u.kind}/${h.kind}` : u.kind}"`);
    }
    _elseNode(u) {
      const h = this._currNode;
      if (!(h instanceof p))
        throw new Error('CodeGen: "else" without "if"');
      return this._currNode = h.else = u, this;
    }
    get _root() {
      return this._nodes[0];
    }
    get _currNode() {
      const u = this._nodes;
      return u[u.length - 1];
    }
    set _currNode(u) {
      const h = this._nodes;
      h[h.length - 1] = u;
    }
  }
  t.CodeGen = U;
  function H(_, u) {
    for (const h in u)
      _[h] = (_[h] || 0) + (u[h] || 0);
    return _;
  }
  function X(_, u) {
    return u instanceof e._CodeOrName ? H(_, u.names) : _;
  }
  function j(_, u, h) {
    if (_ instanceof e.Name)
      return S(_);
    if (!T(_))
      return _;
    return new e._Code(_._items.reduce((I, K) => (K instanceof e.Name && (K = S(K)), K instanceof e._Code ? I.push(...K._items) : I.push(K), I), []));
    function S(I) {
      const K = h[I.str];
      return K === void 0 || u[I.str] !== 1 ? I : (delete u[I.str], K);
    }
    function T(I) {
      return I instanceof e._Code && I._items.some((K) => K instanceof e.Name && u[K.str] === 1 && h[K.str] !== void 0);
    }
  }
  function k(_, u) {
    for (const h in u)
      _[h] = (_[h] || 0) - (u[h] || 0);
  }
  function A(_) {
    return typeof _ == "boolean" || typeof _ == "number" || _ === null ? !_ : (0, e._)`!${b(_)}`;
  }
  t.not = A;
  const C = m(t.operators.AND);
  function V(..._) {
    return _.reduce(C);
  }
  t.and = V;
  const L = m(t.operators.OR);
  function O(..._) {
    return _.reduce(L);
  }
  t.or = O;
  function m(_) {
    return (u, h) => u === e.nil ? h : h === e.nil ? u : (0, e._)`${b(u)} ${_} ${b(h)}`;
  }
  function b(_) {
    return _ instanceof e.Name ? _ : (0, e._)`(${_})`;
  }
})(Z);
var D = {};
Object.defineProperty(D, "__esModule", { value: !0 });
D.checkStrictMode = D.getErrorPath = D.Type = D.useFunc = D.setEvaluated = D.evaluatedPropsToName = D.mergeEvaluated = D.eachItem = D.unescapeJsonPointer = D.escapeJsonPointer = D.escapeFragment = D.unescapeFragment = D.schemaRefOrVal = D.schemaHasRulesButRef = D.schemaHasRules = D.checkUnknownRules = D.alwaysValidSchema = D.toHash = void 0;
const de = Z, Ef = $n;
function bf(t) {
  const e = {};
  for (const r of t)
    e[r] = !0;
  return e;
}
D.toHash = bf;
function Sf(t, e) {
  return typeof e == "boolean" ? e : Object.keys(e).length === 0 ? !0 : (Al(t, e), !Dl(e, t.self.RULES.all));
}
D.alwaysValidSchema = Sf;
function Al(t, e = t.schema) {
  const { opts: r, self: n } = t;
  if (!r.strictSchema || typeof e == "boolean")
    return;
  const s = n.RULES.keywords;
  for (const a in e)
    s[a] || Vl(t, `unknown keyword: "${a}"`);
}
D.checkUnknownRules = Al;
function Dl(t, e) {
  if (typeof t == "boolean")
    return !t;
  for (const r in t)
    if (e[r])
      return !0;
  return !1;
}
D.schemaHasRules = Dl;
function Pf(t, e) {
  if (typeof t == "boolean")
    return !t;
  for (const r in t)
    if (r !== "$ref" && e.all[r])
      return !0;
  return !1;
}
D.schemaHasRulesButRef = Pf;
function Of({ topSchemaRef: t, schemaPath: e }, r, n, s) {
  if (!s) {
    if (typeof r == "number" || typeof r == "boolean")
      return r;
    if (typeof r == "string")
      return (0, de._)`${r}`;
  }
  return (0, de._)`${t}${e}${(0, de.getProperty)(n)}`;
}
D.schemaRefOrVal = Of;
function Nf(t) {
  return Ll(decodeURIComponent(t));
}
D.unescapeFragment = Nf;
function Rf(t) {
  return encodeURIComponent(Fa(t));
}
D.escapeFragment = Rf;
function Fa(t) {
  return typeof t == "number" ? `${t}` : t.replace(/~/g, "~0").replace(/\//g, "~1");
}
D.escapeJsonPointer = Fa;
function Ll(t) {
  return t.replace(/~1/g, "/").replace(/~0/g, "~");
}
D.unescapeJsonPointer = Ll;
function jf(t, e) {
  if (Array.isArray(t))
    for (const r of t)
      e(r);
  else
    e(t);
}
D.eachItem = jf;
function xi({ mergeNames: t, mergeToName: e, mergeValues: r, resultToName: n }) {
  return (s, a, o, i) => {
    const c = o === void 0 ? a : o instanceof de.Name ? (a instanceof de.Name ? t(s, a, o) : e(s, a, o), o) : a instanceof de.Name ? (e(s, o, a), a) : r(a, o);
    return i === de.Name && !(c instanceof de.Name) ? n(s, c) : c;
  };
}
D.mergeEvaluated = {
  props: xi({
    mergeNames: (t, e, r) => t.if((0, de._)`${r} !== true && ${e} !== undefined`, () => {
      t.if((0, de._)`${e} === true`, () => t.assign(r, !0), () => t.assign(r, (0, de._)`${r} || {}`).code((0, de._)`Object.assign(${r}, ${e})`));
    }),
    mergeToName: (t, e, r) => t.if((0, de._)`${r} !== true`, () => {
      e === !0 ? t.assign(r, !0) : (t.assign(r, (0, de._)`${r} || {}`), za(t, r, e));
    }),
    mergeValues: (t, e) => t === !0 ? !0 : { ...t, ...e },
    resultToName: Ml
  }),
  items: xi({
    mergeNames: (t, e, r) => t.if((0, de._)`${r} !== true && ${e} !== undefined`, () => t.assign(r, (0, de._)`${e} === true ? true : ${r} > ${e} ? ${r} : ${e}`)),
    mergeToName: (t, e, r) => t.if((0, de._)`${r} !== true`, () => t.assign(r, e === !0 ? !0 : (0, de._)`${r} > ${e} ? ${r} : ${e}`)),
    mergeValues: (t, e) => t === !0 ? !0 : Math.max(t, e),
    resultToName: (t, e) => t.var("items", e)
  })
};
function Ml(t, e) {
  if (e === !0)
    return t.var("props", !0);
  const r = t.var("props", (0, de._)`{}`);
  return e !== void 0 && za(t, r, e), r;
}
D.evaluatedPropsToName = Ml;
function za(t, e, r) {
  Object.keys(r).forEach((n) => t.assign((0, de._)`${e}${(0, de.getProperty)(n)}`, !0));
}
D.setEvaluated = za;
const Gi = {};
function Tf(t, e) {
  return t.scopeValue("func", {
    ref: e,
    code: Gi[e.code] || (Gi[e.code] = new Ef._Code(e.code))
  });
}
D.useFunc = Tf;
var ya;
(function(t) {
  t[t.Num = 0] = "Num", t[t.Str = 1] = "Str";
})(ya || (D.Type = ya = {}));
function If(t, e, r) {
  if (t instanceof de.Name) {
    const n = e === ya.Num;
    return r ? n ? (0, de._)`"[" + ${t} + "]"` : (0, de._)`"['" + ${t} + "']"` : n ? (0, de._)`"/" + ${t}` : (0, de._)`"/" + ${t}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
  }
  return r ? (0, de.getProperty)(t).toString() : "/" + Fa(t);
}
D.getErrorPath = If;
function Vl(t, e, r = t.opts.strictSchema) {
  if (r) {
    if (e = `strict mode: ${e}`, r === !0)
      throw new Error(e);
    t.self.logger.warn(e);
  }
}
D.checkStrictMode = Vl;
var xe = {};
Object.defineProperty(xe, "__esModule", { value: !0 });
const je = Z, kf = {
  // validation function arguments
  data: new je.Name("data"),
  // data passed to validation function
  // args passed from referencing schema
  valCxt: new je.Name("valCxt"),
  // validation/data context - should not be used directly, it is destructured to the names below
  instancePath: new je.Name("instancePath"),
  parentData: new je.Name("parentData"),
  parentDataProperty: new je.Name("parentDataProperty"),
  rootData: new je.Name("rootData"),
  // root data - same as the data passed to the first/top validation function
  dynamicAnchors: new je.Name("dynamicAnchors"),
  // used to support recursiveRef and dynamicRef
  // function scoped variables
  vErrors: new je.Name("vErrors"),
  // null or array of validation errors
  errors: new je.Name("errors"),
  // counter of validation errors
  this: new je.Name("this"),
  // "globals"
  self: new je.Name("self"),
  scope: new je.Name("scope"),
  // JTD serialize/parse name for JSON string and position
  json: new je.Name("json"),
  jsonPos: new je.Name("jsonPos"),
  jsonLen: new je.Name("jsonLen"),
  jsonPart: new je.Name("jsonPart")
};
xe.default = kf;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.extendErrors = t.resetErrorsCount = t.reportExtraError = t.reportError = t.keyword$DataError = t.keywordError = void 0;
  const e = Z, r = D, n = xe;
  t.keywordError = {
    message: ({ keyword: $ }) => (0, e.str)`must pass "${$}" keyword validation`
  }, t.keyword$DataError = {
    message: ({ keyword: $, schemaType: p }) => p ? (0, e.str)`"${$}" keyword must be ${p} ($data)` : (0, e.str)`"${$}" keyword is invalid ($data)`
  };
  function s($, p = t.keywordError, E, P) {
    const { it: N } = $, { gen: R, compositeRule: z, allErrors: G } = N, ue = f($, p, E);
    P ?? (z || G) ? c(R, ue) : l(N, (0, e._)`[${ue}]`);
  }
  t.reportError = s;
  function a($, p = t.keywordError, E) {
    const { it: P } = $, { gen: N, compositeRule: R, allErrors: z } = P, G = f($, p, E);
    c(N, G), R || z || l(P, n.default.vErrors);
  }
  t.reportExtraError = a;
  function o($, p) {
    $.assign(n.default.errors, p), $.if((0, e._)`${n.default.vErrors} !== null`, () => $.if(p, () => $.assign((0, e._)`${n.default.vErrors}.length`, p), () => $.assign(n.default.vErrors, null)));
  }
  t.resetErrorsCount = o;
  function i({ gen: $, keyword: p, schemaValue: E, data: P, errsCount: N, it: R }) {
    if (N === void 0)
      throw new Error("ajv implementation error");
    const z = $.name("err");
    $.forRange("i", N, n.default.errors, (G) => {
      $.const(z, (0, e._)`${n.default.vErrors}[${G}]`), $.if((0, e._)`${z}.instancePath === undefined`, () => $.assign((0, e._)`${z}.instancePath`, (0, e.strConcat)(n.default.instancePath, R.errorPath))), $.assign((0, e._)`${z}.schemaPath`, (0, e.str)`${R.errSchemaPath}/${p}`), R.opts.verbose && ($.assign((0, e._)`${z}.schema`, E), $.assign((0, e._)`${z}.data`, P));
    });
  }
  t.extendErrors = i;
  function c($, p) {
    const E = $.const("err", p);
    $.if((0, e._)`${n.default.vErrors} === null`, () => $.assign(n.default.vErrors, (0, e._)`[${E}]`), (0, e._)`${n.default.vErrors}.push(${E})`), $.code((0, e._)`${n.default.errors}++`);
  }
  function l($, p) {
    const { gen: E, validateName: P, schemaEnv: N } = $;
    N.$async ? E.throw((0, e._)`new ${$.ValidationError}(${p})`) : (E.assign((0, e._)`${P}.errors`, p), E.return(!1));
  }
  const d = {
    keyword: new e.Name("keyword"),
    schemaPath: new e.Name("schemaPath"),
    // also used in JTD errors
    params: new e.Name("params"),
    propertyName: new e.Name("propertyName"),
    message: new e.Name("message"),
    schema: new e.Name("schema"),
    parentSchema: new e.Name("parentSchema")
  };
  function f($, p, E) {
    const { createErrors: P } = $.it;
    return P === !1 ? (0, e._)`{}` : w($, p, E);
  }
  function w($, p, E = {}) {
    const { gen: P, it: N } = $, R = [
      g(N, E),
      y($, E)
    ];
    return v($, p, R), P.object(...R);
  }
  function g({ errorPath: $ }, { instancePath: p }) {
    const E = p ? (0, e.str)`${$}${(0, r.getErrorPath)(p, r.Type.Str)}` : $;
    return [n.default.instancePath, (0, e.strConcat)(n.default.instancePath, E)];
  }
  function y({ keyword: $, it: { errSchemaPath: p } }, { schemaPath: E, parentSchema: P }) {
    let N = P ? p : (0, e.str)`${p}/${$}`;
    return E && (N = (0, e.str)`${N}${(0, r.getErrorPath)(E, r.Type.Str)}`), [d.schemaPath, N];
  }
  function v($, { params: p, message: E }, P) {
    const { keyword: N, data: R, schemaValue: z, it: G } = $, { opts: ue, propertyName: ie, topSchemaRef: ce, schemaPath: U } = G;
    P.push([d.keyword, N], [d.params, typeof p == "function" ? p($) : p || (0, e._)`{}`]), ue.messages && P.push([d.message, typeof E == "function" ? E($) : E]), ue.verbose && P.push([d.schema, z], [d.parentSchema, (0, e._)`${ce}${U}`], [n.default.data, R]), ie && P.push([d.propertyName, ie]);
  }
})(wn);
Object.defineProperty(Cr, "__esModule", { value: !0 });
Cr.boolOrEmptySchema = Cr.topBoolOrEmptySchema = void 0;
const Cf = wn, Af = Z, Df = xe, Lf = {
  message: "boolean schema is false"
};
function Mf(t) {
  const { gen: e, schema: r, validateName: n } = t;
  r === !1 ? Fl(t, !1) : typeof r == "object" && r.$async === !0 ? e.return(Df.default.data) : (e.assign((0, Af._)`${n}.errors`, null), e.return(!0));
}
Cr.topBoolOrEmptySchema = Mf;
function Vf(t, e) {
  const { gen: r, schema: n } = t;
  n === !1 ? (r.var(e, !1), Fl(t)) : r.var(e, !0);
}
Cr.boolOrEmptySchema = Vf;
function Fl(t, e) {
  const { gen: r, data: n } = t, s = {
    gen: r,
    keyword: "false schema",
    data: n,
    schema: !1,
    schemaCode: !1,
    schemaValue: !1,
    params: {},
    it: t
  };
  (0, Cf.reportError)(s, Lf, void 0, e);
}
var $e = {}, mr = {};
Object.defineProperty(mr, "__esModule", { value: !0 });
mr.getRules = mr.isJSONType = void 0;
const Ff = ["string", "number", "integer", "boolean", "null", "object", "array"], zf = new Set(Ff);
function Uf(t) {
  return typeof t == "string" && zf.has(t);
}
mr.isJSONType = Uf;
function Kf() {
  const t = {
    number: { type: "number", rules: [] },
    string: { type: "string", rules: [] },
    array: { type: "array", rules: [] },
    object: { type: "object", rules: [] }
  };
  return {
    types: { ...t, integer: !0, boolean: !0, null: !0 },
    rules: [{ rules: [] }, t.number, t.string, t.array, t.object],
    post: { rules: [] },
    all: {},
    keywords: {}
  };
}
mr.getRules = Kf;
var vt = {};
Object.defineProperty(vt, "__esModule", { value: !0 });
vt.shouldUseRule = vt.shouldUseGroup = vt.schemaHasRulesForType = void 0;
function qf({ schema: t, self: e }, r) {
  const n = e.RULES.types[r];
  return n && n !== !0 && zl(t, n);
}
vt.schemaHasRulesForType = qf;
function zl(t, e) {
  return e.rules.some((r) => Ul(t, r));
}
vt.shouldUseGroup = zl;
function Ul(t, e) {
  var r;
  return t[e.keyword] !== void 0 || ((r = e.definition.implements) === null || r === void 0 ? void 0 : r.some((n) => t[n] !== void 0));
}
vt.shouldUseRule = Ul;
Object.defineProperty($e, "__esModule", { value: !0 });
$e.reportTypeError = $e.checkDataTypes = $e.checkDataType = $e.coerceAndCheckDataType = $e.getJSONTypes = $e.getSchemaTypes = $e.DataType = void 0;
const xf = mr, Gf = vt, Hf = wn, ee = Z, Kl = D;
var Rr;
(function(t) {
  t[t.Correct = 0] = "Correct", t[t.Wrong = 1] = "Wrong";
})(Rr || ($e.DataType = Rr = {}));
function Jf(t) {
  const e = ql(t.type);
  if (e.includes("null")) {
    if (t.nullable === !1)
      throw new Error("type: null contradicts nullable: false");
  } else {
    if (!e.length && t.nullable !== void 0)
      throw new Error('"nullable" cannot be used without "type"');
    t.nullable === !0 && e.push("null");
  }
  return e;
}
$e.getSchemaTypes = Jf;
function ql(t) {
  const e = Array.isArray(t) ? t : t ? [t] : [];
  if (e.every(xf.isJSONType))
    return e;
  throw new Error("type must be JSONType or JSONType[]: " + e.join(","));
}
$e.getJSONTypes = ql;
function Bf(t, e) {
  const { gen: r, data: n, opts: s } = t, a = Wf(e, s.coerceTypes), o = e.length > 0 && !(a.length === 0 && e.length === 1 && (0, Gf.schemaHasRulesForType)(t, e[0]));
  if (o) {
    const i = Ua(e, n, s.strictNumbers, Rr.Wrong);
    r.if(i, () => {
      a.length ? Xf(t, e, a) : Ka(t);
    });
  }
  return o;
}
$e.coerceAndCheckDataType = Bf;
const xl = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
function Wf(t, e) {
  return e ? t.filter((r) => xl.has(r) || e === "array" && r === "array") : [];
}
function Xf(t, e, r) {
  const { gen: n, data: s, opts: a } = t, o = n.let("dataType", (0, ee._)`typeof ${s}`), i = n.let("coerced", (0, ee._)`undefined`);
  a.coerceTypes === "array" && n.if((0, ee._)`${o} == 'object' && Array.isArray(${s}) && ${s}.length == 1`, () => n.assign(s, (0, ee._)`${s}[0]`).assign(o, (0, ee._)`typeof ${s}`).if(Ua(e, s, a.strictNumbers), () => n.assign(i, s))), n.if((0, ee._)`${i} !== undefined`);
  for (const l of r)
    (xl.has(l) || l === "array" && a.coerceTypes === "array") && c(l);
  n.else(), Ka(t), n.endIf(), n.if((0, ee._)`${i} !== undefined`, () => {
    n.assign(s, i), Yf(t, i);
  });
  function c(l) {
    switch (l) {
      case "string":
        n.elseIf((0, ee._)`${o} == "number" || ${o} == "boolean"`).assign(i, (0, ee._)`"" + ${s}`).elseIf((0, ee._)`${s} === null`).assign(i, (0, ee._)`""`);
        return;
      case "number":
        n.elseIf((0, ee._)`${o} == "boolean" || ${s} === null
              || (${o} == "string" && ${s} && ${s} == +${s})`).assign(i, (0, ee._)`+${s}`);
        return;
      case "integer":
        n.elseIf((0, ee._)`${o} === "boolean" || ${s} === null
              || (${o} === "string" && ${s} && ${s} == +${s} && !(${s} % 1))`).assign(i, (0, ee._)`+${s}`);
        return;
      case "boolean":
        n.elseIf((0, ee._)`${s} === "false" || ${s} === 0 || ${s} === null`).assign(i, !1).elseIf((0, ee._)`${s} === "true" || ${s} === 1`).assign(i, !0);
        return;
      case "null":
        n.elseIf((0, ee._)`${s} === "" || ${s} === 0 || ${s} === false`), n.assign(i, null);
        return;
      case "array":
        n.elseIf((0, ee._)`${o} === "string" || ${o} === "number"
              || ${o} === "boolean" || ${s} === null`).assign(i, (0, ee._)`[${s}]`);
    }
  }
}
function Yf({ gen: t, parentData: e, parentDataProperty: r }, n) {
  t.if((0, ee._)`${e} !== undefined`, () => t.assign((0, ee._)`${e}[${r}]`, n));
}
function $a(t, e, r, n = Rr.Correct) {
  const s = n === Rr.Correct ? ee.operators.EQ : ee.operators.NEQ;
  let a;
  switch (t) {
    case "null":
      return (0, ee._)`${e} ${s} null`;
    case "array":
      a = (0, ee._)`Array.isArray(${e})`;
      break;
    case "object":
      a = (0, ee._)`${e} && typeof ${e} == "object" && !Array.isArray(${e})`;
      break;
    case "integer":
      a = o((0, ee._)`!(${e} % 1) && !isNaN(${e})`);
      break;
    case "number":
      a = o();
      break;
    default:
      return (0, ee._)`typeof ${e} ${s} ${t}`;
  }
  return n === Rr.Correct ? a : (0, ee.not)(a);
  function o(i = ee.nil) {
    return (0, ee.and)((0, ee._)`typeof ${e} == "number"`, i, r ? (0, ee._)`isFinite(${e})` : ee.nil);
  }
}
$e.checkDataType = $a;
function Ua(t, e, r, n) {
  if (t.length === 1)
    return $a(t[0], e, r, n);
  let s;
  const a = (0, Kl.toHash)(t);
  if (a.array && a.object) {
    const o = (0, ee._)`typeof ${e} != "object"`;
    s = a.null ? o : (0, ee._)`!${e} || ${o}`, delete a.null, delete a.array, delete a.object;
  } else
    s = ee.nil;
  a.number && delete a.integer;
  for (const o in a)
    s = (0, ee.and)(s, $a(o, e, r, n));
  return s;
}
$e.checkDataTypes = Ua;
const Qf = {
  message: ({ schema: t }) => `must be ${t}`,
  params: ({ schema: t, schemaValue: e }) => typeof t == "string" ? (0, ee._)`{type: ${t}}` : (0, ee._)`{type: ${e}}`
};
function Ka(t) {
  const e = Zf(t);
  (0, Hf.reportError)(e, Qf);
}
$e.reportTypeError = Ka;
function Zf(t) {
  const { gen: e, data: r, schema: n } = t, s = (0, Kl.schemaRefOrVal)(t, n, "type");
  return {
    gen: e,
    keyword: "type",
    data: r,
    schema: n.type,
    schemaCode: s,
    schemaValue: s,
    parentSchema: n,
    params: {},
    it: t
  };
}
var Es = {};
Object.defineProperty(Es, "__esModule", { value: !0 });
Es.assignDefaults = void 0;
const $r = Z, eh = D;
function th(t, e) {
  const { properties: r, items: n } = t.schema;
  if (e === "object" && r)
    for (const s in r)
      Hi(t, s, r[s].default);
  else e === "array" && Array.isArray(n) && n.forEach((s, a) => Hi(t, a, s.default));
}
Es.assignDefaults = th;
function Hi(t, e, r) {
  const { gen: n, compositeRule: s, data: a, opts: o } = t;
  if (r === void 0)
    return;
  const i = (0, $r._)`${a}${(0, $r.getProperty)(e)}`;
  if (s) {
    (0, eh.checkStrictMode)(t, `default is ignored for: ${i}`);
    return;
  }
  let c = (0, $r._)`${i} === undefined`;
  o.useDefaults === "empty" && (c = (0, $r._)`${c} || ${i} === null || ${i} === ""`), n.if(c, (0, $r._)`${i} = ${(0, $r.stringify)(r)}`);
}
var dt = {}, se = {};
Object.defineProperty(se, "__esModule", { value: !0 });
se.validateUnion = se.validateArray = se.usePattern = se.callValidateCode = se.schemaProperties = se.allSchemaProperties = se.noPropertyInData = se.propertyInData = se.isOwnProperty = se.hasPropFunc = se.reportMissingProp = se.checkMissingProp = se.checkReportMissingProp = void 0;
const he = Z, qa = D, Rt = xe, rh = D;
function nh(t, e) {
  const { gen: r, data: n, it: s } = t;
  r.if(Ga(r, n, e, s.opts.ownProperties), () => {
    t.setParams({ missingProperty: (0, he._)`${e}` }, !0), t.error();
  });
}
se.checkReportMissingProp = nh;
function sh({ gen: t, data: e, it: { opts: r } }, n, s) {
  return (0, he.or)(...n.map((a) => (0, he.and)(Ga(t, e, a, r.ownProperties), (0, he._)`${s} = ${a}`)));
}
se.checkMissingProp = sh;
function ah(t, e) {
  t.setParams({ missingProperty: e }, !0), t.error();
}
se.reportMissingProp = ah;
function Gl(t) {
  return t.scopeValue("func", {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ref: Object.prototype.hasOwnProperty,
    code: (0, he._)`Object.prototype.hasOwnProperty`
  });
}
se.hasPropFunc = Gl;
function xa(t, e, r) {
  return (0, he._)`${Gl(t)}.call(${e}, ${r})`;
}
se.isOwnProperty = xa;
function oh(t, e, r, n) {
  const s = (0, he._)`${e}${(0, he.getProperty)(r)} !== undefined`;
  return n ? (0, he._)`${s} && ${xa(t, e, r)}` : s;
}
se.propertyInData = oh;
function Ga(t, e, r, n) {
  const s = (0, he._)`${e}${(0, he.getProperty)(r)} === undefined`;
  return n ? (0, he.or)(s, (0, he.not)(xa(t, e, r))) : s;
}
se.noPropertyInData = Ga;
function Hl(t) {
  return t ? Object.keys(t).filter((e) => e !== "__proto__") : [];
}
se.allSchemaProperties = Hl;
function ih(t, e) {
  return Hl(e).filter((r) => !(0, qa.alwaysValidSchema)(t, e[r]));
}
se.schemaProperties = ih;
function ch({ schemaCode: t, data: e, it: { gen: r, topSchemaRef: n, schemaPath: s, errorPath: a }, it: o }, i, c, l) {
  const d = l ? (0, he._)`${t}, ${e}, ${n}${s}` : e, f = [
    [Rt.default.instancePath, (0, he.strConcat)(Rt.default.instancePath, a)],
    [Rt.default.parentData, o.parentData],
    [Rt.default.parentDataProperty, o.parentDataProperty],
    [Rt.default.rootData, Rt.default.rootData]
  ];
  o.opts.dynamicRef && f.push([Rt.default.dynamicAnchors, Rt.default.dynamicAnchors]);
  const w = (0, he._)`${d}, ${r.object(...f)}`;
  return c !== he.nil ? (0, he._)`${i}.call(${c}, ${w})` : (0, he._)`${i}(${w})`;
}
se.callValidateCode = ch;
const lh = (0, he._)`new RegExp`;
function uh({ gen: t, it: { opts: e } }, r) {
  const n = e.unicodeRegExp ? "u" : "", { regExp: s } = e.code, a = s(r, n);
  return t.scopeValue("pattern", {
    key: a.toString(),
    ref: a,
    code: (0, he._)`${s.code === "new RegExp" ? lh : (0, rh.useFunc)(t, s)}(${r}, ${n})`
  });
}
se.usePattern = uh;
function dh(t) {
  const { gen: e, data: r, keyword: n, it: s } = t, a = e.name("valid");
  if (s.allErrors) {
    const i = e.let("valid", !0);
    return o(() => e.assign(i, !1)), i;
  }
  return e.var(a, !0), o(() => e.break()), a;
  function o(i) {
    const c = e.const("len", (0, he._)`${r}.length`);
    e.forRange("i", 0, c, (l) => {
      t.subschema({
        keyword: n,
        dataProp: l,
        dataPropType: qa.Type.Num
      }, a), e.if((0, he.not)(a), i);
    });
  }
}
se.validateArray = dh;
function fh(t) {
  const { gen: e, schema: r, keyword: n, it: s } = t;
  if (!Array.isArray(r))
    throw new Error("ajv implementation error");
  if (r.some((c) => (0, qa.alwaysValidSchema)(s, c)) && !s.opts.unevaluated)
    return;
  const o = e.let("valid", !1), i = e.name("_valid");
  e.block(() => r.forEach((c, l) => {
    const d = t.subschema({
      keyword: n,
      schemaProp: l,
      compositeRule: !0
    }, i);
    e.assign(o, (0, he._)`${o} || ${i}`), t.mergeValidEvaluated(d, i) || e.if((0, he.not)(o));
  })), t.result(o, () => t.reset(), () => t.error(!0));
}
se.validateUnion = fh;
Object.defineProperty(dt, "__esModule", { value: !0 });
dt.validateKeywordUsage = dt.validSchemaType = dt.funcKeywordCode = dt.macroKeywordCode = void 0;
const Ce = Z, ar = xe, hh = se, ph = wn;
function mh(t, e) {
  const { gen: r, keyword: n, schema: s, parentSchema: a, it: o } = t, i = e.macro.call(o.self, s, a, o), c = Jl(r, n, i);
  o.opts.validateSchema !== !1 && o.self.validateSchema(i, !0);
  const l = r.name("valid");
  t.subschema({
    schema: i,
    schemaPath: Ce.nil,
    errSchemaPath: `${o.errSchemaPath}/${n}`,
    topSchemaRef: c,
    compositeRule: !0
  }, l), t.pass(l, () => t.error(!0));
}
dt.macroKeywordCode = mh;
function gh(t, e) {
  var r;
  const { gen: n, keyword: s, schema: a, parentSchema: o, $data: i, it: c } = t;
  $h(c, e);
  const l = !i && e.compile ? e.compile.call(c.self, a, o, c) : e.validate, d = Jl(n, s, l), f = n.let("valid");
  t.block$data(f, w), t.ok((r = e.valid) !== null && r !== void 0 ? r : f);
  function w() {
    if (e.errors === !1)
      v(), e.modifying && Ji(t), $(() => t.error());
    else {
      const p = e.async ? g() : y();
      e.modifying && Ji(t), $(() => yh(t, p));
    }
  }
  function g() {
    const p = n.let("ruleErrs", null);
    return n.try(() => v((0, Ce._)`await `), (E) => n.assign(f, !1).if((0, Ce._)`${E} instanceof ${c.ValidationError}`, () => n.assign(p, (0, Ce._)`${E}.errors`), () => n.throw(E))), p;
  }
  function y() {
    const p = (0, Ce._)`${d}.errors`;
    return n.assign(p, null), v(Ce.nil), p;
  }
  function v(p = e.async ? (0, Ce._)`await ` : Ce.nil) {
    const E = c.opts.passContext ? ar.default.this : ar.default.self, P = !("compile" in e && !i || e.schema === !1);
    n.assign(f, (0, Ce._)`${p}${(0, hh.callValidateCode)(t, d, E, P)}`, e.modifying);
  }
  function $(p) {
    var E;
    n.if((0, Ce.not)((E = e.valid) !== null && E !== void 0 ? E : f), p);
  }
}
dt.funcKeywordCode = gh;
function Ji(t) {
  const { gen: e, data: r, it: n } = t;
  e.if(n.parentData, () => e.assign(r, (0, Ce._)`${n.parentData}[${n.parentDataProperty}]`));
}
function yh(t, e) {
  const { gen: r } = t;
  r.if((0, Ce._)`Array.isArray(${e})`, () => {
    r.assign(ar.default.vErrors, (0, Ce._)`${ar.default.vErrors} === null ? ${e} : ${ar.default.vErrors}.concat(${e})`).assign(ar.default.errors, (0, Ce._)`${ar.default.vErrors}.length`), (0, ph.extendErrors)(t);
  }, () => t.error());
}
function $h({ schemaEnv: t }, e) {
  if (e.async && !t.$async)
    throw new Error("async keyword in sync schema");
}
function Jl(t, e, r) {
  if (r === void 0)
    throw new Error(`keyword "${e}" failed to compile`);
  return t.scopeValue("keyword", typeof r == "function" ? { ref: r } : { ref: r, code: (0, Ce.stringify)(r) });
}
function vh(t, e, r = !1) {
  return !e.length || e.some((n) => n === "array" ? Array.isArray(t) : n === "object" ? t && typeof t == "object" && !Array.isArray(t) : typeof t == n || r && typeof t > "u");
}
dt.validSchemaType = vh;
function _h({ schema: t, opts: e, self: r, errSchemaPath: n }, s, a) {
  if (Array.isArray(s.keyword) ? !s.keyword.includes(a) : s.keyword !== a)
    throw new Error("ajv implementation error");
  const o = s.dependencies;
  if (o != null && o.some((i) => !Object.prototype.hasOwnProperty.call(t, i)))
    throw new Error(`parent schema must have dependencies of ${a}: ${o.join(",")}`);
  if (s.validateSchema && !s.validateSchema(t[a])) {
    const c = `keyword "${a}" value is invalid at path "${n}": ` + r.errorsText(s.validateSchema.errors);
    if (e.validateSchema === "log")
      r.logger.error(c);
    else
      throw new Error(c);
  }
}
dt.validateKeywordUsage = _h;
var zt = {};
Object.defineProperty(zt, "__esModule", { value: !0 });
zt.extendSubschemaMode = zt.extendSubschemaData = zt.getSubschema = void 0;
const lt = Z, Bl = D;
function wh(t, { keyword: e, schemaProp: r, schema: n, schemaPath: s, errSchemaPath: a, topSchemaRef: o }) {
  if (e !== void 0 && n !== void 0)
    throw new Error('both "keyword" and "schema" passed, only one allowed');
  if (e !== void 0) {
    const i = t.schema[e];
    return r === void 0 ? {
      schema: i,
      schemaPath: (0, lt._)`${t.schemaPath}${(0, lt.getProperty)(e)}`,
      errSchemaPath: `${t.errSchemaPath}/${e}`
    } : {
      schema: i[r],
      schemaPath: (0, lt._)`${t.schemaPath}${(0, lt.getProperty)(e)}${(0, lt.getProperty)(r)}`,
      errSchemaPath: `${t.errSchemaPath}/${e}/${(0, Bl.escapeFragment)(r)}`
    };
  }
  if (n !== void 0) {
    if (s === void 0 || a === void 0 || o === void 0)
      throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
    return {
      schema: n,
      schemaPath: s,
      topSchemaRef: o,
      errSchemaPath: a
    };
  }
  throw new Error('either "keyword" or "schema" must be passed');
}
zt.getSubschema = wh;
function Eh(t, e, { dataProp: r, dataPropType: n, data: s, dataTypes: a, propertyName: o }) {
  if (s !== void 0 && r !== void 0)
    throw new Error('both "data" and "dataProp" passed, only one allowed');
  const { gen: i } = e;
  if (r !== void 0) {
    const { errorPath: l, dataPathArr: d, opts: f } = e, w = i.let("data", (0, lt._)`${e.data}${(0, lt.getProperty)(r)}`, !0);
    c(w), t.errorPath = (0, lt.str)`${l}${(0, Bl.getErrorPath)(r, n, f.jsPropertySyntax)}`, t.parentDataProperty = (0, lt._)`${r}`, t.dataPathArr = [...d, t.parentDataProperty];
  }
  if (s !== void 0) {
    const l = s instanceof lt.Name ? s : i.let("data", s, !0);
    c(l), o !== void 0 && (t.propertyName = o);
  }
  a && (t.dataTypes = a);
  function c(l) {
    t.data = l, t.dataLevel = e.dataLevel + 1, t.dataTypes = [], e.definedProperties = /* @__PURE__ */ new Set(), t.parentData = e.data, t.dataNames = [...e.dataNames, l];
  }
}
zt.extendSubschemaData = Eh;
function bh(t, { jtdDiscriminator: e, jtdMetadata: r, compositeRule: n, createErrors: s, allErrors: a }) {
  n !== void 0 && (t.compositeRule = n), s !== void 0 && (t.createErrors = s), a !== void 0 && (t.allErrors = a), t.jtdDiscriminator = e, t.jtdMetadata = r;
}
zt.extendSubschemaMode = bh;
var Pe = {}, bs = function t(e, r) {
  if (e === r) return !0;
  if (e && r && typeof e == "object" && typeof r == "object") {
    if (e.constructor !== r.constructor) return !1;
    var n, s, a;
    if (Array.isArray(e)) {
      if (n = e.length, n != r.length) return !1;
      for (s = n; s-- !== 0; )
        if (!t(e[s], r[s])) return !1;
      return !0;
    }
    if (e.constructor === RegExp) return e.source === r.source && e.flags === r.flags;
    if (e.valueOf !== Object.prototype.valueOf) return e.valueOf() === r.valueOf();
    if (e.toString !== Object.prototype.toString) return e.toString() === r.toString();
    if (a = Object.keys(e), n = a.length, n !== Object.keys(r).length) return !1;
    for (s = n; s-- !== 0; )
      if (!Object.prototype.hasOwnProperty.call(r, a[s])) return !1;
    for (s = n; s-- !== 0; ) {
      var o = a[s];
      if (!t(e[o], r[o])) return !1;
    }
    return !0;
  }
  return e !== e && r !== r;
}, Wl = { exports: {} }, Mt = Wl.exports = function(t, e, r) {
  typeof e == "function" && (r = e, e = {}), r = e.cb || r;
  var n = typeof r == "function" ? r : r.pre || function() {
  }, s = r.post || function() {
  };
  Yn(e, n, s, t, "", t);
};
Mt.keywords = {
  additionalItems: !0,
  items: !0,
  contains: !0,
  additionalProperties: !0,
  propertyNames: !0,
  not: !0,
  if: !0,
  then: !0,
  else: !0
};
Mt.arrayKeywords = {
  items: !0,
  allOf: !0,
  anyOf: !0,
  oneOf: !0
};
Mt.propsKeywords = {
  $defs: !0,
  definitions: !0,
  properties: !0,
  patternProperties: !0,
  dependencies: !0
};
Mt.skipKeywords = {
  default: !0,
  enum: !0,
  const: !0,
  required: !0,
  maximum: !0,
  minimum: !0,
  exclusiveMaximum: !0,
  exclusiveMinimum: !0,
  multipleOf: !0,
  maxLength: !0,
  minLength: !0,
  pattern: !0,
  format: !0,
  maxItems: !0,
  minItems: !0,
  uniqueItems: !0,
  maxProperties: !0,
  minProperties: !0
};
function Yn(t, e, r, n, s, a, o, i, c, l) {
  if (n && typeof n == "object" && !Array.isArray(n)) {
    e(n, s, a, o, i, c, l);
    for (var d in n) {
      var f = n[d];
      if (Array.isArray(f)) {
        if (d in Mt.arrayKeywords)
          for (var w = 0; w < f.length; w++)
            Yn(t, e, r, f[w], s + "/" + d + "/" + w, a, s, d, n, w);
      } else if (d in Mt.propsKeywords) {
        if (f && typeof f == "object")
          for (var g in f)
            Yn(t, e, r, f[g], s + "/" + d + "/" + Sh(g), a, s, d, n, g);
      } else (d in Mt.keywords || t.allKeys && !(d in Mt.skipKeywords)) && Yn(t, e, r, f, s + "/" + d, a, s, d, n);
    }
    r(n, s, a, o, i, c, l);
  }
}
function Sh(t) {
  return t.replace(/~/g, "~0").replace(/\//g, "~1");
}
var Ph = Wl.exports;
Object.defineProperty(Pe, "__esModule", { value: !0 });
Pe.getSchemaRefs = Pe.resolveUrl = Pe.normalizeId = Pe._getFullPath = Pe.getFullPath = Pe.inlineRef = void 0;
const Oh = D, Nh = bs, Rh = Ph, jh = /* @__PURE__ */ new Set([
  "type",
  "format",
  "pattern",
  "maxLength",
  "minLength",
  "maxProperties",
  "minProperties",
  "maxItems",
  "minItems",
  "maximum",
  "minimum",
  "uniqueItems",
  "multipleOf",
  "required",
  "enum",
  "const"
]);
function Th(t, e = !0) {
  return typeof t == "boolean" ? !0 : e === !0 ? !va(t) : e ? Xl(t) <= e : !1;
}
Pe.inlineRef = Th;
const Ih = /* @__PURE__ */ new Set([
  "$ref",
  "$recursiveRef",
  "$recursiveAnchor",
  "$dynamicRef",
  "$dynamicAnchor"
]);
function va(t) {
  for (const e in t) {
    if (Ih.has(e))
      return !0;
    const r = t[e];
    if (Array.isArray(r) && r.some(va) || typeof r == "object" && va(r))
      return !0;
  }
  return !1;
}
function Xl(t) {
  let e = 0;
  for (const r in t) {
    if (r === "$ref")
      return 1 / 0;
    if (e++, !jh.has(r) && (typeof t[r] == "object" && (0, Oh.eachItem)(t[r], (n) => e += Xl(n)), e === 1 / 0))
      return 1 / 0;
  }
  return e;
}
function Yl(t, e = "", r) {
  r !== !1 && (e = jr(e));
  const n = t.parse(e);
  return Ql(t, n);
}
Pe.getFullPath = Yl;
function Ql(t, e) {
  return t.serialize(e).split("#")[0] + "#";
}
Pe._getFullPath = Ql;
const kh = /#\/?$/;
function jr(t) {
  return t ? t.replace(kh, "") : "";
}
Pe.normalizeId = jr;
function Ch(t, e, r) {
  return r = jr(r), t.resolve(e, r);
}
Pe.resolveUrl = Ch;
const Ah = /^[a-z_][-a-z0-9._]*$/i;
function Dh(t, e) {
  if (typeof t == "boolean")
    return {};
  const { schemaId: r, uriResolver: n } = this.opts, s = jr(t[r] || e), a = { "": s }, o = Yl(n, s, !1), i = {}, c = /* @__PURE__ */ new Set();
  return Rh(t, { allKeys: !0 }, (f, w, g, y) => {
    if (y === void 0)
      return;
    const v = o + w;
    let $ = a[y];
    typeof f[r] == "string" && ($ = p.call(this, f[r])), E.call(this, f.$anchor), E.call(this, f.$dynamicAnchor), a[w] = $;
    function p(P) {
      const N = this.opts.uriResolver.resolve;
      if (P = jr($ ? N($, P) : P), c.has(P))
        throw d(P);
      c.add(P);
      let R = this.refs[P];
      return typeof R == "string" && (R = this.refs[R]), typeof R == "object" ? l(f, R.schema, P) : P !== jr(v) && (P[0] === "#" ? (l(f, i[P], P), i[P] = f) : this.refs[P] = v), P;
    }
    function E(P) {
      if (typeof P == "string") {
        if (!Ah.test(P))
          throw new Error(`invalid anchor "${P}"`);
        p.call(this, `#${P}`);
      }
    }
  }), i;
  function l(f, w, g) {
    if (w !== void 0 && !Nh(f, w))
      throw d(g);
  }
  function d(f) {
    return new Error(`reference "${f}" resolves to more than one schema`);
  }
}
Pe.getSchemaRefs = Dh;
Object.defineProperty(rt, "__esModule", { value: !0 });
rt.getData = rt.KeywordCxt = rt.validateFunctionCode = void 0;
const Zl = Cr, Bi = $e, Ha = vt, is = $e, Lh = Es, sn = dt, Hs = zt, q = Z, J = xe, Mh = Pe, _t = D, Wr = wn;
function Vh(t) {
  if (ru(t) && (nu(t), tu(t))) {
    Uh(t);
    return;
  }
  eu(t, () => (0, Zl.topBoolOrEmptySchema)(t));
}
rt.validateFunctionCode = Vh;
function eu({ gen: t, validateName: e, schema: r, schemaEnv: n, opts: s }, a) {
  s.code.es5 ? t.func(e, (0, q._)`${J.default.data}, ${J.default.valCxt}`, n.$async, () => {
    t.code((0, q._)`"use strict"; ${Wi(r, s)}`), zh(t, s), t.code(a);
  }) : t.func(e, (0, q._)`${J.default.data}, ${Fh(s)}`, n.$async, () => t.code(Wi(r, s)).code(a));
}
function Fh(t) {
  return (0, q._)`{${J.default.instancePath}="", ${J.default.parentData}, ${J.default.parentDataProperty}, ${J.default.rootData}=${J.default.data}${t.dynamicRef ? (0, q._)`, ${J.default.dynamicAnchors}={}` : q.nil}}={}`;
}
function zh(t, e) {
  t.if(J.default.valCxt, () => {
    t.var(J.default.instancePath, (0, q._)`${J.default.valCxt}.${J.default.instancePath}`), t.var(J.default.parentData, (0, q._)`${J.default.valCxt}.${J.default.parentData}`), t.var(J.default.parentDataProperty, (0, q._)`${J.default.valCxt}.${J.default.parentDataProperty}`), t.var(J.default.rootData, (0, q._)`${J.default.valCxt}.${J.default.rootData}`), e.dynamicRef && t.var(J.default.dynamicAnchors, (0, q._)`${J.default.valCxt}.${J.default.dynamicAnchors}`);
  }, () => {
    t.var(J.default.instancePath, (0, q._)`""`), t.var(J.default.parentData, (0, q._)`undefined`), t.var(J.default.parentDataProperty, (0, q._)`undefined`), t.var(J.default.rootData, J.default.data), e.dynamicRef && t.var(J.default.dynamicAnchors, (0, q._)`{}`);
  });
}
function Uh(t) {
  const { schema: e, opts: r, gen: n } = t;
  eu(t, () => {
    r.$comment && e.$comment && au(t), Hh(t), n.let(J.default.vErrors, null), n.let(J.default.errors, 0), r.unevaluated && Kh(t), su(t), Wh(t);
  });
}
function Kh(t) {
  const { gen: e, validateName: r } = t;
  t.evaluated = e.const("evaluated", (0, q._)`${r}.evaluated`), e.if((0, q._)`${t.evaluated}.dynamicProps`, () => e.assign((0, q._)`${t.evaluated}.props`, (0, q._)`undefined`)), e.if((0, q._)`${t.evaluated}.dynamicItems`, () => e.assign((0, q._)`${t.evaluated}.items`, (0, q._)`undefined`));
}
function Wi(t, e) {
  const r = typeof t == "object" && t[e.schemaId];
  return r && (e.code.source || e.code.process) ? (0, q._)`/*# sourceURL=${r} */` : q.nil;
}
function qh(t, e) {
  if (ru(t) && (nu(t), tu(t))) {
    xh(t, e);
    return;
  }
  (0, Zl.boolOrEmptySchema)(t, e);
}
function tu({ schema: t, self: e }) {
  if (typeof t == "boolean")
    return !t;
  for (const r in t)
    if (e.RULES.all[r])
      return !0;
  return !1;
}
function ru(t) {
  return typeof t.schema != "boolean";
}
function xh(t, e) {
  const { schema: r, gen: n, opts: s } = t;
  s.$comment && r.$comment && au(t), Jh(t), Bh(t);
  const a = n.const("_errs", J.default.errors);
  su(t, a), n.var(e, (0, q._)`${a} === ${J.default.errors}`);
}
function nu(t) {
  (0, _t.checkUnknownRules)(t), Gh(t);
}
function su(t, e) {
  if (t.opts.jtd)
    return Xi(t, [], !1, e);
  const r = (0, Bi.getSchemaTypes)(t.schema), n = (0, Bi.coerceAndCheckDataType)(t, r);
  Xi(t, r, !n, e);
}
function Gh(t) {
  const { schema: e, errSchemaPath: r, opts: n, self: s } = t;
  e.$ref && n.ignoreKeywordsWithRef && (0, _t.schemaHasRulesButRef)(e, s.RULES) && s.logger.warn(`$ref: keywords ignored in schema at path "${r}"`);
}
function Hh(t) {
  const { schema: e, opts: r } = t;
  e.default !== void 0 && r.useDefaults && r.strictSchema && (0, _t.checkStrictMode)(t, "default is ignored in the schema root");
}
function Jh(t) {
  const e = t.schema[t.opts.schemaId];
  e && (t.baseId = (0, Mh.resolveUrl)(t.opts.uriResolver, t.baseId, e));
}
function Bh(t) {
  if (t.schema.$async && !t.schemaEnv.$async)
    throw new Error("async schema in sync schema");
}
function au({ gen: t, schemaEnv: e, schema: r, errSchemaPath: n, opts: s }) {
  const a = r.$comment;
  if (s.$comment === !0)
    t.code((0, q._)`${J.default.self}.logger.log(${a})`);
  else if (typeof s.$comment == "function") {
    const o = (0, q.str)`${n}/$comment`, i = t.scopeValue("root", { ref: e.root });
    t.code((0, q._)`${J.default.self}.opts.$comment(${a}, ${o}, ${i}.schema)`);
  }
}
function Wh(t) {
  const { gen: e, schemaEnv: r, validateName: n, ValidationError: s, opts: a } = t;
  r.$async ? e.if((0, q._)`${J.default.errors} === 0`, () => e.return(J.default.data), () => e.throw((0, q._)`new ${s}(${J.default.vErrors})`)) : (e.assign((0, q._)`${n}.errors`, J.default.vErrors), a.unevaluated && Xh(t), e.return((0, q._)`${J.default.errors} === 0`));
}
function Xh({ gen: t, evaluated: e, props: r, items: n }) {
  r instanceof q.Name && t.assign((0, q._)`${e}.props`, r), n instanceof q.Name && t.assign((0, q._)`${e}.items`, n);
}
function Xi(t, e, r, n) {
  const { gen: s, schema: a, data: o, allErrors: i, opts: c, self: l } = t, { RULES: d } = l;
  if (a.$ref && (c.ignoreKeywordsWithRef || !(0, _t.schemaHasRulesButRef)(a, d))) {
    s.block(() => cu(t, "$ref", d.all.$ref.definition));
    return;
  }
  c.jtd || Yh(t, e), s.block(() => {
    for (const w of d.rules)
      f(w);
    f(d.post);
  });
  function f(w) {
    (0, Ha.shouldUseGroup)(a, w) && (w.type ? (s.if((0, is.checkDataType)(w.type, o, c.strictNumbers)), Yi(t, w), e.length === 1 && e[0] === w.type && r && (s.else(), (0, is.reportTypeError)(t)), s.endIf()) : Yi(t, w), i || s.if((0, q._)`${J.default.errors} === ${n || 0}`));
  }
}
function Yi(t, e) {
  const { gen: r, schema: n, opts: { useDefaults: s } } = t;
  s && (0, Lh.assignDefaults)(t, e.type), r.block(() => {
    for (const a of e.rules)
      (0, Ha.shouldUseRule)(n, a) && cu(t, a.keyword, a.definition, e.type);
  });
}
function Yh(t, e) {
  t.schemaEnv.meta || !t.opts.strictTypes || (Qh(t, e), t.opts.allowUnionTypes || Zh(t, e), ep(t, t.dataTypes));
}
function Qh(t, e) {
  if (e.length) {
    if (!t.dataTypes.length) {
      t.dataTypes = e;
      return;
    }
    e.forEach((r) => {
      ou(t.dataTypes, r) || Ja(t, `type "${r}" not allowed by context "${t.dataTypes.join(",")}"`);
    }), rp(t, e);
  }
}
function Zh(t, e) {
  e.length > 1 && !(e.length === 2 && e.includes("null")) && Ja(t, "use allowUnionTypes to allow union type keyword");
}
function ep(t, e) {
  const r = t.self.RULES.all;
  for (const n in r) {
    const s = r[n];
    if (typeof s == "object" && (0, Ha.shouldUseRule)(t.schema, s)) {
      const { type: a } = s.definition;
      a.length && !a.some((o) => tp(e, o)) && Ja(t, `missing type "${a.join(",")}" for keyword "${n}"`);
    }
  }
}
function tp(t, e) {
  return t.includes(e) || e === "number" && t.includes("integer");
}
function ou(t, e) {
  return t.includes(e) || e === "integer" && t.includes("number");
}
function rp(t, e) {
  const r = [];
  for (const n of t.dataTypes)
    ou(e, n) ? r.push(n) : e.includes("integer") && n === "number" && r.push("integer");
  t.dataTypes = r;
}
function Ja(t, e) {
  const r = t.schemaEnv.baseId + t.errSchemaPath;
  e += ` at "${r}" (strictTypes)`, (0, _t.checkStrictMode)(t, e, t.opts.strictTypes);
}
let iu = class {
  constructor(e, r, n) {
    if ((0, sn.validateKeywordUsage)(e, r, n), this.gen = e.gen, this.allErrors = e.allErrors, this.keyword = n, this.data = e.data, this.schema = e.schema[n], this.$data = r.$data && e.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, _t.schemaRefOrVal)(e, this.schema, n, this.$data), this.schemaType = r.schemaType, this.parentSchema = e.schema, this.params = {}, this.it = e, this.def = r, this.$data)
      this.schemaCode = e.gen.const("vSchema", lu(this.$data, e));
    else if (this.schemaCode = this.schemaValue, !(0, sn.validSchemaType)(this.schema, r.schemaType, r.allowUndefined))
      throw new Error(`${n} value must be ${JSON.stringify(r.schemaType)}`);
    ("code" in r ? r.trackErrors : r.errors !== !1) && (this.errsCount = e.gen.const("_errs", J.default.errors));
  }
  result(e, r, n) {
    this.failResult((0, q.not)(e), r, n);
  }
  failResult(e, r, n) {
    this.gen.if(e), n ? n() : this.error(), r ? (this.gen.else(), r(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
  }
  pass(e, r) {
    this.failResult((0, q.not)(e), void 0, r);
  }
  fail(e) {
    if (e === void 0) {
      this.error(), this.allErrors || this.gen.if(!1);
      return;
    }
    this.gen.if(e), this.error(), this.allErrors ? this.gen.endIf() : this.gen.else();
  }
  fail$data(e) {
    if (!this.$data)
      return this.fail(e);
    const { schemaCode: r } = this;
    this.fail((0, q._)`${r} !== undefined && (${(0, q.or)(this.invalid$data(), e)})`);
  }
  error(e, r, n) {
    if (r) {
      this.setParams(r), this._error(e, n), this.setParams({});
      return;
    }
    this._error(e, n);
  }
  _error(e, r) {
    (e ? Wr.reportExtraError : Wr.reportError)(this, this.def.error, r);
  }
  $dataError() {
    (0, Wr.reportError)(this, this.def.$dataError || Wr.keyword$DataError);
  }
  reset() {
    if (this.errsCount === void 0)
      throw new Error('add "trackErrors" to keyword definition');
    (0, Wr.resetErrorsCount)(this.gen, this.errsCount);
  }
  ok(e) {
    this.allErrors || this.gen.if(e);
  }
  setParams(e, r) {
    r ? Object.assign(this.params, e) : this.params = e;
  }
  block$data(e, r, n = q.nil) {
    this.gen.block(() => {
      this.check$data(e, n), r();
    });
  }
  check$data(e = q.nil, r = q.nil) {
    if (!this.$data)
      return;
    const { gen: n, schemaCode: s, schemaType: a, def: o } = this;
    n.if((0, q.or)((0, q._)`${s} === undefined`, r)), e !== q.nil && n.assign(e, !0), (a.length || o.validateSchema) && (n.elseIf(this.invalid$data()), this.$dataError(), e !== q.nil && n.assign(e, !1)), n.else();
  }
  invalid$data() {
    const { gen: e, schemaCode: r, schemaType: n, def: s, it: a } = this;
    return (0, q.or)(o(), i());
    function o() {
      if (n.length) {
        if (!(r instanceof q.Name))
          throw new Error("ajv implementation error");
        const c = Array.isArray(n) ? n : [n];
        return (0, q._)`${(0, is.checkDataTypes)(c, r, a.opts.strictNumbers, is.DataType.Wrong)}`;
      }
      return q.nil;
    }
    function i() {
      if (s.validateSchema) {
        const c = e.scopeValue("validate$data", { ref: s.validateSchema });
        return (0, q._)`!${c}(${r})`;
      }
      return q.nil;
    }
  }
  subschema(e, r) {
    const n = (0, Hs.getSubschema)(this.it, e);
    (0, Hs.extendSubschemaData)(n, this.it, e), (0, Hs.extendSubschemaMode)(n, e);
    const s = { ...this.it, ...n, items: void 0, props: void 0 };
    return qh(s, r), s;
  }
  mergeEvaluated(e, r) {
    const { it: n, gen: s } = this;
    n.opts.unevaluated && (n.props !== !0 && e.props !== void 0 && (n.props = _t.mergeEvaluated.props(s, e.props, n.props, r)), n.items !== !0 && e.items !== void 0 && (n.items = _t.mergeEvaluated.items(s, e.items, n.items, r)));
  }
  mergeValidEvaluated(e, r) {
    const { it: n, gen: s } = this;
    if (n.opts.unevaluated && (n.props !== !0 || n.items !== !0))
      return s.if(r, () => this.mergeEvaluated(e, q.Name)), !0;
  }
};
rt.KeywordCxt = iu;
function cu(t, e, r, n) {
  const s = new iu(t, r, e);
  "code" in r ? r.code(s, n) : s.$data && r.validate ? (0, sn.funcKeywordCode)(s, r) : "macro" in r ? (0, sn.macroKeywordCode)(s, r) : (r.compile || r.validate) && (0, sn.funcKeywordCode)(s, r);
}
const np = /^\/(?:[^~]|~0|~1)*$/, sp = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
function lu(t, { dataLevel: e, dataNames: r, dataPathArr: n }) {
  let s, a;
  if (t === "")
    return J.default.rootData;
  if (t[0] === "/") {
    if (!np.test(t))
      throw new Error(`Invalid JSON-pointer: ${t}`);
    s = t, a = J.default.rootData;
  } else {
    const l = sp.exec(t);
    if (!l)
      throw new Error(`Invalid JSON-pointer: ${t}`);
    const d = +l[1];
    if (s = l[2], s === "#") {
      if (d >= e)
        throw new Error(c("property/index", d));
      return n[e - d];
    }
    if (d > e)
      throw new Error(c("data", d));
    if (a = r[e - d], !s)
      return a;
  }
  let o = a;
  const i = s.split("/");
  for (const l of i)
    l && (a = (0, q._)`${a}${(0, q.getProperty)((0, _t.unescapeJsonPointer)(l))}`, o = (0, q._)`${o} && ${a}`);
  return o;
  function c(l, d) {
    return `Cannot access ${l} ${d} levels up, current level is ${e}`;
  }
}
rt.getData = lu;
var En = {};
Object.defineProperty(En, "__esModule", { value: !0 });
let ap = class extends Error {
  constructor(e) {
    super("validation failed"), this.errors = e, this.ajv = this.validation = !0;
  }
};
En.default = ap;
var Mr = {};
Object.defineProperty(Mr, "__esModule", { value: !0 });
const Js = Pe;
let op = class extends Error {
  constructor(e, r, n, s) {
    super(s || `can't resolve reference ${n} from id ${r}`), this.missingRef = (0, Js.resolveUrl)(e, r, n), this.missingSchema = (0, Js.normalizeId)((0, Js.getFullPath)(e, this.missingRef));
  }
};
Mr.default = op;
var De = {};
Object.defineProperty(De, "__esModule", { value: !0 });
De.resolveSchema = De.getCompilingSchema = De.resolveRef = De.compileSchema = De.SchemaEnv = void 0;
const We = Z, ip = En, nr = xe, et = Pe, Qi = D, cp = rt;
let Ss = class {
  constructor(e) {
    var r;
    this.refs = {}, this.dynamicAnchors = {};
    let n;
    typeof e.schema == "object" && (n = e.schema), this.schema = e.schema, this.schemaId = e.schemaId, this.root = e.root || this, this.baseId = (r = e.baseId) !== null && r !== void 0 ? r : (0, et.normalizeId)(n == null ? void 0 : n[e.schemaId || "$id"]), this.schemaPath = e.schemaPath, this.localRefs = e.localRefs, this.meta = e.meta, this.$async = n == null ? void 0 : n.$async, this.refs = {};
  }
};
De.SchemaEnv = Ss;
function Ba(t) {
  const e = uu.call(this, t);
  if (e)
    return e;
  const r = (0, et.getFullPath)(this.opts.uriResolver, t.root.baseId), { es5: n, lines: s } = this.opts.code, { ownProperties: a } = this.opts, o = new We.CodeGen(this.scope, { es5: n, lines: s, ownProperties: a });
  let i;
  t.$async && (i = o.scopeValue("Error", {
    ref: ip.default,
    code: (0, We._)`require("ajv/dist/runtime/validation_error").default`
  }));
  const c = o.scopeName("validate");
  t.validateName = c;
  const l = {
    gen: o,
    allErrors: this.opts.allErrors,
    data: nr.default.data,
    parentData: nr.default.parentData,
    parentDataProperty: nr.default.parentDataProperty,
    dataNames: [nr.default.data],
    dataPathArr: [We.nil],
    // TODO can its length be used as dataLevel if nil is removed?
    dataLevel: 0,
    dataTypes: [],
    definedProperties: /* @__PURE__ */ new Set(),
    topSchemaRef: o.scopeValue("schema", this.opts.code.source === !0 ? { ref: t.schema, code: (0, We.stringify)(t.schema) } : { ref: t.schema }),
    validateName: c,
    ValidationError: i,
    schema: t.schema,
    schemaEnv: t,
    rootId: r,
    baseId: t.baseId || r,
    schemaPath: We.nil,
    errSchemaPath: t.schemaPath || (this.opts.jtd ? "" : "#"),
    errorPath: (0, We._)`""`,
    opts: this.opts,
    self: this
  };
  let d;
  try {
    this._compilations.add(t), (0, cp.validateFunctionCode)(l), o.optimize(this.opts.code.optimize);
    const f = o.toString();
    d = `${o.scopeRefs(nr.default.scope)}return ${f}`, this.opts.code.process && (d = this.opts.code.process(d, t));
    const g = new Function(`${nr.default.self}`, `${nr.default.scope}`, d)(this, this.scope.get());
    if (this.scope.value(c, { ref: g }), g.errors = null, g.schema = t.schema, g.schemaEnv = t, t.$async && (g.$async = !0), this.opts.code.source === !0 && (g.source = { validateName: c, validateCode: f, scopeValues: o._values }), this.opts.unevaluated) {
      const { props: y, items: v } = l;
      g.evaluated = {
        props: y instanceof We.Name ? void 0 : y,
        items: v instanceof We.Name ? void 0 : v,
        dynamicProps: y instanceof We.Name,
        dynamicItems: v instanceof We.Name
      }, g.source && (g.source.evaluated = (0, We.stringify)(g.evaluated));
    }
    return t.validate = g, t;
  } catch (f) {
    throw delete t.validate, delete t.validateName, d && this.logger.error("Error compiling schema, function code:", d), f;
  } finally {
    this._compilations.delete(t);
  }
}
De.compileSchema = Ba;
function lp(t, e, r) {
  var n;
  r = (0, et.resolveUrl)(this.opts.uriResolver, e, r);
  const s = t.refs[r];
  if (s)
    return s;
  let a = fp.call(this, t, r);
  if (a === void 0) {
    const o = (n = t.localRefs) === null || n === void 0 ? void 0 : n[r], { schemaId: i } = this.opts;
    o && (a = new Ss({ schema: o, schemaId: i, root: t, baseId: e }));
  }
  if (a !== void 0)
    return t.refs[r] = up.call(this, a);
}
De.resolveRef = lp;
function up(t) {
  return (0, et.inlineRef)(t.schema, this.opts.inlineRefs) ? t.schema : t.validate ? t : Ba.call(this, t);
}
function uu(t) {
  for (const e of this._compilations)
    if (dp(e, t))
      return e;
}
De.getCompilingSchema = uu;
function dp(t, e) {
  return t.schema === e.schema && t.root === e.root && t.baseId === e.baseId;
}
function fp(t, e) {
  let r;
  for (; typeof (r = this.refs[e]) == "string"; )
    e = r;
  return r || this.schemas[e] || Ps.call(this, t, e);
}
function Ps(t, e) {
  const r = this.opts.uriResolver.parse(e), n = (0, et._getFullPath)(this.opts.uriResolver, r);
  let s = (0, et.getFullPath)(this.opts.uriResolver, t.baseId, void 0);
  if (Object.keys(t.schema).length > 0 && n === s)
    return Bs.call(this, r, t);
  const a = (0, et.normalizeId)(n), o = this.refs[a] || this.schemas[a];
  if (typeof o == "string") {
    const i = Ps.call(this, t, o);
    return typeof (i == null ? void 0 : i.schema) != "object" ? void 0 : Bs.call(this, r, i);
  }
  if (typeof (o == null ? void 0 : o.schema) == "object") {
    if (o.validate || Ba.call(this, o), a === (0, et.normalizeId)(e)) {
      const { schema: i } = o, { schemaId: c } = this.opts, l = i[c];
      return l && (s = (0, et.resolveUrl)(this.opts.uriResolver, s, l)), new Ss({ schema: i, schemaId: c, root: t, baseId: s });
    }
    return Bs.call(this, r, o);
  }
}
De.resolveSchema = Ps;
const hp = /* @__PURE__ */ new Set([
  "properties",
  "patternProperties",
  "enum",
  "dependencies",
  "definitions"
]);
function Bs(t, { baseId: e, schema: r, root: n }) {
  var s;
  if (((s = t.fragment) === null || s === void 0 ? void 0 : s[0]) !== "/")
    return;
  for (const i of t.fragment.slice(1).split("/")) {
    if (typeof r == "boolean")
      return;
    const c = r[(0, Qi.unescapeFragment)(i)];
    if (c === void 0)
      return;
    r = c;
    const l = typeof r == "object" && r[this.opts.schemaId];
    !hp.has(i) && l && (e = (0, et.resolveUrl)(this.opts.uriResolver, e, l));
  }
  let a;
  if (typeof r != "boolean" && r.$ref && !(0, Qi.schemaHasRulesButRef)(r, this.RULES)) {
    const i = (0, et.resolveUrl)(this.opts.uriResolver, e, r.$ref);
    a = Ps.call(this, n, i);
  }
  const { schemaId: o } = this.opts;
  if (a = a || new Ss({ schema: r, schemaId: o, root: n, baseId: e }), a.schema !== a.root.schema)
    return a;
}
const pp = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", mp = "Meta-schema for $data reference (JSON AnySchema extension proposal)", gp = "object", yp = [
  "$data"
], $p = {
  $data: {
    type: "string",
    anyOf: [
      {
        format: "relative-json-pointer"
      },
      {
        format: "json-pointer"
      }
    ]
  }
}, vp = !1, _p = {
  $id: pp,
  description: mp,
  type: gp,
  required: yp,
  properties: $p,
  additionalProperties: vp
};
var Wa = {}, Os = { exports: {} };
const wp = RegExp.prototype.test.bind(/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu), du = RegExp.prototype.test.bind(/^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u);
function fu(t) {
  let e = "", r = 0, n = 0;
  for (n = 0; n < t.length; n++)
    if (r = t[n].charCodeAt(0), r !== 48) {
      if (!(r >= 48 && r <= 57 || r >= 65 && r <= 70 || r >= 97 && r <= 102))
        return "";
      e += t[n];
      break;
    }
  for (n += 1; n < t.length; n++) {
    if (r = t[n].charCodeAt(0), !(r >= 48 && r <= 57 || r >= 65 && r <= 70 || r >= 97 && r <= 102))
      return "";
    e += t[n];
  }
  return e;
}
const Ep = RegExp.prototype.test.bind(/[^!"$&'()*+,\-.;=_`a-z{}~]/u);
function Zi(t) {
  return t.length = 0, !0;
}
function bp(t, e, r) {
  if (t.length) {
    const n = fu(t);
    if (n !== "")
      e.push(n);
    else
      return r.error = !0, !1;
    t.length = 0;
  }
  return !0;
}
function Sp(t) {
  let e = 0;
  const r = { error: !1, address: "", zone: "" }, n = [], s = [];
  let a = !1, o = !1, i = bp;
  for (let c = 0; c < t.length; c++) {
    const l = t[c];
    if (!(l === "[" || l === "]"))
      if (l === ":") {
        if (a === !0 && (o = !0), !i(s, n, r))
          break;
        if (++e > 7) {
          r.error = !0;
          break;
        }
        c > 0 && t[c - 1] === ":" && (a = !0), n.push(":");
        continue;
      } else if (l === "%") {
        if (!i(s, n, r))
          break;
        i = Zi;
      } else {
        s.push(l);
        continue;
      }
  }
  return s.length && (i === Zi ? r.zone = s.join("") : o ? n.push(s.join("")) : n.push(fu(s))), r.address = n.join(""), r;
}
function hu(t) {
  if (Pp(t, ":") < 2)
    return { host: t, isIPV6: !1 };
  const e = Sp(t);
  if (e.error)
    return { host: t, isIPV6: !1 };
  {
    let r = e.address, n = e.address;
    return e.zone && (r += "%" + e.zone, n += "%25" + e.zone), { host: r, isIPV6: !0, escapedHost: n };
  }
}
function Pp(t, e) {
  let r = 0;
  for (let n = 0; n < t.length; n++)
    t[n] === e && r++;
  return r;
}
function Op(t) {
  let e = t;
  const r = [];
  let n = -1, s = 0;
  for (; s = e.length; ) {
    if (s === 1) {
      if (e === ".")
        break;
      if (e === "/") {
        r.push("/");
        break;
      } else {
        r.push(e);
        break;
      }
    } else if (s === 2) {
      if (e[0] === ".") {
        if (e[1] === ".")
          break;
        if (e[1] === "/") {
          e = e.slice(2);
          continue;
        }
      } else if (e[0] === "/" && (e[1] === "." || e[1] === "/")) {
        r.push("/");
        break;
      }
    } else if (s === 3 && e === "/..") {
      r.length !== 0 && r.pop(), r.push("/");
      break;
    }
    if (e[0] === ".") {
      if (e[1] === ".") {
        if (e[2] === "/") {
          e = e.slice(3);
          continue;
        }
      } else if (e[1] === "/") {
        e = e.slice(2);
        continue;
      }
    } else if (e[0] === "/" && e[1] === ".") {
      if (e[2] === "/") {
        e = e.slice(2);
        continue;
      } else if (e[2] === "." && e[3] === "/") {
        e = e.slice(3), r.length !== 0 && r.pop();
        continue;
      }
    }
    if ((n = e.indexOf("/", 1)) === -1) {
      r.push(e);
      break;
    } else
      r.push(e.slice(0, n)), e = e.slice(n);
  }
  return r.join("");
}
function Np(t, e) {
  const r = e !== !0 ? escape : unescape;
  return t.scheme !== void 0 && (t.scheme = r(t.scheme)), t.userinfo !== void 0 && (t.userinfo = r(t.userinfo)), t.host !== void 0 && (t.host = r(t.host)), t.path !== void 0 && (t.path = r(t.path)), t.query !== void 0 && (t.query = r(t.query)), t.fragment !== void 0 && (t.fragment = r(t.fragment)), t;
}
function Rp(t) {
  const e = [];
  if (t.userinfo !== void 0 && (e.push(t.userinfo), e.push("@")), t.host !== void 0) {
    let r = unescape(t.host);
    if (!du(r)) {
      const n = hu(r);
      n.isIPV6 === !0 ? r = `[${n.escapedHost}]` : r = t.host;
    }
    e.push(r);
  }
  return (typeof t.port == "number" || typeof t.port == "string") && (e.push(":"), e.push(String(t.port))), e.length ? e.join("") : void 0;
}
var pu = {
  nonSimpleDomain: Ep,
  recomposeAuthority: Rp,
  normalizeComponentEncoding: Np,
  removeDotSegments: Op,
  isIPv4: du,
  isUUID: wp,
  normalizeIPv6: hu
};
const { isUUID: jp } = pu, Tp = /([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu;
function mu(t) {
  return t.secure === !0 ? !0 : t.secure === !1 ? !1 : t.scheme ? t.scheme.length === 3 && (t.scheme[0] === "w" || t.scheme[0] === "W") && (t.scheme[1] === "s" || t.scheme[1] === "S") && (t.scheme[2] === "s" || t.scheme[2] === "S") : !1;
}
function gu(t) {
  return t.host || (t.error = t.error || "HTTP URIs must have a host."), t;
}
function yu(t) {
  const e = String(t.scheme).toLowerCase() === "https";
  return (t.port === (e ? 443 : 80) || t.port === "") && (t.port = void 0), t.path || (t.path = "/"), t;
}
function Ip(t) {
  return t.secure = mu(t), t.resourceName = (t.path || "/") + (t.query ? "?" + t.query : ""), t.path = void 0, t.query = void 0, t;
}
function kp(t) {
  if ((t.port === (mu(t) ? 443 : 80) || t.port === "") && (t.port = void 0), typeof t.secure == "boolean" && (t.scheme = t.secure ? "wss" : "ws", t.secure = void 0), t.resourceName) {
    const [e, r] = t.resourceName.split("?");
    t.path = e && e !== "/" ? e : void 0, t.query = r, t.resourceName = void 0;
  }
  return t.fragment = void 0, t;
}
function Cp(t, e) {
  if (!t.path)
    return t.error = "URN can not be parsed", t;
  const r = t.path.match(Tp);
  if (r) {
    const n = e.scheme || t.scheme || "urn";
    t.nid = r[1].toLowerCase(), t.nss = r[2];
    const s = `${n}:${e.nid || t.nid}`, a = Xa(s);
    t.path = void 0, a && (t = a.parse(t, e));
  } else
    t.error = t.error || "URN can not be parsed.";
  return t;
}
function Ap(t, e) {
  if (t.nid === void 0)
    throw new Error("URN without nid cannot be serialized");
  const r = e.scheme || t.scheme || "urn", n = t.nid.toLowerCase(), s = `${r}:${e.nid || n}`, a = Xa(s);
  a && (t = a.serialize(t, e));
  const o = t, i = t.nss;
  return o.path = `${n || e.nid}:${i}`, e.skipEscape = !0, o;
}
function Dp(t, e) {
  const r = t;
  return r.uuid = r.nss, r.nss = void 0, !e.tolerant && (!r.uuid || !jp(r.uuid)) && (r.error = r.error || "UUID is not valid."), r;
}
function Lp(t) {
  const e = t;
  return e.nss = (t.uuid || "").toLowerCase(), e;
}
const $u = (
  /** @type {SchemeHandler} */
  {
    scheme: "http",
    domainHost: !0,
    parse: gu,
    serialize: yu
  }
), Mp = (
  /** @type {SchemeHandler} */
  {
    scheme: "https",
    domainHost: $u.domainHost,
    parse: gu,
    serialize: yu
  }
), Qn = (
  /** @type {SchemeHandler} */
  {
    scheme: "ws",
    domainHost: !0,
    parse: Ip,
    serialize: kp
  }
), Vp = (
  /** @type {SchemeHandler} */
  {
    scheme: "wss",
    domainHost: Qn.domainHost,
    parse: Qn.parse,
    serialize: Qn.serialize
  }
), Fp = (
  /** @type {SchemeHandler} */
  {
    scheme: "urn",
    parse: Cp,
    serialize: Ap,
    skipNormalize: !0
  }
), zp = (
  /** @type {SchemeHandler} */
  {
    scheme: "urn:uuid",
    parse: Dp,
    serialize: Lp,
    skipNormalize: !0
  }
), cs = (
  /** @type {Record<SchemeName, SchemeHandler>} */
  {
    http: $u,
    https: Mp,
    ws: Qn,
    wss: Vp,
    urn: Fp,
    "urn:uuid": zp
  }
);
Object.setPrototypeOf(cs, null);
function Xa(t) {
  return t && (cs[
    /** @type {SchemeName} */
    t
  ] || cs[
    /** @type {SchemeName} */
    t.toLowerCase()
  ]) || void 0;
}
var Up = {
  SCHEMES: cs,
  getSchemeHandler: Xa
};
const { normalizeIPv6: Kp, removeDotSegments: tn, recomposeAuthority: qp, normalizeComponentEncoding: Tn, isIPv4: xp, nonSimpleDomain: Gp } = pu, { SCHEMES: Hp, getSchemeHandler: vu } = Up;
function Jp(t, e) {
  return typeof t == "string" ? t = /** @type {T} */
  ft(bt(t, e), e) : typeof t == "object" && (t = /** @type {T} */
  bt(ft(t, e), e)), t;
}
function Bp(t, e, r) {
  const n = r ? Object.assign({ scheme: "null" }, r) : { scheme: "null" }, s = _u(bt(t, n), bt(e, n), n, !0);
  return n.skipEscape = !0, ft(s, n);
}
function _u(t, e, r, n) {
  const s = {};
  return n || (t = bt(ft(t, r), r), e = bt(ft(e, r), r)), r = r || {}, !r.tolerant && e.scheme ? (s.scheme = e.scheme, s.userinfo = e.userinfo, s.host = e.host, s.port = e.port, s.path = tn(e.path || ""), s.query = e.query) : (e.userinfo !== void 0 || e.host !== void 0 || e.port !== void 0 ? (s.userinfo = e.userinfo, s.host = e.host, s.port = e.port, s.path = tn(e.path || ""), s.query = e.query) : (e.path ? (e.path[0] === "/" ? s.path = tn(e.path) : ((t.userinfo !== void 0 || t.host !== void 0 || t.port !== void 0) && !t.path ? s.path = "/" + e.path : t.path ? s.path = t.path.slice(0, t.path.lastIndexOf("/") + 1) + e.path : s.path = e.path, s.path = tn(s.path)), s.query = e.query) : (s.path = t.path, e.query !== void 0 ? s.query = e.query : s.query = t.query), s.userinfo = t.userinfo, s.host = t.host, s.port = t.port), s.scheme = t.scheme), s.fragment = e.fragment, s;
}
function Wp(t, e, r) {
  return typeof t == "string" ? (t = unescape(t), t = ft(Tn(bt(t, r), !0), { ...r, skipEscape: !0 })) : typeof t == "object" && (t = ft(Tn(t, !0), { ...r, skipEscape: !0 })), typeof e == "string" ? (e = unescape(e), e = ft(Tn(bt(e, r), !0), { ...r, skipEscape: !0 })) : typeof e == "object" && (e = ft(Tn(e, !0), { ...r, skipEscape: !0 })), t.toLowerCase() === e.toLowerCase();
}
function ft(t, e) {
  const r = {
    host: t.host,
    scheme: t.scheme,
    userinfo: t.userinfo,
    port: t.port,
    path: t.path,
    query: t.query,
    nid: t.nid,
    nss: t.nss,
    uuid: t.uuid,
    fragment: t.fragment,
    reference: t.reference,
    resourceName: t.resourceName,
    secure: t.secure,
    error: ""
  }, n = Object.assign({}, e), s = [], a = vu(n.scheme || r.scheme);
  a && a.serialize && a.serialize(r, n), r.path !== void 0 && (n.skipEscape ? r.path = unescape(r.path) : (r.path = escape(r.path), r.scheme !== void 0 && (r.path = r.path.split("%3A").join(":")))), n.reference !== "suffix" && r.scheme && s.push(r.scheme, ":");
  const o = qp(r);
  if (o !== void 0 && (n.reference !== "suffix" && s.push("//"), s.push(o), r.path && r.path[0] !== "/" && s.push("/")), r.path !== void 0) {
    let i = r.path;
    !n.absolutePath && (!a || !a.absolutePath) && (i = tn(i)), o === void 0 && i[0] === "/" && i[1] === "/" && (i = "/%2F" + i.slice(2)), s.push(i);
  }
  return r.query !== void 0 && s.push("?", r.query), r.fragment !== void 0 && s.push("#", r.fragment), s.join("");
}
const Xp = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
function bt(t, e) {
  const r = Object.assign({}, e), n = {
    scheme: void 0,
    userinfo: void 0,
    host: "",
    port: void 0,
    path: "",
    query: void 0,
    fragment: void 0
  };
  let s = !1;
  r.reference === "suffix" && (r.scheme ? t = r.scheme + ":" + t : t = "//" + t);
  const a = t.match(Xp);
  if (a) {
    if (n.scheme = a[1], n.userinfo = a[3], n.host = a[4], n.port = parseInt(a[5], 10), n.path = a[6] || "", n.query = a[7], n.fragment = a[8], isNaN(n.port) && (n.port = a[5]), n.host)
      if (xp(n.host) === !1) {
        const c = Kp(n.host);
        n.host = c.host.toLowerCase(), s = c.isIPV6;
      } else
        s = !0;
    n.scheme === void 0 && n.userinfo === void 0 && n.host === void 0 && n.port === void 0 && n.query === void 0 && !n.path ? n.reference = "same-document" : n.scheme === void 0 ? n.reference = "relative" : n.fragment === void 0 ? n.reference = "absolute" : n.reference = "uri", r.reference && r.reference !== "suffix" && r.reference !== n.reference && (n.error = n.error || "URI is not a " + r.reference + " reference.");
    const o = vu(r.scheme || n.scheme);
    if (!r.unicodeSupport && (!o || !o.unicodeSupport) && n.host && (r.domainHost || o && o.domainHost) && s === !1 && Gp(n.host))
      try {
        n.host = URL.domainToASCII(n.host.toLowerCase());
      } catch (i) {
        n.error = n.error || "Host's domain name can not be converted to ASCII: " + i;
      }
    (!o || o && !o.skipNormalize) && (t.indexOf("%") !== -1 && (n.scheme !== void 0 && (n.scheme = unescape(n.scheme)), n.host !== void 0 && (n.host = unescape(n.host))), n.path && (n.path = escape(unescape(n.path))), n.fragment && (n.fragment = encodeURI(decodeURIComponent(n.fragment)))), o && o.parse && o.parse(n, r);
  } else
    n.error = n.error || "URI can not be parsed.";
  return n;
}
const Ya = {
  SCHEMES: Hp,
  normalize: Jp,
  resolve: Bp,
  resolveComponent: _u,
  equal: Wp,
  serialize: ft,
  parse: bt
};
Os.exports = Ya;
Os.exports.default = Ya;
Os.exports.fastUri = Ya;
var wu = Os.exports;
Object.defineProperty(Wa, "__esModule", { value: !0 });
const Eu = wu;
Eu.code = 'require("ajv/dist/runtime/uri").default';
Wa.default = Eu;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = void 0;
  var e = rt;
  Object.defineProperty(t, "KeywordCxt", { enumerable: !0, get: function() {
    return e.KeywordCxt;
  } });
  var r = Z;
  Object.defineProperty(t, "_", { enumerable: !0, get: function() {
    return r._;
  } }), Object.defineProperty(t, "str", { enumerable: !0, get: function() {
    return r.str;
  } }), Object.defineProperty(t, "stringify", { enumerable: !0, get: function() {
    return r.stringify;
  } }), Object.defineProperty(t, "nil", { enumerable: !0, get: function() {
    return r.nil;
  } }), Object.defineProperty(t, "Name", { enumerable: !0, get: function() {
    return r.Name;
  } }), Object.defineProperty(t, "CodeGen", { enumerable: !0, get: function() {
    return r.CodeGen;
  } });
  const n = En, s = Mr, a = mr, o = De, i = Z, c = Pe, l = $e, d = D, f = _p, w = Wa, g = (O, m) => new RegExp(O, m);
  g.code = "new RegExp";
  const y = ["removeAdditional", "useDefaults", "coerceTypes"], v = /* @__PURE__ */ new Set([
    "validate",
    "serialize",
    "parse",
    "wrapper",
    "root",
    "schema",
    "keyword",
    "pattern",
    "formats",
    "validate$data",
    "func",
    "obj",
    "Error"
  ]), $ = {
    errorDataPath: "",
    format: "`validateFormats: false` can be used instead.",
    nullable: '"nullable" keyword is supported by default.',
    jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
    extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
    missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
    processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
    sourceCode: "Use option `code: {source: true}`",
    strictDefaults: "It is default now, see option `strict`.",
    strictKeywords: "It is default now, see option `strict`.",
    uniqueItems: '"uniqueItems" keyword is always validated.',
    unknownFormats: "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
    cache: "Map is used as cache, schema object as key.",
    serialize: "Map is used as cache, schema object as key.",
    ajvErrors: "It is default now."
  }, p = {
    ignoreKeywordsWithRef: "",
    jsPropertySyntax: "",
    unicode: '"minLength"/"maxLength" account for unicode characters by default.'
  }, E = 200;
  function P(O) {
    var m, b, _, u, h, S, T, I, K, F, oe, Ue, Kt, qt, xt, Gt, Ht, Jt, Bt, Wt, Xt, Yt, Qt, Zt, er;
    const Be = O.strict, tr = (m = O.code) === null || m === void 0 ? void 0 : m.optimize, Hr = tr === !0 || tr === void 0 ? 1 : tr || 0, Jr = (_ = (b = O.code) === null || b === void 0 ? void 0 : b.regExp) !== null && _ !== void 0 ? _ : g, Us = (u = O.uriResolver) !== null && u !== void 0 ? u : w.default;
    return {
      strictSchema: (S = (h = O.strictSchema) !== null && h !== void 0 ? h : Be) !== null && S !== void 0 ? S : !0,
      strictNumbers: (I = (T = O.strictNumbers) !== null && T !== void 0 ? T : Be) !== null && I !== void 0 ? I : !0,
      strictTypes: (F = (K = O.strictTypes) !== null && K !== void 0 ? K : Be) !== null && F !== void 0 ? F : "log",
      strictTuples: (Ue = (oe = O.strictTuples) !== null && oe !== void 0 ? oe : Be) !== null && Ue !== void 0 ? Ue : "log",
      strictRequired: (qt = (Kt = O.strictRequired) !== null && Kt !== void 0 ? Kt : Be) !== null && qt !== void 0 ? qt : !1,
      code: O.code ? { ...O.code, optimize: Hr, regExp: Jr } : { optimize: Hr, regExp: Jr },
      loopRequired: (xt = O.loopRequired) !== null && xt !== void 0 ? xt : E,
      loopEnum: (Gt = O.loopEnum) !== null && Gt !== void 0 ? Gt : E,
      meta: (Ht = O.meta) !== null && Ht !== void 0 ? Ht : !0,
      messages: (Jt = O.messages) !== null && Jt !== void 0 ? Jt : !0,
      inlineRefs: (Bt = O.inlineRefs) !== null && Bt !== void 0 ? Bt : !0,
      schemaId: (Wt = O.schemaId) !== null && Wt !== void 0 ? Wt : "$id",
      addUsedSchema: (Xt = O.addUsedSchema) !== null && Xt !== void 0 ? Xt : !0,
      validateSchema: (Yt = O.validateSchema) !== null && Yt !== void 0 ? Yt : !0,
      validateFormats: (Qt = O.validateFormats) !== null && Qt !== void 0 ? Qt : !0,
      unicodeRegExp: (Zt = O.unicodeRegExp) !== null && Zt !== void 0 ? Zt : !0,
      int32range: (er = O.int32range) !== null && er !== void 0 ? er : !0,
      uriResolver: Us
    };
  }
  class N {
    constructor(m = {}) {
      this.schemas = {}, this.refs = {}, this.formats = {}, this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), m = this.opts = { ...m, ...P(m) };
      const { es5: b, lines: _ } = this.opts.code;
      this.scope = new i.ValueScope({ scope: {}, prefixes: v, es5: b, lines: _ }), this.logger = H(m.logger);
      const u = m.validateFormats;
      m.validateFormats = !1, this.RULES = (0, a.getRules)(), R.call(this, $, m, "NOT SUPPORTED"), R.call(this, p, m, "DEPRECATED", "warn"), this._metaOpts = ce.call(this), m.formats && ue.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), m.keywords && ie.call(this, m.keywords), typeof m.meta == "object" && this.addMetaSchema(m.meta), G.call(this), m.validateFormats = u;
    }
    _addVocabularies() {
      this.addKeyword("$async");
    }
    _addDefaultMetaSchema() {
      const { $data: m, meta: b, schemaId: _ } = this.opts;
      let u = f;
      _ === "id" && (u = { ...f }, u.id = u.$id, delete u.$id), b && m && this.addMetaSchema(u, u[_], !1);
    }
    defaultMeta() {
      const { meta: m, schemaId: b } = this.opts;
      return this.opts.defaultMeta = typeof m == "object" ? m[b] || m : void 0;
    }
    validate(m, b) {
      let _;
      if (typeof m == "string") {
        if (_ = this.getSchema(m), !_)
          throw new Error(`no schema with key or ref "${m}"`);
      } else
        _ = this.compile(m);
      const u = _(b);
      return "$async" in _ || (this.errors = _.errors), u;
    }
    compile(m, b) {
      const _ = this._addSchema(m, b);
      return _.validate || this._compileSchemaEnv(_);
    }
    compileAsync(m, b) {
      if (typeof this.opts.loadSchema != "function")
        throw new Error("options.loadSchema should be a function");
      const { loadSchema: _ } = this.opts;
      return u.call(this, m, b);
      async function u(F, oe) {
        await h.call(this, F.$schema);
        const Ue = this._addSchema(F, oe);
        return Ue.validate || S.call(this, Ue);
      }
      async function h(F) {
        F && !this.getSchema(F) && await u.call(this, { $ref: F }, !0);
      }
      async function S(F) {
        try {
          return this._compileSchemaEnv(F);
        } catch (oe) {
          if (!(oe instanceof s.default))
            throw oe;
          return T.call(this, oe), await I.call(this, oe.missingSchema), S.call(this, F);
        }
      }
      function T({ missingSchema: F, missingRef: oe }) {
        if (this.refs[F])
          throw new Error(`AnySchema ${F} is loaded but ${oe} cannot be resolved`);
      }
      async function I(F) {
        const oe = await K.call(this, F);
        this.refs[F] || await h.call(this, oe.$schema), this.refs[F] || this.addSchema(oe, F, b);
      }
      async function K(F) {
        const oe = this._loading[F];
        if (oe)
          return oe;
        try {
          return await (this._loading[F] = _(F));
        } finally {
          delete this._loading[F];
        }
      }
    }
    // Adds schema to the instance
    addSchema(m, b, _, u = this.opts.validateSchema) {
      if (Array.isArray(m)) {
        for (const S of m)
          this.addSchema(S, void 0, _, u);
        return this;
      }
      let h;
      if (typeof m == "object") {
        const { schemaId: S } = this.opts;
        if (h = m[S], h !== void 0 && typeof h != "string")
          throw new Error(`schema ${S} must be string`);
      }
      return b = (0, c.normalizeId)(b || h), this._checkUnique(b), this.schemas[b] = this._addSchema(m, _, b, u, !0), this;
    }
    // Add schema that will be used to validate other schemas
    // options in META_IGNORE_OPTIONS are alway set to false
    addMetaSchema(m, b, _ = this.opts.validateSchema) {
      return this.addSchema(m, b, !0, _), this;
    }
    //  Validate schema against its meta-schema
    validateSchema(m, b) {
      if (typeof m == "boolean")
        return !0;
      let _;
      if (_ = m.$schema, _ !== void 0 && typeof _ != "string")
        throw new Error("$schema must be a string");
      if (_ = _ || this.opts.defaultMeta || this.defaultMeta(), !_)
        return this.logger.warn("meta-schema not available"), this.errors = null, !0;
      const u = this.validate(_, m);
      if (!u && b) {
        const h = "schema is invalid: " + this.errorsText();
        if (this.opts.validateSchema === "log")
          this.logger.error(h);
        else
          throw new Error(h);
      }
      return u;
    }
    // Get compiled schema by `key` or `ref`.
    // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
    getSchema(m) {
      let b;
      for (; typeof (b = z.call(this, m)) == "string"; )
        m = b;
      if (b === void 0) {
        const { schemaId: _ } = this.opts, u = new o.SchemaEnv({ schema: {}, schemaId: _ });
        if (b = o.resolveSchema.call(this, u, m), !b)
          return;
        this.refs[m] = b;
      }
      return b.validate || this._compileSchemaEnv(b);
    }
    // Remove cached schema(s).
    // If no parameter is passed all schemas but meta-schemas are removed.
    // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
    // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
    removeSchema(m) {
      if (m instanceof RegExp)
        return this._removeAllSchemas(this.schemas, m), this._removeAllSchemas(this.refs, m), this;
      switch (typeof m) {
        case "undefined":
          return this._removeAllSchemas(this.schemas), this._removeAllSchemas(this.refs), this._cache.clear(), this;
        case "string": {
          const b = z.call(this, m);
          return typeof b == "object" && this._cache.delete(b.schema), delete this.schemas[m], delete this.refs[m], this;
        }
        case "object": {
          const b = m;
          this._cache.delete(b);
          let _ = m[this.opts.schemaId];
          return _ && (_ = (0, c.normalizeId)(_), delete this.schemas[_], delete this.refs[_]), this;
        }
        default:
          throw new Error("ajv.removeSchema: invalid parameter");
      }
    }
    // add "vocabulary" - a collection of keywords
    addVocabulary(m) {
      for (const b of m)
        this.addKeyword(b);
      return this;
    }
    addKeyword(m, b) {
      let _;
      if (typeof m == "string")
        _ = m, typeof b == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), b.keyword = _);
      else if (typeof m == "object" && b === void 0) {
        if (b = m, _ = b.keyword, Array.isArray(_) && !_.length)
          throw new Error("addKeywords: keyword must be string or non-empty array");
      } else
        throw new Error("invalid addKeywords parameters");
      if (j.call(this, _, b), !b)
        return (0, d.eachItem)(_, (h) => k.call(this, h)), this;
      C.call(this, b);
      const u = {
        ...b,
        type: (0, l.getJSONTypes)(b.type),
        schemaType: (0, l.getJSONTypes)(b.schemaType)
      };
      return (0, d.eachItem)(_, u.type.length === 0 ? (h) => k.call(this, h, u) : (h) => u.type.forEach((S) => k.call(this, h, u, S))), this;
    }
    getKeyword(m) {
      const b = this.RULES.all[m];
      return typeof b == "object" ? b.definition : !!b;
    }
    // Remove keyword
    removeKeyword(m) {
      const { RULES: b } = this;
      delete b.keywords[m], delete b.all[m];
      for (const _ of b.rules) {
        const u = _.rules.findIndex((h) => h.keyword === m);
        u >= 0 && _.rules.splice(u, 1);
      }
      return this;
    }
    // Add format
    addFormat(m, b) {
      return typeof b == "string" && (b = new RegExp(b)), this.formats[m] = b, this;
    }
    errorsText(m = this.errors, { separator: b = ", ", dataVar: _ = "data" } = {}) {
      return !m || m.length === 0 ? "No errors" : m.map((u) => `${_}${u.instancePath} ${u.message}`).reduce((u, h) => u + b + h);
    }
    $dataMetaSchema(m, b) {
      const _ = this.RULES.all;
      m = JSON.parse(JSON.stringify(m));
      for (const u of b) {
        const h = u.split("/").slice(1);
        let S = m;
        for (const T of h)
          S = S[T];
        for (const T in _) {
          const I = _[T];
          if (typeof I != "object")
            continue;
          const { $data: K } = I.definition, F = S[T];
          K && F && (S[T] = L(F));
        }
      }
      return m;
    }
    _removeAllSchemas(m, b) {
      for (const _ in m) {
        const u = m[_];
        (!b || b.test(_)) && (typeof u == "string" ? delete m[_] : u && !u.meta && (this._cache.delete(u.schema), delete m[_]));
      }
    }
    _addSchema(m, b, _, u = this.opts.validateSchema, h = this.opts.addUsedSchema) {
      let S;
      const { schemaId: T } = this.opts;
      if (typeof m == "object")
        S = m[T];
      else {
        if (this.opts.jtd)
          throw new Error("schema must be object");
        if (typeof m != "boolean")
          throw new Error("schema must be object or boolean");
      }
      let I = this._cache.get(m);
      if (I !== void 0)
        return I;
      _ = (0, c.normalizeId)(S || _);
      const K = c.getSchemaRefs.call(this, m, _);
      return I = new o.SchemaEnv({ schema: m, schemaId: T, meta: b, baseId: _, localRefs: K }), this._cache.set(I.schema, I), h && !_.startsWith("#") && (_ && this._checkUnique(_), this.refs[_] = I), u && this.validateSchema(m, !0), I;
    }
    _checkUnique(m) {
      if (this.schemas[m] || this.refs[m])
        throw new Error(`schema with key or id "${m}" already exists`);
    }
    _compileSchemaEnv(m) {
      if (m.meta ? this._compileMetaSchema(m) : o.compileSchema.call(this, m), !m.validate)
        throw new Error("ajv implementation error");
      return m.validate;
    }
    _compileMetaSchema(m) {
      const b = this.opts;
      this.opts = this._metaOpts;
      try {
        o.compileSchema.call(this, m);
      } finally {
        this.opts = b;
      }
    }
  }
  N.ValidationError = n.default, N.MissingRefError = s.default, t.default = N;
  function R(O, m, b, _ = "error") {
    for (const u in O) {
      const h = u;
      h in m && this.logger[_](`${b}: option ${u}. ${O[h]}`);
    }
  }
  function z(O) {
    return O = (0, c.normalizeId)(O), this.schemas[O] || this.refs[O];
  }
  function G() {
    const O = this.opts.schemas;
    if (O)
      if (Array.isArray(O))
        this.addSchema(O);
      else
        for (const m in O)
          this.addSchema(O[m], m);
  }
  function ue() {
    for (const O in this.opts.formats) {
      const m = this.opts.formats[O];
      m && this.addFormat(O, m);
    }
  }
  function ie(O) {
    if (Array.isArray(O)) {
      this.addVocabulary(O);
      return;
    }
    this.logger.warn("keywords option as map is deprecated, pass array");
    for (const m in O) {
      const b = O[m];
      b.keyword || (b.keyword = m), this.addKeyword(b);
    }
  }
  function ce() {
    const O = { ...this.opts };
    for (const m of y)
      delete O[m];
    return O;
  }
  const U = { log() {
  }, warn() {
  }, error() {
  } };
  function H(O) {
    if (O === !1)
      return U;
    if (O === void 0)
      return console;
    if (O.log && O.warn && O.error)
      return O;
    throw new Error("logger must implement log, warn and error methods");
  }
  const X = /^[a-z_$][a-z0-9_$:-]*$/i;
  function j(O, m) {
    const { RULES: b } = this;
    if ((0, d.eachItem)(O, (_) => {
      if (b.keywords[_])
        throw new Error(`Keyword ${_} is already defined`);
      if (!X.test(_))
        throw new Error(`Keyword ${_} has invalid name`);
    }), !!m && m.$data && !("code" in m || "validate" in m))
      throw new Error('$data keyword must have "code" or "validate" function');
  }
  function k(O, m, b) {
    var _;
    const u = m == null ? void 0 : m.post;
    if (b && u)
      throw new Error('keyword with "post" flag cannot have "type"');
    const { RULES: h } = this;
    let S = u ? h.post : h.rules.find(({ type: I }) => I === b);
    if (S || (S = { type: b, rules: [] }, h.rules.push(S)), h.keywords[O] = !0, !m)
      return;
    const T = {
      keyword: O,
      definition: {
        ...m,
        type: (0, l.getJSONTypes)(m.type),
        schemaType: (0, l.getJSONTypes)(m.schemaType)
      }
    };
    m.before ? A.call(this, S, T, m.before) : S.rules.push(T), h.all[O] = T, (_ = m.implements) === null || _ === void 0 || _.forEach((I) => this.addKeyword(I));
  }
  function A(O, m, b) {
    const _ = O.rules.findIndex((u) => u.keyword === b);
    _ >= 0 ? O.rules.splice(_, 0, m) : (O.rules.push(m), this.logger.warn(`rule ${b} is not defined`));
  }
  function C(O) {
    let { metaSchema: m } = O;
    m !== void 0 && (O.$data && this.opts.$data && (m = L(m)), O.validateSchema = this.compile(m, !0));
  }
  const V = {
    $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
  };
  function L(O) {
    return { anyOf: [O, V] };
  }
})(Cl);
var Qa = {}, Za = {}, eo = {};
Object.defineProperty(eo, "__esModule", { value: !0 });
const Yp = {
  keyword: "id",
  code() {
    throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
  }
};
eo.default = Yp;
var St = {};
Object.defineProperty(St, "__esModule", { value: !0 });
St.callRef = St.getValidate = void 0;
const Qp = Mr, ec = se, Ve = Z, vr = xe, tc = De, In = D, Zp = {
  keyword: "$ref",
  schemaType: "string",
  code(t) {
    const { gen: e, schema: r, it: n } = t, { baseId: s, schemaEnv: a, validateName: o, opts: i, self: c } = n, { root: l } = a;
    if ((r === "#" || r === "#/") && s === l.baseId)
      return f();
    const d = tc.resolveRef.call(c, l, s, r);
    if (d === void 0)
      throw new Qp.default(n.opts.uriResolver, s, r);
    if (d instanceof tc.SchemaEnv)
      return w(d);
    return g(d);
    function f() {
      if (a === l)
        return Zn(t, o, a, a.$async);
      const y = e.scopeValue("root", { ref: l });
      return Zn(t, (0, Ve._)`${y}.validate`, l, l.$async);
    }
    function w(y) {
      const v = bu(t, y);
      Zn(t, v, y, y.$async);
    }
    function g(y) {
      const v = e.scopeValue("schema", i.code.source === !0 ? { ref: y, code: (0, Ve.stringify)(y) } : { ref: y }), $ = e.name("valid"), p = t.subschema({
        schema: y,
        dataTypes: [],
        schemaPath: Ve.nil,
        topSchemaRef: v,
        errSchemaPath: r
      }, $);
      t.mergeEvaluated(p), t.ok($);
    }
  }
};
function bu(t, e) {
  const { gen: r } = t;
  return e.validate ? r.scopeValue("validate", { ref: e.validate }) : (0, Ve._)`${r.scopeValue("wrapper", { ref: e })}.validate`;
}
St.getValidate = bu;
function Zn(t, e, r, n) {
  const { gen: s, it: a } = t, { allErrors: o, schemaEnv: i, opts: c } = a, l = c.passContext ? vr.default.this : Ve.nil;
  n ? d() : f();
  function d() {
    if (!i.$async)
      throw new Error("async schema referenced by sync schema");
    const y = s.let("valid");
    s.try(() => {
      s.code((0, Ve._)`await ${(0, ec.callValidateCode)(t, e, l)}`), g(e), o || s.assign(y, !0);
    }, (v) => {
      s.if((0, Ve._)`!(${v} instanceof ${a.ValidationError})`, () => s.throw(v)), w(v), o || s.assign(y, !1);
    }), t.ok(y);
  }
  function f() {
    t.result((0, ec.callValidateCode)(t, e, l), () => g(e), () => w(e));
  }
  function w(y) {
    const v = (0, Ve._)`${y}.errors`;
    s.assign(vr.default.vErrors, (0, Ve._)`${vr.default.vErrors} === null ? ${v} : ${vr.default.vErrors}.concat(${v})`), s.assign(vr.default.errors, (0, Ve._)`${vr.default.vErrors}.length`);
  }
  function g(y) {
    var v;
    if (!a.opts.unevaluated)
      return;
    const $ = (v = r == null ? void 0 : r.validate) === null || v === void 0 ? void 0 : v.evaluated;
    if (a.props !== !0)
      if ($ && !$.dynamicProps)
        $.props !== void 0 && (a.props = In.mergeEvaluated.props(s, $.props, a.props));
      else {
        const p = s.var("props", (0, Ve._)`${y}.evaluated.props`);
        a.props = In.mergeEvaluated.props(s, p, a.props, Ve.Name);
      }
    if (a.items !== !0)
      if ($ && !$.dynamicItems)
        $.items !== void 0 && (a.items = In.mergeEvaluated.items(s, $.items, a.items));
      else {
        const p = s.var("items", (0, Ve._)`${y}.evaluated.items`);
        a.items = In.mergeEvaluated.items(s, p, a.items, Ve.Name);
      }
  }
}
St.callRef = Zn;
St.default = Zp;
Object.defineProperty(Za, "__esModule", { value: !0 });
const em = eo, tm = St, rm = [
  "$schema",
  "$id",
  "$defs",
  "$vocabulary",
  { keyword: "$comment" },
  "definitions",
  em.default,
  tm.default
];
Za.default = rm;
var to = {}, ro = {};
Object.defineProperty(ro, "__esModule", { value: !0 });
const ls = Z, jt = ls.operators, us = {
  maximum: { okStr: "<=", ok: jt.LTE, fail: jt.GT },
  minimum: { okStr: ">=", ok: jt.GTE, fail: jt.LT },
  exclusiveMaximum: { okStr: "<", ok: jt.LT, fail: jt.GTE },
  exclusiveMinimum: { okStr: ">", ok: jt.GT, fail: jt.LTE }
}, nm = {
  message: ({ keyword: t, schemaCode: e }) => (0, ls.str)`must be ${us[t].okStr} ${e}`,
  params: ({ keyword: t, schemaCode: e }) => (0, ls._)`{comparison: ${us[t].okStr}, limit: ${e}}`
}, sm = {
  keyword: Object.keys(us),
  type: "number",
  schemaType: "number",
  $data: !0,
  error: nm,
  code(t) {
    const { keyword: e, data: r, schemaCode: n } = t;
    t.fail$data((0, ls._)`${r} ${us[e].fail} ${n} || isNaN(${r})`);
  }
};
ro.default = sm;
var no = {};
Object.defineProperty(no, "__esModule", { value: !0 });
const an = Z, am = {
  message: ({ schemaCode: t }) => (0, an.str)`must be multiple of ${t}`,
  params: ({ schemaCode: t }) => (0, an._)`{multipleOf: ${t}}`
}, om = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: am,
  code(t) {
    const { gen: e, data: r, schemaCode: n, it: s } = t, a = s.opts.multipleOfPrecision, o = e.let("res"), i = a ? (0, an._)`Math.abs(Math.round(${o}) - ${o}) > 1e-${a}` : (0, an._)`${o} !== parseInt(${o})`;
    t.fail$data((0, an._)`(${n} === 0 || (${o} = ${r}/${n}, ${i}))`);
  }
};
no.default = om;
var so = {}, ao = {};
Object.defineProperty(ao, "__esModule", { value: !0 });
function Su(t) {
  const e = t.length;
  let r = 0, n = 0, s;
  for (; n < e; )
    r++, s = t.charCodeAt(n++), s >= 55296 && s <= 56319 && n < e && (s = t.charCodeAt(n), (s & 64512) === 56320 && n++);
  return r;
}
ao.default = Su;
Su.code = 'require("ajv/dist/runtime/ucs2length").default';
Object.defineProperty(so, "__esModule", { value: !0 });
const or = Z, im = D, cm = ao, lm = {
  message({ keyword: t, schemaCode: e }) {
    const r = t === "maxLength" ? "more" : "fewer";
    return (0, or.str)`must NOT have ${r} than ${e} characters`;
  },
  params: ({ schemaCode: t }) => (0, or._)`{limit: ${t}}`
}, um = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: lm,
  code(t) {
    const { keyword: e, data: r, schemaCode: n, it: s } = t, a = e === "maxLength" ? or.operators.GT : or.operators.LT, o = s.opts.unicode === !1 ? (0, or._)`${r}.length` : (0, or._)`${(0, im.useFunc)(t.gen, cm.default)}(${r})`;
    t.fail$data((0, or._)`${o} ${a} ${n}`);
  }
};
so.default = um;
var oo = {};
Object.defineProperty(oo, "__esModule", { value: !0 });
const dm = se, ds = Z, fm = {
  message: ({ schemaCode: t }) => (0, ds.str)`must match pattern "${t}"`,
  params: ({ schemaCode: t }) => (0, ds._)`{pattern: ${t}}`
}, hm = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: fm,
  code(t) {
    const { data: e, $data: r, schema: n, schemaCode: s, it: a } = t, o = a.opts.unicodeRegExp ? "u" : "", i = r ? (0, ds._)`(new RegExp(${s}, ${o}))` : (0, dm.usePattern)(t, n);
    t.fail$data((0, ds._)`!${i}.test(${e})`);
  }
};
oo.default = hm;
var io = {};
Object.defineProperty(io, "__esModule", { value: !0 });
const on = Z, pm = {
  message({ keyword: t, schemaCode: e }) {
    const r = t === "maxProperties" ? "more" : "fewer";
    return (0, on.str)`must NOT have ${r} than ${e} properties`;
  },
  params: ({ schemaCode: t }) => (0, on._)`{limit: ${t}}`
}, mm = {
  keyword: ["maxProperties", "minProperties"],
  type: "object",
  schemaType: "number",
  $data: !0,
  error: pm,
  code(t) {
    const { keyword: e, data: r, schemaCode: n } = t, s = e === "maxProperties" ? on.operators.GT : on.operators.LT;
    t.fail$data((0, on._)`Object.keys(${r}).length ${s} ${n}`);
  }
};
io.default = mm;
var co = {};
Object.defineProperty(co, "__esModule", { value: !0 });
const Xr = se, cn = Z, gm = D, ym = {
  message: ({ params: { missingProperty: t } }) => (0, cn.str)`must have required property '${t}'`,
  params: ({ params: { missingProperty: t } }) => (0, cn._)`{missingProperty: ${t}}`
}, $m = {
  keyword: "required",
  type: "object",
  schemaType: "array",
  $data: !0,
  error: ym,
  code(t) {
    const { gen: e, schema: r, schemaCode: n, data: s, $data: a, it: o } = t, { opts: i } = o;
    if (!a && r.length === 0)
      return;
    const c = r.length >= i.loopRequired;
    if (o.allErrors ? l() : d(), i.strictRequired) {
      const g = t.parentSchema.properties, { definedProperties: y } = t.it;
      for (const v of r)
        if ((g == null ? void 0 : g[v]) === void 0 && !y.has(v)) {
          const $ = o.schemaEnv.baseId + o.errSchemaPath, p = `required property "${v}" is not defined at "${$}" (strictRequired)`;
          (0, gm.checkStrictMode)(o, p, o.opts.strictRequired);
        }
    }
    function l() {
      if (c || a)
        t.block$data(cn.nil, f);
      else
        for (const g of r)
          (0, Xr.checkReportMissingProp)(t, g);
    }
    function d() {
      const g = e.let("missing");
      if (c || a) {
        const y = e.let("valid", !0);
        t.block$data(y, () => w(g, y)), t.ok(y);
      } else
        e.if((0, Xr.checkMissingProp)(t, r, g)), (0, Xr.reportMissingProp)(t, g), e.else();
    }
    function f() {
      e.forOf("prop", n, (g) => {
        t.setParams({ missingProperty: g }), e.if((0, Xr.noPropertyInData)(e, s, g, i.ownProperties), () => t.error());
      });
    }
    function w(g, y) {
      t.setParams({ missingProperty: g }), e.forOf(g, n, () => {
        e.assign(y, (0, Xr.propertyInData)(e, s, g, i.ownProperties)), e.if((0, cn.not)(y), () => {
          t.error(), e.break();
        });
      }, cn.nil);
    }
  }
};
co.default = $m;
var lo = {};
Object.defineProperty(lo, "__esModule", { value: !0 });
const ln = Z, vm = {
  message({ keyword: t, schemaCode: e }) {
    const r = t === "maxItems" ? "more" : "fewer";
    return (0, ln.str)`must NOT have ${r} than ${e} items`;
  },
  params: ({ schemaCode: t }) => (0, ln._)`{limit: ${t}}`
}, _m = {
  keyword: ["maxItems", "minItems"],
  type: "array",
  schemaType: "number",
  $data: !0,
  error: vm,
  code(t) {
    const { keyword: e, data: r, schemaCode: n } = t, s = e === "maxItems" ? ln.operators.GT : ln.operators.LT;
    t.fail$data((0, ln._)`${r}.length ${s} ${n}`);
  }
};
lo.default = _m;
var uo = {}, bn = {};
Object.defineProperty(bn, "__esModule", { value: !0 });
const Pu = bs;
Pu.code = 'require("ajv/dist/runtime/equal").default';
bn.default = Pu;
Object.defineProperty(uo, "__esModule", { value: !0 });
const Ws = $e, be = Z, wm = D, Em = bn, bm = {
  message: ({ params: { i: t, j: e } }) => (0, be.str)`must NOT have duplicate items (items ## ${e} and ${t} are identical)`,
  params: ({ params: { i: t, j: e } }) => (0, be._)`{i: ${t}, j: ${e}}`
}, Sm = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: !0,
  error: bm,
  code(t) {
    const { gen: e, data: r, $data: n, schema: s, parentSchema: a, schemaCode: o, it: i } = t;
    if (!n && !s)
      return;
    const c = e.let("valid"), l = a.items ? (0, Ws.getSchemaTypes)(a.items) : [];
    t.block$data(c, d, (0, be._)`${o} === false`), t.ok(c);
    function d() {
      const y = e.let("i", (0, be._)`${r}.length`), v = e.let("j");
      t.setParams({ i: y, j: v }), e.assign(c, !0), e.if((0, be._)`${y} > 1`, () => (f() ? w : g)(y, v));
    }
    function f() {
      return l.length > 0 && !l.some((y) => y === "object" || y === "array");
    }
    function w(y, v) {
      const $ = e.name("item"), p = (0, Ws.checkDataTypes)(l, $, i.opts.strictNumbers, Ws.DataType.Wrong), E = e.const("indices", (0, be._)`{}`);
      e.for((0, be._)`;${y}--;`, () => {
        e.let($, (0, be._)`${r}[${y}]`), e.if(p, (0, be._)`continue`), l.length > 1 && e.if((0, be._)`typeof ${$} == "string"`, (0, be._)`${$} += "_"`), e.if((0, be._)`typeof ${E}[${$}] == "number"`, () => {
          e.assign(v, (0, be._)`${E}[${$}]`), t.error(), e.assign(c, !1).break();
        }).code((0, be._)`${E}[${$}] = ${y}`);
      });
    }
    function g(y, v) {
      const $ = (0, wm.useFunc)(e, Em.default), p = e.name("outer");
      e.label(p).for((0, be._)`;${y}--;`, () => e.for((0, be._)`${v} = ${y}; ${v}--;`, () => e.if((0, be._)`${$}(${r}[${y}], ${r}[${v}])`, () => {
        t.error(), e.assign(c, !1).break(p);
      })));
    }
  }
};
uo.default = Sm;
var fo = {};
Object.defineProperty(fo, "__esModule", { value: !0 });
const _a = Z, Pm = D, Om = bn, Nm = {
  message: "must be equal to constant",
  params: ({ schemaCode: t }) => (0, _a._)`{allowedValue: ${t}}`
}, Rm = {
  keyword: "const",
  $data: !0,
  error: Nm,
  code(t) {
    const { gen: e, data: r, $data: n, schemaCode: s, schema: a } = t;
    n || a && typeof a == "object" ? t.fail$data((0, _a._)`!${(0, Pm.useFunc)(e, Om.default)}(${r}, ${s})`) : t.fail((0, _a._)`${a} !== ${r}`);
  }
};
fo.default = Rm;
var ho = {};
Object.defineProperty(ho, "__esModule", { value: !0 });
const rn = Z, jm = D, Tm = bn, Im = {
  message: "must be equal to one of the allowed values",
  params: ({ schemaCode: t }) => (0, rn._)`{allowedValues: ${t}}`
}, km = {
  keyword: "enum",
  schemaType: "array",
  $data: !0,
  error: Im,
  code(t) {
    const { gen: e, data: r, $data: n, schema: s, schemaCode: a, it: o } = t;
    if (!n && s.length === 0)
      throw new Error("enum must have non-empty array");
    const i = s.length >= o.opts.loopEnum;
    let c;
    const l = () => c ?? (c = (0, jm.useFunc)(e, Tm.default));
    let d;
    if (i || n)
      d = e.let("valid"), t.block$data(d, f);
    else {
      if (!Array.isArray(s))
        throw new Error("ajv implementation error");
      const g = e.const("vSchema", a);
      d = (0, rn.or)(...s.map((y, v) => w(g, v)));
    }
    t.pass(d);
    function f() {
      e.assign(d, !1), e.forOf("v", a, (g) => e.if((0, rn._)`${l()}(${r}, ${g})`, () => e.assign(d, !0).break()));
    }
    function w(g, y) {
      const v = s[y];
      return typeof v == "object" && v !== null ? (0, rn._)`${l()}(${r}, ${g}[${y}])` : (0, rn._)`${r} === ${v}`;
    }
  }
};
ho.default = km;
Object.defineProperty(to, "__esModule", { value: !0 });
const Cm = ro, Am = no, Dm = so, Lm = oo, Mm = io, Vm = co, Fm = lo, zm = uo, Um = fo, Km = ho, qm = [
  // number
  Cm.default,
  Am.default,
  // string
  Dm.default,
  Lm.default,
  // object
  Mm.default,
  Vm.default,
  // array
  Fm.default,
  zm.default,
  // any
  { keyword: "type", schemaType: ["string", "array"] },
  { keyword: "nullable", schemaType: "boolean" },
  Um.default,
  Km.default
];
to.default = qm;
var po = {}, Vr = {};
Object.defineProperty(Vr, "__esModule", { value: !0 });
Vr.validateAdditionalItems = void 0;
const ir = Z, wa = D, xm = {
  message: ({ params: { len: t } }) => (0, ir.str)`must NOT have more than ${t} items`,
  params: ({ params: { len: t } }) => (0, ir._)`{limit: ${t}}`
}, Gm = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: xm,
  code(t) {
    const { parentSchema: e, it: r } = t, { items: n } = e;
    if (!Array.isArray(n)) {
      (0, wa.checkStrictMode)(r, '"additionalItems" is ignored when "items" is not an array of schemas');
      return;
    }
    Ou(t, n);
  }
};
function Ou(t, e) {
  const { gen: r, schema: n, data: s, keyword: a, it: o } = t;
  o.items = !0;
  const i = r.const("len", (0, ir._)`${s}.length`);
  if (n === !1)
    t.setParams({ len: e.length }), t.pass((0, ir._)`${i} <= ${e.length}`);
  else if (typeof n == "object" && !(0, wa.alwaysValidSchema)(o, n)) {
    const l = r.var("valid", (0, ir._)`${i} <= ${e.length}`);
    r.if((0, ir.not)(l), () => c(l)), t.ok(l);
  }
  function c(l) {
    r.forRange("i", e.length, i, (d) => {
      t.subschema({ keyword: a, dataProp: d, dataPropType: wa.Type.Num }, l), o.allErrors || r.if((0, ir.not)(l), () => r.break());
    });
  }
}
Vr.validateAdditionalItems = Ou;
Vr.default = Gm;
var mo = {}, Fr = {};
Object.defineProperty(Fr, "__esModule", { value: !0 });
Fr.validateTuple = void 0;
const rc = Z, es = D, Hm = se, Jm = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(t) {
    const { schema: e, it: r } = t;
    if (Array.isArray(e))
      return Nu(t, "additionalItems", e);
    r.items = !0, !(0, es.alwaysValidSchema)(r, e) && t.ok((0, Hm.validateArray)(t));
  }
};
function Nu(t, e, r = t.schema) {
  const { gen: n, parentSchema: s, data: a, keyword: o, it: i } = t;
  d(s), i.opts.unevaluated && r.length && i.items !== !0 && (i.items = es.mergeEvaluated.items(n, r.length, i.items));
  const c = n.name("valid"), l = n.const("len", (0, rc._)`${a}.length`);
  r.forEach((f, w) => {
    (0, es.alwaysValidSchema)(i, f) || (n.if((0, rc._)`${l} > ${w}`, () => t.subschema({
      keyword: o,
      schemaProp: w,
      dataProp: w
    }, c)), t.ok(c));
  });
  function d(f) {
    const { opts: w, errSchemaPath: g } = i, y = r.length, v = y === f.minItems && (y === f.maxItems || f[e] === !1);
    if (w.strictTuples && !v) {
      const $ = `"${o}" is ${y}-tuple, but minItems or maxItems/${e} are not specified or different at path "${g}"`;
      (0, es.checkStrictMode)(i, $, w.strictTuples);
    }
  }
}
Fr.validateTuple = Nu;
Fr.default = Jm;
Object.defineProperty(mo, "__esModule", { value: !0 });
const Bm = Fr, Wm = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (t) => (0, Bm.validateTuple)(t, "items")
};
mo.default = Wm;
var go = {};
Object.defineProperty(go, "__esModule", { value: !0 });
const nc = Z, Xm = D, Ym = se, Qm = Vr, Zm = {
  message: ({ params: { len: t } }) => (0, nc.str)`must NOT have more than ${t} items`,
  params: ({ params: { len: t } }) => (0, nc._)`{limit: ${t}}`
}, eg = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  error: Zm,
  code(t) {
    const { schema: e, parentSchema: r, it: n } = t, { prefixItems: s } = r;
    n.items = !0, !(0, Xm.alwaysValidSchema)(n, e) && (s ? (0, Qm.validateAdditionalItems)(t, s) : t.ok((0, Ym.validateArray)(t)));
  }
};
go.default = eg;
var yo = {};
Object.defineProperty(yo, "__esModule", { value: !0 });
const He = Z, kn = D, tg = {
  message: ({ params: { min: t, max: e } }) => e === void 0 ? (0, He.str)`must contain at least ${t} valid item(s)` : (0, He.str)`must contain at least ${t} and no more than ${e} valid item(s)`,
  params: ({ params: { min: t, max: e } }) => e === void 0 ? (0, He._)`{minContains: ${t}}` : (0, He._)`{minContains: ${t}, maxContains: ${e}}`
}, rg = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: tg,
  code(t) {
    const { gen: e, schema: r, parentSchema: n, data: s, it: a } = t;
    let o, i;
    const { minContains: c, maxContains: l } = n;
    a.opts.next ? (o = c === void 0 ? 1 : c, i = l) : o = 1;
    const d = e.const("len", (0, He._)`${s}.length`);
    if (t.setParams({ min: o, max: i }), i === void 0 && o === 0) {
      (0, kn.checkStrictMode)(a, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
      return;
    }
    if (i !== void 0 && o > i) {
      (0, kn.checkStrictMode)(a, '"minContains" > "maxContains" is always invalid'), t.fail();
      return;
    }
    if ((0, kn.alwaysValidSchema)(a, r)) {
      let v = (0, He._)`${d} >= ${o}`;
      i !== void 0 && (v = (0, He._)`${v} && ${d} <= ${i}`), t.pass(v);
      return;
    }
    a.items = !0;
    const f = e.name("valid");
    i === void 0 && o === 1 ? g(f, () => e.if(f, () => e.break())) : o === 0 ? (e.let(f, !0), i !== void 0 && e.if((0, He._)`${s}.length > 0`, w)) : (e.let(f, !1), w()), t.result(f, () => t.reset());
    function w() {
      const v = e.name("_valid"), $ = e.let("count", 0);
      g(v, () => e.if(v, () => y($)));
    }
    function g(v, $) {
      e.forRange("i", 0, d, (p) => {
        t.subschema({
          keyword: "contains",
          dataProp: p,
          dataPropType: kn.Type.Num,
          compositeRule: !0
        }, v), $();
      });
    }
    function y(v) {
      e.code((0, He._)`${v}++`), i === void 0 ? e.if((0, He._)`${v} >= ${o}`, () => e.assign(f, !0).break()) : (e.if((0, He._)`${v} > ${i}`, () => e.assign(f, !1).break()), o === 1 ? e.assign(f, !0) : e.if((0, He._)`${v} >= ${o}`, () => e.assign(f, !0)));
    }
  }
};
yo.default = rg;
var Ns = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.validateSchemaDeps = t.validatePropertyDeps = t.error = void 0;
  const e = Z, r = D, n = se;
  t.error = {
    message: ({ params: { property: c, depsCount: l, deps: d } }) => {
      const f = l === 1 ? "property" : "properties";
      return (0, e.str)`must have ${f} ${d} when property ${c} is present`;
    },
    params: ({ params: { property: c, depsCount: l, deps: d, missingProperty: f } }) => (0, e._)`{property: ${c},
    missingProperty: ${f},
    depsCount: ${l},
    deps: ${d}}`
    // TODO change to reference
  };
  const s = {
    keyword: "dependencies",
    type: "object",
    schemaType: "object",
    error: t.error,
    code(c) {
      const [l, d] = a(c);
      o(c, l), i(c, d);
    }
  };
  function a({ schema: c }) {
    const l = {}, d = {};
    for (const f in c) {
      if (f === "__proto__")
        continue;
      const w = Array.isArray(c[f]) ? l : d;
      w[f] = c[f];
    }
    return [l, d];
  }
  function o(c, l = c.schema) {
    const { gen: d, data: f, it: w } = c;
    if (Object.keys(l).length === 0)
      return;
    const g = d.let("missing");
    for (const y in l) {
      const v = l[y];
      if (v.length === 0)
        continue;
      const $ = (0, n.propertyInData)(d, f, y, w.opts.ownProperties);
      c.setParams({
        property: y,
        depsCount: v.length,
        deps: v.join(", ")
      }), w.allErrors ? d.if($, () => {
        for (const p of v)
          (0, n.checkReportMissingProp)(c, p);
      }) : (d.if((0, e._)`${$} && (${(0, n.checkMissingProp)(c, v, g)})`), (0, n.reportMissingProp)(c, g), d.else());
    }
  }
  t.validatePropertyDeps = o;
  function i(c, l = c.schema) {
    const { gen: d, data: f, keyword: w, it: g } = c, y = d.name("valid");
    for (const v in l)
      (0, r.alwaysValidSchema)(g, l[v]) || (d.if(
        (0, n.propertyInData)(d, f, v, g.opts.ownProperties),
        () => {
          const $ = c.subschema({ keyword: w, schemaProp: v }, y);
          c.mergeValidEvaluated($, y);
        },
        () => d.var(y, !0)
        // TODO var
      ), c.ok(y));
  }
  t.validateSchemaDeps = i, t.default = s;
})(Ns);
var $o = {};
Object.defineProperty($o, "__esModule", { value: !0 });
const Ru = Z, ng = D, sg = {
  message: "property name must be valid",
  params: ({ params: t }) => (0, Ru._)`{propertyName: ${t.propertyName}}`
}, ag = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: sg,
  code(t) {
    const { gen: e, schema: r, data: n, it: s } = t;
    if ((0, ng.alwaysValidSchema)(s, r))
      return;
    const a = e.name("valid");
    e.forIn("key", n, (o) => {
      t.setParams({ propertyName: o }), t.subschema({
        keyword: "propertyNames",
        data: o,
        dataTypes: ["string"],
        propertyName: o,
        compositeRule: !0
      }, a), e.if((0, Ru.not)(a), () => {
        t.error(!0), s.allErrors || e.break();
      });
    }), t.ok(a);
  }
};
$o.default = ag;
var Rs = {};
Object.defineProperty(Rs, "__esModule", { value: !0 });
const Cn = se, Ye = Z, og = xe, An = D, ig = {
  message: "must NOT have additional properties",
  params: ({ params: t }) => (0, Ye._)`{additionalProperty: ${t.additionalProperty}}`
}, cg = {
  keyword: "additionalProperties",
  type: ["object"],
  schemaType: ["boolean", "object"],
  allowUndefined: !0,
  trackErrors: !0,
  error: ig,
  code(t) {
    const { gen: e, schema: r, parentSchema: n, data: s, errsCount: a, it: o } = t;
    if (!a)
      throw new Error("ajv implementation error");
    const { allErrors: i, opts: c } = o;
    if (o.props = !0, c.removeAdditional !== "all" && (0, An.alwaysValidSchema)(o, r))
      return;
    const l = (0, Cn.allSchemaProperties)(n.properties), d = (0, Cn.allSchemaProperties)(n.patternProperties);
    f(), t.ok((0, Ye._)`${a} === ${og.default.errors}`);
    function f() {
      e.forIn("key", s, ($) => {
        !l.length && !d.length ? y($) : e.if(w($), () => y($));
      });
    }
    function w($) {
      let p;
      if (l.length > 8) {
        const E = (0, An.schemaRefOrVal)(o, n.properties, "properties");
        p = (0, Cn.isOwnProperty)(e, E, $);
      } else l.length ? p = (0, Ye.or)(...l.map((E) => (0, Ye._)`${$} === ${E}`)) : p = Ye.nil;
      return d.length && (p = (0, Ye.or)(p, ...d.map((E) => (0, Ye._)`${(0, Cn.usePattern)(t, E)}.test(${$})`))), (0, Ye.not)(p);
    }
    function g($) {
      e.code((0, Ye._)`delete ${s}[${$}]`);
    }
    function y($) {
      if (c.removeAdditional === "all" || c.removeAdditional && r === !1) {
        g($);
        return;
      }
      if (r === !1) {
        t.setParams({ additionalProperty: $ }), t.error(), i || e.break();
        return;
      }
      if (typeof r == "object" && !(0, An.alwaysValidSchema)(o, r)) {
        const p = e.name("valid");
        c.removeAdditional === "failing" ? (v($, p, !1), e.if((0, Ye.not)(p), () => {
          t.reset(), g($);
        })) : (v($, p), i || e.if((0, Ye.not)(p), () => e.break()));
      }
    }
    function v($, p, E) {
      const P = {
        keyword: "additionalProperties",
        dataProp: $,
        dataPropType: An.Type.Str
      };
      E === !1 && Object.assign(P, {
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }), t.subschema(P, p);
    }
  }
};
Rs.default = cg;
var vo = {};
Object.defineProperty(vo, "__esModule", { value: !0 });
const lg = rt, sc = se, Xs = D, ac = Rs, ug = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(t) {
    const { gen: e, schema: r, parentSchema: n, data: s, it: a } = t;
    a.opts.removeAdditional === "all" && n.additionalProperties === void 0 && ac.default.code(new lg.KeywordCxt(a, ac.default, "additionalProperties"));
    const o = (0, sc.allSchemaProperties)(r);
    for (const f of o)
      a.definedProperties.add(f);
    a.opts.unevaluated && o.length && a.props !== !0 && (a.props = Xs.mergeEvaluated.props(e, (0, Xs.toHash)(o), a.props));
    const i = o.filter((f) => !(0, Xs.alwaysValidSchema)(a, r[f]));
    if (i.length === 0)
      return;
    const c = e.name("valid");
    for (const f of i)
      l(f) ? d(f) : (e.if((0, sc.propertyInData)(e, s, f, a.opts.ownProperties)), d(f), a.allErrors || e.else().var(c, !0), e.endIf()), t.it.definedProperties.add(f), t.ok(c);
    function l(f) {
      return a.opts.useDefaults && !a.compositeRule && r[f].default !== void 0;
    }
    function d(f) {
      t.subschema({
        keyword: "properties",
        schemaProp: f,
        dataProp: f
      }, c);
    }
  }
};
vo.default = ug;
var _o = {};
Object.defineProperty(_o, "__esModule", { value: !0 });
const oc = se, Dn = Z, ic = D, cc = D, dg = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(t) {
    const { gen: e, schema: r, data: n, parentSchema: s, it: a } = t, { opts: o } = a, i = (0, oc.allSchemaProperties)(r), c = i.filter((v) => (0, ic.alwaysValidSchema)(a, r[v]));
    if (i.length === 0 || c.length === i.length && (!a.opts.unevaluated || a.props === !0))
      return;
    const l = o.strictSchema && !o.allowMatchingProperties && s.properties, d = e.name("valid");
    a.props !== !0 && !(a.props instanceof Dn.Name) && (a.props = (0, cc.evaluatedPropsToName)(e, a.props));
    const { props: f } = a;
    w();
    function w() {
      for (const v of i)
        l && g(v), a.allErrors ? y(v) : (e.var(d, !0), y(v), e.if(d));
    }
    function g(v) {
      for (const $ in l)
        new RegExp(v).test($) && (0, ic.checkStrictMode)(a, `property ${$} matches pattern ${v} (use allowMatchingProperties)`);
    }
    function y(v) {
      e.forIn("key", n, ($) => {
        e.if((0, Dn._)`${(0, oc.usePattern)(t, v)}.test(${$})`, () => {
          const p = c.includes(v);
          p || t.subschema({
            keyword: "patternProperties",
            schemaProp: v,
            dataProp: $,
            dataPropType: cc.Type.Str
          }, d), a.opts.unevaluated && f !== !0 ? e.assign((0, Dn._)`${f}[${$}]`, !0) : !p && !a.allErrors && e.if((0, Dn.not)(d), () => e.break());
        });
      });
    }
  }
};
_o.default = dg;
var wo = {};
Object.defineProperty(wo, "__esModule", { value: !0 });
const fg = D, hg = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  code(t) {
    const { gen: e, schema: r, it: n } = t;
    if ((0, fg.alwaysValidSchema)(n, r)) {
      t.fail();
      return;
    }
    const s = e.name("valid");
    t.subschema({
      keyword: "not",
      compositeRule: !0,
      createErrors: !1,
      allErrors: !1
    }, s), t.failResult(s, () => t.reset(), () => t.error());
  },
  error: { message: "must NOT be valid" }
};
wo.default = hg;
var Eo = {};
Object.defineProperty(Eo, "__esModule", { value: !0 });
const pg = se, mg = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: !0,
  code: pg.validateUnion,
  error: { message: "must match a schema in anyOf" }
};
Eo.default = mg;
var bo = {};
Object.defineProperty(bo, "__esModule", { value: !0 });
const ts = Z, gg = D, yg = {
  message: "must match exactly one schema in oneOf",
  params: ({ params: t }) => (0, ts._)`{passingSchemas: ${t.passing}}`
}, $g = {
  keyword: "oneOf",
  schemaType: "array",
  trackErrors: !0,
  error: yg,
  code(t) {
    const { gen: e, schema: r, parentSchema: n, it: s } = t;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    if (s.opts.discriminator && n.discriminator)
      return;
    const a = r, o = e.let("valid", !1), i = e.let("passing", null), c = e.name("_valid");
    t.setParams({ passing: i }), e.block(l), t.result(o, () => t.reset(), () => t.error(!0));
    function l() {
      a.forEach((d, f) => {
        let w;
        (0, gg.alwaysValidSchema)(s, d) ? e.var(c, !0) : w = t.subschema({
          keyword: "oneOf",
          schemaProp: f,
          compositeRule: !0
        }, c), f > 0 && e.if((0, ts._)`${c} && ${o}`).assign(o, !1).assign(i, (0, ts._)`[${i}, ${f}]`).else(), e.if(c, () => {
          e.assign(o, !0), e.assign(i, f), w && t.mergeEvaluated(w, ts.Name);
        });
      });
    }
  }
};
bo.default = $g;
var So = {};
Object.defineProperty(So, "__esModule", { value: !0 });
const vg = D, _g = {
  keyword: "allOf",
  schemaType: "array",
  code(t) {
    const { gen: e, schema: r, it: n } = t;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    const s = e.name("valid");
    r.forEach((a, o) => {
      if ((0, vg.alwaysValidSchema)(n, a))
        return;
      const i = t.subschema({ keyword: "allOf", schemaProp: o }, s);
      t.ok(s), t.mergeEvaluated(i);
    });
  }
};
So.default = _g;
var Po = {};
Object.defineProperty(Po, "__esModule", { value: !0 });
const fs = Z, ju = D, wg = {
  message: ({ params: t }) => (0, fs.str)`must match "${t.ifClause}" schema`,
  params: ({ params: t }) => (0, fs._)`{failingKeyword: ${t.ifClause}}`
}, Eg = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: wg,
  code(t) {
    const { gen: e, parentSchema: r, it: n } = t;
    r.then === void 0 && r.else === void 0 && (0, ju.checkStrictMode)(n, '"if" without "then" and "else" is ignored');
    const s = lc(n, "then"), a = lc(n, "else");
    if (!s && !a)
      return;
    const o = e.let("valid", !0), i = e.name("_valid");
    if (c(), t.reset(), s && a) {
      const d = e.let("ifClause");
      t.setParams({ ifClause: d }), e.if(i, l("then", d), l("else", d));
    } else s ? e.if(i, l("then")) : e.if((0, fs.not)(i), l("else"));
    t.pass(o, () => t.error(!0));
    function c() {
      const d = t.subschema({
        keyword: "if",
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }, i);
      t.mergeEvaluated(d);
    }
    function l(d, f) {
      return () => {
        const w = t.subschema({ keyword: d }, i);
        e.assign(o, i), t.mergeValidEvaluated(w, o), f ? e.assign(f, (0, fs._)`${d}`) : t.setParams({ ifClause: d });
      };
    }
  }
};
function lc(t, e) {
  const r = t.schema[e];
  return r !== void 0 && !(0, ju.alwaysValidSchema)(t, r);
}
Po.default = Eg;
var Oo = {};
Object.defineProperty(Oo, "__esModule", { value: !0 });
const bg = D, Sg = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: t, parentSchema: e, it: r }) {
    e.if === void 0 && (0, bg.checkStrictMode)(r, `"${t}" without "if" is ignored`);
  }
};
Oo.default = Sg;
Object.defineProperty(po, "__esModule", { value: !0 });
const Pg = Vr, Og = mo, Ng = Fr, Rg = go, jg = yo, Tg = Ns, Ig = $o, kg = Rs, Cg = vo, Ag = _o, Dg = wo, Lg = Eo, Mg = bo, Vg = So, Fg = Po, zg = Oo;
function Ug(t = !1) {
  const e = [
    // any
    Dg.default,
    Lg.default,
    Mg.default,
    Vg.default,
    Fg.default,
    zg.default,
    // object
    Ig.default,
    kg.default,
    Tg.default,
    Cg.default,
    Ag.default
  ];
  return t ? e.push(Og.default, Rg.default) : e.push(Pg.default, Ng.default), e.push(jg.default), e;
}
po.default = Ug;
var No = {}, zr = {};
Object.defineProperty(zr, "__esModule", { value: !0 });
zr.dynamicAnchor = void 0;
const Ys = Z, Kg = xe, uc = De, qg = St, xg = {
  keyword: "$dynamicAnchor",
  schemaType: "string",
  code: (t) => Tu(t, t.schema)
};
function Tu(t, e) {
  const { gen: r, it: n } = t;
  n.schemaEnv.root.dynamicAnchors[e] = !0;
  const s = (0, Ys._)`${Kg.default.dynamicAnchors}${(0, Ys.getProperty)(e)}`, a = n.errSchemaPath === "#" ? n.validateName : Gg(t);
  r.if((0, Ys._)`!${s}`, () => r.assign(s, a));
}
zr.dynamicAnchor = Tu;
function Gg(t) {
  const { schemaEnv: e, schema: r, self: n } = t.it, { root: s, baseId: a, localRefs: o, meta: i } = e.root, { schemaId: c } = n.opts, l = new uc.SchemaEnv({ schema: r, schemaId: c, root: s, baseId: a, localRefs: o, meta: i });
  return uc.compileSchema.call(n, l), (0, qg.getValidate)(t, l);
}
zr.default = xg;
var Ur = {};
Object.defineProperty(Ur, "__esModule", { value: !0 });
Ur.dynamicRef = void 0;
const dc = Z, Hg = xe, fc = St, Jg = {
  keyword: "$dynamicRef",
  schemaType: "string",
  code: (t) => Iu(t, t.schema)
};
function Iu(t, e) {
  const { gen: r, keyword: n, it: s } = t;
  if (e[0] !== "#")
    throw new Error(`"${n}" only supports hash fragment reference`);
  const a = e.slice(1);
  if (s.allErrors)
    o();
  else {
    const c = r.let("valid", !1);
    o(c), t.ok(c);
  }
  function o(c) {
    if (s.schemaEnv.root.dynamicAnchors[a]) {
      const l = r.let("_v", (0, dc._)`${Hg.default.dynamicAnchors}${(0, dc.getProperty)(a)}`);
      r.if(l, i(l, c), i(s.validateName, c));
    } else
      i(s.validateName, c)();
  }
  function i(c, l) {
    return l ? () => r.block(() => {
      (0, fc.callRef)(t, c), r.let(l, !0);
    }) : () => (0, fc.callRef)(t, c);
  }
}
Ur.dynamicRef = Iu;
Ur.default = Jg;
var Ro = {};
Object.defineProperty(Ro, "__esModule", { value: !0 });
const Bg = zr, Wg = D, Xg = {
  keyword: "$recursiveAnchor",
  schemaType: "boolean",
  code(t) {
    t.schema ? (0, Bg.dynamicAnchor)(t, "") : (0, Wg.checkStrictMode)(t.it, "$recursiveAnchor: false is ignored");
  }
};
Ro.default = Xg;
var jo = {};
Object.defineProperty(jo, "__esModule", { value: !0 });
const Yg = Ur, Qg = {
  keyword: "$recursiveRef",
  schemaType: "string",
  code: (t) => (0, Yg.dynamicRef)(t, t.schema)
};
jo.default = Qg;
Object.defineProperty(No, "__esModule", { value: !0 });
const Zg = zr, ey = Ur, ty = Ro, ry = jo, ny = [Zg.default, ey.default, ty.default, ry.default];
No.default = ny;
var To = {}, Io = {};
Object.defineProperty(Io, "__esModule", { value: !0 });
const hc = Ns, sy = {
  keyword: "dependentRequired",
  type: "object",
  schemaType: "object",
  error: hc.error,
  code: (t) => (0, hc.validatePropertyDeps)(t)
};
Io.default = sy;
var ko = {};
Object.defineProperty(ko, "__esModule", { value: !0 });
const ay = Ns, oy = {
  keyword: "dependentSchemas",
  type: "object",
  schemaType: "object",
  code: (t) => (0, ay.validateSchemaDeps)(t)
};
ko.default = oy;
var Co = {};
Object.defineProperty(Co, "__esModule", { value: !0 });
const iy = D, cy = {
  keyword: ["maxContains", "minContains"],
  type: "array",
  schemaType: "number",
  code({ keyword: t, parentSchema: e, it: r }) {
    e.contains === void 0 && (0, iy.checkStrictMode)(r, `"${t}" without "contains" is ignored`);
  }
};
Co.default = cy;
Object.defineProperty(To, "__esModule", { value: !0 });
const ly = Io, uy = ko, dy = Co, fy = [ly.default, uy.default, dy.default];
To.default = fy;
var Ao = {}, Do = {};
Object.defineProperty(Do, "__esModule", { value: !0 });
const Ct = Z, pc = D, hy = xe, py = {
  message: "must NOT have unevaluated properties",
  params: ({ params: t }) => (0, Ct._)`{unevaluatedProperty: ${t.unevaluatedProperty}}`
}, my = {
  keyword: "unevaluatedProperties",
  type: "object",
  schemaType: ["boolean", "object"],
  trackErrors: !0,
  error: py,
  code(t) {
    const { gen: e, schema: r, data: n, errsCount: s, it: a } = t;
    if (!s)
      throw new Error("ajv implementation error");
    const { allErrors: o, props: i } = a;
    i instanceof Ct.Name ? e.if((0, Ct._)`${i} !== true`, () => e.forIn("key", n, (f) => e.if(l(i, f), () => c(f)))) : i !== !0 && e.forIn("key", n, (f) => i === void 0 ? c(f) : e.if(d(i, f), () => c(f))), a.props = !0, t.ok((0, Ct._)`${s} === ${hy.default.errors}`);
    function c(f) {
      if (r === !1) {
        t.setParams({ unevaluatedProperty: f }), t.error(), o || e.break();
        return;
      }
      if (!(0, pc.alwaysValidSchema)(a, r)) {
        const w = e.name("valid");
        t.subschema({
          keyword: "unevaluatedProperties",
          dataProp: f,
          dataPropType: pc.Type.Str
        }, w), o || e.if((0, Ct.not)(w), () => e.break());
      }
    }
    function l(f, w) {
      return (0, Ct._)`!${f} || !${f}[${w}]`;
    }
    function d(f, w) {
      const g = [];
      for (const y in f)
        f[y] === !0 && g.push((0, Ct._)`${w} !== ${y}`);
      return (0, Ct.and)(...g);
    }
  }
};
Do.default = my;
var Lo = {};
Object.defineProperty(Lo, "__esModule", { value: !0 });
const cr = Z, mc = D, gy = {
  message: ({ params: { len: t } }) => (0, cr.str)`must NOT have more than ${t} items`,
  params: ({ params: { len: t } }) => (0, cr._)`{limit: ${t}}`
}, yy = {
  keyword: "unevaluatedItems",
  type: "array",
  schemaType: ["boolean", "object"],
  error: gy,
  code(t) {
    const { gen: e, schema: r, data: n, it: s } = t, a = s.items || 0;
    if (a === !0)
      return;
    const o = e.const("len", (0, cr._)`${n}.length`);
    if (r === !1)
      t.setParams({ len: a }), t.fail((0, cr._)`${o} > ${a}`);
    else if (typeof r == "object" && !(0, mc.alwaysValidSchema)(s, r)) {
      const c = e.var("valid", (0, cr._)`${o} <= ${a}`);
      e.if((0, cr.not)(c), () => i(c, a)), t.ok(c);
    }
    s.items = !0;
    function i(c, l) {
      e.forRange("i", l, o, (d) => {
        t.subschema({ keyword: "unevaluatedItems", dataProp: d, dataPropType: mc.Type.Num }, c), s.allErrors || e.if((0, cr.not)(c), () => e.break());
      });
    }
  }
};
Lo.default = yy;
Object.defineProperty(Ao, "__esModule", { value: !0 });
const $y = Do, vy = Lo, _y = [$y.default, vy.default];
Ao.default = _y;
var Mo = {}, Vo = {};
Object.defineProperty(Vo, "__esModule", { value: !0 });
const ge = Z, wy = {
  message: ({ schemaCode: t }) => (0, ge.str)`must match format "${t}"`,
  params: ({ schemaCode: t }) => (0, ge._)`{format: ${t}}`
}, Ey = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: wy,
  code(t, e) {
    const { gen: r, data: n, $data: s, schema: a, schemaCode: o, it: i } = t, { opts: c, errSchemaPath: l, schemaEnv: d, self: f } = i;
    if (!c.validateFormats)
      return;
    s ? w() : g();
    function w() {
      const y = r.scopeValue("formats", {
        ref: f.formats,
        code: c.code.formats
      }), v = r.const("fDef", (0, ge._)`${y}[${o}]`), $ = r.let("fType"), p = r.let("format");
      r.if((0, ge._)`typeof ${v} == "object" && !(${v} instanceof RegExp)`, () => r.assign($, (0, ge._)`${v}.type || "string"`).assign(p, (0, ge._)`${v}.validate`), () => r.assign($, (0, ge._)`"string"`).assign(p, v)), t.fail$data((0, ge.or)(E(), P()));
      function E() {
        return c.strictSchema === !1 ? ge.nil : (0, ge._)`${o} && !${p}`;
      }
      function P() {
        const N = d.$async ? (0, ge._)`(${v}.async ? await ${p}(${n}) : ${p}(${n}))` : (0, ge._)`${p}(${n})`, R = (0, ge._)`(typeof ${p} == "function" ? ${N} : ${p}.test(${n}))`;
        return (0, ge._)`${p} && ${p} !== true && ${$} === ${e} && !${R}`;
      }
    }
    function g() {
      const y = f.formats[a];
      if (!y) {
        E();
        return;
      }
      if (y === !0)
        return;
      const [v, $, p] = P(y);
      v === e && t.pass(N());
      function E() {
        if (c.strictSchema === !1) {
          f.logger.warn(R());
          return;
        }
        throw new Error(R());
        function R() {
          return `unknown format "${a}" ignored in schema at path "${l}"`;
        }
      }
      function P(R) {
        const z = R instanceof RegExp ? (0, ge.regexpCode)(R) : c.code.formats ? (0, ge._)`${c.code.formats}${(0, ge.getProperty)(a)}` : void 0, G = r.scopeValue("formats", { key: a, ref: R, code: z });
        return typeof R == "object" && !(R instanceof RegExp) ? [R.type || "string", R.validate, (0, ge._)`${G}.validate`] : ["string", R, G];
      }
      function N() {
        if (typeof y == "object" && !(y instanceof RegExp) && y.async) {
          if (!d.$async)
            throw new Error("async format in sync schema");
          return (0, ge._)`await ${p}(${n})`;
        }
        return typeof $ == "function" ? (0, ge._)`${p}(${n})` : (0, ge._)`${p}.test(${n})`;
      }
    }
  }
};
Vo.default = Ey;
Object.defineProperty(Mo, "__esModule", { value: !0 });
const by = Vo, Sy = [by.default];
Mo.default = Sy;
var Ar = {};
Object.defineProperty(Ar, "__esModule", { value: !0 });
Ar.contentVocabulary = Ar.metadataVocabulary = void 0;
Ar.metadataVocabulary = [
  "title",
  "description",
  "default",
  "deprecated",
  "readOnly",
  "writeOnly",
  "examples"
];
Ar.contentVocabulary = [
  "contentMediaType",
  "contentEncoding",
  "contentSchema"
];
Object.defineProperty(Qa, "__esModule", { value: !0 });
const Py = Za, Oy = to, Ny = po, Ry = No, jy = To, Ty = Ao, Iy = Mo, gc = Ar, ky = [
  Ry.default,
  Py.default,
  Oy.default,
  (0, Ny.default)(!0),
  Iy.default,
  gc.metadataVocabulary,
  gc.contentVocabulary,
  jy.default,
  Ty.default
];
Qa.default = ky;
var Fo = {}, js = {};
Object.defineProperty(js, "__esModule", { value: !0 });
js.DiscrError = void 0;
var yc;
(function(t) {
  t.Tag = "tag", t.Mapping = "mapping";
})(yc || (js.DiscrError = yc = {}));
Object.defineProperty(Fo, "__esModule", { value: !0 });
const Sr = Z, Ea = js, $c = De, Cy = Mr, Ay = D, Dy = {
  message: ({ params: { discrError: t, tagName: e } }) => t === Ea.DiscrError.Tag ? `tag "${e}" must be string` : `value of tag "${e}" must be in oneOf`,
  params: ({ params: { discrError: t, tag: e, tagName: r } }) => (0, Sr._)`{error: ${t}, tag: ${r}, tagValue: ${e}}`
}, Ly = {
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  error: Dy,
  code(t) {
    const { gen: e, data: r, schema: n, parentSchema: s, it: a } = t, { oneOf: o } = s;
    if (!a.opts.discriminator)
      throw new Error("discriminator: requires discriminator option");
    const i = n.propertyName;
    if (typeof i != "string")
      throw new Error("discriminator: requires propertyName");
    if (n.mapping)
      throw new Error("discriminator: mapping is not supported");
    if (!o)
      throw new Error("discriminator: requires oneOf keyword");
    const c = e.let("valid", !1), l = e.const("tag", (0, Sr._)`${r}${(0, Sr.getProperty)(i)}`);
    e.if((0, Sr._)`typeof ${l} == "string"`, () => d(), () => t.error(!1, { discrError: Ea.DiscrError.Tag, tag: l, tagName: i })), t.ok(c);
    function d() {
      const g = w();
      e.if(!1);
      for (const y in g)
        e.elseIf((0, Sr._)`${l} === ${y}`), e.assign(c, f(g[y]));
      e.else(), t.error(!1, { discrError: Ea.DiscrError.Mapping, tag: l, tagName: i }), e.endIf();
    }
    function f(g) {
      const y = e.name("valid"), v = t.subschema({ keyword: "oneOf", schemaProp: g }, y);
      return t.mergeEvaluated(v, Sr.Name), y;
    }
    function w() {
      var g;
      const y = {}, v = p(s);
      let $ = !0;
      for (let N = 0; N < o.length; N++) {
        let R = o[N];
        if (R != null && R.$ref && !(0, Ay.schemaHasRulesButRef)(R, a.self.RULES)) {
          const G = R.$ref;
          if (R = $c.resolveRef.call(a.self, a.schemaEnv.root, a.baseId, G), R instanceof $c.SchemaEnv && (R = R.schema), R === void 0)
            throw new Cy.default(a.opts.uriResolver, a.baseId, G);
        }
        const z = (g = R == null ? void 0 : R.properties) === null || g === void 0 ? void 0 : g[i];
        if (typeof z != "object")
          throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${i}"`);
        $ = $ && (v || p(R)), E(z, N);
      }
      if (!$)
        throw new Error(`discriminator: "${i}" must be required`);
      return y;
      function p({ required: N }) {
        return Array.isArray(N) && N.includes(i);
      }
      function E(N, R) {
        if (N.const)
          P(N.const, R);
        else if (N.enum)
          for (const z of N.enum)
            P(z, R);
        else
          throw new Error(`discriminator: "properties/${i}" must have "const" or "enum"`);
      }
      function P(N, R) {
        if (typeof N != "string" || N in y)
          throw new Error(`discriminator: "${i}" values must be unique strings`);
        y[N] = R;
      }
    }
  }
};
Fo.default = Ly;
var zo = {};
const My = "https://json-schema.org/draft/2020-12/schema", Vy = "https://json-schema.org/draft/2020-12/schema", Fy = {
  "https://json-schema.org/draft/2020-12/vocab/core": !0,
  "https://json-schema.org/draft/2020-12/vocab/applicator": !0,
  "https://json-schema.org/draft/2020-12/vocab/unevaluated": !0,
  "https://json-schema.org/draft/2020-12/vocab/validation": !0,
  "https://json-schema.org/draft/2020-12/vocab/meta-data": !0,
  "https://json-schema.org/draft/2020-12/vocab/format-annotation": !0,
  "https://json-schema.org/draft/2020-12/vocab/content": !0
}, zy = "meta", Uy = "Core and Validation specifications meta-schema", Ky = [
  {
    $ref: "meta/core"
  },
  {
    $ref: "meta/applicator"
  },
  {
    $ref: "meta/unevaluated"
  },
  {
    $ref: "meta/validation"
  },
  {
    $ref: "meta/meta-data"
  },
  {
    $ref: "meta/format-annotation"
  },
  {
    $ref: "meta/content"
  }
], qy = [
  "object",
  "boolean"
], xy = "This meta-schema also defines keywords that have appeared in previous drafts in order to prevent incompatible extensions as they remain in common use.", Gy = {
  definitions: {
    $comment: '"definitions" has been replaced by "$defs".',
    type: "object",
    additionalProperties: {
      $dynamicRef: "#meta"
    },
    deprecated: !0,
    default: {}
  },
  dependencies: {
    $comment: '"dependencies" has been split and replaced by "dependentSchemas" and "dependentRequired" in order to serve their differing semantics.',
    type: "object",
    additionalProperties: {
      anyOf: [
        {
          $dynamicRef: "#meta"
        },
        {
          $ref: "meta/validation#/$defs/stringArray"
        }
      ]
    },
    deprecated: !0,
    default: {}
  },
  $recursiveAnchor: {
    $comment: '"$recursiveAnchor" has been replaced by "$dynamicAnchor".',
    $ref: "meta/core#/$defs/anchorString",
    deprecated: !0
  },
  $recursiveRef: {
    $comment: '"$recursiveRef" has been replaced by "$dynamicRef".',
    $ref: "meta/core#/$defs/uriReferenceString",
    deprecated: !0
  }
}, Hy = {
  $schema: My,
  $id: Vy,
  $vocabulary: Fy,
  $dynamicAnchor: zy,
  title: Uy,
  allOf: Ky,
  type: qy,
  $comment: xy,
  properties: Gy
}, Jy = "https://json-schema.org/draft/2020-12/schema", By = "https://json-schema.org/draft/2020-12/meta/applicator", Wy = {
  "https://json-schema.org/draft/2020-12/vocab/applicator": !0
}, Xy = "meta", Yy = "Applicator vocabulary meta-schema", Qy = [
  "object",
  "boolean"
], Zy = {
  prefixItems: {
    $ref: "#/$defs/schemaArray"
  },
  items: {
    $dynamicRef: "#meta"
  },
  contains: {
    $dynamicRef: "#meta"
  },
  additionalProperties: {
    $dynamicRef: "#meta"
  },
  properties: {
    type: "object",
    additionalProperties: {
      $dynamicRef: "#meta"
    },
    default: {}
  },
  patternProperties: {
    type: "object",
    additionalProperties: {
      $dynamicRef: "#meta"
    },
    propertyNames: {
      format: "regex"
    },
    default: {}
  },
  dependentSchemas: {
    type: "object",
    additionalProperties: {
      $dynamicRef: "#meta"
    },
    default: {}
  },
  propertyNames: {
    $dynamicRef: "#meta"
  },
  if: {
    $dynamicRef: "#meta"
  },
  then: {
    $dynamicRef: "#meta"
  },
  else: {
    $dynamicRef: "#meta"
  },
  allOf: {
    $ref: "#/$defs/schemaArray"
  },
  anyOf: {
    $ref: "#/$defs/schemaArray"
  },
  oneOf: {
    $ref: "#/$defs/schemaArray"
  },
  not: {
    $dynamicRef: "#meta"
  }
}, e$ = {
  schemaArray: {
    type: "array",
    minItems: 1,
    items: {
      $dynamicRef: "#meta"
    }
  }
}, t$ = {
  $schema: Jy,
  $id: By,
  $vocabulary: Wy,
  $dynamicAnchor: Xy,
  title: Yy,
  type: Qy,
  properties: Zy,
  $defs: e$
}, r$ = "https://json-schema.org/draft/2020-12/schema", n$ = "https://json-schema.org/draft/2020-12/meta/unevaluated", s$ = {
  "https://json-schema.org/draft/2020-12/vocab/unevaluated": !0
}, a$ = "meta", o$ = "Unevaluated applicator vocabulary meta-schema", i$ = [
  "object",
  "boolean"
], c$ = {
  unevaluatedItems: {
    $dynamicRef: "#meta"
  },
  unevaluatedProperties: {
    $dynamicRef: "#meta"
  }
}, l$ = {
  $schema: r$,
  $id: n$,
  $vocabulary: s$,
  $dynamicAnchor: a$,
  title: o$,
  type: i$,
  properties: c$
}, u$ = "https://json-schema.org/draft/2020-12/schema", d$ = "https://json-schema.org/draft/2020-12/meta/content", f$ = {
  "https://json-schema.org/draft/2020-12/vocab/content": !0
}, h$ = "meta", p$ = "Content vocabulary meta-schema", m$ = [
  "object",
  "boolean"
], g$ = {
  contentEncoding: {
    type: "string"
  },
  contentMediaType: {
    type: "string"
  },
  contentSchema: {
    $dynamicRef: "#meta"
  }
}, y$ = {
  $schema: u$,
  $id: d$,
  $vocabulary: f$,
  $dynamicAnchor: h$,
  title: p$,
  type: m$,
  properties: g$
}, $$ = "https://json-schema.org/draft/2020-12/schema", v$ = "https://json-schema.org/draft/2020-12/meta/core", _$ = {
  "https://json-schema.org/draft/2020-12/vocab/core": !0
}, w$ = "meta", E$ = "Core vocabulary meta-schema", b$ = [
  "object",
  "boolean"
], S$ = {
  $id: {
    $ref: "#/$defs/uriReferenceString",
    $comment: "Non-empty fragments not allowed.",
    pattern: "^[^#]*#?$"
  },
  $schema: {
    $ref: "#/$defs/uriString"
  },
  $ref: {
    $ref: "#/$defs/uriReferenceString"
  },
  $anchor: {
    $ref: "#/$defs/anchorString"
  },
  $dynamicRef: {
    $ref: "#/$defs/uriReferenceString"
  },
  $dynamicAnchor: {
    $ref: "#/$defs/anchorString"
  },
  $vocabulary: {
    type: "object",
    propertyNames: {
      $ref: "#/$defs/uriString"
    },
    additionalProperties: {
      type: "boolean"
    }
  },
  $comment: {
    type: "string"
  },
  $defs: {
    type: "object",
    additionalProperties: {
      $dynamicRef: "#meta"
    }
  }
}, P$ = {
  anchorString: {
    type: "string",
    pattern: "^[A-Za-z_][-A-Za-z0-9._]*$"
  },
  uriString: {
    type: "string",
    format: "uri"
  },
  uriReferenceString: {
    type: "string",
    format: "uri-reference"
  }
}, O$ = {
  $schema: $$,
  $id: v$,
  $vocabulary: _$,
  $dynamicAnchor: w$,
  title: E$,
  type: b$,
  properties: S$,
  $defs: P$
}, N$ = "https://json-schema.org/draft/2020-12/schema", R$ = "https://json-schema.org/draft/2020-12/meta/format-annotation", j$ = {
  "https://json-schema.org/draft/2020-12/vocab/format-annotation": !0
}, T$ = "meta", I$ = "Format vocabulary meta-schema for annotation results", k$ = [
  "object",
  "boolean"
], C$ = {
  format: {
    type: "string"
  }
}, A$ = {
  $schema: N$,
  $id: R$,
  $vocabulary: j$,
  $dynamicAnchor: T$,
  title: I$,
  type: k$,
  properties: C$
}, D$ = "https://json-schema.org/draft/2020-12/schema", L$ = "https://json-schema.org/draft/2020-12/meta/meta-data", M$ = {
  "https://json-schema.org/draft/2020-12/vocab/meta-data": !0
}, V$ = "meta", F$ = "Meta-data vocabulary meta-schema", z$ = [
  "object",
  "boolean"
], U$ = {
  title: {
    type: "string"
  },
  description: {
    type: "string"
  },
  default: !0,
  deprecated: {
    type: "boolean",
    default: !1
  },
  readOnly: {
    type: "boolean",
    default: !1
  },
  writeOnly: {
    type: "boolean",
    default: !1
  },
  examples: {
    type: "array",
    items: !0
  }
}, K$ = {
  $schema: D$,
  $id: L$,
  $vocabulary: M$,
  $dynamicAnchor: V$,
  title: F$,
  type: z$,
  properties: U$
}, q$ = "https://json-schema.org/draft/2020-12/schema", x$ = "https://json-schema.org/draft/2020-12/meta/validation", G$ = {
  "https://json-schema.org/draft/2020-12/vocab/validation": !0
}, H$ = "meta", J$ = "Validation vocabulary meta-schema", B$ = [
  "object",
  "boolean"
], W$ = {
  type: {
    anyOf: [
      {
        $ref: "#/$defs/simpleTypes"
      },
      {
        type: "array",
        items: {
          $ref: "#/$defs/simpleTypes"
        },
        minItems: 1,
        uniqueItems: !0
      }
    ]
  },
  const: !0,
  enum: {
    type: "array",
    items: !0
  },
  multipleOf: {
    type: "number",
    exclusiveMinimum: 0
  },
  maximum: {
    type: "number"
  },
  exclusiveMaximum: {
    type: "number"
  },
  minimum: {
    type: "number"
  },
  exclusiveMinimum: {
    type: "number"
  },
  maxLength: {
    $ref: "#/$defs/nonNegativeInteger"
  },
  minLength: {
    $ref: "#/$defs/nonNegativeIntegerDefault0"
  },
  pattern: {
    type: "string",
    format: "regex"
  },
  maxItems: {
    $ref: "#/$defs/nonNegativeInteger"
  },
  minItems: {
    $ref: "#/$defs/nonNegativeIntegerDefault0"
  },
  uniqueItems: {
    type: "boolean",
    default: !1
  },
  maxContains: {
    $ref: "#/$defs/nonNegativeInteger"
  },
  minContains: {
    $ref: "#/$defs/nonNegativeInteger",
    default: 1
  },
  maxProperties: {
    $ref: "#/$defs/nonNegativeInteger"
  },
  minProperties: {
    $ref: "#/$defs/nonNegativeIntegerDefault0"
  },
  required: {
    $ref: "#/$defs/stringArray"
  },
  dependentRequired: {
    type: "object",
    additionalProperties: {
      $ref: "#/$defs/stringArray"
    }
  }
}, X$ = {
  nonNegativeInteger: {
    type: "integer",
    minimum: 0
  },
  nonNegativeIntegerDefault0: {
    $ref: "#/$defs/nonNegativeInteger",
    default: 0
  },
  simpleTypes: {
    enum: [
      "array",
      "boolean",
      "integer",
      "null",
      "number",
      "object",
      "string"
    ]
  },
  stringArray: {
    type: "array",
    items: {
      type: "string"
    },
    uniqueItems: !0,
    default: []
  }
}, Y$ = {
  $schema: q$,
  $id: x$,
  $vocabulary: G$,
  $dynamicAnchor: H$,
  title: J$,
  type: B$,
  properties: W$,
  $defs: X$
};
Object.defineProperty(zo, "__esModule", { value: !0 });
const Q$ = Hy, Z$ = t$, e0 = l$, t0 = y$, r0 = O$, n0 = A$, s0 = K$, a0 = Y$, o0 = ["/properties"];
function i0(t) {
  return [
    Q$,
    Z$,
    e0,
    t0,
    r0,
    e(this, n0),
    s0,
    e(this, a0)
  ].forEach((r) => this.addMetaSchema(r, void 0, !1)), this;
  function e(r, n) {
    return t ? r.$dataMetaSchema(n, o0) : n;
  }
}
zo.default = i0;
(function(t, e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.MissingRefError = e.ValidationError = e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = e.Ajv2020 = void 0;
  const r = Cl, n = Qa, s = Fo, a = zo, o = "https://json-schema.org/draft/2020-12/schema";
  class i extends r.default {
    constructor(g = {}) {
      super({
        ...g,
        dynamicRef: !0,
        next: !0,
        unevaluated: !0
      });
    }
    _addVocabularies() {
      super._addVocabularies(), n.default.forEach((g) => this.addVocabulary(g)), this.opts.discriminator && this.addKeyword(s.default);
    }
    _addDefaultMetaSchema() {
      super._addDefaultMetaSchema();
      const { $data: g, meta: y } = this.opts;
      y && (a.default.call(this, g), this.refs["http://json-schema.org/schema"] = o);
    }
    defaultMeta() {
      return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(o) ? o : void 0);
    }
  }
  e.Ajv2020 = i, t.exports = e = i, t.exports.Ajv2020 = i, Object.defineProperty(e, "__esModule", { value: !0 }), e.default = i;
  var c = rt;
  Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
    return c.KeywordCxt;
  } });
  var l = Z;
  Object.defineProperty(e, "_", { enumerable: !0, get: function() {
    return l._;
  } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
    return l.str;
  } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
    return l.stringify;
  } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
    return l.nil;
  } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
    return l.Name;
  } }), Object.defineProperty(e, "CodeGen", { enumerable: !0, get: function() {
    return l.CodeGen;
  } });
  var d = En;
  Object.defineProperty(e, "ValidationError", { enumerable: !0, get: function() {
    return d.default;
  } });
  var f = Mr;
  Object.defineProperty(e, "MissingRefError", { enumerable: !0, get: function() {
    return f.default;
  } });
})(ma, ma.exports);
var c0 = ma.exports, ba = { exports: {} }, ku = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.formatNames = t.fastFormats = t.fullFormats = void 0;
  function e(U, H) {
    return { validate: U, compare: H };
  }
  t.fullFormats = {
    // date: http://tools.ietf.org/html/rfc3339#section-5.6
    date: e(a, o),
    // date-time: http://tools.ietf.org/html/rfc3339#section-5.6
    time: e(c(!0), l),
    "date-time": e(w(!0), g),
    "iso-time": e(c(), d),
    "iso-date-time": e(w(), y),
    // duration: https://tools.ietf.org/html/rfc3339#appendix-A
    duration: /^P(?!$)((\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)?|(\d+W)?)$/,
    uri: p,
    "uri-reference": /^(?:[a-z][a-z0-9+\-.]*:)?(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'"()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?(?:\?(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i,
    // uri-template: https://tools.ietf.org/html/rfc6570
    "uri-template": /^(?:(?:[^\x00-\x20"'<>%\\^`{|}]|%[0-9a-f]{2})|\{[+#./;?&=,!@|]?(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?(?:,(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?)*\})*$/i,
    // For the source: https://gist.github.com/dperini/729294
    // For test cases: https://mathiasbynens.be/demo/url-regex
    url: /^(?:https?|ftp):\/\/(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)(?:\.(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)*(?:\.(?:[a-z\u{00a1}-\u{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/iu,
    email: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
    hostname: /^(?=.{1,253}\.?$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[-0-9a-z]{0,61}[0-9a-z])?)*\.?$/i,
    // optimized https://www.safaribooksonline.com/library/view/regular-expressions-cookbook/9780596802837/ch07s16.html
    ipv4: /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/,
    ipv6: /^((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))$/i,
    regex: ce,
    // uuid: http://tools.ietf.org/html/rfc4122
    uuid: /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i,
    // JSON-pointer: https://tools.ietf.org/html/rfc6901
    // uri fragment: https://tools.ietf.org/html/rfc3986#appendix-A
    "json-pointer": /^(?:\/(?:[^~/]|~0|~1)*)*$/,
    "json-pointer-uri-fragment": /^#(?:\/(?:[a-z0-9_\-.!$&'()*+,;:=@]|%[0-9a-f]{2}|~0|~1)*)*$/i,
    // relative JSON-pointer: http://tools.ietf.org/html/draft-luff-relative-json-pointer-00
    "relative-json-pointer": /^(?:0|[1-9][0-9]*)(?:#|(?:\/(?:[^~/]|~0|~1)*)*)$/,
    // the following formats are used by the openapi specification: https://spec.openapis.org/oas/v3.0.0#data-types
    // byte: https://github.com/miguelmota/is-base64
    byte: P,
    // signed 32 bit integer
    int32: { type: "number", validate: z },
    // signed 64 bit integer
    int64: { type: "number", validate: G },
    // C-type float
    float: { type: "number", validate: ue },
    // C-type double
    double: { type: "number", validate: ue },
    // hint to the UI to hide input strings
    password: !0,
    // unchecked string payload
    binary: !0
  }, t.fastFormats = {
    ...t.fullFormats,
    date: e(/^\d\d\d\d-[0-1]\d-[0-3]\d$/, o),
    time: e(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, l),
    "date-time": e(/^\d\d\d\d-[0-1]\d-[0-3]\dt(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, g),
    "iso-time": e(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, d),
    "iso-date-time": e(/^\d\d\d\d-[0-1]\d-[0-3]\d[t\s](?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, y),
    // uri: https://github.com/mafintosh/is-my-json-valid/blob/master/formats.js
    uri: /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/)?[^\s]*$/i,
    "uri-reference": /^(?:(?:[a-z][a-z0-9+\-.]*:)?\/?\/)?(?:[^\\\s#][^\s#]*)?(?:#[^\\\s]*)?$/i,
    // email (sources from jsen validator):
    // http://stackoverflow.com/questions/201323/using-a-regular-expression-to-validate-an-email-address#answer-8829363
    // http://www.w3.org/TR/html5/forms.html#valid-e-mail-address (search for 'wilful violation')
    email: /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i
  }, t.formatNames = Object.keys(t.fullFormats);
  function r(U) {
    return U % 4 === 0 && (U % 100 !== 0 || U % 400 === 0);
  }
  const n = /^(\d\d\d\d)-(\d\d)-(\d\d)$/, s = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  function a(U) {
    const H = n.exec(U);
    if (!H)
      return !1;
    const X = +H[1], j = +H[2], k = +H[3];
    return j >= 1 && j <= 12 && k >= 1 && k <= (j === 2 && r(X) ? 29 : s[j]);
  }
  function o(U, H) {
    if (U && H)
      return U > H ? 1 : U < H ? -1 : 0;
  }
  const i = /^(\d\d):(\d\d):(\d\d(?:\.\d+)?)(z|([+-])(\d\d)(?::?(\d\d))?)?$/i;
  function c(U) {
    return function(X) {
      const j = i.exec(X);
      if (!j)
        return !1;
      const k = +j[1], A = +j[2], C = +j[3], V = j[4], L = j[5] === "-" ? -1 : 1, O = +(j[6] || 0), m = +(j[7] || 0);
      if (O > 23 || m > 59 || U && !V)
        return !1;
      if (k <= 23 && A <= 59 && C < 60)
        return !0;
      const b = A - m * L, _ = k - O * L - (b < 0 ? 1 : 0);
      return (_ === 23 || _ === -1) && (b === 59 || b === -1) && C < 61;
    };
  }
  function l(U, H) {
    if (!(U && H))
      return;
    const X = (/* @__PURE__ */ new Date("2020-01-01T" + U)).valueOf(), j = (/* @__PURE__ */ new Date("2020-01-01T" + H)).valueOf();
    if (X && j)
      return X - j;
  }
  function d(U, H) {
    if (!(U && H))
      return;
    const X = i.exec(U), j = i.exec(H);
    if (X && j)
      return U = X[1] + X[2] + X[3], H = j[1] + j[2] + j[3], U > H ? 1 : U < H ? -1 : 0;
  }
  const f = /t|\s/i;
  function w(U) {
    const H = c(U);
    return function(j) {
      const k = j.split(f);
      return k.length === 2 && a(k[0]) && H(k[1]);
    };
  }
  function g(U, H) {
    if (!(U && H))
      return;
    const X = new Date(U).valueOf(), j = new Date(H).valueOf();
    if (X && j)
      return X - j;
  }
  function y(U, H) {
    if (!(U && H))
      return;
    const [X, j] = U.split(f), [k, A] = H.split(f), C = o(X, k);
    if (C !== void 0)
      return C || l(j, A);
  }
  const v = /\/|:/, $ = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
  function p(U) {
    return v.test(U) && $.test(U);
  }
  const E = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/gm;
  function P(U) {
    return E.lastIndex = 0, E.test(U);
  }
  const N = -2147483648, R = 2 ** 31 - 1;
  function z(U) {
    return Number.isInteger(U) && U <= R && U >= N;
  }
  function G(U) {
    return Number.isInteger(U);
  }
  function ue() {
    return !0;
  }
  const ie = /[^\\]\\Z/;
  function ce(U) {
    if (ie.test(U))
      return !1;
    try {
      return new RegExp(U), !0;
    } catch {
      return !1;
    }
  }
})(ku);
var Cu = {}, Sa = { exports: {} }, Au = {}, nt = {}, Dr = {}, Sn = {}, ne = {}, vn = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.regexpCode = t.getEsmExportName = t.getProperty = t.safeStringify = t.stringify = t.strConcat = t.addCodeArg = t.str = t._ = t.nil = t._Code = t.Name = t.IDENTIFIER = t._CodeOrName = void 0;
  class e {
  }
  t._CodeOrName = e, t.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
  class r extends e {
    constructor(E) {
      if (super(), !t.IDENTIFIER.test(E))
        throw new Error("CodeGen: name must be a valid identifier");
      this.str = E;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      return !1;
    }
    get names() {
      return { [this.str]: 1 };
    }
  }
  t.Name = r;
  class n extends e {
    constructor(E) {
      super(), this._items = typeof E == "string" ? [E] : E;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      if (this._items.length > 1)
        return !1;
      const E = this._items[0];
      return E === "" || E === '""';
    }
    get str() {
      var E;
      return (E = this._str) !== null && E !== void 0 ? E : this._str = this._items.reduce((P, N) => `${P}${N}`, "");
    }
    get names() {
      var E;
      return (E = this._names) !== null && E !== void 0 ? E : this._names = this._items.reduce((P, N) => (N instanceof r && (P[N.str] = (P[N.str] || 0) + 1), P), {});
    }
  }
  t._Code = n, t.nil = new n("");
  function s(p, ...E) {
    const P = [p[0]];
    let N = 0;
    for (; N < E.length; )
      i(P, E[N]), P.push(p[++N]);
    return new n(P);
  }
  t._ = s;
  const a = new n("+");
  function o(p, ...E) {
    const P = [g(p[0])];
    let N = 0;
    for (; N < E.length; )
      P.push(a), i(P, E[N]), P.push(a, g(p[++N]));
    return c(P), new n(P);
  }
  t.str = o;
  function i(p, E) {
    E instanceof n ? p.push(...E._items) : E instanceof r ? p.push(E) : p.push(f(E));
  }
  t.addCodeArg = i;
  function c(p) {
    let E = 1;
    for (; E < p.length - 1; ) {
      if (p[E] === a) {
        const P = l(p[E - 1], p[E + 1]);
        if (P !== void 0) {
          p.splice(E - 1, 3, P);
          continue;
        }
        p[E++] = "+";
      }
      E++;
    }
  }
  function l(p, E) {
    if (E === '""')
      return p;
    if (p === '""')
      return E;
    if (typeof p == "string")
      return E instanceof r || p[p.length - 1] !== '"' ? void 0 : typeof E != "string" ? `${p.slice(0, -1)}${E}"` : E[0] === '"' ? p.slice(0, -1) + E.slice(1) : void 0;
    if (typeof E == "string" && E[0] === '"' && !(p instanceof r))
      return `"${p}${E.slice(1)}`;
  }
  function d(p, E) {
    return E.emptyStr() ? p : p.emptyStr() ? E : o`${p}${E}`;
  }
  t.strConcat = d;
  function f(p) {
    return typeof p == "number" || typeof p == "boolean" || p === null ? p : g(Array.isArray(p) ? p.join(",") : p);
  }
  function w(p) {
    return new n(g(p));
  }
  t.stringify = w;
  function g(p) {
    return JSON.stringify(p).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
  }
  t.safeStringify = g;
  function y(p) {
    return typeof p == "string" && t.IDENTIFIER.test(p) ? new n(`.${p}`) : s`[${p}]`;
  }
  t.getProperty = y;
  function v(p) {
    if (typeof p == "string" && t.IDENTIFIER.test(p))
      return new n(`${p}`);
    throw new Error(`CodeGen: invalid export name: ${p}, use explicit $id name mapping`);
  }
  t.getEsmExportName = v;
  function $(p) {
    return new n(p.toString());
  }
  t.regexpCode = $;
})(vn);
var Pa = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.ValueScope = t.ValueScopeName = t.Scope = t.varKinds = t.UsedValueState = void 0;
  const e = vn;
  class r extends Error {
    constructor(l) {
      super(`CodeGen: "code" for ${l} not defined`), this.value = l.value;
    }
  }
  var n;
  (function(c) {
    c[c.Started = 0] = "Started", c[c.Completed = 1] = "Completed";
  })(n || (t.UsedValueState = n = {})), t.varKinds = {
    const: new e.Name("const"),
    let: new e.Name("let"),
    var: new e.Name("var")
  };
  class s {
    constructor({ prefixes: l, parent: d } = {}) {
      this._names = {}, this._prefixes = l, this._parent = d;
    }
    toName(l) {
      return l instanceof e.Name ? l : this.name(l);
    }
    name(l) {
      return new e.Name(this._newName(l));
    }
    _newName(l) {
      const d = this._names[l] || this._nameGroup(l);
      return `${l}${d.index++}`;
    }
    _nameGroup(l) {
      var d, f;
      if (!((f = (d = this._parent) === null || d === void 0 ? void 0 : d._prefixes) === null || f === void 0) && f.has(l) || this._prefixes && !this._prefixes.has(l))
        throw new Error(`CodeGen: prefix "${l}" is not allowed in this scope`);
      return this._names[l] = { prefix: l, index: 0 };
    }
  }
  t.Scope = s;
  class a extends e.Name {
    constructor(l, d) {
      super(d), this.prefix = l;
    }
    setValue(l, { property: d, itemIndex: f }) {
      this.value = l, this.scopePath = (0, e._)`.${new e.Name(d)}[${f}]`;
    }
  }
  t.ValueScopeName = a;
  const o = (0, e._)`\n`;
  class i extends s {
    constructor(l) {
      super(l), this._values = {}, this._scope = l.scope, this.opts = { ...l, _n: l.lines ? o : e.nil };
    }
    get() {
      return this._scope;
    }
    name(l) {
      return new a(l, this._newName(l));
    }
    value(l, d) {
      var f;
      if (d.ref === void 0)
        throw new Error("CodeGen: ref must be passed in value");
      const w = this.toName(l), { prefix: g } = w, y = (f = d.key) !== null && f !== void 0 ? f : d.ref;
      let v = this._values[g];
      if (v) {
        const E = v.get(y);
        if (E)
          return E;
      } else
        v = this._values[g] = /* @__PURE__ */ new Map();
      v.set(y, w);
      const $ = this._scope[g] || (this._scope[g] = []), p = $.length;
      return $[p] = d.ref, w.setValue(d, { property: g, itemIndex: p }), w;
    }
    getValue(l, d) {
      const f = this._values[l];
      if (f)
        return f.get(d);
    }
    scopeRefs(l, d = this._values) {
      return this._reduceValues(d, (f) => {
        if (f.scopePath === void 0)
          throw new Error(`CodeGen: name "${f}" has no value`);
        return (0, e._)`${l}${f.scopePath}`;
      });
    }
    scopeCode(l = this._values, d, f) {
      return this._reduceValues(l, (w) => {
        if (w.value === void 0)
          throw new Error(`CodeGen: name "${w}" has no value`);
        return w.value.code;
      }, d, f);
    }
    _reduceValues(l, d, f = {}, w) {
      let g = e.nil;
      for (const y in l) {
        const v = l[y];
        if (!v)
          continue;
        const $ = f[y] = f[y] || /* @__PURE__ */ new Map();
        v.forEach((p) => {
          if ($.has(p))
            return;
          $.set(p, n.Started);
          let E = d(p);
          if (E) {
            const P = this.opts.es5 ? t.varKinds.var : t.varKinds.const;
            g = (0, e._)`${g}${P} ${p} = ${E};${this.opts._n}`;
          } else if (E = w == null ? void 0 : w(p))
            g = (0, e._)`${g}${E}${this.opts._n}`;
          else
            throw new r(p);
          $.set(p, n.Completed);
        });
      }
      return g;
    }
  }
  t.ValueScope = i;
})(Pa);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.or = t.and = t.not = t.CodeGen = t.operators = t.varKinds = t.ValueScopeName = t.ValueScope = t.Scope = t.Name = t.regexpCode = t.stringify = t.getProperty = t.nil = t.strConcat = t.str = t._ = void 0;
  const e = vn, r = Pa;
  var n = vn;
  Object.defineProperty(t, "_", { enumerable: !0, get: function() {
    return n._;
  } }), Object.defineProperty(t, "str", { enumerable: !0, get: function() {
    return n.str;
  } }), Object.defineProperty(t, "strConcat", { enumerable: !0, get: function() {
    return n.strConcat;
  } }), Object.defineProperty(t, "nil", { enumerable: !0, get: function() {
    return n.nil;
  } }), Object.defineProperty(t, "getProperty", { enumerable: !0, get: function() {
    return n.getProperty;
  } }), Object.defineProperty(t, "stringify", { enumerable: !0, get: function() {
    return n.stringify;
  } }), Object.defineProperty(t, "regexpCode", { enumerable: !0, get: function() {
    return n.regexpCode;
  } }), Object.defineProperty(t, "Name", { enumerable: !0, get: function() {
    return n.Name;
  } });
  var s = Pa;
  Object.defineProperty(t, "Scope", { enumerable: !0, get: function() {
    return s.Scope;
  } }), Object.defineProperty(t, "ValueScope", { enumerable: !0, get: function() {
    return s.ValueScope;
  } }), Object.defineProperty(t, "ValueScopeName", { enumerable: !0, get: function() {
    return s.ValueScopeName;
  } }), Object.defineProperty(t, "varKinds", { enumerable: !0, get: function() {
    return s.varKinds;
  } }), t.operators = {
    GT: new e._Code(">"),
    GTE: new e._Code(">="),
    LT: new e._Code("<"),
    LTE: new e._Code("<="),
    EQ: new e._Code("==="),
    NEQ: new e._Code("!=="),
    NOT: new e._Code("!"),
    OR: new e._Code("||"),
    AND: new e._Code("&&"),
    ADD: new e._Code("+")
  };
  class a {
    optimizeNodes() {
      return this;
    }
    optimizeNames(u, h) {
      return this;
    }
  }
  class o extends a {
    constructor(u, h, S) {
      super(), this.varKind = u, this.name = h, this.rhs = S;
    }
    render({ es5: u, _n: h }) {
      const S = u ? r.varKinds.var : this.varKind, T = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
      return `${S} ${this.name}${T};` + h;
    }
    optimizeNames(u, h) {
      if (u[this.name.str])
        return this.rhs && (this.rhs = j(this.rhs, u, h)), this;
    }
    get names() {
      return this.rhs instanceof e._CodeOrName ? this.rhs.names : {};
    }
  }
  class i extends a {
    constructor(u, h, S) {
      super(), this.lhs = u, this.rhs = h, this.sideEffects = S;
    }
    render({ _n: u }) {
      return `${this.lhs} = ${this.rhs};` + u;
    }
    optimizeNames(u, h) {
      if (!(this.lhs instanceof e.Name && !u[this.lhs.str] && !this.sideEffects))
        return this.rhs = j(this.rhs, u, h), this;
    }
    get names() {
      const u = this.lhs instanceof e.Name ? {} : { ...this.lhs.names };
      return X(u, this.rhs);
    }
  }
  class c extends i {
    constructor(u, h, S, T) {
      super(u, S, T), this.op = h;
    }
    render({ _n: u }) {
      return `${this.lhs} ${this.op}= ${this.rhs};` + u;
    }
  }
  class l extends a {
    constructor(u) {
      super(), this.label = u, this.names = {};
    }
    render({ _n: u }) {
      return `${this.label}:` + u;
    }
  }
  class d extends a {
    constructor(u) {
      super(), this.label = u, this.names = {};
    }
    render({ _n: u }) {
      return `break${this.label ? ` ${this.label}` : ""};` + u;
    }
  }
  class f extends a {
    constructor(u) {
      super(), this.error = u;
    }
    render({ _n: u }) {
      return `throw ${this.error};` + u;
    }
    get names() {
      return this.error.names;
    }
  }
  class w extends a {
    constructor(u) {
      super(), this.code = u;
    }
    render({ _n: u }) {
      return `${this.code};` + u;
    }
    optimizeNodes() {
      return `${this.code}` ? this : void 0;
    }
    optimizeNames(u, h) {
      return this.code = j(this.code, u, h), this;
    }
    get names() {
      return this.code instanceof e._CodeOrName ? this.code.names : {};
    }
  }
  class g extends a {
    constructor(u = []) {
      super(), this.nodes = u;
    }
    render(u) {
      return this.nodes.reduce((h, S) => h + S.render(u), "");
    }
    optimizeNodes() {
      const { nodes: u } = this;
      let h = u.length;
      for (; h--; ) {
        const S = u[h].optimizeNodes();
        Array.isArray(S) ? u.splice(h, 1, ...S) : S ? u[h] = S : u.splice(h, 1);
      }
      return u.length > 0 ? this : void 0;
    }
    optimizeNames(u, h) {
      const { nodes: S } = this;
      let T = S.length;
      for (; T--; ) {
        const I = S[T];
        I.optimizeNames(u, h) || (k(u, I.names), S.splice(T, 1));
      }
      return S.length > 0 ? this : void 0;
    }
    get names() {
      return this.nodes.reduce((u, h) => H(u, h.names), {});
    }
  }
  class y extends g {
    render(u) {
      return "{" + u._n + super.render(u) + "}" + u._n;
    }
  }
  class v extends g {
  }
  class $ extends y {
  }
  $.kind = "else";
  class p extends y {
    constructor(u, h) {
      super(h), this.condition = u;
    }
    render(u) {
      let h = `if(${this.condition})` + super.render(u);
      return this.else && (h += "else " + this.else.render(u)), h;
    }
    optimizeNodes() {
      super.optimizeNodes();
      const u = this.condition;
      if (u === !0)
        return this.nodes;
      let h = this.else;
      if (h) {
        const S = h.optimizeNodes();
        h = this.else = Array.isArray(S) ? new $(S) : S;
      }
      if (h)
        return u === !1 ? h instanceof p ? h : h.nodes : this.nodes.length ? this : new p(A(u), h instanceof p ? [h] : h.nodes);
      if (!(u === !1 || !this.nodes.length))
        return this;
    }
    optimizeNames(u, h) {
      var S;
      if (this.else = (S = this.else) === null || S === void 0 ? void 0 : S.optimizeNames(u, h), !!(super.optimizeNames(u, h) || this.else))
        return this.condition = j(this.condition, u, h), this;
    }
    get names() {
      const u = super.names;
      return X(u, this.condition), this.else && H(u, this.else.names), u;
    }
  }
  p.kind = "if";
  class E extends y {
  }
  E.kind = "for";
  class P extends E {
    constructor(u) {
      super(), this.iteration = u;
    }
    render(u) {
      return `for(${this.iteration})` + super.render(u);
    }
    optimizeNames(u, h) {
      if (super.optimizeNames(u, h))
        return this.iteration = j(this.iteration, u, h), this;
    }
    get names() {
      return H(super.names, this.iteration.names);
    }
  }
  class N extends E {
    constructor(u, h, S, T) {
      super(), this.varKind = u, this.name = h, this.from = S, this.to = T;
    }
    render(u) {
      const h = u.es5 ? r.varKinds.var : this.varKind, { name: S, from: T, to: I } = this;
      return `for(${h} ${S}=${T}; ${S}<${I}; ${S}++)` + super.render(u);
    }
    get names() {
      const u = X(super.names, this.from);
      return X(u, this.to);
    }
  }
  class R extends E {
    constructor(u, h, S, T) {
      super(), this.loop = u, this.varKind = h, this.name = S, this.iterable = T;
    }
    render(u) {
      return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(u);
    }
    optimizeNames(u, h) {
      if (super.optimizeNames(u, h))
        return this.iterable = j(this.iterable, u, h), this;
    }
    get names() {
      return H(super.names, this.iterable.names);
    }
  }
  class z extends y {
    constructor(u, h, S) {
      super(), this.name = u, this.args = h, this.async = S;
    }
    render(u) {
      return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(u);
    }
  }
  z.kind = "func";
  class G extends g {
    render(u) {
      return "return " + super.render(u);
    }
  }
  G.kind = "return";
  class ue extends y {
    render(u) {
      let h = "try" + super.render(u);
      return this.catch && (h += this.catch.render(u)), this.finally && (h += this.finally.render(u)), h;
    }
    optimizeNodes() {
      var u, h;
      return super.optimizeNodes(), (u = this.catch) === null || u === void 0 || u.optimizeNodes(), (h = this.finally) === null || h === void 0 || h.optimizeNodes(), this;
    }
    optimizeNames(u, h) {
      var S, T;
      return super.optimizeNames(u, h), (S = this.catch) === null || S === void 0 || S.optimizeNames(u, h), (T = this.finally) === null || T === void 0 || T.optimizeNames(u, h), this;
    }
    get names() {
      const u = super.names;
      return this.catch && H(u, this.catch.names), this.finally && H(u, this.finally.names), u;
    }
  }
  class ie extends y {
    constructor(u) {
      super(), this.error = u;
    }
    render(u) {
      return `catch(${this.error})` + super.render(u);
    }
  }
  ie.kind = "catch";
  class ce extends y {
    render(u) {
      return "finally" + super.render(u);
    }
  }
  ce.kind = "finally";
  class U {
    constructor(u, h = {}) {
      this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = { ...h, _n: h.lines ? `
` : "" }, this._extScope = u, this._scope = new r.Scope({ parent: u }), this._nodes = [new v()];
    }
    toString() {
      return this._root.render(this.opts);
    }
    // returns unique name in the internal scope
    name(u) {
      return this._scope.name(u);
    }
    // reserves unique name in the external scope
    scopeName(u) {
      return this._extScope.name(u);
    }
    // reserves unique name in the external scope and assigns value to it
    scopeValue(u, h) {
      const S = this._extScope.value(u, h);
      return (this._values[S.prefix] || (this._values[S.prefix] = /* @__PURE__ */ new Set())).add(S), S;
    }
    getScopeValue(u, h) {
      return this._extScope.getValue(u, h);
    }
    // return code that assigns values in the external scope to the names that are used internally
    // (same names that were returned by gen.scopeName or gen.scopeValue)
    scopeRefs(u) {
      return this._extScope.scopeRefs(u, this._values);
    }
    scopeCode() {
      return this._extScope.scopeCode(this._values);
    }
    _def(u, h, S, T) {
      const I = this._scope.toName(h);
      return S !== void 0 && T && (this._constants[I.str] = S), this._leafNode(new o(u, I, S)), I;
    }
    // `const` declaration (`var` in es5 mode)
    const(u, h, S) {
      return this._def(r.varKinds.const, u, h, S);
    }
    // `let` declaration with optional assignment (`var` in es5 mode)
    let(u, h, S) {
      return this._def(r.varKinds.let, u, h, S);
    }
    // `var` declaration with optional assignment
    var(u, h, S) {
      return this._def(r.varKinds.var, u, h, S);
    }
    // assignment code
    assign(u, h, S) {
      return this._leafNode(new i(u, h, S));
    }
    // `+=` code
    add(u, h) {
      return this._leafNode(new c(u, t.operators.ADD, h));
    }
    // appends passed SafeExpr to code or executes Block
    code(u) {
      return typeof u == "function" ? u() : u !== e.nil && this._leafNode(new w(u)), this;
    }
    // returns code for object literal for the passed argument list of key-value pairs
    object(...u) {
      const h = ["{"];
      for (const [S, T] of u)
        h.length > 1 && h.push(","), h.push(S), (S !== T || this.opts.es5) && (h.push(":"), (0, e.addCodeArg)(h, T));
      return h.push("}"), new e._Code(h);
    }
    // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
    if(u, h, S) {
      if (this._blockNode(new p(u)), h && S)
        this.code(h).else().code(S).endIf();
      else if (h)
        this.code(h).endIf();
      else if (S)
        throw new Error('CodeGen: "else" body without "then" body');
      return this;
    }
    // `else if` clause - invalid without `if` or after `else` clauses
    elseIf(u) {
      return this._elseNode(new p(u));
    }
    // `else` clause - only valid after `if` or `else if` clauses
    else() {
      return this._elseNode(new $());
    }
    // end `if` statement (needed if gen.if was used only with condition)
    endIf() {
      return this._endBlockNode(p, $);
    }
    _for(u, h) {
      return this._blockNode(u), h && this.code(h).endFor(), this;
    }
    // a generic `for` clause (or statement if `forBody` is passed)
    for(u, h) {
      return this._for(new P(u), h);
    }
    // `for` statement for a range of values
    forRange(u, h, S, T, I = this.opts.es5 ? r.varKinds.var : r.varKinds.let) {
      const K = this._scope.toName(u);
      return this._for(new N(I, K, h, S), () => T(K));
    }
    // `for-of` statement (in es5 mode replace with a normal for loop)
    forOf(u, h, S, T = r.varKinds.const) {
      const I = this._scope.toName(u);
      if (this.opts.es5) {
        const K = h instanceof e.Name ? h : this.var("_arr", h);
        return this.forRange("_i", 0, (0, e._)`${K}.length`, (F) => {
          this.var(I, (0, e._)`${K}[${F}]`), S(I);
        });
      }
      return this._for(new R("of", T, I, h), () => S(I));
    }
    // `for-in` statement.
    // With option `ownProperties` replaced with a `for-of` loop for object keys
    forIn(u, h, S, T = this.opts.es5 ? r.varKinds.var : r.varKinds.const) {
      if (this.opts.ownProperties)
        return this.forOf(u, (0, e._)`Object.keys(${h})`, S);
      const I = this._scope.toName(u);
      return this._for(new R("in", T, I, h), () => S(I));
    }
    // end `for` loop
    endFor() {
      return this._endBlockNode(E);
    }
    // `label` statement
    label(u) {
      return this._leafNode(new l(u));
    }
    // `break` statement
    break(u) {
      return this._leafNode(new d(u));
    }
    // `return` statement
    return(u) {
      const h = new G();
      if (this._blockNode(h), this.code(u), h.nodes.length !== 1)
        throw new Error('CodeGen: "return" should have one node');
      return this._endBlockNode(G);
    }
    // `try` statement
    try(u, h, S) {
      if (!h && !S)
        throw new Error('CodeGen: "try" without "catch" and "finally"');
      const T = new ue();
      if (this._blockNode(T), this.code(u), h) {
        const I = this.name("e");
        this._currNode = T.catch = new ie(I), h(I);
      }
      return S && (this._currNode = T.finally = new ce(), this.code(S)), this._endBlockNode(ie, ce);
    }
    // `throw` statement
    throw(u) {
      return this._leafNode(new f(u));
    }
    // start self-balancing block
    block(u, h) {
      return this._blockStarts.push(this._nodes.length), u && this.code(u).endBlock(h), this;
    }
    // end the current self-balancing block
    endBlock(u) {
      const h = this._blockStarts.pop();
      if (h === void 0)
        throw new Error("CodeGen: not in self-balancing block");
      const S = this._nodes.length - h;
      if (S < 0 || u !== void 0 && S !== u)
        throw new Error(`CodeGen: wrong number of nodes: ${S} vs ${u} expected`);
      return this._nodes.length = h, this;
    }
    // `function` heading (or definition if funcBody is passed)
    func(u, h = e.nil, S, T) {
      return this._blockNode(new z(u, h, S)), T && this.code(T).endFunc(), this;
    }
    // end function definition
    endFunc() {
      return this._endBlockNode(z);
    }
    optimize(u = 1) {
      for (; u-- > 0; )
        this._root.optimizeNodes(), this._root.optimizeNames(this._root.names, this._constants);
    }
    _leafNode(u) {
      return this._currNode.nodes.push(u), this;
    }
    _blockNode(u) {
      this._currNode.nodes.push(u), this._nodes.push(u);
    }
    _endBlockNode(u, h) {
      const S = this._currNode;
      if (S instanceof u || h && S instanceof h)
        return this._nodes.pop(), this;
      throw new Error(`CodeGen: not in block "${h ? `${u.kind}/${h.kind}` : u.kind}"`);
    }
    _elseNode(u) {
      const h = this._currNode;
      if (!(h instanceof p))
        throw new Error('CodeGen: "else" without "if"');
      return this._currNode = h.else = u, this;
    }
    get _root() {
      return this._nodes[0];
    }
    get _currNode() {
      const u = this._nodes;
      return u[u.length - 1];
    }
    set _currNode(u) {
      const h = this._nodes;
      h[h.length - 1] = u;
    }
  }
  t.CodeGen = U;
  function H(_, u) {
    for (const h in u)
      _[h] = (_[h] || 0) + (u[h] || 0);
    return _;
  }
  function X(_, u) {
    return u instanceof e._CodeOrName ? H(_, u.names) : _;
  }
  function j(_, u, h) {
    if (_ instanceof e.Name)
      return S(_);
    if (!T(_))
      return _;
    return new e._Code(_._items.reduce((I, K) => (K instanceof e.Name && (K = S(K)), K instanceof e._Code ? I.push(...K._items) : I.push(K), I), []));
    function S(I) {
      const K = h[I.str];
      return K === void 0 || u[I.str] !== 1 ? I : (delete u[I.str], K);
    }
    function T(I) {
      return I instanceof e._Code && I._items.some((K) => K instanceof e.Name && u[K.str] === 1 && h[K.str] !== void 0);
    }
  }
  function k(_, u) {
    for (const h in u)
      _[h] = (_[h] || 0) - (u[h] || 0);
  }
  function A(_) {
    return typeof _ == "boolean" || typeof _ == "number" || _ === null ? !_ : (0, e._)`!${b(_)}`;
  }
  t.not = A;
  const C = m(t.operators.AND);
  function V(..._) {
    return _.reduce(C);
  }
  t.and = V;
  const L = m(t.operators.OR);
  function O(..._) {
    return _.reduce(L);
  }
  t.or = O;
  function m(_) {
    return (u, h) => u === e.nil ? h : h === e.nil ? u : (0, e._)`${b(u)} ${_} ${b(h)}`;
  }
  function b(_) {
    return _ instanceof e.Name ? _ : (0, e._)`(${_})`;
  }
})(ne);
var M = {};
Object.defineProperty(M, "__esModule", { value: !0 });
M.checkStrictMode = M.getErrorPath = M.Type = M.useFunc = M.setEvaluated = M.evaluatedPropsToName = M.mergeEvaluated = M.eachItem = M.unescapeJsonPointer = M.escapeJsonPointer = M.escapeFragment = M.unescapeFragment = M.schemaRefOrVal = M.schemaHasRulesButRef = M.schemaHasRules = M.checkUnknownRules = M.alwaysValidSchema = M.toHash = void 0;
const fe = ne, l0 = vn;
function u0(t) {
  const e = {};
  for (const r of t)
    e[r] = !0;
  return e;
}
M.toHash = u0;
function d0(t, e) {
  return typeof e == "boolean" ? e : Object.keys(e).length === 0 ? !0 : (Du(t, e), !Lu(e, t.self.RULES.all));
}
M.alwaysValidSchema = d0;
function Du(t, e = t.schema) {
  const { opts: r, self: n } = t;
  if (!r.strictSchema || typeof e == "boolean")
    return;
  const s = n.RULES.keywords;
  for (const a in e)
    s[a] || Fu(t, `unknown keyword: "${a}"`);
}
M.checkUnknownRules = Du;
function Lu(t, e) {
  if (typeof t == "boolean")
    return !t;
  for (const r in t)
    if (e[r])
      return !0;
  return !1;
}
M.schemaHasRules = Lu;
function f0(t, e) {
  if (typeof t == "boolean")
    return !t;
  for (const r in t)
    if (r !== "$ref" && e.all[r])
      return !0;
  return !1;
}
M.schemaHasRulesButRef = f0;
function h0({ topSchemaRef: t, schemaPath: e }, r, n, s) {
  if (!s) {
    if (typeof r == "number" || typeof r == "boolean")
      return r;
    if (typeof r == "string")
      return (0, fe._)`${r}`;
  }
  return (0, fe._)`${t}${e}${(0, fe.getProperty)(n)}`;
}
M.schemaRefOrVal = h0;
function p0(t) {
  return Mu(decodeURIComponent(t));
}
M.unescapeFragment = p0;
function m0(t) {
  return encodeURIComponent(Uo(t));
}
M.escapeFragment = m0;
function Uo(t) {
  return typeof t == "number" ? `${t}` : t.replace(/~/g, "~0").replace(/\//g, "~1");
}
M.escapeJsonPointer = Uo;
function Mu(t) {
  return t.replace(/~1/g, "/").replace(/~0/g, "~");
}
M.unescapeJsonPointer = Mu;
function g0(t, e) {
  if (Array.isArray(t))
    for (const r of t)
      e(r);
  else
    e(t);
}
M.eachItem = g0;
function vc({ mergeNames: t, mergeToName: e, mergeValues: r, resultToName: n }) {
  return (s, a, o, i) => {
    const c = o === void 0 ? a : o instanceof fe.Name ? (a instanceof fe.Name ? t(s, a, o) : e(s, a, o), o) : a instanceof fe.Name ? (e(s, o, a), a) : r(a, o);
    return i === fe.Name && !(c instanceof fe.Name) ? n(s, c) : c;
  };
}
M.mergeEvaluated = {
  props: vc({
    mergeNames: (t, e, r) => t.if((0, fe._)`${r} !== true && ${e} !== undefined`, () => {
      t.if((0, fe._)`${e} === true`, () => t.assign(r, !0), () => t.assign(r, (0, fe._)`${r} || {}`).code((0, fe._)`Object.assign(${r}, ${e})`));
    }),
    mergeToName: (t, e, r) => t.if((0, fe._)`${r} !== true`, () => {
      e === !0 ? t.assign(r, !0) : (t.assign(r, (0, fe._)`${r} || {}`), Ko(t, r, e));
    }),
    mergeValues: (t, e) => t === !0 ? !0 : { ...t, ...e },
    resultToName: Vu
  }),
  items: vc({
    mergeNames: (t, e, r) => t.if((0, fe._)`${r} !== true && ${e} !== undefined`, () => t.assign(r, (0, fe._)`${e} === true ? true : ${r} > ${e} ? ${r} : ${e}`)),
    mergeToName: (t, e, r) => t.if((0, fe._)`${r} !== true`, () => t.assign(r, e === !0 ? !0 : (0, fe._)`${r} > ${e} ? ${r} : ${e}`)),
    mergeValues: (t, e) => t === !0 ? !0 : Math.max(t, e),
    resultToName: (t, e) => t.var("items", e)
  })
};
function Vu(t, e) {
  if (e === !0)
    return t.var("props", !0);
  const r = t.var("props", (0, fe._)`{}`);
  return e !== void 0 && Ko(t, r, e), r;
}
M.evaluatedPropsToName = Vu;
function Ko(t, e, r) {
  Object.keys(r).forEach((n) => t.assign((0, fe._)`${e}${(0, fe.getProperty)(n)}`, !0));
}
M.setEvaluated = Ko;
const _c = {};
function y0(t, e) {
  return t.scopeValue("func", {
    ref: e,
    code: _c[e.code] || (_c[e.code] = new l0._Code(e.code))
  });
}
M.useFunc = y0;
var Oa;
(function(t) {
  t[t.Num = 0] = "Num", t[t.Str = 1] = "Str";
})(Oa || (M.Type = Oa = {}));
function $0(t, e, r) {
  if (t instanceof fe.Name) {
    const n = e === Oa.Num;
    return r ? n ? (0, fe._)`"[" + ${t} + "]"` : (0, fe._)`"['" + ${t} + "']"` : n ? (0, fe._)`"/" + ${t}` : (0, fe._)`"/" + ${t}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
  }
  return r ? (0, fe.getProperty)(t).toString() : "/" + Uo(t);
}
M.getErrorPath = $0;
function Fu(t, e, r = t.opts.strictSchema) {
  if (r) {
    if (e = `strict mode: ${e}`, r === !0)
      throw new Error(e);
    t.self.logger.warn(e);
  }
}
M.checkStrictMode = Fu;
var gt = {};
Object.defineProperty(gt, "__esModule", { value: !0 });
const Te = ne, v0 = {
  // validation function arguments
  data: new Te.Name("data"),
  // data passed to validation function
  // args passed from referencing schema
  valCxt: new Te.Name("valCxt"),
  // validation/data context - should not be used directly, it is destructured to the names below
  instancePath: new Te.Name("instancePath"),
  parentData: new Te.Name("parentData"),
  parentDataProperty: new Te.Name("parentDataProperty"),
  rootData: new Te.Name("rootData"),
  // root data - same as the data passed to the first/top validation function
  dynamicAnchors: new Te.Name("dynamicAnchors"),
  // used to support recursiveRef and dynamicRef
  // function scoped variables
  vErrors: new Te.Name("vErrors"),
  // null or array of validation errors
  errors: new Te.Name("errors"),
  // counter of validation errors
  this: new Te.Name("this"),
  // "globals"
  self: new Te.Name("self"),
  scope: new Te.Name("scope"),
  // JTD serialize/parse name for JSON string and position
  json: new Te.Name("json"),
  jsonPos: new Te.Name("jsonPos"),
  jsonLen: new Te.Name("jsonLen"),
  jsonPart: new Te.Name("jsonPart")
};
gt.default = v0;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.extendErrors = t.resetErrorsCount = t.reportExtraError = t.reportError = t.keyword$DataError = t.keywordError = void 0;
  const e = ne, r = M, n = gt;
  t.keywordError = {
    message: ({ keyword: $ }) => (0, e.str)`must pass "${$}" keyword validation`
  }, t.keyword$DataError = {
    message: ({ keyword: $, schemaType: p }) => p ? (0, e.str)`"${$}" keyword must be ${p} ($data)` : (0, e.str)`"${$}" keyword is invalid ($data)`
  };
  function s($, p = t.keywordError, E, P) {
    const { it: N } = $, { gen: R, compositeRule: z, allErrors: G } = N, ue = f($, p, E);
    P ?? (z || G) ? c(R, ue) : l(N, (0, e._)`[${ue}]`);
  }
  t.reportError = s;
  function a($, p = t.keywordError, E) {
    const { it: P } = $, { gen: N, compositeRule: R, allErrors: z } = P, G = f($, p, E);
    c(N, G), R || z || l(P, n.default.vErrors);
  }
  t.reportExtraError = a;
  function o($, p) {
    $.assign(n.default.errors, p), $.if((0, e._)`${n.default.vErrors} !== null`, () => $.if(p, () => $.assign((0, e._)`${n.default.vErrors}.length`, p), () => $.assign(n.default.vErrors, null)));
  }
  t.resetErrorsCount = o;
  function i({ gen: $, keyword: p, schemaValue: E, data: P, errsCount: N, it: R }) {
    if (N === void 0)
      throw new Error("ajv implementation error");
    const z = $.name("err");
    $.forRange("i", N, n.default.errors, (G) => {
      $.const(z, (0, e._)`${n.default.vErrors}[${G}]`), $.if((0, e._)`${z}.instancePath === undefined`, () => $.assign((0, e._)`${z}.instancePath`, (0, e.strConcat)(n.default.instancePath, R.errorPath))), $.assign((0, e._)`${z}.schemaPath`, (0, e.str)`${R.errSchemaPath}/${p}`), R.opts.verbose && ($.assign((0, e._)`${z}.schema`, E), $.assign((0, e._)`${z}.data`, P));
    });
  }
  t.extendErrors = i;
  function c($, p) {
    const E = $.const("err", p);
    $.if((0, e._)`${n.default.vErrors} === null`, () => $.assign(n.default.vErrors, (0, e._)`[${E}]`), (0, e._)`${n.default.vErrors}.push(${E})`), $.code((0, e._)`${n.default.errors}++`);
  }
  function l($, p) {
    const { gen: E, validateName: P, schemaEnv: N } = $;
    N.$async ? E.throw((0, e._)`new ${$.ValidationError}(${p})`) : (E.assign((0, e._)`${P}.errors`, p), E.return(!1));
  }
  const d = {
    keyword: new e.Name("keyword"),
    schemaPath: new e.Name("schemaPath"),
    // also used in JTD errors
    params: new e.Name("params"),
    propertyName: new e.Name("propertyName"),
    message: new e.Name("message"),
    schema: new e.Name("schema"),
    parentSchema: new e.Name("parentSchema")
  };
  function f($, p, E) {
    const { createErrors: P } = $.it;
    return P === !1 ? (0, e._)`{}` : w($, p, E);
  }
  function w($, p, E = {}) {
    const { gen: P, it: N } = $, R = [
      g(N, E),
      y($, E)
    ];
    return v($, p, R), P.object(...R);
  }
  function g({ errorPath: $ }, { instancePath: p }) {
    const E = p ? (0, e.str)`${$}${(0, r.getErrorPath)(p, r.Type.Str)}` : $;
    return [n.default.instancePath, (0, e.strConcat)(n.default.instancePath, E)];
  }
  function y({ keyword: $, it: { errSchemaPath: p } }, { schemaPath: E, parentSchema: P }) {
    let N = P ? p : (0, e.str)`${p}/${$}`;
    return E && (N = (0, e.str)`${N}${(0, r.getErrorPath)(E, r.Type.Str)}`), [d.schemaPath, N];
  }
  function v($, { params: p, message: E }, P) {
    const { keyword: N, data: R, schemaValue: z, it: G } = $, { opts: ue, propertyName: ie, topSchemaRef: ce, schemaPath: U } = G;
    P.push([d.keyword, N], [d.params, typeof p == "function" ? p($) : p || (0, e._)`{}`]), ue.messages && P.push([d.message, typeof E == "function" ? E($) : E]), ue.verbose && P.push([d.schema, z], [d.parentSchema, (0, e._)`${ce}${U}`], [n.default.data, R]), ie && P.push([d.propertyName, ie]);
  }
})(Sn);
Object.defineProperty(Dr, "__esModule", { value: !0 });
Dr.boolOrEmptySchema = Dr.topBoolOrEmptySchema = void 0;
const _0 = Sn, w0 = ne, E0 = gt, b0 = {
  message: "boolean schema is false"
};
function S0(t) {
  const { gen: e, schema: r, validateName: n } = t;
  r === !1 ? zu(t, !1) : typeof r == "object" && r.$async === !0 ? e.return(E0.default.data) : (e.assign((0, w0._)`${n}.errors`, null), e.return(!0));
}
Dr.topBoolOrEmptySchema = S0;
function P0(t, e) {
  const { gen: r, schema: n } = t;
  n === !1 ? (r.var(e, !1), zu(t)) : r.var(e, !0);
}
Dr.boolOrEmptySchema = P0;
function zu(t, e) {
  const { gen: r, data: n } = t, s = {
    gen: r,
    keyword: "false schema",
    data: n,
    schema: !1,
    schemaCode: !1,
    schemaValue: !1,
    params: {},
    it: t
  };
  (0, _0.reportError)(s, b0, void 0, e);
}
var ve = {}, gr = {};
Object.defineProperty(gr, "__esModule", { value: !0 });
gr.getRules = gr.isJSONType = void 0;
const O0 = ["string", "number", "integer", "boolean", "null", "object", "array"], N0 = new Set(O0);
function R0(t) {
  return typeof t == "string" && N0.has(t);
}
gr.isJSONType = R0;
function j0() {
  const t = {
    number: { type: "number", rules: [] },
    string: { type: "string", rules: [] },
    array: { type: "array", rules: [] },
    object: { type: "object", rules: [] }
  };
  return {
    types: { ...t, integer: !0, boolean: !0, null: !0 },
    rules: [{ rules: [] }, t.number, t.string, t.array, t.object],
    post: { rules: [] },
    all: {},
    keywords: {}
  };
}
gr.getRules = j0;
var wt = {};
Object.defineProperty(wt, "__esModule", { value: !0 });
wt.shouldUseRule = wt.shouldUseGroup = wt.schemaHasRulesForType = void 0;
function T0({ schema: t, self: e }, r) {
  const n = e.RULES.types[r];
  return n && n !== !0 && Uu(t, n);
}
wt.schemaHasRulesForType = T0;
function Uu(t, e) {
  return e.rules.some((r) => Ku(t, r));
}
wt.shouldUseGroup = Uu;
function Ku(t, e) {
  var r;
  return t[e.keyword] !== void 0 || ((r = e.definition.implements) === null || r === void 0 ? void 0 : r.some((n) => t[n] !== void 0));
}
wt.shouldUseRule = Ku;
Object.defineProperty(ve, "__esModule", { value: !0 });
ve.reportTypeError = ve.checkDataTypes = ve.checkDataType = ve.coerceAndCheckDataType = ve.getJSONTypes = ve.getSchemaTypes = ve.DataType = void 0;
const I0 = gr, k0 = wt, C0 = Sn, te = ne, qu = M;
var Tr;
(function(t) {
  t[t.Correct = 0] = "Correct", t[t.Wrong = 1] = "Wrong";
})(Tr || (ve.DataType = Tr = {}));
function A0(t) {
  const e = xu(t.type);
  if (e.includes("null")) {
    if (t.nullable === !1)
      throw new Error("type: null contradicts nullable: false");
  } else {
    if (!e.length && t.nullable !== void 0)
      throw new Error('"nullable" cannot be used without "type"');
    t.nullable === !0 && e.push("null");
  }
  return e;
}
ve.getSchemaTypes = A0;
function xu(t) {
  const e = Array.isArray(t) ? t : t ? [t] : [];
  if (e.every(I0.isJSONType))
    return e;
  throw new Error("type must be JSONType or JSONType[]: " + e.join(","));
}
ve.getJSONTypes = xu;
function D0(t, e) {
  const { gen: r, data: n, opts: s } = t, a = L0(e, s.coerceTypes), o = e.length > 0 && !(a.length === 0 && e.length === 1 && (0, k0.schemaHasRulesForType)(t, e[0]));
  if (o) {
    const i = qo(e, n, s.strictNumbers, Tr.Wrong);
    r.if(i, () => {
      a.length ? M0(t, e, a) : xo(t);
    });
  }
  return o;
}
ve.coerceAndCheckDataType = D0;
const Gu = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
function L0(t, e) {
  return e ? t.filter((r) => Gu.has(r) || e === "array" && r === "array") : [];
}
function M0(t, e, r) {
  const { gen: n, data: s, opts: a } = t, o = n.let("dataType", (0, te._)`typeof ${s}`), i = n.let("coerced", (0, te._)`undefined`);
  a.coerceTypes === "array" && n.if((0, te._)`${o} == 'object' && Array.isArray(${s}) && ${s}.length == 1`, () => n.assign(s, (0, te._)`${s}[0]`).assign(o, (0, te._)`typeof ${s}`).if(qo(e, s, a.strictNumbers), () => n.assign(i, s))), n.if((0, te._)`${i} !== undefined`);
  for (const l of r)
    (Gu.has(l) || l === "array" && a.coerceTypes === "array") && c(l);
  n.else(), xo(t), n.endIf(), n.if((0, te._)`${i} !== undefined`, () => {
    n.assign(s, i), V0(t, i);
  });
  function c(l) {
    switch (l) {
      case "string":
        n.elseIf((0, te._)`${o} == "number" || ${o} == "boolean"`).assign(i, (0, te._)`"" + ${s}`).elseIf((0, te._)`${s} === null`).assign(i, (0, te._)`""`);
        return;
      case "number":
        n.elseIf((0, te._)`${o} == "boolean" || ${s} === null
              || (${o} == "string" && ${s} && ${s} == +${s})`).assign(i, (0, te._)`+${s}`);
        return;
      case "integer":
        n.elseIf((0, te._)`${o} === "boolean" || ${s} === null
              || (${o} === "string" && ${s} && ${s} == +${s} && !(${s} % 1))`).assign(i, (0, te._)`+${s}`);
        return;
      case "boolean":
        n.elseIf((0, te._)`${s} === "false" || ${s} === 0 || ${s} === null`).assign(i, !1).elseIf((0, te._)`${s} === "true" || ${s} === 1`).assign(i, !0);
        return;
      case "null":
        n.elseIf((0, te._)`${s} === "" || ${s} === 0 || ${s} === false`), n.assign(i, null);
        return;
      case "array":
        n.elseIf((0, te._)`${o} === "string" || ${o} === "number"
              || ${o} === "boolean" || ${s} === null`).assign(i, (0, te._)`[${s}]`);
    }
  }
}
function V0({ gen: t, parentData: e, parentDataProperty: r }, n) {
  t.if((0, te._)`${e} !== undefined`, () => t.assign((0, te._)`${e}[${r}]`, n));
}
function Na(t, e, r, n = Tr.Correct) {
  const s = n === Tr.Correct ? te.operators.EQ : te.operators.NEQ;
  let a;
  switch (t) {
    case "null":
      return (0, te._)`${e} ${s} null`;
    case "array":
      a = (0, te._)`Array.isArray(${e})`;
      break;
    case "object":
      a = (0, te._)`${e} && typeof ${e} == "object" && !Array.isArray(${e})`;
      break;
    case "integer":
      a = o((0, te._)`!(${e} % 1) && !isNaN(${e})`);
      break;
    case "number":
      a = o();
      break;
    default:
      return (0, te._)`typeof ${e} ${s} ${t}`;
  }
  return n === Tr.Correct ? a : (0, te.not)(a);
  function o(i = te.nil) {
    return (0, te.and)((0, te._)`typeof ${e} == "number"`, i, r ? (0, te._)`isFinite(${e})` : te.nil);
  }
}
ve.checkDataType = Na;
function qo(t, e, r, n) {
  if (t.length === 1)
    return Na(t[0], e, r, n);
  let s;
  const a = (0, qu.toHash)(t);
  if (a.array && a.object) {
    const o = (0, te._)`typeof ${e} != "object"`;
    s = a.null ? o : (0, te._)`!${e} || ${o}`, delete a.null, delete a.array, delete a.object;
  } else
    s = te.nil;
  a.number && delete a.integer;
  for (const o in a)
    s = (0, te.and)(s, Na(o, e, r, n));
  return s;
}
ve.checkDataTypes = qo;
const F0 = {
  message: ({ schema: t }) => `must be ${t}`,
  params: ({ schema: t, schemaValue: e }) => typeof t == "string" ? (0, te._)`{type: ${t}}` : (0, te._)`{type: ${e}}`
};
function xo(t) {
  const e = z0(t);
  (0, C0.reportError)(e, F0);
}
ve.reportTypeError = xo;
function z0(t) {
  const { gen: e, data: r, schema: n } = t, s = (0, qu.schemaRefOrVal)(t, n, "type");
  return {
    gen: e,
    keyword: "type",
    data: r,
    schema: n.type,
    schemaCode: s,
    schemaValue: s,
    parentSchema: n,
    params: {},
    it: t
  };
}
var Ts = {};
Object.defineProperty(Ts, "__esModule", { value: !0 });
Ts.assignDefaults = void 0;
const _r = ne, U0 = M;
function K0(t, e) {
  const { properties: r, items: n } = t.schema;
  if (e === "object" && r)
    for (const s in r)
      wc(t, s, r[s].default);
  else e === "array" && Array.isArray(n) && n.forEach((s, a) => wc(t, a, s.default));
}
Ts.assignDefaults = K0;
function wc(t, e, r) {
  const { gen: n, compositeRule: s, data: a, opts: o } = t;
  if (r === void 0)
    return;
  const i = (0, _r._)`${a}${(0, _r.getProperty)(e)}`;
  if (s) {
    (0, U0.checkStrictMode)(t, `default is ignored for: ${i}`);
    return;
  }
  let c = (0, _r._)`${i} === undefined`;
  o.useDefaults === "empty" && (c = (0, _r._)`${c} || ${i} === null || ${i} === ""`), n.if(c, (0, _r._)`${i} = ${(0, _r.stringify)(r)}`);
}
var ht = {}, ae = {};
Object.defineProperty(ae, "__esModule", { value: !0 });
ae.validateUnion = ae.validateArray = ae.usePattern = ae.callValidateCode = ae.schemaProperties = ae.allSchemaProperties = ae.noPropertyInData = ae.propertyInData = ae.isOwnProperty = ae.hasPropFunc = ae.reportMissingProp = ae.checkMissingProp = ae.checkReportMissingProp = void 0;
const pe = ne, Go = M, Tt = gt, q0 = M;
function x0(t, e) {
  const { gen: r, data: n, it: s } = t;
  r.if(Jo(r, n, e, s.opts.ownProperties), () => {
    t.setParams({ missingProperty: (0, pe._)`${e}` }, !0), t.error();
  });
}
ae.checkReportMissingProp = x0;
function G0({ gen: t, data: e, it: { opts: r } }, n, s) {
  return (0, pe.or)(...n.map((a) => (0, pe.and)(Jo(t, e, a, r.ownProperties), (0, pe._)`${s} = ${a}`)));
}
ae.checkMissingProp = G0;
function H0(t, e) {
  t.setParams({ missingProperty: e }, !0), t.error();
}
ae.reportMissingProp = H0;
function Hu(t) {
  return t.scopeValue("func", {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ref: Object.prototype.hasOwnProperty,
    code: (0, pe._)`Object.prototype.hasOwnProperty`
  });
}
ae.hasPropFunc = Hu;
function Ho(t, e, r) {
  return (0, pe._)`${Hu(t)}.call(${e}, ${r})`;
}
ae.isOwnProperty = Ho;
function J0(t, e, r, n) {
  const s = (0, pe._)`${e}${(0, pe.getProperty)(r)} !== undefined`;
  return n ? (0, pe._)`${s} && ${Ho(t, e, r)}` : s;
}
ae.propertyInData = J0;
function Jo(t, e, r, n) {
  const s = (0, pe._)`${e}${(0, pe.getProperty)(r)} === undefined`;
  return n ? (0, pe.or)(s, (0, pe.not)(Ho(t, e, r))) : s;
}
ae.noPropertyInData = Jo;
function Ju(t) {
  return t ? Object.keys(t).filter((e) => e !== "__proto__") : [];
}
ae.allSchemaProperties = Ju;
function B0(t, e) {
  return Ju(e).filter((r) => !(0, Go.alwaysValidSchema)(t, e[r]));
}
ae.schemaProperties = B0;
function W0({ schemaCode: t, data: e, it: { gen: r, topSchemaRef: n, schemaPath: s, errorPath: a }, it: o }, i, c, l) {
  const d = l ? (0, pe._)`${t}, ${e}, ${n}${s}` : e, f = [
    [Tt.default.instancePath, (0, pe.strConcat)(Tt.default.instancePath, a)],
    [Tt.default.parentData, o.parentData],
    [Tt.default.parentDataProperty, o.parentDataProperty],
    [Tt.default.rootData, Tt.default.rootData]
  ];
  o.opts.dynamicRef && f.push([Tt.default.dynamicAnchors, Tt.default.dynamicAnchors]);
  const w = (0, pe._)`${d}, ${r.object(...f)}`;
  return c !== pe.nil ? (0, pe._)`${i}.call(${c}, ${w})` : (0, pe._)`${i}(${w})`;
}
ae.callValidateCode = W0;
const X0 = (0, pe._)`new RegExp`;
function Y0({ gen: t, it: { opts: e } }, r) {
  const n = e.unicodeRegExp ? "u" : "", { regExp: s } = e.code, a = s(r, n);
  return t.scopeValue("pattern", {
    key: a.toString(),
    ref: a,
    code: (0, pe._)`${s.code === "new RegExp" ? X0 : (0, q0.useFunc)(t, s)}(${r}, ${n})`
  });
}
ae.usePattern = Y0;
function Q0(t) {
  const { gen: e, data: r, keyword: n, it: s } = t, a = e.name("valid");
  if (s.allErrors) {
    const i = e.let("valid", !0);
    return o(() => e.assign(i, !1)), i;
  }
  return e.var(a, !0), o(() => e.break()), a;
  function o(i) {
    const c = e.const("len", (0, pe._)`${r}.length`);
    e.forRange("i", 0, c, (l) => {
      t.subschema({
        keyword: n,
        dataProp: l,
        dataPropType: Go.Type.Num
      }, a), e.if((0, pe.not)(a), i);
    });
  }
}
ae.validateArray = Q0;
function Z0(t) {
  const { gen: e, schema: r, keyword: n, it: s } = t;
  if (!Array.isArray(r))
    throw new Error("ajv implementation error");
  if (r.some((c) => (0, Go.alwaysValidSchema)(s, c)) && !s.opts.unevaluated)
    return;
  const o = e.let("valid", !1), i = e.name("_valid");
  e.block(() => r.forEach((c, l) => {
    const d = t.subschema({
      keyword: n,
      schemaProp: l,
      compositeRule: !0
    }, i);
    e.assign(o, (0, pe._)`${o} || ${i}`), t.mergeValidEvaluated(d, i) || e.if((0, pe.not)(o));
  })), t.result(o, () => t.reset(), () => t.error(!0));
}
ae.validateUnion = Z0;
Object.defineProperty(ht, "__esModule", { value: !0 });
ht.validateKeywordUsage = ht.validSchemaType = ht.funcKeywordCode = ht.macroKeywordCode = void 0;
const Ae = ne, lr = gt, ev = ae, tv = Sn;
function rv(t, e) {
  const { gen: r, keyword: n, schema: s, parentSchema: a, it: o } = t, i = e.macro.call(o.self, s, a, o), c = Bu(r, n, i);
  o.opts.validateSchema !== !1 && o.self.validateSchema(i, !0);
  const l = r.name("valid");
  t.subschema({
    schema: i,
    schemaPath: Ae.nil,
    errSchemaPath: `${o.errSchemaPath}/${n}`,
    topSchemaRef: c,
    compositeRule: !0
  }, l), t.pass(l, () => t.error(!0));
}
ht.macroKeywordCode = rv;
function nv(t, e) {
  var r;
  const { gen: n, keyword: s, schema: a, parentSchema: o, $data: i, it: c } = t;
  av(c, e);
  const l = !i && e.compile ? e.compile.call(c.self, a, o, c) : e.validate, d = Bu(n, s, l), f = n.let("valid");
  t.block$data(f, w), t.ok((r = e.valid) !== null && r !== void 0 ? r : f);
  function w() {
    if (e.errors === !1)
      v(), e.modifying && Ec(t), $(() => t.error());
    else {
      const p = e.async ? g() : y();
      e.modifying && Ec(t), $(() => sv(t, p));
    }
  }
  function g() {
    const p = n.let("ruleErrs", null);
    return n.try(() => v((0, Ae._)`await `), (E) => n.assign(f, !1).if((0, Ae._)`${E} instanceof ${c.ValidationError}`, () => n.assign(p, (0, Ae._)`${E}.errors`), () => n.throw(E))), p;
  }
  function y() {
    const p = (0, Ae._)`${d}.errors`;
    return n.assign(p, null), v(Ae.nil), p;
  }
  function v(p = e.async ? (0, Ae._)`await ` : Ae.nil) {
    const E = c.opts.passContext ? lr.default.this : lr.default.self, P = !("compile" in e && !i || e.schema === !1);
    n.assign(f, (0, Ae._)`${p}${(0, ev.callValidateCode)(t, d, E, P)}`, e.modifying);
  }
  function $(p) {
    var E;
    n.if((0, Ae.not)((E = e.valid) !== null && E !== void 0 ? E : f), p);
  }
}
ht.funcKeywordCode = nv;
function Ec(t) {
  const { gen: e, data: r, it: n } = t;
  e.if(n.parentData, () => e.assign(r, (0, Ae._)`${n.parentData}[${n.parentDataProperty}]`));
}
function sv(t, e) {
  const { gen: r } = t;
  r.if((0, Ae._)`Array.isArray(${e})`, () => {
    r.assign(lr.default.vErrors, (0, Ae._)`${lr.default.vErrors} === null ? ${e} : ${lr.default.vErrors}.concat(${e})`).assign(lr.default.errors, (0, Ae._)`${lr.default.vErrors}.length`), (0, tv.extendErrors)(t);
  }, () => t.error());
}
function av({ schemaEnv: t }, e) {
  if (e.async && !t.$async)
    throw new Error("async keyword in sync schema");
}
function Bu(t, e, r) {
  if (r === void 0)
    throw new Error(`keyword "${e}" failed to compile`);
  return t.scopeValue("keyword", typeof r == "function" ? { ref: r } : { ref: r, code: (0, Ae.stringify)(r) });
}
function ov(t, e, r = !1) {
  return !e.length || e.some((n) => n === "array" ? Array.isArray(t) : n === "object" ? t && typeof t == "object" && !Array.isArray(t) : typeof t == n || r && typeof t > "u");
}
ht.validSchemaType = ov;
function iv({ schema: t, opts: e, self: r, errSchemaPath: n }, s, a) {
  if (Array.isArray(s.keyword) ? !s.keyword.includes(a) : s.keyword !== a)
    throw new Error("ajv implementation error");
  const o = s.dependencies;
  if (o != null && o.some((i) => !Object.prototype.hasOwnProperty.call(t, i)))
    throw new Error(`parent schema must have dependencies of ${a}: ${o.join(",")}`);
  if (s.validateSchema && !s.validateSchema(t[a])) {
    const c = `keyword "${a}" value is invalid at path "${n}": ` + r.errorsText(s.validateSchema.errors);
    if (e.validateSchema === "log")
      r.logger.error(c);
    else
      throw new Error(c);
  }
}
ht.validateKeywordUsage = iv;
var Ut = {};
Object.defineProperty(Ut, "__esModule", { value: !0 });
Ut.extendSubschemaMode = Ut.extendSubschemaData = Ut.getSubschema = void 0;
const ut = ne, Wu = M;
function cv(t, { keyword: e, schemaProp: r, schema: n, schemaPath: s, errSchemaPath: a, topSchemaRef: o }) {
  if (e !== void 0 && n !== void 0)
    throw new Error('both "keyword" and "schema" passed, only one allowed');
  if (e !== void 0) {
    const i = t.schema[e];
    return r === void 0 ? {
      schema: i,
      schemaPath: (0, ut._)`${t.schemaPath}${(0, ut.getProperty)(e)}`,
      errSchemaPath: `${t.errSchemaPath}/${e}`
    } : {
      schema: i[r],
      schemaPath: (0, ut._)`${t.schemaPath}${(0, ut.getProperty)(e)}${(0, ut.getProperty)(r)}`,
      errSchemaPath: `${t.errSchemaPath}/${e}/${(0, Wu.escapeFragment)(r)}`
    };
  }
  if (n !== void 0) {
    if (s === void 0 || a === void 0 || o === void 0)
      throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
    return {
      schema: n,
      schemaPath: s,
      topSchemaRef: o,
      errSchemaPath: a
    };
  }
  throw new Error('either "keyword" or "schema" must be passed');
}
Ut.getSubschema = cv;
function lv(t, e, { dataProp: r, dataPropType: n, data: s, dataTypes: a, propertyName: o }) {
  if (s !== void 0 && r !== void 0)
    throw new Error('both "data" and "dataProp" passed, only one allowed');
  const { gen: i } = e;
  if (r !== void 0) {
    const { errorPath: l, dataPathArr: d, opts: f } = e, w = i.let("data", (0, ut._)`${e.data}${(0, ut.getProperty)(r)}`, !0);
    c(w), t.errorPath = (0, ut.str)`${l}${(0, Wu.getErrorPath)(r, n, f.jsPropertySyntax)}`, t.parentDataProperty = (0, ut._)`${r}`, t.dataPathArr = [...d, t.parentDataProperty];
  }
  if (s !== void 0) {
    const l = s instanceof ut.Name ? s : i.let("data", s, !0);
    c(l), o !== void 0 && (t.propertyName = o);
  }
  a && (t.dataTypes = a);
  function c(l) {
    t.data = l, t.dataLevel = e.dataLevel + 1, t.dataTypes = [], e.definedProperties = /* @__PURE__ */ new Set(), t.parentData = e.data, t.dataNames = [...e.dataNames, l];
  }
}
Ut.extendSubschemaData = lv;
function uv(t, { jtdDiscriminator: e, jtdMetadata: r, compositeRule: n, createErrors: s, allErrors: a }) {
  n !== void 0 && (t.compositeRule = n), s !== void 0 && (t.createErrors = s), a !== void 0 && (t.allErrors = a), t.jtdDiscriminator = e, t.jtdMetadata = r;
}
Ut.extendSubschemaMode = uv;
var Oe = {}, Xu = { exports: {} }, Vt = Xu.exports = function(t, e, r) {
  typeof e == "function" && (r = e, e = {}), r = e.cb || r;
  var n = typeof r == "function" ? r : r.pre || function() {
  }, s = r.post || function() {
  };
  rs(e, n, s, t, "", t);
};
Vt.keywords = {
  additionalItems: !0,
  items: !0,
  contains: !0,
  additionalProperties: !0,
  propertyNames: !0,
  not: !0,
  if: !0,
  then: !0,
  else: !0
};
Vt.arrayKeywords = {
  items: !0,
  allOf: !0,
  anyOf: !0,
  oneOf: !0
};
Vt.propsKeywords = {
  $defs: !0,
  definitions: !0,
  properties: !0,
  patternProperties: !0,
  dependencies: !0
};
Vt.skipKeywords = {
  default: !0,
  enum: !0,
  const: !0,
  required: !0,
  maximum: !0,
  minimum: !0,
  exclusiveMaximum: !0,
  exclusiveMinimum: !0,
  multipleOf: !0,
  maxLength: !0,
  minLength: !0,
  pattern: !0,
  format: !0,
  maxItems: !0,
  minItems: !0,
  uniqueItems: !0,
  maxProperties: !0,
  minProperties: !0
};
function rs(t, e, r, n, s, a, o, i, c, l) {
  if (n && typeof n == "object" && !Array.isArray(n)) {
    e(n, s, a, o, i, c, l);
    for (var d in n) {
      var f = n[d];
      if (Array.isArray(f)) {
        if (d in Vt.arrayKeywords)
          for (var w = 0; w < f.length; w++)
            rs(t, e, r, f[w], s + "/" + d + "/" + w, a, s, d, n, w);
      } else if (d in Vt.propsKeywords) {
        if (f && typeof f == "object")
          for (var g in f)
            rs(t, e, r, f[g], s + "/" + d + "/" + dv(g), a, s, d, n, g);
      } else (d in Vt.keywords || t.allKeys && !(d in Vt.skipKeywords)) && rs(t, e, r, f, s + "/" + d, a, s, d, n);
    }
    r(n, s, a, o, i, c, l);
  }
}
function dv(t) {
  return t.replace(/~/g, "~0").replace(/\//g, "~1");
}
var fv = Xu.exports;
Object.defineProperty(Oe, "__esModule", { value: !0 });
Oe.getSchemaRefs = Oe.resolveUrl = Oe.normalizeId = Oe._getFullPath = Oe.getFullPath = Oe.inlineRef = void 0;
const hv = M, pv = bs, mv = fv, gv = /* @__PURE__ */ new Set([
  "type",
  "format",
  "pattern",
  "maxLength",
  "minLength",
  "maxProperties",
  "minProperties",
  "maxItems",
  "minItems",
  "maximum",
  "minimum",
  "uniqueItems",
  "multipleOf",
  "required",
  "enum",
  "const"
]);
function yv(t, e = !0) {
  return typeof t == "boolean" ? !0 : e === !0 ? !Ra(t) : e ? Yu(t) <= e : !1;
}
Oe.inlineRef = yv;
const $v = /* @__PURE__ */ new Set([
  "$ref",
  "$recursiveRef",
  "$recursiveAnchor",
  "$dynamicRef",
  "$dynamicAnchor"
]);
function Ra(t) {
  for (const e in t) {
    if ($v.has(e))
      return !0;
    const r = t[e];
    if (Array.isArray(r) && r.some(Ra) || typeof r == "object" && Ra(r))
      return !0;
  }
  return !1;
}
function Yu(t) {
  let e = 0;
  for (const r in t) {
    if (r === "$ref")
      return 1 / 0;
    if (e++, !gv.has(r) && (typeof t[r] == "object" && (0, hv.eachItem)(t[r], (n) => e += Yu(n)), e === 1 / 0))
      return 1 / 0;
  }
  return e;
}
function Qu(t, e = "", r) {
  r !== !1 && (e = Ir(e));
  const n = t.parse(e);
  return Zu(t, n);
}
Oe.getFullPath = Qu;
function Zu(t, e) {
  return t.serialize(e).split("#")[0] + "#";
}
Oe._getFullPath = Zu;
const vv = /#\/?$/;
function Ir(t) {
  return t ? t.replace(vv, "") : "";
}
Oe.normalizeId = Ir;
function _v(t, e, r) {
  return r = Ir(r), t.resolve(e, r);
}
Oe.resolveUrl = _v;
const wv = /^[a-z_][-a-z0-9._]*$/i;
function Ev(t, e) {
  if (typeof t == "boolean")
    return {};
  const { schemaId: r, uriResolver: n } = this.opts, s = Ir(t[r] || e), a = { "": s }, o = Qu(n, s, !1), i = {}, c = /* @__PURE__ */ new Set();
  return mv(t, { allKeys: !0 }, (f, w, g, y) => {
    if (y === void 0)
      return;
    const v = o + w;
    let $ = a[y];
    typeof f[r] == "string" && ($ = p.call(this, f[r])), E.call(this, f.$anchor), E.call(this, f.$dynamicAnchor), a[w] = $;
    function p(P) {
      const N = this.opts.uriResolver.resolve;
      if (P = Ir($ ? N($, P) : P), c.has(P))
        throw d(P);
      c.add(P);
      let R = this.refs[P];
      return typeof R == "string" && (R = this.refs[R]), typeof R == "object" ? l(f, R.schema, P) : P !== Ir(v) && (P[0] === "#" ? (l(f, i[P], P), i[P] = f) : this.refs[P] = v), P;
    }
    function E(P) {
      if (typeof P == "string") {
        if (!wv.test(P))
          throw new Error(`invalid anchor "${P}"`);
        p.call(this, `#${P}`);
      }
    }
  }), i;
  function l(f, w, g) {
    if (w !== void 0 && !pv(f, w))
      throw d(g);
  }
  function d(f) {
    return new Error(`reference "${f}" resolves to more than one schema`);
  }
}
Oe.getSchemaRefs = Ev;
Object.defineProperty(nt, "__esModule", { value: !0 });
nt.getData = nt.KeywordCxt = nt.validateFunctionCode = void 0;
const ed = Dr, bc = ve, Bo = wt, hs = ve, bv = Ts, un = ht, Qs = Ut, x = ne, B = gt, Sv = Oe, Et = M, Yr = Sn;
function Pv(t) {
  if (nd(t) && (sd(t), rd(t))) {
    Rv(t);
    return;
  }
  td(t, () => (0, ed.topBoolOrEmptySchema)(t));
}
nt.validateFunctionCode = Pv;
function td({ gen: t, validateName: e, schema: r, schemaEnv: n, opts: s }, a) {
  s.code.es5 ? t.func(e, (0, x._)`${B.default.data}, ${B.default.valCxt}`, n.$async, () => {
    t.code((0, x._)`"use strict"; ${Sc(r, s)}`), Nv(t, s), t.code(a);
  }) : t.func(e, (0, x._)`${B.default.data}, ${Ov(s)}`, n.$async, () => t.code(Sc(r, s)).code(a));
}
function Ov(t) {
  return (0, x._)`{${B.default.instancePath}="", ${B.default.parentData}, ${B.default.parentDataProperty}, ${B.default.rootData}=${B.default.data}${t.dynamicRef ? (0, x._)`, ${B.default.dynamicAnchors}={}` : x.nil}}={}`;
}
function Nv(t, e) {
  t.if(B.default.valCxt, () => {
    t.var(B.default.instancePath, (0, x._)`${B.default.valCxt}.${B.default.instancePath}`), t.var(B.default.parentData, (0, x._)`${B.default.valCxt}.${B.default.parentData}`), t.var(B.default.parentDataProperty, (0, x._)`${B.default.valCxt}.${B.default.parentDataProperty}`), t.var(B.default.rootData, (0, x._)`${B.default.valCxt}.${B.default.rootData}`), e.dynamicRef && t.var(B.default.dynamicAnchors, (0, x._)`${B.default.valCxt}.${B.default.dynamicAnchors}`);
  }, () => {
    t.var(B.default.instancePath, (0, x._)`""`), t.var(B.default.parentData, (0, x._)`undefined`), t.var(B.default.parentDataProperty, (0, x._)`undefined`), t.var(B.default.rootData, B.default.data), e.dynamicRef && t.var(B.default.dynamicAnchors, (0, x._)`{}`);
  });
}
function Rv(t) {
  const { schema: e, opts: r, gen: n } = t;
  td(t, () => {
    r.$comment && e.$comment && od(t), Cv(t), n.let(B.default.vErrors, null), n.let(B.default.errors, 0), r.unevaluated && jv(t), ad(t), Lv(t);
  });
}
function jv(t) {
  const { gen: e, validateName: r } = t;
  t.evaluated = e.const("evaluated", (0, x._)`${r}.evaluated`), e.if((0, x._)`${t.evaluated}.dynamicProps`, () => e.assign((0, x._)`${t.evaluated}.props`, (0, x._)`undefined`)), e.if((0, x._)`${t.evaluated}.dynamicItems`, () => e.assign((0, x._)`${t.evaluated}.items`, (0, x._)`undefined`));
}
function Sc(t, e) {
  const r = typeof t == "object" && t[e.schemaId];
  return r && (e.code.source || e.code.process) ? (0, x._)`/*# sourceURL=${r} */` : x.nil;
}
function Tv(t, e) {
  if (nd(t) && (sd(t), rd(t))) {
    Iv(t, e);
    return;
  }
  (0, ed.boolOrEmptySchema)(t, e);
}
function rd({ schema: t, self: e }) {
  if (typeof t == "boolean")
    return !t;
  for (const r in t)
    if (e.RULES.all[r])
      return !0;
  return !1;
}
function nd(t) {
  return typeof t.schema != "boolean";
}
function Iv(t, e) {
  const { schema: r, gen: n, opts: s } = t;
  s.$comment && r.$comment && od(t), Av(t), Dv(t);
  const a = n.const("_errs", B.default.errors);
  ad(t, a), n.var(e, (0, x._)`${a} === ${B.default.errors}`);
}
function sd(t) {
  (0, Et.checkUnknownRules)(t), kv(t);
}
function ad(t, e) {
  if (t.opts.jtd)
    return Pc(t, [], !1, e);
  const r = (0, bc.getSchemaTypes)(t.schema), n = (0, bc.coerceAndCheckDataType)(t, r);
  Pc(t, r, !n, e);
}
function kv(t) {
  const { schema: e, errSchemaPath: r, opts: n, self: s } = t;
  e.$ref && n.ignoreKeywordsWithRef && (0, Et.schemaHasRulesButRef)(e, s.RULES) && s.logger.warn(`$ref: keywords ignored in schema at path "${r}"`);
}
function Cv(t) {
  const { schema: e, opts: r } = t;
  e.default !== void 0 && r.useDefaults && r.strictSchema && (0, Et.checkStrictMode)(t, "default is ignored in the schema root");
}
function Av(t) {
  const e = t.schema[t.opts.schemaId];
  e && (t.baseId = (0, Sv.resolveUrl)(t.opts.uriResolver, t.baseId, e));
}
function Dv(t) {
  if (t.schema.$async && !t.schemaEnv.$async)
    throw new Error("async schema in sync schema");
}
function od({ gen: t, schemaEnv: e, schema: r, errSchemaPath: n, opts: s }) {
  const a = r.$comment;
  if (s.$comment === !0)
    t.code((0, x._)`${B.default.self}.logger.log(${a})`);
  else if (typeof s.$comment == "function") {
    const o = (0, x.str)`${n}/$comment`, i = t.scopeValue("root", { ref: e.root });
    t.code((0, x._)`${B.default.self}.opts.$comment(${a}, ${o}, ${i}.schema)`);
  }
}
function Lv(t) {
  const { gen: e, schemaEnv: r, validateName: n, ValidationError: s, opts: a } = t;
  r.$async ? e.if((0, x._)`${B.default.errors} === 0`, () => e.return(B.default.data), () => e.throw((0, x._)`new ${s}(${B.default.vErrors})`)) : (e.assign((0, x._)`${n}.errors`, B.default.vErrors), a.unevaluated && Mv(t), e.return((0, x._)`${B.default.errors} === 0`));
}
function Mv({ gen: t, evaluated: e, props: r, items: n }) {
  r instanceof x.Name && t.assign((0, x._)`${e}.props`, r), n instanceof x.Name && t.assign((0, x._)`${e}.items`, n);
}
function Pc(t, e, r, n) {
  const { gen: s, schema: a, data: o, allErrors: i, opts: c, self: l } = t, { RULES: d } = l;
  if (a.$ref && (c.ignoreKeywordsWithRef || !(0, Et.schemaHasRulesButRef)(a, d))) {
    s.block(() => ld(t, "$ref", d.all.$ref.definition));
    return;
  }
  c.jtd || Vv(t, e), s.block(() => {
    for (const w of d.rules)
      f(w);
    f(d.post);
  });
  function f(w) {
    (0, Bo.shouldUseGroup)(a, w) && (w.type ? (s.if((0, hs.checkDataType)(w.type, o, c.strictNumbers)), Oc(t, w), e.length === 1 && e[0] === w.type && r && (s.else(), (0, hs.reportTypeError)(t)), s.endIf()) : Oc(t, w), i || s.if((0, x._)`${B.default.errors} === ${n || 0}`));
  }
}
function Oc(t, e) {
  const { gen: r, schema: n, opts: { useDefaults: s } } = t;
  s && (0, bv.assignDefaults)(t, e.type), r.block(() => {
    for (const a of e.rules)
      (0, Bo.shouldUseRule)(n, a) && ld(t, a.keyword, a.definition, e.type);
  });
}
function Vv(t, e) {
  t.schemaEnv.meta || !t.opts.strictTypes || (Fv(t, e), t.opts.allowUnionTypes || zv(t, e), Uv(t, t.dataTypes));
}
function Fv(t, e) {
  if (e.length) {
    if (!t.dataTypes.length) {
      t.dataTypes = e;
      return;
    }
    e.forEach((r) => {
      id(t.dataTypes, r) || Wo(t, `type "${r}" not allowed by context "${t.dataTypes.join(",")}"`);
    }), qv(t, e);
  }
}
function zv(t, e) {
  e.length > 1 && !(e.length === 2 && e.includes("null")) && Wo(t, "use allowUnionTypes to allow union type keyword");
}
function Uv(t, e) {
  const r = t.self.RULES.all;
  for (const n in r) {
    const s = r[n];
    if (typeof s == "object" && (0, Bo.shouldUseRule)(t.schema, s)) {
      const { type: a } = s.definition;
      a.length && !a.some((o) => Kv(e, o)) && Wo(t, `missing type "${a.join(",")}" for keyword "${n}"`);
    }
  }
}
function Kv(t, e) {
  return t.includes(e) || e === "number" && t.includes("integer");
}
function id(t, e) {
  return t.includes(e) || e === "integer" && t.includes("number");
}
function qv(t, e) {
  const r = [];
  for (const n of t.dataTypes)
    id(e, n) ? r.push(n) : e.includes("integer") && n === "number" && r.push("integer");
  t.dataTypes = r;
}
function Wo(t, e) {
  const r = t.schemaEnv.baseId + t.errSchemaPath;
  e += ` at "${r}" (strictTypes)`, (0, Et.checkStrictMode)(t, e, t.opts.strictTypes);
}
class cd {
  constructor(e, r, n) {
    if ((0, un.validateKeywordUsage)(e, r, n), this.gen = e.gen, this.allErrors = e.allErrors, this.keyword = n, this.data = e.data, this.schema = e.schema[n], this.$data = r.$data && e.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, Et.schemaRefOrVal)(e, this.schema, n, this.$data), this.schemaType = r.schemaType, this.parentSchema = e.schema, this.params = {}, this.it = e, this.def = r, this.$data)
      this.schemaCode = e.gen.const("vSchema", ud(this.$data, e));
    else if (this.schemaCode = this.schemaValue, !(0, un.validSchemaType)(this.schema, r.schemaType, r.allowUndefined))
      throw new Error(`${n} value must be ${JSON.stringify(r.schemaType)}`);
    ("code" in r ? r.trackErrors : r.errors !== !1) && (this.errsCount = e.gen.const("_errs", B.default.errors));
  }
  result(e, r, n) {
    this.failResult((0, x.not)(e), r, n);
  }
  failResult(e, r, n) {
    this.gen.if(e), n ? n() : this.error(), r ? (this.gen.else(), r(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
  }
  pass(e, r) {
    this.failResult((0, x.not)(e), void 0, r);
  }
  fail(e) {
    if (e === void 0) {
      this.error(), this.allErrors || this.gen.if(!1);
      return;
    }
    this.gen.if(e), this.error(), this.allErrors ? this.gen.endIf() : this.gen.else();
  }
  fail$data(e) {
    if (!this.$data)
      return this.fail(e);
    const { schemaCode: r } = this;
    this.fail((0, x._)`${r} !== undefined && (${(0, x.or)(this.invalid$data(), e)})`);
  }
  error(e, r, n) {
    if (r) {
      this.setParams(r), this._error(e, n), this.setParams({});
      return;
    }
    this._error(e, n);
  }
  _error(e, r) {
    (e ? Yr.reportExtraError : Yr.reportError)(this, this.def.error, r);
  }
  $dataError() {
    (0, Yr.reportError)(this, this.def.$dataError || Yr.keyword$DataError);
  }
  reset() {
    if (this.errsCount === void 0)
      throw new Error('add "trackErrors" to keyword definition');
    (0, Yr.resetErrorsCount)(this.gen, this.errsCount);
  }
  ok(e) {
    this.allErrors || this.gen.if(e);
  }
  setParams(e, r) {
    r ? Object.assign(this.params, e) : this.params = e;
  }
  block$data(e, r, n = x.nil) {
    this.gen.block(() => {
      this.check$data(e, n), r();
    });
  }
  check$data(e = x.nil, r = x.nil) {
    if (!this.$data)
      return;
    const { gen: n, schemaCode: s, schemaType: a, def: o } = this;
    n.if((0, x.or)((0, x._)`${s} === undefined`, r)), e !== x.nil && n.assign(e, !0), (a.length || o.validateSchema) && (n.elseIf(this.invalid$data()), this.$dataError(), e !== x.nil && n.assign(e, !1)), n.else();
  }
  invalid$data() {
    const { gen: e, schemaCode: r, schemaType: n, def: s, it: a } = this;
    return (0, x.or)(o(), i());
    function o() {
      if (n.length) {
        if (!(r instanceof x.Name))
          throw new Error("ajv implementation error");
        const c = Array.isArray(n) ? n : [n];
        return (0, x._)`${(0, hs.checkDataTypes)(c, r, a.opts.strictNumbers, hs.DataType.Wrong)}`;
      }
      return x.nil;
    }
    function i() {
      if (s.validateSchema) {
        const c = e.scopeValue("validate$data", { ref: s.validateSchema });
        return (0, x._)`!${c}(${r})`;
      }
      return x.nil;
    }
  }
  subschema(e, r) {
    const n = (0, Qs.getSubschema)(this.it, e);
    (0, Qs.extendSubschemaData)(n, this.it, e), (0, Qs.extendSubschemaMode)(n, e);
    const s = { ...this.it, ...n, items: void 0, props: void 0 };
    return Tv(s, r), s;
  }
  mergeEvaluated(e, r) {
    const { it: n, gen: s } = this;
    n.opts.unevaluated && (n.props !== !0 && e.props !== void 0 && (n.props = Et.mergeEvaluated.props(s, e.props, n.props, r)), n.items !== !0 && e.items !== void 0 && (n.items = Et.mergeEvaluated.items(s, e.items, n.items, r)));
  }
  mergeValidEvaluated(e, r) {
    const { it: n, gen: s } = this;
    if (n.opts.unevaluated && (n.props !== !0 || n.items !== !0))
      return s.if(r, () => this.mergeEvaluated(e, x.Name)), !0;
  }
}
nt.KeywordCxt = cd;
function ld(t, e, r, n) {
  const s = new cd(t, r, e);
  "code" in r ? r.code(s, n) : s.$data && r.validate ? (0, un.funcKeywordCode)(s, r) : "macro" in r ? (0, un.macroKeywordCode)(s, r) : (r.compile || r.validate) && (0, un.funcKeywordCode)(s, r);
}
const xv = /^\/(?:[^~]|~0|~1)*$/, Gv = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
function ud(t, { dataLevel: e, dataNames: r, dataPathArr: n }) {
  let s, a;
  if (t === "")
    return B.default.rootData;
  if (t[0] === "/") {
    if (!xv.test(t))
      throw new Error(`Invalid JSON-pointer: ${t}`);
    s = t, a = B.default.rootData;
  } else {
    const l = Gv.exec(t);
    if (!l)
      throw new Error(`Invalid JSON-pointer: ${t}`);
    const d = +l[1];
    if (s = l[2], s === "#") {
      if (d >= e)
        throw new Error(c("property/index", d));
      return n[e - d];
    }
    if (d > e)
      throw new Error(c("data", d));
    if (a = r[e - d], !s)
      return a;
  }
  let o = a;
  const i = s.split("/");
  for (const l of i)
    l && (a = (0, x._)`${a}${(0, x.getProperty)((0, Et.unescapeJsonPointer)(l))}`, o = (0, x._)`${o} && ${a}`);
  return o;
  function c(l, d) {
    return `Cannot access ${l} ${d} levels up, current level is ${e}`;
  }
}
nt.getData = ud;
var Pn = {};
Object.defineProperty(Pn, "__esModule", { value: !0 });
class Hv extends Error {
  constructor(e) {
    super("validation failed"), this.errors = e, this.ajv = this.validation = !0;
  }
}
Pn.default = Hv;
var Kr = {};
Object.defineProperty(Kr, "__esModule", { value: !0 });
const Zs = Oe;
class Jv extends Error {
  constructor(e, r, n, s) {
    super(s || `can't resolve reference ${n} from id ${r}`), this.missingRef = (0, Zs.resolveUrl)(e, r, n), this.missingSchema = (0, Zs.normalizeId)((0, Zs.getFullPath)(e, this.missingRef));
  }
}
Kr.default = Jv;
var ze = {};
Object.defineProperty(ze, "__esModule", { value: !0 });
ze.resolveSchema = ze.getCompilingSchema = ze.resolveRef = ze.compileSchema = ze.SchemaEnv = void 0;
const Xe = ne, Bv = Pn, sr = gt, tt = Oe, Nc = M, Wv = nt;
class Is {
  constructor(e) {
    var r;
    this.refs = {}, this.dynamicAnchors = {};
    let n;
    typeof e.schema == "object" && (n = e.schema), this.schema = e.schema, this.schemaId = e.schemaId, this.root = e.root || this, this.baseId = (r = e.baseId) !== null && r !== void 0 ? r : (0, tt.normalizeId)(n == null ? void 0 : n[e.schemaId || "$id"]), this.schemaPath = e.schemaPath, this.localRefs = e.localRefs, this.meta = e.meta, this.$async = n == null ? void 0 : n.$async, this.refs = {};
  }
}
ze.SchemaEnv = Is;
function Xo(t) {
  const e = dd.call(this, t);
  if (e)
    return e;
  const r = (0, tt.getFullPath)(this.opts.uriResolver, t.root.baseId), { es5: n, lines: s } = this.opts.code, { ownProperties: a } = this.opts, o = new Xe.CodeGen(this.scope, { es5: n, lines: s, ownProperties: a });
  let i;
  t.$async && (i = o.scopeValue("Error", {
    ref: Bv.default,
    code: (0, Xe._)`require("ajv/dist/runtime/validation_error").default`
  }));
  const c = o.scopeName("validate");
  t.validateName = c;
  const l = {
    gen: o,
    allErrors: this.opts.allErrors,
    data: sr.default.data,
    parentData: sr.default.parentData,
    parentDataProperty: sr.default.parentDataProperty,
    dataNames: [sr.default.data],
    dataPathArr: [Xe.nil],
    // TODO can its length be used as dataLevel if nil is removed?
    dataLevel: 0,
    dataTypes: [],
    definedProperties: /* @__PURE__ */ new Set(),
    topSchemaRef: o.scopeValue("schema", this.opts.code.source === !0 ? { ref: t.schema, code: (0, Xe.stringify)(t.schema) } : { ref: t.schema }),
    validateName: c,
    ValidationError: i,
    schema: t.schema,
    schemaEnv: t,
    rootId: r,
    baseId: t.baseId || r,
    schemaPath: Xe.nil,
    errSchemaPath: t.schemaPath || (this.opts.jtd ? "" : "#"),
    errorPath: (0, Xe._)`""`,
    opts: this.opts,
    self: this
  };
  let d;
  try {
    this._compilations.add(t), (0, Wv.validateFunctionCode)(l), o.optimize(this.opts.code.optimize);
    const f = o.toString();
    d = `${o.scopeRefs(sr.default.scope)}return ${f}`, this.opts.code.process && (d = this.opts.code.process(d, t));
    const g = new Function(`${sr.default.self}`, `${sr.default.scope}`, d)(this, this.scope.get());
    if (this.scope.value(c, { ref: g }), g.errors = null, g.schema = t.schema, g.schemaEnv = t, t.$async && (g.$async = !0), this.opts.code.source === !0 && (g.source = { validateName: c, validateCode: f, scopeValues: o._values }), this.opts.unevaluated) {
      const { props: y, items: v } = l;
      g.evaluated = {
        props: y instanceof Xe.Name ? void 0 : y,
        items: v instanceof Xe.Name ? void 0 : v,
        dynamicProps: y instanceof Xe.Name,
        dynamicItems: v instanceof Xe.Name
      }, g.source && (g.source.evaluated = (0, Xe.stringify)(g.evaluated));
    }
    return t.validate = g, t;
  } catch (f) {
    throw delete t.validate, delete t.validateName, d && this.logger.error("Error compiling schema, function code:", d), f;
  } finally {
    this._compilations.delete(t);
  }
}
ze.compileSchema = Xo;
function Xv(t, e, r) {
  var n;
  r = (0, tt.resolveUrl)(this.opts.uriResolver, e, r);
  const s = t.refs[r];
  if (s)
    return s;
  let a = Zv.call(this, t, r);
  if (a === void 0) {
    const o = (n = t.localRefs) === null || n === void 0 ? void 0 : n[r], { schemaId: i } = this.opts;
    o && (a = new Is({ schema: o, schemaId: i, root: t, baseId: e }));
  }
  if (a !== void 0)
    return t.refs[r] = Yv.call(this, a);
}
ze.resolveRef = Xv;
function Yv(t) {
  return (0, tt.inlineRef)(t.schema, this.opts.inlineRefs) ? t.schema : t.validate ? t : Xo.call(this, t);
}
function dd(t) {
  for (const e of this._compilations)
    if (Qv(e, t))
      return e;
}
ze.getCompilingSchema = dd;
function Qv(t, e) {
  return t.schema === e.schema && t.root === e.root && t.baseId === e.baseId;
}
function Zv(t, e) {
  let r;
  for (; typeof (r = this.refs[e]) == "string"; )
    e = r;
  return r || this.schemas[e] || ks.call(this, t, e);
}
function ks(t, e) {
  const r = this.opts.uriResolver.parse(e), n = (0, tt._getFullPath)(this.opts.uriResolver, r);
  let s = (0, tt.getFullPath)(this.opts.uriResolver, t.baseId, void 0);
  if (Object.keys(t.schema).length > 0 && n === s)
    return ea.call(this, r, t);
  const a = (0, tt.normalizeId)(n), o = this.refs[a] || this.schemas[a];
  if (typeof o == "string") {
    const i = ks.call(this, t, o);
    return typeof (i == null ? void 0 : i.schema) != "object" ? void 0 : ea.call(this, r, i);
  }
  if (typeof (o == null ? void 0 : o.schema) == "object") {
    if (o.validate || Xo.call(this, o), a === (0, tt.normalizeId)(e)) {
      const { schema: i } = o, { schemaId: c } = this.opts, l = i[c];
      return l && (s = (0, tt.resolveUrl)(this.opts.uriResolver, s, l)), new Is({ schema: i, schemaId: c, root: t, baseId: s });
    }
    return ea.call(this, r, o);
  }
}
ze.resolveSchema = ks;
const e_ = /* @__PURE__ */ new Set([
  "properties",
  "patternProperties",
  "enum",
  "dependencies",
  "definitions"
]);
function ea(t, { baseId: e, schema: r, root: n }) {
  var s;
  if (((s = t.fragment) === null || s === void 0 ? void 0 : s[0]) !== "/")
    return;
  for (const i of t.fragment.slice(1).split("/")) {
    if (typeof r == "boolean")
      return;
    const c = r[(0, Nc.unescapeFragment)(i)];
    if (c === void 0)
      return;
    r = c;
    const l = typeof r == "object" && r[this.opts.schemaId];
    !e_.has(i) && l && (e = (0, tt.resolveUrl)(this.opts.uriResolver, e, l));
  }
  let a;
  if (typeof r != "boolean" && r.$ref && !(0, Nc.schemaHasRulesButRef)(r, this.RULES)) {
    const i = (0, tt.resolveUrl)(this.opts.uriResolver, e, r.$ref);
    a = ks.call(this, n, i);
  }
  const { schemaId: o } = this.opts;
  if (a = a || new Is({ schema: r, schemaId: o, root: n, baseId: e }), a.schema !== a.root.schema)
    return a;
}
const t_ = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", r_ = "Meta-schema for $data reference (JSON AnySchema extension proposal)", n_ = "object", s_ = [
  "$data"
], a_ = {
  $data: {
    type: "string",
    anyOf: [
      {
        format: "relative-json-pointer"
      },
      {
        format: "json-pointer"
      }
    ]
  }
}, o_ = !1, i_ = {
  $id: t_,
  description: r_,
  type: n_,
  required: s_,
  properties: a_,
  additionalProperties: o_
};
var Yo = {};
Object.defineProperty(Yo, "__esModule", { value: !0 });
const fd = wu;
fd.code = 'require("ajv/dist/runtime/uri").default';
Yo.default = fd;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = void 0;
  var e = nt;
  Object.defineProperty(t, "KeywordCxt", { enumerable: !0, get: function() {
    return e.KeywordCxt;
  } });
  var r = ne;
  Object.defineProperty(t, "_", { enumerable: !0, get: function() {
    return r._;
  } }), Object.defineProperty(t, "str", { enumerable: !0, get: function() {
    return r.str;
  } }), Object.defineProperty(t, "stringify", { enumerable: !0, get: function() {
    return r.stringify;
  } }), Object.defineProperty(t, "nil", { enumerable: !0, get: function() {
    return r.nil;
  } }), Object.defineProperty(t, "Name", { enumerable: !0, get: function() {
    return r.Name;
  } }), Object.defineProperty(t, "CodeGen", { enumerable: !0, get: function() {
    return r.CodeGen;
  } });
  const n = Pn, s = Kr, a = gr, o = ze, i = ne, c = Oe, l = ve, d = M, f = i_, w = Yo, g = (O, m) => new RegExp(O, m);
  g.code = "new RegExp";
  const y = ["removeAdditional", "useDefaults", "coerceTypes"], v = /* @__PURE__ */ new Set([
    "validate",
    "serialize",
    "parse",
    "wrapper",
    "root",
    "schema",
    "keyword",
    "pattern",
    "formats",
    "validate$data",
    "func",
    "obj",
    "Error"
  ]), $ = {
    errorDataPath: "",
    format: "`validateFormats: false` can be used instead.",
    nullable: '"nullable" keyword is supported by default.',
    jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
    extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
    missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
    processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
    sourceCode: "Use option `code: {source: true}`",
    strictDefaults: "It is default now, see option `strict`.",
    strictKeywords: "It is default now, see option `strict`.",
    uniqueItems: '"uniqueItems" keyword is always validated.',
    unknownFormats: "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
    cache: "Map is used as cache, schema object as key.",
    serialize: "Map is used as cache, schema object as key.",
    ajvErrors: "It is default now."
  }, p = {
    ignoreKeywordsWithRef: "",
    jsPropertySyntax: "",
    unicode: '"minLength"/"maxLength" account for unicode characters by default.'
  }, E = 200;
  function P(O) {
    var m, b, _, u, h, S, T, I, K, F, oe, Ue, Kt, qt, xt, Gt, Ht, Jt, Bt, Wt, Xt, Yt, Qt, Zt, er;
    const Be = O.strict, tr = (m = O.code) === null || m === void 0 ? void 0 : m.optimize, Hr = tr === !0 || tr === void 0 ? 1 : tr || 0, Jr = (_ = (b = O.code) === null || b === void 0 ? void 0 : b.regExp) !== null && _ !== void 0 ? _ : g, Us = (u = O.uriResolver) !== null && u !== void 0 ? u : w.default;
    return {
      strictSchema: (S = (h = O.strictSchema) !== null && h !== void 0 ? h : Be) !== null && S !== void 0 ? S : !0,
      strictNumbers: (I = (T = O.strictNumbers) !== null && T !== void 0 ? T : Be) !== null && I !== void 0 ? I : !0,
      strictTypes: (F = (K = O.strictTypes) !== null && K !== void 0 ? K : Be) !== null && F !== void 0 ? F : "log",
      strictTuples: (Ue = (oe = O.strictTuples) !== null && oe !== void 0 ? oe : Be) !== null && Ue !== void 0 ? Ue : "log",
      strictRequired: (qt = (Kt = O.strictRequired) !== null && Kt !== void 0 ? Kt : Be) !== null && qt !== void 0 ? qt : !1,
      code: O.code ? { ...O.code, optimize: Hr, regExp: Jr } : { optimize: Hr, regExp: Jr },
      loopRequired: (xt = O.loopRequired) !== null && xt !== void 0 ? xt : E,
      loopEnum: (Gt = O.loopEnum) !== null && Gt !== void 0 ? Gt : E,
      meta: (Ht = O.meta) !== null && Ht !== void 0 ? Ht : !0,
      messages: (Jt = O.messages) !== null && Jt !== void 0 ? Jt : !0,
      inlineRefs: (Bt = O.inlineRefs) !== null && Bt !== void 0 ? Bt : !0,
      schemaId: (Wt = O.schemaId) !== null && Wt !== void 0 ? Wt : "$id",
      addUsedSchema: (Xt = O.addUsedSchema) !== null && Xt !== void 0 ? Xt : !0,
      validateSchema: (Yt = O.validateSchema) !== null && Yt !== void 0 ? Yt : !0,
      validateFormats: (Qt = O.validateFormats) !== null && Qt !== void 0 ? Qt : !0,
      unicodeRegExp: (Zt = O.unicodeRegExp) !== null && Zt !== void 0 ? Zt : !0,
      int32range: (er = O.int32range) !== null && er !== void 0 ? er : !0,
      uriResolver: Us
    };
  }
  class N {
    constructor(m = {}) {
      this.schemas = {}, this.refs = {}, this.formats = {}, this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), m = this.opts = { ...m, ...P(m) };
      const { es5: b, lines: _ } = this.opts.code;
      this.scope = new i.ValueScope({ scope: {}, prefixes: v, es5: b, lines: _ }), this.logger = H(m.logger);
      const u = m.validateFormats;
      m.validateFormats = !1, this.RULES = (0, a.getRules)(), R.call(this, $, m, "NOT SUPPORTED"), R.call(this, p, m, "DEPRECATED", "warn"), this._metaOpts = ce.call(this), m.formats && ue.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), m.keywords && ie.call(this, m.keywords), typeof m.meta == "object" && this.addMetaSchema(m.meta), G.call(this), m.validateFormats = u;
    }
    _addVocabularies() {
      this.addKeyword("$async");
    }
    _addDefaultMetaSchema() {
      const { $data: m, meta: b, schemaId: _ } = this.opts;
      let u = f;
      _ === "id" && (u = { ...f }, u.id = u.$id, delete u.$id), b && m && this.addMetaSchema(u, u[_], !1);
    }
    defaultMeta() {
      const { meta: m, schemaId: b } = this.opts;
      return this.opts.defaultMeta = typeof m == "object" ? m[b] || m : void 0;
    }
    validate(m, b) {
      let _;
      if (typeof m == "string") {
        if (_ = this.getSchema(m), !_)
          throw new Error(`no schema with key or ref "${m}"`);
      } else
        _ = this.compile(m);
      const u = _(b);
      return "$async" in _ || (this.errors = _.errors), u;
    }
    compile(m, b) {
      const _ = this._addSchema(m, b);
      return _.validate || this._compileSchemaEnv(_);
    }
    compileAsync(m, b) {
      if (typeof this.opts.loadSchema != "function")
        throw new Error("options.loadSchema should be a function");
      const { loadSchema: _ } = this.opts;
      return u.call(this, m, b);
      async function u(F, oe) {
        await h.call(this, F.$schema);
        const Ue = this._addSchema(F, oe);
        return Ue.validate || S.call(this, Ue);
      }
      async function h(F) {
        F && !this.getSchema(F) && await u.call(this, { $ref: F }, !0);
      }
      async function S(F) {
        try {
          return this._compileSchemaEnv(F);
        } catch (oe) {
          if (!(oe instanceof s.default))
            throw oe;
          return T.call(this, oe), await I.call(this, oe.missingSchema), S.call(this, F);
        }
      }
      function T({ missingSchema: F, missingRef: oe }) {
        if (this.refs[F])
          throw new Error(`AnySchema ${F} is loaded but ${oe} cannot be resolved`);
      }
      async function I(F) {
        const oe = await K.call(this, F);
        this.refs[F] || await h.call(this, oe.$schema), this.refs[F] || this.addSchema(oe, F, b);
      }
      async function K(F) {
        const oe = this._loading[F];
        if (oe)
          return oe;
        try {
          return await (this._loading[F] = _(F));
        } finally {
          delete this._loading[F];
        }
      }
    }
    // Adds schema to the instance
    addSchema(m, b, _, u = this.opts.validateSchema) {
      if (Array.isArray(m)) {
        for (const S of m)
          this.addSchema(S, void 0, _, u);
        return this;
      }
      let h;
      if (typeof m == "object") {
        const { schemaId: S } = this.opts;
        if (h = m[S], h !== void 0 && typeof h != "string")
          throw new Error(`schema ${S} must be string`);
      }
      return b = (0, c.normalizeId)(b || h), this._checkUnique(b), this.schemas[b] = this._addSchema(m, _, b, u, !0), this;
    }
    // Add schema that will be used to validate other schemas
    // options in META_IGNORE_OPTIONS are alway set to false
    addMetaSchema(m, b, _ = this.opts.validateSchema) {
      return this.addSchema(m, b, !0, _), this;
    }
    //  Validate schema against its meta-schema
    validateSchema(m, b) {
      if (typeof m == "boolean")
        return !0;
      let _;
      if (_ = m.$schema, _ !== void 0 && typeof _ != "string")
        throw new Error("$schema must be a string");
      if (_ = _ || this.opts.defaultMeta || this.defaultMeta(), !_)
        return this.logger.warn("meta-schema not available"), this.errors = null, !0;
      const u = this.validate(_, m);
      if (!u && b) {
        const h = "schema is invalid: " + this.errorsText();
        if (this.opts.validateSchema === "log")
          this.logger.error(h);
        else
          throw new Error(h);
      }
      return u;
    }
    // Get compiled schema by `key` or `ref`.
    // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
    getSchema(m) {
      let b;
      for (; typeof (b = z.call(this, m)) == "string"; )
        m = b;
      if (b === void 0) {
        const { schemaId: _ } = this.opts, u = new o.SchemaEnv({ schema: {}, schemaId: _ });
        if (b = o.resolveSchema.call(this, u, m), !b)
          return;
        this.refs[m] = b;
      }
      return b.validate || this._compileSchemaEnv(b);
    }
    // Remove cached schema(s).
    // If no parameter is passed all schemas but meta-schemas are removed.
    // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
    // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
    removeSchema(m) {
      if (m instanceof RegExp)
        return this._removeAllSchemas(this.schemas, m), this._removeAllSchemas(this.refs, m), this;
      switch (typeof m) {
        case "undefined":
          return this._removeAllSchemas(this.schemas), this._removeAllSchemas(this.refs), this._cache.clear(), this;
        case "string": {
          const b = z.call(this, m);
          return typeof b == "object" && this._cache.delete(b.schema), delete this.schemas[m], delete this.refs[m], this;
        }
        case "object": {
          const b = m;
          this._cache.delete(b);
          let _ = m[this.opts.schemaId];
          return _ && (_ = (0, c.normalizeId)(_), delete this.schemas[_], delete this.refs[_]), this;
        }
        default:
          throw new Error("ajv.removeSchema: invalid parameter");
      }
    }
    // add "vocabulary" - a collection of keywords
    addVocabulary(m) {
      for (const b of m)
        this.addKeyword(b);
      return this;
    }
    addKeyword(m, b) {
      let _;
      if (typeof m == "string")
        _ = m, typeof b == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), b.keyword = _);
      else if (typeof m == "object" && b === void 0) {
        if (b = m, _ = b.keyword, Array.isArray(_) && !_.length)
          throw new Error("addKeywords: keyword must be string or non-empty array");
      } else
        throw new Error("invalid addKeywords parameters");
      if (j.call(this, _, b), !b)
        return (0, d.eachItem)(_, (h) => k.call(this, h)), this;
      C.call(this, b);
      const u = {
        ...b,
        type: (0, l.getJSONTypes)(b.type),
        schemaType: (0, l.getJSONTypes)(b.schemaType)
      };
      return (0, d.eachItem)(_, u.type.length === 0 ? (h) => k.call(this, h, u) : (h) => u.type.forEach((S) => k.call(this, h, u, S))), this;
    }
    getKeyword(m) {
      const b = this.RULES.all[m];
      return typeof b == "object" ? b.definition : !!b;
    }
    // Remove keyword
    removeKeyword(m) {
      const { RULES: b } = this;
      delete b.keywords[m], delete b.all[m];
      for (const _ of b.rules) {
        const u = _.rules.findIndex((h) => h.keyword === m);
        u >= 0 && _.rules.splice(u, 1);
      }
      return this;
    }
    // Add format
    addFormat(m, b) {
      return typeof b == "string" && (b = new RegExp(b)), this.formats[m] = b, this;
    }
    errorsText(m = this.errors, { separator: b = ", ", dataVar: _ = "data" } = {}) {
      return !m || m.length === 0 ? "No errors" : m.map((u) => `${_}${u.instancePath} ${u.message}`).reduce((u, h) => u + b + h);
    }
    $dataMetaSchema(m, b) {
      const _ = this.RULES.all;
      m = JSON.parse(JSON.stringify(m));
      for (const u of b) {
        const h = u.split("/").slice(1);
        let S = m;
        for (const T of h)
          S = S[T];
        for (const T in _) {
          const I = _[T];
          if (typeof I != "object")
            continue;
          const { $data: K } = I.definition, F = S[T];
          K && F && (S[T] = L(F));
        }
      }
      return m;
    }
    _removeAllSchemas(m, b) {
      for (const _ in m) {
        const u = m[_];
        (!b || b.test(_)) && (typeof u == "string" ? delete m[_] : u && !u.meta && (this._cache.delete(u.schema), delete m[_]));
      }
    }
    _addSchema(m, b, _, u = this.opts.validateSchema, h = this.opts.addUsedSchema) {
      let S;
      const { schemaId: T } = this.opts;
      if (typeof m == "object")
        S = m[T];
      else {
        if (this.opts.jtd)
          throw new Error("schema must be object");
        if (typeof m != "boolean")
          throw new Error("schema must be object or boolean");
      }
      let I = this._cache.get(m);
      if (I !== void 0)
        return I;
      _ = (0, c.normalizeId)(S || _);
      const K = c.getSchemaRefs.call(this, m, _);
      return I = new o.SchemaEnv({ schema: m, schemaId: T, meta: b, baseId: _, localRefs: K }), this._cache.set(I.schema, I), h && !_.startsWith("#") && (_ && this._checkUnique(_), this.refs[_] = I), u && this.validateSchema(m, !0), I;
    }
    _checkUnique(m) {
      if (this.schemas[m] || this.refs[m])
        throw new Error(`schema with key or id "${m}" already exists`);
    }
    _compileSchemaEnv(m) {
      if (m.meta ? this._compileMetaSchema(m) : o.compileSchema.call(this, m), !m.validate)
        throw new Error("ajv implementation error");
      return m.validate;
    }
    _compileMetaSchema(m) {
      const b = this.opts;
      this.opts = this._metaOpts;
      try {
        o.compileSchema.call(this, m);
      } finally {
        this.opts = b;
      }
    }
  }
  N.ValidationError = n.default, N.MissingRefError = s.default, t.default = N;
  function R(O, m, b, _ = "error") {
    for (const u in O) {
      const h = u;
      h in m && this.logger[_](`${b}: option ${u}. ${O[h]}`);
    }
  }
  function z(O) {
    return O = (0, c.normalizeId)(O), this.schemas[O] || this.refs[O];
  }
  function G() {
    const O = this.opts.schemas;
    if (O)
      if (Array.isArray(O))
        this.addSchema(O);
      else
        for (const m in O)
          this.addSchema(O[m], m);
  }
  function ue() {
    for (const O in this.opts.formats) {
      const m = this.opts.formats[O];
      m && this.addFormat(O, m);
    }
  }
  function ie(O) {
    if (Array.isArray(O)) {
      this.addVocabulary(O);
      return;
    }
    this.logger.warn("keywords option as map is deprecated, pass array");
    for (const m in O) {
      const b = O[m];
      b.keyword || (b.keyword = m), this.addKeyword(b);
    }
  }
  function ce() {
    const O = { ...this.opts };
    for (const m of y)
      delete O[m];
    return O;
  }
  const U = { log() {
  }, warn() {
  }, error() {
  } };
  function H(O) {
    if (O === !1)
      return U;
    if (O === void 0)
      return console;
    if (O.log && O.warn && O.error)
      return O;
    throw new Error("logger must implement log, warn and error methods");
  }
  const X = /^[a-z_$][a-z0-9_$:-]*$/i;
  function j(O, m) {
    const { RULES: b } = this;
    if ((0, d.eachItem)(O, (_) => {
      if (b.keywords[_])
        throw new Error(`Keyword ${_} is already defined`);
      if (!X.test(_))
        throw new Error(`Keyword ${_} has invalid name`);
    }), !!m && m.$data && !("code" in m || "validate" in m))
      throw new Error('$data keyword must have "code" or "validate" function');
  }
  function k(O, m, b) {
    var _;
    const u = m == null ? void 0 : m.post;
    if (b && u)
      throw new Error('keyword with "post" flag cannot have "type"');
    const { RULES: h } = this;
    let S = u ? h.post : h.rules.find(({ type: I }) => I === b);
    if (S || (S = { type: b, rules: [] }, h.rules.push(S)), h.keywords[O] = !0, !m)
      return;
    const T = {
      keyword: O,
      definition: {
        ...m,
        type: (0, l.getJSONTypes)(m.type),
        schemaType: (0, l.getJSONTypes)(m.schemaType)
      }
    };
    m.before ? A.call(this, S, T, m.before) : S.rules.push(T), h.all[O] = T, (_ = m.implements) === null || _ === void 0 || _.forEach((I) => this.addKeyword(I));
  }
  function A(O, m, b) {
    const _ = O.rules.findIndex((u) => u.keyword === b);
    _ >= 0 ? O.rules.splice(_, 0, m) : (O.rules.push(m), this.logger.warn(`rule ${b} is not defined`));
  }
  function C(O) {
    let { metaSchema: m } = O;
    m !== void 0 && (O.$data && this.opts.$data && (m = L(m)), O.validateSchema = this.compile(m, !0));
  }
  const V = {
    $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
  };
  function L(O) {
    return { anyOf: [O, V] };
  }
})(Au);
var Qo = {}, Zo = {}, ei = {};
Object.defineProperty(ei, "__esModule", { value: !0 });
const c_ = {
  keyword: "id",
  code() {
    throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
  }
};
ei.default = c_;
var yr = {};
Object.defineProperty(yr, "__esModule", { value: !0 });
yr.callRef = yr.getValidate = void 0;
const l_ = Kr, Rc = ae, Fe = ne, wr = gt, jc = ze, Ln = M, u_ = {
  keyword: "$ref",
  schemaType: "string",
  code(t) {
    const { gen: e, schema: r, it: n } = t, { baseId: s, schemaEnv: a, validateName: o, opts: i, self: c } = n, { root: l } = a;
    if ((r === "#" || r === "#/") && s === l.baseId)
      return f();
    const d = jc.resolveRef.call(c, l, s, r);
    if (d === void 0)
      throw new l_.default(n.opts.uriResolver, s, r);
    if (d instanceof jc.SchemaEnv)
      return w(d);
    return g(d);
    function f() {
      if (a === l)
        return ns(t, o, a, a.$async);
      const y = e.scopeValue("root", { ref: l });
      return ns(t, (0, Fe._)`${y}.validate`, l, l.$async);
    }
    function w(y) {
      const v = hd(t, y);
      ns(t, v, y, y.$async);
    }
    function g(y) {
      const v = e.scopeValue("schema", i.code.source === !0 ? { ref: y, code: (0, Fe.stringify)(y) } : { ref: y }), $ = e.name("valid"), p = t.subschema({
        schema: y,
        dataTypes: [],
        schemaPath: Fe.nil,
        topSchemaRef: v,
        errSchemaPath: r
      }, $);
      t.mergeEvaluated(p), t.ok($);
    }
  }
};
function hd(t, e) {
  const { gen: r } = t;
  return e.validate ? r.scopeValue("validate", { ref: e.validate }) : (0, Fe._)`${r.scopeValue("wrapper", { ref: e })}.validate`;
}
yr.getValidate = hd;
function ns(t, e, r, n) {
  const { gen: s, it: a } = t, { allErrors: o, schemaEnv: i, opts: c } = a, l = c.passContext ? wr.default.this : Fe.nil;
  n ? d() : f();
  function d() {
    if (!i.$async)
      throw new Error("async schema referenced by sync schema");
    const y = s.let("valid");
    s.try(() => {
      s.code((0, Fe._)`await ${(0, Rc.callValidateCode)(t, e, l)}`), g(e), o || s.assign(y, !0);
    }, (v) => {
      s.if((0, Fe._)`!(${v} instanceof ${a.ValidationError})`, () => s.throw(v)), w(v), o || s.assign(y, !1);
    }), t.ok(y);
  }
  function f() {
    t.result((0, Rc.callValidateCode)(t, e, l), () => g(e), () => w(e));
  }
  function w(y) {
    const v = (0, Fe._)`${y}.errors`;
    s.assign(wr.default.vErrors, (0, Fe._)`${wr.default.vErrors} === null ? ${v} : ${wr.default.vErrors}.concat(${v})`), s.assign(wr.default.errors, (0, Fe._)`${wr.default.vErrors}.length`);
  }
  function g(y) {
    var v;
    if (!a.opts.unevaluated)
      return;
    const $ = (v = r == null ? void 0 : r.validate) === null || v === void 0 ? void 0 : v.evaluated;
    if (a.props !== !0)
      if ($ && !$.dynamicProps)
        $.props !== void 0 && (a.props = Ln.mergeEvaluated.props(s, $.props, a.props));
      else {
        const p = s.var("props", (0, Fe._)`${y}.evaluated.props`);
        a.props = Ln.mergeEvaluated.props(s, p, a.props, Fe.Name);
      }
    if (a.items !== !0)
      if ($ && !$.dynamicItems)
        $.items !== void 0 && (a.items = Ln.mergeEvaluated.items(s, $.items, a.items));
      else {
        const p = s.var("items", (0, Fe._)`${y}.evaluated.items`);
        a.items = Ln.mergeEvaluated.items(s, p, a.items, Fe.Name);
      }
  }
}
yr.callRef = ns;
yr.default = u_;
Object.defineProperty(Zo, "__esModule", { value: !0 });
const d_ = ei, f_ = yr, h_ = [
  "$schema",
  "$id",
  "$defs",
  "$vocabulary",
  { keyword: "$comment" },
  "definitions",
  d_.default,
  f_.default
];
Zo.default = h_;
var ti = {}, ri = {};
Object.defineProperty(ri, "__esModule", { value: !0 });
const ps = ne, It = ps.operators, ms = {
  maximum: { okStr: "<=", ok: It.LTE, fail: It.GT },
  minimum: { okStr: ">=", ok: It.GTE, fail: It.LT },
  exclusiveMaximum: { okStr: "<", ok: It.LT, fail: It.GTE },
  exclusiveMinimum: { okStr: ">", ok: It.GT, fail: It.LTE }
}, p_ = {
  message: ({ keyword: t, schemaCode: e }) => (0, ps.str)`must be ${ms[t].okStr} ${e}`,
  params: ({ keyword: t, schemaCode: e }) => (0, ps._)`{comparison: ${ms[t].okStr}, limit: ${e}}`
}, m_ = {
  keyword: Object.keys(ms),
  type: "number",
  schemaType: "number",
  $data: !0,
  error: p_,
  code(t) {
    const { keyword: e, data: r, schemaCode: n } = t;
    t.fail$data((0, ps._)`${r} ${ms[e].fail} ${n} || isNaN(${r})`);
  }
};
ri.default = m_;
var ni = {};
Object.defineProperty(ni, "__esModule", { value: !0 });
const dn = ne, g_ = {
  message: ({ schemaCode: t }) => (0, dn.str)`must be multiple of ${t}`,
  params: ({ schemaCode: t }) => (0, dn._)`{multipleOf: ${t}}`
}, y_ = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: g_,
  code(t) {
    const { gen: e, data: r, schemaCode: n, it: s } = t, a = s.opts.multipleOfPrecision, o = e.let("res"), i = a ? (0, dn._)`Math.abs(Math.round(${o}) - ${o}) > 1e-${a}` : (0, dn._)`${o} !== parseInt(${o})`;
    t.fail$data((0, dn._)`(${n} === 0 || (${o} = ${r}/${n}, ${i}))`);
  }
};
ni.default = y_;
var si = {}, ai = {};
Object.defineProperty(ai, "__esModule", { value: !0 });
function pd(t) {
  const e = t.length;
  let r = 0, n = 0, s;
  for (; n < e; )
    r++, s = t.charCodeAt(n++), s >= 55296 && s <= 56319 && n < e && (s = t.charCodeAt(n), (s & 64512) === 56320 && n++);
  return r;
}
ai.default = pd;
pd.code = 'require("ajv/dist/runtime/ucs2length").default';
Object.defineProperty(si, "__esModule", { value: !0 });
const ur = ne, $_ = M, v_ = ai, __ = {
  message({ keyword: t, schemaCode: e }) {
    const r = t === "maxLength" ? "more" : "fewer";
    return (0, ur.str)`must NOT have ${r} than ${e} characters`;
  },
  params: ({ schemaCode: t }) => (0, ur._)`{limit: ${t}}`
}, w_ = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: __,
  code(t) {
    const { keyword: e, data: r, schemaCode: n, it: s } = t, a = e === "maxLength" ? ur.operators.GT : ur.operators.LT, o = s.opts.unicode === !1 ? (0, ur._)`${r}.length` : (0, ur._)`${(0, $_.useFunc)(t.gen, v_.default)}(${r})`;
    t.fail$data((0, ur._)`${o} ${a} ${n}`);
  }
};
si.default = w_;
var oi = {};
Object.defineProperty(oi, "__esModule", { value: !0 });
const E_ = ae, gs = ne, b_ = {
  message: ({ schemaCode: t }) => (0, gs.str)`must match pattern "${t}"`,
  params: ({ schemaCode: t }) => (0, gs._)`{pattern: ${t}}`
}, S_ = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: b_,
  code(t) {
    const { data: e, $data: r, schema: n, schemaCode: s, it: a } = t, o = a.opts.unicodeRegExp ? "u" : "", i = r ? (0, gs._)`(new RegExp(${s}, ${o}))` : (0, E_.usePattern)(t, n);
    t.fail$data((0, gs._)`!${i}.test(${e})`);
  }
};
oi.default = S_;
var ii = {};
Object.defineProperty(ii, "__esModule", { value: !0 });
const fn = ne, P_ = {
  message({ keyword: t, schemaCode: e }) {
    const r = t === "maxProperties" ? "more" : "fewer";
    return (0, fn.str)`must NOT have ${r} than ${e} properties`;
  },
  params: ({ schemaCode: t }) => (0, fn._)`{limit: ${t}}`
}, O_ = {
  keyword: ["maxProperties", "minProperties"],
  type: "object",
  schemaType: "number",
  $data: !0,
  error: P_,
  code(t) {
    const { keyword: e, data: r, schemaCode: n } = t, s = e === "maxProperties" ? fn.operators.GT : fn.operators.LT;
    t.fail$data((0, fn._)`Object.keys(${r}).length ${s} ${n}`);
  }
};
ii.default = O_;
var ci = {};
Object.defineProperty(ci, "__esModule", { value: !0 });
const Qr = ae, hn = ne, N_ = M, R_ = {
  message: ({ params: { missingProperty: t } }) => (0, hn.str)`must have required property '${t}'`,
  params: ({ params: { missingProperty: t } }) => (0, hn._)`{missingProperty: ${t}}`
}, j_ = {
  keyword: "required",
  type: "object",
  schemaType: "array",
  $data: !0,
  error: R_,
  code(t) {
    const { gen: e, schema: r, schemaCode: n, data: s, $data: a, it: o } = t, { opts: i } = o;
    if (!a && r.length === 0)
      return;
    const c = r.length >= i.loopRequired;
    if (o.allErrors ? l() : d(), i.strictRequired) {
      const g = t.parentSchema.properties, { definedProperties: y } = t.it;
      for (const v of r)
        if ((g == null ? void 0 : g[v]) === void 0 && !y.has(v)) {
          const $ = o.schemaEnv.baseId + o.errSchemaPath, p = `required property "${v}" is not defined at "${$}" (strictRequired)`;
          (0, N_.checkStrictMode)(o, p, o.opts.strictRequired);
        }
    }
    function l() {
      if (c || a)
        t.block$data(hn.nil, f);
      else
        for (const g of r)
          (0, Qr.checkReportMissingProp)(t, g);
    }
    function d() {
      const g = e.let("missing");
      if (c || a) {
        const y = e.let("valid", !0);
        t.block$data(y, () => w(g, y)), t.ok(y);
      } else
        e.if((0, Qr.checkMissingProp)(t, r, g)), (0, Qr.reportMissingProp)(t, g), e.else();
    }
    function f() {
      e.forOf("prop", n, (g) => {
        t.setParams({ missingProperty: g }), e.if((0, Qr.noPropertyInData)(e, s, g, i.ownProperties), () => t.error());
      });
    }
    function w(g, y) {
      t.setParams({ missingProperty: g }), e.forOf(g, n, () => {
        e.assign(y, (0, Qr.propertyInData)(e, s, g, i.ownProperties)), e.if((0, hn.not)(y), () => {
          t.error(), e.break();
        });
      }, hn.nil);
    }
  }
};
ci.default = j_;
var li = {};
Object.defineProperty(li, "__esModule", { value: !0 });
const pn = ne, T_ = {
  message({ keyword: t, schemaCode: e }) {
    const r = t === "maxItems" ? "more" : "fewer";
    return (0, pn.str)`must NOT have ${r} than ${e} items`;
  },
  params: ({ schemaCode: t }) => (0, pn._)`{limit: ${t}}`
}, I_ = {
  keyword: ["maxItems", "minItems"],
  type: "array",
  schemaType: "number",
  $data: !0,
  error: T_,
  code(t) {
    const { keyword: e, data: r, schemaCode: n } = t, s = e === "maxItems" ? pn.operators.GT : pn.operators.LT;
    t.fail$data((0, pn._)`${r}.length ${s} ${n}`);
  }
};
li.default = I_;
var ui = {}, On = {};
Object.defineProperty(On, "__esModule", { value: !0 });
const md = bs;
md.code = 'require("ajv/dist/runtime/equal").default';
On.default = md;
Object.defineProperty(ui, "__esModule", { value: !0 });
const ta = ve, Se = ne, k_ = M, C_ = On, A_ = {
  message: ({ params: { i: t, j: e } }) => (0, Se.str)`must NOT have duplicate items (items ## ${e} and ${t} are identical)`,
  params: ({ params: { i: t, j: e } }) => (0, Se._)`{i: ${t}, j: ${e}}`
}, D_ = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: !0,
  error: A_,
  code(t) {
    const { gen: e, data: r, $data: n, schema: s, parentSchema: a, schemaCode: o, it: i } = t;
    if (!n && !s)
      return;
    const c = e.let("valid"), l = a.items ? (0, ta.getSchemaTypes)(a.items) : [];
    t.block$data(c, d, (0, Se._)`${o} === false`), t.ok(c);
    function d() {
      const y = e.let("i", (0, Se._)`${r}.length`), v = e.let("j");
      t.setParams({ i: y, j: v }), e.assign(c, !0), e.if((0, Se._)`${y} > 1`, () => (f() ? w : g)(y, v));
    }
    function f() {
      return l.length > 0 && !l.some((y) => y === "object" || y === "array");
    }
    function w(y, v) {
      const $ = e.name("item"), p = (0, ta.checkDataTypes)(l, $, i.opts.strictNumbers, ta.DataType.Wrong), E = e.const("indices", (0, Se._)`{}`);
      e.for((0, Se._)`;${y}--;`, () => {
        e.let($, (0, Se._)`${r}[${y}]`), e.if(p, (0, Se._)`continue`), l.length > 1 && e.if((0, Se._)`typeof ${$} == "string"`, (0, Se._)`${$} += "_"`), e.if((0, Se._)`typeof ${E}[${$}] == "number"`, () => {
          e.assign(v, (0, Se._)`${E}[${$}]`), t.error(), e.assign(c, !1).break();
        }).code((0, Se._)`${E}[${$}] = ${y}`);
      });
    }
    function g(y, v) {
      const $ = (0, k_.useFunc)(e, C_.default), p = e.name("outer");
      e.label(p).for((0, Se._)`;${y}--;`, () => e.for((0, Se._)`${v} = ${y}; ${v}--;`, () => e.if((0, Se._)`${$}(${r}[${y}], ${r}[${v}])`, () => {
        t.error(), e.assign(c, !1).break(p);
      })));
    }
  }
};
ui.default = D_;
var di = {};
Object.defineProperty(di, "__esModule", { value: !0 });
const ja = ne, L_ = M, M_ = On, V_ = {
  message: "must be equal to constant",
  params: ({ schemaCode: t }) => (0, ja._)`{allowedValue: ${t}}`
}, F_ = {
  keyword: "const",
  $data: !0,
  error: V_,
  code(t) {
    const { gen: e, data: r, $data: n, schemaCode: s, schema: a } = t;
    n || a && typeof a == "object" ? t.fail$data((0, ja._)`!${(0, L_.useFunc)(e, M_.default)}(${r}, ${s})`) : t.fail((0, ja._)`${a} !== ${r}`);
  }
};
di.default = F_;
var fi = {};
Object.defineProperty(fi, "__esModule", { value: !0 });
const nn = ne, z_ = M, U_ = On, K_ = {
  message: "must be equal to one of the allowed values",
  params: ({ schemaCode: t }) => (0, nn._)`{allowedValues: ${t}}`
}, q_ = {
  keyword: "enum",
  schemaType: "array",
  $data: !0,
  error: K_,
  code(t) {
    const { gen: e, data: r, $data: n, schema: s, schemaCode: a, it: o } = t;
    if (!n && s.length === 0)
      throw new Error("enum must have non-empty array");
    const i = s.length >= o.opts.loopEnum;
    let c;
    const l = () => c ?? (c = (0, z_.useFunc)(e, U_.default));
    let d;
    if (i || n)
      d = e.let("valid"), t.block$data(d, f);
    else {
      if (!Array.isArray(s))
        throw new Error("ajv implementation error");
      const g = e.const("vSchema", a);
      d = (0, nn.or)(...s.map((y, v) => w(g, v)));
    }
    t.pass(d);
    function f() {
      e.assign(d, !1), e.forOf("v", a, (g) => e.if((0, nn._)`${l()}(${r}, ${g})`, () => e.assign(d, !0).break()));
    }
    function w(g, y) {
      const v = s[y];
      return typeof v == "object" && v !== null ? (0, nn._)`${l()}(${r}, ${g}[${y}])` : (0, nn._)`${r} === ${v}`;
    }
  }
};
fi.default = q_;
Object.defineProperty(ti, "__esModule", { value: !0 });
const x_ = ri, G_ = ni, H_ = si, J_ = oi, B_ = ii, W_ = ci, X_ = li, Y_ = ui, Q_ = di, Z_ = fi, ew = [
  // number
  x_.default,
  G_.default,
  // string
  H_.default,
  J_.default,
  // object
  B_.default,
  W_.default,
  // array
  X_.default,
  Y_.default,
  // any
  { keyword: "type", schemaType: ["string", "array"] },
  { keyword: "nullable", schemaType: "boolean" },
  Q_.default,
  Z_.default
];
ti.default = ew;
var hi = {}, qr = {};
Object.defineProperty(qr, "__esModule", { value: !0 });
qr.validateAdditionalItems = void 0;
const dr = ne, Ta = M, tw = {
  message: ({ params: { len: t } }) => (0, dr.str)`must NOT have more than ${t} items`,
  params: ({ params: { len: t } }) => (0, dr._)`{limit: ${t}}`
}, rw = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: tw,
  code(t) {
    const { parentSchema: e, it: r } = t, { items: n } = e;
    if (!Array.isArray(n)) {
      (0, Ta.checkStrictMode)(r, '"additionalItems" is ignored when "items" is not an array of schemas');
      return;
    }
    gd(t, n);
  }
};
function gd(t, e) {
  const { gen: r, schema: n, data: s, keyword: a, it: o } = t;
  o.items = !0;
  const i = r.const("len", (0, dr._)`${s}.length`);
  if (n === !1)
    t.setParams({ len: e.length }), t.pass((0, dr._)`${i} <= ${e.length}`);
  else if (typeof n == "object" && !(0, Ta.alwaysValidSchema)(o, n)) {
    const l = r.var("valid", (0, dr._)`${i} <= ${e.length}`);
    r.if((0, dr.not)(l), () => c(l)), t.ok(l);
  }
  function c(l) {
    r.forRange("i", e.length, i, (d) => {
      t.subschema({ keyword: a, dataProp: d, dataPropType: Ta.Type.Num }, l), o.allErrors || r.if((0, dr.not)(l), () => r.break());
    });
  }
}
qr.validateAdditionalItems = gd;
qr.default = rw;
var pi = {}, xr = {};
Object.defineProperty(xr, "__esModule", { value: !0 });
xr.validateTuple = void 0;
const Tc = ne, ss = M, nw = ae, sw = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(t) {
    const { schema: e, it: r } = t;
    if (Array.isArray(e))
      return yd(t, "additionalItems", e);
    r.items = !0, !(0, ss.alwaysValidSchema)(r, e) && t.ok((0, nw.validateArray)(t));
  }
};
function yd(t, e, r = t.schema) {
  const { gen: n, parentSchema: s, data: a, keyword: o, it: i } = t;
  d(s), i.opts.unevaluated && r.length && i.items !== !0 && (i.items = ss.mergeEvaluated.items(n, r.length, i.items));
  const c = n.name("valid"), l = n.const("len", (0, Tc._)`${a}.length`);
  r.forEach((f, w) => {
    (0, ss.alwaysValidSchema)(i, f) || (n.if((0, Tc._)`${l} > ${w}`, () => t.subschema({
      keyword: o,
      schemaProp: w,
      dataProp: w
    }, c)), t.ok(c));
  });
  function d(f) {
    const { opts: w, errSchemaPath: g } = i, y = r.length, v = y === f.minItems && (y === f.maxItems || f[e] === !1);
    if (w.strictTuples && !v) {
      const $ = `"${o}" is ${y}-tuple, but minItems or maxItems/${e} are not specified or different at path "${g}"`;
      (0, ss.checkStrictMode)(i, $, w.strictTuples);
    }
  }
}
xr.validateTuple = yd;
xr.default = sw;
Object.defineProperty(pi, "__esModule", { value: !0 });
const aw = xr, ow = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (t) => (0, aw.validateTuple)(t, "items")
};
pi.default = ow;
var mi = {};
Object.defineProperty(mi, "__esModule", { value: !0 });
const Ic = ne, iw = M, cw = ae, lw = qr, uw = {
  message: ({ params: { len: t } }) => (0, Ic.str)`must NOT have more than ${t} items`,
  params: ({ params: { len: t } }) => (0, Ic._)`{limit: ${t}}`
}, dw = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  error: uw,
  code(t) {
    const { schema: e, parentSchema: r, it: n } = t, { prefixItems: s } = r;
    n.items = !0, !(0, iw.alwaysValidSchema)(n, e) && (s ? (0, lw.validateAdditionalItems)(t, s) : t.ok((0, cw.validateArray)(t)));
  }
};
mi.default = dw;
var gi = {};
Object.defineProperty(gi, "__esModule", { value: !0 });
const Je = ne, Mn = M, fw = {
  message: ({ params: { min: t, max: e } }) => e === void 0 ? (0, Je.str)`must contain at least ${t} valid item(s)` : (0, Je.str)`must contain at least ${t} and no more than ${e} valid item(s)`,
  params: ({ params: { min: t, max: e } }) => e === void 0 ? (0, Je._)`{minContains: ${t}}` : (0, Je._)`{minContains: ${t}, maxContains: ${e}}`
}, hw = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: fw,
  code(t) {
    const { gen: e, schema: r, parentSchema: n, data: s, it: a } = t;
    let o, i;
    const { minContains: c, maxContains: l } = n;
    a.opts.next ? (o = c === void 0 ? 1 : c, i = l) : o = 1;
    const d = e.const("len", (0, Je._)`${s}.length`);
    if (t.setParams({ min: o, max: i }), i === void 0 && o === 0) {
      (0, Mn.checkStrictMode)(a, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
      return;
    }
    if (i !== void 0 && o > i) {
      (0, Mn.checkStrictMode)(a, '"minContains" > "maxContains" is always invalid'), t.fail();
      return;
    }
    if ((0, Mn.alwaysValidSchema)(a, r)) {
      let v = (0, Je._)`${d} >= ${o}`;
      i !== void 0 && (v = (0, Je._)`${v} && ${d} <= ${i}`), t.pass(v);
      return;
    }
    a.items = !0;
    const f = e.name("valid");
    i === void 0 && o === 1 ? g(f, () => e.if(f, () => e.break())) : o === 0 ? (e.let(f, !0), i !== void 0 && e.if((0, Je._)`${s}.length > 0`, w)) : (e.let(f, !1), w()), t.result(f, () => t.reset());
    function w() {
      const v = e.name("_valid"), $ = e.let("count", 0);
      g(v, () => e.if(v, () => y($)));
    }
    function g(v, $) {
      e.forRange("i", 0, d, (p) => {
        t.subschema({
          keyword: "contains",
          dataProp: p,
          dataPropType: Mn.Type.Num,
          compositeRule: !0
        }, v), $();
      });
    }
    function y(v) {
      e.code((0, Je._)`${v}++`), i === void 0 ? e.if((0, Je._)`${v} >= ${o}`, () => e.assign(f, !0).break()) : (e.if((0, Je._)`${v} > ${i}`, () => e.assign(f, !1).break()), o === 1 ? e.assign(f, !0) : e.if((0, Je._)`${v} >= ${o}`, () => e.assign(f, !0)));
    }
  }
};
gi.default = hw;
var $d = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.validateSchemaDeps = t.validatePropertyDeps = t.error = void 0;
  const e = ne, r = M, n = ae;
  t.error = {
    message: ({ params: { property: c, depsCount: l, deps: d } }) => {
      const f = l === 1 ? "property" : "properties";
      return (0, e.str)`must have ${f} ${d} when property ${c} is present`;
    },
    params: ({ params: { property: c, depsCount: l, deps: d, missingProperty: f } }) => (0, e._)`{property: ${c},
    missingProperty: ${f},
    depsCount: ${l},
    deps: ${d}}`
    // TODO change to reference
  };
  const s = {
    keyword: "dependencies",
    type: "object",
    schemaType: "object",
    error: t.error,
    code(c) {
      const [l, d] = a(c);
      o(c, l), i(c, d);
    }
  };
  function a({ schema: c }) {
    const l = {}, d = {};
    for (const f in c) {
      if (f === "__proto__")
        continue;
      const w = Array.isArray(c[f]) ? l : d;
      w[f] = c[f];
    }
    return [l, d];
  }
  function o(c, l = c.schema) {
    const { gen: d, data: f, it: w } = c;
    if (Object.keys(l).length === 0)
      return;
    const g = d.let("missing");
    for (const y in l) {
      const v = l[y];
      if (v.length === 0)
        continue;
      const $ = (0, n.propertyInData)(d, f, y, w.opts.ownProperties);
      c.setParams({
        property: y,
        depsCount: v.length,
        deps: v.join(", ")
      }), w.allErrors ? d.if($, () => {
        for (const p of v)
          (0, n.checkReportMissingProp)(c, p);
      }) : (d.if((0, e._)`${$} && (${(0, n.checkMissingProp)(c, v, g)})`), (0, n.reportMissingProp)(c, g), d.else());
    }
  }
  t.validatePropertyDeps = o;
  function i(c, l = c.schema) {
    const { gen: d, data: f, keyword: w, it: g } = c, y = d.name("valid");
    for (const v in l)
      (0, r.alwaysValidSchema)(g, l[v]) || (d.if(
        (0, n.propertyInData)(d, f, v, g.opts.ownProperties),
        () => {
          const $ = c.subschema({ keyword: w, schemaProp: v }, y);
          c.mergeValidEvaluated($, y);
        },
        () => d.var(y, !0)
        // TODO var
      ), c.ok(y));
  }
  t.validateSchemaDeps = i, t.default = s;
})($d);
var yi = {};
Object.defineProperty(yi, "__esModule", { value: !0 });
const vd = ne, pw = M, mw = {
  message: "property name must be valid",
  params: ({ params: t }) => (0, vd._)`{propertyName: ${t.propertyName}}`
}, gw = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: mw,
  code(t) {
    const { gen: e, schema: r, data: n, it: s } = t;
    if ((0, pw.alwaysValidSchema)(s, r))
      return;
    const a = e.name("valid");
    e.forIn("key", n, (o) => {
      t.setParams({ propertyName: o }), t.subschema({
        keyword: "propertyNames",
        data: o,
        dataTypes: ["string"],
        propertyName: o,
        compositeRule: !0
      }, a), e.if((0, vd.not)(a), () => {
        t.error(!0), s.allErrors || e.break();
      });
    }), t.ok(a);
  }
};
yi.default = gw;
var Cs = {};
Object.defineProperty(Cs, "__esModule", { value: !0 });
const Vn = ae, Qe = ne, yw = gt, Fn = M, $w = {
  message: "must NOT have additional properties",
  params: ({ params: t }) => (0, Qe._)`{additionalProperty: ${t.additionalProperty}}`
}, vw = {
  keyword: "additionalProperties",
  type: ["object"],
  schemaType: ["boolean", "object"],
  allowUndefined: !0,
  trackErrors: !0,
  error: $w,
  code(t) {
    const { gen: e, schema: r, parentSchema: n, data: s, errsCount: a, it: o } = t;
    if (!a)
      throw new Error("ajv implementation error");
    const { allErrors: i, opts: c } = o;
    if (o.props = !0, c.removeAdditional !== "all" && (0, Fn.alwaysValidSchema)(o, r))
      return;
    const l = (0, Vn.allSchemaProperties)(n.properties), d = (0, Vn.allSchemaProperties)(n.patternProperties);
    f(), t.ok((0, Qe._)`${a} === ${yw.default.errors}`);
    function f() {
      e.forIn("key", s, ($) => {
        !l.length && !d.length ? y($) : e.if(w($), () => y($));
      });
    }
    function w($) {
      let p;
      if (l.length > 8) {
        const E = (0, Fn.schemaRefOrVal)(o, n.properties, "properties");
        p = (0, Vn.isOwnProperty)(e, E, $);
      } else l.length ? p = (0, Qe.or)(...l.map((E) => (0, Qe._)`${$} === ${E}`)) : p = Qe.nil;
      return d.length && (p = (0, Qe.or)(p, ...d.map((E) => (0, Qe._)`${(0, Vn.usePattern)(t, E)}.test(${$})`))), (0, Qe.not)(p);
    }
    function g($) {
      e.code((0, Qe._)`delete ${s}[${$}]`);
    }
    function y($) {
      if (c.removeAdditional === "all" || c.removeAdditional && r === !1) {
        g($);
        return;
      }
      if (r === !1) {
        t.setParams({ additionalProperty: $ }), t.error(), i || e.break();
        return;
      }
      if (typeof r == "object" && !(0, Fn.alwaysValidSchema)(o, r)) {
        const p = e.name("valid");
        c.removeAdditional === "failing" ? (v($, p, !1), e.if((0, Qe.not)(p), () => {
          t.reset(), g($);
        })) : (v($, p), i || e.if((0, Qe.not)(p), () => e.break()));
      }
    }
    function v($, p, E) {
      const P = {
        keyword: "additionalProperties",
        dataProp: $,
        dataPropType: Fn.Type.Str
      };
      E === !1 && Object.assign(P, {
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }), t.subschema(P, p);
    }
  }
};
Cs.default = vw;
var $i = {};
Object.defineProperty($i, "__esModule", { value: !0 });
const _w = nt, kc = ae, ra = M, Cc = Cs, ww = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(t) {
    const { gen: e, schema: r, parentSchema: n, data: s, it: a } = t;
    a.opts.removeAdditional === "all" && n.additionalProperties === void 0 && Cc.default.code(new _w.KeywordCxt(a, Cc.default, "additionalProperties"));
    const o = (0, kc.allSchemaProperties)(r);
    for (const f of o)
      a.definedProperties.add(f);
    a.opts.unevaluated && o.length && a.props !== !0 && (a.props = ra.mergeEvaluated.props(e, (0, ra.toHash)(o), a.props));
    const i = o.filter((f) => !(0, ra.alwaysValidSchema)(a, r[f]));
    if (i.length === 0)
      return;
    const c = e.name("valid");
    for (const f of i)
      l(f) ? d(f) : (e.if((0, kc.propertyInData)(e, s, f, a.opts.ownProperties)), d(f), a.allErrors || e.else().var(c, !0), e.endIf()), t.it.definedProperties.add(f), t.ok(c);
    function l(f) {
      return a.opts.useDefaults && !a.compositeRule && r[f].default !== void 0;
    }
    function d(f) {
      t.subschema({
        keyword: "properties",
        schemaProp: f,
        dataProp: f
      }, c);
    }
  }
};
$i.default = ww;
var vi = {};
Object.defineProperty(vi, "__esModule", { value: !0 });
const Ac = ae, zn = ne, Dc = M, Lc = M, Ew = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(t) {
    const { gen: e, schema: r, data: n, parentSchema: s, it: a } = t, { opts: o } = a, i = (0, Ac.allSchemaProperties)(r), c = i.filter((v) => (0, Dc.alwaysValidSchema)(a, r[v]));
    if (i.length === 0 || c.length === i.length && (!a.opts.unevaluated || a.props === !0))
      return;
    const l = o.strictSchema && !o.allowMatchingProperties && s.properties, d = e.name("valid");
    a.props !== !0 && !(a.props instanceof zn.Name) && (a.props = (0, Lc.evaluatedPropsToName)(e, a.props));
    const { props: f } = a;
    w();
    function w() {
      for (const v of i)
        l && g(v), a.allErrors ? y(v) : (e.var(d, !0), y(v), e.if(d));
    }
    function g(v) {
      for (const $ in l)
        new RegExp(v).test($) && (0, Dc.checkStrictMode)(a, `property ${$} matches pattern ${v} (use allowMatchingProperties)`);
    }
    function y(v) {
      e.forIn("key", n, ($) => {
        e.if((0, zn._)`${(0, Ac.usePattern)(t, v)}.test(${$})`, () => {
          const p = c.includes(v);
          p || t.subschema({
            keyword: "patternProperties",
            schemaProp: v,
            dataProp: $,
            dataPropType: Lc.Type.Str
          }, d), a.opts.unevaluated && f !== !0 ? e.assign((0, zn._)`${f}[${$}]`, !0) : !p && !a.allErrors && e.if((0, zn.not)(d), () => e.break());
        });
      });
    }
  }
};
vi.default = Ew;
var _i = {};
Object.defineProperty(_i, "__esModule", { value: !0 });
const bw = M, Sw = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  code(t) {
    const { gen: e, schema: r, it: n } = t;
    if ((0, bw.alwaysValidSchema)(n, r)) {
      t.fail();
      return;
    }
    const s = e.name("valid");
    t.subschema({
      keyword: "not",
      compositeRule: !0,
      createErrors: !1,
      allErrors: !1
    }, s), t.failResult(s, () => t.reset(), () => t.error());
  },
  error: { message: "must NOT be valid" }
};
_i.default = Sw;
var wi = {};
Object.defineProperty(wi, "__esModule", { value: !0 });
const Pw = ae, Ow = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: !0,
  code: Pw.validateUnion,
  error: { message: "must match a schema in anyOf" }
};
wi.default = Ow;
var Ei = {};
Object.defineProperty(Ei, "__esModule", { value: !0 });
const as = ne, Nw = M, Rw = {
  message: "must match exactly one schema in oneOf",
  params: ({ params: t }) => (0, as._)`{passingSchemas: ${t.passing}}`
}, jw = {
  keyword: "oneOf",
  schemaType: "array",
  trackErrors: !0,
  error: Rw,
  code(t) {
    const { gen: e, schema: r, parentSchema: n, it: s } = t;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    if (s.opts.discriminator && n.discriminator)
      return;
    const a = r, o = e.let("valid", !1), i = e.let("passing", null), c = e.name("_valid");
    t.setParams({ passing: i }), e.block(l), t.result(o, () => t.reset(), () => t.error(!0));
    function l() {
      a.forEach((d, f) => {
        let w;
        (0, Nw.alwaysValidSchema)(s, d) ? e.var(c, !0) : w = t.subschema({
          keyword: "oneOf",
          schemaProp: f,
          compositeRule: !0
        }, c), f > 0 && e.if((0, as._)`${c} && ${o}`).assign(o, !1).assign(i, (0, as._)`[${i}, ${f}]`).else(), e.if(c, () => {
          e.assign(o, !0), e.assign(i, f), w && t.mergeEvaluated(w, as.Name);
        });
      });
    }
  }
};
Ei.default = jw;
var bi = {};
Object.defineProperty(bi, "__esModule", { value: !0 });
const Tw = M, Iw = {
  keyword: "allOf",
  schemaType: "array",
  code(t) {
    const { gen: e, schema: r, it: n } = t;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    const s = e.name("valid");
    r.forEach((a, o) => {
      if ((0, Tw.alwaysValidSchema)(n, a))
        return;
      const i = t.subschema({ keyword: "allOf", schemaProp: o }, s);
      t.ok(s), t.mergeEvaluated(i);
    });
  }
};
bi.default = Iw;
var Si = {};
Object.defineProperty(Si, "__esModule", { value: !0 });
const ys = ne, _d = M, kw = {
  message: ({ params: t }) => (0, ys.str)`must match "${t.ifClause}" schema`,
  params: ({ params: t }) => (0, ys._)`{failingKeyword: ${t.ifClause}}`
}, Cw = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: kw,
  code(t) {
    const { gen: e, parentSchema: r, it: n } = t;
    r.then === void 0 && r.else === void 0 && (0, _d.checkStrictMode)(n, '"if" without "then" and "else" is ignored');
    const s = Mc(n, "then"), a = Mc(n, "else");
    if (!s && !a)
      return;
    const o = e.let("valid", !0), i = e.name("_valid");
    if (c(), t.reset(), s && a) {
      const d = e.let("ifClause");
      t.setParams({ ifClause: d }), e.if(i, l("then", d), l("else", d));
    } else s ? e.if(i, l("then")) : e.if((0, ys.not)(i), l("else"));
    t.pass(o, () => t.error(!0));
    function c() {
      const d = t.subschema({
        keyword: "if",
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }, i);
      t.mergeEvaluated(d);
    }
    function l(d, f) {
      return () => {
        const w = t.subschema({ keyword: d }, i);
        e.assign(o, i), t.mergeValidEvaluated(w, o), f ? e.assign(f, (0, ys._)`${d}`) : t.setParams({ ifClause: d });
      };
    }
  }
};
function Mc(t, e) {
  const r = t.schema[e];
  return r !== void 0 && !(0, _d.alwaysValidSchema)(t, r);
}
Si.default = Cw;
var Pi = {};
Object.defineProperty(Pi, "__esModule", { value: !0 });
const Aw = M, Dw = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: t, parentSchema: e, it: r }) {
    e.if === void 0 && (0, Aw.checkStrictMode)(r, `"${t}" without "if" is ignored`);
  }
};
Pi.default = Dw;
Object.defineProperty(hi, "__esModule", { value: !0 });
const Lw = qr, Mw = pi, Vw = xr, Fw = mi, zw = gi, Uw = $d, Kw = yi, qw = Cs, xw = $i, Gw = vi, Hw = _i, Jw = wi, Bw = Ei, Ww = bi, Xw = Si, Yw = Pi;
function Qw(t = !1) {
  const e = [
    // any
    Hw.default,
    Jw.default,
    Bw.default,
    Ww.default,
    Xw.default,
    Yw.default,
    // object
    Kw.default,
    qw.default,
    Uw.default,
    xw.default,
    Gw.default
  ];
  return t ? e.push(Mw.default, Fw.default) : e.push(Lw.default, Vw.default), e.push(zw.default), e;
}
hi.default = Qw;
var Oi = {}, Ni = {};
Object.defineProperty(Ni, "__esModule", { value: !0 });
const ye = ne, Zw = {
  message: ({ schemaCode: t }) => (0, ye.str)`must match format "${t}"`,
  params: ({ schemaCode: t }) => (0, ye._)`{format: ${t}}`
}, eE = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: Zw,
  code(t, e) {
    const { gen: r, data: n, $data: s, schema: a, schemaCode: o, it: i } = t, { opts: c, errSchemaPath: l, schemaEnv: d, self: f } = i;
    if (!c.validateFormats)
      return;
    s ? w() : g();
    function w() {
      const y = r.scopeValue("formats", {
        ref: f.formats,
        code: c.code.formats
      }), v = r.const("fDef", (0, ye._)`${y}[${o}]`), $ = r.let("fType"), p = r.let("format");
      r.if((0, ye._)`typeof ${v} == "object" && !(${v} instanceof RegExp)`, () => r.assign($, (0, ye._)`${v}.type || "string"`).assign(p, (0, ye._)`${v}.validate`), () => r.assign($, (0, ye._)`"string"`).assign(p, v)), t.fail$data((0, ye.or)(E(), P()));
      function E() {
        return c.strictSchema === !1 ? ye.nil : (0, ye._)`${o} && !${p}`;
      }
      function P() {
        const N = d.$async ? (0, ye._)`(${v}.async ? await ${p}(${n}) : ${p}(${n}))` : (0, ye._)`${p}(${n})`, R = (0, ye._)`(typeof ${p} == "function" ? ${N} : ${p}.test(${n}))`;
        return (0, ye._)`${p} && ${p} !== true && ${$} === ${e} && !${R}`;
      }
    }
    function g() {
      const y = f.formats[a];
      if (!y) {
        E();
        return;
      }
      if (y === !0)
        return;
      const [v, $, p] = P(y);
      v === e && t.pass(N());
      function E() {
        if (c.strictSchema === !1) {
          f.logger.warn(R());
          return;
        }
        throw new Error(R());
        function R() {
          return `unknown format "${a}" ignored in schema at path "${l}"`;
        }
      }
      function P(R) {
        const z = R instanceof RegExp ? (0, ye.regexpCode)(R) : c.code.formats ? (0, ye._)`${c.code.formats}${(0, ye.getProperty)(a)}` : void 0, G = r.scopeValue("formats", { key: a, ref: R, code: z });
        return typeof R == "object" && !(R instanceof RegExp) ? [R.type || "string", R.validate, (0, ye._)`${G}.validate`] : ["string", R, G];
      }
      function N() {
        if (typeof y == "object" && !(y instanceof RegExp) && y.async) {
          if (!d.$async)
            throw new Error("async format in sync schema");
          return (0, ye._)`await ${p}(${n})`;
        }
        return typeof $ == "function" ? (0, ye._)`${p}(${n})` : (0, ye._)`${p}.test(${n})`;
      }
    }
  }
};
Ni.default = eE;
Object.defineProperty(Oi, "__esModule", { value: !0 });
const tE = Ni, rE = [tE.default];
Oi.default = rE;
var Lr = {};
Object.defineProperty(Lr, "__esModule", { value: !0 });
Lr.contentVocabulary = Lr.metadataVocabulary = void 0;
Lr.metadataVocabulary = [
  "title",
  "description",
  "default",
  "deprecated",
  "readOnly",
  "writeOnly",
  "examples"
];
Lr.contentVocabulary = [
  "contentMediaType",
  "contentEncoding",
  "contentSchema"
];
Object.defineProperty(Qo, "__esModule", { value: !0 });
const nE = Zo, sE = ti, aE = hi, oE = Oi, Vc = Lr, iE = [
  nE.default,
  sE.default,
  (0, aE.default)(),
  oE.default,
  Vc.metadataVocabulary,
  Vc.contentVocabulary
];
Qo.default = iE;
var Ri = {}, As = {};
Object.defineProperty(As, "__esModule", { value: !0 });
As.DiscrError = void 0;
var Fc;
(function(t) {
  t.Tag = "tag", t.Mapping = "mapping";
})(Fc || (As.DiscrError = Fc = {}));
Object.defineProperty(Ri, "__esModule", { value: !0 });
const Pr = ne, Ia = As, zc = ze, cE = Kr, lE = M, uE = {
  message: ({ params: { discrError: t, tagName: e } }) => t === Ia.DiscrError.Tag ? `tag "${e}" must be string` : `value of tag "${e}" must be in oneOf`,
  params: ({ params: { discrError: t, tag: e, tagName: r } }) => (0, Pr._)`{error: ${t}, tag: ${r}, tagValue: ${e}}`
}, dE = {
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  error: uE,
  code(t) {
    const { gen: e, data: r, schema: n, parentSchema: s, it: a } = t, { oneOf: o } = s;
    if (!a.opts.discriminator)
      throw new Error("discriminator: requires discriminator option");
    const i = n.propertyName;
    if (typeof i != "string")
      throw new Error("discriminator: requires propertyName");
    if (n.mapping)
      throw new Error("discriminator: mapping is not supported");
    if (!o)
      throw new Error("discriminator: requires oneOf keyword");
    const c = e.let("valid", !1), l = e.const("tag", (0, Pr._)`${r}${(0, Pr.getProperty)(i)}`);
    e.if((0, Pr._)`typeof ${l} == "string"`, () => d(), () => t.error(!1, { discrError: Ia.DiscrError.Tag, tag: l, tagName: i })), t.ok(c);
    function d() {
      const g = w();
      e.if(!1);
      for (const y in g)
        e.elseIf((0, Pr._)`${l} === ${y}`), e.assign(c, f(g[y]));
      e.else(), t.error(!1, { discrError: Ia.DiscrError.Mapping, tag: l, tagName: i }), e.endIf();
    }
    function f(g) {
      const y = e.name("valid"), v = t.subschema({ keyword: "oneOf", schemaProp: g }, y);
      return t.mergeEvaluated(v, Pr.Name), y;
    }
    function w() {
      var g;
      const y = {}, v = p(s);
      let $ = !0;
      for (let N = 0; N < o.length; N++) {
        let R = o[N];
        if (R != null && R.$ref && !(0, lE.schemaHasRulesButRef)(R, a.self.RULES)) {
          const G = R.$ref;
          if (R = zc.resolveRef.call(a.self, a.schemaEnv.root, a.baseId, G), R instanceof zc.SchemaEnv && (R = R.schema), R === void 0)
            throw new cE.default(a.opts.uriResolver, a.baseId, G);
        }
        const z = (g = R == null ? void 0 : R.properties) === null || g === void 0 ? void 0 : g[i];
        if (typeof z != "object")
          throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${i}"`);
        $ = $ && (v || p(R)), E(z, N);
      }
      if (!$)
        throw new Error(`discriminator: "${i}" must be required`);
      return y;
      function p({ required: N }) {
        return Array.isArray(N) && N.includes(i);
      }
      function E(N, R) {
        if (N.const)
          P(N.const, R);
        else if (N.enum)
          for (const z of N.enum)
            P(z, R);
        else
          throw new Error(`discriminator: "properties/${i}" must have "const" or "enum"`);
      }
      function P(N, R) {
        if (typeof N != "string" || N in y)
          throw new Error(`discriminator: "${i}" values must be unique strings`);
        y[N] = R;
      }
    }
  }
};
Ri.default = dE;
const fE = "http://json-schema.org/draft-07/schema#", hE = "http://json-schema.org/draft-07/schema#", pE = "Core schema meta-schema", mE = {
  schemaArray: {
    type: "array",
    minItems: 1,
    items: {
      $ref: "#"
    }
  },
  nonNegativeInteger: {
    type: "integer",
    minimum: 0
  },
  nonNegativeIntegerDefault0: {
    allOf: [
      {
        $ref: "#/definitions/nonNegativeInteger"
      },
      {
        default: 0
      }
    ]
  },
  simpleTypes: {
    enum: [
      "array",
      "boolean",
      "integer",
      "null",
      "number",
      "object",
      "string"
    ]
  },
  stringArray: {
    type: "array",
    items: {
      type: "string"
    },
    uniqueItems: !0,
    default: []
  }
}, gE = [
  "object",
  "boolean"
], yE = {
  $id: {
    type: "string",
    format: "uri-reference"
  },
  $schema: {
    type: "string",
    format: "uri"
  },
  $ref: {
    type: "string",
    format: "uri-reference"
  },
  $comment: {
    type: "string"
  },
  title: {
    type: "string"
  },
  description: {
    type: "string"
  },
  default: !0,
  readOnly: {
    type: "boolean",
    default: !1
  },
  examples: {
    type: "array",
    items: !0
  },
  multipleOf: {
    type: "number",
    exclusiveMinimum: 0
  },
  maximum: {
    type: "number"
  },
  exclusiveMaximum: {
    type: "number"
  },
  minimum: {
    type: "number"
  },
  exclusiveMinimum: {
    type: "number"
  },
  maxLength: {
    $ref: "#/definitions/nonNegativeInteger"
  },
  minLength: {
    $ref: "#/definitions/nonNegativeIntegerDefault0"
  },
  pattern: {
    type: "string",
    format: "regex"
  },
  additionalItems: {
    $ref: "#"
  },
  items: {
    anyOf: [
      {
        $ref: "#"
      },
      {
        $ref: "#/definitions/schemaArray"
      }
    ],
    default: !0
  },
  maxItems: {
    $ref: "#/definitions/nonNegativeInteger"
  },
  minItems: {
    $ref: "#/definitions/nonNegativeIntegerDefault0"
  },
  uniqueItems: {
    type: "boolean",
    default: !1
  },
  contains: {
    $ref: "#"
  },
  maxProperties: {
    $ref: "#/definitions/nonNegativeInteger"
  },
  minProperties: {
    $ref: "#/definitions/nonNegativeIntegerDefault0"
  },
  required: {
    $ref: "#/definitions/stringArray"
  },
  additionalProperties: {
    $ref: "#"
  },
  definitions: {
    type: "object",
    additionalProperties: {
      $ref: "#"
    },
    default: {}
  },
  properties: {
    type: "object",
    additionalProperties: {
      $ref: "#"
    },
    default: {}
  },
  patternProperties: {
    type: "object",
    additionalProperties: {
      $ref: "#"
    },
    propertyNames: {
      format: "regex"
    },
    default: {}
  },
  dependencies: {
    type: "object",
    additionalProperties: {
      anyOf: [
        {
          $ref: "#"
        },
        {
          $ref: "#/definitions/stringArray"
        }
      ]
    }
  },
  propertyNames: {
    $ref: "#"
  },
  const: !0,
  enum: {
    type: "array",
    items: !0,
    minItems: 1,
    uniqueItems: !0
  },
  type: {
    anyOf: [
      {
        $ref: "#/definitions/simpleTypes"
      },
      {
        type: "array",
        items: {
          $ref: "#/definitions/simpleTypes"
        },
        minItems: 1,
        uniqueItems: !0
      }
    ]
  },
  format: {
    type: "string"
  },
  contentMediaType: {
    type: "string"
  },
  contentEncoding: {
    type: "string"
  },
  if: {
    $ref: "#"
  },
  then: {
    $ref: "#"
  },
  else: {
    $ref: "#"
  },
  allOf: {
    $ref: "#/definitions/schemaArray"
  },
  anyOf: {
    $ref: "#/definitions/schemaArray"
  },
  oneOf: {
    $ref: "#/definitions/schemaArray"
  },
  not: {
    $ref: "#"
  }
}, $E = {
  $schema: fE,
  $id: hE,
  title: pE,
  definitions: mE,
  type: gE,
  properties: yE,
  default: !0
};
(function(t, e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.MissingRefError = e.ValidationError = e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = e.Ajv = void 0;
  const r = Au, n = Qo, s = Ri, a = $E, o = ["/properties"], i = "http://json-schema.org/draft-07/schema";
  class c extends r.default {
    _addVocabularies() {
      super._addVocabularies(), n.default.forEach((y) => this.addVocabulary(y)), this.opts.discriminator && this.addKeyword(s.default);
    }
    _addDefaultMetaSchema() {
      if (super._addDefaultMetaSchema(), !this.opts.meta)
        return;
      const y = this.opts.$data ? this.$dataMetaSchema(a, o) : a;
      this.addMetaSchema(y, i, !1), this.refs["http://json-schema.org/schema"] = i;
    }
    defaultMeta() {
      return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(i) ? i : void 0);
    }
  }
  e.Ajv = c, t.exports = e = c, t.exports.Ajv = c, Object.defineProperty(e, "__esModule", { value: !0 }), e.default = c;
  var l = nt;
  Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
    return l.KeywordCxt;
  } });
  var d = ne;
  Object.defineProperty(e, "_", { enumerable: !0, get: function() {
    return d._;
  } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
    return d.str;
  } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
    return d.stringify;
  } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
    return d.nil;
  } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
    return d.Name;
  } }), Object.defineProperty(e, "CodeGen", { enumerable: !0, get: function() {
    return d.CodeGen;
  } });
  var f = Pn;
  Object.defineProperty(e, "ValidationError", { enumerable: !0, get: function() {
    return f.default;
  } });
  var w = Kr;
  Object.defineProperty(e, "MissingRefError", { enumerable: !0, get: function() {
    return w.default;
  } });
})(Sa, Sa.exports);
var vE = Sa.exports;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.formatLimitDefinition = void 0;
  const e = vE, r = ne, n = r.operators, s = {
    formatMaximum: { okStr: "<=", ok: n.LTE, fail: n.GT },
    formatMinimum: { okStr: ">=", ok: n.GTE, fail: n.LT },
    formatExclusiveMaximum: { okStr: "<", ok: n.LT, fail: n.GTE },
    formatExclusiveMinimum: { okStr: ">", ok: n.GT, fail: n.LTE }
  }, a = {
    message: ({ keyword: i, schemaCode: c }) => (0, r.str)`should be ${s[i].okStr} ${c}`,
    params: ({ keyword: i, schemaCode: c }) => (0, r._)`{comparison: ${s[i].okStr}, limit: ${c}}`
  };
  t.formatLimitDefinition = {
    keyword: Object.keys(s),
    type: "string",
    schemaType: "string",
    $data: !0,
    error: a,
    code(i) {
      const { gen: c, data: l, schemaCode: d, keyword: f, it: w } = i, { opts: g, self: y } = w;
      if (!g.validateFormats)
        return;
      const v = new e.KeywordCxt(w, y.RULES.all.format.definition, "format");
      v.$data ? $() : p();
      function $() {
        const P = c.scopeValue("formats", {
          ref: y.formats,
          code: g.code.formats
        }), N = c.const("fmt", (0, r._)`${P}[${v.schemaCode}]`);
        i.fail$data((0, r.or)((0, r._)`typeof ${N} != "object"`, (0, r._)`${N} instanceof RegExp`, (0, r._)`typeof ${N}.compare != "function"`, E(N)));
      }
      function p() {
        const P = v.schema, N = y.formats[P];
        if (!N || N === !0)
          return;
        if (typeof N != "object" || N instanceof RegExp || typeof N.compare != "function")
          throw new Error(`"${f}": format "${P}" does not define "compare" function`);
        const R = c.scopeValue("formats", {
          key: P,
          ref: N,
          code: g.code.formats ? (0, r._)`${g.code.formats}${(0, r.getProperty)(P)}` : void 0
        });
        i.fail$data(E(R));
      }
      function E(P) {
        return (0, r._)`${P}.compare(${l}, ${d}) ${s[f].fail} 0`;
      }
    },
    dependencies: ["format"]
  };
  const o = (i) => (i.addKeyword(t.formatLimitDefinition), i);
  t.default = o;
})(Cu);
(function(t, e) {
  Object.defineProperty(e, "__esModule", { value: !0 });
  const r = ku, n = Cu, s = ne, a = new s.Name("fullFormats"), o = new s.Name("fastFormats"), i = (l, d = { keywords: !0 }) => {
    if (Array.isArray(d))
      return c(l, d, r.fullFormats, a), l;
    const [f, w] = d.mode === "fast" ? [r.fastFormats, o] : [r.fullFormats, a], g = d.formats || r.formatNames;
    return c(l, g, f, w), d.keywords && (0, n.default)(l), l;
  };
  i.get = (l, d = "full") => {
    const w = (d === "fast" ? r.fastFormats : r.fullFormats)[l];
    if (!w)
      throw new Error(`Unknown format "${l}"`);
    return w;
  };
  function c(l, d, f, w) {
    var g, y;
    (g = (y = l.opts.code).formats) !== null && g !== void 0 || (y.formats = (0, s._)`require("ajv-formats/dist/formats").${w}`);
    for (const v of d)
      l.addFormat(v, f[v]);
  }
  t.exports = e = i, Object.defineProperty(e, "__esModule", { value: !0 }), e.default = i;
})(ba, ba.exports);
var _E = ba.exports;
const wE = /* @__PURE__ */ kl(_E), EE = (t, e, r, n) => {
  if (r === "length" || r === "prototype" || r === "arguments" || r === "caller")
    return;
  const s = Object.getOwnPropertyDescriptor(t, r), a = Object.getOwnPropertyDescriptor(e, r);
  !bE(s, a) && n || Object.defineProperty(t, r, a);
}, bE = function(t, e) {
  return t === void 0 || t.configurable || t.writable === e.writable && t.enumerable === e.enumerable && t.configurable === e.configurable && (t.writable || t.value === e.value);
}, SE = (t, e) => {
  const r = Object.getPrototypeOf(e);
  r !== Object.getPrototypeOf(t) && Object.setPrototypeOf(t, r);
}, PE = (t, e) => `/* Wrapped ${t}*/
${e}`, OE = Object.getOwnPropertyDescriptor(Function.prototype, "toString"), NE = Object.getOwnPropertyDescriptor(Function.prototype.toString, "name"), RE = (t, e, r) => {
  const n = r === "" ? "" : `with ${r.trim()}() `, s = PE.bind(null, n, e.toString());
  Object.defineProperty(s, "name", NE);
  const { writable: a, enumerable: o, configurable: i } = OE;
  Object.defineProperty(t, "toString", { value: s, writable: a, enumerable: o, configurable: i });
};
function jE(t, e, { ignoreNonConfigurable: r = !1 } = {}) {
  const { name: n } = t;
  for (const s of Reflect.ownKeys(e))
    EE(t, e, s, r);
  return SE(t, e), RE(t, e, n), t;
}
const Uc = (t, e = {}) => {
  if (typeof t != "function")
    throw new TypeError(`Expected the first argument to be a function, got \`${typeof t}\``);
  const {
    wait: r = 0,
    maxWait: n = Number.POSITIVE_INFINITY,
    before: s = !1,
    after: a = !0
  } = e;
  if (r < 0 || n < 0)
    throw new RangeError("`wait` and `maxWait` must not be negative.");
  if (!s && !a)
    throw new Error("Both `before` and `after` are false, function wouldn't be called.");
  let o, i, c;
  const l = function(...d) {
    const f = this, w = () => {
      o = void 0, i && (clearTimeout(i), i = void 0), a && (c = t.apply(f, d));
    }, g = () => {
      i = void 0, o && (clearTimeout(o), o = void 0), a && (c = t.apply(f, d));
    }, y = s && !o;
    return clearTimeout(o), o = setTimeout(w, r), n > 0 && n !== Number.POSITIVE_INFINITY && !i && (i = setTimeout(g, n)), y && (c = t.apply(f, d)), c;
  };
  return jE(l, t), l.cancel = () => {
    o && (clearTimeout(o), o = void 0), i && (clearTimeout(i), i = void 0);
  }, l;
};
var ka = { exports: {} };
const TE = "2.0.0", wd = 256, IE = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
9007199254740991, kE = 16, CE = wd - 6, AE = [
  "major",
  "premajor",
  "minor",
  "preminor",
  "patch",
  "prepatch",
  "prerelease"
];
var Ds = {
  MAX_LENGTH: wd,
  MAX_SAFE_COMPONENT_LENGTH: kE,
  MAX_SAFE_BUILD_LENGTH: CE,
  MAX_SAFE_INTEGER: IE,
  RELEASE_TYPES: AE,
  SEMVER_SPEC_VERSION: TE,
  FLAG_INCLUDE_PRERELEASE: 1,
  FLAG_LOOSE: 2
};
const DE = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...t) => console.error("SEMVER", ...t) : () => {
};
var Ls = DE;
(function(t, e) {
  const {
    MAX_SAFE_COMPONENT_LENGTH: r,
    MAX_SAFE_BUILD_LENGTH: n,
    MAX_LENGTH: s
  } = Ds, a = Ls;
  e = t.exports = {};
  const o = e.re = [], i = e.safeRe = [], c = e.src = [], l = e.safeSrc = [], d = e.t = {};
  let f = 0;
  const w = "[a-zA-Z0-9-]", g = [
    ["\\s", 1],
    ["\\d", s],
    [w, n]
  ], y = ($) => {
    for (const [p, E] of g)
      $ = $.split(`${p}*`).join(`${p}{0,${E}}`).split(`${p}+`).join(`${p}{1,${E}}`);
    return $;
  }, v = ($, p, E) => {
    const P = y(p), N = f++;
    a($, N, p), d[$] = N, c[N] = p, l[N] = P, o[N] = new RegExp(p, E ? "g" : void 0), i[N] = new RegExp(P, E ? "g" : void 0);
  };
  v("NUMERICIDENTIFIER", "0|[1-9]\\d*"), v("NUMERICIDENTIFIERLOOSE", "\\d+"), v("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${w}*`), v("MAINVERSION", `(${c[d.NUMERICIDENTIFIER]})\\.(${c[d.NUMERICIDENTIFIER]})\\.(${c[d.NUMERICIDENTIFIER]})`), v("MAINVERSIONLOOSE", `(${c[d.NUMERICIDENTIFIERLOOSE]})\\.(${c[d.NUMERICIDENTIFIERLOOSE]})\\.(${c[d.NUMERICIDENTIFIERLOOSE]})`), v("PRERELEASEIDENTIFIER", `(?:${c[d.NONNUMERICIDENTIFIER]}|${c[d.NUMERICIDENTIFIER]})`), v("PRERELEASEIDENTIFIERLOOSE", `(?:${c[d.NONNUMERICIDENTIFIER]}|${c[d.NUMERICIDENTIFIERLOOSE]})`), v("PRERELEASE", `(?:-(${c[d.PRERELEASEIDENTIFIER]}(?:\\.${c[d.PRERELEASEIDENTIFIER]})*))`), v("PRERELEASELOOSE", `(?:-?(${c[d.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${c[d.PRERELEASEIDENTIFIERLOOSE]})*))`), v("BUILDIDENTIFIER", `${w}+`), v("BUILD", `(?:\\+(${c[d.BUILDIDENTIFIER]}(?:\\.${c[d.BUILDIDENTIFIER]})*))`), v("FULLPLAIN", `v?${c[d.MAINVERSION]}${c[d.PRERELEASE]}?${c[d.BUILD]}?`), v("FULL", `^${c[d.FULLPLAIN]}$`), v("LOOSEPLAIN", `[v=\\s]*${c[d.MAINVERSIONLOOSE]}${c[d.PRERELEASELOOSE]}?${c[d.BUILD]}?`), v("LOOSE", `^${c[d.LOOSEPLAIN]}$`), v("GTLT", "((?:<|>)?=?)"), v("XRANGEIDENTIFIERLOOSE", `${c[d.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), v("XRANGEIDENTIFIER", `${c[d.NUMERICIDENTIFIER]}|x|X|\\*`), v("XRANGEPLAIN", `[v=\\s]*(${c[d.XRANGEIDENTIFIER]})(?:\\.(${c[d.XRANGEIDENTIFIER]})(?:\\.(${c[d.XRANGEIDENTIFIER]})(?:${c[d.PRERELEASE]})?${c[d.BUILD]}?)?)?`), v("XRANGEPLAINLOOSE", `[v=\\s]*(${c[d.XRANGEIDENTIFIERLOOSE]})(?:\\.(${c[d.XRANGEIDENTIFIERLOOSE]})(?:\\.(${c[d.XRANGEIDENTIFIERLOOSE]})(?:${c[d.PRERELEASELOOSE]})?${c[d.BUILD]}?)?)?`), v("XRANGE", `^${c[d.GTLT]}\\s*${c[d.XRANGEPLAIN]}$`), v("XRANGELOOSE", `^${c[d.GTLT]}\\s*${c[d.XRANGEPLAINLOOSE]}$`), v("COERCEPLAIN", `(^|[^\\d])(\\d{1,${r}})(?:\\.(\\d{1,${r}}))?(?:\\.(\\d{1,${r}}))?`), v("COERCE", `${c[d.COERCEPLAIN]}(?:$|[^\\d])`), v("COERCEFULL", c[d.COERCEPLAIN] + `(?:${c[d.PRERELEASE]})?(?:${c[d.BUILD]})?(?:$|[^\\d])`), v("COERCERTL", c[d.COERCE], !0), v("COERCERTLFULL", c[d.COERCEFULL], !0), v("LONETILDE", "(?:~>?)"), v("TILDETRIM", `(\\s*)${c[d.LONETILDE]}\\s+`, !0), e.tildeTrimReplace = "$1~", v("TILDE", `^${c[d.LONETILDE]}${c[d.XRANGEPLAIN]}$`), v("TILDELOOSE", `^${c[d.LONETILDE]}${c[d.XRANGEPLAINLOOSE]}$`), v("LONECARET", "(?:\\^)"), v("CARETTRIM", `(\\s*)${c[d.LONECARET]}\\s+`, !0), e.caretTrimReplace = "$1^", v("CARET", `^${c[d.LONECARET]}${c[d.XRANGEPLAIN]}$`), v("CARETLOOSE", `^${c[d.LONECARET]}${c[d.XRANGEPLAINLOOSE]}$`), v("COMPARATORLOOSE", `^${c[d.GTLT]}\\s*(${c[d.LOOSEPLAIN]})$|^$`), v("COMPARATOR", `^${c[d.GTLT]}\\s*(${c[d.FULLPLAIN]})$|^$`), v("COMPARATORTRIM", `(\\s*)${c[d.GTLT]}\\s*(${c[d.LOOSEPLAIN]}|${c[d.XRANGEPLAIN]})`, !0), e.comparatorTrimReplace = "$1$2$3", v("HYPHENRANGE", `^\\s*(${c[d.XRANGEPLAIN]})\\s+-\\s+(${c[d.XRANGEPLAIN]})\\s*$`), v("HYPHENRANGELOOSE", `^\\s*(${c[d.XRANGEPLAINLOOSE]})\\s+-\\s+(${c[d.XRANGEPLAINLOOSE]})\\s*$`), v("STAR", "(<|>)?=?\\s*\\*"), v("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), v("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
})(ka, ka.exports);
var Nn = ka.exports;
const LE = Object.freeze({ loose: !0 }), ME = Object.freeze({}), VE = (t) => t ? typeof t != "object" ? LE : t : ME;
var ji = VE;
const Kc = /^[0-9]+$/, Ed = (t, e) => {
  if (typeof t == "number" && typeof e == "number")
    return t === e ? 0 : t < e ? -1 : 1;
  const r = Kc.test(t), n = Kc.test(e);
  return r && n && (t = +t, e = +e), t === e ? 0 : r && !n ? -1 : n && !r ? 1 : t < e ? -1 : 1;
}, FE = (t, e) => Ed(e, t);
var bd = {
  compareIdentifiers: Ed,
  rcompareIdentifiers: FE
};
const Un = Ls, { MAX_LENGTH: qc, MAX_SAFE_INTEGER: Kn } = Ds, { safeRe: qn, t: xn } = Nn, zE = ji, { compareIdentifiers: na } = bd;
let UE = class it {
  constructor(e, r) {
    if (r = zE(r), e instanceof it) {
      if (e.loose === !!r.loose && e.includePrerelease === !!r.includePrerelease)
        return e;
      e = e.version;
    } else if (typeof e != "string")
      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof e}".`);
    if (e.length > qc)
      throw new TypeError(
        `version is longer than ${qc} characters`
      );
    Un("SemVer", e, r), this.options = r, this.loose = !!r.loose, this.includePrerelease = !!r.includePrerelease;
    const n = e.trim().match(r.loose ? qn[xn.LOOSE] : qn[xn.FULL]);
    if (!n)
      throw new TypeError(`Invalid Version: ${e}`);
    if (this.raw = e, this.major = +n[1], this.minor = +n[2], this.patch = +n[3], this.major > Kn || this.major < 0)
      throw new TypeError("Invalid major version");
    if (this.minor > Kn || this.minor < 0)
      throw new TypeError("Invalid minor version");
    if (this.patch > Kn || this.patch < 0)
      throw new TypeError("Invalid patch version");
    n[4] ? this.prerelease = n[4].split(".").map((s) => {
      if (/^[0-9]+$/.test(s)) {
        const a = +s;
        if (a >= 0 && a < Kn)
          return a;
      }
      return s;
    }) : this.prerelease = [], this.build = n[5] ? n[5].split(".") : [], this.format();
  }
  format() {
    return this.version = `${this.major}.${this.minor}.${this.patch}`, this.prerelease.length && (this.version += `-${this.prerelease.join(".")}`), this.version;
  }
  toString() {
    return this.version;
  }
  compare(e) {
    if (Un("SemVer.compare", this.version, this.options, e), !(e instanceof it)) {
      if (typeof e == "string" && e === this.version)
        return 0;
      e = new it(e, this.options);
    }
    return e.version === this.version ? 0 : this.compareMain(e) || this.comparePre(e);
  }
  compareMain(e) {
    return e instanceof it || (e = new it(e, this.options)), this.major < e.major ? -1 : this.major > e.major ? 1 : this.minor < e.minor ? -1 : this.minor > e.minor ? 1 : this.patch < e.patch ? -1 : this.patch > e.patch ? 1 : 0;
  }
  comparePre(e) {
    if (e instanceof it || (e = new it(e, this.options)), this.prerelease.length && !e.prerelease.length)
      return -1;
    if (!this.prerelease.length && e.prerelease.length)
      return 1;
    if (!this.prerelease.length && !e.prerelease.length)
      return 0;
    let r = 0;
    do {
      const n = this.prerelease[r], s = e.prerelease[r];
      if (Un("prerelease compare", r, n, s), n === void 0 && s === void 0)
        return 0;
      if (s === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === s)
        continue;
      return na(n, s);
    } while (++r);
  }
  compareBuild(e) {
    e instanceof it || (e = new it(e, this.options));
    let r = 0;
    do {
      const n = this.build[r], s = e.build[r];
      if (Un("build compare", r, n, s), n === void 0 && s === void 0)
        return 0;
      if (s === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === s)
        continue;
      return na(n, s);
    } while (++r);
  }
  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc(e, r, n) {
    if (e.startsWith("pre")) {
      if (!r && n === !1)
        throw new Error("invalid increment argument: identifier is empty");
      if (r) {
        const s = `-${r}`.match(this.options.loose ? qn[xn.PRERELEASELOOSE] : qn[xn.PRERELEASE]);
        if (!s || s[1] !== r)
          throw new Error(`invalid identifier: ${r}`);
      }
    }
    switch (e) {
      case "premajor":
        this.prerelease.length = 0, this.patch = 0, this.minor = 0, this.major++, this.inc("pre", r, n);
        break;
      case "preminor":
        this.prerelease.length = 0, this.patch = 0, this.minor++, this.inc("pre", r, n);
        break;
      case "prepatch":
        this.prerelease.length = 0, this.inc("patch", r, n), this.inc("pre", r, n);
        break;
      case "prerelease":
        this.prerelease.length === 0 && this.inc("patch", r, n), this.inc("pre", r, n);
        break;
      case "release":
        if (this.prerelease.length === 0)
          throw new Error(`version ${this.raw} is not a prerelease`);
        this.prerelease.length = 0;
        break;
      case "major":
        (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) && this.major++, this.minor = 0, this.patch = 0, this.prerelease = [];
        break;
      case "minor":
        (this.patch !== 0 || this.prerelease.length === 0) && this.minor++, this.patch = 0, this.prerelease = [];
        break;
      case "patch":
        this.prerelease.length === 0 && this.patch++, this.prerelease = [];
        break;
      case "pre": {
        const s = Number(n) ? 1 : 0;
        if (this.prerelease.length === 0)
          this.prerelease = [s];
        else {
          let a = this.prerelease.length;
          for (; --a >= 0; )
            typeof this.prerelease[a] == "number" && (this.prerelease[a]++, a = -2);
          if (a === -1) {
            if (r === this.prerelease.join(".") && n === !1)
              throw new Error("invalid increment argument: identifier already exists");
            this.prerelease.push(s);
          }
        }
        if (r) {
          let a = [r, s];
          n === !1 && (a = [r]), na(this.prerelease[0], r) === 0 ? isNaN(this.prerelease[1]) && (this.prerelease = a) : this.prerelease = a;
        }
        break;
      }
      default:
        throw new Error(`invalid increment argument: ${e}`);
    }
    return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), this;
  }
};
var Le = UE;
const xc = Le, KE = (t, e, r = !1) => {
  if (t instanceof xc)
    return t;
  try {
    return new xc(t, e);
  } catch (n) {
    if (!r)
      return null;
    throw n;
  }
};
var Gr = KE;
const qE = Gr, xE = (t, e) => {
  const r = qE(t, e);
  return r ? r.version : null;
};
var GE = xE;
const HE = Gr, JE = (t, e) => {
  const r = HE(t.trim().replace(/^[=v]+/, ""), e);
  return r ? r.version : null;
};
var BE = JE;
const Gc = Le, WE = (t, e, r, n, s) => {
  typeof r == "string" && (s = n, n = r, r = void 0);
  try {
    return new Gc(
      t instanceof Gc ? t.version : t,
      r
    ).inc(e, n, s).version;
  } catch {
    return null;
  }
};
var XE = WE;
const Hc = Gr, YE = (t, e) => {
  const r = Hc(t, null, !0), n = Hc(e, null, !0), s = r.compare(n);
  if (s === 0)
    return null;
  const a = s > 0, o = a ? r : n, i = a ? n : r, c = !!o.prerelease.length;
  if (!!i.prerelease.length && !c) {
    if (!i.patch && !i.minor)
      return "major";
    if (i.compareMain(o) === 0)
      return i.minor && !i.patch ? "minor" : "patch";
  }
  const d = c ? "pre" : "";
  return r.major !== n.major ? d + "major" : r.minor !== n.minor ? d + "minor" : r.patch !== n.patch ? d + "patch" : "prerelease";
};
var QE = YE;
const ZE = Le, eb = (t, e) => new ZE(t, e).major;
var tb = eb;
const rb = Le, nb = (t, e) => new rb(t, e).minor;
var sb = nb;
const ab = Le, ob = (t, e) => new ab(t, e).patch;
var ib = ob;
const cb = Gr, lb = (t, e) => {
  const r = cb(t, e);
  return r && r.prerelease.length ? r.prerelease : null;
};
var ub = lb;
const Jc = Le, db = (t, e, r) => new Jc(t, r).compare(new Jc(e, r));
var st = db;
const fb = st, hb = (t, e, r) => fb(e, t, r);
var pb = hb;
const mb = st, gb = (t, e) => mb(t, e, !0);
var yb = gb;
const Bc = Le, $b = (t, e, r) => {
  const n = new Bc(t, r), s = new Bc(e, r);
  return n.compare(s) || n.compareBuild(s);
};
var Ti = $b;
const vb = Ti, _b = (t, e) => t.sort((r, n) => vb(r, n, e));
var wb = _b;
const Eb = Ti, bb = (t, e) => t.sort((r, n) => Eb(n, r, e));
var Sb = bb;
const Pb = st, Ob = (t, e, r) => Pb(t, e, r) > 0;
var Ms = Ob;
const Nb = st, Rb = (t, e, r) => Nb(t, e, r) < 0;
var Ii = Rb;
const jb = st, Tb = (t, e, r) => jb(t, e, r) === 0;
var Sd = Tb;
const Ib = st, kb = (t, e, r) => Ib(t, e, r) !== 0;
var Pd = kb;
const Cb = st, Ab = (t, e, r) => Cb(t, e, r) >= 0;
var ki = Ab;
const Db = st, Lb = (t, e, r) => Db(t, e, r) <= 0;
var Ci = Lb;
const Mb = Sd, Vb = Pd, Fb = Ms, zb = ki, Ub = Ii, Kb = Ci, qb = (t, e, r, n) => {
  switch (e) {
    case "===":
      return typeof t == "object" && (t = t.version), typeof r == "object" && (r = r.version), t === r;
    case "!==":
      return typeof t == "object" && (t = t.version), typeof r == "object" && (r = r.version), t !== r;
    case "":
    case "=":
    case "==":
      return Mb(t, r, n);
    case "!=":
      return Vb(t, r, n);
    case ">":
      return Fb(t, r, n);
    case ">=":
      return zb(t, r, n);
    case "<":
      return Ub(t, r, n);
    case "<=":
      return Kb(t, r, n);
    default:
      throw new TypeError(`Invalid operator: ${e}`);
  }
};
var Od = qb;
const xb = Le, Gb = Gr, { safeRe: Gn, t: Hn } = Nn, Hb = (t, e) => {
  if (t instanceof xb)
    return t;
  if (typeof t == "number" && (t = String(t)), typeof t != "string")
    return null;
  e = e || {};
  let r = null;
  if (!e.rtl)
    r = t.match(e.includePrerelease ? Gn[Hn.COERCEFULL] : Gn[Hn.COERCE]);
  else {
    const c = e.includePrerelease ? Gn[Hn.COERCERTLFULL] : Gn[Hn.COERCERTL];
    let l;
    for (; (l = c.exec(t)) && (!r || r.index + r[0].length !== t.length); )
      (!r || l.index + l[0].length !== r.index + r[0].length) && (r = l), c.lastIndex = l.index + l[1].length + l[2].length;
    c.lastIndex = -1;
  }
  if (r === null)
    return null;
  const n = r[2], s = r[3] || "0", a = r[4] || "0", o = e.includePrerelease && r[5] ? `-${r[5]}` : "", i = e.includePrerelease && r[6] ? `+${r[6]}` : "";
  return Gb(`${n}.${s}.${a}${o}${i}`, e);
};
var Jb = Hb;
class Bb {
  constructor() {
    this.max = 1e3, this.map = /* @__PURE__ */ new Map();
  }
  get(e) {
    const r = this.map.get(e);
    if (r !== void 0)
      return this.map.delete(e), this.map.set(e, r), r;
  }
  delete(e) {
    return this.map.delete(e);
  }
  set(e, r) {
    if (!this.delete(e) && r !== void 0) {
      if (this.map.size >= this.max) {
        const s = this.map.keys().next().value;
        this.delete(s);
      }
      this.map.set(e, r);
    }
    return this;
  }
}
var Wb = Bb, sa, Wc;
function at() {
  if (Wc) return sa;
  Wc = 1;
  const t = /\s+/g;
  class e {
    constructor(k, A) {
      if (A = s(A), k instanceof e)
        return k.loose === !!A.loose && k.includePrerelease === !!A.includePrerelease ? k : new e(k.raw, A);
      if (k instanceof a)
        return this.raw = k.value, this.set = [[k]], this.formatted = void 0, this;
      if (this.options = A, this.loose = !!A.loose, this.includePrerelease = !!A.includePrerelease, this.raw = k.trim().replace(t, " "), this.set = this.raw.split("||").map((C) => this.parseRange(C.trim())).filter((C) => C.length), !this.set.length)
        throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
      if (this.set.length > 1) {
        const C = this.set[0];
        if (this.set = this.set.filter((V) => !v(V[0])), this.set.length === 0)
          this.set = [C];
        else if (this.set.length > 1) {
          for (const V of this.set)
            if (V.length === 1 && $(V[0])) {
              this.set = [V];
              break;
            }
        }
      }
      this.formatted = void 0;
    }
    get range() {
      if (this.formatted === void 0) {
        this.formatted = "";
        for (let k = 0; k < this.set.length; k++) {
          k > 0 && (this.formatted += "||");
          const A = this.set[k];
          for (let C = 0; C < A.length; C++)
            C > 0 && (this.formatted += " "), this.formatted += A[C].toString().trim();
        }
      }
      return this.formatted;
    }
    format() {
      return this.range;
    }
    toString() {
      return this.range;
    }
    parseRange(k) {
      const C = ((this.options.includePrerelease && g) | (this.options.loose && y)) + ":" + k, V = n.get(C);
      if (V)
        return V;
      const L = this.options.loose, O = L ? c[l.HYPHENRANGELOOSE] : c[l.HYPHENRANGE];
      k = k.replace(O, H(this.options.includePrerelease)), o("hyphen replace", k), k = k.replace(c[l.COMPARATORTRIM], d), o("comparator trim", k), k = k.replace(c[l.TILDETRIM], f), o("tilde trim", k), k = k.replace(c[l.CARETTRIM], w), o("caret trim", k);
      let m = k.split(" ").map((h) => E(h, this.options)).join(" ").split(/\s+/).map((h) => U(h, this.options));
      L && (m = m.filter((h) => (o("loose invalid filter", h, this.options), !!h.match(c[l.COMPARATORLOOSE])))), o("range list", m);
      const b = /* @__PURE__ */ new Map(), _ = m.map((h) => new a(h, this.options));
      for (const h of _) {
        if (v(h))
          return [h];
        b.set(h.value, h);
      }
      b.size > 1 && b.has("") && b.delete("");
      const u = [...b.values()];
      return n.set(C, u), u;
    }
    intersects(k, A) {
      if (!(k instanceof e))
        throw new TypeError("a Range is required");
      return this.set.some((C) => p(C, A) && k.set.some((V) => p(V, A) && C.every((L) => V.every((O) => L.intersects(O, A)))));
    }
    // if ANY of the sets match ALL of its comparators, then pass
    test(k) {
      if (!k)
        return !1;
      if (typeof k == "string")
        try {
          k = new i(k, this.options);
        } catch {
          return !1;
        }
      for (let A = 0; A < this.set.length; A++)
        if (X(this.set[A], k, this.options))
          return !0;
      return !1;
    }
  }
  sa = e;
  const r = Wb, n = new r(), s = ji, a = Vs(), o = Ls, i = Le, {
    safeRe: c,
    t: l,
    comparatorTrimReplace: d,
    tildeTrimReplace: f,
    caretTrimReplace: w
  } = Nn, { FLAG_INCLUDE_PRERELEASE: g, FLAG_LOOSE: y } = Ds, v = (j) => j.value === "<0.0.0-0", $ = (j) => j.value === "", p = (j, k) => {
    let A = !0;
    const C = j.slice();
    let V = C.pop();
    for (; A && C.length; )
      A = C.every((L) => V.intersects(L, k)), V = C.pop();
    return A;
  }, E = (j, k) => (j = j.replace(c[l.BUILD], ""), o("comp", j, k), j = z(j, k), o("caret", j), j = N(j, k), o("tildes", j), j = ue(j, k), o("xrange", j), j = ce(j, k), o("stars", j), j), P = (j) => !j || j.toLowerCase() === "x" || j === "*", N = (j, k) => j.trim().split(/\s+/).map((A) => R(A, k)).join(" "), R = (j, k) => {
    const A = k.loose ? c[l.TILDELOOSE] : c[l.TILDE];
    return j.replace(A, (C, V, L, O, m) => {
      o("tilde", j, C, V, L, O, m);
      let b;
      return P(V) ? b = "" : P(L) ? b = `>=${V}.0.0 <${+V + 1}.0.0-0` : P(O) ? b = `>=${V}.${L}.0 <${V}.${+L + 1}.0-0` : m ? (o("replaceTilde pr", m), b = `>=${V}.${L}.${O}-${m} <${V}.${+L + 1}.0-0`) : b = `>=${V}.${L}.${O} <${V}.${+L + 1}.0-0`, o("tilde return", b), b;
    });
  }, z = (j, k) => j.trim().split(/\s+/).map((A) => G(A, k)).join(" "), G = (j, k) => {
    o("caret", j, k);
    const A = k.loose ? c[l.CARETLOOSE] : c[l.CARET], C = k.includePrerelease ? "-0" : "";
    return j.replace(A, (V, L, O, m, b) => {
      o("caret", j, V, L, O, m, b);
      let _;
      return P(L) ? _ = "" : P(O) ? _ = `>=${L}.0.0${C} <${+L + 1}.0.0-0` : P(m) ? L === "0" ? _ = `>=${L}.${O}.0${C} <${L}.${+O + 1}.0-0` : _ = `>=${L}.${O}.0${C} <${+L + 1}.0.0-0` : b ? (o("replaceCaret pr", b), L === "0" ? O === "0" ? _ = `>=${L}.${O}.${m}-${b} <${L}.${O}.${+m + 1}-0` : _ = `>=${L}.${O}.${m}-${b} <${L}.${+O + 1}.0-0` : _ = `>=${L}.${O}.${m}-${b} <${+L + 1}.0.0-0`) : (o("no pr"), L === "0" ? O === "0" ? _ = `>=${L}.${O}.${m}${C} <${L}.${O}.${+m + 1}-0` : _ = `>=${L}.${O}.${m}${C} <${L}.${+O + 1}.0-0` : _ = `>=${L}.${O}.${m} <${+L + 1}.0.0-0`), o("caret return", _), _;
    });
  }, ue = (j, k) => (o("replaceXRanges", j, k), j.split(/\s+/).map((A) => ie(A, k)).join(" ")), ie = (j, k) => {
    j = j.trim();
    const A = k.loose ? c[l.XRANGELOOSE] : c[l.XRANGE];
    return j.replace(A, (C, V, L, O, m, b) => {
      o("xRange", j, C, V, L, O, m, b);
      const _ = P(L), u = _ || P(O), h = u || P(m), S = h;
      return V === "=" && S && (V = ""), b = k.includePrerelease ? "-0" : "", _ ? V === ">" || V === "<" ? C = "<0.0.0-0" : C = "*" : V && S ? (u && (O = 0), m = 0, V === ">" ? (V = ">=", u ? (L = +L + 1, O = 0, m = 0) : (O = +O + 1, m = 0)) : V === "<=" && (V = "<", u ? L = +L + 1 : O = +O + 1), V === "<" && (b = "-0"), C = `${V + L}.${O}.${m}${b}`) : u ? C = `>=${L}.0.0${b} <${+L + 1}.0.0-0` : h && (C = `>=${L}.${O}.0${b} <${L}.${+O + 1}.0-0`), o("xRange return", C), C;
    });
  }, ce = (j, k) => (o("replaceStars", j, k), j.trim().replace(c[l.STAR], "")), U = (j, k) => (o("replaceGTE0", j, k), j.trim().replace(c[k.includePrerelease ? l.GTE0PRE : l.GTE0], "")), H = (j) => (k, A, C, V, L, O, m, b, _, u, h, S) => (P(C) ? A = "" : P(V) ? A = `>=${C}.0.0${j ? "-0" : ""}` : P(L) ? A = `>=${C}.${V}.0${j ? "-0" : ""}` : O ? A = `>=${A}` : A = `>=${A}${j ? "-0" : ""}`, P(_) ? b = "" : P(u) ? b = `<${+_ + 1}.0.0-0` : P(h) ? b = `<${_}.${+u + 1}.0-0` : S ? b = `<=${_}.${u}.${h}-${S}` : j ? b = `<${_}.${u}.${+h + 1}-0` : b = `<=${b}`, `${A} ${b}`.trim()), X = (j, k, A) => {
    for (let C = 0; C < j.length; C++)
      if (!j[C].test(k))
        return !1;
    if (k.prerelease.length && !A.includePrerelease) {
      for (let C = 0; C < j.length; C++)
        if (o(j[C].semver), j[C].semver !== a.ANY && j[C].semver.prerelease.length > 0) {
          const V = j[C].semver;
          if (V.major === k.major && V.minor === k.minor && V.patch === k.patch)
            return !0;
        }
      return !1;
    }
    return !0;
  };
  return sa;
}
var aa, Xc;
function Vs() {
  if (Xc) return aa;
  Xc = 1;
  const t = Symbol("SemVer ANY");
  class e {
    static get ANY() {
      return t;
    }
    constructor(d, f) {
      if (f = r(f), d instanceof e) {
        if (d.loose === !!f.loose)
          return d;
        d = d.value;
      }
      d = d.trim().split(/\s+/).join(" "), o("comparator", d, f), this.options = f, this.loose = !!f.loose, this.parse(d), this.semver === t ? this.value = "" : this.value = this.operator + this.semver.version, o("comp", this);
    }
    parse(d) {
      const f = this.options.loose ? n[s.COMPARATORLOOSE] : n[s.COMPARATOR], w = d.match(f);
      if (!w)
        throw new TypeError(`Invalid comparator: ${d}`);
      this.operator = w[1] !== void 0 ? w[1] : "", this.operator === "=" && (this.operator = ""), w[2] ? this.semver = new i(w[2], this.options.loose) : this.semver = t;
    }
    toString() {
      return this.value;
    }
    test(d) {
      if (o("Comparator.test", d, this.options.loose), this.semver === t || d === t)
        return !0;
      if (typeof d == "string")
        try {
          d = new i(d, this.options);
        } catch {
          return !1;
        }
      return a(d, this.operator, this.semver, this.options);
    }
    intersects(d, f) {
      if (!(d instanceof e))
        throw new TypeError("a Comparator is required");
      return this.operator === "" ? this.value === "" ? !0 : new c(d.value, f).test(this.value) : d.operator === "" ? d.value === "" ? !0 : new c(this.value, f).test(d.semver) : (f = r(f), f.includePrerelease && (this.value === "<0.0.0-0" || d.value === "<0.0.0-0") || !f.includePrerelease && (this.value.startsWith("<0.0.0") || d.value.startsWith("<0.0.0")) ? !1 : !!(this.operator.startsWith(">") && d.operator.startsWith(">") || this.operator.startsWith("<") && d.operator.startsWith("<") || this.semver.version === d.semver.version && this.operator.includes("=") && d.operator.includes("=") || a(this.semver, "<", d.semver, f) && this.operator.startsWith(">") && d.operator.startsWith("<") || a(this.semver, ">", d.semver, f) && this.operator.startsWith("<") && d.operator.startsWith(">")));
    }
  }
  aa = e;
  const r = ji, { safeRe: n, t: s } = Nn, a = Od, o = Ls, i = Le, c = at();
  return aa;
}
const Xb = at(), Yb = (t, e, r) => {
  try {
    e = new Xb(e, r);
  } catch {
    return !1;
  }
  return e.test(t);
};
var Fs = Yb;
const Qb = at(), Zb = (t, e) => new Qb(t, e).set.map((r) => r.map((n) => n.value).join(" ").trim().split(" "));
var eS = Zb;
const tS = Le, rS = at(), nS = (t, e, r) => {
  let n = null, s = null, a = null;
  try {
    a = new rS(e, r);
  } catch {
    return null;
  }
  return t.forEach((o) => {
    a.test(o) && (!n || s.compare(o) === -1) && (n = o, s = new tS(n, r));
  }), n;
};
var sS = nS;
const aS = Le, oS = at(), iS = (t, e, r) => {
  let n = null, s = null, a = null;
  try {
    a = new oS(e, r);
  } catch {
    return null;
  }
  return t.forEach((o) => {
    a.test(o) && (!n || s.compare(o) === 1) && (n = o, s = new aS(n, r));
  }), n;
};
var cS = iS;
const oa = Le, lS = at(), Yc = Ms, uS = (t, e) => {
  t = new lS(t, e);
  let r = new oa("0.0.0");
  if (t.test(r) || (r = new oa("0.0.0-0"), t.test(r)))
    return r;
  r = null;
  for (let n = 0; n < t.set.length; ++n) {
    const s = t.set[n];
    let a = null;
    s.forEach((o) => {
      const i = new oa(o.semver.version);
      switch (o.operator) {
        case ">":
          i.prerelease.length === 0 ? i.patch++ : i.prerelease.push(0), i.raw = i.format();
        case "":
        case ">=":
          (!a || Yc(i, a)) && (a = i);
          break;
        case "<":
        case "<=":
          break;
        default:
          throw new Error(`Unexpected operation: ${o.operator}`);
      }
    }), a && (!r || Yc(r, a)) && (r = a);
  }
  return r && t.test(r) ? r : null;
};
var dS = uS;
const fS = at(), hS = (t, e) => {
  try {
    return new fS(t, e).range || "*";
  } catch {
    return null;
  }
};
var pS = hS;
const mS = Le, Nd = Vs(), { ANY: gS } = Nd, yS = at(), $S = Fs, Qc = Ms, Zc = Ii, vS = Ci, _S = ki, wS = (t, e, r, n) => {
  t = new mS(t, n), e = new yS(e, n);
  let s, a, o, i, c;
  switch (r) {
    case ">":
      s = Qc, a = vS, o = Zc, i = ">", c = ">=";
      break;
    case "<":
      s = Zc, a = _S, o = Qc, i = "<", c = "<=";
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }
  if ($S(t, e, n))
    return !1;
  for (let l = 0; l < e.set.length; ++l) {
    const d = e.set[l];
    let f = null, w = null;
    if (d.forEach((g) => {
      g.semver === gS && (g = new Nd(">=0.0.0")), f = f || g, w = w || g, s(g.semver, f.semver, n) ? f = g : o(g.semver, w.semver, n) && (w = g);
    }), f.operator === i || f.operator === c || (!w.operator || w.operator === i) && a(t, w.semver))
      return !1;
    if (w.operator === c && o(t, w.semver))
      return !1;
  }
  return !0;
};
var Ai = wS;
const ES = Ai, bS = (t, e, r) => ES(t, e, ">", r);
var SS = bS;
const PS = Ai, OS = (t, e, r) => PS(t, e, "<", r);
var NS = OS;
const el = at(), RS = (t, e, r) => (t = new el(t, r), e = new el(e, r), t.intersects(e, r));
var jS = RS;
const TS = Fs, IS = st;
var kS = (t, e, r) => {
  const n = [];
  let s = null, a = null;
  const o = t.sort((d, f) => IS(d, f, r));
  for (const d of o)
    TS(d, e, r) ? (a = d, s || (s = d)) : (a && n.push([s, a]), a = null, s = null);
  s && n.push([s, null]);
  const i = [];
  for (const [d, f] of n)
    d === f ? i.push(d) : !f && d === o[0] ? i.push("*") : f ? d === o[0] ? i.push(`<=${f}`) : i.push(`${d} - ${f}`) : i.push(`>=${d}`);
  const c = i.join(" || "), l = typeof e.raw == "string" ? e.raw : String(e);
  return c.length < l.length ? c : e;
};
const tl = at(), Di = Vs(), { ANY: ia } = Di, Zr = Fs, Li = st, CS = (t, e, r = {}) => {
  if (t === e)
    return !0;
  t = new tl(t, r), e = new tl(e, r);
  let n = !1;
  e: for (const s of t.set) {
    for (const a of e.set) {
      const o = DS(s, a, r);
      if (n = n || o !== null, o)
        continue e;
    }
    if (n)
      return !1;
  }
  return !0;
}, AS = [new Di(">=0.0.0-0")], rl = [new Di(">=0.0.0")], DS = (t, e, r) => {
  if (t === e)
    return !0;
  if (t.length === 1 && t[0].semver === ia) {
    if (e.length === 1 && e[0].semver === ia)
      return !0;
    r.includePrerelease ? t = AS : t = rl;
  }
  if (e.length === 1 && e[0].semver === ia) {
    if (r.includePrerelease)
      return !0;
    e = rl;
  }
  const n = /* @__PURE__ */ new Set();
  let s, a;
  for (const g of t)
    g.operator === ">" || g.operator === ">=" ? s = nl(s, g, r) : g.operator === "<" || g.operator === "<=" ? a = sl(a, g, r) : n.add(g.semver);
  if (n.size > 1)
    return null;
  let o;
  if (s && a) {
    if (o = Li(s.semver, a.semver, r), o > 0)
      return null;
    if (o === 0 && (s.operator !== ">=" || a.operator !== "<="))
      return null;
  }
  for (const g of n) {
    if (s && !Zr(g, String(s), r) || a && !Zr(g, String(a), r))
      return null;
    for (const y of e)
      if (!Zr(g, String(y), r))
        return !1;
    return !0;
  }
  let i, c, l, d, f = a && !r.includePrerelease && a.semver.prerelease.length ? a.semver : !1, w = s && !r.includePrerelease && s.semver.prerelease.length ? s.semver : !1;
  f && f.prerelease.length === 1 && a.operator === "<" && f.prerelease[0] === 0 && (f = !1);
  for (const g of e) {
    if (d = d || g.operator === ">" || g.operator === ">=", l = l || g.operator === "<" || g.operator === "<=", s) {
      if (w && g.semver.prerelease && g.semver.prerelease.length && g.semver.major === w.major && g.semver.minor === w.minor && g.semver.patch === w.patch && (w = !1), g.operator === ">" || g.operator === ">=") {
        if (i = nl(s, g, r), i === g && i !== s)
          return !1;
      } else if (s.operator === ">=" && !Zr(s.semver, String(g), r))
        return !1;
    }
    if (a) {
      if (f && g.semver.prerelease && g.semver.prerelease.length && g.semver.major === f.major && g.semver.minor === f.minor && g.semver.patch === f.patch && (f = !1), g.operator === "<" || g.operator === "<=") {
        if (c = sl(a, g, r), c === g && c !== a)
          return !1;
      } else if (a.operator === "<=" && !Zr(a.semver, String(g), r))
        return !1;
    }
    if (!g.operator && (a || s) && o !== 0)
      return !1;
  }
  return !(s && l && !a && o !== 0 || a && d && !s && o !== 0 || w || f);
}, nl = (t, e, r) => {
  if (!t)
    return e;
  const n = Li(t.semver, e.semver, r);
  return n > 0 ? t : n < 0 || e.operator === ">" && t.operator === ">=" ? e : t;
}, sl = (t, e, r) => {
  if (!t)
    return e;
  const n = Li(t.semver, e.semver, r);
  return n < 0 ? t : n > 0 || e.operator === "<" && t.operator === "<=" ? e : t;
};
var LS = CS;
const ca = Nn, al = Ds, MS = Le, ol = bd, VS = Gr, FS = GE, zS = BE, US = XE, KS = QE, qS = tb, xS = sb, GS = ib, HS = ub, JS = st, BS = pb, WS = yb, XS = Ti, YS = wb, QS = Sb, ZS = Ms, eP = Ii, tP = Sd, rP = Pd, nP = ki, sP = Ci, aP = Od, oP = Jb, iP = Vs(), cP = at(), lP = Fs, uP = eS, dP = sS, fP = cS, hP = dS, pP = pS, mP = Ai, gP = SS, yP = NS, $P = jS, vP = kS, _P = LS;
var wP = {
  parse: VS,
  valid: FS,
  clean: zS,
  inc: US,
  diff: KS,
  major: qS,
  minor: xS,
  patch: GS,
  prerelease: HS,
  compare: JS,
  rcompare: BS,
  compareLoose: WS,
  compareBuild: XS,
  sort: YS,
  rsort: QS,
  gt: ZS,
  lt: eP,
  eq: tP,
  neq: rP,
  gte: nP,
  lte: sP,
  cmp: aP,
  coerce: oP,
  Comparator: iP,
  Range: cP,
  satisfies: lP,
  toComparators: uP,
  maxSatisfying: dP,
  minSatisfying: fP,
  minVersion: hP,
  validRange: pP,
  outside: mP,
  gtr: gP,
  ltr: yP,
  intersects: $P,
  simplifyRange: vP,
  subset: _P,
  SemVer: MS,
  re: ca.re,
  src: ca.src,
  tokens: ca.t,
  SEMVER_SPEC_VERSION: al.SEMVER_SPEC_VERSION,
  RELEASE_TYPES: al.RELEASE_TYPES,
  compareIdentifiers: ol.compareIdentifiers,
  rcompareIdentifiers: ol.rcompareIdentifiers
};
const Er = /* @__PURE__ */ kl(wP), EP = Object.prototype.toString, bP = "[object Uint8Array]", SP = "[object ArrayBuffer]";
function Rd(t, e, r) {
  return t ? t.constructor === e ? !0 : EP.call(t) === r : !1;
}
function jd(t) {
  return Rd(t, Uint8Array, bP);
}
function PP(t) {
  return Rd(t, ArrayBuffer, SP);
}
function OP(t) {
  return jd(t) || PP(t);
}
function NP(t) {
  if (!jd(t))
    throw new TypeError(`Expected \`Uint8Array\`, got \`${typeof t}\``);
}
function RP(t) {
  if (!OP(t))
    throw new TypeError(`Expected \`Uint8Array\` or \`ArrayBuffer\`, got \`${typeof t}\``);
}
function la(t, e) {
  if (t.length === 0)
    return new Uint8Array(0);
  e ?? (e = t.reduce((s, a) => s + a.length, 0));
  const r = new Uint8Array(e);
  let n = 0;
  for (const s of t)
    NP(s), r.set(s, n), n += s.length;
  return r;
}
const Jn = {
  utf8: new globalThis.TextDecoder("utf8")
};
function Bn(t, e = "utf8") {
  return RP(t), Jn[e] ?? (Jn[e] = new globalThis.TextDecoder(e)), Jn[e].decode(t);
}
function jP(t) {
  if (typeof t != "string")
    throw new TypeError(`Expected \`string\`, got \`${typeof t}\``);
}
const TP = new globalThis.TextEncoder();
function Wn(t) {
  return jP(t), TP.encode(t);
}
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
const ua = "aes-256-cbc", kt = () => /* @__PURE__ */ Object.create(null), il = (t) => t !== void 0, da = (t, e) => {
  const r = /* @__PURE__ */ new Set([
    "undefined",
    "symbol",
    "function"
  ]), n = typeof e;
  if (r.has(n))
    throw new TypeError(`Setting a value of type \`${n}\` for key \`${t}\` is not allowed as it's not supported by JSON`);
}, At = "__internal__", fa = `${At}.migrations.version`;
var Lt, Ze, Me, Ge, fr, hr, kr, ct, Ee, Td, Id, kd, Cd, Ad, Dd, Ld, Md;
class IP {
  constructor(e = {}) {
    ot(this, Ee);
    Br(this, "path");
    Br(this, "events");
    ot(this, Lt);
    ot(this, Ze);
    ot(this, Me);
    ot(this, Ge, {});
    ot(this, fr, !1);
    ot(this, hr);
    ot(this, kr);
    ot(this, ct);
    Br(this, "_deserialize", (e) => JSON.parse(e));
    Br(this, "_serialize", (e) => JSON.stringify(e, void 0, "	"));
    const r = yt(this, Ee, Td).call(this, e);
    Ke(this, Me, r), yt(this, Ee, Id).call(this, r), yt(this, Ee, Cd).call(this, r), yt(this, Ee, Ad).call(this, r), this.events = new EventTarget(), Ke(this, Ze, r.encryptionKey), this.path = yt(this, Ee, Dd).call(this, r), yt(this, Ee, Ld).call(this, r), r.watch && this._watch();
  }
  get(e, r) {
    if (Y(this, Me).accessPropertiesByDotNotation)
      return this._get(e, r);
    const { store: n } = this;
    return e in n ? n[e] : r;
  }
  set(e, r) {
    if (typeof e != "string" && typeof e != "object")
      throw new TypeError(`Expected \`key\` to be of type \`string\` or \`object\`, got ${typeof e}`);
    if (typeof e != "object" && r === void 0)
      throw new TypeError("Use `delete()` to clear values");
    if (this._containsReservedKey(e))
      throw new TypeError(`Please don't use the ${At} key, as it's used to manage this module internal operations.`);
    const { store: n } = this, s = (a, o) => {
      if (da(a, o), Y(this, Me).accessPropertiesByDotNotation)
        Rn(n, a, o);
      else {
        if (a === "__proto__" || a === "constructor" || a === "prototype")
          return;
        n[a] = o;
      }
    };
    if (typeof e == "object") {
      const a = e;
      for (const [o, i] of Object.entries(a))
        s(o, i);
    } else
      s(e, r);
    this.store = n;
  }
  has(e) {
    return Y(this, Me).accessPropertiesByDotNotation ? xs(this.store, e) : e in this.store;
  }
  appendToArray(e, r) {
    da(e, r);
    const n = Y(this, Me).accessPropertiesByDotNotation ? this._get(e, []) : e in this.store ? this.store[e] : [];
    if (!Array.isArray(n))
      throw new TypeError(`The key \`${e}\` is already set to a non-array value`);
    this.set(e, [...n, r]);
  }
  /**
      Reset items to their default values, as defined by the `defaults` or `schema` option.
  
      @see `clear()` to reset all items.
  
      @param keys - The keys of the items to reset.
      */
  reset(...e) {
    for (const r of e)
      il(Y(this, Ge)[r]) && this.set(r, Y(this, Ge)[r]);
  }
  delete(e) {
    const { store: r } = this;
    Y(this, Me).accessPropertiesByDotNotation ? rf(r, e) : delete r[e], this.store = r;
  }
  /**
      Delete all items.
  
      This resets known items to their default values, if defined by the `defaults` or `schema` option.
      */
  clear() {
    const e = kt();
    for (const r of Object.keys(Y(this, Ge)))
      il(Y(this, Ge)[r]) && (da(r, Y(this, Ge)[r]), Y(this, Me).accessPropertiesByDotNotation ? Rn(e, r, Y(this, Ge)[r]) : e[r] = Y(this, Ge)[r]);
    this.store = e;
  }
  onDidChange(e, r) {
    if (typeof e != "string")
      throw new TypeError(`Expected \`key\` to be of type \`string\`, got ${typeof e}`);
    if (typeof r != "function")
      throw new TypeError(`Expected \`callback\` to be of type \`function\`, got ${typeof r}`);
    return this._handleValueChange(() => this.get(e), r);
  }
  /**
      Watches the whole config object, calling `callback` on any changes.
  
      @param callback - A callback function that is called on any changes. When a `key` is first set `oldValue` will be `undefined`, and when a key is deleted `newValue` will be `undefined`.
      @returns A function, that when called, will unsubscribe.
      */
  onDidAnyChange(e) {
    if (typeof e != "function")
      throw new TypeError(`Expected \`callback\` to be of type \`function\`, got ${typeof e}`);
    return this._handleStoreChange(e);
  }
  get size() {
    return Object.keys(this.store).filter((r) => !this._isReservedKeyPath(r)).length;
  }
  /**
      Get all the config as an object or replace the current config with an object.
  
      @example
      ```
      console.log(config.store);
      //=> {name: 'John', age: 30}
      ```
  
      @example
      ```
      config.store = {
          hello: 'world'
      };
      ```
      */
  get store() {
    var e;
    try {
      const r = Q.readFileSync(this.path, Y(this, Ze) ? null : "utf8"), n = this._decryptData(r), s = this._deserialize(n);
      return Y(this, fr) || this._validate(s), Object.assign(kt(), s);
    } catch (r) {
      if ((r == null ? void 0 : r.code) === "ENOENT")
        return this._ensureDirectory(), kt();
      if (Y(this, Me).clearInvalidConfig) {
        const n = r;
        if (n.name === "SyntaxError" || (e = n.message) != null && e.startsWith("Config schema violation:"))
          return kt();
      }
      throw r;
    }
  }
  set store(e) {
    if (this._ensureDirectory(), !xs(e, At))
      try {
        const r = Q.readFileSync(this.path, Y(this, Ze) ? null : "utf8"), n = this._decryptData(r), s = this._deserialize(n);
        xs(s, At) && Rn(e, At, zi(s, At));
      } catch {
      }
    Y(this, fr) || this._validate(e), this._write(e), this.events.dispatchEvent(new Event("change"));
  }
  *[Symbol.iterator]() {
    for (const [e, r] of Object.entries(this.store))
      this._isReservedKeyPath(e) || (yield [e, r]);
  }
  /**
  Close the file watcher if one exists. This is useful in tests to prevent the process from hanging.
  */
  _closeWatcher() {
    Y(this, hr) && (Y(this, hr).close(), Ke(this, hr, void 0)), Y(this, kr) && (Q.unwatchFile(this.path), Ke(this, kr, !1)), Ke(this, ct, void 0);
  }
  _decryptData(e) {
    if (!Y(this, Ze))
      return typeof e == "string" ? e : Bn(e);
    try {
      const r = e.slice(0, 16), n = rr.pbkdf2Sync(Y(this, Ze), r, 1e4, 32, "sha512"), s = rr.createDecipheriv(ua, n, r), a = e.slice(17), o = typeof a == "string" ? Wn(a) : a;
      return Bn(la([s.update(o), s.final()]));
    } catch {
      try {
        const r = e.slice(0, 16), n = rr.pbkdf2Sync(Y(this, Ze), r.toString(), 1e4, 32, "sha512"), s = rr.createDecipheriv(ua, n, r), a = e.slice(17), o = typeof a == "string" ? Wn(a) : a;
        return Bn(la([s.update(o), s.final()]));
      } catch {
      }
    }
    return typeof e == "string" ? e : Bn(e);
  }
  _handleStoreChange(e) {
    let r = this.store;
    const n = () => {
      const s = r, a = this.store;
      Vi(a, s) || (r = a, e.call(this, a, s));
    };
    return this.events.addEventListener("change", n), () => {
      this.events.removeEventListener("change", n);
    };
  }
  _handleValueChange(e, r) {
    let n = e();
    const s = () => {
      const a = n, o = e();
      Vi(o, a) || (n = o, r.call(this, o, a));
    };
    return this.events.addEventListener("change", s), () => {
      this.events.removeEventListener("change", s);
    };
  }
  _validate(e) {
    if (!Y(this, Lt) || Y(this, Lt).call(this, e) || !Y(this, Lt).errors)
      return;
    const n = Y(this, Lt).errors.map(({ instancePath: s, message: a = "" }) => `\`${s.slice(1)}\` ${a}`);
    throw new Error("Config schema violation: " + n.join("; "));
  }
  _ensureDirectory() {
    Q.mkdirSync(re.dirname(this.path), { recursive: !0 });
  }
  _write(e) {
    let r = this._serialize(e);
    if (Y(this, Ze)) {
      const n = rr.randomBytes(16), s = rr.pbkdf2Sync(Y(this, Ze), n, 1e4, 32, "sha512"), a = rr.createCipheriv(ua, s, n);
      r = la([n, Wn(":"), a.update(Wn(r)), a.final()]);
    }
    if (me.env.SNAP)
      Q.writeFileSync(this.path, r, { mode: Y(this, Me).configFileMode });
    else
      try {
        Il(this.path, r, { mode: Y(this, Me).configFileMode });
      } catch (n) {
        if ((n == null ? void 0 : n.code) === "EXDEV") {
          Q.writeFileSync(this.path, r, { mode: Y(this, Me).configFileMode });
          return;
        }
        throw n;
      }
  }
  _watch() {
    if (this._ensureDirectory(), Q.existsSync(this.path) || this._write(kt()), me.platform === "win32" || me.platform === "darwin") {
      Y(this, ct) ?? Ke(this, ct, Uc(() => {
        this.events.dispatchEvent(new Event("change"));
      }, { wait: 100 }));
      const e = re.dirname(this.path), r = re.basename(this.path);
      Ke(this, hr, Q.watch(e, { persistent: !1, encoding: "utf8" }, (n, s) => {
        s && s !== r || typeof Y(this, ct) == "function" && Y(this, ct).call(this);
      }));
    } else
      Y(this, ct) ?? Ke(this, ct, Uc(() => {
        this.events.dispatchEvent(new Event("change"));
      }, { wait: 1e3 })), Q.watchFile(this.path, { persistent: !1 }, (e, r) => {
        typeof Y(this, ct) == "function" && Y(this, ct).call(this);
      }), Ke(this, kr, !0);
  }
  _migrate(e, r, n) {
    let s = this._get(fa, "0.0.0");
    const a = Object.keys(e).filter((i) => this._shouldPerformMigration(i, s, r));
    let o = structuredClone(this.store);
    for (const i of a)
      try {
        n && n(this, {
          fromVersion: s,
          toVersion: i,
          finalVersion: r,
          versions: a
        });
        const c = e[i];
        c == null || c(this), this._set(fa, i), s = i, o = structuredClone(this.store);
      } catch (c) {
        this.store = o;
        try {
          this._write(o);
        } catch {
        }
        const l = c instanceof Error ? c.message : String(c);
        throw new Error(`Something went wrong during the migration! Changes applied to the store until this failed migration will be restored. ${l}`);
      }
    (this._isVersionInRangeFormat(s) || !Er.eq(s, r)) && this._set(fa, r);
  }
  _containsReservedKey(e) {
    return typeof e == "string" ? this._isReservedKeyPath(e) : !e || typeof e != "object" ? !1 : this._objectContainsReservedKey(e);
  }
  _objectContainsReservedKey(e) {
    if (!e || typeof e != "object")
      return !1;
    for (const [r, n] of Object.entries(e))
      if (this._isReservedKeyPath(r) || this._objectContainsReservedKey(n))
        return !0;
    return !1;
  }
  _isReservedKeyPath(e) {
    return e === At || e.startsWith(`${At}.`);
  }
  _isVersionInRangeFormat(e) {
    return Er.clean(e) === null;
  }
  _shouldPerformMigration(e, r, n) {
    return this._isVersionInRangeFormat(e) ? r !== "0.0.0" && Er.satisfies(r, e) ? !1 : Er.satisfies(n, e) : !(Er.lte(e, r) || Er.gt(e, n));
  }
  _get(e, r) {
    return zi(this.store, e, r);
  }
  _set(e, r) {
    const { store: n } = this;
    Rn(n, e, r), this.store = n;
  }
}
Lt = new WeakMap(), Ze = new WeakMap(), Me = new WeakMap(), Ge = new WeakMap(), fr = new WeakMap(), hr = new WeakMap(), kr = new WeakMap(), ct = new WeakMap(), Ee = new WeakSet(), Td = function(e) {
  const r = {
    configName: "config",
    fileExtension: "json",
    projectSuffix: "nodejs",
    clearInvalidConfig: !1,
    accessPropertiesByDotNotation: !0,
    configFileMode: 438,
    ...e
  };
  if (!r.cwd) {
    if (!r.projectName)
      throw new Error("Please specify the `projectName` option.");
    r.cwd = of(r.projectName, { suffix: r.projectSuffix }).config;
  }
  return typeof r.fileExtension == "string" && (r.fileExtension = r.fileExtension.replace(/^\.+/, "")), r;
}, Id = function(e) {
  if (!(e.schema ?? e.ajvOptions ?? e.rootSchema))
    return;
  if (e.schema && typeof e.schema != "object")
    throw new TypeError("The `schema` option must be an object.");
  const r = wE.default, n = new c0.Ajv2020({
    allErrors: !0,
    useDefaults: !0,
    ...e.ajvOptions
  });
  r(n);
  const s = {
    ...e.rootSchema,
    type: "object",
    properties: e.schema
  };
  Ke(this, Lt, n.compile(s)), yt(this, Ee, kd).call(this, e.schema);
}, kd = function(e) {
  const r = Object.entries(e ?? {});
  for (const [n, s] of r) {
    if (!s || typeof s != "object" || !Object.hasOwn(s, "default"))
      continue;
    const { default: a } = s;
    a !== void 0 && (Y(this, Ge)[n] = a);
  }
}, Cd = function(e) {
  e.defaults && Object.assign(Y(this, Ge), e.defaults);
}, Ad = function(e) {
  e.serialize && (this._serialize = e.serialize), e.deserialize && (this._deserialize = e.deserialize);
}, Dd = function(e) {
  const r = typeof e.fileExtension == "string" ? e.fileExtension : void 0, n = r ? `.${r}` : "";
  return re.resolve(e.cwd, `${e.configName ?? "config"}${n}`);
}, Ld = function(e) {
  if (e.migrations) {
    yt(this, Ee, Md).call(this, e), this._validate(this.store);
    return;
  }
  const r = this.store, n = Object.assign(kt(), e.defaults ?? {}, r);
  this._validate(n);
  try {
    Fi.deepEqual(r, n);
  } catch {
    this.store = n;
  }
}, Md = function(e) {
  const { migrations: r, projectVersion: n } = e;
  if (r) {
    if (!n)
      throw new Error("Please specify the `projectVersion` option.");
    Ke(this, fr, !0);
    try {
      const s = this.store, a = Object.assign(kt(), e.defaults ?? {}, s);
      try {
        Fi.deepEqual(s, a);
      } catch {
        this._write(a);
      }
      this._migrate(r, n, e.beforeEachMigration);
    } finally {
      Ke(this, fr, !1);
    }
  }
};
const { app: os, ipcMain: Ca, shell: kP } = Sl;
let cl = !1;
const ll = () => {
  if (!Ca || !os)
    throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
  const t = {
    defaultCwd: os.getPath("userData"),
    appVersion: os.getVersion()
  };
  return cl || (Ca.on("electron-store-get-data", (e) => {
    e.returnValue = t;
  }), cl = !0), t;
};
class CP extends IP {
  constructor(e) {
    let r, n;
    if (me.type === "renderer") {
      const s = Sl.ipcRenderer.sendSync("electron-store-get-data");
      if (!s)
        throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
      ({ defaultCwd: r, appVersion: n } = s);
    } else Ca && os && ({ defaultCwd: r, appVersion: n } = ll());
    e = {
      name: "config",
      ...e
    }, e.projectVersion || (e.projectVersion = n), e.cwd ? e.cwd = re.isAbsolute(e.cwd) ? e.cwd : re.join(r, e.cwd) : e.cwd = r, e.configName = e.name, delete e.name, super(e);
  }
  static initRenderer() {
    ll();
  }
  async openInEditor() {
    const e = await kP.openPath(this.path);
    if (e)
      throw new Error(e);
  }
}
function AP(t, e = /* @__PURE__ */ new Date()) {
  const r = new Date(e.getFullYear(), e.getMonth(), e.getDate()).getTime(), n = [], s = [];
  if (t.forEach((c) => {
    if (c.isRunning) {
      n.push(c);
      return;
    }
    c.startTime >= r ? n.push(c) : s.push(c);
  }), s.length === 0)
    return t;
  const a = /* @__PURE__ */ new Map();
  s.forEach((c) => {
    const l = new Date(c.startTime), f = `${`${l.getFullYear()}-${String(l.getMonth() + 1).padStart(2, "0")}-${String(l.getDate()).padStart(2, "0")}`}|${c.projectId || "null"}`;
    a.has(f) || a.set(f, []), a.get(f).push(c);
  });
  const o = [];
  for (const [c, l] of a) {
    if (l.length === 1) {
      o.push(l[0]);
      continue;
    }
    const [, d] = c.split("|"), f = d === "null" ? null : d, w = l.reduce(($, p) => $ + p.duration, 0), g = Math.min(...l.map(($) => $.startTime)), y = Math.max(...l.map(($) => $.endTime || $.startTime + $.duration * 1e3)), v = {
      id: Zd(),
      projectId: f,
      description: `Consolidated: ${l.length} jobs`,
      startTime: g,
      endTime: y,
      duration: w,
      isRunning: !1
    };
    o.push(v);
  }
  const i = [...n, ...o];
  return i.sort((c, l) => c.startTime - l.startTime), i;
}
const W = (t) => typeof t == "string", en = () => {
  let t, e;
  const r = new Promise((n, s) => {
    t = n, e = s;
  });
  return r.resolve = t, r.reject = e, r;
}, ul = (t) => t == null ? "" : "" + t, DP = (t, e, r) => {
  t.forEach((n) => {
    e[n] && (r[n] = e[n]);
  });
}, LP = /###/g, dl = (t) => t && t.indexOf("###") > -1 ? t.replace(LP, ".") : t, fl = (t) => !t || W(t), mn = (t, e, r) => {
  const n = W(e) ? e.split(".") : e;
  let s = 0;
  for (; s < n.length - 1; ) {
    if (fl(t)) return {};
    const a = dl(n[s]);
    !t[a] && r && (t[a] = new r()), Object.prototype.hasOwnProperty.call(t, a) ? t = t[a] : t = {}, ++s;
  }
  return fl(t) ? {} : {
    obj: t,
    k: dl(n[s])
  };
}, hl = (t, e, r) => {
  const {
    obj: n,
    k: s
  } = mn(t, e, Object);
  if (n !== void 0 || e.length === 1) {
    n[s] = r;
    return;
  }
  let a = e[e.length - 1], o = e.slice(0, e.length - 1), i = mn(t, o, Object);
  for (; i.obj === void 0 && o.length; )
    a = `${o[o.length - 1]}.${a}`, o = o.slice(0, o.length - 1), i = mn(t, o, Object), i != null && i.obj && typeof i.obj[`${i.k}.${a}`] < "u" && (i.obj = void 0);
  i.obj[`${i.k}.${a}`] = r;
}, MP = (t, e, r, n) => {
  const {
    obj: s,
    k: a
  } = mn(t, e, Object);
  s[a] = s[a] || [], s[a].push(r);
}, $s = (t, e) => {
  const {
    obj: r,
    k: n
  } = mn(t, e);
  if (r && Object.prototype.hasOwnProperty.call(r, n))
    return r[n];
}, VP = (t, e, r) => {
  const n = $s(t, r);
  return n !== void 0 ? n : $s(e, r);
}, Vd = (t, e, r) => {
  for (const n in e)
    n !== "__proto__" && n !== "constructor" && (n in t ? W(t[n]) || t[n] instanceof String || W(e[n]) || e[n] instanceof String ? r && (t[n] = e[n]) : Vd(t[n], e[n], r) : t[n] = e[n]);
  return t;
}, br = (t) => t.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
var FP = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  "/": "&#x2F;"
};
const zP = (t) => W(t) ? t.replace(/[&<>"'\/]/g, (e) => FP[e]) : t;
class UP {
  constructor(e) {
    this.capacity = e, this.regExpMap = /* @__PURE__ */ new Map(), this.regExpQueue = [];
  }
  getRegExp(e) {
    const r = this.regExpMap.get(e);
    if (r !== void 0)
      return r;
    const n = new RegExp(e);
    return this.regExpQueue.length === this.capacity && this.regExpMap.delete(this.regExpQueue.shift()), this.regExpMap.set(e, n), this.regExpQueue.push(e), n;
  }
}
const KP = [" ", ",", "?", "!", ";"], qP = new UP(20), xP = (t, e, r) => {
  e = e || "", r = r || "";
  const n = KP.filter((o) => e.indexOf(o) < 0 && r.indexOf(o) < 0);
  if (n.length === 0) return !0;
  const s = qP.getRegExp(`(${n.map((o) => o === "?" ? "\\?" : o).join("|")})`);
  let a = !s.test(t);
  if (!a) {
    const o = t.indexOf(r);
    o > 0 && !s.test(t.substring(0, o)) && (a = !0);
  }
  return a;
}, Aa = (t, e, r = ".") => {
  if (!t) return;
  if (t[e])
    return Object.prototype.hasOwnProperty.call(t, e) ? t[e] : void 0;
  const n = e.split(r);
  let s = t;
  for (let a = 0; a < n.length; ) {
    if (!s || typeof s != "object")
      return;
    let o, i = "";
    for (let c = a; c < n.length; ++c)
      if (c !== a && (i += r), i += n[c], o = s[i], o !== void 0) {
        if (["string", "number", "boolean"].indexOf(typeof o) > -1 && c < n.length - 1)
          continue;
        a += c - a + 1;
        break;
      }
    s = o;
  }
  return s;
}, _n = (t) => t == null ? void 0 : t.replace("_", "-"), GP = {
  type: "logger",
  log(t) {
    this.output("log", t);
  },
  warn(t) {
    this.output("warn", t);
  },
  error(t) {
    this.output("error", t);
  },
  output(t, e) {
    var r, n;
    (n = (r = console == null ? void 0 : console[t]) == null ? void 0 : r.apply) == null || n.call(r, console, e);
  }
};
class vs {
  constructor(e, r = {}) {
    this.init(e, r);
  }
  init(e, r = {}) {
    this.prefix = r.prefix || "i18next:", this.logger = e || GP, this.options = r, this.debug = r.debug;
  }
  log(...e) {
    return this.forward(e, "log", "", !0);
  }
  warn(...e) {
    return this.forward(e, "warn", "", !0);
  }
  error(...e) {
    return this.forward(e, "error", "");
  }
  deprecate(...e) {
    return this.forward(e, "warn", "WARNING DEPRECATED: ", !0);
  }
  forward(e, r, n, s) {
    return s && !this.debug ? null : (W(e[0]) && (e[0] = `${n}${this.prefix} ${e[0]}`), this.logger[r](e));
  }
  create(e) {
    return new vs(this.logger, {
      prefix: `${this.prefix}:${e}:`,
      ...this.options
    });
  }
  clone(e) {
    return e = e || this.options, e.prefix = e.prefix || this.prefix, new vs(this.logger, e);
  }
}
var pt = new vs();
class zs {
  constructor() {
    this.observers = {};
  }
  on(e, r) {
    return e.split(" ").forEach((n) => {
      this.observers[n] || (this.observers[n] = /* @__PURE__ */ new Map());
      const s = this.observers[n].get(r) || 0;
      this.observers[n].set(r, s + 1);
    }), this;
  }
  off(e, r) {
    if (this.observers[e]) {
      if (!r) {
        delete this.observers[e];
        return;
      }
      this.observers[e].delete(r);
    }
  }
  emit(e, ...r) {
    this.observers[e] && Array.from(this.observers[e].entries()).forEach(([s, a]) => {
      for (let o = 0; o < a; o++)
        s(...r);
    }), this.observers["*"] && Array.from(this.observers["*"].entries()).forEach(([s, a]) => {
      for (let o = 0; o < a; o++)
        s.apply(s, [e, ...r]);
    });
  }
}
class pl extends zs {
  constructor(e, r = {
    ns: ["translation"],
    defaultNS: "translation"
  }) {
    super(), this.data = e || {}, this.options = r, this.options.keySeparator === void 0 && (this.options.keySeparator = "."), this.options.ignoreJSONStructure === void 0 && (this.options.ignoreJSONStructure = !0);
  }
  addNamespaces(e) {
    this.options.ns.indexOf(e) < 0 && this.options.ns.push(e);
  }
  removeNamespaces(e) {
    const r = this.options.ns.indexOf(e);
    r > -1 && this.options.ns.splice(r, 1);
  }
  getResource(e, r, n, s = {}) {
    var l, d;
    const a = s.keySeparator !== void 0 ? s.keySeparator : this.options.keySeparator, o = s.ignoreJSONStructure !== void 0 ? s.ignoreJSONStructure : this.options.ignoreJSONStructure;
    let i;
    e.indexOf(".") > -1 ? i = e.split(".") : (i = [e, r], n && (Array.isArray(n) ? i.push(...n) : W(n) && a ? i.push(...n.split(a)) : i.push(n)));
    const c = $s(this.data, i);
    return !c && !r && !n && e.indexOf(".") > -1 && (e = i[0], r = i[1], n = i.slice(2).join(".")), c || !o || !W(n) ? c : Aa((d = (l = this.data) == null ? void 0 : l[e]) == null ? void 0 : d[r], n, a);
  }
  addResource(e, r, n, s, a = {
    silent: !1
  }) {
    const o = a.keySeparator !== void 0 ? a.keySeparator : this.options.keySeparator;
    let i = [e, r];
    n && (i = i.concat(o ? n.split(o) : n)), e.indexOf(".") > -1 && (i = e.split("."), s = r, r = i[1]), this.addNamespaces(r), hl(this.data, i, s), a.silent || this.emit("added", e, r, n, s);
  }
  addResources(e, r, n, s = {
    silent: !1
  }) {
    for (const a in n)
      (W(n[a]) || Array.isArray(n[a])) && this.addResource(e, r, a, n[a], {
        silent: !0
      });
    s.silent || this.emit("added", e, r, n);
  }
  addResourceBundle(e, r, n, s, a, o = {
    silent: !1,
    skipCopy: !1
  }) {
    let i = [e, r];
    e.indexOf(".") > -1 && (i = e.split("."), s = n, n = r, r = i[1]), this.addNamespaces(r);
    let c = $s(this.data, i) || {};
    o.skipCopy || (n = JSON.parse(JSON.stringify(n))), s ? Vd(c, n, a) : c = {
      ...c,
      ...n
    }, hl(this.data, i, c), o.silent || this.emit("added", e, r, n);
  }
  removeResourceBundle(e, r) {
    this.hasResourceBundle(e, r) && delete this.data[e][r], this.removeNamespaces(r), this.emit("removed", e, r);
  }
  hasResourceBundle(e, r) {
    return this.getResource(e, r) !== void 0;
  }
  getResourceBundle(e, r) {
    return r || (r = this.options.defaultNS), this.getResource(e, r);
  }
  getDataByLanguage(e) {
    return this.data[e];
  }
  hasLanguageSomeTranslations(e) {
    const r = this.getDataByLanguage(e);
    return !!(r && Object.keys(r) || []).find((s) => r[s] && Object.keys(r[s]).length > 0);
  }
  toJSON() {
    return this.data;
  }
}
var Fd = {
  processors: {},
  addPostProcessor(t) {
    this.processors[t.name] = t;
  },
  handle(t, e, r, n, s) {
    return t.forEach((a) => {
      var o;
      e = ((o = this.processors[a]) == null ? void 0 : o.process(e, r, n, s)) ?? e;
    }), e;
  }
};
const zd = Symbol("i18next/PATH_KEY");
function HP() {
  const t = [], e = /* @__PURE__ */ Object.create(null);
  let r;
  return e.get = (n, s) => {
    var a;
    return (a = r == null ? void 0 : r.revoke) == null || a.call(r), s === zd ? t : (t.push(s), r = Proxy.revocable(n, e), r.proxy);
  }, Proxy.revocable(/* @__PURE__ */ Object.create(null), e).proxy;
}
function Da(t, e) {
  const {
    [zd]: r
  } = t(HP());
  return r.join((e == null ? void 0 : e.keySeparator) ?? ".");
}
const ml = {}, ha = (t) => !W(t) && typeof t != "boolean" && typeof t != "number";
class _s extends zs {
  constructor(e, r = {}) {
    super(), DP(["resourceStore", "languageUtils", "pluralResolver", "interpolator", "backendConnector", "i18nFormat", "utils"], e, this), this.options = r, this.options.keySeparator === void 0 && (this.options.keySeparator = "."), this.logger = pt.create("translator");
  }
  changeLanguage(e) {
    e && (this.language = e);
  }
  exists(e, r = {
    interpolation: {}
  }) {
    const n = {
      ...r
    };
    if (e == null) return !1;
    const s = this.resolve(e, n);
    if ((s == null ? void 0 : s.res) === void 0) return !1;
    const a = ha(s.res);
    return !(n.returnObjects === !1 && a);
  }
  extractFromKey(e, r) {
    let n = r.nsSeparator !== void 0 ? r.nsSeparator : this.options.nsSeparator;
    n === void 0 && (n = ":");
    const s = r.keySeparator !== void 0 ? r.keySeparator : this.options.keySeparator;
    let a = r.ns || this.options.defaultNS || [];
    const o = n && e.indexOf(n) > -1, i = !this.options.userDefinedKeySeparator && !r.keySeparator && !this.options.userDefinedNsSeparator && !r.nsSeparator && !xP(e, n, s);
    if (o && !i) {
      const c = e.match(this.interpolator.nestingRegexp);
      if (c && c.length > 0)
        return {
          key: e,
          namespaces: W(a) ? [a] : a
        };
      const l = e.split(n);
      (n !== s || n === s && this.options.ns.indexOf(l[0]) > -1) && (a = l.shift()), e = l.join(s);
    }
    return {
      key: e,
      namespaces: W(a) ? [a] : a
    };
  }
  translate(e, r, n) {
    let s = typeof r == "object" ? {
      ...r
    } : r;
    if (typeof s != "object" && this.options.overloadTranslationOptionHandler && (s = this.options.overloadTranslationOptionHandler(arguments)), typeof s == "object" && (s = {
      ...s
    }), s || (s = {}), e == null) return "";
    typeof e == "function" && (e = Da(e, {
      ...this.options,
      ...s
    })), Array.isArray(e) || (e = [String(e)]);
    const a = s.returnDetails !== void 0 ? s.returnDetails : this.options.returnDetails, o = s.keySeparator !== void 0 ? s.keySeparator : this.options.keySeparator, {
      key: i,
      namespaces: c
    } = this.extractFromKey(e[e.length - 1], s), l = c[c.length - 1];
    let d = s.nsSeparator !== void 0 ? s.nsSeparator : this.options.nsSeparator;
    d === void 0 && (d = ":");
    const f = s.lng || this.language, w = s.appendNamespaceToCIMode || this.options.appendNamespaceToCIMode;
    if ((f == null ? void 0 : f.toLowerCase()) === "cimode")
      return w ? a ? {
        res: `${l}${d}${i}`,
        usedKey: i,
        exactUsedKey: i,
        usedLng: f,
        usedNS: l,
        usedParams: this.getUsedParamsDetails(s)
      } : `${l}${d}${i}` : a ? {
        res: i,
        usedKey: i,
        exactUsedKey: i,
        usedLng: f,
        usedNS: l,
        usedParams: this.getUsedParamsDetails(s)
      } : i;
    const g = this.resolve(e, s);
    let y = g == null ? void 0 : g.res;
    const v = (g == null ? void 0 : g.usedKey) || i, $ = (g == null ? void 0 : g.exactUsedKey) || i, p = ["[object Number]", "[object Function]", "[object RegExp]"], E = s.joinArrays !== void 0 ? s.joinArrays : this.options.joinArrays, P = !this.i18nFormat || this.i18nFormat.handleAsObject, N = s.count !== void 0 && !W(s.count), R = _s.hasDefaultValue(s), z = N ? this.pluralResolver.getSuffix(f, s.count, s) : "", G = s.ordinal && N ? this.pluralResolver.getSuffix(f, s.count, {
      ordinal: !1
    }) : "", ue = N && !s.ordinal && s.count === 0, ie = ue && s[`defaultValue${this.options.pluralSeparator}zero`] || s[`defaultValue${z}`] || s[`defaultValue${G}`] || s.defaultValue;
    let ce = y;
    P && !y && R && (ce = ie);
    const U = ha(ce), H = Object.prototype.toString.apply(ce);
    if (P && ce && U && p.indexOf(H) < 0 && !(W(E) && Array.isArray(ce))) {
      if (!s.returnObjects && !this.options.returnObjects) {
        this.options.returnedObjectHandler || this.logger.warn("accessing an object - but returnObjects options is not enabled!");
        const X = this.options.returnedObjectHandler ? this.options.returnedObjectHandler(v, ce, {
          ...s,
          ns: c
        }) : `key '${i} (${this.language})' returned an object instead of string.`;
        return a ? (g.res = X, g.usedParams = this.getUsedParamsDetails(s), g) : X;
      }
      if (o) {
        const X = Array.isArray(ce), j = X ? [] : {}, k = X ? $ : v;
        for (const A in ce)
          if (Object.prototype.hasOwnProperty.call(ce, A)) {
            const C = `${k}${o}${A}`;
            R && !y ? j[A] = this.translate(C, {
              ...s,
              defaultValue: ha(ie) ? ie[A] : void 0,
              joinArrays: !1,
              ns: c
            }) : j[A] = this.translate(C, {
              ...s,
              joinArrays: !1,
              ns: c
            }), j[A] === C && (j[A] = ce[A]);
          }
        y = j;
      }
    } else if (P && W(E) && Array.isArray(y))
      y = y.join(E), y && (y = this.extendTranslation(y, e, s, n));
    else {
      let X = !1, j = !1;
      !this.isValidLookup(y) && R && (X = !0, y = ie), this.isValidLookup(y) || (j = !0, y = i);
      const A = (s.missingKeyNoValueFallbackToKey || this.options.missingKeyNoValueFallbackToKey) && j ? void 0 : y, C = R && ie !== y && this.options.updateMissing;
      if (j || X || C) {
        if (this.logger.log(C ? "updateKey" : "missingKey", f, l, i, C ? ie : y), o) {
          const m = this.resolve(i, {
            ...s,
            keySeparator: !1
          });
          m && m.res && this.logger.warn("Seems the loaded translations were in flat JSON format instead of nested. Either set keySeparator: false on init or make sure your translations are published in nested format.");
        }
        let V = [];
        const L = this.languageUtils.getFallbackCodes(this.options.fallbackLng, s.lng || this.language);
        if (this.options.saveMissingTo === "fallback" && L && L[0])
          for (let m = 0; m < L.length; m++)
            V.push(L[m]);
        else this.options.saveMissingTo === "all" ? V = this.languageUtils.toResolveHierarchy(s.lng || this.language) : V.push(s.lng || this.language);
        const O = (m, b, _) => {
          var h;
          const u = R && _ !== y ? _ : A;
          this.options.missingKeyHandler ? this.options.missingKeyHandler(m, l, b, u, C, s) : (h = this.backendConnector) != null && h.saveMissing && this.backendConnector.saveMissing(m, l, b, u, C, s), this.emit("missingKey", m, l, b, y);
        };
        this.options.saveMissing && (this.options.saveMissingPlurals && N ? V.forEach((m) => {
          const b = this.pluralResolver.getSuffixes(m, s);
          ue && s[`defaultValue${this.options.pluralSeparator}zero`] && b.indexOf(`${this.options.pluralSeparator}zero`) < 0 && b.push(`${this.options.pluralSeparator}zero`), b.forEach((_) => {
            O([m], i + _, s[`defaultValue${_}`] || ie);
          });
        }) : O(V, i, ie));
      }
      y = this.extendTranslation(y, e, s, g, n), j && y === i && this.options.appendNamespaceToMissingKey && (y = `${l}${d}${i}`), (j || X) && this.options.parseMissingKeyHandler && (y = this.options.parseMissingKeyHandler(this.options.appendNamespaceToMissingKey ? `${l}${d}${i}` : i, X ? y : void 0, s));
    }
    return a ? (g.res = y, g.usedParams = this.getUsedParamsDetails(s), g) : y;
  }
  extendTranslation(e, r, n, s, a) {
    var c, l;
    if ((c = this.i18nFormat) != null && c.parse)
      e = this.i18nFormat.parse(e, {
        ...this.options.interpolation.defaultVariables,
        ...n
      }, n.lng || this.language || s.usedLng, s.usedNS, s.usedKey, {
        resolved: s
      });
    else if (!n.skipInterpolation) {
      n.interpolation && this.interpolator.init({
        ...n,
        interpolation: {
          ...this.options.interpolation,
          ...n.interpolation
        }
      });
      const d = W(e) && (((l = n == null ? void 0 : n.interpolation) == null ? void 0 : l.skipOnVariables) !== void 0 ? n.interpolation.skipOnVariables : this.options.interpolation.skipOnVariables);
      let f;
      if (d) {
        const g = e.match(this.interpolator.nestingRegexp);
        f = g && g.length;
      }
      let w = n.replace && !W(n.replace) ? n.replace : n;
      if (this.options.interpolation.defaultVariables && (w = {
        ...this.options.interpolation.defaultVariables,
        ...w
      }), e = this.interpolator.interpolate(e, w, n.lng || this.language || s.usedLng, n), d) {
        const g = e.match(this.interpolator.nestingRegexp), y = g && g.length;
        f < y && (n.nest = !1);
      }
      !n.lng && s && s.res && (n.lng = this.language || s.usedLng), n.nest !== !1 && (e = this.interpolator.nest(e, (...g) => (a == null ? void 0 : a[0]) === g[0] && !n.context ? (this.logger.warn(`It seems you are nesting recursively key: ${g[0]} in key: ${r[0]}`), null) : this.translate(...g, r), n)), n.interpolation && this.interpolator.reset();
    }
    const o = n.postProcess || this.options.postProcess, i = W(o) ? [o] : o;
    return e != null && (i != null && i.length) && n.applyPostProcessor !== !1 && (e = Fd.handle(i, e, r, this.options && this.options.postProcessPassResolved ? {
      i18nResolved: {
        ...s,
        usedParams: this.getUsedParamsDetails(n)
      },
      ...n
    } : n, this)), e;
  }
  resolve(e, r = {}) {
    let n, s, a, o, i;
    return W(e) && (e = [e]), e.forEach((c) => {
      if (this.isValidLookup(n)) return;
      const l = this.extractFromKey(c, r), d = l.key;
      s = d;
      let f = l.namespaces;
      this.options.fallbackNS && (f = f.concat(this.options.fallbackNS));
      const w = r.count !== void 0 && !W(r.count), g = w && !r.ordinal && r.count === 0, y = r.context !== void 0 && (W(r.context) || typeof r.context == "number") && r.context !== "", v = r.lngs ? r.lngs : this.languageUtils.toResolveHierarchy(r.lng || this.language, r.fallbackLng);
      f.forEach(($) => {
        var p, E;
        this.isValidLookup(n) || (i = $, !ml[`${v[0]}-${$}`] && ((p = this.utils) != null && p.hasLoadedNamespace) && !((E = this.utils) != null && E.hasLoadedNamespace(i)) && (ml[`${v[0]}-${$}`] = !0, this.logger.warn(`key "${s}" for languages "${v.join(", ")}" won't get resolved as namespace "${i}" was not yet loaded`, "This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!")), v.forEach((P) => {
          var z;
          if (this.isValidLookup(n)) return;
          o = P;
          const N = [d];
          if ((z = this.i18nFormat) != null && z.addLookupKeys)
            this.i18nFormat.addLookupKeys(N, d, P, $, r);
          else {
            let G;
            w && (G = this.pluralResolver.getSuffix(P, r.count, r));
            const ue = `${this.options.pluralSeparator}zero`, ie = `${this.options.pluralSeparator}ordinal${this.options.pluralSeparator}`;
            if (w && (r.ordinal && G.indexOf(ie) === 0 && N.push(d + G.replace(ie, this.options.pluralSeparator)), N.push(d + G), g && N.push(d + ue)), y) {
              const ce = `${d}${this.options.contextSeparator || "_"}${r.context}`;
              N.push(ce), w && (r.ordinal && G.indexOf(ie) === 0 && N.push(ce + G.replace(ie, this.options.pluralSeparator)), N.push(ce + G), g && N.push(ce + ue));
            }
          }
          let R;
          for (; R = N.pop(); )
            this.isValidLookup(n) || (a = R, n = this.getResource(P, $, R, r));
        }));
      });
    }), {
      res: n,
      usedKey: s,
      exactUsedKey: a,
      usedLng: o,
      usedNS: i
    };
  }
  isValidLookup(e) {
    return e !== void 0 && !(!this.options.returnNull && e === null) && !(!this.options.returnEmptyString && e === "");
  }
  getResource(e, r, n, s = {}) {
    var a;
    return (a = this.i18nFormat) != null && a.getResource ? this.i18nFormat.getResource(e, r, n, s) : this.resourceStore.getResource(e, r, n, s);
  }
  getUsedParamsDetails(e = {}) {
    const r = ["defaultValue", "ordinal", "context", "replace", "lng", "lngs", "fallbackLng", "ns", "keySeparator", "nsSeparator", "returnObjects", "returnDetails", "joinArrays", "postProcess", "interpolation"], n = e.replace && !W(e.replace);
    let s = n ? e.replace : e;
    if (n && typeof e.count < "u" && (s.count = e.count), this.options.interpolation.defaultVariables && (s = {
      ...this.options.interpolation.defaultVariables,
      ...s
    }), !n) {
      s = {
        ...s
      };
      for (const a of r)
        delete s[a];
    }
    return s;
  }
  static hasDefaultValue(e) {
    const r = "defaultValue";
    for (const n in e)
      if (Object.prototype.hasOwnProperty.call(e, n) && r === n.substring(0, r.length) && e[n] !== void 0)
        return !0;
    return !1;
  }
}
class gl {
  constructor(e) {
    this.options = e, this.supportedLngs = this.options.supportedLngs || !1, this.logger = pt.create("languageUtils");
  }
  getScriptPartFromCode(e) {
    if (e = _n(e), !e || e.indexOf("-") < 0) return null;
    const r = e.split("-");
    return r.length === 2 || (r.pop(), r[r.length - 1].toLowerCase() === "x") ? null : this.formatLanguageCode(r.join("-"));
  }
  getLanguagePartFromCode(e) {
    if (e = _n(e), !e || e.indexOf("-") < 0) return e;
    const r = e.split("-");
    return this.formatLanguageCode(r[0]);
  }
  formatLanguageCode(e) {
    if (W(e) && e.indexOf("-") > -1) {
      let r;
      try {
        r = Intl.getCanonicalLocales(e)[0];
      } catch {
      }
      return r && this.options.lowerCaseLng && (r = r.toLowerCase()), r || (this.options.lowerCaseLng ? e.toLowerCase() : e);
    }
    return this.options.cleanCode || this.options.lowerCaseLng ? e.toLowerCase() : e;
  }
  isSupportedCode(e) {
    return (this.options.load === "languageOnly" || this.options.nonExplicitSupportedLngs) && (e = this.getLanguagePartFromCode(e)), !this.supportedLngs || !this.supportedLngs.length || this.supportedLngs.indexOf(e) > -1;
  }
  getBestMatchFromCodes(e) {
    if (!e) return null;
    let r;
    return e.forEach((n) => {
      if (r) return;
      const s = this.formatLanguageCode(n);
      (!this.options.supportedLngs || this.isSupportedCode(s)) && (r = s);
    }), !r && this.options.supportedLngs && e.forEach((n) => {
      if (r) return;
      const s = this.getScriptPartFromCode(n);
      if (this.isSupportedCode(s)) return r = s;
      const a = this.getLanguagePartFromCode(n);
      if (this.isSupportedCode(a)) return r = a;
      r = this.options.supportedLngs.find((o) => {
        if (o === a) return o;
        if (!(o.indexOf("-") < 0 && a.indexOf("-") < 0) && (o.indexOf("-") > 0 && a.indexOf("-") < 0 && o.substring(0, o.indexOf("-")) === a || o.indexOf(a) === 0 && a.length > 1))
          return o;
      });
    }), r || (r = this.getFallbackCodes(this.options.fallbackLng)[0]), r;
  }
  getFallbackCodes(e, r) {
    if (!e) return [];
    if (typeof e == "function" && (e = e(r)), W(e) && (e = [e]), Array.isArray(e)) return e;
    if (!r) return e.default || [];
    let n = e[r];
    return n || (n = e[this.getScriptPartFromCode(r)]), n || (n = e[this.formatLanguageCode(r)]), n || (n = e[this.getLanguagePartFromCode(r)]), n || (n = e.default), n || [];
  }
  toResolveHierarchy(e, r) {
    const n = this.getFallbackCodes((r === !1 ? [] : r) || this.options.fallbackLng || [], e), s = [], a = (o) => {
      o && (this.isSupportedCode(o) ? s.push(o) : this.logger.warn(`rejecting language code not found in supportedLngs: ${o}`));
    };
    return W(e) && (e.indexOf("-") > -1 || e.indexOf("_") > -1) ? (this.options.load !== "languageOnly" && a(this.formatLanguageCode(e)), this.options.load !== "languageOnly" && this.options.load !== "currentOnly" && a(this.getScriptPartFromCode(e)), this.options.load !== "currentOnly" && a(this.getLanguagePartFromCode(e))) : W(e) && a(this.formatLanguageCode(e)), n.forEach((o) => {
      s.indexOf(o) < 0 && a(this.formatLanguageCode(o));
    }), s;
  }
}
const yl = {
  zero: 0,
  one: 1,
  two: 2,
  few: 3,
  many: 4,
  other: 5
}, $l = {
  select: (t) => t === 1 ? "one" : "other",
  resolvedOptions: () => ({
    pluralCategories: ["one", "other"]
  })
};
class JP {
  constructor(e, r = {}) {
    this.languageUtils = e, this.options = r, this.logger = pt.create("pluralResolver"), this.pluralRulesCache = {};
  }
  addRule(e, r) {
    this.rules[e] = r;
  }
  clearCache() {
    this.pluralRulesCache = {};
  }
  getRule(e, r = {}) {
    const n = _n(e === "dev" ? "en" : e), s = r.ordinal ? "ordinal" : "cardinal", a = JSON.stringify({
      cleanedCode: n,
      type: s
    });
    if (a in this.pluralRulesCache)
      return this.pluralRulesCache[a];
    let o;
    try {
      o = new Intl.PluralRules(n, {
        type: s
      });
    } catch {
      if (!Intl)
        return this.logger.error("No Intl support, please use an Intl polyfill!"), $l;
      if (!e.match(/-|_/)) return $l;
      const c = this.languageUtils.getLanguagePartFromCode(e);
      o = this.getRule(c, r);
    }
    return this.pluralRulesCache[a] = o, o;
  }
  needsPlural(e, r = {}) {
    let n = this.getRule(e, r);
    return n || (n = this.getRule("dev", r)), (n == null ? void 0 : n.resolvedOptions().pluralCategories.length) > 1;
  }
  getPluralFormsOfKey(e, r, n = {}) {
    return this.getSuffixes(e, n).map((s) => `${r}${s}`);
  }
  getSuffixes(e, r = {}) {
    let n = this.getRule(e, r);
    return n || (n = this.getRule("dev", r)), n ? n.resolvedOptions().pluralCategories.sort((s, a) => yl[s] - yl[a]).map((s) => `${this.options.prepend}${r.ordinal ? `ordinal${this.options.prepend}` : ""}${s}`) : [];
  }
  getSuffix(e, r, n = {}) {
    const s = this.getRule(e, n);
    return s ? `${this.options.prepend}${n.ordinal ? `ordinal${this.options.prepend}` : ""}${s.select(r)}` : (this.logger.warn(`no plural rule found for: ${e}`), this.getSuffix("dev", r, n));
  }
}
const vl = (t, e, r, n = ".", s = !0) => {
  let a = VP(t, e, r);
  return !a && s && W(r) && (a = Aa(t, r, n), a === void 0 && (a = Aa(e, r, n))), a;
}, pa = (t) => t.replace(/\$/g, "$$$$");
class _l {
  constructor(e = {}) {
    var r;
    this.logger = pt.create("interpolator"), this.options = e, this.format = ((r = e == null ? void 0 : e.interpolation) == null ? void 0 : r.format) || ((n) => n), this.init(e);
  }
  init(e = {}) {
    e.interpolation || (e.interpolation = {
      escapeValue: !0
    });
    const {
      escape: r,
      escapeValue: n,
      useRawValueToEscape: s,
      prefix: a,
      prefixEscaped: o,
      suffix: i,
      suffixEscaped: c,
      formatSeparator: l,
      unescapeSuffix: d,
      unescapePrefix: f,
      nestingPrefix: w,
      nestingPrefixEscaped: g,
      nestingSuffix: y,
      nestingSuffixEscaped: v,
      nestingOptionsSeparator: $,
      maxReplaces: p,
      alwaysFormat: E
    } = e.interpolation;
    this.escape = r !== void 0 ? r : zP, this.escapeValue = n !== void 0 ? n : !0, this.useRawValueToEscape = s !== void 0 ? s : !1, this.prefix = a ? br(a) : o || "{{", this.suffix = i ? br(i) : c || "}}", this.formatSeparator = l || ",", this.unescapePrefix = d ? "" : f || "-", this.unescapeSuffix = this.unescapePrefix ? "" : d || "", this.nestingPrefix = w ? br(w) : g || br("$t("), this.nestingSuffix = y ? br(y) : v || br(")"), this.nestingOptionsSeparator = $ || ",", this.maxReplaces = p || 1e3, this.alwaysFormat = E !== void 0 ? E : !1, this.resetRegExp();
  }
  reset() {
    this.options && this.init(this.options);
  }
  resetRegExp() {
    const e = (r, n) => (r == null ? void 0 : r.source) === n ? (r.lastIndex = 0, r) : new RegExp(n, "g");
    this.regexp = e(this.regexp, `${this.prefix}(.+?)${this.suffix}`), this.regexpUnescape = e(this.regexpUnescape, `${this.prefix}${this.unescapePrefix}(.+?)${this.unescapeSuffix}${this.suffix}`), this.nestingRegexp = e(this.nestingRegexp, `${this.nestingPrefix}((?:[^()"']+|"[^"]*"|'[^']*'|\\((?:[^()]|"[^"]*"|'[^']*')*\\))*?)${this.nestingSuffix}`);
  }
  interpolate(e, r, n, s) {
    var g;
    let a, o, i;
    const c = this.options && this.options.interpolation && this.options.interpolation.defaultVariables || {}, l = (y) => {
      if (y.indexOf(this.formatSeparator) < 0) {
        const E = vl(r, c, y, this.options.keySeparator, this.options.ignoreJSONStructure);
        return this.alwaysFormat ? this.format(E, void 0, n, {
          ...s,
          ...r,
          interpolationkey: y
        }) : E;
      }
      const v = y.split(this.formatSeparator), $ = v.shift().trim(), p = v.join(this.formatSeparator).trim();
      return this.format(vl(r, c, $, this.options.keySeparator, this.options.ignoreJSONStructure), p, n, {
        ...s,
        ...r,
        interpolationkey: $
      });
    };
    this.resetRegExp();
    const d = (s == null ? void 0 : s.missingInterpolationHandler) || this.options.missingInterpolationHandler, f = ((g = s == null ? void 0 : s.interpolation) == null ? void 0 : g.skipOnVariables) !== void 0 ? s.interpolation.skipOnVariables : this.options.interpolation.skipOnVariables;
    return [{
      regex: this.regexpUnescape,
      safeValue: (y) => pa(y)
    }, {
      regex: this.regexp,
      safeValue: (y) => this.escapeValue ? pa(this.escape(y)) : pa(y)
    }].forEach((y) => {
      for (i = 0; a = y.regex.exec(e); ) {
        const v = a[1].trim();
        if (o = l(v), o === void 0)
          if (typeof d == "function") {
            const p = d(e, a, s);
            o = W(p) ? p : "";
          } else if (s && Object.prototype.hasOwnProperty.call(s, v))
            o = "";
          else if (f) {
            o = a[0];
            continue;
          } else
            this.logger.warn(`missed to pass in variable ${v} for interpolating ${e}`), o = "";
        else !W(o) && !this.useRawValueToEscape && (o = ul(o));
        const $ = y.safeValue(o);
        if (e = e.replace(a[0], $), f ? (y.regex.lastIndex += o.length, y.regex.lastIndex -= a[0].length) : y.regex.lastIndex = 0, i++, i >= this.maxReplaces)
          break;
      }
    }), e;
  }
  nest(e, r, n = {}) {
    let s, a, o;
    const i = (c, l) => {
      const d = this.nestingOptionsSeparator;
      if (c.indexOf(d) < 0) return c;
      const f = c.split(new RegExp(`${d}[ ]*{`));
      let w = `{${f[1]}`;
      c = f[0], w = this.interpolate(w, o);
      const g = w.match(/'/g), y = w.match(/"/g);
      (((g == null ? void 0 : g.length) ?? 0) % 2 === 0 && !y || y.length % 2 !== 0) && (w = w.replace(/'/g, '"'));
      try {
        o = JSON.parse(w), l && (o = {
          ...l,
          ...o
        });
      } catch (v) {
        return this.logger.warn(`failed parsing options string in nesting for key ${c}`, v), `${c}${d}${w}`;
      }
      return o.defaultValue && o.defaultValue.indexOf(this.prefix) > -1 && delete o.defaultValue, c;
    };
    for (; s = this.nestingRegexp.exec(e); ) {
      let c = [];
      o = {
        ...n
      }, o = o.replace && !W(o.replace) ? o.replace : o, o.applyPostProcessor = !1, delete o.defaultValue;
      const l = /{.*}/.test(s[1]) ? s[1].lastIndexOf("}") + 1 : s[1].indexOf(this.formatSeparator);
      if (l !== -1 && (c = s[1].slice(l).split(this.formatSeparator).map((d) => d.trim()).filter(Boolean), s[1] = s[1].slice(0, l)), a = r(i.call(this, s[1].trim(), o), o), a && s[0] === e && !W(a)) return a;
      W(a) || (a = ul(a)), a || (this.logger.warn(`missed to resolve ${s[1]} for nesting ${e}`), a = ""), c.length && (a = c.reduce((d, f) => this.format(d, f, n.lng, {
        ...n,
        interpolationkey: s[1].trim()
      }), a.trim())), e = e.replace(s[0], a), this.regexp.lastIndex = 0;
    }
    return e;
  }
}
const BP = (t) => {
  let e = t.toLowerCase().trim();
  const r = {};
  if (t.indexOf("(") > -1) {
    const n = t.split("(");
    e = n[0].toLowerCase().trim();
    const s = n[1].substring(0, n[1].length - 1);
    e === "currency" && s.indexOf(":") < 0 ? r.currency || (r.currency = s.trim()) : e === "relativetime" && s.indexOf(":") < 0 ? r.range || (r.range = s.trim()) : s.split(";").forEach((o) => {
      if (o) {
        const [i, ...c] = o.split(":"), l = c.join(":").trim().replace(/^'+|'+$/g, ""), d = i.trim();
        r[d] || (r[d] = l), l === "false" && (r[d] = !1), l === "true" && (r[d] = !0), isNaN(l) || (r[d] = parseInt(l, 10));
      }
    });
  }
  return {
    formatName: e,
    formatOptions: r
  };
}, wl = (t) => {
  const e = {};
  return (r, n, s) => {
    let a = s;
    s && s.interpolationkey && s.formatParams && s.formatParams[s.interpolationkey] && s[s.interpolationkey] && (a = {
      ...a,
      [s.interpolationkey]: void 0
    });
    const o = n + JSON.stringify(a);
    let i = e[o];
    return i || (i = t(_n(n), s), e[o] = i), i(r);
  };
}, WP = (t) => (e, r, n) => t(_n(r), n)(e);
class XP {
  constructor(e = {}) {
    this.logger = pt.create("formatter"), this.options = e, this.init(e);
  }
  init(e, r = {
    interpolation: {}
  }) {
    this.formatSeparator = r.interpolation.formatSeparator || ",";
    const n = r.cacheInBuiltFormats ? wl : WP;
    this.formats = {
      number: n((s, a) => {
        const o = new Intl.NumberFormat(s, {
          ...a
        });
        return (i) => o.format(i);
      }),
      currency: n((s, a) => {
        const o = new Intl.NumberFormat(s, {
          ...a,
          style: "currency"
        });
        return (i) => o.format(i);
      }),
      datetime: n((s, a) => {
        const o = new Intl.DateTimeFormat(s, {
          ...a
        });
        return (i) => o.format(i);
      }),
      relativetime: n((s, a) => {
        const o = new Intl.RelativeTimeFormat(s, {
          ...a
        });
        return (i) => o.format(i, a.range || "day");
      }),
      list: n((s, a) => {
        const o = new Intl.ListFormat(s, {
          ...a
        });
        return (i) => o.format(i);
      })
    };
  }
  add(e, r) {
    this.formats[e.toLowerCase().trim()] = r;
  }
  addCached(e, r) {
    this.formats[e.toLowerCase().trim()] = wl(r);
  }
  format(e, r, n, s = {}) {
    const a = r.split(this.formatSeparator);
    if (a.length > 1 && a[0].indexOf("(") > 1 && a[0].indexOf(")") < 0 && a.find((i) => i.indexOf(")") > -1)) {
      const i = a.findIndex((c) => c.indexOf(")") > -1);
      a[0] = [a[0], ...a.splice(1, i)].join(this.formatSeparator);
    }
    return a.reduce((i, c) => {
      var f;
      const {
        formatName: l,
        formatOptions: d
      } = BP(c);
      if (this.formats[l]) {
        let w = i;
        try {
          const g = ((f = s == null ? void 0 : s.formatParams) == null ? void 0 : f[s.interpolationkey]) || {}, y = g.locale || g.lng || s.locale || s.lng || n;
          w = this.formats[l](i, y, {
            ...d,
            ...s,
            ...g
          });
        } catch (g) {
          this.logger.warn(g);
        }
        return w;
      } else
        this.logger.warn(`there was no format function for ${l}`);
      return i;
    }, e);
  }
}
const YP = (t, e) => {
  t.pending[e] !== void 0 && (delete t.pending[e], t.pendingCount--);
};
class QP extends zs {
  constructor(e, r, n, s = {}) {
    var a, o;
    super(), this.backend = e, this.store = r, this.services = n, this.languageUtils = n.languageUtils, this.options = s, this.logger = pt.create("backendConnector"), this.waitingReads = [], this.maxParallelReads = s.maxParallelReads || 10, this.readingCalls = 0, this.maxRetries = s.maxRetries >= 0 ? s.maxRetries : 5, this.retryTimeout = s.retryTimeout >= 1 ? s.retryTimeout : 350, this.state = {}, this.queue = [], (o = (a = this.backend) == null ? void 0 : a.init) == null || o.call(a, n, s.backend, s);
  }
  queueLoad(e, r, n, s) {
    const a = {}, o = {}, i = {}, c = {};
    return e.forEach((l) => {
      let d = !0;
      r.forEach((f) => {
        const w = `${l}|${f}`;
        !n.reload && this.store.hasResourceBundle(l, f) ? this.state[w] = 2 : this.state[w] < 0 || (this.state[w] === 1 ? o[w] === void 0 && (o[w] = !0) : (this.state[w] = 1, d = !1, o[w] === void 0 && (o[w] = !0), a[w] === void 0 && (a[w] = !0), c[f] === void 0 && (c[f] = !0)));
      }), d || (i[l] = !0);
    }), (Object.keys(a).length || Object.keys(o).length) && this.queue.push({
      pending: o,
      pendingCount: Object.keys(o).length,
      loaded: {},
      errors: [],
      callback: s
    }), {
      toLoad: Object.keys(a),
      pending: Object.keys(o),
      toLoadLanguages: Object.keys(i),
      toLoadNamespaces: Object.keys(c)
    };
  }
  loaded(e, r, n) {
    const s = e.split("|"), a = s[0], o = s[1];
    r && this.emit("failedLoading", a, o, r), !r && n && this.store.addResourceBundle(a, o, n, void 0, void 0, {
      skipCopy: !0
    }), this.state[e] = r ? -1 : 2, r && n && (this.state[e] = 0);
    const i = {};
    this.queue.forEach((c) => {
      MP(c.loaded, [a], o), YP(c, e), r && c.errors.push(r), c.pendingCount === 0 && !c.done && (Object.keys(c.loaded).forEach((l) => {
        i[l] || (i[l] = {});
        const d = c.loaded[l];
        d.length && d.forEach((f) => {
          i[l][f] === void 0 && (i[l][f] = !0);
        });
      }), c.done = !0, c.errors.length ? c.callback(c.errors) : c.callback());
    }), this.emit("loaded", i), this.queue = this.queue.filter((c) => !c.done);
  }
  read(e, r, n, s = 0, a = this.retryTimeout, o) {
    if (!e.length) return o(null, {});
    if (this.readingCalls >= this.maxParallelReads) {
      this.waitingReads.push({
        lng: e,
        ns: r,
        fcName: n,
        tried: s,
        wait: a,
        callback: o
      });
      return;
    }
    this.readingCalls++;
    const i = (l, d) => {
      if (this.readingCalls--, this.waitingReads.length > 0) {
        const f = this.waitingReads.shift();
        this.read(f.lng, f.ns, f.fcName, f.tried, f.wait, f.callback);
      }
      if (l && d && s < this.maxRetries) {
        setTimeout(() => {
          this.read.call(this, e, r, n, s + 1, a * 2, o);
        }, a);
        return;
      }
      o(l, d);
    }, c = this.backend[n].bind(this.backend);
    if (c.length === 2) {
      try {
        const l = c(e, r);
        l && typeof l.then == "function" ? l.then((d) => i(null, d)).catch(i) : i(null, l);
      } catch (l) {
        i(l);
      }
      return;
    }
    return c(e, r, i);
  }
  prepareLoading(e, r, n = {}, s) {
    if (!this.backend)
      return this.logger.warn("No backend was added via i18next.use. Will not load resources."), s && s();
    W(e) && (e = this.languageUtils.toResolveHierarchy(e)), W(r) && (r = [r]);
    const a = this.queueLoad(e, r, n, s);
    if (!a.toLoad.length)
      return a.pending.length || s(), null;
    a.toLoad.forEach((o) => {
      this.loadOne(o);
    });
  }
  load(e, r, n) {
    this.prepareLoading(e, r, {}, n);
  }
  reload(e, r, n) {
    this.prepareLoading(e, r, {
      reload: !0
    }, n);
  }
  loadOne(e, r = "") {
    const n = e.split("|"), s = n[0], a = n[1];
    this.read(s, a, "read", void 0, void 0, (o, i) => {
      o && this.logger.warn(`${r}loading namespace ${a} for language ${s} failed`, o), !o && i && this.logger.log(`${r}loaded namespace ${a} for language ${s}`, i), this.loaded(e, o, i);
    });
  }
  saveMissing(e, r, n, s, a, o = {}, i = () => {
  }) {
    var c, l, d, f, w;
    if ((l = (c = this.services) == null ? void 0 : c.utils) != null && l.hasLoadedNamespace && !((f = (d = this.services) == null ? void 0 : d.utils) != null && f.hasLoadedNamespace(r))) {
      this.logger.warn(`did not save key "${n}" as the namespace "${r}" was not yet loaded`, "This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!");
      return;
    }
    if (!(n == null || n === "")) {
      if ((w = this.backend) != null && w.create) {
        const g = {
          ...o,
          isUpdate: a
        }, y = this.backend.create.bind(this.backend);
        if (y.length < 6)
          try {
            let v;
            y.length === 5 ? v = y(e, r, n, s, g) : v = y(e, r, n, s), v && typeof v.then == "function" ? v.then(($) => i(null, $)).catch(i) : i(null, v);
          } catch (v) {
            i(v);
          }
        else
          y(e, r, n, s, i, g);
      }
      !e || !e[0] || this.store.addResource(e[0], r, n, s);
    }
  }
}
const El = () => ({
  debug: !1,
  initAsync: !0,
  ns: ["translation"],
  defaultNS: ["translation"],
  fallbackLng: ["dev"],
  fallbackNS: !1,
  supportedLngs: !1,
  nonExplicitSupportedLngs: !1,
  load: "all",
  preload: !1,
  simplifyPluralSuffix: !0,
  keySeparator: ".",
  nsSeparator: ":",
  pluralSeparator: "_",
  contextSeparator: "_",
  partialBundledLanguages: !1,
  saveMissing: !1,
  updateMissing: !1,
  saveMissingTo: "fallback",
  saveMissingPlurals: !0,
  missingKeyHandler: !1,
  missingInterpolationHandler: !1,
  postProcess: !1,
  postProcessPassResolved: !1,
  returnNull: !1,
  returnEmptyString: !0,
  returnObjects: !1,
  joinArrays: !1,
  returnedObjectHandler: !1,
  parseMissingKeyHandler: !1,
  appendNamespaceToMissingKey: !1,
  appendNamespaceToCIMode: !1,
  overloadTranslationOptionHandler: (t) => {
    let e = {};
    if (typeof t[1] == "object" && (e = t[1]), W(t[1]) && (e.defaultValue = t[1]), W(t[2]) && (e.tDescription = t[2]), typeof t[2] == "object" || typeof t[3] == "object") {
      const r = t[3] || t[2];
      Object.keys(r).forEach((n) => {
        e[n] = r[n];
      });
    }
    return e;
  },
  interpolation: {
    escapeValue: !0,
    format: (t) => t,
    prefix: "{{",
    suffix: "}}",
    formatSeparator: ",",
    unescapePrefix: "-",
    nestingPrefix: "$t(",
    nestingSuffix: ")",
    nestingOptionsSeparator: ",",
    maxReplaces: 1e3,
    skipOnVariables: !0
  },
  cacheInBuiltFormats: !0
}), bl = (t) => {
  var e, r;
  return W(t.ns) && (t.ns = [t.ns]), W(t.fallbackLng) && (t.fallbackLng = [t.fallbackLng]), W(t.fallbackNS) && (t.fallbackNS = [t.fallbackNS]), ((r = (e = t.supportedLngs) == null ? void 0 : e.indexOf) == null ? void 0 : r.call(e, "cimode")) < 0 && (t.supportedLngs = t.supportedLngs.concat(["cimode"])), typeof t.initImmediate == "boolean" && (t.initAsync = t.initImmediate), t;
}, Xn = () => {
}, ZP = (t) => {
  Object.getOwnPropertyNames(Object.getPrototypeOf(t)).forEach((r) => {
    typeof t[r] == "function" && (t[r] = t[r].bind(t));
  });
};
class gn extends zs {
  constructor(e = {}, r) {
    if (super(), this.options = bl(e), this.services = {}, this.logger = pt, this.modules = {
      external: []
    }, ZP(this), r && !this.isInitialized && !e.isClone) {
      if (!this.options.initAsync)
        return this.init(e, r), this;
      setTimeout(() => {
        this.init(e, r);
      }, 0);
    }
  }
  init(e = {}, r) {
    this.isInitializing = !0, typeof e == "function" && (r = e, e = {}), e.defaultNS == null && e.ns && (W(e.ns) ? e.defaultNS = e.ns : e.ns.indexOf("translation") < 0 && (e.defaultNS = e.ns[0]));
    const n = El();
    this.options = {
      ...n,
      ...this.options,
      ...bl(e)
    }, this.options.interpolation = {
      ...n.interpolation,
      ...this.options.interpolation
    }, e.keySeparator !== void 0 && (this.options.userDefinedKeySeparator = e.keySeparator), e.nsSeparator !== void 0 && (this.options.userDefinedNsSeparator = e.nsSeparator), typeof this.options.overloadTranslationOptionHandler != "function" && (this.options.overloadTranslationOptionHandler = n.overloadTranslationOptionHandler);
    const s = (l) => l ? typeof l == "function" ? new l() : l : null;
    if (!this.options.isClone) {
      this.modules.logger ? pt.init(s(this.modules.logger), this.options) : pt.init(null, this.options);
      let l;
      this.modules.formatter ? l = this.modules.formatter : l = XP;
      const d = new gl(this.options);
      this.store = new pl(this.options.resources, this.options);
      const f = this.services;
      f.logger = pt, f.resourceStore = this.store, f.languageUtils = d, f.pluralResolver = new JP(d, {
        prepend: this.options.pluralSeparator,
        simplifyPluralSuffix: this.options.simplifyPluralSuffix
      }), this.options.interpolation.format && this.options.interpolation.format !== n.interpolation.format && this.logger.deprecate("init: you are still using the legacy format function, please use the new approach: https://www.i18next.com/translation-function/formatting"), l && (!this.options.interpolation.format || this.options.interpolation.format === n.interpolation.format) && (f.formatter = s(l), f.formatter.init && f.formatter.init(f, this.options), this.options.interpolation.format = f.formatter.format.bind(f.formatter)), f.interpolator = new _l(this.options), f.utils = {
        hasLoadedNamespace: this.hasLoadedNamespace.bind(this)
      }, f.backendConnector = new QP(s(this.modules.backend), f.resourceStore, f, this.options), f.backendConnector.on("*", (g, ...y) => {
        this.emit(g, ...y);
      }), this.modules.languageDetector && (f.languageDetector = s(this.modules.languageDetector), f.languageDetector.init && f.languageDetector.init(f, this.options.detection, this.options)), this.modules.i18nFormat && (f.i18nFormat = s(this.modules.i18nFormat), f.i18nFormat.init && f.i18nFormat.init(this)), this.translator = new _s(this.services, this.options), this.translator.on("*", (g, ...y) => {
        this.emit(g, ...y);
      }), this.modules.external.forEach((g) => {
        g.init && g.init(this);
      });
    }
    if (this.format = this.options.interpolation.format, r || (r = Xn), this.options.fallbackLng && !this.services.languageDetector && !this.options.lng) {
      const l = this.services.languageUtils.getFallbackCodes(this.options.fallbackLng);
      l.length > 0 && l[0] !== "dev" && (this.options.lng = l[0]);
    }
    !this.services.languageDetector && !this.options.lng && this.logger.warn("init: no languageDetector is used and no lng is defined"), ["getResource", "hasResourceBundle", "getResourceBundle", "getDataByLanguage"].forEach((l) => {
      this[l] = (...d) => this.store[l](...d);
    }), ["addResource", "addResources", "addResourceBundle", "removeResourceBundle"].forEach((l) => {
      this[l] = (...d) => (this.store[l](...d), this);
    });
    const i = en(), c = () => {
      const l = (d, f) => {
        this.isInitializing = !1, this.isInitialized && !this.initializedStoreOnce && this.logger.warn("init: i18next is already initialized. You should call init just once!"), this.isInitialized = !0, this.options.isClone || this.logger.log("initialized", this.options), this.emit("initialized", this.options), i.resolve(f), r(d, f);
      };
      if (this.languages && !this.isInitialized) return l(null, this.t.bind(this));
      this.changeLanguage(this.options.lng, l);
    };
    return this.options.resources || !this.options.initAsync ? c() : setTimeout(c, 0), i;
  }
  loadResources(e, r = Xn) {
    var a, o;
    let n = r;
    const s = W(e) ? e : this.language;
    if (typeof e == "function" && (n = e), !this.options.resources || this.options.partialBundledLanguages) {
      if ((s == null ? void 0 : s.toLowerCase()) === "cimode" && (!this.options.preload || this.options.preload.length === 0)) return n();
      const i = [], c = (l) => {
        if (!l || l === "cimode") return;
        this.services.languageUtils.toResolveHierarchy(l).forEach((f) => {
          f !== "cimode" && i.indexOf(f) < 0 && i.push(f);
        });
      };
      s ? c(s) : this.services.languageUtils.getFallbackCodes(this.options.fallbackLng).forEach((d) => c(d)), (o = (a = this.options.preload) == null ? void 0 : a.forEach) == null || o.call(a, (l) => c(l)), this.services.backendConnector.load(i, this.options.ns, (l) => {
        !l && !this.resolvedLanguage && this.language && this.setResolvedLanguage(this.language), n(l);
      });
    } else
      n(null);
  }
  reloadResources(e, r, n) {
    const s = en();
    return typeof e == "function" && (n = e, e = void 0), typeof r == "function" && (n = r, r = void 0), e || (e = this.languages), r || (r = this.options.ns), n || (n = Xn), this.services.backendConnector.reload(e, r, (a) => {
      s.resolve(), n(a);
    }), s;
  }
  use(e) {
    if (!e) throw new Error("You are passing an undefined module! Please check the object you are passing to i18next.use()");
    if (!e.type) throw new Error("You are passing a wrong module! Please check the object you are passing to i18next.use()");
    return e.type === "backend" && (this.modules.backend = e), (e.type === "logger" || e.log && e.warn && e.error) && (this.modules.logger = e), e.type === "languageDetector" && (this.modules.languageDetector = e), e.type === "i18nFormat" && (this.modules.i18nFormat = e), e.type === "postProcessor" && Fd.addPostProcessor(e), e.type === "formatter" && (this.modules.formatter = e), e.type === "3rdParty" && this.modules.external.push(e), this;
  }
  setResolvedLanguage(e) {
    if (!(!e || !this.languages) && !(["cimode", "dev"].indexOf(e) > -1)) {
      for (let r = 0; r < this.languages.length; r++) {
        const n = this.languages[r];
        if (!(["cimode", "dev"].indexOf(n) > -1) && this.store.hasLanguageSomeTranslations(n)) {
          this.resolvedLanguage = n;
          break;
        }
      }
      !this.resolvedLanguage && this.languages.indexOf(e) < 0 && this.store.hasLanguageSomeTranslations(e) && (this.resolvedLanguage = e, this.languages.unshift(e));
    }
  }
  changeLanguage(e, r) {
    this.isLanguageChangingTo = e;
    const n = en();
    this.emit("languageChanging", e);
    const s = (i) => {
      this.language = i, this.languages = this.services.languageUtils.toResolveHierarchy(i), this.resolvedLanguage = void 0, this.setResolvedLanguage(i);
    }, a = (i, c) => {
      c ? this.isLanguageChangingTo === e && (s(c), this.translator.changeLanguage(c), this.isLanguageChangingTo = void 0, this.emit("languageChanged", c), this.logger.log("languageChanged", c)) : this.isLanguageChangingTo = void 0, n.resolve((...l) => this.t(...l)), r && r(i, (...l) => this.t(...l));
    }, o = (i) => {
      var d, f;
      !e && !i && this.services.languageDetector && (i = []);
      const c = W(i) ? i : i && i[0], l = this.store.hasLanguageSomeTranslations(c) ? c : this.services.languageUtils.getBestMatchFromCodes(W(i) ? [i] : i);
      l && (this.language || s(l), this.translator.language || this.translator.changeLanguage(l), (f = (d = this.services.languageDetector) == null ? void 0 : d.cacheUserLanguage) == null || f.call(d, l)), this.loadResources(l, (w) => {
        a(w, l);
      });
    };
    return !e && this.services.languageDetector && !this.services.languageDetector.async ? o(this.services.languageDetector.detect()) : !e && this.services.languageDetector && this.services.languageDetector.async ? this.services.languageDetector.detect.length === 0 ? this.services.languageDetector.detect().then(o) : this.services.languageDetector.detect(o) : o(e), n;
  }
  getFixedT(e, r, n) {
    const s = (a, o, ...i) => {
      let c;
      typeof o != "object" ? c = this.options.overloadTranslationOptionHandler([a, o].concat(i)) : c = {
        ...o
      }, c.lng = c.lng || s.lng, c.lngs = c.lngs || s.lngs, c.ns = c.ns || s.ns, c.keyPrefix !== "" && (c.keyPrefix = c.keyPrefix || n || s.keyPrefix);
      const l = this.options.keySeparator || ".";
      let d;
      return c.keyPrefix && Array.isArray(a) ? d = a.map((f) => (typeof f == "function" && (f = Da(f, {
        ...this.options,
        ...o
      })), `${c.keyPrefix}${l}${f}`)) : (typeof a == "function" && (a = Da(a, {
        ...this.options,
        ...o
      })), d = c.keyPrefix ? `${c.keyPrefix}${l}${a}` : a), this.t(d, c);
    };
    return W(e) ? s.lng = e : s.lngs = e, s.ns = r, s.keyPrefix = n, s;
  }
  t(...e) {
    var r;
    return (r = this.translator) == null ? void 0 : r.translate(...e);
  }
  exists(...e) {
    var r;
    return (r = this.translator) == null ? void 0 : r.exists(...e);
  }
  setDefaultNamespace(e) {
    this.options.defaultNS = e;
  }
  hasLoadedNamespace(e, r = {}) {
    if (!this.isInitialized)
      return this.logger.warn("hasLoadedNamespace: i18next was not initialized", this.languages), !1;
    if (!this.languages || !this.languages.length)
      return this.logger.warn("hasLoadedNamespace: i18n.languages were undefined or empty", this.languages), !1;
    const n = r.lng || this.resolvedLanguage || this.languages[0], s = this.options ? this.options.fallbackLng : !1, a = this.languages[this.languages.length - 1];
    if (n.toLowerCase() === "cimode") return !0;
    const o = (i, c) => {
      const l = this.services.backendConnector.state[`${i}|${c}`];
      return l === -1 || l === 0 || l === 2;
    };
    if (r.precheck) {
      const i = r.precheck(this, o);
      if (i !== void 0) return i;
    }
    return !!(this.hasResourceBundle(n, e) || !this.services.backendConnector.backend || this.options.resources && !this.options.partialBundledLanguages || o(n, e) && (!s || o(a, e)));
  }
  loadNamespaces(e, r) {
    const n = en();
    return this.options.ns ? (W(e) && (e = [e]), e.forEach((s) => {
      this.options.ns.indexOf(s) < 0 && this.options.ns.push(s);
    }), this.loadResources((s) => {
      n.resolve(), r && r(s);
    }), n) : (r && r(), Promise.resolve());
  }
  loadLanguages(e, r) {
    const n = en();
    W(e) && (e = [e]);
    const s = this.options.preload || [], a = e.filter((o) => s.indexOf(o) < 0 && this.services.languageUtils.isSupportedCode(o));
    return a.length ? (this.options.preload = s.concat(a), this.loadResources((o) => {
      n.resolve(), r && r(o);
    }), n) : (r && r(), Promise.resolve());
  }
  dir(e) {
    var s, a;
    if (e || (e = this.resolvedLanguage || (((s = this.languages) == null ? void 0 : s.length) > 0 ? this.languages[0] : this.language)), !e) return "rtl";
    try {
      const o = new Intl.Locale(e);
      if (o && o.getTextInfo) {
        const i = o.getTextInfo();
        if (i && i.direction) return i.direction;
      }
    } catch {
    }
    const r = ["ar", "shu", "sqr", "ssh", "xaa", "yhd", "yud", "aao", "abh", "abv", "acm", "acq", "acw", "acx", "acy", "adf", "ads", "aeb", "aec", "afb", "ajp", "apc", "apd", "arb", "arq", "ars", "ary", "arz", "auz", "avl", "ayh", "ayl", "ayn", "ayp", "bbz", "pga", "he", "iw", "ps", "pbt", "pbu", "pst", "prp", "prd", "ug", "ur", "ydd", "yds", "yih", "ji", "yi", "hbo", "men", "xmn", "fa", "jpr", "peo", "pes", "prs", "dv", "sam", "ckb"], n = ((a = this.services) == null ? void 0 : a.languageUtils) || new gl(El());
    return e.toLowerCase().indexOf("-latn") > 1 ? "ltr" : r.indexOf(n.getLanguagePartFromCode(e)) > -1 || e.toLowerCase().indexOf("-arab") > 1 ? "rtl" : "ltr";
  }
  static createInstance(e = {}, r) {
    const n = new gn(e, r);
    return n.createInstance = gn.createInstance, n;
  }
  cloneInstance(e = {}, r = Xn) {
    const n = e.forkResourceStore;
    n && delete e.forkResourceStore;
    const s = {
      ...this.options,
      ...e,
      isClone: !0
    }, a = new gn(s);
    if ((e.debug !== void 0 || e.prefix !== void 0) && (a.logger = a.logger.clone(e)), ["store", "services", "language"].forEach((i) => {
      a[i] = this[i];
    }), a.services = {
      ...this.services
    }, a.services.utils = {
      hasLoadedNamespace: a.hasLoadedNamespace.bind(a)
    }, n) {
      const i = Object.keys(this.store.data).reduce((c, l) => (c[l] = {
        ...this.store.data[l]
      }, c[l] = Object.keys(c[l]).reduce((d, f) => (d[f] = {
        ...c[l][f]
      }, d), c[l]), c), {});
      a.store = new pl(i, s), a.services.resourceStore = a.store;
    }
    return e.interpolation && (a.services.interpolator = new _l(s)), a.translator = new _s(a.services, s), a.translator.on("*", (i, ...c) => {
      a.emit(i, ...c);
    }), a.init(s, r), a.translator.options = s, a.translator.backendConnector.services.utils = {
      hasLoadedNamespace: a.hasLoadedNamespace.bind(a)
    }, a;
  }
  toJSON() {
    return {
      options: this.options,
      store: this.store,
      language: this.language,
      languages: this.languages,
      resolvedLanguage: this.resolvedLanguage
    };
  }
}
const we = gn.createInstance();
we.createInstance;
we.dir;
we.init;
we.loadResources;
we.reloadResources;
we.use;
we.changeLanguage;
we.getFixedT;
we.t;
we.exists;
we.setDefaultNamespace;
we.hasLoadedNamespace;
we.loadNamespaces;
we.loadLanguages;
const e1 = "TimeBoxClock", t1 = {
  start: "Start",
  stop: "Stop",
  cancel: "Cancel",
  confirm: "Confirm",
  yes: "Yes",
  no: "No",
  delete: "Delete",
  edit: "Rename",
  save: "Save"
}, r1 = {
  placeholder: "What are you working on?",
  noProject: "No Project",
  recentJobs: "Recent Jobs",
  noDescription: "No description"
}, n1 = {
  timer: "Timer",
  stats: "Stats",
  projects: "Projects",
  settings: "Settings"
}, s1 = {
  title: "Projects",
  addProject: "Add Project",
  newProjectPlaceholder: "Project Name",
  deleteConfirmation: "Delete project and its jobs?",
  deleteConfirmationUnassigned: "Delete unassigned jobs?",
  deleteJobs: "Delete Jobs",
  keepJobs: "Keep Jobs (Unassign)",
  clearUnassigned: "Clear Unassigned Jobs",
  moveUnassigned: "Move Unassigned Jobs",
  unassignedJobs: "Unassigned Jobs",
  noProjectsAlert: "No projects available to move jobs to.",
  moveInstruction: "Select a project:"
}, a1 = {
  totalTime: "Total Time",
  today: "Today",
  thisWeek: "This Week"
}, o1 = {
  showApp: "Show App",
  quit: "Quit"
}, i1 = {
  appTitle: e1,
  common: t1,
  main: r1,
  sidebar: n1,
  projects: s1,
  stats: a1,
  tray: o1
}, c1 = "TimeBoxClock", l1 = {
  start: "Start",
  stop: "Stop",
  cancel: "Anuluj",
  confirm: "Zatwierdź",
  yes: "Tak",
  no: "Nie",
  delete: "Usuń",
  edit: "Zmień nazwę",
  save: "Zapisz"
}, u1 = {
  placeholder: "Nad czym pracujesz?",
  noProject: "Bez Projektu",
  recentJobs: "Ostatnie zadania",
  noDescription: "Brak opisu"
}, d1 = {
  timer: "Stoper",
  stats: "Statystyki",
  projects: "Projekty",
  settings: "Ustawienia"
}, f1 = {
  title: "Projekty",
  addProject: "Dodaj Projekt",
  newProjectPlaceholder: "Nazwa Projektu",
  deleteConfirmation: "Usunąć projekt i jego zadania?",
  deleteConfirmationUnassigned: "Usunąć zadania bez projektu?",
  deleteJobs: "Usuń zadania",
  keepJobs: "Zachowaj zadania (Odprzypisz)",
  clearUnassigned: "Wyczyść nieprzypisane",
  moveUnassigned: "Przenieś nieprzypisane",
  unassignedJobs: "Nieprzypisane zadania",
  noProjectsAlert: "Brak projektów, do których można przenieść zadania.",
  moveInstruction: "Wybierz projekt:"
}, h1 = {
  totalTime: "Całkowity czas",
  today: "Dzisiaj",
  thisWeek: "W tym tygodniu"
}, p1 = {
  showApp: "Pokaż Aplikację",
  quit: "Wyjdź"
}, m1 = {
  appTitle: c1,
  common: l1,
  main: u1,
  sidebar: d1,
  projects: f1,
  stats: h1,
  tray: p1
}, Ud = re.dirname(Qd(import.meta.url)), _e = new CP({
  defaults: {
    projects: [],
    jobs: []
  }
}), g1 = () => {
  let t = _e.get("language");
  if (console.log("Store language:", t), !t) {
    const e = Ft.getLocale() || "en";
    t = e.split("-")[0], console.log(`Detected system locale: ${e}, using: ${t}`), _e.set("language", t);
  }
  we.init({
    lng: t,
    fallbackLng: "en",
    resources: {
      en: { translation: i1 },
      pl: { translation: m1 }
    }
  });
};
mt.on("log", (t, e) => console.log("Renderer/Preload:", e));
mt.on("language-changed", (t, e) => {
  console.log("Language changed to:", e), _e.set("language", e), we.changeLanguage(e), Gd();
});
mt.handle("db:get-projects", () => (console.log("IPC: db:get-projects"), _e.get("projects")));
mt.handle("db:add-project", (t, e) => {
  console.log("IPC: db:add-project", e);
  const r = _e.get("projects");
  return _e.set("projects", [...r, e]), e;
});
mt.handle("db:delete-project", (t, e) => {
  console.log("IPC: db:delete-project", e);
  const r = _e.get("projects");
  _e.set("projects", r.filter((n) => n.id !== e));
});
mt.handle("db:update-project", (t, e) => {
  console.log("IPC: db:update-project", e);
  const r = _e.get("projects");
  return _e.set("projects", r.map((n) => n.id === e.id ? e : n)), e;
});
mt.handle("db:get-jobs", () => (console.log("IPC: db:get-jobs"), _e.get("jobs")));
mt.handle("db:add-job", (t, e) => {
  console.log("IPC: db:add-job", e);
  const r = _e.get("jobs");
  return _e.set("jobs", [...r, e]), e;
});
mt.handle("db:update-job", (t, e) => {
  console.log("IPC: db:update-job", e);
  const r = _e.get("jobs");
  return _e.set("jobs", r.map((n) => n.id === e.id ? e : n)), e;
});
mt.handle("db:delete-job", (t, e) => {
  console.log("IPC: db:delete-job", e);
  const r = _e.get("jobs");
  _e.set("jobs", r.filter((n) => n.id !== e));
});
process.env.APP_ROOT = re.join(Ud, "..");
const La = process.env.VITE_DEV_SERVER_URL, M1 = re.join(process.env.APP_ROOT, "dist-electron"), Kd = re.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = La ? re.join(process.env.APP_ROOT, "public") : Kd;
let le, yn = null, qd = !1;
function xd() {
  le = new Pl({
    width: 900,
    height: 670,
    show: !1,
    // Don't show until ready
    autoHideMenuBar: !0,
    icon: re.join(process.env.VITE_PUBLIC, "TimeBoxClock.ico"),
    webPreferences: {
      preload: re.join(Ud, "preload.cjs"),
      sandbox: !1,
      contextIsolation: !0
    }
  }), le.webContents.on("did-finish-load", () => {
    le == null || le.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), La ? le.loadURL(La) : le.loadFile(re.join(Kd, "index.html")), le.on("close", (t) => qd ? !0 : (t.preventDefault(), le == null || le.hide(), !1)), le.once("ready-to-show", () => {
    le == null || le.show();
  });
}
function y1() {
  const t = re.join(process.env.VITE_PUBLIC, "TimeBoxClock.ico");
  console.log("Tray Icon Path:", t);
  const e = Xd.createFromPath(t);
  console.log("Tray Icon Empty:", e.isEmpty()), yn = new Yd(e), yn.setToolTip("TimeBoxClock"), Gd(), yn.on("click", () => {
    $1();
  });
}
function Gd() {
  if (!yn) return;
  const t = Wd.buildFromTemplate([
    { label: we.t("tray.showApp"), click: () => Hd() },
    { type: "separator" },
    {
      label: we.t("tray.quit"),
      click: () => {
        qd = !0, Ft.quit();
      }
    }
  ]);
  yn.setContextMenu(t);
}
function $1() {
  le != null && le.isVisible() ? le.hide() : Hd();
}
function Hd() {
  le == null || le.show(), le == null || le.focus();
}
const v1 = Ft.requestSingleInstanceLock();
v1 ? (Ft.on("second-instance", () => {
  le && (le.isMinimized() && le.restore(), le.isVisible() || le.show(), le.focus());
}), Ft.whenReady().then(() => {
  _1(), g1(), y1(), xd();
})) : Ft.quit();
Ft.on("window-all-closed", () => {
  process.platform;
});
Ft.on("activate", () => {
  Pl.getAllWindows().length === 0 && xd();
});
function _1() {
  console.log("Running job consolidation...");
  const t = _e.get("jobs") || [], e = AP(t);
  e.length !== t.length ? (_e.set("jobs", e), console.log(`Consolidated jobs. Old count: ${t.length}, New count: ${e.length}`)) : console.log("No jobs to consolidate.");
}
export {
  M1 as MAIN_DIST,
  Kd as RENDERER_DIST,
  La as VITE_DEV_SERVER_URL
};
