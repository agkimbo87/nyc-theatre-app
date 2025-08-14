import { prisma } from '@/lib/db'
import Link from 'next/link'

export default async function ShowDetail({ params }: { params: { slug: string } }) {
  const show = await prisma.show.findUnique({
    where: { slug: params.slug },
    include: {
      categories: { include: { category: true } },
      venues: { include: { venue: true } },
      ticketLinks: true,
      tips: true
    }
  })

  if (!show) {
    return <div className="p-4">Show not found.</div>
  }

  const venue = show.venues[0]?.venue

  return (
    <main>
      {show.heroImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={show.heroImage} alt={show.title} className="w-full h-56 object-cover" />
      ) : <div className="w-full h-56 bg-gray-200" />}
      <div className="container-padded py-4 space-y-3">
        <h1 className="text-xl font-bold">{show.title}</h1>
        <div className="flex flex-wrap gap-2">
          {show.categories.map(c => (
            <span key={c.categoryId} className="text-[10px] border rounded px-1.5 py-0.5">{c.category.name}</span>
          ))}
        </div>
        <p className="text-sm text-gray-800">{show.summary}</p>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div><span className="text-gray-500">Type:</span> {show.type.replace('_',' ')}</div>
          {show.runtimeMin ? <div><span className="text-gray-500">Runtime:</span> {show.runtimeMin} min</div> : null}
          {show.ageGuidance ? <div><span className="text-gray-500">Age:</span> {show.ageGuidance}</div> : null}
          {venue ? <div className="col-span-2"><span className="text-gray-500">Venue:</span> {venue.name}{venue.neighborhood?`, ${venue.neighborhood}`:''}</div> : null}
        </div>

        <div className="space-y-2">
          <h2 className="font-semibold">Buy tickets</h2>
          <div className="flex flex-col gap-2">
            {show.ticketLinks.map(l => (
              <a key={l.id} href={l.url} target="_blank" className="rounded-lg border px-3 py-2 text-sm">
                {l.vendor === 'OFFICIAL' ? 'Official box office' : l.vendor}
              </a>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="font-semibold">Saving tips</h2>
          <ul className="list-disc pl-5 text-sm text-gray-800 space-y-1">
            {show.tips.map(t => (
              <li key={t.id}><strong className="capitalize">{t.tipType.replaceAll('_',' ').toLowerCase()}:</strong> {t.description} {t.howTo?`— ${t.howTo}`:''} {t.link?<a href={t.link} className="underline" target="_blank">Learn more</a>:null}</li>
            ))}
          </ul>
        </div>

        <div className="pt-2">
          <Link href="/" className="underline text-sm">← Back to all shows</Link>
        </div>
      </div>
    </main>
  )
}
