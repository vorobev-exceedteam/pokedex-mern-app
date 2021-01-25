import {createContext, memo} from 'react';

import ProfileStore from "../stores/ProfileStore";

export const ProfileContext = createContext(null);

export const ProfileProvider = memo((props) => (
  <ProfileContext.Provider value={new ProfileStore()}>
    {props.children}
  </ProfileContext.Provider>
));
