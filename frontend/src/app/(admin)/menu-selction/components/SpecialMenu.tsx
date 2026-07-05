import React from 'react'
import Select from 'react-select'
import { IMenuList } from '@/store/menuListApi'
import { ISweetMenu } from '@/store/sweetMenuApi'
import { IOtherMenu } from '@/store/otherMenuApi'
import { IBuffetName } from '@/store/buffetNameApi'
import { IExternalItems } from '@/store/externalItemsApi'
import { IStartersMenu } from '@/store/startersMenuApi'
import { IChatMenu } from '@/store/chatMenuApi'
interface Props {
  step: 'buffet' | 'sweets' | 'additional'
  selectedBuffetId: string
  buffetList?: IBuffetName[]
  menuList: IMenuList[]
  sweetMenuList: ISweetMenu[]
  otherMenuList: IOtherMenu[]
  selectedMenu: string[]
  selectedSweets: string[]
  selectedAdditional: string[]
  onMenuChange: (ids: string[]) => void
  onSweetsChange: (ids: string[]) => void
  onAdditionalChange: (ids: string[]) => void
  externalItemsList: IExternalItems[]
  selectedExternalItems: string[]
  onExternalItemsChange: (ids: string[]) => void
  activeCategory?: string
  onCategoryChange?: (category: string) => void
  onCategoriesChange?: (categories: string[]) => void
  startersMenuList?: IStartersMenu[]
  chatMenuList?: IChatMenu[]
  selectedStarters?: string[]
  selectedChatMenu?: string[]
  onStartersChange?: (ids: string[]) => void
  onChatMenuChange?: (ids: string[]) => void
}

const selectStyles = {
  menu: (base: any) => ({ ...base, zIndex: 9999 }),
}

const SpecialMenu = ({
  step,
  selectedBuffetId,
  buffetList = [],
  menuList,
  sweetMenuList,
  otherMenuList,
  selectedMenu,
  selectedSweets,
  selectedAdditional,
  onMenuChange,
  onSweetsChange,
  onAdditionalChange,
  externalItemsList,
  selectedExternalItems,
  onExternalItemsChange,
  activeCategory: activeCategoryProp,
  onCategoryChange,
  onCategoriesChange,
  startersMenuList = [],
  chatMenuList = [],
  selectedStarters = [],
  selectedChatMenu = [],
  onStartersChange,
  onChatMenuChange,
}: Props) => {
  const [internalActiveCategory, setInternalActiveCategory] = React.useState<string>('')
  const activeCategory = activeCategoryProp ?? internalActiveCategory
  const setActiveCategory = onCategoryChange ?? setInternalActiveCategory

  React.useEffect(() => {
    const cats = Object.keys(groupedMenu)
    onCategoriesChange?.(cats)
    if (cats.length > 0 && !cats.includes(activeCategory)) {
      setActiveCategory(cats[0])
    }
  }, [selectedBuffetId, menuList, startersMenuList, chatMenuList])

  const matchesBuffet = (buffetField: any) => {
    const ids = Array.isArray(buffetField)
      ? buffetField.map((b: any) => (typeof b === 'object' ? b._id : b))
      : [typeof buffetField === 'object' ? buffetField?._id : buffetField]
    return ids.includes(selectedBuffetId)
  }

  const isStartersTab = selectedBuffetId === 'starters'
  const isChatMenuTab = selectedBuffetId === 'chatmenu'
  const isCustomizeTab = selectedBuffetId === 'customize'
  const isSpecialTab = isStartersTab || isChatMenuTab

  const filteredMenuList = selectedBuffetId === 'customize' ? menuList : menuList.filter((item) => matchesBuffet(item.buffetName))

  const specialSourceList: any[] = isStartersTab ? startersMenuList : isChatMenuTab ? chatMenuList : []

  // Each item is tagged with `_kind` so the row renderer knows whether to
  // route its selection to selectedMenu (single-pick-per-category) or to
  // selectedStarters/selectedChatMenu (multi-select), regardless of which
  // tab (Starters / Chat Menu / Customize) it's being shown under.
  const groupedMenu = (isSpecialTab ? specialSourceList : filteredMenuList).reduce(
    (acc: Record<string, any[]>, item) => {
      const cat = item.categoryName?.categoryName || 'Other'
      const kind = isStartersTab ? 'starters' : isChatMenuTab ? 'chatmenu' : 'menu'
      if (!acc[cat]) acc[cat] = []
      acc[cat].push({ ...item, _kind: kind })
      return acc
    },
    {} as Record<string, any[]>,
  )

  if (isCustomizeTab) {
    if (startersMenuList.length > 0) {
      groupedMenu['🥗 Starters'] = startersMenuList.map((item) => ({ ...item, _kind: 'starters' }))
    }
    if (chatMenuList.length > 0) {
      groupedMenu['🍜 Chat Menu'] = chatMenuList.map((item) => ({ ...item, _kind: 'chatmenu' }))
    }
  }

  const toOptions = (items: IMenuList[]) => items.map((i) => ({ value: i._id, label: i.itemName }))

  const filteredSweetList = selectedBuffetId === 'customize' ? sweetMenuList : sweetMenuList.filter((item) => matchesBuffet(item.buffetName))

  const filteredOtherList = selectedBuffetId === 'customize' ? otherMenuList : otherMenuList.filter((item) => matchesBuffet(item.buffetName))

  const filteredExternalList =
    selectedBuffetId === 'customize'
      ? externalItemsList
      : externalItemsList.filter((item) => {
          const buffetId = typeof item.buffet === 'object' ? (item.buffet as any)._id : item.buffet
          return buffetId === selectedBuffetId
        })
  const handleMenuChange = (category: string, selected: any) => {
    const categoryItems = groupedMenu[category] || []
    const categoryIds = categoryItems.map((i) => i._id)

    const otherSelected = selectedMenu.map((id) => (typeof id === 'object' ? (id as any)._id : id)).filter((id) => !categoryIds.includes(id))

    const newIds = selected ? [selected.value] : []
    onMenuChange([...otherSelected, ...newIds])
  }
  const getSelectedForCategory = (category: string) => {
    const categoryItems = groupedMenu[category] || []
    const found = categoryItems.find((i) =>
      selectedMenu.some((id) => {
        const idStr = typeof id === 'object' ? (id as any)._id : id
        return idStr === i._id
      }),
    )

    return found ? { value: found._id, label: found.itemName } : null
  }

  // Generic per-item helpers — used so Starters/Chat Menu items behave the
  // same way (multi-select, price column) whether they're shown under their
  // own dedicated tab or as extra categories inside the Customize tab.
  const isItemChecked = (item: any) => {
    const kind = item._kind || 'menu'
    if (kind === 'starters') return selectedStarters.includes(item._id)
    if (kind === 'chatmenu') return selectedChatMenu.includes(item._id)
    return selectedMenu.some((id) => (typeof id === 'object' ? (id as any)._id : id) === item._id)
  }

  const handleItemToggle = (category: string, item: any, checked: boolean) => {
    const kind = item._kind || 'menu'
    if (kind === 'starters') {
      if (!onStartersChange) return
      if (checked) onStartersChange([...new Set([...selectedStarters, item._id])])
      else onStartersChange(selectedStarters.filter((id) => id !== item._id))
      return
    }
    if (kind === 'chatmenu') {
      if (!onChatMenuChange) return
      if (checked) onChatMenuChange([...new Set([...selectedChatMenu, item._id])])
      else onChatMenuChange(selectedChatMenu.filter((id) => id !== item._id))
      return
    }
    handleMenuChange(category, checked ? { value: item._id } : null)
  }

  return (
    <div className="p-0 pt-0 overflow-hidden" style={{ height: 'calc(100% - 60px)' }}>
      <div className="row g-3">
        {step === 'buffet' && (
          <div className="col-12">
            {/* Category Tabs */}
            <div className="d-flex gap-2 flex-wrap mb-3">
              {Object.keys(groupedMenu).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`btn btn-sm ${activeCategory === cat ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => setActiveCategory(cat)}>
                  {cat}
                </button>
              ))}
            </div>

            {/* Items of active tab — same table style as sweet/additional below */}
            {activeCategory && groupedMenu[activeCategory] && (
              <div className="table-responsive">
                <table className="table align-middle mb-0 table-hover table-centered table-bordered">
                  <thead className="bg-light-subtle">
                    <tr>
                      <th style={{ width: 20 }}></th>
                      <th className="text-nowrap">Item Name</th>
                      {groupedMenu[activeCategory].some((i) => i._kind !== 'menu') && <th className="text-nowrap">Price</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {groupedMenu[activeCategory].map((item) => (
                      <tr key={item._id}>
                        <td>
                          <div className="form-check">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              checked={isItemChecked(item)}
                              onChange={(e) => handleItemToggle(activeCategory, item, e.target.checked)}
                            />
                            <label className="form-check-label">&nbsp;</label>
                          </div>
                        </td>
                        <td className="text-nowrap">{item.itemName}</td>
                        {item._kind !== 'menu' && <td className="text-nowrap">₹{item.price}/-</td>}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* 👇 ONLY CHANGE 1: Added this line */}
        <div className="w-100"></div>

        {/* 👇 ONLY CHANGE 2: col-md-6 → col-md-4 */}
        {step === 'sweets' && (
          <div>
            <label className="form-label">🍨 Sweet Items</label>
            <div className="table-responsive">
              <table className="table align-middle mb-0 table-hover table-centered table-bordered">
                <thead className="bg-light-subtle">
                  <tr>
                    <th style={{ width: 20 }}>
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          onChange={(e) => {
                            if (e.target.checked) {
                              onSweetsChange([...new Set(filteredSweetList.map((s) => s._id))])
                            } else {
                              onSweetsChange([])
                            }
                          }}
                          checked={filteredSweetList.length > 0 && selectedSweets.length === filteredSweetList.length}
                        />
                      </div>
                    </th>
                    <th className="text-nowrap">Item Name</th>
                    <th className="text-nowrap">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSweetList.map((item) => (
                    <tr key={item._id}>
                      <td>
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={selectedSweets.includes(item._id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                onSweetsChange([...new Set([...selectedSweets, item._id])])
                              } else {
                                onSweetsChange(selectedSweets.filter((id) => id !== item._id))
                              }
                            }}
                          />
                          <label className="form-check-label">&nbsp;</label>
                        </div>
                      </td>
                      <td className="text-nowrap">{item.itemName}</td>
                      <td className="text-nowrap">₹{item.price}/-</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 👇 ONLY CHANGE 3: col-md-6 → col-md-4 */}
        {step === 'additional' && (
          <div>
            <label className="form-label">🍽️ Additional Items</label>
            <div className="table-responsive">
              <table className="table align-middle mb-0 table-hover table-centered table-bordered">
                <thead className="bg-light-subtle">
                  <tr>
                    <th style={{ width: 20 }}>
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          onChange={(e) => {
                            if (e.target.checked) {
                              onAdditionalChange(filteredOtherList.map((s) => s._id))
                            } else {
                              onAdditionalChange([])
                            }
                          }}
                          checked={filteredOtherList.length > 0 && selectedAdditional.length === filteredOtherList.length}
                        />
                      </div>
                    </th>
                    <th className="text-nowrap">Item Name</th>
                    <th className="text-nowrap">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOtherList.map((item) => (
                    <tr key={item._id}>
                      <td>
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={selectedAdditional.includes(item._id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                onAdditionalChange([...new Set([...selectedAdditional, item._id])])
                              } else {
                                onAdditionalChange(selectedAdditional.filter((id) => id !== item._id))
                              }
                            }}
                          />
                          <label className="form-check-label">&nbsp;</label>
                        </div>
                      </td>
                      <td className="text-nowrap">{item.itemName}</td>
                      <td className="text-nowrap">₹{item.price}/-</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 👇 ONLY CHANGE 4: col-md-6 → col-md-4
        <div className="col-md-4 mt-3">
          <label className="form-label">📦 External Items</label>
          <div className="table-responsive">
            <table className="table align-middle mb-0 table-hover table-centered table-bordered">
              <thead className="bg-light-subtle">
                <tr>
                  <th style={{ width: 20 }}>
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        onChange={(e) => {
                          if (e.target.checked) {
                            onExternalItemsChange([...new Set(filteredExternalList.map((s) => s._id))])
                          } else {
                            onExternalItemsChange([])
                          }
                        }}
                        checked={filteredExternalList.length > 0 && selectedExternalItems.length === filteredExternalList.length}
                      />
                    </div>
                  </th>
                  <th className="text-nowrap">Item Name</th>
                  <th className="text-nowrap">Buffet Category</th>
                </tr>
              </thead>
              <tbody>
                {filteredExternalList.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center text-muted py-3">
                      No external items found
                    </td>
                  </tr>
                ) : (
                  filteredExternalList.map((item) => (
                    <tr key={item._id}>
                      <td>
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={selectedExternalItems.includes(item._id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                onExternalItemsChange([...new Set([...selectedExternalItems, item._id])])
                              } else {
                                onExternalItemsChange(selectedExternalItems.filter((id) => id !== item._id))
                              }
                            }}
                          />
                          <label className="form-check-label">&nbsp;</label>
                        </div>
                      </td>
                      <td className="text-nowrap">{item.itemName}</td>
                      <td className="text-nowrap">{typeof item.buffet === 'object' ? (item.buffet as any).buffetName : '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div> */}
      </div>
    </div>
  )
}

export default SpecialMenu
