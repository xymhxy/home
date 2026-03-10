/**
 * 动态线条背景效果
 * 简约、时尚、科技感的动态线条动画
 */

(function() {
    'use strict';
    
    // Canvas 和上下文
    const canvas = document.getElementById('line-canvas');
    const ctx = canvas.getContext('2d');
    
    // 配置参数
    const config = {
        lineCount: 35,           // 线条数量
        speed: 0.3,              // 移动速度
        lineWidth: { min: 1, max: 2 },  // 线条宽度范围
        lineLength: { min: 80, max: 200 },  // 线条长度范围
        opacity: { min: 0.08, max: 0.25 },  // 透明度范围
        curveIntensity: 0.02,    // 曲线弯曲程度
        mouseRadius: 150,        // 鼠标影响半径
        mouseRepel: 0.5          // 鼠标排斥力度
    };
    
    // 线条数组
    let lines = [];
    
    // 鼠标位置
    let mouse = { x: null, y: null };
    
    // 当前主题颜色（默认渐变）
    let currentGradient = ['#667eea', '#764ba2'];
    
    // 主题颜色映射
    const themeColors = {
        'white': ['#667eea', '#764ba2', '#f093fb'],
        'blue': ['#0ea5e9', '#06b6d4', '#22d3ee'],
        'purple': ['#a855f7', '#ec4899', '#f472b6'],
        'green': ['#10b981', '#059669', '#34d399'],
        'pink': ['#f472b6', '#fb7185', '#fda4af'],
        'dark': ['#60a5fa', '#818cf8', '#a78bfa']
    };
    
    // 初始化画布大小
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    // 创建单条线
    function createLine() {
        const width = canvas.width;
        const height = canvas.height;
        
        return {
            x: Math.random() * width,
            y: Math.random() * height,
            length: config.lineLength.min + Math.random() * (config.lineLength.max - config.lineLength.min),
            width: config.lineWidth.min + Math.random() * (config.lineWidth.max - config.lineWidth.min),
            opacity: config.opacity.min + Math.random() * (config.opacity.max - config.opacity.min),
            angle: Math.random() * Math.PI * 2,
            angleSpeed: (Math.random() - 0.5) * 0.01,
            speed: config.speed + Math.random() * 0.2,
            curve: 0,
            colorIndex: Math.floor(Math.random() * currentGradient.length)
        };
    }
    
    // 初始化所有线条
    function initLines() {
        lines = [];
        for (let i = 0; i < config.lineCount; i++) {
            lines.push(createLine());
        }
    }
    
    // 更新线条位置
    function updateLine(line) {
        // 曲线变化
        line.curve += (Math.random() - 0.5) * config.curveIntensity;
        line.curve = Math.max(-1, Math.min(1, line.curve));
        
        // 角度变化
        line.angle += line.angleSpeed + line.curve * 0.02;
        
        // 计算移动方向
        let dx = Math.cos(line.angle) * line.speed;
        let dy = Math.sin(line.angle) * line.speed;
        
        // 鼠标排斥效果
        if (mouse.x !== null && mouse.y !== null) {
            const distX = line.x - mouse.x;
            const distY = line.y - mouse.y;
            const dist = Math.sqrt(distX * distX + distY * distY);
            
            if (dist < config.mouseRadius) {
                const force = (config.mouseRadius - dist) / config.mouseRadius;
                dx += (distX / dist) * force * config.mouseRepel;
                dy += (distY / dist) * force * config.mouseRepel;
            }
        }
        
        // 更新位置
        line.x += dx;
        line.y += dy;
        
        // 边界检测，循环出现
        const padding = line.length;
        if (line.x < -padding) line.x = canvas.width + padding;
        if (line.x > canvas.width + padding) line.x = -padding;
        if (line.y < -padding) line.y = canvas.height + padding;
        if (line.y > canvas.height + padding) line.y = -padding;
    }
    
    // 绘制单条线
    function drawLine(line) {
        const endX = line.x + Math.cos(line.angle) * line.length;
        const endY = line.y + Math.sin(line.angle) * line.length;
        
        // 创建渐变
        const gradient = ctx.createLinearGradient(line.x, line.y, endX, endY);
        const color = currentGradient[line.colorIndex % currentGradient.length];
        
        gradient.addColorStop(0, hexToRgba(color, 0));
        gradient.addColorStop(0.3, hexToRgba(color, line.opacity));
        gradient.addColorStop(0.7, hexToRgba(color, line.opacity));
        gradient.addColorStop(1, hexToRgba(color, 0));
        
        ctx.beginPath();
        ctx.moveTo(line.x, line.y);
        
        // 绘制贝塞尔曲线，让线条更有动感
        const midX = (line.x + endX) / 2;
        const midY = (line.y + endY) / 2;
        const cpX = midX + Math.sin(line.angle) * line.curve * 50;
        const cpY = midY - Math.cos(line.angle) * line.curve * 50;
        
        ctx.quadraticCurveTo(cpX, cpY, endX, endY);
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = line.width;
        ctx.lineCap = 'round';
        ctx.stroke();
    }
    
    // 颜色转换辅助函数
    function hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    
    // 绘制连接线（可选效果）
    function drawConnections() {
        const connectionDistance = 150;
        
        for (let i = 0; i < lines.length; i++) {
            for (let j = i + 1; j < lines.length; j++) {
                const dx = lines[i].x - lines[j].x;
                const dy = lines[i].y - lines[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < connectionDistance) {
                    const opacity = (1 - dist / connectionDistance) * 0.08;
                    ctx.beginPath();
                    ctx.moveTo(lines[i].x, lines[i].y);
                    ctx.lineTo(lines[j].x, lines[j].y);
                    ctx.strokeStyle = hexToRgba(currentGradient[0], opacity);
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }
    
    // 动画循环
    function animate() {
        // 清除画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 绘制连接线（可选，取消注释启用）
        // drawConnections();
        
        // 更新并绘制所有线条
        lines.forEach(line => {
            updateLine(line);
            drawLine(line);
        });
        
        requestAnimationFrame(animate);
    }
    
    // 监听窗口大小变化
    window.addEventListener('resize', () => {
        resizeCanvas();
    });
    
    // 监听鼠标移动
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    
    // 监听鼠标离开
    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });
    
    // 监听主题变化
    function observeThemeChange() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
                    const theme = document.documentElement.getAttribute('data-theme') || 'white';
                    currentGradient = themeColors[theme] || themeColors.white;
                }
            });
        });
        
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });
    }
    
    // 初始化
    function init() {
        resizeCanvas();
        initLines();
        observeThemeChange();
        animate();
    }
    
    // 启动
    init();
})();