import { AuthCard } from "../components/authCard/AuthCard";
import logo from '../../../assets/img/image.jpg';
import accountIcon from '../../../assets/icons/account.svg';
import passwordIcon from '../../../assets/icons/password.svg';
import React, { useContext, useState } from "react";
import { Link, useHistory } from 'react-router-dom';
import { AuthContext } from "../../store/contexts/AuthContext";
import { AuthService } from "../../../services/auth/AuthService";
import { getSpotifyToken} from '../../../services/SpotifyService/SpotifyService';

export function Login() {
  const { dispatchUser }: any = useContext(AuthContext);
  const [auth, setAuth] = useState({ username: '', password: '' })
  const history = useHistory();

/*   const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const resp = await AuthService.login(auth);
      console.log(resp)
      if (resp.success) {
        sessionStorage.setItem('user', JSON.stringify({ ...resp.data, loggedIn: true }));
        dispatchUser({ type: 'login', payload: resp.data });
        history.push('/dashboard/home'); 
      }
    } catch (error) {

    }
  } */

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    try {
      const resp = await AuthService.login(auth);
      if (resp) {
        console.log(resp);
        const tokenValidator = await getSpotifyToken();
        // Guardar datos de usuario en sesión
        sessionStorage.setItem('user', JSON.stringify({ ...resp, loggedIn: true }));
        // Redireccionar a dashboard
        history.push('/dashboard/home');
      } else {
        alert('Credenciales inválidas');
      }
    } catch (error) {
      console.error('Error en inicio de sesión:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLFormElement | HTMLInputElement>) => {
    setAuth({
      ...auth,
      [e.target.name]: e.target.value
    })
  }

  return (
    <AuthCard>
      <form onSubmit={handleSubmit} autoComplete="off">
        <div className="text-center mb-2">
          <img
            className="img-fluid"
            src={logo}
            alt="logo"
          />
        </div>

        <div className="mb-2 p-1 d-flex border rounded">
          <div className="mx-2 mt-1">
            <img
              className="img-fluid"
              src={accountIcon}
              alt="iconUser" />
          </div>
          <input
            autoFocus
            className="form-control border-0 txt-input"
            name="username"
            type="text"
            placeholder="Username"
            onChange={e => handleChange(e)}
          />
        </div>

        <div className="mb-2 p-1 d-flex border rounded">
          <div className="mx-2 mt-1">
            <img
              className="img-fluid"
              src={passwordIcon}
              alt="iconUser" />
          </div>
          <input
            className="form-control border-0  txt-input"
            name="password"
            type="password"
            placeholder="Password"
            onChange={e => handleChange(e)}
          />
        </div>

        <div className="row d-flex justify-content-between mt-3 mb-2">
          <div className="mb-3">
            <div className="form-check ms-1">
              <input
                type="checkbox"
                className="form-check-input"
                id="mycheckbox"
              />
              <label className="form-check-label" htmlFor="mycheckbox">
                Recuerdame
              </label>
            </div>
          </div>
        </div>
        <div className="d-grid gap-2">
          <button type="submit" className="btn" style={{ backgroundColor: 'var(--green)', color: 'var(--white)' }}>
            Entrar
          </button>
        </div>

        <div className="mt-3 mb-3 text-center">
          <Link to="/auth/recover">¿Has olvidado tu contraseña?</Link>
        </div>

        <div className="mt-3 mb-3 text-center">
          <h6>'¿No tienes una cuenta?'</h6>
          <Link to="/auth/register">Register</Link>
        </div>
      </form>
    </AuthCard>
  );
}