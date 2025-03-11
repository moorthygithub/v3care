import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdSend, MdArrowBack } from "react-icons/md"; // React Icons for styling

import Layout from "../../../layout/Layout";
import MasterFilter from "../../../components/MasterFilter";
import BASE_URL from "../../../base/BaseUrl";
import { toast } from "react-toastify";
import axios from "axios";
import { Button, Input } from "@material-tailwind/react";
import UseEscapeKey from "../../../utils/UseEscapeKey";
import PageHeader from "../../../components/common/PageHeader/PageHeader";
import ButtonConfigColor from "../../../components/common/ButtonConfig/ButtonConfigColor";

const AddServiceMaster = () => {
  const [services, setServices] = useState({
    service: "",
    service_comm: "",
    service_image: "",
  });
  UseEscapeKey();
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  // Validation function
  const validateOnlyDigits = (inputtxt) => /^\d*$/.test(inputtxt);

  const onInputChange = (e) => {
    const { name, value } = e.target;
    if (["service_comm"].includes(name)) {
      if (validateOnlyDigits(value)) {
        setServices((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setServices((prev) => ({ ...prev, [name]: value }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setIsButtonDisabled(true);

    const data = new FormData();
    data.append("service", services.service);
    data.append("service_image", selectedFile);
    data.append("service_comm", services.service_comm);

    try {
      const response = await axios.post(
        `${BASE_URL}/api/panel-create-service`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.code === "200") {
        toast.success(response.data?.msg || "Service Created Successfully");

        // Reset Form
        setServices({
          service: "",
          service_comm: "",
          service_image: "",
        });

        navigate("/service");
      } else {
        toast.error(response.data?.msg || "Duplicate entry");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");

      setLoading(false);
      setIsButtonDisabled(false);
    } finally {
      setLoading(false);
      setIsButtonDisabled(false);
    }
  };

  return (
    <Layout>
      <MasterFilter />

      <PageHeader title={"Create Service"} />

      <div className="w-full mt-5 mx-auto p-8 bg-white shadow-lg rounded-xl">
        <form id="addIndiv" autoComplete="off" onSubmit={onSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Service Field */}
            <div className="form-group">
              <Input
                label="service"
                type="text"
                name="service"
                value={services.service}
                onChange={onInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none   transition-all duration-300 shadow-sm"
              />
            </div>

            <div className="form-group">
              <Input
                label="service image"
                type="file"
                name="service_image"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                className="w-full px-4 pb-2 border border-gray-300 rounded-md focus:outline-none  transition-all duration-300 shadow-sm"
              />
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <ButtonConfigColor
              type="submit"
              buttontype="submit"
              label="Submit"
              disabled={isButtonDisabled}
              loading={loading}
            />

            <ButtonConfigColor
              type="back"
              buttontype="button"
              label="Cancel"
              onClick={() => navigate(-1)}
            />
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AddServiceMaster;
