import React, { Component } from "react";
import { Accordion, Icon, Label, Menu, Table } from "semantic-ui-react";

export default class AccordionExampleFluid extends Component {
  state = { activeIndex: 0, workArrangementList: [] };

  componentWillReceiveProps(nextprops) {
    // console.log(nextprops);
    this.setState({
      workArrangementList: nextprops.listingDetails
    });
  }

  handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;

    this.setState({ activeIndex: newIndex });
  };
  handleClick1 = (workArrangementId, projectId) => {
    this.props.redirectView(workArrangementId, projectId);
  };
  // eslint-disable-next-line consistent-return
  render() {
    const { activeIndex } = this.state;
    if (Array.isArray(this.props.listingDetails)) {
      if (this.props.listingDetails.length === 0) {
        return (
          <div
            style={{
              color: "red",
              width: "80%",
              textAlign: "center",
              textWeight: "bold",
              paddingTop: "100px"
            }}
          >
            No Listings Found
          </div>
        );
      } else if (this.props.listingDetails.length > 0) {
        return (
          <Accordion fluid styled>
            {this.props.listingDetails.map((listData, index) => (
              <div>
                <Accordion.Title
                  active={activeIndex === index}
                  index={index}
                  onClick={this.handleClick}
                >
                  <Icon name="dropdown" />
                  {listData.Title}
                </Accordion.Title>
                <Accordion.Content
                  active={activeIndex === index}
                  onClick={() =>
                    this.handleClick1(
                      listData.workArrangementId,
                      listData.projectId
                    )
                  }
                >
                  <div
                    dangerouslySetInnerHTML={{ __html: listData.paragraph }}
                  />
                </Accordion.Content>
              </div>
            ))}
          </Accordion>
        );
      }
    }
  }
}
