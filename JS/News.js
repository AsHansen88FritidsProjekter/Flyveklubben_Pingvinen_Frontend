function fetchAllNews() {
    fetch('http://localhost:9090/api/news')
        .then(response => response.json())
        .then(data => {
            const newsDiv = document.getElementById('all-news');
            newsDiv.innerHTML = JSON.stringify(data, null, 2);
        })
        .catch(error => console.error('Error fetching news:', error));
}

function fetchNewsById() {
    const newsId = document.getElementById('news-id').value;
    fetch(`http://localhost:9090/api/news/${newsId}`)
        .then(response => response.json())
        .then(data => {
            const newsByIdDiv = document.getElementById('news-by-id');
            newsByIdDiv.innerHTML = JSON.stringify(data, null, 2);
        })
        .catch(error => console.error(`Error fetching news with ID ${newsId}:`, error));
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
        })
        .catch(error => console.error('Error creating news item:', error));
}

function deleteNewsById() {
    const newsIdToDelete = document.getElementById('delete-news-id').value;
    fetch(`http://localhost:9090/api/news/${newsIdToDelete}`, {
        method: 'DELETE'
    })
        .then(response => {
            const deleteResponseDiv = document.getElementById('delete-response');
            if (response.ok) {
                deleteResponseDiv.innerHTML = `News item with ID ${newsIdToDelete} deleted successfully`;
            } else {
                deleteResponseDiv.innerHTML = `Error deleting news item with ID ${newsIdToDelete}`;
            }
        })
        .catch(error => console.error(`Error deleting news item with ID ${newsIdToDelete}:`, error));
}