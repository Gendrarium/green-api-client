import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { handleLogin, selectLoggedIn } from '../../store/slices/user';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [id, setId] = useState('');
  const [apiToken, setApiToken] = useState('');
  const [error, setError] = useState('');
  const dispatch = useAppDispatch();
  const loggedIn = useAppSelector(selectLoggedIn);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!id || !apiToken) {
      setError('Заполните все поля.');
      return;
    }

    localStorage.setItem('idInstance', id);
    localStorage.setItem('apiTokenInstance', apiToken);
    dispatch(handleLogin(id, apiToken));
  };

  useEffect(() => {
    if (loggedIn) {
      navigate('/');
    }
  }, [loggedIn, navigate]);

  return (
    <section className="login">
      <form className="login__form" onSubmit={handleSubmit}>
        <h2 className="login__title">
          Введите данные из личного кабинета Green Api
        </h2>
        <input
          className={`login__input${error && !id ? ' login__input_error' : ''}`}
          name="id"
          onChange={(e) => setId(e.target.value)}
          placeholder="IdInstance"
        />
        <input
          className={`login__input${
            error && !apiToken ? ' login__input_error' : ''
          }`}
          name="apiToken"
          onChange={(e) => setApiToken(e.target.value)}
          placeholder="ApiTokenInstance"
        />
        <span className="login__error">
          {(!id || !apiToken) && error && error}
        </span>
        <button className="login__submit" type="submit">
          Отправить
        </button>
      </form>
    </section>
  );
};

export default Login;
