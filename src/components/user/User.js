import React, { useState, useEffect } from "react";
import UserService from "../../services/user/userService";
import * as Yup from "yup"

const User = props => {
  const initialUserState = {
    id: null,
    name: "",
    email: "",
    phone: "",
    permission: "",
    password: ""
  };
  const [currentUser, setCurrentUser] = useState(initialUserState);
  const [validationErrors, setValidationErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);

  const getUser = id => {
    UserService.getById(id)
      .then(response => {
        setCurrentUser(response.data.data);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  useEffect(() => {
    getUser(props.match.params.id);
  }, [props.match.params.id]);

  const handleInputChange = event => {
    const { name, value } = event.target;
    setCurrentUser({ ...currentUser, [name]: value });
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
        .oneOf(["admin", "standard"], "Invalid permission"),
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

  const updateUser = () => {
    UserService.update(currentUser.id, currentUser)
      .then(response => {
        console.log(response.data);
        window.confirm("The user was updated successfully!");
      })
      .then(() => {
        props.history.push("/users");
      })
      .catch(e => {
        console.log();
        window.alert("Error: " + e.response.data.message);
      });
  };

  return (
    <div>
      {currentUser ? (
        <div className="edit-form">
          <h4>User</h4>
          <form>
            <div className="form-group">
              <label htmlFor="title">Name</label>
              <input
                type="text"
                className={`form-control ${validationErrors.name ? "is-invalid" : ""}`}
                id="name"
                name="name"
                value={currentUser.name}
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
                value={currentUser.email}
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
                value={currentUser.phone}
                onChange={handleInputChange}
                onBlur={handleBlur}
              />
              <div className="invalid-feedback">
                {validationErrors.phone}
              </div>
            </div>

            {currentUser.permission === 'admin' && (
              <div className="form-group">
                <label htmlFor="description">Permission</label>
                <input
                  type="text"
                  className={`form-control ${validationErrors.permission ? "is-invalid" : ""}`}
                  id="permission"
                  name="permission"
                  value={currentUser.permission}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                />
                <div className="invalid-feedback">
                  {validationErrors.permission}
                </div>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="description">Password</label>
              <input
                type="password"
                className={`form-control ${validationErrors.password ? "is-invalid" : ""}`}
                id="password"
                name="password"
                value={currentUser.password}
                onChange={handleInputChange}
                onBlur={handleBlur}
              />
              <div className="invalid-feedback">
                {validationErrors.password}
              </div>
            </div>
          </form>

          <button
            type="submit"
            className="btn btn-success"
            onClick={updateUser}
            disabled={Object.keys(validationErrors).some((key) => validationErrors[key])}
          >
            Update
          </button>
        </div>
      ) : (
        <div>
          <br />
          <p>Please click on a User...</p>
        </div>
      )}
    </div>
  );
};

export default User;