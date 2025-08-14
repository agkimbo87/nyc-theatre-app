// prisma/seed.cjs
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // Categories
  const categories = ['Musical', 'Play', 'Comedy', 'Drama', 'Family']
  const catRecords = {}
  for (const name of categories) {
    const rec = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name }
    })
    catRecords[name] = rec
  }

  // Venues
  const broadwayTheatre = await prisma.venue.create({
    data: {
      name: 'Broadway Theatre',
      address: '1681 Broadway, New York, NY',
      neighborhood: 'Midtown',
      capacity: 1761,
      website: 'https://www.broadwaytheatre.com'
    }
  })

  const publicTheater = await prisma.venue.create({
    data: {
      name: 'The Public Theater',
      address: '425 Lafayette St, New York, NY',
      neighborhood: 'NoHo',
      capacity: 299,
      website: 'https://publictheater.org'
    }
  })

  const shows = [
    {
      title: 'Wicked',
      slug: 'wicked',
      type: 'BROADWAY',
      summary:
        'A reimagining of Oz following Elphaba and Glinda before Dorothy arrives—friendship, politics, and soaring pop theatre.',
      openingDate: new Date('2003-10-30'),
      runtimeMin: 165,
      ageGuidance: '8+',
      status: 'OPEN',
      heroImage: 'https://images.unsplash.com/photo-1545235617-9465d2a55602',
      officialSite: 'https://wickedthemusical.com',
      categories: ['Musical', 'Drama']
    },
    {
      title: 'Hamilton',
      slug: 'hamilton',
      type: 'BROADWAY',
      summary:
        'Lin-Manuel Miranda’s hip-hop biography of Alexander Hamilton mixing rap, R&B, and showtunes.',
      openingDate: new Date('2015-08-06'),
      runtimeMin: 160,
      ageGuidance: '10+',
      status: 'OPEN',
      heroImage: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee',
      officialSite: 'https://hamiltonmusical.com',
      categories: ['Musical', 'Drama']
    },
    {
      title: 'Little Shop of Horrors',
      slug: 'little-shop-of-horrors',
      type: 'OFF_BROADWAY',
      summary:
        'Cult-favorite musical comedy about a meek florist, a crush, and a man-eating plant named Audrey II.',
      openingDate: new Date('2019-10-17'),
      runtimeMin: 145,
      ageGuidance: '14+',
      status: 'OPEN',
      heroImage: 'https://images.unsplash.com/photo-1516815231560-8f41ec531527',
      officialSite: 'https://littleshopnyc.com',
      categories: ['Musical', 'Comedy']
    },
    {
      title: 'Prayer for the French Republic',
      slug: 'prayer-for-the-french-republic',
      type: 'OFF_BROADWAY',
      summary:
        'A multigenerational family drama wrestling with identity, safety, and belonging in contemporary Paris.',
      openingDate: new Date('2022-01-09'),
      runtimeMin: 180,
      ageGuidance: '14+',
      status: 'OPEN',
      heroImage: 'https://images.unsplash.com/photo-1502136969935-8d07105f0f3b',
      officialSite: 'https://manhattantheatreclub.com',
      categories: ['Play', 'Drama']
    }
  ]

  for (const s of shows) {
    const show = await prisma.show.create({
      data: {
        title: s.title,
        slug: s.slug,
        type: s.type,
        summary: s.summary,
        openingDate: s.openingDate,
        runtimeMin: s.runtimeMin,
        ageGuidance: s.ageGuidance,
        status: s.status,
        heroImage: s.heroImage,
        officialSite: s.officialSite
      }
    })

    await prisma.showVenue.create({
      data: {
        showId: show.id,
        venueId: s.type === 'BROADWAY' ? broadwayTheatre.id : publicTheater.id
      }
    })

    for (const c of s.categories) {
      await prisma.showCategory.create({
        data: {
          showId: show.id,
          categoryId: catRecords[c].id
        }
      })
    }

    await prisma.ticketLink.createMany({
      data: [
        { showId: show.id, vendor: 'OFFICIAL', url: s.officialSite },
        { showId: show.id, vendor: 'TODAYTIX', url: `https://www.todaytix.com/nyc/shows/${s.slug}` }
      ]
    })

    await prisma.savingTip.createMany({
      data: [
        {
          showId: show.id,
          tipType: 'OFFICIAL_BOX_OFFICE',
          description: 'Check the official box office first to avoid extra fees.',
          howTo: 'Use the official site link above.'
        },
        {
          showId: show.id,
          tipType: 'TKTS',
          description: 'Same-day discounts may be available.',
          howTo: 'Visit TKTS booths; look for this title on the board.',
          link: 'https://www.tdf.org/tkts/'
        }
      ]
    })

    await prisma.source.create({
      data: {
        showId: show.id,
        sourceName: 'Official site',
        url: s.officialSite,
        lastCheckedAt: new Date()
      }
    })
  }

  await prisma.savingTip.createMany({
    data: [
      {
        tipType: 'RUSH',
        description: 'Some shows offer in-person or digital rush tickets.',
        howTo: 'Search “Show Name rush tickets” on the official site or TodayTix.'
      },
      {
        tipType: 'LOTTERY',
        description: 'Digital lotteries can offer deeply discounted seats.',
        howTo: 'Check official show site or TodayTix “Lottery” section.'
      },
      { tipType: 'TDF', description: 'If eligible for TDF, you can access member discounts.', link: 'https://www.tdf.org' }
    ]
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
    console.log('Seed complete')
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
