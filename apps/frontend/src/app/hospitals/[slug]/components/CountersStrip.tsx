import React from 'react'

type Stat = {
  label: string
  value: string
}

type Props = {
  stats: Stat[]
}

export function CountersStrip({ stats }: Props) {
  if (!stats || stats.length === 0) return null

  return (
    <section className="bg-brand-ink py-12 text-white">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold text-brand-teal md:text-5xl">
                {stat.value}
              </div>
              <div className="mt-2 text-sm uppercase tracking-wider text-brand-mist">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
