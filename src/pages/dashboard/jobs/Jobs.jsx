import React, { useEffect, useState } from "react";
import {
  FaSearchLocation,
  FaCheckCircle,
  FaTools,
  FaTruck,
  FaSpinner,
  FaFlag,
  FaCalendarAlt,
} from "react-icons/fa";
import axios from "axios";
import { BASE_URL } from "../../../base/BaseUrl";
import { toast } from "react-toastify";
import { MdOutlineWorkOutline } from "react-icons/md";
import { FiLoader } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const JobCard = ({ title, value, icon: Icon, status, loading }) => {
  const naviagte = useNavigate();
  const getStatusColor = (status) => {
    const colors = {
      inspection: "text-blue-600 bg-blue-50",
      confirmed: "text-green-600 bg-green-50",
      vendor: "text-yellow-600 bg-yellow-50",
      onway: "text-orange-600 bg-orange-50",
      progress: "text-purple-600 bg-purple-50",
      completed: "text-red-600 bg-red-50",
      fieldjob: "text-teal-600 bg-teal-50",
    };
    return colors[status] || "text-gray-600 bg-gray-50";
  };

  const statusColor = getStatusColor(status);

  return (
    <div
      className="bg-white rounded-lg overflow-hidden border border-gray-100 cursor-pointer"
      onClick={() => naviagte("/today?page=1")}
    >
      <div className="p-4">
        <div className="flex flex-col items-center">
          <div
            className={`w-12 h-12 rounded-full ${statusColor} flex items-center justify-center mb-3`}
          >
            <Icon className="w-6 h-6" />
          </div>
          {loading ? (
            <FiLoader className={`animate-spin text-lg  ${statusColor}`} />
          ) : (
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
          )}
          <p className="text-sm font-medium text-gray-600">{title}</p>
        </div>
      </div>
    </div>
  );
};

const Jobs = ({ datas, loading, userType }) => {
  const [data, setData] = useState({
    booking_Inspection_today: 0,
    booking_Confirmed_today: 0,
    booking_Vendor_today: 0,
    booking_way_today: 0,
    booking_Progress_today: 0,
    booking_Completed_today: 0,
  });

  const jobCards = [
    {
      title: "Inspection",
      value: data.booking_Inspection_today,
      icon: FaSearchLocation,
      status: "inspection",
    },
    {
      title: "Confirmed",
      value: data.booking_Confirmed_today,
      icon: FaCheckCircle,
      status: "confirmed",
    },
    {
      title: "Vendor",
      value: data.booking_Vendor_today,
      icon: FaTools,
      status: "vendor",
    },
    {
      title: "On the Way",
      value: data.booking_way_today,
      icon: FaTruck,
      status: "onway",
    },
    {
      title: "In Progress",
      value: data.booking_Progress_today,
      icon: FaSpinner,
      status: "progress",
    },
    {
      title: "Completed",
      value: data.booking_Completed_today,
      icon: FaFlag,
      status: "completed",
    },
    {
      title: "Field Team",
      value: data?.booking_field_count,
      icon: MdOutlineWorkOutline,
      status: "fieldjob",
    },
  ];

  useEffect(() => {
    if (datas) {
      const {
        booking_Inspection_today,
        booking_Confirmed_today,
        booking_Vendor_today,
        booking_way_today,
        booking_Progress_today,
        booking_Completed_today,
        booking_field_count,
      } = datas;

      setData({
        booking_Inspection_today,
        booking_Confirmed_today,
        booking_Vendor_today,
        booking_way_today,
        booking_Progress_today,
        booking_Completed_today,
        booking_field_count,
      });
    }
  }, [datas]);

  return (
    <div>
      <div className="bg-white rounded-lg shadow-sm p-4 mb-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
            <FaCalendarAlt className="text-red-600 text-lg" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Today's Jobs </h2>
          </div>
        </div>
      </div>

      <div
        className={`grid gap-4 mt-4 ${
          userType == 8
            ? "grid-cols-1 md:grid-cols-3"
            : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
        }`}
      >
        {jobCards.map((card, index) => (
          <JobCard
            key={index}
            title={card.title}
            value={card.value}
            icon={card.icon}
            status={card.status}
            loading={loading}
          />
        ))}
      </div>
    </div>
  );
};

export default Jobs;
