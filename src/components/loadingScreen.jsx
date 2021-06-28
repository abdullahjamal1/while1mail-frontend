import React from "react";
import { Spinner, Container, Row, Col } from "react-bootstrap";

const LoadingScreen = () => {
  return (
    <div className="d-flex justify-content-center mt-4">
      <div className="spinner-grow text-light mt-4 mb-4" role="status">
        <i
          class="fa fa-thumb-tack fa-5x text-info mb-4 mr-4"
          aria-hidden="true"
        ></i>
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingScreen;
