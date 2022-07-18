import { useContext } from 'react';
import MentorContext from '../contexts/MentorContext';
const useMentor = () => useContext(MentorContext);

export default useMentor;