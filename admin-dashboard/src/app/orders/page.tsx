"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../../firebaseConfig";
import { useRouter } from "next/navigation";
import { client } from "@/sanity/lib/client";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import Swal from "sweetalert2";
import React from "react";

const adminEmail = "daniyalashraf9790@gmail.com"; // Replace with your admin email.

interface Order {
  _id: string;
  name: string;
  email: string;
  address: string;
  mobile: string;
  province: string;
  city: string;
  zipCode: string;
  total: number;
  status: string | null;
  orderDate: string;
  cartItems: { title: string; image: string }[];
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [filter, setFilter] = useState("All");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const router = useRouter();

  // Check if the user is authenticated and authorized
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
      } else {
        router.push("/sign-in"); // Redirect to login page if not authenticated.
      }
    });
  
    return () => unsubscribe();
  }, [router]); // <- Router ko dependencies array mein add karein
  

  // Fetch orders if the user is the admin.
  useEffect(() => {
    if (userEmail === adminEmail) {
      fetchOrders();
    } else if (userEmail) {
      alert("Access Denied!");
      signOut(auth);
      router.push("/sign-in");
    }
  }, [userEmail]);

  const fetchOrders = async () => {
    try {
      const data = await client.fetch(
        `*[_type == "order"]{
          _id,
          name,
          email,
          address,
          mobile,
          province,
          city,
          zipCode,
          total,
          status,
          orderDate,
          cartItems[]->{
            title,
            image
          }
        }`
      );
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const filteredOrders =
    filter === "All"
      ? orders
      : orders.filter((order) => order.status === filter);

  const toggleOrderDetails = (orderId: string) => {
    setSelectedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  const handleDelete = async (orderId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await client.delete(orderId);
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== orderId)
      );
      Swal.fire("Deleted!", "Your order has been deleted.", "success");
    } catch (error) {
      console.error("Error deleting order:", error);
      Swal.fire("Error!", "Something went wrong while deleting.", "error");
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await client.patch(orderId).set({ status: newStatus }).commit();
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      Swal.fire("Updated!", `Order status changed to ${newStatus}.`, "success");
    } catch (error) {
      console.error("Error updating order status:", error);
      Swal.fire(
        "Error!",
        "Something went wrong while updating the status.",
        "error"
      );
    }
  };

  if (!userEmail) return <p>Loading...</p>;

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <nav className="bg-red-600 text-white p-4 shadow-lg flex justify-between items-center">
        <h2 className="text-xl sm:text-2xl font-bold">Admin Dashboard</h2>
        <button
          onClick={() => {
            signOut(auth);
            router.push("/sign-in");
          }}
          className="bg-white text-red-600 font-bold px-3 sm:px-4 py-1 sm:py-2 rounded"
        >
          Logout
        </button>
      </nav>
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center">
          Orders
        </h2>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {["All", "pending", "dispatch", "success"].map((status) => (
            <button
              key={status}
              className={`px-3 py-1 sm:px-4 sm:py-2 rounded-lg transition-all ${
                filter === status
                  ? "bg-red-600 text-white font-bold"
                  : "bg-gray-200"
              }`}
              onClick={() => setFilter(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Orders - Column format for small screens */}
        <div className="sm:hidden space-y-4">
          {filteredOrders.map((order) => (
            <div key={order._id} className="bg-white shadow-md rounded-lg p-4">
              <p>
                <strong>ID:</strong> {order._id}
              </p>
              <p>
                <strong>Customer:</strong> {order.name}
              </p>
              <p>
                <strong>Address:</strong> {order.address}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {order.orderDate
                  ? new Date(order.orderDate).toLocaleDateString()
                  : "N/A"}
              </p>
              <p>
                <strong>Total:</strong> ${order.total}
              </p>
              <p>
                <strong>Status:</strong>
                <select
                  value={order.status || ""}
                  onChange={(e) =>
                    handleStatusChange(order._id, e.target.value)
                  }
                  className="bg-gray-100 p-1 rounded ml-2"
                >
                  <option value="pending">Pending</option>
                  <option value="dispatch">Dispatch</option>
                  <option value="success">Completed</option>
                </select>
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(order._id);
                }}
                className="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 transition"
              >
                Delete
              </button>

              {/* Order Details */}
              {selectedOrderId === order._id && (
                <div className="mt-3 bg-gray-50 p-3 rounded">
                  <h3 className="font-bold">Order Details</h3>
                  <p>
                    <strong>Phone:</strong> {order.mobile}
                  </p>
                  <p>
                    <strong>Email:</strong> {order.email}
                  </p>
                  <p>
                    <strong>City:</strong> {order.city}
                  </p>
                  <p>
                    <strong>Province:</strong> {order.province}
                  </p>
                  <h3 className="mt-2 font-bold">Products:</h3>
                  <ul className="mt-2 space-y-1">
                    {order.cartItems.map((item, index) => (
                      <li
                        key={`${order._id}-${index}`}
                        className="flex items-center gap-2"
                      >
                        {item.title}
                        {item.image && (
                          <Image
                            src={urlFor(item.image).url()}
                            width={40}
                            height={40}
                            alt={item.title}
                            className="rounded shadow"
                          />
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Orders Table for larger screens */}
        <div className="hidden sm:block overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="w-full min-w-[600px] md:min-w-full divide-y divide-gray-200 text-xs sm:text-sm lg:text-base">
            <thead className="bg-gray-50 text-red-600">
              <tr>
                <th className="px-2 sm:px-4 py-2">ID</th>
                <th className="px-2 sm:px-4 py-2">Customer</th>
                <th className="px-2 sm:px-4 py-2">Address</th>
                <th className="px-2 sm:px-4 py-2">Date</th>
                <th className="px-2 sm:px-4 py-2">Total</th>
                <th className="px-2 sm:px-4 py-2">Status</th>
                <th className="px-2 sm:px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <React.Fragment key={order._id}>
                  <tr
                    className="cursor-pointer hover:bg-red-100 transition-all text-center"
                    onClick={() => toggleOrderDetails(order._id)}
                  >
                    <td className="px-2 sm:px-4 py-2">{order._id}</td>
                    <td className="px-2 sm:px-4 py-2">{order.name}</td>
                    <td className="px-2 sm:px-4 py-2">{order.address}</td>
                    <td className="px-2 sm:px-4 py-2">
                      {order.orderDate
                        ? new Date(order.orderDate).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-2 sm:px-4 py-2">${order.total}</td>
                    <td className="px-2 sm:px-4 py-2">
                      <select
                        value={order.status || ""}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                        className="bg-gray-100 p-1 rounded text-xs sm:text-sm"
                      >
                        <option value="pending">Pending</option>
                        <option value="dispatch">Dispatch</option>
                        <option value="success">Completed</option>
                      </select>
                    </td>
                    <td className="px-2 sm:px-4 py-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(order._id);
                        }}
                        className="bg-red-500 text-white px-2 sm:px-3 py-1 rounded hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>

                  {/* Order Details */}
                  {selectedOrderId === order._id && (
                    <tr>
                      <td colSpan={7} className="bg-gray-50 p-4 text-left">
                        <h3 className="font-bold">Order Details</h3>
                        <p>
                          <strong>Phone:</strong> {order.mobile}
                        </p>
                        <p>
                          <strong>Email:</strong> {order.email}
                        </p>
                        <p>
                          <strong>City:</strong> {order.city}
                        </p>
                        <p>
                          <strong>Province:</strong> {order.province}
                        </p>
                        <h3 className="mt-2 font-bold">Products:</h3>
                        <ul className="mt-2 space-y-1">
                          {order.cartItems.map((item, index) => (
                            <li
                              key={`${order._id}-${index}`}
                              className="flex items-center gap-2"
                            >
                              {item.title}
                              {item.image && (
                                <Image
                                  src={urlFor(item.image).url()}
                                  width={40}
                                  height={40}
                                  alt={item.title}
                                  className="rounded shadow"
                                />
                              )}
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;
