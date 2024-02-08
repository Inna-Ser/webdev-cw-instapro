import {
  USER_POSTS_PAGE
} from "../routes.js";
import {
  renderHeaderComponent
} from "./header-component.js";
import {
  posts,
  goToPage
} from "../index.js";
import {
  cancelLikeButton,
  pushLikeButton
} from "../api.js";
import {
  formatDistanceToNow
} from "date-fns";
import {
  ru
} from "date-fns/locale";

export function renderPostsPageComponent({
  appEl,
  getToken
}) {
  // TODO: реализовать рендер постов из api
  console.log("Актуальный список постов:", posts);

  /**
   * TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
   * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
   */
  const locales = {
    ru
  }
  const postListHTML = posts.map((post) => {
      return `<li class="post">
    <div class="post-header" data-user-id="${post.user.id}">
        <img src="${post.user.imageUrl}" class="post-header__user-image">
        <h3 class="post-header__user-name">${post.user.name}</h3>
    </div>
    <div class="post-image-container">
      <img class="post-image" src="${post.imageUrl}">
    </div>
    <div class="post-likes">
      <button class="like-button" data-liked="${post.isLiked}" data-post-id="${post.id}" 
      >
        <img class="like-img" src="./assets/images/like-${post.isLiked ? '' : 'not-'}active.svg">
      </button>
      <p class="post-likes-text">
        ${post.likes.length}
      </p>
    </div>
    <h3 class="post-text">
        ${post.description}
      </h3>
    <p class="post-date">
      ${formatDistanceToNow(new Date(post.createdAt), {locale: ru})} назад
    </p>
  </li>`
    })
    .join('')
  const appHtml = `
              <div class="page-container">
                <div class="header-container"></div>
                <ul class="posts">
                 ${postListHTML}
                </ul>
              </div>`;

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }

  const likeButtons = document.querySelectorAll(".like-button");
  for (let likeButton of likeButtons) {
    likeButton.addEventListener("click", () => {
      console.log("test");
      const id = likeButton.dataset.postId
      if (likeButton.dataset.liked === "false") {
        pushLikeButton({
            token: getToken(),
            id
          })
          .then((data) => {
            const post = likeButton.closest(".post");
            console.log(data.likes.length, post)
            post.querySelector(".post-likes-text").textContent = data.likes.length
            post.querySelector(".like-img").src = "./assets/images/like-active.svg"
            likeButton.dataset.liked = "true";
          })
      } else {
        cancelLikeButton({
            token: getToken(),
            id
          })
          .then((data) => {
            const post = likeButton.closest(".post");
            post.querySelector(".post-likes-text").textContent = data.likes.length
            post.querySelector(".like-img").src = "./assets/images/like-not-active.svg"
            likeButton.dataset.liked = "false";
          })
      }
    })
  }
}