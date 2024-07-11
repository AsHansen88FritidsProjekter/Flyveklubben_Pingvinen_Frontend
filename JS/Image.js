async function uploadImage(file) {
    const formData = new FormData();
    formData.append("image", file);

    try {
        const response = await fetch('http://localhost:9090/api/image', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
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
        const encodedFileName = encodeURIComponent(fileName);
        const response = await fetch(`http://localhost:9090/api/image/${encodedFileName}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });

        if (!response.ok) {
            throw new Error('Image download failed');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('uploadResult').textContent = `Error: ${error.message}`;
    }
}

async function fetchUploadedImages() {
    try {
        const response = await fetch('http://localhost:9090/api/image/images', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch uploaded images');
        }

        const imageFiles = await response.json();
        const container = document.getElementById('uploadedImagesContainer');
        container.innerHTML = '';

        imageFiles.forEach(file => {
            const imgContainer = document.createElement('div');
            imgContainer.style.position = 'relative';
            imgContainer.style.display = 'inline-block';

            const imgElement = document.createElement('img');
            imgElement.src = `http://localhost:9090/api/image/${encodeURIComponent(file)}`;
            imgElement.alt = file;
            imgElement.classList.add('gallery-image');
            imgContainer.appendChild(imgElement);

            const deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = '&times;';
            deleteBtn.classList.add('delete-btn');
            deleteBtn.addEventListener('click', () => deleteImage(file));
            imgContainer.appendChild(deleteBtn);

            const downloadBtn = document.createElement('button');
            downloadBtn.innerHTML = '⬇'; // Unicode character for down arrow
            downloadBtn.classList.add('download-btn');
            downloadBtn.addEventListener('click', () => downloadImage(file));
            imgContainer.appendChild(downloadBtn);

            container.appendChild(imgContainer);

            // Add click event to open lightbox
            imgElement.addEventListener('click', () => {
                openLightbox(imgElement.src);
            });
        });
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('uploadedImagesContainer').innerHTML = `Error: ${error.message}`;
    }
}

async function deleteImage(fileName) {
    try {
        const encodedFileName = encodeURIComponent(fileName);
        const response = await fetch(`http://localhost:9090/api/image/${encodedFileName}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });

        if (!response.ok) {
            throw new Error('Image delete failed');
        }

        document.getElementById('uploadResult').textContent = `Image deleted successfully: ${fileName}`;
        fetchUploadedImages(); // Refresh the list of uploaded images
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('uploadResult').textContent = `Error: ${error.message}`;
    }
}

function openLightbox(imageSrc) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    lightbox.style.display = 'flex';
    lightboxImage.src = imageSrc;
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.style.display = 'none';
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

document.querySelector('.close').addEventListener('click', closeLightbox);

window.onload = fetchUploadedImages;
