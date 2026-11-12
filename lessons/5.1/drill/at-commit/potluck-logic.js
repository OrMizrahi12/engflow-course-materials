/* ===== Potluck logic module (pure: no DOM). This is the liftable part. ===== */
const Potluck = (() => {
  'use strict';

  // ---- Money ----------------------------------------------------------------
  // Minor-unit digits come from ISO 4217, not from Intl (Intl says HUF has 0).
  const CURRENCIES = {
    USD: { digits: 2, label: 'USD: US dollar (2 decimals)' },
    EUR: { digits: 2, label: 'EUR: euro (2 decimals)' },
    JPY: { digits: 0, label: 'JPY: Japanese yen (0 decimals)' },
    BHD: { digits: 3, label: 'BHD: Bahraini dinar (3 decimals)' },
    KWD: { digits: 3, label: 'KWD: Kuwaiti dinar (3 decimals)' },
    HUF: { digits: 2, label: 'HUF: Hungarian forint (ISO: 2 decimals, browsers show 0)' },
  };
  const LIMITS = { members: 50, expenses: 5000, maxMajorAmount: 10000000 };
  const digitsOf = (currency) => CURRENCIES[currency].digits;
  const maxAmount = (currency) => LIMITS.maxMajorAmount * 10 ** digitsOf(currency);

  const formatters = new Map();
  function format(minor, currency) {
    if (!formatters.has(currency)) {
      const d = digitsOf(currency);
      formatters.set(currency, new Intl.NumberFormat('en-US', {
        style: 'currency', currency, minimumFractionDigits: d, maximumFractionDigits: d,
      }));
    }
    return formatters.get(currency).format(minor / 10 ** digitsOf(currency));
  }

  // Text typed by a person ("12.34") -> integer minor units. No floats on the way in.
  function parseAmount(text, currency) {
    const t = String(text ?? '').trim().replace(/,/g, '');
    if (t.startsWith('-')) return { error: 'Amounts are positive only. A refund is handled by editing or deleting the original expense.' };
    const m = /^(\d*)(?:\.(\d*))?$/.exec(t);
    if (!m || (m[1] === '' && !m[2])) return { error: `"${text}" isn't an amount.` };
    const d = digitsOf(currency);
    const frac = m[2] || '';
    if (frac.replace(/0+$/, '').length > d) {
      return { error: d === 0 ? `${currency} has no minor units: whole amounts only.` : `${currency} has at most ${d} decimal places.` };
    }
    const intPart = m[1].replace(/^0+/, '') || '0';
    if (intPart.length > 12) return { error: `That's above the cap of ${LIMITS.maxMajorAmount.toLocaleString('en-US')} ${currency}.` };
    const fracUnits = d === 0 ? 0 : Number((frac + '0'.repeat(d)).slice(0, d));
    return { value: Number(intPart) * 10 ** d + fracUnits };
  }

  function amountProblem(value, currency) {
    if (!Number.isSafeInteger(value)) return 'The amount must be a whole number of minor units.';
    if (value <= 0) return 'Amounts are positive only: no zero, no negatives. A refund is handled by editing or deleting the original expense.';
    if (value > maxAmount(currency)) return `The cap is ${format(maxAmount(currency), currency)}.`;
    return null;
  }

  // ---- Shares: the odd-cent rule (after Spliit) -----------------------------
  function fnv1a(str) {
    let h = 0x811c9dc5;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    return h >>> 0;
  }

  const orderCache = new WeakMap();
  function orderOf(members) {
    let map = orderCache.get(members);
    if (!map) { map = new Map(members.map((m) => [m.id, m.order])); orderCache.set(members, map); }
    return map;
  }

  // Pure function of the expense: same id, amount and participants -> same shares.
  function computeShares(expense, members) {
    const order = orderOf(members);
    const P = [...expense.participantIds].sort((a, b) => order.get(a) - order.get(b));
    const n = P.length;
    const q = Math.floor(expense.amount / n);
    const r = expense.amount % n;
    const offset = fnv1a(expense.id) % n;
    const shares = P.map((memberId) => ({ memberId, share: q, extra: 0 }));
    for (let i = 0; i < r; i++) { const s = shares[(offset + i) % n]; s.share += 1; s.extra = 1; }
    return { n, q, r, offset, shares };
  }

  // Comparison rule only (used by the fairness experiment): leftover to the first r by creation order.
  function computeSharesFirstK(expense, members) {
    const order = orderOf(members);
    const P = [...expense.participantIds].sort((a, b) => order.get(a) - order.get(b));
    const n = P.length, q = Math.floor(expense.amount / n), r = expense.amount % n;
    return P.map((memberId, i) => ({ memberId, share: q + (i < r ? 1 : 0), extra: i < r ? 1 : 0 }));
  }

  // ---- Balances ---------------------------------------------------------------
  // balance = paid + settlements made - shares - settlements received
  function ledger(state) {
    const L = new Map(state.members.map((m) => [m.id, { paid: 0, shares: 0, made: 0, received: 0, balance: 0 }]));
    for (const e of state.expenses) {
      L.get(e.payerId).paid += e.amount;
      for (const s of computeShares(e, state.members).shares) L.get(s.memberId).shares += s.share;
    }
    for (const st of state.settlements) {
      L.get(st.fromId).made += st.amount;
      L.get(st.toId).received += st.amount;
    }
    for (const row of L.values()) row.balance = row.paid + row.made - row.shares - row.received;
    return L;
  }

  // ---- Suggested settlements --------------------------------------------------
  // Greedy: repeatedly match the largest debtor with the largest creditor.
  // Ties go to the earlier-created member, so the result is deterministic.
  function greedyMatch(entries) {
    const cred = entries.filter((e) => e.amount > 0).map((e) => ({ ...e }));
    const debt = entries.filter((e) => e.amount < 0).map((e) => ({ ...e, amount: -e.amount }));
    const byAmount = (a, b) => b.amount - a.amount || a.order - b.order;
    const out = [];
    while (cred.length && debt.length) {
      cred.sort(byAmount); debt.sort(byAmount);
      const c = cred[0], d = debt[0];
      const x = Math.min(c.amount, d.amount);
      out.push({ fromId: d.id, toId: c.id, amount: x });
      c.amount -= x; d.amount -= x;
      if (c.amount === 0) cred.shift();
      if (d.amount === 0) debt.shift();
    }
    return out;
  }

  function balanceEntries(state, L = ledger(state)) {
    return state.members
      .map((m) => ({ id: m.id, order: m.order, amount: L.get(m.id).balance }))
      .filter((e) => e.amount !== 0);
  }

  function suggestSettlements(state, L) {
    return greedyMatch(balanceEntries(state, L));
  }

  // NOT the rule. Exact minimum, for comparison only. The minimum number of settlements is
  // (members with a nonzero balance) - (most groups they can be split into that each sum to zero).
  // Exponential in the number of nonzero balances, so it gives up above FEWEST_LIMIT.
  const FEWEST_LIMIT = 18;
  function fewestSettlements(entries) {
    const k = entries.length;
    if (k === 0) return { count: 0, plan: [] };
    if (k > FEWEST_LIMIT) return null;
    const N = 1 << k;
    const sum = new Float64Array(N);
    for (let mask = 1; mask < N; mask++) {
      const low = mask & -mask;
      sum[mask] = sum[mask ^ low] + entries[31 - Math.clz32(low)].amount;
    }
    const dp = new Uint8Array(N);
    for (let mask = 1; mask < N; mask++) {
      let best = 0;
      for (let i = 0; i < k; i++) if (mask & (1 << i)) { const v = dp[mask ^ (1 << i)]; if (v > best) best = v; }
      dp[mask] = best + (sum[mask] === 0 ? 1 : 0);
    }
    // Rebuild one maximal split into zero-sum groups, then settle each group greedily.
    let mask = N - 1;
    const removed = [];
    while (mask) {
      const z = sum[mask] === 0 ? 1 : 0;
      for (let i = 0; i < k; i++) {
        if ((mask & (1 << i)) && dp[mask ^ (1 << i)] + z === dp[mask]) { removed.push(i); mask ^= 1 << i; break; }
      }
    }
    const groups = [];
    let cur = [], running = 0;
    for (const i of removed.reverse()) {
      cur.push(entries[i]); running += entries[i].amount;
      if (running === 0) { groups.push(cur); cur = []; }
    }
    const plan = groups.flatMap((g) => greedyMatch(g));
    return { count: k - dp[N - 1], plan, groups: groups.map((g) => g.map((e) => e.id)) };
  }

  // ---- State and actions -------------------------------------------------------
  function emptyGroup(currency = 'USD') {
    return {
      currency,
      members: [],
      expenses: [],
      settlements: [],
      seq: { member: 1, expense: 1, settlement: 1 },
      options: { allowSelfSettlement: false },
    };
  }

  const memberById = (s, id) => s.members.find((m) => m.id === id);
  const nameOf = (s, id) => memberById(s, id)?.name ?? `(unknown ${id})`;
  const nextExpenseId = (s) => `exp-${s.seq.expense}`;

  function memberReferences(s, id) {
    return {
      paid: s.expenses.filter((e) => e.payerId === id).length,
      participates: s.expenses.filter((e) => e.participantIds.includes(id)).length,
      settlements: s.settlements.filter((t) => t.fromId === id || t.toId === id).length,
    };
  }

  function expenseProblem(s, e) {
    const p = amountProblem(e.amount, s.currency);
    if (p) return p;
    if (!memberById(s, e.payerId)) return 'An expense needs exactly one payer.';
    const ids = e.participantIds || [];
    if (new Set(ids).size !== ids.length) return 'A member can only be a participant once.';
    if (ids.some((id) => !memberById(s, id))) return 'Every participant must be a member of the group.';
    if (ids.length === 0) return 'An expense needs participants.';
    if (!ids.some((id) => id !== e.payerId)) {
      return `An expense needs at least one participant other than its payer. Here ${nameOf(s, e.payerId)} would be paying only for themselves.`;
    }
    return null;
  }

  function settlementProblem(s, t) {
    const p = amountProblem(t.amount, s.currency);
    if (p) return p;
    if (!memberById(s, t.fromId) || !memberById(s, t.toId)) return 'A settlement is between two members of the group.';
    if (t.fromId === t.toId && !s.options.allowSelfSettlement) {
      return `${nameOf(s, t.fromId)} can't record a settlement with themselves. (Undecided rule: the prototype refuses unless you tick "allow" under Group.)`;
    }
    return null;
  }

  const cleanExpense = (e) => ({
    id: e.id, description: String(e.description ?? '').trim(), amount: e.amount, date: e.date || '',
    payerId: e.payerId, participantIds: [...(e.participantIds || [])],
  });
  const cleanSettlement = (t) => ({ id: t.id, fromId: t.fromId, toId: t.toId, amount: t.amount, date: t.date || '' });

  // (state, action) -> { state, error }. A refused action leaves state unchanged.
  function reduce(s, a) {
    const refuse = (error) => ({ state: s, error });
    const ok = (state) => ({ state, error: null });
    switch (a.type) {
      case 'setCurrency':
        if (!CURRENCIES[a.currency]) return refuse(`Unknown currency ${a.currency}.`);
        if (a.currency === s.currency) return ok(s);
        if (s.expenses.length || s.settlements.length) {
          return refuse(`The currency can't change once the group has expenses or settlements: every stored amount is in ${s.currency} minor units. (Not specified. The prototype refuses.)`);
        }
        return ok({ ...s, currency: a.currency });
      case 'setOption':
        return ok({ ...s, options: { ...s.options, [a.key]: a.value } });

      case 'addMember': {
        const name = String(a.name ?? '').trim();
        if (!name) return refuse('A member needs a name.');
        if (s.members.length >= LIMITS.members) return refuse(`A group has at most ${LIMITS.members} members.`);
        const n = s.seq.member;
        return ok({ ...s, seq: { ...s.seq, member: n + 1 }, members: [...s.members, { id: `mem-${n}`, name, order: n, active: true }] });
      }
      case 'renameMember': {
        const name = String(a.name ?? '').trim();
        if (!name) return refuse('A member needs a name.');
        if (!memberById(s, a.id)) return refuse('No such member.');
        return ok({ ...s, members: s.members.map((m) => (m.id === a.id ? { ...m, name } : m)) });
      }
      case 'setMemberActive':
        if (!memberById(s, a.id)) return refuse('No such member.');
        return ok({ ...s, members: s.members.map((m) => (m.id === a.id ? { ...m, active: !!a.active } : m)) });
      case 'deleteMember': {
        const m = memberById(s, a.id);
        if (!m) return refuse('No such member.');
        const r = memberReferences(s, a.id);
        if (r.paid || r.participates || r.settlements) {
          const why = [r.paid && `payer of ${r.paid} expense(s)`, r.participates && `participant in ${r.participates} expense(s)`, r.settlements && `in ${r.settlements} settlement(s)`].filter(Boolean).join(', ');
          return refuse(`${m.name} can't be deleted because they're referenced (${why}). They can only be made inactive.`);
        }
        return ok({ ...s, members: s.members.filter((x) => x.id !== a.id) });
      }

      case 'addExpense': {
        if (s.expenses.length >= LIMITS.expenses) return refuse(`A group has at most ${LIMITS.expenses.toLocaleString('en-US')} expenses.`);
        const e = cleanExpense({ ...a.expense, id: nextExpenseId(s) });
        const p = expenseProblem(s, e);
        if (p) return refuse(p);
        return ok({ ...s, seq: { ...s.seq, expense: s.seq.expense + 1 }, expenses: [...s.expenses, e] });
      }
      case 'editExpense': {
        const old = s.expenses.find((e) => e.id === a.id);
        if (!old) return refuse('No such expense.');
        const e = cleanExpense({ ...old, ...a.changes, id: old.id });
        const p = expenseProblem(s, e);
        if (p) return refuse(p);
        return ok({ ...s, expenses: s.expenses.map((x) => (x.id === a.id ? e : x)) });
      }
      case 'deleteExpense':
        if (!s.expenses.some((e) => e.id === a.id)) return refuse('No such expense.');
        return ok({ ...s, expenses: s.expenses.filter((e) => e.id !== a.id) });

      case 'addSettlement': {
        const t = cleanSettlement({ ...a.settlement, id: `set-${s.seq.settlement}` });
        const p = settlementProblem(s, t);
        if (p) return refuse(p);
        return ok({ ...s, seq: { ...s.seq, settlement: s.seq.settlement + 1 }, settlements: [...s.settlements, t] });
      }
      case 'editSettlement': {
        const old = s.settlements.find((t) => t.id === a.id);
        if (!old) return refuse('No such settlement.');
        const t = cleanSettlement({ ...old, ...a.changes, id: old.id });
        const p = settlementProblem(s, t);
        if (p) return refuse(p);
        return ok({ ...s, settlements: s.settlements.map((x) => (x.id === a.id ? t : x)) });
      }
      case 'deleteSettlement':
        if (!s.settlements.some((t) => t.id === a.id)) return refuse('No such settlement.');
        return ok({ ...s, settlements: s.settlements.filter((t) => t.id !== a.id) });

      case 'load': {
        const x = a.state;
        if (!x || !CURRENCIES[x.currency] || !Array.isArray(x.members) || !Array.isArray(x.expenses) || !Array.isArray(x.settlements)) {
          return refuse('That JSON isn\'t a Potluck group.');
        }
        const st = { ...emptyGroup(x.currency), ...x, options: { ...emptyGroup().options, ...(x.options || {}) } };
        for (const e of st.expenses) { const p = expenseProblem(st, e); if (p) return refuse(`Expense ${e.id}: ${p}`); }
        for (const t of st.settlements) { const p = settlementProblem(st, t); if (p) return refuse(`Settlement ${t.id}: ${p}`); }
        return ok(st);
      }
      default:
        return refuse(`Unknown action ${a.type}.`);
    }
  }

  // Checked after every action.
  function checkInvariants(s, L = ledger(s)) {
    const problems = [];
    let total = 0;
    for (const row of L.values()) total += row.balance;
    if (total !== 0) problems.push(`Balances sum to ${total} minor units, not 0.`);
    for (const e of s.expenses) {
      const sum = computeShares(e, s.members).shares.reduce((a, x) => a + x.share, 0);
      if (sum !== e.amount) problems.push(`Shares of ${e.id} sum to ${sum}, not ${e.amount}.`);
    }
    return problems;
  }

  // ---- Simulations (for the experiments) ------------------------------------------
  function rng(seed) {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const pick = (r, arr) => arr[Math.floor(r() * arr.length)];

  function randomExpense(r, members, i, amount, allShare) {
    const ids = members.map((m) => m.id);
    const payerId = pick(r, ids);
    let participantIds;
    if (r() < allShare) participantIds = ids.slice();
    else {
      participantIds = ids.filter(() => r() < 0.5);
      if (!participantIds.some((id) => id !== payerId)) participantIds.push(pick(r, ids.filter((id) => id !== payerId)));
    }
    return { id: `exp-${i}`, description: `Random ${i}`, amount, date: '2026-11-01', payerId, participantIds };
  }

  // styles: 'cents' = any amount like 37.81; 'round' = whole tens like 40.00, 120.00
  function randomGroup(r, n, style, currency = 'USD') {
    const s = emptyGroup(currency);
    s.members = Array.from({ length: n }, (_, i) => ({ id: `mem-${i + 1}`, name: `M${i + 1}`, order: i + 1, active: true }));
    const count = 8 + Math.floor(r() * 30);
    for (let i = 1; i <= count; i++) {
      const amount = style === 'round' ? (1 + Math.floor(r() * 20)) * 1000 : 100 + Math.floor(r() * 19900);
      s.expenses.push(randomExpense(r, s.members, i, amount, 0.6));
    }
    s.seq = { member: n + 1, expense: count + 1, settlement: 1 };
    return s;
  }

  function greedyVsFewest({ sizes = [4, 5, 6, 7, 8, 9, 10], trials = 2000, style = 'cents', seed = 1 } = {}) {
    const r = rng(seed);
    return sizes.map((n) => {
      const row = { members: n, trials, worse: 0, maxExtra: 0, extraTotal: 0, greedyTotal: 0, fewestTotal: 0, example: null };
      for (let t = 0; t < trials; t++) {
        const s = randomGroup(r, n, style);
        const entries = balanceEntries(s);
        const g = greedyMatch(entries).length;
        const f = fewestSettlements(entries).count;
        row.greedyTotal += g; row.fewestTotal += f;
        if (g > f) {
          row.worse++; row.extraTotal += g - f;
          if (g - f > row.maxExtra) { row.maxExtra = g - f; row.example = s; }
        }
      }
      return row;
    });
  }

  function fairness({ memberCount = 5, expenseCount = 1000, seed = 7, allShare = 0.5 } = {}) {
    const r = rng(seed);
    const s = emptyGroup('USD');
    s.members = Array.from({ length: memberCount }, (_, i) => ({ id: `mem-${i + 1}`, name: ['Ana', 'Ben', 'Cai', 'Dee', 'Eli', 'Fay', 'Gus', 'Hal'][i] || `M${i + 1}`, order: i + 1, active: true }));
    for (let i = 1; i <= expenseCount; i++) {
      s.expenses.push(randomExpense(r, s.members, i, 100 + Math.floor(r() * 1900), allShare));
    }
    s.seq = { member: memberCount + 1, expense: expenseCount + 1, settlement: 1 };
    const rows = new Map(s.members.map((m) => [m.id, { id: m.id, name: m.name, rotation: 0, firstK: 0, leftoverChances: 0 }]));
    for (const e of s.expenses) {
      const sh = computeShares(e, s.members);
      if (sh.r > 0) for (const x of sh.shares) rows.get(x.memberId).leftoverChances++;
      for (const x of sh.shares) rows.get(x.memberId).rotation += x.extra;
      for (const x of computeSharesFirstK(e, s.members)) rows.get(x.memberId).firstK += x.extra;
    }
    return { state: s, rows: [...rows.values()] };
  }

  return {
    CURRENCIES, LIMITS, digitsOf, maxAmount, format, parseAmount, fnv1a,
    computeShares, computeSharesFirstK, ledger, suggestSettlements, greedyMatch, balanceEntries,
    fewestSettlements, FEWEST_LIMIT, emptyGroup, reduce, checkInvariants, memberReferences,
    nameOf, nextExpenseId, sim: { rng, randomGroup, greedyVsFewest, fairness },
  };
})();

export { Potluck };
