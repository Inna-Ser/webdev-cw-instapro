import {
  posts
} from "../index.js";
import {
  renderHeaderComponent
} from "./header-component.js";

export function userPostsPageComponents({
  appEl
}) {
  const postListHTML = posts.map((post) => {
      return `
        
        <li class="post">
      <div class="post-image-container">
        <img class="post-image" src="${post.imageUrl}">
      </div>
      <div class="post-likes">
        <button class="${post.isLiked ? 'like-button -active-like' : 'like-button'}" data-post-id="${post.id}" 
        >
          <img src="./assets/images/like-active.svg">
        </button>
        <p class="post-likes-text">
          ${post.likes.length}
        </p>
      </div>
      <p class="delete" data-post-id="${post.user.id}">Удалить</p>
      <p class="post-text">
        <span class="user-name">${post.user.name}</span>
        ${post.description}
      </p>
      <p class="post-date">
        ${post.createdAt}
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
}