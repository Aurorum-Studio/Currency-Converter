document.addEventListener('DOMContentLoaded', function() {
    const fromCurrencySelect = document.getElementById('fromCurrency');
    const toCurrencySelect = document.getElementById('toCurrency');
    const amountInput = document.getElementById('amount');
    const convertBtn = document.getElementById('convertBtn');
    const resultDiv = document.getElementById('result');

    // 常用货币列表及其名称
    const commonCurrencies = [
        { code: 'USD', name: '美元' },
        { code: 'EUR', name: '欧元' },
        { code: 'GBP', name: '英镑' },
        { code: 'JPY', name: '日元' },
        { code: 'CNY', name: '人民币' },
        { code: 'CAD', name: '加拿大元' },
        { code: 'AUD', name: '澳大利亚元' },
        { code: 'CHF', name: '瑞士法郎' },
        { code: 'HKD', name: '港币' },
        { code: 'SGD', name: '新加坡元' },
        { code: 'SEK', name: '瑞典克朗' },
        { code: 'NZD', name: '新西兰元' }
    ];

    // 获取货币列表并填充下拉菜单
    function fetchRates() {
        fetch('../../getRates.php')
        .then(response => response.json())
        .then(data => {
            if (data.result === 'success') {
                updateCurrencyOptions(data.conversion_rates, fromCurrencySelect, toCurrencySelect, commonCurrencies);
            } else {
                resultDiv.textContent = '无法获取汇率数据';
            }
        })
        .catch(error => {
            console.error('Error fetching rates:', error);
            resultDiv.textContent = '无法获取汇率数据';
        });
    }

    // 更新货币下拉菜单选项
    function updateCurrencyOptions(rates, fromSelect, toSelect, commonCurrencies) {
        fromSelect.innerHTML = '';
        toSelect.innerHTML = '';   

        // 添加常用货币分割线
        const commonCurrenciesDivider = document.createElement('optgroup');
        commonCurrenciesDivider.label = '常用货币';
        fromSelect.appendChild(commonCurrenciesDivider);
        toSelect.appendChild(commonCurrenciesDivider.cloneNode(true));
        
        // 添加常用货币选项
        commonCurrencies.forEach(currency => {
            const option = document.createElement('option');
            option.value = currency.code;
            option.textContent = `${currency.name} (${currency.code})`;
            fromSelect.appendChild(option);
            toSelect.appendChild(option.cloneNode(true)); // 克隆选项到另一个选择框
        });

        // 添加所有货币选项
        let addedCommon = false;
        Object.keys(rates).forEach(key => {
            const rate = rates[key];
            // 跳过常用货币，只添加非常用货币
            if (!commonCurrencies.some(c => c.code === key)) {
                if (!addedCommon) {
                    // 添加“所有货币”分割线
                    const allCurrenciesDivider = document.createElement('optgroup');
                    allCurrenciesDivider.label = '所有货币';
                    fromSelect.appendChild(allCurrenciesDivider);
                    toSelect.appendChild(allCurrenciesDivider.cloneNode(true));
                    addedCommon = true;
                }
                const option = document.createElement('option');
                option.value = key;
                option.textContent = key;
                fromSelect.appendChild(option);
                toSelect.appendChild(option.cloneNode(true)); // 克隆选项到另一个选择框
            }
        });
    }

    // 货币转换逻辑
    function convertCurrency() {
        const amount = parseFloat(amountInput.value);
        const fromCurrency = fromCurrencySelect.value;
        const toCurrency = toCurrencySelect.value;

        fetch('getRates.php')
        .then(response => response.json())
        .then(data => {
            if (data.result === 'success') {
                const fromRate = data.conversion_rates[fromCurrency];
                const toRate = data.conversion_rates[toCurrency];
                if (fromRate !== undefined && toRate !== undefined) {
                    const result = (amount * toRate) / fromRate;
                    resultDiv.textContent = `转换结果: ${result.toFixed(2)}`;
                } else {
                    resultDiv.textContent = '货币代码不正确';
                }
            } else {
                resultDiv.textContent = '无法获取汇率数据';
            }
        })
        .catch(error => {
            console.error('Error converting currency:', error);
            resultDiv.textContent = '无法获取汇率数据';
        });
    }

    // 绑定转换按钮事件
    convertBtn.addEventListener('click', convertCurrency);

    // 初始化时获取货币列表
    fetchRates();
});
