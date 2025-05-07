import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const BookCard = ({ data, favourite }) => {
  const navigate = useNavigate();

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const handleRemoveBook = async () => {
    const confirmDelete = window.confirm("Are you sure you want to remove this book from favourites?");
    if (!confirmDelete) return;

    try {
      const response = await axios.delete("http://localhost:3000/api/v1/delete-book-from-fav", {
        headers,
        data: { bookid: data._id }
      });
      alert(response.data.message);
    } catch (error) {
      console.error("Error removing book:", error);
      alert("Failed to remove book from favourites.");
    }
  };

  const handleShowMore = () => {
    navigate(`/view-book-details/${data._id}`);
  };

  return (
    <div className="bg-zinc-800 rounded p-4 flex flex-col w-64 shadow-lg">
      <Link to={`/view-book-details/${data._id}`} className="flex flex-col flex-grow space-y-2">
        <div className="bg-zinc-900 rounded flex items-center justify-center h-40">
          <img
            src={`http://localhost:3000/images/${data.imageUrl}`}
            alt={data.title}
            className="h-full object-contain"
            onError={(e) => { e.target.src = "/default-placeholder.jpg"; }}
          />
        </div>
        <h2 className="text-md text-zinc-200 font-semibold line-clamp-2">{data.title}</h2>
        <p className="text-zinc-400 font-semibold text-sm">By {data.author}</p>
        <p className="text-zinc-200 font-semibold text-md">₹{data.price}</p>
      </Link>

      <div className="mt-3 flex justify-center">
        {favourite ? (
          <button
            className="bg-red-600 hover:bg-red-700 text-white font-medium text-sm px-4 py-2 rounded transition duration-300"
            onClick={handleRemoveBook}
          >
            <span className="text-white">Remove</span>
          </button>
        ) : (
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-4 py-2 rounded transition duration-300"
            onClick={handleShowMore}
          >
            <span className="text-white">Show More</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default BookCard;
