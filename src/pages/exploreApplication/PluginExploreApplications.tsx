import * as React from 'react';
import { Provider } from 'react-redux';
import { store } from '../../redux/store/store';
import ExploreApplications from './ExploreApplications';

/**
/**
 * Main function
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PluginExploreApplications: React.FC = () => {
  return (
    <React.StrictMode>
      <Provider store={store}>
        <ExploreApplications />
      </Provider>
    </React.StrictMode>
  );
};

export default PluginExploreApplications;
