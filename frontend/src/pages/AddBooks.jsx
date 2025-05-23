import React, { useState } from 'react';
import axios from 'axios';

const AddBooks = () => {
  const [Data, setData] = useState({
    imageUrl: "",
    title: "",
    author: "",
    price: "",
    desc: "",
    language: "",
    standard: "",
  });

  const [errors, setErrors] = useState({});

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const change = (e) => {
    const { name, value } = e.target;
    setData({ ...Data, [name]: value });
    setErrors({ ...errors, [name]: "" }); // Clear error on input
  };

  const validate = () => {
    const newErrors = {};
    Object.entries(Data).forEach(([key, value]) => {
      if (!value.trim()) {
        newErrors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;

    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/add-book",
        Data,
        { headers }
      );
      alert(response.data.message);
      setData({
        imageUrl: "",
        title: "",
        author: "",
        price: "",
        desc: "",
        language: "",
        standard: "",
      });
      setErrors({});
    } catch (error) {
      alert(error?.response?.data?.message || "Error adding book");
    }
  };

  return (
    <div className='w-full p-0 md:p-4'>
      <h1 className='text-3xl md:text-5xl font-semibold text-zinc-500 mb-8'>Add Book</h1>
      <div className='p-4 bg-zinc-800 rounded space-y-4'>

        {/* Image */}
        <div>
          <label className='text-zinc-400'>Image</label>
          <input
            type="text"
            name="imageUrl"
            value={Data.imageUrl}
            onChange={change}
            className='w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none'
            placeholder='URL of image'
          />
          {errors.imageUrl && <p className="text-red-400 text-sm mt-1">{errors.imageUrl}</p>}
        </div>

        {/* Title */}
        <div>
          <label className='text-zinc-400'>Title of book</label>
          <input
            type="text"
            name="title"
            value={Data.title}
            onChange={change}
            className='w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none'
            placeholder='Title of book'
          />
          {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
        </div>

        {/* Author */}
        <div>
          <label className='text-zinc-400'>Author of book</label>
          <input
            type="text"
            name="author"
            value={Data.author}
            onChange={change}
            className='w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none'
            placeholder='Author of book'
          />
          {errors.author && <p className="text-red-400 text-sm mt-1">{errors.author}</p>}
        </div>

        {/* Language and Price */}
        <div className='flex flex-col md:flex-row gap-4'>
          <div className='w-full md:w-1/2'>
            <label className='text-zinc-400'>Language</label>
            <input
              type="text"
              name="language"
              value={Data.language}
              onChange={change}
              className='w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none'
              placeholder='Language of book'
            />
            {errors.language && <p className="text-red-400 text-sm mt-1">{errors.language}</p>}
          </div>
          <div className='w-full md:w-1/2'>
            <label className='text-zinc-400'>Price</label>
            <input
              type="number"
              name="price"
              value={Data.price}
              onChange={change}
              className='w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none'
              placeholder='Price of book'
            />
            {errors.price && <p className="text-red-400 text-sm mt-1">{errors.price}</p>}
          </div>
        </div>

        {/* Standard */}
        <div>
          <label className='text-zinc-400'>Standard</label>
          <select
            name="standard"
            value={Data.standard}
            onChange={change}
            className='w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none'
          >
            <option value="">Select standard</option>
            <option value="1st">1st</option>
            <option value="2nd">2nd</option>
            <option value="3rd">3rd</option>
            <option value="4th">4th</option>
            <option value="5th">5th</option>
            <option value="6th">6th</option>
            <option value="7th">7th</option>
            <option value="8th">8th</option>
            
          </select>
          {errors.standard && <p className="text-red-400 text-sm mt-1">{errors.standard}</p>}
        </div>

        {/* Description */}
        <div>
          <label className='text-zinc-400'>Description</label>
          <textarea
            name="desc"
            value={Data.desc}
            onChange={change}
            className='w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none'
            placeholder='Description of book'
          />
          {errors.desc && <p className="text-red-400 text-sm mt-1">{errors.desc}</p>}
        </div>

        {/* Submit Button */}
        <button
          onClick={submit}
          className='w-full md:w-auto mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition-all duration-300'
        >
          Add Book
        </button>
      </div>
    </div>
  );
};

export default AddBooks;
