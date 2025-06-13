'use client'
import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const ArticleForm = () => {
  const [form, setForm] = useState({
    title: '',
    content: '',
    category: '',
    description: '',
    image: '',
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { 
          method: 'POST',
          body: formData,
        }
      );
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handleChange = async (e) => {
    if (e.target.name === 'image') {
      const file = e.target.files[0];
      if (file) {
        setImagePreview(URL.createObjectURL(file));
        setUploadingImage(true);
        try {
          const imageUrl = await uploadImage(file);
          setForm(prev => ({ ...prev, image: imageUrl }));
          toast.success('Image uploaded!');
        } catch (error) {
          toast.error('Failed to upload image');
        } finally {
          setUploadingImage(false);
        }
      }
    } else {
      setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation (optional)
    if (!form.title || !form.content || !form.category || !form.description || !form.image) {
      toast.error('Please fill all required fields including image');
      return;
    }

    setSubmitting(true);
    try {
      await axios.post('http://localhost:5000/api/articles', form);
      toast.success('Article added successfully!');
      setForm({
        title: '',
        content: '',
        category: '',
        description: '',
        image: '',
      });
      setImagePreview(null);
    } catch (error) {
      console.error(error);
      toast.error('Failed to add article');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-8 w-full max-w-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">
          Add a New Article
        </h2>

        {/* Title */}
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-600 mb-2">Title</label>
          <input
            id="title"
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-green-300"
            placeholder="Enter title"
          />
        </div>

        {/* Content */}
        <div className="mb-4">
          <label htmlFor="content" className="block text-gray-600 mb-2">Content</label>
          <textarea
            id="content"
            name="content"
            value={form.content}
            onChange={handleChange}
            required
            rows="5"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-green-300"
            placeholder="Enter content"
          />
        </div>

        {/* Category */}
        <div className="mb-4">
          <label htmlFor="category" className="block text-gray-600 mb-2">Category</label>
          <input
            id="category"
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-green-300"
            placeholder="Enter category"
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label htmlFor="description" className="block text-gray-600 mb-2">Description</label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-green-300"
            placeholder="Enter a short description"
            required
          />
        </div>

        {/* Image Upload */}
        <div className="mb-4">
          <label htmlFor="image" className="block text-gray-600 mb-2">Image</label>
          <input
            id="image"
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-green-300"
          />
          {imagePreview && (
            <div className="mt-2">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={uploadingImage || submitting}
          className={`w-full ${
            uploadingImage || submitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
          } text-white py-2 rounded-lg transition`}
        >
          {uploadingImage ? 'Uploading Image...' : submitting ? 'Submitting...' : 'Submit Article'}
        </button>
      </form>
    </div>
  );
};

export default ArticleForm;
