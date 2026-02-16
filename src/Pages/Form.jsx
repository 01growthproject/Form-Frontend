import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "../Components/Navbar/Navbar.jsx";
import CameraInput from "../Components/Admin/CameraInput.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import "./Styles/Form.css";

const API = import.meta.env.VITE_API_URL_FORM;

const FormContent = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    /* BASIC */
    clientName: "",
    surname: "",
    contact: "",
    email: "",
    gender: "",
    dob: "",
    age: "",
    nationality: "",
    maritalStatus: "",
    education: "",
    occupation: "",
    address: "",
    familyMembersCount: 0,

    /* GOVERNMENT SERVANT INFO */
    hasGovtServant: "No",
    govtServantRelation: "",
    govtServantName: "",
    govtServantWorkType: "",
    govtServantDesignation: "",
    govtServantDepartment: "",

    /* FATHER */
    fatherName: "",
    fatherSurname: "",
    fatherPhone: "",
    fatherEmail: "",

    /* MOTHER */
    motherName: "",
    motherSurname: "",
    motherPhone: "",
    motherEmail: "",

    /* SPOUSE */
    spouseName: "",
    spouseSurname: "",
    spousePhone: "",
    spouseEmail: "",

    /* DOC NUMBERS */
    aadhaarCardNo: "",
    panCardNo: "",
    passportNo: "",
    drivingLicenseNo: "",
    voterCardNo: "",

    /* FILES */
    photo: null,
    documents: [],
  });

  const [documentsMeta, setDocumentsMeta] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const totalSteps = 6;

  const stepTitles = [
    "Basic Information",
    "Document Numbers",
    "Family Details",
    "Document Capture",
    "Passport Size Photo",
    "Review & Submit"
  ];

  /* ======================
     VALIDATION FUNCTIONS
  ====================== */

  // Email validation
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Phone validation (10 digits)
  const isValidPhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  // Aadhaar validation (12 digits)
  const isValidAadhaar = (aadhaar) => {
    const aadhaarRegex = /^[0-9]{12}$/;
    return aadhaarRegex.test(aadhaar);
  };

  // PAN validation (ABCDE1234F format)
  const isValidPAN = (pan) => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan.toUpperCase());
  };

  // Passport validation (8-9 alphanumeric characters)
  const isValidPassport = (passport) => {
    const passportRegex = /^[A-Z0-9]{8,9}$/;
    return passportRegex.test(passport.toUpperCase());
  };

  // Driving License validation
  const isValidDrivingLicense = (license) => {
    const licenseRegex = /^[A-Z]{2}[0-9]{13}$/;
    return licenseRegex.test(license.toUpperCase());
  };

  // Voter Card validation
  const isValidVoterCard = (voterCard) => {
    const voterRegex = /^[A-Z]{3}[0-9]{7}$/;
    return voterRegex.test(voterCard.toUpperCase());
  };

  // Age validation
  const isValidAge = (age) => {
    const ageNum = parseInt(age);
    return ageNum >= 1 && ageNum <= 120;
  };

  // Name validation (only letters and spaces)
  const isValidName = (name) => {
    const nameRegex = /^[a-zA-Z\s]+$/;
    return nameRegex.test(name) && name.trim().length >= 2;
  };

  // Calculate age from DOB
  const calculateAge = (dob) => {
    if (!dob) return "";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age.toString();
  };

  /* ======================
     VALIDATE INDIVIDUAL FIELD
  ====================== */
  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      // Basic Information
      case 'clientName':
      case 'surname':
        if (!value.trim()) {
          error = 'This field is required';
        } else if (!isValidName(value)) {
          error = 'Only letters and spaces allowed (min 2 characters)';
        }
        break;

      case 'contact':
        if (!value.trim()) {
          error = 'Contact number is required';
        } else if (!isValidPhone(value)) {
          error = 'Enter valid 10-digit phone number';
        }
        break;

      case 'email':
        if (value.trim() && !isValidEmail(value)) {
          error = 'Enter valid email address';
        }
        break;

      case 'dob':
        if (!value) {
          error = 'Date of birth is required';
        } else {
          const birthDate = new Date(value);
          const today = new Date();
          if (birthDate > today) {
            error = 'Date cannot be in the future';
          }
        }
        break;

      case 'age':
        if (!value) {
          error = 'Age is required';
        } else if (!isValidAge(value)) {
          error = 'Enter valid age (1-120)';
        }
        break;

      case 'gender':
        if (!value) {
          error = 'Gender is required';
        }
        break;

      case 'maritalStatus':
        if (!value) {
          error = 'Marital status is required';
        }
        break;

      case 'nationality':
        if (!value.trim()) {
          error = 'Nationality is required';
        } else if (!isValidName(value)) {
          error = 'Enter valid nationality';
        }
        break;

      case 'education':
        if (value.trim() && !isValidName(value)) {
          error = 'Only letters and spaces allowed';
        }
        break;

      case 'familyMembersCount':
        if (value && (parseInt(value) < 0 || parseInt(value) > 50)) {
          error = 'Enter valid number (0-50)';
        }
        break;

      // Government Servant Fields
      case 'hasGovtServant':
        if (!value) {
          error = 'Please select an option';
        }
        break;

      case 'govtServantRelation':
        if (value && !value.trim()) {
          error = 'Please select relation';
        }
        break;

      case 'govtServantName':
        if (value && !isValidName(value)) {
          error = 'Only letters and spaces allowed (min 2 characters)';
        }
        break;

      case 'govtServantWorkType':
        if (value && !value.trim()) {
          error = 'Please select work type';
        }
        break;

      case 'govtServantDesignation':
        if (value && value.trim().length < 2) {
          error = 'Enter valid designation (min 2 characters)';
        }
        break;

      case 'govtServantDepartment':
        if (value && value.trim().length < 2) {
          error = 'Enter valid department name (min 2 characters)';
        }
        break;

      // Document Numbers
      case 'aadhaarCardNo':
        if (!value.trim()) {
          error = 'Aadhaar number is required';
        } else if (!isValidAadhaar(value)) {
          error = 'Enter valid 12-digit Aadhaar number';
        }
        break;

      case 'panCardNo':
        if (!value.trim()) {
          error = 'PAN number is required';
        } else if (!isValidPAN(value)) {
          error = 'Enter valid PAN (e.g., ABCDE1234F)';
        }
        break;

      case 'passportNo':
        if (value.trim() && !isValidPassport(value)) {
          error = 'Enter valid passport number (8-9 characters)';
        }
        break;

      case 'drivingLicenseNo':
        if (value.trim() && !isValidDrivingLicense(value)) {
          error = 'Enter valid license (e.g., MH1234567890123)';
        }
        break;

      case 'voterCardNo':
        if (value.trim() && !isValidVoterCard(value)) {
          error = 'Enter valid voter card (e.g., ABC1234567)';
        }
        break;

      // Family Details
      case 'fatherName':
      case 'fatherSurname':
      case 'motherName':
      case 'motherSurname':
        if (!value.trim()) {
          error = 'This field is required';
        } else if (!isValidName(value)) {
          error = 'Only letters and spaces allowed (min 2 characters)';
        }
        break;

      case 'fatherPhone':
      case 'motherPhone':
        if (!value.trim()) {
          error = 'Phone number is required';
        } else if (!isValidPhone(value)) {
          error = 'Enter valid 10-digit phone number';
        }
        break;

      case 'fatherEmail':
      case 'motherEmail':
      case 'spouseEmail':
        if (value.trim() && !isValidEmail(value)) {
          error = 'Enter valid email address';
        }
        break;

      case 'spouseName':
      case 'spouseSurname':
        if (value.trim() && !isValidName(value)) {
          error = 'Only letters and spaces allowed (min 2 characters)';
        }
        break;

      case 'spousePhone':
        if (value.trim() && !isValidPhone(value)) {
          error = 'Enter valid 10-digit phone number';
        }
        break;

      default:
        break;
    }

    return error;
  };

  /* ======================
     HANDLE CHANGE
  ====================== */
  const handleChange = (e) => {
    const { name, value } = e.target;

    console.log("🟢 Field Changed:", name, "=>", value);

    // If DOB changes, auto-calculate age
    if (name === "dob") {
      const calculatedAge = calculateAge(value);

      console.log("📌 DOB Selected:", value);
      console.log("🎯 Auto Age Calculated:", calculatedAge);

      setFormData((prev) => ({
        ...prev,
        [name]: value,
        age: calculatedAge,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      console.log("🧹 Clearing Error for:", name);
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };


  /* ======================
     HANDLE BLUR (VALIDATE ON BLUR)
  ====================== */
  const handleBlur = (e) => {
    const { name, value } = e.target;

    console.log("🟡 Blur Event:", name);

    const error = validateField(name, value);

    if (error) {
      console.log("❌ Validation Error:", error);

      setErrors((prev) => ({ ...prev, [name]: error }));
    } else {
      console.log("✅ Field Valid:", name);

      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };


  /* ======================
     VALIDATE STEP
  ====================== */
  const validateStep = (step) => {
    const newErrors = {};
    let isValid = true;

    switch (step) {
      case 1: // Basic Information
        const basicFields = [
          'clientName', 'surname', 'contact', 'dob', 'age',
          'gender', 'maritalStatus', 'nationality', 'hasGovtServant'
        ];

        basicFields.forEach(field => {
          const error = validateField(field, formData[field]);
          if (error) {
            newErrors[field] = error;
            isValid = false;
          }
        });

        // Validate govt servant details if "Yes" is selected
        if (formData.hasGovtServant === "Yes") {
          // Required fields when "Yes" is selected
          if (!formData.govtServantRelation || !formData.govtServantRelation.trim()) {
            newErrors.govtServantRelation = 'Relation is required';
            isValid = false;
          }

          if (!formData.govtServantName || !formData.govtServantName.trim()) {
            newErrors.govtServantName = 'Name is required';
            isValid = false;
          } else {
            const nameError = validateField('govtServantName', formData.govtServantName);
            if (nameError) {
              newErrors.govtServantName = nameError;
              isValid = false;
            }
          }

          if (!formData.govtServantWorkType || !formData.govtServantWorkType.trim()) {
            newErrors.govtServantWorkType = 'Work type is required';
            isValid = false;
          }

          // Optional fields - validate only if provided
          if (formData.govtServantDesignation) {
            const error = validateField('govtServantDesignation', formData.govtServantDesignation);
            if (error) {
              newErrors.govtServantDesignation = error;
              isValid = false;
            }
          }

          if (formData.govtServantDepartment) {
            const error = validateField('govtServantDepartment', formData.govtServantDepartment);
            if (error) {
              newErrors.govtServantDepartment = error;
              isValid = false;
            }
          }
        }

        // Validate optional email if provided
        if (formData.email) {
          const emailError = validateField('email', formData.email);
          if (emailError) {
            newErrors.email = emailError;
            isValid = false;
          }
        }

        // Validate optional fields if provided
        if (formData.education) {
          const educationError = validateField('education', formData.education);
          if (educationError) {
            newErrors.education = educationError;
            isValid = false;
          }
        }

        if (formData.familyMembersCount) {
          const familyError = validateField('familyMembersCount', formData.familyMembersCount);
          if (familyError) {
            newErrors.familyMembersCount = familyError;
            isValid = false;
          }
        }
        break;

      case 2: // Document Numbers
        // Required documents
        const requiredDocs = ['aadhaarCardNo', 'panCardNo'];
        requiredDocs.forEach(field => {
          const error = validateField(field, formData[field]);
          if (error) {
            newErrors[field] = error;
            isValid = false;
          }
        });

        // Optional documents - validate only if provided
        const optionalDocs = ['passportNo', 'drivingLicenseNo', 'voterCardNo'];
        optionalDocs.forEach(field => {
          if (formData[field]) {
            const error = validateField(field, formData[field]);
            if (error) {
              newErrors[field] = error;
              isValid = false;
            }
          }
        });
        break;

      case 3: // Family Details
        const familyFields = [
          'fatherName', 'fatherSurname', 'fatherPhone',
          'motherName', 'motherSurname', 'motherPhone'
        ];

        familyFields.forEach(field => {
          const error = validateField(field, formData[field]);
          if (error) {
            newErrors[field] = error;
            isValid = false;
          }
        });

        // Validate optional emails if provided
        if (formData.fatherEmail) {
          const error = validateField('fatherEmail', formData.fatherEmail);
          if (error) {
            newErrors.fatherEmail = error;
            isValid = false;
          }
        }

        if (formData.motherEmail) {
          const error = validateField('motherEmail', formData.motherEmail);
          if (error) {
            newErrors.motherEmail = error;
            isValid = false;
          }
        }

        // Validate spouse details if married and provided
        if (formData.maritalStatus === "Married") {
          if (formData.spouseName) {
            const error = validateField('spouseName', formData.spouseName);
            if (error) {
              newErrors.spouseName = error;
              isValid = false;
            }
          }
          if (formData.spouseSurname) {
            const error = validateField('spouseSurname', formData.spouseSurname);
            if (error) {
              newErrors.spouseSurname = error;
              isValid = false;
            }
          }
          if (formData.spousePhone) {
            const error = validateField('spousePhone', formData.spousePhone);
            if (error) {
              newErrors.spousePhone = error;
              isValid = false;
            }
          }
          if (formData.spouseEmail) {
            const error = validateField('spouseEmail', formData.spouseEmail);
            if (error) {
              newErrors.spouseEmail = error;
              isValid = false;
            }
          }
        }
        break;

      case 4: // Document Capture
        // Documents are optional
        isValid = true;
        break;

      case 5: // Passport Size Photo
        if (!formData.photo) {
          newErrors.photo = 'Passport photo is required';
          isValid = false;
        }
        break;

      default:
        isValid = true;
    }

    setErrors(newErrors);
    return isValid;
  };

  /* ======================
     DOCUMENT CAPTURE (LIVE)
  ====================== */
  const handleDocumentCapture = (type, file) => {

    console.log("📸 Document Captured:", type);
    console.log("📂 File Object:", file);

    const existingIndex = documentsMeta.findIndex(doc => doc.documentType === type);

    console.log("🔍 Existing Index:", existingIndex);

    if (existingIndex !== -1) {
      const updatedMeta = [...documentsMeta];
      updatedMeta[existingIndex] = { documentType: type };
      setDocumentsMeta(updatedMeta);

      const updatedDocs = [...formData.documents];
      updatedDocs[existingIndex] = file;
      setFormData(prev => ({
        ...prev,
        documents: updatedDocs
      }));
    } else {
      setDocumentsMeta(prev => [
        ...prev,
        { documentType: type }
      ]);

      setFormData(prev => ({
        ...prev,
        documents: [...prev.documents, file]
      }));
    }
  };

  /* ======================
     NAVIGATION
  ====================== */
  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      toast.error('Please fix all errors before proceeding');
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToStep = (step) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* ======================
     SUBMIT
  ====================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("🚀 SUBMIT STARTED");
    console.log("📌 Final FormData:", formData);
    console.log("📌 Documents Meta:", documentsMeta);

    // Validate all steps before submission
    let allValid = true;
    for (let i = 1; i <= 5; i++) {
      if (!validateStep(i)) {
        console.log("❌ Validation Failed at Step:", i);
        allValid = false;
        toast.error(`Please complete Step ${i} correctly`);
        setCurrentStep(i);
        return;
      }
    }

    if (!allValid) {
      return;
    }

    try {
      setLoading(true);
      const data = new FormData();

      Object.keys(formData).forEach(key => {
        if (key !== "documents") data.append(key, formData[key]);
      });

      data.append("documents", JSON.stringify(documentsMeta));
      formData.documents.forEach(doc => data.append("documents", doc));

      console.log("📤 Sending Data to Backend...");
      console.log("📌 API URL:", API);

      await axios.post(API, data, {
        headers: { "Content-Type": "multipart/form-data" }
      });


      console.log("✅ Form Submitted Successfully!");

      toast.success("Client Registered Successfully ✅");

      // Reset form
      setFormData({
        clientName: "",
        surname: "",
        contact: "",
        email: "",
        gender: "",
        dob: "",
        age: "",
        nationality: "",
        maritalStatus: "",
        education: "",
        occupation: "",
        address: "",
        familyMembersCount: 0,
        hasGovtServant: "No",
        govtServantRelation: "",
        govtServantName: "",
        govtServantWorkType: "",
        govtServantDesignation: "",
        govtServantDepartment: "",
        fatherName: "",
        fatherSurname: "",
        fatherPhone: "",
        fatherEmail: "",
        motherName: "",
        motherSurname: "",
        motherPhone: "",
        motherEmail: "",
        spouseName: "",
        spouseSurname: "",
        spousePhone: "",
        spouseEmail: "",
        aadhaarCardNo: "",
        panCardNo: "",
        passportNo: "",
        drivingLicenseNo: "",
        voterCardNo: "",
        photo: null,
        documents: [],
      });
      setDocumentsMeta([]);
      setErrors({});
      setCurrentStep(1);

    } catch (err) {

      console.log("❌ Submission Failed:", err);
      toast.error(err.response?.data?.message || "Error ❌");
    }
    finally {
      setLoading(false);
    }
  };

  /* ======================
     RENDER STEP CONTENT
  ====================== */
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="form-section active">
            <h3 className="section-title">Basic Information</h3>

            <div className="form-row">
              <div className="form-group">
                <label>Client Name</label>
                <input
                  name="clientName"
                  placeholder="Enter client name"
                  value={formData.clientName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.clientName ? 'error' : ''}
                  required
                />
                {errors.clientName && <span className="error-message">{errors.clientName}</span>}
              </div>

              <div className="form-group">
                <label>Surname</label>
                <input
                  name="surname"
                  placeholder="Enter surname"
                  value={formData.surname}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.surname ? 'error' : ''}
                  required
                />
                {errors.surname && <span className="error-message">{errors.surname}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Contact Number</label>
                <input
                  name="contact"
                  placeholder="Enter 10-digit contact number"
                  value={formData.contact}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.contact ? 'error' : ''}
                  maxLength="10"
                  required
                />
                {errors.contact && <span className="error-message">{errors.contact}</span>}
              </div>

              <div className="form-group">
                <label className="optional">Email</label>
                <input
                  name="email"
                  type="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.dob ? 'error' : ''}
                  max={new Date().toISOString().split('T')[0]}
                  required
                />
                {errors.dob && <span className="error-message">{errors.dob}</span>}
              </div>

              <div className="form-group">
                <label>Age </label>
                <input
                  placeholder="Enter Age"
                  value={formData.age}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.age ? 'error' : ''}
                  min="1"
                  max="120"
                  readOnly
                  required
                />
                {errors.age && <span className="error-message">{errors.age}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Gender </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.gender ? 'error' : ''}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && <span className="error-message">{errors.gender}</span>}
              </div>

              <div className="form-group">
                <label>Marital Status </label>
                <select
                  name="maritalStatus"
                  value={formData.maritalStatus}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.maritalStatus ? 'error' : ''}
                  required
                >
                  <option value="">Select Status</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Separated">Separated</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </select>
                {errors.maritalStatus && <span className="error-message">{errors.maritalStatus}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="optional">Education</label>
                <input
                  name="education"
                  placeholder="Enter education"
                  value={formData.education}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.education ? 'error' : ''}
                />
                {errors.education && <span className="error-message">{errors.education}</span>}
              </div>

              <div className="form-group">
                <label className="optional">Occupation</label>
                <input
                  name="occupation"
                  placeholder="Enter occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Nationality </label>
                <input
                  name="nationality"
                  placeholder="Enter nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.nationality ? 'error' : ''}
                  required
                />
                {errors.nationality && <span className="error-message">{errors.nationality}</span>}
              </div>

              <div className="form-group">
                <label className="optional">Family Members</label>
                <input
                  name="familyMembersCount"
                  type="number"
                  placeholder="Number of family members"
                  value={formData.familyMembersCount}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.familyMembersCount ? 'error' : ''}
                  min="0"
                  max="50"
                />
                {errors.familyMembersCount && <span className="error-message">{errors.familyMembersCount}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group full-width">
                <label className="optional">Address</label>
                <textarea
                  name="address"
                  placeholder="Enter complete address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                />
              </div>
            </div>

            {/* GOVERNMENT SERVANT SECTION */}
            <h3 className="section-title" style={{ marginTop: '30px', borderTop: '2px solid #e0e0e0', paddingTop: '20px' }}>
              🏛️ Government Servant Information
            </h3>

            <div className="form-row">
              <div className="form-group">
                <label>Any Family Member is Government Servant?</label>
                <select
                  name="hasGovtServant"
                  value={formData.hasGovtServant}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.hasGovtServant ? 'error' : ''}
                  required
                >
                  <option value="">Select Option</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
                {errors.hasGovtServant && <span className="error-message">{errors.hasGovtServant}</span>}
              </div>
            </div>

            {formData.hasGovtServant === "Yes" && (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label>Relation with You</label>
                    <select
                      name="govtServantRelation"
                      value={formData.govtServantRelation}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={errors.govtServantRelation ? 'error' : ''}
                      required
                    >
                      <option value="">Select Relation</option>
                      <option value="Father">Father</option>
                      <option value="Mother">Mother</option>
                      <option value="Spouse">Spouse (Husband/Wife)</option>
                      <option value="Brother">Brother</option>
                      <option value="Sister">Sister</option>
                      <option value="Son">Son</option>
                      <option value="Daughter">Daughter</option>
                      <option value="Uncle">Uncle</option>
                      <option value="Aunt">Aunt</option>
                      <option value="Grandfather">Grandfather</option>
                      <option value="Grandmother">Grandmother</option>
                      <option value="Other">Other Relative</option>
                    </select>
                    {errors.govtServantRelation && <span className="error-message">{errors.govtServantRelation}</span>}
                  </div>

                  <div className="form-group">
                    <label>Name of Government Servant</label>
                    <input
                      name="govtServantName"
                      placeholder="Enter full name"
                      value={formData.govtServantName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={errors.govtServantName ? 'error' : ''}
                      required
                    />
                    {errors.govtServantName && <span className="error-message">{errors.govtServantName}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Work Type / Organization</label>
                    <select
                      name="govtServantWorkType"
                      value={formData.govtServantWorkType}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={errors.govtServantWorkType ? 'error' : ''}
                      required
                    >
                      <option value="">Select Work Type</option>
                      <option value="Central Government">Central Government</option>
                      <option value="State Government">State Government</option>
                      <option value="PSU (Public Sector Undertaking)">PSU (Public Sector Undertaking)</option>
                      <option value="Indian Army">Indian Army</option>
                      <option value="Indian Navy">Indian Navy</option>
                      <option value="Indian Air Force">Indian Air Force</option>
                      <option value="Police Department">Police Department</option>
                      <option value="Railway">Railway</option>
                      <option value="Banking Sector">Banking Sector (Government)</option>
                      <option value="Teaching (Government School/College)">Teaching (Government School/College)</option>
                      <option value="Medical (Government Hospital)">Medical (Government Hospital)</option>
                      <option value="Judiciary">Judiciary</option>
                      <option value="Municipal Corporation">Municipal Corporation</option>
                      <option value="Other Government Department">Other Government Department</option>
                    </select>
                    {errors.govtServantWorkType && <span className="error-message">{errors.govtServantWorkType}</span>}
                  </div>

                  <div className="form-group">
                    <label className="optional">Designation / Post</label>
                    <input
                      name="govtServantDesignation"
                      placeholder="e.g., Deputy Collector, Teacher, Inspector"
                      value={formData.govtServantDesignation}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={errors.govtServantDesignation ? 'error' : ''}
                    />
                    {errors.govtServantDesignation && <span className="error-message">{errors.govtServantDesignation}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    {/* <label className="optional">Department / Office Name</label>
                    <input
                      name="govtServantDepartment"
                      placeholder="e.g., Education Department, Police HQ, Railway Board"
                      value={formData.govtServantDepartment}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={errors.govtServantDepartment ? 'error' : ''}
                    /> */}
                    {errors.govtServantDepartment && <span className="error-message">{errors.govtServantDepartment}</span>}
                  </div>
                </div>
              </>
            )}
          </div>
        );

      case 2:
        return (
          <div className="form-section active">
            <h3 className="section-title">Document Numbers</h3>

            <div className="form-row">
              <div className="form-group">
                <label>Aadhaar Card No </label>
                <input
                  name="aadhaarCardNo"
                  placeholder="Enter 12-digit Aadhaar number"
                  value={formData.aadhaarCardNo}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.aadhaarCardNo ? 'error' : ''}
                  maxLength="12"
                  required
                />
                {errors.aadhaarCardNo && <span className="error-message">{errors.aadhaarCardNo}</span>}
              </div>

              <div className="form-group">
                <label>PAN Card No </label>
                <input
                  name="panCardNo"
                  placeholder="Enter Pan (e.g., ABCDE1234F)"
                  value={formData.panCardNo}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.panCardNo ? 'error' : ''}
                  maxLength="10"
                  required
                />
                {errors.panCardNo && <span className="error-message">{errors.panCardNo}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Passport No</label>
                <input
                  name="passportNo"
                  placeholder="Enter Passport Number"
                  value={formData.passportNo}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.passportNo ? 'error' : ''}
                  maxLength="9"
                  required
                />
                {errors.passportNo && <span className="error-message">{errors.passportNo}</span>}
              </div>

              <div className="form-group">
                <label className="optional">Driving License No</label>
                <input
                  name="drivingLicenseNo"
                  placeholder="Enter License (e.g., MH1234567890123)"
                  value={formData.drivingLicenseNo}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.drivingLicenseNo ? 'error' : ''}
                  maxLength="15"
                />
                {errors.drivingLicenseNo && <span className="error-message">{errors.drivingLicenseNo}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="optional">Voter Card No</label>
                <input
                  name="voterCardNo"
                  placeholder="Enter Voter Card (e.g., ABC1234567)"
                  value={formData.voterCardNo}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.voterCardNo ? 'error' : ''}
                  maxLength="10"
                />
                {errors.voterCardNo && <span className="error-message">{errors.voterCardNo}</span>}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="form-section active">
            <h3 className="section-title">Father Details</h3>

            <div className="form-row">
              <div className="form-group">
                <label>Father Name</label>
                <input
                  name="fatherName"
                  placeholder="Enter father's name"
                  value={formData.fatherName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.fatherName ? 'error' : ''}
                  required
                />
                {errors.fatherName && <span className="error-message">{errors.fatherName}</span>}
              </div>

              <div className="form-group">
                <label>Father Surname </label>
                <input
                  name="fatherSurname"
                  placeholder="Enter father's surname"
                  value={formData.fatherSurname}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.fatherSurname ? 'error' : ''}
                  required
                />
                {errors.fatherSurname && <span className="error-message">{errors.fatherSurname}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Father Phone </label>
                <input
                  name="fatherPhone"
                  placeholder="Enter 10-digit phone number"
                  value={formData.fatherPhone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.fatherPhone ? 'error' : ''}
                  maxLength="10"
                  required
                />
                {errors.fatherPhone && <span className="error-message">{errors.fatherPhone}</span>}
              </div>

              <div className="form-group">
                <label>Father Email</label>
                <input
                  name="fatherEmail"
                  type="email"
                  placeholder="Enter father's email"
                  value={formData.fatherEmail}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.fatherEmail ? 'error' : ''}
                  required
                />
                {errors.fatherEmail && <span className="error-message">{errors.fatherEmail}</span>}
              </div>
            </div>

            <h3 className="section-title" style={{ marginTop: '30px' }}>Mother Details</h3>

            <div className="form-row">
              <div className="form-group">
                <label>Mother Name</label>
                <input
                  name="motherName"
                  placeholder="Enter mother's name"
                  value={formData.motherName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.motherName ? 'error' : ''}
                  required
                />
                {errors.motherName && <span className="error-message">{errors.motherName}</span>}
              </div>

              <div className="form-group">
                <label>Mother Surname</label>
                <input
                  name="motherSurname"
                  placeholder="Enter mother's surname"
                  value={formData.motherSurname}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.motherSurname ? 'error' : ''}
                  required
                />
                {errors.motherSurname && <span className="error-message">{errors.motherSurname}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Mother Phone</label>
                <input
                  name="motherPhone"
                  placeholder="Enter 10-digit phone number"
                  value={formData.motherPhone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.motherPhone ? 'error' : ''}
                  maxLength="10"
                  required
                />
                {errors.motherPhone && <span className="error-message">{errors.motherPhone}</span>}
              </div>

              <div className="form-group">
                <label className="optional">Mother Email</label>
                <input
                  name="motherEmail"
                  type="email"
                  placeholder="Enter mother's email"
                  value={formData.motherEmail}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.motherEmail ? 'error' : ''}
                />
                {errors.motherEmail && <span className="error-message">{errors.motherEmail}</span>}
              </div>
            </div>

            {formData.maritalStatus === "Married" && (
              <>
                <h3 className="section-title" style={{ marginTop: '30px' }}>Spouse Details</h3>

                <div className="form-row">
                  <div className="form-group">
                    <label className="optional">Spouse Name</label>
                    <input
                      name="spouseName"
                      placeholder="Enter spouse's name"
                      value={formData.spouseName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={errors.spouseName ? 'error' : ''}
                    />
                    {errors.spouseName && <span className="error-message">{errors.spouseName}</span>}
                  </div>

                  <div className="form-group">
                    <label className="optional">Spouse Surname</label>
                    <input
                      name="spouseSurname"
                      placeholder="Enter spouse's surname"
                      value={formData.spouseSurname}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={errors.spouseSurname ? 'error' : ''}
                    />
                    {errors.spouseSurname && <span className="error-message">{errors.spouseSurname}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="optional">Spouse Phone</label>
                    <input
                      name="spousePhone"
                      placeholder="Enter 10-digit phone number"
                      value={formData.spousePhone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={errors.spousePhone ? 'error' : ''}
                      maxLength="10"
                    />
                    {errors.spousePhone && <span className="error-message">{errors.spousePhone}</span>}
                  </div>

                  <div className="form-group">
                    <label className="optional">Spouse Email</label>
                    <input
                      name="spouseEmail"
                      type="email"
                      placeholder="Enter spouse's email"
                      value={formData.spouseEmail}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={errors.spouseEmail ? 'error' : ''}
                    />
                    {errors.spouseEmail && <span className="error-message">{errors.spouseEmail}</span>}
                  </div>
                </div>
              </>
            )}
          </div>
        );

      case 4:
        return (
          <div className="form-section active">
            <h3 className="section-title">📸 Live Document Capture</h3>
            <p className="hint">Capture all documents using your camera (Front & Back where applicable)</p>

            <div className="documents-grid">
              <div className="document-capture-item">
                <CameraInput
                  label="Aadhaar Front *"
                  setFile={(file) => handleDocumentCapture("AadhaarFront", file)}
                  required
                />
              </div>

              <div className="document-capture-item">
                <CameraInput
                  label="Aadhaar Back *"
                  setFile={(file) => handleDocumentCapture("AadhaarBack", file)}
                />
              </div>

              <div className="document-capture-item">
                <CameraInput
                  label="Capture PAN Card *"
                  setFile={(file) => handleDocumentCapture("PANCard", file)}
                />
              </div>

              <div className="document-capture-item">
                <CameraInput
                  label="Capture Passport Front *"
                  setFile={(file) => handleDocumentCapture("PassportFront", file)}
                />
              </div>

              <div className="document-capture-item">
                <CameraInput
                  label="Capture Passport Back *"
                  setFile={(file) => handleDocumentCapture("PassportBack", file)}
                />
              </div>

              <div className="document-capture-item">
                <CameraInput
                  label="Capture License Front"
                  setFile={(file) => handleDocumentCapture("DrivingLicenseFront", file)}
                />
              </div>

              <div className="document-capture-item">
                <CameraInput
                  label="Capture License Back"
                  setFile={(file) => handleDocumentCapture("DrivingLicenseBack", file)}
                />
              </div>

              <div className="document-capture-item">
                <CameraInput
                  label="Capture Voter Card Front"
                  setFile={(file) => handleDocumentCapture("VoterCardFront", file)}
                />
              </div>

              <div className="document-capture-item">
                <CameraInput
                  label="Capture Voter Card Back"
                  setFile={(file) => handleDocumentCapture("VoterCardBack", file)}
                />
              </div>

              <div className="document-capture-item">
                <CameraInput
                  label="Capture Marksheet Front"
                  setFile={(file) => handleDocumentCapture("MarksheetFront", file)}
                />
              </div>

              <div className="document-capture-item">
                <CameraInput
                  label="Capture Marksheet Back"
                  setFile={(file) => handleDocumentCapture("MarksheetBack", file)}
                />
              </div>

              <div className="document-capture-item">
                <CameraInput
                  label="Capture CV Page 1"
                  setFile={(file) => handleDocumentCapture("CVPage1", file)}
                />
              </div>

              <div className="document-capture-item">
                <CameraInput
                  label="Capture CV Page 2"
                  setFile={(file) => handleDocumentCapture("CVPage2", file)}
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="form-section active">
            <h3 className="section-title">👤 Live Photo</h3>
            <p className="hint">Capture client's passport size photo (35mm x 45mm ratio)</p>
            {errors.photo && <span className="error-message" style={{ display: 'block', marginBottom: '10px' }}>{errors.photo}</span>}
            <div className="passport-photo-container">
              <div className="passport-photo-frame">
                <CameraInput
                  label="Capture Photo"
                  setFile={(file) => {
                    setFormData(prev => ({ ...prev, photo: file }));
                    setErrors(prev => ({ ...prev, photo: '' }));
                  }}
                  isPassportSize={true}
                />
              </div>
              <div className="passport-guidelines">
                <p>📏 <strong>Guidelines:</strong></p>
                <ul>
                  <li>Face should be clearly visible</li>
                  <li>Plain white or light background</li>
                  <li>No glasses or hat</li>
                  <li>Neutral expression</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="form-section active">
            <h3 className="section-title">📋 Review & Submit</h3>
            <div className="review-section">

              {/* BASIC INFORMATION */}
              <div className="review-card">
                <h4>Basic Information</h4>
                <div className="review-item">
                  <span>Full Name:</span>
                  <strong>{formData.clientName} {formData.surname}</strong>
                </div>
                <div className="review-item">
                  <span>Contact:</span>
                  <strong>{formData.contact || 'N/A'}</strong>
                </div>
                <div className="review-item">
                  <span>Email:</span>
                  <strong>{formData.email || 'N/A'}</strong>
                </div>
                <div className="review-item">
                  <span>Date of Birth:</span>
                  <strong>{formData.dob || 'N/A'}</strong>
                </div>
                <div className="review-item">
                  <span>Age:</span>
                  <strong>{formData.age || 'N/A'}</strong>
                </div>
                <div className="review-item">
                  <span>Gender:</span>
                  <strong>{formData.gender || 'N/A'}</strong>
                </div>
                <div className="review-item">
                  <span>Marital Status:</span>
                  <strong>{formData.maritalStatus || 'N/A'}</strong>
                </div>
                <div className="review-item">
                  <span>Nationality:</span>
                  <strong>{formData.nationality || 'N/A'}</strong>
                </div>
                <div className="review-item">
                  <span>Education:</span>
                  <strong>{formData.education || 'N/A'}</strong>
                </div>
                <div className="review-item">
                  <span>Occupation:</span>
                  <strong>{formData.occupation || 'N/A'}</strong>
                </div>
                <div className="review-item">
                  <span>Family Members:</span>
                  <strong>{formData.familyMembersCount || 0}</strong>
                </div>
                <div className="review-item">
                  <span>Address:</span>
                  <strong>{formData.address || 'N/A'}</strong>
                </div>
                <button className="edit-btn" onClick={() => goToStep(1)}>Edit</button>
              </div>

              {/* GOVERNMENT SERVANT INFORMATION */}
              <div className="review-card">
                <h4>🏛️ Government Servant Information</h4>
                <div className="review-item">
                  <span>Family Member in Govt Service:</span>
                  <strong>{formData.hasGovtServant || 'N/A'}</strong>
                </div>
                
                {formData.hasGovtServant === "Yes" && (
                  <>
                    <div className="review-item">
                      <span>Relation:</span>
                      <strong>{formData.govtServantRelation || 'N/A'}</strong>
                    </div>
                    <div className="review-item">
                      <span>Name:</span>
                      <strong>{formData.govtServantName || 'N/A'}</strong>
                    </div>
                    <div className="review-item">
                      <span>Work Type:</span>
                      <strong>{formData.govtServantWorkType || 'N/A'}</strong>
                    </div>
                    <div className="review-item">
                      <span>Designation:</span>
                      <strong>{formData.govtServantDesignation || 'N/A'}</strong>
                    </div>
                    <div className="review-item">
                      <span>Department:</span>
                      <strong>{formData.govtServantDepartment || 'N/A'}</strong>
                    </div>
                  </>
                )}
                
                {formData.hasGovtServant === "No" && (
                  <div className="review-item">
                    <span>Status:</span>
                    <strong>No family member in government service</strong>
                  </div>
                )}
                
                <button className="edit-btn" onClick={() => goToStep(1)}>Edit</button>
              </div>

              {/* DOCUMENT NUMBERS */}
              <div className="review-card">
                <h4>Document Numbers</h4>
                <div className="review-item">
                  <span>Aadhaar Card No:</span>
                  <strong>{formData.aadhaarCardNo || 'N/A'}</strong>
                </div>
                <div className="review-item">
                  <span>PAN Card No:</span>
                  <strong>{formData.panCardNo || 'N/A'}</strong>
                </div>
                <div className="review-item">
                  <span>Passport No:</span>
                  <strong>{formData.passportNo || 'N/A'}</strong>
                </div>
                <div className="review-item">
                  <span>Driving License No:</span>
                  <strong>{formData.drivingLicenseNo || 'N/A'}</strong>
                </div>
                <div className="review-item">
                  <span>Voter Card No:</span>
                  <strong>{formData.voterCardNo || 'N/A'}</strong>
                </div>
                <button className="edit-btn" onClick={() => goToStep(2)}>Edit</button>
              </div>

              {/* FATHER DETAILS */}
              <div className="review-card">
                <h4>Father Details</h4>
                <div className="review-item">
                  <span>Name:</span>
                  <strong>{formData.fatherName} {formData.fatherSurname}</strong>
                </div>
                <div className="review-item">
                  <span>Phone:</span>
                  <strong>{formData.fatherPhone || 'N/A'}</strong>
                </div>
                <div className="review-item">
                  <span>Email:</span>
                  <strong>{formData.fatherEmail || 'N/A'}</strong>
                </div>
                <button className="edit-btn" onClick={() => goToStep(3)}>Edit</button>
              </div>

              {/* MOTHER DETAILS */}
              <div className="review-card">
                <h4>Mother Details</h4>
                <div className="review-item">
                  <span>Name:</span>
                  <strong>{formData.motherName} {formData.motherSurname}</strong>
                </div>
                <div className="review-item">
                  <span>Phone:</span>
                  <strong>{formData.motherPhone || 'N/A'}</strong>
                </div>
                <div className="review-item">
                  <span>Email:</span>
                  <strong>{formData.motherEmail || 'N/A'}</strong>
                </div>
                <button className="edit-btn" onClick={() => goToStep(3)}>Edit</button>
              </div>

              {/* SPOUSE DETAILS */}
              {formData.maritalStatus === "Married" && (
                <div className="review-card">
                  <h4>Spouse Details</h4>
                  <div className="review-item">
                    <span>Name:</span>
                    <strong>{formData.spouseName && formData.spouseSurname
                      ? `${formData.spouseName} ${formData.spouseSurname}`
                      : 'N/A'}</strong>
                  </div>
                  <div className="review-item">
                    <span>Phone:</span>
                    <strong>{formData.spousePhone || 'N/A'}</strong>
                  </div>
                  <div className="review-item">
                    <span>Email:</span>
                    <strong>{formData.spouseEmail || 'N/A'}</strong>
                  </div>
                  <button className="edit-btn" onClick={() => goToStep(3)}>Edit</button>
                </div>
              )}

              {/* CAPTURED DOCUMENTS */}
              <div className="review-card">
                <h4>Captured Documents</h4>
                <div className="review-item">
                  <span>Total Documents:</span>
                  <strong>{documentsMeta.length} file(s)</strong>
                </div>
                {documentsMeta.length > 0 && (
                  <div className="document-list">
                    {documentsMeta.map((doc, index) => (
                      <div key={index} className="review-item">
                        <span>• {doc.documentType}:</span>
                        <strong>✓ Captured</strong>
                      </div>
                    ))}
                  </div>
                )}
                {documentsMeta.length === 0 && (
                  <div className="review-item">
                    <span>Status:</span>
                    <strong className="warning-text">No documents captured</strong>
                  </div>
                )}
                <button className="edit-btn" onClick={() => goToStep(4)}>Edit Documents</button>
              </div>

              {/* PASSPORT PHOTO */}
              <div className="review-card">
                <h4>Passport Size Photo</h4>
                <div className="review-item">
                  <span>Client Photo:</span>
                  <strong className={formData.photo ? 'success-text' : 'warning-text'}>
                    {formData.photo ? '✓ Captured' : '✗ Not Captured'}
                  </strong>
                </div>
                {formData.photo && (
                  <div className="review-item">
                    <span>File Name:</span>
                    <strong>{formData.photo.name}</strong>
                  </div>
                )}
                <button className="edit-btn" onClick={() => goToStep(5)}>Edit Photo</button>
              </div>

              {/* SUBMISSION WARNING */}
              {!formData.photo && (
                <div className="review-card warning-card">
                  <h4>⚠️ Incomplete Submission</h4>
                  <div className="review-item">
                    <span>Missing:</span>
                    <strong>Passport Size Photo (Required)</strong>
                  </div>
                  <p className="hint">Please capture passport photo before submitting.</p>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  /* ======================
     UI
  ====================== */
  return (
    <>
      <Navbar />
      <div className="form-wrapper">
        <div className="form-container">
          <div className="form-header">
            <h2>📋 Client Registration Form</h2>
            <p>Complete KYC with Live Document Capture</p>
          </div>

          {/* PROGRESS BAR */}
          <div className="progress-container">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
            <div className="progress-text">
              Step {currentStep} of {totalSteps}
            </div>
          </div>

          {/* STEP INDICATORS */}
          <div className="step-indicators">
            {stepTitles.map((title, index) => (
              <div
                key={index}
                className={`step-indicator ${currentStep === index + 1 ? 'active' : ''} ${currentStep > index + 1 ? 'completed' : ''}`}
                onClick={() => goToStep(index + 1)}
              >
                <div className="step-number">
                  {currentStep > index + 1 ? '✓' : index + 1}
                </div>
                <div className="step-label">{title}</div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="form">
            {renderStepContent()}

            {/* NAVIGATION BUTTONS */}
            <div className="form-actions">
              {currentStep > 1 && (
                <button
                  type="button"
                  className="prev-btn"
                  onClick={prevStep}
                >
                  ← Previous
                </button>
              )}

              {currentStep < totalSteps && (
                <button
                  type="button"
                  className="next-btn"
                  onClick={nextStep}
                >
                  Next →
                </button>
              )}

              {currentStep === totalSteps && (
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={loading || !formData.photo}
                >
                  {loading ? (
                    <>
                      <div className="spinner"></div>
                      Submitting...
                    </>
                  ) : (
                    "Submit KYC ✓"
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

const Form = () => (
  <ProtectedRoute>
    <FormContent />
  </ProtectedRoute>
);

export default Form;