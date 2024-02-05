import { AuthContext } from './app/views/store/contexts/AuthContext'
import './App.css';
import { useReducer } from 'react';
import { authReducer } from './app/views/store/reducers/authReducer';
import { AppRouter } from './app/router/AppRouter';

const init = () => {
  let sessionUser: any = sessionStorage.getItem('user');
  let user: any
  if (!sessionUser) {
    user = sessionUser
  } else {
    user = JSON.parse(sessionUser);
  }
  return user;
}

function App() {
  const [user , dispatchUser ] = useReducer(authReducer, {}, init)
  useReducer(authReducer, {}, init)
  return (
    <AuthContext.Provider value={{user, dispatchUser}}>
      <AppRouter/>
    </AuthContext.Provider>
  );
}

export default App;
