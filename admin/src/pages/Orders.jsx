
import { useEffect } from 'react';
import { useState } from 'react'
import axios from "axios"
import { backendUrl } from '../App'
import { currency } from '../App'
import { assets } from '../assets/assets';
import { toast } from 'react-toastify'
import Loader from '../other/Loader';

function Orders({ token }) {
  const [orders, setOrders] = useState([]);
const[loading, setLoading] = useState(false); 

  const fetchAllOrderes = async () => {
    if (!token) {
      return null;
    }
    try {
      setLoading(true)
      const response = await axios.post(backendUrl + "/api/order/list", {}, { headers: { token } });
      if (response.data.success) {
        setOrders(response.data.orders.reverse())
      }
      else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message)

    }
    finally{
      setLoading(false)
    }
  }

  const statusHandler = async (e, orderId) => {
    const updatedStatus = e.target.value
    try {
      const response = await axios.post(backendUrl + "/api/order/status", { orderId, status: updatedStatus }, { headers: { token } });
      if (response.data.success) {
        await fetchAllOrderes()
        toast.success(`Status Changed to ${updatedStatus}`)
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchAllOrderes()
  }, [])
  return (
    <div>
      <h3>Order Page</h3>
     {
      !loading ?  <div>
        {
          orders.map((order, index) => (
            <div className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8  my-3 md:my-4 text-xs sm:text-sm text-gray-700' key={index}>
              <img className='w-12' src={assets.parcel_icon} alt="" />
              <div>
                <div>
                  {order.items.map((item, index) => {
                    if (index === order.items.length - 1) {
                      return <p className='py-0.5' key={index}>{item.name} X {item.quantity} <span>{item.size}</span></p>

                    }
                    {
                      return <p className='py-0.5' key={index}>{item.name} X {item.quantity} <span>{item.size}</span>,</p>
                    }
                  })}
                </div>
                <p className='mt-3 mb-2 font-medium'>{order.address.firstName + " " + order.address.lastName}</p>
                <div>
                  <p>{order.address.street + " " + ","}</p>

                  <p>{order.address.city + ", " + order.address.state + ", " + order.address.country + ", " + order.address.zipcode}</p>
                </div>
                <p>{order.address.phone}</p>
              </div>
              <div>
                <p className='text-sm sm:text-[15px]'>Items: {order.items.length}</p>
                <p className='mt-3'>Method:{order.paymentMethod}</p>
                <p>Payment :{order.payment ? "Done" : "Pending"}</p>
                <p>Date:{new Date(order.date).toLocaleDateString()}</p>
              </div>
              <p className='text-sm sm:text-[15px]'>{currency}{order.amount}</p>
              <select onChange={(e) => statusHandler(e, order._id)} value={order.status} className='p-2 font-semibold' >
                <option value="Order Placed">Order Placed</option>
                <option value="Packing">Packing</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for delivery">Out For Delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
            
          ))
        }
        
      </div> : <Loader/>
     }

    </div>
  )
}

export default Orders