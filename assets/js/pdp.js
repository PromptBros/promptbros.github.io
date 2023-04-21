const BASE_URL = "https://promptbros.github.io/CDN";
const SEED = "PromtBros 2023";
const encodedUrlParam = getQueryParam(decodeURIComponent("prompt-id"));

const decodedStr = xorDecode(encodedUrlParam, SEED);
const baseJson = BASE_URL + decodedStr;
let baseUrl = trimFilenameFromUrl(baseJson);

function getQueryParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

function xorDecode(encodedStr, seed) {
  if (!encodedStr) {
    console.error("Not a valid string");
    return;
  }

  const firstChar = encodedStr[0];
  const lastChar = encodedStr[encodedStr.length - 1];

  if (!(firstChar === 'f' && lastChar === '=')) {
    console.warn("Not a Valid Prompt ID", firstChar, lastChar)
    return
  }

  try {
    //const decodedUrlComponent = decodeURIComponent(encodedStr);
    const base64 = encodedStr.replace(/-/g, '+').replace(/_/g, '/');
    const str = atob(base64);
    let result = "";

    for (let i = 0; i < str.length; i++) {
      result += String.fromCharCode(str.charCodeAt(i) ^ seed.charCodeAt(i % seed.length));
    }

    return result;
  } catch (error) {
    console.error("Not a valid prompt Id", error);
    return;
  }
}

function trimFilenameFromUrl(url) {
  const urlObj = new URL(url);
  const pathName = urlObj.pathname;
  const pathArray = pathName.split("/");
  pathArray.pop();
  const newPath = pathArray.join("/");
  const newUrl = urlObj.origin + newPath + "/";

  return newUrl;
}

async function fetchAndDisplayTextFile(filename, fileItem) {

  try {
    const response = await fetch(baseUrl + filename);
    const text = await response.text();

    const textareaContainer = document.createElement("div");
    textareaContainer.classList.add("flex");
    textareaContainer.innerHTML = `
      <textarea class="w-full h-80 p-2 border mb-3 bg-gray-800 text-white" readonly>${text}</textarea>
      <div class="ml-2 flex items-start">
        <button class="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-500" data-clipboard-text="${text}">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z" />
          </svg>
        </button>
      </div>
    `;
    fileItem.appendChild(textareaContainer);
  } catch (error) {
    console.error("Error fetching text file:", error);
  }
}

async function fetchAndDisplayMarkdownFile(fileName, contentContainer) {
  try {
    const response = await fetch(baseUrl + fileName);
    const markdown = await response.text();
    const html = marked.parse(markdown);
    const instructionsContainer = document.createElement("div");
    instructionsContainer.classList.add("markdown-body", "mt-3", "bg-slate-100", "pt-6", "pb-6", "pl-10", "pr-10", "rounded");
    instructionsContainer.innerHTML = html;
    contentContainer.appendChild(instructionsContainer);
  } catch (error) {
    console.error("Error fetching Markdown file:", error);
  }
}

async function displayFiles(files) {
  const fileList = document.getElementById("file-list");

  fileList.innerHTML = "";
  for (const file of files) {
    const fileItem = document.createElement("div");
    fileItem.classList.add("mb-6");
    fileList.appendChild(fileItem);

    const itemHeaderContainer = document.createElement("div");
    itemHeaderContainer.classList.add("p-2");
    fileItem.appendChild(itemHeaderContainer);

    if (file.brand) {
      const logoContainer = document.createElement("div");
      logoContainer.classList.add("w-14", "h-14", "overflow-hidden", "flex", "float-left", "mr-4");
      itemHeaderContainer.appendChild(logoContainer);

      const logoImage = document.createElement("img");
      logoImage.src = file.brand;
      logoImage.classList.add("w-full", "h-full");
      logoContainer.appendChild(logoImage);
    }

    const title = document.createElement("h3");
    title.classList.add("text-xl", "font-semibold", "mb-3");
    title.textContent = file.content.title;
    itemHeaderContainer.appendChild(title);

    if (file.model) {
      const modelText = document.createElement("p");
      modelText.textContent = file.model;
      modelText.classList.add("text-xs");
      itemHeaderContainer.appendChild(modelText);
    }

    const contentContainer = document.createElement("div");
    contentContainer.classList.add("p-6", "mb-6");
    fileItem.appendChild(contentContainer);

    const description = document.createElement("p");
    description.classList.add("mb-6", "mt-3");
    description.textContent = file.content.description;
    contentContainer.appendChild(description);

    await fetchAndDisplayTextFile(file.fileName, contentContainer);

    const tags = document.createElement("ul");
    tags.classList.add("list-none", "flex", "flex-wrap", "mt-3", "mx-auto", "mb-10", "grid", "max-w-lg", "grid-cols-8", "items-center", "gap-x-4", "gap-y-4", "sm:max-w-xl", "sm:grid-cols-6", "sm:gap-x-10", "lg:mx-0", "lg:max-w-none", "lg:grid-cols-6"
    );
    file.content.tags.forEach((tag) => {
      const tagItem = document.createElement("li");
      tagItem.classList.add("text-xs", "col-span-2", "max-h-12", "w-full", "object-contain", "lg:col-span-1", "font-bold", "text-center");
      tagItem.textContent = tag;
      tags.appendChild(tagItem);
    });
    contentContainer.appendChild(tags);

    if (file.content.images.length > 0) {
      const galleryContainer = document.createElement("div");
      galleryContainer.classList.add("grid", "grid-cols-4", "gap-4", "mb-6");
      contentContainer.appendChild(galleryContainer);

      for (const image of file.content.images) {
        const imgElement = document.createElement("img");
        imgElement.src = baseUrl + "images/" + image;
        imgElement.classList.add("w-full", "h-auto", "rounded", "align-middle", "border", "shadow");
        galleryContainer.appendChild(imgElement);
      }
    }

    if (file.fileName) {
      const instructionsFilename = file.fileName.replace(".txt", ".md");
      await fetchAndDisplayMarkdownFile(instructionsFilename, contentContainer);
    }
  }

  new ClipboardJS("[data-clipboard-text]");
}

async function fetchAndDisplayJSON(jsonUrl) {
  try {
    const response = await fetch(jsonUrl);
    const files = await response.json();
    displayFiles(files);
  } catch (error) {
    console.error("Error fetching JSON:", error);
  }
}

document.getElementById("url-input").addEventListener("input", async (event) => {
  const encodedUrl = decodeURIComponent(event.target.value);
  const url = xorDecode(encodedUrl, SEED);

  if (!url) {
    return;
  }

  baseUrl = trimFilenameFromUrl(BASE_URL + url);
  fetchAndDisplayJSON(BASE_URL + url);

  const currentUrl = window.location.href;
  const newUrl = currentUrl.split("?")[0] + "?prompt-id=" + encodedUrl;
  history.pushState(null, null, newUrl);
});

// Load the default template.json file from the provided URL
if (decodedStr) {
  fetchAndDisplayJSON(baseJson);
}
