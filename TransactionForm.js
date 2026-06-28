/**
 * Transaction Form Component
 * Handles raw text input and submission for parsing
 */

class TransactionForm {
  constructor() {
    this.input = document.getElementById('rawTextInput');
    this.button = document.getElementById('addTransactionBtn');
    this.loadingOverlay = document.getElementById('loadingOverlay');

    this.attachListeners();
  }

  attachListeners() {
    this.button.addEventListener('click', () => this.handleSubmit());

    this.input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.handleSubmit();
      }
    });
  }

  async handleSubmit() {
    const rawText = this.input.value.trim();

    if (!rawText) {
      showToast('Please enter a transaction message', 'error');
      return;
    }

    this.setLoading(true);

    try {
      const response = await API.createTransaction(rawText);
      const newTransaction = response.data;

      this.input.value = '';

      if (window.app) {
        window.app.addTransactionToFeed(newTransaction, true);
        window.app.refreshAnalytics();
        window.app.refreshHeaderStats();
      }

      showToast('Transaction added successfully!');
    } catch (error) {
      console.error('Failed to add transaction:', error);
      showToast(error.message || 'Failed to parse transaction', 'error');
    } finally {
      this.setLoading(false);
    }
  }

  setLoading(isLoading) {
    this.loadingOverlay.classList.toggle('hidden', !isLoading);
    this.button.disabled = isLoading;
  }
}

window.TransactionForm = TransactionForm;
