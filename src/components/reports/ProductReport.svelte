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

    const QuantityType = {
        COUNT: "ცალობითი",
        WEIGHT: "წონითი"
    }
  
    export let show;
  
    const productService = ProductService.getInstance();
    const parameterService = ParameterService.getInstance();
  
    let filterCode = null, filterName = null, filterType = 'ყველა', filterStartPrice = null, filterEndPrice = null,
    filterStartLastChangeDate = null, filterEndlastChangeDate = null, filterOfficial = true;
    let fileName = "პროდუქცია";
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
        ProductType.push('ყველა');
    }
    
    async function onSubmit() {
        const columnNames = ['კოდი', 'სახელი',  'პროვ. კოდი', 'პროვ. სახელი', 'ტიპი', 'ჯამური გასაყიდი ფასი', 
        'ჯამური ასაღები ფასი', 'გასაყიდი ფასი', 'ასაღები ფასი', 'რაოდენობა', 'რაოდ. ტიპი', 'ოფიციალური', 
        'განახლების თარიღი', 'შექმნის თარიღი'];
        let filters = {
            code: filterCode,
            name: filterName,
            productType: filterType,
            startPrice: filterStartPrice,
            endPrice: filterEndPrice,
            startLastChangeDate: filterStartLastChangeDate,
            endLastChangeDate: filterEndlastChangeDate,
            official: filterOfficial
        }
        let filteredProducts = await productService.findProducts(filters)
        let content = [[]];
        filteredProducts.forEach(prod => {
            let currRow = [];
            currRow.push(prod.code);
            currRow.push(prod.name);
            currRow.push(prod.providerCode);
            currRow.push(prod.providerName);
            currRow.push(prod.productType);
            currRow.push((prod.sellingPrice * getWholeQuantity(prod)).toFixed(2));
            currRow.push((prod.originalPrice * getWholeQuantity(prod)).toFixed(2));
            currRow.push(prod.sellingPrice);
            currRow.push(prod.originalPrice);
            currRow.push(prod.quantity.reduce((res, qt) => { return res + qt.quantity + 
                                                            (qt.quantityType == QuantityType.COUNT ? 'ც.' : 'კგ.') + 
                                                            ' - ' + qt.originalPrice + '₾; '}, ''));
            currRow.push(prod.quantityType);
            currRow.push(prod.official ? "კი" : "არა");
            currRow.push(DateFormats.formatDateTime(prod.lastChangeDate));
            currRow.push(DateFormats.formatDateTime(prod.createDate));
            content.push(currRow);
        })
        ExcelGenerator.saveWithOneSheet("პროდუქცია", "პროდუქცია", "ზ", fileName, fileName, columnNames, content)
        onClose();
    }
  
    function onClose() {
        filterCode = null, filterName=null, filterType='ყველა', filterStartPrice=null, filterEndPrice=null;
        filterStartLastChangeDate = null, filterEndlastChangeDate = null, filterOfficial = true;
        fileName = "პროდუქცია";
        show = false;
    }

    function getWholeQuantity(prod) {
        return prod.quantity.reduce((sum1, qt) => { return sum1 + qt.quantity}, 0);
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
            <h5 class="modal-title">პროდუქციის რეპორტი</h5>
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