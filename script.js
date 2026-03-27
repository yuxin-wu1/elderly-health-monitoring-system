// 全局变量
let behaviorChart;
let updateInterval;
let modelRotation = 0;
let isRotating = false;

// 初始化函数
function init() {
    // 初始化侧边栏切换
    initSideNav();
    
    // 初始化时间显示
    updateTime();
    setInterval(updateTime, 1000);
    
    // 初始化行为趋势图表
    initBehaviorChart();
    
    // 初始化2D行为模型
    initBehaviorModel();
    
    // 初始化数据更新
    startDataUpdate();
    
    // 初始化弹窗功能
    initModals();
    
    // 初始化告警项点击事件
    initAlertItems();
    
    // 初始化数据看板点击事件
    initDashboardCards();
    
    // 初始化系统设置功能
    initSettings();
}

// 初始化侧边栏切换
function initSideNav() {
    const navItems = document.querySelectorAll('.nav-item');
    const modules = document.querySelectorAll('.module');
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // 移除所有导航项的active类
            navItems.forEach(nav => nav.classList.remove('active'));
            // 添加当前导航项的active类
            item.classList.add('active');
            
            // 隐藏所有模块
            modules.forEach(module => module.classList.remove('active'));
            // 显示对应模块
            const moduleId = item.dataset.module;
            document.getElementById(moduleId).classList.add('active');
            
            // 重新初始化图表，确保在模块切换后图表能正确显示
            setTimeout(() => {
                initBehaviorChart();
                initBehaviorModel();
            }, 100);
        });
    });
}

// 初始化系统设置功能
function initSettings() {
    // 设备在线状态切换
    if (document.getElementById('device-online')) {
        document.getElementById('device-online').addEventListener('change', function() {
            const statusDot = document.querySelector('.status-dot');
            const statusText = document.querySelector('.device-status span:last-child');
            if (this.checked) {
                statusDot.className = 'status-dot online';
                statusText.textContent = '设备在线';
            } else {
                statusDot.className = 'status-dot offline';
                statusText.textContent = '设备离线';
            }
        });
    }
    
    // 保存联系人信息
    if (document.getElementById('save-contacts')) {
        document.getElementById('save-contacts').addEventListener('click', function() {
            const name = document.getElementById('contact-name').value;
            const relation = document.getElementById('contact-relation').value;
            const phone = document.getElementById('contact-phone').value;
            alert(`联系人信息已保存：\n姓名：${name}\n关系：${relation}\n电话：${phone}`);
        });
    }
}

// 更新时间显示
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    document.getElementById('current-time').textContent = timeString;
}

// 初始化行为趋势图表 - 优化纵坐标
function initBehaviorChart() {
    const ctx = document.getElementById('behaviorChart');
    if (ctx) {
        const ctx2d = ctx.getContext('2d');
        if (behaviorChart) {
            behaviorChart.destroy();
        }
        behaviorChart = new Chart(ctx2d, {
            type: 'line',
            data: {
                labels: ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30'],
                datasets: [{
                    label: '行为活动强度',
                    data: [3, 5, 2, 4, 6, 3, 5, 4, 2, 3],
                    borderColor: '#1a73e8',
                    backgroundColor: 'rgba(26, 115, 232, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            font: {
                                size: 12
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 10,
                        title: {
                            display: true,
                            text: '活动强度',
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        },
                        ticks: {
                            stepSize: 2,
                            callback: function(value) {
                                if (value === 0) return '无';
                                if (value === 2) return '轻微';
                                if (value === 4) return '中等';
                                if (value === 6) return '较强';
                                if (value === 8) return '很强';
                                if (value === 10) return '剧烈';
                                return value;
                            }
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: '时间',
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        }
                    }
                }
            }
        });
    }
}





// 开始数据更新
function startDataUpdate() {
    updateInterval = setInterval(() => {
        updateSensorData();
    }, 3000);
}

// 更新传感器数据
function updateSensorData() {
    const now = new Date();
    const timeString = now.toLocaleString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    const dateTimeString = `${now.toLocaleDateString('zh-CN')} ${timeString}`;
    
    // 模拟行为数据
    const behaviors = ['行走', '站立', '坐下', '躺下', '静止'];
    const randomBehavior = behaviors[Math.floor(Math.random() * behaviors.length)];
    
    // 更新总览模块
    if (document.getElementById('latest-behavior')) {
        document.getElementById('latest-behavior').textContent = randomBehavior;
    }
    
    // 模拟状态数据
    const isNormal = Math.random() > 0.1; // 90%概率正常
    
    // 更新总览模块状态
    if (document.getElementById('current-status')) {
        const statusElement = document.getElementById('current-status');
        if (isNormal) {
            statusElement.textContent = '正常';
            statusElement.className = 'value status-normal';
        } else {
            statusElement.textContent = '异常';
            statusElement.className = 'value status-abnormal';
        }
    }
    
    // 模拟置信度
    const confidence = Math.floor(Math.random() * 10) + 90;
    
    // 更新总览模块置信度
    if (document.getElementById('confidence')) {
        document.getElementById('confidence').textContent = `${confidence}%`;
    }
    
    // 更新总览模块时间
    if (document.getElementById('status-time')) {
        document.getElementById('status-time').textContent = dateTimeString;
    }
    

    
    // 模拟WiFi信号数据
    const signalStrength = Math.floor(Math.random() * 2) + 3;
    const channelQuality = Math.floor(Math.random() * 20) + 70;
    const phaseChange = Math.floor(Math.random() * 360);
    
    // 更新总览模块WiFi信号数据
    const signalDots = document.querySelectorAll('.signal-dot');
    signalDots.forEach((dot, index) => {
        if (index < signalStrength) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
    
    if (document.getElementById('channel-quality')) {
        document.getElementById('channel-quality').textContent = `${channelQuality}dB`;
    }
    if (document.getElementById('phase-change')) {
        document.getElementById('phase-change').textContent = `${phaseChange}°`;
    }
    
    // 模拟安全监测数据
    const fallDetection = Math.random() > 0.05; // 95%概率正常
    const longStationary = Math.random() > 0.1; // 90%概率正常
    const behaviorAnomaly = Math.random() > 0.15; // 85%概率正常
    
    // 更新总览模块安全监测数据
    if (document.getElementById('fall-detection')) {
        const fallElement = document.getElementById('fall-detection');
        if (fallDetection) {
            fallElement.textContent = '正常';
            fallElement.className = 'safety-status normal';
        } else {
            fallElement.textContent = '异常';
            fallElement.className = 'safety-status abnormal';
        }
    }
    
    if (document.getElementById('long-stationary')) {
        const stationaryElement = document.getElementById('long-stationary');
        if (longStationary) {
            stationaryElement.textContent = '正常';
            stationaryElement.className = 'safety-status normal';
        } else {
            stationaryElement.textContent = '异常';
            stationaryElement.className = 'safety-status abnormal';
        }
    }
    
    if (document.getElementById('behavior-anomaly')) {
        const anomalyElement = document.getElementById('behavior-anomaly');
        if (behaviorAnomaly) {
            anomalyElement.textContent = '正常';
            anomalyElement.className = 'safety-status normal';
        } else {
            anomalyElement.textContent = '异常';
            anomalyElement.className = 'safety-status abnormal';
        }
    }
    
    // 模拟活动量统计数据
    const todayActivity = Math.floor(Math.random() * 500) + 1000;
    const stepsCount = Math.floor(Math.random() * 1000) + 3000;
    const activityDuration = Math.floor(Math.random() * 60) + 120;
    
    // 更新行为监测模块活动量统计数据
    if (document.getElementById('today-activity')) {
        document.getElementById('today-activity').textContent = `${todayActivity} kcal`;
    }
    if (document.getElementById('steps-count')) {
        document.getElementById('steps-count').textContent = `${stepsCount} 步`;
    }
    if (document.getElementById('activity-duration')) {
        document.getElementById('activity-duration').textContent = `${Math.floor(activityDuration/60)}h ${activityDuration%60}m`;
    }
    
    // 模拟室内定位数据
    const indoorPositions = ['客厅', '卧室', '厨房', '卫生间', '阳台'];
    const randomPosition = indoorPositions[Math.floor(Math.random() * indoorPositions.length)];
    const indoorAccuracy = (Math.random() * 0.5 + 0.5).toFixed(1);
    
    // 更新行为监测模块室内定位数据
    if (document.getElementById('indoor-position')) {
        document.getElementById('indoor-position').textContent = randomPosition;
    }
    if (document.getElementById('indoor-accuracy')) {
        document.getElementById('indoor-accuracy').textContent = `${indoorAccuracy}m`;
    }
    
    // 更新行为监测模块
    if (document.getElementById('current-behavior')) {
        document.getElementById('current-behavior').textContent = randomBehavior;
    }
    if (document.getElementById('behavior-status')) {
        const behaviorStatusElement = document.getElementById('behavior-status');
        if (isNormal) {
            behaviorStatusElement.textContent = '正常';
            behaviorStatusElement.className = 'value status-normal';
        } else {
            behaviorStatusElement.textContent = '异常';
            behaviorStatusElement.className = 'value status-abnormal';
        }
    }
    if (document.getElementById('behavior-confidence')) {
        document.getElementById('behavior-confidence').textContent = `${confidence}%`;
    }
    if (document.getElementById('behavior-time')) {
        document.getElementById('behavior-time').textContent = dateTimeString;
    }
    
    // 更新定位追踪模块
    if (document.getElementById('location-precision')) {
        document.getElementById('location-precision').textContent = `${locationAccuracy}m`;
    }
    if (document.getElementById('location-time')) {
        document.getElementById('location-time').textContent = dateTimeString;
    }
    
    // 更新行为趋势图表
    updateBehaviorChart();
    
    // 更新2D行为模型
    updateBehaviorModel(randomBehavior);
    
    // 更新历史行为记录
    updateBehaviorHistory(randomBehavior, isNormal);
}

// 更新行为趋势图表
function updateBehaviorChart() {
    if (behaviorChart) {
        const newData = behaviorChart.data.datasets[0].data;
        newData.shift();
        newData.push(Math.floor(Math.random() * 8) + 1);
        behaviorChart.update();
    }
}



// 更新历史行为记录 - 改为三列网格布局
function updateBehaviorHistory(behavior, isNormal) {
    if (document.getElementById('behavior-history')) {
        const historyBody = document.getElementById('behavior-history');
        const now = new Date();
        const timeString = now.toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit'
        });
        const dateString = now.toLocaleDateString('zh-CN');
        
        // 创建新的记录卡片
        const newCard = document.createElement('div');
        newCard.className = 'behavior-history-card';
        newCard.innerHTML = `
            <div class="history-time">${dateString} ${timeString}</div>
            <div class="history-behavior">${behavior}</div>
            <div class="history-status">
                <span class="${isNormal ? 'status-normal' : 'status-abnormal'}">${isNormal ? '正常' : '异常'}</span>
            </div>
        `;
        
        // 添加到网格顶部
        historyBody.insertBefore(newCard, historyBody.firstChild);
        
        // 保持只显示9条记录（3列×3行）
        if (historyBody.children.length > 9) {
            historyBody.removeChild(historyBody.lastChild);
        }
    }
}

// 初始化弹窗功能
function initModals() {
    // 详情弹窗
    const detailModal = document.getElementById('detail-modal');
    const closeModal = document.getElementById('close-modal');
    const closeBtn = document.querySelector('.close-btn');
    
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            if (detailModal) {
                detailModal.classList.remove('active');
            }
        });
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            if (detailModal) {
                detailModal.classList.remove('active');
            }
        });
    }
    
    // 点击弹窗外部关闭
    if (detailModal) {
        detailModal.addEventListener('click', (e) => {
            if (e.target === detailModal) {
                detailModal.classList.remove('active');
            }
        });
    }
    
    // 紧急呼叫弹窗
    const emergencyModal = document.getElementById('emergency-modal');
    const emergencyBtn = document.querySelector('.emergency-btn');
    const cancelEmergency = document.getElementById('cancel-emergency');
    const confirmEmergency = document.getElementById('confirm-emergency');
    const emergencyCloseBtn = emergencyModal ? emergencyModal.querySelector('.close-btn') : null;
    
    if (emergencyBtn) {
        emergencyBtn.addEventListener('click', () => {
            if (emergencyModal) {
                emergencyModal.classList.add('active');
            }
        });
    }
    
    if (cancelEmergency) {
        cancelEmergency.addEventListener('click', () => {
            if (emergencyModal) {
                emergencyModal.classList.remove('active');
            }
        });
    }
    
    if (confirmEmergency) {
        confirmEmergency.addEventListener('click', () => {
            alert('紧急呼叫已发送！');
            if (emergencyModal) {
                emergencyModal.classList.remove('active');
            }
        });
    }
    
    if (emergencyCloseBtn) {
        emergencyCloseBtn.addEventListener('click', () => {
            if (emergencyModal) {
                emergencyModal.classList.remove('active');
            }
        });
    }
    
    // 点击弹窗外部关闭
    if (emergencyModal) {
        emergencyModal.addEventListener('click', (e) => {
            if (e.target === emergencyModal) {
                emergencyModal.classList.remove('active');
            }
        });
    }
}

// 初始化告警项点击事件
function initAlertItems() {
    const alertItems = document.querySelectorAll('.alert-item');
    
    alertItems.forEach(item => {
        item.addEventListener('click', () => {
            const details = item.querySelector('.alert-details');
            if (details) {
                if (details.style.display === 'none') {
                    details.style.display = 'block';
                } else {
                    details.style.display = 'none';
                }
            }
        });
    });
}

// 初始化数据看板点击事件
function initDashboardCards() {
    const behaviorTrendCard = document.getElementById('behavior-trend');
    const healthMetricsCard = document.getElementById('health-metrics');
    const deviceStatusCard = document.getElementById('device-status');
    const detailModal = document.getElementById('detail-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    
    // 行为趋势卡片点击
    if (behaviorTrendCard) {
        behaviorTrendCard.addEventListener('click', () => {
            if (modalTitle) {
                modalTitle.textContent = '行为趋势详情';
            }
            if (modalBody) {
                modalBody.innerHTML = `
                    <div style="height: 300px;">
                        <canvas id="detailBehaviorChart"></canvas>
                    </div>
                    <p style="margin-top: 1rem;">最近24小时行为活动记录：</p>
                    <ul style="list-style: none; padding: 0;">
                        <li>10:00 - 行走</li>
                        <li>10:30 - 站立</li>
                        <li>11:00 - 坐下</li>
                        <li>11:30 - 行走</li>
                        <li>12:00 - 坐下</li>
                        <li>12:30 - 躺下</li>
                        <li>13:00 - 行走</li>
                        <li>13:30 - 站立</li>
                        <li>14:00 - 坐下</li>
                        <li>14:30 - 行走</li>
                    </ul>
                `;
            }
            if (detailModal) {
                detailModal.classList.add('active');
            }
            
            // 延迟初始化图表，确保DOM已渲染
            setTimeout(() => {
                const ctx = document.getElementById('detailBehaviorChart');
                if (ctx) {
                    const ctx2d = ctx.getContext('2d');
                    new Chart(ctx2d, {
                        type: 'line',
                        data: {
                            labels: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'],
                            datasets: [{
                                label: '行为活动',
                                data: [2, 1, 3, 5, 4, 6, 3, 2],
                                borderColor: '#1a73e8',
                                backgroundColor: 'rgba(26, 115, 232, 0.1)',
                                tension: 0.4,
                                fill: true
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false
                        }
                    });
                }
            }, 100);
        });
    }
    
    // 健康指标卡片点击
    if (healthMetricsCard) {
        healthMetricsCard.addEventListener('click', () => {
            if (modalTitle) {
                modalTitle.textContent = '健康指标详情';
            }
            if (modalBody) {
                modalBody.innerHTML = `
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 1.5rem;">
                        <div style="background-color: #f8f9fa; padding: 1rem; border-radius: 8px;">
                            <h4 style="margin-bottom: 0.5rem; color: #1a73e8;">心率趋势</h4>
                            <div style="height: 150px;"><canvas id="heartRateChart"></canvas></div>
                        </div>
                        <div style="background-color: #f8f9fa; padding: 1rem; border-radius: 8px;">
                            <h4 style="margin-bottom: 0.5rem; color: #1a73e8;">血压趋势</h4>
                            <div style="height: 150px;"><canvas id="bloodPressureChart"></canvas></div>
                        </div>
                        <div style="background-color: #f8f9fa; padding: 1rem; border-radius: 8px;">
                            <h4 style="margin-bottom: 0.5rem; color: #1a73e8;">血氧趋势</h4>
                            <div style="height: 150px;"><canvas id="bloodOxygenChart"></canvas></div>
                        </div>
                        <div style="background-color: #f8f9fa; padding: 1rem; border-radius: 8px;">
                            <h4 style="margin-bottom: 0.5rem; color: #1a73e8;">体温趋势</h4>
                            <div style="height: 150px;"><canvas id="bodyTempChart"></canvas></div>
                        </div>
                    </div>
                    <p style="font-weight: 500;">健康状态评估：</p>
                    <p>所有指标均在正常范围内，健康状态良好。</p>
                `;
            }
            if (detailModal) {
                detailModal.classList.add('active');
            }
            
            // 延迟初始化图表
            setTimeout(() => {
                // 心率图表
                const heartRateCtx = document.getElementById('heartRateChart');
                if (heartRateCtx) {
                    const heartRateCtx2d = heartRateCtx.getContext('2d');
                    new Chart(heartRateCtx2d, {
                        type: 'line',
                        data: {
                            labels: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00'],
                            datasets: [{
                                label: '心率',
                                data: [72, 75, 78, 74, 76, 75],
                                borderColor: '#ea4335',
                                tension: 0.4,
                                fill: false
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                y: {
                                    min: 60,
                                    max: 90
                                }
                            }
                        }
                    });
                }
                
                // 血压图表
                const bloodPressureCtx = document.getElementById('bloodPressureChart');
                if (bloodPressureCtx) {
                    const bloodPressureCtx2d = bloodPressureCtx.getContext('2d');
                    new Chart(bloodPressureCtx2d, {
                        type: 'line',
                        data: {
                            labels: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00'],
                            datasets: [
                                {
                                    label: '收缩压',
                                    data: [120, 122, 118, 121, 119, 120],
                                    borderColor: '#1a73e8',
                                    tension: 0.4,
                                    fill: false
                                },
                                {
                                    label: '舒张压',
                                    data: [80, 81, 79, 80, 78, 80],
                                    borderColor: '#34a853',
                                    tension: 0.4,
                                    fill: false
                                }
                            ]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                y: {
                                    min: 60,
                                    max: 140
                                }
                            }
                        }
                    });
                }
                
                // 血氧图表
                const bloodOxygenCtx = document.getElementById('bloodOxygenChart');
                if (bloodOxygenCtx) {
                    const bloodOxygenCtx2d = bloodOxygenCtx.getContext('2d');
                    new Chart(bloodOxygenCtx2d, {
                        type: 'line',
                        data: {
                            labels: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00'],
                            datasets: [{
                                label: '血氧',
                                data: [98, 99, 98, 97, 98, 99],
                                borderColor: '#34a853',
                                tension: 0.4,
                                fill: false
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                y: {
                                    min: 90,
                                    max: 100
                                }
                            }
                        }
                    });
                }
                
                // 体温图表
                const bodyTempCtx = document.getElementById('bodyTempChart');
                if (bodyTempCtx) {
                    const bodyTempCtx2d = bodyTempCtx.getContext('2d');
                    new Chart(bodyTempCtx2d, {
                        type: 'line',
                        data: {
                            labels: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00'],
                            datasets: [{
                                label: '体温',
                                data: [36.5, 36.6, 36.7, 36.6, 36.5, 36.6],
                                borderColor: '#fbbc05',
                                tension: 0.4,
                                fill: false
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                y: {
                                    min: 36,
                                    max: 37
                                }
                            }
                        }
                    });
                }
            }, 100);
        });
    }
    
    // 设备状态卡片点击
    if (deviceStatusCard) {
        deviceStatusCard.addEventListener('click', () => {
            if (modalTitle) {
                modalTitle.textContent = '设备状态详情';
            }
            if (modalBody) {
                modalBody.innerHTML = `
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <div style="background-color: #f8f9fa; padding: 1rem; border-radius: 8px;">
                            <h4 style="margin-bottom: 0.5rem; color: #1a73e8;">设备信息</h4>
                            <p><strong>设备ID：</strong>DEV-20260115-001</p>
                            <p><strong>设备类型：</strong>智能健康监测手表</p>
                            <p><strong>固件版本：</strong>v1.2.3</p>
                            <p><strong>上次同步：</strong>${new Date().toLocaleString('zh-CN')}</p>
                        </div>
                        <div style="background-color: #f8f9fa; padding: 1rem; border-radius: 8px;">
                            <h4 style="margin-bottom: 0.5rem; color: #1a73e8;">设备日志</h4>
                            <ul style="list-style: none; padding: 0;">
                                <li>14:30: 设备在线</li>
                                <li>14:15: 数据同步成功</li>
                                <li>14:00: 设备充电中</li>
                                <li>13:30: 定位更新</li>
                                <li>13:00: 固件检查</li>
                            </ul>
                        </div>
                        <div style="background-color: #f8f9fa; padding: 1rem; border-radius: 8px;">
                            <h4 style="margin-bottom: 0.5rem; color: #1a73e8;">网络状态</h4>
                            <p><strong>网络类型：</strong>4G</p>
                            <p><strong>信号强度：</strong>良好</p>
                            <p><strong>数据流量：</strong>1.2MB/天</p>
                        </div>
                    </div>
                `;
            }
            if (detailModal) {
                detailModal.classList.add('active');
            }
        });
    }
}

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', init);

// 页面卸载时清除定时器
window.addEventListener('unload', () => {
    if (updateInterval) {
        clearInterval(updateInterval);
    }
});

// 初始化2D行为模型
function initBehaviorModel() {
    const canvas = document.getElementById('behaviorModel');
    if (canvas) {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        drawBehaviorModel('站立');
    }
}

// 绘制2D行为模型
function drawBehaviorModel(behavior) {
    const canvas = document.getElementById('behaviorModel');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const scale = 0.8;
    
    // 应用旋转
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(modelRotation * Math.PI / 180);
    ctx.translate(-centerX, -centerY);
    
    // 绘制不同行为的模型
    switch(behavior) {
        case '行走':
            drawWalkingModel(ctx, centerX, centerY, scale);
            break;
        case '站立':
            drawStandingModel(ctx, centerX, centerY, scale);
            break;
        case '坐下':
            drawSittingModel(ctx, centerX, centerY, scale);
            break;
        case '躺下':
            drawLyingModel(ctx, centerX, centerY, scale);
            break;
        case '静止':
        default:
            drawStandingModel(ctx, centerX, centerY, scale);
            break;
    }
    
    ctx.restore();
}

// 绘制站立模型
function drawStandingModel(ctx, x, y, scale) {
    // 头部
    ctx.beginPath();
    ctx.arc(x, y - 60 * scale, 15 * scale, 0, 2 * Math.PI);
    ctx.fillStyle = '#3498db';
    ctx.fill();
    ctx.strokeStyle = '#2980b9';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // 身体
    ctx.beginPath();
    ctx.moveTo(x, y - 45 * scale);
    ctx.lineTo(x, y + 20 * scale);
    ctx.strokeStyle = '#3498db';
    ctx.lineWidth = 4;
    ctx.stroke();
    
    // 手臂
    ctx.beginPath();
    ctx.moveTo(x, y - 35 * scale);
    ctx.lineTo(x - 25 * scale, y - 10 * scale);
    ctx.moveTo(x, y - 35 * scale);
    ctx.lineTo(x + 25 * scale, y - 10 * scale);
    ctx.strokeStyle = '#3498db';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // 腿部
    ctx.beginPath();
    ctx.moveTo(x, y + 20 * scale);
    ctx.lineTo(x - 15 * scale, y + 60 * scale);
    ctx.moveTo(x, y + 20 * scale);
    ctx.lineTo(x + 15 * scale, y + 60 * scale);
    ctx.strokeStyle = '#3498db';
    ctx.lineWidth = 4;
    ctx.stroke();
    
    // 标注
    ctx.font = '14px Arial';
    ctx.fillStyle = '#333';
    ctx.textAlign = 'center';
    ctx.fillText('站立', x, y + 80 * scale);
}

// 绘制行走模型
function drawWalkingModel(ctx, x, y, scale) {
    // 头部
    ctx.beginPath();
    ctx.arc(x, y - 60 * scale, 15 * scale, 0, 2 * Math.PI);
    ctx.fillStyle = '#3498db';
    ctx.fill();
    ctx.strokeStyle = '#2980b9';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // 身体（稍微倾斜）
    ctx.beginPath();
    ctx.moveTo(x, y - 45 * scale);
    ctx.lineTo(x + 5 * scale, y + 20 * scale);
    ctx.strokeStyle = '#3498db';
    ctx.lineWidth = 4;
    ctx.stroke();
    
    // 手臂（摆动）
    ctx.beginPath();
    ctx.moveTo(x, y - 35 * scale);
    ctx.lineTo(x - 30 * scale, y - 20 * scale);
    ctx.moveTo(x, y - 35 * scale);
    ctx.lineTo(x + 20 * scale, y - 5 * scale);
    ctx.strokeStyle = '#3498db';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // 腿部（行走姿势）
    ctx.beginPath();
    ctx.moveTo(x + 5 * scale, y + 20 * scale);
    ctx.lineTo(x - 20 * scale, y + 50 * scale);
    ctx.moveTo(x + 5 * scale, y + 20 * scale);
    ctx.lineTo(x + 25 * scale, y + 60 * scale);
    ctx.strokeStyle = '#3498db';
    ctx.lineWidth = 4;
    ctx.stroke();
    
    // 标注
    ctx.font = '14px Arial';
    ctx.fillStyle = '#333';
    ctx.textAlign = 'center';
    ctx.fillText('行走', x, y + 80 * scale);
}

// 绘制坐下模型
function drawSittingModel(ctx, x, y, scale) {
    // 头部
    ctx.beginPath();
    ctx.arc(x, y - 40 * scale, 15 * scale, 0, 2 * Math.PI);
    ctx.fillStyle = '#3498db';
    ctx.fill();
    ctx.strokeStyle = '#2980b9';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // 身体
    ctx.beginPath();
    ctx.moveTo(x, y - 25 * scale);
    ctx.lineTo(x, y + 10 * scale);
    ctx.strokeStyle = '#3498db';
    ctx.lineWidth = 4;
    ctx.stroke();
    
    // 手臂
    ctx.beginPath();
    ctx.moveTo(x, y - 15 * scale);
    ctx.lineTo(x - 25 * scale, y - 5 * scale);
    ctx.moveTo(x, y - 15 * scale);
    ctx.lineTo(x + 25 * scale, y - 5 * scale);
    ctx.strokeStyle = '#3498db';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // 腿部
    ctx.beginPath();
    ctx.moveTo(x, y + 10 * scale);
    ctx.lineTo(x - 20 * scale, y + 40 * scale);
    ctx.moveTo(x, y + 10 * scale);
    ctx.lineTo(x + 20 * scale, y + 40 * scale);
    ctx.strokeStyle = '#3498db';
    ctx.lineWidth = 4;
    ctx.stroke();
    
    // 椅子
    ctx.beginPath();
    ctx.moveTo(x - 30 * scale, y + 10 * scale);
    ctx.lineTo(x + 30 * scale, y + 10 * scale);
    ctx.lineTo(x + 30 * scale, y + 45 * scale);
    ctx.lineTo(x - 30 * scale, y + 45 * scale);
    ctx.closePath();
    ctx.strokeStyle = '#7f8c8d';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // 标注
    ctx.font = '14px Arial';
    ctx.fillStyle = '#333';
    ctx.textAlign = 'center';
    ctx.fillText('坐下', x, y + 60 * scale);
}

// 绘制躺下模型
function drawLyingModel(ctx, x, y, scale) {
    // 头部
    ctx.beginPath();
    ctx.arc(x - 40 * scale, y, 15 * scale, 0, 2 * Math.PI);
    ctx.fillStyle = '#3498db';
    ctx.fill();
    ctx.strokeStyle = '#2980b9';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // 身体
    ctx.beginPath();
    ctx.moveTo(x - 25 * scale, y);
    ctx.lineTo(x + 30 * scale, y);
    ctx.strokeStyle = '#3498db';
    ctx.lineWidth = 4;
    ctx.stroke();
    
    // 手臂
    ctx.beginPath();
    ctx.moveTo(x - 15 * scale, y);
    ctx.lineTo(x - 25 * scale, y - 15 * scale);
    ctx.moveTo(x + 10 * scale, y);
    ctx.lineTo(x + 20 * scale, y - 15 * scale);
    ctx.strokeStyle = '#3498db';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // 腿部
    ctx.beginPath();
    ctx.moveTo(x + 30 * scale, y);
    ctx.lineTo(x + 45 * scale, y - 10 * scale);
    ctx.moveTo(x + 30 * scale, y);
    ctx.lineTo(x + 45 * scale, y + 10 * scale);
    ctx.strokeStyle = '#3498db';
    ctx.lineWidth = 4;
    ctx.stroke();
    
    // 床
    ctx.beginPath();
    ctx.moveTo(x - 50 * scale, y - 20 * scale);
    ctx.lineTo(x + 50 * scale, y - 20 * scale);
    ctx.lineTo(x + 50 * scale, y + 20 * scale);
    ctx.lineTo(x - 50 * scale, y + 20 * scale);
    ctx.closePath();
    ctx.strokeStyle = '#7f8c8d';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // 标注
    ctx.font = '14px Arial';
    ctx.fillStyle = '#333';
    ctx.textAlign = 'center';
    ctx.fillText('躺下', x, y + 40 * scale);
}

// 旋转模型
function rotateModel() {
    if (!isRotating) {
        isRotating = true;
        const rotationInterval = setInterval(() => {
            modelRotation += 2;
            if (modelRotation >= 360) {
                modelRotation = 0;
                clearInterval(rotationInterval);
                isRotating = false;
            }
            drawBehaviorModel(document.getElementById('current-behavior').textContent || '站立');
        }, 50);
    }
}

// 重置模型视角
function resetModel() {
    modelRotation = 0;
    drawBehaviorModel(document.getElementById('current-behavior').textContent || '站立');
}

// 更新模型以匹配当前行为
function updateBehaviorModel(behavior) {
    drawBehaviorModel(behavior);
}