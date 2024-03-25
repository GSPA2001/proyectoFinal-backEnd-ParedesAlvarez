# Proyecto Final: Backend de una aplicación ecommerce

- Curso de programación BackEnd - CoderHouse

## Author

- Gisel Sthefania Paredes Alvarez

## Métodos node utilizados 

Instalación:
* npm init -y (e instalación de nodemon)
* npm install @faker-js/faker
* npm install bcrypt
* npm install chalk (para color en logger porque no me funciono colorize())
* npm install commander
* npm install connect-mongo
* npm install cookie-parser
* npm install cors
* npm install dotenv (para el archivo .env)
* npm install express
* npm install express-handlebars
* npm install express-session
* npm install jsonwebtoken
* npm install mongodb
* npm install mongoose
* npm install mongoose-paginate-v2
* npm install multer
* npm install nodemailer
* npm install passport
* npm install passport-github2
* npm install passport-local
* npm install session-file-store
* npm install socket.io
* npm install swagger-jsdoc 
* npm install swagger-ui-express
* npm install winston
* npm install --save-dev chai
* npm install --save-dev mocha
* npm install --save-dev supertest
* Para visualización, en terminal: npm run start
## Comandos para correr los test
* Para el test npx mocha test/*.test.js

## Funcionamiento de los endpoints:
* Al acceder a http://localhost:8080/api/products, se obtienen todos los productos.
* Al acceder a http://localhost:8080/api/carts, se obtienen todos los carritos.
* Al acceder a http://localhost:8080/api/users, se obtienen todos los usuarios registrados. Y para ver el uso de faker http://localhost:8080/api/users/mock/2
* Al acceder a http://localhost:8080/mockingproducts, se obtienen los mockingproducts.
* Al acceder a http://localhost:8080/loggerTest, se obtienen logger.

## Endpoints de handlebars:
- **Página de index:** http://localhost:8080/
- **Página de register:** http://localhost:8080/register
- **Página login:** http://localhost:8080/login/
- **Página de cookies:** http://localhost:8080/cookies
- **Página de chat:** http://localhost:8080/chat
- * Para ver products, profile, users hay que hacer login
- **Página products:** http://localhost:8080/products
- **Página login:** http://localhost:8080/profile
- **Página users:** http://localhost:8080/users
(Para entrar como ADMIN, luego de registrase salir y hacer login, solo asi podra ver users)
- **Página API:** http://localhost:8080/api/docs/

## Used by

Este proyecto es solamente de uso para ejemplo de clase, su estructura no puede ser o debiera ser tomada necesariamente como propuesta para un proyecto real.
Este proyecto es para cumplir con el Proyecto Final: Backend de una aplicación ecommerce, del curso de programación backend de coderhouse.