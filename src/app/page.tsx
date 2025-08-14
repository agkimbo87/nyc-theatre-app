import { prisma } from '@/lib/db'
import FilterBar from '@/components/FilterBar'
import ShowCard from '@/components/ShowCard'
import Link from 'next/link'

function buildWhere(params: { q?: string, type?: string, categories?: string[] }) {
  const where: any = { }
  if (params.q) {
    where.OR = [
      { title: { contains: params.q, mode: 'insensitive' } },
      { summary: { contains: params.q, mode: 'insensitive' } }
    ]
  }
  if (params.type && params.type !== 'ALL') {
    where.type = params.type
  }
  if (params.categories && params.categories.length) {
    where.categories = {
      some: { category: { name: { in: params.categories } } }
    }
  }
  return where
}

export default async function Home({ searchParams }: { searchParams: { [k: string]: string | string[] | undefined } }) {
  const q = (searchParams.q as string) || ''
  const type = (searchParams.type as string) || 'ALL'
  const categories = typeof searchParams.categories === 'string' ? (searchParams.categories as string).split(',').filter(Boolean) : []

  const shows = await prisma.show.findMany({
    where: buildWhere({ q, type, categories }),
    include: {
      categories: { include: { category: true } },
      venues: { include: { venue: true } }
    },
    orderBy: { title: 'asc' }
  })

  const count = await prisma.show.count({ where: buildWhere({ q, type, categories }) })

  return (
    <main>
      <FilterBar />
      <div className="container-padded py-3">
        <p className="text-xs text-gray-600 mb-2">{count} shows</p>
        <div className="divide-y">
          {shows.map(s => <ShowCard key={s.id} show={s} />)}
        </div>

        <section id="tips" className="mt-6">
          <h2 className="font-semibold mb-2">Saving tips</h2>
          <ul className="list-disc pl-5 text-sm text-gray-800 space-y-1">
            <li>Official box office links often have the lowest fees.</li>
            <li>Check TKTS for same-day discounts.</li>
            <li>Look for rush/lottery/student/under-30 policies on the official site or TodayTix.</li>
            <li>Weeknight shows and partial-view seats can be cheaper.</li>
          </ul>
          <div className="mt-3">
            <a className="text-sm underline" href="https://www.tdf.org/tkts/" target="_blank">TKTS info</a>
          </div>
        </section>

        <section className="mt-8 text-xs text-gray-500">
          <p>Data is sample content for demo purposes. Verify details with official sources.</p>
        </section>
      </div>
    </main>
  )
}
