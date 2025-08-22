import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import RHFForm from './components/forms/rhfForm/ControlledForm';
import UncontrolledForm from './components/forms/uncontrolled/UncontrolledForm';
import Header from './components/header/Header';
import Modal from './components/modal/Modal';
import SubmittedDataDisplay from './components/submittedData/SubmittedDataDisplay';
import { fetchCountries } from './store/slices/selectedCountries';
import { type AppDispatch } from './store';
import { type FormSchema } from './components/forms/rhfForm/schema';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormControlled, setIsFormControlled] = useState(false);
  const [submittedData, setSubmittedData] = useState<FormSchema | null>(null);
  const [showHighlight, setShowHighlight] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchCountries());
  }, [dispatch]);

  const handleFormSubmit = (data: FormSchema) => {
    setSubmittedData(data);
    setIsModalOpen(false);
    setShowHighlight(true);

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

      {submittedData && (
        <SubmittedDataDisplay
          data={submittedData}
          showHighlight={showHighlight}
        />
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
