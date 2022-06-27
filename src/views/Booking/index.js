import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import BookingTable from '../Table';
import { getUrlByAction } from '../../utils/utils';
import { DOCUMENT_CHANGE } from '../../store/actions';
// import axiosInstance from '../../services/axios';

const BookingWrapper = () => {
  const dispatch = useDispatch();

  const [categories, setCategories] = React.useState([]);

  const { projects } = useSelector((state) => state.project);
  const selectedProject = projects.find((project) => project.selected);
  const { selectedFolder } = useSelector((state) => state.folder);

  useEffect(() => {
    async function fetchData() {
      // const categories = await getJobCategories()
      // dispatch({ type: CATEGORY_CHANGE, categories })
      // setCategories(categories)
      dispatch({ type: DOCUMENT_CHANGE, documentType: 'booking' });
    }
    if (selectedProject) {
      fetchData();
    }
  }, [selectedProject]);

  return (
    <React.Fragment>
      <BookingTable
        tableTitle="Tư vấn 1:1"
        url={getUrlByAction(selectedFolder)}
        categories={categories}
        documentType="booking"
        // setFeaturedUrl={}
      />
    </React.Fragment>
  );
};

export default BookingWrapper;
