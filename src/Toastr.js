import React, { Component } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
class Toastr extends Component {
  render() {
    return (
      <div>
        <h4 className="navheader">Notifications using Toastr</h4>
        <button
          className="btn btn-success btnspace"
          onClick={() => toast.success("Hey, this is a Success Message")}
        >
          {" "}
          Hey, this is a Success Message
        </button>
        <button
          className="btn btn-info btnspace"
          onClick={() => toast.info("Hey, this is an Info Message")}
        >
          Hey, this is an Info Message
        </button>
        <button
          className="btn btn-danger btnspace"
          onClick={() => toast.error("Hey, this is an Error Message")}
        >
          Hey, this is an Error Message
        </button>
        <button
          className="btn btn-warning btnspace"
          onClick={() => toast.warning("Hey, this is a Success Message")}
        >
          Hey, this is a Warning Message
        </button>
        <ToastContainer />
      </div>
    );
  }
}
export default Toastr;
