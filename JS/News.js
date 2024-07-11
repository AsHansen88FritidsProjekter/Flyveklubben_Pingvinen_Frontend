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
                const newsDate = new Date(news.createdAt).toLocaleString(); // Format the date
                newsItemDiv.innerHTML = `
                            <span>${news.title}: ${news.content} (Date: ${newsDate})</span>
                            <span class="delete-button" onclick="deleteNewsById(${news.id})">x</span>
                        `;
                newsDiv.appendChild(newsItemDiv);
            });
        })
        .catch(error => console.error('Error fetching news:', error));
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

function deleteNewsById(newsId) {
    fetch(`http://localhost:9090/api/news/${newsId}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (response.ok) {
                fetchAllNews(); // Refresh the list of news items
            } else {
                console.error(`Error deleting news item with ID ${newsId}`);
            }
        })
        .catch(error => console.error(`Error deleting news item with ID ${newsId}:`, error));
}