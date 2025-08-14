import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

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

export async function GET(req: Request) {
  const url = new URL(req.url)
  const q = url.searchParams.get('q') || undefined
  const type = url.searchParams.get('type') || undefined
  const cats = url.searchParams.get('categories')?.split(',').filter(Boolean)

  const shows = await prisma.show.findMany({
    where: buildWhere({ q, type, categories: cats }),
    include: {
      categories: { include: { category: true } },
      venues: { include: { venue: true } }
    },
    orderBy: { title: 'asc' }
  })
  return NextResponse.json(shows)
}
