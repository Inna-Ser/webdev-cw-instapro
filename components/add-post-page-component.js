import {
  renderHeaderComponent
} from "./header-component";
import {
  renderUploadImageComponent
} from "./upload-image-component";

export function renderAddPostPageComponent({
  appEl,
  onAddPostClick
}) {
  let imageUrl = ""
  const render = () => {
    // TODO: Реализовать страницу добавления поста
    const appHtml = `
    <div class="page-container">
      <div class="header-container">
      </div>
      <div class="form">
      <div class="form-inputs">
        <h3 class="form-title"> Добавить пост </h3>
        <div class="upload-image-container"></div>
        <label> 
        Опишите фотографию:
          <textarea class="input textarea" rows="4"></textarea>
        </label>
        <button class="button" id="add-button">Добавить</button>
        </div>
      </div>
  `;

    appEl.innerHTML = appHtml;

    // что это значит?
    const uploadImageContainer = appEl.querySelector(".upload-image-container");

    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });

    if (uploadImageContainer) {
      renderUploadImageComponent({
        element: appEl.querySelector(".upload-image-container"),
        onImageUrlChange(newImageUrl) {
          imageUrl = newImageUrl;
        },
      });
    }
    // toDo получить текст по селектору
    let textPost = document.querySelector(".textarea")
    console.log(textPost)
    document.getElementById("add-button").addEventListener("click", () => {
      onAddPostClick({
        description: textPost.value,
        imageUrl: imageUrl,
      });
    });
  };

  render();
}