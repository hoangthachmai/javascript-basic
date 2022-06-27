import React, { createContext } from 'react';
import { PROJECT_CHANGE } from '../store/actions';
import { vibEndpoints } from '../store/constant';
import axiosInstance from '../services/axios';
import { useDispatch } from 'react-redux';

const ProjectContext = createContext({
  getProjects: () => Promise.resolve(),
});

export const ProjectProvider = ({ children }) => {
  const dispatch = useDispatch();

  function getProjects() {
    axiosInstance
      .post(vibEndpoints.get_project_list, { outputtype: 'RawJson' })
      .then((response) => {
        if (response.status === 200 && response.data.return === 200) {
          const { data: projects } = response.data;
          if (projects.length > 0) projects[0].selected = true;

          dispatch({
            type: PROJECT_CHANGE,
            projects,
          });
        }
      });
  }

  return <ProjectContext.Provider value={{ getProjects }}>{children}</ProjectContext.Provider>;
};

export default ProjectContext;
