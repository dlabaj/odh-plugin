import * as React from 'react';
import { Provider } from 'react-redux';
import { store } from '../../redux/store/store';
import EnabledApplications from './EnabledApplications';

/**
/**
 * Main function
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PluginEnabledApplications: React.FC = () => {
  return (
    <React.StrictMode>
      <Provider store={store}>
        <EnabledApplications />
      </Provider>
    </React.StrictMode>
  );
};

export default PluginEnabledApplications;
