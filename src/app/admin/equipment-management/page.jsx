import { useState, useEffect } from 'react';
import axios from 'axios';

export default function EquipmentDashboard() {
  const [equipmentList, setEquipmentList] = useState([]);
  const [formData, setFormData] = useState({
    name: '', title: '', content: '', category: '', image: '', price: '', url: ''
  });

  const fetchEquipment = async () => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/equipment/getall`);
    setEquipmentList(res.data);
  };

  useEffect(() => {
    fetchEquipment();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/equipment`, formData);
      setFormData({ name: '', title: '', content: '', category: '', image: '', price: '', url: '' });
      fetchEquipment();
    } catch (err) {
      console.error('Error adding equipment:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/equipment/${id}`);
      fetchEquipment();
    } catch (err) {
      console.error('Error deleting equipment:', err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Equipment Management</h1>
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        {Object.keys(formData).map((field) => (
          <input
            key={field}
            placeholder={field}
            value={formData[field]}
            onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
            className="block border p-2 w-full"
          />
        ))}
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">Add Equipment</button>
      </form>
      <ul>
        {equipmentList.map(item => (
          <li key={item._id} className="mb-4 border p-4 rounded">
            <h2 className="text-lg font-bold">{item.name}</h2>
            <p>{item.title}</p>
            <p>{item.content}</p>
            <p>{item.category} - ${item.price}</p>
            <p>
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                {item.url}
              </a>
            </p>
            <button onClick={() => handleDelete(item._id)} className="text-red-600 mt-2">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
