import localData from '@/config/data.json'

export interface NavCategory {
  id: number
  name: string
}

export interface NavItem {
  id: number
  name: string
  url: string
  description: string
  categoryId: number
  createTime?: string
}

export interface NavSection extends NavCategory {
  anchorId: string
  content: NavItem[]
}

const categories = localData.categories as NavCategory[]
const items = localData.items as NavItem[]

const itemsByCategory = items.reduce<Record<number, NavItem[]>>((result, item) => {
  if (!result[item.categoryId]) {
    result[item.categoryId] = []
  }

  result[item.categoryId].push(item)
  return result
}, {})

export const navSections: NavSection[] = categories.map(category => ({
  ...category,
  anchorId: `site-anchor-${category.id}`,
  content: itemsByCategory[category.id] ?? []
}))

export const allNavItems: NavItem[] = items
