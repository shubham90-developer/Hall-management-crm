import React from 'react'
import Select, { components } from 'react-select'
import { Card, CardBody, CardHeader } from 'react-bootstrap'

const riceOptions = [
  { value: 'masala-bhat', label: 'Masala Bhat' },
  { value: 'jeera-rice', label: 'Jeera Rice' },
]

const dryVegetableDish = [
  { value: 'batata-sukhi', label: 'Batata Sukhi' },
  { value: 'bharli-vangi', label: 'Bharli Vangi' },
  { value: 'batata-dosa-bhaji', label: 'Batata Dosa Bhaji' },
]

const gravyVegetableDish = [
  { value: 'tomato-saar', label: 'Tomato Saar' },
  { value: 'alu-bhaji', label: 'Alu Bhaji' },
  { value: 'tomato-batata-rassa', label: 'Tomato Batata Rassa' },
  { value: 'dal-fry', label: 'Dal Fry' },
]

const usalItem = [
  { value: 'matki-usal', label: 'Matki Usal' },
  { value: 'vatana-usal', label: 'Vatana Usal' },
]

const farsanItem = [
  { value: 'chote-batata-vade', label: 'Chote Batata Vade' },
  { value: 'kanda-bhaji', label: 'Kanda Bhaji' },
]

const saladItem = [
  { value: 'kakdi', label: 'Kakdi' },
  { value: 'khamang-kakdi', label: 'Khamang Kakdi' },
  { value: 'vangi', label: 'Vangi' },
  { value: 'bhopla-bharit', label: 'Bhopla Bharit' },
]

const oneChutney = [
  { value: 'naral', label: 'Naral Chutney' },
  { value: 'pudina', label: 'Pudina Chutney' },
  { value: 'tomato', label: 'Tomato Chutney' },
  { value: 'shengdana', label: 'Shengdana Chutney' },
  { value: 'kairi', label: 'Kairi Chutney' },
  { value: 'mirchi', label: 'Mirchi Chutney' },
]

const onePickle = [
  { value: 'kairi-pickle', label: 'Kairi Pickle' },
  { value: 'limbu-pickle', label: 'Limbu Pickle' },
]

const Option = (props: any) => {
  return (
    <components.Option {...props}>
      <div className="d-flex align-items-center gap-2">
        <input type="checkbox" checked={props.isSelected} readOnly />
        <label>{props.label}</label>
      </div>
    </components.Option>
  )
}

const SpecialMenu = () => {
  return (
    <>
      <Card>
        <CardHeader as={'h4'} className="text-dark">
          Select Special Buffet Menu
        </CardHeader>
        <CardBody>
          <div className="p-3 pt-0 overflow-auto" style={{ height: 'calc(100% - 60px)' }}>
            <div className="row g-3">
              {/* Select One Rice Item */}
              <div className="col-md-3">
                <label className="form-label">🍚 Select Rice Items</label>

                <Select
                  options={riceOptions}
                  isMulti
                  closeMenuOnSelect={false}
                  hideSelectedOptions={false}
                  components={{ Option }}
                  placeholder="Select Rice Items"
                  menuPlacement="top"
                  menuPosition="fixed"
                  classNamePrefix="react-select"
                  styles={{
                    menu: (base) => ({
                      ...base,
                      zIndex: 9999,
                    }),
                  }}
                />
              </div>

              {/* Choose One Dry Veg Item */}
              <div className="col-md-3">
                <label className="form-label">🥔 Choose Dry Veg Item</label>

                <Select
                  options={dryVegetableDish}
                  isMulti
                  closeMenuOnSelect={false}
                  hideSelectedOptions={false}
                  components={{ Option }}
                  placeholder="Choose Dry Veg Item"
                  menuPlacement="top"
                  menuPosition="fixed"
                  classNamePrefix="react-select"
                  styles={{
                    menu: (base) => ({
                      ...base,
                      zIndex: 9999,
                    }),
                  }}
                />
              </div>

              {/* Choose One Gravy Item */}
              <div className="col-md-3">
                <label className="form-label">🍛 Choose Gravy Item</label>

                <Select
                  options={gravyVegetableDish}
                  isMulti
                  closeMenuOnSelect={false}
                  hideSelectedOptions={false}
                  components={{ Option }}
                  placeholder="Choose Gravy Item"
                  menuPlacement="top"
                  menuPosition="fixed"
                  classNamePrefix="react-select"
                  styles={{
                    menu: (base) => ({
                      ...base,
                      zIndex: 9999,
                    }),
                  }}
                />
              </div>

              {/* Choose Usal Item */}
              <div className="col-md-3">
                <label className="form-label">🌱 Choose Usal Item</label>

                <Select
                  options={usalItem}
                  isMulti
                  closeMenuOnSelect={false}
                  hideSelectedOptions={false}
                  components={{ Option }}
                  placeholder="Choose Usal Item"
                  menuPlacement="top"
                  menuPosition="fixed"
                  classNamePrefix="react-select"
                  styles={{
                    menu: (base) => ({
                      ...base,
                      zIndex: 9999,
                    }),
                  }}
                />
              </div>

              {/* Choose Farsan Item */}
              <div className="col-md-3">
                <label className="form-label">🥟 Choose Farsan Item</label>

                <Select
                  options={farsanItem}
                  isMulti
                  closeMenuOnSelect={false}
                  hideSelectedOptions={false}
                  components={{ Option }}
                  placeholder="Choose Farsan Item"
                  menuPlacement="top"
                  menuPosition="fixed"
                  classNamePrefix="react-select"
                  styles={{
                    menu: (base) => ({
                      ...base,
                      zIndex: 9999,
                    }),
                  }}
                />
              </div>

              {/* Choose Salad Item */}
              <div className="col-md-3">
                <label className="form-label">🥗 Choose Salad Item</label>

                <Select
                  options={saladItem}
                  isMulti
                  closeMenuOnSelect={false}
                  hideSelectedOptions={false}
                  components={{ Option }}
                  placeholder="Choose Salad Item"
                  menuPlacement="top"
                  menuPosition="fixed"
                  classNamePrefix="react-select"
                  styles={{
                    menu: (base) => ({
                      ...base,
                      zIndex: 9999,
                    }),
                  }}
                />
              </div>

              {/* Choose Chutney */}
              <div className="col-md-3">
                <label className="form-label">🌶️ Choose Chutney</label>

                <Select
                  options={oneChutney}
                  isMulti
                  closeMenuOnSelect={false}
                  hideSelectedOptions={false}
                  components={{ Option }}
                  placeholder="Choose Chutney"
                  menuPlacement="top"
                  menuPosition="fixed"
                  classNamePrefix="react-select"
                  styles={{
                    menu: (base) => ({
                      ...base,
                      zIndex: 9999,
                    }),
                  }}
                />
              </div>

              {/* Choose Pickle */}
              <div className="col-md-3">
                <label className="form-label">🥒 Choose Pickle</label>

                <Select
                  options={onePickle}
                  isMulti
                  closeMenuOnSelect={false}
                  hideSelectedOptions={false}
                  components={{ Option }}
                  placeholder="Choose Pickle"
                  menuPlacement="top"
                  menuPosition="fixed"
                  classNamePrefix="react-select"
                  styles={{
                    menu: (base) => ({
                      ...base,
                      zIndex: 9999,
                    }),
                  }}
                />
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  )
}

export default SpecialMenu
