import { getConsoleLinks } from '../../../utils/resourceUtils';
import { ConsoleLinkKind } from '../../../types';

export const listConsoleLinks = async (): Promise<ConsoleLinkKind[]> => {
  return Promise.resolve(getConsoleLinks());
};
