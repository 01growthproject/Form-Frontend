import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "../Components/Navbar/Navbar.jsx";
import CameraInput from "../Components/Admin/CameraInput.jsx";

import "./Styles/Form.css";

const VITE_API_URL_FORM = import.meta.env.VITE_API_URL_FORM;

const Form = () => {
  const [formData, setFormData] = useState({
    clientName: "",
    fatherName: "",
    gender: "",
    dob: "",
    age: "",
    phone: "",
    email: "",
    address: "",
    country: "",
    familyMembers: "",
    photo: null,
    // biometric: null, // 🚫 COMMENTED
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // INPUT CHANGE
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    const updatedValue = files ? files[0] : value;

    setFormData({
      ...formData,
      [name]: updatedValue,
    });

    setErrors({ ...errors, [name]: "" });

    console.log("Input changed:", name, updatedValue);
    console.log("Current formData:", { ...formData, [name]: updatedValue });
  };

  // PHONE ONLY DIGITS
  const handlePhoneChange = (e) => {
    const value = e.target.value;
    if (/^[0-9]*$/.test(value)) {
      setFormData({ ...formData, phone: value });
      setErrors({ ...errors, phone: "" });

      console.log("Phone input changed:", value);
      console.log("Current formData:", { ...formData, phone: value });
    }
  };

  // VALIDATION
  const validateForm = () => {
    const newErrors = {};

    if (!formData.clientName.trim()) newErrors.clientName = "Client name is required";
    if (!formData.fatherName.trim()) newErrors.fatherName = "Father name is required";
    if (!formData.gender) newErrors.gender = "Please select gender";
    if (!formData.age || Number(formData.age) < 1) newErrors.age = "Enter valid age";
    if (!formData.phone || formData.phone.length !== 10)
      newErrors.phone = "Phone must be 10 digits";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter valid email";
    }
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.country.trim()) newErrors.country = "Country is required";
    if (!formData.photo) newErrors.photo = "Photo is required";
    // if (!formData.biometric) newErrors.biometric = "Biometric file is required"; // 🚫 COMMENTED

    console.log("Validation errors:", newErrors);
    return newErrors;
  };

  // SUBMIT FORM
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Submitting form...");
    console.log("Current formData before validation:", formData);

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);

      // 🔹 Show specific error messages in toast
      const messages = Object.values(newErrors).join(", ");
      toast.error("Fix errors: " + messages);

      console.log("Form has errors. Submission stopped.");
      return;
    }

    try {
      setLoading(true);

      const form = new FormData();
      Object.keys(formData).forEach((key) => {
        form.append(key, formData[key]);
        console.log(`Appending to FormData: ${key}`, formData[key]);
      });

      const response = await axios.post(VITE_API_URL_FORM, form);
      console.log("Form submission response:", response.data);

      toast.success("Client saved successfully ✅");

      setFormData({
        clientName: "",
        fatherName: "",
        gender: "",
        dob: "",
        age: "",
        phone: "",
        email: "",
        address: "",
        country: "",
        familyMembers: "",
        photo: null,
        // biometric: null, // 🚫 COMMENTED
      });

      setErrors({});
      console.log("Form reset after submission.");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error.response?.data?.message || "Failed to submit form ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="form-wrapper">
        <div className="form-container">
          <div className="form-header">
            <h2>📋 Client Registration Form</h2>
            <p>Please fill all required fields</p>
          </div>

          <form onSubmit={handleSubmit} className="form">
            {/* Client Name + Father Name */}
            <div className="form-row">
              <div className="form-group">
                <label>Client Name *</label>
                <input
                  type="text"
                  name="clientName"
                  placeholder="Enter client name"
                  value={formData.clientName}
                  onChange={handleChange}
                  className={errors.clientName ? "input-error" : ""}
                />
                {errors.clientName && <p className="error">{errors.clientName}</p>}
              </div>

              <div className="form-group">
                <label>Father Name *</label>
                <input
                  type="text"
                  name="fatherName"
                  placeholder="Enter father name"
                  value={formData.fatherName}
                  onChange={handleChange}
                  className={errors.fatherName ? "input-error" : ""}
                />
                {errors.fatherName && <p className="error">{errors.fatherName}</p>}
              </div>
            </div>

            {/* Gender + DOB */}
            <div className="form-row">
              <div className="form-group">
                <label>Gender *</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={errors.gender ? "input-error" : ""}
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && <p className="error">{errors.gender}</p>}
              </div>

              <div className="form-group">
                <label>Date of Birth</label>
                <input type="date" name="dob" value={formData.dob} onChange={handleChange} />
              </div>
            </div>

            {/* Age + Phone */}
            <div className="form-row">
              <div className="form-group">
                <label>Age *</label>
                <input
                  type="number"
                  name="age"
                  min="1"
                  placeholder="Enter age"
                  value={formData.age}
                  onChange={handleChange}
                  className={errors.age ? "input-error" : ""}
                />
                {errors.age && <p className="error">{errors.age}</p>}
              </div>

              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="text"
                  name="phone"
                  placeholder="Enter 10 digit phone"
                  value={formData.phone}
                  maxLength="10"
                  onChange={handlePhoneChange}
                  className={errors.phone ? "input-error" : ""}
                />
                {errors.phone && <p className="error">{errors.phone}</p>}
              </div>
            </div>

            {/* Email + Address */}
            <div className="form-row">
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? "input-error" : ""}
                />
                {errors.email && <p className="error">{errors.email}</p>}
              </div>

              <div className="form-group">
                <label>Address *</label>
                <input
                  type="text"
                  name="address"
                  placeholder="Enter address"
                  value={formData.address}
                  onChange={handleChange}
                  className={errors.address ? "input-error" : ""}
                />
                {errors.address && <p className="error">{errors.address}</p>}
              </div>
            </div>

            {/* Country + Family Members */}
            <div className="form-row">
              <div className="form-group">
                <label>Country *</label>
                <input
                  type="text"
                  name="country"
                  placeholder="Enter country"
                  value={formData.country}
                  onChange={handleChange}
                  className={errors.country ? "input-error" : ""}
                />
                {errors.country && <p className="error">{errors.country}</p>}
              </div>

              <div className="form-group">
                <label>Family Members</label>
                <input
                  type="number"
                  name="familyMembers"
                  min="0"
                  placeholder="Enter family members"
                  value={formData.familyMembers}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Photo */}
            <CameraInput
              label="Live Photo *"
              name="photo"
              error={errors.photo}
              setFile={(file) => {
                setFormData({ ...formData, photo: file });
                setErrors({ ...errors, photo: "" });
                console.log("Photo selected:", file);
              }}
            />

            {/* 🚫 BIOMETRIC FIELD COMMENTED */}
            {/* <div className="form-group">
              <label>Biometric *</label>
              <input
                type="file"
                name="biometric"
                accept=".jpg,.png,.pdf"
                onChange={(e) => {
                  handleChange(e);
                  console.log("Biometric selected:", e.target.files[0]);
                }}
              />
              {errors.biometric && <p className="error">{errors.biometric}</p>}
            </div> */}

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Submitting..." : "✅ Submit Form"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Form;