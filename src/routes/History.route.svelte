<script>
    import {DeviceDetectorService} from "../services/deviceDetector.service";
    import { navigate } from "svelte-routing";
    import {HistoryService} from "../services/history.service";
    import {ProductService} from "../services/product.service";
    import { onMount } from 'svelte';
    
    export let showToolbar;

    const DEFAULT_PAGINATION_LIMIT = 5;
    const PAGES_BEFORE_AND_AFTER = 4;
    
    const historyService = HistoryService.getInstance();
    const productService = ProductService.getInstance();


    let filterName='', filterType='', filterStartDate=null, filterEndDate=null;
    let columnNames = ['სახელი', 'ტიპი', 'თარიღი', 'რაოდენობა', 'გაყიდვის ფასი', 'ყიდვის ფასი', 'მოგება'];
    let historyCount, numOfPages;
    let marked;

    if(DeviceDetectorService.isBrowser) {
        let url = new URL(window.location.href);
        marked = parseInt(url.searchParams.get('page')) || 1;
    }

    let allProducts = [], productsMap = {};
    let histories = [], allHistories = [];
    
    onMount(async () => {
        allProducts = await productService.getProducts();
        allProducts.forEach(product => {
            productsMap[product._id] = product;
        });

        historyCount = await historyService.getCount();
        numOfPages = Math.ceil(historyCount/DEFAULT_PAGINATION_LIMIT);
    })

    async function filterHistory() {
        console.log(filterName, filterType, filterStartDate, filterEndDate);
        let filters = {
            productName: filterName,
            sellDateFrom: filterStartDate,
            sellDateTo: filterEndDate
        }
        allHistories = await historyService.findHistories(filters);
        allHistories.forEach(h => {
            h.sellDate = new Date(h.sellDate);
        });
        histories = allHistories;
        console.log(histories);
    }

    function clearFilters() {
        filterName='', filterType='', filterStartDate=null, filterEndDate=null;
    }

    function pageChanged(i) {
        marked = i;
    }

    async function update() {
        allHistories = await historyService.findHistories({}, marked, DEFAULT_PAGINATION_LIMIT).catch(err => console.log(err));
        allHistories.forEach(h => {
            h.sellDate = new Date(h.sellDate);
        });
        histories = allHistories;
    };

    $: {
        if(DeviceDetectorService.isBrowser) {
            let url = new URL(window.location.href);
            url.searchParams.set('page', marked);
            navigate(url.toString());
        }
        marked;
        update();
    }
</script>

<style>
    td {
        border: 1px solid #fefefe;
        height: 50px;
    }

    th {
        text-align: center;
        height: 50px
    }

    .toolbar {
        margin: 10px 0;
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }

    .toolbar-item {
        margin: 0 10px;
        font-style: italic;
    }

    .date-filters {
        max-width: 250px;
    }

    .page-link {
        background-color: #f3f3f3;
        color: black;
    }

    .page-item.active .page-link {
        z-index: 1;
        color: #fff;
        background-color: #3cb5cf;
        border-color: transparent !important;
    }
</style>

{#if showToolbar}
<div class="toolbar" id="toolbar">
    <div class="form-group toolbar-item toolbar">
        <span>სახელი:&emsp;</span>
        <input type="text" class="form-control" bind:value={filterName}>
    </div>

    <div class="toolbar-item toolbar">
        <span>ტიპი:&emsp;</span>
        <input type="text" class="form-control" bind:value={filterType}>
    </div>

    <div class="toolbar-item toolbar">
        <span>საწყისი&nbsp;თარიღი:&emsp;</span>
        <input type="date" class="form-control date-filters" bind:value={filterStartDate}>
    </div>

    <div class="toolbar-item toolbar">
        <span>საბოლოო&nbsp;თარიღი:&emsp;</span>
        <input type="date" class="form-control date-filters" bind:value={filterEndDate}>
    </div>

    <!-- svelte-ignore a11y-missing-attribute -->
    <div>
        <input type="image" src="images/search.png" width="27px" height="27px" style="margin: 0 8px;"
            on:click={filterHistory}>
    </div>
    
    <!-- svelte-ignore a11y-missing-attribute -->
    <div>
        <input type="image" src="images/clearFilters.ico" width="27px" height="27px" style="margin: 0 8px;"
            on:click={clearFilters}>
    </div>
</div>
{/if}

<table class="table">
    <thead>
    <tr>
        {#each columnNames as column}
            <th scope="col" style="width: 14%;">{column}</th>
        {/each}
    </tr>
    </thead>
    <tbody>
        {#each histories as history, i}
        <tr>
            <td>{history.productName}</td>
            <td>{history.productType}</td>
            <td>{(history.sellDate.getMonth() + 1) + "/" + history.sellDate.getDate() + "/" +  history.sellDate.getFullYear()}</td>
            <td>{Number.isInteger(history.amount) ? history.amount : history.amount.toFixed(3)}</td>
            <td style="text-align: end;">{history.sellingPrice.toFixed(2)} ₾</td>
            <td style="text-align: end;">{history.originalPrice.toFixed(2)} ₾</td>
            <td style="text-align: end;">{history.benefit.toFixed(2)} ₾</td>
        </tr>
        {/each}
    </tbody>
</table>

<nav aria-label="...">
    <ul class="pagination justify-content-center">
        <li class="page-item">
            <button class="page-link" on:click={()=>{marked=1;}}>
                &lt;&lt;
            </button>
        </li>
        <li class="page-item">
            <button class="page-link" on:click={()=>{if(marked > 1) marked--;}}>
                უკან
            </button>
        </li>
        {#each (()=>{return new Array(numOfPages)})() as ignored, i}
            {#if marked - PAGES_BEFORE_AND_AFTER < i && i < marked + PAGES_BEFORE_AND_AFTER}
                {#if marked===i+1}
                    <li class="page-item active">
                        <button class="page-link" on:click={()=>{pageChanged(i+1)}}>
                            {i+1}
                        </button>
                    </li>
                {:else}
                    <li class="page-item">
                        <button class="page-link" on:click={()=>{pageChanged(i+1)}}>
                            {i+1}
                        </button>
                    </li>
                {/if}
            {/if}
        {/each}
        <li class="page-item">
            <button class="page-link" on:click={()=>{if(marked < numOfPages) marked++;}}>
                წინ
            </button>
        </li>
        <li class="page-item">
            <button class="page-link" on:click={()=>{marked=numOfPages;}}>
                &gt;&gt;
            </button>
        </li>
    </ul>
</nav>
