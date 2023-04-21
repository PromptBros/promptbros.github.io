const BASE_URL = "https://promptbros.github.io/CDN";
const SEED = "PromtBros 2023";
const encodedUrlParam = getQueryParam(decodeURIComponent("col-id"));

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

  if (!(firstChar === 'f')) {
    console.warn("Not a Valid Collection ID", firstChar, lastChar)
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
    console.error("Not a valid collection", error);
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
    const section = document.getElementById("group");
    section.innerHTML = "";
    
    const sectionTitle = document.createElement("h1");
    sectionTitle.classList.add("text-4xl", "font-semibold", "text-center", "text-white", "mb-4");
    sectionTitle.textContent = "Production Collections";
    section.appendChild(sectionTitle);

    const groupList = document.createElement("div");
    groupList.classList.add("flex", "flex-wrap", "justify-center");
    section.appendChild(groupList);
 
    for (const group of groups) {
      const groupContainer = document.createElement("a");
      groupContainer.href = "/collection/?col-id=" + group.id;
      groupContainer.classList.add("w-1/3", "md:w-1/3", "lg:w-1/4", "p-4");
      groupList.appendChild(groupContainer);
  
      const groupHeaderContainer = document.createElement("div");
      groupHeaderContainer.classList.add("bg-white", "rounded-lg", "shadow-lg", "p-4", "flex", "flex-col", "items-center", "h-full");
      groupContainer.appendChild(groupHeaderContainer);
  
      if (group.content.images.length > 0) {
        const logoContainer = document.createElement("div");
        logoContainer.classList.add("overflow-hidden", "h-64");
        groupHeaderContainer.appendChild(logoContainer);
  
        const logoImage = document.createElement("img");
        logoImage.src = group.content.images[0];
        logoImage.classList.add("mx-auto", "align-top", "pb-4", "h-64");
        logoContainer.appendChild(logoImage);
      }
  
      const title = document.createElement("h2");
      title.classList.add("text-2xl", "font-semibold", "mb-2");
      title.textContent = group.content.title;
      groupHeaderContainer.appendChild(title);
  
      const description = document.createElement("p");
      description.classList.add("text-sm", "mb-4", "overfolow-scroll");
      description.textContent = group.content.description;
      groupHeaderContainer.appendChild(description);
  
      const tags = document.createElement("ul");
      tags.classList.add("list-none", "flex", "flex-wrap", "mb-3");
      group.content.tags.forEach((tag) => {
        const tagItem = document.createElement("li");
        tagItem.classList.add("text-xs", "bg-slate-300", "text-white", "rounded-full", "px-2", "py-1", "mr-2", "mb-1");
        tagItem.textContent = tag;
        tags.appendChild(tagItem);
      });
      groupHeaderContainer.appendChild(tags);    
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

  // Load the default template.json file from the provided URL
if (decodedStr) {
    fetchAndDisplayJSON(baseJson);
  }