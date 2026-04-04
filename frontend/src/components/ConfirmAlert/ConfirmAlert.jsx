import React from "react";
import './ConfirmAlert.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation, faClose, faCross } from "@fortawesome/free-solid-svg-icons";

const ConfirmAlert = ({ open, message, onConfirm, onCancel }) => {
  if (!open) return null;

  return (
    <div className="overlay">
      <div className="box">
        <div className="icon">
            <FontAwesomeIcon icon={faCircleExclamation} style={{height:'3em'}}/>
        </div>
        <p style={{color:'black',fontWeight:'600',fontSize:'15px'}}>Confirm Deletion</p>
        <p style={{color:'black'}}>{message}</p>
        <div className="actions">
          <button onClick={onCancel} className="confirmCancelButton">Cancel</button>
          <button onClick={onConfirm} className="confirmDeleteButton">Yes, Delete it</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmAlert;