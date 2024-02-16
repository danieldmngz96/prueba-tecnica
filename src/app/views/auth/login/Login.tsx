import { AuthCard } from "../components/authCard/AuthCard";
import logo from '../../../assets/img/image.jpg';
import accountIcon from '../../../assets/icons/account.svg';
import passwordIcon from '../../../assets/icons/password.svg';
import React, { useContext, useState } from "react";
import { Link, useHistory } from 'react-router-dom';
import { AuthContext } from "../../store/contexts/AuthContext";
import { AuthService } from "../../../services/auth/AuthService";
import { getSpotifyToken } from '../../../services/SpotifyService/SpotifyService';
import { FaEye, FaEyeSlash, FaSpotify } from 'react-icons/fa'; // Importar iconos de ojo abierto y cerrado
import Swal from "sweetalert2";
import axios from "axios";

interface GlobalType {
  client_id: string;
  redirect_uri: string;
  scopes: string;
}

const Global: GlobalType = {
  client_id: 'tu_client_id',
  redirect_uri: 'tu_redirect_uri',
  scopes: 'tus_scopes'
};

export function Login() {
  const { dispatchUser }: any = useContext(AuthContext);
  const [auth, setAuth] = useState({ username: '', password: '' });
  const history = useHistory();
  const [shown, setShown] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const resp:any = await AuthService.login(auth);
      console.log(resp); 
      if (resp ) {
        const firstUser = resp;
        console.log(firstUser)
        if (firstUser && firstUser) {
          Swal.fire({
            icon: 'success',
            title: 'Credenciales exitosas',
            text: `¡BIENVENIDO  ${resp['user']['nombres']} A TU REPRODUCTOR DE TU CONSTRUCTORA !`,
          });
        }
       
        console.log(resp);
        const token = await getSpotifyToken();
        sessionStorage.setItem('user', JSON.stringify({ ...resp.data, loggedIn: true }));
        dispatchUser({ type: 'login', payload: resp.data });
        history.push('/dashboard/home');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Credenciales inválidas',
          text: 'Por favor, verifica tus credenciales e intenta nuevamente.',
        });
        console.log(resp)
      }
    } catch (error) {
      console.error('Error en inicio de sesión:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuth({
      ...auth,
      [e.target.name]: e.target.value
    });
  };

  const spoty_url = `https://accounts.spotify.com/authorize?client_id=${Global.client_id}&response_type=code&redirect_uri=${Global.redirect_uri}&scope=${Global.scopes}`;

  const handleSpotifyLogin = () => {
    window.location.replace(spoty_url);
  };

  return (
    <AuthCard>
      <form onSubmit={handleSubmit} autoComplete="off">
        <div className="text-center mb-2">
          <img className="img-fluid" src={logo} alt="logo" />
        </div>

        <div className="mb-2 p-1 d-flex border rounded">
          <div className="mx-2 mt-1">
            <img className="img-fluid" src={accountIcon} alt="iconUser" />
          </div>
          <input
            autoFocus
            className="form-control border-0 txt-input"
            name="username"
            type="text"
            placeholder="Username"
            onChange={handleChange}
          />
        </div>

        <div className="mb-2 p-1 d-flex border rounded">
          <div className="mx-2 mt-1">
            {shown ? (
              <FaEyeSlash onClick={() => setShown(false)} />
            ) : (
              <FaEye onClick={() => setShown(true)} />
            )}
          </div>
          <input
            className="form-control border-0 txt-input"
            name="password"
            type={shown ? 'text' : 'password'}
            placeholder="Password"
            onChange={handleChange}
          />
        </div>

        <div className="row d-flex justify-content-between mt-3 mb-2">
          <div className="mb-3">
            <div className="form-check ms-1">
              <input type="checkbox" className="form-check-input" id="mycheckbox" />
              <label className="form-check-label" htmlFor="mycheckbox">Recuerdame</label>
            </div>
          </div>
        </div>
        <div className="d-grid gap-2">
          <button type="submit" className="btn" style={{ backgroundColor: 'var(--green)', color: 'var(--white)' }}>Entrar</button>
        </div>

        <div className="mt-3 mb-3 text-center">
          <Link to="/auth/recover">¿Has olvidado tu contraseña?</Link>
        </div>

        <div className="mt-3 mb-3 text-center">
          <h6>¿No tienes una cuenta?</h6>
          <Link to="/auth/register">Register</Link>
        </div>

        {/* Botón para iniciar sesión con Spotify */}
        <div className="d-flex justify-content-center align-items-center">
          <button onClick={handleSpotifyLogin} className="btn btn-success">
            <FaSpotify className="me-2" /> Iniciar sesión con Spotify
          </button>
        </div>
      </form>
    </AuthCard>
  );
}
