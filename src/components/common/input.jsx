import React from "react";

// rest operator helps us pass additional operators
const Input = ({ name, label, error, type, ...rest }) => {
  return (
    <div className="form-group mt-2">
      {/* <label htmlFor={name}>{label}</label> */}
      {type !== "text area" && (
        <input
          {...rest}
          id={name}
          name={name}
          type={type}
          placeholder={label}
          className="input form-control"
        />
      )}
      {type === "text area" && (
        <textarea
          {...rest}
          id={name}
          name={name}
          placeholder={label}
          className="input form-control"
        />
      )}
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
};

export default Input;
