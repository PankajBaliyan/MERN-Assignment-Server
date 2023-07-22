# User Authentication

## Create Users

POST - http://localhost:3001/users

### Sample user

```
{
  "username": "Admin",
  "email": "Admin@gmail.com",
  "password": "Admin"
}
```

<hr>

## Get all users (list)

GET - http://localhost:3001/users

### Sample users

```
[
  {
    "_id": "64bac45b12ea86fa26d58d63",
    "username": "Pankaj",
    "email": "Pankaj@gmail.com",
    "password": "$2b$10$/YBII6G1Mxc9UomNezJ5ueW4XX1ey.xz4PllD9lqRj4HJGcHPSASC",
    "__v": 0
  },
  {
    "_id": "64bac90bda3c8ac41988dc04",
    "username": "Admin",
    "email": "Admin@gmail.com",
    "password": "$2b$10$g78aaI1V0AV0rUJz0adCjO5VDekSJzQZws9KAjgaeWvgRjh1Tsm1u",
    "__v": 0
  }
]
```
