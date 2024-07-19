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

        const result = await response.text();
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

        images = await response.json();
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
    currentIndex = images.indexOf(image);
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

        const dropdownButton = document.createElement('button');
        dropdownButton.classList.add('dropdown-button');
        dropdownButton.textContent = '⋮';
        imgContainer.appendChild(dropdownButton);

        const dropdown = document.createElement('div');
        dropdown.classList.add('dropdown');
        dropdown.innerHTML = `
            <button onclick="downloadImage('${file}')">Download</button>
            <button onclick="deleteImage('${file}')">Delete</button>
        `;
        imgContainer.appendChild(dropdown);

        dropdownButton.addEventListener('click', (event) => {
            event.stopPropagation();
            document.querySelectorAll('.dropdown').forEach(d => {
                if (d !== dropdown) d.style.display = 'none';
            });
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        });

        container.appendChild(imgContainer);
    });
}

// Function to handle the next and previous image navigation
function changeSlide(n) {
    currentIndex = (currentIndex + n + images.length) % images.length; // Ensure index is within bounds
    setMainImage(images[currentIndex]);
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

// Close dropdown menu when clicking outside
document.addEventListener('click', (event) => {
    if (!event.target.matches('.dropdown-button')) {
        document.querySelectorAll('.dropdown').forEach(d => d.style.display = 'none');
    }
});

// Add event listeners for buttons
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

// Initialize on page load
window.onload = fetchUploadedImages;


