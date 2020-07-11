import React, { Component } from "react";
import { Alert } from "react-bootstrap";
import CustomButton from "./CustomButton";
import TeamPreview from "../components/TeamPreview";
import MaterialPreview from "../components/MaterialPreview";

export default class WorkRequestDWTRPreview extends Component {
  displayManpowerList = (teamList, workRequestId) => {
    const finalTeamList = teamList.filter((team) => {
      return workRequestId === team.subdivision;
    });

    return finalTeamList.map((item) => {
      return (
        <TeamPreview
          index={item.uniqueId}
          item={item}
          onClose={this.props.deleteTeamItem}
        />
      );
    });
  };

  displayMaterialList = (data, workRequestId) => {
    const finalMaterialList = data.filter((material) => {
      return workRequestId === material.subdivision;
    });
    return finalMaterialList.map((item) => {
      return (
        <MaterialPreview
          index={item.uniqueId}
          item={item}
          onClose={this.props.deleteMaterialItem}
        />
      );
    });
  };

  render() {
    const { item, onClose, index } = this.props;
    return (
      <Alert
        bsStyle="info"
        onDismiss={() => onClose(index, item.value_subdivision)}
        key={index}
      >
        <div>
          Sub Division : {item.text_subdivision}, Desc: {item.desc}
        </div>

        <div className="row " style={{ marginTop: "10px" }}>
          <div className="col-xs-6 strong">
            <b> Manpower:</b>
          </div>
          <div className="col-xs-6">
            <CustomButton
              bsStyle="warning"
              width="20%"
              onClick={() =>
                this.props.displayManpowerPopup(item.value_subdivision)
              }
            >
              Add Manpower
            </CustomButton>
          </div>
        </div>

        <div className="row ">
          <div className="col-xs-12">
            {this.props.teamList.length > 0 &&
              this.displayManpowerList(
                this.props.teamList,
                item.value_subdivision
              )}
          </div>
        </div>
        <div className="row ">
          <div className="col-xs-6 strong">Material:</div>
          <div className="col-xs-6">
            <CustomButton
              bsStyle="info"
              width="20%"
              onClick={() =>
                this.props.displayMaterialPopup(item.value_subdivision)
              }
            >
              Add Material
            </CustomButton>
          </div>
        </div>
        <div className="row ">
          <div className="col-xs-12">
            {this.props.materialList.length > 0 &&
              this.displayMaterialList(
                this.props.materialList,
                item.value_subdivision
              )}
          </div>
        </div>
      </Alert>
    );
  }
}
