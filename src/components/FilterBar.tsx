'use client'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'

const categories = ['Musical','Play','Comedy','Drama','Family']

export default function FilterBar() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const qDefault = searchParams.get('q') || ''
  const typeDefault = (searchParams.get('type') as 'BROADWAY'|'OFF_BROADWAY'|'ALL') || 'ALL'
  const selectedCats = new Set((searchParams.get('categories') || '').split(',').filter(Boolean))

  const [q, setQ] = useState(qDefault)
  const [type, setType] = useState(typeDefault)

  const apply = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString())
    if (q) params.set('q', q) else params.delete('q')
    if (type && type !== 'ALL') params.set('type', type) else params.delete('type')
    const cats = Array.from(selectedCats)
    if (cats.length) params.set('categories', cats.join(',')) else params.delete('categories')
    params.delete('page')
    router.replace(`${pathname}?${params.toString()}`)
  }, [q, type, selectedCats, pathname, router, searchParams])

  const toggleCat = (c: string) => {
    if (selectedCats.has(c)) selectedCats.delete(c) else selectedCats.add(c)
  }

  return (
    <div className="sticky top-0 z-10 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b">
      <div className="container-padded py-3 space-y-2">
        <div className="flex gap-2">
          <input
            placeholder="Search shows…"
            className="flex-1 rounded-lg border px-3 py-2 text-sm"
            value={q}
            onChange={(e)=>setQ(e.target.value)}
            onKeyDown={(e)=>{ if(e.key==='Enter') apply() }}
          />
          <button onClick={apply} className="rounded-lg border px-3 py-2 text-sm">Search</button>
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {['ALL','BROADWAY','OFF_BROADWAY'].map(t => (
            <button key={t}
              onClick={()=>{ setType(t as any); setTimeout(apply, 0) }}
              className={`px-3 py-1.5 rounded-full border text-xs ${type===t?'bg-black text-white':'bg-white'}`}>
              {t.replace('_',' ')}
            </button>
          ))}
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {categories.map(c => {
            const active = selectedCats.has(c)
            return (
              <button key={c}
                onClick={()=>{ toggleCat(c); apply() }}
                className={`px-3 py-1.5 rounded-full border text-xs ${active?'bg-black text-white':'bg-white'}`}>
                {c}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
