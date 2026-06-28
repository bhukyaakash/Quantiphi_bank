/**
 * Main Application Entry Point
 * Orchestrates all components and manages global state
 */

// Toast notification helper
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');
  const icon = toast.querySelector('i');

  toastMessage.textContent = message;

  if (type === 'error') {
    toast.style.borderColor = 'var(--accent-danger)';
    icon.className = 'fas fa-exclamation-circle';
    icon.style.color = 'var(--accent-danger)';
  } else {
    toast.style.borderColor = 'var(--accent-success)';
    icon.className = 'fas fa-check-circle';
    icon.style.color = 'var(--accent-success)';
  }

  toast.classList.remove('hidden');

  setTimeout(() => {
    toast.classList.add('hidden');
  }, 3000);
}

class App {
  constructor() {
    this.transactions = [];
    this.analyticsBlock = null;
    this.transactionFeed = document.getElementById('transactionFeed');
    this.currentFilter = 'all';
    this.filterButtons = document.querySelectorAll('.filter-btn');

    this.init();
  }

  async init() {
    this.analyticsBlock = new AnalyticsBlock('progressContainer');
    new TransactionForm();

    this.setupFilters();

    await this.loadData();
  }

  setupFilters() {
    this.filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        this.currentFilter = btn.dataset.filter;
        this.renderTransactions();
      });
    });
  }

  async loadData() {
    try {
      const txResponse = await API.getTransactions();
      this.transactions = txResponse.data;

      this.renderTransactions();
      await this.analyticsBlock.render();
      this.updateHeaderStats();

    } catch (error) {
      console.error('Failed to load data:', error);
      showToast('Failed to load data. Is the server running?', 'error');
    }
  }

  renderTransactions() {
    this.transactionFeed.innerHTML = '';

    const filtered = this.transactions.filter(t => {
      if (this.currentFilter === 'all') return true;
      const direction = t.amount > 0 ? 'incoming' : 'outgoing';
      return direction === this.currentFilter;
    });

    if (filtered.length === 0) {
      this.transactionFeed.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-receipt"></i>
          <p>No transactions found</p>
        </div>
      `;
      return;
    }

    filtered.forEach(transaction => {
      const card = new TransactionCard(transaction);
      this.transactionFeed.appendChild(card.render());
    });
  }

  addTransactionToFeed(transaction, prepend = false) {
    this.transactions.unshift(transaction);

    if (prepend && this.currentFilter === 'all') {
      const card = new TransactionCard(transaction);
      const newCard = card.render();

      newCard.style.animation = 'none';
      this.transactionFeed.insertBefore(newCard, this.transactionFeed.firstChild);

      newCard.offsetHeight;
      newCard.style.animation = '';
    } else {
      this.renderTransactions();
    }
  }

  async refreshAnalytics() {
    await this.analyticsBlock.refresh();
  }

  refreshHeaderStats() {
    this.updateHeaderStats();
  }

  updateHeaderStats() {
    let incoming = 0;
    let outgoing = 0;
    let cashback = 0;

    this.transactions.forEach(t => {
      if (t.amount > 0) {
        incoming += t.amount;
      } else {
        outgoing += Math.abs(t.amount);
      }
      if (t.isCashback) {
        cashback += t.cashbackAmount;
      }
    });

    document.getElementById('totalIncoming').textContent = `Rs. ${incoming.toLocaleString()}`;
    document.getElementById('totalOutgoing').textContent = `Rs. ${outgoing.toLocaleString()}`;
    document.getElementById('totalSavings').textContent = `Rs. ${cashback.toLocaleString()}`;
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});
