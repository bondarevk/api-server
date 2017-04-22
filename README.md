####NodeJS Web сервер с авторизацией.

>MongoDB, Express, Passport, JWT

Запуск:
```
npm i
npm start
```

Роутинг: 

```
/api/auth/login         | Аутентификация
/api/auth/reset         | Изменение пароля
/api/auth/register      | Регистрация пользователя

/api/test/admin-only    | 5+ Уровень доступа
/api/test/member-only   | 1+ Уровень доступа
```

>Проверить работоспособность api можно с помощью curl.
