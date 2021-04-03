<script>
    import {HistoryService} from "../services/history.service";
    import {ProductService} from "../services/product.service";
    import { onMount } from 'svelte';
    import DetailedProducts from "../components/DetailedProducts.svelte";
    import { AutoCompleteHelper } from "../utils/AutoCompleteHelper";
    
    const historyService = HistoryService.getInstance();
    const productService = ProductService.getInstance();
    const date = new Date();

    let filterName='', filterType='', filterStartDate=new Date(date.getFullYear(), 0, 1), filterEndDate=null;
    let productsSold = {}, yearlyBenefit = 0, monthlyBenefit = 0, dailyBenefit = 0, yearlySellingPrice = 0, monthlySellingPrice = 0, dailySellingPrice = 0;
    let showDetailedProducts = false, detailedAmounts = {};

    let allProducts = [], allProductNames = [];
    
    onMount(async () => {
        allProducts = await productService.getProducts();
        allProductNames = allProducts.map(prod => prod.name);

        addEventListener("keyup", (event) => {
            if (event.key === 'Enter') {
                filterData();
            }
        });
        filterData();

        setTimeout(() => {
            AutoCompleteHelper.autocomplete(document.getElementById("product-name-filter"), allProductNames, (v) => filterName = v);
        }, 700);
    })

    async function filterData() {
        productsSold = {}, yearlyBenefit = 0, monthlyBenefit = 0, dailyBenefit = 0, yearlySellingPrice = 0, monthlySellingPrice = 0, dailySellingPrice = 0, detailedAmounts = {};
        let filters = {
            productName: filterName,
            productType: filterType,
            sellDateFrom: filterStartDate,
            sellDateTo: filterEndDate
        }
        let allHistories = await historyService.findHistories(filters, 0, 0, 0);
        allHistories.forEach(history => {
            history.sellDate = new Date(history.sellDate);
            if (!(history.productName in productsSold)) {
                productsSold[history.productName] = {
                    amount: 0,
                    yearlyBenefit: 0,
                    yearlySellingPrice: 0,
                    monthlyBenefit: 0,
                    monthlySellingPrice: 0,
                    dailyBenefit: 0,
                    dailySellingPrice: 0
                };
            }
            const currAmount = history.amount;
            const currBenefit = history.benefit;
            const currWholeSellingPrice = history.sellingPrice * currAmount;
            productsSold[history.productName].amount += currAmount;
            productsSold[history.productName].yearlyBenefit += currBenefit;
            productsSold[history.productName].yearlySellingPrice += currWholeSellingPrice;
            if (date.getFullYear() === history.sellDate.getFullYear() && date.getMonth() === history.sellDate.getMonth()) {
                productsSold[history.productName].monthlyBenefit += currBenefit;
                productsSold[history.productName].monthlySellingPrice += currWholeSellingPrice;
            }
            if (new Date().toDateString() == history.sellDate.toDateString()) { 
                productsSold[history.productName].dailyBenefit += currBenefit;
                productsSold[history.productName].dailySellingPrice += currWholeSellingPrice;
            }
        })
        for (const [key, value] of Object.entries(productsSold)) {
            yearlyBenefit += value.yearlyBenefit;
            yearlySellingPrice += value.yearlySellingPrice;
            monthlyBenefit += value.monthlyBenefit;
            monthlySellingPrice += value.monthlySellingPrice;
            dailyBenefit += value.dailyBenefit;
            dailySellingPrice += value.dailySellingPrice;
            if (!(key in detailedAmounts)) detailedAmounts[key] = 0;
            detailedAmounts[key] += value.amount;
        }
    }

    function clearFilters() {
        filterName='', filterType='', filterStartDate=null, filterEndDate=null;
    }

    function getPercentage(num, from) {
        let res = ((100 * num) / from).toFixed(2);
        return isNaN(res) ? 0.00 : res;
    }

</script>

<style>

    .all-parts {
        display: flex;
        flex-direction: left;
        justify-content: space-around;
    }
    
    .toolbar {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 500px;
        margin-top: 70px;
    }

    .filter-header {
        text-align: center;
        font-weight: bold;
        font-size: 19px;
    }

    .filter-pair {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 90px;
    }

    .toolbar-item {
        width: 400px;
    }

    .form-control {
        height: 55px;
        font-size: 20px;
    }

    .filter-buttons {
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
    }

    .btn {
        font-size: 17px;
        height: 42px;
    }

    .btn-primary {
        background-color: #3cb5cf;
        border-color: #3cb5cf;
    }

    .divider-lines {
        display: flex;
        flex-direction: row;
        width: 15px;
        justify-content: space-around;
    }

    .vertical-line {
        border-left: 4px solid white;
        border-radius: 20px;
        height: 620px;
        margin-top: 30px;
    }
    
    .results {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 550px;   
        margin-top: 50px;   
    }

    .result-info {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .result-info-header {
        font-size: 20px;
        font-style: italic;
        font-family: inherit;
        font-weight: bold;
    }

    .result-info-pairs {
        display: flex;
        flex-direction: row;
        width: 250px;
        justify-content: space-between;
    }

    .result-pair {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 70px;
        text-align: center;
    }
    
    .result-header {
        font-size: 20px;
        font-style: italic;
        font-family: inherit;
    }

    .result-result {
        font-size: 21px;
        font-weight: bold;
        font-family: inherit;
    }

    .result-count {
        display: flex;
        flex-direction: row;
        justify-content: center;
    }

    .btn-details {
        font-size: 14px;
        height: 35px;
        background-color:#006c84;
        border-color:#006c84;
    }

    .result-winning {
        color: #00c400;
    }

</style>

<div class="all-parts">
    <div>
        <div class="toolbar">
            <div class="toolbar-item">
                <div class="filter-pair autocomplete">
                    <div class="filter-header">სახელი:&emsp;</div>
                    <input id="product-name-filter" type="text" class="form-control" bind:value={filterName}>
                </div>
            </div>
        
            <div class="toolbar-item">
                <div class="filter-pair">
                    <div class="filter-header">ტიპი:&emsp;</div>
                    <input type="text" class="form-control" bind:value={filterType}>
                </div>
            </div>
        
            <div class="toolbar-item">
                <div class="filter-pair">
                    <div class="filter-header">საწყისი&nbsp;თარიღი:&emsp;</div>
                    <input type="date" class="form-control date-filters" bind:value={filterStartDate}>
                </div>
            </div>
        
            <div class="toolbar-item">
                <div class="filter-pair">
                    <div class="filter-header">საბოლოო&nbsp;თარიღი:&emsp;</div>
                    <input type="date" class="form-control date-filters" bind:value={filterEndDate}>
                </div>
            </div>
        
            <div class="filter-buttons">
                <!-- svelte-ignore a11y-missing-attribute -->
                    <button type="button" class="btn btn-primary" on:click={filterData}>ძებნა</button>
                
                <!-- svelte-ignore a11y-missing-attribute -->
                    <button type="button" class="btn btn-primary" on:click={clearFilters}>ფილტრის გასუფთავება</button>
            </div>
        </div>
    </div>
    
    
    <div class="divider-lines">
        <div class="vertical-line"></div>
        <div class="vertical-line"></div>
    </div>

    
    <div class="results">
        <div class="result-pair">
            <div class="result-header">
                გაყიდული პროდუქციის რაოდენობა:
            </div>
            <div class="result-result result-count">
                <div>{Object.keys(productsSold).length}</div>
                <div style="width:20px;"></div>
                <button type="button" class="btn btn-primary btn-details" on:click={() => {showDetailedProducts = true}}>დეტალურად</button>
            </div>
        </div>
        
        <div class="result-info">
            <div class="result-info-header">
                წლიური <span style="color: #a5a5a5;">({getPercentage(yearlyBenefit, yearlySellingPrice)} %)</span>
            </div>  
            
            <div class="result-info-pairs">
                <div class="result-pair">
                    <div class="result-header">
                        მოგება
                    </div>
                    <div class="result-result result-winning">
                        {yearlyBenefit.toFixed(2)} ₾
                    </div>
                </div>
        
                <div class="result-pair">
                    <div class="result-header">
                        ნავაჭრი
                    </div>
                    <div class="result-result">
                        {yearlySellingPrice.toFixed(2)} ₾
                    </div>
                </div>
            </div>
        </div>
        
        <div class="result-info">
            <div class="result-info-header">
                თვიური <span style="color: #a5a5a5;">({getPercentage(monthlyBenefit, monthlySellingPrice)} %)</span>
            </div>  
            
            <div class="result-info-pairs">
                <div class="result-pair">
                    <div class="result-header">
                        მოგება
                    </div>
                    <div class="result-result result-winning">
                        {monthlyBenefit.toFixed(2)} ₾
                    </div>
                </div>

                <div class="result-pair">
                    <div class="result-header">
                        ნავაჭრი
                    </div>
                    <div class="result-result">
                        {monthlySellingPrice.toFixed(2)} ₾
                    </div>
                </div>
            </div>
        </div>

        <div class="result-info">
            <div class="result-info-header">
                დღიური <span style="color: #a5a5a5;">({getPercentage(dailyBenefit, dailySellingPrice)} %)</span>
            </div>  
            
            <div class="result-info-pairs">
                <div class="result-pair">
                    <div class="result-header">
                        მოგება
                    </div>
                    <div class="result-result result-winning">
                        {dailyBenefit.toFixed(2)} ₾
                    </div>
                </div>

                <div class="result-pair">
                    <div class="result-header">
                        ნავაჭრი
                    </div>
                    <div class="result-result">
                        {dailySellingPrice.toFixed(2)} ₾
                    </div>
                </div>
            </div>
        </div>

    </div>
</div>


<DetailedProducts
bind:show={showDetailedProducts}
bind:products={detailedAmounts}
/>