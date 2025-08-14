export type Filters = {
  q?: string
  type?: 'BROADWAY'|'OFF_BROADWAY'|'ALL'
  categories?: string[]
  sort?: 'AZ'|'CLOSING_SOON'|'OPENING_NEW'
  page?: number
}
