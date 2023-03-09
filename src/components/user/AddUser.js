import React, { useState } from "react";
import UserService from "../../services/user/userService";
import * as Yup from 'yup'

const AddUser = () => {
  const initialUserState = {
    name: "",
    email: "",
    phone: "",
    permission: "",
    password: ""
  };
  const [user, setUser] = useState(initialUserState);
  const [validationErrors, setValidationErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);

  const handleInputChange = event => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;

    const validationSchema = Yup.object().shape({
      name: Yup.string().required("Name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      phone: Yup.string()
        .matches(/^\d{11}$/, "Invalid phone number (must have 11 digits)")
        .required(),
      permission: Yup.string()
        .required("Permission is required")
        .oneOf(["admin", "standard"], "Permission must be admin or standard"),
      password: Yup.string()
        .min(4, "Password must have at least 4 characters")
        .required(),
    });

    validationSchema
      .validateAt(name, { [name]: value })
      .then(() => {
        setValidationErrors({ ...validationErrors, [name]: "" });
      })
      .catch((validationError) => {
        setValidationErrors({
          ...validationErrors,
          [name]: validationError.message,
        });
      });
  };

  const saveUser = () => {
    var data = {
      name: user.name,
      email: user.email,
      phone: user.phone,
      permission: user.permission,
      password: user.password
    };

    UserService.create(data)
      .then(response => {
        setUser({
          name: response.data.data.name,
          email: response.data.data.email,
          phone: response.data.data.phone,
          permission: response.data.data.permission,
        })
        window.confirm("The user was created successfully!")
        console.log(response.data);
      }).then(() => {
        window.location.replace("/users");
      })
      .catch(e => {
        console.log(e);
        window.alert("Error: " + e.response.data.message);
      });
  };

  return (
    <div className="submit-form">
      <div>
        <div className="form-group">
          <label htmlFor="title">Name</label>
          <input
            type="text"
            className={`form-control ${validationErrors.name ? "is-invalid" : ""}`}
            id="name"
            name="name"
            value={user.name}
            onChange={handleInputChange}
            onBlur={handleBlur}
          />
          <div className="invalid-feedback">
            {validationErrors.name}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Email</label>
          <input
            type="text"
            className={`form-control ${validationErrors.email ? "is-invalid" : ""}`}
            id="email"
            name="email"
            value={user.email}
            onChange={handleInputChange}
            onBlur={handleBlur}
          />
          <div className="invalid-feedback">
            {validationErrors.email}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Phone</label>
          <input
            type="text"
            className={`form-control ${validationErrors.phone ? "is-invalid" : ""}`}
            id="phone"
            name="phone"
            value={user.phone}
            onChange={handleInputChange}
            onBlur={handleBlur}
          />
          <div className="invalid-feedback">
            {validationErrors.phone}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Permission</label>
          <input
            type="text"
            className={`form-control ${validationErrors.permission ? "is-invalid" : ""}`}
            id="permission"
            name="permission"
            value={user.permission}
            onChange={handleInputChange}
            onBlur={handleBlur}
          />
          <div className="invalid-feedback">
            {validationErrors.permission}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Password</label>
          <input
            type="password"
            className={`form-control ${validationErrors.password ? "is-invalid" : ""}`}
            id="password"
            name="password"
            value={user.password}
            onChange={handleInputChange}
            onBlur={handleBlur}
          />
          <div className="invalid-feedback">
            {validationErrors.password}
          </div>
        </div>

        <button
          onClick={saveUser}
          className="btn btn-success"
          disabled={Object.keys(validationErrors).some((key) => validationErrors[key])}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default AddUser;