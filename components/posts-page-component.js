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
  const locales = {
    ru
  }
  const postListHTML = posts.map((post) => {
      return `<li class="post">
    <div class="post-header" data-user-id="${post.user.id}">
        <img src="${post.user.imageUrl}" class="post-header__user-image">
        <p class="post-header__user-name">${post.user.name}</p>
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
        ${post.likes.length > 1 ? `${post.user.name} и еще ${post.likes.length - 1}` : `${post.likes.length} ${post.user.name}`}
      </p>
    </div>
    <p class="post-text">
        ${post.user.name}: ${post.description}
      </p>
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
      const id = likeButton.dataset.postId
      const likeText = document.querySelectorAll(".post-likes-text")
      if (likeButton.dataset.liked === "false") {
        pushLikeButton({
            token: getToken(),
            id
          })
          .then((data) => {
            const post = likeButton.closest(".post");
            post.querySelector(".post-likes-text").textContent =
              `${data.user.name} ${data.likes.length > 1 ? `и еще ${data.likes.length - 1}` : ""}`
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
            post.querySelector(".post-likes-text").textContent = `${data.user.name} ${data.likes.length > 1 ? `и еще ${data.likes.length - 1}` : ""}`
            post.querySelector(".like-img").src = "./assets/images/like-not-active.svg"
            likeButton.dataset.liked = "false";
          })
      }
    })
  }
}