import React, { useContext, useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import MasterFilter from "../../../components/MasterFilter";
import { ContextPanel } from "../../../utils/ContextPanel";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import { FaEdit } from "react-icons/fa";
import MUIDataTable from "mui-datatables";
import UseEscapeKey from "../../../utils/UseEscapeKey";

const ServiceSubMaster = () => {
  const [serviceSubData, setServiceSubData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isPanelUp, userType } = useContext(ContextPanel);
  const navigate = useNavigate();
  UseEscapeKey();
  useEffect(() => {
    const fetchServiceSubData = async () => {
      try {
        if (!isPanelUp) {
          navigate("/maintenance");
          return;
        }
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-service-sub-list`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setServiceSubData(response.data?.servicesub);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServiceSubData();
    setLoading(false);
  }, []);

  const columns = [
    {
      name: "slNo",
      label: "SL No",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          return tableMeta.rowIndex + 1;
        },
      },
    },
    {
      name: "service_sub_image",
      label: "Image",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (image) => {
          const imageUrl = image
            ? `https://agsdraft.online/app/storage/app/public/service_sub/${image}`
            : "https://agsdraft.online/app/storage/app/public/no_image.jpg";
          return (
            <img
              src={imageUrl}
              alt="Service"
              style={{ width: "40px", height: "40px", objectFit: "cover" }}
            />
          );
        },
      },
    },

    {
      name: "service_sub",
      label: "Service Sub",
      options: {
        filter: true,
        sort: false,
      },
    },

    {
      name: "service_sub_status",
      label: "Status  ",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "id",
      label: "Action",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (id) => {
          return (
            <>
              {userType !== "4" && (
                <div
                  onClick={() => navigate(`/service-sub-edit/${id}`)}
                  className="flex items-center space-x-2"
                >
                  <FaEdit
                    title="Booking Info"
                    className="h-5 w-5 cursor-pointer"
                  />
                </div>
              )}
            </>
          );
        },
      },
    },
  ];
  const options = {
    selectableRows: "none",
    elevation: 0,
    responsive: "standard",
    viewColumns: true,
    download: false,
    print: false,
    setRowProps: (rowData) => {
      return {
        style: {
          borderBottom: "5px solid #f1f7f9",
        },
      };
    },
    customToolbar: () => {
      return (
      <>
       {userType !== "4" && (
          <Link
            to="/add-service-sub"
            className="btn btn-primary text-center md:text-right text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-md"
          >
            + Service Sub
          </Link>
        )}
      </>
      );
    },
  };
  return (
    <Layout>
      <MasterFilter />
      {/* <div className="flex flex-col md:flex-row justify-between items-center bg-white mt-5 p-2 rounded-lg space-y-4 md:space-y-0">
        <h3 className="text-center md:text-left text-lg md:text-xl font-bold">
          Service Sub List
        </h3>
        {userType !== "4" && (
          <Link
            to="/add-service-sub"
            className="btn btn-primary text-center md:text-right text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-md"
          >
            + Add Service Sub
          </Link>
        )}
      </div> */}
      <div className="mt-5">
        <MUIDataTable
        title="Service Sub List"
          data={serviceSubData ? serviceSubData : []}
          columns={columns}
          options={options}
        />
      </div>
    </Layout>
  );
};

export default ServiceSubMaster;
