import React, { Component } from "react";
import {
  Button,
  Table,
  Form,
  Container,
  Spinner,
  InputGroup,
  FormControl,
  Alert,
} from "react-bootstrap";
import { EditAllowanceDashboardModal } from "../modals/EditAllowanceDashboardModal";
import Navigation from "../components/Navigation";
import ReactPaginate from "react-paginate";
import swal from "sweetalert";

const limit = 10;
const userLocalInfo = JSON.parse(localStorage.getItem("user"));

export class AllowanceDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dashboard: [],
      editModalShow: false,
      pageCount: 0,
      isNoResult: false,
      searchQuery: "",
    };
    this.refreshList = this.refreshList.bind(this);
    this.onSearchClick = this.onSearchClick.bind(this);
  }

  refreshList() {
    var apiLink = `${process.env.REACT_APP_API}Allowance?Page=1&PageSize=${limit}`;
    if (this.state.searchQuery) apiLink += `&Name=${this.state.searchQuery}`;

    fetch(apiLink, {
      method: "GET",
      headers: { authorization: `Bearer ${userLocalInfo.token}` },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.allowances.length === 0) this.setState({ isNoResult: true });
        else this.setState({ isNoResult: false });
        this.setState({ dashboard: data.allowances });
        this.setState({ pageCount: data.totalPages });
      });
  }

  onSearchClick(ev) {
    ev.preventDefault();
    this.setState({ searchQuery: ev.target.search.value }, () =>
      this.refreshList()
    );
  }

  componentDidMount() {
    this.refreshList();
  }

  editModalClose = () =>
    this.setState({ editModalShow: false }, () => this.refreshList());

  //fetching the allowances
  fetchAllowance = async (currentPage) => {
    const res = await fetch(
      `${process.env.REACT_APP_API}Allowance?Page=${currentPage}&PageSize=${limit}`,
      {
        method: "GET",
        headers: { authorization: `Bearer ${userLocalInfo.token}` },
      }
    );
    const data = await res.json();
    console.log(data);

    return data;
  };

  handlePageClick = async (data) => {
    console.log(data.selected);

    let currentPage = data.selected + 1;
    const allowanceFormServer = await this.fetchAllowance(currentPage);
    console.log(allowanceFormServer.allowances);
    this.setState({ dashboard: allowanceFormServer.allowances });
  };

  render() {
    const {
      dashboard,
      dashboardid,
      sapid,
      name,
      project,
      afternoonshift,
      nightshift,
      dayseligibleforta,
    } = this.state;

    return (
      <div className="pb-5">
        <Navigation UserName={userLocalInfo.userName} />
        <Container>
          <div className="my-2  d-flex flex-row  justify-content-between text-nowrap">
            <div className="w-10 d-flex flex-row gap-3">
              <Form onSubmit={this.onSearchClick}>
                <InputGroup>
                  <FormControl type="text" name="search" placeholder="Search" />
                  <Button type="submit">
                    <i className="fa-solid fa-magnifying-glass"></i>
                  </Button>
                </InputGroup>
              </Form>
            </div>
            <Button
              onClick={() => {
                window.open(
                  `${process.env.REACT_APP_API}Allowance/Download`,
                  "_blank"
                );
                swal("Downloaded!", "Your file downloaded successfully.", {
                  icon: "success",
                });
              }}
              variant="success"
            >
              Approve & Download
            </Button>
          </div>
          {this.state.isNoResult && (
            <Alert variant="danger">No results found!</Alert>
          )}
          {this.state.dashboard.length === 0 ? (
            <Container className="d-flex justify-content-center">
              <Spinner animation="border" variant="secondary" />
            </Container>
          ) : (
            <Table
              className="mt-2 text-center"
              responsive="sm"
              striped
              bordered
              hover
              size="sm"
            >
              <thead>
                <tr>
                  <th>Sap Id</th>
                  <th>Project</th>
                  <th>Name</th>
                  <th>Period Start</th>
                  <th>Period End</th>
                  <th>Project Hour</th>
                  <th>Holiday / Leave Hours</th>
                  <th>Afternoon Shift Days</th>
                  <th>Night Shift Days</th>
                  <th>Days Eligible for TA</th>
                  <th>Transport Allowance</th>
                  <th>Total Allowance</th>
                  <th>Modify</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.map((dashboard) => (
                  <tr key={dashboard.id}>
                    <td>{dashboard.sapId}</td>
                    <td>{dashboard.project}</td>
                    <td>{dashboard.name}</td>
                    <td>{dashboard.periodStart}</td>
                    <td>{dashboard.periodEnd}</td>
                    <td>{dashboard.projectHours}</td>
                    <td>{dashboard.holidayHours}</td>
                    <td>{dashboard.afternoonShiftDays}</td>
                    <td>{dashboard.nightShiftDays}</td>
                    <td>{dashboard.daysEligibleForTA}</td>
                    <td>{dashboard.transportAllowance}</td>
                    <td>{dashboard.totalAllowance}</td>
                    <td>
                      <Button
                        size="sm"
                        className="mx-1"
                        variant="secondary"
                        onClick={() =>
                          this.setState({
                            editModalShow: true,
                            dashboardid: dashboard.id,
                            sapid: dashboard.sapId,
                            name: dashboard.name,
                            project: dashboard.project,
                            afternoonshift: dashboard.afternoonShiftDays,
                            nightshift: dashboard.nightShiftDays,
                            dayseligibleforta: dashboard.daysEligibleForTA,
                          })
                        }
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}

          <EditAllowanceDashboardModal
            show={this.state.editModalShow}
            onHide={this.editModalClose}
            dashboardid={dashboardid}
            sapid={sapid}
            name={name}
            project={project}
            afternoonshift={afternoonshift}
            nightshift={nightshift}
            dayseligibleforta={dayseligibleforta}
          />

          {this.state.dashboard.length > 0 && (
            <ReactPaginate
              previousLabel={"previous"}
              nextLabel={"next"}
              breakLabel={"..."}
              pageCount={this.state.pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={3}
              onPageChange={this.handlePageClick}
              containerClassName={"pagination justify-content-center pb-5 pt-3"}
              pageClassName={"page-item"}
              pageLinkClassName={"page-link"}
              previousClassName={"page-item"}
              previousLinkClassName={"page-link"}
              nextClassName={"page-item"}
              nextLinkClassName={"page-link"}
              breakClassName={"page-item"}
              breakLinkClassName={"page-link"}
              activeClassName={"active"}
            />
          )}
        </Container>
      </div>
    );
  }
}
