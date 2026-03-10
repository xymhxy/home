/**
 * 鼠标跟随效果
 * 简约时尚的光晕跟随 + 鼠标造型光标
 */

(function() {
    'use strict';
    
    // DOM 元素
    const cursorGlow = document.getElementById('cursor-glow');
    const cursorPointer = document.getElementById('cursor-pointer');
    
    // 当前位置
    let mouseX = 0;
    let mouseY = 0;
    
    // 光晕目标位置（带延迟）
    let glowX = 0;
    let glowY = 0;
    
    // 光标目标位置（几乎无延迟）
    let pointerX = 0;
    let pointerY = 0;
    
    // 动画帧ID
    let animationId = null;
    
    // 是否悬停在交互元素上
    let isHovering = false;
    
    // 配置
    const config = {
        glowDelay: 0.08,      // 光晕跟随延迟（越小越快）
        pointerDelay: 0.35    // 光标跟随延迟
    };
    
    // 更新鼠标位置
    function updateMousePosition(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    }
    
    // 动画循环
    function animate() {
        // 光晕平滑跟随（较慢）
        glowX += (mouseX - glowX) * config.glowDelay;
        glowY += (mouseY - glowY) * config.glowDelay;
        
        // 光标平滑跟随
        pointerX += (mouseX - pointerX) * config.pointerDelay;
        pointerY += (mouseY - pointerY) * config.pointerDelay;
        
        // 应用位置 - 光晕居中
        cursorGlow.style.left = glowX + 'px';
        cursorGlow.style.top = glowY + 'px';
        
        // 光标位于鼠标尖端（稍微偏移）
        cursorPointer.style.left = pointerX + 'px';
        cursorPointer.style.top = pointerY + 'px';
        
        animationId = requestAnimationFrame(animate);
    }
    
    // 检测是否为可交互元素
    function isInteractiveElement(el) {
        return el.closest('a, button, .tool-card, .theme-btn, input, textarea, [role="button"]');
    }
    
    // 鼠标移入交互元素
    function handleMouseEnter(e) {
        const target = e.target;
        if (isInteractiveElement(target)) {
            isHovering = true;
            cursorPointer.classList.add('hover');
        }
    }
    
    // 鼠标移出交互元素
    function handleMouseLeave(e) {
        const target = e.target;
        if (isInteractiveElement(target)) {
            isHovering = false;
            cursorPointer.classList.remove('hover');
        }
    }
    
    // 鼠标按下
    function handleMouseDown() {
        cursorPointer.style.transform = 'scale(0.85)';
    }
    
    // 鼠标释放
    function handleMouseUp() {
        const scale = isHovering ? 'scale(1.3)' : 'scale(1)';
        cursorPointer.style.transform = scale;
    }
    
    // 鼠标离开窗口
    function handleMouseLeaveWindow() {
        cursorGlow.style.opacity = '0';
        cursorPointer.style.opacity = '0';
    }
    
    // 鼠标进入窗口
    function handleMouseEnterWindow() {
        cursorGlow.style.opacity = '';
        cursorPointer.style.opacity = '';
    }
    
    // 绑定事件
    function bindEvents() {
        // 鼠标移动
        document.addEventListener('mousemove', updateMousePosition);
        
        // 悬停检测
        document.addEventListener('mouseover', handleMouseEnter);
        document.addEventListener('mouseout', handleMouseLeave);
        
        // 点击效果
        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mouseup', handleMouseUp);
        
        // 窗口边界
        document.addEventListener('mouseleave', handleMouseLeaveWindow);
        document.addEventListener('mouseenter', handleMouseEnterWindow);
        
        // 触摸设备隐藏自定义光标
        document.addEventListener('touchstart', () => {
            cursorGlow.style.display = 'none';
            cursorPointer.style.display = 'none';
            document.body.style.cursor = 'auto';
        }, { once: true });
    }
    
    // 初始化
    function init() {
        // 设置初始位置（避免从左上角飞入）
        glowX = window.innerWidth / 2;
        glowY = window.innerHeight / 2;
        pointerX = glowX;
        pointerY = glowY;
        mouseX = glowX;
        mouseY = glowY;
        
        cursorGlow.style.left = glowX + 'px';
        cursorGlow.style.top = glowY + 'px';
        cursorPointer.style.left = pointerX + 'px';
        cursorPointer.style.top = pointerY + 'px';
        
        bindEvents();
        animate();
    }
    
    // 启动
    document.addEventListener('DOMContentLoaded', init);
})();