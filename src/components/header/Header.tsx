import { useState, useEffect } from 'react';

function Header({
  setIsModalOpen,
  setIsFormControlled,
}: {
  setIsModalOpen: (isOpen: boolean) => void;
  setIsFormControlled: (isFormControlled: boolean) => void;
}) {
  const [activeButton, setActiveButton] = useState<string | null>(null);

  const handleButtonClick = (buttonType: string, isControlled: boolean) => {
    setActiveButton(buttonType);
    setIsModalOpen(true);
    setIsFormControlled(isControlled);
  };

  useEffect(() => {
    const handleModalClose = () => {
      setActiveButton(null);
    };

    window.addEventListener('modal-close', handleModalClose);

    return () => {
      window.removeEventListener('modal-close', handleModalClose);
    };
  }, []);

  return (
    <header className="header">
      <button
        onClick={() => handleButtonClick('controlled', true)}
        style={{
          backgroundColor: activeButton === 'controlled' ? '#4CAF50' : '',
        }}
      >
        Controlled
      </button>
      <button
        onClick={() => handleButtonClick('uncontrolled', false)}
        style={{
          backgroundColor: activeButton === 'uncontrolled' ? '#4CAF50' : '',
        }}
      >
        Uncontrolled
      </button>
    </header>
  );
}

export default Header;
