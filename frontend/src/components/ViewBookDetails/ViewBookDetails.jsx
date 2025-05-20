import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { GrLanguage } from "react-icons/gr";
import { FaHeart, FaShoppingCart, FaEdit } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";
import { useSelector } from "react-redux";

const Loader = () => <div className="text-white text-xl">Loading...</div>;

const ViewBookDetails = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate=useNavigate();

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const role = useSelector((state) => state.auth.role);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/get-book-by-id/${id}`);
        if (response.data?.data) {
          setData(response.data.data);
        } else {
          setData(null);
        }
      } catch (err) {
        console.error("Error fetching book:", err);
        setError("Failed to fetch book.");
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
   
  };

  const handleFavourite = async () => {
    try {
      const response = await axios.put("http://localhost:3000/api/v1/add-book-to-fav", { bookid: id }, { headers });
      alert(response.data.message);
    } catch (error) {
      console.error("Error adding to favourites:", error);
      alert("Failed to add book to favourites.");
    }
  };

  const handleCart = async () => {
    try {
      const response = await axios.put("http://localhost:3000/api/v1/add-to-cart", { bookid: id }, { headers });
      alert(response.data.message);
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add book to cart.");
    }
  };

  const deleteBook = async () => {
    try {
      const response = await axios.delete("http://localhost:3000/api/v1/delete-book", {
        headers,
        data: { bookid: id },
      });
      alert(response.data.message);
      navigate("/all-books");

    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete the book.");
    }
  };

  if (loading) return <Loader />;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!data) return <p className="text-gray-400">Book not found.</p>;

  return (
    <>
      <div className="px-4 md:px-12 py-8 bg-zinc-900 flex gap-8 flex-col md:flex-row items-start">
        <div className="bg-zinc-800 rounded p-4 h-[60vh] lg:h-[88vh] w-full lg:w-3/6 relative flex justify-center items-center">
          <img
            src={data.imageUrl ? `http://localhost:3000/images/${data.imageUrl}` : "/default-placeholder.jpg"}
            alt={data.title || "Book Image"}
            className="h-[50vh] lg:h-[70vh] object-contain rounded"
            onError={(e) => { e.target.src = "/default-placeholder.jpg"; }}
          />
          {isLoggedIn && role === "user" && (
            <div className="absolute top-4 right-4 flex flex-col gap-4">
              <button className="bg-white rounded-full text-3xl p-3 hover:text-red-500" onClick={handleFavourite}>
                <FaHeart /> <span className="ms-4 block lg:hidden">Favourites</span>
              </button>
              <button className="bg-white rounded-full text-3xl p-3 hover:text-blue-500" onClick={handleCart}>
                <FaShoppingCart /> <span className="ms-4 block lg:hidden">Add to Cart</span>
              </button>
            </div>
          )}
          {isLoggedIn && role === "admin" && (
            <div className="absolute top-4 right-4 flex flex-col gap-4">
              <Link 
              to={`/updateBook/${id}`}
              className="bg-white rounded-full text-3xl p-3 hover:text-green-500">
                <FaEdit /> <span className="ms-4 block lg:hidden">Edit</span>
              </Link>
              <button className="bg-white rounded-full text-3xl p-3 text-red-500 hover:text-red-700" 
              onClick={deleteBook}>
                <MdOutlineDelete /> <span className="ms-4 block lg:hidden">Delete Book</span>
              </button>
            </div>
          )}
        </div>

        <div className="p-4 w-full lg:w-3/6 flex flex-col justify-between">
          <h1 className="text-4xl text-zinc-300 font-semibold">{data.title}</h1>
          <p className="text-zinc-400 mt-1 text-3xl">by {data.author}</p>
          <p className="text-xl mt-4 text-zinc-500 font-semibold">{data.desc}</p>
          <p className="mt-4 flex items-center text-xl text-zinc-400">
            <GrLanguage className="me-3" /> {data.language}
          </p>
          <p className="mt-4 text-zinc-100 text-3xl font-semibold">Price: ₹ {data.price}</p>
        </div>
      </div>
    </>
  );
};

export default ViewBookDetails;
