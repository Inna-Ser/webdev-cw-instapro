import {
  formatDistanceToNow
} from "date-fns";
import {
  cancelLikeButton,
  deletePost,
  pushLikeButton
} from "../api.js";
import {
  goToPage,
  posts,
  user
} from "../index.js";
import {
  renderHeaderComponent
} from "./header-component.js";
import {
  ru
} from "date-fns/locale/ru";
import {
  USER_POSTS_PAGE
} from "../routes.js";
import {
  replaceTags
} from "../helpers.js";

export function userPostsPageComponents({
  appEl,
  getToken,
}) {
  const postListHTML = posts.map((post) => {
      return `
        <li class="post">
      <div class="post-image-container">
        <img class="post-image" src="${post.imageUrl}">
      </div>
      <div class="functional-container">
        <div class="post-likes">
          <button class="like-button" data-liked="${post.isLiked}" data-post-id="${post.id}">
            <img class="like-img" src="./assets/images/like-${post.user.id.isLiked === user? '' : 'not-'}active.svg">
          </button>
          <p class="post-likes-text">
          ${post.likes.length > 1 ? `${replaceTags(post.likes[0].name)} и еще ${post.likes.length - 1}` : ''}
          </p>
        </div>
        <button class="delete-button" data-post-id="${post.id}">
          ${post.user.id === user?._id ? `<p class="delete">Удалить</p>` : ""} 
        </button>
      </div>
      <p class="post-text">
      ${replaceTags(post.user.name)}: ${replaceTags(post.description)}
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
                  ${posts.length ? `<div class="post-header" data-user-id="${posts[0].user.id}">
                  <img src="${posts[0].user.imageUrl}" class="post-header__user-image">
                  <p class="post-header__user-name">${posts[0].user.name}</p>
                </div>` : "У пользователя нет постов"}
                  
                  <ul class="posts">
                   ${postListHTML}
                  </ul>
              </div>`

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  const deleteButtons = document.querySelectorAll(".delete-button");
  for (let deleteButton of deleteButtons) {
    deleteButton.addEventListener("click", () => {
      const id = deleteButton.dataset.postId
      deletePost({
          token: getToken(),
          id
        })
        .then(() => {
          goToPage(USER_POSTS_PAGE, {
            userId: posts[0].user.id
          })
        })
    })
  }
  const likeButtons = document.querySelectorAll(".like-button");
  for (let likeButton of likeButtons) {
    likeButton.addEventListener("click", () => {
      const id = likeButton.dataset.postId
      if (likeButton.dataset.liked === "false") {
        pushLikeButton({
            token: getToken(),
            id
          })
          .then((data) => {
            const post = likeButton.closest(".post");
            post.querySelector(".post-likes-text").textContent = `${data.user.name} ${data.likes.length > 1 ? `и еще ${data.likes.length - 1}` : ""}`
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