import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MasterFilter from "../../../components/MasterFilter";
import Layout from "../../../layout/Layout";
import InputMask from "react-input-mask";
import { Card, Input, Textarea } from "@material-tailwind/react";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import {
  Autocomplete,
  Box,
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { toast } from "react-toastify";
import { BASE_URL } from "../../../base/BaseUrl";
import ButtonConfigColor from "../../../components/common/ButtonConfig/ButtonConfigColor";
import LoaderComponent from "../../../components/common/LoaderComponent";
import PageHeader from "../../../components/common/PageHeader/PageHeader";
import UseEscapeKey from "../../../utils/UseEscapeKey";
const status = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];
const training = [
  {
    value: "Yes",
    label: "Yes",
  },
  {
    value: "No",
    label: "No",
  },
];
const BackhandEditTeamMaster = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetchloading, setFetchLoading] = useState(false);

  const [team, setTeam] = useState({
    name: "",
    mobile: "",
    email: "",
    remarks: "",
    status: "",
    user_aadhar_no: "",
    user_aadhar: "",
    user_pancard_no: "",
    user_pancard: "",
    //new
    user_job_skills: null,
    user_designation: "",
    user_training: "",
    user_trained_bywhom: "",
    user_last_training: "",
    user_joinining_date: "",
  });
  const navigate = useNavigate();
  const storedPageNo = localStorage.getItem("page-no");
  const [ViewBranchId, setViewBranchId] = useState([]);
  const [viewBranchIds, setViewBranchIds] = useState([]);
  const pageNo =
    storedPageNo === "null" || storedPageNo === null ? "1" : storedPageNo;
  const [selectedFile1, setSelectedFile1] = useState(null);
  const [selectedFile2, setSelectedFile2] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [branch, setBranch] = useState([]);

  UseEscapeKey();
  const validateOnlyDigits = (inputtxt) => {
    return /^\d+$/.test(inputtxt) || inputtxt.length === 0;
  };

  const onInputChange = (e) => {
    const { name, value } = e.target;
    if (
      (name === "mobile" || name === "user_aadhar_no") &&
      !validateOnlyDigits(value)
    ) {
      return;
    }
    setTeam({ ...team, [name]: value });
  };
  useEffect(() => {
    var theLoginToken = localStorage.getItem("token");

    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: "Bearer " + theLoginToken,
      },
    };

    fetch(BASE_URL + "/api/panel-fetch-branch", requestOptions)
      .then((response) => response.json())
      .then((data) => setBranch(data.branch));
  }, []);
  useEffect(() => {
    setFetchLoading(true);
    axios({
      url: `${BASE_URL}/api/panel-fetch-admin-user-by-id/${id}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        const adminUser = res.data.adminUser;
        const rawData = res?.data?.adminUser || {};
        const normalizedData = Object.fromEntries(
          Object.entries(rawData).map(([key, value]) => {
            if (value === null || value === "null") return [key, ""];
            return [key, value];
          })
        );

        setTeam(normalizedData);
        const ids = adminUser.view_branch_id
          ? adminUser.view_branch_id.split(",").map((id) => Number(id.trim()))
          : [];

        setViewBranchIds(ids);
      })
      .catch((error) => {
        console.error("Error fetching admin user data:", error);
      })
      .finally(() => {
        setFetchLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (
      branch.length &&
      viewBranchIds.length &&
      ViewBranchId.length === 0 // ✅ don't re-set if already filled
    ) {
      const selectedBranchObjects = branch.filter((b) =>
        viewBranchIds.includes(b.id)
      );
      setViewBranchId(selectedBranchObjects);
    }
  }, [branch, viewBranchIds]);

  const handleBack = (e) => {
    e.preventDefault();
    navigate(`/backhand-team?page=${pageNo}`);
  };
  const handleChange = (newValue) => {
    setViewBranchId(newValue);
  };
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = document.getElementById("addIndiv");

    // Check if form is valid
    if (!form.checkValidity()) {
      toast.error("Fill all required fields");
      setLoading(false);
      return;
    }

    setIsButtonDisabled(true);

    try {
      const selectedServiceValues = ViewBranchId.map(
        (service) => service.id
      ).join(",");
      const data = new FormData();
      data.append("name", team.name);
      data.append("mobile", team.mobile);
      data.append("email", team.email);
      data.append("remarks", team.remarks);
      data.append("status", team.status);
      data.append("user_aadhar_no", team.user_aadhar_no);
      data.append("user_aadhar", selectedFile1);
      data.append("user_pancard_no", team.user_pancard_no);
      data.append("user_pancard", selectedFile2);
      data.append("user_type", team.user_type);
      data.append("view_branch_id", selectedServiceValues);

      //new
      data.append("user_designation", team.user_designation);
      data.append("user_job_skills", team.user_job_skills);
      data.append("user_training", team.user_training);
      data.append("user_trained_bywhom", team.user_trained_bywhom);
      data.append("user_last_training", team.user_last_training);
      data.append("user_joinining_date", team.user_joinining_date);

      const response = await axios.post(
        `${BASE_URL}/api/panel-update-admin-user/${id}?_method=PUT`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.code == "200") {
        toast.success(response.data?.msg || "Update successful!");
        navigate(`/backhand-team?page=${pageNo}`);
      } else {
        toast.error(response.data?.msg || "Duplicate entry");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      setIsButtonDisabled(false);
    }
  };
  return (
    <Layout>
      <MasterFilter />
      <PageHeader title={"Edit Admin"} onClick={handleBack} />
      {fetchloading ? (
        <LoaderComponent />
      ) : (
        <div className="container mx-auto ">
          <Card className="p-6 mt-2">
            <form id="addIndiv" autoComplete="off" onSubmit={onSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-4">
                {/* Full Name Field */}
                <div>
                  <Input
                    label="Full Name"
                    type="text"
                    name="name"
                    value={team.name}
                    onChange={onInputChange}
                    required
                    maxLength={80}
                    className="w-full px-4 py-3 border border-gray-500 rounded-md  transition-all"
                  />
                </div>

                {/* Mobile No Field */}
                <div>
                  <Input
                    label="Mobile No"
                    type="text"
                    name="mobile"
                    value={team.mobile}
                    onChange={onInputChange}
                    maxLength={10}
                    minLength={10}
                    required
                    className="w-full px-4 py-3 border border-gray-400 rounded-md  transition-all"
                  />
                </div>

                {/* Email Field */}
                <div>
                  <Input
                    label="Email Id"
                    type="email"
                    required
                    name="email"
                    value={team.email}
                    onChange={onInputChange}
                    className="w-full px-4 py-3 border border-gray-400 rounded-md  transition-all"
                  />
                </div>
              </div>
              <Box>
                <Autocomplete
                  multiple
                  id="checkboxes-tags-demo"
                  options={branch}
                  value={ViewBranchId}
                  disableCloseOnSelect
                  getOptionLabel={(option) =>
                    option.service ?? option.branch_name
                  }
                  onChange={(event, newValue) => handleChange(newValue)}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                      />
                      {option.service ?? option.branch_name}
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 500,
                          }}
                        >
                          Choose Branch <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      InputProps={{
                        ...params.InputProps,
                        style: { padding: "0px" },
                      }}
                      inputProps={{
                        ...params.inputProps,
                        style: { padding: "10px" },
                      }}
                    />
                  )}
                />
              </Box>
              {/* Aadhar No Field */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-4">
                <div>
                  <Input
                    label="Aadhar No"
                    type="text"
                    name="user_aadhar_no"
                    value={team.user_aadhar_no}
                    onChange={onInputChange}
                    maxLength={12}
                    className="w-full px-4 py-3 border border-gray-400 rounded-md  transition-all"
                  />
                </div>
                {/* Aadhar File Upload */}
                <div>
                  <Input
                    label="Aadhar File"
                    type="file"
                    name="user_aadhar"
                    onChange={(e) => setSelectedFile1(e.target.files[0])}
                    className="w-full px-4 py-3 border border-gray-400 rounded-md transition-all"
                  />
                  <small className="text-gray-500">{team.user_aadhar}</small>
                </div>
                <div>
                  <InputMask
                    mask="aaaaa 9999 a"
                    value={team.user_pancard_no}
                    onChange={onInputChange}
                    name="user_pancard_no"
                    formatChars={{
                      9: "[0-9]",
                      a: "[A-Z]",
                    }}
                  >
                    {() => (
                      <div>
                        <Input
                          type="text"
                          label="PAN"
                          name="user_pancard_no"
                          className="w-full px-4 py-3 border border-gray-400 rounded-md  transition-all"
                        />
                      </div>
                    )}
                  </InputMask>
                </div>
                {/* Pancard File Upload */}
                <div>
                  <Input
                    label="PAN Photo"
                    type="file"
                    name="user_pancard"
                    onChange={(e) => setSelectedFile2(e.target.files[0])}
                    className="w-full px-4 py-3 border border-gray-400 rounded-md  transition-all"
                  />
                  <small className="text-gray-500">{team.user_pancard}</small>
                </div>
                <div>
                  <Input
                    label="Designation"
                    name="user_designation"
                    value={team.user_designation}
                    onChange={onInputChange}
                    className="w-full px-4 py-3 border border-gray-400 rounded-md  transition-all"
                  />
                </div>
                <FormControl fullWidth>
                  <InputLabel id="user_training-label">
                    <span className="text-sm relative bottom-[6px]">
                      Training Completed
                    </span>
                  </InputLabel>
                  <Select
                    sx={{ height: "40px", borderRadius: "5px" }}
                    labelId="user_training-label"
                    id="user_training"
                    name="user_training"
                    value={team.user_training}
                    onChange={(e) => onInputChange(e)}
                    label="Training Completed"
                  >
                    {training.map((item) => (
                      <MenuItem key={item.value} value={String(item.value)}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>{" "}
                {/* Remarks Field */}
                <div>
                  <Input
                    label="Trained By"
                    name="user_trained_bywhom"
                    value={team.user_trained_bywhom}
                    onChange={onInputChange}
                    className="w-full px-4 py-3 border border-gray-400 rounded-md  transition-all"
                  />
                </div>
                <div>
                  <Input
                    label="Last Training"
                    name="user_last_training"
                    value={team.user_last_training}
                    type="date"
                    onChange={onInputChange}
                    className="w-full px-4 py-3 border border-gray-400 rounded-md  transition-all"
                  />
                </div>
                <div>
                  <Input
                    label="Joining Date"
                    name="user_joinining_date"
                    type="date"
                    value={team.user_joinining_date}
                    onChange={onInputChange}
                    className="w-full px-4 py-3 border border-gray-400 rounded-md  transition-all"
                  />
                </div>
                <FormControl fullWidth>
                  <InputLabel id="service-select-label">
                    <span className="text-sm relative bottom-[6px]">
                      Status <span className="text-red-700">*</span>
                    </span>
                  </InputLabel>
                  <Select
                    sx={{ height: "40px", borderRadius: "5px" }}
                    labelId="service-select-label"
                    id="service-select"
                    name="status"
                    value={team.status}
                    onChange={onInputChange}
                    label="Status *"
                    required
                  >
                    {status.map((data) => (
                      <MenuItem key={data.value} value={data.value}>
                        {data.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {/* Remarks Field */}
                <div className="md:col-span-2">
                  <Textarea
                    label="Remarks"
                    name="remarks"
                    value={team.remarks}
                    onChange={onInputChange}
                    className="w-full px-4 py-3 border border-gray-400 rounded-md  transition-all"
                  ></Textarea>
                </div>
              </div>
              <div className="flex justify-center space-x-4 my-2">
                <ButtonConfigColor
                  type="edit"
                  buttontype="submit"
                  label="Update"
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
          </Card>
        </div>
      )}
    </Layout>
  );
};

export default BackhandEditTeamMaster;
