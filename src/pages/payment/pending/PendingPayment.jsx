import React, { useContext, useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import PaymentFilter from "../../../components/PaymentFilter";
import { ContextPanel } from "../../../utils/ContextPanel";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import MUIDataTable from "mui-datatables";

import Moment from "moment";
import UseEscapeKey from "../../../utils/UseEscapeKey";

const PendingPayment = () => {
  const [pendingData, setPendingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
  const navigate = useNavigate();
  UseEscapeKey();
  useEffect(() => {
    const fetchPendingData = async () => {
      try {
        if (!isPanelUp) {
          navigate("/maintenance");
          return;
        }
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-payment-pending-list`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setPendingData(response.data?.booking);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPendingData();
    setLoading(false);
  }, []);

  const columns = [
    {
      name: "order_ref",
      label: "ID",
      options: {
        filter: false,
        display:"exclude",
        searchable: true,
        sort: true,
      },
    },
    {
      name: "branch_name",
      label: "Branch",
      options: {
        filter: false,
        display:"exclude",
        searchable: true,
        sort: true,
      },
    },
    {
      name: "order_branch",
      label: "Order/Branch",
      options: {
        filter: false,
        sort: false,
        customBodyRender:  (value,tableMeta) => {
          const brancName = tableMeta.rowData[1]
          const orderRef = tableMeta.rowData[0]
          return (
            <div className=" flex flex-col w-32">
             <span>{orderRef}</span>
             <span>{brancName}</span>
            </div>
          );
        },
      },
    },
    {
      name: "order_area",
      label: "Area",
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: "order_customer",
      label: "Customer",
      options: {
        filter: true,
        display:"exclude",
        searchable: true,
        sort: true,
      },
    },
    {
      name: "order_customer_mobile",
      label: "Mobile",
      options: {
        filter: true,
        display:"exclude",
        searchable: true,
        sort: true,
      },
    },
    {
      name: "customer_mobile",
      label: "Customer/Mobile",
      options: {
        filter: false,
        sort: false,
        customBodyRender:  (value,tableMeta) => {
          const customeName = tableMeta.rowData[4]
          const mobileNo = tableMeta.rowData[5]
          return (
            <div className=" flex flex-col w-38">
             <span>{customeName}</span>
             <span>{mobileNo}</span>
            </div>
          );
        },
      },
    },
    {
      name: "order_date",
      label: "Booking Date",
      options: {
        filter: true,
        sort: true,
        display:"exclude",
        searchable: true,
        customBodyRender: (value) => {
          return Moment(value).format("DD-MM-YYYY");
        },
      },
    },
    {
      name: "order_service_date",
      label: "Service Date",
      options: {
        filter: true,
        sort: true,
        display:"exclude",
        searchable: true,
        customBodyRender: (value) => {
          return Moment(value).format("DD-MM-YYYY");
        },
      },
    },
    {
      name: "booking_service_date",
      label: "Booking/Service",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value ,tableMeta) => {
          const bookingDate = tableMeta.rowData[7]
          const serviceDate = tableMeta.rowData[8]
          return (
            <div className=" flex flex-col justify-center">
              <span>{Moment(bookingDate).format("DD-MM-YYYY")}</span>
              <span>{Moment(serviceDate).format("DD-MM-YYYY")}</span>
              </div>
          )
        },
      },
    },
    {
      name: "order_service",
      label: "Service",
      options: {
        filter: true,
        display:"exclude",
        searchable:true,
        sort: true,
      },
    },

    {
      name: "order_amount",
      label: "Price",
      options: {
        filter: true,
        display:"exclude",
        searchable:true,
        sort: false,
      },
    },
    {
      name: "service_price",
      label: "Service/Price",
      options: {
        filter: false,
        sort: false,
        customBodyRender:  (value,tableMeta) => {
          const service = tableMeta.rowData[10]
          const price = tableMeta.rowData[11]
          return (
            <div className=" flex flex-col w-40">
             <span>{service}</span>
             <span>{price}</span>
            </div>
          );
        },
      },
    },
    {
      name: "order_payment_amount",
      label: "Paid Amount",
      options: {
        filter: false,
        display:"exclude",
        searchable:true,
        sort: false,
      },
    },
    {
      name: "order_payment_type",
      label: "Paid Type",
      options: {
        filter: false,
        display:"exclude",
        searchable:true,
        sort: false,
      },
    },
    {
      name: "amount_type",
      label: "Paid Amount/Type",
      options: {
        filter: false,
        sort: false,
        customBodyRender:  (value,tableMeta) => {
          const amountType = tableMeta.rowData[13]
          const paidType = tableMeta.rowData[14]
          return (
            <div className=" flex flex-col ">
             <span>{amountType}</span>
             <span>{paidType}</span>
            </div>
          );
        },
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
            <div
              onClick={() => navigate(`/pending-payment-view/${id}`)}
              className="flex items-center space-x-2"
            >
              <MdOutlineRemoveRedEye
                title="View pending Info"
                className="h-5 w-5 cursor-pointer"
              />
            </div>
          );
        },
      },
    },
  ];
  const options = {
    selectableRows: "none",
    elevation: 0,
    // rowsPerPage: 5,
    // rowsPerPageOptions: [5, 10, 25],
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
  };
  return (
    <Layout>
      <PaymentFilter />
      {/* <div className="flex flex-col md:flex-row justify-between items-center bg-white mt-5 p-2 rounded-lg space-y-4 md:space-y-0">
        <h3 className="text-center md:text-left text-lg md:text-xl font-bold">
          Payment Pending List
        </h3>
      </div> */}
      <div className="mt-5">
        <MUIDataTable
        title="Payment Pending List"
          data={pendingData ? pendingData : []}
          columns={columns}
          options={options}
        />
      </div>
    </Layout>
  );
};

export default PendingPayment;
