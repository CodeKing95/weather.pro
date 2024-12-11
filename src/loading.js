import { rootElement } from "./main";

export function renderLoadingScreen(message = "Loading...") {
  rootElement.innerHTML = getLoadingHtml(message);
}

function getLoadingHtml(message) {
  return `
      <div class="loading">
      <div class="loading__message">${message}</div>
      <div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
     </div>
    `;
}
