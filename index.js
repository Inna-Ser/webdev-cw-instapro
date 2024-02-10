import {
  getPosts,
  getUserPosts,
  toDoPost
} from "./api.js";
import {
  renderAddPostPageComponent,
} from "./components/add-post-page-component.js";
import {
  renderAuthPageComponent
} from "./components/auth-page-component.js";
import {
  ADD_POSTS_PAGE,
  AUTH_PAGE,
  LOADING_PAGE,
  POSTS_PAGE,
  USER_POSTS_PAGE,
} from "./routes.js";
import {
  renderPostsPageComponent
} from "./components/posts-page-component.js";
import {
  renderLoadingPageComponent
} from "./components/loading-page-component.js";
import {
  getUserFromLocalStorage,
  removeUserFromLocalStorage,
  saveUserToLocalStorage,
} from "./helpers.js";
import {
  userPostsPageComponents
} from "./components/user-posts-page-components.js";

export let user = getUserFromLocalStorage();
export let page = null;
export let posts = [];

const getToken = () => {
  const token = user ? `Bearer ${user.token}` : undefined;
  return token;
};

export const logout = () => {
  user = null;
  removeUserFromLocalStorage();
  goToPage(POSTS_PAGE);
};
/**
 * Включает страницу приложения
 */
export const goToPage = (newPage, data) => {

  if (
    [
      POSTS_PAGE,
      AUTH_PAGE,
      ADD_POSTS_PAGE,
      USER_POSTS_PAGE,
      LOADING_PAGE,
    ].includes(newPage)
  ) {

    if (newPage === ADD_POSTS_PAGE) {
      page = user ? ADD_POSTS_PAGE : AUTH_PAGE;
      return renderApp();
    }

    if (newPage === POSTS_PAGE) {
      page = LOADING_PAGE;
      renderApp();

      return getPosts({
          token: getToken()
        })
        .then((newPosts) => {
          page = POSTS_PAGE;
          posts = newPosts;
          renderApp();
        })
        .catch((error) => {
          goToPage(POSTS_PAGE);
        });
    }

    if (newPage === USER_POSTS_PAGE) {
      page = LOADING_PAGE;
      renderApp();
      const postUserId = document.getElementById("${post.user.id}")
      return getUserPosts({
          token: getToken(),
          id: data.userId
        })
        .then((userPosts) => {
          page = newPage;
          page = USER_POSTS_PAGE;
          posts = userPosts;
          renderApp(data.userId);
        })
    }

    if (newPage === AUTH_PAGE) {
      page = LOADING_PAGE;
      const appEl = document.getElementById("app");
      return renderAuthPageComponent({
        appEl,
        setUser: (newUser) => {
          user = newUser;
          saveUserToLocalStorage(user);
          goToPage(POSTS_PAGE);
        },
        user,
        goToPage,
      });
    }
    throw new Error("страницы не существует");
  };
}

const renderApp = (id) => {
  const appEl = document.getElementById("app");
  if (page === LOADING_PAGE) {
    return renderLoadingPageComponent({
      appEl,
      user,
      goToPage,
    });
  }

  if (page === AUTH_PAGE) {
    return renderAuthPageComponent({
      appEl,
      setUser: (newUser) => {
        user = newUser;
        saveUserToLocalStorage(user);
        goToPage(POSTS_PAGE);
      },
      user,
      goToPage,
    });
  }

  if (page === ADD_POSTS_PAGE) {
    return renderAddPostPageComponent({
      appEl,
      onAddPostClick({
        description,
        imageUrl
      }) {
        const setError = (message) => {
          appEl.querySelector(".form-error").textContent = message;
        };
        setError("");
        toDoPost({
            postText: description,
            token: getToken(),
            imageUrl: imageUrl
          })
          .then(() => {
            goToPage(POSTS_PAGE)
          })
          .catch((error) => {
            setError(error.message);
          })
      },
    });
  }

  if (page === POSTS_PAGE) {
    return renderPostsPageComponent({
      appEl,
      getToken
    })
  }

  if (page === USER_POSTS_PAGE) {
    return userPostsPageComponents({
      appEl,
      getToken,
      id
    });
  }
};

goToPage(POSTS_PAGE);