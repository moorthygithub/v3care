import React, { useContext, useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import MasterFilter from "../../../components/MasterFilter";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import { FaEdit } from "react-icons/fa";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import MUIDataTable from "mui-datatables";
import { ContextPanel } from "../../../utils/ContextPanel";
import UseEscapeKey from "../../../utils/UseEscapeKey";
import OperationViewTeamMaster from "./OperationViewTeamMaster";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const OperationTeamMaster = () => {
  const [operationData, setOperationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isPanelUp, userType } = useContext(ContextPanel);
  const navigate = useNavigate();
  const [operationDrawer, setOperationDrawer] = useState(false);
  const [selectedOperationId, setSelectedOperationId] = useState(null);
  const location = useLocation();
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;
  const searchParams = new URLSearchParams(location.search);
  const pageParam = searchParams.get("page");
  useEffect(() => {
    if (pageParam) {
      setPage(parseInt(pageParam) - 1);
    } else {
      const storedPageNo = localStorage.getItem("page-no");
      if (storedPageNo) {
        setPage(parseInt(storedPageNo) - 1);
        navigate(`/operation-team?page=${storedPageNo}`);
      } else {
        localStorage.setItem("page-no", 1);
        setPage(0);
      }
    }
  }, [location]);
  UseEscapeKey();
  useEffect(() => {
    const fetchOperationData = async () => {
      try {
        if (!isPanelUp) {
          navigate("/maintenance");
          return;
        }
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-admin-office-list`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setOperationData(response.data?.adminUser);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOperationData();
    setLoading(false);
  }, []);

  const toogleViewOperation =
    (open, id = null) =>
    (event) => {
      if (
        event &&
        event.type === "keydown" &&
        (event.key === "Tab" || event.key === "Shift")
      ) {
        return;
      }
      setOperationDrawer(open);
      if (id) setSelectedOperationId(id);
    };
  const handleEdit = (e, id) => {
    e.preventDefault();
    localStorage.setItem("page-no", pageParam);
    navigate(`/operation-team-edit/${id}`);
  };
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
      name: "branch_name",
      label: "Branch",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "name",
      label: "Full Name",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "mobile",
      label: "Mobile",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "email",
      label: "Email",
      options: {
        filter: true,
        sort: true,
      },
    },

    {
      name: "status",
      label: "Status",
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
            <div className="flex items-center space-x-2">
              {userType !== "4" && (
                <FaEdit
                  onClick={(e) => handleEdit(e, id)}
                  title="Booking Info"
                  className="h-5 w-5 cursor-pointer"
                />
              )}
              {/* <MdOutlineRemoveRedEye
                onClick={() => navigate(`/operation-team-view/${id}`)}
                title="Booking Info"
                className="h-5 w-5 cursor-pointer"
              /> */}
              <div
                onClick={toogleViewOperation(true, id)}
                className="flex items-center space-x-2"
                title="View"
              >
                <MdOutlineRemoveRedEye className="h-5 w-5 cursor-pointer" />
              </div>
            </div>
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
    count: operationData?.length || 0,
    rowsPerPage: rowsPerPage,
    page: page,
    onChangePage: (currentPage) => {
      setPage(currentPage);
      navigate(`/operation-team?page=${currentPage + 1}`);
    },
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
              to="/add-operation-team"
              className="btn btn-primary text-center md:text-right text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-md"
            >
              + Operation
            </Link>
          )}
        </>
      );
    },
    customFooter: (count, page, rowsPerPage, changeRowsPerPage, changePage) => {
      return (
        <div className="flex justify-end items-center p-4">
          <span className="mx-4">
            <span className="text-red-600">{page + 1}</span>-{rowsPerPage} of{" "}
            {Math.ceil(count / rowsPerPage)}
          </span>
          <IoIosArrowBack
            onClick={page === 0 ? null : () => changePage(page - 1)}
            className={`w-6 h-6 cursor-pointer ${
              page === 0 ? "text-gray-400 cursor-not-allowed" : "text-blue-600"
            }  hover:text-red-600`}
          />
          <IoIosArrowForward
            onClick={
              page >= Math.ceil(count / rowsPerPage) - 1
                ? null
                : () => changePage(page + 1)
            }
            className={`w-6 h-6 cursor-pointer ${
              page >= Math.ceil(count / rowsPerPage) - 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-blue-600"
            }  hover:text-red-600`}
          />
        </div>
      );
    },
  };
  return (
    <Layout>
      <MasterFilter />
      {/* <div className="flex flex-col md:flex-row justify-between items-center bg-white mt-5 p-2 rounded-lg space-y-4 md:space-y-0">
        <h3 className="text-center md:text-left text-lg md:text-xl font-bold">
          Operation Team List
        </h3>
        {userType !== "4" && (
          <Link
            to="/add-operation-team"
            className="btn btn-primary text-center md:text-right text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-md"
          >
            + Operation Field Team
          </Link>
        )}
      </div> */}
      <div className="mt-5">
        <MUIDataTable
          title="Operation Team List"
          data={operationData ? operationData : []}
          columns={columns}
          options={options}
        />
      </div>

      <SwipeableDrawer
        anchor="right"
        open={operationDrawer}
        onClose={toogleViewOperation(false)}
        onOpen={toogleViewOperation(true)}
      >
        {selectedOperationId && (
          <OperationViewTeamMaster
            operationId={selectedOperationId}
            onClose={toogleViewOperation(false)}
          />
        )}
      </SwipeableDrawer>
    </Layout>
  );
};

export default OperationTeamMaster;
