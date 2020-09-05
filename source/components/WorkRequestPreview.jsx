import React, { Component } from "react";
import { Grid, Image } from "semantic-ui-react";
import * as API from "../config/api-config";
import { ToastContainer, toast } from "react-toastify";
class WorkRequestPreview extends Component {
  constructor(props) {
    super(props);
    console.log("constructor",props.curState);
    this.state = {
      curState: props.curState,
      images: props.images,
      isLoading:false,
      drawingImage:props.curState.drawImageshow
    };
  }

  componentWillReceiveProps(nextProps) {
   console.log("component will res",nextProps.curState);
    this.setState({ curState: nextProps.curState, images: nextProps.images,drawingImage:nextProps.curState.drawingImage });
  }

  setItemList = (itemList) => {
    return itemList.map((item) => {
      const sizeList = item.sizeList ? item.sizeList[0] : [];
      const manpowerList = item.manpowerList ? item.manpowerList[0] : [];
      return (
        <div className="hrline">
          <div className="row">
            <div className="col-sm-3">
              <label>Items:</label>
            </div>
            <div className="col-sm-3 strong">{item.text_item}</div>
            <div className="col-sm-3">
              <label>Location:</label>
            </div>
            <div className="col-sm-3 strong">{item.text_location}</div>
          </div>
          <div className="row">
            <div className="col-sm-3">
              <label>Size Type:</label>
            </div>
            <div className="col-sm-3 strong">
              {item.sizeType == 1 ? "Full Size" : "Partial Size"}
            </div>

            <div className="col-sm-3">
              <label>Work Based On :</label>
            </div>
            <div className="col-sm-3 strong">
              {item.workBased == 1 ? "Size" : "ManPower"}
            </div>
          </div>
          {item.sizeType == 2 && (
            <div>
              <div className="col-sm-3">
                <label>Previous WR#:</label>
              </div>
              <div className="col-sm-3 strong">{item.workRequestId_Text}</div>
            </div>
          )}
          {item.workBased == 1 && sizeList && (
            <div>
              <div className="row">
                <div className="col-sm-3">
                  <label>Scaffold Work Type:</label>
                </div>
                <div className="col-sm-3 strong">
                  {sizeList.text_scaffoldWorkType}
                </div>
              </div>
              <div className="row">
                <div className="col-sm-3">
                  <label>Scaffold Type:</label>
                </div>
                <div className="col-sm-3 strong">
                  {sizeList.text_scaffoldType}
                </div>
              </div>
              <div className="row">
                <div className="col-sm-3">
                  <label>Scaffold Subcategory:</label>
                </div>
                <div className="col-sm-3 strong">
                  {sizeList.text_scaffoldSubcategory}
                </div>
              </div>
              <div className="row">
                <div className="col-xs-3">
                  {" "}
                  L: <span className="strong">{sizeList.L}</span>
                </div>
                <div className="col-xs-3">
                  W: <span className="strong">{sizeList.W}</span>
                </div>
                <div className="col-xs-3">
                  H: <span className="strong">{sizeList.H}</span>
                </div>

                <div className="col-xs-3">
                  Set <span className="strong">{sizeList.set}</span>
                </div>
              </div>
            </div>
          )}

          {item.workBased == 2 && manpowerList && (
            <div>
              <div className="row">
                <div className="col-xs-3">
                  <label>Safety</label>
                </div>
                <div className="col-xs-3 strong">{manpowerList.safety}</div>
                <div className="col-xs-3">
                  <label>Supervisor</label>
                </div>
                <div className="col-xs-3 strong">{manpowerList.supervisor}</div>
              </div>

              <div className="row">
                <div className="col-xs-3">
                  <label>Erectors</label>
                </div>
                <div className="col-xs-3 strong">{manpowerList.erectors}</div>
                <div className="col-xs-3">
                  <label>General Workers</label>
                </div>
                <div className="col-xs-3 strong">{manpowerList.gworkers}</div>
              </div>

              <div className="row">
                <div className="col-xs-12">
                  <label>ManPower Time</label>
                </div>
              </div>
              <div className="row">
                <div className="col-xs-3">Time IN</div>
                <div className="col-xs-3 strong">{manpowerList.inTime}</div>
              </div>
              <div className="row">
                <div className="col-xs-3">Time OUT</div>
                <div className="col-xs-3 strong">{manpowerList.outTime}</div>
              </div>
            </div>
          )}
        </div>
      );
    });
  };

  setsizeList = (itemList) => {
    return itemList.map((item) => {
      return (
        <div className="hrline">
          <div>
            <div className="row">
              <div className="col-sm-6">
                <label>Scaffold Work Type:</label>
              </div>
              <div className="col-sm-6 strong">
                {item.text_scaffoldWorkType}
              </div>
            </div>
            <div className="row">
              <div className="col-sm-6">
                <label>Scaffold Type:</label>
              </div>
              <div className="col-sm-6 strong">{item.text_scaffoldType}</div>
            </div>
            <div className="row">
              <div className="col-sm-6">
                <label>Scaffold Subcategory:</label>
              </div>
              <div className="col-sm-6 strong">
                {item.text_scaffoldSubcategory}
              </div>
            </div>
            <div className="row">
              <div className="col-xs-3">
                {" "}
                L: <span className="strong">{item.L}</span>
              </div>
              <div className="col-xs-3">
                W: <span className="strong">{item.W}</span>
              </div>
              <div className="col-xs-3">
                H: <span className="strong">{item.H}</span>
              </div>
              <div className="col-xs-3">
                Set <span className="strong">{item.set}</span>
              </div>
            </div>
          </div>
        </div>
      );
    });
  };
  setManPowerList = (itemList) => {
    return itemList.map((item) => {
      return (
        <div className="hrline">
          <div className="row">
            <div className="col-xs-3">
              <label>Safety</label>
            </div>
            <div className="col-xs-3 strong">{item.safety}</div>
            <div className="col-xs-3">
              <label>Supervisor</label>
            </div>
            <div className="col-xs-3 strong">{item.supervisor}</div>
          </div>

          <div className="row">
            <div className="col-xs-3">
              <label>Erectors</label>
            </div>
            <div className="col-xs-3 strong">{item.erectors}</div>
            <div className="col-xs-3">
              <label>General Workers</label>
            </div>
            <div className="col-xs-3 strong">{item.gworkers}</div>
          </div>

          <div className="row">
            <div className="col-xs-12">
              <label>ManPower Time</label>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-3">Time IN</div>
            <div className="col-xs-3 strong">{item.inTime}</div>
          </div>
          <div className="row">
            <div className="col-xs-3">Time OUT</div>
            <div className="col-xs-3 strong">{item.outTime}</div>
          </div>
        </div>
      );
    });
  };

  click = () => {
    console.log("working");
  };
  
  filepload = (e) => {
    this.setState({isLoading:true});
    const { curState } = this.state;
    e.preventDefault();
    const formData = new FormData();
    formData.append("uniqueId", curState.userId);
    formData.append("requestCode", 25);
    formData.append("workrequestid", curState.listingId);
    let images = [];
    for (let i = 0; i < e.target.files.length; i++) {
      formData.append("images[]", e.target.files[i]);
    }
    fetch(API.WORKREQUEST_URI, {
      method: "post",
      body: formData,
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.responsecode === 1) {
          this.setState({ images: this.state.images.concat(res.imageurl),isLoading:false });
        } else {
          this.setState({isLoading:false});
          //toast.error(res.response, { autoClose: 3000 });
        }
      });
  };

  
  render() {
    const { curState, images,isLoading,drawingImage } = this.state;
    return (
      <div>
        <div className="container work-arr-container">
          <div className="row">
            <div className="col-sm-6">
              <label>Project:</label>
            </div>
            <div className="col-sm-6 strong">{curState.text_projects}</div>
          </div>
          <div className="row">
            <div className="col-sm-6">
              <label>Client:</label>
            </div>
            <div className="col-sm-6 strong">{curState.text_clients}</div>
          </div>
          <div className="row">
            <div className="col-sm-6">
              <label>Requested By:</label>
            </div>
            <div className="col-sm-6 strong">{curState.requestBy}</div>
          </div>
          <div className="row">
            <div className="col-sm-6">
              <label>Contract Type:</label>
            </div>
            <div className="col-sm-6 strong">
              {curState.cType == 1 ? "Orginal Contarct" : "Variation Works"}
            </div>
          </div>
          <div className="row">
            <div className="col-sm-6">
              <label>Description:</label>
            </div>
            <div className="col-sm-6 strong">{curState.description}</div>
          </div>
          {/* {curState.drawingImage && (
            <div className="row">
            <div className="col-sm-6">
              <label>DrawingImage:</label>
            </div>
            <div className="col-sm-6"><img src={curState.drawingImage}></img>
            </div>
            </div>
          )} */}
          {drawingImage && (
            <div className="row">
            <div className="col-sm-6">
              <label>DrawingImage:</label>
            </div>
            <div className="col-sm-6"><img src={drawingImage}></img>
            </div>
            </div>
          )}
          {curState.cType == 1 && this.setItemList(curState.itemList)}
          {curState.cType == 2 && (
            <div>
              <div className="row">
                <div className="col-sm-3">
                  <label>Work Based On :</label>
                </div>
                <div className="col-sm-3 strong">
                  {curState.workBased == 1 ? "Size" : "ManPower"}
                </div>
              </div>
              {curState.workBased == 1 && this.setsizeList(curState.sizeList)}
              {curState.workBased == 2 &&
                this.setManPowerList(curState.manpowerList)}
            </div>
          )}
          <div className="row">
            <div className="col-sm-6">
              <label>Scaffold Register</label>
            </div>
            {curState.scaffoldRegister == 1 ? (
              <div className="col-sm-6 strong"> Yes </div>
            ) : (
              <div className="col-sm-6 strong"> No </div>
            )}
          </div>
          <div className="row">
            <div className="col-sm-6">
              <label>Remarks</label>
            </div>
            <div className="col-sm-6 strong">{curState.remarks}</div>
          </div>
          <br></br> <hr></hr>
          <div className="row">
            <div className="col-sm-6">
              <label>Images:</label>
            </div>
            <div className="col-sm-6">
              {
                isLoading && (
                  <p style={{color:'green'}}>Loading...</p>
                )
              }
                <input
                type="file"
                id="drawingAttachedFile"
                name="drawingAttachedFile"
                multiple
                onChange={this.filepload}
              />
            </div>
            {images && images.length > 0 ? (
              <div className="col-sm-12">
                <Grid>
                  <Grid.Row columns={8}>
                    {images.map((_x) => (
                      <Grid.Column >
                        <Image src={_x} onClick={this.click} />
                      </Grid.Column>
                    ))}
                  </Grid.Row>
                </Grid>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    );
  }
}
export default WorkRequestPreview;
