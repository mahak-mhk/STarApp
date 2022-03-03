import React, { Component } from "react";
import { Modal, Button, Row, Col, Form } from "react-bootstrap";
import swal from "sweetalert";

const userLocalInfo = JSON.parse(localStorage.getItem("user"));

export class EditUserModal extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    fetch(`${process.env.REACT_APP_API}Employees/` + event.target.id.value, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authorization: `Bearer ${userLocalInfo.token}`,
      },
      body: JSON.stringify({
        id: event.target.id.value,
        userName: event.target.name.value,
        email: event.target.mail.value, //not editable by api
        role: parseInt(event.target.role.value),
        status: parseInt(event.target.status.value),
        activeFrom: event.target.activeFrom.value, //not editable by api
      }),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          swal("Updated!", "Data is updated successfully!", "success");
          //alert(result);
          //window.location.reload();
        },
        (error) => {
          swal("Error!", "Error in update!", "error");
          //alert("Failed");
        }
      );
  }
  render() {
    return (
        <Modal
          scrollable={true}
          {...this.props}
          size="sm-6"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closebutton="true">
            <Modal.Title className="mb-1" id="contained-modal-title-vcenter">
              Edit User
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col sm={8}>
                <Form onSubmit={this.handleSubmit}>
                  <Form.Group className="mb-3" controlId="id">
                    <Form.Label>User Id</Form.Label>
                    <Form.Control
                      type="text"
                      name="id"
                      required
                      disabled
                      defaultValue={this.props.userid}
                      placeholder="Enter Id"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      required
                      defaultValue={this.props.name}
                      placeholder="Enter Name"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="mail">
                    <Form.Label>Email Id</Form.Label>
                    <Form.Control
                      type="text"
                      name="mail"
                      required
                      disabled
                      defaultValue={this.props.mail}
                      placeholder="Enter Email Id"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="activeFrom">
                    <Form.Label>Active From</Form.Label>
                    <Form.Control
                      type="text"
                      name="activeFrom"
                      required
                      disabled
                      defaultValue={this.props.activefrom}
                      placeholder="Enter Active From"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="role">
                    <Form.Label>Role</Form.Label>
                    {/* <Form.Control defaultValue={parseInt(this.props.role) === 1 ? "Admin" : parseInt(this.props.role) === 2 ? "Developer" : parseInt(this.props.role) === 3 ? "Lead" : "Choose Options"}></Form.Control> */}
                    <Form.Select aria-label="Default select example">
                      <option
                        disabled
                        defaultValue={
                          parseInt(this.props.role) === 1
                            ? "Admin"
                            : parseInt(this.props.role) === 2
                            ? "Developer"
                            : parseInt(this.props.role) === 3
                            ? "Lead"
                            : "Choose Options"
                        }
                      >
                        {parseInt(this.props.role) === 1
                          ? "Admin"
                          : parseInt(this.props.role) === 2
                          ? "Developer"
                          : parseInt(this.props.role) === 3
                          ? "Lead"
                          : "Choose Options"}
                      </option>
                      <option value={1}>Admin</option>
                      <option value={2}>Developer</option>
                      <option value={3}>Lead</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="status">
                    <Form.Label>Status</Form.Label>
                    {/* <Form.Control type="text" name="status" required
                                        disabled
                                        defaultValue={parseInt(this.props.status) === 1 ? "Active" : parseInt(this.props.status) === 2 ? "Inactive" : parseInt(this.props.status) === 3 ? "Requested" : "Choose Options"}
                                            placeholder="Enter Status" /> */}
                    <Form.Select aria-label="Default select example">
                      <option
                        disabled
                        defaultValue={
                          parseInt(this.props.status) === 1
                            ? "Active"
                            : parseInt(this.props.status) === 2
                            ? "Inactive"
                            : parseInt(this.props.status) === 3
                            ? "Requested"
                            : "Choose Options"
                        }
                      >
                        {parseInt(this.props.status) === 1
                          ? "Active"
                          : parseInt(this.props.status) === 2
                          ? "Inactive"
                          : parseInt(this.props.status) === 3
                          ? "Requested"
                          : "Choose Options"}
                      </option>
                      <option value={1}>Active</option>
                      <option value={2}>Inactive</option>
                      <option value={3}>Requested</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Button variant="primary" type="submit">
                      Update
                    </Button>
                  </Form.Group>
                </Form>
              </Col>
            </Row>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="danger" onClick={this.props.onHide}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
    );
  }
}
