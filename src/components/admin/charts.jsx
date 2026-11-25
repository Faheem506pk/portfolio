"use client"

import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

// Recharts (MIT). Colors come from the admin theme variables, so charts follow light and dark.
// Flat fills only: no gradients. Animation is off so charts respect reduced-motion users.
const AXIS = { fontSize: 12, fill: "var(--muted-foreground)" }

function TipBox({ active, payload, label, unit }) {
  if (!active || !payload?.length) return null
  return (
    <div className="wp-tip">
      <div className="muted">{label ?? payload[0].name}</div>
      <strong>
        {payload[0].value} {unit}
      </strong>
    </div>
  )
}

export function ViewsArea({ data, unit = "views" }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 6, right: 8, bottom: 0, left: -18 }}>
        <CartesianGrid stroke="var(--border)" vertical={false} />
        <XAxis dataKey="label" tick={AXIS} tickLine={false} axisLine={false} interval="preserveStartEnd" minTickGap={28} />
        <YAxis tick={AXIS} tickLine={false} axisLine={false} allowDecimals={false} width={44} />
        <Tooltip content={<TipBox unit={unit} />} cursor={{ stroke: "var(--border)" }} />
        <Area type="monotone" dataKey="count" stroke="var(--primary)" strokeWidth={2} fill="var(--primary)" fillOpacity={0.1} isAnimationActive={false} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

const DONUT_FILLS = ["var(--primary)", "var(--tone-info)", "var(--tone-neutral)", "var(--tone-warning)"]

export function Donut({ data, unit = "views" }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius="62%" outerRadius="92%" paddingAngle={2} stroke="var(--card)" strokeWidth={2} isAnimationActive={false}>
          {data.map((entry, i) => (
            <Cell key={entry.name} fill={DONUT_FILLS[i % DONUT_FILLS.length]} />
          ))}
        </Pie>
        <Tooltip content={<TipBox unit={unit} />} />
      </PieChart>
    </ResponsiveContainer>
  )
}

export function BarsList({ data, unit = "views" }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 8, bottom: 0, left: 0 }}>
        <XAxis type="number" hide />
        <YAxis type="category" dataKey="name" tick={AXIS} tickLine={false} axisLine={false} width={120} />
        <Tooltip content={<TipBox unit={unit} />} cursor={{ fill: "var(--muted)" }} />
        <Bar dataKey="value" fill="var(--primary)" radius={4} barSize={14} isAnimationActive={false} />
      </BarChart>
    </ResponsiveContainer>
  )
}
