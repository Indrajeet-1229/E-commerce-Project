import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import axios from 'axios'
import Loader from '../other/Loader'

const Orders = () => {
  const { backendURL, token, currency, productsLoading, setProductsLoading } = useContext(ShopContext)

  const [orderData, setOrderData] = useState([])
 

  const orderStages = [
    "Order Placed",
    "Packing",
    "Shipped",
    "Out for delivery",
    "Delivered"
  ]

  const loadOrderData = async () => {
    try {
      if (!token) return

      setProductsLoading(true)

      const response = await axios.post(
        backendURL + "/api/order/userorders",
        {},
        { headers: { token } }
      )

      if (response.data.success) {
        let allOrdersItem = []

        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            allOrdersItem.push({
              ...item,
              status: order.status,
              payment: order.payment,
              paymentMethod: order.paymentMethod,
              date: order.date
            })
          })
        })

        setOrderData(allOrdersItem.reverse())
      }

    } catch (error) {
      console.log(error.message)
    } finally {
      setProductsLoading(false)
    }
  }

  useEffect(() => {
    loadOrderData()
  }, [token])

  return (
    <div className='border-t pt-16'>

      <div className="text-2xl">
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>
{
  !productsLoading ? 
      <div>
        {orderData.map((item, index) => {

          const currentIndex = orderStages.indexOf(item.status)

          return (
            <div
              key={index}
              className="py-6 border-b text-gray-700 flex flex-col gap-6"
            >

              {/* Product Info */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

                <div className="flex items-start gap-6 text-sm">
                  <img
                    className='w-16 sm:w-20'
                    src={item.image[0]}
                    alt=""
                  />

                  <div>
                    <p className='sm:text-base font-medium'>{item.name}</p>

                    <div className="flex items-center gap-3 mt-2 text-base">
                      <p>{currency}{item.price}</p>
                      <p>Qty: {item.quantity}</p>
                      <p>Size: {item.size}</p>
                    </div>

                    <p className='mt-1'>
                      Date:
                      <span className='text-gray-400 ml-1'>
                        {new Date(item.date).toDateString()}
                      </span>
                    </p>

                    <p className='mt-1'>
                      Payment:
                      <span className='text-gray-400 ml-1'>
                        {item.paymentMethod}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Track Button */}
                <button
                  onClick={loadOrderData}
               
                  className="border border-gray-300 hover:bg-gray-100 transition px-4 py-2 text-sm font-medium rounded disabled:opacity-50"
                >
                 Track Order
                </button>

              </div>

              {/* Tracking Progress */}
              <div className="w-full mt-2">
                <div className="relative flex items-center justify-between">

                  {orderStages.map((stage, i) => {
                    const isCompleted = i <= currentIndex

                    return (
                      <div
                        key={i}
                        className="flex-1 flex flex-col items-center relative text-center"
                      >

                        {/* Line */}
                        {i !== 0 && (
                          <div
                            className={`absolute top-3 -left-1/2 w-full h-[2px] 
                            ${i <= currentIndex ? "bg-green-500" : "bg-gray-300"}`}
                          />
                        )}

                        {/* Circle */}
                        <div
                          className={`z-10 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold 
                          ${isCompleted ? "bg-green-500 text-white" : "bg-gray-300 text-gray-600"}`}
                        >
                          {isCompleted ? "✓" : i + 1}
                        </div>

                        {/* Label */}
                        <p
                          className={`mt-2 text-[11px] sm:text-xs 
                          ${isCompleted ? "text-green-600 font-semibold" : "text-gray-400"}`}
                        >
                          {stage}
                        </p>

                      </div>
                    )
                  })}

                </div>
              </div>

            </div>
          )
        })}
      </div> : <Loader/>
}

    </div>
  )
}

export default Orders
