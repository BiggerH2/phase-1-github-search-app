document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("github-form");
    const userList = document.getElementById("user-list");
    const reposList = document.getElementById("repos-list");
  
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const searchTerm = document.getElementById("search").value.trim();
      if (!searchTerm) {
        alert("Please enter a GitHub username");
        return;
      }
  
      try {
        const users = await searchUsers(searchTerm);
        displayUsers(users);
      } catch (error) {
        console.error("Error searching users:", error);
      }
    });
  
    async function searchUsers(username) {
      const response = await fetch(
        `https://api.github.com/search/users?q=${username}`,
        {
          headers: {
            Accept: "application/vnd.github.v3+json",
          },
        }
      );
      const data = await response.json();
      return data.items;
    }
  
    async function getUserRepos(username) {
      const response = await fetch(`https://api.github.com/users/${username}/repos`, {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
      });
      const data = await response.json();
      return data;
    }
  
    document.getElementById("github-container").addEventListener("click", async (event) => {
      if (event.target.classList.contains("repos-btn")) {
        const username = event.target.dataset.username;
        try {
          const repos = await getUserRepos(username);
          displayUserRepos(username, repos);
        } catch (error) {
          console.error("Error fetching user repositories:", error);
        }
      }
    });
  
    function displayUsers(users) {
      userList.innerHTML = "";
      users.forEach((user) => {
        const userElement = document.createElement("li");
        userElement.innerHTML = `
              <h3>${user.login}</h3>
              <img src="${user.avatar_url}" alt="${user.login}" style="width:100px;height:100px;">
              <a href="${user.html_url}" target="_blank">Profile</a>
              <button class="repos-btn" data-username="${user.login}">Show Repositories</button>
          `;
        userList.appendChild(userElement);
      });
    }
  
    function displayUserRepos(username, repos) {
      reposList.innerHTML = "";
      const userReposElement = document.createElement("li");
      userReposElement.innerHTML = `<h3>${username}'s Repositories:</h3>`;
      repos.forEach((repo) => {
        const repoItem = document.createElement("li");
        repoItem.innerHTML = `<a href="${repo.html_url}" target="_blank">${repo.name}</a>`;
        userReposElement.appendChild(repoItem);
      });
      reposList.appendChild(userReposElement);
    }
  });
  