import React, { Component } from "react";
import { paginate } from "../../utils/paginate";
import _, { filter } from "lodash";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { deleteMail, getMails } from "../../services/mailService";
import { getUser } from "../../services/userService";
import Pagination from "../common/pagination";
import SearchBox from "../common/searchBox";
import MailCard from "./mailCard";
import authService from "../../services/authService";
import LoadingScreen from "../loadingScreen";

import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import HistoryIcon from "@material-ui/icons/History";

class Mails extends Component {
  state = {
    mails: [],
    currentPage: 1,
    pageSize: 8,
    searchQuery: "",
    isLoading: true,
  };

  getPageData = () => {
    const { pageSize, currentPage, searchQuery, mails: allmails } = this.state;

    let filtered = allmails;

    if (searchQuery)
      filtered = allmails.filter(
        (m) =>
          m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.body.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const mails = paginate(filtered, currentPage, pageSize);

    return { totalCount: filtered.length, data: mails };
  };

  async componentDidMount() {
    // get user
    this.setState({ isLoading: true });

    const { data: mails } = await getMails();

    this.setState({ mails });
  }
  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };

  handleSearch = (query) => {
    this.setState({ searchQuery: query, currentPage: 1 });
  };

  handleMailDelete = async (mailId) => {
    let originalMails = [...this.state.mails];
    try {
      let mails = [...this.state.mails];
      mails = mails.filter((mail) => mail._id !== mailId);
      this.setState({ mails });
      const res = await deleteMail(mailId);
    } catch (ex) {
      this.setState({ mails: originalMails });
      if (ex.response && ex.response.status === 404) toast.error(ex);
    }
  };

  render() {
    const { pageSize, currentPage, searchQuery, mails } = this.state;
    const { user } = this.props;
    const { totalCount, data } = this.getPageData();

    if (this.state.isLoading && !mails) {
      return <LoadingScreen />;
    }

    return (
      <Container>
        <div className="row m-1">
          <Link to="/mailForm/new" style={{ marginTop: 20 }}>
            <Fab color="primary" aria-label="add">
              <AddIcon />
            </Fab>
          </Link>
          <Link to="/history" style={{ marginLeft: 20, marginTop: 20 }}>
            <Fab variant="extended">
              <HistoryIcon />
              History
            </Fab>
          </Link>
        </div>
        <div className="row">
          <SearchBox value={searchQuery} onChange={this.handleSearch} />
        </div>
        <MailCard
          mails={data}
          user={user}
          onDelete={this.handleMailDelete}
          props={this.props}
        />
        <div className="row">
          <Pagination
            itemsCount={totalCount}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={this.handlePageChange}
          />
        </div>
      </Container>
    );
  }
}

export default Mails;
