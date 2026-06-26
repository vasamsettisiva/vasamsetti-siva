// Database Simulation (Global Object storing profiles by path)
const database = {
    profiles: {}
};

// Initial state data
let linkCount = 0;
const initialLinks = [
    { title: 'My Portfolio', url: 'https://myportfolio.com' },
    { title: 'Follow my Twitter', url: 'https://twitter.com' }
];

// DOM Elements
const linksContainer = document.getElementById('links-container');
const addLinkBtn = document.getElementById('add-link-btn');
const saveProfileBtn = document.getElementById('save-profile-btn');
const profileNameInput = document.getElementById('profile-name');
const profilePathInput = document.getElementById('profile-path');

const previewName = document.getElementById('preview-name');
const previewPathDisplay = document.getElementById('preview-path-display');
const previewLinks = document.getElementById('preview-links');
const statusMessage = document.getElementById('status-message');

// Initialize the application
function init() {
    // Generate initial link fields
    initialLinks.forEach(link => addLinkField(link.title, link.url));
    
    // Set up real-time sync listeners for profile details
    profileNameInput.addEventListener('input', updatePreview);
    profilePathInput.addEventListener('input', updatePreview);
    
    addLinkBtn.addEventListener('click', () => addLinkField('', ''));
    saveProfileBtn.addEventListener('click', saveProfileData);

    updatePreview();
}

// Dynamically generate form input for a single link
function addLinkField(title = '', url = '') {
    linkCount++;
    const id = `link-${linkCount}`;

    const linkCard = document.createElement('div');
    linkCard.className = 'link-card';
    linkCard.id = id;
    linkCard.innerHTML = `
        <button class="remove-btn" onclick="removeLinkField('${id}')">✕</button>
        <div class="input-group">
            <label>Link Title</label>
            <input type="text" class="link-title" placeholder="e.g., Portfolio" value="${title}">
        </div>
        <div class="input-group" style="margin-bottom: 0;">
            <label>URL</label>
            <input type="url" class="link-url" placeholder="https://..." value="${url}">
        </div>
    `;

    linksContainer.appendChild(linkCard);

    // Add event listeners to newly created inputs for live preview sync
    linkCard.querySelector('.link-title').addEventListener('input', updatePreview);
    linkCard.querySelector('.link-url').addEventListener('input', updatePreview);

    updatePreview();
}

// Delete a link input field
function removeLinkField(id) {
    const element = document.getElementById(id);
    if (element) {
        element.remove();
        updatePreview();
    }
}

// Harvest builder details and update the mock phone screen live
function updatePreview() {
    // Update Profile Name & Path Display
    previewName.textContent = profileNameInput.value || 'Your Name';
    previewPathDisplay.textContent = profilePathInput.value ? `@${profilePathInput.value}` : '@username';

    // Clear and build preview links
    previewLinks.innerHTML = '';
    
    const linkCards = document.querySelectorAll('.link-card');
    linkCards.forEach(card => {
        const title = card.querySelector('.link-title').value;
        const url = card.querySelector('.link-url').value;

        // Only show links in the preview if they have a title
        if (title.trim() !== '') {
            const linkAnchor = document.createElement('a');
            linkAnchor.href = url || '#';
            linkAnchor.target = '_blank';
            linkAnchor.className = 'preview-link-item';
            linkAnchor.textContent = title;
            previewLinks.appendChild(linkAnchor);
        }
    });
}

// Format data into an array and mock-save it under a specific path string
function saveProfileData() {
    const path = profilePathInput.value.trim().toLowerCase();
    const displayName = profileNameInput.value.trim();
    
    if (!path) {
        showStatus('Please provide a valid custom profile path.', '#ef4444');
        return;
    }

    const linksArray = [];
    const linkCards = document.querySelectorAll('.link-card');
    
    linkCards.forEach(card => {
        const title = card.querySelector('.link-title').value.trim();
        const url = card.querySelector('.link-url').value.trim();
        
        if (title || url) {
            linksArray.push({ title, url });
        }
    });

    // Save profile object schema inside our database object under the custom path key
    database.profiles[path] = {
        name: displayName,
        links: linksArray
    };

    console.log(`Saved array under path [${path}]:`, database.profiles[path]);
    showStatus(`Success! Profile array saved to path: /${path}`, '#10b981');
}

function showStatus(text, color) {
    statusMessage.textContent = text;
    statusMessage.style.color = color;
    setTimeout(() => { statusMessage.textContent = ''; }, 4000);
}

// Fire up the code
init();