// ========================================
// 主题切换功能
// ========================================

// 当前主题
let currentTheme = 'white';

// 初始化主题
function initTheme() {
    const savedTheme = localStorage.getItem('toolkit-theme');
    if (savedTheme) {
        currentTheme = savedTheme;
        document.documentElement.setAttribute('data-theme', currentTheme);
        updateThemeButtons();
    }
}

// 切换主题
function switchTheme(theme) {
    currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('toolkit-theme', theme);
    updateThemeButtons();
}

// 更新主题按钮状态
function updateThemeButtons() {
    const buttons = document.querySelectorAll('.theme-btn');
    buttons.forEach(btn => {
        if (btn.dataset.theme === currentTheme) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// 绑定主题切换事件
function bindThemeEvents() {
    const buttons = document.querySelectorAll('.theme-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            switchTheme(btn.dataset.theme);
        });
    });
}

// ========================================
// 工具跳转功能
// ========================================

function openTool(toolId) {
    const tools = {
        'pk-anger': {
            name: 'PK愤怒计算器',
            url: 'https://www.baidu.com'
        },
        '19-gates': {
            name: '19门准备工具',
            url: 'https://www.baidu.com'
        },
        'wuse-lingchen': {
            name: '五色灵尘计算器',
            url: 'https://xymhxy.github.io/wuselingchen/'
        },
        'paohuan': {
            name: '跑环成本计算器',
            url: 'https://xymhxy.github.io/paohuan/'
        },
        'shangguyupo': {
            name: '上古玉魄鉴定玩法',
            url: 'https://xymhxy.github.io/shangguyupo/'
        }
    };
    
    const tool = tools[toolId];
    if (tool) {
        // 添加点击动画效果
        const card = event.currentTarget;
        card.style.transform = 'scale(0.98)';
        setTimeout(() => {
            card.style.transform = '';
            // 跳转到目标页面
            window.open(tool.url, '_blank');
        }, 150);
    }
}

// ========================================
// Toast 提示
// ========================================

function showToast(message, type = 'info') {
    // 移除已存在的toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // 创建新的toast
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <span class="toast-icon">${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
        <span class="toast-message">${message}</span>
    `;
    
    // 添加样式
    toast.style.cssText = `
        position: fixed;
        bottom: 32px;
        left: 50%;
        transform: translateX(-50%) translateY(20px);
        background: var(--bg-card);
        color: var(--text-primary);
        padding: 12px 24px;
        border-radius: 12px;
        box-shadow: var(--shadow-lg);
        border: 1px solid var(--border-color);
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 14px;
        font-weight: 500;
        z-index: 2000;
        opacity: 0;
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    // 显示动画
    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';
    });
    
    // 自动隐藏
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(20px)';
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

// ========================================
// 页面加载完成后初始化
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    bindThemeEvents();
    
    // 添加页面加载完成的类
    document.body.classList.add('loaded');
});

// ========================================
// 添加触摸反馈（移动端）
// ========================================

document.querySelectorAll('.tool-card').forEach(card => {
    card.addEventListener('touchstart', function() {
        this.style.transform = 'scale(0.98)';
    }, { passive: true });
    
    card.addEventListener('touchend', function() {
        this.style.transform = '';
    }, { passive: true });
});
