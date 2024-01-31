import {
  formatDistanceToNow
} from "date-fns";
import {
  cancelLikeButton,
  deletePost,
  pushLikeButton
} from "../api.js";
import {
  posts,
  user
} from "../index.js";
import {
  renderHeaderComponent
} from "./header-component.js";
import {
  ru
} from "date-fns/locale";

export function userPostsPageComponents({
  appEl,
  getToken
}) {
  const postListHTML = posts.map((post) => {
      return `
        <li class="post">
      <div class="post-image-container">
        <img class="post-image" src="${post.imageUrl}">
      </div>
      <div class="functional-container">
      <div class="post-likes">
      <button class="like-button" data-liked="${post.isLiked}" data-post-id="${post.id}" 
      >
        <img class="like-img" src="./assets/images/like-${post.isLiked ? '' : 'not-'}active.svg">
      </button>
      <p class="post-likes-text">
        ${post.likes.length}
      </p>
    </div>
      <button class="delete-button" data-post-id="${post.id}">
      ${post.user.id === user._id ? `<p class="delete">Удалить</p>` : ""} 
      </button>
      </div>
      <h3 class="post-text">
        ${post.description}
      </h3>
      <p class="post-date">
      ${formatDistanceToNow(new Date(post.createdAt), ru)}
      </p>
    </li>`
    })
    .join('')
  const appHtml = `
                <div class="page-container">
                  <div class="header-container"></div>
                  <div class="post-header" data-user-id="${posts[0].user.id}">
            <img src="${posts[0].user.imageUrl}" class="post-header__user-image">
            <p class="post-header__user-name">${posts[0].user.name}</p>
        </div>
                  <ul class="posts">
                    
                   ${postListHTML}
                  </ul>
                </div>`;

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
          userPostsPageComponents({
            appEl,
            getToken
          })
        })
    })
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