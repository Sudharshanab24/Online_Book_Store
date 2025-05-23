import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../components/Loader/Loader";
import BookCard from "../components/BookCard/BookCard";

const AllBooks = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);  
  const [error, setError] = useState(null);
  const [standard, setStandard] = useState("");

  const fetchBooks = async (selectedStandard = "") => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/api/v1/get-all-books", {
        params: { standard: selectedStandard }
      });

      if (response.data && Array.isArray(response.data.data)) {
        setData(response.data.data);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
      setError("Failed to fetch books.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks(standard);
  }, [standard]);

  return (
    <div className="bg-zinc-900 px-4 h-auto py-8">
      <h4 className="text-3xl text-yellow-100 mb-4">All Books</h4>
      
      <div className="mb-4">
        <label className="text-white mr-2">Filter by Standard:</label>
        <select
          className="p-2 rounded bg-zinc-700 text-white"
          value={standard}
          onChange={(e) => setStandard(e.target.value)}
        >
          <option value="">All</option>
          <option value="Pre-KG">Pre-KG</option>
            <option value="LKG">LKG</option>
            <option value="UKG">UKG</option>
          <option value="1st">1st</option>
          <option value="2nd">2nd</option>
          <option value="3rd">3rd</option>
          <option value="4th">4th</option>
          <option value="5th">5th</option>
          <option value="6th">6th</option>
          <option value="7th">7th</option>
          <option value="8th">8th</option>
         
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center my-8"><Loader /></div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="my-4 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-8">
          {data.length > 0 ? (
            data.map((item) => <BookCard key={item._id} data={item} />)
          ) : (
            <p className="text-red-500">No books found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AllBooks;
