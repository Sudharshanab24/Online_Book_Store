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
  });

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const change = (e) => {
    const { name, value } = e.target;
    setData({ ...Data, [name]: value });
  };

  const submit = async () => {
    const { imageUrl, title, author, price, desc, language } = Data;
    if (!imageUrl || !title || !author || !price || !desc || !language) {
      alert("All fields are required");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/add-book", // Use https if backend is secure
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
      });
    } catch (error) {
      alert(error?.response?.data?.message || "Error adding book");
    }
  };

  return (
    <div className='w-full p-0 md:p-4'>
      <h1 className='text-3xl md:text-5xl font-semibold text-zinc-500 mb-8'>Add Book</h1>
      <div className='p-4 bg-zinc-800 rounded space-y-4'>
        <div>
          <label className='text-zinc-400'>Image</label>
          <input
            type="text"
            className='w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none'
            placeholder='URL of image'
            name='imageUrl'
            value={Data.imageUrl}
            onChange={change}
          />
        </div>
        <div>
          <label className='text-zinc-400'>Title of book</label>
          <input
            type="text"
            className='w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none'
            placeholder='Title of book'
            name='title'
            value={Data.title}
            onChange={change}
          />
        </div>
        <div>
          <label className='text-zinc-400'>Author of book</label>
          <input
            type="text"
            className='w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none'
            placeholder='Author of book'
            name='author'
            value={Data.author}
            onChange={change}
          />
        </div>
        <div className='flex flex-col md:flex-row gap-4'>
          <div className='w-full md:w-1/2'>
            <label className='text-zinc-400'>Language</label>
            <input
              type="text"
              className='w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none'
              placeholder='Language of book'
              name='language'
              value={Data.language}
              onChange={change}
            />
          </div>
          <div className='w-full md:w-1/2'>
            <label className='text-zinc-400'>Price</label>
            <input
              type="number"
              className='w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none'
              placeholder='Price of book'
              name='price'
              value={Data.price}
              onChange={change}
            />
          </div>
        </div>
        <div>
          <label className='text-zinc-400'>Description</label>
          <textarea
            className='w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none'
            placeholder='Description of book'
            name='desc'
            value={Data.desc}
            onChange={change}
          />
        </div>
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
