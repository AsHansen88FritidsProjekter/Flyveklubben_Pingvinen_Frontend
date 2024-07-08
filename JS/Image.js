async function uploadImage(file) {
    const formData = new FormData();
    formData.append("image", file);

    try {
        const response = await fetch('http://localhost:9090/image', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Image upload failed');
        }

        const result = await response.text(); // Assuming response is plain text
        document.getElementById('uploadResult').textContent = `Image uploaded successfully: ${result}`;
        fetchUploadedImages(); // Refresh the list of uploaded images
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('uploadResult').textContent = `Error: ${error.message}`;
    }
}

async function downloadImage(fileName) {
    try {
        const response = await fetch(`http://localhost:9090/image/${fileName}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });

        if (!response.ok) {
            throw new Error('Image download failed');
        }

        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);

        const imgElement = document.createElement('img');
        imgElement.src = imageUrl;
        document.getElementById('imageContainer').innerHTML = '';
        document.getElementById('imageContainer').appendChild(imgElement);

        console.log('Image downloaded successfully');
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('imageContainer').innerHTML = `Error: ${error.message}`;
    }
}

async function fetchUploadedImages() {
    try {
        const response = await fetch('http://localhost:9090/image/images', {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error('Failed to fetch uploaded images');
        }

        const imageFiles = await response.json();
        const container = document.getElementById('uploadedImagesContainer');
        container.innerHTML = '';

        imageFiles.forEach(file => {
            const imgElement = document.createElement('img');
            imgElement.src = `http://localhost:9090/image/${file}`;
            imgElement.alt = file;
            imgElement.style.width = '100px';
            imgElement.style.margin = '10px';
            container.appendChild(imgElement);
        });
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('uploadedImagesContainer').innerHTML = `Error: ${error.message}`;
    }
}

document.getElementById('uploadButton').addEventListener('click', () => {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if (file) {
        uploadImage(file);
    } else {
        alert('Please select a file to upload.');
    }
});

document.getElementById('downloadButton').addEventListener('click', () => {
    const fileName = document.getElementById('fileNameInput').value;
    if (fileName) {
        downloadImage(fileName);
    } else {
        alert('Please enter a file name to download.');
    }
});

// Fetch the uploaded images when the page loads
window.onload = fetchUploadedImages;
