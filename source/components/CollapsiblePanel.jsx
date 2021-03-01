import React, { Component } from "react";
import { Accordion, Icon, Label, Menu, Table } from "semantic-ui-react";

export default class AccordionExampleFluid extends Component {
  state = { activeIndex: 0, workArrangementList: [] };
  componentDidMount() {
    this.setState({
      workArrangementList: this.props.listingDetails,
    });
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      workArrangementList: nextProps.listingDetails,
    });
  }

  handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;

    this.setState({ activeIndex: newIndex });
    
  };
  handleClick1 = (workArrangementId, projectId,title) => {
    //console.log("tile"+title.substring(0,title.indexOf(" ")));
    sessionStorage.setItem("pdfTitle",title.substring(0,title.indexOf(" ")));
    this.props.redirectView(workArrangementId, projectId);
  };
  // eslint-disable-next-line consistent-return
  render() {
    
    const { activeIndex, workArrangementList } = this.state;
    // console.log(workArrangementList);

    if (Array.isArray(this.props.listingDetails)) {
      // console.log("this.props.listingDetails", this.props.listingDetails);

      if (workArrangementList.length === 0) {
        return (
          <div
            style={{
              color: "red",
              width: "80%",
              textAlign: "center",
              textWeight: "bold",
              paddingTop: "100px",
            }}
          >
            No Listings Found
          </div>
        );
      } else if (workArrangementList.length > 0) {
        
        return (
          <Accordion fluid styled>
            {workArrangementList.map((listData, index) => (
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
                      listData.workArrangementId
                        ? listData.workArrangementId
                        : listData.worktrackId
                        ? listData.worktrackId
                        : listData.workRequestId,
                      listData.projectId,listData.Title
                    )
                  }
                >
                  <div
                    dangerouslySetInnerHTML={{ __html: listData.paragraph }}
                  />
                </Accordion.Content>
              </div>
              
            ))
            
            }
          </Accordion>
        );
      }
    }
  }
}
