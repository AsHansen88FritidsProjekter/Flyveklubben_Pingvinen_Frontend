document.addEventListener('DOMContentLoaded', (event) => {
    fetchAllNews();
});

function fetchAllNews() {
    fetch('http://localhost:9090/api/news')
        .then(response => response.json())
        .then(data => {
            const newsDiv = document.getElementById('all-news');
            newsDiv.innerHTML = ''; // Clear previous news items
            data.forEach(news => {
                const newsItemDiv = document.createElement('div');
                newsItemDiv.className = 'news-item';
                newsItemDiv.dataset.id = news.id;
                const newsDate = new Date(news.createdAt).toLocaleString(); // Format the date
                newsItemDiv.innerHTML = `
                    <span class="delete-button" onclick="deleteNewsById(${news.id})">x</span>
                    <h3 class="news-title">${news.title}</h3>
                    <div class="news-date">${newsDate}</div>
                    <p class="news-content">${news.content}</p>
                    <button class="edit-button" onclick="enableEditMode(${news.id})">Edit</button>
                    <button class="save-button" onclick="updateNews(${news.id})" style="display:none;">Save</button>
                `;
                newsDiv.appendChild(newsItemDiv);
            });
        })
        .catch(error => console.error('Error fetching news:', error));
}

function deleteNewsById(id) {
    fetch(`http://localhost:9090/api/news/${id}`, { method: 'DELETE' })
        .then(response => {
            if (response.ok) {
                fetchAllNews(); // Refresh the news list after deletion
            } else {
                console.error('Error deleting news:', response.statusText);
            }
        })
        .catch(error => console.error('Error deleting news:', error));
}

function createNews() {
    const title = document.getElementById('news-title').value;
    const content = document.getElementById('news-content').value;
    const newNewsItem = { title, content };

    fetch('http://localhost:9090/api/news', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newNewsItem)
    })
        .then(response => response.json())
        .then(data => {
            const createResponseDiv = document.getElementById('create-response');
            createResponseDiv.innerHTML = `News item created: ${JSON.stringify(data, null, 2)}`;
            fetchAllNews(); // Refresh the list of news items
        })
        .catch(error => console.error('Error creating news item:', error));
}

function enableEditMode(newsId) {
    const newsItemDiv = document.querySelector(`.news-item[data-id='${newsId}']`);
    const title = newsItemDiv.querySelector('.news-title');
    const content = newsItemDiv.querySelector('.news-content');
    const editButton = newsItemDiv.querySelector('.edit-button');
    const saveButton = newsItemDiv.querySelector('.save-button');

    title.contentEditable = true;
    content.contentEditable = true;
    title.focus();

    editButton.style.display = 'none';
    saveButton.style.display = 'inline-block';
}

function updateNews(newsId) {
    const newsItemDiv = document.querySelector(`.news-item[data-id='${newsId}']`);
    const title = newsItemDiv.querySelector('.news-title').innerText;
    const content = newsItemDiv.querySelector('.news-content').innerText;
    const updatedNewsItem = { title, content };

    fetch(`http://localhost:9090/api/news/${newsId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedNewsItem)
    })
        .then(response => response.json())
        .then(data => {
            console.log('News item updated:', data);
            fetchAllNews(); // Refresh the list of news items
        })
        .catch(error => console.error('Error updating news item:', error));
}
