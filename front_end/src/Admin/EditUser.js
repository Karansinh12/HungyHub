import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import './EditUser.css'; // Import the styles from EditUser.css

export default function EditCoupon() {
  const { couponId } = useParams();

  const [coupon, setCoupon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:5000/coupon/${couponId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setCoupon(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, [couponId]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      code: coupon.code,
      discount: coupon.discount,
    },
  });

  const onSubmit = async (data) => {
    try {
      const response = await axios.put(`http://localhost:5000/couponupdate/${couponId}`, data);
      if (response.status === 200) {
        console.log('Coupon details updated:', response.data);
        navigate('/admin/managecoupons');
      }
    } catch (error) {
      console.error('Error updating coupon details:', error);
    }
  };

  return (
    <div className="edit-user-container">
      <form onSubmit={handleSubmit(onSubmit)} className="edit-form">
        <div className="formdiv">
          <label>Coupon Code</label>
          <input
            type="text"
            className={`form-control ${errors.code ? 'is-invalid' : ''}`}
            defaultValue={coupon.code}
            {...register('code', { required: true })}
            placeholder="Coupon Code"
          />
          {errors.code && <div className="invalid-feedback">{errors.code}</div>}
        </div>
        <div className="formdiv">
          <label>Discount Value</label>
          <input
            type="text"
            className={`form-control ${errors.discount ? 'is-invalid' : ''}`}
            defaultValue={coupon.discount}
            {...register('discount', { required: true })}
            placeholder="Discount Value"
          />
          {errors.discount && <div className="invalid-feedback">{errors.discount}</div>}
        </div>

        <button type="submit" className="btn btn-primary mt-3">
          Update
        </button>
      </form>
    </div>
  );
}
