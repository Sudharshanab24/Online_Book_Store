import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AiFillDelete } from 'react-icons/ai';
import Loader from "../components/Loader/Loader";
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const navigate=useNavigate();
  const [Cart, setCart] = useState(null);
  const [Total, setTotal] = useState(0);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const fetchCart = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/v1/get-user-cart", { headers });
      const dataWithQuantities = res.data.data.map(item => ({
        ...item,
        price: parseFloat(item.price),
        quantity: parseInt(item.quantity || 1),
      }));
      setCart(dataWithQuantities);
      calculateTotal(dataWithQuantities);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };
  

  useEffect(() => {
    fetchCart();
  }, []);

  const calculateTotal = (items) => {
    const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(total);
  };

  const deleteItem = async (bookid) => {
    if (window.confirm("Are you sure you want to remove this book from your cart?")) {
      try {
        await axios.put(`http://localhost:3000/api/v1/remove-from-cart/${bookid}`, {}, { headers });
        const updated = Cart.filter(item => item._id !== bookid);
        setCart(updated);
        calculateTotal(updated);
      } catch (error) {
        console.error("Error removing item:", error);
        alert("Failed to remove item.");
      }
    }
  };

  const changeQuantity = (bookid, action) => {
    const updatedCart = Cart.map(item => {
      if (item._id === bookid) {
        let newQty = action === 'inc' ? item.quantity + 1 : item.quantity - 1;
        if (newQty < 1) newQty = 1;
        return { ...item, quantity: newQty };
      }
      return item;
    });
    setCart(updatedCart);
    calculateTotal(updatedCart);
  };

  const placeOrder = async() => {
  try{
    const response=await axios.post(`http://localhost:3000/api/v1/place-order`,
      {order:Cart},
      {headers}
    );
    alert(response.data.message);
    navigate("/profile/orderHistory");
  }  catch(error){
     console.log(error);
  }
  };

  return (
    <div className='bg-zinc-900 px-6 md:px-12 py-8 min-h-screen pt-20'>
      {!Cart && <div className='w-full h-[100%] flex items-center justify-center'><Loader />{" "}</div>}

      {Cart && Cart.length === 0 && (
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <h1 className="text-5xl font-semibold text-zinc-400">Empty Cart</h1>
          <img src="/empty-cart.png" alt="empty cart" className='lg:h-[50vh] mt-4' />
        </div>
      )}

      {Cart && Cart.length > 0 && (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className='flex-1'>
            <h1 className='text-4xl font-semibold text-zinc-100 mb-6'>Shopping Cart</h1>
            {Cart.map((item, i) => (
              <div
                className='w-full mb-4 rounded flex flex-col md:flex-row p-4 bg-zinc-800 justify-between items-center'
                key={i}
              >
                <img
                  src={`http://localhost:3000/images/${item.imageUrl}`}
                  alt={item.title}
                  className='h-[20vh] md:h-[10vh] object-cover rounded'
                />
                <div className="flex-1 md:ml-6 w-full">
                  <h1 className='text-2xl text-zinc-100 font-semibold'>
                    {item.title}
                  </h1>
                  <p className='text-zinc-300 mt-2 text-sm'>
                    {item.desc.slice(0, 100)}...
                  </p>

                  {/* Quantity Controls */}
                  <div className="mt-4 flex items-center gap-4">
                    <button
                      onClick={() => changeQuantity(item._id, 'dec')}
                      className='bg-zinc-600 text-white px-3 rounded'
                    >−</button>
                    <span className='text-white text-lg'>{item.quantity}</span>
                    <button
                      onClick={() => changeQuantity(item._id, 'inc')}
                      className='bg-zinc-600 text-white px-3 rounded'
                    >+</button>
                  </div>
                </div>

                <div className="flex flex-col md:items-end mt-4 md:mt-0">
                  <h2 className='text-zinc-200 text-xl font-semibold'>
                    $ {item.price * item.quantity}
                  </h2>
                  <button
                    className='bg-red-100 text-red-700 border border-red-700 rounded p-2 mt-2'
                    onClick={() => deleteItem(item._id)}
                  >
                    <AiFillDelete />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className='w-full lg:w-[30%] bg-zinc-800 rounded p-6 h-fit sticky top-6'>
            <h2 className='text-2xl font-semibold text-zinc-100 mb-4'>Order Summary</h2>
            <p className='text-zinc-300 text-lg mb-2'>
              Items: {Cart.reduce((acc, item) => acc + item.quantity, 0)}
            </p>
            <p className='text-zinc-300 text-lg mb-4'>
              Subtotal: <span className='font-bold text-zinc-100'>$ {Total.toFixed(2)}</span>
            </p>
            <button
              onClick={placeOrder}
              className='w-full bg-yellow-400 hover:bg-yellow-300 text-black font-semibold py-2 px-4 rounded'
            >
              Place Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
