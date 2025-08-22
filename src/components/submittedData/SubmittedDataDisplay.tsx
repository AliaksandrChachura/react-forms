import { type FormSchema } from '../forms/rhfForm/schema';

interface SubmittedDataDisplayProps {
  data: FormSchema;
  showHighlight: boolean;
}

function SubmittedDataDisplay({
  data,
  showHighlight,
}: SubmittedDataDisplayProps) {
  return (
    <div className={`submitted-data ${showHighlight ? 'highlight' : ''}`}>
      <h2>Recently Submitted Form Data</h2>
      <div className="data-grid">
        <div className="data-item">
          <strong>Name:</strong> {data.name}
        </div>
        <div className="data-item">
          <strong>Age:</strong> {data.age || 'Not specified'}
        </div>
        <div className="data-item">
          <strong>Email:</strong> {data.email}
        </div>
        <div className="data-item">
          <strong>Gender:</strong> {data.gender}
        </div>
        <div className="data-item">
          <strong>Country:</strong> {data.country}
        </div>
        <div className="data-item">
          <strong>Terms Accepted:</strong> {data.terms ? 'Yes' : 'No'}
        </div>
        {data.imageBase64 && (
          <div className="data-item">
            <strong>Image:</strong>
            <div className="image-display">
              <img
                src={data.imageBase64}
                alt="Uploaded"
                style={{
                  maxWidth: '100px',
                  maxHeight: '100px',
                  marginTop: '0.5rem',
                  borderRadius: '4px',
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SubmittedDataDisplay;
