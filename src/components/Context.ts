import {createContext} from 'react';

import {MayBeRequestContext} from '../types';

export const Context = createContext<MayBeRequestContext>(null);
