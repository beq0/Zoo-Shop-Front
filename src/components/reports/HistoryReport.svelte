<script>
    import {HistoryService} from "../../services/history.service";
    import { ParameterService } from "../../services/parameter.service";
    import { onMount } from 'svelte';
    import WarningModal from '../WarningModal.svelte'
    import { ExcelGenerator } from "../../utils/ExcelGenerator";
    import { DateFormats } from "../../utils/DateFormats"
  
    const ParameterType = {
        INTEGER: "რიცხვი",
        STRING: "ტექსტი",
        LIST: "სია"
    }
  
    let ProductType = [
        "სხვა"
    ]
  
    export let show;
  
    const historyService = HistoryService.getInstance();
    const parameterService = ParameterService.getInstance();
  
    let filterProductCode = null, filterProductName = null, filterProductType = 'ყველა', 
    filterBenefitFrom = null, filterBenefitTo = null, filterSellDateFrom = null, filterSellDateTo = null, filterOfficial = true;
    let fileName = "გაყიდვის ისტორია";
    let showWarningModal = false, warningModalMessage = '';
    
    onMount(() => {
        addEventListener("keyup", (event) => {
            if (show && event.key === 'Enter') {
                onSubmit();
            }
            if (show && event.key === 'Escape') {
                onClose();
            }
        });
    
        initializeParameters()
    });
  
    async function initializeParameters() {
        let res = await parameterService.getParameter("productTypes", ParameterType.LIST, ["სხვა"]);
        ProductType = ('' + res.value).split(",");
        ProductType.push('ყველა')
    }
    
    async function onSubmit() {
        const columnNames = ['კოდი', 'სახელი', 'ტიპი', 'გაყიდვის თარიღი', 'გაყიდული რაოდენობა', 'ასაღები ფასი', 'გასაყიდი ფასი', 'მოგება'];
        let filters = {
            productCode: filterProductCode,
            productName: filterProductName,
            productType: filterProductType,
            benefitFrom: filterBenefitFrom,
            benefitTo: filterBenefitTo,
            sellDateFrom: filterSellDateFrom,
            sellDateTo: filterSellDateTo,
            official: filterOfficial
        }
        let filteredHistories = await historyService.findHistories(filters, 0, 0, 0);
        let content = [[]];
        filteredHistories.forEach(history => {
            let currRow = [];
            currRow.push(history.productCode)
            currRow.push(history.productName)
            currRow.push(history.productType)
            currRow.push(DateFormats.formatDate(history.sellDate))
            currRow.push(history.amount)
            currRow.push(history.originalPrice)
            currRow.push(history.sellingPrice)
            currRow.push(history.benefit)
            content.push(currRow);
        })
        ExcelGenerator.saveWithOneSheet("გაყიდვის ისტორია", "გაყიდვის ისტორია", "ზ", fileName, fileName, columnNames, content)
        onClose();
    }
  
    function onClose() {
        filterProductCode = null, filterProductName = null, filterProductType = 'ყველა';
        filterBenefitFrom = null, filterBenefitTo = null, filterSellDateFrom = null, filterSellDateTo = null, filterOfficial = true;
        fileName = "გაყიდვის ისტორია";
        show = false;
    }
  
</script>
  
<style>
    
    .form-group {
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }
  
    .form-control {
        width: 300px;
    }

    #official {
        height: 17px;
        box-shadow: none;
    }
  
</style>
  
{#if show}
<div class="popup active" id="popup-1">
    <div class="overlay" on:click={onClose}></div>
        <div class="content">  
            <h5 class="modal-title">გაყიდვის ისტორიის რეპორტი</h5>
            <hr>
            <div class="form-group">
                <div>ფაილის სახელი:&emsp;</div>
                <input type="text" class="form-control" bind:value={fileName}>
            </div>

            <div class="form-group">
                <div>კოდი:&emsp;</div>
                <input type="text" class="form-control" bind:value={filterProductCode}>
            </div>
            
            <div class="form-group">
                <div>სახელი:&emsp;</div>
                <input type="text" class="form-control" bind:value={filterProductName}>
            </div>
            
            <div class="form-group">
                <div>ტიპი:&emsp;</div>
                <select class="form-control" bind:value={filterProductType}>
                    {#each Object.values(ProductType) as productType}
                    <option>{productType}</option>
                    {/each}
                </select>
            </div>
            
            <div class="form-group">
                <div>საწყისი&nbsp;მოგება:&emsp;</div>
                <input type="number" class="form-control" bind:value={filterBenefitFrom}>
            </div>
            
            <div class="form-group">
                <div>საბოლოო&nbsp;მოგება:&emsp;</div>
                <input type="number" class="form-control" bind:value={filterBenefitTo}>
            </div>
            
            <div class="form-group">
                <div>გაყიდვის საწყისი თარიღი:&emsp;</div>
                <input type="date" class="form-control" id="amount" bind:value={filterSellDateFrom}>
            </div>
            
            <div class="form-group">
                <div>გაყიდვის საბოლოო თარიღი:&emsp;</div>
                <input type="date" class="form-control" id="amount" bind:value={filterSellDateTo}>
            </div>
            
            <div class="form-group">
                <div>ოფიციალური:&emsp;</div>
                <input type="checkbox" class="form-control" id="official" bind:checked={filterOfficial}>
            </div>
            <hr>
            <div>
                <button class="btn btn-primary confirmButton" on:click={onSubmit}>გენერაცია</button>
                <button class="btn btn-primary closeButton" on:click={onClose}>დახურვა</button>
            </div>
    </div>
</div>
{/if}
  
  
<WarningModal
bind:show={showWarningModal}
bind:message={warningModalMessage}
/>