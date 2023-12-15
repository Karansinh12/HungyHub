import React, { useState, useEffect } from "react";
import "./EditRestaurant.css";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

export default function EditRestaurant() {
  const { restaurantId } = useParams();

  const [restaurant, setRestaurant] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:5000/restaurant/${restaurantId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setRestaurant(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const response = await fetch(
      `http://localhost:5000/restaurantupdate/${restaurantId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    if (response.ok) {
      const updatedRestaurant = await response.json();
      console.log("Restaurant details updated:", updatedRestaurant);
      navigate("/admin/managerestaurant");
    } else {
      const errorData = await response.json();
      console.error("Error updating restaurant details:", errorData.error);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="edit-restaurant-container" style={{ backgroundColor: 'white', padding: '20px', marginTop: '50px',boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
            <form onSubmit={handleSubmit(onSubmit)} className="signup-form">
              <div className="formdiv mb-3">
                <label className="ml-3">Name</label>
                <input
                  type="text"
                  className="form-control"
                  defaultValue={restaurant.name}
                  {...register("name", { required: true })}
                  placeholder="Name"
                />
              </div>
              <div className="formdiv mb-3">
                <label className="ml-3">Cuisine</label>
                <input
                  {...register("cuisine", { required: true })}
                  className="form-control"
                  defaultValue={restaurant.cuisine}
                  placeholder="Cuisine"
                />
              </div>

              <div className="formdiv mb-3">
                <label className="ml-3">Address</label>
                <input
                  type="text"
                  className="form-control"
                  defaultValue={restaurant.address}
                  {...register("address", { required: true })}
                  placeholder="Address"
                />
              </div>

              <div className="formdiv mb-3">
                <label className="ml-3">Location</label>
                <input
                  type="text"
                  className="form-control"
                  defaultValue={restaurant.location}
                  {...register("location", { required: true })}
                  placeholder="location"
                />
              </div>
              <div className="formdiv mb-3">
                <label className="ml-3">Ratings</label>
                <input
                  type="number"
                  className="form-control"
                  min={0}
                  max={5}
                  defaultValue={restaurant.ratings}
                  {...register("ratings", { required: true })}
                  placeholder="ratings"
                />
              </div>
              <div className="formdiv mb-3">
                <label className="ml-3">Image</label>
                <input
                  type="text"
                  className="form-control"
                  defaultValue={restaurant.image}
                  {...register("image", { required: true })}
                  placeholder="image"
                />
              </div>
              <button type="submit" className="btn bg-dark text-warning">
                Update
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
