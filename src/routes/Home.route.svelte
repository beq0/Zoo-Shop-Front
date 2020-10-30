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

    .toolbar {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 500px;
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

</style>


<div class="toolbar vertical-center">
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
