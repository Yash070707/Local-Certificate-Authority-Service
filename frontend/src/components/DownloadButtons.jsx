import React from 'react';

const DownloadButtons = ({ csrFile, certificateFile }) => {
  return (
    <div className="download-buttons">
      {csrFile && (
        <a href={`http://localhost:5000/download/${csrFile}`} download>
          <button className="btn btn-primary">Download CSR</button>
        </a>
      )}
      {certificateFile && (
        <a href={`http://localhost:5000/download/${certificateFile}`} download>
          <button className="btn btn-primary">Download Certificate</button>
        </a>
      )}
    </div>
  );
};

export default DownloadButtons;
