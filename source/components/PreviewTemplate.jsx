import React from "react";

import { truncate } from "../common/utility";

class PreviewTemplate extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      checked: false,
    };
  }

  onCheckBoxClick = (e, id) => {
    // e.stopPropagation();
    if (e.target.checked) {
      this.setState({ checked: true });
    } else {
      this.setState({ checked: false });
    }

    this.props.onCheckBoxClickCallBack(e.target.value, e.target.checked);
  };

  render() {
    let {
      detailsArr,
      list,
      elementId,
      checkBoxChecked,
      onClickList,
      data,
      selectedIds,
    } = this.props;
    let checkedValue = checkBoxChecked == true ? true : this.state.checked;
    let index = selectedIds.indexOf(elementId.split("_")[1]);
    checkedValue = index != "-1" ? true : this.state.checked;
    // this.selectedIds.splice(index, 1);
    // console.log(selectedIds, elementId, index);

    return (
      <div
        style={{
          pointerEvents: detailsArr.isNew ? "" : "none",
          color: detailsArr.isNew
            ? "green"
            : detailsArr.isDeleted
            ? "blue"
            : "red",
        }}
      >
        {list === true && data.isNew === true && (
          <span style={{ zIndex: "999" }}>
            <input
              value={detailsArr.workArrangementId}
              checked={checkedValue}
              type="checkbox"
              onChange={this.onCheckBoxClick}
            />{" "}
            &nbsp;
          </span>
        )}
        <span id={elementId} onClick={onClickList}>
          <strong>{detailsArr.projectId}</strong> : {detailsArr.supervisor}{" "}
          &amp; {detailsArr.supervisor2}{" "}
          {detailsArr.workerCount > 0 && (
            <span>
              {/* +{detailsArr.workerCount}pax */}
              {truncate(detailsArr.workerNames, 100000)}
            </span>
          )}
        </span>
        {detailsArr.Remarks && <span>&nbsp;{detailsArr.Remarks}</span>}
      </div>
    );
  }
}
export default PreviewTemplate;
