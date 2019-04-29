import React, { PureComponent } from "react";
import ReactDOM from "react-dom";
import { Rate } from "antd";

import ModalHeader from "./SubComponents/ModalHeader/ModalHeader.jsx";
import Notes from "./SubComponents/Notes.jsx";
import ReviewInput from "./SubComponents/ReviewInput/ReviewInput.jsx";
import CompanyStats from "../../Partials/CompanyStats/CompanyStats.jsx";
import { fetchApi } from "../../../utils/api/fetch_api";
import { getNotesRequest } from "../../../utils/api/requests.js";
import {
  IS_CONSOLE_LOG_OPEN,
  makeTimeBeautiful
} from "../../../utils/constants/constants.js";

import "./style.scss";

class CardModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      imageLoadError: true,
      whatIsDisplaying: "company",
      isEnteringReview: false,
      isAlreadySubmittedReview: false,
      isUpdated: false,
      isCompanyPropsSetted: false,
      company: {}
    };

    this.toggleReview = this.toggleReview.bind(this);
    this.setCompany = this.setCompany.bind(this);
  }

  componentDidMount() {
    this.setState({ company: this.props.card.companyObject });
  }

  componentDidUpdate() {
    if (this.state.isCompanyPropsSetted == false && !this.state.isUpdated)
      this.setState({
        company: this.props.card.companyObject,
        isCompanyPropsSetted: true
      });
  }

  toggleReview() {
    this.setState({ isEnteringReview: !this.state.isEnteringReview });
  }

  setCompany(newCompany) {
    this.setState({ company: newCompany, isUpdated: true });
  }

  generateNavigationPanel(itemList) {
    const styleNormal = { paddingTop: "50px" };
    const styleOnReviewEntry = { paddingTop: "594px", paddingBottom: "260px" };
    const notesSubHeaderStyle = this.state.isEnteringReview
      ? styleOnReviewEntry
      : styleNormal;
    return itemList.map(item => (
      <div
        style={item == "Notes" ? notesSubHeaderStyle : { paddingTop: "0px" }}
        key={itemList.indexOf(item)}
        className="modal-body navigation subheaders"
      >
        {item}
      </div>
    ));
  }

  generateModalBodyInfo(itemsList) {
    return itemsList.map(item => (
      <div key={itemsList.indexOf(item)} className="modal-body main data info">
        {item}
      </div>
    ));
  }

  render() {
    console.log(this.state.company, "---------", this.props.card.companyObject);
    const { toggleModal, card } = this.props;

    return ReactDOM.createPortal(
      <React.Fragment>
        <div className="modal" onClick={toggleModal}>
          <section
            className="modal-main"
            onClick={e => {
              e.stopPropagation();
            }}
          >
            <ModalHeader
              showOptions={this.state.showOptions}
              card={this.props.card}
              icon={this.props.icon}
              id={this.props.id}
              columnName={this.props.columnName}
              token={this.props.token}
            />

            <div className="modal-body">
              <div className="modal-body navigation">
                {this.generateNavigationPanel([
                  "Company",
                  "Position",
                  "Date",
                  "Source",
                  "Notes"
                ])}
              </div>
              <div className="modal-body main">
                <div className="modal-body main data">
                  <div>
                    {this.generateModalBodyInfo([
                      card.companyObject.company,
                      card.position.job_title,
                      makeTimeBeautiful(card.applyDate, "date"),
                      card.app_source === null ? "N/A" : card.app_source.value
                    ])}
                  </div>
                  {this.state.isCompanyPropsSetted && (
                    <div className="company-stats-container">
                      <CompanyStats company={this.state.company} />
                    </div>
                  )}
                </div>
                <div className="review-entry-container">
                  {!this.state.isEnteringReview ? (
                    <div
                      className="review-button"
                      style={{ marginTop: "-28px" }}
                      onClick={this.toggleReview}
                    >
                      {this.state.isAlreadySubmittedReview
                        ? "Update Your Review"
                        : "Add a Review"}
                    </div>
                  ) : (
                    <div>
                      <ReviewInput
                        token={this.props.token}
                        toggleReview={this.toggleReview}
                        card={this.props.card}
                        setCompany={this.setCompany}
                      />
                    </div>
                  )}
                </div>
                <div className="modal-body main notes">
                  <Notes card={this.props.card} token={this.props.token} />
                </div>
              </div>
            </div>
          </section>
        </div>
      </React.Fragment>,
      document.querySelector("#modal")
    );
  }
}

export default CardModal;
