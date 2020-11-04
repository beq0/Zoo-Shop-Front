<script>
    import {ProductService} from "../../services/product.service";
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
  
    const productService = ProductService.getInstance();
    const parameterService = ParameterService.getInstance();
  
    let filterCode = null, filterName = null, filterType = null, filterStartPrice = null, filterEndPrice = null,
    filterStartLastChangeDate = null, filterEndlastChangeDate;
    let fileName = "პროდუქტები";
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
    }
    
    async function onSubmit() {
        const columnNames = ['კოდი', 'სახელი', 'ტიპი', 'გაყიდვის ფასი', 'ყიდვის ფასი', 'რაოდენობა', 'რაოდ. ტიპი', 'განახლების თარიღი', 'შექმნის თარიღი'];
        let filters = {
            code: filterCode,
            name: filterName,
            productType: filterType,
            startPrice: filterStartPrice,
            endPrice: filterEndPrice,
            startLastChangeDate: filterStartLastChangeDate,
            endLastChangeDate: filterEndlastChangeDate
        }
        console.log(filters);
        let filteredProducts = await productService.findProducts(filters)
        let content = [[]];
        filteredProducts.forEach(prod => {
            let currRow = [];
            currRow.push(prod.code)
            currRow.push(prod.name)
            currRow.push(prod.productType)
            currRow.push(prod.sellingPrice)
            currRow.push(prod.originalPrice)
            currRow.push(prod.quantity)
            currRow.push(prod.quantityType)
            currRow.push(DateFormats.formatDateTime(prod.lastChangeDate))
            currRow.push(DateFormats.formatDateTime(prod.createDate))
            content.push(currRow);
        })
        ExcelGenerator.saveWithOneSheet("პროდუქტები", "პროდუქტები", "ზ", fileName, fileName, columnNames, content)
        onClose();
    }
  
    function onClose() {
        filterCode = null, filterName=null, filterType=null, filterStartPrice=null, filterEndPrice=null;
        filterStartLastChangeDate = null, filterEndlastChangeDate = null;
        fileName = "პროდუქტები";
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
  
</style>
  
{#if show}
<div class="popup active" id="popup-1">
    <div class="overlay" on:click={onClose}></div>
        <div class="content">  
            <h5 class="modal-title">პროდუქტების რეპორტი</h5>
            <hr>
            <div class="form-group">
                <div>ფაილის სახელი:&emsp;</div>
                <input type="text" class="form-control" bind:value={fileName}>
            </div>
            <div class="form-group">
                <div>კოდი:&emsp;</div>
                <input type="text" class="form-control" bind:value={filterCode}>
            </div>
            <div class="form-group">
                <div>სახელი:&emsp;</div>
                <input type="text" class="form-control" bind:value={filterName}>
            </div>
            <div class="form-group">
                <div>ტიპი:&emsp;</div>
                <select class="form-control" bind:value={filterType}>
                    {#each Object.values(ProductType) as productType}
                    <option>{productType}</option>
                    {/each}
                </select>
            </div>
            <div class="form-group">
                <div>საწყისი&nbsp;ფასი:&emsp;</div>
                <input type="number" class="form-control" bind:value={filterStartPrice}>
            </div>
            <div class="form-group">
                <div>საბოლოო&nbsp;ფასი:&emsp;</div>
                <input type="number" class="form-control" bind:value={filterEndPrice}>
            </div>
            <div class="form-group">
                <div>ცვლილების საწყისი თარიღი:&emsp;</div>
                <input type="datetime-local" class="form-control" id="amount" bind:value={filterStartLastChangeDate}>
            </div>
            <div class="form-group">
                <div>ცვლილების საბოლოო თარიღი:&emsp;</div>
                <input type="datetime-local" class="form-control" id="amount" bind:value={filterEndlastChangeDate}>
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