import React from "react";
import Form from "../common/form";
import Joi from "joi-browser";
import auth from "../../services/authService";
import * as userService from "../../services/userService";
import Alert from "react-bootstrap/Alert";
import { Button } from "react-bootstrap/Button";
import Oauth from "../common/oauth";

class RegisterForm extends Form {
  state = {
    data: { name: "", password: "", email: "" },
    errors: {},
    nameFeedback: {},
    responseMessage: "",
  };

  constructor(props) {
    super();
    console.log("hello", this);
  }

  schema = {
    name: Joi.string().required().label("Name").min(3),
    password: Joi.string().required().label("Password").min(8),
    email: Joi.string().required().label("Email").email(),
  };

  renderResponse = () => {
    if (!this.state.responseMessage) return <></>;
    return <Alert variant={"success"}>{this.state.responseMessage}</Alert>;
  };

  doSubmit = async () => {
    console.log(this.state.data);
    try {
      const { data: responseMessage } = await userService.register(
        this.state.data
      );
      this.setState({ responseMessage });
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.name = ex.response.data;
        this.setState({ errors });
      }
      return;
    }
    this.setState({});
  };

  renderFeedbackClass = () => {
    const { message, isValid } = this.state.nameFeedback;
    if (message === null) return "";
    if (isValid) return "alert alert-success";
    else return "alert alert-danger";
  };

  render() {
    return (
      <div className="row">
        <div className="col"></div>
        <div className="col-12">
          <form onSubmit={this.handleSubmit}>
            <h2>Register</h2>
            {this.renderInput("email", "Email")}
            {this.renderInput("name", "Name")}

            {this.state.nameFeedback.message && (
              <div className={this.renderFeedbackClass()}>
                this.state.nameFeedback.message
              </div>
            )}

            {this.renderInput("password", "Password", "password")}
            {this.renderResponse()}

            <Oauth />
            {this.renderButton("Register")}
          </form>
        </div>
        <div className="col"></div>
      </div>
    );
  }
}

export default RegisterForm;
