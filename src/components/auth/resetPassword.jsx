import React, { Component } from "react";
import Joi from "joi-browser";
import Form from "../common/form";
import * as authService from "../../services/authService";
import Alert from "react-bootstrap/Alert";

class ResetPassword extends Form {
  state = {
    data: { email: "" },
    errors: {},
    responseMessage: "",
  };

  schema = {
    email: Joi.string().required().label("Email"),
  };

  renderResponse = () => {
    if (!this.state.responseMessage) return <></>;
    return <Alert variant={"success"}>{this.state.responseMessage}</Alert>;
  };

  doSubmit = async () => {
    try {
      const { data: responseMessage } = await authService.resetPasswordSendMail(
        this.state.data
      );
      this.setState({ responseMessage });
    } catch (ex) {
      if (ex.response) {
        const errors = { ...this.state.errors };
        errors.email = ex.response.data;
        this.setState({ errors });
      }
      return;
    }
    this.setState({});
  };
  render() {
    return (
      <div className="row">
        <div className="col-sm col-12"></div>
        <div className="col-sm col-12">
          <h3>Reset Password</h3>
          <form onSubmit={this.handleSubmit}>
            {this.renderInput("email", "Email")}
            {this.renderResponse()}
            {this.renderButton("Reset Password")}
          </form>
        </div>
        <div className="col-sm col-12"></div>
      </div>
    );
  }
}

export default ResetPassword;
