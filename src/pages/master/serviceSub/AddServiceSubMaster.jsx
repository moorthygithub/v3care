import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdSend, MdArrowBack } from "react-icons/md";
import Layout from "../../../layout/Layout";
import MasterFilter from "../../../components/MasterFilter";
import { ContextPanel } from "../../../utils/ContextPanel";
import { BASE_URL } from "../../../base/BaseUrl";
import axios from "axios";
import { toast } from "react-toastify";
import { Button, Input } from "@material-tailwind/react";
import UseEscapeKey from "../../../utils/UseEscapeKey";
import PageHeader from "../../../components/common/PageHeader/PageHeader";
import ButtonConfigColor from "../../../components/common/ButtonConfig/ButtonConfigColor";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const AddServiceSubMaster = () => {
  const [services, setServices] = useState({
    service_id: "",
    service_sub: "",
    service_sub_image: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  UseEscapeKey();
  const [serdata, setSerData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchServiceSUbData = async () => {
      try {
        if (!isPanelUp) {
          navigate("/maintenance");
          return;
        }
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-service`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setSerData(response.data?.service);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServiceSUbData();
    setLoading(false);
  }, []);

  const onInputChange = (e) => {
    setServices({
      ...services,
      [e.target.name]: e.target.value,
    });
  };
  const onServiceChange = (value) => {
    setServices((prev) => ({
      ...prev,
      service_id: value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setIsButtonDisabled(true);
    const data = new FormData();
    data.append("service_id", services?.service_id);
    data.append("service_sub", services.service_sub);
    data.append("service_sub_image", selectedFile);

    axios({
      url: BASE_URL + "/api/panel-create-service-sub",
      method: "POST",
      data,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      if (res.data.code == "200") {
        toast.success(res.data?.msg || "Service sub Create succesfull");

        setServices({
          service_id: "",
          service_sub: "",
          service_sub_image: "",
        });
        navigate(-1);
      } else {
        toast.error(res.data?.msg || "duplicate entry");
      }
    });
    setIsButtonDisabled(false);
  };
  return (
    <Layout>
      <MasterFilter />

      <PageHeader title={"Create Sub Service"} />

      <div className="w-full mt-2 p-4 bg-white shadow-lg rounded-xl">
        <form id="addIndiv" autoComplete="off" onSubmit={onSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Service Select Field */}
            {/* <Select
                label="Service"
                name="service_id"
                required
                className="w-full px-4 py-3 border border-gray-400 rounded-md transition-all"
                onChange={onServiceChange}
              >
                {serdata.map((ser) => (
                  <SelectOption
                    key={ser.id}
                    value={ser.id.toString()}
                    selected={services.service_id === ser.id}
                  >
                    {ser.service}
                  </SelectOption>
                ))}
              </Select> */}
            <FormControl>
              <InputLabel id="service-select-label">
                <span className="text-sm relative bottom-[6px]">
                  Service
                  <span className="text-red-700">*</span>
                </span>
              </InputLabel>
              <Select
                sx={{ height: "40px", borderRadius: "5px" }}
                labelId="service-select-label"
                id="id"
                name="service_id"
                value={services.service_id}
                onChange={onInputChange}
                label="Service *"
                required
              >
                {serdata.map((item) => (
                  <MenuItem key={item.id} value={String(item.id)}>
                    {item.service}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>{" "}
            {/* Service Sub Field */}
            <div className="form-group">
              <Input
                label="Sub Service"
                type="text"
                name="service_sub"
                value={services.service_sub}
                onChange={onInputChange}
                required
                maxLength={180}
                className="w-full px-4 py-3 border border-gray-400 rounded-md  transition-all"
              />
            </div>
            {/* File Upload Field */}
            <div className="form-group">
              <Input
                label="Image"
                type="file"
                name="service_sub_image"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                className="w-full px-4 pb-2 border border-gray-400 rounded-md  transition-all"
              />
            </div>
          </div>

          {/* Buttons */}
          {/* <div className="flex justify-center space-x-4">

            <Button
              type="submit"
              className="mr-2 mb-2"
              color="primary"
            >
              <div className="flex gap-1">
                <MdSend className="w-4 h-4" />
                <span>Submit</span>
              </div>
            </Button>


            <Link to="/service-sub">
              <Button className="mr-2 mb-2" color="primary">
                <div className="flex gap-1">
                  <MdArrowBack className="w-5 h-5" />
                  <span>Back</span>
                </div>
              </Button>
            </Link>
          </div> */}
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

export default AddServiceSubMaster;
