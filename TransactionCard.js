/**
 * Transaction Card Component
 * Renders individual transaction with category selector and cashback row
 */

const CATEGORY_OPTIONS = [
  'Food & Dining',
  'Travel', 
  'Salary',
  'Miscellaneous'
];

const CATEGORY_ICONS = {
  'Food & Dining': '🍽️',
  'Travel': '🚗',
  'Salary': '💰',
  'Miscellaneous': '📦'
};

const CATEGORY_COLORS = {
  'Food & Dining': '#FF6B6B',
  'Travel': '#4ECDC4',
  'Salary': '#45B7D1',
  'Miscellaneous': '#96CEB4'
};

class TransactionCard {
  constructor(transaction) {
    this.transaction = transaction;
    this.element = null;
  }

  render() {
    const isIncoming = this.transaction.amount > 0;
    const absAmount = Math.abs(this.transaction.amount);
    const categoryColor = CATEGORY_COLORS[this.transaction.category] || '#96CEB4';

    const card = document.createElement('div');
    card.className = 'transaction-card';
    card.style.setProperty('--card-accent', categoryColor);
    card.style.setProperty('--icon-bg', categoryColor + '20');
    card.dataset.id = this.transaction.id;
    card.dataset.direction = isIncoming ? 'incoming' : 'outgoing';

    const date = new Date(this.transaction.timestamp);
    const timeStr = date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });

    card.innerHTML = `
      <div class="card-main">
        <div class="card-left">
          <div class="card-icon">${CATEGORY_ICONS[this.transaction.category] || '📦'}</div>
          <div class="card-info">
            <div class="card-description">${this.escapeHtml(this.transaction.description)}</div>
            <div class="card-meta">
              <span class="card-time">
                <i class="far fa-clock"></i>
                ${timeStr}
              </span>
              <span class="card-merchant">${this.escapeHtml(this.transaction.merchant)}</span>
            </div>
          </div>
        </div>
        <div class="card-right">
          <div class="card-amount ${isIncoming ? 'incoming' : 'outgoing'}">
            ${isIncoming ? '+' : '-'}Rs. ${absAmount.toLocaleString()}
          </div>
          <div class="category-dropdown">
            <select class="category-select" data-transaction-id="${this.transaction.id}">
              ${CATEGORY_OPTIONS.map(cat => `
                <option value="${cat}" ${cat === this.transaction.category ? 'selected' : ''}>
                  ${cat}
                </option>
              `).join('')}
            </select>
          </div>
        </div>
      </div>
      ${this.renderCashbackRow()}
    `;

    const select = card.querySelector('.category-select');
    select.addEventListener('change', (e) => this.handleCategoryChange(e));

    this.element = card;
    return card;
  }

  renderCashbackRow() {
    const isRewardEligible = this.transaction.cashbackAmount > 0 && !this.transaction.isCashback;
    const isCashback = this.transaction.isCashback;

    if (!isCashback && !isRewardEligible) return '';

    const amount = this.transaction.cashbackAmount;
    const label = isCashback ? 'Cashback Received' : 'Expected Savings';
    const note = isCashback 
      ? 'Reward credited to your account' 
      : `Estimated ${(amount / Math.abs(this.transaction.amount) * 100).toFixed(0)}% reward points`;

    return `
      <div class="cashback-row">
        <div class="cashback-icon">
          <i class="fas fa-gift"></i>
        </div>
        <div class="cashback-info">
          <div class="cashback-label">
            <i class="fas fa-leaf"></i>
            ${label}
          </div>
          <div class="cashback-amount">Rs. ${amount.toLocaleString()}</div>
          <div class="cashback-note">${note}</div>
        </div>
      </div>
    `;
  }

  async handleCategoryChange(event) {
    const newCategory = event.target.value;
    const transactionId = event.target.dataset.transactionId;

    try {
      event.target.disabled = true;
      await API.updateCategory(transactionId, newCategory);

      const card = event.target.closest('.transaction-card');
      const newColor = CATEGORY_COLORS[newCategory];
      card.style.setProperty('--card-accent', newColor);
      card.style.setProperty('--icon-bg', newColor + '20');

      const iconEl = card.querySelector('.card-icon');
      iconEl.textContent = CATEGORY_ICONS[newCategory];

      if (window.app) {
        window.app.refreshAnalytics();
      }

      showToast('Category updated successfully');
    } catch (error) {
      console.error('Failed to update category:', error);
      showToast('Failed to update category', 'error');
      event.target.value = this.transaction.category;
    } finally {
      event.target.disabled = false;
    }
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

window.TransactionCard = TransactionCard;
