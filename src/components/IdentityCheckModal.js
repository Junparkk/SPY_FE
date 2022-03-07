import React from 'react';
import { createPortal } from 'react-dom';

const IdentityCheckModal = (props) => {
  const { message } = props;
  return createPortal(
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'fixed',
        bottom: 30,
        left: 0,
        width: '100%',
        height: 50,
      }}
    >
      <div
        style={{
          width: '30%',
          textAlign: 'center',
          borderRadius: 30,
          background: 'grey',
          fontSize: 20,
          color: 'white',
        }}
      >
        {message}
      </div>
    </div>,
    document.getElementById('IdentityCheckModal')
  );
};

export default IdentityCheckModal;
