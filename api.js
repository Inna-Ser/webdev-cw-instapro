// Замени на свой, чтобы получить независимый от других набор данных.

// "боевая" версия инстапро лежит в ключе prod
const personalKey = "innaSerebriakova";
const baseHost = "https://webdev-hw-api.vercel.app";
const postsHost = `${baseHost}/api/v1/${personalKey}/instapro`;

export function getPosts({
  token
}) {
  return fetch(postsHost, {
      method: "GET",
      headers: {
        Authorization: token,
      },
    })
    .then((response) => {
      if (response.status === 401) {
        throw new Error("Нет авторизации");
      }
      return response.json();
    })
    .then((data) => {
      return data.posts;
    });
}

export function getUserPosts({
  token,
  id
}) {
  return fetch(`${postsHost}/user-posts/${id}`, {
      method: "GET",
      headers: {
        Authorization: token,
      },
    })
    .then((response) => {
      if (response.status === 401) {
        throw new Error("Нет авторизации");
      }
      return response.json();
    })
    .then((data) => {
      return data.posts;
    });
}
// https://github.com/GlebkaF/webdev-hw-api/blob/main/pages/api/user/README.md#%D0%B0%D0%B2%D1%82%D0%BE%D1%80%D0%B8%D0%B7%D0%BE%D0%B2%D0%B0%D1%82%D1%8C%D1%81%D1%8F
export function registerUser({
  login,
  password,
  name,
  imageUrl
}) {
  return fetch(baseHost + "/api/user", {
    method: "POST",
    body: JSON.stringify({
      login: login,
      password,
      name: name,
      imageUrl,
    }),
  }).then((response) => {
    if (response.status === 400) {
      throw new Error("Такой пользователь уже существует");
    }
    return response.json();
  });
}

export function loginUser({
  login,
  password
}) {
  return fetch(baseHost + "/api/user/login", {
    method: "POST",
    body: JSON.stringify({
      login: login,
      password,
    }),
  }).then((response) => {
    if (response.status === 400) {
      throw new Error("Неверный логин или пароль");
    }
    return response.json();
  });
}

// Загружает картинку в облако, возвращает url загруженной картинки
export function uploadImage({
  file
}) {
  const data = new FormData();
  data.append("file", file);

  return fetch(baseHost + "/api/upload/image", {
    method: "POST",
    body: data,
  }).then((response) => {
    return response.json();
  });
}

export function toDoPost({
  postText,
  token,
  imageUrl
}) {
  return fetch(postsHost, {
      method: "POST",
      headers: {
        Authorization: token
      },
      body: JSON.stringify({
        description: postText,
        imageUrl
      }),
    })
    .then((response) => {
      if (response.status === 400) {
        throw new Error("Поле ввода картинки и/или описания не должно быть пустым")
      }
      return response.json();
    })
}

export function pushLikeButton({
  token,
  id
}) {
  return fetch(`${postsHost}/${id}/like`, {
      method: "POST",
      headers: {
        Authorization: token
      }
    })
    .then((response) => {
      if (response.status === 401) {
        alert("Нет авторизации");
      } else
        return response.json();
    })
    .then((data) => {
      return data.post;
    })
}

export function cancelLikeButton({
  token,
  id
}) {
  return fetch(`${postsHost}/${id}/dislike`, {
      method: "POST",
      headers: {
        Authorization: token
      }
    })
    .then((response) => {
      if (response.status === 401) {
        alert("Нет авторизации");
      } else
        return response.json();
    })
    .then((data) => {
      return data.post;
    })
}

export function deletePost({
  token,
  id
}) {
  return fetch(`${postsHost}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: token
    }
  })
}