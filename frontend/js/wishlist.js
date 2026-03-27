requireAuth();

let selectedCollectionId = null;

async function loadCollections() {
  const cardsContainer = document.getElementById('collections-cards-container');
  const tableBody = document.getElementById('collections-table-body');
  
  try {
    const data = await wishlist.getCollections();
    const currentUser = getUser();
    
    // Separate collections: Own vs Others
    const myCollections = data.filter(c => c.user_id === currentUser.id);
    const otherCollections = data.filter(c => c.user_id !== currentUser.id);

    // RENDER CARDS
    if (myCollections.length === 0) {
      cardsContainer.innerHTML = '<p class="empty-state">No personal collections yet.</p>';
    } else {
      let cardsHTML = '';
      myCollections.forEach((c, i) => {
        const accentClass = i % 2 === 0 ? 'accent-orange' : 'accent-purple';
        const statusClass = i % 2 === 0 ? 'status-orange' : 'status-purple';
        const statusText = c.is_public ? 'Public' : 'Private';
        const btnClass = i % 2 === 0 ? 'btn-green-solid' : 'btn-purple-solid';
        const btnText = 'View Collection';

        cardsHTML += `
          <div class="collection-card ${accentClass}">
            <div class="collection-info-group">
              <span class="status-badge ${statusClass}">${statusText}</span>
              <div class="collection-title">${c.name}</div>
              <div class="collection-meta">${c.item_count || 0} problems saved</div>
            </div>
            <div class="collection-actions">
              <button class="collection-action-btn ${btnClass}" onclick="viewCollection('${c.id}')">${btnText}</button>
              <button class="btn btn-outline btn-sm" style="margin-right: 8px;" onclick="openShareModal('${c.id}', '${c.name}')">Share</button>
            </div>
          </div>
        `;
      });
      cardsContainer.innerHTML = cardsHTML;
    }

    // RENDER TABLE
    if (otherCollections.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="4" class="empty-state">No shared collections available yet.</td></tr>';
    } else {
      let tableHTML = '';
      otherCollections.forEach(c => {
        tableHTML += `
          <tr>
            <td style="padding-left: 24px; font-weight: 600; color: #1e293b;">${c.name}</td>
            <td style="color: #64748b;">${c.owner_name || 'System'}</td>
            <td style="color: #64748b;">${c.item_count || 0} items</td>
            <td style="padding-right: 24px;">
              <a href="#" class="view-link" style="color: #6366f1; text-decoration: none; font-weight: 500; font-size: 14px;" onclick="viewCollection('${c.id}')">View Items</a>
            </td>
          </tr>
        `;
      });
      tableBody.innerHTML = tableHTML;
    }
  } catch (err) {
    cardsContainer.innerHTML = '<p class="error-msg">Failed to load collections.</p>';
  }
}

function openNewCollectionModal() {
  document.getElementById('collection-modal').style.display = 'block';
}

function openShareModal(id, name) {
  selectedCollectionId = id;
  const infoEl = document.getElementById('sharing-collection-info');
  if (infoEl) infoEl.textContent = `Sharing "${name}"`;
  document.getElementById('share-modal').style.display = 'block';
}

function closeModal(id) {
  document.getElementById(id).style.display = 'none';
}

async function handleCreateCollection() {
  const nameEl = document.getElementById('collection-name');
  const name = nameEl ? nameEl.value.trim() : '';
  const isPublicEl = document.getElementById('is-public');
  const isPublic = isPublicEl ? isPublicEl.checked : false;

  if (!name) return;

  try {
    const res = await wishlist.createCollection(name, isPublic);
    if (res.id) {
      closeModal('collection-modal');
      loadCollections();
    }
  } catch (err) {
    alert('Failed to create collection');
  }
}

async function handleShareCollection() {
  const usernameEl = document.getElementById('share-username');
  const username = usernameEl ? usernameEl.value.trim() : '';
  if (!username || !selectedCollectionId) return;

  try {
    const res = await wishlist.share(selectedCollectionId, username);
    if (res.message) {
      alert(res.message);
      closeModal('share-modal');
    } else {
      alert(res.error || 'Failed to share');
    }
  } catch (err) {
    alert('Something went wrong');
  }
}

function viewCollection(id) {
  window.location.href = `problems.html?collection=${id}`;
}

window.onclick = (event) => {
  if (event.target.classList.contains('modal')) {
    event.target.style.display = 'none';
  }
};

loadCollections();
