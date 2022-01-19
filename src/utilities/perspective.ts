import testIcon from '../components/test-icon';

export const icon = { default: testIcon };

export const getLandingPageURL = () => '/enabledApplications';

export const getImportRedirectURL = (namespace: string) =>
  `/k8s/cluster/projects/${namespace}/workloads`;
