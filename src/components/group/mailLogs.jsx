import React, { Component } from "react";
import { paginate } from "../../utils/paginate";
import _, { filter } from "lodash";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { deleteMailLog, getMailLogs } from "../../services/mailLogsService";
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

class MailLogs extends Component {
  state = {
    mails: [],
    currentPage: 1,
    pageSize: 100,
    searchQuery: "",
    isLoading: true,
  };

  getPageData = () => {
    const { pageSize, currentPage, searchQuery, mails: allmails } = this.state;

    let filtered = allmails;

    if (searchQuery)
      filtered = allmails.filter((g) =>
        g.subject.toLowerCase().startsWith(searchQuery.toLowerCase())
      );

    const mails = paginate(filtered, currentPage, pageSize);

    return { totalCount: filtered.length, data: mails };
  };

  async componentDidMount() {
    // get user
    this.setState({ isLoading: true });

    const { data: mails } = await getMailLogs();
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
    let originalMails;
    try {
      const res = await deleteMailLog(mailId);
      // originalMails = this.state.mails;
      let mails = this.state.mails.filter((mail) => mail._id !== mailId);
      this.setState({ mails });
    } catch (ex) {
      if (ex.response && ex.response.status === 404) toast.error(ex);
      // this.setState({ mails: originalMails });
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
        <div className="row">
          <h3>Mail History</h3>
          <SearchBox value={searchQuery} onChange={this.handleSearch} />
        </div>
        <MailCard
          mails={this.state.mails}
          user={user}
          onDelete={this.handleMailDelete}
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

export default MailLogs;
