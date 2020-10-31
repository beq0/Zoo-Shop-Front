<script>
    import {HistoryService} from "../services/history.service";
    import { onMount } from 'svelte';
    
    const historyService = HistoryService.getInstance();

    let filterName='', filterType='', filterStartDate=null, filterEndDate=null;

    onMount(async () => {
    })

    async function filterData() {
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


    .vertical-line {
        border-left: 12px solid #4adfff;
        border-radius: 20px;
        height: 620px;
        margin-top: 30px;
    }
    
    .results {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 500px;   
        width: 700px;  
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

    .result-losing {
        color: #ff2e2e;
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
                    <button type="button" class="btn btn-primary">ძებნა</button>
                
                <!-- svelte-ignore a11y-missing-attribute -->
                    <button type="button" class="btn btn-primary">ფილტრის გასუფთავება</button>
            </div>
        </div>
    </div>
    
    
    <div class="vertical-line"></div>

    
    <div class="results">
        <div class="result-pair">
            <div class="result-header">
                გაყიდული პროდუქტების რაოდენობა:
            </div>
            <div class="result-result result-count">
                <div>4091</div>
                <div style="width:20px;"></div>
                <button type="button" class="btn btn-primary btn-details">დეტალურად ნახვა</button>
            </div>
        </div>
        
        <div class="result-pair">
            <div class="result-header">
                გაყიდვის ფასი:
            </div>
            <div class="result-result result-winning">
                5421
            </div>
        </div>
        
        <div class="result-pair">
            <div class="result-header">
                ყიდვის ფასი:
            </div>
            <div class="result-result result-losing">
                521
            </div>
        </div>

        <div class="result-pair">
            <div class="result-header">
                მოგება:
            </div>
            <div class="result-result result-winning">
                418
            </div>
        </div>
        
    </div>
</div>
