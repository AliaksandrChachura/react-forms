import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import RHFForm from './components/forms/rhfForm/RHFForm';
import UncontrolledForm from './components/forms/uncontrolled/UncontrolledForm';
import Header from './components/header/Header';
import Modal from './components/modal/Modal';
import { fetchCountries } from './store/slices/selectedCountries';
import { type AppDispatch } from './store';
import { type formValues } from './components/forms/rhfForm/types';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormControlled, setIsFormControlled] = useState(false);
  const [submittedData, setSubmittedData] = useState<formValues | null>(null);
  const [showHighlight, setShowHighlight] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchCountries());
  }, [dispatch]);

  const handleFormSubmit = (data: formValues) => {
    setSubmittedData(data);
    setIsModalOpen(false);
    setShowHighlight(true);

    // Remove highlight after 5 seconds
    setTimeout(() => {
      setShowHighlight(false);
    }, 5000);
  };

  return (
    <>
      <Header
        setIsModalOpen={setIsModalOpen}
        setIsFormControlled={setIsFormControlled}
      />

      {/* Display submitted data on main page */}
      {submittedData && (
        <div className={`submitted-data ${showHighlight ? 'highlight' : ''}`}>
          <h2>Recently Submitted Form Data</h2>
          <div className="data-grid">
            <div className="data-item">
              <strong>Name:</strong> {submittedData.name}
            </div>
            <div className="data-item">
              <strong>Age:</strong> {submittedData.age || 'Not specified'}
            </div>
            <div className="data-item">
              <strong>Email:</strong> {submittedData.email}
            </div>
            <div className="data-item">
              <strong>Gender:</strong> {submittedData.gender}
            </div>
            <div className="data-item">
              <strong>Country:</strong> {submittedData.country}
            </div>
            <div className="data-item">
              <strong>Terms Accepted:</strong>{' '}
              {submittedData.terms ? 'Yes' : 'No'}
            </div>
            {submittedData.image && (
              <div className="data-item">
                <strong>Image:</strong> {submittedData.image.name}
              </div>
            )}
          </div>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
      >
        {isFormControlled ? (
          <RHFForm onSubmit={handleFormSubmit} />
        ) : (
          <UncontrolledForm onSubmit={handleFormSubmit} />
        )}
      </Modal>
    </>
  );
}

export default App;
