import {BooleanFunction} from './types';

export const reload = (maxCount: number) => (shouldReload: BooleanFunction) => {
  let count = 0;

  return (response: any) => {
    if (shouldReload(response) && count < maxCount) {
      count += 1;

      return true;
    }

    return false;
  };
};

export const reloadOnce = reload(1);

export const reloadTwice = reload(2);
