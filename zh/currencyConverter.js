document.addEventListener('DOMContentLoaded', function () {
    const fromCurrencySelect = document.getElementById('fromCurrency');
    const toCurrencySelect = document.getElementById('toCurrency');
    const amountInput = document.getElementById('amount');
    const convertBtn = document.getElementById('convertBtn');
    const resultDiv = document.getElementById('result');

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

    // 初始化货币下拉菜单
    function initCurrencySelects() {
        commonCurrencies.forEach(currency => {
            const option1 = document.createElement('option');
            option1.value = currency.code;
            option1.textContent = `${currency.name} (${currency.code})`;
            fromCurrencySelect.appendChild(option1);

            const option2 = option1.cloneNode(true);
            toCurrencySelect.appendChild(option2);
        });
    }

    // 获取汇率数据并更新结果
    function fetchRates() {
        const fromCurrency = fromCurrencySelect.value;
        const toCurrency = toCurrencySelect.value;

        fetch(`getRates.php?from=${fromCurrency}&to=${toCurrency}`)
            .then(response => response.json())
            .then(data => {
                if (data && data.rate) {
                    const amount = parseFloat(amountInput.value);
                    if (!isNaN(amount)) {
                        const converted = (amount * data.rate).toFixed(2);
                        resultDiv.textContent = `转换结果: ${converted}`;
                    } else {
                        resultDiv.textContent = '请输入有效金额';
                    }
                } else {
                    resultDiv.textContent = '无法获取汇率数据';
                }
            })
            .catch(error => {
                console.error('Error fetching rates:', error);
                resultDiv.textContent = '无法获取汇率数据';
            });
    }

    // 绑定事件
    convertBtn.addEventListener('click', fetchRates);

    // 初始化货币列表
    initCurrencySelects();
});
