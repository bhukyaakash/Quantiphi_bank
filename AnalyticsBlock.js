/**
 * Analytics Block Component
 * Renders categorized progress bars with dynamic fill
 */

const CATEGORY_CONFIG = {
  'Food & Dining': {
    color: '#FF6B6B',
    glow: 'rgba(255, 107, 107, 0.3)',
    icon: '🍽️',
    label: 'Food & Dining'
  },
  'Travel': {
    color: '#4ECDC4',
    glow: 'rgba(78, 205, 196, 0.3)',
    icon: '🚗',
    label: 'Travel'
  },
  'Salary': {
    color: '#45B7D1',
    glow: 'rgba(69, 183, 209, 0.3)',
    icon: '💰',
    label: 'Salary'
  },
  'Miscellaneous': {
    color: '#96CEB4',
    glow: 'rgba(150, 206, 180, 0.3)',
    icon: '📦',
    label: 'Miscellaneous'
  }
};

class AnalyticsBlock {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.summaryData = null;
  }

  async render() {
    try {
      const response = await API.getSummary();
      this.summaryData = response.data;
      this.buildBlocks();
    } catch (error) {
      console.error('Failed to load analytics:', error);
      this.container.innerHTML = '<p class="empty-state">Failed to load analytics</p>';
    }
  }

  buildBlocks() {
    const { categorySummary } = this.summaryData;
    const total = Object.values(categorySummary).reduce((sum, val) => sum + val, 0);

    this.container.innerHTML = '';

    Object.entries(categorySummary).forEach(([category, amount], index) => {
      const config = CATEGORY_CONFIG[category];
      const percentage = total > 0 ? (amount / total) * 100 : 0;

      const block = document.createElement('div');
      block.className = 'progress-block';
      block.style.setProperty('--block-color', config.color);
      block.style.setProperty('--block-color-glow', config.glow);
      block.style.animationDelay = `${index * 0.1}s`;

      block.innerHTML = `
        <div class="progress-header">
          <span class="progress-icon">${config.icon}</span>
          <span class="progress-amount">Rs. ${amount.toLocaleString()}</span>
        </div>
        <div class="progress-label">${config.label}</div>
        <div class="progress-track">
          <div class="progress-fill" style="width: 0%" data-width="${percentage}%"></div>
        </div>
        <div class="progress-percentage">${percentage.toFixed(1)}% of spending</div>
      `;

      this.container.appendChild(block);

      setTimeout(() => {
        const fill = block.querySelector('.progress-fill');
        fill.style.width = fill.dataset.width;
      }, 100 + (index * 100));
    });
  }

  async refresh() {
    await this.render();
  }
}

window.AnalyticsBlock = AnalyticsBlock;
