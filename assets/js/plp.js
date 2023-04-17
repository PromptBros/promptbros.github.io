const BASE_URL = "https://promptbros.github.io/CDN";
const SEED = "PromtBros 2023";
const encodedUrlParam = getQueryParam("col-id");

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
    console.error("Not a Valid string")
    return
  }

  const firstChar = encodedStr[0];
  const lastChar = encodedStr[encodedStr.length - 1];

  if (!(firstChar === 'f' && lastChar === 'O')) {
    console.warn("Not a Valid Prompt ID")
    return
  }

  try {
    const str = atob(encodedStr);
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

function displayGroups(groups) {
  const groupList = document.getElementById("group-list");

  for (const group of groups) {
    const groupContainer = document.createElement("div");
    groupContainer.classList.add("group", "relative", "p-6");
    groupList.appendChild(groupContainer);

    const groupHeaderContainer = document.createElement("div");
    groupHeaderContainer.classList.add("p-6");
    groupContainer.appendChild(groupHeaderContainer);

    if (group.content.images.length > 0) {
      const logoContainer = document.createElement("div");
      logoContainer.classList.add("w-14", "h-14", "overflow-hidden", "flex", "float-left", "mr-4");
      groupHeaderContainer.appendChild(logoContainer);

      const logoImage = document.createElement("img");
      logoImage.src = group.content.images[0];
      logoImage.classList.add("w-full", "h-full");
      logoContainer.appendChild(logoImage);
    }

    const title = document.createElement("h2");
    title.classList.add("text-2xl", "font-semibold", "mb-2");
    title.textContent = group.content.title;
    groupHeaderContainer.appendChild(title);

    const description = document.createElement("p");
    description.classList.add("text-sm", "mb-4");
    description.textContent = group.content.description;
    groupHeaderContainer.appendChild(description);

    const promptList = document.createElement("div");
    promptList.classList.add("grid", "grid-cols-1", "md:grid-cols-3", "lg:grid-cols-4", "gap-3");
    groupContainer.appendChild(promptList);

    for (const prompt of group.prompts) {
      const promptCard = document.createElement("a");
      promptCard.href = prompt.path;
      promptCard.classList.add("relative", "h-80", "w-full", "overflow-hidden", "rounded-lg", "bg-white", "group-hover:opacity-75", "shadow-md");
      promptList.appendChild(promptCard);

      if (prompt.images.length > 0) {
        const imageContainer = document.createElement("div");
        imageContainer.classList.add("w-full", "h-32", "overflow-hidden", "rounded");
        promptCard.appendChild(imageContainer);

        const promptImage = document.createElement("img");
        promptImage.src = prompt.images[0];
        promptImage.classList.add("w-full", "h-full", "object-cover");
        imageContainer.appendChild(promptImage);
      }

      const promptText = document.createElement("h3");
      promptText.classList.add("text-lg", "font-semibold", "mb-2");
      promptText.textContent = prompt.text;
      promptCard.appendChild(promptText);
    }
  }
}

async function fetchAndDisplayJSON(jsonUrl) {
  console.log("json:", jsonUrl)

  try {
    const response = await fetch(jsonUrl);
    const files = await response.json();
    displayGroups(files);
  } catch (error) {
    console.error("Error fetching JSON:", error);
  }
}

document.getElementById("url-input").addEventListener("input", async (event) => {
  const encodedUrl = event.target.value;
  const url = xorDecode(encodedUrl, SEED);

  if (!url) {
    return;
  }

  baseUrl = trimFilenameFromUrl(BASE_URL + url);
  fetchAndDisplayJSON(BASE_URL + url);

  const currentUrl = window.location.href;
  const newUrl = currentUrl.split("?")[0] + "?col-id=" + encodedUrl;
  history.pushState(null, null, newUrl);
});

// Load the default template.json file from the provided URL
if (decodedStr) {
  fetchAndDisplayJSON(baseJson);
}


