import Link from 'next/link'

export default function ShowCard({ show }: { show: any }) {
  return (
    <Link href={`/show/${show.slug}`} className="block">
      <article className="flex gap-3 p-3 border-b">
        {show.heroImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={show.heroImage} alt={show.title} className="h-20 w-16 object-cover rounded" />
        ) : <div className="h-20 w-16 bg-gray-200 rounded" />}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm">{show.title}</h3>
          <p className="text-xs text-gray-600 line-clamp-2">{show.summary}</p>
          <div className="mt-1 flex flex-wrap gap-1">
            {show.categories?.map((c: any) => (
              <span key={c.category.name} className="text-[10px] border rounded px-1.5 py-0.5">{c.category.name}</span>
            ))}
          </div>
        </div>
      </article>
    </Link>
  )
}
