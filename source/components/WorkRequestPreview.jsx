import React, { Component } from "react";
import { Grid, Image } from "semantic-ui-react";
import { Modal } from "react-bootstrap";
import {Button} from 'react-bootstrap';
import * as API from "../config/api-config";

import CustomButton from "./CustomButton";
import { ToastContainer, toast } from "react-toastify";

class WorkRequestPreview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      curState: props.curState,
      images: props.images,
      drawingImage: props.curState.drawingImage,
      submitBefore:props.submitBefore,
      show:false,
      imageShow:false,
      modalShowImage: '',
      isLoading: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      curState: nextProps.curState,
      images: nextProps.images,
      drawingImage: nextProps.curState.drawingImage,
      submitBefore:nextProps.submitBefore,
    });
  }

  handleClose = () => {
    this.setState({ imageShow: false,show: false,modalShowImage:'' });
  };


  drawingImageShowList = (itemList) =>{
    const imgURL = API.CONTEXT;
    return itemList.map((item, index) => {
      return (
        <div><Image src={imgURL+"/"+item} className="ui tiny image" onClick={()=>this.drawclick(item)} />
        </div>
      );
    });
  }

  imageShowList = (itemList) =>{
    const imgURL = API.CONTEXT;
    return itemList.map((item, index) => {
      return (
        <div><Image src={imgURL+"/"+item} className="ui tiny image" onClick={()=>this.imageClick(item)} />
        </div>
      );
    });
  }

  gridDrawList = (itemList) => {
    return (
      <Grid>
        <Grid.Row columns={8} key={Math.random()}>
         {this.drawingImageShowList(itemList)}
        </Grid.Row>
        </Grid>
    )
  }

  gridImageList = (itemList) =>{
    return (
      <Grid>
        <Grid.Row columns={8} key={Math.random()}>
         {this.imageShowList(itemList)}
        </Grid.Row>
        </Grid>
    )
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

    drawclick = (image) => {
       this.setState({ show: true,modalShowImage:image });
    }

    imageClick = (image) => {
      this.setState({ imageShow: true, modalShowImage:image });
    }
    
    drawDeleteAction = (image,reqId,uniqueId) => {
      const { curState } = this.state
      const obj = {
        requestCode:27,
        imageId:image,
        workrequestid:reqId,
        uniqueId:uniqueId,
      }
      const newObj = Object.assign(obj);
      fetch(API.WORKREQUEST_URI, {
        method: 'post',
        mode:'cors',
        headers: {'Content-Type':'text/plain'},
        body: JSON.stringify(newObj)
      })
      .then(response =>response.json())
      .then((res) => {
        if (res.responsecode === 1) {
          this.setState({drawingImage: res.imageurl,show: false, modalShowImage:""});
        } else {
          this.setState({
             show: false, modalShowImage:""
          });
          toast.error(res.response, { autoClose: 3000 });
        }
      });
    }
    
    imageDeleteAction = (image,reqId,uniqueId) => {
      const obj = {
        requestCode:28,
        imageId:image,
        workrequestid:reqId,
        uniqueId:uniqueId,
      }
      const newObj = Object.assign(obj);
      fetch(API.WORKREQUEST_URI, {
        method: 'post',
        mode:'cors',
        headers: {'Content-Type':'text/plain'},
        body: JSON.stringify(newObj)
      })
      .then(response =>response.json())
      .then((res) => {
        if (res.responsecode === 1) {
          this.setState({images: res.imageurl,imageShow: false, modalShowImage: "" });
        } else {
          this.setState({
             imageShow: false, modalShowImage:""
          });
          toast.error(res.response, { autoClose: 3000 });
        }
      });
    }

    drawingFilepload = (e) => {
      const { curState } = this.state;
      e.preventDefault();
      const drawformData = new FormData();
      drawformData.append("uniqueId", curState.userId);
      drawformData.append("requestCode", 52);
      drawformData.append("workrequestid", curState.listingId);
      for (let i = 0; i < e.target.files.length; i++) {
        drawformData.append("drawingimage[]", e.target.files[i]);
      }
      console.log("drawformData",drawformData);
      fetch(API.WORKREQUEST_URI, {
        method: "post",
        body: drawformData,
      })
        .then((response) => response.json())
        .then((res) => {
          if (res.responsecode === 1) {
            this.setState({drawingImage: res.imageurl});
          } else {
            console.log(res.response);
            // toast.error(res.response, { autoClose: 3000 });
          }
        });
    }

  filepload = (e) => {
    this.setState({ isLoading: true });
    const { curState } = this.state;
    e.preventDefault();
    const formData = new FormData();
    formData.append("uniqueId", curState.userId);
    formData.append("requestCode", 25);
    formData.append("workrequestid", curState.listingId);
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
          this.setState({
            images: res.imageurl,
            isLoading: false,
          });
        } else {
          this.setState({ isLoading: false });
          toast.error(res.response, { autoClose: 3000 });
        }
      });
  };

  render() {
    const { curState, images, isLoading, drawingImage,modalShowImage } = this.state;
    console.log("before submission",curState);
    const imgURL = API.CONTEXT;
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
          {
             this.state.submitBefore === 1 && (curState.userType == 1 || curState.userType == 5) ? (
              <div className="row">
            <div>
              <div className="col-sm-6">
              <label>DrawingImage:</label>
            </div>
            <div className="col-sm-6">
                <input
                  type="file"
                  id="drawingAttachedFiles"
                  name="drawingAttachedFiles"
                  multiple
                  onChange={this.drawingFilepload}
                />
            </div>
            </div>
            </div>
             ):("")}
          {drawingImage.length > 0 && (
            <div className="row">
              <div className="col-sm-2">
              <label>DrawingImage:</label>
              </div>
              <div className="col-sm-10">
              {this.gridDrawList(drawingImage)}
              </div>
            </div>
            )}
            <Modal
          show={this.state.show}
          onHide={this.handleClose}
          dialogClassName="modallg"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {
                curState.userType == 1 || curState.userType == 5 ? (
                  <div>
                    <Button onClick={()=>this.drawDeleteAction(modalShowImage,curState.listingId,curState.userId)}>Delete</Button>
                  </div>
                             ):("")
              }
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
            <Image src={imgURL+"/"+modalShowImage} className="ui centered large image" />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <CustomButton variant="secondary" onClick={this.handleClose}>
              Close
            </CustomButton>
          </Modal.Footer>
        </Modal>
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
          {
             this.state.submitBefore === 1 && (curState.userType == 1 || curState.userType == 5) ? (
               <div>
              <div className="col-sm-6">
              <label>Images:</label>
            </div>
            <div className="col-sm-6">
              {isLoading && <p style={{ color: "green" }}>Loading...</p>}
              {images.length < 6 ? (
                <input
                  type="file"
                  id="drawingAttachedFile"
                  name="drawingAttachedFile"
                  multiple
                  onChange={this.filepload}
                />
              ) : (
                ""
              )}
            </div>
            </div>
             ):("")}
             {images.length > 0 && (
            <div className="row">
              <div className="col-sm-2">
              <label>Images:</label>
              </div>
              <div className="col-sm-10">
              {this.gridImageList(images)}
              </div>
            </div>
            )}
            <Modal
          show={this.state.imageShow}
          onHide={this.handleClose}
          dialogClassName="modallg"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {
                curState.userType == 1 || curState.userType == 5 ? (
                  <div>
                    <Button onClick={()=>this.imageDeleteAction(modalShowImage,curState.listingId,curState.userId)}>Delete</Button>
                  </div>
                             ):("")
              }
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
            <Image src={imgURL+"/"+modalShowImage} className="ui centered large image" />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <CustomButton variant="secondary" onClick={this.handleClose}>
              Close
            </CustomButton>
          </Modal.Footer>
        </Modal>
          </div>
        </div>
      </div>
    );
  }
}
export default WorkRequestPreview;
