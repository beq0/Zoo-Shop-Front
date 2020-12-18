<script>
    import {HistoryService} from "../services/history.service";
    import { onMount } from 'svelte';
    import DetailedProducts from "../components/DetailedProducts.svelte";
    
    const historyService = HistoryService.getInstance();
    const date = new Date();

    let filterName='', filterType='', filterStartDate=new Date(date.getFullYear(), 0, 1), filterEndDate=null;
    let productsSold = {}, yearlyBenefit = 0, monthlyBenefit = 0, dailyBenefit = 0;
    let showDetailedProducts = false, detailedAmounts = {};

    onMount(async () => {
        addEventListener("keyup", (event) => {
            if (event.key === 'Enter') {
                filterData();
            }
        });
        filterData();
    })

    async function filterData() {
        productsSold = {}, yearlyBenefit = 0, monthlyBenefit = 0, dailyBenefit = 0, detailedAmounts = {};
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
                    monthlyBenefit: 0,
                    dailyBenefit: 0
                };
            }
            productsSold[history.productName].amount += history.amount;
            productsSold[history.productName].yearlyBenefit += history.benefit;
            if (date.getFullYear() === history.sellDate.getFullYear() && date.getMonth() === history.sellDate.getMonth()) 
                productsSold[history.productName].monthlyBenefit += history.benefit;
            if (new Date().toDateString() == history.sellDate.toDateString()) 
                productsSold[history.productName].dailyBenefit += history.benefit;
        })
        for (const [key, value] of Object.entries(productsSold)) {
            yearlyBenefit += value.yearlyBenefit;
            monthlyBenefit += value.monthlyBenefit;
            dailyBenefit += value.dailyBenefit;
            if (!(key in detailedAmounts)) detailedAmounts[key] = 0;
            detailedAmounts[key] += value.amount;
        }
    }

    function clearFilters() {
        filterName='', filterType='', filterStartDate=null, filterEndDate=null;
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
        height: 500px;   
        margin-top: 50px;   
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
                <div class="filter-pair">
                    <div class="filter-header">სახელი:&emsp;</div>
                    <input type="text" class="form-control" bind:value={filterName}>
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
                გაყიდული პროდუქტების რაოდენობა:
            </div>
            <div class="result-result result-count">
                <div>{Object.keys(productsSold).length}</div>
                <div style="width:20px;"></div>
                <button type="button" class="btn btn-primary btn-details" on:click={() => {showDetailedProducts = true}}>დეტალურად ნახვა</button>
            </div>
        </div>
        
        <div class="result-pair">
            <div class="result-header">
                წლიური მოგება:
            </div>
            <div class="result-result result-winning">
                {yearlyBenefit.toFixed(2)} ₾
            </div>
        </div>
        
        <div class="result-pair">
            <div class="result-header">
                თვიური მოგება:
            </div>
            <div class="result-result result-winning">
                {monthlyBenefit.toFixed(2)} ₾
            </div>
        </div>

        <div class="result-pair">
            <div class="result-header">
                დღიური მოგება:
            </div>
            <div class="result-result result-winning">
                {dailyBenefit.toFixed(2)} ₾
            </div>
        </div>
        
    </div>
</div>


<DetailedProducts
bind:show={showDetailedProducts}
bind:products={detailedAmounts}
/>