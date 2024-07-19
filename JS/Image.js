let currentIndex = 0;
let images = [];

// Function to handle image upload
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

// Function to handle image download
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

// Function to fetch uploaded images and update gallery
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

        images = await response.json(); // Store image file names
        updateGallery();
        if (images.length > 0) {
            setMainImage(images[0]); // Set the first image as the main image
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('uploadedImagesContainer').innerHTML = `Error: ${error.message}`;
    }
}

// Function to set the main image
function setMainImage(image) {
    document.getElementById('mainImage').src = `http://localhost:9090/api/image/${encodeURIComponent(image)}`;
}

// Function to update the gallery
function updateGallery() {
    const container = document.getElementById('uploadedImagesContainer');
    container.innerHTML = '';

    images.forEach((file, index) => {
        const imgContainer = document.createElement('div');
        imgContainer.style.position = 'relative';
        imgContainer.style.display = 'inline-block';

        const imgElement = document.createElement('img');
        imgElement.src = `http://localhost:9090/api/image/${encodeURIComponent(file)}`;
        imgElement.alt = file;
        imgElement.classList.add('gallery-image');
        imgElement.dataset.index = index;
        imgElement.addEventListener('click', () => {
            setMainImage(file);
            openLightbox(imgElement.src);
        });
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
    });
}

// Function to delete an image
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

// Function to open the lightbox
function openLightbox(imageSrc) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    lightbox.style.display = 'flex';
    lightboxImage.src = imageSrc;
}

// Function to close the lightbox
function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.style.display = 'none';
}

// Function to navigate through images
function plusSlides(n) {
    currentIndex = (currentIndex + n + images.length) % images.length;
    setMainImage(images[currentIndex]);
}

// Event listeners
document.getElementById('uploadButton').addEventListener('click', () => {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if (file) {
        uploadImage(file);
    } else {
        alert('Please select a file to upload.');
    }
});

document.getElementById('closeLightbox').addEventListener('click', closeLightbox);

window.onload = fetchUploadedImages;

