import express from 'express';
import { PORT, SECRET_JWT_KEY, SECRET_REFRESH_JWT_KEY } from './config.js';
import { UserRepository } from './user-repository.js';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import axios from 'axios';

const app = express();

app.set('view engine', 'ejs');

// cookieParser analiza las cookies adjuntas en las solicitudes HTTP entrantes (request)
// y las hace accesibles en el objeto req.cookies.
// Permite establecer cookies en las respuestas HTTP utilizando res.cookie().
app.use(express.json());
app.use(cookieParser());

app.use(async (req, res, next) => {
  const accessToken = req.cookies.access_token;
  req.session = { user: null }; // Importante inicializar req.session.user en null
  // Si no hay access token, continuar sin autenticación
  if (!accessToken) {
    return next();
  }

  try {
    // Verificar el access token
    const data = jwt.verify(accessToken, SECRET_JWT_KEY);
    req.session.user = data;
    return next();
  } catch (error) {
    // Si el access token ha caducado, intentar renovarlo con el refresh token
    if (error.name === 'TokenExpiredError') {
      try {
        // Hacer una solicitud interna a /refresh_token
        const response = await axios.post(`http://localhost:${PORT}/refresh`,
          {}, {
            headers: {
              Cookie: `refresh_token=${req.cookies.refresh_token}`
            }
          }
        );
        // Actualizar la cookie del access token
        const { accessToken } = response.data;
        res.cookie('access_token', accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 1000 * 60 * 60
        });
        // Verificar el nuevo access token y devolver el usuario a session
        const data = jwt.verify(accessToken, SECRET_JWT_KEY);
        console.log('New access token generated:', data);
        req.session.user = data;
        return next();
      } catch (error) {
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');
        req.session = { user: null };
        return next();
      }
    }
  }
  // Si el access_token es inválido por otro motivo que no sea expiración (por ejemplo, firma incorrecta, manipulación del token, etc.).
  req.session = { user: null };
  next();
});

app.get('/', (req, res) => {
  const { user } = req.session;
  res.render('index', user);
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await UserRepository.login({ username, password });
    const accessToken = jwt.sign(
      { id: user._id, username: user.username },
      SECRET_JWT_KEY,
      {
        expiresIn: '10s'
      });

    const refreshToken = jwt.sign(
      {
        id: user._id,
        username: user.username
      },
      SECRET_REFRESH_JWT_KEY,
      {
        expiresIn: '7d'
      });

    res.cookie('access_token', accessToken,
      {
        httpOnly: true, // La cookie solo puede ser accedida a través de HHTP, no puede ser leída desde JavaScript
        secure: process.env.NODE_ENV === 'production', // Para que solo funcione con HHTPS si estamos en producción
        sameSite: 'strict', //  La cookie no se envía en ninguna solicitud entre sitios (cross-site), incluso si el usuario hace clic en un enlace que lleva a otro sitio
        maxAge: 1000 * 60 * 60 // 1 hora
      });
    res.cookie('refresh_token', refreshToken,
      {
        httpOnly: true, // La cookie solo puede ser accedida a través de HHTP, no puede ser leída desde JavaScript
        secure: process.env.NODE_ENV === 'production', // Para que solo funcione con HHTPS si estamos en producción
        sameSite: 'strict', //  La cookie no se envía en ninguna solicitud entre sitios (cross-site), incluso si el usuario hace clic en un enlace que lleva a otro sitio
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 días
      });

    res.status(200).send({ user });
  } catch (error) {
    res.status(401).json({ error: JSON.parse(error.message) });
  }
});
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const id = await UserRepository.create({ username, password });
    res.send({ id });
  } catch (error) {
    res.status(400).json({ error: JSON.parse(error.message) });
  }
});
app.post('/logout', (req, res) => {
  res.clearCookie('access_token').send('Successful logout');
});

app.get('/protected', (req, res) => {
  const { user } = req.session;
  if (!user) return res.status(401).send('Access not authorizes');
  res.render('protected', user);
});

app.post('/refresh', (req, res) => {
  const refreshToken = req.cookies.refresh_token;
  if (!refreshToken) return res.status(401).json({ message: 'Refresh token missing' });
  try {
    const user = jwt.verify(refreshToken, SECRET_REFRESH_JWT_KEY);
    const newAccessToken = jwt.sign(
      { id: user._id, username: user.username },
      SECRET_JWT_KEY,
      {
        expiresIn: '10s'
      });
    return res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.clearCookie('refresh_token');
    res.status(401).json({ message: 'Invalid refresh token' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
});
