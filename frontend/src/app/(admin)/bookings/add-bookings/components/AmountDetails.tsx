import React from 'react'
import { Card, CardBody, CardHeader } from 'react-bootstrap'
const AmountDetails = () => {
  return (
    <>
      <Card>
        <CardHeader as={'h4'} className="text-dark">
          Amount Details
        </CardHeader>
        <CardBody>
          <div className="p-3 overflow-auto" style={{ height: 'calc(100% - 60px)' }}>
            <div className="row g-3">
              {/* total amount */}
              <div className="col-md-3">
                <label className="form-label">Total Amount</label>
                <input type="text" className="form-control" placeholder="" />
              </div>

              {/* additional amount */}
              <div className="col-md-3">
                <label className="form-label">Additional Amount</label>
                <input type="number" className="form-control" disabled />
              </div>
            </div>

            <div className="col-md-3">
              <label className="form-label">Starters + Chat Menu Amount</label>
              <input type="number" className="form-control" disabled />
            </div>

            <div className="col-md-3">
              <label className="form-label">Subtotal Amount</label>

              {/* subtotal amount */}
              <div className="col-md-3">
                <label className="form-label">Subtotal Amount</label>
                <input type="text" className="form-control" placeholder="" disabled />
              </div>

              {/* SGST */}
              <div className="col-md-3">
                <label className="form-label">GST</label>
                <input type="text" className="form-control" placeholder="" />
              </div>

              {/* tax */}
              <div className="col-md-3">
                <label className="form-label">Tax </label>
                <input type="text" className="form-control" placeholder="" />
              </div>
              {/* grand total */}
              <div className="col-md-3">
                <label className="form-label">Grand Total </label>
                <input type="text" className="form-control" placeholder="" disabled />
              </div>
              {/* discount */}
              <div className="col-md-3">
                <label className="form-label">Discount </label>
                <input type="text" className="form-control" placeholder="" />
              </div>

              {/* final amount */}
              <div className="col-md-3">
                <label className="form-label">Final Amount </label>
                <input type="text" className="form-control" placeholder="" disabled />
              </div>

              {/* advance total */}
              <div className="col-md-3">
                <label className="form-label">Advance </label>
                <input type="text" className="form-control" placeholder="" />
              </div>

              {/* pending total */}
              <div className="col-md-3">
                <label className="form-label">Pending Amount </label>
                <input type="text" className="form-control" placeholder="" disabled />
              </div>
            </div>

            {/* Submit */}
            <button type="submit" className="btn btn-primary w-100 mt-4 mb-4">
              Create Booking
            </button>
          </div>
        </CardBody>
      </Card>
    </>
  )
}

export default AmountDetails
