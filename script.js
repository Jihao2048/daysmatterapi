(function() {
    const urlParams = new URLSearchParams(window.location.search);
    const title = urlParams.get('title');
    const dateStr = urlParams.get('date');
    const opacity = urlParams.get('opacity');
    const bg = urlParams.get('bg');
    const linkIcon = urlParams.get('icon');
    const linkName = urlParams.get('linkname');
    const linkUrl = urlParams.get('linkurl');
    
    const titleEl = document.getElementById('title');
    const daysEl = document.getElementById('days');
    const overlayEl = document.getElementById('overlay');
    const boxEl = document.querySelector('.box');
    const linksEl = document.getElementById('links');
    
    if (bg) {
        boxEl.style.backgroundImage = 'url(' + decodeURIComponent(bg) + ')';
    }
    
    if (linkIcon && linkName && linkUrl) {
        const iconNumber = parseInt(linkIcon);
        const iconData = icons.find(i => i.number === iconNumber);
        if (iconData) {
            linksEl.innerHTML = '<a href="' + decodeURIComponent(linkUrl) + '" target="_blank"><img src="' + iconData.path + '" class="link-icon"><span>' + decodeURIComponent(linkName) + '</span></a>';
        }
    }
    
    if (opacity !== null) {
        const opacityValue = parseFloat(opacity);
        if (!isNaN(opacityValue) && opacityValue >= 0.1 && opacityValue <= 1.0) {
            overlayEl.style.opacity = opacityValue;
        }
    }
    
    let useGyro = false;
    let currentRotateX = 0;
    let currentRotateY = 0;
    const gyroSmooth = 0.12; // 稍微提高平滑度

    // 创建陀螺仪激活按钮
    const gyroBtn = document.createElement('div');
    gyroBtn.id = 'gyro-btn';
    gyroBtn.innerHTML = '⟳';
    gyroBtn.title = '开启陀螺仪倾斜效果';
    Object.assign(gyroBtn.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        background: 'rgba(0,0,0,0.65)',
        color: '#fff',
        display: 'none',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px',
        cursor: 'pointer',
        zIndex: '9999',
        transition: 'all 0.2s ease',
        WebkitTapHighlightColor: 'transparent',
        userSelect: 'none',
        backdropFilter: 'blur(8px)',
        fontFamily: 'system-ui, sans-serif'
    });
    document.body.appendChild(gyroBtn);

    // 陀螺仪数据处理器（带平滑）
    function handleOrientation(e) {
        if (!useGyro) return;
        
        // gamma: 左右倾斜 (-90 到 90) → 控制 rotateY
        let gamma = e.gamma || 0;
        // beta: 前后倾斜 (-180 到 180) → 控制 rotateX
        let beta = e.beta || 0;
        
        // 限制范围，避免翻转过度
        const targetRotateY = Math.max(-28, Math.min(28, gamma * 0.65));
        // beta 范围处理：静止竖屏时约 45° 左右，以此为基准偏移
        const targetRotateX = Math.max(-22, Math.min(22, (beta - 45) * 0.45));
        
        // 平滑插值
        currentRotateY += (targetRotateY - currentRotateY) * gyroSmooth;
        currentRotateX += (targetRotateX - currentRotateX) * gyroSmooth;
        
        boxEl.style.transform = 'perspective(1200px) rotateX(' + currentRotateX.toFixed(2) + 'deg) rotateY(' + currentRotateY.toFixed(2) + 'deg) translateZ(20px)';
    }

    // 启动陀螺仪监听
    function startGyro() {
        if (useGyro) return;
        useGyro = true;
        window.addEventListener('deviceorientation', handleOrientation);
        gyroBtn.style.background = 'rgba(0,180,100,0.75)';
        gyroBtn.innerHTML = '✓';
        // 2秒后恢复图标
        setTimeout(() => {
            if (useGyro) gyroBtn.innerHTML = '⟳';
        }, 2000);
        console.log('陀螺仪已激活');
    }

    // iOS: 请求权限（必须在用户点击时直接调用）
    function requestIOSPermission() {
        // 关键：直接调用 requestPermission，不加任何异步延迟
        DeviceOrientationEvent.requestPermission()
            .then(permission => {
                if (permission === 'granted') {
                    startGyro();
                } else {
                    gyroBtn.style.background = 'rgba(200,60,60,0.75)';
                    gyroBtn.innerHTML = '✗';
                    setTimeout(() => {
                        gyroBtn.innerHTML = '⟳';
                        gyroBtn.style.background = 'rgba(0,0,0,0.65)';
                    }, 1500);
                }
            })
            .catch(err => {
                console.error('权限请求失败', err);
                gyroBtn.style.background = 'rgba(200,60,60,0.75)';
                setTimeout(() => {
                    gyroBtn.innerHTML = '⟳';
                    gyroBtn.style.background = 'rgba(0,0,0,0.65)';
                }, 1500);
            });
    }

    // 点击事件：根据平台决定如何请求
    gyroBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // 如果已经激活，不做任何事
        if (useGyro) return;
        
        // 动画反馈
        gyroBtn.style.transform = 'scale(0.85)';
        setTimeout(() => { gyroBtn.style.transform = 'scale(1)'; }, 150);
        
        // iOS 需要特殊权限请求
        if (typeof DeviceOrientationEvent !== 'undefined' && 
            typeof DeviceOrientationEvent.requestPermission === 'function') {
            requestIOSPermission();
        } else {
            // Android 或其他设备直接启动
            startGyro();
        }
    });

    // 检测移动设备：仅在手机/平板上显示陀螺仪按钮
    const isMobile = /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const hasGyroSupport = window.DeviceOrientationEvent;
    
    if (isMobile && hasGyroSupport) {
        gyroBtn.style.display = 'flex';
        // 对于非iOS设备（如Android），可以直接启用，无需等待点击
        if (typeof DeviceOrientationEvent.requestPermission !== 'function') {
            // Android 可以直接启动，但为了用户体验，还是等用户点击
            // 如果你希望自动启动，取消下面的注释：
            // startGyro();
        }
    }
    
    // 鼠标悬停效果（仅当陀螺仪未激活时工作）
    boxEl.addEventListener('mousemove', (e) => {
        if (useGyro) return; // 陀螺仪激活时禁用鼠标效果
        
        const rect = boxEl.getBoundingClientRect();
        const xRatio = (e.clientX - rect.left) / rect.width;
        const yRatio = (e.clientY - rect.top) / rect.height;
        
        const rotateY = (xRatio - 0.5) * 20;
        const rotateX = (0.5 - yRatio) * 15;
        
        boxEl.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
    });

    boxEl.addEventListener('mouseleave', () => {
        if (useGyro) return; // 陀螺仪激活时不由鼠标控制归位
        boxEl.style.transform = 'none';
    });
    
    // 标题和日期逻辑
    if (title) {
        titleEl.textContent = decodeURIComponent(title);
    } else {
        titleEl.textContent = '倒数日';
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    function parseDate(dateStr) {
        if (!dateStr) return null;
        const parts = dateStr.split(/[-/]/);
        if (parts.length === 3) {
            return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        }
        return null;
    }
    
    if (dateStr) {
        const targetDate = parseDate(dateStr);
        if (!targetDate || isNaN(targetDate.getTime())) {
            document.querySelector('#days .label').textContent = '日期格式错误';
            document.querySelector('#days .number').textContent = '';
            return;
        }
        targetDate.setHours(0, 0, 0, 0);
        
        const diffDays = Math.round((targetDate - today) / (1000 * 60 * 60 * 24));
        
        if (diffDays >= 0) {
            document.querySelector('#days .label').textContent = '还有';
            document.querySelector('#days .number').textContent = diffDays + ' 天';
        } else {
            document.querySelector('#days .label').textContent = '已经';
            document.querySelector('#days .number').textContent = Math.abs(diffDays) + ' 天';
        }
    } else {
        document.querySelector('#days .label').textContent = '请设置日期参数';
        document.querySelector('#days .number').textContent = '';
    }
})();