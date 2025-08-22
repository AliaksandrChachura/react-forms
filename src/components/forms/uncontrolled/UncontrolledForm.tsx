import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUncontrolledFormValue } from '../../../store/slices/uncontrolledFormSlicer';
import { type formValues } from '../rhfForm/types';

interface UncontrolledFormProps {
  onSubmit: (data: formValues) => void;
}

function UncontrolledForm({ onSubmit }: UncontrolledFormProps) {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState('');
  const [terms, setTerms] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [country, setCountry] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData: formValues = {
      name,
      email,
      password,
      age: null,
      confirmPassword,
      gender,
      terms,
      image,
      country,
    };
    dispatch(setUncontrolledFormValue(formData));
    onSubmit(formData); // Call the parent onSubmit function
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="text"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <input
        type="text"
        placeholder="Gender"
        value={gender}
        onChange={(e) => setGender(e.target.value)}
      />
      <input
        type="checkbox"
        checked={terms}
        onChange={(e) => setTerms(e.target.checked)}
      />
      <input
        type="file"
        onChange={(e) => setImage(e.target.files?.[0] || null)}
      />
      <input
        type="text"
        placeholder="Country"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
      />
      <button type="submit">Submit</button>
    </form>
  );
}

export default UncontrolledForm;
