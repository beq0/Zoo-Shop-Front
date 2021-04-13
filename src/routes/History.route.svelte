<script>
    import {DeviceDetectorService} from "../services/deviceDetector.service";
    import { navigate } from "svelte-routing";
    import {HistoryService} from "../services/history.service";
    import {ProductService} from "../services/product.service";
    import { onMount } from 'svelte';
    import { DateFormats } from "../utils/DateFormats";
    import HistoryReport from "../components/reports/HistoryReport.svelte";
    import DeleteModal from "../components/DeleteModal.svelte";
    import {ObjectHelper} from "../utils/ObjectHelper"
    import {AutoCompleteHelper} from "../utils/AutoCompleteHelper"

    export let show = {};
    
    const QuantityType = {
        COUNT: "ცალობითი",
        WEIGHT: "წონითი"
    }

    const DEFAULT_PAGINATION_LIMIT = 5;
    const PAGES_BEFORE_AND_AFTER = 4;
    const HOUR_IN_MILISECONDS = 36e+5;
    
    const today = new Date();
    let historyService = HistoryService.getInstance();
    let productService = ProductService.getInstance();

    let deleteModalShow = false, deleteModalSubmited = false, toDeleteId = null;
    let toolbarShown = false, filterCode = '', filterName='', filterType='', filterStartDate=null, filterEndDate=null;
    let columnNames = ['კოდი', 'სახელი', 'ტიპი', 'თარიღი', 'ანგარიშსწორება', 'რაოდენობა', 'ჯამ. გასა. ფასი', 'გასაყიდი ფასი', 
        'ასაღები ფასი', 'მოგება'];
    let marked = DateFormats.formatDate(today);
    let pages = [DateFormats.formatDate(new Date(today.getTime() - 48 * HOUR_IN_MILISECONDS)), DateFormats.formatDate(new Date(today.getTime() - 24 * HOUR_IN_MILISECONDS)), DateFormats.formatDate(today)];

    let histories = [], allHistories = [];

    let allProducts = [], allProductCodes = [], allProductNames = [];
    onMount(async () => {
        allProducts = await productService.getProducts();
        allProductCodes = allProducts.map(prod => prod.code);
        allProductNames = allProducts.map(prod => prod.name);

        if(DeviceDetectorService.isBrowser) {
        let url = new URL(window.location.href);
        marked = url.searchParams.get('date') || DateFormats.formatDate(today);
        filterCode = url.searchParams.get('code') || '';
        filterName = url.searchParams.get('name') || '';
        filterType = url.searchParams.get('type') || '';
        filterStartDate = url.searchParams.get('start') || null;
        filterEndDate = url.searchParams.get('end') || null;
        show.showToolbar = filterType || filterName || filterCode;
    }
    })

    async function filterHistory() {
        if(!DeviceDetectorService.isBrowser) return;
        marked = DateFormats.formatDate(today);
        let url = new URL(window.location.href);
        url.searchParams.set('code', filterCode || '');
        url.searchParams.set('name', filterName || '');
        url.searchParams.set('type', filterType || '');
        url.searchParams.set('start', filterStartDate || '');
        url.searchParams.set('end', filterEndDate || '');
        navigate(url.toString());
        getFilteredData(true);
    }

    async function getFilteredData(state) {
        if(!DeviceDetectorService.isBrowser) return;
        let filters = {
            productCode: filterCode,
            productName: filterName,
            productType: filterType,
            sellDateFrom: (state ? filterStartDate : DateFormats.toDate(marked)),
            sellDateTo: (state ? filterEndDate : new Date(DateFormats.toDate(marked).getTime() + 24 * HOUR_IN_MILISECONDS))
        }
        allHistories = await historyService.findHistories(filters, 0, 0, 0);
        allHistories.forEach(h => {
            h.sellDate = new Date(h.sellDate);
        });
        histories = allHistories;
        histories = histories.sort(function(a,b){
            return new Date(b.createDate) - new Date(a.createDate);
        });
    }

    function clearFilters() {
        filterCode = '', filterName='', filterType='', filterStartDate=null, filterEndDate=null;
    }

    function onBack() {
        marked = pages[1];
    }

    function onNext() {
        if(marked != DateFormats.formatDate(today)) marked = pages[3];
    }

    function onDelete(historyId) {
        toDeleteId = historyId;
        deleteModalShow = true;
    }

    $: {
        if(DeviceDetectorService.isBrowser) {
            let url = new URL(window.location.href);
            url.searchParams.set('date', marked);
            navigate(url.toString());
        }
        let tmp = DateFormats.toDate(marked);
        pages = [DateFormats.formatDate(new Date(tmp.getTime() - 48 * HOUR_IN_MILISECONDS)), 
                DateFormats.formatDate(new Date(tmp.getTime() - 24 * HOUR_IN_MILISECONDS)), 
                DateFormats.formatDate(tmp)];
        if(new Date(tmp.getTime() + 24 * HOUR_IN_MILISECONDS) <= today) pages.push(DateFormats.formatDate(new Date(tmp.getTime() + 24 * HOUR_IN_MILISECONDS)));
        if(new Date(tmp.getTime() + 48 * HOUR_IN_MILISECONDS) <= today) pages.push(DateFormats.formatDate(new Date(tmp.getTime() + 48 * HOUR_IN_MILISECONDS)));
        getFilteredData(false);

        if (deleteModalSubmited) {
            deleteModalIsSubmited();
        }
    }

    $: {
        if (show.showToolbar) {
            if (!toolbarShown) {
                setTimeout(() => {
                    AutoCompleteHelper.autocomplete(document.getElementById("product-code-filter"), allProductCodes, (v) => {
                        filterCode = v;
                        filterHistory();
                    });
                    AutoCompleteHelper.autocomplete(document.getElementById("product-name-filter"), allProductNames, (v) => {
                        filterName = v;
                        filterHistory();
                    });
                }, 150);
            }
            toolbarShown = show.showToolbar;
        } else {
            toolbarShown = false;
        }
    }

    function deleteModalIsSubmited() {
        marked = marked;
        deleteModalSubmited = false;
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

    .actionsTh {
        width: 1%;
        padding: 2px;
        padding-right: 5px;
        text-align: end;
    }

    .actionButtonsDiv {
        display: flex;
        justify-content: flex-end;
    }

    .sum-tr {
        background-color: lightsteelblue;
    }

    .sum-td {
        font-weight: bold;
    }

    .sum-empty-td {
        border: none;
    }

    .financial-td {
        text-align: end;
    }

</style>

{#if show.showToolbar}
<!-- svelte-ignore a11y-missing-attribute -->
<iframe name="decoy_iframe" style="display:none;"></iframe>
<form autocomplete="off" class="toolbar" id="toolbar" action="#" target="decoy_iframe" on:submit={filterHistory}>
    <div class="form-group toolbar-item toolbar autocomplete">
        <span>კოდი:&emsp;</span>
        <input id="product-code-filter" type="text" class="form-control" bind:value={filterCode}>
    </div>

    <div class="form-group toolbar-item toolbar autocomplete">
        <span>სახელი:&emsp;</span>
        <input id="product-name-filter" type="text" class="form-control" bind:value={filterName}>
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

    <input type="submit" style="height: 0px; width: 0px; border: none; padding: 0px;" hidefocus="true" />
    
    <!-- svelte-ignore a11y-missing-attribute -->
    <div title="ძებნა">
        <img src="images/search.png" width="27px" height="27px" style="margin: 0 8px; cursor: pointer;"
            on:click={filterHistory}>
    </div>
    
    <!-- svelte-ignore a11y-missing-attribute -->
    <div title="ფილტრის გასუფთავება">
        <img src="images/clearFilters.ico" width="27px" height="27px" style="margin: 0 8px; cursor: pointer;"
            on:click={clearFilters}>
    </div>
</form>
{/if}

<table class="table">
    <thead>
    <tr>
        {#each columnNames as column}
            <th scope="col" style="width: 14%;">{column}</th>
        {/each}
        <th class="actionsTh" scope="col"></th>
    </tr>
    </thead>
    <tbody>
        <tr class="sum-tr">
            <td class="sum-empty-td sum-td">ჯამური:</td>
            <td class="sum-empty-td sum-td"></td>
            <td class="sum-empty-td sum-td"></td>
            <td class="sum-empty-td sum-td"></td>
            <td class="sum-empty-td sum-td"></td>
            <td class="financial-td sum-td">{
                histories.reduce((sum, hist) => { return (ObjectHelper.isNullOrUndefined(hist.quantityType) || hist.quantityType == QuantityType.COUNT) ? sum + hist.amount : sum }, 0) + " ც; " +
                histories.reduce((sum, hist) => { return (ObjectHelper.isNotNullOrUndefined(hist.quantityType) && hist.quantityType == QuantityType.WEIGHT) ? sum + hist.amount : sum }, 0).toFixed(3) + " კგ."
            }
            </td>
            <td class="financial-td sum-td">{histories.reduce((sum, hist) => { return sum + hist.sellingPrice * hist.amount }, 0).toFixed(2)} ₾</td>
            <td class="financial-td sum-td">{histories.reduce((sum, hist) => { return sum + hist.sellingPrice }, 0).toFixed(2)} ₾</td>
            <td class="financial-td sum-td">{histories.reduce((sum, hist) => { return sum + hist.originalPrice }, 0).toFixed(2)} ₾</td>
            <td class="financial-td sum-td">{histories.reduce((sum, hist) => { return sum + hist.benefit }, 0).toFixed(2)} ₾</td>
            <td class="sum-empty-td sum-td"></td>
        </tr>
        {#each histories as history, i}
        <tr>
            <td>{history.productCode}</td>
            <td>{history.productName}</td>
            <td>{history.productType}</td>
            <td>{DateFormats.formatDate(history.sellDate)}</td>
            <td>{history.isInCash ? 'ნაღდი' : 'ბარათით'}</td>
            <td>{Number.isInteger(history.amount) ? history.amount : history.amount.toFixed(3)} {history.quantityType == QuantityType.COUNT ? ' ც' : ' კგ.'}</td>
            <td style="text-align: end;">{(history.sellingPrice * history.amount).toFixed(2)} ₾</td>
            <td style="text-align: end;">{history.sellingPrice.toFixed(2)} ₾</td>
            <td style="text-align: end;">{history.originalPrice.toFixed(2)} ₾</td>
            <td style="text-align: end;">{history.benefit.toFixed(2)} ₾</td>
            <td style="padding-right: 5px;">
                <div class="actionButtonsDiv">
                    <div class="leftTooltipIconDiv" title="{history.description}" style="margin-right: 5px;">
                        <!-- svelte-ignore a11y-missing-attribute -->
                        <input type="image" src="images/info.png" class="actionButtons" width="27px" height="27px">
                    </div>
                    <div class="leftTooltipIconDiv" title="წაშლა" style="margin-right: 5px;">
                        <!-- svelte-ignore a11y-missing-attribute -->
                        <input type="image" src="images/delete.png" class="actionButtons" width="27px" height="27px"
                            on:click={async () => {
                                onDelete(history._id)
                            }}>
                    </div>
                </div>
            </td>
        </tr>
        {/each}
    </tbody>
</table>

<nav aria-label="...">
    <ul class="pagination justify-content-center">
        <li class="page-item">
            <button class="page-link" on:click={onBack}>
                უკან
            </button>
        </li>
        {#each pages as page, i}
                <li class={"page-item " + (marked===page ? "active" : "")}>
                    <button class="page-link" on:click={()=>{marked = page}}>
                        {page}
                    </button>
                </li>
        {/each}
        <li class="page-item">
            <button class="page-link" on:click={onNext}>
                წინ
            </button>
        </li>
    </ul>
</nav>

<HistoryReport
bind:show={show.showHistoryReport}
/>

<DeleteModal
bind:show={deleteModalShow}
bind:submited={deleteModalSubmited}
bind:toDeleteId={toDeleteId}
bind:service={historyService}
/>